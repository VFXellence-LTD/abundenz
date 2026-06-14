import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { selectMode } from "./types.js";
import type { AssemblyAdapter, AssemblyResult, VoiceResult, VisualResult, RenderContext } from "./types.js";
import type { ClipDraft } from "../types.js";

export function makeAssemblyAdapter(opts?: { available?: boolean }): AssemblyAdapter {
  const available = opts?.available ?? !!process.env.HYPERFRAMES_BIN;
  return {
    name: "hyperframes-assembly",
    async render(draft: ClipDraft, voice: VoiceResult, visuals: VisualResult, ctx: RenderContext): Promise<AssemblyResult> {
      void draft; // unused in current paths
      const mode = selectMode({ present: available, forceDryRun: ctx.forceDryRun });

      if (mode === "dry-run") {
        mkdirSync(ctx.outDir, { recursive: true });
        const videoPath = join(ctx.outDir, `${ctx.slug}.mp4`);
        const thumbnailPath = join(ctx.outDir, `${ctx.slug}-thumb.png`);
        writeFileSync(videoPath, `DRY-RUN HyperFrames assembly placeholder\nVoice: ${voice.voiceoverPath}`, "utf8");
        writeFileSync(thumbnailPath, "DRY-RUN HyperFrames thumbnail placeholder", "utf8");
        return {
          videoPath,
          thumbnailPath,
          durationSec: voice.durationSec,
          step: { adapter: "assembly", mode: "dry-run", note: "HyperFrames absent" },
        };
      }

      // Real path: HyperFrames HTML->video — tool-gated, not exercised in tests
      const hyperframes = process.env.HYPERFRAMES_BIN!;
      mkdirSync(ctx.outDir, { recursive: true });
      const videoPath = join(ctx.outDir, `${ctx.slug}.mp4`);
      const thumbnailPath = join(ctx.outDir, `${ctx.slug}-thumb.png`);
      const html = `<!DOCTYPE html><html><body>
        <video src="${voice.voiceoverPath}" autoplay></video>
        ${visuals.visualPaths.map((p) => `<img src="${p}">`).join("")}
      </body></html>`;
      const htmlPath = join(ctx.outDir, `${ctx.slug}.html`);
      writeFileSync(htmlPath, html, "utf8");
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      await promisify(execFile)(hyperframes, ["render", htmlPath, "--output", videoPath, "--thumbnail", thumbnailPath]);
      return {
        videoPath,
        thumbnailPath,
        durationSec: voice.durationSec,
        step: { adapter: "assembly", mode: "real", note: "HyperFrames HTML->video" },
      };
    },
  };
}
