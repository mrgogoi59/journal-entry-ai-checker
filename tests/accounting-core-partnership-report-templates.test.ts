import { describe, expect, it } from "vitest";
import type { AccountingReport } from "@/lib/accounting-core";
import { partnershipTopicPackFixture } from "./fixtures/accounting-core-topic-packs";
import {
  partnershipReportExampleFixtures,
  partnershipReportTemplateFixtures,
  partnershipReportTemplateIds,
  type PartnershipReportTemplateFixture,
} from "./fixtures/accounting-core-partnership-report-templates";

const requiredTemplateIds = [
  "profit-and-loss-appropriation-account",
  "partner-capital-accounts",
  "partner-current-accounts",
  "revaluation-account",
  "realisation-account",
  "bank-cash-settlement",
];

describe("accounting-core partnership report-template fixtures", () => {
  it("defines all required Partnership report template ids", () => {
    expect(partnershipReportTemplateIds).toEqual(expect.arrayContaining(requiredTemplateIds));
    expect(new Set(partnershipReportTemplateIds).size).toBe(partnershipReportTemplateIds.length);
  });

  it("keeps template metadata beginner-safe and complete", () => {
    partnershipReportTemplateFixtures.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.purpose).toBeTruthy();
      expect(template.beginnerExplanation).toBeTruthy();
      expect(template.supportedAccountRoles.length).toBeGreaterThan(0);
      expect(template.sections.length).toBeGreaterThan(0);

      template.sections.forEach((section) => {
        expect(section.id).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.description).toBeTruthy();
      });
    });
  });

  it("matches the Partnership topic-pack report template ids", () => {
    const topicPackTemplateIds = partnershipTopicPackFixture.reportTemplates?.map((template) => template.id) ?? [];

    topicPackTemplateIds.forEach((templateId) => {
      expect(partnershipReportTemplateIds).toContain(templateId);
    });
    requiredTemplateIds.forEach((templateId) => {
      expect(topicPackTemplateIds).toContain(templateId);
    });
  });

  it("does not claim runtime implementation details", () => {
    partnershipReportTemplateFixtures.forEach((template) => {
      expectNoRuntimeFields(template);
      template.sections.forEach(expectNoRuntimeFields);
    });

    partnershipReportExampleFixtures.forEach((report) => {
      expectNoRuntimeFields(report);
      report.sections.forEach((section) => {
        expectNoRuntimeFields(section);
        section.rows.forEach(expectNoRuntimeFields);
      });
    });
  });

  it("keeps report example fixtures as valid AccountingReport structures", () => {
    partnershipReportExampleFixtures.forEach((report) => {
      expectValidAccountingReport(report);
    });
  });

  it("represents a simple Profit and Loss Appropriation Account", () => {
    const report = findReport("sample-profit-and-loss-appropriation-report");

    expect(findRowAmount(report, "Net Profit")).toBe(50000);
    expect(findRowAmount(report, "Partner salary to Amit")).toBe(10000);
    expect(findRowAmount(report, "Interest on capital to Riya")).toBe(5000);
    expect(findRowAmount(report, "Interest on capital to Amit")).toBe(5000);
    expect(findRowAmount(report, "Riya profit share")).toBe(15000);
    expect(findRowAmount(report, "Amit profit share")).toBe(15000);
  });

  it("represents a simple Revaluation Account loss", () => {
    const report = findReport("sample-revaluation-report");

    expect(findRowAmount(report, "Machinery decreased")).toBe(20000);
    expect(findRowAmount(report, "Riya Capital - loss transfer")).toBe(10000);
    expect(findRowAmount(report, "Amit Capital - loss transfer")).toBe(10000);
  });

  it("represents a simple Realisation Account settlement", () => {
    const report = findReport("sample-realisation-report");

    expect(findRowAmount(report, "Assets transferred")).toBe(100000);
    expect(findRowAmount(report, "Liabilities transferred")).toBe(30000);
    expect(findRowAmount(report, "Assets realised")).toBe(80000);
    expect(findRowAmount(report, "Realisation expenses")).toBe(5000);
    expect(findSection(report, "realisation-profit-or-loss-transfer").total).toBe(25000);
  });

  it("represents simple Partner Capital Account movements", () => {
    const report = findReport("sample-partner-capital-report");

    expect(findRowAmount(report, "Riya opening capital")).toBe(100000);
    expect(findRowAmount(report, "Amit opening capital")).toBe(100000);
    expect(findRowAmount(report, "Riya drawings")).toBe(10000);
    expect(findRowAmount(report, "Amit drawings")).toBe(8000);
    expect(findRowAmount(report, "Riya profit share")).toBe(15000);
    expect(findRowAmount(report, "Amit profit share")).toBe(15000);
  });

  it("keeps fixtures metadata-only with no executable fields", () => {
    partnershipReportTemplateFixtures.forEach((template) => {
      expectNoRuntimeFields(template);
      expectNoExecutableValues(template);
    });

    partnershipReportExampleFixtures.forEach((report) => {
      expectNoRuntimeFields(report);
      expectNoExecutableValues(report);
    });
  });
});

function expectValidAccountingReport(report: AccountingReport): void {
  expect(report.id).toBeTruthy();
  expect(report.title).toBeTruthy();
  expect(report.topic).toBe("partnership");
  expect(report.sections.length).toBeGreaterThan(0);

  report.sections.forEach((section) => {
    expect(section.id).toBeTruthy();
    expect(section.title).toBeTruthy();
    expect(section.rows.length).toBeGreaterThan(0);

    section.rows.forEach((row) => {
      expect(row.label).toBeTruthy();
      expectNonNegativeNumberIfPresent(row.amount);
      expectNonNegativeNumberIfPresent(row.debit);
      expectNonNegativeNumberIfPresent(row.credit);
    });
  });
}

function findReport(reportId: string): AccountingReport {
  const report = partnershipReportExampleFixtures.find((example) => example.id === reportId);
  expect(report).toBeDefined();
  return report!;
}

function findSection(report: AccountingReport, sectionId: string): AccountingReport["sections"][number] {
  const section = report.sections.find((reportSection) => reportSection.id === sectionId);
  expect(section).toBeDefined();
  return section!;
}

function findRowAmount(report: AccountingReport, label: string): number | undefined {
  const row = report.sections.flatMap((section) => section.rows).find((reportRow) => reportRow.label === label);
  expect(row).toBeDefined();
  return row?.amount;
}

function expectNonNegativeNumberIfPresent(value: number | undefined): void {
  if (value === undefined) return;

  expect(typeof value).toBe("number");
  expect(value).toBeGreaterThanOrEqual(0);
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

function expectNoExecutableValues(templateOrReport: PartnershipReportTemplateFixture | AccountingReport): void {
  Object.values(templateOrReport).forEach((value) => {
    expect(typeof value).not.toBe("function");
  });
}
