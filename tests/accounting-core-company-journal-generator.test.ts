import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult } from "@/lib/trial-balance-engine";
import {
  coreJournalEntriesToJournalText,
  generateCallsInAdvanceReceivedEntry,
  generateCallsInArrearsReceiptEntry,
  generateCompanyJournalScenario,
  generateDebentureInterestPaidEntry,
  generateDebentureIssueAtDiscountEntry,
  generateReissueForfeitedSharesAtDiscountEntry,
  generateShareFirstCallDueEntry,
  generateShareForfeitureEntry,
  generateShareIssueAtPremiumEntry,
  getEntryTotals,
  type JournalEntry,
} from "@/lib/accounting-core";

describe("accounting-core company journal generator", () => {
  it("generates share issue at premium entry", () => {
    const entry = generateShareIssueAtPremiumEntry({
      bankAmount: 120000,
      shareCapitalAmount: 100000,
      securitiesPremiumAmount: 20000,
    });

    expectLine(entry, "Bank A/c", "debit", 120000, "bank", "asset");
    expectLine(entry, "Share Capital A/c", "credit", 100000, "share_capital", "equity");
    expectLine(entry, "Securities Premium A/c", "credit", 20000, "securities_premium", "equity");
    expectDebitCreditCounts(entry, 1, 2);
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates share first call due entry", () => {
    const entry = generateShareFirstCallDueEntry({ callAmount: 30000 });

    expectLine(entry, "Share First Call A/c", "debit", 30000, "share_call", "asset");
    expectLine(entry, "Share Capital A/c", "credit", 30000, "share_capital", "equity");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates calls in arrears receipt entry", () => {
    const entry = generateCallsInArrearsReceiptEntry({
      callDueAmount: 30000,
      bankReceivedAmount: 27000,
      callsInArrearsAmount: 3000,
    });

    expectLine(entry, "Bank A/c", "debit", 27000, "bank", "asset");
    expectLine(entry, "Calls in Arrears A/c", "debit", 3000, "calls_in_arrears", "asset");
    expectLine(entry, "Share First Call A/c", "credit", 30000, "share_call", "asset");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates calls in advance received entry", () => {
    const entry = generateCallsInAdvanceReceivedEntry({ amount: 2000 });

    expectLine(entry, "Bank A/c", "debit", 2000, "bank", "asset");
    expectLine(entry, "Calls in Advance A/c", "credit", 2000, "calls_in_advance", "liability");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates share forfeiture entry", () => {
    const entry = generateShareForfeitureEntry({
      shareCapitalAmount: 10000,
      callsInArrearsAmount: 3000,
      shareForfeitureAmount: 7000,
    });

    expectLine(entry, "Share Capital A/c", "debit", 10000, "share_capital", "equity");
    expectLine(entry, "Calls in Arrears A/c", "credit", 3000, "calls_in_arrears", "asset");
    expectLine(entry, "Share Forfeiture A/c", "credit", 7000, "share_forfeiture", "equity");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates reissue of forfeited shares at discount entry", () => {
    const entry = generateReissueForfeitedSharesAtDiscountEntry({
      shareCapitalAmount: 10000,
      bankReceivedAmount: 8000,
      discountAdjustedFromForfeitureAmount: 2000,
    });

    expectLine(entry, "Bank A/c", "debit", 8000, "bank", "asset");
    expectLine(entry, "Share Forfeiture A/c", "debit", 2000, "share_forfeiture", "equity");
    expectLine(entry, "Share Capital A/c", "credit", 10000, "share_capital", "equity");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates debenture issue at discount entry", () => {
    const entry = generateDebentureIssueAtDiscountEntry({
      debentureAmount: 100000,
      bankReceivedAmount: 95000,
      discountAmount: 5000,
    });

    expectLine(entry, "Bank A/c", "debit", 95000, "bank", "asset");
    expectLine(entry, "Discount on Issue of Debentures A/c", "debit", 5000, "discount_on_issue_of_debentures", "expense");
    expectLine(entry, "Debentures A/c", "credit", 100000, "debenture", "liability");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("generates debenture interest paid entry", () => {
    const entry = generateDebentureInterestPaidEntry({ amount: 10000 });

    expectLine(entry, "Debenture Interest A/c", "debit", 10000, "debenture_interest", "expense");
    expectLine(entry, "Bank A/c", "credit", 10000, "bank", "asset");
    expectBalanced(entry);
    expectEntryCompatible(entry);
  });

  it("wraps a generated entry in a Company Accounts scenario", () => {
    const entry = generateShareFirstCallDueEntry({
      callAmount: 30000,
      transactionText: "First call due on shares Rs.30,000.",
    });
    const scenario = generateCompanyJournalScenario({
      id: "company-first-call-scenario",
      title: "First call due",
      prompt: "First call due on shares Rs.30,000.",
      difficulty: "beginner",
      tags: ["company", "share-call"],
      entry,
    });

    expect(scenario.topic).toBe("company_accounts");
    expect(scenario.expectedJournalEntries).toEqual([entry]);
    expect(scenario.tags).toEqual(["company", "share-call"]);
    expect(scenario.difficulty).toBe("beginner");
    expect(scenario.prompt).toBe("First call due on shares Rs.30,000.");
  });

  it("throws useful errors for invalid amounts and mismatched totals", () => {
    expect(() => generateDebentureInterestPaidEntry({ amount: 0 })).toThrow(/positive finite amount/i);
    expect(() => generateDebentureInterestPaidEntry({ amount: -100 })).toThrow(/positive finite amount/i);
    expect(() => generateDebentureInterestPaidEntry({ amount: Number.POSITIVE_INFINITY })).toThrow(/positive finite amount/i);
    expect(() =>
      generateShareIssueAtPremiumEntry({
        bankAmount: 100000,
        shareCapitalAmount: 90000,
        securitiesPremiumAmount: 5000,
      }),
    ).toThrow(/total mismatch/i);
    expect(() =>
      generateCallsInArrearsReceiptEntry({
        callDueAmount: 30000,
        bankReceivedAmount: 26000,
        callsInArrearsAmount: 3000,
      }),
    ).toThrow(/total mismatch/i);
    expect(() =>
      generateShareForfeitureEntry({
        shareCapitalAmount: 10000,
        callsInArrearsAmount: 2000,
        shareForfeitureAmount: 7000,
      }),
    ).toThrow(/total mismatch/i);
  });

  it("keeps a combined generated Company batch balanced", () => {
    const entries = allGeneratedCompanyEntries();
    const output = coreJournalEntriesToJournalText(entries);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expectLedgerAccount(ledger, "Bank A/c");
    expectLedgerAccount(ledger, "Share Capital A/c");
    expectLedgerAccount(ledger, "Securities Premium A/c");
    expectLedgerAccount(ledger, "Calls in Arrears A/c");
    expectLedgerAccount(ledger, "Calls in Advance A/c");
    expectLedgerAccount(ledger, "Share Forfeiture A/c");
    expectLedgerAccount(ledger, "Debentures A/c");
    expectLedgerAccount(ledger, "Debenture Interest A/c");
  });
});

function allGeneratedCompanyEntries(): JournalEntry[] {
  return [
    generateShareIssueAtPremiumEntry({
      bankAmount: 120000,
      shareCapitalAmount: 100000,
      securitiesPremiumAmount: 20000,
    }),
    generateShareFirstCallDueEntry({ callAmount: 30000 }),
    generateCallsInArrearsReceiptEntry({
      callDueAmount: 30000,
      bankReceivedAmount: 27000,
      callsInArrearsAmount: 3000,
    }),
    generateCallsInAdvanceReceivedEntry({ amount: 2000 }),
    generateShareForfeitureEntry({
      shareCapitalAmount: 10000,
      callsInArrearsAmount: 3000,
      shareForfeitureAmount: 7000,
    }),
    generateReissueForfeitedSharesAtDiscountEntry({
      shareCapitalAmount: 10000,
      bankReceivedAmount: 8000,
      discountAdjustedFromForfeitureAmount: 2000,
    }),
    generateDebentureIssueAtDiscountEntry({
      debentureAmount: 100000,
      bankReceivedAmount: 95000,
      discountAmount: 5000,
    }),
    generateDebentureInterestPaidEntry({ amount: 10000 }),
  ];
}

function expectLine(
  entry: JournalEntry,
  accountName: string,
  side: JournalEntry["lines"][number]["side"],
  amount: number,
  role: string,
  accountClass: string,
): void {
  const line = entry.lines.find((entryLine) => entryLine.account.name === accountName && entryLine.side === side);

  expect(line).toBeDefined();
  expect(line).toMatchObject({
    amount,
    account: {
      name: accountName,
      role,
      class: accountClass,
    },
  });
  expect(line?.account.normalBalance).toBe(expectedNormalBalanceForClass(accountClass));
}

function expectDebitCreditCounts(entry: JournalEntry, debitCount: number, creditCount: number): void {
  expect(entry.lines.filter((line) => line.side === "debit")).toHaveLength(debitCount);
  expect(entry.lines.filter((line) => line.side === "credit")).toHaveLength(creditCount);
}

function expectBalanced(entry: JournalEntry): void {
  const totals = getEntryTotals(entry);

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
  return ["asset", "expense"].includes(accountClass) ? "debit" : "credit";
}
