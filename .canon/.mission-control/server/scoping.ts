import type Database from "better-sqlite3";
import type { Request, Response, NextFunction } from "express";

export type EcosystemId = "content" | "viral" | "products" | "affiliate";

export interface Scope {
  ecosystemId: EcosystemId;
  crossEcosystem: boolean;
}

/** Codename per ecosystem — now literal ecosystem id (no separate brand alias). */
const CODENAME: Record<EcosystemId, string> = {
  content: "content",
  viral: "viral",
  products: "products",
  affiliate: "affiliate",
};

/** Tables that carry ecosystem_id and therefore get per-ecosystem views. */
const SCOPED_TABLES = ["tasks", "approval_queue", "transactions", "agent_runs"] as const;
type ScopedTable = (typeof SCOPED_TABLES)[number];

const VALID_ECOSYSTEMS = Object.keys(CODENAME) as EcosystemId[];

/** View name for an (ecosystem, table) pair, e.g. v_viral_tasks. */
export function ECOSYSTEM_VIEW(eco: EcosystemId, table: ScopedTable): string {
  return `v_${CODENAME[eco]}_${table}`;
}

/**
 * Old codename-based view names, dropped on every init so live DBs shed orphans
 * after the rename to literal ecosystem ids (SQLite has no wildcard DROP VIEW).
 */
const LEGACY_VIEWS = [
  "v_surge_tasks", "v_surge_approval_queue", "v_surge_transactions", "v_surge_agent_runs",
  "v_signal_tasks", "v_signal_approval_queue", "v_signal_transactions", "v_signal_agent_runs",
  "v_atelier_tasks", "v_atelier_approval_queue", "v_atelier_transactions", "v_atelier_agent_runs",
  "v_conduit_tasks", "v_conduit_approval_queue", "v_conduit_transactions", "v_conduit_agent_runs",
] as const;

/** Create one read-only view per (ecosystem, scoped table). Idempotent. */
export function createScopedViews(raw: Database.Database): void {
  // Shed the pre-rename codename views before (re)creating the literal-id views.
  for (const view of LEGACY_VIEWS) {
    raw.exec(`DROP VIEW IF EXISTS ${view}`);
  }
  for (const eco of VALID_ECOSYSTEMS) {
    for (const table of SCOPED_TABLES) {
      const view = ECOSYSTEM_VIEW(eco, table);
      raw.exec(
        `CREATE VIEW IF NOT EXISTS ${view} AS SELECT * FROM ${table} WHERE ecosystem_id = '${eco}'`,
      );
    }
  }
}

/**
 * Scoped SELECT * helper. With crossEcosystem=false (default) it reads from the
 * per-ecosystem view (structurally cannot leak). With crossEcosystem=true it reads
 * the base table — only controllers that pass allowCrossEcosystem reach this branch.
 */
export function scopedSelect(
  raw: Database.Database,
  table: ScopedTable,
  scope: Scope,
): unknown[] {
  if (scope.crossEcosystem) {
    return raw.prepare(`SELECT * FROM ${table}`).all();
  }
  return raw.prepare(`SELECT * FROM ${ECOSYSTEM_VIEW(scope.ecosystemId, table)}`).all();
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      scope?: Scope;
    }
  }
}

/**
 * Middleware factory. Reads X-Ecosystem header / ?ecosystem= and attaches req.scope.
 * allowCrossEcosystem must be opted into per route; absent => scoped.
 * Defaults to 'content' if the request omits an ecosystem and cross is not allowed.
 */
export function ecosystemScope(opts: { allowCrossEcosystem?: boolean } = {}) {
  const allowCross = opts.allowCrossEcosystem ?? false;
  return (req: Request, res: Response, next: NextFunction): void => {
    const raw =
      (req.header("x-ecosystem") || (req.query["ecosystem"] as string | undefined) || "")
        .toLowerCase();
    const crossRequested = raw === "*" || raw === "all";

    if (crossRequested) {
      if (!allowCross) {
        res.status(400).json({ error: "Cross-ecosystem access not allowed on this route" });
        return;
      }
      req.scope = { ecosystemId: "content", crossEcosystem: true };
      next();
      return;
    }

    const eco = (raw || "content") as EcosystemId;
    if (!VALID_ECOSYSTEMS.includes(eco)) {
      res.status(400).json({ error: `Unknown ecosystem: ${raw}` });
      return;
    }
    req.scope = { ecosystemId: eco, crossEcosystem: false };
    next();
  };
}
