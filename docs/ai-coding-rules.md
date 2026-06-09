# Accywise AI Coding Rules

## Read this first

This repo is an educational, rule-based accountancy app. Default to small, test-backed changes that preserve current student behavior.

Unless explicitly requested otherwise:

- do not change runtime behavior unnecessarily
- do not add routes casually
- do not rename localStorage keys
- do not rewrite stable beginner engines
- do not mix advanced beta flows into beginner practice

## Product guardrails

- Keep Accywise beginner-friendly and commerce-student focused.
- Preserve the separation between:
  - beginner runtime flows in `app/` and `lib/`
  - advanced accounting-core work in `lib/accounting-core/`
- Treat `/practice` as beginner topic-wise journal practice.
- Treat `/practice/advanced` as the separate beta surface for advanced company/partnership journal work.
- Do not add database, auth, payments, or external AI unless explicitly requested.

## Safe places to work

Usually safe:

- `docs/`
- tests under `tests/`
- isolated UI work on `/practice/advanced`
- new accounting-core helpers for advanced flows
- presentation-only improvements that do not alter existing accounting logic

Use extra caution in:

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
- `lib/lesson-progress.ts`
- `lib/attempt-history.ts`

## Storage and persistence rules

Do not change these localStorage keys without explicit approval and migration planning:

- `accywise_lesson_progress_v1`
- `accywise_attempt_history_v1`

Current assumptions:

- lesson progress is browser-local
- attempt history/progress is browser-local
- advanced practice does not currently save to history/progress

## Advanced practice rules

When working on advanced practice:

- prefer `lib/accounting-core/` for new advanced journal-entry logic
- keep beginner `/practice` separate
- keep advanced question selection deterministic unless a task explicitly asks for randomness
- prefer read-only previews and additive UI before adding persistence
- do not send advanced answers through the beginner classifier unless explicitly redesigning that boundary

## Testing rules

For meaningful changes, run the relevant checks:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

If a command cannot be run, say so clearly in the final summary.

When editing files, watch for generated noise:

- if `next-env.d.ts` changes unintentionally, revert it before finishing

## Documentation rules for future prompts

Before making non-trivial changes, read:

- `docs/project-state.md`
- `docs/next-steps.md`
- `docs/ai-coding-rules.md`

Use the repository as source of truth over older chat history. If code and docs disagree, update the docs to match the code as part of the same task when appropriate.
