import { transactionRules } from "./accounting-rules";
import { extractAmount as parseAmount } from "./amount-parser";
import type { TransactionClassification } from "./types";

const MIN_CONFIDENCE = 0.7;
const DIRECT_MATCH_CONFIDENCE = 0.95;

export function classifyTransaction(transactionText: string): TransactionClassification | null {
  const rule = transactionRules.find((candidate) =>
    candidate.patterns.some((pattern) => pattern.test(transactionText)),
  );

  if (!rule) return null;

  const amount = rule.amountExtractor?.(transactionText) ?? parseAmount(transactionText);
  if (!amount) return null;

  const confidence = DIRECT_MATCH_CONFIDENCE;
  if (confidence < MIN_CONFIDENCE) return null;

  const partyDetails = rule.partyExtractor?.(transactionText) ?? null;
  const debitAccount =
    partyDetails?.partyAccountSide === "debit" ? partyDetails.partyName : rule.debitAccount;
  const creditAccount =
    partyDetails?.partyAccountSide === "credit" ? partyDetails.partyName : rule.creditAccount;

  return {
    transaction_type: rule.transaction_type,
    confidence,
    debitAccount,
    creditAccount,
    expectedDebitAccount: debitAccount,
    expectedCreditAccount: creditAccount,
    genericDebitAccount: rule.debitAccount,
    genericCreditAccount: rule.creditAccount,
    amount,
    explanationLogic: rule.explanationLogic,
    partyName: partyDetails?.partyName,
    partyRole: partyDetails?.partyRole,
    partyAccountSide: partyDetails?.partyAccountSide,
  };
}

export function extractAmount(value: string): number | null {
  return parseAmount(value);
}
