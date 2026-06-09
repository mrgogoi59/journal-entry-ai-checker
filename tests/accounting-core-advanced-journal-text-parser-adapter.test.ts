import { describe, expect, it } from "vitest";
import {
  buildAdvancedPracticeResult,
  checkAdvancedJournalAnswer,
  coreJournalEntriesToJournalText,
  getAllAdvancedPracticeQuestions,
  getAdvancedPracticeQuestionById,
  hasAdvancedJournalAnswerText,
  normalizeAdvancedJournalAnswerText,
  parseAdvancedJournalAnswerText,
  type AdvancedPracticeQuestion,
  type AdvancedPracticeResultViewModel,
  type JournalEntry,
} from "@/lib/accounting-core";

describe("accounting-core advanced journal text parser adapter", () => {
  it("parses Company share issue text answer and checks it as correct", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: [
        "Bank A/c Dr. 120000",
        "To Share Capital A/c 100000",
        "To Securities Premium A/c 20000",
      ].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    expect(parseResult.journalEntries).toHaveLength(1);
    expectCoreLine(parseResult.journalEntries[0], "Bank", "debit", 120000);
    expectCoreLine(parseResult.journalEntries[0], "Share Capital", "credit", 100000);
    expectCoreLine(parseResult.journalEntries[0], "Securities Premium", "credit", 20000);
    expect(parseResult.journalEntries[0].topic).toBe("company_accounts");

    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBe(100);
    expect(result.status).toBe("correct");
  });

  it("parses Partnership salary text answer and checks it as correct", () => {
    const question = getQuestion("partnership-partner-salary-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Profit and Loss Appropriation A/c Dr. 10000", "To Amit Capital A/c 10000"].join("\n"),
      topic: "partnership",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBe(100);
    expect(result.status).toBe("correct");
  });

  it("parses multiple debit lines", () => {
    const question = getQuestion("company-debenture-issue-discount-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: [
        "Bank A/c Dr. 95000",
        "Discount on Issue of Debentures A/c Dr. 5000",
        "To Debentures A/c 100000",
      ].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    expectCoreLine(parseResult.journalEntries[0], "Bank", "debit", 95000);
    expectCoreLine(parseResult.journalEntries[0], "Discount On Issue Of Debentures", "debit", 5000);
    expectCoreLine(parseResult.journalEntries[0], "Debentures", "credit", 100000);

    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBe(100);
    expect(result.status).toBe("correct");
  });

  it("parses calls in arrears compound text", () => {
    const question = getQuestion("company-calls-in-arrears-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: ["Bank A/c Dr. 27000", "Calls in Arrears A/c Dr. 3000", "To Share First Call A/c 30000"].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBe(100);
    expect(result.status).toBe("correct");
  });

  it("lets checker handle line order after parsing", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: [
        "To Securities Premium A/c 20000",
        "Bank A/c Dr. 120000",
        "To Share Capital A/c 100000",
      ].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBe(100);
    expect(result.status).toBe("correct");
  });

  it("returns empty result for empty answer text", () => {
    const parseResult = parseAdvancedJournalAnswerText({ answerText: "   ", topic: "company_accounts" });

    expect(parseResult.status).toBe("empty");
    expect(parseResult.journalEntries).toEqual([]);
    expect(parseResult.messages.some((message) => message.message === "Answer is empty.")).toBe(true);
  });

  it("returns parse_error safely for invalid text", () => {
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: "hello this is not a journal entry",
      topic: "company_accounts",
    });

    expect(parseResult.status).toBe("parse_error");
    expect(parseResult.journalEntries).toEqual([]);
    expect(parseResult.messages[0].severity).toBe("error");
  });

  it("normalizes answer text and checks non-empty answers", () => {
    const normalized = normalizeAdvancedJournalAnswerText("  Bank A/c Dr. 120000  \r\n\r\n  To Share Capital A/c 120000  ");

    expect(normalized).toBe("Bank A/c Dr. 120000\nTo Share Capital A/c 120000");
    expect(hasAdvancedJournalAnswerText(normalized)).toBe(true);
    expect(hasAdvancedJournalAnswerText("   ")).toBe(false);
  });

  it("parses wrong amount and builder gives partial feedback", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: [
        "Bank A/c Dr. 120000",
        "To Share Capital A/c 100000",
        "To Securities Premium A/c 10000",
      ].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    const result = buildCheckedResult(question, parseResult.journalEntries);
    expect(result.score.score).toBeLessThan(100);
    expect(result.feedback.some((item) => item.message.includes("Amount for Securities Premium"))).toBe(true);
  });

  it("parses wrong side and checker detects issue", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const parseResult = parseAdvancedJournalAnswerText({
      answerText: [
        "Bank A/c Dr. 120000",
        "Share Capital A/c Dr. 100000",
        "To Securities Premium A/c 20000",
      ].join("\n"),
      topic: "company_accounts",
      questionId: question.id,
    });

    expect(parseResult.status).toBe("parsed");
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: question.expectedJournalEntries,
      actualJournalEntries: parseResult.journalEntries,
    });
    const result = buildAdvancedPracticeResult({ question, checkResult });

    expect(checkResult.isCorrect).toBe(false);
    expect(checkResult.missingLines.length).toBeGreaterThan(0);
    expect(checkResult.extraLines.length).toBeGreaterThan(0);
    expect(result.status).not.toBe("correct");
  });

  it("round-trips serialized expected text for all hidden advanced questions", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      const answerText = coreJournalEntriesToJournalText(question.expectedJournalEntries);
      const parseResult = parseAdvancedJournalAnswerText({
        answerText,
        topic: question.topic,
        questionId: question.id,
      });
      const result = buildCheckedResult(question, parseResult.journalEntries);

      expect(parseResult.status, question.id).toBe("parsed");
      expect(result.score.score, question.id).toBe(100);
      expect(result.status, question.id).toBe("correct");
    }
  });
});

function getQuestion(id: string): AdvancedPracticeQuestion {
  const question = getAdvancedPracticeQuestionById(id);
  expect(question).toBeDefined();
  return question as AdvancedPracticeQuestion;
}

function buildCheckedResult(question: AdvancedPracticeQuestion, actualJournalEntries: JournalEntry[]): AdvancedPracticeResultViewModel {
  const checkResult = checkAdvancedJournalAnswer({
    expectedJournalEntries: question.expectedJournalEntries,
    actualJournalEntries,
  });

  return buildAdvancedPracticeResult({ question, checkResult });
}

function expectCoreLine(entry: JournalEntry, accountName: string, side: "debit" | "credit", amount: number): void {
  expect(entry.lines).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        side,
        amount,
        account: expect.objectContaining({ name: accountName }),
      }),
    ]),
  );
}
