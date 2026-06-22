import type {
  JournalEntryPracticeAnswerKey,
  JournalEntryPracticeAttempt,
  JournalEntryPracticeAttemptRow,
  JournalEntryPracticeBalanceResult,
  JournalEntryPracticeCheckResult,
  JournalEntryPracticeFieldResult,
  JournalEntryPracticeFeedbackStatus,
  JournalEntryPracticeNarrationResult,
  JournalEntryPracticeRowResult,
  JournalEntryPracticeTotalsResult,
} from "./types";
import { JOURNAL_ENTRY_PRACTICE_LIMITS } from "./types";

type ParsedAttemptRow = JournalEntryPracticeAttemptRow & {
  isEmpty: boolean;
  hasDr: boolean;
  hasTo: boolean;
  accountKey: string;
  debitValue: number | null;
  creditValue: number | null;
  debitFilled: boolean;
  creditFilled: boolean;
};

const unsupportedTotalsResult: JournalEntryPracticeTotalsResult = {
  status: "error",
  expectedDebit: 0,
  expectedCredit: 0,
  enteredDebit: null,
  enteredCredit: null,
  rowDebitTotal: 0,
  rowCreditTotal: 0,
  messages: ["This question is not supported by the Journal Entries preview checker."],
};

const narrationFillerWords = new Set([
  "a",
  "an",
  "as",
  "being",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "of",
  "the",
  "through",
  "to",
  "was",
  "were",
  "with",
]);

const narrationTokenAliases: Record<string, string> = {
  bought: "purchase",
  buying: "purchase",
  buys: "purchase",
  deposited: "deposit",
  depositing: "deposit",
  deposits: "deposit",
  expense: "expense",
  expenses: "expense",
  good: "goods",
  goods: "goods",
  paid: "paid",
  pay: "paid",
  payment: "paid",
  payments: "paid",
  purchase: "purchase",
  purchased: "purchase",
  purchases: "purchase",
  sale: "sale",
  sales: "sale",
  salaries: "salary",
  salary: "salary",
  sell: "sale",
  selling: "sale",
  sells: "sale",
  sold: "sale",
  withdrew: "withdrawn",
  withdrawal: "withdrawn",
  withdrawing: "withdrawn",
};

