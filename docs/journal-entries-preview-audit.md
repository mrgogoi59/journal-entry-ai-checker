# Journal Entries Preview Audit

Internal document. Not rendered in the app, not linked from public UI, and not placed in `public/`.

Audit date: 2026-06-21

Phase: 3V

## Verdict

`Ready for controlled production migration`

No critical code, accounting, route, checker, accessibility, mobile-layout, architecture, or performance blockers were found in the current isolated Journal Entries preview.

This verdict approves only a controlled Phase 4 migration plan. It does not start Phase 4, does not replace live routes, and does not add public links, redirects, new checkers, new answer keys, new chapter content, persistence, AI, APIs, or accounting functionality.

The recommended gate before implementation remains founder manual review on desktop and mobile.

## Scope Audited

The audit covers the isolated preview routes under `/platform-preview` only.

Current routed Journal Entries sections:

| Section | Route | Expected navigation |
| --- | --- | --- |
| 1 | `/platform-preview/chapters/journal-entries` | No Previous; Next: Business Transactions |
| 2 | `/platform-preview/chapters/journal-entries/business-transactions` | Previous: Introduction; Next: Accounts Affected |
| 3 | `/platform-preview/chapters/journal-entries/accounts-affected` | Previous: Business Transactions; Next: Types of Accounts |
| 4 | `/platform-preview/chapters/journal-entries/types-of-accounts` | Previous: Accounts Affected; Next: Debit and Credit Rules |
| 5 | `/platform-preview/chapters/journal-entries/debit-and-credit-rules` | Previous: Types of Accounts; Next: Journal Format and Narration |
| 6 | `/platform-preview/chapters/journal-entries/journal-format-and-narration` | Previous: Debit and Credit Rules; Next: Cash and Bank Transactions |
| 7 | `/platform-preview/chapters/journal-entries/cash-and-bank-transactions` | Previous: Journal Format and Narration; Next: Capital |
| 8 | `/platform-preview/chapters/journal-entries/capital` | Previous: Cash and Bank Transactions; Next: Drawings |
| 9 | `/platform-preview/chapters/journal-entries/drawings` | Previous: Capital; Next: Purchases |
| 10 | `/platform-preview/chapters/journal-entries/purchases` | Previous: Drawings; Next: Sales |
| 11 | `/platform-preview/chapters/journal-entries/sales` | Previous: Purchases; Next: Expenses |
| 12 | `/platform-preview/chapters/journal-entries/expenses` | Previous: Sales; Next: Income |
| 13 | `/platform-preview/chapters/journal-entries/income` | Previous: Expenses; Next: Assets and Liabilities |
| 14 | `/platform-preview/chapters/journal-entries/assets-and-liabilities` | Previous: Income; Next: Mixed Simple Entries |
| 15 | `/platform-preview/chapters/journal-entries/mixed-simple-entries` | Previous: Assets and Liabilities; Next: Chapter Recap and Practice |
| 16 | `/platform-preview/chapters/journal-entries/chapter-recap-and-practice` | Previous: Mixed Simple Entries; Review from Beginning; Back to Chapters |

Exactly two deterministic Practice It Yourself questions remain supported:

- `Sold goods for cash ₹12,000`
- `Paid salary by bank ₹8,000`

## 1. Route And Navigation Audit

Status: pass.

Findings:

- All sixteen route files exist under `app/platform-preview/chapters/journal-entries`.
- The route order in `journalEntriesChapter.subtopics` is 1 through 16.
- Each section has the correct `Section X of 16` progress label.
- The active outline item uses `aria-current="step"`.
- Every outline item is marked `available`.
- Every outline item links to an existing preview route.
- Section 1 has no previous section and links forward to Section 2.
- Sections 2 through 15 have Previous and Next links.
- Section 16 has Previous, `Review from Beginning`, and `Back to Chapters` links.
- The platform preview layout metadata remains `noindex, nofollow`.
- The public homepage does not link to `/platform-preview` or any Journal Entries preview route.
- No live route was replaced, redirected, or migrated.

Evidence:

- `tests/platform-preview-page.test.ts` covers route order, progress labels, active outline state, route hrefs, noindex/nofollow metadata, recap links, and absence from the public homepage.

Small fixes made:

- None.

## 2. Content-Structure Audit

Status: pass with medium-priority polish opportunities.

Findings:

- Each routed section starts with a section header and learning objective.
- The content model consistently uses typed sections such as concept explanation, comparison, process steps, clue guide, solved illustration, common mistakes, recap, reflection prompt, and display-only reveal blocks.
- Section 1 is the only section with checking-enabled Practice It Yourself editors.
- Sections 2 through 16 remain explanation-only or display-only.
- The recap section consolidates the chapter without adding duplicate editors or new checking IDs.
- No missing route-level heading, duplicate routed section title, or false upcoming state was found.
- Some sections are intentionally dense because this is a full chapter preview. This is acceptable for founder review, but production migration should consider reading fatigue and spacing once real routes are visible to students.

Small fixes made:

- None.

Medium-priority improvements:

- During founder review, sample long sections on mobile for perceived reading load.
- After controlled migration, consider small copy-density trims only where students report fatigue.

## 3. Accounting-Content Consistency Audit

Status: pass.

Presentation conventions are consistent:

- Debit account appears first.
- `Dr.` is used for debit lines.
- Credited accounts use `To`.
- Debit and credit amounts balance in checked and display-only entries.
- Narrations match the transaction context.
- `A/c` naming is consistent.
- Indian comma formatting is used where amounts are displayed in content.

Cash and Bank treatment is consistent:

- Cash is used for physical cash.
- Bank is used for bank, cheque, UPI, NEFT, or business bank transactions.
- Credit purchases and credit sales do not incorrectly use Cash or Bank.
- Cash deposited into bank is shown as `Bank A/c Dr.` / `To Cash A/c`.
- Business cash withdrawal from bank is shown as `Cash A/c Dr.` / `To Bank A/c`.
- Personal withdrawal uses Drawings, not normal business cash withdrawal.

Capital and Drawings treatment is consistent:

- Named owners or partners use named `Capital A/c`.
- Named personal withdrawals use named `Drawings A/c`.
- Capital is not described as income.
- Drawings is not described as a business expense.
- Multiple partners are represented separately where shown.

Purchases and Sales treatment is consistent:

- `Purchases A/c` is used for goods purchased for resale.
- Named assets are used for asset purchases.
- `Sales A/c` is used for ordinary sale of goods.
- Asset disposal remains deferred/design-needed.
- Named creditors and debtors are preserved.
- Later settlement examples do not repeat Purchases or Sales.

Expenses and Income treatment is consistent:

- Expenses increase on the debit side.
- Income increases on the credit side.
- Personal expenses paid by the business use Drawings.
- Outstanding expense creates a liability.
- Later payment settles the liability without duplicating the expense.
- Accrued income creates a receivable.
- Later receipt settles the receivable without duplicating income.
- Income received in advance is treated as a liability.

Assets and Liabilities treatment is consistent:

- Increasing asset is debit.
- Decreasing asset is credit.
- Increasing liability is credit.
- Decreasing liability is debit.
- Loan receipt is not treated as income.
- Loan repayment is not treated as an expense.

Deferred boundaries remain visible:

- GST.
- Discounts in depth.
- Returns in depth.
- Depreciation calculations.
- Complex asset disposal.
- Rectification.
- Closing entries.
- Partnership restructuring.
- Complex Company Accounts.

Accounting assumptions:

- The preview uses school-format journal-entry conventions for Class 11/12 learners.
- Purchases of goods for resale are taught through `Purchases A/c`.
- Named partner/proprietor examples preserve the person's account name.
- Simple accrual, outstanding, advance, and liability examples are educational content, not broad checker support.
- Advanced Partnership/Company treatments remain limited to separate advanced beta/explainer boundaries and are not part of this chapter checker.

Small fixes made:

- None.

## 4. Terminology And Writing Audit

Status: pass.

Consistent terminology observed:

- `AccyWise AI`
- `Practice It Yourself`
- `Journal Entries`
- `A/c`
- `Dr.`
- `To`
- `Cash A/c`
- `Bank A/c`
- `Capital A/c`
- `Drawings A/c`
- `Debit`
- `Credit`
- `Ledger Folio`
- `Later / design-needed`
- `Later / linked chapter`

Writing is generally student-friendly for Class 11/12:

- Concepts are explained before rules.
- Guardrails are explicit where a topic is not yet supported.
- Common mistakes use direct student language.
- The preview avoids claiming support for deferred topics.

Small fixes made:

- None.

