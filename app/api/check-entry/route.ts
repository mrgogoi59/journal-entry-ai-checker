import { NextResponse } from "next/server";
import { generateExplanation, generatePracticeQuestion } from "@/lib/explanation-generator";
import { generateExpectedEntry } from "@/lib/expected-entry-generator";
import { parseJournalEntry } from "@/lib/journal-parser";
import { scoreEntry, getResultStatus } from "@/lib/scoring-engine";
import { classifyTransaction } from "@/lib/transaction-classifier";
import { validateEntry } from "@/lib/entry-validator";
import type { CheckEntryResponse, ParsedJournalEntry } from "@/lib/types";

interface CheckEntryRequest {
  transactionText?: string;
  journalEntry?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckEntryRequest;
    const transactionText = body.transactionText?.trim() ?? "";
    const journalEntry = body.journalEntry?.trim() ?? "";

    const parsed = parseJournalEntry(journalEntry);
    const classification = classifyTransaction(transactionText);

    if (!classification) {
      return NextResponse.json<CheckEntryResponse>(unsupportedResponse(parsed));
    }

    const expected = generateExpectedEntry(classification);
    const validation = validateEntry(parsed, expected);
    const score = scoreEntry(validation);
    const resultStatus = getResultStatus(score, validation.mistake_type);

    return NextResponse.json<CheckEntryResponse>({
      result_status: resultStatus,
      score,
      mistake_type: validation.mistake_type,
      confidence: classification.confidence,
      student_entry_parsed: parsed,
      correct_journal_entry: publicExpectedEntry(expected),
      simple_explanation: generateExplanation(classification, validation.mistake_type),
      similar_practice_question: generatePracticeQuestion(classification),
    });
  } catch {
    return NextResponse.json<CheckEntryResponse>({
      result_status: "Invalid Format",
      score: 0,
      mistake_type: "format_error",
      confidence: 0,
      student_entry_parsed: emptyParsedEntry(["Could not check this journal entry."]),
      correct_journal_entry: { debits: [], credits: [] },
      simple_explanation: "Use a clear transaction and one debit line plus one credit line with amounts.",
      similar_practice_question: "Started business with ₹80,000 cash.",
    });
  }
}

function publicExpectedEntry(entry: CheckEntryResponse["correct_journal_entry"]): CheckEntryResponse["correct_journal_entry"] {
  return {
    debits: entry.debits.map((line) => ({ account: line.account, amount: line.amount })),
    credits: entry.credits.map((line) => ({ account: line.account, amount: line.amount })),
  };
}

function unsupportedResponse(parsed: ParsedJournalEntry): CheckEntryResponse {
  return {
    result_status: "Unsupported Transaction",
    score: 0,
    mistake_type: "unsupported_transaction",
    confidence: 0,
    student_entry_parsed: parsed,
    correct_journal_entry: { debits: [], credits: [] },
    simple_explanation: "This transaction is not supported by the beginner rule library yet.",
    similar_practice_question: "Started business with ₹80,000 cash.",
  };
}

function emptyParsedEntry(errors: string[]): ParsedJournalEntry {
  return {
    debits: [],
    credits: [],
    debitTotal: 0,
    creditTotal: 0,
    isBalanced: false,
    errors,
  };
}
