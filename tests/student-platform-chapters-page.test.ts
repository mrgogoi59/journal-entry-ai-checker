import { readFileSync } from "node:fs";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BankReconciliationPage, { metadata as bankReconciliationMetadata } from "@/app/bank-reconciliation/page";
import DashboardPage, { metadata as dashboardMetadata } from "@/app/dashboard/page";
import FinalAccountsPage, { metadata as finalAccountsMetadata } from "@/app/final-accounts/page";
import JournalEntrySolverPage, { metadata as journalEntrySolverMetadata } from "@/app/journal-entry-solver/page";
import LedgerPage, { metadata as ledgerMetadata } from "@/app/ledger/page";
import ChaptersPage, { metadata as chaptersMetadata } from "@/app/chapters/page";
import SolverPage, { metadata as solverMetadata } from "@/app/solver/page";
import JournalEntriesChapterPage, { metadata as journalEntriesMetadata } from "@/app/chapters/journal-entries/page";
import ToolsPage from "@/app/tools/page";
import TrialBalancePage, { metadata as trialBalanceMetadata } from "@/app/trial-balance/page";
import {
  generateMetadata as generateJournalEntriesSubtopicMetadata,
  generateStaticParams as generateJournalEntriesStaticParams,
} from "@/app/chapters/journal-entries/[sectionSlug]/page";
import {
  getProductionSectionHref,
  JournalEntriesSectionPage,
  productionJournalEntriesSectionRoutes,
} from "@/app/chapters/journal-entries/JournalEntriesSectionPage";
import { productionText } from "@/app/chapters/journal-entries/JournalEntriesLearningBlocks";
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
  JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
  JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
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
  BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
  BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
  DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
  PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
  PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
  PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
  SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
  WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
} from "@/lib/learning-platform/chapters/journal-entries";
import { solverToolCatalog } from "@/lib/learning-platform/solver-catalog";

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

function expectNoJournalEntriesExternalActionLinks(html: string) {
  expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Use Explainer")).toBe("");
  expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Practice")).toBe("");
}

function expectNoJournalEntriesPreCheckHints(html: string) {
  expect(html).not.toContain("Write a complete journal entry");
  expect(html).not.toContain("How to try this question");
  expect(html).not.toContain("Likely accounts involved:");
  expect(html).not.toContain("Decide which account");
  expect(html).not.toContain("Spelling, account naming, Dr./To, amount, totals, and narration matter in this checker.");
  expect(html).not.toContain("Before you check");
  expect(html).not.toContain("Analyse the transaction before typing.");
  expect(html).not.toContain("Decide the debit and credit side before you check.");
  expect(html).not.toContain("Use the feedback to learn the logic, not just to guess.");
  expect(html).not.toContain("Write the full entry first, then check your answer.");
}

function getJournalEntryCheckerForms(html: string) {
  return Array.from(
    html.matchAll(/<form[^>]*aria-label="[^"]*journal entry checker"[\s\S]*?<\/form>/g),
    (match) => match[0],
  );
}

function getHrefValues(html: string) {
  return Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1]);
}

