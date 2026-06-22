"use client";

import { useId, useState } from "react";
import { NavigationItem } from "./NavigationItem";
import { studentPlatformNavigationItems, type StudentPlatformNavigationId } from "./navigation";

export function MobileHeader({
  activeItem,
  focusMode = false,
}: {
  activeItem: StudentPlatformNavigationId;
  focusMode?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const activeLabel = studentPlatformNavigationItems.find((item) => item.id === activeItem)?.label ?? "Chapters";
  const headerClass = focusMode
    ? "sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10 xl:px-12"
    : "sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden";
  const innerClass = focusMode
    ? "mx-auto flex w-full max-w-6xl min-w-0 items-center justify-between gap-3"
    : "flex min-w-0 items-center justify-between gap-3";

  return (
    <header className={headerClass}>
      <div className={innerClass}>
        <div className="min-w-0">
          <div className="truncate text-base font-black tracking-tight text-slate-950">AccyWise AI</div>
          <p className="text-xs font-semibold text-slate-500">Student platform: {activeLabel}</p>
        </div>
        <button
          type="button"
          aria-controls={menuId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 shadow-sm outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Menu
        </button>
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close student platform navigation"
            className="fixed inset-0 z-40 cursor-default bg-slate-950/30"
            onClick={() => setIsOpen(false)}
          />
          <div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Student platform navigation"
            className="fixed inset-x-3 top-3 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">AccyWise AI</p>
                <p className="text-xs font-semibold text-slate-500">Student platform navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-3 text-sm font-black text-slate-950 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>

            <nav aria-label="Student platform mobile navigation" className="mt-3 space-y-1.5">
              {studentPlatformNavigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItem}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
