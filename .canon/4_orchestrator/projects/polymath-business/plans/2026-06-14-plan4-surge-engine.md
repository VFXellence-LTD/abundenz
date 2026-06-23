# Surge Engine Implementation Plan (Plan 4 of 5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax.

**Goal:** Build the `/surge-generate` Claude Code skill plus a fully-tested `@polymath/agents` TypeScript package that closes the Polymath MVP loop: generate ONE Zrodinger (tech/AI-tools) clip DRAFT at SCRIPT LEVEL, run a hard safeguard gate against the viral-surge POLICY, write the artifact to disk (markdown + json), INSERT an `approval_queue` row (status `pending`) via the live Mission Control API, PATCH the originating task to `in-review`, then HALT. No video render, no ElevenLabs, no visual generation, no publishing, no social accounts.

**Architecture:** The deliverable is two cooperating layers.
1. **Skills (LLM instructions, not unit-testable):** `/surge-generate <campaignId>`, `/surge-safeguard-check`, `/surge-continue` live under `.canon/.claude/skills/polymath/`. The skill runs inside a Claude Code session spawned by Plan 3 with `cwd = D:\VFXellence-LTD\polymath\packages\agents`. It reads the read-only doctrine (viral-formula, Zrodinger vertical spec, hook-library, title-formula, viral-surge safeguards), generates the draft object, then invokes the supporting TS via `node --import tsx` to safeguard-check → writeDraft → recordApproval → halt.
2. **Supporting TS (`@polymath/agents`, fully TDD'd):** pure, deterministic functions the skill orchestrates — a `ClipDraft` schema/types + validator, a `runSafeguardCheck()` policy gate producing a `SafeguardReport {pass, flags}`, a `writeDraft()` artifact writer (markdown + json under a drafts dir), a `recordApproval()` that POSTs the `approval_queue` row and PATCHes the task to `in-review` via the MC API (the server is the single DB writer — the engine NEVER touches better-sqlite3 directly), and a `runGenerate()` driver that ties safeguard → write → record → halt. The LLM produces the creative `ClipDraft`; the TS deterministically validates, gates, persists, and records it.

**Hard scope guards (enforced throughout):**
- SCRIPT-LEVEL DRAFT ONLY. The artifact = `{hook, script, shotlist, caption, hashtags, sourceRefs, safeguardReport}`. No `.mp4`, no voiceover, no image/video prompts-to-render, no CapCut, no posting.
- The engine NEVER publishes and NEVER authenticates to or touches any social account.
- Safeguard check is a HARD GATE: a blocked draft is still written to disk AND still recorded as a `pending` approval with `safeguardReport.pass=false` and its flags (logged, never silently dropped) — a human reviews and rejects it in the Approval Queue. The engine never auto-publishes regardless of pass/fail; pass/fail only annotates the row for the reviewer.
- BRAND ISOLATION: Surge is anonymous. The draft, artifact, caption, and approval row carry NO owner/operator identity — only the Zrodinger sub-brand (Abundenz parent). No "Robin", no personal handles, no cross-ecosystem references.

**Tech Stack:** TypeScript ~6.0 (ESNext modules, `moduleResolution: bundler`, strict), Node 22 (global `fetch`), vitest ^4 (mirrors the MC server test setup), tsx for the runtime driver, pnpm workspace package `@polymath/agents` under `polymath/packages/agents`. Consumes the live Plan-1 API at `http://localhost:4500/api` (camelCase JSON): `POST /api/approvals`, `PATCH /api/tasks/:id/status`, `GET /api/tasks/:id` (via list), `GET /api/campaigns/:id`.

---

## Cross-Plan Contract (must stay identical across Plans 2/3/4)

- **Engine commands (this plan implements):** `/surge-generate <campaignId>`, `/surge-safeguard-check`, `/surge-continue` at `.canon/.claude/skills/polymath/<name>/SKILL.md`. PTY allowlist (Plan 3) = `['/surge-generate','/surge-safeguard-check','/surge-continue']` + `--resume {uuid}`.
- **Session cwd (Plan 3 spawns):** `D:\VFXellence-LTD\polymath\packages\agents`. The skill assumes it runs there.
- **Engine output contract (this plan writes, Plan 2 reads):** read `.canon` doctrine → produce ONE Zrodinger clip DRAFT artifact on disk (`artifactPath`) → run safeguard check → `POST /api/approvals` row `{ecosystemId:'viral', contentType:'clip', taskId, campaignId, artifactPath, contentJson:{hook, script, shotlist, caption, hashtags, sourceRefs, safeguardReport}}` (server forces `status:'pending'`) → `PATCH /api/tasks/:id/status {status:'in-review'}` → HALT.
- **Approval flow (Plan 2 owns the decision):** reviewer reads `GET /api/approvals?status=pending`, then `PATCH /api/approvals/:id/status {status, reviewNotes}`. On `approved` the task → `done` (Plan 1 gate blocks `done` while approval pending — so the engine MUST record the pending approval BEFORE / consistently with leaving the task at `in-review`, never `done`).

## API surface consumed (verified against Plan 1 source)

- `POST /api/approvals` body (camelCase): requires `ecosystemId`; accepts `taskId, campaignId, contentType, artifactPath, previewUrl, contentJson`. Server forces `status='pending'`, returns `201` with the created `Approval`.
- `PATCH /api/tasks/:id/status` body `{ status }`. Valid statuses: `backlog|todo|in-progress|blocked|in-review|done`. Returns `404` if task missing, `409` if `done` requested while a pending approval exists. `in-review` is always allowed. (NOTE: tasks status is `PATCH /api/tasks/:id/status`, NOT `PUT /api/tasks` — verified in `routes/tasks.ts`.)
- `GET /api/campaigns?ecosystem=viral` returns campaign list; engine resolves `campaignId → {ecosystemId, verticalId, taskId?}`. If the campaign cannot be resolved the engine errors loudly (no silent fallback).

---

## File Map

```
polymath/
  packages/
    agents/                                  ← @polymath/agents (NEW package, this plan)
      package.json                           T1 create
      tsconfig.json                          T1 create
      vitest.config.ts                       T1 create
      src/
        types.ts                             T2 ClipDraft / SafeguardReport / ApprovalPayload types
        validateDraft.ts                     T3 ClipDraft shape + scope-guard validator
        safeguard.ts                         T4 runSafeguardCheck() → SafeguardReport
        artifact.ts                          T5 writeDraft() → markdown + json on disk
        apiClient.ts                         T6 recordApproval(): POST approvals + PATCH task
        driver.ts                            T7 runGenerate(): safeguard → write → record → halt
        index.ts                             T7 barrel exports
      bin/
        surge-run.ts                         T7 CLI entry the skill invokes (reads draft JSON from stdin/arg)
      test/
        validateDraft.test.ts                T3
        safeguard.test.ts                    T4
        artifact.test.ts                     T5
        apiClient.test.ts                    T6 (mock fetch)
        driver.test.ts                       T7 (mock fetch + tmp dir)
      drafts/                                created at runtime (gitignored), artifacts land here
.canon/.claude/skills/polymath/
  surge-generate/SKILL.md                    T8 (the LLM brief — generate ONE draft → invoke bin)
  surge-safeguard-check/SKILL.md             T9 (standalone safeguard skill)
  surge-continue/SKILL.md                    T10 (resume / re-run a flagged draft)
```

---

## Task 1 — Scaffold the @polymath/agents package

**Model/effort:** mechanical → haiku. **Worktree: yes** (`superpowers:using-git-worktrees`, branch `plan4/t1-scaffold`).

**Files:**
- Create `polymath/packages/agents/package.json`
- Create `polymath/packages/agents/tsconfig.json`
- Create `polymath/packages/agents/vitest.config.ts`
- Create `polymath/packages/agents/.gitignore`
- Create `polymath/packages/agents/src/index.ts` (placeholder barrel)
- Test `polymath/packages/agents/test/smoke.test.ts`

**Steps:**

- [ ] Write the failing smoke test `test/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("@polymath/agents scaffold", () => {
  it("exposes a version banner", async () => {
    const mod = await import("../src/index.js");
    expect(mod.AGENTS_PACKAGE).toBe("@polymath/agents");
  });
});
```
- [ ] Run, expect FAIL (module/export missing):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test
```
Expected: `Error: Cannot find module '../src/index.js'` (or `AGENTS_PACKAGE` undefined).
- [ ] Create `package.json` (mirrors MC server tooling versions exactly):
```json
{
  "name": "@polymath/agents",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "description": "Polymath agent engines — Surge clip draft generator (script-level MVP)",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "surge:run": "node --import tsx bin/surge-run.ts"
  },
  "engines": { "node": ">=22" },
  "devDependencies": {
    "@types/node": "^24.12.3",
    "tsx": "^4.22.3",
    "typescript": "~6.0.2",
    "vitest": "^4.1.7"
  }
}
```
- [ ] Create `tsconfig.json` (matches MC base compiler options):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "sourceMap": true,
    "types": ["node"],
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src/**/*", "bin/**/*"],
  "exclude": ["dist", "drafts", "test/**"]
}
```
- [ ] Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
```
- [ ] Create `.gitignore`:
```
dist/
drafts/
node_modules/
*.tsbuildinfo
```
- [ ] Create `src/index.ts`:
```ts
export const AGENTS_PACKAGE = "@polymath/agents";
```
- [ ] Install deps and run, expect PASS:
```
pnpm -C D:\VFXellence-LTD\polymath install
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test
```
Expected: `1 passed`.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Scaffold @polymath/agents package with vitest

- Add package.json, tsconfig, vitest.config mirroring MC server tooling
- Add gitignore for dist/ and runtime drafts/
- Add smoke test and placeholder barrel export"
```

