import type {
  AccountClass,
  AccountingScenario,
  AccountingTopic,
  AccountRef,
  AccountRole,
  JournalEntry,
  TopicPack,
} from "@/lib/accounting-core";

export const partnershipTopicPackFixture: TopicPack = {
  id: "partnership",
  title: "Partnership Accounts",
  description:
    "Reusable topic pack for partnership appropriation, capital accounts, admission, retirement, death, and dissolution scenarios.",
  supportedAccountRoles: [
    "partner_capital",
    "partner_current",
    "partner_drawings",
    "interest_on_capital",
    "interest_on_drawings",
    "partner_salary",
    "partner_commission",
    "profit_and_loss_appropriation",
    "revaluation",
    "goodwill",
    "realisation",
    "asset",
    "liability",
    "bank",
    "cash",
  ],
  supportedScenarioTags: [
    "partnership-basic",
    "appropriation",
    "fixed-capital",
    "fluctuating-capital",
    "admission",
    "revaluation",
    "goodwill",
    "retirement",
    "death",
    "dissolution",
  ],
  reportTemplates: [
    { id: "profit-and-loss-appropriation-account", title: "Profit and Loss Appropriation Account" },
    { id: "partner-capital-accounts", title: "Partner Capital Accounts" },
    { id: "partner-current-accounts", title: "Partner Current Accounts" },
    { id: "revaluation-account", title: "Revaluation Account" },
    { id: "realisation-account", title: "Realisation Account" },
    { id: "bank-cash-settlement", title: "Bank/Cash Settlement" },
  ],
  metadata: {
    fixtureOnly: true,
    runtimeImplemented: false,
  },
};

export const companyAccountsTopicPackFixture: TopicPack = {
  id: "company_accounts",
  title: "Company Accounts",
  description:
    "Reusable topic pack for share capital, calls, forfeiture, reissue, reserves, debentures, and company financial statements.",
  supportedAccountRoles: [
    "share_capital",
    "share_application",
    "share_allotment",
    "share_call",
    "calls_in_arrears",
    "calls_in_advance",
    "share_forfeiture",
    "securities_premium",
    "capital_reserve",
    "debenture",
    "debenture_interest",
    "discount_on_issue_of_debentures",
    "premium_on_redemption_of_debentures",
    "bank",
    "asset",
    "liability",
    "expense",
  ],
  supportedScenarioTags: [
    "share-issue",
    "share-premium",
    "application-allotment-call",
    "calls-in-arrears",
    "calls-in-advance",
    "forfeiture",
    "reissue",
    "capital-reserve",
    "debenture-issue",
    "debenture-interest",
    "debenture-redemption",
  ],
  reportTemplates: [
    { id: "share-capital-schedule", title: "Share Capital Schedule" },
    { id: "calls-in-arrears-and-advance-working", title: "Calls in Arrears and Advance Working" },
    { id: "share-forfeiture-working", title: "Share Forfeiture Working" },
    { id: "capital-reserve-working", title: "Capital Reserve Working" },
    { id: "debenture-schedule", title: "Debenture Schedule" },
    { id: "company-balance-sheet-notes", title: "Company Balance Sheet Notes" },
  ],
  metadata: {
    fixtureOnly: true,
    runtimeImplemented: false,
  },
};

