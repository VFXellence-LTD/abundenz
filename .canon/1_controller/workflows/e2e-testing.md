---
layer: universal
name: e2e-testing
description: End-to-end test gate — lint, type-check, unit, build sequence. Must pass before PR. Generic; no AYON/create_package.py specifics.
---

# End-to-End Testing

Every feature must pass E2E before PR. Full strategy in [[1_controller/standards/testing-strategy]].

## Test Sequence (Generic)

```
1. LINT        Run linter (ruff / eslint) — zero violations
2. TYPE        Run type checker (mypy / tsc) — zero errors
3. UNIT        pytest / vitest — all pass
4. BUILD       Build artifact (pnpm build / python -m build) — succeeds without error
5. GOLDEN      Compare outputs against expected fixtures (if applicable)
6. SMOKE       Run tool's CLI / entry point with test args
```

## Python Projects

```bash
ruff check . && ruff format --check .
mypy src/
pytest tests/ -x
python -m build  # or equivalent
```

## TypeScript / Node Projects

```bash
pnpm lint         # eslint
pnpm build        # tsc + vite or equivalent
pnpm test         # vitest
```

## Pre-PR Gate

=== ALL TESTS MUST PASS BEFORE CREATING PR ===

- Linter: zero violations
- Type checker: zero errors
- All existing tests pass
- Build succeeds

Any gate fails → fix before PR.

## Subagent Testing Pattern

Spawn test agent in worktree to validate without blocking main work:

```python
Agent(
    description="Run E2E tests for feature X",
    prompt="""
        Run full E2E test sequence in D:/VFXellence-LTD/polymath:
        1. pnpm lint
        2. pnpm build
        3. pnpm test (if tests exist)
        Report pass/fail for each step.
    """,
    isolation="worktree"
)
```

## Local vs Remote

**Local (Claude verifies):** lint, type checks, unit tests, build scripts.
**Boss handles:** full integration with external APIs, UI/UX review, end-to-end platform workflows.

## Related

- [[1_controller/standards/testing-strategy]] — full testing philosophy
- [[1_controller/workflows/development-lifecycle]] — where testing fits
- [[1_controller/workflows/worktrees]] — worktree isolation for test agents