---

## Task 2 — Define ClipDraft, SafeguardReport, and payload types

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t2-types`).

**Files:**
- Create `polymath/packages/agents/src/types.ts`
- Test: covered by downstream tasks (types are compile-time; T2 ships the contract only, validated by T3's runtime test). Add `test/types.test.ts` for the structural sanity check below.

**Steps:**

- [ ] Write the failing test `test/types.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { CLIP_CONTENT_TYPE, VIRAL_ECOSYSTEM_ID, makeEmptyDraft } from "../src/types.js";

describe("draft type contract", () => {
  it("pins the cross-plan constants", () => {
    expect(VIRAL_ECOSYSTEM_ID).toBe("viral");
    expect(CLIP_CONTENT_TYPE).toBe("clip");
  });

  it("makeEmptyDraft returns a fully-shaped draft skeleton", () => {
    const d = makeEmptyDraft("zrodinger");
    expect(d.brand).toBe("zrodinger");
    expect(d.hook).toBe("");
    expect(Array.isArray(d.shotlist)).toBe(true);
    expect(Array.isArray(d.hashtags)).toBe(true);
    expect(Array.isArray(d.sourceRefs)).toBe(true);
    expect(d.safeguardReport).toBeNull();
  });
});
```
- [ ] Run, expect FAIL:
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/types.test.ts
```
Expected: `Cannot find module '../src/types.js'`.
- [ ] Create `src/types.ts` (complete):
```ts
/** Cross-plan constants — keep identical to Plan 1/2/3. */
export const VIRAL_ECOSYSTEM_ID = "viral" as const;
export const CLIP_CONTENT_TYPE = "clip" as const;

/** One narrated beat of the script-level draft. No render data — script only. */
export interface ShotlistEntry {
  /** Ordinal, 1-based. */
  line: number;
  /** What appears on screen (text description only — NOT a render prompt). */
  visual: string;
  /** Narration line spoken over this shot. */
  narration: string;
  /** Approx seconds this shot holds. */
  durationSeconds: number;
}

/** A source the draft draws on — for factual traceability (viral-formula constraint). */
export interface SourceRef {
  label: string;
  url?: string;
  /** "verified" | "unverified" — unverified claims must be flagged in narration. */
  confidence: "verified" | "unverified";
}

/** A single safeguard finding. Severity drives pass/fail. */
export interface SafeguardFlag {
  /** Stable rule id, e.g. "hard-ban-3-misinformation", "quality-floor-hook", "ftc-affiliate". */
  rule: string;
  severity: "block" | "flag";
  message: string;
}

/** Output of runSafeguardCheck. pass=false when any block-severity flag exists. */
export interface SafeguardReport {
  pass: boolean;
  flags: SafeguardFlag[];
  checkedAt: string;
}

/** The script-level clip draft. NO video, NO voiceover, NO render assets. */
export interface ClipDraft {
  /** Anonymous sub-brand only — brand isolation. Never an operator identity. */
  brand: string;
  /** First 1-3 seconds. Must satisfy the hook quality floor. */
  hook: string;
  /** Full narration, ~30-45s of spoken script (target 70-160 words). */
  script: string;
  /** Ordered shot-by-shot plan (script level — visual = description, not a prompt to render). */
  shotlist: ShotlistEntry[];
  /** Platform caption. Must carry AI-disclosure + FTC affiliate disclosure when links present. */
  caption: string;
  /** 3-5 niche+trending tags (Zrodinger = tech/AI-tools). */
  hashtags: string[];
  /** Sources the script draws on. */
  sourceRefs: SourceRef[];
  /** Populated by runSafeguardCheck before persistence. */
  safeguardReport: SafeguardReport | null;
}

/** Exact body for POST /api/approvals (camelCase, matches ApprovalsService.create). */
export interface ApprovalPayload {
  ecosystemId: typeof VIRAL_ECOSYSTEM_ID;
  contentType: typeof CLIP_CONTENT_TYPE;
  taskId?: string;
  campaignId?: string;
  artifactPath: string;
  contentJson: {
    hook: string;
    script: string;
    shotlist: ShotlistEntry[];
    caption: string;
    hashtags: string[];
    sourceRefs: SourceRef[];
    safeguardReport: SafeguardReport;
  };
}

export function makeEmptyDraft(brand: string): ClipDraft {
  return {
    brand,
    hook: "",
    script: "",
    shotlist: [],
    caption: "",
    hashtags: [],
    sourceRefs: [],
    safeguardReport: null,
  };
}
```
- [ ] Re-export from `src/index.ts` (append):
```ts
export * from "./types.js";
```
- [ ] Run, expect PASS:
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/types.test.ts
```
Expected: `2 passed`.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents/src polymath/packages/agents/test
git -C D:\VFXellence-LTD commit -m "Add ClipDraft, SafeguardReport, ApprovalPayload types

- Define script-level ClipDraft (hook/script/shotlist/caption/hashtags/sourceRefs)
- Pin VIRAL_ECOSYSTEM_ID and CLIP_CONTENT_TYPE cross-plan constants
- Add SafeguardReport/SafeguardFlag and the camelCase ApprovalPayload contract
- No render/voiceover fields — script-level MVP only"
```

---

## Task 3 — validateDraft(): shape + scope-guard validator

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t3-validate`).

Validates the LLM-produced draft is structurally complete AND honors the scope/brand-isolation guards before anything is persisted. This is NOT the safeguard policy check (T4) — it is the "is this a well-formed, in-scope draft" gate.

**Files:**
- Create `polymath/packages/agents/src/validateDraft.ts`
- Test `polymath/packages/agents/test/validateDraft.test.ts`

**Steps:**

- [ ] Write the failing test `test/validateDraft.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { validateDraft } from "../src/validateDraft.js";
import { makeEmptyDraft, type ClipDraft } from "../src/types.js";

function goodDraft(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script:
      "This free AI tool just killed a $40/month app. " +
      "It runs entirely in your browser, no signup. " +
      "I tested it against the paid version and the output was identical. " +
      "Here is the part nobody mentions: it exports without a watermark. " +
      "Link in bio — and yes, it is genuinely free.",
    shotlist: [
      { line: 1, visual: "Dark UI screen recording, bold text overlay", narration: "This free AI tool just killed a $40/month app.", durationSeconds: 3 },
      { line: 2, visual: "Cursor opening the tool in browser", narration: "It runs entirely in your browser, no signup.", durationSeconds: 4 },
    ],
    caption: "Free > paid, every time. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt listing", url: "https://producthunt.com/x", confidence: "verified" }],
    safeguardReport: null,
  };
}

