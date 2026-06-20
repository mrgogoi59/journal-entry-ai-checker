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
  id: "income",
  slug: "income",
  title: "Income",
  order: 13,
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
      value: 12,
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
