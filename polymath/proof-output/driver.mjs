/**
 * Polymath @zrodinger render pipeline — E2E integration proof driver
 * Sub-issue #11: Phase B Epic #2
 *
 * Imports makeAssemblyAdapter directly from source via tsx, then runs a real
 * HyperFrames render with a hand-authored ClipDraft + placeholder assets.
 *
 * Run:  HYPERFRAMES_ENABLED=true node --import tsx/esm proof-output/driver.mjs
 *       (from D:\VFXellence-LTD\polymath)
 */

import { makeAssemblyAdapter } from "../packages/agents/src/adapters/assembly.js";

const SLUG = "zrodinger-proof-001";
const OUT_DIR = "D:/VFXellence-LTD/polymath/proof-output/renders/zrodinger-proof-001";
const ASSETS_BASE = `${OUT_DIR}/${SLUG}`;

// ── Step 2: @zrodinger ClipDraft ──────────────────────────────────────────────
const draft = {
  brand: "@zrodinger",
  hook: "You're spending 10x longer on tasks AI can do in seconds — here's the tool stack fixing that right now.",
  script: `Most creators don't know their AI workflow is costing them hours every week.
The real unlock isn't ChatGPT — it's combining three lightweight tools that work together.
First: a structured prompt library that eliminates blank-page syndrome on every brief.
Second: an AI image-to-caption pipeline that drafts your post copy from a single screenshot.
Third: a batch scheduler that auto-schedules your best-performing content windows using engagement data.
Stack these three, and you recover 8 to 12 hours per week — without touching your core creative process.
The tools exist today. The gap is just knowing which ones actually work together.
That's what @zrodinger breaks down every week.`,
  shotlist: [
    {
      line: 1,
      visual: "Dark screen with a blinking cursor — text appears: '10x faster with AI' in neon blue on deep navy background",
      narration: "You're spending 10x longer on tasks AI can do in seconds — here's the tool stack fixing that right now.",
      durationSeconds: 8,
    },
    {
      line: 2,
      visual: "Split screen: left shows creator staring at blank document, right shows AI generating structured brief in 3 seconds",
      narration: "A structured prompt library eliminates blank-page syndrome on every brief. Second: an AI image-to-caption pipeline that drafts your post copy from a single screenshot.",
      durationSeconds: 8,
    },
    {
      line: 3,
      visual: "Phone mockup showing engagement analytics chart — AI overlay highlights optimal posting windows glowing purple",
      narration: "Third: a batch scheduler that auto-schedules your best-performing content windows using engagement data. Stack these three, and you recover 8 to 12 hours per week.",
      durationSeconds: 8,
    },
    {
      line: 4,
      visual: "Clean dark card: '@zrodinger' logo centered, tagline 'The AI tools stack. Weekly.' fades in below on deep space background",
      narration: "The tools exist today. The gap is just knowing which ones actually work together. That's what @zrodinger breaks down every week.",
      durationSeconds: 8,
    },
  ],
  caption: `The 3-tool AI stack that gives back 10 hours a week — no hype, no fluff, just tools that work together.

Structured prompts + AI caption pipeline + smart scheduler = recovered time.

This is AI-generated educational content. No affiliate links in this post. #AItools #zrodinger #CreatorTools #ProductivityAI #AIWorkflow`,
  hashtags: ["#AItools", "#zrodinger", "#CreatorTools", "#ProductivityAI", "#AIWorkflow"],
  sourceRefs: [
    {
      label: "McKinsey: The economic potential of generative AI (2023)",
      url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai",
      confidence: "verified",
    },
    {
      label: "Buffer 2024 State of Social Media Report — AI usage among creators",
      url: "https://buffer.com/state-of-social-media",
      confidence: "verified",
    },
  ],
  safeguardReport: {
    pass: true,
    flags: [],
    checkedAt: new Date().toISOString(),
  },
};

// ── Step 3: Placeholder VoiceResult (silent MP3 from ffmpeg) ─────────────────
const voice = {
  voiceoverPath: `${ASSETS_BASE}.mp3`,
  durationSec: 30,
  step: { adapter: "voice", mode: "stub", note: "Silent MP3 placeholder — ElevenLabs absent (no ELEVENLABS_API_KEY)" },
};

// ── Step 3: Placeholder VisualResult (colored PNGs from ffmpeg) ──────────────
const visuals = {
  visualPaths: [
    `${ASSETS_BASE}-0.png`,
    `${ASSETS_BASE}-1.png`,
    `${ASSETS_BASE}-2.png`,
    `${ASSETS_BASE}-3.png`,
  ],
  step: { adapter: "visual", mode: "stub", note: "Colored PNG placeholders — Higgsfield/hf.exe absent" },
};

// ── Step 4: RenderContext ─────────────────────────────────────────────────────
const ctx = {
  outDir: OUT_DIR,
  slug: SLUG,
  forceDryRun: false,
};

// ── Run the real AssemblyAdapter ──────────────────────────────────────────────
console.log("[driver] HYPERFRAMES_ENABLED =", process.env.HYPERFRAMES_ENABLED);
console.log("[driver] Starting real HyperFrames render...");
console.log("[driver] outDir:", ctx.outDir);
console.log("[driver] slug:", ctx.slug);

const adapter = makeAssemblyAdapter({ available: true });
console.log("[driver] Adapter name:", adapter.name);

try {
  const result = await adapter.render(draft, voice, visuals, ctx);
  console.log("\n[driver] RENDER COMPLETE");
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("\n[driver] RENDER FAILED");
  console.error(err);
  process.exit(1);
}
