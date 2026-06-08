import { generateFinalAccounts, type FinalAccountsResult } from "./final-accounts-engine";

export type FinalAccountsPracticeResultType = "gross_profit" | "gross_loss" | "net_profit" | "net_loss" | "none";
export type FinalAccountsPracticeAgreeAnswer = "yes" | "no";

export type FinalAccountsPracticeCase = {
  id: string;
  title: string;
  trialBalance: string;
  adjustments: string;
  expectedGrossResultType: "gross_profit" | "gross_loss" | "none";
  expectedGrossResultAmount: number;
  expectedNetResultType: "net_profit" | "net_loss" | "none";
  expectedNetResultAmount: number;
  expectedAdjustedCapitalAmount?: number;
  expectedAssetTotal: number;
  expectedLiabilityTotal: number;
  expectedBalanceSheetAgrees: boolean;
  explanation: string[];
  finalAccountsResult: FinalAccountsResult;
};

export type FinalAccountsPracticeAnswer = {
  grossResultType: FinalAccountsPracticeCase["expectedGrossResultType"];
  grossAmountText: string;
  netResultType: FinalAccountsPracticeCase["expectedNetResultType"];
  netAmountText: string;
  adjustedCapitalText: string;
  assetTotalText: string;
  liabilityTotalText: string;
  balanceSheetAgrees: FinalAccountsPracticeAgreeAnswer;
};

export type FinalAccountsPracticeCheckResult = {
  isCorrect: boolean;
  score: number;
  expectedAnswerText: string;
  checks: {
    grossResultType: boolean;
    grossAmount: boolean;
    netResultType: boolean;
    netAmount: boolean;
    adjustedCapital: boolean;
    assetTotal: boolean;
    liabilityTotal: boolean;
    balanceSheetAgrees: boolean;
  };
};

type FinalAccountsPracticeCaseSeed = {
  id: string;
  title: string;
  trialBalance: string;
  adjustments: string;
};

const sampleBalances = `Capital A/c Cr Rs.50000
Cash A/c Dr Rs.10000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.40000
Wages A/c Dr Rs.5000
Rent A/c Dr Rs.3000
Commission Received A/c Cr Rs.2000
Debtors A/c Dr Rs.8000
Creditors A/c Cr Rs.6000
Furniture A/c Dr Rs.15000
Drawings A/c Dr Rs.5000
Bank A/c Dr Rs.32000`;

const caseSeeds: FinalAccountsPracticeCaseSeed[] = [
  {
    id: "basic-gross-profit-net-profit",
    title: "Basic Trading and P&L with Gross Profit and Net Profit",
    trialBalance: sampleBalances,
    adjustments: "",
  },
  {
    id: "gross-loss-case",
    title: "Gross Loss case",
    trialBalance: `Capital A/c Cr Rs.30000
Purchases A/c Dr Rs.50000
Wages A/c Dr Rs.10000
Sales A/c Cr Rs.40000
Cash A/c Dr Rs.10000`,
    adjustments: "",
  },
  {
    id: "net-loss-case",
    title: "Net Loss case",
    trialBalance: `Capital A/c Cr Rs.50000
Sales A/c Cr Rs.30000
Purchases A/c Dr Rs.20000
Rent A/c Dr Rs.15000
Cash A/c Dr Rs.45000`,
    adjustments: "",
  },
  {
    id: "closing-stock-adjustment",
    title: "Closing stock adjustment",
    trialBalance: `Capital A/c Cr Rs.30000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.40000
Cash A/c Dr Rs.50000`,
    adjustments: "Closing stock Rs.10000",
  },
  {
    id: "outstanding-prepaid-adjustment",
    title: "Outstanding and prepaid adjustment",
    trialBalance: `Capital A/c Cr Rs.50000
Salary A/c Dr Rs.10000
Insurance A/c Dr Rs.4000
Cash A/c Dr Rs.36000`,
    adjustments: `Salary outstanding Rs.2000
Prepaid insurance Rs.1000`,
  },
  {
    id: "depreciation-adjustment",
    title: "Depreciation adjustment",
    trialBalance: `Machinery A/c Dr Rs.50000
Capital A/c Cr Rs.50000`,
    adjustments: "Depreciation on machinery Rs.5000",
  },
  {
    id: "provision-for-doubtful-debts",
    title: "Provision for doubtful debts case",
    trialBalance: `Capital A/c Cr Rs.100000
Creditors A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Cash A/c Dr Rs.100000`,
    adjustments: "Provision for doubtful debts 10%",
  },
  {
    id: "mixed-adjustments-balance-sheet",
    title: "Mixed case with Balance Sheet agreeing",
    trialBalance: `Capital A/c Cr Rs.80000
Sales A/c Cr Rs.90000
Commission Received A/c Cr Rs.5000
Creditors A/c Cr Rs.15000
Purchases A/c Dr Rs.40000
Wages A/c Dr Rs.10000
Salary A/c Dr Rs.8000
Insurance A/c Dr Rs.6000
Machinery A/c Dr Rs.40000
Debtors A/c Dr Rs.12000
Cash A/c Dr Rs.74000`,
    adjustments: `Closing stock Rs.15000
Salary outstanding Rs.2000
Prepaid insurance Rs.1000
Depreciation on machinery Rs.4000`,
  },
];

