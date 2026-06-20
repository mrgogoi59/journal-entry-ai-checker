import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/student-platform/PageHeader";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  AccountingEntryTable,
  ChapterCompletionBannerBlock,
  ChapterOutline,
  ChapterProgress,
  ChapterRecapGroupsBlock,
  ClassificationCategoriesBlock,
  ClassificationExamplesBlock,
  ClassificationGuideBlock,
  ClueGuideBlock,
  CommonMistakes,
  ComparisonBlock,
  ConceptSection,
  DebitCreditRuleGuideBlock,
  formatAccountingFormatRows,
  InteractivePracticeLinksBlock,
  JournalColumnGuideBlock,
  PracticeItYourselfPlaceholder,
  ProcessStepsBlock,
  productionText,
  ReflectionPrompt,
  ScopeRoadmapBlock,
  SolvedIllustration,
  TryBeforeRevealBlock,
  WorkedExample,
} from "./JournalEntriesLearningBlocks";
import {
  getJournalEntriesSubtopic,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  journalEntriesChapter,
} from "@/lib/learning-platform/chapters/journal-entries";
import type { ChapterSection, ChapterSubtopicDefinition, ChapterSubtopicReference } from "@/lib/learning-platform/types";

export const PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH = "/chapters/journal-entries";

const chapter = journalEntriesChapter;

export const productionJournalEntriesSectionRoutes = chapter.outline.map((item) => ({
  id: item.id,
  title: item.title,
  order: item.order,
  href: getProductionSectionHref(item.id),
}));

export function getProductionSectionHref(slug: string) {
  return slug === JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG
    ? PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH
    : `${PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH}/${slug}`;
}

export function JournalEntriesSectionPage({ sectionSlug }: { sectionSlug: string }) {
  const subtopic = getJournalEntriesSubtopic(sectionSlug);

  if (!subtopic) {
    notFound();
  }

  const practiceSectionCount = subtopic.sections.filter((section) => section.type === "practice-it-yourself").length;
  const sectionsWithNumbers = getNumberedSections(subtopic.sections);

  return (
    <StudentAppShell activeItem="chapters">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <ChapterOutline
          chapter={chapter}
          activeSectionId={subtopic.id}
          outlineItems={productionJournalEntriesSectionRoutes}
        />

        <div className="min-w-0 space-y-5 sm:space-y-6">
          <PageHeader
            eyebrow="Journal Entries chapter"
            title={chapter.metadata.title}
            description="Learn Journal Entries through concepts, solved illustrations, and structured chapter progression."
          >
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-cyan-800">
              {chapter.metadata.levelLabel}
            </span>
          </PageHeader>

          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
            <Link
              href="/chapters"
              className="text-cyan-800 outline-none hover:text-cyan-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Chapters
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH}
              className="text-cyan-800 outline-none hover:text-cyan-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Journal Entries
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-950">{subtopic.title}</span>
          </nav>

          <ChapterProgress metadata={chapter.metadata} subtopic={subtopic} totalSections={chapter.outline.length} />

          {sectionsWithNumbers.map(({ section, solvedIllustrationNumber, practiceNumber }) => (
            <ChapterSectionRenderer
              key={section.id}
              section={section}
              solvedIllustrationNumber={solvedIllustrationNumber}
              practiceNumber={practiceNumber}
              practiceSectionCount={practiceSectionCount}
            />
          ))}

          <SectionNavigation subtopic={subtopic} />
        </div>
      </div>
    </StudentAppShell>
  );
}

function getNumberedSections(sections: ChapterSection[]) {
  let solvedIllustrationCount = 0;
  let practiceCount = 0;

  return sections.map((section) => {
    if (section.type === "practice-it-yourself") {
      practiceCount += 1;
      return { section, practiceNumber: practiceCount };
    }

    if (section.type !== "solved-illustration") {
      return { section };
    }

    solvedIllustrationCount += 1;
    return { section, solvedIllustrationNumber: solvedIllustrationCount };
  });
}