export function checkJournalEntryPracticeAttempt(
  attemptInput: unknown,
  expected: JournalEntryPracticeAnswerKey | null,
): JournalEntryPracticeCheckResult {
  const questionId = getQuestionId(attemptInput);

  if (!expected || questionId !== expected.questionId) {
    return createUnsupportedResult(questionId);
  }

  const validation = validateAttemptInput(attemptInput, expected);

  if (!validation.ok) {
    return createMalformedAttemptResult(questionId, expected, validation.errors);
  }

  const attempt = validation.attempt;

  if (isAttemptCompletelyBlank(attempt)) {
    return createBlankAttemptResult(attempt.questionId, expected);
  }

  const parsedRows = attempt.rows.map(parseAttemptRow);
  const activeRows = parsedRows.filter((row) => !row.isEmpty);
  const rowResults: JournalEntryPracticeRowResult[] = [];
  const hardErrors: string[] = [];
  const warnings: string[] = [];
  const gotRight: string[] = [];
  const hints = new Set<string>();
  const matchedAccountRows = new Map<string, ParsedAttemptRow[]>();

  for (const row of activeRows) {
    const expectedLine = expected.expectedLines.find((line) => line.accountKey === row.accountKey);
    const rowFeedback = expectedLine
      ? evaluateExpectedLineRow(row, expectedLine)
      : evaluateUnexpectedRow(row, expected);

    rowResults.push(rowFeedback.rowResult);
    rowFeedback.errors.forEach((error) => hardErrors.push(error));
    rowFeedback.warnings.forEach((warning) => warnings.push(warning));
    rowFeedback.hints.forEach((hint) => hints.add(hint));

    if (expectedLine && rowFeedback.errors.length === 0) {
      gotRight.push(expectedLine.correctMessage);
      matchedAccountRows.set(row.accountKey, [...(matchedAccountRows.get(row.accountKey) ?? []), row]);
    } else if (expectedLine) {
      matchedAccountRows.set(row.accountKey, [...(matchedAccountRows.get(row.accountKey) ?? []), row]);
    }
  }

  for (const expectedLine of expected.expectedLines) {
    const matchedRows = matchedAccountRows.get(expectedLine.accountKey) ?? [];

    if (matchedRows.length === 0) {
      hardErrors.push(`${expectedLine.requiredParticularsHint} is missing.`);
      hints.add(expectedLine.errorMessage);
      continue;
    }

    if (matchedRows.length > 1) {
      hardErrors.push(`${expectedLine.requiredParticularsHint} appears more than once.`);
      hints.add("Write each required account line once only.");
    }
  }

  if (hasCorrectLinesInReverseOrder(matchedAccountRows, expected)) {
    warnings.push("Your correct lines are in reverse visual order. Write the debit line before the credit line.");
    hints.add("Journal entries normally show the debited account first, then the credited account with To.");
  }

  const totalsResult = evaluateTotals(attempt, activeRows, expected);
  if (totalsResult.status === "error") {
    hardErrors.push(...totalsResult.messages.filter(isHardTotalMessage));
  } else if (totalsResult.status === "warning") {
    warnings.push(...totalsResult.messages);
  }

  const narrationResult = evaluateNarration(attempt.narration, expected);
  if (narrationResult.status === "error") {
    hardErrors.push(narrationResult.message);
    hints.add(expected.narrationFeedback.hint);
  } else if (narrationResult.status === "warning") {
    warnings.push(narrationResult.message);
  } else {
    gotRight.push(expected.narrationFeedback.correctMessage);
  }

  const balanceResult = evaluateBalance(activeRows, attempt, expected);
  if (balanceResult.status === "error") {
    hardErrors.push(balanceResult.message);
    hints.add(`Your debit and credit totals must both be ${formatCurrency(expected.expectedAnswer.totals.debit)} and equal to each other.`);
  } else {
    gotRight.push("Debit and credit totals are balanced.");
  }

  const uniqueErrors = uniqueMessages(hardErrors);
  const uniqueWarnings = uniqueMessages(warnings);
  const status = uniqueErrors.length > 0 ? "incorrect" : uniqueWarnings.length > 0 ? "partially-correct" : "correct";

  return {
    questionId: attempt.questionId,
    status,
    summary: createSummary(status, uniqueErrors.length, uniqueWarnings.length, expected),
    gotRight: uniqueMessages(gotRight),
    errors: uniqueErrors,
    warnings: uniqueWarnings,
    rowResults,
    totalsResult,
    narrationResult,
    balanceResult,
    hints: Array.from(hints),
    retryAvailable: true,
    correctAnswerRevealAvailable: true,
  };
}

export function isAttemptCompletelyBlank(attempt: JournalEntryPracticeAttempt) {
  return (
    attempt.rows.every((row) =>
      [row.particulars, row.lf, row.debitAmount, row.creditAmount].every((value) => value.trim() === ""),
    ) &&
    attempt.totalDebit.trim() === "" &&
    attempt.totalCredit.trim() === "" &&
    attempt.narration.trim() === ""
  );
}

function getQuestionId(input: unknown) {
  if (!isRecord(input) || typeof input.questionId !== "string") {
    return "unsupported-question";
  }

  return input.questionId;
}

