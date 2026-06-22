import type { ReactNode } from "react";
import Link from "next/link";
import type {
  JournalEntryCorrectAnswerReveal,
  JournalEntryPracticeAttempt,
  JournalEntryPracticeCheckResult,
} from "@/lib/learning-platform/checkers/types";
import type {
  AccountingEntryLine,
  AccountingFormatPreviewLine,
  ChapterCompletionBannerSection,
  ChapterDefinition,
  ChapterMetadata,
  ChapterRecapGroupsSection,
  ChapterSubtopicDefinition,
  ClassificationCategorySection,
  ClassificationExamplesSection,
  ClassificationGuideSection,
  ClueGuideSection,
  CommonMistakesSection,
  ComparisonSection,
  DebitCreditRuleGuideSection,
  InteractivePracticeLinksSection,
  JournalColumnGuideSection,
  PracticeItYourselfPreviewQuestion,
  ProcessStepsSection,
  ReflectionPromptSection,
  ScopeRoadmapSection,
  SimpleExampleSection,
  SolvedIllustration as SolvedIllustrationData,
  TryBeforeRevealSection,
} from "@/lib/learning-platform/types";
import { JournalEntryPracticeEditor } from "@/components/learning-platform/JournalEntryPracticeEditor";

const PRODUCTION_PRACTICE_ANCHOR_HREF = "/chapters/journal-entries#practice-it-yourself";

type AccountingEntryTableRow = {
  id: string;
  particulars: string;
  lf?: string;
  debit?: string;
  credit?: string;
};

type ProductionOutlineItem = {
  id: string;
  title: string;
  order: number;
  href: string;
  practiceQuestionCount?: number;
};

export function productionText(text: string) {
  return text
    .replace(/Preview\/static only/gi, "Learning only")
    .replace(/Preview\/static/gi, "Learning")
    .replace(/preview\/static only/gi, "learning only")
    .replace(/preview\/static/gi, "learning")
    .replace(/preview-only/gi, "learning-only")
    .replace(/internal preview/gi, "chapter")
    .replace(/static preview/gi, "learning chapter")
    .replace(/preview chapter/gi, "chapter")
    .replace(/prototype scope/gi, "chapter scope")
    .replace(/prototype/gi, "chapter")
    .replace(/foundation chapter/gi, "chapter")
    .replace(/Chapter progress preview/gi, "Chapter progress")
    .replace(/\bPreview\b/g, "Chapter")
    .replace(/\bpreview\b/g, "chapter");
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">{productionText(eyebrow)}</p> : null}
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{productionText(title)}</h2>
      {body ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{productionText(body)}</p> : null}
    </div>
  );
}

export function ChapterOutline({
  chapter,
  activeSectionId,
  outlineItems,
}: {
  chapter: ChapterDefinition;
  activeSectionId: string;
  outlineItems: ProductionOutlineItem[];
}) {
  return (
    <>
      <details className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer text-sm font-black text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2">
          Chapter outline
        </summary>
        <OrderedOutline outlineItems={outlineItems} activeSectionId={activeSectionId} className="mt-4" />
      </details>

      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <SectionHeading
            eyebrow="Outline"
            title={chapter.metadata.title}
            body="Choose a section and continue in order."
          />
          <OrderedOutline outlineItems={outlineItems} activeSectionId={activeSectionId} className="mt-5" />
        </div>
      </aside>
    </>
  );
}