describe("validateDraft", () => {
  it("accepts a well-formed in-scope draft", () => {
    const r = validateDraft(goodDraft());
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("rejects an empty skeleton", () => {
    const r = validateDraft(makeEmptyDraft("zrodinger"));
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("hook"))).toBe(true);
    expect(r.errors.some((e) => e.includes("script"))).toBe(true);
  });

  it("enforces hashtag count 3-5", () => {
    const d = goodDraft();
    d.hashtags = ["#one", "#two"];
    expect(validateDraft(d).ok).toBe(false);
    d.hashtags = ["#1", "#2", "#3", "#4", "#5", "#6"];
    expect(validateDraft(d).ok).toBe(false);
  });

  it("blocks owner-identity leakage (brand isolation)", () => {
    const d = goodDraft();
    d.caption = "Made by Robin Dutta at VFXellence. #ai";
    const r = validateDraft(d);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.toLowerCase().includes("brand isolation"))).toBe(true);
  });

  it("rejects render/asset fields sneaking in (script-level only)", () => {
    const d = goodDraft() as unknown as Record<string, unknown>;
    d["videoPath"] = "out.mp4";
    const r = validateDraft(d as unknown as ClipDraft);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.toLowerCase().includes("script-level"))).toBe(true);
  });
});
```
- [ ] Run, expect FAIL (`Cannot find module '../src/validateDraft.js'`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/validateDraft.test.ts
```
- [ ] Create `src/validateDraft.ts` (complete):
```ts
import type { ClipDraft } from "./types.js";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/** Identity tokens that must never appear (brand isolation: Surge is anonymous). */
const OWNER_IDENTITY_PATTERNS: RegExp[] = [
  /robin\s+dutta/i,
  /\bvfxellence\b/i,
  /\bhalon\b/i,
  /\bpolymath\b/i,
  /rdutta/i,
];

/** Keys that indicate a rendered/produced asset — out of scope for the script-level MVP. */
const FORBIDDEN_RENDER_KEYS = ["videoPath", "voiceoverPath", "audioPath", "renderedAt", "assets", "mp4", "elevenlabs"];

const ALLOWED_KEYS = new Set<keyof ClipDraft>([
  "brand", "hook", "script", "shotlist", "caption", "hashtags", "sourceRefs", "safeguardReport",
]);

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function validateDraft(draft: ClipDraft): ValidationResult {
  const errors: string[] = [];

  // Scope guard: no render/asset keys (script-level only).
  for (const key of Object.keys(draft as Record<string, unknown>)) {
    if (!ALLOWED_KEYS.has(key as keyof ClipDraft)) {
      errors.push(`Unexpected field "${key}" — script-level draft only, no render/asset data.`);
    }
  }
  for (const k of FORBIDDEN_RENDER_KEYS) {
    if (k in (draft as Record<string, unknown>)) {
      errors.push(`Forbidden render field "${k}" — script-level draft only.`);
    }
  }

  if (!draft.brand || !draft.brand.trim()) errors.push("Missing brand (anonymous sub-brand required).");
  if (!draft.hook || !draft.hook.trim()) errors.push("Missing hook.");
  if (!draft.script || !draft.script.trim()) errors.push("Missing script.");

  const wc = wordCount(draft.script);
  if (draft.script.trim() && (wc < 50 || wc > 180)) {
    errors.push(`Script ~30-45s should be 50-180 words; got ${wc}.`);
  }

  if (!Array.isArray(draft.shotlist) || draft.shotlist.length < 1) {
    errors.push("Shotlist must have at least one entry.");
  }

  if (!Array.isArray(draft.hashtags) || draft.hashtags.length < 3 || draft.hashtags.length > 5) {
    errors.push("Hashtags must number 3-5 (Zrodinger niche + trending).");
  }

  if (!Array.isArray(draft.sourceRefs) || draft.sourceRefs.length < 1) {
    errors.push("At least one sourceRef required (factual traceability).");
  }

  // Brand isolation: no owner identity anywhere in human-visible text.
  const haystack = [draft.brand, draft.hook, draft.script, draft.caption, ...draft.hashtags].join("\n");
  for (const re of OWNER_IDENTITY_PATTERNS) {
    if (re.test(haystack)) {
      errors.push(`Brand isolation violation: owner/operator identity present (matched ${re}).`);
    }
  }

  return { ok: errors.length === 0, errors };
}
```
- [ ] Re-export from `src/index.ts` (append): `export * from "./validateDraft.js";`
- [ ] Run, expect PASS (`5 passed`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/validateDraft.test.ts
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Add validateDraft shape and scope-guard validator

- Require hook/script/shotlist/hashtags(3-5)/sourceRefs and word-count band
- Reject render/asset keys to enforce script-level-only scope
- Block owner-identity leakage to enforce Surge brand isolation"
```

---

## Task 4 — runSafeguardCheck(): the hard policy gate

**Model/effort:** design → opus. **Worktree: yes** (branch `plan4/t4-safeguard`).

Implements the viral-surge POLICY as a deterministic gate: the 7 hard bans (block severity), the content quality floor (block/flag), and FTC/AI-disclosure (flag). Produces a `SafeguardReport {pass, flags}`. `pass=false` iff any `block` flag exists. A `flag`-only report still passes but is surfaced for human review.

**Files:**
- Create `polymath/packages/agents/src/safeguard.ts`
- Test `polymath/packages/agents/test/safeguard.test.ts`

**Steps:**

- [ ] Write the failing test `test/safeguard.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

function clean(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script:
      "This free AI tool just killed a $40/month app. It runs in your browser, no signup. " +
      "I tested it and the output matched the paid version. It even exports with no watermark. " +
      "Genuinely free, link in bio.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
}

describe("runSafeguardCheck", () => {
  it("passes clean Zrodinger content with no flags", () => {
    const r = runSafeguardCheck(clean());
    expect(r.pass).toBe(true);
    expect(r.flags).toEqual([]);
    expect(typeof r.checkedAt).toBe("string");
  });

  it("BLOCKS hate speech (hard ban 2)", () => {
    const d = clean();
    d.script += " Honestly that whole ethnic group is inferior.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-2") && f.severity === "block")).toBe(true);
  });

  it("BLOCKS fabricated health/financial claims (hard ban 3)", () => {
    const d = clean();
    d.script += " This guarantees you a 300% return, no risk.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-3") && f.severity === "block")).toBe(true);
  });

  it("BLOCKS financial advice w/o disclaimer (hard ban 7)", () => {
    const d = clean();
    d.script = "You should put your savings into this coin to get rich fast.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
    expect(r.flags.some((f) => f.rule.startsWith("hard-ban-7"))).toBe(true);
  });

  it("FLAGS missing FTC disclosure when an affiliate CTA is present", () => {
    const d = clean();
    d.caption = "Best tool ever — link in bio to sign up!";
    const r = runSafeguardCheck(d);
    // affiliate CTA present but no #ad / disclosure → flag (not block) → still passes
    expect(r.flags.some((f) => f.rule === "ftc-affiliate-disclosure" && f.severity === "flag")).toBe(true);
    expect(r.pass).toBe(true);
  });

  it("FLAGS missing AI-content disclosure", () => {
    const d = clean();
    d.caption = "Free beats paid. #ai"; // no 'AI-generated'/'AI-assisted'
    const r = runSafeguardCheck(d);
    expect(r.flags.some((f) => f.rule === "ai-disclosure")).toBe(true);
  });

  it("BLOCKS a weak hook (quality floor)", () => {
    const d = clean();
    d.hook = "Hey guys welcome back";
    d.script = d.script.replace(/^[^.]*\./, "Hey guys welcome back.");
    const r = runSafeguardCheck(d);
    expect(r.flags.some((f) => f.rule === "quality-floor-hook" && f.severity === "block")).toBe(true);
    expect(r.pass).toBe(false);
  });

  it("aggregates: pass is false if ANY block flag exists even alongside passing checks", () => {
    const d = clean();
    d.script += " This cures cancer instantly.";
    const r = runSafeguardCheck(d);
    expect(r.pass).toBe(false);
  });
});
```
- [ ] Run, expect FAIL (`Cannot find module '../src/safeguard.js'`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/safeguard.test.ts
```
- [ ] Create `src/safeguard.ts` (complete — heuristic gate; conservative, deterministic):
```ts
import type { ClipDraft, SafeguardFlag, SafeguardReport } from "./types.js";

/** Anti-pattern hook openers from the hook-library (quality floor failure). */
const WEAK_HOOK_PATTERNS: RegExp[] = [
  /^\s*hey\s+guys/i,
  /^\s*so\s+today/i,
  /^\s*in\s+this\s+(video|short)/i,
  /^\s*welcome\s+back/i,
  /^\s*what'?s\s+up/i,
];

/** Hard-ban 2 — hate / demeaning protected groups (punching down). */
const HATE_PATTERNS: RegExp[] = [
  /\b(inferior|subhuman|vermin)\b.*\b(race|ethnic|religion|gender|people|group)\b/i,
  /\b(race|ethnic|religion|gender|people|group)\b.*\b(inferior|subhuman|vermin)\b/i,
  /\bgo back to your country\b/i,
];

/** Hard-ban 3 — fabricated health/news misinformation. */
const MISINFO_PATTERNS: RegExp[] = [
  /\bcures?\s+cancer\b/i,
  /\bmiracle\s+cure\b/i,
  /\b100%\s+(safe|effective|guaranteed)\b/i,
];

/** Hard-ban 7 — financial guarantees / advice presented as guidance. */
const FINANCIAL_GUARANTEE_PATTERNS: RegExp[] = [
  /\bguarantee[ds]?\b.*\b(return|profit|income|money)\b/i,
  /\b\d{2,}%\s*(return|gains?|profit)\b/i,
  /\b(no risk|risk[- ]free)\b.*\b(invest|return|profit)\b/i,
  /\byou should (put|invest|buy).*\b(savings|money|coin|stock|crypto)\b/i,
  /\bget rich (quick|fast)\b/i,
];

/** Affiliate/CTA signals that trigger the FTC disclosure requirement. */
const AFFILIATE_CTA_PATTERNS: RegExp[] = [
  /\blink in bio\b/i,
  /\bsign\s*up\b/i,
  /\buse my (code|link)\b/i,
  /\baffiliate\b/i,
  /\bdiscount code\b/i,
];

const FTC_DISCLOSURE_PATTERNS: RegExp[] = [/#ad\b/i, /\bsponsored\b/i, /\bpaid (link|partnership)\b/i, /\bincludes paid links\b/i, /\baffiliate link\b/i];
const AI_DISCLOSURE_PATTERNS: RegExp[] = [/\bai[- ]generated\b/i, /\bai[- ]assisted\b/i, /\bmade with ai\b/i, /#aigenerated\b/i];

const FINANCIAL_DISCLAIMER_PATTERNS: RegExp[] = [/\bresults (not|may not be) typical\b/i, /\bnot financial advice\b/i, /\bdo your own research\b/i];

function anyMatch(text: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(text));
}

export function runSafeguardCheck(draft: ClipDraft): SafeguardReport {
  const flags: SafeguardFlag[] = [];
  const corpus = [draft.hook, draft.script, draft.caption, ...draft.hashtags].join("\n");
  const hasAffiliateCta = anyMatch(corpus, AFFILIATE_CTA_PATTERNS);

  // --- Hard bans (block) ---
  if (anyMatch(corpus, HATE_PATTERNS)) {
    flags.push({ rule: "hard-ban-2-hate-speech", severity: "block", message: "Content demeans a protected group (punching down)." });
  }
  if (anyMatch(corpus, MISINFO_PATTERNS)) {
    flags.push({ rule: "hard-ban-3-misinformation", severity: "block", message: "Fabricated health/absolute-safety claim." });
  }
  if (anyMatch(corpus, FINANCIAL_GUARANTEE_PATTERNS) && !anyMatch(corpus, FINANCIAL_DISCLAIMER_PATTERNS)) {
    flags.push({ rule: "hard-ban-7-financial-advice", severity: "block", message: "Financial guarantee/advice without a 'results not typical' disclaimer." });
  }

  // --- Quality floor ---
  if (!draft.hook.trim() || anyMatch(draft.hook, WEAK_HOOK_PATTERNS)) {
    flags.push({ rule: "quality-floor-hook", severity: "block", message: "Hook is a known anti-pattern / fails the first-2-seconds promise." });
  }

  // --- FTC affiliate disclosure (flag) ---
  if (hasAffiliateCta && !anyMatch(corpus, FTC_DISCLOSURE_PATTERNS)) {
    flags.push({ rule: "ftc-affiliate-disclosure", severity: "flag", message: "Affiliate CTA present but no FTC disclosure (e.g. #ad / 'includes paid links')." });
  }

  // --- AI content disclosure (flag) ---
  if (!anyMatch(corpus, AI_DISCLOSURE_PATTERNS)) {
    flags.push({ rule: "ai-disclosure", severity: "flag", message: "No AI-generated/assisted disclosure; required by TikTok/YouTube/IG." });
  }

  // --- Unverified factual claims (flag) ---
  const hasUnverified = draft.sourceRefs.some((s) => s.confidence === "unverified");
  if (hasUnverified && !/\b(allegedly|reportedly|according to|the story goes)\b/i.test(corpus)) {
    flags.push({ rule: "factual-accuracy-unverified", severity: "flag", message: "Unverified source referenced without qualifying language." });
  }

  const pass = !flags.some((f) => f.severity === "block");
  return { pass, flags, checkedAt: new Date().toISOString() };
}
```
- [ ] Re-export from `src/index.ts` (append): `export * from "./safeguard.js";`
- [ ] Run, expect PASS (`8 passed`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/safeguard.test.ts
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Add runSafeguardCheck hard policy gate

- Encode hard bans 2/3/7, quality-floor hook, FTC and AI-disclosure checks
- pass=false iff any block-severity flag; flags surfaced for human review
- Deterministic heuristic gate over hook/script/caption/hashtags/sourceRefs"
```

---

## Task 5 — writeDraft(): artifact writer (markdown + json)

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t5-artifact`).

