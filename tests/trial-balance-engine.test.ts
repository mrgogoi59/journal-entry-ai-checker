import { describe, expect, it } from "vitest";
import { generateTrialBalance, type TrialBalanceRow } from "@/lib/trial-balance-engine";

describe("generateTrialBalance", () => {
  it("prepares trial balance from multiple simple journal entries", () => {
    const result = generateTrialBalance(`Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`);

    expect(result.status).toBe("success");
    expect(row(result.rows, "Cash")).toEqual({ account: "Cash", debit: 37000, credit: 0 });
    expect(row(result.rows, "Purchases")).toEqual({ account: "Purchases", debit: 10000, credit: 0 });
    expect(row(result.rows, "Rent")).toEqual({ account: "Rent", debit: 3000, credit: 0 });
    expect(row(result.rows, "Capital")).toEqual({ account: "Capital", debit: 0, credit: 50000 });
    expect(result.debitTotal).toBe(50000);
    expect(result.creditTotal).toBe(50000);
    expect(result.agrees).toBe(true);
    expect(result.difference).toBe(0);
  });

  it("prepares trial balance from compound GST purchase", () => {
    const result = generateTrialBalance(`Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
Input GST A/c Dr. Rs.1800
To Cash A/c Rs.11800`);

    expect(result.status).toBe("success");
    expect(row(result.rows, "Cash")).toEqual({ account: "Cash", debit: 38200, credit: 0 });
    expect(row(result.rows, "Purchases")).toEqual({ account: "Purchases", debit: 10000, credit: 0 });
    expect(row(result.rows, "Input GST")).toEqual({ account: "Input GST", debit: 1800, credit: 0 });
    expect(row(result.rows, "Capital")).toEqual({ account: "Capital", debit: 0, credit: 50000 });
    expect(result.debitTotal).toBe(50000);
    expect(result.creditTotal).toBe(50000);
    expect(result.agrees).toBe(true);
  });

  it("prepares trial balance from discount allowed compound entry", () => {
    const result = generateTrialBalance(`Cash A/c Dr. Rs.9500
Discount Allowed A/c Dr. Rs.500
To Mohan A/c Rs.10000`);

    expect(result.status).toBe("success");
    expect(row(result.rows, "Cash")).toEqual({ account: "Cash", debit: 9500, credit: 0 });
    expect(row(result.rows, "Discount Allowed")).toEqual({
      account: "Discount Allowed",
      debit: 500,
      credit: 0,
    });
    expect(row(result.rows, "Mohan")).toEqual({ account: "Mohan", debit: 0, credit: 10000 });
    expect(result.debitTotal).toBe(10000);
    expect(result.creditTotal).toBe(10000);
    expect(result.agrees).toBe(true);
  });

  it("returns invalid for an unbalanced entry", () => {
    const result = generateTrialBalance("Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.9000");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("Debit and credit totals do not match in entry number 1.");
  });

  it("returns invalid for missing To line", () => {
    const result = generateTrialBalance("Purchases A/c Dr. Rs.10000\nCash A/c Rs.10000");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("I could not read the journal entry format");
  });

  it("returns invalid for more than 10 journal entries", () => {
    const entries = Array.from(
      { length: 11 },
      () => "Cash A/c Dr. Rs.1000\nTo Capital A/c Rs.1000",
    ).join("\n\n");

    const result = generateTrialBalance(entries);

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("For this beta version, please enter up to 10 journal entries at a time.");
  });

  it("excludes balanced ledger accounts from trial balance rows", () => {
    const result = generateTrialBalance(`Cash A/c Dr. Rs.10000
To Capital A/c Rs.10000

Capital A/c Dr. Rs.10000
To Cash A/c Rs.10000`);

    expect(result.status).toBe("success");
    expect(result.rows).toEqual([]);
    expect(result.debitTotal).toBe(0);
    expect(result.creditTotal).toBe(0);
    expect(result.agrees).toBe(true);
  });
});

function row(rows: TrialBalanceRow[], account: string): TrialBalanceRow {
  const found = rows.find((trialBalanceRow) => trialBalanceRow.account === account);
  expect(found).toBeDefined();
  return found!;
}
