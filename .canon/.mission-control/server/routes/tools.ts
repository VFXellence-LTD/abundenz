import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { ToolsService, TOOL_STATUSES, type ToolStatus } from "../services/tools.service.js";
import { seedTools } from "../seed.js";

export function createToolsRouter(db: Db): Router {
  const router = Router();
  seedTools(db); // seed on mount if empty
  const svc = new ToolsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !TOOL_STATUSES.includes(status as ToolStatus)) {
      res.status(400).json({ error: `status must be one of: ${TOOL_STATUSES.join(", ")}` });
      return;
    }
    const updated = svc.updateStatus(String(req.params["id"]), status as ToolStatus);
    if (!updated) {
      res.status(404).json({ error: `Tool not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  return router;
}
