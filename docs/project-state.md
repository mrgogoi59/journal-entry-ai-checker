# Accywise Project State

## Current purpose

Accywise is a rule-based accountancy learning and practice platform for commerce students. It teaches concepts through lesson pages and lets students practice or use tools for journal entries, ledger posting, trial balance, final accounts, and bank reconciliation.

The live app now has two layers:

- the established beginner/runtime layer under `app/` and `lib/`
- a newer hidden `lib/accounting-core/` foundation for advanced partnership/company journal work

The current student-facing app is still mostly beginner-first, while advanced practice is exposed only through a separate beta page.

## Current student-facing routes

Main routes currently present in `app/`:

- `/`
- `/learn`
- `/practice`
- `/practice/advanced`
- `/practice/ledger`
- `/practice/trial-balance`
- `/practice/final-accounts`
- `/tools`
- `/journal-entry-solver`
- `/ledger`
- `/trial-balance`
- `/final-accounts`
- `/bank-reconciliation`
- `/history`
- `/progress`
- `/supported-transactions`
- `/how-to-use`

Notes:

- `/dashboard` currently redirects to `/learn`.
- Lesson routes live under `/learn/<lesson-slug>`.
- API routes currently present are:
  - `POST /api/check-entry`
  - `POST /api/generate-practice-question`
  - `POST /api/journal-entry-solver`

## Current learning content

Current tracked lesson count: `37`

Lesson progress is stored with localStorage key:

- `accywise_lesson_progress_v1`

Major lesson groups currently covered:

- Foundations
- Journal Entries
- Cash Book / Bank Reconciliation / Subsidiary Books / GST
- Ledger / Trial Balance / Rectification / Bills / Depreciation
- Final Accounts
- Incomplete Records / Not-for-Profit
- Partnership Accounts
- Company Accounts
- Financial Statement Analysis
- Computerised Accounting

Important lesson/content files:

- `lib/learning-content.ts`
- `lib/lesson-progress.ts`
- `app/learn/page.tsx`
- `app/learn/LessonReader.tsx`

## Current engines and tools

Student-facing runtime tools/pages:

- Journal Entry Checker on `/tools`
- Journal Entry Explainer on `/journal-entry-solver`
- Beginner topic-wise Journal Entry Practice on `/practice`
- Ledger tool on `/ledger`
- Ledger Practice on `/practice/ledger`
- Trial Balance tool on `/trial-balance`
- Trial Balance Practice on `/practice/trial-balance`
- Final Accounts tool on `/final-accounts`
- Final Accounts Practice on `/practice/final-accounts`
- Bank Reconciliation Statement tool on `/bank-reconciliation`
- History on `/history`
- Progress on `/progress`

Established runtime engine files:

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

Practice/history support files:

- `lib/practice-question-generator.ts`
- `lib/ledger-practice-generator.ts`
- `lib/trial-balance-practice-generator.ts`
- `lib/final-accounts-practice-generator.ts`
- `lib/attempt-history.ts`
- `lib/scoring-engine.ts`
- `lib/explanation-generator.ts`

History is currently stored with localStorage key:

- `accywise_attempt_history_v1`

## Current hidden accounting-core foundation

`lib/accounting-core/` is a reusable advanced-accounting foundation that is partly exposed through the advanced beta page, but it is still separate from the older beginner runtime.

Core pieces currently present:

- shared accounting-core types in `lib/accounting-core/types.ts`
- journal adapters in `lib/accounting-core/adapters/journal-entry-adapters.ts`
- advanced journal text parser adapter in `lib/accounting-core/adapters/advanced-journal-text-parser-adapter.ts`
- journal text serializer in `lib/accounting-core/serializers/journal-text-serializer.ts`
- advanced scenario registry in `lib/accounting-core/scenarios/advanced-scenario-registry.ts`
- company journal generators in `lib/accounting-core/generators/company-journal-generator.ts`
- partnership journal generators in `lib/accounting-core/generators/partnership-journal-generator.ts`
- advanced practice question bank in `lib/accounting-core/practice/advanced-practice-question-generator.ts`
- advanced answer checker in `lib/accounting-core/checkers/advanced-journal-answer-checker.ts`
- advanced result builder in `lib/accounting-core/practice/advanced-practice-result-builder.ts`
- barrel exports in `lib/accounting-core/index.ts`

