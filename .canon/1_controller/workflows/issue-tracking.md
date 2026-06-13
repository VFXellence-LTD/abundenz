---
layer: vfxellence
name: issue-tracking
description: File-based issue tracker — replaces Jira for VFXellence domain. VFX-NNN ID scheme, status folders, time logging.
---

# Issue Tracking (File-Based)

VFXellence has no Jira. Issues are markdown files in `4_orchestrator/projects/`. This document defines the system.

=== ALL ISSUE TRACKING HAPPENS IN 4_orchestrator/projects/ ===
=== NO JIRA, NO ATLASSIAN, NO EXTERNAL TRACKERS ===

## ID Scheme

Format: `VFX-NNN` (zero-padded three digits).

Examples: `VFX-001`, `VFX-042`, `VFX-100`.

**Per-app prefixes** may be introduced later if the Zappz marketplace scales:
- `ZAPPZ-NNN` for marketplace-level issues
- `AMJ-NNN` for the AMJ (A Musical Journey) app
- `ABND-NNN` for abundenz-site

Boss decides when per-prefix tracking is warranted.

## Status Folders

```
4_orchestrator/projects/
├── backlog/       ← known, not yet scheduled
├── todo/          ← scheduled for current sprint/session
├── in-progress/   ← actively being worked
├── blocked/       ← waiting on dependency or decision
├── in-review/     ← PR open, awaiting Boss review
└── done/          ← merged and closed
```

## Lifecycle Flow

```
backlog → todo → in-progress → [blocked →] in-review → done
```

Moving an issue = moving the markdown file to the new status folder. Rename is optional. Keep the same filename.

## Issue File Naming

`VFX-NNN-short-description.md`

Examples:
- `VFX-001-canon-vault-port.md`
- `VFX-042-amj-analysis-engine-mvp.md`

## Issue Template

See `4_orchestrator/projects/_template.md` for the canonical template.

Key frontmatter fields:
- `id`: VFX-NNN
- `title`: Human-readable title
- `status`: backlog | todo | in-progress | blocked | in-review | done
- `created`: YYYY-MM-DD
- `project`: which project (polymath, abundenz-site, zappz, etc.)
- `priority`: low | medium | high | critical
- `depends_on`: list of VFX-NNN or external dependencies
- `time_log`: session timestamps (see below)

## Time Logging

Record session timestamps in the issue file's `time_log` section. No external worklogs.

```markdown
## Time Log

| Timestamp (UTC) | Event |
|-----------------|-------|
| 2026-06-05 14:00 | Started |
| 2026-06-05 17:30 | PR created |
| 2026-06-06 09:15 | PR approved |
| 2026-06-06 09:20 | Completed |
```

Calculate elapsed time from these timestamps when summarizing session duration.

## Index

`4_orchestrator/projects/README.md` maintains a running index of open issues. Update it when creating or closing issues.

## Replacing Jira Concepts

| Jira concept | VFXellence equivalent |
|---|---|
| Ticket | Issue file (VFX-NNN) |
| Status transition | Move file to new status folder |
| Time logging | Time Log section in issue file |
| Sprint | `todo/` folder (curated manually) |
| Backlog | `backlog/` folder |
| Epic | Optional: frontmatter `epic` field grouping VFX-NNN issues |
| Comment | Notes section in issue body |

## Related

- [[1_controller/workflows/development-lifecycle]] — where tracking fits in the workflow
- [[1_controller/workflows/subagent-strategy]] — project tracker per task
- [[4_orchestrator/projects/_template]] — the issue template
