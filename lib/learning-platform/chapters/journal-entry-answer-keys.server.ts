import type { AccountingEntryLine, JournalEntryExpectedAnswer } from "@/lib/learning-platform/types";
import type { JournalEntryCorrectAnswerReveal, JournalEntryPracticeAnswerKey } from "@/lib/learning-platform/checkers/types";
import {
  BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
  WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
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
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
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
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
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

const purchasedGoodsForCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "purchases-debit",
    account: "Purchases A/c",
    side: "debit",
    amount: 10000,
    drNotation: "Dr.",
  },
  {
    id: "cash-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 10000,
    displayPrefix: "To",
  },
];

export const purchasedGoodsForCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: purchasedGoodsForCashExpectedLines,
  narration: "Being goods purchased for cash.",
  totals: {
    debit: 10000,
    credit: 10000,
  },
  balanced: true,
};

export const purchasedGoodsForCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: purchasedGoodsForCashExpectedAnswer,
  expectedLines: [
    {
      ...purchasedGoodsForCashExpectedLines[0],
      accountKey: "purchases",
      requiredParticularsHint: "Purchases A/c Dr.",
      correctMessage: "Purchases is correctly debited because goods are bought for resale.",
      errorMessage: "Purchases should be debited because goods are bought for resale.",
      missingMarkerMessage: "Purchases A/c needs Dr. because Purchases is debited.",
      wrongMarkerMessage: "The Purchases debit line should not start with To.",
      wrongAmountMessage: "Purchases should be debited with ₹10,000.",
      wrongColumnMessage: "Purchases should not be placed in the credit column.",
    },
    {
      ...purchasedGoodsForCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because cash is paid.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹10,000.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being goods purchased for cash", "goods purchased for cash"],
  narrationConceptHints: ["goods", "purchase", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that goods were purchased for cash.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being goods purchased for cash.'",
    errorMessage: "Narration should explain that goods were purchased for cash.",
    hint: "Mention that goods were purchased for cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Purchases A/c Dr., then write To Cash A/c because goods were bought for cash.",
  extraLineHint: "This question needs only Purchases A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records goods purchased and cash credited for ₹10,000.",
  unexpectedAccountFeedback: {
    assets: {
      errorMessage: "Assets A/c is too generic and is not used for goods bought for resale.",
      hint: "Use Purchases A/c because the transaction says goods were bought for resale.",
    },
    asset: {
      errorMessage: "Asset A/c is too generic and is not used for goods bought for resale.",
      hint: "Use Purchases A/c because the transaction says goods were bought for resale.",
    },
    bank: {
      errorMessage: "Bank A/c is not used because the transaction states cash.",
      hint: "Use Cash A/c when the question says goods are bought for cash.",
    },
    creditor: {
      errorMessage: "Creditor A/c is not used because the transaction says cash, not credit.",
      hint: "Use Cash A/c for the credit line because payment is immediate.",
    },
    creditors: {
      errorMessage: "Creditors A/c is not used because the transaction says cash, not credit.",
      hint: "Use Cash A/c for the credit line because payment is immediate.",
    },
    furniture: {
      errorMessage: "Furniture A/c is for a fixed asset, but this question says goods.",
      hint: "Use Purchases A/c for goods bought for resale.",
    },
    goods: {
      errorMessage: "Goods A/c is not used here because goods bought for resale are recorded through Purchases A/c.",
      hint: "Use Purchases A/c for goods bought for resale.",
    },
    inventory: {
      errorMessage: "Inventory A/c is not used in this beginner checker.",
      hint: "Use Purchases A/c for goods bought for resale.",
    },
    machinery: {
      errorMessage: "Machinery A/c is for a fixed asset, but this question says goods.",
      hint: "Use Purchases A/c for goods bought for resale.",
    },
    mohan: {
      errorMessage: "Mohan A/c is not used because the transaction says cash, not credit.",
      hint: "Use Cash A/c for the credit line because payment is immediate.",
    },
    sales: {
      errorMessage: "Sales A/c is not used when goods are purchased.",
      hint: "Use Purchases A/c for goods bought, not Sales A/c.",
    },
    stock: {
      errorMessage: "Stock A/c is not used in this beginner checker.",
      hint: "Use Purchases A/c for goods bought for resale.",
    },
    supplier: {
      errorMessage: "Supplier A/c is not used because the transaction says cash, not credit.",
      hint: "Use Cash A/c for the credit line because payment is immediate.",
    },
  },
};

const startedBusinessWithCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "cash-capital-debit",
    account: "Cash A/c",
    side: "debit",
    amount: 50000,
    drNotation: "Dr.",
  },
  {
    id: "capital-credit",
    account: "Capital A/c",
    side: "credit",
    amount: 50000,
    displayPrefix: "To",
  },
];

