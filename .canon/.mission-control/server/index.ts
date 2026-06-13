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
import { createAgentRunsRouter } from "./routes/agentRuns.js";
import { createVaultRouter } from "./routes/vault.js";
import { VaultService } from "./services/vault.service.js";
import { setupWebSocketStub } from "./ws/stub.ws.js";

export interface AppDeps {
  db: Db;
  vaultLaunchesDir: string;
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
  app.use("/api/agent-runs", createAgentRunsRouter(deps.db));
  app.use("/api/vault", createVaultRouter(new VaultService(deps.vaultLaunchesDir)));

  return app;
}

export async function startServer(): Promise<void> {
  const db = getDb(config.dbPath);
  const app = createApp({ db, vaultLaunchesDir: config.vaultLaunchesDir });
  const httpServer = http.createServer(app);
  setupWebSocketStub(httpServer); // stub only

  httpServer.listen(config.port, () => {
    console.log(`Polymath Mission Control server running on port ${config.port}`);
    console.log(`DB: ${config.dbPath}`);
  });

  const shutdown = () => {
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
