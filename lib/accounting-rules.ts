import { extractAmounts } from "./amount-parser";
import type { EntryLineSide, PartyRole } from "./types";

export interface PartyDetails {
  partyName: string;
  partyRole: PartyRole;
  partyAccountSide?: EntryLineSide;
}

export interface TransactionRule {
  transaction_type: string;
  patterns: RegExp[];
  debitAccount: string;
  creditAccount: string;
  explanationLogic: string;
  practiceTemplate: (amount: number) => string;
  amountExtractor?: (transactionText: string) => number | null;
  partyExtractor?: (transactionText: string) => PartyDetails | null;
}

const CASH_PAYMENT_PATTERN = "(?:for cash|in cash|by cash|\\bcash\\b)";
const CREDIT_PAYMENT_PATTERN = "(?:on credit|credit|on account)";
const DIGITAL_PAYMENT_PATTERN =
  "(?:upi|google\\s+pay|gpay|phonepe|paytm|neft|rtgs|imps|online\\s+transfer|bank\\s+transfer|debit\\s+card|card\\s+payment|net\\s+banking)";
const BANK_PAYMENT_PATTERN = `(?:through bank|in bank|from bank|by cheque|by check|\\bbank\\b|${DIGITAL_PAYMENT_PATTERN})`;
const PAYMENT_MODE_CLUE_PATTERN = `(?:\\b(?:cash|bank|cheque|check|credit|debtor|customer|creditor|supplier|discount)\\b|${DIGITAL_PAYMENT_PATTERN})`;
const GOODS_ITEM_PATTERN = "(?:goods|mango(?:es)?|apples?|rice|wheat|books?|stationery)";
const NO_EXPLICIT_SALE_MODE_PREFIX = `^(?!.*${PAYMENT_MODE_CLUE_PATTERN})(?!.*\\bto\\b)`;
const NO_EXPLICIT_PURCHASE_MODE_PREFIX = `^(?!.*${PAYMENT_MODE_CLUE_PATTERN})(?!.*\\bfrom\\b)`;
const NO_PAYMENT_MODE_PREFIX = `^(?!.*(?:\\b(?:cash|bank|cheque|check|credit)\\b|${DIGITAL_PAYMENT_PATTERN}))`;
const TRADE_DISCOUNT_PATTERN = "after\\s+discount";
const PARTY_PATTERN = "([a-z][a-z.'-]*)";
const SAFE_PARTY_PATTERN =
  "(?!(?:amount|bad|bank|capital|cash|commission|creditor|creditors|customer|customers|debt|debts|debtor|debtors|drawings|electricity|goods|inr|interest|loan|purchase|purchases|rent|rs|salary|salaries|sale|sales|seller|supplier|suppliers|to)\\b)([a-z][a-z.'-]*)";
const RESERVED_PARTY_WORDS = new Set([
  "account",
  "bank",
  "bad",
  "debt",
  "debts",
  "business",
  "cash",
  "cheque",
  "check",
  "credit",
  "creditor",
  "creditors",
  "customer",
  "customers",
  "debtor",
  "debtors",
  "employee",
  "amount",
  "to",
  "landlord",
  "interest",
  "commission",
  "electricity",
  "loan",
  "owner",
  "proprietor",
  "rs",
  "inr",
  "seller",
  "supplier",
  "suppliers",
]);

function extractTradeDiscountNetAmount(transactionText: string): number | null {
  const amounts = extractAmounts(transactionText);
  return amounts.length >= 3 ? amounts[1] : null;
}

function namedSaleParty(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`(?:sold|sale)\\s+${GOODS_ITEM_PATTERN}\\s+to\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`${GOODS_ITEM_PATTERN}\\s+sold\\s+to\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`sale\\s+of\\s+${GOODS_ITEM_PATTERN}\\s+to\\s+${PARTY_PATTERN}`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "debtor", partyAccountSide: "debit" } : null;
}

