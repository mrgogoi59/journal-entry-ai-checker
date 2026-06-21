# Solver Route Migration Plan

Internal document. Not rendered in the app, not linked from public UI, and not placed in `public/`.

Audit date: 2026-06-21

Phase: 4J

## Verdict

`Ready for one-page Solver tool migration`

Selected first tool: `AI Journal Entry Explainer`

Current route: `/journal-entry-solver`

Recommended next phase: `Phase 4K: controlled migration of AI Journal Entry Explainer into StudentAppShell`

No Solver tool was migrated during Phase 4J. No tool UI, accounting engine, parser/classifier/validator/checker logic, API route, metadata, route redirect, persistence, analytics, or accounting calculation was changed.

## 1. Route Inventory

| Tool area | Route | Page/component files | Metadata | Complete student interface | Client state | API/engine boundary | Query params | History/progress | Global mobile nav | Own header/nav | Mobile notes | Tests | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI Journal Entry Explainer | `/journal-entry-solver` | `app/journal-entry-solver/page.tsx`, `app/api/journal-entry-solver/route.ts`, `lib/journal-entry-solver.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState`, `useRef` | Calls `POST /api/journal-entry-solver` | None found | No saved history/progress | Visible and active as `Tools` today | Yes, standalone Home/Supported Topics header | Uses overflow-safe result tables; affected-accounts table is horizontally scrollable | `tests/journal-entry-solver-route.test.ts`, `tests/student-platform-chapters-page.test.ts` | Ready candidate |
| Ledger Posting | `/ledger` | `app/ledger/page.tsx`, `lib/ledger-engine.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState` | Calls `generateLedger` in client page | None found | No saved history/progress | Visible and active as `Tools` today | Yes, standalone Home/Tools/Supported Topics header | Ledger posting tables use horizontal scroll; shell width should be checked | `tests/ledger-engine.test.ts`, `tests/student-platform-chapters-page.test.ts`, compatibility tests | Ready after small wrapper fixes |
| Trial Balance | `/trial-balance` | `app/trial-balance/page.tsx`, `lib/trial-balance-engine.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState` | Calls `generateTrialBalance` in client page | None found | No saved history/progress | Visible and active as `Tools` today | Yes, standalone Home/Tools/Supported Topics header | Trial Balance tables use horizontal scroll; shell width should be checked | `tests/trial-balance-engine.test.ts`, `tests/student-platform-chapters-page.test.ts`, compatibility tests | Ready after small wrapper fixes |
| Final Accounts | `/final-accounts` | `app/final-accounts/page.tsx`, `lib/final-accounts-engine.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState` | Calls `generateFinalAccounts` in client page | None found | No saved history/progress | Visible and active as `Tools` today | Yes, standalone Home/Tools/Supported Topics header | High table density; many sections and wide adjustment/final-account tables | `tests/final-accounts-engine.test.ts`, `tests/final-accounts-practice-generator.test.ts`, `tests/student-platform-chapters-page.test.ts` | Ready after small wrapper fixes |
| Bank Reconciliation Statement | `/bank-reconciliation` | `app/bank-reconciliation/page.tsx`, `lib/bank-reconciliation-engine.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState` | Calls `calculateBankReconciliation` in client page | None found | No saved history/progress | Not marked active by current global `MobileBottomNav` Tools rule | Yes, standalone Home/Tools/Learn BRS header | Working-notes table is horizontally scrollable; form grid is mobile-conscious | `tests/bank-reconciliation-engine.test.ts`, `tests/student-platform-chapters-page.test.ts` | Ready after small wrapper fixes |
| Legacy Tools hub and checker | `/tools` | `app/tools/page.tsx`, `app/api/check-entry/route.ts`, `lib/attempt-history.ts` | Inherits root metadata; no route metadata export because page is a client component | Yes | `useState` | Calls `POST /api/check-entry` | No route query dependency found | Saves checker attempts to browser-local attempt history | Visible and active as `Tools` today | Yes, standalone Home/Start/Practice/Tools header | Large mixed hub/checker page; migration should not be first | `tests/student-platform-chapters-page.test.ts`, checker/API tests | Ready after small wrapper fixes |
| Attempt History | `/history` | `app/history/page.tsx`, `lib/attempt-history.ts` | Inherits root metadata; client component | Supporting review page, not a Solver tool | `useState`, `useEffect`, `useMemo` | Browser-local helper only | None found | Reads browser-local attempt history | Visible legacy global nav | Own header/nav | Not part of first Solver route migration | `tests/attempt-history.test.ts` | Not a complete student-facing Solver tool |
| Weak Areas / Progress | `/progress` | `app/progress/page.tsx`, `lib/attempt-history.ts` | Inherits root metadata; client component | Supporting review page, not a Solver tool | `useState`, `useEffect` | Browser-local helper only | None found | Reads browser-local attempt history | Visible legacy global nav | Own header/nav | Not part of first Solver route migration | `tests/attempt-history.test.ts` | Not a complete student-facing Solver tool |

