import type { ResultStatus } from "@/lib/types";

export const attemptHistoryStorageKey = "accywise_attempt_history_v1";
export const attemptHistoryLimit = 30;

export type AttemptHistoryModule = "checker" | "practice" | "explainer";
export type AttemptHistoryResultStatus =
  | "correct"
  | "incorrect"
  | "invalid"
  | "unsupported"
  | "ambiguous"
  | "solved";

export type AttemptHistoryItem = {
  id: string;
  module: AttemptHistoryModule;
  topic?: string;
  transaction: string;
  studentEntry?: string;
  resultStatus: AttemptHistoryResultStatus;
  score?: number;
  mistakeType?: string;
  correctEntry?: string;
  explanation?: string;
  createdAt: string;
};

export type AttemptHistoryInput = Omit<AttemptHistoryItem, "id" | "createdAt"> &
  Partial<Pick<AttemptHistoryItem, "id" | "createdAt">>;

export type AttemptHistorySummary = {
  totalAttempts: number;
  correctAttempts: number;
  needsCorrection: number;
  averageScore: number | null;
};

export type WeakAreaSummary = {
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageScore: number;
  weakAreas: {
    id: string;
    label: string;
    attempts: number;
    averageScore: number;
    issueCount: number;
    recommendation: string;
    practiceTopic?: string;
  }[];
  mistakePatterns: {
    label: string;
    count: number;
  }[];
};

const emptyWeakAreaSummary: WeakAreaSummary = {
  totalAttempts: 0,
  correctAttempts: 0,
  incorrectAttempts: 0,
  averageScore: 0,
  weakAreas: [],
  mistakePatterns: [],
};

const topicLabels: Record<string, string> = {
  basics: "Basic Journal Entries",
  purchases_sales: "Purchases and Sales",
  expenses_incomes: "Basic Journal Entries",
  debtors_creditors: "Debtors and Creditors",
  adjustments: "Adjustments",
  assets: "Assets",
  goods_adjustments: "Goods Adjustments",
  returns_discounts: "Returns and Discounts",
  gst: "GST",
  mixed: "Basic Journal Entries",
};

const recommendationByArea: Record<string, { recommendation: string; practiceTopic?: string }> = {
  GST: { recommendation: "Practice GST questions next.", practiceTopic: "gst" },
  Assets: { recommendation: "Practice Assets questions next.", practiceTopic: "assets" },
  Adjustments: { recommendation: "Practice Adjustments questions next.", practiceTopic: "adjustments" },
  "Debtors and Creditors": {
    recommendation: "Practice Debtors and Creditors questions next.",
    practiceTopic: "debtors_creditors",
  },
  "Purchases and Sales": {
    recommendation: "Practice Purchases and Sales questions next.",
    practiceTopic: "purchases_sales",
  },
  "Goods Adjustments": {
    recommendation: "Practice Goods Adjustments questions next.",
    practiceTopic: "goods_adjustments",
  },
  "Returns and Discounts": {
    recommendation: "Practice Returns and Discounts questions next.",
    practiceTopic: "returns_discounts",
  },
  Format: { recommendation: "Start with Basics and write one account per line.", practiceTopic: "basics" },
  "Debit/Credit Side": { recommendation: "Start with Basics and revise debit-credit rules.", practiceTopic: "basics" },
  "Basic Journal Entries": { recommendation: "Start with Basics to strengthen core entries.", practiceTopic: "basics" },
  "Final Accounts": { recommendation: "Review Final Accounts examples and then practice basics.", practiceTopic: "basics" },
  "Ledger Posting": { recommendation: "Review Ledger Posting and then practice account sides.", practiceTopic: "basics" },
  "Trial Balance": { recommendation: "Review Trial Balance and then practice balanced entries.", practiceTopic: "basics" },
};

