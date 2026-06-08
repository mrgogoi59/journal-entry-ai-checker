# Unified Accywise Accounting Engine Plan

## 1. Current architecture summary

Accywise is currently a rule-based learning app with several working accounting modules. The app is not one unified accounting engine yet. It has a few reusable pieces, especially around journal parsing, ledger posting, and trial balance preparation, but the Journal Entry Checker, Journal Entry Explainer, Final Accounts, and Bank Reconciliation Statement are still separate workflows.

Current high-level flow:

```text
Journal Entry Checker
User transaction + student journal entry
-> transaction classifier
-> expected journal entry generator
-> journal parser
-> validator
-> scoring/explanation

AI Journal Entry Explainer
User transaction
-> transaction classifier
-> expected journal entry generator
-> solver explanation builder

Ledger Tool
Journal entry text
-> journal parser
-> ledger postings
-> ledger account balances

Trial Balance Tool
Journal entry text
-> ledger engine
-> trial balance rows

Final Accounts Tool
Trial balance text + adjustments text
-> final accounts parser/classifier
-> Trading A/c, P&L A/c, Balance Sheet

Bank Reconciliation Tool
BRS starting balance + adjustment rows
-> BRS reconciliation engine
-> final Cash Book or Bank Statement balance
```

The most reusable pipeline that already exists is:

```text
Journal entry text
-> parseJournalEntry()
-> generateLedger()
-> generateTrialBalance()
```

The checker/explainer pipeline is reusable in concept, but it is tightly coupled to beginner transaction wording and the current `TransactionClassification` shape.

## 2. Current engine/file map

| Area | Files | Current responsibility |
| --- | --- | --- |
| Shared journal/checker types | `lib/types.ts` | Defines `JournalLine`, `ParsedJournalEntry`, `CorrectJournalEntry`, `TransactionClassification`, `PracticeQuestion`, solver response types, and checker response types. |
| Account normalization | `lib/account-synonyms.ts` | Cleans and normalizes account names while preserving known account synonyms. |
| Account display/metadata | `lib/account-metadata.ts` | Stores account metadata and display helpers used mainly by explanations. |
| Amount parsing | `lib/amount-parser.ts` | Extracts rupee amounts from free text and removes the first amount from strings. |
| Transaction rule library | `lib/accounting-rules.ts` | Defines `TransactionRule[]`, regex patterns, account mappings, party extraction, and beginner practice templates. This is the largest beginner rule source. |
| Transaction classifier | `lib/transaction-classifier.ts` | Applies spelling normalization, special GST/compound/asset/discount classifiers, unsupported guards, then falls back to `transactionRules`. Produces `TransactionClassification`. |
| Expected journal entry | `lib/expected-entry-generator.ts` | Converts `TransactionClassification` into `CorrectJournalEntry`, including compound entries when `expectedEntry` exists. |
| Student journal parser | `lib/journal-parser.ts` | Parses text lines into debit and credit arrays, amount totals, and format errors. |
| Entry validator | `lib/entry-validator.ts` | Compares parsed student entry with expected entry for accounts, sides, amounts, and balance. |
| Scoring | `lib/scoring-engine.ts` | Converts validation checks into a score and result status. |
| Explanation | `lib/explanation-generator.ts` | Builds simple checker explanations and similar practice prompts from transaction classification. |
| Checker API | `app/api/check-entry/route.ts` | Runs parser, classifier, expected-entry generator, validator, scoring, and explanation for the Checker and Practice UI. |
| Journal Entry Explainer | `lib/journal-entry-solver.ts` and `app/api/journal-entry-solver/route.ts` | Rule-based solver that reuses classifier and expected-entry generator, then builds narration, affected accounts, logic, mistakes, and practice next output. |
| Journal entry practice | `lib/practice-question-generator.ts`, `app/api/generate-practice-question/route.ts`, `app/practice/page.tsx` | Generates topic-wise journal entry practice from transaction rules and explicit practice text templates. |
| Ledger engine | `lib/ledger-engine.ts` | Parses journal entry blocks, validates balance, creates ledger postings, ledger accounts, balances, posting logic, and mistakes. |
| Ledger practice | `lib/ledger-practice-generator.ts`, `app/practice/ledger/page.tsx` | Uses fixed journal-entry seeds and `generateLedger()` to derive expected ledger balances. |
| Trial Balance engine | `lib/trial-balance-engine.ts` | Calls `generateLedger()`, then converts ledger account balances into debit/credit trial balance rows. |
| Trial Balance practice | `lib/trial-balance-practice-generator.ts`, `app/practice/trial-balance/page.tsx` | Uses fixed journal-entry seeds and `generateTrialBalance()` to derive expected answers. |
| Final Accounts engine | `lib/final-accounts-engine.ts` | Parses trial balance text and adjustment text, classifies accounts into hardcoded buckets, and builds Trading A/c, P&L A/c, Balance Sheet, and workings. |
| Final Accounts practice | `lib/final-accounts-practice-generator.ts`, `app/practice/final-accounts/page.tsx` | Uses fixed final-account case seeds and `generateFinalAccounts()` to derive expected values. |
| Bank Reconciliation | `lib/bank-reconciliation-engine.ts`, `app/bank-reconciliation/page.tsx` | Separate pure BRS calculator for Cash Book/Bank Statement reconciliation. It is adjacent to, not part of, the journal-ledger-trial-balance pipeline. |
| Attempt history/progress | `lib/attempt-history.ts`, `app/history/page.tsx`, `app/progress/page.tsx` | Browser-only `localStorage` history under `accywise_attempt_history_v1`; weak areas depend on module, topic, mistake type, and transaction text. |
| Lesson progress | `lib/lesson-progress.ts`, `app/learn/LessonReader.tsx` | Browser-only lesson completion under `accywise_lesson_progress_v1`; currently tracks 37 lesson slugs. |

