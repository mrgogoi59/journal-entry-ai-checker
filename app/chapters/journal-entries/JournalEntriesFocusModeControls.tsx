"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import { NavigationItem } from "@/components/student-platform/NavigationItem";
import { studentPlatformNavigationItems } from "@/components/student-platform/navigation";

type FocusModeOutlineItem = {
  id: string;
  title: string;
  order: number;
  href: string;
  practiceQuestionCount?: number;
};

type OpenPanel = "menu" | "outline" | null;

export function JournalEntriesFocusModeControls({
  activeSectionId,
  outlineItems,
}: {
  activeSectionId: string;
  outlineItems: FocusModeOutlineItem[];
}) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const menuId = useId();
  const outlineId = useId();

  return (
    <section
      aria-label="Journal Entries focus tools"
      className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5"
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <button
          type="button"
          aria-controls={menuId}
          aria-expanded={openPanel === "menu"}
          aria-label="Open menu"
          onClick={() => setOpenPanel("menu")}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 shadow-sm outline-none transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          Menu
        </button>

        <div className="min-w-0 text-left sm:text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Focus mode</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            Open navigation or sections only when you need them.
          </p>
        </div>

        <button
          type="button"
          aria-controls={outlineId}
          aria-expanded={openPanel === "outline"}
          aria-label="Open outline"
          onClick={() => setOpenPanel("outline")}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 shadow-sm outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          View sections
        </button>
      </div>

      <FocusDrawer
        id={menuId}
        isOpen={openPanel === "menu"}
        label="Student platform navigation"
        onClose={() => setOpenPanel(null)}
        title="Menu"
        description="Move between the main AccyWise AI areas."
      >
        <nav aria-label="Student platform focus-mode navigation" className="mt-4 space-y-1.5">
          {studentPlatformNavigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={item.id === "chapters"}
              onNavigate={() => setOpenPanel(null)}
            />
          ))}
        </nav>
      </FocusDrawer>

      <FocusDrawer
        id={outlineId}
        isOpen={openPanel === "outline"}
        label="Journal Entries chapter outline"
        onClose={() => setOpenPanel(null)}
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
                  onClick={() => setOpenPanel(null)}
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
