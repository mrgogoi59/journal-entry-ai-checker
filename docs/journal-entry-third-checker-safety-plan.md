# Journal Entry Third Checker Safety Plan

Phase: 6E

Status: planning-only

Verdict: implement exactly one additional deterministic Journal Entries checker later only if Phase 6F is explicitly approved. Do not implement it during Phase 6E.

This plan does not add a Practice It Yourself question, answer key, accepted case, checker branch, parser/classifier/validator change, accounting engine change, Journal Entry Explainer behavior, Solver behavior, API route, database/auth/history/progress/payment/backend/AI feature, or runtime UI change.

## 1. Current Checker Boundary

The current live in-chapter Journal Entries checker scope is exactly two questions. Both are server-controlled through the existing Journal Entries answer-key boundary.

### Checker 1: Sold Goods For Cash

Transaction:

`Sold goods for cash Rs 12,000. Pass the journal entry.`

Expected journal entry:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Cash A/c Dr. | Rs 12,000 |  |
| To Sales A/c |  | Rs 12,000 |

Narration:

`Being goods sold for cash.`

Learning purpose:

- teaches that Cash is debited when cash is received
- teaches that Sales is credited when goods are sold
- reinforces that debit and credit totals must match

Why it is safe:

- the wording says `cash`, so Bank A/c should not be used
- the wording says `sold goods`, so Sales A/c is the clear credit account
- it needs only two lines and one amount
- it does not require GST, discount, debtor, inventory, asset-sale, or adjustment assumptions

Mistakes it detects:

- Bank A/c instead of Cash A/c
- Purchases A/c instead of Sales A/c
- wrong debit/credit side
- wrong amount or totals
- missing Dr./To treatment
- missing, unclear, or unrelated narration
- duplicate or extra rows

### Checker 2: Paid Salary By Bank

Transaction:

`Paid salary by bank Rs 8,000. Pass the journal entry.`

Expected journal entry:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Salary A/c Dr. | Rs 8,000 |  |
| To Bank A/c |  | Rs 8,000 |

Narration:

`Being salary paid by bank.`

Learning purpose:

- teaches that Salary is an expense and is debited
- teaches that Bank is credited when money is paid through bank
- reinforces payment-mode reading before choosing Cash or Bank

Why it is safe:

- the wording says `bank`, so Cash A/c should not be used
- the expense is named directly as Salary
- it needs only two lines and one amount
- it does not require outstanding/prepaid expense treatment, personal expense treatment, or adjustment logic

Mistakes it detects:

- Cash A/c instead of Bank A/c
- Rent A/c instead of Salary A/c
- wrong debit/credit side
- wrong amount or totals
- missing Dr./To treatment
- missing, unclear, or unrelated narration
- duplicate or extra rows

## 2. Is A Third Checker Needed?

A third checker is useful, but not urgent.

Recommendation:

- add one third checker in Phase 6F only if the team wants a slightly stronger guided pilot
- otherwise, continue student/teacher review with the existing two-checker boundary

Why one more checker would help:

- the current two checkers cover a cash sale and a bank-paid expense
- a third checker can add a purchase-side trading example
- it can test whether students distinguish Purchases from Sales and Cash from Bank
- it improves practice variety without creating a broad question bank

Why it should stay to exactly one:

- the current chapter is already ready for review
- each new checker increases accepted-answer, feedback, and support-boundary risk
- Sections 2-16 are currently read-only by design
- broader checker expansion should happen only after student/teacher feedback

## 3. Recommended Candidate

Recommended third checker candidate:

`Bought goods for cash Rs 10,000. Pass the journal entry.`

Expected journal entry:

| Particulars | Debit | Credit |
| --- | ---: | ---: |
| Purchases A/c Dr. | Rs 10,000 |  |
| To Cash A/c |  | Rs 10,000 |

Narration:

`Being goods purchased for cash.`

Why this is the safest next candidate:

- it is simple, beginner-safe, and deterministic
- it uses exactly two accounts and one amount
- it complements the existing cash-sale checker by adding the purchase side
- it teaches that goods bought for resale use Purchases A/c, not an asset account
- it avoids bank ambiguity because the wording says cash
- it avoids supplier/creditor ambiguity because the transaction is not on credit
- it avoids GST, discount, returns, freight, carriage, inventory valuation, and adjustment assumptions

Recommended implementation decision:

- implement later in Phase 6F if approved
- do not implement in Phase 6E
- if Phase 6F is not approved, defer checker expansion and proceed with student/teacher review

## 4. Expected Answer Boundary

Transaction wording:

`Bought goods for cash Rs 10,000. Pass the journal entry.`

Accounts affected:

- Purchases A/c increases because goods are bought for resale
- Cash A/c decreases because cash is paid

Debit account:

- `Purchases A/c`

Credit account:

- `Cash A/c`

Amount:

- Debit total: Rs 10,000
- Credit total: Rs 10,000

Narration:

- preferred: `Being goods purchased for cash.`

Accepted account-name boundary:

- accept harmless formatting differences already supported by the checker pattern, such as case, optional `A/c`, punctuation, `Dr` vs `Dr.`, `To`, and comma-formatted amounts
- accept `Purchases A/c` and `Purchases`
- accept `Purchase A/c` only if Phase 6F intentionally follows the existing singular/plural normalization pattern for Purchases
- accept `Cash A/c` and `Cash`

