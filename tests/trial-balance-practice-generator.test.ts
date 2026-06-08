import { describe, expect, it } from "vitest";
import {
  checkTrialBalancePracticeAnswer,
  generateTrialBalancePracticeCase,
  getTrialBalancePracticeCases,
  parseTrialBalancePracticeAmount,
} from "@/lib/trial-balance-practice-generator";
import { generateTrialBalance } from "@/lib/trial-balance-engine";

describe("trial balance practice generator", () => {
  it("returns a valid case", () => {
    const practiceCase = generateTrialBalancePracticeCase();

    expect(practiceCase.id).toBeTruthy();
    expect(practiceCase.title).toBeTruthy();
    expect(practiceCase.journalEntries).toContain("A/c");
    expect(practiceCase.targetAccount).toBeTruthy();
    expect(practiceCase.trialBalanceRows.length).toBeGreaterThan(0);
    expect(practiceCase.explanation.length).toBeGreaterThan(0);
  });

  it("includes at least 8 cases", () => {
    expect(getTrialBalancePracticeCases()).toHaveLength(8);
  });

  it("processes every case with the existing trial balance engine", () => {
    for (const practiceCase of getTrialBalancePracticeCases()) {
      const result = generateTrialBalance(practiceCase.journalEntries);
      expect(result.status).toBe("success");
    }
  });

  it("matches target account side and amount from the existing trial balance engine", () => {
    for (const practiceCase of getTrialBalancePracticeCases()) {
      const result = generateTrialBalance(practiceCase.journalEntries);
      expect(result.status).toBe("success");
      const targetRow = result.rows.find((row) => row.account === practiceCase.targetAccount);

      if (!targetRow) {
        expect(practiceCase.expectedTargetSide).toBe("not_shown");
        expect(practiceCase.expectedTargetAmount).toBe(0);
      } else if (targetRow.debit > 0) {
        expect(practiceCase.expectedTargetSide).toBe("debit");
        expect(practiceCase.expectedTargetAmount).toBe(targetRow.debit);
      } else {
        expect(practiceCase.expectedTargetSide).toBe("credit");
        expect(practiceCase.expectedTargetAmount).toBe(targetRow.credit);
      }
    }
  });

  it("matches debit and credit totals from the existing trial balance engine", () => {
    for (const practiceCase of getTrialBalancePracticeCases()) {
      const result = generateTrialBalance(practiceCase.journalEntries);
      expect(result.status).toBe("success");
      expect(practiceCase.expectedDebitTotal).toBe(result.debitTotal);
      expect(practiceCase.expectedCreditTotal).toBe(result.creditTotal);
    }
  });

  it("parses supported amount formats", () => {
    expect(parseTrialBalancePracticeAmount("Rs.50,000")).toBe(50000);
    expect(parseTrialBalancePracticeAmount("50000")).toBe(50000);
    expect(parseTrialBalancePracticeAmount("₹50000")).toBe(50000);
    expect(parseTrialBalancePracticeAmount("INR 50000")).toBe(50000);
  });

  it("marks a correct answer as correct with full score", () => {
    const practiceCase = generateTrialBalancePracticeCase(0);
    const result = checkTrialBalancePracticeAnswer(practiceCase, {
      targetSide: practiceCase.expectedTargetSide,
      targetAmountText: practiceCase.expectedTargetAmount.toString(),
      debitTotalText: practiceCase.expectedDebitTotal.toString(),
      creditTotalText: practiceCase.expectedCreditTotal.toString(),
      agrees: practiceCase.expectedAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("reduces score for a wrong target side", () => {
    const practiceCase = generateTrialBalancePracticeCase(0);
    const wrongSide = practiceCase.expectedTargetSide === "debit" ? "credit" : "debit";
    const result = checkTrialBalancePracticeAnswer(practiceCase, {
      targetSide: wrongSide,
      targetAmountText: practiceCase.expectedTargetAmount.toString(),
      debitTotalText: practiceCase.expectedDebitTotal.toString(),
      creditTotalText: practiceCase.expectedCreditTotal.toString(),
      agrees: practiceCase.expectedAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(80);
  });

  it("reduces score for a wrong debit total", () => {
    const practiceCase = generateTrialBalancePracticeCase(0);
    const result = checkTrialBalancePracticeAnswer(practiceCase, {
      targetSide: practiceCase.expectedTargetSide,
      targetAmountText: practiceCase.expectedTargetAmount.toString(),
      debitTotalText: (practiceCase.expectedDebitTotal + 1).toString(),
      creditTotalText: practiceCase.expectedCreditTotal.toString(),
      agrees: practiceCase.expectedAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(75);
  });

  it("checks Trial Balance agreement status", () => {
    const practiceCase = generateTrialBalancePracticeCase(0);
    const result = checkTrialBalancePracticeAnswer(practiceCase, {
      targetSide: practiceCase.expectedTargetSide,
      targetAmountText: practiceCase.expectedTargetAmount.toString(),
      debitTotalText: practiceCase.expectedDebitTotal.toString(),
      creditTotalText: practiceCase.expectedCreditTotal.toString(),
      agrees: practiceCase.expectedAgrees ? "no" : "yes",
    });

    expect(result.isCorrect).toBe(false);
    expect(result.checks.agrees).toBe(false);
    expect(result.score).toBe(90);
  });

  it("accepts blank amount when target account is not shown", () => {
    const practiceCase = getTrialBalancePracticeCases().find((currentCase) => currentCase.expectedTargetSide === "not_shown");
    expect(practiceCase).toBeDefined();

    const result = checkTrialBalancePracticeAnswer(practiceCase!, {
      targetSide: "not_shown",
      targetAmountText: "",
      debitTotalText: practiceCase!.expectedDebitTotal.toString(),
      creditTotalText: practiceCase!.expectedCreditTotal.toString(),
      agrees: practiceCase!.expectedAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });
});
