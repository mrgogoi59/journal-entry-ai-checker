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

const outstandingExpenseRules: TransactionRule[] = [
  {
    transaction_type: "outstanding_salary",
    patterns: [
      /salary\s+outstanding/i,
      /outstanding\s+salary/i,
      /salary\s+due\s+but\s+not\s+paid/i,
      /salary\s+payable/i,
      /salary\s+expense\s+outstanding/i,
    ],
    debitAccount: "Salary Expense",
    creditAccount: "Outstanding Salary",
    explanationLogic:
      "Salary expense has been incurred, so Salary Expense is debited. Salary is payable but unpaid, so Outstanding Salary is credited as a liability.",
    practiceTemplate: (amount) => `Salary outstanding ₹${amount}.`,
  },
  {
    transaction_type: "outstanding_rent",
    patterns: [
      /rent\s+outstanding/i,
      /outstanding\s+rent/i,
      /rent\s+due\s+but\s+not\s+paid/i,
      /rent\s+payable/i,
      /rent\s+expense\s+outstanding/i,
    ],
    debitAccount: "Rent Expense",
    creditAccount: "Outstanding Rent",
    explanationLogic:
      "Rent expense has been incurred, so Rent Expense is debited. Rent is payable but unpaid, so Outstanding Rent is credited as a liability.",
    practiceTemplate: (amount) => `Rent outstanding ₹${amount}.`,
  },
  {
    transaction_type: "outstanding_wages",
    patterns: [
      /wages?\s+outstanding/i,
      /outstanding\s+wages?/i,
      /wages?\s+due\s+but\s+not\s+paid/i,
      /wages?\s+payable/i,
    ],
    debitAccount: "Wages Expense",
    creditAccount: "Outstanding Wages",
    explanationLogic:
      "Wages expense has been incurred, so Wages Expense is debited. Wages are payable but unpaid, so Outstanding Wages is credited as a liability.",
    practiceTemplate: (amount) => `Wages outstanding ₹${amount}.`,
  },
  {
    transaction_type: "outstanding_electricity",
    patterns: [
      /electricity\s+bill\s+outstanding/i,
      /electricity\s+outstanding/i,
      /outstanding\s+electricity\s+bill/i,
      /electricity\s+expense\s+outstanding/i,
      /electricity\s+payable/i,
    ],
    debitAccount: "Electricity Expense",
    creditAccount: "Outstanding Electricity",
    explanationLogic:
      "Electricity expense has been incurred, so Electricity Expense is debited. The electricity bill is payable but unpaid, so Outstanding Electricity is credited as a liability.",
    practiceTemplate: (amount) => `Electricity bill outstanding ₹${amount}.`,
  },
  {
    transaction_type: "outstanding_insurance",
    patterns: [
      /insurance\s+outstanding/i,
      /outstanding\s+insurance/i,
      /insurance\s+premium\s+outstanding/i,
      /insurance\s+payable/i,
    ],
    debitAccount: "Insurance Expense",
    creditAccount: "Outstanding Insurance",
    explanationLogic:
      "Insurance expense has been incurred, so Insurance Expense is debited. Insurance is payable but unpaid, so Outstanding Insurance is credited as a liability.",
    practiceTemplate: (amount) => `Insurance outstanding ₹${amount}.`,
  },
];

