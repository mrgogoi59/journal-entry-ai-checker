# AccyWise AI Accountancy Concept Map

This is an internal planning document. It is not rendered in the app and does not change runtime behavior.

Current product decision:

- First gold-standard chapter prototype: `Journal Entries Chapter`
- Second validation chapter: `Trial Balance Chapter`
- First coding phase after founder approval: UI design system and responsive app shell, not the Journal Entries checker

## 1. Master Hierarchy

Every future Accountancy chapter should be planned through this hierarchy before it is implemented:

1. Chapter
2. Topic
3. Subtopic
4. Micro-topic
5. Concept
6. Sub-concept
7. Prerequisite
8. Student learning objective
9. Common transaction/question patterns
10. Expected accounting treatment
11. Solved illustration plan
12. Practice It Yourself plan
13. Answer input requirements
14. Checking rules
15. Feedback rules
16. Ledger impact
17. Trial Balance impact
18. Final Accounts impact
19. Learn-page status
20. Explainer status
21. Chapter-practice status
22. General-Practice status
23. Solver status
24. Test status
25. Support status
26. Risk/dependency notes

### Status Labels

Use these labels consistently in concept maps, implementation plans, and future support matrices:

| Status | Meaning |
| --- | --- |
| Supported now | Existing app behavior, tests, or content already support this safely. |
| Partially supported | Some wording, content, or runtime behavior exists, but coverage is incomplete or narrow. |
| Not supported yet | Planned concept, but no reliable runtime support exists yet. |
| Deferred/design-needed | Needs accounting design, UX design, statutory treatment decisions, or broader scope approval before implementation. |

## 2. Overall Accountancy Chapter Scaffold

| Order | Chapter | Prototype role | Current planning status | Notes |
| --- | --- | --- | --- | --- |
| 1 | Accounting Fundamentals | Prerequisite foundation | Partially supported | Current lessons cover concepts, but future chapter structure needs mapping. |
| 2 | Journal Entries | First gold-standard vertical slice | Planning now | Best first prototype because it has strong current assets and underpins later chapters. |
| 3 | Ledger | Follow-on from Journal Entries | Partially supported | Existing ledger engine and practice can be reused later. |
| 4 | Trial Balance | Second validation chapter | Planned second | Validates multi-row table input, debit/credit placement, totals, and balancing. |
| 5 | Bank Reconciliation Statement | Workflow chapter | Partially supported | Existing BRS tool exists; chapter pedagogy not yet mapped. |
| 6 | Rectification of Errors | Error-correction chapter | Not supported yet | Requires careful feedback and suspense/error treatment. |
| 7 | Depreciation, Provisions and Reserves | Adjustment chapter | Partially supported | Existing lessons/tools have pieces, but support needs audit. |
| 8 | Final Accounts / Financial Statements | Advanced workflow chapter | Partially supported | Existing engine exists; adjustments and statements need careful design. |
| 9 | Bills of Exchange | Instrument-specific chapter | Partially supported | Existing learning content exists; runtime support needs audit. |
| 10 | Not-for-Profit Accounts | Statement-focused chapter | Partially supported | Existing lessons exist; checker design is deferred. |
| 11 | Partnership Accounts | Advanced chapter family | Partially supported | Narrow controlled journal/explainer cases exist; complex treatments remain deferred. |
| 12 | Company Accounts | Advanced chapter family | Partially supported | Narrow controlled share/debenture cases exist; statutory and complex cases remain deferred. |
| 13 | Cash Flow Statement | Later advanced chapter | Deferred/design-needed | Add later after core statements are stable. |

## 3. Journal Entries Chapter: Fully Populated Concept Map

Teaching principle:

- Teach modern classification first: Asset, Liability, Capital/Equity, Income, Expense, Drawings.
- Then connect to traditional Personal, Real, and Nominal rules carefully.
- Do not let memorized rules hide the account-effect logic.
- Keep early Practice It Yourself entries simple, complete, and checkable.

### 3.1 Foundations and Prerequisites

| Field | Plan |
| --- | --- |
| Topic | Foundations and prerequisites |
| Subtopics | Meaning and purpose of journal, business transaction, source documents, accounts affected, classifications, debit/credit rules, journal format |
| Micro-topics | Transaction vs non-transaction, cash memo/invoice/voucher/receipt, account identification, modern classification, traditional classification, increase/decrease effects, `Dr.`, `To`, debit column, credit column, narration |
| Concepts | A journal records the first accounting entry; every transaction affects at least two accounts; debit and credit must balance. |
| Sub-concepts | Business entity concept, dual aspect, account type, account side, amount equality, particulars formatting. |
| Prerequisites | Basic money amounts, business vs owner distinction, simple assets/liabilities/income/expense vocabulary. |
| Learning objective | Student can identify accounts affected, classify them, decide debit/credit, and write the entry in correct format. |
| Common patterns | Started business, bought goods, sold goods, paid expense, received income, deposited cash, withdrew cash. |
| Expected treatment | Debit the receiving/increasing side by account type; credit the giving/decreasing/source side; keep amounts equal. |
| Solved illustration plan | Illustration 1: identify accounts only. Illustration 2: classify accounts. Illustration 3: write full entry with narration. Mixed: decide account type and side. |
| Practice It Yourself plan | Student fills account names, `Dr.`, `To`, debit amount, credit amount, and optional narration. |
| Answer input requirements | Full particulars, side markers, debit/credit amounts, balanced total, optional narration for early prototype. |
| Checking rules | Missing account, wrong account, wrong side, wrong amount, imbalance, duplicate line, unclear narration warning. |
| Feedback rules | Explain the account type first, then explain why debit/credit applies. |
| Ledger impact | Show which account receives a debit and which receives a credit. |
| Trial Balance impact | Debit balances and credit balances remain equal after the entry. |
| Final Accounts impact | Depends on account types; early lessons only label high-level effect. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Need a reusable full-answer editor and feedback component before chapter practice. |

