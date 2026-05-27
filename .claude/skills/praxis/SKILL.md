---
name: praxis
description: "Trigger the Praxis SDD pipeline for a software change in ledger-platform. Pass a plain-English description of the change as argument. Orchestrates all phases: survey → intent → specify/design → breakdown → build → inspect → seal."
---

# Praxis Pipeline Orchestrator

## Purpose

This skill launches the full **Praxis SDD pipeline** for `ledger-platform`. Praxis frames software work as construction — survey terrain, declare intent, write specs, design, break down tasks, build, inspect, and seal.

## How to invoke

```
/praxis <description of the change>
```

Examples:
- `/praxis add currency selector to the Ledger module`
- `/praxis fix the ERP table sorting bug on the dashboard`
- `/praxis refactor Zustand store to separate ledger and ERP slices`

## What I will do

Given `$ARGUMENTS` as the change description:

1. **Derive change name** — convert `$ARGUMENTS` to a kebab-case slug (e.g. `"add currency selector"` → `add-currency-selector`).

2. **Launch praxis-survey** — spawn the `praxis-survey` sub-agent with:

```xml
<inputs>
  <change_name>{kebab-case-slug}</change_name>
  <project>ledger-platform</project>
  <developer>Fabio Castaneda</developer>
  <intent>{$ARGUMENTS}</intent>
</inputs>
```

3. **Chain phases** — read `next_recommended` from each envelope and spawn the indicated agent, passing relevant artifacts as context. Phases run in this DAG order:

```
survey → [challenge?] → intent → specify ─┬─ design → breakdown → build → inspect → [warden?] → seal
                                           └─ (parallel with design) ──────────────────────────────
```

4. **Stop points** — I will pause and ask for your confirmation before:
   - `praxis-build` (about to write code)
   - `praxis-seal` (about to close the session)

   Type **continue** or **skip** to control each phase.

## Phase reference

| Phase | Agent | Role |
|-------|-------|------|
| 1 | `praxis-survey` | Read codebase; open Anamnesis session; produce exploration artifact |
| 1b | `praxis-challenge` | Optional — adversarial DDD critique (auto-triggered if survey flags domain model changes) |
| 2 | `praxis-intent` | Declare scope, risks, rollback plan, success criteria |
| 3a | `praxis-specify` | Delta behavioral specs (Given/When/Then, RFC 2119) |
| 3b | `praxis-design` | Technical blueprint: decisions, data flow, file table |
| 4 | `praxis-breakdown` | Ordered task checklist (≤530 words, DAG) |
| 5 | `praxis-build` | Write code; mark tasks complete |
| 6 | `praxis-inspect` | Run build + tests; compliance matrix; fan out to `praxis-trial` + `praxis-observe` |
| 6.5 | `praxis-warden` | Security audit (auto-triggered if change touches auth, PII, or deps) |
| 7 | `praxis-seal` | Record lineage; close Anamnesis session |

## Resuming a stopped pipeline

If you already ran `survey` and want to pick up from a later phase, tell me:

```
Continue praxis pipeline for change-name from praxis-intent
```

I will summon the prior artifact from Anamnesis and pass it as context to the correct agent.

## Requirements

- `$ARGUMENTS` must contain a non-empty change description.
- If `$ARGUMENTS` is empty, I will ask: *"What change do you want to build? Describe it in one sentence."*
- The Anamnesis MCP server must be reachable (configured in `.claude/settings.json`).
