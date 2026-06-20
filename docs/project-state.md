# AccyWise AI Project State

## Current purpose

AccyWise AI is a rule-based accountancy learning and practice platform for commerce students. It teaches concepts through lesson pages and lets students practice or use tools for journal entries, ledger posting, trial balance, final accounts, and bank reconciliation.

Public-facing brand note:

- the public/user-facing platform name is standardized as `AccyWise AI`
- the domain remains `accywise.in` when referring to the website domain/link
- internal repo, package, route, folder, helper, and test names were not renamed by this branding/copy-only update
- no logo image asset was added or changed by this brand-name standardization

The live app now has two layers:

- the established beginner/runtime layer under `app/` and `lib/`
- a newer hidden `lib/accounting-core/` foundation for advanced partnership/company journal work

The current student-facing app is still mostly beginner-first, while advanced practice is exposed only through a separate beta page.

Target platform planning note:

- `docs/platform-blueprint.md` now records the target mobile-first AccyWise AI platform architecture.
- The blueprint now identifies the `Journal Entries Chapter` as the first gold-standard vertical slice.
- The `Trial Balance Chapter` is now the second validation chapter for multi-row accounting-table UX and checking.
- `docs/accountancy-concept-map.md` now records the Accountancy chapter scaffold and a detailed Journal Entries chapter concept map.
- The target platform has five primary sections: Dashboard, Chapters, Solver, Practice, and AI Assistant.
- The blueprint defines the chapter learning flow, solved illustration model, Practice It Yourself model, proposed route architecture, mobile-first UI principles, reusable content model, Journal Entries first slice, Trial Balance second validation slice, migration phases, and guardrails.
- Phase 3A of the redesign now exists as an internal preview-only shell at `/platform-preview` and `/platform-preview/chapters`.
- The Phase 3A preview includes the five-section navigation, desktop sidebar, mobile header/menu, static Dashboard preview, static Chapters preview, and restrained visual design system for founder review.
- Phase 3B now adds an isolated Journal Entries chapter-learning preview at `/platform-preview/chapters/journal-entries`.
- The Phase 3B preview demonstrates the intended chapter flow: introduction, ordered outline, concept explanation, journal format, simple example, two solved illustrations, Practice It Yourself blank-entry inputs, common mistakes, and preview-only continue controls.
- Phase 3B does not implement answer checking, solver/parser/checker calls, persistence, analytics events, or real progress tracking.
- Phase 3C now adds a reusable typed learning-platform content model in `lib/learning-platform/types.ts`.
- The Journal Entries preview content now lives in structured chapter data at `lib/learning-platform/chapters/journal-entries.ts`, and `/platform-preview/chapters/journal-entries` renders from that typed content definition.
- The first Journal Entry Practice It Yourself answer-input schema now exists for `Sold goods for cash ₹12,000`, with an internal balanced expected answer key of `Cash A/c Dr.` / `Sales A/c Cr.` and narration `Being goods sold for cash.`
- The Phase 3C expected answer is not rendered into the preview page or prefilled into student fields; the student editor remains blank and `Check Answer` remains disabled/preview-only.
- Phase 3C does not implement checking, scoring, validation, persistence, API routes, solver/parser/checker calls, analytics events, or migration into live routes.
- Phase 3D now adds the first isolated deterministic Practice It Yourself checker inside `/platform-preview/chapters/journal-entries`.
- The Phase 3D checker supports only the `Sold goods for cash ₹12,000` Journal Entry question and checks complete particulars, `Dr.`/`To` treatment, debit/credit placement, amounts, student-entered totals, narration, extra/missing rows, duplicate lines, and whether the entry balances.
- The Phase 3D expected answer key is kept in a server-side answer-key module, with checking and explicit correct-answer reveal routed through server actions instead of an API route.
- The Phase 3D editor preserves blank student fields initially, keeps inputs editable after checking, supports add/remove rows, totals, narration, retry/reset, accessible feedback, and explicit `Show Correct Answer` only after a check attempt.
- Phase 3D remains isolated and does not migrate the redesigned platform into live routes or change existing beginner practice, advanced practice, Journal Entry Explainer, parser/classifier/validator/checker logic, accounting engines, APIs, analytics, persistence, database/auth/payment/backend, AI behavior, or accounting calculations.
- Phase 3E now completes the safety audit and small UX refinement pass for that first isolated checker only.
- Phase 3E keeps the checker scoped to the single `Sold goods for cash ₹12,000` Practice It Yourself question and does not add a second question or migrate the preview into live routes.
- Phase 3E adds shared input limits for the preview checker: at most 6 journal rows, bounded particulars/L.F./amount/narration fields, safe malformed-submission handling, and guarded amount parsing that rejects unsafe negative, malformed, over-limit, or non-numeric values without returning `NaN` or misleading success.
- Phase 3E improves the isolated editor interaction state: blank attempts keep `Check Answer` disabled, checking shows a pending status, add row is capped at 6 rows, edits clear stale checked feedback/revealed answers, and reset/retry/reveal controls remain explicit.
- Phase 3E also improves accessibility/mobile safety with clearer instructions, `aria-busy`, focused feedback, accessible total/remove labels, focus-visible states, stacked mobile fields, and no wide table requirement on mobile.
- The Phase 3E answer-key boundary is now covered by focused tests: the client editor does not import the server answer-key module, the server action remains the answer-key boundary, the initial page does not render the expected answer, and correct-answer reveal remains explicit after an attempt.
- Phase 3E does not change the existing public app, beginner `/practice`, `/practice/advanced`, Journal Entry Explainer, parser/classifier/validator/checker logic, accounting-core engines, Ledger/Trial Balance/Final Accounts impact logic, analytics, APIs, persistence, database/auth/payment/backend, AI behavior, or accounting calculations.
- Phase 3F now adds the second deterministic Practice It Yourself checker question inside the isolated Journal Entries chapter preview:
  - `Paid salary by bank ₹8,000. Pass the journal entry.`
  - expected server-only answer: `Salary A/c Dr.` / `To Bank A/c`
  - narration: `Being salary paid by bank.`
