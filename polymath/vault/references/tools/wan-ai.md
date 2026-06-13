# Wan AI (Alibaba)

**Category:** AI video generation (open source, local)
**URL:** https://github.com/Wan-Video/Wan2.1
**HuggingFace:** https://huggingface.co/Wan-AI
**License:** Apache 2.0 (fully permissive commercial use)
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal | atelier
**Preference:** 2nd (local) — only 1.3B viable on current hardware (12GB VRAM). 14B needs GPU upgrade.

---

## What it does

Alibaba's open-source video generation model. Multiple sizes: 1.3B (lightweight, consumer GPU) and 14B (high quality, prosumer GPU). Supports text-to-video, image-to-video, video-to-video. Apache 2.0 = cleanest commercial license of any video model.

**Note:** "Wan 2.7" in Higgsfield CLI is the same model family hosted by Higgsfield at 7.5 credits/gen. Running locally = free.

## Sources

| Access point | URL | Auth | Cost |
|-------------|-----|------|------|
| GitHub repo | https://github.com/Wan-Video/Wan2.1 | None | Free |
| HuggingFace weights | https://huggingface.co/Wan-AI | HF account | Free |
| ComfyUI node | `ComfyUI-WanVideoWrapper` | None | Free |
| Higgsfield CLI | `hf generate create wan_2_7 --prompt "..."` | Higgsfield account | 7.5 credits |
| HuggingFace Diffusers | `pip install diffusers` | None | Free (local) |
| Replicate (hosted) | replicate.com | API key | ~$0.02-0.08/gen |

## Integration steps

### Local setup via ComfyUI (1.3B only on current hardware)
1. Install ComfyUI (see [[comfyui]])
2. Install `ComfyUI-WanVideoWrapper` custom node via ComfyUI Manager
3. Download Wan 1.3B weights from HuggingFace → `ComfyUI/models/` directory
4. Load Wan workflow JSON → set prompt → generate
5. Output: MP4, ~480p, 5 seconds (1.3B quality ceiling)

### Local setup via Python/Diffusers
1. `pip install diffusers torch`
2. Download weights: model auto-downloads on first run
3. Generate:
```python
from diffusers import WanPipeline
pipe = WanPipeline.from_pretrained("Wan-AI/Wan2.1-1.3B")
pipe.to("cuda")
video = pipe("a cat walking through a field", num_frames=48).frames
```

### Local setup via standalone CLI
1. `git clone https://github.com/Wan-Video/Wan2.1`
2. `pip install -r requirements.txt`
3. `python generate.py --model 1.3B --prompt "..." --output ./output.mp4`

### Higgsfield CLI (cloud — preferred path until GPU upgrade)
1. `hf generate create wan_2_7 --prompt "..."` (7.5 credits)
2. Gets 14B quality without local hardware

## How it gets automated

**Now (12GB VRAM):**
- Higgsfield CLI for Wan 2.7 (cloud, 7.5 credits) — best quality available now
- Wan 1.3B locally via ComfyUI — free but 480p, acceptable for Shorts drafts
- Hosted APIs (Replicate, fal.ai) for burst volume

**After GPU upgrade (24GB+):**
- Wan 14B locally via ComfyUI — free, 720p-1080p, production quality
- ComfyUI API mode for full automation
- Surge Agent 04 (Visual) submits workflow JSON per scene

### Automation script pattern (works now with 1.3B or after upgrade with 14B)
```python
import requests
COMFY_URL = "http://localhost:8188"

for scene in scenes:
    workflow = load_wan_workflow()
    workflow["prompt_node"]["inputs"]["text"] = scene["prompt"]
    requests.post(f"{COMFY_URL}/prompt", json={"prompt": workflow})
```

## GPU requirements

| Model | VRAM | Speed | Quality | Current hardware? |
|-------|------|-------|---------|-------------------|
| Wan 1.3B | 12-16GB | Fast (~1-2 min) | 480p, draft quality | **YES — fits 12GB** |
| Wan 14B | 24GB+ | Moderate (~3-5 min) | 720p-1080p, production | NO — needs upgrade |
| Wan 14B (quantized) | 16-20GB | Moderate | Slightly reduced | NO — needs upgrade |

## Pricing

Free (Apache 2.0). Higgsfield hosted: 7.5 credits/gen. Replicate: ~$0.02-0.08/gen.

## Strengths

- **Apache 2.0 license — cleanest commercial terms of any video model**
- 1.3B runs on current hardware (12GB VRAM)
- Already validated in Higgsfield CLI (Wan 2.7) — known quality baseline
- Excellent ComfyUI integration
- Diffusers-compatible — standard Python ML ecosystem
- Text-to-video, image-to-video, video-to-video all supported
- Clear upgrade path: 1.3B now → 14B when GPU allows

## Weaknesses

- 1.3B output is 480p draft quality — fine for testing, not for final Surge content
- 14B needs GPU upgrade to run locally
- Model weights are large (14B = ~28GB download)
- Inference slow on consumer hardware

## Where it fits in polymath

- **Viral (Surge)**: Wan 1.3B for local drafts/tests. Higgsfield Wan 2.7 for production quality (cloud). Full local production when GPU upgraded.
- **Signal**: B-roll generation — Higgsfield hosted until GPU upgrade.
- **Atelier**: Product video mockups when activated.

## GPU upgrade trigger

Upgrade justified when: monthly Higgsfield/Replicate spend exceeds ~$30-50/month for 3 consecutive months. At that point, GPU upgrade ROI is positive within 6-12 months.

## Verdict

- [x] Adopt now — test 1.3B locally via ComfyUI, use Higgsfield Wan 2.7 for production quality
- [ ] Park
- [ ] Reject — reason: ___
