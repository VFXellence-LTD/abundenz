# VFXellence-LTD — restore guide

Clean backup of `D:\VFXellence-LTD`, taken 2026-08-11 before the D: reformat.
**5,832 files, 42.2 MB.**

Restore is a plain copy — put this directory back at `D:\VFXellence-LTD` (or
anywhere; nothing inside depends on the drive letter any more). Then follow
"Regenerate" and "Recreate worktrees" below.

Every git repo here was verified to resolve entirely on `C:` with a complete
object graph: `fsck` reports no missing, broken or corrupt objects, and all
branches walk to their roots (`develop` 176 commits, `main` 4,
`feat/21-entity-db-rewire` 163).

---

## What this backup is for

The git content is already safe on GitHub — every repo had **0 unpushed commits
and 0 stashes**. The real value here is everything git would *never* give back:
gitignored config, live databases, untracked source, and local-only backups.

### Files that exist nowhere else

| File | Why it matters |
|------|----------------|
| `.canon/.mission-control/server/.data/mission-control.db` | Live Mission Control database |
| `…/mission-control.db-wal` | **3.4 MB write-ahead log, dated a month after the `.db`** |
| `…/mission-control.db-shm` | shared-memory index |
| `.canon/.mission-control/client/.env.local` | local environment config |
| `.claude/settings.local.json` | local Claude settings |
| `.claude/CLAUDE.md` | VFXellence domain governance |
| `video-use/.env` | environment config |
| `.canon/.obsidian/workspace.json`, `polymath/vault/.obsidian/workspace.json` | Obsidian layouts |
| `.canon/3_notes/session-handoff-2026-06-23-1409.md` | untracked, never committed |
| `.canon/3_notes/session-handoff-2026-06-30-2034.md` | untracked, never committed |
| `archive/polymath-dashboard/` (66 files) | see the warning below |
| `_personal/` (52 files) | not in any repo |
| `_backup_polymath_repo_2026-06-13.git/` | bare-repo backup, not on GitHub |
| `_backup_.canon_2026-06-13/`, `_backup_abundenz-site_2026-06-13/`, `_backup_bin_2026-06-13/` | local snapshots |

> **The three `mission-control.db*` files must be restored together.** The `-wal`
> is 3.4 MB and dated 2026-07-28 while the `.db` is 2026-06-17 — restoring the
> `.db` alone silently discards a month of writes.

---

## Repos and remotes

| Path | Remote | HEAD |
|------|--------|------|
| `.` (root) | `git@github.com:VFXellence-LTD/abundenz.git` | `develop` @ `b0ee7eb` |
| `abundenz-site` | `git@github.com:zrodinger/abundenz-site.git` | `main` @ `76f457e` |
| `ai-utils` | `https://github.com/rowbain/ai-utils.git` | `main` @ `7825d55` |
| `video-use` | `https://github.com/browser-use/video-use` | `main` @ `cf12ac3` |
| `archive/polymath-dashboard` | `git@github.com:VFXellence-LTD/polymath-dashboard.git` | **no commits — see below** |

Branches on the root repo: `develop` (`b0ee7eb`), `main` (`a83f0e7`),
`feat/21-entity-db-rewire` (`61380bd`). `origin` additionally holds
`feat/18-brand-wizard-2a` (`78b978a`) and `-2b` (`86d4cec`).

### Two traps

**`video-use` is a gitlink with no `.gitmodules`.** The root repo records it at
mode `160000`, commit `cf12ac35143caa48db76efa35b1cb439582333bb`, but there is
no submodule config — so `git clone` of the parent leaves `video-use/` **empty**
and `git submodule update` does nothing. Its full checkout is preserved here.
If you ever rebuild it from scratch:

```bash
git clone https://github.com/browser-use/video-use video-use
git -C video-use checkout cf12ac35143caa48db76efa35b1cb439582333bb
```

**`archive/polymath-dashboard` has an unborn HEAD** — the local repo has a
remote configured but *no commits at all*, and all 66 source files are
untracked. Nothing there is recoverable from the local repo. Whether the remote
has content was not verified (no network access during the backup), so treat
these files as the only copy until you confirm otherwise.

---

## Recreate worktrees

The three checkouts under `.claude/worktrees/` were **deliberately excluded** —
each was verified byte-identical to its origin branch, with a
`settings.local.json` identical to the root one. 2,978 files and 36 MB of pure
duplication, zero unique content. The stale registration was pruned; the
branches are untouched.

```bash
git worktree add ".claude/worktrees/feat+21-entity-db-rewire" feat/21-entity-db-rewire
cp .claude/settings.local.json ".claude/worktrees/feat+21-entity-db-rewire/.claude/"
```

`feat+18-brand-wizard-2a` / `-2b` were already deregistered before this backup.
Recreate only if needed, from `origin/feat/18-brand-wizard-2a` / `-2b`.

---

## Regenerate the excluded bulk

Dropped everywhere: `node_modules`, `.venv`, `venv`, `__pycache__`, `.next`,
`dist`, `build`, `.turbo`, `.cache`, `.ruff_cache`, `.pytest_cache`. No tracked
file lived under any of them — verified before exclusion.

| Location | Command |
|----------|---------|
| `.canon/.mission-control` and `/client` | `pnpm install` |
| `polymath` | `pnpm install` |
| `abundenz-site` | `npm ci` |
| `archive/polymath-dashboard` | `npm ci` |
| `video-use` | `uv sync` |

`video-use/.venv` alone was 346 MB of the 1.9 GB original.

---

## Size reconciliation

| | Files | Size |
|---|---:|---:|
| `D:\VFXellence-LTD` as found | 156,768 | 1,906 MB |
| minus regenerable bulk | 8,810 | 78 MB |
| minus duplicate worktrees | **5,832** | **42 MB** |
