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

export type CapitalWorking = {
  openingCapital: number;
  netProfit: number;
  netLoss: number;
  drawings: number;
  adjustedCapital: number;
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
  balanceSheet: {
    assets: FinalAccountLine[];
    liabilities: FinalAccountLine[];
    assetTotal: number;
    liabilityTotal: number;
    agrees: boolean;
    difference: number;
    capitalWorking?: CapitalWorking;
  };
  balanceSheetItems: TrialBalanceBalance[];
  unclassifiedItems: TrialBalanceBalance[];
  errors: string[];
  warnings: string[];
  balanceSheetWarnings: string[];
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

const tradingCreditAccounts = new Set(["sales", "purchase returns", "purchase return", "closing stock", "stock", "inventory"]);

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
  "owner capital",
  "proprietor capital",
  "drawing",
  "drawings",
  "debtor",
  "debtors",
  "sundry debtor",
  "sundry debtors",
  "customer",
  "customers",
  "creditor",
  "creditors",
  "sundry creditor",
  "sundry creditors",
  "supplier",
  "suppliers",
  "machinery",
  "furniture",
  "computer",
  "equipment",
  "vehicle",
  "land",
  "building",
  "prepaid rent",
  "prepaid insurance",
  "prepaid salary",
  "prepaid wages",
  "prepaid electricity",
  "outstanding salary",
  "outstanding rent",
  "outstanding wages",
  "outstanding electricity",
  "outstanding insurance",
  "outstanding expenses",
  "expense payable",
  "salary payable",
  "rent payable",
  "prepaid expenses",
  "accrued interest",
  "accrued commission",
  "accrued rent",
  "accrued income",
  "income receivable",
  "rent received in advance",
  "commission received in advance",
  "interest received in advance",
  "unearned income",
  "income received in advance",
  "loan",
  "loans",
  "bank loan",
  "loan from bank",
  "borrowings",
  "gst",
  "input gst",
  "input cgst",
  "input sgst",
  "input igst",
  "input tax credit",
  "itc",
  "output gst",
  "output cgst",
  "output sgst",
  "output igst",
  "gst payable",
  "closing stock",
  "stock",
  "inventory",
  "asset disposal",
  "accumulated depreciation",
]);

const capitalAccounts = new Set(["capital", "owner capital", "proprietor capital"]);
const drawingAccounts = new Set(["drawing", "drawings"]);
const liabilityAccounts = new Set([
  "creditor",
  "creditors",
  "sundry creditor",
  "sundry creditors",
  "supplier",
  "suppliers",
  "loan",
  "loans",
  "bank loan",
  "loan from bank",
  "borrowings",
  "outstanding expenses",
  "outstanding salary",
  "outstanding rent",
  "outstanding wages",
  "outstanding electricity",
  "outstanding insurance",
  "expense payable",
  "salary payable",
  "rent payable",
  "income received in advance",
  "rent received in advance",
  "commission received in advance",
  "interest received in advance",
  "unearned income",
  "output gst",
  "output cgst",
  "output sgst",
  "output igst",
  "gst payable",
]);
const assetAccounts = new Set([
  "cash",
  "bank",
  "debtor",
  "debtors",
  "sundry debtor",
  "sundry debtors",
  "customer",
  "customers",
  "machinery",
  "furniture",
  "computer",
  "equipment",
  "vehicle",
  "land",
  "building",
  "prepaid expenses",
  "prepaid rent",
  "prepaid insurance",
  "prepaid salary",
  "prepaid wages",
  "prepaid electricity",
  "accrued income",
  "accrued interest",
  "accrued commission",
  "accrued rent",
  "income receivable",
  "input gst",
  "input cgst",
  "input sgst",
  "input igst",
  "input tax credit",
  "itc",
  "closing stock",
  "stock",
  "inventory",
]);

const commonMistakes = [
  "Do not put Cash or Bank in Trading A/c or P&L A/c.",
  "Do not put Capital in Trading A/c or P&L A/c.",
  "Purchases and Sales go to Trading Account.",
  "Rent and Salary usually go to Profit & Loss Account.",
  "Gross Profit is transferred to Profit & Loss Account.",
  "Capital, drawings, assets, and liabilities go to the Balance Sheet.",
];

