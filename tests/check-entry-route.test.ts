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
});
