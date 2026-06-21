# Journal Entries Eight-Checker QA

Phase: 6N

Status: completed

Verdict: ready for teacher/student review with exactly eight deterministic in-chapter Practice It Yourself checkers.

This QA is an audit-only checkpoint after the Phase 6M Rent, Commission, and Furniture checker implementation. It does not add runtime behavior, routes, Practice It Yourself questions, accepted cases, expected answers, checker logic, parser/classifier/validator logic, Journal Entry Explainer behavior, Solver calculations, accounting engines, API routes, persistence, login/auth, database, OCR, payments, AI Assistant behavior, or backend features.

## Routes Checked

- `/chapters/journal-entries`
- `/chapters/journal-entries/[sectionSlug]`
- `/practice/journal-entries`
- `/journal-entry-solver`
- `/platform-preview` and `/platform-preview/chapters/journal-entries` safety expectations

## Checker Count Verdict

Exactly eight in-chapter Practice It Yourself checkers are live:

1. `Sold goods for cash Rs 12,000`
2. `Paid salary by bank Rs 8,000`
3. `Started business with cash Rs 50,000`
4. `Withdrew cash for personal use Rs 5,000`
5. `Bought goods for cash Rs 10,000`
6. `Paid rent by cash Rs 3,000`
7. `Received commission in cash Rs 2,000`
8. `Bought furniture for cash Rs 15,000`

No ninth checker was found or added. Focused tests pin the exact eight approved checking-ready question IDs and the exact eight question texts.

The production chapter overview now shows `8 checked practice questions`, and the recap states that only eight Practice It Yourself checkers are live.

## Checker Placement Verdict

The eight checkers are placed only in their intended sections:

- Section 1, `introduction-to-journal-entries`: `Sold goods for cash Rs 12,000` and `Paid salary by bank Rs 8,000`
- Section 8, `capital`: `Started business with cash Rs 50,000`
- Section 9, `drawings`: `Withdrew cash for personal use Rs 5,000`
- Section 10, `purchases`: `Bought goods for cash Rs 10,000`
- Section 12, `expenses`: `Paid rent by cash Rs 3,000`
- Section 13, `income`: `Received commission in cash Rs 2,000`
- Section 14, `assets-and-liabilities`: `Bought furniture for cash Rs 15,000`

No checker editor appears in Business Transactions, Accounts Affected, Types of Accounts, Debit and Credit Rules, Journal Format and Narration, Cash and Bank Transactions, Sales, Mixed Simple Entries, or Chapter Recap and Practice.

## Expected-Answer Verdict

The eight server-controlled expected answers remain:

| Question | Expected answer | Amount | Narration |
| --- | --- | ---: | --- |
| Sold goods for cash Rs 12,000 | `Cash A/c Dr. / To Sales A/c` | Rs 12,000 | `Being goods sold for cash.` |
| Paid salary by bank Rs 8,000 | `Salary A/c Dr. / To Bank A/c` | Rs 8,000 | `Being salary paid by bank.` |
| Started business with cash Rs 50,000 | `Cash A/c Dr. / To Capital A/c` | Rs 50,000 | `Being business started with cash as capital.` |
| Withdrew cash for personal use Rs 5,000 | `Drawings A/c Dr. / To Cash A/c` | Rs 5,000 | `Being cash withdrawn for personal use.` |
| Bought goods for cash Rs 10,000 | `Purchases A/c Dr. / To Cash A/c` | Rs 10,000 | `Being goods purchased for cash.` |
| Paid rent by cash Rs 3,000 | `Rent A/c Dr. / To Cash A/c` | Rs 3,000 | `Being rent paid in cash.` |
| Received commission in cash Rs 2,000 | `Cash A/c Dr. / To Commission A/c` | Rs 2,000 | `Being commission received in cash.` |
| Bought furniture for cash Rs 15,000 | `Furniture A/c Dr. / To Cash A/c` | Rs 15,000 | `Being furniture purchased for cash.` |

Correct-answer reveal remains server-controlled and explicit after an attempt. Expected answers are not rendered into the initial blank editors.

## Rejection-Case Verdict

Focused checker tests cover the important safety paths for the eight approved questions:

- correct answer passes for each checker
- debit/credit reversal fails
- wrong debit account fails where relevant
- wrong credit account fails where relevant
- wrong amount fails, including balanced-but-wrong entries
- wrong Cash/Bank treatment fails where relevant
- Purchases/Furniture asset-vs-goods confusion fails
- Commission/Sales/Capital income-vs-capital confusion fails
- Rent/Salary/Drawings expense-vs-personal-use confusion fails
- unsupported question IDs fail safely
- correct-answer reveal remains tied to the matching server answer key

