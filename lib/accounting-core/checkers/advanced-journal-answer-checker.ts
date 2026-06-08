import type { AccountingSide, CheckMessage, CheckSeverity, JournalEntry, JournalLine } from "../types";

export type AdvancedJournalCheckScoreBreakdown = {
  debitAccounts: number;
  creditAccounts: number;
  amounts: number;
  balance: number;
  structure: number;
  total: number;
};

export type AdvancedJournalLineComparison = {
  side: "debit" | "credit";
  accountName: string;
  expectedAmount: number;
  actualAmount?: number;
  status: "matched" | "missing" | "wrong_amount" | "extra";
  message: string;
};

export type AdvancedJournalAnswerCheckInput = {
  expectedJournalEntries: JournalEntry[];
  actualJournalEntries: JournalEntry[];
  amountTolerance?: number;
};

export type AdvancedJournalAnswerCheckResult = {
  isCorrect: boolean;
  score: number;
  maxScore: 100;
  scoreBreakdown: AdvancedJournalCheckScoreBreakdown;
  messages: CheckMessage[];
  lineComparisons: AdvancedJournalLineComparison[];
  missingLines: AdvancedJournalLineComparison[];
  extraLines: AdvancedJournalLineComparison[];
  expectedDebitTotal: number;
  expectedCreditTotal: number;
  actualDebitTotal: number;
  actualCreditTotal: number;
  actualIsBalanced: boolean;
  summary: string;
};

type AggregatedAdvancedJournalLine = {
  side: "debit" | "credit";
  accountName: string;
  normalizedAccountName: string;
  amount: number;
};

type AdvancedJournalAnswerCheckResultDraft = Omit<
  AdvancedJournalAnswerCheckResult,
  "isCorrect" | "score" | "missingLines" | "extraLines"
> &
  Partial<Pick<AdvancedJournalAnswerCheckResult, "isCorrect">>;

const emptyScoreBreakdown: AdvancedJournalCheckScoreBreakdown = {
  debitAccounts: 0,
  creditAccounts: 0,
  amounts: 0,
  balance: 0,
  structure: 0,
  total: 0,
};

