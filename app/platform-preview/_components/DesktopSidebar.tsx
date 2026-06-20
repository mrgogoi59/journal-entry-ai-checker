import Link from "next/link";
import { previewNavigationItems, type PreviewNavigationId } from "./navigation";

export function DesktopSidebar({ activeItem }: { activeItem: PreviewNavigationId }) {
  return (
    <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white/95 px-4 py-5 lg:block">
      <div className="flex h-full w-64 flex-col">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-white shadow-sm">
          <div className="text-base font-black tracking-tight">AccyWise AI</div>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-300">Platform preview</p>
        </div>

        <nav aria-label="Platform preview primary navigation" className="mt-6 space-y-1.5">
          {previewNavigationItems.map((item) => {
            const isActive = item.id === activeItem;
            const baseClass =
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";
            const markClass = `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
              isActive ? "bg-white text-slate-950" : "bg-slate-100 text-slate-700"
            }`;

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${baseClass} ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span className={markClass} aria-hidden="true">
                    {item.mark}
                  </span>
                  <span>{item.label}</span>
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
                <span className={markClass} aria-hidden="true">
                  {item.mark}
                </span>
                <span>{item.label}</span>
                <span className="ml-auto rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-slate-400">
                  Soon
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <p className="font-bold text-slate-900">Phase 3A</p>
          <p className="mt-1">Static founder-review shell. No live product behavior is wired here.</p>
        </div>
      </div>
    </aside>
  );
}
