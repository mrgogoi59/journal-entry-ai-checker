"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { previewNavigationItems, type PreviewNavigationId } from "./navigation";

export function MobileHeader({ activeItem }: { activeItem: PreviewNavigationId }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const activeLabel = previewNavigationItems.find((item) => item.id === activeItem)?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-black tracking-tight text-slate-950">AccyWise AI</div>
          <p className="text-xs font-semibold text-slate-500">Preview: {activeLabel}</p>
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
            aria-label="Close platform preview navigation"
            className="fixed inset-0 z-40 cursor-default bg-slate-950/30"
            onClick={() => setIsOpen(false)}
          />
          <div
            id={menuId}
            className="fixed inset-x-3 top-3 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <p className="text-sm font-black text-slate-950">AccyWise AI</p>
                <p className="text-xs font-semibold text-slate-500">Platform preview navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-3 text-sm font-black text-slate-950 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>

            <nav aria-label="Platform preview mobile navigation" className="mt-3 space-y-1.5">
              {previewNavigationItems.map((item) => {
                const isActive = item.id === activeItem;
                const baseClass =
                  "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`${baseClass} ${
                        isActive
                          ? "bg-slate-950 text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                          isActive ? "bg-white text-slate-950" : "bg-slate-100 text-slate-700"
                        }`}
                        aria-hidden="true"
                      >
                        {item.mark}
                      </span>
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled
                    aria-disabled="true"
                    className={`${baseClass} cursor-not-allowed text-slate-400`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500"
                      aria-hidden="true"
                    >
                      {item.mark}
                    </span>
                    {item.label}
                    <span className="ml-auto rounded-full border border-slate-200 px-2 py-0.5 text-[11px] uppercase tracking-wide">
                      Soon
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
