---
name: polymath-pitfalls
description: Use this skill whenever the operator is making a decision about adding a tool, ecosystem, monetization stream, or workflow change to the polymath system. It surfaces the specific failure modes that have been identified during the system's design and forces them to be checked before commitment. Trigger this skill on any prompt that mentions adding a new tool, starting a new ecosystem, expanding to a new platform, adopting a new monetization stream, or changing the build sequence.
---

# Polymath Pitfalls

A defensive skill. The operator has correctly identified a real opportunity (multi-channel AI-leveraged passive income), but most operators in this space fail in predictable ways. This skill is the checklist that runs before any new commitment of money or attention.

## When to invoke

Run this skill when the operator says any of:
- "Should I also add..."
- "Let's start [new ecosystem / new platform / new product]"
- "I saw this tool, should I get it"
- "What about [new monetization stream]"
- "I want to skip ahead to..."
- Anything that adds scope before the existing scope is producing reliable revenue

Run it silently in the background of every architectural decision. It exists to catch the operator at the moment of expansion temptation, which is when polymath systems usually break.

## The fourteen pitfalls

Each pitfall has: the symptom, what triggers it, and the specific check.

---

### 1. Pre-validation tool adoption
**Symptom:** Subscribing to RevenueCat / Arcads / a paywall service / a CRM before there's a product to put behind it.
**Trigger:** "This tool will help me when I…"
**Check:** Is there a paying customer or validated demand for what this tool serves? If no, the tool is a distraction. Park in `references/tools/`.

### 2. Splitting attention across ecosystems
**Symptom:** Building Atelier or Lullaby while Signal is still in Phase 0/1.
**Trigger:** Excitement about a new ecosystem; reels showing someone else's success in a different niche.
**Check:** Is the existing primary ecosystem in Phase 2 (per Operation Signal §1.1)? If no, the new ecosystem stays parked. Directory structure is fine. Building agents is not.

### 3. Brand-thesis blending
**Symptom:** Mentioning Signal in Atelier marketing, using personal voice in Atelier products, cross-promoting between ecosystems.
**Trigger:** "It would be more efficient if I just…"
**Check:** Re-read `shared/brand-isolation/POLICY.md`. The whole architecture collapses if blending occurs. Efficiency is not the goal; uncorrelated risk is.

### 4. Voice authenticity erosion
**Symptom:** Using AI-cloned voice for primary content, using AI avatars in Signal pieces, letting AI-generated content sneak into the pillar pipeline.
**Trigger:** "It'll save 10 minutes if I just…"
**Check:** Operation Signal §4.3 is explicit. The owner's real voice is the entire moat. AI voice is acceptable ONLY for: short patches, missed pickups, translated derivatives of evergreen content. Never primary track.

### 5. Platform monoculture
**Symptom:** 70%+ of revenue from one platform; no email list; no owned audience asset.
**Trigger:** Easy growth on one platform makes diversification feel optional.
**Check:** Is there a newsletter or owned-audience asset growing in parallel? If no, every revenue dollar is rented from an algorithm. Force the diversification before it's needed.

### 6. Sunk-cost ecosystem
**Symptom:** Continuing to invest in an ecosystem because of months already spent, despite kill-switch criteria being met.
**Trigger:** "Just one more month and I'll figure it out."
**Check:** Read `controller/kill-switch-criteria.md`. If a condition is met, the 24-hour cooling period applies, then a real decision must be made. Months invested are not a reason to continue.

### 7. The "AI passive income" content trap
**Symptom:** R&D references are dominated by reels and Skool communities promising the same thing the operator is building, sold as a course.
**Trigger:** Meta ad targeting. The algorithm has classified the operator as a buyer.
**Check:** Whose actual revenue is verifiable? Most "AI passive income" educators make money from teaching, not from doing. Verify the seller's claims before adopting their methods.

