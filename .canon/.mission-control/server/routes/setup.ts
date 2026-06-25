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

  router.get("/data/:ecosystemId", (req: Request, res: Response) => {
    try {
      res.json(svc.getData(req.params.ecosystemId));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/data", (req: Request, res: Response) => {
    const { ecosystemId, stepId, fieldKey, value } = req.body as {
      ecosystemId?: string; stepId?: string; fieldKey?: string; value?: string;
    };
    if (
      typeof ecosystemId !== "string" || !ecosystemId ||
      typeof stepId !== "string" || !stepId ||
      typeof fieldKey !== "string" || !fieldKey ||
      typeof value !== "string"
    ) {
      res.status(400).json({ error: "Missing/invalid fields: ecosystemId, stepId, fieldKey, value" });
      return;
    }
    try {
      svc.setField(ecosystemId, stepId, fieldKey, value);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
