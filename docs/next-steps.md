# AccyWise AI Next Steps

## Immediate recommended next step

The public-facing brand-name standardization is completed.

What this completed slice achieved:

- it standardizes visible UI copy and root metadata to `AccyWise AI`
- it keeps `accywise.in` reserved for domain/link references
- it does not rename internal routes, repo/package names, folders, helpers, or test utilities
- it does not add or change logo image assets
- it does not change beginner `/practice`, `/practice/advanced` behavior/order/count, Journal Entry Explainer logic, Ledger/Trial Balance/Final Accounts logic, analytics, APIs, persistence, backend, AI, parser/classifier/validator/checker logic, or accounting calculations

The next safest step is to keep any future brand changes copy/UI-only unless a separate logo or domain task explicitly asks for more.

## Immediate recommended next step

The topic learning-page `What you will learn` UI cleanup is completed.

What this completed slice achieved:

- it stops rendering the repetitive `What you will learn` card from topic lesson pages
- it keeps each lesson's header, title, description/objective, concept explanation, examples, tables, practice actions, and completion controls intact
- it does not delete the underlying `whatYouWillLearn` data from lesson content
- it does not change beginner `/practice`, `/practice/advanced`, Journal Entry Explainer logic, Ledger/Trial Balance/Final Accounts logic, parser/classifier/validator/checker logic, API routes, persistence, backend, AI, or analytics

The next safest step is to keep learning-page changes UI-only unless a specific lesson-content update is requested.

## Immediate recommended next step

Vercel Web Analytics is now enabled for the live AccyWise AI site.

What this completed slice achieved:

- it installs `@vercel/analytics` and mounts the Vercel `Analytics` component in the root app layout
- it enables basic Vercel traffic/page/referrer/location/device reporting
- it does not add custom events, PostHog, Google Analytics/GA4, Microsoft Clarity, product analytics, database/login tracking, backend features, or AI features
- it does not change beginner `/practice`, `/practice/advanced` UI/order/count, parser/classifier/validator/checker logic, journal-entry checking behavior, Ledger Impact, Trial Balance Impact, Final Accounts Impact, or accounting calculations

The next safest step is to verify analytics after deployment in the Vercel dashboard, without adding custom event tracking unless a separate future task explicitly asks for it.

## Immediate recommended next step

The Journal Entry Explainer safe-parity slice for the currently exposed advanced Partnership/Company scenarios is completed.

What this completed slice achieved:

- it adds narrow deterministic explainer support for the six controlled `/practice/advanced` scenarios already exposed at runtime
- it fixes named partner capital wording so `Amit introduced capital...` uses `Amit's Capital A/c`, not generic `Capital A/c`
- it explains share application money as not final Share Capital yet
- it explains calls in advance as call money received before due
- it keeps debenture redemption strictly at par by bank, without wider debenture treatments
- it uses partners' Current A/c credits for the controlled interest-on-capital explainer case
- it does not change beginner `/practice`, advanced question order/count, parser/classifier/validator/checker logic, ledger/trial-balance calculations, Final Accounts Impact, API routes, persistence, backend, or AI features

The next safest step is a small post-change safety audit for the Journal Entry Explainer parity slice, or a docs/test-only checkpoint before adding more explainer coverage.

## Immediate recommended next step

The Journal Entry Explainer safe-parity safety audit is completed.

What this completed audit confirmed:

- the explainer still supports only the six intended controlled Partnership/Company scenarios from the parity slice
- named partner capital output, affected accounts, and step-by-step logic preserve `Amit's Capital A/c`
- multi-partner interest on capital totals Riya and Amit before debiting `Interest on Capital A/c`
- share application and calls in advance explanations stay student-safe and narrow
- debenture redemption remains strictly at par by bank
- complex prompts such as share allotment, forfeiture, reissue, debenture premium, DRR, retirement, death, goodwill, and statutory treatment remain unsupported
- beginner `/practice` and `/practice/advanced` order/count remain unchanged

The next safest step is to pause explainer expansion briefly, or make the next request docs/test-only unless another small controlled explainer scenario is explicitly chosen.

