# Legal — Trademark Clearance for Trend Phrases

> This is operational guidance for the Trend Dictionary, not legal advice. All doctrine and edge cases defer to [[../../01-Legal-Guidelines/README]]. When in doubt, escalate to the Boss and do not mass-produce.

---

## The reframe: copyright is the wrong lens

The instinct is to ask "is this phrase copyrighted?" **That is the wrong question.**

> **US copyright does NOT protect short phrases, slogans, names, or titles.** The U.S. Copyright Office is explicit: words and short phrases such as names, titles, and slogans are **not** subject to copyright (37 C.F.R. § 202.1).

So "no cap," "rizz," "it's giving," "ate," "delulu" — as bare strings — carry **no copyright** at all. You cannot infringe a copyright by printing a two-word slang phrase on a shirt.

The real risks are three different things:

### Risk A — TRADEMARK (the big one)

Trademark protects words/phrases used **as a brand to identify the source of goods**. People file trademarks on viral phrases *extremely fast* — often within days of a phrase blowing up — and POD marketplaces enforce trademark complaints aggressively, frequently with **automated takedowns and account strikes** before any court ever rules.

The danger is not usually a lawsuit. It is:
- **Listing removal** on Amazon Merch / Etsy / Redbubble / Printify.
- **Account suspension or termination** after repeated strikes (this is the existential risk to a POD account).

You can be *legally right* (the mark may be weak or invalid) and still lose your listing and your account, because the marketplace's brand-registry process favors the complainant.

### Risk B — COPYRIGHTED BAGGAGE

Some "phrases" are not just words — they drag a **copyrighted work** with them:

- **Copyrighted series / characters** — e.g. **"skibidi toilet"** is the name of a copyrighted animated series by **DaFuq!?Boom!** with protected characters and protected episode content. The *word* "skibidi" as slang may be usable, but the **toilet-headed characters, the art style, and any episode imagery are protected** — and the IP is under active ownership litigation, making it doubly hazardous.
- **Song lyrics** — copyrighted. Printing a lyric is reproducing a protected work even if it's "just one line."
- **Movie / show quotes** — copyrighted *and* frequently trademarked for merch.

> **Rule:** the bare word/phrase alone may be usable, but the associated character, art, lyric, or quote is **NOT**. If the phrase only has value *because* of the copyrighted thing behind it, it's baggage → `avoid`.

### Risk C — RIGHT OF PUBLICITY

A phrase that is a person's **signature catchphrase**, or that evokes a specific identifiable creator, can implicate that person's **right of publicity** (their commercial control over their name/likeness/persona). State-law right; strong in CA/NY. Selling merch that trades on *being identifiably about that creator* is the risk — not the generic word.

Examples of publicity exposure: a creator's exact signature catchphrase, a phrase + that creator's name/face, "fanum tax" (tied to creator Fanum).

---

## USPTO TESS clearance SOP (step by step)

> The legacy "TESS" interface was replaced by the USPTO **Trademark Search** system at **`tmsearch.uspto.gov`**. The SOP below applies to the current search tool; "TESS" is used here as the familiar shorthand.

**Goal:** determine `trademark_status` ∈ {clear, applied, registered, disputed, unknown} for the phrase **in the goods that matter** (apparel = International Class 025; plus relevant others).

1. **Go to** `https://tmsearch.uspto.gov`.
2. **Search the exact phrase** as a basic word-mark search. Then search **variants**: with/without spaces, common misspellings, plural/singular, and the phrase as part of a longer mark (e.g. `"<phrase>"` and `<phrase>*`).
3. **Filter to relevant classes.** The ones that matter most for our POD lines:
   - **Class 025** — clothing (t-shirts, hoodies, hats). *Primary.*
   - **Class 016** — paper goods, posters, stickers, prints.
   - **Class 021** — mugs, drinkware.
   - **Class 009** — phone cases, downloadable designs.
   - **Class 035** — retail/online-store services (relevant if someone brands a *store* around it).
4. **For each hit, record:**
   - **Status** — `LIVE` vs `DEAD`. Only LIVE marks matter.
   - **Filing basis** — `1(a)` use-in-commerce (already selling) vs `1(b)` intent-to-use (filed but not yet using). A pending `1(b)` → `applied`.
   - **Goods/services** — does it actually cover apparel/our classes, or something unrelated (e.g. a "RIZZ" mark for software)?
   - **Owner** — one owner, or **multiple conflicting filers** (→ `disputed`).
5. **Marketplace saturation + brand scan** (complements TESS):
   - Search **Amazon** for the phrase + "shirt." Look for **Brand Registry** badges / a single dominant branded seller — a strong takedown signal even absent a TESS hit.
   - Search **Etsy** and **Redbubble** for existing branded listings and "this listing was removed" patterns.
