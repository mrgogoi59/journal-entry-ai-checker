"use server";

import { checkJournalEntryPracticeAttempt } from "@/lib/learning-platform/checkers/journal-entry-checker";
import type { JournalEntryCorrectAnswerReveal, JournalEntryPracticeCheckResult } from "@/lib/learning-platform/checkers/types";
import {
  getJournalEntryPracticeAnswerKey,
  getJournalEntryPracticeCorrectAnswerReveal,
} from "@/lib/learning-platform/chapters/journal-entry-answer-keys.server";

export async function checkJournalEntriesPracticeAnswer(
  attempt: unknown,
): Promise<JournalEntryPracticeCheckResult> {
  const questionId = typeof attempt === "object" && attempt !== null && "questionId" in attempt
    ? String(attempt.questionId)
    : "";
  const answerKey = getJournalEntryPracticeAnswerKey(questionId);

  return checkJournalEntryPracticeAttempt(attempt, answerKey);
}

export async function revealJournalEntriesPracticeCorrectAnswer(
  questionId: string,
): Promise<JournalEntryCorrectAnswerReveal> {
  return getJournalEntryPracticeCorrectAnswerReveal(questionId);
}
