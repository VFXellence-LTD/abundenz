# Signal — Audience Personas (Detailed)

Full buyer persona reference. See [[brief/niche]] for summary. This document has depth for product and content decisions.

---

## Persona 1: "The Lone Wolf" — Solo Pipeline TD

### Identity
- **Role title variants:** Pipeline TD, Pipeline Engineer, Technical Supervisor, Senior Generalist, Senior TD
- **Age:** 28-40
- **Experience:** 3-8 years in VFX. Started in one discipline (compositing, rigging, FX) and became the technical go-to person by osmosis.
- **Studio size:** 5-50 artists
- **Reports to:** Studio owner, VFX supervisor, or head of production — someone who is not technical
- **Team:** Solo or 1-2 other semi-technical artists who help with pipeline tasks

### A Day in Their Life
Opens Slack to 12 messages about broken renders. Two are actual pipeline issues. One is a naming convention mistake. One is a bug in a script they wrote 8 months ago that nobody touched until today. Fixes the scripts. Updates the docs that nobody reads. Reviews 3 vendor demos for a new asset tracker. Spends the afternoon writing a Maya batch export script that should take 2 hours but takes 6 because the Maya Python API docs are inconsistent. Answers two Discord messages from other TDs at similar-sized studios.

### Goals (ranked)
1. Keep the pipeline stable enough that artists don't come to them constantly
2. Reduce their own bus factor — if they get hit by a bus, the pipeline keeps running
3. Automate the most painful manual steps
4. Stay current with industry tooling without having to buy enterprise licenses to learn
5. Eventually build enough expertise to consult or found their own technical studio

### Frustrations
- "I have to figure everything out from scratch. There's no one to learn from here."
- "The Ayon docs are aimed at either total beginners or developers adding core features. Nothing for the TD in the middle."
- "I can find Python tutorials everywhere but nothing that shows me how to structure a real pipeline tool — error handling, logging, DCC integration."
- "Vendors want a 30-minute call for a 5-minute answer."
- "The senior TDs at big studios aren't sharing what they actually know."
- "I spent 3 days on something that probably already exists. I just didn't know where to look."

### Content That Converts Them
- "Here's how I solved [specific painful problem]" — case study format
- "The Ayon feature nobody talks about" — insider knowledge feel
- Code walkthroughs of complete tools (not partial snippets)
- Tool comparison with a definitive recommendation

### Platforms
| Platform | Usage | Signal touchpoint |
|----------|-------|------------------|
| YouTube | Deep research, background watching | Primary content delivery |
| Reddit (r/vfx, r/pipeline) | Community Q&A, peer validation | Engagement, link drops |
| Discord (Ayon, ShotGrid, Houdini servers) | Real-time help | Community presence |
| GitHub | Code discovery | Reference in content |
| Newsletters | Low — inbox overloaded | Only subscribes if content is immediately useful |

### Buying Behavior
- Buys without approval process (personal card if < $100)
- Needs light justification for $100-500 (ROI framing helps)
- Would need to sell management on consulting engagement
- **High LTV**: if content earns trust, buys multiple products over time

### Willingness to Pay
| Product | Likely spend |
|---------|-------------|
| Script / config pack ($20-80) | Yes, without hesitation |
| Comprehensive course ($200-500) | Yes, if credible demos |
| Consulting hour ($150-200) | Yes, for specific unsolved problems |
| Community membership ($10-20/mo) | Possible if community is active |

---

## Persona 2: "The Decider" — Studio Supervisor Evaluating Tools

### Identity
- **Role title variants:** VFX Supervisor, Head of Pipeline, Technical Director (senior), Studio Director, Head of Production (technical studios)
- **Age:** 35-55
- **Experience:** 10-25 years in VFX. Former artist, coordinator, or TD who moved into leadership. Technically literate but not writing code daily.
- **Studio size:** 20-150 artists
- **Reports to:** Studio owner or executive producer
- **Budget authority:** $5K-$50K/year for pipeline tools, infrastructure, and contractor time

### A Day in Their Life
Starts with a production meeting. Reviews progress on multiple projects. Takes a vendor call for a new render management system — the vendor shows a polished demo, but they can't figure out if it works with their current Deadline setup. Pulls the technical lead into the call to ask specific questions. Gets an answer that's still ambiguous. Spends 30 min after the call trying to find comparison articles — finds a forum post from 2019 and a vendor blog post from the vendor they're already evaluating. Schedules another call. Meanwhile, three artists filed pipeline tickets that need routing to the TD.

