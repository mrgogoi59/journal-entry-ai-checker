import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AccyWise AI — Interactive Accountancy Learning",
  description: "Learn Accountancy by doing with chapters, practice checks, and Solver tools.",
};

const howItWorksSteps = ["Read a chapter", "Try Practice", "Use Solver if stuck"] as const;

const quickLinks = [
  { label: "Chapters", href: "/chapters" },
  { label: "Solver", href: "/solver" },
  { label: "Practice", href: "/practice" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-ink">
      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto grid w-full max-w-[1120px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">AccyWise AI</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-blue-950 sm:text-6xl">
              Learn Accountancy by Doing
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Start with Journal Entries, practise with checks, use Solver when stuck.
            </p>
            <Link
              href="/chapters/journal-entries"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-950 px-5 py-3 text-base font-black text-white shadow-soft outline-none transition hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Start Journal Entries
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="relative min-h-[260px] overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-700 p-6 shadow-soft sm:min-h-[340px]"
          >
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-300/25 blur-2xl" />
            <div className="absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-emerald-300/20 blur-2xl" />
            <div className="relative grid h-full min-h-[220px] content-center gap-4 sm:min-h-[300px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="h-3 w-28 rounded-full bg-cyan-200" />
                <div className="mt-5 grid gap-3">
                  <div className="h-10 rounded-xl bg-white/90" />
                  <div className="h-10 rounded-xl bg-white/70" />
                  <div className="h-10 rounded-xl bg-white/50" />
                </div>
              </div>
              <div className="ml-auto h-16 w-32 rounded-2xl border border-cyan-200/30 bg-cyan-200/20" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-it-works-title" className="border-y border-blue-100 bg-blue-50/70 px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-[1120px]">
          <h2 id="how-it-works-title" className="text-3xl font-black tracking-tight text-blue-950">
            How It Works
          </h2>
          <ol className="mt-6 grid min-w-0 gap-3 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <li key={step} className="rounded-2xl border border-blue-100 bg-white p-5 text-base font-black text-blue-950 shadow-sm">
                <span className="mr-2 text-cyan-700">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="quick-links-title" className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-[1120px]">
          <h2 id="quick-links-title" className="text-3xl font-black tracking-tight text-blue-950">
            Quick Links
          </h2>
          <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-base font-black text-blue-950 outline-none transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