## 3. Existing accounting pipeline

### Where a transaction enters

Transactions enter the system mainly through:

- `app/tools/page.tsx` Checker workspace, which calls `/api/check-entry`.
- `app/practice/page.tsx`, which gets a generated transaction and checks the student's journal entry through `/api/check-entry`.
- `app/journal-entry-solver/page.tsx`, which calls `/api/journal-entry-solver`.

Ledger, Trial Balance, Final Accounts, and BRS use different inputs:

- Ledger accepts journal entry text.
- Trial Balance accepts journal entry text and internally calls Ledger.
- Final Accounts accepts trial balance text plus adjustments text.
- BRS accepts structured UI fields, not journal entries.

### How journal entries are represented

For checker and explainer logic, a journal entry is represented by:

```ts
interface JournalLine {
  account: string;
  amount: number;
  acceptedAccounts?: string[];
  acceptedRawAccounts?: string[];
  rawAccount?: string;
  partyRole?: PartyRole;
}

interface CorrectJournalEntry {
  debits: JournalLine[];
  credits: JournalLine[];
}
```

The side is not stored on each checker `JournalLine`; it is implied by whether the line sits in the `debits` or `credits` array.

For Ledger, parsed journal entries become:

```ts
type LedgerJournalLine = {
  account: string;
  side: "debit" | "credit";
  amount: number;
};
```

This is already closer to a reusable core journal-line model.

### How Ledger uses journal entries

`generateLedger(input: string)` splits journal entries into blocks, parses each block with `parseJournalEntry()`, rejects format errors and unbalanced entries, converts debit/credit arrays into `LedgerJournalLine[]`, then creates account-wise postings and balances.

This is a strong reusable core candidate, but it currently accepts only journal text and has a limit of 10 journal entry blocks for the beta tool.

### How Trial Balance uses ledger balances

`generateTrialBalance(input: string)` calls `generateLedger(input)`. It filters ledger accounts with non-zero balances and places debit balances in the debit column and credit balances in the credit column.

This is the cleanest current reuse path.

### How Final Accounts uses trial balance or structured inputs

`generateFinalAccounts(input: string, adjustmentsInput = "")` does not call `generateTrialBalance()`. It parses trial balance lines directly into `TrialBalanceBalance[]`, then classifies accounts through hardcoded account sets such as trading debit, trading credit, P&L debit, P&L credit, balance sheet, capital, drawings, liabilities, and assets.

