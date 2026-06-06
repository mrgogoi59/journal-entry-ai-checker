"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import {
  generateLedger,
  type LedgerAccount,
  type LedgerJournalLine,
  type LedgerPosting,
  type LedgerResult,
} from "@/lib/ledger-engine";

const sampleEntries = `Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000`;

export default function LedgerPage() {
  const [journalEntries, setJournalEntries] = useState("");
  const [result, setResult] = useState<LedgerResult | null>(null);

  function generate() {
    setResult(generateLedger(journalEntries));
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[980px] flex-col gap-4 sm:gap-5">
        <header>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-blue-700">
            Back to checker
          </Link>
          <p className="mt-4 text-sm font-semibold text-accent">Ledger Engine MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Ledger Posting</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Enter journal entries and see how they are posted into ledger accounts.
          </p>
          <p className="mt-2 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft">
            Ledger posting means recording each journal entry into the individual accounts affected by it.
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
              Enter one journal entry per block. Keep Dr. lines and To lines clear.
            </p>
            <button
              type="button"
              onClick={generate}
              className="min-h-12 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Generate Ledger
            </button>
          </div>
        </section>

        {result ? <LedgerResultView result={result} input={journalEntries} /> : null}
      </section>
    </main>
  );
}

function LedgerResultView({ result, input }: { result: LedgerResult; input: string }) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft sm:p-6">
        <h2 className="text-lg font-bold">I could not generate the ledger yet.</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6">
          {result.errors.map((error, index) => (
            <p key={`ledger-error-${error}-${index}`} className="rounded-md bg-white px-3 py-2">
              {error}
            </p>
          ))}
        </div>
        <div className="mt-4">
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
    <section className="grid gap-4">
      <ResultSection title="Parsed Journal Entries">
        <ParsedEntries entries={result.parsedEntries} />
      </ResultSection>

      <ResultSection title="Ledger Accounts">
        <div className="grid gap-4">
          {result.ledgerAccounts.map((account) => (
            <LedgerAccountCard key={account.account} account={account} />
          ))}
        </div>
      </ResultSection>

      <ResultSection title="Posting Logic">
        <ul className="grid gap-2 text-sm leading-6 text-slate-700">
          {result.postingLogic.map((logic, index) => (
            <li key={`logic-${logic}-${index}`}>{logic}</li>
          ))}
        </ul>
      </ResultSection>

      <ResultSection title="Common Mistakes">
        <ul className="grid gap-2 text-sm leading-6 text-slate-700">
          {result.commonMistakes.map((mistake, index) => (
            <li key={`mistake-${mistake}-${index}`}>{mistake}</li>
          ))}
        </ul>
      </ResultSection>

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
  );
}

function ParsedEntries({ entries }: { entries: LedgerJournalLine[][] }) {
  return (
    <div className="grid gap-3">
      {entries.map((entry, index) => (
        <div key={`parsed-entry-${index}`} className="rounded-lg border border-line bg-paper p-3">
          <h3 className="text-sm font-bold text-ink">Entry {index + 1}</h3>
          <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700">
            {entry.map((line, lineIndex) => (
              <li key={`parsed-line-${index}-${line.account}-${line.side}-${lineIndex}`}>
                {line.account} A/c {line.side === "debit" ? "Dr." : "Cr."} Rs.{line.amount.toLocaleString("en-IN")}
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
    <article className="rounded-lg border border-line bg-white p-4">
      <h3 className="text-lg font-bold text-ink">{account.account} A/c</h3>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <PostingTable title="Debit" postings={account.debitPostings} />
        <PostingTable title="Credit" postings={account.creditPostings} />
      </div>
      <div className="mt-3 rounded-md bg-paper px-3 py-2 text-sm font-semibold text-ink">
        Debit total Rs.{account.debitTotal.toLocaleString("en-IN")} | Credit total Rs.
        {account.creditTotal.toLocaleString("en-IN")} | {formatBalance(account)}
      </div>
    </article>
  );
}

function PostingTable({ title, postings }: { title: string; postings: LedgerPosting[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-ink">{title}</h4>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-slate-700">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Particulars</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {postings.length ? (
              postings.map((posting, index) => (
                <tr key={`${posting.account}-${posting.reference}-${posting.amount}-${index}`} className="border-b border-line">
                  <td className="px-3 py-2 text-slate-700">-</td>
                  <td className="px-3 py-2 font-medium text-ink">{posting.reference}</td>
                  <td className="px-3 py-2 text-right text-ink">{posting.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-2 text-slate-500" colSpan={3}>
                  No postings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
