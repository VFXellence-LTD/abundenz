import express, { type Express } from "express";
import cors from "cors";
import http from "node:http";
import { config } from "./config.js";
import { getDb, type Db } from "./db.js";
import { createTransactionsRouter } from "./routes/transactions.js";
import { createToolsRouter } from "./routes/tools.js";
import { createSetupRouter } from "./routes/setup.js";
import { createLaunchRouter } from "./routes/launch.js";
import { createTasksRouter } from "./routes/tasks.js";
import { createCampaignsRouter } from "./routes/campaigns.js";
import { createApprovalsRouter } from "./routes/approvals.js";
import { createArtifactsRouter } from "./routes/artifacts.js";
import { createAgentRunsRouter } from "./routes/agentRuns.js";
import { createVaultRouter } from "./routes/vault.js";
import { createPublishRouter } from "./routes/publish.js";
import { createBugReportRouter } from "./routes/bug-report.js";
import { createFeedbackRouter } from "./routes/feedback.js";
import { createBrandsRouter } from "./routes/brands.js";
import { createPlatformAccountsRouter } from "./routes/platform-accounts.js";
import { VaultService } from "./services/vault.service.js";
import { PtyService } from "./services/pty.service.js";
import { SessionService } from "./services/session.service.js";
import { AgentRunsService } from "./services/agentRuns.service.js";
import { createSessionsRouter } from "./routes/sessions.js";
import { setupTerminalWebSocket } from "./ws/terminal.ws.js";
import { setupSessionsWebSocket } from "./ws/sessions.ws.js";

export interface AppDeps {
  db: Db;
  vaultLaunchesDir: string;
  sessions: SessionService;
  artifactsRoot?: string;
}

export function createApp(deps: AppDeps): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/transactions", createTransactionsRouter(deps.db));
  app.use("/api/tools", createToolsRouter(deps.db));
  app.use("/api/setup", createSetupRouter(deps.db));
  app.use("/api/launch", createLaunchRouter(deps.db));
  app.use("/api/tasks", createTasksRouter(deps.db));
  app.use("/api/campaigns", createCampaignsRouter(deps.db));
  app.use("/api/approvals", createApprovalsRouter(deps.db));
  app.use("/api/artifacts", createArtifactsRouter(deps.db, deps.artifactsRoot ?? config.artifactsRoot));
  app.use("/api/agent-runs", createAgentRunsRouter(deps.db));
  app.use("/api/vault", createVaultRouter(new VaultService(deps.vaultLaunchesDir)));
  app.use("/api/sessions", createSessionsRouter({ db: deps.db, sessions: deps.sessions }));
  app.use("/api/publish", createPublishRouter(deps.db));
  app.use("/api/bug-report", createBugReportRouter());
  app.use("/api/feedback", createFeedbackRouter());
  app.use("/api/brands", createBrandsRouter(deps.db));
  app.use("/api/platform-accounts", createPlatformAccountsRouter(deps.db));

  return app;
}

export async function startServer(): Promise<void> {
  const db = getDb(config.dbPath);
  const ptyService = new PtyService();
  const sessions = new SessionService(new AgentRunsService(db));
  sessions.setPtyService(ptyService);

  const app = createApp({ db, vaultLaunchesDir: config.vaultLaunchesDir, sessions });
  const httpServer = http.createServer(app);

  const terminalWss = setupTerminalWebSocket(ptyService, sessions);
  const statusWss = setupSessionsWebSocket(sessions);
  httpServer.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    if (url.pathname === "/ws/terminal") {
      terminalWss.handleUpgrade(req, socket, head, (ws) => terminalWss.emit("connection", ws, req));
    } else if (url.pathname === "/ws") {
      statusWss.handleUpgrade(req, socket, head, (ws) => statusWss.emit("connection", ws, req));
    } else {
      socket.destroy();
    }
  });

  httpServer.listen(config.port, () => {
    console.log(`Polymath Mission Control server running on port ${config.port}`);
    console.log(`DB: ${config.dbPath}`);
  });

  const shutdown = () => {
    ptyService.killAll();
    sessions.stopIdleDetection();
    db.close();
    httpServer.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Start only when run directly (not when imported by tests).
const entry = process.argv[1] ?? "";
if (entry.endsWith("index.ts") || entry.endsWith("index.js")) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
