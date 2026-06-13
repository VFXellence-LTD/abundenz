# HunyuanVideo (Tencent)

**Category:** AI video generation (open source, local)
**URL:** https://github.com/Tencent/HunyuanVideo
**HuggingFace:** https://huggingface.co/tencent/HunyuanVideo
**License:** Tencent Hunyuan Community License (commercial use — check license file)
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal | atelier
**Preference:** PARKED — needs 24GB+ VRAM minimum. Not viable on current hardware (12GB).

---

## What it does

Tencent's open-source video generation model. Text-to-video and image-to-video. High quality among open-source models — competes with commercial offerings. Runs locally via Python or ComfyUI.

**Hardware blocker:** Minimum 24GB VRAM. Current GPU is 12GB. Cannot run locally until hardware upgrade.

## Sources

| Access point | URL | Auth | Cost |
|-------------|-----|------|------|
| GitHub repo | https://github.com/Tencent/HunyuanVideo | None | Free |
| HuggingFace weights | https://huggingface.co/tencent/HunyuanVideo | HF account | Free |
| ComfyUI node | `ComfyUI-HunyuanVideoWrapper` | None | Free |
| Replicate (hosted) | https://replicate.com (search HunyuanVideo) | API key | ~$0.03-0.10/gen |
| fal.ai (hosted) | https://fal.ai | API key | ~$0.03-0.10/gen |

## Integration steps

### NOT VIABLE NOW — 24GB+ VRAM required

### When GPU upgraded: Local setup (ComfyUI)
1. Install ComfyUI (see [[comfyui]])
2. Install `ComfyUI-HunyuanVideoWrapper` custom node via ComfyUI Manager
3. Download model weights from HuggingFace → `ComfyUI/models/` directory
4. Load Hunyuan workflow JSON → set prompt → generate
5. Output: MP4, up to ~5 seconds at 720p

### Cloud alternative (available now but costs money)
1. Create Replicate or fal.ai account
2. `pip install replicate` or `pip install fal-client`
3. Call via Python: `replicate.run("tencent/hunyuan-video", input={...})`
4. ~$0.03-0.10 per generation

## How it gets automated

**Now:** Not part of pipeline. Use Wan (1.3B local or 2.7 via Higgsfield) instead.

**After GPU upgrade (24GB+):** ComfyUI API mode. Becomes secondary model behind Wan 14B for hero shots requiring higher quality.

## GPU requirements

| Config | VRAM | Current hardware? |
|--------|------|-------------------|
| Minimum | 24GB (RTX 4090) | **NO — needs upgrade** |
| Recommended | 48GB+ (A6000) | NO |
| Ideal | 80GB (A100/H100) | NO |

## Pricing

Free (open source). Hosted APIs ~$0.03-0.10/generation.

## Strengths

- High quality — best open-source video model alongside Wan 14B
- Fully local = zero marginal cost (when hardware available)
- Scriptable via Python CLI and ComfyUI API
- Text-to-video AND image-to-video

## Weaknesses

- **Cannot run on current hardware (12GB VRAM)** — hard blocker
- Even minimum config needs RTX 4090 tier
- Slow inference even on supported hardware
- License is "Tencent Community" not Apache — less clear than Wan's terms
- Larger model weights than Wan

## Where it fits in polymath

- **Now:** Parked. Not viable until GPU upgrade.
- **After upgrade:** Secondary local model behind Wan 14B. Use for hero shots when Wan quality insufficient.
- **Cloud hosted:** Available via Replicate/fal.ai but adds cost — only use if specific quality need that Wan can't meet.

## GPU upgrade trigger

Same as Wan: upgrade justified when monthly cloud spend exceeds ~$30-50/month for 3 months. Hunyuan becomes available as bonus alongside Wan 14B — same GPU upgrade unlocks both.

## Verdict

- [ ] Adopt now
- [x] Park — hard blocked on GPU. Revisit after hardware upgrade.
- [ ] Reject — reason: ___
