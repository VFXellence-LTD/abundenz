# First-Hour Human Engagement Playbook

**Ecosystem:** viral / @zrodinger
**Type:** Human SOP — post-publish, manual task
**Triggered by:** Stage 10 (Distribute) completing in the clip-factory pipeline

---

## Why the First Hour Matters

The first 30-60 minutes of engagement heavily influences how far a post travels. Platforms read early signal density as a proxy for content quality and use it to set initial distribution. A post that clears the first hour with strong engagement — especially saves and shares — enters a wider distribution pool than one that sits cold.

This window cannot be banked or recovered. It closes once the algorithm has set its initial distribution decision.

**Engagement signal hierarchy (what the algorithm weights most):**

1. **Saves** — "I want this later." Strongest signal. Tells the algorithm the content has lasting value.
2. **Shares** — "Someone else needs this." Reach multiplier. The viewer does the distribution job.
3. **Comments** — Generates reply loops; extends session time on the post.
4. **Likes** — Weakest reach signal. Easy to tap. Useful for surface validation, not algorithmic reach.

Optimize the first-hour actions for saves and shares, not likes.

---

## Why This Is NOT Automated

**Post-publish engagement automation risks platform penalties and account flags** — auto-comment bots, bulk-follow scripts, and simulated reply activity are detectable and violate platform terms of service. This risk is especially acute during the **30-day manual validation phase**, when accounts are being established and any flag can set back monetization progress.

No agent, cron job, loop orchestrator, or scheduled task may substitute for these steps. This is a permanent manual task for the Boss.

---

## First-Hour Checklist

Run this checklist within 30 minutes of each post going live. Aim to complete all three actions within the first hour.

### (a) Seed a First Comment

Post a comment from the same account immediately after publishing. This primes the comment section and signals to the algorithm that the post is generating engagement.

Good first-comment patterns:
- **Add context** the caption couldn't fit: "The part most people miss is step 3 — once you see it you can't unsee it."
- **Close the loop** started by the hook: if the hook opened a question, the comment can partially answer it and invite replies.
- **Pose a question** to the audience: "Which of these angles surprised you most?" or "Have you seen this in your own experience?"

Avoid: generic "What do you think?" with no reference to the content. It reads as filler.

### (b) Reply to Every Comment Immediately

For the first hour, reply to every comment as it comes in. Speed matters — early replies extend the comment thread's activity window and keep the post surfacing in notification feeds.

Reply tactics:
- Acknowledge the specific thing they said (not a generic "Thanks!").
- Ask a follow-up question that invites a second reply — comment chains amplify dwell time.
- If a comment is critical or skeptical, engage it directly. Controversy in comments extends algorithmic reach.

Once the post is more than an hour old, replies can be batched. The first-hour replies are the ones that matter for distribution.

### (c) Engage Larger Niche Accounts

In the 30-60 minutes after posting, spend time engaging (commenting thoughtfully) on posts from larger accounts in the same niche. This surfaces your account in their notification feed and, by extension, in front of their audience.

Rules:
- Comments must be substantive — add a perspective, ask a real question, or extend the point. Generic "Great post!" comments are ignored or flagged as spam.
- Target accounts with 10x–100x your current follower count in the same content niche.
- 3-5 quality comments per session is enough. This is not a volume game.

The mechanism: when the larger account's followers see a thoughtful comment from an unfamiliar account and click through, they land on a fresh, recently-posted piece of content — the post you just published. This is the lowest-cost distribution amplification available in the first hour.

---

## Per-Platform Notes

| Platform | Primary first-hour action | Save/share mechanism |
|----------|--------------------------|---------------------|
| TikTok | Seed comment + reply fast (comment velocity matters) | Viewers save to "Favourites"; share via Duet/Stitch/DM |
| Instagram Reels | Seed comment + engage Stories/Reels from niche accounts | "Save" icon below the post; Share via DM or Stories |
| YouTube Shorts | Seed comment (Shorts have comment sections) | "Save to playlist"; Share button |
| X (Twitter) | Reply to your own post with a thread continuation | Bookmark = save signal; Repost = share signal |

---

## Logging

After completing the first-hour actions, note in the clip's `metrics.json` or a brief log entry:
- Time post went live
- Time first comment seeded
- Number of comments replied to in hour 1
- Number of niche accounts engaged
- Any early saves/shares visible in the platform dashboard

This data is manually importable into `performance_signal` when Module 2 is live.

---

## Related Documents

- [`clip-factory.md`](../workflows/clip-factory.md) — Stage 12 references this playbook
- [`platform-rpm.md`](./platform-rpm.md) — Engagement Signals That Matter section
- [`hook-library.md`](./hook-library.md) — hook categories and the loop principle