### 3.2 Capital

| Field | Plan |
| --- | --- |
| Topic | Capital |
| Subtopics | Proprietor capital, named partner capital, two partners with different amounts, cash vs bank capital, additional capital later |
| Micro-topics | `Cash A/c Dr.`, `Bank A/c Dr.`, named `Capital A/c`, owner contribution, partner contribution, business entity distinction |
| Concepts | Capital increases the owner's or partner's claim in the business. Cash/Bank increases when money enters the business. |
| Sub-concepts | Proprietor vs partner account naming, generic capital vs named capital, two contributors, total debit amount. |
| Prerequisites | Entity concept, Asset increases, Capital increases, journal format. |
| Learning objective | Student can write capital entries without using generic `Capital A/c` when a named partner is given. |
| Common patterns | `introduced`, `invested`, `brought`, `started business with`, `started partnership with`, `through bank`, `in cash`, two names with two amounts. |
| Expected treatment | Cash/Bank Dr. for amount received; named proprietor/partner Capital Cr. for amount contributed. Two-partner entries debit total Cash/Bank and credit both capital accounts separately. |
| Solved illustration plan | Illustration 1: proprietor brings cash. Illustration 2: named partner brings capital by bank. Illustration 3: two partners introduce different amounts. Mixed: identify cash vs bank from wording. |
| Practice It Yourself plan | Student writes complete entry and must preserve named capital account. |
| Answer input requirements | Receipt account, named capital account(s), correct amounts, balanced total, optional narration. |
| Checking rules | Generic `Capital A/c` is wrong when a name is supplied; wrong Cash/Bank treatment is conceptual error; two-partner total must equal sum of credit lines. |
| Feedback rules | Explain asset increase and capital increase. For partners, explain each partner's capital account separately. |
| Ledger impact | Cash/Bank debit; Capital account credit. |
| Trial Balance impact | Asset debit and capital credit keep totals equal. |
| Final Accounts impact | Balance Sheet affected; Asset increases; Capital increases; no direct Profit and Loss impact. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for controlled wording. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Supported now for recent controlled wording. Support status: Partially supported. |
| Risk/dependency notes | Partial cash/bank split in one transaction is future/design-needed. Avoid broad Partnership Accounts logic. |

### 3.3 Drawings

| Field | Plan |
| --- | --- |
| Topic | Drawings |
| Subtopics | Cash withdrawn for personal use, bank withdrawal for personal use, goods withdrawn, personal expenses paid by business, business withdrawal vs drawings |
| Micro-topics | Named drawings account, cash credit, bank credit, goods withdrawal, personal-use signal words |
| Concepts | Drawings reduce owner's/partner's capital presentation. Cash/Bank decreases when money leaves the business for personal use. |
| Sub-concepts | Business cash withdrawal is not always drawings; personal-use wording changes treatment. |
| Prerequisites | Capital, assets, business entity concept, cash/bank distinction. |
| Learning objective | Student can distinguish drawings from normal business cash/bank transfers. |
| Common patterns | `withdrew cash for personal use`, `withdrew from bank for personal expenses`, `goods withdrawn for personal use`, `business paid owner's personal expense`. |
| Expected treatment | Named Drawings Dr.; Cash/Bank/Purchases or relevant account Cr. depending on what leaves the business. |
| Solved illustration plan | Illustration 1: cash drawings. Illustration 2: bank drawings. Illustration 3: personal expense paid by business. Mixed: contrast business cash withdrawal with drawings. |
| Practice It Yourself plan | Student identifies personal-use signal and writes named drawings account. |
| Answer input requirements | Named drawings account, correct outgoing asset/account, amount, balanced entry, optional narration. |
| Checking rules | Treating personal-use bank withdrawal as normal Cash Dr./Bank Cr. is wrong; missing partner/proprietor name is a warning or error depending on prompt. |
| Feedback rules | Explain personal use first, then explain why drawings is debited and Cash/Bank is credited. |
| Ledger impact | Drawings debit; Cash/Bank or goods-related credit. |
| Trial Balance impact | Drawings debit and asset/relevant credit keep totals equal. |
| Final Accounts impact | Balance Sheet affected; Cash/Bank decreases; drawings are adjusted against capital; no direct Profit and Loss impact. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for cash and bank wording. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Supported now for controlled wording. Support status: Partially supported. |
| Risk/dependency notes | Goods withdrawn and personal expenses paid by business need careful support audit before runtime. |

### 3.4 Purchases