## Immediate recommended next step

The Journal Entry Explainer Partnership wording-gap polish is completed.

What this completed slice achieved:

- it keeps the same narrow controlled Partnership explainer boundary
- it supports capital brought in cash with the named partner capital account:
  - `Cash A/c Dr.`
  - `To Amit's Capital A/c`
- it supports drawings withdrawn by bank for personal use:
  - `Amit Drawings A/c Dr.`
  - `To Bank A/c`
- it supports single-partner interest on capital with the current-account convention:
  - `Interest on Capital A/c Dr.`
  - `To Amit's Current A/c`
- it keeps existing Amit/Riya capital by bank, drawings in cash, and two-partner interest on capital behavior intact
- it keeps goodwill, retirement, admission with goodwill, partner salary, and partner commission unsupported
- it does not change beginner `/practice`, `/practice/advanced` order/count, parser/classifier/validator/checker logic, ledger/trial-balance calculations, Final Accounts Impact, API routes, persistence, backend, or AI features

The next safest step is a small docs/test-only audit of this wording polish, or to pause Explainer expansion until another specific controlled wording gap is identified.

## Immediate recommended next step

The Journal Entry Explainer Partnership wording-gap safety audit is completed.

What this completed audit confirmed:

- cash capital wording uses `Cash A/c` and `Amit's Capital A/c`, not `Bank A/c` or generic `Capital A/c`
- drawings by bank uses `Amit Drawings A/c` and `Bank A/c`, not `Cash A/c`
- single-partner interest on capital uses `Interest on Capital A/c` and `Amit's Current A/c`, not `Amit's Capital A/c`
- existing Amit/Riya capital by bank, drawings in cash, and two-partner interest on capital cases still pass
- goodwill brought by a partner, retirement, admission with goodwill, partner salary, and partner commission remain unsupported
- beginner `/practice` and `/practice/advanced` order/count remain unchanged

The next safest step is to pause Explainer expansion unless another specific narrow wording gap is found, or keep future work docs/test-only.

## Immediate recommended next step

The read-only Ledger Impact and Trial Balance Impact preview inside `/practice/advanced` is completed.

What this completed slice achieved:

- the advanced beta already generates balanced expected journal entries
- it now reuses `coreJournalEntriesToJournalText`, `generateLedger`, and `generateTrialBalance`
- it adds visible student value without changing beginner checker/classifier/parser behavior
- it keeps advanced work inside the separate advanced route instead of mixing it into beginner practice
- it stays read-only and mobile-safe

## Immediate recommended next step

The explanation-only polish inside `/practice/advanced` is completed.

What this completed slice achieved:

- it explains how the correct journal entry affects each account in `Ledger Impact`
- it explains that Trial Balance checks whether total debit equals total credit
- it reminds students that the preview is based on the correct expected answer
- it stays compact and mobile-safe

## Immediate recommended next step

The compact `How to read this preview` help card inside `/practice/advanced` is completed.

What this completed slice achieved:

- it tells students to read the correct journal entry first
- it tells students to then review `Ledger Impact`
- it tells students to finally check `Trial Balance Impact`
- it reminds students that the preview is based on the correct expected answer, not the submitted answer
- it stays advanced-only, read-only, compact, and mobile-safe

## Immediate recommended next step

The small advanced-only post-check UI polish inside `/practice/advanced` is completed.

What this completed slice achieved:

- it makes the post-check reading order clearer:
  - correct answer
  - `How to read this preview`
  - `Ledger Impact`
  - `Trial Balance Impact`
- it makes it easier for students to see that the correct answer is the starting point
- it makes `Ledger Impact` feel more clearly like an account-level view
- it makes `Trial Balance Impact` feel more clearly like a debit/credit balance check
- it stays UI-only and does not change any accounting logic

## Immediate recommended next step

The hidden Company Accounts calls-in-advance fixture coverage improvement is completed.

What this completed slice achieved:

- it adds a tiny balanced Company Accounts scenario for calls in advance received:
  - `Bank Dr.`
  - `Calls in Advance Cr.`
