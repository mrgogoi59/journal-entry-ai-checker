export type BankReconciliationSource = "cash_book" | "bank_statement";

export type BankBalanceType = "favourable" | "overdraft";

export type BankReconciliationAdjustmentType =
  | "cheque_issued_not_presented"
  | "cheque_deposited_not_credited"
  | "direct_deposit_by_bank"
  | "bank_charges"
  | "interest_credited_by_bank"
  | "interest_charged_by_bank"
  | "direct_payment_by_bank"
  | "cheque_dishonoured";

export type BankReconciliationOperation = "add" | "subtract";

export type BankReconciliationAdjustment = {
  id: string;
  type: BankReconciliationAdjustmentType | string;
  label?: string;
  amount: number | string;
  note?: string;
};

export type BankReconciliationInput = {
  startingSource: BankReconciliationSource;
  startingBalanceType: BankBalanceType;
  startingBalanceAmount: number | string;
  adjustments: BankReconciliationAdjustment[];
};

export type BankReconciliationWorkingRow = {
  id: string;
  type: BankReconciliationAdjustmentType;
  label: string;
  amount: number;
  operation: BankReconciliationOperation;
  reason: string;
  runningBalance: number;
};

export type BankReconciliationResult = {
  startingSignedBalance: number;
  finalSignedBalance: number;
  finalBalanceType: BankBalanceType;
  finalBalanceAmount: number;
  targetSource: BankReconciliationSource;
  workingRows: BankReconciliationWorkingRow[];
  summaryText: string;
  warnings: string[];
};

type AdjustmentDefinition = {
  type: BankReconciliationAdjustmentType;
  label: string;
  cashBookToBankStatementOperation: BankReconciliationOperation;
  cashBookReason: string;
  reverseReason: string;
};

export const bankReconciliationAdjustmentDefinitions: AdjustmentDefinition[] = [
  {
    type: "cheque_issued_not_presented",
    label: "Cheque issued but not presented",
    cashBookToBankStatementOperation: "add",
    cashBookReason: "Cash Book has reduced the bank balance, but the bank has not paid the cheque yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "cheque_deposited_not_credited",
    label: "Cheque deposited but not yet credited",
    cashBookToBankStatementOperation: "subtract",
    cashBookReason: "Cash Book has increased the bank balance, but the bank has not credited it yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "direct_deposit_by_bank",
    label: "Direct deposit by bank/customer",
    cashBookToBankStatementOperation: "add",
    cashBookReason: "The bank has added the amount, but Cash Book has not recorded it yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "bank_charges",
    label: "Bank charges",
    cashBookToBankStatementOperation: "subtract",
    cashBookReason: "The bank has deducted charges, but Cash Book has not recorded them yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "interest_credited_by_bank",
    label: "Interest credited by bank",
    cashBookToBankStatementOperation: "add",
    cashBookReason: "The bank has credited interest, but Cash Book has not recorded it yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "interest_charged_by_bank",
    label: "Interest charged by bank",
    cashBookToBankStatementOperation: "subtract",
    cashBookReason: "The bank has charged interest, but Cash Book has not recorded it yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "direct_payment_by_bank",
    label: "Direct payment by bank",
    cashBookToBankStatementOperation: "subtract",
    cashBookReason: "The bank has paid the amount directly, but Cash Book has not recorded it yet.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
  {
    type: "cheque_dishonoured",
    label: "Cheque dishonoured",
    cashBookToBankStatementOperation: "subtract",
    cashBookReason: "Cash Book recorded the cheque receipt, but the bank rejected it.",
    reverseReason: "Reverse the Cash Book treatment because we are moving from Bank Statement to Cash Book.",
  },
];

const adjustmentDefinitionByType = new Map(
  bankReconciliationAdjustmentDefinitions.map((definition) => [definition.type, definition]),
);

export function calculateBankReconciliation(input: BankReconciliationInput): BankReconciliationResult {
  const warnings: string[] = [];
  const startingAmount = getValidStartingAmount(input.startingBalanceAmount, warnings);
  const startingSignedBalance = input.startingBalanceType === "overdraft" ? -startingAmount : startingAmount;
  const targetSource: BankReconciliationSource =
    input.startingSource === "cash_book" ? "bank_statement" : "cash_book";
  let runningBalance = startingSignedBalance;

  const workingRows: BankReconciliationWorkingRow[] = [];

  input.adjustments.forEach((adjustment, index) => {
    const definition = adjustmentDefinitionByType.get(adjustment.type as BankReconciliationAdjustmentType);

    if (!definition) {
      warnings.push(`Adjustment ${index + 1} has an unsupported type and was skipped.`);
      return;
    }

    const amount = normalizeAmount(adjustment.amount);

    if (amount === null || amount <= 0) {
      warnings.push(`${adjustment.label || definition.label} must have a positive amount and was skipped.`);
      return;
    }

    const operation =
      input.startingSource === "cash_book"
        ? definition.cashBookToBankStatementOperation
        : reverseOperation(definition.cashBookToBankStatementOperation);

    runningBalance = operation === "add" ? runningBalance + amount : runningBalance - amount;

    workingRows.push({
      id: adjustment.id,
      type: definition.type,
      label: adjustment.label?.trim() || definition.label,
      amount,
      operation,
      reason: input.startingSource === "cash_book" ? definition.cashBookReason : definition.reverseReason,
      runningBalance,
    });
  });

  const finalBalanceType: BankBalanceType = runningBalance >= 0 ? "favourable" : "overdraft";
  const finalBalanceAmount = Math.abs(runningBalance);

  return {
    startingSignedBalance,
    finalSignedBalance: runningBalance,
    finalBalanceType,
    finalBalanceAmount,
    targetSource,
    workingRows,
    summaryText: `${getSourceLabel(targetSource)} is ${formatCurrency(finalBalanceAmount)} ${getBalanceLabel(
      finalBalanceType,
    ).toLowerCase()}.`,
    warnings,
  };
}

export function normalizeAmount(value: number | string): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const cleanedValue = value.replace(/rs\.?|₹|,/gi, "").trim();

  if (!cleanedValue) {
    return null;
  }

  const amount = Number(cleanedValue);
  return Number.isFinite(amount) ? amount : null;
}

export function formatCurrency(amount: number): string {
  const cleanedAmount = Number.isFinite(amount) ? Math.abs(amount) : 0;

  return `Rs.${cleanedAmount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(cleanedAmount) ? 0 : 2,
  })}`;
}

export function getBalanceLabel(balanceType: BankBalanceType): string {
  return balanceType === "favourable" ? "Favourable" : "Overdraft";
}

export function getSourceLabel(source: BankReconciliationSource): string {
  return source === "cash_book" ? "Balance as per Cash Book" : "Balance as per Bank Statement / Pass Book";
}

function getValidStartingAmount(value: number | string, warnings: string[]): number {
  const amount = normalizeAmount(value);

  if (amount === null || amount < 0) {
    warnings.push("Starting balance amount must be zero or positive. It was treated as Rs.0.");
    return 0;
  }

  return amount;
}

function reverseOperation(operation: BankReconciliationOperation): BankReconciliationOperation {
  return operation === "add" ? "subtract" : "add";
}
