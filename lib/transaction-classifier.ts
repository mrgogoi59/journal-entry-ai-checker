import { transactionRules } from "./accounting-rules";
import { extractAmount as parseAmount, extractAmounts } from "./amount-parser";
import type { CorrectJournalEntry, GoodsGstTaxLine, GstSetOffLine, TransactionClassification } from "./types";

const MIN_CONFIDENCE = 0.7;
const DIRECT_MATCH_CONFIDENCE = 0.95;
const CASH_PAYMENT_PATTERN = /\bcash\b/i;
const CREDIT_PAYMENT_PATTERN_REGEX = /\b(?:on credit|credit|on account)\b/i;
const DIGITAL_OR_BANK_PAYMENT_PATTERN =
  /\b(?:bank|cheque|check|upi|google\s+pay|gpay|phonepe|paytm|neft|rtgs|imps|online\s+transfer|bank\s+transfer|debit\s+card|card\s+payment|net\s+banking)\b/i;
const UNSUPPORTED_COMPOUND_CONTEXT_PATTERN = /\b(?:gst|discount|depreciation|bad debts?|outstanding|prepaid|accrued)\b/i;
const AMOUNT_TOKEN_PATTERN = "([0-9]+(?:\\.\\d+)?\\s*k|[0-9][0-9,]*(?:\\.\\d+)?)";

const TRANSACTION_SPELLING_CORRECTIONS: Array<[RegExp, string]> = [
  [/\btelefone\b/gi, "telephone"],
  [/\brecieved\b/gi, "received"],
  [/\brecived\b/gi, "received"],
  [/\bcommision\b/gi, "commission"],
  [/\bexpnse\b/gi, "expense"],
  [/\bchargs\b/gi, "charges"],
];