const prepaidExpenseRules: TransactionRule[] = [
  {
    transaction_type: "prepaid_rent",
    patterns: [
      /prepaid\s+rent/i,
      /rent\s+prepaid/i,
      /rent\s+paid\s+in\s+advance/i,
      /rent\s+paid\s+beforehand/i,
      /advance\s+rent/i,
      /rent\s+expense\s+prepaid/i,
    ],
    debitAccount: "Prepaid Rent",
    creditAccount: "Rent Expense",
    explanationLogic:
      "Rent paid in advance gives future benefit, so Prepaid Rent is debited as an asset. Rent Expense is credited because the current-period expense is reduced.",
    practiceTemplate: (amount) => `Prepaid rent ₹${amount}.`,
  },
  {
    transaction_type: "prepaid_insurance",
    patterns: [
      /prepaid\s+insurance/i,
      /insurance\s+prepaid/i,
      /insurance\s+paid\s+in\s+advance/i,
      /insurance\s+premium\s+prepaid/i,
      /advance\s+insurance/i,
      /insurance\s+expense\s+prepaid/i,
    ],
    debitAccount: "Prepaid Insurance",
    creditAccount: "Insurance Expense",
    explanationLogic:
      "Insurance paid in advance gives future benefit, so Prepaid Insurance is debited as an asset. Insurance Expense is credited because the current-period expense is reduced.",
    practiceTemplate: (amount) => `Prepaid insurance ₹${amount}.`,
  },
  {
    transaction_type: "prepaid_salary",
    patterns: [
      /prepaid\s+salary/i,
      /salary\s+prepaid/i,
      /salary\s+paid\s+in\s+advance/i,
      /advance\s+salary/i,
      /salary\s+expense\s+prepaid/i,
    ],
    debitAccount: "Prepaid Salary",
    creditAccount: "Salary Expense",
    explanationLogic:
      "Salary paid in advance gives future benefit, so Prepaid Salary is debited as an asset. Salary Expense is credited because the current-period expense is reduced.",
    practiceTemplate: (amount) => `Prepaid salary ₹${amount}.`,
  },
  {
    transaction_type: "prepaid_wages",
    patterns: [
      /prepaid\s+wages?/i,
      /wages?\s+prepaid/i,
      /wages?\s+paid\s+in\s+advance/i,
      /advance\s+wages?/i,
      /wages?\s+expense\s+prepaid/i,
    ],
    debitAccount: "Prepaid Wages",
    creditAccount: "Wages Expense",
    explanationLogic:
      "Wages paid in advance give future benefit, so Prepaid Wages is debited as an asset. Wages Expense is credited because the current-period expense is reduced.",
    practiceTemplate: (amount) => `Prepaid wages ₹${amount}.`,
  },
  {
    transaction_type: "prepaid_electricity",
    patterns: [
      /prepaid\s+electricity/i,
      /electricity\s+prepaid/i,
      /electricity\s+bill\s+paid\s+in\s+advance/i,
      /advance\s+electricity/i,
      /electricity\s+expense\s+prepaid/i,
    ],
    debitAccount: "Prepaid Electricity",
    creditAccount: "Electricity Expense",
    explanationLogic:
      "Electricity paid in advance gives future benefit, so Prepaid Electricity is debited as an asset. Electricity Expense is credited because the current-period expense is reduced.",
    practiceTemplate: (amount) => `Prepaid electricity ₹${amount}.`,
  },
];

const accruedIncomeRules: TransactionRule[] = [
  {
    transaction_type: "accrued_interest",
    patterns: [
      /interest\s+accrued/i,
      /accrued\s+interest/i,
      /interest\s+earned\s+but\s+not\s+received/i,
      /interest\s+income\s+accrued/i,
      /interest\s+receivable/i,
      /interest\s+due\s+but\s+not\s+received/i,
    ],
    debitAccount: "Accrued Interest",
    creditAccount: "Interest Income",
    explanationLogic:
      "Interest has been earned but not yet received. Accrued Interest is debited as a receivable asset, and Interest Income is credited because income has increased.",
    practiceTemplate: (amount) => `Interest accrued ₹${amount}.`,
  },
  {
    transaction_type: "accrued_commission",
    patterns: [
      /commission\s+accrued/i,
      /accrued\s+commission/i,
      /commission\s+earned\s+but\s+not\s+received/i,
      /commission\s+income\s+accrued/i,
      /commission\s+receivable/i,
      /commission\s+due\s+but\s+not\s+received/i,
    ],
    debitAccount: "Accrued Commission",
    creditAccount: "Commission Income",
    explanationLogic:
      "Commission has been earned but not yet received. Accrued Commission is debited as a receivable asset, and Commission Income is credited because income has increased.",
    practiceTemplate: (amount) => `Commission accrued ₹${amount}.`,
  },
  {
    transaction_type: "accrued_rent",
    patterns: [
      /rent\s+accrued/i,
      /accrued\s+rent/i,
      /rent\s+earned\s+but\s+not\s+received/i,
      /rent\s+income\s+accrued/i,
      /rent\s+receivable/i,
      /rent\s+due\s+but\s+not\s+received/i,
    ],
    debitAccount: "Accrued Rent",
    creditAccount: "Rent Income",
    explanationLogic:
      "Rent income has been earned but not yet received. Accrued Rent is debited as a receivable asset, and Rent Income is credited because income has increased.",
    practiceTemplate: (amount) => `Rent accrued ₹${amount}.`,
  },
];

