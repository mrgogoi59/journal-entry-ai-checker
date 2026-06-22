"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useId, useState } from "react";

type FocusModeOutlineItem = {
  id: string;
  title: string;
  order: number;
  href: string;
  practiceQuestionCount?: number;
};

export function JournalEntriesFocusModeControls({
  activeSectionId,
  chapterStartHref,
  outlineItems,
  showChapterOverview = false,
}: {
  activeSectionId: string;
  chapterStartHref: string;
  outlineItems: FocusModeOutlineItem[];
  showChapterOverview?: boolean;
}) {
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const outlineId = useId();

  return (
    <>
      {showChapterOverview ? (
        <JournalEntriesOverviewCard
          chapterStartHref={chapterStartHref}
          isOutlineOpen={isOutlineOpen}
          outlineId={outlineId}
          onOpenOutline={() => setIsOutlineOpen(true)}
        />
      ) : (
        <section aria-label="Journal Entries section tools" className="flex min-w-0 justify-end">
          <button
            type="button"
            aria-controls={outlineId}
            aria-expanded={isOutlineOpen}
            aria-label="Open outline"
            onClick={() => setIsOutlineOpen(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 shadow-sm outline-none transition hover:border-cyan-400 hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            View sections
          </button>
        </section>
      )}

      <FocusDrawer
        id={outlineId}
        isOpen={isOutlineOpen}
        label="Journal Entries chapter outline"
        onClose={() => setIsOutlineOpen(false)}
        title="Chapter outline"
        description="Choose a section and continue in order."
      >
        <ol className="mt-4 space-y-2">
          {outlineItems.map((item) => {
            const isActive = item.id === activeSectionId;
            const practiceQuestionCount = item.practiceQuestionCount ?? 0;
            const practiceCheckLabel = practiceQuestionCount === 1 ? "practice check" : "practice checks";
            const sectionModeLabel = practiceQuestionCount > 0 ? `${practiceQuestionCount} ${practiceCheckLabel}` : null;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => setIsOutlineOpen(false)}
                  className={`flex min-h-11 items-start gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-cyan-200 bg-cyan-50 font-black text-cyan-950"
                      : "border-slate-200 bg-white font-bold text-slate-800 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-950"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                      isActive ? "bg-cyan-700 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block">{item.title}</span>
                    {sectionModeLabel ? (
                      <span className="mt-1 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
                        {sectionModeLabel}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </FocusDrawer>
    </>
  );
}

function JournalEntriesOverviewCard({
  chapterStartHref,
  isOutlineOpen,
  onOpenOutline,
  outlineId,
}: {
  chapterStartHref: string;
  isOutlineOpen: boolean;
  onOpenOutline: () => void;
  outlineId: string;
}) {
  return (
    <section
      aria-labelledby="journal-entries-overview-title"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Chapter</p>
        <h1
          id="journal-entries-overview-title"
          className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
        >
          Journal Entries
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-700">
          Learn debit-credit rules and journal format.
        </p>
      </div>

      <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={chapterStartHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Start Chapter
        </Link>
        <button
          type="button"
          aria-controls={outlineId}
          aria-expanded={isOutlineOpen}
          aria-label="Open outline"
          onClick={onOpenOutline}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          View Sections
        </button>
      </div>
    </section>
  );
}

function FocusDrawer({
  children,
  description,
  id,
  isOpen,
  label,
  onClose,
  title,
}: {
  children: ReactNode;
  description: string;
  id: string;
  isOpen: boolean;
  label: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <>
      <button
        type="button"
        aria-label={`Close ${label}`}
        className={`${isOpen ? "fixed" : "hidden"} inset-0 z-40 cursor-default bg-slate-950/35`}
        onClick={onClose}
      />
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label={label}
        className={`${
          isOpen ? "fixed" : "hidden"
        } inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white p-4 shadow-2xl sm:p-5`}
      >
        <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="min-w-0">
            <p className="text-lg font-black tracking-tight text-slate-950">{title}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 shrink-0 items-center rounded-xl border border-slate-300 px-3 text-sm font-black text-slate-950 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
