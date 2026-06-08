# Advanced Journal Entry Practice Beta Plan

## 1. Purpose

This document is a planning checkpoint for the first student-facing advanced practice feature in Accywise.

The goal is to decide how Partnership Accounts and Company Accounts should first appear for students without changing the existing beginner Journal Entry Checker, Topic-wise Practice, Explainer, Ledger, Trial Balance, Final Accounts, Bank Reconciliation, history, progress, or lesson progress behavior.

This plan is documentation only. It does not expose hidden advanced accounting-core generators, does not add a route, and does not change runtime behavior.

## 2. Why this should be Journal Entry first, not reports first

The first student-facing advanced feature should be Advanced Journal Entry Practice Beta.

It should not start with:

- Partnership report generation
- Company report generation
- a full Partnership Accounts engine
- a full Company Accounts engine
- an advanced final accounts engine

Reason: journal entries are the common foundation. Partnership reports and Company schedules depend on correct journal entries, and the existing Ledger and Trial Balance compatibility checks already prove that advanced journal entries can flow through the current journal-to-ledger-to-trial-balance path when the entries are controlled and balanced.

Reports are topic-specific and should come later. Profit and Loss Appropriation Account, Partner Capital Accounts, Revaluation Account, Realisation Account, Share Capital schedules, Capital Reserve workings, and Debenture schedules need dedicated templates and explanations. Starting with reports would create a larger product and QA surface than needed for the first beta.

## 3. What is already proven by Slices 1-12

Slices 1-12 have built a safe hidden foundation:

- Shared accounting-core types exist for accounts, journal entries, ledger accounts, trial balance rows, reports, scenarios, check results, and topic packs.
- Existing checker/parser journal shapes can be adapted into the core `JournalEntry` shape.
- Core journal entries can be serialized to the existing journal-entry text format.
- Existing Ledger and Trial Balance engines can process balanced advanced journal entries when represented as normal journal text.
- Partnership and Company topic-pack fixtures exist as hidden test-only data.
- Partnership and Company report-template fixtures exist as hidden test-only metadata and sample reports.
- A hidden advanced scenario registry exists for selected Partnership and Company entries.
- Hidden Company Accounts journal generators exist for selected share capital and debenture cases.
- Hidden Partnership Accounts journal generators exist for selected appropriation, revaluation, goodwill, and realisation cases.
- Runtime app behavior remains unchanged.

The foundation proves representation, deterministic generation, serializer compatibility, and Ledger/Trial Balance compatibility. It does not yet prove student-facing advanced checking, advanced random practice, advanced history labels, or advanced progress recommendations.

## 4. What should remain separate from beginner practice

Advanced Partnership and Company questions should not be mixed into the existing beginner `/practice` random flow.

Reason: beginner students may be practicing capital, cash, bank, purchases, sales, expenses, GST, adjustments, and assets. If share forfeiture, debentures, goodwill compensation, revaluation, or realisation suddenly appears in the same random flow, the page will feel unpredictable and discouraging.

Recommended separation:

- Keep existing Topic-wise Practice as Beginner Practice.
- Introduce Advanced Practice Beta as a clearly separate area.
- Use clear labels such as Beginner Practice, Advanced Practice Beta, Partnership Accounts, and Company Accounts.

Preferred placement:

- Option A, preferred: create a future separate route `/practice/advanced`.
- Option B: create a clearly separated "Advanced Practice Beta" section inside `/practice`, placed after beginner topic cards and workflow practice.

Option A is cleaner because it keeps beginner practice simple, avoids crowding the current mobile flow, and gives advanced topics room for topic-specific instructions.

## 5. First beta scope

The first beta should be small and controlled. It should test journal-entry accuracy only.

Full available hidden scope from Slices 11-12:

Company Accounts cases:

1. Share issue at premium
2. Share first call due
3. Calls in arrears
4. Calls in advance
5. Share forfeiture
6. Reissue of forfeited shares at discount
7. Debenture issue at discount
8. Debenture interest paid

Partnership Accounts cases:

1. Partner salary allowed
2. Interest on capital allowed
3. Interest on drawings charged
4. Partner commission allowed
5. Revaluation loss on asset
6. Revaluation gain on asset
7. Goodwill compensation
8. Realisation asset transfer
9. Realisation liability transfer
10. Realisation expense paid

Recommended beta launch size:

- 5 Company Accounts cases
- 5 Partnership Accounts cases

This keeps QA manageable while still proving that both advanced topic families can be practiced by students.

## 6. Company Accounts beta cases

Recommended first 5 Company cases:

1. Share issue at premium
2. Share first call due
3. Calls in arrears
4. Calls in advance
5. Debenture interest paid

Why these first:

- They are direct journal-entry cases.
- They are easier to explain than forfeiture and reissue.
- They introduce the most important Company Accounts vocabulary: Share Capital, Securities Premium, Share First Call, Calls in Arrears, Calls in Advance, Debentures, Debenture Interest, and Bank.
- They avoid beginning with the most error-prone forfeiture/reissue working.

