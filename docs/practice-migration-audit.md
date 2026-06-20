# Practice Migration Safety Audit

Internal document. Not rendered in the app, not linked from public UI, and not placed in `public/`.

Audit date: 2026-06-21

Phase: 4I

## Verdict

`Ready for continued platform integration`

No critical route, link, beginner-practice parity, Advanced Practice isolation, mobile-navigation, accessibility, security, data, or documentation-rule blockers were found in the current Practice migration.

This verdict approves only the next controlled planning or migration slice. It does not add new Practice questions, OCR, uploads, camera access, login, database, persistence, API routes, custom analytics, AI Assistant behavior, new accounting support, or checker/accounting logic changes.

## Scope Audited

Routes covered:

| Area | Route | Result |
| --- | --- | --- |
| Practice hub | `/practice` | Production Practice hub inside `StudentAppShell` |
| Beginner Journal Entry Practice | `/practice/journal-entries` | Preserved beginner topic-wise practice inside `StudentAppShell` |
| Advanced Practice Beta | `/practice/advanced` | Remains isolated from the production Practice shell migration |

Files and route families checked:

- `app/practice/page.tsx`
- `app/practice/journal-entries/page.tsx`
- `app/practice/_components/JournalEntryPracticeExperience.tsx`
- `app/practice/advanced/page.tsx`
- `lib/learning-platform/practice-catalog.ts`
- `components/MobileBottomNav.tsx`
- `components/student-platform/navigation.ts`
- contextual Practice links in Solver, Tools, Progress, History, Bank Reconciliation, Attempt History, and learning content
- existing Advanced Practice route and generator tests

## 1. Route Audit

Status: pass.

Findings:

- `/practice` renders the production Practice hub.
- `/practice/journal-entries` renders the migrated beginner Journal Entry Practice experience.
- `/practice/advanced` remains on its existing beta route.
- No redirect loop was introduced; the migrated Practice routes do not use redirects or route pushes.
- Production Practice routes do not add `robots` metadata, so no `noindex` was added.
- The production Practice hub does not link to `/platform-preview`.
- The Practice hub does not falsely link to planned chapter-practice routes.
- Journal Entries is the only available chapter-practice card.
- Advanced Practice Beta links only to `/practice/advanced`.

Evidence:

- `tests/practice-page.test.ts` covers Practice hub rendering, metadata, `StudentAppShell`, production hrefs, absence of preview links, and the available/planned/later card behavior.

Small fixes made:

- Added focused Phase 4I audit assertions only. No runtime route fixes were required.

## 2. Beginner Practice Parity Audit

Status: pass.

Findings:

- The original beginner topic-wise Journal Entry Practice experience now lives in `app/practice/_components/JournalEntryPracticeExperience.tsx`.
- The migrated `/practice/journal-entries` route renders that component inside `StudentAppShell`.
- Existing question generation still calls `POST /api/generate-practice-question`.
- Existing answer checking still calls `POST /api/check-entry`.
- Existing attempt-history integration still uses `saveAttemptHistoryItem`.
- Existing topic IDs remain present, including `basics` and `mixed`.
- Existing actions remain present, including `Try Another Question` and `Retry Same Question`.
- Existing empty-answer and API-error states remain in the migrated component.
- The migration did not change parser, classifier, validator, checker, scoring, feedback, generation, or accounting logic.

Evidence:

- `tests/practice-page.test.ts` pins the migrated component's API calls, topic surface, attempt-history integration, retry/next actions, and shell route.
- The full regression suite remains the parity backstop for the existing beginner generator and checker behavior.

Small fixes made:

- None required.

## 3. Backward-Compatible Link Audit

Status: pass.

Findings:

- General Practice links remain pointed at `/practice`.
- Contextual beginner Journal Entry Practice links now point to `/practice/journal-entries`.
- No current contextual `/practice` query strings were found that needed preservation.
- No general Practice navigation incorrectly bypasses the Practice hub.
- No contextual beginner-practice entry point now lands only on the generic Practice hub.

General Practice links that correctly remain `/practice`:

- homepage Practice navigation and CTAs
- Dashboard Practice shortcut
- student-platform sidebar Practice item
- global mobile navigation Practice item
- learning-page general Practice breadcrumbs/links
- legacy workflow-practice back links

Contextual Journal Entry Practice links that correctly use `/practice/journal-entries`:

- Journal Entry Explainer `Practice Similar`
- Tools page Journal Entry Practice actions
- Progress recommendations and topic CTAs
- History empty-state practice CTA
- Bank Reconciliation learning link
- attempt-history recommendations
- Journal Entry related learning-content tool links

Evidence:

- `tests/practice-page.test.ts` asserts the changed contextual link destinations and the general Practice destinations.

Small fixes made:

- None required.

## 4. Changed-File Link Audit

Status: pass.

Findings:

| File | Audit result |
| --- | --- |
| `app/tools/page.tsx` | Journal Entry practice actions use `/practice/journal-entries`; workflow links remain on their legacy workflow routes. |
| `app/journal-entry-solver/page.tsx` | `Practice Similar` uses `/practice/journal-entries`; `Check My Answer` remains on the checker route. |
| `app/progress/page.tsx` | contextual beginner-practice links use `/practice/journal-entries`; breadcrumb back to Practice remains `/practice`. |
| `app/history/page.tsx` | empty-state beginner-practice CTA uses `/practice/journal-entries`; breadcrumb back to Practice remains `/practice`. |
| `app/bank-reconciliation/page.tsx` | Journal Entry learning link uses `/practice/journal-entries`. |
| `lib/attempt-history.ts` | practice recommendation links use `/practice/journal-entries`. |
| `lib/learning-content.ts` | Journal Entry, Practice Basics, and GST practice tool links use `/practice/journal-entries`; Ledger, Trial Balance, and Final Accounts workflow links remain unchanged. |

No query or context data loss was found.

## 5. Practice Catalogue Audit

Status: pass.

The typed Practice catalogue contains exactly twelve chapter groups:

1. Accounting Fundamentals
2. Journal Entries
3. Ledger
4. Trial Balance
5. Bank Reconciliation Statement
6. Rectification of Errors
7. Depreciation, Provisions and Reserves
8. Final Accounts
9. Bills of Exchange
10. Not-for-Profit Accounts
11. Partnership Accounts
12. Company Accounts

Findings:

- Journal Entries is `Available`.
- Journal Entries links to `/practice/journal-entries`.
- Other chapter cards are `Planned` or `Later`.
- Planned and Later cards are not links.
- No fake question counts or fake accuracy/progress are shown.
- No card links to hidden engines or `/platform-preview`.

Evidence:

- `tests/practice-page.test.ts` pins the catalogue count, order, available card, and non-clickable planned/later cards.

## 6. Advanced Practice Isolation Audit

Status: pass.

Findings:

- `/practice/advanced` is not wrapped in `StudentAppShell`.
- The global mobile bottom navigation remains unchanged on `/practice/advanced`.
- Advanced Practice route, question-bank count, question order, Partnership scenarios, Company scenarios, Mixed/all order, checking behavior, correct-answer display, `Why this entry?`, Ledger Impact, Trial Balance Impact, and Final Accounts Impact coverage remain protected by existing tests.
- No additional Advanced Practice scenarios were exposed by the Practice hub migration.

Evidence:

- `tests/practice-page.test.ts` verifies Advanced Practice is isolated from the production shell migration.
- `tests/advanced-practice-page.test.ts` and `tests/accounting-core-advanced-practice-question-generator.test.ts` continue to pin the advanced route/order/count and post-check preview behavior.

## 7. Student-Platform Shell Audit

Status: pass.

Findings:

- `/practice` uses `StudentAppShell`.
- `/practice/journal-entries` uses `StudentAppShell`.
- Practice is active on both routes.
- Dashboard links to `/dashboard`.
- Chapters links to `/chapters`.
- Solver links to `/solver`.
- Practice links to `/practice`.
- AI Assistant remains Coming soon and has no broken `/assistant` link.
- No duplicate top-level navigation was found on the migrated shell routes.
- The beginner Practice UI remains readable inside the shell through a route-neutral component wrapper.

## 8. Global Mobile Navigation Audit

Status: pass.

Findings:

- The legacy global mobile bottom navigation is hidden on exact `/practice`.
- It is hidden on `/practice/journal-entries`.
- It is hidden on nested `/practice/journal-entries/*`.
- It is not hidden by an overly broad `/practice/*` rule.
- It remains unchanged on `/practice/advanced` and other legacy routes.

Evidence:

- `tests/practice-page.test.ts` pins the exact mobile navigation guard strings and prevents a broad `/practice/` hide rule.

## 9. Practice Hub Content Audit

Status: pass.

Findings:

- The hub explains `Practice It Yourself inside Chapters` as guided, subtopic-tied checking.
- The hub explains `General Practice` as independent chapter-wise revision.
- The Advanced Practice Beta label is clear.
- The hub does not claim full Partnership or Company Accounts coverage.
- OCR/notebook/photo checking is clearly described as unavailable.
- No upload, camera, or fake coming-soon upload control exists.

## 10. Beginner Practice UI Audit

Status: pass with founder manual review recommended.

Findings:

- The migrated component uses a constrained `max-w-[1120px]` wrapper and `min-w-0`/responsive grids to reduce horizontal-overflow risk.
- The local beginner practice header was kept inside the component, while the route-level shell provides platform navigation.
- Inputs, topic cards, result cards, retry, next-question, reset/change-topic, and review links remain present.
- Students can return to the Practice hub through the active Practice shell navigation; a future optional inline `Back to Practice hub` link could improve clarity but is not blocking.

High-priority improvement:

- Founder should manually test `/practice/journal-entries` on a narrow phone viewport to confirm shell/sidebar spacing, focus behavior, and answer/result readability.

## 11. Accessibility Audit

Status: pass with manual review recommended.

Findings:

- The production shell provides semantic navigation and a main content target.
- `/practice` and `/practice/journal-entries` each have a clear page heading.
- Practice active state is exposed through `aria-current="page"`.
- Available chapter cards use real links.
- Planned/Later chapter cards are not fake links.
- Advanced Practice Beta is labelled in visible text.
- Status is communicated by text, not only by color.
- Beginner answer input retains labels and feedback remains text-based.
- No keyboard trap was found in source.

High-priority improvement:

- Founder should manually verify focus order and visible focus rings across `/practice`, `/practice/journal-entries`, and `/practice/advanced` on desktop and mobile.

## 12. No-Logic-Change Audit

Status: pass.

Findings:

Phase 4H and this Phase 4I audit did not alter:

- beginner question generator
- beginner checker
- advanced question generator
- advanced checker
- Journal Entry Explainer
- parser
- classifier
- validator
- accounting-core engines
- Ledger Impact
- Trial Balance Impact
- Final Accounts Impact
- accounting calculations

Evidence:

- Phase 4I changed only focused tests and documentation.
- Existing advanced generator/page tests and full regression tests continue to protect the accounting/checking boundaries.

## 13. Documentation-Rule Audit

Status: pass.

Findings:

- The Phase 4H `docs/ai-coding-rules.md` update is required, narrow, and reflects the route split:
  - `/practice` is the production Practice hub.
  - `/practice/journal-entries` is the preserved beginner topic-wise Journal Entry Practice surface.
  - `/practice/advanced` remains the separate beta surface.
- The rule does not conflict with valid future controlled migrations.
- No Phase 4I edit to `docs/ai-coding-rules.md` was needed.

## 14. Security and Data Audit

Status: pass.

Findings:

No new security/data surface was added:

- no API routes
- no database access
- no authentication
- no cookies
- no new localStorage or sessionStorage usage
- no progress persistence
- no attempt-history storage change beyond route references already completed in Phase 4H
- no image upload
- no camera access
- no OCR behavior
- no custom analytics events
- no personal data collection

Vercel Web Analytics remains unchanged.

## Critical Blockers

None.

## High-Priority Improvements

- Founder desktop/mobile manual review of `/practice`, `/practice/journal-entries`, and `/practice/advanced`.
- Confirm phone-width no-overflow behavior on topic selection, answer entry, feedback, and post-check cards.
- Confirm keyboard focus order and visible focus styles in the Practice hub, beginner Journal Entry Practice route, and mobile drawer.
- Decide whether `/practice/journal-entries` needs an inline `Back to Practice hub` link in addition to shell navigation.

## Medium-Priority Improvements

- Add a future manual QA screenshot pass for the Practice hub cards and migrated beginner Practice route.
- Consider a small route-readiness note for legacy workflow routes `/practice/ledger`, `/practice/trial-balance`, and `/practice/final-accounts` before any later shell migration.
- Review whether the old `/learn` lesson `Practice` links should remain general or become more contextual in a future content-specific slice.

## Accepted Limitations

- Only Journal Entries general chapter practice is available.
- Other chapter practice cards remain Planned or Later.
- Advanced Practice remains Beta.
- No OCR/notebook/photo checking is available.
- No persisted student progress was added.
- No authentication or database was added.
- No AI Assistant route or behavior was added.

## Recommended Next Phase

Recommended next controlled phase: Phase 4J, a Solver tool route shell-readiness audit and one-page migration plan.

Phase 4J should review the existing live solver/tool pages and choose exactly one low-risk available tool route for a later shell migration, most likely Journal Entry Explainer because it is already a stable student-facing route. Phase 4J should remain audit/planning-first unless explicitly approved to wrap one route. It must not change solver logic, parser/classifier/validator/checker behavior, APIs, accounting calculations, persistence, OCR, uploads, database/auth, custom analytics, or AI Assistant behavior.

Do not begin Phase 4J automatically.

## Founder Manual-Test Checklist

- Open `/practice`.
- Open `/practice/journal-entries`.
- Open `/practice/advanced`.
- Confirm the Journal Entries card opens `/practice/journal-entries`.
- Confirm the Advanced Practice Beta card opens `/practice/advanced`.
- Confirm homepage Practice link opens `/practice`.
- Confirm Dashboard Practice link opens `/practice`.
- Confirm sidebar Practice link opens `/practice`.
- Confirm Journal Entry Explainer `Practice Similar` opens `/practice/journal-entries`.
- Confirm there are no lost contextual query parameters; none are currently expected.
- Try a correct beginner answer.
- Try a wrong beginner answer.
- Try next question.
- Try retry/reset/change topic.
- Review the mobile shell on `/practice` and `/practice/journal-entries`.
- Confirm mobile Advanced Practice navigation remains unchanged.
- Confirm no horizontal overflow on phone width.
- Confirm keyboard focus is visible and moves logically.
- Confirm the OCR/notebook/photo checking note says the feature is unavailable and does not show upload or camera controls.

## Verification

Phase 4I should be verified with:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

At the time of writing, focused Practice and Advanced Practice tests pass after the Phase 4I audit assertions were added.