| Field | Plan |
| --- | --- |
| Topic | Purchases |
| Subtopics | Cash purchases, bank purchases, credit purchases, goods vs assets, named supplier/creditor |
| Micro-topics | Purchase of goods, supplier account, creditor account, cash/bank payment, inventory/goods distinction |
| Concepts | Purchases of goods increase purchase expense/inventory treatment for trading goods; payment mode decides credit side. |
| Sub-concepts | Goods for resale differ from asset purchases; supplier name matters in credit purchases. |
| Prerequisites | Expense/goods concept, cash/bank distinction, personal account for creditor. |
| Learning objective | Student can write purchase entries and avoid treating assets as purchases. |
| Common patterns | `bought goods for cash`, `purchased goods by cheque`, `bought goods on credit from Ram`, `purchased furniture`. |
| Expected treatment | Purchases Dr. for goods; Cash/Bank Cr. for immediate payment; Supplier Cr. for credit purchase. Asset Dr. when asset is purchased. |
| Solved illustration plan | Illustration 1: cash purchase. Illustration 2: credit purchase from named supplier. Illustration 3: contrast goods purchase with asset purchase. Mixed: mode of payment changes credit account. |
| Practice It Yourself plan | Student chooses Purchases vs asset and credit account. |
| Answer input requirements | Correct debit account, correct payment/creditor credit, amount, narration if required. |
| Checking rules | Asset vs goods confusion, supplier missing, Cash vs Bank wrong, wrong side, unbalanced amount. |
| Feedback rules | Explain whether the item is goods for resale or an asset before side correction. |
| Ledger impact | Purchases/asset debit; Cash/Bank/Supplier credit. |
| Trial Balance impact | Debit purchase/asset and credit payment/creditor. |
| Final Accounts impact | Purchases affect trading/P&L path; assets affect Balance Sheet. Keep early prototype simple. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported. Chapter-practice status: Not supported yet. General-Practice status: Supported now for beginner-style cases. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Purchase returns, trade discount, and GST are later/design-needed. |

### 3.5 Sales

| Field | Plan |
| --- | --- |
| Topic | Sales |
| Subtopics | Cash sales, bank sales, credit sales, named customer/debtor, sale of goods vs sale of asset |
| Micro-topics | Sales revenue, debtor account, receipt mode, goods vs fixed asset sale |
| Concepts | Sales of goods increase income; Cash/Bank/Debtor increases depending on receipt or credit. |
| Sub-concepts | Sale of an asset is not ordinary Sales; customer name matters in credit sales. |
| Prerequisites | Income, asset, debtor, cash/bank distinction. |
| Learning objective | Student can write sales entries and distinguish sales of goods from sale of assets. |
| Common patterns | `sold goods for cash`, `sold goods by bank`, `sold goods on credit to Ram`, `sold furniture`. |
| Expected treatment | Cash/Bank/Customer Dr.; Sales Cr. for goods. Asset disposal treatment deferred for complex profit/loss cases. |
| Solved illustration plan | Illustration 1: cash sale. Illustration 2: credit sale to named customer. Illustration 3: sale of goods vs sale of asset warning. Mixed: choose debtor or Bank. |
| Practice It Yourself plan | Student chooses receipt/debtor account and credits Sales only for goods. |
| Answer input requirements | Debit account, Sales credit, amount, optional narration. |
| Checking rules | Wrong account side, missing customer, treating asset sale as Sales, Cash/Bank confusion. |
| Feedback rules | Explain what the business receives and why Sales is credited. |
| Ledger impact | Cash/Bank/Debtor debit; Sales credit. |
| Trial Balance impact | Debit asset/debtor and credit income. |
| Final Accounts impact | Sales affects trading/P&L path; Cash/Bank/Debtor affects Balance Sheet. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported. Chapter-practice status: Not supported yet. General-Practice status: Supported now for beginner-style cases. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Sales returns and asset sale with profit/loss need later design. |

### 3.6 Expenses

| Field | Plan |
| --- | --- |
| Topic | Expenses |
| Subtopics | Expense paid by cash, expense paid by bank, outstanding expense, prepaid expense, due but not paid, personal vs business expense |
| Micro-topics | Rent, salary, wages, electricity, insurance, outstanding liability, prepaid asset |
| Concepts | Expenses are debited when incurred. Cash/Bank decreases when paid. Liability arises when unpaid. Asset arises when prepaid. |
| Sub-concepts | Paid vs due vs prepaid; business expense vs personal expense. |
| Prerequisites | Expense, asset, liability, cash/bank distinction. |
| Learning objective | Student can separate simple paid expense from adjustment entries. |
| Common patterns | `paid rent in cash`, `paid salary by bank`, `rent outstanding`, `insurance prepaid`, `paid owner's personal expense`. |
| Expected treatment | Expense Dr.; Cash/Bank Cr. when paid. Expense Dr.; Outstanding Expense Cr. when due. Prepaid Expense Dr.; Expense/Cash treatment depends on entry type. |
| Solved illustration plan | Illustration 1: paid expense. Illustration 2: outstanding expense. Illustration 3: prepaid expense. Mixed: personal expense paid by business becomes drawings. |
| Practice It Yourself plan | Early prototype includes simple paid expense only; adjustments added later. |
| Answer input requirements | Expense account, payment/liability/prepaid account, amount, narration where useful. |
| Checking rules | Cash vs Bank, expense vs drawings, liability/prepaid side, wrong amount. |
| Feedback rules | Ask whether the expense is paid, due, prepaid, or personal. |
| Ledger impact | Expense/prepaid debit; Cash/Bank/liability credit. |
| Trial Balance impact | Expense/prepaid debit and Cash/Bank/liability credit. |
| Final Accounts impact | Simple expense affects P&L; outstanding/prepaid affect Balance Sheet too. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for simple cases. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Keep simple paid expenses separate from adjustment entries in first prototype. |

