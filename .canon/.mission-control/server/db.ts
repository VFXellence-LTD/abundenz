import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { createScopedViews } from "./scoping.js";

export interface Db {
  raw: Database.Database;
  migrate(): void;
  close(): void;
}

/**
 * Mirrors CMC db.service: WAL + foreign_keys pragmas, CREATE TABLE IF NOT EXISTS,
 * additive ALTER guarded by try/catch (SQLite has no IF NOT EXISTS on ADD COLUMN).
 */
class MissionControlDb implements Db {
  readonly raw: Database.Database;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.raw = new Database(dbPath);
    this.raw.pragma("journal_mode = WAL");
    this.raw.pragma("foreign_keys = ON");
    this.migrate();
  }

  migrate(): void {
    this.raw.exec(`
      -- ===== Engine-facing state machine (the Jira replacement) =====
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        vertical_id TEXT,
        status TEXT NOT NULL DEFAULT 'planned',      -- planned|running|paused|review|done|killed
        autonomy_stage INTEGER DEFAULT 0,
        target_count INTEGER DEFAULT 1,
        approved_by TEXT,
        approved_at TEXT,
        started_at TEXT,
        completed_at TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,                          -- e.g. 'SURGE-001'
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,                           -- task|campaign|agent-run|content-piece|research|setup|infra
        ecosystem_id TEXT NOT NULL,                   -- content|viral|products|affiliate|apps
        vertical_id TEXT,
        source TEXT NOT NULL DEFAULT 'manual',        -- manual|agent|import
        status TEXT NOT NULL DEFAULT 'backlog',       -- backlog|todo|in-progress|blocked|in-review|done
        priority TEXT NOT NULL DEFAULT 'medium',      -- critical|high|medium|low
        owner TEXT,
        agent_id TEXT,
        parent_id TEXT,
        linked_ids TEXT,                              -- JSON array
        campaign_id TEXT,
        content_type TEXT,
        platform TEXT,
        autonomy_stage INTEGER DEFAULT 0,             -- 0-3
        checklist TEXT,                               -- JSON
        tracker_content TEXT,
        claude_session_id TEXT,
        worktree_path TEXT,
        time_total_seconds INTEGER DEFAULT 0,
        time_running INTEGER DEFAULT 0,
        time_run_started TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (parent_id) REFERENCES tasks(id),
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
      );

      CREATE TABLE IF NOT EXISTS approval_queue (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        campaign_id TEXT,
        ecosystem_id TEXT NOT NULL,
        content_type TEXT,
        artifact_path TEXT,
        preview_url TEXT,
        content_json TEXT,                            -- JSON payload of the draft
        status TEXT NOT NULL DEFAULT 'pending',       -- pending|approved|rejected|changes-requested
        reviewed_by TEXT,
        reviewed_at TEXT,
        review_notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id),
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
      );

      CREATE TABLE IF NOT EXISTS agent_runs (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        task_id TEXT,
        agent_name TEXT,
        claude_session_id TEXT,
        pty_session_id TEXT,
        status TEXT NOT NULL DEFAULT 'queued',        -- queued|running|waiting|done|error|killed
        cwd TEXT,
        command TEXT,
        started_at TEXT,
        completed_at TEXT,
        output_json TEXT,
        error TEXT,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      -- ===== Financial / business tables (back the existing dashboard hooks) =====
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        ecosystem_id TEXT NOT NULL,
        stream TEXT NOT NULL,
        vertical TEXT,
        band TEXT,
        listing_id TEXT,
        description TEXT NOT NULL,
        type TEXT NOT NULL                            -- income|expense
      );

      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cost_per_month REAL NOT NULL DEFAULT 0,
        ecosystems TEXT NOT NULL,                     -- JSON array of EcosystemId
        status TEXT NOT NULL DEFAULT 'candidate',     -- active|candidate|rejected
        url TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS setup_progress (
        step_id TEXT PRIMARY KEY,
        done INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS launch_state (
        vertical_key TEXT NOT NULL,                   -- '\${ecosystemId}:\${verticalId}'
        step_id TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (vertical_key, step_id)
      );

      CREATE TABLE IF NOT EXISTS launch_data (
        vertical_key TEXT NOT NULL,
        field_key TEXT NOT NULL,                      -- '\${stepId}.\${fieldKey}'
        value TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (vertical_key, field_key)
      );

      -- ===== Entity registry (EntityPage) =====
      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS platform_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id TEXT,                                -- NULL => shared/LLC-level account
        platform TEXT NOT NULL,
        handle TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        tracking_id TEXT,
        status TEXT NOT NULL DEFAULT 'not-started',   -- active|pending|not-started
        notes TEXT,
        url TEXT,
        max_accounts TEXT,
        FOREIGN KEY (brand_id) REFERENCES brands(id)
      );

      CREATE TABLE IF NOT EXISTS publish_log (
        id TEXT PRIMARY KEY,
        approval_id TEXT NOT NULL,
        ecosystem_id TEXT NOT NULL,
        platform TEXT NOT NULL,
        url TEXT,
        status TEXT NOT NULL,
        dry_run INTEGER NOT NULL DEFAULT 1,
        published_by TEXT NOT NULL,
        published_at TEXT NOT NULL
      );

      -- ===== Indexes =====
      CREATE INDEX IF NOT EXISTS idx_tasks_status      ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_ecosystem   ON tasks(ecosystem_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_campaign    ON tasks(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_approval_status   ON approval_queue(status);
      CREATE INDEX IF NOT EXISTS idx_txn_ecosystem     ON transactions(ecosystem_id);
      CREATE INDEX IF NOT EXISTS idx_agentruns_status  ON agent_runs(status);
      CREATE INDEX IF NOT EXISTS idx_publish_log_approval ON publish_log(approval_id);
    `);

    // Additive migrations for already-existing DBs (no IF NOT EXISTS on ADD COLUMN).
    const additive: Array<[string, string, string]> = [
      // [table, column, type] — append future columns here, never reorder.
      ["tasks", "agent_id", "TEXT"],
    ];
    for (const [table, col, type] of additive) {
      try {
        this.raw.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
      } catch {
        /* column already exists — safe to ignore */
      }
    }

    createScopedViews(this.raw);
  }

  close(): void {
    this.raw.close();
  }
}

let _instance: MissionControlDb | undefined;

/** Process-wide singleton. Pass dbPath only on first call. */
export function getDb(dbPath: string): Db {
  if (!_instance) _instance = new MissionControlDb(dbPath);
  return _instance;
}

/** Fresh isolated instance — use createDb(':memory:') in tests. */
export function createDb(dbPath: string): Db {
  return new MissionControlDb(dbPath);
}
