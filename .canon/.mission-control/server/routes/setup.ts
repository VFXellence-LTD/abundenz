import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { SetupService } from "../services/setup.service.js";

export function createSetupRouter(db: Db): Router {
  const router = Router();
  const svc = new SetupService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.getProgress());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/toggle", (req: Request, res: Response) => {
    const stepId = (req.body as { stepId?: string }).stepId;
    if (!stepId || typeof stepId !== "string") {
      res.status(400).json({ error: "Missing required field: stepId" });
      return;
    }
    try {
      res.json(svc.toggle(stepId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
