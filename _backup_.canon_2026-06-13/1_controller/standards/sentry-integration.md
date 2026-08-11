---
layer: universal
description: Sentry error monitoring standards. Production services must capture exceptions. Stack-agnostic.
---

# Sentry Integration Standard

Production-grade error monitoring. Zero friction. No performance hit.

> Service crashes in production, Sentry does not report = unacceptable.

---

## Rules

- All production services support Sentry
- Initialize once at application entrypoint — never per-function
- Context includes: user ID (hashed/anonymous if PII concern), environment, service version
- Never hardcode DSN — use `SENTRY_DSN` environment variable
- Sentry must never block execution (no-op if DSN missing)

---

## Configuration

```bash
SENTRY_DSN=https://xxxxx@o000.ingest.sentry.io/000000
SENTRY_ENV=production
SENTRY_RELEASE=service-name-1.0.0
```

| Setting | Value | Reason |
|---------|-------|--------|
| `traces_sample_rate` | 0.05–0.1 | Avoid overhead |
| `send_default_pii` | False | Privacy |
| LoggingIntegration | Yes | Free breadcrumbs |
| Profiling | Off | Not needed yet |

---

## Python Init Pattern

```python
# At application entrypoint ONLY
import sentry_sdk

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", ""),
    environment=os.environ.get("SENTRY_ENV", "development"),
    traces_sample_rate=0.05,
    send_default_pii=False,
)
```

---

## Node/TypeScript Init Pattern

```typescript
// At application entrypoint ONLY (e.g., server.ts, main.ts)
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? "",
  environment: process.env.SENTRY_ENV ?? "development",
  tracesSampleRate: 0.05,
  sendDefaultPii: false,
});
```

---

## What We Do NOT Do

- No per-function Sentry init
- No hardcoded DSN anywhere
- No silent error swallowing
- No 100% trace sampling in production
- No heavy profiling in user-facing services

---

## Links

- [[1_controller/standards/python-engineering]] — Error handling standards
- [[1_controller/standards/typescript-engineering]] — TS error handling
- [[1_controller/standards/no-go-rules]] — Silent failure prohibition
