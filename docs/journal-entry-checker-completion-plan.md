# Journal Entry Checker Completion Plan

Phase: 6J

Status: planning-only

Verdict: complete the first Journal Entries V1 checker set at exactly 8 deterministic in-chapter Practice It Yourself checkers. The current live count remains exactly 3. Add 5 more only through controlled future phases, with QA after each batch.

This plan does not implement any checker. It does not change runtime behavior, app code, tests, Practice It Yourself questions, expected answers, accepted answers, checker logic, parser/classifier/validator logic, Journal Entry Explainer behavior, Solver calculations, accounting engines, API routes, persistence, login/auth, database, OCR, payments, AI Assistant behavior, backend features, beginner `/practice`, `/practice/journal-entries`, `/practice/advanced`, or accounting calculations.

## 1. Purpose

The Journal Entries chapter now has a simplified student-facing flow and exactly 3 live checkers. Phase 6J defines the safest final V1 checker count before any more implementation.

Recommended V1 target:

- Current live checkers: 3
- Additional planned checkers: 5
- Final V1 checker count: 8

Why 8 is the recommended stop point:

- It gives students coverage across core beginner transaction families.
- It avoids turning the chapter into a broad question bank too early.
- It keeps each checker deterministic, testable, and easy to explain.
- It leaves adjustment, compound, GST, partnership, company, and parser-heavy cases for later design.

## 2. Current 3 Live Checkers

| No. | Transaction | Section | Expected journal entry | Learning purpose | Safety boundary | Existing test coverage |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `Sold goods for cash Rs 12,000. Pass the journal entry.` | `introduction-to-journal-entries` | `Cash A/c Dr. / To Sales A/c`, Rs 12,000, narration `Being goods sold for cash.` | Teaches cash receipt and Sales credit for goods sold. | Cash sale of goods only. No bank, debtor, GST, discount, returns, or asset-sale treatment. | Focused checker and route tests cover correct answer, formatting tolerance, wrong account, wrong side, wrong amount, totals, narration, answer reveal, and server-controlled boundary. |
| 2 | `Paid salary by bank Rs 8,000. Pass the journal entry.` | `introduction-to-journal-entries` | `Salary A/c Dr. / To Bank A/c`, Rs 8,000, narration `Being salary paid by bank.` | Teaches expense debit and Bank credit for payment through bank. | Simple paid expense only. No cash payment, outstanding salary, prepaid salary, personal expense, or adjustment treatment. | Focused checker and route tests cover correct answer, Cash-vs-Bank mistakes, wrong expense, wrong amount, totals, narration, answer reveal, and server-controlled boundary. |
| 3 | `Bought goods for cash Rs 10,000. Pass the journal entry.` | `purchases` | `Purchases A/c Dr. / To Cash A/c`, Rs 10,000, narration `Being goods purchased for cash.` | Teaches Purchases debit for goods bought for resale and Cash credit when cash is paid. | Cash purchase of goods only. No credit supplier, GST, discount, returns, fixed asset, freight, or compound entry. | Focused checker and route tests cover correct answer, reversal, `Goods A/c`, `Assets A/c`, `Bank A/c`, wrong amount, supplier/credit-style answers, exact three-checker boundary, and server-controlled answer reveal. |

## 3. Recommended 5 Additional Checkers

| Planned no. | Category | Transaction | Section | Expected journal entry | Learning purpose |
| --- | --- | --- | --- | --- | --- |
| 4 | Capital | `Started business with cash Rs 50,000. Pass the journal entry.` | `capital` | `Cash A/c Dr. / To Capital A/c`, Rs 50,000 | Teaches asset increase and capital increase for owner contribution. |
| 5 | Drawings | `Withdrew cash for personal use Rs 5,000. Pass the journal entry.` | `drawings` | `Drawings A/c Dr. / To Cash A/c`, Rs 5,000 | Teaches personal-use withdrawal and Cash decrease. |
| 6 | Expense by cash | `Paid rent by cash Rs 3,000. Pass the journal entry.` | `expenses` | `Rent A/c Dr. / To Cash A/c`, Rs 3,000 | Teaches simple expense debit and cash payment. |
| 7 | Income by cash | `Received commission in cash Rs 2,000. Pass the journal entry.` | `income` | `Cash A/c Dr. / To Commission A/c`, Rs 2,000 | Teaches cash receipt and income credit. |
| 8 | Asset bought for cash | `Bought furniture for cash Rs 15,000. Pass the journal entry.` | `assets-and-liabilities` | `Furniture A/c Dr. / To Cash A/c`, Rs 15,000 | Teaches asset purchase and cash outflow, distinct from Purchases. |