### 3.7 Income and Receipts

| Field | Plan |
| --- | --- |
| Topic | Income and receipts |
| Subtopics | Income received in cash, income received by bank, accrued income, income received in advance, income vs liability receipts |
| Micro-topics | Commission received, rent received, interest received, accrued income, advance income |
| Concepts | Income is credited when earned. Cash/Bank is debited when received. |
| Sub-concepts | Earned vs received in advance; accrued income as asset. |
| Prerequisites | Income, asset, liability, cash/bank distinction. |
| Learning objective | Student can write simple income receipts and identify advance/accrued variants as adjustments. |
| Common patterns | `received commission in cash`, `rent received by bank`, `income accrued`, `rent received in advance`. |
| Expected treatment | Cash/Bank Dr.; Income Cr. for simple receipts. Accrued Income Dr.; Income Cr. Income Dr. or Cash/Bank Dr. with Income Received in Advance Cr. depending on entry design. |
| Solved illustration plan | Illustration 1: simple cash income. Illustration 2: bank income. Illustration 3: received in advance warning. Mixed: earned income vs liability receipt. |
| Practice It Yourself plan | First prototype includes simple income receipt only; accrual/advance later. |
| Answer input requirements | Receipt account, income/liability account, amount. |
| Checking rules | Income vs liability, accrued asset, Cash/Bank confusion, side errors. |
| Feedback rules | Ask whether the income is earned now or received before it is earned. |
| Ledger impact | Cash/Bank/accrued asset debit; income or liability credit. |
| Trial Balance impact | Debit receipt/asset and credit income/liability. |
| Final Accounts impact | Income affects P&L if earned; advance/accrued also affects Balance Sheet. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for simple cases. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Avoid broad adjustment support in first prototype. |

### 3.8 Assets

| Field | Plan |
| --- | --- |
| Topic | Assets |
| Subtopics | Cash asset purchase, bank asset purchase, credit asset purchase, installation/incidental costs, asset sold at book/profit/loss, depreciation link |
| Micro-topics | Furniture, machinery, computer, vehicle, supplier credit, sale proceeds, profit/loss on sale |
| Concepts | Asset purchases debit the asset account. Payment/credit mode decides credit account. |
| Sub-concepts | Asset is different from goods for resale; incidental cost capitalization needs design. |
| Prerequisites | Asset, creditor, cash/bank, purchases vs asset distinction. |
| Learning objective | Student can identify fixed asset purchase entries and not use Purchases for fixed assets. |
| Common patterns | `bought furniture for cash`, `purchased machinery by cheque`, `bought computer on credit from X`, `sold machine`. |
| Expected treatment | Asset Dr.; Cash/Bank/Supplier Cr. for purchase. Asset sale at profit/loss is deferred beyond first prototype unless safely scoped. |
| Solved illustration plan | Illustration 1: cash asset purchase. Illustration 2: credit asset purchase. Illustration 3: goods vs asset contrast. Mixed: simple sale at book value as later candidate. |
| Practice It Yourself plan | First prototype can include simple asset purchase only. |
| Answer input requirements | Asset account, payment/creditor account, amount. |
| Checking rules | Purchases vs asset confusion, Cash/Bank confusion, missing supplier, unsupported profit/loss sale warning. |
| Feedback rules | Explain whether the item is used in business or bought for resale. |
| Ledger impact | Asset debit; Cash/Bank/Creditor credit. |
| Trial Balance impact | Asset debit and Cash/Bank/Creditor credit. |
| Final Accounts impact | Balance Sheet affected; no direct P&L impact for simple purchase. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Do not claim broad asset disposal support. Installation cost and depreciation links are design-needed. |

### 3.9 Liabilities and Borrowing

| Field | Plan |
| --- | --- |
| Topic | Liabilities and borrowing |
| Subtopics | Loan received in cash/bank, loan repaid, creditor paid, liability created/settled, interest on loan later |
| Micro-topics | Bank loan, lender account, creditor payment, repayment, interest payable |
| Concepts | Liability increases are credited. Cash/Bank increases when loan is received and decreases when repaid. |
| Sub-concepts | Principal vs interest; liability creation vs settlement. |
| Prerequisites | Liability, cash/bank, expense vs liability. |
| Learning objective | Student can write simple loan receipt and repayment entries. |
| Common patterns | `loan received by bank`, `borrowed cash`, `repaid loan by cheque`, `paid creditor`. |
| Expected treatment | Cash/Bank Dr.; Loan Cr. when received. Loan/Creditor Dr.; Cash/Bank Cr. when settled. |
| Solved illustration plan | Illustration 1: loan received. Illustration 2: creditor paid. Illustration 3: loan repayment. Mixed: separate principal and interest as later warning. |
| Practice It Yourself plan | Include simple loan received in first prototype; repayment can be second batch. |
| Answer input requirements | Cash/Bank, liability account, amount, side. |
| Checking rules | Liability side, Cash/Bank treatment, loan vs interest, creditor vs expense. |
| Feedback rules | Explain whether the liability is increasing or being settled. |
| Ledger impact | Loan receipt debits Cash/Bank and credits Loan; repayment reverses liability and cash/bank direction. |
| Trial Balance impact | Debit and credit remain equal through liability movement. |
| Final Accounts impact | Balance Sheet affected; no direct P&L impact for principal-only transactions. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for simple cases. Chapter-practice status: Not supported yet. General-Practice status: Partially supported. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Interest on loan is later because it combines expense and liability/payment. |

