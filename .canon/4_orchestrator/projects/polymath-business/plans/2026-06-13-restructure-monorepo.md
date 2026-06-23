# Monorepo Restructure Implementation Plan (Plan 0 of 5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, with Boss checkpoints) to implement this plan task-by-task. This is an OPS/MIGRATION runbook, not TDD — "verify" steps replace "failing test" steps. Steps use checkbox (`- [ ]`) syntax. **Do NOT use git worktrees for this plan — it manipulates `.git` itself.**

**Goal:** Re-root the project as a single git monorepo at `D:\VFXellence-LTD\`, populate the existing `.canon` governance vault, merge polymath's business `vault/` + `vault/dev/` into `.canon`'s five paradigms, and move the dashboard into `.canon/.mission-control` — with full git history preserved, `_personal/` + `archive/` excluded from version control, and the dashboard still booting on `localhost:5174`.

**Architecture:** Today only `D:\VFXellence-LTD\polymath` is a git repo; `.canon` is untracked stamped files beside it. We move `.git` up one level so the single repo root becomes `D:\VFXellence-LTD\`, then perform all moves as in-repo `git mv` (history preserved via rename detection). End state mirrors Halon: `.canon` (governance + `.mission-control`) beside `polymath` (dev streams).

**Tech Stack:** git, PowerShell (Windows), pnpm, Vite 8, Node.

**Model/effort routing:** mechanical moves → haiku/low; content reconciliation → sonnet/medium; the re-root surgery (Task 2) → opus/high. Annotated per task.

**Hard gates (Boss must be present / confirm):** Task 0 (pre-flight sign-off), **Task 2 (git re-root)**, Task 10 (vault husk deletion). **Backup-first:** Task 0 pushes the current pre-restructure state to the (private) origin + makes a local mirror clone + filesystem-copies the untracked folders, so current functionality is fully recoverable before any surgery. The re-root's baseline commit (Task 2 Step 5) is the in-git recovery point for ALL affected folders. **The only deferred push is the re-rooted monorepo + any repo rename** (Task 11) — a separate Boss decision.

---

## File map (what changes)

- **Move:** `D:\VFXellence-LTD\polymath\.git` → `D:\VFXellence-LTD\.git` (re-root)
- **Create:** `D:\VFXellence-LTD\.gitignore`, `D:\VFXellence-LTD\.canon\1_controller\profiles\polymath\`, `.canon\2_architect\codebase\`, `.canon\{1_controller,2_architect,3_notes,4_orchestrator,5_knowledge}\...\polymath-business\`, `.canon\.claude\skills\polymath\`
- **Move (history-preserving `git mv`):** `polymath\vault\**` → `.canon\**` (per mapping); `polymath\vault\dev\**` → `.canon\**`; `polymath\apps\dashboard\**` → `.canon\.mission-control\client\**`
- **Modify:** `polymath\CLAUDE.md` (deployed from profile + routing update)
- **Convert:** `polymath\vault\` → one-line pointer README (Task 10, Boss-gated)

---

## Task 0: Pre-flight — backup, safety tag, commit WIP

**Model/effort:** sonnet / medium. **Worktree:** N/A (main checkout). **GATE: Boss confirms before proceeding.**

- [ ] **Step 1: Confirm current repo state**

Run:
```powershell
git -C D:\VFXellence-LTD\polymath status
git -C D:\VFXellence-LTD\polymath branch --show-current
git -C D:\VFXellence-LTD\polymath remote -v
```
Expected: branch `develop`; remote `origin` → `github.com/VFXellence-LTD/polymath`; a set of modified/untracked files (CLAUDE.md, vite.config.ts, package.json, poly.bat, references/*, vault/dev changelogs, source-material-bible, the planning docs).

- [ ] **Step 2: Stop the dev server (frees the working tree + port 5174)**

Run:
```powershell
foreach ($p in (Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue).OwningProcess) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
```
Verify: `netstat -ano | Select-String ":5174\s" | Select-String LISTENING` → no output.

- [ ] **Step 3: Commit all in-flight work on `develop` (so nothing is lost in the re-root)**

Run:
```powershell
git -C D:\VFXellence-LTD\polymath add -A
git -C D:\VFXellence-LTD\polymath commit -m @'
Checkpoint WIP before monorepo restructure