- The supported chapter-checking scope is now exactly two questions:
  - `Sold goods for cash ₹12,000`
  - `Paid salary by bank ₹8,000`
- Phase 3F keeps expected answers in the server-only answer-key module, selected by question ID through server actions; the public chapter data and client props still do not contain expected answers.
- Phase 3F keeps the two Practice It Yourself editors independently stateful, with separate rows, totals, narration, pending state, feedback, reset state, and correct-answer reveal state.
- Phase 3F reuses the existing pure deterministic checker with small metadata-driven feedback generalization inside `lib/learning-platform`; it does not create a second checker or add broad question-bank generation.
- Phase 3F does not change live routes, beginner `/practice`, `/practice/advanced`, Journal Entry Explainer, parser/classifier/validator/checker behavior outside `lib/learning-platform`, accounting engines, Ledger/Trial Balance/Final Accounts impact logic, analytics, APIs, persistence, database/auth/payment/backend, OCR, AI behavior, or accounting calculations.
- The current public application remains unchanged; existing Home, Learn, Solver/Tools, Practice, Advanced Practice, Explainer, engines, APIs, analytics, storage, and accounting logic were not replaced or rewired.
- Founder visual review is required before integrating this shell into real routes or beginning the next phase.

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
- Vercel Web Analytics is enabled globally through the root app layout with `@vercel/analytics/next` for basic live-site traffic, page, referrer, location, and device reporting in Vercel.
- No custom events, PostHog, Google Analytics/GA4, Microsoft Clarity, database/login/product analytics, backend tracking, or AI analytics features were added.

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

Current learning-page UI note:

- topic learning pages no longer render the `What you will learn` card, so lessons flow from the header/objective directly into concept explanation
- the underlying `whatYouWillLearn` lesson data remains in `lib/learning-content.ts`; this was a UI-only rendering cleanup

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

Current Journal Entry Explainer note:

- `/journal-entry-solver` now includes narrow deterministic explanations for the six currently exposed `/practice/advanced` Partnership/Company scenarios:
  - Partnership partner capital contribution: `Bank A/c Dr.` / `Amit's Capital A/c Cr.`
  - Partnership drawings in cash: `Amit Drawings A/c Dr.` / `Cash A/c Cr.`
  - Partnership interest on capital: `Interest on Capital A/c Dr.` / partners' `Current A/c` credits
  - Company share application money received: `Bank A/c Dr.` / `Share Application A/c Cr.`
  - Company calls in advance received: `Bank A/c Dr.` / `Calls in Advance A/c Cr.`
  - Company debenture redemption at par: `Debentures A/c Dr.` / `Bank A/c Cr.`
