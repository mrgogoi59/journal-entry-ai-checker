import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-5 pb-28 text-ink sm:px-6 sm:py-8 lg:pb-8">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-[1120px] flex-col">
        <header className="flex items-center justify-between gap-4 py-2">
          <Link href="/" className="text-lg font-bold tracking-normal text-blue-950">
            Accywise
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-blue-800 sm:flex">
            <Link href="/learn" className="transition hover:text-blue-950">
              Learn
            </Link>
            <Link href="/practice" className="transition hover:text-blue-950">
              Practice
            </Link>
            <Link href="/tools" className="transition hover:text-blue-950">
              Tools
            </Link>
          </nav>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-950 sm:hidden">
            Dashboard
          </span>
        </header>

        <section className="flex flex-1 items-center py-10 sm:py-14">
          <article className="relative w-full overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-7 shadow-soft sm:p-12 lg:p-16">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-800 via-emerald-500 to-blue-800" />
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Start Learning</p>
              <h1 className="mt-4 text-4xl font-bold tracking-normal text-blue-950 sm:text-6xl">
                Hi, I&apos;m AccyWise.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 sm:text-xl">
                I&apos;ll help you learn Accountancy step by step.
              </p>
              <div className="mt-8">
                <Link
                  href="/learn"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-900 px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
