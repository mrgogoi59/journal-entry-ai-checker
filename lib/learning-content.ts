export type LessonSlug = "rules-of-debit-and-credit" | "journal-entry-basics";

export type SolvedLessonExample = {
  title: string;
  transaction: string;
  entry: string[];
  logic: string[];
};

export type LessonContent = {
  slug: LessonSlug;
  title: string;
  subtitle: string;
  description: string;
  whatYouWillLearn: string[];
  conceptSections: {
    title: string;
    rule?: string;
    body: string[];
    example?: string;
  }[];
  modernRules?: {
    accountType: string;
    increase: string;
    decrease?: string;
  }[];
  visualFlow: string[];
  solvedExamples: SolvedLessonExample[];
  commonMistakes: string[];
  tryPrompts: string[];
  toolLinks: {
    label: string;
    href: string;
  }[];
  nextLesson?: {
    label: string;
    href: string;
  };
};

export const lessonCards = [
  {
    title: "Rules of Debit and Credit",
    description: "Understand the basic rules behind every journal entry.",
    href: "/learn/rules-of-debit-and-credit",
  },
  {
    title: "Journal Entry Basics",
    description: "Learn how to convert transactions into proper journal entries.",
    href: "/learn/journal-entry-basics",
  },
];

export const comingSoonLessons = [
  "Ledger Posting Basics",
  "Trial Balance Basics",
  "Final Accounts Basics",
  "GST Journal Entries",
  "Adjustments in Final Accounts",
];

