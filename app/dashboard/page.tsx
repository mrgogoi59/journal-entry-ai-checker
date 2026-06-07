"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardSummary, type AttemptHistoryItem, type DashboardSummary } from "@/lib/attempt-history";
import { getLessonProgressSummary, type LessonProgressSummary } from "@/lib/lesson-progress";

const quickActions = [
  { title: "Open Tools", href: "/tools" },
  { title: "Learn Concepts", href: "/learn" },
  { title: "Practice by Topic", href: "/practice" },
  { title: "View History", href: "/history" },
  { title: "View Weak Areas", href: "/progress" },
  { title: "Explain a Transaction", href: "/journal-entry-solver" },
  { title: "Generate Ledger", href: "/ledger" },
  { title: "Prepare Trial Balance", href: "/trial-balance" },
  { title: "Prepare Final Accounts", href: "/final-accounts" },
  { title: "Read How to Use", href: "/how-to-use" },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(() => getDashboardSummary([]));
  const [lessonSummary, setLessonSummary] = useState<LessonProgressSummary>(() => getLessonProgressSummary([]));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSummary(getDashboardSummary());
      setLessonSummary(getLessonProgressSummary());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const hasAttempts = summary.totalAttempts > 0;

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-7">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-blue-800 transition hover:text-blue-950">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard" className="text-blue-950">
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
            <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
              Tools
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learner overview</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Student Dashboard</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Your summary and next learning actions.
            </p>
            <p className="mt-5 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
              This dashboard is saved only on this browser. No login or cloud sync yet.
            </p>
          </div>
        </header>

        <WelcomeCard hasAttempts={hasAttempts} />

        <RecommendedPracticeCard summary={summary} hasAttempts={hasAttempts} />

        <LessonProgressCard summary={lessonSummary} />

        <section>
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Practice summary</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">Your recent practice</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <SummaryCard label="Total Attempts" value={summary.totalAttempts.toString()} />
            <SummaryCard label="Correct Attempts" value={summary.correctAttempts.toString()} />
            <SummaryCard label="Needs Correction" value={summary.incorrectAttempts.toString()} />
            <SummaryCard label="Average Score" value={`${summary.averageScore}/100`} />
          </div>
          {!hasAttempts ? (
            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-900">
              Start your first practice attempt to build your dashboard.
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
          <WeakAreasSection summary={summary} />
          <ReviewLinksCard />
        </section>

        <RecentAttemptsSection attempts={summary.recentAttempts} />

        <QuickActionsSection />

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-lg font-bold text-emerald-950">Browser-only privacy note</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
            Your dashboard is saved only on this browser using local storage. No login or cloud sync yet.
          </p>
        </section>
      </section>
    </main>
  );
}

function LessonProgressCard({ summary }: { summary: LessonProgressSummary }) {
  const hasCompletedLessons = summary.completedLessons > 0;

  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learning Progress</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">
            Lessons completed: {summary.completedLessons} of {summary.totalLessons}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            {hasCompletedLessons ? `${summary.completionPercent}% complete` : "Start your first lesson."}
          </p>
          <div className="mt-4 h-3 max-w-md overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${summary.completionPercent}%` }}
            />
          </div>
        </div>
        <Link
          href="/learn"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          Continue Learning
        </Link>
      </div>
    </section>
  );
}