export function classifyTransaction(transactionText: string): TransactionClassification | null {
  const normalizedTransactionText = normalizeTransactionText(transactionText);

  const discountAllowedSettlement = classifyDiscountAllowedSettlement(normalizedTransactionText);
  if (discountAllowedSettlement) return discountAllowedSettlement;
  const discountReceivedSettlement = classifyDiscountReceivedSettlement(normalizedTransactionText);
  if (discountReceivedSettlement) return discountReceivedSettlement;
  const assetSale = classifyAssetSale(normalizedTransactionText);
  if (assetSale) return assetSale;
  const assetPurchaseInstallationCharge = classifyAssetPurchaseInstallationCharge(normalizedTransactionText);
  if (assetPurchaseInstallationCharge) return assetPurchaseInstallationCharge;
  const assetInstallationCharge = classifyAssetInstallationCharge(normalizedTransactionText);
  if (assetInstallationCharge) return assetInstallationCharge;
  const assetGstPurchase = classifyAssetGstPurchase(normalizedTransactionText);
  if (assetGstPurchase) return assetGstPurchase;
  const goodsGstTradeDiscountPurchase = classifyGoodsGstTradeDiscountPurchase(normalizedTransactionText);
  if (goodsGstTradeDiscountPurchase) return goodsGstTradeDiscountPurchase;
  const goodsGstTradeDiscountSale = classifyGoodsGstTradeDiscountSale(normalizedTransactionText);
  if (goodsGstTradeDiscountSale) return goodsGstTradeDiscountSale;
  const goodsGstPurchase = classifyGoodsGstPurchase(normalizedTransactionText);
  if (goodsGstPurchase) return goodsGstPurchase;
  const goodsGstSale = classifyGoodsGstSale(normalizedTransactionText);
  if (goodsGstSale) return goodsGstSale;
  const salesReturnGst = classifySalesReturnGst(normalizedTransactionText);
  if (salesReturnGst) return salesReturnGst;
  const purchaseReturnGst = classifyPurchaseReturnGst(normalizedTransactionText);
  if (purchaseReturnGst) return purchaseReturnGst;
  const gstSetOff = classifyGstSetOff(normalizedTransactionText);
  if (gstSetOff) return gstSetOff;
  const gstPayment = classifyGstPayment(normalizedTransactionText);
  if (gstPayment) return gstPayment;
  const expenseGstPayment = classifyExpenseGstPayment(normalizedTransactionText);
  if (expenseGstPayment) return expenseGstPayment;
  const incomeGstReceipt = classifyIncomeGstReceipt(normalizedTransactionText);
  if (incomeGstReceipt) return incomeGstReceipt;
  if (hasGstMention(normalizedTransactionText)) return null;
  if (hasUnsupportedGoodsTaxAmbiguity(normalizedTransactionText)) return null;
  const partialGoodsPurchase = classifyPartialGoodsPurchase(normalizedTransactionText);
  if (partialGoodsPurchase) return partialGoodsPurchase;
  const partialGoodsSale = classifyPartialGoodsSale(normalizedTransactionText);
  if (partialGoodsSale) return partialGoodsSale;
  if (isPartialBalanceCreditCompound(normalizedTransactionText)) return null;
  if (hasUnsupportedGoodsLossInsuranceContext(normalizedTransactionText)) return null;
  if (hasUnsupportedSalesReturnContext(normalizedTransactionText)) return null;
  if (hasUnsupportedPurchaseReturnContext(normalizedTransactionText)) return null;
  if (hasAssetPurchasePlusInstallationContext(normalizedTransactionText)) return null;
  if (hasAssetPurchaseRepairContext(normalizedTransactionText)) return null;
  if (hasAssetSaleContext(normalizedTransactionText)) return null;

  const rule = transactionRules.find((candidate) =>
    candidate.patterns.some((pattern) => pattern.test(normalizedTransactionText)),
  );

  if (!rule) return null;

  const amount = rule.amountExtractor?.(normalizedTransactionText) ?? parseAmount(normalizedTransactionText);
  if (!amount) return null;

  const confidence = DIRECT_MATCH_CONFIDENCE;
  if (confidence < MIN_CONFIDENCE) return null;

  const partyDetails = rule.partyExtractor?.(normalizedTransactionText) ?? null;
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

function normalizeTransactionText(value: string): string {
  return TRANSACTION_SPELLING_CORRECTIONS.reduce(
    (normalized, [pattern, replacement]) => normalized.replace(pattern, replacement),
    value,
  );
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

function classifyGoodsGstPurchase(transactionText: string): TransactionClassification | null {
  if (!isGoodsPurchaseWithGst(transactionText)) return null;
  if (hasUnsupportedGstContext(transactionText)) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const partyName = paymentAccount === "Creditor" ? extractGstSupplierName(transactionText) : undefined;
  const creditorAccount = partyName ?? paymentAccount;
  const expectedEntry = buildGoodsGstPurchaseEntry(
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    paymentAccount,
    creditorAccount,
    partyName,
  );

  return {
    transaction_type: `goods_gst_${gst.transactionTypePrefix ?? ""}${gst.gstInclusive ? "inclusive_" : ""}purchase_${
      paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit"
    }`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: "Purchases",
    creditAccount: creditorAccount,
    expectedDebitAccount: "Purchases",
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: "Purchases",
    genericCreditAccount: paymentAccount,
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods were purchased with GST. Purchases is debited for the goods value, Input GST is debited for input tax credit, and Cash, Bank, Creditor, or the named supplier is credited for the invoice total.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "goods_gst_purchase",
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      gstInclusive: gst.gstInclusive,
      taxLines: gst.taxLines,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function classifyGoodsGstTradeDiscountPurchase(transactionText: string): TransactionClassification | null {
  if (!isGoodsPurchaseWithGst(transactionText) || !hasTradeDiscountContext(transactionText)) return null;
  if (hasUnsupportedTradeDiscountGstContext(transactionText)) return null;

  const gst = extractTradeDiscountGstDetails(transactionText);
  if (!gst) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const partyName = paymentAccount === "Creditor" ? extractGstSupplierName(transactionText) : undefined;
  const creditorAccount = partyName ?? paymentAccount;
  const expectedEntry = buildGoodsGstPurchaseEntry(
    gst.netAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    paymentAccount,
    creditorAccount,
    partyName,
  );
  const taxPrefix = tradeDiscountTaxPrefix(gst.taxLines);
  const paymentSuffix = paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `goods_gst_trade_discount_${taxPrefix}purchase_${paymentSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: "Purchases",
    creditAccount: creditorAccount,
    expectedDebitAccount: "Purchases",
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: "Purchases",
    genericCreditAccount: paymentAccount,
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods were purchased with trade discount and GST. Trade discount is deducted before GST, Purchases is debited for the net taxable value, Input GST is debited, and Cash, Bank, Creditor, or the named supplier is credited for the invoice total.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "goods_gst_purchase",
      grossAmount: gst.grossAmount,
      tradeDiscountAmount: gst.discountAmount,
      tradeDiscountRate: gst.discountRate,
      baseAmount: gst.netAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      taxLines: gst.taxLines,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function classifyAssetGstPurchase(transactionText: string): TransactionClassification | null {
  if (!isAssetPurchaseWithGst(transactionText)) return null;
  if (hasUnsupportedAssetGstContext(transactionText)) return null;

  const asset = extractAssetPurchaseItem(transactionText);
  if (!asset) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst || (gst.gstInclusive && gst.taxLines?.length)) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const partyName = paymentAccount === "Creditor" ? extractAssetGstSupplierName(transactionText) : undefined;
  const creditorAccount = partyName ?? paymentAccount;
  const expectedEntry = buildAssetGstPurchaseEntry(
    asset.account,
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    paymentAccount,
    creditorAccount,
    partyName,
  );

  const gstPrefix = gst.taxLines?.length
    ? gst.taxLines.length === 1
      ? "igst_"
      : "cgst_sgst_"
    : gst.gstInclusive
      ? "inclusive_"
      : "";
  const paymentSuffix = paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `asset_gst_${gstPrefix}purchase_${asset.key}_${paymentSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: asset.account,
    creditAccount: creditorAccount,
    expectedDebitAccount: asset.account,
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: asset.account,
    genericCreditAccount: paymentAccount,
    amount: gst.invoiceTotal,
    explanationLogic:
      "A fixed asset was purchased with GST. The asset is debited for the base value, Input GST is debited for input tax credit, and Cash, Bank, Creditor, or the named supplier is credited for the invoice total.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "asset_gst_purchase",
      assetAccount: asset.account,
      assetLabel: asset.label,
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      gstInclusive: gst.gstInclusive,
      taxLines: gst.taxLines,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function classifyAssetInstallationCharge(transactionText: string): TransactionClassification | null {
  if (!isAssetInstallationCharge(transactionText)) return null;
  if (hasGstMention(transactionText)) return null;
  if (hasAssetPurchasePlusInstallationContext(transactionText)) return null;

  const asset = extractAssetInstallationItem(transactionText);
  const charge = extractAssetInstallationCharge(transactionText);
  if (!asset || !charge) return null;

  const amount = parseAmount(transactionText);
  if (!amount) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const creditorAccount = paymentAccount;
  const expectedEntry: CorrectJournalEntry = {
    debits: [{ account: asset.account, amount }],
    credits: [{ account: creditorAccount, amount }],
  };
  const paymentSuffix = paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `asset_installation_${charge.key}_${asset.key}_${paymentSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: asset.account,
    creditAccount: creditorAccount,
    expectedDebitAccount: asset.account,
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: asset.account,
    genericCreditAccount: paymentAccount,
    amount,
    explanationLogic:
      "Installation, setup, fitting, freight, or carriage charges directly related to a fixed asset are capitalized into the asset account. The asset is debited and Cash, Bank, or Creditor is credited.",
    expectedEntry,
    compoundDetails: {
      kind: "asset_installation_charge",
      assetAccount: asset.account,
      assetLabel: asset.label,
      chargeLabel: charge.label,
      amount,
      paymentAccount,
      creditorAccount,
    },
  };
}

function classifyAssetPurchaseInstallationCharge(transactionText: string): TransactionClassification | null {
  if (!hasAssetPurchasePlusInstallationContext(transactionText)) return null;
  if (hasGstMention(transactionText)) return null;
  if (hasAssetPurchaseRepairContext(transactionText)) return null;

  const asset = extractAssetInstallationItem(transactionText);
  const charge = extractAssetInstallationCharge(transactionText);
  if (!asset || !charge) return null;

  const amounts = extractAmounts(transactionText);
  const assetAmount = amounts[0];
  const chargeAmount = amounts[1];
  if (!assetAmount || !chargeAmount) return null;

  if (hasMixedAssetPurchaseInstallationPaymentModes(transactionText)) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const partyName = paymentAccount === "Creditor" ? extractAssetGstSupplierName(transactionText) : undefined;
  const creditorAccount = partyName ?? paymentAccount;
  const totalAmount = roundCurrency(assetAmount + chargeAmount);
  const creditLine: CorrectJournalEntry["credits"][number] = { account: creditorAccount, amount: totalAmount };
  if (partyName && paymentAccount === "Creditor") {
    creditLine.acceptedAccounts = ["Creditor"];
    creditLine.partyRole = "creditor";
  }

  const paymentSuffix = paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `asset_purchase_installation_${charge.key}_${asset.key}_${paymentSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: asset.account,
    creditAccount: creditorAccount,
    expectedDebitAccount: asset.account,
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: asset.account,
    genericCreditAccount: paymentAccount,
    amount: totalAmount,
    explanationLogic:
      "A fixed asset was purchased and installation-related charges were paid to bring it into usable condition. The asset is debited with the total cost and Cash, Bank, Creditor, or the named supplier is credited.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry: {
      debits: [{ account: asset.account, amount: totalAmount }],
      credits: [creditLine],
    },
    compoundDetails: {
      kind: "asset_purchase_installation_charge",
      assetAccount: asset.account,
      assetLabel: asset.label,
      chargeLabel: charge.label,
      assetAmount,
      chargeAmount,
      totalAmount,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function classifyAssetSale(transactionText: string): TransactionClassification | null {
  if (!hasAssetSaleContext(transactionText)) return null;

  const disposalSale = classifyAssetSaleWithAccumulatedDepreciation(transactionText);
  if (disposalSale) return disposalSale;

  if (hasUnsupportedAssetSaleContext(transactionText)) return null;

  const asset = extractAssetPurchaseItem(transactionText);
  if (!asset) return null;

  const saleAmounts = extractAssetSaleAmounts(transactionText);
  if (!saleAmounts) return null;
  const { bookValue, saleValue } = saleAmounts;

  const partyName = extractAssetSaleBuyerName(transactionText);
  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CASH_PAYMENT_PATTERN.test(transactionText)
      ? "Cash"
      : partyName
        ? "Debtor"
        : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
          ? "Debtor"
          : null;
  if (!receiptAccount) return null;

  const debtorAccount = receiptAccount === "Debtor" ? (partyName ?? "Debtor") : receiptAccount;
  const expectedEntry = buildAssetSaleEntry(asset.account, saleValue, bookValue, debtorAccount);
  if (partyName && receiptAccount === "Debtor") {
    const receiptLine = expectedEntry.debits.find((line) => line.account === debtorAccount && line.amount === saleValue);
    if (receiptLine) {
      receiptLine.acceptedAccounts = ["Debtor"];
      receiptLine.partyRole = "debtor";
    }
  }

  const receiptSuffix = receiptAccount === "Bank" ? "bank" : receiptAccount === "Cash" ? "cash" : "credit";
  const resultPrefix =
    bookValue === undefined || saleValue === bookValue ? "" : saleValue < bookValue ? "loss_" : "profit_";

  return {
    transaction_type: `asset_sale_${resultPrefix}${asset.key}_${receiptSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: debtorAccount,
    creditAccount: asset.account,
    expectedDebitAccount: debtorAccount,
    expectedCreditAccount: asset.account,
    genericDebitAccount: receiptAccount,
    genericCreditAccount: asset.account,
    amount: saleValue,
    explanationLogic:
      bookValue === undefined
        ? "A fixed asset was sold without profit/loss calculation. Cash, Bank, Debtor, or the named buyer is debited, and the fixed asset account is credited because the asset goes out of the business."
        : "A fixed asset was sold with book value and sale value given. Cash, Bank, Debtor, or the named buyer is debited for sale value, the asset is credited for book value, and profit or loss is recorded.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "asset_sale",
      assetAccount: asset.account,
      assetLabel: asset.label,
      amount: saleValue,
      bookValue,
      saleValue,
      profitAmount: bookValue !== undefined && saleValue > bookValue ? roundCurrency(saleValue - bookValue) : undefined,
      lossAmount: bookValue !== undefined && saleValue < bookValue ? roundCurrency(bookValue - saleValue) : undefined,
      receiptAccount,
      debtorAccount,
      partyName,
    },
  };
}

function classifyAssetSaleWithAccumulatedDepreciation(
  transactionText: string,
): TransactionClassification | null {
  if (!hasAssetSaleAccumulatedDepreciationContext(transactionText)) return null;
  if (hasGstMention(transactionText)) return null;
  if (/\b(?:balance\s+on\s+credit|partly|partial|received\s+rs\.?\s*|received\s+₹)\b/i.test(transactionText)) {
    return null;
  }
  if (/\b(?:revaluation\s+reserve|insurance\s+claim|claim\s+admitted)\b/i.test(transactionText)) return null;

  const asset = extractAssetPurchaseItem(transactionText);
  if (!asset || !isDepreciableDisposalAsset(asset)) return null;

  const saleAmounts = extractAssetSaleDisposalAmounts(transactionText);
  if (!saleAmounts) return null;
  const { originalCost, accumulatedDepreciation, saleValue } = saleAmounts;
  const bookValue = roundCurrency(originalCost - accumulatedDepreciation);
  if (bookValue < 0) return null;

  const partyName = extractAssetSaleBuyerName(transactionText);
  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CASH_PAYMENT_PATTERN.test(transactionText)
      ? "Cash"
      : partyName
        ? "Debtor"
        : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
          ? "Debtor"
          : null;
  if (!receiptAccount) return null;

  const debtorAccount = receiptAccount === "Debtor" ? (partyName ?? "Debtor") : receiptAccount;
  const profitAmount = saleValue > bookValue ? roundCurrency(saleValue - bookValue) : undefined;
  const lossAmount = saleValue < bookValue ? roundCurrency(bookValue - saleValue) : undefined;
  const expectedEntry = buildAssetSaleDisposalEntry(
    asset.account,
    originalCost,
    accumulatedDepreciation,
    saleValue,
    debtorAccount,
    profitAmount,
    lossAmount,
  );
  if (partyName && receiptAccount === "Debtor") {
    const receiptLine = expectedEntry.debits.find((line) => line.account === debtorAccount && line.amount === saleValue);
    if (receiptLine) {
      receiptLine.acceptedAccounts = ["Debtor"];
      receiptLine.partyRole = "debtor";
    }
  }

  const receiptSuffix = receiptAccount === "Bank" ? "bank" : receiptAccount === "Cash" ? "cash" : "credit";
  const resultPrefix = lossAmount ? "disposal_loss_" : profitAmount ? "disposal_profit_" : "disposal_";

  return {
    transaction_type: `asset_sale_${resultPrefix}${asset.key}_${receiptSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: "Asset Disposal",
    creditAccount: asset.account,
    expectedDebitAccount: "Asset Disposal",
    expectedCreditAccount: asset.account,
    genericDebitAccount: "Asset Disposal",
    genericCreditAccount: asset.account,
    amount: originalCost,
    explanationLogic:
      "A fixed asset was sold with accumulated depreciation. Asset Disposal A/c is used to transfer asset cost, remove accumulated depreciation, record sale proceeds, and close profit or loss.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "asset_sale",
      assetAccount: asset.account,
      assetLabel: asset.label,
      amount: saleValue,
      originalCost,
      accumulatedDepreciation,
      bookValue,
      saleValue,
      profitAmount,
      lossAmount,
      usesDisposalAccount: true,
      receiptAccount,
      debtorAccount,
      partyName,
    },
  };
}

function classifyGoodsGstSale(transactionText: string): TransactionClassification | null {
  if (!isGoodsSaleWithGst(transactionText)) return null;
  if (hasUnsupportedGstContext(transactionText)) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst) return null;

  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Debtor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!receiptAccount) return null;

  const partyName = receiptAccount === "Debtor" ? extractGstCustomerName(transactionText) : undefined;
  const debtorAccount = partyName ?? receiptAccount;
  const expectedEntry = buildGoodsGstSaleEntry(
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    receiptAccount,
    debtorAccount,
    partyName,
  );

  return {
    transaction_type: `goods_gst_${gst.transactionTypePrefix ?? ""}${gst.gstInclusive ? "inclusive_" : ""}sale_${
      receiptAccount === "Bank" ? "bank" : receiptAccount === "Cash" ? "cash" : "credit"
    }`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: debtorAccount,
    creditAccount: "Sales",
    expectedDebitAccount: debtorAccount,
    expectedCreditAccount: "Sales",
    genericDebitAccount: receiptAccount,
    genericCreditAccount: "Sales",
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods were sold with GST. Cash, Bank, Debtor, or the named customer is debited for the invoice total, Sales is credited for the goods value, and Output GST is credited for GST payable.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "goods_gst_sale",
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      gstInclusive: gst.gstInclusive,
      taxLines: gst.taxLines,
      receiptAccount,
      debtorAccount,
      partyName,
    },
  };
}

function classifyGoodsGstTradeDiscountSale(transactionText: string): TransactionClassification | null {
  if (!isGoodsSaleWithGst(transactionText) || !hasTradeDiscountContext(transactionText)) return null;
  if (hasUnsupportedTradeDiscountGstContext(transactionText)) return null;

  const gst = extractTradeDiscountGstDetails(transactionText);
  if (!gst) return null;

  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText)
      ? "Debtor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!receiptAccount) return null;

  const partyName = receiptAccount === "Debtor" ? extractGstCustomerName(transactionText) : undefined;
  const debtorAccount = partyName ?? receiptAccount;
  const expectedEntry = buildGoodsGstSaleEntry(
    gst.netAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    receiptAccount,
    debtorAccount,
    partyName,
  );
  const taxPrefix = tradeDiscountTaxPrefix(gst.taxLines);
  const receiptSuffix = receiptAccount === "Bank" ? "bank" : receiptAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `goods_gst_trade_discount_${taxPrefix}sale_${receiptSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: debtorAccount,
    creditAccount: "Sales",
    expectedDebitAccount: debtorAccount,
    expectedCreditAccount: "Sales",
    genericDebitAccount: receiptAccount,
    genericCreditAccount: "Sales",
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods were sold with trade discount and GST. Trade discount is deducted before GST, Cash, Bank, Debtor, or the named customer is debited for the invoice total, Sales is credited for the net taxable value, and Output GST is credited.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "goods_gst_sale",
      grossAmount: gst.grossAmount,
      tradeDiscountAmount: gst.discountAmount,
      tradeDiscountRate: gst.discountRate,
      baseAmount: gst.netAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      taxLines: gst.taxLines,
      receiptAccount,
      debtorAccount,
      partyName,
    },
  };
}

function classifySalesReturnGst(transactionText: string): TransactionClassification | null {
  if (!isSalesReturnWithGst(transactionText)) return null;
  if (hasUnsupportedReturnGstContext(transactionText)) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst || gst.gstInclusive) return null;
  if (!gst.gstRate && !gst.taxLines?.length && extractAmounts(transactionText).length < 2) return null;

  const partyName = extractSalesReturnGstCustomerName(transactionText);
  const customerAccount = partyName ?? "Debtor";
  const expectedEntry = buildSalesReturnGstEntry(
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    customerAccount,
    partyName,
  );
  const taxPrefix = returnGstTaxPrefix(gst.taxLines);

  return {
    transaction_type: `sales_return_gst_${taxPrefix}${partyName ? "named" : "generic"}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: "Sales Return",
    creditAccount: customerAccount,
    expectedDebitAccount: "Sales Return",
    expectedCreditAccount: customerAccount,
    genericDebitAccount: "Sales Return",
    genericCreditAccount: "Debtor",
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods sold earlier were returned with GST. Sales Return is debited, Output GST is debited because output tax liability is reduced, and the customer or debtor is credited for the total value including GST.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "sales_return_gst",
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      taxLines: gst.taxLines,
      customerAccount,
      partyName,
    },
  };
}

function classifyPurchaseReturnGst(transactionText: string): TransactionClassification | null {
  if (!isPurchaseReturnWithGst(transactionText)) return null;
  if (hasUnsupportedReturnGstContext(transactionText)) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst || gst.gstInclusive) return null;
  if (!gst.gstRate && !gst.taxLines?.length && extractAmounts(transactionText).length < 2) return null;

  const partyName = extractPurchaseReturnGstSupplierName(transactionText);
  const supplierAccount = partyName ?? "Creditor";
  const expectedEntry = buildPurchaseReturnGstEntry(
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    supplierAccount,
    partyName,
  );
  const taxPrefix = returnGstTaxPrefix(gst.taxLines);

  return {
    transaction_type: `purchase_return_gst_${taxPrefix}${partyName ? "named" : "generic"}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: supplierAccount,
    creditAccount: "Purchase Return",
    expectedDebitAccount: supplierAccount,
    expectedCreditAccount: "Purchase Return",
    genericDebitAccount: "Creditor",
    genericCreditAccount: "Purchase Return",
    amount: gst.invoiceTotal,
    explanationLogic:
      "Goods purchased earlier were returned with GST. The supplier or creditor is debited for the total value including GST, Purchase Return is credited, and Input GST is credited because input tax credit is reduced.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "purchase_return_gst",
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      taxLines: gst.taxLines,
      supplierAccount,
      partyName,
    },
  };
}

function classifyGstSetOff(transactionText: string): TransactionClassification | null {
  if (!isGstSetOff(transactionText)) return null;
  if (hasUnsupportedGstSetOffPaymentContext(transactionText)) return null;

  const lines = extractGstSetOffLines(transactionText);
  if (!lines.length) return null;

  const hasPayment = hasGstBalancePaymentClue(transactionText);
  const remainingPayable = roundCurrency(lines.reduce((total, line) => total + line.remainingAmount, 0));
  const paymentAmount = hasPayment ? extractExplicitRemainingPaymentAmount(transactionText) ?? remainingPayable : undefined;
  if (hasPayment && (!paymentAmount || paymentAmount !== remainingPayable || !DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText))) {
    return null;
  }

  const variant = gstSetOffVariant(lines);
  const expectedEntry = buildGstSetOffEntry(lines, paymentAmount);
  const inputLabel = lines.map((line) => line.inputAccount).join(" and ");
  const outputLabel = lines.map((line) => line.outputAccount).join(" and ");

  return {
    transaction_type: paymentAmount ? `gst_setoff_${variant}_with_payment` : `gst_setoff_${variant}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: lines[0].outputAccount,
    creditAccount: lines[0].inputAccount,
    expectedDebitAccount: lines[0].outputAccount,
    expectedCreditAccount: lines[0].inputAccount,
    amount: paymentAmount
      ? roundCurrency(lines.reduce((total, line) => total + line.setOffAmount, 0) + paymentAmount)
      : roundCurrency(lines.reduce((total, line) => total + line.setOffAmount, 0)),
    explanationLogic:
      "Input GST credit is set off against Output GST liability. Output GST is debited because liability decreases, and Input GST is credited because input tax credit is used.",
    expectedEntry,
    compoundDetails: {
      kind: "gst_setoff",
      variant,
      lines,
      remainingPayable,
      paymentAmount,
    },
    genericDebitAccount: outputLabel,
    genericCreditAccount: inputLabel,
  };
}

function classifyGstPayment(transactionText: string): TransactionClassification | null {
  if (!isGstPayment(transactionText)) return null;
  if (hasUnsupportedGstSetOffPaymentContext(transactionText)) return null;
  if (!DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)) return null;

  const lines = extractGstPaymentLines(transactionText);
  if (!lines.length) return null;

  const variant = gstPaymentVariant(lines.map((line) => line.outputAccount));
  const paymentAmount = roundCurrency(lines.reduce((total, line) => total + line.amount, 0));
  const expectedEntry = buildGstPaymentEntry(lines);

  return {
    transaction_type: `gst_payment_${variant}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: lines[0].outputAccount,
    creditAccount: "Bank",
    expectedDebitAccount: lines[0].outputAccount,
    expectedCreditAccount: "Bank",
    genericDebitAccount: lines.map((line) => line.outputAccount).join(" and "),
    genericCreditAccount: "Bank",
    amount: paymentAmount,
    explanationLogic:
      "GST liability is paid through bank. Output GST is debited because the liability decreases, and Bank is credited because bank balance decreases.",
    expectedEntry,
    compoundDetails: {
      kind: "gst_payment",
      variant,
      lines,
      paymentAmount,
    },
  };
}

function classifyExpenseGstPayment(transactionText: string): TransactionClassification | null {
  if (!isExpensePaymentWithGst(transactionText)) return null;
  if (hasUnsupportedGstContext(transactionText)) return null;
  if (hasInclusiveGstWording(transactionText) && /\b(?:cgst|central\s+gst|sgst|state\s+gst|igst|integrated\s+gst)\b/i.test(transactionText)) {
    return null;
  }

  const expense = extractGstExpenseItem(transactionText);
  if (!expense) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst) return null;

  const paymentAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText) || /\b(?:payable|unpaid|due)\b/i.test(transactionText)
      ? "Creditor"
      : CASH_PAYMENT_PATTERN.test(transactionText)
        ? "Cash"
        : null;
  if (!paymentAccount) return null;

  const partyName = paymentAccount === "Creditor" ? extractExpenseGstSupplierName(transactionText) : undefined;
  const creditorAccount = partyName ?? paymentAccount;
  const expectedEntry = buildExpenseGstPaymentEntry(
    expense.account,
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    paymentAccount,
    creditorAccount,
    partyName,
  );

  const gstPrefix = gst.taxLines?.length
    ? gst.taxLines.length === 1
      ? "igst_"
      : "cgst_sgst_"
    : gst.gstInclusive
      ? "inclusive_"
      : "";
  const paymentSuffix = paymentAccount === "Bank" ? "bank" : paymentAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `expense_gst_${gstPrefix}${expense.key}_${paymentSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: expense.account,
    creditAccount: creditorAccount,
    expectedDebitAccount: expense.account,
    expectedCreditAccount: creditorAccount,
    genericDebitAccount: expense.account,
    genericCreditAccount: paymentAccount,
    amount: gst.invoiceTotal,
    explanationLogic:
      "A selected business expense was paid or became payable with GST. The expense is debited for the base value, Input GST is debited for input tax credit, and Cash, Bank, Creditor, or the named supplier is credited for the invoice total.",
    partyName,
    partyRole: partyName ? "creditor" : undefined,
    partyAccountSide: partyName ? "credit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "expense_gst_payment",
      expenseAccount: expense.account,
      expenseLabel: expense.label,
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      gstInclusive: gst.gstInclusive,
      taxLines: gst.taxLines,
      paymentAccount,
      creditorAccount,
      partyName,
    },
  };
}

