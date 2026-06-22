# Journal Entries 16-Section Checker Completion Plan

Phase: 6O

Status: planning-only

Verdict: complete the next Journal Entries checker expansion through three small implementation batches and three QA checkpoints. The current live count remains exactly 8. Do not implement any new checker during Phase 6O.

This plan does not change runtime behavior. It does not add Practice It Yourself questions, answer keys, accepted answers, checker logic, parser/classifier/validator logic, Journal Entry Explainer behavior, Solver calculations, accounting engines, API routes, persistence, login/auth, database, OCR, payments, AI Assistant behavior, backend features, beginner `/practice`, `/practice/journal-entries`, `/practice/advanced`, or accounting calculations.

## 1. Purpose

The Journal Entries chapter now has all 16 sections live and exactly 8 deterministic in-chapter Practice It Yourself checkers. The next strategic target is not a broad question bank. The target is one simple, beginner-safe checked activity in every Journal Entries section.

Because Section 1 already has two approved checkers and existing checkers should not be moved, the safest final target is:

- current live checkers: 8
- sections currently covered: 7 of 16
- sections still needing a checker: 9
- recommended final checker count: 17

Trying to force the final count to exactly 16 would require moving or removing one existing checker. That is not recommended.

## 2. Current Checker Placement Audit

Current placement from `lib/learning-platform/chapters/journal-entries.ts`:

| Section | Slug | Title | Current checker status | Existing checker transaction | New checker needed? |
| ---: | --- | --- | --- | --- | --- |
| 1 | `introduction-to-journal-entries` | Introduction to Journal Entries and Journal Format | 2 checkers | `Sold goods for cash Rs 12,000`; `Paid salary by bank Rs 8,000` | No |
| 2 | `business-transactions` | Business Transactions | No checker | None | Yes |
| 3 | `accounts-affected` | Accounts Affected | No checker | None | Yes |
| 4 | `types-of-accounts` | Types of Accounts | No checker | None | Yes |
| 5 | `debit-and-credit-rules` | Debit and Credit Rules | No checker | None | Yes |
| 6 | `journal-format-and-narration` | Journal Format and Narration | No checker | None | Yes |
| 7 | `cash-and-bank-transactions` | Cash and Bank Transactions | No checker | None | Yes |
| 8 | `capital` | Capital | 1 checker | `Started business with cash Rs 50,000` | No |
| 9 | `drawings` | Drawings | 1 checker | `Withdrew cash for personal use Rs 5,000` | No |
| 10 | `purchases` | Purchases | 1 checker | `Bought goods for cash Rs 10,000` | No |
| 11 | `sales` | Sales | No checker | None | Yes |
| 12 | `expenses` | Expenses | 1 checker | `Paid rent by cash Rs 3,000` | No |
| 13 | `income` | Income | 1 checker | `Received commission in cash Rs 2,000` | No |
| 14 | `assets-and-liabilities` | Assets and Liabilities | 1 checker | `Bought furniture for cash Rs 15,000` | No |
| 15 | `mixed-simple-entries` | Mixed Simple Entries | No checker | None | Yes |
| 16 | `chapter-recap-and-practice` | Chapter Recap and Practice | No checker | None | Yes |

Placement verdict:

- Section 1 is the only section with more than one checker.
- The safest path is to keep the existing Section 1 double-checker placement unchanged.
- The final one-checker-per-section goal therefore requires 9 new checkers and a final count of 17.

## 3. Full 16-Section Completion Map

