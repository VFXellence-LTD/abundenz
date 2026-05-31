# ComfyUI

**Category:** AI generation orchestration (local, open source)
**URL:** https://github.com/comfyanonymous/ComfyUI
**License:** GPL-3.0 (tool itself). Generated output governed by model license.
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal | atelier
**Preference:** BACKBONE — orchestration layer for all local models. Install now, limited to lightweight models on 12GB VRAM.

---

## What it does

Node-based local GUI and API for running AI image and video generation models. Visual workflow builder — chain models, upscalers, controlnets, caption overlays, and post-processing into reproducible pipelines saved as JSON. The key value: **one tool runs everything local.**

ComfyUI is a framework, not a model. It runs:
- **Video:** Wan, Hunyuan, AnimateDiff, CogVideo, LTX-Video
- **Image:** Stable Diffusion, Flux, SDXL
- **Post-processing:** Real-ESRGAN upscaling, ControlNet, IP-Adapter

## Current hardware constraint

**12GB VRAM GPU.** This limits available models:

| Works now (12GB) | Needs upgrade (24GB+) |
|-------------------|-----------------------|
| Wan 1.3B (video, 480p) | Wan 14B (video, 720p-1080p) |
| Flux 2 (images) | Hunyuan Video |
| SDXL (images) | Multiple models loaded simultaneously |
| AnimateDiff (short clips) | Full resolution pipelines |
| Real-ESRGAN (upscaling) | |

**ComfyUI is still worth installing now** — image generation and Wan 1.3B work fine. Workflows built now transfer directly when GPU is upgraded.

## Sources

| Component | URL | Notes |
|-----------|-----|-------|
| Main repo | https://github.com/comfyanonymous/ComfyUI | Clone or portable install |
| ComfyUI Manager | https://github.com/ltdrdata/ComfyUI-Manager | One-click custom node installer |
| Wan node | `ComfyUI-WanVideoWrapper` | Install via Manager |
| Hunyuan node | `ComfyUI-HunyuanVideoWrapper` | Install via Manager (post-upgrade) |
| Windows portable | GitHub releases page | Pre-packaged, no Python setup |
| Model weights | HuggingFace / CivitAI | Download per model |

## Integration steps

### Step 1: Install ComfyUI
```bash
# Option A: Git clone (requires Python 3.10+, CUDA toolkit)
git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
pip install -r requirements.txt

# Option B: Windows portable (easier — recommended for 12GB GPU)
# Download from GitHub releases, extract, run
```

### Step 2: Install ComfyUI Manager
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager
```

### Step 3: Install model nodes (12GB-compatible)
1. Launch ComfyUI: `python main.py --listen`
2. Open browser: http://localhost:8188
3. ComfyUI Manager → Install Custom Nodes
4. Install: `ComfyUI-WanVideoWrapper` (for Wan 1.3B video)
5. Restart ComfyUI

### Step 4: Download model weights (12GB-compatible)
1. Wan 1.3B: `huggingface-cli download Wan-AI/Wan2.1-1.3B --local-dir ComfyUI/models/wan/`
2. Flux 2 (images): download from HuggingFace → `ComfyUI/models/checkpoints/`

### Step 5: Build workflow templates
1. Build video gen workflow in GUI (model → prompt → generate → save)
2. Export as JSON: Save button → `wan_1.3b_workflow.json`
3. Store templates in `ecosystems/viral/shared/workflows/comfyui/`

### Step 6: Enable API mode (automation)
```bash
python main.py --listen 0.0.0.0 --port 8188
```

## How it gets automated

### API architecture
ComfyUI exposes REST API at `http://localhost:8188`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/prompt` | POST | Submit workflow JSON for execution |
| `/history` | GET | Check job status and results |
| `/view` | GET | Download generated output |
| `/queue` | GET | View pending jobs |
| WebSocket `:8188/ws` | WS | Real-time progress updates |

