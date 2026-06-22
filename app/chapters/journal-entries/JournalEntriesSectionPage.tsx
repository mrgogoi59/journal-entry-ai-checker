import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  AccountingEntryTable,
  ChapterCompletionBannerBlock,
  ChapterOutline,
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
  JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
  JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
  JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
  JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
  JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
  JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
  JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
  JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
  JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
  JOURNAL_ENTRIES_SALES_SECTION_SLUG,
  JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  journalEntriesChapter,
  toPracticeItYourselfPreviewQuestion,
} from "@/lib/learning-platform/chapters/journal-entries";
import type { ChapterSection, ChapterSubtopicDefinition } from "@/lib/learning-platform/types";
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
          {subtopic.id === JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG ? <JournalEntriesOverviewCard /> : null}

          <SectionIntroCard subtopic={subtopic} />

          {earlySectionGuide ? (
            <SectionLearningGuideCard
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
  [JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG]: {
    teaches: "How to place Date, Particulars, L.F., debit amount, credit amount, Dr., To, and narration correctly.",
    whyItMatters:
      "Even when the account logic is correct, poor format can make the entry incomplete or hard to post later.",
    watchFor: "Do not skip narration, Dr., To, or equal debit-credit totals just because the account names look correct.",
    nextStep:
      "After the format feels clear, continue to Cash and Bank Transactions to apply it to common payment modes.",
    ruleTitle: "Format shows the accounting logic clearly",
    ruleBody:
      "Write the debit account first with Dr., write the credited account below with To, and keep debit and credit totals equal.",
    exampleTip:
      "Study the column placement in each example, especially where Dr., To, debit amount, credit amount, and narration appear.",
  },
  [JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG]: {
    teaches: "How Cash A/c and Bank A/c differ when money is received, paid, deposited, withdrawn, or transferred.",
    whyItMatters:
      "Cash in hand and bank balance are separate assets, so choosing the wrong account changes the whole entry.",
    watchFor: "Do not mix physical cash with bank payments, cheques, UPI, NEFT, or bank transfers.",
    nextStep:
      "After cash and bank feel separate, continue to Capital to see how money brought into business is recorded.",
    ruleTitle: "Cash in hand and bank balance are different",
    ruleBody:
      "Use Cash A/c for physical cash. Use Bank A/c for cheque, UPI, NEFT, bank transfer, or direct bank movement.",
    exampleTip:
      "In each example, underline the payment-mode word first, then decide whether Cash A/c or Bank A/c is affected.",
  },
  [JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG]: {
    teaches: "How owner or partner contribution is recorded when money or value is brought into the business.",
    whyItMatters:
      "Capital is the owner's claim in the business. It is not sales, income, or a normal receipt.",
    watchFor: "Do not confuse capital introduced by the owner with income earned from customers.",
    nextStep:
      "After capital feels clear, continue to Drawings to learn the opposite idea: personal withdrawal from business.",
    ruleTitle: "Capital increases the owner's claim",
    ruleBody:
      "When the owner brings value into the business, debit the asset received and credit the owner's Capital A/c.",
    exampleTip:
      "While reading examples, look for who brought the value, what the business received, and whether Cash or Bank is used.",
  },
  [JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG]: {
    teaches: "How to record money, goods, or value taken by the owner or partner for personal use.",
    whyItMatters:
      "Drawings reduce capital presentation. They are not business expenses and should not be treated like salary or rent.",
    watchFor: "Personal use is the main clue. A business withdrawal and a personal withdrawal are not the same.",
    nextStep:
      "After drawings are clear, continue to Purchases to study goods bought for resale.",
    ruleTitle: "Personal use creates Drawings, not expense",
    ruleBody:
      "Debit Drawings A/c when the owner takes value for personal use, and credit what leaves the business.",
    exampleTip:
      "In every drawings example, first find the personal-use words, then identify whether Cash, Bank, or goods leave the business.",
  },
  [JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG]: {
    teaches: "How to record goods bought for resale through cash, bank, or credit.",
    whyItMatters:
      "Purchases A/c is used for goods bought for trading. Assets and routine expenses need different accounts.",
    watchFor: "Do not use Purchases A/c for furniture, machinery, rent, salary, or other non-resale items.",
    nextStep:
      "After purchases feel clear, continue to Sales to study goods sold in the normal course of business.",
    ruleTitle: "Purchases means goods bought for resale",
    ruleBody:
      "Debit Purchases A/c only for goods bought for resale. Credit Cash, Bank, or the supplier depending on payment mode.",
    exampleTip:
      "For each purchase example, decide whether the item is resale goods, a business asset, or an expense before writing the entry.",
  },
  [JOURNAL_ENTRIES_SALES_SECTION_SLUG]: {
    teaches: "How to record goods sold through cash, bank, or credit and use Sales A/c only for normal trading goods.",
    whyItMatters:
      "Sales is usually trading income. The receipt or debtor account shows what the business receives or is owed.",
    watchFor: "Do not credit Sales A/c for asset sales, loans, capital introduced, or other non-goods receipts.",
    nextStep:
      "After goods sold feels clear, continue to Expenses to study business costs like salary, rent, and carriage.",
    ruleTitle: "Sales means goods sold in normal trading",
    ruleBody:
      "Debit Cash, Bank, or the customer for what the business receives or is owed. Credit Sales A/c for goods sold.",
    exampleTip:
      "For each sales example, ask whether goods were sold and whether the receipt is cash, bank, or credit.",
  },
  [JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG]: {
    teaches: "How business costs like salary, rent, wages, and electricity are recorded when paid or due.",
    whyItMatters:
      "Expenses affect profit, but the credit account changes when the cost is paid, outstanding, or prepaid.",
    watchFor: "Do not treat owner personal use, asset purchase, or goods purchase as an ordinary business expense.",
    nextStep:
      "After expenses feel clear, continue to Income to study amounts earned by the business.",
    ruleTitle: "Business expenses are debited when incurred",
    ruleBody:
      "Debit the specific Expense A/c. Credit Cash or Bank if paid, or credit a liability if still due.",
    exampleTip:
      "In each expense example, ask whether the cost is for business, personal use, an asset, or an adjustment.",
  },
  [JOURNAL_ENTRIES_INCOME_SECTION_SLUG]: {
    teaches: "How to record income earned by the business and separate it from capital, loans, advances, or collections.",
    whyItMatters:
      "Income is credited when earned, but receiving money does not always mean income has been earned now.",
    watchFor: "Do not confuse income with capital introduced, loan received, debtor collection, or income received in advance.",
    nextStep:
      "After income feels clear, continue to Assets and Liabilities to study what the business owns and owes.",
    ruleTitle: "Income is credited when earned",
    ruleBody:
      "Debit Cash, Bank, or an accrued asset for the receipt or receivable. Credit income only when earned.",
    exampleTip:
      "For each income example, find the money source and check whether it has been earned before crediting Income A/c.",
  },
  [JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG]: {
    teaches: "How to record simple asset purchases, loans, creditors, and settlement of amounts owed.",
    whyItMatters:
      "Assets and liabilities shape the Balance Sheet, so they should not be mixed with purchases, expenses, income, or capital.",
    watchFor: "Do not use Purchases A/c for fixed assets or Income A/c for loans and other liabilities.",
    nextStep:
      "After assets and liabilities are clear, continue to Mixed Simple Entries for revision across all rules.",
    ruleTitle: "Assets increase by debit; liabilities increase by credit",
    ruleBody:
      "Debit assets when they increase. Credit liabilities when they increase, and debit them when they are settled.",
    exampleTip:
      "In each example, decide whether the account is something owned, something owed, or a normal trading item.",
  },
  [JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG]: {
    teaches: "How to combine earlier rules to solve simple entries without being told the transaction type.",
    whyItMatters:
      "Exam questions mix cash, bank, capital, drawings, purchases, sales, expenses, income, assets, and liabilities.",
    watchFor: "Do not rush. Analyse one transaction at a time before using the live checker.",
    nextStep:
      "After revision, continue to Chapter Recap and Practice to choose the safest next action.",
    ruleTitle: "Reason first, then write the entry",
    ruleBody:
      "Identify accounts, classify each account, decide increase or decrease, then write balanced debit and credit lines.",
    exampleTip:
      "Cover the answer, solve the transaction in steps, and compare your reasoning with the solved illustration.",
  },
  [JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG]: {
    teaches: "How the full Journal Entries chapter fits together and where to revise or practise next.",
    whyItMatters:
      "A recap helps students choose the next safe step after every section now has at least one checker.",
    watchFor:
      "Seventeen Practice It Yourself checkers are live: two in Section 1 and one in every other Journal Entries section.",
    nextStep:
      "Revise weak sections, try the live checks again, use beginner Practice, or open the Explainer for one transaction.",
    ruleTitle: "Use the full journal-entry method every time",
    ruleBody:
      "Transaction first, accounts affected, account types, debit-credit logic, correct format, then balanced totals.",
    exampleTip:
      "Use the recap as a checklist. If one step feels weak, return to that section before attempting more practice.",
  },
};

function JournalEntriesOverviewCard() {
  return (
    <section
      aria-labelledby="journal-entries-overview-title"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Chapter</p>
        <h1
          id="journal-entries-overview-title"
          className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
        >
          Journal Entries
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-700">
          Learn debit-credit rules and journal format.
        </p>
      </div>

      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">16 sections</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-cyan-950">Study the chapter step by step.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">17 checked practice questions</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-950">Write full entries and check your work.</p>
        </div>
      </div>

      <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={`${PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH}#introduction-to-journal-entries`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Start Chapter
        </Link>
        <Link
          href="/journal-entry-solver"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Use Explainer
        </Link>
        <Link
          href="/practice/journal-entries"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Practice
        </Link>
      </div>
    </section>
  );
}

function SectionIntroCard({ subtopic }: { subtopic: ChapterSubtopicDefinition }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{subtopic.progressLabel}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        {productionText(subtopic.title)}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">
        {productionText(subtopic.shortDescription)}
      </p>
    </section>
  );
}

function SectionLearningGuideCard({
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
      }
    : nextSectionHref && subtopic.nextSection
      ? {
          href: nextSectionHref,
        }
      : null;

  return (
    <section
      aria-labelledby={`${subtopic.id}-learning-guide-title`}
      className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6"
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Study guide</p>
      <h2 id={`${subtopic.id}-learning-guide-title`} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        Before you study {subtopic.title}
      </h2>

      <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-2">
        <LearningGuideNote title="What you'll learn" body={guide.teaches} />
        <LearningGuideNote title="Common mistake" body={guide.watchFor} />
      </div>

      <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Rule</p>
          <h3 className="mt-2 text-base font-black text-slate-950">{guide.ruleTitle}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">{guide.ruleBody}</p>
        </article>
        <article className="min-w-0 rounded-2xl border border-cyan-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Example tip</p>
          <h3 className="mt-2 text-base font-black text-slate-950">Study the reasoning</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{guide.exampleTip}</p>
        </article>
      </div>

      <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            {hasPracticeChecks ? "Practice It Yourself" : "Next Section"}
          </Link>
        ) : null}
        <Link
          href="/journal-entry-solver"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Use Explainer
        </Link>
        <Link
          href="/practice/journal-entries"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Practice
        </Link>
      </div>
    </section>
  );
}

function LearningGuideNote({ body, title }: { body: string; title: string }) {
  return (
    <article className="min-w-0 rounded-2xl border border-emerald-200 bg-white p-4">
      <h3 className="text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{body}</p>
    </article>
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
  const nextHref = subtopic.nextSection
    ? getProductionSectionHref(subtopic.nextSection.slug)
    : PRODUCTION_JOURNAL_ENTRIES_CHAPTER_PATH;
  const nextLabel = subtopic.nextSection ? "Next Section" : "Review Chapter";

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:p-6">
      <Link
        href={nextHref}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        {nextLabel}
      </Link>
      <Link
        href="/journal-entry-solver"
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300 bg-white px-4 text-sm font-black text-cyan-950 outline-none transition hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        Use Explainer
      </Link>
      <Link
        href="/practice/journal-entries"
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-black text-emerald-950 outline-none transition hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        Practice
      </Link>
    </section>
  );
}
