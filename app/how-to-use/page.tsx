import Link from "next/link";
import type { ReactNode } from "react";

const badges = ["Beginner friendly", "Commerce students", "Step-by-step learning", "Full accounting workflow"];

const workflowSteps = ["Transaction", "Journal Entry", "Ledger", "Trial Balance", "Final Accounts"];

const checkerSteps = [
  "Open Learning Tools.",
  "Choose Journal Entry Checker.",
  "Enter the business transaction.",
  "Enter your journal entry.",
  "Click Check My Journal Entry.",
  "Review score, correct entry, mistake, and explanation.",
];

const explainerSteps = [
  "Open AI Journal Entry Explainer.",
  "Enter a business transaction.",
  "Click Explain Journal Entry.",
  "Read Final Journal Entry, Affected Accounts, Step-by-step Logic, and Common Mistakes.",
];

const practiceSteps = [
  "Open Learning Tools.",
  "Choose Practice Questions.",
  "Try solving the question first.",
  "Check your answer.",
  "Retry or try another question.",
];

const reportSteps = [
  "Click Report Wrong Answer or Report Issue.",
  "Select issue type.",
  "Write expected answer or comment.",
  "Check Report Preview.",
  "Click Copy Report.",
  "Send the copied report to the developer or tester.",
];

const learningPath = [
  "Use Explainer to understand one transaction.",
  "Use Checker to test your own answer.",
  "Use Practice to build confidence.",
  "Use Ledger to see account-wise posting.",
  "Use Trial Balance to check debit-credit totals.",
  "Use Final Accounts to understand complete accounting results.",
];

const inputRules = [
  {
    title: "Mention amount clearly",
    good: ["Bought goods for cash Rs.10000"],
  },
  {
    title: "Use Dr. and To in journal entries",
    good: ["Purchases A/c Dr. Rs.10000", "To Cash A/c Rs.10000"],
  },
  {
    title: "Mention GST rate for GST-inclusive amounts",
    good: ["Purchased goods Rs.11800 including GST 18% for cash"],
    notEnough: ["Purchased goods Rs.11800 including GST for cash"],
  },
  {
    title: "For final accounts, write one balance per line",
    good: ["Purchases A/c Dr Rs.20000", "Sales A/c Cr Rs.40000"],
  },
  {
    title: "For adjustments, write one adjustment per line",
    good: ["Closing stock Rs.10000", "Salary outstanding Rs.3000"],
  },
];

const firstTryCards = [
  {
    title: "Beginner",
    text: "Bought goods for cash Rs.10000",
  },
  {
    title: "Expense",
    text: "Paid rent Rs.5000 in cash",
  },
  {
    title: "GST",
    text: "Sold goods Rs.10000 plus GST 18% for cash",
  },
  {
    title: "Ledger",
    text: "Cash A/c Dr. Rs.50000\nTo Capital A/c Rs.50000",
  },
  {
    title: "Final Accounts",
    text: "Use the sample final accounts input above.",
  },
];

const ledgerExample = `Cash A/c Dr. Rs.50000
To Capital A/c Rs.50000

Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000

Rent A/c Dr. Rs.3000
To Cash A/c Rs.3000`;

const trialBalanceExpected = `Cash Dr Rs.37000
Purchases Dr Rs.10000
Rent Dr Rs.3000
Capital Cr Rs.50000

Debit total Rs.50000
Credit total Rs.50000`;

const finalAccountsTrialBalance = `Capital A/c Cr Rs.135000
Drawings A/c Dr Rs.12000
Cash A/c Dr Rs.25000
Bank A/c Dr Rs.60000
Debtors A/c Dr Rs.35000
Creditors A/c Cr Rs.30000
Loan A/c Cr Rs.70000
Machinery A/c Dr Rs.90000
Furniture A/c Dr Rs.30000
Computer A/c Dr Rs.20000
Purchases A/c Dr Rs.70000
Sales A/c Cr Rs.150000
Salary A/c Dr Rs.16000
Rent A/c Dr Rs.9000
Insurance A/c Dr Rs.7000
Commission Received A/c Cr Rs.5000
Output GST A/c Cr Rs.9000
Input GST A/c Dr Rs.8000`;

const finalAccountsAdjustments = `Closing stock Rs.30000
Salary outstanding Rs.4000
Prepaid insurance Rs.2000
Interest accrued Rs.1500
Rent received in advance Rs.2000
Depreciation on machinery Rs.9000
Depreciation on furniture Rs.3000
Depreciation on computer Rs.2000`;

