import { describe, expect, it } from "vitest";
import { generateTrialBalance, type TrialBalanceResult, type TrialBalanceRow } from "@/lib/trial-balance-engine";
import type { JournalEntry } from "@/lib/accounting-core";

describe("accounting-core trial balance compatibility", () => {
  it("prepares a trial balance for a basic cash sale", () => {
    const entry = coreEntry("core-basic-cash-sale-tb", "basic", [
      debit("Cash", 10000),
      credit("Sales", 10000),
    ]);

    expectCoreEntriesBalanced([entry]);

    const result = generateTrialBalance(coreJournalEntriesToJournalText([entry]));

    expectTrialBalanceBalanced(result);
    expect(getDebitTotal(result)).toBe(10000);
    expect(getCreditTotal(result)).toBe(10000);
    expect(findRowByAccountName(result, "Cash")).toEqual({ account: "Cash", debit: 10000, credit: 0 });
    expect(findRowByAccountName(result, "Sales")).toEqual({ account: "Sales", debit: 0, credit: 10000 });
  });

  it("prepares a trial balance for a partnership revaluation entry", () => {
    const entry = coreEntry("core-partnership-revaluation-tb", "partnership", [
      debit("Revaluation", 20000),
      credit("Machinery", 20000),
    ]);

    expectCoreEntriesBalanced([entry]);

    const result = generateTrialBalance(coreJournalEntriesToJournalText([entry]));

    expectTrialBalanceBalanced(result);
    expect(findRowByAccountName(result, "Revaluation")).toEqual({
      account: "Revaluation",
      debit: 20000,
      credit: 0,
    });
    expect(findRowByAccountName(result, "Machinery")).toEqual({
      account: "Machinery",
      debit: 0,
      credit: 20000,
    });
  });

  it("prepares a trial balance for a partnership appropriation multi-credit entry", () => {
    const entry = coreEntry("core-partnership-appropriation-tb", "partnership", [
      debit("Profit And Loss Appropriation", 30000),
      credit("Partner Salary", 10000),
      credit("Partner Capital", 20000),
    ]);

    expectCoreEntriesBalanced([entry]);

    const result = generateTrialBalance(coreJournalEntriesToJournalText([entry]));

    expectTrialBalanceBalanced(result);
    expect(getDebitTotal(result)).toBe(30000);
    expect(getCreditTotal(result)).toBe(30000);
    expect(findRowByAccountName(result, "Profit And Loss Appropriation")).toEqual({
      account: "Profit And Loss Appropriation",
      debit: 30000,
      credit: 0,
    });
    expect(findRowByAccountName(result, "Partner Salary")).toEqual({
      account: "Partner Salary",
      debit: 0,
      credit: 10000,
    });
    expect(findRowByAccountName(result, "Partner Capital")).toEqual({
      account: "Partner Capital",
      debit: 0,
      credit: 20000,
    });
  });

  it("prepares a trial balance for company share issue at premium", () => {
    const entry = coreEntry("core-company-share-premium-tb", "company_accounts", [
      debit("Bank", 120000),
      credit("Share Capital", 100000),
      credit("Securities Premium", 20000),
    ]);

    expectCoreEntriesBalanced([entry]);

    const result = generateTrialBalance(coreJournalEntriesToJournalText([entry]));

    expectTrialBalanceBalanced(result);
    expect(getDebitTotal(result)).toBe(120000);
    expect(getCreditTotal(result)).toBe(120000);
    expect(findRowByAccountName(result, "Bank")).toEqual({ account: "Bank", debit: 120000, credit: 0 });
    expect(findRowByAccountName(result, "Share Capital")).toEqual({
      account: "Share Capital",
      debit: 0,
      credit: 100000,
    });
    expect(findRowByAccountName(result, "Securities Premium")).toEqual({
      account: "Securities Premium",
      debit: 0,
      credit: 20000,
    });
  });

  it("prepares a trial balance for a calls in arrears sequence", () => {
    const entries = [
      coreEntry("core-share-first-call-due-tb", "company_accounts", [
        debit("Share First Call", 30000),
        credit("Share Capital", 30000),
      ]),
      coreEntry("core-share-first-call-receipt-tb", "company_accounts", [
        debit("Bank", 27000),
        debit("Calls In Arrears", 3000),
        credit("Share First Call", 30000),
      ]),
    ];

    expectCoreEntriesBalanced(entries);

    const result = generateTrialBalance(coreJournalEntriesToJournalText(entries));

    expectTrialBalanceBalanced(result);
    expect(findRowByAccountName(result, "Bank")).toEqual({ account: "Bank", debit: 27000, credit: 0 });
    expect(findRowByAccountName(result, "Calls In Arrears")).toEqual({
      account: "Calls In Arrears",
      debit: 3000,
      credit: 0,
    });
    expect(findRowByAccountName(result, "Share Capital")).toEqual({
      account: "Share Capital",
      debit: 0,
      credit: 30000,
    });
    expect(result.rows.some((row) => row.account === "Share First Call")).toBe(false);
  });

  it("prepares a trial balance for share forfeiture and reissue entries", () => {
    const entries = [
      coreEntry("core-share-forfeiture-tb", "company_accounts", [
        debit("Share Capital", 10000),
        credit("Calls In Arrears", 3000),
        credit("Share Forfeiture", 7000),
      ]),
      coreEntry("core-share-reissue-tb", "company_accounts", [
        debit("Bank", 8000),
        debit("Share Forfeiture", 2000),
        credit("Share Capital", 10000),
      ]),
    ];

    expectCoreEntriesBalanced(entries);

    const result = generateTrialBalance(coreJournalEntriesToJournalText(entries));

    expectTrialBalanceBalanced(result);
    expect(findRowByAccountName(result, "Bank")).toEqual({ account: "Bank", debit: 8000, credit: 0 });
    expect(findRowByAccountName(result, "Calls In Arrears")).toEqual({
      account: "Calls In Arrears",
      debit: 0,
      credit: 3000,
    });
    expect(findRowByAccountName(result, "Share Forfeiture")).toEqual({
      account: "Share Forfeiture",
      debit: 0,
      credit: 5000,
    });
    expect(result.rows.some((row) => row.account === "Share Capital")).toBe(false);
  });

  it("prepares a trial balance for debenture issue at discount", () => {
    const entry = coreEntry("core-debenture-discount-tb", "company_accounts", [
      debit("Bank", 95000),
      debit("Discount On Issue Of Debentures", 5000),
      credit("Debentures", 100000),
    ]);

    expectCoreEntriesBalanced([entry]);

    const result = generateTrialBalance(coreJournalEntriesToJournalText([entry]));

    expectTrialBalanceBalanced(result);
    expect(getDebitTotal(result)).toBe(100000);
    expect(getCreditTotal(result)).toBe(100000);
    expect(findRowByAccountName(result, "Bank")).toEqual({ account: "Bank", debit: 95000, credit: 0 });
    expect(findRowByAccountName(result, "Discount On Issue Of Debentures")).toEqual({
      account: "Discount On Issue Of Debentures",
      debit: 5000,
      credit: 0,
    });
    expect(findRowByAccountName(result, "Debentures")).toEqual({
      account: "Debentures",
      debit: 0,
      credit: 100000,
    });
  });

  it("keeps mixed advanced entries balanced and preserves account names", () => {
    const entries = [
      coreEntry("core-mixed-revaluation-tb", "partnership", [
        debit("Revaluation", 20000),
        credit("Machinery", 20000),
      ]),
      coreEntry("core-mixed-share-premium-tb", "company_accounts", [
        debit("Bank", 120000),
        credit("Share Capital", 100000),
        credit("Securities Premium", 20000),
      ]),
      coreEntry("core-mixed-debenture-interest-tb", "company_accounts", [
        debit("Debenture Interest", 10000),
        credit("Bank", 10000),
      ]),
    ];

    expectCoreEntriesBalanced(entries);

    const result = generateTrialBalance(coreJournalEntriesToJournalText(entries));

    expectTrialBalanceBalanced(result);
    expect(findRowByAccountName(result, "Revaluation")).toMatchObject({ debit: 20000 });
    expect(findRowByAccountName(result, "Machinery")).toMatchObject({ credit: 20000 });
    expect(findRowByAccountName(result, "Bank")).toMatchObject({ debit: 110000 });
    expect(findRowByAccountName(result, "Share Capital")).toMatchObject({ credit: 100000 });
    expect(findRowByAccountName(result, "Securities Premium")).toMatchObject({ credit: 20000 });
    expect(findRowByAccountName(result, "Debenture Interest")).toMatchObject({ debit: 10000 });
  });
});

