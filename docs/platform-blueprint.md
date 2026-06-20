# AccyWise AI Platform Blueprint

This is an internal planning document. It is not rendered in the app, not linked from the UI, and not placed in `public/`.

## 1. Product Purpose

AccyWise AI is not merely a journal-entry solver. The target product is a mobile-first interactive Accountancy learning system for commerce students.

The platform should combine:

- a digital textbook
- a solved illustration book
- an interactive workbook
- accounting solver tools
- independent practice
- an AI tutor
- a student progress dashboard

The product should help students move from "I saw the answer" to "I can prepare the full accounting format myself." The learning experience should feel like a high-quality Accountancy textbook, but interactive, checkable, and mobile-safe.

## 2. Current-State Inventory

### Existing App Structure

Current app routes include:

| Current area | Existing route(s) | Notes |
| --- | --- | --- |
| Home | `/` | Landing page with links to learning, practice, and tools. |
| Learning | `/learn`, `/learn/<lesson-slug>` | 37 tracked lessons rendered through static lesson pages and `LessonReader`. |
| Beginner practice | `/practice` | Topic-wise beginner journal-entry practice. Must remain stable. |
| Advanced practice beta | `/practice/advanced` | Separate advanced journal practice using `lib/accounting-core`. |
| Solver/tools | `/tools`, `/journal-entry-solver`, `/ledger`, `/trial-balance`, `/final-accounts`, `/bank-reconciliation` | Current solver hub and individual accounting tools. |
| Practice tools | `/practice/ledger`, `/practice/trial-balance`, `/practice/final-accounts` | Separate practice experiences for workflow areas. |
| Review/progress | `/history`, `/progress`, `/dashboard` | Browser-local history/progress areas exist; `/dashboard` currently redirects to `/learn`. |
| Support pages | `/how-to-use`, `/supported-transactions` | Guidance and support boundaries. |
| API routes | `/api/check-entry`, `/api/generate-practice-question`, `/api/journal-entry-solver` | Existing runtime endpoints. No new API routes in this planning task. |

### Existing Components

- `components/MobileBottomNav.tsx` provides the current mobile bottom navigation.
- `components/FeedbackReport.tsx` is reused by checker/practice feedback flows.

### Existing Data and Engines

- `lib/learning-content.ts` contains lesson content, lesson cards, concept sections, solved examples, common mistakes, prompts, and tool links.
- `lib/lesson-progress.ts` stores browser-local lesson progress with `accywise_lesson_progress_v1`.
- `lib/attempt-history.ts` stores browser-local attempts with `accywise_attempt_history_v1`.
- `lib/journal-entry-solver.ts`, `lib/transaction-classifier.ts`, `lib/accounting-rules.ts`, `lib/expected-entry-generator.ts`, `lib/journal-parser.ts`, and `lib/entry-validator.ts` power current beginner journal workflows.
- `lib/ledger-engine.ts`, `lib/trial-balance-engine.ts`, `lib/final-accounts-engine.ts`, and `lib/bank-reconciliation-engine.ts` power existing solver/practice tools.
- `lib/accounting-core/` contains hidden/advanced company and partnership foundations, including advanced question generation, parsing adapters, checkers, serializers, scenario registry, and compatibility tests.

### Existing Tests

The project has focused tests for:

- routes: journal-entry solver, checker, practice question generation
- beginner engines: classifier, parser, validator, expected-entry generator, scoring
- solver engines: ledger, trial balance, final accounts, bank reconciliation
- practice generators: beginner, ledger, trial balance, final accounts
- browser-local progress/history helpers
- advanced accounting-core types, generators, serializers, parser adapters, answer checker, scenario registry, compatibility, and advanced practice page

### What Can Be Reused

- Existing lesson content and topic list can seed the future Chapters section.
- Existing Journal Entry Explainer can become part of Solver.
- Existing ledger, trial balance, final accounts, and BRS tools can become Solver tools.
- Existing beginner `/practice` can remain the first General Practice surface.
- Existing advanced practice beta can remain separate while the new chapter engine is designed.
- Existing engines can be reused behind future chapter checkers instead of rewritten.
- Existing tests can protect migration safety.
- Vercel Web Analytics is already installed for basic live-site analytics.

### What Should Remain Untouched Early

- Beginner `/practice` behavior.
- `/practice/advanced` question order/count and post-check flow.
- Parser, classifier, validator, checker, ledger, trial balance, final accounts, and BRS engines unless a future phase explicitly targets them.
- Existing API routes unless a future architecture phase explicitly designs a new route boundary.
- Browser-local storage keys.
- Vercel Analytics setup.