const logic = [
  "Purchases and direct expenses go to Trading Account.",
  "Sales goes to the credit side of Trading Account.",
  "Gross Profit is transferred to the credit side of Profit & Loss Account.",
  "Indirect expenses such as rent, salary, advertisement, and depreciation go to the debit side of Profit & Loss Account.",
  "Indirect incomes such as commission received and interest received go to the credit side of Profit & Loss Account.",
  "Net Profit is added to Capital, while Net Loss and Drawings are deducted from Capital.",
  "Balance Sheet uses asset, liability, and adjusted capital balances only.",
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
  const balanceSheet = buildBalanceSheet(
    classified.balanceSheetItems,
    profitAndLossAccount.netProfit,
    profitAndLossAccount.netLoss,
  );
  const balanceSheetWarnings = buildBalanceSheetWarnings(balanceSheet, classified.balanceSheetItems, classified.unclassifiedItems);

  return {
    status: "success",
    parsedBalances,
    tradingAccount,
    profitAndLossAccount,
    balanceSheet,
    balanceSheetItems: classified.balanceSheetItems,
    unclassifiedItems: classified.unclassifiedItems,
    errors: [],
    warnings: [...warnings, ...balanceSheetWarnings],
    balanceSheetWarnings,
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

  return titleCaseAccount(cleanDisplayAccountName(withoutAmount));
}

function cleanDisplayAccountName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\ba\s*\/\s*c\b/g, " ")
    .replace(/\s+ac\b/g, " ")
    .replace(/&/g, " and ")
    .replace(/[-_/]/g, " ")
    .replace(/[.:,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    const key = cleanAccountName(balance.account);

    if (["closing stock", "stock", "inventory"].includes(key)) {
      tradingCreditLines.push(toFinalAccountLine(balance));
      balanceSheetItems.push(balance);
      return;
    }

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

function buildBalanceSheet(
  balanceSheetItems: TrialBalanceBalance[],
  netProfit: number,
  netLoss: number,
): FinalAccountsResult["balanceSheet"] {
  const assets: FinalAccountLine[] = [];
  const liabilities: FinalAccountLine[] = [];
  let openingCapital = 0;
  let drawings = 0;

  balanceSheetItems.forEach((item) => {
    const key = cleanAccountName(item.account);

    if (capitalAccounts.has(key)) {
      openingCapital += item.amount;
      return;
    }

    if (drawingAccounts.has(key)) {
      drawings += item.amount;
      return;
    }

    if (liabilityAccounts.has(key)) {
      liabilities.push(toFinalAccountLine(item));
      return;
    }

    if (assetAccounts.has(key)) {
      assets.push(toFinalAccountLine(item));
    }
  });

  const adjustedCapital = openingCapital + netProfit - netLoss - drawings;
  const capitalWorking =
    openingCapital > 0
      ? {
          openingCapital,
          netProfit,
          netLoss,
          drawings,
          adjustedCapital,
        }
      : undefined;

  if (capitalWorking) {
    liabilities.unshift({ account: "Adjusted Capital", amount: adjustedCapital });
  }

  const assetTotal = sumLines(assets);
  const liabilityTotal = sumLines(liabilities);
  const difference = Math.abs(assetTotal - liabilityTotal);

  return {
    assets,
    liabilities,
    assetTotal,
    liabilityTotal,
    agrees: difference === 0,
    difference,
    capitalWorking,
  };
}

function buildBalanceSheetWarnings(
  balanceSheet: FinalAccountsResult["balanceSheet"],
  balanceSheetItems: TrialBalanceBalance[],
  unclassifiedItems: TrialBalanceBalance[],
): string[] {
  const warnings: string[] = [];
  const hasCapital = balanceSheetItems.some((item) => capitalAccounts.has(cleanAccountName(item.account)));

  if (!hasCapital) {
    warnings.push("Capital balance is missing, so Balance Sheet may not agree.");
  }

  if (!balanceSheet.agrees) {
    warnings.push(`Balance Sheet does not agree. Difference: Rs.${balanceSheet.difference}.`);
  }

  if (unclassifiedItems.length > 0) {
    warnings.push("Some accounts could not be classified.");
  }

  return warnings;
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
  | "tradingAccount"
  | "profitAndLossAccount"
  | "balanceSheet"
  | "parsedBalances"
  | "balanceSheetItems"
  | "unclassifiedItems"
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
    balanceSheet: {
      assets: [],
      liabilities: [],
      assetTotal: 0,
      liabilityTotal: 0,
      agrees: true,
      difference: 0,
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
    balanceSheetWarnings: [],
    logic: [],
    commonMistakes,
  };
}
