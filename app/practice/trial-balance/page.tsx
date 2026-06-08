"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { saveAttemptHistoryItem } from "@/lib/attempt-history";
import {
  checkTrialBalancePracticeAnswer,
  generateTrialBalancePracticeCase,
  type TrialBalancePracticeAgreeAnswer,
  type TrialBalancePracticeCase,
  type TrialBalancePracticeCheckResult,
  type TrialBalancePracticeTargetSide,
} from "@/lib/trial-balance-practice-generator";
import type { TrialBalanceRow } from "@/lib/trial-balance-engine";

const targetSideOptions: Array<{ value: TrialBalancePracticeTargetSide; label: string }> = [
  { value: "debit", label: "Debit" },
  { value: "credit", label: "Credit" },
  { value: "not_shown", label: "Not shown" },
];

const agreeOptions: Array<{ value: TrialBalancePracticeAgreeAnswer; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function TrialBalancePracticePage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [practiceCase, setPracticeCase] = useState<TrialBalancePracticeCase>(() => generateTrialBalancePracticeCase(0));
  const [targetSide, setTargetSide] = useState<TrialBalancePracticeTargetSide>("debit");
  const [targetAmount, setTargetAmount] = useState("");
  const [debitTotal, setDebitTotal] = useState("");
  const [creditTotal, setCreditTotal] = useState("");
  const [agrees, setAgrees] = useState<TrialBalancePracticeAgreeAnswer>("yes");
  const [result, setResult] = useState<TrialBalancePracticeCheckResult | null>(null);

  function checkAnswer() {
    const nextResult = checkTrialBalancePracticeAnswer(practiceCase, {
      targetSide,
      targetAmountText: targetAmount,
      debitTotalText: debitTotal,
      creditTotalText: creditTotal,
      agrees,
    });
    setResult(nextResult);

    saveAttemptHistoryItem({
      module: "practice",
      topic: "trial_balance_practice",
      transaction: practiceCase.journalEntries,
      studentEntry: [
        `${practiceCase.targetAccount} A/c: ${formatTargetSide(targetSide)} Rs.${targetAmount || "0"}`,
        `Debit total: Rs.${debitTotal || "0"}`,
        `Credit total: Rs.${creditTotal || "0"}`,
        `Agrees: ${agrees === "yes" ? "Yes" : "No"}`,
      ].join("\n"),
      resultStatus: nextResult.isCorrect ? "correct" : "incorrect",
      score: nextResult.score,
      mistakeType: nextResult.isCorrect ? "correct" : "Wrong trial balance answer",
      correctEntry: nextResult.expectedAnswerText,
      explanation: practiceCase.explanation.join(" "),
    });
  }

  function tryAnotherQuestion() {
    const nextIndex = caseIndex + 1;
    setCaseIndex(nextIndex);
    setPracticeCase(generateTrialBalancePracticeCase(nextIndex));
    resetAnswer();
  }

  function retryQuestion() {
    resetAnswer();
  }

  function resetAnswer() {
    setTargetSide("debit");
    setTargetAmount("");
    setDebitTotal("");
    setCreditTotal("");
    setAgrees("yes");
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
            targetSide={targetSide}
            targetAmount={targetAmount}
            debitTotal={debitTotal}
            creditTotal={creditTotal}
            agrees={agrees}
            result={result}
            onTargetSideChange={setTargetSide}
            onTargetAmountChange={setTargetAmount}
            onDebitTotalChange={setDebitTotal}
            onCreditTotalChange={setCreditTotal}
            onAgreesChange={setAgrees}
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
        <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
          Start
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
        <span className="text-blue-950">Trial Balance Practice</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Workflow practice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
          Trial Balance Practice
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Practice preparing trial balance from journal entries and ledger balances.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Read the journal entries, identify ledger balances, and check whether debit and credit totals agree.
        </p>
      </div>
    </header>
  );
}