- the explainer uses static, controlled response branches for these cases only; it does not add a broad Partnership/Company Accounts engine
- the partner-capital explainer preserves named partner capital accounts, so `Amit introduced capital...` explains `Amit's Capital A/c`, not generic `Capital A/c`
- the share-application explainer clarifies that application money is not final Share Capital yet
- the calls-in-advance explainer clarifies that call money was received before it became due
- the debenture explainer stays strictly simple redemption at par by bank and does not introduce wider debenture treatments
- this slice did not change beginner `/practice`, `/practice/advanced` exposure order/count, parser/classifier/validator/checker logic, ledger/trial-balance calculations, Final Accounts Impact, API routes, database/auth/history/progress/payment/backend, or AI features
- a follow-up safety audit now confirms the explainer parity boundary:
  - the six controlled scenarios above remain supported
  - partner capital affected accounts and logic still use `Amit's Capital A/c`, not generic `Capital A/c`
  - multi-partner interest on capital totals partner amounts before debiting `Interest on Capital A/c`
  - share allotment, forfeiture, reissue, debenture premium, DRR, retirement, death, goodwill, and statutory treatment prompts remain unsupported
  - `/practice/advanced` order/count and beginner `/practice` remain unchanged
- a follow-up Partnership wording polish now keeps the same narrow explainer boundary while also supporting:
  - cash capital wording: `Amit brought Rs.50,000 in cash as capital to the business`
  - bank drawings wording: `Amit withdrew Rs.8,000 by bank for personal use`
  - single-partner interest on capital: `Interest on capital is allowed to Amit Rs.6,000`
- the wording polish still preserves named partner accounts, uses Cash/Bank from the transaction wording, and keeps goodwill, retirement, admission with goodwill, partner salary, and partner commission unsupported
- a safety audit for that wording polish now confirms:
  - cash capital uses `Cash A/c` and `Amit's Capital A/c`, not `Bank A/c` or generic `Capital A/c`
  - bank drawings uses `Amit Drawings A/c` and `Bank A/c`, not `Cash A/c`
  - single-partner interest on capital uses `Amit's Current A/c`, not `Amit's Capital A/c`
  - deferred Partnership cases, including goodwill brought by a partner, remain unsupported
- the explainer now has a narrow batch-input guard:
  - if clear multiple transactions are entered together, it returns `Please enter one transaction at a time.`
  - it does not return a partial journal entry for the first transaction
- the explainer now supports one additional controlled Partnership capital wording:
  - `A and B started their business with Rs 50000 and Rs 70000 in cash as their capital`
  - `Priyanka and Kuldeep started their business with Rs 50000 and Rs 70000 by bank as their capital`
  - expected entry uses the stated receipt account (`Cash A/c` or `Bank A/c`) for the total, with each named partner's `Capital A/c` credited separately
  - this remains narrow and does not add broad Partnership Accounts or batch-solving support
- a safety audit for the batch-guard and two-partner cash-capital fix now confirms:
  - batch input returns the one-transaction message with no partial journal entry
  - the two-partner case totals `Rs 50000` + `Rs 70000` into `Cash A/c Dr.` for `Rs 120000`
  - named capital accounts are used for `A's Capital A/c` and `B's Capital A/c`, not generic `Capital A/c`
  - existing controlled Partnership explainer cases still pass
  - goodwill, retirement, admission with goodwill, partner salary, and partner commission remain unsupported
  - beginner `/practice` and `/practice/advanced` order/count remain unchanged
- a narrow bank-capital regression fix now confirms:
  - `Priyanka and Kuldeep... by bank as their capital` debits `Bank A/c` for `Rs 120000`
  - it credits `Priyanka's Capital A/c` for `Rs 50000` and `Kuldeep's Capital A/c` for `Rs 70000`
  - it does not fall through to generic single-owner `Capital A/c`
  - the existing A/B cash case still works
