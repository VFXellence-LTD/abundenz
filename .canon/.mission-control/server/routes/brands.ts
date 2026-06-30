import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { BrandsService, type NewBrand } from "../services/brands.service.js";

const REQUIRED: (keyof NewBrand)[] = ["name", "ecosystemId"];

export function createBrandsRouter(db: Db): Router {
  const router = Router();
  const svc = new BrandsService(db);

  router.get("/", (_req: Request, res: Response) => {
    try {
      res.json(svc.list());
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.post("/", (req: Request, res: Response) => {
    const body = req.body as Partial<NewBrand>;
    const missing = REQUIRED.filter((k) => body[k] === undefined || body[k] === null || body[k] === "");
    if (missing.length) {
      res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
      return;
    }
    try {
      res.status(201).json(svc.create(body as NewBrand));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  router.get("/:id", (req: Request, res: Response) => {
    const brand = svc.get(String(req.params["id"]));
    if (!brand) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json(brand);
  });

  router.put("/:id", (req: Request, res: Response) => {
    const updated = svc.update(String(req.params["id"]), req.body as Partial<NewBrand>);
    if (!updated) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json(updated);
  });

  router.delete("/:id", (req: Request, res: Response) => {
    const ok = svc.remove(String(req.params["id"]));
    if (!ok) {
      res.status(404).json({ error: `Brand not found: ${req.params["id"]}` });
      return;
    }
    res.json({ ok: true });
  });

  return router;
}
