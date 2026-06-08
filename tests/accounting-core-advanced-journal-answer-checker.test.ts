import { describe, expect, it } from "vitest";
import {
  checkAdvancedJournalAnswer,
  getAllAdvancedPracticeQuestions,
  getAdvancedPracticeQuestionById,
  type AdvancedPracticeQuestion,
  type JournalEntry,
  type JournalLine,
} from "@/lib/accounting-core";

describe("accounting-core advanced journal answer checker", () => {
  it("scores exact Company share issue answer as 100", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: cloneEntries(question.expectedJournalEntries),
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
    expect(result.scoreBreakdown).toEqual({
      debitAccounts: 30,
      creditAccounts: 30,
      amounts: 25,
      balance: 10,
      structure: 5,
      total: 100,
    });
  });

  it("scores exact Partnership salary answer as 100", () => {
    const question = getQuestion("partnership-partner-salary-practice");
    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: cloneEntries(question.expectedJournalEntries),
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("ignores line order", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = cloneEntries(question.expectedJournalEntries);
    actualJournalEntries[0].lines = [...actualJournalEntries[0].lines].reverse();

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("gives partial score for a wrong debit account", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = replaceLineAccount(
      question.expectedJournalEntries,
      "Bank A/c",
      "debit",
      createLine("Cash A/c", "debit", 120000),
    );

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.scoreBreakdown.creditAccounts).toBe(30);
    expect(result.scoreBreakdown.debitAccounts).toBeLessThan(30);
    expect(result.messages.some((message) => message.message.includes("Debit side is missing Bank A/c"))).toBe(true);
  });

  it("gives partial score for a wrong credit account", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = replaceLineAccount(
      question.expectedJournalEntries,
      "Securities Premium A/c",
      "credit",
      createLine("Discount A/c", "credit", 20000),
    );

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.scoreBreakdown.debitAccounts).toBe(30);
    expect(result.scoreBreakdown.creditAccounts).toBeLessThan(30);
    expect(result.messages.some((message) => message.message.includes("Credit side is missing Securities Premium A/c"))).toBe(true);
  });

  it("keeps account score but loses amount score for a wrong amount", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = updateLineAmount(question.expectedJournalEntries, "Securities Premium A/c", "credit", 10000);

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.scoreBreakdown.debitAccounts).toBe(30);
    expect(result.scoreBreakdown.creditAccounts).toBe(30);
    expect(result.scoreBreakdown.amounts).toBeLessThan(25);
    expect(result.messages.some((message) => message.message.includes("Amount for Securities Premium A/c should be Rs.20,000"))).toBe(true);
  });

  it("loses balance score for an unbalanced actual answer", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = updateLineAmount(question.expectedJournalEntries, "Bank A/c", "debit", 119000);

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.scoreBreakdown.balance).toBe(0);
    expect(result.messages.some((message) => message.message.includes("total debit and total credit are not equal"))).toBe(true);
  });

  it("detects an extra line", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = cloneEntries(question.expectedJournalEntries);
    actualJournalEntries[0].lines.push(createLine("Discount A/c", "debit", 100));

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.extraLines.length).toBeGreaterThan(0);
    expect(result.scoreBreakdown.structure).toBe(2);
    expect(result.messages.some((message) => message.message.includes("Extra line found: Discount A/c on debit side"))).toBe(true);
  });

  it("detects a missing line", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = removeLine(question.expectedJournalEntries, "Securities Premium A/c", "credit");

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.missingLines.length).toBeGreaterThan(0);
    expect(result.missingLines.some((line) => line.accountName === "Securities Premium A/c")).toBe(true);
  });

  it("detects a wrong side", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = moveLineToSide(question.expectedJournalEntries, "Share Capital A/c", "credit", "debit");

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.missingLines.some((line) => line.accountName === "Share Capital A/c" && line.side === "credit")).toBe(true);
    expect(result.extraLines.some((line) => line.accountName === "Share Capital A/c" && line.side === "debit")).toBe(true);
    expect(result.messages.some((message) => message.message.includes("Share Capital A/c appears on the wrong side"))).toBe(true);
  });

  it("scores multiple debit lines for debenture issue at discount as 100", () => {
    const question = getQuestion("company-debenture-issue-discount-practice");
    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: cloneEntries(question.expectedJournalEntries),
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("scores Partnership compound interest on capital entry as 100", () => {
    const question = getQuestion("partnership-interest-on-capital-practice");
    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: cloneEntries(question.expectedJournalEntries),
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("normalizes safe account-name variants", () => {
    const expectedJournalEntries = [
      createEntry([
        createLine("Bank A/c", "debit", 120000),
        createLine("Share Capital A/c", "credit", 120000),
      ]),
    ];
    const actualJournalEntries = [
      createEntry([
        createLine("bank account", "debit", 120000),
        createLine("share capital", "credit", 120000),
      ]),
    ];

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("returns score 0 for an empty actual answer", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: [],
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
    expect(result.messages.some((message) => message.message === "Student answer is empty.")).toBe(true);
  });

  it("does not crash for an invalid actual amount", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const actualJournalEntries = updateLineAmount(question.expectedJournalEntries, "Bank A/c", "debit", 0);

    const result = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries,
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.messages.some((message) => message.code === "invalid_actual_amount")).toBe(true);
  });

  it("scores every hidden advanced practice question as 100 against its expected answer", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      const result = checkAdvancedJournalAnswer({
        expectedJournalEntries: question.expectedJournalEntries,
        actualJournalEntries: cloneEntries(question.expectedJournalEntries),
      });

      expect(result.isCorrect, question.id).toBe(true);
      expect(result.score, question.id).toBe(100);
    }
  });
});

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

function replaceLineAccount(
  entries: JournalEntry[],
  accountName: string,
  side: JournalLine["side"],
  replacementLine: JournalLine,
): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.map((line) =>
    line.account.name === accountName && line.side === side ? replacementLine : line,
  );
  return clonedEntries;
}

function updateLineAmount(entries: JournalEntry[], accountName: string, side: JournalLine["side"], amount: number): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.map((line) =>
    line.account.name === accountName && line.side === side ? { ...line, amount } : line,
  );
  return clonedEntries;
}

function removeLine(entries: JournalEntry[], accountName: string, side: JournalLine["side"]): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.filter((line) => !(line.account.name === accountName && line.side === side));
  return clonedEntries;
}

function moveLineToSide(
  entries: JournalEntry[],
  accountName: string,
  fromSide: JournalLine["side"],
  toSide: JournalLine["side"],
): JournalEntry[] {
  const clonedEntries = cloneEntries(entries);
  clonedEntries[0].lines = clonedEntries[0].lines.map((line) =>
    line.account.name === accountName && line.side === fromSide ? { ...line, side: toSide } : line,
  );
  return clonedEntries;
}

function createEntry(lines: JournalLine[]): JournalEntry {
  return {
    id: "test-entry",
    topic: "company_accounts",
    lines,
  };
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