## 2. Solver Catalogue Accuracy Audit

Status: pass.

`lib/learning-platform/solver-catalog.ts` contains exactly five Solver cards:

1. AI Journal Entry Explainer
2. Ledger Posting
3. Trial Balance
4. Final Accounts
5. Bank Reconciliation Statement

Findings:

- All five cards are honestly marked `available` because each has a real student-facing route.
- Available cards link to valid routes:
  - `/journal-entry-solver`
  - `/ledger`
  - `/trial-balance`
  - `/final-accounts`
  - `/bank-reconciliation`
- No Solver catalogue card links to `/platform-preview`.
- No planned/later fake links exist in the current catalogue.
- Catalogue descriptions match the current capability at a high level.
- No catalogue/runtime correction was required.

Evidence:

- `tests/student-platform-chapters-page.test.ts` covers the Solver route, five-card catalogue, available hrefs, absence of preview links, and route files for the five tools.

## 3. AI Journal Entry Explainer Readiness

Readiness: `Ready candidate`

Risk rating: `Low risk`

Current behavior:

- Route: `/journal-entry-solver`
- UI: complete student-facing transaction explainer.
- Input: one business transaction textarea.
- Submit flow: `Explain Journal Entry` button calls `POST /api/journal-entry-solver`.
- Output supports solved, ambiguous, and unsupported states.
- Solved output shows final journal entry, narration, affected accounts, step-by-step logic, common mistakes, practice prompt, and next actions.
- Next actions include `Practice Similar`, `Check My Answer`, and `View Supported Topics`.
- `Practice Similar` points to `/practice/journal-entries`.
- Supported Topics points to `/supported-transactions`.
- It does not save history/progress.
- It does not use query parameters.

Shell migration assessment:

- It can be wrapped in `StudentAppShell` without solver logic changes.
- The likely implementation should extract/reuse the current page body as a route-neutral client component.
- Remove or adapt the current standalone header nav to avoid duplicate navigation inside the shell.
- Preserve the existing `/journal-entry-solver` route path.
- Hide the global `MobileBottomNav` on exact `/journal-entry-solver` once the shell owns navigation there.
- Keep all API and `lib/journal-entry-solver.ts` logic unchanged.

Potential wrapper issues:

- Duplicate header risk from current standalone hero/header.
- Duplicate navigation risk from current Home/Supported Topics nav plus shell nav.
- Mobile bottom navigation conflict unless exact route is hidden after shell migration.
- Result tables have horizontal scroll and should be manually checked inside the shell width.
- Metadata is currently inherited from root because the page is a client component; a future migration can add a small server wrapper with route metadata if desired.

## 4. Ledger Tool Readiness

Readiness: `Ready after small wrapper fixes`

Risk rating: `Medium risk`

Current behavior:

- Route: `/ledger`
- UI: complete student-facing Ledger Posting tool.
- Input: journal-entry textarea with examples.
- Output: parsed entries, ledger accounts, posting logic, common mistakes, report issue.
- Engine: `generateLedger` from `lib/ledger-engine.ts` runs in the client page.
- No API route, query parameter, or history/progress dependency.

Migration cautions:

- Do not mark Ledger Impact previews as the full Ledger tool; `/ledger` is the complete student-facing interface.
- Current page has standalone Home/Tools/Supported Topics header.
- Ledger account cards contain two posting tables and use horizontal scroll.
- Shell migration should come after the first Explainer wrapper pattern is proven.

