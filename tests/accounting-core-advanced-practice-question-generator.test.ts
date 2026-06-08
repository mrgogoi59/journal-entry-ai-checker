import { describe, expect, it } from "vitest";
import {
  ADVANCED_PRACTICE_QUESTION_BANK_VERSION,
  coreJournalEntriesToJournalText,
  filterAdvancedPracticeQuestions,
  getAdvancedPracticeQuestionBank,
  getAdvancedPracticeQuestionById,
  getAdvancedPracticeQuestionIds,
  getAdvancedPracticeQuestionsByTopic,
  getAllAdvancedPracticeQuestions,
  getCoreJournalEntryTotals,
  getNextAdvancedPracticeQuestion,
  type AdvancedPracticeQuestion,
  type JournalEntry,
} from "@/lib/accounting-core";
import { generateLedger, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult } from "@/lib/trial-balance-engine";

const expectedQuestionIds = [
  "company-share-issue-premium-practice",
  "company-first-call-due-practice",
  "company-calls-in-arrears-practice",
  "company-share-forfeiture-practice",
  "company-debenture-issue-discount-practice",
  "company-calls-in-advance-practice",
  "partnership-partner-salary-practice",
  "partnership-interest-on-capital-practice",
  "partnership-interest-on-drawings-practice",
  "partnership-revaluation-loss-practice",
  "partnership-goodwill-compensation-practice",
  "partnership-realisation-assets-transfer-practice",
];