### 8. Niche drift
**Symptom:** Signal pillar content covering 5 different topics by month 4, chasing whatever performed last week.
**Trigger:** A non-niche piece outperforms a niche piece once. Algorithm rewards make this feel correct.
**Check:** Operation Signal §2.1 said one niche locked for 90 days minimum. Drift before then is panic, not strategy. After 90 days, drift is allowed only with explicit revisit of the niche brief.

### 9. Over-engineered automation
**Symptom:** Building Agent 13 before Agent 1 has run for 30 days. Spending weeks on a Make.com pipeline before publishing the first pillar.
**Trigger:** Engineering instinct + the satisfaction of building.
**Check:** Operation Signal §8: build the manual version, then automate the slowest step. If a stage hasn't run manually for 30 days, do not automate it.

### 10. Sponsor / affiliate drift
**Symptom:** Promoting affiliates that don't fit the audience, taking sponsors that conflict with brand thesis, accepting deals because the money is real even though the fit is wrong.
**Trigger:** First real sponsor offer. Money creates a strong urge to say yes.
**Check:** Would you recommend this to a friend who fit your audience profile? If no, the short-term revenue costs more in long-term trust than it pays.

### 11. Burnout disguised as discipline
**Symptom:** Owner time-per-day creeping past targets (45 min for Signal, 30 min for Atelier). Aversion to recording. "I'll do today's tomorrow."
**Trigger:** Cadence pressure during a low-motivation week.
**Check:** Controller monitors this. If the metric is climbing, pause expansion. The system is supposed to be sustainable; burning out kills it faster than any algorithm change.

### 12. Marketplace policy blindness
**Symptom:** Building an Etsy / KDP / Spotify / Pinterest strategy without checking current AI content rules. Building a YouTube strategy without reading the latest "mass-produced content" policy.
**Trigger:** Tutorials and reels that are 12+ months old.
**Check:** Before committing a workflow to a marketplace, verify the platform's CURRENT (this month) policy on AI-generated content, voice synthesis, and disclosure. These rules change quarterly.

### 13. Family / minor exposure
**Symptom:** Putting a child's voice, image, or identifiable details on monetized content. Using a family member's likeness in any AI-derived asset. (Now relevant due to the Lullaby ecosystem.)
**Trigger:** Authenticity-driven impulse: "It would be cute if my kid was in this."
**Check:** See `ecosystems/lullaby/safeguards/POLICY.md`. There are hard rules. Read them before any recording.

### 14. Skill expansion as escape from execution
**Symptom:** Designing the seventh ecosystem instead of publishing the day's pillar.
**Trigger:** The fun of architecture vs. the boredom of consistency.
**Check:** Has today's pillar been published? If no, the new ecosystem can wait one day. (Repeat as needed.)

---

## How this skill operates in practice

When loaded into a Claude conversation about polymath, this skill should:

1. **Identify** which pitfalls are relevant to the current request (often 2-4 of them).
2. **Surface** the relevant ones explicitly — don't bury them in caveats.
3. **Force a check** before producing the requested output. If the operator wants to "add tool X," the response leads with the relevant pitfall checks, then proceeds (or recommends parking).
4. **Resist sycophancy.** Most polymath conversations have an emotional pull toward expansion. The skill's job is to be the friction that makes good decisions feel correct and bad decisions feel suspicious.
5. **Allow override.** The operator can always override a flagged pitfall. The skill's job is to ensure they do so consciously, in writing, with reasons logged in `controller/escalation-log.md`.

## The single most-important rule

If the operator is excited about a new addition to the system, that excitement is a signal to slow down, not speed up. The polymath system is engineered against impulse. Use this skill to honor that engineering.

## Sister skills (for future creation)

- `niche-locker` — runs the §2.1 matrix on candidate niches and outputs a score with a recommendation
- `kill-switch-evaluator` — when triggered, runs through `controller/kill-switch-criteria.md` and recommends pause/continue
- `brand-isolation-auditor` — periodic check that ecosystems are not bleeding into each other
- `reference-synthesizer` — monthly pass over `references/` to promote useful items into playbooks

These are deferred. Build only when needed.
