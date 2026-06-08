"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { saveAttemptHistoryItem } from "@/lib/attempt-history";
import {
  checkLedgerPracticeAnswer,
  formatLedgerPracticeBalance,
  generateLedgerPracticeCase,
  type LedgerPracticeBalanceSide,
  type LedgerPracticeCase,
  type LedgerPracticeCheckResult,
} from "@/lib/ledger-practice-generator";
import type { LedgerAccount, LedgerPosting } from "@/lib/ledger-engine";

const balanceSideOptions: Array<{ value: LedgerPracticeBalanceSide; label: string }> = [
  { value: "debit", label: "Debit" },
  { value: "credit", label: "Credit" },
  { value: "balanced", label: "Balanced" },
];

export default function LedgerPracticePage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [practiceCase, setPracticeCase] = useState<LedgerPracticeCase>(() => generateLedgerPracticeCase(0));
  const [balanceSide, setBalanceSide] = useState<LedgerPracticeBalanceSide>("debit");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<LedgerPracticeCheckResult | null>(null);

  function checkAnswer() {
    const nextResult = checkLedgerPracticeAnswer(practiceCase, balanceSide, amount);
    setResult(nextResult);

    saveAttemptHistoryItem({
      module: "practice",
      topic: "ledger_practice",
      transaction: practiceCase.journalEntries,
      studentEntry: `${titleCase(balanceSide)} balance Rs.${amount || "0"}`,
      resultStatus: nextResult.isCorrect ? "correct" : "incorrect",
      score: nextResult.isCorrect ? 100 : 0,
      mistakeType: nextResult.isCorrect ? "correct" : "Wrong ledger balance",
      correctEntry: nextResult.expectedBalanceText,
      explanation: practiceCase.explanation.join(" "),
    });
  }

  function tryAnotherQuestion() {
    const nextIndex = caseIndex + 1;
    setCaseIndex(nextIndex);
    setPracticeCase(generateLedgerPracticeCase(nextIndex));
    setBalanceSide("debit");
    setAmount("");
    setResult(null);
  }

  function retryQuestion() {
    setBalanceSide("debit");
    setAmount("");
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <JournalEntriesCard practiceCase={practiceCase} />
          <QuestionCard
            practiceCase={practiceCase}
            balanceSide={balanceSide}
            amount={amount}
            result={result}
            onBalanceSideChange={setBalanceSide}
            onAmountChange={setAmount}
            onCheck={checkAnswer}
            onRetry={retryQuestion}
            onTryAnother={tryAnotherQuestion}
          />
        </section>

        {result ? <ResultExplanation practiceCase={practiceCase} result={result} /> : null}
      </section>
    </main>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <nav className="hidden flex-wrap items-center gap-3 text-sm font-semibold sm:flex">
        <Link href="/dashboard" className="text-blue-800 transition hover:text-blue-950">
          Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
          Learn
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Tools
        </Link>
      </nav>
      <nav className="flex items-center justify-between gap-3 text-sm font-semibold sm:hidden">
        <span className="text-blue-950">Ledger Practice</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Workflow practice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Ledger Practice</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Practice posting journal entries into ledger accounts and finding account balances.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Read the journal entries, identify the target account, and calculate the ledger balance.
        </p>
      </div>
    </header>
  );
}

function JournalEntriesCard({ practiceCase }: { practiceCase: LedgerPracticeCase }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Case</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">{practiceCase.title}</h2>
      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="text-sm font-bold text-blue-950">Journal entries</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-sm leading-7 text-slate-900">
          {practiceCase.journalEntries}
        </pre>
      </div>
    </section>
  );
}

