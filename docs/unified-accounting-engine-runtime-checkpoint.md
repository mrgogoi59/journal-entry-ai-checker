# Unified Accounting Engine Runtime Checkpoint

## 1. Purpose of this checkpoint

This checkpoint records what the unified accounting-core work has safely proven through Slices 1-8, before any runtime integration begins.

The main purpose is to prevent a premature rewrite of working app behavior. Accywise already has stable rule-based flows for Journal Entry Checker, Journal Entry Explainer, Practice, Ledger, Trial Balance, Final Accounts, and Bank Reconciliation. The unified accounting engine should grow as a compatibility layer first, then move into runtime only through small, controlled, test-backed steps.

This document is documentation only. It does not change app behavior.

## 2. Current safe foundation completed

The current foundation is intentionally conservative:

- Shared accounting-core types exist under `lib/accounting-core/`.
- Existing checker and parser journal shapes can be adapted into core `JournalEntry` structures.
- Core journal examples can be serialized in tests into the existing journal text format accepted by Ledger and Trial Balance.
- Partnership and Company Accounts topic-pack fixtures exist as test-only metadata and scenario examples.
- Partnership and Company report-template fixtures exist as test-only metadata and sample `AccountingReport` structures.
- Existing runtime engines remain unchanged and are not wired to topic packs.

The foundation proves representation and compatibility, not product behavior.

## 3. What Slices 1-8 proved

### Slice 1: shared accounting-core types

Added shared accounting-core type definitions for accounts, journal entries, ledger accounts, trial balance rows, reports, scenarios, check results, and topic packs.

The important point is that `JournalEntry` now has a reusable debit/credit line shape:

- account reference
- side
- amount
- topic
- optional metadata

No runtime app behavior changed.

### Slice 2: journal-entry adapters

Added adapters from existing `CorrectJournalEntry` and `ParsedJournalEntry` into the core `JournalEntry` format.

This proved that current checker/parser structures can be represented in the future core model without changing the checker, parser, validator, or solver runtime.

### Slice 3: Ledger compatibility tests

Added tests proving core journal examples can flow through the existing Ledger engine after conversion into the current journal-entry text input format.

The tests covered basic entries plus Partnership/Company-style account names such as:

- Revaluation
- Machinery
- Share Capital
- Securities Premium
- Calls in Arrears
- Share Forfeiture
- Debentures

### Slice 4: Trial Balance compatibility tests

Added tests proving core journal examples can flow through the existing Trial Balance engine after conversion into journal-entry text.

The tests confirmed that balanced Partnership/Company-style journal entries can produce balanced Trial Balance output when expressed as normal debit/credit journal text.

### Slice 5: Partnership and Company topic-pack fixtures

Added test-only topic-pack fixtures for:

- Partnership Accounts
- Company Accounts

These fixtures include metadata, supported account roles, scenario tags, report-template IDs, and sample scenario journal entries.

They are not runtime data.

### Slice 6: topic-pack fixtures through Ledger and Trial Balance

Added tests proving Partnership and Company scenario fixtures can be converted into journal-entry text and passed through existing `generateLedger()` and `generateTrialBalance()`.

This proved that the generic journal-ledger-trial-balance path can handle advanced account names when entries are already correctly formed and balanced.

### Slice 7: Partnership report-template fixtures

Added test-only Partnership report-template fixtures and sample `AccountingReport` structures for:

- Profit and Loss Appropriation Account
- Partner Capital Accounts
- Partner Current Accounts
- Revaluation Account
- Realisation Account
- Bank/Cash Settlement

These are metadata/sample-report structures only. They do not generate reports.

### Slice 8: Company Accounts report-template fixtures

Added test-only Company Accounts report-template fixtures and sample `AccountingReport` structures for:

- Share Capital Schedule
- Calls in Arrears and Calls in Advance Working
- Share Forfeiture Working
- Capital Reserve Working
- Debenture Schedule
- Company Balance Sheet Notes

These are metadata/sample-report structures only. They do not generate reports.

All Slices 1-8 remain type-level, documentation-level, fixture-level, or test-only. No runtime app behavior has changed.

## 4. What is still test-only

The following are still test-only:

- Partnership topic-pack fixture data.
- Company Accounts topic-pack fixture data.
- Partnership scenario fixtures.
- Company Accounts scenario fixtures.
- Partnership report-template fixtures.
- Company report-template fixtures.
- Sample `AccountingReport` structures for Partnership and Company Accounts.
- Core journal-to-journal-text helper logic currently repeated inside tests.
- Compatibility proof that advanced entries can flow into Ledger and Trial Balance.

None of these are imported by app pages, API routes, or existing runtime engines.

## 5. Current runtime engines that remain unchanged

