import { transactionRules } from "./accounting-rules";
import { extractAmount as parseAmount } from "./amount-parser";
import type { TransactionClassification } from "./types";

const MIN_CONFIDENCE = 0.7;
const DIRECT_MATCH_CONFIDENCE = 0.95;

export function classifyTransaction(transactionText: string): TransactionClassification | null {
  const amount = parseAmount(transactionText);
  if (!amount) return null;

  const rule = transactionRules.find((candidate) =>
    candidate.patterns.some((pattern) => pattern.test(transactionText)),
  );

  if (!rule) return null;

  const confidence = DIRECT_MATCH_CONFIDENCE;
  if (confidence < MIN_CONFIDENCE) return null;

  return {
    transaction_type: rule.transaction_type,
    confidence,
    debitAccount: rule.debitAccount,
    creditAccount: rule.creditAccount,
    expectedDebitAccount: rule.debitAccount,
    expectedCreditAccount: rule.creditAccount,
    amount,
    explanationLogic: rule.explanationLogic,
  };
}

export function extractAmount(value: string): number | null {
  return parseAmount(value);
}
