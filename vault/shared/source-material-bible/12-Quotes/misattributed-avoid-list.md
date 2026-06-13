---
id: quote-misattributed-avoid-list
type: quote
title: Commonly-Misattributed Quotes — AVOID List
creator: VFXellence Ltd / Polymath (compiled)
year: 2026
country: na
pd_status: caution
pd_basis: "compilation of quotes that are either fabricated, wrongly attributed, or copyrighted; included so the pipeline can actively reject them"
verified: true
pd_verified: false
themes: [misattribution, fakes, copyright-traps, content-safety]
theme_tags: [misattribution, fakes, traps]
symbols: []
archetypes: []
visual_motifs: []
emotional_tags: [caution]
applications: []
risk_level: avoid
risk_notes: "EVERY quote on this page is a REJECT. Do not put any of these on a product, in a script, or in generated content under the named attribution. Many are fabricated; many are copyrighted; many are right-of-publicity hazards. This is the deny-list the AI pipeline checks against."
remix_hooks: []
source_url: ""
tags: [quotes, misattributed, avoid, deny-list, content-safety]
related: ["[[README]]", "[[wisdom]]", "[[courage]]", "[[love]]", "[[nature]]", "[[perseverance]]", "[[humor]]", "[[leadership]]", "[[creativity]]", "[[stoicism]]", "[[01-Legal-Guidelines/do-not-use]]"]
created: 2026-05-31
---

# Commonly-Misattributed Quotes — AVOID List

> The deny-list. Every line here is something the pipeline (and any human operator) must **reject** under the named attribution. They fall into three failure modes, and often more than one applies at once.

## Why this list exists

The internet's "quote culture" is full of lines that are confidently attributed to famous historical figures but are actually (a) **fabricated**, (b) **written by someone else** (often a living/recent author whose words are copyrighted), or (c) attached to a **name and likeness that is legally protected** (right of publicity / trademark). Selling merch with "— Albert Einstein" under words Einstein never wrote is simultaneously an accuracy failure, a possible copyright problem (if the real author is modern), and a possible false-endorsement / publicity problem (Einstein's name is a licensed trademark).

This page is the **machine-checkable reject list**. Before any quote ships, the pipeline confirms it is **not** on this list.

## The three failure modes

| Mode | Meaning | Why it is dangerous |
|---|---|---|
| **FABRICATED** | The named person never said/wrote it; no source exists. | Brand-trust collapse the moment a customer fact-checks; reputational damage. |
| **WRONG AUTHOR (copyright trap)** | The real author is modern/living, so the words are copyrighted. | Direct copyright infringement, even though the *named* figure is old. |
| **PROTECTED IDENTITY** | The person is real and their name/likeness is publicity- or trademark-protected. | Right-of-publicity / false-endorsement / trademark claim. |

## How an AI should apply this
1. Maintain this list as a normalized deny-set (by quote text and by claimed-author).
2. For any candidate quote, reject if the **text** matches a list entry **or** if the **claimed author** is on the protected-identity roster below and the quote is not independently verified to a PD work.
3. When a user pastes in a "famous quote," check this list first. If it matches, refuse and suggest the verified PD alternative noted in the relevant collection.

---

## A. The fake / restricted EINSTEIN quotes

Einstein (d. 1955) is the most-faked author online, and his name is a **registered trademark** licensed through the Hebrew University of Jerusalem — so even genuine Einstein quotes carry identity risk on merch. Reject all of these:

- **"Imagination is more important than knowledge."** — Genuine-ish (1929/31 interview) but COPYRIGHTED + trademark-protected name. AVOID.
- **"Creativity is intelligence having fun."** — FABRICATED. No Einstein source.
- **"Logic will get you from A to B. Imagination will take you everywhere."** — FABRICATED. No Einstein source.
- **"Everybody is a genius. But if you judge a fish by its ability to climb a tree, it will live its whole life believing that it is stupid."** — FABRICATED. No Einstein source; first appears late 20th century.
- **"Insanity is doing the same thing over and over again and expecting different results."** — FABRICATED as Einstein; earliest appearances are 1980s recovery literature.
- **"The definition of genius is taking the complex and making it simple."** — FABRICATED.
- **"Two things are infinite: the universe and human stupidity; and I'm not sure about the universe."** — FABRICATED as Einstein.
- **Verified PD alternative:** use William Blake — *"What is now proved was once only imagined."* See [[creativity#q02-what-is-now-proved]].

## B. The fake / restricted MARK TWAIN quotes

Twain (d. 1910) IS public domain — but he is the second-most-faked author, so the danger here is **misattribution**, not copyright. Reject these as Twain:

- **"Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do."** — FABRICATED. First appears in a 1990s advertisement. Not Twain.
- **"The secret of getting ahead is getting started."** — FABRICATED as Twain. No source.
- **"Kindness is a language which the deaf can hear and the blind can see."** — FABRICATED as Twain. No source.
- **"Golf is a good walk spoiled."** — Misattributed; no firm Twain source.
- **"Never argue with stupid people, they will drag you down to their level and then beat you with experience."** — FABRICATED as Twain.
- **"If you tell the truth, you don't have to remember anything."** — Often cited to Twain; the verified Twain form is from *Notebook* (use cautiously, cite the work). Many circulating variants are not his.
- **Verified PD alternatives:** use the sourced Twain lines in [[humor]] (e.g. "The report of my death was an exaggeration").

## C. The fake / restricted GANDHI quotes

Mohandas Gandhi (d. 1948). Many of his genuine writings are PD, but the most popular line is fabricated, and his name/likeness carries publicity sensitivity in India.

- **"Be the change you wish to see in the world."** — FABRICATED / heavily paraphrased. Gandhi's actual (sourced) sentiment was longer and different ("If we could change ourselves, the tendencies in the world would also change..."). The pithy version is not his wording. AVOID the popular form.
- **"An eye for an eye makes the whole world blind."** — FABRICATED as Gandhi. No source in his writings; attribution dates to the 20th century with no primary citation.
- **"First they ignore you, then they laugh at you, then they fight you, then you win."** — FABRICATED as Gandhi. No source; resembles a 1918 US labor-union speech (Nicholas Klein), not Gandhi.

## D. The fake / restricted BUDDHA quotes

"The Buddha" (c. 5th c. BCE) — the canonical Pali/Sanskrit texts are ancient/PD, but most viral "Buddha" quotes are modern New-Age fabrications.

- **"Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned."** — FABRICATED as Buddha. No canonical source; modern paraphrase.
- **"What you think, you become."** — FABRICATED / loose paraphrase. Not a literal canonical line.
- **"Three things cannot be long hidden: the sun, the moon, and the truth."** — FABRICATED as Buddha. No canonical source.
- **"In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go."** — FABRICATED as Buddha. Modern New-Age origin.
- **Note:** if you need a genuinely sourced Buddhist line, quote the *Dhammapada* from a PD translation (e.g. Max Müller, 1881; F. Max Müller's Sacred Books of the East) and cite the verse number.

## E. The fake / restricted MARILYN MONROE quotes

Marilyn Monroe (d. 1962) — words are copyrighted (recent) AND the name/likeness is a heavily-licensed **trademark/right-of-publicity** asset (Authentic Brands Group). Double hazard.

- **"If you can't handle me at my worst, then you sure as hell don't deserve me at my best."** — FABRICATED as Monroe. No source.
- **"Imperfection is beauty, madness is genius..."** — FABRICATED as Monroe.
- **"Well-behaved women rarely make history."** — Misattributed (sometimes to Monroe, sometimes to Eleanor Roosevelt). The REAL author is historian **Laurel Thatcher Ulrich (1976)** — IN COPYRIGHT. AVOID under any famous-name attribution.
- **Hard rule:** Monroe's name/likeness is a licensed brand. Do not put any quote under "— Marilyn Monroe" on merch.

## F. Other high-frequency traps

- **"The only thing necessary for the triumph of evil is for good men to do nothing."** — Attributed to Edmund Burke; **no verified Burke source**. Treat as unverified/apocryphal; do not credit Burke with confidence.
- **"Well done is better than well said."** — This one IS genuine Franklin (PD); included only to note it is often confused with fakes. SAFE if cited to Franklin's *Poor Richard's Almanack*.
- **"Not all those who wander are lost."** — J. R. R. Tolkien, *The Fellowship of the Ring* (1954). IN COPYRIGHT (Tolkien Estate, very litigious). AVOID. Often mistaken for an old proverb — it is not.
- **"I have not failed. I've just found 10,000 ways that won't work."** — Attributed to Edison; genuine Edison is PD, but this exact wording is not firmly sourced pre-1930. Use cautiously; prefer the sourced Edison line in [[perseverance]].
- **"Be yourself; everyone else is already taken."** — Attributed to Oscar Wilde; **no verified Wilde source**. Apocryphal. AVOID as Wilde.
- **"A friend is someone who knows all about you and still loves you."** — Attributed to Elbert Hubbard (d. 1915, would be PD) but commonly miscredited; verify the Hubbard source before use.
- **"It always seems impossible until it's done."** — Nelson Mandela. PROTECTED IDENTITY + copyright (Nelson Mandela Foundation). AVOID.
- **"In three words I can sum up everything I've learned about life: it goes on."** — Attributed to Robert Frost; the exact aphorism is not firmly sourced and Frost's relevant works may still be in copyright outside the US. AVOID under Frost.
- **"You miss 100% of the shots you don't take."** — Wayne Gretzky (20th c.); PROTECTED IDENTITY + not PD. AVOID.
- **"Whatever you are, be a good one."** — Attributed to Abraham Lincoln; **no verified Lincoln source**. Apocryphal. AVOID as Lincoln.
- **"Courage is not the absence of fear, but the triumph over it."** — Attributed to Nelson Mandela (and others); PROTECTED IDENTITY / unverified. AVOID. Use the verified Joanna Baillie line in [[courage#q06-the-brave-man]].
- **"Fall seven times, stand up eight."** — A Japanese proverb (七転び八起き), NOT Confucius. SAFE as an anonymous proverb; AVOID crediting Confucius. See [[perseverance#q02-nana-korobi-ya-oki]].

## G. The protected-identity roster (reject by claimed author)

Even a *genuine* quote from these people is restricted (copyright still running, and/or name/likeness commercially protected). Do not put quotes under these names on commercial products without a license:

| Name | Why restricted | PD horizon (approx.) |
|---|---|---|
| Albert Einstein (d. 1955) | Copyright + trademark (HUJ) | Copyright varies; trademark indefinite |
| Winston Churchill (d. 1965) | Estate-controlled speeches | ~2036 (UK life+70) |
| Ernest Hemingway (d. 1961) | In copyright | ~2032+ |
| C. S. Lewis (d. 1963) | Estate-controlled | ~2034+ |
| Pablo Picasso (d. 1973) | Copyright + litigious estate | ~2044 |
| J. R. R. Tolkien (d. 1973) | Estate-controlled, litigious | ~2044 |
| Nelson Mandela (d. 2013) | Copyright + protected name (foundation) | Long-running |
| Marilyn Monroe (d. 1962) | Right of publicity + trademark (ABG) | Indefinite (publicity) |
| John F. Kennedy (d. 1963) | Persona licensed; speeches nuanced | Persona indefinite |
| Martin Luther King Jr. (d. 1968) | Estate aggressively licenses speeches/likeness | ~2039+ and persona indefinite |
| Vince Lombardi, Muhammad Ali, Wayne Gretzky, etc. | Right of publicity (sports figures) | Indefinite (publicity) |
| Any living author | Copyright | n/a |

## Pipeline rule (summary)

> If a candidate quote's **text** is on Sections A–F, **reject**. If its **claimed author** is on Section G and you cannot verify the quote to a clearly-PD work + PD translation, **reject**. Offer the verified PD alternative named in the relevant themed collection instead. When uncertain, **reject** — the safe failure mode for a quote is "don't ship it."

---
*Part of the Polymath Source Material Bible — Section 12 Quotes. Operating guidance for VFXellence Ltd. Not legal advice.*
