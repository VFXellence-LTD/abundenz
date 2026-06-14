import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "xterm/css/xterm.css";

interface EmbeddedTerminalProps {
  sessionId: string;
  onReady?: () => void;
  onExit?: (exitCode: number) => void;
  onTitleChange?: (title: string) => void;
}

export function EmbeddedTerminal({ sessionId, onReady, onExit, onTitleChange }: EmbeddedTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onExitRef = useRef(onExit);
  const onTitleChangeRef = useRef(onTitleChange);
  onReadyRef.current = onReady;
  onTitleChangeRef.current = onTitleChange;
  onExitRef.current = onExit;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sessionId) return;

    let term: Terminal | null = null;
    let ws: WebSocket | null = null;
    let fitAddon: FitAddon | null = null;
    let onDataDisposable: { dispose(): void } | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function init() {
      if (cancelled || !container) return;
      term = new Terminal({
        theme: {
          background: "#181818", foreground: "#dddddd", cursor: "#6366f1",
          selectionBackground: "#6366f140", black: "#121212", red: "#ef4444",
          green: "#22c55e", yellow: "#f59e0b", blue: "#6366f1", magenta: "#a855f7",
          cyan: "#06b6d4", white: "#fafafa", brightBlack: "#52525b", brightRed: "#f87171",
          brightGreen: "#4ade80", brightYellow: "#fbbf24", brightBlue: "#818cf8",
          brightMagenta: "#c084fc", brightCyan: "#22d3ee", brightWhite: "#ffffff",
        },
        fontFamily: "JetBrains Mono, Cascadia Code, Fira Code, Consolas, monospace",
        fontSize: 13, lineHeight: 1.3, cursorBlink: true, cursorStyle: "bar",
        scrollback: 10000, cols: 80, rows: 24,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());
      term.open(container);
      term.onTitleChange((title) => { if (title && onTitleChangeRef.current) onTitleChangeRef.current(title); });
      try { fitAddon.fit(); } catch { /* will fit on resize */ }

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const port = parseInt(window.location.port, 10);
      const isDev = port === 5174;
      const wsHost = isDev ? `${window.location.hostname}:4500` : window.location.host;
      const wsUrl = `${wsProtocol}//${wsHost}/ws/terminal?sessionId=${encodeURIComponent(sessionId)}`;

      const currentFit = fitAddon;
      const currentTerm = term;
      let reconnectAttempts = 0;
      const MAX_RECONNECT_ATTEMPTS = 20;

      function sendResize() {
        try {
          if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) return;
          currentFit.fit();
          const dims = currentFit.proposeDimensions();
          if (dims && dims.cols > 10 && dims.rows > 2 && ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }));
          }
        } catch { /* fit not ready */ }
      }

      function connectWs() {
        if (cancelled) return;
        ws = new WebSocket(wsUrl);
        ws.binaryType = "arraybuffer";
        const currentWs = ws;

        currentWs.addEventListener("open", () => { reconnectAttempts = 0; sendResize(); onReadyRef.current?.(); });
        currentWs.addEventListener("message", (event) => {
          if (event.data instanceof ArrayBuffer) {
            currentTerm.write(new Uint8Array(event.data));
          } else {
            try {
              const msg = JSON.parse(event.data as string);
              if (msg.type === "exit") {
                currentTerm.writeln(`\r\n\x1b[90m[Process exited with code ${msg.exitCode}]\x1b[0m`);
                onExitRef.current?.(msg.exitCode as number);
                return;
              }
            } catch { /* raw output */ }
            currentTerm.write(event.data as string);
          }
        });
        currentWs.addEventListener("close", (event) => {
          if (cancelled) return;
          if (event.code === 4404) {
            currentTerm.writeln("\r\n\x1b[90m[Session expired — start a new session]\x1b[0m");
            return;
          }
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 10000);
            reconnectAttempts++;
            reconnectTimer = setTimeout(connectWs, delay);
          } else {
            currentTerm.writeln("\r\n\x1b[90m[Terminal disconnected — reload to reconnect]\x1b[0m");
          }
        });
      }

      connectWs();

      onDataDisposable = currentTerm.onData((data) => {
        if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "data", data }));
      });

      let resizeDebounce: ReturnType<typeof setTimeout> | null = null;
      resizeObserver = new ResizeObserver(() => {
        if (resizeDebounce) clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(sendResize, 50);
      });
      resizeObserver.observe(container);
    }

    if (container.offsetHeight > 0 && container.offsetWidth > 0) {
      init();
    } else {
      const interval = setInterval(() => {
        if (cancelled) { clearInterval(interval); return; }
        if (container.offsetHeight > 0 && container.offsetWidth > 0) { clearInterval(interval); init(); }
      }, 50);
    }

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      resizeObserver?.disconnect();
      onDataDisposable?.dispose();
      ws?.close();
      term?.dispose();
    };
  }, [sessionId]);

  return <div ref={containerRef} className="w-full h-full overflow-hidden" style={{ minHeight: 200 }} />;
}