function JournalEntriesCard({ practiceCase }: { practiceCase: TrialBalancePracticeCase }) {
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
  targetSide,
  targetAmount,
  debitTotal,
  creditTotal,
  agrees,
  result,
  onTargetSideChange,
  onTargetAmountChange,
  onDebitTotalChange,
  onCreditTotalChange,
  onAgreesChange,
  onCheck,
  onRetry,
  onTryAnother,
}: {
  practiceCase: TrialBalancePracticeCase;
  targetSide: TrialBalancePracticeTargetSide;
  targetAmount: string;
  debitTotal: string;
  creditTotal: string;
  agrees: TrialBalancePracticeAgreeAnswer;
  result: TrialBalancePracticeCheckResult | null;
  onTargetSideChange: (value: TrialBalancePracticeTargetSide) => void;
  onTargetAmountChange: (value: string) => void;
  onDebitTotalChange: (value: string) => void;
  onCreditTotalChange: (value: string) => void;
  onAgreesChange: (value: TrialBalancePracticeAgreeAnswer) => void;
  onCheck: () => void;
  onRetry: () => void;
  onTryAnother: () => void;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Question</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Prepare the Trial Balance totals</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
        Identify the balance of {practiceCase.targetAccount} A/c and check whether both totals agree.
      </p>

      <div className="mt-5 grid gap-4">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">{practiceCase.targetAccount} A/c side</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {targetSideOptions.map((option) => (
              <SegmentedOption
                key={option.value}
                name="target-side"
                label={option.label}
                checked={targetSide === option.value}
                onChange={() => onTargetSideChange(option.value)}
              />
            ))}
          </div>
        </fieldset>

        <AmountInput
          label={`${practiceCase.targetAccount} A/c amount`}
          value={targetAmount}
          onChange={onTargetAmountChange}
          placeholder="Example: Rs.37,000"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AmountInput
            label="Trial Balance debit total"
            value={debitTotal}
            onChange={onDebitTotalChange}
            placeholder="Example: Rs.50,000"
          />
          <AmountInput
            label="Trial Balance credit total"
            value={creditTotal}
            onChange={onCreditTotalChange}
            placeholder="Example: Rs.50,000"
          />
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">Does Trial Balance agree?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {agreeOptions.map((option) => (
              <SegmentedOption
                key={option.value}
                name="trial-balance-agrees"
                label={option.label}
                checked={agrees === option.value}
                onChange={() => onAgreesChange(option.value)}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onCheck}
          className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800"
        >
          Check Trial Balance
        </button>
      </div>

      {result ? (
        <div className="mt-5 grid gap-3">
          <ResultSummary result={result} />
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
                studentEntry: [
                  `${practiceCase.targetAccount} A/c: ${formatTargetSide(targetSide)} Rs.${targetAmount || "0"}`,
                  `Debit total: Rs.${debitTotal || "0"}`,
                  `Credit total: Rs.${creditTotal || "0"}`,
                  `Agrees: ${agrees === "yes" ? "Yes" : "No"}`,
                ].join("\n"),
                appResult: [
                  result.isCorrect ? "Status: Correct" : "Status: Needs correction",
                  `Score: ${result.score}/100`,
                  `Expected: ${result.expectedAnswerText}`,
                  `Explanation: ${practiceCase.explanation.join(" ")}`,
                ].join("\n"),
                appCorrectEntry: result.expectedAnswerText,
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function AmountInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function SegmentedOption({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition ${
        checked
          ? "border-blue-300 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function ResultSummary({ result }: { result: TrialBalancePracticeCheckResult }) {
  if (result.isCorrect) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900">
        <p className="text-sm font-bold">Correct.</p>
        <p className="mt-1 text-sm font-semibold leading-6">Your Trial Balance answer is right.</p>
        <p className="mt-1 text-sm font-bold">Score: {result.score}/100</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950">
      <p className="text-sm font-bold">Needs correction.</p>
      <p className="mt-1 text-sm font-semibold leading-6">Correct answer: {result.expectedAnswerText}</p>
      <p className="mt-1 text-sm font-bold">Score: {result.score}/100</p>
    </div>
  );
}

function ResultExplanation({
  practiceCase,
  result,
}: {
  practiceCase: TrialBalancePracticeCase;
  result: TrialBalancePracticeCheckResult;
}) {
  return (
    <section className="grid gap-5">
      <ResultSection title="Correct Trial Balance table">
        <TrialBalanceTable
          rows={practiceCase.trialBalanceRows}
          debitTotal={practiceCase.expectedDebitTotal}
          creditTotal={practiceCase.expectedCreditTotal}
          agrees={practiceCase.expectedAgrees}
        />
      </ResultSection>

      <ResultSection title="Explanation" tone={result.isCorrect ? "success" : "warning"}>
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
    </section>
  );
}

function TrialBalanceTable({
  rows,
  debitTotal,
  creditTotal,
  agrees,
}: {
  rows: TrialBalanceRow[];
  debitTotal: number;
  creditTotal: number;
  agrees: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 bg-blue-950 text-left text-white">
            <th className="px-3 py-3 font-semibold">Account</th>
            <th className="px-3 py-3 text-right font-semibold">Debit Rs.</th>
            <th className="px-3 py-3 text-right font-semibold">Credit Rs.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.account} className="border-b border-blue-50 last:border-b-0">
              <td className="px-3 py-3 font-semibold text-blue-950">{row.account} A/c</td>
              <td className="px-3 py-3 text-right font-semibold text-slate-900">
                {row.debit > 0 ? formatAmount(row.debit) : "-"}
              </td>
              <td className="px-3 py-3 text-right font-semibold text-slate-900">
                {row.credit > 0 ? formatAmount(row.credit) : "-"}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-blue-100 bg-blue-50 text-blue-950">
            <td className="px-3 py-3 font-bold">Total</td>
            <td className="px-3 py-3 text-right font-bold">{formatAmount(debitTotal)}</td>
            <td className="px-3 py-3 text-right font-bold">{formatAmount(creditTotal)}</td>
          </tr>
          <tr className="bg-emerald-50 text-emerald-950">
            <td className="px-3 py-3 font-bold" colSpan={3}>
              Trial Balance {agrees ? "agrees" : "does not agree"}.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
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

function formatTargetSide(side: TrialBalancePracticeTargetSide): string {
  if (side === "not_shown") return "Not shown";
  return side.charAt(0).toUpperCase() + side.slice(1);
}