## 4. Expected Answer Boundaries

### 4.1 Capital Checker

Transaction:

`Started business with cash Rs 50,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Cash A/c Dr. | Rs 50,000 | |
| To Capital A/c | | Rs 50,000 |

Narration:

`Being business started with cash capital.`

Boundary:

- Debit account: `Cash A/c`
- Credit account: `Capital A/c`
- Amount: Rs 50,000 on both sides
- Accepted names: only harmless formatting/account-name normalization already safely supported by the current checker pattern, such as optional `A/c`, case, punctuation, and comma-formatted amounts
- Rejected alternatives: `Bank A/c`, `Sales A/c`, `Loan A/c`, named partner capital accounts, wrong amount, debit/credit reversal, compound or extra rows
- Common mistakes to test: crediting Sales, using Bank when transaction says cash, omitting Capital, using a named partner account when no name is supplied

Safety note:

- This checker is owner/proprietor capital only. It must not add Partnership Accounts support or named partner-capital logic to the chapter checker.

### 4.2 Drawings Checker

Transaction:

`Withdrew cash for personal use Rs 5,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Drawings A/c Dr. | Rs 5,000 | |
| To Cash A/c | | Rs 5,000 |

Narration:

`Being cash withdrawn for personal use.`

Boundary:

- Debit account: `Drawings A/c`
- Credit account: `Cash A/c`
- Amount: Rs 5,000 on both sides
- Accepted names: only harmless formatting/account-name normalization already safely supported by the current checker pattern
- Rejected alternatives: `Cash A/c Dr. / To Bank A/c`, `Expense A/c`, `Capital A/c`, `Bank A/c`, goods withdrawn, wrong amount, debit/credit reversal, compound or extra rows
- Common mistakes to test: treating personal withdrawal as business cash withdrawal, crediting Bank, debiting Capital, using an expense account

Safety note:

- This checker covers cash drawings only. It must not add goods withdrawn by owner or personal expenses paid by business.

### 4.3 Rent Paid By Cash Checker

Transaction:

`Paid rent by cash Rs 3,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Rent A/c Dr. | Rs 3,000 | |
| To Cash A/c | | Rs 3,000 |

Narration:

`Being rent paid in cash.`

Boundary:

- Debit account: `Rent A/c`
- Credit account: `Cash A/c`
- Amount: Rs 3,000 on both sides
- Accepted names: only harmless formatting/account-name normalization already safely supported by the current checker pattern
- Rejected alternatives: `Salary A/c`, `Bank A/c`, `Outstanding Rent A/c`, `Prepaid Rent A/c`, `Drawings A/c`, wrong amount, debit/credit reversal, compound or extra rows
- Common mistakes to test: using Salary instead of Rent, using Bank instead of Cash, adding outstanding/prepaid treatment

Safety note:

- This checker covers only rent paid immediately in cash. It must not add outstanding or prepaid expense adjustment support.

### 4.4 Commission Received In Cash Checker

Transaction:

`Received commission in cash Rs 2,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Cash A/c Dr. | Rs 2,000 | |
| To Commission A/c | | Rs 2,000 |

Narration:

`Being commission received in cash.`

Boundary:

- Debit account: `Cash A/c`
- Credit account: `Commission A/c`
- Amount: Rs 2,000 on both sides
- Accepted names: only harmless formatting/account-name normalization already safely supported by the current checker pattern
- Rejected alternatives: `Bank A/c`, `Sales A/c`, `Capital A/c`, `Commission Received in Advance A/c`, accrued income treatment, wrong amount, debit/credit reversal, compound or extra rows
- Common mistakes to test: crediting Sales, debiting Bank, treating the receipt as capital, adding advance/accrual treatment

Safety note:

- This checker covers simple income received in cash only. It must not add accrued income or income received in advance.

### 4.5 Furniture Bought For Cash Checker

Transaction:

`Bought furniture for cash Rs 15,000. Pass the journal entry.`

