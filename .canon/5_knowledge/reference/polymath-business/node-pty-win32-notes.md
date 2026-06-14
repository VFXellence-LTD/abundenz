# node-pty on win32 — Installation and ABI Notes

**Captured:** 2026-06-14 during Plan 3 (PTY engine driver)

## Summary

`node-pty@1.1.0` installs cleanly on **Windows 11 + Node 20/22 + pnpm** without a manual rebuild step. The package ships prebuilt binaries via `@homebridge/node-pty-prebuilt-multiarch` and selects the correct ABI automatically.

## Installation

```powershell
# In the server directory:
pnpm add node-pty@^1.0.0
# pnpm install handles the postinstall/prebuild step automatically.
# No pnpm rebuild node-pty required under normal circumstances.
```

## When a manual rebuild IS needed

1. If the resolved Node version changes (e.g., upgrading Node 20 → 22).
2. If a prebuilt binary is missing for your exact Node ABI (rare with node-pty 1.x).

In those cases:
```powershell
pnpm --dir <server-dir> rebuild node-pty
# Requires node-gyp + Python + MSVC (Visual Studio Build Tools) on win32.
```

## Test-mocking pattern (no native spawn in unit tests)

All unit tests that exercise `PtyService` or `SessionService` use `vi.mock("node-pty")` with a `FakePty extends EventEmitter`. The real native binary is never loaded in CI. Only the integration smoke (`MC_PTY_SMOKE=1`) spawns a real shell.

```ts
vi.mock("node-pty", () => ({
  spawn: vi.fn(() => new FakePty()),
}));
```

## Platform shell defaults

| Platform | Default shell | Notes |
|----------|--------------|-------|
| win32 | `powershell.exe` | Used by `terminal.ws.ts` for PTY spawns |
| linux/macOS | `$SHELL` or `/bin/sh` | Fallback for dev on non-Windows |

## Package versions in use

- `node-pty@1.1.0`
- `xterm@5.3.0` (client)
- `@xterm/addon-fit@0.10.0` (client)
- `@xterm/addon-web-links@0.11.0` (client)
