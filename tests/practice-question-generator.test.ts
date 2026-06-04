import { describe, expect, it } from "vitest";
import {
  generatePracticeQuestion,
  simplePracticeAmounts,
  supportedPracticeTransactionTypes,
} from "@/lib/practice-question-generator";
import { classifyTransaction, extractAmount } from "@/lib/transaction-classifier";

describe("generatePracticeQuestion", () => {
  it("returns the expected beginner practice question shape", () => {
    const question = generatePracticeQuestion(() => 0);

    expect(question).toMatchObject({
      transaction_text: "Started business with ₹1,000 cash",
      difficulty: "Beginner",
      transaction_type: "capital_introduced_cash",
    });
    expect(question.id).toEqual(expect.any(String));
  });

  it("includes a supported simple amount", () => {
    const question = generatePracticeQuestion(() => 0.99);
    const amount = extractAmount(question.transaction_text);

    expect(amount).not.toBeNull();
    expect(simplePracticeAmounts).toContain(amount as (typeof simplePracticeAmounts)[number]);
    expect(question.transaction_text).toMatch(/₹[0-9,]+/);
  });

  it("uses only valid transaction types from the supported practice set", () => {
    const question = generatePracticeQuestion(() => 0.4);

    expect(supportedPracticeTransactionTypes).toContain(question.transaction_type);
  });

  it.each(supportedPracticeTransactionTypes.map((transactionType, index) => [transactionType, index] as const))(
    "generates a classifier-supported question for %s",
    (transactionType, index) => {
      const question = generatePracticeQuestion(
        sequenceRandom([(index + 0.25) / supportedPracticeTransactionTypes.length, 0]),
      );
      const classification = classifyTransaction(question.transaction_text);

      expect(question.transaction_type).toBe(transactionType);
      expect(classification).not.toBeNull();
      expect(classification?.transaction_type).toBe(transactionType);
      expect(classification?.confidence).toBeGreaterThanOrEqual(0.7);
    },
  );

  it("does not generate unsupported transactions across repeated random calls", () => {
    for (let index = 0; index < 100; index += 1) {
      const question = generatePracticeQuestion(() => (index % 99) / 100);
      const classification = classifyTransaction(question.transaction_text);

      expect(classification?.transaction_type).toBe(question.transaction_type);
    }
  });
});

function sequenceRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++] ?? 0;
}
