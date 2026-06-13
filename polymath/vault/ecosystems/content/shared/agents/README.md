# Signal — Agent System Overview

13 agents that turn one voice recording into a full week of platform-native content, with analytics and revenue tracking.

---

## Automation Tiers

| Tier | Definition |
|------|-----------|
| **Autonomous** | Runs without human input. Outputs stored, surfaced in digest. Human reads output, doesn't need to act. |
| **Human-in-loop** | Agent runs, produces options or draft. Human makes a decision or edit before the pipeline continues. |
| **Human-core** | This stage IS the human. No AI substitution. Agent scaffolding only (scheduling, reminders, file prep). |

---

## Agent Registry

| # | Agent | Tier | Trigger | Build Order |
|---|-------|------|---------|-------------|
| 01 | Trend Scout | Autonomous | Daily 06:00 UTC | First — no dependencies |
| 02 | Topic Researcher | Autonomous | On demand (input from Scout or human) | After 01 |
| 03 | Script Outliner | Human-in-loop | After 02 output | After 02 |
| 04 | Voice Recording | Human-core | After 03 approval | After 03 |
| 05 | Transcriber | Autonomous | On new audio file | Independent |
| 06 | Editor | Autonomous | After 05 output | After 05 |
| 07 | Thumbnail Generator | Human-in-loop | After 06 output | After 06 |
| 08 | Atomizer | Human-in-loop | After 06 + 05 output | After 05, 06 — core agent |
| 09 | Scheduler | Autonomous | After 08 approval | After 08 |
| 10 | SEO Optimizer | Autonomous | After 08 output | After 08 |
| 11 | Engagement Monitor | Autonomous | Daily 08:00 UTC | Independent |
| 12 | Analytics Reporter | Autonomous | Weekly Friday 18:00 UTC | After all platforms live |
| 13 | Monetization Tracker | Autonomous | Monthly 1st, 09:00 UTC | After first revenue event |

---

## Build Order (Phase 0 → Phase 1)

Phase 0 build sequence — build in this order, don't skip ahead:

```
Week 9-10 (first automation):
  01 Trend Scout → provides daily topic inputs

Week 11-12:
  05 Transcriber → needed for everything downstream
  02 Topic Researcher → depends on Scout output

Week 13-14:
  03 Script Outliner → depends on Researcher
  08 Atomizer → core of the content machine (build this fourth, it's complex)

Week 15-16:
  10 SEO Optimizer → depends on Atomizer output
  09 Scheduler → depends on Atomizer approval

Week 17-18:
  06 Editor → audio automation
  07 Thumbnail Generator → visual automation

Week 19-20:
  11 Engagement Monitor → requires active platforms
  12 Analytics Reporter → requires live data

After first revenue:
  13 Monetization Tracker
```

Agents 04 (Voice Recording) is never built — it's a workflow stage, not software.

---

## Tool Stack (across all agents)

| Tool | Used by | Purpose |
|------|---------|---------|
| Claude API (claude-sonnet-4-6) | 01, 02, 03, 08, 10, 11 | Language generation and analysis |
| Whisper API / AssemblyAI | 05 | Transcription |
| Descript or Auphonic | 06 | Audio editing automation |
| Ideogram / Midjourney API | 07 | Thumbnail image generation |
| Canva API | 07 | Template-based thumbnail composition |
| Buffer / Hypefury / Publer | 09 | Scheduling across platforms |
| YouTube Data API | 11, 12 | Analytics and comment monitoring |
| Beehiiv API | 11, 12 | Newsletter analytics and scheduling |
| Ghost API | 09, 10 | Blog post management |
| Airtable | All | Central data store for content pipeline |
| Make.com or n8n | All | Orchestration / workflow automation |

---

## Data Flow

```
[01 Trend Scout] ──topic list──► [02 Topic Researcher] ──brief──► [03 Script Outliner]
                                                                          │
                                                              HUMAN APPROVAL (outline)
                                                                          │
                                                             [04 Voice Recording — HUMAN]
                                                                          │
                                                                     audio file
                                                                   ┌──────┴──────┐
                                                               [05 Transcriber] │
                                                                   │             │
                                                              transcript      audio file
                                                                   │             │
                                                               [06 Editor] ◄────┘
                                                                   │
                                                         edited audio + transcript
                                                                ┌──┴──┐
                                                           [07 Thumb]  [08 Atomizer]
                                                                │            │
                                                         HUMAN PICKS   HUMAN REVIEWS
                                                                │       all derivatives
                                                                │            │
                                                           [09 Scheduler] ◄──┘
                                                                │
                                                   [10 SEO Optimizer] (concurrent)
                                                                │
                                                     [11 Engagement Monitor] (ongoing)
                                                                │
                                                   [12 Analytics Reporter] (weekly)
                                                                │
                                                  [13 Monetization Tracker] (monthly)
```

---

## Airtable Schema (Central Data Store)

All agents read from and write to a shared Airtable base. Tables:

- **Topics** — Trend Scout outputs, Topic Researcher briefs, source, date, priority
- **Content Pipeline** — One row per pillar, status tracking from outline to published
- **Derivatives** — Child records linked to pillar: platform, type, status, scheduled_time, published_url
- **Analytics** — Weekly snapshots per platform per piece
- **Revenue** — Monthly P&L per stream

Each agent spec below references which Airtable table it reads/writes.