- two additional narrow single-partner capital wording fixes now confirm:
  - `Kuldeep introduced Rs.75,000 as capital by bank` debits `Bank A/c` and credits `Kuldeep's Capital A/c`
  - `Priyanka brought cash Rs.60,000 as capital into the partnership` debits `Cash A/c` and credits `Priyanka's Capital A/c`
  - named partner capital wording does not fall back to generic `Capital A/c`
  - revaluation profit transfer remains unsupported
- two additional narrow two-partner capital wording fixes now confirm:
  - `Amit and Riya started a partnership with Rs.40,000 and Rs.60,000 by bank as capital` debits `Bank A/c` for `Rs 100000`
  - `Kuldeep and Priyanka brought Rs.80,000 and Rs.50,000 in cash as capital` debits `Cash A/c` for `Rs 130000`
  - both cases credit each named partner's `Capital A/c` separately and do not use generic `Capital A/c`
- five additional narrow Partnership Explainer wording/priority fixes now confirm:
  - `Amit invested Rs.50,000 as capital by bank` and `Kuldeep brought capital of Rs.75,000 through bank` use named partner `Capital A/c`, not generic `Capital A/c`
  - `Amit and Riya introduced Rs.40,000 and Rs.60,000 by bank as capital` debits `Bank A/c` for the combined total and credits both named partner capital accounts
  - `Kuldeep and Priyanka started the partnership with Rs.80,000 and Rs.50,000 in cash as capital` debits `Cash A/c` for the combined total and credits both named partner capital accounts
  - `Riya withdrew Rs.3,000 from bank for personal expenses` is treated as `Riya Drawings A/c Dr.` / `Bank A/c Cr.`, not a normal cash withdrawal
- a safety audit for those five wording/priority fixes now confirms:
  - the five exact manual-test inputs remain covered by focused tests
  - ordinary business cash withdrawn from bank remains `Cash A/c Dr.` / `Bank A/c Cr.`
  - deferred Partnership cases remain unsupported and `/practice` plus `/practice/advanced` order/count remain unchanged

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

- `17` advanced practice questions in the question bank
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
- now includes a read-only `Ledger Impact` preview after answer check
- now includes a read-only `Trial Balance Impact` preview after answer check
- now includes student-friendly explanation notes inside the post-check impact preview
- now includes a compact post-check help card titled `How to read this preview`
- now includes a compact post-check read-only section titled `Why this entry?`
- now includes compact read-only `Final Accounts Impact` previews for the partner capital contribution and drawings in cash scenarios only
- now uses a clearer student-facing post-check order:
  - correct answer
  - `Why this entry?`
  - `How to read this preview`
  - `Ledger Impact`
  - `Trial Balance Impact`
  - `Final Accounts Impact`, when the current question has supported metadata
- includes hints/common mistakes/result actions
- keeps the preview mobile-safe with compact cards instead of wide accounting tables

Current scope:

- selected Company and Partnership journal-entry cases only
- current question bank includes cases such as share application money received, share issue at premium, first call due, calls in arrears, calls in advance, share forfeiture, debenture issue at discount, partner capital contribution, partner drawings in cash, partner salary, interest on capital, interest on drawings, goodwill, revaluation, and realisation
- the first controlled Company runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Company share application money received
  - expected entry: `Bank Dr.` / `Share Application Cr.`
  - appears as the first question in Company Accounts mode
- the second controlled Company runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Company calls in advance received
  - expected entry: `Bank Dr.` / `Calls in Advance Cr.`
  - appears as the second question in Company Accounts mode
- the third controlled Company runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Company debenture redemption at par
  - expected entry: `Debentures Dr.` / `Bank Cr.`
  - appears as the third question in Company Accounts mode
  - intentionally avoids premium on redemption, debenture interest, DRR, instalments, Companies Act treatment, statutory reserves, and complex debenture accounting
- the first controlled runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Partnership partner capital contribution
  - expected entry: `Bank Dr.` / `Amit Capital Cr.`
  - appears as the first question in Partnership mode
- the second controlled runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Partnership drawings in cash
  - expected entry: `Amit Drawings Dr.` / `Cash Cr.`
  - appears as the second question in Partnership mode
- the third controlled Partnership runtime exposure from the hidden fixture-readiness checklist is now live in `/practice/advanced`:
  - Partnership interest on capital under fluctuating capital
  - expected entry: `Interest on Capital Dr.` / `Amit Current Cr.`
  - appears as the third question in Partnership mode