export function getAttemptHistory(): AttemptHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const rawHistory = window.localStorage.getItem(attemptHistoryStorageKey);
    if (!rawHistory) return [];

    const parsedHistory = JSON.parse(rawHistory);
    if (!Array.isArray(parsedHistory)) return [];

    return trimAttemptHistory(parsedHistory.filter(isAttemptHistoryItem));
  } catch {
    return [];
  }
}

export function saveAttemptHistoryItem(input: AttemptHistoryInput): AttemptHistoryItem | null {
  if (typeof window === "undefined") return null;

  const item = createAttemptHistoryItem(input);
  const nextHistory = trimAttemptHistory([item, ...getAttemptHistory()]);

  try {
    window.localStorage.setItem(attemptHistoryStorageKey, JSON.stringify(nextHistory));
    return item;
  } catch {
    return null;
  }
}

export function clearAttemptHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(attemptHistoryStorageKey);
}

export function createAttemptHistoryItem(input: AttemptHistoryInput): AttemptHistoryItem {
  return {
    ...input,
    id: input.id ?? createAttemptId(),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function trimAttemptHistory(items: AttemptHistoryItem[]): AttemptHistoryItem[] {
  return items.slice(0, attemptHistoryLimit);
}

export function getAttemptHistorySummary(items: AttemptHistoryItem[]): AttemptHistorySummary {
  const totalAttempts = items.length;
  const correctAttempts = items.filter((item) => item.resultStatus === "correct" || item.resultStatus === "solved").length;
  const needsCorrection = items.filter(
    (item) => !["correct", "solved"].includes(item.resultStatus),
  ).length;
  const scoredItems = items.filter((item) => typeof item.score === "number");
  const averageScore =
    scoredItems.length > 0
      ? Math.round(scoredItems.reduce((total, item) => total + (item.score ?? 0), 0) / scoredItems.length)
      : null;

  return {
    totalAttempts,
    correctAttempts,
    needsCorrection,
    averageScore,
  };
}

export function getWeakAreaSummary(items?: AttemptHistoryItem[]): WeakAreaSummary {
  if (!items && typeof window === "undefined") return emptyWeakAreaSummary;

  const attempts = trimAttemptHistory(items ?? getAttemptHistory());
  if (attempts.length === 0) return emptyWeakAreaSummary;

  const historySummary = getAttemptHistorySummary(attempts);
  const areaMap = new Map<string, { label: string; attempts: AttemptHistoryItem[]; issueCount: number }>();
  const mistakeMap = new Map<string, number>();

  for (const attempt of attempts) {
    const area = inferWeakArea(attempt);
    const hasIssue = isIssueAttempt(attempt);
    const currentArea = areaMap.get(area.id) ?? { label: area.label, attempts: [], issueCount: 0 };

    currentArea.attempts.push(attempt);
    if (hasIssue) currentArea.issueCount += 1;
    areaMap.set(area.id, currentArea);

    if (attempt.mistakeType && attempt.mistakeType !== "correct") {
      const mistakeLabel = formatMistakePattern(attempt.mistakeType);
      mistakeMap.set(mistakeLabel, (mistakeMap.get(mistakeLabel) ?? 0) + 1);
    }
  }

  const weakAreas = Array.from(areaMap.entries())
    .map(([id, area]) => {
      const averageScore = getAverageScore(area.attempts);
      const recommendation = recommendationByArea[area.label] ?? recommendationByArea["Basic Journal Entries"];

      return {
        id,
        label: area.label,
        attempts: area.attempts.length,
        averageScore,
        issueCount: area.issueCount,
        recommendation: recommendation.recommendation,
        practiceTopic: recommendation.practiceTopic,
      };
    })
    .filter((area) => (area.attempts >= 2 && area.averageScore < 70) || area.issueCount >= 1)
    .sort((first, second) => second.issueCount - first.issueCount || first.averageScore - second.averageScore);

  const mistakePatterns = Array.from(mistakeMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label));

  return {
    totalAttempts: historySummary.totalAttempts,
    correctAttempts: historySummary.correctAttempts,
    incorrectAttempts: historySummary.needsCorrection,
    averageScore: historySummary.averageScore ?? 0,
    weakAreas,
    mistakePatterns,
  };
}

export function mapCheckResultStatus(status: ResultStatus): AttemptHistoryResultStatus {
  if (status === "Correct") return "correct";
  if (status === "Invalid Format") return "invalid";
  if (status === "Unsupported Transaction") return "unsupported";
  return "incorrect";
}

function inferWeakArea(attempt: AttemptHistoryItem): { id: string; label: string } {
  const topicLabel = attempt.topic ? topicLabels[attempt.topic] : undefined;
  const label = topicLabel ?? inferLabelFromMistake(attempt.mistakeType) ?? inferLabelFromTransaction(attempt.transaction);

  return {
    id: label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, ""),
    label,
  };
}