function classifyIncomeGstReceipt(transactionText: string): TransactionClassification | null {
  if (!isIncomeReceiptWithGst(transactionText)) return null;
  if (hasUnsupportedGstContext(transactionText)) return null;
  if (hasInclusiveGstWording(transactionText) && /\b(?:cgst|central\s+gst|sgst|state\s+gst|igst|integrated\s+gst)\b/i.test(transactionText)) {
    return null;
  }

  const income = extractGstIncomeItem(transactionText);
  if (!income) return null;

  const gst = extractGstDetails(transactionText);
  if (!gst) return null;

  const partyName = extractIncomeGstCustomerName(transactionText);
  const receiptAccount = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText)
    ? "Bank"
    : CASH_PAYMENT_PATTERN.test(transactionText)
      ? "Cash"
      : partyName || CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText) || /\b(?:receivable|due\s+from|billed\s+to)\b/i.test(transactionText)
        ? "Debtor"
        : null;
  if (!receiptAccount) return null;

  const debtorAccount = receiptAccount === "Debtor" ? (partyName ?? "Debtor") : receiptAccount;
  const expectedEntry = buildIncomeGstReceiptEntry(
    income.account,
    gst.baseAmount,
    gst.gstAmount,
    gst.invoiceTotal,
    gst.taxLines,
    receiptAccount,
    debtorAccount,
    partyName,
  );

  const gstPrefix = gst.taxLines?.length
    ? gst.taxLines.length === 1
      ? "igst_"
      : "cgst_sgst_"
    : gst.gstInclusive
      ? "inclusive_"
      : "";
  const receiptSuffix = receiptAccount === "Bank" ? "bank" : receiptAccount === "Cash" ? "cash" : "credit";

  return {
    transaction_type: `income_gst_${gstPrefix}${income.key}_${receiptSuffix}`,
    confidence: DIRECT_MATCH_CONFIDENCE,
    debitAccount: debtorAccount,
    creditAccount: income.account,
    expectedDebitAccount: debtorAccount,
    expectedCreditAccount: income.account,
    genericDebitAccount: receiptAccount,
    genericCreditAccount: income.account,
    amount: gst.invoiceTotal,
    explanationLogic:
      "A selected income or service receipt was earned with GST. Cash, Bank, Debtor, or the named customer is debited for the invoice total, income is credited for the base value, and Output GST is credited for GST payable.",
    partyName,
    partyRole: partyName ? "debtor" : undefined,
    partyAccountSide: partyName ? "debit" : undefined,
    expectedEntry,
    compoundDetails: {
      kind: "income_gst_receipt",
      incomeAccount: income.account,
      incomeLabel: income.label,
      baseAmount: gst.baseAmount,
      gstAmount: gst.gstAmount,
      invoiceTotal: gst.invoiceTotal,
      gstRate: gst.gstRate,
      gstInclusive: gst.gstInclusive,
      taxLines: gst.taxLines,
      receiptAccount,
      debtorAccount,
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

interface AssetPurchaseItem {
  key: string;
  label: string;
  account: string;
  pattern: RegExp;
}

interface GstExpenseItem {
  key: string;
  label: string;
  account: string;
  pattern: RegExp;
}

interface GstIncomeItem {
  key: string;
  label: string;
  account: string;
  pattern: RegExp;
}

const gstExpenseItems: GstExpenseItem[] = [
  {
    key: "legal_charges",
    label: "legal charges",
    account: "Legal Charges",
    pattern: /\blegal\s+(?:charges|fees|expense)\b|\blawyer\s+fees\b/i,
  },
  {
    key: "repairs",
    label: "repairs",
    account: "Repairs Expense",
    pattern: /\brepairs?\b|\brepair\s+charges\b|\bmaintenance\s+expense\b/i,
  },
  {
    key: "advertisement",
    label: "advertisement expense",
    account: "Advertisement Expense",
    pattern: /\badvertis(?:ement|ing)(?:\s+expense)?\b/i,
  },
  {
    key: "freight",
    label: "freight",
    account: "Freight Expense",
    pattern: /\bfreight(?:\s+expense|\s+charges)?\b/i,
  },
  {
    key: "carriage",
    label: "carriage",
    account: "Carriage Expense",
    pattern: /\bcarriage(?:\s+expense)?\b/i,
  },
  {
    key: "printing_stationery",
    label: "printing and stationery",
    account: "Printing and Stationery Expense",
    pattern: /\bprinting\s+and\s+stationery\b|\bstationery(?:\s+expense)?\b|\bprinting\s+charges\b/i,
  },
  {
    key: "telephone",
    label: "telephone bill",
    account: "Telephone Expense",
    pattern: /\btelephone(?:\s+bill|\s+expense)?\b|\bphone\s+bill\b/i,
  },
  {
    key: "internet",
    label: "internet bill",
    account: "Internet Expense",
    pattern: /\binternet(?:\s+bill|\s+expense)?\b|\bbroadband\s+bill\b/i,
  },
  {
    key: "office_expenses",
    label: "office expenses",
    account: "Office Expenses",
    pattern: /\b(?:general\s+)?office\s+expenses?\b/i,
  },
  {
    key: "professional_fees",
    label: "professional fees",
    account: "Professional Fees Expense",
    pattern:
      /\bprofessional\s+(?:fees?|charges)(?:\s+expense)?\b|\bconsultancy\s+(?:fees?|expense)\b|\bconsultant\s+fees?\b/i,
  },
];

const gstIncomeItems: GstIncomeItem[] = [
  {
    key: "service_income",
    label: "service income",
    account: "Service Income",
    pattern: /\bservice\s+(?:income|fees?|revenue)\b/i,
  },
  {
    key: "consultancy_income",
    label: "consultancy fees",
    account: "Consultancy Income",
    pattern: /\bconsultancy\s+(?:fees?|income)\b|\bconsulting\s+(?:fees?|income)\b/i,
  },
  {
    key: "professional_fees",
    label: "professional fees",
    account: "Professional Fees Income",
    pattern: /\bprofessional\s+(?:fees?|income)(?:\s+received)?\b|\bprofessional\s+fees?\s+received\b/i,
  },
  {
    key: "tuition_income",
    label: "tuition fees",
    account: "Tuition Income",
    pattern: /\btuition\s+(?:fees?|income)\b|\bcoaching\s+fees?\b|\bclass\s+fees?\b/i,
  },
  {
    key: "royalty_income",
    label: "royalty",
    account: "Royalty Income",
    pattern: /\broyalty(?:\s+income|\s+received)?\b/i,
  },
  {
    key: "rent_income",
    label: "rent",
    account: "Rent Income",
    pattern: /\brent(?:\s+income|\s+received|\s+earned)?\b/i,
  },
];

const assetPurchaseItems: AssetPurchaseItem[] = [
  { key: "machinery", label: "machinery", account: "Machinery", pattern: /\bmachinery\b/i },
  {
    key: "furniture",
    label: "furniture",
    account: "Furniture",
    pattern: /\b(?:furniture|tables?|chairs?|desks?|almirah|cupboard|bookshelf|office\s+tables?|office\s+chairs?)\b/i,
  },
  { key: "laptop", label: "laptop", account: "Computer", pattern: /\b(?:laptops?|desktops?)\b/i },
  { key: "computer", label: "computer", account: "Computer", pattern: /\b(?:computers?|computer\s+equipment)\b/i },
  { key: "printer", label: "printer", account: "Equipment", pattern: /\b(?:printers?|scanners?)\b/i },
  { key: "mobile_phone", label: "mobile phone", account: "Equipment", pattern: /\b(?:mobile\s+phones?|mobiles?|phones?)\b/i },
  {
    key: "air_conditioner",
    label: "air conditioner",
    account: "Equipment",
    pattern: /\b(?:air\s+conditioners?|ac|a\.c\.)\b/i,
  },
  { key: "fan", label: "fan", account: "Equipment", pattern: /\bfans?\b/i },
  { key: "camera", label: "camera", account: "Equipment", pattern: /\bcameras?\b/i },
  { key: "generator", label: "generator", account: "Equipment", pattern: /\bgenerators?\b/i },
  { key: "tools", label: "tools", account: "Equipment", pattern: /\btools?\b/i },
  { key: "office_equipment", label: "office equipment", account: "Equipment", pattern: /\b(?:office\s+equipment|equipment)\b/i },
  { key: "land", label: "land", account: "Land", pattern: /\bland\b/i },
  { key: "building", label: "building", account: "Building", pattern: /\bbuildings?\b/i },
  { key: "vehicle", label: "vehicle", account: "Vehicle", pattern: /\b(?:vehicles?|cars?|vans?|bikes?|scooters?)\b/i },
];

interface AssetInstallationCharge {
  key: string;
  label: string;
  pattern: RegExp;
}

const assetInstallationCharges: AssetInstallationCharge[] = [
  {
    key: "installation",
    label: "installation charges",
    pattern: /\binstallation\s+(?:charges?|expense|cost)\b/i,
  },
  { key: "erection", label: "erection charges", pattern: /\berection\s+charges?\b/i },
  { key: "fitting", label: "fitting charges", pattern: /\bfitting\s+charges?\b/i },
  { key: "setup", label: "setup charges", pattern: /\bsetup\s+(?:charges?|cost)\b/i },
  { key: "freight", label: "freight", pattern: /\bfreight\b/i },
  { key: "carriage", label: "carriage", pattern: /\bcarriage(?:\s+inward)?\b/i },
  { key: "transport", label: "transport charges", pattern: /\btransport\s+charges?\b/i },
];

const assetInstallationAccounts = new Set(["Machinery", "Furniture", "Computer", "Equipment", "Vehicle", "Building"]);

function isAssetPurchaseWithGst(transactionText: string): boolean {
  return (
    /\b(?:bought|purchased|purchase)\b/i.test(transactionText) &&
    hasGstMention(transactionText) &&
    Boolean(extractAssetPurchaseItem(transactionText))
  );
}

function extractAssetPurchaseItem(transactionText: string): AssetPurchaseItem | null {
  return assetPurchaseItems.find((asset) => asset.pattern.test(transactionText)) ?? null;
}

function isAssetInstallationCharge(transactionText: string): boolean {
  return Boolean(extractAssetInstallationItem(transactionText) && extractAssetInstallationCharge(transactionText));
}

function extractAssetInstallationItem(transactionText: string): AssetPurchaseItem | null {
  const asset = extractAssetPurchaseItem(transactionText);
  if (!asset || !assetInstallationAccounts.has(asset.account)) return null;
  return asset;
}

function extractAssetInstallationCharge(transactionText: string): AssetInstallationCharge | null {
  return assetInstallationCharges.find((charge) => charge.pattern.test(transactionText)) ?? null;
}

function hasAssetPurchasePlusInstallationContext(transactionText: string): boolean {
  return (
    /\b(?:bought|purchased|purchase)\b/i.test(transactionText) &&
    Boolean(extractAssetInstallationItem(transactionText)) &&
    hasAssetInstallationCostClue(transactionText)
  );
}

function hasAssetInstallationCostClue(transactionText: string): boolean {
  return Boolean(extractAssetInstallationCharge(transactionText)) || /\binstallation\b/i.test(transactionText);
}

function hasMixedAssetPurchaseInstallationPaymentModes(transactionText: string): boolean {
  const hasCash = CASH_PAYMENT_PATTERN.test(transactionText);
  const hasBank = DIGITAL_OR_BANK_PAYMENT_PATTERN.test(transactionText);
  const hasCredit = CREDIT_PAYMENT_PATTERN_REGEX.test(transactionText);
  return [hasCash, hasBank, hasCredit].filter(Boolean).length > 1;
}

function hasAssetPurchaseRepairContext(transactionText: string): boolean {
  return (
    /\b(?:bought|purchased|purchase)\b/i.test(transactionText) &&
    Boolean(extractAssetInstallationItem(transactionText)) &&
    /\b(?:repairs?|repair\s+charges?|maintenance\s+charges?|maintenance\s+expense)\b/i.test(transactionText)
  );
}

function hasAssetSaleContext(transactionText: string): boolean {
  return /\b(?:sold|sale\s+of)\b/i.test(transactionText) && Boolean(extractAssetPurchaseItem(transactionText));
}

function hasUnsupportedAssetSaleContext(transactionText: string): boolean {
  return (
    hasGstMention(transactionText) ||
    /\b(?:profit|loss|accumulated\s+depreciation|depreciation|disposal)\b/i.test(transactionText) ||
    /\b(?:balance\s+on\s+credit|partly|partial|received\s+rs\.?\s*|received\s+₹)\b/i.test(transactionText)
  );
}

function hasAssetSaleAccumulatedDepreciationContext(transactionText: string): boolean {
  return /\b(?:accumulated\s+depreciation|provision\s+for\s+depreciation|depreciation\s+reserve)\b/i.test(
    transactionText,
  );
}

function isDepreciableDisposalAsset(asset: AssetPurchaseItem): boolean {
  return asset.account !== "Land" && asset.account !== "Building";
}

function extractAssetSaleAmounts(transactionText: string): { saleValue: number; bookValue?: number } | null {
  const amounts = extractAmounts(transactionText);
  const hasBookValue =
    /\b(?:costing|cost\s+of|book\s+value|having\s+book\s+value)\b/i.test(transactionText) && amounts.length >= 2;

  if (hasBookValue) {
    const [bookValue, saleValue] = amounts;
    if (!bookValue || !saleValue) return null;
    return { bookValue, saleValue };
  }

  const saleValue = parseAmount(transactionText);
  return saleValue ? { saleValue } : null;
}

function extractAssetSaleDisposalAmounts(
  transactionText: string,
): { originalCost: number; accumulatedDepreciation: number; saleValue: number } | null {
  const amounts = extractAmounts(transactionText);
  const hasCost = /\b(?:costing|cost\s+of|original\s+cost|cost)\b/i.test(transactionText);
  if (!hasCost || !hasAssetSaleAccumulatedDepreciationContext(transactionText) || amounts.length < 3) return null;

  const [originalCost, accumulatedDepreciation, saleValue] = amounts;
  if (!originalCost || !accumulatedDepreciation || !saleValue) return null;

  return { originalCost, accumulatedDepreciation, saleValue };
}

function hasUnsupportedAssetGstContext(transactionText: string): boolean {
  return (
    hasUnsupportedGstContext(transactionText) ||
    /\b(?:installation|installing|installed|installation\s+charges?)\b/i.test(transactionText)
  );
}

function isGoodsPurchaseWithGst(transactionText: string): boolean {
  return /\b(?:bought|purchased|purchase)\s+goods\b/i.test(transactionText) && hasGstMention(transactionText);
}

function isGoodsSaleWithGst(transactionText: string): boolean {
  return /\b(?:sold\s+goods|goods\s+sold|sale\s+of\s+goods)\b/i.test(transactionText) && hasGstMention(transactionText);
}

function isSalesReturnWithGst(transactionText: string): boolean {
  return (
    hasGstMention(transactionText) &&
    (/\bsales?\s+returns?\b/i.test(transactionText) ||
      /\bgoods\s+(?:worth\s+.*)?returned\s+(?:by|from)\b/i.test(transactionText) ||
      /\b(?:customer|debtor)\s+returned\s+goods\b/i.test(transactionText) ||
      /^[a-z][a-z.'-]*\s+returned\s+goods\b/i.test(transactionText)) &&
    !isPurchaseReturnWithGst(transactionText)
  );
}

function isPurchaseReturnWithGst(transactionText: string): boolean {
  return (
    hasGstMention(transactionText) &&
    (/\bpurchase\s+returns?\b/i.test(transactionText) ||
      /\bgoods\s+(?:worth\s+.*)?returned\s+to\b/i.test(transactionText) ||
      /\breturned\s+goods(?:\s+worth\s+.*)?\s+to\b/i.test(transactionText) ||
      /\bgoods\s+purchased\s+from\s+\w+\s+returned\b/i.test(transactionText) ||
      /\bgoods\s+purchased\s+returned\b/i.test(transactionText) ||
      /\bgoods\s+returned\s+from\s+purchase\b/i.test(transactionText))
  );
}

function isExpensePaymentWithGst(transactionText: string): boolean {
  if (!hasGstMention(transactionText)) return false;
  if (/\b(?:received|earned|income)\b/i.test(transactionText)) return false;
  if (/\bconsultancy\s+fees?\b/i.test(transactionText) && !/\b(?:paid|payment|payable|unpaid|due)\b/i.test(transactionText)) {
    return false;
  }
  return Boolean(extractGstExpenseItem(transactionText));
}

function extractGstExpenseItem(transactionText: string): GstExpenseItem | null {
  return gstExpenseItems.find((expense) => expense.pattern.test(transactionText)) ?? null;
}

function isIncomeReceiptWithGst(transactionText: string): boolean {
  if (!hasGstMention(transactionText)) return false;
  if (/\b(?:paid|payment|payable\s+to)\b/i.test(transactionText)) return false;
  return Boolean(extractGstIncomeItem(transactionText));
}

function extractGstIncomeItem(transactionText: string): GstIncomeItem | null {
  return gstIncomeItems.find((income) => income.pattern.test(transactionText)) ?? null;
}

function hasGstMention(transactionText: string): boolean {
  return /\b(?:gst|cgst|sgst|igst|central\s+gst|state\s+gst|integrated\s+gst|goods\s+and\s+services\s+tax)\b/i.test(
    transactionText,
  );
}

function hasUnsupportedGstContext(transactionText: string): boolean {
  return (
    /\bdiscount\b/i.test(transactionText) ||
    /\b(?:return|returned|set-?off|paid\s+gst|gst\s+paid|gst\s+payment)\b/i.test(transactionText)
  );
}

function hasTradeDiscountContext(transactionText: string): boolean {
  return /\b(?:less|after)\s+(?:trade\s+)?discount\b/i.test(transactionText);
}

function hasUnsupportedTradeDiscountGstContext(transactionText: string): boolean {
  return (
    hasInclusiveGstWording(transactionText) ||
    /\b(?:return|returned|set-?off|paid\s+gst|gst\s+paid|gst\s+payment|full\s+settlement|settlement)\b/i.test(
      transactionText,
    ) ||
    /\bcash\s+discount\b/i.test(transactionText) ||
    (transactionText.match(/\bdiscount\b/gi)?.length ?? 0) > 1
  );
}

function hasUnsupportedReturnGstContext(transactionText: string): boolean {
  return (
    hasInclusiveGstWording(transactionText) ||
    /\b(?:refund(?:ed)?|cash\s+refunded|bank\s+refund|refund\s+received|cash\s+refund\s+received)\b/i.test(
      transactionText,
    ) ||
    /\b(?:discount|settlement|full\s+settlement|set-?off|paid\s+gst|gst\s+paid|gst\s+payment|stock|inventory)\b/i.test(
      transactionText,
    )
  );
}

function isGstSetOff(transactionText: string): boolean {
  return (
    hasGstMention(transactionText) &&
    /\b(?:set\s*-?\s*off|adjust(?:ed|ment)?|adjusted\s+against|set\s*-?\s*off\s+against)\b/i.test(
      transactionText,
    ) &&
    /\binput\b|\bgst\s+input\b|\bitc\b/i.test(transactionText) &&
    /\boutput\b|\bgst\s+output\b|\bgst\s+(?:payable|liability)\b/i.test(transactionText)
  );
}

function isGstPayment(transactionText: string): boolean {
  if (!hasGstMention(transactionText)) return false;
  if (isGstSetOff(transactionText)) return false;

  return (
    /\bpaid\b/i.test(transactionText) &&
    (/\bpaid\s+(?:output\s+)?(?:gst|cgst|sgst|igst)\b/i.test(transactionText) ||
      /\bpaid\s+gst\s+(?:liability|payable)\b/i.test(transactionText) ||
      /\b(?:gst\s+(?:liability|payable)|output\s+(?:gst|cgst|sgst|igst)|(?:cgst|sgst|igst))\b.*\bpaid\b/i.test(
        transactionText,
      ))
  );
}

function hasUnsupportedGstSetOffPaymentContext(transactionText: string): boolean {
  return (
    /\b(?:refund|refunded|refund\s+due|due\s+refund)\b/i.test(transactionText) ||
    /\b(?:interest|penalty|fine)\b/i.test(transactionText) ||
    /\b(?:gstr|gstr-?3b|return\s+filing|filed\s+gst|filed\s+gstr|gst\s+return)\b/i.test(transactionText) ||
    /\b(?:cross\s*-?\s*utili[sz]ation|utili[sz]e|utili[sz]ed)\b/i.test(transactionText) ||
    (/\bigst\b/i.test(transactionText) && /\b(?:cgst|sgst)\b/i.test(transactionText))
  );
}

function hasGstBalancePaymentClue(transactionText: string): boolean {
  return /\b(?:paid\s+(?:balance|remaining)|(?:balance|remaining)(?:\s+gst|\s+amount)?(?:\s*(?:₹|rs\.?|inr)?\s*[0-9][0-9,]*(?:\.\d+)?)?\s+paid)\b/i.test(
    transactionText,
  );
}

function hasUnsupportedGoodsTaxAmbiguity(transactionText: string): boolean {
  const isGoodsTrade =
    /\b(?:bought|purchased|purchase)\s+goods\b/i.test(transactionText) ||
    /\b(?:sold\s+goods|goods\s+sold|sale\s+of\s+goods)\b/i.test(transactionText);
  return isGoodsTrade && /\b(?:including|inclusive\s+of|tax\s+inclusive|plus|with)\s+tax(?:es)?\b/i.test(transactionText);
}

function extractTradeDiscountGstDetails(transactionText: string): {
  grossAmount: number;
  discountAmount: number;
  discountRate?: number;
  netAmount: number;
  gstAmount: number;
  invoiceTotal: number;
  gstRate?: number;
  taxLines?: GoodsGstTaxLine[];
} | null {
  const grossAmount = extractAmounts(transactionText)[0];
  if (!grossAmount) return null;

  const discount = extractTradeDiscount(transactionText, grossAmount);
  if (!discount || discount.amount <= 0 || discount.amount >= grossAmount) return null;

  const netAmount = roundCurrency(grossAmount - discount.amount);
  const taxLines = extractSplitGstTaxLines(transactionText, netAmount);
  if (taxLines) {
    const gstAmount = roundCurrency(taxLines.reduce((total, line) => total + line.amount, 0));
    return {
      grossAmount,
      discountAmount: discount.amount,
      discountRate: discount.rate,
      netAmount,
      gstAmount,
      invoiceTotal: roundCurrency(netAmount + gstAmount),
      taxLines,
    };
  }

  const rateMatch = /\b(?:gst|goods\s+and\s+services\s+tax)\b\s*(?:(?:@|at)\s*)?([0-9]+(?:\.\d+)?)\s*%/i.exec(
    transactionText,
  );
  if (rateMatch?.[1]) {
    const gstRate = Number(rateMatch[1]);
    if (!Number.isFinite(gstRate) || gstRate <= 0) return null;
    const gstAmount = roundCurrency((netAmount * gstRate) / 100);
    return {
      grossAmount,
      discountAmount: discount.amount,
      discountRate: discount.rate,
      netAmount,
      gstAmount,
      invoiceTotal: roundCurrency(netAmount + gstAmount),
      gstRate,
    };
  }

  return null;
}

function extractTradeDiscount(
  transactionText: string,
  grossAmount: number,
): { amount: number; rate?: number } | null {
  const discountTerm = String.raw`(?:less|after)\s+(?:trade\s+)?discount`;
  const percentMatch = new RegExp(String.raw`\b${discountTerm}\s+([0-9]+(?:\.\d+)?)\s*%`, "i").exec(
    transactionText,
  );
  if (percentMatch?.[1]) {
    const rate = Number(percentMatch[1]);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return { amount: roundCurrency((grossAmount * rate) / 100), rate };
  }

  const amountMatch = new RegExp(
    String.raw`\b${discountTerm}\s*(?:of\s*)?(?:₹|rs\.?|inr)?\s*${AMOUNT_TOKEN_PATTERN}`,
    "i",
  ).exec(transactionText);
  const amount = parseAmountToken(amountMatch?.[1]);
  return amount ? { amount } : null;
}

function tradeDiscountTaxPrefix(taxLines: GoodsGstTaxLine[] | undefined): string {
  if (!taxLines?.length) return "";
  return taxLines.length === 1 ? "igst_" : "cgst_sgst_";
}

function returnGstTaxPrefix(taxLines: GoodsGstTaxLine[] | undefined): string {
  if (!taxLines?.length) return "";
  return taxLines.length === 1 ? "igst_" : "cgst_sgst_";
}

function extractGstSetOffLines(transactionText: string): GstSetOffLine[] {
  const inputIgst = extractTaxLedgerAmount(transactionText, ["input igst", "igst input"]);
  const outputIgst = extractTaxLedgerAmount(transactionText, ["output igst", "igst output"]);
  if (inputIgst && outputIgst) {
    return buildSetOffLines([
      { inputAccount: "Input IGST", outputAccount: "Output IGST", inputAmount: inputIgst, outputAmount: outputIgst },
    ]);
  }

  const inputCgst = extractTaxLedgerAmount(transactionText, ["input cgst", "cgst input"]);
  const inputSgst = extractTaxLedgerAmount(transactionText, ["input sgst", "sgst input"]);
  const outputCgst = extractTaxLedgerAmount(transactionText, ["output cgst", "cgst output"]);
  const outputSgst = extractTaxLedgerAmount(transactionText, ["output sgst", "sgst output"]);
  if (inputCgst && inputSgst && outputCgst && outputSgst) {
    return buildSetOffLines([
      { inputAccount: "Input CGST", outputAccount: "Output CGST", inputAmount: inputCgst, outputAmount: outputCgst },
      { inputAccount: "Input SGST", outputAccount: "Output SGST", inputAmount: inputSgst, outputAmount: outputSgst },
    ]);
  }

  const inputGst = extractTaxLedgerAmount(transactionText, [
    "input gst",
    "gst input",
    "input tax credit",
    "input tax",
    "itc",
  ]);
  const outputGst = extractTaxLedgerAmount(transactionText, [
    "output gst",
    "gst output",
    "gst payable",
    "gst liability",
  ]);
  if (inputGst && outputGst) {
    return buildSetOffLines([
      { inputAccount: "Input GST", outputAccount: "Output GST", inputAmount: inputGst, outputAmount: outputGst },
    ]);
  }

  return [];
}

function buildSetOffLines(
  rawLines: Array<{ inputAccount: string; outputAccount: string; inputAmount: number; outputAmount: number }>,
): GstSetOffLine[] {
  if (rawLines.some((line) => line.inputAmount > line.outputAmount)) return [];

  return rawLines.map((line) => ({
    ...line,
    setOffAmount: line.inputAmount,
    remainingAmount: roundCurrency(line.outputAmount - line.inputAmount),
  }));
}

function extractGstPaymentLines(transactionText: string): Array<{ outputAccount: string; amount: number }> {
  const igst = extractTaxLedgerAmount(transactionText, ["output igst", "igst output", "igst"]);
  if (igst) return [{ outputAccount: "Output IGST", amount: igst }];

  const cgst = extractTaxLedgerAmount(transactionText, ["output cgst", "cgst output", "cgst"]);
  const sgst = extractTaxLedgerAmount(transactionText, ["output sgst", "sgst output", "sgst"]);
  if (cgst && sgst) {
    return [
      { outputAccount: "Output CGST", amount: cgst },
      { outputAccount: "Output SGST", amount: sgst },
    ];
  }

  if (/\b(?:cgst|sgst|igst)\b/i.test(transactionText)) return [];

  const gst = extractTaxLedgerAmount(transactionText, [
    "output gst",
    "gst output",
    "gst liability",
    "gst payable",
    "gst",
  ]);
  return gst ? [{ outputAccount: "Output GST", amount: gst }] : [];
}

function extractTaxLedgerAmount(transactionText: string, terms: string[]): number | null {
  for (const term of terms) {
    const pattern = new RegExp(
      `\\b${term.replace(/\s+/g, "\\s+")}\\b\\s*(?:a\\/c\\s*)?(?:paid\\s*)?(?:₹|rs\\.?|inr)?\\s*${AMOUNT_TOKEN_PATTERN}`,
      "i",
    );
    const amount = parseAmountToken(pattern.exec(transactionText)?.[1]);
    if (amount) return amount;
  }

  return null;
}

function extractExplicitRemainingPaymentAmount(transactionText: string): number | null {
  const match = /\b(?:remaining|balance)(?:\s+gst|\s+amount)?\s*(?:of\s*)?(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.\d+)?\s*k|[0-9][0-9,]*(?:\.\d+)?)/i.exec(
    transactionText,
  );
  return parseAmountToken(match?.[1]);
}

function gstSetOffVariant(lines: GstSetOffLine[]): "generic" | "cgst_sgst" | "igst" {
  if (lines.some((line) => line.outputAccount === "Output IGST")) return "igst";
  if (lines.some((line) => line.outputAccount === "Output CGST" || line.outputAccount === "Output SGST")) {
    return "cgst_sgst";
  }
  return "generic";
}

function gstPaymentVariant(outputAccounts: string[]): "generic" | "cgst_sgst" | "igst" {
  if (outputAccounts.includes("Output IGST")) return "igst";
  if (outputAccounts.includes("Output CGST") || outputAccounts.includes("Output SGST")) return "cgst_sgst";
  return "generic";
}

function buildGstSetOffEntry(lines: GstSetOffLine[], paymentAmount?: number): CorrectJournalEntry {
  return {
    debits: [
      ...lines.map((line) => ({ account: line.outputAccount, amount: line.setOffAmount })),
      ...(paymentAmount
        ? lines
            .filter((line) => line.remainingAmount > 0)
            .map((line) => ({ account: line.outputAccount, amount: line.remainingAmount }))
        : []),
    ],
    credits: [
      ...lines.map((line) => ({ account: line.inputAccount, amount: line.setOffAmount })),
      ...(paymentAmount ? [{ account: "Bank", amount: paymentAmount }] : []),
    ],
  };
}

function buildGstPaymentEntry(lines: Array<{ outputAccount: string; amount: number }>): CorrectJournalEntry {
  return {
    debits: lines.map((line) => ({ account: line.outputAccount, amount: line.amount })),
    credits: [{ account: "Bank", amount: roundCurrency(lines.reduce((total, line) => total + line.amount, 0)) }],
  };
}

function extractGstDetails(
  transactionText: string,
): {
  baseAmount: number;
  gstAmount: number;
  invoiceTotal: number;
  gstRate?: number;
  gstInclusive?: boolean;
  taxLines?: GoodsGstTaxLine[];
  transactionTypePrefix?: string;
} | null {
  const amounts = extractAmounts(transactionText);
  const firstAmount = amounts[0];
  if (!firstAmount) return null;

  const gstInclusive = hasInclusiveGstWording(transactionText);
  const splitTaxLines = extractSplitGstTaxLines(transactionText, firstAmount);
  if (splitTaxLines) {
    if (gstInclusive) {
      const inclusiveSplit = buildInclusiveSplitGstDetails(firstAmount, splitTaxLines);
      if (!inclusiveSplit) return null;

      return {
        ...inclusiveSplit,
        gstInclusive,
        transactionTypePrefix: splitTaxLines.length === 1 ? "igst_" : "cgst_sgst_",
      };
    }

    const gstAmount = roundCurrency(splitTaxLines.reduce((total, line) => total + line.amount, 0));
    return {
      baseAmount: firstAmount,
      gstAmount,
      invoiceTotal: roundCurrency(firstAmount + gstAmount),
      taxLines: splitTaxLines,
      transactionTypePrefix: splitTaxLines.length === 1 ? "igst_" : "cgst_sgst_",
    };
  }

  const rateMatch = /\b(?:gst|goods\s+and\s+services\s+tax)\b\s*(?:(?:@|at|inclusive|included)\s*)?([0-9]+(?:\.\d+)?)\s*%/i.exec(transactionText);
  if (rateMatch?.[1]) {
    const gstRate = Number(rateMatch[1]);
    if (!Number.isFinite(gstRate) || gstRate <= 0) return null;

    if (gstInclusive) {
      const invoiceTotal = firstAmount;
      const baseAmount = roundCurrency((invoiceTotal * 100) / (100 + gstRate));
      const gstAmount = roundCurrency(invoiceTotal - baseAmount);
      return { baseAmount, gstAmount, invoiceTotal, gstRate, gstInclusive };
    }

    const baseAmount = firstAmount;
    const gstAmount = roundCurrency((baseAmount * gstRate) / 100);
    return { baseAmount, gstAmount, invoiceTotal: roundCurrency(baseAmount + gstAmount), gstRate };
  }

  if (gstInclusive) return null;

  const gstAmountMatch = new RegExp(
    `\\bgst\\s*(?:amount\\s*)?(?:of\\s*)?(?:₹|rs\\.?|inr)\\s*${AMOUNT_TOKEN_PATTERN}`,
    "i",
  ).exec(transactionText);
  const gstAmount = parseAmountToken(gstAmountMatch?.[1]);
  if (!gstAmount) return null;

  const baseAmount = firstAmount;
  return { baseAmount, gstAmount, invoiceTotal: roundCurrency(baseAmount + gstAmount) };
}

function hasInclusiveGstWording(transactionText: string): boolean {
  const gstTerm =
    "(?:gst|cgst|sgst|igst|central\\s+gst|state\\s+gst|integrated\\s+gst|goods\\s+and\\s+services\\s+tax)";
  return (
    new RegExp(`\\bincluding\\s+${gstTerm}\\b`, "i").test(transactionText) ||
    new RegExp(`\\binclusive\\s+of\\s+${gstTerm}\\b`, "i").test(transactionText) ||
    new RegExp(`\\b${gstTerm}\\s+inclusive\\b`, "i").test(transactionText) ||
    new RegExp(`\\b${gstTerm}\\s+included\\b`, "i").test(transactionText)
  );
}

function extractSplitGstTaxLines(transactionText: string, baseAmount: number): GoodsGstTaxLine[] | null {
  if (/\b(?:igst|integrated\s+gst)\b/i.test(transactionText)) {
    const igstAmount = extractTaxAmount(transactionText, "igst", baseAmount);
    if (!igstAmount) return null;

    return [
      {
        taxType: "IGST",
        inputAccount: "Input IGST",
        outputAccount: "Output IGST",
        amount: igstAmount.amount,
        rate: igstAmount.rate,
      },
    ];
  }

  if (/\b(?:cgst|central\s+gst|sgst|state\s+gst)\b/i.test(transactionText)) {
    const cgstAmount = extractTaxAmount(transactionText, "cgst", baseAmount);
    const sgstAmount = extractTaxAmount(transactionText, "sgst", baseAmount);
    if (!cgstAmount || !sgstAmount) return null;

    return [
      {
        taxType: "CGST",
        inputAccount: "Input CGST",
        outputAccount: "Output CGST",
        amount: cgstAmount.amount,
        rate: cgstAmount.rate,
      },
      {
        taxType: "SGST",
        inputAccount: "Input SGST",
        outputAccount: "Output SGST",
        amount: sgstAmount.amount,
        rate: sgstAmount.rate,
      },
    ];
  }

  return null;
}

function extractTaxAmount(
  transactionText: string,
  taxType: "cgst" | "sgst" | "igst",
  baseAmount: number,
): { amount: number; rate?: number } | null {
  const taxTerm = splitGstTaxTerm(taxType);
  const rateMatch = new RegExp(
    `\\b${taxTerm}\\s*(?:(?:@|at|inclusive|included)\\s*)?([0-9]+(?:\\.\\d+)?)\\s*%`,
    "i",
  ).exec(transactionText);
  if (rateMatch?.[1]) {
    const rate = Number(rateMatch[1]);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return { amount: roundCurrency((baseAmount * rate) / 100), rate };
  }

  const amountMatch = new RegExp(
    `\\b${taxTerm}\\s*(?:amount\\s*)?(?:of\\s*)?(?:₹|rs\\.?|inr)\\s*${AMOUNT_TOKEN_PATTERN}`,
    "i",
  ).exec(transactionText);
  const amount = parseAmountToken(amountMatch?.[1]);
  return amount ? { amount } : null;
}

function splitGstTaxTerm(taxType: "cgst" | "sgst" | "igst"): string {
  if (taxType === "cgst") return "(?:cgst|central\\s+gst)";
  if (taxType === "sgst") return "(?:sgst|state\\s+gst)";
  return "(?:igst|integrated\\s+gst)";
}

function buildInclusiveSplitGstDetails(
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[],
): {
  baseAmount: number;
  gstAmount: number;
  invoiceTotal: number;
  taxLines: GoodsGstTaxLine[];
} | null {
  if (taxLines.some((line) => line.rate === undefined)) return null;

  const totalRate = taxLines.reduce((total, line) => total + (line.rate ?? 0), 0);
  if (!Number.isFinite(totalRate) || totalRate <= 0) return null;

  const baseAmount = roundCurrency((invoiceTotal * 100) / (100 + totalRate));
  const gstAmount = roundCurrency(invoiceTotal - baseAmount);
  let allocatedTax = 0;
  const recalculatedTaxLines = taxLines.map((line, index) => {
    const amount =
      index === taxLines.length - 1
        ? roundCurrency(gstAmount - allocatedTax)
        : roundCurrency((baseAmount * (line.rate ?? 0)) / 100);
    allocatedTax = roundCurrency(allocatedTax + amount);
    return { ...line, amount };
  });

  return { baseAmount, gstAmount, invoiceTotal, taxLines: recalculatedTaxLines };
}

function parseAmountToken(value: string | undefined): number | null {
  if (!value) return null;

  const rawAmount = value.replace(/\s+/g, "").toLowerCase();
  const amount = rawAmount.endsWith("k")
    ? Number(rawAmount.slice(0, -1).replace(/,/g, "")) * 1000
    : Number(rawAmount.replace(/,/g, ""));

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
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

function buildGoodsGstPurchaseEntry(
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  paymentAccount: "Cash" | "Bank" | "Creditor",
  creditorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditLine: CorrectJournalEntry["credits"][number] = {
    account: creditorAccount,
    amount: invoiceTotal,
  };

  if (partyName && paymentAccount === "Creditor") {
    creditLine.acceptedAccounts = ["Creditor"];
    creditLine.partyRole = "creditor";
  }

  return {
    debits: [
      { account: "Purchases", amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.inputAccount, amount: line.amount })) ?? [
        { account: "Input GST", amount: gstAmount },
      ]),
    ],
    credits: [creditLine],
  };
}

function buildAssetGstPurchaseEntry(
  assetAccount: string,
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  paymentAccount: "Cash" | "Bank" | "Creditor",
  creditorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditLine: CorrectJournalEntry["credits"][number] = {
    account: creditorAccount,
    amount: invoiceTotal,
  };

  if (partyName && paymentAccount === "Creditor") {
    creditLine.acceptedAccounts = ["Creditor"];
    creditLine.partyRole = "creditor";
  }

  return {
    debits: [
      { account: assetAccount, amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.inputAccount, amount: line.amount })) ?? [
        { account: "Input GST", amount: gstAmount },
      ]),
    ],
    credits: [creditLine],
  };
}

