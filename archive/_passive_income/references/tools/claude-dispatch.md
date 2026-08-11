# Claude Dispatch

**Category:** Claude Code agent deployment (VM-based / scheduled)
**URL:** (verify before adopting)
**Captured:** 2026-05-08
**Status:** evaluating
**Ecosystem fit:** multiple | controller

---

## What it does

Infrastructure tool for deploying Claude Code agents to run autonomously — on a schedule, in a VM, or triggered by events — without requiring the operator to be present. Enables true background automation: agents that run nightly, weekly, or on a cron without a human keeping Claude Code open.

This is the missing layer between "Claude does work when I ask it to" and "Claude does work on its own schedule."

## Where it fits in polymath

- **Controller**: Automated monitoring, weekly briefs, kill-switch checks, budget alerts — all could run on a schedule via Claude Dispatch.
- **Signal**: Atomization pipeline agents, trend-checking agents, calendar management could run unattended.
- **Conduit**: Pin scheduling, product research, commission tracking — all automation targets.
- **Shared**: The automation *layer* that makes Polymath's agent-based approach actually passive.

Claude Dispatch is not ecosystem-specific — it's infrastructure that all ecosystems eventually need. However, the 30-day manual rule applies: don't automate what hasn't been done manually for 30 days.

## Pricing

Unknown. Likely VM-based (cloud compute costs) or SaaS subscription. Verify before adopting.

## Decision rule

Adopt when: any ecosystem has a workflow running manually for 30+ days that is genuinely bottlenecked by the need for human-initiated agent runs. Signal Phase 2 is the likely trigger.

## Verdict

- [ ] Adopt now
- [x] Park — revisit when Signal reaches Phase 2 and manual agent runs are the bottleneck
- [ ] Reject — reason: ___
