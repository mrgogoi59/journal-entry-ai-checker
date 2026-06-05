import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/journal-entry-solver/route";
import type { JournalEntrySolverResponse, SolverMode } from "@/lib/types";

async function solve(transaction: string, mode: SolverMode = "beginner"): Promise<JournalEntrySolverResponse> {
  const request = new Request("http://localhost/api/journal-entry-solver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction, mode }),
  });

  const response = await POST(request);
  expect(response.status).toBe(200);
  return (await response.json()) as JournalEntrySolverResponse;
}

describe("POST /api/journal-entry-solver", () => {
  it("solves goods purchased for cash", async () => {
    const body = await solve("Bought goods for cash ₹10,000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Purchases A/c", debit: 10000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 10000 },
    ]);
    expect(body.affectedAccounts.map((account) => account.account)).toEqual(["Purchases A/c", "Cash A/c"]);
    expect(body.narration).toEqual(expect.any(String));
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves partial goods purchase with part cash and balance credit", async () => {
    const body = await solve("Bought goods Rs.10000, paid Rs.4000 cash and balance on credit");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Purchases A/c", debit: 10000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 4000 },
      { account: "Creditor A/c", debit: 0, credit: 6000 },
    ]);
    expect(body.affectedAccounts.map((account) => account.account)).toEqual([
      "Purchases A/c",
      "Cash A/c",
      "Creditor A/c",
    ]);
    expect(body.narration).toBe("Being goods purchased, ₹4,000 paid in cash and balance ₹6,000 on credit.");
    expect(body.stepByStepExplanation).toEqual([
      "Goods worth ₹10,000 were purchased.",
      "Purchases A/c is debited for the full purchase value.",
      "₹4,000 was paid immediately, so Cash A/c is credited.",
      "The remaining ₹6,000 is payable, so Creditor A/c is credited.",
    ]);
    expect(body.commonMistakes).toContain(
      "Do not credit Cash for the full ₹10,000 because only ₹4,000 was paid immediately.",
    );
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves partial goods purchase from a named supplier", async () => {
    const body = await solve("Purchased goods from Amit Rs.10000, paid Rs.4000 cash and balance on credit");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Purchases A/c", debit: 10000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 4000 },
      { account: "Amit A/c", debit: 0, credit: 6000 },
    ]);
    expect(body.affectedAccounts[2]).toMatchObject({
      account: "Amit A/c",
      traditionalType: "Personal Account",
      modernType: "Liability / Creditor",
      debitOrCredit: "Credit",
      effect: "Amount payable increased by ₹6,000",
    });
    expect(body.practiceQuestion.expectedPattern).toBe("Purchases A/c Dr. To Cash A/c, To Amit A/c");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves partial goods sale with part cash and balance credit", async () => {
    const body = await solve("Sold goods Rs.10000, received Rs.4000 cash and balance on credit");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 4000, credit: 0 },
      { account: "Debtor A/c", debit: 6000, credit: 0 },
      { account: "Sales A/c", debit: 0, credit: 10000 },
    ]);
    expect(body.affectedAccounts.map((account) => account.account)).toEqual([
      "Cash A/c",
      "Debtor A/c",
      "Sales A/c",
    ]);
    expect(body.narration).toBe("Being goods sold, ₹4,000 received in cash and balance ₹6,000 on credit.");
    expect(body.stepByStepExplanation).toEqual([
      "Goods worth ₹10,000 were sold.",
      "₹4,000 was received immediately, so Cash A/c is debited.",
      "The remaining ₹6,000 is receivable on credit, so Debtor A/c is debited.",
      "Sales A/c is credited for the full sale value.",
    ]);
    expect(body.commonMistakes).toContain(
      "Do not debit Cash for the full ₹10,000 because only ₹4,000 was received immediately.",
    );
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves goods sold to a named customer on credit using the party name", async () => {
    const body = await solve("Sold goods to Mohan on credit ₹12,000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Mohan A/c", debit: 12000, credit: 0 },
      { account: "Sales A/c", debit: 0, credit: 12000 },
    ]);
  });

  it("solves capital introduced in cash", async () => {
    const body = await solve("Started business with cash ₹50,000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 50000, credit: 0 },
      { account: "Capital A/c", debit: 0, credit: 50000 },
    ]);
  });

  it("solves cash deposited into bank", async () => {
    const body = await solve("Deposited cash into bank ₹20,000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Bank A/c", debit: 20000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 20000 },
    ]);
  });

  it("solves salary outstanding", async () => {
    const body = await solve("Salary outstanding Rs.6000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Salary Expense A/c", debit: 6000, credit: 0 },
      { account: "Outstanding Salary A/c", debit: 0, credit: 6000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Salary Expense A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Outstanding Salary A/c",
      traditionalType: "Personal Account / Representative Personal Account",
      modernType: "Liability",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being salary outstanding.");
    expect(body.stepByStepExplanation).toEqual([
      "Salary expense has been incurred.",
      "The salary has not yet been paid.",
      "Salary Expense A/c is debited because expenses are debited.",
      "Outstanding Salary A/c is credited because it is a liability/payable.",
    ]);
    expect(body.commonMistakes).toContain("Do not credit Cash or Bank because no payment has been made yet.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves electricity bill outstanding", async () => {
    const body = await solve("Electricity bill outstanding Rs.2000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Electricity Expense A/c", debit: 2000, credit: 0 },
      { account: "Outstanding Electricity A/c", debit: 0, credit: 2000 },
    ]);
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Outstanding Electricity A/c",
      modernType: "Liability",
      debitOrCredit: "Credit",
    });
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves prepaid rent", async () => {
    const body = await solve("Prepaid rent Rs.5000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Prepaid Rent A/c", debit: 5000, credit: 0 },
      { account: "Rent Expense A/c", debit: 0, credit: 5000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Prepaid Rent A/c",
      traditionalType: "Real Account",
      modernType: "Asset",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Rent Expense A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being rent prepaid.");
    expect(body.stepByStepExplanation).toEqual([
      "Rent has been paid in advance.",
      "The advance rent gives future benefit to the business.",
      "Prepaid Rent A/c is debited because it is an asset.",
      "Rent Expense A/c is credited because the current period expense is reduced.",
    ]);
    expect(body.commonMistakes).toContain("Prepaid expense is an asset, not an expense.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves prepaid insurance", async () => {
    const body = await solve("Prepaid insurance Rs.3000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Prepaid Insurance A/c", debit: 3000, credit: 0 },
      { account: "Insurance Expense A/c", debit: 0, credit: 3000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Prepaid Insurance A/c",
      modernType: "Asset",
      debitOrCredit: "Debit",
    });
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves accrued interest", async () => {
    const body = await solve("Interest accrued Rs.1500");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Accrued Interest A/c", debit: 1500, credit: 0 },
      { account: "Interest Income A/c", debit: 0, credit: 1500 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Accrued Interest A/c",
      traditionalType: "Personal Account / Representative Personal Account",
      modernType: "Asset / Receivable",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Interest Income A/c",
      traditionalType: "Nominal Account",
      modernType: "Income/Revenue",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being interest accrued.");
    expect(body.stepByStepExplanation).toEqual([
      "Interest income has been earned.",
      "The amount has not yet been received.",
      "Accrued Interest A/c is debited because it is an asset/receivable.",
      "Interest Income A/c is credited because income has increased.",
    ]);
    expect(body.commonMistakes).toContain("Accrued income is an asset/receivable.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves accrued commission", async () => {
    const body = await solve("Commission accrued Rs.3000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Accrued Commission A/c", debit: 3000, credit: 0 },
      { account: "Commission Income A/c", debit: 0, credit: 3000 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves accrued rent using Rent Income", async () => {
    const body = await solve("Rent accrued Rs.4000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Accrued Rent A/c", debit: 4000, credit: 0 },
      { account: "Rent Income A/c", debit: 0, credit: 4000 },
    ]);
    expect(body.journalEntry).not.toContainEqual({ account: "Rent Expense A/c", debit: 0, credit: 4000 });
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves rent received in advance using Rent Income", async () => {
    const body = await solve("Rent received in advance Rs.4000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Rent Income A/c", debit: 4000, credit: 0 },
      { account: "Rent Received in Advance A/c", debit: 0, credit: 4000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Rent Income A/c",
      traditionalType: "Nominal Account",
      modernType: "Income/Revenue",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Rent Received in Advance A/c",
      traditionalType: "Personal Account / Representative Personal Account",
      modernType: "Liability",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being rent received in advance adjusted.");
    expect(body.stepByStepExplanation).toEqual([
      "Rent has been received before it is earned.",
      "The unearned portion does not belong to the current period's income.",
      "Rent Income A/c is debited because income is reduced.",
      "Rent Received in Advance A/c is credited because it is a liability.",
    ]);
    expect(body.commonMistakes).toContain("Income received in advance is a liability, not income of the current period.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves commission received in advance", async () => {
    const body = await solve("Commission received in advance Rs.3000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Commission Income A/c", debit: 3000, credit: 0 },
      { account: "Commission Received in Advance A/c", debit: 0, credit: 3000 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves interest received in advance", async () => {
    const body = await solve("Interest received in advance Rs.1500");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Interest Income A/c", debit: 1500, credit: 0 },
      { account: "Interest Received in Advance A/c", debit: 0, credit: 1500 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves discount allowed full settlement", async () => {
    const body = await solve("Received Rs.9500 from Mohan in full settlement of Rs.10000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 9500, credit: 0 },
      { account: "Discount Allowed A/c", debit: 500, credit: 0 },
      { account: "Mohan A/c", debit: 0, credit: 10000 },
    ]);
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Discount Allowed A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Loss",
      debitOrCredit: "Debit",
    });
    expect(body.narration).toBe("Being amount received from Mohan in full settlement and discount allowed.");
    expect(body.stepByStepExplanation).toContain("The difference ₹500 is discount allowed.");
    expect(body.commonMistakes).toContain("Do not ignore discount allowed.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves discount received full settlement", async () => {
    const body = await solve("Paid Rs.4500 to Ram in full settlement of Rs.5000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Ram A/c", debit: 5000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 4500 },
      { account: "Discount Received A/c", debit: 0, credit: 500 },
    ]);
    expect(body.affectedAccounts[2]).toMatchObject({
      account: "Discount Received A/c",
      traditionalType: "Nominal Account",
      modernType: "Income / Gain",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being amount paid to Ram in full settlement and discount received.");
    expect(body.stepByStepExplanation).toContain("The difference ₹500 is discount received.");
    expect(body.commonMistakes).toContain("Do not ignore discount received.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves generic debtor discount allowed with explicit discount", async () => {
    const body = await solve("Received Rs.9500 from debtor and allowed discount Rs.500");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 9500, credit: 0 },
      { account: "Discount Allowed A/c", debit: 500, credit: 0 },
      { account: "Debtor A/c", debit: 0, credit: 10000 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves generic creditor discount received with explicit discount", async () => {
    const body = await solve("Paid Rs.4500 to creditor and received discount Rs.500");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Creditor A/c", debit: 5000, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 4500 },
      { account: "Discount Received A/c", debit: 0, credit: 500 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves depreciation charged on machinery", async () => {
    const body = await solve("Depreciation charged on machinery Rs.5000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Depreciation A/c", debit: 5000, credit: 0 },
      { account: "Machinery A/c", debit: 0, credit: 5000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Depreciation A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      debitOrCredit: "Debit",
      ruleApplied: "Debit all expenses and losses",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Machinery A/c",
      traditionalType: "Real Account",
      modernType: "Asset",
      debitOrCredit: "Credit",
      ruleApplied: "Credit what goes out / Asset decreases are credited",
    });
    expect(body.narration).toBe("Being depreciation charged on machinery.");
    expect(body.stepByStepExplanation).toEqual([
      "Machinery A/c is used in business and loses value over time.",
      "This loss in value is called depreciation.",
      "Depreciation is an expense/loss, so Depreciation A/c is debited.",
      "Machinery A/c value decreases, so Machinery A/c is credited.",
    ]);
    expect(body.commonMistakes).toContain("Depreciation is a non-cash expense.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves generic bad debts written off", async () => {
    const body = await solve("Bad debts written off Rs.2000");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Bad Debts A/c", debit: 2000, credit: 0 },
      { account: "Debtor A/c", debit: 0, credit: 2000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Bad Debts A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Loss",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Debtor A/c",
      traditionalType: "Personal Account",
      modernType: "Asset / Debtor",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being bad debts written off.");
    expect(body.stepByStepExplanation).toEqual([
      "The amount due from debtor is no longer recoverable.",
      "This loss is called bad debt.",
      "Bad Debts A/c is debited because losses are debited.",
      "Debtor A/c is credited because the receivable from debtor is reduced.",
    ]);
    expect(body.commonMistakes).toContain("Bad debts written off is a non-cash loss.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves named debtor bad debt written off", async () => {
    const body = await solve("Raju became insolvent and Rs.1000 became bad debt");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Bad Debts A/c", debit: 1000, credit: 0 },
      { account: "Raju A/c", debit: 0, credit: 1000 },
    ]);
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Raju A/c",
      traditionalType: "Personal Account",
      modernType: "Asset / Debtor",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being amount due from Raju written off as bad debt.");
    expect(body.stepByStepExplanation[0]).toBe("The amount due from Raju is no longer recoverable.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("returns ambiguous for paying a named person without context", async () => {
    const body = await solve("Paid Ram ₹5,000");

    expect(body.status).toBe("ambiguous");
    expect(body.ambiguityQuestions.length).toBeGreaterThan(0);
    expect(body.possibleInterpretations.length).toBeGreaterThan(0);
    expect(body.journalEntry).toEqual([]);
  });

  it("solves full-settlement discount entry", async () => {
    const body = await solve("Received ₹9,500 from Mohan in full settlement of ₹10,000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 9500, credit: 0 },
      { account: "Discount Allowed A/c", debit: 500, credit: 0 },
      { account: "Mohan A/c", debit: 0, credit: 10000 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves goods withdrawn by proprietor for personal use", async () => {
    const body = await solve("Goods worth ₹2,000 withdrawn by proprietor for personal use");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Drawings A/c", debit: 2000, credit: 0 },
      { account: "Purchases A/c", debit: 0, credit: 2000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Drawings A/c",
      traditionalType: "Personal Account",
      modernType: "Capital reduction / Owner's withdrawal",
      debitOrCredit: "Debit",
    });
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Purchases A/c",
      modernType: "Expense / Goods purchased for resale",
      debitOrCredit: "Credit",
    });
    expect(body.stepByStepExplanation).toEqual([
      "The proprietor/owner took business goods for personal use.",
      "This is treated as drawings because the owner withdrew value from the business.",
      "Drawings A/c is debited because drawings increase.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ]);
    expect(body.commonMistakes).toContain("Do not use Sales A/c because this is not a sale.");
    expect(body.narration).toBe("Being goods withdrawn by proprietor for personal use.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves owner took goods for personal use", async () => {
    const body = await solve("Owner took goods Rs.1500 for personal use");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Drawings A/c", debit: 1500, credit: 0 },
      { account: "Purchases A/c", debit: 0, credit: 1500 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("does not solve depreciation when the asset is missing", async () => {
    const body = await solve("Depreciation charged Rs.5000");

    expect(["unsupported", "ambiguous"]).toContain(body.status);
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve depreciation on an unknown asset", async () => {
    const body = await solve("Depreciation charged on unknown asset Rs.5000");

    expect(["unsupported", "ambiguous"]).toContain(body.status);
    expect(body.journalEntry).toEqual([]);
  });

  it("solves bad debts recovered in cash", async () => {
    const body = await solve("Bad debts recovered Rs.500 in cash");

    expect(body.status).toBe("solved");
    expect(body.confidence).toBe("high");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 500, credit: 0 },
      { account: "Bad Debts Recovered A/c", debit: 0, credit: 500 },
    ]);
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Bad Debts Recovered A/c",
      traditionalType: "Nominal Account",
      modernType: "Income / Gain",
      debitOrCredit: "Credit",
    });
    expect(body.narration).toBe("Being bad debts recovered in cash.");
    expect(body.stepByStepExplanation).toEqual([
      "An amount earlier written off as bad debt has now been recovered.",
      "Cash is received, so Cash A/c is debited.",
      "Bad Debts Recovered is an income/gain, so it is credited.",
      "The entry records the recovery of the earlier bad debt.",
    ]);
    expect(body.commonMistakes).toContain("Bad Debts Recovered is income/gain, not an expense.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves bad debts recovered through bank", async () => {
    const body = await solve("Bad debts recovered Rs.500 through bank");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Bank A/c", debit: 500, credit: 0 },
      { account: "Bad Debts Recovered A/c", debit: 0, credit: 500 },
    ]);
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("solves named bad debts recovery without crediting the debtor", async () => {
    const body = await solve("Bad debts recovered from Raju Rs.500 in cash");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Cash A/c", debit: 500, credit: 0 },
      { account: "Bad Debts Recovered A/c", debit: 0, credit: 500 },
    ]);
    expect(body.journalEntry).not.toContainEqual({ account: "Raju A/c", debit: 0, credit: 500 });
    expect(body.narration).toBe("Being bad debts previously written off recovered from Raju.");
    expect(totalDebits(body)).toBe(totalCredits(body));
  });

  it("does not solve provision for doubtful debts yet", async () => {
    const body = await solve("Provision for doubtful debts created Rs.1000");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve bad debts recovery transferred to provision", async () => {
    const body = await solve("Bad debts recovered and transferred to provision for doubtful debts Rs.500");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve standalone discount allowed", async () => {
    const body = await solve("Discount allowed Rs.500");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve unsupported trade discount wording", async () => {
    const body = await solve("Sold goods Rs.10000 less trade discount 10%");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve GST with discount", async () => {
    const body = await solve("Sold goods Rs.10000 plus GST and allowed discount Rs.500");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve GST yet", async () => {
    const body = await solve("GST paid Rs.1000");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve goods distributed as free sample yet", async () => {
    const body = await solve("Goods distributed as free sample Rs.1000");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("does not solve goods lost by fire yet", async () => {
    const body = await solve("Goods lost by fire Rs.3000");

    expect(body.status).toBe("unsupported");
    expect(body.journalEntry).toEqual([]);
  });

  it("explains named credit sale as a debtor personal account", async () => {
    const body = await solve("Sold goods to Raju Rs.5000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Raju A/c", debit: 5000, credit: 0 },
      { account: "Sales A/c", debit: 0, credit: 5000 },
    ]);
    expect(body.affectedAccounts[0]).toMatchObject({
      account: "Raju A/c",
      traditionalType: "Personal Account",
      modernType: "Asset / Debtor",
      debitOrCredit: "Debit",
    });
  });

  it("explains named credit purchase as a creditor personal account", async () => {
    const body = await solve("Purchased goods from Amit Rs.3000");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Purchases A/c", debit: 3000, credit: 0 },
      { account: "Amit A/c", debit: 0, credit: 3000 },
    ]);
    expect(body.affectedAccounts[1]).toMatchObject({
      account: "Amit A/c",
      traditionalType: "Personal Account",
      modernType: "Liability / Creditor",
      debitOrCredit: "Credit",
    });
  });

  it("credits Cash instead of party name when named asset purchase says cash", async () => {
    const body = await solve("Purchase machinery from Kuldeep for cash Rs.500");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Machinery A/c", debit: 500, credit: 0 },
      { account: "Cash A/c", debit: 0, credit: 500 },
    ]);
  });

  it("explains UPI payment to a named creditor as Bank payment", async () => {
    const body = await solve("Paid Rs.7000 to Amit through UPI");

    expect(body.status).toBe("solved");
    expect(body.journalEntry).toEqual([
      { account: "Amit A/c", debit: 7000, credit: 0 },
      { account: "Bank A/c", debit: 0, credit: 7000 },
    ]);
  });
});

function totalDebits(response: JournalEntrySolverResponse): number {
  return response.journalEntry.reduce((total, line) => total + line.debit, 0);
}

function totalCredits(response: JournalEntrySolverResponse): number {
  return response.journalEntry.reduce((total, line) => total + line.credit, 0);
}
