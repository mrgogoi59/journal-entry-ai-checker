import { extractAmounts } from "./amount-parser";

export interface TransactionRule {
  transaction_type: string;
  patterns: RegExp[];
  debitAccount: string;
  creditAccount: string;
  explanationLogic: string;
  practiceTemplate: (amount: number) => string;
  amountExtractor?: (transactionText: string) => number | null;
}

const CASH_PAYMENT_PATTERN = "(?:for cash|in cash|by cash|\\bcash\\b)";
const CREDIT_PAYMENT_PATTERN = "(?:on credit|credit|on account)";
const GOODS_ITEM_PATTERN = "(?:goods|mango(?:es)?|apples?|rice|wheat|books?|stationery)";
const NO_EXPLICIT_SALE_MODE_PREFIX =
  "^(?!.*\\b(?:cash|bank|cheque|check|credit|debtor|customer|discount)\\b)(?!.*\\bto\\b)";
const NO_EXPLICIT_PURCHASE_MODE_PREFIX =
  "^(?!.*\\b(?:cash|bank|cheque|check|credit|creditor|supplier|discount)\\b)(?!.*\\bfrom\\b)";
const NO_PAYMENT_MODE_PREFIX = "^(?!.*\\b(?:cash|bank|cheque|check|credit)\\b)";
const TRADE_DISCOUNT_PATTERN = "after\\s+discount";

function extractTradeDiscountNetAmount(transactionText: string): number | null {
  const amounts = extractAmounts(transactionText);
  return amounts.length >= 3 ? amounts[1] : null;
}

const assetItems = [
  { term: "machinery", account: "Machinery" },
  {
    term: "(?:furniture|tables?|chairs?|desks?|almirah|cupboard|bookshelf|office\\s+tables?|office\\s+chairs?)",
    account: "Furniture",
  },
  { term: "computers?", account: "Computer" },
  { term: "vehicles?", account: "Vehicle" },
  { term: "equipment", account: "Equipment" },
] as const;

