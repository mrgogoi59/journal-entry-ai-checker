"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { PracticeItYourselfPreviewQuestion } from "@/lib/learning-platform/types";
import type {
  JournalEntryCorrectAnswerReveal,
  JournalEntryPracticeAttempt,
  JournalEntryPracticeCheckResult,
  JournalEntryPracticeFeedbackStatus,
} from "@/lib/learning-platform/checkers/types";
import { JOURNAL_ENTRY_PRACTICE_LIMITS } from "@/lib/learning-platform/checkers/types";

type EditorRow = {
  rowOrder: number;
  date: string;
  particulars: string;
  lf: string;
  debitAmount: string;
  creditAmount: string;
};

type GuidedEntryFieldsState = {
  debitAccount: string;
  creditAccount: string;
  amount: string;
};

type FeedbackDisplayMode = "beginner" | "detailed";

type JournalEntryPracticeEditorProps = {
  question: PracticeItYourselfPreviewQuestion;
  checkAnswerAction: (attempt: JournalEntryPracticeAttempt) => Promise<JournalEntryPracticeCheckResult>;
  revealCorrectAnswerAction: (questionId: string) => Promise<JournalEntryCorrectAnswerReveal>;
  inputMode?: "journal-table" | "guided-entry";
  supportNotice?: string;
};

const inputClass =
  "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