### Automation script pattern
```python
import json, requests, time

COMFY_URL = "http://localhost:8188"

def generate_video(prompt_text, workflow_path="wan_1.3b_video.json"):
    with open(workflow_path) as f:
        workflow = json.load(f)
    
    workflow["6"]["inputs"]["text"] = prompt_text
    
    r = requests.post(f"{COMFY_URL}/prompt", json={"prompt": workflow})
    prompt_id = r.json()["prompt_id"]
    
    while True:
        history = requests.get(f"{COMFY_URL}/history/{prompt_id}").json()
        if prompt_id in history:
            return history[prompt_id]["outputs"]
        time.sleep(2)
```

### Phased automation plan

**Now (12GB VRAM):**
- ComfyUI for images (Flux 2, SDXL) — free, unlimited
- ComfyUI for draft video (Wan 1.3B, 480p) — free, draft quality
- Higgsfield CLI for production video — cloud, costs credits
- Cloud APIs (Veo, Replicate) for burst quality needs

**After GPU upgrade (24GB+):**
- ComfyUI for ALL video (Wan 14B, Hunyuan) — free, production quality
- Higgsfield/Veo as cloud fallback only
- Full Surge Agent 04 integration via API mode

### Model selection logic (current hardware)
```
IF need == "image":              → ComfyUI + Flux 2 (local, free)
IF need == "draft_video":        → ComfyUI + Wan 1.3B (local, free, 480p)
IF need == "production_video":   → Higgsfield CLI (cloud, credits)
IF need == "highest_quality":    → Google Veo API (cloud, paid)
```

### Integration with Make.com / n8n
ComfyUI API is standard HTTP — callable from Make.com HTTP module or n8n HTTP Request node. Works now for image generation pipeline.

## GPU reality check

| Use case | VRAM needed | Works on 12GB? |
|----------|-------------|----------------|
| Image gen (Flux, SDXL) | 8-10GB | **YES** |
| Video draft (Wan 1.3B) | 12GB | **YES (tight)** |
| Video production (Wan 14B) | 24GB+ | NO |
| Video quality (Hunyuan) | 24GB+ | NO |
| Upscaling (Real-ESRGAN) | 2-4GB | **YES** |

## Pricing

Free (GPL-3.0). All costs are hardware:
- Electricity for GPU inference
- Disk space for model weights (~10-20GB for 12GB-compatible models)
- GPU amortization (future upgrade)

## Strengths

- **Runs every open-source model from one interface**
- **Full REST API for automation** — scriptable, batchable, headless
- **Workflow JSON = reproducible pipelines** — version control, share, iterate
- **Works on 12GB VRAM** for images and draft video
- **Investment is future-proof** — workflows built now work on upgraded GPU
- **No per-generation cost** for local models

## Weaknesses

- 12GB VRAM limits video to Wan 1.3B (480p draft quality)
- Learning curve for node-based UI (mitigated by importing workflow JSONs)
- Custom node ecosystem fragmented (version conflicts)
- Dependency management can be painful
- Model weights consume disk space

## Where it fits in polymath

**ComfyUI is the local backbone — install now even on 12GB.**

- **Now:** Image pipeline (Flux 2 for thumbnails, product mockups) + draft video (Wan 1.3B for testing prompts before spending Higgsfield credits).
- **After upgrade:** Full video production pipeline. Wan 14B + Hunyuan for all Surge content.

### Relationship to other tools

| Tool | Relationship to ComfyUI |
|------|------------------------|
| Wan 1.3B | Runs INSIDE ComfyUI now (12GB) |
| Wan 14B | Runs INSIDE ComfyUI after GPU upgrade |
| Hunyuan | Runs INSIDE ComfyUI after GPU upgrade |
| Higgsfield CLI | Cloud production path UNTIL GPU upgrade |
| Google Veo | Cloud fallback for highest-quality shots |
| Meta.ai | Manual testing only — no connection |
| Vheer | Manual testing only — no connection |

## Verdict

- [x] Adopt now — install for image gen + Wan 1.3B drafts. Workflows transfer to upgraded GPU.
- [ ] Park
- [ ] Reject — reason: ___
