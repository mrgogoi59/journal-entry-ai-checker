# Known Failed Inputs Backlog

Use this backlog to record likely unsupported or risky student inputs for the Journal Entry AI Checker. The current MVP should stay focused on safe beginner one-debit, one-credit entries unless repeated real student failures justify a narrow rule update.

## 1. Ambiguous Cash/Bank/Credit Wording

- Example failed inputs: `Sold goods Rs.5000`, `Purchased goods Rs.4000`, `Paid rent Rs.1000`, `Received commission Rs.3000`.
- Expected accounting treatment: Depends on whether payment is cash, bank, cheque, credit, customer, supplier, or debtor/creditor.
- Support decision: Keep unsupported until mode is clear.
- Risk level: High, because guessing can mark the wrong account correct.

## 2. Compound Entries

- Example failed inputs: `Paid rent and salary Rs.10000`, `Bought furniture and machinery for cash Rs.50000`, `Received cash and cheque from debtor`.
- Expected accounting treatment: Multiple debit or credit lines may be required.
- Support decision: Later.
- Risk level: High, because the current MVP validates one debit and one credit.

## 3. GST

- Example failed inputs: `Purchased goods Rs.10000 plus GST 18%`, `Sold goods Rs.5000 plus GST`, `Paid GST to government`.
- Expected accounting treatment: Input GST/Output GST accounts may be required.
- Support decision: Later.
- Risk level: High, because tax treatment depends on transaction type and jurisdiction details.

## 4. Discount Allowed/Received

- Example failed inputs: `Received from debtor Rs.900 in full settlement of Rs.1000`, `Paid creditor Rs.900 in full settlement`, `Discount allowed Rs.100`.
- Expected accounting treatment: May require Discount Allowed or Discount Received in compound entries. Trade discount with clear net value can stay net-only.
- Support decision: Later, except safe trade-discount net cases already scoped separately.
- Risk level: High, because cash discount and trade discount are different.

## 5. Depreciation

- Example failed inputs: `Charge depreciation on machinery Rs.5000`, `Depreciation on furniture 10%`, `Machinery depreciated by Rs.2000`.
- Expected accounting treatment: Depreciation Expense Dr, To Asset or Provision for Depreciation.
- Support decision: Later.
- Risk level: Medium, because there are multiple accepted methods.

## 6. Bad Debts

- Example failed inputs: `Bad debts written off Rs.1000`, `Debtor became insolvent Rs.2000`, `Raju unable to pay Rs.500`.
- Expected accounting treatment: Bad Debts Dr, To Debtor.
- Support decision: Later.
- Risk level: Medium, because party-name preservation and debtor balances may matter.

## 7. Outstanding/Prepaid/Accrued Adjustments

- Example failed inputs: `Rent outstanding Rs.3000`, `Salary prepaid Rs.2000`, `Accrued interest Rs.1500`, `Commission received in advance`.
- Expected accounting treatment: Adjustment entries with assets/liabilities and expense/income accounts.
- Support decision: Later.
- Risk level: High, because adjustment wording is easy to misread.

## 8. UPI/NEFT/Online Transfer Wording

- Example failed inputs: `Paid rent by UPI Rs.5000`, `Received from debtor through NEFT Rs.10000`, `Paid creditor online Rs.7000`.
- Expected accounting treatment: Usually Bank is used instead of Cash.
- Support decision: Later, after confirming classroom convention.
- Risk level: Medium, because some students may treat digital payments as bank transactions.

## 9. Specific Asset Names Not Mapped

- Example failed inputs: `Bought printer from Raju for cash Rs.5000`, `Purchased laptop on credit Rs.30000`, `Bought mobile phone for office Rs.10000`.
- Expected accounting treatment: Debit the relevant asset account or a generic asset/equipment account.
- Support decision: Later, only for repeated classroom inputs.
- Risk level: Medium, because asset category names can vary.

## 10. Specific Goods/Items Not Mapped

- Example failed inputs: `Purchased sugar for cash Rs.1000`, `Sold tea leaves to Raju Rs.500`, `Bought cloth from supplier Rs.2000`.
- Expected accounting treatment: Purchases when bought for resale, Sales when sold.
- Support decision: Later, add only repeated common inventory words.
- Risk level: Medium, because items may be assets or inventory depending on business context.

## 11. Party-Name Preservation

