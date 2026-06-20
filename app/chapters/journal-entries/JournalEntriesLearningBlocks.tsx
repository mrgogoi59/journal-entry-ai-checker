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
};

export function productionText(text: string) {
  return text
    .replace(/Preview\/static only/gi, "Read-only production route")
    .replace(/Preview\/static/gi, "Read-only")
    .replace(/preview\/static only/gi, "read-only production route")
    .replace(/preview\/static/gi, "read-only")
    .replace(/preview-only/gi, "read-only")
    .replace(/internal preview/gi, "production chapter")
    .replace(/static preview/gi, "read-only chapter")
    .replace(/preview chapter/gi, "chapter")
    .replace(/prototype scope/gi, "migration scope")
    .replace(/prototype/gi, "chapter")
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
            body="All sixteen Journal Entries sections are available in this production chapter."
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
              <span className="min-w-0">{item.title}</span>
              {!isActive ? (
                <span className="ml-auto rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-cyan-800">
                  Available
                </span>
              ) : null}
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
      <JournalEntryPracticeEditor
        question={question}
        checkAnswerAction={checkAnswerAction}
        revealCorrectAnswerAction={revealCorrectAnswerAction}
        supportNotice="This chapter checker supports this audited question only. No API route, storage, analytics, or existing checker is called."
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
      ? { label: "Interactive practice checking", value: "2 live" }
      : { label: productionText(stat.label), value: productionText(stat.value) },
  );

  return (
    <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">Read-only chapter progress</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-cyan-950 sm:text-3xl">
            Journal Entries foundation chapter
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-cyan-900">
            You have reached the final recap page for this production chapter. The two approved interactive questions
            are available in Section 1.
          </p>
        </div>
        <span className="inline-flex self-start rounded-full border border-cyan-300 bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-800">
          Controlled route
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {productionStats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-cyan-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{stat.label}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{stat.value}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-cyan-900">
        Completion is not stored, no localStorage is written, and no analytics event is sent from this recap.
      </p>
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
        body="These are the only two interactive Practice It Yourself questions currently live in this production chapter."
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
      <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <h3 className="text-base font-black text-cyan-950">{productionText(section.currentScope.title)}</h3>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-cyan-900">
            {section.currentScope.items.map((item) => (
              <li key={item} className="rounded-xl border border-cyan-200 bg-white p-3">
                {productionText(item).replace("Deterministic practice for two approved questions", "Deterministic practice for two approved questions is live in Section 1")}
              </li>
            ))}
          </ul>
        </article>
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{productionText(section.futureScope.label)}</p>
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
