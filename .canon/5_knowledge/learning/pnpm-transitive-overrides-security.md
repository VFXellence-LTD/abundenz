---
layer: universal
name: pnpm overrides for transitive security fixes
description: Pin vulnerable transitive deps with pnpm.overrides using a version-range key ("pkg@>=x <y": "safe") in the workspace-root package.json — no direct-dep bump, no major upgrade. Also — Dependabot alerts are keyed to a manifest PATH, so they persist as stale after a repo reorg even once the vulnerable version is gone.
---

# pnpm: Fix Transitive Vulnerabilities with Overrides

Captured: 2026-07-28, from the Mission Control Dependabot remediation ([abundenz repo](https://github.com/VFXellence-LTD/abundenz), changelog: [[4_orchestrator/changelogs/2026-07-28]]).

---

## The pattern

A Dependabot/`pnpm audit` advisory on a **transitive** dependency (something you don't declare directly, pulled in via `eslint > minimatch > brace-expansion` etc.) does not need a direct-dep bump. Pin it with `pnpm.overrides` in the **workspace-root** `package.json`:

```jsonc
// .mission-control/package.json  (the workspace root, has pnpm-workspace.yaml)
"pnpm": {
  "overrides": {
    "react-router@>=7.11.0 <7.18.0": "7.18.0",
    "brace-expansion@>=3.0.0 <5.0.7": "5.0.7"
  }
}
```

Then `pnpm install` (at the workspace root) rewrites the root lockfile. Prefer the **range-qualified key** (`pkg@<range>`) over a bare `pkg` key: it only rewrites the versions that are actually vulnerable and leaves any already-patched copies alone. Choose the *minimum* patched version (the advisory's `first_patched_version`) to avoid pulling an unwanted major.

## Gotchas

### 1. Overrides apply from the workspace root only
pnpm reads `pnpm.overrides` from the root defined by `pnpm-workspace.yaml`. Workspace members (`client/`, `server/`) inherit it via the **root** lockfile. If a member also has its own standalone `pnpm-lock.yaml` / `package-lock.json` (vestigial, from before it joined the workspace), running `pnpm install` *inside that member dir* will NOT pick up the root overrides — but that lockfile is not authoritative when the app runs as a workspace. Don't chase it; verify with a root-level `pnpm audit` which traverses `member>dep>transitive`.

### 2. Dependabot alerts are keyed to a manifest PATH
Each alert stores the `manifest_path` it was found in. After a repo reorg/rename, alerts created against the OLD layout (e.g. `pnpm-lock.yaml` at repo root, `apps/dashboard/package-lock.json`) keep pointing at paths that no longer exist. They will NOT auto-close even after you fix the vulnerable version in the current tree, because Dependabot re-scans the paths it recorded. Confirm the real state with `gh api repos/<org>/<repo>/dependabot/alerts` + a local audit; stale alerts must be dismissed manually (reason: `fixed` / `no_bandwidth` / etc.) or will clear when Dependabot re-detects the current manifests.

### 3. Separate advisories on the same package
One package can carry multiple advisories with different patched floors (e.g. `react-router`: one fixed at `7.18.0`, another needing `8.3.0` major). Fixing the range-specific GitHub alert (`<7.18.0 → 7.18.0`) is safe and does NOT clear the later `<8.3.0` advisory — that's a separate major-bump decision. Read each advisory's own `vulnerable_version_range` before assuming one bump covers all.

## Verify before commit
- `pnpm audit --json` from the workspace root, filter to the target packages, confirm they drop out.
- Run the project's real gates (server tests, client build) — a transitive minor/patch bump can still break at runtime.
