import { describe, expect, it } from "vitest";
import { checkJournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/journal-entry-checker";
import { JOURNAL_ENTRY_PRACTICE_LIMITS, type JournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/types";
import { soldGoodsForCashAnswerKey } from "@/lib/learning-platform/chapters/journal-entry-answer-keys.server";
import { SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID } from "@/lib/learning-platform/chapters/journal-entries";

function createAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Cash A/c Dr.",
        lf: "J1",
        debitAmount: "12000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Sales A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "12000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "12000",
    totalCredit: "12000",
    narration: "Being goods sold for cash.",
    ...overrides,
  };
}

function check(attempt: JournalEntryPracticeAttempt) {
  return checkJournalEntryPracticeAttempt(attempt, soldGoodsForCashAnswerKey);
}

describe("learning-platform journal entry checker", () => {
  it("accepts the exact cash-sale journal entry with totals and narration", () => {
    const result = check(createAttempt());

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Cash is correctly debited because cash is received.",
        "Sales is correctly credited because sales revenue increases.",
        "Narration communicates that goods were sold for cash.",
        "Debit and credit totals are balanced.",
      ]),
    );
    expect(result.totalsResult).toMatchObject({
      status: "correct",
      enteredDebit: 12000,
      enteredCredit: 12000,
      rowDebitTotal: 12000,
      rowCreditTotal: 12000,
    });
  });

  it("accepts harmless formatting differences without changing accounting meaning", () => {
    const result = check(
      createAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "   cash   dr   ",
            lf: "J1",
            debitAmount: "₹12,000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "TO SALES A/C",
            lf: "J1",
            debitAmount: "",
            creditAmount: "12,000",
          },
        ],
        totalDebit: "₹12,000.00",
        totalCredit: "12,000.00",
        narration: "Being cash sales.",
      }),
    );

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
  });

  it("does not mark a balanced answer correct when the accounting treatment is wrong", () => {
    const result = check(
      createAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Bank A/c Dr.",
            lf: "J1",
            debitAmount: "12000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Purchases A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "12000",
          },
        ],
        totalDebit: "12000",
        totalCredit: "12000",
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.balanceResult.status).toBe("correct");
    expect(result.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because cash is received."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Purchases A/c is not used when goods are sold."]));
  });

  it("rejects Purchases instead of Sales with targeted feedback", () => {
    const result = check(
      createAttempt({
        rows: [
          createAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Purchases A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "12000",
          },
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Purchases A/c is not used when goods are sold."]));
    expect(result.hints).toEqual(expect.arrayContaining(["Use Sales A/c for goods sold, not Purchases A/c."]));
  });

  it("rejects Bank instead of Cash with targeted feedback", () => {
    const result = check(
      createAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Bank A/c Dr.",
            lf: "J1",
            debitAmount: "12000",
            creditAmount: "",
          },
          createAttempt().rows[1],
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because cash is received."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Cash A/c Dr. is missing."]));
  });

  it("rejects cash credited instead of debited", () => {
    const result = check(
      createAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "To Cash A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "12000",
          },
          createAttempt().rows[1],
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Cash A/c needs Dr. because Cash is debited."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the credit column."]));
  });

  it("rejects sales debited instead of credited", () => {
    const result = check(
      createAttempt({
        rows: [
          createAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "Sales A/c Dr.",
            lf: "J1",
            debitAmount: "12000",
            creditAmount: "",
          },
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Sales A/c needs To because Sales is credited."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Sales should not be placed in the debit column."]));
  });

  it("rejects incorrect amounts and unequal totals", () => {
    const result = check(
      createAttempt({
        rows: [
          { ...createAttempt().rows[0], debitAmount: "10000" },
          createAttempt().rows[1],
        ],
        totalDebit: "10000",
        totalCredit: "12000",
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Cash should be debited with ₹12,000."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Total Debit should be ₹12,000."]));
    expect(result.balanceResult.status).toBe("error");
  });

  it("rejects missing required lines, duplicate conceptual lines, and extra or partial non-empty rows", () => {
    const missingCash = check(createAttempt({ rows: [createAttempt().rows[1]] }));
    const duplicateCash = check(
      createAttempt({
        rows: [createAttempt().rows[0], { ...createAttempt().rows[0], rowOrder: 2 }, createAttempt().rows[1]],
      }),
    );
    const duplicateSales = check(
      createAttempt({
        rows: [createAttempt().rows[0], createAttempt().rows[1], { ...createAttempt().rows[1], rowOrder: 3 }],
      }),
    );
    const extraLine = check(
      createAttempt({
        rows: [
          createAttempt().rows[0],
          createAttempt().rows[1],
          {
            rowOrder: 3,
            particulars: "Commission A/c",
            lf: "J1",
            debitAmount: "100",
            creditAmount: "",
          },
        ],
      }),
    );
    const partialLine = check(
      createAttempt({
        rows: [
          createAttempt().rows[0],
          createAttempt().rows[1],
          {
            rowOrder: 3,
            particulars: "",
            lf: "J2",
            debitAmount: "",
            creditAmount: "",
          },
        ],
      }),
    );

    expect(missingCash.errors).toEqual(expect.arrayContaining(["Cash A/c Dr. is missing."]));
    expect(duplicateCash.errors).toEqual(expect.arrayContaining(["Cash A/c Dr. appears more than once."]));
    expect(duplicateSales.errors).toEqual(expect.arrayContaining(["To Sales A/c appears more than once."]));
    expect(extraLine.errors).toEqual(expect.arrayContaining(["Row 3 is an extra non-empty line."]));
    expect(partialLine.errors).toEqual(expect.arrayContaining(["Row 3 is partly filled. Add particulars or clear the row."]));
  });

  it("rejects missing Dr treatment and missing To treatment", () => {
    const missingDr = check(createAttempt({ rows: [{ ...createAttempt().rows[0], particulars: "Cash A/c" }, createAttempt().rows[1]] }));
    const missingTo = check(createAttempt({ rows: [createAttempt().rows[0], { ...createAttempt().rows[1], particulars: "Sales A/c" }] }));

    expect(missingDr.errors).toEqual(expect.arrayContaining(["Cash A/c needs Dr. because Cash is debited."]));
    expect(missingTo.errors).toEqual(expect.arrayContaining(["Sales A/c needs To because Sales is credited."]));
  });

  it("fails safely for a blank attempt", () => {
    const result = check(
      createAttempt({
        rows: [
          { rowOrder: 1, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
          { rowOrder: 2, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
        ],
        totalDebit: "",
        totalCredit: "",
        narration: "",
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(["The answer is blank."]);
    expect(result.correctAnswerRevealAvailable).toBe(false);
  });

  it("rejects unsafe amount inputs without NaN, crashes, or misleading success", () => {
    const amountCases = [
      { label: "blank", debitAmount: "", expectedMessage: "Cash should be debited with ₹12,000." },
      { label: "zero", debitAmount: "0", expectedMessage: "Cash should be debited with ₹12,000." },
      { label: "negative", debitAmount: "-12000", expectedMessage: "Debit amount is not a valid number." },
      { label: "alphabetic", debitAmount: "twelve thousand", expectedMessage: "Debit amount is not a valid number." },
      { label: "malformed", debitAmount: "12..000", expectedMessage: "Debit amount is not a valid number." },
      { label: "multiple decimals", debitAmount: "12000.000", expectedMessage: "Debit amount is not a valid number." },
      {
        label: "huge",
        debitAmount: String(JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountValue + 1),
        expectedMessage: "Debit amount is not a valid number.",
      },
    ];

    for (const amountCase of amountCases) {
      const result = check(
        createAttempt({
          rows: [{ ...createAttempt().rows[0], debitAmount: amountCase.debitAmount }, createAttempt().rows[1]],
        }),
      );

      expect(result.status, amountCase.label).toBe("incorrect");
      expect(result.errors, amountCase.label).toEqual(expect.arrayContaining([amountCase.expectedMessage]));
      expect(Number.isNaN(result.totalsResult.rowDebitTotal), amountCase.label).toBe(false);
    }
  });

  it("rejects both debit and credit amounts entered on the same conceptual row", () => {
    const cashBothColumns = check(
      createAttempt({
        rows: [{ ...createAttempt().rows[0], creditAmount: "12000" }, createAttempt().rows[1]],
      }),
    );
    const salesBothColumns = check(
      createAttempt({
        rows: [createAttempt().rows[0], { ...createAttempt().rows[1], debitAmount: "12000" }],
      }),
    );

    expect(cashBothColumns.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the credit column."]));
    expect(salesBothColumns.errors).toEqual(expect.arrayContaining(["Sales should not be placed in the debit column."]));
  });

  it("rejects correct line amounts when student-entered totals are incorrect", () => {
    const result = check(createAttempt({ totalDebit: "11,000", totalCredit: "₹12,000" }));

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Total Debit should be ₹12,000."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Entered totals should match the amounts written in the journal rows."]));
  });

  it("rejects purchase or unrelated narration and no narration", () => {
    const purchaseNarration = check(createAttempt({ narration: "Being goods purchased for cash." }));
    const unrelatedNarration = check(createAttempt({ narration: "Being personal expense paid." }));
    const noNarration = check(createAttempt({ narration: "" }));

    expect(purchaseNarration.status).toBe("incorrect");
    expect(purchaseNarration.narrationResult.message).toBe("Narration should explain that goods were sold for cash.");
    expect(unrelatedNarration.status).toBe("incorrect");
    expect(noNarration.status).toBe("incorrect");
    expect(noNarration.errors).toEqual(expect.arrayContaining(["Narration is required for this Practice It Yourself question."]));
  });

  it("uses presentation warnings for reverse order, blank L.F., and non-standard narration", () => {
    const reverseOrder = check(
      createAttempt({
        rows: [
          { ...createAttempt().rows[1], rowOrder: 1 },
          { ...createAttempt().rows[0], rowOrder: 2 },
        ],
      }),
    );
    const blankLf = check(
      createAttempt({
        rows: [
          { ...createAttempt().rows[0], lf: "" },
          { ...createAttempt().rows[1], lf: "" },
        ],
      }),
    );
    const narrationWarning = check(createAttempt({ narration: "Cash sale of goods." }));

    expect(reverseOrder.status).toBe("partially-correct");
    expect(reverseOrder.warnings).toEqual(
      expect.arrayContaining(["Your correct lines are in reverse visual order. Write the debit line before the credit line."]),
    );
    expect(blankLf.status).toBe("partially-correct");
    expect(blankLf.warnings.join(" ")).toContain("L.F. is blank");
    expect(narrationWarning.status).toBe("partially-correct");
    expect(narrationWarning.narrationResult.status).toBe("warning");
  });

  it("fails safely for unsupported question IDs", () => {
    const result = checkJournalEntryPracticeAttempt(
      createAttempt({ questionId: "unsupported-question" }),
      soldGoodsForCashAnswerKey,
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(["Unsupported Practice It Yourself question."]);
    expect(result.correctAnswerRevealAvailable).toBe(false);
  });

  it("fails safely for excessive row submissions", () => {
    const result = check(
      createAttempt({
        rows: Array.from({ length: JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows + 1 }, (_, index) => ({
          rowOrder: index + 1,
          particulars: index === 0 ? "Cash A/c Dr." : "To Sales A/c",
          lf: "J1",
          debitAmount: index === 0 ? "12000" : "",
          creditAmount: index === 0 ? "" : "12000",
        })),
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(
      expect.arrayContaining([`This preview accepts at most ${JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows} journal rows.`]),
    );
    expect(result.correctAnswerRevealAvailable).toBe(false);
  });

  it("fails safely for malformed attempt shapes", () => {
    const nullResult = checkJournalEntryPracticeAttempt(null, soldGoodsForCashAnswerKey);
    const missingRowsResult = checkJournalEntryPracticeAttempt(
      {
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "Being goods sold for cash.",
      },
      soldGoodsForCashAnswerKey,
    );
    const malformedRowResult = checkJournalEntryPracticeAttempt(
      {
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        rows: [{ rowOrder: "one", particulars: 123, lf: "", debitAmount: "12000", creditAmount: "" }],
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "Being goods sold for cash.",
      },
      soldGoodsForCashAnswerKey,
    );

    expect(nullResult.status).toBe("incorrect");
    expect(nullResult.errors).toEqual(["Unsupported Practice It Yourself question."]);
    expect(missingRowsResult.status).toBe("incorrect");
    expect(missingRowsResult.errors).toEqual(expect.arrayContaining(["Journal rows are missing or malformed."]));
    expect(malformedRowResult.status).toBe("incorrect");
    expect(malformedRowResult.errors).toEqual(expect.arrayContaining(["Row 1 has an invalid row order."]));
    expect(malformedRowResult.errors).toEqual(expect.arrayContaining(["Row 1 particulars are missing, malformed, or too long."]));
  });
});
