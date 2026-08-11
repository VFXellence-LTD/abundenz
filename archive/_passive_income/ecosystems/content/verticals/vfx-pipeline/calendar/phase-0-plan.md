# Signal — Phase 0 Plan (90-Day Launch)

The structured path from nothing to consistent daily content. Phase 0 ends when Signal has at least one active revenue stream and consistent weekly content cadence established.

---

## Phase 0 Goals

By Day 90, Signal should have:
- [ ] YouTube channel live with 5+ published videos
- [ ] Newsletter live with 100+ subscribers
- [ ] Blog live with 5+ published posts
- [ ] Agent 01 (Trend Scout) operational
- [ ] Agent 05 (Transcriber) operational
- [ ] First digital product listed (Studio Audit Checklist)
- [ ] First consulting inquiry received (via YouTube or newsletter)
- [ ] Consistent 3x/week content cadence established

Niche lock validation: **any one of**: 250+ YouTube subscribers, 150+ newsletter subscribers, first paid product sale, first consulting client.

---

## Weeks 1-2: Identity and Infrastructure

### Week 1 (Days 1-7)

**Goal:** Brand identity finalized, all accounts registered.

**Day 1-2: Brand finalization**
- Finalize channel name (options to evaluate: "Signal Pipeline", "Pipeline Signal", "[Name] Pipeline", etc.)
- Check name availability: YouTube, domain (.com/.io), Twitter/X, LinkedIn, Instagram, Reddit
- Decision rule: pick the name that has availability on all platforms. Don't get attached to a name that's taken.
- Register domain (Ghost blog hosting or similar)

**Day 3: Visual identity**
- Create base Canva templates: thumbnail template, carousel template, newsletter header
- Color palette locked: primary background + accent + code theme
- Font selection: JetBrains Mono (code) + Inter (body)
- Export base assets to `assets/` folder

**Day 4-5: Social account creation**
- Create YouTube channel (with brand account, not personal Google account)
- Create X/Twitter handle
- Create Instagram business profile
- Create LinkedIn page (or use personal LinkedIn with Signal content)
- Create Pinterest business account
- Set consistent bio, profile image, and link across all platforms
- Do NOT post yet — get accounts aged and set up correctly

**Day 6-7: Blog and newsletter setup**
- Set up Ghost (self-hosted on $6/month DigitalOcean droplet, OR Ghost Pro at $9/month)
- Configure domain
- Set up Beehiiv free account
- Configure newsletter signup form, embed on Ghost blog
- Write the "About" page for the blog (200 words: who this is for, what Signal covers)

**Week 1 deliverable:** All accounts exist, brand identity locked, blog + newsletter live (no content yet).

---

### Week 2 (Days 8-14)

**Goal:** Recording equipment tested, first content drafted.

**Day 8-9: Recording environment setup**
- Test microphone setup (record test audio, check levels, listen back)
- Install and configure DAW (Audacity is fine for Phase 0)
- Install OBS for screen capture (for screen-share pillar format)
- Test recording workflow end-to-end: record → export → review quality
- Set up file folder structure: `_recordings/`, `_transcripts/`, `_outlines/`, `_derivatives/`