function OrderedOutline({
  outlineItems,
  activeSectionId,
  className = "",
}: {
  outlineItems: ProductionOutlineItem[];
  activeSectionId: string;
  className?: string;
}) {
  return (
    <ol className={`space-y-2 ${className}`}>
      {outlineItems.map((item) => {
        const isActive = item.id === activeSectionId;
        const practiceQuestionCount = item.practiceQuestionCount ?? 0;
        const practiceCheckLabel = practiceQuestionCount === 1 ? "practice check" : "practice checks";
        const sectionModeLabel = practiceQuestionCount > 0 ? `${practiceQuestionCount} ${practiceCheckLabel}` : null;

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={isActive ? "step" : undefined}
              className={`flex min-h-11 items-start gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "border-cyan-200 bg-cyan-50 font-black text-cyan-950"
                  : "border-slate-200 bg-white font-bold text-slate-800 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-950"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                  isActive ? "bg-cyan-700 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.order}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block">{item.title}</span>
                {sectionModeLabel ? (
                  <span className="mt-1 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-800">
                    {sectionModeLabel}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function ChapterProgress({
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
      <SectionHeading eyebrow="Chapter progress" title={subtopic.title} body={subtopic.shortDescription} />
      <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
        {productionText(subtopic.learningObjective)}
      </p>
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

function ProgressBar({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-600">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
      >
        <div className="h-full rounded-full bg-cyan-600" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
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
            <h3 className="text-base font-black text-slate-950">{productionText(group.title)}</h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
              {group.items.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-white p-3">
                  {productionText(item)}
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
              <h3 className="text-sm font-black text-slate-950">{productionText(step.label)}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{productionText(step.detail)}</p>
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
            <h3 className="mt-1 text-sm font-black text-slate-950">{productionText(item.clue)}</h3>
            <p className="mt-3 text-xs font-black uppercase tracking-wide text-cyan-700">Likely account(s)</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
              {item.likelyAccounts.map(productionText).join(" and ")}
            </p>
            {item.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{productionText(item.note)}</p> : null}
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
            <h3 className="text-base font-black text-slate-950">{productionText(category.title)}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{productionText(category.description)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.examples.map((example) => (
                <span
                  key={example}
                  className="min-w-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700"
                >
                  {productionText(example)}
                </span>
              ))}
            </div>
            {category.subcategories ? (
              <div className="mt-4 grid gap-3">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.title} className="rounded-xl border border-slate-200 bg-white p-3">
                    <h4 className="text-sm font-black text-slate-950">{productionText(subcategory.title)}</h4>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      {subcategory.examples.map(productionText).join(", ")}
                    </p>
                    {subcategory.note ? (
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                        {productionText(subcategory.note)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {category.note ? <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{productionText(category.note)}</p> : null}
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
            <h3 className="text-base font-black text-slate-950">{productionText(row.account)}</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Modern</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{productionText(row.modernClassification)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Traditional</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{productionText(row.traditionalClassification)}</p>
              </div>
            </div>
            {row.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{productionText(row.note)}</p> : null}
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
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{productionText(example.title)}</p>
            <h3 className="mt-2 text-base font-black text-slate-950">{productionText(example.question)}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {example.accounts.map((account) => (
                <div key={account.account} className="rounded-xl border border-slate-200 bg-white p-3">
                  <h4 className="text-sm font-black text-slate-950">{productionText(account.account)}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    <span className="font-black text-cyan-800">Modern:</span> {productionText(account.modernClassification)}
                  </p>
                  <p className="text-sm leading-6 text-slate-700">
                    <span className="font-black text-slate-700">Traditional:</span> {productionText(account.traditionalClassification)}
                  </p>
                  {account.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{productionText(account.note)}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{productionText(example.explanation)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DebitCreditRuleGuideBlock({ section }: { section: DebitCreditRuleGuideSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.rules.map((rule) => (
          <article key={rule.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{productionText(rule.title)}</h3>
            {rule.rule ? (
              <p className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-black leading-6 text-cyan-950">
                {productionText(rule.rule)}
              </p>
            ) : null}
            {(rule.increaseTreatment || rule.decreaseTreatment) ? (
              <div className="mt-4 grid gap-3">
                {rule.increaseTreatment ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Increase</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
                      {productionText(rule.increaseTreatment)}
                    </p>
                  </div>
                ) : null}
                {rule.decreaseTreatment ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Decrease</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
                      {productionText(rule.decreaseTreatment)}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
            {rule.examples?.length ? (
              <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-700">
                {rule.examples.map((example) => (
                  <li key={example} className="rounded-xl border border-slate-200 bg-white p-3">
                    {productionText(example)}
                  </li>
                ))}
              </ul>
            ) : null}
            {rule.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{productionText(rule.note)}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function JournalColumnGuideBlock({ section }: { section: JournalColumnGuideSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {section.columns.map((column) => (
          <article key={column.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{productionText(column.title)}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-cyan-800">{productionText(column.purpose)}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {column.guidance.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-white p-3">
                  {productionText(item)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReflectionPrompt({ section }: { section: ReflectionPromptSection }) {
  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">{productionText(section.eyebrow)}</p>
      <h2 className="mt-2 text-xl font-black tracking-tight text-cyan-950 sm:text-2xl">{productionText(section.prompt)}</h2>
      {section.body ? <p className="mt-3 text-sm font-semibold leading-6 text-cyan-900">{productionText(section.body)}</p> : null}
    </section>
  );
}

export function AccountingEntryTable({ rows, caption }: { rows: AccountingEntryTableRow[]; caption: string }) {
  return (
    <div className="mt-4 min-w-0">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{productionText(caption)}</caption>
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
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-slate-500">-</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{productionText(row.particulars)}</td>
                <td className="px-4 py-3 text-slate-500">{row.lf ?? "-"}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{row.debit ?? ""}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{row.credit ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden" aria-label={productionText(caption)}>
        {rows.map((row, index) => (
          <div key={`${row.id}-mobile`} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Row {index + 1}</div>
            <div className="mt-2 font-bold text-slate-950">{productionText(row.particulars)}</div>
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
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
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
      <h3 className="text-sm font-black text-slate-950">{productionText(label)}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{productionText(detail)}</p>
    </div>
  );
}

export function SolvedIllustration({ number, illustration }: { number: number; illustration: SolvedIllustrationData }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading eyebrow={`Solved Illustration ${number}`} title={illustration.question} />
        <span className="inline-flex self-start rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
          Solved solution
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {illustration.reasoningSteps.map((step) => (
          <ReasonCard key={step.label} label={step.label} detail={step.detail} />
        ))}
      </div>
      <AccountingEntryTable
        caption={`Solved illustration ${number} journal entry`}
        rows={formatAccountingEntryRows(illustration.journalEntry)}
      />
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p>
          <span className="font-black text-slate-950">Narration:</span> {productionText(illustration.narration)}
        </p>
        <p className="mt-2">
          <span className="font-black text-slate-950">Explanation:</span> {productionText(illustration.explanation)}
        </p>
      </div>
    </article>
  );
}

export function PracticeItYourselfProduction({
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
  const sectionId = practiceNumber === 1 ? "practice-it-yourself" : `practice-it-yourself-${practiceNumber}`;
  const guidance = getProductionPracticeGuidance(question.id);

  return (
    <section id={sectionId} className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow={`Practice ${practiceNumber} of ${practiceCount}`}
        title={question.question}
        body="Write the full journal entry yourself. This live checker supports this audited question independently."
      />
      <div className="mt-5 rounded-2xl border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-cyan-900">
        {productionText(question.learningObjective)}
      </div>
      <PracticeAttemptGuide guidance={guidance} />
      <JournalEntryPracticeEditor
        question={question}
        checkAnswerAction={checkAnswerAction}
        revealCorrectAnswerAction={revealCorrectAnswerAction}
        supportNotice="This chapter checker supports this audited question only. No API route, storage, analytics, or existing checker is called."
      />
      <PracticeNextStepCard />
    </section>
  );
}

type ProductionPracticeGuidance = {
  transactionFocus: string;
  likelyAccounts: string;
  logicPrompt: string;
  learningPoint: string;
};

function getProductionPracticeGuidance(questionId: string): ProductionPracticeGuidance {
  if (questionId === "journal-entry-sold-goods-for-cash-practice-preview") {
    return {
      transactionFocus: "Goods are sold and cash comes into the business.",
      likelyAccounts: "Likely accounts involved: Cash and Sales.",
      logicPrompt: "Decide which account receives value and which account records the sale before checking.",
      learningPoint: "The purpose is to understand the sale logic, not to copy the answer format.",
    };
  }

  if (questionId === "journal-entry-paid-salary-by-bank-practice-preview") {
    return {
      transactionFocus: "A salary expense is being paid through bank.",
      likelyAccounts: "Likely accounts involved: Salary and Bank.",
      logicPrompt: "Decide which account is the expense and which asset is going down before checking.",
      learningPoint: "The purpose is to understand the expense-payment logic, not to guess the row order.",
    };
  }

  if (questionId === "journal-entry-purchased-goods-for-cash-practice-preview") {
    return {
      transactionFocus: "Goods are bought for cash, so cash leaves the business.",
      likelyAccounts: "Likely accounts involved: Purchases and Cash.",
      logicPrompt: "Decide whether the goods are for resale and which asset is paid out before checking.",
      learningPoint: "The purpose is to understand purchase logic without confusing goods with assets or bank.",
    };
  }

  if (questionId === "journal-entry-started-business-with-cash-practice-preview") {
    return {
      transactionFocus: "The owner starts the business by bringing in cash.",
      likelyAccounts: "Likely accounts involved: Cash and Capital.",
      logicPrompt: "Decide which asset increases and why capital is credited before checking.",
      learningPoint: "The purpose is to understand capital logic without treating capital as income.",
    };
  }

  if (questionId === "journal-entry-withdrew-cash-for-personal-use-practice-preview") {
    return {
      transactionFocus: "Cash leaves the business for the owner's personal use.",
      likelyAccounts: "Likely accounts involved: Drawings and Cash.",
      logicPrompt: "Decide why personal use makes this Drawings and why Cash is credited before checking.",
      learningPoint: "The purpose is to separate drawings from business expenses.",
    };
  }

  if (questionId === "journal-entry-paid-rent-by-cash-practice-preview") {
    return {
      transactionFocus: "The business pays rent using physical cash.",
      likelyAccounts: "Likely accounts involved: Rent and Cash.",
      logicPrompt: "Decide why rent is a business expense and why Cash is credited before checking.",
      learningPoint: "The purpose is to separate rent from drawings, salary, and bank payments.",
    };
  }

  if (questionId === "journal-entry-received-commission-in-cash-practice-preview") {
    return {
      transactionFocus: "The business receives commission income in cash.",
      likelyAccounts: "Likely accounts involved: Cash and Commission.",
      logicPrompt: "Decide why Cash is debited and why income is credited before checking.",
      learningPoint: "The purpose is to separate commission income from capital and sales.",
    };
  }

  if (questionId === "journal-entry-bought-furniture-for-cash-practice-preview") {
    return {
      transactionFocus: "The business buys furniture for use and pays cash.",
      likelyAccounts: "Likely accounts involved: Furniture and Cash.",
      logicPrompt: "Decide why furniture is an asset and why Cash is credited before checking.",
      learningPoint: "The purpose is to separate assets for use from goods bought for resale.",
    };
  }

  if (questionId === "journal-entry-paid-electricity-bill-in-cash-practice-preview") {
    return {
      transactionFocus: "The business pays an electricity bill using physical cash.",
      likelyAccounts: "Likely accounts involved: Electricity and Cash.",
      logicPrompt: "Decide why electricity is an expense and why Cash is credited before checking.",
      learningPoint: "The purpose is to record a simple paid expense without adding adjustment treatment.",
    };
  }

  if (questionId === "journal-entry-paid-wages-in-cash-practice-preview") {
    return {
      transactionFocus: "The business pays wages using physical cash.",
      likelyAccounts: "Likely accounts involved: Wages and Cash.",
      logicPrompt: "Decide why wages are an expense and why Cash is credited before checking.",
      learningPoint: "The purpose is to apply debit-credit rules to a simple cash expense.",
    };
  }

  if (questionId === "journal-entry-sold-goods-by-bank-practice-preview") {
    return {
      transactionFocus: "Goods are sold and the money is received through bank.",
      likelyAccounts: "Likely accounts involved: Bank and Sales.",
      logicPrompt: "Decide why Bank is debited and why Sales is credited before checking.",
      learningPoint: "The purpose is to separate a bank sale from a cash sale or credit sale.",
    };
  }

  if (questionId === "journal-entry-bought-stationery-for-cash-practice-preview") {
    return {
      transactionFocus: "The business buys stationery and pays physical cash.",
      likelyAccounts: "Likely accounts involved: Stationery and Cash.",
      logicPrompt: "Decide why stationery is debited and why Cash is credited before checking.",
      learningPoint: "The purpose is to identify exact affected accounts before applying rules.",
    };
  }

  if (questionId === "journal-entry-received-fees-in-cash-practice-preview") {
    return {
      transactionFocus: "The business receives fees income in cash.",
      likelyAccounts: "Likely accounts involved: Cash and Fees Received.",
      logicPrompt: "Decide why Cash is debited and why fees income is credited before checking.",
      learningPoint: "The purpose is to classify cash as an asset and fees as income.",
    };
  }

  if (questionId === "journal-entry-paid-office-rent-by-bank-practice-preview") {
    return {
      transactionFocus: "The business pays office rent through bank.",
      likelyAccounts: "Likely accounts involved: Office Rent and Bank.",
      logicPrompt: "Decide why Office Rent is debited and why Bank is credited before checking.",
      learningPoint: "The purpose is to practise clean Dr./To, amount, and narration presentation.",
    };
  }

  if (questionId === "journal-entry-deposited-cash-into-bank-practice-preview") {
    return {
      transactionFocus: "Cash moves from the cash balance into the bank account.",
      likelyAccounts: "Likely accounts involved: Bank and Cash.",
      logicPrompt: "Decide why Bank is debited and why Cash is credited before checking.",
      learningPoint: "The purpose is to separate a cash-bank transfer from income, capital, or sales.",
    };
  }

  if (questionId === "journal-entry-paid-advertising-by-bank-practice-preview") {
    return {
      transactionFocus: "The business pays advertising expense through bank.",
      likelyAccounts: "Likely accounts involved: Advertising and Bank.",
      logicPrompt: "Decide why Advertising is debited and why Bank is credited before checking.",
      learningPoint: "The purpose is to record a simple paid expense without adding adjustment treatment.",
    };
  }

  if (questionId === "journal-entry-bought-machinery-by-bank-practice-preview") {
    return {
      transactionFocus: "The business buys machinery for use and pays through bank.",
      likelyAccounts: "Likely accounts involved: Machinery and Bank.",
      logicPrompt: "Decide why Machinery is debited and why Bank is credited before checking.",
      learningPoint: "The purpose is to separate a business asset from Purchases or depreciation.",
    };
  }

  return {
    transactionFocus: "Read the transaction and identify what enters or leaves the business.",
    likelyAccounts: "Identify the accounts involved before typing the entry.",
    logicPrompt: "Decide the debit and credit side before checking.",
    learningPoint: "The purpose is to understand the logic, not to copy the answer format.",
  };
}

function PracticeAttemptGuide({
  guidance,
}: {
  guidance: ProductionPracticeGuidance;
}) {
  return (
    <div className="mt-5 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
      <article className="min-w-0 rounded-2xl border border-cyan-200 bg-white p-4">
        <h3 className="text-base font-black text-slate-950">How to try this question</h3>
        <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-700">
          <li>{guidance.transactionFocus}</li>
          <li>{guidance.likelyAccounts}</li>
          <li>{guidance.logicPrompt}</li>
          <li>Spelling, account naming, Dr./To, amount, totals, and narration matter in this checker.</li>
        </ul>
      </article>
      <article className="min-w-0 rounded-2xl border border-cyan-200 bg-white p-4">
        <h3 className="text-base font-black text-slate-950">Before you check</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-semibold leading-6 text-slate-700">
          <li>Analyse the transaction before typing.</li>
          <li>Decide the debit and credit side before you check.</li>
          <li>Use the feedback to learn the logic, not just to guess.</li>
        </ol>
        <p className="mt-3 rounded-xl bg-cyan-50 p-3 text-sm font-semibold leading-6 text-cyan-900">
          Write the full entry first, then check your answer.
        </p>
      </article>
    </div>
  );
}

function PracticeNextStepCard() {
  return (
    <div className="mt-5 rounded-2xl border border-cyan-200 bg-white p-4">
      <h3 className="text-base font-black text-slate-950">After checking</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
        If correct, continue to the next section. If stuck, review the reasoning and try the same checker again.
      </p>
    </div>
  );
}

export function CommonMistakes({ section }: { section: CommonMistakesSection }) {
  const visibleMistakes = section.mistakes.slice(0, 4);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {visibleMistakes.map((mistake) => (
          <li key={mistake} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
            {productionText(mistake)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TryBeforeRevealBlock({ section }: { section: TryBeforeRevealSection }) {
  const revealLabel = section.revealLabel ?? "Reveal explanation";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-4">
        {section.prompts.map((prompt) => (
          <details key={prompt.id} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="flex cursor-pointer list-none flex-col gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 text-base font-black leading-7 text-slate-950">{productionText(prompt.prompt)}</span>
              <span className="inline-flex self-start rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
                {productionText(revealLabel)}
              </span>
            </summary>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <AccountingEntryTable
                caption={`Display-only journal entry for ${prompt.prompt}`}
                rows={formatAccountingEntryRows(prompt.journalEntry)}
              />
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <p>
                  <span className="font-black text-slate-950">Narration:</span> {productionText(prompt.narration)}
                </p>
                <p className="mt-2">
                  <span className="font-black text-slate-950">Reasoning:</span> {productionText(prompt.reasoning)}
                </p>
                {prompt.commonMistake ? (
                  <p className="mt-2">
                    <span className="font-black text-slate-950">Common mistake:</span> {productionText(prompt.commonMistake)}
                  </p>
                ) : null}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ChapterCompletionBannerBlock({ section }: { section: ChapterCompletionBannerSection }) {
  const productionStats = section.stats.map((stat) =>
    stat.label.toLowerCase().includes("interactive practice")
      ? { label: "Interactive practice checking", value: "3 live" }
      : { label: productionText(stat.label), value: productionText(stat.value) },
  );

  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Chapter recap</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-cyan-950 sm:text-3xl">
            Journal Entries recap
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-cyan-900">
            Review the main rules, then practise the checked questions when you are ready.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {productionStats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-cyan-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{stat.label}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ChapterRecapGroupsBlock({ section }: { section: ChapterRecapGroupsSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {section.groups.map((group) => (
          <article key={group.title} className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">{productionText(group.title)}</h3>
            <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-700">
              {group.items.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-white p-3">
                  {productionText(item)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InteractivePracticeLinksBlock({ section }: { section: InteractivePracticeLinksSection }) {
  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow={section.eyebrow}
        title="Interactive Practice Available"
        body="Try these checked questions when you want full-answer feedback."
      />
      <div className="mt-5 rounded-2xl border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-cyan-900">
        <ol className="list-decimal space-y-2 pl-5">
          {section.questions.map((question) => (
            <li key={question.id}>{productionText(question.title)}</li>
          ))}
        </ol>
        <Link
          href={PRODUCTION_PRACTICE_ANCHOR_HREF}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Practice the interactive questions
        </Link>
      </div>
    </section>
  );
}

export function ScopeRoadmapBlock({ section }: { section: ScopeRoadmapSection }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow="Keep separate for now"
        title="What belongs later"
        body="Some Journal Entries topics need separate lessons before they become checked practice."
      />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <h3 className="text-base font-black text-cyan-950">Practise now</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-cyan-900">
            {section.currentScope.items.map((item) => (
              <li key={item} className="rounded-xl border border-cyan-200 bg-white p-3">
                {productionText(item).replace(
                  "Deterministic practice for seventeen approved questions",
                  "Deterministic practice for seventeen approved questions is live across all 16 Journal Entries sections",
                )}
              </li>
            ))}
          </ul>
        </article>
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Study later</p>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-700">
            {section.futureScope.items.map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-white p-3">
                {productionText(item)}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
