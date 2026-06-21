# Post-Pilot Analysis Template And Improvement Backlog

Phase: 5J

Status: planning-only

Use this template after the first guided AccyWise AI pilot with 10-20 Class 11/12 Commerce students. Its purpose is to turn raw observations into disciplined product decisions before starting another build phase.

This document does not change runtime behavior. It does not add Practice It Yourself questions, checker support, expected answers, parser/classifier/validator logic, Solver logic, accounting engines, API routes, persistence, OCR, payments, database/auth, progress, AI Assistant behavior, analytics events, or route migrations.

## 1. How To Use This Template

Fill this document immediately after the pilot while observations are still fresh.

Use evidence, not vibes:

- count how many students hit the same issue
- separate one-off requests from repeated blockers
- preserve direct student quotes where useful
- avoid adding broad features from one student's suggestion
- keep the first decision focused on Journal Entries learning-path quality

Pilot scope being analysed:

- Home
- `/chapters/journal-entries`
- first 3-5 Journal Entries sections
- Practice It Yourself checker 1: `Sold goods for cash Rs 12,000`
- Practice It Yourself checker 2: `Paid salary by bank Rs 8,000`
- `/practice/journal-entries`
- optional `/journal-entry-solver`
- optional `/solver`

## 2. Post-Pilot Summary

| Field | Notes |
| --- | --- |
| Pilot date |  |
| Number of students |  |
| Class level | Class 11 / Class 12 / mixed |
| Device mix | Mobile: __ / Desktop or laptop: __ / Tablet: __ |
| Session duration |  |
| Founder/teacher observers |  |
| Guided or mostly independent? | Guided / mostly independent / mixed |
| Overall verdict | Strong enough for another pilot / small polish needed / major learning-path issue / needs redesign decision |

Short summary:

- What worked best:
- Biggest blocker:
- Most repeated confusion:
- Most encouraging signal:
- One decision to make next:

## 3. Raw Observation Capture

Use student codes instead of unnecessary personal details.

| Student code | Device | Found first click without help? | Reached Journal Entries overview? | Completed first section? | Attempted checker? | Understood feedback? | Used Solver? | Got confused by route/navigation? | Mobile issue observed? | Asked for more practice? | Key quote/note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |
| S2 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |
| S3 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |

Observer notes to capture separately:

- first click
- first hesitation
- first wrong assumption
- first checker mistake
- feedback sentence students understood
- feedback sentence students did not understand
- mobile layout or form issue
- strongest student quote

## 4. Rating Aggregation Template

Ask students to rate each item from 1 to 5.

| Rating area | Average score | Low-score pattern | Strongest positive signal | Biggest concern |
| --- | --- | --- | --- | --- |
| Ease of starting |  |  |  |  |
| Explanation clarity |  |  |  |  |
| Checker usefulness |  |  |  |  |
| Feedback clarity |  |  |  |  |
| Mobile comfort |  |  |  |  |
| Confidence improvement |  |  |  |  |
| Likelihood of using again |  |  |  |  |

Interpretation guide:

- 4.0 or higher: likely working, look for polish only.
- 3.0 to 3.9: usable but needs pattern analysis.
- below 3.0: likely pilot blocker or major clarity issue.
- one low score is not enough for a broad feature decision.
- repeated low scores plus direct observation should drive the next phase.

## 5. Confusion Pattern Analysis

Group confusion before deciding what to build.

| Confusion category | Evidence from pilot | Affected route/section | Likely response | Notes |
| --- | --- | --- | --- | --- |
| First-click confusion |  | Home / `/chapters` | Fix immediately if repeated | Did students miss `Start Journal Entries`? |
| Journal Entries concept confusion |  | `/chapters/journal-entries` | Content polish | Did students understand what a journal entry records? |
| Debit/credit confusion |  | first 3-5 sections | Explanation or example polish | Did students know why an account is debited or credited? |
| Section length/content confusion |  | section pages | Shorten, split, or add clearer example | Did students skim, stop, or say it felt too long? |
| Practice It Yourself confusion |  | Section 1 checkers | Instruction polish | Did students know they must enter a full entry? |
| Checker feedback confusion |  | post-check feedback | Feedback copy polish | Did students understand what to fix next? |
| Solver vs Practice confusion |  | `/practice/journal-entries`, `/journal-entry-solver`, `/solver` | Navigation/copy polish | Did students treat Solver as the main lesson? |
| Mobile/navigation friction |  | any pilot route | Fix immediately if it blocks completion | Look for overflow, hidden buttons, awkward forms. |
| Expectation mismatch |  | Dashboard, AI Assistant, unavailable chapters | Expectation-setting copy | Examples: login, progress, full syllabus, AI Assistant, all checkers. |

## 6. Positive Signal Analysis

Positive signals matter, but they should still be connected to evidence.

