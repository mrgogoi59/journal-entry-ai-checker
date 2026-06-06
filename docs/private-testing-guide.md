# Private Testing Guide

Use this guide to test the current Journal Entry AI Checker privately with Class 11/12 commerce students and beginner accountancy learners.

## What The App Does

This is a rule-based beginner journal entry practice app. It has four main areas:

- Journal Entry Checker: students enter a transaction and their journal entry. The app checks accounts, debit/credit side, amount, and balance.
- Journal Entry Practice: the app gives a practice transaction. Students write the entry and check their answer.
- AI Journal Entry Explainer: students enter only a transaction. The app shows the expected journal entry and the debit-credit logic.
- Supported Transactions guide: students can see what is supported now and what is not supported yet.

The app does not use login, database, or payment. It does not send feedback automatically. Reports are copied to the clipboard so testers can send them manually.

## Simple Testing Instructions For Students

1. Test one transaction at a time.
2. Write clear Class 11/12 style wording.
3. Always include an amount.
4. If the transaction uses cash, bank, UPI, GPay, PhonePe, NEFT, cheque, or credit, mention it clearly.
5. For GST-inclusive entries, always mention the GST rate.
6. If a person name is used, make the role clear, such as debtor, creditor, customer, supplier, employee, landlord, or loan provider.
7. If the app gives a wrong or confusing answer, click Report wrong answer or Report issue and send the copied report to the tester/developer.

## How To Test Checker

Open the home page and choose Check My Journal Entry.

Steps:

1. Type a business transaction.
2. Type the journal entry in the answer box.
3. Use one account per line.
4. Use Dr. for debit and To for credit.
5. Click Check My Journal Entry.
6. Check whether the app result is correct.
7. If the answer looks wrong or confusing, use Report wrong answer.

Example:

Transaction:
Bought goods for cash Rs.10000

Student entry:
Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Expected app result:
Correct, 100/100.

## How To Test Practice

Open the home page and choose Practice Questions.

Steps:

1. Click Try Another Question if no question is shown.
2. Read the transaction.
3. Write the journal entry.
4. Click Check Answer.
5. Use Retry Same Question if you want to correct your entry.
6. Use Try Another Question for a new transaction.
7. If the app marks a correct practice answer wrong, use Report wrong answer.

Practice testing is useful because it checks whether students can use the app without being given examples first.

## How To Test AI Journal Entry Explainer

Open AI Journal Entry Explainer.

Steps:

1. Enter a transaction only.
2. Choose Beginner Mode for detailed explanation.
3. Choose Exam Mode for a shorter answer.
4. Click Explain Journal Entry.
5. Check the final journal entry, narration, affected accounts, step-by-step logic, and common mistakes.
6. Try unsupported or ambiguous wording and check whether the app gives a helpful reason.
7. If the answer or explanation looks wrong, use Report issue.

Example solved case:
Sold machinery Rs.40000 plus GST 18%

Expected explainer result:
Cash A/c Dr. Rs.47200
To Machinery A/c Rs.40000
To Output GST A/c Rs.7200

Example ambiguous case:
Paid Ram Rs.5000

Expected explainer result:
The app should not guess. It should ask for context because Ram could be a creditor, employee, landlord, supplier, or loan provider.

## How To Use Report Wrong Answer

Use the report feature whenever the app result seems wrong, confusing, or unsupported when it should be supported.

Where it appears:

- Checker result card: Report wrong answer
- Practice result card: Report wrong answer
- Explainer solved result: Report issue
- Explainer unsupported or ambiguous result: Report issue

Steps:

1. Click Report wrong answer or Report issue.
2. Choose what seems wrong:
   - Wrong answer
   - App marked correct answer wrong
   - Explanation is confusing
   - Unsupported but should be supported
   - Other
3. Write what you expected or what confused you.
4. Review the auto-filled details.
5. Click Copy report.
6. Send the copied report to the tester/developer.

The report should include transaction, student entry if available, app result, correct entry shown by app if available, module name, comment, and timestamp.

## 20 Sample Transactions For Students

Use these to test normal supported cases:

1. Started business with cash Rs.50000
2. Introduced capital Rs.75000 through bank
3. Bought goods for cash Rs.10000
4. Purchased goods from Amit Rs.8000
5. Sold goods for cash Rs.12000
6. Sold goods to Raju Rs.5000
7. Paid rent by UPI Rs.2000
8. Paid salary Rs.6000 in cash
9. Received Rs.4000 from debtor Raju in cash
10. Paid Rs.3000 to creditor Amit through bank
11. Deposited cash into bank Rs.10000
12. Withdrew cash from bank Rs.5000
13. Took loan Rs.50000 through bank
14. Repaid loan Rs.10000 through bank
15. Paid interest Rs.1500 in cash
16. Received commission Rs.2500 in cash
17. Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit
18. Sold goods Rs.10000, received Rs.4000 cash and balance on credit
19. Purchased goods Rs.11800 including GST 18% for cash
20. Sold machinery Rs.40000 plus GST 18%

## Useful Wrong-Answer Tests

These help confirm the checker catches mistakes:

- For Bought goods for cash Rs.10000, try debiting Cash and crediting Purchases. The app should not mark it correct.
- For Sold goods to Raju Rs.5000, try Cash A/c Dr. To Sales A/c. The app should not mark it correct because Raju is a named customer.
- For Paid rent by UPI Rs.2000, try To Cash A/c. The app should prefer Bank A/c for UPI.
- For partial sale, try debiting Cash for the full sale amount. The app should not mark it correct.

## Unsupported Or Limited Cases

Ask students not to judge the app badly for these yet. They are known limitations.

- Broad compound entries outside controlled beginner cases
- GST-inclusive amount without GST rate
- CGST/SGST/IGST split when rates are missing
- GST set-off/refund/cross-utilisation beyond currently supported simple set-off and payment cases
- GST penalty or GST interest
- GST with discount
- GST with sales return or purchase return plus refund
- GST on fixed asset purchase
- GST on expenses or incomes beyond current controlled examples
- Discount allowed/received unless written as supported settlement wording
- Depreciation with unclear asset
- Bad debts with provision or complex recovery
- Outstanding/prepaid/accrued/advance adjustments beyond currently supported simple adjustment cases
- Final accounts
- Ledger posting
- Trial balance
- Partnership/company accounts
- Asset purchase with installation charges and GST together
- Asset sale with GST plus profit/loss or accumulated depreciation
- Person-only transactions without context, such as Paid Ram Rs.5000

## What Feedback Testers Should Send

For every failed or confusing case, send:

- Student class: Class 11 or Class 12
- Module used: Checker, Practice, or Explainer
- Exact transaction typed
- Exact student journal entry typed
- App result/status
- Correct entry shown by app
- What the student expected
- Screenshot if possible
- Copied report text from Report wrong answer or Report issue
- Whether the student understood the explanation

Most important feedback:

- App marked correct answer wrong
- App marked wrong answer correct
- App gave unsupported for a common Class 11/12 transaction
- Explanation confused the student
- Student wording that the app did not understand

## Testing Session Plan

Use this 20-30 minute plan with each student:

1. Give no long explanation. Let the student try the app naturally.
2. Ask the student to test 5 sample transactions from the list.
3. Ask the student to intentionally make 2 wrong entries.
4. Ask the student to try 2 transactions in Practice.
5. Ask the student to try 2 transactions in the Explainer.
6. Ask the student to use Report wrong answer on one test result.
7. Ask what was easy, confusing, or missing.

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
- Was the Report wrong answer button easy to use?
- Would you use this for practice again?

## Testing Record Table

| Student Name | Class | Module Tested | Transactions Tried | Correct Results | Wrong Results | Unsupported Cases | Reports Copied | Feedback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |

## Success Criteria

The private test is successful if:

- Students understand the app within 1 minute
- Most supported beginner transactions are checked correctly
- Students can use Checker and Practice without help
- Explainer answers are understandable
- Report wrong answer can be copied successfully
- Repeated unsupported real student wordings are collected for future fixes

## After Testing

After testing:

- Save all copied reports in one document.
- Group repeated failed transactions.
- Fix only repeated real-world failures first.
- Add automated tests for every fixed case.
- Do not add major new features before improving accuracy and clarity.
