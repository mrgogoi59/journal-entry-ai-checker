# Gold-Standard Journal Entries Learning Experience Plan

Phase: 5B

Status: planning-only

This document is the implementation-ready plan for turning the current production Journal Entries chapter into the first gold-standard AccyWise AI learning experience.

It does not change runtime behavior. It does not add Practice It Yourself questions, routes, checkers, solver behavior, database persistence, AI Assistant logic, OCR, payments, or accounting-engine changes.

## 1. Goal

AccyWise AI should now move from "collection of tools" toward a student learning product.

The first gold-standard chapter should be Journal Entries because it already has:

- production routes under `/chapters/journal-entries`
- 16 available Journal Entries learning sections
- exactly two deterministic in-chapter Practice It Yourself checkers
- a migrated Journal Entry Explainer in `StudentAppShell`
- production `/practice/journal-entries`
- a production Solver hub and five shell-wrapped Solver tools
- focused tests around chapter routes, checkers, practice, solver tools, and engine boundaries

The target is a chapter experience that feels like:

- a high-quality Accountancy textbook
- a solved-illustration book
- an interactive workbook
- a safe, deterministic feedback system
- a gateway into Solver and independent Practice

## 2. Current Production Experience

Current student-facing Journal Entries journey:

- Home has a `Start Journal Entries` CTA.
- `/chapters` lists Journal Entries as the available production chapter.
- `/chapters/journal-entries` opens Section 1.
- `/chapters/journal-entries/[sectionSlug]` renders the remaining section pages.
- All 16 sections are available.
- Section 1 has exactly two live deterministic Practice It Yourself checkers:
  - `Sold goods for cash Rs 12,000`
  - `Paid salary by bank Rs 8,000`
- Other sections are explanation/read-only production content.
- `/practice` points students to independent Journal Entries practice.
- `/practice/journal-entries` preserves the beginner topic-wise practice experience.
- `/journal-entry-solver` provides targeted Solver support for supported transactions.

Current limitation:

The chapter is broad and useful, but not yet gold-standard as a guided pilot experience. It needs a clearer first-time path, a stronger chapter overview, a consistent learning block pattern, and a careful roadmap for future deterministic checkers.

## 3. Definition Of Gold Standard

A gold-standard Journal Entries chapter means a first-time Class 11/12 Commerce student can move through a clear learning loop without founder explanation:

1. Start from the homepage.
2. Click one obvious primary action: `Start Journal Entries`.
3. Understand what the chapter will teach and what is not available yet.
4. Open the first section.
5. Read a short section objective.
6. Learn the concept in simple language.
7. Study a solved illustration.
8. Try Practice It Yourself.
9. Enter the full journal entry, not just select an option.
10. Check the answer.
11. Understand feedback and mistakes.
12. See the correct answer only after attempting.
13. Continue to the next recommended section.
14. Use Solver only when stuck.
15. Move to independent Practice after the guided chapter flow.
16. Give feedback during the pilot.

Gold standard does not mean every section has an interactive checker immediately. It means every section has a clear role, every interactive question is safe, and the student knows what to do next.

## 4. First Pilot Scope

Recommended first pilot scope:

- Home first-time path to Journal Entries.
- `/chapters` and `/chapters/journal-entries`.
- First 3-5 Journal Entries sections:
  - Introduction to Journal Entries
  - Business Transactions
  - Accounts Affected
  - Types of Accounts
  - Debit and Credit Rules
- Existing two deterministic Practice It Yourself checkers only.
- `/practice/journal-entries` for independent beginner practice after the guided chapter.
- `/journal-entry-solver` for targeted help when a student is stuck.
- Optional teacher-guided Solver demos for Ledger and Trial Balance only if time allows.

Excluded from first pilot:

- new Practice It Yourself questions
- login, saved progress, cloud history, or accounts
- OCR/photo checking
- AI Assistant logic
- payments
- broad `/tools` migration
- broad `/learn` migration
- Partnership/Company advanced practice expansion
- all-chapter runtime wiring
- new accounting/parser/checker logic

## 5. Single First Click Solution

Phase 5A found that first-time students may not instantly know where to start.

Planned solution:

