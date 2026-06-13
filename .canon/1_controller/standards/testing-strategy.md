---
layer: universal
description: Testing philosophy and priorities for VFXellence projects. Stack-agnostic.
---

# Testing Strategy

**Goal**: Maximum confidence per engineering hour.

> 70% real coverage > 95% fake coverage.

---

## Priority Order

1. **Integration Tests** — Real workflows end-to-end
2. **Contract Tests** — API wrapper schema validation
3. **Golden File Tests** — Expected output comparison
4. **CLI / Smoke Tests** — Tool-level invocation
5. **Property-Based Tests** — Edge case discovery
6. **Unit Tests** — Selective, pure functions only

---

## Testing Pyramid (Pipeline / Service Teams)

Inverted from classic. Broader at top — real-world behavior matters more than isolated logic.

```
        CLI Smoke
      Integration
   Golden / Contracts
    Select Unit Tests
```

---

## Per New Feature (Required)

- 1 smoke test (does it run?)
- 1 integration test (does it do the right thing end-to-end?)
- 1 golden file test (if it generates output)

Optional: property tests for complex utility functions.

---

## High-Leverage Targets

Test these hard — they break often, cost real time when wrong:

- Data transformation and mapping logic
- Revenue calculation and commission math
- Config loading and environment parsing
- API response parsing
- File I/O and path resolution
- Schema validation

---

## What to Avoid

- **Mock-heavy unit tests** — break constantly, low confidence
- **UI tests** — expensive, brittle, slow (unless revenue-critical)
- **Complex fake environments** — high maintenance, low signal

---

## AI Test Generation

Claude can generate:

- Golden test fixtures
- Contract schema checks
- CLI invocation tests
- Property-based tests
- Regression tests when fixing bugs

Claude should NOT write:

- Complex mocks
- Fragile behavioral tests
- Multi-layer fake environments

---

## Coverage Philosophy

Do not chase percentage. Chase:

- Surface coverage (does the feature run?)
- Failure detection realism (does the test catch real bugs?)
- Tool-level correctness (does the output match expectations?)

---

## Links

- [[1_controller/standards/no-go-rules]] — What tests must verify
- [[1_controller/standards/python-engineering]] — Python code standards
- [[1_controller/standards/typescript-engineering]] — TypeScript code standards
