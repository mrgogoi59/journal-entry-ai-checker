"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { saveAttemptHistoryItem } from "@/lib/attempt-history";
import {
  checkFinalAccountsPracticeAnswer,
  formatResultLabel,
  generateFinalAccountsPracticeCase,
  type FinalAccountsPracticeAgreeAnswer,
  type FinalAccountsPracticeCase,
  type FinalAccountsPracticeCheckResult,
} from "@/lib/final-accounts-practice-generator";
import type { FinalAccountLine } from "@/lib/final-accounts-engine";

const grossResultOptions: Array<{ value: FinalAccountsPracticeCase["expectedGrossResultType"]; label: string }> = [
  { value: "gross_profit", label: "Gross Profit" },
  { value: "gross_loss", label: "Gross Loss" },
  { value: "none", label: "No Gross Profit/Loss" },
];

const netResultOptions: Array<{ value: FinalAccountsPracticeCase["expectedNetResultType"]; label: string }> = [
  { value: "net_profit", label: "Net Profit" },
  { value: "net_loss", label: "Net Loss" },
  { value: "none", label: "No Net Profit/Loss" },
];

const agreeOptions: Array<{ value: FinalAccountsPracticeAgreeAnswer; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function FinalAccountsPracticePage() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [practiceCase, setPracticeCase] = useState<FinalAccountsPracticeCase>(() =>
    generateFinalAccountsPracticeCase(0),
  );
  const [grossResultType, setGrossResultType] =
    useState<FinalAccountsPracticeCase["expectedGrossResultType"]>("gross_profit");
  const [grossAmount, setGrossAmount] = useState("");
  const [netResultType, setNetResultType] = useState<FinalAccountsPracticeCase["expectedNetResultType"]>("net_profit");
  const [netAmount, setNetAmount] = useState("");
  const [adjustedCapital, setAdjustedCapital] = useState("");
  const [assetTotal, setAssetTotal] = useState("");
  const [liabilityTotal, setLiabilityTotal] = useState("");
  const [balanceSheetAgrees, setBalanceSheetAgrees] = useState<FinalAccountsPracticeAgreeAnswer>("yes");
  const [result, setResult] = useState<FinalAccountsPracticeCheckResult | null>(null);

  function checkAnswer() {
    const nextResult = checkFinalAccountsPracticeAnswer(practiceCase, {
      grossResultType,
      grossAmountText: grossAmount,
      netResultType,
      netAmountText: netAmount,
      adjustedCapitalText: adjustedCapital,
      assetTotalText: assetTotal,
      liabilityTotalText: liabilityTotal,
      balanceSheetAgrees,
    });
    setResult(nextResult);

    saveAttemptHistoryItem({
      module: "practice",
      topic: "final_accounts_practice",
      transaction: formatCaseForHistory(practiceCase),
      studentEntry: [
        `${formatResultLabel(grossResultType)}: Rs.${grossAmount || "0"}`,
        `${formatResultLabel(netResultType)}: Rs.${netAmount || "0"}`,
        `Adjusted Capital: Rs.${adjustedCapital || "0"}`,
        `Total Assets: Rs.${assetTotal || "0"}`,
        `Total Liabilities: Rs.${liabilityTotal || "0"}`,
        `Balance Sheet agrees: ${balanceSheetAgrees === "yes" ? "Yes" : "No"}`,
      ].join("\n"),
      resultStatus: nextResult.isCorrect ? "correct" : "incorrect",
      score: nextResult.score,
      mistakeType: nextResult.isCorrect ? "correct" : "Wrong final accounts result",
      correctEntry: nextResult.expectedAnswerText,
      explanation: practiceCase.explanation.join(" "),
    });
  }

  function tryAnotherQuestion() {
    const nextIndex = caseIndex + 1;
    setCaseIndex(nextIndex);
    setPracticeCase(generateFinalAccountsPracticeCase(nextIndex));
    resetAnswer();
  }

  function retryQuestion() {
    resetAnswer();
  }

  function resetAnswer() {
    setGrossResultType("gross_profit");
    setGrossAmount("");
    setNetResultType("net_profit");
    setNetAmount("");
    setAdjustedCapital("");
    setAssetTotal("");
    setLiabilityTotal("");
    setBalanceSheetAgrees("yes");
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <CaseCard practiceCase={practiceCase} />
          <QuestionCard
            practiceCase={practiceCase}
            grossResultType={grossResultType}
            grossAmount={grossAmount}
            netResultType={netResultType}
            netAmount={netAmount}
            adjustedCapital={adjustedCapital}
            assetTotal={assetTotal}
            liabilityTotal={liabilityTotal}
            balanceSheetAgrees={balanceSheetAgrees}
            result={result}
            onGrossResultTypeChange={setGrossResultType}
            onGrossAmountChange={setGrossAmount}
            onNetResultTypeChange={setNetResultType}
            onNetAmountChange={setNetAmount}
            onAdjustedCapitalChange={setAdjustedCapital}
            onAssetTotalChange={setAssetTotal}
            onLiabilityTotalChange={setLiabilityTotal}
            onBalanceSheetAgreesChange={setBalanceSheetAgrees}
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
        <span className="text-blue-950">Final Accounts Practice</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Workflow practice</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
          Final Accounts Practice
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Practice finding Gross Profit, Net Profit, Adjusted Capital, and Balance Sheet totals.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Read the trial balance and adjustments, then calculate the key final accounts results step by step.
        </p>
      </div>
    </header>
  );
}

