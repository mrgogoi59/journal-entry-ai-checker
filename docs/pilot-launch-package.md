# AccyWise AI Pilot Launch Package

Phase: 5I

Status: planning-only

Use this package to run the first guided AccyWise AI student pilot. It is designed for a founder or teacher-led session with 10-20 Class 11/12 Commerce students.

This document does not change runtime behavior. It does not add Practice It Yourself questions, checker support, expected answers, parser/classifier/validator logic, Solver logic, accounting engines, API routes, persistence, OCR, payments, database/auth, progress, AI Assistant behavior, analytics events, or route migrations.

## 1. Pilot Readiness Summary

AccyWise AI is ready for a guided 10-20 student pilot with founder/teacher supervision.

The goal is learning-path validation, not full syllabus validation. The pilot should test whether students can start from the homepage, understand the Journal Entries chapter path, attempt the two existing Practice It Yourself checkers, understand feedback, and know when Practice or Solver should be used.

Pilot focus:

- Journal Entries only
- first 3-5 Journal Entries sections
- the two existing deterministic in-chapter checkers
- independent revision through `/practice/journal-entries`
- optional help through `/journal-entry-solver`
- optional short `/solver` tour

Current approved checkers:

- `Sold goods for cash ₹12,000`
- `Paid salary by bank ₹8,000`

Keep expectations clear: this is an early guided pilot, not a complete syllabus launch.

## 2. Pre-Pilot Founder Checklist

Complete this checklist before inviting students into the room or call.

- [ ] Open the live site: `https://accywise.in`
- [ ] Confirm the homepage loads on desktop.
- [ ] Confirm the homepage loads on at least one mobile phone.
- [ ] Click `Start Journal Entries` from the homepage.
- [ ] Confirm `/chapters/journal-entries` opens.
- [ ] Read the Journal Entries overview and confirm it says the pilot has exactly two Practice It Yourself checkers.
- [ ] Open the first section and confirm the first Practice It Yourself area appears.
- [ ] Test checker 1: `Sold goods for cash ₹12,000`.
- [ ] Test checker 2: `Paid salary by bank ₹8,000`.
- [ ] Confirm feedback appears after checking.
- [ ] Confirm the correct answer reveal remains after an attempt only.
- [ ] Open `https://accywise.in/practice/journal-entries`.
- [ ] Open `https://accywise.in/journal-entry-solver`.
- [ ] Open `https://accywise.in/solver`.
- [ ] Check the core flow on at least one mobile phone, preferably a smaller screen.
- [ ] Prepare a notebook, printed sheet, or spreadsheet for observations.
- [ ] Decide the student group size and timing.
- [ ] Prepare a backup internet connection if possible.
- [ ] Prepare a backup device or charger if possible.
- [ ] Remind observers not to collect unnecessary personal data.

## 3. Pilot Route List

Use these exact live routes:

| Purpose | Route |
| --- | --- |
| Home | `https://accywise.in` |
| Journal Entries chapter | `https://accywise.in/chapters/journal-entries` |
| Journal Entries practice | `https://accywise.in/practice/journal-entries` |
| Journal Entry Explainer | `https://accywise.in/journal-entry-solver` |
| Solver hub | `https://accywise.in/solver` |

Expected student path:

1. Home
2. `Start Journal Entries`
3. Journal Entries overview
4. first 3-5 Journal Entries sections
5. two Practice It Yourself checkers
6. Practice through `/practice/journal-entries`
7. optional Journal Entry Explainer
8. optional Solver hub tour

Do not send students first to `/tools`, `/practice/advanced`, login, progress, OCR/photo checking, or AI Assistant.

## 4. Student Invitation Message

Use or adapt this WhatsApp/SMS-style message:

```text
Hi! We are doing a small early pilot of AccyWise AI for Accountancy, focused only on Journal Entries.

This is not a test of your marks. We want to see whether the website explains Journal Entries clearly and whether the practice feedback helps.

The session will take around 20-40 minutes. Please use the site naturally and share honest feedback, especially if anything is confusing.

Note: this is an early pilot, so the full syllabus is not complete yet.
```

## 5. Teacher Or Mentor Invitation Message

Use or adapt this observer message:

```text
Hi! We are running a guided early pilot of AccyWise AI with a small group of Commerce students.

The goal is to observe whether students can understand the Journal Entries learning path, use the two existing Practice It Yourself checkers, and understand feedback without too much help.

We are not asking you to evaluate the full syllabus or every accounting topic. Please mainly observe where students hesitate, what confuses them, whether they understand the feedback, and how comfortable the mobile experience feels.

Your notes will help us decide what to improve before building more features.
```

## 6. Founder Opening Script

Read this before students begin:

```text
Today we are testing AccyWise AI, an early Accountancy learning platform.

This is not a test of your marks or intelligence. We are testing whether the platform explains Journal Entries clearly.

Please start from the homepage and use the site naturally. If something is confusing, say it honestly. If you do not know where to click, say that too. Confusion is useful because it tells us what to improve.

For this pilot, focus only on Journal Entries. Some parts of the platform are still early or coming later. Only a few practice checks are live right now.

Try to read, attempt the Practice It Yourself questions, and tell us whether the feedback helps you understand the mistake.
```