function getSolverToolCardMarkup(html: string, label: string) {
  return html.match(new RegExp(`<article[^>]*aria-label="${label} solver tool"[\\s\\S]*?</article>`))?.[0] ?? "";
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
  it("renders the production Dashboard route with minimal honest links and availability copy", () => {
    const html = renderToStaticMarkup(createElement(DashboardPage));
    const hrefs = getHrefValues(html);

    expect(dashboardMetadata).toMatchObject({
      title: "Dashboard | AccyWise AI",
      description: "Start Journal Entries and open quick links.",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/dashboard")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("AI Assistant");
    expect(html).toContain("Coming soon");
    expect(html).toContain("<h1");
    expect(html).toContain("Dashboard");
    expect(getLinkMarkupWithText(html, "/chapters/journal-entries", "Start Journal Entries")).toContain(
      "Start Journal Entries",
    );
    expect(html).toContain("Quick Links");
    ["Chapters", "Solver", "Practice", "Journal Entries"].forEach((label) => {
      expect(html).toContain(label);
    });
    expect(html).toContain("Available Now");
    expect(html).toContain("Journal Entries");
    expect(html).toContain("1 chapter");
    expect(html).toContain("Practice Questions");
    expect(html).toContain("2 questions");
    expect(html).toContain("Solver Tools");
    expect(html).toContain("5 tools");
    expect(html).toContain("Coming Soon");
    expect(html).toContain("Progress tracking");
    expect(html).toContain("Recent activity");
    expect(html).toContain("Weak-topic insights");
    expect(html).toContain("Revision recommendations");
    expect(html).toContain("Cross-device access");
    expect(html).not.toContain("Personal progress later");
    expect(html).not.toContain("Start Learning");
    expect(html).not.toContain("16 learning sections");
    expect(html).not.toContain("2 interactive Practice It Yourself questions");
    expect(html).not.toContain("Platform availability");
    expect(html).not.toContain("General recommendation");
    expect(html).not.toContain("Recommended Next Step");
    expect(html).not.toContain("Begin with Journal Entries to build the foundation");
    expect(html).not.toContain("Your recent learning activity will appear here");
    expect(html).not.toContain("Learning Progress");
    expect(html).not.toContain("Chapter completion tracking is not enabled yet.");
    expect(html).not.toContain("Upcoming Dashboard capabilities");
    expect(html).not.toContain("Saved progress");
    expect(html).not.toContain("Welcome back");
    expect(html).not.toContain("study streak");
    expect(html).not.toContain("questions attempted");
    expect(html).not.toContain("recently completed");
    expect(html).not.toContain("0%");
    expect(html).not.toContain("/platform-preview");
  });

  it("keeps Dashboard quick actions limited to valid production routes and avoids storage/persistence code", () => {
    const html = renderToStaticMarkup(createElement(DashboardPage));
    const source = readFileSync("app/dashboard/page.tsx", "utf8");
    const hrefs = getHrefValues(html);

    ["/dashboard", "/chapters", "/solver", "/practice", "/chapters/journal-entries"].forEach((href) => {
      expect(hrefs).toContain(href);
    });
    expect(getLinkMarkupWithText(html, "/chapters", "Chapters")).toContain("Chapters");
    expect(getLinkMarkupWithText(html, "/solver", "Solver")).toContain("Solver");
    expect(getLinkMarkupWithText(html, "/practice", "Practice")).toContain("Practice");
    expect(getLinkMarkupWithText(html, "/chapters/journal-entries", "Journal Entries")).toContain("Journal Entries");
    expect(hrefs).not.toContain("/assistant");
    expect(hrefs).not.toContain("/platform-preview");
    expect(source).not.toContain("localStorage");
    expect(source).not.toContain("sessionStorage");
    expect(source).not.toContain("document.cookie");
    expect(source).not.toContain("redirect(");
  });

  it("renders the production Solver route from a truthful typed catalogue", () => {
    const html = renderToStaticMarkup(createElement(SolverPage));
    const hrefs = getHrefValues(html);
    const simplifiedToolCopy = [
      {
        title: "AI Journal Entry Explainer",
        description: "Explain debit and credit logic for journal entries.",
        href: "/journal-entry-solver",
        actionLabel: "Open Explainer",
      },
      {
        title: "Ledger Posting",
        description: "Convert journal entries into account-wise ledger views.",
        href: "/ledger",
        actionLabel: "Open Ledger",
      },
      {
        title: "Trial Balance",
        description: "Generate a balanced debit and credit summary.",
        href: "/trial-balance",
        actionLabel: "Open Trial Balance",
      },
      {
        title: "Final Accounts",
        description: "Prepare Trading, Profit &amp; Loss, and Balance Sheet.",
        href: "/final-accounts",
        actionLabel: "Open Final Accounts",
      },
      {
        title: "Bank Reconciliation Statement",
        description: "Reconcile Cash Book and Bank Statement balances.",
        href: "/bank-reconciliation",
        actionLabel: "Open BRS",
      },
    ];

    expect(solverMetadata).toMatchObject({
      title: "Solver | AccyWise AI",
      description: "Choose a Solver tool when you are stuck.",
    });
    expect(solverMetadata).not.toHaveProperty("robots");
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("AI Assistant");
    expect(html).toContain("Coming soon");
    expect(html).toContain("<h1");
    expect(html).toContain("Solver");
    expect(html).toContain("Choose a tool when you are stuck.");
    expect(html).not.toContain("Tools hub");
    expect(html).not.toContain("What it currently does");
    expect(html).not.toContain("Educational boundary");
    expect(html).not.toContain("Available through");
    expect(html).not.toContain("Choose an Accountancy tool to explain, prepare, or review a specific accounting problem.");
    expect(html).not.toContain("Chapters teach concepts step by step");
    expect(html).not.toContain("Start Journal Entries First");
    expect(html).not.toContain("Recommended support tool");
    expect(html).not.toContain("Use Journal Entry Explainer when stuck");
    expect(html).not.toContain("Use Solver for targeted help");
    expect(html).not.toContain(`${solverToolCatalog.length} of ${solverToolCatalog.length} tools available`);
    expect(html).not.toContain("/platform-preview");

    expect(html.match(/aria-label="[^"]+ solver tool"/g) ?? []).toHaveLength(5);
    expect(solverToolCatalog.map((tool) => tool.title)).toEqual([
      "AI Journal Entry Explainer",
      "Ledger Posting",
      "Trial Balance",
      "Final Accounts",
      "Bank Reconciliation Statement",
    ]);

    simplifiedToolCopy.forEach((tool) => {
      const card = getSolverToolCardMarkup(html, tool.title);

      expect(card).toContain(tool.description);
      expect(getLinkMarkupWithText(card, tool.href, tool.actionLabel)).toContain(tool.actionLabel);
    });
  });

  it("keeps Solver card links limited to existing tool routes and leaves legacy tool logic untouched", () => {
    const routeFilesByHref: Record<string, string> = {
      "/journal-entry-solver": "app/journal-entry-solver/page.tsx",
      "/ledger": "app/ledger/page.tsx",
      "/trial-balance": "app/trial-balance/page.tsx",
      "/final-accounts": "app/final-accounts/page.tsx",
      "/bank-reconciliation": "app/bank-reconciliation/page.tsx",
    };
    const solverCardHrefs = solverToolCatalog.flatMap((tool) => (tool.href ? [tool.href] : []));

    expect(solverToolCatalog).toHaveLength(5);
    expect(solverCardHrefs).toEqual([
      "/journal-entry-solver",
      "/ledger",
      "/trial-balance",
      "/final-accounts",
      "/bank-reconciliation",
    ]);
    expect(solverCardHrefs).not.toContain("/platform-preview");

    solverCardHrefs.forEach((href) => {
      const routeSource = readFileSync(routeFilesByHref[href], "utf8");

      expect(routeSource).toContain("export default function");
    });

    expect(readFileSync("app/tools/page.tsx", "utf8")).toContain("export default function ToolsPage");
    expect(readFileSync("app/tools/page.tsx", "utf8")).toContain('fetch("/api/check-entry"');
    expect(readFileSync("app/journal-entry-solver/page.tsx", "utf8")).toContain("StudentAppShell");
    expect(readFileSync("app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx", "utf8")).toContain(
      'fetch("/api/journal-entry-solver"',
    );
    expect(readFileSync("app/ledger/page.tsx", "utf8")).toContain("StudentAppShell");
    expect(readFileSync("app/ledger/_components/LedgerExperience.tsx", "utf8")).toContain("generateLedger");
    expect(readFileSync("app/trial-balance/page.tsx", "utf8")).toContain("StudentAppShell");
    expect(readFileSync("app/trial-balance/_components/TrialBalanceExperience.tsx", "utf8")).toContain(
      "generateTrialBalance",
    );
    expect(readFileSync("app/final-accounts/page.tsx", "utf8")).toContain("StudentAppShell");
    expect(readFileSync("app/final-accounts/_components/FinalAccountsExperience.tsx", "utf8")).toContain(
      "generateFinalAccounts",
    );
    expect(readFileSync("app/bank-reconciliation/page.tsx", "utf8")).toContain("StudentAppShell");
    expect(readFileSync("app/bank-reconciliation/_components/BankReconciliationExperience.tsx", "utf8")).toContain(
      "calculateBankReconciliation",
    );
  });

  it("renders /journal-entry-solver inside the production shell while preserving Explainer links and API boundary", () => {
    const html = renderToStaticMarkup(createElement(JournalEntrySolverPage));
    const hrefs = getHrefValues(html);
    const routeSource = readFileSync("app/journal-entry-solver/page.tsx", "utf8");
    const clientSource = readFileSync("app/journal-entry-solver/_components/JournalEntrySolverExperience.tsx", "utf8");

    expect(journalEntrySolverMetadata).toMatchObject({
      title: "AI Journal Entry Explainer | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/supported-transactions");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("AI Journal Entry Explainer");
    expect(html).toContain("Enter a business transaction");
    expect(html).toContain("Explain Journal Entry");
    expect(html).toContain("Supported Topics");
    expect(html).toContain("Back to Journal Entries");
    expect(html).toContain("Back to Solver");
    expect(html).not.toContain("Back to Home");
    expect(html).not.toContain("/platform-preview");
    expect(routeSource).toContain('StudentAppShell activeItem="solver"');
    expect(clientSource).toContain('fetch("/api/journal-entry-solver"');
    expect(clientSource).toContain('href="/chapters/journal-entries"');
    expect(clientSource).toContain('href="/practice/journal-entries"');
    expect(clientSource).not.toContain('href="/tools"');
    expect(clientSource).toContain('href="/supported-transactions"');
  });

  it("renders /ledger inside the production shell while preserving Ledger links and engine boundary", () => {
    const html = renderToStaticMarkup(createElement(LedgerPage));
    const hrefs = getHrefValues(html);
    const routeSource = readFileSync("app/ledger/page.tsx", "utf8");
    const clientSource = readFileSync("app/ledger/_components/LedgerExperience.tsx", "utf8");

    expect(ledgerMetadata).toMatchObject({
      title: "Ledger Posting | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/supported-transactions");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("Ledger Posting");
    expect(html).toContain("Enter journal entries");
    expect(html).toContain("Generate Ledger");
    expect(html).toContain("Supported Topics");
    expect(html).toContain("Back to Solver");
    expect(html).not.toContain("Back to Home");
    expect(html).not.toContain("/platform-preview");
    expect(routeSource).toContain('StudentAppShell activeItem="solver"');
    expect(clientSource).toContain("generateLedger(journalEntries)");
    expect(clientSource).toContain("overflow-x-auto");
    expect(clientSource).toContain('href="/supported-transactions"');
  });

  it("renders /trial-balance inside the production shell while preserving Trial Balance links and engine boundary", () => {
    const html = renderToStaticMarkup(createElement(TrialBalancePage));
    const hrefs = getHrefValues(html);
    const routeSource = readFileSync("app/trial-balance/page.tsx", "utf8");
    const clientSource = readFileSync("app/trial-balance/_components/TrialBalanceExperience.tsx", "utf8");

    expect(trialBalanceMetadata).toMatchObject({
      title: "Trial Balance | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/supported-transactions");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("Trial Balance");
    expect(html).toContain("Enter journal entries");
    expect(html).toContain("Prepare Trial Balance");
    expect(html).toContain("Supported Topics");
    expect(html).toContain("Back to Solver");
    expect(html).not.toContain("Back to Home");
    expect(html).not.toContain("/platform-preview");
    expect(routeSource).toContain('StudentAppShell activeItem="solver"');
    expect(clientSource).toContain("generateTrialBalance(journalEntries)");
    expect(clientSource).toContain("overflow-x-auto");
    expect(clientSource).toContain('href="/supported-transactions"');
  });

  it("renders /final-accounts inside the production shell while preserving Final Accounts links and engine boundary", () => {
    const html = renderToStaticMarkup(createElement(FinalAccountsPage));
    const hrefs = getHrefValues(html);
    const routeSource = readFileSync("app/final-accounts/page.tsx", "utf8");
    const clientSource = readFileSync("app/final-accounts/_components/FinalAccountsExperience.tsx", "utf8");

    expect(finalAccountsMetadata).toMatchObject({
      title: "Final Accounts | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/supported-transactions");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("Final Accounts");
    expect(html).toContain("Prepare from trial balance");
    expect(html).toContain("Prepare Final Accounts");
    expect(html).toContain("Supported Topics");
    expect(html).toContain("Back to Solver");
    expect(html).not.toContain("Back to Home");
    expect(html).not.toContain("/platform-preview");
    expect(routeSource).toContain('StudentAppShell activeItem="solver"');
    expect(clientSource).toContain("generateFinalAccounts(trialBalanceInput, adjustmentsInput)");
    expect(clientSource).toContain("overflow-x-auto");
    expect(clientSource).toContain('href="/supported-transactions"');
  });

  it("renders /bank-reconciliation inside the production shell while preserving BRS links and engine boundary", () => {
    const html = renderToStaticMarkup(createElement(BankReconciliationPage));
    const hrefs = getHrefValues(html);
    const routeSource = readFileSync("app/bank-reconciliation/page.tsx", "utf8");
    const clientSource = readFileSync("app/bank-reconciliation/_components/BankReconciliationExperience.tsx", "utf8");

    expect(bankReconciliationMetadata).toMatchObject({
      title: "Bank Reconciliation Statement | AccyWise AI",
    });
    expect(html).toContain('id="student-platform-content"');
    expect(getLinkMarkup(html, "/solver")).toContain('aria-current="page"');
    expect(hrefs).toContain("/dashboard");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).toContain("/learn/bank-reconciliation-statement");
    expect(hrefs).toContain("/practice/journal-entries");
    expect(hrefs).not.toContain("/assistant");
    expect(html).toContain("Bank Reconciliation Statement");
    expect(html).toContain("Choose where to start");
    expect(html).toContain("Calculate BRS");
    expect(html).toContain("Working notes");
    expect(html).toContain("Back to Solver");
    expect(html).toContain("Learn BRS");
    expect(html).not.toContain("Back to Home");
    expect(html).not.toContain("/platform-preview");
    expect(routeSource).toContain('StudentAppShell activeItem="solver"');
    expect(clientSource).toContain("calculateBankReconciliation({");
    expect(clientSource).toContain("overflow-x-auto");
    expect(clientSource).toContain('href="/learn/bank-reconciliation-statement"');
    expect(clientSource).toContain('href="/practice/journal-entries"');
    expect(clientSource).toContain('href="/tools"');
  });

  it("keeps the remaining Solver tool routes standalone before later shell migrations", () => {
    const routeCases: Array<{
      route: string;
      component: ComponentType;
      heading: string;
      expectedText: string;
    }> = [
      {
        route: "/tools",
        component: ToolsPage,
        heading: "Learning Tools",
        expectedText: "Journal Entry Checker",
      },
    ];

    for (const { route, component, heading, expectedText } of routeCases) {
      const html = renderToStaticMarkup(createElement(component));

      expect(html, `${route} should render its current standalone UI`).toContain(heading);
      expect(html).toContain(expectedText);
      expect(html).not.toContain('id="student-platform-content"');
      expect(html).not.toContain("/platform-preview");
      expect(html).not.toContain("/assistant");
    }
  });

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
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('href="/solver"');
    expect(html).toContain('href="/practice"');
    expect(html).toContain("Coming soon");
    expect(html).not.toContain('href="/assistant"');
  });

  it("renders the production Chapters route as a minimal chapter catalogue", () => {
    const html = renderToStaticMarkup(createElement(ChaptersPage));
    const simplifiedChapterCopy = [
      {
        title: "Accounting Fundamentals",
        description: "Learn basic accounting terms and equation.",
        status: "Planned",
      },
      {
        title: "Journal Entries",
        description: "Learn debit-credit rules and journal format.",
        status: "Available",
      },
      {
        title: "Ledger",
        description: "Post entries into account-wise format.",
        status: "Planned",
      },
      {
        title: "Trial Balance",
        description: "Check debit-credit totals and balances.",
        status: "Planned",
      },
      {
        title: "Bank Reconciliation Statement",
        description: "Match Cash Book and Bank Statement.",
        status: "Planned",
      },
      {
        title: "Rectification of Errors",
        description: "Correct mistakes and suspense account entries.",
        status: "Later",
      },
      {
        title: "Depreciation, Provisions and Reserves",
        description: "Learn asset and provision adjustments.",
        status: "Later",
      },
      {
        title: "Final Accounts",
        description: "Prepare Trading, P&L, and Balance Sheet.",
        status: "Planned",
      },
      {
        title: "Bills of Exchange",
        description: "Record bills, maturity, and dishonour.",
        status: "Later",
      },
      {
        title: "Not-for-Profit Accounts",
        description: "Prepare receipts, payments, and income statements.",
        status: "Later",
      },
      {
        title: "Partnership Accounts",
        description: "Handle capital, drawings, and appropriations.",
        status: "Later",
      },
      {
        title: "Company Accounts",
        description: "Learn shares, debentures, and company entries.",
        status: "Later",
      },
    ];

    studentPlatformChapterCatalog.forEach((chapter) => {
      expect(html).toContain(chapter.title);
      expect(html).toContain(chapterStatusLabels[chapter.status]);
    });

    simplifiedChapterCopy.forEach((chapter) => {
      expect(html).toContain(chapter.title);
      expect(html).toContain(escapeHtmlText(chapter.description));
      expect(html).toContain(chapter.status);
    });

    expect(html).toContain("<h1");
    expect(html).toContain("Chapters");
    expect(html).toContain("Start with Journal Entries.");
    expect(html).toContain("Available");
    expect(html).toContain("Start Chapter");
    expect(html).toContain('href="/chapters/journal-entries"');
    expect(html).toContain("Planned");
    expect(html).toContain("Later");
    expect(getLinkMarkupWithText(html, "/chapters/journal-entries", "Start Chapter")).toContain("Start Chapter");
    expect(html).not.toContain("Recommended first chapter");
    expect(html).not.toContain("Best place to start");
    expect(html).not.toContain("Begin with Journal Entries");
    expect(html).not.toContain("pilot-ready chapter");
    expect(html).not.toContain("What chapters will include");
    expect(html).not.toContain("Concepts, solved illustrations");
    expect(html).not.toContain("Progress support can be added");
    expect(html).not.toContain("No progress tracking is wired");
    expect(html).not.toContain("Planned chapter");
    expect(html).not.toContain("Later phase");
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
      description: "Start with Journal Entries.",
    });
    expect(journalEntriesMetadata).toMatchObject({
      title: "Journal Entries | Chapters | AccyWise AI",
    });
    expect(subtopicMetadata).toMatchObject({
      title: "Business Transactions | Journal Entries | AccyWise AI",
    });
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
      expect(html).toContain(escapeHtmlText(productionText(subtopic.shortDescription)));
      expect(html).toContain(subtopic.progressLabel);
      expect(html).toContain('id="student-platform-content"');
      expect(getLinkMarkup(html, href)).toContain('aria-current="step"');
      expect(html).not.toContain("/platform-preview");
      expect(html).not.toContain("This preview checker");
      expect(html).not.toContain("Founder review");
      expect(html).not.toContain("Phase 3");
    });
  });

  it("renders a minimal student-friendly Journal Entries overview without pilot/status copy", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);

    expect(html).toContain("Journal Entries");
    expect(html).toContain("Learn debit-credit rules and journal format.");
    expect(
      getLinkMarkupWithText(html, "/chapters/journal-entries#introduction-to-journal-entries", "Start Chapter"),
    ).toContain("Start Chapter");
    expect(html).toContain("View Sections");
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("16 sections");
    expect(html).not.toContain("17 checked practice questions");
    expect(html).not.toContain("Study the chapter step by step.");
    expect(html).not.toContain("Write full entries and check your work.");
    expect(html).not.toContain("Available in this pilot");
    expect(html).not.toContain("Most sections are read-only");
    expect(html).not.toContain("More checking will be added later");
    expect(html).not.toContain("Recommended start");
    expect(html).not.toContain("Open Solver hub");
    expect(html.toLowerCase()).not.toContain("all sections are interactive");
    expect(html.toLowerCase()).not.toContain("all chapters are complete");
  });

  it("uses Journal Entries focus-mode controls instead of permanent desktop chrome", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);
    const sectionSource = readFileSync("app/chapters/journal-entries/JournalEntriesSectionPage.tsx", "utf8");
    const controlsSource = readFileSync("app/chapters/journal-entries/JournalEntriesFocusModeControls.tsx", "utf8");
    const desktopSidebarSource = readFileSync("components/student-platform/DesktopSidebar.tsx", "utf8");

    expect(html).toContain("View Sections");
    expect(html).toContain("Journal Entries chapter outline");
    expect(html).not.toContain("Focus mode");
    expect(html).not.toContain("Open navigation or sections only when you need them.");
    expect(sectionSource).toContain('<StudentAppShell activeItem="chapters" focusMode>');
    expect(sectionSource).toContain("JournalEntriesFocusModeControls");
    expect(sectionSource).not.toContain("<ChapterOutline");
    expect(controlsSource).not.toContain(">Menu<");
    expect(controlsSource).not.toContain("studentPlatformNavigationItems");
    expect(controlsSource).not.toContain('href="/journal-entry-solver"');
    expect(controlsSource).not.toContain('href="/practice/journal-entries"');
    expect(desktopSidebarSource).not.toContain("Phase 4H");
    expect(desktopSidebarSource).not.toContain("Dashboard, Solver, and Practice hub are live");
  });

  it("renders all sixteen Journal Entries sections with simplified study-guide copy and safe next steps", () => {
    const polishedSections = [
      {
        slug: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
        title: "Introduction to Journal Entries and Journal Format",
        rule: "Debit and credit must always balance",
        actionHref: "/chapters/journal-entries#practice-it-yourself",
        actionText: "Practice It Yourself",
      },
      {
        slug: JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
        title: "Business Transactions",
        rule: "Record only business events measurable in money",
        actionHref: "/chapters/journal-entries/accounts-affected",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
        title: "Accounts Affected",
        rule: "Name accounts before choosing Dr. or To",
        actionHref: "/chapters/journal-entries/types-of-accounts",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
        title: "Types of Accounts",
        rule: "Classify the account, not the sentence",
        actionHref: "/chapters/journal-entries/debit-and-credit-rules",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
        title: "Debit and Credit Rules",
        rule: "Account nature plus effect decides the side",
        actionHref: "/chapters/journal-entries/journal-format-and-narration",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
        title: "Journal Format and Narration",
        rule: "Format shows the accounting logic clearly",
        actionHref: "/chapters/journal-entries/cash-and-bank-transactions",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
        title: "Cash and Bank Transactions",
        rule: "Cash in hand and bank balance are different",
        actionHref: "/chapters/journal-entries/capital",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
        title: "Capital",
        rule: "Capital increases the owner's claim",
        actionHref: "/chapters/journal-entries/drawings",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
        title: "Drawings",
        rule: "Personal use creates Drawings, not expense",
        actionHref: "/chapters/journal-entries/purchases",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
        title: "Purchases",
        rule: "Purchases means goods bought for resale",
        actionHref: "/chapters/journal-entries/sales",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_SALES_SECTION_SLUG,
        title: "Sales",
        rule: "Sales means goods sold in normal trading",
        actionHref: "/chapters/journal-entries/expenses",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
        title: "Expenses",
        rule: "Business expenses are debited when incurred",
        actionHref: "/chapters/journal-entries/income",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
        title: "Income",
        rule: "Income is credited when earned",
        actionHref: "/chapters/journal-entries/assets-and-liabilities",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
        title: "Assets and Liabilities",
        rule: "Assets increase by debit; liabilities increase by credit",
        actionHref: "/chapters/journal-entries/mixed-simple-entries",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
        title: "Mixed Simple Entries",
        rule: "Reason first, then write the entry",
        actionHref: "/chapters/journal-entries/chapter-recap-and-practice",
        actionText: "Next Section",
      },
      {
        slug: JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
        title: "Chapter Recap and Practice",
        rule: "Use the full journal-entry method every time",
        actionHref: undefined,
        actionText: undefined,
      },
    ] as const;

    expect(polishedSections).toHaveLength(journalEntriesChapter.subtopics.length);
    expect(polishedSections.map((section) => section.slug)).toEqual(
      journalEntriesChapter.subtopics.map((subtopic) => subtopic.slug),
    );

    polishedSections.forEach(({ actionHref, actionText, rule, slug, title }) => {
      const html = renderProductionSection(slug);

      expect(html).toContain("Study guide");
      expect(html).toContain(`Before you study ${title}`);
      expect(html).toContain(escapeHtmlText("What you'll learn"));
      expect(html).toContain("Common mistake");
      expect(html).toContain("Rule");
      expect(html).toContain(escapeHtmlText(rule));
      expect(html).toContain("Example tip");
      expect(html).toContain("Study the reasoning");
      if (actionHref && actionText) {
        expect(getLinkMarkupWithText(html, actionHref, actionText)).toContain(actionText);
      }
      expectNoJournalEntriesExternalActionLinks(html);
      expect(html).not.toContain("Section pilot guide");
      expect(html).not.toContain("Pilot section");
    });
  });

  it("removes the old how-to-use and status-heavy Journal Entries chapter copy", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);

    expect(html).not.toContain("How to use this chapter");
    expect(html).not.toContain("Recommended path");
    expect(html).not.toContain("Read the sections in order.");
    expect(html).not.toContain("Use Journal Entry Explainer if you get stuck.");
    expect(html).not.toContain("Use beginner practice for revision after learning.");
    expect(html).not.toContain("Current availability");
    expect(html).not.toContain("Progress support");
    expect(html).not.toContain("Later phase");
    expect(html).not.toContain("/platform-preview");
  });

  it("marks only practice-enabled Journal Entries outline sections without read-only/status clutter", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);
    const practiceBadgeCount = html.match(/2 practice checks/g)?.length ?? 0;

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toHaveLength(2);
    expect(journalEntriesChapter.subtopics[1].practiceQuestionIds).toEqual([
      PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[2].practiceQuestionIds).toEqual([
      BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[3].practiceQuestionIds).toEqual([
      RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[4].practiceQuestionIds).toEqual([
      PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[5].practiceQuestionIds).toEqual([
      PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[6].practiceQuestionIds).toEqual([
      DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[9].practiceQuestionIds).toEqual([
      PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[10].practiceQuestionIds).toEqual([
      SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[11].practiceQuestionIds).toEqual([
      PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[12].practiceQuestionIds).toEqual([
      RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[13].practiceQuestionIds).toEqual([
      BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[14].practiceQuestionIds).toEqual([
      PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[15].practiceQuestionIds).toEqual([
      BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(html).toContain("2 practice checks");
    expect(html).toContain("1 practice check");
    expect(practiceBadgeCount).toBeGreaterThanOrEqual(1);
    expect(html).not.toContain("Read-only");
    expect(html).not.toContain("Available");
    expect(html).toContain("Business Transactions");
    expect(html).toContain("Accounts Affected");
    expect(html).toContain("Chapter outline");
  });

  it("uses compact production next/support links across the sixteen section routes", () => {
    journalEntriesChapter.subtopics.forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);

      if (subtopic.nextSection) {
        expect(getLinkMarkupWithText(html, getProductionSectionHref(subtopic.nextSection.slug), "Next Section")).toContain(
          "Next Section",
        );
      } else {
        expect(getLinkMarkupWithText(html, getProductionSectionHref(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG), "Review Chapter")).toContain(
          "Review Chapter",
        );
      }

      expectNoJournalEntriesExternalActionLinks(html);
      expect(html).not.toContain("Previous ");
      expect(html).not.toContain("Continue to ");
      expect(html).not.toContain("Back to Chapters");
      expect(html).not.toContain("Review from Beginning");
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

  it("renders exactly the two original production Journal Entries practice checkers in Section 1", () => {
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
    expectNoJournalEntriesPreCheckHints(html);
    const checkerForms = getJournalEntryCheckerForms(html);
    expect(checkerForms).toHaveLength(2);
    expect(html).toContain(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expect(html).toContain(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    checkerForms.forEach((formMarkup) => {
      expect(formMarkup).toContain("Debit account");
      expect(formMarkup).toContain("Credit account");
      expect(formMarkup).toContain("Amount");
      expect(formMarkup).toContain("Narration");
      expect(formMarkup).not.toContain("Date");
      expect(formMarkup).not.toContain("L.F.");
      expect(formMarkup).not.toContain("Entry row");
      expect(formMarkup).not.toContain("Remove row");
      expect(formMarkup).not.toContain("Add row");
      expect(formMarkup).not.toContain("Total Debit");
      expect(formMarkup).not.toContain("Total Credit");
    });
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Only these 2 in-chapter checks are live in this section right now.");
    expect(html).not.toContain("Interactive answer checking for this chapter will be enabled in the next controlled migration step.");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("Correct Answer");
    expect(source).toContain("checkJournalEntriesPracticeAnswer");
    expect(source).toContain("revealJournalEntriesPracticeCorrectAnswer");
    expect(source).toContain("JournalEntryPracticeEditor");
    expect(source).toContain("Read the feedback in this order: accounts, debit/credit side, amount, totals, and narration.");
    expect(source).toContain("If you are stuck, reread the rule and then try this same checker again.");
    expect(source).toContain("const [guidedEntry, setGuidedEntry]");
    expect(source).toContain("createGuidedAttempt(question.id, guidedEntry, narration)");
    expect(source).toContain("formatCreditParticulars(guidedEntry.creditAccount)");
    expect(source).toContain('replace(/^\\s*to\\b\\s*/i, "").trim()');
    expect(source).not.toContain("getAccountInputValue");
    expect(source).not.toContain("journal-entry-answer-keys.server");
    expect(source).not.toContain("Cash A/c Dr.");
    expect(source).not.toContain("To Sales A/c");
    expect(source).not.toContain("Salary A/c Dr.");
    expect(source).not.toContain("To Bank A/c");
    expect(source).not.toContain("/platform-preview");
  });

  it("renders the electricity-bill-paid-in-cash checker in the Business Transactions section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Paid electricity bill in cash Rs 1,200. Pass the journal entry.");
    expect(html).toContain(PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the stationery-bought-for-cash checker in the Accounts Affected section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Bought stationery for cash Rs 800. Pass the journal entry.");
    expect(html).toContain(BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the fees-received-in-cash checker in the Types of Accounts section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Received fees in cash Rs 4,000. Pass the journal entry.");
    expect(html).toContain(RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the wages-paid-in-cash checker in the Debit and Credit Rules section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Paid wages in cash Rs 2,500. Pass the journal entry.");
    expect(html).toContain(PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the office-rent-paid-by-bank checker in the Journal Format and Narration section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Paid office rent by bank Rs 4,000. Pass the journal entry.");
    expect(html).toContain(PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the cash-deposited-into-bank checker in the Cash and Bank Transactions section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Deposited cash into bank Rs 5,000. Pass the journal entry.");
    expect(html).toContain(DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the cash-capital checker in the Capital section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Started business with cash Rs 50,000. Pass the journal entry.");
    expect(html).toContain(STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the cash-drawings checker in the Drawings section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Withdrew cash for personal use Rs 5,000. Pass the journal entry.");
    expect(html).toContain(WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the purchased-goods-for-cash checker in the Purchases section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Bought goods for cash Rs 10,000. Pass the journal entry.");
    expect(html).toContain(PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Only this in-chapter check is live in this section right now.");
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the goods-sold-by-bank checker in the Sales section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_SALES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Sold goods by bank Rs 6,000. Pass the journal entry.");
    expect(html).toContain(SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the rent-paid-by-cash checker in the Expenses section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Paid rent by cash Rs 3,000. Pass the journal entry.");
    expect(html).toContain(PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the commission-received-in-cash checker in the Income section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INCOME_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Received commission in cash Rs 2,000. Pass the journal entry.");
    expect(html).toContain(RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the furniture-bought-for-cash checker in the Assets and Liabilities section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Bought furniture for cash Rs 15,000. Pass the journal entry.");
    expect(html).toContain(BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the advertising-paid-by-bank checker in the Mixed Simple Entries section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Paid advertising by bank Rs 3,500. Pass the journal entry.");
    expect(html).toContain(PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("renders the machinery-bought-by-bank checker in the Chapter Recap and Practice section", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG);

    expect(html).toContain("Practice 1 of 1");
    expect(html).toContain("Bought machinery by bank Rs 20,000. Pass the journal entry.");
    expect(html).toContain(BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID);
    expectNoJournalEntriesPreCheckHints(html);
    expect(html.match(/Check Answer/g)).toHaveLength(1);
    expect(html.match(/Reset Answer/g)).toHaveLength(1);
    expectNoJournalEntriesExternalActionLinks(html);
    expect(html).not.toContain("Practice 2 of 1");
  });

  it("keeps every production Journal Entries section covered by the final seventeen checkers", () => {
    const checkerCounts = journalEntriesChapter.subtopics.map((subtopic) => subtopic.practiceQuestionIds?.length ?? 0);

    expect(checkerCounts).toEqual([2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(checkerCounts.reduce((total, count) => total + count, 0)).toBe(17);
    journalEntriesChapter.subtopics.forEach((subtopic) => {
      const html = renderProductionSection(subtopic.slug);

      expect(html).toContain("Check Answer");
      expectNoJournalEntriesPreCheckHints(html);
      expect(getJournalEntryCheckerForms(html)).toHaveLength(subtopic.practiceQuestionIds?.length ?? 0);
      getJournalEntryCheckerForms(html).forEach((formMarkup) => {
        expect(formMarkup).toContain("Debit account");
        expect(formMarkup).toContain("Credit account");
        expect(formMarkup).toContain("Amount");
        expect(formMarkup).toContain("Narration");
        expect(formMarkup).not.toContain("Date");
        expect(formMarkup).not.toContain("L.F.");
        expect(formMarkup).not.toContain("Entry row");
        expect(formMarkup).not.toContain("Remove row");
        expect(formMarkup).not.toContain("Add row");
      });
      expect(html).not.toContain("Show Correct Answer");
    });
  });

  it("links the production recap back to the seventeen interactive practice questions", () => {
    const html = renderProductionSection("chapter-recap-and-practice");
    const reviewChallengeDetails = html.match(/<details class="group rounded-2xl/g) ?? [];

    expect(html).toContain("Interactive Practice Available");
    expect(html).toContain("Sold goods for cash ₹12,000");
    expect(html).toContain("Paid salary by bank ₹8,000");
    expect(html).toContain("Paid electricity bill in cash Rs 1,200");
    expect(html).toContain("Bought stationery for cash Rs 800");
    expect(html).toContain("Received fees in cash Rs 4,000");
    expect(html).toContain("Paid wages in cash Rs 2,500");
    expect(html).toContain("Paid office rent by bank Rs 4,000");
    expect(html).toContain("Deposited cash into bank Rs 5,000");
    expect(html).toContain("Started business with cash Rs 50,000");
    expect(html).toContain("Withdrew cash for personal use Rs 5,000");
    expect(html).toContain("Bought goods for cash Rs 10,000");
    expect(html).toContain("Sold goods by bank Rs 6,000");
    expect(html).toContain("Paid rent by cash Rs 3,000");
    expect(html).toContain("Received commission in cash Rs 2,000");
    expect(html).toContain("Bought furniture for cash Rs 15,000");
    expect(html).toContain("Paid advertising by bank Rs 3,500");
    expect(html).toContain("Bought machinery by bank Rs 20,000");
    expect(html).toContain('href="/chapters/journal-entries#practice-it-yourself"');
    expect(html).toContain("Practice the interactive questions");
    expect(reviewChallengeDetails).toHaveLength(8);
    expect(html).toContain("Mastery self-check");
    expect(html).not.toContain("Interactive chapter practice will be enabled after the production checker migration is approved.");
    expect(html).toContain("Check Answer");
    expect(html).toContain("practice-feedback-");
    expect(html).not.toContain('href="/platform-preview/chapters/journal-entries#practice-it-yourself"');
  });

  it("keeps production answer checking server-controlled for exactly the seventeen approved question IDs", async () => {
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
    const electricityResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Electricity A/c Dr.",
        debitAmount: "1200",
        creditAccount: "To Cash A/c",
        creditAmount: "1200",
        totalDebit: "1200",
        totalCredit: "1200",
        narration: "Being electricity bill paid in cash.",
      }),
    );
    const electricityWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Drawings A/c Dr.",
        debitAmount: "1200",
        creditAccount: "To Bank A/c",
        creditAmount: "1200",
        totalDebit: "1200",
        totalCredit: "1200",
        narration: "Being electricity bill paid in cash.",
      }),
    );
    const stationeryResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Stationery A/c Dr.",
        debitAmount: "800",
        creditAccount: "To Cash A/c",
        creditAmount: "800",
        totalDebit: "800",
        totalCredit: "800",
        narration: "Being stationery purchased for cash.",
      }),
    );
    const stationeryWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Purchases A/c Dr.",
        debitAmount: "800",
        creditAccount: "To Bank A/c",
        creditAmount: "800",
        totalDebit: "800",
        totalCredit: "800",
        narration: "Being stationery purchased for cash.",
      }),
    );
    const feesResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "4000",
        creditAccount: "To Fees Received A/c",
        creditAmount: "4000",
        totalDebit: "4000",
        totalCredit: "4000",
        narration: "Being fees received in cash.",
      }),
    );
    const feesWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "4000",
        creditAccount: "To Sales A/c",
        creditAmount: "4000",
        totalDebit: "4000",
        totalCredit: "4000",
        narration: "Being fees received in cash.",
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
    const purchasedGoodsResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Purchases A/c Dr.",
        debitAmount: "10000",
        creditAccount: "To Cash A/c",
        creditAmount: "10000",
        totalDebit: "10000",
        totalCredit: "10000",
        narration: "Being goods purchased for cash.",
      }),
    );
    const startedBusinessResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "50000",
        creditAccount: "To Capital A/c",
        creditAmount: "50000",
        totalDebit: "50000",
        totalCredit: "50000",
        narration: "Being business started with cash as capital.",
      }),
    );
    const startedBusinessWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "50000",
        creditAccount: "To Sales A/c",
        creditAmount: "50000",
        totalDebit: "50000",
        totalCredit: "50000",
        narration: "Being business started with cash as capital.",
      }),
    );
    const drawingsResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
        debitAccount: "Drawings A/c Dr.",
        debitAmount: "5000",
        creditAccount: "To Cash A/c",
        creditAmount: "5000",
        totalDebit: "5000",
        totalCredit: "5000",
        narration: "Being cash withdrawn for personal use.",
      }),
    );
    const drawingsWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
        debitAccount: "Salary A/c Dr.",
        debitAmount: "5000",
        creditAccount: "To Bank A/c",
        creditAmount: "5000",
        totalDebit: "5000",
        totalCredit: "5000",
        narration: "Being cash withdrawn for personal use.",
      }),
    );
    const purchasedGoodsWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Goods A/c Dr.",
        debitAmount: "10000",
        creditAccount: "To Bank A/c",
        creditAmount: "10000",
        totalDebit: "10000",
        totalCredit: "10000",
        narration: "Being goods purchased for cash.",
      }),
    );
    const paidRentResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Rent A/c Dr.",
        debitAmount: "3000",
        creditAccount: "To Cash A/c",
        creditAmount: "3000",
        totalDebit: "3000",
        totalCredit: "3000",
        narration: "Being rent paid in cash.",
      }),
    );
    const paidRentWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Salary A/c Dr.",
        debitAmount: "3000",
        creditAccount: "To Bank A/c",
        creditAmount: "3000",
        totalDebit: "3000",
        totalCredit: "3000",
        narration: "Being rent paid in cash.",
      }),
    );
    const wagesResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Wages A/c Dr.",
        debitAmount: "2500",
        creditAccount: "To Cash A/c",
        creditAmount: "2500",
        totalDebit: "2500",
        totalCredit: "2500",
        narration: "Being wages paid in cash.",
      }),
    );
    const wagesWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Salary A/c Dr.",
        debitAmount: "2500",
        creditAccount: "To Bank A/c",
        creditAmount: "2500",
        totalDebit: "2500",
        totalCredit: "2500",
        narration: "Being wages paid in cash.",
      }),
    );
    const officeRentResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Office Rent A/c Dr.",
        debitAmount: "4000",
        creditAccount: "To Bank A/c",
        creditAmount: "4000",
        totalDebit: "4000",
        totalCredit: "4000",
        narration: "Being office rent paid by bank.",
      }),
    );
    const officeRentWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Prepaid Rent A/c Dr.",
        debitAmount: "4000",
        creditAccount: "To Cash A/c",
        creditAmount: "4000",
        totalDebit: "4000",
        totalCredit: "4000",
        narration: "Being office rent paid by bank.",
      }),
    );
    const commissionResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "2000",
        creditAccount: "To Commission A/c",
        creditAmount: "2000",
        totalDebit: "2000",
        totalCredit: "2000",
        narration: "Being commission received in cash.",
      }),
    );
    const commissionWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "2000",
        creditAccount: "To Sales A/c",
        creditAmount: "2000",
        totalDebit: "2000",
        totalCredit: "2000",
        narration: "Being commission received in cash.",
      }),
    );
    const furnitureResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Furniture A/c Dr.",
        debitAmount: "15000",
        creditAccount: "To Cash A/c",
        creditAmount: "15000",
        totalDebit: "15000",
        totalCredit: "15000",
        narration: "Being furniture purchased for cash.",
      }),
    );
    const furnitureWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
        debitAccount: "Purchases A/c Dr.",
        debitAmount: "15000",
        creditAccount: "To Bank A/c",
        creditAmount: "15000",
        totalDebit: "15000",
        totalCredit: "15000",
        narration: "Being furniture purchased for cash.",
      }),
    );
    const bankSaleResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "6000",
        creditAccount: "To Sales A/c",
        creditAmount: "6000",
        totalDebit: "6000",
        totalCredit: "6000",
        narration: "Being goods sold through bank.",
      }),
    );
    const bankSaleWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Cash A/c Dr.",
        debitAmount: "6000",
        creditAccount: "To Purchases A/c",
        creditAmount: "6000",
        totalDebit: "6000",
        totalCredit: "6000",
        narration: "Being goods sold through bank.",
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
    const depositResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "5000",
        creditAccount: "To Cash A/c",
        creditAmount: "5000",
        totalDebit: "5000",
        totalCredit: "5000",
        narration: "Being cash deposited into bank.",
      }),
    );
    const depositWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Bank A/c Dr.",
        debitAmount: "5000",
        creditAccount: "To Sales A/c",
        creditAmount: "5000",
        totalDebit: "5000",
        totalCredit: "5000",
        narration: "Being cash deposited into bank.",
      }),
    );
    const advertisingResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Advertising A/c Dr.",
        debitAmount: "3500",
        creditAccount: "To Bank A/c",
        creditAmount: "3500",
        totalDebit: "3500",
        totalCredit: "3500",
        narration: "Being advertising paid by bank.",
      }),
    );
    const advertisingWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Drawings A/c Dr.",
        debitAmount: "3500",
        creditAccount: "To Cash A/c",
        creditAmount: "3500",
        totalDebit: "3500",
        totalCredit: "3500",
        narration: "Being advertising paid by bank.",
      }),
    );
    const machineryResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Machinery A/c Dr.",
        debitAmount: "20000",
        creditAccount: "To Bank A/c",
        creditAmount: "20000",
        totalDebit: "20000",
        totalCredit: "20000",
        narration: "Being machinery purchased by bank.",
      }),
    );
    const machineryWrongAccountResult = await checkJournalEntriesPracticeAnswer(
      createPracticeAttempt({
        questionId: BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
        debitAccount: "Purchases A/c Dr.",
        debitAmount: "20000",
        creditAccount: "To Cash A/c",
        creditAmount: "20000",
        totalDebit: "20000",
        totalCredit: "20000",
        narration: "Being machinery purchased by bank.",
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
    const electricityReveal = await revealJournalEntriesPracticeCorrectAnswer(
      PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
    );
    const stationeryReveal = await revealJournalEntriesPracticeCorrectAnswer(BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID);
    const feesReveal = await revealJournalEntriesPracticeCorrectAnswer(RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID);
    const purchasedGoodsReveal = await revealJournalEntriesPracticeCorrectAnswer(PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    const startedBusinessReveal = await revealJournalEntriesPracticeCorrectAnswer(STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID);
    const drawingsReveal = await revealJournalEntriesPracticeCorrectAnswer(WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID);
    const paidRentReveal = await revealJournalEntriesPracticeCorrectAnswer(PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID);
    const wagesReveal = await revealJournalEntriesPracticeCorrectAnswer(PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID);
    const officeRentReveal = await revealJournalEntriesPracticeCorrectAnswer(PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID);
    const commissionReveal = await revealJournalEntriesPracticeCorrectAnswer(RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID);
    const furnitureReveal = await revealJournalEntriesPracticeCorrectAnswer(BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID);
    const bankSaleReveal = await revealJournalEntriesPracticeCorrectAnswer(SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID);
    const depositReveal = await revealJournalEntriesPracticeCorrectAnswer(DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID);
    const advertisingReveal = await revealJournalEntriesPracticeCorrectAnswer(PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID);
    const machineryReveal = await revealJournalEntriesPracticeCorrectAnswer(BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID);
    const unsupportedReveal = await revealJournalEntriesPracticeCorrectAnswer("unsupported-production-question");

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[1].practiceQuestionIds).toEqual([
      PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[2].practiceQuestionIds).toEqual([
      BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[3].practiceQuestionIds).toEqual([
      RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[4].practiceQuestionIds).toEqual([
      PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[5].practiceQuestionIds).toEqual([
      PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[6].practiceQuestionIds).toEqual([
      DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[7].practiceQuestionIds).toEqual([
      STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[8].practiceQuestionIds).toEqual([
      WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[9].practiceQuestionIds).toEqual([
      PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[10].practiceQuestionIds).toEqual([
      SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[11].practiceQuestionIds).toEqual([
      PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[12].practiceQuestionIds).toEqual([
      RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[13].practiceQuestionIds).toEqual([
      BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[14].practiceQuestionIds).toEqual([
      PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[15].practiceQuestionIds).toEqual([
      BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(
      journalEntriesChapter.subtopics.flatMap((subtopic) => subtopic.practiceQuestionIds ?? []),
    ).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
      PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
      BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
      RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
      PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
      PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
      DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
      STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
      WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
      PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
      PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
      RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
      BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
      BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(soldGoodsResult.status).toBe("correct");
    expect(paidSalaryResult.status).toBe("correct");
    expect(electricityResult.status).toBe("correct");
    expect(stationeryResult.status).toBe("correct");
    expect(feesResult.status).toBe("correct");
    expect(purchasedGoodsResult.status).toBe("correct");
    expect(wagesResult.status).toBe("correct");
    expect(officeRentResult.status).toBe("correct");
    expect(depositResult.status).toBe("correct");
    expect(startedBusinessResult.status).toBe("correct");
    expect(drawingsResult.status).toBe("correct");
    expect(bankSaleResult.status).toBe("correct");
    expect(paidRentResult.status).toBe("correct");
    expect(commissionResult.status).toBe("correct");
    expect(furnitureResult.status).toBe("correct");
    expect(advertisingResult.status).toBe("correct");
    expect(machineryResult.status).toBe("correct");
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
    expect(electricityWrongAccountResult.status).toBe("incorrect");
    expect(electricityWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Drawings A/c is not used because this is a business electricity bill.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
    );
    expect(stationeryWrongAccountResult.status).toBe("incorrect");
    expect(stationeryWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Purchases A/c is not used because the transaction specifically says stationery.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
    );
    expect(feesWrongAccountResult.status).toBe("incorrect");
    expect(feesWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Bank A/c is not used because the transaction says cash.",
        "Sales A/c is not used because the transaction says fees received, not goods sold.",
      ]),
    );
    expect(purchasedGoodsWrongAccountResult.status).toBe("incorrect");
    expect(purchasedGoodsWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Goods A/c is not used here because goods bought for resale are recorded through Purchases A/c.",
        "Bank A/c is not used because the transaction states cash.",
      ]),
    );
    expect(paidRentWrongAccountResult.status).toBe("incorrect");
    expect(paidRentWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Salary A/c is a different expense and is not used here.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
    );
    expect(wagesWrongAccountResult.status).toBe("incorrect");
    expect(wagesWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Salary A/c is a different expense and is not used here.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
    );
    expect(officeRentWrongAccountResult.status).toBe("incorrect");
    expect(officeRentWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Prepaid Rent A/c is not used because this checker is only a simple paid rent entry.",
        "Cash A/c is not used because the transaction says bank.",
      ]),
    );
    expect(depositWrongAccountResult.status).toBe("incorrect");
    expect(depositWrongAccountResult.errors).toEqual(
      expect.arrayContaining(["Sales A/c is not used because cash deposited into bank is not a sale."]),
    );
    expect(commissionWrongAccountResult.status).toBe("incorrect");
    expect(commissionWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Bank A/c is not used because the transaction says cash.",
        "Sales A/c is not used because the transaction says commission, not goods sold.",
      ]),
    );
    expect(furnitureWrongAccountResult.status).toBe("incorrect");
    expect(furnitureWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Purchases A/c is not used because furniture is an asset for business use.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
    );
    expect(advertisingWrongAccountResult.status).toBe("incorrect");
    expect(advertisingWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Drawings A/c is not used because advertising is a business expense, not personal use.",
        "Cash A/c is not used because the transaction says bank.",
      ]),
    );
    expect(machineryWrongAccountResult.status).toBe("incorrect");
    expect(machineryWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Purchases A/c is not used because machinery is a business asset, not goods for resale.",
        "Cash A/c is not used because the transaction says bank.",
      ]),
    );
    expect(bankSaleWrongAccountResult.status).toBe("incorrect");
    expect(bankSaleWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Cash A/c is not used because the transaction says bank.",
        "Purchases A/c is not used when goods are sold.",
      ]),
    );
    expect(startedBusinessWrongAccountResult.status).toBe("incorrect");
    expect(startedBusinessWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Bank A/c is not used because the transaction says cash.",
        "Sales A/c is not used because capital is not income from goods sold.",
      ]),
    );
    expect(drawingsWrongAccountResult.status).toBe("incorrect");
    expect(drawingsWrongAccountResult.errors).toEqual(
      expect.arrayContaining([
        "Salary A/c is a business expense and is not used for personal withdrawal.",
        "Bank A/c is not used because the transaction says cash.",
      ]),
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
    expect(electricityReveal).toMatchObject({
      questionId: PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being electricity bill paid in cash.",
    });
    expect(electricityReveal.lines.map((line) => line.particulars)).toEqual(["Electricity A/c Dr.", "To Cash A/c"]);
    expect(stationeryReveal).toMatchObject({
      questionId: BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being stationery purchased for cash.",
    });
    expect(stationeryReveal.lines.map((line) => line.particulars)).toEqual(["Stationery A/c Dr.", "To Cash A/c"]);
    expect(feesReveal).toMatchObject({
      questionId: RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being fees received in cash.",
    });
    expect(feesReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Fees Received A/c"]);
    expect(purchasedGoodsReveal).toMatchObject({
      questionId: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being goods purchased for cash.",
    });
    expect(purchasedGoodsReveal.lines.map((line) => line.particulars)).toEqual(["Purchases A/c Dr.", "To Cash A/c"]);
    expect(purchasedGoodsReveal.lines.map((line) => line.particulars)).not.toContain("To Bank A/c");
    expect(startedBusinessReveal).toMatchObject({
      questionId: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being business started with cash as capital.",
    });
    expect(startedBusinessReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Capital A/c"]);
    expect(startedBusinessReveal.lines.map((line) => line.particulars)).not.toContain("To Sales A/c");
    expect(drawingsReveal).toMatchObject({
      questionId: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being cash withdrawn for personal use.",
    });
    expect(drawingsReveal.lines.map((line) => line.particulars)).toEqual(["Drawings A/c Dr.", "To Cash A/c"]);
    expect(drawingsReveal.lines.map((line) => line.particulars)).not.toContain("To Bank A/c");
    expect(paidRentReveal).toMatchObject({
      questionId: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being rent paid in cash.",
    });
    expect(paidRentReveal.lines.map((line) => line.particulars)).toEqual(["Rent A/c Dr.", "To Cash A/c"]);
    expect(wagesReveal).toMatchObject({
      questionId: PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being wages paid in cash.",
    });
    expect(wagesReveal.lines.map((line) => line.particulars)).toEqual(["Wages A/c Dr.", "To Cash A/c"]);
    expect(officeRentReveal).toMatchObject({
      questionId: PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being office rent paid by bank.",
    });
    expect(officeRentReveal.lines.map((line) => line.particulars)).toEqual(["Office Rent A/c Dr.", "To Bank A/c"]);
    expect(commissionReveal).toMatchObject({
      questionId: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being commission received in cash.",
    });
    expect(commissionReveal.lines.map((line) => line.particulars)).toEqual(["Cash A/c Dr.", "To Commission A/c"]);
    expect(furnitureReveal).toMatchObject({
      questionId: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being furniture purchased for cash.",
    });
    expect(furnitureReveal.lines.map((line) => line.particulars)).toEqual(["Furniture A/c Dr.", "To Cash A/c"]);
    expect(bankSaleReveal).toMatchObject({
      questionId: SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being goods sold through bank.",
    });
    expect(bankSaleReveal.lines.map((line) => line.particulars)).toEqual(["Bank A/c Dr.", "To Sales A/c"]);
    expect(depositReveal).toMatchObject({
      questionId: DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being cash deposited into bank.",
    });
    expect(depositReveal.lines.map((line) => line.particulars)).toEqual(["Bank A/c Dr.", "To Cash A/c"]);
    expect(advertisingReveal).toMatchObject({
      questionId: PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being advertising paid by bank.",
    });
    expect(advertisingReveal.lines.map((line) => line.particulars)).toEqual(["Advertising A/c Dr.", "To Bank A/c"]);
    expect(machineryReveal).toMatchObject({
      questionId: BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
      available: true,
      narration: "Being machinery purchased by bank.",
    });
    expect(machineryReveal.lines.map((line) => line.particulars)).toEqual(["Machinery A/c Dr.", "To Bank A/c"]);
    expect(unsupportedReveal).toMatchObject({
      questionId: "unsupported-production-question",
      available: false,
      lines: [],
      narration: "",
    });
  });

  it("keeps preview checker behavior isolated with the Phase 6T question IDs", () => {
    const previewHtml = renderToStaticMarkup(createElement(JournalEntriesChapterPreviewPage));
    const previewActionsSource = readFileSync("app/platform-preview/chapters/journal-entries/actions.ts", "utf8");
    const previewEditorSource = readFileSync("components/learning-platform/JournalEntryPracticeEditor.tsx", "utf8");

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toEqual([
      SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
      PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[1].practiceQuestionIds).toEqual([
      PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[2].practiceQuestionIds).toEqual([
      BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[3].practiceQuestionIds).toEqual([
      RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[4].practiceQuestionIds).toEqual([
      PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[5].practiceQuestionIds).toEqual([
      PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[6].practiceQuestionIds).toEqual([
      DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[7].practiceQuestionIds).toEqual([
      STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[8].practiceQuestionIds).toEqual([
      WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[9].practiceQuestionIds).toEqual([
      PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[10].practiceQuestionIds).toEqual([
      SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[11].practiceQuestionIds).toEqual([
      PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[12].practiceQuestionIds).toEqual([
      RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[13].practiceQuestionIds).toEqual([
      BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[14].practiceQuestionIds).toEqual([
      PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(journalEntriesChapter.subtopics[15].practiceQuestionIds).toEqual([
      BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
    ]);
    expect(previewHtml).toContain("Check Answer");
    expect(previewActionsSource).toContain("journal-entry-answer-keys.server");
    expect(previewEditorSource).toContain("Show Correct Answer");
  });

  it("renders the simplified homepage with three hero action choices", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const hrefs = getHrefValues(html);

    expect(homeMetadata).toMatchObject({
      title: "AccyWise AI — Interactive Accountancy Learning",
      description: "Learn Accountancy by doing with chapters, practice checks, and Solver tools.",
    });
    expect(html).toContain("AccyWise AI");
    expect(html).toContain("Learn Accountancy by Doing");
    expect(html).toContain("Start with chapters, practise with checks, use Solver when stuck.");
    expect(getLinkMarkupWithText(html, "/chapters", "Chapters")).toContain("Chapters");
    expect(getLinkMarkupWithText(html, "/solver", "Solver")).toContain("Solver");
    expect(getLinkMarkupWithText(html, "/practice", "Practice")).toContain("Practice");
    expect(html).toContain("How It Works");
    expect(html).toContain("1.");
    expect(html).toContain("Read a chapter");
    expect(html).toContain("2.");
    expect(html).toContain("Try Practice");
    expect(html).toContain("3.");
    expect(html).toContain("Use Solver if stuck");
    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/chapters/journal-entries");
    expect(hrefs).not.toContain("/dashboard");
    expect(hrefs).not.toContain("/assistant");
    expect(hrefs).not.toContain("/tools");
    expect(hrefs).not.toContain("/how-to-use");
    expect(hrefs).not.toContain("/supported-transactions");
    expect(html).not.toContain('aria-label="Primary platform navigation"');
    expect(html).not.toContain("Dashboard");
    expect(html).not.toContain("AI Assistant");
    expect(html).not.toContain("Coming soon");
    expect(html).not.toContain("Recommended first path");
    expect(html).not.toContain("Recommended first chapter");
    expect(html).not.toContain("The platform");
    expect(html).not.toContain("Five clear areas");
    expect(html).not.toContain("Explore Chapters");
    expect(html).not.toContain("Use Solver Tools");
    expect(html).not.toContain("Open Practice");
    expect(html).not.toContain("Open Dashboard");
    expect(html).not.toContain("No live route yet");
    expect(html).not.toContain("Start with Journal Entries today");
    expect(html).not.toContain("Built for commerce students");
    expect(html).not.toContain("Start Journal Entries");
    expect(html).not.toContain("Quick Links");
    expect(hrefs).not.toContain("/assistant");
    expect(html).not.toContain("/platform-preview");
  });

  it("keeps homepage hero actions limited to the production hubs", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const hrefs = getHrefValues(html);

    expect(getLinkMarkupWithText(html, "/chapters", "Chapters")).toContain("Chapters");
    expect(getLinkMarkupWithText(html, "/solver", "Solver")).toContain("Solver");
    expect(getLinkMarkupWithText(html, "/practice", "Practice")).toContain("Practice");
    expect(hrefs.filter((href) => href === "/chapters/journal-entries")).toHaveLength(0);
    expect(hrefs.filter((href) => href === "/chapters")).toHaveLength(1);
    expect(hrefs.filter((href) => href === "/solver")).toHaveLength(1);
    expect(hrefs.filter((href) => href === "/practice")).toHaveLength(1);
    expect(html.toLowerCase()).not.toContain("all chapters are available");
    expect(html.toLowerCase()).not.toContain("large question bank");
  });

  it("keeps legacy production routes available while homepage stays uncluttered", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const hrefs = getHrefValues(html);

    expect(hrefs).toContain("/chapters");
    expect(hrefs).toContain("/solver");
    expect(hrefs).not.toContain("/tools");
    expect(hrefs).toContain("/practice");
    expect(hrefs).not.toContain("/dashboard");
    expect(hrefs).not.toContain("/how-to-use");
    expect(hrefs).not.toContain("/supported-transactions");
    expect(readFileSync("app/learn/page.tsx", "utf8")).toContain("export default function LearnPage");
    expect(readFileSync("app/tools/page.tsx", "utf8")).toContain("export default function ToolsPage");
    expect(readFileSync("app/practice/page.tsx", "utf8")).toContain("export default function PracticePage");
    expect(readFileSync("app/practice/advanced/page.tsx", "utf8")).toContain("export default function AdvancedPracticePage");
  });

  it("keeps global mobile bottom navigation unchanged outside the production shell routes", () => {
    const source = readFileSync("components/MobileBottomNav.tsx", "utf8");
    const hiddenRoutesBlock = source.match(/if \([\s\S]*?\) {\n    return null;/)?.[0] ?? "";

    expect(source).toContain('pathname.startsWith("/platform-preview")');
    expect(source).toContain('pathname === "/dashboard"');
    expect(source).toContain('pathname === "/solver"');
    expect(source).toContain('pathname === "/journal-entry-solver"');
    expect(source).not.toContain('pathname.startsWith("/journal-entry-solver")');
    expect(source).toContain('pathname === "/ledger"');
    expect(source).not.toContain('pathname.startsWith("/ledger")');
    expect(source).toContain('pathname === "/trial-balance"');
    expect(source).not.toContain('pathname.startsWith("/trial-balance")');
    expect(source).toContain('pathname === "/final-accounts"');
    expect(source).not.toContain('pathname.startsWith("/final-accounts")');
    expect(source).toContain('pathname === "/bank-reconciliation"');
    expect(source).not.toContain('pathname.startsWith("/bank-reconciliation")');
    expect(source).toContain('pathname === "/chapters"');
    expect(source).toContain('pathname.startsWith("/chapters/")');
    expect(source).toContain('href: "/learn"');
    expect(source).toContain('href: "/practice"');
    expect(source).toContain('href: "/tools"');
    expect(hiddenRoutesBlock).toContain('pathname === "/journal-entry-solver"');
    expect(hiddenRoutesBlock).toContain('pathname === "/ledger"');
    expect(hiddenRoutesBlock).toContain('pathname === "/trial-balance"');
    expect(hiddenRoutesBlock).toContain('pathname === "/final-accounts"');
    expect(hiddenRoutesBlock).toContain('pathname === "/bank-reconciliation"');
    expect(hiddenRoutesBlock).not.toContain('pathname === "/tools"');
  });
});