export function checkAdvancedJournalAnswer(input: AdvancedJournalAnswerCheckInput): AdvancedJournalAnswerCheckResult {
  const amountTolerance = input.amountTolerance ?? 0;
  const expectedTotals = getAdvancedJournalTotals(input.expectedJournalEntries);
  const actualTotals = getAdvancedJournalTotals(input.actualJournalEntries);
  const actualIsBalanced = isAdvancedJournalBalanced(input.actualJournalEntries, amountTolerance);
  const baseResult = {
    maxScore: 100 as const,
    expectedDebitTotal: expectedTotals.debitTotal,
    expectedCreditTotal: expectedTotals.creditTotal,
    actualDebitTotal: actualTotals.debitTotal,
    actualCreditTotal: actualTotals.creditTotal,
    actualIsBalanced,
  };

  if (input.expectedJournalEntries.length === 0) {
    return createResult({
      ...baseResult,
      scoreBreakdown: emptyScoreBreakdown,
      messages: [createCheckMessage("error", "Expected journal entry is missing.", "expected_missing")],
      lineComparisons: [],
      summary: "Expected journal entry is missing.",
    });
  }

  if (input.actualJournalEntries.length === 0) {
    return createResult({
      ...baseResult,
      scoreBreakdown: emptyScoreBreakdown,
      messages: [createCheckMessage("error", "Student answer is empty.", "actual_missing")],
      lineComparisons: [],
      summary: "Student answer is empty.",
    });
  }

  const expectedValidationMessages = validateExpectedEntries(input.expectedJournalEntries);
  if (expectedValidationMessages.length > 0) {
    return createResult({
      ...baseResult,
      scoreBreakdown: emptyScoreBreakdown,
      messages: expectedValidationMessages,
      lineComparisons: [],
      summary: "Expected journal entry has an invalid structure.",
    });
  }

  const expectedLines = aggregateAdvancedJournalLines(input.expectedJournalEntries);
  const actualLines = aggregateAdvancedJournalLines(input.actualJournalEntries);
  const actualLineMap = new Map(actualLines.map((line) => [getAdvancedJournalLineKey(line.side, line.accountName), line]));
  const expectedLineKeys = new Set(expectedLines.map((line) => getAdvancedJournalLineKey(line.side, line.accountName)));
  const messages: CheckMessage[] = [...validateActualEntries(input.actualJournalEntries)];
  const lineComparisons: AdvancedJournalLineComparison[] = [];

  for (const expectedLine of expectedLines) {
    const key = getAdvancedJournalLineKey(expectedLine.side, expectedLine.accountName);
    const actualLine = actualLineMap.get(key);

    if (!actualLine) {
      const oppositeSide = expectedLine.side === "debit" ? "credit" : "debit";
      const oppositeKey = getAdvancedJournalLineKey(oppositeSide, expectedLine.accountName);
      const isWrongSide = actualLineMap.has(oppositeKey);
      const message = isWrongSide
        ? `${expectedLine.accountName} appears on the wrong side.`
        : `${capitalizeSide(expectedLine.side)} side is missing ${expectedLine.accountName}.`;

      lineComparisons.push({
        side: expectedLine.side,
        accountName: expectedLine.accountName,
        expectedAmount: expectedLine.amount,
        status: "missing",
        message,
      });
      messages.push(createCheckMessage("error", message, isWrongSide ? "wrong_side" : "missing_line"));
      continue;
    }

    if (!amountsEqual(expectedLine.amount, actualLine.amount, amountTolerance)) {
      const message = `Amount for ${expectedLine.accountName} should be Rs.${formatAmount(expectedLine.amount)}.`;
      lineComparisons.push({
        side: expectedLine.side,
        accountName: expectedLine.accountName,
        expectedAmount: expectedLine.amount,
        actualAmount: actualLine.amount,
        status: "wrong_amount",
        message,
      });
      messages.push(createCheckMessage("warning", message, "wrong_amount"));
      continue;
    }

    lineComparisons.push({
      side: expectedLine.side,
      accountName: expectedLine.accountName,
      expectedAmount: expectedLine.amount,
      actualAmount: actualLine.amount,
      status: "matched",
      message: `${expectedLine.accountName} matches on ${expectedLine.side} side.`,
    });
  }

  for (const actualLine of actualLines) {
    const key = getAdvancedJournalLineKey(actualLine.side, actualLine.accountName);
    if (expectedLineKeys.has(key)) continue;

    const message = `Extra line found: ${actualLine.accountName} on ${actualLine.side} side.`;
    lineComparisons.push({
      side: actualLine.side,
      accountName: actualLine.accountName,
      expectedAmount: 0,
      actualAmount: actualLine.amount,
      status: "extra",
      message,
    });
    messages.push(createCheckMessage("warning", message, "extra_line"));
  }

  if (!actualIsBalanced) {
    messages.push(createCheckMessage("error", "Your total debit and total credit are not equal.", "unbalanced"));
  }

  const missingLines = lineComparisons.filter((comparison) => comparison.status === "missing");
  const extraLines = lineComparisons.filter((comparison) => comparison.status === "extra");
  const wrongAmountLines = lineComparisons.filter((comparison) => comparison.status === "wrong_amount");
  const scoreBreakdown = calculateScoreBreakdown(expectedLines, actualLineMap, actualLines, actualIsBalanced, amountTolerance, extraLines);
  const isCorrect =
    scoreBreakdown.total === 100 &&
    actualIsBalanced &&
    missingLines.length === 0 &&
    extraLines.length === 0 &&
    wrongAmountLines.length === 0;

  if (isCorrect) {
    messages.unshift(
      createCheckMessage(
        "info",
        "Great work. Your debit accounts, credit accounts, and amounts match the expected journal entry.",
        "correct",
      ),
    );
  }

  return createResult({
    ...baseResult,
    isCorrect,
    scoreBreakdown,
    messages,
    lineComparisons,
    summary: isCorrect
      ? "Correct answer."
      : "Review the debit accounts, credit accounts, amounts, and debit-credit totals.",
  });
}

export function normalizeAdvancedAccountName(accountName: string): string {
  return accountName
    .trim()
    .toLowerCase()
    .replace(/[.,:;]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/\ba\s*\/\s*c\b/g, "account")
    .replace(/\bacct\b/g, "account")
    .replace(/\s+account$/g, "")
    .trim();
}

export function getAdvancedJournalTotals(entries: JournalEntry[]): { debitTotal: number; creditTotal: number } {
  const lines = flattenAdvancedJournalLines(entries);

  return {
    debitTotal: lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0),
    creditTotal: lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0),
  };
}

export function isAdvancedJournalBalanced(entries: JournalEntry[], amountTolerance = 0): boolean {
  const { debitTotal, creditTotal } = getAdvancedJournalTotals(entries);
  return Math.abs(debitTotal - creditTotal) <= amountTolerance && debitTotal > 0 && creditTotal > 0;
}

export function flattenAdvancedJournalLines(entries: JournalEntry[]): JournalLine[] {
  return entries.flatMap((entry) => entry.lines);
}

export function aggregateAdvancedJournalLines(entries: JournalEntry[]): AggregatedAdvancedJournalLine[] {
  const lineMap = new Map<string, AggregatedAdvancedJournalLine>();

  for (const line of flattenAdvancedJournalLines(entries)) {
    const normalizedAccountName = normalizeAdvancedAccountName(line.account.name);
    const key = `${line.side}:${normalizedAccountName}`;
    const existingLine = lineMap.get(key);

    if (existingLine) {
      existingLine.amount += line.amount;
      continue;
    }

    lineMap.set(key, {
      side: line.side,
      accountName: line.account.name,
      normalizedAccountName,
      amount: line.amount,
    });
  }

  return Array.from(lineMap.values());
}

