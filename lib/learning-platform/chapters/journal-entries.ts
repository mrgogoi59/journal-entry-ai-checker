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
export const JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG = "introduction-to-journal-entries";
export const JOURNAL_ENTRIES_BUSINESS_TRANSACTIONS_SECTION_SLUG = "business-transactions";

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
  id: "accounts-affected",
  slug: "accounts-affected",
  title: "Accounts Affected",
  order: 3,
  availabilityStatus: "upcoming",
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
  ],
};

const journalEntriesSubtopics = [
  introductionJournalEntriesSubtopic,
  businessTransactionsJournalEntriesSubtopic,
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
      value: 6,
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
  subtopics: journalEntriesSubtopics,
  sections: introductionJournalEntriesSections,
};

export function getJournalEntriesSubtopic(slug: string): ChapterSubtopicDefinition | undefined {
  return journalEntriesSubtopics.find((subtopic) => subtopic.slug === slug);
}
