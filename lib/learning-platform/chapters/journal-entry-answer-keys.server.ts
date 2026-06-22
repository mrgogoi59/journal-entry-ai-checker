import type { AccountingEntryLine, JournalEntryExpectedAnswer } from "@/lib/learning-platform/types";
import type { JournalEntryCorrectAnswerReveal, JournalEntryPracticeAnswerKey } from "@/lib/learning-platform/checkers/types";
import {
  BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
  BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
  BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
  PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
  PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
  PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
  SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
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

const paidElectricityBillInCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "electricity-debit",
    account: "Electricity A/c",
    side: "debit",
    amount: 1200,
    drNotation: "Dr.",
  },
  {
    id: "cash-electricity-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 1200,
    displayPrefix: "To",
  },
];

export const paidElectricityBillInCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidElectricityBillInCashExpectedLines,
  narration: "Being electricity bill paid in cash.",
  totals: {
    debit: 1200,
    credit: 1200,
  },
  balanced: true,
};

export const paidElectricityBillInCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: paidElectricityBillInCashExpectedAnswer,
  expectedLines: [
    {
      ...paidElectricityBillInCashExpectedLines[0],
      accountKey: "electricity",
      requiredParticularsHint: "Electricity A/c Dr.",
      correctMessage: "Electricity is correctly debited because the electricity bill is a business expense.",
      errorMessage: "Electricity should be debited because the electricity bill is an expense.",
      missingMarkerMessage: "Electricity A/c needs Dr. because Electricity is debited.",
      wrongMarkerMessage: "The Electricity debit line should not start with To.",
      wrongAmountMessage: "Electricity should be debited with ₹1,200.",
      wrongColumnMessage: "Electricity should not be placed in the credit column.",
    },
    {
      ...paidElectricityBillInCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because the electricity bill is paid in cash.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹1,200.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being electricity bill paid in cash",
    "electricity bill paid in cash",
    "being electricity paid in cash",
  ],
  narrationConceptHints: ["electricity", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that the electricity bill was paid in cash.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being electricity bill paid in cash.'",
    errorMessage: "Narration should explain that the electricity bill was paid in cash.",
    hint: "Mention that the electricity bill was paid in cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Electricity A/c Dr., then write To Cash A/c because the bill is paid in cash.",
  extraLineHint: "This question needs only Electricity A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records electricity expense debited and cash credited for ₹1,200.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when the electricity bill is paid in cash.",
    },
    capital: {
      errorMessage: "Capital A/c is not used because an electricity bill is not capital introduced.",
      hint: "Use Electricity A/c for the expense debit.",
    },
    drawings: {
      errorMessage: "Drawings A/c is not used because this is a business electricity bill.",
      hint: "Use Electricity A/c because the transaction is an electricity expense.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because an electricity bill is an expense, not income.",
      hint: "Use Electricity A/c for the expense debit.",
    },
  },
};

const paidWagesInCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "wages-debit",
    account: "Wages A/c",
    side: "debit",
    amount: 2500,
    drNotation: "Dr.",
  },
  {
    id: "cash-wages-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 2500,
    displayPrefix: "To",
  },
];

export const paidWagesInCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidWagesInCashExpectedLines,
  narration: "Being wages paid in cash.",
  totals: {
    debit: 2500,
    credit: 2500,
  },
  balanced: true,
};

