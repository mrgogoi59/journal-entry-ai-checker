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
  id: "cash-and-bank-transactions",
  slug: "cash-and-bank-transactions",
  title: "Cash and Bank Transactions",
  order: 7,
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

const journalEntriesSubtopics = [
  introductionJournalEntriesSubtopic,
  businessTransactionsJournalEntriesSubtopic,
  accountsAffectedJournalEntriesSubtopic,
  typesOfAccountsJournalEntriesSubtopic,
  debitAndCreditRulesJournalEntriesSubtopic,
  journalFormatAndNarrationJournalEntriesSubtopic,
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
