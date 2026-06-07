"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWeakAreaSummary, type WeakAreaSummary } from "@/lib/attempt-history";

export default function ProgressPage() {
  const [summary, setSummary] = useState<WeakAreaSummary>(() => getWeakAreaSummary([]));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSummary(getWeakAreaSummary());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const hasAttempts = summary.totalAttempts > 0;

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
            <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
              Tools
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Student progress</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
              Weak Areas / Learning Progress
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Analysis of your mistakes and recommended practice topics.
            </p>
            <p className="mt-5 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
              This progress is saved only on this browser. No login or cloud sync yet.
            </p>
          </div>
        </header>

        {hasAttempts ? (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <SummaryCard label="Total attempts" value={summary.totalAttempts.toString()} />
              <SummaryCard label="Correct attempts" value={summary.correctAttempts.toString()} />
              <SummaryCard label="Needs correction" value={summary.incorrectAttempts.toString()} />
              <SummaryCard label="Average score" value={`${summary.averageScore}/100`} />
            </section>

            <section>
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Weak areas</p>
                <h2 className="mt-2 text-2xl font-bold text-blue-950">Where to focus next</h2>
              </div>
              <div className="mt-5">
                {summary.weakAreas.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {summary.weakAreas.map((area) => (
                      <WeakAreaCard key={area.id} area={area} />
                    ))}
                  </div>
                ) : (
                  <PositiveState />
                )}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <RecommendedPractice weakAreas={summary.weakAreas} />
              <MistakePatterns patterns={summary.mistakePatterns} />
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <ActionCard
                title="Student Dashboard"
                description="Open the central dashboard for progress, weak areas, recent attempts, and next steps."
                href="/dashboard"
                label="Open Dashboard"
              />
              <ActionCard
                title="Recent Attempts"
                description="Open the full attempt list with transactions, entries, scores, and explanations."
                href="/history"
                label="Open Attempt History"
              />
              <ActionCard
                title="Start Practice"
                description="Choose a topic and practice the next journal entry step by step."
                href="/practice"
                label="Start Practice"
              />
            </section>
          </>
        ) : (
          <EmptyState />
        )}
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

function WeakAreaCard({ area }: { area: WeakAreaSummary["weakAreas"][number] }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div>
        <h3 className="text-xl font-bold text-blue-950">{area.label}</h3>
        <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
          <p>Average score: {area.averageScore}%</p>
          <p>Attempts: {area.attempts}</p>
          <p>Issue count: {area.issueCount}</p>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{area.recommendation}</p>
      </div>
      <Link
        href="/practice"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        Practice {area.label}
      </Link>
    </article>
  );
}

function RecommendedPractice({ weakAreas }: { weakAreas: WeakAreaSummary["weakAreas"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Recommended practice</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">What to do next</h2>
      {weakAreas.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {weakAreas.slice(0, 4).map((area) => (
            <div key={area.id} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="text-sm font-bold text-blue-950">{area.label}</div>
              <p className="mt-1 text-sm leading-6 text-slate-700">{area.recommendation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm font-semibold leading-6 text-emerald-800">
            Great start. Keep practicing mixed questions to strengthen speed and accuracy.
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

function MistakePatterns({ patterns }: { patterns: WeakAreaSummary["mistakePatterns"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Recent mistake patterns</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Common issues</h2>
      {patterns.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {patterns.slice(0, 5).map((pattern) => (
            <div
              key={pattern.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-bold text-slate-800">{pattern.label}</span>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-950">{pattern.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-6 text-slate-700">
          No recurring mistake pattern yet.
        </p>
      )}
    </section>
  );
}

function PositiveState() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="text-xl font-bold text-emerald-900">No weak area found yet.</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
        Great start. Keep practicing mixed questions to strengthen speed and accuracy.
      </p>
      <Link
        href="/practice"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        Practice Mixed Questions
      </Link>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold text-blue-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
      >
        {label}
      </Link>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center shadow-soft sm:p-8">
      <h2 className="text-2xl font-bold text-blue-950">No progress yet.</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Complete a few Checker or Practice attempts to see your weak areas.
      </p>
      <Link
        href="/practice"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        Start Practice
      </Link>
    </section>
  );
}
