import { displayAccountName, getAccountMetadata } from "./account-metadata";
import { generatePracticeQuestion } from "./explanation-generator";
import { generateExpectedEntry } from "./expected-entry-generator";
import { classifyTransaction, extractAmount } from "./transaction-classifier";
import type {
  CorrectJournalEntry,
  JournalEntrySolverResponse,
  SolverAffectedAccount,
  SolverConfidence,
  SolverJournalEntryLine,
  SolverMode,
  SolverPracticeQuestion,
  SolverSide,
  TransactionClassification,
  JournalLine,
  GoodsGstTaxLine,
} from "./types";

const unsupportedMessage =
  "I cannot safely solve this transaction yet. Please rewrite with amount, payment mode, and account context.";

const commonExpenseAccounts = new Set([
  "Wages Expense",
  "Carriage Expense",
  "Freight Expense",
  "Advertisement Expense",
  "Repairs Expense",
  "Printing and Stationery Expense",
  "Telephone Expense",
  "Internet Expense",
  "Travelling Expense",
  "Petrol/Fuel Expense",
  "Legal Charges",
  "Office Expenses",
  "Professional Fees Expense",
]);

const commonIncomeAccounts = new Set([
  "Rent Income",
  "Service Income",
  "Consultancy Income",
  "Tuition Income",
  "Dividend Income",
  "Royalty Income",
  "Interest Income",
  "Commission Income",
  "Discount Received",
  "Miscellaneous Income",
]);

const fixedAssetAccounts = new Set(["Furniture", "Machinery", "Equipment", "Vehicle", "Computer", "Land", "Building"]);

export function solveJournalEntry(transaction: string, mode: SolverMode = "beginner"): JournalEntrySolverResponse {
  const transactionSummary = transaction.trim();
  const safeMode = mode === "exam" ? "exam" : "beginner";

  if (!transactionSummary) {
    return unsupportedResponse(transactionSummary);
  }

  if (isAmbiguousPersonPayment(transactionSummary)) {
    return ambiguousPersonPaymentResponse(transactionSummary);
  }

  const classification = classifyTransaction(transactionSummary);
  if (!classification) {
    return unsupportedResponse(transactionSummary);
  }

  const expectedEntry = generateExpectedEntry(classification);
  if (!isBalanced(expectedEntry)) {
    return unsupportedResponse(transactionSummary);
  }

  const journalEntry = buildJournalEntry(expectedEntry);
  const fullSteps = buildStepByStepExplanation(classification);

  return {
    transactionSummary,
    status: "solved",
    confidence: toSolverConfidence(classification.confidence),
    ambiguityQuestions: [],
    possibleInterpretations: [],
    journalEntry,
    narration: buildNarration(classification),
    affectedAccounts: buildAffectedAccounts(classification, expectedEntry),
    stepByStepExplanation: safeMode === "exam" ? fullSteps.slice(0, 3) : fullSteps,
    commonMistakes: buildCommonMistakes(classification),
    practiceQuestion: buildPracticeQuestion(classification),
  };
}

function isAmbiguousPersonPayment(transaction: string): boolean {
  const amount = extractAmount(transaction);
  if (!amount) return false;

  const possibleName = getAmbiguousPaymentName(transaction);
  if (!possibleName) return false;

  const accountWords = new Set([
    "cash",
    "advertisement",
    "advertising",
    "bank",
    "broadband",
    "carriage",
    "creditor",
    "fuel",
    "freight",
    "supplier",
    "rent",
    "salary",
    "stationery",
    "telephone",
    "travel",
    "travelling",
    "wage",
    "wages",
    "interest",
    "commission",
    "electricity",
    "internet",
    "legal",
    "loan",
    "office",
    "petrol",
    "phone",
    "professional",
    "printing",
    "repair",
    "repairs",
    "stationery",
  ]);

  return !accountWords.has(possibleName.toLowerCase());
}

function ambiguousPersonPaymentResponse(transactionSummary: string): JournalEntrySolverResponse {
  const amount = extractAmount(transactionSummary) ?? 0;
  const formattedAmount = formatRupees(amount);
  const personName = getAmbiguousPaymentName(transactionSummary) ?? "the person";

  return {
    transactionSummary,
    status: "ambiguous",
    confidence: "low",
    ambiguityQuestions: [
      `Why was ${personName} paid ${formattedAmount}?`,
      `Was ${personName} a creditor, employee, landlord, supplier, or loan provider?`,
      "Was the payment made by cash or bank?",
    ],
    possibleInterpretations: [
      {
        context: `If ${personName} is a creditor`,
        journalEntry: [`${personName} A/c Dr. ${formattedAmount}`, `To Cash/Bank A/c ${formattedAmount}`],
        note: "A creditor payment reduces the amount payable.",
      },
      {
        context: `If ${personName} is an employee receiving salary`,
        journalEntry: [`Salary A/c Dr. ${formattedAmount}`, `To Cash/Bank A/c ${formattedAmount}`],
        note: "Salary is an expense for the business.",
      },
      {
        context: `If ${personName} is the landlord receiving rent`,
        journalEntry: [`Rent A/c Dr. ${formattedAmount}`, `To Cash/Bank A/c ${formattedAmount}`],
        note: "Rent is an expense for the business.",
      },
    ],
    journalEntry: [],
    narration: "",
    affectedAccounts: [],
    stepByStepExplanation: [
      "Accountancy depends on the business context.",
      "The transaction says Ram was paid, but it does not say why Ram was paid.",
      "It also does not clearly say whether the payment was made by cash or bank.",
    ],
    commonMistakes: ["Do not guess the account name from a person's name alone."],
    practiceQuestion: emptyPracticeQuestion(),
    message: "More information is needed before a correct journal entry can be made.",
  };
}

