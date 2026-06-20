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
import AssetsAndLiabilitiesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/assets-and-liabilities/page";
import BusinessTransactionsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/business-transactions/page";
import CashAndBankTransactionsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/cash-and-bank-transactions/page";
import CapitalChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/capital/page";
import DebitAndCreditRulesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/debit-and-credit-rules/page";
import DrawingsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/drawings/page";
import ExpensesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/expenses/page";
import IncomeChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/income/page";
import JournalFormatAndNarrationChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/journal-format-and-narration/page";
import MixedSimpleEntriesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/mixed-simple-entries/page";
import PurchasesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/purchases/page";
import SalesChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/sales/page";
import TypesOfAccountsChapterPreviewPage from "@/app/platform-preview/chapters/journal-entries/types-of-accounts/page";
import {
  JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
  JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
  JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
  JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
  JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
  JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
  JOURNAL_ENTRIES_SALES_SECTION_SLUG,
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
      JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
      JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
      JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
      JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
      JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
      JOURNAL_ENTRIES_SALES_SECTION_SLUG,
      JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
      JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
      JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
      JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
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
    expect(journalEntriesChapter.subtopics[5]).toMatchObject({
      order: 6,
      title: "Journal Format and Narration",
      progressLabel: "Section 6 of 16",
    });
    expect(journalEntriesChapter.subtopics[6]).toMatchObject({
      order: 7,
      title: "Cash and Bank Transactions",
      progressLabel: "Section 7 of 16",
    });
    expect(journalEntriesChapter.subtopics[7]).toMatchObject({
      order: 8,
      title: "Capital",
      progressLabel: "Section 8 of 16",
    });
    expect(journalEntriesChapter.subtopics[8]).toMatchObject({
      order: 9,
      title: "Drawings",
      progressLabel: "Section 9 of 16",
    });
    expect(journalEntriesChapter.subtopics[9]).toMatchObject({
      order: 10,
      title: "Purchases",
      progressLabel: "Section 10 of 16",
    });
    expect(journalEntriesChapter.subtopics[10]).toMatchObject({
      order: 11,
      title: "Sales",
      progressLabel: "Section 11 of 16",
    });
    expect(journalEntriesChapter.subtopics[11]).toMatchObject({
      order: 12,
      title: "Expenses",
      progressLabel: "Section 12 of 16",
    });
    expect(journalEntriesChapter.subtopics[12]).toMatchObject({
      order: 13,
      title: "Income",
      progressLabel: "Section 13 of 16",
    });
    expect(journalEntriesChapter.subtopics[13]).toMatchObject({
      order: 14,
      title: "Assets and Liabilities",
      progressLabel: "Section 14 of 16",
    });
    expect(journalEntriesChapter.subtopics[14]).toMatchObject({
      order: 15,
      title: "Mixed Simple Entries",
      progressLabel: "Section 15 of 16",
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
      slug: JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
      title: "Journal Format and Narration",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[5].previousSection?.slug).toBe(JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[5].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
      title: "Cash and Bank Transactions",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[6].previousSection?.slug).toBe(
      JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
    );
    expect(journalEntriesChapter.subtopics[6].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
      title: "Capital",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[7].previousSection?.slug).toBe(
      JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
    );
    expect(journalEntriesChapter.subtopics[7].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
      title: "Drawings",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[8].previousSection?.slug).toBe(JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[8].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
      title: "Purchases",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[9].previousSection?.slug).toBe(JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[9].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_SALES_SECTION_SLUG,
      title: "Sales",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[10].previousSection?.slug).toBe(JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[10].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
      title: "Expenses",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[11].previousSection?.slug).toBe(JOURNAL_ENTRIES_SALES_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[11].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
      title: "Income",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[12].previousSection?.slug).toBe(JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[12].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
      title: "Assets and Liabilities",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[13].previousSection?.slug).toBe(JOURNAL_ENTRIES_INCOME_SECTION_SLUG);
    expect(journalEntriesChapter.subtopics[13].nextSection).toMatchObject({
      slug: JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
      title: "Mixed Simple Entries",
      availabilityStatus: "available",
    });
    expect(journalEntriesChapter.subtopics[14].previousSection?.slug).toBe(
      JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
    );
    expect(journalEntriesChapter.subtopics[14].nextSection).toMatchObject({
      slug: "chapter-recap-and-practice",
      title: "Chapter Recap and Practice",
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
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "accounting-format")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "journal-column-guide")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "comparison")).toHaveLength(3);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[5].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "clue-guide")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "comparison")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(9);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[6].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(3);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "accounting-format")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "comparison")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[7].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(3);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "accounting-format")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "comparison")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[8].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(3);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "accounting-format")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "comparison")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "recap")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[9].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "accounting-format")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "comparison")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "recap")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[10].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "accounting-format")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "comparison")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "recap")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[11].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(4);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "accounting-format")).toHaveLength(7);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "comparison")).toHaveLength(5);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(7);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "recap")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[12].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "accounting-format")).toHaveLength(7);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "comparison")).toHaveLength(6);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(7);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "process-steps")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[13].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "concept-explanation")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "clue-guide")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "comparison")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "solved-illustration")).toHaveLength(12);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "try-before-reveal")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "common-mistakes")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "process-steps")).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "recap")).toHaveLength(1);
    expect(journalEntriesChapter.subtopics[14].sections.filter((section) => section.type === "reflection-prompt")).toHaveLength(1);
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

  it("defines Journal Format and Narration as presentation-only content without a checker", () => {
    const journalFormatSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
    );
    const columnGuideSection = journalFormatSubtopic?.sections.find((section) => section.type === "journal-column-guide");
    const solvedIllustrations = journalFormatSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];
    const checklistSection = journalFormatSubtopic?.sections.find(
      (section) => section.type === "recap" && section.id === "journal-format-presentation-checklist",
    );

    expect(journalFormatSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(journalFormatSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(columnGuideSection?.type).toBe("journal-column-guide");
    expect(checklistSection?.type).toBe("recap");
    expect(solvedIllustrations).toHaveLength(4);

    if (columnGuideSection?.type !== "journal-column-guide" || checklistSection?.type !== "recap") {
      throw new Error("Journal Format and Narration display sections were not found");
    }

    expect(columnGuideSection.columns.map((column) => column.title)).toEqual([
      "Date",
      "Particulars",
      "L.F.",
      "Debit amount",
      "Credit amount",
    ]);
    expect(columnGuideSection.columns[2]).toMatchObject({
      title: "L.F.",
      purpose: "L.F. means Ledger Folio.",
    });

    const capitalIllustration = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "journal-format-amit-capital-bank",
    );

    expect(capitalIllustration?.type).toBe("solved-illustration");
    if (capitalIllustration?.type !== "solved-illustration") {
      throw new Error("Journal Format named-capital illustration was not found");
    }

    expect(capitalIllustration.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Amit's Capital A/c",
    ]);
    expect(capitalIllustration.illustration.journalEntry.map((line) => line.account)).not.toContain("Capital A/c");
    expect(checklistSection.points).toContain("Debit account is written first.");
    expect(checklistSection.points).toContain("L.F. is used correctly or left blank.");
    expect(checklistSection.points).toContain("Debit total equals credit total.");
  });

  it("defines Cash and Bank Transactions as display-only content without a checker", () => {
    const cashBankSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
    );
    const clueGuideSection = cashBankSubtopic?.sections.find(
      (section) => section.type === "clue-guide" && section.id === "payment-mode-clue-guide",
    );
    const solvedIllustrations = cashBankSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];
    const businessPersonalComparison = cashBankSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "business-withdrawal-versus-drawings",
    );
    const creditWarning = cashBankSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "credit-transaction-warning",
    );

    expect(cashBankSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(cashBankSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(clueGuideSection?.type).toBe("clue-guide");
    expect(solvedIllustrations.length).toBeGreaterThanOrEqual(7);
    expect(businessPersonalComparison?.type).toBe("comparison");
    expect(creditWarning?.type).toBe("comparison");

    if (
      clueGuideSection?.type !== "clue-guide" ||
      businessPersonalComparison?.type !== "comparison" ||
      creditWarning?.type !== "comparison"
    ) {
      throw new Error("Cash and Bank Transactions display sections were not found");
    }

    expect(clueGuideSection.clues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ clue: "for cash", likelyAccounts: ["Cash A/c"] }),
        expect.objectContaining({ clue: "by bank", likelyAccounts: ["Bank A/c"] }),
        expect.objectContaining({ clue: "on credit", likelyAccounts: ["Customer/Supplier A/c"] }),
        expect.objectContaining({ clue: "deposited cash into bank", likelyAccounts: ["Bank A/c", "Cash A/c"] }),
        expect.objectContaining({ clue: "withdrew cash from bank for office use", likelyAccounts: ["Cash A/c", "Bank A/c"] }),
      ]),
    );

    const depositExample = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "cash-bank-cash-deposited-into-bank",
    );
    const officeWithdrawalExample = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "cash-bank-business-withdrawal-office-use",
    );
    const personalWithdrawalExample = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "cash-bank-personal-bank-withdrawal",
    );

    expect(depositExample?.type).toBe("solved-illustration");
    expect(officeWithdrawalExample?.type).toBe("solved-illustration");
    expect(personalWithdrawalExample?.type).toBe("solved-illustration");

    if (
      depositExample?.type !== "solved-illustration" ||
      officeWithdrawalExample?.type !== "solved-illustration" ||
      personalWithdrawalExample?.type !== "solved-illustration"
    ) {
      throw new Error("Cash and Bank Transactions transfer examples were not found");
    }

    expect(depositExample.illustration.journalEntry.map((line) => line.account)).toEqual(["Bank A/c", "Cash A/c"]);
    expect(officeWithdrawalExample.illustration.journalEntry.map((line) => line.account)).toEqual(["Cash A/c", "Bank A/c"]);
    expect(officeWithdrawalExample.illustration.accountsAffected).not.toContain("Drawings A/c");
    expect(personalWithdrawalExample.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Riya Drawings A/c",
      "Bank A/c",
    ]);
    expect(personalWithdrawalExample.illustration.accountsAffected).not.toContain("Cash A/c");
    expect(creditWarning.groups[0].items.join(" ")).toContain("To Mohan A/c");
    expect(creditWarning.groups[0].items.join(" ")).toContain("Cash A/c and Bank A/c are not affected");
    expect(creditWarning.groups[1].items.join(" ")).toContain("To Sales A/c");
    expect(creditWarning.groups[1].items.join(" ")).toContain("Cash A/c and Bank A/c are not affected");
  });

  it("defines Capital as display-only content with named and multi-partner entries", () => {
    const capitalSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
    );
    const equationSection = capitalSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "capital-accounting-equation-impact",
    );
    const similarReceiptsSection = capitalSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "capital-versus-similar-receipts",
    );
    const designNoteSection = capitalSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "non-cash-capital-design-note",
    );
    const solvedIllustrations = capitalSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(capitalSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(capitalSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(equationSection?.type).toBe("comparison");
    expect(similarReceiptsSection?.type).toBe("comparison");
    expect(designNoteSection?.type).toBe("concept-explanation");
    expect(solvedIllustrations).toHaveLength(5);

    if (
      equationSection?.type !== "comparison" ||
      similarReceiptsSection?.type !== "comparison" ||
      designNoteSection?.type !== "concept-explanation"
    ) {
      throw new Error("Capital display sections were not found");
    }

    expect(equationSection.intro).toContain("Assets = Capital + Liabilities");
    expect(equationSection.groups[2].items).toContain("No direct Profit & Loss impact arises.");
    expect(similarReceiptsSection.groups.map((group) => group.title)).toEqual(["Capital", "Loan", "Sales or income"]);
    expect(designNoteSection.paragraphs.join(" ")).toContain("Later / design-needed");

    const cashCapital = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "capital-riya-cash",
    );
    const bankCapital = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "capital-kuldeep-bank",
    );
    const twoPartnerCash = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "capital-kuldeep-priyanka-cash",
    );
    const twoPartnerBank = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "capital-priyanka-kuldeep-bank",
    );
    const additionalCapital = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "capital-amit-additional-cash",
    );

    expect(cashCapital?.type).toBe("solved-illustration");
    expect(bankCapital?.type).toBe("solved-illustration");
    expect(twoPartnerCash?.type).toBe("solved-illustration");
    expect(twoPartnerBank?.type).toBe("solved-illustration");
    expect(additionalCapital?.type).toBe("solved-illustration");

    if (
      cashCapital?.type !== "solved-illustration" ||
      bankCapital?.type !== "solved-illustration" ||
      twoPartnerCash?.type !== "solved-illustration" ||
      twoPartnerBank?.type !== "solved-illustration" ||
      additionalCapital?.type !== "solved-illustration"
    ) {
      throw new Error("Capital solved illustrations were not found");
    }

    expect(cashCapital.illustration.journalEntry.map((line) => line.account)).toEqual(["Cash A/c", "Riya's Capital A/c"]);
    expect(bankCapital.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Kuldeep's Capital A/c",
    ]);
    expect(twoPartnerCash.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Cash A/c",
      "Kuldeep's Capital A/c",
      "Priyanka's Capital A/c",
    ]);
    expect(twoPartnerCash.illustration.journalEntry.map((line) => line.amount)).toEqual([130000, 80000, 50000]);
    expect(twoPartnerBank.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Priyanka's Capital A/c",
      "Kuldeep's Capital A/c",
    ]);
    expect(twoPartnerBank.illustration.journalEntry.map((line) => line.amount)).toEqual([120000, 50000, 70000]);
    expect(additionalCapital.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Cash A/c",
      "Amit's Capital A/c",
    ]);

    solvedIllustrations.forEach((section) => {
      if (section.type !== "solved-illustration") {
        return;
      }

      expect(section.illustration.journalEntry.map((line) => line.account)).not.toContain("Capital A/c");
    });
  });

  it("defines Drawings as display-only content with personal-use and business-use guardrails", () => {
    const drawingsSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
    );
    const equationSection = drawingsSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "drawings-accounting-equation-impact",
    );
    const businessPersonalSection = drawingsSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "business-withdrawal-versus-personal-drawings",
    );
    const drawingsExpenseSection = drawingsSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "drawings-versus-business-expense",
    );
    const drawingsCapitalSection = drawingsSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "drawings-versus-capital",
    );
    const designNoteSection = drawingsSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "interest-on-drawings-design-note",
    );
    const solvedIllustrations = drawingsSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(drawingsSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(drawingsSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(equationSection?.type).toBe("comparison");
    expect(businessPersonalSection?.type).toBe("comparison");
    expect(drawingsExpenseSection?.type).toBe("comparison");
    expect(drawingsCapitalSection?.type).toBe("comparison");
    expect(designNoteSection?.type).toBe("concept-explanation");
    expect(solvedIllustrations).toHaveLength(5);

    if (
      equationSection?.type !== "comparison" ||
      businessPersonalSection?.type !== "comparison" ||
      drawingsExpenseSection?.type !== "comparison" ||
      drawingsCapitalSection?.type !== "comparison" ||
      designNoteSection?.type !== "concept-explanation"
    ) {
      throw new Error("Drawings display sections were not found");
    }

    expect(equationSection.intro).toContain("Assets = Capital + Liabilities");
    expect(equationSection.groups[1].items).toContain("Profit & Loss is not directly affected.");
    expect(businessPersonalSection.groups[0].items.join(" ")).toContain("Cash A/c Dr. ₹3,000");
    expect(businessPersonalSection.groups[0].items.join(" ")).toContain("It is not drawings.");
    expect(businessPersonalSection.groups[1].items.join(" ")).toContain("Amit Drawings A/c Dr. ₹3,000");
    expect(drawingsExpenseSection.groups.map((group) => group.title)).toEqual(["Drawings", "Business expense"]);
    expect(drawingsCapitalSection.groups.map((group) => group.title)).toEqual(["Capital introduced", "Drawings"]);
    expect(designNoteSection.paragraphs.join(" ")).toContain("Later / design-needed");

    const cashDrawings = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "drawings-priyanka-cash",
    );
    const bankDrawings = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "drawings-kuldeep-bank",
    );
    const goodsDrawings = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "drawings-riya-goods",
    );
    const personalExpense = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "drawings-amit-personal-insurance",
    );
    const businessWithdrawal = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "drawings-office-use-bank-withdrawal",
    );

    expect(cashDrawings?.type).toBe("solved-illustration");
    expect(bankDrawings?.type).toBe("solved-illustration");
    expect(goodsDrawings?.type).toBe("solved-illustration");
    expect(personalExpense?.type).toBe("solved-illustration");
    expect(businessWithdrawal?.type).toBe("solved-illustration");

    if (
      cashDrawings?.type !== "solved-illustration" ||
      bankDrawings?.type !== "solved-illustration" ||
      goodsDrawings?.type !== "solved-illustration" ||
      personalExpense?.type !== "solved-illustration" ||
      businessWithdrawal?.type !== "solved-illustration"
    ) {
      throw new Error("Drawings solved illustrations were not found");
    }

    expect(cashDrawings.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Priyanka Drawings A/c",
      "Cash A/c",
    ]);
    expect(bankDrawings.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Kuldeep Drawings A/c",
      "Bank A/c",
    ]);
    expect(goodsDrawings.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Riya Drawings A/c",
      "Purchases A/c",
    ]);
    expect(goodsDrawings.illustration.journalEntry.map((line) => line.amount)).toEqual([4000, 4000]);
    expect(goodsDrawings.illustration.journalEntry.map((line) => line.account)).not.toContain("Sales A/c");
    expect(personalExpense.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Amit Drawings A/c",
      "Bank A/c",
    ]);
    expect(personalExpense.illustration.journalEntry.map((line) => line.account)).not.toContain("Insurance Expense A/c");
    expect(businessWithdrawal.illustration.journalEntry.map((line) => line.account)).toEqual(["Cash A/c", "Bank A/c"]);
    expect(businessWithdrawal.illustration.journalEntry.map((line) => line.account)).not.toContain("Drawings A/c");
  });

  it("defines Purchases as display-only content with cash, bank, credit, asset, and expense guardrails", () => {
    const purchasesSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
    );
    const goodsAssetComparison = purchasesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "goods-versus-assets-in-purchases",
    );
    const expenseComparison = purchasesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "purchases-versus-expenses",
    );
    const creditPurchaseFormat = purchasesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "credit-purchase-format",
    );
    const discountBoundary = purchasesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "purchase-discounts-and-returns-boundary",
    );
    const sourceDocuments = purchasesSubtopic?.sections.find(
      (section) => section.type === "recap" && section.id === "purchase-source-documents",
    );
    const solvedIllustrations = purchasesSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(purchasesSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(purchasesSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(goodsAssetComparison?.type).toBe("comparison");
    expect(expenseComparison?.type).toBe("comparison");
    expect(creditPurchaseFormat?.type).toBe("accounting-format");
    expect(discountBoundary?.type).toBe("concept-explanation");
    expect(sourceDocuments?.type).toBe("recap");
    expect(solvedIllustrations).toHaveLength(6);

    if (
      goodsAssetComparison?.type !== "comparison" ||
      expenseComparison?.type !== "comparison" ||
      creditPurchaseFormat?.type !== "accounting-format" ||
      discountBoundary?.type !== "concept-explanation" ||
      sourceDocuments?.type !== "recap"
    ) {
      throw new Error("Purchases display sections were not found");
    }

    expect(goodsAssetComparison.groups[0].items.join(" ")).toContain("Furniture dealer buys furniture for resale");
    expect(goodsAssetComparison.groups[0].items.join(" ")).toContain("Mobile-phone dealer buys phones for resale");
    expect(goodsAssetComparison.groups[1].items.join(" ")).toContain("Coaching centre buys furniture for office use");
    expect(goodsAssetComparison.groups[1].items.join(" ")).toContain("Office Equipment A/c");
    expect(expenseComparison.groups.map((group) => group.title)).toEqual(["Purchase of goods", "Business expense"]);
    expect(creditPurchaseFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Purchases A/c Dr.",
      "To Mohan A/c",
      "(Being goods purchased on credit from Mohan.)",
    ]);
    expect(creditPurchaseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Cash A/c");
    expect(creditPurchaseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Bank A/c");
    expect(discountBoundary.paragraphs.join(" ")).toContain("₹18,000");
    expect(discountBoundary.paragraphs.join(" ")).toContain("Later / design-needed");
    expect(sourceDocuments.points).toEqual(
      expect.arrayContaining(["Cash memo.", "Purchase invoice.", "Supplier bill.", "Bank payment record."]),
    );

    const cashPurchase = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "purchases-cash-goods",
    );
    const bankPurchase = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "purchases-bank-goods",
    );
    const creditPurchase = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "purchases-credit-from-mohan",
    );
    const assetGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "purchases-machinery-asset-guard",
    );
    const expenseGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "purchases-rent-expense-guard",
    );

    expect(cashPurchase?.type).toBe("solved-illustration");
    expect(bankPurchase?.type).toBe("solved-illustration");
    expect(creditPurchase?.type).toBe("solved-illustration");
    expect(assetGuard?.type).toBe("solved-illustration");
    expect(expenseGuard?.type).toBe("solved-illustration");

    if (
      cashPurchase?.type !== "solved-illustration" ||
      bankPurchase?.type !== "solved-illustration" ||
      creditPurchase?.type !== "solved-illustration" ||
      assetGuard?.type !== "solved-illustration" ||
      expenseGuard?.type !== "solved-illustration"
    ) {
      throw new Error("Purchases solved illustrations were not found");
    }

    expect(cashPurchase.illustration.journalEntry.map((line) => line.account)).toEqual(["Purchases A/c", "Cash A/c"]);
    expect(bankPurchase.illustration.journalEntry.map((line) => line.account)).toEqual(["Purchases A/c", "Bank A/c"]);
    expect(creditPurchase.illustration.journalEntry.map((line) => line.account)).toEqual(["Purchases A/c", "Mohan A/c"]);
    expect(creditPurchase.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(creditPurchase.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(assetGuard.illustration.journalEntry.map((line) => line.account)).toEqual(["Machinery A/c", "Bank A/c"]);
    expect(assetGuard.illustration.journalEntry.map((line) => line.account)).not.toContain("Purchases A/c");
    expect(expenseGuard.illustration.journalEntry.map((line) => line.account)).toEqual(["Rent A/c", "Bank A/c"]);
    expect(expenseGuard.illustration.journalEntry.map((line) => line.account)).not.toContain("Purchases A/c");
  });

  it("defines Sales as display-only content with cash, bank, credit, debtor, and asset-sale guardrails", () => {
    const salesSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_SALES_SECTION_SLUG,
    );
    const goodsAssetComparison = salesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "goods-sold-versus-assets-sold",
    );
    const otherReceiptsComparison = salesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "sales-versus-other-receipts",
    );
    const creditSaleFormat = salesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "credit-sale-format",
    );
    const collectionFormat = salesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "credit-sale-and-later-receipt-format",
    );
    const discountBoundary = salesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "sales-discounts-and-returns-boundary",
    );
    const sourceDocuments = salesSubtopic?.sections.find(
      (section) => section.type === "recap" && section.id === "sales-source-documents",
    );
    const solvedIllustrations = salesSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(salesSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(salesSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(goodsAssetComparison?.type).toBe("comparison");
    expect(otherReceiptsComparison?.type).toBe("comparison");
    expect(creditSaleFormat?.type).toBe("accounting-format");
    expect(collectionFormat?.type).toBe("accounting-format");
    expect(discountBoundary?.type).toBe("concept-explanation");
    expect(sourceDocuments?.type).toBe("recap");
    expect(solvedIllustrations).toHaveLength(5);

    if (
      goodsAssetComparison?.type !== "comparison" ||
      otherReceiptsComparison?.type !== "comparison" ||
      creditSaleFormat?.type !== "accounting-format" ||
      collectionFormat?.type !== "accounting-format" ||
      discountBoundary?.type !== "concept-explanation" ||
      sourceDocuments?.type !== "recap"
    ) {
      throw new Error("Sales display sections were not found");
    }

    expect(goodsAssetComparison.groups[0].items.join(" ")).toContain("Furniture dealer sells furniture to customers");
    expect(goodsAssetComparison.groups[0].items.join(" ")).toContain("Mobile-phone dealer sells phones to customers");
    expect(goodsAssetComparison.groups[1].items.join(" ")).toContain("Coaching centre sells old office furniture");
    expect(goodsAssetComparison.groups[1].items.join(" ")).toContain("Later / design-needed");
    expect(otherReceiptsComparison.groups.map((group) => group.title)).toEqual([
      "Sales receipt",
      "Capital receipt",
      "Loan receipt",
    ]);
    expect(creditSaleFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Riya A/c Dr.",
      "To Sales A/c",
      "(Being goods sold on credit to Riya.)",
    ]);
    expect(creditSaleFormat.formatRows.map((row) => row.particulars)).not.toContain("Cash A/c Dr.");
    expect(creditSaleFormat.formatRows.map((row) => row.particulars)).not.toContain("Bank A/c Dr.");
    expect(collectionFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Transaction 1: Sold goods on credit to Riya ₹20,000",
      "Riya A/c Dr.",
      "To Sales A/c",
      "Transaction 2: Received ₹20,000 from Riya through bank",
      "Bank A/c Dr.",
      "To Riya A/c",
    ]);
    expect(collectionFormat.formatRows.slice(3).map((row) => row.particulars)).not.toContain("To Sales A/c");
    expect(discountBoundary.paragraphs.join(" ")).toContain("₹18,000");
    expect(discountBoundary.paragraphs.join(" ")).toContain("Later / design-needed");
    expect(discountBoundary.paragraphs.join(" ")).toContain("Sales Returns / Returns Inward");
    expect(sourceDocuments.points).toEqual(
      expect.arrayContaining(["Cash memo.", "Sales invoice.", "Customer invoice.", "Bank credit record."]),
    );

    const cashSale = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "sales-cash-goods",
    );
    const bankSale = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "sales-bank-goods",
    );
    const creditSale = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "sales-credit-to-mohan",
    );
    const collectionSale = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "sales-credit-and-later-collection",
    );
    const assetGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "sales-old-furniture-asset-guard",
    );

    expect(cashSale?.type).toBe("solved-illustration");
    expect(bankSale?.type).toBe("solved-illustration");
    expect(creditSale?.type).toBe("solved-illustration");
    expect(collectionSale?.type).toBe("solved-illustration");
    expect(assetGuard?.type).toBe("solved-illustration");

    if (
      cashSale?.type !== "solved-illustration" ||
      bankSale?.type !== "solved-illustration" ||
      creditSale?.type !== "solved-illustration" ||
      collectionSale?.type !== "solved-illustration" ||
      assetGuard?.type !== "solved-illustration"
    ) {
      throw new Error("Sales solved illustrations were not found");
    }

    expect(cashSale.illustration.journalEntry.map((line) => line.account)).toEqual(["Cash A/c", "Sales A/c"]);
    expect(bankSale.illustration.journalEntry.map((line) => line.account)).toEqual(["Bank A/c", "Sales A/c"]);
    expect(creditSale.illustration.journalEntry.map((line) => line.account)).toEqual(["Mohan A/c", "Sales A/c"]);
    expect(creditSale.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(creditSale.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(creditSale.illustration.journalEntry).toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Sales A/c", side: "credit", amount: 25000 })]),
    );
    expect(collectionSale.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Riya A/c",
      "Sales A/c",
      "Bank A/c",
      "Riya A/c",
    ]);
    expect(collectionSale.illustration.journalEntry.slice(2).map((line) => line.account)).not.toContain("Sales A/c");
    expect(assetGuard.illustration.journalEntry).toHaveLength(0);
    expect(assetGuard.illustration.explanation).toContain("asset disposal");
    expect(assetGuard.illustration.narration).toContain("Later / design-needed");
  });

  it("defines Expenses as display-only content with cash, bank, outstanding, personal, and asset guardrails", () => {
    const expensesSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
    );
    const cashExpenseFormat = expensesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "cash-expense-format",
    );
    const bankExpenseFormat = expensesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "bank-expense-format",
    );
    const outstandingExpenseFormat = expensesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "outstanding-expense-format",
    );
    const laterPaymentFormat = expensesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "outstanding-expense-later-payment-format",
    );
    const specificNamesComparison = expensesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "specific-expense-account-names",
    );
    const personalExpenseComparison = expensesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "business-expense-versus-personal-expense",
    );
    const assetExpenseComparison = expensesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "expense-versus-asset-purchase",
    );
    const purchasesExpenseComparison = expensesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "expense-versus-purchase-of-goods",
    );
    const directIndirectNote = expensesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "direct-and-indirect-expense-note",
    );
    const prepaidNote = expensesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "prepaid-expense-note",
    );
    const terminologyNote = expensesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "accrued-and-outstanding-terminology",
    );
    const sourceDocuments = expensesSubtopic?.sections.find(
      (section) => section.type === "recap" && section.id === "expense-source-documents",
    );
    const solvedIllustrations =
      expensesSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(expensesSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(expensesSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(cashExpenseFormat?.type).toBe("accounting-format");
    expect(bankExpenseFormat?.type).toBe("accounting-format");
    expect(outstandingExpenseFormat?.type).toBe("accounting-format");
    expect(laterPaymentFormat?.type).toBe("accounting-format");
    expect(specificNamesComparison?.type).toBe("comparison");
    expect(personalExpenseComparison?.type).toBe("comparison");
    expect(assetExpenseComparison?.type).toBe("comparison");
    expect(purchasesExpenseComparison?.type).toBe("comparison");
    expect(directIndirectNote?.type).toBe("comparison");
    expect(prepaidNote?.type).toBe("concept-explanation");
    expect(terminologyNote?.type).toBe("concept-explanation");
    expect(sourceDocuments?.type).toBe("recap");
    expect(solvedIllustrations).toHaveLength(6);

    if (
      cashExpenseFormat?.type !== "accounting-format" ||
      bankExpenseFormat?.type !== "accounting-format" ||
      outstandingExpenseFormat?.type !== "accounting-format" ||
      laterPaymentFormat?.type !== "accounting-format" ||
      specificNamesComparison?.type !== "comparison" ||
      personalExpenseComparison?.type !== "comparison" ||
      assetExpenseComparison?.type !== "comparison" ||
      purchasesExpenseComparison?.type !== "comparison" ||
      directIndirectNote?.type !== "comparison" ||
      prepaidNote?.type !== "concept-explanation" ||
      terminologyNote?.type !== "concept-explanation" ||
      sourceDocuments?.type !== "recap"
    ) {
      throw new Error("Expenses display sections were not found");
    }

    expect(specificNamesComparison.groups[0].items.join(" ")).toContain("Salary paid → Salary A/c");
    expect(specificNamesComparison.groups[1].items.join(" ")).toContain("Do not write Expense A/c");
    expect(cashExpenseFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Rent A/c Dr.",
      "To Cash A/c",
      "(Being office rent paid in cash.)",
    ]);
    expect(cashExpenseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Bank A/c");
    expect(bankExpenseFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Salary A/c Dr.",
      "To Bank A/c",
      "(Being salary paid by bank.)",
    ]);
    expect(bankExpenseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Cash A/c");
    expect(outstandingExpenseFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Salary A/c Dr.",
      "To Outstanding Salary A/c",
      "(Being salary due but not yet paid.)",
    ]);
    expect(outstandingExpenseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Cash A/c");
    expect(outstandingExpenseFormat.formatRows.map((row) => row.particulars)).not.toContain("To Bank A/c");
    expect(laterPaymentFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Transaction 1: Salary ₹4,000 became due but was not paid",
      "Salary A/c Dr.",
      "To Outstanding Salary A/c",
      "Transaction 2: Outstanding salary later paid by bank",
      "Outstanding Salary A/c Dr.",
      "To Bank A/c",
    ]);
    expect(laterPaymentFormat.formatRows.slice(3).map((row) => row.particulars)).not.toContain("Salary A/c Dr.");
    expect(personalExpenseComparison.groups[1].items.join(" ")).toContain("Amit Drawings A/c Dr.");
    expect(personalExpenseComparison.groups[1].items.join(" ")).toContain("rather than a business expense");
    expect(assetExpenseComparison.groups[1].items.join(" ")).toContain("Machinery A/c Dr.");
    expect(assetExpenseComparison.groups[1].items.join(" ")).toContain("Later / design-needed");
    expect(purchasesExpenseComparison.groups.map((group) => group.title)).toEqual([
      "Goods bought for resale",
      "Cost incurred to operate the business",
    ]);
    expect(directIndirectNote.eyebrow).toBe("Later / linked to Final Accounts");
    expect(directIndirectNote.groups[0].items.join(" ")).toContain("Carriage inward");
    expect(prepaidNote.paragraphs.join(" ")).toContain("Prepaid Insurance A/c Dr.; To Insurance A/c");
    expect(prepaidNote.paragraphs.join(" ")).toContain("Later / design-needed");
    expect(terminologyNote.paragraphs.join(" ")).toContain("Outstanding expense");
    expect(terminologyNote.paragraphs.join(" ")).toContain("Accrued expense");
    expect(sourceDocuments.points).toEqual(
      expect.arrayContaining(["Salary sheet.", "Rent receipt.", "Electricity bill.", "Payment voucher."]),
    );

    const cashRent = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-cash-rent",
    );
    const bankSalary = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-bank-salary",
    );
    const outstandingElectricity = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-outstanding-electricity",
    );
    const outstandingSalaryPaidLater = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-outstanding-salary-paid-later",
    );
    const personalInsuranceGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-personal-insurance-guard",
    );
    const furnitureAssetGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "expenses-furniture-asset-guard",
    );

    expect(cashRent?.type).toBe("solved-illustration");
    expect(bankSalary?.type).toBe("solved-illustration");
    expect(outstandingElectricity?.type).toBe("solved-illustration");
    expect(outstandingSalaryPaidLater?.type).toBe("solved-illustration");
    expect(personalInsuranceGuard?.type).toBe("solved-illustration");
    expect(furnitureAssetGuard?.type).toBe("solved-illustration");

    if (
      cashRent?.type !== "solved-illustration" ||
      bankSalary?.type !== "solved-illustration" ||
      outstandingElectricity?.type !== "solved-illustration" ||
      outstandingSalaryPaidLater?.type !== "solved-illustration" ||
      personalInsuranceGuard?.type !== "solved-illustration" ||
      furnitureAssetGuard?.type !== "solved-illustration"
    ) {
      throw new Error("Expenses solved illustrations were not found");
    }

    expect(cashRent.illustration.journalEntry.map((line) => line.account)).toEqual(["Rent A/c", "Cash A/c"]);
    expect(bankSalary.illustration.journalEntry.map((line) => line.account)).toEqual(["Salary A/c", "Bank A/c"]);
    expect(outstandingElectricity.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Electricity Expense A/c",
      "Outstanding Electricity Expense A/c",
    ]);
    expect(outstandingElectricity.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(outstandingElectricity.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(outstandingSalaryPaidLater.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Salary A/c",
      "Outstanding Salary A/c",
      "Outstanding Salary A/c",
      "Bank A/c",
    ]);
    expect(outstandingSalaryPaidLater.illustration.journalEntry.slice(2).map((line) => line.account)).not.toContain(
      "Salary A/c",
    );
    expect(personalInsuranceGuard.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Priyanka Drawings A/c",
      "Bank A/c",
    ]);
    expect(personalInsuranceGuard.illustration.journalEntry.map((line) => line.account)).not.toContain(
      "Insurance Expense A/c",
    );
    expect(furnitureAssetGuard.illustration.journalEntry.map((line) => line.account)).toEqual(["Furniture A/c", "Bank A/c"]);
    expect(furnitureAssetGuard.illustration.journalEntry.map((line) => line.account)).not.toContain(
      "Furniture Expense A/c",
    );
    expect(furnitureAssetGuard.illustration.journalEntry.map((line) => line.account)).not.toContain("Purchases A/c");
  });

  it("defines Income as display-only content with cash, bank, accrued, advance, and receipt guardrails", () => {
    const incomeSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
    );
    const meaningSection = incomeSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "meaning-of-income",
    );
    const classificationSection = incomeSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "income-classification",
    );
    const specificNamesComparison = incomeSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "specific-income-account-names",
    );
    const cashIncomeFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "cash-income-format",
    );
    const bankIncomeFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "bank-income-format",
    );
    const accruedIncomeFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "accrued-income-format",
    );
    const laterReceiptFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "accrued-income-later-receipt-format",
    );
    const advanceIncomeFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "income-received-in-advance-format",
    );
    const debtorCollectionFormat = incomeSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "debtor-collection-not-income-format",
    );
    const incomeReceiptComparison = incomeSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "income-versus-ordinary-receipts",
    );
    const salesIncomeComparison = incomeSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "sales-versus-other-income",
    );
    const refundNote = incomeSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "income-refund-reversal-note",
    );
    const directIndirectNote = incomeSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "direct-indirect-income-note",
    );
    const sourceDocuments = incomeSubtopic?.sections.find(
      (section) => section.type === "recap" && section.id === "income-source-documents",
    );
    const solvedIllustrations =
      incomeSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(incomeSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(incomeSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(meaningSection?.type).toBe("concept-explanation");
    expect(classificationSection?.type).toBe("comparison");
    expect(specificNamesComparison?.type).toBe("comparison");
    expect(cashIncomeFormat?.type).toBe("accounting-format");
    expect(bankIncomeFormat?.type).toBe("accounting-format");
    expect(accruedIncomeFormat?.type).toBe("accounting-format");
    expect(laterReceiptFormat?.type).toBe("accounting-format");
    expect(advanceIncomeFormat?.type).toBe("accounting-format");
    expect(debtorCollectionFormat?.type).toBe("accounting-format");
    expect(incomeReceiptComparison?.type).toBe("comparison");
    expect(salesIncomeComparison?.type).toBe("comparison");
    expect(refundNote?.type).toBe("concept-explanation");
    expect(directIndirectNote?.type).toBe("concept-explanation");
    expect(sourceDocuments?.type).toBe("recap");
    expect(solvedIllustrations).toHaveLength(7);

    if (
      meaningSection?.type !== "concept-explanation" ||
      classificationSection?.type !== "comparison" ||
      specificNamesComparison?.type !== "comparison" ||
      cashIncomeFormat?.type !== "accounting-format" ||
      bankIncomeFormat?.type !== "accounting-format" ||
      accruedIncomeFormat?.type !== "accounting-format" ||
      laterReceiptFormat?.type !== "accounting-format" ||
      advanceIncomeFormat?.type !== "accounting-format" ||
      debtorCollectionFormat?.type !== "accounting-format" ||
      incomeReceiptComparison?.type !== "comparison" ||
      salesIncomeComparison?.type !== "comparison" ||
      refundNote?.type !== "concept-explanation" ||
      directIndirectNote?.type !== "concept-explanation" ||
      sourceDocuments?.type !== "recap"
    ) {
      throw new Error("Income display sections were not found");
    }

    expect(meaningSection.paragraphs.join(" ")).toContain("value earned by the business");
    expect(meaningSection.paragraphs.join(" ")).toContain("Capital introduced, loans received, and debtor collections");
    expect(classificationSection.groups[0].items).toContain("Increase in income → Credit.");
    expect(classificationSection.groups[1].items.join(" ")).toContain("credit all incomes and gains");
    expect(specificNamesComparison.groups[0].items.join(" ")).toContain("Commission earned → Commission Received A/c.");
    expect(specificNamesComparison.groups[1].items.join(" ")).toContain("Do not write Income A/c");

    expect(cashIncomeFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Cash A/c Dr.",
      "To Commission Received A/c",
      "(Being commission received in cash.)",
    ]);
    expect(cashIncomeFormat.formatRows.map((row) => row.particulars)).not.toContain("Bank A/c Dr.");
    expect(bankIncomeFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Bank A/c Dr.",
      "To Interest Received A/c",
      "(Being interest received through bank.)",
    ]);
    expect(bankIncomeFormat.formatRows.map((row) => row.particulars)).not.toContain("Cash A/c Dr.");
    expect(accruedIncomeFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Accrued Commission A/c Dr.",
      "To Commission Received A/c",
      "(Being commission earned but not yet received.)",
    ]);
    expect(accruedIncomeFormat.paragraphs.join(" ")).toContain("Cash and Bank are not affected yet");
    expect(laterReceiptFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Transaction 1: Commission ₹3,000 was earned but not yet received",
      "Accrued Commission A/c Dr.",
      "To Commission Received A/c",
      "Transaction 2: Accrued commission later received through bank",
      "Bank A/c Dr.",
      "To Accrued Commission A/c",
    ]);
    expect(laterReceiptFormat.formatRows.slice(3).map((row) => row.particulars)).not.toContain(
      "To Commission Received A/c",
    );
    expect(advanceIncomeFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Bank A/c Dr.",
      "To Rent Received in Advance A/c",
      "(Being rent received in advance through bank.)",
    ]);
    expect(advanceIncomeFormat.paragraphs.join(" ")).toContain("not current income yet");
    expect(advanceIncomeFormat.paragraphs.join(" ")).toContain("Do not credit Rent Received A/c immediately");
    expect(debtorCollectionFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Bank A/c Dr.",
      "To Riya A/c",
      "(Being amount received from Riya through bank.)",
    ]);
    expect(debtorCollectionFormat.paragraphs.join(" ")).toContain("does not credit Sales A/c");
    expect(incomeReceiptComparison.groups.map((group) => group.title)).toEqual([
      "Income receipt",
      "Capital receipt",
      "Loan receipt",
      "Collection from debtor",
    ]);
    expect(incomeReceiptComparison.groups[1].items.join(" ")).toContain("To Amit's Capital A/c");
    expect(incomeReceiptComparison.groups[2].items.join(" ")).toContain("To Bank Loan A/c");
    expect(salesIncomeComparison.groups[2].items.join(" ")).toContain("Correct: Bank A/c Dr.; To Commission Received A/c.");
    expect(salesIncomeComparison.groups[2].items.join(" ")).toContain("Incorrect: Bank A/c Dr.; To Sales A/c.");
    expect(refundNote.eyebrow).toBe("Later / design-needed");
    expect(refundNote.paragraphs.join(" ")).toContain("No checker, broad solver support, or adjustment engine");
    expect(directIndirectNote.eyebrow).toBe("Later / linked to Final Accounts");
    expect(directIndirectNote.paragraphs.join(" ")).toContain("Final Accounts chapter");
    expect(sourceDocuments.points).toEqual(
      expect.arrayContaining(["Cash receipt.", "Bank statement.", "Commission statement.", "Income voucher."]),
    );

    const accruedIllustration = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "income-accrued-commission",
    );
    const accruedReceiptIllustration = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "income-accrued-interest-later-received",
    );
    const advanceIllustration = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "income-rent-received-in-advance",
    );
    const debtorGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "income-debtor-collection-guard",
    );
    const capitalGuard = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "income-capital-receipt-guard",
    );

    expect(accruedIllustration?.type).toBe("solved-illustration");
    expect(accruedReceiptIllustration?.type).toBe("solved-illustration");
    expect(advanceIllustration?.type).toBe("solved-illustration");
    expect(debtorGuard?.type).toBe("solved-illustration");
    expect(capitalGuard?.type).toBe("solved-illustration");

    if (
      accruedIllustration?.type !== "solved-illustration" ||
      accruedReceiptIllustration?.type !== "solved-illustration" ||
      advanceIllustration?.type !== "solved-illustration" ||
      debtorGuard?.type !== "solved-illustration" ||
      capitalGuard?.type !== "solved-illustration"
    ) {
      throw new Error("Income solved illustrations were not found");
    }

    expect(accruedIllustration.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Accrued Commission A/c",
      "Commission Received A/c",
    ]);
    expect(accruedIllustration.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(accruedIllustration.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(accruedReceiptIllustration.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Accrued Interest A/c",
      "Interest Received A/c",
      "Bank A/c",
      "Accrued Interest A/c",
    ]);
    expect(accruedReceiptIllustration.illustration.journalEntry.slice(2).map((line) => line.account)).not.toContain(
      "Interest Received A/c",
    );
    expect(advanceIllustration.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Rent Received in Advance A/c",
    ]);
    expect(advanceIllustration.illustration.journalEntry.map((line) => line.account)).not.toContain("Rent Received A/c");
    expect(debtorGuard.illustration.journalEntry.map((line) => line.account)).toEqual(["Bank A/c", "Mohan A/c"]);
    expect(debtorGuard.illustration.journalEntry.map((line) => line.account)).not.toContain("Sales A/c");
    expect(capitalGuard.illustration.journalEntry.map((line) => line.account)).toEqual([
      "Bank A/c",
      "Amit's Capital A/c",
    ]);
    expect(capitalGuard.illustration.journalEntry.map((line) => line.account)).not.toContain("Income A/c");
  });

  it("defines Assets and Liabilities as display-only content with creation, settlement, and deferred boundaries", () => {
    const assetsLiabilitiesSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
    );
    const assetsMeaning = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "meaning-of-assets",
    );
    const liabilitiesMeaning = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "meaning-of-liabilities",
    );
    const centralRule = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "asset-liability-central-rule",
    );
    const equationImpact = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "accounting-equation-impact",
    );
    const currentNonCurrent = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "current-and-non-current-introduction",
    );
    const assetCashFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "asset-purchased-for-cash-format",
    );
    const assetBankFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "asset-purchased-through-bank-format",
    );
    const assetCreditFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "asset-purchased-on-credit-format",
    );
    const loanReceivedFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "loan-received-format",
    );
    const loanRepaymentFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "loan-repayment-format",
    );
    const creditorSettlementFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "creditor-creation-and-settlement-format",
    );
    const outstandingLiabilityFormat = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "accounting-format" && section.id === "outstanding-liability-format",
    );
    const assetPurchasesComparison = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "asset-versus-purchases",
    );
    const assetExpenseComparison = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "asset-versus-expense",
    );
    const liabilityComparison = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "liability-versus-income-capital",
    );
    const namedPersonContext = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "named-person-context",
    );
    const depreciationNote = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "depreciation-linked-note",
    );
    const disposalNote = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "asset-disposal-note",
    );
    const installationNote = assetsLiabilitiesSubtopic?.sections.find(
      (section) => section.type === "concept-explanation" && section.id === "installation-incidental-costs-note",
    );
    const solvedIllustrations =
      assetsLiabilitiesSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];

    expect(assetsLiabilitiesSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(assetsLiabilitiesSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(assetsMeaning?.type).toBe("concept-explanation");
    expect(liabilitiesMeaning?.type).toBe("concept-explanation");
    expect(centralRule?.type).toBe("concept-explanation");
    expect(equationImpact?.type).toBe("comparison");
    expect(currentNonCurrent?.type).toBe("comparison");
    expect(assetCashFormat?.type).toBe("accounting-format");
    expect(assetBankFormat?.type).toBe("accounting-format");
    expect(assetCreditFormat?.type).toBe("accounting-format");
    expect(loanReceivedFormat?.type).toBe("accounting-format");
    expect(loanRepaymentFormat?.type).toBe("accounting-format");
    expect(creditorSettlementFormat?.type).toBe("accounting-format");
    expect(outstandingLiabilityFormat?.type).toBe("accounting-format");
    expect(assetPurchasesComparison?.type).toBe("comparison");
    expect(assetExpenseComparison?.type).toBe("comparison");
    expect(liabilityComparison?.type).toBe("comparison");
    expect(namedPersonContext?.type).toBe("comparison");
    expect(depreciationNote?.type).toBe("concept-explanation");
    expect(disposalNote?.type).toBe("concept-explanation");
    expect(installationNote?.type).toBe("concept-explanation");
    expect(solvedIllustrations).toHaveLength(7);

    if (
      assetsMeaning?.type !== "concept-explanation" ||
      liabilitiesMeaning?.type !== "concept-explanation" ||
      centralRule?.type !== "concept-explanation" ||
      equationImpact?.type !== "comparison" ||
      currentNonCurrent?.type !== "comparison" ||
      assetCashFormat?.type !== "accounting-format" ||
      assetBankFormat?.type !== "accounting-format" ||
      assetCreditFormat?.type !== "accounting-format" ||
      loanReceivedFormat?.type !== "accounting-format" ||
      loanRepaymentFormat?.type !== "accounting-format" ||
      creditorSettlementFormat?.type !== "accounting-format" ||
      outstandingLiabilityFormat?.type !== "accounting-format" ||
      assetPurchasesComparison?.type !== "comparison" ||
      assetExpenseComparison?.type !== "comparison" ||
      liabilityComparison?.type !== "comparison" ||
      namedPersonContext?.type !== "comparison" ||
      depreciationNote?.type !== "concept-explanation" ||
      disposalNote?.type !== "concept-explanation" ||
      installationNote?.type !== "concept-explanation"
    ) {
      throw new Error("Assets and Liabilities display sections were not found");
    }

    expect(assetsMeaning.paragraphs.join(" ")).toContain("resources owned or controlled by the business");
    expect(assetsMeaning.paragraphs.join(" ")).toContain("Accrued Income");
    expect(liabilitiesMeaning.paragraphs.join(" ")).toContain("amounts or obligations payable to outsiders");
    expect(liabilitiesMeaning.paragraphs.join(" ")).toContain("Capital is not an outside liability");
    expect(centralRule.paragraphs).toEqual(
      expect.arrayContaining([
        "Asset increases → Debit.",
        "Asset decreases → Credit.",
        "Liability increases → Credit.",
        "Liability decreases → Debit.",
      ]),
    );
    expect(currentNonCurrent.groups.map((group) => group.title)).toEqual([
      "Current assets",
      "Non-current assets",
      "Current liabilities",
      "Non-current liabilities",
    ]);
    expect(equationImpact.title).toBe("Assets = Capital + Liabilities");
    expect(equationImpact.groups[0].items.join(" ")).toContain("Bank asset increases");
    expect(equationImpact.groups[1].items.join(" ")).toContain("Loan liability decreases");

    expect(assetCashFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Furniture A/c Dr.",
      "To Cash A/c",
      "(Being furniture purchased for cash.)",
    ]);
    expect(assetCashFormat.paragraphs.join(" ")).toContain("Purchases A/c is not used");
    expect(assetBankFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Machinery A/c Dr.",
      "To Bank A/c",
      "(Being machinery purchased through bank.)",
    ]);
    expect(assetBankFormat.paragraphs.join(" ")).toContain("Cash A/c is not affected");
    expect(assetCreditFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Furniture A/c Dr.",
      "To Mohan A/c",
      "(Being office furniture purchased on credit from Mohan.)",
    ]);
    expect(assetCreditFormat.paragraphs.join(" ")).toContain("Cash A/c or Bank A/c is not affected yet");
    expect(loanReceivedFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Bank A/c Dr.",
      "To Bank Loan A/c",
      "(Being bank loan received in the business bank account.)",
    ]);
    expect(loanReceivedFormat.paragraphs.join(" ")).toContain("not income or capital");
    expect(loanRepaymentFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Bank Loan A/c Dr.",
      "To Bank A/c",
      "(Being part of the bank loan repaid through bank.)",
    ]);
    expect(loanRepaymentFormat.paragraphs.join(" ")).toContain("not an expense");
    expect(creditorSettlementFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Transaction 1: Purchased goods on credit from Mohan ₹20,000",
      "Purchases A/c Dr.",
      "To Mohan A/c",
      "Transaction 2: Paid Mohan through bank ₹20,000",
      "Mohan A/c Dr.",
      "To Bank A/c",
    ]);
    expect(creditorSettlementFormat.formatRows.slice(3).map((row) => row.particulars)).not.toContain("Purchases A/c Dr.");
    expect(outstandingLiabilityFormat.formatRows.map((row) => row.particulars)).toEqual([
      "Transaction 1: Salary ₹5,000 became due but was not paid",
      "Salary A/c Dr.",
      "To Outstanding Salary A/c",
      "Transaction 2: Outstanding salary later paid through bank",
      "Outstanding Salary A/c Dr.",
      "To Bank A/c",
    ]);
    expect(outstandingLiabilityFormat.formatRows.slice(3).map((row) => row.particulars)).not.toContain("Salary A/c Dr.");
    expect(assetPurchasesComparison.groups[0].items.join(" ")).toContain("Purchases A/c Dr.");
    expect(assetPurchasesComparison.groups[1].items.join(" ")).toContain("Furniture/Machinery A/c Dr.");
    expect(assetExpenseComparison.groups[1].items.join(" ")).toContain("Later / design-needed");
    expect(liabilityComparison.groups.map((group) => group.title)).toEqual(["Loan", "Capital", "Income"]);
    expect(liabilityComparison.groups[0].items.join(" ")).toContain("not income");
    expect(liabilityComparison.groups[1].items.join(" ")).toContain("not operating income");
    expect(namedPersonContext.groups.map((group) => group.title)).toEqual(["Customer", "Supplier", "Owner or partner"]);
    expect(depreciationNote.eyebrow).toBe("Later / linked chapter");
    expect(depreciationNote.paragraphs.join(" ")).toContain("Depreciation chapter");
    expect(disposalNote.eyebrow).toBe("Later / design-needed");
    expect(disposalNote.paragraphs.join(" ")).toContain("not automatically Sales A/c");
    expect(installationNote.eyebrow).toBe("Later / design-needed");
    expect(installationNote.paragraphs.join(" ")).toContain("does not add checking support");

    const creditAsset = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "assets-furniture-credit-mohan",
    );
    const loanReceived = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "liabilities-bank-loan-received",
    );
    const loanRepaid = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "liabilities-bank-loan-repaid",
    );
    const creditorSettlement = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "liabilities-credit-purchase-settlement",
    );
    const outstandingSettlement = solvedIllustrations.find(
      (section) => section.type === "solved-illustration" && section.id === "liabilities-outstanding-salary-settlement",
    );

    expect(creditAsset?.type).toBe("solved-illustration");
    expect(loanReceived?.type).toBe("solved-illustration");
    expect(loanRepaid?.type).toBe("solved-illustration");
    expect(creditorSettlement?.type).toBe("solved-illustration");
    expect(outstandingSettlement?.type).toBe("solved-illustration");

    if (
      creditAsset?.type !== "solved-illustration" ||
      loanReceived?.type !== "solved-illustration" ||
      loanRepaid?.type !== "solved-illustration" ||
      creditorSettlement?.type !== "solved-illustration" ||
      outstandingSettlement?.type !== "solved-illustration"
    ) {
      throw new Error("Assets and Liabilities solved illustrations were not found");
    }

    expect(creditAsset.illustration.journalEntry.map((line) => line.account)).toEqual(["Furniture A/c", "Mohan A/c"]);
    expect(creditAsset.illustration.journalEntry.map((line) => line.account)).not.toContain("Cash A/c");
    expect(creditAsset.illustration.journalEntry.map((line) => line.account)).not.toContain("Bank A/c");
    expect(loanReceived.illustration.journalEntry.map((line) => line.account)).toEqual(["Bank A/c", "Bank Loan A/c"]);
    expect(loanReceived.illustration.journalEntry.map((line) => line.account)).not.toContain("Income A/c");
    expect(loanRepaid.illustration.journalEntry.map((line) => line.account)).toEqual(["Bank Loan A/c", "Bank A/c"]);
    expect(loanRepaid.illustration.commonMistake).toContain("Loan Repayment Expense");
    expect(creditorSettlement.illustration.journalEntry.slice(2).map((line) => line.account)).not.toContain("Purchases A/c");
    expect(outstandingSettlement.illustration.journalEntry.slice(2).map((line) => line.account)).not.toContain("Salary A/c");
  });

  it("defines Mixed Simple Entries as display-only consolidation with reveal-only prompts", () => {
    const mixedSubtopic = journalEntriesChapter.subtopics.find(
      (subtopic) => subtopic.slug === JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
    );
    const clueGuide = mixedSubtopic?.sections.find(
      (section) => section.type === "clue-guide" && section.id === "mixed-transaction-clue-recap",
    );
    const wordingChanges = mixedSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "what-changes-the-entry",
    );
    const doNotConfuse = mixedSubtopic?.sections.find(
      (section) => section.type === "comparison" && section.id === "mixed-do-not-confuse",
    );
    const solvedIllustrations = mixedSubtopic?.sections.filter((section) => section.type === "solved-illustration") ?? [];
    const tryBeforeReveal = mixedSubtopic?.sections.find(
      (section) => section.type === "try-before-reveal" && section.id === "mixed-try-before-reveal",
    );

    expect(mixedSubtopic?.practiceQuestionIds).toBeUndefined();
    expect(mixedSubtopic?.sections.filter((section) => section.type === "practice-it-yourself")).toHaveLength(0);
    expect(clueGuide?.type).toBe("clue-guide");
    expect(wordingChanges?.type).toBe("comparison");
    expect(doNotConfuse?.type).toBe("comparison");
    expect(solvedIllustrations).toHaveLength(12);
    expect(tryBeforeReveal?.type).toBe("try-before-reveal");

    if (
      clueGuide?.type !== "clue-guide" ||
      wordingChanges?.type !== "comparison" ||
      doNotConfuse?.type !== "comparison" ||
      tryBeforeReveal?.type !== "try-before-reveal"
    ) {
      throw new Error("Mixed Simple Entries display sections were not found");
    }

    expect(clueGuide.clues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ clue: "for cash", likelyAccounts: ["Cash A/c"] }),
        expect.objectContaining({ clue: "through bank / by cheque / UPI / NEFT", likelyAccounts: ["Bank A/c"] }),
        expect.objectContaining({ clue: "on credit to a customer", likelyAccounts: ["Named debtor A/c"] }),
        expect.objectContaining({ clue: "received in advance", likelyAccounts: ["Liability"] }),
      ]),
    );
    expect(wordingChanges.groups.map((group) => group.title)).toEqual([
      "Cash vs bank vs credit purchase",
      "Cash vs bank vs credit sale",
      "Business vs personal withdrawal",
      "Goods vs asset",
      "Capital vs loan vs income",
    ]);
    expect(doNotConfuse.groups.map((group) => group.title)).toEqual([
      "Purchases A/c vs Furniture A/c",
      "Sales A/c vs asset disposal",
      "Expense A/c vs Drawings A/c",
      "Capital A/c vs Loan A/c",
      "Income A/c vs debtor collection",
      "Cash A/c vs Bank A/c",
      "Debtor A/c vs Cash/Bank receipt",
      "Creditor A/c vs Purchases A/c during later payment",
      "Outstanding Expense A/c vs Expense A/c during settlement",
      "Accrued Income A/c vs Income A/c during later receipt",
    ]);

    const entriesById = Object.fromEntries(
      solvedIllustrations.map((section) => {
        if (section.type !== "solved-illustration") {
          throw new Error("Expected solved illustration");
        }

        return [section.id, section.illustration.journalEntry.map((line) => line.account)];
      }),
    );

    expect(entriesById["mixed-cash-purchase"]).toEqual(["Purchases A/c", "Cash A/c"]);
    expect(entriesById["mixed-bank-expense"]).toEqual(["Rent A/c", "Bank A/c"]);
    expect(entriesById["mixed-credit-sale"]).toEqual(["Priyanka A/c", "Sales A/c"]);
    expect(entriesById["mixed-capital-through-bank"]).toEqual(["Bank A/c", "Kuldeep's Capital A/c"]);
    expect(entriesById["mixed-personal-bank-withdrawal"]).toEqual(["Riya Drawings A/c", "Bank A/c"]);
    expect(entriesById["mixed-asset-on-credit"]).toEqual(["Furniture A/c", "Mohan A/c"]);
    expect(entriesById["mixed-loan-received"]).toEqual(["Bank A/c", "Bank Loan A/c"]);
    expect(entriesById["mixed-outstanding-expense-paid"]).toEqual(["Outstanding Salary A/c", "Bank A/c"]);
    expect(entriesById["mixed-debtor-collection"]).toEqual(["Bank A/c", "Riya A/c"]);
    expect(entriesById["mixed-accrued-income"]).toEqual(["Accrued Commission A/c", "Commission Received A/c"]);
    expect(entriesById["mixed-income-received-in-advance"]).toEqual(["Bank A/c", "Rent Received in Advance A/c"]);
    expect(entriesById["mixed-business-cash-withdrawal"]).toEqual(["Cash A/c", "Bank A/c"]);
    expect(entriesById["mixed-outstanding-expense-paid"]).not.toContain("Salary A/c");
    expect(entriesById["mixed-debtor-collection"]).not.toContain("Sales A/c");

    expect(tryBeforeReveal.prompts).toHaveLength(6);
    expect(tryBeforeReveal.prompts.map((prompt) => prompt.prompt)).toEqual([
      "Paid electricity bill in cash ₹2,500.",
      "Sold goods through bank ₹9,000.",
      "Purchased goods on credit from ABC Traders ₹14,000.",
      "Amit introduced additional capital through bank ₹20,000.",
      "Received commission in cash ₹4,000.",
      "Repaid bank loan through bank ₹15,000.",
    ]);
    expect(tryBeforeReveal.prompts[0].journalEntry.map((line) => line.account)).toEqual([
      "Electricity Expense A/c",
      "Cash A/c",
    ]);
    expect(tryBeforeReveal.prompts[5].journalEntry.map((line) => line.account)).toEqual([
      "Bank Loan A/c",
      "Bank A/c",
    ]);
  });

  it("marks the platform preview routes as noindex and nofollow", () => {
    expect(platformPreviewMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it("marks the active outline state across all fifteen routed Journal Entries sections", () => {
    const routedSections = [
      ["/platform-preview/chapters/journal-entries", JournalEntriesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/business-transactions", BusinessTransactionsChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/accounts-affected", AccountsAffectedChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/types-of-accounts", TypesOfAccountsChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/debit-and-credit-rules", DebitAndCreditRulesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/journal-format-and-narration", JournalFormatAndNarrationChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/cash-and-bank-transactions", CashAndBankTransactionsChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/capital", CapitalChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/drawings", DrawingsChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/purchases", PurchasesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/sales", SalesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/expenses", ExpensesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/income", IncomeChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/assets-and-liabilities", AssetsAndLiabilitiesChapterPreviewPage],
      ["/platform-preview/chapters/journal-entries/mixed-simple-entries", MixedSimpleEntriesChapterPreviewPage],
    ] as const;

    routedSections.forEach(([href, RoutePage]) => {
      const html = renderToStaticMarkup(createElement(RoutePage));

      expect(getLinkMarkup(html, href)).toContain('aria-current="step"');
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
    expect(html).toContain("Continue to Journal Format and Narration");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/debit-and-credit-rules")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/types-of-accounts"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/journal-format-and-narration"');
    expect(html).not.toContain("Continue to Journal Format and Narration - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Journal Format and Narration section with the Cash and Bank next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(JournalFormatAndNarrationChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Journal Format and Narration");
    expect(html).toContain("Section 6 of 16");
    expect(html).toContain("Why journal format matters");
    expect(html).toContain("Standard journal columns");
    expect(html).toContain("Date");
    expect(html).toContain("Particulars");
    expect(html).toContain("L.F.");
    expect(html).toContain("Debit ₹");
    expect(html).toContain("Credit ₹");
    expect(html).toContain("What each journal column means");
    expect(html).toContain("L.F. means Ledger Folio.");
    expect(html).toContain("It is not an amount column.");
    expect(html).toContain("How to write the debit line");
    expect(html).toContain("Add Dr. after the debit account name.");
    expect(html).toContain("Do not prefix the debit line with To.");
    expect(html).toContain("How to write the credit line");
    expect(html).toContain("Prefix it with To");
    expect(html).toContain("Do not add Dr. to the credited account.");
    expect(html).toContain("To is a presentation convention.");
    expect(html).toContain("Debit and credit totals");
    expect(html).toContain("A compound entry may contain more than one debit or credit line.");
    expect(html).toContain("How to write a clear narration");
    expect(html).toContain("Being rent paid by bank.");
    expect(html).toContain("Being transaction done.");
    expect(html).toContain("These are weak because they are too vague");
    expect(html).toContain("Date, Dr., To, amounts, narration, totals");
    expect(html).toContain("Write the transaction date");
    expect(html).toContain("Review details");
    expect(html).toContain("Bought goods for cash ₹10,000.");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Being goods purchased for cash.");
    expect(html).toContain("Paid salary by bank ₹8,000.");
    expect(html).toContain("Salary A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Being salary paid by bank.");
    expect(html).toContain("Sold goods on credit to Riya ₹12,000.");
    expect(html).toContain("Riya A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Being goods sold on credit to Riya.");
    expect(html).toContain("Amit introduced capital of ₹50,000 through bank.");
    expect(html).toContain("To Amit&#x27;s Capital A/c");
    expect(html).not.toContain("To Capital A/c");
    expect(html).toContain("Being capital introduced by Amit through bank.");
    expect(html).toContain("Simple versus compound entry");
    expect(html).toContain("One debit and one credit.");
    expect(html).toContain("Salary A/c Dr. ₹5,000");
    expect(html).toContain("Rent A/c Dr. ₹3,000");
    expect(html).toContain("To Bank A/c ₹8,000");
    expect(html).toContain("Correct versus incorrect presentation");
    expect(html).toContain("Problems: missing Dr., missing To, unclear amount placement, and no narration.");
    expect(html).toContain("Presentation checklist");
    expect(html).toContain("Debit account is written first.");
    expect(html).toContain("L.F. is used correctly or left blank.");
    expect(html).toContain("Debit total equals credit total.");
    expect(html).toContain("Can another student understand the transaction only by reading your journal entry and narration?");
    expect(html).toContain("Previous Debit and Credit Rules");
    expect(html).toContain("Continue to Cash and Bank Transactions");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/journal-format-and-narration")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/debit-and-credit-rules"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/cash-and-bank-transactions"');
    expect(html).not.toContain("Continue to Cash and Bank Transactions - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Cash and Bank Transactions section with the Capital next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(CashAndBankTransactionsChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Cash and Bank Transactions");
    expect(html).toContain("Section 7 of 16");
    expect(html).toContain("Start with the payment mode");
    expect(html).toContain("Cash A/c and Bank A/c are both asset accounts, but they are separate accounts.");
    expect(html).toContain("Cash A/c and Bank A/c");
    expect(html).toContain("Represents physical cash held by the business.");
    expect(html).toContain("Represents money held in the business bank account.");
    expect(html).toContain("Do not assume every card transaction is automatically Bank A/c.");
    expect(html).toContain("Cash receipt and cash payment");
    expect(html).toContain("Cash A/c is debited.");
    expect(html).toContain("Cash A/c is credited.");
    expect(html).toContain("Bank receipt and bank payment");
    expect(html).toContain("Bank A/c is debited.");
    expect(html).toContain("Bank A/c is credited.");
    expect(html).toContain("Words that point to Cash A/c or Bank A/c");
    expect(html).toContain("for cash");
    expect(html).toContain("by bank");
    expect(html).toContain("through UPI");
    expect(html).toContain("through NEFT/RTGS");
    expect(html).toContain("on credit");
    expect(html).toContain("deposited cash into bank");
    expect(html).toContain("withdrew cash from bank for office use");
    expect(html).toContain("Deposited cash into bank ₹15,000.");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Being cash deposited into bank.");
    expect(html).toContain("No income or expense");
    expect(html).toContain("Cash withdrawn from bank ₹3,000 for office use.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Being cash withdrawn from bank for office use.");
    expect(html).toContain("This is not drawings because the cash remains for business use.");
    expect(html).toContain("The purpose of withdrawal changes the entry");
    expect(html).toContain("This business withdrawal is not drawings.");
    expect(html).toContain("This personal withdrawal is not a business cash-bank transfer.");
    expect(html).toContain("Bought goods for cash ₹10,000.");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("Paid rent by bank ₹5,000.");
    expect(html).toContain("Rent A/c Dr.");
    expect(html).toContain("Sold goods for cash ₹12,000.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Received commission through bank ₹7,000.");
    expect(html).toContain("To Commission Received A/c");
    expect(html).toContain("Riya withdrew ₹4,000 from bank for personal use.");
    expect(html).toContain("Riya Drawings A/c Dr.");
    expect(html).toContain("Being amount withdrawn by Riya from bank for personal use.");
    expect(html).toContain("Cash A/c is not debited merely because the word withdrawn appears.");
    expect(html).toContain("Do not use Cash or Bank for credit transactions");
    expect(html).toContain("Bought goods on credit from Mohan ₹10,000.");
    expect(html).toContain("To Mohan A/c ₹10,000.");
    expect(html).toContain("Sold goods on credit to Riya ₹8,000.");
    expect(html).toContain("Riya A/c Dr. ₹8,000.");
    expect(html).toContain("To Sales A/c ₹8,000.");
    expect(html).toContain("Cash A/c and Bank A/c are not affected at the time of purchase.");
    expect(html).toContain("Cash A/c and Bank A/c are not affected at the time of sale.");
    expect(html).toContain("Cash-versus-bank decision process");
    expect(html).toContain("Confirm Debit equals Credit");
    expect(html).toContain("Avoid these Cash and Bank mistakes");
    expect(html).toContain("Display-only checklist");
    expect(html).toContain("Where did the money move—from cash, from bank, into cash, into bank, or outside the business?");
    expect(html).toContain("Previous Journal Format and Narration");
    expect(html).toContain("Continue to Capital");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/cash-and-bank-transactions")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/journal-format-and-narration"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/capital"');
    expect(html).not.toContain("Continue to Capital - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Capital section with the Drawings next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(CapitalChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Capital");
    expect(html).toContain("Section 8 of 16");
    expect(html).toContain("What capital means");
    expect(html).toContain("Capital is not business income.");
    expect(html).toContain("The business and owner are treated separately");
    expect(html).toContain("From the business&#x27;s point of view, the owner gives value to the business.");
    expect(html).toContain("Assets = Capital + Liabilities");
    expect(html).toContain("After Amit introduces cash ₹50,000");
    expect(html).toContain("No direct Profit &amp; Loss impact arises.");
    expect(html).toContain("The Balance Sheet is affected.");
    expect(html).toContain("Amit introduced cash ₹50,000 as capital.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("To Amit&#x27;s Capital A/c");
    expect(html).toContain("Priyanka introduced capital of ₹60,000 through bank.");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("To Priyanka&#x27;s Capital A/c");
    expect(html).toContain("Use the person&#x27;s Capital A/c when a name is given");
    expect(html).toContain("Amit&#x27;s Capital A/c.");
    expect(html).toContain("Kuldeep&#x27;s Capital A/c.");
    expect(html).toContain("A and B started their partnership with ₹50,000 and ₹70,000 in cash as capital.");
    expect(html).toContain("To A&#x27;s Capital A/c");
    expect(html).toContain("To B&#x27;s Capital A/c");
    expect(html).toContain("Amit and Riya introduced ₹40,000 and ₹60,000 through bank as capital.");
    expect(html).toContain("To Amit&#x27;s Capital A/c");
    expect(html).toContain("To Riya&#x27;s Capital A/c");
    expect(html).toContain("Kuldeep introduced additional capital of ₹25,000 through bank.");
    expect(html).toContain("To Kuldeep&#x27;s Capital A/c");
    expect(html).toContain("Capital, loan, and income can all bring money into the business");
    expect(html).toContain("To Bank Loan A/c");
    expect(html).toContain("To Sales/Income A/c");
    expect(html).toContain("Capital is not income");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Riya brought ₹45,000 in cash as capital into the business.");
    expect(html).toContain("To Riya&#x27;s Capital A/c");
    expect(html).toContain("Kuldeep introduced ₹75,000 as capital through bank.");
    expect(html).toContain("To Kuldeep&#x27;s Capital A/c");
    expect(html).toContain("Kuldeep and Priyanka brought ₹80,000 and ₹50,000 in cash as capital.");
    expect(html).toContain("1,30,000");
    expect(html).toContain("Priyanka and Kuldeep started their partnership with ₹50,000 and ₹70,000 through bank as capital.");
    expect(html).toContain("1,20,000");
    expect(html).toContain("Amit introduced additional capital of ₹20,000 in cash.");
    expect(html).toContain("Avoid these Capital mistakes");
    expect(html).toContain("Capital-entry decision process");
    expect(html).toContain("Capital checklist");
    expect(html).toContain("Who gave the value to the business, what asset did the business receive, and whose Capital A/c increased?");
    expect(html).toContain("Previous Cash and Bank Transactions");
    expect(html).toContain("Continue to Drawings");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/capital")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/cash-and-bank-transactions"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/drawings"');
    expect(html).not.toContain("Continue to Drawings - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Drawings section with the Purchases next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(DrawingsChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Drawings");
    expect(html).toContain("Section 9 of 16");
    expect(html).toContain("What drawings mean");
    expect(html).toContain("Drawings are not a business expense.");
    expect(html).toContain("Why Drawings A/c is debited");
    expect(html).toContain("Owner or partner takes value for personal use → Drawings increases → Asset or goods available to the business decreases.");
    expect(html).toContain("Assets = Capital + Liabilities");
    expect(html).toContain("Drawings are deducted from Capital in final presentation.");
    expect(html).toContain("Amit withdrew cash ₹5,000 for personal use.");
    expect(html).toContain("Amit Drawings A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Riya withdrew ₹4,000 from bank for personal use.");
    expect(html).toContain("Riya Drawings A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Purpose changes the entry");
    expect(html).toContain("Cash withdrawn from bank ₹3,000 for office use.");
    expect(html).toContain("Cash A/c Dr. ₹3,000.");
    expect(html).toContain("It is not drawings.");
    expect(html).toContain("Amit withdrew goods costing ₹3,000 for personal use.");
    expect(html).toContain("To Purchases A/c");
    expect(html).toContain("Use cost value, not selling price.");
    expect(html).toContain("Do not credit Sales A/c");
    expect(html).toContain("The business paid Amit&#x27;s personal mobile bill ₹2,000 through bank.");
    expect(html).toContain("It is not Telephone Expense A/c of the business");
    expect(html).toContain("Use the person&#x27;s Drawings A/c when a name is given");
    expect(html).toContain("Amit Drawings A/c.");
    expect(html).toContain("Priyanka Drawings A/c.");
    expect(html).toContain("Two partners withdraw separately");
    expect(html).toContain("Entry 1: Amit withdrew cash");
    expect(html).toContain("Entry 2: Riya withdrew through bank");
    expect(html).toContain("Personal benefit is not a business expense");
    expect(html).toContain("Capital enters, drawings leave");
    expect(html).toContain("Interest on drawings");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Priyanka withdrew cash ₹6,000 for personal use.");
    expect(html).toContain("Kuldeep withdrew ₹8,000 through bank for personal use.");
    expect(html).toContain("Riya withdrew goods costing ₹4,000 for personal use.");
    expect(html).toContain("The business paid Amit&#x27;s personal insurance premium ₹5,000 by bank.");
    expect(html).toContain("Cash withdrawn from bank ₹7,000 for office use.");
    expect(html).toContain("Avoid these Drawings mistakes");
    expect(html).toContain("Drawings decision process");
    expect(html).toContain("Drawings checklist");
    expect(html).toContain("Did the value remain inside the business, support the business, or leave the business for someone&#x27;s personal benefit?");
    expect(html).toContain("Previous Capital");
    expect(html).toContain("Continue to Purchases");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/drawings")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/capital"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/purchases"');
    expect(html).not.toContain("Continue to Purchases - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Purchases section with the Sales next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(PurchasesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Purchases");
    expect(html).toContain("Section 10 of 16");
    expect(html).toContain("What Purchases A/c records");
    expect(html).toContain("Purchases A/c records goods bought for resale.");
    expect(html).toContain("Items bought for resale → Purchases A/c.");
    expect(html).toContain("Assets bought for business use → Named Asset A/c.");
    expect(html).toContain("Goods versus assets");
    expect(html).toContain("Furniture dealer buys furniture for resale");
    expect(html).toContain("Coaching centre buys furniture for office use");
    expect(html).toContain("Cash purchase");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Bank purchase");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Credit purchase");
    expect(html).toContain("To Mohan A/c");
    expect(html).toContain("Cash and Bank are not affected at the time of credit purchase.");
    expect(html).toContain("Use the supplier&#x27;s account in a credit purchase");
    expect(html).toContain("Riya Traders A/c.");
    expect(html).toContain("Purchases versus expenses");
    expect(html).toContain("Paid office rent by bank ₹10,000.");
    expect(html).toContain("Trade discount reduces the invoice or list price before recording.");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Common source documents");
    expect(html).toContain("Purchase invoice.");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Bought goods for cash ₹12,000.");
    expect(html).toContain("Solved Illustration 6");
    expect(html).toContain("Paid office rent by bank ₹10,000.");
    expect(html).toContain("Machinery A/c Dr.");
    expect(html).toContain("Avoid these Purchases mistakes");
    expect(html).toContain("Purchase decision process");
    expect(html).toContain("Purchases checklist");
    expect(html).toContain("Was the item purchased for resale, for use as an asset, or as a business expense");
    expect(html).toContain("Previous Drawings");
    expect(html).toContain("Continue to Sales");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/purchases")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/drawings"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/sales"');
    expect(html).not.toContain("Continue to Sales - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Sales section with the Expenses next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(SalesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Sales");
    expect(html).toContain("Section 11 of 16");
    expect(html).toContain("What Sales A/c records");
    expect(html).toContain("Sales A/c records goods sold by the business in the ordinary course");
    expect(html).toContain("Goods sold in the ordinary course of business → Sales A/c.");
    expect(html).toContain("The receipt mode or named customer identifies the debited account.");
    expect(html).toContain("Goods versus assets");
    expect(html).toContain("Furniture dealer sells furniture to customers");
    expect(html).toContain("Coaching centre sells old office furniture");
    expect(html).toContain("Cash sale");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Bank sale");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("Credit sale");
    expect(html).toContain("Riya A/c Dr.");
    expect(html).toContain("Cash and Bank are not affected at the time of credit sale.");
    expect(html).toContain("Use the customer&#x27;s account in a credit sale");
    expect(html).toContain("ABC Stores A/c.");
    expect(html).toContain("Sales versus other receipts");
    expect(html).toContain("To Amit&#x27;s Capital A/c.");
    expect(html).toContain("To Bank Loan A/c.");
    expect(html).toContain("Original sale and later collection are separate");
    expect(html).toContain("To Riya A/c");
    expect(html).toContain("If a debtor pays only part of the amount");
    expect(html).toContain("Trade discount reduces the listed price before recording the sale.");
    expect(html).toContain("Sales Returns / Returns Inward treatment is a later linked subtopic.");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Common source documents");
    expect(html).toContain("Sales invoice.");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Sold goods for cash ₹15,000.");
    expect(html).toContain("Solved Illustration 5");
    expect(html).toContain("Sold old furniture for cash ₹8,000.");
    expect(html).toContain("asset disposal treatment is deferred");
    expect(html).toContain("Avoid these Sales mistakes");
    expect(html).toContain("Sales decision process");
    expect(html).toContain("Sales checklist");
    expect(html).toContain("Was the business selling its normal goods, disposing of an asset, or receiving money for some other reason");
    expect(html).toContain("Previous Purchases");
    expect(html).toContain("Continue to Expenses");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/sales")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/purchases"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/expenses"');
    expect(html).not.toContain("Continue to Expenses - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Expenses section with the Income next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(ExpensesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Expenses");
    expect(html).toContain("Section 12 of 16");
    expect(html).toContain("What a business expense means");
    expect(html).toContain("An expense is a cost incurred to operate the business or earn revenue.");
    expect(html).toContain("Expense incurred for business purpose → Expense A/c increases → Debit the specific Expense A/c.");
    expect(html).toContain("How expense accounts are classified here");
    expect(html).toContain("Expense / Loss account.");
    expect(html).toContain("The golden rule is debit all expenses and losses.");
    expect(html).toContain("Use the exact expense account");
    expect(html).toContain("Salary paid → Salary A/c.");
    expect(html).toContain("Do not write Expense A/c when a specific expense is known.");
    expect(html).toContain("Expense paid in cash");
    expect(html).toContain("Paid office rent in cash ₹5,000.");
    expect(html).toContain("Rent A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Expense paid through bank");
    expect(html).toContain("Paid salary by bank ₹8,000.");
    expect(html).toContain("Salary A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Expense incurred but not yet paid");
    expect(html).toContain("To Outstanding Salary A/c");
    expect(html).toContain("Cash and Bank are not affected because payment has not occurred.");
    expect(html).toContain("Recording the expense and later payment are separate");
    expect(html).toContain("Outstanding Salary A/c Dr.");
    expect(html).toContain("Salary A/c is not debited again when the liability is settled.");
    expect(html).toContain("Purpose decides whether it is expense or drawings");
    expect(html).toContain("Amit Drawings A/c Dr.");
    expect(html).toContain("rather than a business expense");
    expect(html).toContain("Repairing an asset is different from buying an asset");
    expect(html).toContain("Repairs A/c Dr.");
    expect(html).toContain("Machinery A/c Dr.");
    expect(html).toContain("Detailed capital-versus-revenue expenditure treatment is Later / design-needed.");
    expect(html).toContain("Purchases A/c and Expense A/c are not interchangeable");
    expect(html).toContain("Specific Expense A/c Dr.");
    expect(html).toContain("Direct and indirect expense placement comes later");
    expect(html).toContain("Later / linked to Final Accounts");
    expect(html).toContain("Prepaid expenses are adjustment topics");
    expect(html).toContain("Prepaid Insurance A/c Dr.; To Insurance A/c");
    expect(html).toContain("Outstanding and accrued expense");
    expect(html).toContain("Common source documents");
    expect(html).toContain("Salary sheet.");
    expect(html).toContain("Payment voucher.");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Paid office rent in cash ₹6,000.");
    expect(html).toContain("Solved Illustration 6");
    expect(html).toContain("Bought office furniture through bank ₹30,000.");
    expect(html).toContain("Priyanka Drawings A/c Dr.");
    expect(html).toContain("Avoid these Expenses mistakes");
    expect(html).toContain("Expense decision process");
    expect(html).toContain("Expense checklist");
    expect(html).toContain("Was this cost incurred for the business, for an asset, for goods to resell, or for someone&#x27;s personal benefit");
    expect(html).toContain("Previous Sales");
    expect(html).toContain("Continue to Income");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/expenses")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/sales"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/income"');
    expect(html).not.toContain("Continue to Income - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Income section with the Assets and Liabilities next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(IncomeChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Income");
    expect(html).toContain("Section 13 of 16");
    expect(html).toContain("What business income means");
    expect(html).toContain("Income is value earned by the business");
    expect(html).toContain("Income earned by the business → Income A/c increases → Credit the specific Income A/c.");
    expect(html).toContain("How income accounts are classified here");
    expect(html).toContain("Income / Revenue account.");
    expect(html).toContain("credit all incomes and gains");
    expect(html).toContain("Use the exact income account");
    expect(html).toContain("Commission earned → Commission Received A/c.");
    expect(html).toContain("Do not write Income A/c when a specific income is known.");
    expect(html).toContain("Income received in cash");
    expect(html).toContain("Received commission in cash ₹5,000.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("To Commission Received A/c");
    expect(html).toContain("Income received through bank");
    expect(html).toContain("Received interest through bank ₹4,000.");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("To Interest Received A/c");
    expect(html).toContain("Income earned but not yet received");
    expect(html).toContain("Accrued Commission A/c Dr.");
    expect(html).toContain("Cash and Bank are not affected yet");
    expect(html).toContain("Earning income and receiving it later are separate");
    expect(html).toContain("Bank A/c Dr.");
    expect(html).toContain("To Accrued Commission A/c");
    expect(html).toContain("Commission Received A/c is not credited again.");
    expect(html).toContain("Income received in advance");
    expect(html).toContain("To Rent Received in Advance A/c");
    expect(html).toContain("The amount is not current income yet.");
    expect(html).toContain("Recognising income received in advance later");
    expect(html).toContain("Later / linked to Final Accounts");
    expect(html).toContain("Income earned and cash received are related but separate");
    expect(html).toContain("Not every receipt is income");
    expect(html).toContain("To Amit&#x27;s Capital A/c.");
    expect(html).toContain("To Bank Loan A/c.");
    expect(html).toContain("Use Sales only for goods sold in trading");
    expect(html).toContain("Incorrect: Bank A/c Dr.; To Sales A/c.");
    expect(html).toContain("Collection from a debtor is not new income");
    expect(html).toContain("To Riya A/c");
    expect(html).toContain("does not credit Sales A/c");
    expect(html).toContain("Refunds and reversals need careful design");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Direct and indirect income placement comes later");
    expect(html).toContain("Common source documents");
    expect(html).toContain("Commission statement.");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Received commission in cash ₹6,000.");
    expect(html).toContain("Solved Illustration 7");
    expect(html).toContain("Amit introduced ₹20,000 through bank as additional capital.");
    expect(html).toContain("Avoid these Income mistakes");
    expect(html).toContain("Income decision process");
    expect(html).toContain("Income checklist");
    expect(html).toContain("Did the business earn this amount now, receive it before earning it, or simply collect an amount already due?");
    expect(html).toContain("Previous Expenses");
    expect(html).toContain("Continue to Assets and Liabilities");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/income")).toContain('aria-current="step"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/expenses"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/assets-and-liabilities"');
    expect(html).not.toContain("Continue to Assets and Liabilities - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Assets and Liabilities section with the Mixed Simple Entries next link and without adding a checker", () => {
    const html = renderToStaticMarkup(createElement(AssetsAndLiabilitiesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Assets and Liabilities");
    expect(html).toContain("Section 14 of 16");
    expect(html).toContain("What assets mean");
    expect(html).toContain("Assets are resources owned or controlled by the business.");
    expect(html).toContain("What liabilities mean");
    expect(html).toContain("Liabilities are amounts or obligations payable to outsiders.");
    expect(html).toContain("Capital is not an outside liability");
    expect(html).toContain("Use increase and decrease logic");
    expect(html).toContain("Asset increases → Debit.");
    expect(html).toContain("Liability decreases → Debit.");
    expect(html).toContain("Current and non-current idea");
    expect(html).toContain("Current assets");
    expect(html).toContain("Non-current liabilities");
    expect(html).toContain("Assets = Capital + Liabilities");
    expect(html).toContain("Loan received through bank");
    expect(html).toContain("Loan repaid through bank");
    expect(html).toContain("Asset purchased for cash");
    expect(html).toContain("Bought furniture for cash ₹20,000.");
    expect(html).toContain("Furniture A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Asset purchased through bank");
    expect(html).toContain("Bought machinery through bank ₹50,000.");
    expect(html).toContain("Machinery A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Asset purchased on credit");
    expect(html).toContain("Bought office furniture on credit from Mohan ₹30,000.");
    expect(html).toContain("To Mohan A/c");
    expect(html).toContain("Cash A/c or Bank A/c is not affected yet.");
    expect(html).toContain("To Bank Loan A/c");
    expect(html).toContain("The receipt is not income or capital.");
    expect(html).toContain("Bank Loan A/c Dr.");
    expect(html).toContain("Loan repayment itself is not an expense.");
    expect(html).toContain("Creditor creation and settlement");
    expect(html).toContain("Purchases A/c is not debited again during settlement.");
    expect(html).toContain("Outstanding expense and later payment");
    expect(html).toContain("Outstanding Salary A/c Dr.");
    expect(html).toContain("The expense must not be recorded twice.");
    expect(html).toContain("Purpose decides Furniture A/c or Purchases A/c");
    expect(html).toContain("Longer benefit is different from routine expense");
    expect(html).toContain("A bank receipt may have different sources");
    expect(html).toContain("A person&#x27;s account depends on their role");
    expect(html).toContain("Depreciation comes later");
    expect(html).toContain("Later / linked chapter");
    expect(html).toContain("Asset disposal needs careful treatment");
    expect(html).toContain("not automatically Sales A/c");
    expect(html).toContain("Installation and incidental costs need design");
    expect(html).toContain("Later / design-needed");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Solved Illustration 7");
    expect(html).toContain("Avoid these Assets and Liabilities mistakes");
    expect(html).toContain("Assets and liabilities decision process");
    expect(html).toContain("Assets and liabilities checklist");
    expect(html).toContain("What resource did the business gain or lose, and what obligation was created or settled?");
    expect(html).toContain("Previous Income");
    expect(html).toContain("Continue to Mixed Simple Entries");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/assets-and-liabilities")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/income"');
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/mixed-simple-entries"');
    expect(html).not.toContain("Continue to Mixed Simple Entries - Preview only");
    expect(html).not.toContain("Practice 1 of 2");
    expect(html).not.toContain("Practice 2 of 2");
    expect(html).not.toContain("Check Answer");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("practice-feedback-");
  });

  it("renders the Mixed Simple Entries route with reveal-only exercises and no checker", () => {
    const html = renderToStaticMarkup(createElement(MixedSimpleEntriesChapterPreviewPage));

    expect(html).toContain("Chapters");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("Mixed Simple Entries");
    expect(html).toContain("Section 15 of 16");
    expect(html).toContain("Use the full sentence before choosing accounts");
    expect(html).toContain("Think serially before writing the entry");
    expect(html).toContain("Transaction-clue recap");
    expect(html).toContain("Clues help, but reasoning decides");
    expect(html).toContain("What changes the entry?");
    expect(html).toContain("Cash vs bank vs credit purchase");
    expect(html).toContain("Cash: Purchases A/c Dr.; To Cash A/c.");
    expect(html).toContain("Bank: Bank A/c Dr.; To Sales A/c.");
    expect(html).toContain("Business vs personal withdrawal");
    expect(html).toContain("Capital vs loan vs income");
    expect(html).toContain("Solved Illustration 1");
    expect(html).toContain("Solved Illustration 12");
    expect(html).toContain("Bought goods for cash ₹10,000.");
    expect(html).toContain("Purchases A/c Dr.");
    expect(html).toContain("To Cash A/c");
    expect(html).toContain("Paid office rent through bank ₹6,000.");
    expect(html).toContain("Rent A/c Dr.");
    expect(html).toContain("To Bank A/c");
    expect(html).toContain("Sold goods on credit to Priyanka ₹15,000.");
    expect(html).toContain("Priyanka A/c Dr.");
    expect(html).toContain("To Sales A/c");
    expect(html).toContain("Kuldeep introduced capital of ₹50,000 through bank.");
    expect(html).toContain("To Kuldeep&#x27;s Capital A/c");
    expect(html).toContain("Riya withdrew ₹4,000 from bank for personal use.");
    expect(html).toContain("Riya Drawings A/c Dr.");
    expect(html).toContain("Bought office furniture on credit from Mohan ₹25,000.");
    expect(html).toContain("Furniture A/c Dr.");
    expect(html).toContain("To Mohan A/c");
    expect(html).toContain("Received a bank loan of ₹1,00,000 in the business bank account.");
    expect(html).toContain("To Bank Loan A/c");
    expect(html).toContain("Outstanding salary of ₹5,000 was paid through bank.");
    expect(html).toContain("Outstanding Salary A/c Dr.");
    expect(html).toContain("should not debit Salary A/c again");
    expect(html).toContain("Received ₹12,000 from Riya through bank against an earlier credit sale.");
    expect(html).toContain("To Riya A/c");
    expect(html).toContain("Sales A/c is not credited again.");
    expect(html).toContain("Commission ₹3,000 was earned but not yet received.");
    expect(html).toContain("Accrued Commission A/c Dr.");
    expect(html).toContain("To Commission Received A/c");
    expect(html).toContain("Received rent in advance through bank ₹8,000.");
    expect(html).toContain("To Rent Received in Advance A/c");
    expect(html).toContain("Cash withdrawn from bank ₹7,000 for office use.");
    expect(html).toContain("Cash A/c Dr.");
    expect(html).toContain("Do not confuse");
    expect(html).toContain("Purchases A/c vs Furniture A/c");
    expect(html).toContain("Outstanding Expense A/c vs Expense A/c during settlement");
    expect(html).toContain("Try these mentally, then reveal");
    expect(html).toContain("Paid electricity bill in cash ₹2,500.");
    expect(html).toContain("Electricity Expense A/c Dr.");
    expect(html).toContain("Sold goods through bank ₹9,000.");
    expect(html).toContain("Purchased goods on credit from ABC Traders ₹14,000.");
    expect(html).toContain("To ABC Traders A/c");
    expect(html).toContain("Amit introduced additional capital through bank ₹20,000.");
    expect(html).toContain("Received commission in cash ₹4,000.");
    expect(html).toContain("Repaid bank loan through bank ₹15,000.");
    expect(html).toContain("Bank Loan A/c Dr.");
    expect(html).toContain("Avoid these Mixed Simple Entries mistakes");
    expect(html).toContain("Mixed-entry decision process");
    expect(html).toContain("Mixed-entry checklist");
    expect(html).toContain("Could the entry change if one word - cash, bank, credit, personal, business, due, or received - changed?");
    expect(html).toContain("Previous Assets and Liabilities");
    expect(html).toContain("Continue to Chapter Recap and Practice - Preview only");
    expect(getLinkMarkup(html, "/platform-preview/chapters/journal-entries/mixed-simple-entries")).toContain(
      'aria-current="step"',
    );
    expect(html).toContain('href="/platform-preview/chapters/journal-entries/assets-and-liabilities"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/chapter-recap-and-practice"');

    const revealLabels = html.match(/Reveal explanation/g) ?? [];
    const detailsTags = html.match(/<details/g) ?? [];

    expect(revealLabels).toHaveLength(6);
    expect(detailsTags.length).toBeGreaterThanOrEqual(7);
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<textarea");
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
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/journal-format-and-narration"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/cash-and-bank-transactions"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/capital"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/drawings"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/purchases"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/sales"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/expenses"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/income"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/assets-and-liabilities"');
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries/mixed-simple-entries"');
  });
});