export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-white px-4 py-5 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />
        <StartHere />

        <GuideSection
          eyebrow="Checker"
          title="1. Check Your Journal Entry"
          body="Use this when you already tried writing the journal entry and want to check if it is correct."
          cta={{ label: "Open Tools", href: "/tools" }}
        >
          <StepList steps={checkerSteps} />
          <ExampleBlock
            title="Example"
            content={`Transaction:
Bought goods for cash Rs.10000

Journal Entry:
Purchases A/c Dr. Rs.10000
To Cash A/c Rs.10000`}
          />
        </GuideSection>

        <GuideSection
          eyebrow="Explainer"
          title="2. Understand the Logic"
          body="Use the Explainer when you do not understand why an account is debited or credited."
          cta={{ label: "Try Explainer", href: "/journal-entry-solver" }}
        >
          <StepList steps={explainerSteps} />
          <ExampleBlock
            title="Example"
            content={`Paid rent Rs.5000 in cash

Expected idea:
Rent is an expense, so Rent A/c is debited.
Cash decreases, so Cash A/c is credited.`}
          />
        </GuideSection>

        <GuideSection
          eyebrow="Practice"
          title="3. Practice Journal Entries"
          body="Use Practice when you want to solve questions without choosing your own transaction."
          cta={{ label: "Open Practice", href: "/tools" }}
        >
          <StepList steps={practiceSteps} />
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-950">
            Tip: Do not click answer immediately. Try solving first.
          </div>
        </GuideSection>

        <GuideSection
          eyebrow="Ledger"
          title="4. Generate Ledger Accounts"
          body="Use Ledger Posting after you understand journal entries. It shows how journal entries are posted into individual accounts."
          cta={{ label: "Open Ledger Posting", href: "/ledger" }}
        >
          <ExampleBlock title="Input example" content={ledgerExample} />
          <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-950">
            Expected: Cash, Capital, Purchases, and Rent ledgers will be created with debit/credit postings and
            balances.
          </p>
        </GuideSection>

        <GuideSection
          eyebrow="Trial Balance"
          title="5. Prepare Trial Balance"
          body="Use Trial Balance after ledger posting. It lists debit and credit balances and checks whether totals match."
          cta={{ label: "Open Trial Balance", href: "/trial-balance" }}
        >
          <ExampleBlock title="Use the same journal entries from Ledger" content={ledgerExample} />
          <ExampleBlock title="Expected" content={trialBalanceExpected} />
        </GuideSection>

        <GuideSection
          eyebrow="Final Accounts"
          title="6. Prepare Final Accounts"
          body="Use Final Accounts to prepare Trading A/c, Profit & Loss A/c, Balance Sheet, and selected adjustments."
          cta={{ label: "Open Final Accounts", href: "/final-accounts" }}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ExampleBlock title="Trial Balance example" content={finalAccountsTrialBalance} />
            <ExampleBlock title="Adjustments example" content={finalAccountsAdjustments} />
          </div>
        </GuideSection>

        <GuideSection
          eyebrow="Feedback"
          title="7. Report a Wrong or Confusing Answer"
          body="If the answer looks wrong or confusing, use the Report Wrong Answer or Report Issue button."
        >
          <StepList steps={reportSteps} />
          <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-950">
            The report includes transaction, student answer, app result, expected comment, and timestamp.
          </p>
        </GuideSection>

        <LearningPath />
        <InputRules />
        <TryFirst />
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
        <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
          Learn
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/supported-transactions" className="text-blue-800 transition hover:text-blue-950">
          Supported Topics
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Student guide</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">How to Use Accywise</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Learn how to check journal entries, understand accounting logic, generate ledgers, prepare trial balance, and
          create final accounts step by step.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          Start with simple transactions, then move toward the full accounting workflow.
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

function StartHere() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Start Here</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">Start with one simple transaction</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            If you are new, begin with a simple transaction like{" "}
            <code className="rounded-md bg-slate-100 px-1.5 py-1 text-sm text-blue-950">
              Bought goods for cash Rs.10000
            </code>
            . First understand the journal entry, then move to ledger, trial balance, and final accounts.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/learn"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Open Learn
            </Link>
            <Link
              href="/tools"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
            >
              Open Learning Tools
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="mt-3 text-sm font-bold leading-5 text-blue-950">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideSection({
  eyebrow,
  title,
  body,
  cta,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">{title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{body}</p>
          {cta ? (
            <Link
              href={cta.href}
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
        <div className="grid gap-4">{children}</div>
      </div>
    </section>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function ExampleBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
      <h3 className="text-sm font-bold text-blue-950">{title}</h3>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-sm leading-6 text-slate-800">
        {content}
      </pre>
    </div>
  );
}

function LearningPath() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-7">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Best Way to Learn</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">Best learning path</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {learningPath.map((step, index) => (
          <div key={step} className="rounded-2xl border border-blue-100 bg-white p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
              {index + 1}
            </span>
            <p className="mt-4 text-sm font-semibold leading-6 text-blue-950">{step}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold leading-6 text-emerald-950">
        Do not try everything at once. Master one step, then move to the next.
      </p>
    </section>
  );
}

function InputRules() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Common Input Rules</p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-blue-950">Write inputs clearly</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {inputRules.map((rule, index) => (
          <article key={rule.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold text-blue-950">{rule.title}</h3>
            <div className="mt-3 grid gap-2">
              {rule.good.map((example) => (
                <code key={example} className="rounded-lg bg-white px-3 py-2 text-sm leading-6 text-slate-800">
                  Good: {example}
                </code>
              ))}
              {rule.notEnough?.map((example) => (
                <code key={example} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                  Not enough: {example}
                </code>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TryFirst() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-950 p-5 text-white shadow-soft sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-200">What To Try First</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Try these first</h2>
          <Link
            href="/tools"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-950 transition hover:bg-blue-50"
          >
            Open Learning Tools
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {firstTryCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-6 text-blue-50">{card.text}</pre>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
