export type ResultStatus =
  | "Correct"
  | "Partly Correct"
  | "Incorrect"
  | "Invalid Format"
  | "Unsupported Transaction";

export type MistakeType =
  | "correct"
  | "wrong_account"
  | "reversed_sides"
  | "amount_mismatch"
  | "missing_account"
  | "unbalanced_entry"
  | "format_error"
  | "unsupported_transaction";

export type EntryLineSide = "debit" | "credit";

export interface JournalLine {
  account: string;
  amount: number;
}

export interface ParsedJournalEntry {
  debits: JournalLine[];
  credits: JournalLine[];
  isBalanced: boolean;
  debitTotal: number;
  creditTotal: number;
  errors: string[];
}

export interface TransactionClassification {
  transaction_type: string;
  confidence: number;
  debitAccount: string;
  creditAccount: string;
  expectedDebitAccount: string;
  expectedCreditAccount: string;
  amount: number;
  explanationLogic: string;
}

export interface CorrectJournalEntry {
  debits: JournalLine[];
  credits: JournalLine[];
}

export interface ValidationResult {
  correctAccounts: boolean;
  correctSides: boolean;
  correctAmount: boolean;
  isBalanced: boolean;
  mistake_type: MistakeType;
}

export interface CheckEntryResponse {
  result_status: ResultStatus;
  score: number;
  mistake_type: MistakeType;
  confidence: number;
  student_entry_parsed: ParsedJournalEntry;
  correct_journal_entry: CorrectJournalEntry;
  simple_explanation: string;
  similar_practice_question: string;
}

export interface PracticeQuestion {
  id: string;
  transaction_text: string;
  difficulty: "Beginner";
  transaction_type: string;
}

export type SolverMode = "beginner" | "exam";
export type SolverStatus = "solved" | "ambiguous" | "unsupported";
export type SolverConfidence = "high" | "medium" | "low";
export type SolverSide = "Debit" | "Credit";

export interface SolverJournalEntryLine {
  account: string;
  debit: number;
  credit: number;
}

export interface SolverAffectedAccount {
  account: string;
  traditionalType: string;
  modernType: string;
  effect: string;
  debitOrCredit: SolverSide;
  ruleApplied: string;
  reason: string;
}

export interface SolverPossibleInterpretation {
  context: string;
  journalEntry: string[];
  note: string;
}

export interface SolverPracticeQuestion {
  question: string;
  expectedPattern: string;
}

export interface JournalEntrySolverResponse {
  transactionSummary: string;
  status: SolverStatus;
  confidence: SolverConfidence;
  ambiguityQuestions: string[];
  possibleInterpretations: SolverPossibleInterpretation[];
  journalEntry: SolverJournalEntryLine[];
  narration: string;
  affectedAccounts: SolverAffectedAccount[];
  stepByStepExplanation: string[];
  commonMistakes: string[];
  practiceQuestion: SolverPracticeQuestion;
  message?: string;
}