| Positive signal | Count/evidence | What it may mean | Possible action |
| --- | --- | --- | --- |
| Students asked for more practice |  | Existing flow may be understood enough to expand carefully | Consider one deterministic checker only after a checker-safety plan |
| Students said it was clearer than textbook-only learning |  | Core learning format is promising | Preserve the chapter-first flow |
| Students understood debit/credit better |  | First sections are doing useful teaching work | Polish, do not redesign too quickly |
| Students liked feedback |  | Checker feedback is learning-positive | Improve scanability before adding more cases |
| Students used Solver appropriately |  | Chapters/Practice/Solver distinction is working | Keep Solver as support, not the main course |
| Students wanted to use it again |  | Retention signal for another pilot | Run a second guided pilot after must-fix issues |

## 7. Improvement Backlog

Severity labels:

- Critical pilot blocker: prevents many students from starting or completing the flow.
- High learning friction: students continue, but learning is clearly blocked.
- Medium polish: students understand the flow, but copy or examples need improvement.
- Low nice-to-have: useful but not urgent.

Effort labels:

- Tiny docs/copy
- Small UI/content
- Medium scoped build
- Large/defer

Risk to accounting logic:

- None
- Low copy-only
- Medium checker-adjacent
- High engine/parser

| Issue/opportunity | Evidence from pilot | Affected route/section | Severity | Effort | Risk to accounting logic | Recommended action | Priority | Phase candidate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |

Backlog sorting rule:

Do not put a requested feature into the top priority list unless it is supported by repeated evidence or directly fixes the pilot's learning path.

## 8. Prioritisation Rules

Fix immediately if:

- many students cannot find where to start
- checker instructions confuse students
- mobile layout blocks completion

Polish content if:

- students understand the flow but struggle with explanations
- students say examples are useful but not enough
- students can proceed, but need clearer next-step guidance

Add one more deterministic checker only if:

- students understand the existing two checkers
- students understand the feedback enough to improve
- students ask for more practice after using the current flow
- the next checker has a simple expected answer and a separate checker-safety plan

Do not do yet:

- do not add broad features just because one student asks
- do not start login/progress/OCR/AI Assistant until the learning path is validated
- do not change accounting engines based on anecdotal confusion without a separate audit
- do not broaden Partnership/Company support from this pilot
- do not redesign routes unless navigation confusion is repeated and severe

## 9. Decision Framework

Choose one outcome after reviewing observations, ratings, and quotes.

| Outcome | Meaning | Next phase type |
| --- | --- | --- |
| Outcome A: pilot is strong enough to run with another 20-30 students | Most students start correctly, understand the first sections, attempt checkers, and trust feedback. | Second guided pilot or broader student pilot with the same scope plus small copy polish. |
| Outcome B: small polish needed before next pilot | Flow works, but repeated wording, mobile, or feedback issues appear. | Small pilot-blocker fixes or content/UX polish. |
| Outcome C: Journal Entries explanations need deeper rewrite | Students can navigate, but they do not understand concepts or examples. | Journal Entries explanation polish round 2, focused on the confusing sections only. |
| Outcome D: Practice/checker UX is the bottleneck | Students read content but fail to understand how to attempt or read checker feedback. | Existing checker UX round 2 before adding any new checker. |
| Outcome E: route/navigation clarity is the bottleneck | Students do not understand where to start or how Chapters, Practice, Solver, and Dashboard differ. | Route/copy clarity pass; avoid accounting-engine work. |

Decision discipline:

- Pick one primary outcome.
- Pick at most two secondary concerns.
- Do not begin a large feature phase until the primary bottleneck is clear.

## 10. Next-Phase Candidates

| Candidate | When it is allowed | Must not include |
| --- | --- | --- |
| Small pilot-blocker fixes | Repeated start, navigation, checker instruction, or mobile blockers | Broad route redesign, new features |
| Journal Entries explanation polish round 2 | Students understand route flow but struggle with concept clarity | New checkers, new engines |
| Existing checker UX round 2 | Students attempt checkers but cannot interpret feedback | New supported accounting cases |
| One additional deterministic Journal Entry checker | Existing two checkers are understood and students ask for more practice | Any checker without a separate safety plan |
| Second guided pilot | First pilot is mostly clear after small polish | Broad public launch assumptions |
| Broader student pilot | Two guided pilots show stable learning-path signals | Full-syllabus claims |
| Teacher review round | Teacher feedback is needed on pedagogy, examples, or classroom fit | Engine rewrites based only on preference |

Not next unless pilot evidence strongly supports readiness:

- login/auth/database progress
- OCR/photo/notebook checking
- AI Assistant logic
- payments
- broad all-chapter expansion
- broad Partnership/Company runtime expansion
- broad `/tools` migration or route redesign

## 11. Founder Reflection Questions

Answer these before selecting the next phase.

- Did students understand the learning path?
- Did they need too much explanation from me?
- Where did they hesitate?
- Did they learn something or only browse?
- Did they trust the answer checking?
- Did they ask for more examples?
- Did they compare it positively with books/tuition?
- What would I fix if I had only one week?

## 12. Final Recommendation Gate

If the pilot has not yet been conducted, the next real-world action is to run the guided student pilot using `docs/pilot-launch-package.md`.

Phase 5K should depend on actual pilot results. Do not choose Phase 5K from assumptions alone.
