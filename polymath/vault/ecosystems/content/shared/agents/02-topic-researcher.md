# Agent 02 — Topic Researcher

## Purpose
Take a topic (from Trend Scout or direct human input) and produce a deep research brief. The brief tells the Script Outliner exactly what ground to cover: what's already been said, what's missing, what the audience actually asks, and what angle Signal should take to be useful and differentiated.

## Automation Tier
**Autonomous** — triggered by human selecting a topic from Scout output, or by direct human input of a topic. Runs without further human input. Outputs brief to Airtable + file system.

## Inputs
- `topic_title` (string): the topic to research
- `pillar` (string): which Signal pillar this belongs to
- Optional: `notes` (string): any direction from human on angle or emphasis
- Source context from Trend Scout (if topic came from Scout): raw_context, source_url

## Outputs
- Research brief written to `_research_briefs/{date}-{slug}.md`
- Summary written to Airtable Topics table (linked to topic row):
  - `research_brief_path` (string): file path
  - `research_status` (enum): complete | draft | failed
  - `research_date` (date)
  - `suggested_angle` (string): 1-sentence recommended approach for Signal

Brief structure:
```
# Research Brief: {topic}
## What already exists (competitive content)
## What's missing (content gap)
## Audience questions (from Reddit/forums)
## Suggested angle for Signal
## Key facts, stats, tool versions to include
## Code examples or demos to consider
## Recommended sources for depth
## Related Signal pillars / cross-link opportunities
```

## Tools Required
- Claude API — primary research synthesis
- Perplexity API or web search (Brave Search API) — current search results
- Reddit API — search for relevant threads
- GitHub API — search for relevant repos, issues, READMEs
- YouTube Data API — search for existing videos on topic (competitive landscape)
- Airtable API
- File system write access

## Trigger
On-demand. Triggered when:
1. Human selects a topic from Scout's Airtable output
2. Human inputs a topic directly via interface or webhook

## Prompt

```
You are the Topic Researcher for Signal, a VFX pipeline engineering content channel targeting pipeline TDs, technical artists, and studio supervisors at small-to-mid VFX studios.

## Research task
Topic: {topic_title}
Content pillar: {pillar}
Human notes (if any): {notes}
Source context (if from Scout): {raw_context}

## Step 1 — Competitive content analysis
Search for existing content on this topic:
- YouTube: What videos exist? What do they cover? How old are they? How many views?
- Blogs: What articles exist? Are they current? Vendor-written or independent?
- Reddit: What have people actually asked or discussed?
- GitHub: Are there repos, issues, or discussions about this?

Summarize findings as:
- What already exists (title, platform, recency, quality, gaps)
- Content quality gaps (what existing content gets wrong or leaves out)
- Audience pain points expressed in forum/Reddit posts (quote directly where possible)

## Step 2 — Angle identification
Based on the competitive landscape, what should Signal's specific angle be?

Signal differentiators:
- Production experience (this is from someone who has shipped real pipelines)
- Engineering depth (real code, real configs — not architecture diagrams only)
- Independence (no vendor relationships influencing opinion)
- Intermediate-advanced audience (does not dumb down)
- Opinionated (has a recommendation, not a "it depends on your use case")

Propose 2-3 possible angles for the topic. For each, note: what makes it different, what it requires (demo setup, specific tools, etc.), and which persona it serves best.

Recommended angle: pick one and justify it in 2-3 sentences.

## Step 3 — Content requirements
For the recommended angle:
- Key facts, versions, or stats that must be accurate
- Tools or configurations to demonstrate
- Code examples or demos that would be needed
- Things to avoid saying (vendor talking points, known inaccuracies in existing content)
- Potential gotchas (this is a live system — what could break in a demo?)

## Step 4 — Source list
List 5-10 sources the Script Outliner and human should read before recording:
- Official docs (with specific page/section)
- Community discussions (with URLs)
- GitHub repos (with specific relevant files/issues)
- Competing videos to watch and differentiate from

## Output format
Produce a structured markdown brief following this template:

---
# Research Brief: {topic_title}
**Pillar:** {pillar}
**Date:** {date}
**Status:** complete

## What already exists
{competitive analysis}

## Content gap
{what's missing}

## Audience questions (verbatim or paraphrased)
{from Reddit/forum search}

## Recommended angle
{chosen angle + justification}

## Alternative angles considered
{2 alternatives not chosen + brief reason}

## Key facts and technical requirements
{must-include facts, tool versions, demo requirements}

## What to avoid
{vendor talking points, common mistakes, inaccuracies to correct}

## Source list for recording prep
{5-10 sources}

## Cross-link opportunities
{related Signal content, other pillars}
---
```

## Error Handling / Escalation
- Search API quota exceeded: log, skip that source, proceed with available sources. Note in brief which sources were unavailable.
- Topic too broad (e.g. "Ayon"): return an error with suggested narrowed topics. Do not proceed with a vague brief.
- No competing content found: this is a good signal — note it in the brief as "no existing content found — high opportunity."
- Claude API failure: save partial results, mark status as "draft," alert human for manual completion.

## Build Order Dependency
Builds after Agent 01 (Trend Scout) is operational, but can be used manually before Scout exists. The research brief can be triggered by human topic input without Scout.

## Manual Fallback
Without this agent: spend 30-45 minutes on manual research:
1. Search YouTube for the topic, note top 5 results and their gaps
2. Search r/vfx and r/pipeline for related threads in last 6 months
3. Check Ayon/ShotGrid docs for official guidance
4. Write a 1-page brief with: what exists, what's missing, your angle
5. File it in `_research_briefs/` folder before outlining
