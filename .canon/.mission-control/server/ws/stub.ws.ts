import { WebSocketServer } from "ws";
import type { Server } from "node:http";

/**
 * STUB ONLY (Plan 1). Accepts upgrades on /ws and holds the connection open.
 * No event wiring — full WebSocket broadcast lands in a later plan.
 */
export function setupWebSocketStub(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });
  wss.on("connection", () => {
    /* intentionally empty — stub */
  });
  httpServer.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    if (url.pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    } else {
      socket.destroy();
    }
  });
  return wss;
}
