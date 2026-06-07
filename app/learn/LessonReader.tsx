"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LessonContent } from "@/lib/learning-content";
import {
  getLessonProgress,
  markLessonCompleted,
  markLessonIncomplete,
  type LessonProgressItem,
} from "@/lib/lesson-progress";

export function LessonReader({ lesson }: { lesson: LessonContent }) {
  const [progressItem, setProgressItem] = useState<LessonProgressItem | undefined>(undefined);
  const isCompleted = Boolean(progressItem?.completed);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProgressItem(getLessonProgress().find((item) => item.lessonSlug === lesson.slug));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [lesson.slug]);

  function handleMarkCompleted() {
    const item = markLessonCompleted(lesson.slug);
    if (item) setProgressItem(item);
  }

  function handleMarkIncomplete() {
    const item = markLessonIncomplete(lesson.slug);
    if (item) setProgressItem(item);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-7">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
              Back to Learn
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
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Lesson</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">{lesson.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">{lesson.subtitle}</p>
            <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
              {lesson.description}
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">What you will learn</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lesson.whatYouWillLearn.map((item) => (
              <div key={item} className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-950">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Concept explanation" title="Understand the idea first" />
          <div className="mt-5 grid gap-4">
            {lesson.conceptSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h2 className="text-xl font-bold text-blue-950">{section.title}</h2>
                {section.rule ? (
                  <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
                    Rule: {section.rule}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2">
                  {section.body.map((line) => (
                    <p key={line} className="text-sm leading-6 text-slate-700">
                      {line}
                    </p>
                  ))}
                </div>
                {section.example ? (
                  <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-950">
                    Example: {section.example}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {lesson.modernRules ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Modern rules</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">Increase and decrease logic</h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-blue-100">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-950 text-left text-white">
                    <th className="px-4 py-3 font-semibold">Account type</th>
                    <th className="px-4 py-3 font-semibold">Increase</th>
                    <th className="px-4 py-3 font-semibold">Decrease</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.modernRules.map((rule) => (
                    <tr key={rule.accountType} className="border-b border-blue-50 last:border-b-0">
                      <td className="px-4 py-3 font-bold text-blue-950">{rule.accountType}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{rule.increase}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{rule.decrease ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 shadow-soft sm:p-6">
          <SectionHeader eyebrow="Visual flow" title="Mental model" />
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {lesson.visualFlow.map((step, index) => (
              <div key={step} className="rounded-xl border border-blue-100 bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-bold leading-6 text-blue-950">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Solved examples" title="See the rule in action" />
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {lesson.solvedExamples.map((example) => (
              <article key={example.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{example.title}</p>
                <h2 className="mt-2 text-lg font-bold leading-7 text-blue-950">{example.transaction}</h2>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-900">
                  {example.entry.join("\n")}
                </pre>
                <div className="mt-4 grid gap-2">
                  {example.logic.map((line) => (
                    <p key={line} className="text-sm leading-6 text-slate-700">
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <InfoList title="Common Mistakes" eyebrow="Avoid these" items={lesson.commonMistakes} />
          <InfoList title="Try It Yourself" eyebrow="Practice prompts" items={lesson.tryPrompts} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Connect with Accywise Tools</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Practice the same concept</h2>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {lesson.toolLinks.map((tool) => (
              <Link
                key={tool.href + tool.label}
                href={tool.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Finished this lesson?</p>
              <h2 className="mt-2 text-2xl font-bold text-blue-950">
                {isCompleted ? "Lesson completed" : "Mark your progress"}
              </h2>
              {isCompleted && progressItem?.completedAt ? (
                <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
                  Completed on {formatCompletedDate(progressItem.completedAt)}
                </p>
              ) : (
                <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
                  Save this lesson as complete on this browser.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={isCompleted ? handleMarkIncomplete : handleMarkCompleted}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              {isCompleted ? "Mark as Not Completed" : "Mark as Completed"}
            </button>
          </div>
        </section>

        {lesson.nextLesson ? (
          <section className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 to-emerald-800 p-6 text-white shadow-soft sm:p-8">
            <h2 className="text-3xl font-bold tracking-normal">Ready for the next step?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
              Keep the learning flow moving while the idea is fresh.
            </p>
            <Link
              href={lesson.nextLesson.href}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-950 transition hover:bg-blue-50"
            >
              {lesson.nextLesson.label}
            </Link>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function formatCompletedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">{title}</h2>
    </div>
  );
}

function InfoList({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