- Dashboard dev-script filter fix + vite vault-write plugin
- JARVIS toolkit reference capture + 7 tool evals
- Source Material Bible section 20
- State review + canon integration plans v1/v2 + roadmap
- poly.bat launcher
'@
```
Expected: a commit on `develop`; `git status` → clean.

- [ ] **Step 4: BACKUP TO GIT — all affected folders, recoverably (Boss's explicit requirement)**

This is the safety net. Three independent backups so current functionality cannot be lost.

**4a — Confirm the origin repo is PRIVATE before pushing** (we're about to back up business safeguards / strategy):
```powershell
gh repo view VFXellence-LTD/polymath --json visibility
```
Expected: `"visibility":"PRIVATE"`. **If PUBLIC, STOP** — make it private (`gh repo edit VFXellence-LTD/polymath --visibility private`) or skip the remote push and rely on the local backups (4c/4d) until a private remote exists.

**4b — Tag + push the current tracked state to origin** (remote backup of all polymath code + vault):
```powershell
git -C D:\VFXellence-LTD\polymath tag pre-monorepo-restructure
git -C D:\VFXellence-LTD\polymath push origin develop
git -C D:\VFXellence-LTD\polymath push origin pre-monorepo-restructure
```
Verify: `git -C D:\VFXellence-LTD\polymath ls-remote --tags origin pre-monorepo-restructure` returns the tag.

**4c — Full local mirror clone** (portable, complete history — survives even working-tree corruption):
```powershell
git clone --mirror "D:\VFXellence-LTD\polymath\.git" "D:\VFXellence-LTD\_backup_polymath_repo_2026-06-13.git"
```
Verify: `Test-Path "D:\VFXellence-LTD\_backup_polymath_repo_2026-06-13.git\HEAD"` → True.

**4d — Filesystem copy of the UNTRACKED affected folders** (not yet in any git repo; this is their backup until the re-root commits them):
```powershell
foreach ($f in @(".canon","bin","abundenz-site")) {
  Copy-Item -Recurse -Force "D:\VFXellence-LTD\$f" "D:\VFXellence-LTD\_backup_${f}_2026-06-13" -ErrorAction SilentlyContinue
}
```
Verify: the three `_backup_*_2026-06-13` folders exist. (All `_backup_*` paths are gitignored in Task 1, so they never get tracked or pushed.)

> Recovery points after this step: (1) `origin/develop` + `pre-monorepo-restructure` tag on GitHub, (2) the local mirror `.git`, (3) filesystem copies of `.canon`/`bin`/`abundenz-site`. The re-root's baseline commit (Task 2 Step 5) adds a 4th: all folders captured in monorepo git history BEFORE any moves.

- [ ] **Step 5: GATE — Boss sign-off to proceed to the re-root.** Do not continue without explicit confirmation.

---

## Task 1: Author the root `.gitignore` (BEFORE re-root)

**Model/effort:** haiku / low. **Worktree:** N/A.

The `.gitignore` MUST exist before `git add -A` in Task 2, so private/dead/noisy paths are never staged.

- [ ] **Step 1: Create `D:\VFXellence-LTD\.gitignore`**

Create file `D:\VFXellence-LTD\.gitignore`:
```gitignore
# ── Privacy / dead content — NEVER track or push ──
/_personal/
/archive/
/_backup_canon_*/

# ── Machine-local Claude config (keep CLAUDE.md + settings.json, drop the rest) ──
.claude/*
!.claude/CLAUDE.md
!.claude/settings.json

# ── Dependencies / build / data ──
node_modules/
**/node_modules/
dist/
build/
**/.data/
*.db
*.db-shm
*.db-wal

