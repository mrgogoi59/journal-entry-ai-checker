import type { CorrectJournalEntry, TransactionClassification } from "./types";

export function generateExpectedEntry(classification: TransactionClassification): CorrectJournalEntry {
  return {
    debits: [{ account: classification.debitAccount, amount: classification.amount }],
    credits: [{ account: classification.creditAccount, amount: classification.amount }],
  };
}
