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

  it("returns ambiguous for paying a named person without context", async () => {
    const body = await solve("Paid Ram ₹5,000");

    expect(body.status).toBe("ambiguous");
    expect(body.ambiguityQuestions.length).toBeGreaterThan(0);
    expect(body.possibleInterpretations.length).toBeGreaterThan(0);
    expect(body.journalEntry).toEqual([]);
  });

  it("does not hallucinate a compound full-settlement discount entry", async () => {
    const body = await solve("Received ₹9,500 from Mohan in full settlement of ₹10,000");

    expect(["unsupported", "ambiguous"]).toContain(body.status);
    expect(body.journalEntry).toEqual([]);
  });

  it("does not hallucinate drawings of goods if the rule engine cannot solve it", async () => {
    const body = await solve("Goods worth ₹2,000 withdrawn by proprietor for personal use");

    expect(body.status).not.toBe("solved");
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
