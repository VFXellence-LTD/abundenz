> Salvaged from _passive_income/ecosystems/conduit/agents/02-content-generator.md — 2026-06-05. Overlaps polymath/vault/ecosystems/conduit if agent specs exist there. Dedupe TODO — see [[3_notes/dedupe-passive-income-vs-polymath]].

# Agent Pattern: Content Generator (Conduit / Zrodinger)

Autonomous content generation for TikTok and Pinterest. Produces scripts, captions, and coordinates with video render pipeline.

---

## Input

```json
{
  "products": [{
    "name": "AI Writing Assistant",
    "price": "$49/month",
    "key_features": ["Real-time suggestions", "AI-powered", "Plagiarism checker"],
    "benefit": "Write 10x faster with AI",
    "affiliate_url": "https://...",
    "affiliate_program": "Amazon Associates",
    "commission": "10%",
    "category": "SaaS / Writing Tools",
    "hashtags": ["AIWriting", "ProductivityApps"]
  }]
}
```

---

## Output (TikTok Script JSON)

```json
{
  "product": "AI Writing Assistant",
  "platform": "tiktok",
  "format": "15-60s vertical",
  "hook": "I tested 5 AI writing tools... this one's the best",
  "caption": "Full caption with #ad and hashtags",
  "hashtags": ["#ad", "#AIWriting", "#ProductivityApps"],
  "cta": "Check pinned comment for link",
  "affiliate_link": "https://...",
  "video_specs": {
    "duration": "45s",
    "dimensions": "1080x1920",
    "format": "MP4",
    "framerate": "30fps"
  }
}
```

---

## Content Generation Workflow

### Phase 1: Script Generation (Claude)
1. Parse product (name, benefit, key features, affiliate URL)
2. Generate 3 hook variations: curiosity, value, trend
3. Generate demo script (what will be shown on screen)
4. Generate CTA script

### Phase 2: Captions & Hashtags (Claude)
1. Caption: 150-300 chars for optimal CTR
2. Format: pros/cons for scannability
3. 2-3 trending hashtags (from Discover tab, updated weekly)
4. 3-5 niche hashtags
5. 3-5 long-tail hashtags
6. `#ad` mandatory (FTC)
7. Affiliate link CTA

### Phase 3: Video Render
- Higgsfield CLI / Keyvello / CapCut
- 1080x1920, 30fps, 4000kbps, MP4
- Add trending sound + caption overlays

---

## Script Templates

**Template 1: Unboxing (Cold Start)**
Hook (1-3s) → Demo (15-30s) → Review (5-10s) → CTA (2-3s)

**Template 2: Comparison (Growth Phase)**
Hook → Split screen comparison → Winner reveal → CTA

**Template 3: Tutorial (Engagement Phase)**
Hook → Step-by-step → Result → CTA

**Template 4: Trending Sound (Viral Attempt)**
Apply product angle to trending meme format.

---

## Batch Processing Goal

35+ videos in 4 hours (7 videos/hour). Monday evening: script all 5-7 products → render overnight → schedule for the week.

---

## Quality Assurance Checklist

| Check | Criteria |
|-------|----------|
| Hook | First 3 sec engaging? |
| Video quality | 1080x1920, <287MB |
| Caption | <300 chars, 2-3 trending hashtags, #ad present |
| Affiliate link | Present in pinned comment CTA |
| Compliance | #ad visible, no misleading claims |

---

## Related

- [[5_knowledge/reference/growth-playbooks/tiktok-best-practices]] — platform tactics
- [[2_architect/patterns/agents/conduit-scheduler]] — downstream scheduling agent
