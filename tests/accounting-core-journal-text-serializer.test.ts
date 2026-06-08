import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult } from "@/lib/trial-balance-engine";
import {
  assertSerializableCoreJournalEntry,
  coreJournalEntriesToJournalText,
  coreJournalEntryToJournalText,
  getCoreJournalEntryTotals,
  isCoreJournalEntryBalanced,
  type JournalEntry,
} from "@/lib/accounting-core";

describe("accounting-core journal text serializer", () => {
  it("serializes a basic cash sale accepted by Ledger and Trial Balance", () => {
    const entry = coreEntry("cash-sale", "basic", [debit("Cash", 10000), credit("Sales", 10000)]);
    const output = coreJournalEntryToJournalText(entry);

    expect(output).toContain("Cash A/c");
    expect(output).toContain("Sales A/c");
    expect(output).toContain("Dr.");
    expect(output).toContain("To");
    expect(output).toContain("10000");
    expect(isCoreJournalEntryBalanced(entry)).toBe(true);
    expect(getCoreJournalEntryTotals(entry)).toEqual({ debitTotal: 10000, creditTotal: 10000 });

    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectLedgerAccount(ledger, "Cash");
    expectLedgerAccount(ledger, "Sales");
    expectTrialBalanceBalanced(trialBalance);
  });

  it("serializes one debit and multiple credits", () => {
    const entry = coreEntry("share-issue-premium", "company_accounts", [
      debit("Bank", 120000),
      credit("Share Capital", 100000),
      credit("Securities Premium", 20000),
    ]);
    const output = coreJournalEntryToJournalText(entry);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expectLedgerAccount(ledger, "Bank");
    expectLedgerAccount(ledger, "Share Capital");
    expectLedgerAccount(ledger, "Securities Premium");
    expectTrialBalanceRow(trialBalance, "Bank");
    expectTrialBalanceRow(trialBalance, "Share Capital");
    expectTrialBalanceRow(trialBalance, "Securities Premium");
  });

  it("serializes multiple debits and one credit", () => {
    const entry = coreEntry("debenture-discount", "company_accounts", [
      debit("Bank", 95000),
      debit("Discount on Issue of Debentures", 5000),
      credit("Debentures", 100000),
    ]);
    const output = coreJournalEntryToJournalText(entry);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expectLedgerAccount(ledger, "Bank");
    expectLedgerAccount(ledger, "Discount on Issue of Debentures");
    expectLedgerAccount(ledger, "Debentures");
    expectTrialBalanceRow(trialBalance, "Bank");
    expectTrialBalanceRow(trialBalance, "Discount on Issue of Debentures");
    expectTrialBalanceRow(trialBalance, "Debentures");
  });

  it("serializes multiple entries with a blank line separator", () => {
    const entries = [
      coreEntry("share-first-call-due", "company_accounts", [
        debit("Share First Call", 30000),
        credit("Share Capital", 30000),
      ]),
      coreEntry("share-first-call-receipt", "company_accounts", [
        debit("Bank", 27000),
        debit("Calls in Arrears", 3000),
        credit("Share First Call", 30000),
      ]),
    ];
    const output = coreJournalEntriesToJournalText(entries);
    const trialBalance = generateTrialBalance(output);

    expect(output).toContain("\n\n");
    expectTrialBalanceBalanced(trialBalance);
    expectTrialBalanceRow(trialBalance, "Bank");
    expectTrialBalanceRow(trialBalance, "Calls in Arrears");
    expect(trialBalance.rows.some((row) => row.account === existingEngineAccountName("Share First Call"))).toBe(false);
  });

  it("serializes a Partnership entry accepted by Ledger and Trial Balance", () => {
    const entry = coreEntry("partnership-revaluation", "partnership", [
      debit("Revaluation", 20000),
      credit("Machinery", 20000),
    ]);
    const output = coreJournalEntryToJournalText(entry);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expect(output).toContain("Revaluation A/c");
    expect(output).toContain("Machinery A/c");
    expectLedgerAccount(ledger, "Revaluation");
    expectLedgerAccount(ledger, "Machinery");
    expectTrialBalanceRow(trialBalance, "Revaluation");
    expectTrialBalanceRow(trialBalance, "Machinery");
  });

  it("rejects an unbalanced entry", () => {
    const entry = coreEntry("unbalanced-cash-sale", "basic", [debit("Cash", 10000), credit("Sales", 9000)]);

    expect(isCoreJournalEntryBalanced(entry)).toBe(false);
    expect(() => assertSerializableCoreJournalEntry(entry)).toThrow(/must be balanced/i);
    expect(() => coreJournalEntryToJournalText(entry)).toThrow(/must be balanced/i);
  });

  it("rejects missing debit or credit lines", () => {
    const debitOnly = coreEntry("debit-only", "basic", [debit("Cash", 10000)]);
    const creditOnly = coreEntry("credit-only", "basic", [credit("Sales", 10000)]);

    expect(() => assertSerializableCoreJournalEntry(debitOnly)).toThrow(/credit line/i);
    expect(() => coreJournalEntryToJournalText(debitOnly)).toThrow(/credit line/i);
    expect(() => assertSerializableCoreJournalEntry(creditOnly)).toThrow(/debit line/i);
    expect(() => coreJournalEntryToJournalText(creditOnly)).toThrow(/debit line/i);
  });

  it("rejects zero and negative amounts", () => {
    const zeroAmount = coreEntry("zero-amount", "basic", [debit("Cash", 0), credit("Sales", 0)]);
    const negativeAmount = coreEntry("negative-amount", "basic", [debit("Cash", -100), credit("Sales", -100)]);

    expect(() => assertSerializableCoreJournalEntry(zeroAmount)).toThrow(/greater than zero/i);
    expect(() => coreJournalEntryToJournalText(zeroAmount)).toThrow(/greater than zero/i);
    expect(() => assertSerializableCoreJournalEntry(negativeAmount)).toThrow(/greater than zero/i);
    expect(() => coreJournalEntryToJournalText(negativeAmount)).toThrow(/greater than zero/i);
  });

  it("preserves advanced account names in serialized output", () => {
    const entry = coreEntry("advanced-names", "partnership", [
      debit("Profit and Loss Appropriation", 10000),
      debit("Amit Capital", 5000),
      credit("Share Forfeiture", 15000),
    ]);
    const output = coreJournalEntryToJournalText(entry);

    expect(output).toContain("Profit and Loss Appropriation A/c");
    expect(output).toContain("Amit Capital A/c");
    expect(output).toContain("Share Forfeiture A/c");
  });

  it("does not require topic-specific runtime logic for a mixed advanced batch", () => {
    const entries = [
      coreEntry("mixed-revaluation", "partnership", [debit("Revaluation", 20000), credit("Machinery", 20000)]),
      coreEntry("mixed-share-issue", "company_accounts", [
        debit("Bank", 120000),
        credit("Share Capital", 100000),
        credit("Securities Premium", 20000),
      ]),
      coreEntry("mixed-debenture-interest", "company_accounts", [
        debit("Debenture Interest", 10000),
        credit("Bank", 10000),
      ]),
    ];
    const output = coreJournalEntriesToJournalText(entries);
    const trialBalance = generateTrialBalance(output);

    expectTrialBalanceBalanced(trialBalance);
    expectTrialBalanceRow(trialBalance, "Revaluation");
    expectTrialBalanceRow(trialBalance, "Share Capital");
    expectTrialBalanceRow(trialBalance, "Securities Premium");
    expectTrialBalanceRow(trialBalance, "Debenture Interest");
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

function expectLedgerSuccess(result: LedgerResult): void {
  expect(result.status).toBe("success");
  expect(result.errors).toEqual([]);
}

function expectTrialBalanceBalanced(result: TrialBalanceResult): void {
  expect(result.status).toBe("success");
  expect(result.agrees).toBe(true);
  expect(result.debitTotal).toBe(result.creditTotal);
}

function expectLedgerAccount(result: LedgerResult, accountName: string): void {
  expect(result.ledgerAccounts.some((account) => account.account === existingEngineAccountName(accountName))).toBe(true);
}

function expectTrialBalanceRow(result: TrialBalanceResult, accountName: string): void {
  expect(result.rows.some((row) => row.account === existingEngineAccountName(accountName))).toBe(true);
}

function existingEngineAccountName(accountName: string): string {
  return accountName
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (["GST", "CGST", "SGST", "IGST", "UPI", "GPAY", "NEFT"].includes(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
