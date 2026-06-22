import type {
  ChapterDefinition,
  ChapterSection,
  ChapterSubtopicDefinition,
  ChapterSubtopicReference,
  PracticeItYourselfPreviewQuestion,
  PracticeItYourselfQuestion,
} from "@/lib/learning-platform/types";

export const SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID = "journal-entry-sold-goods-for-cash-practice-preview";
export const PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID = "journal-entry-paid-salary-by-bank-practice-preview";
export const PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID = "journal-entry-purchased-goods-for-cash-practice-preview";
export const STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID = "journal-entry-started-business-with-cash-practice-preview";
export const WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID =
  "journal-entry-withdrew-cash-for-personal-use-practice-preview";
export const PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID = "journal-entry-paid-rent-by-cash-practice-preview";
export const RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID =
  "journal-entry-received-commission-in-cash-practice-preview";
export const BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID =
  "journal-entry-bought-furniture-for-cash-practice-preview";
export const PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID =
  "journal-entry-paid-electricity-bill-in-cash-practice-preview";
export const PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID = "journal-entry-paid-wages-in-cash-practice-preview";
export const SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID = "journal-entry-sold-goods-by-bank-practice-preview";
export const BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID =
  "journal-entry-bought-stationery-for-cash-practice-preview";
export const RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID =
  "journal-entry-received-fees-in-cash-practice-preview";
export const PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID =
  "journal-entry-paid-office-rent-by-bank-practice-preview";
export const DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID =
  "journal-entry-deposited-cash-into-bank-practice-preview";
export const PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID =
  "journal-entry-paid-advertising-by-bank-practice-preview";
export const BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID =
  "journal-entry-bought-machinery-by-bank-practice-preview";
export const JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG = "introduction-to-journal-entries";
export const JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG = "business-transactions";
export const JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG = "accounts-affected";
export const JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG = "types-of-accounts";
export const JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG = "debit-and-credit-rules";
export const JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG = "journal-format-and-narration";
export const JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG = "cash-and-bank-transactions";
export const JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG = "capital";
export const JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG = "drawings";
export const JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG = "purchases";
export const JOURNAL_ENTRIES_SALES_SECTION_SLUG = "sales";
export const JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG = "expenses";
export const JOURNAL_ENTRIES_INCOME_SECTION_SLUG = "income";
export const JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG = "assets-and-liabilities";
export const JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG = "mixed-simple-entries";
export const JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG = "chapter-recap-and-practice";

const JOURNAL_ENTRIES_CHAPTER_PATH = "/platform-preview/chapters/journal-entries";

const defaultJournalEntryInputSchema: PracticeItYourselfQuestion["answerInputSchema"] = {
  responseType: "journal-entry",
  rows: [
    {
      rowOrder: 1,
      requiredFields: ["date", "particulars", "side", "drNotation", "lf", "debitAmount", "creditAmount"],
      particularsPlaceholder: "Particulars line 1",
    },
    {
      rowOrder: 2,
      requiredFields: ["date", "particulars", "side", "toTreatment", "lf", "debitAmount", "creditAmount"],
      particularsPlaceholder: "Particulars line 2",
    },
    {
      rowOrder: 3,
      requiredFields: ["date", "particulars", "side", "lf", "debitAmount", "creditAmount"],
      particularsPlaceholder: "Optional line",
    },
  ],
  narration: {
    required: true,
    placeholder: "Write the narration in your own words",
  },
  totals: {
    debitTotal: "future-calculated",
    creditTotal: "future-calculated",
  },
  optionalExtraRows: true,
  removableRows: true,
  attemptStatus: "draft",
};

const defaultInputFieldRequirements: PracticeItYourselfQuestion["inputFieldRequirements"] = [
  "date",
  "particulars",
  "side",
  "drNotation",
  "toTreatment",
  "lf",
  "debitAmount",
  "creditAmount",
  "narration",
];

function createJournalEntryPracticeQuestion({
  id,
  title,
  question,
  learningObjective,
}: {
  id: string;
  title: string;
  question: string;
  learningObjective: string;
}): PracticeItYourselfQuestion {
  return {
    id,
    title,
    question,
    difficulty: "easy",
    learningObjective,
    requiredAnswerFormat: "journal-entry",
    initialBlankRows: 3,
    narrationRequired: true,
    mayAddRows: true,
    mayRemoveRows: true,
    inputFieldRequirements: defaultInputFieldRequirements,
    answerInputSchema: defaultJournalEntryInputSchema,
    status: "checking-ready",
  };
}

export const soldGoodsForCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 1: cash sale of goods",
  question: "Sold goods for cash ₹12,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for a simple cash sale without prefilled accounts or amounts.",
});

export const paidSalaryByBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 2: paid salary by bank",
  question: "Paid salary by bank ₹8,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for a salary expense paid through bank.",
});

export const purchasedGoodsForCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PURCHASED_GOODS_FOR_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 3: cash purchase of goods",
  question: "Bought goods for cash Rs 10,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for goods bought for cash without confusing Purchases with assets or Bank.",
});

export const startedBusinessWithCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: STARTED_BUSINESS_WITH_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 4: capital introduced in cash",
  question: "Started business with cash Rs 50,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for cash introduced as capital without treating capital as income.",
});

export const withdrewCashForPersonalUsePracticeQuestion = createJournalEntryPracticeQuestion({
  id: WITHDREW_CASH_FOR_PERSONAL_USE_PRACTICE_QUESTION_ID,
  title: "Practice 5: cash drawings for personal use",
  question: "Withdrew cash for personal use Rs 5,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for cash drawings without treating personal withdrawal as a business expense.",
});

export const paidRentByCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_RENT_BY_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 6: rent paid by cash",
  question: "Paid rent by cash Rs 3,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for rent paid in cash without confusing Rent with Drawings, Salary, or Bank.",
});

export const receivedCommissionInCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: RECEIVED_COMMISSION_IN_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 7: commission received in cash",
  question: "Received commission in cash Rs 2,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for commission received in cash without confusing income with Capital or Sales.",
});

export const boughtFurnitureForCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: BOUGHT_FURNITURE_FOR_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 8: furniture bought for cash",
  question: "Bought furniture for cash Rs 15,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for furniture bought for cash without confusing a business asset with Purchases or goods.",
});

export const paidElectricityBillInCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_ELECTRICITY_BILL_IN_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 9: electricity bill paid in cash",
  question: "Paid electricity bill in cash Rs 1,200. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for an electricity bill paid in cash without adding adjustment treatment.",
});

export const paidWagesInCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_WAGES_IN_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 10: wages paid in cash",
  question: "Paid wages in cash Rs 2,500. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for wages paid in cash without confusing Wages with Salary, Rent, or Bank.",
});

export const soldGoodsByBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: SOLD_GOODS_BY_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 11: goods sold by bank",
  question: "Sold goods by bank Rs 6,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for goods sold through bank without confusing Bank with Cash or credit sales.",
});

export const boughtStationeryForCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: BOUGHT_STATIONERY_FOR_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 12: stationery bought for cash",
  question: "Bought stationery for cash Rs 800. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for stationery bought for cash without treating it as goods or a fixed asset.",
});

export const receivedFeesInCashPracticeQuestion = createJournalEntryPracticeQuestion({
  id: RECEIVED_FEES_IN_CASH_PRACTICE_QUESTION_ID,
  title: "Practice 13: fees received in cash",
  question: "Received fees in cash Rs 4,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for fees received in cash without treating the receipt as capital, loan, or sales.",
});

export const paidOfficeRentByBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_OFFICE_RENT_BY_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 14: office rent paid by bank",
  question: "Paid office rent by bank Rs 4,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for office rent paid by bank with correct Dr./To, amount, and narration.",
});

export const depositedCashIntoBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: DEPOSITED_CASH_INTO_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 15: cash deposited into bank",
  question: "Deposited cash into bank Rs 5,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for cash deposited into bank without treating the transfer as income.",
});

export const paidAdvertisingByBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: PAID_ADVERTISING_BY_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 16: advertising paid by bank",
  question: "Paid advertising by bank Rs 3,500. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for advertising paid by bank without adding adjustment treatment.",
});

export const boughtMachineryByBankPracticeQuestion = createJournalEntryPracticeQuestion({
  id: BOUGHT_MACHINERY_BY_BANK_PRACTICE_QUESTION_ID,
  title: "Practice 17: machinery bought by bank",
  question: "Bought machinery by bank Rs 20,000. Pass the journal entry.",
  learningObjective: "Write a complete journal entry for machinery bought by bank without treating it as Purchases or adding depreciation.",
});

export function toPracticeItYourselfPreviewQuestion(
  question: PracticeItYourselfQuestion,
): PracticeItYourselfPreviewQuestion {
  return question;
}

const introductionSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  title: "Introduction to Journal Entries and Journal Format",
  order: 1,
  availabilityStatus: "available",
  href: JOURNAL_ENTRIES_CHAPTER_PATH,
};

const businessTransactionsSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
  title: "Business Transactions",
  order: 2,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG}`,
};

const accountsAffectedSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
  title: "Accounts Affected",
  order: 3,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG}`,
};

const typesOfAccountsSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
  title: "Types of Accounts",
  order: 4,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG}`,
};

const debitAndCreditRulesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
  title: "Debit and Credit Rules",
  order: 5,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG}`,
};

const journalFormatAndNarrationSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
  title: "Journal Format and Narration",
  order: 6,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG}`,
};

const cashAndBankTransactionsSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
  title: "Cash and Bank Transactions",
  order: 7,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG}`,
};

const capitalSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
  title: "Capital",
  order: 8,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG}`,
};

const drawingsSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
  title: "Drawings",
  order: 9,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG}`,
};

const purchasesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
  title: "Purchases",
  order: 10,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG}`,
};

const salesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_SALES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_SALES_SECTION_SLUG,
  title: "Sales",
  order: 11,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_SALES_SECTION_SLUG}`,
};

const expensesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
  title: "Expenses",
  order: 12,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG}`,
};

const incomeSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
  title: "Income",
  order: 13,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_INCOME_SECTION_SLUG}`,
};

const assetsAndLiabilitiesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
  title: "Assets and Liabilities",
  order: 14,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG}`,
};

const mixedSimpleEntriesSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
  title: "Mixed Simple Entries",
  order: 15,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG}`,
};

const chapterRecapAndPracticeSubtopicReference: ChapterSubtopicReference = {
  id: JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
  slug: JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
  title: "Chapter Recap and Practice",
  order: 16,
  availabilityStatus: "available",
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG}`,
};

const introductionJournalEntriesSections: ChapterSection[] = [
    {
      type: "learning-objective",
      id: "introduction-to-journal-entries",
      eyebrow: "Learning objective",
      title: "Introduction to Journal Entries and Journal Format",
      body:
        "In this section, students learn what a journal entry is, how a transaction affects accounts, what debit and credit mean, and how an entry is written in the proper format.",
    },
    {
      type: "concept-explanation",
      id: "what-a-journal-entry-records",
      eyebrow: "Concept explanation",
      title: "What a journal entry records",
      paragraphs: [
        "A journal records business transactions in chronological order. That means transactions are written in the order in which they happen.",
        "Every journal entry affects at least two accounts. One account is debited and another account is credited. The total debit amount must always equal the total credit amount.",
        "Particulars and amounts matter. The account names, `Dr.`, `To`, debit amount, credit amount, and narration must be written clearly so the entry can later flow into ledger, trial balance, and final accounts work.",
      ],
    },
    {
      type: "accounting-format",
      id: "journal-format",
      eyebrow: "Journal format",
      title: "How the entry is written",
      paragraphs: [
        "A standard journal format uses Date, Particulars, L.F., Debit ₹, and Credit ₹ columns. The debited account is written first with `Dr.`, and the credited account is written below with `To`.",
        "Narration briefly explains the transaction. The debit and credit totals must be equal before the entry is considered complete.",
      ],
      formatRows: [
        { id: "debit-row", particulars: "Account to be debited Dr.", lf: "", debitDisplay: "Amount" },
        { id: "credit-row", particulars: "To Account to be credited", lf: "", creditDisplay: "Amount" },
        { id: "narration-row", particulars: "(Narration: brief explanation of the transaction)" },
      ],
    },
    {
      type: "simple-example",
      id: "cash-purchase-example",
      eyebrow: "Simple example",
      title: "Bought goods for cash ₹10,000",
      body: "Use the account effect first, then write the journal entry.",
      reasoningSteps: [
        { label: "Purchases increases", detail: "Goods bought for business are recorded in Purchases." },
        { label: "Cash decreases", detail: "Cash goes out of the business, so Cash is credited." },
        { label: "Purchases is debited", detail: "Expense/goods purchase is recorded on the debit side." },
        { label: "Cash is credited", detail: "The paying asset decreases on the credit side." },
      ],
      journalEntry: [
        { id: "cash-purchase-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
        { id: "cash-purchase-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
      ],
    },
    {
      type: "solved-illustration",
      id: "paid-rent-by-bank",
      illustration: {
        id: "paid-rent-by-bank",
        title: "Paid rent by bank",
        difficulty: "easy",
        question: "Paid rent by bank ₹5,000.",
        accountsAffected: ["Rent A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Rent and Bank are affected." },
          { label: "Debit logic", detail: "Rent is an expense, so Rent is debited." },
          { label: "Credit logic", detail: "Bank balance decreases, so Bank is credited." },
        ],
        journalEntry: [
          { id: "rent-debit", account: "Rent A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "bank-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being rent paid by bank.",
        explanation:
          "The business has incurred rent expense and paid it through bank, so Rent is debited and Bank is credited.",
        studentTakeaway: "Expenses are debited when incurred, and Bank is credited when money leaves the bank account.",
        commonMistake: "Crediting Rent or debiting Bank because the word bank appears in the question.",
      },
    },
    {
      type: "solved-illustration",
      id: "amit-capital-through-bank",
      illustration: {
        id: "amit-capital-through-bank",
        title: "Amit introduced capital through bank",
        difficulty: "slightly-harder",
        question: "Amit introduced capital of ₹50,000 through bank.",
        accountsAffected: ["Bank A/c", "Amit's Capital A/c"],
        reasoningSteps: [
          { label: "Bank increases", detail: "Money comes into the business through bank." },
          { label: "Amit's Capital increases", detail: "Amit contributes capital, so his named capital account is credited." },
          { label: "Named account required", detail: "Use Amit's Capital A/c, not generic Capital A/c." },
        ],
        journalEntry: [
          { id: "bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          {
            id: "amit-capital-credit",
            account: "Amit's Capital A/c",
            side: "credit",
            amount: 50000,
            displayPrefix: "To",
          },
        ],
        narration: "Being capital introduced by Amit through bank.",
        explanation:
          "Bank is debited because the business receives money. Amit's Capital is credited because Amit's claim in the business increases.",
        studentTakeaway: "When a person is named, use that person's Capital A/c instead of generic Capital A/c.",
        commonMistake: "Using generic Capital A/c even though the question names Amit.",
      },
    },
    {
      type: "practice-it-yourself",
      id: "sold-goods-for-cash-practice",
      question: soldGoodsForCashPracticeQuestion,
    },
    {
      type: "practice-it-yourself",
      id: "paid-salary-by-bank-practice",
      question: paidSalaryByBankPracticeQuestion,
    },
    {
      type: "common-mistakes",
      id: "journal-entry-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Watch these before checking in a later phase",
      mistakes: [
        "Using Purchases instead of Sales when goods are sold.",
        "Debiting Cash incorrectly when Cash is actually received or paid.",
        "Forgetting to write `To` before the credited account.",
        "Entering unequal debit and credit amounts.",
        "Entering only figures without complete particulars.",
      ],
    },
];

export const introductionJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...introductionSubtopicReference,
  href: JOURNAL_ENTRIES_CHAPTER_PATH,
  shortDescription:
    "Learn what a journal entry is, why debit and credit must balance, and how the standard journal format is written.",
  learningObjective:
    "Students learn what a journal entry records, how debit and credit lines are shown, and how to write a complete entry with narration.",
  progressLabel: "Section 1 of 16",
  nextSection: businessTransactionsSubtopicReference,
  practiceQuestionIds: [soldGoodsForCashPracticeQuestion.id, paidSalaryByBankPracticeQuestion.id],
  sections: introductionJournalEntriesSections,
};

export const businessTransactionsJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...businessTransactionsSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG}`,
  shortDescription:
    "Understand which events are recorded in the books and how to identify the accounts affected before applying debit and credit rules.",
  learningObjective:
    "Students learn what a business transaction is, why monetary measurement matters, and how to identify the affected accounts step by step.",
  progressLabel: "Section 2 of 16",
  previousSection: introductionSubtopicReference,
  nextSection: accountsAffectedSubtopicReference,
  practiceQuestionIds: [paidElectricityBillInCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "business-transactions",
      eyebrow: "Learning objective",
      title: "Business Transactions",
      body:
        "By the end of this section, you should be able to decide whether an event belongs in the business books, identify the accounts affected, and explain why money measurement and business entity are important.",
    },
    {
      type: "concept-explanation",
      id: "what-makes-a-business-transaction",
      eyebrow: "Concept explanation",
      title: "What makes an event recordable?",
      paragraphs: [
        "A business transaction is an economic event that affects the business. It changes assets, liabilities, capital, income, expenses, or drawings.",
        "The event must be measurable in money. If no reliable money value can be recorded, it is usually not written as a journal entry at that time.",
        "The event should belong to the business entity. The owner and the business are treated separately, so personal events are not automatically entered in the business books.",
        "Most transactions are supported by source documents such as cash memos, invoices, vouchers, receipts, bank statements, or loan documents.",
        "Every journal entry begins with the same first question: what happened, and which accounts are affected?",
      ],
    },
    {
      type: "comparison",
      id: "transaction-versus-event",
      eyebrow: "Transaction versus event",
      title: "Which events are recorded?",
      intro:
        "Use careful judgment. A completed business event with a money value is usually recorded; a plan, personal event, or unrecognised change may not be recorded immediately.",
      groups: [
        {
          title: "Business transactions",
          items: [
            "Paid office rent by bank ₹5,000.",
            "Bought goods for cash ₹10,000.",
            "Sold goods on credit to Riya ₹8,000.",
            "Received a bank loan ₹50,000.",
          ],
        },
        {
          title: "Not recorded now",
          items: [
            "The owner plans to purchase machinery next month.",
            "A manager receives praise from a customer.",
            "The market value of land rises without a recognised accounting event.",
            "The owner purchases a personal item using personal funds.",
          ],
        },
      ],
    },
    {
      type: "process-steps",
      id: "account-identification-method",
      eyebrow: "Account-identification method",
      title: "How to identify the affected accounts",
      body: "Do this before applying debit and credit rules. The entry becomes easier when the account effects are clear.",
      steps: [
        { label: "Read the transaction carefully", detail: "Look for the action, amount, person/account name, and payment mode." },
        { label: "Check whether it belongs to the business", detail: "Personal-only events are not entered in the business books." },
        { label: "Identify the accounts affected", detail: "Name the exact accounts, such as Purchases A/c, Cash A/c, Bank A/c, or Loan A/c." },
        { label: "Identify each account nature", detail: "Classify each account as asset, liability, capital, income, expense, or drawings." },
        { label: "Decide increase or decrease", detail: "Ask what increases and what decreases because of the transaction." },
        { label: "Apply debit and credit rules", detail: "Use the account nature and effect to decide Dr. and To." },
        { label: "Confirm total debit equals total credit", detail: "A complete journal entry must have equal total debit and total credit amounts." },
      ],
    },
    {
      type: "solved-illustration",
      id: "bought-goods-for-cash-worked-example",
      illustration: {
        id: "bought-goods-for-cash-worked-example",
        title: "Worked Example 1: bought goods for cash",
        difficulty: "easy",
        question: "Bought goods for cash ₹10,000.",
        accountsAffected: ["Purchases A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Purchases A/c and Cash A/c are affected." },
          { label: "Purchases increases", detail: "Goods bought for resale are recorded as Purchases." },
          { label: "Cash decreases", detail: "Cash goes out of the business." },
          { label: "Apply rules", detail: "Purchases is debited and Cash is credited." },
        ],
        journalEntry: [
          { id: "purchases-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "cash-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased for cash.",
        explanation:
          "Purchases increases because goods are bought for the business. Cash decreases because payment is made immediately.",
        studentTakeaway: "First identify what the business receives and what it gives up.",
        commonMistake: "Treating every purchase as an asset purchase instead of checking whether goods for resale were bought.",
      },
    },
    {
      type: "solved-illustration",
      id: "bank-loan-received-worked-example",
      illustration: {
        id: "bank-loan-received-worked-example",
        title: "Worked Example 2: bank loan received",
        difficulty: "easy",
        question: "Received a bank loan of ₹50,000 in the bank account.",
        accountsAffected: ["Bank A/c", "Loan A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Bank A/c and Loan A/c are affected." },
          { label: "Bank increases", detail: "Money comes into the business bank account." },
          { label: "Loan liability increases", detail: "The business now owes the lender money." },
          { label: "Apply rules", detail: "Bank is debited and Loan is credited." },
        ],
        journalEntry: [
          { id: "bank-loan-bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          { id: "bank-loan-loan-credit", account: "Loan A/c", side: "credit", amount: 50000, displayPrefix: "To" },
        ],
        narration: "Being loan received through bank.",
        explanation:
          "Bank increases as an asset, and Loan increases as a liability. Both are recorded in the same journal entry.",
        studentTakeaway: "Receiving money is not always income; a loan creates a liability.",
        commonMistake: "Crediting income instead of Loan A/c when borrowed money is received.",
      },
    },
    {
      type: "common-mistakes",
      id: "business-transaction-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Check these before writing the entry",
      mistakes: [
        "Treating a future plan as a completed transaction.",
        "Mixing the owner's personal transaction with business books.",
        "Identifying the wrong accounts.",
        "Confusing purchase of goods with purchase of an asset.",
        "Applying debit and credit rules before identifying account effects.",
        "Ignoring the payment mode, such as cash or bank.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "paid-electricity-bill-in-cash-practice",
      question: paidElectricityBillInCashPracticeQuestion,
    },
  ],
};

