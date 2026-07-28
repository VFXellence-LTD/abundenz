# GitHub PM Playbook — Claude Code Reference

**Layer:** vfxellence
**Repo:** `VFXellence-LTD/abundenz` (PRIVATE)
**Project:** "VFXellence Dev" — org Project v2, number 2, owner `VFXellence-LTD`
**Board:** https://github.com/orgs/VFXellence-LTD/projects/2
**Authority:** `D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\plans\github-pm-and-mvp-rollout-2026-06-17.md` §4.2

---

## Dry-Run Discipline

=== DRY-RUN BY DEFAULT — NEVER MUTATE GITHUB STATE WITHOUT BOSS CONFIRMATION ===

Carried over from the publish/render layers: when in doubt, print the `gh` command that WOULD run and ask Boss to confirm. Only execute write operations (`issue create`, `project item-add`, `project item-edit`, sub-issue linking) after explicit approval — or when operating inside a well-scoped, Boss-approved execution phase.

---

## Label Scheme

| Group | Labels |
|-------|--------|
| `type/` | `type/epic`, `type/task`, `type/bug`, `type/chore`, `type/infra`, `type/docs` |
| `priority/` | `priority/critical`, `priority/high`, `priority/medium`, `priority/low` |
| `area/` | `area/mission-control`, `area/server`, `area/dashboard-client`, `area/polymath-engine`, `area/governance`, `area/automation` |
| status | `blocked` |

---

## Project v2 Custom Fields

| Field | Type | Option values |
|-------|------|---------------|
| Status | single-select | Backlog, Todo, In Progress, In Review, Done |
| Priority | single-select | Critical, High, Medium, Low |
| Area | single-select | mission-control, server, dashboard-client, polymath-engine, governance, automation |

**Field IDs (captured 2026-06-17):**
- Status: `PVTSSF_lADOEOe9Dc4Ba6_yzhVvH2Q` — options: Backlog=`216817d8`, Todo=`59343333`, In Progress=`5282892a`, In Review=`11b7dc8b`, Done=`fc556a1d`
- Priority: `PVTSSF_lADOEOe9Dc4Ba6_yzhVvIUs` — options: Critical=`747611df`, High=`7e918131`, Medium=`6aaded3b`, Low=`e3f47fbc`
- Area: `PVTSSF_lADOEOe9Dc4Ba6_yzhVvIaE` — options: mission-control=`3378c68c`, server=`d378743c`, dashboard-client=`168066d3`, polymath-engine=`14808ed7`, governance=`129a8f59`, automation=`c74e10b5`

> If field IDs appear stale, refresh with: `gh project field-list 2 --owner VFXellence-LTD --format json`

---

## PAT Requirement (Gotcha)

=== DEFAULT `GITHUB_TOKEN` CANNOT WRITE ORG PROJECTS V2 — ACTIONS NEED `PROJECT_PAT` ===

The default `GITHUB_TOKEN` in GitHub Actions lacks org-level project write permission. Both `add-to-project.yml` and `auto-status.yml` must authenticate with a **fine-grained PAT** stored as repo secret **`PROJECT_PAT`** with project write permission. This is a Boss-run setup step — Claude cannot create PATs or set secrets.

For local `gh` CLI use: run `gh auth refresh -s project` to add the `project` scope to the active token.

---

## Creating an Epic

```bash
gh issue create \
  --repo VFXellence-LTD/abundenz \
  --title "Epic: <title>" \
  --label "type/epic,area/<area>,priority/<priority>" \
  --body "$(cat <<'EOF'
## Summary
<one-paragraph rationale>

## .canon spec
<absolute path to the authoritative plan doc, e.g. D:\VFXellence-LTD\.canon\4_orchestrator\projects\polymath-business\plans\github-pm-and-mvp-rollout-2026-06-17.md>

## Planned sub-issues
- [ ] <sub-issue 1 description>
- [ ] <sub-issue 2 description>
- [ ] <sub-issue 3 description>
EOF
)"
```

Then add to project and set fields (see "Setting Project v2 Fields" below).

---

## Decomposing into Sub-Issues

Each sub-issue is atomic — one independently mergeable unit of work. Create with `gh issue create` using `type/task` (or `type/bug`/`type/chore`/`type/infra`), the same `area/` label as the parent epic, and an appropriate `priority/` label.

### CRITICAL GOTCHA — `addSubIssue` requires a special header

=== ALWAYS INCLUDE `-H "GraphQL-Features: sub_issues"` — WITHOUT IT THE MUTATION SILENTLY ERRORS ===

The `addSubIssue` GraphQL mutation is feature-flagged. Omitting the header causes a silent failure with no error message — the link is simply not created. This was verified during Phase A scaffold (2026-06-17).

**Working invocation:**

```bash
# Step 1: get node IDs
PARENT_ID=$(gh issue view <PARENT_NUM> --repo VFXellence-LTD/abundenz --json id -q .id)
CHILD_ID=$(gh issue view <CHILD_NUM> --repo VFXellence-LTD/abundenz --json id -q .id)

# Step 2: link as native sub-issue
gh api graphql \
  -H "GraphQL-Features: sub_issues" \
  -f query='mutation($parent:ID!,$child:ID!){addSubIssue(input:{issueId:$parent,subIssueId:$child}){issue{number}}}' \
  -f parent="$PARENT_ID" \
  -f child="$CHILD_ID"
```

---

## Setting Project v2 Fields via `gh`

### Step 1 — Add issue to project, capture item node ID