Medium-priority improvements:

- Founder review should sample punctuation, spelling, and repeated phrases in the longest sections before migration.

## 5. Practice Checker Audit

Status: pass.

Checker scope remains exactly two approved question IDs:

- `journal-entry-sold-goods-for-cash-practice-preview`
- `journal-entry-paid-salary-by-bank-practice-preview`

Confirmed behavior:

- Both editors start blank.
- Expected answers are not present in the public chapter question objects.
- Expected answer keys live in `journal-entry-answer-keys.server.ts`.
- The client editor does not import the server answer-key module.
- The server action accepts a question ID and student attempt, then resolves the matching server-side answer key.
- Unknown IDs fail safely.
- Correct-answer reveal is explicit and server-controlled.
- Each editor uses the question ID as a field prefix, keeping editor state independent.
- Reset, stale-result clearing after edits, row limits, field limits, and pending state are implemented.
- Malformed shapes and unsafe amount inputs fail safely.
- Balanced but conceptually wrong answers remain incorrect.
- The checker covers particulars, `Dr.`, `To`, debit/credit placement, amounts, totals, narration, missing rows, extra rows, duplicate rows, and balance.

Evidence:

- `tests/platform-preview-page.test.ts` covers the route/editor boundary.
- `tests/learning-platform-journal-entry-checker.test.ts` covers checker correctness, wrong-account cases, malformed inputs, unsafe amounts, unsupported IDs, blank attempts, and reveal isolation.

Small fixes made:

- None.

## 6. Accessibility Audit

Status: pass with manual-review recommendation.

Observed accessibility strengths:

- Skip link targets the preview content.
- Primary navigation uses `nav` landmarks and accessible labels.
- Breadcrumb navigation uses `aria-label="Breadcrumb"`.
- Active primary navigation uses `aria-current="page"`.
- Active chapter outline item uses `aria-current="step"`.
- Disabled/upcoming items use disabled buttons and `aria-disabled`.
- Mobile menu button exposes `aria-controls` and `aria-expanded`.
- Form fields have visible or screen-reader labels.
- Feedback uses `aria-live="polite"`.
- Checking state uses `aria-busy` and status text.
- Focus-visible rings are present on interactive controls.
- Display-only reveal challenges use native `<details>` / `<summary>`.
- Accounting tables include captions for screen readers.
- Information is not conveyed by color alone; labels and text explain status.

Potential manual QA items:

- Keyboard-test the mobile drawer close/open sequence on a real browser.
- Spot-check color contrast after any future theme or brand changes.
- Confirm screen-reader reading order for long accounting examples after migration.

Small fixes made:

- None.

## 7. Mobile And Responsive Audit

Status: pass from source/test audit; final device review still recommended.

Observed responsive safeguards:

- The preview shell uses `overflow-x-hidden` at the root preview shell.
- Main content containers use `min-w-0`.
- Mobile header is compact and uses a drawer/menu pattern.
- Chapter outline collapses into a mobile `<details>` block.
- Journal-entry display tables are hidden on small screens and replaced with stacked cards.
- Practice editor rows are desktop-grid only at `lg`; mobile uses stacked fieldsets.
- Buttons use wrapping/flex-column patterns at narrow widths.
- Long content cards generally use `min-w-0` and grid breakpoints.

No page-level horizontal overflow defect was identified from the implementation.

Accepted limitation:

- This audit did not add a browser automation framework or new visual-regression tooling. Founder manual review should still test representative phone widths before migration.

Small fixes made:

- None.

## 8. Desktop UI Consistency Audit

Status: pass.

Findings:

- Desktop sidebar width is stable in the preview shell.
- Chapter pages use a consistent two-column desktop layout: outline plus content.
- Content width is capped and suitable for long study sessions.
- Section cards use restrained borders, white/slate surfaces, and consistent spacing.
- Headings are prominent but not oversized for desktop reading.
- The sticky outline remains separate from the scrollable learning content.
- Accounting entries remain readable in desktop table format.

Small fixes made:

- None.

## 9. Architecture Audit

Status: pass.

Findings:

- The chapter content is static typed data in `lib/learning-platform/chapters/journal-entries.ts`.
- The renderer uses discriminated section types and an exhaustive `switch`.
- Route wrappers are thin and pass only section slugs into the shared section page.
- The Practice It Yourself editor is the only needed client-heavy component in the chapter route.
- Answer keys are server-controlled.
- The server action keeps the answer-key boundary outside the client component.
- The checker is isolated under `lib/learning-platform/checkers`.
- No API route was added for this preview checker.
- No unsafe client import of answer keys was found.
- The internal preview remains coupled to `/platform-preview`, which is acceptable until Phase 4 migration intentionally creates production routes.

Small fixes made:

- None.

High-priority migration caution:

- Do not blindly move `/platform-preview` route paths into production. Create production route wrappers deliberately and keep old live routes stable until parity is verified.

## 10. Performance Audit

Status: pass for current preview scope.

Findings:

- Static educational content is server-rendered by default.
- Client-side state is limited mainly to mobile navigation and the two Practice It Yourself editors.
- No extra analytics events, API polling, persistence, or client-side question generation exists in the preview.
- The content payload is large because the full chapter is authored in static data, but this is expected for a chapter-learning preview.
- Stable list keys are generally derived from section IDs, prompt IDs, account names, or row IDs.
- No obvious layout-shift risk was found.

Medium-priority improvements:

- During Phase 4, consider whether production should split sections into route-level chunks, as it already does, rather than rendering the full chapter on one route.
- If content grows substantially, consider content-module splitting by subtopic after migration, not during this audit.

## 11. Production-Migration Readiness

Verdict: `Ready for controlled production migration`

### Critical blockers

None found.

### High-priority improvements

- Complete founder manual review before writing Phase 4 migration code.
- Migrate through controlled route slices instead of replacing all public learning routes at once.
- Keep `/platform-preview` `noindex, nofollow` until production routes are intentionally created.
- Keep the two checker answer keys server-only during migration.
- Preserve existing live routes and avoid redirects until equivalent production routes are verified.

### Medium-priority improvements

- Do a real-device mobile overflow check before launch.
- Spot-check screen-reader heading and drawer behavior after production shell work.
- Review the densest sections for student reading fatigue.
- Add route-level smoke tests for any new production routes created in Phase 4.
- Consider a small content split if production bundle analysis later shows a real issue.

### Accepted limitations

- Only two deterministic checking questions are supported.
- No persisted chapter progress exists.
- No authentication exists.
- No database-backed Dashboard exists.
- No AI Assistant implementation exists.
- No OCR or notebook/photo checking exists.
- Many advanced accounting topics remain deferred.
- Display-only recap/reveal cards are not checkers.
- Existing beginner `/practice` and `/practice/advanced` remain separate from this chapter preview.

### Recommended Phase 4 migration sequence

Do not migrate the whole experience as a single risky replacement.

Recommended controlled sequence:

1. Production application shell with no accounting behavior changes.
2. Chapters index route with Journal Entries marked as the first active chapter.
3. Journal Entries read-only sections 1-4.
4. Journal Entries read-only sections 5-8.
5. Journal Entries read-only sections 9-12.
6. Journal Entries read-only sections 13-16, including recap links.
7. Two deterministic Practice It Yourself questions with server-only answer keys.
8. Solver hub mapping to existing solver pages without removing old URLs.
9. Practice hub mapping while keeping beginner `/practice` stable.
10. Dashboard static/browser-local foundation.
11. AI Assistant later, only after grounded tutor design is approved.

## 12. Founder Manual-Review Checklist

- Desktop navigation works and feels calm.
- Mobile navigation opens, closes, and remains reachable.
- All sixteen routes render.
- Previous/Next progression is correct.
- Section 16 links to Previous, Review from Beginning, and Back to Chapters.
- Outline active state matches the current route.
- Accounting accuracy is sampled across cash/bank, capital/drawings, purchases/sales, expenses/income, assets/liabilities, and recap examples.
- The two supported checker questions accept correct answers.
- Deliberately wrong answers fail with useful feedback.
- Reset works independently for both editors.
- Correct-answer reveal appears only after an attempt.
- Keyboard navigation works through menu, outline, forms, feedback, and reveal cards.
- Phone-width pages have no horizontal overflow.
- Long account names wrap safely.
- Visual spacing remains suitable for long study sessions.
- Final recap links behave as expected.

## Phase 3V Change Summary

Small fixes made:

- None.

Tests added:

- None. Existing focused tests already covered the audit scope, so no duplicate assertions were added.

Production migration:

- Not started.

Live routes changed:

- None.