### What Is Missing

- A five-section app shell: Dashboard, Chapters, Solver, Practice, AI Assistant.
- A structured chapter/subtopic data model with solved illustrations and Practice It Yourself questions.
- A reusable chapter renderer.
- A reusable solved illustration renderer.
- A Practice It Yourself editor and answer schema.
- Chapter-specific feedback/checking models.
- A Solver hub route separate from the current `/tools` naming.
- A real dashboard experience.
- A grounded AI Assistant.
- A curriculum/concept map that organizes all chapters, subtopics, illustrations, and practice.

### Current Pages Mapped to Future Sections

| Future section | Current equivalent | Initial migration direction |
| --- | --- | --- |
| Dashboard | `/dashboard`, `/progress`, `/history` | Reuse ideas, but build later. Keep browser-local until database/login is approved. |
| Chapters | `/learn`, `/learn/<lesson-slug>` | Rename conceptually from Learn to Chapters later; reuse lesson content after a content-model redesign. |
| Solver | `/tools`, `/journal-entry-solver`, `/ledger`, `/trial-balance`, `/final-accounts`, `/bank-reconciliation` | Create `/solver` later as the tool hub; current pages can be reused or redirected later. |
| Practice | `/practice`, `/practice/ledger`, `/practice/trial-balance`, `/practice/final-accounts`, `/practice/advanced` | Keep independent from chapter Practice It Yourself. Beginner practice remains stable. |
| AI Assistant | None | Future section only. Must be grounded and constrained. |

## 3. Main Navigation Architecture

The future primary navigation should have five student-facing sections:

1. Dashboard
2. Chapters
3. Solver
4. Practice
5. AI Assistant

### Dashboard

Initial dashboard may contain:

- Continue Learning
- Recently Opened Chapter
- Recently Attempted Practice
- Chapters Started
- Chapters Completed
- Basic Progress
- Recommended Next Topic

Later phases may add login, database-backed history, cross-device progress, streaks, and personalized recommendations. These must not be implemented yet. The safe early dashboard should use existing browser-local progress only, or remain a static shell until the data design is approved.

### Chapters

Chapters are the main learning engine. Students should be able to choose any available chapter.

Intended chapter journey:

- Chapter introduction
- Subtopic
- Concept explanation
- Simple example
- Solved Illustration 1
- Solved Illustration 2
- Practice It Yourself
- Answer checking and explanation
- Next subtopic
- Increasing difficulty

### Solver

Solver is the on-demand tools hub. It should include:

- AI Journal Entry Explainer
- Ledger Posting
- Trial Balance
- Final Accounts
- Bank Reconciliation Statement

Solver tools answer immediate questions. Chapters provide complete structured learning.

### Practice

Practice is independent revision and assessment, separate from Practice It Yourself inside chapters.

General Practice may later include:

- chapter selection
- topic selection
- difficulty selection
- mixed questions
- revision sets
- chapter tests
- exam-style questions

Notebook/photo checking must remain unsupported for now. OCR and handwriting recognition are not yet part of the platform.

### AI Assistant

The AI Assistant is a future tutor, not a free-form accounting engine.

It should:

- explain concepts simply
- explain step by step
- use examples
- re-explain in another style
- answer doubts about the current chapter or illustration
- help students understand mistakes

It must be grounded in verified AccyWise content and deterministic accounting logic. It must not freely invent accounting treatment.

## 4. Chapter Learning Flow

Each chapter should follow a serial structure:

1. Chapter overview
2. Ordered subtopics
3. Concept explanation
4. Worked example
5. Solved illustrations from easy to hard
6. Practice It Yourself after relevant illustrations
7. Feedback
8. Next subtopic

The chapter experience should feel like a textbook plus workbook:

- explanatory enough for first-time learners
- structured enough for revision
- interactive enough for practice
- safe enough to avoid unsupported accounting assumptions

## 5. Solved Illustration Model

Solved illustrations should include, where relevant:

- question
- given information
- correct accounting format
- complete particulars
- debit/credit or To/By treatment
- amounts
- totals
- workings
- explanation
- common mistakes

Illustrations should increase gradually in difficulty. For example, a Trial Balance chapter might start with simple account placement and later include ledger balances, adjusted balances, suspense/error awareness, and mixed account types.

## 6. Practice It Yourself Model

