# Skill: Surge Safeguard Check

```yaml
name: surge-safeguard-check
description: Re-run the viral-surge safeguard policy gate against an existing Zrodinger clip draft json and report pass/flags. Read-only — does not write artifacts, records nothing, publishes nothing.
triggers:
  - "/surge-safeguard-check <draftJsonPath>"
  - Re-validating a draft during review or after edits
ecosystems: [surge]
```

---

## Scope

- Pure check. Loads a `ClipDraft` json, runs the SAME gate the engine uses, prints the `SafeguardReport`. No artifact write, no approval row, no task change, no publish.

## Inputs

- `D:\VFXellence-LTD\.canon\1_controller\standards\polymath-business\safeguards\viral-safeguards.md` — the policy this gate encodes (7 hard bans, quality floor, FTC + AI disclosure). Read it so you can explain any flag in plain language.

## Procedure

1. With `cwd = D:\VFXellence-LTD\polymath\packages\agents`, run a one-liner against the tested function:
   ```
   pnpm -C D:\VFXellence-LTD\polymath\packages\agents exec node --import tsx -e "import('./src/safeguard.js').then(async m=>{const fs=await import('node:fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(JSON.stringify(m.runSafeguardCheck(d),null,2));})" <draftJsonPath>
   ```
2. Read the printed `{pass, flags, checkedAt}`. For each flag, cite the policy section it maps to (e.g. `hard-ban-2-hate-speech` → POLICY §"Hard Bans 2").
3. Report a one-line verdict + the flag list. HALT. No publish, no social accounts, no render.

## Dry-run verification

Run against a clean sample draft → `pass:true, flags:[]`. Run against a draft whose caption has an affiliate CTA but no `#ad` → a single `ftc-affiliate-disclosure` flag at `flag` severity with `pass:true`. Run against a draft claiming "guaranteed 300% return" → a `hard-ban-7` block flag with `pass:false`.

## Related

- `src/safeguard.ts` — the tested gate this skill calls
- `surge-generate` — full generation loop that runs this gate inline
