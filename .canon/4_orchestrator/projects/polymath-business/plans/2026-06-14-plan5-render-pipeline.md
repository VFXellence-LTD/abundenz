# Plan 5 — Render Pipeline (approved script draft → rendered clip)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax.

**Goal:** Turn an APPROVED script-level `ClipDraft` (the Plan-4 artifact, `content_type='clip'`) into a rendered short-form video artifact (`.mp4` + thumbnail) via an adapter-based render pipeline in `@polymath/agents`, then surface a SECOND `approval_queue` row (`content_type='video'`, `status='pending'`) carrying the rendered video as `preview_url` for a FINAL pre-publish human approval. This is the autonomy-appropriate split: the **render** is automated, but a human still approves the **rendered video** before any publish (Plan 6 consumes this second row). NO publish, NO social accounts, NO credential entry, NO scheduler.

**Architecture:** Three cooperating layers, mirroring Plan 4.
1. **Render engine (`@polymath/agents`, fully TDD'd):** a NEW `RenderedClip` type in its OWN file (`renderTypes.ts` — `ClipDraft` and `validateDraft` are NOT touched and their forbidden-render-key guard stays exactly as-is). Three adapters under the **adapter pattern**, each with a REAL impl + a DRY-RUN impl:
   - `VoiceAdapter` — ElevenLabs (real, gated on `ELEVENLABS_API_KEY`; AI voice OK for anonymous Surge, never owner voice) → produces a `voiceoverPath` (`.mp3`).
   - `VisualAdapter` — Higgsfield CLI (`D:\dev\sandbox\hf.exe`) / Meta.ai (free) → produces `visualPaths[]` (image/clip files).
   - `AssemblyAdapter` — HyperFrames (global npm, HTML→video) → assembles voice + visuals into `videoPath` (`.mp4`) + `thumbnailPath` (`.png`).
   When the env key / tool is absent, the adapter falls to its DRY-RUN impl: it writes a clearly-marked **stub** artifact (placeholder mp4/thumbnail/mp3) and contributes to a `renderReport{ dryRun:true, missing:[...] }`. Never fail-hard on a missing key.
   The orchestrator `renderClip(draft, opts)` sequences **voice → visuals → assemble → RenderedClip** and returns the full artifact + aggregated `renderReport`.
2. **Approval recording (`@polymath/agents`):** `recordVideoApproval(rendered, opts)` POSTs a SECOND `approval_queue` row `{ ecosystemId:'viral', contentType:'video', taskId, campaignId, artifactPath:videoPath, previewUrl:videoPath, contentJson:{ ...rendered, renderReport } }` (server forces `status='pending'`). This is the FINAL pre-publish gate. The originating task stays `in-review` (the gate already blocks `done` while a pending approval exists). The engine NEVER touches better-sqlite3 directly — the server is the single DB writer.
3. **Skill + trigger + UI:**
   - `/surge-render <approvalId>` SKILL.md (new) at `.canon/.claude/skills/polymath/surge-render/` whose HALT line is **"HALT after render. No publish. Human approves the rendered video before publish."**
   - The render trigger fires on a SCRIPT approval: when an `approval_queue` row with `content_type='clip'` is set to `approved`, the orchestrator drives the render (via the Plan-3 PTY session running `/surge-render`, OR a server-side trigger that records an `agent_run` — see Cross-Plan Contract). No auto-publish.
   - Server: a new artifact-serving route `GET /api/artifacts/:id` streams the video file referenced by an approval's `preview_url` (path-confined to the artifacts root — no traversal). The client `ContentPreview` renders a `<video>` for `content_type='video'` (pointing at this route), and keeps the existing script preview for `content_type='clip'`.

**Hard scope guards (enforced throughout — see Self-Review for the test that proves each):**
- The render pipeline ONLY runs against an **already-approved** `content_type='clip'` row. It never renders an unapproved or rejected draft.
- `ClipDraft` / `validateDraft` are NOT modified. The forbidden-render-key guard (`videoPath, voiceoverPath, audioPath, renderedAt, assets, mp4, elevenlabs`) stays intact — `RenderedClip` is a SEPARATE post-render type that legitimately HOLDS exactly those keys. A guard test asserts `validateDraft` still hard-rejects a `ClipDraft` carrying any render key.
- Credentials via ENV ONLY (`ELEVENLABS_API_KEY`). Absence ⇒ DRY-RUN (stub artifact + `renderReport.dryRun=true`, `missing` lists the absent capability). Never a hard failure, never a secret in repo/vault.
- NO account creation, NO credential entry, NO publish, NO scheduler. `/surge-render` HALTs at "second pending approval recorded".
- BRAND ISOLATION: rendered artifacts and the video approval row carry NO owner identity — only `zrodinger` (Abundenz parent). AI voice is the anonymous Surge voice, never the operator's.
- Paid-tool doctrine: the REAL `VoiceAdapter` (ElevenLabs) costs money → the skill documents **Boss-approval-before-spend**; dry-run path is free and is the test/default path.
- Artifact storage: rendered files land under a gitignored artifacts root; `*.mp4`, `*.mp3`, `*.png` thumbnails under that root are gitignored.

**Tech Stack:** TypeScript ~6.0 (ESNext, `moduleResolution: bundler`, strict), Node 22 (global `fetch`), vitest ^4, tsx runtime driver, pnpm workspace `@polymath/agents` under `polymath/packages/agents`. Server = Express 5 + better-sqlite3 (`:4500`). Client = React 19 + Vite + Tailwind 4, RTL + vitest. Consumes the live Plan-1 API (camelCase JSON).

---

## Cross-Plan Contract (must stay consistent across Plans 1–6)

- **`RenderedClip` shape (this plan defines; Plan 6 consumes via the `video` approval `contentJson`):**
  ```ts
  interface RenderReport {
    dryRun: boolean;
    missing: string[];           // e.g. ["ELEVENLABS_API_KEY","hf.exe"]
    steps: { adapter: "voice" | "visual" | "assembly"; mode: "real" | "dry-run"; note: string }[];
    renderedAt: string;          // ISO
  }
  interface RenderedClip {
    sourceDraftPath: string;     // the approved clip artifact .json (Plan-4 artifactPath)
    voiceoverPath: string;       // .mp3 (stub in dry-run)
    visualPaths: string[];       // image/clip files (stubs in dry-run)
    videoPath: string;           // .mp4 (stub in dry-run)
    thumbnailPath: string;       // .png (stub in dry-run)
    durationSec: number;
    renderedAt: string;          // ISO
    renderReport: RenderReport;
  }
  ```
  These keys are EXACTLY the ones `ClipDraft` forbids — correct: this is the post-render artifact, a different type in a different file.
- **Render trigger (this plan wires; Plan 4 produced the `clip` row):** on `PATCH /api/approvals/:id/status {status:'approved'}` where that row's `content_type='clip'`, the render is invoked. Invocation path = the Plan-3 PTY driver spawning a Claude session that runs `/surge-render <approvalId>` (the human-in-the-loop, default), with an optional server-recorded `agent_run` marking the render in-flight. NO publish is ever triggered automatically.
- **Engine output contract (this plan writes; Plan 6 reads):** render → `RenderedClip` artifact on disk → `POST /api/approvals` `{ ecosystemId:'viral', contentType:'video', taskId, campaignId, artifactPath:videoPath, previewUrl:videoPath, contentJson:{...RenderedClip} }` (server forces `pending`) → HALT. Task remains `in-review`.
- **Final-gate flow (Plan 6 owns the decision):** reviewer reads `GET /api/approvals?status=pending`, sees the `content_type='video'` row, watches the `<video>` preview (served by `GET /api/artifacts/:id`), then `PATCH /api/approvals/:id/status {status:'approved'}`. ONLY a human-clicked approval unblocks Plan 6's publish — no scheduler.
- **PTY allowlist (Plan 3 extends):** add `'/surge-render'` to the engine command allowlist alongside the Plan-4 surge commands.

## API surface (verified against Plan-1 source)

- `POST /api/approvals` (camelCase): requires `ecosystemId`; accepts `taskId, campaignId, contentType, artifactPath, previewUrl, contentJson`. Server forces `status='pending'`, returns `201`. (`routes/approvals.ts`, `services/approvals.service.ts` — `create()` already persists `content_type`, `preview_url`, `content_json`; NO schema change needed for the `video` row.)
- `GET /api/approvals?status=pending` / `PATCH /api/approvals/:id/status {status, reviewedBy, reviewNotes}` — terminal states (`approved`,`rejected`) cannot be re-transitioned (409).
- `approval_queue` columns already include `content_type` and `preview_url` (Plan 1) — the `video` row reuses the existing schema; NO migration.
- NEW: `GET /api/artifacts/:id` — resolves the approval by id, reads its `preview_url` (must resolve UNDER the artifacts root — reject traversal with 400), streams the file with the right `Content-Type` (`video/mp4`, `image/png`). `404` if approval or file missing.

---

## File Map

```
polymath/
  packages/
    agents/                                    ← @polymath/agents (extend; do NOT touch ClipDraft files)
      .gitignore                               T1 add artifacts/ + *.mp4 *.mp3 thumb globs
      package.json                             T1 add "surge:render" script
      src/
        renderTypes.ts                         T2 RenderedClip / RenderReport / RenderStep types (NEW FILE)
        adapters/
          types.ts                             T3 VoiceAdapter/VisualAdapter/AssemblyAdapter interfaces + selectMode()
          voice.ts                             T4 elevenLabsVoiceAdapter (real, env-gated) + dryRunVoiceAdapter
          visual.ts                            T5 higgsfieldVisualAdapter (real, tool-gated) + dryRunVisualAdapter
          assembly.ts                          T6 hyperframesAssemblyAdapter (real, tool-gated) + dryRunAssemblyAdapter
        renderClip.ts                          T7 renderClip(): voice → visuals → assemble → RenderedClip
        videoApiClient.ts                      T8 recordVideoApproval(): POST content_type='video' pending row
        renderDriver.ts                        T9 runRender(approvalId): fetch approved clip → renderClip → record → HALT
      bin/
        surge-render.ts                        T9 CLI entry the skill invokes
      test/
        renderTypes.test.ts                    T2
        adapters.types.test.ts                 T3 selectMode picks real vs dry-run on env/tool presence
        voice.adapter.test.ts                  T4 dry-run stub + report; env-absence → dry-run
        visual.adapter.test.ts                 T5 dry-run stub + report; tool-absence → dry-run
        assembly.adapter.test.ts               T6 dry-run stub mp4+thumb + report
        renderClip.test.ts                     T7 sequences voice→visual→assemble (mock adapters); dryRun aggregation
        videoApiClient.test.ts                 T8 (mock fetch) second row is content_type='video', correct shape
        renderDriver.test.ts                   T9 (mock fetch + tmp) only renders approved clip; HALT; no publish
        clipdraft-guard.test.ts                T2 REGRESSION: validateDraft still hard-rejects render keys
      artifacts/                               created at runtime (gitignored) — rendered mp4/mp3/png land here
.canon/.mission-control/server/
  services/artifacts.service.ts                T10 resolveArtifact(id) path-confined to artifacts root
  routes/artifacts.ts                          T10 GET /api/artifacts/:id streams the file
  index.ts                                     T10 mount /api/artifacts
  config.ts                                    T10 add artifactsRoot (env ARTIFACTS_ROOT, default polymath/packages/agents/artifacts)
  test/artifacts.route.test.ts                 T10 serves mp4; rejects traversal (400); 404 missing
.canon/.mission-control/client/src/
  lib/engine.ts                                T11 extend ApprovalContent with RenderedClip-shaped optional fields
  features/approvals/ContentPreview.tsx        T11 render <video> when content_type='video'; keep script preview for 'clip'
  features/approvals/ContentPreview.test.tsx   T11 RTL: <video> for video type, script for clip type
.canon/.claude/skills/polymath/
  surge-render/SKILL.md                        T12 the LLM brief — render approved clip → second pending approval → HALT
.canon/.mission-control/server/services/pty.service.ts (or allowlist module)
                                               T13 add '/surge-render' to engine command allowlist
```

---

## Task 1 — Add artifacts gitignore + render script

**Model/effort:** mechanical → haiku, effort low. **Worktree: yes** (`superpowers:using-git-worktrees`, branch `plan5/t1-scaffold`).

**Files:** edit `polymath/packages/agents/.gitignore`, `polymath/packages/agents/package.json`.

**Steps:**
- [ ] Edit `.gitignore` — append the artifacts root and media globs (drafts/ already present from Plan 4):
```
artifacts/
*.mp4
*.mp3
```
  (Thumbnails live under `artifacts/` so are already covered; the `*.mp4`/`*.mp3` globs are belt-and-braces against stray test output.)
- [ ] Edit `package.json` `scripts` — add after `surge:run`:
```json
    "surge:render": "node --import tsx bin/surge-render.ts"
```
- [ ] Verify nothing breaks: `pnpm -C D:\VFXellence-LTD\polymath\packages\agents run typecheck` (expect PASS — no source changed).
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/.gitignore polymath/packages/agents/package.json
git -C D:\VFXellence-LTD commit -m "Gitignore render artifacts and add surge:render script

- Ignore artifacts/ plus *.mp4 and *.mp3 in agents package
- Add surge:render npm script wiring bin/surge-render.ts"
```

---

## Task 2 — RenderedClip types + ClipDraft regression guard

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t2-types`).

