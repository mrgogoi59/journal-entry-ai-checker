import Link from "next/link";
import { comingSoonLessons, lessonCards } from "@/lib/learning-content";

const learningPath = [
  "Rules of debit and credit",
  "Journal entry format",
  "Practice by topic",
  "Check mistakes",
  "Move to ledger and final accounts",
];

const toolConnections = [
  {
    title: "Understand",
    text: "Read a lesson first so the accounting rule feels clear.",
  },
  {
    title: "Practice",
    text: "Use topic-wise practice to solve questions after learning the concept.",
  },
  {
    title: "Check",
    text: "Use the checker or explainer when an answer feels confusing.",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-7">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-blue-800 transition hover:text-blue-950">
              Back to Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
              Learning Tools
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
              Practice
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/dashboard" className="text-blue-800 transition hover:text-blue-950">
              Dashboard
            </Link>
          </nav>
          <div className="mt-7 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Visual reader</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
              Learn Accountancy Step by Step
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Build your accountancy foundation with simple explanations, examples, mistakes, and practice links.
            </p>
            <p className="mt-5 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
              Start with concepts, then use the tools to practice and check your understanding.
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learning path</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Start with rules, then practice</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {learningPath.map((step, index) => (
              <div key={step} className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-bold leading-6 text-blue-950">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Lessons</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">Foundation lessons</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {lessonCards.map((lesson) => (
              <Link key={lesson.href} href={lesson.href} className="group">
                <article className="flex h-full min-h-52 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition group-hover:border-blue-200 group-hover:bg-blue-50">
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 ring-8 ring-emerald-50" />
                    <h3 className="mt-5 text-xl font-bold text-blue-950">{lesson.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.description}</p>
                  </div>
                  <span className="mt-5 text-sm font-bold text-blue-800">Start Lesson</span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Coming soon</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">More topics planned</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comingSoonLessons.map((lesson) => (
              <article key={lesson} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-blue-950">{lesson}</h3>
                <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                  Coming soon
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-soft sm:p-6">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Connect with tools</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">How learning connects with Accywise</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {toolConnections.map((item) => (
              <article key={item.title} className="rounded-xl border border-blue-100 bg-white p-4">
                <h3 className="text-lg font-bold text-blue-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 to-emerald-800 p-6 text-white shadow-soft sm:p-8">
          <h2 className="text-3xl font-bold tracking-normal">Learn one idea, then solve one entry</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
            Start with debit-credit rules, then use Practice or the Explainer to test the same idea immediately.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/learn/rules-of-debit-and-credit"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-950 transition hover:bg-blue-50"
            >
              Start First Lesson
            </Link>
            <Link
              href="/practice"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Open Practice
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