Second Company expansion:

- Share forfeiture
- Reissue of forfeited shares at discount
- Debenture issue at discount

These should come after the beta proves that students understand the simpler Company journal-entry workflow.

## 7. Partnership Accounts beta cases

Recommended first 5 Partnership cases:

1. Partner salary allowed
2. Interest on capital allowed
3. Interest on drawings charged
4. Revaluation loss on asset
5. Goodwill compensation

Why these first:

- They cover appropriation, partner capital, revaluation, and goodwill without requiring full account preparation.
- They are direct journal-entry questions with clear debit and credit logic.
- They prepare students for later P&L Appropriation Account, Revaluation Account, and Partner Capital Accounts.

Second Partnership expansion:

- Partner commission allowed
- Revaluation gain on asset
- Realisation asset transfer
- Realisation liability transfer
- Realisation expense paid

Realisation entries should be introduced carefully because students often connect them to a full Realisation Account report, which is not part of the first beta.

## 8. What not to include in beta

The first beta should exclude:

- Full P&L Appropriation report generation
- Partner Capital Account report generation
- Revaluation Account report generation
- Realisation Account report generation
- Share Capital Schedule generation
- Capital Reserve Working generation
- Debenture Schedule generation
- Cash Flow Statement calculator
- student-created custom advanced transactions
- AI checking
- database or cloud sync
- marks like a full exam paper
- complex multi-step case studies

Reason: the first beta should test journal-entry accuracy only. Reports and schedules require more instructions, more display components, more result shapes, and more topic-specific scoring rules.

## 9. Student workflow

Recommended first beta workflow:

1. Student opens Advanced Practice Beta.
2. Student chooses a topic group: Company Accounts or Partnership Accounts.
3. Student chooses or receives one controlled case.
4. The app shows one transaction prompt.
5. Student writes the journal entry in the existing journal-entry text style.
6. Student clicks Check Answer.
7. The app compares the answer against the generated expected core journal entry.
8. The app shows:
   - Correct or needs correction
   - score
   - expected journal entry
   - simple explanation
   - retry same question
   - try another advanced question
   - report wrong answer

The beta should feel similar to current Topic-wise Practice, but it should be clearly labeled as advanced and separate from beginner topics.

## 10. Checking/scoring strategy

First beta scoring should be deterministic and conservative.

Recommended strategy:

- Use hidden generated `JournalEntry` structures as the source of truth.
- Convert generated core entries to the same journal-text shape already accepted by existing parser/ledger tests when needed.
- Prefer account-side-amount matching over free-form transaction classification.
- Validate:
  - each expected debit line exists
  - each expected credit line exists
  - matching amounts are correct
  - total debit equals total credit
  - extra lines are flagged
  - missing lines are flagged
- Keep debit-line ordering and credit-line ordering flexible where accounting meaning is unchanged.
- Preserve duplicate account rows when generated entries intentionally contain them in future cases.

Do not route advanced student prompts through the beginner transaction classifier. Advanced beta prompts should be selected from controlled scenario definitions, not inferred from arbitrary student-written transactions.

Suggested beta score behavior:

- 100: all accounts, sides, and amounts match.
- 70-90: correct account names and sides with a minor amount or formatting issue.
- 40-60: partially correct side/account logic.
- 0-30: unsupported format, unbalanced answer, wrong advanced concept, or missing major lines.

The exact scoring can be implemented later, but it should not weaken the existing beginner validator.

## 11. Explanation strategy

Explanations should remain rule-based in the first beta.

Recommended explanation style:

- Start with the topic rule in one sentence.
- Show why each debit account is debited.
- Show why each credit account is credited.
- Mention the total debit and total credit.
- Add one common mistake for that case.

Examples:

- For partner salary: "Partner salary is an appropriation of profit, so Profit and Loss Appropriation A/c is debited and the partner's Capital A/c is credited."
- For calls in advance: "Money received before it is due is a liability, so Bank A/c is debited and Calls in Advance A/c is credited."
- For revaluation loss: "A decrease in asset value is debited to Revaluation A/c and credited to the asset."

Do not use AI explanations in the beta. The current accounting engines are rule-based for consistency, and any future AI Tutor should sit on top of verified accounting outputs.

## 12. History/progress strategy

Do not change history/progress in the first UI exposure unless the data shape is planned carefully.

Current history uses browser-only `localStorage` under `accywise_attempt_history_v1` with module values for checker, practice, and explainer. Progress weak areas infer labels from existing beginner topic keys and mistake patterns.

Recommended later strategy:

- Add a new advanced topic label in history, such as `advanced_company_accounts` or `advanced_partnership_accounts`.
- Keep the module as `practice` if using the same practice result surface, or add an `advanced_practice` module only after checking all filters and summaries.
- Add weak-area labels for:
  - Company Accounts
  - Partnership Accounts
  - Share Capital
  - Calls in Arrears/Advance
  - Debentures
  - Profit Appropriation
  - Revaluation
  - Realisation