const namedAssetPurchaseRules: TransactionRule[] = assetItems.flatMap(({ term, account }) => [
  {
    transaction_type: `asset_purchase_${account.toLowerCase()}_cash`,
    patterns: [
      new RegExp(`(?:purchase|purchased|bought)\\s+${term}\\s+from\\s+\\w+.*${CASH_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: account,
    creditAccount: "Cash",
    explanationLogic: `${account} is an asset and it is increasing, so ${account} is debited. Cash decreases because payment is made immediately, so Cash is credited.`,
    practiceTemplate: (amount) => `Bought ${account.toLowerCase()} from seller for cash ₹${amount}.`,
  },
  {
    transaction_type: `asset_purchase_${account.toLowerCase()}_credit`,
    patterns: [
      new RegExp(`(?:purchase|purchased|bought)\\s+${term}\\s+from\\s+\\w+.*${CREDIT_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: account,
    creditAccount: "Creditor",
    explanationLogic: `${account} is an asset and it is increasing, so ${account} is debited. The seller is owed money, so Creditor is credited.`,
    practiceTemplate: (amount) => `Bought ${account.toLowerCase()} from seller on credit ₹${amount}.`,
  },
]);

const tradeDiscountRules: TransactionRule[] = [
  {
    transaction_type: "trade_discount_cash_sale",
    patterns: [
      new RegExp(`goods\\s+worth\\s+.*sold.*(?:for cash|in cash).*${TRADE_DISCOUNT_PATTERN}`, "i"),
      new RegExp(`sold\\s+goods\\s+worth\\s+.*for cash.*${TRADE_DISCOUNT_PATTERN}`, "i"),
    ],
    debitAccount: "Cash",
    creditAccount: "Sales",
    explanationLogic:
      "This is a trade-discount sale, so only the net sale value is recorded. Cash increases, so Cash is debited. Sales income increases, so Sales is credited.",
    practiceTemplate: (amount) => `Goods worth ₹${amount + 100} sold for cash ₹${amount} after discount ₹100.`,
    amountExtractor: extractTradeDiscountNetAmount,
  },
  {
    transaction_type: "trade_discount_credit_sale",
    patterns: [
      new RegExp(`goods\\s+worth\\s+.*sold\\s+to\\s+\\w+\\s+for\\s+.*${TRADE_DISCOUNT_PATTERN}`, "i"),
      new RegExp(`sold\\s+goods\\s+worth\\s+.*to\\s+\\w+\\s+for\\s+.*${TRADE_DISCOUNT_PATTERN}`, "i"),
    ],
    debitAccount: "Debtor",
    creditAccount: "Sales",
    explanationLogic:
      "This is a trade-discount credit sale, so only the net sale value is recorded. The customer owes money, so Debtor is debited. Sales income increases, so Sales is credited.",
    practiceTemplate: (amount) => `Goods worth ₹${amount + 100} sold to customer for ₹${amount} after discount ₹100.`,
    amountExtractor: extractTradeDiscountNetAmount,
  },
  {
    transaction_type: "trade_discount_cash_purchase",
    patterns: [
      new RegExp(`goods\\s+worth\\s+.*(?:purchase|purchased|bought).*${CASH_PAYMENT_PATTERN}.*${TRADE_DISCOUNT_PATTERN}`, "i"),
      new RegExp(`(?:purchase|purchased|bought)\\s+goods\\s+worth\\s+.*${CASH_PAYMENT_PATTERN}.*${TRADE_DISCOUNT_PATTERN}`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Cash",
    explanationLogic:
      "This is a trade-discount purchase, so only the net purchase value is recorded. Purchases is debited and Cash is credited because payment is made immediately.",
    practiceTemplate: (amount) => `Goods worth ₹${amount + 100} purchased for cash ₹${amount} after discount ₹100.`,
    amountExtractor: extractTradeDiscountNetAmount,
  },
  {
    transaction_type: "trade_discount_credit_purchase",
    patterns: [
      new RegExp(`goods\\s+worth\\s+.*(?:purchase|purchased|bought)\\s+from\\s+\\w+\\s+for\\s+.*${TRADE_DISCOUNT_PATTERN}`, "i"),
      new RegExp(`(?:purchase|purchased|bought)\\s+goods\\s+worth\\s+.*from\\s+\\w+\\s+for\\s+.*${TRADE_DISCOUNT_PATTERN}`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Creditor",
    explanationLogic:
      "This is a trade-discount credit purchase, so only the net purchase value is recorded. Purchases is debited and Creditor is credited because the supplier is owed money.",
    practiceTemplate: (amount) => `Goods worth ₹${amount + 100} purchased from supplier for ₹${amount} after discount ₹100.`,
    amountExtractor: extractTradeDiscountNetAmount,
  },
];

const goodsConventionRules: TransactionRule[] = [
  {
    transaction_type: "assumed_cash_goods_sale",
    patterns: [
      new RegExp(`${NO_EXPLICIT_SALE_MODE_PREFIX}.*sold\\s+${GOODS_ITEM_PATTERN}(?:\\s+for)?\\s+`, "i"),
      new RegExp(`${NO_EXPLICIT_SALE_MODE_PREFIX}.*${GOODS_ITEM_PATTERN}\\s+sold\\s+`, "i"),
      new RegExp(`${NO_EXPLICIT_SALE_MODE_PREFIX}.*sale\\s+of\\s+${GOODS_ITEM_PATTERN}\\s+`, "i"),
    ],
    debitAccount: "Cash",
    creditAccount: "Sales",
    explanationLogic:
      "Assumption used: Since no payment mode was mentioned, this was treated as a cash sale based on beginner journal-entry convention. Cash increases, so Cash is debited. Sales income increases, so Sales is credited.",
    practiceTemplate: (amount) => `Sold goods ₹${amount}.`,
  },
  {
    transaction_type: "assumed_credit_named_goods_sale",
    patterns: [
      new RegExp(`${NO_PAYMENT_MODE_PREFIX}.*sold\\s+${GOODS_ITEM_PATTERN}\\s+to\\s+\\w+`, "i"),
      new RegExp(`${NO_PAYMENT_MODE_PREFIX}.*${GOODS_ITEM_PATTERN}\\s+sold\\s+to\\s+\\w+`, "i"),
      new RegExp(`${NO_PAYMENT_MODE_PREFIX}.*sale\\s+of\\s+${GOODS_ITEM_PATTERN}\\s+to\\s+\\w+`, "i"),
    ],
    debitAccount: "Debtor",
    creditAccount: "Sales",
    explanationLogic:
      "Assumption used: Since a person/customer is mentioned, this was treated as a credit sale. Debtor increases, so Debtor is debited. Sales income increases, so Sales is credited.",
    practiceTemplate: (amount) => `Sold goods to customer ₹${amount}.`,
  },
  {
    transaction_type: "assumed_cash_goods_purchase",
    patterns: [
      new RegExp(`${NO_EXPLICIT_PURCHASE_MODE_PREFIX}.*(?:purchase|purchased|bought)\\s+${GOODS_ITEM_PATTERN}\\s+`, "i"),
      new RegExp(`${NO_EXPLICIT_PURCHASE_MODE_PREFIX}.*${GOODS_ITEM_PATTERN}\\s+purchased\\s+`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Cash",
    explanationLogic:
      "Assumption used: Since no payment mode was mentioned, this was treated as a cash purchase based on beginner journal-entry convention. Purchases is debited and Cash is credited.",
    practiceTemplate: (amount) => `Purchased goods ₹${amount}.`,
  },
  {
    transaction_type: "assumed_credit_named_goods_purchase",
    patterns: [
      new RegExp(`${NO_PAYMENT_MODE_PREFIX}.*(?:purchase|purchased|bought)\\s+${GOODS_ITEM_PATTERN}\\s+from\\s+\\w+`, "i"),
      new RegExp(`${NO_PAYMENT_MODE_PREFIX}.*${GOODS_ITEM_PATTERN}\\s+purchased\\s+from\\s+\\w+`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Creditor",
    explanationLogic:
      "Assumption used: Since a supplier/person is mentioned, this was treated as a credit purchase. Purchases is debited and Creditor is credited because the supplier is owed money.",
    practiceTemplate: (amount) => `Purchased goods from supplier ₹${amount}.`,
  },
];

export const transactionRules: TransactionRule[] = [
  {
    transaction_type: "capital_introduced_cash",
    patterns: [
      /started .*business.*cash/i,
      /started .*business.*with .*cash/i,
      /commenced .*business.*cash/i,
      /(introduced|invested|brought).*capital.*cash/i,
      /(owner|proprietor).*invest(s|ed)?.*cash.*business/i,
      /(owner|proprietor).*introduced.*cash.*business/i,
      /(owner|proprietor).*introduced.*capital.*cash/i,
      /capital.*introduced.*cash/i,
      /capital.*introduced.*owner.*cash/i,
      /(owner|proprietor).*deposited.*business.*capital/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Capital",
    explanationLogic:
      "Cash is an asset and it is increasing, so Cash is debited. Capital is increasing because the owner invested money, so Capital is credited.",
    practiceTemplate: (amount) => `Started business with ₹${amount} cash.`,
  },
  {
    transaction_type: "started_business_bank",
    patterns: [
      /started .*business.*(bank|cheque|check)/i,
      /commenced .*business.*(bank|cheque|check)/i,
      /(introduced|invested|brought).*capital.*(bank|cheque|check)/i,
      /(owner|proprietor).*invested.*(bank|cheque|check)/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Capital",
    explanationLogic:
      "Bank balance is an asset and it is increasing, so Bank is debited. Capital increases because the owner invested money, so Capital is credited.",
    practiceTemplate: (amount) => `Started business with ₹${amount} in bank.`,
  },
  ...namedAssetPurchaseRules,
  ...tradeDiscountRules,
  {
    transaction_type: "bought_furniture_cash",
    patterns: [/(bought|purchased).*furniture.*cash/i],
    debitAccount: "Furniture",
    creditAccount: "Cash",
    explanationLogic:
      "Furniture is an asset and it is increasing, so Furniture is debited. Cash decreases, so Cash is credited.",
    practiceTemplate: (amount) => `Bought furniture for cash ₹${amount}.`,
  },
  {
    transaction_type: "bought_machinery_cheque",
    patterns: [/(bought|purchased).*machinery.*(cheque|check|bank)/i],
    debitAccount: "Machinery",
    creditAccount: "Bank",
    explanationLogic:
      "Machinery is an asset and it is increasing, so Machinery is debited. Payment by cheque reduces Bank, so Bank is credited.",
    practiceTemplate: (amount) => `Bought machinery by cheque ₹${amount}.`,
  },
  {
    transaction_type: "bought_goods_cash",
    patterns: [
      /(bought|purchase|purchased|purchases).*goods.*cash/i,
      /goods.*(purchase|purchased|purchases).*cash/i,
      /cash purchase(s)?/i,
    ],
    debitAccount: "Purchases",
    creditAccount: "Cash",
    explanationLogic:
      "Goods bought for resale are recorded as Purchases. Cash decreases because payment is made, so Cash is credited.",
    practiceTemplate: (amount) => `Bought goods for cash ₹${amount}.`,
  },
  goodsConventionRules[2],
  goodsConventionRules[3],
  {
    transaction_type: "named_goods_purchase_cash",
    patterns: [
      new RegExp(`(?:purchase|purchased|bought)\\s+${GOODS_ITEM_PATTERN}\\s+from\\s+\\w+.*${CASH_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Cash",
    explanationLogic:
      "Goods bought for resale are recorded as Purchases. Cash decreases because payment is made immediately, so Cash is credited.",
    practiceTemplate: (amount) => `Bought goods from seller for cash ₹${amount}.`,
  },
  {
    transaction_type: "bought_goods_credit",
    patterns: [
      /(bought|purchased).*goods.*(credit|from|on account)/i,
      /credit purchase(s)?/i,
    ],
    debitAccount: "Purchases",
    creditAccount: "Creditor",
    explanationLogic:
      "Purchases increase, so Purchases is debited. The amount is owed to the supplier, so Creditor is credited.",
    practiceTemplate: (amount) => `Bought goods on credit ₹${amount}.`,
  },
  {
    transaction_type: "named_goods_purchase_credit",
    patterns: [
      new RegExp(`(?:purchase|purchased|bought)\\s+${GOODS_ITEM_PATTERN}\\s+from\\s+\\w+.*${CREDIT_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Purchases",
    creditAccount: "Creditor",
    explanationLogic:
      "Goods bought for resale are recorded as Purchases. The seller is owed money, so Creditor is credited.",
    practiceTemplate: (amount) => `Bought goods from seller on credit ₹${amount}.`,
  },
  {
    transaction_type: "sold_goods_cash",
    patterns: [
      /(sold|sale).*goods.*(for cash|in cash|by cash|cash)/i,
      /goods.*sold.*(for cash|in cash|by cash|cash)/i,
      /cash sale(s)?/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Sales",
    explanationLogic:
      "Cash increases because money is received, so Cash is debited. Sales revenue increases, so Sales is credited.",
    practiceTemplate: (amount) => `Sold goods for cash ₹${amount}.`,
  },
  {
    transaction_type: "sold_goods_credit",
    patterns: [
      /sold .*goods.*(on credit|credit|to debtor|to customer|on account)/i,
      /goods.*sold.*(on credit|credit|to debtor|to customer|on account)/i,
      /credit sale(s)?/i,
    ],
    debitAccount: "Debtor",
    creditAccount: "Sales",
    explanationLogic:
      "The customer owes money, so Debtor is debited. Sales revenue increases, so Sales is credited.",
    practiceTemplate: (amount) => `Sold goods on credit ₹${amount}.`,
  },
  goodsConventionRules[1],
  goodsConventionRules[0],
  {
    transaction_type: "paid_rent_bank",
    patterns: [
      /paid .*rent.*(through bank|by cheque|by check|\bbank\b)/i,
      /rent.*paid.*(through bank|by cheque|by check|\bbank\b)/i,
    ],
    debitAccount: "Rent Expense",
    creditAccount: "Bank",
    explanationLogic:
      "Rent is an expense and expenses are debited. Bank decreases because payment is made through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Paid rent ₹${amount} through bank.`,
  },
  {
    transaction_type: "paid_rent",
    patterns: [
      /paid .*rent.*(in cash|by cash|\bcash\b)/i,
      /rent.*paid.*(in cash|by cash|\bcash\b)/i,
    ],
    debitAccount: "Rent Expense",
    creditAccount: "Cash",
    explanationLogic:
      "Rent is an expense and expenses are debited. Cash decreases because it is paid out, so Cash is credited.",
    practiceTemplate: (amount) => `Paid rent ₹${amount} in cash.`,
  },
  {
    transaction_type: "paid_salary_bank",
    patterns: [
      /paid .*(salary|salaries).*(through bank|by cheque|by check|\bbank\b)/i,
      /(salary|salaries).*paid.*(through bank|by cheque|by check|\bbank\b)/i,
      /(staff|employee) salary.*paid.*(through bank|by cheque|by check|\bbank\b)/i,
    ],
    debitAccount: "Salary Expense",
    creditAccount: "Bank",
    explanationLogic:
      "Salary is an expense and expenses are debited. Bank decreases because payment is made through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Paid salary ₹${amount} through bank.`,
  },
  {
    transaction_type: "paid_salary",
    patterns: [
      /paid .*(salary|salaries).*(in cash|by cash|\bcash\b)/i,
      /(salary|salaries).*paid.*(in cash|by cash|\bcash\b)/i,
      /(staff|employee) salary.*paid.*(in cash|by cash|\bcash\b)/i,
    ],
    debitAccount: "Salary Expense",
    creditAccount: "Cash",
    explanationLogic:
      "Salary is an expense and expenses are debited. Cash decreases because it is paid out, so Cash is credited.",
    practiceTemplate: (amount) => `Paid salary ₹${amount} in cash.`,
  },
  {
    transaction_type: "commission_received_bank",
    patterns: [
      /received .*commission.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /commission.*received.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /received .*commission income.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /commission.*earned.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /bank.*received.*commission/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Commission Income",
    explanationLogic:
      "Bank increases because commission is received through bank. Commission received is income, so Commission Income is credited.",
    practiceTemplate: (amount) => `Received commission ₹${amount} through bank.`,
  },
  {
    transaction_type: "commission_received_cash",
    patterns: [
      /received .*commission.*(in cash|by cash|\bcash\b)/i,
      /commission.*received.*(in cash|by cash|\bcash\b)/i,
      /received .*commission income.*(in cash|by cash|\bcash\b)/i,
      /commission.*earned.*(in cash|by cash|\bcash\b)/i,
      /cash.*received.*commission/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Commission Income",
    explanationLogic:
      "Cash increases because commission is received in cash. Commission received is income, so Commission Income is credited.",
    practiceTemplate: (amount) => `Received commission ₹${amount} in cash.`,
  },
  {
    transaction_type: "deposited_cash_bank",
    patterns: [
      /deposited .*cash.*(into bank|in bank|\bbank\b)/i,
      /cash deposited.*(into bank|in bank|\bbank\b)/i,
      /deposit .*cash.*(into bank|in bank|\bbank\b)/i,
      /deposited .*(into bank|in bank|\bbank\b)/i,
      /cash paid.*(into bank|in bank|\bbank\b)/i,
      /paid cash.*(into bank|in bank|\bbank\b)/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Cash",
    explanationLogic:
      "Bank increases when cash is deposited, so Bank is debited. Cash on hand decreases, so Cash is credited.",
    practiceTemplate: (amount) => `Deposited cash into bank ₹${amount}.`,
  },
  {
    transaction_type: "owner_drawings_bank",
    patterns: [
      /(owner|proprietor).*withdr(ew|awn|aw).*from bank/i,
      /(owner|proprietor).*withdr(ew|awn|aw).*by (cheque|check)/i,
      /drawings?.*(through bank|by cheque|by check|\bbank\b)/i,
    ],
    debitAccount: "Drawings",
    creditAccount: "Bank",
    explanationLogic:
      "Owner withdrawals are Drawings, so Drawings is debited. Bank decreases because the owner withdrew through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Owner withdrew from bank for personal use ₹${amount}.`,
  },
  {
    transaction_type: "withdrew_cash_bank",
    patterns: [
      /withdr(ew|awn|aw).*cash.*bank/i,
      /cash withdrawn.*(from bank|\bbank\b)/i,
      /withdr(ew|awn|aw).*from bank/i,
      /cash withdrawn.*(business|office)/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Bank",
    explanationLogic:
      "Cash on hand increases when money is withdrawn from bank, so Cash is debited. Bank decreases, so Bank is credited.",
    practiceTemplate: (amount) => `Withdraw cash from bank ₹${amount}.`,
  },
  {
    transaction_type: "owner_drawings_cash",
    patterns: [
      /(owner|proprietor).*withdr(ew|awn|aw).*cash/i,
      /withdr(ew|awn|aw).*cash.*personal use/i,
      /cash withdrawn by (owner|proprietor)/i,
      /(owner|proprietor).*withdr(ew|awn|aw).*from business/i,
      /drawings?.*(made)?.*cash/i,
      /cash.*personal use/i,
    ],
    debitAccount: "Drawings",
    creditAccount: "Cash",
    explanationLogic:
      "Owner withdrawals are Drawings, so Drawings is debited. Cash decreases, so Cash is credited.",
    practiceTemplate: (amount) => `Owner withdrew cash for personal use ₹${amount}.`,
  },
  {
    transaction_type: "paid_creditor_bank",
    patterns: [
      /paid .*to .*creditors?.*(through bank|by cheque|by check|\bbank\b)/i,
      /paid .*creditors?.*(through bank|by cheque|by check|\bbank\b)/i,
      /amount.*paid.*creditors?.*(through bank|by cheque|by check|\bbank\b)/i,
    ],
    debitAccount: "Creditor",
    creditAccount: "Bank",
    explanationLogic:
      "Paying a creditor reduces the liability, so Creditor is debited. Bank decreases because payment is made through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Paid creditor ₹${amount} through bank.`,
  },
  {
    transaction_type: "paid_creditor",
    patterns: [
      /paid .*cash.*to .*creditors?/i,
      /paid .*to .*creditors?.*(in cash|by cash|\bcash\b)/i,
      /amount.*paid.*creditors?.*(in cash|by cash|\bcash\b)/i,
      /paid .*creditors?.*(in cash|by cash|\bcash\b)/i,
      /paid .*cash.*to .*suppliers?/i,
      /paid .*to .*suppliers?.*(in cash|by cash|\bcash\b)/i,
    ],
    debitAccount: "Creditor",
    creditAccount: "Cash",
    explanationLogic:
      "Paying a creditor reduces the liability, so Creditor is debited. Cash decreases, so Cash is credited.",
    practiceTemplate: (amount) => `Paid creditor ₹${amount} in cash.`,
  },
  {
    transaction_type: "received_from_debtor_bank",
    patterns: [
      /received .*from .*debtors?.*(through bank|by cheque|by check|\bbank\b)/i,
      /received .*debtors?.*(through bank|by cheque|by check|\bbank\b)/i,
      /debtors?.*paid.*(through bank|by cheque|by check|\bbank\b)/i,
      /amount.*received.*debtors?.*(through bank|by cheque|by check|\bbank\b)/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Debtor",
    explanationLogic:
      "Bank increases when money is received through bank. The debtor balance reduces, so Debtor is credited.",
    practiceTemplate: (amount) => `Received from debtor ₹${amount} through bank.`,
  },
  {
    transaction_type: "received_from_debtor",
    patterns: [
      /received .*cash.*from .*debtors?/i,
      /received .*from .*debtors?.*(in cash|by cash|\bcash\b)/i,
      /debtors?.*paid.*(in cash|by cash|\bcash\b)/i,
      /cash.*received.*from .*debtors?/i,
      /amount.*received.*debtors?.*(in cash|by cash|\bcash\b)/i,
      /received .*cash.*from .*customers?/i,
      /received .*from .*customers?.*(in cash|by cash|\bcash\b)/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Debtor",
    explanationLogic:
      "Cash increases when money is received. The debtor balance reduces, so Debtor is credited.",
    practiceTemplate: (amount) => `Received from debtor ₹${amount} in cash.`,
  },
  {
    transaction_type: "loan_taken_cash",
    patterns: [
      /took .*loan.*(in cash|by cash|\bcash\b)/i,
      /loan.*taken.*(in cash|by cash|\bcash\b)/i,
      /received .*loan.*(in cash|by cash|\bcash\b)/i,
      /borrowed .*(in cash|by cash|\bcash\b)/i,
      /loan.*received.*(in cash|by cash|\bcash\b)/i,
      /cash.*received.*as loan/i,
      /borrowed .*cash.*as loan/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Loan",
    explanationLogic:
      "Cash increases because loan money is received. Loan is a liability and increases, so Loan is credited.",
    practiceTemplate: (amount) => `Took loan ₹${amount} in cash.`,
  },
  {
    transaction_type: "loan_taken_bank",
    patterns: [
      /took .*loan.*(through bank|in bank|by cheque|by check|from bank)/i,
      /loan.*taken.*(through bank|in bank|by cheque|by check)/i,
      /received .*loan.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /bank loan.*(received|credited)/i,
      /loan.*amount.*received.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /loan.*received.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /borrowed .*(through bank|in bank|by cheque|by check)/i,
      /loan .*from bank/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Loan",
    explanationLogic:
      "Bank increases because loan money is received through bank. Loan is a liability and increases, so Loan is credited.",
    practiceTemplate: (amount) => `Took loan ₹${amount} through bank.`,
  },
  {
    transaction_type: "loan_repaid_cash",
    patterns: [
      /repaid .*loan.*(in cash|by cash|\bcash\b)/i,
      /loan.*repaid.*(in cash|by cash|\bcash\b)/i,
      /^(?!.*interest).*paid .*loan.*(in cash|by cash|\bcash\b)/i,
      /loan.*repayment.*(in cash|by cash|\bcash\b)/i,
      /paid .*towards loan.*(in cash|by cash|\bcash\b)/i,
      /cash.*paid.*loan.*repayment/i,
      /loan.*amount.*paid.*(in cash|by cash|\bcash\b)/i,
    ],
    debitAccount: "Loan",
    creditAccount: "Cash",
    explanationLogic:
      "Loan liability decreases when it is repaid, so Loan is debited. Cash decreases because payment is made in cash, so Cash is credited.",
    practiceTemplate: (amount) => `Repaid loan ₹${amount} in cash.`,
  },
  {
    transaction_type: "loan_repaid_bank",
    patterns: [
      /repaid .*loan.*(through bank|by cheque|by check)/i,
      /loan.*repaid.*(through bank|by cheque|by check)/i,
      /^(?!.*interest).*paid .*loan.*(through bank|by cheque|by check)/i,
      /loan.*repayment.*(through bank|by cheque|by check)/i,
      /paid .*towards loan.*(through bank|by cheque|by check)/i,
      /bank.*paid.*loan.*repayment/i,
      /loan.*amount.*paid.*(through bank|by cheque|by check)/i,
    ],
    debitAccount: "Loan",
    creditAccount: "Bank",
    explanationLogic:
      "Loan liability decreases when it is repaid, so Loan is debited. Bank decreases because payment is made through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Repaid loan ₹${amount} through bank.`,
  },
  {
    transaction_type: "interest_paid_bank",
    patterns: [
      /paid .*interest.*(through bank|by cheque|by check|\bbank\b)/i,
      /interest.*paid.*(through bank|by cheque|by check|\bbank\b)/i,
      /paid .*interest expense.*(through bank|by cheque|by check|\bbank\b)/i,
      /interest on loan.*paid.*(through bank|by cheque|by check|\bbank\b)/i,
      /bank.*paid.*interest/i,
    ],
    debitAccount: "Interest Expense",
    creditAccount: "Bank",
    explanationLogic:
      "Interest paid is an expense, so Interest Expense is debited. Bank decreases because payment is made through bank, so Bank is credited.",
    practiceTemplate: (amount) => `Paid interest ₹${amount} through bank.`,
  },
  {
    transaction_type: "interest_paid_cash",
    patterns: [
      /paid .*interest.*(in cash|by cash|\bcash\b)/i,
      /interest.*paid.*(in cash|by cash|\bcash\b)/i,
      /paid .*interest expense.*(in cash|by cash|\bcash\b)/i,
      /interest on loan.*paid.*(in cash|by cash|\bcash\b)/i,
      /cash.*paid.*interest/i,
    ],
    debitAccount: "Interest Expense",
    creditAccount: "Cash",
    explanationLogic:
      "Interest paid is an expense, so Interest Expense is debited. Cash decreases because payment is made in cash, so Cash is credited.",
    practiceTemplate: (amount) => `Paid interest ₹${amount} in cash.`,
  },
  {
    transaction_type: "interest_received_bank",
    patterns: [
      /received .*interest.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /interest.*received.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /received .*interest income.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /interest.*earned.*(through bank|in bank|by cheque|by check|\bbank\b)/i,
      /bank.*received.*interest/i,
    ],
    debitAccount: "Bank",
    creditAccount: "Interest Income",
    explanationLogic:
      "Bank increases because interest is received through bank. Interest received is income, so Interest Income is credited.",
    practiceTemplate: (amount) => `Received interest ₹${amount} through bank.`,
  },
  {
    transaction_type: "interest_received_cash",
    patterns: [
      /received .*interest.*(in cash|by cash|\bcash\b)/i,
      /interest.*received.*(in cash|by cash|\bcash\b)/i,
      /received .*interest income.*(in cash|by cash|\bcash\b)/i,
      /interest.*earned.*(in cash|by cash|\bcash\b)/i,
      /cash.*received.*interest/i,
    ],
    debitAccount: "Cash",
    creditAccount: "Interest Income",
    explanationLogic:
      "Cash increases because interest is received in cash. Interest received is income, so Interest Income is credited.",
    practiceTemplate: (amount) => `Received interest ₹${amount} in cash.`,
  },
  {
    transaction_type: "paid_electricity",
    patterns: [/paid .*electricity/i, /electricity bill/i],
    debitAccount: "Electricity Expense",
    creditAccount: "Cash",
    explanationLogic:
      "Electricity is an expense and expenses are debited. Cash decreases because the bill is paid, so Cash is credited.",
    practiceTemplate: (amount) => `Paid electricity bill ₹${amount}.`,
  },
];
