export type ChapterAvailabilityStatus = "available" | "planned" | "later";
export type ChapterLevel = "foundation" | "intermediate" | "advanced";
export type OutlineItemStatus = "current" | "available" | "upcoming" | "later";
export type AccountingEntrySide = "debit" | "credit";
export type PracticeQuestionStatus = "preview-only" | "checking-ready";
export type PracticeAttemptStatus = "draft" | "submitted" | "checked";

export type ChapterMetadata = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: ChapterLevel;
  levelLabel: string;
  availabilityStatus: ChapterAvailabilityStatus;
  estimatedStudyTime?: string;
  currentPreviewSectionId: string;
  progressPreview?: {
    label: string;
    value: number;
  };
};

export type OutlineItem = {
  id: string;
  title: string;
  order: number;
  status: OutlineItemStatus;
  shortDescription?: string;
  href?: string;
};

export type AccountingEntryLine = {
  id: string;
  account: string;
  side: AccountingEntrySide;
  amount: number;
  displayPrefix?: "To";
  drNotation?: "Dr.";
  lf?: string;
  referenceNote?: string;
};

export type AccountingFormatPreviewLine = {
  id: string;
  particulars: string;
  lf?: string;
  debitDisplay?: string;
  creditDisplay?: string;
};

export type ReasoningStep = {
  label: string;
  detail: string;
};

export type SolvedIllustration = {
  id: string;
  title: string;
  difficulty: "easy" | "slightly-harder" | "mixed";
  question: string;
  accountsAffected: string[];
  reasoningSteps: ReasoningStep[];
  journalEntry: AccountingEntryLine[];
  narration: string;
  explanation: string;
  studentTakeaway: string;
  commonMistake: string;
};

export type JournalEntryInputFieldRequirement =
  | "date"
  | "particulars"
  | "side"
  | "drNotation"
  | "toTreatment"
  | "lf"
  | "debitAmount"
  | "creditAmount"
  | "narration";

export type JournalEntryInputRowSchema = {
  rowOrder: number;
  requiredFields: JournalEntryInputFieldRequirement[];
  particularsPlaceholder: string;
};

export type JournalEntryAnswerInputSchema = {
  responseType: "journal-entry";
  rows: JournalEntryInputRowSchema[];
  narration: {
    required: boolean;
    placeholder: string;
  };
  totals: {
    debitTotal: "student-entered" | "future-calculated";
    creditTotal: "student-entered" | "future-calculated";
  };
  optionalExtraRows: boolean;
  removableRows: boolean;
  attemptStatus?: PracticeAttemptStatus;
};

export type JournalEntryStudentAnswerRow = {
  rowOrder: number;
  particulars: string;
  side: AccountingEntrySide | "";
  drNotation?: "Dr." | "";
  toTreatment?: "To" | "";
  lf?: string;
  debitAmount?: number | null;
  creditAmount?: number | null;
};

export type JournalEntryStudentAnswer = {
  rows: JournalEntryStudentAnswerRow[];
  narration: string;
  debitTotal?: number;
  creditTotal?: number;
  extraRows?: JournalEntryStudentAnswerRow[];
  removedRowOrders?: number[];
  attemptStatus?: PracticeAttemptStatus;
};

export type JournalEntryExpectedAnswer = {
  responseType: "journal-entry";
  lines: AccountingEntryLine[];
  narration: string;
  totals: {
    debit: number;
    credit: number;
  };
  balanced: boolean;
};

export type PracticeItYourselfQuestion = {
  id: string;
  title: string;
  question: string;
  difficulty: "easy" | "slightly-harder" | "mixed";
  learningObjective: string;
  requiredAnswerFormat: "journal-entry";
  initialBlankRows: number;
  narrationRequired: boolean;
  mayAddRows: boolean;
  mayRemoveRows: boolean;
  inputFieldRequirements: JournalEntryInputFieldRequirement[];
  answerInputSchema: JournalEntryAnswerInputSchema;
  status: PracticeQuestionStatus;
};

export type PracticeItYourselfPreviewQuestion = PracticeItYourselfQuestion;

