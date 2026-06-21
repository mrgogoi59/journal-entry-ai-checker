# Founder/Mobile Pilot Rehearsal Audit

Phase: 5H

Status: audit-only

Verdict: ready for a guided 10-20 student pilot with founder/teacher supervision.

This rehearsal did not change runtime behavior. It did not add Practice It Yourself questions, checker support, expected answers, parser/classifier/validator logic, Solver logic, accounting engines, API routes, persistence, OCR, payments, database/auth, progress, AI Assistant behavior, analytics events, or route migrations.

## Scope Rehearsed

The rehearsal followed `docs/student-pilot-script.md` and checked the current pilot path:

1. Home
2. `/chapters/journal-entries`
3. First 3-5 Journal Entries sections
4. The two existing Practice It Yourself checkers
5. `/practice/journal-entries`
6. Optional `/journal-entry-solver`
7. Optional `/solver`

The audit used these code/test surfaces as the source of truth:

- `app/page.tsx`
- `app/chapters/journal-entries/JournalEntriesSectionPage.tsx`
- `app/chapters/journal-entries/JournalEntriesLearningBlocks.tsx`
- `components/learning-platform/JournalEntryPracticeEditor.tsx`
- `app/practice/page.tsx`
- `app/practice/journal-entries/page.tsx`
- `app/journal-entry-solver/page.tsx`
- `app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx`
- `app/solver/page.tsx`
- `components/MobileBottomNav.tsx`
- `tests/student-platform-chapters-page.test.ts`
- `tests/practice-page.test.ts`

## First-Click Clarity

Home is ready for the pilot. The main first action is `Start Journal Entries`, and it links directly to `/chapters/journal-entries`. Secondary choices stay calmer: Chapters, Solver, and Practice are available, while AI Assistant remains clearly `Coming soon` with no live route.

The recommended first path is visible and simple:

1. Start with Journal Entries
2. Read one short section
3. Try Practice It Yourself
4. Use Solver if stuck

Rehearsal note: students should still be asked to start naturally from Home so the pilot can confirm whether the first click is obvious without founder explanation.

## Journal Entries Overview

The Journal Entries overview is ready for a guided pilot. It explains that Journal Entries are the first recording step, states that 16 learning sections are available, and clearly says exactly 2 Practice It Yourself checkers are live in Section 1.

The overview also avoids overpromising. It says most sections are read-only and that more checking should wait for safe checker design.

## First 3-5 Sections

The first five pilot sections are ready for guided review:

- `introduction-to-journal-entries`
- `business-transactions`
- `accounts-affected`
- `types-of-accounts`
- `debit-and-credit-rules`

Each of these sections has a compact `Section pilot guide` with:

- what the section teaches
- why it matters
- what to pay attention to
- the next learning step
- a rule to remember
- a study-the-example tip
- links to Explainer and Practice

The later sections are not accidentally given the same pilot guide treatment. Section 6 and beyond remain regular learning sections unless intentionally polished later.

## Checker Readiness

The in-chapter checker scope remains exactly two questions:

- `Sold goods for cash Rs 12,000`
- `Paid salary by bank Rs 8,000`

Both checker areas now explain how to attempt the answer, likely accounts involved, why Dr./To, accounts, amounts, totals, and narration matter, and what to do after checking.

Post-check guidance links to:

- `/journal-entry-solver` when stuck
- `/practice/journal-entries` for revision

Rehearsal note: the founder should watch whether students enter a complete journal entry or expect multiple choice.

## Practice Readiness

`/practice` and `/practice/journal-entries` are ready as the revision part of the pilot. The Practice hub distinguishes guided in-chapter checks from independent revision. Journal Entries is the available chapter practice route, while advanced practice remains separate as beta.

Rehearsal note: students should be asked what they think Practice is for, to confirm they understand it as revision after learning rather than the first learning path.

## Explainer Readiness

`/journal-entry-solver` is ready as optional support when a student is stuck. It is shell-wrapped, has a clear transaction input, still uses the existing `/api/journal-entry-solver` boundary, and links back to Solver plus supported topics.

The Explainer should be introduced during the pilot as targeted help, not as the main lesson.

## Solver Readiness

`/solver` is ready for a short optional tour. It explains that Chapters teach step by step while Solver tools help with a specific problem. It links to the currently available solver tools without pretending that future AI Assistant behavior is live.

## Mobile Pilot Notes

The current pilot surfaces are mobile-safe by structure:

- Home uses wrapping CTAs and `overflow-x-hidden`.
- Journal Entries pages use `min-w-0`, stacked grids, and responsive cards.
- The checker editor uses mobile fieldsets instead of requiring a wide table.
- Feedback and correct-answer reveal cards are stacked and compact.
- Solver result tables use scoped horizontal scrolling where needed.
- `MobileBottomNav` is hidden on shell-owned routes such as `/chapters/*`, `/practice`, `/practice/journal-entries`, `/solver`, `/journal-entry-solver`, and the migrated solver tool routes.

Rehearsal note: this audit did not replace a real small-screen manual run. The founder should still test at least one narrow mobile screen during the pilot rehearsal.

## Must Fix Before Pilot

No must-fix blocker was found during this audit.

If a final manual pass finds a broken link, misleading sentence, obvious mobile overflow, or typo, fix only that tiny blocker before inviting students.

## Nice To Fix After Pilot

- Shorten any section that students consistently say feels long.
- Improve examples that students skip or misunderstand.
- Add one more deterministic checker only if students understand the existing two and ask for more practice.
- Consider a simple feedback-capture form or spreadsheet after the first pilot, outside the runtime app.
- Add screenshots or a short founder walkthrough only if students need setup help.

## Do Not Build Yet

Do not build these before the first guided pilot:

- login, auth, database, or saved cloud progress
- OCR/photo/notebook checking
- payments
- AI Assistant logic
- broad all-chapter expansion
- new Practice It Yourself questions
- unsupported advanced accounting cases
- broad `/tools` migration or route redesign
- checker/parser/classifier/validator rewrites
- accounting-engine changes

## Final Recommendation

Proceed to a guided 10-20 student pilot with founder/teacher observation.

Recommended next phase:

- Phase 5I: Pilot launch package and founder checklist

Phase 5I should package the pilot logistics, device checklist, final founder script, observation sheet, and post-pilot decision checklist. It should not add runtime wiring or new accounting support.
