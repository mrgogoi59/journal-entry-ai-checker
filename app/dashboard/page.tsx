import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/student-platform/PageHeader";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";

export const metadata: Metadata = {
  title: "Dashboard | AccyWise AI",
  description: "A student learning overview for chapters, practice, and accounting tools on AccyWise AI.",
};

const availabilityItems = [
  {
    title: "Chapters",
    detail: "1 production chapter available",
    note: "Journal Entries",
  },
  {
    title: "Interactive Practice",
    detail: "2 deterministic chapter questions available",
    note: "Cash sale and salary paid by bank",
  },
  {
    title: "Solver",
    detail: "Existing accounting tools available",
    note: "Journal Entry Explainer, Ledger, Trial Balance, Final Accounts, and BRS",
  },
  {
    title: "General Practice",
    detail: "Existing practice route available",
    note: "Beginner practice remains separate from chapter Practice It Yourself",
  },
] as const;

const quickActions = [
  {
    label: "Explore Chapters",
    href: "/chapters",
    description: "Open the production chapter library.",
  },
  {
    label: "Open Solver",
    href: "/tools",
    description: "Use the current accounting tools hub.",
  },
  {
    label: "Start Practice",
    href: "/practice",
    description: "Open independent practice and revision.",
  },
  {
    label: "Open Journal Entries",
    href: "/chapters/journal-entries",
    description: "Start the live structured Journal Entries chapter.",
  },
] as const;

const upcomingCapabilities = [
  "Saved progress",
  "Recent activity",
  "Weak-topic insights",
  "Revision recommendations",
  "Study streaks",
  "Cross-device access",
] as const;

export default function DashboardPage() {
  return (
    <StudentAppShell activeItem="dashboard">
      <PageHeader
        eyebrow="Student platform"
        title="Dashboard"
        description="Start learning, continue a chapter, or open a practice tool."
      >
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-700">
          Personal progress later
        </span>
      </PageHeader>

      <section
        aria-label="Dashboard progress note"
        className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950 shadow-sm sm:p-6"
      >
        Personal progress and cross-device history will be added in a later phase. For now, this dashboard gives honest
        shortcuts to the live chapter, tools, and practice areas.
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article
          aria-labelledby="start-learning-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Start Learning</p>
          <div className="mt-3 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h2 id="start-learning-title" className="text-2xl font-black tracking-tight text-slate-950">
                Journal Entries
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Structured concepts, solved illustrations, and complete-answer Practice It Yourself for the first live
                production chapter.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-slate-700">
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800">Available</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">16 learning sections</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                  2 interactive Practice It Yourself questions
                </span>
              </div>
            </div>
            <Link
              href="/chapters/journal-entries"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Open Journal Entries
            </Link>
          </div>
        </article>

        <article
          aria-labelledby="recommended-next-step-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">General recommendation</p>
          <h2 id="recommended-next-step-title" className="mt-3 text-2xl font-black tracking-tight">
            Recommended Next Step
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Begin with Journal Entries to build the foundation for Ledger, Trial Balance, and Final Accounts.
          </p>
          <Link
            href="/chapters/journal-entries"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-black text-slate-950 outline-none transition hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Start Journal Entries
          </Link>
        </article>
      </section>

      <section aria-labelledby="available-now-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Platform availability</p>
          <h2 id="available-now-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Available Now
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            These are product availability facts, not student performance or saved activity.
          </p>
        </div>
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {availabilityItems.map((item) => (
            <article key={item.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.detail}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="quick-actions-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="quick-actions-title" className="text-2xl font-black tracking-tight text-slate-950">
          Quick Actions
        </h2>
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 outline-none transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-black text-slate-950 group-hover:text-cyan-950">{action.label}</span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">{action.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        <article
          aria-labelledby="recent-activity-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 id="recent-activity-title" className="text-2xl font-black tracking-tight text-slate-950">
            Recent Activity
          </h2>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Your recent learning activity will appear here after progress tracking is introduced.
          </div>
          <Link
            href="/chapters/journal-entries"
            className="mt-5 inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-950 outline-none transition hover:border-cyan-300 hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Start with Journal Entries
          </Link>
        </article>

        <article
          aria-labelledby="learning-progress-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 id="learning-progress-title" className="text-2xl font-black tracking-tight text-slate-950">
            Learning Progress
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Chapter completion tracking is not enabled yet. Future versions will show completed sections, practice
            accuracy, and revision recommendations after a safe progress design is approved.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
            Coming later: progress summaries, practice review, and revision guidance.
          </div>
        </article>
      </section>

      <section aria-labelledby="upcoming-dashboard-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Planned</p>
          <h2 id="upcoming-dashboard-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Upcoming Dashboard capabilities
          </h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {upcomingCapabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-600"
            >
              {capability}: Planned
            </span>
          ))}
        </div>
      </section>
    </StudentAppShell>
  );
}