- it closes a proof gap where metadata already claimed `calls_in_advance` support
- it keeps the improvement hidden, test-only, positive-amount, and metadata-clear
- it confirms the scenario flows through the existing ledger/trial-balance compatibility pattern without changing engine logic

## Immediate recommended next step

The hidden Partnership Accounts capital-contribution fixture coverage improvement is completed.

What this completed slice achieved:

- it adds a tiny balanced Partnership Accounts scenario for simple partner capital contribution:
  - `Bank Dr.`
  - `Amit Capital Cr.`
- it keeps the fixture positive-amount, metadata-clear, and aligned with the existing topic-pack style
- it confirms Partnership role coverage now includes `bank`
- it proves the fixture flows through the existing ledger/trial-balance compatibility pattern without changing engine logic

## Immediate recommended next step

The hidden advanced metadata-to-fixture audit test is completed.

What this completed slice achieved:

- it documents current Partnership and Company metadata claims that are still not fixture-proven
- it makes examples like Partnership `fluctuating-capital`, `retirement`, `death`, and Company `debenture-redemption` explicit
- it also shows where claimed roles are still not represented as line-level fixture roles
- it stays fully hidden and test-only, without forcing extra fixtures or runtime wiring

## Immediate recommended next step

The hidden Partnership fluctuating-capital fixture coverage improvement is completed.

What this completed slice achieved:

- it closes the documented Partnership `fluctuating-capital` gap with a small balanced hidden fixture:
  - `Interest on Capital Dr.`
  - `Amit Current Cr.`
- it also proves the line-level roles `interest_on_capital` and `partner_current`
- it updates the metadata audit expectations to remove those items from the unproven list
- it stays fully hidden, fixture-only/test-only, and does not change engine logic or runtime wiring

## Immediate recommended next step

The hidden Company Accounts debenture-redemption fixture coverage improvement is completed.

What this completed slice achieved:

- it closes the documented Company `debenture-redemption` tag gap with a tiny balanced hidden fixture:
  - `Debentures Dr.`
  - `Bank Cr.`
- it represents simple debenture redemption at par
- it avoids premium on redemption, interest, DRR, instalments, Companies Act treatment, and other broader assumptions
- it updates the metadata audit expectations to remove `debenture-redemption` from the unproven tag list
- it stays fully hidden, fixture-only/test-only, and does not change engine logic or runtime wiring

## Immediate recommended next step

The hidden Partnership drawings/cash fixture coverage improvement is completed.

What this completed slice achieved:

- it closes the Partnership line-level role gaps `partner_drawings` and `cash`
- it adds a tiny balanced hidden fixture:
  - `Amit Drawings Dr.`
  - `Cash Cr.`
- it represents Amit withdrawing cash for personal use
- it updates the metadata audit expectation to remove only `partner_drawings` and `cash`
- it proves `Amit Drawings` and `Cash` through the existing ledger/trial-balance compatibility pattern
- it stays fully hidden, fixture-only/test-only, and does not change engine logic or runtime wiring

## Immediate recommended next step

The hidden Company Accounts share application fixture coverage improvement is completed.

What this completed slice achieved:

- it closes the Company line-level role gap `share_application`
- it adds a tiny balanced hidden fixture:
  - `Bank Dr.`
  - `Share Application Cr.`
- it represents share application money received
- it updates the metadata audit expectation to remove only `share_application`
- it proves `Share Application` through the existing ledger/trial-balance compatibility pattern
- it stays fully hidden, fixture-only/test-only, and does not change engine logic or runtime wiring

## Immediate recommended next step

The first controlled Company runtime exposure into `/practice/advanced` is completed.

What this completed slice achieved:

- it exposes exactly one already-proven Company scenario in the existing advanced practice question bank:
  - `Bank Dr.`
  - `Share Application Cr.`
