# Full Manual Test Checklist

Use this checklist for manual QA of the Journal Entry AI Checker app. For Checker cases, enter the transaction and the listed journal entry, then confirm the app returns Correct with full score. For Explainer cases, enter the transaction and confirm the solved entry, explanation, narration, and common mistakes match the expected behavior.

## Module Smoke Checks

- Checker module: Confirm correct entries return Correct, wrong entries return not Correct, unsupported entries return Unsupported Transaction, and multi-line entries remain balanced.
- Practice module: Generate multiple questions and confirm they stay beginner-level, show supported wording, and can be checked with the corresponding journal entry.
- AI Journal Entry Explainer: Confirm solved responses include journal entry lines, affected accounts, explanation, narration, common mistakes, and a similar practice question.
- Supported Transactions page: Open `/supported-transactions`, confirm supported and unsupported lists are visible on desktop and mobile, and confirm examples include GST returns and GST set-off/payment.

## 100 Manual Test Cases

### Capital

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 1 | Started business with Rs.50000 cash | Cash A/c Dr. Rs.50000<br>To Capital A/c Rs.50000 | Checker: Correct, 100. Explainer: solved. | Both | Basic capital introduced in cash. |
| 2 | Started business with Rs.80000 in bank | Bank A/c Dr. Rs.80000<br>To Capital A/c Rs.80000 | Checker: Correct, 100. Explainer: solved. | Both | Capital introduced through bank. |
| 3 | Owner introduced capital Rs.60000 in cash | Cash A/c Dr. Rs.60000<br>To Capital A/c Rs.60000 | Checker: Correct, 100. | Checker | Natural beginner wording. |

### Purchases

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 4 | Bought goods for cash Rs.5000 | Purchases A/c Dr. Rs.5000<br>To Cash A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Simple cash purchase. |
| 5 | Purchased goods through bank Rs.7000 | Purchases A/c Dr. Rs.7000<br>To Bank A/c Rs.7000 | Checker: Correct, 100. | Checker | Bank purchase. |
| 6 | Purchased goods from Amit Rs.3000 | Purchases A/c Dr. Rs.3000<br>To Amit A/c Rs.3000 | Checker: Correct, 100. Explainer: solved. | Both | Named supplier preserved. |
| 7 | Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit | Purchases A/c Dr. Rs.10000<br>To Cash A/c Rs.4000<br>To Creditor A/c Rs.6000 | Checker: Correct, 100. Explainer: solved. | Both | Partial cash plus credit purchase. |
| 8 | Purchased goods from Amit Rs.10000, paid Rs.4000 through bank and balance on credit | Purchases A/c Dr. Rs.10000<br>To Bank A/c Rs.4000<br>To Amit A/c Rs.6000 | Checker: Correct, 100. | Checker | Partial bank plus named supplier. |

### Sales

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 9 | Sold goods for cash Rs.5000 | Cash A/c Dr. Rs.5000<br>To Sales A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Simple cash sale. |
| 10 | Sold goods through bank Rs.7000 | Bank A/c Dr. Rs.7000<br>To Sales A/c Rs.7000 | Checker: Correct, 100. | Checker | Bank/digital sale. |
| 11 | Sold goods to Raju Rs.5000 | Raju A/c Dr. Rs.5000<br>To Sales A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Named customer preserved. |
| 12 | Sold goods Rs.10000, received Rs.4000 cash and balance on credit | Cash A/c Dr. Rs.4000<br>Debtor A/c Dr. Rs.6000<br>To Sales A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | Partial cash received plus credit sale. |
| 13 | Sold goods to Raju Rs.10000, received Rs.4000 through bank and balance on credit | Bank A/c Dr. Rs.4000<br>Raju A/c Dr. Rs.6000<br>To Sales A/c Rs.10000 | Checker: Correct, 100. | Checker | Partial bank received plus named customer. |

