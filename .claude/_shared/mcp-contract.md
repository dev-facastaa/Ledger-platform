# Anamnesis MCP Contract

## Allowed Persistence Verbs

The nine verbs that Praxis agents MUST use for all Anamnesis operations:

| Verb | Purpose |
|------|---------|
| `inscribe` | Persist a new or updated memory artifact |
| `summon` | Full-text search across memories |
| `evoke` | Load recent/warm context for a project |
| `unfold` | Retrieve full content of a memory by ID |
| `recall_begin` | Open a session (returns session_id) |
| `recall_end` | Close a session with a summary |
| `revise` | Update an existing memory |
| `recall_resume` | Resume an interrupted session |
| `forget` | Archive/remove a memory |

## Forbidden Vocabulary

The following identifiers from the legacy Engram client wrapper are **permanently banned** in every Praxis artifact, prompt, code comment, and commit message. `praxis-inspect` (AC#5) enforces this via literal grep at verification time:

- `mem_save`
- `mem_search`
- `mem_get_observation`
- `mem_update`
- Any other `mem_*` prefixed identifier

## Topic Key Convention (Consumer Projects)

All Praxis artifacts for consumer projects use:

```
praxis/{change-name}/{artifact-type}
```

| Artifact Type | Phase | Description |
|---------------|-------|-------------|
| `explore` | praxis-survey | Terrain survey / exploration report |
| `model-critique` | praxis-challenge | DDD adversarial critique (optional) |
| `proposal` | praxis-intent | Change intent and scope |
| `spec` | praxis-specify | Delta behavioral specifications |
| `design` | praxis-design | Technical blueprint |
| `test-pyramid` | praxis-trial (design) | Test pyramid plan |
| `observability-requirements` | praxis-observe (requirements) | Observability requirements |
| `tasks` | praxis-breakdown | Ordered task checklist |
| `apply-progress` | praxis-build | Implementation progress |
| `test-quality-audit` | praxis-trial (audit) | Test quality findings |
| `observability-audit` | praxis-observe (audit) | Observability audit findings |
| `security-audit` | praxis-warden | Security audit findings |
| `verify-report` | praxis-inspect | Compliance matrix and verdict |
| `archive-report` | praxis-seal | Lineage table and session close |

## summon + unfold Pattern (Mandatory)

`summon` returns previews truncated at 500 characters. **Building any artifact from a preview is forbidden.** Always follow with `unfold`:

```
1. summon(query: "praxis/{change}/{type}", project: "{project}") → {id, preview}
2. unfold(memory_id: id) → full content
```

Run parallel `summon` calls, then parallel `unfold` calls for speed.
