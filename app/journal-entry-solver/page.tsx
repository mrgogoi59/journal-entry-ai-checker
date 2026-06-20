"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import type {
  JournalEntrySolverResponse,
  SolverAffectedAccount,
  SolverJournalEntryLine,
  SolverPossibleInterpretation,
} from "@/lib/types";

const examples = [
  "Bought goods for cash Rs.10000",
  "Paid rent Rs.5000",
  "Sold machinery Rs.40000 plus GST 18%",
  "Set off Input GST Rs.5000 against Output GST Rs.8000",
];

const heroBadges = ["Beginner friendly", "Step-by-step logic", "Debit & Credit rules", "Commerce students"];

const loadingSteps = ["Analyzing transaction...", "Identifying affected accounts...", "Applying debit-credit rules..."];

export default function JournalEntrySolverPage() {
  const [transaction, setTransaction] = useState("");
  const [result, setResult] = useState<JournalEntrySolverResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputSectionRef = useRef<HTMLElement | null>(null);
  const transactionInputRef = useRef<HTMLTextAreaElement | null>(null);

  async function explainTransaction() {
    setError("");
    setResult(null);

    if (!transaction.trim()) {
      setError("Enter a transaction first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/journal-entry-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction, mode: "beginner" }),
      });
      const data = (await response.json()) as JournalEntrySolverResponse;

      if (!response.ok) {
        setError("Could not explain this transaction. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Could not reach the explainer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function tryAnotherTransaction() {
    setTransaction("");
    setResult(null);
    setError("");
    window.setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      transactionInputRef.current?.focus();
    }, 0);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1080px] flex-col gap-5 sm:gap-6">
        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
          <nav className="hidden flex-wrap items-center gap-3 text-sm font-semibold sm:flex">
            <Link href="/" className="text-blue-800 transition hover:text-blue-950">
              Back to Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
              Supported Topics
            </Link>
          </nav>
          <nav className="flex items-center justify-between gap-3 text-sm font-semibold sm:hidden">
            <span className="text-blue-950">Explainer</span>
            <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
              Supported Topics
            </Link>
          </nav>
          <div className="mt-7 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Explain Transaction</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
              AI Journal Entry Explainer
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Enter a transaction and understand the exact debit-credit logic step by step.
            </p>
            <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
              This tool teaches the logic behind the entry, not just the answer.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-blue-100 bg-white/90 px-3 py-2 text-sm font-semibold text-blue-900 shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </header>

        <section ref={inputSectionRef} className="scroll-mt-5 rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Enter a business transaction</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Write the transaction clearly with amount and payment mode when possible.
              </p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-800">Business Transaction</span>
              <textarea
                ref={transactionInputRef}
                value={transaction}
                onChange={(event) => setTransaction(event.target.value)}
                placeholder="Example: Bought goods for cash Rs.10000"
                className="min-h-36 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base leading-7 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setTransaction(example);
                    setResult(null);
                    setError("");
                  }}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-left text-sm font-semibold text-blue-900 transition hover:border-blue-300 hover:bg-white"
                >
                  {example}
                </button>
              ))}
            </div>

            {error ? <MessageBox message={error} /> : null}
            {isLoading ? <LoadingPanel /> : null}

            <button
              type="button"
              onClick={explainTransaction}
              disabled={isLoading}
              className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? "Explaining..." : "Explain Journal Entry"}
            </button>
          </div>
        </section>

        {result ? <SolverResult result={result} onTryAnother={tryAnotherTransaction} /> : <EmptyPreview />}
      </section>
    </main>
  );
}

function SolverResult({ result, onTryAnother }: { result: JournalEntrySolverResponse; onTryAnother: () => void }) {
  if (result.status === "ambiguous") {
    return <AmbiguousResult result={result} onTryAnother={onTryAnother} />;
  }

  if (result.status === "unsupported") {
    return <UnsupportedResult result={result} onTryAnother={onTryAnother} />;
  }

  return (
    <section className="grid gap-5">
      <ResultSection title="Final Journal Entry" emphasis>
        <JournalEntryTable lines={result.journalEntry} />
      </ResultSection>

      <ResultSection title="Narration">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium leading-7 text-emerald-950">
          {result.narration || "Narration not available for this transaction."}
        </div>
      </ResultSection>

      <ResultSection title="Affected Accounts">
        <AffectedAccountsTable accounts={result.affectedAccounts} />
      </ResultSection>

      <ResultSection title="Step-by-step Logic">
        <StepList steps={result.stepByStepExplanation} />
      </ResultSection>

      <ResultSection title="Common Mistakes" tone="warning">
        <ul className="grid gap-2 text-sm leading-6 text-amber-950">
          {result.commonMistakes.map((mistake, index) => (
            <li
              key={`mistake-${mistake}-${index}`}
              className="rounded-xl border border-amber-200 bg-white/80 px-4 py-3"
            >
              {mistake}
            </li>
          ))}
        </ul>
      </ResultSection>

      <ResultSection title="Practice Next">
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-sm font-bold leading-6 text-blue-950">{result.practiceQuestion.question}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{result.practiceQuestion.expectedPattern}</p>
        </div>
      </ResultSection>

      <SolvedResultActions result={result} />
    </section>
  );
}

