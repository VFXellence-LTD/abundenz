# Polymath Tool Stack

Complete tool inventory. All costs are estimates as of May 2025 — verify before activation.

---

## Tool Inventory

| Category | Tool | Ecosystems | Cost/month | API? | Notes |
|----------|------|-----------|-----------|------|-------|
| AI text | Claude API (claude-sonnet-4-x) | All (incl. Viral — all agents) | Usage-based (~$0.003/1k tokens) | Yes | Primary LLM; prompt caching reduces cost significantly for repeated contexts |
| AI image | Midjourney (Basic) | Atelier, Signal (thumbnails) | $10 | Limited (via Discord bot or unofficial API) | Best for illustration quality; Discord dependency is friction |
| AI image | Midjourney (Standard) | Atelier at scale | $30 | Limited | Upgrade when running 50+ designs/week |
| AI image | Flux (API via fal.ai or Replicate) | Atelier, Signal | ~$0.003-0.05/image | Yes (REST) | More API-friendly than Midjourney; good for patterns and photorealistic |
| AI image | Ideogram (Basic) | Atelier (text+art designs) | $7 | Yes (v2 API) | Best for legible text integrated into designs; use for POD slogans |
| AI image | DALL-E 3 (via Claude/OpenAI) | Atelier (fallback) | Usage-based | Yes | Lower quality than Midjourney for illustration; convenient fallback |
| Transcription | Whisper (local) | Signal, Lullaby | Free | Local (Python) | Requires local GPU or CPU; slower than cloud but free at any volume |
| Transcription | Deepgram | Signal, Lullaby | $0 (first 200h free) then $0.0043/min | Yes | Faster than local Whisper; good for production workflow |
| Audio editing | Descript | Signal, Lullaby | $24 | Limited | Auto filler-word removal, transcript-based editing; good for podcast workflow |
| Audio editing | Auphonic | Signal, Lullaby | $11 (2h/month) | Yes | AI audio leveling and noise reduction; good post-processing step |
| Image upscaling | Real-ESRGAN (local) | Atelier | Free | Local (Python/CLI) | Best upscaler for illustration and line art; runs on local GPU |
| Image upscaling | Upscayl (local, GUI) | Atelier | Free | Local | Desktop GUI for Real-ESRGAN; easier for non-CLI use |
| Image upscaling | Replicate (cloud) | Atelier (fallback) | ~$0.01-0.05/image | Yes | Use when local GPU unavailable |
| Format conversion | ImageMagick (local) | Atelier | Free | CLI | PDF/JPEG/PNG conversion; batch processing |
| Design | Canva Pro | Atelier, Signal, Conduit | $13 | Yes (v1 API, limited) | Template creation, carousel design, mockups, pin images |
| Design | Adobe Illustrator / Photoshop | Atelier (advanced) | $55 (CC) | Limited | Only if needed for vector work; likely not required at activation |
| Scheduling/orchestration | Make.com (Core) | All | $9 (10k ops) | Yes | Recommended starting point; visual workflow builder |
| Scheduling/orchestration | Make.com (Pro) | All at scale | $29 (40k ops) | Yes | Upgrade when running daily automations across multiple ecosystems |
| Scheduling/orchestration | n8n (self-hosted) | All | Free (hosting ~$5-15) | Yes | More control and no operation limits; requires VPS maintenance |
| Pinterest posting | Pinterest API + Make.com | Conduit, Signal | Free (API) | Yes | Native API; use for scheduled pin publishing |
| Blog hosting | Ghost (Pro) | Signal, Conduit | $9 | Yes | Clean, fast, SEO-ready; built-in newsletter |
| Blog hosting | WordPress.com (Personal) | Signal, Conduit (alternative) | $9 | Yes | More plugins; slower than Ghost |
| Newsletter | beehiiv (Scale) | Signal | $49 | Yes | Paid tiers allow monetization features; start on free until 500 subs |
| Newsletter | beehiiv (Free) | Signal (early) | $0 (up to 2500 subs) | Limited | Start here; upgrade when monetization is live |
| E-commerce | Gumroad | Signal, Atelier | Free + 10% | Yes | Simplest for digital product sales; no monthly fee |
| E-commerce | LemonSqueezy | Signal, Atelier (alternative) | Free + 5%+$0.50 | Yes | Lower % fee than Gumroad at scale; better checkout UX |
| E-commerce | Shopify (Basic) | Atelier (own store) | $29 | Yes | For own Shopify storefront; needed if scaling beyond marketplaces |
| POD fulfillment | Printful | Atelier | Free + per-order | Yes | Premium quality, consistent, excellent API; higher base cost |
| POD fulfillment | Printify | Atelier (alternative) | Free + per-order | Yes | Lower cost, multiple printers to choose from; more quality variance |
| KDP | Amazon KDP | Atelier | Free (royalty model) | No public API | Manual or semi-automated upload; see [[ecosystems/atelier/agents/04-publisher]] |
| Etsy | Etsy Open API v3 | Atelier | Free (listing fees apply) | Yes | Full listing management API; OAuth 2.0 |
| Mockup generation | Placeit | Atelier, Signal | $16 | Limited | Lifestyle mockups for products and devices |
| Mockup generation | Smartmockups | Atelier, Signal (alternative) | $15-29 | Yes (v1 API) | Similar to Placeit; API access is an advantage |
| Mockup generation | Printful Mockup Generator | Atelier | Free (built-in) | Yes | Use for Printful POD products specifically |
| Link management | Bitly | Conduit | $0 (free tier) | Yes | Short links and click tracking for affiliate links |
| Link management | PrettyLinks (WordPress plugin) | Conduit (alternative) | $0 (free tier) | No | Better for WordPress-based Conduit sites; cloaks affiliate links |
| Analytics | Google Analytics 4 | All | Free | Yes | Web traffic; attach to blog and own store |
| Analytics | Platform-native | All | Free | Varies | Etsy Stats, KDP Dashboard, YouTube Studio — use for platform-specific data |
| Analytics aggregation | Airtable | All | Free (up to 1k records) | Yes | Centralized sales + performance data across platforms |
| Analytics aggregation | Airtable (Plus) | All at scale | $10 | Yes | Upgrade when record limit hit |
| Video editing | CapCut Pro | Signal, Viral (video assembly) | $8 | No | Fast editing for Shorts and social clips; good mobile workflow |
| Video editing | DaVinci Resolve | Signal (alternative) | Free | No | Professional-grade; free version is fully functional |
| Carousel generation | Canva API | Signal, Conduit | Included in Canva Pro $13 | Yes (limited) | Carousel design in Canva; limited API automation |
| Video rendering | HyperFrames | Signal, Viral (video assembly, captions) | Free (global npm) | CLI | HTML-to-video renderer for shorts and captions |
| AI voiceover | ElevenLabs | Viral (voice synth) | $0-22/mo | Yes | AI voiceover for anonymous short-form content |
| Free AI image + video | Meta.ai | Viral (visual prompts) | Free | Yes (web) | Free AI image + 5-sec video generation |
| Video generation (AI) | Runway | Signal (AI B-roll), Viral (B-roll generation) | $12-28 | Yes | AI video generation for supplemental footage |
| Instagram MCP | Zernio | Signal | TBD (beta) | MCP | MCP server for Instagram automation; verify status at activation |
| Deployment / hosting | VPS (Hetzner or DigitalOcean) | All (if using n8n) | $5-15 | Via SSH | Self-hosted n8n, scripts, local tools on VPS |
| Deployment | Claude Dispatch | All | TBD (Claude Code feature) | Via Claude Code | Run Claude Code agents on schedule as orchestration layer |

