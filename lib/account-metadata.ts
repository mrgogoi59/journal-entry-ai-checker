import type { PartyRole } from "./types";

export interface AccountMetadata {
  displayName: string;
  traditionalType: string;
  modernType: string;
  debitRule: string;
  creditRule: string;
  debitEffect: string;
  creditEffect: string;
  debitReason: string;
  creditReason: string;
}

export interface AccountMetadataContext {
  partyName?: string;
  partyRole?: PartyRole;
}

const assetDebitReason = "The asset is coming into or increasing in the business.";
const assetCreditReason = "The asset is going out of or decreasing in the business.";

export const accountMetadata: Record<string, AccountMetadata> = {
  Cash: {
    displayName: "Cash A/c",
    traditionalType: "Real Account",
    modernType: "Asset",
    debitRule: "Debit what comes in",
    creditRule: "Credit what goes out",
    debitEffect: "Cash increased",
    creditEffect: "Cash decreased",
    debitReason: "Cash came into the business.",
    creditReason: "Cash went out of the business.",
  },
  Bank: {
    displayName: "Bank A/c",
    traditionalType: "Real Account",
    modernType: "Asset",
    debitRule: "Debit what comes in",
    creditRule: "Credit what goes out",
    debitEffect: "Bank balance increased",
    creditEffect: "Bank balance decreased",
    debitReason: "Money came into the bank account.",
    creditReason: "Money went out through the bank account.",
  },
  Capital: {
    displayName: "Capital A/c",
    traditionalType: "Personal Account",
    modernType: "Owner's Equity",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: "Capital decreased",
    creditEffect: "Capital increased",
    debitReason: "The owner's claim on the business is reduced.",
    creditReason: "The owner gave value to the business, so Capital increases.",
  },
  Drawings: {
    displayName: "Drawings A/c",
    traditionalType: "Personal Account",
    modernType: "Contra Equity",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: "Drawings increased",
    creditEffect: "Drawings decreased",
    debitReason: "The owner received value for personal use.",
    creditReason: "Drawings are being reduced or adjusted.",
  },
  Purchases: {
    displayName: "Purchases A/c",
    traditionalType: "Nominal Account",
    modernType: "Expense",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect: "Purchase expense increased",
    creditEffect: "Purchase expense decreased",
    debitReason: "Goods bought for resale are recorded through Purchases A/c.",
    creditReason: "Purchases are being reduced or adjusted.",
  },
  Sales: {
    displayName: "Sales A/c",
    traditionalType: "Nominal Account",
    modernType: "Income/Revenue",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect: "Sales revenue decreased",
    creditEffect: "Sales revenue increased",
    debitReason: "Sales are being reduced or adjusted.",
    creditReason: "Goods sold by the business create revenue.",
  },
  Debtor: {
    displayName: "Debtor A/c",
    traditionalType: "Personal Account",
    modernType: "Asset",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: "Debtor balance increased",
    creditEffect: "Debtor balance decreased",
    debitReason: "The customer received goods or owes money to the business.",
    creditReason: "The debtor paid or the amount receivable reduced.",
  },
  Creditor: {
    displayName: "Creditor A/c",
    traditionalType: "Personal Account",
    modernType: "Liability",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: "Creditor liability decreased",
    creditEffect: "Creditor liability increased",
    debitReason: "The creditor received payment, so the liability reduced.",
    creditReason: "The supplier gave value on credit, so the business owes money.",
  },
  "Rent Expense": expenseMetadata("Rent Expense", "Rent expense increased", "Rent was paid or became due."),
  "Salary Expense": expenseMetadata("Salary Expense", "Salary expense increased", "Salary was paid or became due."),
  "Interest Expense": expenseMetadata("Interest Expense", "Interest expense increased", "Interest was paid or became due."),
  "Electricity Expense": expenseMetadata(
    "Electricity Expense",
    "Electricity expense increased",
    "Electricity bill was paid or became due.",
  ),
  "Interest Income": incomeMetadata("Interest Income", "Interest income increased", "Interest was earned or received."),
  "Commission Income": incomeMetadata(
    "Commission Income",
    "Commission income increased",
    "Commission was earned or received.",
  ),
  Loan: {
    displayName: "Loan A/c",
    traditionalType: "Personal Account",
    modernType: "Liability",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: "Loan liability decreased",
    creditEffect: "Loan liability increased",
    debitReason: "Loan is being repaid, so the liability decreases.",
    creditReason: "Loan money was received, so the liability increases.",
  },
  Furniture: assetMetadata("Furniture", "Furniture increased", "Furniture decreased"),
  Machinery: assetMetadata("Machinery", "Machinery increased", "Machinery decreased"),
  Equipment: assetMetadata("Equipment", "Equipment increased", "Equipment decreased"),
  Vehicle: assetMetadata("Vehicle", "Vehicle increased", "Vehicle decreased"),
  Computer: assetMetadata("Computer", "Computer increased", "Computer decreased"),
};

