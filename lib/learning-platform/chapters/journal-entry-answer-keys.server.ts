import type { AccountingEntryLine, JournalEntryExpectedAnswer } from "@/lib/learning-platform/types";
import type { JournalEntryCorrectAnswerReveal, JournalEntryPracticeAnswerKey } from "@/lib/learning-platform/checkers/types";
import {
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
} from "./journal-entries";

const soldGoodsForCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "cash-debit",
    account: "Cash A/c",
    side: "debit",
    amount: 12000,
    drNotation: "Dr.",
  },
  {
    id: "sales-credit",
    account: "Sales A/c",
    side: "credit",
    amount: 12000,
    displayPrefix: "To",
  },
];

export const soldGoodsForCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: soldGoodsForCashExpectedLines,
  narration: "Being goods sold for cash.",
  totals: {
    debit: 12000,
    credit: 12000,
  },
  balanced: true,
};

export const soldGoodsForCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: soldGoodsForCashExpectedAnswer,
  expectedLines: [
    {
      ...soldGoodsForCashExpectedLines[0],
      accountKey: "cash",
      requiredParticularsHint: "Cash A/c Dr.",
      correctMessage: "Cash is correctly debited because cash is received.",
      errorMessage: "Cash should be debited because the business receives cash.",
      missingMarkerMessage: "Cash A/c needs Dr. because Cash is debited.",
      wrongMarkerMessage: "The Cash debit line should not start with To.",
      wrongAmountMessage: "Cash should be debited with ₹12,000.",
      wrongColumnMessage: "Cash should not be placed in the credit column.",
    },
    {
      ...soldGoodsForCashExpectedLines[1],
      accountKey: "sales",
      requiredParticularsHint: "To Sales A/c",
      correctMessage: "Sales is correctly credited because sales revenue increases.",
      errorMessage: "Sales should be credited because goods are sold.",
      missingMarkerMessage: "Sales A/c needs To because Sales is credited.",
      wrongMarkerMessage: "Sales should be credited, not marked Dr.",
      wrongAmountMessage: "Sales should be credited with ₹12,000.",
      wrongColumnMessage: "Sales should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being goods sold for cash", "goods sold for cash", "being cash sales"],
  narrationConceptHints: ["goods", "sale", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that goods were sold for cash.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being goods sold for cash.'",
    errorMessage: "Narration should explain that goods were sold for cash.",
    hint: "Mention that goods were sold for cash.",
  },
  unsupportedHint: "Return to one of the two supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with the account that receives cash, then write the account credited for the sale.",
  extraLineHint: "This question needs only Cash A/c Dr. and To Sales A/c.",
  correctSummary: "Correct. Your journal entry records cash received and sales credited for ₹12,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because cash is received.",
      hint: "Use Cash A/c when the question says goods are sold for cash.",
    },
    purchases: {
      errorMessage: "Purchases A/c is not used when goods are sold.",
      hint: "Use Sales A/c for goods sold, not Purchases A/c.",
    },
  },
};

const paidSalaryByBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "salary-debit",
    account: "Salary A/c",
    side: "debit",
    amount: 8000,
    drNotation: "Dr.",
  },
  {
    id: "bank-credit",
    account: "Bank A/c",
    side: "credit",
    amount: 8000,
    displayPrefix: "To",
  },
];

export const paidSalaryByBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidSalaryByBankExpectedLines,
  narration: "Being salary paid by bank.",
  totals: {
    debit: 8000,
    credit: 8000,
  },
  balanced: true,
};

export const paidSalaryByBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: paidSalaryByBankExpectedAnswer,
  expectedLines: [
    {
      ...paidSalaryByBankExpectedLines[0],
      accountKey: "salary",
      requiredParticularsHint: "Salary A/c Dr.",
      correctMessage: "Salary is an expense and is correctly debited.",
      errorMessage: "Salary is an expense and should be debited.",
      missingMarkerMessage: "Add Dr. to Salary A/c.",
      wrongMarkerMessage: "Salary is an expense and should be debited.",
      wrongAmountMessage: "Salary should be debited with ₹8,000.",
      wrongColumnMessage: "Salary should not be placed in the credit column.",
    },
    {
      ...paidSalaryByBankExpectedLines[1],
      accountKey: "bank",
      requiredParticularsHint: "To Bank A/c",
      correctMessage: "Bank is correctly credited because money is paid through bank.",
      errorMessage: "Bank should be credited because money is paid through bank.",
      missingMarkerMessage: "Prefix the credited Bank A/c with To.",
      wrongMarkerMessage: "Bank should be credited because money is paid through bank.",
      wrongAmountMessage: "Bank should be credited with ₹8,000.",
      wrongColumnMessage: "Bank should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being salary paid by bank",
    "salary paid by bank",
    "being salary paid through bank",
    "salary paid through bank",
  ],
  narrationConceptHints: ["salary", "paid", "bank"],
  narrationFeedback: {
    correctMessage: "Narration communicates that salary was paid by bank.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being salary paid by bank.'",
    errorMessage: "Narration should explain that salary was paid by bank.",
    hint: "Mention that salary was paid through bank.",
  },
  unsupportedHint: "Return to one of the two supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Salary A/c Dr., then write To Bank A/c because salary was paid through bank.",
  extraLineHint: "This question needs only Salary A/c Dr. and To Bank A/c.",
  correctSummary: "Correct. Your journal entry records salary expense debited and bank credited for ₹8,000.",
  unexpectedAccountFeedback: {
    cash: {
      errorMessage: "Cash A/c is not affected because the transaction states bank.",
      hint: "Use Bank A/c when the question says salary is paid by bank.",
    },
    rent: {
      errorMessage: "Rent A/c is a different expense and is not used here.",
      hint: "Use Salary A/c because the transaction is salary paid, not rent paid.",
    },
  },
};

const journalEntryPracticeAnswerKeys: Record<string, JournalEntryPracticeAnswerKey> = {
  [SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID]: soldGoodsForCashAnswerKey,
  [PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID]: paidSalaryByBankAnswerKey,
};

export function getJournalEntryPracticeAnswerKey(questionId: string): JournalEntryPracticeAnswerKey | null {
  return journalEntryPracticeAnswerKeys[questionId] ?? null;
}

export function getJournalEntryPracticeCorrectAnswerReveal(questionId: string): JournalEntryCorrectAnswerReveal {
  const answerKey = getJournalEntryPracticeAnswerKey(questionId);

  if (!answerKey) {
    return {
      questionId,
      available: false,
      lines: [],
      narration: "",
      message: "Correct answer reveal is only available for the supported Journal Entries preview questions.",
    };
  }

  return {
    questionId,
    available: true,
    lines: answerKey.expectedAnswer.lines.map((line) => ({
      id: `${line.id}-reveal`,
      particulars: `${line.displayPrefix ? `${line.displayPrefix} ` : ""}${line.account}${line.drNotation ? ` ${line.drNotation}` : ""}`,
      debitAmount: line.side === "debit" ? formatCurrency(line.amount) : undefined,
      creditAmount: line.side === "credit" ? formatCurrency(line.amount) : undefined,
    })),
    narration: answerKey.expectedAnswer.narration,
    message: "Correct answer revealed after an explicit student action.",
  };
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
