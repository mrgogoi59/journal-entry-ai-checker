# Private Testing Guide

Use this guide to test the current full platform privately with accountancy teachers, Class 11/12 commerce students, B.Com students, coaching tutors, and non-commerce testers checking UI clarity.

## 1. What This App Does

This is a rule-based accountancy learning app. It helps students check, practice, explain, post, and prepare beginner-to-intermediate accounting work.

Current modules:

- Journal Entry Checker
- Practice Module
- AI Journal Entry Explainer
- Ledger Posting
- Trial Balance
- Final Accounts
- Balance Sheet grouping
- Supported Transactions page
- Report Wrong Answer feature

The app does not use login, database, payment, or real AI fallback. Reports are copied manually and sent to the developer/test coordinator.

## 2. Who Should Test It

- Accountancy teachers
- Class 11/12 commerce students
- B.Com students
- Coaching tutors
- Non-commerce testers checking whether the UI is understandable

## 3. Before You Start Testing

Use clear accounting language and include amounts. Mark every test as:

- Pass
- Fail
- Confusing
- Unsupported correctly
- Unsupported incorrectly

When something fails or feels unclear, copy a report using Report Wrong Answer / Report issue.

## 4. How To Test Journal Entry Checker

Open the home page and use Journal Entry Checker.

Steps:

1. Enter a transaction.
2. Enter the student journal entry.
3. Use one account per line.
4. Use Dr. and To clearly.
5. Click Check My Journal Entry.
6. Confirm whether the app marks it correctly.

Example:

Transaction:
Bought goods for cash Rs.10000

Correct journal entry:
Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Expected result:
Correct, 100/100.

## 5. How To Test Practice Module

Open Practice Module.

Steps:

1. Generate a practice question.
2. Ask the student to solve without help.
3. Check the answer.
4. Try one correct answer and one intentionally wrong answer.
5. Use Report wrong answer if the result looks wrong.

Good practice checks:

- Does the question wording feel clear?
- Does the student know where to type the answer?
- Does Retry Same Question work?
- Does Try Another Question work?

## 6. How To Test AI Journal Entry Explainer

Open AI Journal Entry Explainer.

Steps:

1. Enter only the transaction.
2. Click Explain Journal Entry.
3. Check Final Journal Entry, Narration, Affected Accounts, Step-by-step Logic, Common Mistakes, and Practice Next.
4. Try both supported and unsupported examples.
5. Use Report issue for wrong or confusing explanations.

Example:

Transaction:
Sold goods to Raju Rs.5000

Expected:
Raju A/c Dr. Rs.5000
To Sales A/c Rs.5000

## 7. How To Test Ledger Posting

Open `/ledger` and paste these journal entries:

Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000

Expected:

- Cash debit balance Rs.37000
- Capital credit balance Rs.50000
- Purchases debit balance Rs.10000
- Rent debit balance Rs.3000

## 8. How To Test Trial Balance

Open `/trial-balance` and paste the same journal entries:

Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000

Expected Trial Balance:

- Cash Dr Rs.37000
- Purchases Dr Rs.10000
- Rent Dr Rs.3000
- Capital Cr Rs.50000
- Debit total Rs.50000
- Credit total Rs.50000
- Trial Balance agrees

## 9. How To Test Final Accounts

Open `/final-accounts`. Paste the Trial Balance in the first box and Adjustments in the second box.

Trial Balance:

Capital A/c Cr Rs.135000
Drawings A/c Dr Rs.12000
Cash A/c Dr Rs.25000
Bank A/c Dr Rs.60000
Debtors A/c Dr Rs.35000
Creditors A/c Cr Rs.30000
Loan A/c Cr Rs.70000
Machinery A/c Dr Rs.90000
Furniture A/c Dr Rs.30000
Computer A/c Dr Rs.20000
Purchases A/c Dr Rs.70000
Sales A/c Cr Rs.150000
Sales Return A/c Dr Rs.5000
Purchase Return A/c Cr Rs.6000
Salary A/c Dr Rs.16000
Rent A/c Dr Rs.9000
Insurance A/c Dr Rs.7000
Commission Received A/c Cr Rs.5000
Interest Income A/c Cr Rs.4000
Rent Income A/c Cr Rs.6000
Output GST A/c Cr Rs.9000
Input GST A/c Dr Rs.8000

Adjustments:

Closing stock Rs.30000
Salary outstanding Rs.4000
Prepaid insurance Rs.2000
Interest accrued Rs.1500
Rent received in advance Rs.2000
Depreciation on machinery Rs.9000
Depreciation on furniture Rs.3000
Depreciation on computer Rs.2000

Expected:

- Gross Profit Rs.89000
- Net Profit Rs.49500
- Adjusted Capital Rs.172500
- Balance Sheet agrees

## 10. How To Test Balance Sheet

In `/final-accounts`, after preparing Final Accounts, check the Balance Sheet section.

Expected grouping:

- Liabilities: Capital, Non-current Liabilities, Current Liabilities
- Assets: Fixed Assets, Current Assets
- Totals should remain unchanged
- Balance Sheet should say whether it agrees