export const startedBusinessWithCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: startedBusinessWithCashExpectedLines,
  narration: "Being business started with cash as capital.",
  totals: {
    debit: 50000,
    credit: 50000,
  },
  balanced: true,
};

export const startedBusinessWithCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: startedBusinessWithCashExpectedAnswer,
  expectedLines: [
    {
      ...startedBusinessWithCashExpectedLines[0],
      accountKey: "cash",
      requiredParticularsHint: "Cash A/c Dr.",
      correctMessage: "Cash is correctly debited because cash comes into the business.",
      errorMessage: "Cash should be debited because the owner brings cash into the business.",
      missingMarkerMessage: "Cash A/c needs Dr. because Cash is debited.",
      wrongMarkerMessage: "The Cash debit line should not start with To.",
      wrongAmountMessage: "Cash should be debited with ₹50,000.",
      wrongColumnMessage: "Cash should not be placed in the credit column.",
    },
    {
      ...startedBusinessWithCashExpectedLines[1],
      accountKey: "capital",
      requiredParticularsHint: "To Capital A/c",
      correctMessage: "Capital is correctly credited because the owner's claim increases.",
      errorMessage: "Capital should be credited because owner capital increases.",
      missingMarkerMessage: "Capital A/c needs To because Capital is credited.",
      wrongMarkerMessage: "Capital should be credited, not marked Dr.",
      wrongAmountMessage: "Capital should be credited with ₹50,000.",
      wrongColumnMessage: "Capital should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being business started with cash as capital",
    "business started with cash as capital",
    "being business started with cash capital",
    "being cash introduced as capital",
  ],
  narrationConceptHints: ["cash", "capital"],
  narrationFeedback: {
    correctMessage: "Narration communicates that business started with cash capital.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being business started with cash as capital.'",
    errorMessage: "Narration should explain that business started with cash as capital.",
    hint: "Mention that cash was introduced as capital.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Cash A/c Dr., then write To Capital A/c because capital is introduced in cash.",
  extraLineHint: "This question needs only Cash A/c Dr. and To Capital A/c.",
  correctSummary: "Correct. Your journal entry records cash introduced and capital credited for ₹50,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when capital is introduced in cash.",
    },
    income: {
      errorMessage: "Income A/c is not used because capital is not business income.",
      hint: "Use Capital A/c because the owner is starting the business with capital.",
    },
    loan: {
      errorMessage: "Loan A/c is not used because capital comes from the owner, not an outside lender.",
      hint: "Use Capital A/c for owner contribution.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because capital is not income from goods sold.",
      hint: "Use Capital A/c because the owner is introducing capital.",
    },
  },
};

const withdrewCashForPersonalUseExpectedLines: AccountingEntryLine[] = [
  {
    id: "drawings-debit",
    account: "Drawings A/c",
    side: "debit",
    amount: 5000,
    drNotation: "Dr.",
  },
  {
    id: "cash-drawings-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 5000,
    displayPrefix: "To",
  },
];

export const withdrewCashForPersonalUseExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: withdrewCashForPersonalUseExpectedLines,
  narration: "Being cash withdrawn for personal use.",
  totals: {
    debit: 5000,
    credit: 5000,
  },
  balanced: true,
};

export const withdrewCashForPersonalUseAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
  expectedAnswer: withdrewCashForPersonalUseExpectedAnswer,
  expectedLines: [
    {
      ...withdrewCashForPersonalUseExpectedLines[0],
      accountKey: "drawings",
      requiredParticularsHint: "Drawings A/c Dr.",
      correctMessage: "Drawings is correctly debited because the owner takes cash for personal use.",
      errorMessage: "Drawings should be debited because personal withdrawal increases drawings.",
      missingMarkerMessage: "Drawings A/c needs Dr. because Drawings is debited.",
      wrongMarkerMessage: "The Drawings debit line should not start with To.",
      wrongAmountMessage: "Drawings should be debited with ₹5,000.",
      wrongColumnMessage: "Drawings should not be placed in the credit column.",
    },
    {
      ...withdrewCashForPersonalUseExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because cash is withdrawn from the business.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹5,000.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being cash withdrawn for personal use",
    "cash withdrawn for personal use",
    "being cash withdrawn as drawings",
  ],
  narrationConceptHints: ["cash", "personal"],
  narrationFeedback: {
    correctMessage: "Narration communicates that cash was withdrawn for personal use.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being cash withdrawn for personal use.'",
    errorMessage: "Narration should explain that cash was withdrawn for personal use.",
    hint: "Mention that cash was withdrawn for personal use.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Drawings A/c Dr., then write To Cash A/c because cash leaves for personal use.",
  extraLineHint: "This question needs only Drawings A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records drawings debited and cash credited for ₹5,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when the owner withdraws cash.",
    },
    capital: {
      errorMessage: "Capital A/c is not used directly for this cash-withdrawal checker.",
      hint: "Use Drawings A/c for personal withdrawal.",
    },
    expense: {
      errorMessage: "Expense A/c is not used because personal withdrawal is not a business expense.",
      hint: "Use Drawings A/c because the cash is taken for personal use.",
    },
    rent: {
      errorMessage: "Rent A/c is a business expense and is not used for personal withdrawal.",
      hint: "Use Drawings A/c because the transaction says personal use.",
    },
    salary: {
      errorMessage: "Salary A/c is a business expense and is not used for personal withdrawal.",
      hint: "Use Drawings A/c because the transaction says personal use.",
    },
  },
};

const paidRentByCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "rent-debit",
    account: "Rent A/c",
    side: "debit",
    amount: 3000,
    drNotation: "Dr.",
  },
  {
    id: "cash-rent-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 3000,
    displayPrefix: "To",
  },
];

export const paidRentByCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidRentByCashExpectedLines,
  narration: "Being rent paid in cash.",
  totals: {
    debit: 3000,
    credit: 3000,
  },
  balanced: true,
};

export const paidRentByCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: paidRentByCashExpectedAnswer,
  expectedLines: [
    {
      ...paidRentByCashExpectedLines[0],
      accountKey: "rent",
      requiredParticularsHint: "Rent A/c Dr.",
      correctMessage: "Rent is correctly debited because rent is a business expense.",
      errorMessage: "Rent should be debited because rent expense increases.",
      missingMarkerMessage: "Rent A/c needs Dr. because Rent is debited.",
      wrongMarkerMessage: "The Rent debit line should not start with To.",
      wrongAmountMessage: "Rent should be debited with ₹3,000.",
      wrongColumnMessage: "Rent should not be placed in the credit column.",
    },
    {
      ...paidRentByCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because rent is paid in cash.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹3,000.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being rent paid in cash", "rent paid in cash", "being rent paid by cash"],
  narrationConceptHints: ["rent", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that rent was paid in cash.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being rent paid in cash.'",
    errorMessage: "Narration should explain that rent was paid in cash.",
    hint: "Mention that rent was paid in cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Rent A/c Dr., then write To Cash A/c because rent is paid in cash.",
  extraLineHint: "This question needs only Rent A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records rent expense debited and cash credited for ₹3,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when rent is paid by cash.",
    },
    drawings: {
      errorMessage: "Drawings A/c is not used because rent is a business expense.",
      hint: "Use Rent A/c because the transaction is rent paid, not personal withdrawal.",
    },
    salary: {
      errorMessage: "Salary A/c is a different expense and is not used here.",
      hint: "Use Rent A/c because the transaction says rent paid.",
    },
  },
};

const receivedCommissionInCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "cash-commission-debit",
    account: "Cash A/c",
    side: "debit",
    amount: 2000,
    drNotation: "Dr.",
  },
  {
    id: "commission-credit",
    account: "Commission A/c",
    side: "credit",
    amount: 2000,
    displayPrefix: "To",
  },
];

export const receivedCommissionInCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: receivedCommissionInCashExpectedLines,
  narration: "Being commission received in cash.",
  totals: {
    debit: 2000,
    credit: 2000,
  },
  balanced: true,
};

