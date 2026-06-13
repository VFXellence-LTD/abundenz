import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { LaunchService } from "../services/launch.service.js";

export function createLaunchRouter(db: Db): Router {
  const router = Router();
  const svc = new LaunchService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json({ progress: svc.getState(), data: svc.getData() });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/toggle", (req: Request, res: Response) => {
    const { verticalKey, stepId } = req.body as { verticalKey?: string; stepId?: string };
    if (!verticalKey || !stepId) {
      res.status(400).json({ error: "Missing required fields: verticalKey, stepId" });
      return;
    }
    try {
      res.json({ progress: svc.toggleStep(verticalKey, stepId), data: svc.getData() });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/field", (req: Request, res: Response) => {
    const { verticalKey, fieldKey, value } = req.body as {
      verticalKey?: string;
      fieldKey?: string;
      value?: string;
    };
    if (!verticalKey || !fieldKey) {
      res.status(400).json({ error: "Missing required fields: verticalKey, fieldKey" });
      return;
    }
    try {
      res.json({ progress: svc.getState(), data: svc.setField(verticalKey, fieldKey, value ?? "") });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  return router;
}