Persists a safeguard-checked draft to disk under a drafts dir, returning the canonical `artifactPath` (the json file) that goes into the approval row. Writes BOTH a human-readable markdown (for the Approval Queue preview, Plan 2) and the machine json. A blocked draft is still written (logged, not dropped) — directory name carries a `BLOCKED-` prefix so it is unmistakable on disk.

**Files:**
- Create `polymath/packages/agents/src/artifact.ts`
- Test `polymath/packages/agents/test/artifact.test.ts`

**Steps:**

- [ ] Write the failing test `test/artifact.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeDraft } from "../src/artifact.js";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

let dir: string;
afterEach(() => { if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true }); });

function draft(report = true): ClipDraft {
  const d: ClipDraft = {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script: "This free AI tool just killed a $40/month app. It runs in your browser. I tested it. AI-generated.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
  if (report) d.safeguardReport = runSafeguardCheck(d);
  return d;
}

describe("writeDraft", () => {
  it("writes json + markdown and returns the json artifactPath", () => {
    dir = mkdtempSync(join(tmpdir(), "surge-"));
    const res = writeDraft(draft(), { draftsDir: dir, campaignId: "camp-1", slug: "free-ai-tool" });
    expect(res.artifactPath.endsWith(".json")).toBe(true);
    expect(existsSync(res.artifactPath)).toBe(true);
    expect(existsSync(res.markdownPath)).toBe(true);
    const parsed = JSON.parse(readFileSync(res.artifactPath, "utf8"));
    expect(parsed.hook).toContain("free AI tool");
    expect(parsed.safeguardReport.pass).toBe(true);
    const md = readFileSync(res.markdownPath, "utf8");
    expect(md).toContain("# Zrodinger Clip Draft");
    expect(md).toContain("Safeguard: PASS");
  });

  it("prefixes the dir with BLOCKED- when the report fails", () => {
    dir = mkdtempSync(join(tmpdir(), "surge-"));
    const d = draft(false);
    d.hook = "Hey guys welcome back";
    d.safeguardReport = runSafeguardCheck(d);
    const res = writeDraft(d, { draftsDir: dir, campaignId: "camp-1", slug: "weak" });
    expect(res.artifactPath).toContain("BLOCKED-");
  });

  it("throws if the draft has no safeguardReport (must check before write)", () => {
    dir = mkdtempSync(join(tmpdir(), "surge-"));
    expect(() => writeDraft(draft(false), { draftsDir: dir, campaignId: "c", slug: "x" })).toThrow(/safeguard/i);
  });
});
```
- [ ] Run, expect FAIL (`Cannot find module '../src/artifact.js'`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/artifact.test.ts
```
- [ ] Create `src/artifact.ts` (complete):
```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { ClipDraft } from "./types.js";

export interface WriteDraftOptions {
  /** Root drafts dir (defaults to <pkg>/drafts at the driver level). */
  draftsDir: string;
  campaignId: string;
  /** Short kebab slug for the clip topic. */
  slug: string;
  /** ISO date for the dir name; defaults to today. */
  date?: string;
}

export interface WriteDraftResult {
  artifactPath: string; // the .json (canonical artifactPath)
  markdownPath: string;
  dir: string;
}

function renderMarkdown(d: ClipDraft): string {
  const r = d.safeguardReport!;
  const flagLines = r.flags.length
    ? r.flags.map((f) => `- [${f.severity.toUpperCase()}] ${f.rule}: ${f.message}`).join("\n")
    : "- none";
  const shots = d.shotlist
    .map((s) => `${s.line}. (${s.durationSeconds}s) **Visual:** ${s.visual}\n   **VO:** ${s.narration}`)
    .join("\n");
  const sources = d.sourceRefs
    .map((s) => `- ${s.label}${s.url ? ` (${s.url})` : ""} — ${s.confidence}`)
    .join("\n");
  return [
    `# Zrodinger Clip Draft`,
    ``,
    `**Brand:** ${d.brand} (anonymous — Abundenz parent)`,
    `**Safeguard: ${r.pass ? "PASS" : "BLOCKED"}** (checked ${r.checkedAt})`,
    ``,
    `## Hook`,
    d.hook,
    ``,
    `## Script (~30-45s)`,
    d.script,
    ``,
    `## Shotlist`,
    shots,
    ``,
    `## Caption`,
    d.caption,
    ``,
    `## Hashtags`,
    d.hashtags.join(" "),
    ``,
    `## Sources`,
    sources,
    ``,
    `## Safeguard flags`,
    flagLines,
    ``,
  ].join("\n");
}

export function writeDraft(draft: ClipDraft, opts: WriteDraftOptions): WriteDraftResult {
  if (!draft.safeguardReport) {
    throw new Error("writeDraft: draft.safeguardReport is null — run runSafeguardCheck before persisting.");
  }
  const date = opts.date ?? new Date().toISOString().slice(0, 10);
  const blocked = draft.safeguardReport.pass ? "" : "BLOCKED-";
  const dirName = `${blocked}${date}-zrodinger-${opts.slug}-${opts.campaignId}`;
  const dir = resolve(opts.draftsDir, dirName);
  mkdirSync(dir, { recursive: true });

  const artifactPath = join(dir, "draft.json");
  const markdownPath = join(dir, "draft.md");
  writeFileSync(artifactPath, JSON.stringify(draft, null, 2), "utf8");
  writeFileSync(markdownPath, renderMarkdown(draft), "utf8");

  return { artifactPath, markdownPath, dir };
}
```
- [ ] Re-export from `src/index.ts` (append): `export * from "./artifact.js";`
- [ ] Run, expect PASS (`3 passed`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/artifact.test.ts
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Add writeDraft artifact writer (json + markdown)

- Persist safeguard-checked draft as draft.json (canonical artifactPath) + draft.md preview
- Prefix dir with BLOCKED- when safeguard fails (logged, never dropped)
- Throw if safeguardReport is null to enforce check-before-write ordering"
```

---

## Task 6 — recordApproval(): POST approval + PATCH task via the API

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t6-apiclient`).

The engine is NOT the DB writer — it calls the live MC API. `recordApproval()` builds the exact `ApprovalPayload`, `POST`s it to `/api/approvals`, then `PATCH`es the task to `in-review`. Tested with a mocked `fetch` so no live server is needed. Asserts payload SHAPE (camelCase, `status` NOT sent, `ecosystemId:'viral'`, `contentType:'clip'`) and ordering.

**Files:**
- Create `polymath/packages/agents/src/apiClient.ts`
- Test `polymath/packages/agents/test/apiClient.test.ts`

**Steps:**

- [ ] Write the failing test `test/apiClient.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { recordApproval } from "../src/apiClient.js";
import { runSafeguardCheck } from "../src/safeguard.js";
import type { ClipDraft } from "../src/types.js";

function draftWithReport(): ClipDraft {
  const d: ClipDraft = {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script: "This free AI tool just killed a $40/month app. It runs in your browser. AI-generated.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
  d.safeguardReport = runSafeguardCheck(d);
  return d;
}

const calls: { url: string; init: RequestInit }[] = [];
beforeEach(() => {
  calls.length = 0;
  globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (String(url).endsWith("/api/approvals")) {
      return new Response(JSON.stringify({ id: "aq_123", status: "pending" }), { status: 201, headers: { "content-type": "application/json" } });
    }
    return new Response(JSON.stringify({ id: "task-1", status: "in-review" }), { status: 200, headers: { "content-type": "application/json" } });
  }) as unknown as typeof fetch;
});
afterEach(() => vi.restoreAllMocks());

