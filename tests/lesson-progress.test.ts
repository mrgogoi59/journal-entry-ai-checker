import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLessonProgress,
  getLessonProgressSummary,
  isLessonCompleted,
  lessonProgressStorageKey,
  markLessonCompleted,
  markLessonIncomplete,
} from "@/lib/lesson-progress";

function installLocalStorageMock() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };

  vi.stubGlobal("window", { localStorage });
  return { localStorage };
}

describe("lesson progress helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty progress when window is unavailable", () => {
    expect(getLessonProgress()).toEqual([]);
    expect(getLessonProgressSummary()).toEqual({
      totalLessons: 7,
      completedLessons: 0,
      completionPercent: 0,
      completedLessonSlugs: [],
    });
  });

  it("marks a lesson completed and stores it", () => {
    const { localStorage } = installLocalStorageMock();

    const item = markLessonCompleted("rules-of-debit-and-credit");

    expect(item).toEqual(
      expect.objectContaining({
        lessonSlug: "rules-of-debit-and-credit",
        completed: true,
      }),
    );
    expect(isLessonCompleted("rules-of-debit-and-credit")).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      lessonProgressStorageKey,
      expect.stringContaining("rules-of-debit-and-credit"),
    );
  });

  it("marks a lesson incomplete and clears completed status", () => {
    installLocalStorageMock();
    markLessonCompleted("rules-of-debit-and-credit");

    const item = markLessonIncomplete("rules-of-debit-and-credit");

    expect(item).toEqual({
      lessonSlug: "rules-of-debit-and-credit",
      completed: false,
    });
    expect(isLessonCompleted("rules-of-debit-and-credit")).toBe(false);
  });

  it("returns correct summary percentage for one of seven completed", () => {
    expect(
      getLessonProgressSummary([
        {
          lessonSlug: "introduction-to-accounting",
          completed: true,
          completedAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
    ).toEqual({
      totalLessons: 7,
      completedLessons: 1,
      completionPercent: 14,
      completedLessonSlugs: ["introduction-to-accounting"],
    });
  });

  it("does not crash write helpers when window is unavailable", () => {
    expect(markLessonCompleted("rules-of-debit-and-credit")).toBeNull();
    expect(markLessonIncomplete("rules-of-debit-and-credit")).toBeNull();
    expect(isLessonCompleted("rules-of-debit-and-credit")).toBe(false);
  });
});
