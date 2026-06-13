# 01 — Legal Guidelines: Content Safety & Rights Guide

This is the canonical legal-safety section of the Polymath **Source Material Bible**. Every other section of the Bible (mythology, public-domain literature, art movements, design systems, prompt templates, remix frameworks, etc.) **defers to this section** for the rules that determine whether a piece of source material is safe to use, must be used with caution, or must not be used at all.

If any other section's guidance conflicts with this one, **this section wins**. When in doubt, this section's conservative defaults govern.

## What this section is for

VFXellence Ltd builds content ecosystems across many channels — print-on-demand, t-shirts, posters, children's books, written storytelling, podcasts, video, blog, social, merch, and AI-generated image / video / writing. Almost every one of those products borrows from existing creative material: a fairy tale, a myth, a design movement, a public-domain novel, a historical symbol.

The single most expensive mistake in this whole business is using something that *looks* free but is actually protected. A takedown, a platform ban, or a cease-and-desist can erase a product line overnight. This section exists so that **a human or an AI system can reliably tell the difference between inspiration (safe) and infringement (dangerous)** before anything is published.

## How it is used

### By human operators
Read [[copyright-vs-trademark-vs-likeness]] once to understand the three independent legal regimes, then use [[decision-tree]] as a checklist before publishing anything derived from an existing work. The [[safe-to-use]], [[use-with-caution]], and [[do-not-use]] documents are the practical three-bucket reference.

### By AI generation systems
Downstream AI prompt and generation pipelines should treat [[decision-tree]] as an executable policy. Given a candidate source ("Sherlock Holmes", "Art Deco", "the MGM ruby slippers", "Pikachu"), the AI walks the tree and emits one of three verdicts — `safe`, `caution`, `avoid` — plus a rationale and the specific thing to avoid. Every entry's YAML frontmatter carries `risk_level` and `risk_notes` precisely so a machine can filter a content plan automatically.

## The three-bucket model (core mental model)

| Bucket | Meaning | Document |
|---|---|---|
| **Safe to use** | Free to build on commercially with normal attribution hygiene. | [[safe-to-use]] |
| **Use with caution** | May be usable, but only narrowly; depends on *how* you use it. | [[use-with-caution]] |
| **Do not use** | Actively dangerous; no realistic safe commercial use without a license. | [[do-not-use]] |

## The three legal regimes (why "public domain" is not the whole story)

A work can be free under one regime and locked under another. These are independent:

1. **Copyright** — protects the *expression* (the text, the specific drawing, the recording). Expires (in the US, 95 years after publication for pre-1978 works). See [[us-public-domain-cutoff]].
2. **Trademark** — protects a *brand or character identity used in commerce* (a name, a logo, a mascot). Can last forever as long as it is used. Does **not** expire with copyright.
3. **Right of publicity** — protects a *real person's* name, likeness, and persona. Survives many decades after death in some jurisdictions.

The full explanation, with the Steamboat-Willie Mickey example, is in [[copyright-vs-trademark-vs-likeness]].

## Section-specific conventions

- **Conservative bias is correct.** The safe failure mode for IP is "don't use it." If status is uncertain, we set `pd_status: caution` (or `restricted`), `risk_level: caution` (or `avoid`), and explain in `risk_notes`. We never round up to "probably fine."
- **`verified: true` only for settled law.** We mark an entry verified only when the conclusion follows from clear, settled legal mechanics (e.g. a US work published in 1900 is public domain because the 95-year term has plainly expired). Fact-specific or fair-use-dependent judgments stay `verified: false`.
- **The 2026 cutoff line.** As of 2026, US works published in **1930 or earlier** are public domain. This advances one calendar year every January 1. See [[us-public-domain-cutoff]] for the precise mechanics.
- **PD text ≠ PD design.** A public-domain *character* (from old text) does not make a later studio's specific *visual design* of that character free. See [[pd-source-vs-modern-adaptation]].
- **This is operational guidance, not legal advice.** For high-value or high-risk product lines, escalate to a qualified IP attorney. These documents reduce risk; they do not eliminate it.

## File index

| File | Purpose |
|---|---|
| [[safe-to-use]] | What is genuinely free: PD works, mythology, folklore, historical symbols, US government works, CC0 / open licenses. |
| [[use-with-caution]] | Trademarks, character likenesses, modern adaptations, derivatives, estates, franchises, right of publicity. |
| [[do-not-use]] | Copyrighted characters, modern film designs of PD characters, logos, mascots, celebrity likenesses, copyrighted art, franchise assets, hate symbols. |
| [[copyright-vs-trademark-vs-likeness]] | The three regimes explained, with the Steamboat Willie example. |
| [[pd-source-vs-modern-adaptation]] | Side-by-side SAFE vs RESTRICTED table for the classic traps. |
| [[us-public-domain-cutoff]] | Exact PD mechanics and the moving cutoff line. |
| [[decision-tree]] | Executable flow an AI follows to output safe / caution / avoid + rationale. |
| [[_template]] | Copy-paste entry template with full frontmatter schema. |

---
*Part of the Polymath Source Material Bible. Operating guidance for VFXellence Ltd. Not legal advice.*
