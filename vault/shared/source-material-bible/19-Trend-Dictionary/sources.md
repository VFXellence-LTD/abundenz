# Sources — Trend Detection, Legal Clearance, Saturation Check

The inputs that feed the [[day-0-pipeline]]. Three buckets: **trend-detection** (what's hot), **legal-clearance** (is it safe), and **saturation-check** (is it already flooded). Each entry notes access method, Terms-of-Service / legal risk, and reliability.

> **Guiding principle: prefer official APIs over unofficial scrapers.** Scrapers are ToS-risky, brittle, and can expose the business to legal/account-ban risk. Use them only as a last resort, knowingly, and never as the sole basis for a production decision.

---

## A. Trend-detection sources

### TikTok Creative Center — **official, preferred**
- **What:** TikTok's official marketing portal exposing trending hashtags, sounds, and creative trends by region.
- **Access:** Web portal (some data via official ads/marketing endpoints). No scraping needed for the public trend pages.
- **ToS/risk:** **Low** — official, intended for marketers. Respect rate/usage terms.
- **Reliability:** **High** for what's trending *on TikTok specifically*; the single best official TikTok signal.
- **Use:** Primary day-0 signal for TikTok-origin slang/sounds.

### Google Trends via `pytrends` — **semi-official, reliable**
- **What:** `pytrends` is an unofficial Python wrapper around Google Trends; surfaces rising/breakout search queries.
- **Access:** `pip install pytrends`; query interest-over-time, rising queries, related topics.
- **ToS/risk:** **Low-moderate** — wraps a public Google product; Google has no official Trends API, so this is unofficial but widely used and low-controversy. Subject to rate-limiting/breakage when Google changes its endpoints.
- **Reliability:** **High** for *search demand* (a strong proxy for purchase intent), lower for catching a phrase *before* it hits search. Best as a confirmation/velocity signal.
- **Use:** Validate that a detected phrase is actually rising in search; estimate trajectory.

### Reddit API — **official, reliable**
- **What:** Official Reddit API; rising posts/comments across relevant subreddits (r/GenZ, r/teenagers, r/OutOfTheLoop, meme subs).
- **Access:** Official API (OAuth; note Reddit's 2023 API pricing/terms changes — confirm current free-tier limits).
- **ToS/risk:** **Low** if using the official API within terms. Avoid unofficial scraping post-API-changes.
- **Reliability:** **High** for early discussion + "what does X mean" explainer threads (great for the ethical-origin check).
- **Use:** Early detection + origin/meaning research for the gate.

### X / Twitter trends — **official API costly; use cautiously**
- **What:** Trending topics/hashtags.
- **Access:** Official X API (paid tiers since 2023; free tier very limited). Unofficial scraping is **high-risk** post-2023.
- **ToS/risk:** **Moderate-high** — official API expensive; scraping violates ToS and is actively litigated by X.
- **Reliability:** **Moderate** — fast but noisy; lots of bot/political noise irrelevant to POD.
- **Use:** Secondary signal; prefer official API if budget allows, otherwise deprioritize.

### Know Your Meme — **reference, reliable**
- **What:** Documented memes/phrases with origin, spread, and meaning.
- **Access:** Web (read); no formal public API — manual or careful read-only fetch.
- **ToS/risk:** **Low** for read-only reference use; don't republish their content.
- **Reliability:** **High** for *origin and meaning* (crucial for the ethical-origin and copyright-baggage checks), **lagging** for day-0 detection (entries appear after a meme is established).
- **Use:** Origin + baggage research, not first-detection.

### `davidteather/TikTok-Api` (GitHub) — **unofficial scraper, ToS-RISKY**
- **What:** Popular unofficial Python library scraping TikTok (trending videos, hashtags, user/sound data). See its `trending.py` for pulling trending content.
- **Access:** `pip install TikTokApi` (GitHub: `github.com/davidteather/TikTok-Api`); requires browser automation / session tokens; frequently broken by TikTok changes.
- **ToS/risk:** **HIGH** — **scraping TikTok violates TikTok's Terms of Service.** Brittle (breaks on TikTok updates), may require evading bot-detection, and carries legal/account-risk for the business. The maintainers themselves note it is unofficial.
- **Reliability:** **Low-moderate and volatile** — works until TikTok breaks it.
- **Use:** **Last resort only.** Prefer TikTok Creative Center. If used, isolate it, never make it the sole basis for a production decision, and document the ToS risk. Flagged here explicitly as the highest-risk source in the stack.

---

## B. Legal-clearance sources

### USPTO Trademark Search (`tmsearch.uspto.gov`) — **authoritative**
- **What:** Official US trademark search (the system that replaced legacy "TESS").
- **Access:** Free web search; programmatic access via USPTO's APIs (TSDR / open-data APIs).
- **ToS/risk:** **None** — public government resource.
- **Reliability:** **High and authoritative** for US registered/pending marks. Search the phrase in **Class 25 (apparel)** + 16/21/09/35. See SOP in [[legal/trademark-clearance]].
- **Use:** The core legal force. Determines `trademark_status`.

### ADL Hate Symbols Database (`adl.org/hate-symbols`) — **authoritative (ethics)**
- **What:** Authoritative catalogue of hate symbols, coded numbers, and dog-whistles.
- **Access:** Public web reference.
- **ToS/risk:** **None** for reference use.
- **Reliability:** **High** — the definitive source for coded-number/dog-whistle screening (Screen 2 in [[ethical/brand-safety-filter]]).
- **Use:** Mandatory check for any numeric/coded phrase before clearing.

---

## C. Saturation-check sources

### Amazon (Merch on Demand + marketplace search) — **saturation + TM signal**
- **What:** Search "<phrase> shirt" to gauge listing flood and spot Brand-Registry/branded dominance.
- **Access:** Web search (read). No scraping of Amazon at scale (ToS).
- **ToS/risk:** **Moderate** — manual/read-only fine; large-scale scraping violates ToS.
- **Reliability:** **High** for saturation; a strong takedown-risk signal even absent a TESS hit.
- **Use:** Confirm the day-0 window is still open; detect existing branded sellers.

### Etsy search — **saturation signal**
- **What:** Search the phrase to gauge existing listings + removal patterns.
- **Access:** Web (read); Etsy has an official API for some data.
- **ToS/risk:** **Low-moderate** (manual/API within terms).
- **Reliability:** **High** for saturation in the handmade/POD niche.
- **Use:** Saturation + competitor styling reference.

---

## Source-to-force mapping

| Source | Trend | Legal | Ethical | Saturation |
|---|:--:|:--:|:--:|:--:|
| TikTok Creative Center | ✅ primary | | | |
| Google Trends (pytrends) | ✅ confirm | | | partial |
| Reddit API | ✅ early | | ✅ origin | |
| X / Twitter | ✅ secondary | | | |
| Know Your Meme | partial | ✅ baggage | ✅ origin | |
| TikTok-Api (scraper) | ⚠️ last resort | | | |
| USPTO Trademark Search | | ✅ core | | |
| ADL Hate Symbols DB | | | ✅ core | |
| Amazon search | | ✅ TM signal | | ✅ |
| Etsy search | | | | ✅ |

> See also: [[day-0-pipeline]] · [[three-force-gate]] · [[legal/trademark-clearance]] · [[ethical/brand-safety-filter]]