**Files:** create `src/renderTypes.ts`, `test/renderTypes.test.ts`, `test/clipdraft-guard.test.ts`.

**Steps:**
- [ ] Write failing `test/renderTypes.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { makeEmptyRenderReport, isRenderedClip, type RenderedClip } from "../src/renderTypes.js";

describe("RenderedClip types", () => {
  it("makeEmptyRenderReport starts as a real (non-dry) report with no missing capabilities", () => {
    const r = makeEmptyRenderReport();
    expect(r.dryRun).toBe(false);
    expect(r.missing).toEqual([]);
    expect(r.steps).toEqual([]);
    expect(typeof r.renderedAt).toBe("string");
  });

  it("isRenderedClip accepts a full artifact and rejects a script-level draft", () => {
    const full: RenderedClip = {
      sourceDraftPath: "drafts/x/draft.json",
      voiceoverPath: "artifacts/x/vo.mp3",
      visualPaths: ["artifacts/x/01.png"],
      videoPath: "artifacts/x/clip.mp4",
      thumbnailPath: "artifacts/x/thumb.png",
      durationSec: 32,
      renderedAt: new Date().toISOString(),
      renderReport: { dryRun: true, missing: ["ELEVENLABS_API_KEY"], steps: [], renderedAt: new Date().toISOString() },
    };
    expect(isRenderedClip(full)).toBe(true);
    expect(isRenderedClip({ hook: "h", script: "s" })).toBe(false);
  });
});
```
- [ ] Write failing `test/clipdraft-guard.test.ts` (REGRESSION — proves the doctrine guard is untouched):
```ts
import { describe, it, expect } from "vitest";
import { validateDraft } from "../src/validateDraft.js";
import { makeEmptyDraft } from "../src/types.js";

describe("ClipDraft guard remains intact after Plan 5", () => {
  it("hard-rejects a draft carrying render keys", () => {
    const d = makeEmptyDraft("zrodinger") as Record<string, unknown>;
    d.hook = "10 AI tools that replace your job"; d.script = "x ".repeat(60).trim();
    d.shotlist = [{ line: 1, visual: "ui", narration: "n", durationSeconds: 3 }];
    d.hashtags = ["#ai", "#tools", "#tech"];
    d.sourceRefs = [{ label: "PH", confidence: "verified" }];
    d.videoPath = "x.mp4"; d.voiceoverPath = "x.mp3"; d.renderedAt = "now"; d.mp4 = true;
    const res = validateDraft(d as never);
    expect(res.ok).toBe(false);
    expect(res.errors.join(" ")).toMatch(/videoPath|voiceoverPath|renderedAt|mp4/);
  });
});
```
- [ ] Run `pnpm -C ...agents test renderTypes clipdraft-guard` → FAIL (renderTypes missing).
- [ ] Create `src/renderTypes.ts`:
```ts
/** Post-render artifact types. SEPARATE from ClipDraft — these keys are exactly
 *  the ones validateDraft forbids, because this is the rendered output, not the script. */

export interface RenderStep {
  adapter: "voice" | "visual" | "assembly";
  mode: "real" | "dry-run";
  note: string;
}

export interface RenderReport {
  /** true if ANY adapter ran in dry-run (stub) mode. */
  dryRun: boolean;
  /** Capabilities/keys/tools that were absent, forcing dry-run (e.g. "ELEVENLABS_API_KEY"). */
  missing: string[];
  steps: RenderStep[];
  renderedAt: string;
}

export interface RenderedClip {
  /** The approved Plan-4 clip artifact .json this render derives from. */
  sourceDraftPath: string;
  voiceoverPath: string;
  visualPaths: string[];
  videoPath: string;
  thumbnailPath: string;
  durationSec: number;
  renderedAt: string;
  renderReport: RenderReport;
}

export const VIDEO_CONTENT_TYPE = "video" as const;

export function makeEmptyRenderReport(): RenderReport {
  return { dryRun: false, missing: [], steps: [], renderedAt: new Date().toISOString() };
}

export function isRenderedClip(v: unknown): v is RenderedClip {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.sourceDraftPath === "string" &&
    typeof o.voiceoverPath === "string" &&
    Array.isArray(o.visualPaths) &&
    typeof o.videoPath === "string" &&
    typeof o.thumbnailPath === "string" &&
    typeof o.durationSec === "number" &&
    typeof o.renderedAt === "string" &&
    !!o.renderReport && typeof o.renderReport === "object"
  );
}
```
- [ ] Run tests → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/renderTypes.ts polymath/packages/agents/test/renderTypes.test.ts polymath/packages/agents/test/clipdraft-guard.test.ts
git -C D:\VFXellence-LTD commit -m "Add RenderedClip post-render types and ClipDraft guard test

