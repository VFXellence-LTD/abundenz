# Kill-Switch Criteria

Explicit conditions under which an ecosystem should be paused or shut down. Decided in advance, in writing, before there's emotional attachment to keeping anything alive.

The controller monitors these conditions and surfaces alerts. **You decide whether to actually pull the trigger.** The controller never auto-shuts an ecosystem down.

## Why this exists

Most operators don't kill failing ecosystems because they've sunk months of work in. Sunk costs are not reasons to continue. These criteria let you decide rationally — now, when nothing is at stake — what counts as failure.

---

## Pause conditions (orange)

The ecosystem keeps running, but new investment stops. No new tool subscriptions, no new agents, no new platforms. You enter "maintenance only" until the issue resolves.

### Signal — pause if:
- 60 consecutive days with no growth on primary platform
- Owner time exceeds 60 min/day for 14 consecutive days (burnout precursor)
- Three consecutive months of negative net revenue (cost > revenue)
- A platform issues a content policy warning (not strike — warning)

### Atelier — pause if:
- Marketplace platform issues new AI-content policy that affects active listings
- Conversion rate on listings drops below 0.5% for 30 days
- Refund/return rate exceeds 5%
- Costs exceed revenue for any single month after month 3

### Lullaby — pause if:
- Daughter expresses any reluctance about Format B (immediately, no grace period)
- Copyright takedown received on more than one piece in 90 days
- Platform issues new policy on kids' content that affects the workflow
- Owner finds bedtime narration is eating into actual bedtime with daughter (irony killer)

### Surge — pause if:
- RPM drops below $0.20 CPM for 30 consecutive days
- Multiple accounts banned in same week
- Platform policy change eliminates AI content monetization
- Content quality complaints or safeguard violations detected
- Owner time exceeds 30 min/day (should be near-zero at steady state)

### Conduit — pause if:
- Pinterest account restricted or shadowbanned for 14+ days
- Affiliate program (primary network) terminates the account
- Click-through rate drops below 0.5% across all niches for 30 days
- FTC sends inquiry or warning about disclosure compliance
- Monthly costs exceed revenue for 3 consecutive months after month 4

---

## Shutdown conditions (red)

The ecosystem is wound down. Existing content stays for SEO/library value where applicable, but no new content is produced and tooling is canceled.

### Signal — shut down if:
- Demonetized or banned on the primary platform with no clear remediation path
- Revenue declines >50% month-over-month for two consecutive months
- Owner self-reports active burnout or aversion to recording for 30+ days
- Legal action threatened (defamation, IP, etc.) that would require ongoing legal spend
- A second ecosystem (Atelier) reaches 2x Signal's revenue and Signal's ROI per hour falls below Atelier's

### Atelier — shut down if:
- Primary marketplace bans AI content or delists your storefront with no path to reinstate
- Three consecutive months of zero new sales after month 6
- Brand isolation policy is violated and the violation cannot be remediated
- Owner finds the work generates active resentment (this matters more than money)

### Lullaby — shut down if:
- Daughter expresses she doesn't want any of it public, at any age
- Any safeguard in `ecosystems/lullaby/safeguards/POLICY.md` is violated and cannot be remediated
- Channel termination on YouTube due to MFK or COPPA violation
- Inappropriate audience contact reaches the family (real-world, not just online comments)
- Owner notices the work changing how they read to their daughter privately (i.e., performance creeping into family time)

### Surge — shut down if:
- All major platforms ban AI-generated content simultaneously
- RPM approaches zero with no recovery path
- Safeguard violations become systemic (content harming people)
- Legal action related to Surge content

### Conduit — shut down if:
- Pinterest bans the account with no reinstatement path
- All primary affiliate programs terminate the account
- FTC enforcement action
- Revenue declines >70% month-over-month for two consecutive months
- Boss finds the work generates active resentment (same as Atelier — this matters more than money)

---

## Hard rule: a shutdown of one ecosystem does not auto-shutdown the others

The whole point of running all five is uncorrelated risk. If Atelier dies because Etsy bans AI content, Signal and Surge continue. If Signal dies because the niche burns out, the other ecosystems continue. Don't let one death drag the others down emotionally.

---

## Decision protocol

When a condition is hit, the controller raises an alert. You then:

1. **24-hour cooling period.** Do not act the same day the alert fires. Almost all bad shutdown decisions happen in the first 24 hours.
2. **Confirm the data.** Is the metric actually what it appears? Platform analytics lag and lie.
3. **Consult the criteria above.** Is this the situation you predicted, or is it something else?
4. **Decide and document.** Whatever you decide, write the reason in `controller/escalation-log.md`. Future-you needs to know why.
5. **If shutdown: announce honestly.** Audiences forgive shutdowns. They do not forgive ghosting.

---

## Review cadence

Re-read this file every 3 months. Adjust thresholds based on what you've learned. The point is to have explicit criteria — not perfect criteria.

Last reviewed: 2026-05-03 (initial creation)
