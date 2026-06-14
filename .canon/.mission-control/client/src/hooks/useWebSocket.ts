import { useEffect, useRef, useState, useCallback } from "react";

export interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  scope: string;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

type WsMessage = {
  type: "status" | "log";
  sessionId?: string;
  status?: string;
  entry?: LogEntry;
};

type Listener = (msg: WsMessage) => void;
const RECONNECT_DELAY_MS = 3000;

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef<Set<Listener>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  const connect = useCallback(() => {
    if (unmountedRef.current) return;
    const isDev = window.location.port === "5174";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = isDev ? `${window.location.hostname}:4500` : window.location.host;
    const url = `${protocol}//${host}/ws`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => { if (!unmountedRef.current) setConnected(true); };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        for (const listener of listenersRef.current) listener(msg);
      } catch { /* ignore malformed */ }
    };
    ws.onclose = () => {
      wsRef.current = null;
      if (!unmountedRef.current) {
        setConnected(false);
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };
    ws.onerror = () => { ws.close(); };
  }, []);

  useEffect(() => {
    unmountedRef.current = false;
    connect();
    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    };
  }, [connect]);

  const subscribe = useCallback((fn: Listener): (() => void) => {
    listenersRef.current.add(fn);
    return () => { listenersRef.current.delete(fn); };
  }, []);

  return { connected, subscribe };
}