## 7. Session Timetable

Recommended duration: 20-40 minutes.

| Time | Activity | Founder/teacher focus |
| --- | --- | --- |
| 3 minutes | Introduction | Explain that the platform is being tested, not the student. |
| 5 minutes | Homepage and chapter overview | Watch whether students find `Start Journal Entries` without help. |
| 10-15 minutes | First sections | Watch whether students understand the first few sections and where they hesitate. |
| 8-10 minutes | Practice It Yourself checkers | Watch whether students enter a full journal entry and understand feedback. |
| 5 minutes | Optional Solver support | Use `/journal-entry-solver` only if students are stuck or time remains. |
| 5-7 minutes | Feedback | Ask short questions and collect ratings. |

If time is short, skip the `/solver` tour. Do not skip the two Practice It Yourself checkers unless the session is only a quick first-click test.

## 8. Observation Sheet

Copy this table into paper or a spreadsheet. Use student numbers/codes instead of full sensitive details.

| Student code | Device type | Found first click without help? | Understood overview? | Reached first section? | Understood one section? | Attempted checker? | Understood feedback? | Used Solver? | Confused Chapters/Practice/Solver? | Mobile issue? | Asked for more practice? | Key quote/note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |
| S2 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |
| S3 | Mobile/Desktop | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No |  |

Helpful observer notes:

- first place clicked
- first hesitation
- first wrong assumption
- checker mistake pattern
- feedback sentence students understood
- feedback sentence students did not understand
- mobile layout issue, if any
- student quote

## 9. Student Feedback Form Template

Ask these after the pilot:

- What was easiest to understand?
- What was confusing?
- Did the Practice It Yourself checker help?
- Did the feedback make sense?
- Was this better than textbook-only learning?
- Would you use this again?
- What should be added first?

Optional 1-5 ratings:

| Rating item | 1 means | 5 means | Rating |
| --- | --- | --- | --- |
| Easy to start | I did not know where to begin | I knew where to begin quickly |  |
| Explanation clarity | The explanation was confusing | The explanation was clear |  |
| Checker usefulness | The checker did not help | The checker helped me learn |  |
| Mobile comfort | Mobile felt hard to use | Mobile felt comfortable |  |
| Confidence improvement | I feel no more confident | I feel more confident with Journal Entries |  |
| Likelihood of using again | I would not use it again | I would use it again for Accountancy |  |

Optional final prompt:

```text
If you could change one thing in AccyWise AI before the next student group uses it, what would it be?
```

## 10. Post-Pilot Decision Checklist

Use this immediately after the pilot. Do not start building broad features before sorting the feedback.

Fix immediately if:

- many students cannot find where to start
- checker instructions confuse students
- students do not understand feedback after checking
- mobile layout creates horizontal overflow or form friction
- wording makes students think all chapters or all checkers are complete

Polish content if:

- students understand the flow but struggle with explanations
- students say a section is too long
- students skip or misunderstand examples
- students cannot explain Chapters vs Practice vs Solver

Consider one more checker only if:

- most students understand the existing two checkers
- feedback helps students self-correct
- students ask for more practice
- the next checker has simple deterministic accounting treatment
- the expected answer can remain server-controlled and audited

Do not build yet:

- broad login/auth/database progress
- OCR/photo/notebook checking
- AI Assistant logic
- payments
- broad all-chapter expansion
- broad `/tools` migration or route redesign
- unsupported advanced Partnership/Company cases
- checker/parser/classifier/validator rewrites
- accounting-engine changes

Decision after pilot:

- If first-click and checker feedback are clear: prepare a small post-pilot improvement backlog.
- If first-click is confusing: fix homepage/chapter-entry copy before adding features.
- If feedback is confusing: improve checker copy before adding another checker.
- If students ask for more practice and understand the current two: plan exactly one next deterministic checker.

## 11. Data And Privacy Caution

Keep the pilot lightweight and respectful.

- Do not collect unnecessary personal data.
- Use student numbers or codes where possible.
- If testing with minors or school groups, get appropriate permission from the school/teacher/guardian as needed.
- Keep notes focused on product usability, learning clarity, route confusion, checker feedback, and mobile comfort.
- Do not publish student quotes or identifiable details without permission.
- Do not ask for login, passwords, personal documents, photos, or notebooks during this pilot.

## 12. Final Founder Reminder

The first pilot is successful if it produces honest learning evidence, not if every student says the app is perfect.

Look for:

- where students naturally click first
- whether they understand Journal Entries better after the first sections
- whether they attempt a full entry
- whether feedback helps them fix mistakes
- whether mobile feels usable
- whether they ask for more practice after understanding the current two checks

Recommended next phase after this package:

- Phase 5J: Post-pilot analysis template and improvement backlog
