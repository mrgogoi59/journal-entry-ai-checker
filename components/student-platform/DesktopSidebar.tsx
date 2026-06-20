import { NavigationItem } from "./NavigationItem";
import { studentPlatformNavigationItems, type StudentPlatformNavigationId } from "./navigation";

export function DesktopSidebar({ activeItem }: { activeItem: StudentPlatformNavigationId }) {
  return (
    <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white/95 px-4 py-5 lg:block">
      <div className="flex h-full w-64 flex-col">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-white shadow-sm">
          <div className="text-base font-black tracking-tight">AccyWise AI</div>
          <p className="mt-1 text-xs font-medium leading-5 text-slate-300">Student platform</p>
        </div>

        <nav aria-label="Student platform primary navigation" className="mt-6 space-y-1.5">
          {studentPlatformNavigationItems.map((item) => (
            <NavigationItem key={item.id} item={item} isActive={item.id === activeItem} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <p className="font-bold text-slate-900">Phase 4F</p>
          <p className="mt-1">Dashboard shortcuts are live; personal progress remains planned.</p>
        </div>
      </div>
    </aside>
  );
}
