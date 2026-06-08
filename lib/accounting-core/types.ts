/**
 * Future shared accounting-core types for Accywise.
 *
 * Current app behavior is unchanged: existing Journal Entry, Ledger, Trial Balance,
 * Final Accounts, and BRS engines are not wired to these types yet. Later slices
 * should connect existing engines through adapters, and advanced partnership or
 * company accounts should use these shapes through topic packs.
 */

export type MetadataValue = string | number | boolean | null;
export type AccountingMetadata = Record<string, MetadataValue>;

/**
 * Amounts are stored as numbers for current app compatibility; future versions
 * may wrap this with currency/precision handling.
 */
export type MoneyAmount = number;

export type AccountingSide = "debit" | "credit";

export type NormalBalance = "debit" | "credit";

export type AccountClass =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense"
  | "contra_asset"
  | "contra_liability"
  | "contra_equity"
  | "memorandum";

export type AccountRole =
  | "cash"
  | "bank"
  | "sales"
  | "purchases"
  | "capital"
  | "drawings"
  | "debtor"
  | "creditor"
  | "expense"
  | "income"
  | "asset"
  | "liability"
  | "input_gst"
  | "output_gst"
  | "depreciation"
  | "provision"
  | "bad_debts"
  | "outstanding_expense"
  | "prepaid_expense"
  | "accrued_income"
  | "income_received_in_advance"
  | "partner_capital"
  | "partner_current"
  | "partner_drawings"
  | "interest_on_capital"
  | "interest_on_drawings"
  | "partner_salary"
  | "partner_commission"
  | "profit_and_loss_appropriation"
  | "revaluation"
  | "goodwill"
  | "realisation"
  | "share_capital"
  | "share_application"
  | "share_allotment"
  | "share_call"
  | "calls_in_arrears"
  | "calls_in_advance"
  | "share_forfeiture"
  | "securities_premium"
  | "capital_reserve"
  | "debenture"
  | "debenture_interest"
  | "discount_on_issue_of_debentures"
  | "premium_on_redemption_of_debentures"
  | "trading_account"
  | "profit_and_loss"
  | "balance_sheet";

export type AccountingTopic =
  | "basic"
  | "gst"
  | "ledger"
  | "trial_balance"
  | "final_accounts"
  | "bank_reconciliation"
  | "partnership"
  | "company_accounts"
  | "financial_statement_analysis"
  | "computerised_accounting";

export type AccountRef = {
  name: string;
  code?: string;
  class?: AccountClass;
  role?: AccountRole;
  normalBalance?: NormalBalance;
  ownerName?: string;
  metadata?: AccountingMetadata;
};

export type JournalLine = {
  account: AccountRef;
  side: AccountingSide;
  amount: MoneyAmount;
  narration?: string;
  sourceText?: string;
  metadata?: AccountingMetadata;
};

export type JournalEntry = {
  id: string;
  topic: AccountingTopic;
  date?: string;
  transactionText?: string;
  lines: JournalLine[];
  narration?: string;
  explanation?: string;
  metadata?: AccountingMetadata;
};

export type LedgerPosting = {
  journalEntryId: string;
  account: AccountRef;
  side: AccountingSide;
  amount: MoneyAmount;
  date?: string;
  narration?: string;
  oppositeAccounts?: AccountRef[];
  metadata?: AccountingMetadata;
};

export type LedgerAccount = {
  account: AccountRef;
  postings: LedgerPosting[];
  debitTotal: MoneyAmount;
  creditTotal: MoneyAmount;
  balanceSide: AccountingSide | "nil";
  balanceAmount: MoneyAmount;
};

export type TrialBalanceRow = {
  account: AccountRef;
  debit: MoneyAmount;
  credit: MoneyAmount;
};

export type TrialBalance = {
  rows: TrialBalanceRow[];
  debitTotal: MoneyAmount;
  creditTotal: MoneyAmount;
  isBalanced: boolean;
};

export type ReportSection = {
  id: string;
  title: string;
  rows: Array<{
    label: string;
    amount?: MoneyAmount;
    debit?: MoneyAmount;
    credit?: MoneyAmount;
    note?: string;
  }>;
  total?: MoneyAmount;
  note?: string;
};

export type AccountingReport = {
  id: string;
  title: string;
  topic: AccountingTopic;
  sections: ReportSection[];
  summary?: string;
  metadata?: AccountingMetadata;
};

export type AccountingScenario = {
  id: string;
  topic: AccountingTopic;
  title: string;
  prompt: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  expectedJournalEntries?: JournalEntry[];
  expectedReports?: AccountingReport[];
  tags?: string[];
};

export type CheckSeverity = "info" | "warning" | "error";

export type CheckMessage = {
  severity: CheckSeverity;
  message: string;
  code?: string;
};

export type CheckResult = {
  isCorrect: boolean;
  score?: number;
  messages: CheckMessage[];
  expectedJournalEntries?: JournalEntry[];
  actualJournalEntries?: JournalEntry[];
  metadata?: AccountingMetadata;
};

export type TopicPack = {
  id: AccountingTopic;
  title: string;
  description: string;
  supportedAccountRoles?: AccountRole[];
  supportedScenarioTags?: string[];
  reportTemplates?: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  metadata?: AccountingMetadata;
};
