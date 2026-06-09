"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildAdvancedPracticeResult,
  checkAdvancedJournalAnswer,
  coreJournalEntriesToJournalText,
  getAdvancedPracticeQuestionsByTopic,
  getAllAdvancedPracticeQuestions,
  getNextAdvancedPracticeQuestion,
  parseAdvancedJournalAnswerText,
  type AdvancedJournalTextParseResult,
  type AdvancedPracticeQuestion,
  type AdvancedPracticeResultAction,
  type AdvancedPracticeResultTone,
  type AdvancedPracticeResultViewModel,
  type AdvancedPracticeTopic,
} from "@/lib/accounting-core";

type TopicMode = AdvancedPracticeTopic | "mixed";

const topicOptions: Array<{ id: TopicMode; label: string; description: string }> = [
  {
    id: "company_accounts",
    label: "Company Accounts",
    description: "Share capital, calls, forfeiture, and debenture entries.",
  },
  {
    id: "partnership",
    label: "Partnership Accounts",
    description: "Appropriation, revaluation, goodwill, and realisation entries.",
  },
  {
    id: "mixed",
    label: "Mixed",
    description: "A deterministic mix of selected advanced questions.",
  },
];

const placeholderAnswer = `Bank A/c Dr. 120000
To Share Capital A/c 100000
To Securities Premium A/c 20000`;

