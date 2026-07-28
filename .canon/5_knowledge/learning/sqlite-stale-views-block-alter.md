---
layer: universal
description: SQLite re-validates every view on any ALTER TABLE — one orphan view referencing a dropped column makes ALL migrations throw. Treat views as derived state (drop-and-recreate dynamically); never blanket-catch ALTER errors.
---

# SQLite: Stale Views Block Every ALTER TABLE

Captured: 2026-07-28, from the Mission Control boot crash ([issue #22](https://github.com/VFXellence-LTD/abundenz/issues/22), changelog: [[4_orchestrator/changelogs/2026-07-28]]).

---

## The Gotchas

### 1. View validation is lazy at CREATE, eager at ALTER

SQLite does **not** validate a view's SELECT against the schema when the view is created — `CREATE VIEW v AS SELECT missing_column FROM t` succeeds silently. But on **any** `ALTER TABLE` (even on an unrelated table), SQLite re-validates **every** view in the database. One orphan view referencing a dropped/renamed column makes **all** subsequent migrations throw:

```
SqliteError: error in view v_foo: no such column: bar
```

The failure surfaces far from where the corruption was introduced — a classic time bomb. In our case, views created against an old `agent_runs` schema sat broken for weeks until an unrelated `ALTER TABLE ... RENAME` in a later migration hit them and crashed boot.

### 2. Static drop lists rot

A hard-coded `LEGACY_VIEWS = [...]` drop list only knows about views that existed when the list was written. Views from abandoned naming eras (our `v_forge_*` from the old "apps"/forge codename) survive forever. **Views are derived state** — never enumerate them statically. Query `sqlite_master` instead:

```ts
const views = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'view' AND name LIKE 'v_%'")
  .all();
for (const { name } of views) db.exec(`DROP VIEW IF EXISTS "${name}"`);
```

Then recreate the current set from code. Drop-and-recreate is cheap and idempotent; views hold no data.

### 3. Never blanket-catch ALTER errors

The additive-column pattern (`try { ALTER TABLE ADD COLUMN } catch {}`) is common but a blanket `catch {}` swallows **every** error — including the broken-view error above, which is how the corruption stayed invisible for weeks. Only swallow the one error you expect:

```ts
try {
  db.exec(`ALTER TABLE t ADD COLUMN c TEXT`);
} catch (err) {
  if (!String(err).includes("duplicate column name")) throw err;
}
```

This is the `=== NO SILENT FAILURES ===` rule in practice — see [[1_controller/standards/no-go-rules]].

---

## The Recipe

Migration ordering that makes stale views impossible:

1. **Drop all views dynamically** (from `sqlite_master`) at the very start of migration, before any `ALTER TABLE`.
2. Run additive ALTERs and structural migrations — narrow catch, rethrow anything but "duplicate column name".
3. **Recreate views last**, from the current code-defined schema.

And write a regression test that seeds a DB in the historical broken state (orphan views referencing dropped columns + pre-migration tables) and asserts migration completes.

## Related lesson: env-pinned DB paths

Side finding from the same incident: a long-lived watcher process (tsx watch) kept a stale `DB_PATH=e2e-test.db` in its shell environment — days of writes went to the test DB while fresh boots used the production default (split-brain). After changing env-dependent config, kill and restart long-lived dev processes; they never re-read the environment.
