"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type {
  JournalEntrySolverResponse,
  SolverAffectedAccount,
  SolverJournalEntryLine,
  SolverMode,
  SolverPossibleInterpretation,
} from "@/lib/types";

const examples = [
  "Bought goods for cash Rs.10000",
  "Sold goods to Ram on credit Rs.5000",
  "Paid rent by UPI Rs.2000",
  "Started business with cash Rs.50000",
  "Set off Input GST Rs.5000 against Output GST Rs.8000 and paid balance through bank",
];

export default function JournalEntrySolverPage() {
  const [transaction, setTransaction] = useState("");
  const [mode, setMode] = useState<SolverMode>("beginner");
  const [result, setResult] = useState<JournalEntrySolverResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        body: JSON.stringify({ transaction, mode }),
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

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[920px] flex-col gap-4 sm:gap-5">
        <header>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-blue-700">
            Back to checker
          </Link>
          <p className="mt-4 text-sm font-semibold text-accent">Explain Transaction</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            AI Journal Entry Explainer
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Enter a transaction and understand the exact debit-credit logic.
          </p>
          <p className="mt-2 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft">
            This tool teaches the logic. It is not just an answer shortcut.
          </p>
        </header>

        <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-paper p-2">
              <button type="button" onClick={() => setMode("beginner")} className={modeButtonClass(mode === "beginner")}>
                <span>Beginner Mode</span>
                <span className="text-xs font-medium leading-5 opacity-80">Detailed explanation</span>
              </button>
              <button type="button" onClick={() => setMode("exam")} className={modeButtonClass(mode === "exam")}>
                <span>Exam Mode</span>
                <span className="text-xs font-medium leading-5 opacity-80">Concise answer</span>
              </button>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-ink">Transaction</span>
              <textarea
                value={transaction}
                onChange={(event) => setTransaction(event.target.value)}
                placeholder="Example: Bought goods for cash Rs.10000"
                className="min-h-32 resize-y rounded-lg border border-line bg-white px-4 py-3 text-base leading-6 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
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
                  className="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-accent hover:text-accent"
                >
                  {example}
                </button>
              ))}
            </div>

            {error ? <MessageBox message={error} /> : null}

            <button
              type="button"
              onClick={explainTransaction}
              disabled={isLoading}
              className="min-h-12 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading
                ? "Analyzing transaction... Identifying affected accounts... Applying debit-credit rules..."
                : "Explain Journal Entry"}
            </button>
          </div>
        </section>

        {result ? <SolverResult result={result} mode={mode} /> : <EmptyPreview />}
      </section>
    </main>
  );
}

function SolverResult({ result, mode }: { result: JournalEntrySolverResponse; mode: SolverMode }) {
  if (result.status === "ambiguous") {
    return <AmbiguousResult result={result} />;
  }

  if (result.status === "unsupported") {
    return <UnsupportedResult result={result} />;
  }

  return (
    <section className="grid gap-4">
      <ResultSection title="Final Journal Entry" emphasis>
        <JournalEntryTable lines={result.journalEntry} />
      </ResultSection>

      <ResultSection title="Narration">
        <p className="text-sm leading-6 text-slate-700">{result.narration}</p>
      </ResultSection>

      {mode === "beginner" ? (
        <>
          <ResultSection title="Affected Accounts">
            <AffectedAccountsTable accounts={result.affectedAccounts} />
          </ResultSection>

          <ResultSection title="Step-by-step Logic">
            <StepList steps={result.stepByStepExplanation} />
          </ResultSection>

          <ResultSection title="Common Mistakes">
            <ul className="grid gap-2 text-sm leading-6 text-slate-700">
              {result.commonMistakes.map((mistake, index) => (
                <li key={`mistake-${mistake}-${index}`}>{mistake}</li>
              ))}
            </ul>
          </ResultSection>

          <ResultSection title="Practice Next">
            <p className="text-sm font-semibold text-ink">{result.practiceQuestion.question}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{result.practiceQuestion.expectedPattern}</p>
          </ResultSection>
        </>
      ) : (
        <ResultSection title="Short Logic">
          <StepList steps={result.stepByStepExplanation} />
        </ResultSection>
      )}
    </section>
  );
}

function EmptyPreview() {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
      <h2 className="text-sm font-bold text-ink">Sample preview</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate-600">
              <th className="py-2 pr-3 font-semibold">Particulars</th>
              <th className="py-2 pr-3 text-right font-semibold">Debit ₹</th>
              <th className="py-2 text-right font-semibold">Credit ₹</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="py-3 pr-3 font-medium text-ink">Purchases A/c Dr.</td>
              <td className="py-3 pr-3 text-right text-ink">10,000</td>
              <td className="py-3 text-right text-slate-400">-</td>
            </tr>
            <tr>
              <td className="py-3 pr-3 font-medium text-ink">To Cash A/c</td>
              <td className="py-3 pr-3 text-right text-slate-400">-</td>
              <td className="py-3 text-right text-ink">10,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">Being goods purchased for cash.</p>
    </section>
  );
}

