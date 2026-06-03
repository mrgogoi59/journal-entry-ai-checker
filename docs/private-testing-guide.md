# Private Testing Guide

Use this guide to test the Journal Entry AI Checker privately with 5-10 Class 11/12 commerce students.

## Purpose Of The Test

The goal is to check whether students can easily use the app to practice beginner journal entries.

This test should help answer:

- Can students understand the app without much explanation?
- Can they enter a transaction and journal entry correctly?
- Does the checker correctly identify right and wrong answers?
- Are the explanations simple enough for beginner accountancy learners?
- Which real student wordings are still unsupported?

## Who Should Test

- Class 11 commerce students
- Class 12 commerce students
- Beginner accountancy learners
- Coaching institute students

## What Students Should Test

Ask students to test only simple one-debit, one-credit journal entries.

Suggested transactions:

- Started business with cash
- Purchased goods for cash
- Sold goods for cash
- Paid rent
- Paid salary
- Drawings
- Received from debtor
- Paid to creditor
- Deposited cash into bank
- Withdrew cash from bank
- Took loan
- Repaid loan
- Interest paid
- Interest received
- Commission received

## What Students Should Not Test Yet

These cases are not supported yet:

- Compound entries
- GST
- Discount allowed/received
- Depreciation
- Bad debts
- Outstanding expenses
- Prepaid expenses
- Accrued income
- Adjustments
- Final accounts
- Ledger posting
- Trial balance

## Student Feedback Questions

Ask each student:

- Was the app easy to understand?
- Did you know where to type the transaction?
- Did you know where to type the journal entry?
- Did the app correctly check your answer?
- Did the explanation help you understand the mistake?
- Which transaction did the app fail to understand?
- Did the app mark any correct answer wrong?
- Did the app mark any wrong answer correct?
- What confused you?
- Would you use this for practice again?

## Testing Format

| Student Name | Class | Transactions Tried | Correct Results | Wrong Results | Unsupported Transactions | Feedback | Confusion Points |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

## Success Criteria

The MVP is successful if:

- Students understand the UI within 1 minute
- At least 80% of supported beginner transactions work correctly
- Explanations are understandable
- Students want to try more questions
- Major wrong results are not found

## After-Test Action Plan

After testing:

- Collect all unsupported student transaction sentences
- Fix only repeated real-world failures
- Add tests for every fixed failure
- Do not add big features before fixing accuracy issues
