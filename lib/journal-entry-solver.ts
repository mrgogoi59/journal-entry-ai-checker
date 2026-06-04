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
} from "./types";

const unsupportedMessage =
  "I cannot safely solve this transaction yet. Please rewrite with amount, payment mode, and account context.";

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
    "bank",
    "creditor",
    "supplier",
    "rent",
    "salary",
    "interest",
    "commission",
    "electricity",
    "loan",
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
    buildPartialGoodsSaleAffectedAccount(line, side, classification);
  if (compoundAccount) return compoundAccount;

  const depreciationAccount = buildDepreciationAffectedAccount(line, side, classification);
  if (depreciationAccount) return depreciationAccount;

  const badDebtAccount = buildBadDebtAffectedAccount(line, side, classification);
  if (badDebtAccount) return badDebtAccount;

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

  if (debit === "Depreciation") {
    return `Being depreciation charged on ${credit.toLowerCase()}.`;
  }

  if (debit === "Bad Debts") {
    return partyName ? `Being amount due from ${partyName} written off as bad debt.` : "Being bad debts written off.";
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
  if (["Furniture", "Machinery", "Equipment", "Vehicle", "Computer"].includes(debit)) {
    const asset = debit.toLowerCase();
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
  if (classification.compoundDetails?.kind === "partial_goods_purchase") {
    return "The business bought goods, paid part immediately, and kept the balance payable on credit.";
  }

  if (classification.compoundDetails?.kind === "partial_goods_sale") {
    return "The business sold goods, received part immediately, and kept the balance receivable on credit.";
  }

  const debit = classification.debitAccount;
  const credit = classification.creditAccount;

  if (debit === "Depreciation") return "Depreciation was recorded on a business asset.";
  if (debit === "Bad Debts") return "An irrecoverable debtor balance was written off.";
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

function emptyPracticeQuestion(): SolverPracticeQuestion {
  return {
    question: "",
    expectedPattern: "",
  };
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