- Add renderTypes.ts: RenderedClip, RenderReport, RenderStep, VIDEO_CONTENT_TYPE
- Add isRenderedClip guard and makeEmptyRenderReport helper
- Add regression test proving validateDraft still rejects render keys"
```

---

## Task 3 — Adapter interfaces + mode selection

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t3-adapter-iface`).

**Files:** create `src/adapters/types.ts`, `test/adapters.types.test.ts`.

**Steps:**
- [ ] Write failing `test/adapters.types.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { selectMode } from "../src/adapters/types.js";

describe("selectMode", () => {
  it("picks real when the capability is present", () => {
    expect(selectMode({ present: true })).toBe("real");
  });
  it("picks dry-run when absent", () => {
    expect(selectMode({ present: false })).toBe("dry-run");
  });
  it("forces dry-run when forceDryRun set, even if present", () => {
    expect(selectMode({ present: true, forceDryRun: true })).toBe("dry-run");
  });
});
```
- [ ] Run → FAIL.
- [ ] Create `src/adapters/types.ts`:
```ts
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
```
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/adapters/types.ts polymath/packages/agents/test/adapters.types.test.ts
git -C D:\VFXellence-LTD commit -m "Add render adapter interfaces and selectMode helper

- Define VoiceAdapter, VisualAdapter, AssemblyAdapter contracts
- Add RenderContext and result types
- Add selectMode: absence forces dry-run, never fail-hard"
```

---

## Task 4 — VoiceAdapter (ElevenLabs real + dry-run)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t4-voice`).