export const accountsAffectedJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...accountsAffectedSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG}`,
  shortDescription:
    "Learn how to name the exact accounts affected by a transaction before deciding debit and credit treatment.",
  learningObjective:
    "Students learn to identify every affected account, separate goods from assets, choose Cash or Bank correctly, and recognise named capital or drawings accounts.",
  progressLabel: "Section 3 of 16",
  previousSection: businessTransactionsSubtopicReference,
  nextSection: typesOfAccountsSubtopicReference,
  practiceQuestionIds: [boughtStationeryForCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "accounts-affected",
      eyebrow: "Learning objective",
      title: "Accounts Affected",
      body:
        "Before writing Dr. or To, first identify which accounts changed. Every journal entry affects at least two accounts, and each account name should be specific.",
    },
    {
      type: "concept-explanation",
      id: "identify-accounts-before-rules",
      eyebrow: "Concept explanation",
      title: "Identify accounts before applying rules",
      paragraphs: [
        "Every business transaction affects at least two accounts. If you identify only one account, the journal entry is not complete.",
        "Account names must be specific. Write Cash A/c, Bank A/c, Riya A/c, Amit's Capital A/c, Furniture A/c, or Purchases A/c as the transaction requires.",
        "The payment mode often reveals whether Cash A/c or Bank A/c is affected. Words like cash, bank, cheque, or bank transfer are important clues.",
        "Buying goods affects Purchases A/c, but buying an asset affects the named asset account, such as Furniture A/c or Machinery A/c.",
        "Credit transactions usually involve a named debtor or creditor. For example, selling goods on credit to Riya affects Riya A/c and Sales A/c.",
        "Capital and drawings should use the owner's or partner's name where appropriate, such as Amit's Capital A/c or Amit Drawings A/c.",
        "Only after the affected accounts are clear should you decide which account is debited and which account is credited.",
      ],
    },
    {
      type: "process-steps",
      id: "accounts-affected-process",
      eyebrow: "Account-identification process",
      title: "Read, identify, then apply rules",
      body:
        "Use this order every time: read the transaction, identify the accounts, understand the effect, then apply debit and credit rules.",
      steps: [
        { label: "Read the complete transaction", detail: "Do not decide from one word only. Read the amount, person, item, and payment mode." },
        { label: "Identify what the business receives", detail: "This may be cash, bank money, goods, an asset, a service benefit, or a debtor." },
        { label: "Identify what the business gives or becomes liable for", detail: "This may be cash, bank money, goods, income, capital claim, loan, or a creditor." },
        { label: "Look for account clues", detail: "Check whether cash, bank, a person, goods, an asset, income, expense, capital, or drawings are involved." },
        { label: "Write the exact account names", detail: "Use the specific account name from the transaction instead of a vague account name." },
        { label: "Confirm no account is missed", detail: "A journal entry needs at least two affected accounts." },
        { label: "Move to classification and treatment", detail: "After account names are clear, classify them and decide debit-credit treatment." },
      ],
    },
    {
      type: "clue-guide",
      id: "transaction-clue-guide",
      eyebrow: "Transaction clue guide",
      title: "Common clues and likely accounts",
      body:
        "These are learning clues, not a promise that every wording variation is supported by the live Explainer.",
      clues: [
        { clue: "cash", likelyAccounts: ["Cash A/c"] },
        { clue: "bank, cheque, or bank transfer", likelyAccounts: ["Bank A/c"] },
        { clue: "goods purchased", likelyAccounts: ["Purchases A/c"] },
        { clue: "goods sold", likelyAccounts: ["Sales A/c"] },
        { clue: "furniture purchased", likelyAccounts: ["Furniture A/c"], note: "Use the asset name when the item is for business use." },
        { clue: "rent paid", likelyAccounts: ["Rent A/c"] },
        { clue: "capital introduced by Amit", likelyAccounts: ["Amit's Capital A/c"] },
        { clue: "withdrawn for personal use", likelyAccounts: ["Drawings A/c"], note: "Use a named drawings account when a person is named." },
        { clue: "sold on credit to Riya", likelyAccounts: ["Riya A/c", "Sales A/c"] },
        { clue: "purchased on credit from Mohan", likelyAccounts: ["Purchases A/c", "Mohan A/c"] },
      ],
    },
    {
      type: "comparison",
      id: "goods-versus-assets",
      eyebrow: "Important comparison",
      title: "Goods purchased versus asset purchased",
      intro:
        "Do not use Purchases A/c for every purchase. First ask whether the item is bought for resale or for use in the business.",
      groups: [
        {
          title: "Goods purchased",
          items: [
            "Transaction: Bought goods for cash ₹10,000.",
            "Accounts affected: Purchases A/c and Cash A/c.",
            "Reason: The items were purchased for resale.",
          ],
        },
        {
          title: "Asset purchased",
          items: [
            "Transaction: Bought furniture for cash ₹10,000.",
            "Accounts affected: Furniture A/c and Cash A/c.",
            "Reason: Furniture is used in the business and is not purchased for resale.",
          ],
        },
      ],
    },
    {
      type: "solved-illustration",
      id: "credit-sale-to-riya-worked-example",
      illustration: {
        id: "credit-sale-to-riya-worked-example",
        title: "Worked Example 1: credit sale to Riya",
        difficulty: "easy",
        question: "Sold goods on credit to Riya ₹8,000.",
        accountsAffected: ["Riya A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Riya A/c is affected", detail: "Riya becomes a debtor because goods are sold to her on credit." },
          { label: "Sales A/c is affected", detail: "Goods are sold, so Sales A/c is affected." },
          { label: "Cash/Bank not affected", detail: "Cash A/c and Bank A/c are not affected because the sale is on credit." },
          { label: "Then apply rules", detail: "After identifying accounts, Riya is debited and Sales is credited." },
        ],
        journalEntry: [
          { id: "riya-debit", account: "Riya A/c", side: "debit", amount: 8000, drNotation: "Dr." },
          { id: "sales-credit", account: "Sales A/c", side: "credit", amount: 8000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Riya.",
        explanation:
          "The first job is to identify accounts: Riya A/c and Sales A/c. Cash or Bank is not used because no money is received immediately.",
        studentTakeaway: "For a credit sale, use the customer's account instead of Cash A/c or Bank A/c.",
        commonMistake: "Using Cash A/c just because goods are sold.",
      },
    },
    {
      type: "solved-illustration",
      id: "furniture-on-credit-from-mohan-worked-example",
      illustration: {
        id: "furniture-on-credit-from-mohan-worked-example",
        title: "Worked Example 2: furniture bought on credit",
        difficulty: "easy",
        question: "Bought furniture on credit from Mohan ₹20,000.",
        accountsAffected: ["Furniture A/c", "Mohan A/c"],
        reasoningSteps: [
          { label: "Furniture A/c is affected", detail: "Furniture is an asset used in the business." },
          { label: "Mohan A/c is affected", detail: "Mohan becomes a creditor because the purchase is on credit." },
          { label: "Purchases is not used", detail: "Furniture is an asset, not goods bought for resale." },
          { label: "Cash/Bank not affected", detail: "Cash A/c and Bank A/c are not affected because payment is not made now." },
        ],
        journalEntry: [
          { id: "furniture-debit", account: "Furniture A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "mohan-credit", account: "Mohan A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being furniture purchased on credit from Mohan.",
        explanation:
          "The account affected is Furniture A/c because an asset is purchased. Mohan A/c is credited because Mohan is the creditor.",
        studentTakeaway: "Use Purchases A/c for goods, but use the asset name for business assets.",
        commonMistake: "Debiting Purchases A/c for furniture.",
      },
    },
    {
      type: "solved-illustration",
      id: "amit-cash-drawings-worked-example",
      illustration: {
        id: "amit-cash-drawings-worked-example",
        title: "Worked Example 3: drawings in cash",
        difficulty: "easy",
        question: "Amit withdrew cash ₹5,000 for personal use.",
        accountsAffected: ["Amit Drawings A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Amit Drawings A/c is affected", detail: "Value is withdrawn by Amit for personal use." },
          { label: "Cash A/c is affected", detail: "Cash leaves the business." },
          { label: "Not an office cash withdrawal", detail: "The words personal use make this drawings, not a normal business cash withdrawal." },
          { label: "Then apply rules", detail: "Amit Drawings is debited and Cash is credited." },
        ],
        journalEntry: [
          { id: "amit-drawings-debit", account: "Amit Drawings A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "cash-drawings-credit", account: "Cash A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn by Amit for personal use.",
        explanation:
          "Personal-use wording changes the affected account to Amit Drawings A/c. Cash is credited because cash leaves the business.",
        studentTakeaway: "Personal withdrawal is drawings, not an ordinary business cash withdrawal.",
        commonMistake: "Writing Cash A/c Dr. as if the business withdrew cash for office use.",
      },
    },
    {
      type: "common-mistakes",
      id: "accounts-affected-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these account-identification mistakes",
      mistakes: [
        "Identifying only one account.",
        "Using Cash A/c when the transaction is on credit.",
        "Using Purchases A/c for an asset.",
        "Using a generic Capital A/c instead of the named proprietor or partner account.",
        "Treating personal withdrawal as an ordinary business cash withdrawal.",
        "Ignoring payment mode.",
        "Applying debit-credit rules before identifying the accounts.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "bought-stationery-for-cash-practice",
      question: boughtStationeryForCashPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "accounts-affected-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Before writing any journal entry, ask: Which accounts changed, and why?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const typesOfAccountsJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...typesOfAccountsSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG}`,
  shortDescription:
    "Classify accounts through modern and traditional approaches before learning debit-credit rules.",
  learningObjective:
    "Students learn why accounts are classified, identify modern account categories, connect them with personal, real, and nominal accounts, and prepare for debit-credit rules.",
  progressLabel: "Section 4 of 16",
  previousSection: accountsAffectedSubtopicReference,
  nextSection: debitAndCreditRulesSubtopicReference,
  practiceQuestionIds: [receivedFeesInCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "types-of-accounts",
      eyebrow: "Learning objective",
      title: "Types of Accounts",
      body:
        "By the end of this section, you should be able to classify an account using the modern approach, connect it with the traditional approach, and understand the account's nature before applying debit-credit rules.",
    },
    {
      type: "concept-explanation",
      id: "why-accounts-are-classified",
      eyebrow: "Concept explanation",
      title: "Why accounts are classified",
      paragraphs: [
        "A business may have hundreds of accounts. Classification helps you understand what each account represents instead of memorising every account separately.",
        "The account's nature helps decide how an increase or decrease will be treated later. That is why classification should come before debit-credit rules.",
        "The same account can be understood through both modern and traditional classification. These are two learning approaches, not two different journal entries.",
        "Modern classification is easier to understand economically, so we start there. Traditional classification is then connected because many textbooks and exams still use it.",
      ],
    },
    {
      type: "classification-categories",
      id: "modern-classification",
      eyebrow: "Modern classification",
      title: "Classify by what the account represents",
      body:
        "Modern classification groups accounts by their economic nature: asset, liability, capital, income, expense, or drawings.",
      categories: [
        {
          title: "Assets",
          description: "Resources owned or controlled by the business.",
          examples: ["Cash A/c", "Bank A/c", "Furniture A/c", "Machinery A/c", "Building A/c", "Debtors / Accounts Receivable"],
          note: "Assets may be current or non-current, but detailed Balance Sheet classification comes later.",
        },
        {
          title: "Liabilities",
          description: "Amounts payable by the business to outsiders.",
          examples: ["Bank Loan A/c", "Creditors / Accounts Payable", "Outstanding Salary A/c", "Bills Payable A/c"],
        },
        {
          title: "Capital / Equity",
          description: "The owner's or partners' claim in the business.",
          examples: ["Amit's Capital A/c", "Riya's Capital A/c", "Share Capital A/c"],
          note: "Use named capital accounts when a named proprietor or partner is involved.",
        },
        {
          title: "Income / Revenue",
          description: "Amounts earned by the business.",
          examples: ["Sales A/c", "Commission Received A/c", "Interest Received A/c", "Rent Received A/c"],
        },
        {
          title: "Expenses / Losses",
          description: "Costs incurred to earn revenue or run the business.",
          examples: ["Salary A/c", "Rent A/c", "Electricity Expense A/c", "Purchases A/c", "Bad Debts A/c"],
          note: "In this journal-entry learning context, Purchases A/c is treated as a goods/expense account, not a fixed asset.",
        },
        {
          title: "Drawings",
          description: "Value withdrawn by the owner or partner for personal use.",
          examples: ["Amit Drawings A/c", "Riya Drawings A/c"],
          note: "Drawings is not a business expense; it is adjusted against capital.",
        },
      ],
    },
    {
      type: "classification-categories",
      id: "traditional-classification",
      eyebrow: "Traditional classification",
      title: "Classify as personal, real, or nominal",
      body:
        "Traditional classification is another way to understand accounts. Learn the category now; the full golden rules come in the next section.",
      categories: [
        {
          title: "Personal Accounts",
          description: "Accounts related to persons or entities.",
          examples: ["Amit A/c", "Bank A/c", "Outstanding Salary A/c"],
          subcategories: [
            { title: "Natural persons", examples: ["Amit A/c", "Riya A/c", "Mohan A/c"] },
            { title: "Artificial persons", examples: ["Bank A/c", "Company A/c", "Institution A/c"] },
            {
              title: "Representative personal accounts",
              examples: ["Outstanding Salary A/c", "Prepaid Rent A/c", "Accrued Interest A/c"],
              note: "Detailed adjustment entries are later learning.",
            },
          ],
        },
        {
          title: "Real Accounts",
          description: "Accounts related to assets and property.",
          examples: ["Cash A/c", "Furniture A/c", "Goodwill A/c"],
          subcategories: [
            { title: "Tangible real accounts", examples: ["Cash A/c", "Furniture A/c", "Machinery A/c", "Building A/c"] },
            {
              title: "Intangible real accounts",
              examples: ["Goodwill A/c", "Patent A/c", "Trademark A/c"],
              note: "This is classification only. Goodwill journal entries are not added here.",
            },
          ],
        },
        {
          title: "Nominal Accounts",
          description: "Accounts related to expenses, losses, incomes, and gains.",
          examples: ["Salary A/c", "Rent A/c", "Purchases A/c", "Sales A/c", "Commission Received A/c", "Interest Received A/c"],
        },
      ],
    },
    {
      type: "classification-guide",
      id: "classification-mapping-guide",
      eyebrow: "Modern + traditional bridge",
      title: "Same account, two classification views",
      body:
        "This mapping is a learning bridge. It does not mean you should write two account names in one journal entry.",
      rows: [
        { account: "Cash A/c", modernClassification: "Asset", traditionalClassification: "Real Account" },
        { account: "Bank A/c", modernClassification: "Asset", traditionalClassification: "Artificial Personal Account" },
        { account: "Furniture A/c", modernClassification: "Asset", traditionalClassification: "Real Account" },
        { account: "Bank Loan A/c", modernClassification: "Liability", traditionalClassification: "Personal Account" },
        { account: "Amit's Capital A/c", modernClassification: "Capital / Equity", traditionalClassification: "Personal Account" },
        { account: "Amit Drawings A/c", modernClassification: "Drawings / Capital reduction", traditionalClassification: "Personal Account" },
        { account: "Salary A/c", modernClassification: "Expense", traditionalClassification: "Nominal Account" },
        { account: "Sales A/c", modernClassification: "Income / Revenue", traditionalClassification: "Nominal Account" },
        { account: "Riya A/c as debtor", modernClassification: "Asset / Receivable", traditionalClassification: "Personal Account" },
        { account: "Mohan A/c as creditor", modernClassification: "Liability / Payable", traditionalClassification: "Personal Account" },
        { account: "Outstanding Salary A/c", modernClassification: "Liability", traditionalClassification: "Representative Personal Account" },
      ],
    },
    {
      type: "process-steps",
      id: "classification-decision-process",
      eyebrow: "Classification process",
      title: "How to classify an account",
      body:
        "Use this sequence before debit-credit rules. It keeps the account nature clear.",
      steps: [
        { label: "Read the account name", detail: "Start with the exact account, not the full transaction." },
        { label: "Ask what it represents", detail: "Decide what this account represents to the business." },
        { label: "Choose the modern category", detail: "Ask whether it is an asset, liability, capital, income, expense, or drawings." },
        { label: "Choose the traditional category", detail: "If using the traditional method, ask whether it relates to a person, property, or income/expense." },
        { label: "Use transaction context", detail: "A person may be a debtor, creditor, owner, or partner depending on the transaction." },
        { label: "Confirm before rules", detail: "Confirm the classification before applying debit and credit rules." },
      ],
    },
    {
      type: "classification-examples",
      id: "classification-worked-examples",
      eyebrow: "Classification examples",
      title: "Classify the accounts only",
      body:
        "These examples stop at classification. The next section teaches how classification connects to debit-credit treatment.",
      examples: [
        {
          title: "Worked Example 1",
          question: "Paid salary by bank ₹8,000.",
          accounts: [
            { account: "Salary A/c", modernClassification: "Expense", traditionalClassification: "Nominal Account" },
            { account: "Bank A/c", modernClassification: "Asset", traditionalClassification: "Artificial Personal Account" },
          ],
          explanation: "Debit-credit treatment will be learned in the next section.",
        },
        {
          title: "Worked Example 2",
          question: "Bought furniture for cash ₹20,000.",
          accounts: [
            { account: "Furniture A/c", modernClassification: "Asset", traditionalClassification: "Real Account" },
            { account: "Cash A/c", modernClassification: "Asset", traditionalClassification: "Real Account" },
          ],
          explanation:
            "Both accounts are assets in the modern view, but one asset increases and another asset decreases. This prepares you for debit-credit rules.",
        },
        {
          title: "Worked Example 3",
          question: "Sold goods on credit to Riya ₹10,000.",
          accounts: [
            { account: "Riya A/c", modernClassification: "Asset / Receivable", traditionalClassification: "Personal Account" },
            { account: "Sales A/c", modernClassification: "Income / Revenue", traditionalClassification: "Nominal Account" },
          ],
          explanation: "The person's role in the transaction determines whether they are a debtor or creditor.",
        },
        {
          title: "Worked Example 4",
          question: "Amit introduced capital of ₹50,000 by bank.",
          accounts: [
            { account: "Bank A/c", modernClassification: "Asset", traditionalClassification: "Artificial Personal Account" },
            { account: "Amit's Capital A/c", modernClassification: "Capital / Equity", traditionalClassification: "Personal Account" },
          ],
          explanation: "Continue using the named capital account. Do not use generic Capital A/c when Amit is named.",
        },
      ],
    },
    {
      type: "common-mistakes",
      id: "types-of-accounts-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these classification mistakes",
      mistakes: [
        "Classifying the transaction instead of the account.",
        "Treating Bank A/c as a Real Account under the traditional system.",
        "Treating Purchases A/c as a fixed asset.",
        "Treating Drawings as a business expense.",
        "Treating Sales A/c as an asset.",
        "Treating a creditor as an expense.",
        "Using generic Capital A/c when a named proprietor or partner is given.",
        "Mixing modern and traditional labels in one classification answer.",
        "Trying to apply debit-credit rules before identifying account nature.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "received-fees-in-cash-practice",
      question: receivedFeesInCashPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "types-of-accounts-reflection",
      eyebrow: "Reflection prompt",
      prompt: "For every account, ask: What does this account represent to the business?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const debitAndCreditRulesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...debitAndCreditRulesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG}`,
  shortDescription:
    "Learn how account classification and increase/decrease effects decide debit and credit treatment.",
  learningObjective:
    "Students learn what debit and credit mean, apply modern and traditional rules, place accounts on the correct side, and confirm that total debit equals total credit.",
  progressLabel: "Section 5 of 16",
  previousSection: typesOfAccountsSubtopicReference,
  nextSection: journalFormatAndNarrationSubtopicReference,
  practiceQuestionIds: [paidWagesInCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "debit-and-credit-rules",
      eyebrow: "Learning objective",
      title: "Debit and Credit Rules",
      body:
        "By the end of this section, you should be able to identify the affected accounts, classify them, decide whether each one increases or decreases, apply debit-credit rules, and confirm that Debit equals Credit.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-debit-and-credit",
      eyebrow: "Concept explanation",
      title: "What debit and credit mean",
      paragraphs: [
        "Debit means the left side of an account. Credit means the right side of an account.",
        "Debit and credit are accounting positions. Debit is not always good, and credit is not always bad.",
        "The correct side depends on the account's nature and whether that account increases or decreases.",
        "Every complete journal entry must have equal total debit and total credit amounts.",
        "Use this order: identify the accounts, classify them, determine increase or decrease, apply debit-credit rules, then confirm Debit equals Credit.",
      ],
    },
    {
      type: "concept-explanation",
      id: "debit-credit-misconception-note",
      eyebrow: "Misconception note",
      title: "Cash received is not always credited",
      paragraphs: [
        "Money received is not automatically credited. Money paid is not automatically debited.",
        "When cash or bank money is received, Cash A/c or Bank A/c usually increases. An asset increase is debited.",
        "When cash or bank money is paid, Cash A/c or Bank A/c usually decreases. An asset decrease is credited.",
      ],
    },
    {
      type: "debit-credit-rule-guide",
      id: "modern-debit-credit-rules",
      eyebrow: "Modern rules",
      title: "Apply rules from account nature and effect",
      body:
        "First classify the account. Then ask whether that account increases or decreases.",
      rules: [
        {
          title: "Assets",
          increaseTreatment: "Debit",
          decreaseTreatment: "Credit",
          examples: ["Cash received", "Furniture purchased", "Bank balance reduced"],
        },
        {
          title: "Liabilities",
          increaseTreatment: "Credit",
          decreaseTreatment: "Debit",
          examples: ["Loan received", "Creditor created", "Loan repaid"],
        },
        {
          title: "Capital / Equity",
          increaseTreatment: "Credit",
          decreaseTreatment: "Debit",
          examples: ["Capital introduced", "Capital withdrawn or adjusted"],
        },
        {
          title: "Income / Revenue",
          increaseTreatment: "Credit",
          decreaseTreatment: "Debit",
          examples: ["Sales", "Commission received", "Interest received"],
          note: "A decrease or reversal of income is debited.",
        },
        {
          title: "Expenses / Losses",
          increaseTreatment: "Debit",
          decreaseTreatment: "Credit",
          examples: ["Salary", "Rent", "Electricity expense", "Bad debts later"],
          note: "A decrease or reversal of expense is credited.",
        },
        {
          title: "Drawings",
          increaseTreatment: "Debit",
          decreaseTreatment: "Credit",
          examples: ["Cash withdrawn for personal use", "Goods withdrawn for personal use later"],
          note:
            "Drawings reduce the owner's or partner's claim, but are shown through a separate Drawings account for learning and accounting.",
        },
      ],
    },
    {
      type: "debit-credit-rule-guide",
      id: "modern-rule-summary-matrix",
      eyebrow: "Modern-rule summary matrix",
      title: "Increase and decrease side by account nature",
      body:
        "Use this compact guide after classifying the account. It is shown as cards so it stays readable on mobile.",
      rules: [
        { title: "Asset", increaseTreatment: "Debit", decreaseTreatment: "Credit" },
        { title: "Liability", increaseTreatment: "Credit", decreaseTreatment: "Debit" },
        { title: "Capital / Equity", increaseTreatment: "Credit", decreaseTreatment: "Debit" },
        { title: "Income / Revenue", increaseTreatment: "Credit", decreaseTreatment: "Debit" },
        { title: "Expense / Loss", increaseTreatment: "Debit", decreaseTreatment: "Credit" },
        { title: "Drawings", increaseTreatment: "Debit", decreaseTreatment: "Credit" },
      ],
    },
    {
      type: "debit-credit-rule-guide",
      id: "traditional-golden-rules",
      eyebrow: "Traditional golden rules",
      title: "Personal, real, and nominal rules",
      body:
        "These traditional rules should lead to the same entry as the modern approach when the account is classified correctly.",
      rules: [
        {
          title: "Personal Account",
          rule: "Debit the receiver, credit the giver.",
          examples: [
            "A customer who receives goods on credit may be debited.",
            "A supplier who gives goods on credit may be credited.",
            "Named capital accounts represent the person contributing value.",
          ],
        },
        {
          title: "Real Account",
          rule: "Debit what comes in, credit what goes out.",
          examples: [
            "Furniture comes into the business, so Furniture A/c is debited.",
            "Cash leaves the business, so Cash A/c is credited.",
          ],
        },
        {
          title: "Nominal Account",
          rule: "Debit all expenses and losses, credit all incomes and gains.",
          examples: [
            "Salary expense is debited.",
            "Rent expense is debited.",
            "Sales income is credited.",
            "Commission received is credited.",
          ],
          note: "Representative personal accounts need later adjustment knowledge, so do not over-expand them here.",
        },
      ],
    },
    {
      type: "comparison",
      id: "modern-traditional-rule-comparison",
      eyebrow: "Modern + traditional comparison",
      title: "Both approaches should reach the same entry",
      intro:
        "Use one logical method consistently. Do not mix incomplete fragments from both methods.",
      groups: [
        {
          title: "Paid salary by bank: modern",
          items: [
            "Salary is an expense and increases, so Salary A/c is debited.",
            "Bank is an asset and decreases, so Bank A/c is credited.",
          ],
        },
        {
          title: "Paid salary by bank: traditional",
          items: [
            "Salary is nominal, so debit all expenses.",
            "Bank is artificial personal, so credit the giver.",
            "Result: Salary A/c Dr. ₹8,000; To Bank A/c ₹8,000.",
          ],
        },
        {
          title: "Bought furniture for cash: modern",
          items: [
            "Furniture is an asset and increases, so Furniture A/c is debited.",
            "Cash is an asset and decreases, so Cash A/c is credited.",
          ],
        },
        {
          title: "Bought furniture for cash: traditional",
          items: [
            "Furniture comes into the business, so Furniture A/c is debited.",
            "Cash goes out of the business, so Cash A/c is credited.",
            "Result: Furniture A/c Dr. ₹20,000; To Cash A/c ₹20,000.",
          ],
        },
      ],
    },
    {
      type: "process-steps",
      id: "debit-credit-decision-process",
      eyebrow: "Debit-credit decision process",
      title: "Use this order before writing the entry",
      body:
        "This process keeps the logic clear before the future Journal Format and Narration section teaches formal presentation in more depth.",
      steps: [
        { label: "Read the complete transaction", detail: "Read the amount, item, person, purpose, and payment mode." },
        { label: "Identify every account affected", detail: "Name the exact accounts before choosing sides." },
        { label: "Classify each account", detail: "Decide the account nature using modern or traditional classification." },
        { label: "Decide increase or decrease", detail: "Ask what happens to each affected account." },
        { label: "Apply the relevant rule", detail: "Use the account nature and effect to decide debit or credit." },
        { label: "Write the debited account first", detail: "The debit line is written first in a journal entry." },
        { label: "Write the credited account with To", detail: "The credited line is written below with To." },
        { label: "Enter the amounts", detail: "Put the debit amount and credit amount in the correct columns." },
        { label: "Confirm Debit equals Credit", detail: "Total debit must equal total credit." },
        { label: "Add narration where required", detail: "Narration briefly explains the transaction." },
      ],
    },
    {
      type: "solved-illustration",
      id: "debit-credit-paid-rent-by-bank",
      illustration: {
        id: "debit-credit-paid-rent-by-bank",
        title: "Worked Example 1: expense paid by bank",
        difficulty: "easy",
        question: "Paid rent by bank ₹5,000.",
        accountsAffected: ["Rent A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Rent A/c and Bank A/c are affected." },
          { label: "Modern logic", detail: "Rent expense increases, so Rent A/c is debited." },
          { label: "Bank effect", detail: "Bank is an asset and decreases, so Bank A/c is credited." },
          { label: "Traditional logic", detail: "Debit all expenses and credit the giver." },
        ],
        journalEntry: [
          { id: "debit-credit-rent-debit", account: "Rent A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "debit-credit-bank-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being rent paid by bank.",
        explanation:
          "Rent is debited because expense increases. Bank is credited because bank balance decreases.",
        studentTakeaway: "An expense increase is debited, and an asset decrease is credited.",
        commonMistake: "Crediting Rent because money was paid.",
      },
    },
    {
      type: "solved-illustration",
      id: "debit-credit-furniture-for-cash",
      illustration: {
        id: "debit-credit-furniture-for-cash",
        title: "Worked Example 2: asset purchased for cash",
        difficulty: "easy",
        question: "Bought furniture for cash ₹20,000.",
        accountsAffected: ["Furniture A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Furniture A/c and Cash A/c are affected." },
          { label: "Furniture increases", detail: "Furniture is an asset that comes into the business, so it is debited." },
          { label: "Cash decreases", detail: "Cash is an asset that goes out, so Cash A/c is credited." },
          { label: "Purchases not used", detail: "Furniture is a business asset, not goods bought for resale." },
        ],
        journalEntry: [
          { id: "debit-credit-furniture-debit", account: "Furniture A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "debit-credit-cash-credit", account: "Cash A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being furniture purchased for cash.",
        explanation:
          "Furniture A/c is debited because the asset increases. Cash A/c is credited because cash decreases.",
        studentTakeaway: "Do not use Purchases A/c for furniture; use the asset account.",
        commonMistake: "Debiting Purchases A/c for furniture.",
      },
    },
    {
      type: "solved-illustration",
      id: "debit-credit-credit-sale-to-riya",
      illustration: {
        id: "debit-credit-credit-sale-to-riya",
        title: "Worked Example 3: credit sale",
        difficulty: "easy",
        question: "Sold goods on credit to Riya ₹10,000.",
        accountsAffected: ["Riya A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Riya A/c and Sales A/c are affected." },
          { label: "Riya becomes debtor", detail: "Riya is a receivable asset, so Riya A/c is debited." },
          { label: "Sales increases", detail: "Sales income increases, so Sales A/c is credited." },
          { label: "No cash or bank", detail: "Cash A/c and Bank A/c are not affected because the sale is on credit." },
        ],
        journalEntry: [
          { id: "debit-credit-riya-debit", account: "Riya A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "debit-credit-sales-credit", account: "Sales A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Riya.",
        explanation:
          "Riya is debited because she owes the business. Sales is credited because income increases.",
        studentTakeaway: "For a credit sale, use the customer's account instead of Cash A/c or Bank A/c.",
        commonMistake: "Using Cash A/c or Bank A/c even though no money is received now.",
      },
    },
    {
      type: "solved-illustration",
      id: "debit-credit-amit-capital-bank",
      illustration: {
        id: "debit-credit-amit-capital-bank",
        title: "Worked Example 4: capital introduced through bank",
        difficulty: "easy",
        question: "Amit introduced capital of ₹50,000 through bank.",
        accountsAffected: ["Bank A/c", "Amit's Capital A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Bank A/c and Amit's Capital A/c are affected." },
          { label: "Bank increases", detail: "Bank is an asset and increases, so Bank A/c is debited." },
          { label: "Capital increases", detail: "Amit's Capital increases, so Amit's Capital A/c is credited." },
          { label: "Named capital", detail: "Use Amit's Capital A/c, not generic Capital A/c." },
        ],
        journalEntry: [
          { id: "debit-credit-capital-bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          {
            id: "debit-credit-amit-capital-credit",
            account: "Amit's Capital A/c",
            side: "credit",
            amount: 50000,
            displayPrefix: "To",
          },
        ],
        narration: "Being capital introduced by Amit through bank.",
        explanation:
          "Bank is debited because the business receives money. Amit's Capital is credited because Amit's claim increases.",
        studentTakeaway: "Continue using the named capital account.",
        commonMistake: "Using generic Capital A/c when Amit is named.",
      },
    },
    {
      type: "solved-illustration",
      id: "debit-credit-business-cash-withdrawal",
      illustration: {
        id: "debit-credit-business-cash-withdrawal",
        title: "Worked Example 5: business cash withdrawal from bank",
        difficulty: "easy",
        question: "Cash withdrawn from bank ₹3,000 for office use.",
        accountsAffected: ["Cash A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Cash A/c and Bank A/c are affected." },
          { label: "Cash increases", detail: "Cash is an asset and increases, so Cash A/c is debited." },
          { label: "Bank decreases", detail: "Bank is an asset and decreases, so Bank A/c is credited." },
          { label: "Business use", detail: "This is not drawings because the withdrawal is for business use." },
        ],
        journalEntry: [
          { id: "debit-credit-cash-withdrawal-debit", account: "Cash A/c", side: "debit", amount: 3000, drNotation: "Dr." },
          { id: "debit-credit-bank-withdrawal-credit", account: "Bank A/c", side: "credit", amount: 3000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn from bank for office use.",
        explanation:
          "Cash is debited because cash comes into the office cash balance. Bank is credited because bank balance decreases.",
        studentTakeaway: "A business cash withdrawal is an asset transfer, not drawings.",
        commonMistake: "Treating every withdrawal from bank as drawings.",
      },
    },
    {
      type: "solved-illustration",
      id: "debit-credit-personal-cash-withdrawal",
      illustration: {
        id: "debit-credit-personal-cash-withdrawal",
        title: "Worked Example 6: personal withdrawal",
        difficulty: "easy",
        question: "Amit withdrew cash ₹5,000 for personal use.",
        accountsAffected: ["Amit Drawings A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Accounts affected", detail: "Amit Drawings A/c and Cash A/c are affected." },
          { label: "Drawings increases", detail: "Personal withdrawal increases Drawings, so Amit Drawings A/c is debited." },
          { label: "Cash decreases", detail: "Cash is an asset and decreases, so Cash A/c is credited." },
          { label: "Personal use", detail: "This contrasts with business cash withdrawal from bank." },
        ],
        journalEntry: [
          { id: "debit-credit-amit-drawings-debit", account: "Amit Drawings A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "debit-credit-cash-drawings-credit", account: "Cash A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn by Amit for personal use.",
        explanation:
          "Amit Drawings is debited because drawings increase. Cash is credited because cash leaves the business.",
        studentTakeaway: "Personal withdrawal is drawings; business withdrawal is usually a cash-bank transfer.",
        commonMistake: "Writing Cash A/c Dr. for personal withdrawal.",
      },
    },
    {
      type: "common-mistakes",
      id: "debit-credit-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these debit-credit mistakes",
      mistakes: [
        "Deciding debit and credit before identifying accounts.",
        "Assuming cash received must be credited.",
        "Assuming cash paid must be debited.",
        "Treating every purchase as Purchases A/c.",
        "Using Bank A/c when the transaction states cash.",
        "Using Cash A/c for a credit transaction.",
        "Debiting Sales A/c when sales increase.",
        "Crediting an expense when it increases.",
        "Using generic Capital A/c for a named owner or partner.",
        "Confusing drawings with normal business cash withdrawal.",
        "Entering balanced amounts with the wrong accounts.",
        "Forgetting that debit total must equal credit total.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "paid-wages-in-cash-practice",
      question: paidWagesInCashPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "debit-credit-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Before choosing Debit or Credit, ask: What account is this, and is it increasing or decreasing?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const journalFormatAndNarrationJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...journalFormatAndNarrationSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG}`,
  shortDescription:
    "Learn the formal journal entry layout, column use, Dr./To placement, narration, and debit-credit total checks.",
  learningObjective:
    "Students learn every journal column, how to present debit and credit lines, how to write narration, and how to confirm a clean balanced entry.",
  progressLabel: "Section 6 of 16",
  previousSection: debitAndCreditRulesSubtopicReference,
  nextSection: cashAndBankTransactionsSubtopicReference,
  practiceQuestionIds: [paidOfficeRentByBankPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "journal-format-and-narration",
      eyebrow: "Learning objective",
      title: "Journal Format and Narration",
      body:
        "By the end of this section, you should be able to present a journal entry neatly with Date, Particulars, L.F., Debit, Credit, and a clear narration.",
    },
    {
      type: "concept-explanation",
      id: "purpose-of-journal-format",
      eyebrow: "Concept explanation",
      title: "Why journal format matters",
      paragraphs: [
        "The journal records transactions in chronological order. That means entries are written in the order in which transactions happen.",
        "A standard format keeps entries clear and consistent. It shows which account is debited, which account is credited, and the respective amounts.",
        "Narration briefly explains the transaction below the entry. The format also helps later ledger posting because the accounts and amounts are easy to trace.",
        "This section teaches complete formal presentation. Section 1 only introduced the format briefly.",
      ],
    },
    {
      type: "accounting-format",
      id: "standard-journal-format",
      eyebrow: "Journal format",
      title: "Standard journal columns",
      paragraphs: [
        "A journal entry uses Date, Particulars, L.F., Debit ₹, and Credit ₹ columns.",
        "The debit account is written first with Dr. The credited account is written below it with To. Narration is written below the account lines.",
      ],
      formatRows: [
        { id: "format-date-header", particulars: "Debit account Dr.", lf: "", debitDisplay: "Debit amount" },
        { id: "format-credit-line", particulars: "To Credit account", lf: "", creditDisplay: "Credit amount" },
        { id: "format-narration-line", particulars: "(Being short explanation of the transaction)" },
      ],
    },
    {
      type: "journal-column-guide",
      id: "journal-column-guide",
      eyebrow: "Column guide",
      title: "What each journal column means",
      body:
        "Use column meaning, not colour or layout alone, to understand where each part of the entry belongs.",
      columns: [
        {
          title: "Date",
          purpose: "Shows when the transaction occurred.",
          guidance: [
            "The year and month may be written once and repeated only when required by the chosen school format.",
            "Do not over-expand into date-book conventions here.",
          ],
        },
        {
          title: "Particulars",
          purpose: "Contains the debit account, Dr., credited account with To, and narration.",
          guidance: [
            "Write the account to be debited first.",
            "Write the credited account below it with To.",
            "Write narration below the account lines.",
          ],
        },
        {
          title: "L.F.",
          purpose: "L.F. means Ledger Folio.",
          guidance: [
            "It records the ledger page or reference after posting.",
            "Students may leave it blank while initially preparing the journal.",
            "It is not an amount column.",
          ],
        },
        {
          title: "Debit amount",
          purpose: "Contains the amount debited.",
          guidance: ["Only the debit line receives the amount in this column."],
        },
        {
          title: "Credit amount",
          purpose: "Contains the amount credited.",
          guidance: ["Only the credit line receives the amount in this column."],
        },
      ],
    },
    {
      type: "concept-explanation",
      id: "how-to-write-debit-line",
      eyebrow: "Debit line",
      title: "How to write the debit line",
      paragraphs: [
        "The account to be debited is written first.",
        "Add Dr. after the debit account name.",
        "Enter its amount in the Debit column.",
        "Do not prefix the debit line with To. Example: Rent A/c Dr. ₹5,000.",
      ],
    },
    {
      type: "concept-explanation",
      id: "how-to-write-credit-line",
      eyebrow: "Credit line",
      title: "How to write the credit line",
      paragraphs: [
        "The credited account is written below the debit line.",
        "Prefix it with To in the standard school-learning format used by AccyWise AI.",
        "Enter its amount in the Credit column.",
        "Do not add Dr. to the credited account. Example: To Bank A/c ₹5,000.",
        "To is a presentation convention. It does not change the account name itself.",
      ],
    },
    {
      type: "concept-explanation",
      id: "debit-credit-totals",
      eyebrow: "Totals",
      title: "Debit and credit totals",
      paragraphs: [
        "Total debit must equal total credit.",
        "A simple entry may contain one debit and one credit.",
        "A compound entry may contain more than one debit or credit line.",
        "Even in a compound entry, total debit must equal total credit. Detailed compound-entry practice will come later.",
      ],
    },
    {
      type: "comparison",
      id: "narration-examples",
      eyebrow: "Narration",
      title: "How to write a clear narration",
      intro:
        "Narration is a short explanation below the entry. It usually begins with Being and is not a separate account line.",
      groups: [
        {
          title: "Good narration",
          items: [
            "Being rent paid by bank.",
            "Being goods purchased for cash.",
            "Being goods sold on credit to Riya.",
            "Being capital introduced by Amit through bank.",
          ],
        },
        {
          title: "Weak narration",
          items: [
            "Being transaction done.",
            "Being payment made.",
            "Being entry passed.",
            "These are weak because they are too vague and do not clearly describe the transaction.",
          ],
        },
        {
          title: "Narration reminders",
          items: [
            "Narration should not introduce a different accounting meaning.",
            "Narration should not contain debit or credit amounts unless a specific format requires it.",
            "Narration is written below the journal entry, not as another account line.",
          ],
        },
      ],
    },
    {
      type: "process-steps",
      id: "journal-presentation-process",
      eyebrow: "Presentation process",
      title: "Date, Dr., To, amounts, narration, totals",
      body:
        "Use this order after account identification, classification, and debit-credit treatment are already clear.",
      steps: [
        { label: "Write the transaction date", detail: "Use the date format your class or school requires." },
        { label: "Write the account to be debited", detail: "The debit account appears first in Particulars." },
        { label: "Add Dr. after the debit account", detail: "Dr. marks the account being debited." },
        { label: "Enter the debit amount", detail: "Put this amount in the Debit column." },
        { label: "Write the credited account next", detail: "The credited account appears on the next line." },
        { label: "Prefix the credited account with To", detail: "To shows the credited account in school journal format." },
        { label: "Enter the credit amount", detail: "Put this amount in the Credit column." },
        { label: "Write a concise narration", detail: "Explain the transaction below the account lines." },
        { label: "Check Debit equals Credit", detail: "Total debit must equal total credit." },
        { label: "Review details", detail: "Check spelling, account names, Cash/Bank treatment, and named accounts." },
      ],
    },
    {
      type: "solved-illustration",
      id: "journal-format-cash-purchase",
      illustration: {
        id: "journal-format-cash-purchase",
        title: "Solved Illustration 1: cash purchase",
        difficulty: "easy",
        question: "Bought goods for cash ₹10,000.",
        accountsAffected: ["Purchases A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Debit line first", detail: "Purchases A/c is written first with Dr." },
          { label: "Credit line with To", detail: "Cash A/c is written below with To." },
          { label: "Amount columns", detail: "₹10,000 appears in the Debit column for Purchases and Credit column for Cash." },
          { label: "Narration below", detail: "Narration is written below the entry." },
        ],
        journalEntry: [
          { id: "journal-format-purchases-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "journal-format-cash-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased for cash.",
        explanation:
          "The debit line, credit line, amount columns, and narration together make the entry complete.",
        studentTakeaway: "Write the debit account first, then the To line, then narration below.",
        commonMistake: "Writing only account names without Dr., To, amounts, or narration.",
      },
    },
    {
      type: "solved-illustration",
      id: "journal-format-salary-by-bank",
      illustration: {
        id: "journal-format-salary-by-bank",
        title: "Solved Illustration 2: expense paid by bank",
        difficulty: "easy",
        question: "Paid salary by bank ₹8,000.",
        accountsAffected: ["Salary A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Debit account", detail: "Salary A/c is written with Dr. because salary expense is debited." },
          { label: "Credit account", detail: "Bank A/c is written with To because payment is through bank." },
          { label: "Cash not used", detail: "Cash A/c must not be used because the question says bank." },
          { label: "L.F. optional now", detail: "L.F. may remain blank before ledger posting." },
        ],
        journalEntry: [
          { id: "journal-format-salary-debit", account: "Salary A/c", side: "debit", amount: 8000, drNotation: "Dr." },
          { id: "journal-format-bank-credit", account: "Bank A/c", side: "credit", amount: 8000, displayPrefix: "To" },
        ],
        narration: "Being salary paid by bank.",
        explanation:
          "The presentation clearly shows Salary A/c as the debit line and Bank A/c as the credited account.",
        studentTakeaway: "Use Bank A/c when the payment mode is bank.",
        commonMistake: "Using Cash A/c even though the transaction states bank.",
      },
    },
    {
      type: "solved-illustration",
      id: "journal-format-credit-sale-riya",
      illustration: {
        id: "journal-format-credit-sale-riya",
        title: "Solved Illustration 3: credit sale",
        difficulty: "easy",
        question: "Sold goods on credit to Riya ₹12,000.",
        accountsAffected: ["Riya A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Named debtor", detail: "Riya A/c is written because the sale is on credit to Riya." },
          { label: "Credit line", detail: "Sales A/c is written with To on the credit line." },
          { label: "No cash or bank", detail: "Cash A/c and Bank A/c are not used in a credit sale." },
          { label: "Clear narration", detail: "Narration states that goods were sold on credit to Riya." },
        ],
        journalEntry: [
          { id: "journal-format-riya-debit", account: "Riya A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "journal-format-sales-credit", account: "Sales A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Riya.",
        explanation:
          "The entry uses the named debtor account, correct credit line, and clear narration.",
        studentTakeaway: "For credit sales, use the customer's name instead of Cash or Bank.",
        commonMistake: "Using Cash A/c or Bank A/c for a credit transaction.",
      },
    },
    {
      type: "solved-illustration",
      id: "journal-format-amit-capital-bank",
      illustration: {
        id: "journal-format-amit-capital-bank",
        title: "Solved Illustration 4: named capital",
        difficulty: "easy",
        question: "Amit introduced capital of ₹50,000 through bank.",
        accountsAffected: ["Bank A/c", "Amit's Capital A/c"],
        reasoningSteps: [
          { label: "Bank debit", detail: "Bank A/c is written first with Dr. because bank increases." },
          { label: "Named capital credit", detail: "Amit's Capital A/c is written below with To." },
          { label: "No generic capital", detail: "Use Amit's Capital A/c, not generic Capital A/c." },
          { label: "Narration", detail: "Narration names Amit and the bank mode." },
        ],
        journalEntry: [
          { id: "journal-format-bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          {
            id: "journal-format-amit-capital-credit",
            account: "Amit's Capital A/c",
            side: "credit",
            amount: 50000,
            displayPrefix: "To",
          },
        ],
        narration: "Being capital introduced by Amit through bank.",
        explanation:
          "The entry keeps the named capital account and presents the debit and credit amounts in the correct columns.",
        studentTakeaway: "When a person is named, keep the named capital account in the journal.",
        commonMistake: "Writing generic Capital A/c when Amit is named.",
      },
    },
    {
      type: "comparison",
      id: "simple-versus-compound-entry",
      eyebrow: "Simple versus compound entry",
      title: "One debit/credit pair or multiple lines",
      intro:
        "This is only a formatting introduction. Detailed compound-entry practice will come later.",
      groups: [
        {
          title: "Simple entry",
          items: [
            "One debit and one credit.",
            "Example: Rent A/c Dr.",
            "To Bank A/c",
          ],
        },
        {
          title: "Compound entry",
          items: [
            "More than one debit or credit line, while totals remain equal.",
            "Salary A/c Dr. ₹5,000",
            "Rent A/c Dr. ₹3,000",
            "To Bank A/c ₹8,000",
            "Narration: Being salary and rent paid by bank.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "correct-versus-incorrect-presentation",
      eyebrow: "Presentation check",
      title: "Correct versus incorrect presentation",
      intro:
        "Look at the missing pieces, not only the visual style. The correct version is understandable even without colour.",
      groups: [
        {
          title: "Incorrect",
          items: [
            "Rent A/c",
            "Bank A/c Cr.",
            "₹5,000",
            "Problems: missing Dr., missing To, unclear amount placement, and no narration.",
          ],
        },
        {
          title: "Correct",
          items: [
            "Rent A/c Dr. ₹5,000",
            "To Bank A/c ₹5,000",
            "Being rent paid by bank.",
          ],
        },
      ],
    },
    {
      type: "common-mistakes",
      id: "journal-format-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these presentation mistakes",
      mistakes: [
        "Forgetting Dr.",
        "Forgetting To.",
        "Adding To before the debit account.",
        "Adding Dr. to the credited account.",
        "Entering the amount in the wrong column.",
        "Writing only the amounts without particulars.",
        "Writing only account names without amounts.",
        "Using Cash instead of Bank.",
        "Using Bank instead of Cash.",
        "Omitting a named debtor, creditor, proprietor, or partner.",
        "Writing generic Capital A/c when a person is named.",
        "Writing vague narration.",
        "Entering unequal debit and credit totals.",
        "Treating narration as another account line.",
        "Filling L.F. with an amount.",
      ],
    },
    {
      type: "recap",
      id: "journal-format-presentation-checklist",
      title: "Presentation checklist",
      points: [
        "Date is present where required.",
        "Debit account is written first.",
        "Dr. is present.",
        "Credited account has To.",
        "Account names are specific.",
        "Debit amount is in the debit column.",
        "Credit amount is in the credit column.",
        "Narration is clear.",
        "L.F. is used correctly or left blank.",
        "Debit total equals credit total.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "paid-office-rent-by-bank-practice",
      question: paidOfficeRentByBankPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "journal-format-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Can another student understand the transaction only by reading your journal entry and narration?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const cashAndBankTransactionsJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...cashAndBankTransactionsSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG}`,
  shortDescription:
    "Learn how to separate Cash A/c from Bank A/c, record receipts and payments, and avoid Cash/Bank mistakes in credit transactions.",
  learningObjective:
    "Students learn to identify the payment mode, decide whether Cash A/c or Bank A/c is affected, identify the other account, and apply debit-credit rules safely.",
  progressLabel: "Section 7 of 16",
  previousSection: journalFormatAndNarrationSubtopicReference,
  nextSection: capitalSubtopicReference,
  practiceQuestionIds: [depositedCashIntoBankPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "cash-and-bank-transactions",
      eyebrow: "Learning objective",
      title: "Cash and Bank Transactions",
      body:
        "By the end of this section, you should be able to tell whether Cash A/c or Bank A/c is affected, record simple cash and bank transactions, and avoid using Cash or Bank when the transaction is on credit.",
    },
    {
      type: "concept-explanation",
      id: "cash-bank-central-rule",
      eyebrow: "Core rule",
      title: "Start with the payment mode",
      paragraphs: [
        "Use this order: identify the payment mode, decide whether Cash A/c or Bank A/c is affected, identify the other account, then apply debit and credit rules.",
        "Cash A/c and Bank A/c are both asset accounts, but they are separate accounts. The exact payment mode in the transaction matters.",
        "If money is received in cash, Cash A/c is usually debited. If money is received through bank, Bank A/c is usually debited.",
        "If money is paid in cash, Cash A/c is usually credited. If money is paid through bank, Bank A/c is usually credited.",
      ],
    },
    {
      type: "comparison",
      id: "cash-account-and-bank-account",
      eyebrow: "Cash A/c and Bank A/c",
      title: "Two separate asset accounts",
      intro:
        "Both represent business money, but they are not interchangeable. Read the wording before choosing the account.",
      groups: [
        {
          title: "Cash A/c",
          items: [
            "Represents physical cash held by the business.",
            "Common wording: for cash.",
            "Common wording: paid cash.",
            "Common wording: received cash.",
            "Common wording: cash sales or cash purchase.",
          ],
        },
        {
          title: "Bank A/c",
          items: [
            "Represents money held in the business bank account.",
            "Common wording: by bank or through bank.",
            "Common wording: cheque, UPI, NEFT, RTGS, or online transfer.",
            "Debit card means Bank A/c only when it is clearly linked to the business bank account.",
            "Do not assume every card transaction is automatically Bank A/c.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "cash-receipt-and-cash-payment",
      eyebrow: "Cash transactions",
      title: "Cash receipt and cash payment",
      intro:
        "Cash A/c is affected only when physical cash comes into or leaves the business.",
      groups: [
        {
          title: "Cash receipt",
          items: [
            "Physical cash comes into the business.",
            "Cash A/c increases.",
            "Cash A/c is debited.",
            "Examples: cash sale, capital introduced in cash, commission received in cash, loan received in cash.",
          ],
        },
        {
          title: "Cash payment",
          items: [
            "Physical cash leaves the business.",
            "Cash A/c decreases.",
            "Cash A/c is credited.",
            "Examples: cash purchase, rent paid in cash, furniture bought for cash, cash withdrawn for personal use.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "bank-receipt-and-bank-payment",
      eyebrow: "Bank transactions",
      title: "Bank receipt and bank payment",
      intro:
        "Bank A/c is affected when money enters or leaves the business bank account.",
      groups: [
        {
          title: "Bank receipt",
          items: [
            "Money enters the business bank account.",
            "Bank A/c increases.",
            "Bank A/c is debited.",
            "Examples: sale proceeds received through bank, capital introduced through bank, loan received in bank, commission received through bank.",
          ],
        },
        {
          title: "Bank payment",
          items: [
            "Money leaves the business bank account.",
            "Bank A/c decreases.",
            "Bank A/c is credited.",
            "Examples: salary paid by bank, rent paid by cheque, furniture purchased through bank, creditor paid by bank.",
          ],
        },
      ],
    },
    {
      type: "clue-guide",
      id: "payment-mode-clue-guide",
      eyebrow: "Payment-mode clue guide",
      title: "Words that point to Cash A/c or Bank A/c",
      body:
        "This is an educational guide, not a broad parser specification. Use it to slow down and read the payment mode.",
      clues: [
        { clue: "for cash", likelyAccounts: ["Cash A/c"], note: "Cash is physically paid or received." },
        { clue: "paid cash", likelyAccounts: ["Cash A/c"], note: "Cash A/c is usually credited because cash leaves." },
        { clue: "received cash", likelyAccounts: ["Cash A/c"], note: "Cash A/c is usually debited because cash comes in." },
        { clue: "by bank", likelyAccounts: ["Bank A/c"], note: "The business bank account is involved." },
        { clue: "through bank", likelyAccounts: ["Bank A/c"], note: "The business bank account is involved." },
        { clue: "by cheque", likelyAccounts: ["Bank A/c"], note: "Cheque payment normally affects Bank A/c." },
        { clue: "through UPI", likelyAccounts: ["Bank A/c"], note: "Treat as Bank A/c when it is a direct business-bank receipt or payment." },
        { clue: "through NEFT/RTGS", likelyAccounts: ["Bank A/c"], note: "Bank transfer wording points to Bank A/c." },
        { clue: "on credit", likelyAccounts: ["Customer/Supplier A/c"], note: "Normally no Cash A/c or Bank A/c is affected at that moment." },
        { clue: "deposited cash into bank", likelyAccounts: ["Bank A/c", "Cash A/c"], note: "Bank increases and Cash decreases." },
        { clue: "withdrew cash from bank for office use", likelyAccounts: ["Cash A/c", "Bank A/c"], note: "This is a business cash-bank transfer." },
        { clue: "withdrew for personal use", likelyAccounts: ["Drawings A/c", "Cash/Bank A/c"], note: "Personal-use wording changes the treatment to drawings." },
      ],
    },
    {
      type: "solved-illustration",
      id: "cash-bank-cash-deposited-into-bank",
      illustration: {
        id: "cash-bank-cash-deposited-into-bank",
        title: "Concept example: cash deposited into bank",
        difficulty: "easy",
        question: "Deposited cash into bank ₹15,000.",
        accountsAffected: ["Bank A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Bank increases", detail: "Money moves into the business bank account, so Bank A/c is debited." },
          { label: "Cash decreases", detail: "Physical cash leaves the cash box, so Cash A/c is credited." },
          { label: "No income or expense", detail: "Value moves from one business asset account to another." },
          { label: "Cash-book link", detail: "This is commonly treated as a contra transaction in cash-book learning later." },
        ],
        journalEntry: [
          { id: "cash-bank-deposit-bank-debit", account: "Bank A/c", side: "debit", amount: 15000, drNotation: "Dr." },
          { id: "cash-bank-deposit-cash-credit", account: "Cash A/c", side: "credit", amount: 15000, displayPrefix: "To" },
        ],
        narration: "Being cash deposited into bank.",
        explanation:
          "Bank A/c is debited because bank balance increases. Cash A/c is credited because cash balance decreases.",
        studentTakeaway: "A cash deposit into bank is an internal asset transfer, not income.",
        commonMistake: "Treating cash deposited into bank as income earned by the business.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-business-withdrawal-office-use",
      illustration: {
        id: "cash-bank-business-withdrawal-office-use",
        title: "Concept example: cash withdrawn for business use",
        difficulty: "easy",
        question: "Cash withdrawn from bank ₹3,000 for office use.",
        accountsAffected: ["Cash A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Cash increases", detail: "Cash comes into the office cash balance, so Cash A/c is debited." },
          { label: "Bank decreases", detail: "Money leaves the bank account, so Bank A/c is credited." },
          { label: "Business use", detail: "This is not drawings because the cash remains for business use." },
          { label: "No income or expense", detail: "The value stays inside the business." },
        ],
        journalEntry: [
          { id: "cash-bank-office-cash-debit", account: "Cash A/c", side: "debit", amount: 3000, drNotation: "Dr." },
          { id: "cash-bank-office-bank-credit", account: "Bank A/c", side: "credit", amount: 3000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn from bank for office use.",
        explanation:
          "Cash A/c is debited because cash increases for office use. Bank A/c is credited because bank balance decreases.",
        studentTakeaway: "Office-use or business-use wording means it is a business transfer, not drawings.",
        commonMistake: "Treating every bank withdrawal as drawings.",
      },
    },
    {
      type: "comparison",
      id: "business-withdrawal-versus-drawings",
      eyebrow: "Business use versus personal use",
      title: "The purpose of withdrawal changes the entry",
      intro:
        "The words office use, business use, or personal use change the accounting treatment.",
      groups: [
        {
          title: "Business use",
          items: [
            "Cash withdrawn from bank ₹3,000 for office use.",
            "Entry: Cash A/c Dr.",
            "To Bank A/c.",
            "Reason: the value remains inside the business.",
            "This business withdrawal is not drawings.",
          ],
        },
        {
          title: "Personal use",
          items: [
            "Amit withdrew ₹3,000 from bank for personal use.",
            "Entry: Amit Drawings A/c Dr.",
            "To Bank A/c.",
            "Reason: the partner or owner takes value out of the business.",
            "This personal withdrawal is not a business cash-bank transfer.",
          ],
        },
      ],
    },
    {
      type: "solved-illustration",
      id: "cash-bank-cash-purchase",
      illustration: {
        id: "cash-bank-cash-purchase",
        title: "Worked Example 1: cash purchase",
        difficulty: "easy",
        question: "Bought goods for cash ₹10,000.",
        accountsAffected: ["Purchases A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Goods for resale", detail: "Goods bought for resale use Purchases A/c." },
          { label: "Cash leaves", detail: "Payment mode is cash, so Cash A/c is credited." },
          { label: "Bank not affected", detail: "Bank A/c is not used because the question says cash." },
        ],
        journalEntry: [
          { id: "cash-bank-purchases-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "cash-bank-cash-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased for cash.",
        explanation:
          "Purchases A/c is debited because goods are bought for resale. Cash A/c is credited because cash leaves the business.",
        studentTakeaway: "Use Purchases A/c for goods for resale, and use Cash A/c when payment is in cash.",
        commonMistake: "Using Bank A/c even though the transaction says cash.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-rent-paid-by-bank",
      illustration: {
        id: "cash-bank-rent-paid-by-bank",
        title: "Worked Example 2: bank expense",
        difficulty: "easy",
        question: "Paid rent by bank ₹5,000.",
        accountsAffected: ["Rent A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Rent is expense", detail: "Rent A/c is debited because rent expense increases." },
          { label: "Payment mode is bank", detail: "Bank A/c is credited because money leaves the bank account." },
          { label: "Cash not used", detail: "Cash A/c is not used because the transaction says by bank." },
        ],
        journalEntry: [
          { id: "cash-bank-rent-debit", account: "Rent A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "cash-bank-rent-bank-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being rent paid by bank.",
        explanation:
          "Rent is an expense and is debited. Bank A/c is credited because payment is made through bank.",
        studentTakeaway: "Use Bank A/c, not Cash A/c, when the expense is paid by bank.",
        commonMistake: "Using Cash A/c for a bank payment.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-cash-sale",
      illustration: {
        id: "cash-bank-cash-sale",
        title: "Worked Example 3: cash sale",
        difficulty: "easy",
        question: "Sold goods for cash ₹12,000.",
        accountsAffected: ["Cash A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Cash received", detail: "Cash comes into the business, so Cash A/c is debited." },
          { label: "Sales income", detail: "Sales income increases, so Sales A/c is credited." },
          { label: "Totals equal", detail: "The same amount appears on debit and credit sides." },
        ],
        journalEntry: [
          { id: "cash-bank-sale-cash-debit", account: "Cash A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "cash-bank-sale-sales-credit", account: "Sales A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being goods sold for cash.",
        explanation:
          "Cash A/c is debited because cash is received. Sales A/c is credited because income increases.",
        studentTakeaway: "In a cash sale, Cash A/c is debited and Sales A/c is credited.",
        commonMistake: "Crediting Cash because the word cash appears.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-commission-through-bank",
      illustration: {
        id: "cash-bank-commission-through-bank",
        title: "Worked Example 4: income through bank",
        difficulty: "easy",
        question: "Received commission through bank ₹7,000.",
        accountsAffected: ["Bank A/c", "Commission Received A/c"],
        reasoningSteps: [
          { label: "Bank increases", detail: "Money enters the business bank account, so Bank A/c is debited." },
          { label: "Income increases", detail: "Commission Received is income, so it is credited." },
          { label: "Cash not used", detail: "Cash A/c is not used because money is received through bank." },
        ],
        journalEntry: [
          { id: "cash-bank-commission-bank-debit", account: "Bank A/c", side: "debit", amount: 7000, drNotation: "Dr." },
          {
            id: "cash-bank-commission-credit",
            account: "Commission Received A/c",
            side: "credit",
            amount: 7000,
            displayPrefix: "To",
          },
        ],
        narration: "Being commission received through bank.",
        explanation:
          "Bank A/c is debited because bank balance increases. Commission Received A/c is credited because income increases.",
        studentTakeaway: "Income received through bank increases Bank A/c and credits the income account.",
        commonMistake: "Using Cash A/c when the question says through bank.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-deposit-worked-example",
      illustration: {
        id: "cash-bank-deposit-worked-example",
        title: "Worked Example 5: cash deposited into bank",
        difficulty: "easy",
        question: "Deposited cash into bank ₹15,000.",
        accountsAffected: ["Bank A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Bank increases", detail: "Bank A/c is debited." },
          { label: "Cash decreases", detail: "Cash A/c is credited." },
          { label: "Asset transfer", detail: "Both accounts are assets. One increases and the other decreases." },
          { label: "No income or expense", detail: "No income or expense arises." },
        ],
        journalEntry: [
          { id: "cash-bank-deposit-worked-bank-debit", account: "Bank A/c", side: "debit", amount: 15000, drNotation: "Dr." },
          { id: "cash-bank-deposit-worked-cash-credit", account: "Cash A/c", side: "credit", amount: 15000, displayPrefix: "To" },
        ],
        narration: "Being cash deposited into bank.",
        explanation:
          "The same business value moves from Cash A/c to Bank A/c, so no income or expense is recorded.",
        studentTakeaway: "Depositing cash into bank changes asset form only.",
        commonMistake: "Crediting Sales or income for a bank deposit.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-office-withdrawal-worked-example",
      illustration: {
        id: "cash-bank-office-withdrawal-worked-example",
        title: "Worked Example 6: cash withdrawn for office use",
        difficulty: "easy",
        question: "Cash withdrawn from bank ₹3,000 for office use.",
        accountsAffected: ["Cash A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Cash increases", detail: "Cash A/c is debited." },
          { label: "Bank decreases", detail: "Bank A/c is credited." },
          { label: "Business use", detail: "This is a business transfer." },
          { label: "Not drawings", detail: "It is not drawings because the cash remains for office use." },
        ],
        journalEntry: [
          { id: "cash-bank-office-worked-cash-debit", account: "Cash A/c", side: "debit", amount: 3000, drNotation: "Dr." },
          { id: "cash-bank-office-worked-bank-credit", account: "Bank A/c", side: "credit", amount: 3000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn from bank for office use.",
        explanation:
          "The cash is still for business use, so Cash A/c is debited and Bank A/c is credited.",
        studentTakeaway: "Business cash withdrawal is not drawings.",
        commonMistake: "Debiting Drawings A/c when the transaction says office use.",
      },
    },
    {
      type: "solved-illustration",
      id: "cash-bank-personal-bank-withdrawal",
      illustration: {
        id: "cash-bank-personal-bank-withdrawal",
        title: "Worked Example 7: personal bank withdrawal",
        difficulty: "easy",
        question: "Riya withdrew ₹4,000 from bank for personal use.",
        accountsAffected: ["Riya Drawings A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Personal use", detail: "Personal-use wording creates drawings." },
          { label: "Drawings increases", detail: "Riya Drawings A/c is debited." },
          { label: "Bank decreases", detail: "Bank A/c is credited because money leaves the bank account." },
          { label: "Cash not debited", detail: "Cash A/c is not debited merely because the word withdrawn appears." },
        ],
        journalEntry: [
          { id: "cash-bank-riya-drawings-debit", account: "Riya Drawings A/c", side: "debit", amount: 4000, drNotation: "Dr." },
          { id: "cash-bank-riya-bank-credit", account: "Bank A/c", side: "credit", amount: 4000, displayPrefix: "To" },
        ],
        narration: "Being amount withdrawn by Riya from bank for personal use.",
        explanation:
          "Riya Drawings A/c is debited because Riya takes value out of the business. Bank A/c is credited because bank balance decreases.",
        studentTakeaway: "Personal-use bank withdrawal is drawings, not a normal business cash withdrawal.",
        commonMistake: "Debiting Cash A/c just because the word withdrawn appears.",
      },
    },
    {
      type: "comparison",
      id: "credit-transaction-warning",
      eyebrow: "Credit transaction warning",
      title: "Do not use Cash or Bank for credit transactions",
      intro:
        "Cash A/c or Bank A/c appears only when money is actually paid or received.",
      groups: [
        {
          title: "Credit purchase",
          items: [
            "Bought goods on credit from Mohan ₹10,000.",
            "Entry: Purchases A/c Dr. ₹10,000.",
            "To Mohan A/c ₹10,000.",
            "Cash A/c and Bank A/c are not affected at the time of purchase.",
          ],
        },
        {
          title: "Credit sale",
          items: [
            "Sold goods on credit to Riya ₹8,000.",
            "Entry: Riya A/c Dr. ₹8,000.",
            "To Sales A/c ₹8,000.",
            "Cash A/c and Bank A/c are not affected at the time of sale.",
          ],
        },
      ],
    },
    {
      type: "process-steps",
      id: "cash-bank-decision-process",
      eyebrow: "Decision process",
      title: "Cash-versus-bank decision process",
      body:
        "Use this process before writing the journal entry.",
      steps: [
        { label: "Read the payment-mode wording", detail: "Look for cash, bank, cheque, UPI, NEFT, RTGS, credit, deposit, or withdrawal clues." },
        { label: "Choose Cash or Bank", detail: "Decide whether physical cash or the business bank account is involved." },
        { label: "Identify the money movement", detail: "Decide whether money is received, paid, deposited, or withdrawn." },
        { label: "Identify the other account", detail: "Name the other affected account, such as Purchases, Sales, Rent, Commission, or Drawings." },
        { label: "Decide increase or decrease", detail: "Ask what happens to each account." },
        { label: "Apply debit and credit rules", detail: "Debit asset increases and credit asset decreases; apply rules to the other account too." },
        { label: "Check business or personal use", detail: "Office use and business use differ from personal use." },
        { label: "Avoid Cash/Bank for credit", detail: "Do not use Cash A/c or Bank A/c for a credit transaction unless money is paid or received." },
        { label: "Write the journal entry", detail: "Use Dr. for the debit line and To for the credit line." },
        { label: "Confirm Debit equals Credit", detail: "Total debit must equal total credit." },
      ],
    },
    {
      type: "common-mistakes",
      id: "cash-bank-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Cash and Bank mistakes",
      mistakes: [
        "Using Cash A/c when payment is through bank.",
        "Using Bank A/c when payment is in cash.",
        "Using Cash A/c or Bank A/c for a credit transaction.",
        "Treating cash deposited into bank as income.",
        "Treating cash withdrawn from bank for office use as drawings.",
        "Treating personal withdrawal as an ordinary cash-bank transfer.",
        "Ignoring cheque, UPI, NEFT, or RTGS wording.",
        "Using Purchases A/c for an asset purchase.",
        "Entering the correct accounts on the wrong sides.",
        "Forgetting named Drawings A/c for personal withdrawals.",
      ],
    },
    {
      type: "recap",
      id: "cash-bank-checklist",
      title: "Display-only checklist",
      points: [
        "Cash A/c means physical cash held by the business.",
        "Bank A/c means the business bank account.",
        "Cash receipt debits Cash A/c.",
        "Cash payment credits Cash A/c.",
        "Bank receipt debits Bank A/c.",
        "Bank payment credits Bank A/c.",
        "Cash deposited into bank is not income.",
        "Cash withdrawn for office use is not drawings.",
        "Personal withdrawal uses Drawings A/c.",
        "Credit transactions normally do not use Cash A/c or Bank A/c at that moment.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "deposited-cash-into-bank-practice",
      question: depositedCashIntoBankPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "cash-bank-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Where did the money move—from cash, from bank, into cash, into bank, or outside the business?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const capitalJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...capitalSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG}`,
  shortDescription:
    "Learn what capital means, why Capital A/c is credited, and how named and multi-partner capital entries are recorded.",
  learningObjective:
    "Students learn capital as the owner's or partner's claim, record cash and bank capital, preserve named Capital A/c, and keep two-partner entries balanced.",
  progressLabel: "Section 8 of 16",
  previousSection: cashAndBankTransactionsSubtopicReference,
  nextSection: drawingsSubtopicReference,
  practiceQuestionIds: [startedBusinessWithCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "capital",
      eyebrow: "Learning objective",
      title: "Capital",
      body:
        "By the end of this section, you should be able to record capital introduced by cash or bank, preserve named Capital A/c, record two partners separately, and understand the Balance Sheet impact.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-capital",
      eyebrow: "Concept explanation",
      title: "What capital means",
      paragraphs: [
        "Capital is the amount or value introduced by the owner or partners into the business.",
        "Capital represents the owner's or partners' claim against the business.",
        "Capital is not business income. It is not sales revenue, and it is not a loan from an outsider.",
        "Capital may be introduced when the business starts or later as additional capital.",
        "Cash A/c or Bank A/c records the asset received. Capital A/c records the owner's or partner's claim.",
      ],
    },
    {
      type: "concept-explanation",
      id: "business-entity-concept-for-capital",
      eyebrow: "Business entity concept",
      title: "The business and owner are treated separately",
      paragraphs: [
        "For accounting, the business and its owner are treated as separate.",
        "When Amit introduces money, the business receives an asset.",
        "At the same time, the business recognises Amit's claim through Amit's Capital A/c.",
        "From the business's point of view, the owner gives value to the business.",
        "This is why the asset account is debited and the named Capital A/c is credited.",
      ],
    },
    {
      type: "comparison",
      id: "capital-accounting-equation-impact",
      eyebrow: "Accounting equation",
      title: "Capital keeps the accounting equation balanced",
      intro:
        "Assets = Capital + Liabilities. When capital is introduced, an asset increases and capital also increases.",
      groups: [
        {
          title: "Before Amit introduces cash",
          items: [
            "Assets: ₹0.",
            "Capital: ₹0.",
            "Liabilities: ₹0.",
          ],
        },
        {
          title: "After Amit introduces cash ₹50,000",
          items: [
            "Cash: ₹50,000.",
            "Amit's Capital: ₹50,000.",
            "Asset increases and capital increases, so the equation remains balanced.",
          ],
        },
        {
          title: "Final accounts impact",
          items: [
            "No income is earned.",
            "No expense is incurred.",
            "No direct Profit & Loss impact arises.",
            "The Balance Sheet is affected.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "capital-introduced-in-cash-format",
      eyebrow: "Capital introduced in cash",
      title: "Use Cash A/c when physical cash is introduced",
      paragraphs: [
        "Transaction: Amit introduced cash ₹50,000 as capital.",
        "Cash asset increases, so Cash A/c is debited. Amit's Capital increases, so Amit's Capital A/c is credited.",
        "Use Cash A/c because physical cash is introduced. Do not use Bank A/c, and do not use generic Capital A/c when Amit is named.",
      ],
      formatRows: [
        { id: "capital-cash-debit", particulars: "Cash A/c Dr.", lf: "", debitDisplay: "50,000" },
        { id: "capital-cash-credit", particulars: "To Amit's Capital A/c", lf: "", creditDisplay: "50,000" },
        { id: "capital-cash-narration", particulars: "(Being cash introduced by Amit as capital.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "started-business-with-cash-practice",
      question: startedBusinessWithCashPracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "capital-introduced-through-bank-format",
      eyebrow: "Capital introduced through bank",
      title: "Use Bank A/c when money enters the business bank",
      paragraphs: [
        "Transaction: Priyanka introduced capital of ₹60,000 through bank.",
        "Bank asset increases, so Bank A/c is debited. Priyanka's Capital increases, so Priyanka's Capital A/c is credited.",
        "Use Bank A/c because the money enters the business bank account. Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "capital-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "60,000" },
        { id: "capital-bank-credit", particulars: "To Priyanka's Capital A/c", lf: "", creditDisplay: "60,000" },
        { id: "capital-bank-narration", particulars: "(Being capital introduced by Priyanka through bank.)" },
      ],
    },
    {
      type: "comparison",
      id: "named-capital-accounts",
      eyebrow: "Named Capital A/c",
      title: "Use the person's Capital A/c when a name is given",
      intro:
        "Named Capital A/c is especially important in Partnership Accounts, where every partner has a separate capital account.",
      groups: [
        {
          title: "Use named accounts",
          items: [
            "Amit's Capital A/c.",
            "Priyanka's Capital A/c.",
            "Kuldeep's Capital A/c.",
            "Riya's Capital A/c.",
          ],
        },
        {
          title: "Avoid generic wording",
          items: [
            "Do not write only Capital A/c when the transaction gives a name.",
            "The name tells whose claim against the business increased.",
            "Separate names become essential when two or more partners contribute capital.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "two-partners-cash-capital-format",
      eyebrow: "Two partners",
      title: "Two partners introduce cash capital",
      paragraphs: [
        "Transaction: A and B started their partnership with ₹50,000 and ₹70,000 in cash as capital.",
        "Cash receives the combined ₹1,20,000. A and B retain separate Capital A/c balances.",
        "Each partner's contribution must be credited separately, and the debit total must equal the combined capital credits.",
      ],
      formatRows: [
        { id: "two-partner-cash-debit", particulars: "Cash A/c Dr.", lf: "", debitDisplay: "1,20,000" },
        { id: "two-partner-a-credit", particulars: "To A's Capital A/c", lf: "", creditDisplay: "50,000" },
        { id: "two-partner-b-credit", particulars: "To B's Capital A/c", lf: "", creditDisplay: "70,000" },
        { id: "two-partner-cash-narration", particulars: "(Being cash capital introduced by A and B.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "two-partners-bank-capital-format",
      eyebrow: "Two partners",
      title: "Two partners introduce capital through bank",
      paragraphs: [
        "Transaction: Amit and Riya introduced ₹40,000 and ₹60,000 through bank as capital.",
        "Bank A/c is debited with the combined ₹1,00,000. Amit's Capital A/c and Riya's Capital A/c are credited separately.",
        "Do not combine the two partners into one generic Capital A/c.",
      ],
      formatRows: [
        { id: "two-partner-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "1,00,000" },
        { id: "two-partner-amit-credit", particulars: "To Amit's Capital A/c", lf: "", creditDisplay: "40,000" },
        { id: "two-partner-riya-credit", particulars: "To Riya's Capital A/c", lf: "", creditDisplay: "60,000" },
        { id: "two-partner-bank-narration", particulars: "(Being capital introduced by Amit and Riya through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "additional-capital-format",
      eyebrow: "Additional capital",
      title: "Additional capital follows the same logic",
      paragraphs: [
        "Capital may be introduced after the business has already started.",
        "Additional capital follows the same debit-credit logic. It is not income merely because the business receives more money.",
        "Transaction: Kuldeep introduced additional capital of ₹25,000 through bank.",
      ],
      formatRows: [
        { id: "additional-capital-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "25,000" },
        { id: "additional-capital-kuldeep-credit", particulars: "To Kuldeep's Capital A/c", lf: "", creditDisplay: "25,000" },
        { id: "additional-capital-narration", particulars: "(Being additional capital introduced by Kuldeep through bank.)" },
      ],
    },
    {
      type: "comparison",
      id: "capital-versus-similar-receipts",
      eyebrow: "Capital versus similar receipts",
      title: "Money received can have different accounting nature",
      intro:
        "Capital, loan, and income can all bring money into the business, but their accounting meaning is different.",
      groups: [
        {
          title: "Capital",
          items: [
            "Source: owner or partner.",
            "Effect: Capital / Equity increases.",
            "Example entry: Bank A/c Dr.",
            "To Amit's Capital A/c.",
          ],
        },
        {
          title: "Loan",
          items: [
            "Source: outsider, bank, or lender.",
            "Effect: Liability increases.",
            "Example entry: Bank A/c Dr.",
            "To Bank Loan A/c.",
          ],
        },
        {
          title: "Sales or income",
          items: [
            "Source: normal business operations.",
            "Effect: Income increases.",
            "Example entry: Cash/Bank A/c Dr.",
            "To Sales/Income A/c.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "capital-versus-revenue",
      eyebrow: "Capital versus revenue",
      title: "Capital is not income",
      intro:
        "Do not treat capital as profit just because money comes into the business.",
      groups: [
        {
          title: "Capital receipt",
          items: [
            "Comes from the owner or partner.",
            "Increases the owner's or partner's claim.",
            "Does not arise from normal sales or services.",
            "Does not directly increase profit.",
          ],
        },
        {
          title: "Revenue receipt",
          items: [
            "Arises from business operations.",
            "Is recorded as income.",
            "May affect Profit & Loss.",
            "Examples include sales or commission received.",
          ],
        },
      ],
    },
    {
      type: "concept-explanation",
      id: "non-cash-capital-design-note",
      eyebrow: "Later / design-needed",
      title: "Capital introduced in a non-cash form",
      paragraphs: [
        "Sometimes an owner may introduce an asset, such as furniture or machinery, as capital.",
        "This requires identifying the asset received, valuing it correctly, and crediting the named Capital A/c.",
        "Detailed non-cash capital entries are marked Later / design-needed in this preview.",
        "This phase does not add checking support, solver support, or a full solved illustration for non-cash capital.",
      ],
    },
    {
      type: "solved-illustration",
      id: "capital-riya-cash",
      illustration: {
        id: "capital-riya-cash",
        title: "Solved Illustration 1: cash capital",
        difficulty: "easy",
        question: "Riya brought ₹45,000 in cash as capital into the business.",
        accountsAffected: ["Cash A/c", "Riya's Capital A/c"],
        reasoningSteps: [
          { label: "Physical cash", detail: "Cash comes into the business, so Cash A/c is debited." },
          { label: "Named capital", detail: "Riya's Capital A/c increases, so it is credited." },
          { label: "Not income", detail: "Capital is not income because it comes from the owner or partner." },
        ],
        journalEntry: [
          { id: "capital-riya-cash-debit", account: "Cash A/c", side: "debit", amount: 45000, drNotation: "Dr." },
          { id: "capital-riya-capital-credit", account: "Riya's Capital A/c", side: "credit", amount: 45000, displayPrefix: "To" },
        ],
        narration: "Being cash introduced by Riya as capital.",
        explanation:
          "Cash A/c is debited because physical cash increases. Riya's Capital A/c is credited because Riya's claim in the business increases.",
        studentTakeaway: "Use Cash A/c for cash capital and keep the named Capital A/c.",
        commonMistake: "Crediting Sales or Income instead of Riya's Capital A/c.",
      },
    },
    {
      type: "solved-illustration",
      id: "capital-kuldeep-bank",
      illustration: {
        id: "capital-kuldeep-bank",
        title: "Solved Illustration 2: bank capital",
        difficulty: "easy",
        question: "Kuldeep introduced ₹75,000 as capital through bank.",
        accountsAffected: ["Bank A/c", "Kuldeep's Capital A/c"],
        reasoningSteps: [
          { label: "Bank mode", detail: "Money enters the business bank account, so Bank A/c is debited." },
          { label: "Named capital", detail: "Kuldeep's Capital A/c increases, so it is credited." },
          { label: "Cash not used", detail: "Cash A/c is not affected because the transaction says through bank." },
        ],
        journalEntry: [
          { id: "capital-kuldeep-bank-debit", account: "Bank A/c", side: "debit", amount: 75000, drNotation: "Dr." },
          {
            id: "capital-kuldeep-capital-credit",
            account: "Kuldeep's Capital A/c",
            side: "credit",
            amount: 75000,
            displayPrefix: "To",
          },
        ],
        narration: "Being capital introduced by Kuldeep through bank.",
        explanation:
          "Bank A/c is debited because bank balance increases. Kuldeep's Capital A/c is credited because Kuldeep's claim increases.",
        studentTakeaway: "Use Bank A/c instead of Cash A/c when capital is introduced through bank.",
        commonMistake: "Using Cash A/c even though the transaction says through bank.",
      },
    },
    {
      type: "solved-illustration",
      id: "capital-kuldeep-priyanka-cash",
      illustration: {
        id: "capital-kuldeep-priyanka-cash",
        title: "Solved Illustration 3: two partners, cash",
        difficulty: "slightly-harder",
        question: "Kuldeep and Priyanka brought ₹80,000 and ₹50,000 in cash as capital.",
        accountsAffected: ["Cash A/c", "Kuldeep's Capital A/c", "Priyanka's Capital A/c"],
        reasoningSteps: [
          { label: "Combined cash debit", detail: "Cash receives ₹80,000 + ₹50,000 = ₹1,30,000." },
          { label: "Kuldeep's capital", detail: "Kuldeep's Capital A/c is credited with ₹80,000." },
          { label: "Priyanka's capital", detail: "Priyanka's Capital A/c is credited with ₹50,000." },
          { label: "Both partners recorded", detail: "Do not record only the first partner or first amount." },
        ],
        journalEntry: [
          { id: "capital-two-cash-debit", account: "Cash A/c", side: "debit", amount: 130000, drNotation: "Dr." },
          {
            id: "capital-kuldeep-cash-credit",
            account: "Kuldeep's Capital A/c",
            side: "credit",
            amount: 80000,
            displayPrefix: "To",
          },
          {
            id: "capital-priyanka-cash-credit",
            account: "Priyanka's Capital A/c",
            side: "credit",
            amount: 50000,
            displayPrefix: "To",
          },
        ],
        narration: "Being cash capital introduced by Kuldeep and Priyanka.",
        explanation:
          "Cash A/c is debited with the combined total. Each partner's named Capital A/c is credited separately.",
        studentTakeaway: "For two partners, total the asset debit and credit each partner separately.",
        commonMistake: "Recording only one partner or ignoring the second amount.",
      },
    },
    {
      type: "solved-illustration",
      id: "capital-priyanka-kuldeep-bank",
      illustration: {
        id: "capital-priyanka-kuldeep-bank",
        title: "Solved Illustration 4: two partners, bank",
        difficulty: "slightly-harder",
        question: "Priyanka and Kuldeep started their partnership with ₹50,000 and ₹70,000 through bank as capital.",
        accountsAffected: ["Bank A/c", "Priyanka's Capital A/c", "Kuldeep's Capital A/c"],
        reasoningSteps: [
          { label: "Combined bank debit", detail: "Bank receives ₹50,000 + ₹70,000 = ₹1,20,000." },
          { label: "Priyanka's capital", detail: "Priyanka's Capital A/c is credited with ₹50,000." },
          { label: "Kuldeep's capital", detail: "Kuldeep's Capital A/c is credited with ₹70,000." },
          { label: "Named accounts", detail: "Do not combine both partners into one generic Capital A/c." },
        ],
        journalEntry: [
          { id: "capital-two-bank-debit", account: "Bank A/c", side: "debit", amount: 120000, drNotation: "Dr." },
          {
            id: "capital-priyanka-bank-credit",
            account: "Priyanka's Capital A/c",
            side: "credit",
            amount: 50000,
            displayPrefix: "To",
          },
          {
            id: "capital-kuldeep-bank-credit",
            account: "Kuldeep's Capital A/c",
            side: "credit",
            amount: 70000,
            displayPrefix: "To",
          },
        ],
        narration: "Being capital introduced by Priyanka and Kuldeep through bank.",
        explanation:
          "Bank A/c is debited with the combined total, while each partner's named Capital A/c is credited separately.",
        studentTakeaway: "A partnership capital entry must preserve each partner's capital balance.",
        commonMistake: "Writing one combined Capital A/c credit for both partners.",
      },
    },
    {
      type: "solved-illustration",
      id: "capital-amit-additional-cash",
      illustration: {
        id: "capital-amit-additional-cash",
        title: "Solved Illustration 5: additional capital",
        difficulty: "easy",
        question: "Amit introduced additional capital of ₹20,000 in cash.",
        accountsAffected: ["Cash A/c", "Amit's Capital A/c"],
        reasoningSteps: [
          { label: "Cash increases", detail: "Cash comes into the business, so Cash A/c is debited." },
          { label: "Amit's capital increases", detail: "Amit's Capital A/c is credited." },
          { label: "Same logic", detail: "Additional capital follows the same treatment as initial capital." },
          { label: "No income", detail: "No income is created by this capital contribution." },
        ],
        journalEntry: [
          { id: "capital-amit-additional-cash-debit", account: "Cash A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          {
            id: "capital-amit-additional-capital-credit",
            account: "Amit's Capital A/c",
            side: "credit",
            amount: 20000,
            displayPrefix: "To",
          },
        ],
        narration: "Being additional cash capital introduced by Amit.",
        explanation:
          "Cash A/c is debited because cash increases. Amit's Capital A/c is credited because Amit contributes additional capital.",
        studentTakeaway: "Additional capital is still capital, not business income.",
        commonMistake: "Treating additional capital as business income.",
      },
    },
    {
      type: "common-mistakes",
      id: "capital-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Capital mistakes",
      mistakes: [
        "Crediting Sales or Income instead of Capital.",
        "Treating capital as a loan.",
        "Using generic Capital A/c when the person is named.",
        "Using Bank A/c when cash is introduced.",
        "Using Cash A/c when money comes through bank.",
        "Recording only one partner in a two-partner transaction.",
        "Ignoring the second amount.",
        "Failing to total both partners' contributions.",
        "Debiting Capital A/c when capital is introduced.",
        "Describing capital as profit.",
        "Combining all partners into one Capital A/c.",
        "Confusing additional capital with business income.",
      ],
    },
    {
      type: "process-steps",
      id: "capital-entry-decision-process",
      eyebrow: "Decision process",
      title: "Capital-entry decision process",
      body:
        "Use this order whenever the owner or partners introduce value into the business.",
      steps: [
        { label: "Identify who introduces the value", detail: "Look for the owner or partner name." },
        { label: "Confirm the source", detail: "Make sure the source is an owner or partner, not a customer, lender, or outsider." },
        { label: "Identify the asset received", detail: "Decide whether the business receives cash, bank money, or another asset." },
        { label: "Debit the asset", detail: "Debit the asset received by the business." },
        { label: "Credit named Capital A/c", detail: "Credit the named owner's or partner's Capital A/c." },
        { label: "Separate multiple partners", detail: "If multiple partners contribute, record each Capital A/c separately." },
        { label: "Add contributions", detail: "Add all contributions to determine the total asset debit." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "Explain who introduced the capital and how." },
        { label: "Check receipt nature", detail: "Confirm the receipt is not income or a loan." },
      ],
    },
    {
      type: "recap",
      id: "capital-checklist",
      title: "Capital checklist",
      points: [
        "The owner or partner is identified.",
        "Cash or Bank is selected correctly.",
        "The named Capital A/c is used.",
        "Every partner is recorded.",
        "Every contribution amount is included.",
        "Total asset debit equals total capital credits.",
        "Capital is not recorded as income.",
        "Narration explains who introduced the capital and how.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "capital-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Who gave the value to the business, what asset did the business receive, and whose Capital A/c increased?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const drawingsJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...drawingsSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG}`,
  shortDescription:
    "Learn drawings, named Drawings A/c, cash and bank withdrawals, goods withdrawn, and personal expenses paid by the business.",
  learningObjective:
    "Students learn that personal withdrawals increase Drawings, reduce assets or goods available to the business, and are not business expenses.",
  progressLabel: "Section 9 of 16",
  previousSection: capitalSubtopicReference,
  nextSection: purchasesSubtopicReference,
  practiceQuestionIds: [withdrewCashForPersonalUsePracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "drawings",
      eyebrow: "Learning objective",
      title: "Drawings",
      body:
        "By the end of this section, you should be able to record cash, bank, goods, and personal-expense drawings, use named Drawings A/c, and separate personal withdrawals from business withdrawals.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-drawings",
      eyebrow: "Concept explanation",
      title: "What drawings mean",
      paragraphs: [
        "Drawings are cash, bank funds, goods, or other value withdrawn by the owner or partner for personal use.",
        "Drawings are not a business expense.",
        "Drawings reduce the owner's or partner's claim in the business.",
        "Drawings may happen through cash, bank, goods, or payment of personal expenses.",
        "In a partnership, each partner should have a separate Drawings A/c.",
      ],
    },
    {
      type: "concept-explanation",
      id: "why-drawings-is-debited",
      eyebrow: "Debit logic",
      title: "Why Drawings A/c is debited",
      paragraphs: [
        "Owner or partner takes value for personal use → Drawings increases → Asset or goods available to the business decreases.",
        "Drawings reduce Capital / Equity, but they are recorded separately during the accounting period.",
        "An increase in Drawings is debited.",
        "The asset or value leaving the business is credited.",
        "Drawings A/c will later be adjusted against Capital A/c. This section does not teach closing-entry mechanics in detail.",
      ],
    },
    {
      type: "comparison",
      id: "drawings-accounting-equation-impact",
      eyebrow: "Accounting equation",
      title: "Drawings reduce the owner's claim",
      intro:
        "Assets = Capital + Liabilities. When value is withdrawn for personal use, assets or goods available to the business decrease and capital presentation is reduced through Drawings.",
      groups: [
        {
          title: "Amit withdraws cash ₹5,000",
          items: [
            "Cash decreases by ₹5,000.",
            "Amit's capital claim is reduced by ₹5,000 through Drawings.",
            "Liability is unchanged.",
          ],
        },
        {
          title: "Final accounts impact",
          items: [
            "Balance Sheet is affected.",
            "Profit & Loss is not directly affected.",
            "Drawings are deducted from Capital in final presentation.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "cash-drawings-format",
      eyebrow: "Cash drawings",
      title: "Cash withdrawn for personal use",
      paragraphs: [
        "Transaction: Amit withdrew cash ₹5,000 for personal use.",
        "Amit Drawings increases, so Amit Drawings A/c is debited. Cash asset decreases, so Cash A/c is credited.",
        "Use Cash A/c because physical cash leaves the business. Do not debit a business expense account.",
      ],
      formatRows: [
        { id: "cash-drawings-debit", particulars: "Amit Drawings A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "cash-drawings-credit", particulars: "To Cash A/c", lf: "", creditDisplay: "5,000" },
        { id: "cash-drawings-narration", particulars: "(Being cash withdrawn by Amit for personal use.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "withdrew-cash-for-personal-use-practice",
      question: withdrewCashForPersonalUsePracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "bank-drawings-format",
      eyebrow: "Bank drawings",
      title: "Amount withdrawn through bank for personal use",
      paragraphs: [
        "Transaction: Riya withdrew ₹4,000 from bank for personal use.",
        "Riya Drawings A/c is debited because Riya takes value for personal use. Bank A/c is credited because money leaves the business bank account.",
        "Use Bank A/c because the withdrawal is through bank. Cash A/c is not affected, and this is not a normal business cash withdrawal.",
      ],
      formatRows: [
        { id: "bank-drawings-debit", particulars: "Riya Drawings A/c Dr.", lf: "", debitDisplay: "4,000" },
        { id: "bank-drawings-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "4,000" },
        { id: "bank-drawings-narration", particulars: "(Being amount withdrawn by Riya from bank for personal use.)" },
      ],
    },
    {
      type: "comparison",
      id: "business-withdrawal-versus-personal-drawings",
      eyebrow: "Business use versus personal use",
      title: "Purpose changes the entry",
      intro:
        "Office use, business use, and personal use are not small words. They decide whether the entry is a business cash-bank transfer or drawings.",
      groups: [
        {
          title: "Business use",
          items: [
            "Transaction: Cash withdrawn from bank ₹3,000 for office use.",
            "Entry: Cash A/c Dr. ₹3,000.",
            "To Bank A/c ₹3,000.",
            "Value remains inside the business.",
            "It is not drawings.",
          ],
        },
        {
          title: "Personal use",
          items: [
            "Transaction: Amit withdrew ₹3,000 from bank for personal use.",
            "Entry: Amit Drawings A/c Dr. ₹3,000.",
            "To Bank A/c ₹3,000.",
            "Value leaves the business for personal use.",
            "Drawings increases.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "goods-drawings-format",
      eyebrow: "Goods drawings",
      title: "Goods withdrawn for personal use",
      paragraphs: [
        "Transaction: Amit withdrew goods costing ₹3,000 for personal use.",
        "The goods were originally purchased for resale, but they are no longer available for business sale.",
        "Under the school journal convention used here, Drawings is debited and Purchases A/c is credited at cost.",
        "Use cost value, not selling price. Do not credit Sales A/c, and do not add GST treatment in this phase.",
      ],
      formatRows: [
        { id: "goods-drawings-debit", particulars: "Amit Drawings A/c Dr.", lf: "", debitDisplay: "3,000" },
        { id: "goods-drawings-credit", particulars: "To Purchases A/c", lf: "", creditDisplay: "3,000" },
        { id: "goods-drawings-narration", particulars: "(Being goods withdrawn by Amit for personal use.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "personal-expense-paid-by-business-format",
      eyebrow: "Personal expense",
      title: "Personal expenses paid by the business",
      paragraphs: [
        "If the business pays an owner's or partner's personal expense, it is drawings.",
        "Transaction: The business paid Amit's personal mobile bill ₹2,000 through bank.",
        "It is not Telephone Expense A/c of the business because the expense is personal. Bank decreases and Amit Drawings increases.",
      ],
      formatRows: [
        { id: "personal-mobile-bill-drawings-debit", particulars: "Amit Drawings A/c Dr.", lf: "", debitDisplay: "2,000" },
        { id: "personal-mobile-bill-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "2,000" },
        { id: "personal-mobile-bill-narration", particulars: "(Being Amit's personal mobile bill paid through bank.)" },
      ],
    },
    {
      type: "comparison",
      id: "named-drawings-accounts",
      eyebrow: "Named Drawings A/c",
      title: "Use the person's Drawings A/c when a name is given",
      intro:
        "Named accounts are important when the transaction identifies the proprietor or partner.",
      groups: [
        {
          title: "Use named accounts",
          items: [
            "Amit Drawings A/c.",
            "Riya Drawings A/c.",
            "Kuldeep Drawings A/c.",
            "Priyanka Drawings A/c.",
          ],
        },
        {
          title: "Partnership reminder",
          items: [
            "Each partner's drawings must be recorded separately.",
            "One partner's withdrawal must not be posted to another partner's Drawings A/c.",
            "Multiple partners should not be combined into one generic Drawings A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "two-partners-drawings-format",
      eyebrow: "Two partners",
      title: "Two partners withdraw separately",
      paragraphs: [
        "Transaction: Amit withdrew cash ₹5,000 and Riya withdrew ₹3,000 through bank for personal use.",
        "Show them as two separate entries for clarity because the payment modes differ.",
        "Each partner has a separate Drawings A/c. This combined wording does not add checking support in this phase.",
      ],
      formatRows: [
        { id: "two-partners-entry-one-label", particulars: "Entry 1: Amit withdrew cash" },
        { id: "two-partners-amit-drawings-debit", particulars: "Amit Drawings A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "two-partners-cash-credit", particulars: "To Cash A/c", lf: "", creditDisplay: "5,000" },
        { id: "two-partners-entry-two-label", particulars: "Entry 2: Riya withdrew through bank" },
        { id: "two-partners-riya-drawings-debit", particulars: "Riya Drawings A/c Dr.", lf: "", debitDisplay: "3,000" },
        { id: "two-partners-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "3,000" },
      ],
    },
    {
      type: "comparison",
      id: "drawings-versus-business-expense",
      eyebrow: "Drawings versus expense",
      title: "Personal benefit is not a business expense",
      intro:
        "Both drawings and expenses may involve money leaving the business, but the purpose decides the accounting treatment.",
      groups: [
        {
          title: "Drawings",
          items: [
            "Purpose: personal benefit of owner or partner.",
            "Effect: reduces Capital / Equity presentation.",
            "Example: Amit Drawings A/c Dr.",
            "To Bank A/c.",
          ],
        },
        {
          title: "Business expense",
          items: [
            "Purpose: incurred to operate the business or earn revenue.",
            "Effect: reduces profit.",
            "Example: Rent A/c Dr.",
            "To Bank A/c.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "drawings-versus-capital",
      eyebrow: "Drawings versus capital",
      title: "Capital enters, drawings leave",
      intro:
        "Capital and drawings move in opposite directions for the owner or partner's claim.",
      groups: [
        {
          title: "Capital introduced",
          items: [
            "Value enters the business.",
            "Asset increases.",
            "Capital increases.",
            "Example: Bank A/c Dr.",
            "To Amit's Capital A/c.",
          ],
        },
        {
          title: "Drawings",
          items: [
            "Value leaves for personal use.",
            "Asset or goods available to business decreases.",
            "Drawings increases.",
            "Example: Amit Drawings A/c Dr.",
            "To Bank A/c.",
          ],
        },
      ],
    },
    {
      type: "concept-explanation",
      id: "interest-on-drawings-design-note",
      eyebrow: "Later / design-needed",
      title: "Interest on drawings",
      paragraphs: [
        "In Partnership Accounts, interest may be charged on partners' drawings.",
        "Interest on drawings is marked Later / design-needed in this preview.",
        "This phase does not teach calculation methods, average periods, product method, or journal entries for interest on drawings.",
        "This phase does not add solver support or checker support for interest on drawings.",
      ],
    },
    {
      type: "solved-illustration",
      id: "drawings-priyanka-cash",
      illustration: {
        id: "drawings-priyanka-cash",
        title: "Solved Illustration 1: cash drawings",
        difficulty: "easy",
        question: "Priyanka withdrew cash ₹6,000 for personal use.",
        accountsAffected: ["Priyanka Drawings A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Named drawings", detail: "Priyanka Drawings A/c is used because Priyanka is named." },
          { label: "Cash decreases", detail: "Physical cash leaves the business, so Cash A/c is credited." },
          { label: "Not expense", detail: "The withdrawal is personal, so it is not a business expense." },
        ],
        journalEntry: [
          { id: "drawings-priyanka-cash-debit", account: "Priyanka Drawings A/c", side: "debit", amount: 6000, drNotation: "Dr." },
          { id: "drawings-priyanka-cash-credit", account: "Cash A/c", side: "credit", amount: 6000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn by Priyanka for personal use.",
        explanation:
          "Priyanka Drawings A/c is debited because drawings increase. Cash A/c is credited because cash leaves the business.",
        studentTakeaway: "Personal cash withdrawal uses named Drawings A/c and Cash A/c.",
        commonMistake: "Recording the personal withdrawal as a business expense.",
      },
    },
    {
      type: "solved-illustration",
      id: "drawings-kuldeep-bank",
      illustration: {
        id: "drawings-kuldeep-bank",
        title: "Solved Illustration 2: bank drawings",
        difficulty: "easy",
        question: "Kuldeep withdrew ₹8,000 through bank for personal use.",
        accountsAffected: ["Kuldeep Drawings A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Personal use", detail: "Personal-use wording creates drawings." },
          { label: "Bank mode", detail: "Money leaves through bank, so Bank A/c is credited." },
          { label: "Cash not affected", detail: "Cash A/c is not used because the question says through bank." },
        ],
        journalEntry: [
          { id: "drawings-kuldeep-bank-debit", account: "Kuldeep Drawings A/c", side: "debit", amount: 8000, drNotation: "Dr." },
          { id: "drawings-kuldeep-bank-credit", account: "Bank A/c", side: "credit", amount: 8000, displayPrefix: "To" },
        ],
        narration: "Being amount withdrawn by Kuldeep through bank for personal use.",
        explanation:
          "Kuldeep Drawings A/c is debited because drawings increase. Bank A/c is credited because bank balance decreases.",
        studentTakeaway: "Use Bank A/c instead of Cash A/c when the personal withdrawal is through bank.",
        commonMistake: "Treating a personal bank withdrawal as a normal business cash withdrawal.",
      },
    },
    {
      type: "solved-illustration",
      id: "drawings-riya-goods",
      illustration: {
        id: "drawings-riya-goods",
        title: "Solved Illustration 3: goods drawings",
        difficulty: "slightly-harder",
        question: "Riya withdrew goods costing ₹4,000 for personal use.",
        accountsAffected: ["Riya Drawings A/c", "Purchases A/c"],
        reasoningSteps: [
          { label: "Cost value", detail: "Goods drawings are recorded at cost, not selling price." },
          { label: "Drawings increases", detail: "Riya Drawings A/c is debited." },
          { label: "Purchases credited", detail: "Purchases A/c is credited under this school convention." },
          { label: "Sales not used", detail: "No sale happened, so Sales A/c is not credited." },
        ],
        journalEntry: [
          { id: "drawings-riya-goods-debit", account: "Riya Drawings A/c", side: "debit", amount: 4000, drNotation: "Dr." },
          { id: "drawings-riya-goods-credit", account: "Purchases A/c", side: "credit", amount: 4000, displayPrefix: "To" },
        ],
        narration: "Being goods withdrawn by Riya for personal use.",
        explanation:
          "Riya Drawings A/c is debited because Riya takes goods for personal use. Purchases A/c is credited at cost under the school convention used here.",
        studentTakeaway: "Goods withdrawn personally are drawings; use cost and do not credit Sales A/c.",
        commonMistake: "Crediting Sales A/c or using selling price for goods withdrawn.",
      },
    },
    {
      type: "solved-illustration",
      id: "drawings-amit-personal-insurance",
      illustration: {
        id: "drawings-amit-personal-insurance",
        title: "Solved Illustration 4: personal expense paid by business",
        difficulty: "slightly-harder",
        question: "The business paid Amit's personal insurance premium ₹5,000 by bank.",
        accountsAffected: ["Amit Drawings A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Personal benefit", detail: "The insurance premium is Amit's personal expense." },
          { label: "Not business expense", detail: "Insurance Expense A/c of the business is not debited." },
          { label: "Bank decreases", detail: "The business paid through bank, so Bank A/c is credited." },
        ],
        journalEntry: [
          { id: "drawings-amit-insurance-debit", account: "Amit Drawings A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "drawings-amit-insurance-bank-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being Amit's personal insurance premium paid by bank.",
        explanation:
          "Amit Drawings A/c is debited because the payment benefits Amit personally. Bank A/c is credited because the business bank balance decreases.",
        studentTakeaway: "A personal expense paid by the business is drawings, not a business expense.",
        commonMistake: "Debiting Insurance Expense A/c for Amit's personal insurance premium.",
      },
    },
    {
      type: "solved-illustration",
      id: "drawings-office-use-bank-withdrawal",
      illustration: {
        id: "drawings-office-use-bank-withdrawal",
        title: "Solved Illustration 5: business withdrawal guard case",
        difficulty: "mixed",
        question: "Cash withdrawn from bank ₹7,000 for office use.",
        accountsAffected: ["Cash A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Office use", detail: "The cash remains for business use, so this is not drawings." },
          { label: "Cash increases", detail: "Cash A/c is debited because office cash increases." },
          { label: "Bank decreases", detail: "Bank A/c is credited because money leaves the bank account." },
        ],
        journalEntry: [
          { id: "drawings-office-cash-debit", account: "Cash A/c", side: "debit", amount: 7000, drNotation: "Dr." },
          { id: "drawings-office-bank-credit", account: "Bank A/c", side: "credit", amount: 7000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn from bank for office use.",
        explanation:
          "This is a business cash-bank transfer. Value stays inside the business, so Drawings A/c is not used.",
        studentTakeaway: "Office-use wording means Cash A/c Dr. and Bank A/c Cr., not drawings.",
        commonMistake: "Treating every withdrawal from bank as drawings.",
      },
    },
    {
      type: "common-mistakes",
      id: "drawings-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Drawings mistakes",
      mistakes: [
        "Treating drawings as a business expense.",
        "Treating business cash withdrawal as drawings.",
        "Using Cash A/c when withdrawal is through bank.",
        "Using Bank A/c when physical cash is withdrawn.",
        "Using generic Drawings A/c when a person is named.",
        "Using Capital A/c directly for every drawing during the period.",
        "Crediting Drawings A/c when drawings increase.",
        "Debiting Cash/Bank instead of crediting it.",
        "Using Sales A/c for goods withdrawn.",
        "Using selling price instead of cost for goods drawings.",
        "Recording personal mobile or insurance bills as business expenses.",
        "Combining two partners' drawings into one account.",
        "Assuming every payment by the business is an expense.",
      ],
    },
    {
      type: "process-steps",
      id: "drawings-decision-process",
      eyebrow: "Decision process",
      title: "Drawings decision process",
      body:
        "Use this order whenever value might be leaving the business for personal use.",
      steps: [
        { label: "Identify value leaving", detail: "Check whether cash, bank money, goods, or another value leaves the business." },
        { label: "Identify the person", detail: "Find who receives the personal benefit." },
        { label: "Confirm purpose", detail: "Decide whether the purpose is personal or business." },
        { label: "Select named Drawings A/c", detail: "Use the correct person's Drawings A/c." },
        { label: "Identify what leaves", detail: "Choose Cash, Bank, or goods/Purchases as appropriate." },
        { label: "Debit Drawings", detail: "Debit Drawings A/c because drawings increase." },
        { label: "Credit the leaving value", detail: "Credit Cash, Bank, or Purchases A/c as appropriate." },
        { label: "Enter correct value", detail: "Use the correct amount; goods drawings use cost." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "Explain who withdrew the value and how." },
      ],
    },
    {
      type: "recap",
      id: "drawings-checklist",
      title: "Drawings checklist",
      points: [
        "Personal use is clearly identified.",
        "The correct person's Drawings A/c is used.",
        "Cash or Bank is selected correctly.",
        "Goods drawings use cost value.",
        "Purchases A/c is used for goods withdrawn under this school convention.",
        "Business-use withdrawals are not classified as drawings.",
        "Personal expenses are not classified as business expenses.",
        "Debit and credit totals are equal.",
        "Narration states who withdrew the value and how.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "drawings-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Did the value remain inside the business, support the business, or leave the business for someone's personal benefit?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const purchasesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...purchasesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG}`,
  shortDescription:
    "Learn Purchases A/c for goods bought for resale, cash/bank/credit purchases, named suppliers, and goods-versus-assets guardrails.",
  learningObjective:
    "Students learn to use Purchases A/c only for goods bought for resale, identify Cash/Bank/named creditor treatment, and separate purchases from assets and expenses.",
  progressLabel: "Section 10 of 16",
  previousSection: drawingsSubtopicReference,
  nextSection: salesSubtopicReference,
  practiceQuestionIds: [purchasedGoodsForCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "purchases",
      eyebrow: "Learning objective",
      title: "Purchases",
      body:
        "By the end of this section, you should be able to record goods bought for resale, choose Cash A/c, Bank A/c, or the named supplier correctly, and avoid using Purchases A/c for assets or ordinary expenses.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-purchases",
      eyebrow: "Concept explanation",
      title: "What Purchases A/c records",
      paragraphs: [
        "Purchases A/c records goods bought for resale. Goods means the items the business normally deals in and plans to sell to customers.",
        "Purchases does not mean every item bought. If a business buys furniture, machinery, vehicles, or a building for its own use, use the named asset account.",
        "Purchases may be made for cash, through bank, or on credit from a supplier.",
        "When a supplier is named, use that supplier's account, such as Mohan A/c or Riya Traders A/c. Do not replace a named supplier with generic Creditor A/c.",
        "Purchases are usually recorded at the amount payable after trade discount if applicable. Detailed discount entries are marked later in this preview.",
      ],
    },
    {
      type: "concept-explanation",
      id: "central-purchase-rules",
      eyebrow: "Central rules",
      title: "Three rules to remember",
      paragraphs: [
        "Items bought for resale → Purchases A/c.",
        "Assets bought for business use → Named Asset A/c.",
        "Payment mode or credit supplier identifies the credited account.",
      ],
    },
    {
      type: "comparison",
      id: "goods-versus-assets-in-purchases",
      eyebrow: "Goods versus assets",
      title: "Purpose decides whether Purchases A/c is used",
      intro:
        "The same physical item can be goods for one business and an asset for another business. Ask why the item was bought.",
      groups: [
        {
          title: "Goods bought for resale",
          items: [
            "Furniture dealer buys furniture for resale → Purchases A/c.",
            "Mobile-phone dealer buys phones for resale → Purchases A/c.",
            "Transaction: Bought goods for cash ₹10,000.",
            "Entry: Purchases A/c Dr.; To Cash A/c.",
          ],
        },
        {
          title: "Assets bought for business use",
          items: [
            "Coaching centre buys furniture for office use → Furniture A/c.",
            "A business buys a phone for office use → Office Equipment A/c or the named asset account.",
            "Transaction: Bought furniture for cash ₹10,000.",
            "Entry: Furniture A/c Dr.; To Cash A/c.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "purchases-classification",
      eyebrow: "Classification",
      title: "How Purchases A/c is classified here",
      intro:
        "This section stays in journal-entry logic and does not teach full Trading Account treatment yet.",
      groups: [
        {
          title: "Modern view",
          items: [
            "Purchases is treated as a direct cost / expense-type account in this journal-entry context.",
            "When goods are bought for resale, Purchases increases.",
            "An increase in this expense-type account is debited.",
          ],
        },
        {
          title: "Traditional view",
          items: [
            "Purchases is a Nominal Account.",
            "The golden rule is debit all expenses and losses.",
            "Therefore Purchases A/c is debited when goods are purchased.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "cash-purchase-format",
      eyebrow: "Cash purchase",
      title: "Bought goods for cash",
      paragraphs: [
        "Transaction: Bought goods for cash ₹10,000.",
        "Goods bought for resale increase Purchases A/c, so Purchases A/c is debited.",
        "Physical cash is paid immediately, so Cash A/c is credited. Bank A/c is not affected.",
      ],
      formatRows: [
        { id: "cash-purchase-purchases-debit", particulars: "Purchases A/c Dr.", lf: "", debitDisplay: "10,000" },
        { id: "cash-purchase-cash-credit", particulars: "To Cash A/c", lf: "", creditDisplay: "10,000" },
        { id: "cash-purchase-narration", particulars: "(Being goods purchased for cash.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "purchased-goods-for-cash-practice",
      question: purchasedGoodsForCashPracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "bank-purchase-format",
      eyebrow: "Bank purchase",
      title: "Purchased goods through bank",
      paragraphs: [
        "Transaction: Purchased goods through bank ₹15,000.",
        "Purchases A/c is debited because goods are bought for resale.",
        "Bank A/c is credited because payment is made through the business bank account. Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "bank-purchase-purchases-debit", particulars: "Purchases A/c Dr.", lf: "", debitDisplay: "15,000" },
        { id: "bank-purchase-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "15,000" },
        { id: "bank-purchase-narration", particulars: "(Being goods purchased through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "credit-purchase-format",
      eyebrow: "Credit purchase",
      title: "Purchased goods on credit from Mohan",
      paragraphs: [
        "Transaction: Purchased goods on credit from Mohan ₹20,000.",
        "Purchases A/c is debited because goods for resale are bought.",
        "Mohan A/c is credited because Mohan is the named supplier or creditor. Cash and Bank are not affected at the time of credit purchase.",
      ],
      formatRows: [
        { id: "credit-purchase-purchases-debit", particulars: "Purchases A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-purchase-mohan-credit", particulars: "To Mohan A/c", lf: "", creditDisplay: "20,000" },
        { id: "credit-purchase-narration", particulars: "(Being goods purchased on credit from Mohan.)" },
      ],
    },
    {
      type: "comparison",
      id: "named-supplier-account",
      eyebrow: "Named supplier",
      title: "Use the supplier's account in a credit purchase",
      intro:
        "A credit purchase creates an amount payable to the supplier. The supplier is credited because the business owes them money.",
      groups: [
        {
          title: "Use the named supplier",
          items: [
            "Mohan A/c.",
            "Riya Traders A/c.",
            "ABC Suppliers A/c.",
            "Use the exact supplier name when the question gives one.",
          ],
        },
        {
          title: "Do not use these instead",
          items: [
            "Do not use Cash A/c.",
            "Do not use Bank A/c.",
            "Do not use generic Creditor A/c when the supplier is named.",
            "Do not write Purchases A/c on both sides.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "purchases-versus-expenses",
      eyebrow: "Purchases versus expenses",
      title: "Goods purchase and business expense are not the same",
      intro:
        "Both may be debited, but they represent different accounts and concepts.",
      groups: [
        {
          title: "Purchase of goods",
          items: [
            "Bought goods for cash ₹10,000.",
            "Entry: Purchases A/c Dr.",
            "To Cash A/c.",
            "Purchases relates to goods bought for resale.",
          ],
        },
        {
          title: "Business expense",
          items: [
            "Paid office rent by bank ₹10,000.",
            "Entry: Rent A/c Dr.",
            "To Bank A/c.",
            "Rent is a cost of operating the business, not Purchases A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "credit-purchase-and-later-payment-format",
      eyebrow: "Credit purchase and payment",
      title: "Original purchase and later payment are separate",
      paragraphs: [
        "At the time of purchase, the supplier becomes a creditor.",
        "When the supplier is later paid, the creditor is settled.",
        "Purchases A/c is not debited again when the supplier is paid.",
      ],
      formatRows: [
        { id: "credit-purchase-entry-one-label", particulars: "Transaction 1: Purchased goods on credit from Mohan ₹20,000" },
        { id: "credit-purchase-entry-one-debit", particulars: "Purchases A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-purchase-entry-one-credit", particulars: "To Mohan A/c", lf: "", creditDisplay: "20,000" },
        { id: "credit-purchase-entry-two-label", particulars: "Transaction 2: Paid Mohan by bank ₹20,000" },
        { id: "credit-purchase-entry-two-debit", particulars: "Mohan A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-purchase-entry-two-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "20,000" },
      ],
    },
    {
      type: "concept-explanation",
      id: "purchase-discounts-and-returns-boundary",
      eyebrow: "Later / design-needed",
      title: "Discounts and purchase returns are later topics",
      paragraphs: [
        "Trade discount reduces the invoice or list price before recording. Example: goods listed at ₹20,000 less 10% trade discount are recorded at ₹18,000.",
        "The journal entry is recorded at the net amount: Purchases A/c Dr. ₹18,000; To Supplier A/c ₹18,000.",
        "Trade discount is normally not recorded separately in the journal.",
        "Cash discount relates to prompt payment and may be recorded separately later.",
        "Purchase returns / Returns Outward treatment is a later linked subtopic.",
        "Detailed trade discount, cash discount, and purchase returns practice is marked Later / design-needed in this preview.",
      ],
    },
    {
      type: "recap",
      id: "purchase-source-documents",
      title: "Common source documents",
      points: [
        "Cash memo.",
        "Purchase invoice.",
        "Supplier bill.",
        "Bank payment record.",
        "Goods received note where applicable.",
        "Source documents support the recording of the transaction; this preview does not add upload, OCR, or invoice extraction.",
      ],
    },
    {
      type: "solved-illustration",
      id: "purchases-cash-goods",
      illustration: {
        id: "purchases-cash-goods",
        title: "Solved Illustration 1: cash purchase",
        difficulty: "easy",
        question: "Bought goods for cash ₹12,000.",
        accountsAffected: ["Purchases A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Goods for resale", detail: "Goods bought for resale use Purchases A/c." },
          { label: "Cash mode", detail: "The question says for cash, so Cash A/c is credited." },
          { label: "No bank", detail: "Bank A/c is not affected." },
        ],
        journalEntry: [
          { id: "purchases-cash-goods-debit", account: "Purchases A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "purchases-cash-goods-credit", account: "Cash A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased for cash.",
        explanation:
          "Purchases A/c is debited because goods for resale are bought. Cash A/c is credited because cash leaves the business.",
        studentTakeaway: "For cash purchases, use Purchases A/c and Cash A/c.",
        commonMistake: "Using Bank A/c when the transaction says cash.",
      },
    },
    {
      type: "solved-illustration",
      id: "purchases-bank-goods",
      illustration: {
        id: "purchases-bank-goods",
        title: "Solved Illustration 2: bank purchase",
        difficulty: "easy",
        question: "Purchased goods through bank ₹18,000.",
        accountsAffected: ["Purchases A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Goods for resale", detail: "Purchases A/c is used." },
          { label: "Bank mode", detail: "Payment goes through bank, so Bank A/c is credited." },
          { label: "No cash", detail: "Cash A/c is not affected." },
        ],
        journalEntry: [
          { id: "purchases-bank-goods-debit", account: "Purchases A/c", side: "debit", amount: 18000, drNotation: "Dr." },
          { id: "purchases-bank-goods-credit", account: "Bank A/c", side: "credit", amount: 18000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased through bank.",
        explanation:
          "Purchases increases because goods are bought. Bank decreases because payment is made through bank.",
        studentTakeaway: "Through bank means Bank A/c, not Cash A/c.",
        commonMistake: "Crediting Cash A/c for a bank payment.",
      },
    },
    {
      type: "solved-illustration",
      id: "purchases-credit-from-mohan",
      illustration: {
        id: "purchases-credit-from-mohan",
        title: "Solved Illustration 3: credit purchase",
        difficulty: "easy",
        question: "Bought goods on credit from Mohan ₹20,000.",
        accountsAffected: ["Purchases A/c", "Mohan A/c"],
        reasoningSteps: [
          { label: "Goods for resale", detail: "Purchases A/c is debited." },
          { label: "Named supplier", detail: "Mohan A/c is credited because Mohan is the supplier." },
          { label: "No cash/bank now", detail: "Cash A/c and Bank A/c are not affected at the purchase date." },
        ],
        journalEntry: [
          { id: "purchases-credit-mohan-debit", account: "Purchases A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "purchases-credit-mohan-credit", account: "Mohan A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased on credit from Mohan.",
        explanation:
          "The purchase creates a creditor. Mohan A/c is credited because the business owes Mohan.",
        studentTakeaway: "In credit purchases, use the supplier's name instead of Cash or Bank.",
        commonMistake: "Using Cash A/c or Bank A/c even though the purchase is on credit.",
      },
    },
    {
      type: "solved-illustration",
      id: "purchases-machinery-asset-guard",
      illustration: {
        id: "purchases-machinery-asset-guard",
        title: "Solved Illustration 4: asset distinction",
        difficulty: "slightly-harder",
        question: "Bought machinery through bank ₹50,000.",
        accountsAffected: ["Machinery A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Asset bought", detail: "Machinery is used by the business, so Machinery A/c is debited." },
          { label: "Not Purchases", detail: "Purchases A/c is not used because the item is not goods for resale." },
          { label: "Bank mode", detail: "Bank A/c is credited because payment is through bank." },
        ],
        journalEntry: [
          { id: "purchases-machinery-debit", account: "Machinery A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          { id: "purchases-machinery-bank-credit", account: "Bank A/c", side: "credit", amount: 50000, displayPrefix: "To" },
        ],
        narration: "Being machinery purchased through bank.",
        explanation:
          "Machinery is a business asset, so the named asset account is debited. Purchases A/c is not used.",
        studentTakeaway: "The word bought is not enough; decide whether the item is goods for resale or an asset.",
        commonMistake: "Debiting Purchases A/c merely because the word bought appears.",
      },
    },
    {
      type: "solved-illustration",
      id: "purchases-later-payment-to-mohan",
      illustration: {
        id: "purchases-later-payment-to-mohan",
        title: "Solved Illustration 5: purchase and later settlement",
        difficulty: "slightly-harder",
        question: "Purchased goods on credit from Mohan ₹20,000 and later paid Mohan by bank.",
        accountsAffected: ["Purchases A/c", "Mohan A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Purchase date", detail: "Purchases A/c Dr. and To Mohan A/c create the creditor." },
          { label: "Payment date", detail: "Mohan A/c Dr. and To Bank A/c settle the creditor." },
          { label: "No duplicate purchase", detail: "Purchases A/c is not debited again when Mohan is paid." },
        ],
        journalEntry: [
          { id: "purchases-settlement-purchases-debit", account: "Purchases A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "purchases-settlement-mohan-credit", account: "Mohan A/c", side: "credit", amount: 20000, displayPrefix: "To" },
          { id: "purchases-settlement-mohan-debit", account: "Mohan A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "purchases-settlement-bank-credit", account: "Bank A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased on credit from Mohan and later paid by bank.",
        explanation:
          "The two entries are displayed together only to compare them. The purchase creates the creditor; the later payment settles it.",
        studentTakeaway: "Do not debit Purchases A/c again when paying the supplier later.",
        commonMistake: "Recording a second purchase entry when the supplier is paid.",
      },
    },
    {
      type: "solved-illustration",
      id: "purchases-rent-expense-guard",
      illustration: {
        id: "purchases-rent-expense-guard",
        title: "Solved Illustration 6: expense guard",
        difficulty: "easy",
        question: "Paid office rent by bank ₹10,000.",
        accountsAffected: ["Rent A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Expense identified", detail: "Rent is a business expense, not goods bought for resale." },
          { label: "Rent debited", detail: "Rent A/c is debited because expense increases." },
          { label: "Bank credited", detail: "Bank A/c is credited because payment is through bank." },
        ],
        journalEntry: [
          { id: "purchases-rent-debit", account: "Rent A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "purchases-rent-bank-credit", account: "Bank A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being office rent paid by bank.",
        explanation:
          "Rent is an operating expense. Purchases A/c is not used because no goods for resale are bought.",
        studentTakeaway: "Do not call every payment a purchase.",
        commonMistake: "Debiting Purchases A/c for rent or other operating expenses.",
      },
    },
    {
      type: "common-mistakes",
      id: "purchases-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Purchases mistakes",
      mistakes: [
        "Using Purchases A/c for an asset.",
        "Using Furniture A/c or Machinery A/c for goods bought for resale.",
        "Using Cash A/c when payment is through bank.",
        "Using Bank A/c when payment is in cash.",
        "Using Cash or Bank for a credit purchase.",
        "Ignoring the named supplier.",
        "Using generic Creditor A/c instead of the named supplier.",
        "Crediting Purchases A/c when purchases increase.",
        "Debiting the supplier on the purchase date.",
        "Recording Purchases A/c again when paying the supplier.",
        "Recording trade discount separately.",
        "Confusing trade discount with cash discount.",
        "Recording goods at selling price rather than purchase cost.",
        "Assuming every use of the word bought means Purchases A/c.",
      ],
    },
    {
      type: "process-steps",
      id: "purchase-decision-process",
      eyebrow: "Decision process",
      title: "Purchase decision process",
      body:
        "Use this order before writing a purchase-related journal entry.",
      steps: [
        { label: "Identify what was bought", detail: "Read the item, amount, person, and payment mode." },
        { label: "Decide the purpose", detail: "Ask whether it is goods for resale, an asset, or an expense." },
        { label: "Use Purchases for resale goods", detail: "If goods are bought for resale, use Purchases A/c." },
        { label: "Choose payment or supplier account", detail: "Use Cash A/c, Bank A/c, or the named supplier's account." },
        { label: "Avoid Cash/Bank for credit", detail: "Credit purchases use the named supplier, not Cash or Bank." },
        { label: "Debit Purchases A/c", detail: "Debit Purchases A/c when goods for resale are bought." },
        { label: "Credit the correct account", detail: "Credit Cash, Bank, or the supplier as appropriate." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "State what was purchased and how." },
        { label: "Check later topics", detail: "Discounts and purchase returns may require later treatment." },
      ],
    },
    {
      type: "recap",
      id: "purchases-checklist",
      title: "Purchases checklist",
      points: [
        "The item is intended for resale.",
        "Purchases A/c is appropriate.",
        "An asset has not been mistaken for goods.",
        "The correct payment mode is identified.",
        "The named supplier is used for credit purchase.",
        "Cash/Bank is not used in a credit purchase.",
        "The amount is recorded correctly.",
        "Debit and credit totals are equal.",
        "Narration states what was purchased and how.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "purchases-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Was the item purchased for resale, for use as an asset, or as a business expense—and how was it paid for?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const salesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...salesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_SALES_SECTION_SLUG}`,
  shortDescription:
    "Learn Sales A/c for goods sold in normal trading, cash/bank/credit sales, named debtors, and asset-sale guardrails.",
  learningObjective:
    "Students learn to credit Sales A/c only for trading goods, identify Cash/Bank/named debtor treatment, and separate sales from asset disposals, capital receipts, and loans.",
  progressLabel: "Section 11 of 16",
  previousSection: purchasesSubtopicReference,
  nextSection: expensesSubtopicReference,
  practiceQuestionIds: [soldGoodsByBankPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "sales",
      eyebrow: "Learning objective",
      title: "Sales",
      body:
        "By the end of this section, you should be able to record cash sales, bank sales, and credit sales, use a named debtor account, and avoid using Sales A/c for asset sales or other receipts.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-sales",
      eyebrow: "Concept explanation",
      title: "What Sales A/c records",
      paragraphs: [
        "Sales A/c records goods sold by the business in the ordinary course of its trading activities.",
        "Goods means the items in which the business normally deals.",
        "Sales A/c is not used merely because the business sells something. Selling furniture, machinery, a vehicle, or another business asset is not normally recorded in Sales A/c.",
        "Sales may be made for cash, through bank, or on credit.",
        "Sales income normally increases on the credit side.",
      ],
    },
    {
      type: "concept-explanation",
      id: "central-sales-rules",
      eyebrow: "Central rules",
      title: "Two rules to remember",
      paragraphs: [
        "Goods sold in the ordinary course of business → Sales A/c.",
        "The receipt mode or named customer identifies the debited account.",
      ],
    },
    {
      type: "comparison",
      id: "goods-sold-versus-assets-sold",
      eyebrow: "Goods versus assets",
      title: "Purpose decides whether Sales A/c is used",
      intro:
        "The same physical item may be goods for one business and an asset for another business, depending on the business purpose.",
      groups: [
        {
          title: "Goods sold in normal trading",
          items: [
            "Furniture dealer sells furniture to customers → Sales A/c.",
            "Mobile-phone dealer sells phones to customers → Sales A/c.",
            "Transaction: Sold goods for cash ₹15,000.",
            "Entry: Cash A/c Dr.; To Sales A/c.",
          ],
        },
        {
          title: "Asset sold by the business",
          items: [
            "Coaching centre sells old office furniture → asset sale treatment later.",
            "Another business sells an old office phone → asset disposal treatment later.",
            "Do not use Sales A/c merely because an asset was sold.",
            "Detailed asset sale treatment is marked Later / design-needed.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "sales-classification",
      eyebrow: "Classification",
      title: "How Sales A/c is classified here",
      intro:
        "This section stays in journal-entry logic and does not teach full Trading Account preparation yet.",
      groups: [
        {
          title: "Modern view",
          items: [
            "Sales A/c is an Income / Revenue account.",
            "When goods are sold, Sales income increases.",
            "An increase in Sales is credited.",
          ],
        },
        {
          title: "Traditional view",
          items: [
            "Sales A/c is a Nominal Account.",
            "The golden rule is credit all incomes and gains.",
            "Therefore Sales A/c is credited when goods are sold.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "cash-sale-format",
      eyebrow: "Cash sale",
      title: "Sold goods for cash",
      paragraphs: [
        "Transaction: Sold goods for cash ₹12,000.",
        "Cash asset increases because physical cash is received, so Cash A/c is debited.",
        "Sales income increases because goods are sold, so Sales A/c is credited. Bank A/c is not affected.",
      ],
      formatRows: [
        { id: "cash-sale-cash-debit", particulars: "Cash A/c Dr.", lf: "", debitDisplay: "12,000" },
        { id: "cash-sale-sales-credit", particulars: "To Sales A/c", lf: "", creditDisplay: "12,000" },
        { id: "cash-sale-narration", particulars: "(Being goods sold for cash.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "bank-sale-format",
      eyebrow: "Bank sale",
      title: "Sales proceeds received through bank",
      paragraphs: [
        "Transaction: Sold goods and received ₹18,000 through bank.",
        "Bank A/c is debited because money enters the business bank account.",
        "Sales A/c is credited because sales income increases. Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "bank-sale-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "18,000" },
        { id: "bank-sale-sales-credit", particulars: "To Sales A/c", lf: "", creditDisplay: "18,000" },
        { id: "bank-sale-narration", particulars: "(Being goods sold and proceeds received through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "credit-sale-format",
      eyebrow: "Credit sale",
      title: "Sold goods on credit to Riya",
      paragraphs: [
        "Transaction: Sold goods on credit to Riya ₹20,000.",
        "Riya becomes a debtor / receivable asset, so Riya A/c is debited.",
        "Sales A/c is credited because goods are sold. Cash and Bank are not affected at the time of credit sale.",
      ],
      formatRows: [
        { id: "credit-sale-riya-debit", particulars: "Riya A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-sale-sales-credit", particulars: "To Sales A/c", lf: "", creditDisplay: "20,000" },
        { id: "credit-sale-narration", particulars: "(Being goods sold on credit to Riya.)" },
      ],
    },
    {
      type: "comparison",
      id: "named-customer-account",
      eyebrow: "Named customer",
      title: "Use the customer's account in a credit sale",
      intro:
        "A credit sale creates an amount receivable from the customer. The named customer is debited because they owe money to the business.",
      groups: [
        {
          title: "Use the named customer",
          items: [
            "Riya A/c.",
            "Mohan A/c.",
            "ABC Stores A/c.",
            "Priyanka Traders A/c.",
          ],
        },
        {
          title: "Do not use these instead",
          items: [
            "Do not use Cash A/c.",
            "Do not use Bank A/c.",
            "Do not use generic Debtor A/c when the customer is named.",
            "Do not write Sales A/c on both sides.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "sales-versus-other-receipts",
      eyebrow: "Sales versus other receipts",
      title: "Not every receipt is Sales",
      intro:
        "Cash or Bank may increase in all three cases, but only the trading receipt is Sales. The source and purpose decide the credited account.",
      groups: [
        {
          title: "Sales receipt",
          items: [
            "Source: sale of goods in the ordinary course of business.",
            "Effect: Sales income increases.",
            "Example: Cash A/c Dr.",
            "To Sales A/c.",
          ],
        },
        {
          title: "Capital receipt",
          items: [
            "Source: owner or partner.",
            "Effect: Capital increases.",
            "Example: Bank A/c Dr.",
            "To Amit's Capital A/c.",
          ],
        },
        {
          title: "Loan receipt",
          items: [
            "Source: lender or bank.",
            "Effect: Liability increases.",
            "Example: Bank A/c Dr.",
            "To Bank Loan A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "credit-sale-and-later-receipt-format",
      eyebrow: "Credit sale and receipt",
      title: "Original sale and later collection are separate",
      paragraphs: [
        "At the time of credit sale, the customer becomes a debtor.",
        "When the customer later pays, the debtor is settled.",
        "Sales A/c is not credited again when the customer pays. Cash/Bank is affected only when payment is received.",
      ],
      formatRows: [
        { id: "credit-sale-entry-one-label", particulars: "Transaction 1: Sold goods on credit to Riya ₹20,000" },
        { id: "credit-sale-entry-one-debit", particulars: "Riya A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-sale-entry-one-credit", particulars: "To Sales A/c", lf: "", creditDisplay: "20,000" },
        { id: "credit-sale-entry-two-label", particulars: "Transaction 2: Received ₹20,000 from Riya through bank" },
        { id: "credit-sale-entry-two-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-sale-entry-two-credit", particulars: "To Riya A/c", lf: "", creditDisplay: "20,000" },
      ],
    },
    {
      type: "concept-explanation",
      id: "partial-receipt-note",
      eyebrow: "Partial receipt",
      title: "If a debtor pays only part of the amount",
      paragraphs: [
        "Debit Cash A/c or Bank A/c with the amount actually received.",
        "Credit the debtor with the amount settled.",
        "The remaining debtor balance continues until it is settled later.",
        "Example: Riya owes ₹20,000 and pays ₹12,000 through bank. Entry: Bank A/c Dr. ₹12,000; To Riya A/c ₹12,000.",
        "Detailed debtor-balancing and discount treatment is later/design-needed.",
      ],
    },
    {
      type: "concept-explanation",
      id: "sales-discounts-and-returns-boundary",
      eyebrow: "Later / design-needed",
      title: "Discounts and sales returns are later topics",
      paragraphs: [
        "Trade discount reduces the listed price before recording the sale. Example: goods listed at ₹20,000 less 10% trade discount are recorded at ₹18,000.",
        "If sold on credit to Riya, the journal entry is made at the net invoice amount: Riya A/c Dr. ₹18,000; To Sales A/c ₹18,000.",
        "Trade discount is normally not recorded separately in the journal.",
        "Cash discount may be allowed later to encourage prompt payment and may require Discount Allowed A/c.",
        "Sales Returns / Returns Inward treatment is a later linked subtopic.",
        "Detailed trade discount, cash discount, and sales returns practice is marked Later / design-needed in this preview.",
      ],
    },
    {
      type: "recap",
      id: "sales-source-documents",
      title: "Common source documents",
      points: [
        "Cash memo.",
        "Sales invoice.",
        "Customer invoice.",
        "Receipt.",
        "Bank credit record.",
        "Delivery note where applicable.",
        "Source documents support the recording of the sale; this preview does not add document upload, invoice parsing, or OCR.",
      ],
    },
    {
      type: "solved-illustration",
      id: "sales-cash-goods",
      illustration: {
        id: "sales-cash-goods",
        title: "Solved Illustration 1: cash sale",
        difficulty: "easy",
        question: "Sold goods for cash ₹15,000.",
        accountsAffected: ["Cash A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Cash received", detail: "Physical cash comes into the business, so Cash A/c is debited." },
          { label: "Goods sold", detail: "Goods are sold in normal trading, so Sales A/c is credited." },
          { label: "No bank", detail: "Bank A/c is not affected." },
        ],
        journalEntry: [
          { id: "sales-cash-goods-debit", account: "Cash A/c", side: "debit", amount: 15000, drNotation: "Dr." },
          { id: "sales-cash-goods-credit", account: "Sales A/c", side: "credit", amount: 15000, displayPrefix: "To" },
        ],
        narration: "Being goods sold for cash.",
        explanation:
          "Cash A/c is debited because cash is received. Sales A/c is credited because sales income increases.",
        studentTakeaway: "For cash sales, use Cash A/c and Sales A/c.",
        commonMistake: "Using Bank A/c when the transaction says cash.",
      },
    },
    {
      type: "solved-illustration",
      id: "sales-bank-goods",
      illustration: {
        id: "sales-bank-goods",
        title: "Solved Illustration 2: bank sale",
        difficulty: "easy",
        question: "Sold goods and received ₹22,000 through bank.",
        accountsAffected: ["Bank A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Bank received", detail: "Money enters the business bank account, so Bank A/c is debited." },
          { label: "Sales credited", detail: "Sales A/c is credited because goods are sold." },
          { label: "No cash", detail: "Cash A/c is not affected." },
        ],
        journalEntry: [
          { id: "sales-bank-goods-debit", account: "Bank A/c", side: "debit", amount: 22000, drNotation: "Dr." },
          { id: "sales-bank-goods-credit", account: "Sales A/c", side: "credit", amount: 22000, displayPrefix: "To" },
        ],
        narration: "Being goods sold and proceeds received through bank.",
        explanation:
          "Bank A/c is debited because bank balance increases. Sales A/c is credited because sales income increases.",
        studentTakeaway: "Through bank means Bank A/c, not Cash A/c.",
        commonMistake: "Debiting Cash A/c for a bank receipt.",
      },
    },
    {
      type: "solved-illustration",
      id: "sales-credit-to-mohan",
      illustration: {
        id: "sales-credit-to-mohan",
        title: "Solved Illustration 3: credit sale",
        difficulty: "easy",
        question: "Sold goods on credit to Mohan ₹25,000.",
        accountsAffected: ["Mohan A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Named debtor", detail: "Mohan A/c is debited because Mohan owes the business." },
          { label: "Sales credited", detail: "Sales A/c is credited because goods are sold." },
          { label: "No cash/bank now", detail: "Cash A/c and Bank A/c are not affected at the sale date." },
        ],
        journalEntry: [
          { id: "sales-credit-mohan-debit", account: "Mohan A/c", side: "debit", amount: 25000, drNotation: "Dr." },
          { id: "sales-credit-mohan-credit", account: "Sales A/c", side: "credit", amount: 25000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Mohan.",
        explanation:
          "The sale creates a debtor. Mohan A/c is debited because Mohan owes the business, and Sales A/c is credited.",
        studentTakeaway: "In credit sales, use the customer's name instead of Cash or Bank.",
        commonMistake: "Using Cash A/c or Bank A/c even though the sale is on credit.",
      },
    },
    {
      type: "solved-illustration",
      id: "sales-credit-and-later-collection",
      illustration: {
        id: "sales-credit-and-later-collection",
        title: "Solved Illustration 4: credit sale and later collection",
        difficulty: "slightly-harder",
        question: "Sold goods on credit to Riya ₹20,000 and later received the amount through bank.",
        accountsAffected: ["Riya A/c", "Sales A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Sale date", detail: "Riya A/c Dr. and To Sales A/c create the debtor." },
          { label: "Receipt date", detail: "Bank A/c Dr. and To Riya A/c settle the debtor." },
          { label: "No duplicate sales", detail: "Sales A/c is not credited again when Riya pays." },
        ],
        journalEntry: [
          { id: "sales-collection-riya-debit", account: "Riya A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "sales-collection-sales-credit", account: "Sales A/c", side: "credit", amount: 20000, displayPrefix: "To" },
          { id: "sales-collection-bank-debit", account: "Bank A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "sales-collection-riya-credit", account: "Riya A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Riya and later amount received through bank.",
        explanation:
          "The two entries are displayed together only to compare them. The sale creates the debtor; the later receipt settles it.",
        studentTakeaway: "Do not credit Sales A/c again when the debtor pays later.",
        commonMistake: "Recording a second Sales entry when the customer pays.",
      },
    },
    {
      type: "solved-illustration",
      id: "sales-old-furniture-asset-guard",
      illustration: {
        id: "sales-old-furniture-asset-guard",
        title: "Solved Illustration 5: asset-sale distinction",
        difficulty: "mixed",
        question: "Sold old furniture for cash ₹8,000.",
        accountsAffected: ["Furniture A/c", "Cash A/c", "Asset disposal treatment later"],
        reasoningSteps: [
          { label: "Asset sold", detail: "Old furniture is a business asset, not trading goods for most businesses." },
          { label: "Not ordinary Sales", detail: "Sales A/c is not used merely because the furniture was sold." },
          { label: "Later / design-needed", detail: "Correct treatment depends on book value, depreciation, and gain or loss on disposal." },
        ],
        journalEntry: [],
        narration: "Later / design-needed: asset disposal treatment is deferred.",
        explanation:
          "This preview intentionally avoids a simplified journal entry because asset disposal may need Machinery/Furniture A/c, accumulated depreciation, book value, and profit or loss treatment.",
        studentTakeaway: "Do not treat every sale as Sales A/c; decide whether trading goods or a business asset was sold.",
        commonMistake: "Crediting Sales A/c for sale of an old business asset without considering asset-disposal treatment.",
      },
    },
    {
      type: "common-mistakes",
      id: "sales-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Sales mistakes",
      mistakes: [
        "Debiting Sales A/c when sales increase.",
        "Using Purchases A/c instead of Sales A/c.",
        "Using Cash A/c for a credit sale.",
        "Using Bank A/c for a cash sale.",
        "Ignoring the named customer.",
        "Using generic Debtor A/c when the customer is named.",
        "Crediting the customer at the time of credit sale.",
        "Recording Sales A/c again when the debtor later pays.",
        "Treating a capital receipt or loan as Sales.",
        "Using Sales A/c for the sale of a business asset.",
        "Recording trade discount separately.",
        "Confusing trade discount with cash discount.",
        "Assuming every receipt is income.",
        "Failing to distinguish goods from assets.",
      ],
    },
    {
      type: "process-steps",
      id: "sales-decision-process",
      eyebrow: "Decision process",
      title: "Sales decision process",
      body:
        "Use this order before writing a sales-related journal entry.",
      steps: [
        { label: "Identify what was sold", detail: "Read the item, amount, customer, and receipt mode." },
        { label: "Decide the purpose", detail: "Ask whether it is trading goods or a business asset." },
        { label: "Use Sales for trading goods", detail: "If goods are sold in the ordinary course, use Sales A/c." },
        { label: "Identify receipt mode", detail: "Decide whether payment is cash, bank, or credit." },
        { label: "Debit Cash for cash receipt", detail: "Use Cash A/c when physical cash is received." },
        { label: "Debit Bank for bank receipt", detail: "Use Bank A/c when money enters the business bank account." },
        { label: "Debit named customer for credit sale", detail: "Use the customer's account when payment is not received immediately." },
        { label: "Credit Sales A/c", detail: "Credit Sales A/c because sales income increases." },
        { label: "Avoid Cash/Bank for unpaid credit sale", detail: "Cash/Bank is not used before payment is received." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "State what was sold and how payment was made." },
        { label: "Check later topics", detail: "Discount, return, or asset-disposal treatment may belong to a later topic." },
      ],
    },
    {
      type: "recap",
      id: "sales-checklist",
      title: "Sales checklist",
      points: [
        "The item sold is trading goods.",
        "Sales A/c is appropriate.",
        "An asset sale has not been mistaken for a goods sale.",
        "The receipt mode is identified correctly.",
        "The named debtor is used for credit sale.",
        "Cash/Bank is not used before payment is received.",
        "Sales A/c is credited.",
        "Debit and credit totals are equal.",
        "Narration states what was sold and how payment was made.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "sold-goods-by-bank-practice",
      question: soldGoodsByBankPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "sales-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Was the business selling its normal goods, disposing of an asset, or receiving money for some other reason—and who now owes or receives the value?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const expensesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...expensesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG}`,
  shortDescription:
    "Learn specific expense accounts, cash/bank payments, outstanding expenses, and business-purpose guardrails.",
  learningObjective:
    "Students learn to debit the specific expense account when a business cost is incurred, then credit Cash, Bank, or an outstanding liability depending on payment status.",
  progressLabel: "Section 12 of 16",
  previousSection: salesSubtopicReference,
  nextSection: incomeSubtopicReference,
  practiceQuestionIds: [paidRentByCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "expenses",
      eyebrow: "Learning objective",
      title: "Expenses",
      body:
        "By the end of this section, you should be able to record expenses paid in cash or through bank, identify outstanding expenses, and avoid treating personal expenses, assets, or goods purchases as ordinary expenses.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-expense",
      eyebrow: "Concept explanation",
      title: "What a business expense means",
      paragraphs: [
        "An expense is a cost incurred to operate the business or earn revenue.",
        "Expenses normally reduce business profit.",
        "Examples include salary, rent, electricity, repairs, insurance, carriage, and advertising.",
        "Use the exact expense name in the journal. Do not write generic Expense A/c when Salary A/c, Rent A/c, or another specific account is known.",
        "An expense may be paid immediately or may remain payable.",
        "Drawings are not business expenses because the benefit is personal.",
      ],
    },
    {
      type: "concept-explanation",
      id: "central-expense-rule",
      eyebrow: "Central rule",
      title: "Start with the business purpose",
      paragraphs: [
        "Expense incurred for business purpose → Expense A/c increases → Debit the specific Expense A/c.",
        "If paid in cash, credit Cash A/c.",
        "If paid through bank, credit Bank A/c.",
        "If incurred but not yet paid, credit the appropriate Outstanding or Payable account.",
      ],
    },
    {
      type: "comparison",
      id: "expense-classification",
      eyebrow: "Classification",
      title: "How expense accounts are classified here",
      intro:
        "This section stays in journal-entry recognition and does not prepare the full Trading Account or Profit and Loss Account.",
      groups: [
        {
          title: "Modern view",
          items: [
            "Expense / Loss account.",
            "Increase in expense → Debit.",
            "Decrease or reversal of an expense → Credit.",
          ],
        },
        {
          title: "Traditional view",
          items: [
            "Expense accounts are Nominal Accounts.",
            "The golden rule is debit all expenses and losses.",
            "Therefore the expense account is debited when the expense is incurred.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "specific-expense-account-names",
      eyebrow: "Specific account names",
      title: "Use the exact expense account",
      intro:
        "A journal entry should name the actual cost wherever the question gives enough detail.",
      groups: [
        {
          title: "Use these specific accounts",
          items: [
            "Salary paid → Salary A/c.",
            "Office rent paid → Rent A/c.",
            "Electricity bill paid → Electricity Expense A/c.",
            "Machinery repaired → Repairs A/c.",
            "Business insurance paid → Insurance A/c.",
            "Advertisement paid → Advertising A/c.",
            "Carriage paid → Carriage A/c.",
          ],
        },
        {
          title: "Avoid generic names",
          items: [
            "Do not write Expense A/c when a specific expense is known.",
            "Do not write Payment A/c.",
            "Do not write General Cost A/c.",
            "Do not treat every payment as an expense.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "cash-expense-format",
      eyebrow: "Cash expense",
      title: "Expense paid in cash",
      paragraphs: [
        "Transaction: Paid office rent in cash ₹5,000.",
        "Rent expense increases because the business incurred office rent, so Rent A/c is debited.",
        "Cash asset decreases because physical cash is paid, so Cash A/c is credited. Bank A/c is not affected.",
      ],
      formatRows: [
        { id: "cash-expense-rent-debit", particulars: "Rent A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "cash-expense-cash-credit", particulars: "To Cash A/c", lf: "", creditDisplay: "5,000" },
        { id: "cash-expense-narration", particulars: "(Being office rent paid in cash.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "paid-rent-by-cash-practice",
      question: paidRentByCashPracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "bank-expense-format",
      eyebrow: "Bank expense",
      title: "Expense paid through bank",
      paragraphs: [
        "Transaction: Paid salary by bank ₹8,000.",
        "Salary expense increases, so Salary A/c is debited.",
        "Bank asset decreases because payment is through bank, so Bank A/c is credited. Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "bank-expense-salary-debit", particulars: "Salary A/c Dr.", lf: "", debitDisplay: "8,000" },
        { id: "bank-expense-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "8,000" },
        { id: "bank-expense-narration", particulars: "(Being salary paid by bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "outstanding-expense-format",
      eyebrow: "Outstanding expense",
      title: "Expense incurred but not yet paid",
      paragraphs: [
        "Transaction: Salary ₹4,000 became due but was not paid.",
        "Salary expense is incurred, so Salary A/c is debited.",
        "Outstanding Salary is a liability because payment is still due, so Outstanding Salary A/c is credited.",
        "Cash and Bank are not affected because payment has not occurred. This is an introductory adjustment entry.",
      ],
      formatRows: [
        { id: "outstanding-salary-debit", particulars: "Salary A/c Dr.", lf: "", debitDisplay: "4,000" },
        { id: "outstanding-salary-credit", particulars: "To Outstanding Salary A/c", lf: "", creditDisplay: "4,000" },
        { id: "outstanding-salary-narration", particulars: "(Being salary due but not yet paid.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "outstanding-expense-later-payment-format",
      eyebrow: "Outstanding and payment",
      title: "Recording the expense and later payment are separate",
      paragraphs: [
        "When the expense first becomes due, record the expense and the outstanding liability.",
        "When the liability is later paid, reduce Outstanding Salary and Bank.",
        "Salary A/c is not debited again when the liability is settled. This avoids recording the same expense twice.",
      ],
      formatRows: [
        { id: "salary-due-label", particulars: "Transaction 1: Salary ₹4,000 became due but was not paid" },
        { id: "salary-due-debit", particulars: "Salary A/c Dr.", lf: "", debitDisplay: "4,000" },
        { id: "salary-due-credit", particulars: "To Outstanding Salary A/c", lf: "", creditDisplay: "4,000" },
        { id: "salary-paid-label", particulars: "Transaction 2: Outstanding salary later paid by bank" },
        { id: "salary-paid-debit", particulars: "Outstanding Salary A/c Dr.", lf: "", debitDisplay: "4,000" },
        { id: "salary-paid-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "4,000" },
      ],
    },
    {
      type: "comparison",
      id: "business-expense-versus-personal-expense",
      eyebrow: "Business versus personal",
      title: "Purpose decides whether it is expense or drawings",
      intro:
        "Both transactions may be paid through Bank A/c, but the purpose decides the debit account.",
      groups: [
        {
          title: "Business expense",
          items: [
            "Transaction: Paid office electricity bill through bank ₹3,000.",
            "Entry: Electricity Expense A/c Dr. ₹3,000; To Bank A/c ₹3,000.",
            "Reason: The cost relates to the business.",
          ],
        },
        {
          title: "Personal expense",
          items: [
            "Transaction: The business paid Amit's personal mobile bill through bank ₹3,000.",
            "Entry: Amit Drawings A/c Dr. ₹3,000; To Bank A/c ₹3,000.",
            "Reason: The benefit is personal, so the amount is drawings rather than a business expense.",
            "Do not use Telephone Expense A/c or Mobile Expense A/c for the business when the benefit is personal.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "expense-versus-asset-purchase",
      eyebrow: "Expense versus asset",
      title: "Repairing an asset is different from buying an asset",
      intro:
        "Buying an asset is not automatically an expense. The distinction between capital and revenue expenditure is studied more deeply later.",
      groups: [
        {
          title: "Expense",
          items: [
            "Transaction: Paid machinery repair charges by bank ₹5,000.",
            "Entry: Repairs A/c Dr. ₹5,000; To Bank A/c ₹5,000.",
            "Reason: The repair maintains the existing asset.",
          ],
        },
        {
          title: "Asset purchase",
          items: [
            "Transaction: Bought machinery through bank ₹50,000.",
            "Entry: Machinery A/c Dr. ₹50,000; To Bank A/c ₹50,000.",
            "Reason: A new business asset is acquired.",
            "Major improvements or installation costs may need different treatment.",
            "Detailed capital-versus-revenue expenditure treatment is Later / design-needed.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "expense-versus-purchase-of-goods",
      eyebrow: "Expense versus purchases",
      title: "Purchases A/c and Expense A/c are not interchangeable",
      intro:
        "Both may appear on the debit side, but they represent different business purposes.",
      groups: [
        {
          title: "Goods bought for resale",
          items: [
            "Purchases A/c Dr.",
            "To Cash/Bank/Supplier A/c.",
            "Purchases A/c is for trading goods bought for resale.",
          ],
        },
        {
          title: "Cost incurred to operate the business",
          items: [
            "Specific Expense A/c Dr.",
            "To Cash/Bank/Payable A/c.",
            "Expense accounts record operating or revenue costs.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "direct-and-indirect-expense-note",
      eyebrow: "Later / linked to Final Accounts",
      title: "Direct and indirect expense placement comes later",
      intro:
        "This preview focuses only on journal-entry recognition. Detailed placement in Trading Account and Profit and Loss Account belongs to the Final Accounts chapter.",
      groups: [
        {
          title: "Common direct expense examples",
          items: [
            "Carriage inward.",
            "Wages directly related to production.",
            "Freight inward.",
          ],
        },
        {
          title: "Common indirect expense examples",
          items: [
            "Office salary.",
            "Office rent.",
            "Advertising.",
            "Electricity.",
            "General repairs.",
          ],
        },
      ],
    },
    {
      type: "concept-explanation",
      id: "prepaid-expense-note",
      eyebrow: "Later / design-needed",
      title: "Prepaid expenses are adjustment topics",
      paragraphs: [
        "Sometimes an expense is paid before the benefit is fully used.",
        "Example: insurance paid may include an amount relating to the next accounting period.",
        "A possible adjustment concept is Prepaid Insurance A/c Dr.; To Insurance A/c.",
        "Prepaid expense is an asset.",
        "Detailed adjustment calculations belong to Final Accounts.",
        "Detailed prepaid expense treatment is Later / design-needed.",
        "This preview does not add a full solved checking question for prepaid expense.",
      ],
    },
    {
      type: "concept-explanation",
      id: "accrued-and-outstanding-terminology",
      eyebrow: "Terminology",
      title: "Outstanding and accrued expense",
      paragraphs: [
        "Outstanding expense means an expense has been incurred but remains unpaid.",
        "Accrued expense may be used with similar meaning in some contexts.",
        "Use the terminology followed by the applicable textbook or exam format.",
        "The accounting concept is that expense and liability both increase.",
      ],
    },
    {
      type: "recap",
      id: "expense-source-documents",
      title: "Common source documents",
      points: [
        "Salary sheet.",
        "Rent receipt.",
        "Electricity bill.",
        "Insurance receipt.",
        "Repair invoice.",
        "Bank statement.",
        "Payment voucher.",
        "Source documents support the amount, date, business purpose, and payment mode; this preview does not add uploads, OCR, invoice extraction, or document parsing.",
      ],
    },
    {
      type: "solved-illustration",
      id: "expenses-cash-rent",
      illustration: {
        id: "expenses-cash-rent",
        title: "Solved Illustration 1: cash rent",
        difficulty: "easy",
        question: "Paid office rent in cash ₹6,000.",
        accountsAffected: ["Rent A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Business cost", detail: "Office rent is a business expense, so Rent A/c is used." },
          { label: "Expense increases", detail: "Rent expense increases, so Rent A/c is debited." },
          { label: "Cash paid", detail: "Physical cash leaves the business, so Cash A/c is credited." },
        ],
        journalEntry: [
          { id: "expenses-rent-cash-debit", account: "Rent A/c", side: "debit", amount: 6000, drNotation: "Dr." },
          { id: "expenses-rent-cash-credit", account: "Cash A/c", side: "credit", amount: 6000, displayPrefix: "To" },
        ],
        narration: "Being office rent paid in cash.",
        explanation:
          "Rent A/c is debited because the business incurred rent. Cash A/c is credited because cash is paid.",
        studentTakeaway: "For cash-paid expenses, debit the specific expense and credit Cash A/c.",
        commonMistake: "Crediting Bank A/c when the transaction says cash.",
      },
    },
    {
      type: "solved-illustration",
      id: "expenses-bank-salary",
      illustration: {
        id: "expenses-bank-salary",
        title: "Solved Illustration 2: salary by bank",
        difficulty: "easy",
        question: "Paid staff salary through bank ₹12,000.",
        accountsAffected: ["Salary A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Salary expense", detail: "Salary is a business expense, so Salary A/c is debited." },
          { label: "Bank paid", detail: "Money leaves the bank account, so Bank A/c is credited." },
          { label: "No cash", detail: "Cash A/c is not affected." },
        ],
        journalEntry: [
          { id: "expenses-salary-bank-debit", account: "Salary A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "expenses-salary-bank-credit", account: "Bank A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being staff salary paid through bank.",
        explanation:
          "Salary A/c is debited because the expense increases. Bank A/c is credited because payment is through bank.",
        studentTakeaway: "Through bank means Bank A/c, not Cash A/c.",
        commonMistake: "Using Cash A/c for a bank-paid expense.",
      },
    },
    {
      type: "solved-illustration",
      id: "expenses-outstanding-electricity",
      illustration: {
        id: "expenses-outstanding-electricity",
        title: "Solved Illustration 3: outstanding expense",
        difficulty: "slightly-harder",
        question: "Electricity expense ₹4,500 became due but was not paid.",
        accountsAffected: ["Electricity Expense A/c", "Outstanding Electricity Expense A/c"],
        reasoningSteps: [
          { label: "Expense incurred", detail: "Electricity Expense A/c is debited because the expense is due." },
          { label: "Liability created", detail: "Outstanding Electricity Expense A/c is credited because payment remains due." },
          { label: "No payment yet", detail: "Cash A/c and Bank A/c are not affected." },
        ],
        journalEntry: [
          { id: "expenses-electricity-outstanding-debit", account: "Electricity Expense A/c", side: "debit", amount: 4500, drNotation: "Dr." },
          { id: "expenses-electricity-outstanding-credit", account: "Outstanding Electricity Expense A/c", side: "credit", amount: 4500, displayPrefix: "To" },
        ],
        narration: "Being electricity expense due but not yet paid.",
        explanation:
          "The expense has been incurred, so Electricity Expense A/c is debited. A liability is created, so Outstanding Electricity Expense A/c is credited.",
        studentTakeaway: "For unpaid expenses, credit the outstanding liability instead of Cash or Bank.",
        commonMistake: "Crediting Cash A/c or Bank A/c even though no payment has happened.",
      },
    },
    {
      type: "solved-illustration",
      id: "expenses-outstanding-salary-paid-later",
      illustration: {
        id: "expenses-outstanding-salary-paid-later",
        title: "Solved Illustration 4: outstanding expense later paid",
        difficulty: "slightly-harder",
        question: "Salary ₹5,000 became due but was not paid. The outstanding salary was later paid through bank.",
        accountsAffected: ["Salary A/c", "Outstanding Salary A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Expense creation", detail: "Salary A/c Dr. and To Outstanding Salary A/c record the unpaid expense." },
          { label: "Liability settlement", detail: "Outstanding Salary A/c Dr. and To Bank A/c settle the liability later." },
          { label: "No duplicate salary", detail: "Salary A/c is not debited again when the outstanding amount is paid." },
        ],
        journalEntry: [
          { id: "expenses-salary-due-debit", account: "Salary A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "expenses-salary-due-credit", account: "Outstanding Salary A/c", side: "credit", amount: 5000, displayPrefix: "To" },
          { id: "expenses-salary-paid-later-debit", account: "Outstanding Salary A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "expenses-salary-paid-later-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being salary due and later outstanding salary paid through bank.",
        explanation:
          "The first entry records the expense and liability. The second entry settles the liability through bank without recording Salary A/c again.",
        studentTakeaway: "Do not debit the expense a second time when an outstanding liability is paid.",
        commonMistake: "Recording Salary A/c Dr. again on the payment date.",
      },
    },
    {
      type: "solved-illustration",
      id: "expenses-personal-insurance-guard",
      illustration: {
        id: "expenses-personal-insurance-guard",
        title: "Solved Illustration 5: personal expense guard",
        difficulty: "mixed",
        question: "The business paid Priyanka's personal insurance premium ₹4,000 through bank.",
        accountsAffected: ["Priyanka Drawings A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Personal benefit", detail: "The insurance premium benefits Priyanka personally, not the business." },
          { label: "Drawings increase", detail: "Priyanka Drawings A/c is debited." },
          { label: "Bank paid", detail: "Bank A/c is credited because payment is through bank." },
        ],
        journalEntry: [
          { id: "expenses-priyanka-drawings-debit", account: "Priyanka Drawings A/c", side: "debit", amount: 4000, drNotation: "Dr." },
          { id: "expenses-priyanka-bank-credit", account: "Bank A/c", side: "credit", amount: 4000, displayPrefix: "To" },
        ],
        narration: "Being Priyanka's personal insurance premium paid through bank.",
        explanation:
          "Because the benefit is personal, the debit is Priyanka Drawings A/c. It is not Insurance Expense A/c of the business.",
        studentTakeaway: "Personal expenses paid by the business are drawings, not business expenses.",
        commonMistake: "Debiting Insurance Expense A/c for a personal insurance premium.",
      },
    },
    {
      type: "solved-illustration",
      id: "expenses-furniture-asset-guard",
      illustration: {
        id: "expenses-furniture-asset-guard",
        title: "Solved Illustration 6: asset versus expense guard",
        difficulty: "mixed",
        question: "Bought office furniture through bank ₹30,000.",
        accountsAffected: ["Furniture A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Asset acquired", detail: "Office furniture is a business asset." },
          { label: "Asset increases", detail: "Furniture A/c is debited." },
          { label: "Bank paid", detail: "Bank A/c is credited because payment is through bank." },
        ],
        journalEntry: [
          { id: "expenses-furniture-debit", account: "Furniture A/c", side: "debit", amount: 30000, drNotation: "Dr." },
          { id: "expenses-furniture-bank-credit", account: "Bank A/c", side: "credit", amount: 30000, displayPrefix: "To" },
        ],
        narration: "Being office furniture purchased through bank.",
        explanation:
          "Furniture A/c is debited because a business asset is acquired. It is not Furniture Expense A/c and not Purchases A/c.",
        studentTakeaway: "Do not treat asset purchases as ordinary expenses.",
        commonMistake: "Debiting Furniture Expense A/c or Purchases A/c for office furniture.",
      },
    },
    {
      type: "common-mistakes",
      id: "expenses-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Expenses mistakes",
      mistakes: [
        "Crediting an expense when it increases.",
        "Using a generic Expense A/c.",
        "Using Cash A/c when payment is through bank.",
        "Using Bank A/c when payment is in cash.",
        "Using Cash or Bank for an unpaid expense.",
        "Treating a personal expense as a business expense.",
        "Treating drawings as an expense.",
        "Treating an asset purchase as an expense.",
        "Treating a repair as purchase of machinery.",
        "Recording the expense again when an outstanding liability is later paid.",
        "Debiting Bank or Cash instead of the expense.",
        "Ignoring the payment mode.",
        "Assuming every business payment is an expense.",
        "Confusing Purchases A/c with an operating expense.",
        "Treating prepaid expense as a current-period expense without adjustment.",
      ],
    },
    {
      type: "process-steps",
      id: "expense-decision-process",
      eyebrow: "Decision process",
      title: "Expense decision process",
      body:
        "Use this order before writing an expense-related journal entry.",
      steps: [
        { label: "Identify the cost", detail: "Read what cost was incurred and the amount." },
        { label: "Confirm business purpose", detail: "Check that the cost relates to the business, not someone's personal benefit." },
        { label: "Use a specific expense account", detail: "Use Salary A/c, Rent A/c, Electricity Expense A/c, Repairs A/c, or another exact account." },
        { label: "Check payment status", detail: "Decide whether payment was in cash, through bank, or remains unpaid." },
        { label: "Debit the expense", detail: "Debit the specific Expense A/c because the expense increases." },
        { label: "Credit Cash for cash payment", detail: "Use Cash A/c when physical cash is paid." },
        { label: "Credit Bank for bank payment", detail: "Use Bank A/c when payment is through bank." },
        { label: "Credit outstanding if unpaid", detail: "Use the appropriate Outstanding or Payable account if the expense remains unpaid." },
        { label: "Check other treatments", detail: "Confirm the item is not an asset, purchase of goods, drawings, or another type of transaction." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "State the expense and whether it was paid or remains outstanding." },
        { label: "Mark later adjustments", detail: "Prepaid or other adjustment treatment may belong to a later topic." },
      ],
    },
    {
      type: "recap",
      id: "expenses-checklist",
      title: "Expense checklist",
      points: [
        "The cost relates to the business.",
        "A specific expense account is used.",
        "The item is not an asset.",
        "The item is not goods for resale.",
        "The item is not a personal expense or drawings.",
        "Cash, Bank, or Outstanding account is selected correctly.",
        "The Expense A/c is debited.",
        "The expense is not recorded twice when later paid.",
        "Debit and credit totals are equal.",
        "Narration explains the expense and payment status.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "expenses-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Was this cost incurred for the business, for an asset, for goods to resell, or for someone's personal benefit—and has it been paid yet?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const incomeJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...incomeSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_INCOME_SECTION_SLUG}`,
  shortDescription:
    "Learn specific income accounts, cash/bank receipts, accrued income, advance receipts, and receipt-versus-income guardrails.",
  learningObjective:
    "Students learn to credit the specific income account when income is earned, then debit Cash, Bank, or an accrued-income receivable depending on receipt status.",
  progressLabel: "Section 13 of 16",
  previousSection: expensesSubtopicReference,
  nextSection: assetsAndLiabilitiesSubtopicReference,
  practiceQuestionIds: [receivedCommissionInCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "income",
      eyebrow: "Learning objective",
      title: "Income",
      body:
        "By the end of this section, you should be able to record income received in cash or through bank, recognise accrued income and income received in advance, and avoid treating capital, loans, or debtor collections as current income.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-income",
      eyebrow: "Concept explanation",
      title: "What business income means",
      paragraphs: [
        "Income is value earned by the business through operations or other business-related activities.",
        "Income generally increases profit.",
        "Examples include Sales A/c, Commission Received A/c, Interest Received A/c, Rent Received A/c, and Fees Received A/c.",
        "Use the exact income account name in the journal. Generic Income A/c should not replace a known specific account such as Commission Received A/c.",
        "Income may be received immediately or may remain receivable.",
        "Receiving money does not automatically mean income has been earned. Capital introduced, loans received, and debtor collections are not current income.",
      ],
    },
    {
      type: "concept-explanation",
      id: "central-income-rule",
      eyebrow: "Central rule",
      title: "Start with whether income is earned",
      paragraphs: [
        "Income earned by the business → Income A/c increases → Credit the specific Income A/c.",
        "If received in cash, debit Cash A/c.",
        "If received through bank, debit Bank A/c.",
        "If earned but not yet received, debit the suitable Accrued Income or Receivable account.",
        "If cash or bank is received before the income is earned, credit Income Received in Advance A/c as a liability.",
      ],
    },
    {
      type: "comparison",
      id: "income-classification",
      eyebrow: "Classification",
      title: "How income accounts are classified here",
      intro:
        "This section explains journal-entry recognition only. Complete Profit and Loss Account preparation comes later.",
      groups: [
        {
          title: "Modern view",
          items: [
            "Income / Revenue account.",
            "Increase in income → Credit.",
            "Decrease or reversal of income → Debit.",
          ],
        },
        {
          title: "Traditional view",
          items: [
            "Income accounts are Nominal Accounts.",
            "The golden rule is credit all incomes and gains.",
            "Examples include Sales A/c, Commission Received A/c, Interest Received A/c, Rent Received A/c, Fees Received A/c, and Discount Received A/c later.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "specific-income-account-names",
      eyebrow: "Specific account names",
      title: "Use the exact income account",
      intro:
        "The specific account name tells the source of income. Avoid vague names when the transaction gives clear detail.",
      groups: [
        {
          title: "Use these specific accounts",
          items: [
            "Commission earned → Commission Received A/c.",
            "Interest earned → Interest Received A/c.",
            "Rent earned → Rent Received A/c.",
            "Fees earned → Fees Received A/c.",
            "Goods sold → Sales A/c.",
          ],
        },
        {
          title: "Avoid vague names",
          items: [
            "Do not write Income A/c when a specific income is known.",
            "Do not write Receipt A/c.",
            "Do not write Money Received A/c.",
            "Do not write Earnings A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "cash-income-format",
      eyebrow: "Cash income",
      title: "Income received in cash",
      paragraphs: [
        "Transaction: Received commission in cash ₹5,000.",
        "Cash asset increases because physical cash is received, so Cash A/c is debited.",
        "Commission income increases because the business earned commission, so Commission Received A/c is credited.",
        "Cash A/c is used because physical cash is received. Bank A/c is not affected.",
      ],
      formatRows: [
        { id: "cash-income-cash-debit", particulars: "Cash A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "cash-income-commission-credit", particulars: "To Commission Received A/c", lf: "", creditDisplay: "5,000" },
        { id: "cash-income-narration", particulars: "(Being commission received in cash.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "received-commission-in-cash-practice",
      question: receivedCommissionInCashPracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "bank-income-format",
      eyebrow: "Bank income",
      title: "Income received through bank",
      paragraphs: [
        "Transaction: Received interest through bank ₹4,000.",
        "Bank asset increases because the amount enters the business bank account, so Bank A/c is debited.",
        "Interest income increases, so Interest Received A/c is credited.",
        "Bank A/c is used because the receipt is through bank. Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "bank-income-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "4,000" },
        { id: "bank-income-interest-credit", particulars: "To Interest Received A/c", lf: "", creditDisplay: "4,000" },
        { id: "bank-income-narration", particulars: "(Being interest received through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "accrued-income-format",
      eyebrow: "Accrued income",
      title: "Income earned but not yet received",
      paragraphs: [
        "Transaction: Commission ₹3,000 was earned but not yet received.",
        "Accrued Commission is an asset or receivable because the business now has a right to receive the amount, so Accrued Commission A/c is debited.",
        "Commission income has been earned, so Commission Received A/c is credited.",
        "Cash and Bank are not affected yet because no money has been received.",
      ],
      formatRows: [
        { id: "accrued-commission-debit", particulars: "Accrued Commission A/c Dr.", lf: "", debitDisplay: "3,000" },
        { id: "accrued-commission-credit", particulars: "To Commission Received A/c", lf: "", creditDisplay: "3,000" },
        { id: "accrued-commission-narration", particulars: "(Being commission earned but not yet received.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "accrued-income-later-receipt-format",
      eyebrow: "Accrued then received",
      title: "Earning income and receiving it later are separate",
      paragraphs: [
        "When commission is earned, record Accrued Commission A/c Dr. and To Commission Received A/c.",
        "When the accrued commission is later received through bank, record Bank A/c Dr. and To Accrued Commission A/c.",
        "Commission Received A/c is not credited again. The later receipt converts the receivable asset into Bank and avoids recording the same income twice.",
      ],
      formatRows: [
        { id: "commission-earned-label", particulars: "Transaction 1: Commission ₹3,000 was earned but not yet received" },
        { id: "commission-earned-accrued-debit", particulars: "Accrued Commission A/c Dr.", lf: "", debitDisplay: "3,000" },
        { id: "commission-earned-income-credit", particulars: "To Commission Received A/c", lf: "", creditDisplay: "3,000" },
        { id: "commission-received-label", particulars: "Transaction 2: Accrued commission later received through bank" },
        { id: "commission-received-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "3,000" },
        { id: "commission-received-accrued-credit", particulars: "To Accrued Commission A/c", lf: "", creditDisplay: "3,000" },
      ],
    },
    {
      type: "accounting-format",
      id: "income-received-in-advance-format",
      eyebrow: "Income received in advance",
      title: "Cash received before income is earned",
      paragraphs: [
        "Transaction: Received rent in advance through bank ₹6,000.",
        "Bank increases because money enters the business bank account, so Bank A/c is debited.",
        "Rent Received in Advance is a liability because the related service or period has not yet been completed, so Rent Received in Advance A/c is credited.",
        "The amount is not current income yet. Do not credit Rent Received A/c immediately for the unearned amount.",
      ],
      formatRows: [
        { id: "advance-rent-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "6,000" },
        { id: "advance-rent-liability-credit", particulars: "To Rent Received in Advance A/c", lf: "", creditDisplay: "6,000" },
        { id: "advance-rent-narration", particulars: "(Being rent received in advance through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "advance-income-later-recognition-format",
      eyebrow: "Later / linked to Final Accounts",
      title: "Recognising income received in advance later",
      paragraphs: [
        "When the related rent is later earned, the liability is reduced and income is recognised.",
        "The introductory adjustment is Rent Received in Advance A/c Dr. and To Rent Received A/c.",
        "Detailed period calculations and Final Accounts adjustments come later. This preview does not add checker support or complex calculations.",
      ],
      formatRows: [
        { id: "advance-rent-earned-debit", particulars: "Rent Received in Advance A/c Dr.", lf: "", debitDisplay: "6,000" },
        { id: "advance-rent-earned-credit", particulars: "To Rent Received A/c", lf: "", creditDisplay: "6,000" },
      ],
    },
    {
      type: "comparison",
      id: "income-earned-versus-cash-received",
      eyebrow: "Earned versus received",
      title: "Income earned and cash received are related but separate",
      intro:
        "Accounting asks whether income has been earned. Receipt timing decides whether Cash, Bank, a receivable, or a liability is used.",
      groups: [
        {
          title: "Income earned and received",
          items: ["Cash/Bank A/c Dr.", "To Specific Income A/c."],
        },
        {
          title: "Income earned but not received",
          items: ["Accrued Income A/c Dr.", "To Specific Income A/c."],
        },
        {
          title: "Cash received but income not yet earned",
          items: ["Cash/Bank A/c Dr.", "To Income Received in Advance A/c."],
        },
      ],
    },
    {
      type: "comparison",
      id: "income-versus-ordinary-receipts",
      eyebrow: "Income versus receipts",
      title: "Not every receipt is income",
      intro:
        "All these examples may increase Cash or Bank, but only the amount earned through business activity is current income.",
      groups: [
        {
          title: "Income receipt",
          items: [
            "Source: value earned by business activity.",
            "Entry: Bank A/c Dr.; To Commission Received A/c.",
          ],
        },
        {
          title: "Capital receipt",
          items: [
            "Source: owner or partner.",
            "Entry: Bank A/c Dr.; To Amit's Capital A/c.",
          ],
        },
        {
          title: "Loan receipt",
          items: [
            "Source: lender.",
            "Entry: Bank A/c Dr.; To Bank Loan A/c.",
          ],
        },
        {
          title: "Collection from debtor",
          items: [
            "Source: settlement of an existing receivable.",
            "Entry: Bank A/c Dr.; To Riya A/c.",
            "Receiving money from a debtor does not create income again.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "sales-versus-other-income",
      eyebrow: "Sales versus other income",
      title: "Use Sales only for goods sold in trading",
      intro:
        "Do not combine all income under Sales A/c. Match the account name to the income source.",
      groups: [
        {
          title: "Sales A/c",
          items: [
            "Records goods sold in ordinary trading activities.",
            "Use Sales A/c when trading goods are sold.",
          ],
        },
        {
          title: "Other income accounts",
          items: [
            "Commission Received A/c.",
            "Interest Received A/c.",
            "Rent Received A/c.",
            "Fees Received A/c.",
          ],
        },
        {
          title: "Commission example",
          items: [
            "Transaction: Received commission through bank ₹5,000.",
            "Correct: Bank A/c Dr.; To Commission Received A/c.",
            "Incorrect: Bank A/c Dr.; To Sales A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "debtor-collection-not-income-format",
      eyebrow: "Debtor collection",
      title: "Collection from a debtor is not new income",
      paragraphs: [
        "Transaction: Received ₹10,000 from Riya through bank against an earlier credit sale.",
        "Bank increases because money is received through bank, so Bank A/c is debited.",
        "Riya A/c is credited because the existing debtor balance is reduced.",
        "Sales income was recorded when the goods were sold on credit. The later receipt does not credit Sales A/c or another Income A/c again.",
      ],
      formatRows: [
        { id: "debtor-riya-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "10,000" },
        { id: "debtor-riya-credit", particulars: "To Riya A/c", lf: "", creditDisplay: "10,000" },
        { id: "debtor-riya-narration", particulars: "(Being amount received from Riya through bank.)" },
      ],
    },
    {
      type: "concept-explanation",
      id: "income-refund-reversal-note",
      eyebrow: "Later / design-needed",
      title: "Refunds and reversals need careful design",
      paragraphs: [
        "If income previously recorded must be refunded, reversed, or adjusted, the treatment depends on the underlying account and reason.",
        "This preview marks refund or reversal treatment as Later / design-needed.",
        "No checker, broad solver support, or adjustment engine is added in this section.",
      ],
    },
    {
      type: "concept-explanation",
      id: "direct-indirect-income-note",
      eyebrow: "Later / linked to Final Accounts",
      title: "Direct and indirect income placement comes later",
      paragraphs: [
        "Sales is usually the main operating or trading income.",
        "Commission Received, Rent Received, and Interest Received may be other incomes depending on the business.",
        "Detailed Trading Account and Profit and Loss Account placement belongs to the Final Accounts chapter.",
        "This preview stays with journal-entry recognition only.",
      ],
    },
    {
      type: "recap",
      id: "income-source-documents",
      title: "Common source documents",
      points: [
        "Cash receipt.",
        "Bank statement.",
        "Commission statement.",
        "Rent receipt.",
        "Interest advice.",
        "Customer payment record.",
        "Income voucher.",
        "Source documents support the amount, date, income source, payment mode, and whether the amount was earned or received in advance; this preview does not add uploads, OCR, extraction, or document parsing.",
      ],
    },
    {
      type: "solved-illustration",
      id: "income-commission-cash",
      illustration: {
        id: "income-commission-cash",
        title: "Solved Illustration 1: commission received in cash",
        difficulty: "easy",
        question: "Received commission in cash ₹6,000.",
        accountsAffected: ["Cash A/c", "Commission Received A/c"],
        reasoningSteps: [
          { label: "Cash received", detail: "Physical cash enters the business, so Cash A/c is debited." },
          { label: "Specific income", detail: "Commission was earned, so Commission Received A/c is used." },
          { label: "Income credited", detail: "Income increases on the credit side." },
        ],
        journalEntry: [
          { id: "income-commission-cash-debit", account: "Cash A/c", side: "debit", amount: 6000, drNotation: "Dr." },
          { id: "income-commission-cash-credit", account: "Commission Received A/c", side: "credit", amount: 6000, displayPrefix: "To" },
        ],
        narration: "Being commission received in cash.",
        explanation:
          "Cash A/c is debited because cash is received. Commission Received A/c is credited because commission income is earned.",
        studentTakeaway: "For cash income, debit Cash and credit the specific income account.",
        commonMistake: "Using Bank A/c or a generic Income A/c.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-interest-bank",
      illustration: {
        id: "income-interest-bank",
        title: "Solved Illustration 2: interest through bank",
        difficulty: "easy",
        question: "Received interest through bank ₹4,500.",
        accountsAffected: ["Bank A/c", "Interest Received A/c"],
        reasoningSteps: [
          { label: "Bank received", detail: "The amount enters the business bank account, so Bank A/c is debited." },
          { label: "Interest income", detail: "Interest Received A/c is the specific income account." },
          { label: "Income credited", detail: "Interest income increases on the credit side." },
        ],
        journalEntry: [
          { id: "income-interest-bank-debit", account: "Bank A/c", side: "debit", amount: 4500, drNotation: "Dr." },
          { id: "income-interest-bank-credit", account: "Interest Received A/c", side: "credit", amount: 4500, displayPrefix: "To" },
        ],
        narration: "Being interest received through bank.",
        explanation:
          "Bank A/c is debited instead of Cash A/c because the receipt is through bank. Interest Received A/c is credited.",
        studentTakeaway: "Receipt mode decides Cash or Bank; the earned income is still credited.",
        commonMistake: "Debiting Cash A/c when the question says through bank.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-accrued-commission",
      illustration: {
        id: "income-accrued-commission",
        title: "Solved Illustration 3: accrued income",
        difficulty: "slightly-harder",
        question: "Commission ₹3,500 was earned but not yet received.",
        accountsAffected: ["Accrued Commission A/c", "Commission Received A/c"],
        reasoningSteps: [
          { label: "Income earned", detail: "Commission has been earned, so Commission Received A/c is credited." },
          { label: "Receivable created", detail: "The amount is not yet received, so Accrued Commission A/c is debited." },
          { label: "No cash or bank", detail: "Cash A/c and Bank A/c are not used because no receipt happened yet." },
        ],
        journalEntry: [
          { id: "income-accrued-commission-debit", account: "Accrued Commission A/c", side: "debit", amount: 3500, drNotation: "Dr." },
          { id: "income-accrued-commission-credit", account: "Commission Received A/c", side: "credit", amount: 3500, displayPrefix: "To" },
        ],
        narration: "Being commission earned but not yet received.",
        explanation:
          "The business has a right to receive commission, so an accrued income asset is recorded. Commission Received A/c is credited because the income is earned.",
        studentTakeaway: "Accrued income is an asset until the amount is received.",
        commonMistake: "Debiting Cash A/c or Bank A/c before money is received.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-accrued-interest-later-received",
      illustration: {
        id: "income-accrued-interest-later-received",
        title: "Solved Illustration 4: accrued income later received",
        difficulty: "slightly-harder",
        question: "Interest ₹5,000 was earned but not yet received. The accrued interest was later received through bank.",
        accountsAffected: ["Accrued Interest A/c", "Interest Received A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "When earned", detail: "Accrued Interest A/c Dr. and To Interest Received A/c record the earned income." },
          { label: "When later received", detail: "Bank A/c Dr. and To Accrued Interest A/c settle the receivable." },
          { label: "No double income", detail: "Interest Received A/c is not credited again on later receipt." },
        ],
        journalEntry: [
          { id: "income-interest-earned-debit", account: "Accrued Interest A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "income-interest-earned-credit", account: "Interest Received A/c", side: "credit", amount: 5000, displayPrefix: "To" },
          { id: "income-interest-received-bank-debit", account: "Bank A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "income-interest-received-accrued-credit", account: "Accrued Interest A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being interest earned and later accrued interest received through bank.",
        explanation:
          "Income is recognised once when earned. The later bank receipt only converts Accrued Interest into Bank.",
        studentTakeaway: "Do not credit the income account again when an accrued receivable is collected.",
        commonMistake: "Crediting Interest Received A/c again at the receipt date.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-rent-received-in-advance",
      illustration: {
        id: "income-rent-received-in-advance",
        title: "Solved Illustration 5: income received in advance",
        difficulty: "slightly-harder",
        question: "Received rent in advance through bank ₹8,000.",
        accountsAffected: ["Bank A/c", "Rent Received in Advance A/c"],
        reasoningSteps: [
          { label: "Bank increases", detail: "Money enters the business bank account, so Bank A/c is debited." },
          { label: "Liability created", detail: "The rent is not earned yet, so Rent Received in Advance A/c is credited." },
          { label: "Not current income", detail: "Rent Received A/c is not credited for the unearned amount yet." },
        ],
        journalEntry: [
          { id: "income-advance-rent-bank-debit", account: "Bank A/c", side: "debit", amount: 8000, drNotation: "Dr." },
          { id: "income-advance-rent-credit", account: "Rent Received in Advance A/c", side: "credit", amount: 8000, displayPrefix: "To" },
        ],
        narration: "Being rent received in advance through bank.",
        explanation:
          "The business has received money before earning the related rent, so the credit is a liability rather than current Rent Received income.",
        studentTakeaway: "Income received in advance is a liability until it is earned.",
        commonMistake: "Crediting Rent Received A/c immediately for unearned rent.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-debtor-collection-guard",
      illustration: {
        id: "income-debtor-collection-guard",
        title: "Solved Illustration 6: debtor collection guard case",
        difficulty: "mixed",
        question: "Received ₹12,000 from Mohan through bank against an earlier credit sale.",
        accountsAffected: ["Bank A/c", "Mohan A/c"],
        reasoningSteps: [
          { label: "Bank received", detail: "The business receives money through bank, so Bank A/c is debited." },
          { label: "Debtor reduced", detail: "Mohan A/c is credited because the existing debtor balance is settled." },
          { label: "No new income", detail: "Sales was recorded at the earlier credit sale and is not credited again." },
        ],
        journalEntry: [
          { id: "income-mohan-bank-debit", account: "Bank A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "income-mohan-credit", account: "Mohan A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being amount received from Mohan through bank.",
        explanation:
          "This is collection of an existing debtor, not new income. Sales A/c is not credited again.",
        studentTakeaway: "Debtor collection settles a receivable; it does not create a second income entry.",
        commonMistake: "Crediting Sales A/c when a debtor pays later.",
      },
    },
    {
      type: "solved-illustration",
      id: "income-capital-receipt-guard",
      illustration: {
        id: "income-capital-receipt-guard",
        title: "Solved Illustration 7: capital receipt guard case",
        difficulty: "mixed",
        question: "Amit introduced ₹20,000 through bank as additional capital.",
        accountsAffected: ["Bank A/c", "Amit's Capital A/c"],
        reasoningSteps: [
          { label: "Bank received", detail: "Money enters the business bank account, so Bank A/c is debited." },
          { label: "Capital source", detail: "The source is Amit as owner/partner, not income earned from business activity." },
          { label: "Named capital", detail: "Use Amit's Capital A/c, not Income A/c or generic Capital A/c." },
        ],
        journalEntry: [
          { id: "income-capital-bank-debit", account: "Bank A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "income-capital-amit-credit", account: "Amit's Capital A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being additional capital introduced by Amit through bank.",
        explanation:
          "The receipt is capital, not income. Bank increases and Amit's Capital increases.",
        studentTakeaway: "A money receipt from the owner or partner is capital unless the business has earned income.",
        commonMistake: "Crediting Income A/c merely because bank balance increases.",
      },
    },
    {
      type: "common-mistakes",
      id: "income-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Income mistakes",
      mistakes: [
        "Debiting Income A/c when income increases.",
        "Using a generic Income A/c.",
        "Using Cash A/c when receipt is through bank.",
        "Using Bank A/c when physical cash is received.",
        "Using Cash or Bank when income is only accrued.",
        "Treating income received in advance as current income.",
        "Treating capital introduced as income.",
        "Treating loan received as income.",
        "Crediting Sales A/c for commission or interest.",
        "Crediting income again when a debtor pays.",
        "Recording accrued income again when it is later received.",
        "Using the wrong receivable account.",
        "Treating all receipts as profit.",
        "Ignoring whether income has been earned.",
        "Confusing income with asset or liability settlement.",
      ],
    },
    {
      type: "process-steps",
      id: "income-decision-process",
      eyebrow: "Decision process",
      title: "Income decision process",
      body:
        "Use this order before writing an income-related journal entry.",
      steps: [
        { label: "Identify entitlement", detail: "Ask why the business is entitled to the amount." },
        { label: "Classify the receipt", detail: "Decide whether the amount is earned income, capital, loan, or debtor collection." },
        { label: "Use specific income", detail: "Use the specific Income A/c if income is earned." },
        { label: "Check receipt status", detail: "Determine whether the amount is received in cash, through bank, or remains receivable." },
        { label: "Debit Cash for cash", detail: "Use Cash A/c when physical cash is received." },
        { label: "Debit Bank for bank", detail: "Use Bank A/c when money enters the business bank account." },
        { label: "Debit accrued income if unpaid", detail: "Use Accrued Income or a receivable account if income is earned but not received." },
        { label: "Credit specific income", detail: "Credit the specific Income A/c when income is earned." },
        { label: "Handle advances carefully", detail: "If received before earning, credit Income Received in Advance A/c instead." },
        { label: "Avoid double income", detail: "Confirm later collection does not record the same income twice." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "State the income source and receipt status clearly." },
      ],
    },
    {
      type: "recap",
      id: "income-checklist",
      title: "Income checklist",
      points: [
        "The amount was earned by the business.",
        "A specific income account is used.",
        "The amount is not capital, loan, or debtor collection.",
        "Cash, Bank, or Accrued Income is selected correctly.",
        "Income received in advance is treated as a liability.",
        "The income account is credited only once.",
        "The payment or receipt mode is correct.",
        "Debit and credit totals are equal.",
        "Narration states the income source and receipt status.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "income-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Did the business earn this amount now, receive it before earning it, or simply collect an amount already due?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const assetsAndLiabilitiesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...assetsAndLiabilitiesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG}`,
  shortDescription:
    "Learn asset and liability increases/decreases, simple asset purchases, loans, creditors, outstanding liabilities, and settlement guardrails.",
  learningObjective:
    "Students learn to identify assets and liabilities, apply increase/decrease debit-credit logic, and distinguish asset or liability treatment from purchases, expenses, income, capital, and drawings.",
  progressLabel: "Section 14 of 16",
  previousSection: incomeSubtopicReference,
  nextSection: mixedSimpleEntriesSubtopicReference,
  practiceQuestionIds: [boughtFurnitureForCashPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "assets-and-liabilities",
      eyebrow: "Learning objective",
      title: "Assets and Liabilities",
      body:
        "By the end of this section, you should be able to identify assets and liabilities, record simple asset purchases, record loans and creditor settlements, and avoid confusing assets or liabilities with purchases, expenses, income, capital, or drawings.",
    },
    {
      type: "concept-explanation",
      id: "meaning-of-assets",
      eyebrow: "Concept explanation",
      title: "What assets mean",
      paragraphs: [
        "Assets are resources owned or controlled by the business.",
        "They provide present or future economic benefit to the business.",
        "Assets may be received, purchased, converted, or used by the business.",
        "Examples include Cash A/c, Bank A/c, Furniture A/c, Machinery A/c, Building A/c, Vehicle A/c, Debtors / Accounts Receivable, Accrued Income, and Prepaid Expense.",
        "Detailed Balance Sheet classification of assets belongs to later chapters. This section focuses on journal-entry treatment.",
      ],
    },
    {
      type: "concept-explanation",
      id: "meaning-of-liabilities",
      eyebrow: "Concept explanation",
      title: "What liabilities mean",
      paragraphs: [
        "Liabilities are amounts or obligations payable to outsiders.",
        "They arise when the business borrows money, purchases on credit, or incurs an unpaid expense.",
        "Examples include Bank Loan A/c, Mohan A/c as creditor, Outstanding Salary A/c, Bills Payable A/c, and Rent Received in Advance A/c.",
        "Capital is not an outside liability, even though it appears on the liabilities/equity side in traditional Balance Sheet presentation.",
      ],
    },
    {
      type: "concept-explanation",
      id: "asset-liability-central-rule",
      eyebrow: "Central rule",
      title: "Use increase and decrease logic",
      paragraphs: [
        "Asset increases → Debit.",
        "Asset decreases → Credit.",
        "Liability increases → Credit.",
        "Liability decreases → Debit.",
        "This logic should be applied after identifying the exact asset, liability, person, or account affected.",
      ],
    },
    {
      type: "comparison",
      id: "current-and-non-current-introduction",
      eyebrow: "Introductory classification",
      title: "Current and non-current idea",
      intro:
        "This is only a first-level guide. Detailed Balance Sheet classification belongs to Final Accounts.",
      groups: [
        {
          title: "Current assets",
          items: [
            "Expected to be realised, sold, or used within the normal operating cycle or a relatively short period.",
            "Examples: Cash, Bank, Debtors, Closing Stock, Accrued Income.",
          ],
        },
        {
          title: "Non-current assets",
          items: [
            "Used by the business over a longer period.",
            "Examples: Furniture, Machinery, Building, Vehicle.",
          ],
        },
        {
          title: "Current liabilities",
          items: [
            "Generally payable within a relatively short period.",
            "Examples: Creditors, Outstanding Expenses, Bills Payable.",
          ],
        },
        {
          title: "Non-current liabilities",
          items: [
            "Longer-term obligations.",
            "Example: Long-term Bank Loan.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "accounting-equation-impact",
      eyebrow: "Accounting equation",
      title: "Assets = Capital + Liabilities",
      intro:
        "Journal entries keep the accounting equation balanced even when assets and liabilities move in different directions.",
      groups: [
        {
          title: "Loan received through bank",
          items: [
            "Bank asset increases.",
            "Loan liability increases.",
            "Bank A/c Dr.; To Bank Loan A/c.",
          ],
        },
        {
          title: "Loan repaid through bank",
          items: [
            "Bank asset decreases.",
            "Loan liability decreases.",
            "Bank Loan A/c Dr.; To Bank A/c.",
          ],
        },
        {
          title: "Asset purchased for cash",
          items: [
            "One asset increases.",
            "Another asset decreases.",
            "Total assets may remain unchanged.",
          ],
        },
        {
          title: "Asset purchased on credit",
          items: [
            "Asset increases.",
            "Liability increases.",
            "Asset A/c Dr.; To Creditor A/c.",
          ],
        },
      ],
    },
    {
      type: "accounting-format",
      id: "asset-purchased-for-cash-format",
      eyebrow: "Asset for cash",
      title: "Asset purchased for cash",
      paragraphs: [
        "Transaction: Bought furniture for cash ₹20,000.",
        "Furniture asset increases, so Furniture A/c is debited.",
        "Cash asset decreases, so Cash A/c is credited.",
        "Purchases A/c is not used because furniture is not bought for resale.",
      ],
      formatRows: [
        { id: "asset-cash-furniture-debit", particulars: "Furniture A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "asset-cash-cash-credit", particulars: "To Cash A/c", lf: "", creditDisplay: "20,000" },
        { id: "asset-cash-narration", particulars: "(Being furniture purchased for cash.)" },
      ],
    },
    {
      type: "practice-it-yourself",
      id: "bought-furniture-for-cash-practice",
      question: boughtFurnitureForCashPracticeQuestion,
    },
    {
      type: "accounting-format",
      id: "asset-purchased-through-bank-format",
      eyebrow: "Asset through bank",
      title: "Asset purchased through bank",
      paragraphs: [
        "Transaction: Bought machinery through bank ₹50,000.",
        "Machinery asset increases, so Machinery A/c is debited.",
        "Bank asset decreases because payment is through bank, so Bank A/c is credited.",
        "Cash A/c is not affected.",
      ],
      formatRows: [
        { id: "asset-bank-machinery-debit", particulars: "Machinery A/c Dr.", lf: "", debitDisplay: "50,000" },
        { id: "asset-bank-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "50,000" },
        { id: "asset-bank-narration", particulars: "(Being machinery purchased through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "asset-purchased-on-credit-format",
      eyebrow: "Asset on credit",
      title: "Asset purchased on credit",
      paragraphs: [
        "Transaction: Bought office furniture on credit from Mohan ₹30,000.",
        "Furniture asset increases, so Furniture A/c is debited.",
        "Mohan becomes a creditor, so Mohan A/c is credited.",
        "Purchases A/c is not used, and Cash A/c or Bank A/c is not affected yet.",
      ],
      formatRows: [
        { id: "asset-credit-furniture-debit", particulars: "Furniture A/c Dr.", lf: "", debitDisplay: "30,000" },
        { id: "asset-credit-mohan-credit", particulars: "To Mohan A/c", lf: "", creditDisplay: "30,000" },
        { id: "asset-credit-narration", particulars: "(Being office furniture purchased on credit from Mohan.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "loan-received-format",
      eyebrow: "Loan received",
      title: "Loan received through bank",
      paragraphs: [
        "Transaction: Received a bank loan of ₹1,00,000 in the business bank account.",
        "Bank increases because money enters the bank account, so Bank A/c is debited.",
        "Bank Loan liability increases, so Bank Loan A/c is credited.",
        "The receipt is not income or capital.",
      ],
      formatRows: [
        { id: "loan-received-bank-debit", particulars: "Bank A/c Dr.", lf: "", debitDisplay: "1,00,000" },
        { id: "loan-received-loan-credit", particulars: "To Bank Loan A/c", lf: "", creditDisplay: "1,00,000" },
        { id: "loan-received-narration", particulars: "(Being bank loan received in the business bank account.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "loan-repayment-format",
      eyebrow: "Loan repayment",
      title: "Loan repaid through bank",
      paragraphs: [
        "Transaction: Repaid bank loan ₹25,000 through bank.",
        "Bank Loan liability decreases, so Bank Loan A/c is debited.",
        "Bank asset decreases because repayment is through bank, so Bank A/c is credited.",
        "Loan repayment itself is not an expense. Interest, if separately given, requires separate treatment later.",
      ],
      formatRows: [
        { id: "loan-repaid-loan-debit", particulars: "Bank Loan A/c Dr.", lf: "", debitDisplay: "25,000" },
        { id: "loan-repaid-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "25,000" },
        { id: "loan-repaid-narration", particulars: "(Being part of the bank loan repaid through bank.)" },
      ],
    },
    {
      type: "accounting-format",
      id: "creditor-creation-and-settlement-format",
      eyebrow: "Creditor lifecycle",
      title: "Creditor creation and settlement",
      paragraphs: [
        "Credit purchase transaction: Purchased goods on credit from Mohan ₹20,000.",
        "Later payment transaction: Paid Mohan through bank ₹20,000.",
        "The first transaction creates the liability. The second settles the liability.",
        "Purchases A/c is not debited again during settlement.",
      ],
      formatRows: [
        { id: "credit-purchase-label", particulars: "Transaction 1: Purchased goods on credit from Mohan ₹20,000" },
        { id: "credit-purchase-purchases-debit", particulars: "Purchases A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "credit-purchase-mohan-credit", particulars: "To Mohan A/c", lf: "", creditDisplay: "20,000" },
        { id: "creditor-payment-label", particulars: "Transaction 2: Paid Mohan through bank ₹20,000" },
        { id: "creditor-payment-mohan-debit", particulars: "Mohan A/c Dr.", lf: "", debitDisplay: "20,000" },
        { id: "creditor-payment-bank-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "20,000" },
      ],
    },
    {
      type: "accounting-format",
      id: "outstanding-liability-format",
      eyebrow: "Outstanding liability",
      title: "Outstanding expense and later payment",
      paragraphs: [
        "Transaction: Salary ₹5,000 became due but was not paid.",
        "Salary expense increases, so Salary A/c is debited.",
        "Outstanding Salary liability increases, so Outstanding Salary A/c is credited.",
        "Cash and Bank are not affected until payment happens. When later paid, debit Outstanding Salary A/c and credit Bank A/c. The expense must not be recorded twice.",
      ],
      formatRows: [
        { id: "outstanding-salary-label", particulars: "Transaction 1: Salary ₹5,000 became due but was not paid" },
        { id: "outstanding-salary-debit", particulars: "Salary A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "outstanding-salary-credit", particulars: "To Outstanding Salary A/c", lf: "", creditDisplay: "5,000" },
        { id: "outstanding-salary-payment-label", particulars: "Transaction 2: Outstanding salary later paid through bank" },
        { id: "outstanding-salary-paid-debit", particulars: "Outstanding Salary A/c Dr.", lf: "", debitDisplay: "5,000" },
        { id: "outstanding-salary-paid-credit", particulars: "To Bank A/c", lf: "", creditDisplay: "5,000" },
      ],
    },
    {
      type: "comparison",
      id: "asset-versus-purchases",
      eyebrow: "Asset versus purchases",
      title: "Purpose decides Furniture A/c or Purchases A/c",
      intro:
        "Do not use Purchases A/c for every item bought. Ask whether the item is for resale or for long-term business use.",
      groups: [
        {
          title: "Goods for resale",
          items: [
            "Entry pattern: Purchases A/c Dr.; To Cash/Bank/Supplier A/c.",
            "Use Purchases A/c when goods are bought for resale.",
          ],
        },
        {
          title: "Asset for business use",
          items: [
            "Entry pattern: Furniture/Machinery A/c Dr.; To Cash/Bank/Supplier A/c.",
            "Use the asset account when the item will be used by the business.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "asset-versus-expense",
      eyebrow: "Asset versus expense",
      title: "Longer benefit is different from routine expense",
      intro:
        "Both asset purchases and expenses may involve Bank A/c, but the debit account depends on the benefit received.",
      groups: [
        {
          title: "Asset acquisition",
          items: [
            "Entry pattern: Machinery A/c Dr.; To Bank A/c.",
            "An asset provides benefit over a longer period.",
          ],
        },
        {
          title: "Routine expense",
          items: [
            "Entry pattern: Repairs A/c Dr.; To Bank A/c.",
            "An expense is generally consumed in operating the business.",
            "Detailed capital-versus-revenue expenditure belongs later.",
            "Later / design-needed.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "liability-versus-income-capital",
      eyebrow: "Liability versus income/capital",
      title: "A bank receipt may have different sources",
      intro:
        "Bank A/c may increase in all three examples. The credit side depends on the source of the receipt.",
      groups: [
        {
          title: "Loan",
          items: [
            "Entry: Bank A/c Dr.; To Bank Loan A/c.",
            "It is an outside liability.",
            "It is repayable.",
            "It is not income.",
          ],
        },
        {
          title: "Capital",
          items: [
            "Entry: Bank A/c Dr.; To Amit's Capital A/c.",
            "It is the owner or partner's claim.",
            "It is not operating income.",
          ],
        },
        {
          title: "Income",
          items: [
            "Entry: Bank A/c Dr.; To Commission Received A/c.",
            "It is earned through business activity.",
            "It affects profit.",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "named-person-context",
      eyebrow: "Named person context",
      title: "A person's account depends on their role",
      intro:
        "Do not classify every named person the same way. Read what the person is doing in the transaction.",
      groups: [
        {
          title: "Customer",
          items: ["Customer owing money → debtor / asset."],
        },
        {
          title: "Supplier",
          items: ["Supplier owed money → creditor / liability."],
        },
        {
          title: "Owner or partner",
          items: [
            "Owner contributing value → Capital A/c.",
            "Partner withdrawing value → Drawings A/c.",
          ],
        },
      ],
    },
    {
      type: "concept-explanation",
      id: "depreciation-linked-note",
      eyebrow: "Later / linked chapter",
      title: "Depreciation comes later",
      paragraphs: [
        "Long-term assets may lose value through use, time, or obsolescence.",
        "This loss in value is recorded through depreciation.",
        "Detailed depreciation entries and calculations belong to the Depreciation chapter.",
        "This section does not add depreciation checker or solver support.",
      ],
    },
    {
      type: "concept-explanation",
      id: "asset-disposal-note",
      eyebrow: "Later / design-needed",
      title: "Asset disposal needs careful treatment",
      paragraphs: [
        "Selling an asset is not automatically Sales A/c.",
        "Treatment may depend on book value, accumulated depreciation, and profit or loss on disposal.",
        "This preview intentionally avoids an oversimplified journal entry for asset disposal.",
      ],
    },
    {
      type: "concept-explanation",
      id: "installation-incidental-costs-note",
      eyebrow: "Later / design-needed",
      title: "Installation and incidental costs need design",
      paragraphs: [
        "Costs directly required to bring an asset into working condition may sometimes form part of its cost.",
        "Examples include freight, installation, testing, and directly attributable setup cost.",
        "Detailed treatment is Later / design-needed, and this section does not add checking support.",
      ],
    },
    {
      type: "solved-illustration",
      id: "assets-furniture-cash",
      illustration: {
        id: "assets-furniture-cash",
        title: "Solved Illustration 1: furniture purchased for cash",
        difficulty: "easy",
        question: "Bought furniture for cash ₹20,000.",
        accountsAffected: ["Furniture A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Classification", detail: "Furniture is an asset used by the business." },
          { label: "Asset increases", detail: "Furniture A/c is debited." },
          { label: "Cash decreases", detail: "Cash A/c is credited because cash is paid." },
        ],
        journalEntry: [
          { id: "assets-furniture-cash-debit", account: "Furniture A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "assets-furniture-cash-credit", account: "Cash A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being furniture purchased for cash.",
        explanation:
          "Furniture A/c is debited because a business asset increases. Cash A/c is credited because physical cash goes out.",
        studentTakeaway: "Asset purchase for use in business uses the asset account, not Purchases A/c.",
        commonMistake: "Debiting Purchases A/c for furniture used in the business.",
      },
    },
    {
      type: "solved-illustration",
      id: "assets-machinery-bank",
      illustration: {
        id: "assets-machinery-bank",
        title: "Solved Illustration 2: machinery purchased through bank",
        difficulty: "easy",
        question: "Bought machinery through bank ₹50,000.",
        accountsAffected: ["Machinery A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Classification", detail: "Machinery is a business asset." },
          { label: "Asset increases", detail: "Machinery A/c is debited." },
          { label: "Bank decreases", detail: "Bank A/c is credited because payment is through bank." },
        ],
        journalEntry: [
          { id: "assets-machinery-bank-debit", account: "Machinery A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          { id: "assets-machinery-bank-credit", account: "Bank A/c", side: "credit", amount: 50000, displayPrefix: "To" },
        ],
        narration: "Being machinery purchased through bank.",
        explanation:
          "Machinery increases as an asset. Bank decreases because payment is made through the bank account.",
        studentTakeaway: "Through bank means Bank A/c is credited when the business pays.",
        commonMistake: "Crediting Cash A/c even though the transaction says through bank.",
      },
    },
    {
      type: "solved-illustration",
      id: "assets-furniture-credit-mohan",
      illustration: {
        id: "assets-furniture-credit-mohan",
        title: "Solved Illustration 3: furniture purchased on credit",
        difficulty: "slightly-harder",
        question: "Bought office furniture on credit from Mohan ₹30,000.",
        accountsAffected: ["Furniture A/c", "Mohan A/c"],
        reasoningSteps: [
          { label: "Classification", detail: "Furniture is an asset and Mohan is a creditor." },
          { label: "Asset increases", detail: "Furniture A/c is debited." },
          { label: "Liability increases", detail: "Mohan A/c is credited because the business owes Mohan." },
        ],
        journalEntry: [
          { id: "assets-furniture-mohan-debit", account: "Furniture A/c", side: "debit", amount: 30000, drNotation: "Dr." },
          { id: "assets-furniture-mohan-credit", account: "Mohan A/c", side: "credit", amount: 30000, displayPrefix: "To" },
        ],
        narration: "Being office furniture purchased on credit from Mohan.",
        explanation:
          "Cash and Bank are not affected because payment has not happened. Mohan A/c is credited as creditor.",
        studentTakeaway: "For credit asset purchases, use the named creditor instead of Cash or Bank.",
        commonMistake: "Crediting Bank A/c for a credit purchase.",
      },
    },
    {
      type: "solved-illustration",
      id: "liabilities-bank-loan-received",
      illustration: {
        id: "liabilities-bank-loan-received",
        title: "Solved Illustration 4: bank loan received",
        difficulty: "easy",
        question: "Received a bank loan of ₹1,00,000 in the business bank account.",
        accountsAffected: ["Bank A/c", "Bank Loan A/c"],
        reasoningSteps: [
          { label: "Classification", detail: "Bank is an asset and Bank Loan is a liability." },
          { label: "Asset increases", detail: "Bank A/c is debited." },
          { label: "Liability increases", detail: "Bank Loan A/c is credited." },
        ],
        journalEntry: [
          { id: "liabilities-loan-bank-debit", account: "Bank A/c", side: "debit", amount: 100000, drNotation: "Dr." },
          { id: "liabilities-loan-credit", account: "Bank Loan A/c", side: "credit", amount: 100000, displayPrefix: "To" },
        ],
        narration: "Being bank loan received in the business bank account.",
        explanation:
          "The receipt increases Bank and creates an outside liability. It is not income and not capital.",
        studentTakeaway: "Loan receipts create liabilities; they do not increase profit.",
        commonMistake: "Crediting Income A/c or Capital A/c for borrowed money.",
      },
    },
    {
      type: "solved-illustration",
      id: "liabilities-bank-loan-repaid",
      illustration: {
        id: "liabilities-bank-loan-repaid",
        title: "Solved Illustration 5: partial loan repayment",
        difficulty: "slightly-harder",
        question: "Repaid bank loan ₹25,000 through bank.",
        accountsAffected: ["Bank Loan A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Classification", detail: "Bank Loan is a liability and Bank is an asset." },
          { label: "Liability decreases", detail: "Bank Loan A/c is debited." },
          { label: "Asset decreases", detail: "Bank A/c is credited because repayment is through bank." },
        ],
        journalEntry: [
          { id: "liabilities-loan-repaid-debit", account: "Bank Loan A/c", side: "debit", amount: 25000, drNotation: "Dr." },
          { id: "liabilities-loan-repaid-credit", account: "Bank A/c", side: "credit", amount: 25000, displayPrefix: "To" },
        ],
        narration: "Being part of the bank loan repaid through bank.",
        explanation:
          "The principal repayment reduces the liability and reduces Bank. It is not an expense by itself.",
        studentTakeaway: "Loan principal repayment decreases a liability; interest treatment is separate.",
        commonMistake: "Debiting Loan Repayment Expense A/c for the principal amount.",
      },
    },
    {
      type: "solved-illustration",
      id: "liabilities-credit-purchase-settlement",
      illustration: {
        id: "liabilities-credit-purchase-settlement",
        title: "Solved Illustration 6: credit purchase and later settlement",
        difficulty: "slightly-harder",
        question: "Purchased goods on credit from Mohan ₹20,000. Later paid Mohan through bank.",
        accountsAffected: ["Purchases A/c", "Mohan A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Credit purchase", detail: "Purchases A/c Dr. and To Mohan A/c create the liability." },
          { label: "Settlement", detail: "Mohan A/c Dr. and To Bank A/c settle the liability later." },
          { label: "No duplicate purchase", detail: "Purchases A/c is not debited again during settlement." },
        ],
        journalEntry: [
          { id: "liabilities-purchase-debit", account: "Purchases A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "liabilities-purchase-mohan-credit", account: "Mohan A/c", side: "credit", amount: 20000, displayPrefix: "To" },
          { id: "liabilities-payment-mohan-debit", account: "Mohan A/c", side: "debit", amount: 20000, drNotation: "Dr." },
          { id: "liabilities-payment-bank-credit", account: "Bank A/c", side: "credit", amount: 20000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased on credit from Mohan and later amount paid through bank.",
        explanation:
          "The first entry records the purchase and liability. The second entry settles Mohan without recording Purchases again.",
        studentTakeaway: "Settlement reduces the creditor; it does not repeat the original purchase.",
        commonMistake: "Debiting Purchases A/c again when paying Mohan.",
      },
    },
    {
      type: "solved-illustration",
      id: "liabilities-outstanding-salary-settlement",
      illustration: {
        id: "liabilities-outstanding-salary-settlement",
        title: "Solved Illustration 7: outstanding salary and later payment",
        difficulty: "slightly-harder",
        question: "Salary ₹5,000 became due but was not paid. Later paid the outstanding salary through bank.",
        accountsAffected: ["Salary A/c", "Outstanding Salary A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Expense due", detail: "Salary A/c Dr. and To Outstanding Salary A/c record the due expense and liability." },
          { label: "Liability settlement", detail: "Outstanding Salary A/c Dr. and To Bank A/c settle the liability later." },
          { label: "No duplicate salary", detail: "Salary A/c is not debited again when the outstanding amount is paid." },
        ],
        journalEntry: [
          { id: "liabilities-salary-debit", account: "Salary A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "liabilities-outstanding-credit", account: "Outstanding Salary A/c", side: "credit", amount: 5000, displayPrefix: "To" },
          { id: "liabilities-outstanding-paid-debit", account: "Outstanding Salary A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "liabilities-outstanding-paid-bank-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being salary due and later outstanding salary paid through bank.",
        explanation:
          "The expense is recorded once when due. Later payment reduces Outstanding Salary and Bank without debiting Salary again.",
        studentTakeaway: "Outstanding liability settlement should not duplicate the original expense.",
        commonMistake: "Debiting Salary A/c again on the payment date.",
      },
    },
    {
      type: "common-mistakes",
      id: "assets-liabilities-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Assets and Liabilities mistakes",
      mistakes: [
        "Using Purchases A/c for every asset bought.",
        "Treating a loan as income.",
        "Treating capital as an outside liability.",
        "Crediting an asset when it increases.",
        "Crediting a liability when it decreases.",
        "Using Cash A/c or Bank A/c for a credit purchase.",
        "Ignoring the named creditor.",
        "Recording Purchases A/c again when paying a creditor.",
        "Recording the expense again when settling an outstanding liability.",
        "Treating loan repayment as an expense.",
        "Using Sales A/c for asset disposal.",
        "Ignoring transaction context for named persons.",
        "Confusing asset purchases with routine expenses.",
        "Assuming every receipt increases profit.",
      ],
    },
    {
      type: "process-steps",
      id: "assets-liabilities-decision-process",
      eyebrow: "Decision process",
      title: "Assets and liabilities decision process",
      body:
        "Use this order before writing an asset or liability journal entry.",
      steps: [
        { label: "Identify resource or obligation", detail: "Read what the business gained, lost, borrowed, owed, or settled." },
        { label: "Classify the account", detail: "Decide whether it is an asset, liability, capital, income, expense, debtor, or creditor." },
        { label: "Decide increase or decrease", detail: "Ask whether each account increases or decreases." },
        { label: "Identify payment or credit mode", detail: "Check whether Cash, Bank, or credit treatment applies." },
        { label: "Debit increasing asset", detail: "Assets increase on the debit side." },
        { label: "Credit decreasing asset", detail: "Assets decrease on the credit side." },
        { label: "Credit increasing liability", detail: "Liabilities increase on the credit side." },
        { label: "Debit decreasing liability", detail: "Liabilities decrease on the debit side." },
        { label: "Use named person accounts", detail: "Use the named debtor, creditor, capital, or drawings account where applicable." },
        { label: "Check the real transaction type", detail: "Confirm it is not actually purchases, sales, expense, income, capital, or drawings." },
        { label: "Confirm totals", detail: "Total debit must equal total credit." },
        { label: "Write narration", detail: "State the asset, liability, payment mode, or settlement clearly." },
      ],
    },
    {
      type: "recap",
      id: "assets-liabilities-checklist",
      title: "Assets and liabilities checklist",
      points: [
        "Asset or liability is identified correctly.",
        "Increase or decrease is identified.",
        "Cash, Bank, or credit treatment is correct.",
        "The named creditor or debtor is used where required.",
        "Asset is not confused with Purchases or Expense.",
        "Liability is not confused with Income or Capital.",
        "Settlement does not duplicate the original expense or purchase.",
        "Loan repayment is not treated as an expense.",
        "Debit and credit totals are equal.",
        "Narration is clear.",
      ],
    },
    {
      type: "reflection-prompt",
      id: "assets-liabilities-reflection",
      eyebrow: "Reflection prompt",
      prompt: "What resource did the business gain or lose, and what obligation was created or settled?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const mixedSimpleEntriesJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...mixedSimpleEntriesSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG}`,
  shortDescription:
    "Consolidate Sections 1-14 by solving simple one-debit, one-credit journal entries without being told the transaction category first.",
  learningObjective:
    "Students learn to read the whole transaction, identify exact accounts, classify them, choose cash/bank/credit treatment, apply debit-credit rules, and check that debit equals credit.",
  progressLabel: "Section 15 of 16",
  previousSection: assetsAndLiabilitiesSubtopicReference,
  nextSection: chapterRecapAndPracticeSubtopicReference,
  practiceQuestionIds: [paidAdvertisingByBankPracticeQuestion.id],
  sections: [
    {
      type: "learning-objective",
      id: "mixed-simple-entries",
      eyebrow: "Learning objective",
      title: "Mixed Simple Entries",
      body:
        "By the end of this section, you should be able to solve a simple journal-entry transaction without being told whether it is cash, bank, credit, purchase, sale, income, expense, capital, drawings, asset, or liability.",
    },
    {
      type: "concept-explanation",
      id: "mixed-simple-entry-boundary",
      eyebrow: "Consolidation section",
      title: "Use the full sentence before choosing accounts",
      paragraphs: [
        "Mixed simple entries bring together the ideas studied so far. The transaction will still be simple: one clear transaction, one clear amount, one debit line, and one credit line.",
        "The challenge is that the topic is not named for you. You must read the wording, identify the exact accounts, classify them, apply debit and credit rules, and then confirm that debit equals credit.",
        "This preview does not add compound-entry checking, GST, discounts with multiple lines, depreciation, asset-disposal profit or loss, Partnership admission or retirement, Company allotment or forfeiture, rectification, closing entries, OCR, or AI-generated checking.",
      ],
    },
    {
      type: "process-steps",
      id: "mixed-entry-solving-method",
      eyebrow: "Mixed-entry solving method",
      title: "Think serially before writing the entry",
      body:
        "Follow this order whenever a transaction category is not given in advance.",
      steps: [
        { label: "Read the complete transaction", detail: "Do not decide from one keyword alone." },
        { label: "Identify the business purpose", detail: "Ask what happened to the business." },
        { label: "Identify every affected account", detail: "Find the two accounts affected by the transaction." },
        { label: "Use exact account names", detail: "Preserve named proprietor, partner, debtor, creditor, asset, income, and expense accounts." },
        { label: "Classify each account", detail: "Decide whether each account is an asset, liability, capital, drawings, income, or expense." },
        { label: "Decide increase or decrease", detail: "Ask whether each account has increased or decreased." },
        { label: "Identify cash, bank, or credit treatment", detail: "Use the payment or receipt wording carefully." },
        { label: "Apply debit and credit rules", detail: "Use account type and increase/decrease logic." },
        { label: "Write the debit account first", detail: "The debited account is written first with Dr." },
        { label: "Write the credited account with To", detail: "The credited account is written below with To." },
        { label: "Enter amounts in the correct columns", detail: "Use the same clear amount on both sides in these simple entries." },
        { label: "Write concise narration", detail: "Explain what happened in one short sentence." },
        { label: "Confirm total debit equals total credit", detail: "A journal entry must balance." },
        { label: "Review special wording", detail: "Check whether a named account, personal use, credit wording, or settlement wording was ignored." },
      ],
    },
    {
      type: "clue-guide",
      id: "mixed-transaction-clue-recap",
      eyebrow: "Transaction-clue recap",
      title: "Clues help, but reasoning decides",
      body:
        "These clues guide account identification. They do not replace reading the whole transaction.",
      clues: [
        { clue: "for cash", likelyAccounts: ["Cash A/c"], note: "Cash is affected immediately." },
        { clue: "through bank / by cheque / UPI / NEFT", likelyAccounts: ["Bank A/c"], note: "Treat the payment or receipt as a bank transaction." },
        { clue: "on credit to a customer", likelyAccounts: ["Named debtor A/c"], note: "Use the customer's name, not Cash or Bank." },
        { clue: "on credit from a supplier", likelyAccounts: ["Named creditor A/c"], note: "Use the supplier's name." },
        { clue: "goods bought for resale", likelyAccounts: ["Purchases A/c"], note: "Do not use the asset name for trading goods." },
        { clue: "goods sold", likelyAccounts: ["Sales A/c"], note: "Use Sales only for normal goods sold." },
        { clue: "furniture or machinery bought", likelyAccounts: ["Named Asset A/c"], note: "Use the asset account when the item is for business use." },
        { clue: "personal use", likelyAccounts: ["Named Drawings A/c"], note: "Personal use changes the treatment." },
        { clue: "introduced by owner or partner", likelyAccounts: ["Named Capital A/c"], note: "Capital is not income." },
        { clue: "loan received", likelyAccounts: ["Loan liability"], note: "Borrowed money must be repaid." },
        { clue: "earned but not received", likelyAccounts: ["Accrued-income asset"], note: "The business has earned income and created a receivable." },
        { clue: "due but not paid", likelyAccounts: ["Outstanding-expense liability"], note: "Expense is recorded once; liability is created." },
        { clue: "received in advance", likelyAccounts: ["Liability"], note: "Advance receipt is not current income yet." },
        { clue: "paid later or received later", likelyAccounts: ["Settlement account"], note: "Do not record the original income or expense again." },
      ],
    },
    {
      type: "comparison",
      id: "what-changes-the-entry",
      eyebrow: "What changes the entry?",
      title: "One wording change can change the account",
      intro:
        "Compare the accounts before applying debit and credit.",
      groups: [
        {
          title: "Cash vs bank vs credit purchase",
          items: [
            "Cash: Purchases A/c Dr.; To Cash A/c.",
            "Bank: Purchases A/c Dr.; To Bank A/c.",
            "Credit from Mohan: Purchases A/c Dr.; To Mohan A/c.",
          ],
        },
        {
          title: "Cash vs bank vs credit sale",
          items: [
            "Cash: Cash A/c Dr.; To Sales A/c.",
            "Bank: Bank A/c Dr.; To Sales A/c.",
            "Credit to Riya: Riya A/c Dr.; To Sales A/c.",
          ],
        },
        {
          title: "Business vs personal withdrawal",
          items: [
            "Business use: Cash A/c Dr.; To Bank A/c.",
            "Personal use: Amit Drawings A/c Dr.; To Bank A/c.",
          ],
        },
        {
          title: "Goods vs asset",
          items: [
            "Goods for resale: Purchases A/c Dr.; To Cash/Bank/Supplier A/c.",
            "Furniture for business use: Furniture A/c Dr.; To Cash/Bank/Supplier A/c.",
          ],
        },
        {
          title: "Capital vs loan vs income",
          items: [
            "Capital: Bank A/c Dr.; To Amit's Capital A/c.",
            "Loan: Bank A/c Dr.; To Bank Loan A/c.",
            "Income: Bank A/c Dr.; To Commission Received A/c.",
          ],
        },
      ],
    },
    {
      type: "solved-illustration",
      id: "mixed-cash-purchase",
      illustration: {
        id: "mixed-cash-purchase",
        title: "Mixed Solved Illustration 1: Cash purchase",
        difficulty: "mixed",
        question: "Bought goods for cash ₹10,000.",
        accountsAffected: ["Purchases A/c", "Cash A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Goods are bought for resale." },
          { label: "Cash treatment", detail: "The transaction says for cash." },
          { label: "Entry logic", detail: "Purchases increases and Cash decreases." },
        ],
        journalEntry: [
          { id: "mixed-cash-purchase-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
          { id: "mixed-cash-purchase-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
        ],
        narration: "Being goods purchased for cash.",
        explanation:
          "Goods bought for resale are recorded in Purchases A/c. Cash is credited because cash goes out.",
        studentTakeaway: "Goods for resale use Purchases A/c, not a fixed asset account.",
        commonMistake: "Using Furniture or Stock A/c without reading that these are goods purchased.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-bank-expense",
      illustration: {
        id: "mixed-bank-expense",
        title: "Mixed Solved Illustration 2: Expense through bank",
        difficulty: "mixed",
        question: "Paid office rent through bank ₹6,000.",
        accountsAffected: ["Rent A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Office rent is a business expense." },
          { label: "Payment mode", detail: "Through bank means Bank A/c is affected." },
          { label: "Entry logic", detail: "Expense increases and Bank decreases." },
        ],
        journalEntry: [
          { id: "mixed-bank-expense-debit", account: "Rent A/c", side: "debit", amount: 6000, drNotation: "Dr." },
          { id: "mixed-bank-expense-credit", account: "Bank A/c", side: "credit", amount: 6000, displayPrefix: "To" },
        ],
        narration: "Being office rent paid through bank.",
        explanation:
          "Rent A/c is debited because the expense is incurred. Bank A/c is credited because payment is made through bank.",
        studentTakeaway: "Business expense plus bank payment usually means Expense A/c Dr.; To Bank A/c.",
        commonMistake: "Debiting Bank just because the word bank appears.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-credit-sale",
      illustration: {
        id: "mixed-credit-sale",
        title: "Mixed Solved Illustration 3: Credit sale",
        difficulty: "mixed",
        question: "Sold goods on credit to Priyanka ₹15,000.",
        accountsAffected: ["Priyanka A/c", "Sales A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Goods are sold in the normal course of business." },
          { label: "Credit treatment", detail: "Priyanka becomes a debtor because cash or bank is not received now." },
          { label: "Entry logic", detail: "Debtor increases and Sales income increases." },
        ],
        journalEntry: [
          { id: "mixed-credit-sale-debit", account: "Priyanka A/c", side: "debit", amount: 15000, drNotation: "Dr." },
          { id: "mixed-credit-sale-credit", account: "Sales A/c", side: "credit", amount: 15000, displayPrefix: "To" },
        ],
        narration: "Being goods sold on credit to Priyanka.",
        explanation:
          "Priyanka A/c is debited as debtor. Sales A/c is credited because goods are sold.",
        studentTakeaway: "For credit sales, use the customer's account instead of Cash or Bank.",
        commonMistake: "Debiting Cash A/c even though the sale is on credit.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-capital-through-bank",
      illustration: {
        id: "mixed-capital-through-bank",
        title: "Mixed Solved Illustration 4: Capital through bank",
        difficulty: "mixed",
        question: "Kuldeep introduced capital of ₹50,000 through bank.",
        accountsAffected: ["Bank A/c", "Kuldeep's Capital A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The owner or partner brings capital into the business." },
          { label: "Receipt mode", detail: "Through bank means Bank A/c increases." },
          { label: "Entry logic", detail: "Capital increases and is credited to the named capital account." },
        ],
        journalEntry: [
          { id: "mixed-capital-bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
          { id: "mixed-capital-bank-credit", account: "Kuldeep's Capital A/c", side: "credit", amount: 50000, displayPrefix: "To" },
        ],
        narration: "Being capital introduced by Kuldeep through bank.",
        explanation:
          "Bank increases, so Bank A/c is debited. Kuldeep's Capital A/c is credited because capital is not income.",
        studentTakeaway: "Preserve the named Capital A/c instead of writing generic Capital A/c.",
        commonMistake: "Crediting Income A/c or generic Capital A/c.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-personal-bank-withdrawal",
      illustration: {
        id: "mixed-personal-bank-withdrawal",
        title: "Mixed Solved Illustration 5: Personal bank withdrawal",
        difficulty: "mixed",
        question: "Riya withdrew ₹4,000 from bank for personal use.",
        accountsAffected: ["Riya Drawings A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The transaction is for personal use, not business use." },
          { label: "Payment mode", detail: "The amount leaves the bank." },
          { label: "Entry logic", detail: "Drawings increase and Bank decreases." },
        ],
        journalEntry: [
          { id: "mixed-drawings-bank-debit", account: "Riya Drawings A/c", side: "debit", amount: 4000, drNotation: "Dr." },
          { id: "mixed-drawings-bank-credit", account: "Bank A/c", side: "credit", amount: 4000, displayPrefix: "To" },
        ],
        narration: "Being amount withdrawn by Riya from bank for personal use.",
        explanation:
          "Personal-use wording creates Drawings A/c. Bank A/c is credited because money leaves the bank.",
        studentTakeaway: "Personal use changes the debit account from Cash to Drawings.",
        commonMistake: "Treating the transaction as Cash A/c Dr.; To Bank A/c.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-asset-on-credit",
      illustration: {
        id: "mixed-asset-on-credit",
        title: "Mixed Solved Illustration 6: Asset on credit",
        difficulty: "mixed",
        question: "Bought office furniture on credit from Mohan ₹25,000.",
        accountsAffected: ["Furniture A/c", "Mohan A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Furniture is a business asset, not goods for resale." },
          { label: "Credit treatment", detail: "Mohan is the creditor because payment is not made now." },
          { label: "Entry logic", detail: "Asset increases and creditor liability increases." },
        ],
        journalEntry: [
          { id: "mixed-asset-credit-debit", account: "Furniture A/c", side: "debit", amount: 25000, drNotation: "Dr." },
          { id: "mixed-asset-credit-credit", account: "Mohan A/c", side: "credit", amount: 25000, displayPrefix: "To" },
        ],
        narration: "Being office furniture purchased on credit from Mohan.",
        explanation:
          "Furniture A/c is debited because a business asset increases. Mohan A/c is credited as the named creditor.",
        studentTakeaway: "Credit asset purchases use the asset account and the named creditor.",
        commonMistake: "Using Purchases A/c or Bank A/c for a credit furniture purchase.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-loan-received",
      illustration: {
        id: "mixed-loan-received",
        title: "Mixed Solved Illustration 7: Loan received",
        difficulty: "mixed",
        question: "Received a bank loan of ₹1,00,000 in the business bank account.",
        accountsAffected: ["Bank A/c", "Bank Loan A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The business borrows money." },
          { label: "Receipt mode", detail: "Money enters the bank account." },
          { label: "Entry logic", detail: "Bank asset increases and loan liability increases." },
        ],
        journalEntry: [
          { id: "mixed-loan-received-debit", account: "Bank A/c", side: "debit", amount: 100000, drNotation: "Dr." },
          { id: "mixed-loan-received-credit", account: "Bank Loan A/c", side: "credit", amount: 100000, displayPrefix: "To" },
        ],
        narration: "Being bank loan received in the business bank account.",
        explanation:
          "The receipt is a liability, not income. Bank increases and Bank Loan A/c is credited.",
        studentTakeaway: "Loan receipts affect the Balance Sheet and are not profit.",
        commonMistake: "Crediting Commission Received A/c or Capital A/c for a loan.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-outstanding-expense-paid",
      illustration: {
        id: "mixed-outstanding-expense-paid",
        title: "Mixed Solved Illustration 8: Outstanding expense paid later",
        difficulty: "mixed",
        question: "Outstanding salary of ₹5,000 was paid through bank.",
        accountsAffected: ["Outstanding Salary A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The business settles an earlier salary liability." },
          { label: "Payment mode", detail: "The payment is through bank." },
          { label: "Entry logic", detail: "Outstanding liability decreases and Bank decreases." },
        ],
        journalEntry: [
          { id: "mixed-outstanding-paid-debit", account: "Outstanding Salary A/c", side: "debit", amount: 5000, drNotation: "Dr." },
          { id: "mixed-outstanding-paid-credit", account: "Bank A/c", side: "credit", amount: 5000, displayPrefix: "To" },
        ],
        narration: "Being outstanding salary paid through bank.",
        explanation:
          "The salary expense was already recorded when it became outstanding. Payment later settles Outstanding Salary A/c and should not debit Salary A/c again.",
        studentTakeaway: "Settlements do not duplicate the original expense.",
        commonMistake: "Debiting Salary A/c again when paying the outstanding liability.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-debtor-collection",
      illustration: {
        id: "mixed-debtor-collection",
        title: "Mixed Solved Illustration 9: Debtor collection",
        difficulty: "mixed",
        question: "Received ₹12,000 from Riya through bank against an earlier credit sale.",
        accountsAffected: ["Bank A/c", "Riya A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The business collects an amount already due from a debtor." },
          { label: "Receipt mode", detail: "The receipt comes through bank." },
          { label: "Entry logic", detail: "Bank increases and the debtor balance decreases." },
        ],
        journalEntry: [
          { id: "mixed-debtor-bank-debit", account: "Bank A/c", side: "debit", amount: 12000, drNotation: "Dr." },
          { id: "mixed-debtor-riya-credit", account: "Riya A/c", side: "credit", amount: 12000, displayPrefix: "To" },
        ],
        narration: "Being amount received from Riya through bank.",
        explanation:
          "This is collection from a debtor, not a new sale. Sales A/c is not credited again.",
        studentTakeaway: "Debtor collections reduce the debtor account and do not repeat income.",
        commonMistake: "Crediting Sales A/c again during collection.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-accrued-income",
      illustration: {
        id: "mixed-accrued-income",
        title: "Mixed Solved Illustration 10: Accrued income",
        difficulty: "mixed",
        question: "Commission ₹3,000 was earned but not yet received.",
        accountsAffected: ["Accrued Commission A/c", "Commission Received A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Income has been earned." },
          { label: "Receipt timing", detail: "Cash or Bank is not received yet." },
          { label: "Entry logic", detail: "A receivable asset is created and income is credited." },
        ],
        journalEntry: [
          { id: "mixed-accrued-income-debit", account: "Accrued Commission A/c", side: "debit", amount: 3000, drNotation: "Dr." },
          { id: "mixed-accrued-income-credit", account: "Commission Received A/c", side: "credit", amount: 3000, displayPrefix: "To" },
        ],
        narration: "Being commission earned but not yet received.",
        explanation:
          "Accrued Commission A/c is debited as an asset. Commission Received A/c is credited because income is earned.",
        studentTakeaway: "Earned but not received creates an accrued-income asset.",
        commonMistake: "Debiting Cash A/c even though money is not yet received.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-income-received-in-advance",
      illustration: {
        id: "mixed-income-received-in-advance",
        title: "Mixed Solved Illustration 11: Income received in advance",
        difficulty: "mixed",
        question: "Received rent in advance through bank ₹8,000.",
        accountsAffected: ["Bank A/c", "Rent Received in Advance A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "The business receives money before earning rent income." },
          { label: "Receipt mode", detail: "The receipt is through bank." },
          { label: "Entry logic", detail: "Bank increases and an advance-income liability is created." },
        ],
        journalEntry: [
          { id: "mixed-advance-income-bank-debit", account: "Bank A/c", side: "debit", amount: 8000, drNotation: "Dr." },
          { id: "mixed-advance-income-credit", account: "Rent Received in Advance A/c", side: "credit", amount: 8000, displayPrefix: "To" },
        ],
        narration: "Being rent received in advance through bank.",
        explanation:
          "The business has not earned the rent yet, so Rent Received in Advance A/c is credited as a liability.",
        studentTakeaway: "Advance receipts are not current income yet.",
        commonMistake: "Crediting Rent Received A/c immediately for an advance.",
      },
    },
    {
      type: "solved-illustration",
      id: "mixed-business-cash-withdrawal",
      illustration: {
        id: "mixed-business-cash-withdrawal",
        title: "Mixed Solved Illustration 12: Business cash withdrawal",
        difficulty: "mixed",
        question: "Cash withdrawn from bank ₹7,000 for office use.",
        accountsAffected: ["Cash A/c", "Bank A/c"],
        reasoningSteps: [
          { label: "Business purpose", detail: "Cash is withdrawn for office use, so value stays in the business." },
          { label: "Transfer type", detail: "One asset changes form from Bank to Cash." },
          { label: "Entry logic", detail: "Cash increases and Bank decreases." },
        ],
        journalEntry: [
          { id: "mixed-business-cash-debit", account: "Cash A/c", side: "debit", amount: 7000, drNotation: "Dr." },
          { id: "mixed-business-bank-credit", account: "Bank A/c", side: "credit", amount: 7000, displayPrefix: "To" },
        ],
        narration: "Being cash withdrawn from bank for office use.",
        explanation:
          "This is a business cash transfer, not drawings, because the purpose is office use.",
        studentTakeaway: "Business use keeps the value inside the business.",
        commonMistake: "Debiting Drawings A/c even though the transaction says office use.",
      },
    },
    {
      type: "comparison",
      id: "mixed-do-not-confuse",
      eyebrow: "Do not confuse",
      title: "Pairs that look similar but behave differently",
      intro:
        "Use these short distinctions before finalising the entry.",
      groups: [
        { title: "Purchases A/c vs Furniture A/c", items: ["Purchases is for goods bought for resale; Furniture is an asset used by the business."] },
        { title: "Sales A/c vs asset disposal", items: ["Sales is for goods sold in trading; asset disposal needs separate design when profit or loss is involved."] },
        { title: "Expense A/c vs Drawings A/c", items: ["Business cost is expense; personal use by owner or partner is drawings."] },
        { title: "Capital A/c vs Loan A/c", items: ["Capital is owner/partner contribution; loan is repayable to an outside party."] },
        { title: "Income A/c vs debtor collection", items: ["Income is credited when earned; debtor collection credits the debtor, not income again."] },
        { title: "Cash A/c vs Bank A/c", items: ["Cash means physical cash; cheque, UPI, NEFT, or bank transfer uses Bank A/c."] },
        { title: "Debtor A/c vs Cash/Bank receipt", items: ["Credit sale creates debtor; later receipt debits Cash/Bank and credits debtor."] },
        { title: "Creditor A/c vs Purchases A/c during later payment", items: ["Paying a creditor reduces creditor; Purchases is not debited again."] },
        { title: "Outstanding Expense A/c vs Expense A/c during settlement", items: ["Paying the due amount reduces the outstanding liability; expense is not recorded twice."] },
        { title: "Accrued Income A/c vs Income A/c during later receipt", items: ["Later receipt credits accrued income, not income again."] },
      ],
    },
    {
      type: "try-before-reveal",
      id: "mixed-try-before-reveal",
      eyebrow: "Try before reveal",
      title: "Try these mentally, then reveal",
      body:
        "These are display-only practice cards. They do not submit answers, score responses, save progress, or use the deterministic checker.",
      prompts: [
        {
          id: "mixed-reveal-electricity-cash",
          prompt: "Paid electricity bill in cash ₹2,500.",
          journalEntry: [
            { id: "mixed-reveal-electricity-debit", account: "Electricity Expense A/c", side: "debit", amount: 2500, drNotation: "Dr." },
            { id: "mixed-reveal-electricity-credit", account: "Cash A/c", side: "credit", amount: 2500, displayPrefix: "To" },
          ],
          narration: "Being electricity bill paid in cash.",
          reasoning: "Electricity is a business expense, and cash leaves the business.",
        },
        {
          id: "mixed-reveal-sales-bank",
          prompt: "Sold goods through bank ₹9,000.",
          journalEntry: [
            { id: "mixed-reveal-sales-bank-debit", account: "Bank A/c", side: "debit", amount: 9000, drNotation: "Dr." },
            { id: "mixed-reveal-sales-bank-credit", account: "Sales A/c", side: "credit", amount: 9000, displayPrefix: "To" },
          ],
          narration: "Being goods sold through bank.",
          reasoning: "Bank increases because money is received through bank, and Sales is credited for goods sold.",
        },
        {
          id: "mixed-reveal-credit-purchase",
          prompt: "Purchased goods on credit from ABC Traders ₹14,000.",
          journalEntry: [
            { id: "mixed-reveal-credit-purchase-debit", account: "Purchases A/c", side: "debit", amount: 14000, drNotation: "Dr." },
            { id: "mixed-reveal-credit-purchase-credit", account: "ABC Traders A/c", side: "credit", amount: 14000, displayPrefix: "To" },
          ],
          narration: "Being goods purchased on credit from ABC Traders.",
          reasoning: "Goods for resale are debited to Purchases, and ABC Traders is credited as creditor.",
        },
        {
          id: "mixed-reveal-amit-capital-bank",
          prompt: "Amit introduced additional capital through bank ₹20,000.",
          journalEntry: [
            { id: "mixed-reveal-capital-bank-debit", account: "Bank A/c", side: "debit", amount: 20000, drNotation: "Dr." },
            { id: "mixed-reveal-capital-bank-credit", account: "Amit's Capital A/c", side: "credit", amount: 20000, displayPrefix: "To" },
          ],
          narration: "Being additional capital introduced by Amit through bank.",
          reasoning: "Bank increases, and Amit's Capital A/c is credited because capital increases.",
        },
        {
          id: "mixed-reveal-commission-cash",
          prompt: "Received commission in cash ₹4,000.",
          journalEntry: [
            { id: "mixed-reveal-commission-cash-debit", account: "Cash A/c", side: "debit", amount: 4000, drNotation: "Dr." },
            { id: "mixed-reveal-commission-cash-credit", account: "Commission Received A/c", side: "credit", amount: 4000, displayPrefix: "To" },
          ],
          narration: "Being commission received in cash.",
          reasoning: "Cash increases, and Commission Received A/c is credited as income.",
        },
        {
          id: "mixed-reveal-bank-loan-repaid",
          prompt: "Repaid bank loan through bank ₹15,000.",
          journalEntry: [
            { id: "mixed-reveal-bank-loan-debit", account: "Bank Loan A/c", side: "debit", amount: 15000, drNotation: "Dr." },
            { id: "mixed-reveal-bank-loan-credit", account: "Bank A/c", side: "credit", amount: 15000, displayPrefix: "To" },
          ],
          narration: "Being bank loan repaid through bank.",
          reasoning: "The loan liability decreases, and Bank decreases because repayment is through bank.",
        },
      ],
    },
    {
      type: "common-mistakes",
      id: "mixed-simple-entries-common-mistakes",
      eyebrow: "Common mistakes",
      title: "Avoid these Mixed Simple Entries mistakes",
      mistakes: [
        "Choosing accounts from one keyword without reading the full transaction.",
        "Using Cash instead of Bank.",
        "Using Cash or Bank for credit transactions.",
        "Using Purchases for a business asset.",
        "Using Sales for an asset disposal.",
        "Treating capital or loan as income.",
        "Treating personal expenses as business expenses.",
        "Treating business withdrawal as drawings.",
        "Recording income or expense twice during later settlement.",
        "Ignoring named debtors, creditors, owners, and partners.",
        "Balancing an entry with conceptually wrong accounts.",
        "Forgetting Dr. or To.",
        "Using incorrect narration.",
        "Entering only amounts without particulars.",
      ],
    },
    {
      type: "process-steps",
      id: "mixed-entry-decision-process",
      eyebrow: "Decision process",
      title: "Mixed-entry decision process",
      body:
        "Use this final process before completing a mixed simple entry.",
      steps: [
        { label: "Read the whole transaction", detail: "Avoid reacting to only one familiar word." },
        { label: "Identify transaction purpose", detail: "Decide whether the business bought, sold, paid, received, borrowed, contributed, withdrew, or settled something." },
        { label: "Identify all affected accounts", detail: "Find exactly two accounts for these simple entries." },
        { label: "Use exact account names", detail: "Preserve names and specific account titles." },
        { label: "Classify the accounts", detail: "Classify before applying rules." },
        { label: "Identify increase or decrease", detail: "Ask what went up or down." },
        { label: "Identify cash, bank, or credit treatment", detail: "Payment and receipt mode changes the account." },
        { label: "Check new transaction or settlement", detail: "Do not record income or expense twice during settlement." },
        { label: "Apply debit and credit", detail: "Use account type plus increase/decrease." },
        { label: "Write the debit line with Dr.", detail: "Debit line comes first." },
        { label: "Write the credit line with To", detail: "Credit line comes below." },
        { label: "Enter amounts", detail: "Simple entries use equal debit and credit amounts." },
        { label: "Write narration", detail: "Keep it short and clear." },
        { label: "Confirm Debit equals Credit", detail: "Totals must match." },
        { label: "Re-read key distinctions", detail: "Check personal/business, goods/asset, capital/loan/income, and paid/due/received wording." },
      ],
    },
    {
      type: "recap",
      id: "mixed-entry-checklist",
      title: "Mixed-entry checklist",
      points: [
        "Both accounts were identified.",
        "Exact account names were used.",
        "Goods were not confused with assets.",
        "Expense was not confused with drawings.",
        "Capital was not confused with income or loan.",
        "Cash/Bank was not used for a credit transaction.",
        "A settlement did not record income or expense twice.",
        "Payment mode was followed.",
        "Debit and credit sides are correct.",
        "Amounts are correct and balanced.",
        "Narration describes the transaction clearly.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "paid-advertising-by-bank-practice",
      question: paidAdvertisingByBankPracticeQuestion,
    },
    {
      type: "reflection-prompt",
      id: "mixed-simple-entries-reflection",
      eyebrow: "Reflection prompt",
      prompt: "Could the entry change if one word - cash, bank, credit, personal, business, due, or received - changed?",
      body: "This is only a thinking prompt. No answer is submitted or checked in this section.",
    },
  ],
};

export const chapterRecapAndPracticeJournalEntriesSubtopic: ChapterSubtopicDefinition = {
  ...chapterRecapAndPracticeSubtopicReference,
  href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG}`,
  shortDescription:
    "Review the full Journal Entries foundation chapter, complete the final checker, and see what remains outside this first prototype.",
  learningObjective:
    "Students consolidate the complete journal-entry method, review common transaction families, and complete the seventeenth interactive practice question.",
  progressLabel: "Section 16 of 16",
  previousSection: mixedSimpleEntriesSubtopicReference,
  practiceQuestionIds: [boughtMachineryByBankPracticeQuestion.id],
  sections: [
    {
      type: "chapter-completion-banner",
      id: "journal-entries-preview-complete",
      title: "Journal Entries foundation chapter preview complete",
      body:
        "You have reached the final static recap page for this internal preview. This is an encouraging checkpoint, not stored student completion.",
      stats: [
        { label: "Progress", value: "Section 16 of 16" },
        { label: "Learning sections reviewed", value: "15" },
        { label: "Interactive practice questions currently available", value: "17" },
      ],
      note:
        "Preview/static only: no completion is saved, no localStorage is written, and no analytics event is sent from this recap.",
    },
    {
      type: "chapter-recap-groups",
      id: "what-the-student-has-learned",
      eyebrow: "Chapter recap",
      title: "What the student has learned",
      body:
        "Use this as a quick map of the foundation ideas before moving into more practice.",
      groups: [
        {
          title: "Foundations",
          items: [
            "Business transactions",
            "Accounts affected",
            "Types of accounts",
            "Debit and credit rules",
            "Journal format",
            "Narration",
          ],
        },
        {
          title: "Transaction recognition",
          items: [
            "Cash and Bank",
            "Capital",
            "Drawings",
            "Purchases",
            "Sales",
            "Expenses",
            "Income",
            "Assets and Liabilities",
          ],
        },
        {
          title: "Application",
          items: [
            "Mixed simple entries",
            "Account-name precision",
            "Payment-mode treatment",
            "Named debtor, creditor, proprietor, and partner accounts",
            "Settlement versus original transaction",
            "Debit-credit balance",
          ],
        },
      ],
    },
    {
      type: "process-steps",
      id: "master-journal-entry-method",
      eyebrow: "Master method",
      title: "Master journal-entry method",
      body:
        "Follow this ordered method before finalising any simple journal entry.",
      steps: [
        { label: "Read the entire transaction.", detail: "Do not decide from one familiar word only." },
        { label: "Identify the business purpose.", detail: "Ask what happened to the business." },
        { label: "Identify every account affected.", detail: "A complete entry needs every affected account." },
        { label: "Use exact account names.", detail: "Preserve names such as Priyanka A/c or Amit's Capital A/c." },
        { label: "Classify each account.", detail: "Decide whether each account is asset, liability, capital, drawings, income, or expense." },
        { label: "Determine whether each account increases or decreases.", detail: "This effect decides the side of the entry." },
        { label: "Identify Cash, Bank, credit, personal, or business treatment.", detail: "Payment mode and purpose can change the account." },
        { label: "Decide whether the transaction creates or settles an earlier balance.", detail: "Do not record income or expense twice during settlement." },
        { label: "Apply debit and credit rules.", detail: "Use account nature plus increase or decrease." },
        { label: "Write the debit account first with Dr.", detail: "The debit line appears first in the journal." },
        { label: "Write the credited account with To.", detail: "The credit line appears below the debit line." },
        { label: "Enter debit and credit amounts.", detail: "Put amounts in the correct columns." },
        { label: "Write a clear narration.", detail: "Explain the transaction in one short sentence." },
        { label: "Confirm total debit equals total credit.", detail: "The entry must balance." },
        { label: "Review the transaction for commonly confused treatments.", detail: "Recheck cash/bank/credit, goods/assets, expense/drawings, and settlement wording." },
      ],
    },
    {
      type: "comparison",
      id: "transaction-family-recap",
      eyebrow: "Transaction-family recap",
      title: "Questions to ask by transaction family",
      intro:
        "These cards help you identify the correct account family before writing Dr. and To.",
      groups: [
        {
          title: "Cash and Bank",
          items: [
            "Is physical cash involved?",
            "Does money move through the bank?",
            "Is it a credit transaction?",
          ],
        },
        {
          title: "Capital and Drawings",
          items: [
            "Is the owner/partner giving value to the business?",
            "Is the owner/partner taking value for personal use?",
          ],
        },
        {
          title: "Purchases and Sales",
          items: [
            "Are trading goods being bought or sold?",
            "Is an asset being confused with goods?",
          ],
        },
        {
          title: "Expenses and Income",
          items: [
            "Is the business incurring a cost?",
            "Has the business earned income?",
            "Has the amount been paid/received yet?",
          ],
        },
        {
          title: "Assets and Liabilities",
          items: [
            "Did the business gain or lose a resource?",
            "Was an obligation created or settled?",
          ],
        },
      ],
    },
    {
      type: "comparison",
      id: "chapter-do-not-confuse-recap",
      eyebrow: "Do not confuse recap",
      title: "Pairs that need one careful sentence",
      intro:
        "If two accounts look similar, use the transaction purpose to separate them.",
      groups: [
        { title: "Cash A/c vs Bank A/c", items: ["Cash means physical cash; cheque, UPI, NEFT, or bank transfer uses Bank A/c."] },
        { title: "Purchases A/c vs Furniture/Machinery A/c", items: ["Purchases is for goods bought for resale; furniture or machinery used in business is an asset."] },
        { title: "Sales A/c vs asset disposal", items: ["Sales is for goods sold in ordinary trading; selling an asset needs separate disposal treatment later."] },
        { title: "Expense A/c vs Drawings A/c", items: ["A business cost is an expense; value taken for personal use is drawings."] },
        { title: "Capital A/c vs Loan A/c", items: ["Capital comes from the owner or partner; loan is an outside obligation to repay."] },
        { title: "Income A/c vs debtor collection", items: ["Income is credited when earned; later collection from a debtor credits the debtor account."] },
        { title: "Original expense vs later liability settlement", items: ["Record the expense when due; later payment reduces the outstanding liability."] },
        { title: "Original income vs later receivable collection", items: ["Record income when earned; later receipt reduces accrued income or debtor balance."] },
        { title: "Business withdrawal vs personal withdrawal", items: ["Business-use cash withdrawal is Cash A/c Dr.; personal withdrawal is Drawings A/c Dr."] },
        { title: "Named debtor/creditor vs generic account names", items: ["Use the person's name when the transaction gives one instead of writing generic Debtor or Creditor."] },
      ],
    },
    {
      type: "recap",
      id: "journal-presentation-checklist-final",
      title: "Journal presentation checklist",
      points: [
        "The complete transaction was read.",
        "Every affected account was identified.",
        "Specific account names were used.",
        "Cash, Bank, or credit treatment is correct.",
        "The debit account is written first.",
        "Dr. is present.",
        "The credited account is prefixed with To.",
        "Amounts are in the correct columns.",
        "Debit total equals credit total.",
        "Narration is meaningful.",
        "Named persons are preserved.",
        "No account is duplicated or omitted.",
      ],
    },
    {
      type: "practice-it-yourself",
      id: "bought-machinery-by-bank-practice",
      question: boughtMachineryByBankPracticeQuestion,
    },
    {
      type: "interactive-practice-links",
      id: "interactive-practice-available",
      eyebrow: "Interactive practice",
      title: "Interactive Practice Available",
      body:
        "This preview chapter currently has exactly seventeen deterministic checking-enabled questions across all 16 Journal Entries sections. Section 1 intentionally has two approved checkers, and every other section has one.",
      questions: [
        { id: soldGoodsForCashPracticeQuestion.id, title: "Sold goods for cash ₹12,000" },
        { id: paidSalaryByBankPracticeQuestion.id, title: "Paid salary by bank ₹8,000" },
        { id: paidElectricityBillInCashPracticeQuestion.id, title: "Paid electricity bill in cash Rs 1,200" },
        { id: boughtStationeryForCashPracticeQuestion.id, title: "Bought stationery for cash Rs 800" },
        { id: receivedFeesInCashPracticeQuestion.id, title: "Received fees in cash Rs 4,000" },
        { id: paidWagesInCashPracticeQuestion.id, title: "Paid wages in cash Rs 2,500" },
        { id: paidOfficeRentByBankPracticeQuestion.id, title: "Paid office rent by bank Rs 4,000" },
        { id: depositedCashIntoBankPracticeQuestion.id, title: "Deposited cash into bank Rs 5,000" },
        { id: startedBusinessWithCashPracticeQuestion.id, title: "Started business with cash Rs 50,000" },
        { id: withdrewCashForPersonalUsePracticeQuestion.id, title: "Withdrew cash for personal use Rs 5,000" },
        { id: purchasedGoodsForCashPracticeQuestion.id, title: "Bought goods for cash Rs 10,000" },
        { id: soldGoodsByBankPracticeQuestion.id, title: "Sold goods by bank Rs 6,000" },
        { id: paidRentByCashPracticeQuestion.id, title: "Paid rent by cash Rs 3,000" },
        { id: receivedCommissionInCashPracticeQuestion.id, title: "Received commission in cash Rs 2,000" },
        { id: boughtFurnitureForCashPracticeQuestion.id, title: "Bought furniture for cash Rs 15,000" },
        { id: paidAdvertisingByBankPracticeQuestion.id, title: "Paid advertising by bank Rs 3,500" },
        { id: boughtMachineryByBankPracticeQuestion.id, title: "Bought machinery by bank Rs 20,000" },
      ],
      link: {
        label: "Return to Practice It Yourself",
        href: `${JOURNAL_ENTRIES_CHAPTER_PATH}#practice-it-yourself`,
      },
    },
    {
      type: "try-before-reveal",
      id: "chapter-review-challenges",
      eyebrow: "Display-only review",
      title: "Chapter review challenges",
      body:
        "Try each entry mentally first, then reveal the answer and explanation. These cards do not submit, score, save progress, or use the deterministic checker.",
      revealLabel: "Reveal answer and explanation",
      prompts: [
        {
          id: "chapter-review-bought-goods-for-cash",
          prompt: "Bought goods for cash ₹10,000.",
          journalEntry: [
            { id: "chapter-review-purchases-debit", account: "Purchases A/c", side: "debit", amount: 10000, drNotation: "Dr." },
            { id: "chapter-review-cash-credit", account: "Cash A/c", side: "credit", amount: 10000, displayPrefix: "To" },
          ],
          narration: "Being goods purchased for cash.",
          reasoning: "Goods bought for resale increase Purchases, and cash goes out of the business.",
          commonMistake: "Using Furniture A/c or Bank A/c without checking the words goods and cash.",
        },
        {
          id: "chapter-review-paid-rent-bank",
          prompt: "Paid office rent through bank ₹6,000.",
          journalEntry: [
            { id: "chapter-review-rent-debit", account: "Rent A/c", side: "debit", amount: 6000, drNotation: "Dr." },
            { id: "chapter-review-bank-credit", account: "Bank A/c", side: "credit", amount: 6000, displayPrefix: "To" },
          ],
          narration: "Being office rent paid through bank.",
          reasoning: "Rent is a business expense, and bank balance decreases because payment is through bank.",
          commonMistake: "Debiting Bank A/c just because the word bank appears.",
        },
        {
          id: "chapter-review-credit-sale-priyanka",
          prompt: "Sold goods on credit to Priyanka ₹15,000.",
          journalEntry: [
            { id: "chapter-review-priyanka-debit", account: "Priyanka A/c", side: "debit", amount: 15000, drNotation: "Dr." },
            { id: "chapter-review-sales-credit", account: "Sales A/c", side: "credit", amount: 15000, displayPrefix: "To" },
          ],
          narration: "Being goods sold on credit to Priyanka.",
          reasoning: "Priyanka becomes the debtor, and Sales is credited because goods are sold.",
          commonMistake: "Using Cash A/c or Bank A/c even though the sale is on credit.",
        },
        {
          id: "chapter-review-kuldeep-capital-bank",
          prompt: "Kuldeep introduced capital of ₹50,000 through bank.",
          journalEntry: [
            { id: "chapter-review-kuldeep-bank-debit", account: "Bank A/c", side: "debit", amount: 50000, drNotation: "Dr." },
            { id: "chapter-review-kuldeep-capital-credit", account: "Kuldeep's Capital A/c", side: "credit", amount: 50000, displayPrefix: "To" },
          ],
          narration: "Being capital introduced by Kuldeep through bank.",
          reasoning: "Bank increases, and Kuldeep's Capital increases because capital is contributed by Kuldeep.",
          commonMistake: "Crediting generic Capital A/c instead of the named capital account.",
        },
        {
          id: "chapter-review-riya-drawings-bank",
          prompt: "Riya withdrew ₹4,000 from bank for personal use.",
          journalEntry: [
            { id: "chapter-review-riya-drawings-debit", account: "Riya Drawings A/c", side: "debit", amount: 4000, drNotation: "Dr." },
            { id: "chapter-review-riya-bank-credit", account: "Bank A/c", side: "credit", amount: 4000, displayPrefix: "To" },
          ],
          narration: "Being amount withdrawn by Riya from bank for personal use.",
          reasoning: "Personal-use wording creates drawings, and Bank is credited because money leaves through bank.",
          commonMistake: "Treating the transaction as Cash A/c Dr.; To Bank A/c.",
        },
        {
          id: "chapter-review-furniture-credit-mohan",
          prompt: "Bought office furniture on credit from Mohan ₹25,000.",
          journalEntry: [
            { id: "chapter-review-furniture-debit", account: "Furniture A/c", side: "debit", amount: 25000, drNotation: "Dr." },
            { id: "chapter-review-mohan-credit", account: "Mohan A/c", side: "credit", amount: 25000, displayPrefix: "To" },
          ],
          narration: "Being office furniture purchased on credit from Mohan.",
          reasoning: "Furniture is a business asset, and Mohan is credited as the named creditor.",
          commonMistake: "Using Purchases A/c or Bank A/c for a credit asset purchase.",
        },
        {
          id: "chapter-review-bank-loan-received",
          prompt: "Received a bank loan of ₹1,00,000 in the business bank account.",
          journalEntry: [
            { id: "chapter-review-loan-bank-debit", account: "Bank A/c", side: "debit", amount: 100000, drNotation: "Dr." },
            { id: "chapter-review-bank-loan-credit", account: "Bank Loan A/c", side: "credit", amount: 100000, displayPrefix: "To" },
          ],
          narration: "Being bank loan received in the business bank account.",
          reasoning: "Bank asset increases, and Bank Loan liability increases because borrowed money must be repaid.",
          commonMistake: "Crediting Income A/c or Capital A/c for borrowed money.",
        },
        {
          id: "chapter-review-accrued-commission",
          prompt: "Commission ₹3,000 was earned but not yet received.",
          journalEntry: [
            { id: "chapter-review-accrued-commission-debit", account: "Accrued Commission A/c", side: "debit", amount: 3000, drNotation: "Dr." },
            { id: "chapter-review-commission-received-credit", account: "Commission Received A/c", side: "credit", amount: 3000, displayPrefix: "To" },
          ],
          narration: "Being commission earned but not yet received.",
          reasoning: "Accrued Commission is a receivable asset, and Commission Received is credited because income is earned.",
          commonMistake: "Debiting Cash A/c even though money has not been received yet.",
        },
      ],
    },
    {
      type: "recap",
      id: "mastery-self-check",
      title: "Mastery self-check",
      points: [
        "I can identify two affected accounts.",
        "I can explain why each account is affected.",
        "I can classify both accounts.",
        "I can choose the correct debit and credit sides.",
        "I can distinguish Cash, Bank, and credit.",
        "I can distinguish goods from assets.",
        "I can distinguish business expenses from drawings.",
        "I can distinguish capital, loan, income, and collections.",
        "I can preserve named accounts.",
        "I can write a complete entry with narration.",
        "I can confirm debit equals credit.",
      ],
    },
    {
      type: "scope-roadmap",
      id: "current-prototype-scope",
      eyebrow: "Prototype scope",
      title: "Current prototype scope and future scope",
      body:
        "This roadmap is here so the foundation chapter feels clear, not unfinished. The preview focuses on safe foundations first.",
      currentScope: {
        title: "Currently covered in this foundation chapter",
        items: [
          "Simple one-debit/one-credit entries",
          "Selected adjustment-style examples",
          "Named accounts",
          "Journal presentation",
          "Deterministic practice for seventeen approved questions",
        ],
      },
      futureScope: {
        label: "Later / separate chapter or subtopic",
        items: [
          "Compound entries in depth",
          "Discounts",
          "Returns",
          "GST",
          "Depreciation",
          "Rectification",
          "Closing entries",
          "Complex asset disposal",
          "Partnership restructuring",
          "Company Accounts complexity",
        ],
      },
    },
  ],
};

const journalEntriesSubtopics = [
  introductionJournalEntriesSubtopic,
  businessTransactionsJournalEntriesSubtopic,
  accountsAffectedJournalEntriesSubtopic,
  typesOfAccountsJournalEntriesSubtopic,
  debitAndCreditRulesJournalEntriesSubtopic,
  journalFormatAndNarrationJournalEntriesSubtopic,
  cashAndBankTransactionsJournalEntriesSubtopic,
  capitalJournalEntriesSubtopic,
  drawingsJournalEntriesSubtopic,
  purchasesJournalEntriesSubtopic,
  salesJournalEntriesSubtopic,
  expensesJournalEntriesSubtopic,
  incomeJournalEntriesSubtopic,
  assetsAndLiabilitiesJournalEntriesSubtopic,
  mixedSimpleEntriesJournalEntriesSubtopic,
  chapterRecapAndPracticeJournalEntriesSubtopic,
];

export const journalEntriesChapter: ChapterDefinition = {
  metadata: {
    id: "journal-entries",
    slug: "journal-entries",
    title: "Journal Entries",
    description:
      "A non-destructive preview of the future chapter-learning flow: concept, examples, solved illustrations, and Practice It Yourself input experience.",
    level: "foundation",
    levelLabel: "Foundation chapter",
    availabilityStatus: "available",
    estimatedStudyTime: "Preview: 15 minutes",
    currentPreviewSectionId: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
    progressPreview: {
      label: "Chapter progress preview",
      value: 16,
    },
  },
  outline: [
    {
      id: JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
      title: "Introduction to Journal Entries",
      order: 1,
      status: "available",
      shortDescription: "What a journal entry is and why format matters.",
      href: JOURNAL_ENTRIES_CHAPTER_PATH,
    },
    {
      id: JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG,
      title: "Business Transactions",
      order: 2,
      status: "available",
      shortDescription: "What makes an event recordable in accounting.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG,
      title: "Accounts Affected",
      order: 3,
      status: "available",
      shortDescription: "How to name every account affected before applying debit-credit rules.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG,
      title: "Types of Accounts",
      order: 4,
      status: "available",
      shortDescription: "Modern and traditional classification before debit-credit rules.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_TYPES_OF_ACCOUNTS_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG,
      title: "Debit and Credit Rules",
      order: 5,
      status: "available",
      shortDescription: "How account nature and increase/decrease decide debit and credit.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DEBIT_AND_CREDIT_RULES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG,
      title: "Journal Format and Narration",
      order: 6,
      status: "available",
      shortDescription: "Formal journal layout, Dr./To placement, narration, and totals.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_JOURNAL_FORMAT_AND_NARRATION_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG,
      title: "Cash and Bank Transactions",
      order: 7,
      status: "available",
      shortDescription: "Cash A/c, Bank A/c, transfers, withdrawals, and credit-transaction warnings.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CASH_AND_BANK_TRANSACTIONS_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG,
      title: "Capital",
      order: 8,
      status: "available",
      shortDescription: "Capital meaning, named Capital A/c, two partners, and additional capital.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CAPITAL_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG,
      title: "Drawings",
      order: 9,
      status: "available",
      shortDescription: "Personal withdrawals, named Drawings A/c, goods drawings, and expense-vs-drawings guardrails.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG,
      title: "Purchases",
      order: 10,
      status: "available",
      shortDescription: "Goods bought for resale, cash/bank/credit purchases, and supplier treatment.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_SALES_SECTION_SLUG,
      title: "Sales",
      order: 11,
      status: "available",
      shortDescription: "Goods sold in normal trading, cash/bank/credit sales, and debtor treatment.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_SALES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG,
      title: "Expenses",
      order: 12,
      status: "available",
      shortDescription: "Business expenses, cash/bank payments, outstanding expenses, and adjustment guardrails.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_INCOME_SECTION_SLUG,
      title: "Income",
      order: 13,
      status: "available",
      shortDescription: "Income earned, cash/bank receipts, accrued income, advances, and receipt guardrails.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_INCOME_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG,
      title: "Assets and Liabilities",
      order: 14,
      status: "available",
      shortDescription: "Asset and liability increases, decreases, creation, settlement, and deferred boundaries.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG,
      title: "Mixed Simple Entries",
      order: 15,
      status: "available",
      shortDescription: "Mixed one-debit, one-credit consolidation without a checker.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_MIXED_SIMPLE_ENTRIES_SECTION_SLUG}`,
    },
    {
      id: JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG,
      title: "Chapter Recap and Practice",
      order: 16,
      status: "available",
      shortDescription: "Final recap, review challenges, practice access, and prototype scope.",
      href: `${JOURNAL_ENTRIES_CHAPTER_PATH}/${JOURNAL_ENTRIES_CHAPTER_RECAP_AND_PRACTICE_SECTION_SLUG}`,
    },
  ],
  subtopics: journalEntriesSubtopics,
  sections: introductionJournalEntriesSections,
};

export function getJournalEntriesSubtopic(slug: string): ChapterSubtopicDefinition | undefined {
  return journalEntriesSubtopics.find((subtopic) => subtopic.slug === slug);
}
