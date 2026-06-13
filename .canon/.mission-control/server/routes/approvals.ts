import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { ApprovalsService, APPROVAL_STATUSES, type ApprovalStatus } from "../services/approvals.service.js";

export function createApprovalsRouter(db: Db): Router {
  const router = Router();
  const svc = new ApprovalsService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list({
      ecosystemId: eco === "*" || eco === "all" ? undefined : eco,
      status: req.query["status"] as string | undefined,
    }));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { ecosystemId?: string };
    if (!b.ecosystemId) { res.status(400).json({ error: "Missing required field: ecosystemId" }); return; }
    res.status(201).json(svc.create(b as { ecosystemId: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const { status, reviewedBy, reviewNotes } = req.body as { status?: string; reviewedBy?: string; reviewNotes?: string };
    if (!status || !APPROVAL_STATUSES.includes(status as ApprovalStatus)) {
      res.status(400).json({ error: `status must be one of: ${APPROVAL_STATUSES.join(", ")}` });
      return;
    }
    const result = svc.setStatus(String(req.params["id"]), status as ApprovalStatus, reviewedBy, reviewNotes);
    if (result.missing) { res.status(404).json({ error: "Approval not found" }); return; }
    if (result.terminal) { res.status(409).json({ error: "Approval is already in a terminal state" }); return; }
    res.json(result.approval);
  });

  return router;
}