function QuestionCard({
  practiceCase,
  balanceSide,
  amount,
  result,
  onBalanceSideChange,
  onAmountChange,
  onCheck,
  onRetry,
  onTryAnother,
}: {
  practiceCase: LedgerPracticeCase;
  balanceSide: LedgerPracticeBalanceSide;
  amount: string;
  result: LedgerPracticeCheckResult | null;
  onBalanceSideChange: (value: LedgerPracticeBalanceSide) => void;
  onAmountChange: (value: string) => void;
  onCheck: () => void;
  onRetry: () => void;
  onTryAnother: () => void;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Question</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">What is the balance of {practiceCase.targetAccount} A/c?</h2>

      <div className="mt-5 grid gap-4">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">Balance side</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {balanceSideOptions.map((option) => (
              <label
                key={option.value}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  balanceSide === option.value
                    ? "border-blue-300 bg-blue-50 text-blue-950"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                <input
                  type="radio"
                  name="balance-side"
                  value={option.value}
                  checked={balanceSide === option.value}
                  onChange={() => onBalanceSideChange(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">Amount</span>
          <input
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="Example: Rs.37,000"
            inputMode="numeric"
            className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={onCheck}
          className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800"
        >
          Check Balance
        </button>
      </div>

      {result ? (
        <div className="mt-5 grid gap-3">
          <ResultSummary practiceCase={practiceCase} result={result} />
          <div className="grid gap-2 sm:grid-cols-2">
            <SecondaryButton onClick={onRetry}>Retry Same Question</SecondaryButton>
            <SecondaryButton onClick={onTryAnother}>Try Another Question</SecondaryButton>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <FeedbackReport
              buttonLabel="Report issue"
              details={{
                module: "Practice",
                transaction: practiceCase.journalEntries,
                studentEntry: `${titleCase(balanceSide)} balance Rs.${amount || "0"}`,
                appResult: [
                  result.isCorrect ? "Status: Correct" : "Status: Needs correction",
                  `Expected: ${result.expectedBalanceText}`,
                  `Explanation: ${practiceCase.explanation.join(" ")}`,
                ].join("\n"),
                appCorrectEntry: result.expectedBalanceText,
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ResultSummary({
  practiceCase,
  result,
}: {
  practiceCase: LedgerPracticeCase;
  result: LedgerPracticeCheckResult;
}) {
  if (result.isCorrect) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900">
        <p className="text-sm font-bold">Correct.</p>
        <p className="mt-1 text-sm font-semibold leading-6">{formatLedgerPracticeBalance(practiceCase)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950">
      <p className="text-sm font-bold">Needs correction.</p>
      <p className="mt-1 text-sm font-semibold leading-6">Correct answer: {result.expectedBalanceText}</p>
    </div>
  );
}

function ResultExplanation({
  practiceCase,
  result,
}: {
  practiceCase: LedgerPracticeCase;
  result: LedgerPracticeCheckResult;
}) {
  return (
    <section className="grid gap-5">
      <ResultSection title="Correct ledger explanation" tone={result.isCorrect ? "success" : "warning"}>
        <ol className="grid gap-2 text-sm leading-6 text-slate-700">
          {practiceCase.explanation.map((step, index) => (
            <li key={`explanation-${step}-${index}`} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </ResultSection>

      <ResultSection title={`${practiceCase.targetAccount} A/c`}>
        <LedgerAccountView account={practiceCase.targetLedgerAccount} />
      </ResultSection>
    </section>
  );
}

function LedgerAccountView({ account }: { account: LedgerAccount }) {
  const rowCount = Math.max(account.debitPostings.length, account.creditPostings.length, 1);
  const rows = Array.from({ length: rowCount }, (_, index) => ({
    debit: account.debitPostings[index],
    credit: account.creditPostings[index],
  }));

  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 bg-blue-950 text-left text-white">
            <th className="px-3 py-3 font-semibold">Debit side</th>
            <th className="px-3 py-3 text-right font-semibold">Amount Rs.</th>
            <th className="px-3 py-3 font-semibold">Credit side</th>
            <th className="px-3 py-3 text-right font-semibold">Amount Rs.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`ledger-row-${index}`} className="border-b border-blue-50 last:border-b-0">
              <PostingCell posting={row.debit} />
              <AmountCell amount={row.debit?.amount} />
              <PostingCell posting={row.credit} />
              <AmountCell amount={row.credit?.amount} />
            </tr>
          ))}
          <tr className="border-t-2 border-blue-100 bg-blue-50 text-blue-950">
            <td className="px-3 py-3 font-bold">Debit total</td>
            <td className="px-3 py-3 text-right font-bold">{formatAmount(account.debitTotal)}</td>
            <td className="px-3 py-3 font-bold">Credit total</td>
            <td className="px-3 py-3 text-right font-bold">{formatAmount(account.creditTotal)}</td>
          </tr>
          <tr className="bg-emerald-50 text-emerald-950">
            <td className="px-3 py-3 font-bold" colSpan={4}>
              Balance: {account.balanceSide === "balanced" ? "Balanced" : `${titleCase(account.balanceSide)} Rs.${formatAmount(account.balanceAmount)}`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PostingCell({ posting }: { posting?: LedgerPosting }) {
  return <td className="px-3 py-3 font-semibold text-blue-950">{posting ? posting.reference : "-"}</td>;
}

function AmountCell({ amount }: { amount?: number }) {
  return <td className="px-3 py-3 text-right font-semibold text-slate-900">{amount ? formatAmount(amount) : "-"}</td>;
}

function ResultSection({
  title,
  tone = "default",
  children,
}: {
  title: string;
  tone?: "default" | "success" | "warning";
  children: ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-slate-200 bg-white";

  return (
    <section className={`rounded-2xl border p-4 shadow-soft sm:p-6 ${toneClass}`}>
      <h2 className="text-lg font-bold text-blue-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SecondaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50"
    >
      {children}
    </button>
  );
}

function formatAmount(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
