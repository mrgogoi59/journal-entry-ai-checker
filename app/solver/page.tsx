import type { Metadata } from "next";
import Link from "next/link";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { solverToolCatalog, type SolverToolCatalogItem } from "@/lib/learning-platform/solver-catalog";

export const metadata: Metadata = {
  title: "Solver | AccyWise AI",
  description: "Choose a Solver tool when you are stuck.",
};

const toolDescriptions = {
  "ai-journal-entry-explainer": "Explain debit and credit logic for journal entries.",
  "ledger-posting": "Convert journal entries into account-wise ledger views.",
  "trial-balance": "Generate a balanced debit and credit summary.",
  "final-accounts": "Prepare Trading, Profit & Loss, and Balance Sheet.",
  "bank-reconciliation-statement": "Reconcile Cash Book and Bank Statement balances.",
} satisfies Record<SolverToolCatalogItem["id"], string>;

export default function SolverPage() {
  return (
    <StudentAppShell activeItem="solver">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Solver</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Choose a tool when you are stuck.</p>
      </header>

      <section aria-labelledby="solver-tools-title" className="min-w-0">
        <h2 id="solver-tools-title" className="sr-only">
          Solver tools
        </h2>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {solverToolCatalog.map((tool) => (
            <SolverToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </StudentAppShell>
  );
}

function SolverToolCard({ tool }: { tool: SolverToolCatalogItem }) {
  return (
    <article
      aria-label={`${tool.title} solver tool`}
      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h3 className="text-lg font-black text-slate-950">{tool.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{toolDescriptions[tool.id]}</p>

      {tool.href ? (
        <Link
          href={tool.href}
          className="mt-4 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-3 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {tool.actionLabel}
        </Link>
      ) : null}
    </article>
  );
}
