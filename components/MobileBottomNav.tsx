"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Start",
    href: "/learn",
    isActive: (pathname: string) => pathname === "/dashboard" || pathname === "/learn" || pathname.startsWith("/learn/"),
  },
  {
    label: "Practice",
    href: "/practice",
    isActive: (pathname: string) => pathname === "/practice",
  },
  {
    label: "Tools",
    href: "/tools",
    isActive: (pathname: string) =>
      pathname === "/tools" ||
      pathname === "/journal-entry-solver" ||
      pathname === "/ledger" ||
      pathname === "/trial-balance" ||
      pathname === "/final-accounts",
  },
  {
    label: "Home",
    href: "/",
    isActive: (pathname: string) => pathname === "/",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/platform-preview") || pathname === "/chapters" || pathname.startsWith("/chapters/")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white/95 px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2 rounded-2xl border border-blue-50 bg-white p-1.5 shadow-soft">
        {navItems.map((item) => {
          const isActive = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-12 items-center justify-center rounded-xl px-2 text-xs font-bold transition ${
                isActive
                  ? "bg-blue-900 text-white shadow-soft"
                  : "text-blue-950 hover:bg-blue-50 hover:text-blue-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
