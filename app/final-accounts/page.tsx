"use client";

import Link from "next/link";
import { useState } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import {
  generateFinalAccounts,
  type CapitalWorking,
  type FinalAccountLine,
  type FinalAccountsResult,
  type TrialBalanceBalance,
} from "@/lib/final-accounts-engine";

const sampleBalances = `Capital A/c Cr Rs.50000
Cash A/c Dr Rs.10000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.40000
Wages A/c Dr Rs.5000
Rent A/c Dr Rs.3000
Commission Received A/c Cr Rs.2000
Debtors A/c Dr Rs.8000
Creditors A/c Cr Rs.6000
Furniture A/c Dr Rs.15000
Drawings A/c Dr Rs.5000
Bank A/c Dr Rs.32000`;

const limitations = [
  "No adjustment processing yet",
  "No detailed schedules",
  "No company/partnership balance sheet formats",
  "No closing stock adjustment unless directly provided",
  "No opening balances workflow",
  "No database/history",
  "No AI",
];

export default function FinalAccountsPage() {
  const [trialBalanceInput, setTrialBalanceInput] = useState("");
  const [result, setResult] = useState<FinalAccountsResult | null>(null);

  function prepareFinalAccounts() {
    setResult(generateFinalAccounts(trialBalanceInput));
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 sm:py-9">
      <section className="mx-auto flex w-full max-w-[980px] flex-col gap-4 sm:gap-5">
        <header>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-blue-700">
            Back to checker
          </Link>
          <p className="mt-4 text-sm font-semibold text-accent">Final Accounts Engine MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Final Accounts MVP</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Enter trial balance balances and prepare Trading A/c, Profit & Loss A/c, and Balance Sheet.
          </p>
          <p className="mt-2 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-soft">
            This version prepares a simple sole proprietorship Balance Sheet. Adjustments and detailed schedules will
            come later.
          </p>
        </header>

        <section className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Trial Balance Balances</span>
              <textarea
                value={trialBalanceInput}
                onChange={(event) => {
                  setTrialBalanceInput(event.target.value);
                  setResult(null);
                }}
                placeholder={sampleBalances}
                className="min-h-64 resize-y rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <p className="rounded-md bg-paper px-3 py-2 text-sm leading-6 text-slate-600">
              Write one balance per line using Dr or Cr.
            </p>
            <button
              type="button"
              onClick={prepareFinalAccounts}
              className="min-h-12 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Prepare Final Accounts
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

        {result ? <FinalAccountsResultView result={result} input={trialBalanceInput} /> : null}
      </section>
    </main>
  );
}