### Debtor/Creditor

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 14 | Received Rs.10000 from debtor in cash | Cash A/c Dr. Rs.10000<br>To Debtor A/c Rs.10000 | Checker: Correct, 100. | Checker | Generic debtor receipt. |
| 15 | Received Rs.10000 from debtor through bank | Bank A/c Dr. Rs.10000<br>To Debtor A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | Bank debtor receipt. |
| 16 | Received cash Rs.10000 from Raju | Cash A/c Dr. Rs.10000<br>To Raju A/c Rs.10000 | Checker: Correct, 100. | Checker | Named debtor receipt. |
| 17 | Paid Rs.7000 to creditor in cash | Creditor A/c Dr. Rs.7000<br>To Cash A/c Rs.7000 | Checker: Correct, 100. | Checker | Generic creditor payment. |
| 18 | Paid Rs.7000 to Amit through UPI | Amit A/c Dr. Rs.7000<br>To Bank A/c Rs.7000 | Checker: Correct, 100. Explainer: solved. | Both | UPI treated as Bank. |

### Bank/Cash

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 19 | Cash deposited into bank Rs.10000 | Bank A/c Dr. Rs.10000<br>To Cash A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | Contra cash-bank movement. |
| 20 | Cash withdrawn from bank Rs.5000 | Cash A/c Dr. Rs.5000<br>To Bank A/c Rs.5000 | Checker: Correct, 100. | Checker | Bank withdrawal. |
| 21 | Took loan Rs.50000 through bank | Bank A/c Dr. Rs.50000<br>To Loan A/c Rs.50000 | Checker: Correct, 100. Explainer: solved. | Both | Loan received through bank. |
| 22 | Repaid loan Rs.10000 through bank | Loan A/c Dr. Rs.10000<br>To Bank A/c Rs.10000 | Checker: Correct, 100. | Checker | Loan repayment. |

### Drawings

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 23 | Owner withdrew Rs.5000 cash for personal use | Drawings A/c Dr. Rs.5000<br>To Cash A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Cash drawings. |
| 24 | Owner withdrew Rs.3000 from bank for personal use | Drawings A/c Dr. Rs.3000<br>To Bank A/c Rs.3000 | Checker: Correct, 100. | Checker | Bank drawings. |
| 25 | Goods worth Rs.2000 withdrawn by proprietor for personal use | Drawings A/c Dr. Rs.2000<br>To Purchases A/c Rs.2000 | Checker: Correct, 100. Explainer: solved. | Both | Goods withdrawn as drawings. |

### Expenses

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 26 | Paid rent by UPI Rs.2000 | Rent Expense A/c Dr. Rs.2000<br>To Bank A/c Rs.2000 | Checker: Correct, 100. Explainer: solved. | Both | Digital payment as Bank. |
| 27 | Paid salary Rs.5000 in cash | Salary Expense A/c Dr. Rs.5000<br>To Cash A/c Rs.5000 | Checker: Correct, 100. | Checker | Salary paid. |
| 28 | Paid wages Rs.5000 in cash | Wages Expense A/c Dr. Rs.5000<br>To Cash A/c Rs.5000 | Checker: Correct, 100. | Checker | Common expense. |
| 29 | Paid telephone bill Rs.1000 in cash | Telephone Expense A/c Dr. Rs.1000<br>To Cash A/c Rs.1000 | Checker: Correct, 100. | Checker | Telephone expense. |
| 30 | Paid legal charges Rs.5000 through bank | Legal Charges A/c Dr. Rs.5000<br>To Bank A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Bank expense. |

### Incomes

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 31 | Received rent Rs.5000 in cash | Cash A/c Dr. Rs.5000<br>To Rent Income A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Rent income. |
| 32 | Received commission Rs.3000 through bank | Bank A/c Dr. Rs.3000<br>To Commission Income A/c Rs.3000 | Checker: Correct, 100. | Checker | Commission received. |
| 33 | Received interest Rs.1500 through bank | Bank A/c Dr. Rs.1500<br>To Interest Income A/c Rs.1500 | Checker: Correct, 100. | Checker | Interest income. |
| 34 | Received consultancy fees Rs.10000 by UPI | Bank A/c Dr. Rs.10000<br>To Consultancy Income A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | UPI income as Bank. |
| 35 | Received royalty Rs.4000 through bank | Bank A/c Dr. Rs.4000<br>To Royalty Income A/c Rs.4000 | Checker: Correct, 100. | Checker | Royalty income. |

