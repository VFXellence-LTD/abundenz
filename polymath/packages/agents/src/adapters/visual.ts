import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { selectMode } from "./types.js";
import type { VisualAdapter, VisualResult, RenderContext } from "./types.js";
import type { ClipDraft } from "../types.js";

const DEFAULT_HF_PATH = "D:\\dev\\sandbox\\hf.exe";

export function makeVisualAdapter(opts?: { hfPath?: string }): VisualAdapter {
  const hfPath = opts?.hfPath ?? process.env.HF_PATH ?? DEFAULT_HF_PATH;
  return {
    name: "higgsfield-visual",
    async render(draft: ClipDraft, ctx: RenderContext): Promise<VisualResult> {
      const toolPresent = existsSync(hfPath);
      const mode = selectMode({ present: toolPresent, forceDryRun: ctx.forceDryRun });

      if (mode === "dry-run") {
        mkdirSync(ctx.outDir, { recursive: true });
        const visualPaths: string[] = (draft.shotlist ?? []).map((shot, idx) => {
          const filePath = join(ctx.outDir, `${ctx.slug}-${idx + 1}.png`);
          const banner = `DRY-RUN Higgsfield/Meta.ai visual placeholder\nShot ${shot.line}: ${shot.visual}`;
          writeFileSync(filePath, banner, "utf8");
          return filePath;
        });
        // Ensure at least one placeholder even if shotlist is empty
        if (visualPaths.length === 0) {
          const filePath = join(ctx.outDir, `${ctx.slug}-1.png`);
          writeFileSync(filePath, "DRY-RUN Higgsfield/Meta.ai visual placeholder\n(no shotlist)", "utf8");
          visualPaths.push(filePath);
        }
        return {
          visualPaths,
          step: { adapter: "visual", mode: "dry-run", note: "Higgsfield/Meta.ai absent" },
        };
      }

      // Real path: spawn hf.exe per shot — tool-gated, not exercised in tests
      const { spawn } = await import("node:child_process");
      mkdirSync(ctx.outDir, { recursive: true });
      const visualPaths: string[] = [];
      for (const shot of draft.shotlist ?? []) {
        const outFile = join(ctx.outDir, `${ctx.slug}-${shot.line}.png`);
        await new Promise<void>((resolve, reject) => {
          const proc = spawn(hfPath, ["generate", "--prompt", shot.visual, "--output", outFile]);
          proc.on("close", (code) => code === 0 ? resolve() : reject(new Error(`hf.exe exited ${code} for shot ${shot.line}`)));
        });
        visualPaths.push(outFile);
      }
      return {
        visualPaths,
        step: { adapter: "visual", mode: "real", note: "Higgsfield CLI" },
      };
    },
  };
}
