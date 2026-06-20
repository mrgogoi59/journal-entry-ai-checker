import type { ReactNode } from "react";
import Link from "next/link";

type ChapterStatus = "Available" | "Planned" | "Later";

const statusStyles: Record<ChapterStatus, string> = {
  Available: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Planned: "border-blue-200 bg-blue-50 text-blue-800",
  Later: "border-slate-200 bg-slate-100 text-slate-700",
};

export function SectionHeading({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{eyebrow}</p> : null}
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
      {body ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{body}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-600">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
      >
        <div className="h-full rounded-full bg-cyan-600" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-semibold text-slate-500">{note}</p>
    </article>
  );
}

export function StatusBadge({ status }: { status: ChapterStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function PreviewPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

export function ChapterCard({
  title,
  description,
  status,
  progress,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  status: ChapterStatus;
  progress?: number;
  actionLabel: string;
  href?: string;
}) {
  const actionClass =
    "mt-5 inline-flex min-h-10 items-center self-start rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";

  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 text-lg font-black tracking-tight text-slate-950">{title}</h2>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5">
        {typeof progress === "number" ? (
          <ProgressBar value={progress} label="Preview progress" />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
            Progress placeholder
          </div>
        )}
      </div>
      {href ? (
        <Link href={href} className={`${actionClass} hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900`}>
          {actionLabel}
        </Link>
      ) : (
        <div className={actionClass}>{actionLabel}</div>
      )}
    </article>
  );
}
