# Slice 2: Brand-centric Setup Wizard — Design

**Issue:** #18 (sub-issue of epic #15 "Brand-centric multi-account Setup")
**Date:** 2026-07-01
**Status:** Approved
**Depends on:** #16 (slice 1 — brands/platform_accounts data + API, merged)
**Delivery:** Two PRs under #18 — **2a** (foundation: server + hooks + brand create/select/seed) then **2b** (wizard step rewiring + completion + non-content add-channel). 2b branches from develop after 2a merges.

## Background

The current Setup wizard (per-ecosystem tabs; 8 content steps) collects free-text into the `setup_data` table and has no connection to the `brands` / `platform_accounts` tables built in slice 1. This slice makes brands first-class: users create and select brands per ecosystem, and configure each brand's platform accounts through the wizard, persisting to the real DB tables. Umbrella model — one root domain with per-brand subdomain/email alias; brand names contain a "z" (Zrodinger active).

## Decisions (locked in brainstorming)

1. **Brand selector at top of every ecosystem tab** — dropdown of that ecosystem's brands + "＋ New brand". Selecting scopes all steps to the brand; creating persists a `Brand` immediately.
2. **Step→account mapping (content):** `email`→`Brand.email`; `domain`→brand context (kept as free-text for now); `youtube`/`beehiiv`/`ghost`→one `platform_accounts` row each; `socials`→4 accounts (x/linkedin/tiktok/instagram); `first_episode`/`agent_01`→free-text.
3. **Seed-on-brand-create:** creating a content brand also creates its 7 standard channel accounts (youtube, beehiiv, ghost, x, linkedin, tiktok, instagram) at `status:"not-started"`. Wizard edits them by id; filling flips `status→active`.
4. **All ecosystems brand-centric.** Content gets guided+seeded channel steps. viral/products/affiliate get the brand shell + a generic "＋ Add channel" (no authored lineup yet).
5. **All wizard fields per-brand:** `setup_data` gains a `brand_id` column (migration + route + hook).
6. **Per-brand completion:** channel steps derive completion from `account.status==="active"`; free-text steps keep an explicit toggle, brand-scoped (setup-progress table gains `brand_id`).

## Architecture

Client-driven, reusing slice-1 hooks (`useBrands`, `usePlatformAccounts`) and existing wizard components (`SetupPage`, `SetupStepper`, `SetupStep`, `setupExpansion` reducer, `useSetupData`, `useSetupProgress`). Server changes are additive migrations + brand-scoping of the existing `setup.ts` routes. Tailwind 4, custom components, React Router v7, `api` helper (`get/post/put/del`), Vitest + testing-library. NodeNext ESM on the server (`.js` import suffixes).

---

## PR 2a — Foundation (server + hooks + brand create/select/seed)

