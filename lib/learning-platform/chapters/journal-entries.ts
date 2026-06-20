import type {
  ChapterDefinition,
  PracticeItYourselfPreviewQuestion,
  PracticeItYourselfQuestion,
} from "@/lib/learning-platform/types";

export const SOLD_GOODS_FOR_CASH_PRACTICE_QUESTION_ID = "journal-entry-sold-goods-for-cash-practice-preview";
export const PAID_SALARY_BY_BANK_PRACTICE_QUESTION_ID = "journal-entry-paid-salary-by-bank-practice-preview";

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

export function toPracticeItYourselfPreviewQuestion(
  question: PracticeItYourselfQuestion,
): PracticeItYourselfPreviewQuestion {
  return question;
}

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
    currentPreviewSectionId: "introduction-to-journal-entries",
    progressPreview: {
      label: "Chapter progress preview",
      value: 6,
    },
  },
  outline: [
    {
      id: "introduction-to-journal-entries",
      title: "Introduction to Journal Entries",
      order: 1,
      status: "current",
      shortDescription: "What a journal entry is and why format matters.",
    },
    { id: "business-transactions", title: "Business Transactions", order: 2, status: "upcoming" },
    { id: "accounts-affected", title: "Accounts Affected", order: 3, status: "upcoming" },
    { id: "types-of-accounts", title: "Types of Accounts", order: 4, status: "upcoming" },
    { id: "debit-and-credit-rules", title: "Debit and Credit Rules", order: 5, status: "upcoming" },
    { id: "journal-format", title: "Journal Format", order: 6, status: "upcoming" },
    { id: "cash-and-bank-transactions", title: "Cash and Bank Transactions", order: 7, status: "upcoming" },
    { id: "capital", title: "Capital", order: 8, status: "upcoming" },
    { id: "drawings", title: "Drawings", order: 9, status: "upcoming" },
    { id: "purchases", title: "Purchases", order: 10, status: "upcoming" },
    { id: "sales", title: "Sales", order: 11, status: "upcoming" },
    { id: "expenses", title: "Expenses", order: 12, status: "upcoming" },
    { id: "income", title: "Income", order: 13, status: "upcoming" },
    { id: "assets-and-liabilities", title: "Assets and Liabilities", order: 14, status: "upcoming" },
    { id: "mixed-simple-entries", title: "Mixed Simple Entries", order: 15, status: "upcoming" },
    { id: "chapter-recap-and-practice", title: "Chapter Recap and Practice", order: 16, status: "upcoming" },
  ],
  sections: [
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
  ],
};
