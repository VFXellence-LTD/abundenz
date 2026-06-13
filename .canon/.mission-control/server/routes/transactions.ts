import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { TransactionsService, type NewTransaction } from "../services/transactions.service.js";

const REQUIRED: (keyof NewTransaction)[] = ["date", "amount", "ecosystemId", "stream", "description", "type"];

export function createTransactionsRouter(db: Db): Router {
  const router = Router();
  const svc = new TransactionsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewTransaction>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewTransaction));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/import", (req: Request, res: Response) => {
    const body = req.body;
    if (!Array.isArray(body)) {
      res.status(400).json({ error: "Body must be an array of transactions" });
      return;
    }
    try {
      res.status(201).json(svc.importMany(body as NewTransaction[]));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(String(req.params["id"]), req.body as Partial<NewTransaction>);
    if (!updated) {
      res.status(404).json({ error: `Transaction not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(String(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Transaction not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
