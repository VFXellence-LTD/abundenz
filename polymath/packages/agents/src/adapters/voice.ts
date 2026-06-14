import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { selectMode } from "./types.js";
import type { VoiceAdapter, VoiceResult, RenderContext } from "./types.js";
import type { ClipDraft } from "../types.js";

function estimateDurationSec(script: string): number {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 2.5));
}

function dryRunVoice(draft: ClipDraft, ctx: RenderContext, missingKeys: string[]): VoiceResult {
  mkdirSync(ctx.outDir, { recursive: true });
  const filePath = join(ctx.outDir, `${ctx.slug}.mp3`);
  const banner = `DRY-RUN ElevenLabs voiceover placeholder\nMissing: ${missingKeys.join(", ")}\n\n${draft.script}`;
  writeFileSync(filePath, banner, "utf8");
  return {
    voiceoverPath: filePath,
    durationSec: estimateDurationSec(draft.script),
    step: { adapter: "voice", mode: "dry-run", note: missingKeys.join(", ") || "forced dry-run" },
  };
}

export function makeVoiceAdapter(): VoiceAdapter {
  return {
    name: "elevenlabs-voice",
    async render(draft: ClipDraft, ctx: RenderContext): Promise<VoiceResult> {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = process.env.ELEVENLABS_SURGE_VOICE_ID;
      const missing: string[] = [];
      if (!apiKey) missing.push("ELEVENLABS_API_KEY");
      if (!voiceId) missing.push("ELEVENLABS_SURGE_VOICE_ID");

      const mode = selectMode({ present: missing.length === 0, forceDryRun: ctx.forceDryRun });

      if (mode === "dry-run") {
        return dryRunVoice(draft, ctx, missing.length > 0 ? missing : ["forced dry-run"]);
      }

      // Real path: env-gated, never exercised in tests
      mkdirSync(ctx.outDir, { recursive: true });
      const filePath = join(ctx.outDir, `${ctx.slug}.mp3`);
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: { "xi-api-key": apiKey!, "content-type": "application/json" },
        body: JSON.stringify({ text: draft.script, model_id: "eleven_turbo_v2_5" }),
      });
      if (!res.ok) throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      writeFileSync(filePath, bytes);
      return {
        voiceoverPath: filePath,
        durationSec: estimateDurationSec(draft.script),
        step: { adapter: "voice", mode: "real", note: "ElevenLabs TTS" },
      };
    },
  };
}