- Homepage primary CTA should remain or become `Start Journal Entries`.
- Primary CTA should link directly to `/chapters/journal-entries`.
- CTA support copy should say this is the best starting path for new students.
- Secondary CTAs should be clearly secondary:
  - `Explore Chapters`
  - `Open Solver`
  - `Start Practice`
- Dashboard should keep recommending Journal Entries first.
- Solver should remain framed as targeted help, not the starting point for learning.
- Practice should be framed as independent revision after or alongside learning.
- AI Assistant should remain visibly `Coming soon` and non-clickable until a grounded tutor design exists.

Do not implement this during Phase 5B. Treat it as the first candidate for Phase 5C.

## 6. Gold-Standard Component Pattern

Future Journal Entries sections should use a consistent pattern. Existing production components already cover many of these pieces; the future work is mainly consistency and polish, not a new engine.

Recommended pattern:

| Pattern piece | Purpose | Current basis | Future action |
| --- | --- | --- | --- |
| Chapter overview | Explain scope, sequence, and what students will be able to do | `/chapters/journal-entries` page and chapter metadata | Polish copy and make the pilot path explicit |
| Section intro | Tell students what this section teaches | `learning-objective` blocks | Keep short and Class 11/12-friendly |
| Concept explanation | Teach the idea before the entry | `concept-explanation`, comparison, clue guide, process steps | Tighten long sections where needed |
| Rule box | Summarise the accounting rule | rule guide and classification blocks | Standardise as `What increases? What decreases? Debit/Credit` |
| Solved illustration | Show a full worked answer | `solved-illustration` and worked examples | Ensure every priority section has at least one clear illustration |
| Mistake warning | Prevent common wrong answers | `common-mistakes`, comparison blocks | Make warnings short and exam-friendly |
| Practice It Yourself | Student writes the full answer | existing editor/checker in Section 1 | Expand only one safe case at a time after audits |
| Answer input/editor | Collect particulars, Dr./To, amounts, totals, narration | `JournalEntryPracticeEditor` | Polish UX before adding questions |
| Feedback card | Explain correct/incorrect details | existing deterministic checker feedback | Make feedback easier to scan during pilot |
| Correct-answer reveal | Reveal after attempt, not before | existing server action/reveal model | Preserve this boundary |
| Next-step card | Tell student where to go next | section navigation and recap links | Add clearer `Next recommended step` copy later |
| Solver support link | Help when stuck without replacing learning | `/journal-entry-solver`, `/solver` | Link contextually from practice/help cards |

This pattern should later become the model for Ledger, Trial Balance, Final Accounts, and BRS chapters.

## 7. Section-By-Section Improvement Map

