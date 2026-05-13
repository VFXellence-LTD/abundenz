# Polymath Development — Operating Guide

Development governance for code projects under the Polymath system. This is the dev counterpart to the business `CLAUDE.md` at vault root.

---

## Boss

Same as Polymath: Robin Dutta. All approvals, direction, final authority.

---

## Infrastructure

### GitHub

- **Organization**: [VFXellence-LTD](https://github.com/VFXellence-LTD)
- **Remote**: `git@github.com:VFXellence-LTD/<repo>.git`
- **Default branch**: `main`
- **CI/CD**: GitHub Actions

### Task Tracking

- **Platform**: GitHub Issues + GitHub Projects (not Jira, not Asana)
- **Access**: `gh` CLI (already authenticated)
- **Board**: GitHub Projects kanban per repo (Backlog → In Progress → Review → Done)
- **Usage**: Use `gh issue create`, `gh issue list`, `gh project` for all task ops

### Dev Environment

- **Language**: TypeScript + React (frontend), Python (automation/agents)
- **Node**: v22+
- **Package manager**: npm
- **Linting**: ESLint + Prettier (TS), ruff (Python)
- **Testing**: Vitest (TS), pytest (Python)

---

## Git Conventions

=== USE `git -C` INSTEAD OF `cd && git` ===
Same as Canon — Claude Code blocks compound cd+git.

=== NO CO-AUTHORSHIP LINES ===
Robin = author.

### Commit Format

```
descriptive summary of what commit does (imperative mood, under 72 chars)

- specific change 1
- specific change 2
```

### Branch Naming

```
<type>/<description>
```

| Type | When |
|------|------|
| `feature` | New functionality |
| `bugfix` | Bug fixes |
| `refactor` | Code restructuring |
| `docs` | Documentation only |
| `infra` | CI/CD, deployment, config |

No ticket prefix required (Asana tasks linked via PR description, not branch name).

**Examples:**
```
feature/dashboard-earnings-view
bugfix/fix-transaction-import
infra/github-actions-ci
```

### Versioning

Semver. `package.json` version is source of truth.

---

## Development Lifecycle

```
1. TASK       Pick or create Asana task
2. GATHER     Check dev/2_architect/ + dev/5_knowledge/ for context
3. BRANCH     Create feature branch off main
4. DEVELOP    Code in worktree isolation (subagents)
5. TEST       Lint + type check + tests
6. PR         Push + create PR on VFXellence-LTD
7. REVIEW     Boss reviews and approves
8. MERGE      Merge to main
9. DEPLOY     GitHub Actions CI/CD
10. DOCUMENT  Update dev/2_architect/codebase/ if needed
11. CHANGELOG Update dev/4_orchestrator/changelogs/
12. LEARN     Capture gotchas in dev/5_knowledge/learning/
```

---

## Subagent Strategy

Same model routing as Canon:

| Tier | Model | When |
|------|-------|------|
| Hard | `opus` | Architecture, complex debugging, code review |
| Medium | `sonnet` | Feature implementation, refactors, bug fixes |
| Light | `haiku` | Exploration, changelog writes, simple searches |

=== USE WORKTREE ISOLATION FOR ANY AGENT THAT WRITES CODE ===

Worktrees go in `.worktrees/` directory adjacent to repo root.

---

## Coding Standards

### TypeScript / React

- Strict TypeScript (`strict: true` in tsconfig)
- Functional components only (no class components)
- React 18+ with hooks
- Tailwind CSS + shadcn/ui for styling
- Vitest for testing
- ESLint + Prettier for formatting
- No `any` types — use `unknown` and narrow
- Prefer `const` over `let`, never `var`
- Named exports over default exports
- Barrel files (`index.ts`) for public module APIs only

### Python (automation/agents)

- Python 3.9+ target
- ruff for lint + format (E4/E7/E9/F rules)
- Type hints required (use `typing` module for 3.9 compat)
- Google-style docstrings on public functions
- `logging.getLogger(__name__)`, never `print()` in production
- 79-char lines, double quotes, 4-space indent

### General

- Priority: Working > Readable > Scalable > Elegant
- No hidden global state
- No silent failures
- No quadratic operations on user data
- Comments only when WHY is non-obvious

---

## Project Tracking

### dev/4_orchestrator/projects/

Each code project gets a tracker file:

```markdown
# Project: [name]

## Status: [active / paused / complete]
## Repo: VFXellence-LTD/[repo-name]
## Asana: [link to Asana project/task]

## Goal
[What this project delivers]

## Time Log
| Event | Timestamp (UTC) | Notes |
|-------|-----------------|-------|
| Started | YYYY-MM-DD HH:MM | |
| PR Created | | |
| Merged | | |
```

### dev/4_orchestrator/changelogs/

Daily session summaries: `YYYY-MM-DD.md`
Same template as Canon — what happened, decisions made, open questions, next steps.

---

## Testing Strategy

- **Unit tests**: Pure functions, utilities, data transformations
- **Integration tests**: API routes, database operations, MCP tool calls
- **E2E tests**: Critical user workflows in dashboard
- **Smoke tests**: App starts, renders, no console errors

=== ALL TESTS MUST PASS BEFORE PR ===

---

## CI/CD (GitHub Actions)

Each repo gets a `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

---

## Repos

### polymath-dashboard

React + TypeScript tracking portal. See [[2_architect/codebase/dashboard]].
- Earnings tracker, tax center, setup wizard
- SQLite local database (better-sqlite3)
- Tailwind + shadcn/ui
- Recharts for graphs
- No cloud dependency

### polymath-agents

Claude Code skills + automation configs.
- HyperFrames compositions
- Higgsfield CLI wrappers
- Make.com/n8n scenario exports
- Agent prompt libraries

### polymath-infra

Deployment configs.
- GitHub Actions workflows
- VPS setup scripts
- Docker configs (if needed)
- Environment variable templates (no actual secrets)

---

## Differences from Canon

| Aspect | Canon | Polymath Dev |
|--------|-------|-------------|
| Task tracking | Jira (Halon Atlassian) | Asana (personal) |
| GitHub org | Halon-Entertainment | VFXellence-LTD |
| Branch naming | `type/TICKET-ID/description` | `type/description` (no ticket prefix) |
| PR workflow | `/pr` skill → assign Maestro + Hercules | Manual `gh pr create` → Boss reviews |
| Upstream policy | Fork detection, Ynput checks | N/A — all repos are owned |
| Addon versioning | `0.x.y+label` | Standard semver |
| Remote testing | Syncthing to studio machine | Local only |
| Primary language | Python (Maya/DCC tools) | TypeScript (React) + Python (automation) |

=== CANON CONVENTIONS DO NOT APPLY HERE EXCEPT WHERE EXPLICITLY ADOPTED ===
