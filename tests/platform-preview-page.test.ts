import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import PlatformPreviewLayout, { metadata as platformPreviewMetadata } from "@/app/platform-preview/layout";
import PlatformPreviewDashboardPage from "@/app/platform-preview/page";
import PlatformPreviewChaptersPage from "@/app/platform-preview/chapters/page";
import JournalEntriesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/page";
import AccountsAffectedChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/accounts-affected/page";
import BusinessTransactionsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/business-transactions/page";
import DebitAndCreditRulesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/debit-and-credit-rules/page";
import TypesOfAccountsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/types-of-accounts/page";
import {
  JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  journalEntriesChapter,
  paidSalaryByBankPracticeQuestion,
  soldGoodsForCashPracticeQuestion,
} from "@/lib/learning-platform/chapters/journal-entries";
import {
  paidSalaryByBankExpectedAnswer,
  soldGoodsForCashExpectedAnswer,
} from "@/lib/learning-platform/chapters/journal-entry-answer-keys.server";

function getLinkMarkup(html: string, href: string) {
  return html.match(new RegExp(`<a[^>]*href="${href}"[\\s\\S]*?</a>`))?.[0] ?? "";
}

function getButtonMarkups(html: string, label: string) {
  return Array.from(html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g))
    .map((match) => match[0])
    .filter((button) => button.includes(label));
}

