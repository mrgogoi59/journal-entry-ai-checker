import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerAccount } from "@/lib/ledger-engine";

describe("generateLedger", () => {
  it("posts a simple purchase entry to Purchases and Cash ledgers", () => {
    const result = generateLedger("Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000");

    expect(result.status).toBe("success");
    const purchases = account(result.ledgerAccounts, "Purchases");
    const cash = account(result.ledgerAccounts, "Cash");

    expect(purchases.debitPostings[0]).toMatchObject({
      reference: "To Cash A/c",
      amount: 10000,
      sourceEntryIndex: 1,
    });
    expect(cash.creditPostings[0]).toMatchObject({
      reference: "By Purchases A/c",
      amount: 10000,
      sourceEntryIndex: 1,
    });
    expect(purchases.balanceSide).toBe("debit");
    expect(purchases.balanceAmount).toBe(10000);
    expect(cash.balanceSide).toBe("credit");
    expect(cash.balanceAmount).toBe(10000);
  });

  it("posts capital introduced entry to Cash and Capital ledgers", () => {
    const result = generateLedger("Cash A/c Dr. Rs.50000\nTo Capital A/c Rs.50000");

    expect(result.status).toBe("success");
    expect(account(result.ledgerAccounts, "Cash").debitPostings[0]).toMatchObject({
      reference: "To Capital A/c",
      amount: 50000,
    });
    expect(account(result.ledgerAccounts, "Capital").creditPostings[0]).toMatchObject({
      reference: "By Cash A/c",
      amount: 50000,
    });
  });

  it("calculates Cash ledger balance across multiple entries", () => {
    const result = generateLedger(`Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`);

    expect(result.status).toBe("success");
    const cash = account(result.ledgerAccounts, "Cash");

    expect(cash.debitTotal).toBe(50000);
    expect(cash.creditTotal).toBe(13000);
    expect(cash.balanceSide).toBe("debit");
    expect(cash.balanceAmount).toBe(37000);
  });

  it("posts compound GST purchase with separate Cash credit-side postings", () => {
    const result = generateLedger(`Purchases A/c Dr. Rs.10000
Input GST A/c Dr. Rs.1800
To Cash A/c Rs.11800`);

    expect(result.status).toBe("success");
    expect(account(result.ledgerAccounts, "Purchases").debitPostings[0]).toMatchObject({
      reference: "To Cash A/c",
      amount: 10000,
    });
    expect(account(result.ledgerAccounts, "Input GST").debitPostings[0]).toMatchObject({
      reference: "To Cash A/c",
      amount: 1800,
    });
    expect(account(result.ledgerAccounts, "Cash").creditPostings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reference: "By Purchases A/c", amount: 10000 }),
        expect.objectContaining({ reference: "By Input GST A/c", amount: 1800 }),
      ]),
    );
  });

  it("posts compound discount allowed entry with separate Mohan credit-side postings", () => {
    const result = generateLedger(`Cash A/c Dr. Rs.9500
Discount Allowed A/c Dr. Rs.500
To Mohan A/c Rs.10000`);

    expect(result.status).toBe("success");
    expect(account(result.ledgerAccounts, "Cash").debitPostings[0]).toMatchObject({
      reference: "To Mohan A/c",
      amount: 9500,
    });
    expect(account(result.ledgerAccounts, "Discount Allowed").debitPostings[0]).toMatchObject({
      reference: "To Mohan A/c",
      amount: 500,
    });
    expect(account(result.ledgerAccounts, "Mohan").creditPostings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reference: "By Cash A/c", amount: 9500 }),
        expect.objectContaining({ reference: "By Discount Allowed A/c", amount: 500 }),
      ]),
    );
  });

  it("returns invalid for an unbalanced entry", () => {
    const result = generateLedger("Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.9000");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("Debit and credit totals do not match in entry number 1.");
  });

  it("returns invalid for missing To line", () => {
    const result = generateLedger("Purchases A/c Dr. Rs.10000\nCash A/c Rs.10000");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("I could not read the journal entry format");
  });

  it("returns invalid for more than 10 journal entries", () => {
    const entries = Array.from(
      { length: 11 },
      () => "Cash A/c Dr. Rs.1000\nTo Capital A/c Rs.1000",
    ).join("\n\n");

    const result = generateLedger(entries);

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("For this beta version, please enter up to 10 journal entries at a time.");
  });
});

function account(accounts: LedgerAccount[], name: string): LedgerAccount {
  const found = accounts.find((ledgerAccount) => ledgerAccount.account === name);
  expect(found).toBeDefined();
  return found!;
}