function AmbiguousResult({ result }: { result: JournalEntrySolverResponse }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft sm:p-6">
      <h2 className="text-lg font-bold">More information needed</h2>
      <p className="mt-2 text-sm leading-6">{result.message}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold">Questions to ask</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6">
            {result.ambiguityQuestions.map((question, index) => (
              <li key={`question-${question}-${index}`} className="rounded-md bg-white px-3 py-2">
                {question}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">Possible interpretations</h3>
          <div className="mt-2 grid gap-2">
            {result.possibleInterpretations.map((interpretation, index) => (
              <InterpretationCard key={`interpretation-${interpretation.context}-${index}`} interpretation={interpretation} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UnsupportedResult({ result }: { result: JournalEntrySolverResponse }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft sm:p-6">
      <h2 className="text-lg font-bold">I cannot safely solve this transaction yet.</h2>
      <p className="mt-2 text-sm leading-6">
        {result.message ?? "Please rewrite with amount, payment mode, and account context."}
      </p>
      <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm leading-6">
        Please add amount, payment mode, and account context.
      </p>
    </section>
  );
}

function InterpretationCard({ interpretation }: { interpretation: SolverPossibleInterpretation }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-white p-3 text-sm text-slate-800">
      <div className="font-semibold">{interpretation.context}</div>
      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-5">
        {interpretation.journalEntry.join("\n")}
      </pre>
      <p className="mt-2 leading-5 text-slate-600">{interpretation.note}</p>
    </div>
  );
}

function ResultSection({ title, children, emphasis = false }: { title: string; children: ReactNode; emphasis?: boolean }) {
  return (
    <section
      className={`rounded-lg border bg-white p-4 shadow-soft sm:p-6 ${
        emphasis ? "border-accent ring-2 ring-blue-100" : "border-line"
      }`}
    >
      <h2 className={emphasis ? "text-base font-bold text-ink" : "text-sm font-bold text-ink"}>{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function JournalEntryTable({ lines }: { lines: SolverJournalEntryLine[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Particulars</th>
            <th className="px-3 py-2 text-right font-semibold">Debit ₹</th>
            <th className="px-3 py-2 text-right font-semibold">Credit ₹</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => (
            <tr
              key={`journal-${line.account}-${line.debit}-${line.credit}-${index}`}
              className="border-b border-line last:border-b-0"
            >
              <td className="px-3 py-3 font-medium text-ink">
                {line.debit > 0 ? `${line.account} Dr.` : `To ${line.account}`}
              </td>
              <td className="px-3 py-3 text-right text-ink">{line.debit > 0 ? formatAmount(line.debit) : "-"}</td>
              <td className="px-3 py-3 text-right text-ink">{line.credit > 0 ? formatAmount(line.credit) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AffectedAccountsTable({ accounts }: { accounts: SolverAffectedAccount[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="py-2 pr-3 font-semibold">Account</th>
            <th className="py-2 pr-3 font-semibold">Nature</th>
            <th className="py-2 pr-3 font-semibold">Effect</th>
            <th className="py-2 pr-3 font-semibold">Debit/Credit</th>
            <th className="py-2 font-semibold">Rule Applied</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr
              key={`affected-${account.account}-${account.debitOrCredit}-${index}`}
              className="border-b border-line last:border-b-0"
            >
              <td className="py-3 pr-3 font-medium text-ink">{account.account}</td>
              <td className="py-3 pr-3 text-slate-700">{account.modernType}</td>
              <td className="py-3 pr-3 text-slate-700">{account.effect}</td>
              <td className="py-3 pr-3 font-semibold text-ink">{account.debitOrCredit}</td>
              <td className="py-3 text-slate-700">{account.ruleApplied}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid list-decimal gap-2 pl-5 text-sm leading-6 text-slate-700">
      {steps.map((step, index) => (
        <li key={`step-${step}-${index}`}>{step}</li>
      ))}
    </ol>
  );
}

function MessageBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
      {message}
    </div>
  );
}

function modeButtonClass(isActive: boolean): string {
  return [
    "flex min-h-14 flex-col items-center justify-center rounded-md px-3 py-2 text-center text-sm font-semibold transition",
    isActive ? "bg-accent text-white" : "bg-white text-slate-700 hover:bg-white",
  ].join(" ");
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-IN");
}
