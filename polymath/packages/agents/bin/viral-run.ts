#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGenerate } from "../src/driver.js";
import type { ClipDraft } from "../src/types.js";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const draftPath = arg("draft");
  const taskId = arg("task");
  const campaignId = arg("campaign");
  const slug = arg("slug") ?? "clip";
  const apiBase = arg("api") ?? "http://localhost:4500/api";

  if (!draftPath || !taskId || !campaignId) {
    console.error("Usage: viral-run --draft <draft.json> --task <taskId> --campaign <campaignId> [--slug <slug>] [--api <base>]");
    process.exit(2);
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const draftsDir = resolve(here, "..", "drafts");
  const draft = JSON.parse(readFileSync(resolve(draftPath), "utf8")) as ClipDraft;

  const result = await runGenerate(draft, { apiBase, taskId, campaignId, slug, draftsDir });
  // Machine-readable result for the skill to read back.
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(`viral-run failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
