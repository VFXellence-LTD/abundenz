import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { selectMode } from "./types.js";
import type { AssemblyAdapter, AssemblyResult, VoiceResult, VisualResult, RenderContext } from "./types.js";
import type { ClipDraft } from "../types.js";

const HYPERFRAMES_VERSION = "0.6.110";

export function buildCompositionHtml(
  draft: ClipDraft,
  width: number,
  height: number,
  totalDuration: number
): string {
  let clipHtml = "";
  let cumulativeStart = 0;
  draft.shotlist.forEach((shot, i) => {
    clipHtml += `      <div
        id="shot-${shot.line}"
        class="clip"
        data-start="${cumulativeStart}"
        data-duration="${shot.durationSeconds}"
        data-track-index="${shot.line}"
        style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;text-align:center;padding:40px;background:rgba(0,0,0,0.4);"
      >${shot.narration}</div>\n`;
    clipHtml += `      <img
        id="visual-${i + 1}"
        class="clip"
        data-start="${cumulativeStart}"
        data-duration="${shot.durationSeconds}"
        data-track-index="${shot.line}"
        src="assets/visual-${i}.png"
        style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;"
      />\n`;
    cumulativeStart += shot.durationSeconds;
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${width}, height=${height}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: #000; }
      body { font-family: "Inter", sans-serif; }
    </style>
  </head>
  <body>
    <audio id="voiceover" src="assets/voiceover.mp3" data-start="0" data-duration="${totalDuration}"></audio>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${totalDuration}"
      data-width="${width}"
      data-height="${height}"
      style="position:relative;width:${width}px;height:${height}px;overflow:hidden;"
    >
${clipHtml}    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;
}

export function makeAssemblyAdapter(opts?: { available?: boolean }): AssemblyAdapter {
  const available = opts?.available ?? (process.env.HYPERFRAMES_ENABLED === "true");
  return {
    name: "hyperframes-assembly",
    async render(draft: ClipDraft, voice: VoiceResult, visuals: VisualResult, ctx: RenderContext): Promise<AssemblyResult> {
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

      // Real render path — HYPERFRAMES_ENABLED=true required
      const projectDir = join(ctx.outDir, `${ctx.slug}-hf-project`);
      const assetsDir = join(projectDir, "assets");
      mkdirSync(assetsDir, { recursive: true });

      const videoPath = join(ctx.outDir, `${ctx.slug}.mp4`);
      const thumbnailPath = join(ctx.outDir, `${ctx.slug}-thumb.png`);

      // Copy input assets into the project
      copyFileSync(voice.voiceoverPath, join(assetsDir, "voiceover.mp3"));
      visuals.visualPaths.forEach((p, i) => {
        copyFileSync(p, join(assetsDir, `visual-${i}.png`));
      });

      // Write hyperframes.json (matches real scaffold)
      writeFileSync(join(projectDir, "hyperframes.json"), JSON.stringify({
        "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
        "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
        "paths": { "blocks": "compositions", "components": "compositions/components", "assets": "assets" }
      }, null, 2), "utf8");

      // Write meta.json
      writeFileSync(join(projectDir, "meta.json"), JSON.stringify({
        id: ctx.slug,
        name: ctx.slug,
        createdAt: new Date().toISOString()
      }, null, 2), "utf8");

      // Compute timing from shotlist (portrait 1080x1920)
      const WIDTH = 1080;
      const HEIGHT = 1920;
      const totalDuration = draft.shotlist.length > 0
        ? draft.shotlist.reduce((sum, s) => sum + s.durationSeconds, 0)
        : voice.durationSec;

      // Write index.html — portrait 1080x1920
      const indexHtml = buildCompositionHtml(draft, WIDTH, HEIGHT, totalDuration);
      writeFileSync(join(projectDir, "index.html"), indexHtml, "utf8");

      // Render: npx hyperframes@VERSION render <projectDir> -o <output> --quiet
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execFileAsync = promisify(execFile);
      // On Windows, npx is a .cmd shim that cannot be spawned directly with execFile.
      // Invoke via cmd.exe /c with args as an argv array — injection-proof (no shell string
      // concatenation) and space-safe. On POSIX, npx is a plain executable; use it directly.
      const npxArgs = [`hyperframes@${HYPERFRAMES_VERSION}`, "render", projectDir, "-o", videoPath, "--quiet"];
      if (process.platform === "win32") {
        await execFileAsync("cmd.exe", ["/c", "npx", ...npxArgs], { cwd: projectDir });
      } else {
        await execFileAsync("npx", npxArgs, { cwd: projectDir });
      }

      // Extract thumbnail at t=1s via ffmpeg — real executable, no shell needed
      await execFileAsync("ffmpeg", ["-ss", "1", "-i", videoPath, "-vframes", "1", "-y", thumbnailPath]);

      return {
        videoPath,
        thumbnailPath,
        durationSec: voice.durationSec,
        step: { adapter: "assembly", mode: "real", note: `HyperFrames npx@${HYPERFRAMES_VERSION}` },
      };
    },
  };
}