export function getAdvancedJournalLineKey(side: AccountingSide, accountName: string): string {
  return `${side}:${normalizeAdvancedAccountName(accountName)}`;
}

export function createCheckMessage(severity: CheckSeverity, message: string, code?: string): CheckMessage {
  return {
    severity,
    message,
    ...(code ? { code } : {}),
  };
}

function calculateScoreBreakdown(
  expectedLines: AggregatedAdvancedJournalLine[],
  actualLineMap: Map<string, AggregatedAdvancedJournalLine>,
  actualLines: AggregatedAdvancedJournalLine[],
  actualIsBalanced: boolean,
  amountTolerance: number,
  extraLines: AdvancedJournalLineComparison[],
): AdvancedJournalCheckScoreBreakdown {
  const expectedDebitLines = expectedLines.filter((line) => line.side === "debit");
  const expectedCreditLines = expectedLines.filter((line) => line.side === "credit");
  const matchedDebitLines = expectedDebitLines.filter((line) => actualLineMap.has(getAdvancedJournalLineKey(line.side, line.accountName)));
  const matchedCreditLines = expectedCreditLines.filter((line) => actualLineMap.has(getAdvancedJournalLineKey(line.side, line.accountName)));
  const amountMatches = expectedLines.filter((line) => {
    const actualLine = actualLineMap.get(getAdvancedJournalLineKey(line.side, line.accountName));
    return actualLine ? amountsEqual(line.amount, actualLine.amount, amountTolerance) : false;
  });
  const hasActualDebit = actualLines.some((line) => line.side === "debit");
  const hasActualCredit = actualLines.some((line) => line.side === "credit");

  const debitAccounts = proportionalScore(matchedDebitLines.length, expectedDebitLines.length, 30);
  const creditAccounts = proportionalScore(matchedCreditLines.length, expectedCreditLines.length, 30);
  const amounts = proportionalScore(amountMatches.length, expectedLines.length, 25);
  const balance = actualIsBalanced ? 10 : 0;
  const structure = hasActualDebit && hasActualCredit ? (extraLines.length === 0 ? 5 : 2) : 0;
  const total = Math.round(debitAccounts + creditAccounts + amounts + balance + structure);

  return {
    debitAccounts,
    creditAccounts,
    amounts,
    balance,
    structure,
    total,
  };
}

function createResult(result: AdvancedJournalAnswerCheckResultDraft): AdvancedJournalAnswerCheckResult {
  const missingLines = result.lineComparisons.filter((comparison) => comparison.status === "missing");
  const extraLines = result.lineComparisons.filter((comparison) => comparison.status === "extra");

  return {
    ...result,
    isCorrect: result.isCorrect ?? false,
    score: result.scoreBreakdown.total,
    missingLines,
    extraLines,
  };
}

function validateExpectedEntries(entries: JournalEntry[]): CheckMessage[] {
  const lines = flattenAdvancedJournalLines(entries);
  const hasDebit = lines.some((line) => line.side === "debit");
  const hasCredit = lines.some((line) => line.side === "credit");
  const hasInvalidAmount = lines.some((line) => !Number.isFinite(line.amount) || line.amount <= 0);
  const messages: CheckMessage[] = [];

  if (!hasDebit || !hasCredit) {
    messages.push(createCheckMessage("error", "Expected journal entry has an invalid structure.", "invalid_expected_structure"));
  }

  if (hasInvalidAmount) {
    messages.push(createCheckMessage("error", "Expected journal entry contains an invalid amount.", "invalid_expected_amount"));
  }

  return messages;
}

function validateActualEntries(entries: JournalEntry[]): CheckMessage[] {
  const lines = flattenAdvancedJournalLines(entries);

  return lines
    .filter((line) => !Number.isFinite(line.amount) || line.amount <= 0)
    .map((line) =>
      createCheckMessage(
        "warning",
        `Amount for ${line.account.name} should be greater than zero.`,
        "invalid_actual_amount",
      ),
    );
}

function proportionalScore(matchedCount: number, expectedCount: number, maxScore: number): number {
  if (expectedCount === 0) return 0;
  return Math.round((matchedCount / expectedCount) * maxScore);
}

function amountsEqual(expectedAmount: number, actualAmount: number, amountTolerance: number): boolean {
  return Math.abs(expectedAmount - actualAmount) <= amountTolerance;
}

function capitalizeSide(side: AccountingSide): string {
  return side === "debit" ? "Debit" : "Credit";
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(amount);
}