- Keep storage browser-only.
- Do not change the existing localStorage key in the beta unless a migration plan is added.

For the first implementation slice, history saving can be deferred if needed. If included, it must not break current history filters or progress summaries.

## 13. UI placement options

Option A: separate route `/practice/advanced`

Pros:

- Clean separation from beginner practice.
- More space for advanced labels, topic grouping, and guidance.
- Easier mobile flow.
- Lower risk of confusing beginner students.

Cons:

- Requires one new page route in a later implementation slice.
- Needs links from `/practice` or `/tools`.

Option B: separate card inside `/practice`

Pros:

- Fewer routes.
- Students already visit `/practice`.

Cons:

- Beginner practice may feel crowded.
- Mobile page is already long.
- Advanced and beginner concepts may feel mixed even if visually separated.

Recommendation: use Option A for implementation, with one quiet entry card from `/practice` or `/tools` after the advanced beta is ready.

## 14. Data/runtime safety

The beta should preserve current runtime safety rules:

- Do not change the beginner transaction classifier.
- Do not change the existing checker route for beginner transactions.
- Do not change the existing practice generator.
- Do not change Ledger, Trial Balance, Final Accounts, or BRS engines.
- Do not expose hidden generators globally through UI until the advanced route has its own tests.
- Do not add database, login, payment, or AI.
- Keep all generated advanced cases deterministic.
- Keep all expected entries balanced before rendering or checking.
- Keep all advanced beta prompts selected from known scenario definitions.

The safest runtime path is a new advanced practice generator/checking wrapper that consumes hidden accounting-core scenario/generator outputs without altering the existing beginner flow.

## 15. Risk controls

Before implementation, define risk controls:

- Feature label must say Advanced Practice Beta.
- Beginner Practice must remain the default learning path.
- Advanced topic groups must be explicit: Company Accounts and Partnership Accounts.
- Every beta case must have tests for generated expected entries.
- Every generated entry must be balanced.
- Ledger and Trial Balance compatibility should continue to be tested for generated entries.
- Student validation should be order-insensitive where order is not meaningful.
- Unsupported advanced cases should show a clear message instead of trying to infer them.
- Reports and schedules should be clearly marked as not included in beta.
- Report Wrong Answer should remain available when a student-facing page is added.

## 16. Implementation roadmap

Recommended roadmap after this documentation checkpoint:

1. Add hidden advanced practice case definitions.
   - Use existing Company and Partnership generators.
   - Select 5 Company cases and 5 Partnership cases.
   - Keep test-only or hidden runtime utility with no UI route yet.

2. Add advanced practice checking utility.
   - Compare student parsed journal entry with generated core expected entries.
   - Keep it separate from beginner validator if needed.
   - Add targeted tests for correct, reversed order, wrong side, wrong amount, missing line, extra line, and unbalanced answer.

3. Add API route only after utilities are fully tested.
   - Suggested future route: `/api/generate-advanced-practice-question` or a combined advanced practice route.
   - Keep response shape intentionally small and documented.

4. Add `/practice/advanced` UI.
   - Topic group selection.
   - Question prompt.
   - Answer textarea.
   - Check result.
   - Retry and try another.
   - Report Wrong Answer.

5. Add history/progress integration.
   - Save advanced attempts only after topic labels and weak-area labels are agreed.
   - Preserve browser-only storage and existing history behavior.

6. Expand cases after QA.
   - Add remaining Company and Partnership cases.
   - Only then consider report templates and schedule generation.

## 17. First coding slice recommendation

The first coding slice after this plan should be:

Hidden Advanced Practice Case Registry

Scope:

- Add a small hidden registry that selects 5 Company cases and 5 Partnership cases for beta.
- Use existing hidden Company and Partnership journal generators.
- Return deterministic prompts, topic labels, expected core journal entries, and simple rule-based explanation metadata.
- Add tests proving:
  - 10 beta cases exist
  - each case has a stable id
  - each case has a prompt
  - each case has at least one expected journal entry
  - every expected entry is balanced
  - every expected entry serializes to journal text
  - generated entries still pass Ledger compatibility where the block limit permits
  - generated entries still pass Trial Balance compatibility
  - no app route or UI imports the registry

Do not build `/practice/advanced` in the first coding slice. Keep the next slice hidden so the product surface remains unchanged until checking and explanations are ready.

## 18. Final recommendation

Proceed with Advanced Journal Entry Practice Beta as the first student-facing advanced feature, but only after one more hidden implementation slice.

The recommended product direction is:

- Keep Beginner Practice unchanged.
- Add Advanced Practice Beta separately, preferably at `/practice/advanced`.
- Start with journal-entry questions only.
- Begin with 5 Company and 5 Partnership cases.
- Use deterministic accounting-core generators as the source of truth.
- Keep reports, schedules, AI checking, cloud sync, and complex case studies out of the first beta.
- Add history/progress only after advanced topic labels are designed.

This path gives students useful advanced practice while protecting the working beginner app and preserving the safety-first unified engine approach.
