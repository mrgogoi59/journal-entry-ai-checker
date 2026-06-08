export type LessonSlug = "introduction-to-accounting" | "rules-of-debit-and-credit" | "journal-entry-basics";

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
  difficulty?: string;
  estimatedTime?: string;
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
    description?: string;
  };
};

export const lessonCards = [
  {
    slug: "introduction-to-accounting",
    title: "Introduction to Accounting",
    description: "Understand what accounting means and why businesses record transactions.",
    href: "/learn/introduction-to-accounting",
  },
  {
    slug: "rules-of-debit-and-credit",
    title: "Rules of Debit and Credit",
    description: "Understand the basic rules behind every journal entry.",
    href: "/learn/rules-of-debit-and-credit",
  },
  {
    slug: "journal-entry-basics",
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
  "introduction-to-accounting": {
    slug: "introduction-to-accounting",
    title: "Introduction to Accounting",
    subtitle:
      "Accounting is the language of business. It helps us record, understand, and explain money-related activities.",
    description: "Understand what accounting means and why businesses record transactions.",
    difficulty: "Beginner",
    estimatedTime: "8-10 min",
    whatYouWillLearn: [
      "What accounting means",
      "Why businesses record transactions",
      "What a transaction is",
      "What accounting records",
      "Who uses accounting information",
      "Basic words like assets, liabilities, capital, income, and expenses",
      "How accounting connects to journal entries",
    ],
    conceptSections: [
      {
        title: "Simple meaning of accounting",
        body: [
          "Accounting means recording business transactions in a proper way so that we can know what happened in the business.",
          "If a shopkeeper buys goods, sells goods, pays rent, receives cash, or takes a loan, all these activities affect the business.",
          "Accounting helps record these activities clearly.",
          "Accounting is not just maths. It is a system for understanding money movement in a business.",
        ],
      },
      {
        title: "Why accounting is needed",
        body: [
          "A business does many money-related activities every day.",
          "Without accounting, the owner may forget what was bought, sold, paid, received, borrowed, or owed.",
          "Accounting helps the owner know cash, goods, expenses, income, profit, loss, and business position.",
        ],
      },
      {
        title: "What is a transaction?",
        body: [
          "A transaction is a business activity that can be measured in money.",
          "Started business with cash Rs.50,000, bought goods for cash Rs.10,000, sold goods for Rs.5,000, paid rent Rs.2,000, and took loan from bank Rs.20,000 are transactions.",
          "A plan to buy goods next month, a customer asking the price, or the shopkeeper thinking sales may increase are not recorded yet.",
          "These are not recorded because no money-measurable business event has happened yet.",
        ],
      },
      {
        title: "Simple business story",
        body: [
          "Imagine Raju starts a small stationery shop.",
          "Day 1: He brings Rs.50,000 cash into the business.",
          "Day 2: He buys notebooks for Rs.10,000.",
          "Day 3: He sells notebooks for Rs.3,000.",
          "Day 4: He pays shop rent Rs.2,000.",
          "How will Raju know how much cash is left, how much goods he bought, how much he sold, whether the business is earning or losing, and what belongs to the business?",
          "He needs accounting.",
        ],
      },
      {
        title: "What accounting records",
        body: [
          "Money coming into business.",
          "Money going out of business.",
          "Goods bought and sold.",
          "Amount payable to others.",
          "Amount receivable from customers.",
          "Assets owned by business.",
          "Expenses and incomes.",
          "Profit or loss.",
        ],
      },
      {
        title: "Who uses accounting information",
        body: [
          "Owners use it to know profit, loss, cash, and business position.",
          "Students use it to understand how business transactions are recorded.",
          "Banks use it to know whether the business can repay loans.",
          "Government uses it for tax and legal reporting.",
          "Investors use it to decide whether the business is strong.",
          "Managers use it to make better decisions.",
        ],
      },
      {
        title: "Basic accounting words",
        body: [
          "Business: an activity done to earn profit.",
          "Transaction: a money-measurable business activity.",
          "Capital: money or assets brought into the business by the owner.",
          "Asset: something valuable owned by the business, such as cash, bank, furniture, machinery, and debtors.",
          "Liability: amount the business has to pay to others, such as loans, creditors, and outstanding expenses.",
          "Income: money earned by the business, such as sales, commission received, and interest received.",
          "Expense: money spent to run the business, such as rent, salary, wages, and electricity.",
          "Profit: when income is more than expenses.",
          "Loss: when expenses are more than income.",
        ],
      },
    ],
    visualFlow: [
      "Business activity",
      "Transaction",
      "Record in books",
      "Classify into accounts",
      "Prepare summary",
      "Understand profit/loss and position",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Started business with cash Rs.50,000",
        entry: ["Accounting records:", "Cash increased.", "Capital increased."],
        logic: [
          "This is a transaction because cash came into business.",
          "The owner introduced capital into the business.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10,000",
        entry: ["Accounting records:", "Purchases increased.", "Cash decreased."],
        logic: ["This is a transaction because goods were bought.", "Cash went out of the business."],
      },
      {
        title: "Example 3",
        transaction: "Paid rent Rs.2,000",
        entry: ["Accounting records:", "Rent expense increased.", "Cash decreased."],
        logic: ["This is a transaction because the business paid an expense.", "Cash went out of the business."],
      },
      {
        title: "Example 4",
        transaction: "Sold goods for cash Rs.5,000",
        entry: ["Accounting records:", "Cash increased.", "Sales increased."],
        logic: [
          "This is a transaction because the business earned sales.",
          "The business received cash.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking accounting is only maths",
      "Recording personal events as business transactions",
      "Recording plans or promises without a money-measurable event",
      "Confusing capital with profit",
      "Thinking cash and profit are the same",
      "Forgetting that every transaction affects the business in some way",
    ],
    tryPrompts: [
      "Owner started business with Rs.80,000 cash. Is this a business transaction? Yes, because cash came into the business.",
      "Bought goods for Rs.20,000. Is this a business transaction? Yes, because goods were bought and it can be measured in money.",
      "Customer asked for price of goods. Is this a business transaction? No, because no sale or money-measurable event happened yet.",
      "Paid electricity bill Rs.1,500. Is this a business transaction? Yes, because an expense was paid.",
      "Owner plans to buy furniture next month. Is this a business transaction? No, because it is only a plan.",
      "Sold goods for Rs.12,000. Is this a business transaction? Yes, because sales happened and it can be measured in money.",
      "Expected idea: 1, 2, 4, and 6 are recorded. 3 and 5 are not recorded yet.",
    ],
    toolLinks: [
      { label: "Next Lesson: Rules of Debit and Credit", href: "/learn/rules-of-debit-and-credit" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Rules of Debit and Credit",
      href: "/learn/rules-of-debit-and-credit",
      description: "Now that you understand what accounting records, learn how accounts are debited and credited.",
    },
  },
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
