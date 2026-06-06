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

export type FinalAccountAdjustment = {
  type:
    | "closing_stock"
    | "outstanding_expense"
    | "prepaid_expense"
    | "accrued_income"
    | "income_received_in_advance"
    | "depreciation";
  account: string;
  relatedAccount?: string;
  amount: number;
  rawText: string;
};

export type FinalAccountsResult = {
  status: "success" | "invalid";
  parsedBalances: TrialBalanceBalance[];
  parsedAdjustments: FinalAccountAdjustment[];
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
  unclassifiedAdjustments: string[];
  errors: string[];
  warnings: string[];
  balanceSheetWarnings: string[];
  adjustmentWarnings: string[];
  adjustmentLogic: string[];
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
  "electricity",
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

const supportedAdjustmentAccounts = {
  expenses: ["salary", "rent", "wages", "electricity", "insurance"],
  incomes: ["interest", "commission", "rent"],
  assets: ["machinery", "furniture", "computer", "equipment", "vehicle"],
};

const commonMistakes = [
  "Do not put Cash or Bank in Trading A/c or P&L A/c.",
  "Do not put Capital in Trading A/c or P&L A/c.",
  "Purchases and Sales go to Trading Account.",
  "Rent and Salary usually go to Profit & Loss Account.",
  "Gross Profit is transferred to Profit & Loss Account.",
  "Capital, drawings, assets, and liabilities go to the Balance Sheet.",
  "Do not show closing stock only in Trading A/c; it also appears as an asset.",
  "Outstanding expense increases expense and creates liability.",
  "Prepaid expense reduces expense and creates asset.",
  "Accrued income increases income and creates asset.",
  "Income received in advance reduces income and creates liability.",
  "Depreciation is an expense and reduces the asset value.",
  "Do not double count closing stock if it already appears in Trial Balance.",
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

const adjustmentLogic = [
  "Closing stock is shown on the credit side of Trading A/c and also as an asset in the Balance Sheet.",
  "Outstanding salary is added to salary expense and also shown as a liability.",
  "Prepaid insurance is deducted from insurance expense and shown as an asset.",
  "Accrued interest is added to interest income and shown as an asset.",
  "Rent received in advance is deducted from rent income and shown as a liability.",
  "Depreciation is charged to Profit & Loss A/c and deducted from the related asset.",
];

export function generateFinalAccounts(input: string, adjustmentsInput = ""): FinalAccountsResult {
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

  const adjustmentResult = parseAdjustments(adjustmentsInput);
  const warnings = trialBalanceTotalsAgree(parsedBalances)
    ? []
    : ["Trial Balance totals do not agree. Final accounts may not be reliable."];

  const classified = classifyBalances(parsedBalances);
  const adjustmentWarnings = applyAdjustments(classified, adjustmentResult.parsedAdjustments);
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
  const unclassifiedAdjustmentWarnings = adjustmentResult.unclassifiedAdjustments.length
    ? ["Some adjustments could not be classified."]
    : [];

  return {
    status: "success",
    parsedBalances,
    parsedAdjustments: adjustmentResult.parsedAdjustments,
    tradingAccount,
    profitAndLossAccount,
    balanceSheet,
    balanceSheetItems: classified.balanceSheetItems,
    unclassifiedItems: classified.unclassifiedItems,
    unclassifiedAdjustments: adjustmentResult.unclassifiedAdjustments,
    errors: [],
    warnings: [...warnings, ...adjustmentWarnings, ...unclassifiedAdjustmentWarnings, ...balanceSheetWarnings],
    balanceSheetWarnings,
    adjustmentWarnings: [...adjustmentWarnings, ...unclassifiedAdjustmentWarnings],
    adjustmentLogic,
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

function parseAdjustments(input: string): {
  parsedAdjustments: FinalAccountAdjustment[];
  unclassifiedAdjustments: string[];
} {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const parsedAdjustments: FinalAccountAdjustment[] = [];
  const unclassifiedAdjustments: string[] = [];

  lines.forEach((line) => {
    const parsed = parseAdjustmentLine(line);
    if (parsed) {
      parsedAdjustments.push(parsed);
    } else {
      unclassifiedAdjustments.push(line);
    }
  });

  return { parsedAdjustments, unclassifiedAdjustments };
}

function parseAdjustmentLine(line: string): FinalAccountAdjustment | null {
  const amount = extractAmount(line);
  if (!amount) return null;

  const text = cleanDisplayAccountName(removeFirstAmount(line));

  if (/\bclosing stock\b/.test(text) || /\bstock at end\b/.test(text)) {
    return {
      type: "closing_stock",
      account: "Closing Stock",
      amount,
      rawText: line,
    };
  }

  const outstandingExpense = findRelatedWord(text, supportedAdjustmentAccounts.expenses, [
    (word) => `${word} outstanding`,
    (word) => `outstanding ${word}`,
  ]);
  if (outstandingExpense) {
    return {
      type: "outstanding_expense",
      account: `Outstanding ${titleCaseAccount(outstandingExpense)}`,
      relatedAccount: titleCaseAccount(outstandingExpense),
      amount,
      rawText: line,
    };
  }

  const prepaidExpense = findRelatedWord(text, supportedAdjustmentAccounts.expenses, [
    (word) => `prepaid ${word}`,
    (word) => `${word} prepaid`,
    (word) => `${word} paid in advance`,
  ]);
  if (prepaidExpense) {
    return {
      type: "prepaid_expense",
      account: `Prepaid ${titleCaseAccount(prepaidExpense)}`,
      relatedAccount: titleCaseAccount(prepaidExpense),
      amount,
      rawText: line,
    };
  }

  const accruedIncome = findRelatedWord(text, supportedAdjustmentAccounts.incomes, [
    (word) => `${word} accrued`,
    (word) => `accrued ${word}`,
    (word) => `${word} receivable`,
  ]);
  if (accruedIncome) {
    return {
      type: "accrued_income",
      account: `Accrued ${titleCaseAccount(accruedIncome)}`,
      relatedAccount: `${titleCaseAccount(accruedIncome)} Income`,
      amount,
      rawText: line,
    };
  }

  const advanceIncome = findRelatedWord(text, supportedAdjustmentAccounts.incomes, [
    (word) => `${word} received in advance`,
    (word) => `unearned ${word}`,
  ]);
  if (advanceIncome) {
    return {
      type: "income_received_in_advance",
      account: `${titleCaseAccount(advanceIncome)} Received In Advance`,
      relatedAccount: `${titleCaseAccount(advanceIncome)} Income`,
      amount,
      rawText: line,
    };
  }

  const depreciationAsset = findRelatedWord(text, supportedAdjustmentAccounts.assets, [
    (word) => `depreciation on ${word}`,
    (word) => `depreciation charged on ${word}`,
  ]);
  if (depreciationAsset) {
    return {
      type: "depreciation",
      account: "Depreciation",
      relatedAccount: titleCaseAccount(depreciationAsset),
      amount,
      rawText: line,
    };
  }

  return null;
}

function applyAdjustments(
  classified: {
    tradingDebitLines: FinalAccountLine[];
    tradingCreditLines: FinalAccountLine[];
    profitAndLossDebitLines: FinalAccountLine[];
    profitAndLossCreditLines: FinalAccountLine[];
    balanceSheetItems: TrialBalanceBalance[];
  },
  adjustments: FinalAccountAdjustment[],
): string[] {
  const warnings: string[] = [];

  adjustments.forEach((adjustment) => {
    if (adjustment.type === "closing_stock") {
      addAmount(classified.tradingCreditLines, adjustment.account, adjustment.amount);
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount: adjustment.amount,
      });
      return;
    }

    if (adjustment.type === "outstanding_expense") {
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      if (
        !addAmountIfExists(classified.tradingDebitLines, relatedAccount, adjustment.amount) &&
        !addAmountIfExists(classified.profitAndLossDebitLines, relatedAccount, adjustment.amount)
      ) {
        addAmount(classified.profitAndLossDebitLines, relatedAccount, adjustment.amount);
      }
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "credit",
        amount: adjustment.amount,
      });
      return;
    }

    if (adjustment.type === "prepaid_expense") {
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      const reduced =
        reduceAmountIfExists(classified.profitAndLossDebitLines, relatedAccount, adjustment.amount) ||
        reduceAmountIfExists(classified.tradingDebitLines, relatedAccount, adjustment.amount);

      if (!reduced) {
        warnings.push(`Related expense not found for ${cleanAccountName(adjustment.account)}.`);
      }

      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount: adjustment.amount,
      });
      return;
    }

    if (adjustment.type === "accrued_income") {
      addAmount(classified.profitAndLossCreditLines, adjustment.relatedAccount ?? adjustment.account, adjustment.amount);
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount: adjustment.amount,
      });
      return;
    }

    if (adjustment.type === "income_received_in_advance") {
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      const reduced = reduceAmountIfExists(classified.profitAndLossCreditLines, relatedAccount, adjustment.amount);

      if (!reduced) {
        warnings.push(`Related income not found for ${cleanAccountName(adjustment.account)}.`);
      }

      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "credit",
        amount: adjustment.amount,
      });
      return;
    }

    if (adjustment.type === "depreciation") {
      addAmount(classified.profitAndLossDebitLines, adjustment.account, adjustment.amount);
      const relatedAccount = adjustment.relatedAccount ?? "";
      const reduced = reduceBalanceSheetAsset(classified.balanceSheetItems, relatedAccount, adjustment.amount);

      if (!reduced) {
        warnings.push(`Related asset not found for depreciation on ${cleanAccountName(relatedAccount)}.`);
      }
    }
  });

  return warnings;
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

