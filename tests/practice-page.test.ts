import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AdvancedPracticePage from "@/app/practice/advanced/page";
import JournalEntryPracticePage, { metadata as journalEntryPracticeMetadata } from "@/app/practice/journal-entries/page";
import PracticePage, { metadata as practiceMetadata } from "@/app/practice/page";
import { practiceChapterCatalog, practiceChapterStatusLabels } from "@/lib/learning-platform/practice-catalog";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

function getLinkMarkupWithText(html: string, href: string, text: string) {
  return (
    Array.from(html.matchAll(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`, "g")), (match) => match[0]).find(
      (markup) => markup.includes(text),
    ) ?? ""
  );
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
    const simplifiedPracticeCopy = [
      {
        title: "Accounting Fundamentals",
        description: "Practise basic terms and accounting concepts.",
      },
      {
        title: "Journal Entries",
        description: "Practise beginner journal entries with instant checks.",
      },
      {
        title: "Ledger",
        description: "Practise account-wise posting and balances.",
      },
      {
        title: "Trial Balance",
        description: "Practise debit-credit totals and balances.",
      },
      {
        title: "Bank Reconciliation Statement",
        description: "Practise Cash Book and Bank differences.",
      },
      {
        title: "Rectification of Errors",
        description: "Practise correction entries and suspense account.",
      },
      {
        title: "Depreciation, Provisions and Reserves",
        description: "Practise asset and provision adjustments.",
      },
      {
        title: "Final Accounts",
        description: "Practise Trading, P&amp;L, and Balance Sheet.",
      },
      {
        title: "Bills of Exchange",
        description: "Practise bills, maturity, and dishonour.",
      },
      {
        title: "Not-for-Profit Accounts",
        description: "Practise NPO statements and adjustments.",
      },
      {
        title: "Partnership Accounts",
        description: "Practise partner capital and appropriation entries.",
      },
      {
        title: "Company Accounts",
        description: "Practise shares, debentures, and company entries.",
      },
    ];

    expect(practiceMetadata).toMatchObject({
      title: "Practice | AccyWise AI",
      description: "Start Journal Entries Practice.",
    });
    expect(practiceMetadata).not.toHaveProperty("robots");
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/practice")).toContain('aria-current="page"');
    expect(html).toContain("<h1");
    expect(html).toContain("Practice");
    expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Start Journal Entries Practice")).toContain(
      "Start Journal Entries Practice",
    );
    expect(html).toContain('href="/practice/journal-entries"');
    expect(html).toContain("Available");
    expect(html).toContain("Planned");
    expect(html).toContain("Later");
    expect(html).toContain("Advanced Practice Beta");
    expect(html).toContain("Practise selected advanced accounting scenarios.");
    expect(getLinkMarkupWithText(html, "/practice/advanced", "Open Beta")).toContain("Open Beta");
    expect(html).not.toContain("Choose a chapter and practise Accountancy independently after learning the concepts.");
    expect(html).not.toContain("Practice It Yourself inside Chapters");
    expect(html).not.toContain("General Practice");
    expect(html).not.toContain("Current pilot-ready practice path");
    expect(html).not.toContain("For the guided pilot, first read the Journal Entries chapter");
    expect(html).not.toContain("Read Journal Entries First");
    expect(html).not.toContain("In-app vs notebook practice");
    expect(html).not.toContain("Practise and check answers directly inside AccyWise AI.");
    expect(html).not.toContain("Notebook/photo answer checking will require safe handwriting recognition and OCR");
    expect(html).not.toContain("Chapter practice");
    expect(html).not.toContain("Choose a chapter");
    expect(html).not.toContain("available now");
    expect(html).not.toContain("planned or later");
    expect(html).not.toContain("Controlled advanced journal practice");
    expect(html).not.toContain("complete Partnership or Company Accounts question bank.");
    expect(html).not.toContain('type="file"');
    expect(html.toLowerCase()).not.toContain("camera");
    expect(html.toLowerCase()).not.toContain("upload");
    expect(html).not.toContain("/platform-preview");
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/assistant");

    expect(html.match(/aria-label="[^"]+ practice card"/g) ?? []).toHaveLength(13);
    expect(practiceChapterCatalog).toHaveLength(12);
    expect(practiceChapterCatalog.map((item) => item.title)).toEqual([
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
    expect(hrefs).not.toContain("/practice/ledger");
    expect(hrefs).not.toContain("/practice/trial-balance");
    expect(hrefs).not.toContain("/practice/final-accounts");
    expect(hrefs).not.toContain("/chapters/journal-entries");

    simplifiedPracticeCopy.forEach((item) => {
      const card = getPracticeCardMarkup(html, item.title);

      expect(card).toContain(item.description);
    });

    practiceChapterCatalog.forEach((item) => {
      const card = getPracticeCardMarkup(html, item.title);

      expect(card).toContain(practiceChapterStatusLabels[item.status]);
      expect(card).not.toContain(escapeHtmlText(item.availabilityNote));
      expect(card).not.toContain(escapeHtmlText(item.shortDescription));

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
    expect(html).toContain("Available");
    expect(html).toContain("Practise selected advanced accounting scenarios.");
    expect(getLinkMarkupWithText(html, "/practice/advanced", "Open Beta")).toContain("Open Beta");
    expect(html).toContain('href="/practice/advanced"');
    expect(html).not.toContain("Start with the Journal Entries chapter and beginner practice before using this separate beta.");
    expect(html).not.toContain("complete Partnership or Company Accounts question bank.");
  });

  it("renders migrated beginner Journal Entry Practice inside the production shell", () => {
    const html = renderToStaticMarkup(createElement(JournalEntryPracticePage));
    const pageSource = readFileSync("app/practice/journal-entries/page.tsx", "utf8");
    const source = readFileSync("app/practice/_components/JournalEntryPracticeExperience.tsx", "utf8");

    expect(journalEntryPracticeMetadata).toMatchObject({
      title: "Journal Entry Practice | AccyWise AI",
    });
    expect(journalEntryPracticeMetadata).not.toHaveProperty("robots");
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/practice")).toContain('aria-current="page"');
    expect(html).toContain("Topic-wise Practice");
    expect(html).toContain("Use this beginner practice page after studying the Journal Entries chapter");
    expect(getLinkMarkupWithText(html, "/chapters/journal-entries", "Back to Journal Entries")).toContain(
      "Back to Journal Entries",
    );
    expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Use Explainer if Stuck")).toContain(
      "Use Explainer if Stuck",
    );
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
    expect(source).toContain('id: "basics"');
    expect(source).toContain('id: "mixed"');
    expect(source).toContain('setError("Write your journal entry before checking.")');
    expect(pageSource).toContain('<StudentAppShell activeItem="practice">');
    expect(pageSource).not.toContain("redirect(");
    expect(pageSource).not.toContain("useSearchParams");
    expect(pageSource).not.toContain("router.push");
  });

  it("routes contextual beginner-practice actions to the migrated Journal Entry Practice route", () => {
    const solverSource = readFileSync("app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx", "utf8");
    const toolsSource = readFileSync("app/tools/page.tsx", "utf8");
    const progressSource = readFileSync("app/progress/page.tsx", "utf8");
    const historySource = readFileSync("app/history/page.tsx", "utf8");
    const bankReconciliationSource = readFileSync(
      "app/bank-reconciliation/_components/BankReconciliationExperience.tsx",
      "utf8",
    );
    const attemptHistorySource = readFileSync("lib/attempt-history.ts", "utf8");
    const learningContentSource = readFileSync("lib/learning-content.ts", "utf8");

    expect(solverSource).toContain('<ActionLink href="/practice/journal-entries" variant="primary">');
    expect(solverSource).toContain('<ActionLink href="/chapters/journal-entries" variant="secondary">');
    expect(solverSource).not.toContain('<ActionLink href="/tools" variant="secondary">');
    expect(toolsSource).toContain('href: "/practice/journal-entries"');
    expect(toolsSource).toContain('href="/practice/journal-entries"');
    expect(progressSource).toContain('href="/practice/journal-entries"');
    expect(historySource).toContain('href="/practice/journal-entries"');
    expect(bankReconciliationSource).toContain('href="/practice/journal-entries"');
    expect(attemptHistorySource).toContain('href: "/practice/journal-entries"');
    expect(learningContentSource).toContain('href: "/practice/journal-entries"');
    expect(learningContentSource).not.toContain('{ label: "Practice Basics", href: "/practice" }');
    expect(learningContentSource).not.toContain('{ label: "Practice Journal Entries", href: "/practice" }');
    expect(learningContentSource).not.toContain('{ label: "Practice GST", href: "/practice" }');
    expect(readFileSync("app/page.tsx", "utf8")).toContain('href: "/practice"');
    expect(readFileSync("app/dashboard/page.tsx", "utf8")).toContain('href: "/practice"');
    expect(readFileSync("components/student-platform/navigation.ts", "utf8")).toContain('href: "/practice"');
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

  it("keeps the route migration free of redirects, new storage, upload controls, and preview links", () => {
    const practicePageSource = readFileSync("app/practice/page.tsx", "utf8");
    const journalEntryPageSource = readFileSync("app/practice/journal-entries/page.tsx", "utf8");
    const journalEntryExperienceSource = readFileSync("app/practice/_components/JournalEntryPracticeExperience.tsx", "utf8");
    const practiceCatalogSource = readFileSync("lib/learning-platform/practice-catalog.ts", "utf8");
    const migratedSources = [practicePageSource, journalEntryPageSource, journalEntryExperienceSource, practiceCatalogSource];
    const migratedHtml = [
      renderToStaticMarkup(createElement(PracticePage)),
      renderToStaticMarkup(createElement(JournalEntryPracticePage)),
    ].join("");

    for (const source of migratedSources) {
      expect(source).not.toContain("redirect(");
      expect(source).not.toContain('router.push("/practice');
      expect(source).not.toContain("useSearchParams");
      expect(source).not.toContain("document.cookie");
      expect(source).not.toContain('type="file"');
      expect(source).not.toMatch(/camera|upload/i);
      expect(source).not.toContain("/platform-preview");
    }

    expect(practicePageSource).not.toContain("localStorage");
    expect(practicePageSource).not.toContain("sessionStorage");
    expect(journalEntryPageSource).not.toContain("localStorage");
    expect(journalEntryPageSource).not.toContain("sessionStorage");
    expect(practiceCatalogSource).not.toContain("localStorage");
    expect(practiceCatalogSource).not.toContain("sessionStorage");
    expect(migratedHtml).not.toContain("/platform-preview");
    expect(migratedHtml).not.toContain('type="file"');
  });

  it("keeps Advanced Practice isolated from the production Practice shell migration", () => {
    const html = renderToStaticMarkup(createElement(AdvancedPracticePage));
    const source = readFileSync("app/practice/advanced/page.tsx", "utf8");

    expect(html).toContain("Advanced Journal Entry Practice");
    expect(html).toContain('href="/practice"');
    expect(html).not.toContain('id="student-platform-content"');
    expect(source).not.toContain("StudentAppShell");
    expect(source).not.toContain('activeItem="practice"');
  });
});