function getAmbiguousPaymentName(transaction: string): string | null {
  const match = /^paid\s+([a-z][a-z.'-]*)\s+(?:rs\.?|inr|₹|\d)/i.exec(transaction.trim());
  return match?.[1] ?? null;
}

function unsupportedResponse(transactionSummary: string): JournalEntrySolverResponse {
  return {
    transactionSummary,
    status: "unsupported",
    confidence: "low",
    ambiguityQuestions: [],
    possibleInterpretations: [],
    journalEntry: [],
    narration: "",
    affectedAccounts: [],
    stepByStepExplanation: [unsupportedMessage],
    commonMistakes: ["Do not create compound or adjustment entries unless the app clearly supports them."],
    practiceQuestion: emptyPracticeQuestion(),
    message: unsupportedMessage,
  };
}

function buildJournalEntry(entry: CorrectJournalEntry): SolverJournalEntryLine[] {
  return [
    ...entry.debits.map((line) => ({
      account: displayAccountName(line.account),
      debit: line.amount,
      credit: 0,
    })),
    ...entry.credits.map((line) => ({
      account: displayAccountName(line.account),
      debit: 0,
      credit: line.amount,
    })),
  ];
}

function buildAffectedAccounts(
  classification: TransactionClassification,
  expectedEntry: CorrectJournalEntry,
): SolverAffectedAccount[] {
  return [
    ...expectedEntry.debits.map((line) => buildAffectedAccount(line, "Debit", classification)),
    ...expectedEntry.credits.map((line) => buildAffectedAccount(line, "Credit", classification)),
  ];
}

function buildAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount {
  const compoundAccount =
    buildPartialGoodsPurchaseAffectedAccount(line, side, classification) ??
    buildPartialGoodsSaleAffectedAccount(line, side, classification) ??
    buildAssetSaleAffectedAccount(line, side, classification) ??
    buildAssetPurchaseInstallationChargeAffectedAccount(line, side, classification) ??
    buildAssetInstallationChargeAffectedAccount(line, side, classification) ??
    buildDiscountSettlementAffectedAccount(line, side, classification);
  if (compoundAccount) return compoundAccount;

  const goodsWithdrawalAccount = buildGoodsWithdrawalAffectedAccount(line, side, classification);
  if (goodsWithdrawalAccount) return goodsWithdrawalAccount;

  const freeSampleGoodsAccount = buildFreeSampleGoodsAffectedAccount(line, side, classification);
  if (freeSampleGoodsAccount) return freeSampleGoodsAccount;

  const charityGoodsAccount = buildCharityGoodsAffectedAccount(line, side, classification);
  if (charityGoodsAccount) return charityGoodsAccount;

  const goodsLossAccount = buildGoodsLossAffectedAccount(line, side, classification);
  if (goodsLossAccount) return goodsLossAccount;

  const salesReturnAccount = buildSalesReturnAffectedAccount(line, side, classification);
  if (salesReturnAccount) return salesReturnAccount;

  const purchaseReturnAccount = buildPurchaseReturnAffectedAccount(line, side, classification);
  if (purchaseReturnAccount) return purchaseReturnAccount;

  const depreciationAccount = buildDepreciationAffectedAccount(line, side, classification);
  if (depreciationAccount) return depreciationAccount;

  const badDebtAccount = buildBadDebtAffectedAccount(line, side, classification);
  if (badDebtAccount) return badDebtAccount;

  const badDebtRecoveryAccount = buildBadDebtRecoveryAffectedAccount(line, side, classification);
  if (badDebtRecoveryAccount) return badDebtRecoveryAccount;

  const account = line.account;
  const metadata = getAccountMetadata(account, {
    partyName: classification.partyName,
    partyRole: line.partyRole ?? (account === classification.partyName ? classification.partyRole : undefined),
  });

  return {
    account: metadata.displayName,
    traditionalType: metadata.traditionalType,
    modernType: metadata.modernType,
    effect: side === "Debit" ? metadata.debitEffect : metadata.creditEffect,
    debitOrCredit: side,
    ruleApplied: side === "Debit" ? metadata.debitRule : metadata.creditRule,
    reason: side === "Debit" ? metadata.debitReason : metadata.creditReason,
  };
}

function buildStepByStepExplanation(classification: TransactionClassification): string[] {
  if (classification.compoundDetails?.kind === "asset_sale") {
    const details = classification.compoundDetails;
    const receipt = displayAccountName(details.debtorAccount);
    const asset = displayAccountName(details.assetAccount);
    if (details.usesDisposalAccount && details.originalCost !== undefined && details.accumulatedDepreciation !== undefined) {
      const resultStep = details.lossAmount
        ? `Since sale value is less than book value, loss = ${formatRupees(details.lossAmount)}.`
        : details.profitAmount
          ? `Since sale value is more than book value, profit = ${formatRupees(details.profitAmount)}.`
          : "Since sale value equals book value, there is no profit or loss.";

      return [
        `Original ${details.assetLabel} cost is ${formatRupees(details.originalCost)}.`,
        `Accumulated depreciation is ${formatRupees(details.accumulatedDepreciation)}.`,
        `Book value = ${formatRupees(details.bookValue ?? details.saleValue)}.`,
        `Sale value = ${formatRupees(details.saleValue)}.`,
        resultStep,
        "Asset Disposal A/c is used to close the asset.",
        `${asset} is credited to remove the original asset cost.`,
        "Accumulated Depreciation A/c is debited to remove depreciation from the books.",
        `${receipt} is debited for the sale proceeds.`,
        details.lossAmount
          ? "Loss on Sale of Asset A/c is debited to close the disposal account."
          : details.profitAmount
            ? "Asset Disposal A/c is debited and Profit on Sale of Asset A/c is credited to close the disposal account."
            : "No profit/loss line is needed because sale value equals book value.",
      ];
    }

    if (details.bookValue !== undefined && details.lossAmount) {
      return [
        `${titleCase(details.assetLabel)} has book value/cost of ${formatRupees(details.bookValue)}.`,
        `It was sold for ${formatRupees(details.saleValue)}.`,
        `Sale value is less than book value, so there is a loss of ${formatRupees(details.lossAmount)}.`,
        `${receipt} is debited because ${
          details.receiptAccount === "Bank"
            ? "the amount is received through bank/digital mode"
            : details.receiptAccount === "Cash"
              ? "cash is received"
              : `${details.debtorAccount} is treated as a buyer/debtor for the credit sale`
        }.`,
        "Loss on Sale of Asset A/c is debited because losses are debited.",
        `${asset} is credited because the asset goes out of the business.`,
      ];
    }

    if (details.bookValue !== undefined && details.profitAmount) {
      return [
        `${titleCase(details.assetLabel)} has book value/cost of ${formatRupees(details.bookValue)}.`,
        `It was sold for ${formatRupees(details.saleValue)}.`,
        `Sale value is more than book value, so there is profit of ${formatRupees(details.profitAmount)}.`,
        `${receipt} is debited because ${
          details.receiptAccount === "Bank"
            ? "the amount is received through bank/digital mode"
            : details.receiptAccount === "Cash"
              ? "cash is received"
              : `${details.debtorAccount} is treated as a buyer/debtor for the credit sale`
        }.`,
        `${asset} is credited because the asset goes out of the business.`,
        "Profit on Sale of Asset A/c is credited because gains are credited.",
      ];
    }

    return [
      `${titleCase(details.assetLabel)} is a fixed asset of the business.`,
      `The business sold the ${details.assetLabel} for ${formatRupees(details.amount)}.`,
      `${receipt} is debited because ${
        details.receiptAccount === "Bank"
          ? "the amount is received through bank/digital mode"
          : details.receiptAccount === "Cash"
            ? "cash is received"
            : `${details.debtorAccount} is treated as a buyer/debtor for the credit sale`
      }.`,
      `${asset} is credited because the asset goes out of the business.`,
      "In this beginner MVP, profit/loss on sale is not calculated because book value is not given.",
    ];
  }

  if (classification.compoundDetails?.kind === "asset_purchase_installation_charge") {
    const details = classification.compoundDetails;
    const asset = displayAccountName(details.assetAccount);
    const payment = displayAccountName(details.creditorAccount);
    return [
      `${titleCase(details.assetLabel)} was purchased for ${formatRupees(details.assetAmount)}.`,
      `${sentenceCase(details.chargeLabel)} of ${formatRupees(
        details.chargeAmount,
      )} were paid to make the ${details.assetLabel} usable.`,
      `${sentenceCase(details.chargeLabel)} are capitalized into ${asset}.`,
      `Total ${details.assetLabel} cost = ${formatRupees(details.assetAmount)} + ${formatRupees(
        details.chargeAmount,
      )} = ${formatRupees(details.totalAmount)}.`,
      `${asset} is debited because asset cost increases.`,
      `${payment} is credited because ${
        details.paymentAccount === "Bank"
          ? "payment was made through bank/digital mode"
          : details.paymentAccount === "Cash"
            ? "cash was paid"
            : "the amount is payable"
      }.`,
    ];
  }

  if (classification.compoundDetails?.kind === "asset_installation_charge") {
    const details = classification.compoundDetails;
    const asset = displayAccountName(details.assetAccount);
    const payment = displayAccountName(details.creditorAccount);
    return [
      `${sentenceCase(details.chargeLabel)} are directly related to ${details.assetLabel}.`,
      `These charges help bring the ${details.assetLabel} into usable condition.`,
      `Therefore, they are capitalized into ${asset}, not treated as a normal expense.`,
      `${asset} is debited because asset cost increases.`,
      `${payment} is credited because ${
        details.paymentAccount === "Bank"
          ? "payment was made through bank/digital mode"
          : details.paymentAccount === "Cash"
            ? "cash is paid"
            : "the amount is payable"
      }.`,
    ];
  }

  if (classification.compoundDetails?.kind === "asset_gst_purchase") {
    const details = classification.compoundDetails;
    const asset = displayAccountName(details.assetAccount);
    const payment = displayAccountName(details.creditorAccount);

    if (details.taxLines?.length) {
      return [
        `${titleCase(details.assetLabel)} worth ${formatRupees(details.baseAmount)} was purchased.`,
        `${asset} is a fixed asset, so ${asset} is debited.`,
        ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
        `${inputTaxAccountLabel(details.taxLines)} ${
          details.taxLines.length === 1 ? "is" : "are"
        } debited because GST paid on asset purchase is input tax credit.`,
        `${payment} is credited for the total amount ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }, ${formatRupees(details.invoiceTotal)}.`,
      ];
    }

    if (details.gstInclusive) {
      return [
        `The total invoice amount is ${formatRupees(details.invoiceTotal)} including GST.`,
        `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
          details.gstRate,
        )} = ${formatRupees(details.baseAmount)}.`,
        `GST amount = ${formatRupees(details.gstAmount)}.`,
        `${asset} is debited for ${formatRupees(details.baseAmount)} because the fixed asset increases.`,
        `Input GST A/c is debited for ${formatRupees(details.gstAmount)} because GST paid is input tax credit.`,
        `${payment} is credited for ${formatRupees(details.invoiceTotal)} ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }.`,
      ];
    }

    return [
      `${titleCase(details.assetLabel)} worth ${formatRupees(details.baseAmount)} was purchased.`,
      `${asset} is a fixed asset, so ${asset} is debited.`,
      `${gstAmountExplanation(details.gstAmount, details.gstRate)}.`,
      "Input GST A/c is debited because GST paid on asset purchase is input tax credit.",
      `${payment} is credited for the total amount ${
        details.paymentAccount === "Creditor" ? "payable" : "paid"
      }, ${formatRupees(details.invoiceTotal)}.`,
    ];
  }

  if (classification.compoundDetails?.kind === "expense_gst_payment") {
    const details = classification.compoundDetails;
    const expense = displayAccountName(details.expenseAccount);
    const payment = displayAccountName(details.creditorAccount);

    if (details.taxLines?.length) {
      return [
        `${sentenceCase(details.expenseLabel)} are a business expense.`,
        `${expense} is debited because expenses are debited.`,
        ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
        `${inputTaxAccountLabel(details.taxLines)} ${
          details.taxLines.length === 1 ? "is" : "are"
        } debited because GST paid on expense is input tax credit.`,
        `${payment} is credited for the total amount ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }, ${formatRupees(details.invoiceTotal)}.`,
      ];
    }

    if (details.gstInclusive) {
      return [
        `Total invoice amount is ${formatRupees(details.invoiceTotal)} including GST.`,
        `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
          details.gstRate,
        )} = ${formatRupees(details.baseAmount)}.`,
        `GST amount = ${formatRupees(details.gstAmount)}.`,
        `${expense} is debited for ${formatRupees(details.baseAmount)} because expenses are debited.`,
        `Input GST A/c is debited for ${formatRupees(details.gstAmount)} because GST paid on expense is input tax credit.`,
        `${payment} is credited for ${formatRupees(details.invoiceTotal)} ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }.`,
      ];
    }

    return [
      `${sentenceCase(details.expenseLabel)} are a business expense.`,
      `${expense} is debited because expenses are debited.`,
      `${gstAmountExplanation(details.gstAmount, details.gstRate)}.`,
      "Input GST A/c is debited because GST paid on expense is input tax credit.",
      `${payment} is credited for the total amount ${
        details.paymentAccount === "Creditor" ? "payable" : "paid"
      }, ${formatRupees(details.invoiceTotal)}.`,
    ];
  }

  if (classification.compoundDetails?.kind === "goods_gst_purchase") {
    const details = classification.compoundDetails;
    if (details.taxLines?.length) {
      if (details.gstInclusive) {
        return [
          `The total invoice amount is ${formatRupees(details.invoiceTotal)} including ${taxNarrationLabel(
            details.taxLines,
          )}.`,
          splitGstRateExplanation(details.taxLines),
          `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
            totalTaxRate(details.taxLines),
          )} = ${formatRupees(details.baseAmount)}.`,
          ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
          "Purchases A/c is debited for the base value of goods.",
          `${inputTaxAccountLabel(details.taxLines)} ${
            details.taxLines.length === 1 ? "is" : "are"
          } debited because GST paid on purchase is input tax credit.`,
          `${displayAccountName(details.creditorAccount)} is credited for the total invoice amount ${
            details.paymentAccount === "Creditor" ? "payable" : "paid"
          }.`,
        ];
      }

      return [
        `Goods worth ${formatRupees(details.baseAmount)} were purchased.`,
        ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
        "Purchases A/c is debited for the value of goods.",
        `${inputTaxAccountLabel(details.taxLines)} ${
          details.taxLines.length === 1 ? "is" : "are"
        } debited because GST paid on purchase is input tax credit.`,
        `${displayAccountName(details.creditorAccount)} is credited for the total amount ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }, ${formatRupees(details.invoiceTotal)}.`,
      ];
    }

    if (details.gstInclusive) {
      return [
        `The total invoice amount is ${formatRupees(details.invoiceTotal)} including GST.`,
        `GST rate is ${formatPercent(details.gstRate)}.`,
        `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
          details.gstRate,
        )} = ${formatRupees(details.baseAmount)}.`,
        `GST amount = ${formatRupees(details.invoiceTotal)} - ${formatRupees(details.baseAmount)} = ${formatRupees(
          details.gstAmount,
        )}.`,
        "Purchases A/c is debited for the base value of goods.",
        "Input GST A/c is debited because GST paid on purchase is input tax credit.",
        `${displayAccountName(details.creditorAccount)} is credited for the total invoice amount ${
          details.paymentAccount === "Creditor" ? "payable" : "paid"
        }.`,
      ];
    }

    return [
      `Goods worth ${formatRupees(details.baseAmount)} were purchased.`,
      `${gstAmountExplanation(details.gstAmount, details.gstRate)}.`,
      "Purchases A/c is debited for the value of goods.",
      "Input GST A/c is debited because GST paid on purchase is input tax credit.",
      `${displayAccountName(details.creditorAccount)} is credited for the total amount ${
        details.paymentAccount === "Creditor" ? "payable" : "paid"
      }, ${formatRupees(details.invoiceTotal)}.`,
    ];
  }

  if (classification.compoundDetails?.kind === "goods_gst_sale") {
    const details = classification.compoundDetails;
    if (details.taxLines?.length) {
      if (details.gstInclusive) {
        return [
          `The total invoice amount is ${formatRupees(details.invoiceTotal)} including ${taxNarrationLabel(
            details.taxLines,
          )}.`,
          splitGstRateExplanation(details.taxLines),
          `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
            totalTaxRate(details.taxLines),
          )} = ${formatRupees(details.baseAmount)}.`,
          ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
          `${displayAccountName(details.debtorAccount)} is debited for the total invoice amount ${
            details.receiptAccount === "Debtor" ? "receivable" : "received"
          }.`,
          "Sales A/c is credited for the base value of goods.",
          `${outputTaxAccountLabel(details.taxLines)} ${
            details.taxLines.length === 1 ? "is" : "are"
          } credited because GST collected is payable to the government.`,
        ];
      }

      return [
        `Goods worth ${formatRupees(details.baseAmount)} were sold.`,
        ...details.taxLines.map((line) => taxLineExplanation(line.taxType, line.amount, line.rate)),
        `${displayAccountName(details.debtorAccount)} is debited for total amount ${
          details.receiptAccount === "Debtor" ? "receivable" : "received"
        }, ${formatRupees(details.invoiceTotal)}.`,
        "Sales A/c is credited for the value of goods.",
        `${outputTaxAccountLabel(details.taxLines)} ${
          details.taxLines.length === 1 ? "is" : "are"
        } credited because GST collected is payable to the government.`,
      ];
    }

    if (details.gstInclusive) {
      return [
        `The total invoice amount is ${formatRupees(details.invoiceTotal)} including GST.`,
        `GST rate is ${formatPercent(details.gstRate)}.`,
        `Base value = ${formatRupees(details.invoiceTotal)} × 100 / ${formatPercentDenominator(
          details.gstRate,
        )} = ${formatRupees(details.baseAmount)}.`,
        `GST amount = ${formatRupees(details.invoiceTotal)} - ${formatRupees(details.baseAmount)} = ${formatRupees(
          details.gstAmount,
        )}.`,
        `${displayAccountName(details.debtorAccount)} is debited for the total amount ${
          details.receiptAccount === "Debtor" ? "receivable" : "received"
        }.`,
        "Sales A/c is credited for the base value of goods.",
        "Output GST A/c is credited because GST collected is payable to the government.",
      ];
    }

    return [
      `Goods worth ${formatRupees(details.baseAmount)} were sold.`,
      `${gstAmountExplanation(details.gstAmount, details.gstRate)}.`,
      `${displayAccountName(details.debtorAccount)} is debited for total amount ${
        details.receiptAccount === "Debtor" ? "receivable" : "received"
      }, ${formatRupees(details.invoiceTotal)}.`,
      "Sales A/c is credited for the value of goods.",
      "Output GST A/c is credited because GST collected is payable to the government.",
    ];
  }

  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    const details = classification.compoundDetails;
    return [
      `Goods worth ${formatRupees(details.totalAmount)} were purchased.`,
      "Purchases A/c is debited for the full purchase value.",
      `${formatRupees(details.paidAmount)} was paid immediately, so ${details.paymentAccount} A/c is credited.`,
      `The remaining ${formatRupees(details.balanceAmount)} is payable, so ${displayAccountName(
        details.creditorAccount,
      )} is credited.`,
    ];
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    const details = classification.compoundDetails;
    return [
      `Goods worth ${formatRupees(details.totalAmount)} were sold.`,
      `${formatRupees(details.receivedAmount)} was received immediately, so ${details.receiptAccount} A/c is debited.`,
      `The remaining ${formatRupees(details.balanceAmount)} is receivable on credit, so ${displayAccountName(
        details.debtorAccount,
      )} is debited.`,
      "Sales A/c is credited for the full sale value.",
    ];
  }

  if (classification.compoundDetails?.kind === "discount_allowed_settlement") {
    const details = classification.compoundDetails;
    return [
      `${displayAccountName(details.debtorAccount)} owed the business ${formatRupees(details.fullAmount)}.`,
      `The business received only ${formatRupees(details.receivedAmount)}.`,
      `The difference ${formatRupees(details.discountAmount)} is discount allowed.`,
      `${displayAccountName(details.receiptAccount)} is debited for the amount received.`,
      "Discount Allowed A/c is debited as loss.",
      `${displayAccountName(details.debtorAccount)} is credited to close/reduce the debtor balance.`,
    ];
  }

  if (classification.compoundDetails?.kind === "discount_received_settlement") {
    const details = classification.compoundDetails;
    return [
      `The business owed ${displayAccountName(details.creditorAccount)} ${formatRupees(details.fullAmount)}.`,
      `The business paid only ${formatRupees(details.paidAmount)}.`,
      `The difference ${formatRupees(details.discountAmount)} is discount received.`,
      `${displayAccountName(details.creditorAccount)} is debited to reduce/close the liability.`,
      `${displayAccountName(details.paymentAccount)} is credited for the actual payment.`,
      "Discount Received A/c is credited as income/gain.",
    ];
  }

  if (classification.transaction_type === "goods_withdrawn_personal_use") {
    return [
      "The proprietor/owner took business goods for personal use.",
      "This is treated as drawings because the owner withdrew value from the business.",
      "Drawings A/c is debited because drawings increase.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "goods_distributed_free_sample") {
    return [
      "Goods were distributed as free samples to promote the business.",
      "This is treated as advertisement/promotion expense.",
      "Advertisement Expense A/c is debited because expenses are debited.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "goods_given_as_charity") {
    return [
      "Goods were given as charity/donation.",
      "This is treated as charity/donation expense.",
      "Charity Expense A/c is debited because expenses are debited.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "goods_lost_by_fire") {
    return [
      "Goods were lost/destroyed by fire.",
      "This is treated as a business loss.",
      "Loss by Fire A/c is debited because losses are debited.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "goods_lost_by_theft") {
    return [
      "Goods were stolen or lost by theft.",
      "This is treated as a business loss.",
      "Loss by Theft A/c is debited because losses are debited.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "goods_lost_general") {
    return [
      "Goods were lost or damaged.",
      "This is treated as a business loss.",
      "Goods Lost A/c is debited because losses are debited.",
      "Purchases A/c is credited because goods purchased for resale are reduced.",
    ];
  }

  if (classification.transaction_type === "sales_return") {
    const customer = classification.partyName ?? "customer";
    const customerAccount = displayAccountName(classification.creditAccount);
    return [
      `Goods sold earlier were returned by ${customer}.`,
      "This reduces the earlier sales, so Sales Return A/c is debited.",
      `${customerAccount} receivable balance decreases, so ${customerAccount} is credited.`,
      "This is also called Return Inward.",
    ];
  }

  if (classification.transaction_type === "purchase_return") {
    const supplier = classification.partyName ?? "supplier";
    const supplierAccount = displayAccountName(classification.debitAccount);
    return [
      `Goods purchased earlier were returned to ${supplier}.`,
      `The amount payable to ${supplier} decreases, so ${supplierAccount} is debited.`,
      "Purchase Return A/c is credited because purchase returns reduce purchases.",
      "This is also called Return Outward.",
    ];
  }

  if (isCommonExpensePayment(classification)) {
    const expense = displayAccountName(classification.debitAccount);
    const payment = displayAccountName(classification.creditAccount);
    return [
      `${expense} is an expense of the business.`,
      "Expenses are debited.",
      classification.creditAccount === "Bank"
        ? `Payment was made through bank/digital mode, so ${payment} is credited.`
        : `Cash was paid, so ${payment} is credited.`,
      `Therefore, ${expense} is debited and ${payment} is credited.`,
    ];
  }

  if (isCommonIncomeReceipt(classification)) {
    const receipt = displayAccountName(classification.debitAccount);
    const income = displayAccountName(classification.creditAccount);
    return [
      `${income} has been received by the business.`,
      classification.debitAccount === "Bank"
        ? `Payment was received through bank/digital mode, so ${receipt} is debited.`
        : `Cash is received, so ${receipt} is debited.`,
      `${income} is income, so ${income} is credited.`,
      `Therefore, ${receipt} is debited and ${income} is credited.`,
    ];
  }

  if (isFixedAssetPurchase(classification)) {
    const asset = displayAccountName(classification.debitAccount);
    const payment = displayAccountName(classification.creditAccount);
    const itemLabel = assetItemLabel(classification);
    const supplier = classification.partyName ?? classification.creditAccount;
    return [
      `A ${itemLabel} was purchased for business use.`,
      `${titleCase(itemLabel)} is treated as a fixed asset, not goods for resale.`,
      `${asset} is debited because the asset increases.`,
      classification.partyAccountSide === "credit"
        ? `${payment} is credited because amount is payable to ${supplier}.`
        : `${payment} is credited because ${
            classification.creditAccount === "Bank" ? "bank/digital payment was made" : "cash goes out"
          }.`,
    ];
  }

  if (classification.debitAccount === "Depreciation") {
    const asset = classification.creditAccount;
    return [
      `${displayAccountName(asset)} is used in business and loses value over time.`,
      "This loss in value is called depreciation.",
      "Depreciation is an expense/loss, so Depreciation A/c is debited.",
      `${displayAccountName(asset)} value decreases, so ${displayAccountName(asset)} is credited.`,
    ];
  }

  if (classification.debitAccount === "Bad Debts") {
    const debtor = displayAccountName(classification.creditAccount);
    return [
      `The amount due from ${classification.partyName ?? "debtor"} is no longer recoverable.`,
      "This loss is called bad debt.",
      "Bad Debts A/c is debited because losses are debited.",
      `${debtor} is credited because the receivable from ${classification.partyName ?? "debtor"} is reduced.`,
    ];
  }

  if (classification.creditAccount === "Bad Debts Recovered") {
    return [
      "An amount earlier written off as bad debt has now been recovered.",
      `${classification.debitAccount} is received, so ${displayAccountName(classification.debitAccount)} is debited.`,
      "Bad Debts Recovered is an income/gain, so it is credited.",
      "The entry records the recovery of the earlier bad debt.",
    ];
  }

  const incomeReceivedInAdvance = getIncomeReceivedInAdvanceDetails(classification);
  if (incomeReceivedInAdvance) {
    return [
      `${incomeReceivedInAdvance.incomeLabel} has been received before it is earned.`,
      "The unearned portion does not belong to the current period's income.",
      `${displayAccountName(classification.debitAccount)} is debited because income is reduced.`,
      `${displayAccountName(classification.creditAccount)} is credited because it is a liability.`,
    ];
  }

  const accruedIncome = getAccruedIncomeDetails(classification);
  if (accruedIncome) {
    return [
      `${accruedIncome.incomeLabel} income has been earned.`,
      "The amount has not yet been received.",
      `${displayAccountName(classification.debitAccount)} is debited because it is an asset/receivable.`,
      `${displayAccountName(classification.creditAccount)} is credited because income has increased.`,
    ];
  }

  const prepaidExpense = getPrepaidExpenseDetails(classification);
  if (prepaidExpense) {
    return [
      `${prepaidExpense.expenseLabel} has been paid in advance.`,
      `The advance ${prepaidExpense.futureBenefitLabel} gives future benefit to the business.`,
      `${displayAccountName(classification.debitAccount)} is debited because it is an asset.`,
      `${displayAccountName(classification.creditAccount)} is credited because the current period expense is reduced.`,
    ];
  }

  const outstandingExpense = getOutstandingExpenseDetails(classification);
  if (outstandingExpense) {
    return [
      `${outstandingExpense.expenseLabel} expense has been incurred.`,
      `The ${outstandingExpense.expenseLower} has not yet been paid.`,
      `${displayAccountName(classification.debitAccount)} is debited because expenses are debited.`,
      `${displayAccountName(classification.creditAccount)} is credited because it is a liability/payable.`,
    ];
  }

  const debitMetadata = getAccountMetadata(classification.debitAccount, {
    partyName: classification.partyName,
    partyRole: classification.debitAccount === classification.partyName ? classification.partyRole : undefined,
  });
  const creditMetadata = getAccountMetadata(classification.creditAccount, {
    partyName: classification.partyName,
    partyRole: classification.creditAccount === classification.partyName ? classification.partyRole : undefined,
  });

  return [
    describeTransactionAction(classification),
    `${debitMetadata.displayName} is a ${debitMetadata.modernType.toLowerCase()} account.`,
    `${debitMetadata.displayName} is debited because: ${debitMetadata.debitReason}`,
    `${creditMetadata.displayName} is credited because: ${creditMetadata.creditReason}`,
  ];
}

function buildCommonMistakes(classification: TransactionClassification): string[] {
  const mistakes: string[] = [];

  if (classification.compoundDetails?.kind === "asset_sale") {
    if (classification.compoundDetails.usesDisposalAccount) {
      return [
        "Do not compare sale value with original cost; compare it with book value.",
        "Do not ignore accumulated depreciation.",
        "Do not credit Sales A/c because this is sale of an asset, not sale of goods.",
        "Do not debit Purchases A/c.",
        "Do not add GST in this beginner disposal case.",
      ];
    }

    return [
      "Do not credit Sales A/c because this is sale of an asset, not sale of goods.",
      "Do not ignore profit/loss when book value and sale value are both given.",
      "Do not debit Purchases A/c.",
      "Do not calculate profit/loss unless book value is given.",
      "Do not use Asset Disposal A/c in this beginner case.",
      "Do not add GST unless GST on asset sale is clearly supported later.",
    ];
  }

  if (classification.compoundDetails?.kind === "asset_purchase_installation_charge") {
    return [
      "Do not debit Installation Expense A/c.",
      "Do not debit Purchases A/c.",
      "Do not record installation separately in this beginner case.",
      "Do not ignore installation charges.",
      "Do not add GST unless GST is clearly supported for this combined case.",
    ];
  }

  if (classification.compoundDetails?.kind === "asset_installation_charge") {
    return [
      "Do not debit Installation Expense A/c when charges are directly related to installing an asset.",
      "Do not debit Repairs Expense A/c; installation is not repair.",
      "Do not debit Purchases A/c; this is a fixed asset cost.",
      "If paid by UPI, bank, or cheque, use Bank A/c instead of Cash A/c.",
      "Do not add GST unless GST on installation charges is clearly supported later.",
    ];
  }

  if (classification.compoundDetails?.kind === "asset_gst_purchase") {
    return [
      "Do not debit Purchases A/c for fixed assets.",
      "Do not add GST to the asset cost in this MVP when GST input credit is separately shown.",
      "Do not credit Input GST/Input CGST/Input SGST/Input IGST.",
      `Do not credit ${displayAccountName(classification.creditAccount)} only for the base amount.`,
      "Do not use Output GST on purchases.",
    ];
  }

  if (classification.compoundDetails?.kind === "expense_gst_payment") {
    return [
      "Do not add GST amount to the expense account.",
      "Do not credit Input GST/Input CGST/Input SGST/Input IGST.",
      `Do not credit ${displayAccountName(classification.creditAccount)} only for the base amount.`,
      "Do not use Output GST on expense payments.",
      "Do not confuse paid consultancy/professional fees with consultancy income.",
    ];
  }

  if (classification.compoundDetails?.kind === "goods_gst_purchase") {
    if (classification.compoundDetails.taxLines?.length) {
      return [
        "Do not use generic Input GST/Output GST when CGST/SGST/IGST is specifically mentioned.",
        "Do not add tax amount into Purchases/Sales.",
        "Do not credit Input CGST/SGST/IGST on purchase.",
        "Do not debit Output CGST/SGST/IGST on sale.",
        "Do not solve split GST if clear tax rates or tax amounts are missing.",
      ];
    }

    if (classification.compoundDetails.gstInclusive) {
      return [
        `Do not debit Purchases A/c with the full ${formatRupees(
          classification.compoundDetails.invoiceTotal,
        )} when GST is included.`,
        'Do not treat "including GST" the same as "plus GST".',
        "Do not credit Cash only for the base amount.",
        "Do not split CGST/SGST/IGST in this MVP.",
      ];
    }

    return [
      "Do not add GST amount to Purchases A/c.",
      "Do not credit Input GST.",
      `Do not credit ${displayAccountName(classification.creditAccount)} only for ${formatRupees(
        classification.compoundDetails.baseAmount,
      )}; total payment includes GST.`,
      "Do not split CGST/SGST/IGST in this MVP unless clearly supported later.",
    ];
  }

  if (classification.compoundDetails?.kind === "goods_gst_sale") {
    if (classification.compoundDetails.taxLines?.length) {
      return [
        "Do not use generic Input GST/Output GST when CGST/SGST/IGST is specifically mentioned.",
        "Do not add tax amount into Purchases/Sales.",
        "Do not credit Input CGST/SGST/IGST on purchase.",
        "Do not debit Output CGST/SGST/IGST on sale.",
        "Do not solve split GST if clear tax rates or tax amounts are missing.",
      ];
    }

    if (classification.compoundDetails.gstInclusive) {
      return [
        `Do not credit Sales A/c with the full ${formatRupees(classification.compoundDetails.invoiceTotal)}.`,
        'Do not treat "including GST" the same as "plus GST".',
        "Do not debit Cash only for the base amount.",
        "Do not split CGST/SGST/IGST in this MVP.",
      ];
    }

    return [
      "Do not include GST inside Sales A/c.",
      "Do not debit Output GST.",
      `Do not debit ${displayAccountName(classification.debitAccount)} only for ${formatRupees(
        classification.compoundDetails.baseAmount,
      )}; total receipt includes GST.`,
      "Do not split CGST/SGST/IGST in this MVP unless clearly supported later.",
    ];
  }

  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    const details = classification.compoundDetails;
    return [
      `Do not credit ${details.paymentAccount} for the full ${formatRupees(
        details.totalAmount,
      )} because only ${formatRupees(details.paidAmount)} was paid immediately.`,
      `Do not ignore the ${formatRupees(details.balanceAmount)} balance payable on credit.`,
    ];
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    const details = classification.compoundDetails;
    return [
      `Do not debit ${details.receiptAccount} for the full ${formatRupees(
        details.totalAmount,
      )} because only ${formatRupees(details.receivedAmount)} was received immediately.`,
      `Do not ignore the ${formatRupees(details.balanceAmount)} balance receivable on credit.`,
    ];
  }

  if (classification.compoundDetails?.kind === "discount_allowed_settlement") {
    const details = classification.compoundDetails;
    return [
      `Do not debit ${details.receiptAccount} for the full ${formatRupees(
        details.fullAmount,
      )} because only ${formatRupees(details.receivedAmount)} was received.`,
      "Do not ignore discount allowed.",
      "Do not credit Sales; this is settlement of debtor, not a new sale.",
    ];
  }

  if (classification.compoundDetails?.kind === "discount_received_settlement") {
    const details = classification.compoundDetails;
    return [
      `Do not credit ${details.paymentAccount} for the full ${formatRupees(
        details.fullAmount,
      )} because only ${formatRupees(details.paidAmount)} was paid.`,
      "Do not ignore discount received.",
      "Do not debit Purchases; this is settlement of creditor, not a new purchase.",
    ];
  }

  if (classification.transaction_type === "goods_withdrawn_personal_use") {
    return [
      "Do not debit Purchases A/c.",
      "Do not credit Cash or Bank because no cash is paid.",
      "Do not use Sales A/c because this is not a sale.",
      "Do not use Capital A/c directly in beginner journal entries; use Drawings A/c.",
    ];
  }

  if (classification.transaction_type === "goods_distributed_free_sample") {
    return [
      "Do not debit Purchases A/c.",
      "Do not credit Cash or Bank because no cash is paid.",
      "Do not credit Sales A/c because this is not a sale.",
      "Do not use Drawings A/c because the goods were not taken by the owner for personal use.",
    ];
  }

  if (classification.transaction_type === "goods_given_as_charity") {
    return [
      "Do not debit Purchases A/c.",
      "Do not credit Cash or Bank because no cash is paid.",
      "Do not credit Sales A/c because this is not a sale.",
      "Do not use Drawings A/c because the goods were not taken by the owner for personal use.",
      "Do not use Advertisement Expense A/c because this is charity, not free sample/promotion.",
    ];
  }

  if (
    ["goods_lost_by_fire", "goods_lost_by_theft", "goods_lost_general"].includes(classification.transaction_type)
  ) {
    return [
      "Do not debit Purchases A/c.",
      "Do not credit Cash or Bank because no cash is paid.",
      "Do not credit Sales A/c because this is not a sale.",
      "Do not use Drawings A/c because the goods were not taken by the owner.",
      "Do not record insurance claim unless the transaction clearly mentions insurance claim.",
    ];
  }

  if (classification.transaction_type === "sales_return") {
    return [
      "Do not debit Sales A/c directly in beginner journal entries; use Sales Return A/c.",
      "Do not credit Cash or Bank unless the transaction clearly says refund was paid.",
      "Do not use Purchase Return A/c because goods were returned by customer, not returned to supplier.",
      "Do not use Purchases A/c because this is related to sales, not purchase.",
    ];
  }

  if (classification.transaction_type === "purchase_return") {
    return [
      "Do not credit Purchases A/c directly in beginner journal entries; use Purchase Return A/c.",
      "Do not credit Cash or Bank unless the transaction clearly says cash refund was received.",
      "Do not use Sales Return A/c because goods were returned to supplier, not returned by customer.",
      "Do not use Sales A/c because this is not a sale.",
    ];
  }

  if (isCommonExpensePayment(classification)) {
    return [
      "Do not credit the expense account.",
      `Do not debit ${classification.creditAccount} when ${classification.creditAccount.toLowerCase()} is paid.`,
      "If paid by UPI/bank/cheque, use Bank A/c instead of Cash A/c.",
    ];
  }

  if (isCommonIncomeReceipt(classification)) {
    return [
      `Do not debit ${displayAccountName(classification.creditAccount)} when income is received.`,
      `Do not credit ${displayAccountName(classification.debitAccount)} when ${classification.debitAccount.toLowerCase()} is received.`,
      "If received by UPI/bank/cheque, use Bank A/c instead of Cash A/c.",
      `Do not confuse ${displayAccountName(classification.creditAccount)} with an expense account.`,
    ];
  }

  if (isFixedAssetPurchase(classification)) {
    return [
      "Do not debit Purchases A/c if the item is a business asset.",
      "Do not credit Sales A/c.",
      "If paid by UPI/bank/cheque, use Bank A/c instead of Cash A/c.",
      "If purchased on credit from a named supplier, credit the supplier's account.",
    ];
  }

  if (classification.debitAccount === "Depreciation") {
    return [
      `Do not debit ${classification.creditAccount} for depreciation.`,
      "Do not credit Cash or Bank because no cash is paid when depreciation is recorded.",
      "Depreciation is a non-cash expense.",
    ];
  }

  if (classification.debitAccount === "Bad Debts") {
    return [
      "Do not debit Debtor A/c when bad debt is written off.",
      "Do not credit Cash or Bank because no cash is paid.",
      "Bad debts written off is a non-cash loss.",
    ];
  }

  if (classification.creditAccount === "Bad Debts Recovered") {
    return [
      "Do not debit Bad Debts Recovered A/c.",
      "Do not credit Debtor/Raju A/c in this beginner MVP treatment.",
      "Bad Debts Recovered is income/gain, not an expense.",
    ];
  }

  if (getIncomeReceivedInAdvanceDetails(classification)) {
    return [
      "Do not debit Cash or Bank in this adjustment entry.",
      "Income received in advance is a liability, not income of the current period.",
      "Do not treat advance rent received as rent expense.",
    ];
  }

  if (getAccruedIncomeDetails(classification)) {
    return [
      "Do not debit Cash or Bank because no money has been received yet.",
      "Do not ignore income just because it has not been received.",
      "Accrued income is an asset/receivable.",
    ];
  }

  if (getPrepaidExpenseDetails(classification)) {
    return [
      `Do not debit ${displayAccountName(classification.creditAccount)} for the prepaid portion.`,
      "Do not credit Cash or Bank in this adjustment entry, because the payment was already recorded earlier.",
      "Prepaid expense is an asset, not an expense.",
    ];
  }

  if (getOutstandingExpenseDetails(classification)) {
    return [
      "Do not credit Cash or Bank because no payment has been made yet.",
      "Outstanding expense means payable, so a liability is created.",
      "Do not ignore the expense just because it is unpaid.",
    ];
  }

  if (classification.debitAccount === "Purchases") {
    mistakes.push("Do not debit Goods A/c in basic Class 11 entries. Use Purchases A/c for goods bought for resale.");
  }

  if (classification.creditAccount === "Sales") {
    mistakes.push("Do not credit Goods A/c for a sale. Use Sales A/c for goods sold.");
  }

  if (classification.debitAccount === "Cash" || classification.creditAccount === "Cash") {
    mistakes.push("Do not use Bank A/c when the transaction clearly says cash.");
  }

  if (classification.debitAccount === "Bank" || classification.creditAccount === "Bank") {
    mistakes.push("Use Bank A/c for cheque, UPI, card, NEFT, or online transfer in this beginner app.");
  }

  if (classification.debitAccount === "Drawings") {
    mistakes.push("Do not debit Capital A/c for owner's personal withdrawal. Use Drawings A/c.");
  }

  if (classification.debitAccount === "Debtor" || classification.creditAccount === "Creditor") {
    mistakes.push("Use Debtor/Creditor when no clear party name is given. Use the party name when it is clearly given.");
  }

  return mistakes.length > 0 ? mistakes : ["Check the account name, side, and amount before writing the final answer."];
}

function buildPracticeQuestion(classification: TransactionClassification): SolverPracticeQuestion {
  if (classification.compoundDetails?.kind === "asset_sale") {
    const details = classification.compoundDetails;
    const mode =
      details.receiptAccount === "Debtor"
        ? details.partyName
          ? `to ${details.partyName} on credit`
          : "on credit"
        : details.receiptAccount === "Bank"
          ? "through bank"
          : "for cash";
    if (
      details.usesDisposalAccount &&
      details.originalCost !== undefined &&
      details.accumulatedDepreciation !== undefined
    ) {
      return {
        question: `Sold ${details.assetLabel} costing ${formatRupees(
          details.originalCost,
        )} with accumulated depreciation ${formatRupees(details.accumulatedDepreciation)} for ${formatRupees(
          details.saleValue,
        )} ${mode}`,
        expectedPattern: `Asset Disposal A/c Dr. To ${displayAccountName(details.assetAccount)}`,
      };
    }

    return {
      question:
        details.bookValue === undefined
          ? `Sold ${details.assetLabel} ${formatRupees(details.amount)} ${mode}`
          : `Sold ${details.assetLabel} costing ${formatRupees(details.bookValue)} for ${formatRupees(
              details.saleValue,
            )} ${mode}`,
      expectedPattern: `${displayAccountName(details.debtorAccount)} Dr. To ${displayAccountName(
        details.assetAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "asset_purchase_installation_charge") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Creditor"
        ? details.partyName
          ? `from ${details.partyName} on credit`
          : "on credit"
        : details.paymentAccount === "Bank"
          ? "through bank"
          : "in cash";
    const verb = details.assetLabel === "laptop" ? "Bought" : "Purchased";
    return {
      question: `${verb} ${details.assetLabel} ${formatRupees(details.assetAmount)} and paid ${
        details.chargeLabel
      } ${formatRupees(details.chargeAmount)} ${mode}`,
      expectedPattern: `${displayAccountName(details.assetAccount)} Dr. To ${displayAccountName(
        details.creditorAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "asset_installation_charge") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Bank"
        ? "through bank"
        : details.paymentAccount === "Cash"
          ? "in cash"
          : "on credit";
    return {
      question: `Paid ${details.chargeLabel} on ${details.assetLabel} ${formatRupees(details.amount)} ${mode}`,
      expectedPattern: `${displayAccountName(details.assetAccount)} Dr. To ${displayAccountName(
        details.creditorAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "asset_gst_purchase") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Creditor"
        ? details.partyName
          ? `from ${details.partyName} on credit`
          : "on credit"
        : details.paymentAccount === "Bank"
          ? "through bank"
          : "for cash";
    const verb = details.assetLabel === "laptop" ? "Bought" : "Purchased";

    return {
      question: details.gstInclusive
        ? `${verb} ${details.assetLabel} ${formatRupees(details.invoiceTotal)} including ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`
        : `${verb} ${details.assetLabel} ${formatRupees(details.baseAmount)} plus ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`,
      expectedPattern: `${displayAccountName(details.assetAccount)} Dr., ${inputTaxPattern(
        details.taxLines,
      )} To ${displayAccountName(details.creditorAccount)}`,
    };
  }

  if (classification.compoundDetails?.kind === "expense_gst_payment") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Creditor"
        ? details.partyName
          ? `from ${details.partyName} on credit`
          : "payable"
        : details.paymentAccount === "Bank"
          ? "through bank"
          : "in cash";
    return {
      question: details.gstInclusive
        ? `Paid ${details.expenseLabel} ${formatRupees(details.invoiceTotal)} including ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`
        : `Paid ${details.expenseLabel} ${formatRupees(details.baseAmount)} plus ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`,
      expectedPattern: `${displayAccountName(details.expenseAccount)} Dr., ${inputTaxPattern(
        details.taxLines,
      )} To ${displayAccountName(details.creditorAccount)}`,
    };
  }

  if (classification.compoundDetails?.kind === "goods_gst_purchase") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Creditor"
        ? details.partyName
          ? `from ${details.partyName} on credit`
          : "on credit"
        : details.paymentAccount === "Bank"
          ? "through bank"
          : "for cash";
    return {
      question: details.gstInclusive
        ? `Purchased goods ${formatRupees(details.invoiceTotal)} including ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`
        : `Purchased goods ${formatRupees(details.baseAmount)} plus ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`,
      expectedPattern: `Purchases A/c Dr., ${inputTaxPattern(details.taxLines)} To ${displayAccountName(
        details.creditorAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "goods_gst_sale") {
    const details = classification.compoundDetails;
    const mode =
      details.receiptAccount === "Debtor"
        ? details.partyName
          ? `to ${details.partyName} on credit`
          : "on credit"
        : details.receiptAccount === "Bank"
          ? "through bank"
          : "for cash";
    return {
      question: details.gstInclusive
        ? `Sold goods ${formatRupees(details.invoiceTotal)} including ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`
        : `Sold goods ${formatRupees(details.baseAmount)} plus ${taxQuestionLabel(
            details.taxLines,
            details.gstRate,
            details.gstAmount,
          )} ${mode}`,
      expectedPattern: `${displayAccountName(details.debtorAccount)} Dr. To Sales A/c, ${outputTaxPattern(
        details.taxLines,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    const details = classification.compoundDetails;
    return {
      question: `Bought goods ${formatRupees(details.totalAmount * 2)}, paid ${formatRupees(
        details.paidAmount * 2,
      )} ${details.paymentAccount === "Bank" ? "through bank" : "cash"} and balance on credit`,
      expectedPattern: `Purchases A/c Dr. To ${details.paymentAccount} A/c, To ${displayAccountName(
        details.creditorAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    const details = classification.compoundDetails;
    return {
      question: `Sold goods ${formatRupees(details.totalAmount * 2)}, received ${formatRupees(
        details.receivedAmount * 2,
      )} ${details.receiptAccount === "Bank" ? "through bank" : "cash"} and balance on credit`,
      expectedPattern: `${details.receiptAccount} A/c Dr., ${displayAccountName(
        details.debtorAccount,
      )} Dr. To Sales A/c`,
    };
  }

  if (classification.compoundDetails?.kind === "discount_allowed_settlement") {
    const details = classification.compoundDetails;
    return {
      question: `Received ${formatRupees(details.receivedAmount * 2)} from Mohan in full settlement of ${formatRupees(
        details.fullAmount * 2,
      )}`,
      expectedPattern: `${details.receiptAccount} A/c Dr., Discount Allowed A/c Dr. To ${displayAccountName(
        details.debtorAccount,
      )}`,
    };
  }

  if (classification.compoundDetails?.kind === "discount_received_settlement") {
    const details = classification.compoundDetails;
    return {
      question: `Paid ${formatRupees(details.paidAmount * 2)} to Ram in full settlement of ${formatRupees(
        details.fullAmount * 2,
      )}`,
      expectedPattern: `${displayAccountName(details.creditorAccount)} Dr. To ${
        details.paymentAccount
      } A/c, To Discount Received A/c`,
    };
  }

  if (classification.transaction_type === "goods_withdrawn_personal_use") {
    return {
      question: `Owner took goods ${formatRupees(classification.amount * 2)} for personal use`,
      expectedPattern: "Drawings A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "goods_distributed_free_sample") {
    return {
      question: `Goods used for advertisement ${formatRupees(classification.amount * 2)}`,
      expectedPattern: "Advertisement Expense A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "goods_given_as_charity") {
    return {
      question: `Goods used for charity ${formatRupees(classification.amount * 2)}`,
      expectedPattern: "Charity Expense A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "goods_lost_by_fire") {
    return {
      question: `Goods worth ${formatRupees(classification.amount * 2)} lost by fire`,
      expectedPattern: "Loss by Fire A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "goods_lost_by_theft") {
    return {
      question: `Goods worth ${formatRupees(classification.amount * 2)} stolen`,
      expectedPattern: "Loss by Theft A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "goods_lost_general") {
    return {
      question: `Goods worth ${formatRupees(classification.amount * 2)} lost`,
      expectedPattern: "Goods Lost A/c Dr. To Purchases A/c",
    };
  }

  if (classification.transaction_type === "sales_return") {
    return {
      question: `Sales return from Amit ${formatRupees(classification.amount * 2)}`,
      expectedPattern: "Sales Return A/c Dr. To Amit A/c",
    };
  }

  if (classification.transaction_type === "purchase_return") {
    return {
      question: `Purchase return to Rahul ${formatRupees(classification.amount * 2)}`,
      expectedPattern: "Rahul A/c Dr. To Purchase Return A/c",
    };
  }

  if (isCommonExpensePayment(classification)) {
    return {
      question: `Paid ${displayAccountName(classification.debitAccount).replace(" A/c", "").toLowerCase()} ${formatRupees(
        classification.amount * 2,
      )} ${classification.creditAccount === "Bank" ? "through bank" : "in cash"}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  if (isCommonIncomeReceipt(classification)) {
    return {
      question: `Received ${displayAccountName(classification.creditAccount)
        .replace(" A/c", "")
        .toLowerCase()} ${formatRupees(classification.amount * 2)} ${
        classification.debitAccount === "Bank" ? "through bank" : "in cash"
      }`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  if (isFixedAssetPurchase(classification)) {
    const itemLabel = assetItemLabel(classification);
    const mode = classification.partyAccountSide === "credit"
      ? "from Amit on credit"
      : classification.creditAccount === "Bank"
        ? "through bank"
        : "for cash";
    return {
      question: `Bought ${itemLabel} ${mode} ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${
        classification.partyAccountSide === "credit" ? "Amit A/c" : displayAccountName(classification.creditAccount)
      }`,
    };
  }

  if (classification.debitAccount === "Depreciation") {
    return {
      question: `Depreciation charged on ${classification.creditAccount.toLowerCase()} ${formatRupees(
        classification.amount * 2,
      )}`,
      expectedPattern: `Depreciation A/c Dr. To ${displayAccountName(classification.creditAccount)}`,
    };
  }

  if (classification.debitAccount === "Bad Debts") {
    return {
      question: classification.partyName
        ? `Raju became insolvent and ${formatRupees(classification.amount * 2)} became bad debt`
        : `Bad debts written off ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `Bad Debts A/c Dr. To ${displayAccountName(classification.creditAccount)}`,
    };
  }

  if (classification.creditAccount === "Bad Debts Recovered") {
    return {
      question: classification.partyName
        ? `Bad debts recovered from Raju ${formatRupees(classification.amount * 2)} in cash`
        : `Bad debts recovered ${formatRupees(classification.amount * 2)} ${
            classification.debitAccount === "Bank" ? "through bank" : "in cash"
          }`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To Bad Debts Recovered A/c`,
    };
  }

  const incomeReceivedInAdvance = getIncomeReceivedInAdvanceDetails(classification);
  if (incomeReceivedInAdvance) {
    return {
      question: `${incomeReceivedInAdvance.practiceLabel} ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  const accruedIncome = getAccruedIncomeDetails(classification);
  if (accruedIncome) {
    return {
      question: `${accruedIncome.practiceLabel} ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  const prepaidExpense = getPrepaidExpenseDetails(classification);
  if (prepaidExpense) {
    return {
      question: `${prepaidExpense.practiceLabel} ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  const outstandingExpense = getOutstandingExpenseDetails(classification);
  if (outstandingExpense) {
    return {
      question: `${outstandingExpense.practiceLabel} ${formatRupees(classification.amount * 2)}`,
      expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
        classification.creditAccount,
      )}`,
    };
  }

  return {
    question: generatePracticeQuestion(classification),
    expectedPattern: `${displayAccountName(classification.debitAccount)} Dr. To ${displayAccountName(
      classification.creditAccount,
    )}`,
  };
}

function buildNarration(classification: TransactionClassification): string {
  const debit = classification.debitAccount;
  const credit = classification.creditAccount;
  const partyName = classification.partyName;

  if (classification.compoundDetails?.kind === "asset_sale") {
    const details = classification.compoundDetails;
    if (details.usesDisposalAccount) {
      const resultLabel = details.lossAmount ? " at a loss" : details.profitAmount ? " at a profit" : "";
      if (details.receiptAccount === "Cash") {
        return `Being ${details.assetLabel} sold for cash using Asset Disposal A/c${resultLabel}.`;
      }
      if (details.receiptAccount === "Bank") {
        return `Being ${details.assetLabel} sold through bank using Asset Disposal A/c${resultLabel}.`;
      }
      return details.partyName
        ? `Being ${details.assetLabel} sold to ${details.partyName} on credit using Asset Disposal A/c${resultLabel}.`
        : `Being ${details.assetLabel} sold on credit using Asset Disposal A/c${resultLabel}.`;
    }

    const resultLabel = details.lossAmount ? " at a loss" : details.profitAmount ? " at a profit" : "";
    if (details.receiptAccount === "Cash") return `Being ${details.assetLabel} sold for cash${resultLabel}.`;
    if (details.receiptAccount === "Bank") return `Being ${details.assetLabel} sold through bank${resultLabel}.`;
    return details.partyName
      ? `Being ${details.assetLabel} sold to ${details.partyName} on credit${resultLabel}.`
      : `Being ${details.assetLabel} sold on credit${resultLabel}.`;
  }

  if (classification.compoundDetails?.kind === "asset_purchase_installation_charge") {
    const details = classification.compoundDetails;
    if (details.paymentAccount === "Cash") {
      return `Being ${details.assetLabel} purchased and ${details.chargeLabel} paid in cash.`;
    }
    if (details.paymentAccount === "Bank") {
      return `Being ${details.assetLabel} purchased and ${details.chargeLabel} paid through bank/digital mode.`;
    }
    return details.partyName
      ? `Being ${details.assetLabel} purchased from ${details.partyName} on credit including ${details.chargeLabel}.`
      : `Being ${details.assetLabel} purchased on credit including ${details.chargeLabel}.`;
  }

  if (classification.compoundDetails?.kind === "asset_installation_charge") {
    const details = classification.compoundDetails;
    const mode =
      details.paymentAccount === "Bank"
        ? "through bank/digital mode"
        : details.paymentAccount === "Cash"
          ? "in cash"
          : "on credit";
    return `Being ${details.chargeLabel} on ${details.assetLabel} paid ${mode}.`;
  }

  if (classification.compoundDetails?.kind === "asset_gst_purchase") {
    const details = classification.compoundDetails;
    const gstLabel = details.taxLines?.length
      ? `${details.gstInclusive ? "including" : "plus"} ${taxNarrationLabel(details.taxLines)}`
      : details.gstInclusive
        ? "including GST"
        : "plus GST";
    if (details.paymentAccount === "Cash") return `Being ${details.assetLabel} purchased for cash ${gstLabel}.`;
    if (details.paymentAccount === "Bank") return `Being ${details.assetLabel} purchased through bank ${gstLabel}.`;
    return details.partyName
      ? `Being ${details.assetLabel} purchased from ${details.partyName} on credit ${gstLabel}.`
      : `Being ${details.assetLabel} purchased on credit ${gstLabel}.`;
  }

  if (classification.compoundDetails?.kind === "expense_gst_payment") {
    const details = classification.compoundDetails;
    const gstLabel = details.taxLines?.length
      ? `plus ${taxNarrationLabel(details.taxLines)}`
      : details.gstInclusive
        ? "including GST"
        : "plus GST";
    if (details.paymentAccount === "Cash") return `Being ${details.expenseLabel} paid in cash ${gstLabel}.`;
    if (details.paymentAccount === "Bank") return `Being ${details.expenseLabel} paid through bank ${gstLabel}.`;
    return details.partyName
      ? `Being ${details.expenseLabel} payable to ${details.partyName} ${gstLabel}.`
      : `Being ${details.expenseLabel} payable ${gstLabel}.`;
  }

  if (classification.compoundDetails?.kind === "goods_gst_purchase") {
    const details = classification.compoundDetails;
    const gstLabel = details.taxLines?.length
      ? `${details.gstInclusive ? "including" : "plus"} ${taxNarrationLabel(details.taxLines)}`
      : details.gstInclusive
        ? "including GST"
        : "plus GST";
    if (details.paymentAccount === "Cash") return `Being goods purchased for cash ${gstLabel}.`;
    if (details.paymentAccount === "Bank") return `Being goods purchased through bank ${gstLabel}.`;
    return details.partyName
      ? `Being goods purchased from ${details.partyName} on credit ${gstLabel}.`
      : `Being goods purchased on credit ${gstLabel}.`;
  }

  if (classification.compoundDetails?.kind === "goods_gst_sale") {
    const details = classification.compoundDetails;
    const gstLabel = details.taxLines?.length
      ? `${details.gstInclusive ? "including" : "plus"} ${taxNarrationLabel(details.taxLines)}`
      : details.gstInclusive
        ? "including GST"
        : "plus GST";
    if (details.receiptAccount === "Cash") return `Being goods sold for cash ${gstLabel}.`;
    if (details.receiptAccount === "Bank") return `Being goods sold through bank ${gstLabel}.`;
    return details.partyName
      ? `Being goods sold to ${details.partyName} on credit ${gstLabel}.`
      : `Being goods sold on credit ${gstLabel}.`;
  }

  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    const details = classification.compoundDetails;
    return `Being goods purchased, ${formatRupees(details.paidAmount)} paid ${
      details.paymentAccount === "Bank" ? "through bank/digital payment" : "in cash"
    } and balance ${formatRupees(details.balanceAmount)} on credit.`;
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    const details = classification.compoundDetails;
    return `Being goods sold, ${formatRupees(details.receivedAmount)} received ${
      details.receiptAccount === "Bank" ? "through bank/digital payment" : "in cash"
    } and balance ${formatRupees(details.balanceAmount)} on credit.`;
  }

  if (classification.compoundDetails?.kind === "discount_allowed_settlement") {
    const details = classification.compoundDetails;
    const debtorLabel = details.partyName ? details.partyName : "debtor";
    if (details.receiptAccount === "Bank") {
      return "Being amount received through bank in full settlement and discount allowed.";
    }
    return `Being amount received from ${debtorLabel} in full settlement and discount allowed.`;
  }

  if (classification.compoundDetails?.kind === "discount_received_settlement") {
    const details = classification.compoundDetails;
    const creditorLabel = details.partyName ? details.partyName : "creditor";
    if (details.paymentAccount === "Bank") {
      return "Being amount paid through bank in full settlement and discount received.";
    }
    return `Being amount paid to ${creditorLabel} in full settlement and discount received.`;
  }

  if (classification.transaction_type === "goods_withdrawn_personal_use") {
    if (/\bhousehold\s+use\b/i.test(classification.transaction_type)) {
      return "Being goods withdrawn for household use.";
    }
    return "Being goods withdrawn by proprietor for personal use.";
  }

  if (classification.transaction_type === "goods_distributed_free_sample") {
    return "Being goods distributed as free sample.";
  }

  if (classification.transaction_type === "goods_given_as_charity") {
    return "Being goods given as charity.";
  }

  if (classification.transaction_type === "goods_lost_by_fire") {
    return "Being goods lost by fire.";
  }

  if (classification.transaction_type === "goods_lost_by_theft") {
    return "Being goods lost by theft.";
  }

  if (classification.transaction_type === "goods_lost_general") {
    return "Being goods lost/damaged.";
  }

  if (classification.transaction_type === "sales_return") {
    const customer = classification.partyName ?? "customer";
    return `Being goods returned by ${customer}.`;
  }

  if (classification.transaction_type === "purchase_return") {
    const supplier = classification.partyName ?? "supplier";
    return `Being goods returned to ${supplier}.`;
  }

  if (isCommonExpensePayment(classification)) {
    const expenseLabel = displayAccountName(classification.debitAccount).replace(" A/c", "").toLowerCase();
    return `Being ${expenseLabel} paid ${classification.creditAccount === "Bank" ? "through bank/digital mode" : "in cash"}.`;
  }

  if (isCommonIncomeReceipt(classification)) {
    const incomeLabel = displayAccountName(classification.creditAccount).replace(" A/c", "").toLowerCase();
    return `Being ${incomeLabel} received ${classification.debitAccount === "Bank" ? "through bank/digital mode" : "in cash"}.`;
  }

  if (debit === "Depreciation") {
    return `Being depreciation charged on ${credit.toLowerCase()}.`;
  }

  if (debit === "Bad Debts") {
    return partyName ? `Being amount due from ${partyName} written off as bad debt.` : "Being bad debts written off.";
  }

  if (credit === "Bad Debts Recovered") {
    if (partyName) return `Being bad debts previously written off recovered from ${partyName}.`;
    return `Being bad debts recovered ${debit === "Bank" ? "through bank" : "in cash"}.`;
  }

  const incomeReceivedInAdvance = getIncomeReceivedInAdvanceDetails(classification);
  if (incomeReceivedInAdvance) {
    return `Being ${incomeReceivedInAdvance.narrationLabel} received in advance adjusted.`;
  }

  const accruedIncome = getAccruedIncomeDetails(classification);
  if (accruedIncome) {
    return `Being ${accruedIncome.narrationLabel} accrued.`;
  }

  const prepaidExpense = getPrepaidExpenseDetails(classification);
  if (prepaidExpense) {
    return `Being ${prepaidExpense.narrationLabel}.`;
  }

  const outstandingExpense = getOutstandingExpenseDetails(classification);
  if (outstandingExpense) {
    return `Being ${outstandingExpense.narrationLabel} outstanding.`;
  }

  if (debit === "Purchases" && credit === "Cash") {
    return partyName ? `Being goods purchased from ${partyName} for cash.` : "Being goods purchased for cash.";
  }
  if (debit === "Purchases" && classification.partyAccountSide === "credit") {
    return `Being goods purchased from ${credit} on credit.`;
  }
  if (debit === "Purchases" && credit === "Creditor") return "Being goods purchased on credit.";
  if (debit === "Cash" && credit === "Sales") {
    return partyName ? `Being goods sold to ${partyName} for cash.` : "Being goods sold for cash.";
  }
  if (debit === "Bank" && credit === "Sales") {
    return partyName
      ? `Being goods sold to ${partyName} through bank/digital payment.`
      : "Being goods sold through bank.";
  }
  if (classification.partyAccountSide === "debit" && credit === "Sales") {
    return `Being goods sold to ${debit} on credit.`;
  }
  if (debit === "Debtor" && credit === "Sales") return "Being goods sold on credit.";
  if (debit === "Cash" && credit === "Capital") return "Being capital introduced in cash.";
  if (debit === "Bank" && credit === "Capital") return "Being capital introduced through bank.";
  if (debit === "Rent Expense") return `Being rent paid ${credit === "Bank" ? "through bank" : "in cash"}.`;
  if (debit === "Salary Expense") return `Being salary paid ${credit === "Bank" ? "through bank" : "in cash"}.`;
  if (debit === "Interest Expense") return `Being interest paid ${credit === "Bank" ? "through bank" : "in cash"}.`;
  if (credit === "Interest Income") return `Being interest received ${debit === "Bank" ? "through bank" : "in cash"}.`;
  if (credit === "Commission Income") return `Being commission received ${debit === "Bank" ? "through bank" : "in cash"}.`;
  if (debit === "Drawings") return `Being amount withdrawn by owner ${credit === "Bank" ? "through bank" : "in cash"}.`;
  if (classification.partyAccountSide === "debit" && (credit === "Bank" || credit === "Cash")) {
    return `Being amount paid to ${debit} ${credit === "Bank" ? "through bank/digital payment" : "in cash"}.`;
  }
  if (debit === "Creditor") return `Being amount paid to creditor ${credit === "Bank" ? "through bank" : "in cash"}.`;
  if (classification.partyAccountSide === "credit" && (debit === "Bank" || debit === "Cash")) {
    return `Being ${debit === "Bank" ? "amount" : "cash"} received from ${credit}${
      debit === "Bank" ? " through bank/digital payment" : ""
    }.`;
  }
  if (credit === "Debtor") return `Being amount received from debtor ${debit === "Bank" ? "through bank" : "in cash"}.`;
  if (debit === "Bank" && credit === "Cash") return "Being cash deposited into bank.";
  if (debit === "Cash" && credit === "Bank") return "Being cash withdrawn from bank.";
  if (debit === "Bank" && credit === "Loan") return "Being loan taken through bank.";
  if (debit === "Cash" && credit === "Loan") return "Being loan taken in cash.";
  if (debit === "Loan" && credit === "Bank") return "Being loan repaid through bank.";
  if (debit === "Loan" && credit === "Cash") return "Being loan repaid in cash.";
  if (isFixedAssetPurchase(classification)) {
    const asset = assetItemLabel(classification);
    if (credit === "Cash") {
      return partyName ? `Being ${asset} purchased from ${partyName} for cash.` : `Being ${asset} purchased for cash.`;
    }
    if (credit === "Bank") return `Being ${asset} purchased through bank.`;
    if (classification.partyAccountSide === "credit") return `Being ${asset} purchased from ${credit} on credit.`;
    if (credit === "Creditor") return `Being ${asset} purchased on credit.`;
  }

  return `Being ${displayAccountName(debit)} debited and ${displayAccountName(credit)} credited.`;
}

function describeTransactionAction(classification: TransactionClassification): string {
  if (classification.compoundDetails?.kind === "asset_sale") {
    if (classification.compoundDetails.usesDisposalAccount) {
      return "The business sold a fixed asset with accumulated depreciation using Asset Disposal A/c.";
    }
    if (classification.compoundDetails.bookValue !== undefined) {
      return "The business sold a fixed asset and calculated profit or loss using book value.";
    }
    return "The business sold a fixed asset without calculating profit or loss on sale.";
  }

  if (classification.compoundDetails?.kind === "asset_purchase_installation_charge") {
    return "The business purchased a fixed asset and included installation-related charges in the asset cost.";
  }

  if (classification.compoundDetails?.kind === "asset_installation_charge") {
    return "The business paid a charge directly related to bringing a fixed asset into usable condition.";
  }

  if (classification.compoundDetails?.kind === "asset_gst_purchase") {
    return "The business purchased a fixed asset and paid or became liable for GST input tax on the purchase.";
  }

  if (classification.compoundDetails?.kind === "expense_gst_payment") {
    return "The business paid or became liable for a selected business expense with GST input tax.";
  }

  if (classification.compoundDetails?.kind === "goods_gst_purchase") {
    return "The business purchased goods and paid or became liable for GST on the purchase.";
  }

  if (classification.compoundDetails?.kind === "goods_gst_sale") {
    return "The business sold goods and collected GST payable to the government.";
  }

  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    return "The business bought goods, paid part immediately, and kept the balance payable on credit.";
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    return "The business sold goods, received part immediately, and kept the balance receivable on credit.";
  }

  if (classification.compoundDetails?.kind === "discount_allowed_settlement") {
    return "A debtor settled the account for less than the amount due, so discount was allowed.";
  }

  if (classification.compoundDetails?.kind === "discount_received_settlement") {
    return "A creditor accepted less than the amount payable, so discount was received.";
  }

  if (classification.transaction_type === "goods_withdrawn_personal_use") {
    return "The owner withdrew business goods for personal use.";
  }

  if (classification.transaction_type === "goods_distributed_free_sample") {
    return "Goods were distributed as free samples to promote the business.";
  }

  if (classification.transaction_type === "goods_given_as_charity") {
    return "Goods were given as charity or donation.";
  }

  if (classification.transaction_type === "goods_lost_by_fire") {
    return "Goods were lost or destroyed by fire.";
  }

  if (classification.transaction_type === "goods_lost_by_theft") {
    return "Goods were stolen or lost by theft.";
  }

  if (classification.transaction_type === "goods_lost_general") {
    return "Goods were lost or damaged.";
  }

  if (classification.transaction_type === "sales_return") {
    return "Goods sold earlier were returned by the customer.";
  }

  if (classification.transaction_type === "purchase_return") {
    return "Goods purchased earlier were returned to the supplier.";
  }

  if (isCommonExpensePayment(classification)) {
    return `${displayAccountName(classification.debitAccount)} was paid.`;
  }

  if (isCommonIncomeReceipt(classification)) {
    return `${displayAccountName(classification.creditAccount)} was received.`;
  }

  if (isFixedAssetPurchase(classification)) {
    return `${displayAccountName(classification.debitAccount)} was purchased as a business asset.`;
  }

  const debit = classification.debitAccount;
  const credit = classification.creditAccount;

  if (debit === "Depreciation") return "Depreciation was recorded on a business asset.";
  if (debit === "Bad Debts") return "An irrecoverable debtor balance was written off.";
  if (credit === "Bad Debts Recovered") return "An amount previously written off as bad debt was recovered.";
  if (getIncomeReceivedInAdvanceDetails(classification)) return "Income received before it was earned was adjusted.";
  if (getAccruedIncomeDetails(classification)) return "Income was earned but has not yet been received.";
  if (getPrepaidExpenseDetails(classification)) return "An expense paid in advance was adjusted as a prepaid asset.";
  if (getOutstandingExpenseDetails(classification)) return "An expense was incurred but has not yet been paid.";
  if (debit === "Purchases") return "The business bought goods for resale.";
  if (credit === "Sales") return "The business sold goods.";
  if (credit === "Capital") return "The owner introduced capital into the business.";
  if (debit === "Rent Expense") return "The business paid rent.";
  if (debit === "Salary Expense") return "The business paid salary.";
  if (debit === "Interest Expense") return "The business paid interest.";
  if (credit === "Interest Income") return "The business received interest income.";
  if (credit === "Commission Income") return "The business received commission income.";
  if (debit === "Drawings") return "The owner withdrew value for personal use.";
  if (debit === "Creditor") return "The business paid a creditor.";
  if (credit === "Debtor") return "The business received money from a debtor.";
  if (debit === "Bank" && credit === "Cash") return "Cash was deposited into the bank.";
  if (debit === "Cash" && credit === "Bank") return "Cash was withdrawn from the bank.";
  if (credit === "Loan") return "The business took a loan.";
  if (debit === "Loan") return "The business repaid a loan.";

  return "The transaction affects two accounts.";
}

function isBalanced(entry: CorrectJournalEntry): boolean {
  const debitTotal = entry.debits.reduce((total, line) => total + line.amount, 0);
  const creditTotal = entry.credits.reduce((total, line) => total + line.amount, 0);
  return debitTotal === creditTotal && debitTotal > 0;
}

function toSolverConfidence(confidence: number): SolverConfidence {
  if (confidence >= 0.9) return "high";
  if (confidence >= 0.7) return "medium";
  return "low";
}

function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function isCommonExpensePayment(classification: TransactionClassification): boolean {
  return (
    commonExpenseAccounts.has(classification.debitAccount) &&
    (classification.creditAccount === "Cash" || classification.creditAccount === "Bank") &&
    classification.transaction_type.startsWith("paid_")
  );
}

function isCommonIncomeReceipt(classification: TransactionClassification): boolean {
  return (
    (classification.debitAccount === "Cash" || classification.debitAccount === "Bank") &&
    commonIncomeAccounts.has(classification.creditAccount) &&
    classification.transaction_type.includes("received")
  );
}

function isFixedAssetPurchase(classification: TransactionClassification): boolean {
  return (
    fixedAssetAccounts.has(classification.debitAccount) &&
    (classification.creditAccount === "Cash" ||
      classification.creditAccount === "Bank" ||
      classification.creditAccount === "Creditor" ||
      classification.partyAccountSide === "credit")
  );
}

function assetItemLabel(classification: TransactionClassification): string {
  const match = classification.transaction_type.match(/^asset_purchase_([a-z_]+)_(?:cash|bank|credit)$/);
  if (match?.[1]) return match[1].replace(/_/g, " ");
  if (classification.transaction_type === "bought_machinery_cheque") return "machinery";
  if (classification.transaction_type === "bought_furniture_cash") return "furniture";
  return displayAccountName(classification.debitAccount).replace(" A/c", "").toLowerCase();
}

function titleCase(value: string): string {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function gstAmountExplanation(gstAmount: number, gstRate?: number): string {
  return gstRate ? `GST at ${gstRate}% is ${formatRupees(gstAmount)}` : `GST amount is ${formatRupees(gstAmount)}`;
}

function taxLineExplanation(taxType: GoodsGstTaxLine["taxType"], amount: number, rate?: number): string {
  return rate ? `${taxType} at ${formatPercent(rate)} is ${formatRupees(amount)}.` : `${taxType} amount is ${formatRupees(amount)}.`;
}

function splitGstRateExplanation(taxLines: GoodsGstTaxLine[]): string {
  const totalRate = totalTaxRate(taxLines);
  const rateParts = taxLines.map((line) => `${formatPercent(line.rate)} ${line.taxType}`).join(" + ");
  return taxLines.length === 1
    ? `${taxLines[0].taxType} rate is ${formatPercent(taxLines[0].rate)}.`
    : `Total GST rate = ${rateParts} = ${formatPercent(totalRate)}.`;
}

function totalTaxRate(taxLines: GoodsGstTaxLine[]): number | undefined {
  if (taxLines.some((line) => line.rate === undefined)) return undefined;
  return taxLines.reduce((total, line) => total + (line.rate ?? 0), 0);
}

function inputTaxAccountLabel(taxLines: GoodsGstTaxLine[]): string {
  return taxLines.map((line) => displayAccountName(line.inputAccount).replace(" A/c", "")).join(" and ");
}

function outputTaxAccountLabel(taxLines: GoodsGstTaxLine[]): string {
  return taxLines.map((line) => displayAccountName(line.outputAccount).replace(" A/c", "")).join(" and ");
}

function taxNarrationLabel(taxLines: GoodsGstTaxLine[]): string {
  return taxLines.map((line) => line.taxType).join(" and ");
}

function taxQuestionLabel(taxLines: GoodsGstTaxLine[] | undefined, gstRate: number | undefined, gstAmount: number): string {
  if (taxLines?.length) {
    return taxLines
      .map((line) => (line.rate ? `${line.taxType} ${formatPercent(line.rate)}` : `${line.taxType} ${formatRupees(line.amount)}`))
      .join(" and ");
  }

  return gstRate ? `GST ${formatPercent(gstRate)}` : `GST ${formatRupees(gstAmount)}`;
}

function inputTaxPattern(taxLines: GoodsGstTaxLine[] | undefined): string {
  if (!taxLines?.length) return "Input GST A/c Dr.";
  return taxLines.map((line) => `${displayAccountName(line.inputAccount)} Dr.`).join(", ");
}

function outputTaxPattern(taxLines: GoodsGstTaxLine[] | undefined): string {
  if (!taxLines?.length) return "To Output GST A/c";
  return taxLines.map((line) => `To ${displayAccountName(line.outputAccount)}`).join(", ");
}

function formatPercent(value: number | undefined): string {
  return value === undefined ? "the given rate" : `${formatNumber(value)}%`;
}

function formatPercentDenominator(value: number | undefined): string {
  return value === undefined ? "100 + GST rate" : formatNumber(100 + value);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function emptyPracticeQuestion(): SolverPracticeQuestion {
  return {
    question: "",
    expectedPattern: "",
  };
}

function getIncomeReceivedInAdvanceDetails(classification: TransactionClassification):
  | {
      incomeLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  | null {
  const details: Record<
    string,
    {
      incomeLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  > = {
    "Rent Received in Advance": {
      incomeLabel: "Rent",
      narrationLabel: "rent",
      practiceLabel: "Rent received in advance",
    },
    "Commission Received in Advance": {
      incomeLabel: "Commission",
      narrationLabel: "commission",
      practiceLabel: "Commission received in advance",
    },
    "Interest Received in Advance": {
      incomeLabel: "Interest",
      narrationLabel: "interest",
      practiceLabel: "Interest received in advance",
    },
  };

  return details[classification.creditAccount] ?? null;
}

function getAccruedIncomeDetails(classification: TransactionClassification):
  | {
      incomeLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  | null {
  const details: Record<
    string,
    {
      incomeLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  > = {
    "Accrued Interest": {
      incomeLabel: "Interest",
      narrationLabel: "interest",
      practiceLabel: "Interest accrued",
    },
    "Accrued Commission": {
      incomeLabel: "Commission",
      narrationLabel: "commission",
      practiceLabel: "Commission accrued",
    },
    "Accrued Rent": {
      incomeLabel: "Rent",
      narrationLabel: "rent",
      practiceLabel: "Rent accrued",
    },
  };

  return details[classification.debitAccount] ?? null;
}

function getPrepaidExpenseDetails(classification: TransactionClassification):
  | {
      expenseLabel: string;
      futureBenefitLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  | null {
  const details: Record<
    string,
    {
      expenseLabel: string;
      futureBenefitLabel: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  > = {
    "Prepaid Rent": {
      expenseLabel: "Rent",
      futureBenefitLabel: "rent",
      narrationLabel: "rent prepaid",
      practiceLabel: "Prepaid rent",
    },
    "Prepaid Insurance": {
      expenseLabel: "Insurance",
      futureBenefitLabel: "insurance premium",
      narrationLabel: "insurance premium prepaid",
      practiceLabel: "Prepaid insurance",
    },
    "Prepaid Salary": {
      expenseLabel: "Salary",
      futureBenefitLabel: "salary",
      narrationLabel: "salary paid in advance",
      practiceLabel: "Prepaid salary",
    },
    "Prepaid Wages": {
      expenseLabel: "Wages",
      futureBenefitLabel: "wages",
      narrationLabel: "wages paid in advance",
      practiceLabel: "Prepaid wages",
    },
    "Prepaid Electricity": {
      expenseLabel: "Electricity",
      futureBenefitLabel: "electricity expense",
      narrationLabel: "electricity expense prepaid",
      practiceLabel: "Prepaid electricity",
    },
  };

  return details[classification.debitAccount] ?? null;
}

function getOutstandingExpenseDetails(classification: TransactionClassification):
  | {
      expenseLabel: string;
      expenseLower: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  | null {
  const details: Record<
    string,
    {
      expenseLabel: string;
      expenseLower: string;
      narrationLabel: string;
      practiceLabel: string;
    }
  > = {
    "Outstanding Salary": {
      expenseLabel: "Salary",
      expenseLower: "salary",
      narrationLabel: "salary",
      practiceLabel: "Salary outstanding",
    },
    "Outstanding Rent": {
      expenseLabel: "Rent",
      expenseLower: "rent",
      narrationLabel: "rent",
      practiceLabel: "Rent outstanding",
    },
    "Outstanding Wages": {
      expenseLabel: "Wages",
      expenseLower: "wages",
      narrationLabel: "wages",
      practiceLabel: "Wages outstanding",
    },
    "Outstanding Electricity": {
      expenseLabel: "Electricity",
      expenseLower: "electricity bill",
      narrationLabel: "electricity bill",
      practiceLabel: "Electricity bill outstanding",
    },
    "Outstanding Insurance": {
      expenseLabel: "Insurance",
      expenseLower: "insurance premium",
      narrationLabel: "insurance premium",
      practiceLabel: "Insurance outstanding",
    },
  };

  return details[classification.creditAccount] ?? null;
}

function buildPartialGoodsPurchaseAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;
  if (details?.kind !== "partial_goods_purchase") return null;

  if (line.account === "Purchases") {
    return {
      account: "Purchases A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      effect: `Purchases increased by full value of goods bought (${formatRupees(details.totalAmount)})`,
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: `Goods worth ${formatRupees(details.totalAmount)} were purchased for resale.`,
    };
  }

  if (line.account === details.paymentAccount) {
    const metadata = getAccountMetadata(details.paymentAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: `${details.paymentAccount} decreased by ${formatRupees(details.paidAmount)}`,
      debitOrCredit: side,
      ruleApplied: metadata.creditRule,
      reason: `${formatRupees(details.paidAmount)} was paid immediately.`,
    };
  }

  if (line.account === details.creditorAccount) {
    const metadata = getAccountMetadata(details.creditorAccount, {
      partyName: details.partyName,
      partyRole: line.partyRole ?? "creditor",
    });
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType === "Account" ? "Liability / Creditor" : metadata.modernType,
      effect: `Amount payable increased by ${formatRupees(details.balanceAmount)}`,
      debitOrCredit: side,
      ruleApplied: "Credit the giver",
      reason: "Balance amount remains payable on credit.",
    };
  }

  return null;
}

function buildAssetSaleAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;
  if (details?.kind !== "asset_sale") return null;

  if (line.account === details.debtorAccount) {
    const metadata = getAccountMetadata(details.debtorAccount, {
      partyName: details.partyName,
      partyRole: line.partyRole ?? "debtor",
    });
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: details.receiptAccount === "Debtor" ? "Asset / Debtor" : metadata.modernType,
      effect:
        details.receiptAccount === "Bank"
          ? `Bank balance increased by ${formatRupees(details.amount)}`
          : details.receiptAccount === "Cash"
            ? `Cash increased by ${formatRupees(details.amount)}`
            : `Amount receivable from buyer increased by ${formatRupees(details.amount)}`,
      debitOrCredit: side,
      ruleApplied: side === "Debit" ? metadata.debitRule : metadata.creditRule,
      reason:
        details.receiptAccount === "Bank"
          ? "Amount is received through bank/digital mode."
          : details.receiptAccount === "Cash"
            ? "Cash is received from sale of asset."
            : "The buyer owes money for the asset sold on credit.",
    };
  }

  if (line.account === details.assetAccount) {
    const metadata = getAccountMetadata(details.assetAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: "Asset decreased",
      debitOrCredit: side,
      ruleApplied: "Credit what goes out / Asset decreases are credited",
      reason: "The asset is sold, so it goes out of the business.",
    };
  }

  return null;
}

function buildAssetPurchaseInstallationChargeAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;
  if (details?.kind !== "asset_purchase_installation_charge") return null;

  if (line.account === details.assetAccount) {
    const metadata = getAccountMetadata(details.assetAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: `Asset cost increased by ${formatRupees(details.totalAmount)}`,
      debitOrCredit: side,
      ruleApplied: "Debit what comes in / Asset increases are debited",
      reason: `Purchase price and ${details.chargeLabel} are capitalized into the asset account.`,
    };
  }

  if (line.account === details.creditorAccount) {
    const metadata = getAccountMetadata(details.creditorAccount, {
      partyName: details.partyName,
      partyRole: line.partyRole ?? "creditor",
    });
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType === "Account" ? "Liability / Creditor" : metadata.modernType,
      effect:
        details.paymentAccount === "Creditor"
          ? `Amount payable increased by ${formatRupees(details.totalAmount)}`
          : `${details.paymentAccount} decreased by ${formatRupees(details.totalAmount)}`,
      debitOrCredit: side,
      ruleApplied: metadata.creditRule,
      reason:
        details.paymentAccount === "Bank"
          ? "Payment was made through bank/digital mode."
          : details.paymentAccount === "Cash"
            ? "Cash was paid."
            : "The supplier gave the asset and installation-related value on credit.",
    };
  }

  return null;
}

function buildAssetInstallationChargeAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;
  if (details?.kind !== "asset_installation_charge") return null;

  if (line.account === details.assetAccount) {
    const metadata = getAccountMetadata(details.assetAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: `Asset cost increased by ${formatRupees(details.amount)}`,
      debitOrCredit: side,
      ruleApplied: "Debit what comes in / Asset increases are debited",
      reason: `${titleCase(
        details.chargeLabel,
      )} directly related to making the ${details.assetLabel} usable are capitalized into the asset account.`,
    };
  }

  if (line.account === details.creditorAccount) {
    const metadata = getAccountMetadata(details.creditorAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect:
        details.paymentAccount === "Creditor"
          ? `Amount payable increased by ${formatRupees(details.amount)}`
          : `${details.paymentAccount} decreased by ${formatRupees(details.amount)}`,
      debitOrCredit: side,
      ruleApplied: metadata.creditRule,
      reason:
        details.paymentAccount === "Bank"
          ? "Payment was made through bank/digital mode."
          : details.paymentAccount === "Cash"
            ? "Cash was paid."
            : "The charge remains payable.",
    };
  }

  return null;
}

function buildPartialGoodsSaleAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;
  if (details?.kind !== "partial_goods_sale") return null;

  if (line.account === details.receiptAccount) {
    const metadata = getAccountMetadata(details.receiptAccount);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: `${details.receiptAccount} increased by ${formatRupees(details.receivedAmount)}`,
      debitOrCredit: side,
      ruleApplied: metadata.debitRule,
      reason: `${formatRupees(details.receivedAmount)} was received immediately.`,
    };
  }

  if (line.account === details.debtorAccount) {
    const metadata = getAccountMetadata(details.debtorAccount, {
      partyName: details.partyName,
      partyRole: line.partyRole ?? "debtor",
    });
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType === "Account" ? "Asset / Debtor" : metadata.modernType,
      effect: `Amount receivable increased by ${formatRupees(details.balanceAmount)}`,
      debitOrCredit: side,
      ruleApplied: "Debit the receiver",
      reason: "Balance amount remains receivable on credit.",
    };
  }

  if (line.account === "Sales") {
    return {
      account: "Sales A/c",
      traditionalType: "Nominal Account",
      modernType: "Income/Revenue",
      effect: `Sales revenue increased by full value of goods sold (${formatRupees(details.totalAmount)})`,
      debitOrCredit: side,
      ruleApplied: "Credit all incomes and gains",
      reason: `Goods worth ${formatRupees(details.totalAmount)} were sold.`,
    };
  }

  return null;
}

function buildDiscountSettlementAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const details = classification.compoundDetails;

  if (details?.kind === "discount_allowed_settlement") {
    if (line.account === details.receiptAccount) {
      const metadata = getAccountMetadata(details.receiptAccount);
      return {
        account: metadata.displayName,
        traditionalType: metadata.traditionalType,
        modernType: metadata.modernType,
        effect: `${details.receiptAccount} increased by ${formatRupees(details.receivedAmount)}`,
        debitOrCredit: side,
        ruleApplied: metadata.debitRule,
        reason: `${formatRupees(details.receivedAmount)} was received in settlement.`,
      };
    }

    if (line.account === "Discount Allowed") {
      return {
        account: "Discount Allowed A/c",
        traditionalType: "Nominal Account",
        modernType: "Expense / Loss",
        effect: `Discount allowed loss increased by ${formatRupees(details.discountAmount)}`,
        debitOrCredit: side,
        ruleApplied: "Debit all expenses and losses",
        reason: "Discount allowed reduces the amount received from debtor and is treated as a loss/expense.",
      };
    }

    if (line.account === details.debtorAccount) {
      const metadata = getAccountMetadata(details.debtorAccount, {
        partyName: details.partyName,
        partyRole: line.partyRole ?? "debtor",
      });
      const debtorName = details.partyName ?? "debtor";
      return {
        account: metadata.displayName,
        traditionalType: "Personal Account",
        modernType: "Asset / Debtor",
        effect: `Receivable from ${debtorName} reduced by ${formatRupees(details.fullAmount)}`,
        debitOrCredit: side,
        ruleApplied: "Credit the giver / Reduce debtor asset",
        reason: "The debtor account is credited to close or reduce the receivable settled.",
      };
    }
  }

  if (details?.kind === "discount_received_settlement") {
    if (line.account === details.creditorAccount) {
      const metadata = getAccountMetadata(details.creditorAccount, {
        partyName: details.partyName,
        partyRole: line.partyRole ?? "creditor",
      });
      const creditorName = details.partyName ?? "creditor";
      return {
        account: metadata.displayName,
        traditionalType: "Personal Account",
        modernType: "Liability / Creditor",
        effect: `Liability to ${creditorName} reduced by ${formatRupees(details.fullAmount)}`,
        debitOrCredit: side,
        ruleApplied: "Debit the receiver / Liability decreases are debited",
        reason: "The creditor account is debited to close or reduce the liability settled.",
      };
    }

    if (line.account === details.paymentAccount) {
      const metadata = getAccountMetadata(details.paymentAccount);
      return {
        account: metadata.displayName,
        traditionalType: metadata.traditionalType,
        modernType: metadata.modernType,
        effect: `${details.paymentAccount} decreased by ${formatRupees(details.paidAmount)}`,
        debitOrCredit: side,
        ruleApplied: metadata.creditRule,
        reason: `${formatRupees(details.paidAmount)} was paid in settlement.`,
      };
    }

    if (line.account === "Discount Received") {
      return {
        account: "Discount Received A/c",
        traditionalType: "Nominal Account",
        modernType: "Income / Gain",
        effect: `Discount received income increased by ${formatRupees(details.discountAmount)}`,
        debitOrCredit: side,
        ruleApplied: "Credit all incomes and gains",
        reason: "Discount received reduces the amount paid to creditor and is treated as income/gain.",
      };
    }
  }

  return null;
}

function buildGoodsWithdrawalAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.transaction_type !== "goods_withdrawn_personal_use") return null;

  if (line.account === "Drawings") {
    return {
      account: "Drawings A/c",
      traditionalType: "Personal Account",
      modernType: "Capital reduction / Owner's withdrawal",
      effect: "Drawings increased",
      debitOrCredit: side,
      ruleApplied: "Debit the receiver / Capital decreases are debited",
      reason: "The owner has withdrawn goods from the business for personal use.",
    };
  }

  if (line.account === "Purchases") {
    return {
      account: "Purchases A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Goods purchased for resale",
      effect: "Purchases/goods available for business decreased",
      debitOrCredit: side,
      ruleApplied: "Credit the account when reducing purchases / Reduce goods purchased for resale",
      reason: "Goods originally purchased for business resale are taken out of the business, so Purchases A/c is credited.",
    };
  }

  return null;
}

function buildFreeSampleGoodsAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.transaction_type !== "goods_distributed_free_sample") return null;

  if (line.account === "Advertisement Expense") {
    return {
      account: "Advertisement Expense A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      effect: "Advertisement expense increased",
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: "Goods distributed as free samples are treated as advertisement/promotion expense.",
    };
  }

  if (line.account === "Purchases") {
    return {
      account: "Purchases A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Goods purchased for resale",
      effect: "Purchases/goods available for business decreased",
      debitOrCredit: side,
      ruleApplied: "Credit the account when reducing purchases / Reduce goods purchased for resale",
      reason: "Goods purchased for resale are taken out of business stock for free sample distribution.",
    };
  }

  return null;
}

function buildCharityGoodsAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.transaction_type !== "goods_given_as_charity") return null;

  if (line.account === "Charity Expense") {
    return {
      account: "Charity Expense A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      effect: "Charity/donation expense increased",
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: "Goods given as charity are treated as donation/charity expense.",
    };
  }

  if (line.account === "Purchases") {
    return {
      account: "Purchases A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Goods purchased for resale",
      effect: "Purchases/goods available for business decreased",
      debitOrCredit: side,
      ruleApplied: "Credit the account when reducing purchases / Reduce goods purchased for resale",
      reason: "Goods originally purchased for resale are taken out of business for charity, so Purchases A/c is credited.",
    };
  }

  return null;
}

function buildGoodsLossAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  const lossAccounts: Record<
    string,
    {
      account: string;
      effect: string;
      reason: string;
    }
  > = {
    goods_lost_by_fire: {
      account: "Loss by Fire",
      effect: "Loss by fire increased",
      reason: "Goods lost by fire are treated as a business loss.",
    },
    goods_lost_by_theft: {
      account: "Loss by Theft",
      effect: "Loss by theft increased",
      reason: "Goods stolen/lost by theft are treated as a business loss.",
    },
    goods_lost_general: {
      account: "Goods Lost",
      effect: "Goods loss increased",
      reason: "Goods lost or damaged are treated as a business loss.",
    },
  };

  const lossAccount = lossAccounts[classification.transaction_type];
  if (!lossAccount) return null;

  if (line.account === lossAccount.account) {
    return {
      account: `${lossAccount.account} A/c`,
      traditionalType: "Nominal Account",
      modernType: "Expense / Loss",
      effect: lossAccount.effect,
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: lossAccount.reason,
    };
  }

  if (line.account === "Purchases") {
    return {
      account: "Purchases A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Goods purchased for resale",
      effect: "Purchases/goods available for business decreased",
      debitOrCredit: side,
      ruleApplied: "Credit the account when reducing purchases / Reduce goods purchased for resale",
      reason: "Goods originally purchased for resale are no longer available, so Purchases A/c is credited.",
    };
  }

  return null;
}

function buildSalesReturnAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.transaction_type !== "sales_return") return null;

  if (line.account === "Sales Return") {
    return {
      account: "Sales Return A/c",
      traditionalType: "Nominal Account",
      modernType: "Contra Revenue / Sales Reduction",
      effect: "Sales return increased and sales revenue reduced",
      debitOrCredit: side,
      ruleApplied: "Debit the account that reduces income / Debit sales returns",
      reason: "Goods sold earlier were returned by the customer, so Sales Return A/c is debited.",
    };
  }

  const isDebtorAccount = line.account === "Debtor" || line.account === classification.partyName;
  if (isDebtorAccount) {
    const accountLabel = displayAccountName(line.account);
    const customer = classification.partyName ?? "customer";
    return {
      account: accountLabel,
      traditionalType: "Personal Account",
      modernType: line.account === "Debtor" ? "Asset" : "Asset / Debtor",
      effect: `Amount receivable from ${customer} decreased`,
      debitOrCredit: side,
      ruleApplied: "Credit the giver / Reduce debtor asset",
      reason: "The customer returned goods, so the amount receivable from the customer is reduced.",
    };
  }

  return null;
}

function buildPurchaseReturnAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.transaction_type !== "purchase_return") return null;

  const isCreditorAccount = line.account === "Creditor" || line.account === classification.partyName;
  if (isCreditorAccount) {
    const accountLabel = displayAccountName(line.account);
    const supplier = classification.partyName ?? "supplier";
    return {
      account: accountLabel,
      traditionalType: "Personal Account",
      modernType: line.account === "Creditor" ? "Liability" : "Liability / Creditor",
      effect: `Amount payable to ${supplier} decreased`,
      debitOrCredit: side,
      ruleApplied: "Debit the receiver / Liability decreases are debited",
      reason: "Goods are returned to supplier, so the amount payable to that supplier is reduced.",
    };
  }

  if (line.account === "Purchase Return") {
    return {
      account: "Purchase Return A/c",
      traditionalType: "Nominal Account",
      modernType: "Contra Expense / Purchase Reduction",
      effect: "Purchase return increased and purchases reduced",
      debitOrCredit: side,
      ruleApplied: "Credit the account that reduces expense / Credit purchase returns",
      reason: "Goods purchased earlier were returned to supplier, so Purchase Return A/c is credited.",
    };
  }

  return null;
}

function buildDepreciationAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.debitAccount !== "Depreciation") return null;

  if (line.account === "Depreciation") {
    return {
      account: "Depreciation A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense",
      effect: "Depreciation expense increased",
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: "Depreciation is a loss/expense due to reduction in asset value.",
    };
  }

  if (line.account === classification.creditAccount) {
    return {
      account: displayAccountName(line.account),
      traditionalType: "Real Account",
      modernType: "Asset",
      effect: `${displayAccountName(line.account)} value decreased`,
      debitOrCredit: side,
      ruleApplied: "Credit what goes out / Asset decreases are credited",
      reason: "The asset value is reduced due to depreciation.",
    };
  }

  return null;
}

function buildBadDebtAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.debitAccount !== "Bad Debts") return null;

  if (line.account === "Bad Debts") {
    return {
      account: "Bad Debts A/c",
      traditionalType: "Nominal Account",
      modernType: "Expense / Loss",
      effect: "Bad debts loss increased",
      debitOrCredit: side,
      ruleApplied: "Debit all expenses and losses",
      reason: "Bad debt is a loss because the business cannot recover the amount from the debtor.",
    };
  }

  if (line.account === classification.creditAccount) {
    const metadata = getAccountMetadata(line.account, {
      partyName: classification.partyName,
      partyRole: line.partyRole ?? (line.account === classification.partyName ? "debtor" : undefined),
    });
    const debtorName = classification.partyName ?? "debtor";

    return {
      account: metadata.displayName,
      traditionalType: "Personal Account",
      modernType: "Asset / Debtor",
      effect: `Amount receivable from ${debtorName} decreased`,
      debitOrCredit: side,
      ruleApplied: "Credit the giver / Reduce debtor asset",
      reason: "The amount is no longer recoverable, so the debtor's account is reduced.",
    };
  }

  return null;
}

function buildBadDebtRecoveryAffectedAccount(
  line: JournalLine,
  side: SolverSide,
  classification: TransactionClassification,
): SolverAffectedAccount | null {
  if (classification.creditAccount !== "Bad Debts Recovered") return null;

  if (line.account === classification.debitAccount && (line.account === "Cash" || line.account === "Bank")) {
    const metadata = getAccountMetadata(line.account);
    return {
      account: metadata.displayName,
      traditionalType: metadata.traditionalType,
      modernType: metadata.modernType,
      effect: side === "Debit" ? metadata.debitEffect : metadata.creditEffect,
      debitOrCredit: side,
      ruleApplied: line.account === "Bank" ? "Debit what comes in / Asset increases are debited" : metadata.debitRule,
      reason: line.account === "Bank" ? "Amount is received through bank/digital mode." : "Cash is received.",
    };
  }

  if (line.account === "Bad Debts Recovered") {
    return {
      account: "Bad Debts Recovered A/c",
      traditionalType: "Nominal Account",
      modernType: "Income / Gain",
      effect: "Bad debts recovery income increased",
      debitOrCredit: side,
      ruleApplied: "Credit all incomes and gains",
      reason: "An amount previously written off as bad debt has been recovered, so it is treated as income/gain.",
    };
  }

  return null;
}
