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
    modernType: "Capital reduction / Owner's withdrawal",
    debitRule: "Debit the receiver / Capital decreases are debited",
    creditRule: "Credit the giver",
    debitEffect: "Drawings increased",
    creditEffect: "Drawings decreased",
    debitReason: "The owner has withdrawn value from the business for personal use.",
    creditReason: "Drawings are being reduced or adjusted.",
  },
  Purchases: {
    displayName: "Purchases A/c",
    traditionalType: "Nominal Account",
    modernType: "Expense / Goods purchased for resale",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit the account when reducing purchases / Reduce goods purchased for resale",
    debitEffect: "Purchase expense increased",
    creditEffect: "Purchases/goods available for business decreased",
    debitReason: "Goods bought for resale are recorded through Purchases A/c.",
    creditReason: "Goods originally purchased for business resale are taken out of the business, so Purchases A/c is credited.",
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
  "Sales Return": {
    displayName: "Sales Return A/c",
    traditionalType: "Nominal Account",
    modernType: "Contra Revenue / Sales Reduction",
    debitRule: "Debit the account that reduces income / Debit sales returns",
    creditRule: "Credit all incomes and gains",
    debitEffect: "Sales return increased and sales revenue reduced",
    creditEffect: "Sales return decreased",
    debitReason: "Goods sold earlier were returned by the customer, so Sales Return A/c is debited.",
    creditReason: "Sales return is being reduced or adjusted.",
  },
  "Purchase Return": {
    displayName: "Purchase Return A/c",
    traditionalType: "Nominal Account",
    modernType: "Contra Expense / Purchase Reduction",
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit the account that reduces expense / Credit purchase returns",
    debitEffect: "Purchase return decreased",
    creditEffect: "Purchase return increased and purchases reduced",
    debitReason: "Purchase return is being reduced or adjusted.",
    creditReason: "Goods purchased earlier were returned to supplier, so Purchase Return A/c is credited.",
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
  "Wages Expense": expenseMetadata(
    "Wages Expense",
    "Wages expense increased",
    "The expense has been incurred during the accounting period.",
  ),
  "Interest Expense": expenseMetadata("Interest Expense", "Interest expense increased", "Interest was paid or became due."),
  "Electricity Expense": expenseMetadata(
    "Electricity Expense",
    "Electricity expense increased",
    "Electricity bill was paid or became due.",
  ),
  "Advertisement Expense": expenseMetadata(
    "Advertisement Expense",
    "Advertisement expense increased",
    "Goods distributed as free samples are treated as advertisement/promotion expense.",
  ),
  "Charity Expense": expenseMetadata(
    "Charity Expense",
    "Charity/donation expense increased",
    "Goods given as charity are treated as donation/charity expense.",
  ),
  "Loss by Fire": expenseMetadata(
    "Loss by Fire",
    "Loss by fire increased",
    "Goods lost by fire are treated as a business loss.",
    "Expense / Loss",
  ),
  "Loss by Theft": expenseMetadata(
    "Loss by Theft",
    "Loss by theft increased",
    "Goods stolen/lost by theft are treated as a business loss.",
    "Expense / Loss",
  ),
  "Goods Lost": expenseMetadata(
    "Goods Lost",
    "Goods loss increased",
    "Goods lost or damaged are treated as a business loss.",
    "Expense / Loss",
  ),
  "Insurance Expense": expenseMetadata(
    "Insurance Expense",
    "Insurance expense increased",
    "The expense has been incurred during the accounting period.",
  ),
  "Outstanding Salary": outstandingExpenseMetadata("Outstanding Salary"),
  "Outstanding Rent": outstandingExpenseMetadata("Outstanding Rent"),
  "Outstanding Wages": outstandingExpenseMetadata("Outstanding Wages"),
  "Outstanding Electricity": outstandingExpenseMetadata("Outstanding Electricity"),
  "Outstanding Insurance": outstandingExpenseMetadata("Outstanding Insurance"),
  "Prepaid Rent": prepaidExpenseMetadata("Prepaid Rent"),
  "Prepaid Insurance": prepaidExpenseMetadata("Prepaid Insurance"),
  "Prepaid Salary": prepaidExpenseMetadata("Prepaid Salary"),
  "Prepaid Wages": prepaidExpenseMetadata("Prepaid Wages"),
  "Prepaid Electricity": prepaidExpenseMetadata("Prepaid Electricity"),
  "Accrued Interest": accruedIncomeMetadata("Accrued Interest"),
  "Accrued Commission": accruedIncomeMetadata("Accrued Commission"),
  "Accrued Rent": accruedIncomeMetadata("Accrued Rent"),
  "Rent Received in Advance": incomeReceivedInAdvanceMetadata("Rent Received in Advance"),
  "Commission Received in Advance": incomeReceivedInAdvanceMetadata("Commission Received in Advance"),
  "Interest Received in Advance": incomeReceivedInAdvanceMetadata("Interest Received in Advance"),
  "Interest Income": incomeMetadata("Interest Income", "Interest income increased", "Interest was earned or received."),
  "Commission Income": incomeMetadata(
    "Commission Income",
    "Commission income increased",
    "Commission was earned or received.",
  ),
  "Rent Income": incomeMetadata("Rent Income", "Rent income increased", "Rent income was earned during the period."),
  "Bad Debts": expenseMetadata(
    "Bad Debts",
    "Bad debts loss increased",
    "Bad debt is a loss because the business cannot recover the amount from the debtor.",
    "Expense / Loss",
  ),
  "Bad Debts Recovered": incomeMetadata(
    "Bad Debts Recovered",
    "Bad debts recovery income increased",
    "An amount previously written off as bad debt has been recovered, so it is treated as income/gain.",
    "Income / Gain",
  ),
  "Discount Allowed": expenseMetadata(
    "Discount Allowed",
    "Discount allowed loss increased",
    "Discount allowed reduces the amount received from debtor and is treated as a loss/expense.",
    "Expense / Loss",
  ),
  "Discount Received": incomeMetadata(
    "Discount Received",
    "Discount received income increased",
    "Discount received reduces the amount paid to creditor and is treated as income/gain.",
    "Income / Gain",
  ),
  Depreciation: expenseMetadata(
    "Depreciation",
    "Depreciation expense increased",
    "Depreciation is a loss/expense due to reduction in asset value.",
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

function expenseMetadata(
  account: string,
  debitEffect: string,
  debitReason: string,
  modernType = "Expense",
): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Nominal Account",
    modernType,
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect,
    creditEffect: `${account} decreased`,
    debitReason,
    creditReason: "The expense is being reduced or adjusted.",
  };
}

function incomeMetadata(
  account: string,
  creditEffect: string,
  creditReason: string,
  modernType = "Income/Revenue",
): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Nominal Account",
    modernType,
    debitRule: "Debit all expenses and losses",
    creditRule: "Credit all incomes and gains",
    debitEffect: `${account} decreased`,
    creditEffect,
    debitReason: "The income is being reduced or adjusted.",
    creditReason,
  };
}