| Section | Slug | Current checker status | Existing checker | Proposed new checker | Debit account | Credit account | Amount | Narration | Risk | Batch |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| 1 | `introduction-to-journal-entries` | Covered, 2 checkers | `Sold goods for cash Rs 12,000`; `Paid salary by bank Rs 8,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 2 | `business-transactions` | Missing | None | `Paid electricity bill in cash Rs 1,200. Pass the journal entry.` | `Electricity A/c` | `Cash A/c` | Rs 1,200 | `Being electricity bill paid in cash.` | Low | Phase 6P |
| 3 | `accounts-affected` | Missing | None | `Bought stationery for cash Rs 800. Pass the journal entry.` | `Stationery A/c` | `Cash A/c` | Rs 800 | `Being stationery purchased for cash.` | Low-medium | Phase 6R |
| 4 | `types-of-accounts` | Missing | None | `Received fees in cash Rs 4,000. Pass the journal entry.` | `Cash A/c` | `Fees Received A/c` | Rs 4,000 | `Being fees received in cash.` | Low-medium | Phase 6R |
| 5 | `debit-and-credit-rules` | Missing | None | `Paid wages in cash Rs 2,500. Pass the journal entry.` | `Wages A/c` | `Cash A/c` | Rs 2,500 | `Being wages paid in cash.` | Low | Phase 6P |
| 6 | `journal-format-and-narration` | Missing | None | `Paid office rent by bank Rs 4,000. Pass the journal entry.` | `Office Rent A/c` | `Bank A/c` | Rs 4,000 | `Being office rent paid by bank.` | Low | Phase 6R |
| 7 | `cash-and-bank-transactions` | Missing | None | `Deposited cash into bank Rs 5,000. Pass the journal entry.` | `Bank A/c` | `Cash A/c` | Rs 5,000 | `Being cash deposited into bank.` | Medium | Phase 6T |
| 8 | `capital` | Covered | `Started business with cash Rs 50,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 9 | `drawings` | Covered | `Withdrew cash for personal use Rs 5,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 10 | `purchases` | Covered | `Bought goods for cash Rs 10,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 11 | `sales` | Missing | None | `Sold goods by bank Rs 6,000. Pass the journal entry.` | `Bank A/c` | `Sales A/c` | Rs 6,000 | `Being goods sold through bank.` | Low | Phase 6P |
| 12 | `expenses` | Covered | `Paid rent by cash Rs 3,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 13 | `income` | Covered | `Received commission in cash Rs 2,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 14 | `assets-and-liabilities` | Covered | `Bought furniture for cash Rs 15,000` | None | Existing | Existing | Existing | Existing | Low | Done |
| 15 | `mixed-simple-entries` | Missing | None | `Paid advertising by bank Rs 3,500. Pass the journal entry.` | `Advertising A/c` | `Bank A/c` | Rs 3,500 | `Being advertising paid by bank.` | Low-medium | Phase 6T |
| 16 | `chapter-recap-and-practice` | Missing | None | `Bought machinery by bank Rs 20,000. Pass the journal entry.` | `Machinery A/c` | `Bank A/c` | Rs 20,000 | `Being machinery purchased by bank.` | Low-medium | Phase 6T |

## 4. Expected Answer Boundaries For Proposed New Checkers

Use this shared implementation rule for every proposed future checker:

- accept only the exact account names listed below, plus harmless formatting already supported by the current checker pattern such as optional `A/c`, case differences, punctuation differences, `Dr.`/`To` markers, and comma-formatted amounts
- do not add broad synonyms unless a separate safety task approves them
- do not add parser/classifier/validator changes
- do not use the Journal Entry Explainer as the checker engine
- keep expected answers server-controlled and reveal them only after an attempt

### 4.1 Business Transactions

Transaction:

`Paid electricity bill in cash Rs 1,200. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Electricity A/c Dr. | Rs 1,200 | |
| To Cash A/c | | Rs 1,200 |

Narration:

`Being electricity bill paid in cash.`

Rejected alternatives and mistakes:

- `Bank A/c` instead of `Cash A/c`
- `Drawings A/c` instead of `Electricity A/c`
- `Capital A/c` or `Sales A/c`
- outstanding or prepaid electricity treatment
- wrong amount or debit/credit reversal

### 4.2 Accounts Affected

Transaction:

`Bought stationery for cash Rs 800. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Stationery A/c Dr. | Rs 800 | |
| To Cash A/c | | Rs 800 |

Narration:

`Being stationery purchased for cash.`

Rejected alternatives and mistakes:

- `Purchases A/c`, `Goods A/c`, or `Furniture A/c`
- `Bank A/c` instead of `Cash A/c`
- treating stationery as a capital asset in this simple checker
- wrong amount or debit/credit reversal

### 4.3 Types Of Accounts

Transaction:

`Received fees in cash Rs 4,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Cash A/c Dr. | Rs 4,000 | |
| To Fees Received A/c | | Rs 4,000 |

Narration:

`Being fees received in cash.`

Rejected alternatives and mistakes:

- `Bank A/c` instead of `Cash A/c`
- `Capital A/c`, `Loan A/c`, or `Sales A/c`
- accrued fees or fees received in advance treatment
- wrong amount or debit/credit reversal

### 4.4 Debit And Credit Rules

Transaction:

`Paid wages in cash Rs 2,500. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Wages A/c Dr. | Rs 2,500 | |
| To Cash A/c | | Rs 2,500 |

