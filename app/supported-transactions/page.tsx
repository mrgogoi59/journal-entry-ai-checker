import Link from "next/link";

const badges = ["Journal Entries", "GST", "Ledger", "Trial Balance", "Final Accounts", "Beta learning tool"];

const supportedGroups = [
  {
    title: "Journal Entry Basics",
    description: "Core Class 11/12 style transactions with clear account, amount, party, and payment mode.",
    cta: { label: "Try Explainer", href: "/journal-entry-solver" },
    items: [
      "Simple cash and bank transactions",
      "Capital introduced",
      "Drawings in cash or bank",
      "Purchases and sales",
      "Purchases and sales with named parties",
      "Cash, bank, UPI, GPay, PhonePe, and NEFT treated as Bank where appropriate",
      "Debtor receipt and creditor payment",
      "Bank deposit and withdrawal",
      "Loan taken and repaid",
      "Rent and salary paid",
      "More common expenses paid in cash, bank, or digital mode",
      "Commission received",
      "Interest paid and received",
      "More common incomes received in cash, bank, or digital mode",
      "Partial goods purchase: part cash or bank, balance credit",
      "Partial goods sale: part cash or bank received, balance credit",
      "More asset purchases in cash, bank, digital mode, or credit",
      "Standalone installation, fitting, setup, freight, or carriage charges on fixed assets",
      "Fixed asset purchase plus installation-related charges in the same simple transaction",
      "Asset sales without GST, depreciation, or profit/loss calculation",
      "Asset sales with simple profit/loss calculation when book value and sale value are given",
      "Asset sales with accumulated depreciation using Asset Disposal A/c in simple controlled cases",
    ],
    examples: [
      "Bought goods for cash Rs.5000",
      "Sold goods to Raju Rs.5000",
      "Paid rent by UPI Rs.2000",
      "Received rent Rs.5000 in cash",
      "Purchased goods Rs.10000, paid Rs.4000 cash and balance on credit",
      "Sold goods Rs.10000, received Rs.4000 cash and balance on credit",
    ],
  },
  {
    title: "Adjustments and Special Entries",
    description: "Selected adjustment and special journal-entry cases used in beginner accountancy practice.",
    cta: { label: "Open Tools", href: "/tools" },
    items: [
      "Depreciation on machinery, furniture, computer, equipment, or vehicle",
      "Bad debts written off",
      "Bad debts recovered in cash, bank, or digital mode",
      "Outstanding expenses for salary, rent, wages, electricity, and insurance",
      "Prepaid expenses for rent, insurance, salary, wages, and electricity",
      "Accrued income for interest, commission, and rent",
      "Income received in advance for rent, commission, and interest",
      "Discount allowed or received in full-settlement debtor/creditor cases",
      "Goods withdrawn by proprietor or owner for personal use",
      "Goods distributed as free sample for advertisement or promotion",
      "Goods given as charity or donation",
      "Goods lost by fire, theft, accident, or damage without insurance claim",
      "Sales Return / goods returned by customer",
      "Purchase Return / goods returned to supplier",
    ],
    examples: [
      "Depreciation charged on machinery Rs.5000",
      "Salary outstanding Rs.6000",
      "Prepaid rent Rs.5000",
      "Bad debts recovered from Raju Rs.500 in cash",
      "Goods worth Rs.1000 distributed as free sample",
      "Goods returned by Raju Rs.1000",
    ],
  },
  {
    title: "GST Journal Entries",
    description: "Controlled GST cases for goods, selected services, returns, assets, and direct set-off/payment.",
    cta: { label: "Try Explainer", href: "/journal-entry-solver" },
    items: [
      "Basic GST on goods purchases and sales plus GST and GST-inclusive amounts with GST rate",
      "CGST/SGST and IGST split on goods purchases and sales with clear tax rates or amounts, including GST-inclusive split with rates",
      "GST with trade discount on goods purchases and sales when trade discount is deducted before GST",
      "GST on fixed asset purchases: plus GST, GST-inclusive amount with GST rate, and CGST/SGST or IGST plus GST",
      "GST on selected expenses: legal charges, repairs, advertisement, freight, carriage, printing and stationery, telephone, internet, office expenses, and professional fees",
      "GST on selected income/service receipts: service income, consultancy fees, professional fees received, tuition fees, royalty, and rent",
      "GST with simple sales return and purchase return without refund",
      "Simple direct GST set-off and GST payment through bank",
    ],
    examples: [
      "Purchased goods Rs.10000 plus GST 18% for cash",
      "Sold goods Rs.11800 including GST 18% for cash",
      "Purchased goods Rs.10000 plus CGST 9% and SGST 9% for cash",
      "Paid legal charges Rs.10000 plus GST 18% through bank",
      "Goods returned to Amit Rs.1000 plus GST 18%",
      "Set off Input GST Rs.5000 against Output GST Rs.8000",
    ],
  },
  {
    title: "Accounting Workflow Tools",
    description: "Move from entries to account-wise posting, arithmetic checking, and selected final accounts.",
    cta: { label: "Open Tools", href: "/tools" },
    items: [
      "Ledger Posting",
      "Trial Balance",
      "Final Accounts",
      "Balance Sheet",
      "Selected final accounts adjustments",
      "Trading A/c and Profit & Loss A/c from trial balance balances",
    ],
    examples: [
      "Enter journal entries into Ledger Posting",
      "Prepare Trial Balance from ledger balances",
      "Prepare Trading A/c, Profit & Loss A/c, and Balance Sheet",
    ],
  },
];