function namedSaleCustomer(transactionText: string): PartyDetails | null {
  const partyName = namedSaleParty(transactionText)?.partyName;
  return partyName ? { partyName, partyRole: "customer" } : null;
}

function namedPurchaseParty(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`(?:purchase|purchased|bought)\\s+${GOODS_ITEM_PATTERN}\\s+from\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`${GOODS_ITEM_PATTERN}\\s+purchased\\s+from\\s+${PARTY_PATTERN}`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "creditor", partyAccountSide: "credit" } : null;
}

function namedPurchaseSupplier(transactionText: string): PartyDetails | null {
  const partyName = namedPurchaseParty(transactionText)?.partyName;
  return partyName ? { partyName, partyRole: "supplier" } : null;
}

function namedAssetSupplier(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`(?:purchase|purchased|bought)\\s+\\w+(?:\\s+\\w+)?\\s+from\\s+${PARTY_PATTERN}`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "supplier" } : null;
}

function namedAssetCreditor(transactionText: string): PartyDetails | null {
  const partyName = namedAssetSupplier(transactionText)?.partyName;
  return partyName ? { partyName, partyRole: "creditor", partyAccountSide: "credit" } : null;
}

function namedDebtorReceipt(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`received\\s+.*from\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`^${PARTY_PATTERN}\\s+paid\\s+`, "i"),
    new RegExp(`amount\\s+received\\s+from\\s+${PARTY_PATTERN}`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "debtor", partyAccountSide: "credit" } : null;
}

function namedCreditorPayment(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`paid\\s+.*to\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`paid\\s+creditors?\\s+${PARTY_PATTERN}`, "i"),
    new RegExp(`paid\\s+${PARTY_PATTERN}\\s+`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "creditor", partyAccountSide: "debit" } : null;
}

function namedBadDebtDebtor(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`^${SAFE_PARTY_PATTERN}\\s+became\\s+insolvent`, "i"),
    new RegExp(`bad\\s+debts?\\s+written\\s+off\\s+from\\s+${SAFE_PARTY_PATTERN}`, "i"),
    new RegExp(`^${SAFE_PARTY_PATTERN}(?:['’]s)?\\s+debt\\s+written\\s+off`, "i"),
    new RegExp(`amount\\s+due\\s+from\\s+${SAFE_PARTY_PATTERN}\\s+written\\s+off`, "i"),
    new RegExp(`^${SAFE_PARTY_PATTERN}\\s+could\\s+not\\s+pay`, "i"),
    new RegExp(`^${SAFE_PARTY_PATTERN}\\s+declared\\s+insolvent`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "debtor", partyAccountSide: "credit" } : null;
}

function namedBadDebtRecoveryParty(transactionText: string): PartyDetails | null {
  const partyName = extractPartyName(transactionText, [
    new RegExp(`bad\\s+debts?\\s+recovered\\s+from\\s+${SAFE_PARTY_PATTERN}`, "i"),
    new RegExp(`previously\\s+written\\s+off\\s+bad\\s+debts?\\s+recovered\\s+from\\s+${SAFE_PARTY_PATTERN}`, "i"),
    new RegExp(`^${SAFE_PARTY_PATTERN}\\s+paid\\s+.*against\\s+bad\\s+debts?\\s+previously\\s+written\\s+off`, "i"),
  ]);

  return partyName ? { partyName, partyRole: "debtor" } : null;
}

function extractPartyName(transactionText: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = pattern.exec(transactionText);
    const rawName = match?.[1];
    if (!rawName) continue;

    const partyName = rawName.replace(/[.,]/g, "").trim();
    if (partyName && !RESERVED_PARTY_WORDS.has(partyName.toLowerCase())) {
      return titleCase(partyName);
    }
  }

  return null;
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

const depreciationAssetItems = [
  { term: "machinery", account: "Machinery" },
  { term: "furniture", account: "Furniture" },
  { term: "computers?", account: "Computer" },
  { term: "equipment", account: "Equipment" },
  { term: "vehicles?", account: "Vehicle" },
] as const;

const depreciationRules: TransactionRule[] = depreciationAssetItems.map(({ term, account }) => ({
  transaction_type: `depreciation_${account.toLowerCase()}`,
  patterns: [
    new RegExp(`depreciation\\s+(?:charged|provided)\\s+on\\s+${term}\\b`, "i"),
    new RegExp(`depreciation\\s+on\\s+${term}\\b`, "i"),
    new RegExp(`${term}\\s+depreciated\\s+by\\b`, "i"),
  ],
  debitAccount: "Depreciation",
  creditAccount: account,
  explanationLogic: `Depreciation is an expense or loss, so Depreciation is debited. ${account} value decreases, so ${account} is credited.`,
  practiceTemplate: (amount) => `Depreciation charged on ${account.toLowerCase()} ₹${amount}.`,
}));

const namedPartyPaymentStart = `(?!amount\\b|bank\\b|cash\\b|rs\\.?\\b|inr\\b|creditors?\\b|rent\\b|salary\\b|salaries\\b|interest\\b|electricity\\b|loan\\b|to\\b)${PARTY_PATTERN}`;

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
    partyExtractor: namedAssetSupplier,
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
    partyExtractor: namedAssetCreditor,
  },
]);

