"use client";

import Link from "next/link";
import type { StudentPlatformNavigationItem } from "./navigation";

type NavigationItemProps = {
  item: StudentPlatformNavigationItem;
  isActive: boolean;
  onNavigate?: () => void;
};

export function NavigationItem({ item, isActive, onNavigate }: NavigationItemProps) {
  const baseClass =
    "flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";
  const markClass = `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
    isActive ? "bg-white text-slate-950" : "bg-slate-100 text-slate-700"
  }`;

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onClick={onNavigate}
        className={`${baseClass} ${
          isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
        }`}
      >
        <span className={markClass} aria-hidden="true">
          {item.mark}
        </span>
        <span className="min-w-0 truncate">{item.label}</span>
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className={`${baseClass} cursor-default text-slate-400`}
      title={`${item.label} is coming soon`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500" aria-hidden="true">
        {item.mark}
      </span>
      <span className="min-w-0 truncate">{item.label}</span>
      <span className="ml-auto shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-slate-400">
        Coming soon
      </span>
    </div>
  );
}