export const partnershipScenarioFixtures: AccountingScenario[] = [
  scenario({
    id: "partnership-partner-salary-amit",
    topic: "partnership",
    title: "Partner salary allowed to Amit",
    prompt: "Amit is allowed partner salary of Rs.10,000.",
    tags: ["partnership-basic", "appropriation"],
    entries: [
      journalEntry("partnership-partner-salary-amit-entry", "partnership", [
        debit("Profit and Loss Appropriation", 10000, "profit_and_loss_appropriation", "memorandum"),
        credit("Amit Capital", 10000, "partner_capital", "equity", "Amit"),
      ]),
    ],
  }),
  scenario({
    id: "partnership-interest-on-drawings-riya",
    topic: "partnership",
    title: "Interest on drawings charged to Riya",
    prompt: "Interest on drawings charged to Riya Rs.2,000.",
    tags: ["partnership-basic", "appropriation"],
    entries: [
      journalEntry("partnership-interest-on-drawings-riya-entry", "partnership", [
        debit("Riya Capital", 2000, "partner_capital", "equity", "Riya"),
        credit("Interest on Drawings", 2000, "interest_on_drawings", "income"),
      ]),
    ],
  }),
  scenario({
    id: "partnership-interest-on-capital-amit",
    topic: "partnership",
    title: "Interest on capital allowed to Amit",
    prompt: "Interest on capital allowed to Amit Rs.5,000.",
    tags: ["partnership-basic", "appropriation"],
    entries: [
      journalEntry("partnership-interest-on-capital-amit-entry", "partnership", [
        debit("Profit and Loss Appropriation", 5000, "profit_and_loss_appropriation", "memorandum"),
        credit("Amit Capital", 5000, "partner_capital", "equity", "Amit"),
      ]),
    ],
  }),
  scenario({
    id: "partnership-revaluation-loss-machinery",
    topic: "partnership",
    title: "Revaluation loss on machinery",
    prompt: "Machinery value decreased by Rs.20,000 on admission.",
    tags: ["admission", "revaluation"],
    entries: [
      journalEntry("partnership-revaluation-loss-machinery-entry", "partnership", [
        debit("Revaluation", 20000, "revaluation", "memorandum"),
        credit("Machinery", 20000, "asset", "asset"),
      ]),
    ],
  }),
  scenario({
    id: "partnership-goodwill-adjustment-neha-riya",
    topic: "partnership",
    title: "Goodwill adjustment between partners",
    prompt: "New partner Neha compensates old partner Riya for goodwill Rs.15,000.",
    tags: ["admission", "goodwill"],
    entries: [
      journalEntry("partnership-goodwill-adjustment-neha-riya-entry", "partnership", [
        debit("Neha Capital", 15000, "partner_capital", "equity", "Neha"),
        credit("Riya Capital", 15000, "partner_capital", "equity", "Riya"),
      ]),
    ],
  }),
  scenario({
    id: "partnership-dissolution-assets-transfer",
    topic: "partnership",
    title: "Assets transferred to Realisation Account",
    prompt: "Assets transferred to Realisation Account Rs.50,000.",
    tags: ["dissolution"],
    entries: [
      journalEntry("partnership-dissolution-assets-transfer-entry", "partnership", [
        debit("Realisation", 50000, "realisation", "memorandum"),
        credit("Assets", 50000, "asset", "asset"),
      ]),
    ],
  }),
];

