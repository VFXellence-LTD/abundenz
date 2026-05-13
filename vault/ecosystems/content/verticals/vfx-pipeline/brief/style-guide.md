# Signal — Style Guide

## Voice

**Authoritative but not academic.** The voice comes from having actually shipped pipelines under production pressure, not from having studied pipelines. This means: opinionated, specific, occasionally frustrated, always grounded in what actually happens in studios.

**Characteristics:**
- Uses "we" when talking about a studio context, "I" when talking about personal decisions
- Names specific tools, versions, and configurations — no vague gestures at "production tracking solutions"
- Disagrees with conventional wisdom when experience contradicts it — and explains why
- Acknowledges when something is genuinely hard or unsolved — no false confidence
- Treats the audience as peers, not students — no hand-holding on things an intermediate TD should know

**What it sounds like:**
> "Ayon is genuinely impressive for a free tool. It's also genuinely painful to configure from scratch if you don't have someone who's done it before. This is the video I wish existed when I set it up the first time."

> "I've seen this exact mistake in three different studios. The naming convention looks fine until you have 200 shots. Then it's a disaster. Here's what to do instead."

> "Deadline's Python API documentation is, diplomatically, not great. Let me show you the part that actually matters."

---

## Tone

**Conversational and direct.** Not academic, not corporate, not hype. The tone of a senior colleague explaining something over coffee.

**Tone attributes:**
- Direct: states the point before explaining it, not after
- Conversational: contractions, colloquialisms, natural speech patterns
- Occasionally frustrated: when a tool is bad or an industry practice is stupid, says so briefly and moves on
- No hype: does not use "game-changing," "revolutionary," "next-level," "incredible" about tools or techniques
- No hedging: does not say "it might be worth considering" when the answer is "yes, do this"

**Tone by format:**
- **YouTube pillar (spoken):** Most conversational. Natural speech. Some tangents that circle back. Frustration with bad tools is relatable here.
- **Blog post:** More structured. Still direct. Formal enough for Google.
- **Newsletter:** Most opinionated. Shorter sentences. More personality. Can rant briefly.
- **LinkedIn:** Professional tone, but still direct. No empty affirmations. No "Excited to share..."
- **X/Twitter:** Blunt. Single observation or question. No filler.
- **Reddit:** Community-native. Self-promotional feel flagged immediately. Contribute first, mention content second.

---

## Visual Identity

**Aesthetic:** Clean, technical, dark-theme. This is an engineering channel, not an art channel.

**Color palette:**
- Primary background: Dark gray (#1a1a2e or similar — not pure black)
- Accent: Cool blue-green (#00b4d8 range) — technical, not warm
- Code blocks: Dark theme with syntax highlighting (same as VS Code Dark+)
- Text: Off-white (#e0e0e0), not pure white

**Typography:**
- Headings: Sans-serif, clean (Inter or JetBrains Mono for code-adjacent contexts)
- Body: Readable sans-serif, nothing decorative
- Code: JetBrains Mono or Fira Code — ligatures enabled, real coding font

**On-screen content:**
- Screen shares use a consistent dark IDE theme (VS Code Dark+ or equivalent)
- Terminal: Dark background, minimal clutter — no custom ASCII art, no novelty prompts
- DCC screenshots: Standard dark theme where available (Maya dark UI, Houdini dark, etc.)
- Diagrams: Clean, minimal, dark-background. Arrows and boxes only — no clip art, no gradients

**Thumbnail style:**
- Dark background
- Single clear focal element: a code snippet, a diagram, or a bold text statement
- Not a face-in-thumbnail-with-surprised-expression format (that's for entertainment channels)
- Text: large, readable, technical — not all-caps motivational phrases
- Optional: small Signal wordmark bottom-right corner

---

## Vocabulary

**Uses:**
- Real pipeline terminology without apology: publish, ingest, entity, task, version, representation, hook, resolver, loader
- Tool names precisely: "Ayon" not "AYON," "ShotGrid" not "Shotgrid," "After Effects" not "AfterEffects"
- Software versions when relevant: "In Ayon 1.3, this changed"
- Python version explicitly: "This is Python 3.10 syntax"
- File paths as actual paths: `/mnt/pipeline/projects/{project}/shots/{shot}/` not "your project directory"

**Does not use:**
- "The cloud" as a magic concept — names the specific service
- "AI" as a blanket term — names the model, tool, or technique
- "Best practices" without explaining why they're practices at all
- "Enterprise" vs "small studio" framing without specifics
- Vendor buzzwords: "turnkey," "end-to-end solution," "single pane of glass"

**Explain when needed, not reflexively:**
The audience is intermediate-to-advanced. Don't explain what a pipeline is. Don't explain what Python is. Do explain what a Deadline event plugin is if the content assumes someone might not know — because that's a reasonable gap even for experienced TDs.

---

## Format Anti-Patterns

These formats are banned from Signal content:

**"10 things you didn't know about X"** — listicle format with no depth. Signal content goes deep.

**"AI will replace pipeline TDs"** — fearmongering clickbait. Doesn't contribute. Audience is tired of it.

**"Python for beginners"** — not the audience. Signal audience writes Python. Pillar 3 starts at intermediate.

**"How to break into VFX"** — generic career advice outside the technical scope. See [[brief/banned-topics]].

**Vendor-framed reviews** — "in partnership with [vendor]" reviews that can't say critical things. Reviews are independent or labeled transparently.

**Motivational intro sequences** — "In this video, we're going to learn X and it's going to change how you think about Y and by the end you'll be able to Z." State the topic and start. Respect the audience's time.

**The "smash that like button" pattern** — one CTA at the end, stated simply. Not repeated three times during the video.

**False drama** — "You won't believe what this script does." If it's interesting, it's interesting on its own.

---

## CTA (Call-to-Action) Standards

- **One CTA per piece of content** — at the end
- **Matched to content type:**
  - YouTube pillar: subscribe + newsletter link
  - Blog: newsletter signup
  - Newsletter: link to related product or pillar video
  - Short/clip: subscribe to main channel
- **Phrasing:** Direct and low-pressure. "If this was useful, subscribe" not "JOIN THE COMMUNITY AND NEVER MISS CONTENT"
- No mid-roll CTAs on pillar content
- No sponsored segments without explicit, visible sponsor disclosure

---

## Brand Isolation (Signal-specific)

Signal is one of five ecosystems in the Polymath vault: Signal (authentic voice content), Surge (anonymous AI short-form), Atelier (AI-generated products), Lullaby (bedtime stories), and Conduit (anonymous affiliate). These brands never cross-reference each other. The owner's face, voice, and expertise appear in only one brand context. See `shared/brand-isolation/POLICY.md`.

Signal-specific rule: the owner's identity in Signal is as a pipeline engineer and technical educator. No mention of generative AI art projects, Atelier products, or creative work.
