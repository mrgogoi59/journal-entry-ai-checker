"use client";

import Link from "next/link";
import { useState } from "react";
import {
  bankReconciliationAdjustmentDefinitions,
  calculateBankReconciliation,
  formatCurrency,
  getBalanceLabel,
  getSourceLabel,
  type BankBalanceType,
  type BankReconciliationAdjustmentType,
  type BankReconciliationResult,
  type BankReconciliationSource,
} from "@/lib/bank-reconciliation-engine";

type AdjustmentRow = {
  id: string;
  type: BankReconciliationAdjustmentType;
  amount: string;
  note: string;
};

const defaultRows: AdjustmentRow[] = [
  {
    id: "adjustment-1",
    type: "cheque_issued_not_presented",
    amount: "10000",
    note: "",
  },
  {
    id: "adjustment-2",
    type: "cheque_deposited_not_credited",
    amount: "8000",
    note: "",
  },
];

const commonMistakes = [
  "Do not confuse Cash Book balance with Bank Statement balance.",
  "Cheques issued but not presented are added when starting from Cash Book.",
  "Cheques deposited but not credited are subtracted when starting from Cash Book.",
  "Bank charges reduce bank balance if not recorded in Cash Book.",
  "Overdraft means negative balance.",
];

export default function BankReconciliationPage() {
  const [startingSource, setStartingSource] = useState<BankReconciliationSource>("cash_book");
  const [startingBalanceType, setStartingBalanceType] = useState<BankBalanceType>("favourable");
  const [startingBalanceAmount, setStartingBalanceAmount] = useState("50000");
  const [adjustmentRows, setAdjustmentRows] = useState<AdjustmentRow[]>(defaultRows);
  const [nextRowNumber, setNextRowNumber] = useState(3);
  const [result, setResult] = useState<BankReconciliationResult | null>(() =>
    calculateBankReconciliation({
      startingSource: "cash_book",
      startingBalanceType: "favourable",
      startingBalanceAmount: "50000",
      adjustments: defaultRows,
    }),
  );

  function calculate() {
    setResult(
      calculateBankReconciliation({
        startingSource,
        startingBalanceType,
        startingBalanceAmount,
        adjustments: adjustmentRows.map((row) => {
          const definition = bankReconciliationAdjustmentDefinitions.find((item) => item.type === row.type);

          return {
            id: row.id,
            type: row.type,
            label: definition?.label,
            amount: row.amount,
            note: row.note,
          };
        }),
      }),
    );
  }

  function markDirty() {
    setResult(null);
  }

  function addAdjustment() {
    setAdjustmentRows((rows) => [
      ...rows,
      {
        id: `adjustment-${nextRowNumber}`,
        type: "cheque_issued_not_presented",
        amount: "",
        note: "",
      },
    ]);
    setNextRowNumber((value) => value + 1);
    markDirty();
  }

  function updateAdjustment(id: string, updates: Partial<AdjustmentRow>) {
    setAdjustmentRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...updates } : row)));
    markDirty();
  }

  function removeAdjustment(id: string) {
    setAdjustmentRows((rows) => rows.filter((row) => row.id !== id));
    markDirty();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 pb-24 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section className="grid min-w-0 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid min-w-0 gap-5">
            <StartingBalanceCard
              startingSource={startingSource}
              startingBalanceType={startingBalanceType}
              startingBalanceAmount={startingBalanceAmount}
              onStartingSourceChange={(value) => {
                setStartingSource(value);
                markDirty();
              }}
              onStartingBalanceTypeChange={(value) => {
                setStartingBalanceType(value);
                markDirty();
              }}
              onStartingBalanceAmountChange={(value) => {
                setStartingBalanceAmount(value);
                markDirty();
              }}
            />

            <AdjustmentsCard
              rows={adjustmentRows}
              onAddAdjustment={addAdjustment}
              onUpdateAdjustment={updateAdjustment}
              onRemoveAdjustment={removeAdjustment}
            />

            <button
              type="button"
              onClick={calculate}
              className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800"
            >
              Calculate BRS
            </button>
          </div>

          <div className="grid min-w-0 gap-5">
            {result ? <ResultCard result={result} startingSource={startingSource} /> : <EmptyResultCard />}
            {result ? <WorkingNotesTable result={result} /> : null}
          </div>
        </section>

        {result ? <SimpleExplanationCard result={result} startingSource={startingSource} /> : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <CommonMistakesCard />
          <LearningLinksCard />
        </section>
      </section>
    </main>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <nav className="hidden flex-wrap items-center gap-3 text-sm font-semibold sm:flex">
        <Link href="/" className="text-blue-800 transition hover:text-blue-950">
          Back to Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Learning Tools
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/learn/bank-reconciliation-statement" className="text-blue-800 transition hover:text-blue-950">
          Learn BRS
        </Link>
      </nav>
      <nav className="flex items-center justify-between gap-3 text-sm font-semibold sm:hidden">
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Tools
        </Link>
        <Link href="/learn/bank-reconciliation-statement" className="text-blue-800 transition hover:text-blue-950">
          Learn BRS
        </Link>
      </nav>

      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Bank reconciliation</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
          Bank Reconciliation Statement
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Calculate the balance as per Cash Book or Bank Statement step by step.
        </p>
      </div>
    </header>
  );
}