describe("recordApproval", () => {
  it("POSTs a camelCase approval row then PATCHes the task to in-review", async () => {
    const res = await recordApproval(draftWithReport(), {
      apiBase: "http://localhost:4500/api",
      taskId: "task-1",
      campaignId: "camp-1",
      artifactPath: "/drafts/x/draft.json",
    });
    expect(res.approvalId).toBe("aq_123");
    expect(res.taskStatus).toBe("in-review");

    // 1st call = POST /api/approvals
    expect(calls[0].url).toBe("http://localhost:4500/api/approvals");
    expect(calls[0].init.method).toBe("POST");
    const body = JSON.parse(String(calls[0].init.body));
    expect(body.ecosystemId).toBe("viral");
    expect(body.contentType).toBe("clip");
    expect(body.taskId).toBe("task-1");
    expect(body.campaignId).toBe("camp-1");
    expect(body.artifactPath).toBe("/drafts/x/draft.json");
    expect("status" in body).toBe(false); // server forces pending
    expect(body.contentJson.hook).toContain("free AI tool");
    expect(body.contentJson.safeguardReport.pass).toBe(true);

    // 2nd call = PATCH /api/tasks/task-1/status {status:'in-review'}
    expect(calls[1].url).toBe("http://localhost:4500/api/tasks/task-1/status");
    expect(calls[1].init.method).toBe("PATCH");
    expect(JSON.parse(String(calls[1].init.body))).toEqual({ status: "in-review" });
  });

  it("throws and does NOT PATCH the task if the approval POST fails", async () => {
    globalThis.fetch = vi.fn(async () => new Response("boom", { status: 500 })) as unknown as typeof fetch;
    await expect(
      recordApproval(draftWithReport(), { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", artifactPath: "/x.json" }),
    ).rejects.toThrow(/approval/i);
  });

  it("throws if safeguardReport is missing (never record an unchecked draft)", async () => {
    const d = draftWithReport();
    d.safeguardReport = null;
    await expect(
      recordApproval(d, { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", artifactPath: "/x.json" }),
    ).rejects.toThrow(/safeguard/i);
  });
});
```
- [ ] Run, expect FAIL (`Cannot find module '../src/apiClient.js'`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/apiClient.test.ts
```
- [ ] Create `src/apiClient.ts` (complete):
```ts
import { CLIP_CONTENT_TYPE, VIRAL_ECOSYSTEM_ID, type ApprovalPayload, type ClipDraft } from "./types.js";

export interface RecordApprovalOptions {
  apiBase: string; // e.g. http://localhost:4500/api
  taskId: string;
  campaignId: string;
  artifactPath: string;
}

export interface RecordApprovalResult {
  approvalId: string;
  taskStatus: string;
}

function buildPayload(draft: ClipDraft, opts: RecordApprovalOptions): ApprovalPayload {
  if (!draft.safeguardReport) {
    throw new Error("recordApproval: safeguardReport is null — never record an unchecked draft.");
  }
  return {
    ecosystemId: VIRAL_ECOSYSTEM_ID,
    contentType: CLIP_CONTENT_TYPE,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: opts.artifactPath,
    contentJson: {
      hook: draft.hook,
      script: draft.script,
      shotlist: draft.shotlist,
      caption: draft.caption,
      hashtags: draft.hashtags,
      sourceRefs: draft.sourceRefs,
      safeguardReport: draft.safeguardReport,
    },
  };
}

export async function recordApproval(draft: ClipDraft, opts: RecordApprovalOptions): Promise<RecordApprovalResult> {
  const payload = buildPayload(draft, opts);

  const approvalRes = await fetch(`${opts.apiBase}/approvals`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!approvalRes.ok) {
    throw new Error(`recordApproval: POST /approvals failed (${approvalRes.status}: ${await approvalRes.text()})`);
  }
  const approval = (await approvalRes.json()) as { id: string };

  const taskRes = await fetch(`${opts.apiBase}/tasks/${opts.taskId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "in-review" }),
  });
  if (!taskRes.ok) {
    throw new Error(`recordApproval: PATCH /tasks/${opts.taskId}/status failed (${taskRes.status}: ${await taskRes.text()})`);
  }
  const task = (await taskRes.json()) as { status: string };

  return { approvalId: approval.id, taskStatus: task.status };
}
```
- [ ] Re-export from `src/index.ts` (append): `export * from "./apiClient.js";`
- [ ] Run, expect PASS (`3 passed`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/apiClient.test.ts
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Add recordApproval API client (POST approval + PATCH task)

- Build camelCase ApprovalPayload (ecosystemId viral, contentType clip, no status)
- POST /api/approvals then PATCH /api/tasks/:id/status to in-review
- Server stays the single DB writer; abort before PATCH if POST fails
- Refuse to record a draft with a null safeguardReport"
```

---

## Task 7 — runGenerate() driver + CLI entry (generate→safeguard→write→record→halt)

**Model/effort:** design/driver → opus. **Worktree: yes** (branch `plan4/t7-driver`).

Ties the pieces together: takes an LLM-produced `ClipDraft` (plus resolution context), validates shape, runs the safeguard gate, persists the artifact, records the pending approval, moves the task to `in-review`, and HALTS — returning a structured result. The CLI `bin/surge-run.ts` reads a draft JSON (from `--draft <path>` written by the skill) plus context flags and calls `runGenerate`. The driver NEVER publishes and NEVER posts when `validateDraft` fails (it errors loudly instead).

**Files:**
- Create `polymath/packages/agents/src/driver.ts`
- Create `polymath/packages/agents/bin/surge-run.ts`
- Update `polymath/packages/agents/src/index.ts` (final barrel)
- Test `polymath/packages/agents/test/driver.test.ts`

**Steps:**