function findRelatedWord(
  text: string,
  words: string[],
  patterns: Array<(word: string) => string>,
): string | null {
  return (
    words.find((word) =>
      patterns.some((pattern) => {
        const phrase = pattern(word);
        return new RegExp(`\\b${escapeRegExp(phrase)}\\b`).test(text);
      }),
    ) ?? null
  );
}

function addAmount(lines: FinalAccountLine[], account: string, amount: number): void {
  const existing = lines.find((line) => cleanAccountName(line.account) === cleanAccountName(account));
  if (existing) {
    existing.amount += amount;
    return;
  }

  lines.push({ account, amount });
}

function addAmountIfExists(lines: FinalAccountLine[], account: string, amount: number): boolean {
  const existing = lines.find((line) => cleanAccountName(line.account) === cleanAccountName(account));
  if (!existing) return false;

  existing.amount += amount;
  return true;
}

function reduceAmountIfExists(lines: FinalAccountLine[], account: string, amount: number): boolean {
  const existing = lines.find((line) => cleanAccountName(line.account) === cleanAccountName(account));
  if (!existing) return false;

  existing.amount = Math.max(existing.amount - amount, 0);
  return true;
}

function reduceBalanceSheetAsset(items: TrialBalanceBalance[], account: string, amount: number): boolean {
  const existing = items.find((item) => item.side === "debit" && cleanAccountName(item.account) === cleanAccountName(account));
  if (!existing) return false;

  existing.amount = Math.max(existing.amount - amount, 0);
  return true;
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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function emptyAccounts(): Pick<
  FinalAccountsResult,
  | "tradingAccount"
  | "profitAndLossAccount"
  | "balanceSheet"
  | "parsedBalances"
  | "parsedAdjustments"
  | "balanceSheetItems"
  | "unclassifiedItems"
  | "unclassifiedAdjustments"
> {
  return {
    parsedBalances: [],
    parsedAdjustments: [],
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
    unclassifiedAdjustments: [],
  };
}

function invalidResult(errors: string[]): FinalAccountsResult {
  return {
    status: "invalid",
    ...emptyAccounts(),
    errors,
    warnings: [],
    balanceSheetWarnings: [],
    adjustmentWarnings: [],
    adjustmentLogic: [],
    logic: [],
    commonMistakes,
  };
}
