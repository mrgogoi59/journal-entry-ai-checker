import { describe, expect, it } from "vitest";
import { generateFinalAccounts, type FinalAccountLine, type TrialBalanceBalance } from "@/lib/final-accounts-engine";

describe("generateFinalAccounts", () => {
  it("prepares basic gross profit and net profit", () => {
    const result = generateFinalAccounts(`Purchases A/c Dr Rs.20000
Wages A/c Dr Rs.5000
Sales A/c Cr Rs.40000
Rent A/c Dr Rs.3000
Commission Received A/c Cr Rs.2000`);

    expect(result.status).toBe("success");
    expect(line(result.tradingAccount.debitLines, "Purchases")).toEqual({ account: "Purchases", amount: 20000 });
    expect(line(result.tradingAccount.debitLines, "Wages")).toEqual({ account: "Wages", amount: 5000 });
    expect(line(result.tradingAccount.creditLines, "Sales")).toEqual({ account: "Sales", amount: 40000 });
    expect(result.tradingAccount.grossProfit).toBe(15000);

    expect(line(result.profitAndLossAccount.debitLines, "Rent")).toEqual({ account: "Rent", amount: 3000 });
    expect(line(result.profitAndLossAccount.creditLines, "Gross Profit")).toEqual({
      account: "Gross Profit",
      amount: 15000,
    });
    expect(line(result.profitAndLossAccount.creditLines, "Commission Received")).toEqual({
      account: "Commission Received",
      amount: 2000,
    });
    expect(result.profitAndLossAccount.netProfit).toBe(14000);
  });

  it("calculates gross loss and carries it to Profit and Loss debit side", () => {
    const result = generateFinalAccounts(`Purchases Dr 50000
Wages Dr 10000
Sales Cr 40000`);

    expect(result.status).toBe("success");
    expect(result.tradingAccount.grossLoss).toBe(20000);
    expect(line(result.tradingAccount.creditLines, "Gross Loss")).toEqual({ account: "Gross Loss", amount: 20000 });
    expect(line(result.profitAndLossAccount.debitLines, "Gross Loss")).toEqual({
      account: "Gross Loss",
      amount: 20000,
    });
  });

  it("calculates net loss", () => {
    const result = generateFinalAccounts(`Purchases Dr 20000
Sales Cr 30000
Rent Dr 15000`);

    expect(result.status).toBe("success");
    expect(result.tradingAccount.grossProfit).toBe(10000);
    expect(result.profitAndLossAccount.netLoss).toBe(5000);
    expect(line(result.profitAndLossAccount.creditLines, "Net Loss")).toEqual({ account: "Net Loss", amount: 5000 });
  });

  it("separates Balance Sheet items", () => {
    const result = generateFinalAccounts(`Cash Dr 10000
Capital Cr 50000
Purchases Dr 20000
Sales Cr 30000
Debtors Dr 5000
Creditors Cr 5000`);

    expect(result.status).toBe("success");
    expect(balance(result.balanceSheetItems, "Cash")).toMatchObject({ account: "Cash", side: "debit", amount: 10000 });
    expect(balance(result.balanceSheetItems, "Capital")).toMatchObject({
      account: "Capital",
      side: "credit",
      amount: 50000,
    });
    expect(balance(result.balanceSheetItems, "Debtors")).toMatchObject({
      account: "Debtors",
      side: "debit",
      amount: 5000,
    });
    expect(balance(result.balanceSheetItems, "Creditors")).toMatchObject({
      account: "Creditors",
      side: "credit",
      amount: 5000,
    });
    expect(line(result.tradingAccount.debitLines, "Purchases")).toEqual({ account: "Purchases", amount: 20000 });
    expect(line(result.tradingAccount.creditLines, "Sales")).toEqual({ account: "Sales", amount: 30000 });
  });

  it("keeps unknown accounts unclassified", () => {
    const result = generateFinalAccounts(`Unknown Expense Dr 1000
Sales Cr 1000`);

    expect(result.status).toBe("success");
    expect(balance(result.unclassifiedItems, "Unknown Expense")).toMatchObject({
      account: "Unknown Expense",
      side: "debit",
      amount: 1000,
    });
  });

  it("returns invalid when Dr or Cr is missing", () => {
    const result = generateFinalAccounts("Purchases Rs.20000");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("Please mention Dr or Cr in line 1.");
  });

  it("returns invalid when amount is missing", () => {
    const result = generateFinalAccounts("Purchases Dr");

    expect(result.status).toBe("invalid");
    expect(result.errors.join(" ")).toContain("Amount is missing in line 1.");
  });
});

function line(lines: FinalAccountLine[], account: string): FinalAccountLine {
  const found = lines.find((finalAccountLine) => finalAccountLine.account === account);
  expect(found).toBeDefined();
  return found!;
}

function balance(balances: TrialBalanceBalance[], account: string): TrialBalanceBalance {
  const found = balances.find((trialBalanceBalance) => trialBalanceBalance.account === account);
  expect(found).toBeDefined();
  return found!;
}