Practice It Yourself should not merely ask for a final answer. The app should provide only the required structure, headings, columns, and blank rows. Students must enter every item necessary for comprehensive understanding.

Only fields that do not contribute to conceptual understanding should be prefilled.

### Journal Entry

Student enters:

- account names
- Dr. notation
- `To` account
- debit amount
- credit amount
- narration where required

### Ledger

Student enters:

- `To` or `By`
- account particulars
- debit/credit side placement
- amounts
- balance c/d and balance b/d where required
- dates or references where conceptually necessary

### Trial Balance

Student enters:

- account names
- debit or credit column placement
- amounts
- totals

### Final Accounts

Student enters:

- correct line items
- correct account/statement
- correct side or section
- amounts
- adjustment treatment where required

### Bank Reconciliation Statement

Student enters:

- starting balance
- adjustment particulars
- add/less treatment
- amounts
- final balance

### Future Checker Scope

The checker should eventually evaluate:

- particulars
- account names
- side/section placement
- Dr./Cr.
- To/By
- amounts
- totals
- balances
- narration
- adjustment treatment

## 7. Difference Between the Two Practice Systems

### Practice It Yourself Inside Chapters

- appears immediately after learning
- tied to the current subtopic
- guided
- similar or slightly harder than solved illustrations
- part of the chapter-learning journey

### General Practice

- separate section
- independent revision
- chapter/topic selection
- mixed difficulty
- larger question bank
- exam-oriented practice later

## 8. Proposed Route Architecture

This is a proposed target structure only. Do not implement these routes in this planning phase.

| Proposed route | Purpose | Current comparison |
| --- | --- | --- |
| `/dashboard` | Student home and progress summary | Route exists but currently redirects to `/learn`; redesign later. |
| `/chapters` | Chapter library | Current equivalent is `/learn`. |
| `/chapters/[chapterSlug]` | Chapter overview | Current equivalent is `/learn/<lesson-slug>`, but content model is simpler today. |
| `/chapters/[chapterSlug]/[subtopicSlug]` | Subtopic learning flow | Missing today. |
| `/solver` | Solver hub | Current equivalent is `/tools`. |
| `/solver/journal-entry` | Journal Entry Explainer | Current equivalent is `/journal-entry-solver`. |
| `/solver/ledger` | Ledger Posting | Current equivalent is `/ledger`. |
| `/solver/trial-balance` | Trial Balance | Current equivalent is `/trial-balance`. |
| `/solver/final-accounts` | Final Accounts | Current equivalent is `/final-accounts`. |
| `/solver/brs` | Bank Reconciliation Statement | Current equivalent is `/bank-reconciliation`. |
| `/practice` | General Practice hub | Existing route should remain stable initially. |
| `/practice/[chapterSlug]` | Chapter-wise independent practice | Missing today. |
| `/assistant` | Grounded AI tutor | Missing today. |

Initial route guidance:

- Reuse current pages while planning the new shell.
- Do not redirect existing routes until the new route has equivalent or better coverage.
- Keep `/practice` untouched until General Practice redesign is explicitly scoped.
- Keep `/practice/advanced` separate as beta.
- Keep old solver URLs working or redirect them only after `/solver/*` is ready.

## 9. Mobile-First UI Architecture

Target UI principles:

- desktop left sidebar for five-section navigation
- mobile menu/drawer plus clear bottom navigation where appropriate
- no horizontal page overflow
- responsive accounting tables with stacked or scroll-safe layouts
- readable typography for long explanations
- large touch targets
- sticky or easily accessible chapter navigation
- clear progress through subtopics
- accessible input fields
- simple feedback states: unchecked, correct, partially correct, incorrect, needs review

Accounting formats need special care on mobile. Ledger, trial balance, final accounts, and BRS layouts should avoid wide table assumptions. Where tables are required, use responsive cards, sectioned columns, or controlled horizontal scrolling inside the component only.

## 10. Reusable Content/Data Model Outline

Do not implement TypeScript types yet. Conceptually, future content can be structured as:

### Chapter

- id
- slug
- title
- class/level
- description
- estimated time
- prerequisites
- learning outcomes
- ordered subtopics
- support status

### Subtopic

- id
- slug
- title
- objective
- concept sections
- examples
- solved illustrations
- Practice It Yourself questions
- next subtopic

### Concept Section

- heading
- explanation paragraphs
- key rules
- memory table
- examples
- common mistakes

### Example

- prompt
- short answer
- explanation
- optional working

