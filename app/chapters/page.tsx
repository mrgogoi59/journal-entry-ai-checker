import type { Metadata } from "next";
import { PageHeader } from "@/components/student-platform/PageHeader";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  chapterStatusLabels,
  chapterStatusStyles,
  studentPlatformChapterCatalog,
  type ChapterCatalogItem,
} from "@/lib/learning-platform/chapter-catalog";

export const metadata: Metadata = {
  title: "Chapters | AccyWise AI",
  description:
    "Explore interactive Accountancy chapters for concepts, solved illustrations, Practice It Yourself, and chapter-wise learning on AccyWise AI.",
};

export default function ChaptersPage() {
  return (
    <StudentAppShell activeItem="chapters">
      <PageHeader
        eyebrow="Student platform"
        title="Chapters"
        description="Choose an Accountancy chapter. The production chapter experience will migrate one safe slice at a time, starting with Journal Entries."
      >
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-cyan-800">
          Phase 4A live route
        </span>
      </PageHeader>

      <section
        aria-labelledby="chapters-plan-title"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">What chapters will include</p>
        <h2 id="chapters-plan-title" className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
          Concepts, solved illustrations, Practice It Yourself, and chapter-wise progression
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
          This index is the first live production step. Journal Entries is ready for the next migration slice, while
          every other chapter is labelled honestly as planned or later until its learning flow is built and tested.
        </p>
      </section>

      <section aria-label="Accountancy chapter catalogue" className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studentPlatformChapterCatalog.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </section>
    </StudentAppShell>
  );
}

function ChapterCard({ chapter }: { chapter: ChapterCatalogItem }) {
  const statusLabel = chapterStatusLabels[chapter.status];

  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-black tracking-tight text-slate-950">{chapter.title}</h2>
          {chapter.level ? <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{chapter.level}</p> : null}
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-black ${chapterStatusStyles[chapter.status]}`}>
          {statusLabel}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{chapter.shortDescription}</p>

      <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
        {chapter.supportsProgressLater ? "Progress support can be added after the chapter route is approved." : "No progress tracking is wired in this phase."}
      </div>

      <div className="mt-5 inline-flex min-h-10 items-center self-start rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700">
        {chapter.actionLabel}
      </div>
    </article>
  );
}
