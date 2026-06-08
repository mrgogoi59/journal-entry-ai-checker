"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LearningTopic = {
  title: string;
  href?: string;
  status: "available" | "coming_soon";
};

type TopicGroup = {
  title: string;
  topics: LearningTopic[];
};

const topicGroups: TopicGroup[] = [
  {
    title: "Foundations",
    topics: [
      { title: "Introduction to Accounting", href: "/learn/introduction-to-accounting", status: "available" },
      { title: "Theory Base of Accounting", href: "/learn/theory-base-of-accounting", status: "available" },
      {
        title: "Accounting Principles and Concepts",
        href: "/learn/accounting-principles-and-concepts",
        status: "available",
      },
      { title: "Recording of Transactions", href: "/learn/recording-of-transactions", status: "available" },
      {
        title: "Source Documents and Vouchers",
        href: "/learn/source-documents-and-vouchers",
        status: "available",
      },
      { title: "Rules of Debit and Credit", href: "/learn/rules-of-debit-and-credit", status: "available" },
      { title: "Journal Entry Basics", href: "/learn/journal-entry-basics", status: "available" },
      { title: "Cash Book", href: "/learn/cash-book", status: "available" },
      {
        title: "Bank Reconciliation Statement",
        href: "/learn/bank-reconciliation-statement",
        status: "available",
      },
      { title: "Subsidiary Books", href: "/learn/subsidiary-books", status: "available" },
      { title: "GST Journal Entries", href: "/learn/gst-journal-entries", status: "available" },
      { title: "Ledger Posting Basics", href: "/learn/ledger-posting-basics", status: "available" },
      { title: "Trial Balance Basics", href: "/learn/trial-balance-basics", status: "available" },
      { title: "Rectification of Errors", href: "/learn/rectification-of-errors", status: "available" },
      { title: "Bills of Exchange", href: "/learn/bills-of-exchange", status: "available" },
      {
        title: "Depreciation, Provisions and Reserves",
        href: "/learn/depreciation-provisions-and-reserves",
        status: "available",
      },
      { title: "Final Accounts Basics", href: "/learn/final-accounts-basics", status: "available" },
      { title: "Financial Statements of Sole Proprietorship", status: "coming_soon" },
    ],
  },
  {
    title: "Final Accounts and Adjustments",
    topics: [
      {
        title: "Adjustments in Final Accounts",
        href: "/learn/adjustments-in-final-accounts",
        status: "available",
      },
      {
        title: "Accounts from Incomplete Records",
        href: "/learn/accounts-from-incomplete-records",
        status: "available",
      },
      { title: "Trading Account", status: "coming_soon" },
      { title: "Profit and Loss Account", status: "coming_soon" },
      { title: "Balance Sheet", status: "coming_soon" },
      { title: "Closing Stock", status: "coming_soon" },
      { title: "Outstanding and Prepaid Expenses", status: "coming_soon" },
      { title: "Accrued Income and Income Received in Advance", status: "coming_soon" },
      { title: "Provision for Doubtful Debts", status: "coming_soon" },
      { title: "Goods Adjustments", status: "coming_soon" },
      { title: "Manager's Commission", status: "coming_soon" },
      { title: "Interest Adjustments", status: "coming_soon" },
    ],
  },
  {
    title: "Non-Profit and Partnership",
    topics: [
      {
        title: "Accounting for Not-for-Profit Organisations",
        href: "/learn/accounting-for-not-for-profit-organisations",
        status: "available",
      },
      {
        title: "Partnership Accounts: Basic Concepts",
        href: "/learn/partnership-accounts-basic-concepts",
        status: "available",
      },
      {
        title: "Profit and Loss Appropriation Account",
        href: "/learn/profit-and-loss-appropriation-account",
        status: "available",
      },
      { title: "Fixed and Fluctuating Capital Accounts", status: "coming_soon" },
      { title: "Admission of a Partner", status: "coming_soon" },
      { title: "Retirement or Death of a Partner", status: "coming_soon" },
      { title: "Dissolution of Partnership Firm", status: "coming_soon" },
    ],
  },
  {
    title: "Company Accounts",
    topics: [
      { title: "Accounting for Share Capital", status: "coming_soon" },
      { title: "Calls in Arrears and Calls in Advance", status: "coming_soon" },
      { title: "Forfeiture and Reissue of Shares", status: "coming_soon" },
      { title: "Issue and Redemption of Debentures", status: "coming_soon" },
      { title: "Financial Statements of a Company", status: "coming_soon" },
    ],
  },
  {
    title: "Analysis and Cash Flow",
    topics: [
      { title: "Analysis of Financial Statements", status: "coming_soon" },
      { title: "Comparative Statements", status: "coming_soon" },
      { title: "Common Size Statements", status: "coming_soon" },
      { title: "Accounting Ratios", status: "coming_soon" },
      { title: "Cash Flow Statement", status: "coming_soon" },
    ],
  },
  {
    title: "Computerised Accounting",
    topics: [
      { title: "Computerised Accounting System", status: "coming_soon" },
      { title: "Accounting Database and Reports", status: "coming_soon" },
    ],
  },
];

