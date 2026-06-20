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
import HomePage, { metadata as homeMetadata } from "@/app/page";
import JournalEntriesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/page";
import {
  checkJournalEntriesPracticeAnswer,
  revealJournalEntriesPracticeCorrectAnswer,
} from "@/app/chapters/journal-entries/actions";
import { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import type { JournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/types";
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

function getOverviewCardMarkup(html: string, label: string) {
  return html.match(new RegExp(`<article[^>]*aria-label="${label} overview"[\\s\\S]*?</article>`))?.[0] ?? "";
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

function createPracticeAttempt({
  questionId,
  debitAccount,
  debitAmount,
  creditAccount,
  creditAmount,
  totalDebit,
  totalCredit,
  narration,
}: {
  questionId: string;
  debitAccount: string;
  debitAmount: string;
  creditAccount: string;
  creditAmount: string;
  totalDebit: string;
  totalCredit: string;
  narration: string;
}): JournalEntryPracticeAttempt {
  return {
    questionId,
    rows: [
      {
        rowOrder: 1,
        particulars: debitAccount,
        lf: "1",
        debitAmount,
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: creditAccount,
        lf: "2",
        debitAmount: "",
        creditAmount,
      },
    ],
    totalDebit,
    totalCredit,
    narration,
  };
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
      expect(html).not.toContain("This preview checker");
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

  it("keeps all production Journal Entries links pointed at existing production routes", () => {
    const validJournalEntryRoutes = new Set(productionJournalEntriesSectionRoutes.map((route) => route.href));

    journalEntriesChapter.subtopics.forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);
      const journalEntryHrefs = getHrefValues(html).filter((href) => href.startsWith("/chapters/journal-entries"));

      journalEntryHrefs.forEach((href) => {
        const routeWithoutHash = href.split("#")[0];

        expect(validJournalEntryRoutes.has(routeWithoutHash), `${subtopic.slug} links to ${href}`).toBe(true);
      });
    });
  });

  it("renders exactly the two approved production Journal Entries practice checkers", () => {
    const html = renderToStaticMarkup(createElement(JournalEntriesChapterPage));
    const source = [
      readFileSync("app/chapters/journal-entries/JournalEntriesSectionPage.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/JournalEntriesLearningBlocks.tsx", "utf8"),
      readFileSync("components/learning-platform/JournalEntryPracticeEditor.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/page.tsx", "utf8"),
      readFileSync("app/chapters/journal-entries/[sectionSlug]/page.tsx", "utf8"),
    ].join("\n");

    expect(html).toContain("Practice 1 of 2");
    expect(html).toContain("Sold goods for cash ₹12,000. Pass the journal entry.");
    expect(html).toContain("Practice 2 of 2");
    expect(html).toContain("Paid salary by bank ₹8,000. Pass the journal entry.");
    expect(html.match(/Check Answer/g)).toHaveLength(2);
    expect(html.match(/Reset Answer/g)).toHaveLength(2);
    expect(html.match(/Feedback will appear here after you check your answer\./g)).toHaveLength(2);
    expect(html).toContain(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expect(html).toContain(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    expect(html).toContain("This chapter checker supports this audited question only.");
    expect(html).not.toContain("Interactive answer checking for this chapter will be enabled in the next controlled migration step.");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("Correct Answer");
    expect(source).toContain("checkJournalEntriesPracticeAnswer");
    expect(source).toContain("revealJournalEntriesPracticeCorrectAnswer");
    expect(source).toContain("JournalEntryPracticeEditor");
    expect(source).not.toContain("journal-entry-answer-keys.server");
    expect(source).not.toContain("Cash A/c Dr.");
    expect(source).not.toContain("To Sales A/c");
    expect(source).not.toContain("Salary A/c Dr.");
    expect(source).not.toContain("To Bank A/c");
    expect(source).not.toContain("/platform-preview");
  });

  it("keeps checker editors out of the other production Journal Entries sections", () => {
    journalEntriesChapter.subtopics.slice(1).forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);

      expect(html).not.toContain("Check Answer");
      expect(html).not.toContain("Show Correct Answer");
      expect(html).not.toContain("practice-feedback-");
      expect(html).not.toContain("This chapter checker supports this audited question only.");
    });
  });

  it("links the production recap back to the two interactive practice questions without duplicating editors", () => {
    const html = renderProductionSection("chapter-recap-and-practice");
    const reviewChallengeDetails = html.match(/<details class="group rounded-2xl/g) ?? [];

    expect(html).toContain("Interactive Practice Available");
    expect(html).toContain("Sold goods for cash ₹12,000");
    expect(html).toContain("Paid salary by bank ₹8,000");
    expect(html).toContain('href="/chapters/journal-entries#practice-it-yourself"');
    expect(html).toContain("Practice the interactive questions");
    expect(reviewChallengeDetails).toHaveLength(8);
    expect(html).toContain("Mastery self-check");
    expect(html).not.toContain("Interactive chapter practice will be enabled after the production checker migration is approved.");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("practice-feedback-");
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries#practice-it-yourself"');
  });

  it("keeps production answer checking server-controlled for exactly the two approved question IDs", async () => {
    const soldGoodsResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "12000",
        creditAccount: "To Sales A/c",
        creditAmount: "12000",
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "Being goods sold for cash.",
      }),
    );
    const paidSalaryResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Salary A/c Dr.",
        debitAmount: "8000",
        creditAccount: "To Bank A/c",
        creditAmount: "8000",
        totalDebit: "8000",
        totalCredit: "8000",
        narration: "Being salary paid by bank.",
      }),
    );
    const soldGoodsWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "12000",
        creditAccount: "To Purchases A/c",
        creditAmount: "12000",
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "Being goods sold for cash.",
      }),
    );
    const paidSalaryWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Salary A/c Dr.",
        debitAmount: "8000",
        creditAccount: "To Cash A/c",
        creditAmount: "8000",
        totalDebit: "8000",
        totalCredit: "8000",
        narration: "Being salary paid by bank.",
      }),
    );
    const wrongButBalancedResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "10000",
        creditAccount: "To Sales A/c",
        creditAmount: "10000",
        totalDebit: "10000",
        totalCredit: "10000",
        narration: "Being goods sold for cash.",
      }),
    );
    const blankResult = await checkJournalEntriesPracticeAnswer({
      questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      rows: [
        { rowOrder: 1, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
        { rowOrder: 2, particulars: "", lf: "", debitAmount: "", creditAmount: "" },
      ],
      totalDebit: "",
      totalCredit: "",
      narration: "",
    });
    const malformedResult = await checkJournalEntriesPracticeAnswer({
      questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      rows: "not rows",
      totalDebit: 12000,
      totalCredit: "12000",
      narration: "Being goods sold for cash.",
    });
    const unsupportedResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: "unsupported-production-question",
        debitAccount: "Cash A/c Dr.",
        debitAmount: "12000",
        creditAccount: "To Sales A/c",
        creditAmount: "12000",
        totalDebit: "12000",
        totalCredit: "12000",
        narration: "Being goods sold for cash.",
      }),
    );
    const soldGoodsReveal = await revealJournalEntriesPracticeCorrectAnswer(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    const paidSalaryReveal = await revealJournalEntriesPracticeCorrectAnswer(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    const unsupportedReveal = await revealJournalEntriesPracticeCorrectAnswer("unsupported-production-question");

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(soldGoodsResult.status).toBe("correct");
    expect(paidSalaryResult.status).toBe("correct");
    expect(soldGoodsWrongAccountResult.status).toBe("incorrect");
    expect(soldGoodsWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Bank A/c is not used because cash is received.",
        "Purchases A/c is not used when goods are sold.",
      ]),
    );
    expect(paidSalaryWrongAccountResult.status).toBe("incorrect");
    expect(paidSalaryWrongAccountResult.errors).toEqual(
      expect.arrayContaining(["Cash A/c is not affected because the transaction states bank."]),
    );
    expect(wrongButBalancedResult.status).toBe("incorrect");
    expect(wrongButBalancedResult.balanceResult.message).toBe(
      "The entry balances, but it does not balance at the correct ₹12,000 amount.",
    );
    expect(blankResult.status).toBe("incorrect");
    expect(blankResult.errors).toEqual(["The answer is blank."]);
    expect(blankResult.correctAnswerRevealAvailable).toBe(false);
    expect(malformedResult.status).toBe("incorrect");
    expect(malformedResult.summary).toBe("This submitted answer could not be checked safely. Please review the fields and try again.");
    expect(malformedResult.correctAnswerRevealAvailable).toBe(false);
    expect(unsupportedResult.status).toBe("incorrect");
    expect(unsupportedResult.errors).toEqual(["Unsupported Practice It Yourself question."]);
    expect(soldGoodsReveal).toMatchObject({
      questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being goods sold for cash.",
    });
    expect(soldGoodsReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Sales A/c"]);
    expect(soldGoodsReveal.lines.map((line) => line.particulars)).not.toContain("Salary A/c Dr.");
    expect(paidSalaryReveal).toMatchObject({
      questionId: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being salary paid by bank.",
    });
    expect(paidSalaryReveal.lines.map((line) => line.particulars)).toEqual(["Salary A/c Dr.", "To Bank A/c"]);
    expect(paidSalaryReveal.lines.map((line) => line.particulars)).not.toContain("To Sales A/c");
    expect(unsupportedReveal).toMatchObject({
      questionId: "unsupported-production-question",
      available: false,
      lines: [],
      narration: "",
    });
  });

  it("keeps preview checker behavior isolated and unchanged", () => {
    const previewHtml = renderToStaticMarkup(createElement(JournalEntriesChapterPreviewPage));
    const previewActionsSource = readFileSync("app/platform-preview/chapters/journal-entries/actions.ts", "utf8");
    const previewEditorSource = readFileSync("components/learning-platform/JournalEntryPracticeEditor.tsx", "utf8");

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(previewHtml).toContain("Check Answer");
    expect(previewActionsSource).toContain("journal-entry-answer-keys.server");
    expect(previewEditorSource).toContain("Show Correct Answer");
  });

  it("integrates the homepage with the five-section platform navigation without fake upcoming links", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const hrefs = getHrefValues(html);

    expect(html).toContain('aria-label="Primary platform navigation"');
    ["Dashboard", "Chapters", "Solver", "Practice", "AI Assistant"].forEach((label) => {
      expect(html).toContain(label);
    });
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/tools");
    expect(hrefs).toContain("/practice");
    expect(html).toContain("Coming soon");
    expect(hrefs).not.toContain("/dashboard");
    expect(hrefs).not.toContain("/assistant");
    expect(html).not.toContain("/platform-preview");
    expect(homeMetadata).toMatchObject({
      title: "AccyWise AI — Interactive Accountancy Learning",
    });
  });

  it("renders Phase 4E homepage entry points to Chapters, Solver, Practice, and Journal Entries", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(getLinkMarkupWithText(html, "/chapters", "Explore Chapters")).toContain("Explore Chapters");
    expect(getLinkMarkupWithText(html, "/tools", "Open Solver")).toContain("Open Solver");
    expect(getLinkMarkupWithText(html, "/practice", "Start Practice")).toContain("Start Practice");
    expect(getLinkMarkupWithText(html, "/chapters/journal-entries", "Start Journal Entries")).toContain(
      "Start Journal Entries",
    );
    expect(html).toContain("Journal Entries chapter is now available");
    expect(html).toContain("structured learning");
    expect(html).toContain("solved illustrations");
    expect(html).toContain("complete-answer Practice It Yourself");
    expect(html.toLowerCase()).not.toContain("all chapters are available");
    expect(html.toLowerCase()).not.toContain("large question bank");
  });

  it("renders accurate homepage overview states for available and coming-soon platform areas", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    const dashboardCard = getOverviewCardMarkup(html, "Dashboard");
    const chaptersCard = getOverviewCardMarkup(html, "Chapters");
    const solverCard = getOverviewCardMarkup(html, "Solver");
    const practiceCard = getOverviewCardMarkup(html, "Practice");
    const assistantCard = getOverviewCardMarkup(html, "AI Assistant");

    expect(dashboardCard).toContain("Coming soon");
    expect(dashboardCard).toContain("No live route yet");
    expect(chaptersCard).toContain("Available");
    expect(chaptersCard).toContain('href="/chapters"');
    expect(solverCard).toContain("Available");
    expect(solverCard).toContain('href="/tools"');
    expect(practiceCard).toContain("Available");
    expect(practiceCard).toContain('href="/practice"');
    expect(assistantCard).toContain("Coming soon");
    expect(assistantCard).toContain("No live route yet");
  });

  it("keeps legacy production routes available while homepage points students toward the new Chapters hub", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const hrefs = getHrefValues(html);

    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/tools");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/how-to-use");
    expect(hrefs).toContain("/supported-transactions");
    expect(readFileSync("app/learn/page.tsx", "utf8")).toContain("export default function LearnPage");
    expect(readFileSync("app/tools/page.tsx", "utf8")).toContain("export default function ToolsPage");
    expect(readFileSync("app/practice/page.tsx", "utf8")).toContain("export default function PracticePage");
    expect(readFileSync("app/practice/advanced/page.tsx", "utf8")).toContain("export default function AdvancedPracticePage");
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
