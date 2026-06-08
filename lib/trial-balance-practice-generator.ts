import { generateTrialBalance, type TrialBalanceRow } from "./trial-balance-engine";

export type TrialBalancePracticeTargetSide = "debit" | "credit" | "not_shown";
export type TrialBalancePracticeAgreeAnswer = "yes" | "no";

export type TrialBalancePracticeCase = {
  id: string;
  title: string;
  journalEntries: string;
  targetAccount: string;
  expectedTargetSide: TrialBalancePracticeTargetSide;
  expectedTargetAmount: number;
  expectedDebitTotal: number;
  expectedCreditTotal: number;
  expectedAgrees: boolean;
  explanation: string[];
  trialBalanceRows: TrialBalanceRow[];
};

export type TrialBalancePracticeAnswer = {
  targetSide: TrialBalancePracticeTargetSide;
  targetAmountText: string;
  debitTotalText: string;
  creditTotalText: string;
  agrees: TrialBalancePracticeAgreeAnswer;
};

export type TrialBalancePracticeCheckResult = {
  isCorrect: boolean;
  score: number;
  expectedAnswerText: string;
  checks: {
    targetSide: boolean;
    targetAmount: boolean;
    debitTotal: boolean;
    creditTotal: boolean;
    agrees: boolean;
  };
};

type TrialBalancePracticeCaseSeed = {
  id: string;
  title: string;
  journalEntries: string;
  targetAccount: string;
};

const caseSeeds: TrialBalancePracticeCaseSeed[] = [
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
    id: "gst-purchase-input-gst",
    title: "GST purchase with Input GST",
    targetAccount: "Input GST",
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
    title: "Mixed simple entries with balanced totals",
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

export function getTrialBalancePracticeCases(): TrialBalancePracticeCase[] {
  return caseSeeds.map(buildTrialBalancePracticeCase);
}

export function generateTrialBalancePracticeCase(index = 0): TrialBalancePracticeCase {
  const cases = getTrialBalancePracticeCases();
  return cases[normalizeIndex(index, cases.length)];
}

export function parseTrialBalancePracticeAmount(value: string): number | null {
  const normalized = value.replace(/rs\.?|inr|₹/gi, "").replace(/,/g, "").replace(/\s+/g, "");
  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export function checkTrialBalancePracticeAnswer(
  practiceCase: TrialBalancePracticeCase,
  answer: TrialBalancePracticeAnswer,
): TrialBalancePracticeCheckResult {
  const targetAmount = parseTrialBalancePracticeAmount(answer.targetAmountText);
  const debitTotal = parseTrialBalancePracticeAmount(answer.debitTotalText);
  const creditTotal = parseTrialBalancePracticeAmount(answer.creditTotalText);
  const expectedAgreeAnswer: TrialBalancePracticeAgreeAnswer = practiceCase.expectedAgrees ? "yes" : "no";
  const targetAmountMatches =
    practiceCase.expectedTargetSide === "not_shown"
      ? targetAmount === null || targetAmount === 0
      : targetAmount === practiceCase.expectedTargetAmount;

  const checks = {
    targetSide: answer.targetSide === practiceCase.expectedTargetSide,
    targetAmount: targetAmountMatches,
    debitTotal: debitTotal === practiceCase.expectedDebitTotal,
    creditTotal: creditTotal === practiceCase.expectedCreditTotal,
    agrees: answer.agrees === expectedAgreeAnswer,
  };
  const score =
    (checks.targetSide ? 20 : 0) +
    (checks.targetAmount ? 20 : 0) +
    (checks.debitTotal ? 25 : 0) +
    (checks.creditTotal ? 25 : 0) +
    (checks.agrees ? 10 : 0);

  return {
    isCorrect: score === 100,
    score,
    expectedAnswerText: formatTrialBalancePracticeAnswer(practiceCase),
    checks,
  };
}

export function formatTrialBalancePracticeAnswer(practiceCase: TrialBalancePracticeCase): string {
  const target =
    practiceCase.expectedTargetSide === "not_shown"
      ? `${practiceCase.targetAccount} A/c is not shown in the Trial Balance.`
      : `${practiceCase.targetAccount} A/c appears on the ${titleCase(
          practiceCase.expectedTargetSide,
        )} side with Rs.${practiceCase.expectedTargetAmount.toLocaleString("en-IN")}.`;

  return [
    target,
    `Debit total: Rs.${practiceCase.expectedDebitTotal.toLocaleString("en-IN")}.`,
    `Credit total: Rs.${practiceCase.expectedCreditTotal.toLocaleString("en-IN")}.`,
    `Trial Balance ${practiceCase.expectedAgrees ? "agrees" : "does not agree"}.`,
  ].join(" ");
}

function buildTrialBalancePracticeCase(seed: TrialBalancePracticeCaseSeed): TrialBalancePracticeCase {
  const trialBalanceResult = generateTrialBalance(seed.journalEntries);
  if (trialBalanceResult.status !== "success") {
    throw new Error(`Trial balance practice case ${seed.id} could not be processed.`);
  }

  const targetRow = trialBalanceResult.rows.find((row) => row.account === seed.targetAccount);
  const expectedTargetSide: TrialBalancePracticeTargetSide = targetRow
    ? targetRow.debit > 0
      ? "debit"
      : "credit"
    : "not_shown";
  const expectedTargetAmount = targetRow ? Math.max(targetRow.debit, targetRow.credit) : 0;

  return {
    ...seed,
    expectedTargetSide,
    expectedTargetAmount,
    expectedDebitTotal: trialBalanceResult.debitTotal,
    expectedCreditTotal: trialBalanceResult.creditTotal,
    expectedAgrees: trialBalanceResult.agrees,
    explanation: buildExplanation(seed.targetAccount, expectedTargetSide, expectedTargetAmount, trialBalanceResult),
    trialBalanceRows: trialBalanceResult.rows,
  };
}

function buildExplanation(
  targetAccount: string,
  targetSide: TrialBalancePracticeTargetSide,
  targetAmount: number,
  trialBalanceResult: { debitTotal: number; creditTotal: number; agrees: boolean },
): string[] {
  const targetExplanation =
    targetSide === "not_shown"
      ? `${targetAccount} A/c is not shown because its debit and credit balances are equal or it has no closing balance.`
      : `${targetAccount} A/c appears on the ${targetSide} side of the Trial Balance with Rs.${targetAmount.toLocaleString(
          "en-IN",
        )}.`;

  return [
    targetExplanation,
    `Total debit balances are Rs.${trialBalanceResult.debitTotal.toLocaleString("en-IN")} and total credit balances are Rs.${trialBalanceResult.creditTotal.toLocaleString("en-IN")}.`,
    `The Trial Balance ${trialBalanceResult.agrees ? "agrees because both totals are equal" : "does not agree because the totals are different"}.`,
  ];
}

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
