# Dedupe: archive/_passive_income vs polymath/vault

Created: 2026-06-05. Boss must reconcile these overlaps.

Source archived at: `D:/VFXellence-LTD/archive/_passive_income/`
Polymath vault at: `D:/VFXellence-LTD/polymath/vault/`

---

## Overlap Map

| Salvaged to .canon | archive/_passive_income source | Polymath vault equivalent | Risk |
|---|---|---|---|
| `5_knowledge/reference/entity-strategy.md` | `shared/entity-strategy.md` | `polymath/vault/shared/` (may exist or overlap) | LOW — entity-strategy is structural reference, both can coexist |
| `5_knowledge/reference/products/products-product-lines.md` | `ecosystems/atelier/brief/product-lines.md` | `polymath/vault/ecosystems/atelier/` (if it exists) | MEDIUM — if polymath vault has Atelier ecosystem, these may diverge |
| `5_knowledge/reference/products/products-color-palettes.md` | `ecosystems/atelier/brief/color-palettes.md` | Same | MEDIUM |
| `5_knowledge/reference/products/products-licensing-guide.md` | `ecosystems/atelier/brief/licensing-guide.md` | Same | MEDIUM |
| `5_knowledge/reference/growth-playbooks/tiktok-best-practices.md` | `ecosystems/conduit/playbooks/tiktok-best-practices.md` | `polymath/vault/ecosystems/conduit/` (if it exists) | MEDIUM |
| `5_knowledge/reference/growth-playbooks/affiliate-pipeline.md` | `ecosystems/conduit/workflows/affiliate-pipeline.md` | Same | MEDIUM |
| `5_knowledge/reference/growth-playbooks/pinterest-growth.md` | `ecosystems/conduit/workflows/pinterest-growth.md` | Same | MEDIUM |
| `5_knowledge/reference/growth-playbooks/niche-selection.md` | `ecosystems/conduit/brief/niche-selection.md` | Same | MEDIUM |
| `2_architect/patterns/agents/affiliate-content-generator.md` | `ecosystems/conduit/agents/02-content-generator.md` | Same | LOW — agent specs likely not in polymath vault |
| `2_architect/patterns/agents/affiliate-scheduler.md` | `ecosystems/conduit/agents/03-scheduler.md` | Same | LOW |

---

## Skipped / Dropped

Per instructions, the following were NOT salvaged:

| Source | Reason |
|--------|--------|
| `references/tools/flik-ai.md` | Tool reference, stale |
| `ecosystems/lullaby/` | Polymath canonical — lullaby is under polymath vault, not .canon |
| Empty/README-only stubs | No content worth salvaging |

---

## Boss Actions Required

1. **Verify polymath vault Atelier ecosystem**: Does `polymath/vault/ecosystems/atelier/` exist with content? If yes, decide: is `.canon/5_knowledge/reference/products/` the authoritative copy or vice versa? One should be deleted; the other becomes canonical.

2. **Verify polymath vault Conduit ecosystem**: Same question for `polymath/vault/ecosystems/conduit/`. If the polymath vault has playbooks/workflows, they supersede the `.canon` copies (polymath vault is more likely to be kept current).

3. **Delete archive/_passive_income?**: Boss must explicitly approve. The archive exists at `D:/VFXellence-LTD/archive/_passive_income/`. Content has been salvaged to `.canon`. Archive not deleted in this session — awaiting Boss approval.

4. **Lullaby**: Dropped entirely from .canon salvage. Verify it exists canonically in `polymath/vault/ecosystems/lullaby/`.

---

## Recommendation

If polymath vault has active Atelier + Conduit ecosystem docs, `.canon` copies should be marked as READ-ONLY reference and the polymath vault copies designated as canonical. The `.canon` versions were captured from archive on 2026-06-05 — they may already be outdated relative to what's in polymath vault.

Suggested resolution:
- `.canon/5_knowledge/reference/products/` → archive or delete if polymath vault is current
- `.canon/5_knowledge/reference/growth-playbooks/` → archive or delete if polymath vault is current
- `.canon/2_architect/patterns/agents/` → keep (agent specs likely not in polymath vault)
