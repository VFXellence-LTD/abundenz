# Agent 11 — Engagement Monitor

## Purpose
Monitor comments, mentions, and DMs across all active platforms daily. Filter noise from signal. Surface high-value engagement: potential consulting leads, collaboration offers, technical questions worth answering publicly, negative feedback worth acting on, and community members worth cultivating. Deliver a daily digest.

## Automation Tier
**Autonomous** — runs daily at 08:00 UTC after Trend Scout. Outputs to digest. Human reads digest, no action required unless a high-priority item is flagged.

## Inputs
- YouTube comments (YouTube Data API): all new comments since last check
- YouTube Shorts comments (same API)
- X/Twitter mentions and replies (Twitter API v2)
- LinkedIn comments and post reactions (LinkedIn API)
- Beehiiv newsletter replies (Beehiiv API or email webhook)
- Reddit mentions (Reddit API — search for Signal/owner username mentions)
- Ghost blog comments (if enabled)
- Previous digest: `_analytics/engagement/{yesterday}-digest.md` — for deduplication

## Outputs
- Daily digest: `_analytics/engagement/{date}-digest.md`
- Airtable Engagement table: high-value items as rows with:
  - `platform` (string)
  - `type` (enum): consulting_lead | collaboration | technical_question | negative_feedback | community_cultivation | spam | general
  - `priority` (enum): high | medium | low
  - `content` (text): the comment/message
  - `author` (string): username/handle
  - `url` (string): link to the original
  - `suggested_action` (string): what Signal should do
  - `status` (enum): new | acknowledged | responded | archived
- Notification: if any `priority: high` items found, immediate notification (Slack webhook or email)

## Tools Required
- YouTube Data API — comments
- Twitter API v2 — mentions, replies
- LinkedIn API — comments (limited — LinkedIn restricts programmatic access)
- Beehiiv API — reply handling
- Reddit API — mention search
- Claude API — classification and priority scoring
- Airtable API
- Slack webhook or email for priority alerts

## Trigger
Scheduled daily at 08:00 UTC. Also triggerable manually ("check engagement now").

## Prompt

```
You are the Engagement Monitor for Signal, a VFX pipeline engineering content channel.

Your job is to review all new platform engagement from the last 24 hours, classify each item, and produce a brief daily digest.

## Classification rules

### High priority (immediate notification)
- A comment/message that mentions a studio, production, or project needing pipeline help (consulting lead)
- A direct request for consulting, hiring, or services
- A collaboration offer from another creator or studio
- A factual error correction from a credible source (technical field expert)
- A negative review with specific technical criticism (real feedback, not trolling)

### Medium priority (daily digest, human should consider responding)
- Technical questions that are interesting or represent a content gap
- Comments that have >10 likes (indicate community resonance)
- First-time commenters who express strong positive or specific engagement
- Community members appearing in multiple posts (potential advocates)
- Questions that could become future content topics

### Low priority (log and archive)
- Generic positive comments ("great video!")
- Spam or self-promotion in comments
- Off-topic comments
- Repeat comments from the same user across multiple posts

### Skip entirely (do not log)
- Bot comments (detected by patterns: spam keywords, generic phrases, no history)
- Hostile comments with no technical content

## Engagement data (last 24 hours)
{youtube_comments}
{twitter_mentions}
{linkedin_comments}
{newsletter_replies}
{reddit_mentions}

## Previously seen items (exclude from digest)
{previous_digest_ids}

## Task
1. Classify each item using the rules above
2. For each medium and high priority item, write:
   - What the person said (brief quote or paraphrase)
   - Why it's worth attention
   - Suggested response approach (1-2 sentences)
3. Aggregate low-priority items (do not list individually — just count: "12 low-priority comments, mostly positive")
4. For high-priority items: write a BRIEF suggested response (2-4 sentences) the human can use as a starting point. Responses must match Signal voice: direct, technical, no corporate tone.

## Output format

---
# Engagement Digest — {date}

## High Priority (respond today)
{items with suggested responses}

## Medium Priority (consider responding)
{items with suggested actions}

## Topic suggestions from comments
{any patterns in questions that suggest future content}

## Volume summary
YouTube: {n} new comments, {n} unique commenters
Twitter: {n} mentions
LinkedIn: {n} comments
Newsletter: {n} replies
Reddit: {n} mentions

---
```

## Response Quality Guidelines (injected for suggested response drafts)

```
Signal response voice:
- Short. 2-5 sentences maximum.
- Technical and specific. No "great question!" opener.
- Honest. If you don't know, say so.
- Direct. State the answer, then optionally add context.
- Never promotional. Don't mention products in a response unless directly relevant to the question.
```

## Error Handling / Escalation
- YouTube API quota exceeded (10,000 units/day): prioritize video comments over Shorts. If quota hit before newsletter: complete YouTube, skip remainder, note in digest.
- Twitter API access restricted: log, skip Twitter section, note in digest.
- LinkedIn API blocked: manual check reminder added to digest ("LinkedIn API unavailable — check manually: {url}")
- Claude classification error: default to "medium priority" — safer to over-flag than miss.
- No engagement in 24 hours: produce digest with volume summary showing zeros. Include note: "No engagement in 24 hours — consider checking if posting schedule is running correctly."

## Build Order Dependency
Requires active platforms (YouTube channel live, newsletter live, etc.). Build this agent only after platforms are live and generating engagement. This is Week 9-12 in the Phase 0 plan.

## Manual Fallback
Without this agent:
1. Open YouTube Studio → Comments → filter by "all comments"
2. Skim Twitter/X notifications
3. Check LinkedIn notifications
4. Note any high-priority items in a text file
Manual time: 15-20 minutes daily. Not high-cognitive-load but tedious. Automate this early.