**Files:** create `src/adapters/voice.ts`, `test/voice.adapter.test.ts`.

**Steps:**
- [ ] Write failing `test/voice.adapter.test.ts` — covers: dry-run produces a stub `.mp3` + `step.mode='dry-run'`; env-key absence routes to dry-run; missing-capability bubbles through `selectMode`. Use a tmp `outDir`; assert the stub file exists and is non-empty (clearly-marked placeholder bytes). Do NOT hit ElevenLabs.
```ts
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
```
- [ ] Run → FAIL.
- [ ] Create `src/adapters/voice.ts`. `makeVoiceAdapter()` returns a `VoiceAdapter` whose `render` calls `selectMode({ present: !!process.env.ELEVENLABS_API_KEY, forceDryRun: ctx.forceDryRun })`. Dry-run writes a UTF-8 placeholder `<slug>.mp3` containing a `DRY-RUN ElevenLabs voiceover placeholder` banner + the script text, estimates `durationSec` from word count (~2.5 wps), returns `step.mode='dry-run'`, `note` naming the missing key. Real path (env present, not forced): POST to ElevenLabs TTS, write the returned audio bytes to `<slug>.mp3`, `step.mode='real'`. Real path is env-gated and NOT exercised by tests. AI voice = anonymous Surge voice id from `ELEVENLABS_SURGE_VOICE_ID` env (never owner voice); if absent, fall to dry-run and record `missing:['ELEVENLABS_SURGE_VOICE_ID']`.
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/adapters/voice.ts polymath/packages/agents/test/voice.adapter.test.ts
git -C D:\VFXellence-LTD commit -m "Add ElevenLabs VoiceAdapter with dry-run fallback

- Real path env-gated on ELEVENLABS_API_KEY + SURGE_VOICE_ID
- Dry-run writes marked stub mp3 with estimated duration
- Absence or forceDryRun routes to stub, never fail-hard"
```

---

## Task 5 — VisualAdapter (Higgsfield/Meta.ai real + dry-run)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t5-visual`).

**Files:** create `src/adapters/visual.ts`, `test/visual.adapter.test.ts`.

**Steps:**
- [ ] Write failing `test/visual.adapter.test.ts` — dry-run produces one stub file per shotlist entry (clearly-marked placeholder images), `step.mode='dry-run'` when the Higgsfield CLI is absent. Inject the tool path so tests never spawn `hf.exe`: `makeVisualAdapter({ hfPath: "Z:\\does\\not\\exist\\hf.exe" })` → absence → dry-run; assert `visualPaths.length === draft.shotlist.length` and each file exists.
- [ ] Run → FAIL.
- [ ] Create `src/adapters/visual.ts`. `makeVisualAdapter(opts?)` resolves `hfPath` from `opts.hfPath ?? process.env.HF_PATH ?? "D:\\dev\\sandbox\\hf.exe"`, presence = `existsSync(hfPath)`. `selectMode` decides. Dry-run: for each shotlist entry write `<slug>-<line>.png` placeholder containing the visual description + `DRY-RUN` banner; `step.note` = "Higgsfield/Meta.ai absent". Real path (tool present): spawn `hf.exe` per shot with the visual description as prompt, collect output file paths; `step.mode='real'`. Real path NOT exercised in tests (tool-gated, free tool but still external).
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/adapters/visual.ts polymath/packages/agents/test/visual.adapter.test.ts
git -C D:\VFXellence-LTD commit -m "Add Higgsfield VisualAdapter with dry-run fallback

