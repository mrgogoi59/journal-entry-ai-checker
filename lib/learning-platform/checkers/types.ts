import type { AccountingEntryLine, JournalEntryExpectedAnswer } from "@/lib/learning-platform/types";

export const JOURNAL_ENTRY_PRACTICE_LIMITS = {
  maxRows: 6,
  maxParticularsLength: 120,
  maxLfLength: 20,
  maxNarrationLength: 240,
  maxAmountLength: 20,
  maxAmountValue: 10000000,
} as const;

export type JournalEntryPracticeCheckStatus = "correct" | "partially-correct" | "incorrect";
export type JournalEntryPracticeFeedbackStatus = "correct" | "warning" | "error";

export type JournalEntryPracticeAttemptRow = {
  rowOrder: number;
  particulars: string;
  lf: string;
  debitAmount: string;
  creditAmount: string;
};

export type JournalEntryPracticeAttempt = {
  questionId: string;
  rows: JournalEntryPracticeAttemptRow[];
  totalDebit: string;
  totalCredit: string;
  narration: string;
};

export type JournalEntryPracticeAnswerKeyLine = AccountingEntryLine & {
  accountKey: string;
  requiredParticularsHint: string;
  correctMessage: string;
  errorMessage: string;
  missingMarkerMessage: string;
  wrongMarkerMessage: string;
  wrongAmountMessage: string;
  wrongColumnMessage: string;
};

export type JournalEntryPracticeUnexpectedAccountFeedback = {
  errorMessage: string;
  hint: string;
};

export type JournalEntryPracticeAnswerKey = {
  questionId: string;
  expectedAnswer: JournalEntryExpectedAnswer;
  expectedLines: JournalEntryPracticeAnswerKeyLine[];
  acceptedNarrations: string[];
  narrationConceptHints: string[];
  narrationFeedback: {
    correctMessage: string;
    warningMessage: string;
    errorMessage: string;
    hint: string;
  };
  unsupportedHint: string;
  blankAttemptHint: string;
  extraLineHint: string;
  correctSummary: string;
  unexpectedAccountFeedback: Partial<Record<string, JournalEntryPracticeUnexpectedAccountFeedback>>;
};

export type JournalEntryPracticeFieldResult = {
  field: "particulars" | "lf" | "debitAmount" | "creditAmount";
  status: JournalEntryPracticeFeedbackStatus;
  message: string;
};

export type JournalEntryPracticeRowResult = {
  rowOrder: number;
  status: JournalEntryPracticeFeedbackStatus;
  summary: string;
  fieldResults: JournalEntryPracticeFieldResult[];
};

export type JournalEntryPracticeTotalsResult = {
  status: JournalEntryPracticeFeedbackStatus;
  expectedDebit: number;
  expectedCredit: number;
  enteredDebit: number | null;
  enteredCredit: number | null;
  rowDebitTotal: number;
  rowCreditTotal: number;
  messages: string[];
};

export type JournalEntryPracticeNarrationResult = {
  status: JournalEntryPracticeFeedbackStatus;
  message: string;
};

export type JournalEntryPracticeBalanceResult = {
  status: JournalEntryPracticeFeedbackStatus;
  message: string;
};

export type JournalEntryPracticeCheckResult = {
  questionId: string;
  status: JournalEntryPracticeCheckStatus;
  summary: string;
  gotRight: string[];
  errors: string[];
  warnings: string[];
  rowResults: JournalEntryPracticeRowResult[];
  totalsResult: JournalEntryPracticeTotalsResult;
  narrationResult: JournalEntryPracticeNarrationResult;
  balanceResult: JournalEntryPracticeBalanceResult;
  hints: string[];
  retryAvailable: boolean;
  correctAnswerRevealAvailable: boolean;
};

export type JournalEntryCorrectAnswerReveal = {
  questionId: string;
  available: boolean;
  lines: {
    id: string;
    particulars: string;
    debitAmount?: string;
    creditAmount?: string;
  }[];
  narration: string;
  message: string;
};
