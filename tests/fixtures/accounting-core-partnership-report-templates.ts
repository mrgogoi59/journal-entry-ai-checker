import type { AccountingReport, AccountRole } from "@/lib/accounting-core";

export type PartnershipReportTemplateFixture = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  supportedAccountRoles: AccountRole[];
  sections: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  beginnerExplanation: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export const partnershipReportTemplateFixtures: PartnershipReportTemplateFixture[] = [
  {
    id: "profit-and-loss-appropriation-account",
    title: "Profit and Loss Appropriation Account",
    description: "Template metadata for showing how partnership profit is appropriated and shared.",
    purpose:
      "Shows how partnership profit is distributed among partners after interest on capital, salary, commission, interest on drawings, and profit-sharing ratio.",
    supportedAccountRoles: [
      "profit_and_loss_appropriation",
      "interest_on_capital",
      "interest_on_drawings",
      "partner_salary",
      "partner_commission",
      "partner_capital",
      "partner_current",
    ],
    sections: [
      {
        id: "opening-profit",
        title: "Opening Profit",
        description: "Starts with the net profit available before partnership appropriations.",
      },
      {
        id: "appropriations",
        title: "Appropriations",
        description: "Shows salary, commission, and interest on capital allowed to partners.",
      },
      {
        id: "interest-on-drawings",
        title: "Interest on Drawings",
        description: "Adds interest charged on partner drawings.",
      },
      {
        id: "profit-available-for-distribution",
        title: "Profit Available for Distribution",
        description: "Shows profit remaining after adjustments.",
      },
      {
        id: "partner-profit-share",
        title: "Partner Profit Share",
        description: "Shows each partner's share of the remaining profit.",
      },
    ],
    beginnerExplanation:
      "This report starts with profit and shows how the profit is adjusted and shared among partners.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "partner-capital-accounts",
    title: "Partner Capital Accounts",
    description: "Template metadata for partner-wise capital movement.",
    purpose: "Shows capital movements for each partner under fixed or fluctuating capital method.",
    supportedAccountRoles: [
      "partner_capital",
      "partner_current",
      "partner_drawings",
      "interest_on_capital",
      "interest_on_drawings",
      "partner_salary",
      "partner_commission",
    ],
    sections: [
      {
        id: "opening-capital",
        title: "Opening Capital",
        description: "Shows each partner's capital balance at the beginning.",
      },
      {
        id: "capital-introduced",
        title: "Capital Introduced",
        description: "Shows additional capital brought in by partners.",
      },
      {
        id: "drawings",
        title: "Drawings",
        description: "Shows amounts withdrawn by partners.",
      },
      {
        id: "interest-and-salary",
        title: "Interest and Salary",
        description: "Shows partner salary, commission, and interest adjustments.",
      },
      {
        id: "profit-or-loss-share",
        title: "Profit or Loss Share",
        description: "Shows each partner's share of profit or loss.",
      },
      {
        id: "closing-capital",
        title: "Closing Capital",
        description: "Shows the final capital balance for each partner.",
      },
    ],
    beginnerExplanation: "This report shows how each partner's capital balance changes.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "partner-current-accounts",
    title: "Partner Current Accounts",
    description: "Template metadata for partner adjustments under fixed capital method.",
    purpose: "Shows partner adjustments when fixed capital method is used.",
    supportedAccountRoles: [
      "partner_current",
      "partner_capital",
      "partner_drawings",
      "interest_on_capital",
      "interest_on_drawings",
      "partner_salary",
      "partner_commission",
    ],
    sections: [
      {
        id: "opening-current-balance",
        title: "Opening Current Balance",
        description: "Shows the opening current account balance for each partner.",
      },
      {
        id: "drawings-and-interest",
        title: "Drawings and Interest",
        description: "Shows drawings and interest on drawings.",
      },
      {
        id: "salary-commission-and-interest-on-capital",
        title: "Salary, Commission, and Interest on Capital",
        description: "Shows partner benefits credited to current accounts.",
      },
      {
        id: "profit-or-loss-share",
        title: "Profit or Loss Share",
        description: "Shows each partner's share of profit or loss.",
      },
      {
        id: "closing-current-balance",
        title: "Closing Current Balance",
        description: "Shows the final current account balance for each partner.",
      },
    ],
    beginnerExplanation: "When capital is fixed, day-to-day partner adjustments are shown in current accounts.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "revaluation-account",
    title: "Revaluation Account",
    description: "Template metadata for recording revaluation profit or loss.",
    purpose:
      "Shows profit or loss from revaluing assets and liabilities during admission, retirement, or death of a partner.",
    supportedAccountRoles: ["revaluation", "asset", "liability", "partner_capital", "goodwill"],
    sections: [
      {
        id: "decrease-in-assets",
        title: "Decrease in Assets",
        description: "Shows losses caused by lower asset values.",
      },
      {
        id: "increase-in-liabilities",
        title: "Increase in Liabilities",
        description: "Shows losses caused by higher liability values.",
      },
      {
        id: "increase-in-assets",
        title: "Increase in Assets",
        description: "Shows gains caused by higher asset values.",
      },
      {
        id: "decrease-in-liabilities",
        title: "Decrease in Liabilities",
        description: "Shows gains caused by lower liability values.",
      },
      {
        id: "revaluation-profit-or-loss-transfer",
        title: "Revaluation Profit or Loss Transfer",
        description: "Shows transfer of revaluation profit or loss to partners.",
      },
    ],
    beginnerExplanation: "This report shows gain or loss when assets and liabilities are revalued.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "realisation-account",
    title: "Realisation Account",
    description: "Template metadata for dissolution profit or loss.",
    purpose: "Shows profit or loss on dissolution of partnership firm.",
    supportedAccountRoles: ["realisation", "asset", "liability", "partner_capital", "bank", "cash"],
    sections: [
      {
        id: "assets-transferred",
        title: "Assets Transferred",
        description: "Shows assets moved to Realisation Account.",
      },
      {
        id: "liabilities-transferred",
        title: "Liabilities Transferred",
        description: "Shows liabilities moved to Realisation Account.",
      },
      {
        id: "assets-realised",
        title: "Assets Realised",
        description: "Shows cash or bank received from selling assets.",
      },
      {
        id: "liabilities-paid",
        title: "Liabilities Paid",
        description: "Shows liabilities settled during dissolution.",
      },
      {
        id: "realisation-expenses",
        title: "Realisation Expenses",
        description: "Shows dissolution expenses paid.",
      },
      {
        id: "realisation-profit-or-loss-transfer",
        title: "Realisation Profit or Loss Transfer",
        description: "Shows final dissolution profit or loss transferred to partners.",
      },
    ],
    beginnerExplanation: "This report is used when the firm closes and assets/liabilities are settled.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "bank-cash-settlement",
    title: "Bank/Cash Settlement",
    description: "Template metadata for final cash or bank settlement.",
    purpose: "Shows final cash/bank receipts and payments during dissolution or partner settlement.",
    supportedAccountRoles: ["bank", "cash", "partner_capital", "asset", "liability", "realisation"],
    sections: [
      {
        id: "opening-cash-bank",
        title: "Opening Cash/Bank",
        description: "Shows opening cash or bank balance.",
      },
      {
        id: "receipts",
        title: "Receipts",
        description: "Shows cash or bank receipts.",
      },
      {
        id: "payments",
        title: "Payments",
        description: "Shows cash or bank payments.",
      },
      {
        id: "partner-settlement",
        title: "Partner Settlement",
        description: "Shows amounts paid to or received from partners.",
      },
      {
        id: "closing-cash-bank",
        title: "Closing Cash/Bank",
        description: "Shows the closing cash or bank balance.",
      },
    ],
    beginnerExplanation: "This report shows actual cash/bank movement during final settlement.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
];

export const partnershipReportTemplateIds = partnershipReportTemplateFixtures.map((template) => template.id);

export const partnershipReportExampleFixtures: AccountingReport[] = [
  {
    id: "sample-profit-and-loss-appropriation-report",
    title: "Sample Profit and Loss Appropriation Account",
    topic: "partnership",
    sections: [
      {
        id: "opening-profit",
        title: "Opening Profit",
        rows: [{ label: "Net Profit", amount: 50000 }],
      },
      {
        id: "appropriations",
        title: "Appropriations",
        rows: [
          { label: "Partner salary to Amit", amount: 10000 },
          { label: "Interest on capital to Riya", amount: 5000 },
          { label: "Interest on capital to Amit", amount: 5000 },
        ],
      },
      {
        id: "partner-profit-share",
        title: "Partner Profit Share",
        rows: [
          { label: "Riya profit share", amount: 15000 },
          { label: "Amit profit share", amount: 15000 },
        ],
      },
    ],
    summary: "Shows how profit is adjusted and distributed.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-revaluation-report",
    title: "Sample Revaluation Account",
    topic: "partnership",
    sections: [
      {
        id: "decrease-in-assets",
        title: "Decrease in Assets",
        rows: [{ label: "Machinery decreased", amount: 20000 }],
      },
      {
        id: "revaluation-profit-or-loss-transfer",
        title: "Revaluation Loss Transfer",
        rows: [
          { label: "Riya Capital - loss transfer", amount: 10000 },
          { label: "Amit Capital - loss transfer", amount: 10000 },
        ],
        total: 20000,
      },
    ],
    summary: "Shows revaluation loss representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-realisation-report",
    title: "Sample Realisation Account",
    topic: "partnership",
    sections: [
      {
        id: "assets-transferred",
        title: "Assets Transferred",
        rows: [{ label: "Assets transferred", amount: 100000 }],
      },
      {
        id: "liabilities-transferred",
        title: "Liabilities Transferred",
        rows: [{ label: "Liabilities transferred", amount: 30000 }],
      },
      {
        id: "assets-realised",
        title: "Assets Realised",
        rows: [{ label: "Assets realised", amount: 80000 }],
      },
      {
        id: "liabilities-paid",
        title: "Liabilities Paid",
        rows: [{ label: "Liabilities paid", amount: 30000 }],
      },
      {
        id: "realisation-expenses",
        title: "Realisation Expenses",
        rows: [{ label: "Realisation expenses", amount: 5000 }],
      },
      {
        id: "realisation-profit-or-loss-transfer",
        title: "Realisation Loss Transfer",
        rows: [
          { label: "Riya Capital - realisation loss", amount: 12500 },
          { label: "Amit Capital - realisation loss", amount: 12500 },
        ],
        total: 25000,
      },
    ],
    summary: "Shows dissolution report structure.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-partner-capital-report",
    title: "Sample Partner Capital Accounts",
    topic: "partnership",
    sections: [
      {
        id: "opening-capital",
        title: "Opening Capital",
        rows: [
          { label: "Riya opening capital", amount: 100000 },
          { label: "Amit opening capital", amount: 100000 },
        ],
      },
      {
        id: "drawings",
        title: "Drawings",
        rows: [
          { label: "Riya drawings", amount: 10000 },
          { label: "Amit drawings", amount: 8000 },
        ],
      },
      {
        id: "profit-or-loss-share",
        title: "Profit Share",
        rows: [
          { label: "Riya profit share", amount: 15000 },
          { label: "Amit profit share", amount: 15000 },
        ],
      },
    ],
    summary: "Shows partner-wise capital movement representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
];
