export const lessonProgressStorageKey = "accywise_lesson_progress_v1";

export const trackedLessonSlugs = [
  "introduction-to-accounting",
  "theory-base-of-accounting",
  "accounting-principles-and-concepts",
  "recording-of-transactions",
  "source-documents-and-vouchers",
  "rules-of-debit-and-credit",
  "journal-entry-basics",
  "ledger-posting-basics",
  "trial-balance-basics",
] as const;

export type TrackedLessonSlug = (typeof trackedLessonSlugs)[number];

export type LessonProgressItem = {
  lessonSlug: string;
  completed: boolean;
  completedAt?: string;
};

export type LessonProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  completionPercent: number;
  completedLessonSlugs: string[];
};

const emptyLessonProgressSummary: LessonProgressSummary = {
  totalLessons: trackedLessonSlugs.length,
  completedLessons: 0,
  completionPercent: 0,
  completedLessonSlugs: [],
};

export function getLessonProgress(): LessonProgressItem[] {
  if (typeof window === "undefined") return [];

  try {
    const rawProgress = window.localStorage.getItem(lessonProgressStorageKey);
    if (!rawProgress) return [];

    const parsedProgress = JSON.parse(rawProgress);
    if (!Array.isArray(parsedProgress)) return [];

    return parsedProgress.filter(isLessonProgressItem);
  } catch {
    return [];
  }
}

export function markLessonCompleted(lessonSlug: string): LessonProgressItem | null {
  if (typeof window === "undefined") return null;

  const nextItem: LessonProgressItem = {
    lessonSlug,
    completed: true,
    completedAt: new Date().toISOString(),
  };
  const nextProgress = [
    nextItem,
    ...getLessonProgress().filter((item) => item.lessonSlug !== lessonSlug),
  ];

  window.localStorage.setItem(lessonProgressStorageKey, JSON.stringify(nextProgress));
  return nextItem;
}

export function markLessonIncomplete(lessonSlug: string): LessonProgressItem | null {
  if (typeof window === "undefined") return null;

  const nextItem: LessonProgressItem = {
    lessonSlug,
    completed: false,
  };
  const nextProgress = [
    nextItem,
    ...getLessonProgress().filter((item) => item.lessonSlug !== lessonSlug),
  ];

  window.localStorage.setItem(lessonProgressStorageKey, JSON.stringify(nextProgress));
  return nextItem;
}

export function isLessonCompleted(lessonSlug: string): boolean {
  return getLessonProgress().some((item) => item.lessonSlug === lessonSlug && item.completed);
}

export function getLessonProgressSummary(items?: LessonProgressItem[]): LessonProgressSummary {
  if (!items && typeof window === "undefined") return emptyLessonProgressSummary;

  const progress = items ?? getLessonProgress();
  const completedLessonSlugs = trackedLessonSlugs.filter((lessonSlug) =>
    progress.some((item) => item.lessonSlug === lessonSlug && item.completed),
  );
  const completedLessons = completedLessonSlugs.length;

  return {
    totalLessons: trackedLessonSlugs.length,
    completedLessons,
    completionPercent: Math.round((completedLessons / trackedLessonSlugs.length) * 100),
    completedLessonSlugs,
  };
}

function isLessonProgressItem(value: unknown): value is LessonProgressItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<LessonProgressItem>;
  return typeof item.lessonSlug === "string" && typeof item.completed === "boolean";
}