const statusStyles: Record<JournalEntryPracticeFeedbackStatus, string> = {
  correct: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

export function JournalEntryPracticeEditor({
  question,
  checkAnswerAction,
  inputMode = "journal-table",
  revealCorrectAnswerAction,
  supportNotice = "This preview checker supports this individual question only. No API route, storage, analytics, or existing checker is called.",
}: JournalEntryPracticeEditorProps) {
  const [rows, setRows] = useState<EditorRow[]>(() => createInitialRows(question));
  const [guidedEntry, setGuidedEntry] = useState<GuidedEntryFieldsState>(() => createBlankGuidedEntry());
  const [totalDebit, setTotalDebit] = useState("");
  const [totalCredit, setTotalCredit] = useState("");
  const [narration, setNarration] = useState("");
  const [result, setResult] = useState<JournalEntryPracticeCheckResult | null>(null);
  const [reveal, setReveal] = useState<JournalEntryCorrectAnswerReveal | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const fieldPrefix = question.id;
  const instructionId = `practice-editor-instructions-${fieldPrefix}`;
  const feedbackId = `practice-feedback-${fieldPrefix}`;
  const isGuidedInput = inputMode === "guided-entry";
  const canAddRow = rows.length < JOURNAL_ENTRY_PRACTICE_LIMITS.maxRows;
  const currentAttempt = isGuidedInput
    ? createGuidedAttempt(question.id, guidedEntry, narration)
    : createAttempt(question.id, rows, totalDebit, totalCredit, narration);
  const isCurrentAttemptBlank = isAttemptBlank(currentAttempt);

  useEffect(() => {
    if (result) {
      feedbackRef.current?.focus();
    }
  }, [result]);

  function updateRow(rowOrder: number, field: keyof EditorRow, value: string) {
    clearCheckedFeedback();
    setRows((currentRows) =>
      currentRows.map((row) => (row.rowOrder === rowOrder ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    if (!canAddRow) return;
    clearCheckedFeedback();
    setRows((currentRows) => {
      const nextRowOrder = Math.max(...currentRows.map((row) => row.rowOrder)) + 1;

      return [...currentRows, createBlankRow(nextRowOrder)];
    });
  }

  function removeRow(rowOrder: number) {
    clearCheckedFeedback();
    setRows((currentRows) =>
      currentRows.length <= 2 ? currentRows : currentRows.filter((row) => row.rowOrder !== rowOrder),
    );
  }

  function updateGuidedDebitAccount(value: string) {
    clearCheckedFeedback();
    setGuidedEntry((currentEntry) => ({ ...currentEntry, debitAccount: value }));
  }

  function updateGuidedCreditAccount(value: string) {
    clearCheckedFeedback();
    setGuidedEntry((currentEntry) => ({ ...currentEntry, creditAccount: value }));
  }

  function updateGuidedAmount(value: string) {
    clearCheckedFeedback();
    setGuidedEntry((currentEntry) => ({ ...currentEntry, amount: value }));
  }

  function clearCheckedFeedback() {
    setResult(null);
    setReveal(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isChecking) return;

    const attempt = isGuidedInput
      ? createGuidedAttempt(question.id, guidedEntry, narration)
      : createAttempt(question.id, rows, totalDebit, totalCredit, narration);

    if (isAttemptBlank(attempt)) {
      return;
    }

    setIsChecking(true);
    setReveal(null);

    try {
      const checkedResult = await checkAnswerAction(attempt);
      const guidedReveal =
        isGuidedInput && checkedResult.correctAnswerRevealAvailable
          ? await revealCorrectAnswerAction(question.id)
          : null;

      setResult(checkedResult);
      setReveal(guidedReveal);
      setAttemptCount((count) => count + 1);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleReveal() {
    if (attemptCount === 0 || isRevealing) return;

    setIsRevealing(true);

    try {
      setReveal(await revealCorrectAnswerAction(question.id));
    } finally {
      setIsRevealing(false);
    }
  }

  function handleTryAgain() {
    setReveal(null);
    feedbackRef.current?.focus();
  }

  function handleReset() {
    setRows(createInitialRows(question));
    setGuidedEntry(createBlankGuidedEntry());
    setTotalDebit("");
    setTotalCredit("");
    setNarration("");
    setResult(null);
    setReveal(null);
    setAttemptCount(0);
  }

  return (
    <>
      {isGuidedInput ? (
        <p id={instructionId} className="sr-only">
          Enter the debit account, credit account, amount, and narration before checking your answer.
        </p>
      ) : (
        <p id={instructionId} className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-950">
          Write the full particulars yourself. First decide the debit and credit, then type Dr. on the debit line and To on the credit line. Account naming, amounts, totals, and narration are checked.
        </p>
      )}
      <form
        className="mt-4 space-y-4"
        aria-label={`${question.title} journal entry checker`}
        aria-describedby={instructionId}
        aria-busy={isChecking}
        onSubmit={handleSubmit}
      >
      {isGuidedInput ? (
        <GuidedEntryFields
          amount={guidedEntry.amount}
          creditAccount={guidedEntry.creditAccount}
          debitAccount={guidedEntry.debitAccount}
          fieldPrefix={fieldPrefix}
          narration={narration}
          onAmountChange={updateGuidedAmount}
          onCreditAccountChange={updateGuidedCreditAccount}
          onDebitAccountChange={updateGuidedDebitAccount}
          onNarrationChange={(value) => {
            clearCheckedFeedback();
            setNarration(value);
          }}
        />
      ) : (
        <JournalTableFields
          canAddRow={canAddRow}
          fieldPrefix={fieldPrefix}
          narration={narration}
          onAddRow={addRow}
          onChangeNarration={(value) => {
            clearCheckedFeedback();
            setNarration(value);
          }}
          onChangeRow={updateRow}
          onChangeTotalCredit={(value) => {
            clearCheckedFeedback();
            setTotalCredit(value);
          }}
          onChangeTotalDebit={(value) => {
            clearCheckedFeedback();
            setTotalDebit(value);
          }}
          onRemoveRow={removeRow}
          question={question}
          rows={rows}
          totalCredit={totalCredit}
          totalDebit={totalDebit}
        />
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        {isGuidedInput ? null : (
          <p className="text-sm font-semibold leading-6 text-slate-600">
            {supportNotice}
          </p>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          Reset Answer
        </button>
        <button
          type="submit"
          disabled={isChecking || isCurrentAttemptBlank}
          aria-disabled={isChecking || isCurrentAttemptBlank}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChecking ? "Checking..." : "Check Answer"}
        </button>
      </div>

      <div
        ref={feedbackRef}
        id={feedbackId}
        tabIndex={-1}
        aria-live="polite"
        className="rounded-3xl border border-slate-200 bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:p-5"
      >
        {isChecking ? (
          <p role="status" className="text-sm font-semibold text-slate-600">Checking your answer...</p>
        ) : result ? (
          <FeedbackPanel
            result={result}
            reveal={reveal}
            canReveal={attemptCount > 0}
            isRevealing={isRevealing}
            mode={isGuidedInput ? "beginner" : "detailed"}
            showNextStepLinks={!isGuidedInput}
            onTryAgain={handleTryAgain}
            onReveal={handleReveal}
          />
        ) : (
          <p className="text-sm font-semibold leading-6 text-slate-600">
            Feedback will appear here after you check your answer.
          </p>
        )}
      </div>
      </form>
    </>
  );
}

function GuidedEntryFields({
  amount,
  creditAccount,
  debitAccount,
  fieldPrefix,
  narration,
  onAmountChange,
  onCreditAccountChange,
  onDebitAccountChange,
  onNarrationChange,
}: {
  amount: string;
  creditAccount: string;
  debitAccount: string;
  fieldPrefix: string;
  narration: string;
  onAmountChange: (value: string) => void;
  onCreditAccountChange: (value: string) => void;
  onDebitAccountChange: (value: string) => void;
  onNarrationChange: (value: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`practice-debit-account-${fieldPrefix}`} className="text-sm font-black text-slate-950">
            Debit account
          </label>
          <input
            id={`practice-debit-account-${fieldPrefix}`}
            name={`practice-debit-account-${fieldPrefix}`}
            placeholder="Example: Purchases A/c"
            value={debitAccount}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength}
            onChange={(event) => onDebitAccountChange(event.target.value)}
            className={`${inputClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`practice-credit-account-${fieldPrefix}`} className="text-sm font-black text-slate-950">
            Credit account
          </label>
          <input
            id={`practice-credit-account-${fieldPrefix}`}
            name={`practice-credit-account-${fieldPrefix}`}
            placeholder="Example: Cash A/c"
            value={creditAccount}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength}
            onChange={(event) => onCreditAccountChange(event.target.value)}
            className={`${inputClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor={`practice-amount-${fieldPrefix}`} className="text-sm font-black text-slate-950">
            Amount
          </label>
          <input
            id={`practice-amount-${fieldPrefix}`}
            name={`practice-amount-${fieldPrefix}`}
            inputMode="numeric"
            placeholder="Example: 10000"
            value={amount}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
            onChange={(event) => onAmountChange(event.target.value)}
            className={`${inputClass} mt-2`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`practice-narration-${fieldPrefix}`} className="text-sm font-black text-slate-950">
            Narration
          </label>
          <textarea
            id={`practice-narration-${fieldPrefix}`}
            name={`practice-narration-${fieldPrefix}`}
            rows={3}
            placeholder="Example: Being goods purchased for cash."
            value={narration}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxNarrationLength}
            onChange={(event) => onNarrationChange(event.target.value)}
            className={`${inputClass} mt-2 resize-y`}
          />
        </div>
      </div>
    </div>
  );
}

function JournalTableFields({
  canAddRow,
  fieldPrefix,
  narration,
  onAddRow,
  onChangeNarration,
  onChangeRow,
  onChangeTotalCredit,
  onChangeTotalDebit,
  onRemoveRow,
  question,
  rows,
  totalCredit,
  totalDebit,
}: {
  canAddRow: boolean;
  fieldPrefix: string;
  narration: string;
  onAddRow: () => void;
  onChangeNarration: (value: string) => void;
  onChangeRow: (rowOrder: number, field: keyof EditorRow, value: string) => void;
  onChangeTotalCredit: (value: string) => void;
  onChangeTotalDebit: (value: string) => void;
  onRemoveRow: (rowOrder: number) => void;
  question: PracticeItYourselfPreviewQuestion;
  rows: EditorRow[];
  totalCredit: string;
  totalDebit: string;
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
        <div className="grid grid-cols-[0.8fr_2.4fr_0.65fr_0.95fr_0.95fr_auto] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-600">
          <div>Date</div>
          <div>Particulars</div>
          <div>L.F.</div>
          <div>Debit ₹</div>
          <div>Credit ₹</div>
          <div>Row</div>
        </div>
        <div className="divide-y divide-slate-200">
          {rows.map((row) => (
            <PracticeDesktopRow
              key={row.rowOrder}
              row={row}
              fieldPrefix={fieldPrefix}
              canRemove={rows.length > 2}
              onChange={onChangeRow}
              onRemove={onRemoveRow}
            />
          ))}
        </div>
        <div className="grid grid-cols-[0.8fr_2.4fr_0.65fr_0.95fr_0.95fr_auto] gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <div />
          <div className="flex items-center text-sm font-black text-slate-950">Total</div>
          <div />
          <input
            id={`practice-total-debit-${fieldPrefix}`}
            name={`practice-total-debit-${fieldPrefix}`}
            inputMode="numeric"
            aria-label={`${question.title} Total Debit`}
            placeholder="Total Debit"
            value={totalDebit}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
            onChange={(event) => onChangeTotalDebit(event.target.value)}
            className={inputClass}
          />
          <input
            id={`practice-total-credit-${fieldPrefix}`}
            name={`practice-total-credit-${fieldPrefix}`}
            inputMode="numeric"
            aria-label={`${question.title} Total Credit`}
            placeholder="Total Credit"
            value={totalCredit}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
            onChange={(event) => onChangeTotalCredit(event.target.value)}
            className={inputClass}
          />
          <div />
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {rows.map((row) => (
          <PracticeMobileRow
            key={row.rowOrder}
            row={row}
            fieldPrefix={fieldPrefix}
            canRemove={rows.length > 2}
            onChange={onChangeRow}
            onRemove={onRemoveRow}
          />
        ))}
        <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-1 text-sm font-black text-slate-950">Totals</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-total-debit-${fieldPrefix}`}>
                Total Debit ₹
              </label>
              <input
                id={`practice-mobile-total-debit-${fieldPrefix}`}
                name={`practice-mobile-total-debit-${fieldPrefix}`}
                inputMode="numeric"
                placeholder="Total Debit"
                value={totalDebit}
                maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
                onChange={(event) => onChangeTotalDebit(event.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-total-credit-${fieldPrefix}`}>
                Total Credit ₹
              </label>
              <input
                id={`practice-mobile-total-credit-${fieldPrefix}`}
                name={`practice-mobile-total-credit-${fieldPrefix}`}
                inputMode="numeric"
                placeholder="Total Credit"
                value={totalCredit}
                maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
                onChange={(event) => onChangeTotalCredit(event.target.value)}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAddRow}
          disabled={!canAddRow}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {canAddRow ? "Add row" : "Maximum 6 rows"}
        </button>
      </div>

      <div>
        <label htmlFor={`practice-narration-${fieldPrefix}`} className="text-sm font-black text-slate-950">
          Narration
        </label>
        <textarea
          id={`practice-narration-${fieldPrefix}`}
          name={`practice-narration-${fieldPrefix}`}
          rows={3}
          placeholder={question.answerInputSchema.narration.placeholder}
          value={narration}
          maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxNarrationLength}
          onChange={(event) => onChangeNarration(event.target.value)}
          className={`${inputClass} mt-2 resize-y`}
        />
      </div>
    </>
  );
}

function PracticeDesktopRow({
  row,
  fieldPrefix,
  canRemove,
  onChange,
  onRemove,
}: {
  row: EditorRow;
  fieldPrefix: string;
  canRemove: boolean;
  onChange: (rowOrder: number, field: keyof EditorRow, value: string) => void;
  onRemove: (rowOrder: number) => void;
}) {
  return (
    <div className="grid grid-cols-[0.8fr_2.4fr_0.65fr_0.95fr_0.95fr_auto] gap-3 px-4 py-3">
      <label className="sr-only" htmlFor={`practice-date-${fieldPrefix}-${row.rowOrder}`}>
        Row {row.rowOrder} date
      </label>
      <input
        id={`practice-date-${fieldPrefix}-${row.rowOrder}`}
        name={`practice-date-${fieldPrefix}-${row.rowOrder}`}
        placeholder="Date"
        value={row.date}
        maxLength={20}
        onChange={(event) => onChange(row.rowOrder, "date", event.target.value)}
        className={inputClass}
      />
      <label className="sr-only" htmlFor={`practice-particulars-${fieldPrefix}-${row.rowOrder}`}>
        Row {row.rowOrder} particulars
      </label>
      <input
        id={`practice-particulars-${fieldPrefix}-${row.rowOrder}`}
        name={`practice-particulars-${fieldPrefix}-${row.rowOrder}`}
        placeholder={`Particulars line ${row.rowOrder}`}
        value={row.particulars}
        maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength}
        onChange={(event) => onChange(row.rowOrder, "particulars", event.target.value)}
        className={inputClass}
      />
      <label className="sr-only" htmlFor={`practice-lf-${fieldPrefix}-${row.rowOrder}`}>
        Row {row.rowOrder} ledger folio
      </label>
      <input
        id={`practice-lf-${fieldPrefix}-${row.rowOrder}`}
        name={`practice-lf-${fieldPrefix}-${row.rowOrder}`}
        placeholder="L.F."
        value={row.lf}
        maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxLfLength}
        onChange={(event) => onChange(row.rowOrder, "lf", event.target.value)}
        className={inputClass}
      />
      <label className="sr-only" htmlFor={`practice-debit-${fieldPrefix}-${row.rowOrder}`}>
        Row {row.rowOrder} debit amount
      </label>
      <input
        id={`practice-debit-${fieldPrefix}-${row.rowOrder}`}
        name={`practice-debit-${fieldPrefix}-${row.rowOrder}`}
        inputMode="numeric"
        placeholder="Debit"
        value={row.debitAmount}
        maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
        onChange={(event) => onChange(row.rowOrder, "debitAmount", event.target.value)}
        className={inputClass}
      />
      <label className="sr-only" htmlFor={`practice-credit-${fieldPrefix}-${row.rowOrder}`}>
        Row {row.rowOrder} credit amount
      </label>
      <input
        id={`practice-credit-${fieldPrefix}-${row.rowOrder}`}
        name={`practice-credit-${fieldPrefix}-${row.rowOrder}`}
        inputMode="numeric"
        placeholder="Credit"
        value={row.creditAmount}
        maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
        onChange={(event) => onChange(row.rowOrder, "creditAmount", event.target.value)}
        className={inputClass}
      />
      <button
        type="button"
        disabled={!canRemove}
        aria-label={`Remove entry row ${row.rowOrder}`}
        onClick={() => onRemove(row.rowOrder)}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-3 text-xs font-black text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
}

function PracticeMobileRow({
  row,
  fieldPrefix,
  canRemove,
  onChange,
  onRemove,
}: {
  row: EditorRow;
  fieldPrefix: string;
  canRemove: boolean;
  onChange: (rowOrder: number, field: keyof EditorRow, value: string) => void;
  onRemove: (rowOrder: number) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <legend className="px-1 text-sm font-black text-slate-950">Entry row {row.rowOrder}</legend>
      <div className="mt-3 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-date-${fieldPrefix}-${row.rowOrder}`}>
              Date
            </label>
            <input
              id={`practice-mobile-date-${fieldPrefix}-${row.rowOrder}`}
              name={`practice-mobile-date-${fieldPrefix}-${row.rowOrder}`}
              placeholder="Date"
              value={row.date}
              maxLength={20}
              onChange={(event) => onChange(row.rowOrder, "date", event.target.value)}
              className={`${inputClass} mt-2`}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-lf-${fieldPrefix}-${row.rowOrder}`}>
              L.F.
            </label>
            <input
              id={`practice-mobile-lf-${fieldPrefix}-${row.rowOrder}`}
              name={`practice-mobile-lf-${fieldPrefix}-${row.rowOrder}`}
              placeholder="L.F."
              value={row.lf}
              maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxLfLength}
              onChange={(event) => onChange(row.rowOrder, "lf", event.target.value)}
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-particulars-${fieldPrefix}-${row.rowOrder}`}>
            Particulars
          </label>
          <input
            id={`practice-mobile-particulars-${fieldPrefix}-${row.rowOrder}`}
            name={`practice-mobile-particulars-${fieldPrefix}-${row.rowOrder}`}
            placeholder={`Particulars line ${row.rowOrder}`}
            value={row.particulars}
            maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxParticularsLength}
            onChange={(event) => onChange(row.rowOrder, "particulars", event.target.value)}
            className={`${inputClass} mt-2`}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-debit-${fieldPrefix}-${row.rowOrder}`}>
              Debit ₹
            </label>
            <input
              id={`practice-mobile-debit-${fieldPrefix}-${row.rowOrder}`}
              name={`practice-mobile-debit-${fieldPrefix}-${row.rowOrder}`}
              inputMode="numeric"
              placeholder="Debit"
              value={row.debitAmount}
              maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
              onChange={(event) => onChange(row.rowOrder, "debitAmount", event.target.value)}
              className={`${inputClass} mt-2`}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700" htmlFor={`practice-mobile-credit-${fieldPrefix}-${row.rowOrder}`}>
              Credit ₹
            </label>
            <input
              id={`practice-mobile-credit-${fieldPrefix}-${row.rowOrder}`}
              name={`practice-mobile-credit-${fieldPrefix}-${row.rowOrder}`}
              inputMode="numeric"
              placeholder="Credit"
              value={row.creditAmount}
              maxLength={JOURNAL_ENTRY_PRACTICE_LIMITS.maxAmountLength}
              onChange={(event) => onChange(row.rowOrder, "creditAmount", event.target.value)}
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={!canRemove}
          aria-label={`Remove entry row ${row.rowOrder}`}
          onClick={() => onRemove(row.rowOrder)}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remove row
        </button>
      </div>
    </fieldset>
  );
}

function FeedbackPanel({
  result,
  reveal,
  canReveal,
  isRevealing,
  mode,
  showNextStepLinks,
  onTryAgain,
  onReveal,
}: {
  result: JournalEntryPracticeCheckResult;
  reveal: JournalEntryCorrectAnswerReveal | null;
  canReveal: boolean;
  isRevealing: boolean;
  mode: FeedbackDisplayMode;
  showNextStepLinks: boolean;
  onTryAgain: () => void;
  onReveal: () => void;
}) {
  if (mode === "beginner") {
    return <BeginnerFeedbackPanel result={result} reveal={reveal} onTryAgain={onTryAgain} />;
  }

  const summaryStyle =
    result.status === "correct"
      ? statusStyles.correct
      : result.status === "partially-correct"
        ? statusStyles.warning
        : statusStyles.error;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${summaryStyle}`}>
        <p className="text-xs font-black uppercase tracking-wide">Overall result</p>
        <h3 className="mt-1 text-lg font-black">{result.summary}</h3>
      </div>
      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
        Read the feedback in this order: accounts, debit/credit side, amount, totals, and narration.
      </p>

      <FeedbackList title="What you got right" items={result.gotRight} emptyText="Nothing confirmed yet." />
      <FeedbackList title="Specific errors" items={result.errors} emptyText="No hard errors." />
      <FeedbackList title="Warnings" items={result.warnings} emptyText="No presentation warnings." />

      <div className="grid gap-3 lg:grid-cols-3">
        <FeedbackStatusCard title="Totals" status={result.totalsResult.status} messages={result.totalsResult.messages} />
        <FeedbackStatusCard title="Narration" status={result.narrationResult.status} messages={[result.narrationResult.message]} />
        <FeedbackStatusCard title="Balance" status={result.balanceResult.status} messages={[result.balanceResult.message]} />
      </div>

      <div>
        <h4 className="text-sm font-black text-slate-950">Row-level feedback</h4>
        <div className="mt-3 grid gap-3">
          {result.rowResults.length > 0 ? (
            result.rowResults.map((rowResult) => (
              <div key={rowResult.rowOrder} className={`rounded-2xl border p-4 ${statusStyles[rowResult.status]}`}>
                <p className="text-sm font-black">Row {rowResult.rowOrder}: {rowResult.summary}</p>
                {rowResult.fieldResults.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm font-semibold">
                    {rowResult.fieldResults.map((fieldResult) => (
                      <li key={`${rowResult.rowOrder}-${fieldResult.field}-${fieldResult.message}`}>
                        {fieldResult.message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
              No row feedback yet.
            </p>
          )}
        </div>
      </div>

      <FeedbackList title="Hints" items={result.hints} emptyText="No hints needed." />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onTryAgain}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Try Again
        </button>
        <button
          type="button"
          disabled={!canReveal || isRevealing || !result.correctAnswerRevealAvailable}
          onClick={onReveal}
          aria-disabled={!canReveal || isRevealing || !result.correctAnswerRevealAvailable}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRevealing ? "Loading answer..." : "Show Correct Answer"}
        </button>
      </div>

      {reveal?.available ? <CorrectAnswerReveal reveal={reveal} /> : null}
      <FeedbackNextStep showLinks={showNextStepLinks} status={result.status} />
    </div>
  );
}

function BeginnerFeedbackPanel({
  result,
  reveal,
  onTryAgain,
}: {
  result: JournalEntryPracticeCheckResult;
  reveal: JournalEntryCorrectAnswerReveal | null;
  onTryAgain: () => void;
}) {
  const correctionItems = getBeginnerCorrectionItems(result);
  const whyItems = getBeginnerWhyItems(result);
  const isCorrectForBeginner = result.errors.length === 0 && correctionItems.length === 0;
  const heading = isCorrectForBeginner ? "Correct" : result.errors.length > 0 ? "Needs correction" : "Almost correct";
  const summary = isCorrectForBeginner
    ? "Your journal entry is right."
    : "Review these parts and try again.";
  const summaryStyle = isCorrectForBeginner
    ? statusStyles.correct
    : result.errors.length > 0
      ? statusStyles.error
      : statusStyles.warning;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${summaryStyle}`}>
        <h3 className="text-lg font-black">{heading}</h3>
        <p className="mt-1 text-sm font-semibold leading-6">{summary}</p>
      </div>

      {correctionItems.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <h4 className="text-sm font-black">Check these parts</h4>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-6">
            {correctionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {reveal?.available ? <CorrectAnswerReveal reveal={reveal} title="Correct entry" /> : null}

      {whyItems.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-black text-slate-950">Why?</h4>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-slate-700">
            {whyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onTryAgain}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
}

function FeedbackNextStep({
  showLinks,
  status,
}: {
  showLinks: boolean;
  status: JournalEntryPracticeCheckResult["status"];
}) {
  const message = status === "correct"
    ? "If your answer is correct, continue learning or try the next question."
    : "If you are stuck, reread the rule and then try this same checker again.";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-black text-slate-950">Next step</h4>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{message}</p>
      {showLinks ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a
          href="/journal-entry-solver"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-200 px-4 text-sm font-black text-cyan-900 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Use Explainer if stuck
        </a>
        <a
          href="/practice/journal-entries"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          Revise in Practice
        </a>
        </div>
      ) : null}
    </div>
  );
}

function FeedbackList({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  return (
    <div>
      <h4 className="text-sm font-black text-slate-950">{title}</h4>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-2 text-sm font-semibold leading-6 text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

function FeedbackStatusCard({
  title,
  status,
  messages,
}: {
  title: string;
  status: JournalEntryPracticeFeedbackStatus;
  messages: string[];
}) {
  return (
    <div className={`rounded-2xl border p-4 ${statusStyles[status]}`}>
      <h4 className="text-sm font-black">{title}</h4>
      <ul className="mt-2 space-y-1 text-sm font-semibold leading-6">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

function CorrectAnswerReveal({
  reveal,
  title = "Correct Answer",
}: {
  reveal: JournalEntryCorrectAnswerReveal;
  title?: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
      <h4 className="font-black">{title}</h4>
      <div className="mt-3 grid gap-2">
        {reveal.lines.map((line) => (
          <div key={line.id} className="grid gap-2 rounded-xl bg-white/70 p-3 sm:grid-cols-[1fr_auto_auto]">
            <span className="font-bold">{line.particulars}</span>
            <span className="font-black">{line.debitAmount ?? ""}</span>
            <span className="font-black">{line.creditAmount ?? ""}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-semibold">{reveal.narration}</p>
    </div>
  );
}

function createInitialRows(question: PracticeItYourselfPreviewQuestion): EditorRow[] {
  return question.answerInputSchema.rows.slice(0, question.initialBlankRows).map((row) => createBlankRow(row.rowOrder));
}

function createBlankRow(rowOrder: number): EditorRow {
  return {
    rowOrder,
    date: "",
    particulars: "",
    lf: "",
    debitAmount: "",
    creditAmount: "",
  };
}

function createBlankGuidedEntry(): GuidedEntryFieldsState {
  return {
    debitAccount: "",
    creditAccount: "",
    amount: "",
  };
}

function getBeginnerCorrectionItems(result: JournalEntryPracticeCheckResult) {
  const corrections = new Set<string>();

  for (const rowResult of result.rowResults) {
    for (const fieldResult of rowResult.fieldResults) {
      if (fieldResult.status === "correct" || isLedgerFolioPresentationMessage(fieldResult.message)) {
        continue;
      }

      if (fieldResult.field === "particulars") {
        corrections.add(rowResult.rowOrder === 1 ? "Debit account needs correction." : "Credit account needs correction.");
      }

      if (fieldResult.field === "debitAmount" || fieldResult.field === "creditAmount") {
        corrections.add("Amount needs correction.");
      }
    }
  }

  if (result.totalsResult.status === "error" || result.balanceResult.status === "error") {
    corrections.add("Amount needs correction.");
  }

  if (result.narrationResult.status !== "correct") {
    corrections.add("Narration needs improvement.");
  }

  for (const error of result.errors) {
    if (isLedgerFolioPresentationMessage(error)) {
      continue;
    }

    if (corrections.size === 0) {
      corrections.add(simplifyBeginnerMessage(error));
    }
  }

  for (const warning of result.warnings) {
    if (isLedgerFolioPresentationMessage(warning)) {
      continue;
    }

    if (warning.toLowerCase().includes("narration")) {
      corrections.add("Narration needs improvement.");
    }
  }

  return Array.from(corrections);
}

function getBeginnerWhyItems(result: JournalEntryPracticeCheckResult) {
  const items = new Set<string>();

  result.gotRight
    .filter((message) => !isLedgerFolioPresentationMessage(message))
    .forEach((message) => {
      if (message === "Debit and credit totals are balanced.") {
        items.add("Amount is correct.");
      } else if (message.toLowerCase().includes("narration")) {
        items.add("Narration is acceptable.");
      } else {
        items.add(simplifyBeginnerMessage(message));
      }
    });

  if (result.totalsResult.status === "correct" && result.balanceResult.status === "correct") {
    items.add("Amount is correct.");
  }

  result.hints
    .filter((message) => !isLedgerFolioPresentationMessage(message))
    .forEach((message) => items.add(simplifyBeginnerMessage(message)));

  return Array.from(items);
}

function isLedgerFolioPresentationMessage(message: string) {
  return /L\.F\./i.test(message) || /formal journal work/i.test(message);
}

function simplifyBeginnerMessage(message: string) {
  return message.replace(/^Row \d+:\s*/i, "").replace(/^Row \d+\s+/i, "");
}

function formatDebitParticulars(value: string) {
  const account = normalizeGuidedAccount(value);
  return account ? `${account} Dr.` : "";
}

function formatCreditParticulars(value: string) {
  const account = normalizeGuidedAccount(value).replace(/^\s*to\b\s*/i, "").trim();
  return account ? `To ${account}` : "";
}

function normalizeGuidedAccount(value: string) {
  return value.replace(/\s+dr\.?\s*$/i, "").trim();
}

function createGuidedAttempt(
  questionId: string,
  guidedEntry: GuidedEntryFieldsState,
  narration: string,
): JournalEntryPracticeAttempt {
  return {
    questionId,
    rows: [
      {
        rowOrder: 1,
        particulars: formatDebitParticulars(guidedEntry.debitAccount),
        lf: "",
        debitAmount: guidedEntry.amount,
        creditAmount: "",
      },
      {
        rowOrder: 2,
        particulars: formatCreditParticulars(guidedEntry.creditAccount),
        lf: "",
        debitAmount: "",
        creditAmount: guidedEntry.amount,
      },
    ],
    totalDebit: guidedEntry.amount,
    totalCredit: guidedEntry.amount,
    narration,
  };
}

function createAttempt(
  questionId: string,
  rows: EditorRow[],
  totalDebit: string,
  totalCredit: string,
  narration: string,
): JournalEntryPracticeAttempt {
  return {
    questionId,
    rows: rows.map((row) => ({
      rowOrder: row.rowOrder,
      particulars: row.particulars,
      lf: row.lf,
      debitAmount: row.debitAmount,
      creditAmount: row.creditAmount,
    })),
    totalDebit,
    totalCredit,
    narration,
  };
}

function isAttemptBlank(attempt: JournalEntryPracticeAttempt) {
  return (
    attempt.rows.every((row) =>
      [row.particulars, row.lf, row.debitAmount, row.creditAmount].every((value) => value.trim() === ""),
    ) &&
    attempt.totalDebit.trim() === "" &&
    attempt.totalCredit.trim() === "" &&
    attempt.narration.trim() === ""
  );
}
