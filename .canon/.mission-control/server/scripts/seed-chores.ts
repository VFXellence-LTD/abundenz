/**
 * seed-chores.ts — Idempotent seed for open chores + go-live tasks.
 *
 * Inserts each task only if an id-collision does not already exist.
 * Safe to re-run: second run inserts 0 rows.
 *
 * Run from server/ dir:
 *   pnpm exec tsx scripts/seed-chores.ts
 * Or from repo root:
 *   pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\server" exec tsx scripts/seed-chores.ts
 */

import { createDb } from "../db.js";
import { TasksService } from "../services/tasks.service.js";
import { config } from "../config.js";

// ---------------------------------------------------------------------------
// Task definitions
// ---------------------------------------------------------------------------

interface ChoreTask {
  id: string;
  title: string;
  description: string;
  type: string;
  ecosystemId: string;
  priority: string;
  status: "backlog" | "todo" | "in-progress" | "blocked" | "in-review" | "done";
}

const CHORE_TASKS: ChoreTask[] = [
  // ── INFRA-001, INFRA-002, INFRA-003 removed 2026-06-17 ───────────────────
  // Migrated to GitHub issues #12, #13, #14 (VFXellence-LTD/vfxellence).
  // SQLite is business-only from this point forward.

  // ── GO-LIVE setup (viral) ─────────────────────────────────────────────────
  {
    id: "GOLIVE-001",
    title: "Create @zrodinger social accounts",
    description:
      "TikTok + YouTube + Instagram @zrodinger. Boss-only (Claude cannot create accounts). Blocks publish go-live.",
    type: "setup",
    ecosystemId: "viral",
    priority: "high",
    status: "todo",
  },
  {
    id: "GOLIVE-002",
    title: "Connect Buffer/Postiz or obtain platform tokens",
    description:
      "Per-brand (viral) distribution creds. Depends on accounts existing.",
    type: "setup",
    ecosystemId: "viral",
    priority: "high",
    status: "todo",
  },
  {
    id: "GOLIVE-003",
    title: "Set Mission Control env vars (creds, never in vault)",
    description:
      "ELEVENLABS_API_KEY, ELEVENLABS_SURGE_VOICE_ID, BUFFER_TOKEN__VIRAL (and/or POSTIZ_API_KEY__VIRAL). Set in shell/.env outside the repo, then restart server. Until set, render+publish run dry-run.",
    type: "setup",
    ecosystemId: "viral",
    priority: "high",
    status: "todo",
  },
  {
    id: "GOLIVE-004",
    title: "Approve paid-tool spend (ElevenLabs; Buffer/Postiz)",
    description:
      "Tool adoption + spend requires Boss approval per doctrine. Dry-run is free; real voice/publish costs money.",
    type: "setup",
    ecosystemId: "viral",
    priority: "high",
    status: "todo",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const db = createDb(config.dbPath);
  const svc = new TasksService(db);

  // ── Idempotent migration cleanup ───────────────────────────────────────────
  // INFRA-001, INFRA-002, INFRA-003 migrated to GitHub #12/#13/#14 on 2026-06-17.
  // Delete keeps SQLite business-only. Scoped to exact ids — safe to re-run.
  const deleted = db.raw
    .prepare(`DELETE FROM tasks WHERE id IN ('INFRA-001','INFRA-002','INFRA-003')`)
    .run();
  if (deleted.changes > 0) {
    console.log(`  DELETE ${deleted.changes} stale INFRA row(s) migrated to GitHub.`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const task of CHORE_TASKS) {
    const existing = svc.get(task.id);
    if (existing) {
      console.log(`  SKIP  ${task.id} — already exists (status: ${existing.status})`);
      skipped++;
      continue;
    }

    svc.create({
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.type,
      ecosystemId: task.ecosystemId,
      priority: task.priority,
      status: task.status,
      source: "manual",
    });

    console.log(`  INSERT ${task.id} — "${task.title}"`);
    inserted++;
  }

  console.log(`\nDone. Inserted: ${inserted}  Skipped: ${skipped}`);

  // List all seeded tasks now in db
  console.log("\nSeeded tasks in db:");
  for (const task of CHORE_TASKS) {
    const t = svc.get(task.id);
    if (t) {
      console.log(`  ${t.id.padEnd(12)} [${t.status}]  ${t.title}`);
    }
  }

  db.close();
}

main();