function EmptyPreview() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Preview</p>
          <h2 className="mt-1 text-xl font-bold text-blue-950">Your explanation will appear here</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          The explainer will show the entry, narration, affected accounts, logic, common mistakes, and a practice prompt.
        </p>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-blue-100 bg-white text-left text-slate-600">
              <th className="px-3 py-3 font-semibold">Particulars</th>
              <th className="px-3 py-3 text-right font-semibold">Debit ₹</th>
              <th className="px-3 py-3 text-right font-semibold">Credit ₹</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-50 bg-white/70">
              <td className="px-3 py-3 font-semibold text-blue-950">Purchases A/c Dr.</td>
              <td className="px-3 py-3 text-right font-semibold text-blue-950">10,000</td>
              <td className="px-3 py-3 text-right text-slate-400">-</td>
            </tr>
            <tr className="bg-white/70">
              <td className="px-3 py-3 pl-7 font-semibold text-blue-950">To Cash A/c</td>
              <td className="px-3 py-3 text-right text-slate-400">-</td>
              <td className="px-3 py-3 text-right font-semibold text-blue-950">10,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-emerald-950">
        Being goods purchased for cash.
      </p>
    </section>
  );
}

function AmbiguousResult({ result, onTryAnother }: { result: JournalEntrySolverResponse; onTryAnother: () => void }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Needs more context</p>
      <h2 className="mt-2 text-2xl font-bold text-amber-950">I cannot safely solve this yet.</h2>
      <div className="mt-4 grid gap-3">
        <IssueInfo label="Reason" value={result.message || "The transaction can be read in more than one way."} />
        <IssueInfo label="Try writing it like" value={suggestedRewrite(result)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold text-amber-950">Questions to ask</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6">
            {result.ambiguityQuestions.map((question, index) => (
              <li key={`question-${question}-${index}`} className="rounded-xl border border-amber-100 bg-white px-3 py-2">
                {question}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-amber-950">Possible interpretations</h3>
          <div className="mt-2 grid gap-2">
            {result.possibleInterpretations.map((interpretation, index) => (
              <InterpretationCard key={`interpretation-${interpretation.context}-${index}`} interpretation={interpretation} />
            ))}
          </div>
        </div>
      </div>

      <UnsolvedResultActions result={result} onTryAnother={onTryAnother} />
    </section>
  );
}

function UnsupportedResult({ result, onTryAnother }: { result: JournalEntrySolverResponse; onTryAnother: () => void }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Unsupported for now</p>
      <h2 className="mt-2 text-2xl font-bold text-amber-950">I cannot safely solve this yet.</h2>
      <div className="mt-4 grid gap-3">
        <IssueInfo
          label="Reason"
          value={result.message ?? "This transaction is outside the current supported rule set."}
        />
        <IssueInfo label="Try writing it like" value={suggestedRewrite(result)} />
      </div>

      <UnsolvedResultActions result={result} onTryAnother={onTryAnother} />
    </section>
  );
}

function SolvedResultActions({ result }: { result: JournalEntrySolverResponse }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Next actions</p>
      <h2 className="mt-1 text-xl font-bold text-blue-950">Use this explanation</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <ActionLink href="/practice/journal-entries" variant="primary">
          Practice Similar
        </ActionLink>
        <ActionLink href="/tools" variant="secondary">
          Check My Answer
        </ActionLink>
        <ActionLink href="/supported-transactions" variant="secondary">
          View Supported Topics
        </ActionLink>
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
        <FeedbackReport buttonLabel="Report issue" details={buildSolverFeedbackDetails(result)} />
      </div>
    </section>
  );
}

function UnsolvedResultActions({
  result,
  onTryAnother,
}: {
  result: JournalEntrySolverResponse;
  onTryAnother: () => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4">
      <p className="text-sm font-bold uppercase tracking-normal text-amber-700">Next actions</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <ActionLink href="/supported-transactions" variant="primary">
          View Supported Topics
        </ActionLink>
        <button
          type="button"
          onClick={onTryAnother}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50"
        >
          Try Another Transaction
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <FeedbackReport buttonLabel="Report issue" details={buildSolverFeedbackDetails(result)} />
        </div>
      </div>
    </div>
  );
}

function ActionLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
}) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-900 px-4 py-3 text-base font-bold text-white transition hover:bg-blue-800"
      : "inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function InterpretationCard({ interpretation }: { interpretation: SolverPossibleInterpretation }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white p-3 text-sm text-slate-800 shadow-sm">
      <div className="font-bold text-amber-950">{interpretation.context}</div>
      <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800">
        {interpretation.journalEntry.join("\n")}
      </pre>
      <p className="mt-2 leading-5 text-slate-600">{interpretation.note}</p>
    </div>
  );
}

