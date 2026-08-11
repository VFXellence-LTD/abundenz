---
layer: universal
description: Python engineering standards for VFXellence projects. Stack-agnostic. Drop Maya/DCC references from Halon base.
---

# Python Engineering Standards

> Priority: **Working code > Readability > Scalability > Elegance**
>
> Motto: *"Functional today. Maintainable tomorrow. Scalable next year."*

---

## Code Style (enforced by ruff)

| Setting | Value | Notes |
|---------|-------|-------|
| Line length | 88 | Black-compatible default |
| Indent | 4 spaces | |
| Quotes | Double | |
| Target | Python 3.11+ | |
| Rules | `E4, E7, E9, F` | Pyflakes + pycodestyle subset |
| Formatter | Ruff (Black-compatible) | |

---

## Structure Principles

### Flat > Clever

```python
def build_output_path(project: str, artifact: str, version: int) -> str:
    """Build an output path for a versioned artifact."""
    return f"/output/{project}/{artifact}/v{version:03d}"
```

Not `PathBuilderFactoryManager`. Only abstract if scale demands.

### Functions First

- Small pure functions preferred.
- Classes only for: persistent state, domain models, reusable service layers.

### Max Nesting: 3

Hit `if > for > if > for` → refactor to helpers.

### Early Returns > Deep Nesting

```python
if not path.exists():
    return None
```

---

## Docstrings (Google Style, Required)

Every public function:

```python
def submit_job(payload: dict, queue: str) -> str:
    """Submit a processing job to the queue.

    Args:
        payload: Job parameters as a dictionary.
        queue: Target queue name.

    Returns:
        The job ID string.

    Raises:
        RuntimeError: If submission fails.
    """
```

Rules: one-line summary, Args block, Returns if applicable, Raises when relevant. No essays.

---

## Type Hints

Required on all new code:

```python
from typing import Any, Dict, List, Optional, Tuple
```

Use `typing` module for backwards compat. Prefer modern syntax (`list[str]`) only if min Python version is 3.10+.

---

## Naming

- `output_path` not `op`
- `job_id` not `id`
- `user_profile` not `data`

Explicit. Code is read far more than it is written.

---

## Logging

Never `print()` in production.

```python
import logging

logger = logging.getLogger(__name__)
```

Use `logger.info()`, `logger.warning()`, `logger.error()`. Pair with Sentry for production services.

---

## Error Handling

### Fail Fast

```python
if not config_path.exists():
    raise FileNotFoundError(f"Config not found: {config_path}")
```

### Never Swallow Exceptions

```python
# BAD
except Exception:
    pass

# GOOD
except Exception as exc:
    logger.exception("Failed to process job.")
    raise
```

---

## Configuration

No hard-coded paths. No inline secrets.

Load from: `.env`, YAML, JSON, environment variables. Use `python-dotenv` or equivalent.

---

## Performance

- O(n) over O(n²) — `set()` for lookups
- Generators for large iterations
- `functools.lru_cache` for expensive repeated calls
- Single-pass processing where possible

---

## AI-Specific Rules

When Claude generates Python:

1. Clarity over cleverness
2. Type hints everywhere
3. Avoid needless dependencies
4. No async unless required
5. No magic numbers
6. Functions under ~40 lines
7. No metaclasses or decorators unless justified
8. No premature micro-optimizations
9. Follow existing module patterns in the target project

---

## Refactor Threshold

Refactor only when:

- Duplication 3+ times
- Function exceeds 50 lines
- Nesting exceeds depth 3
- Performance degradation observed

Not before.

---

## Links

- [[1_controller/standards/no-go-rules]] — Absolute violations
- [[1_controller/standards/testing-strategy]] — Test philosophy
- [[1_controller/standards/sentry-integration]] — Error monitoring
