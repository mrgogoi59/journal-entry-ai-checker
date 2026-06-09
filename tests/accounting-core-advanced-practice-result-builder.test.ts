import { describe, expect, it } from "vitest";
import {
  buildAdvancedPracticeResult,
  buildAdvancedPracticeScoreDisplay,
  checkAdvancedJournalAnswer,
  getAllAdvancedPracticeQuestions,
  getAdvancedPracticeQuestionById,
  type AdvancedJournalAnswerCheckResult,
  type AdvancedPracticeQuestion,
  type JournalEntry,
  type JournalLine,
} from "@/lib/accounting-core";

describe("accounting-core advanced practice result builder", () => {
  it("builds correct result for Company share issue", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const result = buildResultFor(question, cloneEntries(question.expectedJournalEntries));

    expect(result.status).toBe("correct");
    expect(result.score.score).toBe(100);
    expect(result.score.tone).toBe("success");
    expect(result.summary).toContain("Great work");
    expect(result.correctEntry.journalText).toContain("Bank A/c");
    expect(result.correctEntry.journalText).toContain("Share Capital A/c");
    expect(result.correctEntry.journalText).toContain("Securities Premium A/c");
    expect(result.actions.map((action) => action.kind)).toContain("retry");
    expect(result.actions.map((action) => action.kind)).toContain("next");
    expect(result.actions.find((action) => action.kind === "review_lesson")?.target).toBe("/learn/accounting-for-share-capital");
  });

  it("builds correct result for Partnership salary", () => {
    const question = getQuestion("partnership-partner-salary-practice");
    const result = buildResultFor(question, cloneEntries(question.expectedJournalEntries));

    expect(result.status).toBe("correct");
    expect(result.score.score).toBe(100);
    expect(result.actions.find((action) => action.kind === "review_lesson")?.target).toBe(
      "/learn/partnership-accounts-basic-concepts",
    );
    expect(result.correctEntry.journalText).toContain("Profit and Loss Appropriation A/c");
    expect(result.correctEntry.journalText).toContain("Amit Capital A/c");
  });

  it("builds partial feedback when a line is missing", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = removeLine(question.expectedJournalEntries, "Securities Premium A/c", "credit");
    const result = buildResultFor(question, actualJournalEntries);

    expect(result.status).toBe("partially_correct");
    expect(result.score.score).toBeGreaterThan(0);
    expect(result.score.score).toBeLessThan(100);
    expect(result.feedback.some((item) => item.message.includes("Securities Premium A/c"))).toBe(true);
    expect(result.correctEntry.journalText).toContain("Securities Premium A/c");
  });

  it("builds beginner-friendly wrong amount feedback", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = updateLineAmount(question.expectedJournalEntries, "Securities Premium A/c", "credit", 10000);
    const result = buildResultFor(question, actualJournalEntries);

    expect(result.score.score).toBeLessThan(100);
    expect(result.feedback.some((item) => item.message.includes("Amount for Securities Premium A/c should be Rs.20,000"))).toBe(true);
    expect(result.correctEntry.journalText).toContain("Securities Premium A/c");
  });

  it("includes feedback for unbalanced answers", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = updateLineAmount(question.expectedJournalEntries, "Bank A/c", "debit", 119000);
    const result = buildResultFor(question, actualJournalEntries);

    expect(result.metadata.actualIsBalanced).toBe(false);
    expect(result.feedback.some((item) => item.message.includes("total debit and total credit are not equal"))).toBe(true);
  });

  it("builds an empty result for empty answer", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const result = buildResultFor(question, []);

    expect(result.status).toBe("empty");
    expect(result.score.score).toBe(0);
    expect(result.summary).toBe("Write a journal entry before checking your answer.");
    expect(result.correctEntry.journalText).toContain("Bank A/c");
  });

  it("includes feedback for extra lines", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = cloneEntries(question.expectedJournalEntries);
    actualJournalEntries[0].lines.push(createLine("Discount A/c", "debit", 100));

    const result = buildResultFor(question, actualJournalEntries);

    expect(result.metadata.extraLineCount).toBeGreaterThan(0);
    expect(result.feedback.some((item) => item.message.includes("Extra debit line found: Discount A/c"))).toBe(true);
    expect(result.status).not.toBe("correct");
  });

  it("builds deterministic score labels and tones at boundaries", () => {
    expect(buildAdvancedPracticeScoreDisplay(createSyntheticCheckResult(100))).toMatchObject({
      label: "Excellent",
      tone: "success",
    });
    expect(buildAdvancedPracticeScoreDisplay(createSyntheticCheckResult(80))).toMatchObject({
      label: "Good attempt",
      tone: "warning",
    });
    expect(buildAdvancedPracticeScoreDisplay(createSyntheticCheckResult(50))).toMatchObject({
      label: "Partly correct",
      tone: "error",
    });
    expect(buildAdvancedPracticeScoreDisplay(createSyntheticCheckResult(20))).toMatchObject({
      label: "Needs revision",
      tone: "error",
    });
    expect(buildAdvancedPracticeScoreDisplay(createSyntheticCheckResult(0))).toMatchObject({
      label: "Try again",
      tone: "error",
    });
  });

  it("builds correct result for all hidden advanced questions with expected answers", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      const result = buildResultFor(question, cloneEntries(question.expectedJournalEntries));

      expect(result.status, question.id).toBe("correct");
      expect(result.score.score, question.id).toBe(100);
      expect(result.correctEntry.journalText.length, question.id).toBeGreaterThan(0);
      expect(result.actions.map((action) => action.kind), question.id).toContain("retry");
      expect(result.actions.map((action) => action.kind), question.id).toContain("next");
    }
  });

  it("does not include executable UI or runtime fields", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const result = buildResultFor(question, cloneEntries(question.expectedJournalEntries));
    const keys = collectObjectKeys(result);

    expect(keys).not.toContain("component");
    expect(keys).not.toContain("render");
    expect(keys).not.toContain("handler");
    expect(keys).not.toContain("execute");
    expect(keys).not.toContain("apiPath");
    expect(keys).not.toContain("enginePath");
  });
});

