import path from "node:path";
import fs from "node:fs";
import { ApprovalsService } from "./approvals.service.js";
import type { Db } from "../db.js";

export type ArtifactMime = "video/mp4" | "image/png" | "audio/mpeg";

function mimeFor(ext: string): ArtifactMime | null {
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".png") return "image/png";
  if (ext === ".mp3") return "audio/mpeg";
  return null;
}

export type ResolveResult =
  | { ok: true; filePath: string; contentType: ArtifactMime }
  | { ok: false; reason: "missing-approval" | "outside-root" | "file-missing" | "unsupported-type" };

export function resolveArtifact(db: Db, artifactsRoot: string, id: string): ResolveResult {
  const svc = new ApprovalsService(db);
  const approval = svc.get(id);
  if (!approval || !approval.previewUrl) return { ok: false, reason: "missing-approval" };

  const resolved = path.resolve(approval.previewUrl);
  const root = path.resolve(artifactsRoot);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    return { ok: false, reason: "outside-root" };
  }

  const mime = mimeFor(path.extname(resolved).toLowerCase());
  if (!mime) return { ok: false, reason: "unsupported-type" };

  if (!fs.existsSync(resolved)) return { ok: false, reason: "file-missing" };

  return { ok: true, filePath: resolved, contentType: mime };
}
