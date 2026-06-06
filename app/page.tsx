"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import type { CheckEntryResponse, CorrectJournalEntry, PracticeQuestion } from "@/lib/types";

const sampleTransaction = "Bought goods for cash Rs.10000";
const sampleEntry = "Purchases A/c Dr. Rs.10000\nTo Cash A/c Rs.10000";
type AppMode = "own" | "practice";

export default function Home() {
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

      setResult(data);
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

      setPracticeResult(data);
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

  function selectPracticeMode() {
    setMode("practice");
    if (!practiceQuestion && !isPracticeLoading) {
      void loadPracticeQuestion();
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[760px] flex-col gap-4 sm:gap-5">
        <header className="text-center sm:text-left">
          <p className="text-sm font-semibold text-accent">Beta learning tool for beginner accountancy journal entries.</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            Journal Entry AI Checker
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Practice one transaction at a time. Write the entry, check it, and learn the debit-credit reason.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-2 rounded-lg border border-line bg-white p-2 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
          <button onClick={() => setMode("own")} className={modeButtonClass(mode === "own")}>
            <span>Check My Journal Entry</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Enter a transaction and your answer. Get instant correction and explanation.
            </span>
          </button>
          <button onClick={selectPracticeMode} className={modeButtonClass(mode === "practice")}>
            <span>Practice Questions</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Solve beginner journal-entry questions and check your answer.
            </span>
          </button>
          <Link href="/journal-entry-solver" className={modeButtonClass(false)}>
            <span>AI Journal Entry Explainer</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Enter a transaction and understand the debit-credit logic step by step.
            </span>
          </Link>
          <Link href="/ledger" className={modeButtonClass(false)}>
            <span>Ledger Posting</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Convert journal entries into ledger accounts and understand debit-credit posting.
            </span>
          </Link>
          <Link href="/trial-balance" className={modeButtonClass(false)}>
            <span>Trial Balance</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Prepare a trial balance from journal entries and ledger balances.
            </span>
            <span className="text-xs font-semibold leading-5 opacity-90">Open Trial Balance</span>
          </Link>
          <Link href="/final-accounts" className={modeButtonClass(false)}>
            <span>Final Accounts</span>
            <span className="text-xs font-medium leading-5 opacity-80">
              Prepare Trading A/c and Profit & Loss A/c from trial balance balances.
            </span>
            <span className="text-xs font-semibold leading-5 opacity-90">Open Final Accounts</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <span>Not sure what the app supports?</span>
          <Link href="/supported-transactions" className="font-semibold text-accent hover:text-blue-700">
            View supported transactions
          </Link>
        </div>

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
    <div className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
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
    <div className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
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
    <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
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
    "flex min-h-16 flex-col items-center justify-center rounded-md px-3 py-3 text-center text-sm font-semibold transition sm:items-start sm:text-left",
    isActive ? "bg-accent text-white" : "bg-white text-slate-700 hover:bg-paper",
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
      label: "Correct — 100/100",
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
  if (result.result_status === "Correct") return "Correct — 100/100";
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
