import { extractAmount, removeFirstAmount } from "./amount-parser";
import { cleanAccountName } from "./account-synonyms";

export type BalanceSide = "debit" | "credit";

export type TrialBalanceBalance = {
  account: string;
  side: BalanceSide;
  amount: number;
};

export type FinalAccountLine = {
  account: string;
  amount: number;
};

export type FinalAccountsResult = {
  status: "success" | "invalid";
  parsedBalances: TrialBalanceBalance[];
  tradingAccount: {
    debitLines: FinalAccountLine[];
    creditLines: FinalAccountLine[];
    debitTotal: number;
    creditTotal: number;
    grossProfit: number;
    grossLoss: number;
  };
  profitAndLossAccount: {
    debitLines: FinalAccountLine[];
    creditLines: FinalAccountLine[];
    debitTotal: number;
    creditTotal: number;
    netProfit: number;
    netLoss: number;
  };
  balanceSheetItems: TrialBalanceBalance[];
  unclassifiedItems: TrialBalanceBalance[];
  errors: string[];
  warnings: string[];
  logic: string[];
  commonMistakes: string[];
};

type AccountCategory = "trading-debit" | "trading-credit" | "pl-debit" | "pl-credit" | "balance-sheet";

const maxFinalAccountBalances = 50;

const tradingDebitAccounts = new Set([
  "opening stock",
  "purchases",
  "wages",
  "carriage inward",
  "carriage inwards",
  "freight inward",
  "freight inwards",
  "import duty",
  "factory expenses",
  "manufacturing expenses",
  "sales returns",
  "sales return",
]);

const tradingCreditAccounts = new Set(["sales", "purchase returns", "purchase return", "closing stock"]);

const profitAndLossDebitAccounts = new Set([
  "rent",
  "salary",
  "salaries",
  "office expenses",
  "advertisement",
  "repairs",
  "travelling expenses",
  "travel expense",
  "travel expenses",
  "telephone expense",
  "internet expense",
  "legal charges",
  "bad debts",
  "depreciation",
  "insurance",
  "printing and stationery",
  "discount allowed",
  "loss on sale of asset",
]);

const profitAndLossCreditAccounts = new Set([
  "commission received",
  "commission income",
  "interest received",
  "interest income",
  "rent received",
  "rent income",
  "discount received",
  "bad debts recovered",
  "profit on sale of asset",
  "miscellaneous income",
  "service income",
  "consultancy income",
  "tuition income",
  "royalty income",
  "dividend income",
]);

const balanceSheetAccounts = new Set([
  "cash",
  "bank",
  "capital",
  "drawings",
  "debtor",
  "debtors",
  "creditor",
  "creditors",
  "machinery",
  "furniture",
  "computer",
  "equipment",
  "vehicle",
  "land",
  "building",
  "outstanding expenses",
  "prepaid expenses",
  "accrued income",
  "income received in advance",
  "loan",
  "loans",
  "gst",
  "input gst",
  "output gst",
  "asset disposal",
  "accumulated depreciation",
]);

const commonMistakes = [
  "Do not put Cash or Bank in Trading A/c or P&L A/c.",
  "Do not put Capital in Trading A/c or P&L A/c.",
  "Purchases and Sales go to Trading Account.",
  "Rent and Salary usually go to Profit & Loss Account.",
  "Gross Profit is transferred to Profit & Loss Account.",
  "Balance Sheet will be added later; this MVP only prepares Trading and P&L.",
];

const logic = [
  "Purchases and direct expenses go to Trading Account.",
  "Sales goes to the credit side of Trading Account.",
  "Gross Profit is transferred to the credit side of Profit & Loss Account.",
  "Indirect expenses such as rent, salary, advertisement, and depreciation go to the debit side of Profit & Loss Account.",
  "Indirect incomes such as commission received and interest received go to the credit side of Profit & Loss Account.",
  "Balance Sheet items like Cash, Capital, Debtors, Creditors, and Fixed Assets are not processed in this MVP.",
];