export function getAccountMetadata(account: string, context?: AccountMetadataContext): AccountMetadata {
  if (context?.partyName === account && context.partyRole) {
    return partyAccountMetadata(account, context.partyRole);
  }

  return (
    accountMetadata[account] ?? {
      displayName: `${account} A/c`,
      traditionalType: "Account",
      modernType: "Account",
      debitRule: "Debit the account that receives benefit",
      creditRule: "Credit the account that gives benefit",
      debitEffect: `${account} increased or received benefit`,
      creditEffect: `${account} decreased or gave benefit`,
      debitReason: "This account is placed on the debit side by the rule engine.",
      creditReason: "This account is placed on the credit side by the rule engine.",
    }
  );
}

export function displayAccountName(account: string): string {
  return getAccountMetadata(account).displayName;
}

function assetMetadata(account: string, debitEffect: string, creditEffect: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Real Account",
    modernType: "Asset",
    debitRule: "Debit what comes in",
    creditRule: "Credit what goes out",
    debitEffect,
    creditEffect,
    debitReason: assetDebitReason,
    creditReason: assetCreditReason,
  };
}

function expenseMetadata(account: string, debitEffect: string, debitReason: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Nominal Account",
    modernType: "Expense",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect,
    creditEffect: `${account} decreased`,
    debitReason,
    creditReason: "The expense is being reduced or adjusted.",
  };
}

function incomeMetadata(account: string, creditEffect: string, creditReason: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Nominal Account",
    modernType: "Income/Revenue",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect: `${account} decreased`,
    creditEffect,
    debitReason: "The income is being reduced or adjusted.",
    creditReason,
  };
}

function partyAccountMetadata(account: string, partyRole: PartyRole): AccountMetadata {
  if (partyRole === "debtor") {
    return {
      displayName: `${account} A/c`,
      traditionalType: "Personal Account",
      modernType: "Asset / Debtor",
      debitRule: "Debit the receiver",
      creditRule: "Credit the giver",
      debitEffect: `Amount receivable from ${account} increased`,
      creditEffect: `Amount receivable from ${account} decreased`,
      debitReason: `${account} received goods on credit, so ${account} becomes debtor of the business.`,
      creditReason: `${account} paid the business, so the amount receivable from ${account} reduced.`,
    };
  }

  if (partyRole === "creditor") {
    return {
      displayName: `${account} A/c`,
      traditionalType: "Personal Account",
      modernType: "Liability / Creditor",
      debitRule: "Debit the receiver",
      creditRule: "Credit the giver",
      debitEffect: `Amount payable to ${account} decreased`,
      creditEffect: `Amount payable to ${account} increased`,
      debitReason: `${account} received payment, so the amount payable to ${account} reduced.`,
      creditReason: `${account} supplied goods or assets on credit, so the business owes money to ${account}.`,
    };
  }

  return {
    displayName: `${account} A/c`,
    traditionalType: "Personal Account",
    modernType: partyRole === "customer" ? "Customer" : "Supplier",
    debitRule: "Debit the receiver",
    creditRule: "Credit the giver",
    debitEffect: `${account} received benefit`,
    creditEffect: `${account} gave benefit`,
    debitReason: `${account} is the named party in the transaction.`,
    creditReason: `${account} is the named party in the transaction.`,
  };
}
