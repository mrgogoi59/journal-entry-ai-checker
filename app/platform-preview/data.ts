export const progressStats = [
  { label: "Chapters Started", value: "1", note: "Preview data" },
  { label: "Chapters Completed", value: "0", note: "Preview data" },
  { label: "Practice Accuracy", value: "82%", note: "Preview data" },
  { label: "Questions Attempted", value: "24", note: "Preview data" },
] as const;

export const recentActivity = [
  "Studied Journal Format",
  "Attempted Capital Transactions",
  "Reviewed a solved illustration",
] as const;

export const chapterCards = [
  {
    title: "Accounting Fundamentals",
    description: "The base concepts students need before full chapter practice begins.",
    status: "Planned",
    actionLabel: "Review roadmap",
  },
  {
    title: "Journal Entries",
    description: "First active prototype chapter for format, debit-credit logic, examples, and practice.",
    status: "Available",
    progress: 18,
    actionLabel: "First prototype",
  },
  {
    title: "Ledger",
    description: "Follow-on chapter after students can prepare complete journal entries.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Trial Balance",
    description: "Second validation chapter for table UX, debit-credit placement, totals, and balancing.",
    status: "Planned",
    actionLabel: "Second validation",
  },
  {
    title: "Bank Reconciliation Statement",
    description: "Workflow chapter for matching cash book and bank statement balances.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Rectification of Errors",
    description: "Error-correction chapter that will need careful suspense and feedback design.",
    status: "Planned",
    actionLabel: "Needs design",
  },
  {
    title: "Depreciation, Provisions and Reserves",
    description: "Adjustment chapter for depreciation, provisions, and reserves after basics are stable.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Final Accounts",
    description: "Statement workflow chapter for Trading Account, Profit and Loss, and Balance Sheet.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Bills of Exchange",
    description: "Instrument-specific chapter to be mapped after core workflow chapters.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Not-for-Profit Accounts",
    description: "Receipts, payments, income and expenditure, and balance sheet treatment.",
    status: "Planned",
    actionLabel: "Planned chapter",
  },
  {
    title: "Partnership Accounts",
    description: "Advanced chapter family with only narrow controlled cases currently proven.",
    status: "Planned",
    actionLabel: "Careful scope",
  },
  {
    title: "Company Accounts",
    description: "Advanced chapter family for share capital and debentures with statutory scope deferred.",
    status: "Planned",
    actionLabel: "Careful scope",
  },
  {
    title: "Cash Flow Statement",
    description: "Later advanced chapter after core final accounts and statements are stable.",
    status: "Later",
    actionLabel: "Later phase",
  },
] as const;