- impact previews are derived from the correct expected journal entry, not from the student's submitted answer
- current preview flow reuses existing utilities:
  - `coreJournalEntriesToJournalText`
  - `generateLedger`
  - `generateTrialBalance`
- `Ledger Impact` explains how the correct journal entry affects each account
- `Trial Balance Impact` explains that total debit should equal total credit
- the preview reminds students that it is based on the correct expected answer
- the explanation UI remains compact and mobile-safe for small screens
- the help card tells students to read the correct journal entry first, then review `Ledger Impact`, then check `Trial Balance Impact`
- the help card also reminds students that the preview is based on the correct expected answer, not the submitted answer
- the help card is advanced-only, read-only, compact, and mobile-safe
- `Why this entry?` explains the debit and credit sides in short Class 11/12-friendly lines
- the `Why this entry?` section is based on static expected-answer metadata for the currently exposed controlled runtime scenarios, not on the submitted answer
- a focused safety audit now confirms `Why this entry?` stays limited to the six exposed controlled Partnership/Company runtime scenarios and keeps hidden/deferred scenarios unsupported
- the first tiny `Final Accounts Impact` preview is now implemented for Partnership partner capital contribution:
  - `Bank Dr.` / `Amit Capital Cr.`
  - Balance Sheet is affected
  - Bank increases Asset
  - Amit Capital increases Capital
  - there is no direct Profit & Loss impact
- the second tiny `Final Accounts Impact` preview is now implemented for Partnership drawings in cash:
  - `Amit Drawings Dr.` / `Cash Cr.`
  - Balance Sheet is affected
  - Cash decreases Asset
  - Amit Drawings increases and is adjusted against capital
  - there is no direct Profit & Loss impact
- broader Final Accounts Impact support is not implemented yet; interest on capital, share application, calls in advance, and debenture redemption do not show this preview yet
- spacing and labels were also polished so students can more clearly see that:
  - the correct answer is the starting point
  - `Ledger Impact` shows account-level effects
  - `Trial Balance Impact` confirms debit/credit balance

Current non-features:

- no API route for advanced practice
- no localStorage history saving for advanced practice
- no progress/weak-area integration for advanced practice
- no report generation
- no custom student-written advanced transaction generation flow

## What is hidden/test-only vs live

Live/student-facing now:

- beginner checker/practice/explainer routes
- ledger/trial balance/final accounts/BRS tools
- workflow practice pages
- advanced practice beta route `/practice/advanced`
- advanced practice read-only ledger/trial-balance impact preview after answer check
- advanced practice explanation notes for reading the ledger/trial-balance preview
- advanced practice compact help card for reading the preview
- advanced practice compact `Why this entry?` explanation section after answer check
- advanced practice compact `Final Accounts Impact` previews after answer check for Partnership partner capital contribution and drawings in cash only
- advanced practice clearer post-check section order and labels
- one controlled Company share-application-money-received question exposed inside `/practice/advanced`
- one additional controlled Company calls-in-advance question exposed inside `/practice/advanced`
- one additional controlled Company debenture-redemption-at-par question exposed inside `/practice/advanced`
- one controlled Partnership capital-contribution question exposed inside `/practice/advanced`
- one additional controlled Partnership drawings-in-cash question exposed inside `/practice/advanced`
- one additional controlled Partnership interest-on-capital/fluctuating-capital question exposed inside `/practice/advanced`

Still hidden or mostly foundation-oriented:

- advanced scenario registry as a reusable source set
- accounting-core adapters/serializers/checkers/generators outside the advanced beta page
- company and partnership report-template fixtures in `tests/fixtures/`
- topic-pack fixtures in `tests/fixtures/`
- compatibility proofs that advanced entries flow through existing ledger/trial balance logic
- hidden Company Accounts fixture/test coverage now includes a tiny calls in advance received scenario:
  - `Bank Dr.`
  - `Calls in Advance Cr.`
