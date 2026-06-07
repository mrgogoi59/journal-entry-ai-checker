"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import type { CheckEntryResponse, CorrectJournalEntry, PracticeQuestion, PracticeTopic } from "@/lib/types";

const journalEntryPlaceholder = `Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000`;

const practiceTopics: Array<{
  id: PracticeTopic;
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate";
}> = [
  {
    id: "basics",
    name: "Basics",
    description: "Capital, cash, bank, simple purchases and sales.",
    difficulty: "Beginner",
  },
  {
    id: "purchases_sales",
    name: "Purchases and Sales",
    description: "Cash/credit purchases, cash/credit sales, partial purchase/sale.",
    difficulty: "Beginner",
  },
  {
    id: "expenses_incomes",
    name: "Expenses and Incomes",
    description: "Expense payments and income receipts in cash/bank/digital mode.",
    difficulty: "Beginner",
  },
  {
    id: "debtors_creditors",
    name: "Debtors and Creditors",
    description: "Receipt from debtors, payment to creditors, discount allowed/received.",
    difficulty: "Beginner",
  },
  {
    id: "adjustments",
    name: "Adjustments",
    description: "Outstanding expenses, prepaid expenses, accrued income, income received in advance.",
    difficulty: "Intermediate",
  },
  {
    id: "assets",
    name: "Assets",
    description: "Fixed asset purchase, installation charges, asset sale, depreciation.",
    difficulty: "Intermediate",
  },
  {
    id: "goods_adjustments",
    name: "Goods Adjustments",
    description: "Goods withdrawn, free samples, charity, goods lost by fire/theft.",
    difficulty: "Intermediate",
  },
  {
    id: "returns_discounts",
    name: "Returns and Discounts",
    description: "Sales return, purchase return, trade discount, settlement discount.",
    difficulty: "Intermediate",
  },
  {
    id: "gst",
    name: "GST",
    description: "GST on purchases/sales, GST-inclusive, CGST/SGST/IGST, GST set-off/payment.",
    difficulty: "Intermediate",
  },
  {
    id: "mixed",
    name: "Mixed Practice",
    description: "Random questions from all supported beginner journal-entry categories.",
    difficulty: "Intermediate",
  },
];

export default function PracticePage() {
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic | null>(null);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState<CheckEntryResponse | null>(null);
  const [error, setError] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  async function loadQuestion(topic: PracticeTopic) {
    setSelectedTopic(topic);
    setQuestion(null);
    setJournalEntry("");
    setResult(null);
    setError("");
    setIsQuestionLoading(true);

    try {
      const response = await fetch("/api/generate-practice-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = (await response.json()) as PracticeQuestion;

      if (!response.ok) {
        setError("Could not generate a practice question. Try again.");
        return;
      }

      setQuestion(data);
    } catch {
      setError("Could not generate a practice question. Please try again.");
    } finally {
      setIsQuestionLoading(false);
    }
  }

  async function checkAnswer() {
    setError("");
    setResult(null);

    if (!question) {
      setError("Choose a topic and generate a question first.");
      return;
    }

    if (!journalEntry.trim()) {
      setError("Write your journal entry before checking.");
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/check-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionText: question.transaction_text,
          journalEntry,
        }),
      });
      const data = (await response.json()) as CheckEntryResponse;

      if (!response.ok) {
        setError("Could not check this answer. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Could not reach the checker. Please try again.");
    } finally {
      setIsChecking(false);
    }
  }

  function retryQuestion() {
    setJournalEntry("");
    setResult(null);
    setError("");
  }

  const selectedTopicName = practiceTopics.find((topic) => topic.id === selectedTopic)?.name;

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Topic Categories</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">Choose a topic</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Pick one area and build confidence one question at a time.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {practiceTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={topic.id === selectedTopic}
                onSelect={() => void loadQuestion(topic.id)}
              />
            ))}
          </div>
        </section>

        {selectedTopic ? (
          <PracticeWorkspace
            selectedTopicName={selectedTopicName ?? "Selected topic"}
            question={question}
            journalEntry={journalEntry}
            error={error}
            isQuestionLoading={isQuestionLoading}
            isChecking={isChecking}
            onJournalEntryChange={setJournalEntry}
            onCheck={() => void checkAnswer()}
            onNext={() => void loadQuestion(selectedTopic)}
            onRetry={retryQuestion}
            onChangeTopic={() => {
              setSelectedTopic(null);
              setQuestion(null);
              setJournalEntry("");
              setResult(null);
              setError("");
            }}
          />
        ) : (
          <TipsCard />
        )}

        {result && question ? (
          <ResultCard result={result} transactionText={question.transaction_text} studentEntry={journalEntry} />
        ) : null}
      </section>
    </main>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
        <Link href="/" className="text-blue-800 transition hover:text-blue-950">
          Back to Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Learning Tools
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
          Supported Topics
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Journal-entry practice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Topic-wise Practice</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Choose a topic and practice journal entries step by step.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Start with basic entries, then move to GST, adjustments, assets, and final accounts-related entries.
        </p>
      </div>
    </header>
  );
}

