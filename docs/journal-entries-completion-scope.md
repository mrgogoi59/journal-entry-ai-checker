# Journal Entries Completion Scope

Phase: 6A

Status: planning-only

This document locks the scope for completing Journal Entries as the first gold-standard AccyWise AI chapter. It is implementation-ready, but it does not implement section changes.

Phase 6A does not change runtime behavior, tests, routes, Practice It Yourself questions, expected answers, accepted answers, checker logic, parser/classifier/validator logic, Journal Entry Explainer behavior, Solver calculations, accounting engines, API routes, login/auth, database persistence, progress persistence, OCR, payments, AI Assistant behavior, `/tools`, beginner `/practice`, `/practice/journal-entries`, or `/practice/advanced`.

## 1. Goal

Complete the full 16-section Journal Entries chapter as a beginner-friendly learning experience before expanding to more chapters or adding more checkers.

"Complete" means:

- every section has a clear student purpose
- section flow feels continuous from start to recap
- rule and logic callouts are easy to find
- examples and solved illustrations are easy to study
- students know when a section is read-only
- students can find the two live Practice It Yourself checkers
- Practice and Solver are connected naturally
- future checker expansion remains cautious and separately planned

## 2. Source Of Truth Inspected

Phase 6A inspected the current implementation instead of assuming section names:

- `lib/learning-platform/chapters/journal-entries.ts`
- `app/chapters/journal-entries/page.tsx`
- `app/chapters/journal-entries/[sectionSlug]/page.tsx`
- `app/chapters/journal-entries/JournalEntriesSectionPage.tsx`
- `app/chapters/journal-entries/JournalEntriesLearningBlocks.tsx`
- `tests/student-platform-chapters-page.test.ts`

Current route scope:

- `/chapters/journal-entries`
- `/chapters/journal-entries/[sectionSlug]`
- `/practice/journal-entries`
- `/journal-entry-solver`

Current live checker scope remains exactly:

- `Sold goods for cash Rs 12,000`
- `Paid salary by bank Rs 8,000`

## 3. Current 16 Sections

| No. | Slug | Title |
| --- | --- | --- |
| 1 | `introduction-to-journal-entries` | Introduction to Journal Entries |
| 2 | `business-transactions` | Business Transactions |
| 3 | `accounts-affected` | Accounts Affected |
| 4 | `types-of-accounts` | Types of Accounts |
| 5 | `debit-and-credit-rules` | Debit and Credit Rules |
| 6 | `journal-format-and-narration` | Journal Format and Narration |
| 7 | `cash-and-bank-transactions` | Cash and Bank Transactions |
| 8 | `capital` | Capital |
| 9 | `drawings` | Drawings |
| 10 | `purchases` | Purchases |
| 11 | `sales` | Sales |
| 12 | `expenses` | Expenses |
| 13 | `income` | Income |
| 14 | `assets-and-liabilities` | Assets and Liabilities |
| 15 | `mixed-simple-entries` | Mixed Simple Entries |
| 16 | `chapter-recap-and-practice` | Chapter Recap and Practice |

Implementation note: the public outline title for Section 1 is `Introduction to Journal Entries`, while its section heading teaches `Introduction to Journal Entries and Journal Format`.

## 4. Gold-Standard Section Pattern

Every completed Journal Entries section should follow this repeatable pattern where it fits the topic:

| Pattern item | Standard |
| --- | --- |
| Short beginner intro | Use 1-2 simple sentences that tell the student what the section is about. |
| What this section teaches | Name the exact skill, such as identifying accounts, classifying accounts, or choosing debit/credit. |
| Why it matters | Explain how the section helps students write correct journal entries later. |
| Rule/logic callout | Include a compact rule box or logic reminder that students can revise quickly. |
| Simple example or solved illustration | Show at least one beginner-safe example, preferably with account effect before final entry. |
| Common mistake warning | Warn against one or more likely wrong answers in Class 11/12 language. |
| Next-step guidance | Tell students what to read, try, or revise next. |
| Optional Solver link | Link to `/journal-entry-solver` when a student may need one-transaction explanation help. |
| Optional Practice link | Link to `/practice/journal-entries` for revision, not as a replacement for the chapter. |
| Read-only/checker boundary | State clearly whether the section is read-only or has a live checker. |

The pattern should improve clarity without making every section longer. If a section is already rich, Phase 6B/6C should polish ordering, labels, and guidance rather than add bulk.

