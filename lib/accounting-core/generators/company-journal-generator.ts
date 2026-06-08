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

type BaseCompanyEntryInput = {
  id?: string;
  transactionText?: string;
};

export type ShareIssueAtPremiumInput = BaseCompanyEntryInput & {
  bankAmount: number;
  shareCapitalAmount: number;
  securitiesPremiumAmount: number;
};

export type ShareFirstCallDueInput = BaseCompanyEntryInput & {
  callAmount: number;
};

export type CallsInArrearsReceiptInput = BaseCompanyEntryInput & {
  callDueAmount: number;
  bankReceivedAmount: number;
  callsInArrearsAmount: number;
};

export type CallsInAdvanceReceivedInput = BaseCompanyEntryInput & {
  amount: number;
};

export type ShareForfeitureInput = BaseCompanyEntryInput & {
  shareCapitalAmount: number;
  callsInArrearsAmount: number;
  shareForfeitureAmount: number;
};

export type ReissueForfeitedSharesAtDiscountInput = BaseCompanyEntryInput & {
  shareCapitalAmount: number;
  bankReceivedAmount: number;
  discountAdjustedFromForfeitureAmount: number;
};

export type DebentureIssueAtDiscountInput = BaseCompanyEntryInput & {
  debentureAmount: number;
  bankReceivedAmount: number;
  discountAmount: number;
};

export type DebentureInterestPaidInput = BaseCompanyEntryInput & {
  amount: number;
};

export type CompanyJournalScenarioInput = {
  id: string;
  title: string;
  prompt: string;
  difficulty?: "beginner" | "intermediate";
  tags: string[];
  entry: JournalEntry;
};

export type CompanyJournalEntryTotals = {
  debitTotal: number;
  creditTotal: number;
};

export function generateShareIssueAtPremiumEntry(input: ShareIssueAtPremiumInput): JournalEntry {
  assertPositiveAmount("bankAmount", input.bankAmount);
  assertPositiveAmount("shareCapitalAmount", input.shareCapitalAmount);
  assertPositiveAmount("securitiesPremiumAmount", input.securitiesPremiumAmount);
  assertEqualAmount("share issue at premium", input.bankAmount, input.shareCapitalAmount + input.securitiesPremiumAmount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-share-issue-at-premium-entry",
    transactionText: input.transactionText,
    narration: "Shares issued at premium.",
    lines: [
      createJournalLine(companyAccounts.bank, "debit", input.bankAmount),
      createJournalLine(companyAccounts.shareCapital, "credit", input.shareCapitalAmount),
      createJournalLine(companyAccounts.securitiesPremium, "credit", input.securitiesPremiumAmount),
    ],
  });
}

export function generateShareFirstCallDueEntry(input: ShareFirstCallDueInput): JournalEntry {
  assertPositiveAmount("callAmount", input.callAmount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-share-first-call-due-entry",
    transactionText: input.transactionText,
    narration: "First call due on shares.",
    lines: [
      createJournalLine(companyAccounts.shareFirstCall, "debit", input.callAmount),
      createJournalLine(companyAccounts.shareCapital, "credit", input.callAmount),
    ],
  });
}

export function generateCallsInArrearsReceiptEntry(input: CallsInArrearsReceiptInput): JournalEntry {
  assertPositiveAmount("callDueAmount", input.callDueAmount);
  assertPositiveAmount("bankReceivedAmount", input.bankReceivedAmount);
  assertPositiveAmount("callsInArrearsAmount", input.callsInArrearsAmount);
  assertEqualAmount("calls in arrears receipt", input.callDueAmount, input.bankReceivedAmount + input.callsInArrearsAmount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-calls-in-arrears-receipt-entry",
    transactionText: input.transactionText,
    narration: "First call received with calls in arrears.",
    lines: [
      createJournalLine(companyAccounts.bank, "debit", input.bankReceivedAmount),
      createJournalLine(companyAccounts.callsInArrears, "debit", input.callsInArrearsAmount),
      createJournalLine(companyAccounts.shareFirstCall, "credit", input.callDueAmount),
    ],
  });
}

export function generateCallsInAdvanceReceivedEntry(input: CallsInAdvanceReceivedInput): JournalEntry {
  assertPositiveAmount("amount", input.amount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-calls-in-advance-received-entry",
    transactionText: input.transactionText,
    narration: "Calls in advance received.",
    lines: [
      createJournalLine(companyAccounts.bank, "debit", input.amount),
      createJournalLine(companyAccounts.callsInAdvance, "credit", input.amount),
    ],
  });
}

export function generateShareForfeitureEntry(input: ShareForfeitureInput): JournalEntry {
  assertPositiveAmount("shareCapitalAmount", input.shareCapitalAmount);
  assertPositiveAmount("callsInArrearsAmount", input.callsInArrearsAmount);
  assertPositiveAmount("shareForfeitureAmount", input.shareForfeitureAmount);
  assertEqualAmount("share forfeiture", input.shareCapitalAmount, input.callsInArrearsAmount + input.shareForfeitureAmount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-share-forfeiture-entry",
    transactionText: input.transactionText,
    narration: "Shares forfeited for non-payment of calls.",
    lines: [
      createJournalLine(companyAccounts.shareCapital, "debit", input.shareCapitalAmount),
      createJournalLine(companyAccounts.callsInArrears, "credit", input.callsInArrearsAmount),
      createJournalLine(companyAccounts.shareForfeiture, "credit", input.shareForfeitureAmount),
    ],
  });
}