- it represents share application money received by bank
- it appears as the first question in Company Accounts mode
- it uses the existing advanced answer-checking and post-check preview flow
- it keeps the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact` flow intact
- it does not expose calls in advance, debenture redemption, allotment, forfeiture, reissue, premium, DRR, instalments, statutory treatments, retirement, death, goodwill, or partner salary/commission through this slice
- it does not change beginner `/practice`, API routes, history/progress, backend features, parser/classifier/validator/checker logic, journal-entry checking behavior, or ledger/trial-balance calculations

## Immediate recommended next step

The post-exposure safety audit for the first Company `/practice/advanced` runtime exposure is completed.

What this completed slice achieved:

- it confirms the first Company Accounts question remains share application money received:
  - `Bank Dr.`
  - `Share Application Cr.`
- it confirms no second controlled Company exposure was added by the audit
- it confirms Partnership mode still starts with the two intended exposed Partnership scenarios
- it confirms mixed/all mode still follows the deterministic full advanced question-bank order
- it confirms the Company share-application post-check flow still shows the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact`
- it confirms the preview remains based on the correct expected answer, not the submitted answer
- it stays test/docs-audit-only and does not change runtime wiring

## Immediate recommended next step

The second controlled Company runtime exposure into `/practice/advanced` is completed.

What this completed slice achieved:

- it exposes exactly one additional already-proven Company scenario in the existing advanced practice question bank:
  - `Bank Dr.`
  - `Calls in Advance Cr.`
- it represents calls in advance received by bank
- it appears as the second question in Company Accounts mode, after share application money received
- it uses the existing advanced answer-checking and post-check preview flow
- it keeps the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact` flow intact
- it does not expose debenture redemption, allotment, forfeiture, reissue, premium, DRR, instalments, statutory treatments, retirement, death, goodwill, or partner salary/commission through this slice
- it does not change beginner `/practice`, API routes, history/progress, backend features, parser/classifier/validator/checker logic, journal-entry checking behavior, or ledger/trial-balance calculations

## Immediate recommended next step

The post-exposure safety audit for the second Company `/practice/advanced` runtime exposure is completed.

What this completed slice achieved:

- it confirms Company Accounts mode starts with exactly the two intended controlled Company scenarios:
  - share application money received
  - calls in advance received
- it confirms no third controlled Company exposure was added by the audit
- it confirms Partnership mode still starts with the two intended exposed Partnership scenarios
- it confirms mixed/all mode still follows the deterministic full advanced question-bank order
- it confirms the advanced practice question-bank count remains stable at `15`
- it confirms the Company calls-in-advance post-check flow still shows the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact`
- it confirms the preview remains based on the correct expected answer, not the submitted answer
- it stays test/docs-audit-only and does not change runtime wiring

## Immediate recommended next step

The post-exposure safety audit for the second `/practice/advanced` runtime exposure is completed.

What this completed slice achieved:

- it adds focused test-only assertions for the Partnership drawings-in-cash exposure
- it confirms the first two Partnership questions remain capital contribution and drawings in cash
- it confirms no third controlled Partnership exposure was inserted before existing Partnership salary practice
- it confirms mixed/all mode still follows the deterministic full advanced question-bank order
- it does not expose any additional scenarios or change runtime wiring

## Immediate recommended next step

The second controlled runtime exposure into `/practice/advanced` is completed.

What this completed slice achieved:

- it exposes exactly one additional already-proven Partnership scenario in the existing advanced practice question bank:
  - `Amit Drawings Dr.`
  - `Cash Cr.`
- it appears as the second question in Partnership mode, after partner capital contribution
- it uses the existing advanced answer-checking and post-check preview flow
- it keeps the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact` flow intact
- it keeps Company mode IDs unchanged
- it does not expose the rest of the hidden Partnership/Company fixture set
- it does not change beginner `/practice`, API routes, history/progress, backend features, parser/classifier/validator/checker logic, or ledger/trial-balance calculations

## Immediate recommended next step

The post-exposure safety audit for the first `/practice/advanced` runtime exposure is completed.

What this completed slice achieved:

- it adds focused test-only assertions for the Partnership capital-contribution exposure
- it confirms only one Partnership capital-contribution question is exposed
- it confirms Company mode keeps its existing question IDs
- it confirms the exposed scenario's preview remains based on the correct expected answer, not a wrong submitted answer
- it does not expose any additional scenarios or change runtime wiring

## Immediate recommended next step

The first controlled runtime exposure into `/practice/advanced` is completed.

What this completed slice achieved:

- it exposes exactly one already-proven Partnership scenario in the existing advanced practice question bank:
  - `Bank Dr.`
  - `Amit Capital Cr.`
- it appears as the first question in Partnership mode
- it uses the existing advanced answer-checking and post-check preview flow
- it keeps the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact` flow intact
- it does not expose the rest of the hidden Partnership/Company fixture set
- it does not change beginner `/practice`, API routes, history/progress, backend features, engines, parser/classifier/validator/checker logic, or ledger/trial-balance calculations

