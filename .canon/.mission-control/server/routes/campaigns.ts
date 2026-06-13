import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { CampaignsService, CAMPAIGN_STATUSES, type CampaignStatus } from "../services/campaigns.service.js";

export function createCampaignsRouter(db: Db): Router {
  const router = Router();
  const svc = new CampaignsService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list(eco === "*" || eco === "all" ? undefined : eco));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string; name?: string; ecosystemId?: string };
    if (!b.id || !b.name || !b.ecosystemId) {
      res.status(400).json({ error: "Missing required fields: id, name, ecosystemId" });
      return;
    }
    if (svc.get(b.id)) { res.status(409).json({ error: `Campaign already exists: ${b.id}` }); return; }
    res.status(201).json(svc.create(b as { id: string; name: string; ecosystemId: string }));
  });

  router.post("/:id/approve", (req: Request, res: Response) => {
    const approvedBy = (req.body as { approvedBy?: string }).approvedBy;
    if (!approvedBy) { res.status(400).json({ error: "Missing required field: approvedBy" }); return; }
    const updated = svc.approve(String(req.params["id"]), approvedBy);
    if (!updated) { res.status(404).json({ error: "Campaign not found" }); return; }
    res.json(updated);
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const status = (req.body as { status?: string }).status;
    if (!status || !CAMPAIGN_STATUSES.includes(status as CampaignStatus)) {
      res.status(400).json({ error: `status must be one of: ${CAMPAIGN_STATUSES.join(", ")}` });
      return;
    }
    const result = svc.setStatus(String(req.params["id"]), status as CampaignStatus);
    if (result.missing) { res.status(404).json({ error: "Campaign not found" }); return; }
    if (result.gate) { res.status(409).json({ error: "Campaign must be approved before running" }); return; }
    res.json(result.campaign);
  });

  return router;
}
