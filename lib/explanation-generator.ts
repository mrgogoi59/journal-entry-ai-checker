import { transactionRules } from "./accounting-rules";
import type { MistakeType, TransactionClassification } from "./types";

export function generateExplanation(classification: TransactionClassification, mistakeType: MistakeType): string {
  if (mistakeType === "correct") {
    return classification.explanationLogic;
  }

  const advice: Record<MistakeType, string> = {
    correct: classification.explanationLogic,
    wrong_account: "One or more account names do not match the transaction.",
    reversed_sides: "The right accounts are present, but the debit and credit sides are reversed.",
    amount_mismatch: "The accounts are close, but the amount does not match the transaction amount.",
    missing_account: "The entry is missing one of the required accounts.",
    unbalanced_entry: "The debit total and credit total must be equal.",
    format_error: "Use one debit line and one credit line with clear Dr/Cr labels and amounts.",
    unsupported_transaction: "This transaction is not supported by the beginner rule library yet.",
  };

  return `${advice[mistakeType]} ${classification.explanationLogic}`;
}

export function generatePracticeQuestion(classification: TransactionClassification): string {
  const rule = transactionRules.find((candidate) => candidate.transaction_type === classification.transaction_type);
  const nextAmount = Math.max(1000, Math.round((classification.amount * 1.6) / 1000) * 1000);
  return rule?.practiceTemplate(nextAmount) ?? `Try a similar transaction for ₹${nextAmount}.`;
}
