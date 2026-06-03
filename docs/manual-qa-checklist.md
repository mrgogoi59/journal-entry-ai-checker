# Journal Entry AI Checker Manual QA Checklist

Use this checklist to manually test the checker and Practice Mode outputs. Each case should be entered through the app UI and checked against the expected result.

## Manual Test Cases

| Test number | Transaction | Student entry | Expected result | Expected mistake type | Notes |
|---|---|---|---|---|---|
| QA-001 | Started business with ₹50,000 cash | Cash A/c Dr. ₹50,000<br>To Capital A/c ₹50,000 | Correct | correct | Correct capital introduced with cash using `To`. |
| QA-002 | Started business with ₹80,000 in bank | Dr Bank 80000<br>Cr Capital 80000 | Correct | correct | Correct capital introduced into bank. |
| QA-003 | Bought goods for cash ₹12,000 | Purchases Dr 12000<br>Cash Cr 12000 | Correct | correct | Correct cash purchases entry. |
| QA-004 | Bought goods on credit ₹18,000 | Purchases Dr 18000<br>Creditor Cr 18000 | Correct | correct | Correct credit purchases entry. |
| QA-005 | Sold goods for cash ₹25,000 | Cash Debit 25000<br>Sales Credit 25000 | Correct | correct | Correct cash sales entry. |
| QA-006 | Sold goods on credit ₹35,000 | Debtor Dr 35000<br>Sales Cr 35000 | Correct | correct | Correct credit sales entry. |
| QA-007 | Paid rent ₹5,000 | Rent Dr 5000<br>Cash Cr 5000 | Correct | correct | Rent should normalize to Rent Expense. |
| QA-008 | Paid salary ₹6,000 | Salary Dr 6000<br>Cash Cr 6000 | Correct | correct | Salary should normalize to Salary Expense. |
| QA-009 | Received commission ₹7,000 | Cash Dr 7000<br>Commission Cr 7000 | Correct | correct | Commission should normalize to Commission Income. |
| QA-010 | Bought furniture for cash ₹12,500 | Furniture Dr 12500<br>Cash Cr 12500 | Correct | correct | Furniture is debited as an asset. |
| QA-011 | Bought machinery by cheque ₹45,000 | Machinery Dr 45000<br>Bank Cr 45000 | Correct | correct | Cheque payment should credit Bank. |
| QA-012 | Deposited cash into bank ₹10,000 | Bank Dr 10000<br>Cash Cr 10000 | Correct | correct | Bank increases, cash decreases. |
| QA-013 | Withdraw cash from bank ₹8,000 | Cash Dr 8000<br>Bank Cr 8000 | Correct | correct | Cash increases, bank decreases. |
| QA-014 | Owner withdrew cash for personal use ₹3,000 | Drawings Dr 3000<br>Cash Cr 3000 | Correct | correct | Drawings should be debited. |
| QA-015 | Paid creditor ₹11,000 | Creditor Dr 11000<br>Cash Cr 11000 | Correct | correct | Liability to creditor reduces. |
| QA-016 | Received from debtor ₹13,000 | Cash Dr 13000<br>Debtor Cr 13000 | Correct | correct | Debtor balance reduces. |
| QA-017 | Took loan from bank ₹1,00,000 | Bank Dr 100000<br>Loan Cr 100000 | Correct | correct | Loan is credited as liability. |
| QA-018 | Paid interest ₹2,000 | Interest Dr 2000<br>Cash Cr 2000 | Correct | correct | Debit Interest Expense. |
| QA-019 | Received interest ₹1,500 | Cash Dr 1500<br>Interest Cr 1500 | Correct | correct | Credit Interest Income. |
| QA-020 | Paid electricity bill ₹4,500 | Electricity Bill Dr 4500<br>Cash Cr 4500 | Correct | correct | Electricity Bill should normalize to Electricity Expense. |
| QA-021 | Started business with ₹50,000 cash | Capital Dr 50000<br>Cash Cr 50000 | Partly Correct | reversed_sides | Correct accounts but sides are reversed. |
| QA-022 | Started business with ₹80,000 in bank | Capital Dr 80000<br>Bank Cr 80000 | Partly Correct | reversed_sides | Capital and Bank are on opposite sides. |
| QA-023 | Bought goods for cash ₹12,000 | Cash Dr 12000<br>Purchases Cr 12000 | Partly Correct | reversed_sides | Purchases and Cash are reversed. |
| QA-024 | Bought goods on credit ₹18,000 | Creditor Dr 18000<br>Purchases Cr 18000 | Partly Correct | reversed_sides | Creditor and Purchases are reversed. |
| QA-025 | Sold goods for cash ₹25,000 | Sales Dr 25000<br>Cash Cr 25000 | Partly Correct | reversed_sides | Sales and Cash are reversed. |
| QA-026 | Sold goods on credit ₹35,000 | Sales Dr 35000<br>Debtor Cr 35000 | Partly Correct | reversed_sides | Sales and Debtor are reversed. |
| QA-027 | Paid rent ₹5,000 | Cash Dr 5000<br>Rent Cr 5000 | Partly Correct | reversed_sides | Rent Expense and Cash are reversed. |
| QA-028 | Paid salary ₹6,000 | Cash Dr 6000<br>Salary Cr 6000 | Partly Correct | reversed_sides | Salary Expense and Cash are reversed. |
| QA-029 | Bought furniture for cash ₹12,500 | Cash Dr 12500<br>Furniture Cr 12500 | Partly Correct | reversed_sides | Furniture and Cash are reversed. |
| QA-030 | Deposited cash into bank ₹10,000 | Cash Dr 10000<br>Bank Cr 10000 | Partly Correct | reversed_sides | This is the withdrawal entry, not deposit. |
| QA-031 | Started business with ₹50,000 cash | Cash Dr 50000<br>Sales Cr 50000 | Incorrect | wrong_account | Capital is missing; Sales is wrong. |
| QA-032 | Started business with ₹80,000 in bank | Cash Dr 80000<br>Capital Cr 80000 | Incorrect | wrong_account | Bank should be debited, not Cash. |
| QA-033 | Bought goods for cash ₹12,000 | Furniture Dr 12000<br>Cash Cr 12000 | Incorrect | wrong_account | Purchases should be debited, not Furniture. |
| QA-034 | Bought goods on credit ₹18,000 | Purchases Dr 18000<br>Cash Cr 18000 | Incorrect | wrong_account | Creditor should be credited for credit purchase. |
| QA-035 | Sold goods for cash ₹25,000 | Bank Dr 25000<br>Sales Cr 25000 | Incorrect | wrong_account | Cash should be debited for cash sale. |
| QA-036 | Sold goods on credit ₹35,000 | Cash Dr 35000<br>Sales Cr 35000 | Incorrect | wrong_account | Debtor should be debited for credit sale. |
| QA-037 | Paid rent ₹5,000 | Salary Dr 5000<br>Cash Cr 5000 | Incorrect | wrong_account | Rent Expense should be debited. |
| QA-038 | Received commission ₹7,000 | Cash Dr 7000<br>Sales Cr 7000 | Incorrect | wrong_account | Commission Income should be credited. |
| QA-039 | Paid creditor ₹11,000 | Debtor Dr 11000<br>Cash Cr 11000 | Incorrect | wrong_account | Creditor should be debited, not Debtor. |
| QA-040 | Took loan from bank ₹1,00,000 | Bank Dr 100000<br>Capital Cr 100000 | Incorrect | wrong_account | Loan should be credited, not Capital. |
| QA-041 | Started business with ₹50,000 cash | Cash Dr 40000<br>Capital Cr 40000 | Partly Correct | amount_mismatch | Correct accounts and sides, wrong amount. |
| QA-042 | Started business with ₹80,000 in bank | Bank Dr 50000<br>Capital Cr 50000 | Partly Correct | amount_mismatch | Expected ₹80,000. |
| QA-043 | Bought goods for cash ₹12,000 | Purchases Dr 10000<br>Cash Cr 10000 | Partly Correct | amount_mismatch | Expected ₹12,000. |
| QA-044 | Bought goods on credit ₹18,000 | Purchases Dr 20000<br>Creditor Cr 20000 | Partly Correct | amount_mismatch | Expected ₹18,000. |
| QA-045 | Sold goods for cash ₹25,000 | Cash Dr 30000<br>Sales Cr 30000 | Partly Correct | amount_mismatch | Expected ₹25,000. |
| QA-046 | Sold goods on credit ₹35,000 | Debtor Dr 30000<br>Sales Cr 30000 | Partly Correct | amount_mismatch | Expected ₹35,000. |
| QA-047 | Paid rent ₹5,000 | Rent Dr 4000<br>Cash Cr 4000 | Partly Correct | amount_mismatch | Expected ₹5,000. |
| QA-048 | Paid salary ₹6,000 | Salary Dr 7000<br>Cash Cr 7000 | Partly Correct | amount_mismatch | Expected ₹6,000. |
| QA-049 | Received interest ₹1,500 | Cash Dr 1000<br>Interest Cr 1000 | Partly Correct | amount_mismatch | Expected ₹1,500. |
| QA-050 | Paid electricity bill ₹4,500 | Electricity Bill Dr 5000<br>Cash Cr 5000 | Partly Correct | amount_mismatch | Expected ₹4,500. |
| QA-051 | Started business with ₹50,000 cash | Capital Cr 50000 | Incorrect | missing_account | Debit Cash line is missing. |
| QA-052 | Bought goods for cash ₹12,000 | Cash Cr 12000 | Incorrect | missing_account | Debit Purchases line is missing. |
| QA-053 | Bought goods on credit ₹18,000 | Creditor Cr 18000 | Incorrect | missing_account | Debit Purchases line is missing. |
| QA-054 | Sold goods for cash ₹25,000 | Sales Cr 25000 | Incorrect | missing_account | Debit Cash line is missing. |
| QA-055 | Paid rent ₹5,000 | Cash Cr 5000 | Incorrect | missing_account | Debit Rent Expense line is missing. |
| QA-056 | Bought machinery by cheque ₹45,000 | Bank Cr 45000 | Incorrect | missing_account | Debit Machinery line is missing. |
| QA-057 | Received from debtor ₹13,000 | Debtor Cr 13000 | Incorrect | missing_account | Debit Cash line is missing. |
| QA-058 | Took loan from bank ₹1,00,000 | Loan Cr 100000 | Incorrect | missing_account | Debit Bank line is missing. |
| QA-059 | Started business with ₹50,000 cash | Cash Dr 50000 | Incorrect | missing_account | Credit Capital line is missing. |
| QA-060 | Bought goods for cash ₹12,000 | Purchases Dr 12000 | Incorrect | missing_account | Credit Cash line is missing. |
| QA-061 | Bought goods on credit ₹18,000 | Purchases Dr 18000 | Incorrect | missing_account | Credit Creditor line is missing. |
| QA-062 | Sold goods for cash ₹25,000 | Cash Dr 25000 | Incorrect | missing_account | Credit Sales line is missing. |
| QA-063 | Paid salary ₹6,000 | Salary Dr 6000 | Incorrect | missing_account | Credit Cash line is missing. |
| QA-064 | Owner withdrew cash for personal use ₹3,000 | Drawings Dr 3000 | Incorrect | missing_account | Credit Cash line is missing. |
| QA-065 | Received interest ₹1,500 | Cash Dr 1500 | Incorrect | missing_account | Credit Interest Income line is missing. |
| QA-066 | Paid electricity bill ₹4,500 | Electricity Bill Dr 4500 | Incorrect | missing_account | Credit Cash line is missing. |
| QA-067 | Started business with ₹50,000 cash | Cash Dr 50000<br>Capital Cr 50000<br>Bank Cr 1000 | Partly Correct | unbalanced_entry | Correct main lines plus extra credit line. |
| QA-068 | Bought goods for cash ₹12,000 | Purchases Dr 12000<br>Cash Cr 12000<br>Capital Cr 1000 | Partly Correct | unbalanced_entry | Debit total and credit total differ. |
| QA-069 | Bought goods on credit ₹18,000 | Purchases Dr 18000<br>Creditor Cr 18000<br>Cash Cr 500 | Partly Correct | unbalanced_entry | Extra credit makes entry unbalanced. |
| QA-070 | Sold goods for cash ₹25,000 | Cash Dr 25000<br>Sales Cr 25000<br>Bank Dr 1000 | Partly Correct | unbalanced_entry | Extra debit makes entry unbalanced. |
| QA-071 | Sold goods on credit ₹35,000 | Debtor Dr 35000<br>Sales Cr 35000<br>Cash Dr 1000 | Partly Correct | unbalanced_entry | Extra debit makes entry unbalanced. |
| QA-072 | Paid rent ₹5,000 | Rent Dr 5000<br>Cash Cr 5000<br>Bank Cr 500 | Partly Correct | unbalanced_entry | Extra credit makes entry unbalanced. |
| QA-073 | Bought machinery by cheque ₹45,000 | Machinery Dr 45000<br>Bank Cr 45000<br>Cash Cr 1000 | Partly Correct | unbalanced_entry | Correct main entry plus extra credit. |
| QA-074 | Deposited cash into bank ₹10,000 | Bank Dr 10000<br>Cash Cr 10000<br>Capital Cr 1000 | Partly Correct | unbalanced_entry | Extra credit makes entry unbalanced. |
| QA-075 | Paid creditor ₹11,000 | Creditor Dr 11000<br>Cash Cr 11000<br>Bank Cr 500 | Partly Correct | unbalanced_entry | Extra credit makes entry unbalanced. |
| QA-076 | Started business with ₹50,000 cash | Cash 50000<br>Capital 50000 | Invalid Format | format_error | No Dr/Cr or To markers. |
| QA-077 | Bought goods for cash ₹12,000 | Purchases 12000<br>Cash 12000 | Invalid Format | format_error | No debit/credit side labels. |
| QA-078 | Sold goods for cash ₹25,000 | Cash Dr<br>Sales Cr | Invalid Format | format_error | Amounts are missing. |
| QA-079 | Paid rent ₹5,000 | Rent Debit five thousand<br>Cash Credit five thousand | Invalid Format | format_error | Amounts are not numeric. |
| QA-080 | Paid salary ₹6,000 | Salary paid by cash | Invalid Format | format_error | Looks like a sentence, not a journal entry. |
| QA-081 | Received commission ₹7,000 | Commission received 7000 | Invalid Format | format_error | Missing debit/credit labels. |
| QA-082 | Bought furniture for cash ₹12,500 | Furniture / Cash 12500 | Invalid Format | format_error | No clear side labels. |
| QA-083 | Paid creditor ₹11,000 | Debit 11000<br>Credit 11000 | Invalid Format | format_error | Account names are missing. |
| QA-084 | Received from debtor ₹13,000 | Cash<br>Debtor | Invalid Format | format_error | Amounts and side labels are incomplete. |
| QA-085 | Paid electricity bill ₹4,500 |  | Invalid Format | format_error | Empty journal entry. |
| QA-086 | Started business with ₹50,000 cash | Cash Dr 50000<br>Capitol Cr 50000 | Correct | correct | Fuzzy spelling: Capitol should normalize to Capital. |
| QA-087 | Paid salary ₹6,000 | Salery Dr 6000<br>Cash Cr 6000 | Correct | correct | Fuzzy spelling: Salery should normalize to Salary Expense. |
| QA-088 | Bought goods for cash ₹12,000 | Purchse Dr 12000<br>Cash Cr 12000 | Correct | correct | Fuzzy spelling: Purchse should normalize to Purchases. |
| QA-089 | Received commission ₹7,000 | Cash Dr 7000<br>Commision Cr 7000 | Correct | correct | Fuzzy spelling: Commision should normalize to Commission Income. |
| QA-090 | Bought machinery by cheque ₹45,000 | Machinary Dr 45000<br>Bank Cr 45000 | Correct | correct | Fuzzy spelling: Machinary should normalize to Machinery. |
| QA-091 | Bought furniture for cash ₹12,500 | Furnitur Dr 12500<br>Cash Cr 12500 | Correct | correct | Fuzzy spelling: Furnitur should normalize to Furniture. |
| QA-092 | Paid creditor ₹11,000 | Crediter Dr 11000<br>Cash Cr 11000 | Correct | correct | Fuzzy spelling: Crediter should normalize to Creditor. |
| QA-093 | Received from debtor ₹13,000 | Cash Dr 13000<br>Debter Cr 13000 | Correct | correct | Fuzzy spelling: Debter should normalize to Debtor. |
| QA-094 | Started business with ₹50,000 cash | Cash Account Dr 50000<br>Owner Capital Cr 50000 | Correct | correct | Common account name variation. |
| QA-095 | Started business with ₹80,000 in bank | Bank Account Debit 80000<br>Proprietor Capital Credit 80000 | Correct | correct | Debit/Credit words and account synonyms. |
| QA-096 | Owner withdrew cash for personal use ₹3,000 | Drawing Dr 3000<br>Cash Cr 3000 | Correct | correct | Drawing should normalize to Drawings. |
| QA-097 | Started business with ₹50,000 cash | Dr Cash 50000<br>Cr Capital 50000 | Correct | correct | Dr/Cr before account. |
| QA-098 | Started business with ₹50,000 cash | Debit Cash 50000<br>Credit Capital 50000 | Correct | correct | Debit/Credit before account. |
| QA-099 | Started business with ₹50,000 cash | Cash Debit 50000<br>Capital Credit 50000 | Correct | correct | Debit/Credit after account. |
| QA-100 | Started business with ₹50,000 cash | Cash A/c Dr. ₹50,000<br>To Capital A/c ₹50,000 | Correct | correct | Traditional `To` format. |
| QA-101 | Bought goods on credit ₹18,000 | Dr Purchases 18000<br>Cr Creditor 18000 | Correct | correct | Dr/Cr before account for purchases. |
| QA-102 | Sold goods on credit ₹35,000 | Debtor Debit 35000<br>Sales Credit 35000 | Correct | correct | Debit/Credit after account for sales. |
| QA-103 | Paid rent ₹5,000 | Rent Expense Dr 5000<br>To Cash 5000 | Correct | correct | `To` format with expense account. |
| QA-104 | Received interest ₹1,500 | Dr Cash 1500<br>To Interest 1500 | Correct | correct | Interest on credit side should normalize to Interest Income. |
| QA-105 | Bought machinery by cheque ₹45,000 | Machinery A/c Dr. ₹45,000<br>To Bank A/c ₹45,000 | Correct | correct | `A/c` and `To` format. |
| QA-106 | Paid electricity bill ₹4,500 | Electricity Expense Dr 4500<br>To Cash 4500 | Correct | correct | Expense account with `To` credit line. |
| QA-107 | Deposited cash into bank ₹10,000 | Bank Debit 10000<br>Cash Credit 10000 | Correct | correct | Bank transaction using Debit/Credit words. |
| QA-108 | Withdraw cash from bank ₹8,000 | Debit Cash 8000<br>Credit Bank 8000 | Correct | correct | Withdrawal using side before account. |
| QA-109 | Paid creditor ₹11,000 | Creditor A/c Dr. ₹11,000<br>To Cash A/c ₹11,000 | Correct | correct | Creditor account with `A/c` and `To`. |
| QA-110 | Received from debtor ₹13,000 | Cash A/c Dr. ₹13,000<br>To Debtor A/c ₹13,000 | Correct | correct | Debtor account with `A/c` and `To`. |

## Known Unsupported Cases

These cases are outside the current MVP scope and should not be treated as bugs unless the product scope changes:

- Compound entries
- GST entries
- Discount allowed/received
- Depreciation
- Bad debts
- Accrued/outstanding/prepaid adjustments
- Party-name preservation
- Multi-debit/multi-credit entries