Narration:

`Being wages paid in cash.`

Rejected alternatives and mistakes:

- `Salary A/c` or `Rent A/c` instead of `Wages A/c`
- `Bank A/c` instead of `Cash A/c`
- outstanding or prepaid wages treatment
- wrong amount or debit/credit reversal

### 4.5 Journal Format And Narration

Transaction:

`Paid office rent by bank Rs 4,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Office Rent A/c Dr. | Rs 4,000 | |
| To Bank A/c | | Rs 4,000 |

Narration:

`Being office rent paid by bank.`

Rejected alternatives and mistakes:

- `Cash A/c` instead of `Bank A/c`
- `Rent Outstanding A/c` or `Prepaid Rent A/c`
- missing `Dr.` or missing `To`
- unclear narration, wrong amount, or debit/credit reversal

### 4.6 Cash And Bank Transactions

Transaction:

`Deposited cash into bank Rs 5,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Bank A/c Dr. | Rs 5,000 | |
| To Cash A/c | | Rs 5,000 |

Narration:

`Being cash deposited into bank.`

Rejected alternatives and mistakes:

- treating the deposit as income
- crediting `Sales A/c`, `Capital A/c`, or `Loan A/c`
- debiting `Cash A/c` and crediting `Bank A/c`
- wrong amount or extra income/expense line

Risk note:

This is still a simple two-account entry, but it uses two asset accounts. Keep it in a later batch and test reversal carefully.

### 4.7 Sales

Transaction:

`Sold goods by bank Rs 6,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Bank A/c Dr. | Rs 6,000 | |
| To Sales A/c | | Rs 6,000 |

Narration:

`Being goods sold through bank.`

Rejected alternatives and mistakes:

- `Cash A/c` instead of `Bank A/c`
- `Purchases A/c`, `Commission A/c`, or `Capital A/c`
- asset sale treatment
- credit sale/customer account treatment
- GST, discount, or returns treatment
- wrong amount or debit/credit reversal

### 4.8 Mixed Simple Entries

Transaction:

`Paid advertising by bank Rs 3,500. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Advertising A/c Dr. | Rs 3,500 | |
| To Bank A/c | | Rs 3,500 |

Narration:

`Being advertising paid by bank.`

Rejected alternatives and mistakes:

- `Cash A/c` instead of `Bank A/c`
- `Drawings A/c`, `Capital A/c`, or `Sales A/c`
- outstanding or prepaid advertising treatment
- wrong amount or debit/credit reversal

### 4.9 Chapter Recap And Practice

Transaction:

