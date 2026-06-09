import { describe, expect, it } from "vitest";
import {
  allAdvancedScenarioFixtures,
  allAdvancedTopicPackFixtures,
  companyAccountsScenarioFixtures,
  companyAccountsTopicPackFixture,
  partnershipScenarioFixtures,
  partnershipTopicPackFixture,
} from "./fixtures/accounting-core-topic-packs";
import type { AccountingScenario, JournalEntry, TopicPack } from "@/lib/accounting-core";

describe("accounting-core topic pack fixtures", () => {
  it("defines Partnership Accounts topic-pack metadata", () => {
    expect(partnershipTopicPackFixture.id).toBe("partnership");
    expect(partnershipTopicPackFixture.title).toBe("Partnership Accounts");
    expect(partnershipTopicPackFixture.supportedAccountRoles).toEqual(
      expect.arrayContaining([
        "partner_capital",
        "partner_current",
        "partner_drawings",
        "interest_on_capital",
        "interest_on_drawings",
        "partner_salary",
        "partner_commission",
        "profit_and_loss_appropriation",
        "revaluation",
        "goodwill",
        "realisation",
        "asset",
        "liability",
        "bank",
        "cash",
      ]),
    );
    expect(partnershipTopicPackFixture.supportedScenarioTags).toEqual(
      expect.arrayContaining([
        "partnership-basic",
        "appropriation",
        "fixed-capital",
        "fluctuating-capital",
        "admission",
        "revaluation",
        "goodwill",
        "retirement",
        "death",
        "dissolution",
      ]),
    );
    expect(reportTemplateIds(partnershipTopicPackFixture)).toEqual(
      expect.arrayContaining([
        "profit-and-loss-appropriation-account",
        "revaluation-account",
        "realisation-account",
      ]),
    );
  });

  it("defines Company Accounts topic-pack metadata", () => {
    expect(companyAccountsTopicPackFixture.id).toBe("company_accounts");
    expect(companyAccountsTopicPackFixture.title).toBe("Company Accounts");
    expect(companyAccountsTopicPackFixture.supportedAccountRoles).toEqual(
      expect.arrayContaining([
        "share_capital",
        "share_application",
        "share_allotment",
        "share_call",
        "calls_in_arrears",
        "calls_in_advance",
        "share_forfeiture",
        "securities_premium",
        "capital_reserve",
        "debenture",
        "debenture_interest",
        "discount_on_issue_of_debentures",
        "premium_on_redemption_of_debentures",
        "bank",
        "asset",
        "liability",
        "expense",
      ]),
    );
    expect(companyAccountsTopicPackFixture.supportedScenarioTags).toEqual(
      expect.arrayContaining([
        "share-issue",
        "share-premium",
        "application-allotment-call",
        "calls-in-arrears",
        "calls-in-advance",
        "forfeiture",
        "reissue",
        "capital-reserve",
        "debenture-issue",
        "debenture-interest",
        "debenture-redemption",
      ]),
    );
    expect(reportTemplateIds(companyAccountsTopicPackFixture)).toEqual(
      expect.arrayContaining(["share-capital-schedule", "share-forfeiture-working", "debenture-schedule"]),
    );
  });

  it("keeps all scenario ids unique across advanced fixtures", () => {
    const ids = allAdvancedScenarioFixtures.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps all partnership scenario journal entries balanced", () => {
    partnershipScenarioFixtures.forEach(expectScenarioJournalEntriesBalanced);
  });

  it("keeps all company scenario journal entries balanced", () => {
    companyAccountsScenarioFixtures.forEach(expectScenarioJournalEntriesBalanced);
  });

  it("covers required partnership roles", () => {
    expect(scenarioRoles(partnershipScenarioFixtures)).toEqual(
      expect.arrayContaining([
        "bank",
        "interest_on_capital",
        "profit_and_loss_appropriation",
        "partner_capital",
        "partner_current",
        "partner_drawings",
        "cash",
        "interest_on_drawings",
        "revaluation",
        "realisation",
      ]),
    );
  });

  it("covers required company account roles", () => {
    expect(scenarioRoles(companyAccountsScenarioFixtures)).toEqual(
      expect.arrayContaining([
        "share_application",
        "share_capital",
        "share_call",
        "calls_in_arrears",
        "calls_in_advance",
        "share_forfeiture",
        "securities_premium",
        "debenture",
        "debenture_interest",
      ]),
    );
  });

  it("documents the current metadata-to-fixture audit gaps without adding runtime wiring", () => {
    expect(unprovenClaimedRoles(partnershipTopicPackFixture, partnershipScenarioFixtures)).toEqual([
      "partner_salary",
      "partner_commission",
      "goodwill",
      "liability",
    ]);
    expect(unprovenClaimedTags(partnershipTopicPackFixture, partnershipScenarioFixtures)).toEqual(["retirement", "death"]);

    expect(unprovenClaimedRoles(companyAccountsTopicPackFixture, companyAccountsScenarioFixtures)).toEqual([
      "share_allotment",
      "capital_reserve",
      "premium_on_redemption_of_debentures",
      "asset",
      "liability",
      "expense",
    ]);
    expect(unprovenClaimedTags(companyAccountsTopicPackFixture, companyAccountsScenarioFixtures)).toEqual([]);
  });

  it("does not claim runtime implementation details", () => {
    allAdvancedTopicPackFixtures.forEach((topicPack) => {
      expect(topicPack).not.toHaveProperty("route");
      expect(topicPack).not.toHaveProperty("toolPath");
      expect(topicPack).not.toHaveProperty("apiPath");
      expect(topicPack).not.toHaveProperty("enginePath");
      expect(topicPack.metadata).not.toMatchObject({
        route: expect.any(String),
        toolPath: expect.any(String),
        apiPath: expect.any(String),
        enginePath: expect.any(String),
      });
    });
  });

  it("keeps report templates as metadata only", () => {
    allAdvancedTopicPackFixtures.forEach((topicPack) => {
      topicPack.reportTemplates?.forEach((template) => {
        expect(template.id).toBeTruthy();
        expect(template.title).toBeTruthy();
        expect(template).not.toHaveProperty("generate");
        expect(template).not.toHaveProperty("buildReport");
        expect(template).not.toHaveProperty("handler");
      });
    });
  });

  it("keeps all scenario fixtures structurally beginner-safe", () => {
    allAdvancedScenarioFixtures.forEach((scenario) => {
      expect(scenario.title).toBeTruthy();
      expect(scenario.prompt).toBeTruthy();
      expect(scenario.topic).toBeTruthy();
      expect(scenario.difficulty).toBeTruthy();
      expect(scenario.tags?.length).toBeGreaterThan(0);
      expect(scenario.expectedJournalEntries?.length).toBeGreaterThan(0);
    });
  });
});

