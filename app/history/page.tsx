"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  clearAttemptHistory,
  getAttemptHistory,
  getAttemptHistorySummary,
  type AttemptHistoryItem,
  type AttemptHistoryResultStatus,
} from "@/lib/attempt-history";

type HistoryFilter = "all" | "correct" | "needs_correction" | "practice" | "checker";

const filters: Array<{ id: HistoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "correct", label: "Correct" },
  { id: "needs_correction", label: "Needs correction" },
  { id: "practice", label: "Practice" },
  { id: "checker", label: "Checker" },
];

export default function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState<AttemptHistoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>("all");
  const summary = getAttemptHistorySummary(attempts);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAttempts(getAttemptHistory());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "correct") return attempt.resultStatus === "correct" || attempt.resultStatus === "solved";
      if (activeFilter === "needs_correction") return !["correct", "solved"].includes(attempt.resultStatus);
      return attempt.module === activeFilter;
    });
  }, [activeFilter, attempts]);

  function handleClearHistory() {
    if (!window.confirm("Are you sure you want to clear attempt history from this browser?")) return;

    clearAttemptHistory();
    setAttempts([]);
    setActiveFilter("all");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 sm:gap-7">
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
            <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
              Practice
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/progress" className="text-blue-800 transition hover:text-blue-950">
              Learning Progress
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard" className="text-blue-800 transition hover:text-blue-950">
              Dashboard
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learning record</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Attempt History</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Review your recent attempts and learn from mistakes.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <p className="rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
                This history is saved only on this browser. It will be lost if browser data is cleared.
              </p>
              <p className="rounded-xl border border-blue-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
                Saved only on this device. No login or cloud sync yet.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Total attempts" value={summary.totalAttempts.toString()} />
          <SummaryCard label="Correct attempts" value={summary.correctAttempts.toString()} />
          <SummaryCard label="Needs correction" value={summary.needsCorrection.toString()} />
          <SummaryCard label="Average score" value={summary.averageScore === null ? "-" : `${summary.averageScore}/100`} />
        </section>

        <Link href="/progress" className="group">
          <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-soft transition group-hover:border-blue-200 group-hover:bg-blue-50 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Learning Progress</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See weak areas and recommended practice.
                </p>
              </div>
              <span className="text-sm font-bold text-blue-800">Open Progress</span>
            </div>
          </section>
        </Link>

        <Link href="/dashboard" className="group">
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-soft transition group-hover:border-emerald-200 group-hover:bg-emerald-50 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Student Dashboard</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Track progress, weak areas, recent attempts, and next steps.
                </p>
              </div>
              <span className="text-sm font-bold text-blue-800">Open Dashboard</span>
            </div>
          </section>
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Recent work</p>
              <h2 className="mt-2 text-2xl font-bold text-blue-950">Attempts saved on this browser</h2>
            </div>
            <button
              type="button"
              onClick={handleClearHistory}
              disabled={attempts.length === 0}
              className="min-h-11 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Clear History
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`min-h-10 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeFilter === filter.id
                    ? "border-blue-900 bg-blue-900 text-white"
                    : "border-slate-200 bg-white text-blue-900 hover:bg-blue-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {filteredAttempts.length > 0 ? (
              <div className="grid gap-4">
                {filteredAttempts.map((attempt) => (
                  <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="text-sm font-bold text-slate-600">{label}</div>
      <div className="mt-3 text-3xl font-bold text-blue-950">{value}</div>
    </article>
  );
}

function AttemptCard({ attempt }: { attempt: AttemptHistoryItem }) {
  const status = getStatusDisplay(attempt.resultStatus);

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-normal text-blue-900">
              {formatModule(attempt.module)}
            </span>
            {attempt.topic ? (
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800">
                {formatTopic(attempt.topic)}
              </span>
            ) : null}
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${status.badgeClass}`}>{status.label}</span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-7 text-blue-950">{attempt.transaction}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{formatDate(attempt.createdAt)}</p>
        </div>
        {typeof attempt.score === "number" ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
            <div className="text-xs font-bold uppercase tracking-normal text-slate-500">Score</div>
            <div className="mt-1 text-2xl font-bold text-blue-950">{attempt.score}/100</div>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <DetailBlock title="Student entry" body={attempt.studentEntry || "Not available."} mono />
        <DetailBlock title="Correct entry" body={attempt.correctEntry || "Not available."} mono />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <DetailBlock title="Mistake type" body={attempt.mistakeType ? formatMistake(attempt.mistakeType) : "Not available."} />
        <DetailBlock title="Explanation" body={attempt.explanation || "Not available."} />
      </div>
    </article>
  );
}

function DetailBlock({ title, body, mono = false }: { title: string; body: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-bold text-blue-950">{title}</div>
      <pre
        className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 ${
          mono ? "font-mono" : "font-sans"
        }`}
      >
        {body}
      </pre>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <h2 className="text-xl font-bold text-blue-950">No attempts yet.</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Start practicing to build your history.</p>
      <Link
        href="/practice"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        Start Practice
      </Link>
    </div>
  );
}

function getStatusDisplay(status: AttemptHistoryResultStatus) {
  if (status === "correct" || status === "solved") {
    return {
      label: status === "solved" ? "Solved" : "Correct",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (status === "invalid") {
    return {
      label: "Invalid format",
      badgeClass: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (status === "unsupported") {
    return {
      label: "Unsupported",
      badgeClass: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (status === "ambiguous") {
    return {
      label: "Ambiguous",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  return {
    label: "Needs correction",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
  };
}

function formatModule(module: AttemptHistoryItem["module"]): string {
  if (module === "checker") return "Checker";
  if (module === "practice") return "Practice";
  return "Explainer";
}

function formatTopic(topic: string): string {
  return topic
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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
