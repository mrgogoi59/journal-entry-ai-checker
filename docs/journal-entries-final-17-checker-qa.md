# Journal Entries Final 17-Checker QA

Phase: 6U

Status: completed

Verdict: ready for teacher/student review with exactly seventeen deterministic in-chapter Practice It Yourself checkers.

This QA is an audit-only checkpoint after the Phase 6T final missing-section checker batch. It does not add runtime behavior, routes, Practice It Yourself questions, accepted cases, expected answers, checker logic, parser/classifier/validator logic, Journal Entry Explainer behavior, Solver calculations, accounting engines, API routes, persistence, login/auth, database, OCR, payments, AI Assistant behavior, or backend features.

## Routes Checked

- `/chapters/journal-entries`
- `/chapters/journal-entries/[sectionSlug]` for all 16 Journal Entries sections
- `/practice/journal-entries`
- `/journal-entry-solver`
- `/platform-preview`
- `/platform-preview/chapters/journal-entries`
- `/platform-preview/chapters/journal-entries/[sectionSlug]`

## Final Checker Count Verdict

Exactly seventeen in-chapter Practice It Yourself checkers are live.

No eighteenth checker was found or added. Focused tests pin the exact seventeen approved checking-ready question IDs, the exact seventeen question texts, and the exact production section coverage pattern.

The production Journal Entries overview shows `17 checked practice questions`. The recap also states that seventeen Practice It Yourself checkers are live.

## One-Checker-Per-Section Verdict

All 16 Journal Entries sections are present and covered.

| Section | Slug | Checker count | Live checker |
| ---: | --- | ---: | --- |
| 1 | `introduction-to-journal-entries` | 2 | `Sold goods for cash Rs 12,000`; `Paid salary by bank Rs 8,000` |
| 2 | `business-transactions` | 1 | `Paid electricity bill in cash Rs 1,200` |
| 3 | `accounts-affected` | 1 | `Bought stationery for cash Rs 800` |
| 4 | `types-of-accounts` | 1 | `Received fees in cash Rs 4,000` |
| 5 | `debit-and-credit-rules` | 1 | `Paid wages in cash Rs 2,500` |
| 6 | `journal-format-and-narration` | 1 | `Paid office rent by bank Rs 4,000` |
| 7 | `cash-and-bank-transactions` | 1 | `Deposited cash into bank Rs 5,000` |
| 8 | `capital` | 1 | `Started business with cash Rs 50,000` |
| 9 | `drawings` | 1 | `Withdrew cash for personal use Rs 5,000` |
| 10 | `purchases` | 1 | `Bought goods for cash Rs 10,000` |
| 11 | `sales` | 1 | `Sold goods by bank Rs 6,000` |
| 12 | `expenses` | 1 | `Paid rent by cash Rs 3,000` |
| 13 | `income` | 1 | `Received commission in cash Rs 2,000` |
| 14 | `assets-and-liabilities` | 1 | `Bought furniture for cash Rs 15,000` |
| 15 | `mixed-simple-entries` | 1 | `Paid advertising by bank Rs 3,500` |
| 16 | `chapter-recap-and-practice` | 1 | `Bought machinery by bank Rs 20,000` |

Section 1 intentionally has two checkers. Every other section has exactly one checker. No section is missing a checker, and no unintended section has an extra checker.

## Phase 6T Checker Placement Verdict

The three Phase 6T checkers are placed only in their intended sections:

- `cash-and-bank-transactions`: `Deposited cash into bank Rs 5,000`
- `mixed-simple-entries`: `Paid advertising by bank Rs 3,500`
- `chapter-recap-and-practice`: `Bought machinery by bank Rs 20,000`

No Phase 6T checker appears in the wrong section.

## Phase 6T Expected-Answer Verdict

The three Phase 6T server-controlled expected answers are correct:

| Question | Expected answer | Amount | Narration |
| --- | --- | ---: | --- |
| Deposited cash into bank Rs 5,000 | `Bank A/c Dr. / To Cash A/c` | Rs 5,000 | `Being cash deposited into bank.` |
| Paid advertising by bank Rs 3,500 | `Advertising A/c Dr. / To Bank A/c` | Rs 3,500 | `Being advertising paid by bank.` |
| Bought machinery by bank Rs 20,000 | `Machinery A/c Dr. / To Bank A/c` | Rs 20,000 | `Being machinery purchased by bank.` |

Correct-answer reveal remains server-controlled and explicit after an attempt. Expected answers are not rendered into the initial blank editors.

## All-Checker Expected-Answer Verdict

All seventeen expected answers remain correct and unchanged from their intended safety plans:

| # | Question | Expected answer | Amount | Narration |
| ---: | --- | --- | ---: | --- |
| 1 | Sold goods for cash Rs 12,000 | `Cash A/c Dr. / To Sales A/c` | Rs 12,000 | `Being goods sold for cash.` |
| 2 | Paid salary by bank Rs 8,000 | `Salary A/c Dr. / To Bank A/c` | Rs 8,000 | `Being salary paid by bank.` |
| 3 | Paid electricity bill in cash Rs 1,200 | `Electricity A/c Dr. / To Cash A/c` | Rs 1,200 | `Being electricity bill paid in cash.` |
| 4 | Bought stationery for cash Rs 800 | `Stationery A/c Dr. / To Cash A/c` | Rs 800 | `Being stationery purchased for cash.` |
| 5 | Received fees in cash Rs 4,000 | `Cash A/c Dr. / To Fees Received A/c` | Rs 4,000 | `Being fees received in cash.` |
| 6 | Paid wages in cash Rs 2,500 | `Wages A/c Dr. / To Cash A/c` | Rs 2,500 | `Being wages paid in cash.` |
| 7 | Paid office rent by bank Rs 4,000 | `Office Rent A/c Dr. / To Bank A/c` | Rs 4,000 | `Being office rent paid by bank.` |
| 8 | Deposited cash into bank Rs 5,000 | `Bank A/c Dr. / To Cash A/c` | Rs 5,000 | `Being cash deposited into bank.` |
| 9 | Started business with cash Rs 50,000 | `Cash A/c Dr. / To Capital A/c` | Rs 50,000 | `Being business started with cash as capital.` |
| 10 | Withdrew cash for personal use Rs 5,000 | `Drawings A/c Dr. / To Cash A/c` | Rs 5,000 | `Being cash withdrawn for personal use.` |
| 11 | Bought goods for cash Rs 10,000 | `Purchases A/c Dr. / To Cash A/c` | Rs 10,000 | `Being goods purchased for cash.` |
| 12 | Sold goods by bank Rs 6,000 | `Bank A/c Dr. / To Sales A/c` | Rs 6,000 | `Being goods sold through bank.` |
| 13 | Paid rent by cash Rs 3,000 | `Rent A/c Dr. / To Cash A/c` | Rs 3,000 | `Being rent paid in cash.` |
| 14 | Received commission in cash Rs 2,000 | `Cash A/c Dr. / To Commission A/c` | Rs 2,000 | `Being commission received in cash.` |
| 15 | Bought furniture for cash Rs 15,000 | `Furniture A/c Dr. / To Cash A/c` | Rs 15,000 | `Being furniture purchased for cash.` |
| 16 | Paid advertising by bank Rs 3,500 | `Advertising A/c Dr. / To Bank A/c` | Rs 3,500 | `Being advertising paid by bank.` |
| 17 | Bought machinery by bank Rs 20,000 | `Machinery A/c Dr. / To Bank A/c` | Rs 20,000 | `Being machinery purchased by bank.` |

## Rejection-Case Verdict

Focused checker tests cover the important safety paths for the seventeen checkers:

- correct answer passes for every checker
- debit/credit reversal fails
- wrong debit account fails where relevant
- wrong credit account fails where relevant
- wrong amount fails
- Cash vs Bank mistakes fail where relevant
- balanced but conceptually wrong answers fail
- blank, malformed, excessive-row, duplicate-line, extra-line, and unsafe amount submissions fail safely
- unsupported question IDs fail safely
- correct-answer reveal is isolated by question ID

The final three Phase 6T checkers have targeted rejection coverage:

- Bank/Cash deposit rejects reversal, sale treatment, and wrong amount
- Advertising/Bank rejects reversal, Cash instead of Bank, prepaid advertising, and wrong amount
- Machinery/Bank rejects reversal, Purchases instead of Machinery, Cash instead of Bank, and wrong amount

The checker framework was not broadened during this audit.

## Simplified UI Verdict

The production Journal Entries chapter remains student-facing and compact:

- all 16 sections still render simplified `Study guide` cards
- old internal, pilot, read-only, and status-heavy wording remains absent from the live chapter flow
- the overview uses the current `17 checked practice questions` count
- each section keeps compact `Use Explainer` and `Practice` support links
- correct answers are still hidden before an attempt
- checker editors reuse the same mobile-safe form pattern

## Practice/Explainer Connection Verdict

Practice and Explainer connections remain safe:

- `/practice/journal-entries` remains the independent beginner Journal Entries practice surface
- `/journal-entry-solver` remains optional one-transaction support
- section and checker support links point to existing production routes
- beginner `/practice`, `/practice/journal-entries`, and `/practice/advanced` were not changed by this audit

## Platform-Preview Safety Verdict

The platform-preview boundary remains safe:

- `/platform-preview` remains separate from production
- preview routes remain `noindex` and `nofollow`
- production Journal Entries routes do not link to preview routes
- platform-preview tests pin the same seventeen approved checking-ready questions
- preview routes were not promoted as production routes

## Mobile Verdict

No page-level horizontal overflow risk was found from the audited structure and tests.

- the chapter layout uses responsive grids and mobile-safe containers
- checker editors use stacked mobile fields instead of wide tables
- checker instructions and feedback are text-wrapping cards
- action buttons wrap or stack on narrow screens
- no duplicate navigation issue was introduced

## Must-Fix Items

None found during Phase 6U.

No runtime/app/test code fix was required during this audit.

## Acceptable Known Limitations

- Journal Entries is still the first gold-standard chapter; other chapters are not yet at the same depth.
- The seventeen checkers are deterministic and intentionally narrow.
- The checkers intentionally exclude GST, discounts, credit purchases/sales, compound entries, adjustments, Partnership/Company entries, opening entries, closing entries, transfer entries, and rectification entries.
- There is no saved progress, login, OCR/photo checking, payments, AI Assistant logic, or database-backed dashboard.
- `/tools` and `/learn` remain legacy/parallel routes and were not redesigned in this phase.
- `/practice/advanced` remains a separate beta surface and was not changed.
- Sandboxed Turbopack builds can hit the known process/port restriction and may need an escalated/local rerun.

## Verification

Phase 6U verification passed:

- focused Journal Entries/Practice tests passed: `155` tests across `tests/learning-platform-journal-entry-checker.test.ts`, `tests/student-platform-chapters-page.test.ts`, `tests/practice-page.test.ts`, and `tests/platform-preview-page.test.ts`
- full `npm test` passed: `2307` tests
- `npm run typecheck` passed
- `npm run lint` passed
- `git diff --check` passed
- `npm run build` first hit the known sandboxed Turbopack process/port restriction, then passed when rerun outside the sandbox
- the build-generated `next-env.d.ts` route-types diff was restored

## Final Recommendation

Pause checker expansion and proceed to teacher/student review or commit/push of the completed Journal Entries checker work.

Do not add an eighteenth checker, broaden parser/checker behavior, add APIs, add persistence, or wire new runtime features without a separate approved planning phase.
