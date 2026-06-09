import type {
  AccountClass,
  AccountingScenario,
  AccountRef,
  AccountRole,
  JournalEntry,
  JournalLine,
  MoneyAmount,
  NormalBalance,
} from "../types";

type BasePartnershipEntryInput = {
  id?: string;
  transactionText?: string;
};

export type PartnerAmount = {
  partnerName: string;
  amount: number;
};

export type PartnerCapitalContributionInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type PartnerDrawingsPaidInCashInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type PartnerSalaryAllowedInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type InterestOnCapitalAllowedInput = BasePartnershipEntryInput & {
  partnerAmounts: PartnerAmount[];
};

export type InterestOnCapitalUnderFluctuatingCapitalInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type InterestOnDrawingsChargedInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type PartnerCommissionAllowedInput = BasePartnershipEntryInput & {
  partnerName: string;
  amount: number;
};

export type RevaluationAssetInput = BasePartnershipEntryInput & {
  assetAccountName: string;
  amount: number;
};

export type GoodwillCompensationInput = BasePartnershipEntryInput & {
  gainingPartnerName: string;
  sacrificingPartnerName: string;
  amount: number;
};

export type RealisationAssetTransferInput = BasePartnershipEntryInput & {
  assetAccountName?: string;
  amount: number;
};

export type RealisationLiabilityTransferInput = BasePartnershipEntryInput & {
  liabilityAccountName?: string;
  amount: number;
};

export type RealisationExpensePaidInput = BasePartnershipEntryInput & {
  amount: number;
  paidFrom?: "cash" | "bank";
};

export type PartnershipJournalScenarioInput = {
  id: string;
  title: string;
  prompt: string;
  difficulty?: "beginner" | "intermediate";
  tags: string[];
  entry: JournalEntry;
};

type PartnershipJournalEntryTotals = {
  debitTotal: number;
  creditTotal: number;
};

export function generatePartnerCapitalContributionEntry(input: PartnerCapitalContributionInput): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-partner-capital-contribution-entry",
    transactionText: input.transactionText,
    narration: "Partner introduced capital by bank.",
    lines: [
      createJournalLine(partnershipAccounts.bank, "debit", input.amount),
      createJournalLine(partnerCapitalAccount(partnerName), "credit", input.amount),
    ],
  });
}

export function generatePartnerDrawingsPaidInCashEntry(input: PartnerDrawingsPaidInCashInput): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-partner-drawings-paid-in-cash-entry",
    transactionText: input.transactionText,
    narration: "Partner withdrew cash for personal use.",
    lines: [
      createJournalLine(partnerDrawingsAccount(partnerName), "debit", input.amount),
      createJournalLine(partnershipAccounts.cash, "credit", input.amount),
    ],
  });
}

export function generatePartnerSalaryAllowedEntry(input: PartnerSalaryAllowedInput): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-partner-salary-allowed-entry",
    transactionText: input.transactionText,
    narration: "Partner salary allowed.",
    lines: [
      createJournalLine(partnershipAccounts.profitAndLossAppropriation, "debit", input.amount),
      createJournalLine(partnerCapitalAccount(partnerName), "credit", input.amount),
    ],
  });
}

export function generateInterestOnCapitalAllowedEntry(input: InterestOnCapitalAllowedInput): JournalEntry {
  if (input.partnerAmounts.length === 0) {
    throw new Error("At least one partner amount is required.");
  }

  input.partnerAmounts.forEach((partnerAmount) => {
    assertPartnerName(partnerAmount.partnerName);
    assertPositiveAmount("Amount", partnerAmount.amount);
  });

  const total = input.partnerAmounts.reduce((sum, partnerAmount) => sum + partnerAmount.amount, 0);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-interest-on-capital-allowed-entry",
    transactionText: input.transactionText,
    narration: "Interest on capital allowed to partners.",
    lines: [
      createJournalLine(partnershipAccounts.profitAndLossAppropriation, "debit", total),
      ...input.partnerAmounts.map((partnerAmount) =>
        createJournalLine(partnerCapitalAccount(partnerAmount.partnerName.trim()), "credit", partnerAmount.amount),
      ),
    ],
  });
}

export function generateInterestOnCapitalUnderFluctuatingCapitalEntry(
  input: InterestOnCapitalUnderFluctuatingCapitalInput,
): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-interest-on-capital-fluctuating-capital-entry",
    transactionText: input.transactionText,
    narration: "Interest on capital allowed under fluctuating capital method.",
    lines: [
      createJournalLine(partnershipAccounts.interestOnCapital, "debit", input.amount),
      createJournalLine(partnerCurrentAccount(partnerName), "credit", input.amount),
    ],
  });
}