function buildResultFor(question: AdvancedPracticeQuestion, actualJournalEntries: JournalEntry[]) {
  const checkResult = checkAdvancedJournalAnswer({
    expectedJournalEntries: question.expectedJournalEntries,
    actualJournalEntries,
  });

  return buildAdvancedPracticeResult({ question, checkResult });
}

function getQuestion(id: string): AdvancedPracticeQuestion {
  const question = getAdvancedPracticeQuestionById(id);
  expect(question).toBeDefined();
  return question as AdvancedPracticeQuestion;
}

function cloneEntries(entries: JournalEntry[]): JournalEntry[] {
  return entries.map((entry) => ({
    ...entry,
    lines: entry.lines.map((line) => ({
      ...line,
      account: { ...line.account },
    })),
  }));
}

function removeLine(entries: JournalEntry[], accountName: string, side: JournalLine["side"]): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.filter((line) => !(line.account.name === accountName && line.side === side));
  return clonedEntries;
}

function updateLineAmount(entries: JournalEntry[], accountName: string, side: JournalLine["side"], amount: number): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.map((line) =>
    line.account.name === accountName && line.side === side ? { ...line, amount } : line,
  );
  return clonedEntries;
}

function createLine(accountName: string, side: JournalLine["side"], amount: number): JournalLine {
  return {
    account: {
      name: accountName,
    },
    side,
    amount,
  };
}

function createSyntheticCheckResult(score: number): AdvancedJournalAnswerCheckResult {
  return {
    isCorrect: score === 100,
    score,
    maxScore: 100,
    scoreBreakdown: {
      debitAccounts: 0,
      creditAccounts: 0,
      amounts: 0,
      balance: 0,
      structure: 0,
      total: score,
    },
    messages: [],
    lineComparisons: [],
    missingLines: [],
    extraLines: [],
    expectedDebitTotal: 100,
    expectedCreditTotal: 100,
    actualDebitTotal: score === 0 ? 0 : 100,
    actualCreditTotal: score === 0 ? 0 : 100,
    actualIsBalanced: score > 0,
    summary: "Synthetic result.",
  };
}

function collectObjectKeys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];

  if (Array.isArray(value)) {
    return value.flatMap(collectObjectKeys);
  }

  const record = value as Record<string, unknown>;
  return Object.keys(record).flatMap((key) => [key, ...collectObjectKeys(record[key])]);
}