function buildExpenseGstPaymentEntry(
  expenseAccount: string,
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  paymentAccount: "Cash" | "Bank" | "Creditor",
  creditorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditLine: CorrectJournalEntry["credits"][number] = {
    account: creditorAccount,
    amount: invoiceTotal,
  };

  if (partyName && paymentAccount === "Creditor") {
    creditLine.acceptedAccounts = ["Creditor"];
    creditLine.partyRole = "creditor";
  }

  return {
    debits: [
      { account: expenseAccount, amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.inputAccount, amount: line.amount })) ?? [
        { account: "Input GST", amount: gstAmount },
      ]),
    ],
    credits: [creditLine],
  };
}

function buildIncomeGstReceiptEntry(
  incomeAccount: string,
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  receiptAccount: "Cash" | "Bank" | "Debtor",
  debtorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const debitLine: CorrectJournalEntry["debits"][number] = {
    account: debtorAccount,
    amount: invoiceTotal,
  };

  if (partyName && receiptAccount === "Debtor") {
    debitLine.acceptedAccounts = ["Debtor"];
    debitLine.partyRole = "debtor";
  }

  return {
    debits: [debitLine],
    credits: [
      { account: incomeAccount, amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.outputAccount, amount: line.amount })) ?? [
        { account: "Output GST", amount: gstAmount },
      ]),
    ],
  };
}

