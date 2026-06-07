"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { mapCheckResultStatus, saveAttemptHistoryItem } from "@/lib/attempt-history";
import type { CheckEntryResponse, CorrectJournalEntry } from "@/lib/types";

const sampleTransaction = "Bought goods for cash Rs.10000";
const sampleEntry = "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000";

const toolSections = [
  {
    title: "Core Learning",
    description: "Start here for lessons, practice, checking, and explanations.",
    tools: [
      {
        title: "Learn Accountancy",
        description: "Read simple lessons and track lesson completion in your browser.",
        href: "/learn",
        label: "Open Learn",
      },
      {
        title: "Topic-wise Practice",
        description: "Choose a topic and practice journal entries step by step.",
        href: "/practice",
        label: "Start Practice",
      },
      {
        title: "Journal Entry Checker",
        description: "Enter your own journal entry and check whether it is correct.",
        action: "checker",
        label: "Open Checker",
      },
      {
        title: "AI Journal Entry Explainer",
        description: "Understand the debit-credit logic behind a supported transaction.",
        href: "/journal-entry-solver",
        label: "Open Explainer",
      },
    ],
  },
  {
    title: "Accounting Workflow",
    description: "Move from journal entries into the next accountancy steps.",
    tools: [
      {
        title: "Ledger Posting",
        description: "Convert journal entries into account-wise ledger postings.",
        href: "/ledger",
        label: "Open Ledger",
      },
      {
        title: "Trial Balance",
        description: "Prepare trial balance from journal entries and ledger balances.",
        href: "/trial-balance",
        label: "Open Trial Balance",
      },
      {
        title: "Final Accounts",
        description: "Prepare Trading A/c, Profit & Loss A/c, Balance Sheet, and adjustments.",
        href: "/final-accounts",
        label: "Open Final Accounts",
      },
    ],
  },
  {
    title: "Review & Support",
    description: "Review saved browser data and understand what the app supports.",
    tools: [
      {
        title: "Student Dashboard",
        description: "Open your main home base for next actions, progress, and recent attempts.",
        href: "/dashboard",
        label: "Open Dashboard",
      },
      {
        title: "Attempt History",
        description: "Review recent attempts, scores, and mistakes saved on this browser.",
        href: "/history",
        label: "Open History",
      },
      {
        title: "Weak Areas / Learning Progress",
        description: "Review mistake patterns and recommended practice topics.",
        href: "/progress",
        label: "Open Progress",
      },
      {
        title: "Supported Topics",
        description: "See what Accywise currently supports and what is not supported yet.",
        href: "/supported-transactions",
        label: "View Topics",
      },
      {
        title: "How to Use",
        description: "Learn the best order to use the pages and tools.",
        href: "/how-to-use",
        label: "Read Guide",
      },
    ],
  },
] as const;

