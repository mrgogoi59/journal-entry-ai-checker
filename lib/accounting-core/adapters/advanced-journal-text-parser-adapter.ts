import { parseJournalEntry } from "../../journal-parser";
import { parsedJournalEntryToCoreJournalEntry } from "./journal-entry-adapters";
import type { AccountingTopic, JournalEntry } from "../types";

export type AdvancedJournalTextParseStatus = "parsed" | "empty" | "parse_error";

export type AdvancedJournalTextParseMessage = {
  severity: "info" | "warning" | "error";
  message: string;
  code?: string;
};

export type AdvancedJournalTextParseInput = {
  answerText: string;
  topic?: "partnership" | "company_accounts" | "basic";
  questionId?: string;
};

export type AdvancedJournalTextParseResult = {
  status: AdvancedJournalTextParseStatus;
  journalEntries: JournalEntry[];
  messages: AdvancedJournalTextParseMessage[];
  rawText: string;
  normalizedText: string;
  metadata: {
    source: "advanced-journal-text-parser-adapter-v1";
    questionId?: string;
    topic: "partnership" | "company_accounts" | "basic";
  };
};

export const ADVANCED_JOURNAL_TEXT_PARSER_ADAPTER_VERSION = "advanced-journal-text-parser-adapter-v1";

export function parseAdvancedJournalAnswerText(input: AdvancedJournalTextParseInput): AdvancedJournalTextParseResult {
  const topic = input.topic ?? "basic";
  const normalizedText = normalizeAdvancedJournalAnswerText(input.answerText);

  if (!hasAdvancedJournalAnswerText(normalizedText)) {
    return {
      status: "empty",
      journalEntries: [],
      messages: [createParseMessage("error", "Answer is empty.", "empty_answer")],
      rawText: input.answerText,
      normalizedText,
      metadata: createMetadata(input, topic),
    };
  }

  try {
    const parsedEntry = parseJournalEntry(normalizedText);

    if (parsedEntry.errors.length > 0 || parsedEntry.debits.length === 0 || parsedEntry.credits.length === 0) {
      return buildParseErrorResult(input, parsedEntry.errors[0] ?? "Could not parse journal entry.");
    }

    return {
      status: "parsed",
      journalEntries: [
        parsedJournalEntryToCoreJournalEntry(parsedEntry, {
          id: `${input.questionId ?? "advanced-answer"}-parsed-entry`,
          topic: topic as AccountingTopic,
          sourceText: normalizedText,
          metadata: {
            parser: "parseJournalEntry",
          },
        }),
      ],
      messages: [createParseMessage("info", "Journal entry parsed successfully.", "parsed")],
      rawText: input.answerText,
      normalizedText,
      metadata: createMetadata(input, topic),
    };
  } catch {
    return buildParseErrorResult(input, "Could not parse journal entry.");
  }
}

export function normalizeAdvancedJournalAnswerText(answerText: string): string {
  return answerText
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

export function hasAdvancedJournalAnswerText(answerText: string): boolean {
  return answerText.trim().length > 0;
}

export function buildParseErrorResult(input: AdvancedJournalTextParseInput, message: string): AdvancedJournalTextParseResult {
  const topic = input.topic ?? "basic";
  const normalizedText = normalizeAdvancedJournalAnswerText(input.answerText);

  return {
    status: "parse_error",
    journalEntries: [],
    messages: [createParseMessage("error", message, "parse_error")],
    rawText: input.answerText,
    normalizedText,
    metadata: createMetadata(input, topic),
  };
}

function createMetadata(
  input: AdvancedJournalTextParseInput,
  topic: "partnership" | "company_accounts" | "basic",
): AdvancedJournalTextParseResult["metadata"] {
  return {
    source: ADVANCED_JOURNAL_TEXT_PARSER_ADAPTER_VERSION,
    ...(input.questionId ? { questionId: input.questionId } : {}),
    topic,
  };
}

function createParseMessage(
  severity: AdvancedJournalTextParseMessage["severity"],
  message: string,
  code?: string,
): AdvancedJournalTextParseMessage {
  return {
    severity,
    message,
    ...(code ? { code } : {}),
  };
}
