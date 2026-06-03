import type { MistakeType, ResultStatus, ValidationResult } from "./types";

export function scoreEntry(validation: ValidationResult): number {
  return (
    (validation.correctAccounts ? 40 : 0) +
    (validation.correctSides ? 30 : 0) +
    (validation.correctAmount ? 20 : 0) +
    (validation.isBalanced ? 10 : 0)
  );
}

export function getResultStatus(score: number, mistakeType?: MistakeType): ResultStatus {
  if (mistakeType === "format_error") return "Invalid Format";
  if (mistakeType === "unsupported_transaction") return "Unsupported Transaction";
  if (score === 100) return "Correct";
  if (score >= 40) return "Partly Correct";
  return "Incorrect";
}
