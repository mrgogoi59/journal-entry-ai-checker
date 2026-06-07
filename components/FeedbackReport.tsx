"use client";

import { useState } from "react";

const issueTypes = [
  "Wrong answer",
  "App marked correct answer wrong",
  "Explanation is confusing",
  "Unsupported but should be supported",
  "Other",
] as const;

type IssueType = (typeof issueTypes)[number];

export interface FeedbackReportDetails {
  module: "Checker" | "Explainer" | "Practice" | "Ledger" | "Trial Balance" | "Final Accounts";
  transaction: string;
  studentEntry?: string;
  appResult: string;
  appCorrectEntry?: string;
}

export function FeedbackReport({
  buttonLabel,
  details,
}: {
  buttonLabel: string;
  details: FeedbackReportDetails;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState<IssueType>("Wrong answer");
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [timestamp, setTimestamp] = useState(() => new Date().toISOString());
  const reportText = buildReportText(details, issueType, comment, timestamp);

  async function copyReport() {
    setCopied(false);
    setCopyFailed(false);

    if (!navigator.clipboard?.writeText) {
      setCopyFailed(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <button
        type="button"
        onClick={() => {
          if (!isOpen) setTimestamp(new Date().toISOString());
          setIsOpen(!isOpen);
          setCopied(false);
          setCopyFailed(false);
        }}
        className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
      >
        {buttonLabel}
      </button>

      {isOpen ? (
        <div className="mt-3 grid gap-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">What seems wrong?</span>
            <select
              value={issueType}
              onChange={(event) => {
                setIssueType(event.target.value as IssueType);
                setCopied(false);
              }}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-4 focus:ring-blue-100"
            >
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Expected answer / comment</span>
            <textarea
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setCopied(false);
              }}
              placeholder="Tell us what you expected or what confused you."
              className="min-h-24 resize-y rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div>
            <div className="text-sm font-semibold text-ink">Report preview</div>
            <p className="mt-1 text-xs leading-5 text-slate-600">This is what will be copied.</p>
            <pre className="mt-2 max-h-52 select-all overflow-auto rounded-md border border-line bg-paper p-3 text-xs leading-5 text-slate-800">
              {reportText}
            </pre>
          </div>

          <button
            type="button"
            onClick={() => void copyReport()}
            className="min-h-10 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Copy report
          </button>

          {copied ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Report copied. Please send it to the developer/tester.
            </p>
          ) : null}

          {copyFailed ? (
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Copy manually</span>
              <textarea
                readOnly
                value={reportText}
                className="min-h-40 resize-y rounded-md border border-line bg-paper px-3 py-2 font-mono text-xs leading-5 text-slate-800"
              />
            </label>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function buildReportText(
  details: FeedbackReportDetails,
  issueType: IssueType,
  comment: string,
  timestamp: string,
): string {
  return [
    "REPORT WRONG ANSWER",
    "",
    "Module:",
    details.module,
    "",
    "Issue type:",
    issueType,
    "",
    "Transaction:",
    details.transaction || "Not available",
    "",
    "Student entry:",
    details.studentEntry || "Not available",
    "",
    "App result:",
    details.appResult || "Not available",
    "",
    "App correct entry:",
    details.appCorrectEntry || "Not available",
    "",
    "Current page/module:",
    details.module,
    "",
    "Expected answer / comment:",
    comment || "Not provided",
    "",
    "Timestamp:",
    timestamp,
  ].join("\n");
}