## 5. Section-By-Section Completion Map

| No. | Slug | Title | Current state | Content polish needed | Rule/logic callout needed? | Solved illustration/example needed? | Read-only for now? | Existing checker? | Risk | Recommended phase |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `introduction-to-journal-entries` | Introduction to Journal Entries | Strong foundation section with overview, examples, two solved illustrations, two live checkers, and current pilot guidance. | Keep stable; only tighten wording if it helps students understand the chapter/checker boundary faster. | Already present; preserve balance rule. | Already present. | No, because exactly two live checkers remain here. Do not add more in this pass. | Yes: both current checkers. | Low | Phase 6D consistency QA |
| 2 | `business-transactions` | Business Transactions | First-five pilot guide present; read-only concept section. | Keep recordable/non-recordable examples prominent and shorten any wording that feels like documentation. | Already present; preserve money measurement and business entity rule. | Yes; use simple recordable vs non-recordable examples. | Yes | No | Low | Phase 6D consistency QA |
| 3 | `accounts-affected` | Accounts Affected | First-five pilot guide present; read-only account-identification section. | Make account-naming process easy to scan before debit/credit rules. | Already present; preserve "name accounts first" logic. | Yes; keep account-identification examples visible. | Yes | No | Medium | Phase 6D consistency QA |
| 4 | `types-of-accounts` | Types of Accounts | First-five pilot guide present; read-only classification section. | Add/standardize memory aid and reduce classification overload. | Already present; preserve modern classification first. | Yes; classification examples are enough for now. | Yes | No | Medium | Phase 6D consistency QA |
| 5 | `debit-and-credit-rules` | Debit and Credit Rules | First-five pilot guide present; read-only rule section. | Reduce cognitive load around modern vs traditional rules; reinforce account nature plus effect. | Already present; make it the model for later rule boxes. | Yes; keep one simple rule-to-entry example easy to find. | Yes | No | Medium | Phase 6D consistency QA |
| 6 | `journal-format-and-narration` | Journal Format and Narration | Content-rich read-only format section with solved illustrations. | Add the same beginner intro, rule callout, and next-step guidance pattern used in earlier sections. | Yes | Already present. | Yes | No | Low-medium | Phase 6B |
| 7 | `cash-and-bank-transactions` | Cash and Bank Transactions | Content-rich read-only practical section with many worked examples. | Clarify cash vs bank vs business withdrawal vs personal withdrawal; add compact next-step guidance. | Yes | Already present. | Yes | No | Low-medium | Phase 6B |
| 8 | `capital` | Capital | Content-rich read-only section with named capital and partner examples. | Emphasize named Capital A/c, cash/bank distinction, and current no-checker boundary. | Yes | Already present. | Yes | No | Low-medium | Phase 6B |
| 9 | `drawings` | Drawings | Content-rich read-only section with personal-use examples. | Strengthen personal-use clue wording and contrast with business cash withdrawal. | Yes | Already present. | Yes | No | Medium | Phase 6B |
| 10 | `purchases` | Purchases | Content-rich read-only section with goods, payment mode, and supplier examples. | Keep goods-for-resale vs asset warning clear and add next-step guidance. | Yes | Already present. | Yes | No | Medium | Phase 6B |
| 11 | `sales` | Sales | Content-rich read-only section with cash/bank/credit sales examples. | Keep goods sold vs asset sale boundary visible; clarify debtor/customer naming. | Yes | Already present. | Yes | No | Medium | Phase 6C |
| 12 | `expenses` | Expenses | Content-rich read-only section with paid/outstanding/prepaid examples. | Separate simple paid expenses from adjustment cases; keep checker boundary explicit. | Yes | Already present. | Yes | No | Medium-high | Phase 6C |
| 13 | `income` | Income | Content-rich read-only section with receipts, accrued income, and advance income examples. | Clarify earned vs received and mark accrual/advance as caution areas. | Yes | Already present. | Yes | No | Medium-high | Phase 6C |
| 14 | `assets-and-liabilities` | Assets and Liabilities | Content-rich read-only mixed section with asset purchases, loans, creditors, and deferred boundaries. | Split simple safe ideas from asset disposal, depreciation, and incidental-cost design-needed areas. | Yes | Already present. | Yes | No | Medium-high | Phase 6C |
| 15 | `mixed-simple-entries` | Mixed Simple Entries | Content-rich read-only consolidation section with many mixed solved illustrations. | Make the section feel like revision, not a new unsupported checker set; add clear read-only boundary. | Yes | Already present. | Yes | No | High | Phase 6C |
| 16 | `chapter-recap-and-practice` | Chapter Recap and Practice | Read-only recap with practice access and current scope notes. | Tighten final next steps: return to Section 1 checkers, use Practice, use Solver, and stay honest about future scope. | Yes | Recap examples/challenges are enough. | Yes | No | Low | Phase 6C |

