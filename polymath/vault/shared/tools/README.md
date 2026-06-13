# Shared Tools

Tools that more than one ecosystem uses, or general-purpose infrastructure that supports the controller.

## Distinction from `references/tools/`

- `references/tools/` — candidates being evaluated. Includes things you may never adopt.
- `shared/tools/` — tools actively in production use by at least one ecosystem.
- `ecosystems/{name}/agents/` — tool configuration specific to one ecosystem's agent.

When a tool moves from candidate → adopted, write a brief entry here. When a tool is retired, archive but don't delete (future-you wants the history).

## Active tools (none yet)

*Will populate as ecosystems launch.*

Example future entries:
- Claude API (used by Signal, Surge, Atelier, Conduit, controller)
- ElevenLabs (used by Surge voice synth)
- Meta.ai (used by Surge visual prompts)
- Make.com (used by controller, Signal scheduler)
- CapCut Pro (used by Signal, Surge video assembly)
- HyperFrames (used by Signal, Surge video rendering)
- beehiiv (used by Signal newsletter)

## Format for entries

`tool-name.md` with:
- What it is
- Which ecosystems use it and for what
- Cost
- Account / login owner
- Replacement plan if it dies (every tool dies eventually)
