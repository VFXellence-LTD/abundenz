# Workflow: Weekly Content Cycle

The weekly operational rhythm for Signal — from topic selection through analytics review. Designed for a target of 3 pillars per week (Mon/Wed/Fri recording) producing 42-54 derivatives across 9 platforms.

---

## Weekly Overview

| Day | Owner time | What happens |
|-----|-----------|-------------|
| Monday | 15-20 min | Topic selection + Monday recording |
| Tuesday | 20-30 min | Tuesday recording + derivative review (from Monday) |
| Wednesday | 20-30 min | Wednesday recording + derivative review (from Tuesday) |
| Thursday | 20-30 min | Thursday backup recording OR rest |
| Friday | 10-15 min | Analytics review (auto-generated) |
| Saturday | — | Automated posts continue |
| Sunday | — | Automated posts continue |

**Total owner time: 85-125 minutes per week (~2 hours)**

---

## Monday

### 08:00 — Trend Scout Digest Review (10 minutes)

Trend Scout (Agent 01) ran at 06:00 UTC. Digest is ready.

Owner actions:
1. Open Airtable Topics view — this week's Scout output
2. Review 5-10 suggested topics with priority scores
3. Select 3 topics for the week (one per recording day)
4. Check: are these topics already in backlog? Are they duplicates of recent content?
5. Assign to this week's recording slots:
   - Monday slot: Topic A
   - Wednesday slot: Topic B
   - Friday slot: Topic C
6. Update Airtable: `assigned_week = {week}`, `recording_slot = Monday/Wednesday/Friday`

If no good topics from Scout:
- Check backlog (Airtable Topics table, status `backlog`) for queued ideas
- If still nothing: write a topic directly. Takes 5 minutes.

### 09:00 — Topic Researcher triggered (autonomous, ~20 min)

Agent 02 (Topic Researcher) runs automatically when topics are assigned. Produces research brief for each selected topic.

Owner does not wait for this — continues with day.

### 10:30 — Script Outliner triggered (autonomous, ~10 min)

Agent 03 (Script Outliner) runs when research brief is complete. Produces recording outline.

### 11:00 — Outline Review (5 minutes)

Owner reviews Monday outline:
1. Check structure — does it flow? Is the hook strong?
2. Check section order — is this the right sequence for a 10-minute piece?
3. Edit if needed (usually 2-3 tweaks to bullet points)
4. Approve: update Airtable `outline_status = outline_approved`

### 14:00 — Monday Recording (20-30 minutes)

See [[workflows/pillar-to-spokes]] Stage 1.

Record from approved outline. Save file. Update Airtable.

### 14:30 — Pipeline runs automatically

Steps 2-7 trigger autonomously. By end of day:
- Transcript complete
- Audio editing complete
- Thumbnail options generated (waiting for human pick)
- Derivative batch in progress (will be ready by Tuesday morning)

### 15:00 — Thumbnail selection for Monday pillar (2 minutes)

Notification arrives: "5 thumbnail options ready for {Monday topic}"
Pick one. Done.

---

## Tuesday

### 08:00 — Monday derivative batch ready

Overnight, Atomizer completed processing. Batch summary is ready.

Owner actions (5-10 minutes):
1. Open derivative batch summary
2. Scan each derivative — check hook, check voice, check any awkward AI artifacts
3. Approve or edit
4. Approve batch in Airtable

Scheduler (Agent 09) immediately queues all Monday derivatives across platforms.

### 09:00 — Monday derivatives scheduled ✓

YouTube video queued for Tuesday 14:00 UTC.
Blog post queued for Tuesday 08:00 UTC.
All other derivatives queued per schedule.

### 11:00 — Wednesday outline review (5 minutes)

Agent 03 produced Wednesday's outline overnight. Review and approve.

### 14:00 — Tuesday recording (20-30 minutes)

Record the Tuesday pillar (will be released next Wednesday).
Save file, update Airtable.

Note: Signal runs a 1-day offset between recording and release. Today's recording publishes tomorrow's content.

### 14:30 — Pipeline runs automatically for Tuesday recording

---

## Wednesday

### 08:00 — Tuesday derivative batch ready

Review and approve Tuesday's derivatives (5-10 minutes).

### 09:00 — Tuesday derivatives scheduled ✓

### 11:00 — Friday outline review (5 minutes)

Review and approve Friday's outline.

### 14:00 — Wednesday recording (20-30 minutes)

### 14:30 — Pipeline runs

---

## Thursday

