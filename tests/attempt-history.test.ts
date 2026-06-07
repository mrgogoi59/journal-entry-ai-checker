import { describe, expect, it } from "vitest";
import {
  attemptHistoryLimit,
  createAttemptHistoryItem,
  getAttemptHistory,
  getAttemptHistorySummary,
  mapCheckResultStatus,
  trimAttemptHistory,
  type AttemptHistoryItem,
} from "@/lib/attempt-history";

function makeAttempt(index: number, resultStatus: AttemptHistoryItem["resultStatus"] = "incorrect"): AttemptHistoryItem {
  return createAttemptHistoryItem({
    id: `attempt-${index}`,
    module: index % 2 === 0 ? "practice" : "checker",
    transaction: `Transaction ${index}`,
    resultStatus,
    score: index,
    createdAt: `2026-01-01T00:00:${String(index).padStart(2, "0")}.000Z`,
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
});