const goodsWithdrawnPersonalUseRule: TransactionRule = {
  transaction_type: "goods_withdrawn_personal_use",
  patterns: [
    /goods\s+worth\s+.*withdrawn\s+by\s+(?:proprietor|owner)\s+for\s+personal\s+use/i,
    /(?:proprietor|owner)\s+withdrew\s+goods\s+worth\s+.*for\s+personal\s+use/i,
    /goods\s+.*taken\s+by\s+(?:proprietor|owner)\s+for\s+personal\s+use/i,
    /(?:proprietor|owner)\s+took\s+goods\s+.*for\s+personal\s+use/i,
    /goods\s+withdrawn\s+for\s+personal\s+use/i,
    /goods\s+taken\s+for\s+household\s+use/i,
    /goods\s+taken\s+by\s+proprietor\s+for\s+household\s+use/i,
    /goods\s+withdrawn\s+by\s+(?:proprietor|owner).*home\s+use/i,
    /(?:proprietor|owner)\s+used\s+business\s+goods\s+for\s+personal\s+use/i,
  ],
  debitAccount: "Drawings",
  creditAccount: "Purchases",
  explanationLogic:
    "The proprietor or owner took business goods for personal use. Drawings increases, so Drawings is debited. Goods bought for resale are reduced, so Purchases is credited.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} withdrawn by proprietor for personal use.`,
};

const goodsDistributedFreeSampleRule: TransactionRule = {
  transaction_type: "goods_distributed_free_sample",
  patterns: [
    /goods\s+worth\s+.*distributed\s+as\s+free\s+samples?/i,
    /goods\s+.*distributed\s+as\s+free\s+samples?/i,
    /goods\s+.*given\s+as\s+free\s+samples?/i,
    /goods\s+worth\s+.*given\s+away\s+as\s+free\s+samples?/i,
    /goods\s+worth\s+.*distributed\s+for\s+advertisement/i,
    /goods\s+.*distributed\s+for\s+advertisement/i,
    /goods\s+worth\s+.*distributed\s+for\s+promotion/i,
    /goods\s+.*given\s+as\s+promotional\s+sample/i,
    /free\s+samples?\s+distributed/i,
    /free\s+sample\s+goods\s+distributed/i,
    /goods\s+used\s+as\s+free\s+samples?/i,
    /goods\s+used\s+for\s+advertisement/i,
    /goods\s+used\s+for\s+promotion/i,
  ],
  debitAccount: "Advertisement Expense",
  creditAccount: "Purchases",
  explanationLogic:
    "Goods were distributed as free samples or used for promotion. Advertisement Expense is debited because promotion is an expense, and Purchases is credited because goods bought for resale are reduced.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} distributed as free sample.`,
};

const goodsGivenAsCharityRule: TransactionRule = {
  transaction_type: "goods_given_as_charity",
  patterns: [
    /goods\s+worth\s+.*given\s+as\s+charity/i,
    /goods\s+worth\s+.*given\s+to\s+charity/i,
    /goods\s+.*given\s+as\s+charity/i,
    /goods\s+.*given\s+to\s+charity/i,
    /goods\s+worth\s+.*donated/i,
    /goods\s+.*donated/i,
    /goods\s+worth\s+.*donated\s+to\s+charity/i,
    /goods\s+worth\s+.*given\s+as\s+donation/i,
    /goods\s+.*given\s+as\s+donation/i,
    /goods\s+worth\s+.*donated\s+to\s+poor\s+people/i,
    /goods\s+worth\s+.*given\s+to\s+poor\s+people/i,
    /goods\s+worth\s+.*given\s+to\s+orphanage/i,
    /goods\s+worth\s+.*donated\s+to\s+orphanage/i,
    /goods\s+worth\s+.*given\s+for\s+charity\s+purpose/i,
    /goods\s+used\s+for\s+charity/i,
  ],
  debitAccount: "Charity Expense",
  creditAccount: "Purchases",
  explanationLogic:
    "Goods were given as charity or donation. Charity Expense is debited because charity is an expense, and Purchases is credited because goods bought for resale are reduced.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} given as charity.`,
};

const goodsLostByFireRule: TransactionRule = {
  transaction_type: "goods_lost_by_fire",
  patterns: [
    /goods\s+worth\s+.*lost\s+by\s+fire/i,
    /goods\s+.*lost\s+by\s+fire/i,
    /goods\s+destroyed\s+by\s+fire/i,
    /goods\s+worth\s+.*destroyed\s+by\s+fire/i,
    /goods\s+damaged\s+by\s+fire/i,
    /goods\s+worth\s+.*damaged\s+by\s+fire/i,
    /goods\s+burnt\s+by\s+fire/i,
    /goods\s+worth\s+.*burnt\s+in\s+fire/i,
    /goods\s+burned\s+by\s+fire/i,
    /goods\s+worth\s+.*burned\s+in\s+fire/i,
    /fire\s+destroyed\s+goods\s+worth/i,
    /goods\s+lost\s+due\s+to\s+fire/i,
  ],
  debitAccount: "Loss by Fire",
  creditAccount: "Purchases",
  explanationLogic:
    "Goods were lost or destroyed by fire. Loss by Fire is debited because losses are debited, and Purchases is credited because goods bought for resale are reduced.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} lost by fire.`,
};

