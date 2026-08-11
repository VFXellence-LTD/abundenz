# Atelier: Agent Overview

Status: PARKED — specs complete, deploy when activated.

Five agents run the Atelier production pipeline. All are fully autonomous except for a single human review gate before publishing.

---

## Agent Roster

| # | Agent | Role | Runs | Human gate? |
|---|-------|------|------|-------------|
| 01 | Niche Researcher | Finds profitable product opportunities | Weekly deep, daily quick | No |
| 02 | Design Generator | Creates product artwork and designs | On brief from 01 | No |
| 03 | Listing Optimizer | Writes copy, creates mockups | After 02 completes | No |
| 04 | Publisher | Uploads products to marketplaces | **After human review** | YES — before this agent runs |
| 05 | Analytics | Tracks performance, reports, recommends kills | Weekly | No |

---

## Pipeline Flow

```
[01 Niche Researcher]
    ↓ ranked opportunity brief
[02 Design Generator]
    ↓ product files (designs, formatted for marketplace specs)
[03 Listing Optimizer]
    ↓ listing package (copy, mockups, tags, categories)
[HUMAN REVIEW GATE]
    ↓ approve / reject / revise
[04 Publisher]
    ↓ live listings
[05 Analytics]
    ↓ weekly performance report → kill/scale recommendations
```

---

## Human Review Gate

The only mandatory owner touchpoint before publishing.

**Time required:** 5-15 minutes per batch (10-20 products)

**Review checklist:**
- Design quality: would you pay for this? Is it actually good?
- Listing copy: does it make sense? Does it sell the product?
- AI disclosure: is it present where required?
- IP check: does any design look like it copies a recognizable brand or IP?
- Pricing: does the price look right for the niche?

Approve → Publisher proceeds
Reject → return to Design Generator or Listing Optimizer with notes
Revise → minor edits in review, then publish

---

## Infrastructure Requirements

When activated, provision:

- Claude API key (for agents 01, 03, 05 — text reasoning)
- Midjourney account (or Flux API / Ideogram API) for agent 02 — image generation
- Real-ESRGAN installed locally or API access — upscaling
- Etsy API credentials (for agents 04 publisher)
- Amazon KDP account (for agent 04 KDP uploads)
- Printful API key (for agent 04 POD fulfillment)
- Make.com or n8n instance for orchestration and scheduling
- Shared file storage (Dropbox or S3) for design assets between agents

---

## Agent Files

- [[01-niche-researcher]] — opportunity scanning
- [[02-design-generator]] — product creation
- [[03-listing-optimizer]] — copy and mockups
- [[04-publisher]] — marketplace upload
- [[05-analytics]] — performance tracking