## 6. Safe Future Phase Sequence

### Phase 6B: Polish Sections 6-10

Scope:

- `journal-format-and-narration`
- `cash-and-bank-transactions`
- `capital`
- `drawings`
- `purchases`

Allowed work:

- content/order/label polish only
- rule/logic callout consistency
- short beginner intro and next-step guidance
- read-only boundary copy
- links to `/journal-entry-solver` and `/practice/journal-entries` where useful

Not allowed:

- new checkers
- new accepted cases
- parser/checker/engine changes

### Phase 6C: Polish Sections 11-16

Scope:

- `sales`
- `expenses`
- `income`
- `assets-and-liabilities`
- `mixed-simple-entries`
- `chapter-recap-and-practice`

Allowed work:

- content/order/label polish only
- clear caution notes for adjustments, accruals, asset disposal, and mixed examples
- recap and next-step guidance
- read-only boundary copy

Not allowed:

- runtime checker expansion
- asset-sale/profit/loss runtime support
- broad adjustment logic

### Phase 6D: Full Journal Entries Consistency QA

Scope:

- all 16 sections
- route links
- mobile scanability
- read-only/checker boundary
- Practice and Solver handoffs
- current two checker stability

Expected output:

- audit notes
- focused copy fixes only if needed
- no new accounting logic

### Phase 6E: One Additional Checker Safety Plan

Allowed only after Phase 6B, Phase 6C, and Phase 6D are complete.

The safety plan must define:

- one candidate question
- exact expected answer
- accepted answer boundaries
- unsupported variants
- feedback requirements
- tests before implementation
- whether the current checker/editor can support it without engine changes

### Phase 6F: Optional One Additional Deterministic Checker

Allowed only if Phase 6E approves one narrow candidate.

Rules:

- implement exactly one checker
- no broad parser/classifier rewrite
- keep expected answer server-controlled
- keep correct answer hidden before attempt
- run focused tests and a post-checker safety audit

## 7. What Not To Build During Journal Entries Completion

Do not include these in Phase 6B, 6C, or 6D:

- many new Practice It Yourself checkers
- unsupported advanced journal-entry cases
- OCR/photo answer checking
- notebook upload checking
- login/auth
- database-backed progress
- saved progress or dashboard tracking
- AI Assistant logic
- broad all-chapter expansion
- app-store packaging
- Partnership/Company advanced expansion
- accounting engine rewrite
- parser/classifier/validator/checker rewrite
- broad `/tools` redesign or migration
- new API routes
- payment logic

## 8. Checker Expansion Caution

No new Practice It Yourself checker should be added until all of these are true:

- all 16 sections are content-polished
- the current two checkers remain stable
- a checker-safety plan has been created
- expected answer boundaries are documented
- accepted answer boundaries are documented
- unsupported variants are documented
- focused tests are defined before implementation
- the candidate can be implemented without broad accounting-engine changes

Safe future checker candidates may still be considered one at a time only. Examples include a simple cash/bank entry, simple capital entry, simple drawings entry, simple purchase, or simple sale. Adjustment-heavy, mixed, asset-disposal, Partnership, Company, GST, and multi-entry cases must remain deferred unless a separate plan approves them.

## 9. Pilot-Readiness Target After Completion

After Journal Entries completion, this should be true:

- a student can read the full chapter without getting lost
- a student understands the purpose of Journal Entries before trying practice
- a student understands debit/credit basics better than before starting
- a student knows which sections are read-only
- a student can find the two live checkers in Section 1
- a student can use `/practice/journal-entries` for revision naturally
- a student can use `/journal-entry-solver` when stuck on one transaction
- a teacher/founder can confidently show the full Journal Entries chapter
- the product can run a stronger Journal Entries-focused pilot before broader syllabus expansion

## 10. Phase 6A Decision

The Journal Entries completion scope is now locked.

Next recommended phase:

- Phase 6B: content-polish sections 6-10 only, with no new checkers and no runtime logic changes.

