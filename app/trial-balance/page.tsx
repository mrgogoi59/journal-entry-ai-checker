"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { type LedgerAccount, type LedgerJournalLine } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult, type TrialBalanceRow } from "@/lib/trial-balance-engine";

const sampleEntries = `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`;

const limitations = [
  "No dates",
  "No opening balances",
  "No adjustment handling outside journal-entry form",
  "No Final Accounts",
  "No database/history",
  "No AI",
];

export default function TrialBalancePage() {
  const [journalEntries, setJournalEntries] = useState("");
  const [result, setResult] = useState<TrialBalanceResult | null>(null);

  function prepareTrialBalance() {
    setResult(generateTrialBalance(journalEntries));
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[980px] flex-col gap-4 sm:gap-5">
        <header>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-blue-700">
            Back to checker
          </Link>
          <p className="mt-4 text-sm font-semibold text-accent">Trial Balance Engine MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Trial Balance</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Enter journal entries and prepare a trial balance from ledger balances.
          </p>
          <p className="mt-2 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft">
            Trial Balance lists debit and credit balances from ledger accounts to check arithmetic accuracy.
          </p>
        </header>

        <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Journal Entries</span>
              <textarea
                value={journalEntries}
                onChange={(event) => {
                  setJournalEntries(event.target.value);
                  setResult(null);
                }}
                placeholder={sampleEntries}
                className="min-h-64 resize-y rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <p className="rounded-md bg-paper px-3 py-2 text-sm leading-6 text-slate-600">
              Enter one journal entry per block. The app will create ledger balances and prepare the trial balance.
            </p>
            <button
              type="button"
              onClick={prepareTrialBalance}
              className="min-h-12 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Prepare Trial Balance
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
          <h2 className="text-base font-bold text-ink">Known limitations</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-2">
            {limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </section>

        {result ? <TrialBalanceResultView result={result} input={journalEntries} /> : null}
      </section>
    </main>
  );
}

function TrialBalanceResultView({ result, input }: { result: TrialBalanceResult; input: string }) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft sm:p-6">
        <h2 className="text-lg font-bold">I could not prepare the Trial Balance yet.</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6">
          {result.errors.map((error, index) => (
            <p key={`trial-balance-error-${error}-${index}`} className="rounded-md bg-white px-3 py-2">
              {error}
            </p>
          ))}
        </div>
        <div className="mt-4">
          <FeedbackReport
            buttonLabel="Report issue"
            details={{
              module: "Trial Balance",
              transaction: input,
              appResult: message,
              appCorrectEntry: "No Trial Balance prepared.",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <ResultSection title="Parsed Journal Entries">
        <ParsedEntries entries={result.parsedEntries} />
      </ResultSection>

      <ResultSection title="Ledger Balance Summary">
        <LedgerBalanceSummary accounts={result.ledgerAccounts} />
      </ResultSection>

      <ResultSection title="Trial Balance">
        <TrialBalanceTable rows={result.rows} debitTotal={result.debitTotal} creditTotal={result.creditTotal} />
      </ResultSection>

      <ResultSection title="Trial Balance Result">
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-semibold leading-6 ${
            result.agrees
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {result.agrees
            ? "Trial Balance agrees. Debit total equals credit total."
            : `Trial Balance does not agree. Difference: Rs.${result.difference.toLocaleString("en-IN")}.`}
        </div>
      </ResultSection>

      <ResultSection title="Trial Balance Logic">
        <TextList items={result.logic} keyPrefix="trial-balance-logic" />
      </ResultSection>

      <ResultSection title="Common Mistakes">
        <TextList items={result.commonMistakes} keyPrefix="trial-balance-mistake" />
      </ResultSection>

      <FeedbackReport
        buttonLabel="Report issue"
        details={{
          module: "Trial Balance",
          transaction: input,
          appResult: `Status: ${result.status}\nDebit total: Rs.${result.debitTotal}\nCredit total: Rs.${result.creditTotal}\nAgrees: ${
            result.agrees ? "Yes" : "No"
          }`,
          appCorrectEntry: formatTrialBalanceReport(result.rows, result.debitTotal, result.creditTotal),
        }}
      />
    </section>
  );
}

function ParsedEntries({ entries }: { entries: LedgerJournalLine[][] }) {
  return (
    <div className="grid gap-3">
      {entries.map((entry, index) => (
        <div key={`trial-parsed-entry-${index}`} className="rounded-lg border border-line bg-paper p-3">
          <h3 className="text-sm font-bold text-ink">Entry {index + 1}</h3>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            {entry.map((line, lineIndex) => (
              <li key={`trial-parsed-line-${index}-${line.account}-${line.side}-${line.amount}-${lineIndex}`}>
                {line.account} A/c {line.side === "debit" ? "Dr." : "Cr."} Rs.{line.amount.toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LedgerBalanceSummary({ accounts }: { accounts: LedgerAccount[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Account</th>
            <th className="px-3 py-2 text-right font-semibold">Debit Total</th>
            <th className="px-3 py-2 text-right font-semibold">Credit Total</th>
            <th className="px-3 py-2 font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={`ledger-summary-${account.account}`} className="border-b border-line">
              <td className="px-3 py-2 font-medium text-ink">{account.account} A/c</td>
              <td className="px-3 py-2 text-right text-ink">Rs.{account.debitTotal.toLocaleString("en-IN")}</td>
              <td className="px-3 py-2 text-right text-ink">Rs.{account.creditTotal.toLocaleString("en-IN")}</td>
              <td className="px-3 py-2 text-slate-700">{formatBalance(account)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrialBalanceTable({
  rows,
  debitTotal,
  creditTotal,
}: {
  rows: TrialBalanceRow[];
  debitTotal: number;
  creditTotal: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Account</th>
            <th className="px-3 py-2 text-right font-semibold">Debit</th>
            <th className="px-3 py-2 text-right font-semibold">Credit</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={`trial-balance-row-${row.account}-${row.debit}-${row.credit}-${index}`} className="border-b border-line">
                <td className="px-3 py-2 font-medium text-ink">{row.account} A/c</td>
                <td className="px-3 py-2 text-right text-ink">{row.debit ? `Rs.${row.debit.toLocaleString("en-IN")}` : "-"}</td>
                <td className="px-3 py-2 text-right text-ink">{row.credit ? `Rs.${row.credit.toLocaleString("en-IN")}` : "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-2 text-slate-500" colSpan={3}>
                No non-zero ledger balances.
              </td>
            </tr>
          )}
          <tr className="bg-paper font-bold text-ink">
            <td className="px-3 py-2">Total</td>
            <td className="px-3 py-2 text-right">Rs.{debitTotal.toLocaleString("en-IN")}</td>
            <td className="px-3 py-2 text-right">Rs.{creditTotal.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TextList({ items, keyPrefix }: { items: string[]; keyPrefix: string }) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function formatBalance(account: LedgerAccount): string {
  if (account.balanceSide === "balanced") return "Balanced";
  return `${account.balanceSide === "debit" ? "Debit" : "Credit"} Rs.${account.balanceAmount.toLocaleString("en-IN")}`;
}

function formatTrialBalanceReport(rows: TrialBalanceRow[], debitTotal: number, creditTotal: number): string {
  return [
    "Trial Balance",
    ...rows.map(
      (row) =>
        `${row.account} A/c | Debit: ${row.debit ? `Rs.${row.debit}` : "-"} | Credit: ${
          row.credit ? `Rs.${row.credit}` : "-"
        }`,
    ),
    `Total | Debit: Rs.${debitTotal} | Credit: Rs.${creditTotal}`,
  ].join("\n");
}