function FinalAccountsResultView({ result, input }: { result: FinalAccountsResult; input: string }) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-soft sm:p-6">
        <h2 className="text-lg font-bold">I could not prepare Final Accounts yet.</h2>
        <div className="mt-3 grid gap-2 text-sm leading-6">
          {result.errors.map((error, index) => (
            <p key={`final-accounts-error-${error}-${index}`} className="rounded-md bg-white px-3 py-2">
              {error}
            </p>
          ))}
        </div>
        <div className="mt-4">
          <FeedbackReport
            buttonLabel="Report issue"
            details={{
              module: "Final Accounts",
              transaction: input,
              appResult: message,
              appCorrectEntry: "No Final Accounts prepared.",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {result.warnings.length ? <WarningList warnings={result.warnings} /> : null}

      <ResultSection title="Parsed Trial Balance">
        <ParsedTrialBalance balances={result.parsedBalances} />
      </ResultSection>

      <ResultSection title="Trading Account">
        <FinalAccountTable
          debitTitle="Debit Side"
          creditTitle="Credit Side"
          debitLines={result.tradingAccount.debitLines}
          creditLines={result.tradingAccount.creditLines}
          debitTotal={result.tradingAccount.debitTotal}
          creditTotal={result.tradingAccount.creditTotal}
        />
      </ResultSection>

      <ResultSection title="Gross Profit / Gross Loss">
        <ProfitLossResult
          profitLabel="Gross Profit"
          lossLabel="Gross Loss"
          profit={result.tradingAccount.grossProfit}
          loss={result.tradingAccount.grossLoss}
        />
      </ResultSection>

      <ResultSection title="Profit & Loss Account">
        <FinalAccountTable
          debitTitle="Debit Side"
          creditTitle="Credit Side"
          debitLines={result.profitAndLossAccount.debitLines}
          creditLines={result.profitAndLossAccount.creditLines}
          debitTotal={result.profitAndLossAccount.debitTotal}
          creditTotal={result.profitAndLossAccount.creditTotal}
        />
      </ResultSection>

      <ResultSection title="Net Profit / Net Loss">
        <ProfitLossResult
          profitLabel="Net Profit"
          lossLabel="Net Loss"
          profit={result.profitAndLossAccount.netProfit}
          loss={result.profitAndLossAccount.netLoss}
        />
      </ResultSection>

      {result.balanceSheet.capitalWorking ? <CapitalWorkingView working={result.balanceSheet.capitalWorking} /> : null}

      <ResultSection title="Balance Sheet">
        <BalanceSheetTable
          liabilities={result.balanceSheet.liabilities}
          assets={result.balanceSheet.assets}
          liabilityTotal={result.balanceSheet.liabilityTotal}
          assetTotal={result.balanceSheet.assetTotal}
        />
      </ResultSection>

      <ResultSection title="Balance Sheet Result">
        <BalanceSheetResult
          agrees={result.balanceSheet.agrees}
          difference={result.balanceSheet.difference}
          liabilityTotal={result.balanceSheet.liabilityTotal}
          assetTotal={result.balanceSheet.assetTotal}
        />
      </ResultSection>

      <UnclassifiedItems items={result.unclassifiedItems} />

      <ResultSection title="Final Accounts Logic">
        <TextList items={result.logic} keyPrefix="final-accounts-logic" />
      </ResultSection>

      <ResultSection title="Common Mistakes">
        <TextList items={result.commonMistakes} keyPrefix="final-accounts-mistake" />
      </ResultSection>

      <FeedbackReport
        buttonLabel="Report issue"
        details={{
          module: "Final Accounts",
          transaction: input,
          appResult: `Status: ${result.status}\nGross profit: Rs.${result.tradingAccount.grossProfit}\nGross loss: Rs.${result.tradingAccount.grossLoss}\nNet profit: Rs.${result.profitAndLossAccount.netProfit}\nNet loss: Rs.${result.profitAndLossAccount.netLoss}\nBalance Sheet agrees: ${
            result.balanceSheet.agrees ? "Yes" : "No"
          }`,
          appCorrectEntry: formatFinalAccountsReport(result),
        }}
      />
    </section>
  );
}

function WarningList({ warnings }: { warnings: string[] }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-900 shadow-soft sm:p-6">
      {warnings.map((warning, index) => (
        <p key={`final-accounts-warning-${warning}-${index}`}>{warning}</p>
      ))}
    </section>
  );
}

