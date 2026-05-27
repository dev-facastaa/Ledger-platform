# ledger-platform

React 19 + TypeScript SPA for ledger and ERP management. Deployed on GitHub Pages.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **State**: Zustand (client) + TanStack React Query (server/async)
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React

## Commands

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # preview production build
```

## Project Structure

```
src/
  components/    # Reusable UI components
  pages/         # Route-level page components
  store/         # Zustand stores
  hooks/         # Custom React hooks
  types/         # TypeScript type definitions
  utils/         # Pure utility functions
```

## Praxis — Change Delivery Pipeline

Praxis is installed in `.claude/agents/`. It structures software changes through a typed DAG of specialized sub-agents backed by Anamnesis memory (MCP). Each change flows through phases; every phase persists its artifact to Anamnesis at `praxis/{change-name}/{phase}`.

**Project name for Anamnesis**: `ledger-platform`
**Artifact store mode**: `engram`
**Developer**: use your name when calling `recall_begin`

### Pipeline DAG

```
survey → [challenge?] → intent → specify ─┬─ design → [trial:design] → [observe:req] → breakdown → build → inspect → [warden?] → seal
                                           └─ (parallel) ───────────────────────────────────────────────────────────────────────────
```

| Phase | Agent | Trigger | Description |
|-------|-------|---------|-------------|
| 1 | `praxis-survey` | always | Reads codebase; opens Anamnesis session; produces `explore` artifact |
| 1b | `praxis-challenge` | optional | DDD adversarial critique — invoke when change touches domain model |
| 2 | `praxis-intent` | always | Declares intent, scope, risks, rollback, success criteria |
| 3a | `praxis-specify` | always | Delta behavioral specs (RFC 2119 + Given/When/Then) |
| 3b | `praxis-design` | always | Technical blueprint (decisions, data flow, file table) |
| 3c | `praxis-trial` (design) | when design flags it | Test pyramid plan |
| 3d | `praxis-observe` (requirements) | when design flags it | Observability requirements |
| 4 | `praxis-breakdown` | always | Ordered task checklist (DAG, ≤530 words) |
| 5 | `praxis-build` | always | Writes code; marks tasks complete; persists `apply-progress` |
| 6 | `praxis-inspect` | always | Runs build+tests; compliance matrix; fans out to trial+observe |
| 6.5 | `praxis-warden` | conditional | Security audit — invoked when change touches auth, PII, or deps |
| 7 | `praxis-seal` | always | Records lineage; closes Anamnesis session |

### Triggering Praxis

Start any change by invoking `praxis-survey` with:

```xml
<inputs>
  <change_name>kebab-case-change-name</change_name>
  <project>ledger-platform</project>
  <developer>your-name</developer>
  <intent>plain-english description of what you want to build or fix</intent>
</inputs>
```

The orchestrator (you or Claude Code) chains subsequent phases based on each envelope's `next_recommended` field.

### Shared Conventions

All Praxis agents reference these shared files:

- `.claude/_shared/mcp-contract.md` — allowed Anamnesis verbs + forbidden vocabulary
- `.claude/_shared/severity.md` — severity enum `{critical, major, minor, info}` + verdict mapping
- `.claude/_shared/test-finding-categories.md` — `praxis-trial` finding category enum

### Artifact Persistence

Artifacts are stored in Anamnesis at `praxis/{change-name}/{phase}` (topic_key format). To retrieve any artifact:

```
summon(query: "praxis/{change-name}/{phase}", project: "ledger-platform")
→ unfold(memory_id) for full content
```

See `openspec/config.yaml` for project-specific rules per phase (proposal constraints, spec style, build command, etc.).
