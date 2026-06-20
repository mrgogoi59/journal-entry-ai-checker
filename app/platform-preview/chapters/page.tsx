import { ChapterCard, SectionHeading } from "../_components/PreviewCards";
import { PageHeader } from "../_components/PageHeader";
import { StudentAppShell } from "../_components/StudentAppShell";
import { chapterCards } from "../data";

export default function PlatformPreviewChaptersPage() {
  return (
    <StudentAppShell activeItem="chapters">
      <PageHeader
        eyebrow="Phase 3A preview"
        title="Chapters"
        description="A static chapter library preview based on the curriculum concept map. Only Journal Entries is shown as the first active prototype chapter."
      >
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-600">
          No chapter pages yet
        </span>
      </PageHeader>

      <section aria-labelledby="chapters-overview-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          title="Chapter roadmap"
          body="This preview separates available prototype scope from planned and later chapters, so students are not shown unsupported accounting coverage as complete."
        />
        <div id="chapters-overview-title" className="sr-only">
          Chapter roadmap
        </div>
      </section>

      <section aria-label="Accountancy chapter list" className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {chapterCards.map((chapter) => (
          <ChapterCard key={chapter.title} {...chapter} />
        ))}
      </section>
    </StudentAppShell>
  );
}
