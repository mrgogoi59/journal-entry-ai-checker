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
  const discountAllowedSettlement = classifyDiscountAllowedSettlement(transactionText);
  if (discountAllowedSettlement) return discountAllowedSettlement;
  const discountReceivedSettlement = classifyDiscountReceivedSettlement(transactionText);
  if (discountReceivedSettlement) return discountReceivedSettlement;
  const partialGoodsPurchase = classifyPartialGoodsPurchase(transactionText);
  if (partialGoodsPurchase) return partialGoodsPurchase;
  const partialGoodsSale = classifyPartialGoodsSale(transactionText);
  if (partialGoodsSale) return partialGoodsSale;
  if (isPartialBalanceCreditCompound(transactionText)) return null;
  if (hasUnsupportedGoodsLossInsuranceContext(transactionText)) return null;
  if (hasUnsupportedSalesReturnContext(transactionText)) return null;
  if (hasUnsupportedPurchaseReturnContext(transactionText)) return null;

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

function classifyDiscountAllowedSettlement(transactionText: string): TransactionClassification | null {
  if (!isDiscountAllowedSettlement(transactionText)) return null;
  if (hasUnsupportedDiscountContext(transactionText)) return null;

  const amounts = settlementAmounts(transactionText, "allowed");
  if (!amounts) return null;

  const { fullAmount, actualAmount: receivedAmount, discountAmount } = amounts;
  if (receivedAmount >= fullAmount || discountAmount <= 0) return null;

  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText) ? "Bank" : "Cash";
  const partyName = extractDiscountAllowedParty(transactionText);
  const debtorAccount = partyName ?? "Debtor";
  const expectedEntry = buildDiscountAllowedEntry(
    fullAmount,
    receivedAmount,
    discountAmount,
    receiptAccount,
    debtorAccount,
    partyName,
  );

  return {
    transaction_type:
      receiptAccount === "Bank" ? "discount_allowed_bank_settlement" : "discount_allowed_cash_settlement",
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: receiptAccount,
    creditAccount: debtorAccount,
    expectedDebitAccount: receiptAccount,
    expectedCreditAccount: debtorAccount,
    genericDebitAccount: receiptAccount,
    genericCreditAccount: "Debtor",
    amount: fullAmount,
    explanationLogic:
      "The debtor settled the account by paying less than the amount due. Cash or Bank is debited for the amount received, Discount Allowed is debited for the loss, and Debtor or the named party is credited for the full amount settled.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "discount_allowed_settlement",
      fullAmount,
      receivedAmount,
      discountAmount,
      receiptAccount,
      debtorAccount,
      partyName,
    },
  };
}

