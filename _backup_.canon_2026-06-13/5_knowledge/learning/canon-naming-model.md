---
layer: universal
description: The _canon base vs .canon derived naming model — the key architectural decision behind VFXellence governance. Capture for future factory vision.
---

# Canon Naming Model: `_canon` vs `.canon`

Captured: 2026-06-05. This is the key non-obvious architectural decision for VFXellence governance.

---

## The Distinction

| Symbol | Meaning | Example |
|--------|---------|---------|
| `_canon` (underscore prefix) | **Base / factory** — the source repo. Template + universal standards. | `D:/dev/halon-rdutta/_canon/` |
| `.canon` (dot prefix) | **Derived install** — adapted for a specific domain. | `D:/VFXellence-LTD/.canon/` |

The dot prefix is deliberate:
- In Unix/Windows convention, dot-prefixed directories are "hidden" or "config" — suggesting this is infrastructure, not content.
- The underscore prefix suggests a "system" or "library" repo — the factory.
- A future operator should be able to look at a filesystem and immediately know: `_canon` = the base I build from, `.canon` = the installed instance for this project.

---

## The Factory Vision

The long-term vision: `_canon` becomes a "`.canon` factory" — a tool that:

1. Reads a domain config (supervisor title, stack, issue tracker type, prohibited integrations, etc.)
2. Outputs a fresh `.canon/` directory with universal standards preserved + domain-tailored files generated

This means the universal layer (tagged `layer: universal`) must ALWAYS be cleanly separable from the tailored layer (tagged `layer: vfxellence`, `layer: halon`, etc.).

A factory regeneration should be able to:
- Replace all `layer: universal` files with a fresh port from `_canon`
- Leave all `layer: <domain>` files untouched
- Merge or flag conflicts

---

## Layer Tagging Convention

Every file in `.canon/1_controller/` has frontmatter:

```yaml
---
layer: universal    # OR
layer: vfxellence   # (domain-specific)
---
```

**`layer: universal`** files — ported and genericized from `_canon` base:
- `standards/no-go-rules.md`
- `standards/python-engineering.md`
- `standards/testing-strategy.md`
- `standards/sentry-integration.md`
- `workflows/worktrees.md`
- `workflows/subagent-strategy.md`
- `workflows/e2e-testing.md`
- `workflows/token-efficiency.md`
- `workflows/ralph-loop.md`
- `workflows/security-sweep.md`
- `workflows/development-lifecycle.md`
- `workflows/git-conventions.md`

**`layer: vfxellence`** files — domain-specific, not in factory base:
- `standards/typescript-engineering.md` (VFXellence stack)
- `workflows/issue-tracking.md` (replaces Jira integration)

---

## What Was Stripped from Halon Base

The following Halon-specific files were NOT ported (intentionally):

| Stripped | Reason |
|----------|--------|
| `jira-integration.md` | VFXellence has no Jira — file-based tracker instead |
| `upstream-policy.md` | AYON/Ynput fork policy is irrelevant |
| Addon versioning (`+label`) | AYON packaging pattern |
| Maya/DCC/AYON/Halon references | Halon-domain only |
| "Maestro" title | Halon-only — VFXellence uses "Boss" |
| Claude-docs addon pattern | Halon workspace only |

---

## Why This Matters

Without this distinction:
- Future domains would have to manually hunt through files to find which parts are generic vs. which are Halon-specific
- A factory tool would be impossible to build — no clean seam to cut on
- Derived installs would accumulate domain-specific cruft that's invisible to maintainers

With this distinction:
- A new domain (e.g., "AcmeCorp") can get a `.canon` install by running the factory with their config
- Universal standards evolve in `_canon` and can be propagated to all derived installs
- Domain-specific customization is clearly marked and won't be accidentally overwritten

---

## Related

- `D:/dev/halon-rdutta/_canon/` — the current base (factory source)
- `D:/VFXellence-LTD/.canon/` — this derived install
- [[CLAUDE.md]] — the VFXellence hub that references this model
