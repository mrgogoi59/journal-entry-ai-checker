import { describe, expect, it } from "vitest";
import {
  buildAdvancedPracticeResult,
  checkAdvancedJournalAnswer,
  coreJournalEntriesToJournalText,
  getAdvancedPracticeQuestionById,
  getAllAdvancedPracticeQuestions,
  getNextAdvancedPracticeQuestion,
  parseAdvancedJournalAnswerText,
  type AdvancedJournalAnswerCheckResult,
  type AdvancedJournalTextParseResult,
  type AdvancedPracticeQuestion,
  type AdvancedPracticeResultAction,
  type AdvancedPracticeResultViewModel,
} from "@/lib/accounting-core";

type HiddenAdvancedFlowResult = {
  parseResult: AdvancedJournalTextParseResult;
  checkResult: AdvancedJournalAnswerCheckResult;
  result: AdvancedPracticeResultViewModel;
};

describe("advanced practice UI readiness hidden flow", () => {
  it("completes the full UI-ready flow with correct answers for all hidden questions", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      const answerText = coreJournalEntriesToJournalText(question.expectedJournalEntries);
      const flow = runFullHiddenAdvancedFlow(question, answerText);

      expect(flow.parseResult.status, question.id).toBe("parsed");
      expect(flow.checkResult.score, question.id).toBe(100);
      expect(flow.checkResult.isCorrect, question.id).toBe(true);
      expect(flow.result.status, question.id).toBe("correct");
      expect(flow.result.score.score, question.id).toBe(100);
      expect(flow.result.summary.length, question.id).toBeGreaterThan(0);
      expect(flow.result.correctEntry.journalText.length, question.id).toBeGreaterThan(0);
      expect(flow.result.feedback.length, question.id).toBeGreaterThan(0);
      expect(findAction(flow.result, "retry"), question.id).toBeDefined();
      expect(findAction(flow.result, "next"), question.id).toBeDefined();
      expect(findAction(flow.result, "review_lesson"), question.id).toBeDefined();
      expect(flow.result.metadata.source, question.id).toBe("advanced-practice-result-builder-v1");
    }
  });

  it("sets Company question review lesson action target", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const flow = runFullHiddenAdvancedFlow(question, coreJournalEntriesToJournalText(question.expectedJournalEntries));

    expect(flow.result.topic).toBe("company_accounts");
    expect(findAction(flow.result, "review_lesson")?.target).toBe("/learn/accounting-for-share-capital");
  });

  it("sets Partnership question review lesson action target", () => {
    const question = getQuestion("partnership-partner-salary-practice");
    const flow = runFullHiddenAdvancedFlow(question, coreJournalEntriesToJournalText(question.expectedJournalEntries));

    expect(flow.result.topic).toBe("partnership");
    expect(findAction(flow.result, "review_lesson")?.target).toBe("/learn/partnership-accounts-basic-concepts");
  });

  it("produces UI-ready result for a wrong answer", () => {
    const question = getQuestion("company-share-issue-premium-practice");
    const flow = runFullHiddenAdvancedFlow(
      question,
      ["Bank A/c Dr. 120000", "To Share Capital A/c 120000"].join("\n"),
    );

    expect(flow.parseResult.status).toBe("parsed");
    expect(flow.checkResult.score).toBeLessThan(100);
    expect(flow.result.status).not.toBe("correct");
    expect(flow.result.feedback.some((item) => item.message.includes("Securities Premium"))).toBe(true);
    expect(flow.result.correctEntry.journalText).toContain("Securities Premium A/c");
    expect(findAction(flow.result, "retry")).toBeDefined();
    expect(findAction(flow.result, "next")).toBeDefined();
  });

  it("produces UI-ready empty result for an empty answer", () => {
    const question = getQuestion("partnership-partner-salary-practice");
    const flow = runFullHiddenAdvancedFlow(question, "");

    expect(flow.parseResult.status).toBe("empty");
    expect(flow.checkResult.score).toBe(0);
    expect(flow.result.status).toBe("empty");
    expect(flow.result.summary).toContain("Write a journal entry");
    expect(flow.result.correctEntry.journalText).toContain("Profit and Loss Appropriation A/c");
    expect(findAction(flow.result, "retry")).toBeDefined();
  });

  it("handles invalid text safely and still builds a recoverable result", () => {
    const question = getQuestion("company-debenture-issue-discount-practice");
    const flow = runFullHiddenAdvancedFlow(question, "hello this is not a journal entry");

    expect(["parse_error", "empty"]).toContain(flow.parseResult.status);
    expect(flow.parseResult.messages.length).toBeGreaterThan(0);
    expect(flow.checkResult.score).toBe(0);
    expect(["empty", "incorrect"]).toContain(flow.result.status);
    expect(flow.result.correctEntry.journalText).toContain("Debentures A/c");
  });

  it("supports deterministic next-question behavior for the future Next button", () => {
    const allQuestions = getAllAdvancedPracticeQuestions();
    const companyQuestions = allQuestions.filter((question) => question.topic === "company_accounts");
    const partnershipQuestions = allQuestions.filter((question) => question.topic === "partnership");

    expect(getNextAdvancedPracticeQuestion()?.id).toBe(allQuestions[0].id);
    expect(getNextAdvancedPracticeQuestion(allQuestions[0].id)?.id).toBe(allQuestions[1].id);
    expect(getNextAdvancedPracticeQuestion(allQuestions.at(-1)?.id)?.id).toBe(allQuestions[0].id);
    expect(getNextAdvancedPracticeQuestion(companyQuestions[0].id, { topic: "company_accounts" })?.topic).toBe("company_accounts");
    expect(getNextAdvancedPracticeQuestion(companyQuestions.at(-1)?.id, { topic: "company_accounts" })?.id).toBe(
      companyQuestions[0].id,
    );
    expect(getNextAdvancedPracticeQuestion(partnershipQuestions[0].id, { topic: "partnership" })?.topic).toBe("partnership");
    expect(getNextAdvancedPracticeQuestion(partnershipQuestions.at(-1)?.id, { topic: "partnership" })?.id).toBe(
      partnershipQuestions[0].id,
    );
  });

  it("returns serializable result models for future client UI", () => {
    const correctQuestion = getQuestion("company-share-issue-premium-practice");
    const correctResult = runFullHiddenAdvancedFlow(
      correctQuestion,
      coreJournalEntriesToJournalText(correctQuestion.expectedJournalEntries),
    ).result;
    const partialResult = runFullHiddenAdvancedFlow(
      correctQuestion,
      ["Bank A/c Dr. 120000", "To Share Capital A/c 120000"].join("\n"),
    ).result;

    for (const result of [correctResult, partialResult]) {
      const serialized = JSON.stringify(result);
      const parsed = JSON.parse(serialized) as AdvancedPracticeResultViewModel;

      expect(parsed.questionId).toBe(result.questionId);
      expect(parsed.status).toBe(result.status);
      expect(parsed.score.score).toBe(result.score.score);
      assertNoForbiddenRuntimeFields(result);
      expect(containsFunction(result)).toBe(false);
    }
  });

  it("keeps beginner practice separation as a structural import-boundary test", () => {
    // This readiness test intentionally imports only hidden accounting-core modules.
    // It does not import app/practice, API routes, localStorage history/progress,
    // or the existing beginner practice generator. Advanced practice remains
    // separate and hidden until a future UI slice explicitly wires it.
    const question = getQuestion("company-share-issue-premium-practice");

    expect(question.source).toBe("advanced-practice-generator-v1");
    expect(question.topic).toBe("company_accounts");
  });

  it("provides UI-ready hints, mistakes, and prompt metadata for all questions", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      expect(question.beginnerHint.length, question.id).toBeGreaterThan(0);
      expect(question.commonMistakes.length, question.id).toBeGreaterThan(0);
      expect(question.explanation.length, question.id).toBeGreaterThan(0);
      expect(question.title.length, question.id).toBeGreaterThan(0);
      expect(question.prompt.length, question.id).toBeGreaterThan(0);
      expect(question.tags.length, question.id).toBeGreaterThan(0);
    }
  });
});