function buildAssetSaleEntry(
  assetAccount: string,
  saleValue: number,
  bookValue: number | undefined,
  debtorAccount: string,
): CorrectJournalEntry {
  if (bookValue === undefined || saleValue === bookValue) {
    return {
      debits: [{ account: debtorAccount, amount: saleValue }],
      credits: [{ account: assetAccount, amount: saleValue }],
    };
  }

  if (saleValue < bookValue) {
    return {
      debits: [
        { account: debtorAccount, amount: saleValue },
        { account: "Loss on Sale of Asset", amount: roundCurrency(bookValue - saleValue) },
      ],
      credits: [{ account: assetAccount, amount: bookValue }],
    };
  }

  return {
    debits: [{ account: debtorAccount, amount: saleValue }],
    credits: [
      { account: assetAccount, amount: bookValue },
      { account: "Profit on Sale of Asset", amount: roundCurrency(saleValue - bookValue) },
    ],
  };
}

function buildAssetSaleDisposalEntry(
  assetAccount: string,
  originalCost: number,
  accumulatedDepreciation: number,
  saleValue: number,
  debtorAccount: string,
  profitAmount: number | undefined,
  lossAmount: number | undefined,
): CorrectJournalEntry {
  return {
    debits: [
      { account: "Asset Disposal", amount: originalCost },
      { account: "Accumulated Depreciation", amount: accumulatedDepreciation },
      { account: debtorAccount, amount: saleValue },
      ...(profitAmount ? [{ account: "Asset Disposal", amount: profitAmount }] : []),
      ...(lossAmount ? [{ account: "Loss on Sale of Asset", amount: lossAmount }] : []),
    ],
    credits: [
      { account: assetAccount, amount: originalCost },
      { account: "Asset Disposal", amount: accumulatedDepreciation },
      { account: "Asset Disposal", amount: saleValue },
      ...(profitAmount ? [{ account: "Profit on Sale of Asset", amount: profitAmount }] : []),
      ...(lossAmount ? [{ account: "Asset Disposal", amount: lossAmount }] : []),
    ],
  };
}

