import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/student-platform/PageHeader";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import {
  solverToolCatalog,
  solverToolStatusLabels,
  type SolverToolCatalogItem,
  type SolverToolStatus,
} from "@/lib/learning-platform/solver-catalog";

export const metadata: Metadata = {
  title: "Solver | AccyWise AI",
  description:
    "access Accountancy tools for Journal Entries, Ledger, Trial Balance, Final Accounts, and Bank Reconciliation.",
};

const statusStyles = {
  available: "border-cyan-200 bg-cyan-50 text-cyan-800",
  planned: "border-amber-200 bg-amber-50 text-amber-800",
  later: "border-slate-200 bg-slate-50 text-slate-600",
} satisfies Record<SolverToolStatus, string>;

export default function SolverPage() {
  const availableTools = solverToolCatalog.filter((tool) => tool.status === "available");
  const plannedTools = solverToolCatalog.filter((tool) => tool.status !== "available");
  const recommendedTool = solverToolCatalog.find((tool) => tool.id === "ai-journal-entry-explainer");

  return (
    <StudentAppShell activeItem="solver">
      <PageHeader
        eyebrow="Student platform"
        title="Solver"
        description="Choose an Accountancy tool to explain, prepare, or review a specific accounting problem."
      >
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-cyan-800">
          Tools hub
        </span>
      </PageHeader>

      <section
        aria-label="Solver and Chapters distinction"
        className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950 shadow-sm sm:p-6"
      >
        Chapters teach concepts step by step. Solver tools help with a specific problem when you need them.
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article
          aria-labelledby="solver-available-now-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Available Now</p>
          <h2 id="solver-available-now-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {availableTools.length} of {solverToolCatalog.length} tools available
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Available: {availableTools.length}. Planned or later: {plannedTools.length}.{" "}
            {plannedTools.length === 0
              ? "All primary Solver tools currently have existing student-facing routes."
              : "Some tools are waiting for a later controlled route slice."}
          </p>
          {availableTools[0]?.href ? (
            <Link
              href={availableTools[0].href}
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white outline-none transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              Open most useful available tool
            </Link>
          ) : null}
        </article>

        <article
          aria-labelledby="recommended-solver-title"
          className="min-w-0 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Recommended Starting Tool</p>
          <h2 id="recommended-solver-title" className="mt-2 text-2xl font-black tracking-tight">
            Start with AI Journal Entry Explainer
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            If you are unsure which account is debited or credited, start with the explainer before moving to Ledger,
            Trial Balance, Final Accounts, or Bank Reconciliation.
          </p>
          {recommendedTool?.status === "available" && recommendedTool.href ? (
            <Link
              href={recommendedTool.href}
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-black text-slate-950 outline-none transition hover:bg-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {recommendedTool.actionLabel}
            </Link>
          ) : (
            <p className="mt-5 text-sm font-bold text-slate-300">This recommendation will become clickable later.</p>
          )}
        </article>
      </section>

      <section aria-labelledby="solver-tools-title" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Solver catalogue</p>
          <h2 id="solver-tools-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Primary Accountancy tools
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Availability is honest: only tools with real student-facing routes have action links.
          </p>
        </div>

        <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
          {solverToolCatalog.map((tool) => (
            <SolverToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="solver-boundary-title"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Educational boundary</p>
        <h2 id="solver-boundary-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          Use Solver for targeted help
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Solver tools are for a specific problem or accounting workflow. Use Chapters when you want complete concepts,
          step-by-step learning, solved illustrations, and Practice It Yourself. Unsupported or advanced treatments may
          remain unavailable until they are safely designed and tested.
        </p>
      </section>
    </StudentAppShell>
  );
}

function SolverToolCard({ tool }: { tool: SolverToolCatalogItem }) {
  return (
    <article
      aria-label={`${tool.title} solver tool`}
      className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-950">{tool.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
        </div>
        <span
          className={`self-start rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wide ${
            statusStyles[tool.status]
          }`}
        >
          {solverToolStatusLabels[tool.status]}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
        <p className="font-black text-slate-950">What it currently does</p>
        <p className="mt-1">{tool.capabilitySummary}</p>
      </div>

      {tool.availabilityNote ? <p className="mt-3 text-sm leading-6 text-slate-600">{tool.availabilityNote}</p> : null}

      {tool.status === "available" && tool.href ? (
        <Link
          href={tool.href}
          className="mt-4 inline-flex min-h-10 items-center self-start rounded-xl border border-cyan-300 bg-cyan-50 px-3 text-sm font-black text-cyan-950 outline-none transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
          {tool.actionLabel}
        </Link>
      ) : (
        <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">No live action link yet</p>
      )}
    </article>
  );
}