describe("Platform preview routes", () => {
  it("defines the Journal Entries chapter with typed ordered content sections", () => {
    expect(journalEntriesChapter.metadata.slug).toBe("journal-entries");
    expect(journalEntriesChapter.outline).toHaveLength(16);
    expect(journalEntriesChapter.outline.map((item) => item.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );

    expect(journalEntriesChapter.subtopics.map((subtopic) => subtopic.slug)).toEqual([
      JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
      JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
      JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
      JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
      JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
    ]);
    expect(journalEntriesChapter.subtopics[0]).toMatchObject({
      order: 1,
      title: "Introduction to Journal Entries and Journal Format",
      progressLabel: "Section 1 of 16",
    });
    expect(journalEntriesChapter.subtopics[1]).toMatchObject({
      order: 2,
      title: "Business Transactions",
      progressLabel: "Section 2 of 16",
    });
    expect(journalEntriesChapter.subtopics[2]).toMatchObject({
      order: 3,
      title: "Accounts Affected",
      progressLabel: "Section 3 of 16",
    });
    expect(journalEntriesChapter.subtopics[3]).toMatchObject({
      order: 4,
      title: "Types of Accounts",
      progressLabel: "Section 4 of 16",
    });
    expect(journalEntriesChapter.subtopics[4]).toMatchObject({
      order: 5,
      title: "Debit and Credit Rules",
      progressLabel: "Section 5 of 16",
    });
    expect(journalEntriesChapter.subtopics[0].nextSection?.slug).toBe(JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[1].previousSection?.slug).toBe(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[1].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
      title: "Accounts Affected",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[2].previousSection?.slug).toBe(JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[2].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
      title: "Types of Accounts",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[3].previousSection?.slug).toBe(JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[3].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
      title: "Debit and Credit Rules",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[4].previousSection?.slug).toBe(JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[4].nextSection).toMatchObject({
      slug: "journal-format-and-narration",
      title: "Journal Format and Narration",
      availabilityStatus: "upcoming",
    });

    expect(journalEntriesChapter.sections.filter((section) => section.type === "concept-explanation")).toHaveLength(1);
    expect(journalEntriesChapter.sections.filter((section) => section.type === "solved-illustration")).toHaveLength(2);
    expect(journalEntriesChapter.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[1].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[1].sections.filter((section) => section.type === "comparison")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[1].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[2].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[2].sections.filter((section) => section.type === "clue-guide")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[2].sections.filter((section) => section.type === "comparison")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[2].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[3].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[3].sections.filter((section) => section.type === "classification-categories")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[3].sections.filter((section) => section.type === "classification-guide")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[3].sections.filter((section) => section.type === "classification-examples")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[3].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "debit-credit-rule-guide")).toHaveLength(3);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "comparison")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[4].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
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

  it("defines a balanced internal expected answer for the paid-salary-by-bank practice question", () => {
    const debitTotal = paidSalaryByBankExpectedAnswer.lines
      .filter((line) => line.side === "debit")
      .reduce((total, line) => total + line.amount, 0);
    const creditTotal = paidSalaryByBankExpectedAnswer.lines
      .filter((line) => line.side === "credit")
      .reduce((total, line) => total + line.amount, 0);

    expect(debitTotal).toBe(8000);
    expect(creditTotal).toBe(8000);
    expect(paidSalaryByBankExpectedAnswer.totals).toEqual({ debit: 8000, credit: 8000 });
    expect(paidSalaryByBankExpectedAnswer.balanced).toBe(true);
    expect(paidSalaryByBankExpectedAnswer.lines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ account: "Salary A/c", side: "debit", amount: 8000 }),
        expect.objectContaining({ account: "Bank A/c", side: "credit", amount: 8000 }),
      ]),
    );
    expect("expectedAnswer" in paidSalaryByBankPracticeQuestion).toBe(false);
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

  it("defines the Accounts Affected worked examples with account-identification-safe entries", () => {
    const accountsAffectedSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
    );

    const creditSaleExample = accountsAffectedSubtopic?.sections.find(
      (section) => section.type === "solved-illustration" && section.id === "credit-sale-to-riya-worked-example",
    );
    const furnitureExample = accountsAffectedSubtopic?.sections.find(
      (section) => section.type === "solved-illustration" && section.id === "furniture-on-credit-from-mohan-worked-example",
    );
    const drawingsExample = accountsAffectedSubtopic?.sections.find(
      (section) => section.type === "solved-illustration" && section.id === "amit-cash-drawings-worked-example",
    );

    expect(creditSaleExample?.type).toBe("solved-illustration");
    expect(furnitureExample?.type).toBe("solved-illustration");
    expect(drawingsExample?.type).toBe("solved-illustration");

    if (
      creditSaleExample?.type !== "solved-illustration" ||
      furnitureExample?.type !== "solved-illustration" ||
      drawingsExample?.type !== "solved-illustration"
    ) {
      throw new Error("Accounts Affected worked examples were not found");
    }

    expect(creditSaleExample.illustration.journalEntry.map((line) => line.account)).toEqual(["Riya A/c", "Sales A/c"]);
    expect(creditSaleExample.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(creditSaleExample.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(furnitureExample.illustration.journalEntry.map((line) => line.account)).toEqual(["Furniture A/c", "Mohan A/c"]);
    expect(furnitureExample.illustration.journalEntry.map((line) => line.account)).not.toContain("Purchases A/c");
    expect(drawingsExample.illustration.journalEntry.map((line) => line.account)).toEqual(["Amit Drawings A/c", "Cash A/c"]);
  });

  it("defines Types of Accounts as classification-only content without a checker", () => {
    const typesSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
    );
    const guideSection = typesSubtopic?.sections.find((section) => section.type === "classification-guide");
    const examplesSection = typesSubtopic?.sections.find((section) => section.type === "classification-examples");
    const mistakesSection = typesSubtopic?.sections.find(
      (section) => section.type === "common-mistakes" && section.id === "types-of-accounts-common-mistakes",
    );

    expect(typesSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(typesSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(guideSection?.type).toBe("classification-guide");
    expect(examplesSection?.type).toBe("classification-examples");
    expect(mistakesSection?.type).toBe("common-mistakes");

    if (
      guideSection?.type !== "classification-guide" ||
      examplesSection?.type !== "classification-examples" ||
      mistakesSection?.type !== "common-mistakes"
    ) {
      throw new Error("Types of Accounts classification sections were not found");
    }

    expect(guideSection.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          account: "Bank A/c",
          modernClassification: "Asset",
          traditionalClassification: "Artificial Personal Account",
        }),
        expect.objectContaining({
          account: "Cash A/c",
          modernClassification: "Asset",
          traditionalClassification: "Real Account",
        }),
        expect.objectContaining({
          account: "Amit's Capital A/c",
          modernClassification: "Capital / Equity",
          traditionalClassification: "Personal Account",
        }),
        expect.objectContaining({
          account: "Outstanding Salary A/c",
          modernClassification: "Liability",
          traditionalClassification: "Representative Personal Account",
        }),
      ]),
    );
    expect(examplesSection.examples).toHaveLength(4);
    expect(examplesSection.examples[3].accounts.map((account) => account.account)).toEqual([
      "Bank A/c",
      "Amit's Capital A/c",
    ]);
    expect(guideSection.rows.map((row) => row.account)).not.toContain("Capital A/c");
    expect(mistakesSection.mistakes).toContain("Treating Drawings as a business expense.");
  });

  it("defines Debit and Credit Rules as rule-only content without a checker", () => {
    const debitCreditSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
    );
    const modernRulesSection = debitCreditSubtopic?.sections.find(
      (section) => section.type === "debit-credit-rule-guide" && section.id === "modern-debit-credit-rules",
    );
    const matrixSection = debitCreditSubtopic?.sections.find(
      (section) => section.type === "debit-credit-rule-guide" && section.id === "modern-rule-summary-matrix",
    );
    const traditionalRulesSection = debitCreditSubtopic?.sections.find(
      (section) => section.type === "debit-credit-rule-guide" && section.id === "traditional-golden-rules",
    );
    const workedExamples = debitCreditSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(debitCreditSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(debitCreditSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(modernRulesSection?.type).toBe("debit-credit-rule-guide");
    expect(matrixSection?.type).toBe("debit-credit-rule-guide");
    expect(traditionalRulesSection?.type).toBe("debit-credit-rule-guide");
    expect(workedExamples).toHaveLength(6);

    if (
      modernRulesSection?.type !== "debit-credit-rule-guide" ||
      matrixSection?.type !== "debit-credit-rule-guide" ||
      traditionalRulesSection?.type !== "debit-credit-rule-guide"
    ) {
      throw new Error("Debit and Credit Rules guide sections were not found");
    }

    expect(modernRulesSection.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Assets", increaseTreatment: "Debit", decreaseTreatment: "Credit" }),
        expect.objectContaining({ title: "Liabilities", increaseTreatment: "Credit", decreaseTreatment: "Debit" }),
        expect.objectContaining({ title: "Capital / Equity", increaseTreatment: "Credit", decreaseTreatment: "Debit" }),
        expect.objectContaining({ title: "Income / Revenue", increaseTreatment: "Credit", decreaseTreatment: "Debit" }),
        expect.objectContaining({ title: "Expenses / Losses", increaseTreatment: "Debit", decreaseTreatment: "Credit" }),
        expect.objectContaining({ title: "Drawings", increaseTreatment: "Debit", decreaseTreatment: "Credit" }),
      ]),
    );
    expect(matrixSection.rules.map((rule) => `${rule.title}:${rule.increaseTreatment}:${rule.decreaseTreatment}`)).toEqual([
      "Asset:Debit:Credit",
      "Liability:Credit:Debit",
      "Capital / Equity:Credit:Debit",
      "Income / Revenue:Credit:Debit",
      "Expense / Loss:Debit:Credit",
      "Drawings:Debit:Credit",
    ]);
    expect(traditionalRulesSection.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Personal Account", rule: "Debit the receiver, credit the giver." }),
        expect.objectContaining({ title: "Real Account", rule: "Debit what comes in, credit what goes out." }),
        expect.objectContaining({
          title: "Nominal Account",
          rule: "Debit all expenses and losses, credit all incomes and gains.",
        }),
      ]),
    );

    const capitalExample = workedExamples.find(
      (section) => section.type === "solved-illustration" && section.id === "debit-credit-amit-capital-bank",
    );
    const businessWithdrawalExample = workedExamples.find(
      (section) => section.type === "solved-illustration" && section.id === "debit-credit-business-cash-withdrawal",
    );
    const personalWithdrawalExample = workedExamples.find(
      (section) => section.type === "solved-illustration" && section.id === "debit-credit-personal-cash-withdrawal",
    );

    expect(capitalExample?.type).toBe("solved-illustration");
    expect(businessWithdrawalExample?.type).toBe("solved-illustration");
    expect(personalWithdrawalExample?.type).toBe("solved-illustration");

    if (
      capitalExample?.type !== "solved-illustration" ||
      businessWithdrawalExample?.type !== "solved-illustration" ||
      personalWithdrawalExample?.type !== "solved-illustration"
    ) {
      throw new Error("Debit and Credit Rules worked examples were not found");
    }

    expect(capitalExample.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Amit's Capital A/c",
    ]);
    expect(businessWithdrawalExample.illustration.accountsAffected).toEqual(["Cash A/c", "Bank A/c"]);
    expect(businessWithdrawalExample.illustration.accountsAffected).not.toContain("Drawings A/c");
    expect(personalWithdrawalExample.illustration.accountsAffected).toEqual(["Amit Drawings A/c", "Cash A/c"]);
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

  it("renders the first Journal Entries section with blank fields, two checkers, and a next-section link", () => {
    const html = renderToStaticMarkup(createElement(JournalEntriesChapterPreviewPage));
    const checkButtons = getButtonMarkups(html, "Check Answer");

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Foundation chapter");
    expect(html).toContain("Introduction to Journal Entries and Journal Format");
    expect(html).toContain("Section 1 of 16");
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
    expect(html).toContain("Practice 1 of 2");
    expect(html).toContain("Practice 2 of 2");
    expect(html).toContain("Sold goods for cash ₹12,000. Pass the journal entry.");
    expect(html).toContain("Paid salary by bank ₹8,000. Pass the journal entry.");
    expect(html).toContain("This preview checker supports this question independently.");
    expect(html).toContain("practice-particulars-journal-entry-sold-goods-for-cash-practice-preview-1");
    expect(html).toContain("practice-particulars-journal-entry-paid-salary-by-bank-practice-preview-1");
    expect(html).toContain("practice-debit-journal-entry-sold-goods-for-cash-practice-preview-1");
    expect(html).toContain("practice-credit-journal-entry-paid-salary-by-bank-practice-preview-1");
    expect(html).toContain("practice-narration-journal-entry-sold-goods-for-cash-practice-preview");
    expect(html).toContain("practice-narration-journal-entry-paid-salary-by-bank-practice-preview");
    expect(html).toContain("practice-total-debit-journal-entry-sold-goods-for-cash-practice-preview");
    expect(html).toContain("practice-total-credit-journal-entry-paid-salary-by-bank-practice-preview");
    expect(html).toContain("Check Answer");
    expect(checkButtons).toHaveLength(2);
    checkButtons.forEach((checkButton) => {
      expect(checkButton).toContain("disabled=");
      expect(checkButton).toContain('aria-disabled="true"');
    });
    expect(html).toContain("Write the full particulars yourself");
    expect(html).toContain('id="practice-feedback-journal-entry-sold-goods-for-cash-practice-preview"');
    expect(html).toContain('id="practice-feedback-journal-entry-paid-salary-by-bank-practice-preview"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Feedback will appear here after you check your answer.");
    expect(html).toContain("This preview checker supports this individual question only.");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).toContain("Common mistakes");

    expect(html).not.toContain('value="Cash A/c');
    expect(html).not.toContain('value="Sales A/c');
    expect(html).not.toContain('value="Salary A/c');
    expect(html).not.toContain('value="Bank A/c');
    expect(html).not.toContain('value="Dr.');
    expect(html).not.toContain('value="To');
    expect(html).not.toContain('value="12000"');
    expect(html).not.toContain('value="12,000"');
    expect(html).not.toContain('value="8000"');
    expect(html).not.toContain('value="8,000"');
    expect(html).not.toContain("Cash A/c Dr. ₹12,000");
    expect(html).not.toContain("To Sales A/c ₹12,000");
    expect(html).not.toContain("Being goods sold for cash.");
    expect(html).not.toContain("Salary A/c Dr. ₹8,000");
    expect(html).not.toContain("To Bank A/c ₹8,000");
    expect(html).not.toContain("Being salary paid by bank.");
    expect(html).not.toContain("Correct Answer");
    expect(html).not.toContain("result_status");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/business-transactions"');
    expect(html).toContain("Continue to Business Transactions");
    expect(html).not.toContain("Continue to Business Transactions - Preview only");
  });

  it("renders the Business Transactions section without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(BusinessTransactionsChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Business Transactions");
    expect(html).toContain("Section 2 of 16");
    expect(html).toContain("A business transaction is an economic event that affects the business.");
    expect(html).toContain("Transaction versus event");
    expect(html).toContain("Paid office rent by bank ₹5,000.");
    expect(html).toContain("The owner plans to purchase machinery next month.");
    expect(html).toContain("Account-identification method");
    expect(html).toContain("Read the transaction carefully");
    expect(html).toContain("Confirm total debit equals total credit");
    expect(html).toContain("Bought goods for cash ₹10,000.");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Being goods purchased for cash.");
    expect(html).toContain("Received a bank loan of ₹50,000 in the bank account.");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("To Loan A/c");
    expect(html).toContain("Being loan received through bank.");
    expect(html).toContain("Previous Introduction to Journal Entries and Journal Format");
    expect(html).toContain("Continue to Accounts Affected");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/business-transactions")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/accounts-affected"');
    expect(html).not.toContain("Continue to Accounts Affected - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Accounts Affected section without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(AccountsAffectedChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Accounts Affected");
    expect(html).toContain("Section 3 of 16");
    expect(html).toContain("Every business transaction affects at least two accounts.");
    expect(html).toContain("Read, identify, then apply rules");
    expect(html).toContain("Read the complete transaction");
    expect(html).toContain("Move to classification and treatment");
    expect(html).toContain("Common clues and likely accounts");
    expect(html).toContain("bank, cheque, or bank transfer");
    expect(html).toContain("Amit&#x27;s Capital A/c");
    expect(html).toContain("Goods purchased versus asset purchased");
    expect(html).toContain("Transaction: Bought goods for cash ₹10,000.");
    expect(html).toContain("Accounts affected: Purchases A/c and Cash A/c.");
    expect(html).toContain("Transaction: Bought furniture for cash ₹10,000.");
    expect(html).toContain("Accounts affected: Furniture A/c and Cash A/c.");
    expect(html).toContain("Sold goods on credit to Riya ₹8,000.");
    expect(html).toContain("Riya A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Being goods sold on credit to Riya.");
    expect(html).toContain("Bought furniture on credit from Mohan ₹20,000.");
    expect(html).toContain("Furniture A/c Dr.");
    expect(html).toContain("To Mohan A/c");
    expect(html).toContain("Being furniture purchased on credit from Mohan.");
    expect(html).toContain("Amit withdrew cash ₹5,000 for personal use.");
    expect(html).toContain("Amit Drawings A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Being cash withdrawn by Amit for personal use.");
    expect(html).toContain("Before writing any journal entry, ask: Which accounts changed, and why?");
    expect(html).toContain("Previous Business Transactions");
    expect(html).toContain("Continue to Types of Accounts");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/accounts-affected")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/business-transactions"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/types-of-accounts"');
    expect(html).not.toContain("Continue to Types of Accounts - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Types of Accounts section without adding a checker or next-route link", () => {
    const html = renderToStaticMarkup(createElement(TypesOfAccountsChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Types of Accounts");
    expect(html).toContain("Section 4 of 16");
    expect(html).toContain("Why accounts are classified");
    expect(html).toContain("Modern classification");
    expect(html).toContain("Assets");
    expect(html).toContain("Liabilities");
    expect(html).toContain("Capital / Equity");
    expect(html).toContain("Income / Revenue");
    expect(html).toContain("Expenses / Losses");
    expect(html).toContain("Drawings is not a business expense");
    expect(html).toContain("Traditional classification");
    expect(html).toContain("Personal Accounts");
    expect(html).toContain("Natural persons");
    expect(html).toContain("Artificial persons");
    expect(html).toContain("Representative personal accounts");
    expect(html).toContain("Real Accounts");
    expect(html).toContain("Tangible real accounts");
    expect(html).toContain("Intangible real accounts");
    expect(html).toContain("Nominal Accounts");
    expect(html).toContain("Same account, two classification views");
    expect(html).toContain("Cash A/c");
    expect(html).toContain("Real Account");
    expect(html).toContain("Bank A/c");
    expect(html).toContain("Artificial Personal Account");
    expect(html).toContain("Amit&#x27;s Capital A/c");
    expect(html).toContain("Classification process");
    expect(html).toContain("Read the account name");
    expect(html).toContain("Confirm before rules");
    expect(html).toContain("Paid salary by bank ₹8,000.");
    expect(html).toContain("Bought furniture for cash ₹20,000.");
    expect(html).toContain("Sold goods on credit to Riya ₹10,000.");
    expect(html).toContain("Amit introduced capital of ₹50,000 by bank.");
    expect(html).toContain("Continue using the named capital account.");
    expect(html).toContain("For every account, ask: What does this account represent to the business?");
    expect(html).toContain("Previous Accounts Affected");
    expect(html).toContain("Continue to Debit and Credit Rules");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/types-of-accounts")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/accounts-affected"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/debit-and-credit-rules"');
    expect(html).not.toContain("Continue to Debit and Credit Rules - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Debit and Credit Rules section without adding a checker or next-route link", () => {
    const html = renderToStaticMarkup(createElement(DebitAndCreditRulesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Debit and Credit Rules");
    expect(html).toContain("Section 5 of 16");
    expect(html).toContain("What debit and credit mean");
    expect(html).toContain("Debit means the left side of an account.");
    expect(html).toContain("Credit means the right side of an account.");
    expect(html).toContain("Cash received is not always credited");
    expect(html).toContain("Modern rules");
    expect(html).toContain("Assets");
    expect(html).toContain("Liabilities");
    expect(html).toContain("Capital / Equity");
    expect(html).toContain("Income / Revenue");
    expect(html).toContain("Expenses / Losses");
    expect(html).toContain("Drawings");
    expect(html).toContain("Modern-rule summary matrix");
    expect(html).toContain("Increase");
    expect(html).toContain("Decrease");
    expect(html).toContain("Traditional golden rules");
    expect(html).toContain("Personal Account");
    expect(html).toContain("Debit the receiver, credit the giver.");
    expect(html).toContain("Real Account");
    expect(html).toContain("Debit what comes in, credit what goes out.");
    expect(html).toContain("Nominal Account");
    expect(html).toContain("Debit all expenses and losses, credit all incomes and gains.");
    expect(html).toContain("Modern + traditional comparison");
    expect(html).toContain("Result: Salary A/c Dr. ₹8,000; To Bank A/c ₹8,000.");
    expect(html).toContain("Result: Furniture A/c Dr. ₹20,000; To Cash A/c ₹20,000.");
    expect(html).toContain("Debit-credit decision process");
    expect(html).toContain("Read the complete transaction");
    expect(html).toContain("Add narration where required");
    expect(html).toContain("Paid rent by bank ₹5,000.");
    expect(html).toContain("Rent A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Being rent paid by bank.");
    expect(html).toContain("Bought furniture for cash ₹20,000.");
    expect(html).toContain("Furniture A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Being furniture purchased for cash.");
    expect(html).toContain("Sold goods on credit to Riya ₹10,000.");
    expect(html).toContain("Riya A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Being goods sold on credit to Riya.");
    expect(html).toContain("Amit introduced capital of ₹50,000 through bank.");
    expect(html).toContain("To Amit&#x27;s Capital A/c");
    expect(html).not.toContain("To Capital A/c");
    expect(html).toContain("Cash withdrawn from bank ₹3,000 for office use.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("Being cash withdrawn from bank for office use.");
    expect(html).toContain("This is not drawings because the withdrawal is for business use.");
    expect(html).toContain("Amit withdrew cash ₹5,000 for personal use.");
    expect(html).toContain("Amit Drawings A/c Dr.");
    expect(html).toContain("Being cash withdrawn by Amit for personal use.");
    expect(html).toContain("Before choosing Debit or Credit, ask: What account is this, and is it increasing or decreasing?");
    expect(html).toContain("Previous Types of Accounts");
    expect(html).toContain("Continue to Journal Format and Narration - Preview only");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/debit-and-credit-rules")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/types-of-accounts"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/journal-format-and-narration"');
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("keeps Practice It Yourself constrained to the two approved checking-ready questions", () => {
    const practiceSections = journalEntriesChapter.subtopics
      .flatMap((subtopic) => subtopic.sections)
      .filter((section) => section.type === "practice-it-yourself");
    const checkingReadySections = practiceSections.filter((section) => section.question.status === "checking-ready");

    expect(checkingReadySections).toHaveLength(2);
    expect(checkingReadySections.map((section) => section.question.id)).toEqual([
      soldGoodsForCashPracticeQuestion.id,
      paidSalaryByBankPracticeQuestion.id,
    ]);
    expect(checkingReadySections.map((section) => section.question.question)).toEqual([
      "Sold goods for cash ₹12,000. Pass the journal entry.",
      "Paid salary by bank ₹8,000. Pass the journal entry.",
    ]);
  });

  it("keeps answer keys server-controlled and the editors independent for the Phase 3F slice", () => {
    const editorSource = readFileSync("app/platform-preview/_components/JournalEntryPracticeEditor.tsx", "utf8");
    const actionsSource = readFileSync("app/platform-preview/chapters/journal-entries/actions.ts", "utf8");
    const answerKeySource = readFileSync(
      "lib/learning-platform/chapters/journal-entry-answer-keys.server.ts",
      "utf8",
    );

    expect(editorSource).not.toContain("journal-entry-answer-keys.server");
    expect(actionsSource).toContain("journal-entry-answer-keys.server");
    expect(answerKeySource).toContain("soldGoodsForCashAnswerKey");
    expect(answerKeySource).toContain("paidSalaryByBankAnswerKey");
    expect(editorSource).toContain("JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows");
    expect(editorSource).toContain("Maximum 6 rows");
    expect(editorSource).toContain("clearCheckedFeedback");
    expect(editorSource).toContain("Checking your answer...");
    expect(editorSource).toContain("aria-busy");
    expect(editorSource).toContain("disabled={isChecking || isCurrentAttemptBlank}");
    expect(editorSource).toContain("const fieldPrefix = question.id");
    expect(editorSource).toContain("setRows(createInitialRows(question))");
  });

  it("does not link the internal preview routes from the existing public homepage", () => {
    const html = renderToStaticMarkup(createElement(HomePage));

    expect(html).not.toContain('href="/platform-preview"');
    expect(html).not.toContain('href="/platform-preview/chapters"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/business-transactions"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/accounts-affected"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/types-of-accounts"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/debit-and-credit-rules"');
  });
});
