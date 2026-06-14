import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { makeVoiceAdapter } from "../src/adapters/voice.js";
import { makeEmptyDraft } from "../src/types.js";

let dir: string;
beforeEach(() => { dir = mkdtempSync(join(tmpdir(), "voice-")); });
afterEach(() => { rmSync(dir, { recursive: true, force: true }); });

function draft() { const d = makeEmptyDraft("zrodinger"); d.script = "test narration"; return d; }

describe("VoiceAdapter", () => {
  it("env-key absent → dry-run stub mp3 + report step", async () => {
    delete process.env.ELEVENLABS_API_KEY;
    const a = makeVoiceAdapter();
    const r = await a.render(draft(), { outDir: dir, slug: "demo" });
    expect(r.step.mode).toBe("dry-run");
    expect(r.voiceoverPath.endsWith(".mp3")).toBe(true);
    expect(existsSync(r.voiceoverPath)).toBe(true);
    expect(readFileSync(r.voiceoverPath, "utf8")).toContain("DRY-RUN");
    expect(r.durationSec).toBeGreaterThan(0);
  });

  it("forceDryRun → dry-run even if key present (cost safety)", async () => {
    process.env.ELEVENLABS_API_KEY = "sk-test";
    const a = makeVoiceAdapter();
    const r = await a.render(draft(), { outDir: dir, slug: "demo", forceDryRun: true });
    expect(r.step.mode).toBe("dry-run");
    delete process.env.ELEVENLABS_API_KEY;
  });
});
