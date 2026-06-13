import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function envInt(key: string, def: number): number {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isNaN(n) ? def : n;
}
function env(key: string, def: string): string {
  return process.env[key] ?? def;
}

// server/ -> .mission-control/ -> .canon/ -> VFXellence-LTD/
const MC_ROOT = path.resolve(__dirname, "..");           // .mission-control/
const CANON_ROOT = path.resolve(MC_ROOT, "..");          // .canon/
const REPO_ROOT = path.resolve(CANON_ROOT, "..");        // VFXellence-LTD/

export const config = {
  port: envInt("PORT", 4500),
  dbPath: env("DB_PATH", path.join(MC_ROOT, "server", ".data", "mission-control.db")),
  canonPath: env("CANON_PATH", CANON_ROOT),
  vaultPath: env("VAULT_PATH", path.join(REPO_ROOT, "polymath", "vault")),
  vaultLaunchesDir: env(
    "VAULT_LAUNCHES_DIR",
    path.join(CANON_ROOT, "4_orchestrator", "projects", "polymath-business", "launches"),
  ),
};

export type Config = typeof config;