### Assets

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 36 | Bought laptop for cash Rs.30000 | Computer A/c Dr. Rs.30000<br>To Cash A/c Rs.30000 | Checker: Correct, 100. Explainer: solved. | Both | Laptop treated as fixed asset. |
| 37 | Purchased printer through bank Rs.8000 | Equipment A/c Dr. Rs.8000<br>To Bank A/c Rs.8000 | Checker: Correct, 100. | Checker | Printer as Equipment. |
| 38 | Bought camera from Amit on credit Rs.20000 | Equipment A/c Dr. Rs.20000<br>To Amit A/c Rs.20000 | Checker: Correct, 100. Explainer: solved. | Both | Named supplier fixed asset. |
| 39 | Paid installation charges on machinery Rs.5000 in cash | Machinery A/c Dr. Rs.5000<br>To Cash A/c Rs.5000 | Checker: Correct, 100. | Checker | Standalone installation capitalized. |
| 40 | Purchased machinery Rs.50000 and paid installation charges Rs.5000 in cash | Machinery A/c Dr. Rs.55000<br>To Cash A/c Rs.55000 | Checker: Correct, 100. Explainer: solved. | Both | Asset purchase plus installation. |

### Depreciation

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 41 | Depreciation charged on machinery Rs.5000 | Depreciation A/c Dr. Rs.5000<br>To Machinery A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Machinery depreciation. |
| 42 | Depreciation provided on furniture Rs.2000 | Depreciation A/c Dr. Rs.2000<br>To Furniture A/c Rs.2000 | Checker: Correct, 100. | Checker | Furniture depreciation. |
| 43 | Depreciation on computer Rs.3000 | Depreciation A/c Dr. Rs.3000<br>To Computer A/c Rs.3000 | Checker: Correct, 100. | Checker | Computer depreciation. |

### Bad Debts

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 44 | Bad debts written off Rs.2000 | Bad Debts A/c Dr. Rs.2000<br>To Debtor A/c Rs.2000 | Checker: Correct, 100. Explainer: solved. | Both | Generic bad debt. |
| 45 | Raju became insolvent and Rs.1000 became bad debt | Bad Debts A/c Dr. Rs.1000<br>To Raju A/c Rs.1000 | Checker: Correct, 100. | Checker | Named debtor bad debt. |
| 46 | Bad debts recovered Rs.500 in cash | Cash A/c Dr. Rs.500<br>To Bad Debts Recovered A/c Rs.500 | Checker: Correct, 100. Explainer: solved. | Both | Recovery in cash. |
| 47 | Bad debts recovered from Raju Rs.500 through bank | Bank A/c Dr. Rs.500<br>To Bad Debts Recovered A/c Rs.500 | Checker: Correct, 100. | Checker | Named recovery through bank. |