export default function AdvancedPracticePage() {
  const [topicMode, setTopicMode] = useState<TopicMode>("company_accounts");
  const [currentQuestion, setCurrentQuestion] = useState<AdvancedPracticeQuestion>(() =>
    getAdvancedPracticeQuestionsByTopic("company_accounts")[0],
  );
  const [answerText, setAnswerText] = useState("");
  const [parseResult, setParseResult] = useState<AdvancedJournalTextParseResult | null>(null);
  const [result, setResult] = useState<AdvancedPracticeResultViewModel | null>(null);
  const [showCorrectEntry, setShowCorrectEntry] = useState(false);
  const [showWorkingNote, setShowWorkingNote] = useState(false);

  const availableQuestions = useMemo(() => getQuestionsForMode(topicMode), [topicMode]);
  const correctEntryText = useMemo(
    () => coreJournalEntriesToJournalText(currentQuestion.expectedJournalEntries),
    [currentQuestion],
  );

  function chooseTopic(nextMode: TopicMode) {
    const nextQuestions = getQuestionsForMode(nextMode);
    const nextQuestion = nextQuestions[0];

    if (!nextQuestion) return;

    setTopicMode(nextMode);
    setCurrentQuestion(nextQuestion);
    resetAnswerState();
  }

  function checkAnswer() {
    const nextParseResult = parseAdvancedJournalAnswerText({
      answerText,
      topic: currentQuestion.topic,
      questionId: currentQuestion.id,
    });
    const checkResult = checkAdvancedJournalAnswer({
      expectedJournalEntries: currentQuestion.expectedJournalEntries,
      actualJournalEntries: nextParseResult.status === "parsed" ? nextParseResult.journalEntries : [],
    });

    setParseResult(nextParseResult);
    setResult(buildAdvancedPracticeResult({ question: currentQuestion, checkResult }));
    setShowCorrectEntry(true);
    setShowWorkingNote(false);
  }

  function clearAnswer() {
    setAnswerText("");
    setParseResult(null);
    setResult(null);
    setShowCorrectEntry(false);
    setShowWorkingNote(false);
  }

  function retryQuestion() {
    setResult(null);
    setParseResult(null);
    setShowWorkingNote(false);
  }

  function nextQuestion() {
    const next = getNextAdvancedPracticeQuestion(currentQuestion.id, getFilterForMode(topicMode)) ?? availableQuestions[0];
    if (!next) return;

    setCurrentQuestion(next);
    resetAnswerState();
  }

  function handleAction(action: AdvancedPracticeResultAction) {
    if (action.kind === "retry") retryQuestion();
    if (action.kind === "next") nextQuestion();
    if (action.kind === "view_working") setShowWorkingNote(true);
  }

  function resetAnswerState() {
    setAnswerText("");
    setParseResult(null);
    setResult(null);
    setShowCorrectEntry(false);
    setShowWorkingNote(false);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 pb-28 text-ink sm:px-6 sm:py-8">
      <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 sm:gap-6">
        <PageHeader />

        <TopicSelector selectedTopic={topicMode} onSelect={chooseTopic} />

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <QuestionCard question={currentQuestion} onNext={nextQuestion} />
          <AnswerCard
            answerText={answerText}
            correctEntryText={correctEntryText}
            showCorrectEntry={showCorrectEntry}
            onAnswerChange={setAnswerText}
            onCheck={checkAnswer}
            onClear={clearAnswer}
            onShowCorrectEntry={() => setShowCorrectEntry(true)}
          />
        </section>

        {parseResult && parseResult.status !== "parsed" ? <ParseMessageCard parseResult={parseResult} /> : null}

        {result ? (
          <ResultCard
            result={result}
            parseResult={parseResult}
            showWorkingNote={showWorkingNote}
            onAction={handleAction}
          />
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <CommonMistakesCard question={currentQuestion} />
          <BetaLimitationsCard />
        </section>

        <LearningLinks />
      </section>
    </main>
  );
}

function PageHeader() {
  return (
    <header className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-5 shadow-soft sm:p-8">
      <nav className="hidden flex-wrap items-center gap-3 text-sm font-semibold sm:flex">
        <Link href="/learn" className="text-blue-800 transition hover:text-blue-950">
          Start
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/tools" className="text-blue-800 transition hover:text-blue-950">
          Tools
        </Link>
      </nav>
      <nav className="flex items-center justify-between gap-3 text-sm font-semibold sm:hidden">
        <span className="text-blue-950">Advanced Practice</span>
        <Link href="/practice" className="text-blue-800 transition hover:text-blue-950">
          Practice
        </Link>
      </nav>
      <div className="mt-7 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Advanced journal practice</p>
          <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-normal text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-blue-950 sm:text-5xl">
          Advanced Journal Entry Practice
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Practise selected Partnership and Company Accounts journal entries step by step.
        </p>
        <p className="mt-4 rounded-xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
          This beta checks journal entries only. Partnership and Company reports are not included yet.
        </p>
      </div>
    </header>
  );
}

function TopicSelector({ selectedTopic, onSelect }: { selectedTopic: TopicMode; onSelect: (topic: TopicMode) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-soft sm:p-5">
      <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Choose topic</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {topicOptions.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.id)}
            className={`rounded-xl border p-4 text-left transition ${
              selectedTopic === topic.id
                ? "border-blue-300 bg-white shadow-soft"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <span className="text-base font-bold text-blue-950">{topic.label}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">{topic.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function QuestionCard({ question, onNext }: { question: AdvancedPracticeQuestion; onNext: () => void }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Question</p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">{question.title}</h2>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="min-h-11 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
        >
          Next Question
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{formatTopic(question.topic)}</Badge>
        <Badge>{titleCase(question.difficulty)}</Badge>
        {question.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-blue-950">Prompt</p>
        <p className="mt-2 text-base font-semibold leading-7 text-slate-800">{question.prompt}</p>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-bold text-emerald-900">Hint</p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">{question.beginnerHint}</p>
      </div>
    </section>
  );
}

function AnswerCard({
  answerText,
  correctEntryText,
  showCorrectEntry,
  onAnswerChange,
  onCheck,
  onClear,
  onShowCorrectEntry,
}: {
  answerText: string;
  correctEntryText: string;
  showCorrectEntry: boolean;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  onClear: () => void;
  onShowCorrectEntry: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <label className="grid gap-2">
        <span className="text-sm font-bold uppercase tracking-normal text-emerald-700">Write your journal entry</span>
        <textarea
          value={answerText}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder={placeholderAnswer}
          className="min-h-52 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-7 text-blue-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </label>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Write one account per line. Use Dr. for debit lines and To for credit lines.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <PrimaryButton onClick={onCheck}>Check Answer</PrimaryButton>
        <SecondaryButton onClick={onClear}>Clear</SecondaryButton>
        <SecondaryButton onClick={onShowCorrectEntry}>Show Correct Entry</SecondaryButton>
      </div>

      {showCorrectEntry ? (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-sm font-bold text-blue-950">Correct Entry</p>
          <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-sm leading-7 text-slate-900">
            {correctEntryText}
          </pre>
        </div>
      ) : null}
    </section>
  );
}

function ParseMessageCard({ parseResult }: { parseResult: AdvancedJournalTextParseResult }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <p className="text-sm font-bold text-amber-900">Answer format note</p>
      <div className="mt-2 grid gap-1">
        {parseResult.messages.map((message) => (
          <p key={`${message.code}-${message.message}`} className="text-sm leading-6 text-amber-900">
            {message.message}
          </p>
        ))}
      </div>
    </section>
  );
}

function ResultCard({
  result,
  parseResult,
  showWorkingNote,
  onAction,
}: {
  result: AdvancedPracticeResultViewModel;
  parseResult: AdvancedJournalTextParseResult | null;
  showWorkingNote: boolean;
  onAction: (action: AdvancedPracticeResultAction) => void;
}) {
  const panelClass = getTonePanelClass(result.score.tone);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <div className={`rounded-2xl border px-4 py-4 ${panelClass}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal">{formatStatus(result.status)}</p>
            <h2 className="mt-1 text-2xl font-bold">{result.score.label}</h2>
            <p className="mt-2 text-sm font-medium leading-6">{result.summary}</p>
          </div>
          <div className="text-4xl font-bold">{result.score.score}/100</div>
        </div>
      </div>

      {parseResult ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-normal text-slate-500">
          Parser status: {parseResult.status}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3">
        <h3 className="text-xl font-bold text-blue-950">Feedback</h3>
        {result.feedback.map((item) => (
          <article key={item.id} className={`rounded-xl border p-4 ${getFeedbackClass(item.tone)}`}>
            <p className="text-sm font-bold">{item.title}</p>
            <p className="mt-1 text-sm leading-6">{item.message}</p>
            {item.details ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="text-sm font-bold text-blue-950">{result.correctEntry.title}</p>
        <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-sm leading-7 text-slate-900">
          {result.correctEntry.journalText}
        </pre>
        <p className="mt-3 text-sm leading-6 text-slate-700">{result.correctEntry.explanation}</p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <InfoBlock title="Beginner hint" items={[result.beginnerHint]} />
        <InfoBlock title="Common mistakes" items={result.commonMistakes} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {result.actions.map((action) =>
          action.kind === "review_lesson" && action.target ? (
            <Link
              key={action.id}
              href={action.target}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
            >
              {action.label}
            </Link>
          ) : (
            <SecondaryButton key={action.id} onClick={() => onAction(action)}>
              {action.label}
            </SecondaryButton>
          ),
        )}
      </div>

      {showWorkingNote ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
          Ledger and Trial Balance impact preview will be added later.
        </div>
      ) : null}
    </section>
  );
}

function CommonMistakesCard({ question }: { question: AdvancedPracticeQuestion }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
      <h2 className="text-xl font-bold text-blue-950">Common mistakes for this question</h2>
      <ul className="mt-4 grid gap-3">
        {question.commonMistakes.map((mistake) => (
          <li key={mistake} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
            {mistake}
          </li>
        ))}
      </ul>
    </section>
  );
}

function BetaLimitationsCard() {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-soft sm:p-6">
      <h2 className="text-xl font-bold text-blue-950">Beta scope</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <InfoBlock
          title="What this beta does"
          items={[
            "Checks selected Partnership and Company journal entries",
            "Gives score and feedback",
            "Shows correct entry and explanation",
          ]}
        />
        <InfoBlock
          title="Not included yet"
          items={[
            "No Partnership reports",
            "No Company reports",
            "No history/progress saving",
            "No AI checking",
            "No custom advanced transactions",
          ]}
        />
      </div>
    </section>
  );
}

function LearningLinks() {
  const links = [
    { href: "/learn/accounting-for-share-capital", label: "Review Company Accounts" },
    { href: "/learn/partnership-accounts-basic-concepts", label: "Review Partnership Accounts" },
    { href: "/practice", label: "Back to Practice" },
    { href: "/tools", label: "Open Tools" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-blue-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
        >
          {link.label}
        </Link>
      ))}
    </section>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-blue-950">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-900 transition hover:bg-blue-50"
    >
      {children}
    </button>
  );
}

function getQuestionsForMode(mode: TopicMode): AdvancedPracticeQuestion[] {
  if (mode === "mixed") return getAllAdvancedPracticeQuestions();
  return getAdvancedPracticeQuestionsByTopic(mode);
}

function getFilterForMode(mode: TopicMode): { topic: AdvancedPracticeTopic | "all" } {
  return { topic: mode === "mixed" ? "all" : mode };
}

function formatTopic(topic: AdvancedPracticeTopic): string {
  return topic === "company_accounts" ? "Company Accounts" : "Partnership Accounts";
}

function formatStatus(status: AdvancedPracticeResultViewModel["status"]): string {
  return status.replace(/_/g, " ");
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getTonePanelClass(tone: AdvancedPracticeResultTone): string {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-900";
  if (tone === "error") return "border-red-200 bg-red-50 text-red-900";
  return "border-blue-200 bg-blue-50 text-blue-950";
}

function getFeedbackClass(tone: AdvancedPracticeResultTone): string {
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-900";
  if (tone === "error") return "border-red-200 bg-red-50 text-red-900";
  return "border-blue-200 bg-blue-50 text-blue-950";
}
