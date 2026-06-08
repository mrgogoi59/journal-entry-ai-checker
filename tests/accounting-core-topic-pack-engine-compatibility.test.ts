import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerAccount, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult, type TrialBalanceRow } from "@/lib/trial-balance-engine";
import type { AccountingScenario, JournalEntry } from "@/lib/accounting-core";
import {
  allAdvancedScenarioFixtures,
  companyAccountsScenarioFixtures,
  partnershipScenarioFixtures,
} from "./fixtures/accounting-core-topic-packs";

describe("accounting-core topic-pack engine compatibility", () => {
  it("keeps all Partnership scenario fixtures structurally balanced", () => {
    partnershipScenarioFixtures.forEach((scenario) => {
      expect(scenario.topic).toBe("partnership");
      expectScenarioEntriesBalanced(scenario);
    });
  });

  it("keeps all Company Accounts scenario fixtures structurally balanced", () => {
    companyAccountsScenarioFixtures.forEach((scenario) => {
      expect(scenario.topic).toBe("company_accounts");
      expectScenarioEntriesBalanced(scenario);
    });
  });

  it("runs Partnership scenarios through the existing Ledger engine without runtime changes", () => {
    partnershipScenarioFixtures.forEach((scenario) => {
      expectScenarioEntriesBalanced(scenario);

      const result = generateLedger(scenarioToJournalText(scenario));

      expectLedgerSuccess(result);
      expectScenarioAccountsInLedger(result, scenario);
    });

    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Profit and Loss Appropriation")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Amit Capital")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Riya Capital")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Revaluation")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Machinery")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Realisation")),
    ).toBe(true);
    expect(
      partnershipScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), "Assets")),
    ).toBe(true);
  });

  it("runs Company Accounts scenarios through the existing Ledger engine without runtime changes", () => {
    companyAccountsScenarioFixtures.forEach((scenario) => {
      expectScenarioEntriesBalanced(scenario);

      const result = generateLedger(scenarioToJournalText(scenario));

      expectLedgerSuccess(result);
      expectScenarioAccountsInLedger(result, scenario);
    });

    expectCompanyLedgerAccountPresent("Bank");
    expectCompanyLedgerAccountPresent("Share Capital");
    expectCompanyLedgerAccountPresent("Securities Premium");
    expectCompanyLedgerAccountPresent("Share First Call");
    expectCompanyLedgerAccountPresent("Calls in Arrears");
    expectCompanyLedgerAccountPresent("Share Forfeiture");
    expectCompanyLedgerAccountPresent("Debentures");
    expectCompanyLedgerAccountPresent("Debenture Interest");
  });

  it("runs Partnership scenarios through the existing Trial Balance engine as balanced inputs", () => {
    partnershipScenarioFixtures.forEach((scenario) => {
      expectScenarioEntriesBalanced(scenario);

      const result = generateTrialBalance(scenarioToJournalText(scenario));

      expectTrialBalanceBalanced(result);
      expectScenarioNonZeroBalancesInTrialBalance(result, scenario);
    });
  });

  it("runs Company Accounts scenarios through the existing Trial Balance engine as balanced inputs", () => {
    companyAccountsScenarioFixtures.forEach((scenario) => {
      expectScenarioEntriesBalanced(scenario);

      const result = generateTrialBalance(scenarioToJournalText(scenario));

      expectTrialBalanceBalanced(result);
      expectScenarioNonZeroBalancesInTrialBalance(result, scenario);
    });
  });

  it("keeps a combined Partnership and Company scenario batch balanced in existing engines", () => {
    const entries = allAdvancedScenarioFixtures.flatMap((scenario) => scenario.expectedJournalEntries ?? []);
    entries.forEach(expectCoreEntryBalanced);

    const journalText = coreJournalEntriesToSingleJournalTextBlock(entries);
    const ledgerResult = generateLedger(journalText);
    const trialBalanceResult = generateTrialBalance(journalText);

    expectLedgerSuccess(ledgerResult);
    expectTrialBalanceBalanced(trialBalanceResult);
    expect(findLedgerAccount(ledgerResult, "Revaluation")).toBeDefined();
    expect(findLedgerAccount(ledgerResult, "Share Capital")).toBeDefined();
    expect(findLedgerAccount(ledgerResult, "Securities Premium")).toBeDefined();
    expect(findLedgerAccount(ledgerResult, "Share Forfeiture")).toBeDefined();
    expect(findLedgerAccount(ledgerResult, "Debentures")).toBeDefined();
    expect(findTrialBalanceRow(trialBalanceResult, "Revaluation")).toBeDefined();
    expect(findTrialBalanceRow(trialBalanceResult, "Securities Premium")).toBeDefined();
    expect(findTrialBalanceRow(trialBalanceResult, "Debentures")).toBeDefined();
  });

  it("keeps topic-pack fixtures test-only and metadata-only", () => {
    allAdvancedScenarioFixtures.forEach((scenario) => {
      expectNoRuntimeFields(scenario);
      scenario.expectedJournalEntries?.forEach(expectNoRuntimeFields);
    });
  });
});