export const paidWagesInCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: paidWagesInCashExpectedAnswer,
  expectedLines: [
    {
      ...paidWagesInCashExpectedLines[0],
      accountKey: "wages",
      requiredParticularsHint: "Wages A/c Dr.",
      correctMessage: "Wages is correctly debited because wages are a business expense.",
      errorMessage: "Wages should be debited because wages expense increases.",
      missingMarkerMessage: "Wages A/c needs Dr. because Wages is debited.",
      wrongMarkerMessage: "The Wages debit line should not start with To.",
      wrongAmountMessage: "Wages should be debited with ₹2,500.",
      wrongColumnMessage: "Wages should not be placed in the credit column.",
    },
    {
      ...paidWagesInCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because wages are paid in cash.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹2,500.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being wages paid in cash", "wages paid in cash", "being wages paid by cash"],
  narrationConceptHints: ["wages", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that wages were paid in cash.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being wages paid in cash.'",
    errorMessage: "Narration should explain that wages were paid in cash.",
    hint: "Mention that wages were paid in cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Wages A/c Dr., then write To Cash A/c because wages are paid in cash.",
  extraLineHint: "This question needs only Wages A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records wages debited and cash credited for ₹2,500.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when wages are paid in cash.",
    },
    rent: {
      errorMessage: "Rent A/c is a different expense and is not used here.",
      hint: "Use Wages A/c because the transaction says wages paid.",
    },
    salary: {
      errorMessage: "Salary A/c is a different expense and is not used here.",
      hint: "Use Wages A/c because the transaction says wages paid.",
    },
  },
};

const soldGoodsByBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "bank-sales-debit",
    account: "Bank A/c",
    side: "debit",
    amount: 6000,
    drNotation: "Dr.",
  },
  {
    id: "sales-bank-credit",
    account: "Sales A/c",
    side: "credit",
    amount: 6000,
    displayPrefix: "To",
  },
];

export const soldGoodsByBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: soldGoodsByBankExpectedLines,
  narration: "Being goods sold through bank.",
  totals: {
    debit: 6000,
    credit: 6000,
  },
  balanced: true,
};

export const soldGoodsByBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: soldGoodsByBankExpectedAnswer,
  expectedLines: [
    {
      ...soldGoodsByBankExpectedLines[0],
      accountKey: "bank",
      requiredParticularsHint: "Bank A/c Dr.",
      correctMessage: "Bank is correctly debited because money is received through bank.",
      errorMessage: "Bank should be debited because sale proceeds are received through bank.",
      missingMarkerMessage: "Bank A/c needs Dr. because Bank is debited.",
      wrongMarkerMessage: "The Bank debit line should not start with To.",
      wrongAmountMessage: "Bank should be debited with ₹6,000.",
      wrongColumnMessage: "Bank should not be placed in the credit column.",
    },
    {
      ...soldGoodsByBankExpectedLines[1],
      accountKey: "sales",
      requiredParticularsHint: "To Sales A/c",
      correctMessage: "Sales is correctly credited because goods are sold.",
      errorMessage: "Sales should be credited because goods are sold.",
      missingMarkerMessage: "Sales A/c needs To because Sales is credited.",
      wrongMarkerMessage: "Sales should be credited, not marked Dr.",
      wrongAmountMessage: "Sales should be credited with ₹6,000.",
      wrongColumnMessage: "Sales should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being goods sold through bank",
    "goods sold through bank",
    "being goods sold by bank",
    "goods sold by bank",
  ],
  narrationConceptHints: ["goods", "bank"],
  narrationFeedback: {
    correctMessage: "Narration communicates that goods were sold through bank.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being goods sold through bank.'",
    errorMessage: "Narration should explain that goods were sold through bank.",
    hint: "Mention that goods were sold through bank.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Bank A/c Dr., then write To Sales A/c because goods were sold through bank.",
  extraLineHint: "This question needs only Bank A/c Dr. and To Sales A/c.",
  correctSummary: "Correct. Your journal entry records bank debited and sales credited for ₹6,000.",
  unexpectedAccountFeedback: {
    cash: {
      errorMessage: "Cash A/c is not used because the transaction says bank.",
      hint: "Use Bank A/c when goods are sold through bank.",
    },
    commission: {
      errorMessage: "Commission A/c is not used because the transaction says goods are sold.",
      hint: "Use Sales A/c for goods sold.",
    },
    customer: {
      errorMessage: "Customer A/c is not used because the transaction says bank, not credit sale.",
      hint: "Use Bank A/c because payment is received through bank.",
    },
    purchases: {
      errorMessage: "Purchases A/c is not used when goods are sold.",
      hint: "Use Sales A/c for goods sold, not Purchases A/c.",
    },
  },
};

const boughtStationeryForCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "stationery-debit",
    account: "Stationery A/c",
    side: "debit",
    amount: 800,
    drNotation: "Dr.",
  },
  {
    id: "cash-stationery-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 800,
    displayPrefix: "To",
  },
];