export function generateInterestOnDrawingsChargedEntry(input: InterestOnDrawingsChargedInput): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-interest-on-drawings-charged-entry",
    transactionText: input.transactionText,
    narration: "Interest on drawings charged to partner.",
    lines: [
      createJournalLine(partnerCapitalAccount(partnerName), "debit", input.amount),
      createJournalLine(partnershipAccounts.interestOnDrawings, "credit", input.amount),
    ],
  });
}

export function generatePartnerCommissionAllowedEntry(input: PartnerCommissionAllowedInput): JournalEntry {
  const partnerName = assertPartnerName(input.partnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-partner-commission-allowed-entry",
    transactionText: input.transactionText,
    narration: "Partner commission allowed.",
    lines: [
      createJournalLine(partnershipAccounts.profitAndLossAppropriation, "debit", input.amount),
      createJournalLine(partnerCapitalAccount(partnerName), "credit", input.amount),
    ],
  });
}

export function generateRevaluationLossOnAssetEntry(input: RevaluationAssetInput): JournalEntry {
  const assetAccountName = assertAccountName(input.assetAccountName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-revaluation-loss-on-asset-entry",
    transactionText: input.transactionText,
    narration: "Asset value decreased on revaluation.",
    lines: [
      createJournalLine(partnershipAccounts.revaluation, "debit", input.amount),
      createJournalLine(assetAccount(assetAccountName), "credit", input.amount),
    ],
  });
}

export function generateRevaluationGainOnAssetEntry(input: RevaluationAssetInput): JournalEntry {
  const assetAccountName = assertAccountName(input.assetAccountName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-revaluation-gain-on-asset-entry",
    transactionText: input.transactionText,
    narration: "Asset value increased on revaluation.",
    lines: [
      createJournalLine(assetAccount(assetAccountName), "debit", input.amount),
      createJournalLine(partnershipAccounts.revaluation, "credit", input.amount),
    ],
  });
}

export function generateGoodwillCompensationEntry(input: GoodwillCompensationInput): JournalEntry {
  const gainingPartnerName = assertPartnerName(input.gainingPartnerName);
  const sacrificingPartnerName = assertPartnerName(input.sacrificingPartnerName);
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-goodwill-compensation-entry",
    transactionText: input.transactionText,
    narration: "Goodwill compensation adjusted between partners.",
    lines: [
      createJournalLine(partnerCapitalAccount(gainingPartnerName), "debit", input.amount),
      createJournalLine(partnerCapitalAccount(sacrificingPartnerName), "credit", input.amount),
    ],
  });
}

export function generateRealisationAssetTransferEntry(input: RealisationAssetTransferInput): JournalEntry {
  const assetAccountName = assertAccountName(input.assetAccountName ?? "Assets A/c");
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-realisation-asset-transfer-entry",
    transactionText: input.transactionText,
    narration: "Assets transferred to Realisation Account.",
    lines: [
      createJournalLine(partnershipAccounts.realisation, "debit", input.amount),
      createJournalLine(assetAccount(assetAccountName), "credit", input.amount),
    ],
  });
}

export function generateRealisationLiabilityTransferEntry(input: RealisationLiabilityTransferInput): JournalEntry {
  const liabilityAccountName = assertAccountName(input.liabilityAccountName ?? "Liabilities A/c");
  assertPositiveAmount("Amount", input.amount);

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-realisation-liability-transfer-entry",
    transactionText: input.transactionText,
    narration: "Liabilities transferred to Realisation Account.",
    lines: [
      createJournalLine(liabilityAccount(liabilityAccountName), "debit", input.amount),
      createJournalLine(partnershipAccounts.realisation, "credit", input.amount),
    ],
  });
}

export function generateRealisationExpensePaidEntry(input: RealisationExpensePaidInput): JournalEntry {
  assertPositiveAmount("Amount", input.amount);
  const paymentAccount = input.paidFrom === "cash" ? partnershipAccounts.cash : partnershipAccounts.bank;

  return createPartnershipJournalEntry({
    id: input.id ?? "partnership-realisation-expense-paid-entry",
    transactionText: input.transactionText,
    narration: "Realisation expenses paid.",
    lines: [
      createJournalLine(partnershipAccounts.realisation, "debit", input.amount),
      createJournalLine(paymentAccount, "credit", input.amount),
    ],
  });
}

export function generatePartnershipJournalScenario(input: PartnershipJournalScenarioInput): AccountingScenario {
  return {
    id: input.id,
    topic: "partnership",
    title: input.title,
    prompt: input.prompt,
    difficulty: input.difficulty ?? "intermediate",
    expectedJournalEntries: [input.entry],
    tags: [...input.tags],
  };
}

