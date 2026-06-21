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
  PracticeItYourselfProduction,
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
  JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  journalEntriesChapter,
  toPracticeItYourselfPreviewQuestion,
} from "@/lib/learning-platform/chapters/journal-entries";
import type { ChapterSection, ChapterSubtopicDefinition, ChapterSubtopicReference } from "@/lib/learning-platform/types";
import {
  checkJournalEntriesPracticeAnswer,
  revealJournalEntriesPracticeCorrectAnswer,
} from "./actions";

export const PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH = "/chapters/journal-entries";

const chapter = journalEntriesChapter;

const practiceQuestionCountsBySectionId = new Map(
  chapter.subtopics.map((subtopic) => [subtopic.id, subtopic.practiceQuestionIds?.length ?? 0]),
);

export const productionJournalEntriesSectionRoutes = chapter.outline.map((item) => ({
  id: item.id,
  title: item.title,
  order: item.order,
  href: getProductionSectionHref(item.id),
  practiceQuestionCount: practiceQuestionCountsBySectionId.get(item.id) ?? 0,
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
  const earlySectionGuide = earlyJournalEntriesSectionGuides[subtopic.id];

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

          <HowToUseJournalEntriesCard />

          {subtopic.id === JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG ? <JournalEntriesOverviewCard /> : null}

          <ChapterProgress metadata={chapter.metadata} subtopic={subtopic} totalSections={chapter.outline.length} />

          {earlySectionGuide ? (
            <EarlySectionPilotGuideCard
              guide={earlySectionGuide}
              hasPracticeChecks={practiceSectionCount > 0}
              subtopic={subtopic}
            />
          ) : null}

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

const journalEntriesFirstPathSteps = [
  "Read the sections in order.",
  "Notice the accounting rule or logic.",
  "Try Practice It Yourself where available.",
  "Use Journal Entry Explainer if you get stuck.",
  "Use beginner practice for revision after learning.",
];

const overviewHighlights = [
  {
    title: "First recording step",
    body:
      "Journal Entries are the first step of Accountancy recording. Every business transaction is first analysed before it moves to Ledger, Trial Balance, and Final Accounts.",
  },
  {
    title: "What you will learn",
    body:
      "This chapter teaches accounts affected, debit-credit logic, cash, bank, goods, salary, capital, drawings, purchases, sales, expenses, and basic entry presentation.",
  },
  {
    title: "How learning works",
    body:
      "Read the idea, study examples, then practise by writing the full journal entry when Practice It Yourself appears.",
  },
];

const availabilityNotes = [
  "16 learning sections are available now.",
  "Exactly 2 Practice It Yourself checkers are live in Section 1.",
  "Most sections are read-only learning sections for now.",
  "More checking will be added later only after safe checker design.",
];

const recommendedPilotSteps = [
  "Start with the first section.",
  "Continue through the first few sections.",
  "Try the two Practice It Yourself checks when they appear.",
  "Use the Explainer if any account or debit-credit rule feels confusing.",
];

type EarlySectionGuide = {
  teaches: string;
  whyItMatters: string;
  watchFor: string;
  nextStep: string;
  ruleTitle: string;
  ruleBody: string;
  exampleTip: string;
};

const earlyJournalEntriesSectionGuides: Record<string, EarlySectionGuide> = {
  [JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG]: {
    teaches: "What a journal entry records, why debit equals credit, and how the basic journal format is written.",
    whyItMatters:
      "Every later chapter starts from this first record, so the format and equal totals need to feel natural early.",
    watchFor: "Do not write only one side. A complete entry needs at least one debit line and one credit line.",
    nextStep:
      "After reading the examples, try the two Practice It Yourself checks in this section before moving ahead.",
    ruleTitle: "Debit and credit must always balance",
    ruleBody:
      "A journal entry is complete only when the total debit amount equals the total credit amount for the same transaction.",
    exampleTip:
      "Read each example in this order: transaction, accounts affected, debit-credit reason, journal entry, then common mistake.",
  },
  [JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG]: {
    teaches: "Which events belong in the business books and how to spot the accounts affected by a transaction.",
    whyItMatters:
      "If an event is not a business transaction, there is no journal entry to write. This prevents guessing.",
    watchFor: "Future plans, personal events, and non-money events are usually not recorded as journal entries now.",
    nextStep:
      "Once you know an event is recordable, move to identifying the exact account names in the next section.",
    ruleTitle: "Record only business events measurable in money",
    ruleBody:
      "A recordable transaction should belong to the business and should have a reliable money amount.",
    exampleTip:
      "In each example, first decide whether it is recordable, then identify the accounts before thinking about Dr. or To.",
  },
  [JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG]: {
    teaches: "How to name the exact accounts affected before applying debit-credit rules.",
    whyItMatters:
      "Wrong account names lead to wrong entries even when the debit-credit side looks balanced.",
    watchFor: "Cash, bank, credit, goods, assets, capital, and drawings words are clues, not decoration.",
    nextStep:
      "After the account names are clear, classify those accounts in the next section before deciding debit or credit.",
    ruleTitle: "Name accounts before choosing Dr. or To",
    ruleBody:
      "First identify every affected account. Then classify each account and apply the debit-credit rule.",
    exampleTip:
      "While reading examples, pause at the accounts affected line and ask why Cash, Bank, Purchases, Sales, or a named person is used.",
  },
  [JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG]: {
    teaches: "How to classify accounts using modern categories and connect them with traditional categories.",
    whyItMatters:
      "Classification tells you the nature of the account, and the account nature prepares you for debit-credit rules.",
    watchFor: "Do not classify the whole transaction. Classify each account separately.",
    nextStep:
      "After classification feels clear, continue to Debit and Credit Rules to decide the correct side.",
    ruleTitle: "Classify the account, not the sentence",
    ruleBody:
      "Ask what each account represents to the business: asset, liability, capital, income, expense, or drawings.",
    exampleTip:
      "Use the examples as classification practice only. They prepare your thinking before full journal-entry treatment.",
  },
  [JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG]: {
    teaches: "How account nature and increase/decrease effects decide debit and credit treatment.",
    whyItMatters:
      "This is where account identification turns into a correct journal entry side: Dr. or To.",
    watchFor: "Debit is not always good and credit is not always bad. They are accounting sides.",
    nextStep:
      "After the rules are clear, continue to journal format and narration so the entry is presented properly.",
    ruleTitle: "Account nature plus effect decides the side",
    ruleBody:
      "Identify the account, classify it, decide whether it increases or decreases, then apply debit-credit rules.",
    exampleTip:
      "For each solved example, trace the logic from account type to increase/decrease before looking at the final entry.",
  },
};

function JournalEntriesOverviewCard() {
  return (
    <section
      aria-labelledby="journal-entries-overview-title"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Chapter overview</p>
          <h2
            id="journal-entries-overview-title"
            className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
          >
            Learn the first step of recording every transaction
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            A journal entry shows which account is debited, which account is credited, and why both sides stay equal.
            This chapter starts from the basics so you can build strong Accountancy logic before using Practice or Solver.
          </p>
          <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-3">
            {overviewHighlights.map((highlight) => (
              <article key={highlight.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-black text-slate-950">{highlight.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{highlight.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Available in this pilot</p>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-cyan-950">
            {availabilityNotes.map((note) => (
              <li key={note} className="rounded-xl border border-cyan-200 bg-white p-3">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Recommended start</p>
        <ol className="mt-4 grid min-w-0 gap-3 text-sm font-semibold leading-6 text-emerald-950 sm:grid-cols-2 xl:grid-cols-4">
          {recommendedPilotSteps.map((step, index) => (
            <li key={step} className="min-w-0 rounded-xl border border-emerald-200 bg-white p-3">
              <span className="font-black text-emerald-700">{index + 1}. </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`${PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH}#introduction-to-journal-entries`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Start first section
          </Link>
          <Link
            href="/journal-entry-solver"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Open Explainer
          </Link>
          <Link
            href="/practice/journal-entries"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Revise in Practice
          </Link>
          <Link
            href="/solver"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            Open Solver hub
          </Link>
        </div>
      </div>
    </section>
  );
}

function EarlySectionPilotGuideCard({
  guide,
  hasPracticeChecks,
  subtopic,
}: {
  guide: EarlySectionGuide;
  hasPracticeChecks: boolean;
  subtopic: ChapterSubtopicDefinition;
}) {
  const nextSectionHref = subtopic.nextSection ? getProductionSectionHref(subtopic.nextSection.slug) : null;
  const primaryAction = hasPracticeChecks
    ? {
        href: `${getProductionSectionHref(subtopic.slug)}#practice-it-yourself`,
        label: "Try Practice It Yourself here",
      }
    : nextSectionHref && subtopic.nextSection
      ? {
          href: nextSectionHref,
          label: `Continue to ${subtopic.nextSection.title}`,
        }
      : null;

  return (
    <section
      aria-labelledby={`${subtopic.id}-pilot-guide-title`}
      className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Section pilot guide</p>
          <h2 id={`${subtopic.id}-pilot-guide-title`} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Before you study {subtopic.title}
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-emerald-950">
            Use this section to slow down and understand the logic before memorising the final answer.
          </p>
        </div>
        <span className="self-start rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800">
          Pilot section
        </span>
      </div>

      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PilotGuideNote title="What this teaches" body={guide.teaches} />
        <PilotGuideNote title="Why it matters" body={guide.whyItMatters} />
        <PilotGuideNote title="Pay attention to" body={guide.watchFor} />
        <PilotGuideNote title="Next learning step" body={guide.nextStep} />
      </div>

      <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Rule to remember</p>
          <h3 className="mt-2 text-base font-black text-slate-950">{guide.ruleTitle}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{guide.ruleBody}</p>
        </article>
        <article className="min-w-0 rounded-2xl border border-cyan-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Study the examples</p>
          <h3 className="mt-2 text-base font-black text-slate-950">Follow the analysis, not just the answer</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{guide.exampleTip}</p>
        </article>
      </div>

      <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            {primaryAction.label}
          </Link>
        ) : null}
        <Link
          href="/journal-entry-solver"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Use Explainer if stuck
        </Link>
        <Link
          href="/practice/journal-entries"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Revise later in Practice
        </Link>
      </div>
    </section>
  );
}

function PilotGuideNote({ body, title }: { body: string; title: string }) {
  return (
    <article className="min-w-0 rounded-2xl border border-emerald-200 bg-white p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{body}</p>
    </article>
  );
}

function HowToUseJournalEntriesCard() {
  return (
    <section
      aria-labelledby="journal-entries-how-to-use-title"
      className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6"
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Recommended path</p>
      <h2 id="journal-entries-how-to-use-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        How to use this chapter
      </h2>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
        {journalEntriesFirstPathSteps.map((step, index) => (
          <div
            key={step}
            className="min-w-0 rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
          >
            <span className="font-black text-cyan-800">{index + 1}. </span>
            <span className="font-semibold">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/journal-entry-solver"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Open Journal Entry Explainer
        </Link>
        <Link
          href="/practice/journal-entries"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-950 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Practice Journal Entries
        </Link>
      </div>
    </section>
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
        <PracticeItYourselfProduction
          question={toPracticeItYourselfPreviewQuestion(section.question)}
          practiceNumber={practiceNumber ?? 0}
          practiceCount={practiceSectionCount}
          checkAnswerAction={checkJournalEntriesPracticeAnswer}
          revealCorrectAnswerAction={revealJournalEntriesPracticeCorrectAnswer}
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
