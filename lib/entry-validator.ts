import type { CorrectJournalEntry, MistakeType, ParsedJournalEntry, ValidationResult } from "./types";

export function validateEntry(parsed: ParsedJournalEntry, expected: CorrectJournalEntry): ValidationResult {
  if (hasFormatError(parsed)) {
    return result(false, false, false, parsed.isBalanced, "format_error");
  }

  const expectedDebit = expected.debits[0];
  const expectedCredit = expected.credits[0];
  const parsedAccounts = allAccounts(parsed);
  const matchingDebit = parsed.debits.find((line) => line.account === expectedDebit.account);
  const matchingCredit = parsed.credits.find((line) => line.account === expectedCredit.account);
  const reversedDebit = parsed.debits.find((line) => line.account === expectedCredit.account);
  const reversedCredit = parsed.credits.find((line) => line.account === expectedDebit.account);

  const hasBothAccounts =
    parsedAccounts.includes(expectedDebit.account) && parsedAccounts.includes(expectedCredit.account);
  const correctSides = Boolean(matchingDebit && matchingCredit);
  const correctAmount = hasCorrectAmount(parsed, expected, hasBothAccounts);

  let mistakeType: MistakeType = "correct";

  if (parsed.debits.length === 0 || parsed.credits.length === 0) {
    mistakeType = "missing_account";
  } else if (reversedDebit && reversedCredit && !correctSides) {
    mistakeType = "reversed_sides";
  } else if (!hasBothAccounts) {
    mistakeType = parsedAccounts.length < 2 ? "missing_account" : "wrong_account";
  } else if (correctSides && !correctAmount) {
    mistakeType = "amount_mismatch";
  } else if (!parsed.isBalanced) {
    mistakeType = "unbalanced_entry";
  } else if (!correctAmount) {
    mistakeType = "amount_mismatch";
  } else if (!correctSides) {
    mistakeType = "wrong_account";
  }

  return result(hasBothAccounts, correctSides, correctAmount, parsed.isBalanced, mistakeType);
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
    const matchingLines = [...parsed.debits, ...parsed.credits].filter((line) =>
      [expected.debits[0].account, expected.credits[0].account].includes(line.account),
    );

    return matchingLines.length >= 2 && matchingLines.every((line) => line.amount === expectedAmount);
  }

  return parsed.debitTotal === expectedAmount && parsed.creditTotal === expectedAmount;
}