const namedDebtorReceiptRules: TransactionRule[] = [
  {
    transaction_type: "received_from_named_debtor_bank",
    patterns: [
      new RegExp(`received\\s+.*from\\s+${SAFE_PARTY_PATTERN}.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+paid\\s+.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`amount\\s+received\\s+from\\s+${SAFE_PARTY_PATTERN}.*${BANK_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Bank",
    creditAccount: "Debtor",
    explanationLogic:
      "Bank increases when money is received through bank or digital payment. The named debtor balance reduces, so the party account is credited.",
    practiceTemplate: (amount) => `Received from debtor through bank ₹${amount}.`,
    partyExtractor: namedDebtorReceipt,
  },
  {
    transaction_type: "received_from_named_debtor",
    patterns: [
      new RegExp(`received\\s+.*cash.*from\\s+${SAFE_PARTY_PATTERN}`, "i"),
      new RegExp(`received\\s+.*from\\s+${SAFE_PARTY_PATTERN}.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+paid\\s+.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`amount\\s+received\\s+from\\s+${SAFE_PARTY_PATTERN}.*${CASH_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Cash",
    creditAccount: "Debtor",
    explanationLogic:
      "Cash increases when money is received. The named debtor balance reduces, so the party account is credited.",
    practiceTemplate: (amount) => `Received from debtor in cash ₹${amount}.`,
    partyExtractor: namedDebtorReceipt,
  },
];

const namedCreditorPaymentRules: TransactionRule[] = [
  {
    transaction_type: "paid_named_creditor_bank",
    patterns: [
      new RegExp(`paid\\s+.*to\\s+${SAFE_PARTY_PATTERN}.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid\\s+creditors?\\s+${SAFE_PARTY_PATTERN}.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid\\s+${namedPartyPaymentStart}.*${BANK_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Creditor",
    creditAccount: "Bank",
    explanationLogic:
      "Paying a named creditor reduces the liability, so the party account is debited. Bank decreases because payment is made through bank or digital payment, so Bank is credited.",
    practiceTemplate: (amount) => `Paid creditor through bank ₹${amount}.`,
    partyExtractor: namedCreditorPayment,
  },
  {
    transaction_type: "paid_named_creditor",
    patterns: [
      new RegExp(`paid\\s+.*cash.*to\\s+${SAFE_PARTY_PATTERN}`, "i"),
      new RegExp(`paid\\s+.*to\\s+${SAFE_PARTY_PATTERN}.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid\\s+creditors?\\s+${SAFE_PARTY_PATTERN}.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid\\s+${namedPartyPaymentStart}.*${CASH_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Creditor",
    creditAccount: "Cash",
    explanationLogic:
      "Paying a named creditor reduces the liability, so the party account is debited. Cash decreases because cash is paid out, so Cash is credited.",
    practiceTemplate: (amount) => `Paid creditor in cash ₹${amount}.`,
    partyExtractor: namedCreditorPayment,
  },
];

const badDebtWrittenOffRules: TransactionRule[] = [
  {
    transaction_type: "bad_debts_named_written_off",
    patterns: [
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+became\\s+insolvent.*bad\\s+debts?`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+became\\s+insolvent.*written\\s+off.*bad\\s+debts?`, "i"),
      new RegExp(`bad\\s+debts?\\s+written\\s+off\\s+from\\s+${SAFE_PARTY_PATTERN}`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}(?:['’]s)?\\s+debt\\s+written\\s+off`, "i"),
      new RegExp(`amount\\s+due\\s+from\\s+${SAFE_PARTY_PATTERN}\\s+written\\s+off`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+could\\s+not\\s+pay.*written\\s+off.*bad\\s+debts?`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+declared\\s+insolvent.*written\\s+off`, "i"),
    ],
    debitAccount: "Bad Debts",
    creditAccount: "Debtor",
    explanationLogic:
      "Bad debt is a loss, so Bad Debts is debited. The named debtor account is credited because the receivable is reduced.",
    practiceTemplate: (amount) => `Raju became insolvent and ${formatRuleRupees(amount)} became bad debt.`,
    partyExtractor: namedBadDebtDebtor,
  },
  {
    transaction_type: "bad_debts_written_off",
    patterns: [
      /bad debts?\s+written\s+off/i,
      /bad debts?.*written\s+off/i,
      /debtors?\s+became\s+bad\s+debts?/i,
      /amount\s+due\s+from\s+debtors?\s+written\s+off/i,
    ],
    debitAccount: "Bad Debts",
    creditAccount: "Debtor",
    explanationLogic:
      "Bad debt is a loss, so Bad Debts is debited. Debtor is credited because the receivable is reduced.",
    practiceTemplate: (amount) => `Bad debts written off ${formatRuleRupees(amount)}.`,
  },
];

const badDebtRecoveredRules: TransactionRule[] = [
  {
    transaction_type: "bad_debts_recovered_bank",
    patterns: [
      new RegExp(`bad\\s+debts?\\s+recovered.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`recovered\\s+bad\\s+debts?.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`previously\\s+written\\s+off\\s+bad\\s+debts?\\s+recovered.*${BANK_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Bank",
    creditAccount: "Bad Debts Recovered",
    explanationLogic:
      "Bank increases because the recovery is received through bank or digital payment. Bad Debts Recovered is an income or gain, so it is credited.",
    practiceTemplate: (amount) => `Bad debts recovered ${formatRuleRupees(amount)} through bank.`,
    partyExtractor: namedBadDebtRecoveryParty,
  },
  {
    transaction_type: "bad_debts_recovered_cash",
    patterns: [
      new RegExp(`bad\\s+debts?\\s+recovered.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`recovered\\s+bad\\s+debts?.*${CASH_PAYMENT_PATTERN}`, "i"),
      /cash\s+received\s+for\s+bad\s+debts?\s+recovered/i,
      new RegExp(`previously\\s+written\\s+off\\s+bad\\s+debts?\\s+recovered.*${CASH_PAYMENT_PATTERN}`, "i"),
      new RegExp(`^${SAFE_PARTY_PATTERN}\\s+paid\\s+.*against\\s+bad\\s+debts?\\s+previously\\s+written\\s+off`, "i"),
    ],
    debitAccount: "Cash",
    creditAccount: "Bad Debts Recovered",
    explanationLogic:
      "Cash increases because cash is received. Bad Debts Recovered is an income or gain, so it is credited.",
    practiceTemplate: (amount) => `Bad debts recovered ${formatRuleRupees(amount)} in cash.`,
    partyExtractor: namedBadDebtRecoveryParty,
  },
];

function formatRuleRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

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
    partyExtractor: namedSaleParty,
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
    partyExtractor: namedPurchaseParty,
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
      new RegExp(`started .*business.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`commenced .*business.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`(introduced|invested|brought).*capital.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`(owner|proprietor).*invested.*${BANK_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Bank",
    creditAccount: "Capital",
    explanationLogic:
      "Bank balance is an asset and it is increasing, so Bank is debited. Capital increases because the owner invested money, so Capital is credited.",
    practiceTemplate: (amount) => `Started business with ₹${amount} in bank.`,
  },
  ...depreciationRules,
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
    patterns: [new RegExp(`(bought|purchased).*machinery.*${BANK_PAYMENT_PATTERN}`, "i")],
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
    partyExtractor: namedPurchaseSupplier,
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
    partyExtractor: namedPurchaseSupplier,
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
    partyExtractor: namedPurchaseParty,
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
    partyExtractor: namedPurchaseParty,
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
    partyExtractor: namedSaleCustomer,
  },
  {
    transaction_type: "sold_goods_bank",
    patterns: [
      new RegExp(`sold\\s+${GOODS_ITEM_PATTERN}\\s+to\\s+\\w+.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`${GOODS_ITEM_PATTERN}\\s+sold\\s+to\\s+\\w+.*${BANK_PAYMENT_PATTERN}`, "i"),
    ],
    debitAccount: "Bank",
    creditAccount: "Sales",
    explanationLogic:
      "Bank increases because money is received through bank or digital payment. Sales revenue increases, so Sales is credited.",
    practiceTemplate: (amount) => `Sold goods through bank ₹${amount}.`,
    partyExtractor: namedSaleCustomer,
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
    partyExtractor: namedSaleParty,
  },
  goodsConventionRules[1],
  goodsConventionRules[0],
  {
    transaction_type: "paid_rent_bank",
    patterns: [
      new RegExp(`paid .*rent.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`rent.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`paid .*(salary|salaries).*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`(salary|salaries).*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`(staff|employee) salary.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`received .*commission.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`commission.*received.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`received .*commission income.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`commission.*earned.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`(owner|proprietor).*withdr(ew|awn|aw).*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`drawings?.*${BANK_PAYMENT_PATTERN}`, "i"),
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
  ...badDebtRecoveredRules,
  ...badDebtWrittenOffRules,
  ...namedCreditorPaymentRules,
  {
    transaction_type: "paid_creditor_bank",
    patterns: [
      new RegExp(`paid .*to .*creditors?.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid .*creditors?.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`amount.*paid.*creditors?.*${BANK_PAYMENT_PATTERN}`, "i"),
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
  ...namedDebtorReceiptRules,
  {
    transaction_type: "received_from_debtor_bank",
    patterns: [
      new RegExp(`received .*from .*debtors?.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`received .*debtors?.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`debtors?.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`amount.*received.*debtors?.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`took .*loan.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`loan.*taken.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`received .*loan.*${BANK_PAYMENT_PATTERN}`, "i"),
      /bank loan.*(received|credited)/i,
      new RegExp(`loan.*amount.*received.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`loan.*received.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`borrowed .*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`repaid .*loan.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`loan.*repaid.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`^(?!.*interest).*paid .*loan.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`loan.*repayment.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid .*towards loan.*${BANK_PAYMENT_PATTERN}`, "i"),
      /bank.*paid.*loan.*repayment/i,
      new RegExp(`loan.*amount.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`paid .*interest.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`interest.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`paid .*interest expense.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`interest on loan.*paid.*${BANK_PAYMENT_PATTERN}`, "i"),
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
      new RegExp(`received .*interest.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`interest.*received.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`received .*interest income.*${BANK_PAYMENT_PATTERN}`, "i"),
      new RegExp(`interest.*earned.*${BANK_PAYMENT_PATTERN}`, "i"),
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
