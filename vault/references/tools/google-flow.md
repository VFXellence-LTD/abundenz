# Google Flow / Veo (Nano Banana)

**Category:** AI video generation (free tier + cloud API)
**URL:** https://aistudio.google.com (free), https://console.cloud.google.com (Vertex AI API)
**Model:** Veo 2 (current), Veo 3 (announced Google I/O 2025 — includes audio)
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal
**Preference:** 2nd (cloud) — best free cloud option. No GPU required. Higher priority now given 12GB hardware constraint.

---

## What it does

Google DeepMind's video generation model family. "Flow" is the consumer product name; "Nano Banana" is an internal codename. Veo 2 generates up to 8 seconds at 1080p. Veo 3 adds audio generation. Available free via AI Studio, paid via Vertex AI.

**Key advantage on current hardware:** Cloud-based = no GPU needed. Free tier gives 5-10 productions/day at quality matching or exceeding what 12GB local GPU can produce.

## Sources

| Access point | URL | Auth | Cost |
|-------------|-----|------|------|
| Google AI Studio | https://aistudio.google.com | Google account | Free (5-10 gens/day) |
| Gemini app | https://gemini.google.com | Google account | Free (limited) |
| Vertex AI API | Google Cloud Console | API key + billing | Pay-per-use (~$0.02-0.05/sec) |
| Higgsfield CLI | `hf generate create veo_3_1_lite` | Higgsfield account | 8 credits (lite) / 22 credits (full) |

## Integration steps

### Quick start (manual testing)
1. Go to https://aistudio.google.com
2. Sign in with Google account (use ecosystem-specific account for brand isolation)
3. Select video generation → enter prompt → download MP4

### Automation via Vertex AI API
1. Create Google Cloud project
2. Enable Vertex AI API
3. Generate API key or set up service account
4. Install SDK: `pip install google-cloud-aiplatform`
5. Script video generation via REST or Python SDK
6. Output: MP4, 1080p, up to 8 seconds

### Automation via Higgsfield CLI (simpler)
1. Already available: `hf generate create veo_3_1_lite --prompt "..."`
2. Costs 8-22 credits per generation
3. No additional setup needed

## How it gets automated

**Now (12GB GPU — cloud tools are primary):**
- AI Studio free tier for daily production (5-10 gens/day)
- Higgsfield CLI for Veo when AI Studio quota exhausted
- Vertex AI API for burst volume (paid)

**Phase 1 (manual):** Test via AI Studio, build prompt library, evaluate quality.
**Phase 2 (semi-auto):** Vertex AI API calls from Python scripts or Make.com HTTP module.
**Phase 3 (full auto):** Surge Agent 04 (Visual) calls Vertex AI API. When revenue justifies GPU upgrade, shifts to local-first with Veo as cloud fallback for highest quality.

## Pricing

| Tier | Cost | Limit |
|------|------|-------|
| AI Studio free | $0 | ~5-10 generations/day |
| Vertex AI | ~$0.02-0.05/sec of video | Pay-as-you-go |
| Higgsfield | 8-22 credits | Per Higgsfield plan |

## Strengths

- **No GPU required — runs in cloud**
- High quality (Veo 2 competes with Kling, Runway)
- Free tier exists for daily use
- Full API for automation (Vertex AI)
- SynthID watermark is invisible
- 1080p output — better than Wan 1.3B local (480p)

## Weaknesses

- Free tier limited to 5-10/day — not enough for high-volume Surge
- Vertex AI API adds cloud cost
- Google account per ecosystem needed for brand isolation
- Queue times can be long on free tier

## Where it fits in polymath

- **Viral (Surge)**: Primary production-quality cloud source until GPU upgrade. 5-10 free/day covers early Surge volume. Vertex AI API for scale.
- **Signal**: High-quality B-roll for content derivatives.

## Verdict

- [ ] Adopt now
- [x] Park — test quality on free tier, compare against Higgsfield models
- [ ] Reject — reason: ___