function ParsedTrialBalance({ balances }: { balances: TrialBalanceBalance[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Account</th>
            <th className="px-3 py-2 font-semibold">Side</th>
            <th className="px-3 py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance, index) => (
            <tr key={`parsed-balance-${balance.account}-${balance.side}-${balance.amount}-${index}`} className="border-b border-line">
              <td className="px-3 py-2 font-medium text-ink">{balance.account} A/c</td>
              <td className="px-3 py-2 text-slate-700">{balance.side === "debit" ? "Dr" : "Cr"}</td>
              <td className="px-3 py-2 text-right text-ink">Rs.{balance.amount.toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinalAccountTable({
  debitTitle,
  creditTitle,
  debitLines,
  creditLines,
  debitTotal,
  creditTotal,
}: {
  debitTitle: string;
  creditTitle: string;
  debitLines: FinalAccountLine[];
  creditLines: FinalAccountLine[];
  debitTotal: number;
  creditTotal: number;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AccountSideTable title={debitTitle} lines={debitLines} total={debitTotal} />
      <AccountSideTable title={creditTitle} lines={creditLines} total={creditTotal} />
    </div>
  );
}

function AccountSideTable({ title, lines, total }: { title: string; lines: FinalAccountLine[]; total: number }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-slate-700">
              <th className="px-3 py-2 font-semibold">Particulars</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.length ? (
              lines.map((line, index) => (
                <tr key={`account-side-${title}-${line.account}-${line.amount}-${index}`} className="border-b border-line">
                  <td className="px-3 py-2 font-medium text-ink">{line.account}</td>
                  <td className="px-3 py-2 text-right text-ink">Rs.{line.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-2 text-slate-500" colSpan={2}>
                  No items
                </td>
              </tr>
            )}
            <tr className="bg-paper font-bold text-ink">
              <td className="px-3 py-2">Total</td>
              <td className="px-3 py-2 text-right">Rs.{total.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfitLossResult({
  profitLabel,
  lossLabel,
  profit,
  loss,
}: {
  profitLabel: string;
  lossLabel: string;
  profit: number;
  loss: number;
}) {
  const text =
    profit > 0
      ? `${profitLabel}: Rs.${profit.toLocaleString("en-IN")}`
      : loss > 0
        ? `${lossLabel}: Rs.${loss.toLocaleString("en-IN")}`
        : "No profit or loss.";

  return <p className="rounded-lg border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink">{text}</p>;
}

function CapitalWorkingView({ working }: { working: CapitalWorking }) {
  return (
    <ResultSection title="Capital Working">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Capital A/c" amount={working.openingCapital} />
            {working.netProfit > 0 ? <CapitalWorkingRow label="Add: Net Profit" amount={working.netProfit} /> : null}
            {working.netLoss > 0 ? <CapitalWorkingRow label="Less: Net Loss" amount={working.netLoss} /> : null}
            {working.drawings > 0 ? <CapitalWorkingRow label="Less: Drawings" amount={working.drawings} /> : null}
            <tr className="border-t border-line bg-paper font-bold text-ink">
              <td className="px-3 py-2">Adjusted Capital</td>
              <td className="px-3 py-2 text-right">Rs.{working.adjustedCapital.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function CapitalWorkingRow({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-b border-line">
      <td className="px-3 py-2 font-medium text-ink">{label}</td>
      <td className="px-3 py-2 text-right text-ink">Rs.{amount.toLocaleString("en-IN")}</td>
    </tr>
  );
}

function BalanceSheetTable({
  liabilities,
  assets,
  liabilityTotal,
  assetTotal,
}: {
  liabilities: FinalAccountLine[];
  assets: FinalAccountLine[];
  liabilityTotal: number;
  assetTotal: number;
}) {
  const rowCount = Math.max(liabilities.length, assets.length, 1);
  const rows = Array.from({ length: rowCount }, (_, index) => ({
    liability: liabilities[index],
    asset: assets[index],
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Liabilities</th>
            <th className="px-3 py-2 text-right font-semibold">Amount</th>
            <th className="px-3 py-2 font-semibold">Assets</th>
            <th className="px-3 py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`balance-sheet-row-${row.liability?.account ?? "blank"}-${row.asset?.account ?? "blank"}-${index}`} className="border-b border-line">
              <td className="px-3 py-2 font-medium text-ink">{row.liability?.account ?? "-"}</td>
              <td className="px-3 py-2 text-right text-ink">
                {row.liability ? `Rs.${row.liability.amount.toLocaleString("en-IN")}` : "-"}
              </td>
              <td className="px-3 py-2 font-medium text-ink">{row.asset?.account ?? "-"}</td>
              <td className="px-3 py-2 text-right text-ink">
                {row.asset ? `Rs.${row.asset.amount.toLocaleString("en-IN")}` : "-"}
              </td>
            </tr>
          ))}
          <tr className="bg-paper font-bold text-ink">
            <td className="px-3 py-2">Total Liabilities</td>
            <td className="px-3 py-2 text-right">Rs.{liabilityTotal.toLocaleString("en-IN")}</td>
            <td className="px-3 py-2">Total Assets</td>
            <td className="px-3 py-2 text-right">Rs.{assetTotal.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BalanceSheetResult({
  agrees,
  difference,
  liabilityTotal,
  assetTotal,
}: {
  agrees: boolean;
  difference: number;
  liabilityTotal: number;
  assetTotal: number;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-semibold leading-6 ${
        agrees ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      {agrees
        ? "Balance Sheet agrees."
        : `Balance Sheet does not agree. Difference: Rs.${difference.toLocaleString("en-IN")}.`}
      <div className="mt-1 text-xs font-medium">
        Total liabilities Rs.{liabilityTotal.toLocaleString("en-IN")} | Total assets Rs.
        {assetTotal.toLocaleString("en-IN")}
      </div>
    </div>
  );
}

function UnclassifiedItems({ items }: { items: TrialBalanceBalance[] }) {
  if (!items.length) return null;

  return (
    <ResultSection title="Unclassified Items">
      <p className="mb-3 text-sm leading-6 text-slate-700">I could not classify these accounts yet.</p>
      <BalanceList items={items} emptyText="No unclassified items." keyPrefix="unclassified-item" />
    </ResultSection>
  );
}

function BalanceList({
  items,
  emptyText,
  keyPrefix,
}: {
  items: TrialBalanceBalance[];
  emptyText: string;
  keyPrefix: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-paper text-left text-slate-700">
            <th className="px-3 py-2 font-semibold">Account</th>
            <th className="px-3 py-2 font-semibold">Side</th>
            <th className="px-3 py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((item, index) => (
              <tr key={`${keyPrefix}-${item.account}-${item.side}-${item.amount}-${index}`} className="border-b border-line">
                <td className="px-3 py-2 font-medium text-ink">{item.account} A/c</td>
                <td className="px-3 py-2 text-slate-700">{item.side === "debit" ? "Dr" : "Cr"}</td>
                <td className="px-3 py-2 text-right text-ink">Rs.{item.amount.toLocaleString("en-IN")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-2 text-slate-500" colSpan={3}>
                {emptyText}
              </td>
            </tr>
          )}
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

function formatFinalAccountsReport(result: FinalAccountsResult): string {
  return [
    "Trading Account",
    "Debit:",
    ...result.tradingAccount.debitLines.map((line) => `- ${line.account} Rs.${line.amount}`),
    "Credit:",
    ...result.tradingAccount.creditLines.map((line) => `- ${line.account} Rs.${line.amount}`),
    `Gross Profit: Rs.${result.tradingAccount.grossProfit}`,
    `Gross Loss: Rs.${result.tradingAccount.grossLoss}`,
    "",
    "Profit & Loss Account",
    "Debit:",
    ...result.profitAndLossAccount.debitLines.map((line) => `- ${line.account} Rs.${line.amount}`),
    "Credit:",
    ...result.profitAndLossAccount.creditLines.map((line) => `- ${line.account} Rs.${line.amount}`),
    `Net Profit: Rs.${result.profitAndLossAccount.netProfit}`,
    `Net Loss: Rs.${result.profitAndLossAccount.netLoss}`,
    "",
    "Balance Sheet",
    "Liabilities:",
    ...result.balanceSheet.liabilities.map((line) => `- ${line.account} Rs.${line.amount}`),
    "Assets:",
    ...result.balanceSheet.assets.map((line) => `- ${line.account} Rs.${line.amount}`),
    `Total Liabilities: Rs.${result.balanceSheet.liabilityTotal}`,
    `Total Assets: Rs.${result.balanceSheet.assetTotal}`,
    `Agrees: ${result.balanceSheet.agrees ? "Yes" : "No"}`,
  ].join("\n");
}
