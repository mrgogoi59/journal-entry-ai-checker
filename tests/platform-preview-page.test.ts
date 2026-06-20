import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import PlatformPreviewLayout, { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import PlatformPreviewDashboardPage from "@/app/platform-preview/page";
import PlatformPreviewChaptersPage from "@/app/platform-preview/chapters/page";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

describe("Platform preview routes", () => {
  it("marks the platform preview routes as noindex and nofollow", () => {
    expect(platformPreviewMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it("renders the preview layout children without adding runtime behavior", () => {
    const html = renderToStaticMarkup(
      createElement(PlatformPreviewLayout, null, createElement("main", null, "Preview child")),
    );

    expect(html).toContain("Preview child");
  });

  it("renders the Dashboard preview with five-section navigation and mock dashboard sections", () => {
    const html = renderToStaticMarkup(createElement(PlatformPreviewDashboardPage));

    expect(html).toContain("Dashboard");
    expect(html).toContain("Welcome back");
    expect(html).toContain("Continue Learning");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Chapters Started");
    expect(html).toContain("Chapters Completed");
    expect(html).toContain("Practice Accuracy");
    expect(html).toContain("Questions Attempted");
    expect(html).toContain("Recent Activity");
    expect(html).toContain("Recommended next topic");
    expect(html).toContain("Mock data");

    ["Dashboard", "Chapters", "Solver", "Practice", "AI Assistant"].forEach((label) => {
      expect(html).toContain(label);
    });

    expect(getLinkMarkup(html, "/platform-preview")).toContain('aria-current="page"');
  });

  it("renders the Chapters preview with Journal Entries as the first active prototype chapter", () => {
    const html = renderToStaticMarkup(createElement(PlatformPreviewChaptersPage));

    expect(html).toContain("Chapter roadmap");
    expect(html).toContain("Accounting Fundamentals");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("First active prototype chapter");
    expect(html).toContain("First prototype");
    expect(html).toContain("Ledger");
    expect(html).toContain("Trial Balance");
    expect(html).toContain("Second validation");
    expect(html).toContain("Bank Reconciliation Statement");
    expect(html).toContain("Rectification of Errors");
    expect(html).toContain("Depreciation, Provisions and Reserves");
    expect(html).toContain("Final Accounts");
    expect(html).toContain("Bills of Exchange");
    expect(html).toContain("Not-for-Profit Accounts");
    expect(html).toContain("Partnership Accounts");
    expect(html).toContain("Company Accounts");
    expect(html).toContain("Cash Flow Statement");
    expect(html).toContain("No chapter pages yet");

    expect(getLinkMarkup(html, "/platform-preview/chapters")).toContain('aria-current="page"');
  });

  it("does not link the internal preview routes from the existing public homepage", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).not.toContain('href="/platform-preview"');
    expect(html).not.toContain('href="/platform-preview/chapters"');
  });
});