export function generateFinalAccounts(input: string): FinalAccountsResult {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return invalidResult(["I could not read the trial balance balances."]);
  }

  if (lines.length > maxFinalAccountBalances) {
    return invalidResult(["For this beta version, please enter up to 50 trial balance balances at a time."]);
  }

  const parsedBalances: TrialBalanceBalance[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const side = detectSide(line);
    const amount = extractAmount(line);

    if (!side) {
      errors.push(`Please mention Dr or Cr in line ${lineNumber}.`);
      return;
    }

    if (!amount) {
      errors.push(`Amount is missing in line ${lineNumber}.`);
      return;
    }

    const account = parseAccountName(line);
    if (!account) {
      errors.push(`I could not read the account name in line ${lineNumber}.`);
      return;
    }

    parsedBalances.push({ account, side, amount });
  });

  if (errors.length > 0 || parsedBalances.length === 0) {
    return invalidResult(errors.length ? errors : ["I could not read the trial balance balances."]);
  }

  const warnings = trialBalanceTotalsAgree(parsedBalances)
    ? []
    : ["Trial Balance totals do not agree. Final accounts may not be reliable."];

  const classified = classifyBalances(parsedBalances);
  const tradingAccount = buildTradingAccount(classified.tradingDebitLines, classified.tradingCreditLines);
  const profitAndLossAccount = buildProfitAndLossAccount(
    classified.profitAndLossDebitLines,
    classified.profitAndLossCreditLines,
    tradingAccount.grossProfit,
    tradingAccount.grossLoss,
  );

  return {
    status: "success",
    parsedBalances,
    tradingAccount,
    profitAndLossAccount,
    balanceSheetItems: classified.balanceSheetItems,
    unclassifiedItems: classified.unclassifiedItems,
    errors: [],
    warnings,
    logic,
    commonMistakes,
  };
}

function detectSide(line: string): BalanceSide | null {
  if (/\b(dr\.?|debit)\b/i.test(line)) return "debit";
  if (/\b(cr\.?|credit)\b/i.test(line)) return "credit";
  return null;
}