- that fixture was added because topic-pack metadata already claimed `calls_in_advance` support, but hidden fixtures and compatibility assertions were not yet proving it
- the calls-in-advance fixture is balanced, uses positive amounts, keeps its metadata explicit, and remains test-only
- it now flows through the existing ledger/trial-balance compatibility pattern without changing engine logic or runtime wiring
- hidden Partnership Accounts fixture/test coverage now also includes a simple partner capital contribution scenario:
  - `Bank Dr.`
  - `Amit Capital Cr.`
- that fixture is balanced, uses positive amounts, follows the existing topic-pack fixture style, and remains test-only
- focused coverage now confirms Partnership role expectations include `bank`
- the Partnership capital-contribution fixture also flows through the existing ledger/trial-balance compatibility pattern without changing engine logic or runtime wiring
- a hidden audit-style test now documents current Partnership/Company metadata-to-fixture gaps
- that audit found some metadata claims are not yet backed by hidden fixtures or by line-level fixture roles
- current documented examples include:
  - Partnership `retirement`
  - Partnership `death`
  - claimed roles that are still not represented as line-level fixture roles
- the audit did not force extra fixtures and did not add any runtime wiring
- the documented Partnership `fluctuating-capital` gap has now been closed with a hidden balanced test-only fixture:
  - `Interest on Capital Dr.`
  - `Amit Current Cr.`
- that fixture also proves the line-level roles `interest_on_capital` and `partner_current`
- the metadata audit expectations were updated to remove those items from the unproven list
- this remained fixture-only/test-only and did not add runtime wiring or change engine logic
- the documented Company Accounts `debenture-redemption` gap has now been closed with a hidden balanced test-only fixture:
  - `Debentures Dr.`
  - `Bank Cr.`
- that fixture represents simple debenture redemption at par
- it intentionally does not introduce premium on redemption, interest, DRR, instalments, Companies Act treatment, or other broader assumptions
- the metadata audit test was updated to remove `debenture-redemption` from the unproven tag list
- this remained fixture-only/test-only and did not add runtime wiring or change engine logic
- hidden Partnership metadata role gaps `partner_drawings` and `cash` have now been closed with a balanced test-only fixture:
  - `Amit Drawings Dr.`
  - `Cash Cr.`
- that fixture represents Amit withdrawing cash for personal use
- the audit expectation was updated to remove only `partner_drawings` and `cash` from the unproven role list
- focused compatibility assertions now prove `Amit Drawings` and `Cash` in the existing ledger/trial-balance compatibility pattern
- this remained fixture-only/test-only and did not add runtime wiring or change engine logic
- hidden Company metadata role gap `share_application` has now been closed with a balanced test-only fixture:
  - `Bank Dr.`
  - `Share Application Cr.`
- that fixture represents share application money received
- the audit expectation was updated to remove only `share_application` from the unproven Company role list
- focused compatibility assertions now prove `Share Application` in the existing ledger/trial-balance compatibility pattern
- this remained fixture-only/test-only and did not add runtime wiring or change engine logic
- a small runtime-readiness checklist now exists in `docs/next-steps.md` for choosing which proven hidden Partnership/Company fixtures could be exposed inside `/practice/advanced` later
- that checklist is planning-only; it did not add fixtures, runtime wiring, app logic, or test changes
- the first runtime exposure after that checklist added only the Partnership capital-contribution question to the existing advanced practice question bank
- no other hidden Partnership/Company fixtures were exposed by that runtime slice
- a post-exposure safety audit now adds focused test-only assertions that:
  - the runtime boundary still exposes only one Partnership capital-contribution question
  - Company mode keeps its existing question IDs
  - the exposed scenario's preview remains based on the correct expected entry even when the submitted answer is wrong
- the second runtime exposure added only the Partnership drawings-in-cash question to the existing advanced practice question bank
- focused tests now assert that Partnership mode starts with the two intended exposed scenarios and that Company mode remains unchanged
- a post-exposure safety audit for the drawings-in-cash exposure now confirms:
  - no third controlled Partnership exposure was inserted before existing Partnership salary practice
  - mixed/all mode still follows the deterministic full advanced question-bank order