Check that Drawings is not shown separately if already deducted in Capital Working.

## 11. How To Test Final Accounts Adjustments

### Debtor/Creditor Provision Test

Trial Balance:

Capital A/c Cr Rs.100000
Cash A/c Dr Rs.30000
Debtors A/c Dr Rs.50000
Creditors A/c Cr Rs.50000
Provision for Doubtful Debts A/c Cr Rs.1000
Provision for Discount on Debtors A/c Cr Rs.500
Provision for Discount on Creditors A/c Dr Rs.500
Bank A/c Dr Rs.71000

Adjustments:

Further bad debts Rs.2000
Create provision for doubtful debts @ 5% on debtors
Create provision for discount on debtors @ 2%
Create provision for discount on creditors @ 2%

Expected:

- Adjusted Debtors Rs.48000
- Provision for Doubtful Debts Rs.2400
- Good Debtors Rs.45600
- Provision for Discount on Debtors Rs.912
- Net Debtors Rs.44688
- Provision for Discount on Creditors Rs.1000
- Net Creditors Rs.49000

### Goods Adjustment Samples

Goods withdrawn:
Goods withdrawn by proprietor Rs.5000

Expected:
- Purchases reduced
- Capital Working reduced as drawings

Free samples:
Goods distributed as free sample Rs.3000

Expected:
- Purchases reduced
- Advertisement Expense increased

Charity:
Goods given as charity Rs.2000

Expected:
- Purchases reduced
- Charity Expense increased

Goods lost by fire:
Goods lost by fire Rs.5000

Expected:
- Purchases reduced
- Loss by Fire in P&L

Goods lost with insurance claim:
Goods lost by fire Rs.5000, insurance claim admitted Rs.3000

Expected:
- Purchases reduced Rs.5000
- Loss by Fire Rs.2000
- Insurance Claim Receivable Rs.3000

### Interest / Commission Adjustment Samples

Manager's commission:
Manager's commission 10% on net profit before commission

Interest on capital:
Interest on capital @ 10%

Interest on drawings:
Interest on drawings @ 10%

Interest on loan:
Interest on loan @ 10%

Expected:
- Check P&L
- Check Capital Working for capital/drawings interest
- Check Balance Sheet liability for outstanding interest on loan
- Check Manager's Commission Working if used

## 12. How To Test Report Wrong Answer

When something looks wrong:

1. Click Report wrong answer / Report issue.
2. Choose issue type.
3. Write expected answer/comment.
4. Check Report preview.
5. Click Copy report.
6. Send copied report to the developer/test coordinator.

Feedback should include:

- Transaction/input
- Student answer if any
- App result
- Expected result
- Screenshot if possible
- Comment

## 13. Full Workflow Test

Use this flow to check the platform end to end:

1. Solve one transaction in Checker.
2. Try one Practice question.
3. Ask Explainer for the same type of transaction.
4. Post three journal entries in Ledger.
5. Generate Trial Balance from the same entries.
6. Prepare Final Accounts from a Trial Balance.
7. Check grouped Balance Sheet.
8. Report one confusing or intentionally wrong case.

## 14. Known Supported Areas

- Capital introduced
- Purchases and sales
- Named parties in purchases and sales
- Simple expenses and incomes
- Drawings
- Debtor receipt and creditor payment
- Discount allowed/received in supported settlement cases
- Depreciation
- Bad debts and bad debts recovered
- Outstanding/prepaid/accrued/advance adjustments in controlled cases
- Goods withdrawn by proprietor
- Sales return and purchase return
- GST goods purchase/sale and selected GST set-off/payment cases
- Ledger posting
- Trial Balance
- Final Accounts
- Balance Sheet grouping
- Provision for Doubtful Debts
- Further Bad Debts
- Provision for Discount on Debtors
- Provision for Discount on Creditors
- Manager's Commission
- Goods Distributed as Free Sample
- Goods Given as Charity
- Goods Lost by Fire/Theft
- Goods Lost by Fire with Insurance Claim
- Interest on Capital
- Interest on Drawings
- Interest on Loan

## 15. Known Unsupported Areas

- AI Tutor not added yet
- Database/login/cloud sync not added yet
- Attempt History exists, but it is browser-only localStorage and not cloud synced
- Company accounts not added yet
- Partnership accounts not added yet
- Detailed schedules not added yet
- Date-wise drawings interest not added yet
- Average capital/drawings calculation not added yet
- Provision for discount schedules are basic only
- GST on complex final accounts adjustments not added yet
- Theft/general loss with insurance claim not added yet
- Stock ledger schedule not added yet
- Broad compound entries outside controlled cases
- Asset sale with GST plus accumulated depreciation in one complex workflow

## 16. What Feedback Testers Should Send

Send failed or confusing cases with:

- Tester type: teacher, Class 11/12 student, B.Com student, tutor, or non-commerce tester
- Module used
- Exact transaction/input
- Student answer if any
- App result/status
- Expected result
- Screenshot if possible
- Copied report text
- Tester score: Pass, Fail, Confusing, Unsupported correctly, or Unsupported incorrectly

