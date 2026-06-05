import type { CorrectJournalEntry, JournalLine, MistakeType, ParsedJournalEntry, ValidationResult } from "./types";

export function validateEntry(parsed: ParsedJournalEntry, expected: CorrectJournalEntry): ValidationResult {
  if (hasFormatError(parsed)) {
    return result(false, false, false, parsed.isBalanced, "format_error");
  }

  const parsedAccounts = allAccounts(parsed);
  const expectedLines = allExpectedLines(expected);
  const hasExpectedAccounts = expectedLines.every((expectedLine) =>
    allParsedLines(parsed).some((line) => lineMatches(line, expectedLine)),
  );
  const correctSides =
    expected.debits.every((expectedLine) => hasMatchingAccount(parsed.debits, expectedLine)) &&
    expected.credits.every((expectedLine) => hasMatchingAccount(parsed.credits, expectedLine));
  const reversedSides =
    expected.debits.every((expectedLine) => hasMatchingAccount(parsed.credits, expectedLine)) &&
    expected.credits.every((expectedLine) => hasMatchingAccount(parsed.debits, expectedLine));
  const correctAmount = hasCorrectAmount(parsed, expected, hasExpectedAccounts);

  let mistakeType: MistakeType = "correct";

  if (parsed.debits.length === 0 || parsed.credits.length === 0) {
    mistakeType = "missing_account";
  } else if (reversedSides && !correctSides) {
    mistakeType = "reversed_sides";
  } else if (!hasExpectedAccounts) {
    mistakeType = parsedAccounts.length < expectedLines.length ? "missing_account" : "wrong_account";
  } else if (correctSides && !correctAmount) {
    mistakeType = "amount_mismatch";
  } else if (!parsed.isBalanced) {
    mistakeType = "unbalanced_entry";
  } else if (!correctAmount) {
    mistakeType = "amount_mismatch";
  } else if (!correctSides) {
    mistakeType = "wrong_account";
  }

  return result(hasExpectedAccounts, correctSides, correctAmount, parsed.isBalanced, mistakeType);
}

function result(
  correctAccounts: boolean,
  correctSides: boolean,
  correctAmount: boolean,
  isBalanced: boolean,
  mistake_type: MistakeType,
): ValidationResult {
  return {
    correctAccounts,
    correctSides,
    correctAmount,
    isBalanced,
    mistake_type,
  };
}

function allAccounts(parsed: ParsedJournalEntry): string[] {
  return [...parsed.debits, ...parsed.credits].map((line) => line.account);
}

function accountMatches(account: string, expectedLine: JournalLine): boolean {
  return [expectedLine.account, ...(expectedLine.acceptedAccounts ?? [])].includes(account);
}

function lineMatches(line: JournalLine, expectedLine: JournalLine): boolean {
  if (accountMatches(line.account, expectedLine)) return true;
  return Boolean(line.rawAccount && expectedLine.acceptedRawAccounts?.includes(line.rawAccount));
}

function hasMatchingAccount(lines: JournalLine[], expectedLine: JournalLine): boolean {
  return lines.some((line) => lineMatches(line, expectedLine));
}

function hasMatchingAmount(lines: JournalLine[], expectedLine: JournalLine): boolean {
  return lines.some((line) => lineMatches(line, expectedLine) && line.amount === expectedLine.amount);
}

function hasFormatError(parsed: ParsedJournalEntry): boolean {
  if (parsed.debits.length === 0 && parsed.credits.length === 0) return true;
  return parsed.errors.some((error) => error.startsWith("Could not understand"));
}

function hasCorrectAmount(
  parsed: ParsedJournalEntry,
  expected: CorrectJournalEntry,
  hasBothAccounts: boolean,
): boolean {
  const expectedAmount = expected.debits[0]?.amount;
  if (!expectedAmount) return false;

  if (hasBothAccounts) {
    const parsedLines = [...parsed.debits, ...parsed.credits];
    return allExpectedLines(expected).every((expectedLine) => hasMatchingAmount(parsedLines, expectedLine));
  }

  return parsed.debitTotal === expectedAmount && parsed.creditTotal === expectedAmount;
}

function allExpectedLines(expected: CorrectJournalEntry): JournalLine[] {
  return [...expected.debits, ...expected.credits];
}

function allParsedLines(parsed: ParsedJournalEntry): JournalLine[] {
  return [...parsed.debits, ...parsed.credits];
}