| Order | Section | Current readiness | Needs better explanation | Needs solved illustration | Eventually Practice It Yourself | First pilot role | Checker risk | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Introduction to Journal Entries | Strong foundation; two live checkers exist | Small polish only | Already has examples and practice context | Already has two approved checkers | Include | Low, already audited | P1 |
| 2 | Business Transactions | Strong read-only concept section | Small polish for first-time clarity | Yes, simple recordable/not-recordable examples | Not first pilot; possible classification-only task later | Include read-only | Low for non-entry task, medium for checker | P1 |
| 3 | Accounts Affected | Strong read-only account-identification section | Small polish for account naming | Yes, keep examples visible | Later account-identification task before entry checker | Include read-only | Medium because answer is not full entry | P1 |
| 4 | Types of Accounts | Strong read-only classification section | Small polish and memory aid | Yes, classification-only illustrations | Later classification-only practice | Include read-only | Medium because checker would differ from journal-entry checker | P1 |
| 5 | Debit and Credit Rules | Strong rule section | Small polish to reduce cognitive load | Yes, one simple rule-to-entry illustration | Later simple debit/credit task | Include read-only | Medium; wrong-side feedback must be precise | P1 |
| 6 | Journal Format and Narration | Strong presentation section | Small polish only | Already has solved illustrations | Later formatting-focused checker | Optional pilot read-only | Medium; format vs concept errors must be separated | P2 |
| 7 | Cash and Bank Transactions | Strong and practical | Small polish on business vs personal withdrawal | Already has worked examples | Safe future checker candidate | Optional pilot read-only | Low-medium for simple cash/bank entries | P2 |
| 8 | Capital | Strong and strategically important | Small polish around named capital | Already has controlled examples | Safe future checker candidate | Optional pilot read-only | Low-medium for single named capital, medium for two partners | P2 |
| 9 | Drawings | Strong but needs careful purpose wording | Small polish around personal-use clues | Already has examples | Safe future checker candidate | Optional pilot read-only | Medium due business withdrawal vs drawings confusion | P2 |
| 10 | Purchases | Strong read-only section | Keep goods-vs-asset warning clear | Yes | Safe later checker for cash/credit purchases | Defer from first pilot | Medium due goods vs asset and supplier names | P3 |
| 11 | Sales | Strong read-only section | Keep goods-vs-asset warning clear | Yes | Safe later checker for cash/credit sales | Defer from first pilot | Medium due debtor/customer and asset-sale confusion | P3 |
| 12 | Expenses | Strong but adjustment boundaries matter | Clarify paid vs outstanding/prepaid | Yes | Safe next only for simple paid expense | Defer from first pilot | Medium-high if adjustments are included | P3 |
| 13 | Income | Useful but advance/accrual boundaries matter | Clarify earned vs received early | Yes | Later for simple income only | Defer from first pilot | Medium-high due advance/accrued variants | P4 |
| 14 | Assets and Liabilities | Important but mixed scope | Split simple asset/liability from deferred cases | Yes | Later for simple asset purchase or loan received | Defer from first pilot | Medium-high due asset sale/loan interest boundaries | P4 |
| 15 | Mixed Simple Entries | Good recap candidate | Needs careful sequencing | Yes, mixed solved set | Later cumulative checker set | Defer from first pilot | High until component feedback pattern is proven | P5 |
| 16 | Chapter Recap and Practice | Strong read-only recap | Small polish for pilot instructions | Recap examples only | Link to existing two checkers, not new ones | Include only if pilot reaches the end | Low if read-only | P2 |

Priority definitions:

- P1: polish before the first guided pilot.
- P2: polish soon after first pilot or if pilot time allows.
- P3: next content/checker planning after early section flow is stable.
- P4: keep as read-only until boundary decisions are made.
- P5: defer until several simple deterministic cases are audited.

## 8. Deterministic Checking Roadmap

Already supported and safe:

- `Sold goods for cash Rs 12,000`
- `Paid salary by bank Rs 8,000`

Safe next deterministic cases, one at a time after Phase 5B:

- bought goods for cash
- capital introduced through bank
- drawings through bank for personal use
- cash deposited into bank
- cash withdrawn from bank for office use
- credit purchase from a named supplier
- credit sale to a named customer
- simple asset purchased through bank
- simple loan received through bank
- simple income received in cash or bank

High-risk cases requiring separate parser/checker audit:

- two-partner capital as a chapter checker
- goods withdrawn for personal use
- personal expense paid by business
- outstanding expense
- prepaid expense
- accrued income
- income received in advance
- partial cash/credit purchase or sale
- asset sale with profit/loss
- GST-inclusive or tax split entries
- returns and cash discounts
- bad debts and recoveries
- mixed multi-entry sets

Deferred cases:

- opening entries
- closing entries
- transfer entries
- rectification entries
- final accounts adjustments inside Journal Entries chapter checkers
- broad GST model
- Partnership admission, retirement, death, goodwill, revaluation, salary, commission
- Company forfeiture, reissue, allotment, premium, DRR, statutory treatment

Rules for adding future checkers:

- Add one deterministic question at a time.
- Keep expected answers server-controlled.
- Do not expose expected answers before an attempt.
- Add focused tests for correct, wrong account, wrong side, wrong amount, imbalance, and unsupported variants.
- Run a safety audit after each checker addition.
- Do not reuse beginner parser/classifier behavior unless the boundary is explicitly designed.

## 9. Student Pilot Script

Founder or teacher should give students minimal setup:

- "Open AccyWise AI."
- "Start where you think a new student should start."
- "Do not worry about marks; I want to see where the app is clear or confusing."
- "Think aloud when something is confusing."

Suggested tasks:

1. Find where to start learning Journal Entries.
2. Open the Journal Entries chapter.
3. Read the first section until you reach Practice It Yourself.
4. Attempt `Sold goods for cash`.
5. Read the feedback and decide whether you know what to fix.
6. Attempt `Paid salary by bank`.
7. Open Practice and identify what it is for.
8. Open Solver and use Journal Entry Explainer for one supported transaction.
9. On mobile, open the chapter outline and move to the next section.
10. Say what you expected the Dashboard and AI Assistant to do.

Do not explain in advance:

- where every route is
- what `Practice It Yourself` means
- how the feedback works
- that Dashboard has no real progress yet
- that AI Assistant is not implemented

Feedback to collect:

- first place the student clicked
- whether the first page explained what AccyWise AI is
- whether the student understood Chapters vs Practice vs Solver
- whether the student completed one checker without help
- whether feedback helped them correct the answer
- whether mobile navigation felt easy
- whether any section felt like "too much reading"
- what they asked for next

Confusion signals:

- student starts with Solver but expected a course
- student opens Practice before understanding the chapter
- student expects Dashboard progress to be live
- student expects AI Assistant to answer doubts now
- student cannot find the next section on mobile
- student reads solved illustrations but skips Practice It Yourself
- student sees `/tools` and thinks it is the main product

Success signals:

- student finds `Start Journal Entries` without help
- student can explain debit and credit for one simple entry
- student completes at least one Practice It Yourself checker
- student understands the feedback card
- student knows Solver is for help, not the main lesson
- student says the app is easier to follow than textbook-only learning

## 10. Success Metrics

Use simple pilot metrics:

| Metric | Success target for first pilot |
| --- | --- |
| Start clarity | Most students choose Journal Entries as first path without founder help |
| First-section completion | Most students reach the first Practice It Yourself area |
| Checker usability | Most students can submit one complete journal entry attempt |
| Feedback clarity | Most students can say what was right or wrong after feedback |
| Route clarity | Students can describe Chapters, Practice, and Solver in simple words |
| Mobile usability | Students can navigate sections and forms without horizontal page overflow |
| Learning confidence | Students feel more confident than after reading a static page only |
| Next-demand signal | Students ask for more practice questions or more chapters, not login/payment first |

## 11. Next Implementation Phases

Do not begin these during Phase 5B.

Recommended sequence:

| Phase | Name | Scope | Must not do |
| --- | --- | --- | --- |
| 5C | First-time student path polish | Make the first click and pilot path clearer on Home/Dashboard/Chapters | No new checker, no broad redesign |
| 5D | Journal Entries chapter overview polish | Strengthen chapter overview, scope, and "how to use this chapter" copy | No route rename, no new engine |
| 5E | First 3-5 section content polish | Tighten explanation, solved illustration, rule boxes, mistake warnings | No new Practice It Yourself questions |
| 5F | Existing Practice It Yourself UX polish | Improve the two current checker UX/feedback only | No new answer keys |
| 5G | Guided pilot script and feedback capture preparation | Create founder/teacher pilot checklist and feedback form/copy | No database, no custom analytics events |
| 5H | First new deterministic checker planning | Choose exactly one next safe checker and write acceptance criteria | Do not implement before approval |
| 5I | First new deterministic checker implementation | Add one checker only if Phase 5H is approved | No broad question bank |

## 12. Guardrails For Future Work

Keep these boundaries intact:

- beginner `/practice` remains stable
- `/practice/journal-entries` remains the independent beginner practice surface
- `/practice/advanced` remains separate beta
- Solver tools remain available and unchanged unless a phase explicitly scopes tool polish
- no broad `/tools` or `/learn` migration during Journal Entries gold-standard polish
- no login, database, progress persistence, OCR, payments, or AI Assistant logic
- no parser/classifier/validator/checker engine changes without a focused audit
- no new API routes for chapter practice unless the architecture is explicitly approved
- mobile layouts must avoid page-level horizontal overflow
- `next-env.d.ts` build-generated route-type diffs should be restored

## 13. Recommended Next Phase

Recommended next phase: Phase 5C, First-time student path polish.

Why:

- Phase 5A identified unclear first click as the biggest pilot blocker.
- Phase 5B keeps the solution planning-only.
- Phase 5C can be a tiny UI/copy slice that improves the student pilot path without changing accounting logic or adding new runtime capabilities.