function CaseCard({ practiceCase }: { practiceCase: FinalAccountsPracticeCase }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Case</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">{practiceCase.title}</h2>
      <div className="mt-4 grid gap-4">
        <TextBlock title="Trial Balance balances" content={practiceCase.trialBalance} />
        <TextBlock title="Adjustments" content={practiceCase.adjustments || "No adjustments."} />
      </div>
    </section>
  );
}

function TextBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
      <p className="text-sm font-bold text-blue-950">{title}</p>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-sm leading-7 text-slate-900">
        {content}
      </pre>
    </div>
  );
}

function QuestionCard({
  practiceCase,
  grossResultType,
  grossAmount,
  netResultType,
  netAmount,
  adjustedCapital,
  assetTotal,
  liabilityTotal,
  balanceSheetAgrees,
  result,
  onGrossResultTypeChange,
  onGrossAmountChange,
  onNetResultTypeChange,
  onNetAmountChange,
  onAdjustedCapitalChange,
  onAssetTotalChange,
  onLiabilityTotalChange,
  onBalanceSheetAgreesChange,
  onCheck,
  onRetry,
  onTryAnother,
}: {
  practiceCase: FinalAccountsPracticeCase;
  grossResultType: FinalAccountsPracticeCase["expectedGrossResultType"];
  grossAmount: string;
  netResultType: FinalAccountsPracticeCase["expectedNetResultType"];
  netAmount: string;
  adjustedCapital: string;
  assetTotal: string;
  liabilityTotal: string;
  balanceSheetAgrees: FinalAccountsPracticeAgreeAnswer;
  result: FinalAccountsPracticeCheckResult | null;
  onGrossResultTypeChange: (value: FinalAccountsPracticeCase["expectedGrossResultType"]) => void;
  onGrossAmountChange: (value: string) => void;
  onNetResultTypeChange: (value: FinalAccountsPracticeCase["expectedNetResultType"]) => void;
  onNetAmountChange: (value: string) => void;
  onAdjustedCapitalChange: (value: string) => void;
  onAssetTotalChange: (value: string) => void;
  onLiabilityTotalChange: (value: string) => void;
  onBalanceSheetAgreesChange: (value: FinalAccountsPracticeAgreeAnswer) => void;
  onCheck: () => void;
  onRetry: () => void;
  onTryAnother: () => void;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Question</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Find the key final accounts results</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
        Do not prepare the full statements. Enter the summary values only.
      </p>

      <div className="mt-5 grid gap-4">
        <ResultTypeOptions
          label="Gross result type"
          name="gross-result-type"
          options={grossResultOptions}
          value={grossResultType}
          onChange={onGrossResultTypeChange}
        />
        <AmountInput label="Gross result amount" value={grossAmount} onChange={onGrossAmountChange} />

        <ResultTypeOptions
          label="Net result type"
          name="net-result-type"
          options={netResultOptions}
          value={netResultType}
          onChange={onNetResultTypeChange}
        />
        <AmountInput label="Net result amount" value={netAmount} onChange={onNetAmountChange} />

        <div className="grid gap-4 sm:grid-cols-3">
          <AmountInput label="Adjusted Capital" value={adjustedCapital} onChange={onAdjustedCapitalChange} />
          <AmountInput label="Total Assets" value={assetTotal} onChange={onAssetTotalChange} />
          <AmountInput label="Total Liabilities" value={liabilityTotal} onChange={onLiabilityTotalChange} />
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">Does Balance Sheet agree?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {agreeOptions.map((option) => (
              <SegmentedOption
                key={option.value}
                name="balance-sheet-agrees"
                label={option.label}
                checked={balanceSheetAgrees === option.value}
                onChange={() => onBalanceSheetAgreesChange(option.value)}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onCheck}
          className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800"
        >
          Check Final Accounts Summary
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
                transaction: formatCaseForHistory(practiceCase),
                studentEntry: [
                  `${formatResultLabel(grossResultType)}: Rs.${grossAmount || "0"}`,
                  `${formatResultLabel(netResultType)}: Rs.${netAmount || "0"}`,
                  `Adjusted Capital: Rs.${adjustedCapital || "0"}`,
                  `Total Assets: Rs.${assetTotal || "0"}`,
                  `Total Liabilities: Rs.${liabilityTotal || "0"}`,
                  `Balance Sheet agrees: ${balanceSheetAgrees === "yes" ? "Yes" : "No"}`,
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

function ResultTypeOptions<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-bold text-slate-800">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <SegmentedOption
            key={option.value}
            name={name}
            label={option.label}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function AmountInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: Rs.50,000"
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
      className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-center text-sm font-bold transition ${
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

function ResultSummary({ result }: { result: FinalAccountsPracticeCheckResult }) {
  if (result.isCorrect) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900">
        <p className="text-sm font-bold">Correct.</p>
        <p className="mt-1 text-sm font-semibold leading-6">Your Final Accounts summary is right.</p>
        <p className="mt-1 text-sm font-bold">Score: {result.score}/100</p>
      </div>
    );
  }

  const label = result.score >= 50 ? "Good attempt. Some values need correction." : "Needs correction.";

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950">
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6">Correct answer: {result.expectedAnswerText}</p>
      <p className="mt-1 text-sm font-bold">Score: {result.score}/100</p>
    </div>
  );
}

