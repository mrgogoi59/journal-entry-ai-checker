export type SolverToolStatus = "available" | "planned" | "later";

export type SolverToolCatalogItem = {
  id:
    | "ai-journal-entry-explainer"
    | "ledger-posting"
    | "trial-balance"
    | "final-accounts"
    | "bank-reconciliation-statement";
  title: string;
  shortDescription: string;
  status: SolverToolStatus;
  href?: string;
  actionLabel: string;
  capabilitySummary: string;
  availabilityNote?: string;
};

export const solverToolStatusLabels = {
  available: "Available",
  planned: "Planned",
  later: "Later",
} satisfies Record<SolverToolStatus, string>;

export const solverToolCatalog = [
  {
    id: "ai-journal-entry-explainer",
    title: "AI Journal Entry Explainer",
    shortDescription: "Explain the debit and credit logic for a supported journal entry problem.",
    status: "available",
    href: "/journal-entry-solver",
    actionLabel: "Open Explainer",
    capabilitySummary:
      "Currently explains supported Journal Entry transactions with affected accounts, entry lines, and simple reasoning.",
    availabilityNote: "Available through the existing Journal Entry Explainer route.",
  },
  {
    id: "ledger-posting",
    title: "Ledger Posting",
    shortDescription: "Turn journal entries into account-wise ledger postings.",
    status: "available",
    href: "/ledger",
    actionLabel: "Open Ledger",
    capabilitySummary:
      "Currently prepares ledger-style account views from journal-entry input using the existing ledger tool.",
    availabilityNote: "Available through the existing Ledger Posting route.",
  },
  {
    id: "trial-balance",
    title: "Trial Balance",
    shortDescription: "Prepare a debit-credit trial balance from journal entries and ledger balances.",
    status: "available",
    href: "/trial-balance",
    actionLabel: "Open Trial Balance",
    capabilitySummary:
      "Currently generates Trial Balance rows and balanced totals from supported journal-entry input.",
    availabilityNote: "Available through the existing Trial Balance route.",
  },
  {
    id: "final-accounts",
    title: "Final Accounts",
    shortDescription: "Prepare Trading Account, Profit & Loss Account, and Balance Sheet views.",
    status: "available",
    href: "/final-accounts",
    actionLabel: "Open Final Accounts",
    capabilitySummary:
      "Currently prepares Final Accounts output from trial-balance and adjustment input in the existing tool.",
    availabilityNote: "Available through the existing Final Accounts route.",
  },
  {
    id: "bank-reconciliation-statement",
    title: "Bank Reconciliation Statement",
    shortDescription: "Reconcile Cash Book and Bank Statement balances step by step.",
    status: "available",
    href: "/bank-reconciliation",
    actionLabel: "Open BRS",
    capabilitySummary:
      "Currently calculates Bank Reconciliation Statement adjustments from the existing BRS tool inputs.",
    availabilityNote: "Available through the existing Bank Reconciliation route.",
  },
] as const satisfies readonly SolverToolCatalogItem[];