- Real path spawns hf.exe per shotlist entry when present
- Dry-run writes one marked stub image per shot
- Tool path injectable; absence routes to stub"
```

---

## Task 6 — AssemblyAdapter (HyperFrames real + dry-run)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t6-assembly`).

**Files:** create `src/adapters/assembly.ts`, `test/assembly.adapter.test.ts`.

**Steps:**
- [ ] Write failing `test/assembly.adapter.test.ts` — dry-run produces a stub `<slug>.mp4` AND a stub `<slug>-thumb.png`, `step.mode='dry-run'`, `durationSec` carried from the voice result. Inject HyperFrames availability so tests never invoke it. Assert both files exist and are non-empty placeholders.
- [ ] Run → FAIL.
- [ ] Create `src/adapters/assembly.ts`. `makeAssemblyAdapter(opts?)` resolves availability from `opts.available ?? !!process.env.HYPERFRAMES_BIN`. Dry-run: write a marked `<slug>.mp4` (placeholder bytes/banner) + `<slug>-thumb.png`, `durationSec = voice.durationSec`, `step.mode='dry-run'`. Real path: build an HTML timeline from `voice.voiceoverPath` + `visuals.visualPaths`, invoke HyperFrames HTML→video to emit the mp4, extract first-frame thumbnail; `step.mode='real'`. Real path NOT exercised in tests.
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/adapters/assembly.ts polymath/packages/agents/test/assembly.adapter.test.ts
git -C D:\VFXellence-LTD commit -m "Add HyperFrames AssemblyAdapter with dry-run fallback

- Real path assembles voice + visuals via HyperFrames HTML->video
- Dry-run writes marked stub mp4 plus thumbnail png
- Availability injectable; absence routes to stub"
```

---

## Task 7 — renderClip orchestrator (voice → visuals → assemble)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t7-render-clip`).

**Files:** create `src/renderClip.ts`, `test/renderClip.test.ts`; update `src/index.ts` barrel.

**Steps:**
- [ ] Write failing `test/renderClip.test.ts` with MOCK adapters asserting strict ordering voice→visual→assemble and report aggregation:
```ts
import { describe, it, expect } from "vitest";
import { renderClip } from "../src/renderClip.js";
import { makeEmptyDraft } from "../src/types.js";
import type { VoiceAdapter, VisualAdapter, AssemblyAdapter } from "../src/adapters/types.js";

function draft() {
  const d = makeEmptyDraft("zrodinger");
  d.script = "narration here";
  d.shotlist = [{ line: 1, visual: "ui", narration: "n", durationSeconds: 3 }];
  return d;
}

describe("renderClip", () => {
  it("sequences voice → visual → assemble and aggregates a dry-run report", async () => {
    const calls: string[] = [];
    const voice: VoiceAdapter = { name: "v", render: async () => { calls.push("voice"); return { voiceoverPath: "vo.mp3", durationSec: 30, step: { adapter: "voice", mode: "dry-run", note: "no key" } }; } };
    const visual: VisualAdapter = { name: "vis", render: async () => { calls.push("visual"); return { visualPaths: ["01.png"], step: { adapter: "visual", mode: "real", note: "ok" } }; } };
    const assembly: AssemblyAdapter = { name: "asm", render: async (_d, vo) => { calls.push("assemble"); return { videoPath: "c.mp4", thumbnailPath: "t.png", durationSec: vo.durationSec, step: { adapter: "assembly", mode: "dry-run", note: "stub" } }; } };

    const out = await renderClip(draft(), {
      sourceDraftPath: "drafts/x/draft.json", outDir: "/tmp/x", slug: "demo",
      adapters: { voice, visual, assembly },
    });

    expect(calls).toEqual(["voice", "visual", "assemble"]);
    expect(out.videoPath).toBe("c.mp4");
    expect(out.thumbnailPath).toBe("t.png");
    expect(out.durationSec).toBe(30);
    expect(out.renderReport.dryRun).toBe(true);       // any step dry-run => true
    expect(out.renderReport.missing).toContain("no key");
    expect(out.renderReport.steps).toHaveLength(3);
  });
});
```
- [ ] Run → FAIL.
- [ ] Create `src/renderClip.ts`:
```ts
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
```
- [ ] Add `export * from "./renderClip.js";` and `export * from "./renderTypes.js";` to `src/index.ts`.
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/renderClip.ts polymath/packages/agents/src/index.ts polymath/packages/agents/test/renderClip.test.ts
git -C D:\VFXellence-LTD commit -m "Add renderClip orchestrator sequencing the adapters

- Run voice then visuals then assemble in strict order
- Aggregate per-step modes into RenderReport (any dry-run => dryRun)
- Default to real adapters; allow injection for tests"
```

---

## Task 8 — recordVideoApproval (second pending row)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t8-video-api`).

**Files:** create `src/videoApiClient.ts`, `test/videoApiClient.test.ts`.