The existing runtime engines remain the source of current app behavior:

- `lib/transaction-classifier.ts`
- `lib/accounting-rules.ts`
- `lib/expected-entry-generator.ts`
- `lib/journal-parser.ts`
- `lib/entry-validator.ts`
- `lib/journal-entry-solver.ts`
- `lib/ledger-engine.ts`
- `lib/trial-balance-engine.ts`
- `lib/final-accounts-engine.ts`
- `lib/bank-reconciliation-engine.ts`

Current runtime flow is still:

- Checker and Practice use transaction classification, expected-entry generation, parsing, validation, scoring, and explanation.
- Explainer uses classification and expected-entry generation to build rule-based explanations.
- Ledger accepts journal-entry text and posts it account-wise.
- Trial Balance calls Ledger and converts balances into debit/credit rows.
- Final Accounts parses trial balance and adjustments directly through its own engine.
- BRS remains a separate reconciliation engine.

The accounting-core layer is not wired into these runtime flows.

## 6. What can now be safely reused

The safest reusable pieces are:

- Core `JournalEntry` as a shared representation for debit/credit facts.
- Core `AccountRef` roles and classes for advanced account names.
- Existing adapters from current checker/parser entries into core journal entries.
- Existing `generateLedger()` behavior for generic debit/credit posting.
- Existing `generateTrialBalance()` behavior for balanced journal entries.
- Topic-pack metadata as a future design model.
- Report-template metadata as a future design model.

What has been proven:

- Existing Ledger can accept advanced Partnership/Company account names if they are expressed as normal debit/credit journal text.
- Existing Trial Balance can balance Partnership/Company-style entries if journal entries are balanced.
- The shared accounting-core `JournalEntry` shape can represent basic accounting, GST, Partnership entries, Company share capital entries, forfeiture/reissue entries, and debenture entries.
- Topic packs can represent future Partnership and Company metadata.
- Report templates can be represented as metadata/sample reports.

## 7. What should not be wired yet

Do not wire the following into live runtime yet:

- Partnership topic packs.
- Company Accounts topic packs.
- Partnership report templates.
- Company report templates.
- Partnership report generation.
- Company report generation.
- Advanced Partnership/Company scenarios into beginner random practice.
- Partnership/Company entries into the existing free-text Checker without a controlled parser/classifier strategy.
- Advanced topics into History/Progress without planned topic keys and weak-area labels.

What has not been proven:

- Runtime UI does not yet use accounting-core.
- Existing practice generators do not yet use topic packs.
- Existing checker does not yet validate Partnership/Company entries directly from student input.
- Partnership-specific reports are not generated.
- Company-specific reports are not generated.
- Final Accounts engine is not yet unified with Partnership/Company reports.
- Topic-pack fixtures are not runtime data.
- No student-facing Partnership/Company practice UI exists.

## 8. Runtime integration options

### Option A: Wire accounting-core into existing Journal Entry Checker

Risk: medium/high.

This would touch parser/checker behavior and could affect many beginner cases that already work. It should not be the first runtime integration.

Recommendation: not first.

### Option B: Add a core journal text serializer used by tests only

Risk: low.

The conversion already exists as repeated test helper logic. A controlled serializer could standardize conversion from core `JournalEntry[]` to the journal text format accepted by existing Ledger and Trial Balance.

Recommendation: safe as the next small slice if it remains unused by runtime.

### Option C: Add advanced journal-entry scenario generator for Partnership/Company, hidden from UI

Risk: low/medium.

This can prepare selected advanced cases without exposing them to students. It should come after one more serializer/guard slice.

Recommendation: safe after one more adapter/core guard slice.

### Option D: Add an Advanced Practice Lab UI

Risk: medium/high.

This exposes unfinished advanced behavior to students and could confuse the current beginner flow.

Recommendation: too early.

### Option E: Create runtime-safe topic-pack registry from test fixtures

Risk: medium.

Turning test fixtures into product data needs stronger boundaries, versioning, and naming guarantees.

Recommendation: do later after hardening.

### Option F: Add Partnership/Company report generation

Risk: high.

Reports are topic-specific and require more than journal-entry balance. They need layout rules, educational wording, edge-case handling, and clear unsupported boundaries.

Recommendation: not yet.

## 9. Recommended safest first runtime integration path

Do not wire Partnership or Company Accounts into live runtime immediately.

The safest next step is one more safety slice:

### Slice 9A: production-safe core journal text serializer, tests only

Create a small accounting-core serializer/converter that converts core `JournalEntry[]` into the journal-entry text format accepted by existing `generateLedger()` and `generateTrialBalance()`.

Requirements:

- Strong tests.
- No app page imports.
- No API imports.
- No runtime engine imports unless deliberately added in a later slice.
- No behavior change.

