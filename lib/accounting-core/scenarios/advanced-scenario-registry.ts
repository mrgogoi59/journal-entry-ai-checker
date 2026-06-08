import type {
  AccountClass,
  AccountingScenario,
  AccountingTopic,
  AccountRef,
  AccountRole,
  JournalEntry,
  NormalBalance,
} from "../types";

export const ADVANCED_SCENARIO_REGISTRY_VERSION = "advanced-scenario-registry-v1";

export const advancedPartnershipScenarios: AccountingScenario[] = [
  scenario({
    id: "partnership-partner-salary-allowed",
    topic: "partnership",
    title: "Partner salary allowed",
    prompt: "Amit is allowed partner salary of Rs.10,000.",
    tags: ["partnership", "appropriation", "partner-salary"],
    lines: [
      debit("Profit and Loss Appropriation A/c", 10000, "profit_and_loss_appropriation", "memorandum"),
      credit("Amit Capital A/c", 10000, "partner_capital", "equity", "Amit"),
    ],
  }),
  scenario({
    id: "partnership-interest-on-capital-allowed",
    topic: "partnership",
    title: "Interest on capital allowed",
    prompt: "Interest on capital allowed to Riya Rs.5,000 and Amit Rs.5,000.",
    tags: ["partnership", "appropriation", "interest-on-capital"],
    lines: [
      debit("Profit and Loss Appropriation A/c", 10000, "profit_and_loss_appropriation", "memorandum"),
      credit("Riya Capital A/c", 5000, "partner_capital", "equity", "Riya"),
      credit("Amit Capital A/c", 5000, "partner_capital", "equity", "Amit"),
    ],
  }),
  scenario({
    id: "partnership-interest-on-drawings-charged",
    topic: "partnership",
    title: "Interest on drawings charged",
    prompt: "Interest on drawings charged to Riya Rs.2,000.",
    tags: ["partnership", "appropriation", "interest-on-drawings"],
    lines: [
      debit("Riya Capital A/c", 2000, "partner_capital", "equity", "Riya"),
      credit("Interest on Drawings A/c", 2000, "interest_on_drawings", "income"),
    ],
  }),
  scenario({
    id: "partnership-revaluation-loss-machinery",
    topic: "partnership",
    title: "Revaluation loss on machinery",
    prompt: "Machinery value decreased by Rs.20,000 on admission of a partner.",
    tags: ["partnership", "admission", "revaluation"],
    lines: [
      debit("Revaluation A/c", 20000, "revaluation", "memorandum"),
      credit("Machinery A/c", 20000, "asset", "asset"),
    ],
  }),
  scenario({
    id: "partnership-goodwill-compensation",
    topic: "partnership",
    title: "Goodwill compensation",
    prompt: "New partner Neha compensates old partner Riya for goodwill Rs.15,000.",
    tags: ["partnership", "admission", "goodwill"],
    lines: [
      debit("Neha Capital A/c", 15000, "partner_capital", "equity", "Neha"),
      credit("Riya Capital A/c", 15000, "partner_capital", "equity", "Riya"),
    ],
  }),
  scenario({
    id: "partnership-dissolution-assets-transfer",
    topic: "partnership",
    title: "Dissolution asset transfer to Realisation",
    prompt: "Assets of Rs.50,000 were transferred to Realisation Account on dissolution.",
    tags: ["partnership", "dissolution", "realisation"],
    lines: [
      debit("Realisation A/c", 50000, "realisation", "memorandum"),
      credit("Assets A/c", 50000, "asset", "asset"),
    ],
  }),
];

