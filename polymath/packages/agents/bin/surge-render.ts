#!/usr/bin/env node
/**
 * bin/surge-render.ts — CLI entry for the /surge-render skill.
 * Usage: node --import tsx bin/surge-render.ts --approval <id> --api <base> [--force-dry-run]
 */
import { runRender } from "../src/renderDriver.js";

const args = process.argv.slice(2);

function arg(flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
}

const approvalId = arg("--approval");
const apiBase = arg("--api") ?? "http://localhost:4500/api";
const artifactsRoot = arg("--artifacts-root") ?? new URL("../artifacts", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const forceDryRun = args.includes("--force-dry-run");

if (!approvalId) {
  console.error("Usage: surge-render --approval <id> --api <base> [--force-dry-run]");
  process.exit(1);
}

runRender(approvalId, { apiBase, artifactsRoot, forceDryRun })
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("surge-render failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
