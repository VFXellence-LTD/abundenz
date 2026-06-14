import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { PublishService } from "../services/publish.service.js";

export function createPublishRouter(db: Db): Router {
  const router = Router();
  const svc = new PublishService(db, process.env as Record<string, string | undefined>);

  router.post("/", async (req: Request, res: Response) => {
    const { approvalId, publishedBy } = req.body as { approvalId?: string; publishedBy?: string };
    if (!approvalId) {
      res.status(400).json({ error: "Missing required field: approvalId" });
      return;
    }
    const result = await svc.publish(approvalId, publishedBy ?? "boss");
    if ("missing" in result && result.missing) {
      res.status(404).json({ error: "Approval not found" });
      return;
    }
    if ("conflict" in result && result.conflict) {
      res.status(409).json({
        error: "Approval must be an approved video",
        reason: (result as { conflict: true; reason?: string }).reason,
      });
      return;
    }
    res.json(result);
  });

  return router;
}