export const boughtStationeryForCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: boughtStationeryForCashExpectedLines,
  narration: "Being stationery purchased for cash.",
  totals: {
    debit: 800,
    credit: 800,
  },
  balanced: true,
};

export const boughtStationeryForCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: boughtStationeryForCashExpectedAnswer,
  expectedLines: [
    {
      ...boughtStationeryForCashExpectedLines[0],
      accountKey: "stationery",
      requiredParticularsHint: "Stationery A/c Dr.",
      correctMessage: "Stationery is correctly debited because stationery is bought for business use.",
      errorMessage: "Stationery should be debited because stationery expense increases.",
      missingMarkerMessage: "Stationery A/c needs Dr. because Stationery is debited.",
      wrongMarkerMessage: "The Stationery debit line should not start with To.",
      wrongAmountMessage: "Stationery should be debited with ₹800.",
      wrongColumnMessage: "Stationery should not be placed in the credit column.",
    },
    {
      ...boughtStationeryForCashExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the business.",
      errorMessage: "Cash should be credited because stationery is bought for cash.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹800.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being stationery purchased for cash",
    "stationery purchased for cash",
    "being stationery bought for cash",
  ],
  narrationConceptHints: ["stationery", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that stationery was purchased for cash.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being stationery purchased for cash.'",
    errorMessage: "Narration should explain that stationery was purchased for cash.",
    hint: "Mention that stationery was purchased for cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Stationery A/c Dr., then write To Cash A/c because stationery is bought for cash.",
  extraLineHint: "This question needs only Stationery A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records stationery debited and cash credited for ₹800.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when stationery is bought for cash.",
    },
    furniture: {
      errorMessage: "Furniture A/c is not used because this checker treats stationery as a simple business item.",
      hint: "Use Stationery A/c for this stationery purchase.",
    },
    goods: {
      errorMessage: "Goods A/c is not used because the transaction specifically says stationery.",
      hint: "Use Stationery A/c, not Goods A/c.",
    },
    purchases: {
      errorMessage: "Purchases A/c is not used because the transaction specifically says stationery.",
      hint: "Use Stationery A/c for this simple checker.",
    },
  },
};

const receivedFeesInCashExpectedLines: AccountingEntryLine[] = [
  {
    id: "cash-fees-debit",
    account: "Cash A/c",
    side: "debit",
    amount: 4000,
    drNotation: "Dr.",
  },
  {
    id: "fees-received-credit",
    account: "Fees Received A/c",
    side: "credit",
    amount: 4000,
    displayPrefix: "To",
  },
];

export const receivedFeesInCashExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: receivedFeesInCashExpectedLines,
  narration: "Being fees received in cash.",
  totals: {
    debit: 4000,
    credit: 4000,
  },
  balanced: true,
};

