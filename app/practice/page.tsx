import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/student-platform/PageHeader";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  practiceChapterCatalog,
  practiceChapterStatusLabels,
  type PracticeChapterCatalogItem,
  type PracticeChapterStatus,
} from "@/lib/learning-platform/practice-catalog";

export const metadata: Metadata = {
  title: "Practice | AccyWise AI",
  description: "Chapter-wise Accountancy practice and independent revision.",
};

const statusStyles = {
  available: "border-cyan-200 bg-cyan-50 text-cyan-800",
  planned: "border-amber-200 bg-amber-50 text-amber-800",
  later: "border-slate-200 bg-slate-50 text-slate-600",
} satisfies Record<PracticeChapterStatus, string>;

export default function PracticePage() {
  const availableItems = practiceChapterCatalog.filter((item) => item.status === "available");
  const upcomingItems = practiceChapterCatalog.filter((item) => item.status !== "available");

  return (
    <StudentAppShell activeItem="practice">
      <PageHeader
        eyebrow="Student platform"
        title="Practice"
        description="Choose a chapter and practise Accountancy independently after learning the concepts."
      >
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-cyan-800">
          Chapter-wise
        </span>
      </PageHeader>

      <section className="grid min-w-0 gap-4 lg:grid-cols-2">
        <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
            Practice It Yourself inside Chapters
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Guided chapter checks</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Appears immediately after learning, stays tied to a specific subtopic, and checks the concept just studied.
          </p>
        </article>
        <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">General Practice</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Independent revision</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use this area chapter-wise for repeated practice, revision, and exam preparation outside the lesson flow.
          </p>
        </article>
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article
          aria-labelledby="recommended-practice-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Recommended Starting Practice</p>
          <h2 id="recommended-practice-title" className="mt-2 text-2xl font-black tracking-tight">
            Begin with Journal Entries
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Begin with Journal Entries to strengthen account identification, debit-credit logic, and complete entry
            presentation.
          </p>
          <Link
            href="/practice/journal-entries"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-black text-slate-950 outline-none transition hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Start Journal Entry Practice
          </Link>
        </article>

        <article
          aria-labelledby="notebook-practice-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">In-app vs notebook practice</p>
          <h2 id="notebook-practice-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Available now
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Practise and check answers directly inside AccyWise AI.
          </p>
          <h3 className="mt-5 text-base font-black text-slate-950">Later</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Notebook/photo answer checking will require safe handwriting recognition and OCR, so it is not available yet.
          </p>
        </article>
      </section>

      <section aria-labelledby="chapter-practice-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Chapter practice</p>
          <h2 id="chapter-practice-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Choose a chapter
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {availableItems.length} chapter practice area is available now. {upcomingItems.length} chapter practice areas
            are planned or later.
          </p>
        </div>
        <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {practiceChapterCatalog.map((item) => (
            <PracticeChapterCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="advanced-practice-beta-title"
        className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-cyan-50 p-5 shadow-sm sm:p-6"
      >
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Advanced Practice Beta</p>
              <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                Beta
              </span>
            </div>
            <h2 id="advanced-practice-beta-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Controlled advanced journal practice
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Practise selected Partnership and Company Accounts scenarios with explanations, Ledger Impact, Trial
              Balance Impact, and limited Final Accounts Impact where currently supported.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              This is a beta, not a complete Partnership or Company Accounts question bank.
            </p>
          </div>
          <Link
            href="/practice/advanced"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Open Advanced Practice Beta
          </Link>
        </div>
      </section>
    </StudentAppShell>
  );
}

function PracticeChapterCard({ item }: { item: PracticeChapterCatalogItem }) {
  return (
    <article
      aria-label={`${item.title} practice card`}
      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${
              statusStyles[item.status]
            }`}
          >
            {practiceChapterStatusLabels[item.status]}
          </span>
          {item.learningStage ? (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
              {item.learningStage}
            </span>
          ) : null}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.shortDescription}</p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-700">{item.availabilityNote}</p>
      {item.status === "available" && item.href ? (
        <Link
          href={item.href}
          className="mt-4 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-3 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {item.actionLabel}
        </Link>
      ) : (
        <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">{item.actionLabel}</p>
      )}
    </article>
  );
}
