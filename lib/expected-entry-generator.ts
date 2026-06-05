import type { CorrectJournalEntry, JournalLine, TransactionClassification } from "./types";

export function generateExpectedEntry(classification: TransactionClassification): CorrectJournalEntry {
  if (classification.expectedEntry) {
    return cloneEntry(classification.expectedEntry);
  }

  return {
    debits: [buildLine(classification, "debit")],
    credits: [buildLine(classification, "credit")],
  };
}

function cloneEntry(entry: CorrectJournalEntry): CorrectJournalEntry {
  return {
    debits: entry.debits.map((line) => ({ ...line })),
    credits: entry.credits.map((line) => ({ ...line })),
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

  const acceptedRawAccounts = acceptedRawAccountsForSide(classification, side);
  if (acceptedRawAccounts) {
    Object.defineProperty(line, "acceptedRawAccounts", {
      value: acceptedRawAccounts,
      enumerable: false,
    });
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

function acceptedRawAccountsForSide(
  classification: TransactionClassification,
  side: "debit" | "credit",
): string[] | undefined {
  if (side !== "debit") return undefined;

  if (classification.transaction_type === "rent_received_in_advance") return ["rent"];
  if (classification.transaction_type === "commission_received_in_advance") return ["commission"];
  if (classification.transaction_type === "interest_received_in_advance") return ["interest"];

  return undefined;
}