export const receivedFeesInCashAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
  expectedAnswer: receivedFeesInCashExpectedAnswer,
  expectedLines: [
    {
      ...receivedFeesInCashExpectedLines[0],
      accountKey: "cash",
      requiredParticularsHint: "Cash A/c Dr.",
      correctMessage: "Cash is correctly debited because cash is received.",
      errorMessage: "Cash should be debited because fees are received in cash.",
      missingMarkerMessage: "Cash A/c needs Dr. because Cash is debited.",
      wrongMarkerMessage: "The Cash debit line should not start with To.",
      wrongAmountMessage: "Cash should be debited with ₹4,000.",
      wrongColumnMessage: "Cash should not be placed in the credit column.",
    },
    {
      ...receivedFeesInCashExpectedLines[1],
      accountKey: "fees received",
      requiredParticularsHint: "To Fees Received A/c",
      correctMessage: "Fees Received is correctly credited because income increases.",
      errorMessage: "Fees Received should be credited because business income increases.",
      missingMarkerMessage: "Fees Received A/c needs To because Fees Received is credited.",
      wrongMarkerMessage: "Fees Received should be credited, not marked Dr.",
      wrongAmountMessage: "Fees Received should be credited with ₹4,000.",
      wrongColumnMessage: "Fees Received should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: ["being fees received in cash", "fees received in cash", "being cash fees received"],
  narrationConceptHints: ["fees", "cash"],
  narrationFeedback: {
    correctMessage: "Narration communicates that fees were received in cash.",
    warningMessage: "Narration has the right idea, but use a clearer wording such as 'Being fees received in cash.'",
    errorMessage: "Narration should explain that fees were received in cash.",
    hint: "Mention that fees were received in cash.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Cash A/c Dr., then write To Fees Received A/c because fees income is received in cash.",
  extraLineHint: "This question needs only Cash A/c Dr. and To Fees Received A/c.",
  correctSummary: "Correct. Your journal entry records cash received and fees credited for ₹4,000.",
  unexpectedAccountFeedback: {
    bank: {
      errorMessage: "Bank A/c is not used because the transaction says cash.",
      hint: "Use Cash A/c when fees are received in cash.",
    },
    capital: {
      errorMessage: "Capital A/c is not used because fees received are business income, not owner capital.",
      hint: "Use Fees Received A/c for the income credit.",
    },
    loan: {
      errorMessage: "Loan A/c is not used because fees received are income, not borrowed money.",
      hint: "Use Fees Received A/c for the income credit.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because the transaction says fees received, not goods sold.",
      hint: "Use Fees Received A/c for this income credit.",
    },
  },
};

const paidOfficeRentByBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "office-rent-debit",
    account: "Office Rent A/c",
    side: "debit",
    amount: 4000,
    drNotation: "Dr.",
  },
  {
    id: "bank-office-rent-credit",
    account: "Bank A/c",
    side: "credit",
    amount: 4000,
    displayPrefix: "To",
  },
];

export const paidOfficeRentByBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidOfficeRentByBankExpectedLines,
  narration: "Being office rent paid by bank.",
  totals: {
    debit: 4000,
    credit: 4000,
  },
  balanced: true,
};

export const paidOfficeRentByBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: paidOfficeRentByBankExpectedAnswer,
  expectedLines: [
    {
      ...paidOfficeRentByBankExpectedLines[0],
      accountKey: "office rent",
      requiredParticularsHint: "Office Rent A/c Dr.",
      correctMessage: "Office Rent is correctly debited because office rent is a business expense.",
      errorMessage: "Office Rent should be debited because office rent expense increases.",
      missingMarkerMessage: "Office Rent A/c needs Dr. because Office Rent is debited.",
      wrongMarkerMessage: "The Office Rent debit line should not start with To.",
      wrongAmountMessage: "Office Rent should be debited with ₹4,000.",
      wrongColumnMessage: "Office Rent should not be placed in the credit column.",
    },
    {
      ...paidOfficeRentByBankExpectedLines[1],
      accountKey: "bank",
      requiredParticularsHint: "To Bank A/c",
      correctMessage: "Bank is correctly credited because money is paid through bank.",
      errorMessage: "Bank should be credited because office rent is paid by bank.",
      missingMarkerMessage: "Bank A/c needs To because Bank is credited.",
      wrongMarkerMessage: "Bank should be credited, not marked Dr.",
      wrongAmountMessage: "Bank should be credited with ₹4,000.",
      wrongColumnMessage: "Bank should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being office rent paid by bank",
    "office rent paid by bank",
    "being office rent paid through bank",
    "office rent paid through bank",
  ],
  narrationConceptHints: ["office rent", "bank"],
  narrationFeedback: {
    correctMessage: "Narration communicates that office rent was paid by bank.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being office rent paid by bank.'",
    errorMessage: "Narration should explain that office rent was paid by bank.",
    hint: "Mention that office rent was paid by bank.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Office Rent A/c Dr., then write To Bank A/c because office rent is paid by bank.",
  extraLineHint: "This question needs only Office Rent A/c Dr. and To Bank A/c.",
  correctSummary: "Correct. Your journal entry records office rent debited and bank credited for ₹4,000.",
  unexpectedAccountFeedback: {
    cash: {
      errorMessage: "Cash A/c is not used because the transaction says bank.",
      hint: "Use Bank A/c when office rent is paid by bank.",
    },
    "prepaid rent": {
      errorMessage: "Prepaid Rent A/c is not used because this checker is only a simple paid rent entry.",
      hint: "Use Office Rent A/c for this simple rent expense.",
    },
    rent: {
      errorMessage: "Rent A/c is too broad for this checker because the transaction says office rent.",
      hint: "Use Office Rent A/c to match the exact account in the prompt.",
    },
    "rent outstanding": {
      errorMessage: "Rent Outstanding A/c is not used because the rent is paid now by bank.",
      hint: "Use Bank A/c for the payment and Office Rent A/c for the expense.",
    },
  },
};

const depositedCashIntoBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "bank-deposit-debit",
    account: "Bank A/c",
    side: "debit",
    amount: 5000,
    drNotation: "Dr.",
  },
  {
    id: "cash-deposit-credit",
    account: "Cash A/c",
    side: "credit",
    amount: 5000,
    displayPrefix: "To",
  },
];

