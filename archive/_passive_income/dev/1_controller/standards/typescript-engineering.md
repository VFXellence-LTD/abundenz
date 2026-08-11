# TypeScript Engineering Standards

Polymath development coding standards for all TypeScript/React projects.

---

## Language & Runtime

- TypeScript 5.x, strict mode
- Node.js 22+
- React 18+ (functional components, hooks)
- Vite for build tooling

## Style

- 2-space indent (TS/TSX/JSON)
- Single quotes for strings
- Semicolons required
- 100-char line width (softer than Canon's 79 — wider screens, JSX verbosity)
- Trailing commas in multiline

## Type Safety

- `strict: true` in tsconfig — no exceptions
- No `any` — use `unknown` and narrow with type guards
- No type assertions (`as`) except at system boundaries (API responses, JSON parse)
- Prefer `interface` over `type` for object shapes (extendability)
- Use `satisfies` operator for type checking without widening
- Discriminated unions for state machines

## React Patterns

- Functional components only
- Custom hooks for reusable logic (`use` prefix)
- `useState` for local state, `useReducer` for complex state
- Context for dependency injection, not global state
- No prop drilling beyond 2 levels — use context or composition
- Memoize expensive computations (`useMemo`), not everything
- `useCallback` only when passing to memoized children

## File Organization

```
src/
├── components/      ← UI components
│   ├── ui/          ← shadcn/ui primitives
│   └── [feature]/   ← feature-specific components
├── hooks/           ← custom hooks
├── lib/             ← utilities, helpers, constants
├── db/              ← database schema, queries
├── types/           ← shared type definitions
├── pages/           ← route-level components
└── main.tsx         ← entry point
```

## Naming

- Components: PascalCase (`EarningsTable.tsx`)
- Hooks: camelCase with `use` prefix (`useTransactions.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- Types/interfaces: PascalCase (`Transaction`, `EcosystemStatus`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- Files: match their primary export's casing

## Error Handling

- Use error boundaries for React component trees
- `try/catch` at system boundaries (API calls, file I/O, database)
- Return `Result<T, E>` pattern for operations that can fail predictably
- Never swallow errors silently — log or surface

## Testing

- Vitest for unit + integration tests
- React Testing Library for component tests
- Test behavior, not implementation
- No mocking database — use test fixtures with real SQLite
- Test file naming: `*.test.ts` or `*.test.tsx` colocated with source

## Dependencies

- Prefer built-in over third-party
- Evaluate bundle size before adding a dependency
- Pin exact versions in package.json
- No `@types/*` packages for libraries with built-in types

## Tooling

```json
// package.json scripts
{
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint src/",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```