function TopicCard({
  topic,
  isSelected,
  onSelect,
}: {
  topic: (typeof practiceTopics)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`flex h-full min-h-56 flex-col justify-between rounded-2xl border p-5 shadow-soft transition ${
        isSelected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
            topic.difficulty === "Beginner"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {topic.difficulty}
        </span>
        <h3 className="mt-4 text-xl font-bold text-blue-950">{topic.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{topic.description}</p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="mt-5 min-h-11 rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        Practice this
      </button>
    </article>
  );
}

function PracticeWorkspace({
  selectedTopicName,
  question,
  journalEntry,
  error,
  isQuestionLoading,
  isChecking,
  onJournalEntryChange,
  onCheck,
  onNext,
  onRetry,
  onChangeTopic,
}: {
  selectedTopicName: string;
  question: PracticeQuestion | null;
  journalEntry: string;
  error: string;
  isQuestionLoading: boolean;
  isChecking: boolean;
  onJournalEntryChange: (value: string) => void;
  onCheck: () => void;
  onNext: () => void;
  onRetry: () => void;
  onChangeTopic: () => void;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Practice Area</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Selected topic: {selectedTopicName}</h2>
        </div>
        <button
          type="button"
          onClick={onChangeTopic}
          className="min-h-10 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          Change Topic
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-bold text-blue-950">Practice Question</div>
          <p className="mt-2 min-h-7 text-lg font-bold leading-7 text-slate-800">
            {isQuestionLoading ? "Generating a question..." : question?.transaction_text ?? "No question yet."}
          </p>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">Your Journal Entry</span>
          <textarea
            value={journalEntry}
            onChange={(event) => onJournalEntryChange(event.target.value)}
            placeholder={journalEntryPlaceholder}
            className="min-h-40 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

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
    </section>
  );
}

function TipsCard() {
  const tips = ["Write Dr. and To clearly.", "Mention amount on each line.", "Use one account per line."];

  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-soft sm:p-6">
      <h2 className="text-xl font-bold text-blue-950">Practice tips</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {tips.map((tip) => (
          <div key={tip} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            {tip}
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultCard({
  result,
  transactionText,
  studentEntry,
}: {
  result: CheckEntryResponse;
  transactionText: string;
  studentEntry: string;
}) {
  const status = getStatusDisplay(result.result_status);
  const correctEntry = formatJournalEntry(result.correct_journal_entry);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className={`rounded-2xl border px-4 py-4 ${status.panelClass}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold">{status.label}</div>
            <div className="mt-1 text-sm font-medium leading-6">{status.message}</div>
          </div>
          <div className="text-3xl font-bold">{result.score}/100</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <ResultSection title="Correct journal entry">
          <JournalEntryView entry={result.correct_journal_entry} />
        </ResultSection>
        <ResultSection title="What went wrong" body={formatMistake(result.mistake_type)} />
        <ResultSection title="Simple explanation" body={simplifyExplanation(result.simple_explanation)} />
      </div>

      <div className="mt-4">
        <FeedbackReport
          buttonLabel="Report wrong answer"
          details={{
            module: "Practice",
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-bold text-blue-950">{title}</h2>
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
    <pre className="select-all overflow-x-auto rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm leading-7 text-slate-900">
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
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400"
    >
      {children}
    </button>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
      {message}
    </div>
  );
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

  return {
    label: "Needs correction",
    message: "Review the correct entry below, then try the same idea again.",
    panelClass: "border-red-200 bg-red-50 text-red-800",
  };
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