**Day 10-11: Niche brief and style guide finalization**
- Confirm `brief/niche.md` is accurate — does the niche still feel right?
- Confirm `brief/style-guide.md` matches the voice that feels natural on-camera
- Write first 5 topic ideas (don't research yet — just brainstorm from production experience)

**Day 12-14: Channel trailer**
- Script and record a 90-second channel trailer (what Signal is about, who it's for)
- This will be the first upload — not a content video, just a trailer
- Edit trailer manually (don't automate yet — it's one video)
- Upload to YouTube, set as channel trailer (not published as a regular video)

**Week 2 deliverable:** Recording workflow confirmed, channel trailer ready.

---

## Weeks 3-4: Content Banking

**Goal:** Record 5 pillar episodes before launch. Bank content = no pressure gap when publishing starts.

**Week 3 (Days 15-21): First 3 pillars**

Day 15-16: Research + outline pillar 01
- Manual process: research topic, write outline, review outline
- Topic recommendation: start with something you know cold — something you've explained 10 times to other TDs
- Good options: naming conventions, Ayon setup overview, Maya vs Houdini pipeline differences, "what a pipeline actually is"

Day 17: Record pillar 01 (20-30 min)

Day 18-19: Research + outline pillar 02

Day 20: Record pillar 02

Day 21: Review both recordings, note any quality issues

**Week 4 (Days 22-28): Pillars 3-5**

Day 22-23: Outline + record pillar 03
Day 24-25: Outline + record pillar 04
Day 26-27: Outline + record pillar 05

Day 28: Review all 5 recordings. Quality check:
- Audio clean?
- Content flows?
- Anything too short (< 6 min) or too long (> 18 min)?
- Re-record any that fail quality check

**Week 4 deliverable:** 5 pillar recordings ready, at least 4 passing quality check.

---

## Weeks 5-6: Platform Setup and Content Preparation

**Goal:** All publishing platforms configured, first content prepared for launch.

**Week 5 (Days 29-35): YouTube channel launch prep**
- Manually transcribe + edit 2 of the 5 pillar recordings (no automation yet)
- Write blog posts for the same 2 pillars (30-45 min each)
- Write newsletter issues for the same 2 pillars (15-20 min each)
- Design thumbnails manually in Canva (2 thumbnails)
- Configure YouTube channel: about section, channel art, playlists by pillar, links

**Week 6 (Days 36-42): Remaining content prep**
- Transcribe + edit remaining 3 pillar recordings
- Write blog posts for all 5 pillars
- Write newsletter issues for all 5 pillars
- Design all 5 thumbnails
- Write X threads for top 3 pillars
- Write LinkedIn posts for top 3 pillars
- Set up Buffer or Publer for social scheduling

**Week 6 deliverable:** 5 pillars fully produced and ready to publish. Blog posts written. Newsletters written. Social derivatives written. All scheduled in advance (don't publish yet).

---

## Weeks 7-8: Launch

**Goal:** Go live across YouTube + newsletter simultaneously. Begin consistent posting.

**Week 7 (Days 43-49): Launch week**

Day 43: **LAUNCH**
- Publish first YouTube video (pillar 01)
- Send first newsletter issue (pillar 01 angle)
- Publish blog post (pillar 01)
- Post to X, LinkedIn, Instagram
- Post Reddit — community-native discussion version

Day 44: Post first YouTube Short (derived from pillar 01)

Day 45: Publish second YouTube video (pillar 02)
Day 46: Second newsletter
Day 47: Publish third YouTube video (pillar 03)
Day 48: Third newsletter, second batch of shorts
Day 49: Review first week's engagement — what did people respond to?

**Week 8 (Days 50-56): Maintain cadence + record week 2 content**

- Continue posting from banked content (pillars 04 + 05)
- Record 3 new pillars for the following week (this is the ongoing rhythm)
- Note: first analytics data is available now — use to inform topics

**Week 8 deliverable:** Signal is live. First 7 pieces published. Consistent cadence established.

---

## Weeks 9-12: Automation Phase

**Goal:** Build first automation agents, reach content cadence of 3 pillars/week.

**Week 9 (Days 57-63): Build Agent 01 — Trend Scout**
- Set up Reddit API access (free, needs account + OAuth app)
- Configure RSS feeds for VFX news sources
- Set up Airtable base with Topics table
- Build Scout orchestration in n8n or Make.com
- Test: run Scout, review output quality, tune prompt

**Week 10 (Days 64-70): Build Agent 05 — Transcriber**
- Set up Whisper API access (OpenAI account)
- Build vocabulary hint list (`shared/pipeline-vocab.txt`)
- Build transcription workflow: audio file → Whisper → Claude clean pass → save
- Test: run on one of the already-recorded pillars, check quality

**Week 11 (Days 71-77): Build Agent 02 — Topic Researcher + ramp to 3 pillars/week**
- Set up Brave Search API or Perplexity API
- Build research brief generation workflow
- Pilot new content cycle: use Scout + Researcher for next week's topics
- Begin recording 3 pillars/week (Mon/Wed/Fri rhythm per [[workflows/weekly-content-cycle]])

**Week 12 (Days 78-84): Consistent 3x/week cadence**
- Cadence should feel sustainable — not rushed
- Manual derivative production taking ~4-5 hours/week (acceptable in Phase 0)
- First analytics review: use weekly report to identify top-performing content theme

**Week 12 deliverable:** Running at 3 pillars/week, Agents 01 and 05 operational, analytics informing topics.

---

## Week 13: First Product Launch

**Goal:** List first digital product (Studio Audit Checklist) and validate product market.

**Day 85-87: Build Studio Audit Checklist**
- Write the checklist (1-2 days)
- Format in Notion + export PDF
- Set up Gumroad product page with cover image, description, pricing

**Day 88: Create supporting content**
- Record a 10-minute YouTube video: "The pipeline audit I wish I'd done before production started"
- This video is the primary marketing for the product
- Mention the product at the end: "If you want the complete audit checklist I use, it's $19 in the description"

**Day 89-90: Launch checklist + first analytics gate**
- Publish the video
- Add Gumroad link to: video description, blog post, newsletter, X thread, LinkedIn
- Check Phase 0 validation metrics (are any of the thresholds met?)

**Phase 0 complete when:** Any one of: 250+ YouTube subscribers, 150+ newsletter subscribers, first paid sale, first consulting client.

---

## Phase 0 Success Metrics (Day 90 Checkpoint)

| Metric | Target | Stretch |
|--------|--------|---------|
| YouTube subscribers | 250 | 500 |
| YouTube videos published | 15-20 | 25+ |
| Newsletter subscribers | 150 | 300 |
| Newsletter open rate | 35%+ | 45%+ |
| Blog posts published | 15+ | 25+ |
| Agents operational | 2 (Scout + Transcriber) | 4 (+ Researcher + Outliner) |
| Products listed | 1 | 2 |
| Revenue (Month 3) | $0-100 | $100-500 |
| Consulting inquiries | 1+ | 3+ |

---

## Phase 0 Risk Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Content quality not good enough | Medium | Bank 5 episodes before launch — reject any that don't meet quality bar |
| Niche is too narrow (no audience) | Low | VFX pipeline has 10,000+ working TDs globally; this is large enough |
| YouTube algorithm doesn't pick up content | Medium | Focus on search-optimized titles; don't rely on algorithm for Phase 0 |
| Consulting niche not established yet | Medium | Start content marketing with consulting-discoverable content (studio audit video is a consulting magnet) |
| Burnout from daily cadence | Medium | The 3x/week rhythm is ~2 hours/day when automation is in place; bank content in advance during Phase 0 |
| Recording quality inconsistent | Low | Test equipment before launch, re-record if quality is unacceptable |

---

## Phase 1 Preview (Days 91-180)

Phase 1 begins when Phase 0 validation metrics are met. Focus shifts to:
- Build Agents 03, 08, 09 (Outliner, Atomizer, Scheduler) — full automation of derivative production
- Launch Agent 11 (Engagement Monitor) — systematic consulting lead capture
- Release Product 02 (Onboarding Pack) and Product 03 (Pipeline Starter Kit)
- Target: first consulting client, $500-1500/month revenue
- Begin building toward YouTube monetization threshold (1K subscribers + 4K watch hours)

Full Phase 1 plan documented in `calendar/phase-1-plan.md` (to be written at Day 85).