export const depositedCashIntoBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: depositedCashIntoBankExpectedLines,
  narration: "Being cash deposited into bank.",
  totals: {
    debit: 5000,
    credit: 5000,
  },
  balanced: true,
};

export const depositedCashIntoBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: depositedCashIntoBankExpectedAnswer,
  expectedLines: [
    {
      ...depositedCashIntoBankExpectedLines[0],
      accountKey: "bank",
      requiredParticularsHint: "Bank A/c Dr.",
      correctMessage: "Bank is correctly debited because cash is deposited into bank.",
      errorMessage: "Bank should be debited because bank balance increases.",
      missingMarkerMessage: "Bank A/c needs Dr. because Bank is debited.",
      wrongMarkerMessage: "The Bank debit line should not start with To.",
      wrongAmountMessage: "Bank should be debited with ₹5,000.",
      wrongColumnMessage: "Bank should not be placed in the credit column.",
    },
    {
      ...depositedCashIntoBankExpectedLines[1],
      accountKey: "cash",
      requiredParticularsHint: "To Cash A/c",
      correctMessage: "Cash is correctly credited because cash leaves the cash balance.",
      errorMessage: "Cash should be credited because cash is deposited into bank.",
      missingMarkerMessage: "Cash A/c needs To because Cash is credited.",
      wrongMarkerMessage: "Cash should be credited, not marked Dr.",
      wrongAmountMessage: "Cash should be credited with ₹5,000.",
      wrongColumnMessage: "Cash should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being cash deposited into bank",
    "cash deposited into bank",
    "being cash deposited in bank",
    "cash deposited in bank",
  ],
  narrationConceptHints: ["cash", "bank", "deposit"],
  narrationFeedback: {
    correctMessage: "Narration communicates that cash was deposited into bank.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being cash deposited into bank.'",
    errorMessage: "Narration should explain that cash was deposited into bank.",
    hint: "Mention that cash was deposited into bank.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Bank A/c Dr., then write To Cash A/c because cash is deposited into bank.",
  extraLineHint: "This question needs only Bank A/c Dr. and To Cash A/c.",
  correctSummary: "Correct. Your journal entry records bank debited and cash credited for ₹5,000.",
  unexpectedAccountFeedback: {
    capital: {
      errorMessage: "Capital A/c is not used because depositing cash into bank is not capital introduced.",
      hint: "Use Bank A/c and Cash A/c for this internal asset transfer.",
    },
    income: {
      errorMessage: "Income A/c is not used because a cash deposit into bank is not income.",
      hint: "Use Bank A/c and Cash A/c because money moves between two business asset accounts.",
    },
    loan: {
      errorMessage: "Loan A/c is not used because the transaction is a cash deposit, not borrowed money.",
      hint: "Use Bank A/c and Cash A/c for this deposit.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because cash deposited into bank is not a sale.",
      hint: "Use Cash A/c as the credit account, not Sales A/c.",
    },
  },
};

const paidAdvertisingByBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "advertising-debit",
    account: "Advertising A/c",
    side: "debit",
    amount: 3500,
    drNotation: "Dr.",
  },
  {
    id: "bank-advertising-credit",
    account: "Bank A/c",
    side: "credit",
    amount: 3500,
    displayPrefix: "To",
  },
];

