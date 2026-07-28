---
layer: universal
name: DB-authoritative stop vs. in-memory server state
description: In-memory server state (Maps, PTY registries) is process-lifetime and vanishes on restart / tsx-watch reload, while durable DB rows survive. Existence checks and stop/cancel operations that key only off in-memory state silently fail after a reload. Make terminal transitions DB-authoritative, and never let the client swallow the resulting error.
---

# DB-Authoritative Stop vs. In-Memory Server State

Captured: 2026-07-28, from the Mission Control Sessions "Stop" button no-op ([changelog: [[4_orchestrator/changelogs/2026-07-28]]]).

---

## Symptom

A viral agent session sat at status `waiting`. Clicking **Stop** on the Sessions page did nothing — the row stayed `waiting`. A direct `POST /api/sessions/:id/stop` from a different moment *did* work. So the "same" endpoint behaved differently depending on when it ran.

## Root cause

The stop route guarded existence against the **in-memory `SessionService` Map** only:

```ts
if (!deps.sessions.getSession(id)) { res.status(404)...; return; }  // Map lookup
```

But `GET /api/sessions`, the Map, and the `PtyService` are all **process-lifetime state**. A server restart — or, in dev, a `tsx watch` reload on any file save — wipes them. The durable `agent_runs` SQLite row survives, commonly stuck at `waiting`.

After a reload:
- The React list still holds the pre-reload row (it only refetches on a WS `status` event or a successful stop).
- Clicking Stop hits a **Map miss → 404**.
- The client **swallowed** the 404 (`.catch(() => {})`) and only refetched on success, so the UI never reconciled. The row stayed `waiting` forever.

The direct call that "worked" ran against a process where the id was still live in the Map.

## The reusable lessons

### 1. Make terminal transitions DB-authoritative, not memory-authoritative

Any operation that ends a durable entity (stop / cancel / kill) must be able to reach the entity via the **durable store**, not just the in-memory index. Pattern:

- Best-effort tear down the in-memory/OS resource (PTY kill is a no-op if absent — safe to always call).
- If the live in-memory entity exists, finish it normally.
- Else fall back to the DB row: if it's non-terminal, mark it terminal and emit the status event.
- 404 **only** when the id exists in neither place.

### 2. Never swallow the client error that hides stuck state

The 404 was silently caught, so a real "this didn't stop" was invisible. Client mutations that change durable state should:
- **Always** refetch afterward (`.finally(refresh)`), so the UI reconciles against the server even on failure.
- **Surface** the error (banner / toast), not `catch(() => {})`.

### 3. `tsx watch` makes this a *routine* dev condition

It's not an edge case. Every code save during a dev session reloads the server and wipes in-memory session/PTY state while the DB and the open browser tab persist. Design stop/cancel paths assuming the in-memory index can be empty for a row the UI still shows.

### 4. Windows PTY caveat (adjacent)

`node-pty`'s `IPty.kill()` on Windows terminates the spawned shell (PowerShell/conhost) but does **not** guarantee killing the whole descendant tree — a `claude` (Node) child typed into the shell can be orphaned. Marking the run `done` is correct for UI/state, but if true tree-termination is ever required, use `taskkill /T /F /PID <pid>` (or a tree-kill helper) rather than relying on the bare `kill()`. Not fixed here because the reported bug was the 404/status path, not a lingering process; noted for follow-up if orphaned `claude` processes are observed.

---

## Fix applied

- `session.service.ts` — `stopSession` returns `boolean`, best-effort PTY kill regardless of Map state, then live-session finish or DB-row fallback (`agent_runs` non-terminal → `done` + status emit).
- `routes/sessions.ts` — 404 only when `stopSession` reports the id is in neither Map nor DB.
- `SessionBoard.tsx` — always `refresh` after a stop attempt; surface stop errors.
- `test/sessions.route.test.ts` — regression: orphaned `waiting` run (no live session) → `done` on stop + PTY kill requested; unknown id still 404s. Confirmed the orphan test fails 404 without the fix.