- the first controlled Company runtime exposure added only the share-application-money-received question to the existing advanced practice question bank
- it appears as the first Company Accounts question
- focused tests now assert that Company mode includes exactly that one new Company exposure and that Partnership mode still starts with the two intended Partnership exposures
- the share-application preview path remains based on the correct expected answer, so a submitted `Share Capital` answer still displays the correct `Share Application` entry and impact preview
- a post-exposure safety audit for the first Company exposure now confirms:
  - Company mode starts with share application money received
  - no second controlled Company exposure was added by the audit
  - Partnership mode still starts with capital contribution and drawings in cash
  - mixed/all mode still follows the deterministic full advanced question-bank order
  - the Company share-application preview still shows correct answer, help card, `Ledger Impact`, `Trial Balance Impact`, and balanced debit/credit totals from the expected entry
- the second controlled Company runtime exposure promoted the already-proven calls-in-advance question into the second Company Accounts position
- Company mode now starts with exactly the two intended controlled Company exposures:
  - share application money received
  - calls in advance received
- no additional Company scenario was added by this slice; the total advanced practice question count remains `15`
- focused tests now assert that the calls-in-advance preview path remains based on the correct expected answer, so a submitted `Share Capital` answer still displays the correct `Calls in Advance` entry and impact preview
- a post-exposure safety audit for the second Company exposure now confirms:
  - Company mode starts with exactly the two intended controlled Company exposures
  - no third controlled Company exposure was added by the audit
  - Partnership mode still starts with capital contribution and drawings in cash
  - mixed/all mode still follows the deterministic full advanced question-bank order
  - the question-bank count remains stable at `15`
- the Company calls-in-advance preview still shows correct answer, help card, `Ledger Impact`, `Trial Balance Impact`, and balanced debit/credit totals from the expected entry
- the third controlled Partnership runtime exposure promoted the already-proven fluctuating-capital interest-on-capital fixture into the third Partnership Accounts position
- Partnership mode now starts with exactly the three intended controlled Partnership exposures:
  - partner capital contribution
  - partner drawings in cash
  - interest on capital under fluctuating capital
- the new Partnership question uses:
  - `Interest on Capital Dr.`
  - `Amit Current Cr.`
- no additional Partnership scenario was added by this slice; the total advanced practice question count is now `16`
- focused tests now assert that the interest-on-capital/fluctuating-capital preview path remains based on the correct expected answer, so a submitted `Amit Capital` answer still displays the correct `Amit Current` entry and impact preview
- a post-exposure safety audit for the third Partnership exposure now confirms:
  - Partnership mode starts with exactly the three intended controlled Partnership exposures
  - no fourth controlled Partnership exposure was added by the audit
  - before the next Company exposure, Company mode still started with exactly the two intended controlled Company exposures
  - mixed/all mode still follows the deterministic full advanced question-bank order
  - the advanced practice question-bank count remains stable at `16`
  - the interest-on-capital/fluctuating-capital preview still shows correct answer, help card, `Ledger Impact`, `Trial Balance Impact`, and balanced debit/credit totals from the expected entry
  - an incorrect submitted `Amit Capital` credit still displays the correct expected `Amit Current` preview
- the third controlled Company runtime exposure promoted the already-proven debenture-redemption-at-par fixture into the third Company Accounts position
- Company mode now starts with exactly the three intended controlled Company exposures:
  - share application money received
  - calls in advance received
  - debenture redemption at par
- the new Company question uses:
  - `Debentures Dr.`
  - `Bank Cr.`
- no additional Company scenario was added by this slice; the total advanced practice question count is now `17`
- focused tests now assert that the debenture-redemption-at-par preview path remains based on the correct expected answer, so a submitted `Share Capital` answer still displays the correct `Bank` credit in the entry and impact preview
- a post-exposure safety audit for the third Company exposure now confirms:
  - Company mode starts with exactly the three intended controlled Company exposures
  - no fourth controlled Company exposure was added by the audit
  - Partnership mode still starts with exactly the three intended controlled Partnership exposures
  - mixed/all mode still follows the deterministic full advanced question-bank order
  - the advanced practice question-bank count remains stable at `17`
  - the debenture-redemption-at-par preview still shows correct answer, help card, `Ledger Impact`, `Trial Balance Impact`, and balanced debit/credit totals from the expected entry
  - an incorrect submitted `Share Capital` credit still displays the correct expected `Bank` credit preview
  - the debenture entry remains strictly at par with only `Debentures Dr.` and `Bank Cr.`, without premium on redemption, debenture interest, DRR, instalments, Companies Act treatment, statutory reserves, or complex debenture accounting