### Solved Illustration

- question
- given information
- required format
- solution rows
- workings
- totals
- explanation
- common mistakes
- difficulty

### Practice It Yourself Question

- question
- input structure
- answer schema
- validation rules
- explanation
- hints
- support status

### Answer Schema

- expected rows
- expected particulars
- expected side/section
- expected amounts
- expected totals
- acceptable aliases
- required narration
- common wrong placements

### Support Status

- supported
- partially supported
- explanation-only
- planned
- unsupported

## 11. Existing Assets to Reuse

Reusable assets:

- Learn content/pages: `app/learn/`, `app/learn/LessonReader.tsx`, `lib/learning-content.ts`
- Journal Entry Explainer: `/journal-entry-solver`, `/api/journal-entry-solver`, `lib/journal-entry-solver.ts`
- Beginner Practice: `/practice`, `/api/generate-practice-question`, `/api/check-entry`
- Advanced Practice: `/practice/advanced`, `lib/accounting-core/`
- Ledger Impact and Ledger tool: `lib/ledger-engine.ts`, `/ledger`, `/practice/ledger`
- Trial Balance Impact and Trial Balance tool: `lib/trial-balance-engine.ts`, `/trial-balance`, `/practice/trial-balance`
- Final Accounts tool and current Final Accounts Impact metadata: `lib/final-accounts-engine.ts`, `/final-accounts`, `/practice/final-accounts`
- Bank Reconciliation tool: `lib/bank-reconciliation-engine.ts`, `/bank-reconciliation`
- Browser-local history/progress helpers: `lib/attempt-history.ts`, `lib/lesson-progress.ts`
- Mobile navigation: `components/MobileBottomNav.tsx`
- Feedback rendering: `components/FeedbackReport.tsx`
- Vercel Analytics in `app/layout.tsx`
- Existing tests under `tests/`
- Existing project memory docs under `docs/`

Do not modify early:

- existing accounting engines during navigation shell work
- beginner `/practice`
- `/practice/advanced` runtime exposure/order/count
- parser/classifier/validator/checker behavior
- localStorage keys
- API routes
- analytics setup
- database/auth/payment/history architecture

## 12. First Gold-Standard Vertical Slice: Journal Entries Chapter

The first complete prototype should be:

`Journal Entries Chapter`

It should eventually demonstrate:

- chapter introduction
- ordered topics and subtopics
- concept explanations
- examples
- solved illustrations from easy to hard
- increasing difficulty
- Practice It Yourself
- students entering complete particulars and amounts
- checking and mistake explanation
- mobile-first interaction
- progress through the chapter
- clear connection to Solver and General Practice

Why Journal Entries is the right first template:

- Journal Entries is the foundation for Ledger, Trial Balance, Final Accounts, Partnership Accounts, and Company Accounts.
- The current product already has strong reusable assets for journal concepts, solving, parsing, validation, feedback, beginner practice, advanced practice, ledger impact, trial balance impact, and limited Final Accounts Impact metadata.
- It proves the full student journey with lower layout risk than the first Trial Balance table experience.
- It requires students to construct complete accounting answers, not merely identify an answer.
- It creates the safest bridge between current lesson pages, the Journal Entry Explainer, beginner `/practice`, and future chapter-level Practice It Yourself.
- It lets the product validate feedback quality before moving into more complex multi-row accounting-table checks.

Suggested Journal Entries prototype scope:

- business transaction meaning and accounts affected
- modern account classification first, with careful connection to traditional rules
- debit/credit logic and journal format
- capital by cash/bank
- drawings by cash/bank
- cash/bank purchases, sales, expenses, and income
- simple asset and liability entries
- cash-to-bank and bank-to-cash business transfers
- solved illustrations from easy to mixed simple entries
- Practice It Yourself with full journal rows, debit/credit amounts, and optional narration
- feedback for missing account, wrong side, wrong amount, imbalance, duplicate line, wrong cash/bank treatment, and generic `Capital A/c` when a named partner account is required

## 12.1 Second Validation Chapter: Trial Balance Chapter

The second major prototype should be:

`Trial Balance Chapter`

It should validate the next layer of product complexity after the Journal Entries chapter is working.

The Trial Balance chapter should demonstrate:

- multi-row accounting tables
- student-entered account names
- debit/credit column placement
- totals and balancing
- responsive table/input UX
- more complex checking rules than a single journal-entry answer
- feedback for wrong side, missing account, wrong amount, wrong total, duplicate account, and unbalanced totals