- [ ] Write the failing test `test/driver.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, existsSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGenerate } from "../src/driver.js";
import type { ClipDraft } from "../src/types.js";

let dir: string;
const calls: { url: string; init: RequestInit }[] = [];

function good(): ClipDraft {
  return {
    brand: "zrodinger",
    hook: "This free AI tool just killed a $40/month app.",
    script: "This free AI tool just killed a $40/month app. It runs in your browser, no signup. I tested it against the paid version. AI-generated.",
    shotlist: [{ line: 1, visual: "dark UI", narration: "hook", durationSeconds: 3 }],
    caption: "Free beats paid. AI-generated. #ai",
    hashtags: ["#aitools", "#tech", "#free"],
    sourceRefs: [{ label: "Product Hunt", confidence: "verified" }],
    safeguardReport: null,
  };
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "surge-drv-"));
  calls.length = 0;
  globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (String(url).endsWith("/api/approvals")) {
      return new Response(JSON.stringify({ id: "aq_999", status: "pending" }), { status: 201 });
    }
    return new Response(JSON.stringify({ id: "task-1", status: "in-review" }), { status: 200 });
  }) as unknown as typeof fetch;
});
afterEach(() => {
  vi.restoreAllMocks();
  if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

describe("runGenerate driver", () => {
  it("runs generate→safeguard→write→record→halt for a clean draft", async () => {
    const res = await runGenerate(good(), {
      apiBase: "http://localhost:4500/api",
      taskId: "task-1",
      campaignId: "camp-1",
      slug: "free-ai-tool",
      draftsDir: dir,
    });
    expect(res.halted).toBe(true);
    expect(res.safeguard.pass).toBe(true);
    expect(res.approvalId).toBe("aq_999");
    expect(res.taskStatus).toBe("in-review");
    expect(existsSync(res.artifactPath)).toBe(true);
    expect(JSON.parse(readFileSync(res.artifactPath, "utf8")).safeguardReport.pass).toBe(true);
    // approvals POSTed then task PATCHed — engine recorded, did not publish
    expect(calls[0].url).toContain("/api/approvals");
    expect(calls[1].url).toContain("/api/tasks/task-1/status");
    expect(calls).toHaveLength(2); // NO publish call ever
  });

  it("still writes + records a BLOCKED draft (logged, not dropped) and halts", async () => {
    const d = good();
    d.hook = "Hey guys welcome back";
    const res = await runGenerate(d, { apiBase: "http://localhost:4500/api", taskId: "task-1", campaignId: "camp-1", slug: "weak", draftsDir: dir });
    expect(res.safeguard.pass).toBe(false);
    expect(res.artifactPath).toContain("BLOCKED-");
    expect(res.approvalId).toBe("aq_999"); // still recorded for human rejection
    expect(res.halted).toBe(true);
  });

  it("errors loudly and records NOTHING when the draft is malformed (validateDraft fail)", async () => {
    const d = good();
    d.hashtags = ["#only-one"]; // < 3
    await expect(
      runGenerate(d, { apiBase: "http://localhost:4500/api", taskId: "t", campaignId: "c", slug: "x", draftsDir: dir }),
    ).rejects.toThrow(/validation/i);
    expect(calls).toHaveLength(0); // nothing written/recorded
  });
});
```
- [ ] Run, expect FAIL (`Cannot find module '../src/driver.js'`):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test test/driver.test.ts
```
- [ ] Create `src/driver.ts` (complete):
```ts
import { validateDraft } from "./validateDraft.js";
import { runSafeguardCheck } from "./safeguard.js";
import { writeDraft } from "./artifact.js";
import { recordApproval } from "./apiClient.js";
import type { ClipDraft, SafeguardReport } from "./types.js";

export interface GenerateOptions {
  apiBase: string;
  taskId: string;
  campaignId: string;
  slug: string;
  draftsDir: string;
  date?: string;
}

export interface GenerateResult {
  halted: true;
  safeguard: SafeguardReport;
  artifactPath: string;
  markdownPath: string;
  approvalId: string;
  taskStatus: string;
}

/**
 * Closes the MVP loop for ONE script-level Zrodinger clip draft.
 * generate(by LLM, passed in) -> validate -> safeguard -> write -> record -> HALT.
 * NEVER publishes. NEVER touches social accounts. A blocked draft is still
 * written + recorded (pending, pass=false) for human review — never silently dropped.
 */
