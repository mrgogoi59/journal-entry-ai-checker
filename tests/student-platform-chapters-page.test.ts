import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ChaptersPage, { metadata as chaptersMetadata } from "@/app/chapters/page";
import HomePage from "@/app/page";
import { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import {
  chapterStatusLabels,
  studentPlatformChapterCatalog,
} from "@/lib/learning-platform/chapter-catalog";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

describe("Production Chapters route", () => {
  it("defines the production chapter catalogue with twelve honest chapter states", () => {
    expect(studentPlatformChapterCatalog).toHaveLength(12);
    expect(studentPlatformChapterCatalog.map((chapter) => chapter.title)).toEqual([
      "Accounting Fundamentals",
      "Journal Entries",
      "Ledger",
      "Trial Balance",
      "Bank Reconciliation Statement",
      "Rectification of Errors",
      "Depreciation, Provisions and Reserves",
      "Final Accounts",
      "Bills of Exchange",
      "Not-for-Profit Accounts",
      "Partnership Accounts",
      "Company Accounts",
    ]);

    const journalEntries = studentPlatformChapterCatalog.find((chapter) => chapter.slug === "journal-entries");

    expect(journalEntries).toMatchObject({
      status: "migration-ready",
      actionLabel: "Chapter experience coming in the next migration step",
    });
    expect(studentPlatformChapterCatalog.every((chapter) => chapter.status !== "migration-ready" || chapter.slug === "journal-entries")).toBe(
      true,
    );
  });

  it("renders the production shell with the intended navigation destinations and upcoming states", () => {
    const html = renderToStaticMarkup(createElement(ChaptersPage));

    expect(html).toContain('id="student-platform-content"');
    ["Dashboard", "Chapters", "Solver", "Practice", "AI Assistant"].forEach((label) => {
      expect(html).toContain(label);
    });

    expect(getLinkMarkup(html, "/chapters")).toContain('aria-current="page"');
    expect(html).toContain('href="/tools"');
    expect(html).toContain('href="/practice"');
    expect(html).toContain("Coming soon");
    expect(html).not.toContain('href="/dashboard"');
    expect(html).not.toContain('href="/assistant"');
  });

  it("renders chapter cards without linking to preview or nonexistent chapter routes", () => {
    const html = renderToStaticMarkup(createElement(ChaptersPage));

    studentPlatformChapterCatalog.forEach((chapter) => {
      expect(html).toContain(chapter.title);
      expect(html).toContain(chapter.shortDescription);
      expect(html).toContain(chapterStatusLabels[chapter.status]);
    });

    expect(html).toContain("Ready for migration");
    expect(html).toContain("Chapter experience coming in the next migration step");
    expect(html).toContain("Planned");
    expect(html).toContain("Later");
    expect(html).not.toContain('href="/platform-preview');
    expect(html).not.toContain('href="/chapters/journal-entries"');
  });

  it("keeps preview routes noindex while the live Chapters route remains indexable", () => {
    expect(platformPreviewMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
    expect(chaptersMetadata).toMatchObject({
      title: "Chapters | AccyWise AI",
    });
    expect(chaptersMetadata.description).toContain("interactive Accountancy chapters");
    expect(chaptersMetadata).not.toHaveProperty("robots");
  });

  it("does not link the new production Chapters route from the existing homepage yet", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).not.toContain('href="/chapters"');
    expect(html).not.toContain("Chapter experience coming in the next migration step");
  });

  it("keeps global mobile bottom navigation unchanged outside the new shell routes", () => {
    const source = readFileSync("components/MobileBottomNav.tsx", "utf8");

    expect(source).toContain('pathname.startsWith("/platform-preview")');
    expect(source).toContain('pathname === "/chapters"');
    expect(source).toContain('pathname.startsWith("/chapters/")');
    expect(source).toContain('href: "/learn"');
    expect(source).toContain('href: "/practice"');
    expect(source).toContain('href: "/tools"');
  });
});