This engine is powerful for sole-proprietor final accounts but is not yet a generic report engine.

### Already reusable

- `JournalLine`, `CorrectJournalEntry`, and `ParsedJournalEntry`.
- `parseJournalEntry()` for clear journal-entry text.
- Ledger posting mechanics.
- Trial Balance preparation from ledger balances.
- Account normalization helpers.
- Attempt history shape, if extended carefully.
- Practice derivation patterns in ledger/trial-balance practice.

### Tightly coupled to beginner sole-proprietor cases

- `transaction-classifier.ts` free-text classification order and unsupported guards.
- `accounting-rules.ts` beginner transaction regexes and party extraction.
- `practice-question-generator.ts` topic keys and explicit transaction templates.
- `final-accounts-engine.ts` hardcoded sole-proprietor Trading/P&L/Balance Sheet account categories.
- Solver explanation text that assumes beginner journal-entry learning.

### Hardcoded parts

- Transaction regex patterns and account names.
- GST/asset/discount/adjustment classifiers.
- Final account bucket sets and adjustment parsers.
- Practice topic lists and generated transaction text.
- Attempt history weak-area labels and recommendations.
- Lesson progress tracked slugs.

### Safe extension points

- Add new types without wiring runtime behavior.
- Add adapters from existing journal structures to future core structures.
- Add tests around ledger/trial-balance compatibility.
- Add topic-pack definitions behind tests only before UI/API exposure.
- Add report-template concepts beside Final Accounts without replacing it.

## 4. Feasibility conclusion

The unified engine approach is feasible, but it should be introduced as a compatibility layer first, not as an immediate replacement for working engines.

### A. What can be fully unified

- Journal entry structure.
- Debit/credit line representation.
- Balance validation.
- Ledger posting.
- Ledger account balances.
- Trial Balance rows and totals.
- Attempt history envelope, with careful versioning.
- Practice-case result checking for numerical targets.

### B. What can be partly unified

- Final Accounts: can consume common trial-balance rows, but report layouts need templates.
- Adjustments: can share amount/account parsing, but topic-specific treatment differs.
- Closing balances: can share balance math, but report placement varies by topic.
- Explanation: can share account effects, but wording should remain topic-specific.
- Practice generation: can share case shape, but transaction prompts and expected outputs need topic packs.

### C. What needs topic-specific templates

- Profit and Loss Appropriation Account.
- Partner Capital Accounts.
- Revaluation Account.
- Realisation Account.
- Share Capital Account.
- Share Application, Allotment, Calls, Calls in Arrears, Calls in Advance.
- Share Forfeiture Account.
- Capital Reserve.
- Debenture schedules and interest treatment.
- Company Balance Sheet structure.
- Notes to accounts or schedules where needed.

### D. What should not be forced into one rigid report

Do not force every report into the existing sole-proprietor Final Accounts structure. Trading A/c, P&L A/c, and Balance Sheet can share balance and row primitives, but partnership and company reports have different educational objectives and layouts. A unified core should produce accounting facts; topic-specific report templates should decide presentation.

## 5. Proposed target architecture

Recommended target:

```text
Transaction / Scenario
-> Topic Pack rule or scenario builder
-> Core JournalEntry
-> Core Ledger
-> Core TrialBalance
-> Report Template
-> Student-facing explanation/practice result
```

Suggested module structure, aligned with current `lib/` style:

```text
lib/accounting-core/
  types.ts
  journal.ts
  ledger.ts
  trial-balance.ts
  balances.ts
  reports.ts
  adapters/
    existing-journal.ts
    existing-ledger.ts

lib/accounting-topics/
  basic/
    accounts.ts
    rules.ts
    practice.ts
    explanations.ts
  gst/
    accounts.ts
    rules.ts
    reports.ts
  final-accounts/
    sole-proprietor-template.ts
  partnership/
    accounts.ts
    rules.ts
    reports.ts
    practice.ts
  company/
    accounts.ts
    rules.ts
    reports.ts
    practice.ts

lib/accounting-compat/
  checker-adapter.ts
  ledger-adapter.ts
  trial-balance-adapter.ts
  final-accounts-adapter.ts
```