**Steps:**
- [ ] Write failing `test/videoApiClient.test.ts` with a MOCK `fetch` asserting the POSTed body is `content_type='video'` with the RenderedClip-shaped `contentJson` (incl. `renderReport`), `previewUrl=videoPath`, `ecosystemId='viral'`, and that the returned `approvalId` is read from the 201 response. NO real network.
```ts
import { describe, it, expect, vi } from "vitest";
import { recordVideoApproval } from "../src/videoApiClient.js";
import type { RenderedClip } from "../src/renderTypes.js";

function rendered(): RenderedClip {
  return { sourceDraftPath: "drafts/x/draft.json", voiceoverPath: "a/vo.mp3", visualPaths: ["a/01.png"],
    videoPath: "a/clip.mp4", thumbnailPath: "a/thumb.png", durationSec: 31, renderedAt: "2026-06-14T00:00:00Z",
    renderReport: { dryRun: true, missing: ["ELEVENLABS_API_KEY"], steps: [], renderedAt: "2026-06-14T00:00:00Z" } };
}

describe("recordVideoApproval", () => {
  it("POSTs a content_type='video' pending row with RenderedClip payload", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "aq_video_1" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await recordVideoApproval(rendered(), { apiBase: "http://localhost:4500/api", taskId: "t1", campaignId: "c1" });
    expect(res.approvalId).toBe("aq_video_1");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:4500/api/approvals");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.ecosystemId).toBe("viral");
    expect(body.contentType).toBe("video");
    expect(body.previewUrl).toBe("a/clip.mp4");
    expect(body.artifactPath).toBe("a/clip.mp4");
    expect(body.contentJson.videoPath).toBe("a/clip.mp4");
    expect(body.contentJson.renderReport.dryRun).toBe(true);
    vi.unstubAllGlobals();
  });
});
```
- [ ] Run → FAIL.
- [ ] Create `src/videoApiClient.ts`:
```ts
import { VIDEO_CONTENT_TYPE, type RenderedClip } from "./renderTypes.js";
import { VIRAL_ECOSYSTEM_ID } from "./types.js";

export interface RecordVideoOptions { apiBase: string; taskId: string; campaignId: string; }
export interface RecordVideoResult { approvalId: string; }

export async function recordVideoApproval(rendered: RenderedClip, opts: RecordVideoOptions): Promise<RecordVideoResult> {
  const payload = {
    ecosystemId: VIRAL_ECOSYSTEM_ID,
    contentType: VIDEO_CONTENT_TYPE,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: rendered.videoPath,
    previewUrl: rendered.videoPath,
    contentJson: rendered,
  };
  const res = await fetch(`${opts.apiBase}/approvals`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`recordVideoApproval: POST /approvals failed (${res.status}: ${await res.text()})`);
  const approval = (await res.json()) as { id: string };
  return { approvalId: approval.id };
}
```
- [ ] Run → PASS. Add barrel export to `src/index.ts`.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/videoApiClient.ts polymath/packages/agents/src/index.ts polymath/packages/agents/test/videoApiClient.test.ts
git -C D:\VFXellence-LTD commit -m "Add recordVideoApproval for the final pre-publish gate

- POST a content_type='video' pending approval row
- Carry full RenderedClip incl renderReport as contentJson
- Set previewUrl and artifactPath to the rendered videoPath"
```

---

## Task 9 — runRender driver + bin (approved-only, HALT)

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t9-driver`).

**Files:** create `src/renderDriver.ts`, `bin/surge-render.ts`, `test/renderDriver.test.ts`.

**Steps:**
- [ ] Write failing `test/renderDriver.test.ts` (mock `fetch` + tmp dir) asserting: (a) `runRender` REFUSES when the fetched approval is not `content_type='clip'` or not `status='approved'` (throws, renders nothing, posts nothing); (b) on a valid approved clip it reads the draft json from `artifact_path`, calls `renderClip` with `forceDryRun:true`, then POSTs exactly ONE new `content_type='video'` approval; (c) returns `{ halted:true, approvalId, videoPath, dryRun:true }`; (d) it NEVER calls any publish endpoint. Stub `fetch` to return the approved clip on `GET /approvals/:id` and a 201 on `POST /approvals`; write a real draft json to the tmp `artifact_path`.
- [ ] Run → FAIL.
- [ ] Create `src/renderDriver.ts`: `runRender(approvalId, opts)` →
  1. `GET ${apiBase}/approvals` (list) or `/approvals/:id`; find the row. If `contentType !== 'clip'` OR `status !== 'approved'` → `throw new Error("runRender: refuses to render a non-approved or non-clip approval")` (logs the reason, renders nothing).
  2. Read + JSON.parse the draft from `artifactPath` → a `ClipDraft`.
  3. `renderClip(draft, { sourceDraftPath: artifactPath, outDir: <artifactsRoot>/<campaign>/<slug>, slug, forceDryRun: opts.forceDryRun ?? !process.env.ELEVENLABS_API_KEY })`.
  4. `recordVideoApproval(rendered, { apiBase, taskId, campaignId })`.
  5. Return `{ halted:true, approvalId: videoApprovalId, videoPath, dryRun: rendered.renderReport.dryRun }`. NO publish, NO task→done.
- [ ] Create `bin/surge-render.ts` — parse `--approval <id> --api <base> [--force-dry-run]`, call `runRender`, print the result JSON, exit. Mirrors `bin/surge-run.ts`.
- [ ] Run → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src/renderDriver.ts polymath/packages/agents/bin/surge-render.ts polymath/packages/agents/test/renderDriver.test.ts
git -C D:\VFXellence-LTD commit -m "Add runRender driver gated on approved clip then HALT

- Refuse to render unless approval is content_type=clip and approved
- Render dry-run by default; record one content_type=video pending row
- Never publish, never mark task done; add bin/surge-render entry"
```

---

## Task 10 — Server artifact-serving route

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t10-artifacts-route`).

**Files:** create `server/services/artifacts.service.ts`, `server/routes/artifacts.ts`, `server/test/artifacts.route.test.ts`; edit `server/config.ts`, `server/index.ts`.