export async function runGenerate(draft: ClipDraft, opts: GenerateOptions): Promise<GenerateResult> {
  const validation = validateDraft(draft);
  if (!validation.ok) {
    throw new Error(`runGenerate: draft validation failed — ${validation.errors.join("; ")}`);
  }

  const report = runSafeguardCheck(draft);
  draft.safeguardReport = report;

  const written = writeDraft(draft, {
    draftsDir: opts.draftsDir,
    campaignId: opts.campaignId,
    slug: opts.slug,
    date: opts.date,
  });

  const recorded = await recordApproval(draft, {
    apiBase: opts.apiBase,
    taskId: opts.taskId,
    campaignId: opts.campaignId,
    artifactPath: written.artifactPath,
  });

  // HALT. No publish. No account access. Human reviews in the Approval Queue.
  return {
    halted: true,
    safeguard: report,
    artifactPath: written.artifactPath,
    markdownPath: written.markdownPath,
    approvalId: recorded.approvalId,
    taskStatus: recorded.taskStatus,
  };
}
```
- [ ] Create `bin/surge-run.ts` (complete — the CLI the skill invokes):
```ts
#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGenerate } from "../src/driver.js";
import type { ClipDraft } from "../src/types.js";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const draftPath = arg("draft");
  const taskId = arg("task");
  const campaignId = arg("campaign");
  const slug = arg("slug") ?? "clip";
  const apiBase = arg("api") ?? "http://localhost:4500/api";

  if (!draftPath || !taskId || !campaignId) {
    console.error("Usage: surge-run --draft <draft.json> --task <taskId> --campaign <campaignId> [--slug <slug>] [--api <base>]");
    process.exit(2);
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const draftsDir = resolve(here, "..", "drafts");
  const draft = JSON.parse(readFileSync(resolve(draftPath), "utf8")) as ClipDraft;

  const result = await runGenerate(draft, { apiBase, taskId, campaignId, slug, draftsDir });
  // Machine-readable result for the skill to read back.
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(`surge-run failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
```
- [ ] Finalize `src/index.ts`:
```ts
export const AGENTS_PACKAGE = "@polymath/agents";
export * from "./types.js";
export * from "./validateDraft.js";
export * from "./safeguard.js";
export * from "./artifact.js";
export * from "./apiClient.js";
export * from "./driver.js";
```
- [ ] Run full suite + typecheck, expect PASS (all tests green, no type errors):
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test
pnpm -C D:\VFXellence-LTD\polymath\packages\agents run typecheck
```
Expected: driver `3 passed`, total across files `22 passed`; `tsc --noEmit` exits 0.
- [ ] Commit:
```
git -C D:\VFXellence-LTD add polymath/packages/agents
git -C D:\VFXellence-LTD commit -m "Add runGenerate driver and surge-run CLI entry

- Tie validate -> safeguard -> writeDraft -> recordApproval -> HALT
- Blocked drafts still written + recorded (pending, pass=false) for review
- Abort with no side effects when draft validation fails
- bin/surge-run.ts reads draft json + context flags, prints structured result
- NEVER publishes, NEVER touches social accounts"
```

---

## Task 8 — /surge-generate SKILL.md (the LLM brief)

**Model/effort:** design → opus. **Worktree: yes** (branch `plan4/t8-skill-generate`).

The skill is the LLM-facing brief that runs in the spawned session (`cwd = packages/agents`). It loads the doctrine, generates ONE in-scope `ClipDraft`, writes it to a temp json, and invokes `surge-run`. NOT unit-testable — verified by a dry-run description (below) and by the fact its only side-effecting step delegates to the fully-tested CLI.

**Files:**
- Create `.canon/.claude/skills/polymath/surge-generate/SKILL.md`

**Steps:**

- [ ] Create `SKILL.md` with the established frontmatter convention (markdown `# Skill:` title + fenced yaml block, matching content-atomizer/niche-locker). Full content:
````md
# Skill: Surge Generate

```yaml
name: surge-generate
description: Generate ONE script-level Zrodinger (tech/AI-tools) viral clip DRAFT, safeguard-check it, write the artifact, record a pending approval, move the task to in-review, then HALT. No video render, no voiceover, no publishing, no social accounts.
triggers:
  - "/surge-generate <campaignId>"
  - Spawned by Mission Control session start for a Surge campaign
ecosystems: [surge]
arguments:
  - campaignId (required): the campaign this draft belongs to
```

---

## Scope (READ FIRST — non-negotiable)

- Produce exactly ONE clip draft at SCRIPT LEVEL: `{hook, script, shotlist, caption, hashtags, sourceRefs}`. NO `.mp4`, NO voiceover, NO image/video generation, NO CapCut. Those are later autonomy stages — not this skill.
- NEVER publish. NEVER log into or touch any social account. The skill ends at "pending approval + task in-review".
- BRAND ISOLATION: Surge is anonymous. Use only the `zrodinger` sub-brand (Abundenz parent). Never reference the operator, "Robin", VFXellence, Halon, Polymath, or any other ecosystem in the draft text.
- The safeguard check is a HARD GATE handled by the supporting TS. A blocked draft is still written + recorded for human review — you do NOT discard it and you do NOT try to "fix and republish".

## Inputs to load (read-only doctrine)

You run with `cwd = D:\VFXellence-LTD\polymath\packages\agents`. Read these before writing anything:

1. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\viral-formula.md` — the SCRIPT step rules (hook first, no filler, escalate pacing, short sentences, end on payoff).
2. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\verticals\tech\README.md` — the Zrodinger vertical spec (tone "informed insider", no face, dark UI, content formats, hook patterns, source material). This is the vertical you write for.
3. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\hook-library.md` — pull from the "Tech / AI Tools (Zrodinger-specific)" hooks.
4. `D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral\shared\playbooks\title-formula.md` — apply [NUMBER][ADJECTIVE][TOPIC][ENFORCEMENT] + the "you" rule to the caption/title angle.
5. `D:\VFXellence-LTD\.canon\1_controller\standards\polymath-business\safeguards\viral-surge.md` — the POLICY. Internalize the 7 hard bans, quality floor, FTC + AI disclosure. Write so the draft passes.

## Procedure

1. **Resolve the campaign.** Call `GET http://localhost:4500/api/campaigns?ecosystem=viral`, find the row whose `id` matches `<campaignId>`. Capture its `verticalId` and the associated task id (the campaign's task; if absent, query `GET /api/tasks?ecosystem=viral` for the in-progress Surge task tied to this campaign). You need `taskId` and `campaignId` for the recording step. If you cannot resolve them, STOP and report — do not invent ids.
2. **Pick a topic.** From the Zrodinger source-material types (Product Hunt / HN / TikTok Shop trending) choose ONE concrete tool/comparison. Keep it real and current; if you are not certain a claim is true, mark its sourceRef `confidence: "unverified"` and use qualifying language ("reportedly", "the listing claims").
3. **Generate the draft** as a `ClipDraft` object (the shape is defined in `src/types.ts`):
   - `brand`: `"zrodinger"`.
   - `hook`: one line, < 15 words, a Zrodinger-specific hook. Never an anti-pattern ("Hey guys", "So today", "In this video").
   - `script`: ~30-45s of narration, 50-180 words. Hook first, no filler, short punchy sentences, one curiosity loop, end on payoff. Include an AI disclosure cue and (if it pushes an affiliate CTA) an FTC-safe disclosure.
   - `shotlist`: 3-8 entries, each `{line, visual (on-screen description only), narration, durationSeconds}`. Dark UI / screen-recording style, no face.
   - `caption`: platform caption built with the title formula; MUST include an AI-generated disclosure; include an FTC disclosure (e.g. "#ad" / "includes paid links") if any affiliate/sign-up CTA is present.
   - `hashtags`: 3-5, tech/AI-tools niche + 1 trending.
   - `sourceRefs`: at least one `{label, url?, confidence}`.
   - `safeguardReport`: leave `null` — the TS fills it.
4. **Write the draft to a temp json**, e.g. `./.tmp-draft.json` in the package dir (use the Write tool).
5. **Invoke the driver** (this does safeguard → write artifact → record approval → PATCH task → halt):
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:run -- --draft ./.tmp-draft.json --task <taskId> --campaign <campaignId> --slug <kebab-topic>
   ```
6. **Read the printed JSON result.** Report to the operator (one line): the safeguard verdict (PASS/BLOCKED + flag count), the `artifactPath`, the `approvalId`, and that the task is now `in-review`.
7. **HALT.** Do nothing else. Do not publish. Do not open the next campaign. The human reviews the draft in the Mission Control Approval Queue.

## Dry-run verification (how to confirm the skill is correct without an LLM)

Hand-author a sample `ClipDraft` json and run step 5 against a running MC server (or the mocked tests). Expect: a `draft.json` + `draft.md` under `packages/agents/drafts/`, a new `pending` row from `GET /api/approvals?status=pending&ecosystem=viral` whose `contentJson.safeguardReport` is present, and the task at `in-review`. A deliberately weak hook ("Hey guys") must produce a `BLOCKED-`-prefixed dir AND still appear as a pending approval with `pass:false` — proving the gate logs rather than drops.

## Related

- `src/driver.ts` / `bin/surge-run.ts` — the tested engine this skill drives
- `surge-safeguard-check` skill — standalone re-check of a draft
- `surge-continue` skill — resume / re-run after changes-requested
````
- [ ] Verify the skill file parses and the frontmatter matches convention (compare structure to `content-atomizer/SKILL.md`). No automated test — this is the dry-run description above.
- [ ] Run caveman compression per global rule (AI-facing doc):
```
/caveman:compress D:\VFXellence-LTD\.canon\.claude\skills\polymath\surge-generate\SKILL.md
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add .canon/.claude/skills/polymath/surge-generate
git -C D:\VFXellence-LTD commit -m "Add /surge-generate skill brief

- Instruct the session to load surge doctrine and generate ONE script-level draft
- Delegate safeguard/write/record/halt to the tested surge-run CLI
- Enforce script-level-only scope, no publish, no accounts, brand isolation"
```

---

## Task 9 — /surge-safeguard-check SKILL.md (standalone gate)

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t9-skill-safeguard`).

A standalone skill to re-run the safeguard gate on an existing draft json without regenerating — used during review or by `surge-continue`. Thin wrapper over the tested `runSafeguardCheck`.

**Files:**
- Create `.canon/.claude/skills/polymath/surge-safeguard-check/SKILL.md`

**Steps:**

- [ ] Create `SKILL.md`:
````md
# Skill: Surge Safeguard Check

```yaml
name: surge-safeguard-check
description: Re-run the viral-surge safeguard policy gate against an existing Zrodinger clip draft json and report pass/flags. Read-only — does not write artifacts, records nothing, publishes nothing.
triggers:
  - "/surge-safeguard-check <draftJsonPath>"
  - Re-validating a draft during review or after edits
ecosystems: [surge]
```

---

## Scope

- Pure check. Loads a `ClipDraft` json, runs the SAME gate the engine uses, prints the `SafeguardReport`. No artifact write, no approval row, no task change, no publish.

## Inputs

- `D:\VFXellence-LTD\.canon\1_controller\standards\polymath-business\safeguards\viral-surge.md` — the policy this gate encodes (7 hard bans, quality floor, FTC + AI disclosure). Read it so you can explain any flag in plain language.

## Procedure

1. With `cwd = D:\VFXellence-LTD\polymath\packages\agents`, run a one-liner against the tested function:
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents exec node --import tsx -e "import('./src/safeguard.js').then(async m=>{const fs=await import('node:fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(JSON.stringify(m.runSafeguardCheck(d),null,2));})" <draftJsonPath>
   ```
2. Read the printed `{pass, flags, checkedAt}`. For each flag, cite the policy section it maps to (e.g. `hard-ban-2-hate-speech` → POLICY §"Hard Bans 2").
3. Report a one-line verdict + the flag list. HALT.

## Dry-run verification

Run against a clean sample draft → `pass:true, flags:[]`. Run against a draft whose caption has an affiliate CTA but no `#ad` → a single `ftc-affiliate-disclosure` flag at `flag` severity with `pass:true`. Run against a draft claiming "guaranteed 300% return" → a `hard-ban-7` block flag with `pass:false`.

## Related

- `src/safeguard.ts` — the tested gate this skill calls
- `surge-generate` — full generation loop that runs this gate inline
````
- [ ] Run caveman compression:
```
/caveman:compress D:\VFXellence-LTD\.canon\.claude\skills\polymath\surge-safeguard-check\SKILL.md
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add .canon/.claude/skills/polymath/surge-safeguard-check
git -C D:\VFXellence-LTD commit -m "Add /surge-safeguard-check standalone skill

- Read-only re-check of a draft json against the tested safeguard gate
- Maps each flag to its viral-surge POLICY section; writes/records/publishes nothing"
```

---

## Task 10 — /surge-continue SKILL.md (resume / re-run)

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t10-skill-continue`).

Resume skill for the PTY allowlist (`--resume {uuid}` flows through Plan 3). When a draft was `changes-requested`/`rejected` (task back to `in-progress` per Plan 2), this re-enters the generate loop with the reviewer's notes, producing a fresh draft + a fresh pending approval. Still HALTS at in-review. No publish.

**Files:**
- Create `.canon/.claude/skills/polymath/surge-continue/SKILL.md`

**Steps:**

- [ ] Create `SKILL.md`:
````md
# Skill: Surge Continue

```yaml
name: surge-continue
description: Resume a Surge campaign after a reviewer requested changes or rejected the prior draft. Reads the review notes, generates a fresh script-level draft addressing them, records a new pending approval, moves the task back to in-review, then HALTS. No publish, no accounts.
triggers:
  - "/surge-continue <campaignId>"
  - Resuming after an approval was rejected / changes-requested (task back at in-progress)
ecosystems: [surge]
```

---

## Scope

- Same hard scope as `/surge-generate`: script-level draft only, no render/voiceover/visual gen, NEVER publish, NEVER touch accounts, Surge brand isolation. The only difference is this run is informed by the prior review notes.

## Inputs

- Same doctrine set as `/surge-generate` (viral-formula, Zrodinger spec, hook-library, title-formula, viral-surge policy).
- The prior decision: `GET http://localhost:4500/api/approvals?ecosystem=viral` — find the most recent terminal (`rejected` / `changes-requested`) row for this campaign and read its `reviewNotes` and `contentJson`.

## Procedure

1. Resolve `<campaignId>` → `campaignId` + `taskId` (as in `/surge-generate`).
2. Fetch the prior approval's `reviewNotes`. If none found, fall back to behaving exactly like `/surge-generate`.
3. Generate a FRESH `ClipDraft` that explicitly addresses the notes (e.g. stronger hook, add FTC disclosure, swap the tool). Do not reuse a blocked draft verbatim.
4. Write it to `./.tmp-draft.json` and invoke the SAME driver:
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:run -- --draft ./.tmp-draft.json --task <taskId> --campaign <campaignId> --slug <kebab-topic>
   ```
5. Report the new safeguard verdict, `artifactPath`, `approvalId`, and that the task is back at `in-review`. HALT.

## Dry-run verification

Given a campaign whose last approval is `changes-requested` with note "hook too weak, add #ad", a run should produce a new draft.json with a stronger hook and an FTC disclosure in the caption, a new pending approval, and the task at `in-review` — without ever publishing.

## Related

- `surge-generate` — the first-pass loop this mirrors
- `src/driver.ts` — shared engine
````
- [ ] Run caveman compression:
```
/caveman:compress D:\VFXellence-LTD\.canon\.claude\skills\polymath\surge-continue\SKILL.md
```
- [ ] Commit:
```
git -C D:\VFXellence-LTD add .canon/.claude/skills/polymath/surge-continue
git -C D:\VFXellence-LTD commit -m "Add /surge-continue resume skill

- Re-enter the generate loop using prior reviewer notes after a rejection
- Produce a fresh draft + pending approval, task back to in-review, then HALT
- Same hard scope: no render, no publish, no accounts, brand isolation"
```

---

## Task 11 — Wire @polymath/agents into the workspace + final verification

**Model/effort:** integration → sonnet. **Worktree: yes** (branch `plan4/t11-verify`).

Confirms the new package is discoverable by the pnpm workspace (`packages/*` already globs it), the full test suite is green, typecheck passes, and an optional end-to-end smoke against a live MC server records a real pending approval. Per `superpowers:verification-before-completion`, run every command and confirm output before claiming done.

**Files:**
- Modify `polymath/packages/agents/package.json` (only if a workspace dep on `@polymath/types` is wanted — OPTIONAL; the package is self-contained, so skip unless types reuse is needed)
- No new test files; this task runs the full gates.

**Steps:**

- [ ] Confirm workspace discovery (the existing `pnpm-workspace.yaml` already has `packages/*`):
```
pnpm -C D:\VFXellence-LTD\polymath install
pnpm -C D:\VFXellence-LTD\polymath ls --depth -1 --filter @polymath/agents
```
Expected: `@polymath/agents` listed.
- [ ] Run the full agents suite + typecheck, confirm green:
```
pnpm -C D:\VFXellence-LTD\polymath\packages\agents test
pnpm -C D:\VFXellence-LTD\polymath\packages\agents run typecheck
```
Expected: all test files pass (types 2, validateDraft 5, safeguard 8, artifact 3, apiClient 3, driver 3, smoke 1); `tsc --noEmit` exits 0.
- [ ] OPTIONAL live e2e (only if a dev MC server is running on :4500). Start it, seed a viral campaign + task, hand-author a clean draft json, run `surge:run`, then assert via the API:
```
pnpm -C D:\VFXellence-LTD\.canon\.mission-control dev
# (separate shell) hand-author sample-draft.json, then:
pnpm -C D:\VFXellence-LTD\polymath\packages\agents run surge:run -- --draft ./sample-draft.json --task <seededTaskId> --campaign <seededCampaignId> --slug live-smoke
```
Then `GET http://localhost:4500/api/approvals?status=pending&ecosystem=viral` should show the new row with `contentType:'clip'` and a `safeguardReport`, and `GET http://localhost:4500/api/tasks?ecosystem=viral` should show the task at `in-review`. Tear down the seeded rows after.
- [ ] Commit (only if package.json changed; otherwise this task produces no diff and just records the verification in the changelog):
```
git -C D:\VFXellence-LTD add polymath/packages/agents/package.json
git -C D:\VFXellence-LTD commit -m "Finalize @polymath/agents workspace wiring

- Confirm pnpm workspace discovery and full green test suite + typecheck
- Document the live e2e smoke against the Mission Control API"
```

---

## VAULT UPDATE (every task appends to the changelog)

Each task, on completion, appends a bullet to `D:\VFXellence-LTD\polymath\vault\dev\4_orchestrator\changelogs\2026-06-14.md` (create if absent): task id, branch, files touched, test count, one-line outcome. Do NOT write a separate summary doc — the changelog is the record. When the plan completes, note in `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\` tracker that Plan 4 closed the MVP loop (one approved draft, no publish, no accounts).

---

## Self-Review

**Spec coverage**
- `/surge-generate` skill (T8), `/surge-safeguard-check` (T9), `/surge-continue` (T10) — all three commands on the Plan 3 PTY allowlist exist at `.canon/.claude/skills/polymath/<name>/SKILL.md` with the established `# Skill:` + fenced-yaml frontmatter convention. ✔
- ONE script-level draft `{hook, script, shotlist, caption, hashtags, sourceRefs}` → safeguard → write artifact → INSERT approval_queue `pending` → task `in-review` → HALT (T7 driver, asserted in `driver.test.ts` including "no publish call ever"). ✔
- Safeguard hard gate: 7 hard bans (encodes the testable subset — hate/misinfo/financial as block; impersonation/copyright/minors are content-pattern bans the LLM avoids and the human reviewer catches), quality floor (hook), FTC + AI disclosure (T4, 8 tests). Blocked draft is logged not dropped — written with `BLOCKED-` prefix AND recorded as pending `pass:false` (T5 + T7 tests). ✔
- Supporting TS in `@polymath/agents`: schema/types (T2), `writeDraft()` markdown+json (T5), `recordApproval()` via API not direct DB (T6). ✔
- Driver entry tying generate→safeguard→write→record→halt (T7 `runGenerate` + `bin/surge-run.ts`). ✔
- TDD: schema (T2/T3), safeguardReport logic (T4), recordApproval payload shape with mock fetch (T6) — all unit-tested; skill verified by dry-run descriptions (T8/T9/T10). ✔
- Scope guards: no video/ElevenLabs/visual (validateDraft rejects render keys, T3; types carry no asset fields, T2); never publishes / never touches accounts (driver makes exactly 2 fetch calls — approvals + task — asserted `calls).toHaveLength(2)`, T7); brand isolation (validateDraft blocks owner identity, T3). ✔

**No placeholders** — every code step ships complete, runnable code (types, validator, safeguard, artifact writer, API client, driver, CLI, three SKILL.md files). No TODOs, no stubs.

**Type consistency with the schema/API above**
- `POST /api/approvals` body is camelCase and omits `status` (server forces `pending`) — matches `ApprovalsService.create` exactly; `ApprovalPayload` carries `ecosystemId:'viral'`, `contentType:'clip'`, `taskId`, `campaignId`, `artifactPath`, `contentJson{...safeguardReport}` — matches the engine output contract. ✔
- Task transition uses `PATCH /api/tasks/:id/status {status:'in-review'}` (verified against `routes/tasks.ts`, NOT `PUT /api/tasks`); `in-review` is a valid `TaskStatus`; the engine deliberately leaves the task at `in-review` (never `done`) so the Plan 1 "no done with pending approval" gate is never tripped by the engine. ✔
- `approval_queue` / `tasks` field names and statuses match the shared schema; `content_json` stored as JSON string server-side, sent as a camelCase object from the engine. ✔
- Tooling versions (vitest ^4.1.7, typescript ~6.0.2, tsx ^4.22.3, @types/node ^24) mirror the live MC server `package.json`; tsconfig mirrors the MC base (ESNext / bundler / strict). ✔
