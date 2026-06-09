import {
  generateCallsInAdvanceReceivedEntry,
  generateCallsInArrearsReceiptEntry,
  generateDebentureIssueAtDiscountEntry,
  generateDebentureRedemptionAtParEntry,
  generateShareApplicationMoneyReceivedEntry,
  generateShareFirstCallDueEntry,
  generateShareForfeitureEntry,
  generateShareIssueAtPremiumEntry,
} from "../generators/company-journal-generator";
import {
  generateGoodwillCompensationEntry,
  generateInterestOnCapitalAllowedEntry,
  generateInterestOnCapitalUnderFluctuatingCapitalEntry,
  generateInterestOnDrawingsChargedEntry,
  generatePartnerCapitalContributionEntry,
  generatePartnerDrawingsPaidInCashEntry,
  generatePartnerSalaryAllowedEntry,
  generateRealisationAssetTransferEntry,
  generateRevaluationLossOnAssetEntry,
} from "../generators/partnership-journal-generator";
import type { JournalEntry } from "../types";

export type AdvancedPracticeTopic = "partnership" | "company_accounts";

export type AdvancedPracticeMode = "by_topic" | "mixed";

export type AdvancedPracticeQuestion = {
  id: string;
  topic: AdvancedPracticeTopic;
  title: string;
  prompt: string;
  difficulty: "beginner" | "intermediate";
  tags: string[];
  expectedJournalEntries: JournalEntry[];
  explanation: string;
  whyThisEntry?: string[];
  finalAccountsImpact?: AdvancedFinalAccountsImpact;
  beginnerHint: string;
  commonMistakes: string[];
  source: "advanced-practice-generator-v1";
};

export type AdvancedFinalAccountsImpact = {
  summary: string;
  points: Array<{
    label: string;
    detail: string;
  }>;
};

export type AdvancedPracticeQuestionFilter = {
  topic?: AdvancedPracticeTopic | "all";
  tags?: string[];
  difficulty?: "beginner" | "intermediate";
  limit?: number;
};

export type AdvancedPracticeQuestionBank = {
  version: string;
  questions: AdvancedPracticeQuestion[];
};

export const ADVANCED_PRACTICE_QUESTION_BANK_VERSION = "advanced-practice-question-bank-v1";

