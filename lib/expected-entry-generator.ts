import type { CorrectJournalEntry, JournalLine, TransactionClassification } from "./types";

export function generateExpectedEntry(classification: TransactionClassification): CorrectJournalEntry {
  return {
    debits: [buildLine(classification, "debit")],
    credits: [buildLine(classification, "credit")],
  };
}

function buildLine(classification: TransactionClassification, side: "debit" | "credit"): JournalLine {
  const line: JournalLine = {
    account: side === "debit" ? classification.debitAccount : classification.creditAccount,
    amount: classification.amount,
  };

  const acceptedAccounts = acceptedAccountsForSide(classification, side);
  if (acceptedAccounts) {
    line.acceptedAccounts = acceptedAccounts;
  }

  if (classification.partyAccountSide === side && classification.partyRole) {
    line.partyRole = classification.partyRole;
  }

  return line;
}

function acceptedAccountsForSide(
  classification: TransactionClassification,
  side: "debit" | "credit",
): string[] | undefined {
  if (classification.partyAccountSide !== side) return undefined;

  const genericAccount = side === "debit" ? classification.genericDebitAccount : classification.genericCreditAccount;
  if (!genericAccount || genericAccount === classification.partyName) return undefined;

  return [genericAccount];
}
