import { generateLedger, type LedgerAccount, type LedgerJournalLine, type LedgerResult } from "./ledger-engine";

export type TrialBalanceRow = {
  account: string;
  debit: number;
  credit: number;
};

export type TrialBalanceResult = {
  status: "success" | "invalid";
  rows: TrialBalanceRow[];
  debitTotal: number;
  creditTotal: number;
  agrees: boolean;
  difference: number;
  parsedEntries: LedgerJournalLine[][];
  ledgerAccounts: LedgerAccount[];
  errors: string[];
  logic: string[];
  commonMistakes: string[];
};

const commonMistakes = [
  "Do not put all ledger accounts on the debit side.",
  "Asset and expense balances usually appear on the debit side.",
  "Capital, liability, and income balances usually appear on the credit side.",
  "Trial Balance is prepared from ledger balances, not directly from transaction wording.",
  "If journal entries are unbalanced, Trial Balance will not be reliable.",
  "Trial Balance agreement does not guarantee there is no accounting error; it only checks debit-credit equality.",
];

export function generateTrialBalance(input: string): TrialBalanceResult {
  const ledgerResult = generateLedger(input);

  if (ledgerResult.status === "invalid") {
    return invalidResult(ledgerResult);
  }

  const rows = ledgerResult.ledgerAccounts
    .filter((account) => account.balanceSide !== "balanced" && account.balanceAmount > 0)
    .map((account) => ({
      account: account.account,
      debit: account.balanceSide === "debit" ? account.balanceAmount : 0,
      credit: account.balanceSide === "credit" ? account.balanceAmount : 0,
    }));

  const debitTotal = rows.reduce((total, row) => total + row.debit, 0);
  const creditTotal = rows.reduce((total, row) => total + row.credit, 0);
  const difference = Math.abs(debitTotal - creditTotal);

  return {
    status: "success",
    rows,
    debitTotal,
    creditTotal,
    agrees: difference === 0,
    difference,
    parsedEntries: ledgerResult.parsedEntries,
    ledgerAccounts: ledgerResult.ledgerAccounts,
    errors: [],
    logic: buildLogic(ledgerResult.ledgerAccounts),
    commonMistakes,
  };
}

function invalidResult(ledgerResult: LedgerResult): TrialBalanceResult {
  return {
    status: "invalid",
    rows: [],
    debitTotal: 0,
    creditTotal: 0,
    agrees: false,
    difference: 0,
    parsedEntries: [],
    ledgerAccounts: [],
    errors: ledgerResult.errors,
    logic: [],
    commonMistakes,
  };
}

function buildLogic(ledgerAccounts: LedgerAccount[]): string[] {
  const balanceLogic = ledgerAccounts
    .filter((account) => account.balanceSide !== "balanced" && account.balanceAmount > 0)
    .slice(0, 6)
    .map((account) => {
      const side = account.balanceSide === "debit" ? "debit" : "credit";
      const higherTotal = account.balanceSide === "debit" ? "debit total" : "credit total";
      return `${account.account} A/c has a ${side} balance because its ${higherTotal} is higher.`;
    });

  return [
    ...balanceLogic,
    "Trial Balance is prepared by listing debit balances in the Debit column and credit balances in the Credit column.",
    "Trial Balance agrees when total debit balances equal total credit balances.",
  ];
}