### 2a.1 Server migrations
- **`setup_data`** + `brand_id TEXT` (nullable). Effective key `(brand_id, ecosystem_id, step_id, field_key)`. Existing rows keep `brand_id NULL`. Migration idempotent (guard on column existence, matching the repo's migration style in `db.ts`).
- **setup-progress table** + `brand_id TEXT` (nullable). Effective key `(brand_id, step_id)`. Idempotent.

### 2a.2 Server routes (`server/routes/setup.ts`)
- `GET /api/setup/data/:ecosystemId?brandId=<id>` — filters by brand; omitted `brandId` → `brand_id IS NULL` (legacy scope).
- `PUT /api/setup/data` — body gains optional `brandId`; upsert keyed including brand.
- `GET /api/setup?brandId=<id>` — completion map for that brand; omitted → NULL scope.
- `POST /api/setup/toggle` — body gains optional `brandId`.
- Back-compat: all `brandId` params optional; NULL scope reproduces current behavior. Existing tests must still pass.

### 2a.3 Client hooks
- **`useBrands.addBrand`** returns `Promise<BrandRecord>` (resolve with the created record so callers get the new `id`). Preserve optimistic prepend.
- **`useSetupData(ecosystem, brandId?)`** — thread `brandId` into GET/PUT. Re-fetch when brandId changes.
- **`useSetupProgress(brandId?)`** — thread `brandId` into GET/toggle. Re-fetch when brandId changes.

### 2a.4 Client: brand create/select shell
- **`BrandSelector`** — lists brands for the current ecosystem (from `useBrands`, filtered by `ecosystemId`) + "＋ New brand". Active brand tracked in `SetupPage` state and reflected in the URL query `?brand=<id>` (so refresh/deep-link keeps selection). No brand → empty state prompting create/select; steps hidden until a brand is active.
- **`BrandCreateForm`** — inline form: `name` (required; client validation: must contain the letter "z", case-insensitive — the Zrodinger rule; show a clear inline error otherwise) + optional `email`. On submit: `await addBrand({name, ecosystemId, email})`; then if `ecosystemId === "content"`, seed the 7 channel accounts via `addAccount({brandId, platform, status:"not-started"})` for each of youtube, beehiiv, ghost, x, linkedin, tiktok, instagram; then select the new brand (update `?brand=`).
- `SetupPage` wires the selector + empty state above the existing stepper. In 2a the stepper still renders the current (non-brand-aware) steps; full rewiring is 2b. 2a's stepper is scoped to pass the active `brandId` into `useSetupData`/`useSetupProgress`.

### 2a.5 Tests (2a)
- Server: brand-scoped `GET/PUT /api/setup/data` and `GET /api/setup` + `POST /api/setup/toggle` (create/read/isolation between two brands; NULL-scope back-compat). Migration idempotency (running migrate twice is safe; column exists once). Extend `server/test/setup.test.ts` / `setup.route.test.ts`.
- Client: `useBrands.addBrand` resolves with the created record (id present). `useSetupData` includes `brandId` in requests. `BrandCreateForm` z-name validation (rejects "Acme", accepts "Zrodinger"); on content submit, issues brand create + 7 account seeds. `BrandSelector` lists/filters by ecosystem and drives `?brand=`.

---

## PR 2b — Wizard rewiring (channel steps + completion + non-content)

### 2b.1 Step model (`data/setup-steps.ts`)
- Annotate each content step with `kind: "channel" | "freetext"`.
- **channel steps** carry a `platform` and a field→account-field map:
  - `youtube` → `{ platform:"youtube", map:{ channelUrl:"url", channelName:"handle" } }`
  - `beehiiv` → `{ platform:"beehiiv", map:{ newsletterUrl:"url" } }`
  - `ghost` → `{ platform:"ghost", map:{ blogUrl:"url" } }`
  - `socials` → **multi-account**: expands to 4 accounts `{ x, linkedin, tiktok, instagram }`, each field value → that platform account's `handle`.
- **freetext steps:** `domain`, `first_episode`, `agent_01` (brand-scoped `setup_data`). `email` is a special freetext step whose value writes `Brand.email` via `updateBrand` (not setup_data).

### 2b.2 Channel-step rendering/editing (`SetupStep` / a new `ChannelStep`)
- For a channel step, resolve the brand's account(s) by platform from `usePlatformAccounts(brandId)`. Render each mapped field bound to the account field.
- On blur, `updateAccount(id, { <field>: value, status: "active" })` (filling a channel activates it). Empty-out → allow reverting status to `"not-started"` (define: a channel with all mapped fields empty → `not-started`).
- `socials` renders 4 rows (one per platform account).

### 2b.3 Completion (per-brand)
- Channel step complete = all its account(s) `status === "active"`. Derived indicator; clicking the completion control flips the account status (single-account steps toggle active/not-started; socials toggles all 4). No progress-table row for channel steps.
- Freetext steps: explicit toggle via `useSetupProgress(brandId)` (brand-scoped, from 2a). `email` step completion = `Brand.email` non-empty (derived) OR toggle — pick derived for consistency.
- Progress bar = completed steps / total for the selected brand.

### 2b.4 Non-content ecosystems
- Brand selector + empty state (from 2a) + a brand's account list rendered from `usePlatformAccounts(brandId)`, with a generic **"＋ Add channel"** control: choose/enter a `platform` and fill fields → `addAccount({ brandId, platform, ... })`. Edit/remove via `updateAccount`/`deleteAccount`. No guided steps, no auto-seed.

### 2b.5 Tests (2b)
- Channel step: editing a field calls `updateAccount` with the mapped field + `status:"active"`; clearing reverts to `not-started`; socials renders and updates 4 accounts. Completion derivation (all-active). Non-content "Add channel" creates an account. Progress bar reflects selected brand.

---

## Out of scope (slice 3)
- Entity-page DB rewire (`pages/EntityPage.tsx`) and seeding `data/entity.ts` → DB.
- Domain-step copy fix (umbrella subdomain wording; currently "register yourbrand.com").
- Per-ecosystem authored channel lineups for viral/products/affiliate.

## Verification
- Server: `cd .canon/.mission-control/server; npx vitest run` — existing suite green plus new brand-scoped setup tests; migrations idempotent.
- Client: `cd .canon/.mission-control/client; npx vitest run` — existing green plus new tests; `npm run build` clean (type-checks pass; `entity.ts` untouched).
