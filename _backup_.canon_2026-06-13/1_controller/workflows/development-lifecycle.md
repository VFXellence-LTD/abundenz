---
layer: universal
name: development-lifecycle
description: Full VFXellence ticket-to-merge lifecycle. File-based issue tracking replaces Jira. Boss supervises; .canon orchestrates; subagents execute.
---

# Development Lifecycle

Full .canon-governed workflow from issue to merged code. Boss supervises; subagents execute.

=== NO JIRA — USE FILE-BASED TRACKER IN 4_orchestrator/projects/ ===

See [[1_controller/workflows/issue-tracking]] for the tracker workflow.

## Phases

```
 1. UNDERSTAND  Read the issue file in 4_orchestrator/projects/
 2. GATHER      Scan 5_knowledge/, 2_architect/, standards for context
 3. TRACK       Update issue status to in-progress; add session timestamp to Time Log
 4. CHANGELOG   Create/append 4_orchestrator/changelogs/YYYY-MM-DD.md
    PRESENT     Summarize approach + ask Boss to confirm before branching
    ─── BOSS GATE: confirm approach before proceeding ───
 5. BRANCH      Fetch origin, create WORKTREE off origin/develop (or main)
                  See [[1_controller/workflows/worktrees]]
 6. DEVELOP     All code work in worktree — orchestrator or subagent
                  See [[1_controller/workflows/subagent-strategy]]
                  Optionally use [[1_controller/workflows/ralph-loop]] for complex work
                  On resume after >1 day idle: sync base branch before new commits
 7. SYNC        Merge origin/develop before testing
 8. TEST        Run lint → unit → integration sequence per [[1_controller/workflows/e2e-testing]]
 9. BUILD       Build artifact if applicable (pnpm build, python package, etc.)
10. ITERATE     Fix failures, re-test. Write lessons to 5_knowledge/learning/ as they arise.
                  Update changelog incrementally.
11. REPORT      Update issue tracker. Summarize results for Boss.
12. SYNC        Mandatory final merge of origin/develop — re-run TEST if new commits
13. PR          Push branch, open PR. See [[1_controller/workflows/security-sweep]] first.
14. REVIEW      Boss reviews — do not merge without approval
15. DOCUMENT    Update 2_architect/ docs if new areas explored
16. CHANGELOG   Finalize changelog with outcomes and next steps
17. LEARN       Final sweep — capture remaining gotchas in 5_knowledge/learning/
18. COMPRESS    /caveman:compress AI-facing docs
19. CLOSE       Move issue file to 4_orchestrator/projects/done/
20. CLEANUP     Remove worktree after Boss merges
```

## Key Gates

| Gate | Blocker | Resolution |
|------|---------|------------|
| After PRESENT | Boss confirmation | Wait for approach approval |
| Before PR | All tests pass | Fix failures first |
| Before PR | Branch current with base | Merge origin/develop |
| Before merge | Boss review | PR stays open until approved |

## State Flow

```
issue (backlog) → in-progress → in-review → done
worktree → develop → PR → [Boss approves] → merge → worktree cleanup
```

## Related

- [[1_controller/workflows/issue-tracking]] — file-based tracker details
- [[1_controller/workflows/git-conventions]] — branch naming
- [[1_controller/workflows/worktrees]] — isolation rules
- [[1_controller/workflows/e2e-testing]] — test gate details
- [[1_controller/workflows/subagent-strategy]] — subagent dispatch
