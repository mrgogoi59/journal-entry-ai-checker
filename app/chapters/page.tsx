import type { Metadata } from "next";
import Link from "next/link";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  chapterStatusLabels,
  chapterStatusStyles,
  studentPlatformChapterCatalog,
  type ChapterCatalogItem,
} from "@/lib/learning-platform/chapter-catalog";

export const metadata: Metadata = {
  title: "Chapters | AccyWise AI",
  description: "Start with Journal Entries.",
};

const chapterDescriptions: Record<string, string> = {
  "accounting-fundamentals": "Learn basic accounting terms and equation.",
  "journal-entries": "Learn debit-credit rules and journal format.",
  ledger: "Post entries into account-wise format.",
  "trial-balance": "Check debit-credit totals and balances.",
  "bank-reconciliation-statement": "Match Cash Book and Bank Statement.",
  "rectification-of-errors": "Correct mistakes and suspense account entries.",
  "depreciation-provisions-and-reserves": "Learn asset and provision adjustments.",
  "final-accounts": "Prepare Trading, P&L, and Balance Sheet.",
  "bills-of-exchange": "Record bills, maturity, and dishonour.",
  "not-for-profit-accounts": "Prepare receipts, payments, and income statements.",
  "partnership-accounts": "Handle capital, drawings, and appropriations.",
  "company-accounts": "Learn shares, debentures, and company entries.",
} satisfies Record<ChapterCatalogItem["id"], string>;

export default function ChaptersPage() {
  return (
    <StudentAppShell activeItem="chapters">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Chapters</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Start with Journal Entries.</p>
      </header>

      <section aria-label="Accountancy chapter catalogue" className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studentPlatformChapterCatalog.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </section>
    </StudentAppShell>
  );
}

function ChapterCard({ chapter }: { chapter: ChapterCatalogItem }) {
  const statusLabel = chapterStatusLabels[chapter.status];

  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="min-w-0 text-lg font-black tracking-tight text-slate-950">{chapter.title}</h2>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-black ${chapterStatusStyles[chapter.status]}`}>
          {statusLabel}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{chapterDescriptions[chapter.id]}</p>

      {chapter.href ? (
        <Link
          href={chapter.href}
          className="mt-5 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {chapter.actionLabel}
        </Link>
      ) : null}
    </article>
  );
}