Expected answer:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Furniture A/c Dr. | Rs 15,000 | |
| To Cash A/c | | Rs 15,000 |

Narration:

`Being furniture bought for cash.`

Boundary:

- Debit account: `Furniture A/c`
- Credit account: `Cash A/c`
- Amount: Rs 15,000 on both sides
- Accepted names: only harmless formatting/account-name normalization already safely supported by the current checker pattern
- Rejected alternatives: `Purchases A/c`, `Goods A/c`, `Assets A/c`, `Bank A/c`, supplier/creditor account, depreciation, incidental expenses, wrong amount, debit/credit reversal, compound or extra rows
- Common mistakes to test: treating furniture as goods/purchases, using Bank instead of Cash, adding depreciation or supplier credit logic

Safety note:

- This checker covers one fixed asset bought for cash. It must not add asset sale, depreciation, loan, or credit-purchase support.

## 5. Rejected Or Deferred Checker Types

Do not include these in the first V1 checker completion set:

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
- bank loan or loan repayment
- interest income or interest expense
- partnership entries
- company entries
- opening, closing, transfer, or rectification entries
- any broad parser/classifier/validator/checker rewrite

These can be reconsidered only after a separate accounting-design and checker-safety plan.

## 6. Implementation Batching

### Phase 6K: Implement 2 Checkers Only

Implement exactly:

1. Capital: `Started business with cash Rs 50,000`
2. Drawings: `Withdrew cash for personal use Rs 5,000`

Rules:

- do not implement Rent, Commission, or Furniture in Phase 6K
- do not add broad aliases
- do not add parser/checker framework changes unless the existing narrow pattern requires a tiny, tested extension
- preserve the current three checkers unchanged

### Phase 6L: QA Audit For Phase 6K

Audit exactly the 5-checker state:

- current 3 checkers
- new Capital checker
- new Drawings checker

Confirm:

- exact checker count is 5
- no extra checker was introduced
- no expected-answer leak before attempt
- existing 3 checkers still pass
- Capital and Drawings have focused rejection coverage
- beginner `/practice`, `/practice/journal-entries`, `/practice/advanced`, Explainer, Solver, APIs, and engines remain unchanged

### Phase 6M: Implement 3 Checkers Only

Implement exactly:

1. Rent paid by cash
2. Commission received in cash
3. Furniture bought for cash

Rules:

- do not add a ninth checker
- do not add adjustment, credit, GST, or compound-entry support
- preserve the Phase 6K/6L checker boundary

### Phase 6N: Final 8-Checker QA Audit

Audit the completed V1 checker set:

- exact checker count is 8
- all 16 sections remain present
- no extra checker, route, API, persistence, or engine change was added
- each checker has correct/reversal/wrong-debit/wrong-credit/wrong-amount coverage
- the chapter remains mobile-safe and student-friendly

## 7. Future Test Requirements

For every new checker added in Phase 6K or Phase 6M, focused tests must confirm:

- correct answer passes
- debit/credit reversal fails
- wrong debit account fails
- wrong credit account fails
- wrong amount fails
- blank attempt fails safely
- malformed attempt fails safely
- existing checkers still pass
- exact total checker count is enforced
- no extra checker was introduced
- correct answer is not rendered before checking
- correct answer reveal stays server-controlled after an attempt

Before and after each implementation batch, focused route tests should also confirm:

- the checker appears only in its intended section
- planned/later sections do not accidentally render checker editors
- `/practice/journal-entries` remains the preserved beginner practice surface
- `/practice/advanced` is not changed
- `/journal-entry-solver` logic is not changed

## 8. Implementation Guardrails

Future implementation phases must keep these boundaries:

- add one answer key per approved question ID
- keep expected answers server-controlled
- do not render expected answers before an attempt
- keep accepted answer normalization narrow and explicit
- reuse the existing checker/editor pattern
- add focused tests before widening any accepted wording
- do not use the Journal Entry Explainer as a checker engine
- do not broaden parser/classifier/validator logic
- do not introduce runtime randomization or question generation
- do not add saved progress, scoring, login, database, AI, OCR, uploads, payments, or analytics events

## 9. Final Recommendation

Proceed next to Phase 6K only if the team approves adding two checkers.

Phase 6K should implement exactly Capital and Drawings. It must not implement all five planned checkers at once.

Do not begin Phase 6K during Phase 6J.
