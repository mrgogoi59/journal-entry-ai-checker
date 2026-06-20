import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import JournalEntryPracticePage, { metadata as journalEntryPracticeMetadata } from "@/app/practice/journal-entries/page";
import PracticePage, { metadata as practiceMetadata } from "@/app/practice/page";
import { practiceChapterCatalog, practiceChapterStatusLabels } from "@/lib/learning-platform/practice-catalog";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

function getHrefValues(html: string) {
  return Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1]);
}

function getPracticeCardMarkup(html: string, title: string) {
  return html.match(new RegExp(`<article[^>]*aria-label="${title} practice card"[\\s\\S]*?</article>`))?.[0] ?? "";
}

function escapeHtmlText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

describe("PracticePage", () => {
  it("renders the production Practice hub with truthful chapter availability", () => {
    const html = renderToStaticMarkup(createElement(PracticePage));
    const hrefs = getHrefValues(html);

    expect(practiceMetadata).toMatchObject({
      title: "Practice | AccyWise AI",
      description: "Chapter-wise Accountancy practice and independent revision.",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/practice")).toContain('aria-current="page"');
    expect(html).toContain("Choose a chapter and practise Accountancy independently after learning the concepts.");
    expect(html).toContain("Practice It Yourself inside Chapters");
    expect(html).toContain("General Practice");
    expect(html).toContain("Recommended Starting Practice");
    expect(html).toContain("Start Journal Entry Practice");
    expect(html).toContain('href="/practice/journal-entries"');
    expect(html).toContain("Practise and check answers directly inside AccyWise AI.");
    expect(html).toContain("Notebook/photo answer checking will require safe handwriting recognition and OCR");
    expect(html).not.toContain('type="file"');
    expect(html.toLowerCase()).not.toContain("camera");
    expect(html.toLowerCase()).not.toContain("upload");
    expect(html).not.toContain("/platform-preview");
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/assistant");

    expect(html.match(/aria-label="[^"]+ practice card"/g) ?? []).toHaveLength(12);
    expect(practiceChapterCatalog).toHaveLength(12);

    practiceChapterCatalog.forEach((item) => {
      const card = getPracticeCardMarkup(html, item.title);

      expect(card).toContain(escapeHtmlText(item.shortDescription));
      expect(card).toContain(practiceChapterStatusLabels[item.status]);
      expect(card).toContain(item.availabilityNote);

      if (item.status === "available") {
        expect(item.title).toBe("Journal Entries");
        expect("href" in item ? item.href : undefined).toBe("/practice/journal-entries");
        expect(card).toContain('href="/practice/journal-entries"');
      } else {
        expect("href" in item ? item.href : undefined).toBeUndefined();
        expect(card).not.toContain("href=");
      }
    });
  });

  it("keeps Advanced Practice Beta discoverable without changing the beta route", () => {
    const html = renderToStaticMarkup(createElement(PracticePage));

    expect(html).toContain("Advanced Practice Beta");
    expect(html).toContain("Beta");
    expect(html).toContain("This is a beta, not a complete Partnership or Company Accounts question bank.");
    expect(html).toContain('href="/practice/advanced"');
  });

  it("renders migrated beginner Journal Entry Practice inside the production shell", () => {
    const html = renderToStaticMarkup(createElement(JournalEntryPracticePage));
    const source = readFileSync("app/practice/_components/JournalEntryPracticeExperience.tsx", "utf8");

    expect(journalEntryPracticeMetadata).toMatchObject({
      title: "Journal Entry Practice | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/practice")).toContain('aria-current="page"');
    expect(html).toContain("Topic-wise Practice");
    expect(html).toContain("Choose a topic");
    expect(html).toContain("Basics");
    expect(html).toContain("Mixed Practice");
    expect(html).toContain("Practice accounting workflow steps");
    expect(html).toContain("Advanced Practice Beta");
    expect(html).toContain('href="/practice/advanced"');
    expect(source).toContain('fetch("/api/generate-practice-question"');
    expect(source).toContain('fetch("/api/check-entry"');
    expect(source).toContain("saveAttemptHistoryItem");
    expect(source).toContain("Try Another Question");
    expect(source).toContain("Retry Same Question");
  });

  it("routes contextual beginner-practice actions to the migrated Journal Entry Practice route", () => {
    const solverSource = readFileSync("app/journal-entry-solver/page.tsx", "utf8");
    const toolsSource = readFileSync("app/tools/page.tsx", "utf8");
    const progressSource = readFileSync("app/progress/page.tsx", "utf8");

    expect(solverSource).toContain('<ActionLink href="/practice/journal-entries" variant="primary">');
    expect(toolsSource).toContain('href: "/practice/journal-entries"');
    expect(toolsSource).toContain('href="/practice/journal-entries"');
    expect(progressSource).toContain('href="/practice/journal-entries"');
    expect(readFileSync("app/page.tsx", "utf8")).toContain('href="/practice"');
    expect(readFileSync("app/dashboard/page.tsx", "utf8")).toContain('href: "/practice"');
  });

  it("hides global mobile bottom navigation only for the new production Practice shell routes", () => {
    const source = readFileSync("components/MobileBottomNav.tsx", "utf8");

    expect(source).toContain('pathname === "/practice"');
    expect(source).toContain('pathname === "/practice/journal-entries"');
    expect(source).toContain('pathname.startsWith("/practice/journal-entries/")');
    expect(source).not.toContain('pathname === "/practice/advanced"');
    expect(source).not.toContain('pathname.startsWith("/practice/")');
    expect(source).toContain('href: "/practice"');
  });
});
