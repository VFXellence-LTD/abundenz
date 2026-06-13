---
layer: vfxellence
description: TypeScript/Node/React engineering standards for VFXellence projects. Stack: TS, Node, React, pnpm monorepo.
---

# TypeScript / React Engineering Standards

VFXellence primary web stack: **TypeScript + Node.js + React + pnpm monorepo**. This doc covers VFXellence-specific standards on top of the universal no-go rules.

> Stack note: the polymath monorepo at `D:/VFXellence-LTD/polymath/` uses Vite + React 19 + TypeScript + Tailwind CSS 4. Future Zappz apps will extend this pattern. See `polymath/CLAUDE.md` for project-specific rules.

---

## Language Target

- **TypeScript**: Strict mode required (`"strict": true` in tsconfig)
- **Node**: `>=20`
- **Package manager**: pnpm (workspaces)
- **Linter**: ESLint with TypeScript rules
- **Formatter**: Prettier (or Biome as unified alternative)

---

## Core Principles

Same as Python engineering — flat over clever, functions first, explicit naming. TypeScript-specific additions:

### Explicit Types

No implicit `any`. No unexplained `as` casts.

```typescript
// NEVER
const data: any = fetchData();

// INSTEAD
const profile: UserProfile = await fetchUserProfile(userId);
```

### Prefer Interfaces for Domain Models

```typescript
interface EcosystemMetrics {
  ecosystemId: string;
  revenue: number;
  views: number;
  updatedAt: Date;
}
```

### No Mutation of External State

Pure functions preferred. Side effects isolated at edges (API calls, DB writes).

---

## React Conventions

- Functional components only. No class components.
- `useState` + `useEffect` for local state. Consider Zustand or Context for shared state.
- Props typed with interfaces, not inline object types.
- No prop drilling beyond 2 levels — lift state or use context.
- Tailwind CSS 4 for styling (polymath stack). No CSS-in-JS.

---

## Error Handling

```typescript
// NEVER — silently swallowed
try {
  await fetchData();
} catch (_) {}

// INSTEAD
try {
  const result = await fetchData();
  return result;
} catch (error) {
  logger.error('fetchData failed', { error });
  throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : String(error)}`);
}
```

---

## Async Patterns

- `async/await` over `.then()` chains.
- Error boundary at async call sites, not buried in helpers.
- No fire-and-forget `void promise` calls without explicit error handling.

---

## Naming

- Files: `kebab-case.ts`, `kebab-case.tsx`
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

---

## Module Boundaries

In the pnpm monorepo:
- `packages/types` → shared TypeScript types only. No business logic.
- `packages/core` (future) → auth, billing, shared utilities.
- `apps/*` → application code. Imports from `packages/`, never from sibling `apps/`.

---

## Standards Pending

- Full ESLint config: TBD (check `polymath/` monorepo root for current config)
- React testing: Vitest + Testing Library (planned)
- API client pattern: TBD based on Zappz architecture decision

See `4_orchestrator/projects/backlog/VFX-002-zappz-marketplace-architecture.md` for Zappz stack decisions in flight.

---

## Links

- [[1_controller/standards/no-go-rules]] — Absolute violations
- [[1_controller/standards/testing-strategy]] — Test philosophy
- [[2_architect/zappz-marketplace/README]] — Zappz architecture context