function ResultExplanation({
  practiceCase,
  result,
}: {
  practiceCase: FinalAccountsPracticeCase;
  result: FinalAccountsPracticeCheckResult;
}) {
  return (
    <section className="grid gap-5">
      <ResultSection title="Correct final accounts summary">
        <SummaryGrid practiceCase={practiceCase} />
      </ResultSection>

      <ResultSection title="Compact result sections">
        <div className="grid gap-4 lg:grid-cols-3">
          <MiniStatement
            title="Trading Account"
            debitLines={practiceCase.finalAccountsResult.tradingAccount.debitLines}
            creditLines={practiceCase.finalAccountsResult.tradingAccount.creditLines}
          />
          <MiniStatement
            title="Profit & Loss Account"
            debitLines={practiceCase.finalAccountsResult.profitAndLossAccount.debitLines}
            creditLines={practiceCase.finalAccountsResult.profitAndLossAccount.creditLines}
          />
          <BalanceSheetTotals practiceCase={practiceCase} />
        </div>
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

function SummaryGrid({ practiceCase }: { practiceCase: FinalAccountsPracticeCase }) {
  const items = [
    {
      label: formatResultLabel(practiceCase.expectedGrossResultType),
      value: practiceCase.expectedGrossResultAmount,
    },
    {
      label: formatResultLabel(practiceCase.expectedNetResultType),
      value: practiceCase.expectedNetResultAmount,
    },
    {
      label: "Adjusted Capital",
      value: practiceCase.expectedAdjustedCapitalAmount ?? 0,
    },
    { label: "Total Assets", value: practiceCase.expectedAssetTotal },
    { label: "Total Liabilities", value: practiceCase.expectedLiabilityTotal },
    {
      label: "Balance Sheet",
      text: practiceCase.expectedBalanceSheetAgrees ? "Agrees" : "Does not agree",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">{item.label}</p>
          <p className="mt-1 text-xl font-bold text-blue-950">
            {"text" in item ? item.text : `Rs.${item.value.toLocaleString("en-IN")}`}
          </p>
        </div>
      ))}
    </div>
  );
}

function MiniStatement({
  title,
  debitLines,
  creditLines,
}: {
  title: string;
  debitLines: FinalAccountLine[];
  creditLines: FinalAccountLine[];
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-bold text-blue-950">{title}</h3>
      <div className="mt-3 grid gap-3">
        <StatementColumn title="Debit" lines={debitLines} />
        <StatementColumn title="Credit" lines={creditLines} />
      </div>
    </article>
  );
}

function StatementColumn({ title, lines }: { title: string; lines: FinalAccountLine[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{title}</p>
      <div className="mt-2 grid gap-1">
        {lines.slice(0, 5).map((line) => (
          <p key={`${title}-${line.account}-${line.amount}`} className="text-sm leading-6 text-slate-700">
            {line.account}: Rs.{line.amount.toLocaleString("en-IN")}
          </p>
        ))}
        {lines.length > 5 ? <p className="text-xs font-semibold text-slate-500">More lines included in engine result.</p> : null}
      </div>
    </div>
  );
}

function BalanceSheetTotals({ practiceCase }: { practiceCase: FinalAccountsPracticeCase }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-bold text-blue-950">Balance Sheet totals</h3>
      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        <p>Adjusted Capital: Rs.{(practiceCase.expectedAdjustedCapitalAmount ?? 0).toLocaleString("en-IN")}</p>
        <p>Total Assets: Rs.{practiceCase.expectedAssetTotal.toLocaleString("en-IN")}</p>
        <p>Total Liabilities: Rs.{practiceCase.expectedLiabilityTotal.toLocaleString("en-IN")}</p>
        <p>{practiceCase.expectedBalanceSheetAgrees ? "Balance Sheet agrees." : "Balance Sheet does not agree."}</p>
      </div>
    </article>
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

function formatCaseForHistory(practiceCase: FinalAccountsPracticeCase): string {
  return [`Trial Balance:\n${practiceCase.trialBalance}`, `Adjustments:\n${practiceCase.adjustments || "None"}`].join(
    "\n\n",
  );
}
