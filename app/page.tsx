import Link from "next/link";

const heroBadges = ["Class 11 & 12", "B.Com Basics", "Indian Accountancy Format", "Step-by-step learning"];

const valuePoints = [
  "Learn the logic, not just answers",
  "Practice with instant correction",
  "Understand mistakes clearly",
  "Move from Journal to Final Accounts",
];

const struggleCards = [
  "Debit and Credit feel confusing",
  "Journal entries are hard to check alone",
  "Ledger and Trial Balance feel disconnected",
  "Final Accounts adjustments are difficult",
];

const audienceCards = [
  "Class 11 Commerce",
  "Class 12 Commerce",
  "B.Com Beginners",
  "Accountancy Teachers and Tutors",
];

const learningFlow = ["Transaction", "Journal", "Ledger", "Trial Balance", "Final Accounts"];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-blue-950">
            Accywise
          </Link>
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <Link href="/dashboard" className="transition hover:text-blue-900">
              Dashboard
            </Link>
            <Link href="/tools" className="transition hover:text-blue-900">
              Tools
            </Link>
            <Link href="/supported-transactions" className="transition hover:text-blue-900">
              Supported Topics
            </Link>
            <Link href="/how-to-use" className="transition hover:text-blue-900">
              How to Use
            </Link>
          </div>
          <Link
            href="/tools"
            className="inline-flex min-h-10 items-center rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800"
          >
            Start Learning
          </Link>
        </nav>
      </header>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1120px] gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Accountancy learning platform</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-normal text-blue-950 sm:text-6xl">
              Master Accountancy with Step-by-Step AI Guidance
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              Learn journal entries, ledgers, trial balance, final accounts, and adjustments with beginner-friendly
              explanations built for commerce students.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-base font-bold text-white shadow-soft transition hover:bg-blue-800"
              >
                Start Learning
              </Link>
              <Link
                href="/journal-entry-solver"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-3 text-base font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Try Explainer
              </Link>
            </div>
          </div>

          <HeroMockCard />
        </div>
      </section>

      <section className="border-y border-blue-100 bg-blue-50/70 px-4 py-5 sm:px-6">
        <div className="mx-auto grid w-full max-w-[1120px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {valuePoints.map((point) => (
            <div key={point} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-blue-950 shadow-sm">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionHeader
            eyebrow="The problem"
            title="Why students struggle with Accountancy"
            body="The subject becomes easier when every rule is tied to a visible accounting step."
          />
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {struggleCards.map((card) => (
              <article key={card} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="h-10 w-10 rounded-xl bg-amber-100 ring-8 ring-amber-50" />
                <h3 className="mt-5 text-lg font-bold text-blue-950">{card}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionHeader
            eyebrow="The solution"
            title="A complete accountancy learning flow"
            body="Accywise helps students understand how every accounting step connects to the next."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {learningFlow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-blue-950">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1120px]">
          <SectionHeader
            eyebrow="Who it is for"
            title="Built for commerce learners and teachers"
            body="A focused practice space for students learning the foundations and teachers helping them get unstuck."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audienceCards.map((card) => (
              <article key={card} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <h3 className="text-lg font-bold text-emerald-950">{card}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-800 p-6 text-white shadow-soft sm:p-10 lg:max-w-[1120px]">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">Start with one transaction today</h2>
            <p className="mt-4 text-base leading-7 text-blue-50">
              Use the tools to check, understand, and practice accountancy step by step.
            </p>
            <Link
              href="/tools"
              className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-5 py-3 text-base font-bold text-blue-950 transition hover:bg-blue-50"
            >
              Open Learning Tools
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-bold text-blue-950">Accywise</div>
            <p className="mt-1">Built for commerce students</p>
          </div>
          <div className="flex flex-wrap gap-4 font-semibold text-slate-700">
            <Link href="/dashboard" className="hover:text-blue-900">
              Dashboard
            </Link>
            <Link href="/tools" className="hover:text-blue-900">
              Tools
            </Link>
            <Link href="/supported-transactions" className="hover:text-blue-900">
              Supported Topics
            </Link>
            <Link href="/how-to-use" className="hover:text-blue-900">
              How to Use
            </Link>
            <Link href="/final-accounts" className="hover:text-blue-900">
              Final Accounts
            </Link>
            <span>Report issues through the app</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroMockCard() {
  return (
    <aside className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-4 shadow-soft sm:p-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-emerald-700">Live learning preview</p>
            <h2 className="mt-1 text-lg font-bold text-blue-950">Journal Entry Logic</h2>
          </div>
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">100% Match</div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500">Sample transaction</p>
          <p className="mt-1 text-sm font-bold text-blue-950">Bought goods for cash Rs.10000</p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-blue-100">
          <table className="w-full min-w-[320px] border-collapse text-sm">
            <thead>
              <tr className="bg-blue-950 text-left text-white">
                <th className="px-3 py-2 font-semibold">Particulars</th>
                <th className="px-3 py-2 text-right font-semibold">Debit ₹</th>
                <th className="px-3 py-2 text-right font-semibold">Credit ₹</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-50">
                <td className="px-3 py-3 font-semibold text-blue-950">Purchases A/c Dr.</td>
                <td className="px-3 py-3 text-right font-semibold">10,000</td>
                <td className="px-3 py-3 text-right text-slate-400">-</td>
              </tr>
              <tr>
                <td className="px-3 py-3 pl-6 font-semibold text-blue-950">To Cash A/c</td>
                <td className="px-3 py-3 text-right text-slate-400">-</td>
                <td className="px-3 py-3 text-right font-semibold">10,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-2">
          <PreviewStep number="1" text="Identify Purchases A/c as goods bought for resale." />
          <PreviewStep number="2" text="Debit Purchases because expenses increase." />
          <PreviewStep number="3" text="Credit Cash because money goes out." />
        </div>
      </div>
    </aside>
  );
}

function PreviewStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
        {number}
      </span>
      <span>{text}</span>
    </div>
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