- Example failed inputs: `Sold goods to Raju Rs.1000`, `Bought goods from Amit on credit Rs.2000`, `Received from Bidyut Rs.500`.
- Expected accounting treatment: Real books may use Raju/Amit/Bidyut account names instead of generic Debtor/Creditor.
- Support decision: Later.
- Risk level: Medium, because current MVP intentionally uses generic Debtor/Creditor.

## 12. Credit Wording Variations Like On Account/Payment Not Received

- Example failed inputs: `Sold goods payment not received Rs.1000`, `Purchased goods payment pending Rs.2000`, `Sold goods on account to Raju Rs.500`.
- Expected accounting treatment: Credit sale uses Debtor; credit purchase uses Creditor.
- Support decision: Later, after collecting real student wording.
- Risk level: Medium, because wording can imply credit but may be vague.

## 13. Capital Introduced Non-Cash

- Example failed inputs: `Started business with furniture Rs.50000`, `Owner introduced machinery as capital`, `Capital introduced by cheque and stock`.
- Expected accounting treatment: Debit asset introduced, credit Capital. Compound entries may be needed for multiple assets.
- Support decision: Later.
- Risk level: High, because non-cash capital can involve many asset accounts.

## 14. Drawings Of Goods/Assets

- Example failed inputs: `Owner withdrew goods for personal use Rs.1000`, `Proprietor took furniture for personal use`, `Goods withdrawn by owner`.
- Expected accounting treatment: Drawings Dr, To Purchases/Goods/Asset depending on item.
- Support decision: Later.
- Risk level: High, because goods drawings may affect purchases and asset drawings differ.

## 15. Expense Categories Not Supported

- Example failed inputs: `Paid insurance Rs.3000`, `Paid carriage Rs.500`, `Paid advertisement Rs.2000`, `Paid repairs Rs.800`.
- Expected accounting treatment: Relevant Expense Dr, To Cash/Bank.
- Support decision: Later, add only common Class 11 categories.
- Risk level: Low to medium, but account naming can vary.

## 16. Income Categories Not Supported

- Example failed inputs: `Received rent Rs.5000`, `Received dividend Rs.1000`, `Received fees Rs.3000`, `Received royalty Rs.2000`.
- Expected accounting treatment: Cash/Bank Dr, To relevant Income account.
- Support decision: Later.
- Risk level: Medium, because income names and receipt mode matter.

## 17. Sales Return/Purchase Return

- Example failed inputs: `Goods returned by customer Rs.1000`, `Returned goods to supplier Rs.500`, `Purchase return Rs.700`.
- Expected accounting treatment: Sales Return Dr/To Debtor or Creditor Dr/To Purchase Return depending on case.
- Support decision: Later.
- Risk level: High, because returns reverse earlier transaction logic.

## 18. Bank Charges

- Example failed inputs: `Bank charges Rs.100`, `Bank debited charges Rs.250`, `Paid bank commission Rs.300`.
- Expected accounting treatment: Bank Charges Expense Dr, To Bank.
- Support decision: Later.
- Risk level: Medium, because wording may overlap with commission or bank payments.

## 19. Loan/EMI Complexity

- Example failed inputs: `Paid EMI Rs.5000 including interest Rs.1000`, `Repaid loan with interest Rs.11000`, `Loan installment paid by cheque`.
- Expected accounting treatment: Compound entries may split principal and interest.
- Support decision: Later.
- Risk level: High, because principal and interest need separate accounts.

## 20. Amount Format Issues

- Example failed inputs: `Paid rent five thousand`, `Sold goods 1 lakh`, `Bought goods Rs 1,000 only`, `Paid Rs. 1.000,50`.
- Expected accounting treatment: Depends on parsed amount and transaction type.
- Support decision: Later for common Indian classroom formats; keep unclear formats unsupported.
- Risk level: Medium, because wrong amount parsing creates wrong scoring.

## 21. Spelling/Grammar Variations

- Example failed inputs: `saled goods`, `recived cash`, `purchsed goods`, `owner withdrawed cash`, `paid credtor`.
- Expected accounting treatment: Same as intended correctly spelled transaction.
- Support decision: Later, only for frequent spelling errors.
- Risk level: Medium, because broad fuzzy matching may guess incorrectly.

## 22. Journal Entry Format Variations

- Example failed inputs: `Cash To Sales 5000`, `By Cash 5000`, `Sales account credited with cash`, `Cash/Sales 5000`.
- Expected accounting treatment: Parser must identify debit side, credit side, accounts, and amounts.
- Support decision: Later.
- Risk level: High, because loose parsing can accidentally accept invalid journal entries.
