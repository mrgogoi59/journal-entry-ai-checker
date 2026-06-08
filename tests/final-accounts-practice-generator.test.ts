import { describe, expect, it } from "vitest";
import {
  checkFinalAccountsPracticeAnswer,
  generateFinalAccountsPracticeCase,
  getFinalAccountsPracticeCases,
  parseFinalAccountsPracticeAmount,
} from "@/lib/final-accounts-practice-generator";
import { generateFinalAccounts } from "@/lib/final-accounts-engine";

describe("final accounts practice generator", () => {
  it("returns a valid case", () => {
    const practiceCase = generateFinalAccountsPracticeCase();

    expect(practiceCase.id).toBeTruthy();
    expect(practiceCase.title).toBeTruthy();
    expect(practiceCase.trialBalance).toContain("A/c");
    expect(practiceCase.expectedAssetTotal).toBeGreaterThan(0);
    expect(practiceCase.expectedLiabilityTotal).toBeGreaterThan(0);
    expect(practiceCase.explanation.length).toBeGreaterThan(0);
  });

  it("includes at least 8 cases", () => {
    expect(getFinalAccountsPracticeCases()).toHaveLength(8);
  });

  it("processes every case with the existing final accounts engine", () => {
    for (const practiceCase of getFinalAccountsPracticeCases()) {
      const result = generateFinalAccounts(practiceCase.trialBalance, practiceCase.adjustments);
      expect(result.status).toBe("success");
    }
  });

  it("matches gross result from the existing final accounts engine", () => {
    for (const practiceCase of getFinalAccountsPracticeCases()) {
      const result = generateFinalAccounts(practiceCase.trialBalance, practiceCase.adjustments);
      expect(result.status).toBe("success");
      const expectedType =
        result.tradingAccount.grossProfit > 0
          ? "gross_profit"
          : result.tradingAccount.grossLoss > 0
            ? "gross_loss"
            : "none";

      expect(practiceCase.expectedGrossResultType).toBe(expectedType);
      expect(practiceCase.expectedGrossResultAmount).toBe(
        result.tradingAccount.grossProfit || result.tradingAccount.grossLoss,
      );
    }
  });

  it("matches net result from the existing final accounts engine", () => {
    for (const practiceCase of getFinalAccountsPracticeCases()) {
      const result = generateFinalAccounts(practiceCase.trialBalance, practiceCase.adjustments);
      expect(result.status).toBe("success");
      const expectedType =
        result.profitAndLossAccount.netProfit > 0
          ? "net_profit"
          : result.profitAndLossAccount.netLoss > 0
            ? "net_loss"
            : "none";

      expect(practiceCase.expectedNetResultType).toBe(expectedType);
      expect(practiceCase.expectedNetResultAmount).toBe(
        result.profitAndLossAccount.netProfit || result.profitAndLossAccount.netLoss,
      );
    }
  });

  it("matches Balance Sheet totals from the existing final accounts engine", () => {
    for (const practiceCase of getFinalAccountsPracticeCases()) {
      const result = generateFinalAccounts(practiceCase.trialBalance, practiceCase.adjustments);
      expect(result.status).toBe("success");
      expect(practiceCase.expectedAdjustedCapitalAmount).toBe(result.balanceSheet.capitalWorking?.adjustedCapital);
      expect(practiceCase.expectedAssetTotal).toBe(result.balanceSheet.assetTotal);
      expect(practiceCase.expectedLiabilityTotal).toBe(result.balanceSheet.liabilityTotal);
      expect(practiceCase.expectedBalanceSheetAgrees).toBe(result.balanceSheet.agrees);
    }
  });

  it("parses supported amount formats", () => {
    expect(parseFinalAccountsPracticeAmount("Rs.50,000")).toBe(50000);
    expect(parseFinalAccountsPracticeAmount("50000")).toBe(50000);
    expect(parseFinalAccountsPracticeAmount("₹50000")).toBe(50000);
    expect(parseFinalAccountsPracticeAmount("INR 50000")).toBe(50000);
  });

  it("marks a correct answer as full score", () => {
    const practiceCase = generateFinalAccountsPracticeCase(0);
    const result = checkFinalAccountsPracticeAnswer(practiceCase, {
      grossResultType: practiceCase.expectedGrossResultType,
      grossAmountText: practiceCase.expectedGrossResultAmount.toString(),
      netResultType: practiceCase.expectedNetResultType,
      netAmountText: practiceCase.expectedNetResultAmount.toString(),
      adjustedCapitalText: (practiceCase.expectedAdjustedCapitalAmount ?? 0).toString(),
      assetTotalText: practiceCase.expectedAssetTotal.toString(),
      liabilityTotalText: practiceCase.expectedLiabilityTotal.toString(),
      balanceSheetAgrees: practiceCase.expectedBalanceSheetAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(100);
  });

  it("reduces score for wrong gross amount", () => {
    const practiceCase = generateFinalAccountsPracticeCase(0);
    const result = checkFinalAccountsPracticeAnswer(practiceCase, {
      grossResultType: practiceCase.expectedGrossResultType,
      grossAmountText: (practiceCase.expectedGrossResultAmount + 1).toString(),
      netResultType: practiceCase.expectedNetResultType,
      netAmountText: practiceCase.expectedNetResultAmount.toString(),
      adjustedCapitalText: (practiceCase.expectedAdjustedCapitalAmount ?? 0).toString(),
      assetTotalText: practiceCase.expectedAssetTotal.toString(),
      liabilityTotalText: practiceCase.expectedLiabilityTotal.toString(),
      balanceSheetAgrees: practiceCase.expectedBalanceSheetAgrees ? "yes" : "no",
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(85);
  });

  it("reduces score for wrong Balance Sheet agreement", () => {
    const practiceCase = generateFinalAccountsPracticeCase(0);
    const result = checkFinalAccountsPracticeAnswer(practiceCase, {
      grossResultType: practiceCase.expectedGrossResultType,
      grossAmountText: practiceCase.expectedGrossResultAmount.toString(),
      netResultType: practiceCase.expectedNetResultType,
      netAmountText: practiceCase.expectedNetResultAmount.toString(),
      adjustedCapitalText: (practiceCase.expectedAdjustedCapitalAmount ?? 0).toString(),
      assetTotalText: practiceCase.expectedAssetTotal.toString(),
      liabilityTotalText: practiceCase.expectedLiabilityTotal.toString(),
      balanceSheetAgrees: practiceCase.expectedBalanceSheetAgrees ? "no" : "yes",
    });

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(95);
  });
});
