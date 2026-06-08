export type LessonSlug =
  | "introduction-to-accounting"
  | "theory-base-of-accounting"
  | "accounting-principles-and-concepts"
  | "recording-of-transactions"
  | "source-documents-and-vouchers"
  | "rules-of-debit-and-credit"
  | "journal-entry-basics"
  | "ledger-posting-basics"
  | "trial-balance-basics";

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
    example?: string;
  }[];
  memoryTable?: {
    principle: string;
    meaning: string;
    example: string;
  }[];
  comparisonTable?: {
    title: string;
    leftHeading: string;
    rightHeading: string;
    rows: {
      left: string;
      right: string;
    }[];
    note?: string;
  };
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
    slug: "theory-base-of-accounting",
    title: "Theory Base of Accounting",
    description: "Understand the basic rules and assumptions that make accounting reliable.",
    href: "/learn/theory-base-of-accounting",
  },
  {
    slug: "accounting-principles-and-concepts",
    title: "Accounting Principles and Concepts",
    description: "Learn the simple rules that make accounting clear, fair, and reliable.",
    href: "/learn/accounting-principles-and-concepts",
  },
  {
    slug: "recording-of-transactions",
    title: "Recording of Transactions",
    description: "Learn how business activities are identified, measured, and recorded.",
    href: "/learn/recording-of-transactions",
  },
  {
    slug: "source-documents-and-vouchers",
    title: "Source Documents and Vouchers",
    description: "Learn what proof is used before recording a transaction in accounting books.",
    href: "/learn/source-documents-and-vouchers",
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
  {
    slug: "ledger-posting-basics",
    title: "Ledger Posting Basics",
    description: "Learn how journal entries are posted into individual accounts.",
    href: "/learn/ledger-posting-basics",
  },
  {
    slug: "trial-balance-basics",
    title: "Trial Balance Basics",
    description: "Learn how ledger balances are listed to check whether debit and credit totals agree.",
    href: "/learn/trial-balance-basics",
  },
];

