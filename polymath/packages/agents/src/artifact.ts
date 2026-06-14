import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { ClipDraft } from "./types.js";

export interface WriteDraftOptions {
  /** Root drafts dir (defaults to <pkg>/drafts at the driver level). */
  draftsDir: string;
  campaignId: string;
  /** Short kebab slug for the clip topic. */
  slug: string;
  /** ISO date for the dir name; defaults to today. */
  date?: string;
}

export interface WriteDraftResult {
  artifactPath: string; // the .json (canonical artifactPath)
  markdownPath: string;
  dir: string;
}

function renderMarkdown(d: ClipDraft): string {
  const r = d.safeguardReport!;
  const flagLines = r.flags.length
    ? r.flags.map((f) => `- [${f.severity.toUpperCase()}] ${f.rule}: ${f.message}`).join("\n")
    : "- none";
  const shots = d.shotlist
    .map((s) => `${s.line}. (${s.durationSeconds}s) **Visual:** ${s.visual}\n   **VO:** ${s.narration}`)
    .join("\n");
  const sources = d.sourceRefs
    .map((s) => `- ${s.label}${s.url ? ` (${s.url})` : ""} — ${s.confidence}`)
    .join("\n");
  return [
    `# Zrodinger Clip Draft`,
    ``,
    `**Brand:** ${d.brand} (anonymous — Abundenz parent)`,
    `**Safeguard: ${r.pass ? "PASS" : "BLOCKED"}** (checked ${r.checkedAt})`,
    ``,
    `## Hook`,
    d.hook,
    ``,
    `## Script (~30-45s)`,
    d.script,
    ``,
    `## Shotlist`,
    shots,
    ``,
    `## Caption`,
    d.caption,
    ``,
    `## Hashtags`,
    d.hashtags.join(" "),
    ``,
    `## Sources`,
    sources,
    ``,
    `## Safeguard flags`,
    flagLines,
    ``,
  ].join("\n");
}

export function writeDraft(draft: ClipDraft, opts: WriteDraftOptions): WriteDraftResult {
  if (!draft.safeguardReport) {
    throw new Error("writeDraft: draft.safeguardReport is null — run runSafeguardCheck before persisting.");
  }
  const date = opts.date ?? new Date().toISOString().slice(0, 10);
  const blocked = draft.safeguardReport.pass ? "" : "BLOCKED-";
  const dirName = `${blocked}${date}-zrodinger-${opts.slug}-${opts.campaignId}`;
  const dir = resolve(opts.draftsDir, dirName);
  mkdirSync(dir, { recursive: true });

  const artifactPath = join(dir, "draft.json");
  const markdownPath = join(dir, "draft.md");
  writeFileSync(artifactPath, JSON.stringify(draft, null, 2), "utf8");
  writeFileSync(markdownPath, renderMarkdown(draft), "utf8");

  return { artifactPath, markdownPath, dir };
}
