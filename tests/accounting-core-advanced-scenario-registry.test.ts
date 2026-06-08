import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerResult } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult } from "@/lib/trial-balance-engine";
import {
  ADVANCED_SCENARIO_REGISTRY_VERSION,
  advancedAccountingScenarios,
  advancedCompanyScenarios,
  advancedPartnershipScenarios,
  coreJournalEntriesToJournalText,
  coreJournalEntryToJournalText,
  getAdvancedScenarioById,
  getAdvancedScenarioIds,
  getAdvancedScenariosByTopic,
  isCoreJournalEntryBalanced,
  type AccountingScenario,
  type JournalEntry,
} from "@/lib/accounting-core";

const expectedScenarioIds = [
  "partnership-partner-salary-allowed",
  "partnership-interest-on-capital-allowed",
  "partnership-interest-on-drawings-charged",
  "partnership-revaluation-loss-machinery",
  "partnership-goodwill-compensation",
  "partnership-dissolution-assets-transfer",
  "company-share-issue-at-premium",
  "company-share-first-call-due",
  "company-calls-in-arrears-first-call",
  "company-calls-in-advance-received",
  "company-share-forfeiture",
  "company-reissue-forfeited-shares-discount",
  "company-debenture-issue-discount",
  "company-debenture-interest-paid",
];

