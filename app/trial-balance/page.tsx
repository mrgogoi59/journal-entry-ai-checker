"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import { type LedgerAccount, type LedgerJournalLine } from "@/lib/ledger-engine";
import { generateTrialBalance, type TrialBalanceResult, type TrialBalanceRow } from "@/lib/trial-balance-engine";

const sampleEntries = `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000`;

const exampleEntries = [
  {
    label: "Simple business start",
    value: `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000`,
  },
  {
    label: "Purchases and rent",
    value: `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`,
  },
  {
    label: "GST purchase",
    value: `Purchases A/c Dr. Rs.10000
Input GST A/c Dr. Rs.1800
To Cash A/c Rs.11800`,
  },
  {
    label: "Discount entry",
    value: `Creditor A/c Dr. Rs.5000
To Cash A/c Rs.4800
To Discount Received A/c Rs.200`,
  },
];

const badges = ["Ledger balances", "Debit total", "Credit total", "Accuracy check"];

const loadingSteps = ["Reading journal entries...", "Preparing ledger balances...", "Building trial balance..."];

export default function TrialBalancePage() {
  const [journalEntries, setJournalEntries] = useState("");
  const [result, setResult] = useState<TrialBalanceResult | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  function prepareTrialBalance() {
    setIsPreparing(true);
    window.setTimeout(() => {
      setResult(generateTrialBalance(journalEntries));
      setIsPreparing(false);
    }, 120);
  }

  function fillExample(value: string) {
    setJournalEntries(value);
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-5">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Enter journal entries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter journal entries. The app will prepare ledger balances and then generate the Trial Balance.
              </p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-800">Journal Entries</span>
              <textarea
                value={journalEntries}
                onChange={(event) => {
                  setJournalEntries(event.target.value);
                  setResult(null);
                }}
                placeholder={sampleEntries}
                className="min-h-72 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {exampleEntries.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => fillExample(example.value)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-left text-sm font-semibold text-blue-900 transition hover:border-blue-300 hover:bg-white"
                >
                  {example.label}
                </button>
              ))}
            </div>

            {isPreparing ? <LoadingPanel /> : null}

            <button
              type="button"
              onClick={prepareTrialBalance}
              disabled={isPreparing}
              className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isPreparing ? "Preparing..." : "Prepare Trial Balance"}
            </button>
          </div>
        </section>

        {result ? <TrialBalanceResultView result={result} input={journalEntries} /> : <EmptyPreview />}
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
        <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
          Supported Topics
        </Link>
      </nav>
      <nav className="flex items-center justify-between gap-3 text-sm font-semibold sm:hidden">
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Tools
        </Link>
        <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
          Supported Topics
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Ledger balances to trial balance</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Trial Balance</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Prepare a trial balance from journal entries and ledger balances.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Trial Balance helps check whether total debit balances equal total credit balances.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-blue-100 bg-white/90 px-3 py-2 text-sm font-semibold text-blue-900 shadow-sm"
          >
            {badge}
          </span>
        ))}
      </div>
    </header>
  );
}

function TrialBalanceResultView({ result, input }: { result: TrialBalanceResult; input: string }) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Needs correction</p>
        <h2 className="mt-2 text-2xl font-bold">I could not process this yet.</h2>
        <div className="mt-4 grid gap-3">
          <IssueInfo label="Reason" value={message || "The trial balance could not be prepared."} />
          <IssueInfo label="Try this format" value={sampleEntries} />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4">
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
    <section className="grid gap-5">
      <ResultSection title="Parsed Journal Entries">
        <ParsedEntries entries={result.parsedEntries} />
      </ResultSection>

      <ResultSection title="Ledger Balance Summary">
        <LedgerBalanceSummary accounts={result.ledgerAccounts} />
      </ResultSection>

      <ResultSection title="Trial Balance" emphasis>
        <TrialBalanceTable rows={result.rows} debitTotal={result.debitTotal} creditTotal={result.creditTotal} />
      </ResultSection>

      <ResultSection title="Trial Balance Result">
        <TrialBalanceStatusCard result={result} />
      </ResultSection>

      <ResultSection title="Trial Balance Logic">
        <TextCards items={result.logic} keyPrefix="trial-balance-logic" />
      </ResultSection>

      <ResultSection title="Common Mistakes" tone="warning">
        <TextCards items={result.commonMistakes} keyPrefix="trial-balance-mistake" />
      </ResultSection>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
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
    </section>
  );
}

function EmptyPreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 shadow-soft sm:p-6">
      <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Preview</p>
      <h2 className="mt-1 text-xl font-bold text-blue-950">Trial Balance will appear here</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-blue-100 bg-white">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-blue-950 text-left text-white">
              <th className="px-3 py-3 font-semibold">Account</th>
              <th className="px-3 py-3 text-right font-semibold">Debit</th>
              <th className="px-3 py-3 text-right font-semibold">Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-50">
              <td className="px-3 py-3 font-semibold text-blue-950">Cash A/c</td>
              <td className="px-3 py-3 text-right font-semibold">Rs.37,000</td>
              <td className="px-3 py-3 text-right text-slate-400">-</td>
            </tr>
            <tr className="border-b border-blue-50">
              <td className="px-3 py-3 font-semibold text-blue-950">Capital A/c</td>
              <td className="px-3 py-3 text-right text-slate-400">-</td>
              <td className="px-3 py-3 text-right font-semibold">Rs.50,000</td>
            </tr>
            <tr className="bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Total</td>
              <td className="px-3 py-3 text-right">Rs.50,000</td>
              <td className="px-3 py-3 text-right">Rs.50,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ParsedEntries({ entries }: { entries: LedgerJournalLine[][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {entries.map((entry, index) => (
        <div key={`trial-parsed-entry-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-bold text-blue-950">Entry {index + 1}</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
            {entry.map((line, lineIndex) => (
              <li
                key={`trial-parsed-line-${index}-${line.account}-${line.side}-${line.amount}-${lineIndex}`}
                className="rounded-lg bg-white px-3 py-2"
              >
                {line.account} A/c {line.side === "debit" ? "Dr." : "Cr."} Rs.
                {line.amount.toLocaleString("en-IN")}
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
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
            <th className="px-3 py-3 font-semibold">Account</th>
            <th className="px-3 py-3 text-right font-semibold">Debit Total</th>
            <th className="px-3 py-3 text-right font-semibold">Credit Total</th>
            <th className="px-3 py-3 font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={`ledger-summary-${account.account}`} className="border-b border-slate-100 last:border-b-0">
              <td className="px-3 py-3 font-bold text-blue-950">{account.account} A/c</td>
              <td className="px-3 py-3 text-right font-medium text-slate-900">
                Rs.{account.debitTotal.toLocaleString("en-IN")}
              </td>
              <td className="px-3 py-3 text-right font-medium text-slate-900">
                Rs.{account.creditTotal.toLocaleString("en-IN")}
              </td>
              <td className="px-3 py-3">
                <BalanceBadge account={account} />
              </td>
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
    <div className="overflow-x-auto rounded-xl border border-blue-100 bg-white">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-blue-100 bg-blue-950 text-left text-white">
            <th className="px-4 py-3 font-semibold">Account</th>
            <th className="px-4 py-3 text-right font-semibold">Debit</th>
            <th className="px-4 py-3 text-right font-semibold">Credit</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr
                key={`trial-balance-row-${row.account}-${row.debit}-${row.credit}-${index}`}
                className="border-b border-blue-50"
              >
                <td className="px-4 py-3 font-semibold text-blue-950">{row.account} A/c</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {row.debit ? `Rs.${row.debit.toLocaleString("en-IN")}` : "-"}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {row.credit ? `Rs.${row.credit.toLocaleString("en-IN")}` : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-3 text-slate-500" colSpan={3}>
                No non-zero ledger balances.
              </td>
            </tr>
          )}
          <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-right">Rs.{debitTotal.toLocaleString("en-IN")}</td>
            <td className="px-4 py-3 text-right">Rs.{creditTotal.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TrialBalanceStatusCard({ result }: { result: TrialBalanceResult }) {
  const className = result.agrees
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div className={`rounded-2xl border px-4 py-4 shadow-sm ${className}`}>
      <div className="text-lg font-bold">{result.agrees ? "Trial Balance agrees" : "Trial Balance does not agree"}</div>
      <p className="mt-2 text-sm font-medium leading-6">
        {result.agrees
          ? "Debit total equals credit total."
          : `Difference: Rs.${result.difference.toLocaleString("en-IN")}.`}
      </p>
    </div>
  );
}

function BalanceBadge({ account }: { account: LedgerAccount }) {
  const label =
    account.balanceSide === "balanced"
      ? "Balanced"
      : `${account.balanceSide === "debit" ? "Debit" : "Credit"} Rs.${account.balanceAmount.toLocaleString("en-IN")}`;
  const tone =
    account.balanceSide === "debit"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : account.balanceSide === "credit"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>{label}</span>;
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

function TextCards({ items, keyPrefix }: { items: string[]; keyPrefix: string }) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-${index}`} className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
          {item}
        </li>
      ))}
    </ul>
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

function IssueInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">{value}</p>
    </div>
  );
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
