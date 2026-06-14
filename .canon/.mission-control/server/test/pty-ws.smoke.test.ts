import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "node:http";
import { WebSocket } from "ws";
import { AddressInfo } from "node:net";
import { PtyService } from "../services/pty.service.js";
import { SessionService } from "../services/session.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { createDb, type Db } from "../db.js";
import { setupTerminalWebSocket } from "../ws/terminal.ws.js";

const RUN = process.env["MC_PTY_SMOKE"] === "1";
const d = RUN ? describe : describe.skip;

d("PTY <-> /ws/terminal smoke (harmless echo, no claude)", () => {
  let server: http.Server; let pty: PtyService; let db: Db; let port: number;
  const MARKER = "POLYMATH_SMOKE_OK";

  beforeAll(async () => {
    db = createDb(":memory:");
    pty = new PtyService();
    const sessions = new SessionService(new AgentRunsService(db));
    sessions.setPtyService(pty);
    const wss = setupTerminalWebSocket(pty, sessions);

    // Register a session record (so the WS accepts the connection) WITHOUT a surge command:
    // we pre-spawn the PTY ourselves with a harmless echo so the bridge reattaches & streams.
    const id = "smoke-session";
    (sessions as unknown as { sessions: Map<string, unknown> }).sessions.set(id, {
      id, command: "/surge-continue", cwd: process.cwd(),
      campaignId: null, taskId: null, status: "running",
      startedAt: new Date().toISOString(), endedAt: null,
    });
    const shell = process.platform === "win32" ? "cmd.exe" : "sh";
    const args = process.platform === "win32" ? ["/c", `echo ${MARKER}`] : ["-c", `echo ${MARKER}`];
    pty.create(id, { command: shell, args });

    server = http.createServer();
    server.on("upgrade", (req, socket, head) => {
      const url = new URL(req.url ?? "", `http://${req.headers.host}`);
      if (url.pathname === "/ws/terminal") wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
      else socket.destroy();
    });
    await new Promise<void>((r) => server.listen(0, r));
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => { pty.killAll(); server.close(); db.close(); });

  it("streams the echoed marker over the WebSocket", async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws/terminal?sessionId=smoke-session`);
    ws.binaryType = "arraybuffer";
    const received = await new Promise<string>((resolve, reject) => {
      let buf = "";
      const timer = setTimeout(() => reject(new Error(`marker not seen; got: ${buf}`)), 8000);
      ws.on("message", (data: ArrayBuffer | Buffer | string) => {
        buf += typeof data === "string" ? data : Buffer.from(data as ArrayBuffer).toString("utf8");
        if (buf.includes(MARKER)) { clearTimeout(timer); ws.close(); resolve(buf); }
      });
      ws.on("error", reject);
    });
    expect(received).toContain(MARKER);
  }, 15000);
});
