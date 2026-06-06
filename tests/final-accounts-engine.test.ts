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

  it("prepares Balance Sheet with net profit and adjusted capital", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Cash A/c Dr Rs.10000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.40000
Wages A/c Dr Rs.5000
Rent A/c Dr Rs.3000
Commission Received A/c Cr Rs.2000
Debtors A/c Dr Rs.8000
Creditors A/c Cr Rs.6000
Furniture A/c Dr Rs.15000
Drawings A/c Dr Rs.5000
Bank A/c Dr Rs.32000`);

    expect(result.status).toBe("success");
    expect(result.tradingAccount.grossProfit).toBe(15000);
    expect(result.profitAndLossAccount.netProfit).toBe(14000);
    expect(result.balanceSheet.capitalWorking).toEqual({
      openingCapital: 50000,
      netProfit: 14000,
      netLoss: 0,
      drawings: 5000,
      adjustedCapital: 59000,
    });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 59000,
    });
    expect(line(result.balanceSheet.liabilities, "Creditors")).toEqual({ account: "Creditors", amount: 6000 });
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 10000 });
    expect(line(result.balanceSheet.assets, "Debtors")).toEqual({ account: "Debtors", amount: 8000 });
    expect(line(result.balanceSheet.assets, "Furniture")).toEqual({ account: "Furniture", amount: 15000 });
    expect(line(result.balanceSheet.assets, "Bank")).toEqual({ account: "Bank", amount: 32000 });
    expect(result.balanceSheet.assetTotal).toBe(65000);
    expect(result.balanceSheet.liabilityTotal).toBe(65000);
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("prepares Balance Sheet with net loss", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Sales A/c Cr Rs.30000
Purchases A/c Dr Rs.20000
Rent A/c Dr Rs.15000
Cash A/c Dr Rs.45000`);

    expect(result.status).toBe("success");
    expect(result.tradingAccount.grossProfit).toBe(10000);
    expect(result.profitAndLossAccount.netLoss).toBe(5000);
    expect(result.balanceSheet.capitalWorking?.adjustedCapital).toBe(45000);
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 45000 });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 45000,
    });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("deducts drawings from capital", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Drawings A/c Dr Rs.10000
Cash A/c Dr Rs.40000`);

    expect(result.status).toBe("success");
    expect(result.balanceSheet.capitalWorking?.adjustedCapital).toBe(40000);
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 40000 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("classifies debtors and creditors in Balance Sheet", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.10000
Creditors A/c Cr Rs.5000
Cash A/c Dr Rs.45000`);

    expect(result.status).toBe("success");
    expect(line(result.balanceSheet.assets, "Debtors")).toEqual({ account: "Debtors", amount: 10000 });
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 45000 });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 50000,
    });
    expect(line(result.balanceSheet.liabilities, "Creditors")).toEqual({ account: "Creditors", amount: 5000 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("classifies prepaid and outstanding balances in Balance Sheet", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Prepaid Rent A/c Dr Rs.5000
Outstanding Salary A/c Cr Rs.3000
Cash A/c Dr Rs.48000`);

    expect(result.status).toBe("success");
    expect(line(result.balanceSheet.assets, "Prepaid Rent")).toEqual({ account: "Prepaid Rent", amount: 5000 });
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 48000 });
    expect(line(result.balanceSheet.liabilities, "Outstanding Salary")).toEqual({
      account: "Outstanding Salary",
      amount: 3000,
    });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 50000,
    });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("classifies Input GST and Output GST in Balance Sheet", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Input GST A/c Dr Rs.2000
Output GST A/c Cr Rs.3000
Cash A/c Dr Rs.51000`);

    expect(result.status).toBe("success");
    expect(line(result.balanceSheet.assets, "Input GST")).toEqual({ account: "Input GST", amount: 2000 });
    expect(line(result.balanceSheet.assets, "Cash")).toEqual({ account: "Cash", amount: 51000 });
    expect(line(result.balanceSheet.liabilities, "Output GST")).toEqual({ account: "Output GST", amount: 3000 });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 50000,
    });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("keeps unknown Balance Sheet accounts unclassified and warns", () => {
    const result = generateFinalAccounts(`Capital A/c Cr Rs.50000
Unknown Account Dr Rs.5000
Cash A/c Dr Rs.45000`);

    expect(result.status).toBe("success");
    expect(balance(result.unclassifiedItems, "Unknown Account")).toMatchObject({
      account: "Unknown Account",
      side: "debit",
      amount: 5000,
    });
    expect(result.balanceSheet.assets).not.toEqual(expect.arrayContaining([expect.objectContaining({ account: "Unknown Account" })]));
    expect(result.balanceSheet.agrees).toBe(false);
    expect(result.balanceSheetWarnings).toContain("Some accounts could not be classified.");
  });

  it("applies closing stock adjustment to Trading Account and Balance Sheet", () => {
    const result = generateFinalAccounts(
      `Purchases Dr 20000
Sales Cr 40000
Capital Cr 30000
Cash Dr 30000`,
      "Closing stock Rs.10000",
    );

    expect(result.status).toBe("success");
    expect(result.parsedAdjustments).toHaveLength(1);
    expect(line(result.tradingAccount.creditLines, "Closing Stock")).toEqual({
      account: "Closing Stock",
      amount: 10000,
    });
    expect(result.tradingAccount.grossProfit).toBe(30000);
    expect(line(result.balanceSheet.assets, "Closing Stock")).toEqual({ account: "Closing Stock", amount: 10000 });
  });

  it("applies outstanding salary adjustment", () => {
    const result = generateFinalAccounts(
      `Salary Dr 10000
Capital Cr 50000
Cash Dr 40000`,
      "Salary outstanding Rs.3000",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.debitLines, "Salary")).toEqual({ account: "Salary", amount: 13000 });
    expect(line(result.balanceSheet.liabilities, "Outstanding Salary")).toEqual({
      account: "Outstanding Salary",
      amount: 3000,
    });
  });

  it("applies prepaid insurance adjustment", () => {
    const result = generateFinalAccounts(
      `Insurance Dr 10000
Capital Cr 50000
Cash Dr 40000`,
      "Prepaid insurance Rs.2000",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.debitLines, "Insurance")).toEqual({ account: "Insurance", amount: 8000 });
    expect(line(result.balanceSheet.assets, "Prepaid Insurance")).toEqual({
      account: "Prepaid Insurance",
      amount: 2000,
    });
  });

  it("applies accrued interest adjustment", () => {
    const result = generateFinalAccounts(
      `Interest Income Cr 5000
Capital Cr 50000
Cash Dr 55000`,
      "Interest accrued Rs.1500",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.creditLines, "Interest Income")).toEqual({
      account: "Interest Income",
      amount: 6500,
    });
    expect(line(result.balanceSheet.assets, "Accrued Interest")).toEqual({
      account: "Accrued Interest",
      amount: 1500,
    });
  });

  it("applies rent received in advance adjustment", () => {
    const result = generateFinalAccounts(
      `Rent Income Cr 10000
Capital Cr 50000
Cash Dr 60000`,
      "Rent received in advance Rs.4000",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.creditLines, "Rent Income")).toEqual({
      account: "Rent Income",
      amount: 6000,
    });
    expect(line(result.balanceSheet.liabilities, "Rent Received In Advance")).toEqual({
      account: "Rent Received In Advance",
      amount: 4000,
    });
  });

  it("applies depreciation on machinery adjustment", () => {
    const result = generateFinalAccounts(
      `Machinery Dr 50000
Capital Cr 50000`,
      "Depreciation on machinery Rs.5000",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.debitLines, "Depreciation")).toEqual({
      account: "Depreciation",
      amount: 5000,
    });
    expect(line(result.balanceSheet.assets, "Machinery")).toEqual({ account: "Machinery", amount: 45000 });
  });

  it("applies combined simple adjustments safely", () => {
    const result = generateFinalAccounts(
      `Capital Cr 50000
Cash Dr 30000
Purchases Dr 20000
Sales Cr 40000
Salary Dr 5000
Insurance Dr 4000
Machinery Dr 50000
Creditors Cr 69000`,
      `Closing stock Rs.10000
Salary outstanding Rs.2000
Prepaid insurance Rs.1000
Depreciation on machinery Rs.5000`,
    );

    expect(result.status).toBe("success");
    expect(result.parsedAdjustments).toHaveLength(4);
    expect(line(result.tradingAccount.creditLines, "Closing Stock")).toEqual({
      account: "Closing Stock",
      amount: 10000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Salary")).toEqual({ account: "Salary", amount: 7000 });
    expect(line(result.profitAndLossAccount.debitLines, "Insurance")).toEqual({ account: "Insurance", amount: 3000 });
    expect(line(result.profitAndLossAccount.debitLines, "Depreciation")).toEqual({
      account: "Depreciation",
      amount: 5000,
    });
    expect(line(result.balanceSheet.assets, "Closing Stock")).toEqual({ account: "Closing Stock", amount: 10000 });
    expect(line(result.balanceSheet.liabilities, "Outstanding Salary")).toEqual({
      account: "Outstanding Salary",
      amount: 2000,
    });
    expect(line(result.balanceSheet.assets, "Prepaid Insurance")).toEqual({
      account: "Prepaid Insurance",
      amount: 1000,
    });
    expect(line(result.balanceSheet.assets, "Machinery")).toEqual({ account: "Machinery", amount: 45000 });
  });

  it("keeps unknown adjustments unclassified and warns", () => {
    const result = generateFinalAccounts(
      `Capital Cr 50000
Cash Dr 50000`,
      "Manager commission Rs.2000",
    );

    expect(result.status).toBe("success");
    expect(result.unclassifiedAdjustments).toContain("Manager commission Rs.2000");
    expect(result.adjustmentWarnings).toContain("Some adjustments could not be classified.");
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
