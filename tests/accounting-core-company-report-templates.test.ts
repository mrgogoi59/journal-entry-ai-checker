import { describe, expect, it } from "vitest";
import type { AccountingReport } from "@/lib/accounting-core";
import { companyAccountsTopicPackFixture } from "./fixtures/accounting-core-topic-packs";
import {
  companyReportExampleFixtures,
  companyReportTemplateFixtures,
  companyReportTemplateIds,
  type CompanyReportTemplateFixture,
} from "./fixtures/accounting-core-company-report-templates";

const requiredTemplateIds = [
  "share-capital-schedule",
  "calls-in-arrears-and-advance-working",
  "share-forfeiture-working",
  "capital-reserve-working",
  "debenture-schedule",
  "company-balance-sheet-notes",
];

describe("accounting-core company report-template fixtures", () => {
  it("defines all required Company report template ids", () => {
    expect(companyReportTemplateIds).toEqual(expect.arrayContaining(requiredTemplateIds));
    expect(new Set(companyReportTemplateIds).size).toBe(companyReportTemplateIds.length);
  });

  it("keeps template metadata beginner-safe and complete", () => {
    companyReportTemplateFixtures.forEach((template) => {
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

  it("matches the Company Accounts topic-pack report template ids", () => {
    const topicPackTemplateIds = companyAccountsTopicPackFixture.reportTemplates?.map((template) => template.id) ?? [];

    topicPackTemplateIds.forEach((templateId) => {
      expect(companyReportTemplateIds).toContain(templateId);
    });
    requiredTemplateIds.forEach((templateId) => {
      expect(topicPackTemplateIds).toContain(templateId);
    });
  });

  it("does not claim runtime implementation details", () => {
    companyReportTemplateFixtures.forEach((template) => {
      expectNoRuntimeFields(template);
      template.sections.forEach(expectNoRuntimeFields);
    });

    companyReportExampleFixtures.forEach((report) => {
      expectNoRuntimeFields(report);
      report.sections.forEach((section) => {
        expectNoRuntimeFields(section);
        section.rows.forEach(expectNoRuntimeFields);
      });
    });
  });

  it("keeps report example fixtures as valid AccountingReport structures", () => {
    companyReportExampleFixtures.forEach((report) => {
      expectValidAccountingReport(report);
    });
  });

  it("represents a simple Share Capital Schedule", () => {
    const report = findReport("sample-share-capital-schedule");

    expect(findRowAmount(report, "Authorised Capital")).toBe(500000);
    expect(findRowAmount(report, "Issued Capital")).toBe(200000);
    expect(findRowAmount(report, "Called-up Capital")).toBe(150000);
    expect(findRowAmount(report, "Paid-up Capital")).toBe(147000);
    expect(findRowAmount(report, "Calls in Arrears")).toBe(3000);
    expect(findRowAmount(report, "Securities Premium")).toBe(20000);
  });

  it("represents Calls in Arrears and Calls in Advance working", () => {
    const report = findReport("sample-calls-in-arrears-and-advance-working");

    expect(findRowAmount(report, "First Call Due")).toBe(30000);
    expect(findRowAmount(report, "Bank Received")).toBe(27000);
    expect(findRowAmount(report, "Calls in Arrears")).toBe(3000);
    expect(findRowAmount(report, "Calls in Advance")).toBe(2000);
  });

  it("represents a simple Share Forfeiture Working", () => {
    const report = findReport("sample-share-forfeiture-working");

    expect(findRowAmount(report, "Share Capital Cancelled")).toBe(10000);
    expect(findRowAmount(report, "Calls in Arrears")).toBe(3000);
    expect(findRowAmount(report, "Amount Already Received")).toBe(7000);
    expect(findRowAmount(report, "Share Forfeiture Balance")).toBe(7000);
  });

  it("represents a simple Capital Reserve Working", () => {
    const report = findReport("sample-capital-reserve-working");

    expect(findRowAmount(report, "Share Forfeiture Balance")).toBe(7000);
    expect(findRowAmount(report, "Discount on Reissue")).toBe(2000);
    expect(findRowAmount(report, "Capital Reserve")).toBe(5000);
  });

  it("represents a simple Debenture Schedule", () => {
    const report = findReport("sample-debenture-schedule");

    expect(findRowAmount(report, "Debentures Issued")).toBe(100000);
    expect(findRowAmount(report, "Bank Received")).toBe(95000);
    expect(findRowAmount(report, "Discount on Issue")).toBe(5000);
    expect(findRowAmount(report, "Debenture Interest")).toBe(10000);
    expect(findRowAmount(report, "Redemption Amount")).toBe(100000);
  });

  it("represents simple Company Balance Sheet Notes", () => {
    const report = findReport("sample-company-balance-sheet-notes");

    expect(findRowAmount(report, "Share Capital")).toBe(200000);
    expect(findRowAmount(report, "Securities Premium")).toBe(20000);
    expect(findRowAmount(report, "Capital Reserve")).toBe(5000);
    expect(findRowAmount(report, "Debentures")).toBe(100000);
    expect(findRowAmount(report, "Bank")).toBe(95000);
    expect(findRowAmount(report, "Machinery")).toBe(150000);
  });

  it("keeps fixtures metadata-only with no executable fields", () => {
    companyReportTemplateFixtures.forEach((template) => {
      expectNoRuntimeFields(template);
      expectNoExecutableValues(template);
    });

    companyReportExampleFixtures.forEach((report) => {
      expectNoRuntimeFields(report);
      expectNoExecutableValues(report);
    });
  });
});

function expectValidAccountingReport(report: AccountingReport): void {
  expect(report.id).toBeTruthy();
  expect(report.title).toBeTruthy();
  expect(report.topic).toBe("company_accounts");
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
  const report = companyReportExampleFixtures.find((example) => example.id === reportId);
  expect(report).toBeDefined();
  return report!;
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

function expectNoExecutableValues(templateOrReport: CompanyReportTemplateFixture | AccountingReport): void {
  Object.values(templateOrReport).forEach((value) => {
    expect(typeof value).not.toBe("function");
  });
}
