import type { Metadata } from "next";
import Link from "next/link";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";

export const metadata: Metadata = {
  title: "Dashboard | AccyWise AI",
  description: "Start Journal Entries and open quick links.",
};

const quickActions = [
  {
    label: "Chapters",
    href: "/chapters",
  },
  {
    label: "Solver",
    href: "/solver",
  },
  {
    label: "Practice",
    href: "/practice",
  },
  {
    label: "Journal Entries",
    href: "/chapters/journal-entries",
  },
] as const;

const availabilityItems = [
  {
    title: "Journal Entries",
    detail: "1 chapter",
  },
  {
    title: "Practice Questions",
    detail: "2 questions",
  },
  {
    title: "Solver Tools",
    detail: "5 tools",
  },
] as const;

const upcomingCapabilities = [
  "Progress tracking",
  "Recent activity",
  "Weak-topic insights",
  "Revision recommendations",
  "Cross-device access",
] as const;

export default function DashboardPage() {
  return (
    <StudentAppShell activeItem="dashboard">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Dashboard</h1>
        <Link
          href="/chapters/journal-entries"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Start Journal Entries
        </Link>
      </header>

      <section aria-labelledby="quick-actions-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="quick-actions-title" className="text-2xl font-black tracking-tight text-slate-950">
          Quick Links
        </h2>
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 outline-none transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-black text-slate-950 group-hover:text-cyan-950">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="available-now-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="available-now-title" className="text-2xl font-black tracking-tight text-slate-950">
          Available Now
        </h2>
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
          {availabilityItems.map((item) => (
            <article key={item.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="coming-soon-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="coming-soon-title" className="text-2xl font-black tracking-tight text-slate-950">
          Coming Soon
        </h2>
        <ul className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingCapabilities.map((capability) => (
            <li key={capability} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-700">
              {capability}
            </li>
          ))}
        </ul>
      </section>
    </StudentAppShell>
  );
}
