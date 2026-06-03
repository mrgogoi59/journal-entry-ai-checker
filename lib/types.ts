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