function reportTemplateIds(topicPack: TopicPack): string[] {
  return topicPack.reportTemplates?.map((template) => template.id) ?? [];
}

function expectScenarioJournalEntriesBalanced(scenario: AccountingScenario): void {
  expect(scenario.expectedJournalEntries?.length).toBeGreaterThan(0);

  scenario.expectedJournalEntries?.forEach((entry) => {
    expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
    expect(entryDebitTotal(entry)).toBeGreaterThan(0);
    expect(entry.lines.some((line) => line.side === "debit")).toBe(true);
    expect(entry.lines.some((line) => line.side === "credit")).toBe(true);
    entry.lines.forEach((line) => {
      expect(line.amount).toBeGreaterThan(0);
    });
  });
}

function scenarioRoles(scenarios: AccountingScenario[]): string[] {
  return Array.from(
    new Set(
      scenarios.flatMap((scenario) =>
        (scenario.expectedJournalEntries ?? []).flatMap((entry) =>
          entry.lines.flatMap((line) => (line.account.role ? [line.account.role] : [])),
        ),
      ),
    ),
  );
}

function scenarioTags(scenarios: AccountingScenario[]): string[] {
  return Array.from(new Set(scenarios.flatMap((scenario) => scenario.tags ?? [])));
}

function unprovenClaimedRoles(topicPack: TopicPack, scenarios: AccountingScenario[]): string[] {
  const coveredRoles = new Set(scenarioRoles(scenarios));
  return (topicPack.supportedAccountRoles ?? []).filter((role) => !coveredRoles.has(role));
}

function unprovenClaimedTags(topicPack: TopicPack, scenarios: AccountingScenario[]): string[] {
  const coveredTags = new Set(scenarioTags(scenarios));
  return (topicPack.supportedScenarioTags ?? []).filter((tag) => !coveredTags.has(tag));
}

function entryDebitTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0);
}

function entryCreditTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0);
}