### Outstanding/Prepaid/Accrued/Advance Adjustments

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 48 | Salary outstanding Rs.6000 | Salary Expense A/c Dr. Rs.6000<br>To Outstanding Salary A/c Rs.6000 | Checker: Correct, 100. Explainer: solved. | Both | Outstanding expense. |
| 49 | Rent outstanding Rs.5000 | Rent Expense A/c Dr. Rs.5000<br>To Outstanding Rent A/c Rs.5000 | Checker: Correct, 100. | Checker | Outstanding rent. |
| 50 | Prepaid rent Rs.5000 | Prepaid Rent A/c Dr. Rs.5000<br>To Rent Expense A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Prepaid expense. |
| 51 | Insurance paid in advance Rs.3000 | Prepaid Insurance A/c Dr. Rs.3000<br>To Insurance Expense A/c Rs.3000 | Checker: Correct, 100. | Checker | Prepaid insurance. |
| 52 | Interest accrued Rs.1500 | Accrued Interest A/c Dr. Rs.1500<br>To Interest Income A/c Rs.1500 | Checker: Correct, 100. Explainer: solved. | Both | Accrued income. |
| 53 | Commission earned but not received Rs.3000 | Accrued Commission A/c Dr. Rs.3000<br>To Commission Income A/c Rs.3000 | Checker: Correct, 100. | Checker | Accrued commission. |
| 54 | Rent received in advance Rs.4000 | Rent Income A/c Dr. Rs.4000<br>To Rent Received in Advance A/c Rs.4000 | Checker: Correct, 100. Explainer: solved. | Both | Income received in advance. |
| 55 | Interest received in advance Rs.1500 | Interest Income A/c Dr. Rs.1500<br>To Interest Received in Advance A/c Rs.1500 | Checker: Correct, 100. | Checker | Advance income liability. |

### Discount Allowed/Received

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 56 | Received Rs.9500 from Mohan in full settlement of Rs.10000 | Cash A/c Dr. Rs.9500<br>Discount Allowed A/c Dr. Rs.500<br>To Mohan A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | Discount allowed in settlement. |
| 57 | Received Rs.9500 from Mohan through bank in full settlement of Rs.10000 | Bank A/c Dr. Rs.9500<br>Discount Allowed A/c Dr. Rs.500<br>To Mohan A/c Rs.10000 | Checker: Correct, 100. | Checker | Bank receipt settlement. |
| 58 | Paid Rs.4500 to Ram in full settlement of Rs.5000 | Ram A/c Dr. Rs.5000<br>To Cash A/c Rs.4500<br>To Discount Received A/c Rs.500 | Checker: Correct, 100. Explainer: solved. | Both | Discount received in settlement. |
| 59 | Paid Rs.4500 to Ram through bank in full settlement of Rs.5000 | Ram A/c Dr. Rs.5000<br>To Bank A/c Rs.4500<br>To Discount Received A/c Rs.500 | Checker: Correct, 100. | Checker | Bank payment settlement. |

### Goods Withdrawn/Free Sample/Charity/Lost

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 60 | Owner took goods Rs.1500 for personal use | Drawings A/c Dr. Rs.1500<br>To Purchases A/c Rs.1500 | Checker: Correct, 100. | Checker | Goods drawings. |
| 61 | Goods worth Rs.1000 distributed as free sample | Advertisement Expense A/c Dr. Rs.1000<br>To Purchases A/c Rs.1000 | Checker: Correct, 100. Explainer: solved. | Both | Free sample as advertisement. |
| 62 | Goods used for advertisement Rs.1500 | Advertisement Expense A/c Dr. Rs.1500<br>To Purchases A/c Rs.1500 | Checker: Correct, 100. | Checker | Promotion wording. |
| 63 | Goods worth Rs.1000 given as charity | Charity Expense A/c Dr. Rs.1000<br>To Purchases A/c Rs.1000 | Checker: Correct, 100. Explainer: solved. | Both | Charity goods. |
| 64 | Goods worth Rs.3000 lost by fire | Loss by Fire A/c Dr. Rs.3000<br>To Purchases A/c Rs.3000 | Checker: Correct, 100. | Checker | Goods loss by fire. |
| 65 | Goods worth Rs.2000 stolen | Loss by Theft A/c Dr. Rs.2000<br>To Purchases A/c Rs.2000 | Checker: Correct, 100. | Checker | Theft loss. |

