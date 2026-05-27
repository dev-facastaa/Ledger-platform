# Severity Enum (Canonical)

The authoritative severity enum for all Praxis agents. Agents MUST NOT redefine these values or invent local vocabularies.

## Values

| Value | Meaning |
|-------|---------|
| `critical` | Blocker — stops the pipeline; seal forbidden |
| `major` | Warning — documented, does not block seal |
| `minor` | Note — enumerated but no verdict impact |
| `info` | Informational — enumerated but no verdict impact |

## Verdict Mapping

Apply this mapping mechanically across ALL finding arrays (inspect + trial + observe). Use MAX severity:

| MAX severity in any finding array | Verdict |
|-----------------------------------|---------|
| `critical` | **FAIL** |
| `major` | **PASS_WITH_WARNINGS** |
| `minor` or `info` only | **PASS** |

Rules:
- Any single `critical` finding in ANY array (inspect, trial, observe, warden) → verdict **FAIL**
- Any `major` (with no `critical`) in any array → **PASS_WITH_WARNINGS**
- Only `minor` and/or `info` → **PASS**
- `minor` and `info` MUST be enumerated — they never alter the verdict but cannot be silently dropped

## Seal Gate

`praxis-seal` checks both `praxis-inspect` (verify-report) and, conditionally, `praxis-warden` (security-audit):
- Any `critical` from either → **BLOCKED** (seal forbidden, `recall_end` not called)
- `major` or below → proceed to seal
