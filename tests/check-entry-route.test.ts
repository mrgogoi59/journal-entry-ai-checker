import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/check-entry/route";
import type { CheckEntryResponse } from "@/lib/types";

async function checkEntry(transactionText: string, journalEntry: string): Promise<CheckEntryResponse> {
  const request = new Request("http://localhost/api/check-entry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionText, journalEntry }),
  });

  const response = await POST(request);
  expect(response.status).toBe(200);
  return (await response.json()) as CheckEntryResponse;
}

describe("POST /api/check-entry", () => {
  it("returns Correct for purchase goods worth Rs.5000 for cash with Purchase A/c entry", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Purchase goods worth Rs.5000 for cash.",
        journalEntry: "Purchase A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 5000 }],
      credits: [{ account: "Cash", amount: 5000 }],
    });
  });

  it("returns Correct for owner investing cash into business", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Owner invest Rs.50000 cash into business",
        journalEntry: "Cash A/c Dr. Rs.50000\nTo Capital A/c Rs.50000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 50000 }],
      credits: [{ account: "Capital", amount: 50000 }],
    });
  });

  it("does not accept a purchase entry for owner investing cash into business", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Owner invest Rs.50000 cash into business",
        journalEntry: "Purchase A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Incorrect");
    expect(["wrong_account", "amount_mismatch"]).toContain(body.mistake_type);
    expect(body.score).not.toBe(100);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 50000 }],
      credits: [{ account: "Capital", amount: 50000 }],
    });
  });

  it("returns Correct for natural cash sales wording", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Sold goods worth Rs.8000 for cash",
        journalEntry: "Cash A/c Dr. Rs.8000\nTo Sales A/c Rs.8000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 8000 }],
      credits: [{ account: "Sales", amount: 8000 }],
    });
  });

  it("returns Correct for natural credit sales wording", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Sold goods worth Rs.8000 on credit",
        journalEntry: "Debtor A/c Dr. Rs.8000\nTo Sales A/c Rs.8000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Debtor", amount: 8000 }],
      credits: [{ account: "Sales", amount: 8000 }],
    });
  });

  it("does not accept a purchase entry for cash sales", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Sold goods worth Rs.8000 for cash",
        journalEntry: "Purchases A/c Dr. Rs.8000\nTo Cash A/c Rs.8000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a cash sale entry for credit sales", async () => {
    const request = new Request("http://localhost/api/check-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionText: "Sold goods worth Rs.8000 on credit",
        journalEntry: "Cash A/c Dr. Rs.8000\nTo Sales A/c Rs.8000",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as CheckEntryResponse;

    expect(response.status).toBe(200);
    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for rent paid in cash", async () => {
    const body = await checkEntry(
      "Paid rent Rs.5000 in cash",
      "Rent A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Rent Expense", amount: 5000 }],
      credits: [{ account: "Cash", amount: 5000 }],
    });
  });

  it("returns Correct for rent paid through bank", async () => {
    const body = await checkEntry(
      "Paid rent Rs.5000 through bank",
      "Rent A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Rent Expense", amount: 5000 }],
      credits: [{ account: "Bank", amount: 5000 }],
    });
  });

  it("returns Correct for salary paid in cash", async () => {
    const body = await checkEntry(
      "Paid salary Rs.6000 in cash",
      "Salary A/c Dr. Rs.6000\nTo Cash A/c Rs.6000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Salary Expense", amount: 6000 }],
      credits: [{ account: "Cash", amount: 6000 }],
    });
  });

  it("returns Correct for salary paid through bank", async () => {
    const body = await checkEntry(
      "Paid salary Rs.6000 through bank",
      "Salary A/c Dr. Rs.6000\nTo Bank A/c Rs.6000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Salary Expense", amount: 6000 }],
      credits: [{ account: "Bank", amount: 6000 }],
    });
  });

  it.each([
    {
      name: "salary outstanding",
      transactionText: "Salary outstanding Rs.6000",
      journalEntry: "Salary A/c Dr. Rs.6000\nTo Outstanding Salary A/c Rs.6000",
      debits: [{ account: "Salary Expense", amount: 6000 }],
      credits: [{ account: "Outstanding Salary", amount: 6000 }],
    },
    {
      name: "salary expense outstanding",
      transactionText: "Salary outstanding Rs.6000",
      journalEntry: "Salary Expense A/c Dr. Rs.6000\nTo Outstanding Salary A/c Rs.6000",
      debits: [{ account: "Salary Expense", amount: 6000 }],
      credits: [{ account: "Outstanding Salary", amount: 6000 }],
    },
    {
      name: "rent outstanding",
      transactionText: "Rent outstanding Rs.5000",
      journalEntry: "Rent A/c Dr. Rs.5000\nTo Outstanding Rent A/c Rs.5000",
      debits: [{ account: "Rent Expense", amount: 5000 }],
      credits: [{ account: "Outstanding Rent", amount: 5000 }],
    },
    {
      name: "wages outstanding",
      transactionText: "Wages outstanding Rs.4000",
      journalEntry: "Wages A/c Dr. Rs.4000\nTo Outstanding Wages A/c Rs.4000",
      debits: [{ account: "Wages Expense", amount: 4000 }],
      credits: [{ account: "Outstanding Wages", amount: 4000 }],
    },
    {
      name: "electricity bill outstanding",
      transactionText: "Electricity bill outstanding Rs.2000",
      journalEntry: "Electricity A/c Dr. Rs.2000\nTo Outstanding Electricity A/c Rs.2000",
      debits: [{ account: "Electricity Expense", amount: 2000 }],
      credits: [{ account: "Outstanding Electricity", amount: 2000 }],
    },
    {
      name: "insurance outstanding",
      transactionText: "Insurance outstanding Rs.3000",
      journalEntry: "Insurance A/c Dr. Rs.3000\nTo Outstanding Insurance A/c Rs.3000",
      debits: [{ account: "Insurance Expense", amount: 3000 }],
      credits: [{ account: "Outstanding Insurance", amount: 3000 }],
    },
  ])("returns Correct for outstanding expense: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      name: "reversed outstanding salary",
      journalEntry: "Outstanding Salary A/c Dr. Rs.6000\nTo Salary A/c Rs.6000",
    },
    {
      name: "salary credited to cash",
      journalEntry: "Salary A/c Dr. Rs.6000\nTo Cash A/c Rs.6000",
    },
    {
      name: "salary credited to bank",
      journalEntry: "Salary A/c Dr. Rs.6000\nTo Bank A/c Rs.6000",
    },
    {
      name: "cash debited against outstanding salary",
      journalEntry: "Cash A/c Dr. Rs.6000\nTo Outstanding Salary A/c Rs.6000",
    },
  ])("does not accept wrong outstanding salary entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Salary outstanding Rs.6000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "prepaid rent",
      transactionText: "Prepaid rent Rs.5000",
      journalEntry: "Prepaid Rent A/c Dr. Rs.5000\nTo Rent A/c Rs.5000",
      debits: [{ account: "Prepaid Rent", amount: 5000 }],
      credits: [{ account: "Rent Expense", amount: 5000 }],
    },
    {
      name: "prepaid rent with expense account",
      transactionText: "Prepaid rent Rs.5000",
      journalEntry: "Prepaid Rent A/c Dr. Rs.5000\nTo Rent Expense A/c Rs.5000",
      debits: [{ account: "Prepaid Rent", amount: 5000 }],
      credits: [{ account: "Rent Expense", amount: 5000 }],
    },
    {
      name: "prepaid insurance",
      transactionText: "Prepaid insurance Rs.3000",
      journalEntry: "Prepaid Insurance A/c Dr. Rs.3000\nTo Insurance A/c Rs.3000",
      debits: [{ account: "Prepaid Insurance", amount: 3000 }],
      credits: [{ account: "Insurance Expense", amount: 3000 }],
    },
    {
      name: "prepaid salary",
      transactionText: "Prepaid salary Rs.6000",
      journalEntry: "Prepaid Salary A/c Dr. Rs.6000\nTo Salary A/c Rs.6000",
      debits: [{ account: "Prepaid Salary", amount: 6000 }],
      credits: [{ account: "Salary Expense", amount: 6000 }],
    },
    {
      name: "prepaid wages",
      transactionText: "Prepaid wages Rs.4000",
      journalEntry: "Prepaid Wages A/c Dr. Rs.4000\nTo Wages A/c Rs.4000",
      debits: [{ account: "Prepaid Wages", amount: 4000 }],
      credits: [{ account: "Wages Expense", amount: 4000 }],
    },
    {
      name: "prepaid electricity",
      transactionText: "Prepaid electricity Rs.2000",
      journalEntry: "Prepaid Electricity A/c Dr. Rs.2000\nTo Electricity A/c Rs.2000",
      debits: [{ account: "Prepaid Electricity", amount: 2000 }],
      credits: [{ account: "Electricity Expense", amount: 2000 }],
    },
  ])("returns Correct for prepaid expense: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      name: "reversed prepaid rent",
      journalEntry: "Rent A/c Dr. Rs.5000\nTo Prepaid Rent A/c Rs.5000",
    },
    {
      name: "prepaid rent credited to cash",
      journalEntry: "Prepaid Rent A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
    {
      name: "rent debited and cash credited",
      journalEntry: "Rent A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
    {
      name: "cash debited against prepaid rent",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Prepaid Rent A/c Rs.5000",
    },
  ])("does not accept wrong prepaid rent entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Prepaid rent Rs.5000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "accrued interest",
      transactionText: "Interest accrued Rs.1500",
      journalEntry: "Accrued Interest A/c Dr. Rs.1500\nTo Interest Income A/c Rs.1500",
      debits: [{ account: "Accrued Interest", amount: 1500 }],
      credits: [{ account: "Interest Income", amount: 1500 }],
    },
    {
      name: "accrued interest with Interest A/c",
      transactionText: "Interest accrued Rs.1500",
      journalEntry: "Accrued Interest A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
      debits: [{ account: "Accrued Interest", amount: 1500 }],
      credits: [{ account: "Interest Income", amount: 1500 }],
    },
    {
      name: "accrued commission",
      transactionText: "Commission accrued Rs.3000",
      journalEntry: "Accrued Commission A/c Dr. Rs.3000\nTo Commission Income A/c Rs.3000",
      debits: [{ account: "Accrued Commission", amount: 3000 }],
      credits: [{ account: "Commission Income", amount: 3000 }],
    },
    {
      name: "accrued commission with Commission A/c",
      transactionText: "Commission accrued Rs.3000",
      journalEntry: "Accrued Commission A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
      debits: [{ account: "Accrued Commission", amount: 3000 }],
      credits: [{ account: "Commission Income", amount: 3000 }],
    },
    {
      name: "accrued rent",
      transactionText: "Rent accrued Rs.4000",
      journalEntry: "Accrued Rent A/c Dr. Rs.4000\nTo Rent Income A/c Rs.4000",
      debits: [{ account: "Accrued Rent", amount: 4000 }],
      credits: [{ account: "Rent Income", amount: 4000 }],
    },
  ])("returns Correct for accrued income: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      name: "reversed accrued interest",
      transactionText: "Interest accrued Rs.1500",
      journalEntry: "Interest Income A/c Dr. Rs.1500\nTo Accrued Interest A/c Rs.1500",
    },
    {
      name: "cash received for accrued interest",
      transactionText: "Interest accrued Rs.1500",
      journalEntry: "Cash A/c Dr. Rs.1500\nTo Interest Income A/c Rs.1500",
    },
    {
      name: "bank received for accrued commission",
      transactionText: "Commission accrued Rs.3000",
      journalEntry: "Bank A/c Dr. Rs.3000\nTo Commission Income A/c Rs.3000",
    },
    {
      name: "rent expense used for accrued rent",
      transactionText: "Rent accrued Rs.4000",
      journalEntry: "Rent Expense A/c Dr. Rs.4000\nTo Accrued Rent A/c Rs.4000",
    },
  ])("does not accept wrong accrued income entry: $name", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "rent received in advance",
      transactionText: "Rent received in advance Rs.4000",
      journalEntry: "Rent Income A/c Dr. Rs.4000\nTo Rent Received in Advance A/c Rs.4000",
      debits: [{ account: "Rent Income", amount: 4000 }],
      credits: [{ account: "Rent Received in Advance", amount: 4000 }],
    },
    {
      name: "rent received in advance with Rent A/c",
      transactionText: "Rent received in advance Rs.4000",
      journalEntry: "Rent A/c Dr. Rs.4000\nTo Rent Received in Advance A/c Rs.4000",
      debits: [{ account: "Rent Income", amount: 4000 }],
      credits: [{ account: "Rent Received in Advance", amount: 4000 }],
    },
    {
      name: "commission received in advance",
      transactionText: "Commission received in advance Rs.3000",
      journalEntry: "Commission Income A/c Dr. Rs.3000\nTo Commission Received in Advance A/c Rs.3000",
      debits: [{ account: "Commission Income", amount: 3000 }],
      credits: [{ account: "Commission Received in Advance", amount: 3000 }],
    },
    {
      name: "commission received in advance with Commission A/c",
      transactionText: "Commission received in advance Rs.3000",
      journalEntry: "Commission A/c Dr. Rs.3000\nTo Commission Received in Advance A/c Rs.3000",
      debits: [{ account: "Commission Income", amount: 3000 }],
      credits: [{ account: "Commission Received in Advance", amount: 3000 }],
    },
    {
      name: "interest received in advance with Interest A/c",
      transactionText: "Interest received in advance Rs.1500",
      journalEntry: "Interest A/c Dr. Rs.1500\nTo Interest Received in Advance A/c Rs.1500",
      debits: [{ account: "Interest Income", amount: 1500 }],
      credits: [{ account: "Interest Received in Advance", amount: 1500 }],
    },
    {
      name: "interest received in advance",
      transactionText: "Interest received in advance Rs.1500",
      journalEntry: "Interest Income A/c Dr. Rs.1500\nTo Interest Received in Advance A/c Rs.1500",
      debits: [{ account: "Interest Income", amount: 1500 }],
      credits: [{ account: "Interest Received in Advance", amount: 1500 }],
    },
  ])(
    "returns Correct for income received in advance: $name",
    async ({ transactionText, journalEntry, debits, credits }) => {
      const body = await checkEntry(transactionText, journalEntry);

      expect(body.result_status).toBe("Correct");
      expect(body.score).toBe(100);
      expect(body.mistake_type).toBe("correct");
      expect(body.correct_journal_entry).toEqual({ debits, credits });
    },
  );

  it.each([
    {
      name: "reversed rent received in advance",
      transactionText: "Rent received in advance Rs.4000",
      journalEntry: "Rent Received in Advance A/c Dr. Rs.4000\nTo Rent Income A/c Rs.4000",
    },
    {
      name: "cash received for advance rent adjustment",
      transactionText: "Rent received in advance Rs.4000",
      journalEntry: "Cash A/c Dr. Rs.4000\nTo Rent Income A/c Rs.4000",
    },
    {
      name: "bank received for advance commission adjustment",
      transactionText: "Commission received in advance Rs.3000",
      journalEntry: "Bank A/c Dr. Rs.3000\nTo Commission Income A/c Rs.3000",
    },
    {
      name: "rent expense used for advance rent income",
      transactionText: "Rent received in advance Rs.4000",
      journalEntry: "Rent Expense A/c Dr. Rs.4000\nTo Rent Received in Advance A/c Rs.4000",
    },
  ])("does not accept wrong income received in advance entry: $name", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "named debtor cash settlement",
      transactionText: "Received Rs.9500 from Mohan in full settlement of Rs.10000",
      journalEntry: "Cash A/c Dr. Rs.9500\nDiscount Allowed A/c Dr. Rs.500\nTo Mohan A/c Rs.10000",
      debits: [
        { account: "Cash", amount: 9500 },
        { account: "Discount Allowed", amount: 500 },
      ],
      credits: [{ account: "Mohan", amount: 10000 }],
    },
    {
      name: "named debtor reversed debit lines",
      transactionText: "Received Rs.9500 from Mohan in full settlement of Rs.10000",
      journalEntry: "Discount Allowed A/c Dr. Rs.500\nCash A/c Dr. Rs.9500\nTo Mohan A/c Rs.10000",
      debits: [
        { account: "Cash", amount: 9500 },
        { account: "Discount Allowed", amount: 500 },
      ],
      credits: [{ account: "Mohan", amount: 10000 }],
    },
    {
      name: "named debtor bank settlement",
      transactionText: "Received Rs.9500 from Mohan through bank in full settlement of Rs.10000",
      journalEntry: "Bank A/c Dr. Rs.9500\nDiscount Allowed A/c Dr. Rs.500\nTo Mohan A/c Rs.10000",
      debits: [
        { account: "Bank", amount: 9500 },
        { account: "Discount Allowed", amount: 500 },
      ],
      credits: [{ account: "Mohan", amount: 10000 }],
    },
    {
      name: "generic debtor explicit discount",
      transactionText: "Received Rs.9500 from debtor and allowed discount Rs.500",
      journalEntry: "Cash A/c Dr. Rs.9500\nDiscount Allowed A/c Dr. Rs.500\nTo Debtor A/c Rs.10000",
      debits: [
        { account: "Cash", amount: 9500 },
        { account: "Discount Allowed", amount: 500 },
      ],
      credits: [{ account: "Debtor", amount: 10000 }],
    },
  ])("returns Correct for discount allowed settlement: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      name: "full cash debit",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Mohan A/c Rs.10000",
    },
    {
      name: "missing discount",
      journalEntry: "Cash A/c Dr. Rs.9500\nTo Mohan A/c Rs.9500",
    },
    {
      name: "discount credited",
      journalEntry: "Cash A/c Dr. Rs.9500\nTo Discount Allowed A/c Rs.500\nTo Mohan A/c Rs.10000",
    },
  ])("does not accept wrong discount allowed entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Received Rs.9500 from Mohan in full settlement of Rs.10000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "named creditor cash settlement",
      transactionText: "Paid Rs.4500 to Ram in full settlement of Rs.5000",
      journalEntry: "Ram A/c Dr. Rs.5000\nTo Cash A/c Rs.4500\nTo Discount Received A/c Rs.500",
      debits: [{ account: "Ram", amount: 5000 }],
      credits: [
        { account: "Cash", amount: 4500 },
        { account: "Discount Received", amount: 500 },
      ],
    },
    {
      name: "named creditor reversed credit lines",
      transactionText: "Paid Rs.4500 to Ram in full settlement of Rs.5000",
      journalEntry: "Ram A/c Dr. Rs.5000\nTo Discount Received A/c Rs.500\nTo Cash A/c Rs.4500",
      debits: [{ account: "Ram", amount: 5000 }],
      credits: [
        { account: "Cash", amount: 4500 },
        { account: "Discount Received", amount: 500 },
      ],
    },
    {
      name: "named creditor bank settlement",
      transactionText: "Paid Rs.4500 to Ram through bank in full settlement of Rs.5000",
      journalEntry: "Ram A/c Dr. Rs.5000\nTo Bank A/c Rs.4500\nTo Discount Received A/c Rs.500",
      debits: [{ account: "Ram", amount: 5000 }],
      credits: [
        { account: "Bank", amount: 4500 },
        { account: "Discount Received", amount: 500 },
      ],
    },
    {
      name: "generic creditor explicit discount",
      transactionText: "Paid Rs.4500 to creditor and received discount Rs.500",
      journalEntry: "Creditor A/c Dr. Rs.5000\nTo Cash A/c Rs.4500\nTo Discount Received A/c Rs.500",
      debits: [{ account: "Creditor", amount: 5000 }],
      credits: [
        { account: "Cash", amount: 4500 },
        { account: "Discount Received", amount: 500 },
      ],
    },
  ])("returns Correct for discount received settlement: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      name: "paid amount only",
      journalEntry: "Ram A/c Dr. Rs.4500\nTo Cash A/c Rs.4500",
    },
    {
      name: "discount wrong direction",
      journalEntry: "Discount Received A/c Dr. Rs.500\nCash A/c Dr. Rs.4500\nTo Ram A/c Rs.5000",
    },
    {
      name: "cash debited to discount received",
      journalEntry: "Cash A/c Dr. Rs.500\nTo Discount Received A/c Rs.500",
    },
  ])("does not accept wrong discount received entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Paid Rs.4500 to Ram in full settlement of Rs.5000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a salary entry for rent paid", async () => {
    const body = await checkEntry(
      "Paid rent Rs.5000 in cash",
      "Salary A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a rent entry for salary paid", async () => {
    const body = await checkEntry(
      "Paid salary Rs.6000 in cash",
      "Rent A/c Dr. Rs.6000\nTo Cash A/c Rs.6000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash credit for rent paid through bank", async () => {
    const body = await checkEntry(
      "Paid rent Rs.5000 through bank",
      "Rent A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Bank credit for salary paid in cash", async () => {
    const body = await checkEntry(
      "Paid salary Rs.6000 in cash",
      "Salary A/c Dr. Rs.6000\nTo Bank A/c Rs.6000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for cash drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew cash Rs.5000 for personal use",
      "Drawings A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Drawings", amount: 5000 }],
      credits: [{ account: "Cash", amount: 5000 }],
    });
  });

  it("returns Correct for bank drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew Rs.5000 from bank for personal use",
      "Drawings A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Drawings", amount: 5000 }],
      credits: [{ account: "Bank", amount: 5000 }],
    });
  });

  it("does not accept Bank credit for cash drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew cash Rs.5000 for personal use",
      "Drawings A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash credit for bank drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew Rs.5000 from bank for personal use",
      "Drawings A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a capital entry for drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew cash Rs.5000 for personal use",
      "Cash A/c Dr. Rs.5000\nTo Capital A/c Rs.5000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods worth Rs.2000 withdrawn by proprietor for personal use",
      journalEntry: "Drawings A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
      amount: 2000,
    },
    {
      transactionText: "Owner took goods Rs.1500 for personal use",
      journalEntry: "Drawings A/c Dr. Rs.1500\nTo Purchases A/c Rs.1500",
      amount: 1500,
    },
    {
      transactionText: "Goods withdrawn by owner Rs.1000 for home use",
      journalEntry: "Drawings A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
      amount: 1000,
    },
  ])("returns Correct for goods withdrawn for personal use: $transactionText", async ({ transactionText, journalEntry, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Drawings", amount }],
      credits: [{ account: "Purchases", amount }],
    });
  });

  it.each([
    {
      name: "reversed drawings and purchases",
      journalEntry: "Purchases A/c Dr. Rs.2000\nTo Drawings A/c Rs.2000",
    },
    {
      name: "cash credited",
      journalEntry: "Drawings A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    },
    {
      name: "sales credited",
      journalEntry: "Drawings A/c Dr. Rs.2000\nTo Sales A/c Rs.2000",
    },
    {
      name: "capital debited",
      journalEntry: "Capital A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
    },
  ])("does not accept wrong goods withdrawn entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods worth Rs.2000 withdrawn by proprietor for personal use", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods worth Rs.1000 distributed as free sample",
      journalEntry: "Advertisement Expense A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
      amount: 1000,
    },
    {
      transactionText: "Goods used for advertisement Rs.1500",
      journalEntry: "Advertisement A/c Dr. Rs.1500\nTo Purchases A/c Rs.1500",
      amount: 1500,
    },
    {
      transactionText: "Goods worth Rs.2000 distributed for promotion",
      journalEntry: "Advertisement Expense A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
      amount: 2000,
    },
  ])("returns Correct for goods distributed as free sample: $transactionText", async ({ transactionText, journalEntry, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Advertisement Expense", amount }],
      credits: [{ account: "Purchases", amount }],
    });
  });

  it.each([
    {
      name: "reversed advertisement and purchases",
      journalEntry: "Purchases A/c Dr. Rs.1000\nTo Advertisement Expense A/c Rs.1000",
    },
    {
      name: "cash credited",
      journalEntry: "Advertisement Expense A/c Dr. Rs.1000\nTo Cash A/c Rs.1000",
    },
    {
      name: "drawings debited",
      journalEntry: "Drawings A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
    },
    {
      name: "sales credited",
      journalEntry: "Advertisement Expense A/c Dr. Rs.1000\nTo Sales A/c Rs.1000",
    },
  ])("does not accept wrong free sample entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods worth Rs.1000 distributed as free sample", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods worth Rs.1000 given as charity",
      journalEntry: "Charity Expense A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
      amount: 1000,
    },
    {
      transactionText: "Goods worth Rs.1500 donated to orphanage",
      journalEntry: "Charity A/c Dr. Rs.1500\nTo Purchases A/c Rs.1500",
      amount: 1500,
    },
    {
      transactionText: "Goods used for charity Rs.2000",
      journalEntry: "Donation A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
      amount: 2000,
    },
  ])("returns Correct for goods given as charity: $transactionText", async ({ transactionText, journalEntry, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Charity Expense", amount }],
      credits: [{ account: "Purchases", amount }],
    });
  });

  it.each([
    {
      name: "reversed charity and purchases",
      journalEntry: "Purchases A/c Dr. Rs.1000\nTo Charity Expense A/c Rs.1000",
    },
    {
      name: "cash credited",
      journalEntry: "Charity Expense A/c Dr. Rs.1000\nTo Cash A/c Rs.1000",
    },
    {
      name: "sales credited",
      journalEntry: "Charity Expense A/c Dr. Rs.1000\nTo Sales A/c Rs.1000",
    },
    {
      name: "drawings debited",
      journalEntry: "Drawings A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
    },
    {
      name: "advertisement debited",
      journalEntry: "Advertisement Expense A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
    },
  ])("does not accept wrong charity entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods worth Rs.1000 given as charity", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods worth Rs.3000 lost by fire",
      journalEntry: "Loss by Fire A/c Dr. Rs.3000\nTo Purchases A/c Rs.3000",
      debitAccount: "Loss by Fire",
      amount: 3000,
    },
    {
      transactionText: "Goods worth Rs.3000 lost by fire",
      journalEntry: "Goods Lost by Fire A/c Dr. Rs.3000\nTo Purchases A/c Rs.3000",
      debitAccount: "Loss by Fire",
      amount: 3000,
    },
    {
      transactionText: "Goods worth Rs.2000 stolen",
      journalEntry: "Loss by Theft A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
      debitAccount: "Loss by Theft",
      amount: 2000,
    },
    {
      transactionText: "Goods worth Rs.2000 stolen",
      journalEntry: "Goods Lost by Theft A/c Dr. Rs.2000\nTo Purchases A/c Rs.2000",
      debitAccount: "Loss by Theft",
      amount: 2000,
    },
    {
      transactionText: "Goods worth Rs.1000 lost",
      journalEntry: "Goods Lost A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
      debitAccount: "Goods Lost",
      amount: 1000,
    },
  ])("returns Correct for goods loss: $transactionText", async ({ transactionText, journalEntry, debitAccount, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: debitAccount, amount }],
      credits: [{ account: "Purchases", amount }],
    });
  });

  it.each([
    {
      name: "reversed fire loss and purchases",
      journalEntry: "Purchases A/c Dr. Rs.3000\nTo Loss by Fire A/c Rs.3000",
    },
    {
      name: "cash credited",
      journalEntry: "Loss by Fire A/c Dr. Rs.3000\nTo Cash A/c Rs.3000",
    },
    {
      name: "sales credited",
      journalEntry: "Loss by Fire A/c Dr. Rs.3000\nTo Sales A/c Rs.3000",
    },
    {
      name: "drawings debited",
      journalEntry: "Drawings A/c Dr. Rs.3000\nTo Purchases A/c Rs.3000",
    },
    {
      name: "advertisement debited",
      journalEntry: "Advertisement Expense A/c Dr. Rs.3000\nTo Purchases A/c Rs.3000",
    },
  ])("does not accept wrong goods loss entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods worth Rs.3000 lost by fire", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods returned by Raju Rs.1000",
      journalEntry: "Sales Return A/c Dr. Rs.1000\nTo Raju A/c Rs.1000",
      creditAccount: "Raju",
      amount: 1000,
    },
    {
      transactionText: "Goods returned by Raju Rs.1000",
      journalEntry: "Return Inward A/c Dr. Rs.1000\nTo Raju A/c Rs.1000",
      creditAccount: "Raju",
      amount: 1000,
    },
    {
      transactionText: "Goods returned by Raju Rs.1000",
      journalEntry: "Sales Return A/c Dr. Rs.1000\nTo Debtor A/c Rs.1000",
      creditAccount: "Raju",
      amount: 1000,
    },
    {
      transactionText: "Goods returned by customer Rs.1000",
      journalEntry: "Sales Return A/c Dr. Rs.1000\nTo Debtor A/c Rs.1000",
      creditAccount: "Debtor",
      amount: 1000,
    },
    {
      transactionText: "Sales return from Amit Rs.1500",
      journalEntry: "Return Inward A/c Dr. Rs.1500\nTo Amit A/c Rs.1500",
      creditAccount: "Amit",
      amount: 1500,
    },
  ])("returns Correct for sales return: $transactionText", async ({ transactionText, journalEntry, creditAccount, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Sales Return", amount }],
      credits: [{ account: creditAccount, amount }],
    });
  });

  it.each([
    {
      name: "reversed customer and sales return",
      journalEntry: "Raju A/c Dr. Rs.1000\nTo Sales Return A/c Rs.1000",
    },
    {
      name: "cash credited",
      journalEntry: "Sales Return A/c Dr. Rs.1000\nTo Cash A/c Rs.1000",
    },
    {
      name: "purchase return debited",
      journalEntry: "Purchase Return A/c Dr. Rs.1000\nTo Raju A/c Rs.1000",
    },
    {
      name: "sales debited directly",
      journalEntry: "Sales A/c Dr. Rs.1000\nTo Raju A/c Rs.1000",
    },
  ])("does not accept wrong sales return entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods returned by Raju Rs.1000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Goods returned to Amit Rs.1000",
      journalEntry: "Amit A/c Dr. Rs.1000\nTo Purchase Return A/c Rs.1000",
      debitAccount: "Amit",
      amount: 1000,
    },
    {
      transactionText: "Goods returned to Amit Rs.1000",
      journalEntry: "Amit A/c Dr. Rs.1000\nTo Return Outward A/c Rs.1000",
      debitAccount: "Amit",
      amount: 1000,
    },
    {
      transactionText: "Goods returned to Amit Rs.1000",
      journalEntry: "Creditor A/c Dr. Rs.1000\nTo Purchase Return A/c Rs.1000",
      debitAccount: "Amit",
      amount: 1000,
    },
    {
      transactionText: "Goods returned to supplier Rs.1000",
      journalEntry: "Creditor A/c Dr. Rs.1000\nTo Purchase Return A/c Rs.1000",
      debitAccount: "Creditor",
      amount: 1000,
    },
    {
      transactionText: "Purchase return to Rahul Rs.1500",
      journalEntry: "Rahul A/c Dr. Rs.1500\nTo Return Outward A/c Rs.1500",
      debitAccount: "Rahul",
      amount: 1500,
    },
  ])("returns Correct for purchase return: $transactionText", async ({ transactionText, journalEntry, debitAccount, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: debitAccount, amount }],
      credits: [{ account: "Purchase Return", amount }],
    });
  });

  it.each([
    {
      name: "reversed purchase return and supplier",
      journalEntry: "Purchase Return A/c Dr. Rs.1000\nTo Amit A/c Rs.1000",
    },
    {
      name: "cash credited",
      journalEntry: "Amit A/c Dr. Rs.1000\nTo Cash A/c Rs.1000",
    },
    {
      name: "sales return credited",
      journalEntry: "Amit A/c Dr. Rs.1000\nTo Sales Return A/c Rs.1000",
    },
    {
      name: "purchases credited directly",
      journalEntry: "Amit A/c Dr. Rs.1000\nTo Purchases A/c Rs.1000",
    },
  ])("does not accept wrong purchase return entry: $name", async ({ journalEntry }) => {
    const body = await checkEntry("Goods returned to Amit Rs.1000", journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Paid wages Rs.5000 in cash",
      journalEntry: "Wages A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
      debitAccount: "Wages Expense",
      creditAccount: "Cash",
      amount: 5000,
    },
    {
      transactionText: "Paid freight Rs.2000 through bank",
      journalEntry: "Freight A/c Dr. Rs.2000\nTo Bank A/c Rs.2000",
      debitAccount: "Freight Expense",
      creditAccount: "Bank",
      amount: 2000,
    },
    {
      transactionText: "Paid internet bill Rs.1500 by UPI",
      journalEntry: "Internet Expense A/c Dr. Rs.1500\nTo Bank A/c Rs.1500",
      debitAccount: "Internet Expense",
      creditAccount: "Bank",
      amount: 1500,
    },
    {
      transactionText: "Paid legal charges Rs.5000 in cash",
      journalEntry: "Legal Charges A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
      debitAccount: "Legal Charges",
      creditAccount: "Cash",
      amount: 5000,
    },
    {
      transactionText: "Paid office expenses Rs.2500 through bank",
      journalEntry: "Office Expenses A/c Dr. Rs.2500\nTo Bank A/c Rs.2500",
      debitAccount: "Office Expenses",
      creditAccount: "Bank",
      amount: 2500,
    },
  ])("returns Correct for common expense payment: $transactionText", async ({ transactionText, journalEntry, debitAccount, creditAccount, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: debitAccount, amount }],
      credits: [{ account: creditAccount, amount }],
    });
  });

  it.each([
    {
      transactionText: "Paid wages Rs.5000 in cash",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Wages A/c Rs.5000",
    },
    {
      transactionText: "Paid wages Rs.5000 in cash",
      journalEntry: "Wages A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    },
    {
      transactionText: "Paid freight Rs.2000 through bank",
      journalEntry: "Freight A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    },
    {
      transactionText: "Paid wages Rs.5000 in cash",
      journalEntry: "Sales A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
    {
      transactionText: "Paid wages Rs.5000 in cash",
      journalEntry: "Purchases A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
  ])("does not accept wrong common expense entry", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Rent Income A/c Rs.5000",
      debitAccount: "Cash",
      creditAccount: "Rent Income",
      amount: 5000,
    },
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Rent Received A/c Rs.5000",
      debitAccount: "Cash",
      creditAccount: "Rent Income",
      amount: 5000,
    },
    {
      transactionText: "Received service income Rs.7000 through bank",
      journalEntry: "Bank A/c Dr. Rs.7000\nTo Service Income A/c Rs.7000",
      debitAccount: "Bank",
      creditAccount: "Service Income",
      amount: 7000,
    },
    {
      transactionText: "Received consultancy fees Rs.10000 by UPI",
      journalEntry: "Bank A/c Dr. Rs.10000\nTo Consultancy Income A/c Rs.10000",
      debitAccount: "Bank",
      creditAccount: "Consultancy Income",
      amount: 10000,
    },
    {
      transactionText: "Received tuition fees Rs.3000 in cash",
      journalEntry: "Cash A/c Dr. Rs.3000\nTo Tuition Fees A/c Rs.3000",
      debitAccount: "Cash",
      creditAccount: "Tuition Income",
      amount: 3000,
    },
    {
      transactionText: "Received royalty Rs.4000 through bank",
      journalEntry: "Bank A/c Dr. Rs.4000\nTo Royalty Income A/c Rs.4000",
      debitAccount: "Bank",
      creditAccount: "Royalty Income",
      amount: 4000,
    },
  ])("returns Correct for common income receipt: $transactionText", async ({ transactionText, journalEntry, debitAccount, creditAccount, amount }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: debitAccount, amount }],
      credits: [{ account: creditAccount, amount }],
    });
  });

  it.each([
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Rent Income A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Rent Expense A/c Rs.5000",
    },
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Bank A/c Dr. Rs.5000\nTo Rent Income A/c Rs.5000",
    },
    {
      transactionText: "Received consultancy fees Rs.10000 by UPI",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Consultancy Income A/c Rs.10000",
    },
    {
      transactionText: "Received rent Rs.5000 in cash",
      journalEntry: "Sales A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    },
  ])("does not accept wrong common income entry", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for debtor cash receipt", async () => {
    const body = await checkEntry(
      "Received cash Rs.10000 from debtor",
      "Cash A/c Dr. Rs.10000\nTo Debtor A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 10000 }],
      credits: [{ account: "Debtor", amount: 10000 }],
    });
  });

  it("returns Correct for debtor bank receipt", async () => {
    const body = await checkEntry(
      "Received Rs.10000 from debtor through bank",
      "Bank A/c Dr. Rs.10000\nTo Debtor A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 10000 }],
      credits: [{ account: "Debtor", amount: 10000 }],
    });
  });

  it("returns Correct for creditor cash payment", async () => {
    const body = await checkEntry(
      "Paid cash Rs.7000 to creditor",
      "Creditor A/c Dr. Rs.7000\nTo Cash A/c Rs.7000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Creditor", amount: 7000 }],
      credits: [{ account: "Cash", amount: 7000 }],
    });
  });

  it("returns Correct for creditor bank payment", async () => {
    const body = await checkEntry(
      "Paid Rs.7000 to creditor through bank",
      "Creditor A/c Dr. Rs.7000\nTo Bank A/c Rs.7000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Creditor", amount: 7000 }],
      credits: [{ account: "Bank", amount: 7000 }],
    });
  });

  it("does not accept a creditor entry for debtor receipt", async () => {
    const body = await checkEntry(
      "Received cash Rs.10000 from debtor",
      "Creditor A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a debtor entry for creditor payment", async () => {
    const body = await checkEntry(
      "Paid cash Rs.7000 to creditor",
      "Cash A/c Dr. Rs.7000\nTo Debtor A/c Rs.7000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Bank debit for debtor cash receipt", async () => {
    const body = await checkEntry(
      "Received cash Rs.10000 from debtor",
      "Bank A/c Dr. Rs.10000\nTo Debtor A/c Rs.10000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash debit for debtor bank receipt", async () => {
    const body = await checkEntry(
      "Received Rs.10000 from debtor through bank",
      "Cash A/c Dr. Rs.10000\nTo Debtor A/c Rs.10000",
    );

    expect(body.result_status).toBe("Incorrect");
    expect(body.mistake_type).toBe("wrong_account");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for cash deposited into bank", async () => {
    const body = await checkEntry(
      "Deposited cash Rs.10000 into bank",
      "Bank A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 10000 }],
      credits: [{ account: "Cash", amount: 10000 }],
    });
  });

  it("returns Correct for cash withdrawn from bank for business use", async () => {
    const body = await checkEntry(
      "Withdraw cash Rs.5000 from bank",
      "Cash A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 5000 }],
      credits: [{ account: "Bank", amount: 5000 }],
    });
  });

  it("does not accept withdrawal entry for bank deposit", async () => {
    const body = await checkEntry(
      "Deposited cash Rs.10000 into bank",
      "Cash A/c Dr. Rs.10000\nTo Bank A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept deposit entry for cash withdrawal", async () => {
    const body = await checkEntry(
      "Withdraw cash Rs.5000 from bank",
      "Bank A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("keeps personal-use bank withdrawal classified as drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew Rs.5000 from bank for personal use",
      "Drawings A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Drawings", amount: 5000 }],
      credits: [{ account: "Bank", amount: 5000 }],
    });
  });

  it("does not accept business withdrawal entry for personal-use bank drawings", async () => {
    const body = await checkEntry(
      "Owner withdrew Rs.5000 from bank for personal use",
      "Cash A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for loan taken in cash", async () => {
    const body = await checkEntry(
      "Took loan Rs.50000 in cash",
      "Cash A/c Dr. Rs.50000\nTo Loan A/c Rs.50000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 50000 }],
      credits: [{ account: "Loan", amount: 50000 }],
    });
  });

  it("returns Correct for loan taken through bank", async () => {
    const body = await checkEntry(
      "Took loan Rs.50000 through bank",
      "Bank A/c Dr. Rs.50000\nTo Loan A/c Rs.50000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 50000 }],
      credits: [{ account: "Loan", amount: 50000 }],
    });
  });

  it("returns Correct for loan repaid in cash", async () => {
    const body = await checkEntry(
      "Repaid loan Rs.10000 in cash",
      "Loan A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Loan", amount: 10000 }],
      credits: [{ account: "Cash", amount: 10000 }],
    });
  });

  it("returns Correct for loan repaid through bank", async () => {
    const body = await checkEntry(
      "Repaid loan Rs.10000 through bank",
      "Loan A/c Dr. Rs.10000\nTo Bank A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Loan", amount: 10000 }],
      credits: [{ account: "Bank", amount: 10000 }],
    });
  });

  it("does not accept Loan debit for loan taken in cash", async () => {
    const body = await checkEntry(
      "Took loan Rs.50000 in cash",
      "Loan A/c Dr. Rs.50000\nTo Cash A/c Rs.50000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Loan credit for loan repaid in cash", async () => {
    const body = await checkEntry(
      "Repaid loan Rs.10000 in cash",
      "Cash A/c Dr. Rs.10000\nTo Loan A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash debit for loan taken through bank", async () => {
    const body = await checkEntry(
      "Took loan Rs.50000 through bank",
      "Cash A/c Dr. Rs.50000\nTo Loan A/c Rs.50000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash credit for loan repaid through bank", async () => {
    const body = await checkEntry(
      "Repaid loan Rs.10000 through bank",
      "Loan A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for interest paid in cash with Interest A/c debit", async () => {
    const body = await checkEntry(
      "Paid interest Rs.2000 in cash",
      "Interest A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Interest Expense", amount: 2000 }],
      credits: [{ account: "Cash", amount: 2000 }],
    });
  });

  it("returns Correct for interest paid through bank with Interest A/c debit", async () => {
    const body = await checkEntry(
      "Paid interest Rs.2000 through bank",
      "Interest A/c Dr. Rs.2000\nTo Bank A/c Rs.2000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Interest Expense", amount: 2000 }],
      credits: [{ account: "Bank", amount: 2000 }],
    });
  });

  it("returns Correct for interest received in cash with Interest A/c credit", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500 in cash",
      "Cash A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 1500 }],
      credits: [{ account: "Interest Income", amount: 1500 }],
    });
  });

  it("returns Correct for interest received through bank with Interest A/c credit", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500 through bank",
      "Bank A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 1500 }],
      credits: [{ account: "Interest Income", amount: 1500 }],
    });
  });

  it("does not accept Interest credit for interest paid in cash", async () => {
    const body = await checkEntry(
      "Paid interest Rs.2000 in cash",
      "Cash A/c Dr. Rs.2000\nTo Interest A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Interest debit for interest received in cash", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500 in cash",
      "Interest A/c Dr. Rs.1500\nTo Cash A/c Rs.1500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash credit for interest paid through bank", async () => {
    const body = await checkEntry(
      "Paid interest Rs.2000 through bank",
      "Interest A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash debit for interest received through bank", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500 through bank",
      "Cash A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Unsupported Transaction for ambiguous interest paid wording", async () => {
    const body = await checkEntry(
      "Paid interest Rs.2000",
      "Interest A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it("returns Unsupported Transaction for ambiguous interest received wording", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500",
      "Cash A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it("returns Correct for commission received in cash with Commission A/c credit", async () => {
    const body = await checkEntry(
      "Received commission Rs.3000 in cash",
      "Cash A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 3000 }],
      credits: [{ account: "Commission Income", amount: 3000 }],
    });
  });

  it("returns Correct for commission received through bank with Commission A/c credit", async () => {
    const body = await checkEntry(
      "Received commission Rs.3000 through bank",
      "Bank A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.confidence).toBe(0.95);
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 3000 }],
      credits: [{ account: "Commission Income", amount: 3000 }],
    });
  });

  it("does not accept Commission debit for commission received in cash", async () => {
    const body = await checkEntry(
      "Received commission Rs.3000 in cash",
      "Commission A/c Dr. Rs.3000\nTo Cash A/c Rs.3000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash debit for commission received through bank", async () => {
    const body = await checkEntry(
      "Received commission Rs.3000 through bank",
      "Cash A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Unsupported Transaction for ambiguous commission received wording", async () => {
    const body = await checkEntry(
      "Received commission Rs.3000",
      "Cash A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it.each([
    {
      name: "named credit sale to Raju",
      transactionText: "Sold goods to Raju Rs.5000",
      journalEntry: "Raju A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
      debits: [{ account: "Raju", amount: 5000 }],
      credits: [{ account: "Sales", amount: 5000 }],
    },
    {
      name: "named mango sale to Bidyut",
      transactionText: "Sold Mango to Bidyut Rs.500",
      journalEntry: "Bidyut A/c Dr. Rs.500\nTo Sales A/c Rs.500",
      debits: [{ account: "Bidyut", amount: 500 }],
      credits: [{ account: "Sales", amount: 500 }],
    },
    {
      name: "named goods purchase from Amit",
      transactionText: "Purchased goods from Amit Rs.3000",
      journalEntry: "Purchases A/c Dr. Rs.3000\nTo Amit A/c Rs.3000",
      debits: [{ account: "Purchases", amount: 3000 }],
      credits: [{ account: "Amit", amount: 3000 }],
    },
    {
      name: "named machinery purchase from Kuldeep on credit",
      transactionText: "Bought machinery from Kuldeep on credit Rs.5000",
      journalEntry: "Machinery A/c Dr. Rs.5000\nTo Kuldeep A/c Rs.5000",
      debits: [{ account: "Machinery", amount: 5000 }],
      credits: [{ account: "Kuldeep", amount: 5000 }],
    },
    {
      name: "named machinery purchase from Kuldeep for cash",
      transactionText: "Purchase machinery from Kuldeep for cash Rs.500",
      journalEntry: "Machinery A/c Dr. Rs.500\nTo Cash A/c Rs.500",
      debits: [{ account: "Machinery", amount: 500 }],
      credits: [{ account: "Cash", amount: 500 }],
    },
    {
      name: "cash sale to Raju",
      transactionText: "Sold goods to Raju for cash Rs.5000",
      journalEntry: "Cash A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
      debits: [{ account: "Cash", amount: 5000 }],
      credits: [{ account: "Sales", amount: 5000 }],
    },
    {
      name: "cash received from named debtor",
      transactionText: "Received cash Rs.10000 from Raju",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Raju A/c Rs.10000",
      debits: [{ account: "Cash", amount: 10000 }],
      credits: [{ account: "Raju", amount: 10000 }],
    },
    {
      name: "UPI payment to named creditor",
      transactionText: "Paid Rs.7000 to Amit through UPI",
      journalEntry: "Amit A/c Dr. Rs.7000\nTo Bank A/c Rs.7000",
      debits: [{ account: "Amit", amount: 7000 }],
      credits: [{ account: "Bank", amount: 7000 }],
    },
  ])("returns Correct for party-name case: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it("does not credit party name when named machinery purchase says cash", async () => {
    const body = await checkEntry(
      "Purchase machinery from Kuldeep for cash Rs.500",
      "Machinery A/c Dr. Rs.500\nTo Kuldeep A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not debit party name when named goods sale says cash", async () => {
    const body = await checkEntry(
      "Sold goods to Raju for cash Rs.5000",
      "Raju A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      name: "rent paid by UPI",
      transactionText: "Paid rent Rs.5000 by UPI",
      journalEntry: "Rent A/c Dr. Rs.5000\nTo Bank A/c Rs.5000",
      debits: [{ account: "Rent Expense", amount: 5000 }],
      credits: [{ account: "Bank", amount: 5000 }],
    },
    {
      name: "salary paid through Google Pay",
      transactionText: "Paid salary Rs.6000 through Google Pay",
      journalEntry: "Salary A/c Dr. Rs.6000\nTo Bank A/c Rs.6000",
      debits: [{ account: "Salary Expense", amount: 6000 }],
      credits: [{ account: "Bank", amount: 6000 }],
    },
    {
      name: "commission received through GPay",
      transactionText: "Received commission Rs.3000 through GPay",
      journalEntry: "Bank A/c Dr. Rs.3000\nTo Commission A/c Rs.3000",
      debits: [{ account: "Bank", amount: 3000 }],
      credits: [{ account: "Commission Income", amount: 3000 }],
    },
    {
      name: "interest received by NEFT",
      transactionText: "Received interest Rs.1500 by NEFT",
      journalEntry: "Bank A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
      debits: [{ account: "Bank", amount: 1500 }],
      credits: [{ account: "Interest Income", amount: 1500 }],
    },
    {
      name: "creditor paid by PhonePe",
      transactionText: "Paid creditor Rs.7000 by PhonePe",
      journalEntry: "Creditor A/c Dr. Rs.7000\nTo Bank A/c Rs.7000",
      debits: [{ account: "Creditor", amount: 7000 }],
      credits: [{ account: "Bank", amount: 7000 }],
    },
    {
      name: "debtor receipt by online transfer",
      transactionText: "Received from debtor by online transfer Rs.10000",
      journalEntry: "Bank A/c Dr. Rs.10000\nTo Debtor A/c Rs.10000",
      debits: [{ account: "Bank", amount: 10000 }],
      credits: [{ account: "Debtor", amount: 10000 }],
    },
    {
      name: "loan repaid by net banking",
      transactionText: "Repaid loan Rs.10000 by net banking",
      journalEntry: "Loan A/c Dr. Rs.10000\nTo Bank A/c Rs.10000",
      debits: [{ account: "Loan", amount: 10000 }],
      credits: [{ account: "Bank", amount: 10000 }],
    },
    {
      name: "loan taken through bank transfer",
      transactionText: "Took loan Rs.50000 through bank transfer",
      journalEntry: "Bank A/c Dr. Rs.50000\nTo Loan A/c Rs.50000",
      debits: [{ account: "Bank", amount: 50000 }],
      credits: [{ account: "Loan", amount: 50000 }],
    },
  ])("returns Correct for digital bank payment mode: $name", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it("returns Correct for named customer credit sale", async () => {
    const body = await checkEntry(
      "Sold Mango to Bidyut Rs. 500",
      "Debtor A/c Dr. Rs.500\nTo Sales A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bidyut", amount: 500 }],
      credits: [{ account: "Sales", amount: 500 }],
    });
  });

  it("does not accept cash sale entry when named customer sale does not mention cash", async () => {
    const body = await checkEntry(
      "Sold Mango to Bidyut Rs. 500",
      "Cash A/c Dr. Rs.500\nTo Sales A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for machinery purchased from named vendor for cash", async () => {
    const body = await checkEntry(
      "Purchase machinery from Kuldeep for cash Rs. 500",
      "Machinery A/c Dr. Rs.500\nTo Cash A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Machinery", amount: 500 }],
      credits: [{ account: "Cash", amount: 500 }],
    });
  });

  it("does not credit named vendor when asset purchase says for cash", async () => {
    const body = await checkEntry(
      "Purchase machinery from Kuldeep for cash Rs. 500",
      "Machinery A/c Dr. Rs.500\nTo Kuldeep A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for machinery purchased from named vendor on credit", async () => {
    const body = await checkEntry(
      "Purchase machinery from Kuldeep on credit Rs. 500",
      "Machinery A/c Dr. Rs.500\nTo Creditor A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Machinery", amount: 500 }],
      credits: [{ account: "Kuldeep", amount: 500 }],
    });
  });

  it("returns Correct for named goods item purchased for cash", async () => {
    const body = await checkEntry(
      "Purchase mangoes from Kuldeep for cash Rs. 500",
      "Purchases A/c Dr. Rs.500\nTo Cash A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 500 }],
      credits: [{ account: "Cash", amount: 500 }],
    });
  });

  it("returns Correct for table purchased from named vendor on credit", async () => {
    const body = await checkEntry(
      "Bought table from Raju on credit Rs. 1000",
      "Furniture A/c Dr Rs.1000\nTo Creditor A/c Rs.1000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Furniture", amount: 1000 }],
      credits: [{ account: "Raju", amount: 1000 }],
    });
  });

  it("does not accept Cash credit for table purchased on credit", async () => {
    const body = await checkEntry(
      "Bought table from Raju on credit Rs. 1000",
      "Furniture A/c Dr Rs.1000\nTo Cash A/c Rs.1000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Creditor credit for table purchased for cash", async () => {
    const body = await checkEntry(
      "Bought table from Raju for cash Rs. 1000",
      "Furniture A/c Dr Rs.1000\nTo Creditor A/c Rs.1000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Bought laptop for cash Rs.30000",
      journalEntry: "Computer Equipment A/c Dr. Rs.30000\nTo Cash A/c Rs.30000",
      debitAccount: "Computer",
      creditAccount: "Cash",
      amount: 30000,
    },
    {
      transactionText: "Bought laptop for cash Rs.30000",
      journalEntry: "Computer A/c Dr. Rs.30000\nTo Cash A/c Rs.30000",
      debitAccount: "Computer",
      creditAccount: "Cash",
      amount: 30000,
    },
    {
      transactionText: "Purchased printer through bank Rs.8000",
      journalEntry: "Office Equipment A/c Dr. Rs.8000\nTo Bank A/c Rs.8000",
      debitAccount: "Equipment",
      creditAccount: "Bank",
      amount: 8000,
    },
    {
      transactionText: "Bought camera from Amit on credit Rs.20000",
      journalEntry: "Office Equipment A/c Dr. Rs.20000\nTo Amit A/c Rs.20000",
      debitAccount: "Equipment",
      creditAccount: "Amit",
      amount: 20000,
    },
    {
      transactionText: "Purchased land through bank Rs.100000",
      journalEntry: "Land A/c Dr. Rs.100000\nTo Bank A/c Rs.100000",
      debitAccount: "Land",
      creditAccount: "Bank",
      amount: 100000,
    },
    {
      transactionText: "Bought vehicle on credit Rs.300000",
      journalEntry: "Vehicle A/c Dr. Rs.300000\nTo Creditor A/c Rs.300000",
      debitAccount: "Vehicle",
      creditAccount: "Creditor",
      amount: 300000,
    },
  ])(
    "returns Correct for common asset purchase: $transactionText",
    async ({ transactionText, journalEntry, debitAccount, creditAccount, amount }) => {
      const body = await checkEntry(transactionText, journalEntry);

      expect(body.result_status).toBe("Correct");
      expect(body.score).toBe(100);
      expect(body.mistake_type).toBe("correct");
      expect(body.correct_journal_entry).toEqual({
        debits: [{ account: debitAccount, amount }],
        credits: [{ account: creditAccount, amount }],
      });
    },
  );

  it.each([
    {
      transactionText: "Bought laptop for cash Rs.30000",
      journalEntry: "Purchases A/c Dr. Rs.30000\nTo Cash A/c Rs.30000",
    },
    {
      transactionText: "Bought laptop for cash Rs.30000",
      journalEntry: "Cash A/c Dr. Rs.30000\nTo Computer Equipment A/c Rs.30000",
    },
    {
      transactionText: "Purchased printer through bank Rs.8000",
      journalEntry: "Office Equipment A/c Dr. Rs.8000\nTo Cash A/c Rs.8000",
    },
    {
      transactionText: "Purchased land through bank Rs.100000",
      journalEntry: "Land A/c Dr. Rs.100000\nTo Cash A/c Rs.100000",
    },
    {
      transactionText: "Bought camera from Amit on credit Rs.20000",
      journalEntry: "Office Equipment A/c Dr. Rs.20000\nTo Sales A/c Rs.20000",
    },
  ])("does not accept wrong common asset purchase entry", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Unsupported Transaction for ambiguous furniture item purchase", async () => {
    const body = await checkEntry(
      "Bought table Rs.1000",
      "Furniture A/c Dr Rs.1000\nTo Cash A/c Rs.1000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it("returns Correct for depreciation charged on machinery", async () => {
    const body = await checkEntry(
      "Depreciation charged on machinery Rs.5000",
      "Depreciation A/c Dr. Rs.5000\nTo Machinery A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Depreciation", amount: 5000 }],
      credits: [{ account: "Machinery", amount: 5000 }],
    });
  });

  it("returns Correct for depreciation charged on furniture", async () => {
    const body = await checkEntry(
      "Depreciation charged on furniture Rs.2000",
      "Depreciation A/c Dr. Rs.2000\nTo Furniture A/c Rs.2000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Depreciation", amount: 2000 }],
      credits: [{ account: "Furniture", amount: 2000 }],
    });
  });

  it("returns Correct for depreciation provided on computer", async () => {
    const body = await checkEntry(
      "Depreciation provided on computer Rs.3000",
      "Depreciation A/c Dr. Rs.3000\nTo Computer A/c Rs.3000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Depreciation", amount: 3000 }],
      credits: [{ account: "Computer", amount: 3000 }],
    });
  });

  it("does not accept reversed depreciation entry", async () => {
    const body = await checkEntry(
      "Depreciation charged on machinery Rs.5000",
      "Machinery A/c Dr. Rs.5000\nTo Depreciation A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept cash credit for depreciation", async () => {
    const body = await checkEntry(
      "Depreciation charged on machinery Rs.5000",
      "Depreciation A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("keeps depreciation without a supported asset unsupported", async () => {
    const missingAsset = await checkEntry(
      "Depreciation charged Rs.5000",
      "Depreciation A/c Dr. Rs.5000\nTo Machinery A/c Rs.5000",
    );
    const unknownAsset = await checkEntry(
      "Depreciation charged on unknown asset Rs.5000",
      "Depreciation A/c Dr. Rs.5000\nTo Unknown Asset A/c Rs.5000",
    );

    expect(missingAsset.result_status).toBe("Unsupported Transaction");
    expect(unknownAsset.result_status).toBe("Unsupported Transaction");
  });

  it("returns Correct for generic bad debts written off", async () => {
    const body = await checkEntry(
      "Bad debts written off Rs.2000",
      "Bad Debts A/c Dr. Rs.2000\nTo Debtor A/c Rs.2000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bad Debts", amount: 2000 }],
      credits: [{ account: "Debtor", amount: 2000 }],
    });
  });

  it("returns Correct for named debtor bad debt written off", async () => {
    const body = await checkEntry(
      "Raju became insolvent and Rs.1000 became bad debt",
      "Bad Debts A/c Dr. Rs.1000\nTo Raju A/c Rs.1000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bad Debts", amount: 1000 }],
      credits: [{ account: "Raju", amount: 1000 }],
    });
  });

  it("accepts generic Debtor credit for named debtor bad debt written off", async () => {
    const body = await checkEntry(
      "Raju became insolvent and Rs.1000 became bad debt",
      "Bad Debts A/c Dr. Rs.1000\nTo Debtor A/c Rs.1000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bad Debts", amount: 1000 }],
      credits: [{ account: "Raju", amount: 1000 }],
    });
  });

  it("does not accept reversed bad debts written off entry", async () => {
    const body = await checkEntry(
      "Bad debts written off Rs.2000",
      "Debtor A/c Dr. Rs.2000\nTo Bad Debts A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash credit for bad debts written off", async () => {
    const body = await checkEntry(
      "Bad debts written off Rs.2000",
      "Bad Debts A/c Dr. Rs.2000\nTo Cash A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Cash debit for bad debts written off", async () => {
    const body = await checkEntry(
      "Bad debts written off Rs.2000",
      "Cash A/c Dr. Rs.2000\nTo Bad Debts A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept Sales credit for bad debts written off", async () => {
    const body = await checkEntry(
      "Bad debts written off Rs.2000",
      "Bad Debts A/c Dr. Rs.2000\nTo Sales A/c Rs.2000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for bad debts recovered in cash", async () => {
    const body = await checkEntry(
      "Bad debts recovered Rs.500 in cash",
      "Cash A/c Dr. Rs.500\nTo Bad Debts Recovered A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 500 }],
      credits: [{ account: "Bad Debts Recovered", amount: 500 }],
    });
  });

  it("returns Correct for bad debts recovered through bank", async () => {
    const body = await checkEntry(
      "Bad debts recovered Rs.500 through bank",
      "Bank A/c Dr. Rs.500\nTo Bad Debts Recovered A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Bank", amount: 500 }],
      credits: [{ account: "Bad Debts Recovered", amount: 500 }],
    });
  });

  it("returns Correct for bad debts recovered from a named debtor in cash", async () => {
    const body = await checkEntry(
      "Bad debts recovered from Raju Rs.500 in cash",
      "Cash A/c Dr. Rs.500\nTo Bad Debts Recovered A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 500 }],
      credits: [{ account: "Bad Debts Recovered", amount: 500 }],
    });
  });

  it("does not accept reversed bad debts recovered entry", async () => {
    const body = await checkEntry(
      "Bad debts recovered Rs.500 in cash",
      "Bad Debts Recovered A/c Dr. Rs.500\nTo Cash A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not credit named debtor for bad debts recovered", async () => {
    const body = await checkEntry(
      "Bad debts recovered from Raju Rs.500 in cash",
      "Cash A/c Dr. Rs.500\nTo Raju A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept bad debts written off entry for bad debts recovered", async () => {
    const body = await checkEntry(
      "Bad debts recovered Rs.500 in cash",
      "Bad Debts A/c Dr. Rs.500\nTo Cash A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept named debtor debit for bad debts recovered", async () => {
    const body = await checkEntry(
      "Bad debts recovered from Raju Rs.500 in cash",
      "Raju A/c Dr. Rs.500\nTo Bad Debts Recovered A/c Rs.500",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("keeps doubtful debts provision and provision-adjusted recovery unsupported", async () => {
    const provision = await checkEntry(
      "Provision for doubtful debts created Rs.1000",
      "Profit and Loss A/c Dr. Rs.1000\nTo Provision for Doubtful Debts A/c Rs.1000",
    );
    const provisionRecovery = await checkEntry(
      "Bad debts recovered and transferred to provision for doubtful debts Rs.500",
      "Cash A/c Dr. Rs.500\nTo Provision for Doubtful Debts A/c Rs.500",
    );

    expect(provision.result_status).toBe("Unsupported Transaction");
    expect(provisionRecovery.result_status).toBe("Unsupported Transaction");
  });

  it("returns Correct for cash sale after trade discount using net value", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 sold for cash Rs.900 after discount Rs.100",
      "Cash A/c Dr. Rs.900\nTo Sales A/c Rs.900",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 900 }],
      credits: [{ account: "Sales", amount: 900 }],
    });
  });

  it("returns Correct for credit sale after trade discount using net value", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 sold to Raju for Rs.900 after discount Rs.100",
      "Debtor A/c Dr. Rs.900\nTo Sales A/c Rs.900",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Debtor", amount: 900 }],
      credits: [{ account: "Sales", amount: 900 }],
    });
  });

  it("returns Correct for cash purchase after trade discount using net value", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 purchased for cash Rs.900 after discount Rs.100",
      "Purchases A/c Dr. Rs.900\nTo Cash A/c Rs.900",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 900 }],
      credits: [{ account: "Cash", amount: 900 }],
    });
  });

  it("returns Correct for credit purchase after trade discount using net value", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 purchased from Raju for Rs.900 after discount Rs.100",
      "Purchases A/c Dr. Rs.900\nTo Creditor A/c Rs.900",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 900 }],
      credits: [{ account: "Creditor", amount: 900 }],
    });
  });

  it("does not accept gross amount for sale after trade discount", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 sold for cash Rs.900 after discount Rs.100",
      "Cash A/c Dr. Rs.1000\nTo Sales A/c Rs.1000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept gross amount for purchase after trade discount", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 purchased for cash Rs.900 after discount Rs.100",
      "Purchases A/c Dr. Rs.1000\nTo Cash A/c Rs.1000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not require or accept Discount Allowed as a compound sale entry", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 sold for cash Rs.900 after discount Rs.100",
      "Cash A/c Dr. Rs.900\nDiscount Allowed A/c Dr. Rs.100\nTo Sales A/c Rs.1000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not require or accept Discount Received as a compound purchase entry", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 purchased for cash Rs.900 after discount Rs.100",
      "Purchases A/c Dr. Rs.900\nTo Cash A/c Rs.900\nTo Discount Received A/c Rs.100",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Unsupported Transaction for ambiguous sale after trade discount", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 sold for Rs.900 after discount Rs.100",
      "Cash A/c Dr. Rs.900\nTo Sales A/c Rs.900",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it("returns Unsupported Transaction for ambiguous purchase after trade discount", async () => {
    const body = await checkEntry(
      "Goods worth Rs.1000 purchased for Rs.900 after discount Rs.100",
      "Purchases A/c Dr. Rs.900\nTo Cash A/c Rs.900",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
    expect(body.score).toBe(0);
  });

  it.each([
    {
      name: "bought goods with part cash and balance credit",
      transactionText: "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "purchased goods with part cash and balance credit",
      transactionText: "Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "bought goods worth with part cash and balance credit",
      transactionText: "Bought goods worth Rs.10000, paid Rs.4000 in cash and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "purchased goods worth with by cash wording",
      transactionText: "Purchased goods worth Rs.10000, paid Rs.4000 by cash and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "paid cash before amount wording",
      transactionText: "Bought goods Rs.10000, paid cash Rs.4000 and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "paid through bank and balance credit",
      transactionText: "Purchased goods Rs.10000, paid Rs.4000 through bank and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Bank A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Bank", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "paid by UPI and balance credit",
      transactionText: "Bought goods Rs.10000, paid Rs.4000 by UPI and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Bank A/c Rs.4000\nTo Creditor A/c Rs.6000",
      credits: [
        { account: "Bank", amount: 4000 },
        { account: "Creditor", amount: 6000 },
      ],
    },
    {
      name: "named supplier with preserved credit balance",
      transactionText: "Purchased goods from Amit Rs.10000, paid Rs.4000 cash and balance on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Amit A/c Rs.6000",
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Amit", amount: 6000 },
      ],
    },
  ])("returns Correct for partial goods purchase: $name", async ({ transactionText, journalEntry, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 10000 }],
      credits,
    });
  });

  it("accepts generic Creditor for a named supplier partial goods purchase", async () => {
    const body = await checkEntry(
      "Purchased goods from Amit Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 10000 }],
      credits: [
        { account: "Cash", amount: 4000 },
        { account: "Amit", amount: 6000 },
      ],
    });
  });

  it("does not depend on the order of partial goods purchase credit lines", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Creditor A/c Rs.6000\nTo Cash A/c Rs.4000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
  });

  it("does not accept full cash credit for partial goods purchase", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept full creditor credit for partial goods purchase", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Creditor A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept only the paid amount as the purchase debit", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.4000\nTo Cash A/c Rs.4000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept a wrong balance amount for partial goods purchase", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it.each([
    {
      transactionText: "Purchased goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nInput GST A/c Dr. Rs.1800\nTo Cash A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    },
    {
      transactionText: "Purchased goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Input GST A/c Dr. Rs.1800\nPurchases A/c Dr. Rs.10000\nTo Cash A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    },
    {
      transactionText: "Purchased goods from Amit Rs.10000 plus GST 18% on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nInput GST A/c Dr. Rs.1800\nTo Amit A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Amit", amount: 11800 }],
    },
    {
      transactionText: "Sold goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
      debits: [{ account: "Cash", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Sold goods to Raju Rs.10000 plus GST 18% on credit",
      journalEntry: "Raju A/c Dr. Rs.11800\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
      debits: [{ account: "Raju", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Sold goods to Raju Rs.10000 plus GST 18% on credit",
      journalEntry: "Raju A/c Dr. Rs.11800\nTo Output GST A/c Rs.1800\nTo Sales A/c Rs.10000",
      debits: [{ account: "Raju", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Purchased goods Rs.10000 plus GST Rs.1800 for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nInput GST A/c Dr. Rs.1800\nTo Cash A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    },
    {
      transactionText: "Sold goods Rs.10000 plus GST Rs.1800 for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
      debits: [{ account: "Cash", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Purchased goods Rs.11800 including GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nInput GST A/c Dr. Rs.1800\nTo Cash A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    },
    {
      transactionText: "Purchased goods Rs.11800 including GST 18% for cash",
      journalEntry: "Input GST A/c Dr. Rs.1800\nPurchases A/c Dr. Rs.10000\nTo Cash A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Cash", amount: 11800 }],
    },
    {
      transactionText: "Purchased goods from Amit Rs.11800 including GST 18% on credit",
      journalEntry: "Purchases A/c Dr. Rs.10000\nInput GST A/c Dr. Rs.1800\nTo Amit A/c Rs.11800",
      debits: [
        { account: "Purchases", amount: 10000 },
        { account: "Input GST", amount: 1800 },
      ],
      credits: [{ account: "Amit", amount: 11800 }],
    },
    {
      transactionText: "Sold goods Rs.11800 including GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
      debits: [{ account: "Cash", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Sold goods to Raju Rs.11800 including GST 18% on credit",
      journalEntry: "Raju A/c Dr. Rs.11800\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
      debits: [{ account: "Raju", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
    {
      transactionText: "Sold goods to Raju Rs.11800 including GST 18% on credit",
      journalEntry: "Raju A/c Dr. Rs.11800\nTo Output GST A/c Rs.1800\nTo Sales A/c Rs.10000",
      debits: [{ account: "Raju", amount: 11800 }],
      credits: [
        { account: "Sales", amount: 10000 },
        { account: "Output GST", amount: 1800 },
      ],
    },
  ])("returns Correct for GST goods transaction: $transactionText", async ({ transactionText, journalEntry, debits, credits }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({ debits, credits });
  });

  it.each([
    {
      transactionText: "Purchased goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.11800\nTo Cash A/c Rs.11800",
    },
    {
      transactionText: "Purchased goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    },
    {
      transactionText: "Purchased goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nOutput GST A/c Dr. Rs.1800\nTo Cash A/c Rs.11800",
    },
    {
      transactionText: "Sold goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Sales A/c Rs.10000",
    },
    {
      transactionText: "Sold goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nTo Sales A/c Rs.11800",
    },
    {
      transactionText: "Sold goods Rs.10000 plus GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nInput GST A/c Dr. Rs.1800\nTo Sales A/c Rs.10000",
    },
    {
      transactionText: "Purchased goods Rs.11800 including GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.11800\nTo Cash A/c Rs.11800",
    },
    {
      transactionText: "Purchased goods Rs.11800 including GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.11800\nInput GST A/c Dr. Rs.0\nTo Cash A/c Rs.11800",
    },
    {
      transactionText: "Purchased goods Rs.11800 including GST 18% for cash",
      journalEntry: "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000",
    },
    {
      transactionText: "Sold goods Rs.11800 including GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.11800\nTo Sales A/c Rs.11800",
    },
    {
      transactionText: "Sold goods Rs.11800 including GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Sales A/c Rs.10000",
    },
    {
      transactionText: "Sold goods Rs.11800 including GST 18% for cash",
      journalEntry: "Cash A/c Dr. Rs.10000\nTo Sales A/c Rs.10000\nTo Output GST A/c Rs.1800",
    },
  ])("does not accept wrong GST goods entry", async ({ transactionText, journalEntry }) => {
    const body = await checkEntry(transactionText, journalEntry);

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for partial goods sale with cash received and balance on credit", async () => {
    const body = await checkEntry(
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
      "Cash A/c Dr. Rs.4000\nDebtor A/c Dr. Rs.6000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [
        { account: "Cash", amount: 4000 },
        { account: "Debtor", amount: 6000 },
      ],
      credits: [{ account: "Sales", amount: 10000 }],
    });
  });

  it("returns Correct for partial goods sale when debit lines are reversed", async () => {
    const body = await checkEntry(
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
      "Debtor A/c Dr. Rs.6000\nCash A/c Dr. Rs.4000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
  });

  it("returns Correct for partial goods sale to a named customer", async () => {
    const body = await checkEntry(
      "Sold goods to Raju Rs.10000, received Rs.4000 cash and balance on credit",
      "Cash A/c Dr. Rs.4000\nRaju A/c Dr. Rs.6000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [
        { account: "Cash", amount: 4000 },
        { account: "Raju", amount: 6000 },
      ],
      credits: [{ account: "Sales", amount: 10000 }],
    });
  });

  it("does not accept full cash debit for partial goods sale", async () => {
    const body = await checkEntry(
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
      "Cash A/c Dr. Rs.10000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept full debtor debit for partial goods sale", async () => {
    const body = await checkEntry(
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
      "Debtor A/c Dr. Rs.10000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for partial goods sale with bank receipt and balance on credit", async () => {
    const body = await checkEntry(
      "Sold goods Rs.10000, received Rs.4000 through bank and balance on credit",
      "Bank A/c Dr. Rs.4000\nDebtor A/c Dr. Rs.6000\nTo Sales A/c Rs.10000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.correct_journal_entry).toEqual({
      debits: [
        { account: "Bank", amount: 4000 },
        { account: "Debtor", amount: 6000 },
      ],
      credits: [{ account: "Sales", amount: 10000 }],
    });
  });

  it("keeps partial machinery purchase unsupported", async () => {
    const body = await checkEntry(
      "Bought machinery Rs.10000, paid Rs.4000 cash and balance on credit",
      "Machinery A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("keeps partial expense payment unsupported", async () => {
    const body = await checkEntry(
      "Paid rent Rs.10000, paid Rs.4000 cash and balance on credit",
      "Rent A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("keeps partial goods purchase without a clear payment mode unsupported", async () => {
    const body = await checkEntry(
      "Bought goods Rs.10000, paid Rs.4000 and balance on credit",
      "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.4000\nTo Creditor A/c Rs.6000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("returns Correct for simple goods sale assumed as cash", async () => {
    const body = await checkEntry(
      "Sold goods Rs.5000",
      "Cash A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.simple_explanation).toContain("Assumption used");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Cash", amount: 5000 }],
      credits: [{ account: "Sales", amount: 5000 }],
    });
  });

  it("returns Correct for named customer goods sale assumed as credit", async () => {
    const body = await checkEntry(
      "Sold goods to Kuldeep Rs.5000",
      "Debtor A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.simple_explanation).toContain("Assumption used");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Kuldeep", amount: 5000 }],
      credits: [{ account: "Sales", amount: 5000 }],
    });
  });

  it("returns Correct for simple goods purchase assumed as cash", async () => {
    const body = await checkEntry(
      "Purchased goods Rs.3000",
      "Purchases A/c Dr. Rs.3000\nTo Cash A/c Rs.3000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.simple_explanation).toContain("Assumption used");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 3000 }],
      credits: [{ account: "Cash", amount: 3000 }],
    });
  });

  it("returns Correct for named supplier goods purchase assumed as credit", async () => {
    const body = await checkEntry(
      "Purchased goods from Kuldeep Rs.3000",
      "Purchases A/c Dr. Rs.3000\nTo Creditor A/c Rs.3000",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.simple_explanation).toContain("Assumption used");
    expect(body.correct_journal_entry).toEqual({
      debits: [{ account: "Purchases", amount: 3000 }],
      credits: [{ account: "Kuldeep", amount: 3000 }],
    });
  });

  it("does not accept credit sale entry for simple goods sale assumed as cash", async () => {
    const body = await checkEntry(
      "Sold goods Rs.5000",
      "Debtor A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept cash sale entry for named customer sale assumed as credit", async () => {
    const body = await checkEntry(
      "Sold goods to Kuldeep Rs.5000",
      "Cash A/c Dr. Rs.5000\nTo Sales A/c Rs.5000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept credit purchase entry for simple goods purchase assumed as cash", async () => {
    const body = await checkEntry(
      "Purchased goods Rs.3000",
      "Purchases A/c Dr. Rs.3000\nTo Creditor A/c Rs.3000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("does not accept cash purchase entry for named supplier purchase assumed as credit", async () => {
    const body = await checkEntry(
      "Purchased goods from Kuldeep Rs.3000",
      "Purchases A/c Dr. Rs.3000\nTo Cash A/c Rs.3000",
    );

    expect(body.result_status).not.toBe("Correct");
    expect(body.score).not.toBe(100);
  });

  it("returns Correct for simple item sale assumed as cash", async () => {
    const body = await checkEntry(
      "Sold mango Rs.500",
      "Cash A/c Dr. Rs.500\nTo Sales A/c Rs.500",
    );

    expect(body.result_status).toBe("Correct");
    expect(body.score).toBe(100);
    expect(body.mistake_type).toBe("correct");
    expect(body.simple_explanation).toContain("Assumption used");
  });

  it("keeps non-goods ambiguous rent unsupported", async () => {
    const body = await checkEntry(
      "Paid rent Rs.5000",
      "Rent A/c Dr. Rs.5000\nTo Cash A/c Rs.5000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("keeps non-goods ambiguous loan unsupported", async () => {
    const body = await checkEntry(
      "Took loan Rs.50000",
      "Cash A/c Dr. Rs.50000\nTo Loan A/c Rs.50000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("keeps non-goods ambiguous interest unsupported", async () => {
    const body = await checkEntry(
      "Received interest Rs.1500",
      "Cash A/c Dr. Rs.1500\nTo Interest A/c Rs.1500",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });

  it("keeps non-goods ambiguous creditor payment unsupported", async () => {
    const body = await checkEntry(
      "Paid creditor Rs.3000",
      "Creditor A/c Dr. Rs.3000\nTo Cash A/c Rs.3000",
    );

    expect(body.result_status).toBe("Unsupported Transaction");
    expect(body.mistake_type).toBe("unsupported_transaction");
  });
});
