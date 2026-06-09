import type { AdvancedJournalAnswerCheckResult } from "../checkers/advanced-journal-answer-checker";
import { coreJournalEntriesToJournalText } from "../serializers/journal-text-serializer";
import type { AdvancedPracticeQuestion } from "./advanced-practice-question-generator";

export type AdvancedPracticeResultStatus = "correct" | "partially_correct" | "incorrect" | "empty" | "invalid";

export type AdvancedPracticeResultTone = "success" | "warning" | "error" | "info";

export type AdvancedPracticeFeedbackItem = {
  id: string;
  tone: AdvancedPracticeResultTone;
  title: string;
  message: string;
  details?: string[];
};

export type AdvancedPracticeScoreDisplay = {
  score: number;
  maxScore: 100;
  percentage: number;
  label: string;
  tone: AdvancedPracticeResultTone;
};

export type AdvancedPracticeCorrectEntryDisplay = {
  title: string;
  journalText: string;
  explanation: string;
};

export type AdvancedPracticeResultAction = {
  id: string;
  label: string;
  description: string;
  kind: "retry" | "next" | "review_lesson" | "view_working";
  target?: string;
};

export type AdvancedPracticeResultViewModel = {
  questionId: string;
  questionTitle: string;
  topic: "partnership" | "company_accounts";
  status: AdvancedPracticeResultStatus;
  score: AdvancedPracticeScoreDisplay;
  summary: string;
  feedback: AdvancedPracticeFeedbackItem[];
  correctEntry: AdvancedPracticeCorrectEntryDisplay;
  beginnerHint: string;
  commonMistakes: string[];
  actions: AdvancedPracticeResultAction[];
  metadata: {
    source: "advanced-practice-result-builder-v1";
    checkerIsCorrect: boolean;
    actualIsBalanced: boolean;
    missingLineCount: number;
    extraLineCount: number;
  };
};

export type AdvancedPracticeResultBuilderInput = {
  question: AdvancedPracticeQuestion;
  checkResult: AdvancedJournalAnswerCheckResult;
};

export const ADVANCED_PRACTICE_RESULT_BUILDER_VERSION = "advanced-practice-result-builder-v1";

export function buildAdvancedPracticeResult(input: AdvancedPracticeResultBuilderInput): AdvancedPracticeResultViewModel {
  const { question, checkResult } = input;

  return {
    questionId: question.id,
    questionTitle: question.title,
    topic: question.topic,
    status: getAdvancedPracticeResultStatus(checkResult),
    score: buildAdvancedPracticeScoreDisplay(checkResult),
    summary: summarizeAdvancedPracticeResult(question, checkResult),
    feedback: buildAdvancedPracticeFeedback(question, checkResult),
    correctEntry: buildCorrectEntryDisplay(question),
    beginnerHint: question.beginnerHint,
    commonMistakes: [...question.commonMistakes],
    actions: buildAdvancedPracticeActions(question, checkResult),
    metadata: {
      source: ADVANCED_PRACTICE_RESULT_BUILDER_VERSION,
      checkerIsCorrect: checkResult.isCorrect,
      actualIsBalanced: checkResult.actualIsBalanced,
      missingLineCount: checkResult.missingLines.length,
      extraLineCount: checkResult.extraLines.length,
    },
  };
}

export function getAdvancedPracticeResultStatus(checkResult: AdvancedJournalAnswerCheckResult): AdvancedPracticeResultStatus {
  if (hasInvalidExpectedState(checkResult)) return "invalid";
  if (checkResult.score === 100 && checkResult.isCorrect) return "correct";
  if (checkResult.score === 0 && checkResult.actualDebitTotal === 0 && checkResult.actualCreditTotal === 0) return "empty";
  if (checkResult.score > 0 && checkResult.score < 100) return "partially_correct";
  return "incorrect";
}

export function buildAdvancedPracticeScoreDisplay(checkResult: AdvancedJournalAnswerCheckResult): AdvancedPracticeScoreDisplay {
  return {
    score: checkResult.score,
    maxScore: 100,
    percentage: checkResult.score,
    label: getScoreLabel(checkResult.score),
    tone: getScoreTone(checkResult.score),
  };
}

