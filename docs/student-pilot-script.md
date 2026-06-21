# AccyWise AI Student Pilot Script

Phase: 5G

Status: planning-only

This document is for a founder or teacher-led pilot with 10-20 Class 11/12 Commerce students. It does not change runtime behavior, app UI, tests, routes, checkers, parser/classifier/validator logic, Solver tools, accounting engines, storage, analytics events, database, login, progress, OCR, payments, or AI Assistant behavior.

## 1. Pilot Objective

The goal of this pilot is not to prove the full syllabus, every route, or every future feature.

Use the pilot to learn whether students can:

- understand where to start on AccyWise AI
- follow the first Journal Entries learning path without founder explanation
- understand Journal Entries better than from textbook-only reading
- notice and attempt the two existing Practice It Yourself checkers
- understand checker feedback well enough to improve their answer
- know when to use Practice and Solver without getting lost

The main output should be a short list of confusion points to fix before building more.

## 2. Pilot Scope

Include only:

- Home
- `/chapters/journal-entries`
- the first 3-5 Journal Entries sections
- the two existing Practice It Yourself checkers
- `/practice/journal-entries`
- `/journal-entry-solver` as optional support when stuck
- `/solver` as a short optional tour if time remains

Exclude:

- login, auth, database, or saved progress
- AI Assistant logic
- OCR or photo checking
- payments
- broad all-chapter expansion
- new Practice It Yourself questions
- unsupported or deferred accounting cases
- broad `/tools` migration or route redesign

## 3. Participant Profile

Recommended group:

- 10-20 Class 11/12 Commerce students
- mixed ability levels, not only high-performing students
- beginner and average students are especially important
- 1 optional teacher or mentor observer

If possible, include:

- students who recently started Journal Entries
- students who know debit/credit but still make mistakes
- students who primarily use mobile phones for study

## 4. Session Setup

Recommended duration: 20-40 minutes.

Device plan:

- Use a mix of mobile and desktop if possible.
- If only one device type is available, prefer mobile for the first pilot because many students will use phones.
- Ask at least a few students to test the full flow on a smaller mobile screen.

Observation style:

- Start with light guidance, then observe silently.
- Let students click where they naturally want to click.
- Do not correct every mistake immediately.
- Ask students to think aloud when they hesitate.

Before the test, explain:

- this is an early pilot
- only Journal Entries is the focus
- the student is not being judged
- confusion is useful feedback
- honest comments are more valuable than polite comments

Before the test, do not explain:

- exactly where every route is
- what Practice It Yourself means
- how checker feedback works
- that Dashboard progress is not live yet
- that AI Assistant is not implemented yet
- which answers are correct

## 5. Founder Or Teacher Opening Script

Say this before students begin:

"Today we are testing AccyWise AI, an early Accountancy learning platform. This is not a test of your marks or intelligence. We are testing whether the platform explains Journal Entries clearly.

Please start from the homepage and use the site naturally. If something is confusing, say it honestly. If you do not know where to click, say that too. Confusion is useful because it tells us what to improve.

For this pilot, focus only on Journal Entries. Some parts of the platform are still early or coming later. Try to read, attempt the Practice It Yourself questions, and tell us whether the feedback helps you understand the mistake."

## 6. Student Task Flow

Use this as the exact pilot flow. It should fit a 20-40 minute session.

1. Open the AccyWise AI homepage.
2. Without help, find where a new student should start.
3. Click `Start Journal Entries`.
4. Read the Journal Entries chapter overview.
5. Open or continue through the first Journal Entries section.
6. Continue through the first few sections if time allows: Business Transactions, Accounts Affected, Types of Accounts, and Debit and Credit Rules.
7. When Practice It Yourself appears, attempt `Sold goods for cash`.
8. Read the feedback and say what you think was right or wrong.
9. Attempt `Paid salary by bank`.
10. If stuck, open `/journal-entry-solver` and try one supported simple transaction.
11. Open `/practice/journal-entries` and explain what you think this page is for.
12. If time remains, open `/solver` for a short tour and explain how Solver feels different from Chapters and Practice.
13. Share what was clear, what was confusing, and what should be added first.

## 7. Observation Checklist

Watch for these signals while students use the site:

- Did the student find `Start Journal Entries` without help?
- Did the student understand that Journal Entries is the first production chapter?
- Did the student understand what a Journal Entry records?
- Did the student understand debit and credit better after the first few sections?
- Did the student notice Practice It Yourself?
- Did the student understand how to attempt the checker?
- Did the student enter a full journal entry rather than expecting multiple choice?
- Did the student understand feedback after checking?
- Did the student know what to do after feedback?
- Did the student use Solver only when stuck, or did they treat Solver as the main course?
- Did the student understand the difference between Chapters, Practice, and Solver?
- Did the student get lost in navigation?
- Did mobile layout, buttons, tables, or forms create horizontal overflow or friction?
- Did any copy make the student think all chapters or all checkers are complete?
- Did the student ask for more practice questions?

## 8. Student Feedback Questions

Ask these after the task flow:

- What was clear?
- What was confusing?
- Where did you hesitate?
- Was this better than reading a textbook alone?
- Did the Practice It Yourself checker help you learn?
- Did the checker feedback make sense?
- Did you understand what to do after feedback?
- Did Solver help, or did it confuse the flow?
- Did Practice feel like revision after learning?
- Would you use this again for Accountancy?
- What should be added first?
- What would make this easier on mobile?

## 9. Rating Sheet

Ask students to rate each item from 1 to 5.

| Category | 1 means | 5 means | Rating |
| --- | --- | --- | --- |
| Ease of starting | I did not know where to begin | I knew where to begin quickly |  |
| Explanation clarity | The lesson was confusing | The lesson was clear |  |
| Example usefulness | Examples did not help | Examples made the idea clearer |  |
| Checker feedback usefulness | Feedback did not help me improve | Feedback showed what to fix |  |
| Mobile comfort | Mobile felt hard to use | Mobile felt comfortable |  |
| Confidence improvement | I feel no more confident | I feel more confident with Journal Entries |  |
| Likelihood of using again | I would not use it again | I would use it again for Accountancy |  |

Optional observer notes:

- First click:
- First hesitation:
- First wrong assumption:
- Most useful screen:
- Biggest confusion:
- Student quote:

## 10. Success Signals

Treat the pilot as successful if most students:

- find `Start Journal Entries` without help
- complete at least one section
- notice the Practice It Yourself area
- attempt at least one full journal entry
- understand at least one checker result
- can explain one debit/credit reason in simple words
- know Solver is for help, not the main lesson
- ask for more practice questions or more chapters
- say the flow is clearer than textbook-only learning

## 11. Failure Or Confusion Signals

Treat these as warning signs:

- students do not know where to start
- students think all chapters are complete
- students expect login, saved progress, or marks
- students cannot understand the checker instructions
- students ignore the feedback after checking
- students cannot tell the difference between Chapters, Practice, and Solver
- students start in Solver and never return to learning
- students expect AI Assistant to be live
- students get stuck on mobile navigation or form layout
- students think Practice It Yourself is multiple choice
- students ask for unsupported advanced cases during the first flow

## 12. Post-Pilot Decision Rules

After the pilot, sort feedback into four buckets.

Fix immediately:

- unclear first click
- confusing checker instructions
- feedback copy that students do not understand
- mobile layout or horizontal overflow issues
- wording that implies unsupported features are complete

Polish Journal Entries further:

- sections that feel too long
- examples that students skip or misunderstand
- weak next-step guidance
- confusing distinction between Chapters, Practice, and Solver

Defer:

- login or saved progress
- AI Assistant
- OCR/photo checking
- payments
- broad all-chapter expansion
- complex Partnership or Company Accounts support

Consider adding one more checker only if:

- most students understand the existing two checkers
- feedback is clear enough for students to self-correct
- students ask for more practice
- the next checker has simple accounting treatment
- the expected answer can remain deterministic and server-controlled

Consider the next chapter only if:

- students can complete the Journal Entries pilot path
- route confusion is low
- mobile comfort is acceptable
- the team has a clear list of Journal Entries fixes to keep or defer

Consider a broader pilot only if:

- most students complete the core flow in 20-40 minutes
- at least one checker result is understood without teacher correction
- students can explain what Chapters, Practice, and Solver are for
- no major mobile or navigation blocker appears

## 13. Recommended Next Phase

Recommended next phase after this document:

- Phase 5H: Founder/mobile pilot rehearsal audit

The next phase should rehearse this script on mobile and desktop before involving students. It should not add new checkers, new routes, saved progress, AI Assistant logic, OCR, payments, database/auth, or accounting-engine changes.