BRS should stay separate for now:

```text
lib/bank-reconciliation-engine.ts
```

BRS is related to bank balances, but it is not naturally a journal-ledger-trial-balance transformation. It may later consume Cash Book/Bank ledger balances, but the calculator should remain separate.

## 6. Proposed data model

Draft only. Do not implement yet.

```ts
export type AccountType =
  | "asset"
  | "liability"
  | "capital"
  | "drawings"
  | "income"
  | "expense"
  | "contra_asset"
  | "contra_liability"
  | "appropriation"
  | "equity"
  | "memo";

export type NormalBalance = "debit" | "credit" | "none";
export type JournalSide = "debit" | "credit";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  aliases?: string[];
  topicTags?: string[];
}

export interface JournalLine {
  accountId?: string;
  accountName: string;
  side: JournalSide;
  amount: number;
  narration?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface JournalEntry {
  id: string;
  date?: string;
  sourceText?: string;
  lines: JournalLine[];
  narration?: string;
  topicId?: string;
  transactionType?: string;
}

export interface LedgerPosting {
  accountName: string;
  side: JournalSide;
  referenceAccountName: string;
  amount: number;
  journalEntryId: string;
}

export interface LedgerAccount {
  accountName: string;
  postings: LedgerPosting[];
  debitTotal: number;
  creditTotal: number;
  balanceSide: JournalSide | "balanced";
  balanceAmount: number;
}

export interface TrialBalanceRow {
  accountName: string;
  debit: number;
  credit: number;
  accountType?: AccountType;
}

export interface AccountingScenario {
  id: string;
  topicId: string;
  title: string;
  prompt: string;
  inputMode: "transaction_text" | "journal_entry_text" | "structured";
  expectedJournalEntries?: JournalEntry[];
  expectedReports?: ReportResult[];
}

export interface TopicPack {
  id: string;
  title: string;
  supportedTransactionTypes: string[];
  accounts: Account[];
  journalRules: JournalRule[];
  reportTemplates: ReportTemplate[];
  practiceCases?: AccountingScenario[];
}

export interface JournalRule {
  transactionType: string;
  match?: RegExp;
  buildEntry: (input: unknown) => JournalEntry;
  explanationTemplate?: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  topicId: string;
  inputKind: "ledger" | "trial_balance" | "journal_entries" | "structured";
  buildReport: (input: unknown) => ReportResult;
}

export interface ReportResult {
  id: string;
  title: string;
  sections: ReportSection[];
  totals?: Record<string, number>;
  warnings?: string[];
}

export interface ReportSection {
  title: string;
  rows: Array<{ label: string; debit?: number; credit?: number; amount?: number }>;
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  prompt: string;
  expectedJournalEntries?: JournalEntry[];
  expectedReport?: ReportResult;
  answerKind: "journal_entry" | "amount" | "report";
}

export interface CheckResult {
  status: "correct" | "partly_correct" | "incorrect" | "invalid" | "unsupported";
  score: number;
  mistakeType?: string;
  expectedJournalEntries?: JournalEntry[];
  expectedReport?: ReportResult;
  explanation: string[];
}
```

Examples supported by the model:

```text
Basic:
Cash A/c Dr.
To Sales A/c

Partnership:
Revaluation A/c Dr.
To Machinery A/c

Company:
Bank A/c Dr.
To Share Capital A/c
To Securities Premium A/c
```

## 7. Topic pack concept

Topic packs should define accounting behavior without duplicating the whole engine.

Each topic pack can define:

- Supported transaction types.
- Account templates and aliases.
- Normal balance expectations.
- Journal rules.
- Report templates.
- Practice cases.
- Explanation templates.
- Unsupported-case guardrails.

Core engine owns:

- Journal-entry balance checks.
- Ledger posting.
- Trial Balance preparation.
- Balance math.
- Common result and mistake shapes.

Topic packs own:

- Which accounts exist in that topic.
- How a scenario becomes journal entries.
- Which report is appropriate.
- How to explain the topic to students.

## 8. Partnership examples