function ChapterSectionRenderer({
  section,
  solvedIllustrationNumber,
  practiceNumber,
  practiceSectionCount,
}: {
  section: ChapterSection;
  solvedIllustrationNumber?: number;
  practiceNumber?: number;
  practiceSectionCount: number;
}) {
  switch (section.type) {
    case "learning-objective":
      return (
        <section id={section.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{productionText(section.eyebrow)}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {productionText(section.title)}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{productionText(section.body)}</p>
        </section>
      );

    case "concept-explanation":
      return (
        <ConceptSection eyebrow={section.eyebrow} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{productionText(paragraph)}</p>
          ))}
        </ConceptSection>
      );

    case "comparison":
      return <ComparisonBlock section={section} />;

    case "process-steps":
      return <ProcessStepsBlock section={section} />;

    case "clue-guide":
      return <ClueGuideBlock section={section} />;

    case "classification-categories":
      return <ClassificationCategoriesBlock section={section} />;

    case "classification-guide":
      return <ClassificationGuideBlock section={section} />;

    case "classification-examples":
      return <ClassificationExamplesBlock section={section} />;

    case "debit-credit-rule-guide":
      return <DebitCreditRuleGuideBlock section={section} />;

    case "journal-column-guide":
      return <JournalColumnGuideBlock section={section} />;

    case "accounting-format":
      return (
        <ConceptSection eyebrow={section.eyebrow} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{productionText(paragraph)}</p>
          ))}
          <AccountingEntryTable
            caption="Blank journal format"
            rows={formatAccountingFormatRows(section.formatRows)}
          />
        </ConceptSection>
      );

    case "simple-example":
      return <WorkedExample section={section} />;

    case "solved-illustration":
      return <SolvedIllustration number={solvedIllustrationNumber ?? 0} illustration={section.illustration} />;

    case "practice-it-yourself":
      return (
        <PracticeItYourselfPlaceholder
          section={section}
          practiceNumber={practiceNumber ?? 0}
          practiceCount={practiceSectionCount}
        />
      );

    case "common-mistakes":
      return <CommonMistakes section={section} />;

    case "try-before-reveal":
      return <TryBeforeRevealBlock section={section} />;

    case "chapter-completion-banner":
      return <ChapterCompletionBannerBlock section={section} />;

    case "chapter-recap-groups":
      return <ChapterRecapGroupsBlock section={section} />;

    case "interactive-practice-links":
      return <InteractivePracticeLinksBlock section={section} />;

    case "scope-roadmap":
      return <ScopeRoadmapBlock section={section} />;

    case "recap":
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{productionText(section.title)}</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
            {section.points.map((point) => (
              <li key={point}>{productionText(point)}</li>
            ))}
          </ul>
        </section>
      );

    case "reflection-prompt":
      return <ReflectionPrompt section={section} />;

    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}

function SectionNavigation({ subtopic }: { subtopic: ChapterSubtopicDefinition }) {
  if (!subtopic.nextSection) {
    return (
      <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <NavigationTarget direction="previous" target={subtopic.previousSection} />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Review from Beginning
          </Link>
          <Link
            href="/chapters"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 outline-none transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Back to Chapters
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      {subtopic.previousSection ? <NavigationTarget direction="previous" target={subtopic.previousSection} /> : <span />}
      <NavigationTarget direction="next" target={subtopic.nextSection} />
    </section>
  );
}

function NavigationTarget({
  direction,
  target,
}: {
  direction: "previous" | "next";
  target?: ChapterSubtopicReference;
}) {
  if (!target) {
    return null;
  }

  const prefix = direction === "previous" ? "Previous" : "Continue to";

  return (
    <Link
      href={getProductionSectionHref(target.slug)}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
    >
      {prefix} {target.title}
    </Link>
  );
}
