import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import { TasksService, TASK_STATUSES, type TaskStatus } from "../services/tasks.service.js";

export function createTasksRouter(db: Db): Router {
  const router = Router();
  const svc = new TasksService(db);

  router.get("/", (req: Request, res: Response) => {
    const eco = req.query["ecosystem"] as string | undefined;
    res.json(svc.list(eco === "*" || eco === "all" ? undefined : eco));
  });

  router.post("/", (req: Request, res: Response) => {
    const b = req.body as { id?: string; title?: string; type?: string; ecosystemId?: string };
    if (!b.id || !b.title || !b.type || !b.ecosystemId) {
      res.status(400).json({ error: "Missing required fields: id, title, type, ecosystemId" });
      return;
    }
    if (svc.get(b.id)) {
      res.status(409).json({ error: `Task already exists: ${b.id}` });
      return;
    }
    res.status(201).json(svc.create(b as { id: string; title: string; type: string; ecosystemId: string }));
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const id = String(req.params["id"]);
    const status = (req.body as { status?: string }).status;
    if (!status || !TASK_STATUSES.includes(status as TaskStatus)) {
      res.status(400).json({ error: `status must be one of: ${TASK_STATUSES.join(", ")}` });
      return;
    }
    if (!svc.get(id)) { res.status(404).json({ error: `Task not found: ${id}` }); return; }
    if (status === "done" && svc.hasPendingApproval(id)) {
      res.status(409).json({ error: "Cannot complete task with a pending approval" });
      return;
    }
    res.json(svc.setStatus(id, status as TaskStatus));
  });

  return router;
}