| Future case | Reuse core | Needs special report/template |
| --- | --- | --- |
| Interest on capital | Journal lines, ledger posting, trial balance | P&L Appropriation treatment and partner capital allocation. |
| Interest on drawings | Journal lines, ledger posting, trial balance | P&L Appropriation and partner capital/current account treatment. |
| Partner salary/commission | Journal lines, ledger posting, trial balance | P&L Appropriation layout. |
| Profit and Loss Appropriation | Account balances and row math | Dedicated P&L Appropriation Account template. |
| Fixed capital method | Ledger balances | Separate Partner Capital and Partner Current Account templates. |
| Fluctuating capital method | Ledger balances | Partner Capital Account template with all movements in one account. |
| Admission of partner | Journal entries, ledger posting | Revaluation Account, Capital Accounts, Goodwill workings. |
| Goodwill adjustment | Journal entries | Partner capital/current adjustments and ratio-based workings. |
| Revaluation of assets/liabilities | Journal entries, ledger posting | Revaluation Account and partner capital transfer. |
| Retirement/death | Journal entries, ledger posting | Revaluation, goodwill, retiring partner loan/capital settlement templates. |
| Dissolution | Journal entries, ledger posting | Realisation Account, Partner Capital Accounts, Bank/Cash settlement template. |

Recommendation: partnership should be a topic pack plus report templates, not a separate `PartnershipEngine` that duplicates journal/ledger/trial balance logic.

## 9. Company accounts examples

| Future case | Reuse core | Needs special report/template |
| --- | --- | --- |
| Share issue at par | Journal entry, ledger, trial balance | Share application/allotment/call schedule if installment-based. |
| Share issue at premium | Journal entry, ledger, trial balance | Securities Premium presentation and share capital schedule. |
| Application, allotment, calls | Journal entries, ledger posting | Installment tracking template. |
| Calls in arrears | Journal entry, ledger, trial balance | Calls in Arrears schedule and shareholder amount tracking. |
| Calls in advance | Journal entry, ledger, trial balance | Calls in Advance liability schedule. |
| Forfeiture | Journal entry, ledger, trial balance | Share Forfeiture Account and per-share working. |
| Reissue | Journal entry, ledger, trial balance | Capital Reserve calculation and forfeiture balance working. |
| Capital reserve | Journal entry and balance | Capital Reserve report line and explanatory working. |
| Debenture issue | Journal entry, ledger, trial balance | Debenture schedule if issued at par/premium/discount. |
| Debenture interest | Journal entry, ledger, trial balance | Interest and TDS/schedule templates if added later. |
| Debenture redemption | Journal entries, ledger, trial balance | Redemption schedule and reserve/investment templates. |

Recommendation: company accounts should start with journal-entry rule packs and test-only scenarios, then add company-specific schedules. Do not begin with a large company reporting engine.

## 10. Risk analysis

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Breaking existing 1931 tests | Existing beginner flows are valuable and broad. | Add new core modules beside old modules first. Do not replace runtime paths until adapters have golden tests. |
| Mixing beginner parser with advanced cases | Current classifier is regex-priority based and tuned for beginner wording. | Keep advanced topic packs separate from `classifyTransaction()` until clearly gated by topic. |
| Over-refactoring too early | The app has many working edge cases; broad rewrites would create regressions. | Use adapter-first migration and keep APIs unchanged. |
| Forcing all Final Accounts into one format | Partnership/company reports differ from sole-proprietor final accounts. | Use report templates over a generic one-size report. |
| Confusing tool-supported topics with lesson-only topics | Lessons already include partnership/company topics that tools may not support. | Maintain explicit support metadata per topic pack and update `/supported-transactions` when tools are added. |
| Making UI too complex for students | Advanced packs can clutter beginner workflows. | Hide advanced packs behind topic selection and progressive disclosure. |
| Adding too many transaction types at once | Regex collisions and unsupported guards may regress. | Add small rule packs with focused tests and no UI exposure first. |
| Breaking history/progress topic keys | `attempt-history.ts` uses topic labels and recommendations; practice topics are currently fixed. | Version topic keys and map old keys to labels. Do not rename existing keys casually. |
| BRS being forced into journal pipeline | BRS is reconciliation, not a journal-ledger-report flow. | Keep BRS separate, with optional future integration to Cash Book/Bank ledger balances only. |
| Duplicate account normalization rules | Current account synonyms and metadata may diverge from future account templates. | Make account templates consume existing synonym metadata through adapters. |