### 3.10 Cash and Bank Transfers

| Field | Plan |
| --- | --- |
| Topic | Cash and bank transfers |
| Subtopics | Cash deposited into bank, cash withdrawn from bank for business use, contra-entry concept, business transfer vs drawings, cheque/UPI/NEFT/card as bank |
| Micro-topics | Cash-to-bank, bank-to-cash, contra entry, payment mode aliases |
| Concepts | Cash and Bank are both assets. A transfer between them changes asset form, not income/expense/capital. |
| Sub-concepts | Personal-use withdrawal becomes drawings; business cash withdrawal remains Cash Dr./Bank Cr. |
| Prerequisites | Asset, cash/bank, drawings concept. |
| Learning objective | Student can distinguish business transfers from drawings. |
| Common patterns | `cash deposited into bank`, `withdrew cash from bank for office use`, `withdrew from bank for personal use`, `paid by cheque`, `UPI payment`. |
| Expected treatment | Bank Dr.; Cash Cr. for deposit. Cash Dr.; Bank Cr. for business withdrawal. Drawings Dr.; Bank/Cash Cr. for personal use. |
| Solved illustration plan | Illustration 1: cash deposited. Illustration 2: cash withdrawn for business. Illustration 3: personal-use withdrawal contrast. Mixed: identify transaction purpose. |
| Practice It Yourself plan | Include both cash-to-bank and bank-to-cash business transfers in first prototype. |
| Answer input requirements | Cash/Bank accounts, amount, no income/expense account unless prompt says so. |
| Checking rules | Personal-use vs business-use, wrong asset side, treating transfer as income/expense, Cash/Bank alias handling. |
| Feedback rules | Explain whether money stayed inside the business or went to the owner/partner personally. |
| Ledger impact | One asset debited and the other asset credited. |
| Trial Balance impact | Asset debit and asset credit keep totals equal. |
| Final Accounts impact | Balance Sheet asset composition changes; no direct P&L impact. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported. Chapter-practice status: Not supported yet. General-Practice status: Supported now for some cases. Solver status: Partially supported. Test status: Partially supported. Support status: Partially supported. |
| Risk/dependency notes | Aliases like UPI/NEFT/card should be normalized only after explicit design. |

### 3.11 Returns and Discounts

| Field | Plan |
| --- | --- |
| Topic | Returns and discounts |
| Subtopics | Purchase returns, sales returns, discount allowed, discount received, cash discount vs trade discount |
| Micro-topics | Return outward, return inward, debtor/creditor adjustment, discount income/expense |
| Concepts | Returns reverse purchases/sales with the relevant party. Cash discount is recorded; trade discount is not separately journalized. |
| Sub-concepts | Discount allowed is expense/loss; discount received is income/gain. |
| Prerequisites | Purchases, sales, debtor, creditor, income, expense. |
| Learning objective | Student can identify simple return and discount treatment when introduced later. |
| Common patterns | `goods returned to supplier`, `customer returned goods`, `discount allowed`, `discount received`, `trade discount`. |
| Expected treatment | Supplier Dr.; Purchase Returns Cr. Customer/Sales Returns treatment depends on wording. Discount Allowed Dr.; Debtor Cr. Creditor Dr.; Discount Received Cr. |
| Solved illustration plan | Illustration 1: purchase return. Illustration 2: sales return. Illustration 3: cash discount vs trade discount. Mixed: return plus settlement later. |
| Practice It Yourself plan | Not in first prototype; add after purchases/sales are stable. |
| Answer input requirements | Party account, return/discount account, amount. |
| Checking rules | Wrong return direction, discount allowed vs received, trade discount incorrectly journalized. |
| Feedback rules | Ask whether goods are coming back or going back, and whether discount is cash discount or trade discount. |
| Ledger impact | Party account and return/discount account affected. |
| Trial Balance impact | Debit/credit equality maintained. |
| Final Accounts impact | Returns affect trading values; discounts affect P&L unless trade discount. |
| Status | Learn-page status: Partially supported. Explainer status: Not supported yet or narrow only. Chapter-practice status: Not supported yet. General-Practice status: Partially supported if existing beginner cases cover it. Solver status: Partially supported. Test status: Needs audit. Support status: Deferred/design-needed for chapter prototype. |
| Risk/dependency notes | Keep out of first prototype unless existing support is audited. |

### 3.12 Bad Debts and Recoveries

