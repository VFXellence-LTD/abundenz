import { WebSocketServer, WebSocket } from "ws";
import type { SessionService } from "../services/session.service.js";
import { logger, type LogEntry } from "../services/logger.service.js";

interface WsStatusEvent { sessionId: string; status: string; }

function broadcast(wss: WebSocketServer, message: string): void {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  }
}

export function setupSessionsWebSocket(sessionService: SessionService): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  const onStatus = (event: WsStatusEvent) => {
    broadcast(wss, JSON.stringify({ type: "status", sessionId: event.sessionId, status: event.status }));
  };
  const onLog = (entry: LogEntry) => {
    broadcast(wss, JSON.stringify({ type: "log", entry }));
  };

  sessionService.on("status", onStatus);
  logger.on("log", onLog);

  wss.on("connection", () => { /* clients receive broadcasts; no per-client subscription */ });
  wss.on("close", () => {
    sessionService.off("status", onStatus);
    logger.off("log", onLog);
  });

  return wss;
}