export const comingSoonLessons = [
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
      { label: "Next Lesson: Theory Base of Accounting", href: "/learn/theory-base-of-accounting" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Theory Base of Accounting",
      href: "/learn/theory-base-of-accounting",
      description: "Now that you know what accounting records, learn why accounting follows common rules.",
    },
  },
  "theory-base-of-accounting": {
    slug: "theory-base-of-accounting",
    title: "Theory Base of Accounting",
    subtitle: "Accounting follows common rules so that business records are reliable, comparable, and easy to understand.",
    description: "Understand the basic rules and assumptions that make accounting reliable.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "Why accounting needs rules",
      "What theory base means",
      "Why common accounting principles are useful",
      "What assumptions, concepts, and conventions mean",
      "Why accounting should be reliable, comparable, consistent, and understandable",
      "How theory base supports journal entries and final accounts",
    ],
    conceptSections: [
      {
        title: "Simple meaning of Theory Base of Accounting",
        body: [
          "Theory Base of Accounting means the basic rules, assumptions, concepts, and principles that guide how accounting is done.",
          "Imagine every shopkeeper records business differently. One records sales today, another records sales next month, and another mixes personal spending with business spending.",
          "Then nobody can understand or compare accounts properly.",
          "So accounting needs a common base. That common base is called the Theory Base of Accounting.",
        ],
      },
      {
        title: "Why accounting needs a theory base",
        body: [
          "Accounting rules make accounts reliable, so people can trust them.",
          "They bring consistency, so the same method is followed every year.",
          "They allow comparability, so one year can be compared with another year.",
          "They bring clarity, so students, owners, banks, and others can understand accounts.",
          "They help accounts show a fair picture of the business.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Raju runs a stationery shop.",
          "He buys notebooks for Rs.10,000.",
          "He sells goods for Rs.5,000.",
          "He pays house electricity from business cash.",
          "He also gives goods to a friend and says he will record it later.",
          "If Raju records everything without rules, will his accounts show the real picture? No.",
          "Accounting rules help him decide what should be recorded, when it should be recorded, whether it belongs to business or personal life, how value should be measured, and how accounts should be prepared consistently.",
        ],
      },
      {
        title: "Basic accounting assumptions",
        body: [
          "Business Entity Assumption: business and owner are treated separately. If the owner uses business cash for personal use, it is Drawings, not a business expense.",
          "Money Measurement Assumption: only things that can be measured in money are recorded. Bought goods for Rs.10,000 is recorded, but owner is hardworking is not recorded.",
          "Going Concern Assumption: business is assumed to continue in the future. Machinery is used for many years, so its cost is not treated as one-day expense.",
          "Accounting Period Assumption: business life is divided into periods such as month, quarter, or year to calculate profit or loss.",
        ],
      },
      {
        title: "Basic accounting principles and concepts",
        body: [
          "Cost Concept: assets are recorded at purchase cost. Furniture bought for Rs.20,000 is recorded at Rs.20,000.",
          "Dual Aspect Concept: every transaction has two sides. Started business with cash Rs.50,000 means cash increases and capital increases.",
          "Matching Concept: expenses of a period should be matched with income of the same period.",
          "Accrual Concept: income and expenses are recorded when they become due, not only when cash is received or paid.",
          "Revenue Recognition Concept: revenue is recorded when it is earned. Goods sold on credit are recorded as sales even if cash is not received yet.",
        ],
      },
      {
        title: "Basic accounting conventions",
        body: [
          "Consistency: use the same accounting method every year unless there is a good reason to change.",
          "Conservatism or Prudence: do not overstate profit. Record expected losses carefully.",
          "Materiality: important items should be recorded properly. Very small items may be treated simply.",
          "Full Disclosure: important information should be clearly shown.",
        ],
      },
      {
        title: "Accounting standards in simple words",
        body: [
          "Accounting standards are official rules or guidelines.",
          "They help businesses prepare accounts in a common way.",
          "They make accounts more reliable and comparable.",
          "You do not need to learn a full standards list here. First, understand why common rules are needed.",
        ],
      },
    ],
    visualFlow: [
      "Business transaction",
      "Apply assumptions",
      "Apply concepts",
      "Record correctly",
      "Prepare reliable accounts",
      "Understand business position",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Owner used business cash Rs.5,000 for personal expenses.",
        entry: ["Concept: Business Entity", "Accounting idea: Treat it as Drawings."],
        logic: [
          "This is not a business expense.",
          "Owner and business are separate in accounting.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Goods sold to Raju Rs.10,000 on credit.",
        entry: ["Concept: Accrual / Revenue Recognition", "Accounting idea: Record sales when goods are sold."],
        logic: [
          "Sales are recorded when earned.",
          "Cash does not need to be received immediately for sales to be recorded.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Furniture bought for Rs.20,000.",
        entry: ["Concept: Cost Concept", "Accounting idea: Record furniture at Rs.20,000."],
        logic: [
          "Furniture is recorded at purchase cost.",
          "The recorded value starts with the amount paid to buy it.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Salary for March Rs.8,000 is unpaid.",
        entry: ["Concept: Accrual Concept", "Accounting idea: Record salary expense even if unpaid."],
        logic: [
          "The salary belongs to March.",
          "It is recorded as an expense even if cash is paid later.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Business creates provision for doubtful debts.",
        entry: ["Convention: Conservatism / Prudence", "Accounting idea: Record possible loss carefully."],
        logic: [
          "Some debtors may not pay.",
          "The business does not assume every amount will be collected perfectly.",
        ],
      },
    ],
    commonMistakes: [
      "Mixing owner's personal expenses with business expenses",
      "Thinking only cash transactions are recorded",
      "Not recording credit sales or credit purchases",
      "Changing accounting method every year without reason",
      "Recording things that cannot be measured in money",
      "Thinking capital and profit are the same",
      "Ignoring outstanding expenses and accrued income",
    ],
    tryPrompts: [
      "Owner takes Rs.3,000 cash from business for personal use. Expected idea: Business Entity; treat it as Drawings.",
      "Goods sold on credit Rs.12,000. Expected idea: revenue is recorded when earned; accrual/revenue recognition.",
      "Machinery bought for Rs.50,000. Expected idea: Cost Concept.",
      "Salary outstanding Rs.5,000. Expected idea: Accrual Concept.",
      "Business uses the same depreciation method every year. Expected idea: Consistency.",
      "Provision for doubtful debts is created. Expected idea: Conservatism / Prudence.",
    ],
    toolLinks: [
      { label: "Next Lesson: Accounting Principles and Concepts", href: "/learn/accounting-principles-and-concepts" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Accounting Principles and Concepts",
      href: "/learn/accounting-principles-and-concepts",
      description: "Now that you understand the foundation of accounting rules, learn the main principles with simple examples.",
    },
  },
  "accounting-principles-and-concepts": {
    slug: "accounting-principles-and-concepts",
    title: "Accounting Principles and Concepts",
    subtitle: "Learn the simple rules that make accounting clear, fair, and reliable.",
    description: "Understand important accounting principles with easy examples from small businesses.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What accounting principles are",
      "Why accounting needs principles",
      "How principles keep accounts fair and clear",
      "The simple difference between concepts and conventions",
      "Important principles with easy examples",
      "How principles connect to journal entries and final accounts",
    ],
    conceptSections: [
      {
        title: "What are accounting principles?",
        body: [
          "Accounting principles are simple rules that guide how business transactions should be recorded.",
          "Just like traffic rules help everyone drive safely, accounting principles help everyone record business transactions clearly.",
          "If every business records things in a different way, accounts become confusing.",
          "Principles create a common way of recording.",
          "Simple line: accounting principles make accounts reliable, fair, and easy to understand.",
        ],
      },
      {
        title: "Why accounting principles are needed",
        body: [
          "They help us record transactions correctly.",
          "They keep business and owner separate.",
          "They help compare one year with another year.",
          "They avoid showing false profit.",
          "They record income and expenses in the correct period.",
          "They help prepare final accounts properly.",
          "They make accounts understandable to owners, banks, teachers, students, and others.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya runs a small mobile accessories shop.",
          "In one month, she buys earphones for Rs.20,000 and sells goods worth Rs.30,000.",
          "Some goods are sold on credit.",
          "Shop rent of Rs.5,000 is unpaid.",
          "She takes Rs.2,000 from business cash for personal use.",
          "She buys a table for Rs.8,000.",
          "If Riya records all this without rules, she may treat personal withdrawal as shop expense, ignore credit sales, forget unpaid rent, treat the table as a one-day expense, and show wrong profit.",
          "Accounting principles help her avoid these mistakes.",
        ],
      },
      {
        title: "Important accounting concepts",
        body: [
          "Business Entity Concept: business and owner are treated separately. If Riya takes Rs.2,000 from business cash for personal use, treat it as Drawings, not shop expense.",
          "Money Measurement Concept: only things that can be measured in money are recorded. Bought goods for Rs.20,000 is recorded, but Riya is hardworking is not recorded.",
          "Going Concern Concept: business is assumed to continue in future. A table bought for Rs.8,000 is treated as an asset, not a one-day expense.",
          "Accounting Period Concept: business life is divided into fixed periods to calculate profit or loss.",
          "Cost Concept: assets are recorded at their purchase cost. Furniture bought for Rs.8,000 is recorded at Rs.8,000.",
          "Dual Aspect Concept: every transaction has two sides. Started business with cash Rs.50,000 means cash increases and capital increases.",
          "Accrual Concept: income and expenses are recorded when they become due, not only when cash is received or paid.",
          "Matching Concept: expenses of a period should be matched with income of the same period.",
          "Revenue Recognition Concept: revenue is recorded when it is earned, such as credit sales recorded when goods are sold.",
        ],
      },
      {
        title: "Important accounting conventions",
        body: [
          "Consistency: use the same accounting method every year unless there is a good reason to change.",
          "Conservatism or Prudence: do not show profit too early or too high. Record possible losses carefully.",
          "Materiality: important items should be shown properly. Very small items can be treated simply.",
          "Full Disclosure: important information should be clearly shown, such as a big business loan.",
        ],
      },
    ],
    memoryTable: [
      {
        principle: "Business Entity",
        meaning: "Business and owner are separate",
        example: "Owner's personal withdrawal is Drawings",
      },
      {
        principle: "Money Measurement",
        meaning: "Record only money-measurable events",
        example: "Bought goods Rs.20,000",
      },
      {
        principle: "Going Concern",
        meaning: "Business will continue",
        example: "Furniture is asset",
      },
      {
        principle: "Accounting Period",
        meaning: "Accounts for fixed period",
        example: "Profit for one year",
      },
      {
        principle: "Cost Concept",
        meaning: "Record asset at cost",
        example: "Machine bought Rs.50,000",
      },
      {
        principle: "Dual Aspect",
        meaning: "Every transaction has two sides",
        example: "Cash and Capital",
      },
      {
        principle: "Accrual",
        meaning: "Record due items",
        example: "Outstanding salary",
      },
      {
        principle: "Matching",
        meaning: "Match income with related expense",
        example: "Sales and related expenses",
      },
      {
        principle: "Revenue Recognition",
        meaning: "Record revenue when earned",
        example: "Credit sales",
      },
      {
        principle: "Consistency",
        meaning: "Same method regularly",
        example: "Same depreciation method",
      },
      {
        principle: "Conservatism",
        meaning: "Be careful with expected losses",
        example: "Provision for doubtful debts",
      },
      {
        principle: "Materiality",
        meaning: "Focus on important items",
        example: "Machine vs small pen",
      },
      {
        principle: "Full Disclosure",
        meaning: "Show important facts",
        example: "Loan shown clearly",
      },
    ],
    visualFlow: [
      "Business transaction",
      "Apply accounting principle",
      "Record correctly",
      "Prepare ledger/trial balance",
      "Prepare final accounts",
      "Show true business picture",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Owner uses business cash Rs.3,000 for personal shopping.",
        entry: ["Principle: Business Entity", "Correct treatment: Drawings, not business expense."],
        logic: [
          "The owner and business are separate in accounting.",
          "Personal shopping is not a shop expense.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Goods sold to Amit on credit Rs.12,000.",
        entry: ["Principle: Revenue Recognition / Accrual", "Correct treatment: Record sales even though cash is not received."],
        logic: [
          "Revenue is recorded when earned.",
          "Credit sales are still sales.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Salary due but not paid Rs.5,000.",
        entry: ["Principle: Accrual", "Correct treatment: Record salary expense and outstanding salary."],
        logic: [
          "The salary belongs to the current period.",
          "It is recorded even if cash is paid later.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Furniture bought Rs.10,000.",
        entry: ["Principle: Going Concern / Cost Concept", "Correct treatment: Record furniture as asset at Rs.10,000."],
        logic: [
          "Furniture will be used for many days.",
          "It is recorded at purchase cost.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Debtors may not pay Rs.2,000.",
        entry: ["Principle: Conservatism", "Correct treatment: Create provision for doubtful debts."],
        logic: [
          "The business should be careful about expected losses.",
          "It should not show profit too high by ignoring possible loss.",
        ],
      },
    ],
    commonMistakes: [
      "Treating owner's personal spending as business expense",
      "Recording only cash transactions and ignoring credit transactions",
      "Ignoring outstanding expenses",
      "Thinking every purchase is an expense",
      "Changing methods every year without reason",
      "Showing profit too high by ignoring possible losses",
      "Mixing capital with profit",
      "Forgetting that every transaction has two sides",
    ],
    tryPrompts: [
      "Owner takes goods for personal use. Expected: Business Entity; treat as Drawings.",
      "Goods sold on credit Rs.15,000. Expected: Revenue Recognition / Accrual.",
      "Salary outstanding Rs.4,000. Expected: Accrual Concept.",
      "Machine bought for Rs.60,000. Expected: Cost Concept / Going Concern.",
      "Same depreciation method used every year. Expected: Consistency.",
      "Provision for doubtful debts created. Expected: Conservatism.",
      "Very small stationery item treated as expense. Expected: Materiality.",
      "Business loan shown clearly in Balance Sheet. Expected: Full Disclosure.",
    ],
    toolLinks: [
      { label: "Next Lesson: Recording of Transactions", href: "/learn/recording-of-transactions" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Recording of Transactions",
      href: "/learn/recording-of-transactions",
      description: "Now that you understand the main accounting principles, learn how business activities are recorded.",
    },
  },
  "recording-of-transactions": {
    slug: "recording-of-transactions",
    title: "Recording of Transactions",
    subtitle: "Learn how business activities are identified, measured, and recorded in accounting books.",
    description: "Learn how business activities are identified, measured, and recorded.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What recording of transactions means",
      "Which business activities should be recorded",
      "Which activities should not be recorded",
      "How to identify a transaction",
      "Why source documents are important",
      "How transactions move toward journal entries",
      "Basic steps before writing a journal entry",
    ],
    conceptSections: [
      {
        title: "What does Recording of Transactions mean?",
        body: [
          "Recording of transactions means writing business activities in accounting books in a proper way.",
          "Whenever something happens in a business that can be measured in money, it should be recorded.",
          "If a shop buys goods for Rs.10,000, it is recorded.",
          "If a shop sells goods for Rs.5,000, it is recorded.",
          "If the owner only plans to buy goods next week, it is not recorded yet.",
          "Accounting records real business events, not just thoughts or plans.",
        ],
      },
      {
        title: "Why transactions are recorded",
        body: [
          "A business records transactions to know how much cash it has.",
          "It helps the business know how much it purchased and sold.",
          "It shows how much the business has to pay and receive.",
          "It helps calculate whether the business made profit or loss.",
          "It shows assets owned by the business and liabilities payable by the business.",
        ],
      },
      {
        title: "What is recorded and what is not recorded",
        body: [
          "Recorded: Bought goods for cash Rs.10,000.",
          "Recorded: Sold goods on credit Rs.8,000.",
          "Recorded: Paid rent Rs.3,000.",
          "Recorded: Received commission Rs.2,000.",
          "Recorded: Took loan from bank Rs.50,000.",
          "Recorded: Owner introduced capital Rs.1,00,000.",
          "Not recorded: Customer asked price.",
          "Not recorded: Owner plans furniture.",
          "Not recorded: Shopkeeper feels sales will increase.",
          "Not recorded: Employee promises to work harder.",
          "Not recorded: Owner is very skilled.",
          "Reason: only money-measurable business events are recorded.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya starts a stationery shop.",
          "Day 1: she brings Rs.50,000 cash into the business.",
          "Day 2: she buys notebooks for Rs.12,000.",
          "Day 3: she sells notebooks for Rs.4,000 cash.",
          "Day 4: she sells pens to Amit Rs.2,000 on credit.",
          "Day 5: she pays rent Rs.3,000.",
          "Day 6: a customer asks the price of a diary but does not buy.",
          "Record Day 1 to Day 5 because real business transactions happened.",
          "Do not record Day 6 because no sale happened.",
          "This is the first step before journal entries.",
        ],
      },
      {
        title: "What are source documents?",
        body: [
          "A source document is proof of a transaction.",
          "Examples include cash memo, invoice, receipt, bill, bank slip, cheque counterfoil, debit note, and credit note.",
          "If goods are purchased, the purchase invoice is proof.",
          "If rent is paid, the receipt is proof.",
          "Source document means proof of transaction.",
        ],
      },
      {
        title: "Steps to record a transaction",
        body: [
          "Step 1: read the business event carefully.",
          "Step 2: check whether it can be measured in money.",
          "Step 3: check whether it belongs to the business.",
          "Step 4: identify the accounts affected.",
          "Step 5: decide debit and credit.",
          "Step 6: write the journal entry.",
          "Recording starts before debit and credit. Understand the transaction clearly first.",
        ],
      },
      {
        title: "Cash and credit transactions",
        body: [
          "A cash transaction means money is paid or received immediately.",
          "Example: sold goods for cash Rs.5,000.",
          "A credit transaction means money will be paid or received later.",
          "Example: sold goods to Amit Rs.5,000 on credit.",
          "A cash sale affects Cash immediately.",
          "A credit sale creates a Debtor.",
        ],
      },
    ],
    visualFlow: [
      "Business event",
      "Money-measurable?",
      "Business-related?",
      "Source document",
      "Identify accounts",
      "Journal entry",
      "Ledger",
      "Trial balance",
      "Final accounts",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Owner started business with cash Rs.50,000.",
        entry: ["Should it be recorded? Yes.", "Accounts affected: Cash and Capital."],
        logic: [
          "Cash came into the business.",
          "Capital increased because the owner introduced money into the business.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10,000.",
        entry: ["Should it be recorded? Yes.", "Accounts affected: Purchases and Cash."],
        logic: [
          "Goods were purchased for the business.",
          "Cash went out of the business.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Customer asked price of goods.",
        entry: ["Should it be recorded? No.", "No accounts are affected yet."],
        logic: [
          "No sale happened.",
          "No money-measurable transaction has taken place yet.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Sold goods to Raju Rs.8,000 on credit.",
        entry: ["Should it be recorded? Yes.", "Accounts affected: Raju / Debtor and Sales."],
        logic: [
          "Sales happened even though cash was not received immediately.",
          "A customer now owes money to the business.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Owner paid personal mobile bill from business cash Rs.1,000.",
        entry: [
          "Should it be recorded? Yes.",
          "Treatment: Drawings, not business expense.",
          "Accounts affected: Drawings and Cash.",
        ],
        logic: [
          "Business cash went out.",
          "Because the expense is personal, it is treated as drawings.",
        ],
      },
    ],
    commonMistakes: [
      "Recording plans as transactions",
      "Ignoring credit transactions",
      "Recording personal expenses as business expenses",
      "Thinking only cash transactions are recorded",
      "Forgetting source documents",
      "Not identifying both accounts",
      "Writing journal entry before understanding transaction",
      "Confusing customer enquiry with sale",
    ],
    tryPrompts: [
      "Bought goods for Rs.20,000 in cash. Expected: Yes. Purchases and Cash.",
      "Sold goods to Amit Rs.15,000 on credit. Expected: Yes. Amit/Debtor and Sales.",
      "Customer asked for discount but did not buy. Expected: No. No transaction.",
      "Paid salary Rs.5,000. Expected: Yes. Salary and Cash/Bank.",
      "Owner took goods for personal use Rs.2,000. Expected: Yes. Drawings and Purchases/Goods.",
      "Owner plans to open another shop next month. Expected: No. Only a plan.",
      "Received interest Rs.1,000. Expected: Yes. Cash/Bank and Interest Income.",
      "Bought furniture Rs.10,000 through bank. Expected: Yes. Furniture and Bank.",
    ],
    toolLinks: [
      { label: "Next Lesson: Source Documents and Vouchers", href: "/learn/source-documents-and-vouchers" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Source Documents and Vouchers",
      href: "/learn/source-documents-and-vouchers",
      description: "Now that you understand which transactions are recorded, learn what proof supports each entry.",
    },
  },
  "source-documents-and-vouchers": {
    slug: "source-documents-and-vouchers",
    title: "Source Documents and Vouchers",
    subtitle: "Learn what proof is used before recording a transaction in accounting books.",
    description: "Understand how bills, invoices, receipts, and vouchers help accountants record entries correctly.",
    difficulty: "Beginner",
    estimatedTime: "8-10 min",
    whatYouWillLearn: [
      "What a source document is",
      "Why proof is needed before recording a transaction",
      "What a voucher is",
      "The difference between source documents and vouchers",
      "Common examples like bill, invoice, receipt, cash memo, bank slip, debit note, and credit note",
      "How documents help in writing journal entries",
      "Why accountants should not record transactions without proof",
    ],
    conceptSections: [
      {
        title: "What is a Source Document?",
        body: [
          "A source document is the original proof of a business transaction.",
          "Before recording a transaction, the accountant should have proof that the transaction actually happened.",
          "If a shop buys goods, the purchase bill or invoice is proof.",
          "If rent is paid, the rent receipt is proof.",
          "If cash is deposited into bank, the bank slip is proof.",
          "Simple line: Source document = proof of transaction.",
        ],
      },
      {
        title: "Why source documents are important",
        body: [
          "They prove that a transaction happened.",
          "They help us know the correct amount.",
          "They show the date of transaction.",
          "They show the party name, such as customer, supplier, or landlord.",
          "They help avoid fake or wrong entries.",
          "They help prepare correct journal entries.",
          "They help check records later during audit or review.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya runs a small stationery shop.",
          "One day, she buys notebooks from a supplier for Rs.10,000.",
          "The supplier gives her a bill.",
          "She sells pens to Amit for Rs.2,000.",
          "She gives Amit a sales invoice.",
          "She pays shop rent Rs.3,000.",
          "The landlord gives her a rent receipt.",
          "She deposits Rs.5,000 into bank.",
          "The bank gives her a deposit slip.",
          "Can Riya record all these transactions from memory only? No. She should use proof.",
          "The bill, invoice, receipt, and bank slip help her record transactions correctly.",
        ],
      },
      {
        title: "Common source documents",
        body: [
          "Cash Memo: used when goods are bought or sold for cash. Example: Riya sells notebooks for cash Rs.500 and gives a cash memo.",
          "Invoice or Bill: used when goods are bought or sold, especially on credit. Example: Riya buys goods from a supplier for Rs.10,000 and receives an invoice.",
          "Receipt: proof that money has been received. Example: the landlord gives a rent receipt after receiving rent.",
          "Bank Slip or Deposit Slip: proof of money deposited into bank. Example: Riya deposits Rs.5,000 into bank and receives a deposit slip.",
          "Cheque Counterfoil: proof that a cheque was issued. Example: Riya pays supplier by cheque and keeps the cheque counterfoil.",
          "Debit Note: used when goods are returned to supplier. Example: Riya returns damaged goods to supplier and prepares a debit note.",
          "Credit Note: used when customer returns goods to the business. Example: Amit returns goods to Riya, and Riya issues a credit note.",
        ],
      },
      {
        title: "What is a Voucher?",
        body: [
          "A voucher is an accounting document prepared using the source document.",
          "Source document is the proof.",
          "Voucher is the accounting record or authorization made from that proof.",
          "Example: Riya pays rent Rs.3,000 and receives a rent receipt.",
          "Based on that receipt, the accountant prepares a payment voucher.",
          "Simple line: Voucher = accounting support prepared from proof.",
        ],
      },
      {
        title: "Types of vouchers",
        body: [
          "Payment Voucher: used when business pays money. Example: paid rent Rs.3,000.",
          "Receipt Voucher: used when business receives money. Example: received cash from customer Rs.5,000.",
          "Purchase Voucher: used for purchase of goods. Example: bought goods from supplier Rs.10,000.",
          "Sales Voucher: used for sale of goods. Example: sold goods to customer Rs.8,000.",
          "Journal Voucher: used for non-cash or adjustment entries. Example: depreciation on furniture Rs.2,000.",
          "Contra Voucher: used for cash and bank transfer. Example: deposited cash into bank Rs.5,000.",
        ],
      },
      {
        title: "How documents help journal entries",
        body: [
          "Documents tell the accountant what happened.",
          "They show the amount, date, and party name.",
          "They help identify the accounts affected.",
          "They reduce guessing.",
          "A good journal entry starts with clear proof.",
        ],
      },
    ],
    comparisonTable: {
      title: "Difference between Source Document and Voucher",
      leftHeading: "Source Document",
      rightHeading: "Voucher",
      rows: [
        {
          left: "Original proof of transaction",
          right: "Accounting document prepared from proof",
        },
        {
          left: "Usually received or given at transaction time",
          right: "Usually prepared for accounting record",
        },
        {
          left: "Examples: bill, receipt, invoice",
          right: "Examples: payment voucher, receipt voucher, journal voucher",
        },
        {
          left: "Shows transaction evidence",
          right: "Helps record transaction in books",
        },
      ],
      note: "Memory line: Source document proves the transaction. Voucher supports the accounting entry.",
    },
    visualFlow: [
      "Business transaction",
      "Source document",
      "Voucher",
      "Journal entry",
      "Ledger",
      "Trial balance",
      "Final accounts",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Bought goods for cash Rs.10,000.",
        entry: [
          "Source document: Cash memo or purchase bill.",
          "Voucher: Purchase voucher / payment voucher.",
          "Accounts affected: Purchases and Cash.",
        ],
        logic: [
          "The bill proves goods were purchased.",
          "The voucher helps the accountant record the entry correctly.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Paid rent Rs.3,000.",
        entry: [
          "Source document: Rent receipt.",
          "Voucher: Payment voucher.",
          "Accounts affected: Rent and Cash/Bank.",
        ],
        logic: [
          "The receipt proves rent was paid.",
          "The payment voucher supports the accounting record.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Sold goods to Amit on credit Rs.5,000.",
        entry: [
          "Source document: Sales invoice.",
          "Voucher: Sales voucher.",
          "Accounts affected: Amit/Debtor and Sales.",
        ],
        logic: [
          "The invoice proves the credit sale.",
          "Amit becomes the customer who has to pay later.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Deposited cash into bank Rs.8,000.",
        entry: [
          "Source document: Bank deposit slip.",
          "Voucher: Contra voucher.",
          "Accounts affected: Bank and Cash.",
        ],
        logic: [
          "The deposit slip proves cash went into the bank.",
          "A contra voucher supports the cash-bank transfer.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Goods returned to supplier Rs.2,000.",
        entry: [
          "Source document: Debit note.",
          "Voucher: Purchase return voucher / journal voucher.",
          "Accounts affected: Supplier and Purchase Return.",
        ],
        logic: [
          "The debit note proves goods were returned to the supplier.",
          "The voucher helps record the purchase return.",
        ],
      },
    ],
    commonMistakes: [
      "Recording a transaction without proof",
      "Confusing invoice with receipt",
      "Thinking voucher and source document are exactly the same",
      "Not checking amount, date, and party name before recording",
      "Ignoring bank slips and cheque counterfoils",
      "Confusing debit note and credit note",
      "Recording customer enquiry as a transaction",
      "Preparing journal entry before understanding the document",
    ],
    tryPrompts: [
      "Bought goods for cash Rs.5,000. Expected: Cash memo / purchase bill.",
      "Paid shop rent Rs.3,000. Expected: Rent receipt / payment voucher.",
      "Sold goods to Raju on credit Rs.8,000. Expected: Sales invoice.",
      "Deposited cash into bank Rs.10,000. Expected: Bank deposit slip.",
      "Goods returned to supplier Rs.2,000. Expected: Debit note.",
      "Customer returned goods Rs.1,500. Expected: Credit note.",
      "Paid supplier by cheque Rs.12,000. Expected: Cheque counterfoil / payment voucher.",
      "Depreciation charged on furniture Rs.2,000. Expected: Journal voucher.",
    ],
    toolLinks: [
      { label: "Next Lesson: Rules of Debit and Credit", href: "/learn/rules-of-debit-and-credit" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Rules of Debit and Credit",
      href: "/learn/rules-of-debit-and-credit",
      description: "Now that you understand transaction proof, learn how accounts are debited and credited.",
    },
  },
  "rules-of-debit-and-credit": {
    slug: "rules-of-debit-and-credit",
    title: "Rules of Debit and Credit",
    subtitle: "Learn the simple logic behind why an account is debited or credited.",
    description: "Understand debit and credit as the two sides used to record every business transaction.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What debit and credit mean",
      "Why every transaction has two sides",
      "How assets, liabilities, capital, income, and expenses behave",
      "How to decide which account is debited",
      "How to decide which account is credited",
      "Common debit-credit mistakes",
    ],
    conceptSections: [
      {
        title: "What debit and credit really mean",
        body: [
          "Debit and Credit are the two sides of accounting.",
          "Debit does not always mean increase.",
          "Credit does not always mean decrease.",
          "Simple line: Debit means left side. Credit means right side. The effect depends on the account.",
          "For some accounts, debit means increase. For some accounts, credit means increase.",
          "So first understand the account type, then apply the rule.",
        ],
      },
      {
        title: "Why every transaction has two sides",
        body: [
          "Every business transaction affects at least two accounts.",
          "If cash comes in, something else also changes, such as capital, sales, or a debtor.",
          "If cash goes out, something else also changes, such as rent, salary, purchases, furniture, or a creditor.",
          "That is why every journal entry has a debit side and a credit side.",
          "The total debit amount must always equal the total credit amount.",
        ],
      },
      {
        title: "The five modern rules",
        body: [
          "Asset: if an asset increases, debit it. If an asset decreases, credit it. Cash received means Cash A/c Dr. Cash paid means Cash A/c Cr.",
          "Liability: if a liability increases, credit it. If a liability decreases, debit it. Goods bought on credit from Amit means Amit A/c Cr. Paid Amit means Amit A/c Dr.",
          "Capital: if capital increases, credit it. If capital decreases, debit it. Owner starts business with cash means Capital A/c Cr. Owner withdraws cash means Drawings A/c Dr.",
          "Expense or Loss: expenses and losses are debited. Paid rent means Rent A/c Dr.",
          "Income or Gain: incomes and gains are credited. Received commission means Commission Income A/c Cr.",
        ],
      },
      {
        title: "Personal Account",
        rule: "Debit the receiver, Credit the giver",
        body: [
          "A personal account is connected with a person, business, customer, supplier, debtor, creditor, or owner.",
          "If a person receives value, debit that person's account.",
          "If a person gives value, credit that person's account.",
          "Example: Paid cash to Amit Rs.5,000.",
          "Amit receives money, so Amit A/c is debited.",
          "Cash goes out, so Cash A/c is credited.",
        ],
      },
      {
        title: "Real Account",
        rule: "Debit what comes in, Credit what goes out",
        body: [
          "A real account is connected with assets such as cash, bank, furniture, machinery, and building.",
          "If an asset comes into the business, debit it.",
          "If an asset goes out of the business, credit it.",
          "Example: Bought furniture for cash Rs.10,000.",
          "Furniture comes in, so Furniture A/c is debited.",
          "Cash goes out, so Cash A/c is credited.",
        ],
      },
      {
        title: "Nominal Account",
        rule: "Debit all expenses and losses, Credit all incomes and gains",
        body: [
          "A nominal account is connected with expenses, losses, incomes, and gains.",
          "Expenses and losses are debited.",
          "Incomes and gains are credited.",
          "Example: Paid salary Rs.8,000.",
          "Salary is an expense, so Salary A/c is debited.",
          "Cash goes out, so Cash A/c is credited.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya runs a small stationery shop.",
          "Day 1: she starts business with cash Rs.50,000. Cash comes into business, so Cash is debited. Owner's capital increases, so Capital is credited.",
          "Day 2: she buys notebooks for cash Rs.10,000. Purchases increase, so Purchases is debited. Cash decreases, so Cash is credited.",
          "Day 3: she sells goods for cash Rs.5,000. Cash increases, so Cash is debited. Sales income increases, so Sales is credited.",
          "Day 4: she pays rent Rs.2,000. Rent expense increases, so Rent is debited. Cash decreases, so Cash is credited.",
          "If students can identify what increased and what decreased, debit-credit becomes easier.",
        ],
      },
    ],
    modernRules: [
      { accountType: "Asset", increase: "Debit", decrease: "Credit", example: "Cash, Bank, Furniture" },
      { accountType: "Liability", increase: "Credit", decrease: "Debit", example: "Loan, Creditors" },
      { accountType: "Capital", increase: "Credit", decrease: "Debit", example: "Owner's Capital, Drawings" },
      { accountType: "Expense/Loss", increase: "Debit", decrease: "Credit", example: "Rent, Salary, Wages" },
      { accountType: "Income/Gain", increase: "Credit", decrease: "Debit", example: "Sales, Commission Received" },
    ],
    visualFlow: [
      "Read transaction",
      "Identify accounts affected",
      "Ask account type",
      "Check increase/decrease",
      "Apply rule",
      "Write journal entry",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Started business with cash Rs.50,000",
        entry: ["Cash A/c Dr. Rs.50,000", "To Capital A/c Rs.50,000"],
        logic: [
          "Cash is an asset and increased, so Cash is debited.",
          "Capital increased, so Capital is credited.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10,000",
        entry: ["Purchases A/c Dr. Rs.10,000", "To Cash A/c Rs.10,000"],
        logic: [
          "Purchases increased, so Purchases is debited.",
          "Cash decreased, so Cash is credited.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Paid salary Rs.5,000 in cash",
        entry: ["Salary A/c Dr. Rs.5,000", "To Cash A/c Rs.5,000"],
        logic: [
          "Salary is an expense, so Salary is debited.",
          "Cash went out, so Cash is credited.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Sold goods to Raju Rs.8,000 on credit",
        entry: ["Raju A/c Dr. Rs.8,000", "To Sales A/c Rs.8,000"],
        logic: [
          "Raju becomes debtor. Amount receivable from Raju increases, so Raju is debited.",
          "Sales income increases, so Sales is credited.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Paid Amit Rs.6,000",
        entry: ["Amit A/c Dr. Rs.6,000", "To Cash A/c Rs.6,000"],
        logic: [
          "Amit is creditor. Liability to Amit decreases, so Amit is debited.",
          "Cash decreases, so Cash is credited.",
        ],
      },
    ],
    commonMistakes: [
      "Thinking debit always means increase",
      "Thinking credit always means decrease",
      "Putting Cash on debit side when cash is paid",
      "Forgetting that expenses are debited",
      "Forgetting that incomes are credited",
      "Confusing debtor and creditor",
      "Missing To before the credit account",
      "Looking only at account name without understanding the transaction",
    ],
    tryPrompts: [
      "Paid rent Rs.3,000 in cash. Expected: Rent A/c Dr. / To Cash A/c.",
      "Received commission Rs.2,000. Expected: Cash A/c Dr. / To Commission Income A/c.",
      "Bought furniture through bank Rs.12,000. Expected: Furniture A/c Dr. / To Bank A/c.",
      "Sold goods to Amit Rs.7,000. Expected: Amit A/c Dr. / To Sales A/c.",
      "Owner withdrew cash Rs.2,000. Expected: Drawings A/c Dr. / To Cash A/c.",
    ],
    toolLinks: [
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Basics", href: "/practice" },
      { label: "Check Your Entry", href: "/tools" },
    ],
    nextLesson: {
      label: "Continue to Journal Entry Basics",
      href: "/learn/journal-entry-basics",
      description: "Now that you know how debit and credit work, learn how to write a full journal entry correctly.",
    },
  },
  "journal-entry-basics": {
    slug: "journal-entry-basics",
    title: "Journal Entry Basics",
    subtitle: "Learn how to write transactions in proper debit and credit format.",
    description: "A journal entry is the first formal record of a business transaction in accounting books.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What a journal entry is",
      "Why journal entries have debit and credit sides",
      "How to write Dr. and To",
      "How to check whether an entry is balanced",
      "How simple and compound entries work",
      "Common format mistakes",
    ],
    conceptSections: [
      {
        title: "What is a journal entry?",
        body: [
          "A journal entry is the first formal record of a business transaction in accounting books.",
          "Simple line: journal entry means writing which account is debited and which account is credited.",
          "Every journal entry has at least one debit and one credit.",
          "Total debit amount must equal total credit amount.",
        ],
      },
      {
        title: "Journal entry format",
        body: [
          "Debit Account A/c Dr. Amount",
          "To Credit Account A/c Amount",
          "Example: Purchases A/c Dr. Rs.10,000",
          "To Cash A/c Rs.10,000",
          "Debit account is written first.",
          "Credit account starts with To.",
          "Amounts should be equal.",
          "Each account should be written clearly.",
        ],
      },
      {
        title: "Why Dr. and To are used",
        body: [
          "Dr. shows the account being debited.",
          "To shows the account being credited.",
          "To is important in traditional journal format.",
          "It helps students and teachers quickly see the debit side and credit side.",
        ],
      },
      {
        title: "Step-by-step method",
        body: [
          "Step 1: read the transaction carefully.",
          "Step 2: identify the accounts affected.",
          "Step 3: find the account type: Asset, Liability, Capital, Expense, or Income.",
          "Step 4: apply the debit-credit rule.",
          "Step 5: write the debit account first.",
          "Step 6: write the credit account with To.",
          "Step 7: check debit total = credit total.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya's stationery shop has three transactions.",
          "Transaction 1: Riya buys goods for cash Rs.10,000. Accounts affected are Purchases and Cash. Purchases is debited. Cash is credited.",
          "Transaction 2: Riya sells goods to Amit Rs.5,000. Accounts affected are Amit and Sales. Amit is debited. Sales is credited.",
          "Transaction 3: Riya pays rent Rs.2,000. Accounts affected are Rent and Cash. Rent is debited. Cash is credited.",
          "Every time, we first understand the transaction, then identify accounts, then write the entry.",
        ],
      },
      {
        title: "Compound journal entries",
        body: [
          "Sometimes one transaction affects more than two accounts. This is called a compound journal entry.",
          "Example: Received Rs.9,500 from Mohan in full settlement of Rs.10,000.",
          "Cash A/c Dr. Rs.9,500",
          "Discount Allowed A/c Dr. Rs.500",
          "To Mohan A/c Rs.10,000",
          "Cash received is debited. Discount allowed is a loss, so it is debited. Mohan's account is credited because his receivable is settled.",
          "Total debit = Rs.9,500 + Rs.500 = Rs.10,000. Total credit = Rs.10,000. So the entry is balanced.",
          "Another example: Bought goods Rs.10,000 plus GST 18% for cash.",
          "Purchases A/c Dr. Rs.10,000",
          "Input GST A/c Dr. Rs.1,800",
          "To Cash A/c Rs.11,800",
          "Purchases increased. Input GST is claimable tax credit. Cash went out.",
        ],
      },
    ],
    visualFlow: [
      "Read transaction",
      "Identify accounts",
      "Find account types",
      "Apply rules",
      "Write debit first",
      "Write credit with To",
      "Check totals",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Started business with cash Rs.50,000",
        entry: ["Cash A/c Dr. Rs.50,000", "To Capital A/c Rs.50,000"],
        logic: [
          "Cash increased.",
          "Capital increased.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10,000",
        entry: ["Purchases A/c Dr. Rs.10,000", "To Cash A/c Rs.10,000"],
        logic: [
          "Purchases increased.",
          "Cash decreased.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Paid wages Rs.3,000",
        entry: ["Wages A/c Dr. Rs.3,000", "To Cash A/c Rs.3,000"],
        logic: [
          "Wages is an expense.",
          "Cash went out.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Sold goods to Raju Rs.12,000",
        entry: ["Raju A/c Dr. Rs.12,000", "To Sales A/c Rs.12,000"],
        logic: [
          "Raju becomes debtor.",
          "Sales income increased.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Received cash from Raju Rs.5,000",
        entry: ["Cash A/c Dr. Rs.5,000", "To Raju A/c Rs.5,000"],
        logic: [
          "Cash increased.",
          "Raju's amount receivable decreased.",
        ],
      },
    ],
    commonMistakes: [
      "Missing To before credit account",
      "Writing only one account",
      "Debit and credit totals not equal",
      "Putting Cash on wrong side",
      "Confusing purchase and purchase return",
      "Confusing sales and sales return",
      "Forgetting discount in settlement entries",
      "Writing amount on only one line",
      "Writing unclear account names",
    ],
    tryPrompts: [
      "Paid salary Rs.5,000 in cash. Expected: Salary A/c Dr. / To Cash A/c.",
      "Bought furniture through bank Rs.15,000. Expected: Furniture A/c Dr. / To Bank A/c.",
      "Sold goods for cash Rs.8,000. Expected: Cash A/c Dr. / To Sales A/c.",
      "Bought goods from Amit Rs.12,000. Expected: Purchases A/c Dr. / To Amit A/c.",
      "Paid Amit Rs.10,000. Expected: Amit A/c Dr. / To Cash/Bank A/c.",
      "Received commission Rs.2,500. Expected: Cash/Bank A/c Dr. / To Commission Income A/c.",
      "Goods returned by Raju Rs.1,000. Expected: Sales Return A/c Dr. / To Raju A/c.",
      "Returned goods to Amit Rs.1,500. Expected: Amit A/c Dr. / To Purchase Return A/c.",
    ],
    toolLinks: [
      { label: "Check Your Entry", href: "/tools" },
      { label: "Try Explainer", href: "/journal-entry-solver" },
      { label: "Practice Journal Entries", href: "/practice" },
    ],
    nextLesson: {
      label: "Continue to Ledger Posting Basics",
      href: "/learn/ledger-posting-basics",
      description: "Now that you know the journal entry format, learn how those entries move into ledger accounts.",
    },
  },
  "ledger-posting-basics": {
    slug: "ledger-posting-basics",
    title: "Ledger Posting Basics",
    subtitle: "Learn how journal entries are posted into individual accounts.",
    description: "Understand how journal entries are grouped account-wise in the ledger.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What a ledger is",
      "Why ledger accounts are needed after journal entries",
      "The difference between Journal and Ledger",
      "What ledger posting means",
      "Debit side and credit side of ledger account",
      "How to post debit and credit accounts from a journal entry",
      "How to find ledger balance",
      "What balance c/d and balance b/d mean at a beginner level",
      "How ledger connects to trial balance",
    ],
    conceptSections: [
      {
        title: "What is a Ledger?",
        body: [
          "A ledger is a book or place where all transactions related to one account are collected together.",
          "Journal records transactions date-wise.",
          "Ledger arranges the same transactions account-wise.",
          "Example: if Cash is used in many transactions, the Cash Account in the ledger shows all cash received and all cash paid in one place.",
          "Simple line: Journal tells the story transaction by transaction. Ledger groups the story account by account.",
        ],
      },
      {
        title: "Why ledger is needed",
        body: [
          "Suppose Riya runs a stationery shop.",
          "In one week, she starts business with cash Rs.50,000.",
          "She buys goods for cash Rs.10,000.",
          "She pays rent Rs.3,000.",
          "She sells goods for cash Rs.5,000.",
          "If we look only at journal entries, we can see each transaction one by one.",
          "But if Riya asks, How much cash is left?, we need the Cash Account in the ledger.",
          "Ledger helps us know total cash received, total cash paid, balance of each account, amount receivable from customers, amount payable to creditors, and balances for Trial Balance.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya starts a small stationery shop.",
          "Entry 1: Cash A/c Dr. Rs.50,000 / To Capital A/c Rs.50,000.",
          "Entry 2: Purchases A/c Dr. Rs.10,000 / To Cash A/c Rs.10,000.",
          "Entry 3: Rent A/c Dr. Rs.3,000 / To Cash A/c Rs.3,000.",
          "Entry 4: Cash A/c Dr. Rs.5,000 / To Sales A/c Rs.5,000.",
          "Question: how much cash does Riya have now?",
          "Cash received = Rs.50,000 + Rs.5,000 = Rs.55,000.",
          "Cash paid = Rs.10,000 + Rs.3,000 = Rs.13,000.",
          "Cash balance = Rs.55,000 - Rs.13,000 = Rs.42,000.",
          "This is why ledger is useful. It groups all Cash transactions together.",
        ],
      },
      {
        title: "What is ledger posting?",
        body: [
          "Ledger posting means transferring information from journal entries to the correct ledger accounts.",
          "If an account is debited in journal, post it on the debit side of that account.",
          "If an account is credited in journal, post it on the credit side of that account.",
          "Example: Purchases A/c Dr. Rs.10,000 / To Cash A/c Rs.10,000.",
          "Purchases A/c is posted on the debit side for Rs.10,000.",
          "Cash A/c is posted on the credit side for Rs.10,000.",
          "Simple line: Debit in journal goes to debit side of ledger. Credit in journal goes to credit side of ledger.",
        ],
      },
      {
        title: "Debit side and credit side",
        body: [
          "A ledger account has two sides.",
          "The left side is called the debit side.",
          "The right side is called the credit side.",
          "For Cash A/c, cash received appears on the debit side.",
          "For Cash A/c, cash paid appears on the credit side.",
          "Do not overthink it at first. Put debit entries on the debit side and credit entries on the credit side.",
        ],
      },
      {
        title: "How to post from journal to ledger",
        body: [
          "Step 1: read the journal entry.",
          "Step 2: identify the account written with Dr.",
          "Step 3: post that account on its debit side.",
          "Step 4: identify the account written after To.",
          "Step 5: post that account on its credit side.",
          "Step 6: check that both accounts have been posted.",
        ],
      },
      {
        title: "How to find ledger balance",
        body: [
          "Step 1: add the debit side total.",
          "Step 2: add the credit side total.",
          "Step 3: compare both sides.",
          "Step 4: higher side minus lower side equals balance.",
          "If debit total is higher, the account has debit balance.",
          "If credit total is higher, the account has credit balance.",
          "If both sides are equal, the account is balanced and has no balance.",
          "Example: Cash debit total Rs.55,000 and credit total Rs.13,000. Balance is Rs.42,000 debit balance.",
        ],
      },
      {
        title: "Balance c/d and balance b/d",
        body: [
          "Balance c/d means balance carried down.",
          "It is written to close the ledger account for the period.",
          "Balance b/d means balance brought down.",
          "It is the same balance brought into the next period.",
          "Very simple line: Balance c/d closes the account. Balance b/d opens it again in the next period.",
        ],
      },
    ],
    comparisonTable: {
      title: "Journal vs Ledger",
      leftHeading: "Journal",
      rightHeading: "Ledger",
      rows: [
        {
          left: "Records transactions date-wise",
          right: "Records transactions account-wise",
        },
        {
          left: "First book of entry",
          right: "Main book of accounts",
        },
        {
          left: "Shows complete transaction in one place",
          right: "Shows one account's activity in one place",
        },
        {
          left: "Example: Bought goods for cash",
          right: "Example: Cash A/c, Purchases A/c",
        },
      ],
      note: "Memory line: Journal is transaction-wise. Ledger is account-wise.",
    },
    visualFlow: [
      "Transaction",
      "Journal Entry",
      "Ledger Posting",
      "Account Balance",
      "Trial Balance",
      "Final Accounts",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Started business with cash Rs.50,000.",
        entry: [
          "Journal: Cash A/c Dr. Rs.50,000",
          "To Capital A/c Rs.50,000",
          "Ledger posting: Cash A/c debit side Rs.50,000.",
          "Capital A/c credit side Rs.50,000.",
        ],
        logic: [
          "Cash is debited in the journal, so Cash is posted on debit side.",
          "Capital is credited in the journal, so Capital is posted on credit side.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Bought goods for cash Rs.10,000.",
        entry: [
          "Journal: Purchases A/c Dr. Rs.10,000",
          "To Cash A/c Rs.10,000",
          "Ledger posting: Purchases A/c debit side Rs.10,000.",
          "Cash A/c credit side Rs.10,000.",
        ],
        logic: [
          "Purchases is debited in the journal.",
          "Cash is credited because cash went out.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Paid rent Rs.3,000.",
        entry: [
          "Journal: Rent A/c Dr. Rs.3,000",
          "To Cash A/c Rs.3,000",
          "Ledger posting: Rent A/c debit side Rs.3,000.",
          "Cash A/c credit side Rs.3,000.",
        ],
        logic: [
          "Rent is debited in the journal.",
          "Cash is credited because cash was paid.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Sold goods for cash Rs.5,000.",
        entry: [
          "Journal: Cash A/c Dr. Rs.5,000",
          "To Sales A/c Rs.5,000",
          "Ledger posting: Cash A/c debit side Rs.5,000.",
          "Sales A/c credit side Rs.5,000.",
        ],
        logic: [
          "Cash is debited because cash came in.",
          "Sales is credited because income increased.",
        ],
      },
      {
        title: "Example 5",
        transaction: "Find Cash balance.",
        entry: [
          "Cash debit: Rs.50,000 + Rs.5,000 = Rs.55,000.",
          "Cash credit: Rs.10,000 + Rs.3,000 = Rs.13,000.",
          "Cash balance: Rs.42,000 debit balance.",
        ],
        logic: [
          "The debit side is higher than the credit side.",
          "So Cash A/c has a debit balance.",
        ],
      },
    ],
    commonMistakes: [
      "Posting debit account on credit side",
      "Posting credit account on debit side",
      "Forgetting to post both accounts",
      "Finding balance from one transaction only",
      "Confusing journal entry with ledger account",
      "Thinking every account has debit balance",
      "Forgetting that liabilities and incomes usually have credit balances",
      "Not checking debit total and credit total before finding balance",
      "Confusing balance c/d and balance b/d",
    ],
    tryPrompts: [
      "Cash A/c Dr. Rs.40,000 / To Capital A/c Rs.40,000 and Purchases A/c Dr. Rs.8,000 / To Cash A/c Rs.8,000. What is Cash A/c balance? Expected: Debit balance Rs.32,000.",
      "Bank A/c Dr. Rs.20,000 / To Cash A/c Rs.20,000 and Salary A/c Dr. Rs.5,000 / To Bank A/c Rs.5,000. What is Bank A/c balance? Expected: Debit balance Rs.15,000.",
      "Raju A/c Dr. Rs.10,000 / To Sales A/c Rs.10,000 and Cash A/c Dr. Rs.6,000 / To Raju A/c Rs.6,000. What is Raju A/c balance? Expected: Debit balance Rs.4,000.",
      "Purchases A/c Dr. Rs.12,000 / To Amit A/c Rs.12,000 and Amit A/c Dr. Rs.5,000 / To Cash A/c Rs.5,000. What is Amit A/c balance? Expected: Credit balance Rs.7,000.",
    ],
    toolLinks: [
      { label: "Open Ledger Tool", href: "/ledger" },
      { label: "Practice Ledger", href: "/practice/ledger" },
      { label: "Open Trial Balance", href: "/trial-balance" },
    ],
    nextLesson: {
      label: "Continue to Trial Balance Basics",
      href: "/learn/trial-balance-basics",
      description: "After ledger balances are prepared, learn how they are listed in a Trial Balance.",
    },
  },
  "trial-balance-basics": {
    slug: "trial-balance-basics",
    title: "Trial Balance Basics",
    subtitle: "Learn how ledger balances are listed to check whether debit and credit totals agree.",
    description: "Understand how debit and credit balances from the ledger are checked in one statement.",
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    whatYouWillLearn: [
      "What Trial Balance means",
      "Why Trial Balance is prepared",
      "How it uses ledger balances",
      "Debit balance and credit balance",
      "Why assets and expenses usually appear on debit side",
      "Why liabilities, capital, and incomes usually appear on credit side",
      "How debit total and credit total are compared",
      "What it means when Trial Balance agrees",
      "What it means when Trial Balance does not agree",
      "Why Trial Balance is not the same as final accounts",
      "How Trial Balance connects to Final Accounts",
    ],
    conceptSections: [
      {
        title: "What is a Trial Balance?",
        body: [
          "A Trial Balance is a statement that lists all ledger balances in one place.",
          "After journal entries are posted to ledger accounts, each ledger account has a balance.",
          "Trial Balance collects those balances and checks whether total debit balances equal total credit balances.",
          "Simple line: Trial Balance checks whether debit total and credit total are equal.",
          "Trial Balance does not directly show profit or loss. It only checks the arithmetical accuracy of ledger balances.",
        ],
      },
      {
        title: "Why Trial Balance is needed",
        body: [
          "Suppose Riya runs a stationery shop.",
          "She has many ledger accounts: Cash A/c, Capital A/c, Purchases A/c, Sales A/c, Rent A/c, Debtors A/c, and Creditors A/c.",
          "If she wants to check whether her ledger postings are balanced, she prepares a Trial Balance.",
          "Trial Balance helps list all ledger balances.",
          "It separates debit balances and credit balances.",
          "It checks whether total debit equals total credit.",
          "It helps find possible posting or totaling mistakes.",
          "It also helps prepare final accounts later.",
        ],
      },
      {
        title: "Simple story",
        body: [
          "Riya runs a small stationery shop.",
          "Her ledger balances at the end of the month are Cash A/c debit balance Rs.42,000, Purchases A/c debit balance Rs.10,000, and Rent A/c debit balance Rs.3,000.",
          "She also has Capital A/c credit balance Rs.50,000 and Sales A/c credit balance Rs.5,000.",
          "Now she prepares a Trial Balance.",
          "Debit side: Cash Rs.42,000, Purchases Rs.10,000, Rent Rs.3,000.",
          "Total debit = Rs.55,000.",
          "Credit side: Capital Rs.50,000, Sales Rs.5,000.",
          "Total credit = Rs.55,000.",
          "Because both totals are equal, the Trial Balance agrees.",
          "This gives confidence that ledger balances are arithmetically balanced.",
        ],
      },
      {
        title: "Ledger balances and Trial Balance",
        body: [
          "Ledger balances are transferred to Trial Balance.",
          "If an account has debit balance, put it on debit side of Trial Balance.",
          "If an account has credit balance, put it on credit side of Trial Balance.",
          "Cash A/c debit balance goes to debit side.",
          "Purchases A/c debit balance goes to debit side.",
          "Rent A/c debit balance goes to debit side.",
          "Capital A/c credit balance goes to credit side.",
          "Sales A/c credit balance goes to credit side.",
          "Creditors A/c credit balance goes to credit side.",
          "Memory line: Debit balance goes to debit column. Credit balance goes to credit column.",
        ],
      },
      {
        title: "Debit side and credit side",
        body: [
          "Usually debit side includes assets, expenses, losses, drawings, and purchases.",
          "Examples are Cash, Bank, Furniture, Purchases, Rent, Salary, and Debtors.",
          "Usually credit side includes liabilities, capital, incomes, gains, and sales.",
          "Examples are Capital, Loan, Creditors, Sales, and Commission Received.",
          "This is a general guide. The exact side depends on the ledger balance.",
        ],
      },
      {
        title: "How to prepare Trial Balance",
        body: [
          "Step 1: prepare ledger accounts.",
          "Step 2: find balance of each ledger account.",
          "Step 3: write debit balances in the debit column.",
          "Step 4: write credit balances in the credit column.",
          "Step 5: add debit column total.",
          "Step 6: add credit column total.",
          "Step 7: compare both totals.",
          "If both totals are equal, Trial Balance agrees.",
          "If totals are not equal, there may be an error in journal, ledger posting, balance calculation, or totaling.",
        ],
      },
      {
        title: "What Trial Balance can and cannot prove",
        body: [
          "Trial Balance can show that debit and credit totals agree.",
          "It can show that ledger balances are arithmetically balanced.",
          "It can help detect some errors.",
          "Trial Balance cannot guarantee that every transaction is recorded.",
          "It cannot guarantee that every account is correct.",
          "It cannot always catch a wrong account, an error of principle, or compensating errors.",
          "Example: if rent is wrongly recorded as salary but debit and credit amounts are equal, Trial Balance may still agree.",
          "Memory line: Trial Balance checks totals, but it cannot catch every mistake.",
        ],
      },
    ],
    visualFlow: [
      "Transaction",
      "Journal Entry",
      "Ledger Posting",
      "Ledger Balance",
      "Trial Balance",
      "Final Accounts",
    ],
    solvedExamples: [
      {
        title: "Example 1",
        transaction: "Ledger balances: Cash Dr Rs.37,000, Purchases Dr Rs.10,000, Rent Dr Rs.3,000, Capital Cr Rs.50,000.",
        entry: [
          "Debit side: Cash Rs.37,000, Purchases Rs.10,000, Rent Rs.3,000.",
          "Credit side: Capital Rs.50,000.",
          "Debit total: Rs.50,000.",
          "Credit total: Rs.50,000.",
          "Result: Trial Balance agrees.",
        ],
        logic: [
          "Debit balances go to the debit column.",
          "Credit balances go to the credit column.",
        ],
      },
      {
        title: "Example 2",
        transaction: "Ledger balances: Bank Dr Rs.15,000, Furniture Dr Rs.10,000, Capital Cr Rs.25,000.",
        entry: [
          "Bank and Furniture go to debit side.",
          "Capital goes to credit side.",
          "Debit total: Rs.25,000.",
          "Credit total: Rs.25,000.",
          "Result: Trial Balance agrees.",
        ],
        logic: [
          "Bank and Furniture are debit balances.",
          "Capital is a credit balance.",
        ],
      },
      {
        title: "Example 3",
        transaction: "Ledger balances: Debtors Dr Rs.8,000, Cash Dr Rs.12,000, Sales Cr Rs.20,000.",
        entry: [
          "Debtors and Cash go to debit side.",
          "Sales goes to credit side.",
          "Debit total: Rs.20,000.",
          "Credit total: Rs.20,000.",
          "Result: Trial Balance agrees.",
        ],
        logic: [
          "Debtors and Cash are debit balances.",
          "Sales is a credit balance.",
        ],
      },
      {
        title: "Example 4",
        transaction: "Debit total Rs.40,000 and credit total Rs.38,000.",
        entry: [
          "Result: Trial Balance does not agree.",
          "Difference: Rs.2,000.",
        ],
        logic: [
          "There may be a mistake in posting, balancing, or totaling.",
          "The totals must be checked again.",
        ],
      },
    ],
    commonMistakes: [
      "Putting a debit balance in credit column",
      "Putting a credit balance in debit column",
      "Forgetting to include one ledger balance",
      "Writing the wrong amount",
      "Totaling debit or credit column incorrectly",
      "Thinking Trial Balance means Final Accounts",
      "Thinking Trial Balance agreement means no mistakes at all",
      "Confusing Cash balance with Sales or Profit",
      "Including the same account twice",
    ],
    tryPrompts: [
      "Cash Dr Rs.30,000, Purchases Dr Rs.10,000, Rent Dr Rs.5,000, Capital Cr Rs.45,000. Expected: Debit total Rs.45,000, Credit total Rs.45,000, Trial Balance agrees.",
      "Bank Dr Rs.20,000, Debtors Dr Rs.8,000, Sales Cr Rs.28,000. Expected: Debit total Rs.28,000, Credit total Rs.28,000, Trial Balance agrees.",
      "Furniture Dr Rs.15,000, Cash Dr Rs.5,000, Loan Cr Rs.10,000, Capital Cr Rs.10,000. Expected: Debit total Rs.20,000, Credit total Rs.20,000, Trial Balance agrees.",
      "Debit total Rs.50,000 and Credit total Rs.48,000. Does Trial Balance agree? Expected: No. Difference Rs.2,000.",
    ],
    toolLinks: [
      { label: "Open Trial Balance Tool", href: "/trial-balance" },
      { label: "Practice Trial Balance", href: "/practice/trial-balance" },
      { label: "Open Final Accounts", href: "/final-accounts" },
    ],
    nextLesson: {
      label: "Open Final Accounts Tool",
      href: "/final-accounts",
      description: "After Trial Balance, the next step is to prepare Trading A/c, Profit & Loss A/c, and Balance Sheet.",
    },
  },
};
