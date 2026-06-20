import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import PlatformPreviewLayout, { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import PlatformPreviewDashboardPage from "@/app/platform-preview/page";
import PlatformPreviewChaptersPage from "@/app/platform-preview/chapters/page";
import JournalEntriesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/page";
import {
  journalEntriesChapter,
  soldGoodsForCashPracticeQuestion,
} from "@/lib/learning-platform/chapters/journal-entries";
import { soldGoodsForCashExpectedAnswer } from "@/lib/learning-platform/chapters/journal-entry-answer-keys.server";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

function getButtonMarkup(html: string, label: string) {
  return Array.from(html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g))
    .map((match) => match[0])
    .find((button) => button.includes(label)) ?? "";
}

describe("Platform preview routes", () => {
  it("defines the Journal Entries chapter with typed ordered content sections", () => {
    expect(journalEntriesChapter.metadata.slug).toBe("journal-entries");
    expect(journalEntriesChapter.outline).toHaveLength(16);
    expect(journalEntriesChapter.outline.map((item) => item.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );

    expect(journalEntriesChapter.sections.filter((section) => section.type === "concept-explanation")).toHaveLength(1);
    expect(journalEntriesChapter.sections.filter((section) => section.type === "solved-illustration")).toHaveLength(2);
    expect(journalEntriesChapter.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(1);
  });

  it("defines a balanced internal expected answer for the sold-goods-for-cash practice question", () => {
    const debitTotal = soldGoodsForCashExpectedAnswer.lines
      .filter((line) => line.side === "debit")
      .reduce((total, line) => total + line.amount, 0);
    const creditTotal = soldGoodsForCashExpectedAnswer.lines
      .filter((line) => line.side === "credit")
      .reduce((total, line) => total + line.amount, 0);

    expect(debitTotal).toBe(12000);
    expect(creditTotal).toBe(12000);
    expect(soldGoodsForCashExpectedAnswer.totals).toEqual({ debit: 12000, credit: 12000 });
    expect(soldGoodsForCashExpectedAnswer.balanced).toBe(true);
    expect(soldGoodsForCashExpectedAnswer.lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ account: "Cash A/c", side: "debit", amount: 12000 }),
        expect.objectContaining({ account: "Sales A/c", side: "credit", amount: 12000 }),
      ]),
    );
    expect("expectedAnswer" in soldGoodsForCashPracticeQuestion).toBe(false);
  });

  it("keeps the named-capital illustration specific to Amit instead of generic Capital", () => {
    const capitalIllustrationSection = journalEntriesChapter.sections.find(
      (section) => section.type === "solved-illustration" && section.id === "amit-capital-through-bank",
    );

    expect(capitalIllustrationSection?.type).toBe("solved-illustration");
    if (capitalIllustrationSection?.type !== "solved-illustration") {
      throw new Error("Amit capital illustration section was not found");
    }

    expect(capitalIllustrationSection.illustration.accountsAffected).toContain("Amit's Capital A/c");
    expect(capitalIllustrationSection.illustration.journalEntry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ account: "Amit's Capital A/c", side: "credit", amount: 50000 }),
      ]),
    );
    expect(capitalIllustrationSection.illustration.journalEntry).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Capital A/c" })]),
    );
  });

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
    expect(html).toContain("Open preview");
    expect(html).toContain('href="/platform-preview/chapters/journal-entries"');
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
    expect(html).toContain("Only Journal Entries opens");
    expect(html).not.toContain('href="/platform-preview/chapters/ledger"');
    expect(html).not.toContain('href="/platform-preview/chapters/trial-balance"');
    expect(html).not.toContain('href="/platform-preview/chapters/company-accounts"');

    expect(getLinkMarkup(html, "/platform-preview/chapters")).toContain('aria-current="page"');
  });

  it("renders the Journal Entries chapter learning preview flow with blank fields and one blank-safe checker", () => {
    const html = renderToStaticMarkup(createElement(JournalEntriesChapterPreviewPage));
    const checkButton = getButtonMarkup(html, "Check Answer");

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Foundation chapter");
    expect(html).toContain("Introduction to Journal Entries and Journal Format");
    expect(html).toContain("Business Transactions");
    expect(html).toContain("Types of Accounts");
    expect(html).toContain("Chapter Recap and Practice");
    expect(html).toContain("Concept explanation");
    expect(html).toContain("A journal records business transactions in chronological order");
    expect(html).toContain("Date");
    expect(html).toContain("Particulars");
    expect(html).toContain("L.F.");
    expect(html).toContain("Debit ₹");
    expect(html).toContain("Credit ₹");
    expect(html).toContain("Bought goods for cash ₹10,000");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Paid rent by bank ₹5,000.");
    expect(html).toContain("Rent A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Solved Illustration 2");
    expect(html).toContain("Amit introduced capital of ₹50,000 through bank.");
    expect(html).toContain("To Amit&#x27;s Capital A/c");
    expect(html).toContain("Practice It Yourself");
    expect(html).toContain("Sold goods for cash ₹12,000. Pass the journal entry.");
    expect(html).toContain("This preview checker supports this one question only.");
    expect(html).toContain("practice-particulars-1");
    expect(html).toContain("practice-debit-1");
    expect(html).toContain("practice-credit-1");
    expect(html).toContain("practice-narration");
    expect(html).toContain("practice-total-debit");
    expect(html).toContain("practice-total-credit");
    expect(html).toContain("Check Answer");
    expect(checkButton).toContain("disabled=");
    expect(checkButton).toContain('aria-disabled="true"');
    expect(html).toContain("Write the full particulars yourself");
    expect(html).toContain('id="practice-feedback"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Feedback will appear here after you check your answer.");
    expect(html).toContain("This preview checker supports only this one cash-sale journal entry.");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).toContain("Common mistakes");
    expect(html).toContain("Continue to Business Transactions - Preview only");

    expect(html).not.toContain('value="Cash A/c');
    expect(html).not.toContain('value="Sales A/c');
    expect(html).not.toContain('value="Dr.');
    expect(html).not.toContain('value="To');
    expect(html).not.toContain('value="12000"');
    expect(html).not.toContain('value="12,000"');
    expect(html).not.toContain("Cash A/c Dr. ₹12,000");
    expect(html).not.toContain("To Sales A/c ₹12,000");
    expect(html).not.toContain("Being goods sold for cash.");
    expect(html).not.toContain("Correct Answer");
    expect(html).not.toContain("result_status");
  });

  it("keeps the first Practice It Yourself checker constrained to the single cash-sale question", () => {
    const practiceSections = journalEntriesChapter.sections.filter((section) => section.type === "practice-it-yourself");
    const checkingReadySections = practiceSections.filter((section) => section.question.status === "checking-ready");

    expect(checkingReadySections).toHaveLength(1);
    expect(checkingReadySections[0]?.question).toMatchObject({
      id: soldGoodsForCashPracticeQuestion.id,
      question: "Sold goods for cash ₹12,000. Pass the journal entry.",
      status: "checking-ready",
    });
  });

  it("keeps answer keys server-controlled and the editor bounded for the Phase 3E safety slice", () => {
    const editorSource = readFileSync("app/platform-preview/_components/JournalEntryPracticeEditor.tsx", "utf8");
    const actionsSource = readFileSync("app/platform-preview/chapters/journal-entries/actions.ts", "utf8");
    const answerKeySource = readFileSync(
      "lib/learning-platform/chapters/journal-entry-answer-keys.server.ts",
      "utf8",
    );

    expect(editorSource).not.toContain("journal-entry-answer-keys.server");
    expect(actionsSource).toContain("journal-entry-answer-keys.server");
    expect(answerKeySource).toContain("soldGoodsForCashAnswerKey");
    expect(editorSource).toContain("JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows");
    expect(editorSource).toContain("Maximum 6 rows");
    expect(editorSource).toContain("clearCheckedFeedback");
    expect(editorSource).toContain("Checking your answer...");
    expect(editorSource).toContain("aria-busy");
    expect(editorSource).toContain("disabled={isChecking || isCurrentAttemptBlank}");
  });

  it("does not link the internal preview routes from the existing public homepage", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).not.toContain('href="/platform-preview"');
    expect(html).not.toContain('href="/platform-preview/chapters"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries"');
  });
});
