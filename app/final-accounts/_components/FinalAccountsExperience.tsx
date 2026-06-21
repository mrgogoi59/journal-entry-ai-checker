"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FeedbackReport } from "@/components/FeedbackReport";
import {
  generateFinalAccounts,
  type CapitalWorking,
  type FinalAccountAdjustment,
  type FinalAccountLine,
  type FinalAccountsResult,
  type GoodsLostByFireWorking,
  type InterestOnLoanWorking,
  type InterestWorking,
  type ManagerCommissionWorking,
  type ProvisionForDiscountOnCreditorsWorking,
  type ProvisionForDiscountOnDebtorsWorking,
  type ProvisionForDoubtfulDebtsWorking,
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

const sampleAdjustments = `Closing stock Rs.10000
Salary outstanding Rs.3000
Prepaid insurance Rs.2000
Interest accrued Rs.1500
Rent received in advance Rs.4000
Depreciation on machinery Rs.5000`;

const exampleSets = [
  {
    label: "Basic final accounts",
    balances: sampleBalances,
    adjustments: "",
  },
  {
    label: "With closing stock",
    balances: sampleBalances,
    adjustments: "Closing stock Rs.10000",
  },
  {
    label: "With provisions",
    balances: `${sampleBalances}
Provision for Doubtful Debts A/c Cr Rs.500`,
    adjustments: `Further bad debts Rs.1000
Create provision for doubtful debts 5% on debtors`,
  },
  {
    label: "With manager's commission",
    balances: sampleBalances,
    adjustments: `Closing stock Rs.10000
Manager's commission 10% after commission`,
  },
  {
    label: "With goods adjustments",
    balances: sampleBalances,
    adjustments: `Closing stock Rs.10000
Goods withdrawn by proprietor Rs.2000
Goods lost by fire Rs.3000 insurance claim Rs.2000 admitted`,
  },
];

const badges = ["Trading A/c", "Profit & Loss A/c", "Balance Sheet", "Adjustments", "Beginner friendly"];

const loadingSteps = [
  "Reading trial balance...",
  "Applying adjustments...",
  "Preparing Trading A/c, P&L A/c, and Balance Sheet...",
];

const limitations = [
  "Only selected adjustments are supported",
  "No company/partnership balance sheet formats",
  "No detailed schedules",
  "No opening balances workflow",
  "No database/history",
  "No AI",
];

export function FinalAccountsExperience() {
  const [trialBalanceInput, setTrialBalanceInput] = useState("");
  const [adjustmentsInput, setAdjustmentsInput] = useState("");
  const [result, setResult] = useState<FinalAccountsResult | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  function prepareFinalAccounts() {
    setIsPreparing(true);
    window.setTimeout(() => {
      setResult(generateFinalAccounts(trialBalanceInput, adjustmentsInput));
      setIsPreparing(false);
    }, 120);
  }

  function fillExample(balances: string, adjustments: string) {
    setTrialBalanceInput(balances);
    setAdjustmentsInput(adjustments);
    setResult(null);
  }

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 text-ink sm:gap-6">
        <PageHeader />

        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-5">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Prepare from trial balance</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add balances and selected adjustments, then prepare Trading A/c, P&L A/c, and Balance Sheet.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-800">Trial Balance Balances</span>
                <textarea
                  value={trialBalanceInput}
                  onChange={(event) => {
                    setTrialBalanceInput(event.target.value);
                    setResult(null);
                  }}
                  placeholder={sampleBalances}
                  className="min-h-80 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm leading-6 text-slate-600">
                  Write one balance per line using Dr or Cr.
                </span>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-800">Adjustments</span>
                <textarea
                  value={adjustmentsInput}
                  onChange={(event) => {
                    setAdjustmentsInput(event.target.value);
                    setResult(null);
                  }}
                  placeholder={sampleAdjustments}
                  className="min-h-80 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-6 text-slate-600">
                  Enter one adjustment per line. Selected adjustments are supported.
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {exampleSets.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => fillExample(example.balances, example.adjustments)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-left text-sm font-semibold text-blue-900 transition hover:border-blue-300 hover:bg-white"
                >
                  {example.label}
                </button>
              ))}
            </div>

            {isPreparing ? <LoadingPanel /> : null}

            <button
              type="button"
              onClick={prepareFinalAccounts}
              disabled={isPreparing}
              className="min-h-12 rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isPreparing ? "Preparing..." : "Prepare Final Accounts"}
            </button>
          </div>
        </section>

        <LimitationsCard />

        {result ? <FinalAccountsResultView result={result} input={trialBalanceInput} adjustments={adjustmentsInput} /> : null}
      </section>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Trial balance to final accounts</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Final Accounts</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Prepare Trading A/c, Profit & Loss A/c, Balance Sheet, and selected adjustments step by step.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Final Accounts show how trial balance balances become business results and financial position.
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

