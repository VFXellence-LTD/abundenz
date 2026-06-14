import type { RenderStep } from "../renderTypes.js";
import type { ClipDraft } from "../types.js";

export type RenderMode = "real" | "dry-run";

export interface VoiceResult { voiceoverPath: string; durationSec: number; step: RenderStep; }
export interface VisualResult { visualPaths: string[]; step: RenderStep; }
export interface AssemblyResult { videoPath: string; thumbnailPath: string; durationSec: number; step: RenderStep; }

export interface RenderContext {
  /** Where rendered files for THIS clip are written (created if absent). */
  outDir: string;
  /** Stable slug for filenames. */
  slug: string;
  /** Force dry-run regardless of capability presence (tests / cost-safety). */
  forceDryRun?: boolean;
}

export interface VoiceAdapter { name: string; render(draft: ClipDraft, ctx: RenderContext): Promise<VoiceResult>; }
export interface VisualAdapter { name: string; render(draft: ClipDraft, ctx: RenderContext): Promise<VisualResult>; }
export interface AssemblyAdapter {
  name: string;
  render(draft: ClipDraft, voice: VoiceResult, visuals: VisualResult, ctx: RenderContext): Promise<AssemblyResult>;
}

/** Single source of truth for real-vs-stub. Absence => dry-run, never fail-hard. */
export function selectMode(opts: { present: boolean; forceDryRun?: boolean }): RenderMode {
  if (opts.forceDryRun) return "dry-run";
  return opts.present ? "real" : "dry-run";
}