const finalAccountsAdjustments = [
  "Closing stock",
  "Outstanding expenses",
  "Prepaid expenses",
  "Accrued income",
  "Income received in advance",
  "Depreciation",
  "Provision for doubtful debts",
  "Further bad debts",
  "Provision for discount on debtors",
  "Provision for discount on creditors",
  "Manager's commission",
  "Goods withdrawn by proprietor",
  "Goods distributed as free sample",
  "Goods given as charity",
  "Goods lost by fire/theft",
  "Goods lost by fire with insurance claim",
  "Interest on capital",
  "Interest on drawings",
  "Interest on loan",
];

const writingTips = [
  {
    title: "Mention the amount clearly",
    examples: ["Bought goods for cash Rs.10000"],
  },
  {
    title: "Mention payment mode if needed",
    examples: ["Paid rent Rs.5000 in cash", "Paid rent Rs.5000 through bank", "Paid rent Rs.5000 by UPI"],
  },
  {
    title: "For GST-inclusive entries, mention GST rate",
    examples: [
      "Correct: Purchased goods Rs.11800 including GST 18% for cash",
      "Not enough: Purchased goods Rs.11800 including GST for cash",
    ],
  },
  {
    title: "For final accounts, write one balance per line",
    examples: ["Purchases A/c Dr Rs.20000", "Sales A/c Cr Rs.40000"],
  },
  {
    title: "For adjustments, write one adjustment per line",
    examples: ["Closing stock Rs.10000", "Salary outstanding Rs.3000"],
  },
];

const unsupportedGroups = [
  {
    title: "Advanced GST",
    items: [
      "GST inclusive amount without GST rate",
      "CGST/SGST/IGST inclusive amount without tax rate",
      "GST-inclusive CGST/SGST/IGST split for fixed assets",
      "GST refund from government",
      "Complex GST refunds",
      "Cross-utilisation beyond current direct matching",
      "GST interest or penalty",
      "GSTR filing",
      "Complex GST ledger adjustment",
      "GST with unsupported final accounts adjustments",
      "GST on salary, wages, rent, interest, or commission",
      "GST on interest, dividend, discount received, miscellaneous income, bad debts recovered, capital receipts, or loan receipts",
      "GST with full-settlement discount allowed or received",
      "GST-inclusive amount with trade discount",
      "Multiple discounts with GST",
      "GST-inclusive CGST/SGST/IGST on expenses",
      "GST-inclusive CGST/SGST/IGST on incomes",
      "GST on unsupported income categories",
      "GST on unsupported expenses",
      "Installation charges with GST",
      "Asset purchase plus installation charges plus GST",
      "GST on asset sales",
      "GST-inclusive returns",
    ],
  },
  {
    title: "Advanced Final Accounts",
    items: [
      "Detailed schedules",
      "Company accounts",
      "Partnership accounts",
      "Complex partnership or company accounts",
      "Date-wise interest on drawings",
      "Average capital/drawings calculation",
      "Full stock ledger schedules",
      "Full final accounts treatment beyond the selected sole proprietorship format",
      "Broad final account adjustments",
      "Opening balances workflow",
    ],
  },
  {
    title: "Advanced Accounting Areas",
    items: [
      "Bank reconciliation statement",
      "Rectification of errors",
      "Partnership appropriation accounts",
      "Company issue of shares/debentures",
      "Compound expense payments",
      "Compound income receipts",
      "Expense payments with discount or settlement",
      "Income receipts with discount or settlement beyond supported cases",
      "Asset purchase with installation paid using different modes",
      "Repairs or maintenance to assets as capitalization",
      "Asset purchases with partial payment and balance credit beyond supported simple cases",
      "Asset sales with partial payment and balance credit",
      "Asset sale without cost or book value",
      "Asset sale without accumulated depreciation amount in disposal cases",
      "Multiple asset disposal",
      "Revaluation reserve",
      "Insurance claim on asset sale",
      "Provision-related discounts",
      "Broad settlement and ledger treatment beyond the journal entry",
      "Trade discount in invoice unless the wording matches supported trade-discount cases",
      "Insurance claim on goods lost by fire in journal-entry checker",
      "Returns with cash or bank refund",
      "Returns with discount",
      "Returns with settlement",
      "Stock or inventory treatment for returns",
      "Complex recovery with provision adjustment",
      "Ledger treatment after bad debt recovery",
      "Broad compound entries",
    ],
  },
  {
    title: "Product Features Not Added Yet",
    items: ["Login", "Dashboard", "Attempt history", "AI Tutor", "Database storage"],
  },
];