function outstandingExpenseMetadata(account: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Personal Account / Representative Personal Account",
    modernType: "Liability",
    debitRule: "Debit the receiver / Liability decreases are debited",
    creditRule: "Credit the giver / Liability increases are credited",
    debitEffect: "Outstanding liability decreased",
    creditEffect: "Outstanding liability increased",
    debitReason: "The payable amount is being reduced or settled.",
    creditReason: "The expense has become payable but has not yet been paid.",
  };
}

function prepaidExpenseMetadata(account: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Real Account",
    modernType: "Asset",
    debitRule: "Debit what comes in / Asset increases are debited",
    creditRule: "Credit what goes out / Asset decreases are credited",
    debitEffect: "Prepaid asset increased",
    creditEffect: "Prepaid asset decreased",
    debitReason:
      "The amount paid in advance gives future benefit to the business, so it is treated as an asset.",
    creditReason: "The future benefit is being reduced or adjusted.",
  };
}

function accruedIncomeMetadata(account: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Personal Account / Representative Personal Account",
    modernType: "Asset / Receivable",
    debitRule: "Debit the receiver / Asset increases are debited",
    creditRule: "Credit the giver / Asset decreases are credited",
    debitEffect: "Accrued income receivable increased",
    creditEffect: "Accrued income receivable decreased",
    debitReason: "The income has been earned but not yet received, so a receivable asset is created.",
    creditReason: "The accrued receivable is being reduced or adjusted.",
  };
}

function incomeReceivedInAdvanceMetadata(account: string): AccountMetadata {
  return {
    displayName: `${account} A/c`,
    traditionalType: "Personal Account / Representative Personal Account",
    modernType: "Liability",
    debitRule: "Debit the receiver / Liability decreases are debited",
    creditRule: "Credit the giver / Liability increases are credited",
    debitEffect: "Unearned income liability decreased",
    creditEffect: "Unearned income liability increased",
    debitReason: "The unearned income liability is being reduced or adjusted.",
    creditReason:
      "The business has received income before earning it, so it has an obligation to provide service/benefit later.",
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
