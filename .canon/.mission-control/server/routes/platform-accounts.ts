import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import {
  PlatformAccountsService,
  type NewPlatformAccount,
  type AccountFilter,
} from "../services/platform-accounts.service.js";

const REQUIRED: (keyof NewPlatformAccount)[] = ["platform"];

export function createPlatformAccountsRouter(db: Db): Router {
  const router = Router();
  const svc = new PlatformAccountsService(db);

  router.get("/", (req: Request, res: Response) => {
    try {
      const brandIdParam = req.query["brandId"];
      let filter: AccountFilter | undefined;
      if (typeof brandIdParam === "string") {
        filter = { brandId: brandIdParam === "none" ? null : brandIdParam };
      }
      res.json(svc.list(filter));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewPlatformAccount>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewPlatformAccount));
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  router.get("/:id", (req: Request, res: Response) => {
    const acct = svc.get(Number(req.params["id"]));
    if (!acct) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json(acct);
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(Number(req.params["id"]), req.body as Partial<NewPlatformAccount>);
    if (!updated) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(Number(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Platform account not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
