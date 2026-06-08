import type { JournalEntry } from "../types";

export type CoreJournalEntryTotals = {
  debitTotal: number;
  creditTotal: number;
};

export function coreJournalEntryToJournalText(entry: JournalEntry): string {
  assertSerializableCoreJournalEntry(entry);

  return entry.lines.map(coreJournalLineToJournalText).join("\n");
}

export function coreJournalEntriesToJournalText(entries: JournalEntry[]): string {
  return entries.map(coreJournalEntryToJournalText).join("\n\n");
}

export function isCoreJournalEntryBalanced(entry: JournalEntry): boolean {
  const { debitTotal, creditTotal } = getCoreJournalEntryTotals(entry);
  return debitTotal === creditTotal && debitTotal > 0;
}

export function getCoreJournalEntryTotals(entry: JournalEntry): CoreJournalEntryTotals {
  return {
    debitTotal: entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0),
    creditTotal: entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0),
  };
}

export function assertSerializableCoreJournalEntry(entry: JournalEntry): void {
  if (entry.lines.length === 0) {
    throw new Error("Core journal entry must include at least one line.");
  }

  const debitLines = entry.lines.filter((line) => line.side === "debit");
  const creditLines = entry.lines.filter((line) => line.side === "credit");

  if (debitLines.length === 0) {
    throw new Error("Core journal entry must include at least one debit line.");
  }

  if (creditLines.length === 0) {
    throw new Error("Core journal entry must include at least one credit line.");
  }

  entry.lines.forEach((line) => {
    if (line.amount <= 0) {
      throw new Error("Core journal entry amounts must be greater than zero.");
    }
  });

  const { debitTotal, creditTotal } = getCoreJournalEntryTotals(entry);

  if (debitTotal !== creditTotal) {
    throw new Error(`Core journal entry must be balanced. Debit total ${debitTotal} does not equal credit total ${creditTotal}.`);
  }
}

export function formatCoreAmount(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : String(amount).replace(/\.?0+$/, "");
}

function coreJournalLineToJournalText(line: JournalEntry["lines"][number]): string {
  const accountName = formatCoreAccountName(line.account.name);
  const amount = formatCoreAmount(line.amount);

  return line.side === "debit" ? `${accountName} Dr. Rs.${amount}` : `To ${accountName} Rs.${amount}`;
}

function formatCoreAccountName(accountName: string): string {
  return /\s+a\/c$/i.test(accountName) ? accountName : `${accountName} A/c`;
}