export function getFinalAccountsPracticeCases(): FinalAccountsPracticeCase[] {
  return caseSeeds.map(buildFinalAccountsPracticeCase);
}

export function generateFinalAccountsPracticeCase(index = 0): FinalAccountsPracticeCase {
  const cases = getFinalAccountsPracticeCases();
  return cases[normalizeIndex(index, cases.length)];
}

export function parseFinalAccountsPracticeAmount(value: string): number | null {
  const normalized = value.replace(/rs\.?|inr|₹/gi, "").replace(/,/g, "").replace(/\s+/g, "");
  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

export function checkFinalAccountsPracticeAnswer(
  practiceCase: FinalAccountsPracticeCase,
  answer: FinalAccountsPracticeAnswer,
): FinalAccountsPracticeCheckResult {
  const grossAmount = parseFinalAccountsPracticeAmount(answer.grossAmountText);
  const netAmount = parseFinalAccountsPracticeAmount(answer.netAmountText);
  const adjustedCapital = parseFinalAccountsPracticeAmount(answer.adjustedCapitalText);
  const assetTotal = parseFinalAccountsPracticeAmount(answer.assetTotalText);
  const liabilityTotal = parseFinalAccountsPracticeAmount(answer.liabilityTotalText);
  const expectedAgreeAnswer: FinalAccountsPracticeAgreeAnswer = practiceCase.expectedBalanceSheetAgrees ? "yes" : "no";

  const checks = {
    grossResultType: answer.grossResultType === practiceCase.expectedGrossResultType,
    grossAmount: amountMatches(grossAmount, practiceCase.expectedGrossResultAmount),
    netResultType: answer.netResultType === practiceCase.expectedNetResultType,
    netAmount: amountMatches(netAmount, practiceCase.expectedNetResultAmount),
    adjustedCapital: optionalAmountMatches(adjustedCapital, practiceCase.expectedAdjustedCapitalAmount),
    assetTotal: amountMatches(assetTotal, practiceCase.expectedAssetTotal),
    liabilityTotal: amountMatches(liabilityTotal, practiceCase.expectedLiabilityTotal),
    balanceSheetAgrees: answer.balanceSheetAgrees === expectedAgreeAnswer,
  };
  const score =
    (checks.grossResultType ? 10 : 0) +
    (checks.grossAmount ? 15 : 0) +
    (checks.netResultType ? 10 : 0) +
    (checks.netAmount ? 15 : 0) +
    (checks.adjustedCapital ? 15 : 0) +
    (checks.assetTotal ? 15 : 0) +
    (checks.liabilityTotal ? 15 : 0) +
    (checks.balanceSheetAgrees ? 5 : 0);

  return {
    isCorrect: score === 100,
    score,
    expectedAnswerText: formatFinalAccountsPracticeAnswer(practiceCase),
    checks,
  };
}

export function formatFinalAccountsPracticeAnswer(practiceCase: FinalAccountsPracticeCase): string {
  return [
    `${formatResultLabel(practiceCase.expectedGrossResultType)}: Rs.${practiceCase.expectedGrossResultAmount.toLocaleString("en-IN")}.`,
    `${formatResultLabel(practiceCase.expectedNetResultType)}: Rs.${practiceCase.expectedNetResultAmount.toLocaleString("en-IN")}.`,
    `Adjusted Capital: Rs.${(practiceCase.expectedAdjustedCapitalAmount ?? 0).toLocaleString("en-IN")}.`,
    `Total Assets: Rs.${practiceCase.expectedAssetTotal.toLocaleString("en-IN")}.`,
    `Total Liabilities: Rs.${practiceCase.expectedLiabilityTotal.toLocaleString("en-IN")}.`,
    `Balance Sheet ${practiceCase.expectedBalanceSheetAgrees ? "agrees" : "does not agree"}.`,
  ].join(" ");
}

export function formatResultLabel(type: FinalAccountsPracticeCase["expectedGrossResultType"] | FinalAccountsPracticeCase["expectedNetResultType"]): string {
  const labels = {
    gross_profit: "Gross Profit",
    gross_loss: "Gross Loss",
    net_profit: "Net Profit",
    net_loss: "Net Loss",
    none: "No Profit/Loss",
  };

  return labels[type];
}

function buildFinalAccountsPracticeCase(seed: FinalAccountsPracticeCaseSeed): FinalAccountsPracticeCase {
  const finalAccountsResult = generateFinalAccounts(seed.trialBalance, seed.adjustments);
  if (finalAccountsResult.status !== "success") {
    throw new Error(`Final accounts practice case ${seed.id} could not be processed.`);
  }

  const expectedGrossResultType = getGrossResultType(finalAccountsResult);
  const expectedNetResultType = getNetResultType(finalAccountsResult);
  const expectedGrossResultAmount =
    finalAccountsResult.tradingAccount.grossProfit || finalAccountsResult.tradingAccount.grossLoss;
  const expectedNetResultAmount =
    finalAccountsResult.profitAndLossAccount.netProfit || finalAccountsResult.profitAndLossAccount.netLoss;
  const expectedAdjustedCapitalAmount = finalAccountsResult.balanceSheet.capitalWorking?.adjustedCapital;

  return {
    ...seed,
    expectedGrossResultType,
    expectedGrossResultAmount,
    expectedNetResultType,
    expectedNetResultAmount,
    expectedAdjustedCapitalAmount,
    expectedAssetTotal: finalAccountsResult.balanceSheet.assetTotal,
    expectedLiabilityTotal: finalAccountsResult.balanceSheet.liabilityTotal,
    expectedBalanceSheetAgrees: finalAccountsResult.balanceSheet.agrees,
    explanation: buildExplanation(finalAccountsResult),
    finalAccountsResult,
  };
}

function getGrossResultType(result: FinalAccountsResult): FinalAccountsPracticeCase["expectedGrossResultType"] {
  if (result.tradingAccount.grossProfit > 0) return "gross_profit";
  if (result.tradingAccount.grossLoss > 0) return "gross_loss";
  return "none";
}

function getNetResultType(result: FinalAccountsResult): FinalAccountsPracticeCase["expectedNetResultType"] {
  if (result.profitAndLossAccount.netProfit > 0) return "net_profit";
  if (result.profitAndLossAccount.netLoss > 0) return "net_loss";
  return "none";
}

function buildExplanation(result: FinalAccountsResult): string[] {
  const grossType = getGrossResultType(result);
  const netType = getNetResultType(result);
  const grossAmount = result.tradingAccount.grossProfit || result.tradingAccount.grossLoss;
  const netAmount = result.profitAndLossAccount.netProfit || result.profitAndLossAccount.netLoss;
  const capitalText =
    result.balanceSheet.capitalWorking?.adjustedCapital === undefined
      ? "Adjusted Capital is not calculated because Capital is not present."
      : `${formatResultLabel(netType)} is considered in Capital Working, so Adjusted Capital is Rs.${result.balanceSheet.capitalWorking.adjustedCapital.toLocaleString("en-IN")}.`;

  return [
    `The Trading Account shows ${formatResultLabel(grossType)} of Rs.${grossAmount.toLocaleString("en-IN")}.`,
    `The Profit & Loss Account shows ${formatResultLabel(netType)} of Rs.${netAmount.toLocaleString("en-IN")}.`,
    capitalText,
    `Balance Sheet assets total Rs.${result.balanceSheet.assetTotal.toLocaleString("en-IN")} and liabilities total Rs.${result.balanceSheet.liabilityTotal.toLocaleString("en-IN")}.`,
    `The Balance Sheet ${result.balanceSheet.agrees ? "agrees because both totals are equal" : "does not agree because the totals are different"}.`,
  ];
}

function amountMatches(actual: number | null, expected: number): boolean {
  if (expected === 0) return actual === null || actual === 0;
  return actual === expected;
}

function optionalAmountMatches(actual: number | null, expected?: number): boolean {
  if (expected === undefined) return actual === null || actual === 0;
  return amountMatches(actual, expected);
}

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}