function inferLabelFromMistake(mistakeType?: string): string | undefined {
  if (!mistakeType) return undefined;
  if (mistakeType === "format_error") return "Format";
  if (mistakeType === "reversed_sides") return "Debit/Credit Side";
  if (mistakeType === "unbalanced_entry") return "Debit/Credit Side";
  if (mistakeType === "wrong_account" || mistakeType === "missing_account" || mistakeType === "amount_mismatch") {
    return "Basic Journal Entries";
  }
  return undefined;
}

function inferLabelFromTransaction(transaction: string): string {
  const normalized = transaction.toLowerCase();

  if (normalized.includes("gst") || normalized.includes("cgst") || normalized.includes("sgst") || normalized.includes("igst")) {
    return "GST";
  }
  if (normalized.includes("asset") || normalized.includes("machinery") || normalized.includes("furniture")) return "Assets";
  if (normalized.includes("outstanding") || normalized.includes("prepaid") || normalized.includes("accrued")) return "Adjustments";
  if (normalized.includes("debtor") || normalized.includes("creditor")) return "Debtors and Creditors";
  if (normalized.includes("purchase") || normalized.includes("purchased") || normalized.includes("sale") || normalized.includes("sold")) {
    return "Purchases and Sales";
  }
  if (normalized.includes("withdrawn") || normalized.includes("sample") || normalized.includes("charity") || normalized.includes("lost")) {
    return "Goods Adjustments";
  }
  if (normalized.includes("return")) return "Returns and Discounts";
  if (normalized.includes("ledger")) return "Ledger Posting";
  if (normalized.includes("trial balance")) return "Trial Balance";
  if (normalized.includes("final account") || normalized.includes("balance sheet")) return "Final Accounts";
  return "Basic Journal Entries";
}

function isIssueAttempt(attempt: AttemptHistoryItem): boolean {
  if (!["correct", "solved"].includes(attempt.resultStatus)) return true;
  return typeof attempt.score === "number" && attempt.score < 70;
}

function getAverageScore(attempts: AttemptHistoryItem[]): number {
  const scoredAttempts = attempts.filter((attempt) => typeof attempt.score === "number");
  if (scoredAttempts.length === 0) return 0;
  return Math.round(scoredAttempts.reduce((total, attempt) => total + (attempt.score ?? 0), 0) / scoredAttempts.length);
}

function formatMistakePattern(mistakeType: string): string {
  const labels: Record<string, string> = {
    wrong_account: "Wrong account",
    reversed_sides: "Debit/Credit side",
    amount_mismatch: "Amount mismatch",
    missing_account: "Missing account",
    unbalanced_entry: "Unbalanced entry",
    format_error: "Format",
    unsupported_transaction: "Unsupported transaction",
  };

  return labels[mistakeType] ?? mistakeType;
}

function createAttemptId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isAttemptHistoryItem(value: unknown): value is AttemptHistoryItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<AttemptHistoryItem>;
  return (
    typeof item.id === "string" &&
    typeof item.module === "string" &&
    typeof item.transaction === "string" &&
    typeof item.resultStatus === "string" &&
    typeof item.createdAt === "string"
  );
}
