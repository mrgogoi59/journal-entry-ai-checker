import { cleanAccountName, normalizeAccountName } from "./account-synonyms";
import { extractAmount, removeFirstAmount } from "./amount-parser";
import type { EntryLineSide, JournalLine, ParsedJournalEntry } from "./types";

export function parseJournalEntry(input: string): ParsedJournalEntry {
  const debits: JournalLine[] = [];
  const credits: JournalLine[] = [];
  const errors: string[] = [];

  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return emptyEntry(["Journal entry is empty."]);
  }

  for (const line of lines) {
    const parsed = parseLine(line);

    if (!parsed) {
      errors.push(`Could not understand line: ${line}`);
      continue;
    }

    if (parsed.side === "debit") {
      debits.push(parsed.entry);
    } else {
      credits.push(parsed.entry);
    }
  }

  const debitTotal = total(debits);
  const creditTotal = total(credits);

  if (debits.length === 0 || credits.length === 0) {
    errors.push("Entry must include at least one debit and one credit.");
  }

  return {
    debits,
    credits,
    debitTotal,
    creditTotal,
    isBalanced: debitTotal === creditTotal && debitTotal > 0,
    errors,
  };
}

function parseLine(line: string): { side: EntryLineSide; entry: JournalLine } | null {
  const side = detectSide(line);
  if (!side) return null;

  const amount = extractAmount(line);
  if (!amount) return null;

  const accountText = removeFirstAmount(line)
    .replace(/\b(dr\.?|debit|cr\.?|credit|to)\b/gi, " ")
    .replace(/\b(rs\.?|inr)\b/gi, " ")
    .replace(/[₹]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!accountText) return null;

  const entry: JournalLine = {
    account: normalizeAccountName(accountText, side),
    amount,
  };
  Object.defineProperty(entry, "rawAccount", {
    value: cleanAccountName(accountText),
    enumerable: false,
  });

  return { side, entry };
}

function detectSide(line: string): EntryLineSide | null {
  if (/^\s*to\b/i.test(line) || /\b(cr\.?|credit)\b/i.test(line)) return "credit";
  if (/\b(dr\.?|debit)\b/i.test(line)) return "debit";
  return null;
}

function total(lines: JournalLine[]): number {
  return lines.reduce((sum, line) => sum + line.amount, 0);
}

function emptyEntry(errors: string[]): ParsedJournalEntry {
  return {
    debits: [],
    credits: [],
    debitTotal: 0,
    creditTotal: 0,
    isBalanced: false,
    errors,
  };
}