const goodsLostByTheftRule: TransactionRule = {
  transaction_type: "goods_lost_by_theft",
  patterns: [
    /goods\s+worth\s+.*lost\s+by\s+theft/i,
    /goods\s+.*lost\s+by\s+theft/i,
    /goods\s+stolen/i,
    /goods\s+.*stolen/i,
    /goods\s+worth\s+.*stolen/i,
    /goods\s+stolen\s+by\s+thief/i,
    /goods\s+worth\s+.*stolen\s+by\s+thief/i,
    /goods\s+lost\s+due\s+to\s+theft/i,
    /theft\s+of\s+goods/i,
    /goods\s+worth\s+.*theft/i,
    /goods\s+.*stolen\s+from\s+business/i,
  ],
  debitAccount: "Loss by Theft",
  creditAccount: "Purchases",
  explanationLogic:
    "Goods were stolen or lost by theft. Loss by Theft is debited because losses are debited, and Purchases is credited because goods bought for resale are reduced.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} stolen.`,
};

const goodsLostGeneralRule: TransactionRule = {
  transaction_type: "goods_lost_general",
  patterns: [
    /goods\s+lost\s+(?:rs\.?|inr|₹|\d)/i,
    /goods\s+worth\s+.*lost$/i,
    /goods\s+damaged\s+(?:rs\.?|inr|₹|\d)/i,
    /goods\s+worth\s+.*damaged$/i,
    /goods\s+lost\s+due\s+to\s+accident/i,
    /goods\s+worth\s+.*lost\s+due\s+to\s+accident/i,
  ],
  debitAccount: "Goods Lost",
  creditAccount: "Purchases",
  explanationLogic:
    "Goods were lost or damaged. Goods Lost is debited because losses are debited, and Purchases is credited because goods bought for resale are reduced.",
  practiceTemplate: (amount) => `Goods worth ₹${amount} lost.`,
};

const incomeReceivedInAdvanceRules: TransactionRule[] = [
  {
    transaction_type: "rent_received_in_advance",
    patterns: [
      /rent\s+received\s+in\s+advance/i,
      /advance\s+rent\s+received/i,
      /rent\s+income\s+received\s+in\s+advance/i,
      /rent\s+received\s+beforehand/i,
      /rent\s+received\s+but\s+not\s+earned/i,
      /unearned\s+rent/i,
    ],
    debitAccount: "Rent Income",
    creditAccount: "Rent Received in Advance",
    explanationLogic:
      "Rent has been received before it is earned. Rent Income is debited to reduce current-period income, and Rent Received in Advance is credited as a liability.",
    practiceTemplate: (amount) => `Rent received in advance ₹${amount}.`,
  },
  {
    transaction_type: "commission_received_in_advance",
    patterns: [
      /commission\s+received\s+in\s+advance/i,
      /advance\s+commission\s+received/i,
      /commission\s+income\s+received\s+in\s+advance/i,
      /commission\s+received\s+beforehand/i,
      /commission\s+received\s+but\s+not\s+earned/i,
      /unearned\s+commission/i,
    ],
    debitAccount: "Commission Income",
    creditAccount: "Commission Received in Advance",
    explanationLogic:
      "Commission has been received before it is earned. Commission Income is debited to reduce current-period income, and Commission Received in Advance is credited as a liability.",
    practiceTemplate: (amount) => `Commission received in advance ₹${amount}.`,
  },
  {
    transaction_type: "interest_received_in_advance",
    patterns: [
      /interest\s+received\s+in\s+advance/i,
      /advance\s+interest\s+received/i,
      /interest\s+income\s+received\s+in\s+advance/i,
      /interest\s+received\s+beforehand/i,
      /interest\s+received\s+but\s+not\s+earned/i,
      /unearned\s+interest/i,
    ],
    debitAccount: "Interest Income",
    creditAccount: "Interest Received in Advance",
    explanationLogic:
      "Interest has been received before it is earned. Interest Income is debited to reduce current-period income, and Interest Received in Advance is credited as a liability.",
    practiceTemplate: (amount) => `Interest received in advance ₹${amount}.`,
  },
];

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
  goodsWithdrawnPersonalUseRule,
  goodsDistributedFreeSampleRule,
  goodsGivenAsCharityRule,
  goodsLostByFireRule,
  goodsLostByTheftRule,
  goodsLostGeneralRule,
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
  ...outstandingExpenseRules,
  ...accruedIncomeRules,
  ...incomeReceivedInAdvanceRules,
  ...prepaidExpenseRules,
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
