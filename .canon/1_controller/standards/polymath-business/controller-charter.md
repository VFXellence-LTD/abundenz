# Controller

The oversight layer. Watches all five ecosystems, surfaces decisions, manages shared budget and risk.

## What the controller is

A meta-agent (or scheduled job stack) that runs above all five ecosystems. It does **not** orchestrate any ecosystem's daily content pipeline — each ecosystem has its own orchestrator for that. The controller exists to answer questions only a top-level view can answer:

- Are all active ecosystems within budget this month?
- Is one ecosystem starving another for the owner's attention?
- Did any ecosystem violate the brand isolation policy?
- Are kill-switch conditions met for any ecosystem?
- What does the consolidated revenue picture look like?

## What the controller is NOT

- **Not a content router.** It never moves an asset from Signal to Surge to Atelier or vice versa. That violates brand isolation.
- **Not a publisher.** It cannot post on behalf of any ecosystem.
- **Not an editor.** It does not modify scripts, captions, prompts, or brand assets in any ecosystem.
- **Not an arbiter of taste.** Niche-level creative decisions stay inside the relevant ecosystem.

The controller's only outputs are: dashboards, alerts, and pause commands.

## Responsibilities

### 1. Budget oversight
- Aggregate monthly spend across all ecosystems' tooling
- Alert at 80% of monthly cap
- Hard pause API-billable agents (not the human owner) at 100%
- Maintain `controller/budget.md` with current month's burn and projection

### 2. Cadence health
- Track posting cadence per ecosystem against its own calendar
- Alert if any active ecosystem misses 3 consecutive scheduled posts
- Track owner time-per-day per ecosystem; alert if Signal exceeds 45 min/day, Surge exceeds 30 min/day, or Atelier exceeds 30 min/day (these are the burnout indicators)

### 3. Kill-switch monitoring
Maintains `controller/kill-switch-criteria.md`. Triggers an alert (not an auto-shutdown — owner decides) when any of these are met:
- Any ecosystem demonetized or banned on its primary platform
- Any ecosystem's revenue declines >50% month-over-month for two consecutive months
- Brand isolation policy violation detected (see `shared/brand-isolation/`)
- Owner reports burnout, illness, or attention drain on any ecosystem
- Legal or compliance issue raised against any ecosystem

### 4. Cross-ecosystem analytics
Produces the **Monday Ecosystem Brief** weekly:
- Revenue by ecosystem and by stream within each
- Owner hours by ecosystem
- Top 3 wins and top 3 problems per active ecosystem
- One recommended decision needing owner input

### 5. Brand isolation enforcement
- Periodic check that ecosystems are not cross-linking
- Verifies separate payment processors, separate contact emails, separate domains
- Logs any case where the same external party (sponsor, partner) is approaching multiple ecosystems

## What the controller looks at, what it doesn't

| Looks at | Does not look at |
|---|---|
| Aggregated revenue | Individual transaction details |
| Posting cadence (count, timing) | Post content |
| Tool spend totals | Tool prompt internals |
| Owner-reported time | Owner private notes |
| Kill-switch indicators | Niche-specific creative direction |

This separation matters. The controller has visibility into health metrics, not creative work product. If you ever want to shut polymath down, the controller's data is what you keep; the ecosystems' content is what stays with each ecosystem.

## Implementation options (pick one)

| Option | When it fits | Cost |
|---|---|---|
| **Manual weekly review** | Months 1-9, when only Signal is live | $0 |
| **Make.com / n8n scenario** | Months 10+, when 2+ ecosystems are live | ~$10/mo |
| **Custom orchestrator (Claude Code agent)** | Month 15+, when complexity warrants it | API costs only |

Start manual. Automate the slowest step. Same rule as everywhere else in this system.

## Files in this directory

- `README.md` — this file
- `budget.md` — current month spend tracker (created month 1)
- `kill-switch-criteria.md` — explicit conditions for shutting down an ecosystem (created month 1)
- `weekly-brief-template.md` — template for the Monday Ecosystem Brief (created when 2nd ecosystem launches)
- `escalation-log.md` — running log of decisions surfaced to owner (created month 1)

These files are stubs at first. They populate as the system runs.
