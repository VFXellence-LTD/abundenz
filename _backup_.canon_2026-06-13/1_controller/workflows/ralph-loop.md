---
layer: universal
name: ralph-loop
description: Ralph Wiggum iterative dev technique — Claude works, exits, re-enters seeing own previous work. For complex refactors, quality polishing, bug hunting, codebase exploration.
---

# Ralph Loop (Iterative Self-Referential Development)

`/ralph-loop` runs iterative dev cycles — Claude works on task, exits, immediately fed the same prompt again seeing its own previous work in files and git history. Each iteration builds on the last.

## When to Use

- **Complex features** — break down, iterate toward working result
- **Quality polishing** — iteratively improve code quality, test coverage, docs
- **Bug hunting** — each pass digs deeper into root causes
- **Codebase exploration** — each iteration builds understanding in `2_architect/`
- **Test hardening** — progressively add cases until all edges covered

## .canon Integration

1. **Before loop**: Create/update issue file in `4_orchestrator/projects/in-progress/`
2. **Each iteration**: Claude reads previous work, .canon standards, iterates
3. **Progress tracking**: Each iteration appends to changelog
4. **Knowledge capture**: Discoveries go to `5_knowledge/learning/`
5. **Completion**: Final iteration writes summary changelog entry

## Worktree Pattern (Recommended)

```bash
git -C D:/VFXellence-LTD/polymath fetch origin
git -C D:/VFXellence-LTD/polymath worktree add \
  -b feature/VFX-042/amj-csv-parser .worktrees/ralph-session origin/develop

/ralph-loop Implement AMJ CSV parser following VFXellence standards. \
  Run E2E tests each iteration. Commit working increments. \
  --completion-promise 'All tests pass, CSV → taste profile output correct' \
  --max-iterations 8
```

## Patterns

**Feature Build:**
```
/ralph-loop Build <feature> in polymath/apps/amj. \
  Follow 1_controller/standards/typescript-engineering.md. \
  Each iteration: implement, test, fix. Commit working increments. \
  --completion-promise 'Feature complete, all tests pass' \
  --max-iterations 8
```

**Quality Hardening:**
```
/ralph-loop Review and harden <module>. \
  Check against 1_controller/standards/no-go-rules.md. \
  Add missing tests per testing-strategy.md. Fix violations. \
  --completion-promise 'Zero violations, test coverage complete' \
  --max-iterations 5
```

**Codebase Documentation:**
```
/ralph-loop Document <project> architecture in 2_architect/. \
  Each iteration: explore deeper, add cross-links, verify against source. \
  --completion-promise 'All major modules documented' \
  --max-iterations 6
```

## Rules

=== ALWAYS SET MAX-ITERATIONS ON RALPH LOOPS ===
Recommended: 5–10. Prevents infinite loops.

=== ALWAYS SET COMPLETION-PROMISE WITH VERIFIABLE CONDITION ===
=== NEVER LIE ABOUT COMPLETION PROMISE ===

- Commit working increments each iteration
- Use [[1_controller/workflows/worktrees]] for Ralph loops
- Cancel: `/cancel-ralph`

## Related

- [[1_controller/workflows/worktrees]] — isolation for loop iterations
- [[1_controller/workflows/e2e-testing]] — test each iteration
- [[1_controller/workflows/development-lifecycle]] — where loops fit
