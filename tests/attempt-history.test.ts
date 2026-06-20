import { describe, expect, it } from "vitest";
import {
  attemptHistoryLimit,
  createAttemptHistoryItem,
  getDashboardSummary,
  getAttemptHistory,
  getAttemptHistorySummary,
  getWeakAreaSummary,
  mapCheckResultStatus,
  trimAttemptHistory,
  type AttemptHistoryItem,
} from "@/lib/attempt-history";

function makeAttempt(
  index: number,
  resultStatus: AttemptHistoryItem["resultStatus"] = "incorrect",
  overrides: Partial<AttemptHistoryItem> = {},
): AttemptHistoryItem {
  return createAttemptHistoryItem({
    id: `attempt-${index}`,
    module: index % 2 === 0 ? "practice" : "checker",
    transaction: `Transaction ${index}`,
    resultStatus,
    score: index,
    createdAt: `2026-01-01T00:00:${String(index).padStart(2, "0")}.000Z`,
    ...overrides,
  });
}

describe("attempt history helpers", () => {
  it("returns an empty history outside the browser", () => {
    expect(getAttemptHistory()).toEqual([]);
  });

  it("keeps only the latest 30 attempts", () => {
    const attempts = Array.from({ length: attemptHistoryLimit + 5 }, (_, index) => makeAttempt(index));

    expect(trimAttemptHistory(attempts)).toHaveLength(attemptHistoryLimit);
    expect(trimAttemptHistory(attempts)[0]?.id).toBe("attempt-0");
    expect(trimAttemptHistory(attempts).at(-1)?.id).toBe(`attempt-${attemptHistoryLimit - 1}`);
  });

  it("summarizes totals, correct attempts, needs correction, and average score", () => {
    const attempts: AttemptHistoryItem[] = [
      makeAttempt(100, "correct"),
      makeAttempt(50, "incorrect"),
      makeAttempt(75, "invalid"),
      makeAttempt(25, "solved"),
    ];

    expect(getAttemptHistorySummary(attempts)).toEqual({
      totalAttempts: 4,
      correctAttempts: 2,
      needsCorrection: 2,
      averageScore: 63,
    });
  });

  it("maps checker result statuses to history statuses", () => {
    expect(mapCheckResultStatus("Correct")).toBe("correct");
    expect(mapCheckResultStatus("Incorrect")).toBe("incorrect");
    expect(mapCheckResultStatus("Partly Correct")).toBe("incorrect");
    expect(mapCheckResultStatus("Invalid Format")).toBe("invalid");
    expect(mapCheckResultStatus("Unsupported Transaction")).toBe("unsupported");
  });

  it("returns an empty weak area summary for no attempts", () => {
    expect(getWeakAreaSummary([])).toEqual({
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      averageScore: 0,
      weakAreas: [],
      mistakePatterns: [],
    });
  });

  it("calculates weak area summary average score from scored attempts", () => {
    const summary = getWeakAreaSummary([
      makeAttempt(1, "correct", { score: 100 }),
      makeAttempt(2, "incorrect", { score: 50 }),
      makeAttempt(3, "incorrect", { score: 60 }),
    ]);

    expect(summary.totalAttempts).toBe(3);
    expect(summary.correctAttempts).toBe(1);
    expect(summary.incorrectAttempts).toBe(2);
    expect(summary.averageScore).toBe(70);
  });

  it("shows GST as a weak area for low GST attempts", () => {
    const summary = getWeakAreaSummary([
      makeAttempt(1, "correct", { topic: "gst", score: 60 }),
      makeAttempt(2, "incorrect", { topic: "gst", score: 50, mistakeType: "wrong_account" }),
    ]);

    expect(summary.weakAreas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "GST",
          attempts: 2,
          averageScore: 55,
          issueCount: 2,
          recommendation: "Practice GST questions next.",
          practiceTopic: "gst",
        }),
      ]),
    );
  });

  it("does not create weak areas for correct high-score attempts", () => {
    const summary = getWeakAreaSummary([
      makeAttempt(1, "correct", { topic: "gst", score: 100 }),
      makeAttempt(2, "correct", { topic: "gst", score: 90 }),
      makeAttempt(3, "correct", { topic: "assets", score: 95 }),
    ]);

    expect(summary.weakAreas).toEqual([]);
  });

  it("counts recent mistake patterns", () => {
    const summary = getWeakAreaSummary([
      makeAttempt(1, "incorrect", { mistakeType: "wrong_account" }),
      makeAttempt(2, "incorrect", { mistakeType: "wrong_account" }),
      makeAttempt(3, "invalid", { mistakeType: "format_error" }),
    ]);

    expect(summary.mistakePatterns).toEqual([
      { label: "Wrong account", count: 2 },
      { label: "Format", count: 1 },
    ]);
  });

  it("uses only the latest stored attempts for weak area summary", () => {
    const latestHighScoreAttempts = Array.from({ length: attemptHistoryLimit }, (_, index) =>
      makeAttempt(index, "correct", { topic: "basics", score: 100 }),
    );
    const oldWeakAttempt = makeAttempt(attemptHistoryLimit + 1, "incorrect", {
      topic: "gst",
      score: 0,
      mistakeType: "wrong_account",
    });

    const summary = getWeakAreaSummary([...latestHighScoreAttempts, oldWeakAttempt]);

    expect(summary.totalAttempts).toBe(attemptHistoryLimit);
    expect(summary.weakAreas).toEqual([]);
  });

  it("returns an empty dashboard summary for no attempts", () => {
    expect(getDashboardSummary([])).toEqual({
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      averageScore: 0,
      weakAreas: [],
      mistakePatterns: [],
      recentAttempts: [],
      recommendation: {
        title: "Start with Basics",
        description: "Begin with simple capital, cash, purchases, and sales entries.",
        ctaLabel: "Start Practice",
        href: "/practice/journal-entries",
      },
    });
  });

  it("builds dashboard summary counts from attempts", () => {
    const summary = getDashboardSummary([
      makeAttempt(1, "correct", { score: 100 }),
      makeAttempt(2, "incorrect", { score: 40 }),
      makeAttempt(3, "invalid", { score: 0 }),
    ]);

    expect(summary.totalAttempts).toBe(3);
    expect(summary.correctAttempts).toBe(1);
    expect(summary.incorrectAttempts).toBe(2);
    expect(summary.averageScore).toBe(47);
  });

  it("reuses weak areas in dashboard summary", () => {
    const summary = getDashboardSummary([
      makeAttempt(1, "incorrect", { topic: "gst", score: 50, mistakeType: "wrong_account" }),
    ]);

    expect(summary.weakAreas[0]).toEqual(
      expect.objectContaining({
        label: "GST",
        recommendation: "Practice GST questions next.",
      }),
    );
    expect(summary.recommendation.title).toBe("Practice GST");
  });

  it("returns the latest five recent attempts for dashboard", () => {
    const attempts = Array.from({ length: 8 }, (_, index) => makeAttempt(index, "correct"));

    expect(getDashboardSummary(attempts).recentAttempts).toHaveLength(5);
    expect(getDashboardSummary(attempts).recentAttempts.map((attempt) => attempt.id)).toEqual([
      "attempt-0",
      "attempt-1",
      "attempt-2",
      "attempt-3",
      "attempt-4",
    ]);
  });
});
