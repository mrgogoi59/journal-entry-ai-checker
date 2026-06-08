import type { AccountingReport, AccountRole } from "@/lib/accounting-core";

export type CompanyReportTemplateFixture = {
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

export const companyReportTemplateFixtures: CompanyReportTemplateFixture[] = [
  {
    id: "share-capital-schedule",
    title: "Share Capital Schedule",
    description: "Template metadata for company share capital details.",
    purpose:
      "Shows how share capital is built from application, allotment, calls, face value, premium, and paid-up amounts.",
    supportedAccountRoles: [
      "share_capital",
      "share_application",
      "share_allotment",
      "share_call",
      "securities_premium",
      "bank",
    ],
    sections: [
      {
        id: "authorised-capital",
        title: "Authorised Capital",
        description: "Shows the maximum share capital authorised by the company documents.",
      },
      {
        id: "issued-capital",
        title: "Issued Capital",
        description: "Shows share capital offered to shareholders.",
      },
      {
        id: "subscribed-capital",
        title: "Subscribed Capital",
        description: "Shows share capital taken up by shareholders.",
      },
      {
        id: "called-up-capital",
        title: "Called-up Capital",
        description: "Shows the amount the company has asked shareholders to pay.",
      },
      {
        id: "paid-up-capital",
        title: "Paid-up Capital",
        description: "Shows the amount actually received after arrears.",
      },
      {
        id: "securities-premium",
        title: "Securities Premium",
        description: "Shows premium collected above face value of shares.",
      },
    ],
    beginnerExplanation:
      "This report explains how much share capital the company has issued, called, and actually received.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "calls-in-arrears-and-advance-working",
    title: "Calls in Arrears and Calls in Advance Working",
    description: "Template metadata for unpaid and early call money.",
    purpose: "Shows unpaid call money and early call money received from shareholders.",
    supportedAccountRoles: ["share_call", "calls_in_arrears", "calls_in_advance", "share_capital", "bank"],
    sections: [
      {
        id: "call-money-due",
        title: "Call Money Due",
        description: "Shows the total call money asked from shareholders.",
      },
      {
        id: "amount-received",
        title: "Amount Received",
        description: "Shows call money actually received by bank.",
      },
      {
        id: "calls-in-arrears",
        title: "Calls in Arrears",
        description: "Shows call money not yet received.",
      },
      {
        id: "calls-in-advance",
        title: "Calls in Advance",
        description: "Shows call money received before it became due.",
      },
      {
        id: "paid-up-capital-effect",
        title: "Paid-up Capital Effect",
        description: "Shows how arrears and advance amounts affect paid-up capital.",
      },
    ],
    beginnerExplanation: "This working shows who paid less than called and who paid before the company asked.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "share-forfeiture-working",
    title: "Share Forfeiture Working",
    description: "Template metadata for cancelled shares and forfeiture balance.",
    purpose:
      "Shows shares cancelled due to non-payment of calls and the amount transferred to Share Forfeiture Account.",
    supportedAccountRoles: ["share_capital", "calls_in_arrears", "share_forfeiture", "share_call"],
    sections: [
      {
        id: "shares-forfeited",
        title: "Shares Forfeited",
        description: "Shows the shares cancelled for non-payment.",
      },
      {
        id: "amount-called-up",
        title: "Amount Called-up",
        description: "Shows share capital called on forfeited shares.",
      },
      {
        id: "amount-unpaid",
        title: "Amount Unpaid",
        description: "Shows unpaid call money on forfeited shares.",
      },
      {
        id: "amount-already-received",
        title: "Amount Already Received",
        description: "Shows the amount already collected before forfeiture.",
      },
      {
        id: "share-forfeiture-balance",
        title: "Share Forfeiture Balance",
        description: "Shows the balance credited to Share Forfeiture Account.",
      },
    ],
    beginnerExplanation:
      "This working shows how much share capital is cancelled and how much money already received is kept in Share Forfeiture.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "capital-reserve-working",
    title: "Capital Reserve Working",
    description: "Template metadata for reserve created after reissue of forfeited shares.",
    purpose: "Shows how remaining Share Forfeiture balance becomes Capital Reserve after reissue of forfeited shares.",
    supportedAccountRoles: ["share_forfeiture", "capital_reserve", "share_capital", "bank"],
    sections: [
      {
        id: "share-forfeiture-balance",
        title: "Share Forfeiture Balance",
        description: "Shows the balance available from forfeited shares.",
      },
      {
        id: "discount-on-reissue",
        title: "Discount on Reissue",
        description: "Shows discount allowed when forfeited shares are reissued.",
      },
      {
        id: "reissue-gain",
        title: "Reissue Gain",
        description: "Shows gain left after reissue discount.",
      },
      {
        id: "capital-reserve-transfer",
        title: "Capital Reserve Transfer",
        description: "Shows the amount transferred to Capital Reserve.",
      },
    ],
    beginnerExplanation: "This working shows the profit kept after forfeited shares are reissued.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "debenture-schedule",
    title: "Debenture Schedule",
    description: "Template metadata for debenture issue, interest, and redemption details.",
    purpose: "Shows debenture issue, interest, discount, premium on redemption, and repayment details.",
    supportedAccountRoles: [
      "debenture",
      "debenture_interest",
      "discount_on_issue_of_debentures",
      "premium_on_redemption_of_debentures",
      "bank",
      "expense",
      "liability",
    ],
    sections: [
      {
        id: "debentures-issued",
        title: "Debentures Issued",
        description: "Shows the face value of debentures issued.",
      },
      {
        id: "issue-price",
        title: "Issue Price",
        description: "Shows cash or bank received on issue.",
      },
      {
        id: "discount-or-premium-on-issue",
        title: "Discount or Premium on Issue",
        description: "Shows discount or premium at the time of issue.",
      },
      {
        id: "interest-on-debentures",
        title: "Interest on Debentures",
        description: "Shows interest payable or paid on debentures.",
      },
      {
        id: "redemption-amount",
        title: "Redemption Amount",
        description: "Shows amount repayable on redemption.",
      },
      {
        id: "premium-on-redemption",
        title: "Premium on Redemption",
        description: "Shows extra amount payable on redemption if applicable.",
      },
    ],
    beginnerExplanation:
      "This schedule explains how much the company borrowed through debentures, interest payable, and repayment details.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "company-balance-sheet-notes",
    title: "Company Balance Sheet Notes",
    description: "Template metadata for supporting company Balance Sheet notes.",
    purpose:
      "Shows supporting details for company Balance Sheet items such as share capital, reserves, debentures, current liabilities, and assets.",
    supportedAccountRoles: [
      "share_capital",
      "securities_premium",
      "capital_reserve",
      "debenture",
      "asset",
      "liability",
      "bank",
    ],
    sections: [
      {
        id: "shareholders-funds",
        title: "Shareholders' Funds",
        description: "Shows equity share capital and reserves.",
      },
      {
        id: "share-capital",
        title: "Share Capital",
        description: "Shows details of share capital.",
      },
      {
        id: "reserves-and-surplus",
        title: "Reserves and Surplus",
        description: "Shows securities premium, capital reserve, and other reserves.",
      },
      {
        id: "non-current-liabilities",
        title: "Non-current Liabilities",
        description: "Shows long-term borrowings such as debentures.",
      },
      {
        id: "current-liabilities",
        title: "Current Liabilities",
        description: "Shows liabilities due in the short term.",
      },
      {
        id: "non-current-assets",
        title: "Non-current Assets",
        description: "Shows long-term assets such as machinery.",
      },
      {
        id: "current-assets",
        title: "Current Assets",
        description: "Shows cash, bank, and other current assets.",
      },
    ],
    beginnerExplanation: "These notes explain the details behind the main company Balance Sheet numbers.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
];

export const companyReportTemplateIds = companyReportTemplateFixtures.map((template) => template.id);

export const companyReportExampleFixtures: AccountingReport[] = [
  {
    id: "sample-share-capital-schedule",
    title: "Sample Share Capital Schedule",
    topic: "company_accounts",
    sections: [
      {
        id: "authorised-capital",
        title: "Authorised Capital",
        rows: [{ label: "Authorised Capital", amount: 500000 }],
      },
      {
        id: "issued-capital",
        title: "Issued Capital",
        rows: [{ label: "Issued Capital", amount: 200000 }],
      },
      {
        id: "subscribed-capital",
        title: "Subscribed Capital",
        rows: [{ label: "Subscribed Capital", amount: 200000 }],
      },
      {
        id: "called-up-capital",
        title: "Called-up Capital",
        rows: [{ label: "Called-up Capital", amount: 150000 }],
      },
      {
        id: "paid-up-capital",
        title: "Paid-up Capital",
        rows: [
          { label: "Paid-up Capital", amount: 147000 },
          { label: "Calls in Arrears", amount: 3000 },
        ],
      },
      {
        id: "securities-premium",
        title: "Securities Premium",
        rows: [{ label: "Securities Premium", amount: 20000 }],
      },
    ],
    summary: "Shows how share capital and premium can be represented.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-calls-in-arrears-and-advance-working",
    title: "Sample Calls in Arrears and Calls in Advance Working",
    topic: "company_accounts",
    sections: [
      {
        id: "call-money-due",
        title: "Call Money Due",
        rows: [{ label: "First Call Due", amount: 30000 }],
      },
      {
        id: "amount-received",
        title: "Amount Received",
        rows: [{ label: "Bank Received", amount: 27000 }],
      },
      {
        id: "calls-in-arrears",
        title: "Calls in Arrears",
        rows: [{ label: "Calls in Arrears", amount: 3000 }],
      },
      {
        id: "calls-in-advance",
        title: "Calls in Advance",
        rows: [{ label: "Calls in Advance", amount: 2000 }],
      },
    ],
    summary: "Shows unpaid and early call money representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-share-forfeiture-working",
    title: "Sample Share Forfeiture Working",
    topic: "company_accounts",
    sections: [
      {
        id: "amount-called-up",
        title: "Amount Called-up",
        rows: [{ label: "Share Capital Cancelled", amount: 10000 }],
      },
      {
        id: "amount-unpaid",
        title: "Amount Unpaid",
        rows: [{ label: "Calls in Arrears", amount: 3000 }],
      },
      {
        id: "amount-already-received",
        title: "Amount Already Received",
        rows: [{ label: "Amount Already Received", amount: 7000 }],
      },
      {
        id: "share-forfeiture-balance",
        title: "Share Forfeiture Balance",
        rows: [{ label: "Share Forfeiture Balance", amount: 7000 }],
      },
    ],
    summary: "Shows forfeiture representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-capital-reserve-working",
    title: "Sample Capital Reserve Working",
    topic: "company_accounts",
    sections: [
      {
        id: "share-forfeiture-balance",
        title: "Share Forfeiture Balance",
        rows: [{ label: "Share Forfeiture Balance", amount: 7000 }],
      },
      {
        id: "discount-on-reissue",
        title: "Discount on Reissue",
        rows: [{ label: "Discount on Reissue", amount: 2000 }],
      },
      {
        id: "capital-reserve-transfer",
        title: "Capital Reserve Transfer",
        rows: [{ label: "Capital Reserve", amount: 5000 }],
      },
    ],
    summary: "Shows capital reserve transfer after reissue.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-debenture-schedule",
    title: "Sample Debenture Schedule",
    topic: "company_accounts",
    sections: [
      {
        id: "debentures-issued",
        title: "Debentures Issued",
        rows: [{ label: "Debentures Issued", amount: 100000 }],
      },
      {
        id: "issue-price",
        title: "Issue Price",
        rows: [{ label: "Bank Received", amount: 95000 }],
      },
      {
        id: "discount-or-premium-on-issue",
        title: "Discount or Premium on Issue",
        rows: [{ label: "Discount on Issue", amount: 5000 }],
      },
      {
        id: "interest-on-debentures",
        title: "Interest on Debentures",
        rows: [{ label: "Debenture Interest", amount: 10000 }],
      },
      {
        id: "redemption-amount",
        title: "Redemption Amount",
        rows: [{ label: "Redemption Amount", amount: 100000 }],
      },
    ],
    summary: "Shows debenture issue and interest representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
  {
    id: "sample-company-balance-sheet-notes",
    title: "Sample Company Balance Sheet Notes",
    topic: "company_accounts",
    sections: [
      {
        id: "share-capital",
        title: "Share Capital",
        rows: [{ label: "Share Capital", amount: 200000 }],
      },
      {
        id: "reserves-and-surplus",
        title: "Reserves and Surplus",
        rows: [
          { label: "Securities Premium", amount: 20000 },
          { label: "Capital Reserve", amount: 5000 },
        ],
      },
      {
        id: "non-current-liabilities",
        title: "Non-current Liabilities",
        rows: [{ label: "Debentures", amount: 100000 }],
      },
      {
        id: "current-assets",
        title: "Current Assets",
        rows: [{ label: "Bank", amount: 95000 }],
      },
      {
        id: "non-current-assets",
        title: "Non-current Assets",
        rows: [{ label: "Machinery", amount: 150000 }],
      },
    ],
    summary: "Shows company notes representation.",
    metadata: {
      fixtureOnly: true,
      runtimeImplemented: false,
    },
  },
];
