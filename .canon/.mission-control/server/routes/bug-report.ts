import { Router, type Request, type Response } from "express";
import { BugReportService, type BugReportPayload } from "../services/bug-report.service.js";

export function createBugReportRouter(): Router {
  const router = Router();
  const svc = new BugReportService();

  router.post("/", async (req: Request, res: Response) => {
    const { title, description, area, severity } = req.body as BugReportPayload;
    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "Missing required field: title" });
      return;
    }
    const result = await svc.create({ title: title.trim(), description, area, severity });
    res.json(result);
  });

  return router;
}