function WelcomeCard({ hasAttempts }: { hasAttempts: boolean }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Welcome</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Welcome back to Accywise</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Continue practicing accountancy step by step.</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            {hasAttempts
              ? "Continue learning from your recent attempts."
              : "Start your first practice attempt to build your dashboard."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Continue Learning
          </Link>
          <Link
            href="/practice"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
          >
            {hasAttempts ? "Practice Recommended Topic" : "Start Practice"}
          </Link>
          <Link
            href="/tools"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
          >
            Open Tools
          </Link>
        </div>
      </div>
    </section>
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

function WeakAreasSection({ summary }: { summary: DashboardSummary }) {
  const weakAreas = summary.weakAreas.slice(0, 3);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Weak areas</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Focus areas</h2>
      {weakAreas.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          {weakAreas.map((area) => (
            <article key={area.id} className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <h3 className="text-lg font-bold text-blue-950">{area.label}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-700">Average score: {area.averageScore}%</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">Attempts: {area.attempts}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">Issue count: {area.issueCount}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{area.recommendation}</p>
              <Link
                href="/practice"
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Practice {area.label}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold leading-6 text-emerald-800">
            No weak areas found yet. Keep practicing mixed questions to build accuracy.
          </p>
          <Link
            href="/practice"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Practice Mixed Questions
          </Link>
        </div>
      )}
    </section>
  );
}

function RecommendedPracticeCard({
  summary,
  hasAttempts,
}: {
  summary: DashboardSummary;
  hasAttempts: boolean;
}) {
  const title = hasAttempts ? summary.recommendation.title : "Start with Basics";
  const description = hasAttempts
    ? summary.recommendation.description
    : "Begin with simple capital, cash, purchases, and sales entries.";

  return (
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 to-emerald-800 p-5 text-white shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-100">Recommended next practice</p>
      <h2 className="mt-2 text-2xl font-bold">Recommended next: {title}</h2>
      <p className="mt-4 text-sm leading-6 text-blue-50">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/practice"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-950 transition hover:bg-blue-50"
        >
          Start Practice
        </Link>
        <Link
          href="/progress"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
        >
          View Weak Areas
        </Link>
      </div>
    </section>
  );
}

function ReviewLinksCard() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Review links</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">History and weak areas</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        Use these when you want to inspect the full attempt log or review mistake patterns.
      </p>
      <div className="mt-5 grid gap-3">
        <Link
          href="/history"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
        >
          View History
        </Link>
        <Link
          href="/progress"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          View Weak Areas
        </Link>
      </div>
    </section>
  );
}

function RecentAttemptsSection({ attempts }: { attempts: AttemptHistoryItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Recent attempts</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Latest practice activity</h2>
        </div>
        <Link
          href="/history"
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          View Full History
        </Link>
      </div>
      {attempts.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {attempts.map((attempt) => (
            <RecentAttemptCard key={attempt.id} attempt={attempt} />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-6 text-slate-700">
          No recent attempts yet.
        </p>
      )}
    </section>
  );
}

function RecentAttemptCard({ attempt }: { attempt: AttemptHistoryItem }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-900">
              {formatModule(attempt.module)}
            </span>
            {attempt.topic ? (
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold text-emerald-800">
                {formatTopic(attempt.topic)}
              </span>
            ) : null}
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
              {formatStatus(attempt.resultStatus)}
            </span>
          </div>
          <h3 className="mt-3 text-base font-bold leading-7 text-blue-950">{attempt.transaction}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{formatDate(attempt.createdAt)}</p>
          {attempt.mistakeType && attempt.mistakeType !== "correct" ? (
            <p className="mt-2 text-sm font-semibold text-slate-700">Mistake: {formatMistake(attempt.mistakeType)}</p>
          ) : null}
        </div>
        {typeof attempt.score === "number" ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
            <div className="text-xs font-bold uppercase tracking-normal text-slate-500">Score</div>
            <div className="mt-1 text-2xl font-bold text-blue-950">{attempt.score}/100</div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function QuickActionsSection() {
  return (
    <section>
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Quick actions</p>
        <h2 className="mt-2 text-2xl font-bold text-blue-950">Jump back into learning</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <article className="flex h-full min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition group-hover:border-blue-200 group-hover:bg-blue-50">
              <h3 className="text-lg font-bold text-blue-950">{action.title}</h3>
              <span className="mt-5 text-sm font-bold text-blue-800">Open</span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
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

function formatStatus(status: AttemptHistoryItem["resultStatus"]): string {
  if (status === "correct") return "Correct";
  if (status === "invalid") return "Invalid format";
  if (status === "unsupported") return "Unsupported";
  if (status === "ambiguous") return "Ambiguous";
  if (status === "solved") return "Solved";
  return "Needs correction";
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
    wrong_account: "Wrong account",
    reversed_sides: "Debit/Credit side",
    amount_mismatch: "Amount mismatch",
    missing_account: "Missing account",
    unbalanced_entry: "Unbalanced entry",
    format_error: "Format",
    unsupported_transaction: "Unsupported transaction",
  };

  return labels[mistakeType] ?? mistakeType;
}