Trial Balance should remain the second validation chapter because it proves whether the chapter engine can handle structured accounting tables safely without jumping straight to Final Accounts adjustments, statutory treatments, or broad unsupported assumptions.

## 13. Phased Migration Plan

| Phase | Objective | Expected files/areas | Must remain untouched | Completion criteria | Risk |
| --- | --- | --- | --- | --- | --- |
| 1. Product blueprint | Document target product and migration guardrails | `docs/platform-blueprint.md`, `docs/project-state.md`, `docs/next-steps.md` | App code, tests, engines, routes | Blueprint exists and current state is inventoried | Low |
| 2. Curriculum/concept map | Define Accountancy chapters, subtopics, and ordering | `docs/`, possible future data draft | Runtime routes and engines | Approved chapter/subtopic map | Low |
| 3. Design system | Define mobile-first layout, tokens, cards, tables, inputs, feedback | `docs/`, later shared UI components | Accounting logic | Approved UI patterns and accessibility checklist | Medium |
| 4. App shell/navigation | Create five-section shell without changing engines | `app/`, shared components | Existing tools/practice behavior | Dashboard, Chapters, Solver, Practice, Assistant nav shell works | Medium |
| 5. Chapter data model | Draft chapter/subtopic/illustration/practice schema | `lib/` future content modules, tests | Existing `learning-content.ts` until migration plan is ready | Data model supports Journal Entries slice | Medium |
| 6. Journal Entries chapter skeleton | Build static chapter/subtopic route for first slice | Future `/chapters/...` files | `/learn`, `/practice`, engines | Static mobile-safe chapter skeleton renders | Medium |
| 7. Illustration system | Render solved illustrations with workings and common mistakes | Chapter components | Solver engines | Solved illustrations render consistently | Medium |
| 8. Practice It Yourself editor | Build structured blank answer UI | Chapter practice components | Beginner practice | Students can enter rows/amounts/totals | High |
| 9. Journal Entries checker/feedback | Check complete journal-entry Practice It Yourself answers | New checker adapter/tests where needed | Existing beginner `/practice` behavior and checker/parser/classifier logic | Feedback catches account, side, amount, imbalance, duplicate line, cash/bank mistakes, and named-capital mistakes | High |
| 10. Reusable chapter engine | Generalize Journal Entries patterns for more chapters | Chapter engine/content modules | Existing live pages until parity | Second chapter can reuse architecture | High |
| 11. Trial Balance validation chapter | Build the second prototype for multi-row accounting-table UX/checking | Future chapter files, table editor/checker tests | Existing `/trial-balance` and `/practice/trial-balance` behavior | Trial Balance chapter validates account placement, debit/credit columns, totals, and balancing | High |
| 12. Solver hub | Create `/solver` and map existing tools | App routes/components | Current tool routes until redirects are approved | Solver hub links existing tools cleanly | Medium |
| 13. General Practice hub | Redesign independent practice around chapters/topics | Practice route/components | Existing `/practice` until replacement is ready | Practice hub supports chapter/topic selection safely | High |
| 14. Dashboard and AI Assistant planning | Add approved dashboard shell and plan grounded tutor boundaries | Dashboard/assistant docs or routes after approval | Login/database, unverified accounting generation | Browser-local dashboard approach and AI guardrails are approved before implementation | High |
| 15. QA, accessibility, analytics, rollout | Audit mobile, accessibility, tests, and analytics | Tests, docs, QA checklist | Product logic except bug fixes | Ready for staged rollout | Medium |

## 14. Guardrails

- Do not rewrite existing engines during navigation/UI work.
- Do not change beginner `/practice` casually.
- Do not expose unsupported accounting topics broadly.
- Do not add login, database, history sync, or payment prematurely.
- Do not add OCR/notebook checking yet.
- Do not let the AI Assistant invent accounting treatment.
- Build and audit one micro-topic at a time.
- Preserve existing tests and live functionality during migration.
- Keep `/practice/advanced` separate until its role in the new Practice architecture is explicitly approved.
- Keep deterministic accounting logic as the source of truth for checkable answers.

## 15. Acceptance Criteria for This Planning Phase

This planning phase is complete when:

- current state is inventoried
- target architecture is documented
- five-section navigation is defined
- chapter learning flow is defined
- Practice It Yourself requirements are defined
- Journal Entries first vertical slice is defined
- Trial Balance second validation chapter is defined
- phased migration plan is written
- no runtime/app/test logic has changed
