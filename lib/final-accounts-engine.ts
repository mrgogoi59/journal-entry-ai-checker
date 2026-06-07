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
  goodsWithdrawnByProprietor: number;
  adjustedCapital: number;
};

export type ProvisionForDoubtfulDebtsWorking = {
  debtors: number;
  furtherBadDebts: number;
  adjustedDebtors: number;
  existingProvision: number;
  requiredProvision: number;
  increase: number;
  decrease: number;
  pnlEffect: "debit" | "credit" | "none";
  netDebtors: number;
};

export type ProvisionForDiscountOnDebtorsWorking = {
  debtors: number;
  furtherBadDebts: number;
  adjustedDebtors: number;
  provisionForDoubtfulDebts: number;
  goodDebtors: number;
  existingProvision: number;
  requiredProvision: number;
  increase: number;
  decrease: number;
  pnlEffect: "debit" | "credit" | "none";
  netDebtors: number;
};

export type ProvisionForDiscountOnCreditorsWorking = {
  creditors: number;
  existingProvision: number;
  requiredProvision: number;
  increase: number;
  decrease: number;
  pnlEffect: "debit" | "credit" | "none";
  netCreditors: number;
};

export type ManagerCommissionWorking = {
  basis: "fixed" | "before_commission" | "after_commission";
  profitBeforeCommission: number;
  percentage?: number;
  commission: number;
  netProfitAfterCommission: number;
};

export type FinalAccountAdjustment = {
  type:
    | "closing_stock"
    | "outstanding_expense"
    | "prepaid_expense"
    | "accrued_income"
    | "income_received_in_advance"
    | "depreciation"
    | "provision_for_doubtful_debts"
    | "manager_commission"
    | "further_bad_debts"
    | "provision_for_discount_on_debtors"
    | "provision_for_discount_on_creditors"
    | "goods_withdrawn_by_proprietor"
    | "goods_distributed_free_sample"
    | "goods_given_as_charity"
    | "goods_lost";
  account: string;
  relatedAccount?: string;
  amount?: number;
  percentage?: number;
  basis?: "fixed" | "before_commission" | "after_commission";
  lossKind?: "fire" | "theft" | "general";
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
    provisionForDoubtfulDebtsWorking?: ProvisionForDoubtfulDebtsWorking;
    provisionForDiscountOnDebtorsWorking?: ProvisionForDiscountOnDebtorsWorking;
    provisionForDiscountOnCreditorsWorking?: ProvisionForDiscountOnCreditorsWorking;
    managerCommissionWorking?: ManagerCommissionWorking;
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
  "charity expense",
  "donation expense",
  "loss by fire",
  "loss by theft",
  "goods lost",
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
  "trade debtor",
  "trade debtors",
  "accounts receivable",
  "customer",
  "customers",
  "creditor",
  "creditors",
  "sundry creditor",
  "sundry creditors",
  "trade creditor",
  "trade creditors",
  "accounts payable",
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
  "provision for doubtful debts",
  "provision for bad debts",
  "reserve for doubtful debts",
  "doubtful debts provision",
  "provision for discount on debtors",
  "discount on debtors provision",
  "provision for debtors discount",
  "debtors discount provision",
  "provision for discount on creditors",
  "discount on creditors provision",
  "provision for creditors discount",
  "creditors discount provision",
]);