function LimitationsCard() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Scope</p>
          <h2 className="mt-1 text-xl font-bold text-blue-950">Known limitations</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          This page focuses on selected student-level final accounts workflows.
        </p>
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        {limitations.map((limitation) => (
          <li key={limitation} className="rounded-xl border border-blue-100 bg-white px-3 py-2 font-medium">
            {limitation}
          </li>
        ))}
      </ul>
    </section>
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

function FinalAccountsResultView({
  result,
  input,
  adjustments,
}: {
  result: FinalAccountsResult;
  input: string;
  adjustments: string;
}) {
  if (result.status === "invalid") {
    const message = result.errors.join("\n");

    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Needs correction</p>
        <h2 className="mt-2 text-2xl font-bold">I could not process this yet.</h2>
        <div className="mt-4 grid gap-3">
          <IssueInfo label="Reason" value={message || "The final accounts could not be prepared."} />
          <IssueInfo label="Try this format" value={sampleBalances} />
        </div>
        <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-4">
          <FeedbackReport
            buttonLabel="Report issue"
            details={{
              module: "Final Accounts",
              transaction: formatReportInput(input, adjustments),
              appResult: message,
              appCorrectEntry: "No Final Accounts prepared.",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-5">
      {result.warnings.length ? <WarningList warnings={result.warnings} /> : null}

      <FinalAccountsSummary result={result} />

      <ResultSection
        title="Parsed Trial Balance"
        summary={`${result.parsedBalances.length} balances parsed`}
        defaultOpenMobile={false}
      >
        <ParsedTrialBalance balances={result.parsedBalances} />
      </ResultSection>

      <ResultSection
        title="Parsed Adjustments"
        summary={`${result.parsedAdjustments.length} adjustments parsed`}
        defaultOpenMobile={false}
      >
        <ParsedAdjustments
          adjustments={result.parsedAdjustments}
          unclassifiedAdjustments={result.unclassifiedAdjustments}
          managerCommissionWorking={result.balanceSheet.managerCommissionWorking}
        />
      </ResultSection>

      <ResultSection title="Trading Account" summary={formatGrossResult(result)} emphasis>
        <FinalAccountTable
          debitTitle="Debit Side"
          creditTitle="Credit Side"
          debitLines={result.tradingAccount.debitLines}
          creditLines={result.tradingAccount.creditLines}
          debitTotal={result.tradingAccount.debitTotal}
          creditTotal={result.tradingAccount.creditTotal}
        />
      </ResultSection>

      <ResultSection title="Gross Profit / Gross Loss" summary={formatGrossResult(result)}>
        <ProfitLossResult
          profitLabel="Gross Profit"
          lossLabel="Gross Loss"
          profit={result.tradingAccount.grossProfit}
          loss={result.tradingAccount.grossLoss}
        />
      </ResultSection>

      <ResultSection title="Profit & Loss Account" summary={formatNetResult(result)} emphasis>
        <FinalAccountTable
          debitTitle="Debit Side"
          creditTitle="Credit Side"
          debitLines={result.profitAndLossAccount.debitLines}
          creditLines={result.profitAndLossAccount.creditLines}
          debitTotal={result.profitAndLossAccount.debitTotal}
          creditTotal={result.profitAndLossAccount.creditTotal}
        />
      </ResultSection>

      <ResultSection title="Net Profit / Net Loss" summary={formatNetResult(result)}>
        <ProfitLossResult
          profitLabel="Net Profit"
          lossLabel="Net Loss"
          profit={result.profitAndLossAccount.netProfit}
          loss={result.profitAndLossAccount.netLoss}
        />
      </ResultSection>

      {result.balanceSheet.capitalWorking ? <CapitalWorkingView working={result.balanceSheet.capitalWorking} /> : null}
      {result.balanceSheet.provisionForDoubtfulDebtsWorking ? (
        <ProvisionWorkingView working={result.balanceSheet.provisionForDoubtfulDebtsWorking} />
      ) : null}
      {result.balanceSheet.provisionForDiscountOnDebtorsWorking ? (
        <DiscountProvisionWorkingView working={result.balanceSheet.provisionForDiscountOnDebtorsWorking} />
      ) : null}
      {result.balanceSheet.provisionForDiscountOnCreditorsWorking ? (
        <CreditorsDiscountProvisionWorkingView working={result.balanceSheet.provisionForDiscountOnCreditorsWorking} />
      ) : null}
      {result.balanceSheet.managerCommissionWorking ? (
        <ManagerCommissionWorkingView working={result.balanceSheet.managerCommissionWorking} />
      ) : null}
      {result.balanceSheet.goodsLostByFireWorkings?.length ? (
        <GoodsLostByFireWorkingView workings={result.balanceSheet.goodsLostByFireWorkings} />
      ) : null}
      {result.balanceSheet.interestWorking ? <InterestWorkingView working={result.balanceSheet.interestWorking} /> : null}
      {result.balanceSheet.interestOnLoanWorking ? (
        <InterestOnLoanWorkingView working={result.balanceSheet.interestOnLoanWorking} />
      ) : null}

      <ResultSection title="Balance Sheet" summary={formatBalanceSheetStatus(result)} emphasis>
        <BalanceSheetTable
          liabilities={result.balanceSheet.liabilities}
          assets={result.balanceSheet.assets}
          liabilityGroups={result.balanceSheet.liabilityGroups}
          assetGroups={result.balanceSheet.assetGroups}
          liabilityTotal={result.balanceSheet.liabilityTotal}
          assetTotal={result.balanceSheet.assetTotal}
        />
      </ResultSection>

      <ResultSection title="Balance Sheet Result" summary={formatBalanceSheetStatus(result)}>
        <BalanceSheetResult
          agrees={result.balanceSheet.agrees}
          difference={result.balanceSheet.difference}
          liabilityTotal={result.balanceSheet.liabilityTotal}
          assetTotal={result.balanceSheet.assetTotal}
        />
      </ResultSection>

      <UnclassifiedItems items={result.unclassifiedItems} />

      <ResultSection
        title="Adjustment Logic"
        summary={`${result.adjustmentLogic.length} steps`}
        defaultOpenMobile={false}
      >
        <TextList items={result.adjustmentLogic} keyPrefix="final-accounts-adjustment-logic" numbered />
      </ResultSection>

      <ResultSection title="Common Mistakes" summary={`${result.commonMistakes.length} tips`} tone="warning" defaultOpenMobile={false}>
        <TextList items={result.commonMistakes} keyPrefix="final-accounts-mistake" />
      </ResultSection>

      <ResultSection title="Report Issue" summary="Copy a tester report" defaultOpenMobile={false}>
        <FeedbackReport
          buttonLabel="Report issue"
          details={{
            module: "Final Accounts",
            transaction: formatReportInput(input, adjustments),
            appResult: `Status: ${result.status}\nGross profit: Rs.${result.tradingAccount.grossProfit}\nGross loss: Rs.${result.tradingAccount.grossLoss}\nNet profit: Rs.${result.profitAndLossAccount.netProfit}\nNet loss: Rs.${result.profitAndLossAccount.netLoss}\nBalance Sheet agrees: ${
              result.balanceSheet.agrees ? "Yes" : "No"
            }`,
            appCorrectEntry: formatFinalAccountsReport(result),
          }}
        />
      </ResultSection>
    </section>
  );
}

function FinalAccountsSummary({ result }: { result: FinalAccountsResult }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-4 shadow-soft sm:p-6">
      <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Final Accounts Summary</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <SummaryPill label="Trading Result" value={formatGrossResult(result)} />
        <SummaryPill label="P&L Result" value={formatNetResult(result)} />
        <SummaryPill label="Balance Sheet" value={formatBalanceSheetStatus(result)} />
      </div>
    </section>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white/90 px-4 py-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-blue-950">{value}</p>
    </div>
  );
}

function WarningList({ warnings }: { warnings: string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 shadow-soft sm:p-6">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Alerts / warnings</p>
      <div className="mt-3 grid gap-2 text-sm font-medium leading-6">
        {warnings.map((warning, index) => (
          <p key={`final-accounts-warning-${warning}-${index}`} className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            {warning}
          </p>
        ))}
      </div>
    </section>
  );
}

function ParsedTrialBalance({ balances }: { balances: TrialBalanceBalance[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
            <th className="px-3 py-3 font-semibold">Account</th>
            <th className="px-3 py-3 font-semibold">Side</th>
            <th className="px-3 py-3 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance, index) => (
            <tr
              key={`parsed-balance-${balance.account}-${balance.side}-${balance.amount}-${index}`}
              className="border-b border-slate-100 last:border-b-0"
            >
              <td className="px-3 py-3 font-bold text-blue-950">{balance.account} A/c</td>
              <td className="px-3 py-3">
                <SideBadge side={balance.side} />
              </td>
              <td className="px-3 py-3 text-right font-medium text-slate-900">
                Rs.{balance.amount.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParsedAdjustments({
  adjustments,
  unclassifiedAdjustments,
  managerCommissionWorking,
}: {
  adjustments: FinalAccountAdjustment[];
  unclassifiedAdjustments: string[];
  managerCommissionWorking?: ManagerCommissionWorking;
}) {
  return (
    <div className="grid gap-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
              <th className="px-3 py-3 font-semibold">Type</th>
              <th className="px-3 py-3 font-semibold">Account</th>
              <th className="px-3 py-3 font-semibold">Related Account</th>
              <th className="px-3 py-3 text-right font-semibold">Insurance Claim</th>
              <th className="px-3 py-3 font-semibold">Claim Status</th>
              <th className="px-3 py-3 text-right font-semibold">Percentage</th>
              <th className="px-3 py-3 text-right font-semibold">Calculated amount</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.length ? (
              adjustments.map((adjustment, index) => (
                <tr
                  key={`parsed-adjustment-${adjustment.type}-${adjustment.account}-${adjustment.amount}-${index}`}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-3 py-3">
                    <AdjustmentBadge type={adjustment.type} />
                  </td>
                  <td className="px-3 py-3 font-bold text-blue-950">{adjustment.account}</td>
                  <td className="px-3 py-3 text-slate-700">{adjustment.relatedAccount ?? "-"}</td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900">
                    {adjustment.insuranceClaimAmount !== undefined
                      ? `Rs.${adjustment.insuranceClaimAmount.toLocaleString("en-IN")}`
                      : "-"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {adjustment.claimStatus ? formatClaimStatus(adjustment.claimStatus) : "-"}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900">
                    {adjustment.percentage !== undefined ? `${adjustment.percentage}%` : "-"}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900">
                    {formatAdjustmentAmount(adjustment, managerCommissionWorking)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={7}>
                  No adjustments entered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {unclassifiedAdjustments.length ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <div className="font-bold">Unclassified adjustments</div>
          <ul className="mt-2 grid gap-1">
            {unclassifiedAdjustments.map((adjustment, index) => (
              <li key={`unclassified-adjustment-${adjustment}-${index}`} className="rounded-lg bg-white px-3 py-2">
                {adjustment}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-sm font-bold text-blue-950">{title}</h3>
      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
              <th className="px-3 py-3 font-semibold">Particulars</th>
              <th className="px-3 py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.length ? (
              lines.map((line, index) => (
                <tr key={`account-side-${title}-${line.account}-${line.amount}-${index}`} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-blue-950">{line.account}</td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900">
                    Rs.{line.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={2}>
                  No items
                </td>
              </tr>
            )}
            <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Total</td>
              <td className="px-3 py-3 text-right">Rs.{total.toLocaleString("en-IN")}</td>
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
  const tone = profit > 0 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900";

  return <p className={`rounded-2xl border px-4 py-4 text-lg font-bold shadow-sm ${tone}`}>{text}</p>;
}

function CapitalWorkingView({ working }: { working: CapitalWorking }) {
  return (
    <ResultSection title="Capital Working" summary="Adjusted capital" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Capital A/c" amount={working.openingCapital} />
            {working.netProfit > 0 ? <CapitalWorkingRow label="Add: Net Profit" amount={working.netProfit} /> : null}
            {working.interestOnCapital > 0 ? (
              <CapitalWorkingRow label="Add: Interest on Capital" amount={working.interestOnCapital} />
            ) : null}
            {working.netLoss > 0 ? <CapitalWorkingRow label="Less: Net Loss" amount={working.netLoss} /> : null}
            {working.drawings > 0 ? <CapitalWorkingRow label="Less: Drawings" amount={working.drawings} /> : null}
            {working.goodsWithdrawnByProprietor > 0 ? (
              <CapitalWorkingRow
                label="Less: Goods Withdrawn by Proprietor"
                amount={working.goodsWithdrawnByProprietor}
              />
            ) : null}
            {working.interestOnDrawings > 0 ? (
              <CapitalWorkingRow label="Less: Interest on Drawings" amount={working.interestOnDrawings} />
            ) : null}
            <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Adjusted Capital</td>
              <td className="px-3 py-3 text-right">Rs.{working.adjustedCapital.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function CapitalWorkingRow({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-3 py-3 font-medium text-blue-950">{label}</td>
      <td className="px-3 py-3 text-right font-medium text-slate-900">Rs.{amount.toLocaleString("en-IN")}</td>
    </tr>
  );
}

function ProvisionWorkingView({ working }: { working: ProvisionForDoubtfulDebtsWorking }) {
  return (
    <ResultSection title="Provision for Doubtful Debts Working" summary="Net debtors working" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Debtors" amount={working.debtors} />
            {working.furtherBadDebts > 0 ? (
              <CapitalWorkingRow label="Less: Further Bad Debts" amount={working.furtherBadDebts} />
            ) : null}
            {working.furtherBadDebts > 0 ? (
              <CapitalWorkingRow label="Adjusted Debtors" amount={working.adjustedDebtors} />
            ) : null}
            <CapitalWorkingRow label="Existing Provision" amount={working.existingProvision} />
            <CapitalWorkingRow label="Required Provision" amount={working.requiredProvision} />
            {working.increase > 0 ? <CapitalWorkingRow label="Increase debited to P&L" amount={working.increase} /> : null}
            {working.decrease > 0 ? <CapitalWorkingRow label="Decrease credited to P&L" amount={working.decrease} /> : null}
            <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Net Debtors</td>
              <td className="px-3 py-3 text-right">Rs.{working.netDebtors.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function DiscountProvisionWorkingView({ working }: { working: ProvisionForDiscountOnDebtorsWorking }) {
  return (
    <ResultSection title="Provision for Discount on Debtors Working" summary="Discount provision working" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Debtors" amount={working.debtors} />
            {working.furtherBadDebts > 0 ? (
              <CapitalWorkingRow label="Less: Further Bad Debts" amount={working.furtherBadDebts} />
            ) : null}
            <CapitalWorkingRow label="Adjusted Debtors" amount={working.adjustedDebtors} />
            {working.provisionForDoubtfulDebts > 0 ? (
              <CapitalWorkingRow label="Less: Provision for Doubtful Debts" amount={working.provisionForDoubtfulDebts} />
            ) : null}
            <CapitalWorkingRow label="Good Debtors" amount={working.goodDebtors} />
            <CapitalWorkingRow label="Existing Provision for Discount on Debtors" amount={working.existingProvision} />
            <CapitalWorkingRow label="Required Provision for Discount on Debtors" amount={working.requiredProvision} />
            {working.increase > 0 ? <CapitalWorkingRow label="Increase debited to P&L" amount={working.increase} /> : null}
            {working.decrease > 0 ? <CapitalWorkingRow label="Decrease credited to P&L" amount={working.decrease} /> : null}
            <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Net Debtors</td>
              <td className="px-3 py-3 text-right">Rs.{working.netDebtors.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function CreditorsDiscountProvisionWorkingView({ working }: { working: ProvisionForDiscountOnCreditorsWorking }) {
  return (
    <ResultSection title="Provision for Discount on Creditors Working" summary="Creditors provision working" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Creditors" amount={working.creditors} />
            <CapitalWorkingRow label="Existing Provision for Discount on Creditors" amount={working.existingProvision} />
            <CapitalWorkingRow label="Required Provision for Discount on Creditors" amount={working.requiredProvision} />
            {working.increase > 0 ? <CapitalWorkingRow label="Increase credited to P&L" amount={working.increase} /> : null}
            {working.decrease > 0 ? <CapitalWorkingRow label="Decrease debited to P&L" amount={working.decrease} /> : null}
            <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
              <td className="px-3 py-3">Net Creditors</td>
              <td className="px-3 py-3 text-right">Rs.{working.netCreditors.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function ManagerCommissionWorkingView({ working }: { working: ManagerCommissionWorking }) {
  return (
    <ResultSection title="Manager's Commission Working" summary="Commission calculation" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <tbody>
            {working.basis !== "fixed" ? (
              <CapitalWorkingRow label="Net Profit before commission" amount={working.profitBeforeCommission} />
            ) : null}
            {working.percentage !== undefined ? (
              <tr className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-blue-950">Commission rate</td>
                <td className="px-3 py-3 text-right font-medium text-slate-900">{working.percentage}%</td>
              </tr>
            ) : null}
            {working.basis === "after_commission" ? (
              <tr className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-blue-950">Formula</td>
                <td className="px-3 py-3 text-right font-medium text-slate-900">
                  Profit before commission x rate / (100 + rate)
                </td>
              </tr>
            ) : null}
            <CapitalWorkingRow label="Manager's Commission" amount={working.commission} />
            {working.basis !== "fixed" ? (
              <CapitalWorkingRow label="Net Profit after commission" amount={working.netProfitAfterCommission} />
            ) : null}
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function GoodsLostByFireWorkingView({ workings }: { workings: GoodsLostByFireWorking[] }) {
  return (
    <ResultSection title="Goods Lost by Fire Working" summary={`${workings.length} working${workings.length === 1 ? "" : "s"}`} defaultOpenMobile={false}>
      <div className="grid gap-4">
        {workings.map((working, index) => (
          <div key={`goods-lost-fire-working-${working.goodsLost}-${working.insuranceClaim}-${index}`} className="overflow-x-auto">
            <table className="w-full min-w-[460px] border-collapse text-sm">
              <tbody>
                <CapitalWorkingRow label="Goods Lost by Fire" amount={working.goodsLost} />
                <CapitalWorkingRow label="Less: Insurance Claim" amount={working.insuranceClaim} />
                <CapitalWorkingRow label="Loss transferred to P&L" amount={working.uninsuredLoss} />
                {working.insuranceClaimReceivable > 0 ? (
                  <CapitalWorkingRow label="Insurance Claim Receivable" amount={working.insuranceClaimReceivable} />
                ) : null}
                <tr className="border-t-2 border-blue-100 bg-blue-50 font-bold text-blue-950">
                  <td className="px-3 py-3">Claim Status</td>
                  <td className="px-3 py-3 text-right">{formatClaimStatus(working.claimStatus)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </ResultSection>
  );
}

function InterestWorkingView({ working }: { working: InterestWorking }) {
  return (
    <ResultSection title="Interest Working" summary="Capital/drawings interest" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-sm">
          <tbody>
            {working.interestOnCapital > 0 ? (
              <>
                <CapitalWorkingRow label="Capital" amount={working.capital} />
                {working.interestOnCapitalRate !== undefined ? (
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-blue-950">Interest on Capital Rate</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900">{working.interestOnCapitalRate}%</td>
                  </tr>
                ) : null}
                <CapitalWorkingRow label="Interest on Capital" amount={working.interestOnCapital} />
              </>
            ) : null}
            {working.interestOnDrawings > 0 ? (
              <>
                <CapitalWorkingRow label="Drawings" amount={working.drawings} />
                {working.interestOnDrawingsRate !== undefined ? (
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-blue-950">Interest on Drawings Rate</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900">{working.interestOnDrawingsRate}%</td>
                  </tr>
                ) : null}
                <CapitalWorkingRow label="Interest on Drawings" amount={working.interestOnDrawings} />
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function InterestOnLoanWorkingView({ working }: { working: InterestOnLoanWorking }) {
  return (
    <ResultSection title="Interest on Loan Working" summary="Loan interest" defaultOpenMobile={false}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <tbody>
            <CapitalWorkingRow label="Loan Balance" amount={working.loanBalance} />
            {working.interestRate !== undefined ? (
              <tr className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium text-blue-950">Interest Rate</td>
                <td className="px-3 py-3 text-right font-medium text-slate-900">{working.interestRate}%</td>
              </tr>
            ) : null}
            <CapitalWorkingRow label="Interest on Loan" amount={working.interestOnLoan} />
          </tbody>
        </table>
      </div>
    </ResultSection>
  );
}

function BalanceSheetTable({
  liabilities,
  assets,
  liabilityGroups,
  assetGroups,
  liabilityTotal,
  assetTotal,
}: {
  liabilities: FinalAccountLine[];
  assets: FinalAccountLine[];
  liabilityGroups?: FinalAccountsResult["balanceSheet"]["liabilityGroups"];
  assetGroups?: FinalAccountsResult["balanceSheet"]["assetGroups"];
  liabilityTotal: number;
  assetTotal: number;
}) {
  const groupedLiabilities = liabilityGroups ?? {
    capital: liabilities,
    nonCurrentLiabilities: [],
    currentLiabilities: [],
    otherLiabilities: [],
  };
  const groupedAssets = assetGroups ?? {
    fixedAssets: [],
    currentAssets: assets,
    otherAssets: [],
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GroupedBalanceSheetSide
        title="Liabilities"
        groups={[
          { title: "Capital", lines: groupedLiabilities.capital },
          { title: "Non-current Liabilities", lines: groupedLiabilities.nonCurrentLiabilities },
          { title: "Current Liabilities", lines: groupedLiabilities.currentLiabilities },
          { title: "Other Liabilities", lines: groupedLiabilities.otherLiabilities },
        ]}
        totalLabel="Total Liabilities"
        total={liabilityTotal}
      />
      <GroupedBalanceSheetSide
        title="Assets"
        groups={[
          { title: "Fixed Assets", lines: groupedAssets.fixedAssets },
          { title: "Current Assets", lines: groupedAssets.currentAssets },
          { title: "Other Assets", lines: groupedAssets.otherAssets },
        ]}
        totalLabel="Total Assets"
        total={assetTotal}
      />
    </div>
  );
}

function GroupedBalanceSheetSide({
  title,
  groups,
  totalLabel,
  total,
}: {
  title: string;
  groups: Array<{ title: string; lines: FinalAccountLine[] }>;
  totalLabel: string;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-bold text-blue-950">{title}</h3>
      <div className="mt-3 grid gap-3">
        {groups.map((group) => (
          <BalanceSheetGroup key={`balance-sheet-group-${title}-${group.title}`} title={group.title} lines={group.lines} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-950">
        <span>{totalLabel}</span>
        <span>Rs.{total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

function BalanceSheetGroup({ title, lines }: { title: string; lines: FinalAccountLine[] }) {
  if (!lines.length) return null;
  const subtotal = lines.reduce((total, line) => total + line.amount, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <h4 className="text-xs font-bold uppercase tracking-normal text-emerald-700">{title}</h4>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-100 bg-white">
        {lines.map((line, index) => (
          <div
            key={`balance-sheet-group-line-${title}-${line.account}-${line.amount}-${index}`}
            className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0"
          >
            <span className="font-medium text-blue-950">{line.account}</span>
            <span className="shrink-0 text-right font-medium text-slate-900">Rs.{line.amount.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800">
        <span>Subtotal</span>
        <span>Rs.{subtotal.toLocaleString("en-IN")}</span>
      </div>
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
      className={`rounded-2xl border px-4 py-4 shadow-sm ${
        agrees ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <div className="text-lg font-bold">{agrees ? "Balance Sheet agrees." : "Balance Sheet does not agree."}</div>
      {!agrees ? <p className="mt-2 text-sm font-semibold">Difference: Rs.{difference.toLocaleString("en-IN")}</p> : null}
      <div className="mt-3 grid gap-2 text-sm font-semibold sm:grid-cols-2">
        <div className="rounded-xl bg-white/80 px-3 py-2">Total liabilities Rs.{liabilityTotal.toLocaleString("en-IN")}</div>
        <div className="rounded-xl bg-white/80 px-3 py-2">Total assets Rs.{assetTotal.toLocaleString("en-IN")}</div>
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
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
            <th className="px-3 py-3 font-semibold">Account</th>
            <th className="px-3 py-3 font-semibold">Side</th>
            <th className="px-3 py-3 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((item, index) => (
              <tr key={`${keyPrefix}-${item.account}-${item.side}-${item.amount}-${index}`} className="border-b border-slate-100">
                <td className="px-3 py-3 font-bold text-blue-950">{item.account} A/c</td>
                <td className="px-3 py-3">
                  <SideBadge side={item.side} />
                </td>
                <td className="px-3 py-3 text-right font-medium text-slate-900">
                  Rs.{item.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-3 text-slate-500" colSpan={3}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ResultSection({
  title,
  children,
  summary,
  defaultOpenMobile = true,
  emphasis = false,
  tone = "default",
}: {
  title: string;
  children: ReactNode;
  summary?: string;
  defaultOpenMobile?: boolean;
  emphasis?: boolean;
  tone?: "default" | "warning";
}) {
  const [isOpen, setIsOpen] = useState(defaultOpenMobile);
  const sectionClass =
    tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : emphasis
        ? "border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white ring-2 ring-blue-100"
        : "border-slate-200 bg-white";

  return (
    <section className={`rounded-2xl border p-4 shadow-soft sm:p-6 ${sectionClass}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-between gap-3 text-left sm:pointer-events-none sm:min-h-0"
        aria-expanded={isOpen}
      >
        <span>
          <span className={emphasis ? "block text-xl font-bold text-blue-950" : "block text-lg font-bold text-blue-950"}>
            {title}
          </span>
          {summary ? <span className="mt-1 block text-sm font-semibold leading-5 text-slate-500">{summary}</span> : null}
        </span>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-lg font-bold text-blue-900 sm:hidden"
          aria-hidden="true"
        >
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div className={`mt-3 ${isOpen ? "block" : "hidden sm:block"}`}>{children}</div>
    </section>
  );
}

function formatGrossResult(result: FinalAccountsResult): string {
  if (result.tradingAccount.grossProfit > 0) {
    return `Gross Profit Rs.${result.tradingAccount.grossProfit.toLocaleString("en-IN")}`;
  }
  if (result.tradingAccount.grossLoss > 0) {
    return `Gross Loss Rs.${result.tradingAccount.grossLoss.toLocaleString("en-IN")}`;
  }
  return "No gross profit or loss";
}

function formatNetResult(result: FinalAccountsResult): string {
  if (result.profitAndLossAccount.netProfit > 0) {
    return `Net Profit Rs.${result.profitAndLossAccount.netProfit.toLocaleString("en-IN")}`;
  }
  if (result.profitAndLossAccount.netLoss > 0) {
    return `Net Loss Rs.${result.profitAndLossAccount.netLoss.toLocaleString("en-IN")}`;
  }
  return "No net profit or loss";
}

function formatBalanceSheetStatus(result: FinalAccountsResult): string {
  return result.balanceSheet.agrees ? "Balance Sheet agrees" : "Balance Sheet does not agree";
}

function TextList({ items, keyPrefix, numbered = false }: { items: string[]; keyPrefix: string; numbered?: boolean }) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
      {items.map((item, index) => (
        <li key={`${keyPrefix}-${index}`} className="flex gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3">
          {numbered ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
              {index + 1}
            </span>
          ) : null}
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SideBadge({ side }: { side: TrialBalanceBalance["side"] }) {
  const tone =
    side === "debit"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-blue-200 bg-blue-50 text-blue-800";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>{side === "debit" ? "Dr" : "Cr"}</span>;
}

function AdjustmentBadge({ type }: { type: FinalAccountAdjustment["type"] }) {
  const formattedType = formatAdjustmentType(type);
  const normalizedType = type.toLowerCase();
  const tone = normalizedType.includes("stock") || normalizedType.includes("goods")
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : normalizedType.includes("depreciation") || normalizedType.includes("provision")
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : normalizedType.includes("interest") || normalizedType.includes("commission")
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>{formattedType}</span>;
}

function IssueInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">{value}</p>
    </div>
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

function formatAdjustmentType(type: FinalAccountAdjustment["type"]): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatClaimStatus(status: NonNullable<FinalAccountAdjustment["claimStatus"]>): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatAdjustmentAmount(
  adjustment: FinalAccountAdjustment,
  managerCommissionWorking?: ManagerCommissionWorking,
): string {
  if (adjustment.type === "manager_commission" && managerCommissionWorking) {
    return `Rs.${managerCommissionWorking.commission.toLocaleString("en-IN")}`;
  }
  if (adjustment.amount !== undefined) return `Rs.${adjustment.amount.toLocaleString("en-IN")}`;
  return "-";
}

function formatReportInput(trialBalanceInput: string, adjustmentsInput: string): string {
  return ["Trial Balance:", trialBalanceInput || "Not provided", "", "Adjustments:", adjustmentsInput || "Not provided"].join(
    "\n",
  );
}
