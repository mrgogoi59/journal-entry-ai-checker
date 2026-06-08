import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult } from "@/lib/trial-balance-engine";
import {
  coreJournalEntriesToJournalText,
  generateGoodwillCompensationEntry,
  generateInterestOnCapitalAllowedEntry,
  generateInterestOnDrawingsChargedEntry,
  generatePartnerCommissionAllowedEntry,
  generatePartnerSalaryAllowedEntry,
  generatePartnershipJournalScenario,
  generateRealisationAssetTransferEntry,
  generateRealisationExpensePaidEntry,
  generateRealisationLiabilityTransferEntry,
  generateRevaluationGainOnAssetEntry,
  generateRevaluationLossOnAssetEntry,
  getCoreJournalEntryTotals,
  type JournalEntry,
} from "@/lib/accounting-core";

describe("accounting-core partnership journal generator", () => {
  it("generates partner salary allowed entry", () => {
    const entry = generatePartnerSalaryAllowedEntry({ partnerName: "Amit", amount: 10000 });

    expect(entry.topic).toBe("partnership");
    expectLine(entry, "Profit and Loss Appropriation A/c", "debit", 10000, "profit_and_loss_appropriation", "memorandum");
    expectLine(entry, "Amit Capital A/c", "credit", 10000, "partner_capital", "equity", "Amit");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates interest on capital allowed to two partners", () => {
    const entry = generateInterestOnCapitalAllowedEntry({
      partnerAmounts: [
        { partnerName: "Riya", amount: 5000 },
        { partnerName: "Amit", amount: 5000 },
      ],
    });

    expectLine(entry, "Profit and Loss Appropriation A/c", "debit", 10000, "profit_and_loss_appropriation", "memorandum");
    expectLine(entry, "Riya Capital A/c", "credit", 5000, "partner_capital", "equity", "Riya");
    expectLine(entry, "Amit Capital A/c", "credit", 5000, "partner_capital", "equity", "Amit");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates interest on drawings charged entry", () => {
    const entry = generateInterestOnDrawingsChargedEntry({ partnerName: "Riya", amount: 2000 });

    expectLine(entry, "Riya Capital A/c", "debit", 2000, "partner_capital", "equity", "Riya");
    expectLine(entry, "Interest on Drawings A/c", "credit", 2000, "interest_on_drawings", "income");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates partner commission allowed entry", () => {
    const entry = generatePartnerCommissionAllowedEntry({ partnerName: "Amit", amount: 6000 });

    expectLine(entry, "Profit and Loss Appropriation A/c", "debit", 6000, "profit_and_loss_appropriation", "memorandum");
    expectLine(entry, "Amit Capital A/c", "credit", 6000, "partner_capital", "equity", "Amit");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates revaluation loss on asset entry", () => {
    const entry = generateRevaluationLossOnAssetEntry({ assetAccountName: "Machinery A/c", amount: 20000 });

    expectLine(entry, "Revaluation A/c", "debit", 20000, "revaluation", "memorandum");
    expectLine(entry, "Machinery A/c", "credit", 20000, "asset", "asset");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates revaluation gain on asset entry", () => {
    const entry = generateRevaluationGainOnAssetEntry({ assetAccountName: "Machinery A/c", amount: 15000 });

    expectLine(entry, "Machinery A/c", "debit", 15000, "asset", "asset");
    expectLine(entry, "Revaluation A/c", "credit", 15000, "revaluation", "memorandum");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates goodwill compensation entry", () => {
    const entry = generateGoodwillCompensationEntry({
      gainingPartnerName: "Neha",
      sacrificingPartnerName: "Riya",
      amount: 15000,
    });

    expectLine(entry, "Neha Capital A/c", "debit", 15000, "partner_capital", "equity", "Neha");
    expectLine(entry, "Riya Capital A/c", "credit", 15000, "partner_capital", "equity", "Riya");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates realisation asset transfer entry", () => {
    const entry = generateRealisationAssetTransferEntry({ assetAccountName: "Assets A/c", amount: 50000 });

    expectLine(entry, "Realisation A/c", "debit", 50000, "realisation", "memorandum");
    expectLine(entry, "Assets A/c", "credit", 50000, "asset", "asset");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates realisation liability transfer entry", () => {
    const entry = generateRealisationLiabilityTransferEntry({ liabilityAccountName: "Liabilities A/c", amount: 30000 });

    expectLine(entry, "Liabilities A/c", "debit", 30000, "liability", "liability");
    expectLine(entry, "Realisation A/c", "credit", 30000, "realisation", "memorandum");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates realisation expense paid entry", () => {
    const entry = generateRealisationExpensePaidEntry({ amount: 5000, paidFrom: "bank" });

    expectLine(entry, "Realisation A/c", "debit", 5000, "realisation", "memorandum");
    expectLine(entry, "Bank A/c", "credit", 5000, "bank", "asset");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("wraps a generated entry in a Partnership scenario", () => {
    const entry = generatePartnerSalaryAllowedEntry({
      partnerName: "Amit",
      amount: 10000,
      transactionText: "Amit is allowed partner salary of Rs.10,000.",
    });
    const scenario = generatePartnershipJournalScenario({
      id: "partnership-salary-scenario",
      title: "Partner salary allowed",
      prompt: "Amit is allowed partner salary of Rs.10,000.",
      difficulty: "beginner",
      tags: ["partnership", "appropriation", "partner-salary"],
      entry,
    });

    expect(scenario.topic).toBe("partnership");
    expect(scenario.expectedJournalEntries).toEqual([entry]);
    expect(scenario.tags).toEqual(["partnership", "appropriation", "partner-salary"]);
    expect(scenario.difficulty).toBe("beginner");
    expect(scenario.prompt).toBe("Amit is allowed partner salary of Rs.10,000.");
  });

  it("throws useful errors for invalid inputs", () => {
    expect(() => generatePartnerSalaryAllowedEntry({ partnerName: "Amit", amount: 0 })).toThrow(/greater than zero/i);
    expect(() => generatePartnerSalaryAllowedEntry({ partnerName: "Amit", amount: -100 })).toThrow(/greater than zero/i);
    expect(() => generatePartnerSalaryAllowedEntry({ partnerName: "Amit", amount: Number.NaN })).toThrow(/greater than zero/i);
    expect(() => generatePartnerSalaryAllowedEntry({ partnerName: " ", amount: 10000 })).toThrow(/partner name is required/i);
    expect(() => generateRevaluationLossOnAssetEntry({ assetAccountName: " ", amount: 10000 })).toThrow(/account name is required/i);
    expect(() => generateInterestOnCapitalAllowedEntry({ partnerAmounts: [] })).toThrow(/at least one partner amount/i);
    expect(() =>
      generateInterestOnCapitalAllowedEntry({
        partnerAmounts: [{ partnerName: "Riya", amount: 0 }],
      }),
    ).toThrow(/greater than zero/i);
  });

  it("keeps a combined generated Partnership batch balanced", () => {
    const entries = allGeneratedPartnershipEntries();
    const output = coreJournalEntriesToJournalText(entries);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expectLedgerAccount(ledger, "Profit and Loss Appropriation A/c");
    expectLedgerAccount(ledger, "Amit Capital A/c");
    expectLedgerAccount(ledger, "Riya Capital A/c");
    expectLedgerAccount(ledger, "Revaluation A/c");
    expectLedgerAccount(ledger, "Machinery A/c");
    expectLedgerAccount(ledger, "Realisation A/c");
    expectLedgerAccount(ledger, "Assets A/c");
    expectLedgerAccount(ledger, "Liabilities A/c");
  });
});

function allGeneratedPartnershipEntries(): JournalEntry[] {
  return [
    generatePartnerSalaryAllowedEntry({ partnerName: "Amit", amount: 10000 }),
    generateInterestOnCapitalAllowedEntry({
      partnerAmounts: [
        { partnerName: "Riya", amount: 5000 },
        { partnerName: "Amit", amount: 5000 },
      ],
    }),
    generateInterestOnDrawingsChargedEntry({ partnerName: "Riya", amount: 2000 }),
    generatePartnerCommissionAllowedEntry({ partnerName: "Amit", amount: 6000 }),
    generateRevaluationLossOnAssetEntry({ assetAccountName: "Machinery A/c", amount: 20000 }),
    generateRevaluationGainOnAssetEntry({ assetAccountName: "Machinery A/c", amount: 15000 }),
    generateGoodwillCompensationEntry({ gainingPartnerName: "Neha", sacrificingPartnerName: "Riya", amount: 15000 }),
    generateRealisationAssetTransferEntry({ assetAccountName: "Assets A/c", amount: 50000 }),
    generateRealisationLiabilityTransferEntry({ liabilityAccountName: "Liabilities A/c", amount: 30000 }),
    generateRealisationExpensePaidEntry({ amount: 5000, paidFrom: "bank" }),
  ];
}

function expectLine(
  entry: JournalEntry,
  accountName: string,
  side: JournalEntry["lines"][number]["side"],
  amount: number,
  role: string,
  accountClass: string,
  ownerName?: string,
): void {
  const line = entry.lines.find((entryLine) => entryLine.account.name === accountName && entryLine.side === side);

  expect(line).toBeDefined();
  expect(line).toMatchObject({
    amount,
    account: {
      name: accountName,
      role,
      class: accountClass,
      normalBalance: expectedNormalBalanceForClass(accountClass),
      ...(ownerName ? { ownerName } : {}),
    },
  });
}

function expectBalanced(entry: JournalEntry): void {
  const totals = getCoreJournalEntryTotals(entry);

  expect(totals.debitTotal).toBe(totals.creditTotal);
  expect(totals.debitTotal).toBeGreaterThan(0);
}

function expectEntryCompatible(entry: JournalEntry): void {
  const output = coreJournalEntriesToJournalText([entry]);
  const ledger = generateLedger(output);
  const trialBalance = generateTrialBalance(output);

  expectLedgerSuccess(ledger);
  expectTrialBalanceBalanced(trialBalance);
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

function existingEngineAccountName(accountName: string): string {
  return accountName
    .replace(/\s+a\/c$/i, "")
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

function expectedNormalBalanceForClass(accountClass: string): string {
  if (["asset", "expense", "contra_equity", "memorandum"].includes(accountClass)) return "debit";
  return "credit";
}
