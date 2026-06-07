"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { mapCheckResultStatus, saveAttemptHistoryItem } from "@/lib/attempt-history";
import type { CheckEntryResponse, CorrectJournalEntry, PracticeQuestion } from "@/lib/types";

const sampleTransaction = "Bought goods for cash Rs.10000";
const sampleEntry = "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000";
type AppMode = "own" | "practice";

const learningTools = [
  {
    title: "Learn Accountancy",
    description: "Read simple lessons and understand concepts before practicing.",
    href: "/learn",
    label: "Open Learn",
  },
  {
    title: "Student Dashboard",
    description: "Track progress, weak areas, and recommended practice.",
    href: "/dashboard",
    label: "Open Dashboard",
  },
  {
    title: "AI Journal Entry Explainer",
    description: "Understand the debit-credit logic behind any supported transaction.",
    href: "/journal-entry-solver",
    label: "Open tool",
  },
  {
    title: "Ledger Posting",
    description: "Convert journal entries into account-wise ledger postings.",
    href: "/ledger",
    label: "Open tool",
  },
  {
    title: "Trial Balance",
    description: "Prepare trial balance from journal entries and ledger balances.",
    href: "/trial-balance",
    label: "Open tool",
  },
  {
    title: "Final Accounts",
    description: "Prepare Trading A/c, Profit & Loss A/c, Balance Sheet, and adjustments.",
    href: "/final-accounts",
    label: "Open tool",
  },
  {
    title: "Supported Topics",
    description: "See what the platform currently supports and what is not supported yet.",
    href: "/supported-transactions",
    label: "Open tool",
  },
  {
    title: "Attempt History",
    description: "Review recent attempts, scores, and mistakes saved on this browser.",
    href: "/history",
    label: "Open tool",
  },
  {
    title: "Learning Progress",
    description: "Review your weak areas and recommended practice based on recent attempts.",
    href: "/progress",
    label: "Open tool",
  },
  {
    title: "How to Use Accywise",
    description: "Learn the best order to use all tools.",
    href: "/how-to-use",
    label: "Open tool",
  },
];

