# HyperFrames

**Category:** HTML-to-video rendering engine (project-based, CLI-driven)
**URL:** https://hyperframes.heygen.com/
**GitHub:** https://github.com/heygen-com/hyperframes
**npm package:** `hyperframes`
**Captured:** 2026-06-17
**Status:** evaluating — tool-eval complete (Phase B Epic #2, sub-issue #6); wiring design for #8 produced
**Ecosystem fit:** viral/surge — @zrodinger MP4 render step in the AssemblyAdapter
**Global install on this machine:** `0.5.7` (STALE — do not use for production wiring)
**Latest version:** `0.6.110` (verified via `npx hyperframes@0.6.110 --version` 2026-06-17)

---

## What it does

HyperFrames renders HTML compositions to MP4 (or WebM, MOV, GIF, PNG sequence) using a headless Chromium instance (Puppeteer-managed, auto-downloaded on first render) + FFmpeg for final encoding. The authoring model is plain HTML with `data-*` attributes that define the temporal structure (which element appears, for how long, on which track), plus a GSAP-driven animation system attached to `window.__timelines`. There is no React, no Node bundler — the composition is a static HTML file that the renderer scrubs through frame-by-frame in Chrome.

This is a **project-based tool**: every video is a project directory, not a standalone HTML file. The CLI operates inside or against a project dir. The rendered output path defaults to `renders/<name>.mp4` inside the project and is overridden with `-o/--output <path>`.

## Why it matters for polymath

HyperFrames is the render step in the Surge / @zrodinger pipeline. The `AssemblyAdapter` in `packages/agents/src/adapters/assembly.ts` currently has a dry-run stub for this exact step. The MVP acceptance criterion (spec §MVP) requires that one approved @zrodinger draft produces a **real MP4 via HyperFrames**. This tool is the only confirmed candidate for that step; the eval de-risks the wiring before any adapter code is written.

## Where it fits

```
ClipDraft (title, script, voiceover, visuals)
    → AssemblyAdapter.render(draft, voice, visuals, ctx)
        → [dry-run] write placeholder files
        → [real]    author HyperFrames project dir
                    + run npx hyperframes render -o <slug>.mp4
                    + extract thumbnail via hyperframes snapshot or ffmpeg
        → returns { videoPath, thumbnailPath, durationSec }
```

The adapter is at `D:\VFXellence-LTD\polymath\packages\agents\src\adapters\assembly.ts`.

---

## VERIFIED CLI surface (ground-truth from v0.6.110, captured 2026-06-17)

All commands below were run against `npx hyperframes@0.6.110` in a sandboxed session. This is the authoritative record — the global `0.5.7` install must not be used as reference.

### Top-level subcommands (relevant subset)

| Command | Purpose |
|---------|---------|
| `init [NAME]` | Scaffold a new project directory |
| `render [OPTIONS] [DIR]` | Render a composition to MP4/WebM/etc. |
| `preview [OPTIONS] [DIR]` | Start live preview studio in browser |
| `lint` | Validate composition for common mistakes |
| `snapshot` | Capture key frames as PNG screenshots |
| `inspect` | Inspect rendered visual layout across timeline |
| `compositions` | List all compositions in a project |
| `doctor` | Check system deps (FFmpeg, Chrome, Node) |
| `browser` | Manage the Chrome browser used for rendering |
| `cloud` | Render on HeyGen's cloud (no local Chrome/FFmpeg) |

### `render` — complete verified flags

```
USAGE: hyperframes render [OPTIONS] [DIR]

ARGUMENTS:
  DIR                      Project directory (NOT an HTML file path)

KEY FLAGS:
  -c, --composition=<f>    Render a specific composition HTML (e.g. compositions/intro.html)
                           Omit to render index.html
  -o, --output=<path>      Output path  [default: renders/<name>.mp4]
  -f, --fps=<fps>          Frame rate 1-240  [default: 30]
  -q, --quality=<q>        draft | standard | high  [default: standard]
  --format=<fmt>           mp4 | webm | mov | gif | png-sequence  [default: mp4]
  -w, --workers=<n>        Parallel render workers (or 'auto')  [default: auto]
  --resolution=<r>         landscape (1920×1080) | portrait (1080×1920) | square (1080×1080) | 4k | …
  --variables=<json>       JSON object merged over composition's data-composition-variables defaults
  --variables-file=<path>  JSON file alternative to --variables
  --batch=<path>           JSON array for batch multi-variable renders
  --quiet                  Suppress verbose output
  --strict                 Fail on lint errors
  --docker                 Use Docker for deterministic render
  --gpu                    Use GPU encoding
  --low-memory-mode        Force safe 1-worker profile (auto-detected on <=8 GB RAM)
  --browser-timeout=<s>    Page-navigation timeout in seconds [default: 60]
```

**CRITICAL: No `--thumbnail` flag exists.** The previous adapter call used flags that do not exist:

```typescript
// WRONG — these flags do not exist in any version:
execFile(hyperframes, ["render", htmlPath, "--output", videoPath, "--thumbnail", thumbnailPath])
```

There is also no positional HTML file path — `render` takes a **project directory** (`DIR`), not an HTML path.

### `init` — verified flags

```
USAGE: hyperframes init [OPTIONS] [NAME]

  NAME                     Project name / directory to create
  -e, --example=<name>     Example starter (warm-grain, swiss-grid, blank)
  -v, --video=<path>       Seed a video file into the project
  -a, --audio=<path>       Seed an audio file
  --non-interactive        CI/agent mode — skip prompts
  --skip-transcribe        Skip Whisper transcription of seeded media
  --skip-skills            Skip AI coding skills installation
  --tailwind               Add Tailwind CSS browser-runtime support
  --resolution=<r>         Canvas resolution preset
```

### `preview` — verified flags

```
USAGE: hyperframes preview [OPTIONS] [DIR]

  DIR                      Project directory
  --port=<n>               [default: 3002]
  --no-open                Don't open browser automatically
  --kill-all               Kill all running preview servers
```

---

## Project structure (from `init` scaffold, v0.6.110)

```
my-project/
├── index.html             # Main composition — the render entry point
├── hyperframes.json       # Project config (registry, paths)
├── meta.json              # Project metadata (id, name, createdAt)
├── package.json           # npm scripts: dev/check/render/publish
├── CLAUDE.md              # Composition authoring guide (for AI agents)
├── AGENTS.md              # Agent integration notes
└── compositions/          # Sub-compositions (hyperframes.json paths.blocks)
    └── components/        # Reusable component HTML files
```

`hyperframes.json` example:
```json
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
```

`package.json` scripts wired by `init`:
```json
{
  "scripts": {
    "dev":     "npx --yes hyperframes@0.6.110 preview",
    "check":   "npx --yes hyperframes@0.6.110 lint && npx --yes hyperframes@0.6.110 validate && npx --yes hyperframes@0.6.110 inspect",
    "render":  "npx --yes hyperframes@0.6.110 render",
    "publish": "npx --yes hyperframes@0.6.110 publish"
  }
}
```

The `render` script in `package.json` contains no `-o` flag — the output defaults to `renders/<name>.mp4` relative to the project dir. The flag is added at invocation time when a specific output path is needed.

---

## Composition HTML format (verified from scaffold + docs)

The minimal valid composition:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1920, height=1080" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
  </style>
</head>
<body>
  <!-- Root composition element — defines canvas dimensions + total duration -->
  <div id="root"
       data-composition-id="main"
       data-start="0"
       data-duration="10"
       data-width="1920"
       data-height="1080">

    <!-- Each timed element needs class="clip" + these three attributes: -->
    <div id="title" class="clip"
         data-start="0"
         data-duration="5"
         data-track-index="1"
         style="font-size: 64px; color: #fff;">
      Hello World
    </div>

    <!-- Video clips: muted + separate <audio> element for audio track -->
    <video class="clip" data-start="0" data-duration="6" data-track-index="0"
           src="assets/voiceover.mp4" muted playsinline></video>

    <!-- Audio track -->
    <audio data-start="0" data-duration="6" data-track-index="2"
           data-volume="0.8" src="assets/voiceover.mp3"></audio>
  </div>

  <script>
    // REQUIRED: timelines must be paused + registered on window.__timelines
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
    window.__timelines["main"] = tl;  // key must match data-composition-id
  </script>
</body>
</html>
```

### Key rules (from CLAUDE.md in scaffold)

1. Every timed element needs `data-start`, `data-duration`, and `data-track-index`
2. Timed elements MUST have `class="clip"` — the framework uses this for visibility control
3. Timelines must be paused and registered on `window.__timelines` — key = `data-composition-id` value
4. Videos use `muted` with a separate `<audio>` element for the audio track
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. No non-deterministic code — no `Date.now()`, no `Math.random()`, no network fetches

### Variables system

Compositions can declare variables in the root element:
```html
<div data-composition-id="main" data-composition-variables='{"title": {"type": "string", "default": "My Video"}}'>
```
Read at render time via `window.__hyperframes.getVariables()` inside the composition. Passed to render via `--variables '{"title":"@zrodinger clip 01"}'` or `--variables-file path/to/vars.json`.

---

## Thumbnail extraction

HyperFrames has NO `--thumbnail` flag on `render`. Thumbnail strategies:

1. **`hyperframes snapshot`** — captures key frames as PNG screenshots. Run against the project dir after composing. This is the native approach for visual verification.
2. **FFmpeg extraction** — extract a frame from the rendered MP4: `ffmpeg -ss 0 -i out.mp4 -vframes 1 thumb.png`. This is the simplest approach in an automated pipeline (FFmpeg is already required, and the MP4 exists after render).
3. **`hyperframes inspect`** — inspects visual layout across the timeline (debug/dev tool, not for production thumbnail generation).

The FFmpeg approach is recommended for the AssemblyAdapter: render the MP4, then shell `ffmpeg -ss <t> -i <videoPath> -vframes 1 <thumbnailPath>` to extract frame at time `t` (e.g., 0 or 1 second).

---

## Chromium / Puppeteer behavior

- Chrome is **not a system dependency** — HyperFrames manages its own Puppeteer-controlled Chromium instance.
- First render auto-downloads Chromium to a local cache (inside the `npx` cache or `node_modules/.cache`). No user action required. This takes ~30-60s on first run and is silent on subsequent runs.
- `hyperframes doctor` or `hyperframes browser` can inspect and manage this browser install.
- On `--low-memory-mode` (auto-triggered on machines with <=8 GB RAM), render is pinned to 1 worker and uses screenshot capture instead of native capture.

---

## Runtime dependencies

| Dependency | Required for | Status on this machine |
|-----------|-------------|----------------------|
| Node.js >=22 | CLI itself | Node 22.20 — present |
| FFmpeg | Video encoding | Present (verified in prior recon) |
| Chromium/Puppeteer | Frame capture | Auto-managed by HyperFrames; auto-downloaded on first render |
| `hyperframes` npm package | Render pipeline | `0.5.7` global (stale); `0.6.110` via `npx` |

---

## Install approach — global vs local pinned dep

### Option A: `HYPERFRAMES_BIN` pointing to global install (current adapter pattern)
- Current global: `0.5.7` — stale by 100+ semver bumps
- Fragile: machine state dependency, breaks on global upgrade/reset
- Not reproducible across CI or other devs
- **Verdict: do not use for production wiring**

### Option B: `npx hyperframes@<version>` (recommended)
- No install required — `npx` resolves and caches on first use
- Version pinned at call site — reproducible
- Zero global state side effects
- Works in CI without additional setup
- **Verdict: preferred for the adapter**

### Option C: local `devDependency` in `packages/agents/`
- `pnpm add -D hyperframes@0.6.110` in the agents package
- Resolved from `node_modules/.bin/hyperframes` via `npx` or direct path
- Explicit, auditable dep in `package.json`
- Adds ~node_modules weight for a render dep
- **Verdict: acceptable alternative to B; B is simpler and avoids adding a build dep**

**Recommendation:** Use `npx hyperframes@0.6.110` in the adapter. Pin version in the `execFile` call as a string constant `HYPERFRAMES_VERSION = "0.6.110"`. When upgrading, update the constant and re-run the eval.

### Version to pin: `0.6.110`

This is the latest verified version. The global `0.5.7` is too far behind — the CLI surface may have changed significantly between 0.5.7 and 0.6.110 (the `--thumbnail` flag never existed in 0.6.110, suggesting the adapter was written speculatively without verification).

---

## Version note

- **Global on this machine:** `0.5.7` — do not reference
- **Latest (verified):** `0.6.110` — use via `npx hyperframes@0.6.110`
- The global is stale by 100+ patch/minor versions and may have different CLI flags

---

## Real questions before adopting

1. **What does the MP4 output path look like when `-o` is given an absolute path?** The `--output` flag is documented, but the adapter needs to verify that an absolute path like `D:\path\to\slug.mp4` is accepted without project-relative resolution issues on Windows. (Low risk — FFmpeg paths are generally absolute-safe; verify in #8 wiring test.)

2. **Does `npx hyperframes@0.6.110 render` work without a `package.json`?** The render command takes a `[DIR]` argument, and that dir must be a valid HyperFrames project (has `hyperframes.json` + `index.html`). The adapter will need to create a full project dir structure for each render job, not just an HTML file. This changes the composition authoring logic significantly from the current stub.

3. **What is the Chromium download size and cache location on Windows?** First-render on a fresh machine triggers an auto-download. In the render pipeline, this should not happen at job-submission time. Confirm the cache path (`%LOCALAPPDATA%\ms-playwright` or similar) persists across sessions and does not get cleaned by Windows temp cleanup.

4. **Does the `snapshot` subcommand produce a single PNG or a sequence?** The help text says "Capture key frames as PNG screenshots for visual verification" — unclear whether it can be targeted to a specific timestamp without running a full render first. FFmpeg frame extraction from the rendered MP4 is the safe fallback.

5. **Chromium on Windows — GPU vs SwiftShader?** The `--browser-gpu` flag probes GPU on first launch and falls back to software (SwiftShader) automatically. On the dev machine with a discrete GPU, verify render completes without GPU-related crashes (`--no-browser-gpu` flag forces software path for reproducibility).

6. **HeyGen account / auth requirement?** The CLI has an `auth` subcommand and a `cloud` command for cloud rendering. Verify whether local `render` requires HeyGen auth at all, or whether auth is only needed for `cloud`/`publish`. The `publish` command uploads to hyperframes.dev — irrelevant for the pipeline; local render should be auth-free.

---

## Verdict

- [ ] Adopt now
- [x] Evaluating — wiring design produced (sub-issue #8), real render proof required (#11)
- [ ] Park
- [ ] Reject

The tool is real, the CLI is well-documented, Node 22 + FFmpeg are present, and Chromium auto-manages itself. The critical correction: the adapter's current invocation signature is completely wrong (wrong flags, wrong argument model). The wiring design for sub-issue #8 specifies the correct invocation. Block on completing #8 before declaring adopted.
