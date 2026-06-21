import { describe, expect, it } from "vitest";
import { checkJournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/journal-entry-checker";
import { JOURNAL_ENTRY_PRACTICE_LIMITS, type JournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/types";
import {
  boughtFurnitureForCashAnswerKey,
  getJournalEntryPracticeAnswerKey,
  getJournalEntryPracticeCorrectAnswerReveal,
  paidSalaryByBankAnswerKey,
  paidRentByCashAnswerKey,
  purchasedGoodsForCashAnswerKey,
  receivedCommissionInCashAnswerKey,
  soldGoodsForCashAnswerKey,
  startedBusinessWithCashAnswerKey,
  withdrewCashForPersonalUseAnswerKey,
} from "@/lib/learning-platform/chapters/journal-entry-answer-keys.server";
import {
  BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
  WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
} from "@/lib/learning-platform/chapters/journal-entries";

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

function createSalaryAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Salary A/c Dr.",
        lf: "J1",
        debitAmount: "8000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Bank A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "8000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "8000",
    totalCredit: "8000",
    narration: "Being salary paid by bank.",
    ...overrides,
  };
}

function checkSalary(attempt: JournalEntryPracticeAttempt = createSalaryAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, paidSalaryByBankAnswerKey);
}

function createPurchaseAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Purchases A/c Dr.",
        lf: "J1",
        debitAmount: "10000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Cash A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "10000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "10000",
    totalCredit: "10000",
    narration: "Being goods purchased for cash.",
    ...overrides,
  };
}

function checkPurchase(attempt: JournalEntryPracticeAttempt = createPurchaseAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, purchasedGoodsForCashAnswerKey);
}

function createCapitalAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Cash A/c Dr.",
        lf: "J1",
        debitAmount: "50000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Capital A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "50000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "50000",
    totalCredit: "50000",
    narration: "Being business started with cash as capital.",
    ...overrides,
  };
}

function checkCapital(attempt: JournalEntryPracticeAttempt = createCapitalAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, startedBusinessWithCashAnswerKey);
}

function createDrawingsAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Drawings A/c Dr.",
        lf: "J1",
        debitAmount: "5000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Cash A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "5000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "5000",
    totalCredit: "5000",
    narration: "Being cash withdrawn for personal use.",
    ...overrides,
  };
}

function checkDrawings(attempt: JournalEntryPracticeAttempt = createDrawingsAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, withdrewCashForPersonalUseAnswerKey);
}

function createRentAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Rent A/c Dr.",
        lf: "J1",
        debitAmount: "3000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Cash A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "3000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "3000",
    totalCredit: "3000",
    narration: "Being rent paid in cash.",
    ...overrides,
  };
}

function checkRent(attempt: JournalEntryPracticeAttempt = createRentAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, paidRentByCashAnswerKey);
}

function createCommissionAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Cash A/c Dr.",
        lf: "J1",
        debitAmount: "2000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Commission A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "2000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "2000",
    totalCredit: "2000",
    narration: "Being commission received in cash.",
    ...overrides,
  };
}

function checkCommission(attempt: JournalEntryPracticeAttempt = createCommissionAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, receivedCommissionInCashAnswerKey);
}

function createFurnitureAttempt(overrides: Partial<JournalEntryPracticeAttempt> = {}): JournalEntryPracticeAttempt {
  return {
    questionId: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
    rows: [
      {
        rowOrder: 1,
        particulars: "Furniture A/c Dr.",
        lf: "J1",
        debitAmount: "15000",
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: "To Cash A/c",
        lf: "J1",
        debitAmount: "",
        creditAmount: "15000",
      },
      {
        rowOrder: 3,
        particulars: "",
        lf: "",
        debitAmount: "",
        creditAmount: "",
      },
    ],
    totalDebit: "15000",
    totalCredit: "15000",
    narration: "Being furniture purchased for cash.",
    ...overrides,
  };
}

