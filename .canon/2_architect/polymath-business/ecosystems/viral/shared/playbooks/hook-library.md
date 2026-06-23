# Surge — Hook Library

Proven hook templates organized by category. Every Surge clip opens with a hook. No exceptions.

The hook is the first 1-3 seconds. If it doesn't stop the scroll, nothing else matters.

---

## Hook Categories

### Universal (work in any niche)

| Hook | Why it works |
|------|-------------|
| "Nobody mentions this." | Insider knowledge, exclusivity |
| "I wish I knew this earlier." | Regret = urgency, viewer avoids same mistake |
| "Pause for a second." | Pattern interrupt, commands attention |
| "Ever notice this pattern?" | Curiosity + makes viewer feel observant |
| "Here's the real truth." | Implies everything else was wrong |
| "Let me save you hours." | Direct value promise, second person |
| "This may surprise you." | Curiosity gap, low-threat challenge |
| "You need this now." | Urgency + second person + direct command |
| "You may not agree with this." | Controversy, implies bold take |
| "I just figured this out." | Discovery framing, freshness |

### Tech / AI Tools (Zrodinger-specific)

| Hook | Best for |
|------|---------|
| "Stop paying for [X]." | Free alternative videos |
| "This free tool just killed [expensive app]." | Comparison format |
| "Delete [app] right now." | Urgency + controversial command |
| "Why is nobody talking about this?" | Hidden gem discovery |
| "This AI tool feels illegal to use." | Curiosity + forbidden knowledge |
| "$0. That's what this costs." | Price shock |
| "Your [tool] subscription is a waste." | Confrontational, second person |
| "I tested every [category] — here's the winner." | Authority + list format |
| "This replaced my entire workflow." | Transformation proof |
| "You're doing [task] wrong." | Challenge + second person |

### Impossibility

| Hook | Best for |
|------|----------|
| "This is statistically impossible." | Facts, science, history |
| "Nobody can explain how this happened." | Mystery, unexplained events |
| "Scientists still don't understand this." | Science, nature |
| "This shouldn't exist." | Objects, places, phenomena |
| "The math doesn't add up." | Statistics, paradoxes |
| "This breaks every rule of [field]." | Expert-adjacent content |

### Survival / Danger

| Hook | Best for |
|------|----------|
| "This [person] survived something that should have killed them [N] times." | Survival stories |
| "They had a 0.01% chance of survival." | Near-death experiences |
| "Everyone on board should have died." | Disasters, accidents |
| "The rescue team had already given up." | Rescue stories |
| "They were told they had [time] to live." | Medical survival |

### Revelation / Twist

| Hook | Best for |
|------|----------|
| "This story sounds fake but isn't." | True stories, bizarre facts |
| "History accidentally created [superlative]." | Historical events |
| "No one noticed for [time period]." | Hidden truth, cover-ups |
| "This changes everything you thought about [topic]." | Counterintuitive facts |
| "The truth is worse than the conspiracy theory." | Revealing stories |
| "They found something that wasn't supposed to be there." | Discovery, archaeology |

### Escalation

| Hook | Best for |
|------|----------|
| "And then it got worse." | Multi-stage stories |
| "But that wasn't even the craziest part." | Escalating narratives |
| "What happened next made [authority] call an emergency meeting." | Institutional response |
| "Nobody was prepared for what came next." | Plot twists |

### Challenge / Controversy

| Hook | Best for |
|------|----------|
| "You've been lied to about [topic]." | Myth-busting |
| "Everything you know about [topic] is wrong." | Counterintuitive facts |
| "[Number]% of people get this wrong." | Quizzes, common misconceptions |
| "This is the most [adjective] thing I've ever seen." | Reaction content |

### Numbers / Scale

| Hook | Best for |
|------|----------|
| "This cost $[huge number]." | Expensive things, projects |
| "[Person] made $[number] in [short time]." | Success stories (use with financial disclaimers) |
| "There are only [small number] of these in the world." | Rarity, exclusivity |
| "This took [huge number] [units] to build." | Engineering, construction |

---

## Hook Construction Rules

**The Loop Principle:** Open a loop — don't describe the topic. The opening is the gate (≈2 seconds on short-form, first line on text). A loop the brain must close buys the watch-time the algorithm rewards. Describing what the video is about closes the loop before it opens. Posing an unanswered question or incomplete statement forces the brain to stay to resolve it.

> Bad: "Today I'm going to explain quantum entanglement."
> Good: "Everyone describing quantum entanglement is accidentally lying to you."

The categories in this library are the source for `hook_tag` values used by the Module 2 `performance_signal` table in the feedback loop. When logging a post's performance, set `hook_tag` to the category name that best matches the hook used (e.g. `impossibility`, `survival`, `revelation`, `escalation`, `challenge`, `numbers`, `universal`, `tech_ai`). The StrategyAdjuster weights future drafts toward the categories that correlate with the strongest saves and shares.

1. **Specificity beats vagueness.** "This man survived 14 assassination attempts" > "This man survived a lot."
2. **Numbers create credibility.** Include a number when possible.
3. **Tension creates curiosity.** The hook should create an unanswered question.
4. **Short sentences.** Under 15 words. Under 10 is better.
5. **No preamble.** Start with the hook. No "Hey guys," no "So today."
6. **Visual + verbal alignment.** The first frame should reinforce the hook, not contradict it.

---

## Anti-Patterns (Hooks That Fail)

| Anti-pattern | Why it fails |
|-------------|-------------|
| "Hey guys, welcome back" | Zero information. Viewer swipes immediately. |
| "So today I wanted to talk about..." | Preamble. Get to the point. |
| "In this video, you'll learn..." | Generic. Doesn't create curiosity. |
| Vague superlatives without specifics | "The most amazing thing" — what thing? |
| Questions that are easy to answer | "Did you know water is wet?" — yes, swipe. |
| Hooks that the content can't deliver on | Clickbait without payoff destroys retention. |

---

## Testing Hooks

For each clip, generate 3-5 hook variants. A/B test by:
1. Posting the same content with different hooks on different accounts
2. Compare 3-second retention rates
3. Feed winning patterns back into this library

---

## Vertical-Specific Hooks

Each vertical should maintain its own hook document extending this library. Vertical hooks inherit these rules but add genre-specific patterns.

Document location: `verticals/{vertical}/hooks.md`