| Field | Plan |
| --- | --- |
| Topic | Bad debts and recoveries |
| Subtopics | Bad debts written off, bad debts recovered, provision-related entries |
| Micro-topics | Debtor write-off, recovery receipt, bad debts expense, recovery income |
| Concepts | Bad debts are losses when a debtor cannot pay. Recovery is income/receipt later. |
| Sub-concepts | Provision for doubtful debts is a separate design area. |
| Prerequisites | Debtors, expense/loss, income, cash/bank. |
| Learning objective | Student can understand simple bad debt write-off and recovery later. |
| Common patterns | `Ram became insolvent`, `bad debts written off`, `bad debts recovered`. |
| Expected treatment | Bad Debts Dr.; Debtor Cr. for write-off. Cash/Bank Dr.; Bad Debts Recovered Cr. for recovery. |
| Solved illustration plan | Illustration 1: bad debt write-off. Illustration 2: recovery. Illustration 3: provision warning. |
| Practice It Yourself plan | Later chapter batch after debtor/sales are stable. |
| Answer input requirements | Debtor, bad debts/recovery account, amount. |
| Checking rules | Debtor side, recovery vs write-off, provision confusion. |
| Feedback rules | Explain whether money is lost or recovered. |
| Ledger impact | Expense/loss or receipt account plus debtor/cash/bank account. |
| Trial Balance impact | Debit/credit totals balanced. |
| Final Accounts impact | Bad debts affect P&L; debtor/cash/bank affects Balance Sheet. |
| Status | Learn-page status: Partially supported. Explainer status: Not supported yet or narrow only. Chapter-practice status: Not supported yet. General-Practice status: Needs audit. Solver status: Needs audit. Test status: Needs audit. Support status: Deferred/design-needed for first prototype. |
| Risk/dependency notes | Provision-related cases are deferred/design-needed. |

### 3.13 Opening, Adjustment, Transfer, Closing, and Rectification Entries

| Field | Plan |
| --- | --- |
| Topic | Special journal entries |
| Subtopics | Opening entries, transfer entries, adjustment entries, closing entries, rectification entries |
| Micro-topics | Opening assets/liabilities/capital, expense/income transfer, outstanding/prepaid/accrued/advance, closing to Trading/P&L, error correction |
| Concepts | These entries support period-end accounting and corrections, but require more context than simple transaction entries. |
| Sub-concepts | Nominal account closure, balance carried forward, suspense account, adjustment impact. |
| Prerequisites | Core journal entries, ledger, trial balance, final accounts. |
| Learning objective | Student recognizes these as later topics, not first-prototype simple transaction entries. |
| Common patterns | `opening balance`, `transfer to P&L`, `adjust outstanding`, `rectify error`. |
| Expected treatment | Depends on period-end design and chapter context. |
| Solved illustration plan | Placeholder only. Build after Journal Entries basics and Trial Balance are stable. |
| Practice It Yourself plan | Deferred. |
| Answer input requirements | Deferred. |
| Checking rules | Deferred. |
| Feedback rules | Deferred. |
| Ledger impact | Depends on entry type. |
| Trial Balance impact | Can affect balances and suspense. |
| Final Accounts impact | Often direct. |
| Status | Learn-page status: Partially supported. Explainer status: Deferred/design-needed. Chapter-practice status: Not supported yet. General-Practice status: Deferred/design-needed. Solver status: Deferred/design-needed. Test status: Needs design. Support status: Deferred/design-needed. |
| Risk/dependency notes | Do not mix these into first Journal Entries prototype. |

### 3.14 GST and Tax

| Field | Plan |
| --- | --- |
| Topic | GST and tax |
| Subtopics | Input GST, Output GST, intra-state/inter-state GST, GST set-off, GST on asset sale |
| Micro-topics | CGST, SGST, IGST, input credit, output liability, set-off, tax-inclusive/exclusive values |
| Concepts | GST changes the accounts affected and requires jurisdiction/tax-rate assumptions. |
| Sub-concepts | Input tax credit, output tax liability, tax set-off. |
| Prerequisites | Purchases, sales, tax rules, asset treatment. |
| Learning objective | Student should not receive casual or incomplete GST treatment from the first prototype. |
| Common patterns | `purchased goods plus GST`, `sold goods plus GST`, `set off GST`, `asset sale with GST`. |
| Expected treatment | Deferred until tax model is designed. |
| Solved illustration plan | Placeholder only. |
| Practice It Yourself plan | Deferred. |
| Answer input requirements | Deferred. |
| Checking rules | Deferred. |
| Feedback rules | Explain unsupported status if asked before support exists. |
| Ledger impact | Deferred. |
| Trial Balance impact | Deferred. |
| Final Accounts impact | Deferred. |
| Status | Learn-page status: Partially supported. Explainer status: Deferred/design-needed. Chapter-practice status: Not supported yet. General-Practice status: Deferred/design-needed. Solver status: Deferred/design-needed. Test status: Needs design. Support status: Deferred/design-needed. |
| Risk/dependency notes | Do not add broad GST support casually. |

### 3.15 Partnership and Company Crossover

