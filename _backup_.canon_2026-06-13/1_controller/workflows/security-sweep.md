---
layer: universal
name: security-sweep
description: Pre-push gate that prevents secrets, credentials, and sensitive data from reaching GitHub.
---

# Security Sweep

Pre-push gate that prevents secrets, credentials, and sensitive data from reaching GitHub.

## Rule

=== NEVER PUSH TO GITHUB WITHOUT RUNNING /security-sweep FIRST ===

Applies to:
- First push to any new remote
- Making any repo public
- After adding new API integrations or environment variables
- Before PR creation and releases

## What It Checks

1. **Secrets in tracked files** — API tokens (OpenAI `sk-`, Anthropic `sk-ant-`, Stripe `sk_live_`, Amazon `AKID`), private keys, connection strings with passwords, hardcoded credential assignments
2. **.gitignore coverage** — `.env`, `*.pem`, `*.key`, `*.db`, `node_modules/`, OS junk, `.canon/` if inadvertently inside a repo
3. **Tracked file audit** — catches files that slipped past `.gitignore`
4. **Config defaults** — secrets must default to `""` or read from env, never hardcoded values
5. **.env.example safety** — no real tokens, only placeholders

## Automated By

`/security-sweep` skill in canon-workflow plugin. Run manually or integrated into `/pr` flow.

## When Findings Exist

- **Hardcoded secret**: remove immediately, rotate the token (it's already in git history if committed)
- **Missing .gitignore entry**: add it
- **Tracked sensitive file**: `git rm --cached <file>` (needs Boss approval — modifies index)
- **Unsafe config default**: change to empty string or environment variable reference

## VFXellence-Specific Tokens to Watch

| Token Pattern | Source |
|---|---|
| `sk-ant-api03-` | Anthropic API key |
| `sk_live_` | Stripe live secret key |
| `sk_test_` | Stripe test secret key (still sensitive) |
| `AKID` / `AKIA` | AWS access key |
| `ya29.` | Google OAuth token |
| `ghp_` / `gho_` | GitHub personal access token |
| `xoxb-` / `xoxp-` | Slack token |

## Related

- [[1_controller/workflows/git-conventions]] — .gitignore standards
- [[1_controller/workflows/development-lifecycle]] — security sweep before PR