export const companyAccountsScenarioFixtures: AccountingScenario[] = [
  scenario({
    id: "company-share-issue-at-premium",
    topic: "company_accounts",
    title: "Share issue at premium",
    prompt: "Company issued shares for Rs.1,20,000 including Securities Premium Rs.20,000.",
    tags: ["share-issue", "share-premium"],
    entries: [
      journalEntry("company-share-issue-at-premium-entry", "company_accounts", [
        debit("Bank", 120000, "bank", "asset"),
        credit("Share Capital", 100000, "share_capital", "equity"),
        credit("Securities Premium", 20000, "securities_premium", "equity"),
      ]),
    ],
  }),
  scenario({
    id: "company-share-call-due",
    topic: "company_accounts",
    title: "Share call due",
    prompt: "First call due on shares Rs.30,000.",
    tags: ["application-allotment-call"],
    entries: [
      journalEntry("company-share-call-due-entry", "company_accounts", [
        debit("Share First Call", 30000, "share_call", "asset"),
        credit("Share Capital", 30000, "share_capital", "equity"),
      ]),
    ],
  }),
  scenario({
    id: "company-calls-in-arrears",
    topic: "company_accounts",
    title: "Calls in arrears",
    prompt: "Against first call Rs.30,000, company received Rs.27,000 and Rs.3,000 remained unpaid.",
    tags: ["calls-in-arrears"],
    entries: [
      journalEntry("company-calls-in-arrears-entry", "company_accounts", [
        debit("Bank", 27000, "bank", "asset"),
        debit("Calls in Arrears", 3000, "calls_in_arrears", "asset"),
        credit("Share First Call", 30000, "share_call", "asset"),
      ]),
    ],
  }),
  scenario({
    id: "company-share-forfeiture",
    topic: "company_accounts",
    title: "Share forfeiture",
    prompt: "Shares of Rs.10,000 were forfeited for non-payment of Rs.3,000; Rs.7,000 had already been received.",
    tags: ["forfeiture"],
    entries: [
      journalEntry("company-share-forfeiture-entry", "company_accounts", [
        debit("Share Capital", 10000, "share_capital", "equity"),
        credit("Calls in Arrears", 3000, "calls_in_arrears", "asset"),
        credit("Share Forfeiture", 7000, "share_forfeiture", "equity"),
      ]),
    ],
  }),
  scenario({
    id: "company-reissue-forfeited-shares-discount",
    topic: "company_accounts",
    title: "Reissue of forfeited shares at discount",
    prompt: "Forfeited shares of Rs.10,000 were reissued for Rs.8,000.",
    tags: ["reissue", "capital-reserve"],
    entries: [
      journalEntry("company-reissue-forfeited-shares-discount-entry", "company_accounts", [
        debit("Bank", 8000, "bank", "asset"),
        debit("Share Forfeiture", 2000, "share_forfeiture", "equity"),
        credit("Share Capital", 10000, "share_capital", "equity"),
      ]),
    ],
  }),
  scenario({
    id: "company-debenture-issue-discount",
    topic: "company_accounts",
    title: "Debenture issue at discount",
    prompt: "Debentures of Rs.1,00,000 were issued for Rs.95,000.",
    tags: ["debenture-issue"],
    entries: [
      journalEntry("company-debenture-issue-discount-entry", "company_accounts", [
        debit("Bank", 95000, "bank", "asset"),
        debit("Discount on Issue of Debentures", 5000, "discount_on_issue_of_debentures", "expense"),
        credit("Debentures", 100000, "debenture", "liability"),
      ]),
    ],
  }),
  scenario({
    id: "company-debenture-interest-paid",
    topic: "company_accounts",
    title: "Debenture interest paid",
    prompt: "Debenture interest of Rs.10,000 was paid by bank.",
    tags: ["debenture-interest"],
    entries: [
      journalEntry("company-debenture-interest-paid-entry", "company_accounts", [
        debit("Debenture Interest", 10000, "debenture_interest", "expense"),
        credit("Bank", 10000, "bank", "asset"),
      ]),
    ],
  }),
];

export const allAdvancedTopicPackFixtures: TopicPack[] = [
  partnershipTopicPackFixture,
  companyAccountsTopicPackFixture,
];

export const allAdvancedScenarioFixtures: AccountingScenario[] = [
  ...partnershipScenarioFixtures,
  ...companyAccountsScenarioFixtures,
];

function scenario({
  id,
  topic,
  title,
  prompt,
  tags,
  entries,
}: {
  id: string;
  topic: AccountingTopic;
  title: string;
  prompt: string;
  tags: string[];
  entries: JournalEntry[];
}): AccountingScenario {
  return {
    id,
    topic,
    title,
    prompt,
    difficulty: "intermediate",
    expectedJournalEntries: entries,
    tags,
  };
}

function journalEntry(id: string, topic: AccountingTopic, lines: JournalEntry["lines"]): JournalEntry {
  return { id, topic, lines };
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
    ...(ownerName ? { ownerName } : {}),
  };
}
