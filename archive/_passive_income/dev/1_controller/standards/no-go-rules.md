# No-Go Rules — Polymath Development

Absolute violations. If any of these are detected in a PR, the PR is blocked until fixed.

---

## Security

=== NEVER COMMIT SECRETS, TOKENS, OR API KEYS ===
Use environment variables. `.env` files in `.gitignore`. Template files (`.env.example`) only.

=== NEVER STORE USER CREDENTIALS IN LOCAL STORAGE ===
SQLite database with proper file permissions. No browser localStorage for sensitive data.

=== NEVER EXECUTE UNSANITIZED USER INPUT ===
All user input validated and sanitized before use in queries, file paths, or shell commands.

## Code Quality

=== NO `any` TYPES IN TYPESCRIPT ===
Use `unknown` and narrow. No exceptions.

=== NO SILENT ERROR SWALLOWING ===
Every `catch` block must log, surface, or re-throw. Empty catch blocks are banned.

=== NO COMMENTED-OUT CODE ===
Delete it. Git has history.

=== NO CONSOLE.LOG IN PRODUCTION CODE ===
Use a proper logger. `console.log` only in development.

## Architecture

=== NO CLOUD DEPENDENCIES FOR CORE FUNCTIONALITY ===
Dashboard must work fully offline with local SQLite. Cloud features (sync, backup) are optional layers.

=== NO VENDOR LOCK-IN ON DATA ===
All data exportable to CSV/JSON at any time. No proprietary formats.

=== NO BREAKING CHANGES WITHOUT MIGRATION PATH ===
Database schema changes require migration scripts. Never drop tables without data export.

## Process

=== NO MERGE WITHOUT TESTS PASSING ===

=== NO FORCE PUSH TO MAIN ===

=== NO DEPLOY WITHOUT BOSS APPROVAL ===