export const receivedCommissionInCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: receivedCommissionInCashExpectedAnswer,
  expectedLines: [
    {
      ...receivedCommissionInCashExpectedLines[0],
      accountKey: "cash",
      requiredParticularsHint: "Cash A/c Dr.",
      correctMessage: "Cash is correctly debited because cash is received.",
      errorMessage: "Cash should be debited because commission is received in cash.",
      missingMarkerMessage: "Cash A/c needs Dr. because Cash is debited.",
      wrongMarkerMessage: "The Cash debit line should not start with To.",
      wrongAmountMessage: "Cash should be debited with ₹2,000.",
      wrongColumnMessage: "Cash should not be placed in the credit column.",
    },
    {
      ...receivedCommissionInCashExpectedLines[1],
      accountKey: "commission",
      requiredParticularsHint: "To Commission A/c",
      correctMessage: "Commission is correctly credited because commission income increases.",
      errorMessage: "Commission should be credited because business income increases.",
      missingMarkerMessage: "Commission A/c needs To because Commission is credited.",
      wrongMarkerMessage: "Commission should be credited, not marked Dr.",
      wrongAmountMessage: "Commission should be credited with ₹2,000.",
      wrongColumnMessage: "Commission should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being commission received in cash",
    "commission received in cash",
    "being cash commission received",
  ],
  narrationConceptHints: ["commission", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that commission was received in cash.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being commission received in cash.'",
    errorMessage: "Narration should explain that commission was received in cash.",
    hint: "Mention that commission was received in cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Cash A/c Dr., then write To Commission A/c because commission income is received in cash.",
  extraLineHint: "This question needs only Cash A/c Dr. and To Commission A/c.",
  correctSummary: "Correct. Your journal entry records cash received and commission credited for ₹2,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when commission is received in cash.",
    },
    capital: {
      errorMessage: "Capital A/c is not used because commission received is business income, not owner capital.",
      hint: "Use Commission A/c for the income credit.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because the transaction says commission, not goods sold.",
      hint: "Use Commission A/c for commission income.",
    },
  },
};

const boughtFurnitureForCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "furniture-debit",
    account: "Furniture A/c",
    side: "debit",
    amount: 15000,
    drNotation: "Dr.",
  },
  {
    id: "cash-furniture-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 15000,
    displayPrefix: "To",
  },
];

export const boughtFurnitureForCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: boughtFurnitureForCashExpectedLines,
  narration: "Being furniture purchased for cash.",
  totals: {
    debit: 15000,
    credit: 15000,
  },
  balanced: true,
};

export const boughtFurnitureForCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: boughtFurnitureForCashExpectedAnswer,
  expectedLines: [
    {
      ...boughtFurnitureForCashExpectedLines[0],
      accountKey: "furniture",
      requiredParticularsHint: "Furniture A/c Dr.",
      correctMessage: "Furniture is correctly debited because a business asset increases.",
      errorMessage: "Furniture should be debited because furniture is a business asset.",
      missingMarkerMessage: "Furniture A/c needs Dr. because Furniture is debited.",
      wrongMarkerMessage: "The Furniture debit line should not start with To.",
      wrongAmountMessage: "Furniture should be debited with ₹15,000.",
      wrongColumnMessage: "Furniture should not be placed in the credit column.",
    },
    {
      ...boughtFurnitureForCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because furniture is bought for cash.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹15,000.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being furniture purchased for cash", "furniture purchased for cash", "being furniture bought for cash"],
  narrationConceptHints: ["furniture", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that furniture was purchased for cash.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being furniture purchased for cash.'",
    errorMessage: "Narration should explain that furniture was purchased for cash.",
    hint: "Mention that furniture was purchased for cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Furniture A/c Dr., then write To Cash A/c because furniture is bought for cash.",
  extraLineHint: "This question needs only Furniture A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records furniture debited and cash credited for ₹15,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when furniture is bought for cash.",
    },
    goods: {
      errorMessage: "Goods A/c is not used because furniture is a business asset here.",
      hint: "Use Furniture A/c because the transaction says furniture, not goods for resale.",
    },
    purchases: {
      errorMessage: "Purchases A/c is not used because furniture is an asset for business use.",
      hint: "Use Furniture A/c, not Purchases A/c, when furniture is bought for use in the business.",
    },
  },
};

const journalEntryPracticeAnswerKeys: Record<string, JournalEntryPracticeAnswerKey> = {
  [SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID]: soldGoodsForCashAnswerKey,
  [PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID]: paidSalaryByBankAnswerKey,
  [PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID]: purchasedGoodsForCashAnswerKey,
  [STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID]: startedBusinessWithCashAnswerKey,
  [WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID]: withdrewCashForPersonalUseAnswerKey,
  [PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID]: paidRentByCashAnswerKey,
  [RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID]: receivedCommissionInCashAnswerKey,
  [BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID]: boughtFurnitureForCashAnswerKey,
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
