export type PracticeChapterStatus = "available" | "planned" | "later";

export type PracticeChapterCatalogItem = {
  id:
    | "accounting-fundamentals"
    | "journal-entries"
    | "ledger"
    | "trial-balance"
    | "bank-reconciliation-statement"
    | "rectification-of-errors"
    | "depreciation-provisions-and-reserves"
    | "final-accounts"
    | "bills-of-exchange"
    | "not-for-profit-accounts"
    | "partnership-accounts"
    | "company-accounts";
  chapterSlug: string;
  title: string;
  shortDescription: string;
  status: PracticeChapterStatus;
  href?: string;
  actionLabel: string;
  availabilityNote: string;
  learningStage?: string;
};

export const practiceChapterStatusLabels = {
  available: "Available",
  planned: "Planned",
  later: "Later",
} satisfies Record<PracticeChapterStatus, string>;

export const practiceChapterCatalog = [
  {
    id: "accounting-fundamentals",
    chapterSlug: "accounting-fundamentals",
    title: "Accounting Fundamentals",
    shortDescription: "Basic terms, accounting concepts, source documents, and classification foundations.",
    status: "planned",
    actionLabel: "Planned",
    availabilityNote: "Chapter-wise independent practice is not available for this chapter yet.",
    learningStage: "Foundation",
  },
  {
    id: "journal-entries",
    chapterSlug: "journal-entries",
    title: "Journal Entries",
    shortDescription: "Practise beginner journal entries by topic with immediate answer checking.",
    status: "available",
    href: "/practice/journal-entries",
    actionLabel: "Start Practice",
    availabilityNote: "Existing beginner Journal Entry Practice is available here.",
    learningStage: "Core foundation",
  },
  {
    id: "ledger",
    chapterSlug: "ledger",
    title: "Ledger",
    shortDescription: "Account-wise posting and balance practice for ledger preparation.",
    status: "planned",
    actionLabel: "Planned",
    availabilityNote: "A chapter-wise Ledger practice migration needs a later controlled slice.",
    learningStage: "After Journal Entries",
  },
  {
    id: "trial-balance",
    chapterSlug: "trial-balance",
    title: "Trial Balance",
    shortDescription: "Debit-credit totals, balance extraction, and trial balance preparation.",
    status: "planned",
    actionLabel: "Planned",
    availabilityNote: "Chapter-wise Trial Balance practice is planned after the Practice hub is reviewed.",
    learningStage: "After Ledger",
  },
  {
    id: "bank-reconciliation-statement",
    chapterSlug: "bank-reconciliation-statement",
    title: "Bank Reconciliation Statement",
    shortDescription: "Cash Book and Pass Book reconciliation practice.",
    status: "planned",
    actionLabel: "Planned",
    availabilityNote: "Independent BRS chapter practice is not wired into this hub yet.",
    learningStage: "Workflow chapter",
  },
  {
    id: "rectification-of-errors",
    chapterSlug: "rectification-of-errors",
    title: "Rectification of Errors",
    shortDescription: "Error identification and correction-entry practice.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "This needs careful error-treatment and feedback design before practice is exposed.",
    learningStage: "Later core chapter",
  },
  {
    id: "depreciation-provisions-and-reserves",
    chapterSlug: "depreciation-provisions-and-reserves",
    title: "Depreciation, Provisions and Reserves",
    shortDescription: "Adjustment and valuation practice for depreciation and provisions.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "This is deferred until adjustment checking rules are designed safely.",
    learningStage: "Adjustments",
  },
  {
    id: "final-accounts",
    chapterSlug: "final-accounts",
    title: "Final Accounts",
    shortDescription: "Trading Account, Profit & Loss Account, and Balance Sheet practice.",
    status: "planned",
    actionLabel: "Planned",
    availabilityNote: "Chapter-wise Final Accounts practice needs a separate migration and QA pass.",
    learningStage: "Statements",
  },
  {
    id: "bills-of-exchange",
    chapterSlug: "bills-of-exchange",
    title: "Bills of Exchange",
    shortDescription: "Bills receivable, bills payable, endorsement, dishonour, and renewal practice.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "This chapter remains deferred until the bill-treatment design is ready.",
    learningStage: "Instrument-specific",
  },
  {
    id: "not-for-profit-accounts",
    chapterSlug: "not-for-profit-accounts",
    title: "Not-for-Profit Accounts",
    shortDescription: "Receipts and Payments, Income and Expenditure, and Balance Sheet practice.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "Statement-based Not-for-Profit practice is not available yet.",
    learningStage: "Statement-focused",
  },
  {
    id: "partnership-accounts",
    chapterSlug: "partnership-accounts",
    title: "Partnership Accounts",
    shortDescription: "Partnership journal and account-treatment practice for controlled scenarios.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "Advanced Partnership practice remains in the separate beta surface for now.",
    learningStage: "Advanced",
  },
  {
    id: "company-accounts",
    chapterSlug: "company-accounts",
    title: "Company Accounts",
    shortDescription: "Share capital, calls, debentures, and company-accounting practice.",
    status: "later",
    actionLabel: "Later",
    availabilityNote: "Advanced Company Accounts practice remains in the separate beta surface for now.",
    learningStage: "Advanced",
  },
] as const satisfies readonly PracticeChapterCatalogItem[];
