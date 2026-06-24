import { Router, type Request, type Response } from "express";
import { FeedbackService, type FeedbackItem } from "../services/feedback.service.js";

export function createFeedbackRouter(): Router {
  const router = Router();
  const svc = new FeedbackService();

  router.post("/", async (req: Request, res: Response) => {
    const { items } = req.body as { items?: FeedbackItem[] };
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Missing required field: items (non-empty array)" });
      return;
    }
    const valid = items
      .filter((i) => i && typeof i.text === "string" && i.text.trim())
      .map((i) => ({ text: i.text.trim(), area: i.area, severity: i.severity }));
    if (valid.length === 0) {
      res.status(400).json({ error: "No feedback items with non-empty text" });
      return;
    }
    const result = await svc.createBatch(valid);
    res.json(result);
  });

  return router;
}
