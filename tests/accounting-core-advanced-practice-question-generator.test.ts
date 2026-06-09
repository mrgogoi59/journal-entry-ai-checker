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
  "company-share-application-money-received-practice",
  "company-calls-in-advance-practice",
  "company-debenture-redemption-at-par-practice",
  "company-share-issue-premium-practice",
  "company-first-call-due-practice",
  "company-calls-in-arrears-practice",
  "company-share-forfeiture-practice",
  "company-debenture-issue-discount-practice",
  "partnership-capital-contribution-practice",
  "partnership-drawings-paid-cash-practice",
  "partnership-interest-on-capital-fluctuating-practice",
  "partnership-partner-salary-practice",
  "partnership-interest-on-capital-practice",
  "partnership-interest-on-drawings-practice",
  "partnership-revaluation-loss-practice",
  "partnership-goodwill-compensation-practice",
  "partnership-realisation-assets-transfer-practice",
];

const expectedWhyThisEntryQuestionIds = [
  "company-share-application-money-received-practice",
  "company-calls-in-advance-practice",
  "company-debenture-redemption-at-par-practice",
  "partnership-capital-contribution-practice",
  "partnership-drawings-paid-cash-practice",
  "partnership-interest-on-capital-fluctuating-practice",
];

const expectedFinalAccountsImpactQuestionIds = [
  "partnership-capital-contribution-practice",
  "partnership-drawings-paid-cash-practice",
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

    expect(companyQuestions.length).toBe(8);
    expect(companyQuestions.every((question) => question.topic === "company_accounts")).toBe(true);
    expect(partnershipQuestions.length).toBe(9);
    expect(partnershipQuestions.every((question) => question.topic === "partnership")).toBe(true);
    expect(allQuestions.length).toBe(17);
  });

  it("keeps the post-exposure runtime boundary to the intended Company and Partnership questions", () => {
    const companyQuestionIds = getAdvancedPracticeQuestionsByTopic("company_accounts").map((question) => question.id);
    const partnershipQuestionIds = getAdvancedPracticeQuestionsByTopic("partnership").map((question) => question.id);
    const shareApplicationQuestions = filterAdvancedPracticeQuestions({ tags: ["share-application"] });
    const callsInAdvanceQuestions = filterAdvancedPracticeQuestions({ tags: ["calls-in-advance"] });
    const debentureRedemptionQuestions = filterAdvancedPracticeQuestions({ tags: ["debenture-redemption"] });
    const capitalContributionQuestions = filterAdvancedPracticeQuestions({ tags: ["capital-contribution"] });
    const drawingsQuestions = filterAdvancedPracticeQuestions({ tags: ["drawings"] });
    const fluctuatingInterestQuestions = filterAdvancedPracticeQuestions({ tags: ["fluctuating-capital"] });

    expect(companyQuestionIds).toEqual([
      "company-share-application-money-received-practice",
      "company-calls-in-advance-practice",
      "company-debenture-redemption-at-par-practice",
      "company-share-issue-premium-practice",
      "company-first-call-due-practice",
      "company-calls-in-arrears-practice",
      "company-share-forfeiture-practice",
      "company-debenture-issue-discount-practice",
    ]);
    expect(shareApplicationQuestions).toHaveLength(1);
    expect(shareApplicationQuestions[0]).toMatchObject({
      id: "company-share-application-money-received-practice",
      topic: "company_accounts",
      title: "Share application money received",
    });
    expect(callsInAdvanceQuestions).toHaveLength(1);
    expect(callsInAdvanceQuestions[0]).toMatchObject({
      id: "company-calls-in-advance-practice",
      topic: "company_accounts",
      title: "Calls in advance received",
    });
    expect(debentureRedemptionQuestions).toHaveLength(1);
    expect(debentureRedemptionQuestions[0]).toMatchObject({
      id: "company-debenture-redemption-at-par-practice",
      topic: "company_accounts",
      title: "Debenture redemption at par",
    });
    expect(debentureRedemptionQuestions[0].tags).toEqual(["company", "debenture-redemption"]);
    expect(debentureRedemptionQuestions[0].expectedJournalEntries).toHaveLength(1);
    expect(
      debentureRedemptionQuestions[0].expectedJournalEntries[0].lines.map((line) => ({
        account: line.account.name,
        role: line.account.role,
        side: line.side,
        amount: line.amount,
      })),
    ).toEqual([
      { account: "Debentures A/c", role: "debenture", side: "debit", amount: 50000 },
      { account: "Bank A/c", role: "bank", side: "credit", amount: 50000 },
    ]);
    expect(partnershipQuestionIds.slice(0, 3)).toEqual([
      "partnership-capital-contribution-practice",
      "partnership-drawings-paid-cash-practice",
      "partnership-interest-on-capital-fluctuating-practice",
    ]);
    expect(partnershipQuestionIds[3]).toBe("partnership-partner-salary-practice");
    expect(capitalContributionQuestions).toHaveLength(1);
    expect(capitalContributionQuestions[0]).toMatchObject({
      id: "partnership-capital-contribution-practice",
      topic: "partnership",
      title: "Partner capital introduced",
    });
    expect(drawingsQuestions).toHaveLength(1);
    expect(drawingsQuestions[0]).toMatchObject({
      id: "partnership-drawings-paid-cash-practice",
      topic: "partnership",
      title: "Partner drawings paid in cash",
    });
    expect(fluctuatingInterestQuestions).toHaveLength(1);
    expect(fluctuatingInterestQuestions[0]).toMatchObject({
      id: "partnership-interest-on-capital-fluctuating-practice",
      topic: "partnership",
      title: "Interest on capital under fluctuating capital",
    });
    expect(filterAdvancedPracticeQuestions({ topic: "all" })).toHaveLength(expectedQuestionIds.length);
    expect(filterAdvancedPracticeQuestions({ topic: "all" }).map((question) => question.id)).toEqual(expectedQuestionIds);
    expect(
      getAllAdvancedPracticeQuestions()
        .filter((question) => question.whyThisEntry?.length)
        .map((question) => question.id),
    ).toEqual(expectedWhyThisEntryQuestionIds);
    for (const questionId of expectedWhyThisEntryQuestionIds) {
      const question = getAdvancedPracticeQuestionById(questionId);

      expect(question?.whyThisEntry).toHaveLength(2);
      expect(question?.whyThisEntry?.join(" ")).not.toMatch(/undefined|null/i);
    }
    expect(
      getAllAdvancedPracticeQuestions()
        .filter((question) => question.finalAccountsImpact)
        .map((question) => question.id),
    ).toEqual(expectedFinalAccountsImpactQuestionIds);
    expect(capitalContributionQuestions[0].finalAccountsImpact).toEqual({
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Bank increases" },
        { label: "Capital", detail: "Amit Capital increases" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    });
    expect(drawingsQuestions[0].finalAccountsImpact).toEqual({
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Cash decreases" },
        { label: "Capital/Drawings", detail: "Amit Drawings increases and is adjusted against capital" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    });
  });

  it("filters questions by tags and requires all requested tags", () => {
    const premiumQuestions = filterAdvancedPracticeQuestions({ tags: ["premium"] });
    const revaluationQuestions = filterAdvancedPracticeQuestions({ tags: ["revaluation"] });
    const debentureQuestions = filterAdvancedPracticeQuestions({ tags: ["debenture"] });
    const shareApplicationQuestions = filterAdvancedPracticeQuestions({ tags: ["share-application"] });
    const callsInAdvanceQuestions = filterAdvancedPracticeQuestions({ tags: ["calls-in-advance"] });
    const debentureRedemptionQuestions = filterAdvancedPracticeQuestions({ tags: ["debenture-redemption"] });
    const capitalContributionQuestions = filterAdvancedPracticeQuestions({ tags: ["capital-contribution"] });
    const drawingsQuestions = filterAdvancedPracticeQuestions({ tags: ["drawings"] });
    const fluctuatingInterestQuestions = filterAdvancedPracticeQuestions({ tags: ["interest-on-capital", "fluctuating-capital"] });
    const admissionGoodwillQuestions = filterAdvancedPracticeQuestions({ tags: ["admission", "goodwill"] });
    const missingCombinedTagQuestions = filterAdvancedPracticeQuestions({ tags: ["company", "goodwill"] });

    expect(premiumQuestions.map((question) => question.id)).toEqual(["company-share-issue-premium-practice"]);
    expect(revaluationQuestions.map((question) => question.id)).toEqual(["partnership-revaluation-loss-practice"]);
    expect(debentureQuestions.map((question) => question.id)).toEqual(["company-debenture-issue-discount-practice"]);
    expect(shareApplicationQuestions.map((question) => question.id)).toEqual([
      "company-share-application-money-received-practice",
    ]);
    expect(callsInAdvanceQuestions.map((question) => question.id)).toEqual(["company-calls-in-advance-practice"]);
    expect(debentureRedemptionQuestions.map((question) => question.id)).toEqual([
      "company-debenture-redemption-at-par-practice",
    ]);
    expect(capitalContributionQuestions.map((question) => question.id)).toEqual([
      "partnership-capital-contribution-practice",
    ]);
    expect(drawingsQuestions.map((question) => question.id)).toEqual(["partnership-drawings-paid-cash-practice"]);
    expect(fluctuatingInterestQuestions.map((question) => question.id)).toEqual([
      "partnership-interest-on-capital-fluctuating-practice",
    ]);
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
    const question = getAdvancedPracticeQuestionById("company-share-application-money-received-practice");

    expect(question?.title).toBe("Share application money received");
    expect(question?.topic).toBe("company_accounts");
    expect(getAdvancedPracticeQuestionById("unknown-question")).toBeUndefined();
  });

  it("gets the next deterministic practice question", () => {
    expect(getNextAdvancedPracticeQuestion()?.id).toBe(expectedQuestionIds[0]);
    expect(getNextAdvancedPracticeQuestion(expectedQuestionIds[0])?.id).toBe(expectedQuestionIds[1]);
    expect(getNextAdvancedPracticeQuestion(expectedQuestionIds.at(-1))?.id).toBe(expectedQuestionIds[0]);
    expect(getNextAdvancedPracticeQuestion("company-share-application-money-received-practice", { topic: "company_accounts" })?.id).toBe(
      "company-calls-in-advance-practice",
    );
    expect(getNextAdvancedPracticeQuestion("company-calls-in-advance-practice", { topic: "company_accounts" })?.id).toBe(
      "company-debenture-redemption-at-par-practice",
    );
    expect(getNextAdvancedPracticeQuestion("company-debenture-redemption-at-par-practice", { topic: "company_accounts" })?.id).toBe(
      "company-share-issue-premium-practice",
    );
    expect(getNextAdvancedPracticeQuestion("partnership-drawings-paid-cash-practice", { topic: "partnership" })?.id).toBe(
      "partnership-interest-on-capital-fluctuating-practice",
    );
    expect(getNextAdvancedPracticeQuestion("partnership-interest-on-capital-fluctuating-practice", { topic: "partnership" })?.id).toBe(
      "partnership-partner-salary-practice",
    );
    expect(getNextAdvancedPracticeQuestion("company-debenture-issue-discount-practice", { topic: "company_accounts" })?.id).toBe(
      "company-share-application-money-received-practice",
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