describe("accounting-core advanced scenario registry", () => {
  it("contains Partnership and Company scenarios", () => {
    expect(ADVANCED_SCENARIO_REGISTRY_VERSION).toBe("advanced-scenario-registry-v1");
    expect(advancedPartnershipScenarios.length).toBeGreaterThanOrEqual(6);
    expect(advancedCompanyScenarios.length).toBeGreaterThanOrEqual(7);
    expect(advancedAccountingScenarios.length).toBeGreaterThanOrEqual(13);
  });

  it("keeps scenario ids unique and deterministic", () => {
    const ids = getAdvancedScenarioIds();

    expect(ids).toEqual(expectedScenarioIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns scenarios by matching topic only", () => {
    const partnershipScenarios = getAdvancedScenariosByTopic("partnership");
    const companyScenarios = getAdvancedScenariosByTopic("company_accounts");
    const basicScenarios = getAdvancedScenariosByTopic("basic");

    expect(partnershipScenarios.length).toBe(advancedPartnershipScenarios.length);
    expect(companyScenarios.length).toBe(advancedCompanyScenarios.length);
    expect(basicScenarios).toEqual([]);
    expect(partnershipScenarios.every((scenario) => scenario.topic === "partnership")).toBe(true);
    expect(companyScenarios.every((scenario) => scenario.topic === "company_accounts")).toBe(true);
    expect(partnershipScenarios).not.toBe(advancedPartnershipScenarios);
    expect(companyScenarios).not.toBe(advancedCompanyScenarios);
  });

  it("finds known scenarios by id", () => {
    expect(getAdvancedScenarioById("partnership-partner-salary-allowed")?.topic).toBe("partnership");
    expect(getAdvancedScenarioById("company-share-issue-at-premium")?.topic).toBe("company_accounts");
    expect(getAdvancedScenarioById("unknown-advanced-scenario")).toBeUndefined();
  });

  it("keeps all expected journal entries balanced", () => {
    advancedAccountingScenarios.forEach((scenario) => {
      expect(scenario.expectedJournalEntries?.length).toBeGreaterThan(0);
      expect(scenario.difficulty).toMatch(/^(beginner|intermediate)$/);
      expect(scenario.tags?.length).toBeGreaterThan(0);

      scenario.expectedJournalEntries?.forEach((entry) => {
        expect(entry.transactionText).toBe(scenario.prompt);
        expect(entry.narration || entry.explanation).toBeTruthy();
        expect(entry.lines.some((line) => line.side === "debit")).toBe(true);
        expect(entry.lines.some((line) => line.side === "credit")).toBe(true);
        expect(isCoreJournalEntryBalanced(entry)).toBe(true);

        entry.lines.forEach((line) => {
          expect(line.amount).toBeGreaterThan(0);
          expect(line.account.name).toBeTruthy();
          expect(line.account.role).toBeTruthy();
          expect(line.account.class).toBeTruthy();
        });
      });
    });
  });

  it("serializes all scenarios to existing journal text", () => {
    advancedAccountingScenarios.forEach((scenario) => {
      const entries = scenario.expectedJournalEntries ?? [];
      const output = coreJournalEntriesToJournalText(entries);

      expect(output.trim().length).toBeGreaterThan(0);
      entries.flatMap((entry) => entry.lines).forEach((line) => {
        expect(output).toContain(line.account.name);
      });
    });
  });

  it("flows every scenario through the existing Ledger engine", () => {
    advancedAccountingScenarios.forEach((scenario) => {
      const ledger = generateLedger(coreJournalEntriesToJournalText(scenario.expectedJournalEntries ?? []));

      expectLedgerSuccess(ledger);
      scenarioAccountNames(scenario).forEach((accountName) => {
        expectLedgerAccount(ledger, accountName);
      });
    });
  });

  it("flows every scenario through the existing Trial Balance engine", () => {
    advancedAccountingScenarios.forEach((scenario) => {
      const trialBalance = generateTrialBalance(coreJournalEntriesToJournalText(scenario.expectedJournalEntries ?? []));

      expectTrialBalanceBalanced(trialBalance);
    });
  });

  it("keeps a combined advanced scenario batch balanced", () => {
    const combinedEntry = combinedJournalEntry(advancedAccountingScenarios.flatMap((scenario) => scenario.expectedJournalEntries ?? []));
    const output = coreJournalEntryToJournalText(combinedEntry);
    const ledger = generateLedger(output);
    const trialBalance = generateTrialBalance(output);

    expectLedgerSuccess(ledger);
    expectTrialBalanceBalanced(trialBalance);
    expectLedgerAccount(ledger, "Profit and Loss Appropriation A/c");
    expectLedgerAccount(ledger, "Revaluation A/c");
    expectLedgerAccount(ledger, "Share Capital A/c");
    expectLedgerAccount(ledger, "Calls in Arrears A/c");
    expectLedgerAccount(ledger, "Share Forfeiture A/c");
    expectLedgerAccount(ledger, "Debentures A/c");
  });

  it("keeps the registry hidden with no runtime or UI claims", () => {
    advancedAccountingScenarios.forEach((scenario) => {
      expectNoRuntimeFields(scenario);
      scenario.expectedJournalEntries?.forEach((entry) => {
        expectNoRuntimeFields(entry);
        entry.lines.forEach((line) => {
          expectNoRuntimeFields(line);
          expectNoRuntimeFields(line.account);
        });
      });
    });
  });
});

function combinedJournalEntry(entries: JournalEntry[]): JournalEntry {
  return {
    id: "combined-advanced-scenario-batch",
    topic: "company_accounts",
    transactionText: "Combined hidden advanced scenario batch.",
    lines: entries.flatMap((entry) => entry.lines),
    narration: "Combined static advanced registry batch for compatibility testing.",
  };
}

function scenarioAccountNames(scenario: AccountingScenario): string[] {
  return Array.from(
    new Set((scenario.expectedJournalEntries ?? []).flatMap((entry) => entry.lines.map((line) => line.account.name))),
  );
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

function expectNoRuntimeFields(value: unknown): void {
  const runtimeFields = [
    "route",
    "toolPath",
    "apiPath",
    "enginePath",
    "componentPath",
    "handler",
    "execute",
    "generate",
    "calculate",
  ];

  expect(value).toBeTruthy();

  if (!value || typeof value !== "object") return;

  runtimeFields.forEach((field) => {
    expect(value).not.toHaveProperty(field);
  });
}
