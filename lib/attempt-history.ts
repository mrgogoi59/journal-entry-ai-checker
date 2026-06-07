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

export function mapCheckResultStatus(status: ResultStatus): AttemptHistoryResultStatus {
  if (status === "Correct") return "correct";
  if (status === "Invalid Format") return "invalid";
  if (status === "Unsupported Transaction") return "unsupported";
  return "incorrect";
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
