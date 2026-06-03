import { describe, expect, it } from "vitest";
import { generateExpectedEntry } from "@/lib/expected-entry-generator";
import type { TransactionClassification } from "@/lib/types";

describe("generateExpectedEntry", () => {
  it("generates one debit and one credit line from a classification", () => {
    const classification: TransactionClassification = {
      transaction_type: "capital_introduced_cash",
      confidence: 0.95,
      debitAccount: "Cash",
      creditAccount: "Capital",
      expectedDebitAccount: "Cash",
      expectedCreditAccount: "Capital",
      amount: 50000,
      explanationLogic: "Cash increases and capital increases.",
    };

    expect(generateExpectedEntry(classification)).toEqual({
      debits: [{ account: "Cash", amount: 50000 }],
      credits: [{ account: "Capital", amount: 50000 }],
    });
  });

  it("uses the classification amount consistently on both sides", () => {
    const classification: TransactionClassification = {
      transaction_type: "paid_rent",
      confidence: 0.95,
      debitAccount: "Rent Expense",
      creditAccount: "Cash",
      expectedDebitAccount: "Rent Expense",
      expectedCreditAccount: "Cash",
      amount: 7500,
      explanationLogic: "Rent is an expense and cash decreases.",
    };

    const expectedEntry = generateExpectedEntry(classification);

    expect(expectedEntry.debits[0].amount).toBe(7500);
    expect(expectedEntry.credits[0].amount).toBe(7500);
  });
});