function runFullHiddenAdvancedFlow(question: AdvancedPracticeQuestion, answerText: string): HiddenAdvancedFlowResult {
  const parseResult = parseAdvancedJournalAnswerText({
    answerText,
    topic: question.topic,
    questionId: question.id,
  });
  const checkResult = checkAdvancedJournalAnswer({
    expectedJournalEntries: question.expectedJournalEntries,
    actualJournalEntries: parseResult.journalEntries,
  });
  const result = buildAdvancedPracticeResult({ question, checkResult });

  return {
    parseResult,
    checkResult,
    result,
  };
}

function getQuestion(id: string): AdvancedPracticeQuestion {
  const question = getAdvancedPracticeQuestionById(id);
  expect(question).toBeDefined();
  return question as AdvancedPracticeQuestion;
}

function findAction(
  result: AdvancedPracticeResultViewModel,
  kind: AdvancedPracticeResultAction["kind"],
): AdvancedPracticeResultAction | undefined {
  return result.actions.find((action) => action.kind === kind);
}

function assertNoForbiddenRuntimeFields(value: unknown): void {
  const forbiddenKeys = new Set(["component", "render", "handler", "execute", "apiPath", "enginePath"]);
  const keys = collectObjectKeys(value);

  for (const key of keys) {
    expect(forbiddenKeys.has(key)).toBe(false);
  }
}

function collectObjectKeys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectObjectKeys);

  const record = value as Record<string, unknown>;
  return Object.keys(record).flatMap((key) => [key, ...collectObjectKeys(record[key])]);
}

function containsFunction(value: unknown): boolean {
  if (typeof value === "function") return true;
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsFunction);

  return Object.values(value as Record<string, unknown>).some(containsFunction);
}