function parseAccountName(line: string): string {
  const withoutAmount = removeFirstAmount(line)
    .replace(/\b(dr\.?|debit|cr\.?|credit)\b/gi, " ")
    .replace(/\b(rs\.?|inr)\b/gi, " ")
    .replace(/[₹]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return titleCaseAccount(cleanAccountName(withoutAmount));
}

function classifyBalances(parsedBalances: TrialBalanceBalance[]): {
  tradingDebitLines: FinalAccountLine[];
  tradingCreditLines: FinalAccountLine[];
  profitAndLossDebitLines: FinalAccountLine[];
  profitAndLossCreditLines: FinalAccountLine[];
  balanceSheetItems: TrialBalanceBalance[];
  unclassifiedItems: TrialBalanceBalance[];
} {
  const tradingDebitLines: FinalAccountLine[] = [];
  const tradingCreditLines: FinalAccountLine[] = [];
  const profitAndLossDebitLines: FinalAccountLine[] = [];
  const profitAndLossCreditLines: FinalAccountLine[] = [];
  const balanceSheetItems: TrialBalanceBalance[] = [];
  const unclassifiedItems: TrialBalanceBalance[] = [];

  parsedBalances.forEach((balance) => {
    const category = classifyAccount(balance.account);

    if (category === "trading-debit") {
      tradingDebitLines.push(toFinalAccountLine(balance));
      return;
    }

    if (category === "trading-credit") {
      tradingCreditLines.push(toFinalAccountLine(balance));
      return;
    }

    if (category === "pl-debit") {
      profitAndLossDebitLines.push(toFinalAccountLine(balance));
      return;
    }

    if (category === "pl-credit") {
      profitAndLossCreditLines.push(toFinalAccountLine(balance));
      return;
    }

    if (category === "balance-sheet") {
      balanceSheetItems.push(balance);
      return;
    }

    unclassifiedItems.push(balance);
  });

  return {
    tradingDebitLines,
    tradingCreditLines,
    profitAndLossDebitLines,
    profitAndLossCreditLines,
    balanceSheetItems,
    unclassifiedItems,
  };
}

function classifyAccount(account: string): AccountCategory | "unclassified" {
  const key = cleanAccountName(account);

  if (tradingDebitAccounts.has(key)) return "trading-debit";
  if (tradingCreditAccounts.has(key)) return "trading-credit";
  if (profitAndLossDebitAccounts.has(key)) return "pl-debit";
  if (profitAndLossCreditAccounts.has(key)) return "pl-credit";
  if (balanceSheetAccounts.has(key)) return "balance-sheet";

  return "unclassified";
}

function buildTradingAccount(
  startingDebitLines: FinalAccountLine[],
  startingCreditLines: FinalAccountLine[],
): FinalAccountsResult["tradingAccount"] {
  const debitLines = [...startingDebitLines];
  const creditLines = [...startingCreditLines];
  const startingDebitTotal = sumLines(debitLines);
  const startingCreditTotal = sumLines(creditLines);
  const grossProfit = Math.max(startingCreditTotal - startingDebitTotal, 0);
  const grossLoss = Math.max(startingDebitTotal - startingCreditTotal, 0);

  if (grossProfit > 0) {
    debitLines.push({ account: "Gross Profit", amount: grossProfit });
  }

  if (grossLoss > 0) {
    creditLines.push({ account: "Gross Loss", amount: grossLoss });
  }

  return {
    debitLines,
    creditLines,
    debitTotal: sumLines(debitLines),
    creditTotal: sumLines(creditLines),
    grossProfit,
    grossLoss,
  };
}

function buildProfitAndLossAccount(
  startingDebitLines: FinalAccountLine[],
  startingCreditLines: FinalAccountLine[],
  grossProfit: number,
  grossLoss: number,
): FinalAccountsResult["profitAndLossAccount"] {
  const debitLines = [...startingDebitLines];
  const creditLines = [...startingCreditLines];

  if (grossLoss > 0) {
    debitLines.push({ account: "Gross Loss", amount: grossLoss });
  }

  if (grossProfit > 0) {
    creditLines.push({ account: "Gross Profit", amount: grossProfit });
  }

  const startingDebitTotal = sumLines(debitLines);
  const startingCreditTotal = sumLines(creditLines);
  const netProfit = Math.max(startingCreditTotal - startingDebitTotal, 0);
  const netLoss = Math.max(startingDebitTotal - startingCreditTotal, 0);

  if (netProfit > 0) {
    debitLines.push({ account: "Net Profit", amount: netProfit });
  }

  if (netLoss > 0) {
    creditLines.push({ account: "Net Loss", amount: netLoss });
  }

  return {
    debitLines,
    creditLines,
    debitTotal: sumLines(debitLines),
    creditTotal: sumLines(creditLines),
    netProfit,
    netLoss,
  };
}

function trialBalanceTotalsAgree(parsedBalances: TrialBalanceBalance[]): boolean {
  const debitTotal = parsedBalances
    .filter((balance) => balance.side === "debit")
    .reduce((total, balance) => total + balance.amount, 0);
  const creditTotal = parsedBalances
    .filter((balance) => balance.side === "credit")
    .reduce((total, balance) => total + balance.amount, 0);

  return debitTotal === creditTotal;
}

function toFinalAccountLine(balance: TrialBalanceBalance): FinalAccountLine {
  return {
    account: balance.account,
    amount: balance.amount,
  };
}

function sumLines(lines: FinalAccountLine[]): number {
  return lines.reduce((total, line) => total + line.amount, 0);
}

function titleCaseAccount(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (["GST", "CGST", "SGST", "IGST"].includes(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function emptyAccounts(): Pick<
  FinalAccountsResult,
  "tradingAccount" | "profitAndLossAccount" | "parsedBalances" | "balanceSheetItems" | "unclassifiedItems"
> {
  return {
    parsedBalances: [],
    tradingAccount: {
      debitLines: [],
      creditLines: [],
      debitTotal: 0,
      creditTotal: 0,
      grossProfit: 0,
      grossLoss: 0,
    },
    profitAndLossAccount: {
      debitLines: [],
      creditLines: [],
      debitTotal: 0,
      creditTotal: 0,
      netProfit: 0,
      netLoss: 0,
    },
    balanceSheetItems: [],
    unclassifiedItems: [],
  };
}

function invalidResult(errors: string[]): FinalAccountsResult {
  return {
    status: "invalid",
    ...emptyAccounts(),
    errors,
    warnings: [],
    logic: [],
    commonMistakes,
  };
}
