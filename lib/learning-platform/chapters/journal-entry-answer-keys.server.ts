import type { AccountingEntryLine, JournalEntryExpectedAnswer } from "@/lib/learning-platform/types";
import type { JournalEntryCorrectAnswerReveal, JournalEntryPracticeAnswerKey } from "@/lib/learning-platform/checkers/types";
import { SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID } from "./journal-entries";

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
    },
    {
      ...soldGoodsForCashExpectedLines[1],
      accountKey: "sales",
      requiredParticularsHint: "To Sales A/c",
      correctMessage: "Sales is correctly credited because sales revenue increases.",
      errorMessage: "Sales should be credited because goods are sold.",
    },
  ],
  acceptedNarrations: ["being goods sold for cash", "goods sold for cash", "being cash sales"],
  narrationConceptHints: ["goods sold", "cash sale"],
};

export function getJournalEntryPracticeAnswerKey(questionId: string): JournalEntryPracticeAnswerKey | null {
  if (questionId !== SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID) {
    return null;
  }

  return soldGoodsForCashAnswerKey;
}

export function getJournalEntryPracticeCorrectAnswerReveal(questionId: string): JournalEntryCorrectAnswerReveal {
  if (questionId !== SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID) {
    return {
      questionId,
      available: false,
      lines: [],
      narration: "",
      message: "Correct answer reveal is only available for the sold-goods-for-cash preview question.",
    };
  }

  return {
    questionId,
    available: true,
    lines: [
      {
        id: "cash-debit-reveal",
        particulars: "Cash A/c Dr.",
        debitAmount: "₹12,000",
      },
      {
        id: "sales-credit-reveal",
        particulars: "To Sales A/c",
        creditAmount: "₹12,000",
      },
    ],
    narration: soldGoodsForCashExpectedAnswer.narration,
    message: "Correct answer revealed after an explicit student action.",
  };
}
