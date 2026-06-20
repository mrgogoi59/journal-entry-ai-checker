import type { Metadata } from "next";
import Link from "next/link";
import { studentPlatformNavigationItems } from "@/components/student-platform/navigation";

export const metadata: Metadata = {
  title: "AccyWise AI — Interactive Accountancy Learning",
  description:
    "Learn Accountancy with structured chapters, solved illustrations, Practice It Yourself, and accounting solver tools on AccyWise AI.",
};

const valuePoints = [
  "Structured chapter learning",
  "Solved illustrations before practice",
  "Complete-answer Practice It Yourself",
  "Solver tools for quick doubts",
];

const learningFlow = ["Chapters", "Concept", "Illustration", "Practice It Yourself", "Solver"];

const platformAreas = [
  {
    label: "Dashboard",
    status: "Available",
    description: "Learning shortcuts are available now; personal saved progress remains planned for a later phase.",
    href: "/dashboard",
    actionLabel: "Open Dashboard",
  },
  {
    label: "Chapters",
    status: "Available",
    description: "Structured concepts, solved illustrations, and complete-answer Practice It Yourself learning.",
    href: "/chapters",
    actionLabel: "Explore Chapters",
  },
  {
    label: "Solver",
    status: "Available",
    description: "Journal Entry Explainer and existing accounting tools for immediate step-by-step support.",
    href: "/tools",
    actionLabel: "Open Solver",
  },
  {
    label: "Practice",
    status: "Available",
    description: "Independent chapter-wise and topic-wise practice for revision outside the chapter flow.",
    href: "/practice",
    actionLabel: "Start Practice",
  },
  {
    label: "AI Assistant",
    status: "Coming soon",
    description: "Personalised explanations and doubt support after the grounded tutor design is approved.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-ink">
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <nav
          aria-label="Primary platform navigation"
          className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/"
            className="self-start text-xl font-bold text-blue-950 outline-none transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            AccyWise AI
          </Link>
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-bold sm:justify-end">
            {studentPlatformNavigationItems.map((item) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-blue-100 px-3 py-2 text-slate-700 outline-none transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.id}
                  aria-disabled="true"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
                >
                  <span>{item.label}</span>
                  <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide">
                    Coming soon
                  </span>
                </span>
              ),
            )}
          </div>
        </nav>
      </header>

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-[1120px]">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">
            Interactive accountancy learning
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-normal text-blue-950 sm:text-6xl">
            Learn Accountancy through chapters, solved illustrations, and practice.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            Start with the live Journal Entries chapter, use solver tools when you need quick help, and keep beginner
            practice separate for independent revision.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/chapters"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft outline-none transition hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Explore Chapters
            </Link>
            <Link
              href="/tools"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-base font-bold text-blue-950 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Open Solver
            </Link>
            <Link
              href="/practice"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-base font-bold text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Start Practice
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-blue-50/70 px-4 py-5 sm:px-6">
        <div className="mx-auto grid w-full max-w-[1120px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {valuePoints.map((point) => (
            <div
              key={point}
              className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-blue-950 shadow-sm"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="journal-entries-launch-title" className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid w-full max-w-[1120px] gap-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Now available</p>
            <h2 id="journal-entries-launch-title" className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">
              Journal Entries chapter is now available
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
              Learn through structured learning, solved illustrations, and complete-answer Practice It Yourself for the
              two audited Journal Entries questions.
            </p>
          </div>
          <Link
            href="/chapters/journal-entries"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-sm font-black text-white outline-none transition hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Start Journal Entries
          </Link>
        </div>
      </section>

      <section id="platform-overview" aria-labelledby="platform-overview-title" className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionHeader
            eyebrow="The platform"
            title="Five clear areas, with honest availability"
            body="Dashboard, Chapters, Solver, and Practice are available today. AI Assistant stays clearly marked as coming soon until its foundation is ready."
          />
          <div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {platformAreas.map((area) => (
              <article
                key={area.label}
                aria-label={`${area.label} overview`}
                className="flex min-w-0 flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-soft"
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="text-lg font-bold text-blue-950">{area.label}</h3>
                  <span
                    className={`self-start rounded-full border px-2.5 py-1 text-xs font-black ${
                      area.status === "Available"
                        ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {area.status}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{area.description}</p>
                {"href" in area ? (
                  <Link
                    href={area.href}
                    className="mt-5 inline-flex min-h-10 items-center self-start rounded-xl border border-blue-200 px-3 text-sm font-bold text-blue-950 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                  >
                    {area.actionLabel}
                  </Link>
                ) : (
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">No live route yet</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionHeader
            eyebrow="How it works"
            title="Move from concept to checked answer"
            body="Use chapters for structured study, then use the solver and practice areas when you want targeted help or revision."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {learningFlow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-blue-950">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-800 p-6 text-white shadow-soft sm:p-10 lg:max-w-[1120px]">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">Start with Journal Entries today</h2>
            <p className="mt-4 text-base leading-7 text-blue-50">
              The first production chapter is ready for structured learning and two complete-answer practice checks.
            </p>
            <Link
              href="/chapters/journal-entries"
              className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-950 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Start Journal Entries
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-bold text-blue-950">AccyWise AI</div>
            <p className="mt-1">Built for commerce students</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 font-semibold text-slate-700">
            <Link href="/chapters" className="hover:text-blue-900">
              Chapters
            </Link>
            <Link href="/tools" className="hover:text-blue-900">
              Solver
            </Link>
            <Link href="/practice" className="hover:text-blue-900">
              Practice
            </Link>
            <Link href="/how-to-use" className="hover:text-blue-900">
              How to Use
            </Link>
            <Link href="/supported-transactions" className="hover:text-blue-900">
              Supported Topics
            </Link>
            <span>Report issues through the app</span>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
    </div>
  );
}