export function partnerCapitalAccountName(partnerName: string): string {
  return `${assertPartnerName(partnerName)} Capital A/c`;
}

function createPartnershipAccountRef(
  name: string,
  role: AccountRole,
  accountClass: AccountClass,
  normalBalance: NormalBalance,
  ownerName?: string,
): AccountRef {
  return {
    name,
    role,
    class: accountClass,
    normalBalance,
    ...(ownerName ? { ownerName } : {}),
  };
}

function createJournalLine(account: AccountRef, side: JournalLine["side"], amount: MoneyAmount): JournalLine {
  return {
    account,
    side,
    amount,
  };
}

function createPartnershipJournalEntry({
  id,
  transactionText,
  narration,
  lines,
}: {
  id: string;
  transactionText?: string;
  narration: string;
  lines: JournalLine[];
}): JournalEntry {
  const entry: JournalEntry = {
    id,
    topic: "partnership",
    ...(transactionText ? { transactionText } : {}),
    narration,
    lines,
  };

  assertEntryBalanced(entry);
  return entry;
}

function getEntryTotals(entry: JournalEntry): PartnershipJournalEntryTotals {
  return {
    debitTotal: entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0),
    creditTotal: entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0),
  };
}

function assertEntryBalanced(entry: JournalEntry): void {
  const { debitTotal, creditTotal } = getEntryTotals(entry);

  if (debitTotal !== creditTotal) {
    throw new Error("Journal entry is not balanced.");
  }
}

function assertPositiveAmount(label: string, amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
}

function assertEqualAmount(label: string, actual: number, expected: number): void {
  if (actual !== expected) {
    throw new Error(`${label} total mismatch: expected ${expected}, received ${actual}.`);
  }
}

function assertPartnerName(partnerName: string): string {
  const trimmed = partnerName.trim();

  if (!trimmed) {
    throw new Error("Partner name is required.");
  }

  return trimmed;
}

function assertAccountName(accountName: string): string {
  const trimmed = accountName.trim();

  if (!trimmed) {
    throw new Error("Account name is required.");
  }

  return ensureAccountSuffix(trimmed);
}

function partnerCapitalAccount(partnerName: string): AccountRef {
  const ownerName = assertPartnerName(partnerName);
  return createPartnershipAccountRef(partnerCapitalAccountName(ownerName), "partner_capital", "equity", "credit", ownerName);
}

function partnerDrawingsAccount(partnerName: string): AccountRef {
  const ownerName = assertPartnerName(partnerName);
  return createPartnershipAccountRef(`${ownerName} Drawings A/c`, "partner_drawings", "equity", "debit", ownerName);
}

function partnerCurrentAccount(partnerName: string): AccountRef {
  const ownerName = assertPartnerName(partnerName);
  return createPartnershipAccountRef(`${ownerName} Current A/c`, "partner_current", "liability", "credit", ownerName);
}

function assetAccount(accountName: string): AccountRef {
  return createPartnershipAccountRef(assertAccountName(accountName), "asset", "asset", "debit");
}

function liabilityAccount(accountName: string): AccountRef {
  return createPartnershipAccountRef(assertAccountName(accountName), "liability", "liability", "credit");
}

function ensureAccountSuffix(accountName: string): string {
  return /\s+a\/c$/i.test(accountName) ? accountName : `${accountName} A/c`;
}

const partnershipAccounts = {
  profitAndLossAppropriation: createPartnershipAccountRef(
    "Profit and Loss Appropriation A/c",
    "profit_and_loss_appropriation",
    "memorandum",
    "debit",
  ),
  interestOnDrawings: createPartnershipAccountRef("Interest on Drawings A/c", "interest_on_drawings", "income", "credit"),
  interestOnCapital: createPartnershipAccountRef("Interest on Capital A/c", "interest_on_capital", "expense", "debit"),
  partnerSalary: createPartnershipAccountRef("Partner Salary A/c", "partner_salary", "expense", "debit"),
  partnerCommission: createPartnershipAccountRef("Partner Commission A/c", "partner_commission", "expense", "debit"),
  revaluation: createPartnershipAccountRef("Revaluation A/c", "revaluation", "memorandum", "debit"),
  realisation: createPartnershipAccountRef("Realisation A/c", "realisation", "memorandum", "debit"),
  goodwill: createPartnershipAccountRef("Goodwill A/c", "goodwill", "asset", "debit"),
  bank: createPartnershipAccountRef("Bank A/c", "bank", "asset", "debit"),
  cash: createPartnershipAccountRef("Cash A/c", "cash", "asset", "debit"),
};

void partnershipAccounts.interestOnCapital;
void partnershipAccounts.partnerSalary;
void partnershipAccounts.partnerCommission;
void partnershipAccounts.goodwill;

void assertEqualAmount;