Most valuable feedback:

- Correct answer marked wrong
- Wrong answer marked correct
- Common student wording not understood
- Explanation or UI is confusing
- Unsupported case that should be supported for Class 11/12

## 17. Suggested Testing Plan For 30 Minutes

1. Spend 5 minutes testing Checker with 5 journal entries.
2. Spend 5 minutes testing Practice.
3. Spend 5 minutes testing Explainer.
4. Spend 5 minutes testing Ledger and Trial Balance.
5. Spend 7 minutes testing Final Accounts and Balance Sheet grouping.
6. Spend 3 minutes copying one Report Wrong Answer.

## 18. Suggested Testing Plan For Teachers

1. Pick 10 common Class 11/12 transactions.
2. Ask students to solve 5 in Checker and 5 in Practice.
3. Use Explainer for mistakes students make repeatedly.
4. Test one Ledger and Trial Balance workflow.
5. Test one basic Final Accounts problem.
6. Test one adjustment-heavy Final Accounts problem.
7. Review Known Unsupported Areas before marking anything as a product defect.
8. Send copied reports for repeated wrong/confusing results.

## Journal Entry Testing Samples

| # | Transaction | Correct journal entry | Module |
| --- | --- | --- | --- |
| 1 | Started business with cash Rs.50000 | Cash A/c Dr. Rs.50000<br>To Capital A/c Rs.50000 | Both |
| 2 | Bought goods for cash Rs.10000 | Purchases A/c Dr. Rs.10000<br>To Cash A/c Rs.10000 | Both |
| 3 | Sold goods for cash Rs.12000 | Cash A/c Dr. Rs.12000<br>To Sales A/c Rs.12000 | Both |
| 4 | Paid rent by UPI Rs.2000 | Rent A/c Dr. Rs.2000<br>To Bank A/c Rs.2000 | Both |
| 5 | Received commission Rs.2500 in cash | Cash A/c Dr. Rs.2500<br>To Commission Income A/c Rs.2500 | Both |
| 6 | Withdrew cash for personal use Rs.3000 | Drawings A/c Dr. Rs.3000<br>To Cash A/c Rs.3000 | Both |
| 7 | Received Rs.5000 from debtor Raju in cash | Cash A/c Dr. Rs.5000<br>To Raju A/c Rs.5000 | Both |
| 8 | Paid Rs.4000 to creditor Amit through bank | Amit A/c Dr. Rs.4000<br>To Bank A/c Rs.4000 | Both |
| 9 | Received Rs.4900 from Raju in full settlement of Rs.5000 | Cash A/c Dr. Rs.4900<br>Discount Allowed A/c Dr. Rs.100<br>To Raju A/c Rs.5000 | Both |
| 10 | Paid Amit Rs.4900 in full settlement of Rs.5000 | Amit A/c Dr. Rs.5000<br>To Cash A/c Rs.4900<br>To Discount Received A/c Rs.100 | Both |
| 11 | Depreciation charged on machinery Rs.5000 | Depreciation A/c Dr. Rs.5000<br>To Machinery A/c Rs.5000 | Both |
| 12 | Bad debts written off Rs.2000 | Bad Debts A/c Dr. Rs.2000<br>To Debtor A/c Rs.2000 | Both |
| 13 | Bad debts recovered Rs.1000 in cash | Cash A/c Dr. Rs.1000<br>To Bad Debts Recovered A/c Rs.1000 | Both |
| 14 | Salary outstanding Rs.3000 | Salary A/c Dr. Rs.3000<br>To Outstanding Salary A/c Rs.3000 | Both |
| 15 | Prepaid insurance Rs.2000 | Prepaid Insurance A/c Dr. Rs.2000<br>To Insurance A/c Rs.2000 | Both |
| 16 | Interest accrued Rs.1500 | Accrued Interest A/c Dr. Rs.1500<br>To Interest Income A/c Rs.1500 | Both |
| 17 | Rent received in advance Rs.4000 | Rent Income A/c Dr. Rs.4000<br>To Rent Received in Advance A/c Rs.4000 | Both |
| 18 | Goods withdrawn by proprietor Rs.5000 | Drawings A/c Dr. Rs.5000<br>To Purchases A/c Rs.5000 | Both |
| 19 | Goods returned by Raju Rs.2000 | Sales Return A/c Dr. Rs.2000<br>To Raju A/c Rs.2000 | Both |
| 20 | Set off Input GST Rs.5000 against Output GST Rs.8000 and paid balance through bank | Output GST A/c Dr. Rs.5000<br>Output GST A/c Dr. Rs.3000<br>To Input GST A/c Rs.5000<br>To Bank A/c Rs.3000 | Both |

## Testing Record Table

| Tester | Role/Class | Module Tested | Cases Tried | Pass | Fail | Confusing | Unsupported Correctly | Unsupported Incorrectly | Reports Copied | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