Do not accept these as correct for this checker:

- `Bank A/c`, because the transaction says cash
- `Sales A/c`, because goods are purchased, not sold
- `Goods A/c`, `Stock A/c`, or `Inventory A/c`, because the beginner chapter uses Purchases A/c for goods bought for resale
- fixed-asset accounts such as Furniture, Machinery, or Computer, because the transaction says goods and not a specific asset
- Supplier, Creditor, or a named party account, because the transaction is not on credit
- GST, discount, freight, carriage, purchase return, or mixed entries
- partial cash/credit entries
- compound entries or extra rows
- wrong amount, even if debit and credit totals are equal

Suggested unsupported variations to keep outside Phase 6F:

- `Purchased goods from Mohan on credit`
- `Purchased furniture for cash`
- `Purchased goods for cash plus GST`
- `Purchased goods for cash less trade discount`
- `Purchased goods and paid freight`
- `Purchased goods partly in cash and partly on credit`
- `Returned goods to supplier`

## 5. Checker Risk Review

| Risk | Level | Plan |
| --- | --- | --- |
| Account naming ambiguity | Low-medium | Use exact wording `Bought goods for cash`; keep accepted names narrow. |
| Cash vs bank ambiguity | Low | The wording says cash; reject Bank A/c with targeted feedback. |
| Goods vs asset confusion | Medium | Reject asset-style answers and explain that goods for resale use Purchases A/c. |
| Capital vs income confusion | Low | No owner contribution or income wording is present. Extra unrelated accounts should fail. |
| Personal vs business confusion | Low | No personal-use or drawings wording is present. |
| Narration tolerance | Low-medium | Accept exact narration and close variants only if they include goods, purchase, and cash. |
| Formatting tolerance | Low | Reuse the existing harmless formatting tolerance only; do not broaden conceptual aliases. |

Feedback should stay Class 11/12-friendly:

- `Purchases A/c is debited because goods are bought for the business.`
- `Cash A/c is credited because cash is paid.`
- `Bank A/c is not used because the transaction says cash.`
- `Sales A/c is not used because this is a purchase, not a sale.`
- `Furniture or Machinery is not used because the question says goods, not a fixed asset.`

## 6. Required Tests Before Phase 6F Implementation

If Phase 6F implements this checker, add focused tests only.

Required checker tests:

- the new checker question renders only after explicit Phase 6F implementation
- the exact expected answer passes
- harmless formatting differences still pass
- debit/credit reversal fails
- `Bank A/c` instead of `Cash A/c` fails with targeted feedback
- `Sales A/c` instead of `Purchases A/c` fails with targeted feedback
- asset-style answers such as `Furniture A/c Dr.` fail
- credit-purchase answers using Supplier/Creditor fail
- wrong amount fails even if the entry balances
- missing Dr./To treatment fails
- duplicate or extra rows fail
- exact narration passes
- narration with the right idea can warn only if the existing narration-warning pattern supports it safely
- unrelated narration fails
- blank and malformed attempts still fail safely

Required regression tests:

- the existing `Sold goods for cash Rs 12,000` checker still passes and fails the same targeted mistakes
- the existing `Paid salary by bank Rs 8,000` checker still passes and fails the same targeted mistakes
- correct-answer reveal stays server-controlled and unavailable before an attempt
- unsupported question IDs remain unsupported
- no fourth checker question is added
- beginner `/practice` remains unchanged
- `/practice/journal-entries` remains unchanged
- `/practice/advanced` remains unchanged
- Journal Entry Explainer and Solver behavior remain unchanged

Recommended route/content tests:

- the production chapter still reports the correct number of live in-chapter checkers
- Sections 2-16 stay read-only unless Phase 6F explicitly approves a different placement
- the recap still describes the live checker count honestly
- mobile layout remains stack-safe with no page-level horizontal overflow

## 7. Phase 6F Implementation Constraints

If implementation is approved later:

- add exactly one checker only
- add exactly one answer key and one question entry
- do not modify the two existing answer keys except where a count/reference copy must stay accurate
- do not broaden parser/classifier/validator/checker logic
- do not add a generic question-bank generator
- do not add new API routes
- do not change beginner `/practice`
- do not change `/practice/journal-entries`
- do not change `/practice/advanced`
- do not change Journal Entry Explainer logic
- do not change Solver logic
- do not change ledger, trial balance, final accounts, or bank reconciliation engines
- do not add persistence, login, database, OCR, payments, AI Assistant behavior, or backend features
- add focused tests before widening any visible support claim
- run a post-implementation safety audit after Phase 6F

Placement decision for Phase 6F:

- safest minimal placement: add the checker to the existing Section 1 Practice It Yourself area as a third guided question, if the product accepts that Section 1 remains the only checker-enabled section
- alternative placement: add it to the Purchases section only after an extra UI/read-only-boundary audit, because that would change Section 10 from read-only to checker-enabled
- do not decide placement implicitly during implementation; Phase 6F should state the placement before editing code

## 8. Final Phase 6E Recommendation

Recommended third checker candidate:

`Bought goods for cash Rs 10,000. Pass the journal entry.`

Recommended decision:

- implement in Phase 6F only if the team wants one more deterministic practice item before or during the pilot
- otherwise defer implementation and proceed with the current student/teacher review

This Phase 6E plan intentionally stops before implementation.