export default function ToolsPage() {
  const [transactionText, setTransactionText] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState<CheckEntryResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function checkEntry() {
    setError("");
    setResult(null);

    const missingMessage = getMissingInputMessage(transactionText, journalEntry);
    if (missingMessage) {
      setError(missingMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/check-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionText, journalEntry }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not check this entry. Please try again.");
        return;
      }

      const typedData = data as CheckEntryResponse;
      setResult(typedData);
      saveAttemptHistoryItem({
        module: "checker",
        transaction: transactionText,
        studentEntry: journalEntry,
        resultStatus: mapCheckResultStatus(typedData.result_status),
        score: typedData.score,
        mistakeType: typedData.mistake_type,
        correctEntry: formatJournalEntry(typedData.correct_journal_entry),
        explanation: simplifyExplanation(typedData.simple_explanation),
      });
    } catch {
      setError("Could not reach the checker. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function openCheckerWorkspace() {
    window.setTimeout(() => {
      document.getElementById("journal-entry-checker")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 sm:gap-7">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-blue-800 transition hover:text-blue-950">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard" className="text-blue-800 transition hover:text-blue-950">
              Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
              Learn
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
              Practice
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/tools" className="text-blue-950">
              Tools
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Utility shelf</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Learning Tools</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Use focused utilities after learning or when you need to check work.
            </p>
          </div>
        </header>

        <div className="grid gap-5">
          {toolSections.map((section) => (
            <ToolShelfSection key={section.title} section={section} onOpenChecker={openCheckerWorkspace} />
          ))}
        </div>

        <section id="journal-entry-checker" className="scroll-mt-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Checker workspace</p>
                <h2 className="mt-2 text-2xl font-bold text-blue-950">Journal Entry Checker</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Check your own entry here. For generated questions, use Topic-wise Practice.
                </p>
              </div>
              <Link
                href="/practice"
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Open Practice
              </Link>
            </div>

            <div className="mt-5">
              <EntryCard
                transactionText={transactionText}
                journalEntry={journalEntry}
                error={error}
                isLoading={isLoading}
                buttonText="Check My Journal Entry"
                loadingText="Checking..."
                onTransactionChange={setTransactionText}
                onJournalEntryChange={setJournalEntry}
                onSubmit={checkEntry}
              />
            </div>
          </div>
        </section>

        {result ? (
          <ResultCard
            result={result}
            moduleName="Checker"
            transactionText={transactionText}
            studentEntry={journalEntry}
            buttonLabel="Report wrong answer"
          />
        ) : null}
      </section>
    </main>
  );
}

function ToolShelfSection({
  section,
  onOpenChecker,
}: {
  section: (typeof toolSections)[number];
  onOpenChecker: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-soft sm:p-5">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{section.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.tools.map((tool) =>
          "action" in tool ? (
            <button key={tool.title} type="button" onClick={onOpenChecker} className="group text-left">
              <ToolCard title={tool.title} description={tool.description} label={tool.label} />
            </button>
          ) : (
            <Link key={tool.href} href={tool.href} className="group">
              <ToolCard title={tool.title} description={tool.description} label={tool.label} />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}

function ToolCard({ title, description, label }: { title: string; description: string; label: string }) {
  return (
    <article className="flex h-full min-h-40 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-lg">
      <div>
        <div className="mb-4 h-10 w-10 rounded-xl bg-emerald-100 ring-8 ring-emerald-50" />
        <h2 className="text-xl font-bold text-blue-950">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <span className="mt-5 text-sm font-bold text-blue-800">{label}</span>
    </article>
  );
}

function EntryCard({
  transactionText,
  journalEntry,
  error,
  isLoading,
  buttonText,
  loadingText,
  onTransactionChange,
  onJournalEntryChange,
  onSubmit,
}: {
  transactionText: string;
  journalEntry: string;
  error: string;
  isLoading: boolean;
  buttonText: string;
  loadingText: string;
  onTransactionChange: (value: string) => void;
  onJournalEntryChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Business Transaction</span>
          <textarea
            value={transactionText}
            onChange={(event) => onTransactionChange(event.target.value)}
            placeholder={`Example: ${sampleTransaction}`}
            className="min-h-24 resize-y rounded-lg border border-line bg-white px-4 py-3 text-base leading-6 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <JournalEntryInput value={journalEntry} onChange={onJournalEntryChange} />

        {error ? <MessageBox message={error} /> : null}

        <PrimaryButton disabled={isLoading} onClick={onSubmit}>
          {isLoading ? loadingText : buttonText}
        </PrimaryButton>
      </div>
    </div>
  );
}

function JournalEntryInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="journal-entry-input" className="text-sm font-semibold text-ink">
        Your Journal Entry
      </label>
      <textarea
        id="journal-entry-input"
        aria-describedby="journal-entry-helper"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Example:\n${sampleEntry}`}
        className="min-h-36 resize-y rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
      />
      <p id="journal-entry-helper" className="rounded-md bg-paper px-3 py-2 text-sm leading-6 text-slate-600">
        Write one account per line. Use Dr. and To for best results.
      </p>
    </div>
  );
}

function ResultCard({
  result,
  moduleName,
  transactionText,
  studentEntry,
  buttonLabel,
}: {
  result: CheckEntryResponse;
  moduleName: "Checker";
  transactionText: string;
  studentEntry: string;
  buttonLabel: string;
}) {
  const status = getStatusDisplay(result.result_status);
  const correctEntry = formatJournalEntry(result.correct_journal_entry);

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-6">
      <div className={`rounded-lg border px-4 py-4 ${status.panelClass}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold">{status.label}</div>
            <div className="mt-1 text-sm font-medium leading-6">{status.message}</div>
          </div>
          <div className="text-3xl font-bold">{result.score}/100</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <ResultSection title="Your result" body={formatResultSummary(result)} />
        <ResultSection title="Correct journal entry">
          <JournalEntryView entry={result.correct_journal_entry} />
        </ResultSection>
        <ResultSection title="What went wrong" body={formatMistake(result.mistake_type)} />
        <ResultSection title="Simple explanation" body={simplifyExplanation(result.simple_explanation)} />
        <ResultSection title="Similar practice question" body={result.similar_practice_question} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <FeedbackReport
          buttonLabel={buttonLabel}
          details={{
            module: moduleName,
            transaction: transactionText,
            studentEntry,
            appResult: [
              `Status: ${result.result_status}`,
              `Score: ${result.score}/100`,
              `Mistake type: ${result.mistake_type}`,
              `Explanation: ${simplifyExplanation(result.simple_explanation)}`,
            ].join("\n"),
            appCorrectEntry: correctEntry || "No expected entry available.",
          }}
        />
        <Link
          href="/history"
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          View Attempt History
        </Link>
        <Link
          href="/progress"
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          View Weak Areas
        </Link>
      </div>
    </section>
  );
}

function ResultSection({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {body ? <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p> : null}
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

function JournalEntryView({ entry }: { entry: CorrectJournalEntry }) {
  const text = formatJournalEntry(entry);

  if (!text) {
    return <p className="text-sm text-slate-700">No expected entry available.</p>;
  }

  return (
    <pre className="select-all overflow-x-auto rounded-md border border-line bg-white p-3 font-mono text-sm leading-7 text-slate-900">
      {text}
    </pre>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="min-h-12 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {children}
    </button>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
      {message}
    </div>
  );
}

function getMissingInputMessage(transaction: string, entry: string): string {
  if (!transaction.trim() && !entry.trim()) return "Add a transaction and your journal entry first.";
  if (!transaction.trim()) return "Add the transaction first.";
  if (!entry.trim()) return "Write your journal entry before checking.";
  return "";
}

function getStatusDisplay(status: CheckEntryResponse["result_status"]) {
  if (status === "Correct") {
    return {
      label: "Correct - 100/100",
      message: "Great. Your accounts, sides, amount, and balance match.",
      panelClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (status === "Partly Correct") {
    return {
      label: "Partly Correct",
      message: "You are close. Check the mistake below and try again.",
      panelClass: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (status === "Invalid Format") {
    return {
      label: "Invalid Format",
      message: "Use one debit line and one credit line with amounts.",
      panelClass: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (status === "Unsupported Transaction") {
    return {
      label: "Unsupported",
      message: "This transaction is not in the beginner practice set yet.",
      panelClass: "border-red-200 bg-red-50 text-red-800",
    };
  }

  return {
    label: "Needs correction",
    message: "Review the correct entry below, then try the same idea again.",
    panelClass: "border-red-200 bg-red-50 text-red-800",
  };
}

function formatResultSummary(result: CheckEntryResponse): string {
  if (result.result_status === "Correct") return "Correct - 100/100";
  if (result.result_status === "Unsupported Transaction") return "Unsupported transaction";
  if (result.result_status === "Invalid Format") return "Invalid format";
  return `${result.result_status}. Score: ${result.score}/100`;
}

function formatJournalEntry(entry: CorrectJournalEntry): string {
  const debitLines = entry.debits.map(
    (line) => `${line.account} A/c Dr. ₹${line.amount.toLocaleString("en-IN")}`,
  );
  const creditLines = entry.credits.map(
    (line) => `    To ${line.account} A/c ₹${line.amount.toLocaleString("en-IN")}`,
  );

  return [...debitLines, ...creditLines].join("\n");
}

function simplifyExplanation(explanation: string): string {
  return explanation
    .replaceAll(" is an asset and it is increasing", " increases")
    .replaceAll("expenses are debited", "expenses go on the debit side")
    .replaceAll("because it is paid out", "because money is paid")
    .replaceAll("because money is received", "because money is received");
}

function formatMistake(mistakeType: string): string {
  const labels: Record<string, string> = {
    correct: "No mistake",
    wrong_account: "Wrong account",
    reversed_sides: "Debit and credit are reversed",
    amount_mismatch: "Amount does not match",
    missing_account: "One account is missing",
    unbalanced_entry: "Debit and credit totals are not equal",
    format_error: "Format is not clear",
    unsupported_transaction: "Unsupported transaction",
  };

  return labels[mistakeType] ?? mistakeType;
}
