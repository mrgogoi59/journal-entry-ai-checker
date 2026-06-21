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
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
  JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  journalEntriesChapter,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
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

  it("renders a student-friendly Journal Entries overview with honest pilot availability", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);

    expect(html).toContain("Chapter overview");
    expect(html).toContain("Learn the first step of recording every transaction");
    expect(html).toContain("Journal Entries are the first step of Accountancy recording.");
    expect(html).toContain("Every business transaction is first analysed");
    expect(html).toContain("cash, bank, goods, salary, capital, drawings, purchases, sales, expenses");
    expect(html).toContain("Available in this pilot");
    expect(html).toContain("16 learning sections are available now.");
    expect(html).toContain("Exactly 2 Practice It Yourself checkers are live in Section 1.");
    expect(html).toContain("Most sections are read-only learning sections for now.");
    expect(html).toContain("More checking will be added later only after safe checker design.");
    expect(html).toContain("Recommended start");
    expect(html).toContain("Try the two Practice It Yourself checks when they appear.");
    expect(
      getLinkMarkupWithText(html, "/chapters/journal-entries#introduction-to-journal-entries", "Start first section"),
    ).toContain("Start first section");
    expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Open Explainer")).toContain("Open Explainer");
    expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Revise in Practice")).toContain(
      "Revise in Practice",
    );
    expect(getLinkMarkupWithText(html, "/solver", "Open Solver hub")).toContain("Open Solver hub");
    expect(html.toLowerCase()).not.toContain("all sections are interactive");
    expect(html.toLowerCase()).not.toContain("all chapters are complete");
  });

  it("polishes only the first five Journal Entries sections with pilot guide copy and safe next steps", () => {
    const polishedSections = [
      {
        slug: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
        title: "Introduction to Journal Entries and Journal Format",
        rule: "Debit and credit must always balance",
        actionHref: "/chapters/journal-entries#practice-it-yourself",
        actionText: "Try Practice It Yourself here",
      },
      {
        slug: JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
        title: "Business Transactions",
        rule: "Record only business events measurable in money",
        actionHref: "/chapters/journal-entries/accounts-affected",
        actionText: "Continue to Accounts Affected",
      },
      {
        slug: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
        title: "Accounts Affected",
        rule: "Name accounts before choosing Dr. or To",
        actionHref: "/chapters/journal-entries/types-of-accounts",
        actionText: "Continue to Types of Accounts",
      },
      {
        slug: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
        title: "Types of Accounts",
        rule: "Classify the account, not the sentence",
        actionHref: "/chapters/journal-entries/debit-and-credit-rules",
        actionText: "Continue to Debit and Credit Rules",
      },
      {
        slug: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
        title: "Debit and Credit Rules",
        rule: "Account nature plus effect decides the side",
        actionHref: "/chapters/journal-entries/journal-format-and-narration",
        actionText: "Continue to Journal Format and Narration",
      },
    ] as const;

    polishedSections.forEach(({ actionHref, actionText, rule, slug, title }) => {
      const html = renderProductionSection(slug);

      expect(html).toContain("Section pilot guide");
      expect(html).toContain(`Before you study ${title}`);
      expect(html).toContain("What this teaches");
      expect(html).toContain("Why it matters");
      expect(html).toContain("Pay attention to");
      expect(html).toContain("Next learning step");
      expect(html).toContain("Rule to remember");
      expect(html).toContain(rule);
      expect(html).toContain("Study the examples");
      expect(html).toContain("Follow the analysis, not just the answer");
      expect(getLinkMarkupWithText(html, actionHref, actionText)).toContain(actionText);
      expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Use Explainer if stuck")).toContain(
        "Use Explainer if stuck",
      );
      expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Revise later in Practice")).toContain(
        "Revise later in Practice",
      );
    });

    const sectionSixHtml = renderProductionSection(JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG);

    expect(sectionSixHtml).not.toContain("Section pilot guide");
    expect(sectionSixHtml).not.toContain("Before you study Journal Format and Narration");
  });

  it("renders a compact how-to-use path on the production Journal Entries chapter", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);

    expect(html).toContain("How to use this chapter");
    expect(html).toContain("Read the sections in order.");
    expect(html).toContain("Notice the accounting rule or logic.");
    expect(html).toContain("Try Practice It Yourself where available.");
    expect(html).toContain("Use Journal Entry Explainer if you get stuck.");
    expect(html).toContain("Use beginner practice for revision after learning.");
    expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Open Journal Entry Explainer")).toContain(
      "Open Journal Entry Explainer",
    );
    expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Practice Journal Entries")).toContain(
      "Practice Journal Entries",
    );
    expect(html).not.toContain("/platform-preview");
  });

  it("marks Journal Entries outline sections as read-only or practice-enabled without adding new checks", () => {
    const html = renderProductionSection(JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG);
    const practiceBadgeCount = html.match(/2 practice checks/g)?.length ?? 0;

    expect(journalEntriesChapter.subtopics[0].practiceQuestionIds).toHaveLength(2);
    expect(html).toContain("2 practice checks");
    expect(practiceBadgeCount).toBeGreaterThanOrEqual(1);
    expect(html).toContain("Read-only");
    expect(html).toContain("Business Transactions");
    expect(html).toContain("Accounts Affected");
    expect(html).toContain("Chapter outline");
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
    expect(html.match(/How to attempt this checker/g)).toHaveLength(2);
    expect(html.match(/Only these 2 in-chapter checks are live right now\./g)).toHaveLength(2);
    expect(html).toContain(SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID);
    expect(html).toContain(PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID);
    expect(html).toContain("This chapter checker supports this audited question only.");
    expect(html).toContain("Likely accounts involved: Cash and Sales.");
    expect(html).toContain("Likely accounts involved: Salary and Bank.");
    expect(html).toContain("Analyse the transaction before typing.");
    expect(html).toContain("Decide the debit and credit side before you check.");
    expect(html).toContain("Spelling, account naming, Dr./To, amount, totals, and narration matter in this checker.");
    expect(getLinkMarkupWithText(html, "/journal-entry-solver", "Use Explainer if stuck")).toContain(
      "Use Explainer if stuck",
    );
    expect(getLinkMarkupWithText(html, "/practice/journal-entries", "Revise later in Practice")).toContain(
      "Revise later in Practice",
    );
    expect(html).not.toContain("Interactive answer checking for this chapter will be enabled in the next controlled migration step.");
    expect(html).not.toContain("Show Correct Answer");
    expect(html).not.toContain("Correct Answer");
    expect(source).toContain("checkJournalEntriesPracticeAnswer");
    expect(source).toContain("revealJournalEntriesPracticeCorrectAnswer");
    expect(source).toContain("JournalEntryPracticeEditor");
    expect(source).toContain("Read the feedback in this order: accounts, debit/credit side, amount, totals, and narration.");
    expect(source).toContain("If you are stuck, reread the rule, use the Explainer for help, and then try this same checker again.");
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
