import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "node:http";
import { WebSocket } from "ws";
import { AddressInfo } from "node:net";
import { createDb, type Db } from "../db.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { SessionService } from "../services/session.service.js";
import { setupSessionsWebSocket } from "../ws/sessions.ws.js";

describe("/ws status broadcast", () => {
  let server: http.Server; let port: number; let db: Db; let sessions: SessionService;
  beforeAll(async () => {
    db = createDb(":memory:");
    sessions = new SessionService(new AgentRunsService(db));
    const wss = setupSessionsWebSocket(sessions);
    server = http.createServer();
    server.on("upgrade", (req, socket, head) => {
      const url = new URL(req.url ?? "", `http://${req.headers.host}`);
      if (url.pathname === "/ws") wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
      else socket.destroy();
    });
    await new Promise<void>((r) => server.listen(0, r));
    port = (server.address() as AddressInfo).port;
  });
  afterAll(() => { sessions.stopIdleDetection(); server.close(); db.close(); });

  it("broadcasts a status event when a session emits status", async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
    const msg = await new Promise<{ type: string; status: string }>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("no status broadcast")), 5000);
      ws.on("open", () => sessions.emit("status", { sessionId: "x", status: "running" }));
      ws.on("message", (d) => {
        try {
          const m = JSON.parse(String(d));
          if (m.type === "status") { clearTimeout(timer); ws.close(); resolve(m); }
        } catch { /* ignore non-JSON */ }
      });
      ws.on("error", reject);
    });
    expect(msg).toMatchObject({ type: "status", status: "running" });
  }, 8000);
});