## 11. Step-by-step implementation roadmap

### Phase 1: Documentation and architecture guardrails

- Goal: Document target boundaries and naming conventions.
- Files likely touched: `docs/`, possibly `README` later.
- Tests to add: none.
- Risk level: low.
- Must not change: runtime engine behavior.

### Phase 2: Add shared accounting-core types without runtime behavior

- Goal: Add type-only core models in `lib/accounting-core/types.ts`.
- Files likely touched: new `lib/accounting-core/types.ts`, tests for type helpers if any.
- Tests to add: compile/type tests through normal typecheck; simple helper unit tests only if helpers exist.
- Risk level: low.
- Must not change: existing imports, APIs, parser, validator, engines.

### Phase 3: Create adapter from existing checker entries to shared journal format

- Goal: Map `CorrectJournalEntry` and `ParsedJournalEntry` to `AccountingCore.JournalEntry`.
- Files likely touched: `lib/accounting-core/adapters/existing-journal.ts`, tests.
- Tests to add: simple cash sale, compound GST, partial goods sale, discount settlement.
- Risk level: low.
- Must not change: checker results.

### Phase 4: Create adapter from shared journal entries to existing ledger engine shape

- Goal: Verify shared entries can produce the same ledger lines as current text parser.
- Files likely touched: `lib/accounting-core/ledger.ts` or adapter-only files.
- Tests to add: compare generated postings for basic, compound, GST, discount cases.
- Risk level: medium-low.
- Must not change: `generateLedger(input: string)` API.

### Phase 5: Add company journal-entry cases only

- Goal: Add test-only company topic rules for share issue at par and premium.
- Files likely touched: `lib/accounting-topics/company/*`, tests.
- Tests to add: Bank Dr, Share Capital Cr, Securities Premium Cr.
- Risk level: medium.
- Must not change: public checker/explainer support until intentionally exposed.

### Phase 6: Add partnership journal-entry cases only

- Goal: Add test-only partnership topic rules for interest on capital/drawings and partner salary.
- Files likely touched: `lib/accounting-topics/partnership/*`, tests.
- Tests to add: P&L Appropriation, partner capital/current examples.
- Risk level: medium.
- Must not change: beginner parser behavior.

### Phase 7: Verify ledger and trial balance consume advanced entries

- Goal: Ensure advanced journal entries post through shared ledger/trial balance core.
- Files likely touched: tests and adapters.
- Tests to add: partnership revaluation, company premium issue, calls in arrears.
- Risk level: medium.
- Must not change: current `generateLedger` and `generateTrialBalance` outputs.

### Phase 8: Add topic-specific report templates

- Goal: Add report template abstractions for P&L Appropriation, Partner Capital Accounts, Share Capital schedules, Forfeiture, Reissue, and Debentures.
- Files likely touched: `lib/accounting-core/reports.ts`, `lib/accounting-topics/partnership/reports.ts`, `lib/accounting-topics/company/reports.ts`.
- Tests to add: golden report rows and totals.
- Risk level: medium-high.
- Must not change: existing sole-proprietor final accounts engine until adapter is ready.

### Phase 9: Add practice generators by topic using the same engine

- Goal: Generate advanced topic practice from topic packs.
- Files likely touched: new topic practice modules, later UI topic lists.
- Tests to add: generated prompt, expected journal/report, answer checking.
- Risk level: medium.
- Must not change: existing topic-wise practice keys unless migration is planned.

### Phase 10: Full regression QA

- Goal: Confirm old and new flows coexist.
- Files likely touched: tests only unless bugs surface.
- Tests to add: full regression suite, route smoke tests, manual QA.
- Risk level: medium.
- Must not change: existing public API response shapes.

## 12. First three safe coding slices

### Slice 1: Add shared accounting-core type definitions only

Prompt:

```text
Create lib/accounting-core/types.ts with draft Account, JournalEntry, JournalLine, LedgerAccount, TrialBalanceRow, TopicPack, ReportTemplate, PracticeQuestion, and CheckResult types. Do not import these types anywhere else. Do not change runtime behavior. Run npm test, typecheck, lint, build.
```

Why this is safe: it creates a vocabulary without touching engines.

### Slice 2: Add existing-journal adapter tests

Prompt:

```text
Create lib/accounting-core/adapters/existing-journal.ts to convert existing CorrectJournalEntry and ParsedJournalEntry into the new core JournalEntry shape. Add tests for cash sale, GST purchase, partial goods sale, and discount allowed settlement. Do not change checker, parser, validator, APIs, or UI.
```

Why this is safe: it proves compatibility at the edge without replacing current behavior.

### Slice 3: Add shared ledger adapter in tests only

Prompt:

```text
Add a test-only path that converts core JournalEntry examples into the current ledger input format and verifies generateLedger produces expected account balances. Cover basic sale, Revaluation A/c Dr To Machinery A/c, and Bank A/c Dr To Share Capital A/c To Securities Premium A/c. Do not expose any new UI or API.
```

Why this is safe: it validates advanced journal entries against existing ledger mechanics before any public support is added.

## 13. Test strategy

### Core tests

- Journal line balancing.
- Debit/credit totals.
- Account normal balance metadata.
- Ledger posting for single-line and compound entries.
- Trial Balance row creation from ledger balances.

### Regression tests for existing checker

- Basic cash sale.
- Credit sale with named party.
- Partial goods purchase.
- Partial goods sale.
- GST purchase/sale.
- Expense/income GST cases.
- Unsupported cases remain unsupported.

### Ledger compatibility tests

- Basic cash sale.
- Compound GST entry.
- Discount allowed/received settlement.
- Partnership revaluation entry.
- Share issue at premium entry.

### Trial Balance compatibility tests

- Trial balance agrees for basic multi-entry set.
- Trial balance agrees for company share issue at premium.
- Trial balance handles partner capital/current accounts.
- Balanced accounts are excluded or shown consistently based on current rules.

### Final Accounts non-regression tests

- Existing sole-proprietor Trading A/c, P&L A/c, Balance Sheet cases.
- Existing adjustment cases: closing stock, outstanding/prepaid/accrued, depreciation, provision, goods lost, interest.
- Ensure new report-template work does not change `generateFinalAccounts()` until intentionally migrated.

### Topic pack tests

- Topic pack metadata loads.
- Supported transaction types are unique.
- Journal rules produce balanced entries.
- Report templates produce expected rows/totals.
- Unsupported advanced wording fails safely when not enabled.

### Golden examples

- Basic cash sale: `Cash A/c Dr. To Sales A/c`.
- Credit sale: `Raju A/c Dr. To Sales A/c`.
- Ledger posting: Cash capital plus purchases and rent.
- Trial Balance agreement: same multi-entry set.
- Partnership P&L Appropriation: interest on capital, partner salary, profit split.
- Share issue at premium: `Bank A/c Dr. To Share Capital A/c To Securities Premium A/c`.
- Calls in arrears: allotment/call due and unpaid amount.
- Forfeiture and reissue: share forfeiture balance and capital reserve.

### Manual/mobile QA when UI is added later

- Advanced topic selection does not clutter beginner practice.
- Supported topics clearly separate lessons from tools.
- Mobile result tables scroll internally, not full-page.
- History/progress labels remain understandable.

## 14. Clear recommendation

Build a unified accounting core gradually, but do not replace the current engines immediately.

Recommended direction:

1. Keep existing Journal Entry, Ledger, Trial Balance, Final Accounts, and BRS modules stable.
2. Add `accounting-core` as a new internal layer with types and adapters first.
3. Treat Partnership and Company Accounts as topic packs, not duplicate engines.
4. Reuse the core journal, ledger, and trial balance logic for advanced entries.
5. Use report templates for partnership/company-specific outputs.
6. Keep BRS as a separate reconciliation tool, with optional future integration to bank ledger balances.

This approach preserves the current 1931-test baseline while creating a clean path toward Partnership Accounts and Company Accounts without building disconnected engines.
