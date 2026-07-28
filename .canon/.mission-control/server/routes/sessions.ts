import { Router, type Request, type Response } from "express";
import type { Db } from "../db.js";
import type { SessionService } from "../services/session.service.js";
import { CampaignsService } from "../services/campaigns.service.js";
import { AgentRunsService } from "../services/agentRuns.service.js";
import { ClaudeSessionsService } from "../services/claude-sessions.service.js";
import { logger } from "../services/logger.service.js";

export const AGENTS_CWD = "D:\\VFXellence-LTD\\polymath\\packages\\agents";
const UUID_BACKFILL_DELAY_MS = 6_000;

export interface SessionsRouterDeps {
  db: Db;
  sessions: SessionService;
  /** Injected in tests; defaults to a real scanner. */
  claudeSessions?: ClaudeSessionsService;
}

export function createSessionsRouter(deps: SessionsRouterDeps): Router {
  const router = Router();
  const campaigns = new CampaignsService(deps.db);
  const runs = new AgentRunsService(deps.db);
  const claudeSessions = deps.claudeSessions ?? new ClaudeSessionsService();

  router.post("/start", (req: Request, res: Response) => {
    const b = req.body as { campaignId?: string; taskId?: string };
    if (!b.campaignId && !b.taskId) {
      res.status(400).json({ error: "Missing required field: campaignId or taskId" });
      return;
    }
    // Campaign-driven start enforces the Plan-1 approval gate.
    if (b.campaignId) {
      const camp = campaigns.get(b.campaignId);
      if (!camp) { res.status(404).json({ error: `Campaign not found: ${b.campaignId}` }); return; }
      if (!camp.approvedBy) { res.status(409).json({ error: "Campaign must be approved before running" }); return; }
    }
    const command = b.campaignId ? `/viral-generate ${b.campaignId}` : "/viral-continue";
    try {
      const session = deps.sessions.startSession({
        command,
        cwd: AGENTS_CWD,
        campaignId: b.campaignId,
        taskId: b.taskId,
      });
      // Fire-and-forget: backfill claude_session_id once the transcript exists, for --resume.
      if (b.campaignId) {
        const campaignId = b.campaignId;
        setTimeout(() => {
          claudeSessions
            .findSessionForCampaign(campaignId, AGENTS_CWD)
            .then((uuid) => {
              if (uuid) {
                deps.db.raw
                  .prepare("UPDATE agent_runs SET claude_session_id=? WHERE id=?")
                  .run(uuid, session.id);
                logger.info("sessions", `Backfilled claude_session_id for ${session.id}`, { uuid });
              }
            })
            .catch((err: unknown) => logger.warn("sessions", "UUID backfill failed", {
              error: err instanceof Error ? err.message : String(err),
            }));
        }, UUID_BACKFILL_DELAY_MS);
      }
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  router.get("/", (_req: Request, res: Response) => {
    res.json(deps.sessions.listSessions());
  });

  router.post("/:id/stop", (req: Request, res: Response) => {
    const id = String(req.params["id"]);
    // DB-authoritative: stopSession handles both live (Map) sessions and orphaned
    // agent_runs rows left behind by a server restart. It returns false only when
    // the id exists in neither the live Map nor the durable agent_runs table.
    const stopped = deps.sessions.stopSession(id);
    if (!stopped) { res.status(404).json({ error: "Session not found" }); return; }
    const run = runs.get(id);
    res.json(run ?? { id, status: "done" });
  });

  return router;
}