function buildGoodsGstSaleEntry(
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  receiptAccount: "Cash" | "Bank" | "Debtor",
  debtorAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const debitLine: CorrectJournalEntry["debits"][number] = {
    account: debtorAccount,
    amount: invoiceTotal,
  };

  if (partyName && receiptAccount === "Debtor") {
    debitLine.acceptedAccounts = ["Debtor"];
    debitLine.partyRole = "debtor";
  }

  return {
    debits: [debitLine],
    credits: [
      { account: "Sales", amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.outputAccount, amount: line.amount })) ?? [
        { account: "Output GST", amount: gstAmount },
      ]),
    ],
  };
}

function buildSalesReturnGstEntry(
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  customerAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const creditLine: CorrectJournalEntry["credits"][number] = {
    account: customerAccount,
    amount: invoiceTotal,
  };

  if (partyName) {
    creditLine.acceptedAccounts = ["Debtor"];
    creditLine.partyRole = "debtor";
  }

  return {
    debits: [
      { account: "Sales Return", amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.outputAccount, amount: line.amount })) ?? [
        { account: "Output GST", amount: gstAmount },
      ]),
    ],
    credits: [creditLine],
  };
}

function buildPurchaseReturnGstEntry(
  baseAmount: number,
  gstAmount: number,
  invoiceTotal: number,
  taxLines: GoodsGstTaxLine[] | undefined,
  supplierAccount: string,
  partyName?: string,
): CorrectJournalEntry {
  const debitLine: CorrectJournalEntry["debits"][number] = {
    account: supplierAccount,
    amount: invoiceTotal,
  };

  if (partyName) {
    debitLine.acceptedAccounts = ["Creditor"];
    debitLine.partyRole = "creditor";
  }

  return {
    debits: [debitLine],
    credits: [
      { account: "Purchase Return", amount: baseAmount },
      ...(taxLines?.map((line) => ({ account: line.inputAccount, amount: line.amount })) ?? [
        { account: "Input GST", amount: gstAmount },
      ]),
    ],
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

function extractAssetGstSupplierName(transactionText: string): string | undefined {
  const match = /\bfrom\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(supplier|seller|creditor|cash|bank)$/i.test(normalizedName)) return undefined;

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}

function extractExpenseGstSupplierName(transactionText: string): string | undefined {
  const match =
    /\bfrom\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bpayable\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(supplier|seller|creditor|cash|bank|upi|gpay|phonepe|paytm)$/i.test(normalizedName)) {
    return undefined;
  }

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}