If adding a production utility feels like runtime surface area, keep it unused by app runtime and import it only from tests until the next decision point.

After that:

- Slice 10 can introduce a hidden/test-only advanced scenario registry.
- Slice 11 can add controlled Company journal-entry generation tests.
- Slice 12 can add controlled Partnership journal-entry generation tests.
- Slice 13 can consider limited UI exposure.

The safest real student-facing runtime feature should be Advanced Journal Entry Practice for selected Partnership and Company cases, not report generation.

Reason: journal entry to Ledger to Trial Balance compatibility is already proven in tests. Reports are more topic-specific and should come later.

## 10. Suggested next 5 slices

### Slice 9A: extract shared core journal text serializer

Goal: convert core `JournalEntry[]` to journal text accepted by existing Ledger and Trial Balance engines.

Scope:

- Add serializer utility with tests.
- Keep unused by runtime.
- Replace duplicated test helper logic only if that stays test-safe.

Risk: low if unused by runtime.

### Slice 10: add hidden advanced scenario registry

Goal: move selected Partnership/Company scenarios toward a runtime-safe registry shape while preserving test coverage.

Scope:

- Keep hidden from UI.
- Keep deterministic.
- Avoid random beginner practice integration.
- Keep topic packs test-only unless deliberately promoted.

Risk: low/medium.

### Slice 11: add Company Accounts journal-entry generator, tests only

Goal: support selected controlled Company cases behind tests.

Initial cases:

- share issue at premium
- first call due
- calls in arrears
- forfeiture
- reissue
- debenture issue

Risk: medium if runtime generator is introduced, so keep hidden/test-only first.

### Slice 12: add Partnership journal-entry generator, tests only

Goal: support selected controlled Partnership cases behind tests.

Initial cases:

- partner salary
- interest on capital
- interest on drawings
- revaluation
- goodwill adjustment
- realisation asset transfer

Risk: medium if runtime generator is introduced, so keep hidden/test-only first.

### Slice 13: add limited student-facing Advanced Practice Beta

Goal: expose only selected deterministic advanced journal-entry practice cases.

Scope:

- Keep separate from beginner practice.
- Clearly label as beta/advanced.
- Do not expose report generation yet.
- Keep supported/unsupported messaging explicit.

Risk: medium.

## 11. Risk controls before runtime wiring

Before any runtime wiring:

- Tests must stay green.
- Existing checker behavior must not change.
- Existing beginner practice must not become more complex.
- Advanced entries must be deterministic.
- Advanced topics must not be mixed into beginner random practice.
- UI must clearly separate Beginner from Advanced/Partnership/Company.
- Do not claim full Partnership/Company final reports until report generation exists.
- History/progress topic keys must be planned before runtime advanced practice.
- Unsupported cases must be explained clearly.
- Runtime exposure should begin behind a small controlled path.
- No broad free-text Partnership/Company classifier should be added before deterministic cases are stable.
- No topic-pack fixture should become runtime product data without a deliberate registry design.

## 12. Definition of done before Partnership/Company practice UI

Before adding a Partnership/Company practice UI, these should be true:

- Core journal text serializer exists and is tested.
- Advanced scenario registry is deterministic and tested.
- Company journal-entry generator handles selected cases with tests.
- Partnership journal-entry generator handles selected cases with tests.
- Existing beginner Checker, Practice, Explainer, Ledger, Trial Balance, Final Accounts, and BRS tests remain green.
- Supported/unsupported copy is updated for advanced beta scope.
- History/progress topic keys are defined for advanced cases.
- UI wording clearly says advanced practice is limited and controlled.
- No report generation claims are shown unless report generation exists.

## 13. Clear recommendation

Do not wire Partnership/Company into the live student UI immediately.

Next best step:

Create one more low-risk core utility/test slice that standardizes conversion from core `JournalEntry[]` to existing journal-entry text. Then add hidden/test-only advanced scenario generators.

The first student-facing runtime feature should be:

Advanced Journal Entry Practice for selected Partnership and Company cases.

Not:

- Partnership final reports.
- Company final reports.
- Broad Partnership/Company free-text checker support.
- A new advanced dashboard or large UI area.

Reason:

Journal to Ledger to Trial Balance compatibility is already proven. Report generation is topic-specific and should be implemented only after the journal/ledger/trial-balance path is stable.

## Known limitations

- This is documentation only.
- No runtime integration was added.
- Topic packs remain test-only.
- Partnership/Company reports are not generated yet.
- Partnership/Company practice UI is not implemented yet.
- The current compatibility path depends on journal-entry text accepted by existing Ledger and Trial Balance engines.
- Existing Ledger still has its beta limit on journal entry blocks.