export const paidAdvertisingByBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: paidAdvertisingByBankExpectedLines,
  narration: "Being advertising paid by bank.",
  totals: {
    debit: 3500,
    credit: 3500,
  },
  balanced: true,
};

export const paidAdvertisingByBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: paidAdvertisingByBankExpectedAnswer,
  expectedLines: [
    {
      ...paidAdvertisingByBankExpectedLines[0],
      accountKey: "advertising",
      requiredParticularsHint: "Advertising A/c Dr.",
      correctMessage: "Advertising is correctly debited because advertising is a business expense.",
      errorMessage: "Advertising should be debited because advertising expense increases.",
      missingMarkerMessage: "Advertising A/c needs Dr. because Advertising is debited.",
      wrongMarkerMessage: "The Advertising debit line should not start with To.",
      wrongAmountMessage: "Advertising should be debited with ₹3,500.",
      wrongColumnMessage: "Advertising should not be placed in the credit column.",
    },
    {
      ...paidAdvertisingByBankExpectedLines[1],
      accountKey: "bank",
      requiredParticularsHint: "To Bank A/c",
      correctMessage: "Bank is correctly credited because advertising is paid by bank.",
      errorMessage: "Bank should be credited because money leaves the bank account.",
      missingMarkerMessage: "Bank A/c needs To because Bank is credited.",
      wrongMarkerMessage: "Bank should be credited, not marked Dr.",
      wrongAmountMessage: "Bank should be credited with ₹3,500.",
      wrongColumnMessage: "Bank should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being advertising paid by bank",
    "advertising paid by bank",
    "being advertising paid through bank",
    "advertising paid through bank",
  ],
  narrationConceptHints: ["advertising", "bank"],
  narrationFeedback: {
    correctMessage: "Narration communicates that advertising was paid by bank.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being advertising paid by bank.'",
    errorMessage: "Narration should explain that advertising was paid by bank.",
    hint: "Mention that advertising was paid by bank.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Advertising A/c Dr., then write To Bank A/c because advertising is paid by bank.",
  extraLineHint: "This question needs only Advertising A/c Dr. and To Bank A/c.",
  correctSummary: "Correct. Your journal entry records advertising debited and bank credited for ₹3,500.",
  unexpectedAccountFeedback: {
    capital: {
      errorMessage: "Capital A/c is not used because advertising paid by bank is not owner capital.",
      hint: "Use Advertising A/c for the expense and Bank A/c for the payment.",
    },
    cash: {
      errorMessage: "Cash A/c is not used because the transaction says bank.",
      hint: "Use Bank A/c when advertising is paid by bank.",
    },
    drawings: {
      errorMessage: "Drawings A/c is not used because advertising is a business expense, not personal use.",
      hint: "Use Advertising A/c for this business expense.",
    },
    "prepaid advertising": {
      errorMessage: "Prepaid Advertising A/c is not used because this checker is only a simple paid advertising entry.",
      hint: "Use Advertising A/c for this simple expense.",
    },
    sales: {
      errorMessage: "Sales A/c is not used because advertising paid is an expense, not goods sold.",
      hint: "Use Advertising A/c, not Sales A/c.",
    },
  },
};

const boughtMachineryByBankExpectedLines: AccountingEntryLine[] = [
  {
    id: "machinery-debit",
    account: "Machinery A/c",
    side: "debit",
    amount: 20000,
    drNotation: "Dr.",
  },
  {
    id: "bank-machinery-credit",
    account: "Bank A/c",
    side: "credit",
    amount: 20000,
    displayPrefix: "To",
  },
];

export const boughtMachineryByBankExpectedAnswer: JournalEntryExpectedAnswer = {
  responseType: "journal-entry",
  lines: boughtMachineryByBankExpectedLines,
  narration: "Being machinery purchased by bank.",
  totals: {
    debit: 20000,
    credit: 20000,
  },
  balanced: true,
};

export const boughtMachineryByBankAnswerKey: JournalEntryPracticeAnswerKey = {
  questionId: BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
  expectedAnswer: boughtMachineryByBankExpectedAnswer,
  expectedLines: [
    {
      ...boughtMachineryByBankExpectedLines[0],
      accountKey: "machinery",
      requiredParticularsHint: "Machinery A/c Dr.",
      correctMessage: "Machinery is correctly debited because machinery is a business asset.",
      errorMessage: "Machinery should be debited because the machinery asset increases.",
      missingMarkerMessage: "Machinery A/c needs Dr. because Machinery is debited.",
      wrongMarkerMessage: "The Machinery debit line should not start with To.",
      wrongAmountMessage: "Machinery should be debited with ₹20,000.",
      wrongColumnMessage: "Machinery should not be placed in the credit column.",
    },
    {
      ...boughtMachineryByBankExpectedLines[1],
      accountKey: "bank",
      requiredParticularsHint: "To Bank A/c",
      correctMessage: "Bank is correctly credited because machinery is bought by bank.",
      errorMessage: "Bank should be credited because money leaves the bank account.",
      missingMarkerMessage: "Bank A/c needs To because Bank is credited.",
      wrongMarkerMessage: "Bank should be credited, not marked Dr.",
      wrongAmountMessage: "Bank should be credited with ₹20,000.",
      wrongColumnMessage: "Bank should not be placed in the debit column.",
    },
  ],
  acceptedNarrations: [
    "being machinery purchased by bank",
    "machinery purchased by bank",
    "being machinery bought by bank",
    "machinery bought by bank",
  ],
  narrationConceptHints: ["machinery", "bank"],
  narrationFeedback: {
    correctMessage: "Narration communicates that machinery was purchased by bank.",
    warningMessage:
      "Narration has the right idea, but use a clearer wording such as 'Being machinery purchased by bank.'",
    errorMessage: "Narration should explain that machinery was purchased by bank.",
    hint: "Mention that machinery was purchased by bank.",
  },
  unsupportedHint: "Return to one of the supported Journal Entries Practice It Yourself questions.",
  blankAttemptHint: "Start with Machinery A/c Dr., then write To Bank A/c because machinery is bought by bank.",
  extraLineHint: "This question needs only Machinery A/c Dr. and To Bank A/c.",
  correctSummary: "Correct. Your journal entry records machinery debited and bank credited for ₹20,000.",
  unexpectedAccountFeedback: {
    cash: {
      errorMessage: "Cash A/c is not used because the transaction says bank.",
      hint: "Use Bank A/c when machinery is bought by bank.",
    },
    depreciation: {
      errorMessage: "Depreciation A/c is not used because this checker only records buying machinery by bank.",
      hint: "Use Machinery A/c for the asset purchase.",
    },
    goods: {
      errorMessage: "Goods A/c is not used because the transaction specifically says machinery.",
      hint: "Use Machinery A/c for this asset purchase.",
    },
    loan: {
      errorMessage: "Loan A/c is not used because the machinery is bought by bank, not through a loan entry.",
      hint: "Use Bank A/c for the credit side.",
    },
    purchases: {
      errorMessage: "Purchases A/c is not used because machinery is a business asset, not goods for resale.",
      hint: "Use Machinery A/c, not Purchases A/c.",
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
  [PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID]: paidElectricityBillInCashAnswerKey,
  [PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID]: paidWagesInCashAnswerKey,
  [SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID]: soldGoodsByBankAnswerKey,
  [BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID]: boughtStationeryForCashAnswerKey,
  [RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID]: receivedFeesInCashAnswerKey,
  [PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID]: paidOfficeRentByBankAnswerKey,
  [DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID]: depositedCashIntoBankAnswerKey,
  [PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID]: paidAdvertisingByBankAnswerKey,
  [BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID]: boughtMachineryByBankAnswerKey,
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
