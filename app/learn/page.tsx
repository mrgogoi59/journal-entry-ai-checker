import Link from "next/link";

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
      { title: "Introduction to Accounting", status: "coming_soon" },
      { title: "Theory Base of Accounting", status: "coming_soon" },
      { title: "Accounting Principles and Concepts", status: "coming_soon" },
      { title: "Rules of Debit and Credit", href: "/learn/rules-of-debit-and-credit", status: "available" },
      { title: "Journal Entry Basics", href: "/learn/journal-entry-basics", status: "available" },
      { title: "Recording of Transactions", status: "coming_soon" },
      { title: "Source Documents and Vouchers", status: "coming_soon" },
      { title: "Cash Book", status: "coming_soon" },
      { title: "Subsidiary Books", status: "coming_soon" },
      { title: "Ledger Posting", status: "coming_soon" },
      { title: "Trial Balance", status: "coming_soon" },
      { title: "Bank Reconciliation Statement", status: "coming_soon" },
      { title: "Rectification of Errors", status: "coming_soon" },
      { title: "Depreciation, Provisions and Reserves", status: "coming_soon" },
      { title: "Bills of Exchange", status: "coming_soon" },
      { title: "Financial Statements of Sole Proprietorship", status: "coming_soon" },
      { title: "Accounts from Incomplete Records", status: "coming_soon" },
    ],
  },
  {
    title: "Final Accounts and Adjustments",
    topics: [
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
      { title: "Accounting for Not-for-Profit Organisations", status: "coming_soon" },
      { title: "Partnership Accounts: Basic Concepts", status: "coming_soon" },
      { title: "Profit and Loss Appropriation Account", status: "coming_soon" },
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

export default function LearnPage() {
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
          <article className="relative w-full overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-7 shadow-soft sm:p-12 lg:p-16">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-emerald-500 to-blue-800" />
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-normal text-blue-950 sm:text-6xl">
                Hi, I&apos;m AccyWise.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 sm:text-xl">
                I&apos;ll help you learn Accountancy step by step.
              </p>

              <details className="group relative mt-8">
                <summary className="inline-flex min-h-12 cursor-pointer list-none items-center justify-center rounded-xl bg-blue-900 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 [&::-webkit-details-marker]:hidden">
                  Topics
                  <span className="ml-3 text-base leading-none transition group-open:rotate-180">v</span>
                </summary>

                <section className="mt-4 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white/95 shadow-soft backdrop-blur">
                  <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-4 sm:px-5">
                    <h2 className="text-xl font-bold text-blue-950">Choose an accounting topic</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      More lessons will be added step by step.
                    </p>
                  </div>

                  <div className="max-h-[min(62vh,36rem)] overflow-y-auto px-4 py-4 sm:px-5">
                    <div className="grid gap-5">
                      {topicGroups.map((group) => (
                        <section key={group.title}>
                          <h3 className="text-sm font-bold uppercase tracking-normal text-emerald-700">
                            {group.title}
                          </h3>
                          <div className="mt-3 grid gap-2">
                            {group.topics.map((topic) => (
                              <TopicRow key={`${group.title}-${topic.title}`} topic={topic} />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                </section>
              </details>
            </div>
          </article>
        </section>
      </section>
    </main>
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