### Sales Return/Purchase Return

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 66 | Goods returned by Raju Rs.1000 | Sales Return A/c Dr. Rs.1000<br>To Raju A/c Rs.1000 | Checker: Correct, 100. Explainer: solved. | Both | Named customer return. |
| 67 | Goods returned by customer Rs.1000 | Sales Return A/c Dr. Rs.1000<br>To Debtor A/c Rs.1000 | Checker: Correct, 100. | Checker | Generic sales return. |
| 68 | Goods returned to Amit Rs.1000 | Amit A/c Dr. Rs.1000<br>To Purchase Return A/c Rs.1000 | Checker: Correct, 100. Explainer: solved. | Both | Named supplier return. |
| 69 | Goods returned to supplier Rs.1000 | Creditor A/c Dr. Rs.1000<br>To Purchase Return A/c Rs.1000 | Checker: Correct, 100. | Checker | Generic purchase return. |

### GST Goods Purchase/Sale

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 70 | Purchased goods Rs.10000 plus GST 18% for cash | Purchases A/c Dr. Rs.10000<br>Input GST A/c Dr. Rs.1800<br>To Cash A/c Rs.11800 | Checker: Correct, 100. Explainer: solved. | Both | Basic GST purchase. |
| 71 | Purchased goods from Amit Rs.10000 plus GST 18% on credit | Purchases A/c Dr. Rs.10000<br>Input GST A/c Dr. Rs.1800<br>To Amit A/c Rs.11800 | Checker: Correct, 100. | Checker | Named supplier GST purchase. |
| 72 | Sold goods Rs.10000 plus GST 18% for cash | Cash A/c Dr. Rs.11800<br>To Sales A/c Rs.10000<br>To Output GST A/c Rs.1800 | Checker: Correct, 100. Explainer: solved. | Both | Basic GST sale. |
| 73 | Sold goods to Raju Rs.10000 plus GST 18% on credit | Raju A/c Dr. Rs.11800<br>To Sales A/c Rs.10000<br>To Output GST A/c Rs.1800 | Checker: Correct, 100. | Checker | Named customer GST sale. |
| 74 | Purchased goods Rs.10000 less trade discount Rs.1000 plus GST 18% for cash | Purchases A/c Dr. Rs.9000<br>Input GST A/c Dr. Rs.1620<br>To Cash A/c Rs.10620 | Checker: Correct, 100. Explainer: solved. | Both | GST on taxable value after trade discount. |

### GST Inclusive

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 75 | Purchased goods Rs.11800 including GST 18% for cash | Purchases A/c Dr. Rs.10000<br>Input GST A/c Dr. Rs.1800<br>To Cash A/c Rs.11800 | Checker: Correct, 100. Explainer: solved. | Both | Inclusive GST purchase with rate. |
| 76 | Sold goods Rs.11800 including GST 18% for cash | Cash A/c Dr. Rs.11800<br>To Sales A/c Rs.10000<br>To Output GST A/c Rs.1800 | Checker: Correct, 100. Explainer: solved. | Both | Inclusive GST sale with rate. |
| 77 | Purchased machinery Rs.59000 including GST 18% for cash | Machinery A/c Dr. Rs.50000<br>Input GST A/c Dr. Rs.9000<br>To Cash A/c Rs.59000 | Checker: Correct, 100. | Checker | Inclusive GST fixed asset. |
| 78 | Paid legal charges Rs.11800 including GST 18% through bank | Legal Charges A/c Dr. Rs.10000<br>Input GST A/c Dr. Rs.1800<br>To Bank A/c Rs.11800 | Checker: Correct, 100. | Checker | Inclusive GST expense. |