describe("accounting-core advanced practice question generator", () => {
  it("returns a question bank with expected version and minimum topic counts", () => {
    const bank = getAdvancedPracticeQuestionBank();
    const companyQuestions = bank.questions.filter((question) => question.topic === "company_accounts");
    const partnershipQuestions = bank.questions.filter((question) => question.topic === "partnership");

    expect(bank.version).toBe(ADVANCED_PRACTICE_QUESTION_BANK_VERSION);
    expect(bank.version).toBe("advanced-practice-question-bank-v1");
    expect(bank.questions.length).toBeGreaterThanOrEqual(10);
    expect(companyQuestions.length).toBeGreaterThanOrEqual(5);
    expect(partnershipQuestions.length).toBeGreaterThanOrEqual(5);
  });

  it("returns deterministic unique question IDs", () => {
    const ids = getAdvancedPracticeQuestionIds();

    expect(ids).toEqual(expectedQuestionIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes all required fields on every question", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      expect(question.id).toBeTruthy();
      expect(["partnership", "company_accounts"]).toContain(question.topic);
      expect(question.title).toBeTruthy();
      expect(question.prompt).toBeTruthy();
      expect(["beginner", "intermediate"]).toContain(question.difficulty);
      expect(question.tags.length).toBeGreaterThan(0);
      expect(question.explanation).toBeTruthy();
      expect(question.beginnerHint).toBeTruthy();
      expect(question.commonMistakes.length).toBeGreaterThan(0);
      expect(question.expectedJournalEntries.length).toBeGreaterThan(0);
      expect(question.source).toBe("advanced-practice-generator-v1");
    }
  });

  it("keeps all expected journal entries balanced with positive amounts", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      for (const entry of question.expectedJournalEntries) {
        expect(entry.lines.some((line) => line.side === "debit")).toBe(true);
        expect(entry.lines.some((line) => line.side === "credit")).toBe(true);
        expect(entry.lines.every((line) => line.amount > 0)).toBe(true);

        const totals = getCoreJournalEntryTotals(entry);
        expect(totals.debitTotal).toBe(totals.creditTotal);
        expect(totals.debitTotal).toBeGreaterThan(0);
      }
    }
  });

  it("serializes every question answer and flows through Ledger and Trial Balance", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      const journalText = coreJournalEntriesToJournalText(question.expectedJournalEntries);
      const ledger = generateLedger(journalText);
      const trialBalance = generateTrialBalance(journalText);

      expectLedgerSuccess(ledger);
      expectTrialBalanceBalanced(trialBalance);
      expect(trialBalance.debitTotal).toBe(trialBalance.creditTotal);
    }
  });

  it("filters questions by topic", () => {
    const companyQuestions = getAdvancedPracticeQuestionsByTopic("company_accounts");
    const partnershipQuestions = getAdvancedPracticeQuestionsByTopic("partnership");
    const allQuestions = filterAdvancedPracticeQuestions({ topic: "all" });

    expect(companyQuestions.length).toBe(6);
    expect(companyQuestions.every((question) => question.topic === "company_accounts")).toBe(true);
    expect(partnershipQuestions.length).toBe(6);
    expect(partnershipQuestions.every((question) => question.topic === "partnership")).toBe(true);
    expect(allQuestions.length).toBe(12);
  });

  it("filters questions by tags and requires all requested tags", () => {
    const premiumQuestions = filterAdvancedPracticeQuestions({ tags: ["premium"] });
    const revaluationQuestions = filterAdvancedPracticeQuestions({ tags: ["revaluation"] });
    const debentureQuestions = filterAdvancedPracticeQuestions({ tags: ["debenture"] });
    const admissionGoodwillQuestions = filterAdvancedPracticeQuestions({ tags: ["admission", "goodwill"] });
    const missingCombinedTagQuestions = filterAdvancedPracticeQuestions({ tags: ["company", "goodwill"] });

    expect(premiumQuestions.map((question) => question.id)).toEqual(["company-share-issue-premium-practice"]);
    expect(revaluationQuestions.map((question) => question.id)).toEqual(["partnership-revaluation-loss-practice"]);
    expect(debentureQuestions.map((question) => question.id)).toEqual(["company-debenture-issue-discount-practice"]);
    expect(admissionGoodwillQuestions.map((question) => question.id)).toEqual(["partnership-goodwill-compensation-practice"]);
    expect(missingCombinedTagQuestions).toEqual([]);
  });

  it("filters questions by difficulty", () => {
    const beginnerQuestions = filterAdvancedPracticeQuestions({ difficulty: "beginner" });
    const intermediateQuestions = filterAdvancedPracticeQuestions({ difficulty: "intermediate" });

    expect(beginnerQuestions.length).toBeGreaterThan(0);
    expect(intermediateQuestions.length).toBeGreaterThan(0);
    expect(beginnerQuestions.every((question) => question.difficulty === "beginner")).toBe(true);
    expect(intermediateQuestions.every((question) => question.difficulty === "intermediate")).toBe(true);
  });

  it("applies deterministic limit filtering", () => {
    expect(filterAdvancedPracticeQuestions({ limit: 2 }).map((question) => question.id)).toEqual(expectedQuestionIds.slice(0, 2));
    expect(filterAdvancedPracticeQuestions({ limit: 0 })).toEqual([]);
    expect(filterAdvancedPracticeQuestions({ limit: -1 })).toEqual([]);
  });

  it("looks up questions by ID", () => {
    const question = getAdvancedPracticeQuestionById("company-share-issue-premium-practice");

    expect(question?.title).toBe("Share issue at premium");
    expect(question?.topic).toBe("company_accounts");
    expect(getAdvancedPracticeQuestionById("unknown-question")).toBeUndefined();
  });

  it("gets the next deterministic practice question", () => {
    expect(getNextAdvancedPracticeQuestion()?.id).toBe(expectedQuestionIds[0]);
    expect(getNextAdvancedPracticeQuestion(expectedQuestionIds[0])?.id).toBe(expectedQuestionIds[1]);
    expect(getNextAdvancedPracticeQuestion(expectedQuestionIds.at(-1))?.id).toBe(expectedQuestionIds[0]);
    expect(getNextAdvancedPracticeQuestion("company-share-issue-premium-practice", { topic: "company_accounts" })?.id).toBe(
      "company-first-call-due-practice",
    );
    expect(getNextAdvancedPracticeQuestion("company-calls-in-advance-practice", { topic: "company_accounts" })?.id).toBe(
      "company-share-issue-premium-practice",
    );
    expect(getNextAdvancedPracticeQuestion(undefined, { tags: ["missing-tag"] })).toBeUndefined();
  });

  it("does not allow returned arrays to mutate the internal question bank", () => {
    const originalQuestions = getAllAdvancedPracticeQuestions();
    const originalCount = originalQuestions.length;

    originalQuestions.pop();
    originalQuestions.push(createFakeQuestion());
    originalQuestions[0].tags.push("mutated-tag");
    originalQuestions[0].expectedJournalEntries.pop();
    originalQuestions[0].commonMistakes.pop();

    const nextQuestions = getAllAdvancedPracticeQuestions();
    expect(nextQuestions.length).toBe(originalCount);
    expect(nextQuestions.map((question) => question.id)).toEqual(expectedQuestionIds);
    expect(nextQuestions[0].tags).not.toContain("mutated-tag");
    expect(nextQuestions[0].expectedJournalEntries.length).toBeGreaterThan(0);
    expect(nextQuestions[0].commonMistakes.length).toBeGreaterThan(0);
  });

  it("keeps generated explanations beginner-friendly", () => {
    for (const question of getAllAdvancedPracticeQuestions()) {
      expect(question.explanation).not.toMatch(/undefined|null/i);
      expect(question.beginnerHint.length).toBeGreaterThan(0);
      expect(question.commonMistakes.length).toBeGreaterThan(0);
      expect(question.commonMistakes.join(" ")).not.toMatch(/undefined|null/i);
    }
  });
});

function expectLedgerSuccess(result: LedgerResult): void {
  expect(result.status).toBe("success");
  expect(result.errors).toEqual([]);
}

function expectTrialBalanceBalanced(result: TrialBalanceResult): void {
  expect(result.status).toBe("success");
  expect(result.agrees).toBe(true);
  expect(result.difference).toBe(0);
}

function createFakeQuestion(): AdvancedPracticeQuestion {
  const entry: JournalEntry = {
    id: "fake-entry",
    topic: "company_accounts",
    lines: [
      {
        account: { name: "Bank A/c", role: "bank", class: "asset", normalBalance: "debit" },
        side: "debit",
        amount: 1,
      },
      {
        account: { name: "Share Capital A/c", role: "share_capital", class: "equity", normalBalance: "credit" },
        side: "credit",
        amount: 1,
      },
    ],
  };

  return {
    id: "fake-question",
    topic: "company_accounts",
    title: "Fake question",
    prompt: "Fake prompt.",
    difficulty: "beginner",
    tags: ["fake"],
    expectedJournalEntries: [entry],
    explanation: "Fake explanation.",
    beginnerHint: "Fake hint.",
    commonMistakes: ["Fake mistake."],
    source: "advanced-practice-generator-v1",
  };
}
