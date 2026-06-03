import { describe, expect, it } from "vitest";
import { getResultStatus, scoreEntry } from "@/lib/scoring-engine";
import type { ValidationResult } from "@/lib/types";

function validation(overrides: Partial<ValidationResult>): ValidationResult {
  return {
    correctAccounts: false,
    correctSides: false,
    correctAmount: false,
    isBalanced: false,
    mistake_type: "wrong_account",
    ...overrides,
  };
}

describe("scoreEntry", () => {
  it.each([
    [validation({ correctAccounts: true, correctSides: true, correctAmount: true, isBalanced: true }), 100],
    [validation({ correctAccounts: true, correctSides: false, correctAmount: true, isBalanced: true }), 70],
    [validation({ correctAccounts: true, correctSides: true, correctAmount: false, isBalanced: true }), 80],
    [validation({ correctAccounts: true, correctSides: true, correctAmount: true, isBalanced: false }), 90],
    [validation({ correctAccounts: false, correctSides: false, correctAmount: true, isBalanced: true }), 30],
    [validation({ correctAccounts: false, correctSides: false, correctAmount: false, isBalanced: false }), 0],
  ])("scores validation %# as %i", (input, expectedScore) => {
    expect(scoreEntry(input)).toBe(expectedScore);
  });
});

describe("getResultStatus", () => {
  it.each([
    [100, "correct", "Correct"],
    [70, "reversed_sides", "Partly Correct"],
    [30, "wrong_account", "Incorrect"],
    [0, "format_error", "Invalid Format"],
    [0, "unsupported_transaction", "Unsupported Transaction"],
  ] as const)("returns %s for score %i and mistake %s", (score, mistakeType, expectedStatus) => {
    expect(getResultStatus(score, mistakeType)).toBe(expectedStatus);
  });
});
