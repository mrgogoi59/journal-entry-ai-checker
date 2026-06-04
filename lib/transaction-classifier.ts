import { transactionRules } from "./accounting-rules";
import { extractAmount as parseAmount, extractAmounts } from "./amount-parser";
import type { CorrectJournalEntry, TransactionClassification } from "./types";

const MIN_CONFIDENCE = 0.7;
const DIRECT_MATCH_CONFIDENCE = 0.95;
const CASH_PAYMENT_PATTERN = /\bcash\b/i;
const DIGITAL_OR_BANK_PAYMENT_PATTERN =
  /\b(?:bank|cheque|check|upi|google\s+pay|gpay|phonepe|paytm|neft|rtgs|imps|online\s+transfer|bank\s+transfer|debit\s+card|card\s+payment|net\s+banking)\b/i;
const UNSUPPORTED_COMPOUND_CONTEXT_PATTERN = /\b(?:gst|discount|depreciation|bad debts?|outstanding|prepaid|accrued)\b/i;

export function classifyTransaction(transactionText: string): TransactionClassification | null {
  const partialGoodsPurchase = classifyPartialGoodsPurchase(transactionText);
  if (partialGoodsPurchase) return partialGoodsPurchase;
  if (isPartialBalanceCreditCompound(transactionText)) return null;

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

function classifyPartialGoodsPurchase(transactionText: string): TransactionClassification | null {
  if (!isPartialGoodsPurchase(transactionText)) return null;
  if (UNSUPPORTED_COMPOUND_CONTEXT_PATTERN.test(transactionText)) return null;
  if (!hasClearPartialPaymentMode(transactionText)) return null;

  const amounts = extractAmounts(transactionText);
  const [totalAmount, paidAmount] = amounts;
  if (!totalAmount || !paidAmount || paidAmount >= totalAmount) return null;

  const balanceAmount = totalAmount - paidAmount;
  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText) ? "Bank" : "Cash";
  const partyName = extractSupplierName(transactionText);
  const creditorAccount = partyName ?? "Creditor";
  const expectedEntry = buildPartialGoodsPurchaseEntry(
    totalAmount,
    paidAmount,
    balanceAmount,
    paymentAccount,
    creditorAccount,
    partyName,
  );

  return {
    transaction_type:
      paymentAccount === "Bank" ? "partial_goods_purchase_bank_credit" : "partial_goods_purchase_cash_credit",
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: "Purchases",
    creditAccount: paymentAccount,
    expectedDebitAccount: "Purchases",
    expectedCreditAccount: paymentAccount,
    genericDebitAccount: "Purchases",
    genericCreditAccount: paymentAccount,
    amount: totalAmount,
    explanationLogic:
      "Goods were purchased for resale. Purchases is debited for the full value. The amount paid immediately is credited to Cash or Bank, and the balance payable is credited to Creditor or the named supplier.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "partial_goods_purchase",
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function isPartialGoodsPurchase(transactionText: string): boolean {
  return (
    /\b(?:bought|purchased)\s+goods\b/i.test(transactionText) &&
    /\bpaid\b/i.test(transactionText) &&
    /\bbalance\b.*\bcredit\b/i.test(transactionText)
  );
}

function isPartialBalanceCreditCompound(transactionText: string): boolean {
  return /\b(?:paid|received)\b/i.test(transactionText) && /\bbalance\b.*\bcredit\b/i.test(transactionText);
}

function hasClearPartialPaymentMode(transactionText: string): boolean {
  return CASH_PAYMENT_PATTERN.test(transactionText) || DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText);
}

function buildPartialGoodsPurchaseEntry(
  totalAmount: number,
  paidAmount: number,
  balanceAmount: number,
  paymentAccount: "Cash" | "Bank",
  creditorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditLines: CorrectJournalEntry["credits"] = [{ account: paymentAccount, amount: paidAmount }];
  const balanceCreditLine: CorrectJournalEntry["credits"][number] = {
    account: creditorAccount,
    amount: balanceAmount,
  };

  if (partyName) {
    balanceCreditLine.acceptedAccounts = ["Creditor"];
    balanceCreditLine.partyRole = "creditor";
  }

  creditLines.push(balanceCreditLine);

  return {
    debits: [{ account: "Purchases", amount: totalAmount }],
    credits: creditLines,
  };
}

function extractSupplierName(transactionText: string): string | undefined {
  const match = /\bgoods\s+from\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(supplier|seller|creditor|cash|bank)$/i.test(normalizedName)) return undefined;

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}