The checker framework was not broadened during this audit.

## Existing Checker Safety Verdict

The existing five checkers remain unchanged after Phase 6M:

- `Sold goods for cash Rs 12,000` still expects `Cash A/c Dr. / To Sales A/c`
- `Paid salary by bank Rs 8,000` still expects `Salary A/c Dr. / To Bank A/c`
- `Bought goods for cash Rs 10,000` still expects `Purchases A/c Dr. / To Cash A/c`
- `Started business with cash Rs 50,000` still expects `Cash A/c Dr. / To Capital A/c`
- `Withdrew cash for personal use Rs 5,000` still expects `Drawings A/c Dr. / To Cash A/c`

No expected-answer change, accepted-case change, or checker-behavior change was made during Phase 6N.

## All-Section Study Guide Verdict

All 16 Journal Entries sections remain present in the locked order:

1. Introduction to Journal Entries
2. Business Transactions
3. Accounts Affected
4. Types of Accounts
5. Debit and Credit Rules
6. Journal Format and Narration
7. Cash and Bank Transactions
8. Capital
9. Drawings
10. Purchases
11. Sales
12. Expenses
13. Income
14. Assets and Liabilities
15. Mixed Simple Entries
16. Chapter Recap and Practice

All 16 sections still use simplified student-facing `Study guide` cards. The live overview and recap now correctly reflect the eight-checker boundary. No internal/pilot/status-heavy wording was reintroduced into the production Journal Entries chapter flow.

## Practice And Explainer Connection Verdict

Practice and Explainer connections remain safe:

- `/practice/journal-entries` remains the independent beginner Journal Entries practice surface.
- `/journal-entry-solver` remains optional one-transaction support.
- Section and checker support links continue to point to Practice and Explainer without changing either route's runtime behavior.
- Beginner `/practice`, `/practice/journal-entries`, and `/practice/advanced` were not changed by this audit.

## Platform-Preview Safety Verdict

The platform-preview boundary remains safe:

- `/platform-preview` remains separate from the production path.
- production routes do not link to preview routes.
- platform-preview tests pin the same eight approved checking-ready questions.
- preview routes were not promoted as production routes.

## Mobile Verdict

No page-level horizontal overflow risk was found from the audited structure and tests.

- The chapter layout uses responsive grids, wrapping actions, and mobile-safe containers.
- The checker editor uses stacked mobile fields/cards instead of relying on wide tables.
- The Phase 6M checkers reuse the same mobile-safe editor pattern as the existing checkers.
- Checker buttons and support actions wrap or stack on narrow screens.

## Must-Fix Items

None found during Phase 6N.

No runtime/app/test code fix was required during this audit.

## Acceptable Known Limitations

- Journal Entries is still the first gold-standard chapter; other chapters are not yet at the same depth.
- Exactly eight in-chapter Practice It Yourself checkers are live.
- Some Journal Entries sections remain learning/display sections without checker editors.
- The eight checkers intentionally exclude GST, discounts, credit entries, compound entries, adjustments, Partnership/Company entries, opening entries, closing entries, transfer entries, and rectification entries.
- No saved progress, login, OCR/photo checking, payments, AI Assistant logic, or database-backed dashboard exists.
- `/tools` and `/learn` remain legacy/parallel routes and were not redesigned in this phase.
- `/practice/advanced` remains a separate beta surface and was not changed.

## Verification

Phase 6N verification passed:

- focused Journal Entries/Practice tests passed: `134` tests across `tests/learning-platform-journal-entry-checker.test.ts`, `tests/student-platform-chapters-page.test.ts`, `tests/practice-page.test.ts`, and `tests/platform-preview-page.test.ts`
- full test suite passed: `2286` tests
- `npm run typecheck` passed
- `npm run lint` passed
- `git diff --check` passed
- `npm run build` hit the known sandboxed Turbopack process/port restriction first, then passed when rerun outside the sandbox
- the build-generated `next-env.d.ts` route-types diff was restored

## Final Recommendation

Pause checker expansion and proceed to teacher/student review of the gold-standard Journal Entries chapter with exactly eight deterministic in-chapter checkers.

Do not add a ninth checker, broaden parser/checker behavior, add APIs, add persistence, or wire new runtime features until the eight-checker learning experience has been reviewed by real students or teachers.