const capitalAccounts = new Set(["capital", "owner capital", "proprietor capital"]);
const drawingAccounts = new Set(["drawing", "drawings"]);
const liabilityAccounts = new Set([
  "creditor",
  "creditors",
  "sundry creditor",
  "sundry creditors",
  "trade creditor",
  "trade creditors",
  "accounts payable",
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
  "trade debtor",
  "trade debtors",
  "accounts receivable",
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

const debtorAccounts = new Set([
  "debtor",
  "debtors",
  "sundry debtor",
  "sundry debtors",
  "trade debtor",
  "trade debtors",
  "accounts receivable",
  "customer",
  "customers",
]);

const creditorAccounts = new Set([
  "creditor",
  "creditors",
  "sundry creditor",
  "sundry creditors",
  "trade creditor",
  "trade creditors",
  "accounts payable",
  "supplier",
  "suppliers",
]);

const provisionForDoubtfulDebtsAccounts = new Set([
  "provision for doubtful debts",
  "provision for bad debts",
  "reserve for doubtful debts",
  "doubtful debts provision",
]);

const provisionForDiscountOnDebtorsAccounts = new Set([
  "provision for discount on debtors",
  "discount on debtors provision",
  "provision for debtors discount",
  "debtors discount provision",
]);

const provisionForDiscountOnCreditorsAccounts = new Set([
  "provision for discount on creditors",
  "discount on creditors provision",
  "provision for creditors discount",
  "creditors discount provision",
]);

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
  "Do not show Provision for Doubtful Debts as a normal liability when it is adjusted against Debtors.",
  "Do not deduct the provision twice.",
  "Do not debit the full required provision to P&L when an existing provision already exists.",
  "Use only the increase or decrease in provision in P&L.",
  "Deduct the required closing provision from Debtors in the Balance Sheet.",
  "Do not calculate provision on original debtors when further bad debts are given.",
  "Deduct further bad debts first, then calculate provision.",
  "Do not deduct further bad debts twice.",
  "Balance Sheet should show net debtors after further bad debts and provision.",
  "Do not calculate discount provision on original debtors.",
  "Deduct provision for doubtful debts before calculating discount provision.",
  "Do not show Provision for Discount on Debtors as a normal liability.",
  "Do not deduct the discount provision twice.",
  "Balance Sheet should show net debtors after all debtor-related adjustments.",
  "Do not show Provision for Discount on Creditors as a normal asset or liability.",
  "Do not add provision for discount on creditors to creditors.",
  "Deduct provision for discount on creditors from creditors in the Balance Sheet.",
  "Increase in provision for discount on creditors is a gain and goes to P&L credit side.",
  "Decrease in provision for discount on creditors goes to P&L debit side.",
  "Do not confuse discount on debtors with discount on creditors.",
  "Do not show goods withdrawn as Sales.",
  "Do not show goods withdrawn as an expense in P&L.",
  "Deduct goods withdrawn from Purchases.",
  "Treat goods withdrawn as Drawings in Capital Working.",
  "Do not show goods withdrawn as Cash or Bank.",
  "Do not show goods distributed as free samples as Sales.",
  "Do not treat free samples as Drawings.",
  "Deduct free samples from Purchases.",
  "Add free samples to Advertisement Expense in P&L.",
  "Do not show free samples as Cash or Bank.",
  "Do not show free samples as a Balance Sheet asset or liability.",
  "Do not show goods given as charity as Sales.",
  "Do not treat charity goods as Drawings.",
  "Do not treat charity goods as Advertisement Expense.",
  "Deduct charity goods from Purchases.",
  "Add charity goods to Charity or Donation Expense in P&L.",
  "Do not show charity goods as Cash or Bank.",
  "Do not show charity goods as a Balance Sheet asset or liability.",
  "Do not show goods lost as Sales.",
  "Do not treat goods lost as Drawings.",
  "Do not treat goods lost as Advertisement Expense.",
  "Do not treat goods lost as Charity Expense.",
  "Deduct goods lost from Purchases.",
  "Add goods lost to Profit & Loss A/c as a loss.",
  "Do not show goods lost as Cash or Bank.",
  "Do not show goods lost as a Balance Sheet item unless insurance claim logic is added later.",
  "Do not calculate 'after commission' commission as a simple percentage of profit before commission.",
  "Use formula Profit before commission x rate / (100 + rate) for commission after charging commission.",
  "Manager's commission is an expense, not a trading item.",
  "If unpaid, manager's commission is shown as a liability.",
  "Net Profit should be calculated after deducting manager's commission.",
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
  "Provision for doubtful debts is deducted from Debtors in the Balance Sheet.",
  "If required provision is more than existing provision, only the increase is debited to Profit & Loss A/c.",
  "If required provision is less than existing provision, the decrease is credited to Profit & Loss A/c.",
  "Provision is calculated on debtors unless a fixed required amount is given.",
  "Further bad debts are first deducted from Debtors.",
  "Provision for doubtful debts is calculated on Debtors after deducting further bad debts.",
  "Further bad debts are debited to Profit & Loss A/c.",
  "Net Debtors are shown in the Balance Sheet after deducting further bad debts and required provision.",
  "Provision for discount on debtors is calculated after deducting further bad debts and provision for doubtful debts.",
  "Provision for discount on debtors is deducted from Debtors in the Balance Sheet.",
  "If required discount provision is more than existing provision, only the increase is debited to Profit & Loss A/c.",
  "If required discount provision is less than existing provision, only the decrease is credited to Profit & Loss A/c.",
  "Net Debtors are shown after deducting further bad debts, provision for doubtful debts, and provision for discount on debtors.",
  "Provision for discount on creditors is calculated on creditors.",
  "Provision for discount on creditors is deducted from Creditors in the Balance Sheet.",
  "If required creditor discount provision is more than existing provision, only the increase is credited to Profit & Loss A/c.",
  "If required creditor discount provision is less than existing provision, only the decrease is debited to Profit & Loss A/c.",
  "Net Creditors are shown after deducting provision for discount on creditors.",
  "Goods withdrawn by proprietor are deducted from Purchases because goods are taken out of business stock.",
  "Goods withdrawn by proprietor are treated like Drawings and deducted from Capital.",
  "Goods withdrawn are not treated as sales because the owner took goods for personal use.",
  "Goods distributed as free samples are deducted from Purchases because goods are taken out of stock.",
  "Goods distributed as free samples are treated as advertisement or promotion expense and debited to Profit & Loss A/c.",
  "Free samples are not treated as Sales because no selling price is received.",
  "Free samples are not treated as Drawings because the owner did not take them for personal use.",
  "Goods given as charity are deducted from Purchases because goods are taken out of business stock.",
  "Goods given as charity are treated as charity or donation expense and debited to Profit & Loss A/c.",
  "Charity goods are not treated as Sales because no selling price is received.",
  "Charity goods are not treated as Drawings because the owner did not take them for personal use.",
  "Charity goods are not treated as Advertisement Expense because they were given as charity or donation, not for promotion.",
  "Goods lost by fire, theft, or accident are deducted from Purchases because goods are taken out of business stock.",
  "Goods lost by fire or theft are treated as a loss and debited to Profit & Loss A/c.",
  "Goods lost are not treated as Sales because no sale takes place.",
  "Goods lost are not treated as Drawings because the owner did not take them for personal use.",
  "Insurance claim treatment for goods lost is not included in this MVP.",
  "Manager's commission is treated as an expense and debited to Profit & Loss A/c.",
  "If commission is based on net profit before commission, it is calculated directly on profit before commission.",
  "If commission is based on net profit after commission, formula used is: Profit before commission x rate / (100 + rate).",
  "Manager's Commission Payable is shown as a liability in the Balance Sheet.",
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
  const managerCommissionAdjustment = adjustmentResult.parsedAdjustments.find(
    (adjustment) => adjustment.type === "manager_commission",
  );
  let profitAndLossAccount = buildProfitAndLossAccount(
    classified.profitAndLossDebitLines,
    classified.profitAndLossCreditLines,
    tradingAccount.grossProfit,
    tradingAccount.grossLoss,
  );
  const managerCommissionResult = applyManagerCommission(
    classified,
    profitAndLossAccount,
    managerCommissionAdjustment,
  );
  profitAndLossAccount = buildProfitAndLossAccount(
    classified.profitAndLossDebitLines,
    classified.profitAndLossCreditLines,
    tradingAccount.grossProfit,
    tradingAccount.grossLoss,
  );
  const balanceSheet = buildBalanceSheet(
    classified.balanceSheetItems,
    profitAndLossAccount.netProfit,
    profitAndLossAccount.netLoss,
    classified.furtherBadDebts,
    classified.goodsWithdrawnByProprietor,
    classified.provisionForDoubtfulDebtsWorking,
    classified.provisionForDiscountOnDebtorsWorking,
    classified.provisionForDiscountOnCreditorsWorking,
    managerCommissionResult.working,
  );
  const balanceSheetWarnings = buildBalanceSheetWarnings(balanceSheet, classified.balanceSheetItems, classified.unclassifiedItems);
  const unsupportedAdjustmentWarnings = adjustmentResult.warnings;
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
    warnings: [
      ...warnings,
      ...adjustmentWarnings,
      ...managerCommissionResult.warnings,
      ...unsupportedAdjustmentWarnings,
      ...unclassifiedAdjustmentWarnings,
      ...balanceSheetWarnings,
    ],
    balanceSheetWarnings,
    adjustmentWarnings: [
      ...adjustmentWarnings,
      ...managerCommissionResult.warnings,
      ...unsupportedAdjustmentWarnings,
      ...unclassifiedAdjustmentWarnings,
    ],
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
    .replace(/['’]/g, " ")
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
  provisionForDoubtfulDebtsWorking?: ProvisionForDoubtfulDebtsWorking;
  provisionForDiscountOnDebtorsWorking?: ProvisionForDiscountOnDebtorsWorking;
  provisionForDiscountOnCreditorsWorking?: ProvisionForDiscountOnCreditorsWorking;
  furtherBadDebts: number;
  goodsWithdrawnByProprietor: number;
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
      balanceSheetItems.push(cloneBalance(balance));
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
      balanceSheetItems.push(cloneBalance(balance));
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
    furtherBadDebts: 0,
    goodsWithdrawnByProprietor: 0,
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
  warnings: string[];
} {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const parsedAdjustments: FinalAccountAdjustment[] = [];
  const unclassifiedAdjustments: string[] = [];
  const warnings: string[] = [];

  lines.forEach((line) => {
    if (isUnsupportedGoodsLostInsuranceAdjustment(line)) {
      unclassifiedAdjustments.push(line);
      warnings.push("Goods lost with insurance claim is not supported yet.");
      return;
    }

    const parsed = parseAdjustmentLine(line);
    if (parsed) {
      parsedAdjustments.push(parsed);
    } else {
      unclassifiedAdjustments.push(line);
    }
  });

  return { parsedAdjustments, unclassifiedAdjustments, warnings };
}

function isUnsupportedGoodsLostInsuranceAdjustment(line: string): boolean {
  const text = cleanDisplayAccountName(line);
  return (
    /\bgoods\b/.test(text) &&
    /\b(lost|destroyed|damaged|burnt|stolen|theft|fire)\b/.test(text) &&
    /\b(insurance|claim|claimed|admitted|accepted|pending|received|recoverable)\b/.test(text)
  );
}

function parseAdjustmentLine(line: string): FinalAccountAdjustment | null {
  const amount = extractAmount(line);
  const percentage = extractPercentage(line);
  if (!amount && percentage === null) return null;

  const text = cleanDisplayAccountName(percentage !== null ? line : amount ? removeFirstAmount(line) : line);

  if (/\b(goods lost by fire|goods worth lost by fire|goods destroyed by fire|goods worth destroyed by fire|goods damaged by fire|goods burnt by fire|goods worth burnt in fire|goods burnt in fire|fire destroyed goods worth|goods lost due to fire)\b/.test(text)) {
    if (!amount) return null;
    return {
      type: "goods_lost",
      account: "Loss by Fire",
      amount,
      lossKind: "fire",
      rawText: line,
    };
  }

  if (/\b(goods lost by theft|goods worth lost by theft|goods stolen|goods worth stolen|goods stolen by thief|goods lost due to theft|theft of goods|goods stolen from business)\b/.test(text)) {
    if (!amount) return null;
    return {
      type: "goods_lost",
      account: "Loss by Theft",
      amount,
      lossKind: "theft",
      rawText: line,
    };
  }

  if (/\b(goods lost|goods worth lost|goods damaged|goods worth damaged|goods lost due to accident|goods worth lost due to accident|goods lost due to damage|goods destroyed|goods worth destroyed)\b/.test(text)) {
    if (!amount) return null;
    return {
      type: "goods_lost",
      account: "Goods Lost",
      amount,
      lossKind: "general",
      rawText: line,
    };
  }

  if (
    /\b(goods given as charity|goods given to charity|goods worth given as charity|goods worth given to charity|goods donated|goods worth donated|goods donated to charity|goods worth donated to charity|goods given as donation|goods worth given as donation|goods donated to poor people|goods given to poor people|goods donated to orphanage|goods given to orphanage|goods used for charity|goods used for donation)\b/.test(
      text,
    )
  ) {
    if (!amount) return null;
    return {
      type: "goods_given_as_charity",
      account: "Goods Given as Charity",
      amount,
      rawText: line,
    };
  }

  if (
    /\b(goods distributed as free sample|goods distributed as free samples|goods worth distributed as free sample|goods worth distributed as free samples|goods given as free sample|goods worth given as free sample|goods used as free sample|goods distributed for advertisement|goods used for advertisement|goods distributed for promotion|goods used for promotion|free samples distributed|promotional samples distributed|goods given away as free sample)\b/.test(
      text,
    )
  ) {
    if (!amount) return null;
    return {
      type: "goods_distributed_free_sample",
      account: "Goods Distributed as Free Sample",
      amount,
      rawText: line,
    };
  }

  if (
    /\b(goods withdrawn by proprietor|goods withdrawn by owner|proprietor withdrew goods|owner withdrew goods|goods taken by proprietor for personal use|goods taken by owner for personal use|goods withdrawn for personal use|goods withdrawn by proprietor for personal use|goods withdrawn by owner for home use|goods worth withdrawn by proprietor for personal use|goods worth taken by owner for household use|proprietor used goods for personal use)\b/.test(
      text,
    )
  ) {
    if (!amount) return null;
    return {
      type: "goods_withdrawn_by_proprietor",
      account: "Goods Withdrawn by Proprietor",
      amount,
      rawText: line,
    };
  }

  if (/\b(discount on creditors|discount on good creditors|creditors discount)\b/.test(text)) {
    if (percentage !== null) {
      return {
        type: "provision_for_discount_on_creditors",
        account: "Provision for Discount on Creditors",
        relatedAccount: "Creditors",
        percentage,
        rawText: line,
      };
    }

    if (amount) {
      return {
        type: "provision_for_discount_on_creditors",
        account: "Provision for Discount on Creditors",
        relatedAccount: "Creditors",
        amount,
        rawText: line,
      };
    }
  }

  if (/\b(discount on debtors|discount on good debtors|debtors discount)\b/.test(text)) {
    if (percentage !== null) {
      return {
        type: "provision_for_discount_on_debtors",
        account: "Provision for Discount on Debtors",
        relatedAccount: "Debtors",
        percentage,
        rawText: line,
      };
    }

    if (amount) {
      return {
        type: "provision_for_discount_on_debtors",
        account: "Provision for Discount on Debtors",
        relatedAccount: "Debtors",
        amount,
        rawText: line,
      };
    }
  }

  if (/\b(provision for doubtful debts|provision for bad debts|doubtful debts)\b/.test(text)) {
    if (percentage !== null) {
      return {
        type: "provision_for_doubtful_debts",
        account: "Provision for Doubtful Debts",
        relatedAccount: "Debtors",
        percentage,
        rawText: line,
      };
    }

    if (amount) {
      return {
        type: "provision_for_doubtful_debts",
        account: "Provision for Doubtful Debts",
        relatedAccount: "Debtors",
        amount,
        rawText: line,
      };
    }
  }

  if (
    /\b(manager s commission|manager commission|managers commission|commission payable to manager|commission to manager|manager is entitled)\b/.test(
      text,
    )
  ) {
    if (percentage !== null) {
      const basis =
        /\b(after commission|after charging commission|net profit after commission)\b/.test(text)
          ? "after_commission"
          : "before_commission";

      return {
        type: "manager_commission",
        account: "Manager's Commission",
        percentage,
        basis,
        rawText: line,
      };
    }

    if (amount) {
      return {
        type: "manager_commission",
        account: "Manager's Commission",
        amount,
        basis: "fixed",
        rawText: line,
      };
    }
  }

  if (
    /\b(further bad debts|additional bad debts|bad debts further written off|bad debts to be written off|write off further bad debts|further bad debts written off|additional bad debts written off)\b/.test(
      text,
    )
  ) {
    if (!amount) return null;
    return {
      type: "further_bad_debts",
      account: "Further Bad Debts",
      amount,
      rawText: line,
    };
  }

  if (/\bclosing stock\b/.test(text) || /\bstock at end\b/.test(text)) {
    if (!amount) return null;
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
    if (!amount) return null;
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
    if (!amount) return null;
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
    if (!amount) return null;
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
    if (!amount) return null;
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
    if (!amount) return null;
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

function extractPercentage(line: string): number | null {
  const match = line.match(/(?:@|at)?\s*([0-9]+(?:\.\d+)?)\s*%/i);
  if (!match) return null;

  const percentage = Number(match[1]);
  return Number.isFinite(percentage) && percentage > 0 ? percentage : null;
}

function applyAdjustments(
  classified: {
    tradingDebitLines: FinalAccountLine[];
    tradingCreditLines: FinalAccountLine[];
    profitAndLossDebitLines: FinalAccountLine[];
    profitAndLossCreditLines: FinalAccountLine[];
    balanceSheetItems: TrialBalanceBalance[];
    provisionForDoubtfulDebtsWorking?: ProvisionForDoubtfulDebtsWorking;
    provisionForDiscountOnDebtorsWorking?: ProvisionForDiscountOnDebtorsWorking;
    provisionForDiscountOnCreditorsWorking?: ProvisionForDiscountOnCreditorsWorking;
    furtherBadDebts?: number;
    goodsWithdrawnByProprietor?: number;
  },
  adjustments: FinalAccountAdjustment[],
): string[] {
  const warnings: string[] = [];

  const provisionAdjustments = adjustments.filter((adjustment) => adjustment.type === "provision_for_doubtful_debts");
  const discountProvisionAdjustments = adjustments.filter(
    (adjustment) => adjustment.type === "provision_for_discount_on_debtors",
  );
  const creditorDiscountProvisionAdjustments = adjustments.filter(
    (adjustment) => adjustment.type === "provision_for_discount_on_creditors",
  );

  adjustments.forEach((adjustment) => {
    if (
      adjustment.type === "provision_for_doubtful_debts" ||
      adjustment.type === "provision_for_discount_on_debtors" ||
      adjustment.type === "provision_for_discount_on_creditors"
    ) {
      return;
    }

    if (adjustment.type === "further_bad_debts") {
      const amount = adjustment.amount ?? 0;
      classified.furtherBadDebts = (classified.furtherBadDebts ?? 0) + amount;
      addAmount(classified.profitAndLossDebitLines, adjustment.account, amount);
      return;
    }

    if (adjustment.type === "goods_withdrawn_by_proprietor") {
      const amount = adjustment.amount ?? 0;
      classified.goodsWithdrawnByProprietor = (classified.goodsWithdrawnByProprietor ?? 0) + amount;
      const purchaseWarning = reducePurchasesForGoodsWithdrawn(classified.tradingDebitLines, amount);
      if (purchaseWarning) {
        warnings.push(purchaseWarning);
      }
      return;
    }

    if (adjustment.type === "goods_distributed_free_sample") {
      const amount = adjustment.amount ?? 0;
      const purchaseWarning = reducePurchasesForFreeSample(classified.tradingDebitLines, amount);
      if (purchaseWarning) {
        warnings.push(purchaseWarning);
      }
      addAmount(classified.profitAndLossDebitLines, "Advertisement Expense", amount);
      return;
    }

    if (adjustment.type === "goods_given_as_charity") {
      const amount = adjustment.amount ?? 0;
      const purchaseWarning = reducePurchasesForCharity(classified.tradingDebitLines, amount);
      if (purchaseWarning) {
        warnings.push(purchaseWarning);
      }
      addCharityExpense(classified.profitAndLossDebitLines, amount);
      return;
    }

    if (adjustment.type === "goods_lost") {
      const amount = adjustment.amount ?? 0;
      const purchaseWarning = reducePurchasesForGoodsLost(classified.tradingDebitLines, amount);
      if (purchaseWarning) {
        warnings.push(purchaseWarning);
      }
      addAmount(classified.profitAndLossDebitLines, adjustment.account, amount);
      return;
    }

    if (adjustment.type === "closing_stock") {
      const amount = adjustment.amount ?? 0;
      addAmount(classified.tradingCreditLines, adjustment.account, amount);
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount,
      });
      return;
    }

    if (adjustment.type === "outstanding_expense") {
      const amount = adjustment.amount ?? 0;
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      if (
        !addAmountIfExists(classified.tradingDebitLines, relatedAccount, amount) &&
        !addAmountIfExists(classified.profitAndLossDebitLines, relatedAccount, amount)
      ) {
        addAmount(classified.profitAndLossDebitLines, relatedAccount, amount);
      }
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "credit",
        amount,
      });
      return;
    }

    if (adjustment.type === "prepaid_expense") {
      const amount = adjustment.amount ?? 0;
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      const reduced =
        reduceAmountIfExists(classified.profitAndLossDebitLines, relatedAccount, amount) ||
        reduceAmountIfExists(classified.tradingDebitLines, relatedAccount, amount);

      if (!reduced) {
        warnings.push(`Related expense not found for ${cleanAccountName(adjustment.account)}.`);
      }

      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount,
      });
      return;
    }

    if (adjustment.type === "accrued_income") {
      const amount = adjustment.amount ?? 0;
      addAmount(classified.profitAndLossCreditLines, adjustment.relatedAccount ?? adjustment.account, amount);
      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "debit",
        amount,
      });
      return;
    }

    if (adjustment.type === "income_received_in_advance") {
      const amount = adjustment.amount ?? 0;
      const relatedAccount = adjustment.relatedAccount ?? adjustment.account;
      const reduced = reduceAmountIfExists(classified.profitAndLossCreditLines, relatedAccount, amount);

      if (!reduced) {
        warnings.push(`Related income not found for ${cleanAccountName(adjustment.account)}.`);
      }

      classified.balanceSheetItems.push({
        account: adjustment.account,
        side: "credit",
        amount,
      });
      return;
    }

    if (adjustment.type === "depreciation") {
      const amount = adjustment.amount ?? 0;
      addAmount(classified.profitAndLossDebitLines, adjustment.account, amount);
      const relatedAccount = adjustment.relatedAccount ?? "";
      const reduced = reduceBalanceSheetAsset(classified.balanceSheetItems, relatedAccount, amount);

      if (!reduced) {
        warnings.push(`Related asset not found for depreciation on ${cleanAccountName(relatedAccount)}.`);
      }
      return;
    }

  });

  provisionAdjustments.forEach((adjustment) => {
    const working = buildProvisionForDoubtfulDebtsWorking(
      classified.balanceSheetItems,
      adjustment,
      classified.furtherBadDebts ?? 0,
    );

    if (!working) {
      if (adjustment.amount) {
        warnings.push("Debtors balance not found, so Balance Sheet deduction for provision for doubtful debts cannot be shown.");
        addAmount(classified.profitAndLossDebitLines, adjustment.account, adjustment.amount);
      } else {
        warnings.push("Debtors balance not found, so provision for doubtful debts could not be calculated.");
      }
      return;
    }

    classified.provisionForDoubtfulDebtsWorking = working;

    if (working.pnlEffect === "debit") {
      addAmount(classified.profitAndLossDebitLines, adjustment.account, working.increase);
    }

    if (working.pnlEffect === "credit") {
      addAmount(classified.profitAndLossCreditLines, adjustment.account, working.decrease);
    }
  });

  discountProvisionAdjustments.forEach((adjustment) => {
    const working = buildProvisionForDiscountOnDebtorsWorking(
      classified.balanceSheetItems,
      adjustment,
      classified.furtherBadDebts ?? 0,
      classified.provisionForDoubtfulDebtsWorking?.requiredProvision ?? 0,
    );

    if (!working) {
      if (adjustment.amount) {
        warnings.push(
          "Debtors balance not found, so Balance Sheet deduction for provision for discount on debtors cannot be shown.",
        );
        addAmount(classified.profitAndLossDebitLines, adjustment.account, adjustment.amount);
      } else {
        warnings.push("Debtors balance not found, so provision for discount on debtors could not be calculated.");
      }
      return;
    }

    classified.provisionForDiscountOnDebtorsWorking = working;

    if (working.pnlEffect === "debit") {
      addAmount(classified.profitAndLossDebitLines, adjustment.account, working.increase);
    }

    if (working.pnlEffect === "credit") {
      addAmount(classified.profitAndLossCreditLines, adjustment.account, working.decrease);
    }
  });

  creditorDiscountProvisionAdjustments.forEach((adjustment) => {
    const working = buildProvisionForDiscountOnCreditorsWorking(classified.balanceSheetItems, adjustment);

    if (!working) {
      if (adjustment.amount) {
        warnings.push(
          "Creditors balance not found, so Balance Sheet deduction for provision for discount on creditors cannot be shown.",
        );
      } else {
        warnings.push("Creditors balance not found, so provision for discount on creditors could not be calculated.");
      }
      return;
    }

    classified.provisionForDiscountOnCreditorsWorking = working;

    if (classified.balanceSheetItems.some(isCreditSideProvisionForDiscountOnCreditors)) {
      warnings.push("Provision for Discount on Creditors usually appears as a debit balance. Please check the side.");
    }

    if (working.pnlEffect === "credit") {
      addAmount(classified.profitAndLossCreditLines, adjustment.account, working.increase);
    }

    if (working.pnlEffect === "debit") {
      addAmount(classified.profitAndLossDebitLines, adjustment.account, working.decrease);
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
  furtherBadDebts = 0,
  goodsWithdrawnByProprietor = 0,
  provisionForDoubtfulDebtsWorking?: ProvisionForDoubtfulDebtsWorking,
  provisionForDiscountOnDebtorsWorking?: ProvisionForDiscountOnDebtorsWorking,
  provisionForDiscountOnCreditorsWorking?: ProvisionForDiscountOnCreditorsWorking,
  managerCommissionWorking?: ManagerCommissionWorking,
): FinalAccountsResult["balanceSheet"] {
  const assets: FinalAccountLine[] = [];
  const liabilities: FinalAccountLine[] = [];
  let openingCapital = 0;
  let drawings = 0;

  balanceSheetItems.forEach((item) => {
    const key = cleanAccountName(item.account);

    if (
      provisionForDoubtfulDebtsAccounts.has(key) ||
      provisionForDiscountOnDebtorsAccounts.has(key) ||
      provisionForDiscountOnCreditorsAccounts.has(key)
    ) {
      return;
    }

    if (capitalAccounts.has(key)) {
      openingCapital += item.amount;
      return;
    }

    if (drawingAccounts.has(key)) {
      drawings += item.amount;
      return;
    }

    if (liabilityAccounts.has(key)) {
      if (creditorAccounts.has(key) && provisionForDiscountOnCreditorsWorking) {
        liabilities.push({
          account: "Net Creditors",
          amount: provisionForDiscountOnCreditorsWorking.netCreditors,
        });
        return;
      }

      liabilities.push(toFinalAccountLine(item));
      return;
    }

    if (assetAccounts.has(key)) {
      if (
        debtorAccounts.has(key) &&
        (provisionForDiscountOnDebtorsWorking || provisionForDoubtfulDebtsWorking || furtherBadDebts > 0)
      ) {
        const netDebtors =
          provisionForDiscountOnDebtorsWorking?.netDebtors ??
          provisionForDoubtfulDebtsWorking?.netDebtors ??
          Math.max(item.amount - furtherBadDebts, 0);
        assets.push({
          account: "Net Debtors",
          amount: netDebtors,
        });
        return;
      }

      assets.push(toFinalAccountLine(item));
    }
  });

  const adjustedCapital = openingCapital + netProfit - netLoss - drawings - goodsWithdrawnByProprietor;
  const capitalWorking =
    openingCapital > 0
      ? {
          openingCapital,
          netProfit,
          netLoss,
          drawings,
          goodsWithdrawnByProprietor,
          adjustedCapital,
        }
      : undefined;

  if (capitalWorking) {
    liabilities.unshift({ account: "Adjusted Capital", amount: adjustedCapital });
  }

  if (managerCommissionWorking) {
    liabilities.push({ account: "Manager's Commission Payable", amount: managerCommissionWorking.commission });
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
    provisionForDoubtfulDebtsWorking,
    provisionForDiscountOnDebtorsWorking,
    provisionForDiscountOnCreditorsWorking,
    managerCommissionWorking,
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

function applyManagerCommission(
  classified: {
    profitAndLossDebitLines: FinalAccountLine[];
  },
  profitAndLossAccountBeforeCommission: FinalAccountsResult["profitAndLossAccount"],
  adjustment?: FinalAccountAdjustment,
): { working?: ManagerCommissionWorking; warnings: string[] } {
  if (!adjustment) return { warnings: [] };

  const profitBeforeCommission = profitAndLossAccountBeforeCommission.netProfit;

  if (adjustment.basis !== "fixed" && profitBeforeCommission <= 0) {
    return {
      warnings: ["Manager's commission percentage cannot be calculated because there is no net profit before commission."],
    };
  }

  let commission = adjustment.amount ?? 0;

  if (adjustment.basis === "before_commission" && adjustment.percentage !== undefined) {
    commission = Math.round((profitBeforeCommission * adjustment.percentage) / 100);
  }

  if (adjustment.basis === "after_commission" && adjustment.percentage !== undefined) {
    commission = Math.round((profitBeforeCommission * adjustment.percentage) / (100 + adjustment.percentage));
  }

  if (commission <= 0) return { warnings: [] };

  addAmount(classified.profitAndLossDebitLines, adjustment.account, commission);

  return {
    working: {
      basis: adjustment.basis ?? "fixed",
      profitBeforeCommission,
      percentage: adjustment.percentage,
      commission,
      netProfitAfterCommission: Math.max(profitBeforeCommission - commission, 0),
    },
    warnings: [],
  };
}

function buildProvisionForDoubtfulDebtsWorking(
  balanceSheetItems: TrialBalanceBalance[],
  adjustment: FinalAccountAdjustment,
  furtherBadDebts: number,
): ProvisionForDoubtfulDebtsWorking | null {
  const debtors = balanceSheetItems
    .filter((item) => debtorAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);
  const existingProvision = balanceSheetItems
    .filter((item) => provisionForDoubtfulDebtsAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);

  if (debtors === 0) {
    return null;
  }

  const adjustedDebtors = Math.max(debtors - furtherBadDebts, 0);
  const requiredProvision =
    adjustment.amount ??
    (adjustment.percentage !== undefined ? Math.round((adjustedDebtors * adjustment.percentage) / 100) : 0);
  const increase = Math.max(requiredProvision - existingProvision, 0);
  const decrease = Math.max(existingProvision - requiredProvision, 0);
  const netDebtors = Math.max(adjustedDebtors - requiredProvision, 0);
  const pnlEffect: ProvisionForDoubtfulDebtsWorking["pnlEffect"] =
    increase > 0 ? "debit" : decrease > 0 ? "credit" : "none";

  return {
    debtors,
    furtherBadDebts,
    adjustedDebtors,
    existingProvision,
    requiredProvision,
    increase,
    decrease,
    pnlEffect,
    netDebtors,
  };
}

function buildProvisionForDiscountOnDebtorsWorking(
  balanceSheetItems: TrialBalanceBalance[],
  adjustment: FinalAccountAdjustment,
  furtherBadDebts: number,
  provisionForDoubtfulDebts: number,
): ProvisionForDiscountOnDebtorsWorking | null {
  const debtors = balanceSheetItems
    .filter((item) => debtorAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);
  const existingProvision = balanceSheetItems
    .filter((item) => provisionForDiscountOnDebtorsAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);

  if (debtors === 0) {
    return null;
  }

  const adjustedDebtors = Math.max(debtors - furtherBadDebts, 0);
  const goodDebtors = Math.max(adjustedDebtors - provisionForDoubtfulDebts, 0);
  const requiredProvision =
    adjustment.amount ?? (adjustment.percentage !== undefined ? Math.round((goodDebtors * adjustment.percentage) / 100) : 0);
  const increase = Math.max(requiredProvision - existingProvision, 0);
  const decrease = Math.max(existingProvision - requiredProvision, 0);
  const netDebtors = Math.max(goodDebtors - requiredProvision, 0);
  const pnlEffect: ProvisionForDiscountOnDebtorsWorking["pnlEffect"] =
    increase > 0 ? "debit" : decrease > 0 ? "credit" : "none";

  return {
    debtors,
    furtherBadDebts,
    adjustedDebtors,
    provisionForDoubtfulDebts,
    goodDebtors,
    existingProvision,
    requiredProvision,
    increase,
    decrease,
    pnlEffect,
    netDebtors,
  };
}

function buildProvisionForDiscountOnCreditorsWorking(
  balanceSheetItems: TrialBalanceBalance[],
  adjustment: FinalAccountAdjustment,
): ProvisionForDiscountOnCreditorsWorking | null {
  const creditors = balanceSheetItems
    .filter((item) => creditorAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);
  const existingProvision = balanceSheetItems
    .filter((item) => provisionForDiscountOnCreditorsAccounts.has(cleanAccountName(item.account)))
    .reduce((total, item) => total + item.amount, 0);

  if (creditors === 0) {
    return null;
  }

  const requiredProvision =
    adjustment.amount ?? (adjustment.percentage !== undefined ? Math.round((creditors * adjustment.percentage) / 100) : 0);
  const increase = Math.max(requiredProvision - existingProvision, 0);
  const decrease = Math.max(existingProvision - requiredProvision, 0);
  const netCreditors = Math.max(creditors - requiredProvision, 0);
  const pnlEffect: ProvisionForDiscountOnCreditorsWorking["pnlEffect"] =
    increase > 0 ? "credit" : decrease > 0 ? "debit" : "none";

  return {
    creditors,
    existingProvision,
    requiredProvision,
    increase,
    decrease,
    pnlEffect,
    netCreditors,
  };
}

function isCreditSideProvisionForDiscountOnCreditors(item: TrialBalanceBalance): boolean {
  return item.side === "credit" && provisionForDiscountOnCreditorsAccounts.has(cleanAccountName(item.account));
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
  const existing = lines.find((line) => accountMatches(line.account, account));
  if (existing) {
    existing.amount += amount;
    return;
  }

  lines.push({ account, amount });
}

function addAmountIfExists(lines: FinalAccountLine[], account: string, amount: number): boolean {
  const existing = lines.find((line) => accountMatches(line.account, account));
  if (!existing) return false;

  existing.amount += amount;
  return true;
}

function reduceAmountIfExists(lines: FinalAccountLine[], account: string, amount: number): boolean {
  const existing = lines.find((line) => accountMatches(line.account, account));
  if (!existing) return false;

  existing.amount = Math.max(existing.amount - amount, 0);
  return true;
}

function reducePurchasesForGoodsWithdrawn(lines: FinalAccountLine[], amount: number): string | null {
  const purchases = lines.find((line) => accountMatches(line.account, "Purchases"));
  if (!purchases) {
    return "Purchases balance not found, so goods withdrawn could not be deducted from purchases.";
  }

  if (amount > purchases.amount) {
    purchases.amount = 0;
    return "Goods withdrawn is more than Purchases, so Purchases was reduced to zero.";
  }

  purchases.amount -= amount;
  return null;
}

function reducePurchasesForFreeSample(lines: FinalAccountLine[], amount: number): string | null {
  const purchases = lines.find((line) => accountMatches(line.account, "Purchases"));
  if (!purchases) {
    return "Purchases balance not found, so free sample goods could not be deducted from purchases.";
  }

  if (amount > purchases.amount) {
    purchases.amount = 0;
    return "Free sample goods amount is more than Purchases, so Purchases was reduced to zero.";
  }

  purchases.amount -= amount;
  return null;
}

function reducePurchasesForCharity(lines: FinalAccountLine[], amount: number): string | null {
  const purchases = lines.find((line) => accountMatches(line.account, "Purchases"));
  if (!purchases) {
    return "Purchases balance not found, so charity goods could not be deducted from purchases.";
  }

  if (amount > purchases.amount) {
    purchases.amount = 0;
    return "Charity goods amount is more than Purchases, so Purchases was reduced to zero.";
  }

  purchases.amount -= amount;
  return null;
}

function reducePurchasesForGoodsLost(lines: FinalAccountLine[], amount: number): string | null {
  const purchases = lines.find((line) => accountMatches(line.account, "Purchases"));
  if (!purchases) {
    return "Purchases balance not found, so goods lost could not be deducted from purchases.";
  }

  if (amount > purchases.amount) {
    purchases.amount = 0;
    return "Goods lost amount is more than Purchases, so Purchases was reduced to zero.";
  }

  purchases.amount -= amount;
  return null;
}

function addCharityExpense(lines: FinalAccountLine[], amount: number): void {
  const donation = lines.find((line) => accountMatches(line.account, "Donation Expense"));
  if (donation) {
    donation.amount += amount;
    return;
  }

  addAmount(lines, "Charity Expense", amount);
}

function reduceBalanceSheetAsset(items: TrialBalanceBalance[], account: string, amount: number): boolean {
  const existing = items.find((item) => item.side === "debit" && accountMatches(item.account, account));
  if (!existing) return false;

  existing.amount = Math.max(existing.amount - amount, 0);
  return true;
}

function accountMatches(left: string, right: string): boolean {
  return accountMatchKey(left) === accountMatchKey(right);
}

function accountMatchKey(account: string): string {
  const key = cleanAccountName(account);

  if (["commission", "commission income", "commission received", "commission earned"].includes(key)) {
    return "commission income";
  }

  if (["interest", "interest income", "interest received", "interest earned"].includes(key)) {
    return "interest income";
  }

  if (["rent income", "rent received"].includes(key)) {
    return "rent income";
  }

  if (["advertisement", "advertisement expense", "advertising", "advertising expense"].includes(key)) {
    return "advertisement expense";
  }

  if (["charity", "charity expense"].includes(key)) {
    return "charity expense";
  }

  if (["donation", "donation expense"].includes(key)) {
    return "donation expense";
  }

  if (["loss by fire", "fire loss", "loss due to fire"].includes(key)) {
    return "loss by fire";
  }

  if (["loss by theft", "theft loss", "loss due to theft"].includes(key)) {
    return "loss by theft";
  }

  if (["goods lost", "loss of goods", "goods loss"].includes(key)) {
    return "goods lost";
  }

  return key;
}

function cloneBalance(balance: TrialBalanceBalance): TrialBalanceBalance {
  return { ...balance };
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
