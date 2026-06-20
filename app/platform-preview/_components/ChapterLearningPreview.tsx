import type { ReactNode } from "react";
import type {
  AccountingEntryLine,
  AccountingFormatPreviewLine,
  ChapterDefinition,
  ChapterMetadata,
  ChapterSubtopicDefinition,
  ClassificationCategorySection,
  ClassificationExamplesSection,
  ClassificationGuideSection,
  ClueGuideSection,
  CommonMistakesSection,
  ComparisonSection,
  PracticeItYourselfPreviewQuestion,
  ProcessStepsSection,
  ReflectionPromptSection,
  SimpleExampleSection,
  SolvedIllustration as SolvedIllustrationData,
} from "@/lib/learning-platform/types";
import type {
  JournalEntryCorrectAnswerReveal,
  JournalEntryPracticeAttempt,
  JournalEntryPracticeCheckResult,
} from "@/lib/learning-platform/checkers/types";
import { JournalEntryPracticeEditor } from "./JournalEntryPracticeEditor";
import { ProgressBar, SectionHeading } from "./PreviewCards";

type AccountingEntryTableRow = {
  id: string;
  particulars: string;
  lf?: string;
  debit?: string;
  credit?: string;
};

export function ChapterOutline({
  chapter,
  activeSectionId,
}: {
  chapter: ChapterDefinition;
  activeSectionId: string;
}) {
  return (
    <>
      <details className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer text-sm font-black text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
          Chapter outline
        </summary>
        <OrderedOutline chapter={chapter} activeSectionId={activeSectionId} className="mt-4" />
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <SectionHeading
            eyebrow="Outline"
            title={chapter.metadata.title}
            body="Available sections open in this internal preview. Upcoming sections are shown for sequence only."
          />
          <OrderedOutline chapter={chapter} activeSectionId={activeSectionId} className="mt-5" />
        </div>
      </aside>
    </>
  );
}

