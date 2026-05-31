# Vheer

**Category:** AI video generation (free, no login)
**URL:** (verify — likely vheer.ai or similar)
**Captured:** 2026-05-14
**Status:** evaluating
**Ecosystem fit:** viral | signal
**Preference:** 4th — manual supplement. Good for quick tests, not pipeline material.

---

## What it does

Free AI video generation tool requiring no login. Likely wraps open-source models (Wan, Hunyuan, or similar) behind a web frontend. Minimal friction — no account, no API key, just prompt and generate.

## Sources

| Access point | URL | Auth | Cost |
|-------------|-----|------|------|
| Web UI | (verify URL) | None | Free |

**No API. No CLI.** Web-only, same limitation as Meta.ai.

## Integration steps

### Manual use only
1. Navigate to Vheer website
2. Enter text prompt
3. Generate video
4. Download output clip

### Automation: NOT VIABLE
- No known API or programmatic access
- IP-based rate limiting likely (no account = no auth token)
- Cannot script or batch
- Service longevity unknown — free no-login tools are ephemeral

## How it gets automated

**It doesn't.** Same as Meta.ai — manual-only tool. Use for:
- Quick prompt testing before running through local pipeline
- Comparing output against Wan/Hunyuan to calibrate expectations
- One-off reference clips when local GPU unavailable and don't want to burn Higgsfield credits

## Pricing

Free. No login. Likely IP-based rate limiting.

## Strengths

- Zero friction — no account, no login, no payment
- No identity trail — ideal for Surge brand isolation
- Good for rapid prompt experimentation

## Weaknesses

- **No API — cannot automate**
- Unknown rate limits, quality, and output specs
- Commercial use rights unknown
- Service could disappear without notice
- No control over model, resolution, or parameters
- Low confidence in reliability and longevity

## Where it fits in polymath

- **Viral (Surge)**: Manual prompt testing only. No-login is nice but irrelevant if local pipeline (ComfyUI) handles production — local has no identity trail either.
- **Signal**: Occasional quick reference clip.

## Verdict

- [ ] Adopt now
- [x] Park — test quality and verify URL. Useful as manual supplement but not pipeline material.
- [ ] Reject — reason: ___
