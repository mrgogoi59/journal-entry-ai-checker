import { describe, expect, it } from "vitest";
import { validateEntry } from "@/lib/entry-validator";
import { parseJournalEntry } from "@/lib/journal-parser";

const cashCapitalExpected = {
  debits: [{ account: "Cash", amount: 50000 }],
  credits: [{ account: "Capital", amount: 50000 }],
};

function validate(entry: string) {
  return validateEntry(parseJournalEntry(entry), cashCapitalExpected);
}

describe("validateEntry mistake diagnosis", () => {
  it("identifies a correct entry", () => {
    expect(validate("Cash A/c Dr. ₹50,000\nTo Capital A/c ₹50,000")).toMatchObject({
      mistake_type: "correct",
      correctAccounts: true,
      correctSides: true,
      correctAmount: true,
      isBalanced: true,
    });
  });

  it("identifies reversed debit and credit sides", () => {
    expect(validate("Capital A/c Dr. ₹50,000\nTo Cash A/c ₹50,000")).toMatchObject({
      mistake_type: "reversed_sides",
      correctAccounts: true,
      correctSides: false,
      correctAmount: true,
      isBalanced: true,
    });
  });

  it("identifies a wrong account", () => {
    expect(validate("Cash Dr 50000\nSales Cr 50000")).toMatchObject({
      mistake_type: "wrong_account",
      correctAccounts: false,
      correctAmount: true,
      isBalanced: true,
    });
  });

  it("identifies a wrong amount", () => {
    expect(validate("Cash Dr 40000\nCapital Cr 40000")).toMatchObject({
      mistake_type: "amount_mismatch",
      correctAccounts: true,
      correctSides: true,
      correctAmount: false,
      isBalanced: true,
    });
  });

  it("identifies a missing debit account", () => {
    expect(validate("Capital Cr 50000")).toMatchObject({
      mistake_type: "missing_account",
      correctAccounts: false,
      correctSides: false,
      isBalanced: false,
    });
  });

  it("identifies a missing credit account", () => {
    expect(validate("Cash Dr 50000")).toMatchObject({
      mistake_type: "missing_account",
      correctAccounts: false,
      correctSides: false,
      isBalanced: false,
    });
  });

  it("identifies an unbalanced entry with otherwise correct expected lines", () => {
    expect(validate("Cash Dr 50000\nCapital Cr 50000\nBank Cr 10000")).toMatchObject({
      mistake_type: "unbalanced_entry",
      correctAccounts: true,
      correctSides: true,
      correctAmount: true,
      isBalanced: false,
    });
  });

  it("identifies invalid format", () => {
    expect(validate("Cash 50000\nCapital 50000")).toMatchObject({
      mistake_type: "format_error",
      correctAccounts: false,
      correctSides: false,
      correctAmount: false,
      isBalanced: false,
    });
  });

  it("accepts fuzzy corrected account spelling", () => {
    expect(validate("Cash Dr 50000\nCapitol Cr 50000")).toMatchObject({
      mistake_type: "correct",
      correctAccounts: true,
    });
  });
});

describe("validateEntry across transaction account pairs", () => {
  it.each([
    ["Purchases Dr 12000\nCash Cr 12000", "Purchases", "Cash", 12000],
    ["Purchase A/c Dr. Rs.5000\nTo Cash A/c Rs.5000", "Purchases", "Cash", 5000],
    ["Purchase Account Dr 5000\nCash Account Cr 5000", "Purchases", "Cash", 5000],
    ["Purchases A/c Dr 5000\nCash A/c Cr 5000", "Purchases", "Cash", 5000],
    ["Purchases Account Dr 5000\nCash Account Cr 5000", "Purchases", "Cash", 5000],
    ["Purchases Dr 18000\nCreditor Cr 18000", "Purchases", "Creditor", 18000],
    ["Cash Dr 25000\nSales Cr 25000", "Cash", "Sales", 25000],
    ["Debtor Dr 35000\nSales Cr 35000", "Debtor", "Sales", 35000],
    ["Rent Dr 5000\nCash Cr 5000", "Rent Expense", "Cash", 5000],
    ["Salary Dr 6000\nCash Cr 6000", "Salary Expense", "Cash", 6000],
    ["Cash Dr 7000\nCommission Cr 7000", "Cash", "Commission Income", 7000],
    ["Furniture Dr 12500\nCash Cr 12500", "Furniture", "Cash", 12500],
    ["Machinery Dr 45000\nBank Cr 45000", "Machinery", "Bank", 45000],
    ["Bank Dr 10000\nCash Cr 10000", "Bank", "Cash", 10000],
    ["Cash Dr 8000\nBank Cr 8000", "Cash", "Bank", 8000],
    ["Drawings Dr 3000\nCash Cr 3000", "Drawings", "Cash", 3000],
    ["Creditor Dr 11000\nCash Cr 11000", "Creditor", "Cash", 11000],
    ["Cash Dr 13000\nDebtor Cr 13000", "Cash", "Debtor", 13000],
    ["Bank Dr 100000\nLoan Cr 100000", "Bank", "Loan", 100000],
    ["Interest Dr 2000\nCash Cr 2000", "Interest Expense", "Cash", 2000],
    ["Cash Dr 1500\nInterest Cr 1500", "Cash", "Interest Income", 1500],
    ["Electricity Bill Dr 4500\nCash Cr 4500", "Electricity Expense", "Cash", 4500],
  ])("validates correct entry for %s", (entry, debitAccount, creditAccount, amount) => {
    const parsed = parseJournalEntry(entry);
    const validation = validateEntry(parsed, {
      debits: [{ account: debitAccount, amount }],
      credits: [{ account: creditAccount, amount }],
    });

    expect(validation.mistake_type).toBe("correct");
    expect(validation.correctAccounts).toBe(true);
    expect(validation.correctSides).toBe(true);
    expect(validation.correctAmount).toBe(true);
    expect(validation.isBalanced).toBe(true);
  });
});
