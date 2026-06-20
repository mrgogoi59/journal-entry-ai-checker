import { PageHeader } from "./_components/PageHeader";
import { PreviewPanel, ProgressBar, SectionHeading, StatCard } from "./_components/PreviewCards";
import { StudentAppShell } from "./_components/StudentAppShell";
import { progressStats, recentActivity } from "./data";

export default function PlatformPreviewDashboardPage() {
  return (
    <StudentAppShell activeItem="dashboard">
      <PageHeader
        eyebrow="Phase 3A preview"
        title="Dashboard"
        description="A static, founder-review preview of the future student home. This route does not read or save real progress."
      >
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-cyan-800">
          Mock data
        </span>
      </PageHeader>

      <section
        aria-labelledby="dashboard-welcome-title"
        className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]"
      >
        <PreviewPanel className="bg-slate-950 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Welcome back</p>
          <h2 id="dashboard-welcome-title" className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Pick up the Journal Entries chapter from the next small concept.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This preview keeps the dashboard calm: continue learning, see a compact progress summary, and move to the
            next recommended topic without visual noise.
          </p>
        </PreviewPanel>

        <PreviewPanel>
          <SectionHeading
            eyebrow="Recommended next topic"
            title="Debit and credit logic"
            body="Review how account type decides the side before moving into capital and drawings."
          />
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Focus: identify the two accounts first, then decide which account increases or decreases.
          </div>
        </PreviewPanel>
      </section>

      <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <PreviewPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeading
              eyebrow="Continue learning"
              title="Journal Entries"
              body="Current subtopic: Journal format and debit-credit logic."
            />
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white opacity-80"
            >
              Continue Learning
            </button>
          </div>
          <div className="mt-6">
            <ProgressBar value={18} label="Journal Entries chapter preview progress" />
          </div>
          <p className="mt-4 text-xs font-semibold text-slate-500">
            Preview action only. No current Learn route, local storage, database, or progress tracking is changed.
          </p>
        </PreviewPanel>

        <PreviewPanel>
          <SectionHeading title="Recent Activity" body="Static examples for layout review." />
          <ul className="mt-5 space-y-3">
            {recentActivity.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </PreviewPanel>
      </section>

      <section aria-labelledby="progress-summary-title">
        <SectionHeading
          title="Progress summary"
          body="These cards use clearly labelled preview data only. Nothing is persisted."
        />
        <div id="progress-summary-title" className="sr-only">
          Progress summary
        </div>
        <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {progressStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </StudentAppShell>
  );
}
