import type { ReactNode } from "react";
import type {
  AccountingEntryLine,
  AccountingFormatPreviewLine,
  ChapterDefinition,
  ChapterMetadata,
  CommonMistakesSection,
  PracticeItYourselfPreviewQuestion,
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

export function ChapterOutline({ chapter }: { chapter: ChapterDefinition }) {
  const currentSectionId = chapter.metadata.currentPreviewSectionId;

  return (
    <>
      <details className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer text-sm font-black text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
          Chapter outline
        </summary>
        <OrderedOutline chapter={chapter} currentSectionId={currentSectionId} className="mt-4" />
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <SectionHeading
            eyebrow="Outline"
            title={chapter.metadata.title}
            body="Only the first section is fully rendered in Phase 3C."
          />
          <OrderedOutline chapter={chapter} currentSectionId={currentSectionId} className="mt-5" />
        </div>
      </aside>
    </>
  );
}

function OrderedOutline({
  chapter,
  currentSectionId,
  className = "",
}: {
  chapter: ChapterDefinition;
  currentSectionId: string;
  className?: string;
}) {
  return (
    <ol className={`space-y-2 ${className}`}>
      {chapter.outline.map((item) => {
        const isCurrent = item.status === "current";

        return (
          <li key={item.id}>
            {isCurrent ? (
              <a
                href={`#${currentSectionId}`}
                aria-current="step"
                className="flex min-h-11 items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 text-left text-sm font-black text-cyan-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs text-white">
                  {item.order}
                </span>
                <span>{item.title}</span>
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
                  Soon
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

export function ChapterProgressPreview({ metadata }: { metadata: ChapterMetadata }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow="Preview progress" title="Current section" body="Introduction to Journal Entries and Journal Format" />
      {metadata.progressPreview ? (
        <div className="mt-5">
          <ProgressBar value={metadata.progressPreview.value} label={metadata.progressPreview.label} />
        </div>
      ) : null}
      <div className="mt-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
        {metadata.levelLabel}
      </div>
    </div>
  );
}
