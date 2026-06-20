import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ChaptersPage, { metadata as chaptersMetadata } from "@/app/chapters/page";
import JournalEntriesChapterPage, { metadata as journalEntriesMetadata } from "@/app/chapters/journal-entries/page";
import {
  generateMetadata as generateJournalEntriesSubtopicMetadata,
  generateStaticParams as generateJournalEntriesStaticParams,
} from "@/app/chapters/journal-entries/[sectionSlug]/page";
import {
  getProductionSectionHref,
  JournalEntriesSectionPage,
  productionJournalEntriesSectionRoutes,
} from "@/app/chapters/journal-entries/JournalEntriesSectionPage";
import HomePage from "@/app/page";
import JournalEntriesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/page";
import { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import {
  chapterStatusLabels,
  studentPlatformChapterCatalog,
} from "@/lib/learning-platform/chapter-catalog";
import {
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  journalEntriesChapter,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
} from "@/lib/learning-platform/chapters/journal-entries";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

function escapeHtmlText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function renderProductionSection(slug: string) {
  return renderToStaticMarkup(createElement(JournalEntriesSectionPage, { sectionSlug: slug }));
}

describe("Production Chapters route", () => {
  it("defines the production chapter catalogue with Journal Entries available and the other chapters honestly staged", () => {
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
      status: "available",
      actionLabel: "Start Chapter",
      href: "/chapters/journal-entries",
    });
    expect(studentPlatformChapterCatalog.filter((chapter) => chapter.status === "available")).toHaveLength(1);
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

  it("links only the Journal Entries card to the production chapter route", () => {
    const html = renderToStaticMarkup(createElement(ChaptersPage));

    studentPlatformChapterCatalog.forEach((chapter) => {
      expect(html).toContain(chapter.title);
      expect(html).toContain(chapter.shortDescription);
      expect(html).toContain(chapterStatusLabels[chapter.status]);
    });

    expect(html).toContain("Available");
    expect(html).toContain("Start Chapter");
    expect(html).toContain('href="/chapters/journal-entries"');
    expect(html).toContain("Planned");
    expect(html).toContain("Later");
    expect(html).not.toContain('href="/platform-preview');
    expect(html).not.toContain('href="/chapters/ledger"');
    expect(html).not.toContain('href="/chapters/trial-balance"');
    expect(html).not.toContain('href="/chapters/company-accounts"');
  });

  it("keeps preview routes noindex while production Chapters and Journal Entries routes remain indexable", async () => {
    const subtopicMetadata = await generateJournalEntriesSubtopicMetadata({
      params: Promise.resolve({ sectionSlug: "business-transactions" }),
    });

    expect(platformPreviewMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
    expect(chaptersMetadata).toMatchObject({
      title: "Chapters | AccyWise AI",
    });
    expect(journalEntriesMetadata).toMatchObject({
      title: "Journal Entries | Chapters | AccyWise AI",
    });
    expect(subtopicMetadata).toMatchObject({
      title: "Business Transactions | Journal Entries | AccyWise AI",
    });
    expect(chaptersMetadata.description).toContain("interactive Accountancy chapters");
    expect(journalEntriesMetadata.description).toContain("Learn Journal Entries");
    expect(chaptersMetadata).not.toHaveProperty("robots");
    expect(journalEntriesMetadata).not.toHaveProperty("robots");
    expect(subtopicMetadata).not.toHaveProperty("robots");
  });

  it("renders all sixteen production Journal Entries routes from the typed chapter data", () => {
    expect(productionJournalEntriesSectionRoutes).toHaveLength(16);
    expect(generateJournalEntriesStaticParams()).toHaveLength(15);
    expect(generateJournalEntriesStaticParams()).not.toContainEqual({
      sectionSlug: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
    });

    journalEntriesChapter.subtopics.forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);
      const href = getProductionSectionHref(subtopic.slug);

      expect(html).toContain(subtopic.title);
      expect(html).toContain(escapeHtmlText(subtopic.learningObjective));
      expect(html).toContain(subtopic.progressLabel);
      expect(html).toContain('id="student-platform-content"');
      expect(getLinkMarkup(html, href)).toContain('aria-current="step"');
      expect(html).not.toContain("/platform-preview");
      expect(html).not.toMatch(/\b[Pp]review\b/);
      expect(html).not.toContain("Founder review");
      expect(html).not.toContain("Phase 3");
    });
  });

  it("uses production previous and next links across the sixteen section routes", () => {
    journalEntriesChapter.subtopics.forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);

      if (subtopic.previousSection) {
        expect(html).toContain(`href="${getProductionSectionHref(subtopic.previousSection.slug)}"`);
        expect(html).toContain(`Previous ${subtopic.previousSection.title}`);
      } else {
        expect(html).not.toContain("Previous Introduction");
        expect(html).toContain(`href="${getProductionSectionHref(subtopic.nextSection!.slug)}"`);
      }

      if (subtopic.nextSection) {
        expect(html).toContain(`href="${getProductionSectionHref(subtopic.nextSection.slug)}"`);
        expect(html).toContain(`Continue to ${subtopic.nextSection.title}`);
      } else {
        expect(html).toContain(`href="${getProductionSectionHref(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG)}"`);
        expect(html).toContain('href="/chapters"');
        expect(html).toContain("Review from Beginning");
        expect(html).toContain("Back to Chapters");
      }
    });
  });

  it("keeps production Journal Entries practice read-only and checker-free", () => {
    const html = renderToStaticMarkup(createElement(JournalEntriesChapterPage));
    const source = [
      readFileSync("app/chapters/journal-entries/JournalEntriesSectionPage.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/JournalEntriesLearningBlocks.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/page.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/[sectionSlug]/page.tsx", "utf8"),
    ].join("\n");

    expect(html).toContain("Interactive Practice It Yourself");
    expect(html).toContain("Interactive answer checking for this chapter will be enabled in the next controlled migration step.");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expect(html).not.toContain(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    expect(source).not.toContain("checkJournalEntriesPracticeAnswer");
    expect(source).not.toContain("revealJournalEntriesPracticeCorrectAnswer");
    expect(source).not.toContain("JournalEntryPracticeEditor");
    expect(source).not.toContain("journal-entry-answer-keys.server");
    expect(source).not.toContain("/platform-preview");
  });

  it("keeps the production recap from claiming interactive checking is live", () => {
    const html = renderProductionSection("chapter-recap-and-practice");

    expect(html).toContain("Interactive Chapter Practice");
    expect(html).toContain("Interactive chapter practice will be enabled after the production checker migration is approved.");
    expect(html).not.toContain("Interactive Practice Available");
    expect(html).not.toContain("Return to Practice It Yourself");
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries#practice-it-yourself"');
    expect(html).not.toContain(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expect(html).not.toContain(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
  });

  it("keeps preview checker behavior isolated and unchanged", () => {
    const previewHtml = renderToStaticMarkup(createElement(JournalEntriesChapterPreviewPage));
    const previewActionsSource = readFileSync("app/platform-preview/chapters/journal-entries/actions.ts", "utf8");
    const previewEditorSource = readFileSync("app/platform-preview/_components/JournalEntryPracticeEditor.tsx", "utf8");

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(previewHtml).toContain("Check Answer");
    expect(previewActionsSource).toContain("journal-entry-answer-keys.server");
    expect(previewEditorSource).toContain("Show Correct Answer");
  });

  it("does not link the new production Chapters route from the existing homepage yet", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).not.toContain('href="/chapters"');
    expect(html).not.toContain('href="/chapters/journal-entries"');
  });

  it("keeps global mobile bottom navigation unchanged outside the production shell routes", () => {
    const source = readFileSync("components/MobileBottomNav.tsx", "utf8");

    expect(source).toContain('pathname.startsWith("/platform-preview")');
    expect(source).toContain('pathname === "/chapters"');
    expect(source).toContain('pathname.startsWith("/chapters/")');
    expect(source).toContain('href: "/learn"');
    expect(source).toContain('href: "/practice"');
    expect(source).toContain('href: "/tools"');
  });
});