### Goals (ranked)
1. Make defensible tool decisions that don't come back to bite them in 6 months
2. Get the pipeline stable enough that it's not their problem every week
3. Hire or contract the right technical people
4. Have enough technical knowledge to evaluate TD work quality
5. Reduce production risk from pipeline brittleness

### Frustrations
- "I can't evaluate tools without a TD, but I need to decide before I can hire one."
- "Vendor demos always work. I need to know what breaks."
- "The last pipeline consultant we hired built something nobody else can maintain."
- "I don't know if what we have is 'good enough' or a ticking time bomb."
- "Technical content is either too basic or assumes I'm a developer."

### Content That Converts Them
- "Questions to ask before buying [tool]" — saves them from bad calls
- "What a real pipeline looks like at a 30-person studio" — validation
- "Red flags in your pipeline setup" — risk framing resonates
- "How to evaluate a pipeline TD candidate" — hiring content

### Platforms
| Platform | Usage | Signal touchpoint |
|----------|-------|------------------|
| LinkedIn | Professional network, news | Articles, occasional videos |
| YouTube | Research, vendor evaluation | Pillar content |
| Email newsletter | Actually reads newsletters | High priority touchpoint |
| Industry events | Peer networking | Signal presence via speakers/guests |

### Buying Behavior
- Has budget authority — doesn't need approval for under $500
- Buys tools for the studio, not just themselves
- Purchases consulting as "business expense" — much lower friction than personal spend
- Decision horizon is longer — takes 2-4 weeks from awareness to purchase

### Willingness to Pay
| Product | Likely spend |
|---------|-------------|
| Pipeline audit checklist ($19) | Yes, expenses it easily |
| Studio onboarding pack ($29) | Yes |
| Consulting engagement ($150-300/hr) | Yes — highest LTV persona |
| Course for their TDs ($200-500) | Yes, as team investment |

---

## Persona 3: "The Climber" — Technical Artist Learning Pipeline

### Identity
- **Role title variants:** Rigging TD, FX TD, Compositor, Look Dev Artist, Senior Generalist, Technical Animator
- **Age:** 22-32
- **Experience:** 2-5 years in their discipline. Writes Python. Wants to move into pipeline.
- **Studio size:** Varies — may be at a large studio but in a non-pipeline role
- **Reports to:** Department supervisor or lead in their discipline
- **Pipeline access:** Uses the pipeline, doesn't own it. May have submitted a bug report to the pipeline TD.

### A Day in Their Life
Works a lighting task all morning. Writes a shelf button script to automate an annoying step — spends 2 extra hours on it because they enjoyed the problem. Googles "ayon custom loader python" at lunch — finds the official dev docs and three abandoned GitHub repos. Opens a VFX pipeline Discord. Posts a question about Ayon hooks. Gets a partial answer. Watches a YouTube video about ShotGrid Python API in the evening. Falls asleep thinking about how to write a proper publish plugin.

### Goals (ranked)
1. Build skills that make them hirable as a pipeline TD
2. Build a portfolio project that demonstrates pipeline thinking (not just DCC scripting)
3. Understand the "big picture" of how production pipelines connect
4. Find a community of people at the same stage
5. Learn from someone who's done it in production, not just theory

### Frustrations
- "I can write Maya scripts but I don't know how to build a real pipeline tool."
- "YouTube has Python for VFX but it's all DCC scripting, not actual pipeline."
- "I can't get a pipeline job without pipeline experience, and I can't get pipeline experience without a pipeline job."
- "The Ayon/ShotGrid API docs assume I already know what I'm doing."
- "There's no project I can build to practice this stuff — it requires a full studio setup."

### Content That Converts Them
- "Build a mini-pipeline with Ayon from scratch" — project-based
- "What pipeline TDs actually do all day" — demystification
- "Python patterns that every pipeline script needs" — technical ladder
- Any content with real code in real DCC context

### Platforms
| Platform | Usage | Signal touchpoint |
|----------|-------|------------------|
| YouTube | Primary learning platform | Core content |
| GitHub | Code discovery, portfolio | Link from content |
| Reddit (r/vfx) | Community, job advice | Engagement |
| Discord | Real-time community | High priority |
| LinkedIn | Job search, professional content | Lower engagement |