function classifyDiscountReceivedSettlement(transactionText: string): TransactionClassification | null {
  if (!isDiscountReceivedSettlement(transactionText)) return null;
  if (hasUnsupportedDiscountContext(transactionText)) return null;

  const amounts = settlementAmounts(transactionText, "received");
  if (!amounts) return null;

  const { fullAmount, actualAmount: paidAmount, discountAmount } = amounts;
  if (paidAmount >= fullAmount || discountAmount <= 0) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText) ? "Bank" : "Cash";
  const partyName = extractDiscountReceivedParty(transactionText);
  const creditorAccount = partyName ?? "Creditor";
  const expectedEntry = buildDiscountReceivedEntry(
    fullAmount,
    paidAmount,
    discountAmount,
    paymentAccount,
    creditorAccount,
    partyName,
  );

  return {
    transaction_type:
      paymentAccount === "Bank" ? "discount_received_bank_settlement" : "discount_received_cash_settlement",
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: creditorAccount,
    creditAccount: paymentAccount,
    expectedDebitAccount: creditorAccount,
    expectedCreditAccount: paymentAccount,
    genericDebitAccount: "Creditor",
    genericCreditAccount: paymentAccount,
    amount: fullAmount,
    explanationLogic:
      "The creditor accepted less than the amount payable. Creditor or the named party is debited for the full liability settled, Cash or Bank is credited for the actual payment, and Discount Received is credited as income/gain.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "discount_received_settlement",
      fullAmount,
      paidAmount,
      discountAmount,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
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

function classifyPartialGoodsSale(transactionText: string): TransactionClassification | null {
  if (!isPartialGoodsSale(transactionText)) return null;
  if (UNSUPPORTED_COMPOUND_CONTEXT_PATTERN.test(transactionText)) return null;
  if (!hasClearPartialPaymentMode(transactionText)) return null;

  const amounts = extractAmounts(transactionText);
  const [totalAmount, receivedAmount] = amounts;
  if (!totalAmount || !receivedAmount || receivedAmount >= totalAmount) return null;

  const balanceAmount = totalAmount - receivedAmount;
  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText) ? "Bank" : "Cash";
  const partyName = extractCustomerName(transactionText);
  const debtorAccount = partyName ?? "Debtor";
  const expectedEntry = buildPartialGoodsSaleEntry(
    totalAmount,
    receivedAmount,
    balanceAmount,
    receiptAccount,
    debtorAccount,
    partyName,
  );

  return {
    transaction_type:
      receiptAccount === "Bank" ? "partial_goods_sale_bank_credit" : "partial_goods_sale_cash_credit",
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: receiptAccount,
    creditAccount: "Sales",
    expectedDebitAccount: receiptAccount,
    expectedCreditAccount: "Sales",
    genericDebitAccount: receiptAccount,
    genericCreditAccount: "Sales",
    amount: totalAmount,
    explanationLogic:
      "Goods were sold. The amount received immediately is debited to Cash or Bank. The balance receivable is debited to Debtor or the named customer, and Sales is credited for the full value.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "partial_goods_sale",
      totalAmount,
      receivedAmount,
      balanceAmount,
      receiptAccount,
      debtorAccount,
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

function isPartialGoodsSale(transactionText: string): boolean {
  return (
    /\b(?:sold\s+goods|goods\s+sold|sale\s+of\s+goods)\b/i.test(transactionText) &&
    /\breceived\b/i.test(transactionText) &&
    /\bbalance\b.*\bcredit\b/i.test(transactionText)
  );
}

function isPartialBalanceCreditCompound(transactionText: string): boolean {
  return /\b(?:paid|received)\b/i.test(transactionText) && /\bbalance\b.*\bcredit\b/i.test(transactionText);
}

function hasClearPartialPaymentMode(transactionText: string): boolean {
  return CASH_PAYMENT_PATTERN.test(transactionText) || DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText);
}

function isDiscountAllowedSettlement(transactionText: string): boolean {
  return (
    /\breceived\b/i.test(transactionText) &&
      /\b(?:full settlement|full and final settlement|allowed discount|allowing discount)\b/i.test(transactionText)
  ) ||
    /^[a-z][a-z.'-]*\s+paid\b.*\bfull settlement\b/i.test(transactionText) ||
    /^[a-z][a-z.'-]*\s+settled\s+account\b/i.test(transactionText);
}

function isDiscountReceivedSettlement(transactionText: string): boolean {
  return (
    /\bpaid\b/i.test(transactionText) &&
      /\b(?:full settlement|full and final settlement|received discount|receiving discount)\b/i.test(transactionText)
  ) ||
    /^[a-z][a-z.'-]*\s+accepted\b.*\bfull settlement\b/i.test(transactionText) ||
    /\bsettled\s+[a-z][a-z.'-]*\s+account\b/i.test(transactionText);
}

function hasUnsupportedDiscountContext(transactionText: string): boolean {
  return /\b(?:gst|goods|trade\s+discount|invoice|provision)\b/i.test(transactionText);
}

function hasUnsupportedGoodsLossInsuranceContext(transactionText: string): boolean {
  return /\bgoods\b/i.test(transactionText) && /\b(?:insurance|claim|insurer)\b/i.test(transactionText);
}

function hasUnsupportedSalesReturnContext(transactionText: string): boolean {
  const isSalesReturn =
    /\bsales?\s+returns?\b/i.test(transactionText) ||
    /\bgoods\s+returned\s+(?:by|from)\b/i.test(transactionText) ||
    /\b(?:customer|debtor)\s+returned\s+goods\b/i.test(transactionText) ||
    /^[a-z][a-z.'-]*\s+returned\s+goods\b/i.test(transactionText);

  return (
    isSalesReturn &&
    /\b(?:cash\s+refunded|refund(?:ed)?|gst|discount|settlement|full\s+settlement|partial\s+settlement)\b/i.test(
      transactionText,
    )
  );
}

function hasUnsupportedPurchaseReturnContext(transactionText: string): boolean {
  const isPurchaseReturn =
    /\bpurchase\s+returns?\b/i.test(transactionText) ||
    /\bgoods\s+returned\s+to\b/i.test(transactionText) ||
    /\breturned\s+goods\s+to\b/i.test(transactionText) ||
    /\bgoods\s+purchased\s+returned\b/i.test(transactionText) ||
    /\bgoods\s+returned\s+from\s+purchase\b/i.test(transactionText);

  return (
    isPurchaseReturn &&
    /\b(?:cash\s+refund(?:ed)?|refund\s+received|cash\s+refunded|gst|discount|settlement|full\s+settlement|partial\s+settlement)\b/i.test(
      transactionText,
    )
  );
}

function settlementAmounts(
  transactionText: string,
  kind: "allowed" | "received",
): { fullAmount: number; actualAmount: number; discountAmount: number } | null {
  const amounts = extractAmounts(transactionText);
  if (amounts.length < 2) return null;

  if (hasExplicitDiscount(transactionText, kind) && !hasFullSettlementAmountClue(transactionText)) {
    const actualAmount = amounts[0];
    const discountAmount = amounts[1];
    return { fullAmount: actualAmount + discountAmount, actualAmount, discountAmount };
  }

  const fullAmountFirst = /\baccount\s+of\b/i.test(transactionText) && /\bby\s+paying\b/i.test(transactionText);
  const fullAmount = fullAmountFirst ? amounts[0] : amounts[1];
  const actualAmount = fullAmountFirst ? amounts[1] : amounts[0];
  return { fullAmount, actualAmount, discountAmount: fullAmount - actualAmount };
}

function hasExplicitDiscount(transactionText: string, kind: "allowed" | "received"): boolean {
  return kind === "allowed"
    ? /\b(?:allowed|allowing)\s+discount\b/i.test(transactionText)
    : /\b(?:received|receiving)\s+discount\b/i.test(transactionText);
}

function hasFullSettlementAmountClue(transactionText: string): boolean {
  return /\b(?:full settlement|full and final settlement|account\s+of|against)\b/i.test(transactionText);
}

function buildDiscountAllowedEntry(
  fullAmount: number,
  receivedAmount: number,
  discountAmount: number,
  receiptAccount: "Cash" | "Bank",
  debtorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const debtorLine: CorrectJournalEntry["credits"][number] = {
    account: debtorAccount,
    amount: fullAmount,
  };

  if (partyName) {
    debtorLine.acceptedAccounts = ["Debtor"];
    debtorLine.partyRole = "debtor";
  }

  return {
    debits: [
      { account: receiptAccount, amount: receivedAmount },
      { account: "Discount Allowed", amount: discountAmount },
    ],
    credits: [debtorLine],
  };
}

function buildDiscountReceivedEntry(
  fullAmount: number,
  paidAmount: number,
  discountAmount: number,
  paymentAccount: "Cash" | "Bank",
  creditorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditorLine: CorrectJournalEntry["debits"][number] = {
    account: creditorAccount,
    amount: fullAmount,
  };

  if (partyName) {
    creditorLine.acceptedAccounts = ["Creditor"];
    creditorLine.partyRole = "creditor";
  }

  return {
    debits: [creditorLine],
    credits: [
      { account: paymentAccount, amount: paidAmount },
      { account: "Discount Received", amount: discountAmount },
    ],
  };
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

function buildPartialGoodsSaleEntry(
  totalAmount: number,
  receivedAmount: number,
  balanceAmount: number,
  receiptAccount: "Cash" | "Bank",
  debtorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const balanceDebitLine: CorrectJournalEntry["debits"][number] = {
    account: debtorAccount,
    amount: balanceAmount,
  };

  if (partyName) {
    balanceDebitLine.acceptedAccounts = ["Debtor"];
    balanceDebitLine.partyRole = "debtor";
  }

  return {
    debits: [{ account: receiptAccount, amount: receivedAmount }, balanceDebitLine],
    credits: [{ account: "Sales", amount: totalAmount }],
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

function extractCustomerName(transactionText: string): string | undefined {
  const match =
    /\bsold\s+goods\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bgoods\s+sold\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bsale\s+of\s+goods\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(customer|debtor|cash|bank)$/i.test(normalizedName)) return undefined;

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}

function extractDiscountAllowedParty(transactionText: string): string | undefined {
  const match =
    /\bfrom\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /^([a-z][a-z.'-]*)\s+paid\b/i.exec(transactionText) ??
    /^([a-z][a-z.'-]*)\s+settled\s+account\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(debtor|debtors|cash|bank)$/i);
}

function extractDiscountReceivedParty(transactionText: string): string | undefined {
  const match =
    /\bto\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /^([a-z][a-z.'-]*)\s+accepted\b/i.exec(transactionText) ??
    /\bsettled\s+([a-z][a-z.'-]*)\s+account\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(creditor|creditors|cash|bank)$/i);
}

function normalizeSettlementParty(rawName: string | undefined, reservedPattern: RegExp): string | undefined {
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || reservedPattern.test(normalizedName)) return undefined;

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}