export default function ToolsPage() {
  const [mode, setMode] = useState<AppMode>("own");
  const [transactionText, setTransactionText] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState<CheckEntryResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState<PracticeQuestion | null>(null);
  const [practiceEntry, setPracticeEntry] = useState("");
  const [practiceResult, setPracticeResult] = useState<CheckEntryResponse | null>(null);
  const [practiceError, setPracticeError] = useState("");
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [isPracticeChecking, setIsPracticeChecking] = useState(false);

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

  async function loadPracticeQuestion() {
    setPracticeError("");
    setPracticeResult(null);
    setPracticeEntry("");
    setIsPracticeLoading(true);

    try {
      const response = await fetch("/api/generate-practice-question");
      const data = await response.json();

      if (!response.ok) {
        setPracticeError("Could not generate a practice question. Try again.");
        return;
      }

      setPracticeQuestion(data);
    } catch {
      setPracticeError("Could not generate a practice question. Please try again.");
    } finally {
      setIsPracticeLoading(false);
    }
  }

  async function checkPracticeAnswer() {
    setPracticeError("");
    setPracticeResult(null);

    if (!practiceQuestion) {
      setPracticeError("Click Try Another Question to get a transaction.");
      return;
    }

    if (!practiceEntry.trim()) {
      setPracticeError("Write your journal entry before checking.");
      return;
    }

    setIsPracticeChecking(true);

    try {
      const response = await fetch("/api/check-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionText: practiceQuestion.transaction_text,
          journalEntry: practiceEntry,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPracticeError("Could not check this answer. Please try again.");
        return;
      }

      const typedData = data as CheckEntryResponse;
      setPracticeResult(typedData);
      saveAttemptHistoryItem({
        module: "practice",
        topic: practiceQuestion.topic ?? "mixed",
        transaction: practiceQuestion.transaction_text,
        studentEntry: practiceEntry,
        resultStatus: mapCheckResultStatus(typedData.result_status),
        score: typedData.score,
        mistakeType: typedData.mistake_type,
        correctEntry: formatJournalEntry(typedData.correct_journal_entry),
        explanation: simplifyExplanation(typedData.simple_explanation),
      });
    } catch {
      setPracticeError("Could not reach the checker. Please try again.");
    } finally {
      setIsPracticeChecking(false);
    }
  }

  function retryPracticeQuestion() {
    setPracticeEntry("");
    setPracticeError("");
    setPracticeResult(null);
  }

  function openWorkspace(nextMode: AppMode) {
    setMode(nextMode);
    if (nextMode === "practice" && !practiceQuestion && !isPracticeLoading) {
      void loadPracticeQuestion();
    }
    window.setTimeout(() => {
      document.getElementById("learning-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 sm:gap-7">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-blue-800 transition hover:text-blue-950">
              Accywise
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
              Learn
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
              Supported Topics
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/how-to-use" className="text-blue-800 transition hover:text-blue-950">
              How to Use
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/history" className="text-blue-800 transition hover:text-blue-950">
              Attempt History
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/progress" className="text-blue-800 transition hover:text-blue-950">
              Progress
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learning Hub</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Learning Tools</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Choose a tool to learn, practice, check, and understand accountancy step by step.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <button type="button" onClick={() => openWorkspace("own")} className="group text-left">
            <ToolCard
              title="Journal Entry Checker"
              description="Enter your journal entry and check whether it is correct."
              label="Open checker"
            />
          </button>
          <Link href="/practice" className="group">
            <ToolCard
              title="Practice Questions"
              description="Choose a topic and practice journal entries step by step."
              label="Open practice"
            />
          </Link>
          {learningTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <ToolCard title={tool.title} description={tool.description} label={tool.label} />
            </Link>
          ))}
        </section>

        <section id="learning-workspace" className="scroll-mt-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Workspace</p>
                <h2 className="mt-2 text-2xl font-bold text-blue-950">
                  {mode === "own" ? "Journal Entry Checker" : "Practice Questions"}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2 rounded-xl border border-blue-100 bg-blue-50 p-2 sm:grid-cols-2">
                <button type="button" onClick={() => setMode("own")} className={modeButtonClass(mode === "own")}>
                  Check Entry
                </button>
                <button type="button" onClick={() => openWorkspace("practice")} className={modeButtonClass(mode === "practice")}>
                  Practice
                </button>
              </div>
            </div>

            <div className="mt-5">
              {mode === "own" ? (
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
              ) : (
                <PracticeCard
                  question={practiceQuestion}
                  journalEntry={practiceEntry}
                  error={practiceError}
                  isQuestionLoading={isPracticeLoading}
                  isChecking={isPracticeChecking}
                  onJournalEntryChange={setPracticeEntry}
                  onCheck={checkPracticeAnswer}
                  onNext={() => void loadPracticeQuestion()}
                  onRetry={retryPracticeQuestion}
                />
              )}
            </div>
          </div>
        </section>

        {mode === "own" && result ? (
          <ResultCard
            result={result}
            moduleName="Checker"
            transactionText={transactionText}
            studentEntry={journalEntry}
            buttonLabel="Report wrong answer"
          />
        ) : null}
        {mode === "practice" && practiceResult ? (
          <ResultCard
            result={practiceResult}
            moduleName="Practice"
            transactionText={practiceQuestion?.transaction_text ?? ""}
            studentEntry={practiceEntry}
            buttonLabel="Report wrong answer"
          />
        ) : null}
      </section>
    </main>
  );
}

function ToolCard({ title, description, label }: { title: string; description: string; label: string }) {
  return (
    <article className="flex h-full min-h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-lg">
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

function PracticeCard({
  question,
  journalEntry,
  error,
  isQuestionLoading,
  isChecking,
  onJournalEntryChange,
  onCheck,
  onNext,
  onRetry,
}: {
  question: PracticeQuestion | null;
  journalEntry: string;
  error: string;
  isQuestionLoading: boolean;
  isChecking: boolean;
  onJournalEntryChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-line bg-paper p-4">
          <div className="text-sm font-semibold text-ink">Practice Question</div>
          <p className="mt-2 min-h-7 text-base font-medium leading-7 text-slate-800">
            {isQuestionLoading ? "Generating a question..." : question?.transaction_text ?? "No question yet."}
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-600">Try solving first before checking the answer.</p>

        <JournalEntryInput value={journalEntry} onChange={onJournalEntryChange} />

        {error ? <MessageBox message={error} /> : null}

        <div className="grid gap-2 sm:grid-cols-3">
          <PrimaryButton disabled={isChecking || isQuestionLoading || !question} onClick={onCheck}>
            {isChecking ? "Checking..." : "Check Answer"}
          </PrimaryButton>
          <SecondaryButton disabled={isQuestionLoading || isChecking} onClick={onNext}>
            {isQuestionLoading ? "Loading..." : "Try Another Question"}
          </SecondaryButton>
          <SecondaryButton disabled={!question || isChecking} onClick={onRetry}>
            Retry Same Question
          </SecondaryButton>
        </div>
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
  moduleName: "Checker" | "Practice";
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

      <div className="mt-4">
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
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          View Attempt History
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

function SecondaryButton({
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
      className="min-h-12 rounded-lg border border-line bg-white px-4 py-3 text-base font-semibold text-ink transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-slate-400"
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

function modeButtonClass(isActive: boolean): string {
  return [
    "min-h-11 rounded-lg px-4 py-2 text-sm font-bold transition",
    isActive ? "bg-blue-900 text-white shadow-soft" : "bg-white text-blue-900 hover:bg-blue-100",
  ].join(" ");
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