const availableTopics = topicGroups.flatMap((group) => group.topics.filter((topic) => topic.status === "available"));
const roadmapSteps = ["Foundations", "Journal Entries", "Ledger", "Trial Balance", "Final Accounts"];

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredGroups = useMemo(() => {
    if (!normalizedSearch) return topicGroups;

    return topicGroups
      .map((group) => ({
        ...group,
        topics: group.topics.filter((topic) => topic.title.toLowerCase().includes(normalizedSearch)),
      }))
      .filter((group) => group.topics.length > 0);
  }, [normalizedSearch]);

  const filteredAvailableTopics = useMemo(() => {
    if (!normalizedSearch) return availableTopics;
    return availableTopics.filter((topic) => topic.title.toLowerCase().includes(normalizedSearch));
  }, [normalizedSearch]);

  return (
    <main className="min-h-screen bg-white px-4 py-5 pb-32 text-ink sm:px-6 sm:py-8 lg:pb-8">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-[1120px] flex-col">
        <header className="flex items-center justify-between gap-4 py-2">
          <Link href="/" className="text-lg font-bold tracking-normal text-blue-950">
            Accywise
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-blue-800 sm:flex">
            <Link href="/practice" className="transition hover:text-blue-950">
              Practice
            </Link>
            <Link href="/tools" className="transition hover:text-blue-950">
              Tools
            </Link>
          </nav>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-950 sm:hidden">
            Topics
          </span>
        </header>

        <section className="flex flex-1 items-center py-10 sm:py-14">
          <article className="relative w-full overflow-hidden rounded-3xl border border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_46%,#ecfdf5_100%)] p-6 shadow-soft sm:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-emerald-500 to-blue-800" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,64,175,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-normal text-blue-950 sm:text-6xl">
                  Hi, I&apos;m AccyWise.
                </h1>
                <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 sm:text-xl">
                  I&apos;ll help you learn Accountancy step by step.
                </p>

                <details className="group relative mt-8">
                  <summary className="inline-flex min-h-14 cursor-pointer list-none items-center justify-center rounded-2xl bg-blue-900 px-6 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 [&::-webkit-details-marker]:hidden">
                    Topics
                    <span className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm leading-none transition group-open:rotate-180">
                      v
                    </span>
                  </summary>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                    Choose what you want to learn.
                  </p>

                  <section className="mt-5 w-full overflow-hidden rounded-3xl border border-blue-100 bg-white/95 shadow-soft backdrop-blur">
                    <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-4 sm:px-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-blue-950">Choose an accounting topic</h2>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                            More lessons will be added step by step.
                          </p>
                        </div>
                        <label className="block w-full lg:max-w-xs">
                          <span className="sr-only">Search topics</span>
                          <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search topics..."
                            className="min-h-11 w-full rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="max-h-[min(66vh,38rem)] overflow-y-auto px-4 py-4 pb-7 sm:px-5">
                      {filteredAvailableTopics.length > 0 ? (
                        <section>
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-normal text-emerald-700">
                              Available now
                            </h3>
                            <span className="text-xs font-bold text-slate-500">
                              {filteredAvailableTopics.length} ready
                            </span>
                          </div>
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            {filteredAvailableTopics.map((topic) => (
                              <AvailableTopicCard key={topic.title} topic={topic} />
                            ))}
                          </div>
                        </section>
                      ) : null}

                      <div className="mt-6 grid gap-4">
                        {filteredGroups.length > 0 ? (
                          filteredGroups.map((group, index) => (
                            <section
                              key={group.title}
                              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                            >
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-normal text-blue-950">
                                  {group.title}
                                </h3>
                                <span className="text-xs font-bold text-slate-500">
                                  {index === 0 && !normalizedSearch ? "Start here" : `${group.topics.length} topics`}
                                </span>
                              </div>
                              <div className="mt-3 grid gap-2">
                                {group.topics.map((topic) => (
                                  <TopicRow key={`${group.title}-${topic.title}`} topic={topic} />
                                ))}
                              </div>
                            </section>
                          ))
                        ) : (
                          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-semibold leading-6 text-slate-600">
                            No topics found. Try another search.
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </details>
              </div>

              <aside className="hidden rounded-3xl border border-blue-100 bg-white/80 p-5 shadow-soft backdrop-blur lg:block">
                <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Your path</p>
                <div className="mt-5 grid gap-3">
                  {roadmapSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold leading-6 text-blue-950">{step}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function AvailableTopicCard({ topic }: { topic: LearningTopic }) {
  if (!topic.href) return null;

  return (
    <Link
      href={topic.href}
      className="group flex min-h-32 flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm transition hover:border-blue-200 hover:shadow-soft"
    >
      <div>
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          Available
        </span>
        <h4 className="mt-3 text-lg font-bold leading-7 text-blue-950">{topic.title}</h4>
      </div>
      <span className="mt-4 text-sm font-bold text-blue-800 transition group-hover:text-blue-950">Open Lesson</span>
    </Link>
  );
}

function TopicRow({ topic }: { topic: LearningTopic }) {
  const badge =
    topic.status === "available" ? (
      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
        Available
      </span>
    ) : (
      <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
        Coming soon
      </span>
    );

  const content = (
    <>
      <span className="min-w-0 text-sm font-bold leading-6 text-blue-950">{topic.title}</span>
      {badge}
    </>
  );

  if (topic.href) {
    return (
      <Link
        href={topic.href}
        className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 transition hover:border-blue-200 hover:bg-white"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-500"
    >
      <span className="min-w-0 text-sm font-bold leading-6 text-slate-500">{topic.title}</span>
      {badge}
    </div>
  );
}
