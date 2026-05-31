# Meta.ai (Video Generation)

**Category:** AI video generation (free, near-unlimited)
**URL:** https://meta.ai
**Model:** Emu Video / Movie Gen
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal
**Preference:** 5th — manual-only, no automation path

---

## What it does

Meta's free AI video generation via chat interface at meta.ai. Powered by Emu Video / Movie Gen models. Generates short clips (5-10 seconds) from text prompts. Near-unlimited free usage — Meta subsidizes to drive adoption. Also integrated into Instagram, WhatsApp, Facebook.

## Sources

| Access point | URL | Auth | Cost |
|-------------|-----|------|------|
| Meta.ai web | https://meta.ai | Meta account | Free (near-unlimited) |
| Instagram/WhatsApp | In-app | Meta account | Free |

**No API. No CLI. No scriptable access.** Web UI only.

## Integration steps

### Manual use only
1. Go to https://meta.ai
2. Sign in with Meta account (use ecosystem-specific account for brand isolation)
3. Prompt: "Create a video of [description]"
4. Download output clip

### Automation: NOT POSSIBLE
- No public API exists for Meta.ai video generation
- Movie Gen research model not publicly deployed as API
- Scraping web UI violates Meta ToS
- Cannot be integrated into any automated pipeline

## How it gets automated

**It doesn't.** Meta.ai is manual-only. Use for quick one-off generations when testing ideas or generating reference material. Not viable for any automated Surge pipeline.

**Workaround:** Use Meta.ai to test prompt ideas manually → refine prompts → run refined prompts through Wan/Hunyuan locally via ComfyUI.

## Pricing

Free. Near-unlimited generations reported. No published hard limits, but abuse detection likely exists.

## Strengths

- Truly free at high volume
- Zero friction (just chat)
- Good for rapid prompt prototyping

## Weaknesses

- **No API — cannot automate.** This is a dealbreaker for pipeline integration.
- No control over resolution, aspect ratio, or advanced parameters
- Output quality/duration modest vs Veo or Kling
- Commercial use rights unclear in Meta's ToS
- Meta account required — brand isolation friction
- Meta could throttle or remove at any time

## Where it fits in polymath

- **Viral (Surge)**: Manual prompt testing and idea validation only. Not part of automated pipeline.
- **Signal**: Quick reference clip generation during content planning.

Note: Existing Meta.ai entry in tool-stack.md covers free AI image + 5-sec video. This is the same product — update tool-stack.md to note expanded video capabilities rather than treating as separate tool.

## Verdict

- [ ] Adopt now
- [x] Park — useful for manual testing but cannot automate. Low priority.
- [ ] Reject — reason: ___
