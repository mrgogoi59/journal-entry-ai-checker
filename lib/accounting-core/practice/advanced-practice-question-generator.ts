import {
  generateCallsInAdvanceReceivedEntry,
  generateCallsInArrearsReceiptEntry,
  generateDebentureIssueAtDiscountEntry,
  generateShareFirstCallDueEntry,
  generateShareForfeitureEntry,
  generateShareIssueAtPremiumEntry,
} from "../generators/company-journal-generator";
import {
  generateGoodwillCompensationEntry,
  generateInterestOnCapitalAllowedEntry,
  generateInterestOnDrawingsChargedEntry,
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
  beginnerHint: string;
  commonMistakes: string[];
  source: "advanced-practice-generator-v1";
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
    id: "company-calls-in-advance-practice",
    topic: "company_accounts",
    title: "Calls in advance received",
    prompt: "A shareholder paid future call money of Rs.2,000 in advance. Pass the journal entry.",
    difficulty: "beginner",
    tags: ["company", "calls-in-advance"],
    expectedJournalEntries: [
      generateCallsInAdvanceReceivedEntry({
        id: "company-calls-in-advance-practice-entry",
        transactionText: "A shareholder paid future call money of Rs.2,000 in advance.",
        amount: 2000,
      }),
    ],
    explanation:
      "Bank is debited because money is received. Calls in Advance is credited because money received before it is due is a liability.",
    beginnerHint: "Advance call money is not share capital yet; treat it as a liability.",
    commonMistakes: [
      "Crediting Share Capital immediately.",
      "Treating Calls in Advance as an expense.",
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
  return {
    ...question,
    tags: [...question.tags],
    expectedJournalEntries: [...question.expectedJournalEntries],
    commonMistakes: [...question.commonMistakes],
    source: "advanced-practice-generator-v1",
  };
}

function copyQuestions(questions: AdvancedPracticeQuestion[]): AdvancedPracticeQuestion[] {
  return questions.map(copyQuestion);
}

function copyQuestion(question: AdvancedPracticeQuestion): AdvancedPracticeQuestion {
  return {
    ...question,
    tags: [...question.tags],
    expectedJournalEntries: question.expectedJournalEntries.map(copyJournalEntry),
    commonMistakes: [...question.commonMistakes],
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
