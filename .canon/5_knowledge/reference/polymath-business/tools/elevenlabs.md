# ElevenLabs

**Category:** AI voice synthesis / text-to-speech / voice cloning
**URL:** https://elevenlabs.io/ (referral link from source: https://try.elevenlabs.io/ochf0i5ekcd1 — note: creator earns commission on that link; sign up directly at elevenlabs.io to avoid this)
**Captured:** 2026-06-13
**Status:** already in stack — in active use for Viral/Surge voice synthesis. This file documents a tool already adopted, not a net-new evaluation.
**Source:** [[references/articles/2026-06-13_build-your-own-jarvis-toolkit]] (chandlerintel "Build Your Own Jarvis" toolkit, row 2)

---

## What it does

ElevenLabs is an AI audio platform specialising in text-to-speech (TTS) and voice cloning. You provide text; it returns speech in a chosen voice — either one of ElevenLabs' stock voices or a custom clone trained on uploaded audio samples. The clone can replicate cadence, accent, and timbre closely enough to pass as the original speaker in short-form content.

Beyond basic TTS, it offers:
- **Instant Voice Cloning** — trained from a short sample, quick setup (Starter tier and above)
- **Professional Voice Cloning (PVC)** — higher fidelity clone, requires more training audio (Creator tier and above)
- **Dubbing Studio** — translate and re-voice content into other languages in the cloned voice
- **Sound Effects and Music generation** (higher tiers)
- **Speech to Text** transcription
- API access for programmatic integration into agent pipelines

The Jarvis toolkit uses it specifically to give an AI assistant a spoken British voice, illustrating the most common integration pattern: pipe LLM output text into ElevenLabs TTS, play back audio.

---

## Why it matters for polymath

ElevenLabs sits at a critical junction in the polymath stack, and the rules governing its use are non-negotiable. Getting this wrong risks the single biggest asset in the Content ecosystem.

### Voice authenticity doctrine (read carefully)

The owner's real voice is the Content ecosystem's moat. It is what makes the VFX Pipeline vertical defensible. AI voice is explicitly permitted in some contexts and explicitly forbidden in others:

| Use case | Allowed? |
|----------|----------|
| Viral/Surge content narration | AI voice ONLY — this is the primary use case for ElevenLabs |
| Content pillar narration (VFX Pipeline videos) | Owner voice ONLY. AI voice never replaces this. |
| Short patches / missed pickups in Content pieces | AI voice clone OK — for minor repairs only |
| Translated derivatives of evergreen Content pieces | AI voice clone OK |
| Lullaby narration (bedtime stories vertical) | Owner voice ONLY. No AI, no exceptions. |
| AI avatar for organic content (Content ecosystem) | No |

The key division: Surge (Viral) can and should use AI voice throughout — it is an anonymous, high-volume pipeline with no personal identity attached. Content uses the owner's voice as its core differentiator and AI voice only in a supporting/repair role. Lullaby's intimacy with its audience (a child) makes AI voice a categorical non-starter.

### Brand isolation requirement

A cloned voice tied to a personal identity must never appear in Surge content or any anonymous Surge brand. If you create a voice clone of yourself for Content patch work, that clone stays inside the Content ecosystem. Surge narration uses a separate, non-identity-linked voice selection. Crossing this line violates the brand isolation policy in [[shared/brand-isolation/POLICY]] and compromises the anonymity of Surge brands.

---

## Where it would fit

ElevenLabs is already wired into the Viral/Surge pipeline. Its position is the **Voice agent** — step 5 of 9 in the agent sequence:

```
Source → Score → Script → Visual → Voice → Assemble → Caption → Distribute → Track
```

Specs live in `ecosystems/viral/shared/agents/`. The Voice agent receives the finalized script from the Script agent, sends it to ElevenLabs TTS via API, and passes the audio file to the Assemble agent for video composition.

It also has a secondary role in the Content ecosystem as a limited patch tool — only for pickups and translated derivatives, never for primary narration.

It does NOT belong in:
- Content pillar narration (owner records this directly)
- Lullaby (no AI voice under any circumstances)
- Products or Affiliate (no voice narration needed in those ecosystems)

---

## Pricing (verified 2026-06-13 — confirm before upgrading)

Pricing fetched directly from elevenlabs.io/pricing on the capture date. Tiers are credit-based; 1 credit ≈ 1 character of TTS.

