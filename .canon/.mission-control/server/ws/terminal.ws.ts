import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "node:http";
import type { PtyService } from "../services/pty.service.js";
import type { SessionService } from "../services/session.service.js";
import { logger } from "../services/logger.service.js";

/**
 * WebSocket handling for terminal connections.
 * PTY stays alive until the session is stopped or the process exits; a WS
 * disconnect only detaches listeners. Reconnecting reattaches with scrollback replay.
 */
export function setupTerminalWebSocket(
  ptyService: PtyService,
  sessionService: SessionService,
): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      logger.warn("terminal-ws", "Connection rejected: missing sessionId");
      ws.close(4400, "Missing sessionId query parameter");
      return;
    }
    const session = sessionService.getSession(sessionId);
    if (!session) {
      logger.warn("terminal-ws", `Connection rejected: session not found: ${sessionId}`);
      ws.close(4404, "Session not found");
      return;
    }

    logger.info("terminal-ws", `Terminal WS connected for session ${sessionId}`);

    let isNewPty = false;
    if (!ptyService.get(sessionId)) {
      const shell = process.platform === "win32"
        ? "powershell.exe"
        : (process.env["SHELL"] ?? "/bin/bash");
      try {
        const instance = ptyService.create(sessionId, {
          command: shell,
          args: [],
          cwd: session.cwd ?? undefined,
          cols: 120,
          rows: 30,
        });
        isNewPty = true;
        logger.info("terminal-ws", `PTY created for session ${sessionId}`, { pid: instance.process.pid });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("terminal-ws", `Failed to create PTY for session ${sessionId}`, { error: message });
        ws.close(4500, "Failed to create PTY");
        return;
      }
    } else {
      logger.info("terminal-ws", `Reattaching to existing PTY for session ${sessionId}`);
      const ptyInst = ptyService.get(sessionId);
      if (ptyInst && ptyInst.scrollback.length > 0) {
        for (const chunk of ptyInst.scrollback) {
          if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
        }
        logger.info("terminal-ws", `Replayed ${ptyInst.scrollback.length} scrollback chunks for ${sessionId}`);
      }
    }

    // After the shell initializes, type the full claude command as a single CLI invocation.
    // Accepts: `claude "/viral-generate <id>"`, `claude --resume <uuid>`, `claude --resume <uuid> "<directive>"`.
    if (isNewPty && session.command) {
      const command = session.command;
      let fullCmd: string;
      if (command.startsWith("--")) {
        const resumeMatch = command.match(/^--resume\s+([0-9a-f-]+)(?:\s+--\s+(.+))?$/i);
        if (resumeMatch) {
          const directive = resumeMatch[2];
          fullCmd = directive
            ? `claude --resume ${resumeMatch[1]} "${directive.replace(/"/g, '\\"')}"`
            : `claude --resume ${resumeMatch[1]}`;
        } else {
          fullCmd = `claude ${command}`;
        }
      } else {
        fullCmd = `claude "${command.replace(/"/g, '\\"')}"`;
      }
      setTimeout(() => {
        try { ptyService.write(sessionId, `${fullCmd}\r`); } catch { /* PTY may have exited */ }
      }, 800);
    }

    const onData = (event: { sessionId: string; data: string }) => {
      if (event.sessionId !== sessionId) return;
      if (ws.readyState === WebSocket.OPEN) ws.send(event.data);
    };
    const onExit = (event: { sessionId: string; exitCode: number; signal?: number }) => {
      if (event.sessionId !== sessionId) return;
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "exit", exitCode: event.exitCode }));
    };
    ptyService.on("data", onData);
    ptyService.on("exit", onExit);

    ws.on("message", (raw: Buffer | string) => {
      const text = raw instanceof Buffer ? raw.toString("utf8") : String(raw);
      try {
        const msg = JSON.parse(text) as { type?: string; data?: string; cols?: string; rows?: string };
        if (msg.type === "data" && typeof msg.data === "string") {
          ptyService.write(sessionId, msg.data);
        } else if (msg.type === "resize") {
          const cols = Math.max(1, parseInt(String(msg.cols), 10) || 80);
          const rows = Math.max(1, parseInt(String(msg.rows), 10) || 24);
          ptyService.resize(sessionId, cols, rows);
        }
      } catch {
        try { ptyService.write(sessionId, text); } catch { /* PTY gone */ }
      }
    });

    ws.on("close", () => {
      logger.info("terminal-ws", `Terminal WS disconnected for session ${sessionId} (PTY kept alive)`);
      ptyService.off("data", onData);
      ptyService.off("exit", onExit);
    });

    ws.on("error", (err) => {
      logger.error("terminal-ws", `Terminal WS error for session ${sessionId}`, { error: err.message });
    });
  });

  return wss;
}