function validateAttemptInput(
  input: unknown,
  expected: JournalEntryPracticeAnswerKey,
):
  | { ok: true; attempt: JournalEntryPracticeAttempt }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return { ok: false, errors: ["Submitted answer shape is invalid."] };
  }

  const rows = Array.isArray(input.rows) ? input.rows : [];

  if (!Array.isArray(input.rows)) {
    errors.push("Journal rows are missing or malformed.");
  } else if (rows.length > JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows) {
    errors.push(`This preview accepts at most ${JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows} journal rows.`);
  }

  const requiredStringFields = ["totalDebit", "totalCredit", "narration"] as const;

  for (const field of requiredStringFields) {
    if (typeof input[field] !== "string") {
      errors.push(`${field} is missing or malformed.`);
    }
  }

  const safeRows: JournalEntryPracticeAttemptRow[] = [];

  rows.slice(0, JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows).forEach((row, index) => {
    if (!isRecord(row)) {
      errors.push(`Row ${index + 1} is malformed.`);
      return;
    }

    const submittedRowOrder = row.rowOrder;
    const safeRowOrder =
      typeof submittedRowOrder === "number" && Number.isInteger(submittedRowOrder)
        ? submittedRowOrder
        : index + 1;

    if (
      typeof submittedRowOrder !== "number" ||
      !Number.isInteger(submittedRowOrder) ||
      submittedRowOrder < 1 ||
      submittedRowOrder > JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows
    ) {
      errors.push(`Row ${index + 1} has an invalid row order.`);
    }

    const particulars = readLimitedString(row.particulars, JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength);
    const lf = readLimitedString(row.lf, JOURNAL_ENTRY_PRACTICE_LIMITS.maxLfLength);
    const debitAmount = readLimitedString(row.debitAmount, JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength);
    const creditAmount = readLimitedString(row.creditAmount, JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength);

    if (particulars === null) errors.push(`Row ${index + 1} particulars are missing, malformed, or too long.`);
    if (lf === null) errors.push(`Row ${index + 1} L.F. is malformed or too long.`);
    if (debitAmount === null) errors.push(`Row ${index + 1} debit amount is malformed or too long.`);
    if (creditAmount === null) errors.push(`Row ${index + 1} credit amount is malformed or too long.`);

    safeRows.push({
      rowOrder: safeRowOrder,
      particulars: particulars ?? "",
      lf: lf ?? "",
      debitAmount: debitAmount ?? "",
      creditAmount: creditAmount ?? "",
    });
  });

  const totalDebit = readLimitedString(input.totalDebit, JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength);
  const totalCredit = readLimitedString(input.totalCredit, JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength);
  const narration = readLimitedString(input.narration, JOURNAL_ENTRY_PRACTICE_LIMITS.maxNarrationLength);

  if (totalDebit === null) errors.push("Total Debit is missing, malformed, or too long.");
  if (totalCredit === null) errors.push("Total Credit is missing, malformed, or too long.");
  if (narration === null) errors.push("Narration is missing, malformed, or too long.");

  if (errors.length > 0) {
    return { ok: false, errors: uniqueMessages(errors) };
  }

  return {
    ok: true,
    attempt: {
      questionId: expected.questionId,
      rows: safeRows,
      totalDebit: totalDebit ?? "",
      totalCredit: totalCredit ?? "",
      narration: narration ?? "",
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLimitedString(value: unknown, maxLength: number) {
  if (typeof value !== "string" || value.length > maxLength) {
    return null;
  }

  return value;
}

export function parseAmount(input: string): number | null {
  if (input.trim().length > JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength) {
    return null;
  }

  const normalized = input.replace(/[₹,\s]/g, "").replace(/^rs\.?/i, "");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount > JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountValue) {
    return null;
  }

  return amount;
}

function parseAttemptRow(row: JournalEntryPracticeAttemptRow): ParsedAttemptRow {
  const particulars = row.particulars.trim();

  return {
    ...row,
    isEmpty: [row.particulars, row.lf, row.debitAmount, row.creditAmount].every((value) => value.trim() === ""),
    hasDr: /\bdr\.?\b/i.test(particulars),
    hasTo: /^\s*to\b/i.test(particulars),
    accountKey: normalizeAccountKey(particulars),
    debitValue: row.debitAmount.trim() === "" ? null : parseAmount(row.debitAmount),
    creditValue: row.creditAmount.trim() === "" ? null : parseAmount(row.creditAmount),
    debitFilled: row.debitAmount.trim() !== "",
    creditFilled: row.creditAmount.trim() !== "",
  };
}

function normalizeAccountKey(particulars: string) {
  const accountText = normalizeText(particulars)
    .replace(/^to\s+/, "")
    .replace(/\bdr\b\.?/g, "")
    .replace(/\ba\s*\/\s*c\b/g, "")
    .replace(/\bac\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (accountText === "cash") return "cash";
  if (accountText === "sales" || accountText === "sale") return "sales";
  if (accountText === "bank") return "bank";
  if (accountText === "purchases" || accountText === "purchase") return "purchases";
  if (accountText === "salary" || accountText === "salaries") return "salary";
  if (accountText === "rent") return "rent";

  return accountText;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function evaluateExpectedLineRow(
  row: ParsedAttemptRow,
  expectedLine: JournalEntryPracticeAnswerKey["expectedLines"][number],
) {
  const fieldResults: JournalEntryPracticeFieldResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const hints: string[] = [];

  if (expectedLine.side === "debit") {
    if (!row.hasDr) {
      addFieldError(fieldResults, errors, "particulars", expectedLine.missingMarkerMessage);
    }
    if (row.hasTo) {
      addFieldError(fieldResults, errors, "particulars", expectedLine.wrongMarkerMessage);
    }
    if (row.debitFilled && row.debitValue === null) {
      addFieldError(fieldResults, errors, "debitAmount", "Debit amount is not a valid number.");
    } else if (row.debitValue !== expectedLine.amount) {
      addFieldError(fieldResults, errors, "debitAmount", expectedLine.wrongAmountMessage);
    }
    if (row.creditFilled) {
      addFieldError(fieldResults, errors, "creditAmount", expectedLine.wrongColumnMessage);
    }
  } else {
    if (!row.hasTo) {
      addFieldError(fieldResults, errors, "particulars", expectedLine.missingMarkerMessage);
    }
    if (row.hasDr) {
      addFieldError(fieldResults, errors, "particulars", expectedLine.wrongMarkerMessage);
    }
    if (row.creditFilled && row.creditValue === null) {
      addFieldError(fieldResults, errors, "creditAmount", "Credit amount is not a valid number.");
    } else if (row.creditValue !== expectedLine.amount) {
      addFieldError(fieldResults, errors, "creditAmount", expectedLine.wrongAmountMessage);
    }
    if (row.debitFilled) {
      addFieldError(fieldResults, errors, "debitAmount", expectedLine.wrongColumnMessage);
    }
  }

  if (row.lf.trim() === "") {
    warnings.push(`Row ${row.rowOrder}: L.F. is blank. This is acceptable for the preview but should be filled in formal work.`);
    fieldResults.push({
      field: "lf",
      status: "warning",
      message: "L.F. is blank; fill it in formal journal work.",
    });
  }

  if (errors.length === 0) {
    fieldResults.unshift({
      field: "particulars",
      status: "correct",
      message: `${expectedLine.requiredParticularsHint} is identified correctly.`,
    });
  } else {
    hints.push(expectedLine.errorMessage);
  }

  return {
    rowResult: {
      rowOrder: row.rowOrder,
      status: rowStatus(errors, warnings),
      summary:
        errors.length > 0
          ? `Row ${row.rowOrder} needs correction.`
          : warnings.length > 0
            ? `Row ${row.rowOrder} is conceptually correct with a small presentation warning.`
            : `Row ${row.rowOrder} is correct.`,
      fieldResults,
    },
    errors,
    warnings,
    hints,
  };
}

function evaluateUnexpectedRow(row: ParsedAttemptRow, expected: JournalEntryPracticeAnswerKey) {
  const fieldResults: JournalEntryPracticeFieldResult[] = [];
  const errors: string[] = [];
  const hints: string[] = [];

  if (row.particulars.trim() === "") {
    addFieldError(fieldResults, errors, "particulars", `Row ${row.rowOrder} is partly filled. Add particulars or clear the row.`);
  } else {
    const feedback = expected.unexpectedAccountFeedback[row.accountKey];

    if (feedback) {
      addFieldError(fieldResults, errors, "particulars", feedback.errorMessage);
      hints.push(feedback.hint);
    } else {
      addFieldError(fieldResults, errors, "particulars", `Row ${row.rowOrder} is an extra non-empty line.`);
      hints.push(expected.extraLineHint);
    }
  }

  if (row.debitFilled && row.debitValue === null) {
    addFieldError(fieldResults, errors, "debitAmount", "Debit amount is not a valid number.");
  }
  if (row.creditFilled && row.creditValue === null) {
    addFieldError(fieldResults, errors, "creditAmount", "Credit amount is not a valid number.");
  }

  return {
    rowResult: {
      rowOrder: row.rowOrder,
      status: "error" as const,
      summary: `Row ${row.rowOrder} should be removed or corrected.`,
      fieldResults,
    },
    errors,
    warnings: [],
    hints,
  };
}

function evaluateTotals(
  attempt: JournalEntryPracticeAttempt,
  activeRows: ParsedAttemptRow[],
  expected: JournalEntryPracticeAnswerKey,
): JournalEntryPracticeTotalsResult {
  const enteredDebit = attempt.totalDebit.trim() === "" ? null : parseAmount(attempt.totalDebit);
  const enteredCredit = attempt.totalCredit.trim() === "" ? null : parseAmount(attempt.totalCredit);
  const rowDebitTotal = activeRows.reduce((total, row) => total + (row.debitValue ?? 0), 0);
  const rowCreditTotal = activeRows.reduce((total, row) => total + (row.creditValue ?? 0), 0);
  const messages: string[] = [];

  if (enteredDebit !== expected.expectedAnswer.totals.debit) {
    messages.push(`Total Debit should be ${formatCurrency(expected.expectedAnswer.totals.debit)}.`);
  }
  if (enteredCredit !== expected.expectedAnswer.totals.credit) {
    messages.push(`Total Credit should be ${formatCurrency(expected.expectedAnswer.totals.credit)}.`);
  }
  if (rowDebitTotal !== enteredDebit || rowCreditTotal !== enteredCredit) {
    messages.push("Entered totals should match the amounts written in the journal rows.");
  }

  return {
    status: messages.length > 0 ? "error" : "correct",
    expectedDebit: expected.expectedAnswer.totals.debit,
    expectedCredit: expected.expectedAnswer.totals.credit,
    enteredDebit,
    enteredCredit,
    rowDebitTotal,
    rowCreditTotal,
    messages: messages.length > 0 ? messages : [`Debit total and credit total are both ${formatCurrency(expected.expectedAnswer.totals.debit)}.`],
  };
}

function evaluateNarration(
  narration: string,
  expected: JournalEntryPracticeAnswerKey,
): JournalEntryPracticeNarrationResult {
  const normalized = normalizeNarration(narration);

  if (normalized === "") {
    return {
      status: "error",
      message: "Narration is required for this Practice It Yourself question.",
    };
  }

  if (expected.acceptedNarrations.includes(normalized)) {
    return {
      status: "correct",
      message: "Narration is acceptable.",
    };
  }

  const hasExpectedConcept = hasExpectedNarrationMeaning(narration, expected.acceptedNarrations);

  if (hasExpectedConcept) {
    return {
      status: "correct",
      message: "Narration is acceptable.",
    };
  }

  return {
    status: "error",
    message: expected.narrationFeedback.errorMessage,
  };
}

function normalizeNarration(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasExpectedNarrationMeaning(narration: string, acceptedNarrations: string[]) {
  const narrationTokens = normalizeNarrationConceptTokens(narration);

  return acceptedNarrations.some((acceptedNarration) => {
    const requiredTokens = normalizeNarrationConceptTokens(acceptedNarration);

    return Array.from(requiredTokens).every((token) => narrationTokens.has(token));
  });
}

function normalizeNarrationConceptTokens(value: string) {
  return new Set(
    normalizeNarration(value)
      .split(" ")
      .map((token) => narrationTokenAliases[token] ?? token)
      .filter((token) => token.length > 0 && !narrationFillerWords.has(token)),
  );
}

function evaluateBalance(
  activeRows: ParsedAttemptRow[],
  attempt: JournalEntryPracticeAttempt,
  expected: JournalEntryPracticeAnswerKey,
): JournalEntryPracticeBalanceResult {
  const enteredDebit = attempt.totalDebit.trim() === "" ? null : parseAmount(attempt.totalDebit);
  const enteredCredit = attempt.totalCredit.trim() === "" ? null : parseAmount(attempt.totalCredit);
  const rowDebitTotal = activeRows.reduce((total, row) => total + (row.debitValue ?? 0), 0);
  const rowCreditTotal = activeRows.reduce((total, row) => total + (row.creditValue ?? 0), 0);
  const expectedTotal = expected.expectedAnswer.totals.debit;

  if (rowDebitTotal !== rowCreditTotal || enteredDebit !== enteredCredit) {
    return {
      status: "error",
      message: "Your debit and credit totals must be equal.",
    };
  }

  if (rowDebitTotal !== expectedTotal || enteredDebit !== expectedTotal) {
    return {
      status: "error",
      message: `The entry balances, but it does not balance at the correct ${formatCurrency(expectedTotal)} amount.`,
    };
  }

  return {
    status: "correct",
    message: "The entry is balanced.",
  };
}

function addFieldError(
  fieldResults: JournalEntryPracticeFieldResult[],
  errors: string[],
  field: JournalEntryPracticeFieldResult["field"],
  message: string,
) {
  errors.push(message);
  fieldResults.push({ field, status: "error", message });
}

function rowStatus(errors: string[], warnings: string[]): JournalEntryPracticeFeedbackStatus {
  if (errors.length > 0) return "error";
  if (warnings.length > 0) return "warning";
  return "correct";
}

function hasCorrectLinesInReverseOrder(
  matchedAccountRows: Map<string, ParsedAttemptRow[]>,
  expected: JournalEntryPracticeAnswerKey,
) {
  const matchedRows = expected.expectedLines.map((line) => matchedAccountRows.get(line.accountKey)?.[0]);

  if (matchedRows.some((row) => !row)) {
    return false;
  }

  return matchedRows.some((row, index) => {
    const previousRow = matchedRows[index - 1];

    return Boolean(row && previousRow && previousRow.rowOrder > row.rowOrder);
  });
}

function isHardTotalMessage(message: string) {
  return (
    message.startsWith("Total Debit") ||
    message.startsWith("Total Credit") ||
    message.startsWith("Entered totals")
  );
}

function createSummary(
  status: JournalEntryPracticeCheckResult["status"],
  errorCount: number,
  warningCount: number,
  expected: JournalEntryPracticeAnswerKey,
) {
  if (status === "correct") {
    return expected.correctSummary;
  }

  if (status === "partially-correct") {
    return `Conceptually correct, with ${warningCount} presentation warning${warningCount === 1 ? "" : "s"}.`;
  }

  return `Not correct yet. Fix ${errorCount} issue${errorCount === 1 ? "" : "s"} and try again.`;
}

function createUnsupportedResult(questionId: string): JournalEntryPracticeCheckResult {
  return {
    questionId,
    status: "incorrect",
    summary: "This checker supports only the approved Journal Entries preview questions.",
    gotRight: [],
    errors: ["Unsupported Practice It Yourself question."],
    warnings: [],
    rowResults: [],
    totalsResult: unsupportedTotalsResult,
    narrationResult: {
      status: "error",
      message: "Narration was not checked because this question is unsupported.",
    },
    balanceResult: {
      status: "error",
      message: "Balance was not checked because this question is unsupported.",
    },
    hints: ["Return to one of the supported Journal Entries Practice It Yourself questions."],
    retryAvailable: false,
    correctAnswerRevealAvailable: false,
  };
}

function createBlankAttemptResult(
  questionId: string,
  expected: JournalEntryPracticeAnswerKey,
): JournalEntryPracticeCheckResult {
  return {
    questionId,
    status: "incorrect",
    summary: "Enter your journal rows, totals, and narration before checking.",
    gotRight: [],
    errors: ["The answer is blank."],
    warnings: [],
    rowResults: [],
    totalsResult: {
      status: "error",
      expectedDebit: expected.expectedAnswer.totals.debit,
      expectedCredit: expected.expectedAnswer.totals.credit,
      enteredDebit: null,
      enteredCredit: null,
      rowDebitTotal: 0,
      rowCreditTotal: 0,
      messages: ["Total Debit and Total Credit are required."],
    },
    narrationResult: {
      status: "error",
      message: "Narration is required for this Practice It Yourself question.",
    },
    balanceResult: {
      status: "error",
      message: "The blank entry is not balanced.",
    },
    hints: [expected.blankAttemptHint],
    retryAvailable: true,
    correctAnswerRevealAvailable: false,
  };
}

function createMalformedAttemptResult(
  questionId: string,
  expected: JournalEntryPracticeAnswerKey,
  errors: string[],
): JournalEntryPracticeCheckResult {
  return {
    questionId,
    status: "incorrect",
    summary: "This submitted answer could not be checked safely. Please review the fields and try again.",
    gotRight: [],
    errors,
    warnings: [],
    rowResults: [],
    totalsResult: {
      status: "error",
      expectedDebit: expected.expectedAnswer.totals.debit,
      expectedCredit: expected.expectedAnswer.totals.credit,
      enteredDebit: null,
      enteredCredit: null,
      rowDebitTotal: 0,
      rowCreditTotal: 0,
      messages: ["The submitted totals could not be checked safely."],
    },
    narrationResult: {
      status: "error",
      message: "Narration could not be checked safely.",
    },
    balanceResult: {
      status: "error",
      message: "Balance could not be checked safely.",
    },
    hints: ["Use the on-page journal-entry fields and keep the attempt within the preview limits."],
    retryAvailable: true,
    correctAnswerRevealAvailable: false,
  };
}

function uniqueMessages(messages: string[]) {
  return Array.from(new Set(messages));
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
