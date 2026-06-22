import type { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileHeader } from "./MobileHeader";
import type { StudentPlatformNavigationId } from "./navigation";

export function StudentAppShell({
  activeItem,
  children,
  focusMode = false,
}: {
  activeItem: StudentPlatformNavigationId;
  children: ReactNode;
  focusMode?: boolean;
}) {
  const layoutClass = focusMode ? "lg:min-h-screen" : "lg:grid lg:min-h-screen lg:grid-cols-[17rem_minmax(0,1fr)]";
  const mainClass = focusMode ? "min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-10 xl:px-12" : "min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:px-8";
  const contentClass = focusMode ? "mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6" : "mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <a
        href="#student-platform-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-slate-950 focus:shadow-xl"
      >
        Skip to student platform content
      </a>
      <MobileHeader activeItem={activeItem} focusMode={focusMode} />
      <div className={layoutClass}>
        {focusMode ? null : <DesktopSidebar activeItem={activeItem} />}
        <main id="student-platform-content" className={mainClass}>
          <div className={contentClass}>{children}</div>
        </main>
      </div>
    </div>
  );
}