export const lessons: Record<LessonSlug, LessonContent> = {
  "rules-of-debit-and-credit": {
    slug: "rules-of-debit-and-credit",
    title: "Rules of Debit and Credit",
    subtitle: "Learn why accounts are debited and credited.",
    description: "Every journal entry becomes easier when you know the rule behind each side.",
    whatYouWillLearn: [
      "What debit and credit mean",
      "Three traditional account types",
      "Modern accounting rules",
      "How to decide debit and credit",
      "How to avoid common mistakes",
    ],
    conceptSections: [
      {
        title: "Personal Account",
        rule: "Debit the receiver, Credit the giver",
        body: [
          "A personal account is connected with a person, firm, company, customer, creditor, debtor, or owner.",
          "When a person receives value, that account is debited. When a person gives value, that account is credited.",
        ],
        example:
          "Paid cash to Amit Rs.5000. Amit receives value, so Amit A/c is debited. Cash goes out, so Cash A/c is credited.",
      },
      {
        title: "Real Account",
        rule: "Debit what comes in, Credit what goes out",
        body: [
          "A real account is connected with assets and property, such as cash, bank, furniture, machinery, and building.",
          "When an asset comes into the business, debit it. When an asset goes out of the business, credit it.",
        ],
        example:
          "Bought furniture for cash Rs.10000. Furniture comes in, so Furniture A/c is debited. Cash goes out, so Cash A/c is credited.",
      },
      {
        title: "Nominal Account",
        rule: "Debit all expenses and losses, Credit all incomes and gains",
        body: [
          "A nominal account is connected with expenses, losses, incomes, and gains.",
          "Expenses and losses are debited. Incomes and gains are credited.",
        ],
        example:
          "Paid rent Rs.3000. Rent is expense, so Rent A/c is debited. Cash goes out, so Cash A/c is credited.",
      },
    ],
    modernRules: [
      { accountType: "Assets", increase: "Debit", decrease: "Credit" },
      { accountType: "Liabilities", increase: "Credit", decrease: "Debit" },
      { accountType: "Capital", increase: "Credit", decrease: "Debit" },
      { accountType: "Expenses/Losses", increase: "Debit" },
      { accountType: "Incomes/Gains", increase: "Credit" },
    ],
    visualFlow: [
      "Transaction",
      "Identify accounts",
      "Identify account type",
      "Decide increase/decrease",
      "Apply rule",
      "Write journal entry",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Started business with cash Rs.50000",
        entry: ["Cash A/c Dr. Rs.50000", "To Capital A/c Rs.50000"],
        logic: ["Cash is asset and increases, so debit Cash.", "Capital increases, so credit Capital."],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10000",
        entry: ["Purchases A/c Dr. Rs.10000", "To Cash A/c Rs.10000"],
        logic: [
          "Purchases is expense/goods bought for resale, so debit Purchases.",
          "Cash goes out, so credit Cash.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Received commission Rs.2000 in cash",
        entry: ["Cash A/c Dr. Rs.2000", "To Commission Income A/c Rs.2000"],
        logic: ["Cash comes in, so debit Cash.", "Commission is income, so credit Commission Income."],
      },
    ],
    commonMistakes: [
      "Thinking debit always means increase",
      "Thinking credit always means decrease",
      "Using Cash A/c Dr. when cash is paid out",
      "Confusing income with expense",
      "Forgetting the To before credit account",
    ],
    tryPrompts: [
      "Paid salary Rs.5000 in cash",
      "Sold goods for cash Rs.8000",
      "Purchased furniture through bank Rs.12000",
    ],
    toolLinks: [
      { label: "Try in Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: { label: "Next: Journal Entry Basics", href: "/learn/journal-entry-basics" },
  },
  "journal-entry-basics": {
    slug: "journal-entry-basics",
    title: "Journal Entry Basics",
    subtitle: "Learn how to write journal entries in the correct format.",
    description: "A journal entry records a business transaction in debit and credit form.",
    whatYouWillLearn: [
      "What a journal entry is",
      "Format of a journal entry",
      "Why Dr. and To are used",
      "How to write debit and credit lines",
      "How to check if total debit equals total credit",
    ],
    conceptSections: [
      {
        title: "What is a journal entry?",
        body: [
          "A journal entry records a business transaction in debit and credit form.",
          "It shows which account is debited, which account is credited, and the amount on each side.",
        ],
      },
      {
        title: "Basic format",
        body: [
          "Debit Account A/c Dr. Amount",
          "To Credit Account A/c Amount",
          "Debit account is written first. Credit account is written with To. Debit amount and credit amount must be equal.",
        ],
        example: "Bought goods for cash Rs.10000 -> Purchases A/c Dr. Rs.10000 / To Cash A/c Rs.10000",
      },
    ],
    visualFlow: [
      "Read transaction",
      "Find accounts affected",
      "Decide debit account",
      "Decide credit account",
      "Write Dr. line",
      "Write To line",
      "Check totals",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Paid rent Rs.5000 in cash",
        entry: ["Rent A/c Dr. Rs.5000", "To Cash A/c Rs.5000"],
        logic: ["Rent is an expense, so debit Rent.", "Cash goes out, so credit Cash."],
      },
      {
        title: "Example 2",
        transaction: "Sold goods to Raju Rs.12000",
        entry: ["Raju A/c Dr. Rs.12000", "To Sales A/c Rs.12000"],
        logic: ["Raju is debtor/customer, so debit Raju.", "Sales is income/revenue, so credit Sales."],
      },
      {
        title: "Example 3",
        transaction: "Paid Rs.9500 from Mohan in full settlement of Rs.10000",
        entry: ["Cash A/c Dr. Rs.9500", "Discount Allowed A/c Dr. Rs.500", "To Mohan A/c Rs.10000"],
        logic: [
          "Cash received is debited.",
          "Discount allowed is loss/expense, so debited.",
          "Mohan's receivable is reduced, so credited.",
        ],
      },
    ],
    commonMistakes: [
      "Missing To before the credit account",
      "Writing only one side of the entry",
      "Debit and credit amounts not equal",
      "Putting Cash on wrong side",
      "Using Sales instead of Sales Return",
      "Using Purchase Return instead of Purchases",
    ],
    tryPrompts: [
      "Started business with cash Rs.50000",
      "Paid wages Rs.3000 in cash",
      "Goods returned by Raju Rs.1000",
    ],
    toolLinks: [
      { label: "Check Your Entry", href: "/tools" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Journal Entries", href: "/practice" },
    ],
    nextLesson: { label: "Back to Learn", href: "/learn" },
  },
};
