import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { AgentRunsService, AGENT_RUN_STATUSES, type AgentRunStatus } from "../services/agentRuns.service.js";

export function createAgentRunsRouter(db: Db): Router {
  const router = Router();
  const svc = new AgentRunsService(db);

  router.get("/", (_req: Request, res: Response) => res.json(svc.list()));

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string };
    if (!b.id) { res.status(400).json({ error: "Missing required field: id" }); return; }
    if (svc.get(b.id)) { res.status(409).json({ error: `Agent run already exists: ${b.id}` }); return; }
    res.status(201).json(svc.create(b as { id: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !AGENT_RUN_STATUSES.includes(status as AgentRunStatus)) {
      res.status(400).json({ error: `status must be one of: ${AGENT_RUN_STATUSES.join(", ")}` });
      return;
    }
    const updated = svc.setStatus(String(req.params["id"]), status as AgentRunStatus);
    if (!updated) { res.status(404).json({ error: "Agent run not found" }); return; }
    res.json(updated);
  });

  return router;
}
