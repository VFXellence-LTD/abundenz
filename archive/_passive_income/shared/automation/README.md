# Polymath Automation Architecture

The shared infrastructure that runs across all Polymath ecosystems. Each ecosystem operates independently (brand isolation), but they share common tooling, deployment infrastructure, and orchestration patterns.

---

## Three Automation Tiers

| Tier | Description | Owner input | Best for |
|------|-------------|-------------|---------|
| Fully autonomous | Agent runs on schedule, produces output, publishes without human review | Reads weekly report only | High-volume commodity work where quality threshold is consistent (Atelier POD, Conduit pin scheduling) |
| Human-in-loop | Agent produces output; human reviews before publishing | 5-15 min per batch | Any content where quality or brand voice matters (Signal video content, Atelier listings, Conduit reviews) |
| Human-core | Agent assists; human authors | 30-60 min per piece | Pillar content requiring genuine expertise or authentic voice (Signal long-form, Lullaby narration) |

---

## Tier Assignment Per Ecosystem

| Ecosystem | Content type | Tier |
|-----------|-------------|------|
| Signal | YouTube video (filming + narration) | Human-core |
| Signal | Derivative content (clips, threads, pins) | Human-in-loop |
| Signal | SEO optimization of drafts | Human-in-loop |
| Atelier | Niche research | Fully autonomous |
| Atelier | Design generation | Fully autonomous |
| Atelier | Listing copy | Fully autonomous |
| Atelier | Publishing | Human-in-loop (review gate) |
| Atelier | Analytics + reporting | Fully autonomous |
| Lullaby | Story creation | Human-in-loop |
| Lullaby | Audio production | Human-in-loop |
| Lullaby | Distribution scheduling | Fully autonomous |
| Conduit | Affiliate product research | Fully autonomous |
| Conduit | Review article drafts | Human-in-loop |
| Conduit | Pinterest pin scheduling | Fully autonomous |
| Conduit | Email sequences | Human-in-loop |
| Surge | Source Scanner | Fully autonomous |
| Surge | Segment Scorer | Fully autonomous |
| Surge | Script Engine | Fully autonomous |
| Surge | Visual Prompter | Fully autonomous |
| Surge | Voice Synth | Fully autonomous |
| Surge | Video Assembler | Fully autonomous |
| Surge | Caption Renderer | Fully autonomous |
| Surge | Distributor | Fully autonomous |
| Surge | RPM Tracker | Fully autonomous |

---

## Common Infrastructure (Shared Across All Ecosystems)

| Function | Tool | Notes |
|----------|------|-------|
| AI reasoning | Claude API (claude-sonnet-4-x) | Primary LLM for all agents |
| AI image generation | Midjourney, Flux, Ideogram | Atelier; Signal thumbnails |
| Workflow orchestration | Make.com or n8n | Schedule triggers, connect tools |
| File storage | Dropbox or AWS S3 | Shared asset storage between agents |
| Analytics aggregation | Airtable or SQLite | Sales, traffic, revenue per ecosystem |
| Social scheduling | Buffer or native APIs | Signal and Conduit distribution |

---

## Cost Model by Tier

**Fully autonomous tier (Atelier at scale):**
- Claude API: ~$15-40/month (depends on prompt length and volume)
- Image generation: $10-30/month (Midjourney Basic or Flux API)
- Make.com: $9-29/month (10k-40k operations)
- Total: ~$35-100/month
- Breakeven: ~$150-300/month revenue (achievable with 20-50 active listings)

**Human-in-loop tier (Signal distribution):**
- Claude API: ~$5-15/month (shorter prompts, lower volume)
- Canva Pro: $13/month (carousel + pin design)
- Pinterest + social scheduling: API direct (free) or Buffer ($18/month)
- Total: ~$36-46/month
- Breakeven: same as content monetization thresholds

**Human-core tier (Signal pillar content):**
- Recording equipment: one-time cost; ignore for ongoing
- Video editing: CapCut Pro ($8/month) or DaVinci Resolve (free)
- Transcription: Whisper local (free) or Deepgram ($25/month if volume warrants)
- Total: ~$8-33/month
- Breakeven: first monetized YouTube video or newsletter paid tier

**Combined all tiers at full operation (all 5 ecosystems active):**
- Low estimate: ~$150/month
- High estimate: ~$350/month
- Breakeven revenue target: ~$600-800/month net across all ecosystems

---

## Ecosystem Isolation at Infrastructure Level

Brand isolation is not only a content rule — it is enforced at the infrastructure level:

- Each ecosystem uses separate Etsy shop (separate accounts if possible)
- Each ecosystem uses separate KDP account
- Each ecosystem uses separate social accounts
- Shared tools (Claude API, Make.com) are shared at billing level only; separate automations, separate data
- Never cross-link ecosystems in any customer-facing content
- Never use the same pen name, shop name, or handle across ecosystems

See [[../brand-isolation/POLICY.md]] for full brand isolation rules.

---

## Related Documents

- [[tool-stack]] — complete tool inventory with costs and API availability
- [[deployment]] — how to set up the automation infrastructure
- [[ecosystems/atelier/agents/README]] — Atelier-specific agent architecture