## Immediate recommended next step

The runtime-readiness checklist for future `/practice/advanced` fixture exposure is completed.

Current consolidation checkpoint:

- remaining Partnership metadata-only roles are `partner_salary`, `partner_commission`, `goodwill`, and `liability`
- remaining Partnership metadata-only tags are `retirement` and `death`
- remaining Company metadata-only roles are `share_allotment`, `capital_reserve`, `premium_on_redemption_of_debentures`, `asset`, `liability`, and `expense`
- no Company scenario tags remain metadata-only after the simple `debenture-redemption` fixture

Safe first exposure candidates:

- Partner capital contribution:
  - fixture already proves `Bank Dr.` / `Amit Capital Cr.`
  - explanation copy should say the partner brings money into the firm, so Bank increases and Amit Capital records the owner's claim
- Partner drawings in cash:
  - fixture already proves `Amit Drawings Dr.` / `Cash Cr.`
  - explanation copy should say Amit withdrew cash for personal use, so drawings are recorded and cash reduces
- Interest on capital / fluctuating capital:
  - fixture already proves `Interest on Capital Dr.` / `Amit Current Cr.`
  - explanation copy should say interest allowed to a partner is credited to the partner's current account under the fluctuating-capital method
- Share application money received:
  - fixture already proves `Bank Dr.` / `Share Application Cr.`
  - explanation copy should say the company receives application money and credits Share Application until shares are processed
- Calls in advance received:
  - fixture already proves `Bank Dr.` / `Calls in Advance Cr.`
  - explanation copy should say future call money received early is recorded separately until it becomes due
- Debenture redemption at par:
  - fixture already proves `Debentures Dr.` / `Bank Cr.`
  - explanation copy should say debentures are repaid at face value from Bank, with no premium, interest, DRR, instalment, or statutory treatment

Keep hidden / defer for later:

- Partnership `retirement` and `death` should stay deferred because they usually need profit/loss sharing, revaluation, goodwill, loan/capital settlement, or multi-step partner account treatment
- goodwill modeling should stay deferred until the app has a clear design for whether goodwill is a line-level account role, an adjustment concept, or both
- partner salary and partner commission modeling should stay hidden until their line-level role expectations are designed
- `premium_on_redemption_of_debentures` should stay deferred because it brings broader redemption assumptions
- DRR, instalments, interest accrual, statutory treatment, and Companies Act-specific workflows should stay out of these tiny fixture slices
- broad generic role claims such as `asset`, `liability`, and `expense` should stay metadata-only until the project decides whether generic account classes should be exposed as roles

Needs design before fixture:

- broad role claims such as Company `asset`, `liability`, and `expense` need a decision on whether metadata should claim generic account classes as roles at all
- Partnership `goodwill` needs a decision on whether goodwill should be represented as a line-level role or remain a scenario tag/adjustment concept
- Partnership `partner_salary` and `partner_commission` need a decision on whether to model them as line-level accounts or only through appropriation/capital lines

Tests required before exposing any selected fixture:

- keep the chosen fixture balanced, positive-amount, metadata-clear, and already proven by the hidden ledger/trial-balance compatibility pattern
- add a focused `/practice/advanced` route test proving the selected question is exposed only in advanced practice
- prove beginner `/practice` remains unchanged
- prove the post-check preview still appears only after checking an answer
- prove the preview is still derived from the correct expected entry, not from the submitted answer
- check mobile-safe layout and avoid wide tables or horizontal page overflow