export type LearningObjectiveSection = {
  type: "learning-objective";
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type ConceptExplanationSection = {
  type: "concept-explanation";
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type ComparisonSection = {
  type: "comparison";
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  groups: {
    title: string;
    items: string[];
  }[];
};

export type ProcessStepsSection = {
  type: "process-steps";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  steps: ReasoningStep[];
};

export type ClueGuideSection = {
  type: "clue-guide";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  clues: {
    clue: string;
    likelyAccounts: string[];
    note?: string;
  }[];
};

export type ClassificationCategorySection = {
  type: "classification-categories";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  categories: {
    title: string;
    description: string;
    examples: string[];
    note?: string;
    subcategories?: {
      title: string;
      examples: string[];
      note?: string;
    }[];
  }[];
};

export type ClassificationGuideSection = {
  type: "classification-guide";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  rows: {
    account: string;
    modernClassification: string;
    traditionalClassification: string;
    note?: string;
  }[];
};

export type ClassificationExamplesSection = {
  type: "classification-examples";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  examples: {
    title: string;
    question: string;
    accounts: {
      account: string;
      modernClassification: string;
      traditionalClassification: string;
      note?: string;
    }[];
    explanation: string;
  }[];
};

export type DebitCreditRuleGuideSection = {
  type: "debit-credit-rule-guide";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  rules: {
    title: string;
    rule?: string;
    increaseTreatment?: string;
    decreaseTreatment?: string;
    examples?: string[];
    note?: string;
  }[];
};

export type JournalColumnGuideSection = {
  type: "journal-column-guide";
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  columns: {
    title: string;
    purpose: string;
    guidance: string[];
  }[];
};

export type AccountingFormatSection = {
  type: "accounting-format";
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  formatRows: AccountingFormatPreviewLine[];
};

export type SimpleExampleSection = {
  type: "simple-example";
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  reasoningSteps: ReasoningStep[];
  journalEntry: AccountingEntryLine[];
};

export type SolvedIllustrationSection = {
  type: "solved-illustration";
  id: string;
  illustration: SolvedIllustration;
};

export type PracticeItYourselfSection = {
  type: "practice-it-yourself";
  id: string;
  question: PracticeItYourselfQuestion;
};

export type CommonMistakesSection = {
  type: "common-mistakes";
  id: string;
  eyebrow: string;
  title: string;
  mistakes: string[];
};

export type TryBeforeRevealSection = {
  type: "try-before-reveal";
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  prompts: {
    id: string;
    prompt: string;
    journalEntry: AccountingEntryLine[];
    narration: string;
    reasoning: string;
  }[];
};

export type RecapSection = {
  type: "recap";
  id: string;
  title: string;
  points: string[];
};

export type ReflectionPromptSection = {
  type: "reflection-prompt";
  id: string;
  eyebrow: string;
  prompt: string;
  body?: string;
};

export type ChapterSection =
  | LearningObjectiveSection
  | ConceptExplanationSection
  | ComparisonSection
  | ProcessStepsSection
  | ClueGuideSection
  | ClassificationCategorySection
  | ClassificationGuideSection
  | ClassificationExamplesSection
  | DebitCreditRuleGuideSection
  | JournalColumnGuideSection
  | AccountingFormatSection
  | SimpleExampleSection
  | SolvedIllustrationSection
  | PracticeItYourselfSection
  | CommonMistakesSection
  | TryBeforeRevealSection
  | RecapSection
  | ReflectionPromptSection;

export type ChapterSubtopicAvailabilityStatus = Exclude<OutlineItemStatus, "current">;

export type ChapterSubtopicReference = {
  id: string;
  slug: string;
  title: string;
  order: number;
  availabilityStatus: ChapterSubtopicAvailabilityStatus;
  href?: string;
};

export type ChapterSubtopicDefinition = {
  id: string;
  slug: string;
  title: string;
  order: number;
  shortDescription: string;
  learningObjective: string;
  availabilityStatus: ChapterSubtopicAvailabilityStatus;
  href: string;
  progressLabel: string;
  previousSection?: ChapterSubtopicReference;
  nextSection?: ChapterSubtopicReference;
  practiceQuestionIds?: string[];
  sections: ChapterSection[];
};

export type ChapterDefinition = {
  metadata: ChapterMetadata;
  outline: OutlineItem[];
  subtopics: ChapterSubtopicDefinition[];
  sections: ChapterSection[];
};
