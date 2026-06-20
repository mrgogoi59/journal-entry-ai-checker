export type ChapterStatus = "available" | "migration-ready" | "planned" | "later";

export type ChapterCatalogItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: ChapterStatus;
  level?: string;
  supportsProgressLater?: boolean;
  actionLabel: string;
  href?: string;
};

export const chapterStatusLabels: Record<ChapterStatus, string> = {
  available: "Available",
  "migration-ready": "Ready for migration",
  planned: "Planned",
  later: "Later",
};

export const chapterStatusStyles: Record<ChapterStatus, string> = {
  available: "border-cyan-200 bg-cyan-50 text-cyan-800",
  "migration-ready": "border-cyan-200 bg-cyan-50 text-cyan-800",
  planned: "border-blue-200 bg-blue-50 text-blue-800",
  later: "border-slate-200 bg-slate-100 text-slate-700",
};

export const studentPlatformChapterCatalog: ChapterCatalogItem[] = [
  {
    id: "accounting-fundamentals",
    slug: "accounting-fundamentals",
    title: "Accounting Fundamentals",
    shortDescription: "The base ideas, terms, and accounting equation students need before full chapter practice.",
    status: "planned",
    level: "Foundation",
    supportsProgressLater: true,
    actionLabel: "Planned chapter",
  },
  {
    id: "journal-entries",
    slug: "journal-entries",
    title: "Journal Entries",
    shortDescription: "The first production migration chapter for transaction logic, debit-credit rules, and journal format.",
    status: "available",
    level: "Production chapter",
    supportsProgressLater: true,
    actionLabel: "Start Chapter",
    href: "/chapters/journal-entries",
  },
  {
    id: "ledger",
    slug: "ledger",
    title: "Ledger",
    shortDescription: "Posting journal entries into account-wise ledger format after Journal Entries is stable.",
    status: "planned",
    level: "Workflow chapter",
    supportsProgressLater: true,
    actionLabel: "Planned chapter",
  },
  {
    id: "trial-balance",
    slug: "trial-balance",
    title: "Trial Balance",
    shortDescription: "The second validation chapter for debit/credit placement, totals, and balancing.",
    status: "planned",
    level: "Second validation chapter",
    supportsProgressLater: true,
    actionLabel: "Planned chapter",
  },
  {
    id: "bank-reconciliation-statement",
    slug: "bank-reconciliation-statement",
    title: "Bank Reconciliation Statement",
    shortDescription: "A workflow chapter for reconciling cash book and pass book differences.",
    status: "planned",
    level: "Workflow chapter",
    actionLabel: "Planned chapter",
  },
  {
    id: "rectification-of-errors",
    slug: "rectification-of-errors",
    title: "Rectification of Errors",
    shortDescription: "Error-correction and suspense-account treatment that needs careful feedback design.",
    status: "later",
    level: "Needs design",
    actionLabel: "Later phase",
  },
  {
    id: "depreciation-provisions-and-reserves",
    slug: "depreciation-provisions-and-reserves",
    title: "Depreciation, Provisions and Reserves",
    shortDescription: "Adjustment concepts for assets, provisions, and reserves after core workflows are stable.",
    status: "later",
    level: "Adjustment chapter",
    actionLabel: "Later phase",
  },
  {
    id: "final-accounts",
    slug: "final-accounts",
    title: "Final Accounts",
    shortDescription: "Trading Account, Profit and Loss Account, and Balance Sheet learning flow.",
    status: "planned",
    level: "Statement workflow",
    supportsProgressLater: true,
    actionLabel: "Planned chapter",
  },
  {
    id: "bills-of-exchange",
    slug: "bills-of-exchange",
    title: "Bills of Exchange",
    shortDescription: "Instrument-specific entries and maturity treatment after foundational chapters are ready.",
    status: "later",
    level: "Later chapter",
    actionLabel: "Later phase",
  },
  {
    id: "not-for-profit-accounts",
    slug: "not-for-profit-accounts",
    title: "Not-for-Profit Accounts",
    shortDescription: "Receipts and Payments, Income and Expenditure, and Balance Sheet treatment.",
    status: "later",
    level: "Statement chapter",
    actionLabel: "Later phase",
  },
  {
    id: "partnership-accounts",
    slug: "partnership-accounts",
    title: "Partnership Accounts",
    shortDescription: "Advanced partner capital, drawings, appropriation, and restructuring topics with careful scope.",
    status: "later",
    level: "Advanced chapter",
    actionLabel: "Later phase",
  },
  {
    id: "company-accounts",
    slug: "company-accounts",
    title: "Company Accounts",
    shortDescription: "Share capital and debenture topics, with statutory and complex treatments deferred.",
    status: "later",
    level: "Advanced chapter",
    actionLabel: "Later phase",
  },
];