export default function SupportedTransactionsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <section>
          <SectionHeader
            eyebrow="Supported now"
            title="What Accywise can currently handle"
            body="These grouped cards cover the main supported transaction and workflow areas."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {supportedGroups.map((group) => (
              <SupportedGroupCard key={group.title} group={group} />
            ))}
          </div>
        </section>

        <FinalAccountsSupport />

        <section>
          <SectionHeader
            eyebrow="Input quality"
            title="How to write better transactions"
            body="Clear wording helps the rule-based checker solve the transaction safely."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {writingTips.map((tip, index) => (
              <WritingTipCard key={tip.title} tip={tip} index={index + 1} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Roadmap"
            title="Not supported yet"
            body="These areas are not errors. They are advanced cases or product features that are still being improved."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {unsupportedGroups.map((group) => (
              <UnsupportedGroupCard key={group.title} group={group} />
            ))}
          </div>
        </section>

        <ReportGuidance />
      </section>
    </main>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
        <Link href="/" className="text-blue-800 transition hover:text-blue-950">
          Back to Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Learning Tools
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/journal-entry-solver" className="text-blue-800 transition hover:text-blue-950">
          Start Explainer
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Accywise guide</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">Supported Topics</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          See what Accywise can currently solve, explain, and check, and what is still being improved.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          This page helps you write transactions in a format the app can safely understand.
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

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
    </div>
  );
}

function SupportedGroupCard({ group }: { group: (typeof supportedGroups)[number] }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div>
        <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Supported now</p>
        <h3 className="mt-2 text-2xl font-bold text-blue-950">{group.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{group.description}</p>
      </div>
      <ul className="mt-5 grid gap-2 text-sm leading-6 text-slate-700">
        {group.items.map((item) => (
          <li key={item} className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 font-medium">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">Examples</p>
        <div className="mt-2 grid gap-2">
          {group.examples.map((example) => (
            <code key={example} className="rounded-lg bg-white px-3 py-2 text-sm leading-6 text-slate-800">
              {example}
            </code>
          ))}
        </div>
      </div>
      <Link
        href={group.cta.href}
        className="mt-5 inline-flex min-h-11 w-fit items-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
      >
        {group.cta.label}
      </Link>
    </article>
  );
}

function FinalAccountsSupport() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Final Accounts support</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">Final Accounts support</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Accywise can prepare Trading A/c, Profit & Loss A/c, and a simple sole proprietorship Balance Sheet from
            trial balance balances.
          </p>
          <Link
            href="/final-accounts"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Open Final Accounts
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {finalAccountsAdjustments.map((adjustment) => (
            <div key={adjustment} className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-blue-950">
              {adjustment}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingTipCard({ tip, index }: { tip: (typeof writingTips)[number]; index: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
        {index}
      </span>
      <h3 className="mt-4 text-lg font-bold text-blue-950">{tip.title}</h3>
      <div className="mt-3 grid gap-2">
        {tip.examples.map((example) => (
          <code key={example} className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-800">
            {example}
          </code>
        ))}
      </div>
    </article>
  );
}

function UnsupportedGroupCard({ group }: { group: (typeof unsupportedGroups)[number] }) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-normal text-amber-700">Not supported yet</p>
      <h3 className="mt-2 text-2xl font-bold text-amber-950">{group.title}</h3>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-800">
        {group.items.map((item) => (
          <li key={item} className="rounded-xl border border-amber-100 bg-white px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ReportGuidance() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-950 p-5 text-white shadow-soft sm:p-7">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-200">Feedback</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Found a wrong or confusing answer?</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">
            Use the Report Wrong Answer button inside the app. It copies the transaction, your answer, app result, and
            your comment so you can send it to the developer or tester. Please include a screenshot if possible.
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-950 transition hover:bg-blue-50"
        >
          Open Learning Tools
        </Link>
      </div>
    </section>
  );
}