```bash
ITEM_ID=$(gh project item-add 2 \
  --owner VFXellence-LTD \
  --url "https://github.com/VFXellence-LTD/abundenz/issues/<NNN>" \
  --format json | jq -r '.id')
```

### Step 2 — Set Status, Priority, Area

```bash
PROJECT_ID=$(gh project list --owner VFXellence-LTD --format json | jq -r '.projects[] | select(.number==2) | .id')

# Set Status = Backlog
gh api graphql -f query='
  mutation($proj:ID!,$item:ID!,$field:ID!,$opt:String!){
    updateProjectV2ItemFieldValue(input:{projectId:$proj,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$opt}}){projectV2Item{id}}
  }' \
  -f proj="$PROJECT_ID" -f item="$ITEM_ID" \
  -f field="PVTSSF_lADOEOe9Dc4Ba6_yzhVvH2Q" -f opt="216817d8"

# Set Priority = High
gh api graphql -f query='
  mutation($proj:ID!,$item:ID!,$field:ID!,$opt:String!){
    updateProjectV2ItemFieldValue(input:{projectId:$proj,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$opt}}){projectV2Item{id}}
  }' \
  -f proj="$PROJECT_ID" -f item="$ITEM_ID" \
  -f field="PVTSSF_lADOEOe9Dc4Ba6_yzhVvIUs" -f opt="7e918131"

# Set Area = server
gh api graphql -f query='
  mutation($proj:ID!,$item:ID!,$field:ID!,$opt:String!){
    updateProjectV2ItemFieldValue(input:{projectId:$proj,itemId:$item,fieldId:$field,value:{singleSelectOptionId:$opt}}){projectV2Item{id}}
  }' \
  -f proj="$PROJECT_ID" -f item="$ITEM_ID" \
  -f field="PVTSSF_lADOEOe9Dc4Ba6_yzhVvIaE" -f opt="d378743c"
```

> **Gotcha:** `updateProjectV2Field` singleSelectOptions must be inlined in the GraphQL query body — do not pass them via `--field`/`-f` as a JSON array; the flag coerces to string and fails type validation.

---

## Branch Naming

Dev branches use GitHub issue numbers — no more `VFX-NNN`:

```
<type>/<issue-number>-<short-description>

Examples:
  feat/123-add-hyperframes
  fix/45-brand-registration
  chore/12-orphan-worktree-cleanup
  infra/14-update-claude-routing-tables
```

Types: `feat`, `fix`, `chore`, `infra`, `docs`, `refactor`

=== ALWAYS FETCH BEFORE CREATING A BRANCH ===
=== NO DEV BRANCHES WITHOUT A GITHUB ISSUE ===

---

## Referencing Issues in Commits

Include `#NNN` in the commit body (not the subject line) to create a GitHub cross-reference:

```
Add HyperFrames dry-run gate to AssemblyAdapter

- Wire HYPERFRAMES_BIN env check; absent → dry-run, never fail-hard
- Add vitest tests for dry-run path

Refs #8
```

---

## Auto-Closing via PRs

Add `Closes #NNN` in the PR description body. GitHub auto-closes the issue when the PR merges to the default branch:

```markdown
## Summary
Wires real HyperFrames CLI into AssemblyAdapter behind env gate.

Closes #8
```

Multiple issues: `Closes #8, Closes #10`

---

## Gotchas Reference (Phase A verified, 2026-06-17)

| Gotcha | Detail |
|--------|--------|
| `addSubIssue` silent failure | Requires `-H "GraphQL-Features: sub_issues"` — omit and the mutation is silently unrecognised |
| `gh project create` no output | Returns nothing on success — confirm with `gh project list` |
| `updateProjectV2Field` JSON array | Must inline singleSelectOptions in the query body; `--field` coercion breaks type validation |
| `gh project item-add --format json` | Returns item node ID directly as `.id` — parseable with `jq -r '.id'` |
| Status field defaults replaced entirely | `updateProjectV2Field` replaces all options atomically — provide all 5 desired options in one mutation |
| Node ID prefixes | Projects: `PVT_`; items: `PVTI_`; single-select fields: `PVTSSF_`; text fields: `PVTF_` |
| Default `GITHUB_TOKEN` | Cannot write org Projects v2 — Actions workflows must use `PROJECT_PAT` secret |

---

## Stale Routing Tables (was INFRA-003 / GitHub #14)

The following CLAUDE.md files still reference the old `polymath/vault/*` + `apps/dashboard` layout and need updating to the current `.canon` + `.mission-control` layout. This work is tracked as **GitHub issue #14** ("Update stale CLAUDE.md routing tables", `type/infra`, `area/governance`):

- `D:\VFXellence-LTD\.claude\CLAUDE.md` — Domain Routing table still points to `polymath/vault/` and `apps/dashboard`
- `D:\dev\.claude\CLAUDE.md` — same stale routing entries in the VFXellence row

These are docs-only edits (no code), appropriate for a Light-tier subagent. Resolve as part of the governance phase and close #14 when done.

---

## Quick-Reference Checklist

When filing a new epic + sub-issues:

1. `gh issue create` — epic with `type/epic` + area + priority labels; body lists sub-issues + `.canon` spec link
2. `gh project item-add` — add epic to "VFXellence Dev" project; capture `ITEM_ID`
3. Set Status / Priority / Area via `updateProjectV2ItemFieldValue` GraphQL
4. `gh issue create` × N — one sub-issue per atomic unit; same area label
5. `gh project item-add` × N + set fields for each sub-issue
6. `gh api graphql -H "GraphQL-Features: sub_issues"` × N — link each sub-issue to epic
7. Verify hierarchy visible in project board