function OrderedOutline({
  chapter,
  activeSectionId,
  className = "",
}: {
  chapter: ChapterDefinition;
  activeSectionId: string;
  className?: string;
}) {
  return (
    <ol className={`space-y-2 ${className}`}>
      {chapter.outline.map((item) => {
        const isActive = item.id === activeSectionId;
        const isAvailable = item.status === "available" && item.href;
        const unavailableLabel = item.status === "later" ? "Later" : "Upcoming";

        return (
          <li key={item.id}>
            {isActive ? (
              <a
                href={item.href ?? `#${activeSectionId}`}
                aria-current="step"
                className="flex min-h-11 items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 text-left text-sm font-black text-cyan-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs text-white">
                  {item.order}
                </span>
                <span>{item.title}</span>
              </a>
            ) : isAvailable ? (
              <a
                href={item.href}
                className="flex min-h-11 items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-bold text-slate-800 outline-none transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-950 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-700">
                  {item.order}
                </span>
                <span>{item.title}</span>
                <span className="ml-auto rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-cyan-800">
                  Available
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex min-h-11 w-full cursor-not-allowed items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-bold text-slate-500"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs text-slate-500">
                  {item.order}
                </span>
                <span>{item.title}</span>
                <span className="ml-auto rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                  {unavailableLabel}
                </span>
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function ConceptSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">{children}</div>
    </section>
  );
}

export function ComparisonBlock({ section }: { section: ComparisonSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.intro} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {section.groups.map((group) => (
          <article key={group.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{group.title}</h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
              {group.items.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-white p-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProcessStepsBlock({ section }: { section: ProcessStepsSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <ol className="mt-5 grid gap-3">
        {section.steps.map((step, index) => (
          <li key={step.label} className="flex min-w-0 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-950">{step.label}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ClueGuideBlock({ section }: { section: ClueGuideSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.clues.map((item) => (
          <article key={item.clue} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Clue</p>
            <h3 className="mt-1 text-sm font-black text-slate-950">{item.clue}</h3>
            <p className="mt-3 text-xs font-black uppercase tracking-wide text-cyan-700">Likely account(s)</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{item.likelyAccounts.join(" and ")}</p>
            {item.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ClassificationCategoriesBlock({ section }: { section: ClassificationCategorySection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {section.categories.map((category) => (
          <article key={category.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{category.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.examples.map((example) => (
                <span
                  key={example}
                  className="min-w-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700"
                >
                  {example}
                </span>
              ))}
            </div>
            {category.subcategories ? (
              <div className="mt-4 grid gap-3">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.title} className="rounded-xl border border-slate-200 bg-white p-3">
                    <h4 className="text-sm font-black text-slate-950">{subcategory.title}</h4>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      {subcategory.examples.join(", ")}
                    </p>
                    {subcategory.note ? (
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{subcategory.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {category.note ? <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{category.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ClassificationGuideBlock({ section }: { section: ClassificationGuideSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.rows.map((row) => (
          <article key={row.account} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{row.account}</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Modern</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{row.modernClassification}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Traditional</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{row.traditionalClassification}</p>
              </div>
            </div>
            {row.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{row.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ClassificationExamplesBlock({ section }: { section: ClassificationExamplesSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-4">
        {section.examples.map((example) => (
          <article key={example.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{example.title}</p>
            <h3 className="mt-2 text-base font-black text-slate-950">{example.question}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {example.accounts.map((account) => (
                <div key={account.account} className="rounded-xl border border-slate-200 bg-white p-3">
                  <h4 className="text-sm font-black text-slate-950">{account.account}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    <span className="font-black text-cyan-800">Modern:</span> {account.modernClassification}
                  </p>
                  <p className="text-sm leading-6 text-slate-700">
                    <span className="font-black text-slate-700">Traditional:</span> {account.traditionalClassification}
                  </p>
                  {account.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{account.note}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{example.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReflectionPrompt({ section }: { section: ReflectionPromptSection }) {
  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">{section.eyebrow}</p>
      <h2 className="mt-2 text-xl font-black tracking-tight text-cyan-950 sm:text-2xl">{section.prompt}</h2>
      {section.body ? <p className="mt-3 text-sm font-semibold leading-6 text-cyan-900">{section.body}</p> : null}
    </section>
  );
}

export function AccountingEntryTable({ rows, caption }: { rows: AccountingEntryTableRow[]; caption: string }) {
  return (
    <div className="mt-4 min-w-0">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Particulars</th>
              <th className="px-4 py-3">L.F.</th>
              <th className="px-4 py-3 text-right">Debit ₹</th>
              <th className="px-4 py-3 text-right">Credit ₹</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-slate-500">{index === 0 ? "Preview" : ""}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.particulars}</td>
                <td className="px-4 py-3 text-slate-500">{row.lf ?? "-"}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{row.debit ?? ""}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{row.credit ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden" aria-label={caption}>
        {rows.map((row, index) => (
          <div key={`${row.id}-mobile`} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Row {index + 1}</div>
            <div className="mt-2 font-bold text-slate-950">{row.particulars}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="font-black text-slate-500">Debit ₹</div>
                <div className="mt-1 font-bold text-slate-950">{row.debit ?? "-"}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="font-black text-slate-500">Credit ₹</div>
                <div className="mt-1 font-bold text-slate-950">{row.credit ?? "-"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function formatAccountingEntryRows(lines: readonly AccountingEntryLine[]): AccountingEntryTableRow[] {
  return lines.map((line) => ({
    id: line.id,
    particulars: `${line.displayPrefix ? `${line.displayPrefix} ` : ""}${line.account}${line.drNotation ? ` ${line.drNotation}` : ""}`,
    lf: line.lf,
    debit: line.side === "debit" ? formatAmount(line.amount) : undefined,
    credit: line.side === "credit" ? formatAmount(line.amount) : undefined,
  }));
}

export function formatAccountingFormatRows(lines: readonly AccountingFormatPreviewLine[]): AccountingEntryTableRow[] {
  return lines.map((line) => ({
    id: line.id,
    particulars: line.particulars,
    lf: line.lf,
    debit: line.debitDisplay,
    credit: line.creditDisplay,
  }));
}

function formatAmount(amount: number) {
  return amount.toLocaleString("en-IN");
}

export function WorkedExample({ section }: { section: SimpleExampleSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        body={section.body}
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.reasoningSteps.map((step) => (
          <ReasonCard key={step.label} label={step.label} detail={step.detail} />
        ))}
      </div>
      <AccountingEntryTable
        caption="Journal entry for goods bought for cash"
        rows={formatAccountingEntryRows(section.journalEntry)}
      />
    </section>
  );
}

function ReasonCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-black text-slate-950">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

export function SolvedIllustration({
  number,
  illustration,
}: {
  number: number;
  illustration: SolvedIllustrationData;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading eyebrow={`Solved Illustration ${number}`} title={illustration.question} />
        <span className="inline-flex self-start rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
          Preview solution
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {illustration.reasoningSteps.map((step) => (
          <div key={step.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-black text-slate-950">{step.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
          </div>
        ))}
      </div>
      <AccountingEntryTable
        caption={`Solved illustration ${number} journal entry`}
        rows={formatAccountingEntryRows(illustration.journalEntry)}
      />
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p>
          <span className="font-black text-slate-950">Narration:</span> {illustration.narration}
        </p>
        <p className="mt-2">
          <span className="font-black text-slate-950">Explanation:</span> {illustration.explanation}
        </p>
      </div>
    </article>
  );
}

export function PracticeItYourselfPreview({
  question,
  practiceNumber,
  practiceCount,
  checkAnswerAction,
  revealCorrectAnswerAction,
}: {
  question: PracticeItYourselfPreviewQuestion;
  practiceNumber: number;
  practiceCount: number;
  checkAnswerAction: (attempt: JournalEntryPracticeAttempt) => Promise<JournalEntryPracticeCheckResult>;
  revealCorrectAnswerAction: (questionId: string) => Promise<JournalEntryCorrectAnswerReveal>;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow={`Practice ${practiceNumber} of ${practiceCount}`}
        title={question.question}
        body="Enter the full journal entry yourself. This preview checker supports this question independently."
      />
      <JournalEntryPracticeEditor
        question={question}
        checkAnswerAction={checkAnswerAction}
        revealCorrectAnswerAction={revealCorrectAnswerAction}
      />
    </section>
  );
}

export function CommonMistakes({ section }: { section: CommonMistakesSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.mistakes.map((mistake) => (
          <li key={mistake} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
            {mistake}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ChapterProgressPreview({
  metadata,
  subtopic,
  totalSections,
}: {
  metadata: ChapterMetadata;
  subtopic: ChapterSubtopicDefinition;
  totalSections: number;
}) {
  const progressValue = Math.round((subtopic.order / totalSections) * 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow="Preview progress" title={subtopic.title} body={subtopic.shortDescription} />
      <div className="mt-5">
        <ProgressBar value={progressValue} label={subtopic.progressLabel} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
          {metadata.levelLabel}
        </span>
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-700">
          {subtopic.progressLabel}
        </span>
      </div>
    </div>
  );
}