function extractIncomeGstCustomerName(transactionText: string): string | undefined {
  const match =
    /\bbilled\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bdue\s+from\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bfrom\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(customer|debtor|cash|bank|upi|gpay|phonepe|paytm)$/i.test(normalizedName)) {
    return undefined;
  }

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}

function extractAssetSaleBuyerName(transactionText: string): string | undefined {
  const match =
    /\bsold\s+\w+(?:\s+\w+)?\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bsold\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\b\w+(?:\s+\w+)?\s+sold\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bto\s+([a-z][a-z.'-]*)\s+for\b/i.exec(transactionText) ??
    /\bto\s+([a-z][a-z.'-]*)\s+on\s+credit\b/i.exec(transactionText);
  const rawName = match?.[1];
  if (!rawName) return undefined;

  const normalizedName = rawName.replace(/[.,]/g, "").trim();
  if (!normalizedName || /^(customer|debtor|cash|bank)$/i.test(normalizedName)) return undefined;

  return normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1).toLowerCase();
}

function extractGstSupplierName(transactionText: string): string | undefined {
  const match =
    /\bgoods\s+from\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bfrom\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(supplier|seller|creditor|cash|bank|rs|inr)$/i);
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

function extractGstCustomerName(transactionText: string): string | undefined {
  const match =
    /\bsold\s+goods\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bgoods\s+sold\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bto\s+([a-z][a-z.'-]*)\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(customer|debtor|cash|bank|rs|inr)$/i);
}

function extractSalesReturnGstCustomerName(transactionText: string): string | undefined {
  const match =
    /\bgoods\s+(?:worth\s+.*)?returned\s+by\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bgoods\s+(?:worth\s+.*)?returned\s+from\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bsales?\s+returns?\s+(?:from|by)\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /^([a-z][a-z.'-]*)\s+returned\s+goods\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(customer|debtor|cash|bank|rs|inr)$/i);
}

function extractPurchaseReturnGstSupplierName(transactionText: string): string | undefined {
  const match =
    /\bgoods\s+(?:worth\s+.*)?returned\s+to\s+(?:supplier\s+)?([a-z][a-z.'-]*)\b/i.exec(
      transactionText,
    ) ??
    /\breturned\s+goods(?:\s+worth\s+.*)?\s+to\s+(?:supplier\s+)?([a-z][a-z.'-]*)\b/i.exec(
      transactionText,
    ) ??
    /\bpurchase\s+returns?\s+to\s+([a-z][a-z.'-]*)\b/i.exec(transactionText) ??
    /\bgoods\s+purchased\s+from\s+([a-z][a-z.'-]*)\s+returned\b/i.exec(transactionText);

  return normalizeSettlementParty(match?.[1], /^(supplier|creditor|cash|bank|rs|inr)$/i);
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