## 5. Trial Balance Tool Readiness

Readiness: `Ready after small wrapper fixes`

Risk rating: `Medium risk`

Current behavior:

- Route: `/trial-balance`
- UI: complete student-facing Trial Balance tool.
- Input: journal-entry textarea with examples.
- Output: parsed entries, ledger balance summary, trial balance table, balance result, logic, common mistakes, report issue.
- Engine: `generateTrialBalance` from `lib/trial-balance-engine.ts` runs in the client page.
- No API route, query parameter, or history/progress dependency.

Migration cautions:

- Do not confuse Trial Balance Impact preview cards with this full direct solver route.
- Result tables use horizontal scroll and need phone-width QA inside the shell.
- Current page has standalone Home/Tools/Supported Topics header.

## 6. Final Accounts Tool Readiness

Readiness: `Ready after small wrapper fixes`

Risk rating: `Medium risk`

Current behavior:

- Route: `/final-accounts`
- UI: complete student-facing Final Accounts tool for selected student-level workflows.
- Input: trial-balance balances textarea and adjustments textarea.
- Output: parsed balances, parsed adjustments, Trading Account, Profit & Loss Account, Balance Sheet, working sections, warnings, unclassified items, logic, common mistakes, report issue.
- Engine: `generateFinalAccounts` from `lib/final-accounts-engine.ts` runs in the client page.
- No API route, query parameter, or history/progress dependency.
- Page clearly shows known limitations.

Migration cautions:

- Do not overstate Final Accounts Impact metadata/cards as this full solver. The complete route is `/final-accounts`.
- The page is wide and dense, with several large tables and collapsible/mobile sections.
- It should not be the first shell migration because wrapper QA would be heavier.

## 7. Bank Reconciliation Statement Readiness

Readiness: `Ready after small wrapper fixes`

Risk rating: `Medium risk`

Current behavior:

- Route: `/bank-reconciliation`
- UI: complete student-facing BRS calculator.
- Input: starting source, balance type, balance amount, dynamic adjustment rows.
- Output: final balance, warnings, working notes table, simple explanation, common mistakes, learning links.
- Engine: `calculateBankReconciliation` from `lib/bank-reconciliation-engine.ts` runs in the client page.
- No API route, query parameter, or history/progress dependency.

Migration cautions:

- Current global mobile nav does not mark `/bank-reconciliation` active under Tools, unlike the other direct tool routes.
- Working notes use a wide scrollable table.
- Current page has standalone Home/Tools/Learn BRS header.
- Useful candidate after the Explainer/standard tool wrapper pattern is proven.

## 8. Legacy `/tools` Hub Audit

Readiness: `Ready after small wrapper fixes`, but not recommended first.

Current purpose:

- Legacy utility shelf and Journal Entry Checker workspace.
- Links to Explainer, topic-wise practice, Ledger, Trial Balance, Final Accounts, BRS, workflow practice routes, History, Progress, Supported Topics, and How to Use.
- Calls `POST /api/check-entry` for the embedded Journal Entry Checker.
- Saves checker attempts through `saveAttemptHistoryItem`.

Plan:

- Keep `/tools` available as a legacy route for now.
- Do not redirect or remove `/tools` in Phase 4K.
- Do not merge `/tools` into `/solver` yet because it includes both solver links and a checker workspace with browser-local attempt history.
- Future migration should decide whether `/tools` remains a legacy utility shelf, becomes a checker route, or redirects only after all direct Solver routes are safely wrapped.

External/internal dependencies:

- Current standalone tool pages link back to `/tools`.
- Supported Topics and How To Use link to `/tools`.
- Learning content still contains many `/tools` links.
- Existing global mobile nav uses `/tools` as the Tools tab destination.

## 9. Shared-Shell Compatibility Checklist

