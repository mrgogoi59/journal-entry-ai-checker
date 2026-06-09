# Accywise Next Steps

## Immediate recommended next step

Add a read-only Ledger and Trial Balance impact preview inside `/practice/advanced`.

Why this is the safest next step:

- the advanced beta already generates balanced expected journal entries
- existing ledger and trial balance engines are already proven compatible with advanced-style journal text through tests
- this adds visible student value without changing beginner checker/classifier/parser behavior
- it keeps advanced work inside the separate advanced route instead of mixing it into beginner practice

Recommended scope:

- show expected ledger impact after check
- show expected trial balance impact after check
- keep the preview read-only
- do not add persistence yet
- do not rewrite the beginner runtime

## After that

1. Add Advanced Practice history/progress integration.
2. Add topic-aware weak-area labels for advanced company and partnership attempts.
3. Add an advanced API boundary only if it is needed for cleaner separation or future server-side logic.
4. Add report-generation slices later, after advanced attempt tracking is stable.

## Suggested implementation order

1. Build a small adapter from advanced expected journal entries to the existing ledger/trial-balance input format.
2. Render ledger/trial-balance preview panels inside `/practice/advanced` after answer check.
3. Add test coverage proving the preview stays deterministic for company, partnership, and mixed questions.
4. Only then add browser history/progress integration for advanced attempts.

## Changes that are low risk right now

- UI-only additions inside `/practice/advanced`
- new tests for accounting-core and advanced practice
- new docs
- helper adapters that reuse existing ledger/trial-balance engines without changing their behavior

## Changes that are medium or high risk right now

- changing beginner `/practice` topic behavior
- routing advanced student answers through `transaction-classifier.ts`
- refactoring `entry-validator.ts`, `journal-parser.ts`, or `expected-entry-generator.ts` without a targeted reason
- changing history/progress storage formats
- converting test-only topic-pack/report-template metadata into runtime data without a clear boundary

## Later roadmap candidates

- Advanced Practice browser history integration
- Advanced Practice progress/weak-area integration
- Company report generation
- Partnership report generation
- Custom advanced transaction input
- richer advanced explanations and workings

## What future prompts should assume by default

- beginner runtime flows are stable and should be preserved
- advanced work should stay isolated under `/practice/advanced` unless explicitly broadened
- accounting-core is the preferred place for new advanced journal-entry logic
- docs and tests should be updated alongside any meaningful advanced-practice change