**Steps:**
- [ ] Edit `config.ts` — add `artifactsRoot: env("ARTIFACTS_ROOT", path.join(REPO_ROOT, "polymath", "packages", "agents", "artifacts"))`.
- [ ] Write failing `server/test/artifacts.route.test.ts` (supertest against `createApp`): (a) seed an approval whose `preview_url` points at a real file UNDER `artifactsRoot` (a small `.mp4` placeholder written into a tmp artifactsRoot) → `GET /api/artifacts/:id` returns 200 with `Content-Type: video/mp4` and the bytes; (b) an approval whose `preview_url` escapes the root (`../../etc/x`) → 400; (c) unknown id → 404. Inject `artifactsRoot` via the app deps/config override used by other server tests.
- [ ] Run → FAIL.
- [ ] Create `server/services/artifacts.service.ts`: `resolveArtifact(db, artifactsRoot, id)` → load approval via `ApprovalsService.get(id)`; if missing → `{ missing:true }`; resolve `preview_url` to an absolute path and assert `resolved.startsWith(path.resolve(artifactsRoot))` (else `{ outside:true }`); if file absent → `{ fileMissing:true }`; else `{ filePath, contentType }` (map `.mp4→video/mp4`, `.png→image/png`, `.mp3→audio/mpeg`).
- [ ] Create `server/routes/artifacts.ts`: `GET /:id` → call resolver; 404 on missing/fileMissing, 400 on outside, else `res.type(contentType)` + stream the file.
- [ ] Edit `index.ts` — add `import { createArtifactsRouter }` and `app.use("/api/artifacts", createArtifactsRouter(deps.db, config.artifactsRoot));` (thread `artifactsRoot` through `AppDeps` if the test harness constructs deps directly).
- [ ] Run → PASS. Run the full server suite to confirm no regression.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add ".canon/.mission-control/server/services/artifacts.service.ts" ".canon/.mission-control/server/routes/artifacts.ts" ".canon/.mission-control/server/test/artifacts.route.test.ts" ".canon/.mission-control/server/config.ts" ".canon/.mission-control/server/index.ts"
git -C D:\VFXellence-LTD commit -m "Add GET /api/artifacts/:id route to serve rendered video

- Resolve approval preview_url path-confined to artifactsRoot
- Reject traversal with 400 and missing file/id with 404
- Stream with correct content-type for mp4/png/mp3"
```

---

## Task 11 — ContentPreview <video> for content_type='video'

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t11-content-preview`).

**Files:** edit `client/src/lib/engine.ts`, `client/src/features/approvals/ContentPreview.tsx`, `client/src/features/approvals/ContentPreview.test.tsx`.

**Steps:**
- [ ] Edit `engine.ts` — extend `ApprovalContent` with optional render fields so the video payload typechecks: `videoPath?: string; thumbnailPath?: string; durationSec?: number; renderReport?: { dryRun: boolean; missing: string[]; steps?: unknown[]; renderedAt: string } | string;`. (Keep all existing script fields.)
- [ ] Add a failing RTL test to `ContentPreview.test.tsx`: when called with `contentType='video'` + a content carrying `videoPath`, it renders a `<video>` element whose `src` points at `/api/artifacts/<id>` and shows the `renderReport` (incl. a "DRY-RUN" badge when `dryRun:true`); when `contentType='clip'` it still renders the script/hook/shotlist preview and NO `<video>`. (Pass `contentType` + approval `id` as new props.)
```tsx
it("renders a <video> for content_type='video'", () => {
  render(<ContentPreview approvalId="aq1" contentType="video" content={{ videoPath: "a/clip.mp4", renderReport: { dryRun: true, missing: [], renderedAt: "x" } }} />);
  const v = document.querySelector("video");
  expect(v).toBeTruthy();
  expect(v?.getAttribute("src")).toContain("/api/artifacts/aq1");
  expect(screen.getByText(/dry-run/i)).toBeTruthy();
});
it("keeps script preview for content_type='clip'", () => {
  render(<ContentPreview approvalId="aq2" contentType="clip" content={{ hook: "H", script: "S" }} />);
  expect(document.querySelector("video")).toBeNull();
  expect(screen.getByText("H")).toBeTruthy();
});
```
- [ ] Run → FAIL.
- [ ] Edit `ContentPreview.tsx` — add props `approvalId?: string; contentType?: string`. At the top of the component, if `contentType === 'video'` render a video branch: a `<video controls poster={...thumbnail via /api/artifacts? optional}>` with `src={`/api/artifacts/${approvalId}`}` plus a Render Report `<Section>` (badge "DRY-RUN" + `missing` list when `dryRun`). Otherwise fall through to the existing script preview unchanged. (Wire `approvalId`/`contentType` from `ApprovalCard` where `ContentPreview` is used — verify the call site and pass them.)
- [ ] Run → PASS. Run the client suite.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add ".canon/.mission-control/client/src/lib/engine.ts" ".canon/.mission-control/client/src/features/approvals/ContentPreview.tsx" ".canon/.mission-control/client/src/features/approvals/ContentPreview.test.tsx"
git -C D:\VFXellence-LTD commit -m "Render video preview for content_type=video approvals

- Extend ApprovalContent with RenderedClip optional fields
- ContentPreview shows <video> from /api/artifacts/:id for video type
- Show render report with DRY-RUN badge; keep script preview for clip"
```

---

## Task 12 — /surge-render SKILL.md

**Model/effort:** standard → sonnet, effort high. **Worktree: yes** (`plan5/t12-skill`).

**Files:** create `.canon/.claude/skills/polymath/surge-render/SKILL.md`.

**Steps:**
- [ ] Write `SKILL.md` (fenced-yaml frontmatter like the Plan-4 skills). Content:
  - `name: surge-render`, description: render an APPROVED Zrodinger clip into an mp4 + thumbnail via the adapter pipeline, record a SECOND pending approval (`content_type='video'`), then HALT — no publish.
  - **Scope (read first):** only runs on an already-`approved` `content_type='clip'` row; never renders an unapproved/rejected draft; AI voice is the anonymous Surge voice, never the operator's; brand isolation (zrodinger only).
  - **Paid-tool note:** ElevenLabs real voice costs money → **Boss must approve spend before the real path runs**; default is dry-run (free) and is what runs without `ELEVENLABS_API_KEY`. Higgsfield/Meta.ai/HyperFrames are free but external; absence ⇒ dry-run stub.
  - **Procedure:** resolve the approval id → run `pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:render -- --approval <approvalId> --api http://localhost:4500/api [--force-dry-run]` → read the printed JSON (videoPath, the new video approvalId, dryRun flag) → report one line to the operator.
  - **HALT line (exact):** `HALT after render. No publish. Human approves the rendered video before publish.`