---

## Selection Rationale by Category

### AI Text: Claude API Only

No need to evaluate alternatives. Claude API is the right choice for all Polymath reasoning, writing, and analysis tasks. Prompt caching significantly reduces cost for agents that use the same system prompt repeatedly (all Atelier agents qualify).

### AI Image: Midjourney + Ideogram + Flux (each for different tasks)

- Midjourney: illustration quality, fine art style — wall art, book covers, coloring book pages
- Ideogram: text+image integration — POD t-shirt designs with slogans
- Flux (fal.ai): API-first, patterns, photorealistic — seamless textures, scalable to volume
- Do not use DALL-E as primary; use as fallback when Midjourney/Ideogram access unavailable

### Orchestration: Make.com to Start, n8n When Scaling

Make.com is faster to set up and cheaper to start. When operating 2+ ecosystems with daily automations, n8n self-hosted on a $6/month Hetzner VPS becomes cheaper and removes the operations ceiling. Migration is not difficult — design Make.com scenarios so they mirror n8n node logic.

### POD: Printful Primary, Printify Secondary

Printful's consistency and API quality outweigh the higher base cost for initial production. Add Printify as a secondary provider for specific products where Printify's pricing produces materially better margin (verify per-product).

---

## What to Skip at Activation (and Why)

| Tool | Reason to skip at activation |
|------|------------------------------|
| Adobe Stock contributor | AI-generated content banned; not viable channel |
| Shutterstock contributor | Same; AI banned |
| Hootsuite / Sprout Social | Expensive social management; native APIs + Make.com sufficient |
| Jasper / Copy.ai | Redundant with Claude API; unnecessary cost |
| Canva for Teams | Team features unnecessary for solo operation |
| Shopify (own store) | Start with Etsy marketplace; own store adds complexity before demand is proven |
| Pinterest ads | Organic Pinterest first; paid ads only after organic conversion rate is validated |

---

## Monthly Cost Estimate by Phase

**Phase 0: Planning only (no active ecosystem)**
$0 — no subscriptions needed until activation

**Phase 1: Atelier activation (single ecosystem)**
| Tool | Cost |
|------|------|
| Claude API | $15 (estimated, depends on volume) |
| Midjourney Basic | $10 |
| Ideogram Basic | $7 |
| Canva Pro | $13 |
| Placeit | $16 |
| Make.com Core | $9 |
| **Total** | **$70** |

Breakeven: ~$200/month net revenue (roughly 30-35 digital download sales at $6, or 15 wall art sales at $13 net)

**Phase 2: Atelier + Signal active**
Add:
| Tool | Cost |
|------|------|
| Deepgram | $11 (estimated) |
| beehiiv Free → Scale | $0-49 |
| Descript | $24 |
| CapCut Pro | $8 |
| **Additional total** | **$43-92** |

Combined Phase 2 total: ~$113-162/month

**Phase 3: All 5 ecosystems active (full Polymath)**
Estimated: $250-400/month (includes Viral tier)
Revenue target at this point: $2,500-6,000/month net (Signal + Surge + Atelier + Lullaby + Conduit combined)

**Viral (Surge) standalone estimate:**
| Tool | Cost |
|------|------|
| Claude API | $10-25 (high-volume scripting + scoring) |
| ElevenLabs | $0-22 |
| Meta.ai | Free |
| CapCut Pro | (shared with Signal) |
| Runway | (shared with Signal) |
| **Additional total** | **$10-47** |

---

## Related Documents

- [[README]] — automation tier assignments and cost model overview
- [[deployment]] — how to set up the stack
- [[ecosystems/atelier/agents/README]] — Atelier agent infrastructure
