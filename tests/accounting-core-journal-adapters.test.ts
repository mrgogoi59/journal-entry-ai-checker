import { describe, expect, it } from "vitest";
import {
  correctJournalEntryToCoreJournalEntry,
  inferAccountRef,
  journalEntriesToCoreJournalEntries,
  parsedJournalEntryToCoreJournalEntry,
} from "@/lib/accounting-core";
import type { CorrectJournalEntry, ParsedJournalEntry } from "@/lib/types";

describe("accounting-core journal entry adapters", () => {
  it("converts a basic correct entry into a core journal entry", () => {
    const existingEntry: CorrectJournalEntry = {
      debits: [{ account: "Cash", amount: 10000 }],
      credits: [{ account: "Sales", amount: 10000 }],
    };

    const coreEntry = correctJournalEntryToCoreJournalEntry(existingEntry);

    expect(coreEntry.topic).toBe("basic");
    expect(coreEntry.lines).toHaveLength(2);
    expect(coreEntry.lines[0]).toMatchObject({
      side: "debit",
      amount: 10000,
      account: { name: "Cash", role: "cash", class: "asset", normalBalance: "debit" },
    });
    expect(coreEntry.lines[1]).toMatchObject({
      side: "credit",
      amount: 10000,
      account: { name: "Sales", role: "sales", class: "income", normalBalance: "credit" },
    });
    expect(total(coreEntry, "debit")).toBe(total(coreEntry, "credit"));
  });

  it("converts a parsed student entry while preserving sides, amounts, and names", () => {
    const parsedEntry: ParsedJournalEntry = {
      debits: [{ account: "Purchases", amount: 5000 }],
      credits: [{ account: "Cash", amount: 5000 }],
      isBalanced: true,
      debitTotal: 5000,
      creditTotal: 5000,
      errors: [],
    };

    const coreEntry = parsedJournalEntryToCoreJournalEntry(parsedEntry, {
      id: "parsed-student-entry",
      transactionText: "Bought goods for cash Rs.5000",
    });

    expect(coreEntry.id).toBe("parsed-student-entry");
    expect(coreEntry.transactionText).toBe("Bought goods for cash Rs.5000");
    expect(coreEntry.lines.map((line) => line.side)).toEqual(["debit", "credit"]);
    expect(coreEntry.lines.map((line) => line.amount)).toEqual([5000, 5000]);
    expect(coreEntry.lines.map((line) => line.account.name)).toEqual(["Purchases", "Cash"]);
    expect(coreEntry.metadata).toMatchObject({ isBalanced: true, debitTotal: 5000, creditTotal: 5000 });
  });

  it("maps Input GST and Output GST accounts", () => {
    const inputGst = inferAccountRef("Input GST A/c");
    const outputGst = inferAccountRef("Output GST A/c");

    expect(inputGst).toMatchObject({
      role: "input_gst",
      class: "asset",
      normalBalance: "debit",
    });
    expect(outputGst).toMatchObject({
      role: "output_gst",
      class: "liability",
      normalBalance: "credit",
    });
  });

  it("maps a partnership revaluation entry", () => {
    const existingEntry: CorrectJournalEntry = {
      debits: [{ account: "Revaluation", amount: 10000 }],
      credits: [{ account: "Machinery", amount: 10000 }],
    };

    const coreEntry = correctJournalEntryToCoreJournalEntry(existingEntry, { topic: "partnership" });

    expect(coreEntry.topic).toBe("partnership");
    expect(coreEntry.lines[0]?.account.role).toBe("revaluation");
    expect(coreEntry.lines[1]?.account).toMatchObject({
      name: "Machinery",
      role: "asset",
      class: "asset",
    });
    expect(total(coreEntry, "debit")).toBe(total(coreEntry, "credit"));
  });

  it("maps a company share issue at premium", () => {
    const existingEntry: CorrectJournalEntry = {
      debits: [{ account: "Bank", amount: 120000 }],
      credits: [
        { account: "Share Capital", amount: 100000 },
        { account: "Securities Premium", amount: 20000 },
      ],
    };

    const coreEntry = correctJournalEntryToCoreJournalEntry(existingEntry, { topic: "company_accounts" });

    expect(coreEntry.topic).toBe("company_accounts");
    expect(coreEntry.lines.filter((line) => line.side === "debit")).toHaveLength(1);
    expect(coreEntry.lines.filter((line) => line.side === "credit")).toHaveLength(2);
    expect(coreEntry.lines.map((line) => line.account.role)).toEqual(
      expect.arrayContaining(["bank", "share_capital", "securities_premium"]),
    );
    expect(total(coreEntry, "debit")).toBe(total(coreEntry, "credit"));
  });

  it("keeps unknown account names without forcing risky role or class mapping", () => {
    const account = inferAccountRef("Student Suspense A/c");

    expect(account.name).toBe("Student Suspense A/c");
    expect(account.role).toBeUndefined();
    expect(account.class).toBeUndefined();
    expect(account.normalBalance).toBeUndefined();
  });

  it("converts multiple entries with deterministic ids", () => {
    const entries: CorrectJournalEntry[] = [
      {
        debits: [{ account: "Cash", amount: 10000 }],
        credits: [{ account: "Capital", amount: 10000 }],
      },
      {
        debits: [{ account: "Purchases", amount: 4000 }],
        credits: [{ account: "Cash", amount: 4000 }],
      },
    ];

    const coreEntries = journalEntriesToCoreJournalEntries(entries, { idPrefix: "test-entry" });

    expect(coreEntries).toHaveLength(2);
    expect(coreEntries.map((entry) => entry.id)).toEqual(["test-entry-1", "test-entry-2"]);
    expect(coreEntries[0]?.lines[0]?.account.role).toBe("cash");
    expect(coreEntries[1]?.lines[0]?.account.role).toBe("purchases");
  });
});

function total(entry: { lines: Array<{ side: "debit" | "credit"; amount: number }> }, side: "debit" | "credit") {
  return entry.lines.filter((line) => line.side === side).reduce((sum, line) => sum + line.amount, 0);
}