export function buildAdvancedPracticeFeedback(
  question: AdvancedPracticeQuestion,
  checkResult: AdvancedJournalAnswerCheckResult,
): AdvancedPracticeFeedbackItem[] {
  const status = getAdvancedPracticeResultStatus(checkResult);
  const feedback: AdvancedPracticeFeedbackItem[] = [
    {
      id: "overall",
      tone: status === "correct" ? "success" : status === "partially_correct" ? "warning" : "error",
      title: getOverallFeedbackTitle(status),
      message: getOverallFeedbackMessage(status),
      details: status === "correct" ? ["Debit accounts, credit accounts, and amounts are correct."] : undefined,
    },
  ];

  checkResult.missingLines.forEach((line, index) => {
    feedback.push({
      id: `missing-line-${index + 1}`,
      tone: "error",
      title: "Missing line",
      message: line.message,
    });
  });

  checkResult.extraLines.forEach((line, index) => {
    feedback.push({
      id: `extra-line-${index + 1}`,
      tone: "warning",
      title: "Extra line",
      message: `Extra ${line.side} line found: ${line.accountName}.`,
    });
  });

  checkResult.lineComparisons
    .filter((line) => line.status === "wrong_amount")
    .forEach((line, index) => {
      feedback.push({
        id: `wrong-amount-${index + 1}`,
        tone: "warning",
        title: "Check amount",
        message: line.message,
      });
    });

  if (!checkResult.actualIsBalanced) {
    feedback.push({
      id: "unbalanced-answer",
      tone: "error",
      title: "Balance the entry",
      message: "Your total debit and total credit are not equal.",
    });
  }

  addCheckerMessages(feedback, checkResult);

  feedback.push({
    id: "case-explanation",
    tone: "info",
    title: "Why this entry works",
    message: question.explanation,
  });

  return feedback;
}

export function buildCorrectEntryDisplay(question: AdvancedPracticeQuestion): AdvancedPracticeCorrectEntryDisplay {
  return {
    title: "Correct journal entry",
    journalText: coreJournalEntriesToJournalText(question.expectedJournalEntries),
    explanation: question.explanation,
  };
}

export function buildAdvancedPracticeActions(
  question: AdvancedPracticeQuestion,
  checkResult: AdvancedJournalAnswerCheckResult,
): AdvancedPracticeResultAction[] {
  void checkResult;

  return [
    {
      id: "retry",
      label: "Retry Same Question",
      description: "Try this advanced journal entry again.",
      kind: "retry",
    },
    {
      id: "next",
      label: "Try Another Question",
      description: "Move to the next advanced practice question.",
      kind: "next",
    },
    {
      id: "review-lesson",
      label: "Review Lesson",
      description: "Revise the related concept before trying again.",
      kind: "review_lesson",
      target:
        question.topic === "company_accounts"
          ? "/learn/accounting-for-share-capital"
          : "/learn/partnership-accounts-basic-concepts",
    },
    {
      id: "view-working",
      label: "View Working Later",
      description: "View how this entry can flow into Ledger and Trial Balance later.",
      kind: "view_working",
    },
  ];
}

export function summarizeAdvancedPracticeResult(
  _question: AdvancedPracticeQuestion,
  checkResult: AdvancedJournalAnswerCheckResult,
): string {
  const status = getAdvancedPracticeResultStatus(checkResult);

  if (status === "correct") {
    return "Great work. Your journal entry matches the expected answer.";
  }

  if (status === "partially_correct") {
    return "Your answer is partly correct. Review the missing or incorrect lines below.";
  }

  if (status === "empty") {
    return "Write a journal entry before checking your answer.";
  }

  if (status === "invalid") {
    return "This practice result cannot be checked because the expected answer is not valid.";
  }

  return "Your answer does not match the expected journal entry yet. Compare it with the correct entry below.";
}

function addCheckerMessages(feedback: AdvancedPracticeFeedbackItem[], checkResult: AdvancedJournalAnswerCheckResult): void {
  const existingMessages = new Set(feedback.map((item) => item.message));

  checkResult.messages.forEach((message, index) => {
    if (existingMessages.has(message.message)) return;

    feedback.push({
      id: `checker-message-${index + 1}`,
      tone: message.severity === "info" ? "info" : message.severity === "warning" ? "warning" : "error",
      title: "Checker note",
      message: message.message,
      ...(message.code ? { details: [`Code: ${message.code}`] } : {}),
    });
    existingMessages.add(message.message);
  });
}

function hasInvalidExpectedState(checkResult: AdvancedJournalAnswerCheckResult): boolean {
  return checkResult.messages.some((message) =>
    ["expected_missing", "invalid_expected_structure", "invalid_expected_amount"].includes(message.code ?? ""),
  );
}

function getScoreLabel(score: number): string {
  if (score === 100) return "Excellent";
  if (score >= 75) return "Good attempt";
  if (score >= 40) return "Partly correct";
  if (score >= 1) return "Needs revision";
  return "Try again";
}

function getScoreTone(score: number): AdvancedPracticeResultTone {
  if (score === 100) return "success";
  if (score >= 60) return "warning";
  return "error";
}

function getOverallFeedbackTitle(status: AdvancedPracticeResultStatus): string {
  if (status === "correct") return "Correct answer";
  if (status === "partially_correct") return "Partly correct";
  if (status === "empty") return "Answer needed";
  if (status === "invalid") return "Cannot check this result";
  return "Needs correction";
}

function getOverallFeedbackMessage(status: AdvancedPracticeResultStatus): string {
  if (status === "correct") {
    return "Great work. Your debit accounts, credit accounts, and amounts match the expected journal entry.";
  }

  if (status === "partially_correct") {
    return "Some parts are correct, but a few lines need correction.";
  }

  if (status === "empty") {
    return "Write your journal entry first, then check it.";
  }

  if (status === "invalid") {
    return "The expected answer for this advanced practice question is not valid.";
  }

  return "Compare your answer with the correct entry and try again.";
}
