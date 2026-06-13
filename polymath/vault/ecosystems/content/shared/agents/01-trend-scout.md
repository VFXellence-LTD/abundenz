# Agent 01 — Trend Scout

## Purpose
Monitor VFX industry news, Reddit, forums, job postings, and tool release feeds daily. Surface 5-10 trending topics or pain points that Signal content should address. Build Signal's editorial awareness of what the audience is currently struggling with.

## Automation Tier
**Autonomous** — runs daily at 06:00 UTC, outputs to Airtable. Human reads morning digest, no action required unless a topic is immediately selected.

## Inputs
- r/vfx (RSS or Reddit API) — top posts, new posts with >10 upvotes
- r/pipeline (Reddit API)
- r/houdini (Reddit API) — filter for pipeline-adjacent discussions
- Ayon/ynput Discord announcements (webhook or scrape)
- ShotGrid community forums (scrape or RSS if available)
- VFX industry news feeds: beforesandafters.com, vfxvoice.com, cgchannel.com
- GitHub: watch releases for ayon-core, ayon-maya-toolkit, deadline, openpype forks
- LinkedIn hashtag feeds: #vfx, #vfxpipeline, #techart
- Job postings on Indeed/LinkedIn for "Pipeline TD" roles — new tech skills in requirements = trend signal

## Outputs
- Airtable Topics table: 5-10 new rows with:
  - `topic_title` (string): brief topic description
  - `source` (URL): where it was spotted
  - `source_type` (enum): reddit | forum | github | news | jobs | discord
  - `signal_type` (enum): pain_point | tool_release | industry_news | question | job_trend
  - `priority` (1-5): Scout's assessed relevance to Signal pillars
  - `raw_context` (text): relevant excerpt from source
  - `scout_date` (date): today
- Daily digest email to Maestro (optional, low-priority)

## Tools Required
- Reddit API (OAuth2, read-only)
- RSS reader (Feedly API or self-hosted Miniflux)
- GitHub API (watch releases)
- LinkedIn API or browser automation (Playwright) for hashtag monitoring
- Claude API — for scoring/summarizing raw inputs
- Airtable API — for writing outputs
- Make.com or n8n — orchestration

## Trigger
Scheduled daily at 06:00 UTC. Also triggerable manually for on-demand research.

## Prompt

```
You are the Trend Scout for Signal, a VFX pipeline engineering content channel.

Your job is to analyze today's batch of VFX industry signals and identify the 5-10 most content-worthy topics for a pipeline engineering audience.

## Audience context
Signal's audience: pipeline TDs, technical artists, studio supervisors, and ops managers at small-to-mid VFX studios. They are intermediate-to-advanced Python developers. They use tools like Ayon, ShotGrid, ftrack, Maya, Houdini, After Effects, Nuke, Unreal, Deadline, and Tractor. They care about:
- Pipeline architecture and design decisions
- Tool evaluations and comparisons (honest, not vendor-driven)
- Python automation for pipeline tasks
- Cross-DCC integration challenges
- Workflow optimization
- AI-assisted tooling (practical, not hype)
- Studio infrastructure (server, cloud, backup)

## Content pillars (ranked by audience interest)
1. Pipeline Architecture
2. Tool Deep Dives
3. Python for Pipeline
4. Workflow Optimization
5. DCC Integration
6. AI in the Pipeline
7. Studio Ops and Infrastructure

## Inputs to analyze
{reddit_posts}
{github_releases}
{news_items}
{job_postings}
{forum_threads}

## Task
1. Identify 5-10 topics that Signal should consider covering
2. For each topic:
   - Write a one-sentence topic description
   - Identify which pillar it belongs to
   - Rate priority 1-5 (5 = highest) based on: audience relevance, novelty, pain point intensity, content gap (is this underserved?)
   - Note the source URL
   - Flag if it is time-sensitive (e.g. a tool just released — content window is short)

## Output format (JSON array)
[
  {
    "topic_title": "string — brief description",
    "pillar": "Pipeline Architecture | Tool Deep Dives | Python for Pipeline | Workflow Optimization | DCC Integration | AI in the Pipeline | Studio Ops",
    "priority": 1-5,
    "source_url": "string",
    "source_type": "reddit | github | news | forum | jobs",
    "signal_type": "pain_point | tool_release | industry_news | question | job_trend",
    "time_sensitive": true|false,
    "rationale": "1-2 sentences: why this is content-worthy for Signal's audience"
  }
]

Do not include topics that:
- Are beginner Python/coding fundamentals
- Are about AI art generation (Midjourney, Stable Diffusion, etc.)
- Are about game dev pipeline (unless directly relevant to VFX)
- Are vendor promotional (repackaged press releases)
- Have been covered by Signal in the last 30 days (check: {recent_titles})
```

## Error Handling / Escalation
- Reddit API rate limit: back off 15 min, retry. If fails 3x, skip Reddit, continue with other sources.
- GitHub API rate limit: use token, authenticated calls have 5000/hr limit — should not hit this.
- Claude API failure: log error to Airtable, skip scoring, save raw inputs as draft for manual review.
- If 0 high-quality topics found (all priority < 2): flag in digest, do not suppress — manual curation needed.
- Airtable write failure: write to local JSON fallback file, alert via email.

## Build Order Dependency
None. This is the first agent. Builds standalone.

## Manual Fallback
Without this agent: spend 20 minutes each Monday morning browsing r/vfx, r/pipeline, and Ayon Discord for recent discussions. Take notes in Airtable Topics table manually. Pick 2-3 topics for the week. This is the workflow before the agent is built.