function checkFurniture(attempt: JournalEntryPracticeAttempt = createFurnitureAttempt()) {
  return checkJournalEntryPracticeAttempt(attempt, boughtFurnitureForCashAnswerKey);
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
    const overlongResult = checkJournalEntryPracticeAttempt(
      {
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        rows: [
          {
            rowOrder: 1,
            particulars: "x".repeat(JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength + 1),
            lf: "J1",
            debitAmount: "12000",
            creditAmount: "",
          },
        ],
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "x".repeat(JOURNAL_ENTRY_PRACTICE_LIMITS.maxNarrationLength + 1),
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
    expect(overlongResult.status).toBe("incorrect");
    expect(overlongResult.errors).toEqual(expect.arrayContaining(["Row 1 particulars are missing, malformed, or too long."]));
    expect(overlongResult.errors).toEqual(expect.arrayContaining(["Narration is missing, malformed, or too long."]));
    expect(overlongResult.correctAnswerRevealAvailable).toBe(false);
  });

  it("accepts the exact paid-salary-by-bank journal entry with totals and narration", () => {
    const result = checkSalary();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Salary is an expense and is correctly debited.",
        "Bank is correctly credited because money is paid through bank.",
        "Narration communicates that salary was paid by bank.",
        "Debit and credit totals are balanced.",
      ]),
    );
    expect(result.totalsResult).toMatchObject({
      status: "correct",
      enteredDebit: 8000,
      enteredCredit: 8000,
      rowDebitTotal: 8000,
      rowCreditTotal: 8000,
    });
  });

  it("accepts paid-salary-by-bank formatting and narration variants", () => {
    const result = checkSalary(
      createSalaryAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "  salary   dr ",
            lf: "",
            debitAmount: "₹8,000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "TO BANK",
            lf: "",
            debitAmount: "",
            creditAmount: "8,000",
          },
        ],
        totalDebit: "8000.00",
        totalCredit: "₹8,000.00",
        narration: "Salary paid through bank.",
      }),
    );

    expect(result.status).toBe("partially-correct");
    expect(result.errors).toEqual([]);
    expect(result.narrationResult.status).toBe("correct");
    expect(result.warnings.join(" ")).toContain("L.F. is blank");
  });

  it("rejects Cash instead of Bank for the paid-salary-by-bank question", () => {
    const result = checkSalary(
      createSalaryAttempt({
        rows: [
          createSalaryAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Cash A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "8000",
          },
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Cash A/c is not affected because the transaction states bank."]));
    expect(result.errors).toEqual(expect.arrayContaining(["To Bank A/c is missing."]));
  });

  it("rejects Rent instead of Salary for the paid-salary-by-bank question", () => {
    const result = checkSalary(
      createSalaryAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Rent A/c Dr.",
            lf: "J1",
            debitAmount: "8000",
            creditAmount: "",
          },
          createSalaryAttempt().rows[1],
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Rent A/c is a different expense and is not used here."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Salary A/c Dr. is missing."]));
  });

  it("rejects Salary credited and Bank debited for the paid-salary-by-bank question", () => {
    const salaryCredited = checkSalary(
      createSalaryAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "To Salary A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "8000",
          },
          createSalaryAttempt().rows[1],
        ],
      }),
    );
    const bankDebited = checkSalary(
      createSalaryAttempt({
        rows: [
          createSalaryAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "Bank A/c Dr.",
            lf: "J1",
            debitAmount: "8000",
            creditAmount: "",
          },
        ],
      }),
    );

    expect(salaryCredited.status).toBe("incorrect");
    expect(salaryCredited.errors).toEqual(expect.arrayContaining(["Add Dr. to Salary A/c."]));
    expect(salaryCredited.errors).toEqual(expect.arrayContaining(["Salary should not be placed in the credit column."]));
    expect(bankDebited.status).toBe("incorrect");
    expect(bankDebited.errors).toEqual(expect.arrayContaining(["Prefix the credited Bank A/c with To."]));
    expect(bankDebited.errors).toEqual(expect.arrayContaining(["Bank should not be placed in the debit column."]));
  });

  it("rejects wrong amount, incorrect totals, balanced wrong entries, missing markers, duplicate/extra rows, and unrelated narration for salary", () => {
    const wrongAmount = checkSalary(
      createSalaryAttempt({
        rows: [{ ...createSalaryAttempt().rows[0], debitAmount: "7000" }, createSalaryAttempt().rows[1]],
        totalDebit: "7000",
      }),
    );
    const wrongTotals = checkSalary(createSalaryAttempt({ totalDebit: "8000", totalCredit: "7000" }));
    const wrongButBalanced = checkSalary(
      createSalaryAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Cash A/c Dr.",
            lf: "J1",
            debitAmount: "8000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Sales A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "8000",
          },
        ],
        totalDebit: "8000",
        totalCredit: "8000",
      }),
    );
    const missingDr = checkSalary(
      createSalaryAttempt({ rows: [{ ...createSalaryAttempt().rows[0], particulars: "Salary A/c" }, createSalaryAttempt().rows[1]] }),
    );
    const missingTo = checkSalary(
      createSalaryAttempt({ rows: [createSalaryAttempt().rows[0], { ...createSalaryAttempt().rows[1], particulars: "Bank A/c" }] }),
    );
    const extraLine = checkSalary(
      createSalaryAttempt({
        rows: [
          createSalaryAttempt().rows[0],
          createSalaryAttempt().rows[1],
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
    const duplicateSalary = checkSalary(
      createSalaryAttempt({
        rows: [
          createSalaryAttempt().rows[0],
          { ...createSalaryAttempt().rows[0], rowOrder: 2 },
          createSalaryAttempt().rows[1],
        ],
      }),
    );
    const partialLine = checkSalary(
      createSalaryAttempt({
        rows: [
          createSalaryAttempt().rows[0],
          createSalaryAttempt().rows[1],
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
    const unrelatedNarration = checkSalary(createSalaryAttempt({ narration: "Being goods sold for cash." }));

    expect(wrongAmount.errors).toEqual(expect.arrayContaining(["Salary should be debited with ₹8,000."]));
    expect(wrongAmount.errors).toEqual(expect.arrayContaining(["Total Debit should be ₹8,000."]));
    expect(wrongTotals.errors).toEqual(expect.arrayContaining(["Total Credit should be ₹8,000."]));
    expect(wrongTotals.errors).toEqual(expect.arrayContaining(["Entered totals should match the amounts written in the journal rows."]));
    expect(wrongButBalanced.status).toBe("incorrect");
    expect(wrongButBalanced.balanceResult.status).toBe("correct");
    expect(wrongButBalanced.errors).toEqual(expect.arrayContaining(["Cash A/c is not affected because the transaction states bank."]));
    expect(missingDr.errors).toEqual(expect.arrayContaining(["Add Dr. to Salary A/c."]));
    expect(missingTo.errors).toEqual(expect.arrayContaining(["Prefix the credited Bank A/c with To."]));
    expect(extraLine.errors).toEqual(expect.arrayContaining(["Row 3 is an extra non-empty line."]));
    expect(duplicateSalary.errors).toEqual(expect.arrayContaining(["Salary A/c Dr. appears more than once."]));
    expect(partialLine.errors).toEqual(expect.arrayContaining(["Row 3 is partly filled. Add particulars or clear the row."]));
    expect(unrelatedNarration.status).toBe("incorrect");
    expect(unrelatedNarration.narrationResult.message).toBe("Narration should explain that salary was paid by bank.");
  });

  it("fails safely for blank salary attempts and unsupported question IDs", () => {
    const blankSalary = checkSalary(
      createSalaryAttempt({
        rows: [
          { rowOrder: 1, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
          { rowOrder: 2, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
        ],
        totalDebit: "",
        totalCredit: "",
        narration: "",
      }),
    );
    const unsupported = checkJournalEntryPracticeAttempt(createSalaryAttempt({ questionId: "unknown-question" }), null);

    expect(blankSalary.status).toBe("incorrect");
    expect(blankSalary.errors).toEqual(["The answer is blank."]);
    expect(blankSalary.correctAnswerRevealAvailable).toBe(false);
    expect(unsupported.status).toBe("incorrect");
    expect(unsupported.correctAnswerRevealAvailable).toBe(false);
  });

  it("accepts the exact cash-purchase journal entry with totals and narration", () => {
    const result = checkPurchase();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Purchases is correctly debited because goods are bought for resale.",
        "Cash is correctly credited because cash leaves the business.",
        "Narration communicates that goods were purchased for cash.",
        "Debit and credit totals are balanced.",
      ]),
    );
    expect(result.totalsResult).toMatchObject({
      status: "correct",
      enteredDebit: 10000,
      enteredCredit: 10000,
      rowDebitTotal: 10000,
      rowCreditTotal: 10000,
    });
  });

  it("accepts harmless cash-purchase formatting differences with a presentation warning when L.F. is blank", () => {
    const result = checkPurchase(
      createPurchaseAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "purchase dr",
            lf: "",
            debitAmount: "₹10,000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "TO CASH A/C",
            lf: "",
            debitAmount: "",
            creditAmount: "10,000",
          },
        ],
        totalDebit: "₹10,000.00",
        totalCredit: "10,000.00",
        narration: "Goods purchased for cash.",
      }),
    );

    expect(result.status).toBe("partially-correct");
    expect(result.errors).toEqual([]);
    expect(result.warnings.join(" ")).toContain("L.F. is blank");
  });

  it("rejects debit-credit reversal for the cash-purchase checker", () => {
    const result = checkPurchase(
      createPurchaseAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Cash A/c Dr.",
            lf: "J1",
            debitAmount: "10000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Purchases A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "10000",
          },
        ],
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Cash A/c needs To because Cash is credited."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the debit column."]));
    expect(result.errors).toEqual(expect.arrayContaining(["The Purchases debit line should not start with To."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Purchases should not be placed in the credit column."]));
  });

  it("rejects Goods or Assets instead of Purchases for the cash-purchase checker", () => {
    const goodsResult = checkPurchase(
      createPurchaseAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Goods A/c Dr.",
            lf: "J1",
            debitAmount: "10000",
            creditAmount: "",
          },
          createPurchaseAttempt().rows[1],
        ],
      }),
    );
    const assetsResult = checkPurchase(
      createPurchaseAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Assets A/c Dr.",
            lf: "J1",
            debitAmount: "10000",
            creditAmount: "",
          },
          createPurchaseAttempt().rows[1],
        ],
      }),
    );

    expect(goodsResult.status).toBe("incorrect");
    expect(goodsResult.errors).toEqual(
      expect.arrayContaining(["Goods A/c is not used here because goods bought for resale are recorded through Purchases A/c."]),
    );
    expect(goodsResult.errors).toEqual(expect.arrayContaining(["Purchases A/c Dr. is missing."]));
    expect(assetsResult.status).toBe("incorrect");
    expect(assetsResult.errors).toEqual(
      expect.arrayContaining(["Assets A/c is too generic and is not used for goods bought for resale."]),
    );
    expect(assetsResult.errors).toEqual(expect.arrayContaining(["Purchases A/c Dr. is missing."]));
  });

  it("rejects Bank or a supplier account instead of Cash for the cash-purchase checker", () => {
    const bankResult = checkPurchase(
      createPurchaseAttempt({
        rows: [
          createPurchaseAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Bank A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "10000",
          },
        ],
      }),
    );
    const supplierResult = checkPurchase(
      createPurchaseAttempt({
        rows: [
          createPurchaseAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Supplier A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "10000",
          },
        ],
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction states cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["To Cash A/c is missing."]));
    expect(supplierResult.status).toBe("incorrect");
    expect(supplierResult.errors).toEqual(
      expect.arrayContaining(["Supplier A/c is not used because the transaction says cash, not credit."]),
    );
    expect(supplierResult.errors).toEqual(expect.arrayContaining(["To Cash A/c is missing."]));
  });

  it("rejects wrong amounts for the cash-purchase checker even when the entry balances", () => {
    const result = checkPurchase(
      createPurchaseAttempt({
        rows: [
          { ...createPurchaseAttempt().rows[0], debitAmount: "9000" },
          { ...createPurchaseAttempt().rows[1], creditAmount: "9000" },
        ],
        totalDebit: "9000",
        totalCredit: "9000",
      }),
    );

    expect(result.status).toBe("incorrect");
    expect(result.errors).toEqual(expect.arrayContaining(["Purchases should be debited with ₹10,000."]));
    expect(result.errors).toEqual(expect.arrayContaining(["Cash should be credited with ₹10,000."]));
    expect(result.balanceResult.message).toBe(
      "The entry balances, but it does not balance at the correct ₹10,000 amount.",
    );
  });

  it("accepts the exact cash-capital journal entry with totals and narration", () => {
    const result = checkCapital();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Cash is correctly debited because cash comes into the business.",
        "Capital is correctly credited because the owner's claim increases.",
        "Narration communicates that business started with cash capital.",
        "Debit and credit totals are balanced.",
      ]),
    );
    expect(result.totalsResult).toMatchObject({
      status: "correct",
      enteredDebit: 50000,
      enteredCredit: 50000,
      rowDebitTotal: 50000,
      rowCreditTotal: 50000,
    });
  });

  it("rejects reversal and wrong credit accounts for the cash-capital checker", () => {
    const reversedResult = checkCapital(
      createCapitalAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Capital A/c Dr.",
            lf: "J1",
            debitAmount: "50000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Cash A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "50000",
          },
        ],
      }),
    );
    const salesResult = checkCapital(
      createCapitalAttempt({
        rows: [
          createCapitalAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Sales A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "50000",
          },
        ],
      }),
    );
    const incomeResult = checkCapital(
      createCapitalAttempt({
        rows: [
          createCapitalAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Income A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "50000",
          },
        ],
      }),
    );

    expect(reversedResult.status).toBe("incorrect");
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Capital should not be placed in the debit column."]));
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the credit column."]));
    expect(salesResult.status).toBe("incorrect");
    expect(salesResult.errors).toEqual(
      expect.arrayContaining(["Sales A/c is not used because capital is not income from goods sold."]),
    );
    expect(salesResult.errors).toEqual(expect.arrayContaining(["To Capital A/c is missing."]));
    expect(incomeResult.status).toBe("incorrect");
    expect(incomeResult.errors).toEqual(
      expect.arrayContaining(["Income A/c is not used because capital is not business income."]),
    );
    expect(incomeResult.errors).toEqual(expect.arrayContaining(["To Capital A/c is missing."]));
  });

  it("rejects Bank and wrong amounts for the cash-capital checker", () => {
    const bankResult = checkCapital(
      createCapitalAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Bank A/c Dr.",
            lf: "J1",
            debitAmount: "50000",
            creditAmount: "",
          },
          createCapitalAttempt().rows[1],
        ],
      }),
    );
    const wrongAmountResult = checkCapital(
      createCapitalAttempt({
        rows: [
          { ...createCapitalAttempt().rows[0], debitAmount: "40000" },
          { ...createCapitalAttempt().rows[1], creditAmount: "40000" },
        ],
        totalDebit: "40000",
        totalCredit: "40000",
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction says cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Cash A/c Dr. is missing."]));
    expect(wrongAmountResult.status).toBe("incorrect");
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Cash should be debited with ₹50,000."]));
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Capital should be credited with ₹50,000."]));
    expect(wrongAmountResult.balanceResult.message).toBe(
      "The entry balances, but it does not balance at the correct ₹50,000 amount.",
    );
  });

  it("accepts the exact cash-drawings journal entry with totals and narration", () => {
    const result = checkDrawings();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Drawings is correctly debited because the owner takes cash for personal use.",
        "Cash is correctly credited because cash leaves the business.",
        "Narration communicates that cash was withdrawn for personal use.",
        "Debit and credit totals are balanced.",
      ]),
    );
    expect(result.totalsResult).toMatchObject({
      status: "correct",
      enteredDebit: 5000,
      enteredCredit: 5000,
      rowDebitTotal: 5000,
      rowCreditTotal: 5000,
    });
  });

  it("rejects reversal and wrong debit accounts for the cash-drawings checker", () => {
    const reversedResult = checkDrawings(
      createDrawingsAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Cash A/c Dr.",
            lf: "J1",
            debitAmount: "5000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Drawings A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "5000",
          },
        ],
      }),
    );
    const salaryResult = checkDrawings(
      createDrawingsAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Salary A/c Dr.",
            lf: "J1",
            debitAmount: "5000",
            creditAmount: "",
          },
          createDrawingsAttempt().rows[1],
        ],
      }),
    );
    const rentResult = checkDrawings(
      createDrawingsAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Rent A/c Dr.",
            lf: "J1",
            debitAmount: "5000",
            creditAmount: "",
          },
          createDrawingsAttempt().rows[1],
        ],
      }),
    );

    expect(reversedResult.status).toBe("incorrect");
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the debit column."]));
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Drawings should not be placed in the credit column."]));
    expect(salaryResult.status).toBe("incorrect");
    expect(salaryResult.errors).toEqual(
      expect.arrayContaining(["Salary A/c is a business expense and is not used for personal withdrawal."]),
    );
    expect(salaryResult.errors).toEqual(expect.arrayContaining(["Drawings A/c Dr. is missing."]));
    expect(rentResult.status).toBe("incorrect");
    expect(rentResult.errors).toEqual(
      expect.arrayContaining(["Rent A/c is a business expense and is not used for personal withdrawal."]),
    );
    expect(rentResult.errors).toEqual(expect.arrayContaining(["Drawings A/c Dr. is missing."]));
  });

  it("rejects Bank and wrong amounts for the cash-drawings checker", () => {
    const bankResult = checkDrawings(
      createDrawingsAttempt({
        rows: [
          createDrawingsAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Bank A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "5000",
          },
        ],
      }),
    );
    const wrongAmountResult = checkDrawings(
      createDrawingsAttempt({
        rows: [
          { ...createDrawingsAttempt().rows[0], debitAmount: "4000" },
          { ...createDrawingsAttempt().rows[1], creditAmount: "4000" },
        ],
        totalDebit: "4000",
        totalCredit: "4000",
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction says cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["To Cash A/c is missing."]));
    expect(wrongAmountResult.status).toBe("incorrect");
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Drawings should be debited with ₹5,000."]));
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Cash should be credited with ₹5,000."]));
    expect(wrongAmountResult.balanceResult.message).toBe(
      "The entry balances, but it does not balance at the correct ₹5,000 amount.",
    );
  });

  it("accepts the exact rent-paid-by-cash journal entry with totals and narration", () => {
    const result = checkRent();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Rent is correctly debited because rent is a business expense.",
        "Cash is correctly credited because cash leaves the business.",
        "Narration communicates that rent was paid in cash.",
        "Debit and credit totals are balanced.",
      ]),
    );
  });

  it("rejects reversal and wrong debit accounts for the rent-paid-by-cash checker", () => {
    const reversedResult = checkRent(
      createRentAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Cash A/c Dr.",
            lf: "J1",
            debitAmount: "3000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Rent A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "3000",
          },
        ],
      }),
    );
    const drawingsResult = checkRent(
      createRentAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Drawings A/c Dr.",
            lf: "J1",
            debitAmount: "3000",
            creditAmount: "",
          },
          createRentAttempt().rows[1],
        ],
      }),
    );
    const salaryResult = checkRent(
      createRentAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Salary A/c Dr.",
            lf: "J1",
            debitAmount: "3000",
            creditAmount: "",
          },
          createRentAttempt().rows[1],
        ],
      }),
    );

    expect(reversedResult.status).toBe("incorrect");
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the debit column."]));
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Rent should not be placed in the credit column."]));
    expect(drawingsResult.errors).toEqual(
      expect.arrayContaining(["Drawings A/c is not used because rent is a business expense."]),
    );
    expect(drawingsResult.errors).toEqual(expect.arrayContaining(["Rent A/c Dr. is missing."]));
    expect(salaryResult.errors).toEqual(expect.arrayContaining(["Salary A/c is a different expense and is not used here."]));
    expect(salaryResult.errors).toEqual(expect.arrayContaining(["Rent A/c Dr. is missing."]));
  });

  it("rejects Bank and wrong amounts for the rent-paid-by-cash checker", () => {
    const bankResult = checkRent(
      createRentAttempt({
        rows: [
          createRentAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Bank A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "3000",
          },
        ],
      }),
    );
    const wrongAmountResult = checkRent(
      createRentAttempt({
        rows: [
          { ...createRentAttempt().rows[0], debitAmount: "2500" },
          { ...createRentAttempt().rows[1], creditAmount: "2500" },
        ],
        totalDebit: "2500",
        totalCredit: "2500",
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction says cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["To Cash A/c is missing."]));
    expect(wrongAmountResult.status).toBe("incorrect");
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Rent should be debited with ₹3,000."]));
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Cash should be credited with ₹3,000."]));
  });

  it("accepts the exact commission-received-in-cash journal entry with totals and narration", () => {
    const result = checkCommission();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Cash is correctly debited because cash is received.",
        "Commission is correctly credited because commission income increases.",
        "Narration communicates that commission was received in cash.",
        "Debit and credit totals are balanced.",
      ]),
    );
  });

  it("rejects reversal and wrong credit accounts for the commission-received-in-cash checker", () => {
    const reversedResult = checkCommission(
      createCommissionAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Commission A/c Dr.",
            lf: "J1",
            debitAmount: "2000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Cash A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "2000",
          },
        ],
      }),
    );
    const capitalResult = checkCommission(
      createCommissionAttempt({
        rows: [
          createCommissionAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Capital A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "2000",
          },
        ],
      }),
    );
    const salesResult = checkCommission(
      createCommissionAttempt({
        rows: [
          createCommissionAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Sales A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "2000",
          },
        ],
      }),
    );

    expect(reversedResult.status).toBe("incorrect");
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Commission should not be placed in the debit column."]));
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the credit column."]));
    expect(capitalResult.errors).toEqual(
      expect.arrayContaining(["Capital A/c is not used because commission received is business income, not owner capital."]),
    );
    expect(capitalResult.errors).toEqual(expect.arrayContaining(["To Commission A/c is missing."]));
    expect(salesResult.errors).toEqual(
      expect.arrayContaining(["Sales A/c is not used because the transaction says commission, not goods sold."]),
    );
    expect(salesResult.errors).toEqual(expect.arrayContaining(["To Commission A/c is missing."]));
  });

  it("rejects Bank and wrong amounts for the commission-received-in-cash checker", () => {
    const bankResult = checkCommission(
      createCommissionAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Bank A/c Dr.",
            lf: "J1",
            debitAmount: "2000",
            creditAmount: "",
          },
          createCommissionAttempt().rows[1],
        ],
      }),
    );
    const wrongAmountResult = checkCommission(
      createCommissionAttempt({
        rows: [
          { ...createCommissionAttempt().rows[0], debitAmount: "1500" },
          { ...createCommissionAttempt().rows[1], creditAmount: "1500" },
        ],
        totalDebit: "1500",
        totalCredit: "1500",
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction says cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Cash A/c Dr. is missing."]));
    expect(wrongAmountResult.status).toBe("incorrect");
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Cash should be debited with ₹2,000."]));
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Commission should be credited with ₹2,000."]));
  });

  it("accepts the exact furniture-bought-for-cash journal entry with totals and narration", () => {
    const result = checkFurniture();

    expect(result.status).toBe("correct");
    expect(result.errors).toEqual([]);
    expect(result.gotRight).toEqual(
      expect.arrayContaining([
        "Furniture is correctly debited because a business asset increases.",
        "Cash is correctly credited because cash leaves the business.",
        "Narration communicates that furniture was purchased for cash.",
        "Debit and credit totals are balanced.",
      ]),
    );
  });

  it("rejects reversal and wrong debit accounts for the furniture-bought-for-cash checker", () => {
    const reversedResult = checkFurniture(
      createFurnitureAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Cash A/c Dr.",
            lf: "J1",
            debitAmount: "15000",
            creditAmount: "",
          },
          {
            rowOrder: 2,
            particulars: "To Furniture A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "15000",
          },
        ],
      }),
    );
    const purchasesResult = checkFurniture(
      createFurnitureAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Purchases A/c Dr.",
            lf: "J1",
            debitAmount: "15000",
            creditAmount: "",
          },
          createFurnitureAttempt().rows[1],
        ],
      }),
    );
    const goodsResult = checkFurniture(
      createFurnitureAttempt({
        rows: [
          {
            rowOrder: 1,
            particulars: "Goods A/c Dr.",
            lf: "J1",
            debitAmount: "15000",
            creditAmount: "",
          },
          createFurnitureAttempt().rows[1],
        ],
      }),
    );

    expect(reversedResult.status).toBe("incorrect");
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Cash should not be placed in the debit column."]));
    expect(reversedResult.errors).toEqual(expect.arrayContaining(["Furniture should not be placed in the credit column."]));
    expect(purchasesResult.errors).toEqual(
      expect.arrayContaining(["Purchases A/c is not used because furniture is an asset for business use."]),
    );
    expect(purchasesResult.errors).toEqual(expect.arrayContaining(["Furniture A/c Dr. is missing."]));
    expect(goodsResult.errors).toEqual(expect.arrayContaining(["Goods A/c is not used because furniture is a business asset here."]));
    expect(goodsResult.errors).toEqual(expect.arrayContaining(["Furniture A/c Dr. is missing."]));
  });

  it("rejects Bank and wrong amounts for the furniture-bought-for-cash checker", () => {
    const bankResult = checkFurniture(
      createFurnitureAttempt({
        rows: [
          createFurnitureAttempt().rows[0],
          {
            rowOrder: 2,
            particulars: "To Bank A/c",
            lf: "J1",
            debitAmount: "",
            creditAmount: "15000",
          },
        ],
      }),
    );
    const wrongAmountResult = checkFurniture(
      createFurnitureAttempt({
        rows: [
          { ...createFurnitureAttempt().rows[0], debitAmount: "12000" },
          { ...createFurnitureAttempt().rows[1], creditAmount: "12000" },
        ],
        totalDebit: "12000",
        totalCredit: "12000",
      }),
    );

    expect(bankResult.status).toBe("incorrect");
    expect(bankResult.errors).toEqual(expect.arrayContaining(["Bank A/c is not used because the transaction says cash."]));
    expect(bankResult.errors).toEqual(expect.arrayContaining(["To Cash A/c is missing."]));
    expect(wrongAmountResult.status).toBe("incorrect");
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Furniture should be debited with ₹15,000."]));
    expect(wrongAmountResult.errors).toEqual(expect.arrayContaining(["Cash should be credited with ₹15,000."]));
  });

  it("keeps answer-key lookup and correct-answer reveal isolated by question ID", () => {
    const cashReveal = getJournalEntryPracticeCorrectAnswerReveal(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    const salaryReveal = getJournalEntryPracticeCorrectAnswerReveal(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    const purchaseReveal = getJournalEntryPracticeCorrectAnswerReveal(PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    const capitalReveal = getJournalEntryPracticeCorrectAnswerReveal(STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID);
    const drawingsReveal = getJournalEntryPracticeCorrectAnswerReveal(WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID);
    const rentReveal = getJournalEntryPracticeCorrectAnswerReveal(PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID);
    const commissionReveal = getJournalEntryPracticeCorrectAnswerReveal(RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID);
    const furnitureReveal = getJournalEntryPracticeCorrectAnswerReveal(BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID);
    const unknownReveal = getJournalEntryPracticeCorrectAnswerReveal("unknown-question");

    expect(getJournalEntryPracticeAnswerKey(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID)).toBe(soldGoodsForCashAnswerKey);
    expect(getJournalEntryPracticeAnswerKey(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID)).toBe(paidSalaryByBankAnswerKey);
    expect(getJournalEntryPracticeAnswerKey(PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID)).toBe(purchasedGoodsForCashAnswerKey);
    expect(getJournalEntryPracticeAnswerKey(STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID)).toBe(startedBusinessWithCashAnswerKey);
    expect(getJournalEntryPracticeAnswerKey(WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID)).toBe(
      withdrewCashForPersonalUseAnswerKey,
    );
    expect(getJournalEntryPracticeAnswerKey(PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID)).toBe(paidRentByCashAnswerKey);
    expect(getJournalEntryPracticeAnswerKey(RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID)).toBe(
      receivedCommissionInCashAnswerKey,
    );
    expect(getJournalEntryPracticeAnswerKey(BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID)).toBe(
      boughtFurnitureForCashAnswerKey,
    );
    expect(getJournalEntryPracticeAnswerKey("unknown-question")).toBeNull();
    expect(cashReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Sales A/c"]);
    expect(cashReveal.lines.map((line) => `${line.debitAmount ?? ""}${line.creditAmount ?? ""}`).join(" ")).not.toContain("₹8,000");
    expect(salaryReveal.lines.map((line) => line.particulars)).toEqual(["Salary A/c Dr.", "To Bank A/c"]);
    expect(salaryReveal.lines.map((line) => `${line.debitAmount ?? ""}${line.creditAmount ?? ""}`).join(" ")).not.toContain("₹12,000");
    expect(salaryReveal.narration).toBe("Being salary paid by bank.");
    expect(purchaseReveal.lines.map((line) => line.particulars)).toEqual(["Purchases A/c Dr.", "To Cash A/c"]);
    expect(purchaseReveal.narration).toBe("Being goods purchased for cash.");
    expect(capitalReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Capital A/c"]);
    expect(capitalReveal.narration).toBe("Being business started with cash as capital.");
    expect(drawingsReveal.lines.map((line) => line.particulars)).toEqual(["Drawings A/c Dr.", "To Cash A/c"]);
    expect(drawingsReveal.narration).toBe("Being cash withdrawn for personal use.");
    expect(rentReveal.lines.map((line) => line.particulars)).toEqual(["Rent A/c Dr.", "To Cash A/c"]);
    expect(rentReveal.narration).toBe("Being rent paid in cash.");
    expect(commissionReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Commission A/c"]);
    expect(commissionReveal.narration).toBe("Being commission received in cash.");
    expect(furnitureReveal.lines.map((line) => line.particulars)).toEqual(["Furniture A/c Dr.", "To Cash A/c"]);
    expect(furnitureReveal.narration).toBe("Being furniture purchased for cash.");
    expect(unknownReveal.available).toBe(false);
  });
});