| Candidate | Can render in `StudentAppShell` | Header/nav cleanup | Mobile nav update | Query preservation | Contextual links | API/actions | Metadata | Accessibility | Engine isolation | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/journal-entry-solver` | Yes | Remove/adapt standalone Home/Supported Topics nav | Hide exact `/journal-entry-solver` after shell migration | No query params found | Preserve Practice Similar and Supported Topics | Keep `POST /api/journal-entry-solver` unchanged | Optional server wrapper metadata | Preserve textarea label, buttons, result tables | Keep `lib/journal-entry-solver.ts` untouched | Low |
| `/ledger` | Yes | Remove/adapt standalone Home/Tools/Supported Topics nav | Hide exact `/ledger` after shell migration | No query params found | Preserve Supported Topics/report issue | Keep `generateLedger` untouched | Optional server wrapper metadata | Table focus/scroll QA needed | Keep `lib/ledger-engine.ts` untouched | Medium |
| `/trial-balance` | Yes | Remove/adapt standalone Home/Tools/Supported Topics nav | Hide exact `/trial-balance` after shell migration | No query params found | Preserve Supported Topics/report issue | Keep `generateTrialBalance` untouched | Optional server wrapper metadata | Table focus/scroll QA needed | Keep `lib/trial-balance-engine.ts` untouched | Medium |
| `/final-accounts` | Yes | Remove/adapt standalone Home/Tools/Supported Topics nav | Hide exact `/final-accounts` after shell migration | No query params found | Preserve Supported Topics/report issue | Keep `generateFinalAccounts` untouched | Optional server wrapper metadata | Heavy table/collapsible QA needed | Keep `lib/final-accounts-engine.ts` untouched | Medium |
| `/bank-reconciliation` | Yes | Remove/adapt standalone Home/Tools/Learn BRS nav | Hide exact `/bank-reconciliation` after shell migration | No query params found | Preserve Learn BRS and Practice Journal Entries | Keep `calculateBankReconciliation` untouched | Optional server wrapper metadata | Dynamic rows and wide working table QA needed | Keep `lib/bank-reconciliation-engine.ts` untouched | Medium |

## 10. First One-Page Migration Recommendation

Selected tool: `AI Journal Entry Explainer`

Exact current route: `/journal-entry-solver`

Reason:

- It is already complete and student-facing.
- It has the strongest focused route/API tests through `tests/journal-entry-solver-route.test.ts`.
- It is high-value because Solver recommends students start there.
- It has lower accounting-scope risk than Final Accounts, BRS, Ledger, or Trial Balance because it should preserve one existing API boundary.
- It does not require an engine rewrite, API redesign, database/auth/persistence, new route, or redirect.
- It has fewer large result tables than the workflow tools, though affected-accounts output still needs mobile QA.

Recommended Phase 4K behavior:

- Keep the route path `/journal-entry-solver`.
- Create a small server page wrapper if needed for metadata and `StudentAppShell activeItem="solver"`.
- Extract the existing client UI into a route-neutral component, for example `app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx`.
- Remove or hide the standalone Home/Supported Topics header nav inside the shell-wrapped route to avoid duplicate navigation.
- Preserve the hero title and student-facing explanation copy unless the wrapper makes it visually redundant.
- Preserve current input, submit, examples, loading, error, solved, ambiguous, unsupported, next actions, feedback report, and API behavior.
- Update `components/MobileBottomNav.tsx` to hide only exact `/journal-entry-solver` once the shell owns navigation there.
- Do not hide global mobile navigation from unrelated legacy routes.

Files expected to change in Phase 4K:

- `app/journal-entry-solver/page.tsx`
- possible new `app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx`
- `components/MobileBottomNav.tsx`
- focused tests in `tests/student-platform-chapters-page.test.ts` and `tests/journal-entry-solver-route.test.ts` only if needed
- docs memory files after the migration

Tests required in Phase 4K:

- `/journal-entry-solver` renders inside `StudentAppShell`.
- Solver is active in shell navigation.
- Existing Explainer input/result route/API tests still pass.
- `Practice Similar` still points to `/practice/journal-entries`.
- Supported Topics links still point to `/supported-transactions`.
- No `/platform-preview` link appears.
- `MobileBottomNav` is hidden on exact `/journal-entry-solver`.
- No parser/classifier/validator/checker/solver logic changed.

Rollback strategy:

- Revert only the wrapper/component extraction and mobile-nav route guard.
- Keep `/journal-entry-solver` as the stable route throughout, so rollback does not require redirect cleanup.
- Because the API and solver logic must remain untouched, rollback should not affect accounting behavior.

## 11. Routes That Should Remain Planned

- `/ledger`: complete, but migrate after the Explainer wrapper pattern because ledger account tables need shell-width and phone-width QA.
- `/trial-balance`: complete, but migrate after Ledger/Explainer pattern because table density and balance-summary output need shell QA.
- `/final-accounts`: complete, but defer because it is the densest route with many sections, wide adjustment tables, and selected-scope limitations.
- `/bank-reconciliation`: complete, but defer until after the first wrapper because it has dynamic adjustment rows and a wide working-notes table.
- `/tools`: keep legacy for now; it mixes a hub, checker workspace, and attempt-history saving.
- `/history` and `/progress`: supporting review pages, not first Solver tool migrations.

Do not create placeholder production routes for any of these tools.

## 12. Backward-Compatibility Plan

For the selected first tool:

- Keep existing route path `/journal-entry-solver`.
- Do not add a redirect.
- Existing direct bookmarks continue to work.
- Solver catalogue continues to link to `/journal-entry-solver`.
- Supported Topics and How To Use links continue to work.
- Learning-content `Try Explainer` links continue to work.
- `/tools` links to Explainer continue to work.
- Post-result `Practice Similar` remains `/practice/journal-entries`.
- Post-result `Check My Answer` remains `/tools` for now.
- No query parameters were found that need preservation.

## 13. Mobile Navigation Plan

Current production shell owns navigation on:

- `/dashboard`
- `/chapters`
- `/chapters/*`
- `/solver`
- `/practice`
- `/practice/journal-entries`
- `/practice/journal-entries/*`

Phase 4K should add one exact guard:

- hide global `MobileBottomNav` on exact `/journal-entry-solver`

Do not add a broad `/journal-entry-solver/*` guard unless nested result routes are introduced, which is not planned.

Do not hide it from:

- `/tools`
- `/ledger`
- `/trial-balance`
- `/final-accounts`
- `/bank-reconciliation`
- `/history`
- `/progress`
- unrelated legacy routes

## 14. Security and Data Audit

The proposed first migration does not require:

- authentication
- database
- new API routes
- persistence
- custom analytics events
- personal data
- file upload
- OCR
- payments
- AI Assistant

Existing behavior to preserve:

- `/journal-entry-solver` calls only existing `POST /api/journal-entry-solver`.
- The Explainer does not save attempt history/progress.
- Feedback report UI remains client-side copy/report assistance.
- Vercel Web Analytics remains unchanged.

## Critical Blockers

None.

## High-Priority Wrapper Fixes For Phase 4K

- Extract the Explainer UI into a client component without changing its logic.
- Wrap `/journal-entry-solver` in `StudentAppShell activeItem="solver"`.
- Remove or adapt standalone local header navigation to avoid duplicate navigation.
- Hide global `MobileBottomNav` only on exact `/journal-entry-solver`.
- Run manual mobile QA for result tables and textareas inside shell width.
- Preserve all current links, especially `/practice/journal-entries`, `/tools`, and `/supported-transactions`.

## Accepted Limitations

- Other Solver routes remain standalone legacy pages.
- Existing `/tools` remains available.
- Tool logic is unchanged.
- No unified Solver history/progress is introduced.
- No route redirects are introduced.
- No AI Assistant is introduced.
- No persistence improvement is introduced.

## Founder Manual-Review Checklist For Selected Tool

- Open `/journal-entry-solver`.
- Enter a supported transaction and confirm correct output appears.
- Enter an unsupported or ambiguous transaction and confirm safe unsupported/ambiguous output appears.
- Confirm final journal entry table remains readable.
- Confirm affected accounts table scrolls safely on mobile.
- Confirm step-by-step logic and common mistakes remain readable.
- Confirm `Practice Similar` opens `/practice/journal-entries`.
- Confirm `Check My Answer` opens `/tools`.
- Confirm `View Supported Topics` opens `/supported-transactions`.
- Confirm keyboard focus reaches textarea, examples, submit button, and result actions.
- Confirm no horizontal page overflow.
- Confirm no duplicate navigation after shell wrapping.
- Confirm no engine/API behavior changed.

## Verification

Phase 4J should be verified with:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

At the time of writing, focused Solver route and catalogue tests pass after the Phase 4J baseline route-render assertion was added.