`Bought machinery by bank Rs 20,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Machinery A/c Dr. | Rs 20,000 | |
| To Bank A/c | | Rs 20,000 |

Narration:

`Being machinery purchased by bank.`

Rejected alternatives and mistakes:

- `Purchases A/c` or `Goods A/c` instead of `Machinery A/c`
- `Cash A/c` instead of `Bank A/c`
- depreciation, installation cost, loan, or credit-purchase treatment
- wrong amount or debit/credit reversal

## 5. Existing Checker Placement Decision

Existing checkers should stay where they are.

Reasons:

- the current eight checkers have already passed Phase 6N QA
- moving a checker would create route, copy, and test churn without improving learning safety
- Section 1 having two checkers is educationally useful because it introduces both a receipt/income-style entry and an expense/payment-style entry
- keeping placement unchanged makes the expansion additive and easier to audit

Final target:

- keep the current 8 checkers
- add 9 section-specific checkers
- final count: 17 checkers across all 16 sections

## 6. Recommended Implementation Batches

Do not implement all 9 remaining checkers in one slice.

### Phase 6P: Implement 3 Low-Risk Checkers

Add exactly:

1. Business Transactions: `Paid electricity bill in cash Rs 1,200`
2. Debit and Credit Rules: `Paid wages in cash Rs 2,500`
3. Sales: `Sold goods by bank Rs 6,000`

Expected count after Phase 6P: 11 checkers.

Why first:

- all three are simple two-line entries
- each reinforces a core beginner rule
- none requires credit parties, GST, discounts, adjustments, loans, or compound entries

### Phase 6Q: QA Audit

Audit the 11-checker state.

Confirm:

- exactly 11 checkers
- no extra section changed
- existing 8 still pass unchanged
- the three new checkers have correct/reversal/wrong-account/wrong-amount coverage
- `/practice/journal-entries`, `/journal-entry-solver`, `/practice`, `/practice/advanced`, and `/platform-preview` remain safe

### Phase 6R: Implement 3 More Low/Medium-Risk Checkers

Add exactly:

1. Accounts Affected: `Bought stationery for cash Rs 800`
2. Types of Accounts: `Received fees in cash Rs 4,000`
3. Journal Format and Narration: `Paid office rent by bank Rs 4,000`

Expected count after Phase 6R: 14 checkers.

Why second:

- these add a few new account names but keep simple two-line entries
- they avoid credit parties, GST, discounts, adjustments, and compound entries
- the Journal Format checker can focus on correct presentation and narration

### Phase 6S: QA Audit

Audit the 14-checker state.

Confirm:

- exactly 14 checkers
- no extra checker is introduced
- all previous 11 still pass unchanged
- the three new checkers have targeted mistake coverage
- all 16 sections still render and remain mobile-safe

### Phase 6T: Implement Final 3 Missing-Section Checkers

Add exactly:

1. Cash and Bank Transactions: `Deposited cash into bank Rs 5,000`
2. Mixed Simple Entries: `Paid advertising by bank Rs 3,500`
3. Chapter Recap and Practice: `Bought machinery by bank Rs 20,000`

Expected count after Phase 6T: 17 checkers.

Why last:

- cash deposit uses two asset accounts and needs careful reversal/income-confusion tests
- Mixed and Recap are cumulative sections, so they should come after simpler account families are already stable
- machinery-by-bank reinforces asset-vs-purchases without adding depreciation, installation, loan, or credit treatment

### Phase 6U: Final 16-Section Checker QA

Audit the completed 17-checker state.

Confirm:

- all 16 sections have at least one checker
- Section 1 intentionally has two checkers
- final count is exactly 17
- no unsupported accounting topics leaked in
- all answer reveals remain server-controlled
- all routes and mobile layouts remain safe

## 7. Future Test Requirements

For each future checker, add focused tests that confirm:

- the checker renders only in its intended section
- the correct answer passes
- debit/credit reversal fails
- wrong debit account fails where relevant
- wrong credit account fails where relevant
- wrong amount fails
- wrong Cash/Bank treatment fails where relevant
- common concept confusion fails for that section
- blank and malformed attempts fail safely through existing checker behavior
- correct-answer reveal uses the matching server answer key
- the total checker count is enforced after the batch
- no accidental extra checker is introduced
- all 16 sections still render
- existing checkers from earlier phases still pass unchanged
- `/practice/journal-entries` remains the preserved beginner practice surface
- `/journal-entry-solver` remains optional support
- `/platform-preview` remains separate and safe if touched by tests

## 8. Deferred Checker Types

Do not include these in the 16-section completion plan:

- GST or tax split entries
- trade discount, cash discount, or discount received/allowed
- depreciation
- bad debts or bad debts recovered
- outstanding expenses
- prepaid expenses
- accrued income
- income received in advance
- compound entries
- credit purchases from named creditors
- credit sales to named debtors
- goods withdrawn by owner
- bank loans or loan repayments
- interest income or interest expense
- partnership entries
- company entries
- opening, closing, transfer, or rectification entries
- asset sale with profit/loss
- any broad parser/classifier/validator/checker rewrite

These can be reconsidered only after a separate accounting-design and checker-safety plan.

## 9. Phase 6O Verification

Phase 6O verification completed:

- `npm test` passed: 40 test files, 2286 tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `git diff --check` passed.
- `npm run build` first hit the known sandboxed Turbopack process/port restriction, then passed when rerun outside the sandbox.
- `next-env.d.ts` was restored after the build-generated route-types import changed from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`.

Verification remained documentation-only. No runtime/app/test/checker/accounting logic was changed during Phase 6O.

## 10. Final Recommendation

Proceed next to Phase 6P only if the team approves adding the first three missing-section checkers.

Phase 6P should implement exactly:

1. `Paid electricity bill in cash Rs 1,200`
2. `Paid wages in cash Rs 2,500`
3. `Sold goods by bank Rs 6,000`

Do not begin Phase 6P during Phase 6O.