function StartingBalanceCard({
  startingSource,
  startingBalanceType,
  startingBalanceAmount,
  onStartingSourceChange,
  onStartingBalanceTypeChange,
  onStartingBalanceAmountChange,
}: {
  startingSource: BankReconciliationSource;
  startingBalanceType: BankBalanceType;
  startingBalanceAmount: string;
  onStartingSourceChange: (value: BankReconciliationSource) => void;
  onStartingBalanceTypeChange: (value: BankBalanceType) => void;
  onStartingBalanceAmountChange: (value: string) => void;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Starting balance</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Choose where to start</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Favourable means positive bank balance. Overdraft means bank balance is negative.
      </p>

      <div className="mt-5 grid gap-4">
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">Starting from</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <SegmentButton
              selected={startingSource === "cash_book"}
              label="Cash Book"
              onClick={() => onStartingSourceChange("cash_book")}
            />
            <SegmentButton
              selected={startingSource === "bank_statement"}
              label="Bank Statement / Pass Book"
              onClick={() => onStartingSourceChange("bank_statement")}
            />
          </div>
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold text-slate-800">Balance type</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <SegmentButton
              selected={startingBalanceType === "favourable"}
              label="Favourable balance"
              onClick={() => onStartingBalanceTypeChange("favourable")}
            />
            <SegmentButton
              selected={startingBalanceType === "overdraft"}
              label="Overdraft"
              onClick={() => onStartingBalanceTypeChange("overdraft")}
            />
          </div>
        </fieldset>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-800">Amount</span>
          <input
            value={startingBalanceAmount}
            onChange={(event) => onStartingBalanceAmountChange(event.target.value)}
            inputMode="decimal"
            className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="50000"
          />
        </label>
      </div>
    </section>
  );
}

function SegmentButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border px-4 py-2 text-left text-sm font-bold transition ${
        selected
          ? "border-blue-900 bg-blue-900 text-white shadow-soft"
          : "border-slate-200 bg-white text-blue-900 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      {label}
    </button>
  );
}

