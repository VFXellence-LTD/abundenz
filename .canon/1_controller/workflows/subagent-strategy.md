---
layer: universal
name: subagent-strategy
description: VFXellence subagent dispatch — mandatory workflow for features/refactors, model routing, knowledge gathering, task tracking, parallel patterns.
---

# Subagent Strategy

Subagent basics (orchestrator principle, model routing) in `D:/dev/.claude/CLAUDE.md`. This doc covers VFXellence-specific workflows.

## Mandatory Workflow

```
1. GATHER     Pull knowledge from 2_architect/ and 5_knowledge/
2. TRACK      Create/update issue file in 4_orchestrator/projects/in-progress/
3. SPAWN      Launch subagent(s) in worktree isolation
4. MONITOR    Collect results, update issue tracker
5. PR         Generate PR for Boss review
6. WAIT       Do not merge — Boss reviews and approves
```

## Use Cases

| Task | Agent Type | Model | Isolation |
|------|-----------|-------|-----------|
| Feature implementation | `general-purpose` | `sonnet` | `worktree` (mandatory) |
| Refactor | `general-purpose` | `sonnet` | `worktree` (mandatory) |
| Bug fix (multi-file) | `general-purpose` | `sonnet` | `worktree` (mandatory) |
| Bug fix (trivial) | — | — | inline (optional) |
| Codebase exploration | `Explore` | `haiku` | none |
| E2E test runs | `general-purpose` | `haiku` | `worktree` (recommended) |
| Code review | `superpowers:code-reviewer` | `opus` | none |
| Architecture planning | `Plan` | `opus` | none |
| Doc generation | `general-purpose` | `sonnet` | none |
| Changelog / tracker update | `general-purpose` | `haiku` | none |

## Knowledge Gathering

=== ALWAYS GATHER CODEBASE KNOWLEDGE BEFORE SPAWNING CODE AGENTS ===

Before dispatching a code-writing subagent:

1. Check `2_architect/` for system design and pattern docs
2. Check `5_knowledge/learning/` for lessons and gotchas
3. Read applicable standards from `1_controller/standards/`
4. Check the relevant project's CLAUDE.md for project-specific rules
5. Include gathered context in the subagent prompt

## Task Tracking

=== EVERY CODE TASK GETS AN ISSUE TRACKER FILE ===
=== RECORD TIMESTAMPS IN THE ISSUE FILE TIME LOG ===

Use template at [[4_orchestrator/projects/_template]]. Issues live in status folders per [[1_controller/workflows/issue-tracking]].

Time Log timestamps (UTC): Started, PR Created, PR Approved, Completed.

## Parallel Patterns

```python
# Develop + explore in parallel
Agent(description="Implement feature", isolation="worktree", ...)
Agent(description="Explore related modules", subagent_type="Explore", ...)

# Multi-project changes
Agent(description="Update polymath/apps/amj backend", isolation="worktree", ...)
Agent(description="Update polymath/packages/types", isolation="worktree", ...)
```

## Rules

=== USE WORKTREE ISOLATION FOR ANY AGENT THAT WRITES CODE ===
=== ALWAYS BRIEF SUBAGENTS WITH VFXellence STANDARDS ===
=== NEVER SPAWN REDUNDANT AGENTS ===
=== COLLECT ALL RESULTS BEFORE PROCEEDING TO PR ===
=== REPORT RESULTS TO BOSS ===

## Related

- [[1_controller/workflows/worktrees]] — worktree isolation details
- [[1_controller/workflows/development-lifecycle]] — where subagents fit
- [[1_controller/workflows/e2e-testing]] — subagent testing pattern
- [[1_controller/workflows/issue-tracking]] — task tracking system