Current hidden/foundation counts observed from source:

- `13` advanced practice questions in the question bank
- `14` advanced scenarios in the scenario registry

Important boundary:

- older beginner checker/parser/classifier flows do not import this foundation
- the advanced beta page imports accounting-core directly and stays separate from beginner practice

## Current Advanced Practice Beta state

Current route:

- `/practice/advanced`

Current behavior:

- exists and is student-facing
- uses a client page with direct imports from `@/lib/accounting-core`
- supports `Company Accounts`, `Partnership Accounts`, and `Mixed`
- mixed mode is deterministic because it cycles through a fixed question bank
- parses free-text journal answers
- checks entries against expected advanced journal entries
- builds rule-based result feedback
- can show the correct entry
- includes hints/common mistakes/result actions

Current scope:

- selected Company and Partnership journal-entry cases only
- current question bank includes cases such as share issue at premium, first call due, calls in arrears, calls in advance, share forfeiture, debenture issue at discount, partner salary, interest on capital, interest on drawings, goodwill, revaluation, and realisation

Current non-features:

- no API route for advanced practice
- no localStorage history saving for advanced practice
- no progress/weak-area integration for advanced practice
- no report generation
- no ledger/trial balance impact preview inside `/practice/advanced`
- no custom student-written advanced transaction generation flow

## What is hidden/test-only vs live

Live/student-facing now:

- beginner checker/practice/explainer routes
- ledger/trial balance/final accounts/BRS tools
- workflow practice pages
- advanced practice beta route `/practice/advanced`

Still hidden or mostly foundation-oriented:

- advanced scenario registry as a reusable source set
- accounting-core adapters/serializers/checkers/generators outside the advanced beta page
- company and partnership report-template fixtures in `tests/fixtures/`
- topic-pack fixtures in `tests/fixtures/`
- compatibility proofs that advanced entries flow through existing ledger/trial balance logic

The advanced foundation is real code, but much of the topic-pack/report-template work is still metadata/test-oriented rather than runtime product behavior.

## Current test status

Latest verification run for this documentation update:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Observed status:

- `37` test files passed
- `2106` tests passed
- typecheck passed
- lint passed
- build passed when re-run outside the sandbox

Verification note:

- the first sandboxed `npm run build` failed with a Turbopack port-binding restriction, not a repo code error
- the re-run outside the sandbox completed successfully
- future prompts should treat this as an environment caveat, not a current app regression

## Known limitations

- Advanced Practice has no history/progress saving yet.
- Advanced Practice has no ledger/trial-balance impact preview yet.
- Advanced Practice has no company report generation yet.
- Advanced Practice has no partnership report generation yet.
- Advanced Practice has no custom advanced transaction input yet.
- Topic packs and report templates are still partly metadata/test-only.
- Existing beginner `/practice` remains separate from advanced practice and should stay separate unless explicitly redesigned.
- History and progress are browser-local only; there is no login or cloud sync.
- Runtime app behavior is still rule-based and local; there is no external AI, database, or payments layer.

## Files and areas to be careful with

- `next-env.d.ts` is generated and should usually be reverted if changed accidentally.
- Do not change localStorage keys casually:
  - `accywise_lesson_progress_v1`
  - `accywise_attempt_history_v1`
- Do not refactor the existing beginner engines unless explicitly requested.
- Do not mix advanced partnership/company questions into the current beginner `/practice` flow by default.
- Treat `lib/accounting-core/` as a compatibility/foundation layer unless a task is specifically about advanced practice.
- Preserve current route names unless a task explicitly asks for route changes.
