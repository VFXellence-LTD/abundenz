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

/**
 * Tables that carry ecosystem_id and therefore get per-ecosystem views.
 * agent_runs is deliberately absent: it lost ecosystem_id when it became
 * campaign-linked (scope derives via campaigns.ecosystem_id), and a view
 * selecting a missing column breaks every subsequent ALTER TABLE in the DB.
 */
const SCOPED_TABLES = ["tasks", "approval_queue", "transactions"] as const;
type ScopedTable = (typeof SCOPED_TABLES)[number];

const VALID_ECOSYSTEMS = Object.keys(CODENAME) as EcosystemId[];

/** View name for an (ecosystem, table) pair, e.g. v_viral_tasks. */
export function ECOSYSTEM_VIEW(eco: EcosystemId, table: ScopedTable): string {
  return `v_${CODENAME[eco]}_${table}`;
}

/**
 * Drop every v_-prefixed view in the DB. All scoped views are derived state,
 * so wholesale drop-and-recreate is always safe — and it self-heals orphans
 * from renamed codenames (forge/surge/signal/atelier/conduit) or schema
 * drift. A stale view selecting a since-dropped column poisons the whole DB:
 * SQLite re-validates every view on ANY ALTER TABLE, so one broken orphan
 * makes every migration throw (this took the server down at boot).
 * Static drop-lists rot; enumerate sqlite_master instead.
 */
export function dropScopedViews(raw: Database.Database): void {
  const views = raw
    .prepare("SELECT name FROM sqlite_master WHERE type = 'view' AND name LIKE 'v\\_%' ESCAPE '\\'")
    .all() as { name: string }[];
  for (const { name } of views) {
    raw.exec(`DROP VIEW IF EXISTS "${name.replace(/"/g, '""')}"`);
  }
}

/** Recreate one read-only view per (ecosystem, scoped table) from scratch. */
export function createScopedViews(raw: Database.Database): void {
  dropScopedViews(raw);
  for (const eco of VALID_ECOSYSTEMS) {
    for (const table of SCOPED_TABLES) {
      const view = ECOSYSTEM_VIEW(eco, table);
      raw.exec(
        `CREATE VIEW ${view} AS SELECT * FROM ${table} WHERE ecosystem_id = '${eco}'`,
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
