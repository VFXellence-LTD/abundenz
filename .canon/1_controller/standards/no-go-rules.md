---
layer: universal
description: Absolute engineering prohibitions. These rules apply to all VFXellence projects regardless of stack or domain.
---

# Absolute No-Go Rules

Three rules decide if a codebase survives growth.

> Before merge, ask:
> 1. Does this rely on hidden state?
> 2. Can this fail silently?
> 3. Does this work at 10x scale?
>
> Any answer "maybe" — fix it.

---

## 1. No Hidden Global State

**Why**: Non-deterministic behavior, unreproducible bugs, breaks testability, breaks concurrent services.

```python
# NEVER
CURRENT_USER = "robin"
config = load_config()  # at import time

# INSTEAD
def process(user: str, config: Config) -> None:
    ...
```

```typescript
// NEVER
let currentSession: Session;  // module-level mutable global

// INSTEAD
function processRequest(session: Session): void { ... }
```

Pass state explicitly. Initialize at entrypoints. Use dependency injection.

> Behavior change from invisible state = defect.

---

## 2. No Silent Failures

**Why**: Users continue with broken data. Jobs succeed wrong. Corruption spreads.

```python
# NEVER
except Exception:
    pass

if not path.exists():
    return  # no log, no raise
```

```typescript
// NEVER
try {
  await riskyOperation();
} catch (_) {}  // swallowed
```

Fail fast. Log. Raise meaningful exceptions. Capture to Sentry in production services.

> System cannot proceed safely = stop loud.

---

## 3. No Quadratic / Unbounded Operations in Production Paths

**Why**: Works at 10 records, fails at 10,000.

```python
# NEVER — O(n²)
for item in items:
    for approved in approved_items:
        if item == approved: ...

# INSTEAD — O(n)
approved_set = set(approved_items)
for item in items:
    if item in approved_set: ...
```

```typescript
// NEVER — O(n²) nested array scan
const results = items.filter(i => bigList.includes(i));

// INSTEAD — O(n) set lookup
const bigSet = new Set(bigList);
const results = items.filter(i => bigSet.has(i));
```

Sets for lookup. Generators/streams for large iteration. Single-pass transforms.

> Complexity growing faster than O(n) = justify in writing or fix.

---

## Summary

| Rule | Prevents |
|------|----------|
| No hidden state | Chaos |
| No silent failure | Corruption |
| No bad complexity | Collapse at scale |

Rest is style. These three = survival.

---

## Links

- [[1_controller/standards/python-engineering]] — Python coding standards
- [[1_controller/standards/typescript-engineering]] — TypeScript/Node standards
- [[1_controller/standards/testing-strategy]] — How we verify these rules hold
