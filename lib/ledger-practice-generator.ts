import { generateLedger, type LedgerAccount } from "./ledger-engine";

export type LedgerPracticeBalanceSide = "debit" | "credit" | "balanced";

export type LedgerPracticeCase = {
  id: string;
  title: string;
  journalEntries: string;
  targetAccount: string;
  expectedBalanceSide: LedgerPracticeBalanceSide;
  expectedBalanceAmount: number;
  explanation: string[];
  targetLedgerAccount: LedgerAccount;
};

export type LedgerPracticeCheckResult = {
  isCorrect: boolean;
  expectedBalanceText: string;
  normalizedAmount: number | null;
};

type LedgerPracticeCaseSeed = {
  id: string;
  title: string;
  journalEntries: string;
  targetAccount: string;
};

const caseSeeds: LedgerPracticeCaseSeed[] = [
  {
    id: "cash-capital-purchases-rent",
    title: "Cash, capital, purchases, and rent",
    targetAccount: "Cash",
    journalEntries: `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`,
  },
  {
    id: "bank-deposit-cash-payments",
    title: "Bank deposit and cash payments",
    targetAccount: "Cash",
    journalEntries: `Cash A/c Dr. Rs.40000
To Capital A/c Rs.40000

Bank A/c Dr. Rs.15000
To Cash A/c Rs.15000

Salary A/c Dr. Rs.5000
To Cash A/c Rs.5000`,
  },
  {
    id: "sales-and-debtor",
    title: "Credit sales and debtor balance",
    targetAccount: "Raju",
    journalEntries: `Raju A/c Dr. Rs.25000
To Sales A/c Rs.25000

Cash A/c Dr. Rs.10000
To Raju A/c Rs.10000`,
  },
  {
    id: "credit-purchase-creditor",
    title: "Credit purchase and creditor balance",
    targetAccount: "Amit",
    journalEntries: `Purchases A/c Dr. Rs.18000
To Amit A/c Rs.18000

Amit A/c Dr. Rs.7000
To Bank A/c Rs.7000`,
  },
  {
    id: "furniture-and-depreciation",
    title: "Furniture purchase and depreciation",
    targetAccount: "Furniture",
    journalEntries: `Furniture A/c Dr. Rs.30000
To Bank A/c Rs.30000

Depreciation A/c Dr. Rs.3000
To Furniture A/c Rs.3000`,
  },
  {
    id: "gst-purchase-bank-balance",
    title: "GST purchase and bank balance",
    targetAccount: "Bank",
    journalEntries: `Bank A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
Input GST A/c Dr. Rs.1800
To Bank A/c Rs.11800`,
  },
  {
    id: "discount-allowed-debtor-receipt",
    title: "Discount allowed with debtor receipt",
    targetAccount: "Mohan",
    journalEntries: `Mohan A/c Dr. Rs.20000
To Sales A/c Rs.20000

Cash A/c Dr. Rs.19000
Discount Allowed A/c Dr. Rs.1000
To Mohan A/c Rs.20000`,
  },
  {
    id: "mixed-simple-entries",
    title: "Mixed simple entries",
    targetAccount: "Bank",
    journalEntries: `Bank A/c Dr. Rs.60000
To Capital A/c Rs.60000

Purchases A/c Dr. Rs.12000
To Bank A/c Rs.12000

Cash A/c Dr. Rs.15000
To Sales A/c Rs.15000

Rent A/c Dr. Rs.4000
To Bank A/c Rs.4000`,
  },
];

export function getLedgerPracticeCases(): LedgerPracticeCase[] {
  return caseSeeds.map(buildLedgerPracticeCase);
}

export function generateLedgerPracticeCase(index = 0): LedgerPracticeCase {
  const cases = getLedgerPracticeCases();
  return cases[normalizeIndex(index, cases.length)];
}

export function parseLedgerPracticeAmount(value: string): number | null {
  const normalized = value.replace(/rs\.?|inr|₹/gi, "").replace(/,/g, "").replace(/\s+/g, "");
  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export function checkLedgerPracticeAnswer(
  practiceCase: LedgerPracticeCase,
  answerSide: LedgerPracticeBalanceSide,
  answerAmountText: string,
): LedgerPracticeCheckResult {
  const normalizedAmount = parseLedgerPracticeAmount(answerAmountText);
  const expectedAmount = practiceCase.expectedBalanceSide === "balanced" ? 0 : practiceCase.expectedBalanceAmount;
  const isCorrect = answerSide === practiceCase.expectedBalanceSide && normalizedAmount === expectedAmount;

  return {
    isCorrect,
    expectedBalanceText: formatLedgerPracticeBalance(practiceCase),
    normalizedAmount,
  };
}

export function formatLedgerPracticeBalance(practiceCase: LedgerPracticeCase): string {
  if (practiceCase.expectedBalanceSide === "balanced") {
    return `${practiceCase.targetAccount} A/c is balanced.`;
  }

  return `${practiceCase.targetAccount} A/c has ${titleCase(practiceCase.expectedBalanceSide)} balance Rs.${practiceCase.expectedBalanceAmount.toLocaleString("en-IN")}.`;
}

function buildLedgerPracticeCase(seed: LedgerPracticeCaseSeed): LedgerPracticeCase {
  const ledgerResult = generateLedger(seed.journalEntries);
  if (ledgerResult.status !== "success") {
    throw new Error(`Ledger practice case ${seed.id} could not be processed.`);
  }

  const targetLedgerAccount = ledgerResult.ledgerAccounts.find((account) => account.account === seed.targetAccount);
  if (!targetLedgerAccount) {
    throw new Error(`Ledger practice case ${seed.id} is missing ${seed.targetAccount} A/c.`);
  }

  return {
    ...seed,
    expectedBalanceSide: targetLedgerAccount.balanceSide,
    expectedBalanceAmount: targetLedgerAccount.balanceAmount,
    explanation: buildExplanation(targetLedgerAccount),
    targetLedgerAccount,
  };
}

function buildExplanation(account: LedgerAccount): string[] {
  const debitText = `Rs.${account.debitTotal.toLocaleString("en-IN")}`;
  const creditText = `Rs.${account.creditTotal.toLocaleString("en-IN")}`;

  if (account.balanceSide === "balanced") {
    return [
      `${account.account} A/c was debited by ${debitText} and credited by ${creditText}.`,
      "Since both sides are equal, the account is balanced.",
    ];
  }

  const higherSide = account.balanceSide === "debit" ? "debit" : "credit";
  const balanceText = `Rs.${account.balanceAmount.toLocaleString("en-IN")}`;

  return [
    `${account.account} A/c was debited by ${debitText} and credited by ${creditText}.`,
    `Since the ${higherSide} total is higher, ${account.account} A/c has a ${higherSide} balance of ${balanceText}.`,
  ];
}

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