### CGST/SGST/IGST

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 79 | Purchased goods Rs.10000 plus CGST 9% and SGST 9% for cash | Purchases A/c Dr. Rs.10000<br>Input CGST A/c Dr. Rs.900<br>Input SGST A/c Dr. Rs.900<br>To Cash A/c Rs.11800 | Checker: Correct, 100. Explainer: solved. | Both | Split input GST purchase. |
| 80 | Sold goods Rs.10000 plus CGST 9% and SGST 9% for cash | Cash A/c Dr. Rs.11800<br>To Sales A/c Rs.10000<br>To Output CGST A/c Rs.900<br>To Output SGST A/c Rs.900 | Checker: Correct, 100. | Checker | Split output GST sale. |
| 81 | Purchased goods Rs.10000 plus IGST 18% for cash | Purchases A/c Dr. Rs.10000<br>Input IGST A/c Dr. Rs.1800<br>To Cash A/c Rs.11800 | Checker: Correct, 100. | Checker | IGST purchase. |
| 82 | Sold goods Rs.10000 plus IGST 18% for cash | Cash A/c Dr. Rs.11800<br>To Sales A/c Rs.10000<br>To Output IGST A/c Rs.1800 | Checker: Correct, 100. Explainer: solved. | Both | IGST sale. |
| 83 | Purchased goods Rs.11800 including CGST 9% and SGST 9% for cash | Purchases A/c Dr. Rs.10000<br>Input CGST A/c Dr. Rs.900<br>Input SGST A/c Dr. Rs.900<br>To Cash A/c Rs.11800 | Checker: Correct, 100. | Checker | Inclusive split GST purchase. |

### GST on Expenses

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 84 | Paid legal charges Rs.10000 plus GST 18% through bank | Legal Charges A/c Dr. Rs.10000<br>Input GST A/c Dr. Rs.1800<br>To Bank A/c Rs.11800 | Checker: Correct, 100. Explainer: solved. | Both | GST expense through bank. |
| 85 | Paid repairs Rs.5000 plus GST 18% in cash | Repairs Expense A/c Dr. Rs.5000<br>Input GST A/c Dr. Rs.900<br>To Cash A/c Rs.5900 | Checker: Correct, 100. | Checker | GST expense in cash. |
| 86 | Paid advertisement Rs.3000 plus CGST 9% and SGST 9% by UPI | Advertisement Expense A/c Dr. Rs.3000<br>Input CGST A/c Dr. Rs.270<br>Input SGST A/c Dr. Rs.270<br>To Bank A/c Rs.3540 | Checker: Correct, 100. | Checker | Split GST expense, UPI as Bank. |

### GST on Incomes

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 87 | Received consultancy fees Rs.10000 plus GST 18% through bank | Bank A/c Dr. Rs.11800<br>To Consultancy Income A/c Rs.10000<br>To Output GST A/c Rs.1800 | Checker: Correct, 100. Explainer: solved. | Both | GST service income. |
| 88 | Received service income Rs.10000 plus GST 18% in cash | Cash A/c Dr. Rs.11800<br>To Service Income A/c Rs.10000<br>To Output GST A/c Rs.1800 | Checker: Correct, 100. | Checker | Cash GST income. |
| 89 | Received tuition fees Rs.5000 plus CGST 9% and SGST 9% by UPI | Bank A/c Dr. Rs.5900<br>To Tuition Income A/c Rs.5000<br>To Output CGST A/c Rs.450<br>To Output SGST A/c Rs.450 | Checker: Correct, 100. | Checker | Split GST income. |

### GST Returns

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 90 | Goods returned by Raju Rs.1000 plus GST 18% | Sales Return A/c Dr. Rs.1000<br>Output GST A/c Dr. Rs.180<br>To Raju A/c Rs.1180 | Checker: Correct, 100. Explainer: solved. | Both | Sales return reduces output GST liability. |
| 91 | Goods returned by customer Rs.1000 plus GST 18% | Sales Return A/c Dr. Rs.1000<br>Output GST A/c Dr. Rs.180<br>To Debtor A/c Rs.1180 | Checker: Correct, 100. | Checker | Generic GST sales return. |
| 92 | Goods returned to Amit Rs.1000 plus GST 18% | Amit A/c Dr. Rs.1180<br>To Purchase Return A/c Rs.1000<br>To Input GST A/c Rs.180 | Checker: Correct, 100. Explainer: solved. | Both | Purchase return reduces input tax credit. |
| 93 | Goods returned by customer Rs.1000 plus CGST 9% and SGST 9% | Sales Return A/c Dr. Rs.1000<br>Output CGST A/c Dr. Rs.90<br>Output SGST A/c Dr. Rs.90<br>To Debtor A/c Rs.1180 | Checker: Correct, 100. | Checker | Split GST sales return. |

