import { describe, expect, it } from "vitest";
import {
  checkLedgerPracticeAnswer,
  generateLedgerPracticeCase,
  getLedgerPracticeCases,
  parseLedgerPracticeAmount,
} from "@/lib/ledger-practice-generator";
import { generateLedger } from "@/lib/ledger-engine";

describe("ledger practice generator", () => {
  it("returns a valid case", () => {
    const practiceCase = generateLedgerPracticeCase();

    expect(practiceCase.id).toBeTruthy();
    expect(practiceCase.title).toBeTruthy();
    expect(practiceCase.journalEntries).toContain("A/c");
    expect(practiceCase.targetAccount).toBeTruthy();
    expect(practiceCase.explanation.length).toBeGreaterThan(0);
  });

  it("includes at least 8 cases", () => {
    expect(getLedgerPracticeCases()).toHaveLength(8);
  });

  it("processes every case with the existing ledger engine", () => {
    for (const practiceCase of getLedgerPracticeCases()) {
      const result = generateLedger(practiceCase.journalEntries);
      expect(result.status).toBe("success");
    }
  });

  it("matches the existing ledger engine balance for every target account", () => {
    for (const practiceCase of getLedgerPracticeCases()) {
      const result = generateLedger(practiceCase.journalEntries);
      expect(result.status).toBe("success");
      const targetAccount = result.ledgerAccounts.find((account) => account.account === practiceCase.targetAccount);

      expect(targetAccount).toBeDefined();
      expect(practiceCase.expectedBalanceSide).toBe(targetAccount?.balanceSide);
      expect(practiceCase.expectedBalanceAmount).toBe(targetAccount?.balanceAmount);
    }
  });

  it("parses supported amount formats", () => {
    expect(parseLedgerPracticeAmount("Rs.37,000")).toBe(37000);
    expect(parseLedgerPracticeAmount("37000")).toBe(37000);
    expect(parseLedgerPracticeAmount("₹37000")).toBe(37000);
    expect(parseLedgerPracticeAmount("INR 37000")).toBe(37000);
  });

  it("marks a correct answer as correct", () => {
    const practiceCase = generateLedgerPracticeCase(0);
    const result = checkLedgerPracticeAnswer(
      practiceCase,
      practiceCase.expectedBalanceSide,
      `Rs.${practiceCase.expectedBalanceAmount.toLocaleString("en-IN")}`,
    );

    expect(result.isCorrect).toBe(true);
  });

  it("marks a wrong side as incorrect", () => {
    const practiceCase = generateLedgerPracticeCase(0);
    const wrongSide = practiceCase.expectedBalanceSide === "debit" ? "credit" : "debit";
    const result = checkLedgerPracticeAnswer(
      practiceCase,
      wrongSide,
      practiceCase.expectedBalanceAmount.toString(),
    );

    expect(result.isCorrect).toBe(false);
  });

  it("marks a wrong amount as incorrect", () => {
    const practiceCase = generateLedgerPracticeCase(0);
    const result = checkLedgerPracticeAnswer(
      practiceCase,
      practiceCase.expectedBalanceSide,
      (practiceCase.expectedBalanceAmount + 1).toString(),
    );

    expect(result.isCorrect).toBe(false);
  });
});