### Option A: Record Friday pillar (if ahead of schedule)

Use this day to get ahead — record the Friday topic Thursday instead.
Gives an extra buffer day for derivatives to process.

### Option B: Rest / catch-up

If recordings are on schedule, Thursday is free. Use for:
- Community engagement (Reddit, Discord — 15-20 min)
- Deep engagement responses flagged by Agent 11
- Product development work
- Consulting client work

---

## Friday

### 18:00 — Analytics Reporter runs (autonomous)

Agent 12 automatically generates the weekly analytics brief.

### After dinner / evening — Analytics review (15 minutes)

Owner reads the weekly report. Actions:
1. Check the action recommendations section (always 3-5 items)
2. Note any content themes overperforming — queue more of those for next week
3. Note any platforms underperforming — flag for schedule adjustment
4. If one content format significantly outperforms others — discuss with self whether to double down
5. Update Airtable Topics backlog if analytics suggest new topic ideas

No required action — this is a read-only review unless something is broken.

---

## Weekend

No required owner action. Automated posts continue:
- Saturday: Instagram carousel (if scheduled), Pinterest pins
- Sunday: Reddit post (Monday posting window opens)

Engagement Monitor (Agent 11) runs daily and queues items. Owner optionally reads the weekend digest on Sunday evening.

---

## Platform Posting Calendar (3 Pillars/Week)

When producing 3 pillars/week, derivatives are staggered to avoid clustering:

```
Monday's pillar derivatives:    Tue(YouTube, Blog) Wed(Newsletter, LinkedIn, X) Thu(Instagram) Fri(Pinterest) Mon(Reddit)
Wednesday's pillar derivatives: Wed(YouTube, Blog) Thu(Newsletter, LinkedIn, X) Fri(Instagram) Sat(Pinterest) Tue(Reddit)
Friday's pillar derivatives:    Mon(YouTube, Blog) Mon(Newsletter, LinkedIn, X) Tue(Instagram) Wed(Pinterest) Thu(Reddit)
```

This produces ~3-5 posts per day across all platforms, spread across morning, afternoon, and evening slots.

---

## Ramp-Up Schedule (Phase 0, Weeks 1-8)

Before agent automation is built, run a reduced cadence:

**Weeks 1-8 (manual, 1 pillar/week):**
- Monday: pick topic, research manually (45 min)
- Tuesday: outline, record (45 min)
- Wednesday: manually write blog post + newsletter (90 min)
- Thursday: manually produce social derivatives (45 min)
- Friday: manually schedule via Buffer + Beehiiv (30 min)

Total: ~5 hours/week. Sustainable but not scalable. Build automation during this period.

**Weeks 9-12 (Agent 01 + 05 live, 2 pillars/week):**
- Trend Scout running: removes Monday topic selection work
- Transcription automatic: removes 20 min per recording
- Still manually: outlining, social derivatives, scheduling
- Total: ~3.5 hours/week

**Weeks 13-20 (Agents 08 + 09 live, 3 pillars/week):**
- Atomizer + Scheduler running: removes 90+ min of manual derivative work
- Human time drops to ~2 hours/week
- Revenue: first products live, first ad revenue starting

**Week 20+ (all agents live):**
- Owner time: 2 hours/week for 3 pillars + all derivatives
- Steady state

---

## Red Flags (When the Cycle Breaks)

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| No recording 3+ days | Pipeline stuck on outline approval | Auto-generate outline, skip approval, record, fix outline issues in editing |
| Batch not approved within 24 hours | Human didn't review | Set a 24-hour deadline alert in Airtable automation |
| YouTube video not publishing | Scheduler API issue | Check Scheduler error log, manually upload if needed |
| Newsletter open rate dropping | Content not relevant, wrong send time | Check Analytics Reporter, test different send day |
| No Shorts engagement | Shorts algorithm change, or scripts too long | Re-test shorter formats (30 sec vs 60 sec) |
| Agent 01 not producing quality topics | Reddit API blocked, or content is too similar | Add new signal sources, manually curate for the week |

---

## Weekly Checklist

A minimal decision checklist for the owner each Monday:

```
[ ] Scout digest reviewed, 3 topics selected for week
[ ] All 3 outlines approved before recording day
[ ] Monday recording done before 17:00 (gives agents overnight processing time)
[ ] Monday derivative batch approved by Tuesday 12:00
[ ] Friday analytics report read
[ ] Any high-priority engagement items responded to
[ ] Product or consulting follow-ups actioned (if any)
```