### Buying Behavior
- Budget constrained — junior to mid salary
- Buys for personal development, personal card
- Low resistance to $20-50 products
- Higher resistance at $200+ — needs strong social proof or clear career ROI
- Highest volume persona — largest audience segment

### Willingness to Pay
| Product | Likely spend |
|---------|-------------|
| Pipeline starter kit ($49-79) | Yes — portfolio building value |
| Python for Pipeline course ($199-499) | Yes, with career framing |
| Community membership ($10-20/mo) | Highly likely if community is active |
| Individual script/tool ($15-30) | Yes |

---

## Persona 4: "The Operator" — Studio Ops Manager

### Identity
- **Role title variants:** Line Producer, Studio Manager, Head of Production, Executive Producer (technical studios), Operations Director
- **Age:** 30-50
- **Experience:** 10-20 years in production. Not technical. Manages the business of making VFX, not the tools.
- **Studio size:** 20-100+ artists
- **Reports to:** Studio owner or executive level
- **Relationship to pipeline:** Owns the consequences. If pipeline breaks, their show is late.

### A Day in Their Life
Morning: production meeting with supervisors, schedule updates, deadline pressure. Noon: review vendor contract for new asset management tool — the TD sent a recommendation but the ops manager doesn't know how to evaluate it. Afternoon: three pipeline tickets that fell through the cracks, one of which blocked an artist for two days. Spend 20 min trying to find a consultant to fix an issue the in-house TD can't solve. End of day: email from the director asking why the renders look different from last week — nobody knows yet.

### Goals (ranked)
1. Reduce production risk from pipeline failures
2. Hire or contract the right technical help
3. Know enough about pipeline to ask the right questions in vendor meetings
4. Create processes that don't depend entirely on one person
5. Justify pipeline investment to studio leadership

### Frustrations
- "I can't tell if the pipeline is good or a disaster waiting to happen."
- "Every time the TD leaves, we lose everything they knew."
- "Vendors speak a language I don't understand and I can't tell if their tool solves our problem."
- "When something breaks, I don't know if it's a 2-hour fix or a 2-week fix."
- "I bought a tool the previous TD recommended. They left. Nobody knows how it works."

### Content That Converts Them
- "How to evaluate your pipeline before it breaks" — risk framing
- "What to ask a pipeline TD in an interview" — hiring confidence
- "Why your studio needs a pipeline runbook" — documentation value
- "How to budget for pipeline tooling" — financial framing

### Platforms
| Platform | Usage | Signal touchpoint |
|----------|-------|------------------|
| LinkedIn | Primary professional platform | Articles, professional posts |
| Email newsletter | Reads newsletters during commute | High priority — this persona reads email |
| YouTube | Occasional research | Less frequent than others |
| Industry events | Networking, vendor eval | Signal via speaking/panels |

### Buying Behavior
- Budget authority, expenses without personal cost
- Decision-maker for consulting engagements
- Buys on behalf of studio
- Longest sales cycle — needs to justify to leadership
- Highest single-transaction value (consulting)

### Willingness to Pay
| Product | Likely spend |
|---------|-------------|
| Studio audit checklist ($19) | Yes — expenses it, no thought required |
| Onboarding pack ($29) | Yes |
| Consulting engagement ($200-300/hr) | Yes — this is the highest-value persona |
| Course for team members ($200-500) | Yes, as team investment |

---

## Cross-Persona Patterns

### What all four share:
- Time-poor — content must deliver value fast
- Pain-first — they come with a problem, not a topic
- Trust-averse — burned by vendor content before
- Signal-seeking — looking for someone who knows the real answer, not the official answer

### Content that serves all four:
- Honest tool comparisons with a recommendation
- "Here's what actually happens when X goes wrong"
- Real case studies with specific technical detail
- Anything that saves them from a meeting with a vendor

### Revenue path by persona:
```
Persona 3 (Climber) → most volume → courses, starter kits, community
Persona 1 (Lone Wolf) → high engagement → courses, config packs, consulting
Persona 2 (Decider) → medium volume, high LTV → consulting, audit, courses for teams
Persona 4 (Operator) → low volume, highest LTV → consulting, audit packs
```