Runtime wiring guardrails for a future exposure slice:

- expose only one small selected fixture or question at a time
- keep all wiring inside `/practice/advanced` and `lib/accounting-core/` question-bank boundaries
- do not change beginner `/practice`
- do not change engines, parser, classifier, validator, checker logic, journal-entry checking behavior, or accounting calculations
- do not add API routes, history/progress, database, auth, AI, payment, backend, or runtime persistence
- keep explanations short, Class 11/12-friendly, and clearly based on the correct expected answer

The third controlled Partnership runtime exposure is now completed:

- `/practice/advanced` Partnership mode now includes interest on capital under fluctuating capital as the third controlled Partnership question
- the expected entry is `Interest on Capital Dr.` / `Amit Current Cr.`
- it reuses the existing advanced question-bank and post-check preview flow
- it does not expose retirement, death, goodwill modeling, partner salary/commission, statutory treatments, or any broad generic role claims

The post-exposure safety audit for the third Partnership `/practice/advanced` runtime exposure is completed:

- existing focused tests already confirm Partnership mode starts with capital contribution, drawings in cash, and interest on capital under fluctuating capital
- existing focused tests already confirm the fourth Partnership question remains the pre-existing partner salary question, so no fourth controlled Partnership exposure was added by the audit
- Company mode still starts with share application money received and calls in advance received
- mixed/all mode remains deterministic through the fixed advanced question-bank order
- the interest-on-capital/fluctuating-capital post-check preview still shows the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact`
- the preview remains based on the correct expected answer, so a submitted `Amit Capital` credit still displays the expected `Amit Current` entry and impact preview

The third controlled Company runtime exposure into `/practice/advanced` is completed:

- it exposes exactly one additional already-proven Company scenario in the existing advanced practice question bank:
  - `Debentures Dr.`
  - `Bank Cr.`
- it represents simple debenture redemption at par
- it appears as the third question in Company Accounts mode, after share application money received and calls in advance received
- it uses the existing advanced answer-checking and post-check preview flow
- it keeps the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact` flow intact
- it intentionally avoids premium on redemption, debenture interest, DRR, instalments, Companies Act treatment, statutory reserves, and complex debenture accounting
- it does not expose allotment, forfeiture, reissue, premium, DRR, statutory treatments, retirement, death, goodwill, or partner salary/commission through this slice

The post-exposure safety audit for the third Company `/practice/advanced` runtime exposure is completed:

- existing focused tests confirm Company mode starts with share application money received, calls in advance received, and debenture redemption at par
- existing focused tests confirm the fourth Company question remains the pre-existing share issue at premium question, so no fourth controlled Company exposure was added by the audit
- Partnership mode still starts with capital contribution, drawings in cash, and interest on capital under fluctuating capital
- mixed/all mode remains deterministic through the fixed advanced question-bank order
- the advanced practice question-bank count remains intentionally stable at `17`
- the debenture-redemption-at-par post-check preview still shows the correct answer, `How to read this preview`, `Ledger Impact`, and `Trial Balance Impact`
- the preview remains based on the correct expected answer, so a submitted `Share Capital` credit still displays the expected `Bank` credit entry and impact preview
- the debenture entry remains at-par-only with `Debentures Dr.` / `Bank Cr.` and no premium, interest, DRR, instalments, statutory reserves, Companies Act treatment, or complex debenture accounting
- the next safest step is to pause runtime exposure briefly, or do a docs/test-only readiness check before exposing any more hidden fixtures

The small read-only `Why this entry?` explanation layer inside `/practice/advanced` is completed:

- it appears only after checking an advanced answer
- it explains why the debit side is debited and why the credit side is credited
- it uses short static expected-answer lines for the six currently exposed controlled Partnership/Company runtime scenarios
- it remains based on the correct expected answer, not the submitted answer
- it does not add a new explanation engine, AI, Final Accounts impact, accounting calculation, runtime wiring, or additional scenario exposure
- the follow-up safety audit for this explanation layer is now completed

The post-check `Why this entry?` safety audit inside `/practice/advanced` is completed:

- it confirms `Why this entry?` is absent before checking and appears only in the post-check flow
- it confirms the explanation stays based on the correct expected answer, not the submitted answer
- it confirms the six exposed controlled runtime scenarios still have short explanation lines
- it confirms hidden/deferred advanced questions did not gain broad `Why this entry?` explanation support
- it confirms the post-check order remains correct answer, `Why this entry?`, `How to read this preview`, `Ledger Impact`, then `Trial Balance Impact`
- it does not expose any additional Partnership or Company scenarios and does not change runtime wiring
- the next safest step is to pause runtime exposure briefly, or make the next request documentation/test-only unless a very small controlled advanced slice is explicitly requested

The Final Accounts Impact readiness checklist for the currently exposed `/practice/advanced` scenarios is completed as planning-only documentation:

- the checklist was planning-only and did not add accounting calculations, parser/checker changes, or scenario exposure
- any future preview should stay derived from the correct expected entry and remain read-only, compact, and advanced-only
- the first implementation slice should classify one simple scenario before trying to support all advanced topics

Current exposed scenario classifications:

- Partnership capital contribution, `Bank Dr.` / `Amit Capital Cr.`:
  - affects Balance Sheet
  - affects Asset because Bank increases
  - affects Capital Account because Amit Capital increases
  - no direct P&L impact
- Partnership drawings in cash, `Amit Drawings Dr.` / `Cash Cr.`:
  - affects Balance Sheet
  - affects Asset because Cash decreases
  - affects Capital Account because drawings reduce the partner's claim
  - no direct P&L impact
- Partnership interest on capital under fluctuating capital, `Interest on Capital Dr.` / `Amit Current Cr.`:
  - affects Capital/Current Account because Amit Current is credited
  - may affect appropriation-style presentation rather than ordinary trading Profit & Loss
  - needs caution before runtime preview because students must understand current account treatment
- Company share application money received, `Bank Dr.` / `Share Application Cr.`:
  - affects Balance Sheet
  - affects Asset because Bank increases
  - affects Liability/pending share application money until shares are processed
  - no direct P&L impact
- Company calls in advance received, `Bank Dr.` / `Calls in Advance Cr.`:
  - affects Balance Sheet
  - affects Asset because Bank increases
  - affects Liability because calls received before due are owed/held separately
  - no direct P&L impact
- Company debenture redemption at par, `Debentures Dr.` / `Bank Cr.`:
  - affects Balance Sheet
  - affects Liability because Debentures decrease
  - affects Asset because Bank decreases
  - no direct P&L impact when kept strictly at par

Safe first Final Accounts Impact candidates:

- Partnership capital contribution because it is a clear Bank asset increase and partner capital increase
- Partnership drawings in cash because it is a clear cash decrease and partner drawings/capital-section effect
- Company share application money received because it is a clear Bank asset and pending application-money Balance Sheet effect
- Company calls in advance received because it is a clear Bank asset and liability effect
- Company debenture redemption at par because it is a clear liability decrease and Bank asset decrease, as long as it remains strictly at par

Needs caution or design before runtime support:

- Partnership interest on capital under fluctuating capital should wait for a clear explanation of appropriation/current-account treatment
- future Partnership retirement, death, goodwill, partner salary, and partner commission scenarios should stay deferred until multi-step capital/current-account treatment is designed
- future Company debenture premium, DRR, instalments, interest, statutory reserves, and Companies Act treatments should stay deferred
- broad generic asset/liability/expense role claims should not be converted into Final Accounts Impact behavior without a small mapping/design audit first

The first tiny read-only Final Accounts Impact preview inside `/practice/advanced` is completed:

- it applies only to Partnership partner capital contribution:
  - `Bank Dr.`
  - `Amit Capital Cr.`
- it appears only after checking an answer and renders after `Trial Balance Impact`
- it shows compact student-friendly points:
  - `Balance Sheet`: affected
  - `Asset`: Bank increases
  - `Capital`: Amit Capital increases
  - `Profit & Loss`: no direct impact