function coreJournalEntriesToJournalText(entries: JournalEntry[]): string {
  return entries.map(coreJournalEntryToJournalBlock).join("\n\n");
}

function scenarioToJournalText(scenario: AccountingScenario): string {
  return coreJournalEntriesToJournalText(scenario.expectedJournalEntries ?? []);
}

function coreJournalEntriesToSingleJournalTextBlock(entries: JournalEntry[]): string {
  return entries.flatMap((entry) => entry.lines).map(journalLineToText).join("\n");
}

function coreJournalEntryToJournalBlock(entry: JournalEntry): string {
  return entry.lines.map(journalLineToText).join("\n");
}

function journalLineToText(line: JournalEntry["lines"][number]): string {
  return line.side === "debit"
    ? `${line.account.name} A/c Dr. Rs.${line.amount}`
    : `To ${line.account.name} A/c Rs.${line.amount}`;
}

function expectCoreEntryBalanced(entry: JournalEntry): void {
  const debitLines = entry.lines.filter((line) => line.side === "debit");
  const creditLines = entry.lines.filter((line) => line.side === "credit");

  expect(debitLines.length).toBeGreaterThan(0);
  expect(creditLines.length).toBeGreaterThan(0);
  expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
  entry.lines.forEach((line) => {
    expect(line.amount).toBeGreaterThan(0);
  });
}

function expectScenarioEntriesBalanced(scenario: AccountingScenario): void {
  expect(scenario.expectedJournalEntries?.length).toBeGreaterThan(0);
  scenario.expectedJournalEntries?.forEach(expectCoreEntryBalanced);
}

function expectLedgerSuccess(result: LedgerResult): void {
  expect(result.status).toBe("success");
  expect(result.errors).toEqual([]);
  expect(result.ledgerAccounts.length).toBeGreaterThan(0);
}

function expectTrialBalanceBalanced(result: TrialBalanceResult): void {
  expect(result.status).toBe("success");
  expect(result.agrees).toBe(true);
  expect(result.debitTotal).toBe(result.creditTotal);
  expect(result.difference).toBe(0);
}

function findLedgerAccount(result: LedgerResult, accountName: string): LedgerAccount | undefined {
  return result.ledgerAccounts.find((account) => account.account === existingEngineAccountName(accountName));
}

function findTrialBalanceRow(result: TrialBalanceResult, accountName: string): TrialBalanceRow | undefined {
  return result.rows.find((row) => row.account === existingEngineAccountName(accountName));
}

function expectScenarioAccountsInLedger(result: LedgerResult, scenario: AccountingScenario): void {
  scenarioAccountNames(scenario).forEach((accountName) => {
    expect(findLedgerAccount(result, accountName), `${accountName} should appear in ledger`).toBeDefined();
  });
}

function expectScenarioNonZeroBalancesInTrialBalance(result: TrialBalanceResult, scenario: AccountingScenario): void {
  scenarioAccountNames(scenario).forEach((accountName) => {
    const netBalance = Math.abs(scenarioDebitTotalForAccount(scenario, accountName) - scenarioCreditTotalForAccount(scenario, accountName));

    if (netBalance > 0) {
      expect(findTrialBalanceRow(result, accountName), `${accountName} should appear in trial balance`).toBeDefined();
    }
  });
}

function expectCompanyLedgerAccountPresent(accountName: string): void {
  expect(
    companyAccountsScenarioFixtures.some((scenario) => findLedgerAccount(generateLedger(scenarioToJournalText(scenario)), accountName)),
  ).toBe(true);
}

function scenarioAccountNames(scenario: AccountingScenario): string[] {
  return Array.from(
    new Set((scenario.expectedJournalEntries ?? []).flatMap((entry) => entry.lines.map((line) => line.account.name))),
  );
}

function scenarioDebitTotalForAccount(scenario: AccountingScenario, accountName: string): number {
  return scenarioAccountLineTotal(scenario, accountName, "debit");
}

function scenarioCreditTotalForAccount(scenario: AccountingScenario, accountName: string): number {
  return scenarioAccountLineTotal(scenario, accountName, "credit");
}

function scenarioAccountLineTotal(
  scenario: AccountingScenario,
  accountName: string,
  side: JournalEntry["lines"][number]["side"],
): number {
  return (scenario.expectedJournalEntries ?? [])
    .flatMap((entry) => entry.lines)
    .filter((line) => line.account.name === accountName && line.side === side)
    .reduce((sum, line) => sum + line.amount, 0);
}

function entryDebitTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0);
}

function entryCreditTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0);
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

function expectNoRuntimeFields(value: unknown): void {
  const runtimeFields = ["route", "toolPath", "apiPath", "enginePath", "componentPath", "handler", "execute", "generate"];

  expect(value).toBeTruthy();

  if (!value || typeof value !== "object") return;

  runtimeFields.forEach((field) => {
    expect(value).not.toHaveProperty(field);
  });
}