export const advancedCompanyScenarios: AccountingScenario[] = [
  scenario({
    id: "company-share-issue-at-premium",
    topic: "company_accounts",
    title: "Share issue at premium",
    prompt: "Company issued shares for Rs.1,20,000 including Securities Premium Rs.20,000.",
    tags: ["company", "share-capital", "premium"],
    lines: [
      debit("Bank A/c", 120000, "bank", "asset"),
      credit("Share Capital A/c", 100000, "share_capital", "equity"),
      credit("Securities Premium A/c", 20000, "securities_premium", "equity"),
    ],
  }),
  scenario({
    id: "company-share-first-call-due",
    topic: "company_accounts",
    title: "Share first call due",
    prompt: "First call due on shares Rs.30,000.",
    tags: ["company", "share-call"],
    lines: [
      debit("Share First Call A/c", 30000, "share_call", "asset"),
      credit("Share Capital A/c", 30000, "share_capital", "equity"),
    ],
  }),
  scenario({
    id: "company-calls-in-arrears-first-call",
    topic: "company_accounts",
    title: "Calls in arrears on first call",
    prompt: "Against first call of Rs.30,000, company received Rs.27,000 and Rs.3,000 remained unpaid.",
    tags: ["company", "calls-in-arrears"],
    lines: [
      debit("Bank A/c", 27000, "bank", "asset"),
      debit("Calls in Arrears A/c", 3000, "calls_in_arrears", "asset"),
      credit("Share First Call A/c", 30000, "share_call", "asset"),
    ],
  }),
  scenario({
    id: "company-calls-in-advance-received",
    topic: "company_accounts",
    title: "Calls in advance received",
    prompt: "A shareholder paid future call money of Rs.2,000 in advance.",
    tags: ["company", "calls-in-advance"],
    lines: [
      debit("Bank A/c", 2000, "bank", "asset"),
      credit("Calls in Advance A/c", 2000, "calls_in_advance", "liability"),
    ],
  }),
  scenario({
    id: "company-share-forfeiture",
    topic: "company_accounts",
    title: "Share forfeiture",
    prompt: "Shares of Rs.10,000 were forfeited for non-payment of Rs.3,000; Rs.7,000 had already been received.",
    tags: ["company", "forfeiture"],
    lines: [
      debit("Share Capital A/c", 10000, "share_capital", "equity"),
      credit("Calls in Arrears A/c", 3000, "calls_in_arrears", "asset"),
      credit("Share Forfeiture A/c", 7000, "share_forfeiture", "equity"),
    ],
  }),
  scenario({
    id: "company-reissue-forfeited-shares-discount",
    topic: "company_accounts",
    title: "Reissue of forfeited shares at discount",
    prompt: "Forfeited shares of Rs.10,000 were reissued for Rs.8,000.",
    tags: ["company", "reissue", "capital-reserve"],
    lines: [
      debit("Bank A/c", 8000, "bank", "asset"),
      debit("Share Forfeiture A/c", 2000, "share_forfeiture", "equity"),
      credit("Share Capital A/c", 10000, "share_capital", "equity"),
    ],
  }),
  scenario({
    id: "company-debenture-issue-discount",
    topic: "company_accounts",
    title: "Debenture issue at discount",
    prompt: "Debentures of Rs.1,00,000 were issued for Rs.95,000.",
    tags: ["company", "debenture", "discount"],
    lines: [
      debit("Bank A/c", 95000, "bank", "asset"),
      debit("Discount on Issue of Debentures A/c", 5000, "discount_on_issue_of_debentures", "expense"),
      credit("Debentures A/c", 100000, "debenture", "liability"),
    ],
  }),
  scenario({
    id: "company-debenture-interest-paid",
    topic: "company_accounts",
    title: "Debenture interest paid",
    prompt: "Debenture interest of Rs.10,000 was paid by bank.",
    tags: ["company", "debenture-interest"],
    lines: [
      debit("Debenture Interest A/c", 10000, "debenture_interest", "expense"),
      credit("Bank A/c", 10000, "bank", "asset"),
    ],
  }),
];

export const advancedAccountingScenarios: AccountingScenario[] = [
  ...advancedPartnershipScenarios,
  ...advancedCompanyScenarios,
];

export function getAdvancedScenariosByTopic(topic: AccountingTopic): AccountingScenario[] {
  if (topic === "partnership") return [...advancedPartnershipScenarios];
  if (topic === "company_accounts") return [...advancedCompanyScenarios];
  return [];
}

export function getAdvancedScenarioById(id: string): AccountingScenario | undefined {
  return advancedAccountingScenarios.find((scenarioItem) => scenarioItem.id === id);
}

export function getAdvancedScenarioIds(): string[] {
  return advancedAccountingScenarios.map((scenarioItem) => scenarioItem.id);
}

function scenario({
  id,
  topic,
  title,
  prompt,
  tags,
  lines,
}: {
  id: string;
  topic: AccountingTopic;
  title: string;
  prompt: string;
  tags: string[];
  lines: JournalEntry["lines"];
}): AccountingScenario {
  return {
    id,
    topic,
    title,
    prompt,
    difficulty: "intermediate",
    expectedJournalEntries: [
      {
        id: `${id}-journal-entry`,
        topic,
        transactionText: prompt,
        narration: `Journal entry for ${title}.`,
        explanation: "Static advanced scenario registry entry for future controlled practice.",
        lines,
      },
    ],
    tags,
  };
}

function debit(
  name: string,
  amount: number,
  role: AccountRole,
  accountClass: AccountClass,
  ownerName?: string,
): JournalEntry["lines"][number] {
  return journalLine(name, "debit", amount, role, accountClass, ownerName);
}

function credit(
  name: string,
  amount: number,
  role: AccountRole,
  accountClass: AccountClass,
  ownerName?: string,
): JournalEntry["lines"][number] {
  return journalLine(name, "credit", amount, role, accountClass, ownerName);
}

function journalLine(
  name: string,
  side: JournalEntry["lines"][number]["side"],
  amount: number,
  role: AccountRole,
  accountClass: AccountClass,
  ownerName?: string,
): JournalEntry["lines"][number] {
  return {
    account: account(name, role, accountClass, ownerName),
    side,
    amount,
  };
}

function account(name: string, role: AccountRole, accountClass: AccountClass, ownerName?: string): AccountRef {
  return {
    name,
    role,
    class: accountClass,
    ...(normalBalanceForClass(accountClass) ? { normalBalance: normalBalanceForClass(accountClass) } : {}),
    ...(ownerName ? { ownerName } : {}),
  };
}

function normalBalanceForClass(accountClass: AccountClass): NormalBalance | undefined {
  if (["asset", "expense", "contra_liability", "contra_equity"].includes(accountClass)) return "debit";
  if (["liability", "equity", "income", "contra_asset"].includes(accountClass)) return "credit";
  return undefined;
}
