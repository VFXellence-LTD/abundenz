# Higgsfield CLI

**Category:** AI video/image generation (CLI-based, multi-model)
**URL:** https://higgsfield.ai
**GitHub:** https://github.com/higgsfield-ai/cli
**Captured:** 2026-05-08
**Updated:** 2026-05-10
**Status:** adopted — free tier, testing phase
**Ecosystem fit:** signal | atelier | conduit
**Binary:** `D:\dev\sandbox\hf.exe` (v0.1.35)
**Account:** vfxellence@gmail.com — free plan

---

## What it does

CLI-driven multi-model AI generation platform. Routes prompts to 16 video models and 19 image models from a single interface. Scriptable — can be wired into automated pipelines via shell commands. Supports image upload, soul ID (face-faithful avatars), marketing studio, and product photoshoot modes.

## Available models + costs

### Video (sorted cheapest first)

| Model | Credits | Best for |
|-------|---------|----------|
| Minimax Hailuo | 6 | **Default — cheapest video gen** |
| Wan 2.7 | 7.5 | Good general purpose |
| Veo 3.1 Lite | 8 | Google model, lite version |
| Kling 3.0 | 10 | High quality |
| Kling 2.6 | TBD | Older version |
| Cinematic Studio 3.0 | TBD | Higgsfield proprietary |
| Seedance 2.0 | 22.5 | Expensive |
| Veo 3.1 | 22 | Expensive |

### Image (sorted cheapest first)

| Model | Credits | Best for |
|-------|---------|----------|
| Flux 2 | 1 | **Default — cheapest image gen** |
| Grok Image | 1 | Alternative cheap |
| Nano Banana Pro | 2 | Higgsfield proprietary |
| Seedream 4.5 | TBD | |
| GPT Image 2 | 7 | Expensive |

## Current strategy

**Free plan: 10 credits.** Use cheapest models for testing:
- Video: Minimax Hailuo (6 credits) — ~1 free video
- Image: Flux 2 (1 credit) — 10 free images

Upgrade once workflow is validated and credit costs justified by revenue.

## CLI usage

```bash
# Check balance
hf account status

# Cost estimate (no generation)
hf generate cost minimax_hailuo --prompt "..."

# Generate video
hf generate create minimax_hailuo --prompt "..."

# Generate image
hf generate create flux_2 --prompt "..."

# Check job status
hf generate list

# Upload media for image-to-video
hf upload ./image.png
```

## Where it fits in polymath

- **Signal**: B-roll and visual hooks for short-form derivatives. Agent 08 (Atomizer) can call `hf generate` to create video clips from pillar transcripts.
- **Atelier**: Product video mockups, animated previews for digital product listings, KDP book trailer generation.
- **Conduit**: Pinterest video pins (higher engagement than static pins).

## Decision rule

Adopted for testing on free tier. Upgrade to paid when: (a) test outputs meet quality bar, (b) video generation is identified bottleneck in active pipeline, (c) credit cost per output < revenue per output.

## Verdict

- [x] Adopt now — free tier testing
- [ ] Park
- [ ] Reject