function ResultSection({
  title,
  children,
  emphasis = false,
  tone = "default",
}: {
  title: string;
  children: ReactNode;
  emphasis?: boolean;
  tone?: "default" | "warning";
}) {
  const sectionClass =
    tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : emphasis
        ? "border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white ring-2 ring-blue-100"
        : "border-slate-200 bg-white";

  return (
    <section className={`rounded-2xl border p-4 shadow-soft sm:p-6 ${sectionClass}`}>
      <h2 className={emphasis ? "text-xl font-bold text-blue-950" : "text-lg font-bold text-blue-950"}>{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function JournalEntryTable({ lines }: { lines: SolverJournalEntryLine[] }) {
  const debitTotal = lines.reduce((total, line) => total + line.debit, 0);
  const creditTotal = lines.reduce((total, line) => total + line.credit, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 bg-blue-950 text-left text-white">
            <th className="px-4 py-3 font-semibold">Particulars</th>
            <th className="px-4 py-3 text-right font-semibold">Debit ₹</th>
            <th className="px-4 py-3 text-right font-semibold">Credit ₹</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr
              key={`journal-${line.account}-${line.debit}-${line.credit}-${index}`}
              className="border-b border-blue-50 last:border-b-0"
            >
              <td className={`px-4 py-3 font-semibold text-blue-950 ${line.credit > 0 ? "pl-8" : ""}`}>
                {line.debit > 0 ? `${line.account} Dr.` : `To ${line.account}`}
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">
                {line.debit > 0 ? formatAmount(line.debit) : "-"}
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">
                {line.credit > 0 ? formatAmount(line.credit) : "-"}
              </td>
            </tr>
          ))}
          {debitTotal > 0 || creditTotal > 0 ? (
            <tr className="border-t-2 border-blue-100 bg-blue-50 text-blue-950">
              <td className="px-4 py-3 font-bold">Total</td>
              <td className="px-4 py-3 text-right font-bold">{formatAmount(debitTotal)}</td>
              <td className="px-4 py-3 text-right font-bold">{formatAmount(creditTotal)}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function AffectedAccountsTable({ accounts }: { accounts: SolverAffectedAccount[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
            <th className="px-3 py-3 font-semibold">Account</th>
            <th className="px-3 py-3 font-semibold">Nature</th>
            <th className="px-3 py-3 font-semibold">Effect</th>
            <th className="px-3 py-3 font-semibold">Debit/Credit</th>
            <th className="px-3 py-3 font-semibold">Rule Applied</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr
              key={`affected-${account.account}-${account.debitOrCredit}-${index}`}
              className="border-b border-slate-100 last:border-b-0"
            >
              <td className="px-3 py-3 font-bold text-blue-950">{account.account}</td>
              <td className="px-3 py-3">
                <MetaBadge value={account.modernType} />
              </td>
              <td className="px-3 py-3 text-slate-700">{account.effect}</td>
              <td className="px-3 py-3">
                <MetaBadge value={account.debitOrCredit} />
              </td>
              <td className="px-3 py-3 text-slate-700">{account.ruleApplied}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3 text-sm leading-6 text-slate-700">
      {steps.map((step, index) => (
        <li key={`step-${step}-${index}`} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
      {message}
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full w-2/3 rounded-full bg-blue-900" />
      </div>
      <div className="mt-4 grid gap-2">
        {loadingSteps.map((step, index) => (
          <div
            key={`loading-${step}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-blue-950"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaBadge({ value }: { value: string }) {
  const normalizedValue = value.toLowerCase();
  const tone = normalizedValue.includes("debit") || normalizedValue.includes("asset") || normalizedValue.includes("expense")
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : normalizedValue.includes("credit") || normalizedValue.includes("liability") || normalizedValue.includes("income")
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>
      {value}
    </span>
  );
}

function IssueInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">{value}</p>
    </div>
  );
}

function suggestedRewrite(result: JournalEntrySolverResponse): string {
  if (result.status === "ambiguous") {
    return "Mention the account, party role, payment mode, and amount clearly.";
  }

  return "Include the amount, payment mode, and account context. Example: Paid rent by cash Rs.5000.";
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function buildSolverFeedbackDetails(result: JournalEntrySolverResponse) {
  return {
    module: "Explainer" as const,
    transaction: result.transactionSummary,
    appResult: [
      `Solver status: ${result.status}`,
      result.narration ? `Narration: ${result.narration}` : "",
      result.message ? `Reason/message: ${result.message}` : "",
      result.stepByStepExplanation.length
        ? `Step-by-step explanation:\n${result.stepByStepExplanation.join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    appCorrectEntry: result.journalEntry.length ? formatSolverJournalEntry(result.journalEntry) : "No final entry shown.",
  };
}

function formatSolverJournalEntry(lines: SolverJournalEntryLine[]): string {
  return lines
    .map((line) =>
      line.debit > 0
        ? `${line.account} Dr. Rs.${line.debit.toLocaleString("en-IN")}`
        : `To ${line.account} Rs.${line.credit.toLocaleString("en-IN")}`,
    )
    .join("\n");
}