| Field | Plan |
| --- | --- |
| Topic | Partnership/Company crossover journal entries |
| Subtopics | Controlled Partnership entries, controlled Company entries, deferred complex cases |
| Micro-topics | Named partner capital, two-partner capital, drawings, interest on capital, share application, calls in advance, debenture redemption at par |
| Concepts | Advanced entities use journal-entry logic, but topic assumptions become more specialized. |
| Sub-concepts | Partner capital/current/drawings accounts, share application liability/equity stage, calls in advance, debenture liability redemption. |
| Prerequisites | Core journal entry rules, capital/drawings, liabilities, company terminology. |
| Learning objective | Student sees that advanced chapters still use debit/credit logic, but only controlled safe cases are supported now. |
| Common patterns | Partner capital by cash/bank, two partners with different amounts, drawings, interest on capital, share application money received, calls in advance received, debenture redemption at par. |
| Expected treatment | Current controlled runtime cases: `Bank Dr. / Amit Capital Cr.`, `Amit Drawings Dr. / Cash Cr.`, `Interest on Capital Dr. / Amit Current Cr.`, `Bank Dr. / Share Application Cr.`, `Bank Dr. / Calls in Advance Cr.`, `Debentures Dr. / Bank Cr.` |
| Solved illustration plan | Use only after core journal chapter patterns are stable. Keep as advanced examples or bridge cards, not first prototype core content. |
| Practice It Yourself plan | Do not broaden from current controlled cases without approval. |
| Answer input requirements | Same journal rows, but account naming is stricter. |
| Checking rules | Preserve named partner accounts; avoid generic capital; expected-answer metadata should drive previews. |
| Feedback rules | Keep explanations short and constrained. Unsupported prompts should stay unsupported. |
| Ledger impact | Existing advanced preview can derive from expected entries. |
| Trial Balance impact | Existing advanced preview can derive from expected entries. |
| Final Accounts impact | Currently only capital contribution and drawings in cash have static metadata. |
| Status | Learn-page status: Partially supported. Explainer status: Partially supported for controlled cases. Chapter-practice status: Not supported yet. General-Practice status: Separate advanced beta only. Solver status: Partially supported. Test status: Supported now for controlled cases. Support status: Partially supported. |
| Risk/dependency notes | Deferred complex cases: goodwill, admission, retirement, death, partner salary, partner commission, revaluation, forfeiture, reissue, share allotment, premium redemption, DRR, statutory treatments. |

## 4. Journal Entries Teaching Order

Recommended serial order for the first chapter prototype:

1. Business transaction
2. Accounts affected
3. Account classifications
4. Debit/credit logic
5. Journal format
6. Cash/bank basics
7. Capital
8. Drawings
9. Purchases
10. Sales
11. Expenses
12. Income
13. Assets
14. Liabilities
15. Mixed simple entries
16. Recap
17. Chapter-level practice

## 5. Solved Illustration Progression

Use this as the first planning set. Do not generate hundreds of questions yet.

| Subtopic | Illustration 1 basic | Illustration 2 wording variation | Illustration 3 one step harder | Mixed use | Explanation focus | Common mistake |
| --- | --- | --- | --- | --- | --- | --- |
| Format | Write a blank journal format | Add `Dr.`, `To`, and columns | Add narration | Format correction card | Why each column exists | Putting credit account without `To` |
| Cash/Bank basics | Cash deposited into bank | Cash withdrawn from bank for business | Cheque/UPI treated as bank later | Distinguish business transfer vs drawings | Both Cash and Bank are assets | Treating transfer as income |
| Capital | Owner brings cash | Named partner brings bank capital | Two partners contribute different amounts | Cash vs bank and named capital | Asset increases, capital increases | Generic `Capital A/c` for named partner |
| Drawings | Cash withdrawn personally | Bank withdrawn personally | Personal expense paid by business later | Business withdrawal vs personal withdrawal | Drawings reduce capital presentation | Writing Cash Dr./Bank Cr. for personal use |
| Purchases | Bought goods for cash | Bought goods on credit from supplier | Bought asset, not goods | Goods vs asset contrast | Purchases account vs asset account | Debiting Purchases for furniture |
| Sales | Sold goods for cash | Sold goods on credit to customer | Asset sale warning | Customer vs Bank vs Cash | What the business receives | Crediting Sales for asset sale |
| Expenses | Paid rent in cash | Paid salary by bank | Outstanding/prepaid warning | Business vs personal expense | Expense is debited when incurred | Crediting expense |
| Income | Commission received in cash | Rent received by bank | Income received in advance warning | Earned vs not yet earned | Income is credited when earned | Treating advance as ordinary income |
| Assets | Bought furniture for cash | Bought machinery on credit | Installation cost warning | Goods vs fixed asset | Asset account is debited | Using Purchases for asset |
| Liabilities | Loan received by bank | Creditor paid | Loan repayment later | Liability created vs settled | Liability increases by credit | Treating loan as income |
| Mixed simple entries | Capital, purchase, sale, expense | Cash/bank variations | Drawings contrast | Cumulative practice set | Account-effect reasoning | Memorized rule without account identification |

Each illustration card should include:

- question type
- takeaway
- answer format
- explanation focus
- common mistake

## 6. Practice It Yourself Requirements

The app should provide only structure and headings. The student should enter the meaningful answer.

Student-entered fields for Journal Entries:

- particulars line 1
- `Dr.` marker where required
- `To` line where required
- debit amount
- credit amount
- additional debit/credit rows for compound entries
- narration where required by the selected lesson

Checking rules:

- missing account
- extra account
- incorrect account
- wrong side
- wrong amount
- incorrect total
- unbalanced entry
- duplicate line
- wrong cash/bank treatment
- generic `Capital A/c` instead of named partner capital
- drawings vs business cash withdrawal
- narration missing or materially wrong where required

Feedback severity:

| Severity | Use when |
| --- | --- |
| Hard error | Conceptual or numerical answer is wrong: wrong account, wrong side, wrong amount, unbalanced, missing required line. |
| Soft warning | Format is imperfect but treatment is clear: missing optional punctuation, narration too short, minor label variation. |
| Accepted formatting variation | Case, optional `A/c`, apostrophes, commas in amounts, `Dr` vs `Dr.`, harmless punctuation. |

Normalization can accept:

- case differences
- optional `A/c`
- punctuation differences
- apostrophe variations
- `Dr` and `Dr.`
- comma-formatted amounts

Normalization must not hide conceptual mistakes:

- Cash vs Bank
- Capital vs named partner capital
- Drawings vs business cash withdrawal
- Purchase of goods vs asset purchase
- Sales of goods vs asset sale
- income vs liability receipt
- expense vs drawings

## 7. Chapter UX Plan

Future Journal Entries chapter page should include:

- chapter header
- short objective
- progress through subtopics
- ordered navigation
- concept section
- example card
- solved illustration card
- Practice It Yourself editor
- Check Answer action
- inline feedback
- correct-answer reveal policy
- retry action
- continue action
- Ask AI later, only after grounded tutor design is approved

Mobile requirements:

- no horizontal page overflow
- readable journal rows
- large touch targets
- easy add/remove entry lines
- clear debit and credit inputs
- sticky or easy-to-reach actions
- concise feedback
- no wide desktop-only table assumptions

## 8. Existing Assets to Reuse

Reusable assets:

- Journal Entry Explainer: `/journal-entry-solver`, `/api/journal-entry-solver`, `lib/journal-entry-solver.ts`
- beginner `/practice`
- existing advanced question structures in `lib/accounting-core/`
- checker/validator helpers in `lib/journal-parser.ts`, `lib/entry-validator.ts`, and related beginner journal logic
- learning content in `lib/learning-content.ts`
- current journal-entry tests
- Ledger Impact utilities and `lib/ledger-engine.ts`
- Trial Balance Impact utilities and `lib/trial-balance-engine.ts`
- Final Accounts Impact metadata pattern in `/practice/advanced`
- unsupported-case safety behavior in the Explainer
- `components/FeedbackReport.tsx`
- mobile navigation and current responsive UI patterns

Major gaps before first prototype:

- reusable chapter renderer
- solved illustration schema
- full-answer journal-entry editor
- chapter-level checker adapter
- feedback component tuned for chapter practice
- progress state for new chapter flow
- chapter navigation
- acceptance tests for the chapter journey

## 9. First Journal Entries Prototype Scope

Include in first prototype:

- journal format
- cash purchase
- bank expense
- cash sale
- capital by cash
- capital by bank
- drawings by cash
- drawings by bank
- simple asset purchase
- simple loan received
- cash-to-bank business transfer
- bank-to-cash business transfer

Exclude from first prototype:

- GST
- compound adjustments
- complex asset disposal
- partnership admission
- partnership retirement
- goodwill
- share allotment
- share forfeiture
- share reissue
- OCR
- AI-generated checking
- database-backed progress

## 10. First Prototype Acceptance Criteria

The first Journal Entries chapter prototype should be considered acceptable only when:

- the chapter renders serially from introduction through several subtopics
- solved illustrations render with correct format, explanation, and common mistakes
- Practice It Yourself accepts complete journal entries
- students enter particulars and amounts themselves
- checking identifies conceptual mistakes
- checking identifies numerical mistakes
- feedback explains the mistake in Class 11/12-friendly language
- mobile layout is usable with no horizontal page overflow
- existing routes remain intact
- beginner `/practice` remains unchanged
- `/practice/advanced` order/count remains unchanged unless a future task explicitly scopes it
- existing tests pass
- no unsupported scope is exposed accidentally

## 11. Trial Balance as Second Validation Chapter

Trial Balance should follow after the Journal Entries chapter prototype.

It should validate:

- multi-row table interaction
- account-name entry
- debit/credit column placement
- totals
- balancing
- responsive table UX
- checker feedback for missing rows, wrong side, wrong amount, duplicates, wrong totals, and unbalanced trial balance

Safe first Trial Balance candidate:

- 6 to 8 familiar accounts
- no adjustments
- clear debit/credit balances
- simple total match

Deferred Trial Balance complexity:

- adjusted trial balance
- suspense account
- rectification links
- hidden errors not revealed by Trial Balance
- final-account adjustments

## 12. Planning Boundary

This concept map is planning-only.

It does not:

- implement a new route
- implement a new renderer
- implement a new checker
- change existing engines
- change beginner `/practice`
- change `/practice/advanced`
- change the Journal Entry Explainer
- add API routes
- add database/auth/history/progress/payment/backend/AI features
