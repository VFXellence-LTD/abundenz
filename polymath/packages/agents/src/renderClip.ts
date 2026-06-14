import { mkdirSync } from "node:fs";
import type { ClipDraft } from "./types.js";
import type { RenderedClip, RenderReport } from "./renderTypes.js";
import { makeVoiceAdapter } from "./adapters/voice.js";
import { makeVisualAdapter } from "./adapters/visual.js";
import { makeAssemblyAdapter } from "./adapters/assembly.js";
import type { VoiceAdapter, VisualAdapter, AssemblyAdapter } from "./adapters/types.js";

export interface RenderClipOptions {
  sourceDraftPath: string;
  outDir: string;
  slug: string;
  forceDryRun?: boolean;
  adapters?: { voice: VoiceAdapter; visual: VisualAdapter; assembly: AssemblyAdapter };
}

export async function renderClip(draft: ClipDraft, opts: RenderClipOptions): Promise<RenderedClip> {
  mkdirSync(opts.outDir, { recursive: true });
  const a = opts.adapters ?? {
    voice: makeVoiceAdapter(),
    visual: makeVisualAdapter(),
    assembly: makeAssemblyAdapter(),
  };
  const ctx = { outDir: opts.outDir, slug: opts.slug, forceDryRun: opts.forceDryRun };

  const voice = await a.voice.render(draft, ctx);       // 1. voice
  const visuals = await a.visual.render(draft, ctx);    // 2. visuals
  const assembled = await a.assembly.render(draft, voice, visuals, ctx); // 3. assemble

  const steps = [voice.step, visuals.step, assembled.step];
  const dryRun = steps.some((s) => s.mode === "dry-run");
  const missing = steps.filter((s) => s.mode === "dry-run").map((s) => s.note);
  const report: RenderReport = { dryRun, missing, steps, renderedAt: new Date().toISOString() };

  return {
    sourceDraftPath: opts.sourceDraftPath,
    voiceoverPath: voice.voiceoverPath,
    visualPaths: visuals.visualPaths,
    videoPath: assembled.videoPath,
    thumbnailPath: assembled.thumbnailPath,
    durationSec: assembled.durationSec,
    renderedAt: report.renderedAt,
    renderReport: report,
  };
}