### GST Set-Off/Payment

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 94 | Set off Input GST Rs.5000 against Output GST Rs.8000 | Output GST A/c Dr. Rs.5000<br>To Input GST A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Explainer should mention remaining GST payable Rs.3000. |
| 95 | Paid GST liability Rs.3000 through bank | Output GST A/c Dr. Rs.3000<br>To Bank A/c Rs.3000 | Checker: Correct, 100. Explainer: solved. | Both | GST payment through bank. |
| 96 | Set off Input GST Rs.5000 against Output GST Rs.8000 and paid balance through bank | Output GST A/c Dr. Rs.5000<br>To Input GST A/c Rs.5000<br>Output GST A/c Dr. Rs.3000<br>To Bank A/c Rs.3000 | Checker: Correct, 100. Explainer: solved. | Both | Compound set-off plus remaining payment. |
| 97 | Set off Input CGST Rs.2500 and Input SGST Rs.2500 against Output CGST Rs.4000 and Output SGST Rs.4000 | Output CGST A/c Dr. Rs.2500<br>Output SGST A/c Dr. Rs.2500<br>To Input CGST A/c Rs.2500<br>To Input SGST A/c Rs.2500 | Checker: Correct, 100. Explainer: solved. | Both | Remaining CGST Rs.1500 and SGST Rs.1500. |

### Asset Sale

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 98 | Sold machinery Rs.40000 for cash | Cash A/c Dr. Rs.40000<br>To Machinery A/c Rs.40000 | Checker: Correct, 100. Explainer: solved. | Both | Simple asset sale without profit/loss. |
| 99 | Sold machinery costing Rs.50000 for Rs.60000 cash | Cash A/c Dr. Rs.60000<br>To Machinery A/c Rs.50000<br>To Profit on Sale of Asset A/c Rs.10000 | Checker: Correct, 100. Explainer: solved. | Both | Asset sale with profit. |

### Asset Sale With Accumulated Depreciation

| # | Transaction | Correct journal entry | Expected app result | Module to test | Notes |
|---|---|---|---|---|---|
| 100 | Sold machinery costing Rs.50000 with accumulated depreciation Rs.10000 for Rs.35000 cash | Asset Disposal A/c Dr. Rs.50000<br>To Machinery A/c Rs.50000<br>Accumulated Depreciation A/c Dr. Rs.10000<br>To Asset Disposal A/c Rs.10000<br>Cash A/c Dr. Rs.35000<br>To Asset Disposal A/c Rs.35000<br>Loss on Sale of Asset A/c Dr. Rs.5000<br>To Asset Disposal A/c Rs.5000 | Checker: Correct, 100. Explainer: solved. | Both | Disposal method; book value Rs.40000, loss Rs.5000. |

## Known Unsupported Cases

- GST refund from government, including input tax exceeding output tax with refund due.
- Cross-utilisation beyond direct matching, such as IGST set off against CGST and SGST.
- GST interest, penalty, fine, or late fee entries.
- GST payment by cash.
- GST set-off without clear input/output amounts.
- GSTR filing or GST return filing entries.
- Complex GST ledger adjustment, set-off, or payment workflows beyond the supported beginner patterns.
- GST-inclusive amount without GST rate.
- GST with full-settlement discount allowed or received.
- GST with sales return or purchase return plus refund, discount, or settlement.
- GST on asset sales.
- GST on unsupported expense or income categories.
- Asset purchase plus installation charges plus GST.
- Asset purchases with partial payment and balance credit beyond supported simple cases.
- Asset sale with partial payment and balance credit.
- Asset sale without cost/book value where profit/loss is required.
- Multiple asset disposal or revaluation reserve treatment.
- Insurance claim on goods lost or asset sale.
- Provision for doubtful debts and complex bad debt recovery with provision adjustment.
- Ledger posting, trial balance, final accounts, partnership accounts, and company accounts.