- the small read-only `Why this entry?` explanation layer is now live for the six currently exposed controlled advanced runtime scenarios:
  - Partnership capital contribution
  - Partnership drawings in cash
  - Partnership interest on capital under fluctuating capital
  - Company share application money received
  - Company calls in advance received
  - Company debenture redemption at par
- the explanation layer uses short static expected-answer lines to explain why the debit account is debited and why the credit account is credited
- it appears only after checking an answer and does not add any new scenario exposure, explanation engine, AI, Final Accounts impact, accounting calculation, or runtime wiring
- a focused safety audit now confirms the six exposed scenarios have explanation lines, hidden/deferred questions did not gain broad explanation support, and the post-check order remains correct answer, `Why this entry?`, `How to read this preview`, `Ledger Impact`, then `Trial Balance Impact`
- the first tiny read-only Final Accounts Impact preview is now live for Partnership capital contribution:
  - it appears after answer check, after Trial Balance Impact
  - it shows Balance Sheet, Asset, Capital, and Profit & Loss impact in compact cards
  - it is static metadata on the existing advanced question, not a new Final Accounts engine or calculation layer
  - it does not expose or support Final Accounts Impact for Company scenarios or interest on capital yet
- a focused safety audit confirmed the first Final Accounts Impact preview appeared after Trial Balance Impact and stayed based on the correct expected capital-contribution scenario before the drawings slice was added
- the second tiny read-only Final Accounts Impact preview is now live for Partnership drawings in cash:
  - it appears after answer check, after Trial Balance Impact
  - it shows Balance Sheet, Asset, Capital/Drawings, and Profit & Loss impact in compact cards
  - it is static metadata on the existing advanced question, not a Final Accounts engine or mapping layer
  - it does not expose or support Final Accounts Impact for interest on capital, share application, calls in advance, or debenture redemption yet

The advanced foundation is real code, but much of the topic-pack/report-template work is still metadata/test-oriented rather than runtime product behavior.

## Current test status

Latest verification run for the second `Final Accounts Impact` preview slice:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Observed status:

- `37` test files passed
- `2116` tests passed
- typecheck passed
- lint passed
- build passed when re-run outside the sandbox

Verification note:

- the first sandboxed `npm run build` failed with a Turbopack port-binding restriction, not a repo code error
- the re-run outside the sandbox completed successfully
- future prompts should treat this as an environment caveat, not a current app regression

## Known limitations

- Advanced Practice has no history/progress saving yet.
- Advanced Practice has no company report generation yet.
- Advanced Practice has no partnership report generation yet.
- Advanced Practice has two tiny Final Accounts Impact previews so far: Partnership partner capital contribution and Partnership drawings in cash. Broader Final Accounts Impact support is still not implemented.
- Advanced Practice has no custom advanced transaction input yet.
- Topic packs and report templates are still partly metadata/test-only.
- Existing beginner `/practice` remains separate from advanced practice and should stay separate unless explicitly redesigned.
- History and progress are browser-local only; there is no login or cloud sync.
- Runtime app behavior is still rule-based and local; there is no external AI, database, or payments layer.
- The completed impact preview slice did not change beginner `/practice`, engines, parser/classifier/validator/checker logic, API routes, database/auth/history/progress/payment/backend, or AI features.
- The completed explanation-polish slice also did not change runtime/app logic; it only added student-facing explanatory UI text inside `/practice/advanced`.
- The completed help-card slice also stayed advanced-only and did not change runtime/app logic; it only added read-only student guidance inside `/practice/advanced`.
- The completed post-check UI polish slice also stayed UI-only; it did not change accounting logic, ledger/trial-balance calculations, or answer-checking behavior.

## Files and areas to be careful with

- `next-env.d.ts` is generated and should usually be reverted if changed accidentally.
- Do not change localStorage keys casually:
  - `accywise_lesson_progress_v1`
  - `accywise_attempt_history_v1`
- Do not refactor the existing beginner engines unless explicitly requested.
- Do not mix advanced partnership/company questions into the current beginner `/practice` flow by default.
- Treat `lib/accounting-core/` as a compatibility/foundation layer unless a task is specifically about advanced practice.
- Preserve current route names unless a task explicitly asks for route changes.