- it is static metadata on the already-exposed advanced question, not a Final Accounts engine or broad mapping system
- it does not add Final Accounts Impact to drawings, interest on capital, share application, calls in advance, or debenture redemption yet
- it does not expose additional scenarios or change parser/classifier/validator/checker logic, journal-entry checking behavior, ledger/trial-balance calculations, or accounting calculations
- the follow-up post-exposure safety audit for this one-card Final Accounts Impact slice is now completed

The post-exposure safety audit for the first Final Accounts Impact preview is completed:

- existing focused tests already confirm `Final Accounts Impact` is absent before checking the default advanced question
- existing focused tests already confirm Partnership capital contribution is the only question with `finalAccountsImpact` metadata
- existing focused tests already confirm the card appears after `Trial Balance Impact`
- existing focused tests already confirm it shows `Balance Sheet`, `Asset`, `Capital`, and `Profit & Loss` points with no direct Profit & Loss impact
- existing focused tests already confirm the preview stays based on the correct expected scenario even when the submitted answer incorrectly credits `Cash`
- existing focused tests already confirmed drawings in cash, interest on capital, share application, calls in advance, and debenture redemption did not have Final Accounts Impact before the drawings slice was added
- existing focused generator tests still confirm the advanced question-bank count and scenario order, so no additional scenarios were exposed
- the follow-up second Final Accounts Impact preview for drawings in cash is now completed

The second tiny read-only Final Accounts Impact preview inside `/practice/advanced` is completed:

- it applies only to Partnership drawings in cash:
  - `Amit Drawings Dr.`
  - `Cash Cr.`
- it appears only after checking an answer and renders after `Trial Balance Impact`
- it shows compact student-friendly points:
  - `Balance Sheet`: affected
  - `Asset`: Cash decreases
  - `Capital/Drawings`: Amit Drawings increases and is adjusted against capital
  - `Profit & Loss`: no direct impact
- it is static metadata on the already-exposed advanced question, not a Final Accounts engine or broad mapping system
- Final Accounts Impact now applies only to Partnership capital contribution and Partnership drawings in cash
- it does not add Final Accounts Impact to interest on capital, share application, calls in advance, or debenture redemption yet
- it does not expose additional scenarios or change parser/classifier/validator/checker logic, journal-entry checking behavior, ledger/trial-balance calculations, or accounting calculations
- the next safest step is a post-exposure safety audit for this two-card Final Accounts Impact boundary before adding any third scenario

## After that

1. Add Advanced Practice history/progress integration.
2. Add topic-aware weak-area labels for advanced company and partnership attempts.
3. Add an advanced API boundary only if it is needed for cleaner separation or future server-side logic.
4. Add report-generation slices later, after advanced attempt tracking is stable.

## Suggested implementation order

1. Pause new runtime exposure unless a specific small safe slice is requested next.
2. If another runtime slice is requested later, choose only one safe already-proven candidate and write focused advanced route expectations first.
3. Keep runtime preview work read-only and derived from expected entries.
4. Only after controlled exposure slices are stable, consider browser history/progress integration for advanced attempts.

## Changes that are low risk right now

- UI-only additions inside `/practice/advanced`
- new tests for accounting-core and advanced practice
- new docs
- helper adapters that reuse existing ledger/trial-balance engines without changing their behavior

## Changes that are medium or high risk right now

- changing beginner `/practice` topic behavior
- routing advanced student answers through `transaction-classifier.ts`
- refactoring `entry-validator.ts`, `journal-parser.ts`, or `expected-entry-generator.ts` without a targeted reason
- changing history/progress storage formats
- converting test-only topic-pack/report-template metadata into runtime data without a clear boundary

## Later roadmap candidates

- Advanced Practice browser history integration
- Advanced Practice progress/weak-area integration
- More hidden accounting-content fixture or coverage hardening
- Company report generation
- Partnership report generation
- Custom advanced transaction input
- richer advanced explanations and workings

## What future prompts should assume by default

- beginner runtime flows are stable and should be preserved
- advanced work should stay isolated under `/practice/advanced` unless explicitly broadened
- accounting-core is the preferred place for new advanced journal-entry logic
- docs and tests should be updated alongside any meaningful advanced-practice change