export function generateReissueForfeitedSharesAtDiscountEntry(input: ReissueForfeitedSharesAtDiscountInput): JournalEntry {
  assertPositiveAmount("shareCapitalAmount", input.shareCapitalAmount);
  assertPositiveAmount("bankReceivedAmount", input.bankReceivedAmount);
  assertPositiveAmount("discountAdjustedFromForfeitureAmount", input.discountAdjustedFromForfeitureAmount);
  assertEqualAmount(
    "reissue of forfeited shares",
    input.shareCapitalAmount,
    input.bankReceivedAmount + input.discountAdjustedFromForfeitureAmount,
  );

  return createCompanyJournalEntry({
    id: input.id ?? "company-reissue-forfeited-shares-discount-entry",
    transactionText: input.transactionText,
    narration: "Forfeited shares reissued at discount.",
    lines: [
      createJournalLine(companyAccounts.bank, "debit", input.bankReceivedAmount),
      createJournalLine(companyAccounts.shareForfeiture, "debit", input.discountAdjustedFromForfeitureAmount),
      createJournalLine(companyAccounts.shareCapital, "credit", input.shareCapitalAmount),
    ],
  });
}

export function generateDebentureIssueAtDiscountEntry(input: DebentureIssueAtDiscountInput): JournalEntry {
  assertPositiveAmount("debentureAmount", input.debentureAmount);
  assertPositiveAmount("bankReceivedAmount", input.bankReceivedAmount);
  assertPositiveAmount("discountAmount", input.discountAmount);
  assertEqualAmount("debenture issue at discount", input.debentureAmount, input.bankReceivedAmount + input.discountAmount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-debenture-issue-discount-entry",
    transactionText: input.transactionText,
    narration: "Debentures issued at discount.",
    lines: [
      createJournalLine(companyAccounts.bank, "debit", input.bankReceivedAmount),
      createJournalLine(companyAccounts.discountOnIssueOfDebentures, "debit", input.discountAmount),
      createJournalLine(companyAccounts.debentures, "credit", input.debentureAmount),
    ],
  });
}

export function generateDebentureInterestPaidEntry(input: DebentureInterestPaidInput): JournalEntry {
  assertPositiveAmount("amount", input.amount);

  return createCompanyJournalEntry({
    id: input.id ?? "company-debenture-interest-paid-entry",
    transactionText: input.transactionText,
    narration: "Debenture interest paid by bank.",
    lines: [
      createJournalLine(companyAccounts.debentureInterest, "debit", input.amount),
      createJournalLine(companyAccounts.bank, "credit", input.amount),
    ],
  });
}

export function generateCompanyJournalScenario(input: CompanyJournalScenarioInput): AccountingScenario {
  return {
    id: input.id,
    topic: "company_accounts",
    title: input.title,
    prompt: input.prompt,
    difficulty: input.difficulty ?? "intermediate",
    expectedJournalEntries: [input.entry],
    tags: [...input.tags],
  };
}

export function createCompanyAccountRef(
  name: string,
  role: AccountRole,
  accountClass: AccountClass,
  normalBalance: NormalBalance,
): AccountRef {
  return {
    name,
    role,
    class: accountClass,
    normalBalance,
  };
}

export function createJournalLine(
  account: AccountRef,
  side: JournalLine["side"],
  amount: MoneyAmount,
): JournalLine {
  return {
    account,
    side,
    amount,
  };
}

export function getEntryTotals(entry: JournalEntry): CompanyJournalEntryTotals {
  return {
    debitTotal: entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0),
    creditTotal: entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0),
  };
}

export function assertEntryBalanced(entry: JournalEntry): void {
  const { debitTotal, creditTotal } = getEntryTotals(entry);

  if (debitTotal !== creditTotal) {
    throw new Error(`Company journal entry must be balanced. Debit total ${debitTotal} does not equal credit total ${creditTotal}.`);
  }
}

function createCompanyJournalEntry({
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
    topic: "company_accounts",
    ...(transactionText ? { transactionText } : {}),
    narration,
    lines,
  };

  assertEntryBalanced(entry);
  return entry;
}

function assertPositiveAmount(label: string, amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${label} must be a positive finite amount.`);
  }
}

function assertEqualAmount(label: string, actual: number, expected: number): void {
  if (actual !== expected) {
    throw new Error(`${label} total mismatch: expected ${expected}, received ${actual}.`);
  }
}

const companyAccounts = {
  bank: createCompanyAccountRef("Bank A/c", "bank", "asset", "debit"),
  shareCapital: createCompanyAccountRef("Share Capital A/c", "share_capital", "equity", "credit"),
  securitiesPremium: createCompanyAccountRef("Securities Premium A/c", "securities_premium", "equity", "credit"),
  shareFirstCall: createCompanyAccountRef("Share First Call A/c", "share_call", "asset", "debit"),
  callsInArrears: createCompanyAccountRef("Calls in Arrears A/c", "calls_in_arrears", "asset", "debit"),
  callsInAdvance: createCompanyAccountRef("Calls in Advance A/c", "calls_in_advance", "liability", "credit"),
  shareForfeiture: createCompanyAccountRef("Share Forfeiture A/c", "share_forfeiture", "equity", "credit"),
  discountOnIssueOfDebentures: createCompanyAccountRef(
    "Discount on Issue of Debentures A/c",
    "discount_on_issue_of_debentures",
    "expense",
    "debit",
  ),
  debentures: createCompanyAccountRef("Debentures A/c", "debenture", "liability", "credit"),
  debentureInterest: createCompanyAccountRef("Debenture Interest A/c", "debenture_interest", "expense", "debit"),
};
