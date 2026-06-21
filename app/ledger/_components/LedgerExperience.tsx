"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import {
  generateLedger,
  type LedgerAccount,
  type LedgerJournalLine,
  type LedgerPosting,
  type LedgerResult,
} from "@/lib/ledger-engine";

const sampleEntries = `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000`;

const exampleEntries = [
  {
    label: "Capital introduced",
    value: `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000`,
  },
  {
    label: "Goods purchased for cash",
    value: `Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000`,
  },
  {
    label: "Rent paid",
    value: `Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`,
  },
  {
    label: "GST purchase",
    value: `Purchases A/c Dr. Rs.10000
Input GST A/c Dr. Rs.1800
To Cash A/c Rs.11800`,
  },
];

const badges = ["Journal to Ledger", "Debit and Credit sides", "Balance c/d", "Beginner friendly"];

const loadingSteps = ["Posting journal entries...", "Preparing ledger accounts...", "Calculating balances..."];

export function LedgerExperience() {
  const [journalEntries, setJournalEntries] = useState("");
  const [result, setResult] = useState<LedgerResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  function generate() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setResult(generateLedger(journalEntries));
      setIsGenerating(false);
    }, 120);
  }

  function fillExample(value: string) {
    setJournalEntries(value);
    setResult(null);
  }

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 text-ink sm:gap-6">
        <PageHeader />

        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-5">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Enter journal entries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter one journal entry per block. Use Dr. for debit lines and To for credit lines.
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

            {isGenerating ? <LoadingPanel /> : null}

            <button
              type="button"
              onClick={generate}
              disabled={isGenerating}
              className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isGenerating ? "Generating..." : "Generate Ledger"}
            </button>
          </div>
        </section>

        {result ? <LedgerResultView result={result} input={journalEntries} /> : <EmptyPreview />}
    </section>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Journal to ledger</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Ledger Posting</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Convert journal entries into account-wise ledger postings.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Ledger posting shows how every journal entry is recorded inside individual accounts.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/solver"
            className="inline-flex min-h-10 items-center rounded-xl border border-blue-100 bg-white/90 px-3 text-sm font-bold text-blue-900 transition hover:border-blue-300 hover:bg-blue-50"
          >
            Back to Solver
          </Link>
          <Link
            href="/supported-transactions"
            className="inline-flex min-h-10 items-center rounded-xl border border-emerald-200 bg-white/90 px-3 text-sm font-bold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Supported Topics
          </Link>
        </div>
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

function LedgerResultView({ result, input }: { result: LedgerResult; input: string }) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Needs correction</p>
        <h2 className="mt-2 text-2xl font-bold">I could not process this yet.</h2>
        <div className="mt-4 grid gap-3">
          <IssueInfo label="Reason" value={message || "The journal entries could not be parsed."} />
          <IssueInfo label="Try this format" value={sampleEntries} />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4">
          <FeedbackReport
            buttonLabel="Report issue"
            details={{
              module: "Ledger",
              transaction: input,
              appResult: message,
              appCorrectEntry: "No ledger generated.",
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

      <ResultSection title="Ledger Accounts" emphasis>
        <div className="grid gap-4">
          {result.ledgerAccounts.map((account) => (
            <LedgerAccountCard key={account.account} account={account} />
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Posting Logic">
        <TextCards items={result.postingLogic} keyPrefix="logic" />
      </ResultSection>

      <ResultSection title="Common Mistakes" tone="warning">
        <TextCards items={result.commonMistakes} keyPrefix="mistake" />
      </ResultSection>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
        <FeedbackReport
          buttonLabel="Report issue"
          details={{
            module: "Ledger",
            transaction: input,
            appResult: `Status: ${result.status}\nLedger accounts: ${result.ledgerAccounts
              .map((account) => account.account)
              .join(", ")}`,
            appCorrectEntry: formatLedgerReport(result.ledgerAccounts),
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
      <h2 className="mt-1 text-xl font-bold text-blue-950">Ledger accounts will appear here</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <PreviewSide title="Debit Side" rows={["To Capital A/c 50,000", "To Balance c/d 37,000"]} />
        <PreviewSide title="Credit Side" rows={["By Purchases A/c 10,000", "By Rent A/c 3,000"]} />
      </div>
    </section>
  );
}

function PreviewSide({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <h3 className="text-sm font-bold text-blue-950">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        {rows.map((row) => (
          <li key={row} className="rounded-lg bg-slate-50 px-3 py-2">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ParsedEntries({ entries }: { entries: LedgerJournalLine[][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {entries.map((entry, index) => (
        <div key={`parsed-entry-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-bold text-blue-950">Entry {index + 1}</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
            {entry.map((line, lineIndex) => (
              <li
                key={`parsed-line-${index}-${line.account}-${line.side}-${line.amount}-${lineIndex}`}
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

function LedgerAccountCard({ account }: { account: LedgerAccount }) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Ledger Account</p>
          <h3 className="mt-1 text-2xl font-bold text-blue-950">{account.account} A/c</h3>
        </div>
        <BalanceBadge account={account} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <PostingTable title="Debit Side" postings={account.debitPostings} total={account.debitTotal} />
        <PostingTable title="Credit Side" postings={account.creditPostings} total={account.creditTotal} />
      </div>
    </article>
  );
}

function BalanceBadge({ account }: { account: LedgerAccount }) {
  const label =
    account.balanceSide === "balanced"
      ? "Balanced"
      : `${account.balanceSide === "debit" ? "Debit Balance" : "Credit Balance"} Rs.${account.balanceAmount.toLocaleString(
          "en-IN",
        )}`;
  const tone =
    account.balanceSide === "debit"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : account.balanceSide === "credit"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`rounded-full border px-3 py-2 text-sm font-bold ${tone}`}>{label}</span>;
}

function PostingTable({ title, postings, total }: { title: string; postings: LedgerPosting[]; total: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h4 className="text-sm font-bold text-blue-950">{title}</h4>
      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Particulars</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {postings.length ? (
              postings.map((posting, index) => (
                <tr key={`${posting.account}-${posting.reference}-${posting.amount}-${index}`} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-500">-</td>
                  <td className="px-3 py-3 font-medium text-blue-950">{posting.reference}</td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900">
                    Rs.{posting.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={3}>
                  No postings
                </td>
              </tr>
            )}
            <tr className="border-t-2 border-blue-100 bg-blue-50 text-blue-950">
              <td className="px-3 py-3 font-bold" colSpan={2}>
                Total
              </td>
              <td className="px-3 py-3 text-right font-bold">Rs.{total.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
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

function TextCards({ items, keyPrefix }: { items: string[]; keyPrefix: string }) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-${item}-${index}`} className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
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

function formatBalance(account: LedgerAccount): string {
  if (account.balanceSide === "balanced") return "Balanced";
  return `Balance: ${account.balanceSide === "debit" ? "Debit" : "Credit"} Rs.${account.balanceAmount.toLocaleString(
    "en-IN",
  )}`;
}

function formatLedgerReport(accounts: LedgerAccount[]): string {
  return accounts
    .map((account) =>
      [
        `${account.account} A/c`,
        "Debit:",
        ...account.debitPostings.map((posting) => `- ${posting.reference} Rs.${posting.amount}`),
        "Credit:",
        ...account.creditPostings.map((posting) => `- ${posting.reference} Rs.${posting.amount}`),
        formatBalance(account),
      ].join("\n"),
    )
    .join("\n\n");
}