const advancedPracticeQuestions: AdvancedPracticeQuestion[] = [
  createQuestion({
    id: "company-share-application-money-received-practice",
    topic: "company_accounts",
    title: "Share application money received",
    prompt: "The company received share application money of Rs.25,000 by bank. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "share-application", "share-issue"],
    expectedJournalEntries: [
      generateShareApplicationMoneyReceivedEntry({
        id: "company-share-application-money-received-practice-entry",
        transactionText: "The company received share application money of Rs.25,000 by bank.",
        amount: 25000,
      }),
    ],
    explanation:
      "Bank is debited because money is received. Share Application is credited because application money is recorded separately until shares are processed.",
    whyThisEntry: [
      "Bank is debited because application money is received by bank.",
      "Share Application is credited because the money is received against applications and is not yet final share capital.",
    ],
    beginnerHint: "Application money is not Share Capital yet; credit Share Application.",
    commonMistakes: [
      "Crediting Share Capital immediately.",
      "Debiting Share Application instead of crediting it.",
    ],
  }),
  createQuestion({
    id: "company-calls-in-advance-practice",
    topic: "company_accounts",
    title: "Calls in advance received",
    prompt: "The company received calls in advance of Rs.2,000 by bank. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "calls-in-advance"],
    expectedJournalEntries: [
      generateCallsInAdvanceReceivedEntry({
        id: "company-calls-in-advance-practice-entry",
        transactionText: "The company received calls in advance of Rs.2,000 by bank.",
        amount: 2000,
      }),
    ],
    explanation:
      "Bank is debited because money is received. Calls in Advance is credited because money received before it is due is a liability.",
    whyThisEntry: [
      "Bank is debited because money is received by bank.",
      "Calls in Advance is credited because the company received call money before it was due.",
    ],
    beginnerHint: "Advance call money is not share capital yet; treat it as a liability.",
    commonMistakes: [
      "Crediting Share Capital immediately.",
      "Treating Calls in Advance as an expense.",
    ],
  }),
  createQuestion({
    id: "company-debenture-redemption-at-par-practice",
    topic: "company_accounts",
    title: "Debenture redemption at par",
    prompt: "The company redeemed debentures of Rs.50,000 at par by bank. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "debenture-redemption"],
    expectedJournalEntries: [
      generateDebentureRedemptionAtParEntry({
        id: "company-debenture-redemption-at-par-practice-entry",
        transactionText: "The company redeemed debentures of Rs.50,000 at par by bank.",
        amount: 50000,
      }),
    ],
    explanation:
      "Debentures is debited because the liability is closed. Bank is credited because the company pays money through bank.",
    whyThisEntry: [
      "Debentures is debited because the debenture liability is being settled.",
      "Bank is credited because money is paid out through bank.",
    ],
    beginnerHint: "At par means repay the debenture face value only: debit Debentures and credit Bank.",
    commonMistakes: [
      "Adding premium on redemption when the question says at par.",
      "Crediting Debentures instead of debiting it to close the liability.",
    ],
  }),
  createQuestion({
    id: "company-share-issue-premium-practice",
    topic: "company_accounts",
    title: "Share issue at premium",
    prompt:
      "A company issued shares and received Rs.1,20,000 in bank. Share Capital is Rs.1,00,000 and Securities Premium is Rs.20,000. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "share-capital", "premium"],
    expectedJournalEntries: [
      generateShareIssueAtPremiumEntry({
        id: "company-share-issue-premium-practice-entry",
        transactionText:
          "A company issued shares and received Rs.1,20,000 in bank. Share Capital is Rs.1,00,000 and Securities Premium is Rs.20,000.",
        bankAmount: 120000,
        shareCapitalAmount: 100000,
        securitiesPremiumAmount: 20000,
      }),
    ],
    explanation:
      "Bank is debited because money is received. Share Capital is credited for face value. Securities Premium is credited for extra amount received.",
    beginnerHint: "Separate the bank receipt into share capital face value and securities premium.",
    commonMistakes: [
      "Crediting the full amount to Share Capital instead of separating Securities Premium.",
      "Debiting Securities Premium instead of crediting it.",
    ],
  }),
  createQuestion({
    id: "company-first-call-due-practice",
    topic: "company_accounts",
    title: "First call due",
    prompt: "First call of Rs.30,000 became due on shares. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "share-call"],
    expectedJournalEntries: [
      generateShareFirstCallDueEntry({
        id: "company-first-call-due-practice-entry",
        transactionText: "First call of Rs.30,000 became due on shares.",
        callAmount: 30000,
      }),
    ],
    explanation:
      "Share First Call is debited because money is due from shareholders. Share Capital is credited because called-up share capital increases.",
    beginnerHint: "When a call becomes due, record the amount receivable before recording cash receipt.",
    commonMistakes: [
      "Debiting Bank before the call money is received.",
      "Crediting Share First Call instead of Share Capital.",
    ],
  }),
  createQuestion({
    id: "company-calls-in-arrears-practice",
    topic: "company_accounts",
    title: "Calls in arrears",
    prompt:
      "Against first call of Rs.30,000, the company received Rs.27,000 in bank and Rs.3,000 remained unpaid. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "calls-in-arrears"],
    expectedJournalEntries: [
      generateCallsInArrearsReceiptEntry({
        id: "company-calls-in-arrears-practice-entry",
        transactionText:
          "Against first call of Rs.30,000, the company received Rs.27,000 in bank and Rs.3,000 remained unpaid.",
        callDueAmount: 30000,
        bankReceivedAmount: 27000,
        callsInArrearsAmount: 3000,
      }),
    ],
    explanation:
      "Bank is debited for money received. Calls in Arrears is debited for money not received. Share First Call is credited to close the amount due.",
    beginnerHint: "Split the call due into the amount received and the amount still unpaid.",
    commonMistakes: [
      "Ignoring the unpaid amount.",
      "Crediting Calls in Arrears instead of debiting it.",
    ],
  }),
  createQuestion({
    id: "company-share-forfeiture-practice",
    topic: "company_accounts",
    title: "Share forfeiture",
    prompt:
      "Shares of Rs.10,000 were forfeited for non-payment of Rs.3,000. The company had already received Rs.7,000. Pass the journal entry.",
    difficulty: "intermediate",
    tags: ["company", "forfeiture"],
    expectedJournalEntries: [
      generateShareForfeitureEntry({
        id: "company-share-forfeiture-practice-entry",
        transactionText:
          "Shares of Rs.10,000 were forfeited for non-payment of Rs.3,000. The company had already received Rs.7,000.",
        shareCapitalAmount: 10000,
        callsInArrearsAmount: 3000,
        shareForfeitureAmount: 7000,
      }),
    ],
    explanation:
      "Share Capital is debited because shares are cancelled. Calls in Arrears is credited for unpaid amount. Share Forfeiture is credited for amount already received.",
    beginnerHint: "Forfeiture cancels share capital and keeps the amount already received in Share Forfeiture.",
    commonMistakes: [
      "Crediting Bank even though cash is not received at forfeiture.",
      "Forgetting the Calls in Arrears credit.",
    ],
  }),
  createQuestion({
    id: "company-debenture-issue-discount-practice",
    topic: "company_accounts",
    title: "Debenture issue at discount",
    prompt: "Debentures of Rs.1,00,000 were issued for Rs.95,000. Discount on issue is Rs.5,000. Pass the journal entry.",
    difficulty: "intermediate",
    tags: ["company", "debenture", "discount"],
    expectedJournalEntries: [
      generateDebentureIssueAtDiscountEntry({
        id: "company-debenture-issue-discount-practice-entry",
        transactionText: "Debentures of Rs.1,00,000 were issued for Rs.95,000. Discount on issue is Rs.5,000.",
        debentureAmount: 100000,
        bankReceivedAmount: 95000,
        discountAmount: 5000,
      }),
    ],
    explanation:
      "Bank is debited for money received. Discount on Issue of Debentures is debited for the discount. Debentures is credited for the face value of borrowing.",
    beginnerHint: "The debenture liability is recorded at face value, while discount is a debit.",
    commonMistakes: [
      "Crediting Debentures with only the cash received.",
      "Crediting Discount on Issue of Debentures.",
    ],
  }),
  createQuestion({
    id: "partnership-capital-contribution-practice",
    topic: "partnership",
    title: "Partner capital introduced",
    prompt: "Amit introduced capital of Rs.50,000 into the partnership by bank. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "capital-contribution", "fixed-capital"],
    expectedJournalEntries: [
      generatePartnerCapitalContributionEntry({
        id: "partnership-capital-contribution-practice-entry",
        transactionText: "Amit introduced capital of Rs.50,000 into the partnership by bank.",
        partnerName: "Amit",
        amount: 50000,
      }),
    ],
    explanation:
      "Bank is debited because the firm receives money. Amit Capital is credited because Amit's capital in the partnership increases.",
    whyThisEntry: [
      "Bank is debited because money comes into the business through bank.",
      "Amit Capital is credited because Amit's owner's capital in the firm increases.",
    ],
    finalAccountsImpact: {
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Bank increases" },
        { label: "Capital", detail: "Amit Capital increases" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    },
    beginnerHint: "When a partner brings money into the firm, debit Bank and credit that partner's Capital Account.",
    commonMistakes: [
      "Crediting Bank even though money is received.",
      "Using Profit and Loss Appropriation instead of Amit Capital.",
    ],
  }),
  createQuestion({
    id: "partnership-drawings-paid-cash-practice",
    topic: "partnership",
    title: "Partner drawings paid in cash",
    prompt: "Amit withdrew cash of Rs.3,000 from the partnership for personal use. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "drawings", "cash"],
    expectedJournalEntries: [
      generatePartnerDrawingsPaidInCashEntry({
        id: "partnership-drawings-paid-cash-practice-entry",
        transactionText: "Amit withdrew cash of Rs.3,000 from the partnership for personal use.",
        partnerName: "Amit",
        amount: 3000,
      }),
    ],
    explanation:
      "Amit Drawings is debited because the partner's personal withdrawal is recorded. Cash is credited because cash leaves the firm.",
    whyThisEntry: [
      "Amit Drawings is debited because Amit takes value out for personal use.",
      "Cash is credited because cash leaves the business.",
    ],
    finalAccountsImpact: {
      summary: "This entry affects the Balance Sheet only. There is no direct Profit & Loss impact.",
      points: [
        { label: "Balance Sheet", detail: "affected" },
        { label: "Asset", detail: "Cash decreases" },
        { label: "Capital/Drawings", detail: "Amit Drawings increases and is adjusted against capital" },
        { label: "Profit & Loss", detail: "no direct impact" },
      ],
    },
    beginnerHint: "When a partner withdraws cash for personal use, debit that partner's Drawings Account and credit Cash.",
    commonMistakes: [
      "Debiting Cash even though cash is going out.",
      "Crediting Amit Capital instead of recording Amit Drawings.",
    ],
  }),
  createQuestion({
    id: "partnership-interest-on-capital-fluctuating-practice",
    topic: "partnership",
    title: "Interest on capital under fluctuating capital",
    prompt: "Interest on capital of Rs.5,000 is allowed to Amit under the fluctuating capital method. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "interest-on-capital", "fluctuating-capital"],
    expectedJournalEntries: [
      generateInterestOnCapitalUnderFluctuatingCapitalEntry({
        id: "partnership-interest-on-capital-fluctuating-practice-entry",
        transactionText: "Interest on capital of Rs.5,000 is allowed to Amit under the fluctuating capital method.",
        partnerName: "Amit",
        amount: 5000,
      }),
    ],
    explanation:
      "Interest on Capital is debited because the firm records the partner benefit. Amit Current is credited because under fluctuating capital, the amount is added to the partner's current account.",
    whyThisEntry: [
      "Interest on Capital is debited because interest is allowed to the partner.",
      "Amit Current is credited because the amount is credited to Amit under the fluctuating capital method.",
    ],
    beginnerHint: "Under fluctuating capital method, credit Amit Current, not Amit Capital.",
    commonMistakes: [
      "Crediting Amit Capital instead of Amit Current.",
      "Using Bank even though no cash payment is mentioned.",
    ],
  }),
  createQuestion({
    id: "partnership-partner-salary-practice",
    topic: "partnership",
    title: "Partner salary allowed",
    prompt: "Amit is allowed partner salary of Rs.10,000. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "appropriation", "partner-salary"],
    expectedJournalEntries: [
      generatePartnerSalaryAllowedEntry({
        id: "partnership-partner-salary-practice-entry",
        transactionText: "Amit is allowed partner salary of Rs.10,000.",
        partnerName: "Amit",
        amount: 10000,
      }),
    ],
    explanation:
      "Profit and Loss Appropriation is debited because profit is being appropriated. Amit Capital is credited because Amit receives the benefit.",
    beginnerHint: "Partner salary is an appropriation of profit, not a normal salary expense.",
    commonMistakes: [
      "Debiting Salary Expense instead of Profit and Loss Appropriation.",
      "Crediting Bank even though no payment is mentioned.",
    ],
  }),
  createQuestion({
    id: "partnership-interest-on-capital-practice",
    topic: "partnership",
    title: "Interest on capital allowed",
    prompt: "Interest on capital is allowed to Riya Rs.5,000 and Amit Rs.5,000. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "appropriation", "interest-on-capital"],
    expectedJournalEntries: [
      generateInterestOnCapitalAllowedEntry({
        id: "partnership-interest-on-capital-practice-entry",
        transactionText: "Interest on capital is allowed to Riya Rs.5,000 and Amit Rs.5,000.",
        partnerAmounts: [
          { partnerName: "Riya", amount: 5000 },
          { partnerName: "Amit", amount: 5000 },
        ],
      }),
    ],
    explanation:
      "Profit and Loss Appropriation is debited for total interest on capital. Partner Capital accounts are credited because partners receive the benefit.",
    beginnerHint: "Add both partners' interest and debit Profit and Loss Appropriation with the total.",
    commonMistakes: [
      "Debiting each partner's Capital Account.",
      "Using Interest on Capital A/c instead of Profit and Loss Appropriation A/c.",
    ],
  }),
  createQuestion({
    id: "partnership-interest-on-drawings-practice",
    topic: "partnership",
    title: "Interest on drawings charged",
    prompt: "Interest on drawings charged to Riya is Rs.2,000. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["partnership", "appropriation", "interest-on-drawings"],
    expectedJournalEntries: [
      generateInterestOnDrawingsChargedEntry({
        id: "partnership-interest-on-drawings-practice-entry",
        transactionText: "Interest on drawings charged to Riya is Rs.2,000.",
        partnerName: "Riya",
        amount: 2000,
      }),
    ],
    explanation:
      "Riya Capital is debited because the partner is charged. Interest on Drawings is credited because it is a gain for the firm.",
    beginnerHint: "Interest on drawings reduces the partner's capital/current account.",
    commonMistakes: [
      "Crediting Riya Capital instead of debiting it.",
      "Debiting Interest on Drawings.",
    ],
  }),
  createQuestion({
    id: "partnership-revaluation-loss-practice",
    topic: "partnership",
    title: "Revaluation loss on machinery",
    prompt: "Machinery value decreased by Rs.20,000 on admission of a partner. Pass the journal entry.",
    difficulty: "intermediate",
    tags: ["partnership", "admission", "revaluation"],
    expectedJournalEntries: [
      generateRevaluationLossOnAssetEntry({
        id: "partnership-revaluation-loss-practice-entry",
        transactionText: "Machinery value decreased by Rs.20,000 on admission of a partner.",
        assetAccountName: "Machinery A/c",
        amount: 20000,
      }),
    ],
    explanation:
      "Revaluation Account is debited because there is a loss. Machinery is credited because the asset value decreases.",
    beginnerHint: "A decrease in asset value is credited to the asset and debited to Revaluation.",
    commonMistakes: [
      "Debiting Machinery when its value decreases.",
      "Using Profit and Loss Appropriation instead of Revaluation.",
    ],
  }),
  createQuestion({
    id: "partnership-goodwill-compensation-practice",
    topic: "partnership",
    title: "Goodwill compensation",
    prompt: "New partner Neha compensates old partner Riya for goodwill Rs.15,000. Pass the journal entry.",
    difficulty: "intermediate",
    tags: ["partnership", "admission", "goodwill"],
    expectedJournalEntries: [
      generateGoodwillCompensationEntry({
        id: "partnership-goodwill-compensation-practice-entry",
        transactionText: "New partner Neha compensates old partner Riya for goodwill Rs.15,000.",
        gainingPartnerName: "Neha",
        sacrificingPartnerName: "Riya",
        amount: 15000,
      }),
    ],
    explanation:
      "Neha Capital is debited because Neha gives compensation. Riya Capital is credited because Riya receives the benefit.",
    beginnerHint: "Debit the gaining partner and credit the sacrificing partner for goodwill adjustment.",
    commonMistakes: [
      "Debiting Goodwill A/c even though this is a capital adjustment.",
      "Reversing the gaining and sacrificing partners.",
    ],
  }),
  createQuestion({
    id: "partnership-realisation-assets-transfer-practice",
    topic: "partnership",
    title: "Assets transferred to Realisation",
    prompt: "Assets of Rs.50,000 were transferred to Realisation Account on dissolution. Pass the journal entry.",
    difficulty: "intermediate",
    tags: ["partnership", "dissolution", "realisation"],
    expectedJournalEntries: [
      generateRealisationAssetTransferEntry({
        id: "partnership-realisation-assets-transfer-practice-entry",
        transactionText: "Assets of Rs.50,000 were transferred to Realisation Account on dissolution.",
        assetAccountName: "Assets A/c",
        amount: 50000,
      }),
    ],
    explanation:
      "Realisation Account is debited because assets are transferred to it. Assets Account is credited because the assets leave the books.",
    beginnerHint: "On dissolution, assets are closed by transferring them to Realisation Account.",
    commonMistakes: [
      "Debiting Assets instead of crediting them.",
      "Using Revaluation Account instead of Realisation Account.",
    ],
  }),
];

export function getAdvancedPracticeQuestionBank(): AdvancedPracticeQuestionBank {
  return {
    version: ADVANCED_PRACTICE_QUESTION_BANK_VERSION,
    questions: copyQuestions(advancedPracticeQuestions),
  };
}

export function getAllAdvancedPracticeQuestions(): AdvancedPracticeQuestion[] {
  return copyQuestions(advancedPracticeQuestions);
}

export function getAdvancedPracticeQuestionById(id: string): AdvancedPracticeQuestion | undefined {
  const question = advancedPracticeQuestions.find((advancedQuestion) => advancedQuestion.id === id);
  return question ? copyQuestion(question) : undefined;
}

export function getAdvancedPracticeQuestionsByTopic(topic: AdvancedPracticeTopic): AdvancedPracticeQuestion[] {
  return filterAdvancedPracticeQuestions({ topic });
}

export function filterAdvancedPracticeQuestions(filter: AdvancedPracticeQuestionFilter): AdvancedPracticeQuestion[] {
  const filteredQuestions = advancedPracticeQuestions.filter((question) => {
    const topicMatches = !filter.topic || filter.topic === "all" || question.topic === filter.topic;
    const tagsMatch = !filter.tags || filter.tags.every((tag) => question.tags.includes(tag));
    const difficultyMatches = !filter.difficulty || question.difficulty === filter.difficulty;

    return topicMatches && tagsMatch && difficultyMatches;
  });

  if (typeof filter.limit === "number") {
    if (filter.limit <= 0) return [];
    return copyQuestions(filteredQuestions.slice(0, filter.limit));
  }

  return copyQuestions(filteredQuestions);
}

export function getAdvancedPracticeQuestionIds(): string[] {
  return advancedPracticeQuestions.map((question) => question.id);
}

export function getNextAdvancedPracticeQuestion(
  currentQuestionId?: string,
  filter: AdvancedPracticeQuestionFilter = {},
): AdvancedPracticeQuestion | undefined {
  const questions = filterAdvancedPracticeQuestions(filter);

  if (questions.length === 0) return undefined;
  if (!currentQuestionId) return questions[0];

  const currentIndex = questions.findIndex((question) => question.id === currentQuestionId);
  if (currentIndex === -1) return questions[0];

  return questions[(currentIndex + 1) % questions.length];
}

function createQuestion(question: Omit<AdvancedPracticeQuestion, "source">): AdvancedPracticeQuestion {
  const copiedQuestion: AdvancedPracticeQuestion = {
    ...question,
    tags: [...question.tags],
    expectedJournalEntries: [...question.expectedJournalEntries],
    commonMistakes: [...question.commonMistakes],
    source: "advanced-practice-generator-v1",
  };

  if (question.whyThisEntry) {
    copiedQuestion.whyThisEntry = [...question.whyThisEntry];
  }

  if (question.finalAccountsImpact) {
    copiedQuestion.finalAccountsImpact = copyFinalAccountsImpact(question.finalAccountsImpact);
  }

  return copiedQuestion;
}

function copyQuestions(questions: AdvancedPracticeQuestion[]): AdvancedPracticeQuestion[] {
  return questions.map(copyQuestion);
}

function copyQuestion(question: AdvancedPracticeQuestion): AdvancedPracticeQuestion {
  const copiedQuestion: AdvancedPracticeQuestion = {
    ...question,
    tags: [...question.tags],
    expectedJournalEntries: question.expectedJournalEntries.map(copyJournalEntry),
    commonMistakes: [...question.commonMistakes],
  };

  if (question.whyThisEntry) {
    copiedQuestion.whyThisEntry = [...question.whyThisEntry];
  }

  if (question.finalAccountsImpact) {
    copiedQuestion.finalAccountsImpact = copyFinalAccountsImpact(question.finalAccountsImpact);
  }

  return copiedQuestion;
}

function copyFinalAccountsImpact(impact: AdvancedFinalAccountsImpact): AdvancedFinalAccountsImpact {
  return {
    ...impact,
    points: impact.points.map((point) => ({ ...point })),
  };
}

function copyJournalEntry(entry: JournalEntry): JournalEntry {
  return {
    ...entry,
    lines: entry.lines.map((line) => ({
      ...line,
      account: {
        ...line.account,
        ...(line.account.metadata ? { metadata: { ...line.account.metadata } } : {}),
      },
      ...(line.metadata ? { metadata: { ...line.metadata } } : {}),
    })),
    ...(entry.metadata ? { metadata: { ...entry.metadata } } : {}),
  };
}