- [ ] Run `/caveman:compress` on the SKILL.md per global doctrine (AI-facing doc).
- [ ] Commit:
```
git -C D:\VFXellence-LTD add ".canon/.claude/skills/polymath/surge-render/SKILL.md"
git -C D:\VFXellence-LTD commit -m "Add /surge-render skill for the render stage

- Render an approved clip to mp4 + thumbnail via the adapter pipeline
- Document Boss-approval-before-spend for the paid ElevenLabs path
- HALT after render: human approves the rendered video before publish"
```

---

## Task 13 — Add /surge-render to the PTY allowlist

**Model/effort:** mechanical → haiku, effort low. **Worktree: yes** (`plan5/t13-allowlist`).

**Files:** edit the Plan-3 engine command allowlist (locate the array containing `'/surge-generate'` — likely `services/pty.service.ts` or a dedicated allowlist module) + its test.

**Steps:**
- [ ] Locate the allowlist via `Grep` for `surge-generate`. Add `'/surge-render'` to the array.
- [ ] Update the corresponding allowlist test to assert `/surge-render` is permitted and a non-allowlisted command is still rejected.
- [ ] Run the server suite → PASS.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add ".canon/.mission-control/server"
git -C D:\VFXellence-LTD commit -m "Allow /surge-render in the PTY engine command allowlist

- Add /surge-render alongside the surge-generate commands
- Update allowlist test to cover the render command"
```

---

## VAULT UPDATE (perform as part of this plan — do NOT defer)

- Append a dated entry to `D:\VFXellence-LTD\polymath\vault\dev\4_orchestrator\changelogs\<today>.md` (create if absent): summarize the render pipeline (adapters, dry-run doctrine, the second `video` approval gate, artifact route). Bullet form, imperative.
- If a tool eval is missing for HyperFrames or Higgsfield under `.canon/5_knowledge/reference/polymath-business/tools/`, add a stub eval noting: free/external, HTML→video (HyperFrames) / image-video (Higgsfield CLI at `D:\dev\sandbox\hf.exe`), and that absence triggers dry-run.
- Update the Plan-5 task tracker row to reflect completion + any deviations.

---

## Self-Review (run before declaring the plan complete)

**Spec coverage:**
- [ ] NEW `RenderedClip` type in its OWN file (`renderTypes.ts`); `ClipDraft`/`validateDraft` untouched (T2 + regression test T2).
- [ ] Adapter pattern with real + dry-run for Voice (ElevenLabs), Visual (Higgsfield/Meta.ai), Assembly (HyperFrames) (T4/T5/T6).
- [ ] Orchestrator `renderClip` sequences voice → visuals → assemble (T7).
- [ ] Render triggered off a `content_type='clip'` approval; driver refuses non-approved/non-clip (T9); `/surge-render` skill + PTY allowlist wire the trigger (T12/T13).
- [ ] SECOND `approval_queue` row `content_type='video'`, `status='pending'`, `previewUrl=videoPath`, `contentJson` incl. `renderReport` (T8).
- [ ] `GET /api/artifacts/:id` serves the video, path-confined (T10); `ContentPreview` renders `<video>` for video type, keeps script preview for clip (T11).
- [ ] `/surge-render` SKILL.md HALT line is exactly "HALT after render. No publish. Human approves the rendered video before publish." (T12).

**No placeholders:** every task ships failing test → impl → passing test → commit with exact `git -C D:\VFXellence-LTD` command. No TODO/stub source left in shipped code (the only "stubs" are the intentional dry-run placeholder media artifacts, which are spec'd output).

**Type consistency:** `RenderedClip`/`RenderReport` identical across engine (`renderTypes.ts`), the `video` approval `contentJson`, the client `ApprovalContent` extension, and Plan 6's consumer contract. `VIDEO_CONTENT_TYPE='video'` is the single constant.

**Doctrine guards present (each backed by a test):**
- [ ] ENV-only creds; `ELEVENLABS_API_KEY`/`SURGE_VOICE_ID` absence → dry-run, never fail-hard (T4); `forceDryRun` cost-safety path tested.
- [ ] Render runs ONLY on an approved clip (T9 refusal test).
- [ ] NO publish / NO task→done / NO scheduler anywhere in T9 driver (T9 asserts no publish endpoint hit).
- [ ] Paid-spend doctrine documented in the skill; default path is free dry-run.
- [ ] Brand isolation: AI voice = anonymous Surge voice id, never owner; no owner identity in artifacts/rows.
- [ ] Artifact route path-confined (T10 traversal-reject test); `*.mp4`/`*.mp3`/`artifacts/` gitignored (T1).
- [ ] `ClipDraft` render-key guard still hard-rejects (T2 regression test).

**Risks flagged (carry into execution):**
- ElevenLabs is PAID → real voice path needs Boss-approved spend; dry-run is free and default. (Mitigated: env-gated + `forceDryRun`.)
- Video serving/preview: large files; the artifact route streams and is path-confined — watch memory on big mp4s (stream, don't buffer).
- Artifact storage + gitignore: rendered media must NOT be committed (`artifacts/`, `*.mp4`, `*.mp3` ignored in T1) — verify `git status` shows no media before each commit.
- HyperFrames / Higgsfield availability: external/free tools may be absent or change CLI surface → dry-run keeps the pipeline green; real paths are tool-gated and untested here, so flag for a manual smoke once tools are confirmed installed.