function coreEntry(id: string, topic: JournalEntry["topic"], lines: JournalEntry["lines"]): JournalEntry {
  return { id, topic, lines };
}

function debit(accountName: string, amount: number): JournalEntry["lines"][number] {
  return {
    account: { name: accountName },
    side: "debit",
    amount,
  };
}

function credit(accountName: string, amount: number): JournalEntry["lines"][number] {
  return {
    account: { name: accountName },
    side: "credit",
    amount,
  };
}

function coreJournalEntriesToJournalText(entries: JournalEntry[]): string {
  return entries.map(coreJournalEntryToJournalBlock).join("\n\n");
}

function coreJournalEntryToJournalBlock(entry: JournalEntry): string {
  return entry.lines
    .map((line) =>
      line.side === "debit"
        ? `${line.account.name} A/c Dr. Rs.${line.amount}`
        : `To ${line.account.name} A/c Rs.${line.amount}`,
    )
    .join("\n");
}

function getTrialBalanceRows(result: TrialBalanceResult): TrialBalanceRow[] {
  return result.rows;
}

function getDebitTotal(result: TrialBalanceResult): number {
  return result.debitTotal;
}

function getCreditTotal(result: TrialBalanceResult): number {
  return result.creditTotal;
}

function findRowByAccountName(result: TrialBalanceResult, accountName: string): TrialBalanceRow {
  const row = getTrialBalanceRows(result).find((trialBalanceRow) => trialBalanceRow.account === accountName);
  expect(row).toBeDefined();
  return row!;
}

function expectTrialBalanceBalanced(result: TrialBalanceResult): void {
  expect(result.status).toBe("success");
  expect(result.agrees).toBe(true);
  expect(result.difference).toBe(0);
  expect(getDebitTotal(result)).toBe(getCreditTotal(result));
}

function expectCoreEntriesBalanced(entries: JournalEntry[]): void {
  entries.forEach((entry) => {
    expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
    expect(entryDebitTotal(entry)).toBeGreaterThan(0);
  });
}

function entryDebitTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0);
}

function entryCreditTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0);
}
