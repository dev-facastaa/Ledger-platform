# Test Finding Categories (praxis-trial)

The canonical category enum for `praxis-trial` findings. All `trial_findings[]` in `praxis-inspect` envelopes and `findings[]` in `praxis-trial` audit envelopes MUST use these exact strings.

| Category | Description |
|----------|-------------|
| `wrong-level` | Test lives at the wrong pyramid level (e.g., unit test covering infrastructure; e2e covering unit logic) |
| `over-mocking` | Test stubs/mocks collaborators that could be tested with state-based assertions (violates Detroit school) |
| `brittle` | Test breaks on unrelated refactors (over-specified interactions, fragile selectors, or implementation-coupled assertions) |
| `naming` | Test name does not reveal the scenario under test or uses non-ubiquitous-language terms |
| `coverage-gap` | A spec requirement or domain invariant has no corresponding test |
| `damp-violation` | Test uses DRY abstractions that hide setup, making the test's intent non-obvious (DAMP > DRY in tests) |
| `domain-bypass` | Test exercises framework adapters, getters/setters, or pure delegation with no domain logic |

## Authority References

| `principle_ref` | Authority |
|----------------|-----------|
| `Beck` | Kent Beck — TDD by Example; triangulation; red/green/refactor |
| `Cohn` | Mike Cohn — test pyramid (unit > integration > e2e) |
| `Vocke` | Ham Vocke — The Practical Test Pyramid; integration vs e2e discipline |
| `Metz` | Sandi Metz — what to test vs not to test; incoming queries, outgoing commands |
| `Evans` | Eric Evans — DDD; domain invariants; ubiquitous language in test names |
| `Vernon` | Vaughn Vernon — aggregate invariants as prime test subjects |
| `Fields` | Jay Fields — DAMP > DRY in tests |
| `Detroit` | Detroit (Classicist) school — state-based; preferred default |
| `London` | London (Mockist) school — interaction-based; only at true infrastructure seams |