6. **Assign `trademark_status`:**

| Finding | `trademark_status` | `legal_verdict` impact |
|---|---|---|
| No LIVE mark covering our classes; low marketplace branding | `clear` | toward `clear` |
| LIVE `1(b)` intent-to-use, or recent pending application | `applied` | `caution` |
| LIVE registered mark covering Class 025 / our classes | `registered` | `avoid` |
| Multiple conflicting filers / contested ownership | `disputed` | `avoid` (until settled) |
| Could not access / inconclusive | `unknown` | `caution` (never `clear`) |

> A `registered` mark for apparel is a hard stop for that phrase **as a brand-style print**. A mark in an unrelated class (e.g. only registered for beverages) is lower risk but still warrants a spot-check and conservative rendering.

---

## POD-platform takedown risk (per marketplace)

Each marketplace enforces trademark complaints differently. Risk is ranked by how fast/automated the takedown and how harsh the account penalty.

| Platform | Takedown mechanism | Account risk | Notes |
|---|---|---|---|
| **Amazon Merch on Demand** | **Highest.** Automated brand-registry matching + manual complaints. Listings pulled fast; trademarked-phrase rejections common at upload. | **Severe** — strikes lead to tier downgrade or termination; reinstatement is slow/opaque. | Treat Amazon as the strictest gate. If a phrase wouldn't clear here, don't risk the account. Avoid anything `applied`/`registered`/`disputed`. |
| **Etsy** | Reactive IP complaint portal; rights-holders file, Etsy removes. | **Moderate-high** — repeated infringement → shop suspension. | Etsy floods with trend phrases fast; saturation kills margin even when legal. |
| **Redbubble** | Proactive content moderation + rights-holder complaints; known for sweeping removals of trend/IP terms. | **Moderate** — removals frequent; account bans for repeat IP. | Aggressively removes anything smelling of a franchise/character. Skibidi-style baggage gets nuked here. |
| **Printify / Printful (+ own storefront e.g. Shopify)** | No marketplace-side TM matching; **you** carry the liability. | **You bear it directly** — DMCA/TM complaints come to your store; payment processor + hosting risk. | More freedom, more responsibility. Owning the store does *not* make a `registered`-mark print safe. |

**Operating principle:** clear to the **strictest** platform you intend to list on (usually Amazon Merch). The gate is calibrated to survive automated takedowns, not just to win a hypothetical lawsuit.

---

## The copyrighted-baggage trap list

Phrases that *look* like usable slang but carry a protected work. **Default these to `avoid`** unless cleared explicitly:

- **"skibidi toilet" / skibidi characters** — copyrighted animated series (DaFuq!?Boom!), protected characters, **active IP ownership litigation**. The art/characters are off-limits. → `avoid`.
- **Any song lyric** ("type beat" adjacent uses, quoted lyrics) — copyrighted composition. → `avoid` if it reproduces lyric text.
- **Movie / TV / game quotes** — copyrighted dialogue, often trademarked for merch. → `avoid`.
- **Named meme characters / mascots** (drawn characters, not the word) — copyrighted illustrations. → `avoid` the *art*; the descriptive word may survive.
- **Branded phrases from an artist's era/album** (e.g. an album title used as a brand) — common-law and/or registered TM. → `caution`/`avoid`.

> **Test:** "Does this phrase have value *only because* of a protected work/character/song/quote behind it?" If yes → baggage → `avoid`. If the words have independent generic slang value → the *words* may be fine, but **never** reproduce the associated art/character/lyric.

---

## Right-of-publicity note

- A **generic slang word** popularized by a creator (e.g. "rizz" popularized by, not owned by, a streamer) generally carries **low** publicity risk — the word is in common use.
- A creator's **signature catchphrase**, or a design that *names/depicts* the creator or is unmistakably *about* them, carries **real** publicity risk → `caution`/`avoid` and Boss review.
- "fanum tax" is tied to creator **Fanum**; treat as `publicity_risk: tied to creator Fanum` → `caution`.

---

## Bottom line

1. Stop asking "is it copyrighted." Ask "**is there a live trademark for apparel, does it drag a copyrighted character/lyric/quote, and is it someone's signature catchphrase?**"
2. Clear to the strictest marketplace (Amazon Merch).
3. `unknown` is `caution`, never `clear`.
4. Baggage = `avoid` even if the bare word is fine.
5. Escalate anything `applied`/`disputed`/publicity-tied to the Boss before mass production.

> See also: [[../three-force-gate]] · [[../ethical/brand-safety-filter]] · [[../../01-Legal-Guidelines/README]]