| Tier | Monthly price | Credits / month | Key additions |
|------|---------------|-----------------|---------------|
| Free | $0 | 10k (~10 min TTS) | TTS, Speech-to-Text, Voice Design, basic features |
| Starter | $6 | 30k (~30 min) | Commercial licence, Instant Voice Cloning, Dubbing Studio |
| Creator | $22 (first month $11) | 121k (~121 min) | Professional Voice Cloning (higher fidelity), additional credit purchases |
| Pro | $99 | 600k (~600 min) | 44.1kHz PCM audio API output, 192kbps quality |
| Scale | $299 | 1.8M (~1,800 min) | 3 workspace seats, Team Collaboration, 3 PVC slots |
| Business | $990 | 6M (~6,000 min) | Low-latency TTS, 10 PVC slots, 10 workspace seats |
| Enterprise | Custom | Custom | Custom terms, DPA/SLA, BAA, SSO |

For Surge pipeline usage at scale, credit consumption depends on script length × volume. At Creator tier, 121 minutes/month means roughly 60 short-form videos of ~2 minutes each — workable for early-stage testing. A busy Surge pipeline at scale would hit Pro or higher.

The Dubbing Studio feature (Starter+) is relevant if translated derivatives of Content pillar pieces are ever produced.

---

## Real questions before adopting (or upgrading)

Since ElevenLabs is already in use for Surge, the question isn't whether to adopt — it's how to use it cleanly and when to upgrade.

1. **Which voice is Surge using?** It should be a stock ElevenLabs voice or a voice clone with no connection to the owner's identity. Confirm this is the case before any vertical goes live.

2. **Is the owner's cloned voice isolated to Content only?** If a Professional Voice Clone of the owner's voice exists (or gets created), confirm it is never routed to any Surge pipeline or anonymous brand property.

3. **When does Creator tier become insufficient?** At the current phase (pre-launch, manual pipeline) Free or Starter is enough. Once Surge is producing volume, model the monthly character count and project the tier needed. Don't upgrade until actual usage data exists.

4. **Does the Dubbing Studio use case justify the Starter tier on its own?** Translated derivatives of Content evergreen pieces are an eventual revenue multiplier. When you reach that workflow, Starter is the minimum — and the character allowance there is 30 minutes, which is thin for full translated dubs.

5. **Referral link transparency:** The source toolkit links to `try.elevenlabs.io/ochf0i5ekcd1` — a referral link where the toolkit creator earns commission. Use `elevenlabs.io` directly for any sign-up or upgrade.

6. **API key hygiene:** The ElevenLabs API key must never be stored in this vault. Store in environment variables or the secrets manager. See the prohibition in `vault/CLAUDE.md`.

---

## Related tools to evaluate alongside

- **PlayHT** — alternative TTS/voice cloning platform. Often compared to ElevenLabs. Slightly different voice model quality characteristics; worth a head-to-head for Surge voice selection if ElevenLabs quality falls short.
- **Murf** — another TTS platform with studio-grade voices. Less flexible API; better UI for non-technical users. Not a strong fit for agent pipelines.
- **Udio / Suno** — AI music generation (different category, but relevant if Surge verticals need background music beds separate from the voice track). ElevenLabs also offers music generation at higher tiers.
- **Deepgram** — Speech-to-Text. ElevenLabs offers S2T natively now, but Deepgram is the specialist and may outperform for transcript use cases in the Source agent.
- **HeyGen / Synthesia** — AI avatar video generation. These layer a face on top of the voice ElevenLabs produces. If Surge ever moves into talking-head format (rather than voiceover-over-clips), these would be the next evaluation.

---

## Verdict

- [ ] Adopt now
- [x] In use — Viral/Surge Voice agent (AI narration pipeline)
- [ ] Adopt for Content pillar narration — **BLOCKED by voice authenticity doctrine**
- [ ] Adopt for Lullaby — **BLOCKED permanently; owner voice only**
- [ ] Reject
- [ ] Park — revisit

**Summary:** ElevenLabs is the right tool in the right place for Surge. The constraints are not about the tool — they are about where it is and is not permitted to operate. Keep it scoped to Viral/Surge narration and Content patches/translations. Never route a personal voice clone into any Surge brand. Upgrade tier only when actual credit consumption data justifies it.