function AdjustmentsCard({
  rows,
  onAddAdjustment,
  onUpdateAdjustment,
  onRemoveAdjustment,
}: {
  rows: AdjustmentRow[];
  onAddAdjustment: () => void;
  onUpdateAdjustment: (id: string, updates: Partial<AdjustmentRow>) => void;
  onRemoveAdjustment: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Adjustments</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Add reconciliation items</h2>
        </div>
        <button
          type="button"
          onClick={onAddAdjustment}
          className="min-h-10 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-white"
        >
          Add Adjustment
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-600">
            No adjustments added. You can still calculate using only the starting balance.
          </div>
        ) : null}

        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-normal text-slate-500">Adjustment type</span>
                <select
                  value={row.type}
                  onChange={(event) =>
                    onUpdateAdjustment(row.id, { type: event.target.value as BankReconciliationAdjustmentType })
                  }
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  {bankReconciliationAdjustmentDefinitions.map((definition) => (
                    <option key={definition.type} value={definition.type}>
                      {definition.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-[0.55fr_1fr_auto] sm:items-end">
                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-normal text-slate-500">Amount</span>
                  <input
                    value={row.amount}
                    onChange={(event) => onUpdateAdjustment(row.id, { amount: event.target.value })}
                    inputMode="decimal"
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Amount"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    Note or description
                  </span>
                  <input
                    value={row.note}
                    onChange={(event) => onUpdateAdjustment(row.id, { note: event.target.value })}
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Optional"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onRemoveAdjustment(row.id)}
                  className="min-h-11 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultCard({
  result,
  startingSource,
}: {
  result: BankReconciliationResult;
  startingSource: BankReconciliationSource;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Result</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">{getSourceLabel(result.targetSource)}</h2>
      <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4">
        <p className="text-sm font-semibold text-slate-600">Final balance</p>
        <p className="mt-2 text-3xl font-bold text-blue-950">
          {formatCurrency(result.finalBalanceAmount)}{" "}
          <span className="text-xl text-emerald-700">{getBalanceLabel(result.finalBalanceType).toLowerCase()}</span>
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Started from {getSourceLabel(startingSource).replace("Balance as per ", "")} and calculated{" "}
          {getSourceLabel(result.targetSource).replace("Balance as per ", "")}.
        </p>
      </div>

      {result.warnings.length > 0 ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <p className="font-bold">Please check:</p>
          <ul className="mt-2 grid gap-1">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function EmptyResultCard() {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Result</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Ready to calculate</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Add your starting balance and adjustment amounts, then calculate the Bank Reconciliation Statement.
      </p>
    </section>
  );
}

function WorkingNotesTable({ result }: { result: BankReconciliationResult }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Working notes</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Step-by-step calculation</h2>

      <div className="mt-5 max-w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Item</th>
              <th className="px-4 py-3 font-bold">Add/Subtract</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Running balance</th>
              <th className="px-4 py-3 font-bold">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {result.workingRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-slate-600">
                  No adjustment rows were applied.
                </td>
              </tr>
            ) : (
              result.workingRows.map((row) => (
                <tr key={`${row.id}-${row.type}-${row.amount}`}>
                  <td className="px-4 py-3 font-semibold text-blue-950">{row.label}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        row.operation === "add"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {row.operation === "add" ? "Add" : "Subtract"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(row.amount)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {formatCurrency(Math.abs(row.runningBalance))}{" "}
                    {getBalanceLabel(row.runningBalance >= 0 ? "favourable" : "overdraft").toLowerCase()}
                  </td>
                  <td className="px-4 py-3 leading-6 text-slate-600">{row.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SimpleExplanationCard({
  result,
  startingSource,
}: {
  result: BankReconciliationResult;
  startingSource: BankReconciliationSource;
}) {
  const additions = result.workingRows.filter((row) => row.operation === "add");
  const subtractions = result.workingRows.filter((row) => row.operation === "subtract");

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Simple explanation</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Why this is the answer</h2>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
        <p>
          We started with {getSourceLabel(startingSource).replace("Balance as per ", "")}{" "}
          {formatCurrency(Math.abs(result.startingSignedBalance))}{" "}
          {getBalanceLabel(result.startingSignedBalance >= 0 ? "favourable" : "overdraft").toLowerCase()}.
        </p>
        {additions.length > 0 ? <p>Added items increase the balance in this direction of reconciliation.</p> : null}
        {subtractions.length > 0 ? (
          <p>Subtracted items reduce the balance in this direction of reconciliation.</p>
        ) : null}
        <p className="font-semibold text-blue-950">{result.summaryText}</p>
      </div>
    </section>
  );
}

function CommonMistakesCard() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-amber-700">Common mistakes</p>
      <h2 className="mt-2 text-2xl font-bold text-amber-950">Check these before final answer</h2>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-amber-950">
        {commonMistakes.map((mistake) => (
          <li key={mistake} className="rounded-xl bg-white/80 px-3 py-2">
            {mistake}
          </li>
        ))}
      </ul>
    </section>
  );
}

function LearningLinksCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Learning links</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-950">Continue learning</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <LearningLink href="/learn/bank-reconciliation-statement" label="Learn BRS" />
        <LearningLink href="/practice" label="Practice Journal Entries" />
        <LearningLink href="/tools" label="Open Tools" />
      </div>
    </section>
  );
}

function LearningLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-bold text-blue-900 transition hover:bg-white"
    >
      {label}
    </Link>
  );
}
