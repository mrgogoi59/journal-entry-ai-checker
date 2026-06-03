import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/generate-practice-question/route";
import { supportedPracticeTransactionTypes } from "@/lib/practice-question-generator";
import { classifyTransaction, extractAmount } from "@/lib/transaction-classifier";
import type { PracticeQuestion } from "@/lib/types";

describe("GET /api/generate-practice-question", () => {
  it("returns one clean supported practice question", async () => {
    const response = GET();
    const body = (await response.json()) as PracticeQuestion;
    const classification = classifyTransaction(body.transaction_text);

    expect(response.status).toBe(200);
    expect(body.id).toEqual(expect.any(String));
    expect(body.difficulty).toBe("Beginner");
    expect(body.transaction_text).toMatch(/₹[0-9,]+/);
    expect(supportedPracticeTransactionTypes).toContain(body.transaction_type);
    expect(extractAmount(body.transaction_text)).toBeGreaterThan(0);
    expect(classification?.transaction_type).toBe(body.transaction_type);
  });
});