# ── Obsidian local state ──
**/.obsidian/workspace*
**/.obsidian/cache
**/.obsidian/graph.json

# ── Env / secrets ──
.env
.env.*
*.local
**/.vite/
.DS_Store
```

- [ ] **Step 2: Verify the privacy guard matches Boss's confirmed exclusions**

Confirm `_personal/`, `archive/`, `*.db`, `node_modules/`, `.claude/*` (except CLAUDE.md/settings.json) are all listed. These were the Boss-approved exclusions (spec §7 privacy gate).

---

## Task 2: Git re-root to `D:\VFXellence-LTD\` + restructure commit

**Model/effort:** opus / high. **Worktree:** N/A. **★ BOSS CHECKPOINT — the highest-risk step. Boss present.**

- [ ] **Step 1: Move the `.git` directory up one level**

Run:
```powershell
Move-Item "D:\VFXellence-LTD\polymath\.git" "D:\VFXellence-LTD\.git"
```

- [ ] **Step 2: Verify the new repo root**

Run: `git -C D:\VFXellence-LTD rev-parse --show-toplevel`
Expected: `D:/VFXellence-LTD`

- [ ] **Step 3: Inspect what git sees (sanity before staging)**

Run: `git -C D:\VFXellence-LTD status --short | Select-Object -First 30`
Expected: previously-tracked paths (e.g. `apps/...`, `vault/...`, `CLAUDE.md`) shown as deleted (`D`), and `polymath/`, `.canon/`, `abundenz-site/`, `bin/` shown as untracked (`??`). `_personal/`, `archive/`, `node_modules/` must NOT appear (gitignored).

- [ ] **Step 4: Confirm privacy paths are ignored**

Run: `git -C D:\VFXellence-LTD check-ignore _personal archive polymath/node_modules .canon/_backup_canon_2026-06-13 2>$null; git -C D:\VFXellence-LTD status --short | Select-String "_personal|/archive/"`
Expected: first command echoes the ignored paths; the second returns NOTHING. **If `_personal` or `archive` appear in status, STOP and fix `.gitignore` before committing.**

- [ ] **Step 5: Stage everything and commit the restructure**

Run:
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m @'
Re-root project as single monorepo at VFXellence-LTD

- Move git root up: polymath/ is now a subdir; .canon/ + abundenz-site/ + bin/ tracked
- Add root .gitignore excluding _personal/, archive/, node_modules, *.db, local .claude
- All former polymath/* paths preserved under polymath/* (rename-detected history)
'@
```
Expected: one large commit; `git status` clean (except ignored paths).

- [ ] **Step 6: VERIFY git history survived the rename**

Run: `git -C D:\VFXellence-LTD log --follow --oneline -- polymath/apps/dashboard/package.json | Select-Object -First 5`
Expected: commit history for the dashboard package.json appears (including pre-restructure commits) — proves `--follow` traces through the move. If only the restructure commit shows, rename detection failed; investigate before continuing (do NOT proceed to deletions).

- [ ] **Step 7: GATE — Boss confirms the re-root looks correct.**

**Rollback (if anything is wrong before Step 5 commit):** `Move-Item "D:\VFXellence-LTD\.git" "D:\VFXellence-LTD\polymath\.git"` restores the original repo. After Step 5, rollback = `git -C D:\VFXellence-LTD reset --hard pre-monorepo-restructure` then move `.git` back down.

---

## Task 3: Populate `.canon` empty slots

**Model/effort:** sonnet / medium. **Worktree:** N/A. `.canon` already exists (stamped 2026-06-05) — only create the missing slots, do NOT re-stamp.

- [ ] **Step 1: Create the new directories**

Run:
```powershell
$base = "D:\VFXellence-LTD\.canon"
$dirs = @(
  "$base\1_controller\profiles\polymath",
  "$base\1_controller\standards\polymath-business\compliance",
  "$base\1_controller\standards\polymath-business\safeguards",
  "$base\1_controller\standards\polymath-business\source-material-legal",
  "$base\2_architect\codebase",
  "$base\2_architect\polymath-business",
  "$base\3_notes\polymath-business",
  "$base\4_orchestrator\projects\polymath-business",
  "$base\5_knowledge\learning\polymath-business",
  "$base\5_knowledge\reference\polymath-business",
  "$base\.claude\skills\polymath"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }
```
Verify: `Test-Path "$base\1_controller\profiles\polymath"` → True (spot-check a few).

- [ ] **Step 2: Stub the codebase docs** (placeholders filled after the move)

Create `D:\VFXellence-LTD\.canon\2_architect\codebase\mission-control.md`, `dashboard.md`, `types.md`, `agents.md`, each with one line: `# <name> — codebase doc (TBD after restructure; see Plan 1+).`

- [ ] **Step 3: Commit**

```powershell
git -C D:\VFXellence-LTD add .canon
git -C D:\VFXellence-LTD commit -m "Create .canon polymath-business slots + codebase stubs"
```

---

## Task 4: Merge `vault/dev/` → `.canon` (collision-aware)

**Model/effort:** sonnet / medium. **Worktree:** N/A. `vault/dev/` is already canon-patterned, so this is a near-direct merge.

- [ ] **Step 1: Diff the known collisions before moving**

Run:
```powershell
git -C D:\VFXellence-LTD diff --no-index .canon\4_orchestrator\changelogs\_template.md polymath\vault\dev\4_orchestrator\changelogs\_template.md
git -C D:\VFXellence-LTD diff --no-index .canon\1_controller\standards\no-go-rules.md polymath\vault\dev\1_controller\standards\no-go-rules.md
```
Decision: if identical, discard polymath's; if different, keep `.canon`'s canonical version and move polymath's under a `-polymath` suffix.

- [ ] **Step 2: Move the non-colliding real files**

Run (adjust to actual `vault/dev` contents found in Step 1):
```powershell
$dev = "polymath\vault\dev"; $c = ".canon"
git -C D:\VFXellence-LTD mv "$dev\DEV-CLAUDE.md" "$c\1_controller\profiles\polymath\CLAUDE.md"
git -C D:\VFXellence-LTD mv "$dev\README.md" "$c\1_controller\profiles\polymath\README.md"
git -C D:\VFXellence-LTD mv "$dev\4_orchestrator\changelogs\2026-06-03.md" "$c\4_orchestrator\changelogs\2026-06-03.md"
git -C D:\VFXellence-LTD mv "$dev\4_orchestrator\changelogs\2026-06-13.md" "$c\4_orchestrator\changelogs\2026-06-13-polymath-dev.md"
git -C D:\VFXellence-LTD mv "$dev\1_controller\standards\no-go-rules.md" "$c\1_controller\standards\polymath-business\no-go-rules-polymath.md"
```
(Reconcile `typescript-engineering.md`: compare `$dev\1_controller\...\typescript-engineering.md` with `.canon`'s; richer one wins — `git mv` the winner into `.canon\1_controller\standards\` or discard.)

- [ ] **Step 3: Move the planning docs into the orchestrator archive**

Run:
```powershell
$o = ".canon\4_orchestrator\projects\polymath-business"
git -C D:\VFXellence-LTD mv "polymath\vault\dev\4_orchestrator\state-review-2026-06-13.md" "$o\"
git -C D:\VFXellence-LTD mv "polymath\vault\dev\4_orchestrator\canon-integration-plan-2026-06-13.md" "$o\"
git -C D:\VFXellence-LTD mv "polymath\vault\dev\4_orchestrator\canon-integration-plan-v2-2026-06-13.md" "$o\"
git -C D:\VFXellence-LTD mv "polymath\vault\dev\4_orchestrator\plans" "$o\plans"
```

- [ ] **Step 4: Verify nothing left behind, then commit**

Run: `Get-ChildItem -Recurse -File "D:\VFXellence-LTD\polymath\vault\dev" | Measure-Object` → near zero (only any intentionally-discarded duplicates remain to delete).
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Merge vault/dev into .canon (profiles, changelogs, standards, plans)"
```

---

## Task 5: Merge business `vault/` → `.canon` paradigms

**Model/effort:** sonnet / medium (judgment on placement). **Worktree:** N/A. Follow the v2 spec §1a mapping. Group moves by paradigm; each group is independent.

- [ ] **Step 1: 1_controller (governance, safeguards, compliance, legal)**

```powershell
$v = "polymath\vault"; $cs = ".canon\1_controller\standards\polymath-business"
git -C D:\VFXellence-LTD mv "$v\shared\brand-isolation\POLICY.md" "$cs\brand-isolation.md"
git -C D:\VFXellence-LTD mv "$v\controller\kill-switch-criteria.md" "$cs\kill-switch-criteria.md"
git -C D:\VFXellence-LTD mv "$v\controller\README.md" "$cs\controller-charter.md"
git -C D:\VFXellence-LTD mv "$v\ecosystems\shared\compliance" "$cs\compliance"
git -C D:\VFXellence-LTD mv "$v\ecosystems\viral\safeguards\POLICY.md" "$cs\safeguards\viral-surge.md"
git -C D:\VFXellence-LTD mv "$v\ecosystems\content\verticals\lullaby\safeguards\POLICY.md" "$cs\safeguards\lullaby-child-safety.md"
git -C D:\VFXellence-LTD mv "$v\shared\source-material-bible\01-Legal-Guidelines" "$cs\source-material-legal"
```
(Adjust paths to actual tree; if `brand-naming.md` / `shared\automation\deployment.md` exist, move per mapping.)

- [ ] **Step 2: 2_architect (ecosystem specs, agent designs, surge playbooks)**

```powershell
$ab = ".canon\2_architect\polymath-business"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\content"   "$ab\ecosystems\content"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\viral"     "$ab\ecosystems\viral"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\products"  "$ab\ecosystems\products"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\affiliate" "$ab\ecosystems\affiliate"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\shared\agents"    "$ab\shared-agents"
git -C D:\VFXellence-LTD mv "polymath\vault\ecosystems\shared\workflows" "$ab\shared-workflows"
```
(Surge `viral-formula` + Zrodinger spec land here under `ecosystems\viral\` — confirm present; these three are what the engine reads.)

- [ ] **Step 3: 3_notes, 4_orchestrator, 5_knowledge (research, dashboards, references, corpus)**

```powershell
git -C D:\VFXellence-LTD mv "polymath\vault\references\_inbox.md" ".canon\3_notes\polymath-business\references-inbox.md"
git -C D:\VFXellence-LTD mv "polymath\vault\controller\dashboard.md" ".canon\4_orchestrator\projects\polymath-business\ecosystem-dashboard.md"
git -C D:\VFXellence-LTD mv "polymath\vault\controller\launches" ".canon\4_orchestrator\projects\polymath-business\launches"
git -C D:\VFXellence-LTD mv "polymath\vault\references\articles" ".canon\5_knowledge\learning\polymath-business\articles"
git -C D:\VFXellence-LTD mv "polymath\vault\references\reels"    ".canon\5_knowledge\learning\polymath-business\reels"
git -C D:\VFXellence-LTD mv "polymath\vault\references\tools"    ".canon\5_knowledge\reference\polymath-business\tools"
git -C D:\VFXellence-LTD mv "polymath\vault\references\creators" ".canon\5_knowledge\reference\polymath-business\creators"
git -C D:\VFXellence-LTD mv "polymath\vault\shared\prompts"      ".canon\5_knowledge\reference\polymath-business\prompts"
git -C D:\VFXellence-LTD mv "polymath\vault\shared\source-material-bible" ".canon\5_knowledge\reference\polymath-business\source-material"
```
(Move remaining `references/*` and `shared/automation/*` per the full mapping table. The Surge research / app-ideas go to `3_notes\polymath-business\`.)

- [ ] **Step 4: Verify + commit**

Run: `Get-ChildItem -Recurse -File "D:\VFXellence-LTD\polymath\vault" -Exclude "CLAUDE.md","README.md" | Measure-Object` → near zero (vault should be nearly emptied; `vault/CLAUDE.md` handled in Task 10).
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Merge polymath business vault into .canon paradigms"
```

---

## Task 6: Move skills → `.canon/.claude/skills/polymath/`

**Model/effort:** haiku / low. **Worktree:** N/A.

- [ ] **Step 1: Move the four skills**

```powershell
$sk = "polymath\vault\shared\skills"; $dst = ".canon\.claude\skills\polymath"
git -C D:\VFXellence-LTD mv "$sk\polymath-pitfalls"  "$dst\polymath-pitfalls"
git -C D:\VFXellence-LTD mv "$sk\niche-locker"       "$dst\niche-locker"
git -C D:\VFXellence-LTD mv "$sk\content-atomizer"   "$dst\content-atomizer"
git -C D:\VFXellence-LTD mv "$sk\review-miner"       "$dst\review-miner"
```
Verify: `Test-Path "$dst\polymath-pitfalls\SKILL.md"` → True.

- [ ] **Step 2: Commit**
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Move polymath skills into .canon/.claude/skills"
```

---

## Task 7: Reopen `.canon` as the Obsidian vault root

**Model/effort:** haiku / low. **Worktree:** N/A. (Adopted default: open `.canon` as root rather than mass-fixing wikilinks.)

- [ ] **Step 1:** In Obsidian, "Open folder as vault" → `D:\VFXellence-LTD\.canon`. (Boss action — note in handoff.)
- [ ] **Step 2:** Spot-check 3–4 `[[wikilinks]]` in moved docs (e.g. brand-isolation). If many are broken because they referenced old `vault/`-relative paths, run a find-replace pass in a follow-up; for now record broken-link count in the changelog. Non-blocking for the build.

---

## Task 8: Move the dashboard → `.canon/.mission-control/client`

**Model/effort:** sonnet / medium. **Worktree:** N/A (cross-tree move + boot verify).

- [ ] **Step 1: Create the mission-control shell + move the client**

```powershell
New-Item -ItemType Directory -Force -Path "D:\VFXellence-LTD\.canon\.mission-control" | Out-Null
git -C D:\VFXellence-LTD mv "polymath\apps\dashboard" ".canon\.mission-control\client"
```

- [ ] **Step 2: Reinstall deps at the new location + boot the client alone**

Run:
```powershell
$env:CI='true'; pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\client" install
pnpm -C "D:\VFXellence-LTD\.canon\.mission-control\client" dev
```
(Run the dev step in background.) Verify: `netstat -ano | Select-String ":5174\s" | Select-String LISTENING` → listening; the client renders at `http://localhost:5174`. **This is the green-light before the old path is gone.**

> Note: the dashboard is currently a pnpm workspace member of the polymath repo. Moving it out of `polymath/apps/` means it leaves the polymath pnpm workspace. For Plan 0, run it standalone (its own `node_modules`). Plan 1 wires the proper `@vfxellence/mission-control` package + server; do not over-engineer the workspace wiring here.

- [ ] **Step 3: Commit**
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Move dashboard to .canon/.mission-control/client"
```

---

## Task 9: Repoint `polymath/`, deploy CLAUDE.md profile, update routing

**Model/effort:** sonnet / medium. **Worktree:** N/A.

- [ ] **Step 1: Deploy the canon-managed profile to `polymath/CLAUDE.md`**

Copy `.canon\1_controller\profiles\polymath\CLAUDE.md` → `polymath\CLAUDE.md` (reconcile: keep the no-Jira/VFXellence/semver customisations; this file is now SOURCED from `.canon`). Update its routing table: control plane → `D:\VFXellence-LTD\.canon\.mission-control`; governance → `D:\VFXellence-LTD\.canon`; engine → `polymath\packages\agents`.

- [ ] **Step 2: Fix the root `dev` script + remove the empty apps slot reference**

`polymath/package.json` `dev` script already filters `polymath-dashboard` (no longer present in this workspace) — update to point at the engine/streams or remove. Note `apps/` is now empty, reserved for future streams (`apps/zappz`, `apps/amj`).

- [ ] **Step 3: Update the launcher**

`bin\poly.bat` + `D:\dev\bin\poly.bat` `cd` target → `D:\VFXellence-LTD\.canon\.mission-control\client`. (The dashboard moved.)

- [ ] **Step 4: Commit**
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Repoint polymath profile, dev script, and poly.bat to new layout"
```

---

## Task 10: Convert `polymath/vault/` to a pointer  ★ BOSS GATE (deletion)

**Model/effort:** haiku / low. **Worktree:** N/A. **Do NOT run until everything above is verified green and Boss confirms.**

- [ ] **Step 1: Confirm the vault is emptied** (only `CLAUDE.md`/`README.md` should remain)

Run: `Get-ChildItem -Recurse -File "D:\VFXellence-LTD\polymath\vault"`
Expected: only `CLAUDE.md` (+ maybe `README.md`).

- [ ] **Step 2: Replace with a pointer** (not a hard delete)

Replace `polymath\vault\CLAUDE.md` content with:
```markdown
# Moved

The polymath business vault now lives in the domain governance vault:
**`D:\VFXellence-LTD\.canon`** (paradigm folder `2_architect/polymath-business/`, etc.).
Open `.canon` as the Obsidian root.
```
Remove any other leftover files. Keep the `vault/` folder as just this pointer until Boss approves full deletion.

- [ ] **Step 3: Commit**
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Convert polymath/vault to a pointer to .canon"
```

---

## Task 11: Final verification + changelog (NO push)

**Model/effort:** sonnet / medium. **Worktree:** N/A.

- [ ] **Step 1: Structural verification**

Run:
```powershell
git -C D:\VFXellence-LTD rev-parse --show-toplevel        # D:/VFXellence-LTD
git -C D:\VFXellence-LTD status                            # clean
git -C D:\VFXellence-LTD check-ignore _personal archive    # both echoed (ignored)
Test-Path "D:\VFXellence-LTD\.canon\.mission-control\client\package.json"   # True
Test-Path "D:\VFXellence-LTD\.canon\2_architect\polymath-business\ecosystems\viral"  # True
```
Expected: all as annotated; dashboard boots from the new path (Task 8 Step 2).

- [ ] **Step 2: Write the changelog**

Append `## RESTRUCTURE — monorepo re-root + .canon merge` to `.canon\4_orchestrator\changelogs\2026-06-13.md` (summary, files moved, verification results, broken-wikilink count, deferred items).

- [ ] **Step 3: Final commit (local only)**
```powershell
git -C D:\VFXellence-LTD add -A
git -C D:\VFXellence-LTD commit -m "Record monorepo restructure in changelog"
```

- [ ] **Step 4: GATE — monorepo remote decision.** The pre-restructure state is already safely backed up (Task 0: pushed `develop`+tag, mirror clone, filesystem copies). What's deferred is pushing the *re-rooted monorepo*: `origin` points at `github.com/VFXellence-LTD/polymath`, which would now receive the whole monorepo (incl. `.canon`). Surface to Boss: keep the `polymath` remote (it just holds more now), rename it (e.g. `vfxellence`), or create a fresh repo + re-point `origin`. Decide, then push the monorepo.

---

## Done = ready for Plan 1

When all tasks are green: single monorepo at `D:\VFXellence-LTD\`, `.canon` holds governance + merged business vault + `.mission-control/client` (dashboard booting), `polymath/` = streams + `packages/`, history preserved, `_personal`/`archive` excluded, nothing pushed. Then author **Plan 1 (Mission Control server)** against the new layout.
