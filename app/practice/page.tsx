import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  practiceChapterCatalog,
  practiceChapterStatusLabels,
  type PracticeChapterCatalogItem,
  type PracticeChapterStatus,
} from "@/lib/learning-platform/practice-catalog";

export const metadata: Metadata = {
  title: "Practice | AccyWise AI",
  description: "Start Journal Entries Practice.",
};

const statusStyles = {
  available: "border-cyan-200 bg-cyan-50 text-cyan-800",
  planned: "border-amber-200 bg-amber-50 text-amber-800",
  later: "border-slate-200 bg-slate-50 text-slate-600",
} satisfies Record<PracticeChapterStatus, string>;

const practiceDescriptions = {
  "accounting-fundamentals": "Practise basic terms and accounting concepts.",
  "journal-entries": "Practise beginner journal entries with instant checks.",
  ledger: "Practise account-wise posting and balances.",
  "trial-balance": "Practise debit-credit totals and balances.",
  "bank-reconciliation-statement": "Practise Cash Book and Bank differences.",
  "rectification-of-errors": "Practise correction entries and suspense account.",
  "depreciation-provisions-and-reserves": "Practise asset and provision adjustments.",
  "final-accounts": "Practise Trading, P&L, and Balance Sheet.",
  "bills-of-exchange": "Practise bills, maturity, and dishonour.",
  "not-for-profit-accounts": "Practise NPO statements and adjustments.",
  "partnership-accounts": "Practise partner capital and appropriation entries.",
  "company-accounts": "Practise shares, debentures, and company entries.",
} satisfies Record<PracticeChapterCatalogItem["id"], string>;

export default function PracticePage() {
  const availableItems = practiceChapterCatalog.filter((item) => item.status === "available");
  const plannedItems = practiceChapterCatalog.filter((item) => item.status === "planned");
  const laterItems = practiceChapterCatalog.filter((item) => item.status === "later");

  return (
    <StudentAppShell activeItem="practice">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Practice</h1>
        <Link
          href="/practice/journal-entries"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Start Journal Entries Practice
        </Link>
      </header>

      <PracticeSection title="Available" items={availableItems}>
        <AdvancedPracticeBetaCard />
      </PracticeSection>

      <PracticeSection title="Planned" items={plannedItems} />

      <PracticeSection title="Later" items={laterItems} />
    </StudentAppShell>
  );
}

function PracticeSection({
  title,
  items,
  children,
}: {
  title: string;
  items: readonly PracticeChapterCatalogItem[];
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={`${title.toLowerCase()}-practice-title`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 id={`${title.toLowerCase()}-practice-title`} className="text-2xl font-black tracking-tight text-slate-950">
        {title}
      </h2>
      <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <PracticeChapterCard key={item.id} item={item} />
        ))}
        {children}
      </div>
    </section>
  );
}

function PracticeChapterCard({ item }: { item: PracticeChapterCatalogItem }) {
  return (
    <article
      aria-label={`${item.title} practice card`}
      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="min-w-0 text-lg font-black text-slate-950">{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{practiceDescriptions[item.id]}</p>
      {item.href ? (
        <Link
          href={item.href}
          className="mt-4 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-3 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {item.actionLabel}
        </Link>
      ) : null}
    </article>
  );
}

function AdvancedPracticeBetaCard() {
  return (
    <article
      aria-label="Advanced Practice Beta practice card"
      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="min-w-0 text-lg font-black text-slate-950">Advanced Practice Beta</h3>
        <StatusBadge status="available" />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">Practise selected advanced accounting scenarios.</p>
      <Link
        href="/practice/advanced"
        className="mt-4 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-3 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        Open Beta
      </Link>
    </article>
  );
}

function StatusBadge({ status }: { status: PracticeChapterStatus }) {
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[status]}`}>
      {practiceChapterStatusLabels[status]}
    </span>
  );
}
