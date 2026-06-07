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
      "Partner commission Rs.2000",
    );

    expect(result.status).toBe("success");
    expect(result.unclassifiedAdjustments).toContain("Partner commission Rs.2000");
    expect(result.adjustmentWarnings).toContain("Some adjustments could not be classified.");
  });

  it("creates new provision for doubtful debts by percentage", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      "Create provision for doubtful debts @ 5% on debtors",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      debtors: 50000,
      existingProvision: 0,
      requiredProvision: 2500,
      increase: 2500,
      decrease: 0,
      pnlEffect: "debit",
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 2500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 47500 });
  });

  it("debits only additional provision when existing provision is lower than required", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Doubtful Debts A/c Cr Rs.1000
Cash A/c Dr Rs.1000`,
      "Create provision for doubtful debts @ 5% on debtors",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      existingProvision: 1000,
      requiredProvision: 2500,
      increase: 1500,
      decrease: 0,
      pnlEffect: "debit",
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 47500 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
  });

  it("credits excess provision when existing provision is higher than required", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Doubtful Debts A/c Cr Rs.4000
Cash A/c Dr Rs.4000`,
      "Create provision for doubtful debts @ 5% on debtors",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      existingProvision: 4000,
      requiredProvision: 2500,
      increase: 0,
      decrease: 1500,
      pnlEffect: "credit",
    });
    expect(line(result.profitAndLossAccount.creditLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 47500 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
  });

  it("uses directly given required provision amount", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      "Provision for doubtful debts required Rs.3000",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking?.requiredProvision).toBe(3000);
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 3000,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 47000 });
  });

  it("warns when debtors are missing for percentage provision", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Cash A/c Dr Rs.50000`,
      "Create provision for doubtful debts @ 5% on debtors",
    );

    expect(result.status).toBe("success");
    expect(result.adjustmentWarnings).toContain(
      "Debtors balance not found, so provision for doubtful debts could not be calculated.",
    );
  });

  it("handles full case with existing provision for doubtful debts", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.30000
Debtors A/c Dr Rs.50000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.60000
Creditors A/c Cr Rs.10000
Provision for Doubtful Debts A/c Cr Rs.1000
Bank A/c Dr Rs.71000`,
      "Create provision for doubtful debts @ 5% on debtors",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      requiredProvision: 2500,
      increase: 1500,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 47500 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
  });

  it("deducts further bad debts from debtors and debits Profit and Loss", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      "Further bad debts Rs.2000",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toBeUndefined();
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 48000 });
    expect(result.balanceSheet.capitalWorking?.adjustedCapital).toBe(48000);
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("calculates new provision after deducting further bad debts even when provision is entered first", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      `Create provision for doubtful debts @ 5% on debtors
Additional bad debts Rs.2000`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 2000,
      adjustedDebtors: 48000,
      existingProvision: 0,
      requiredProvision: 2400,
      increase: 2400,
      decrease: 0,
      pnlEffect: "debit",
      netDebtors: 45600,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 2400,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 45600 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("debits only provision increase after further bad debts when existing provision is lower", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Doubtful Debts A/c Cr Rs.1000
Cash A/c Dr Rs.1000`,
      `Bad debts further written off Rs.2000
Create provision for doubtful debts @ 5% on debtors`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 2000,
      adjustedDebtors: 48000,
      existingProvision: 1000,
      requiredProvision: 2400,
      increase: 1400,
      decrease: 0,
      pnlEffect: "debit",
      netDebtors: 45600,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1400,
    });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("credits only provision decrease after further bad debts when existing provision is higher", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Doubtful Debts A/c Cr Rs.4000
Cash A/c Dr Rs.4000`,
      `Bad debts to be written off Rs.2000
Create provision for doubtful debts @ 5% on debtors`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      existingProvision: 4000,
      requiredProvision: 2400,
      increase: 0,
      decrease: 1600,
      pnlEffect: "credit",
      netDebtors: 45600,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.creditLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1600,
    });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("uses amount-based required provision with further bad debts already deducted", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      `Write off further bad debts Rs.2000
Provision for doubtful debts required Rs.3000`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      adjustedDebtors: 48000,
      requiredProvision: 3000,
      increase: 3000,
      netDebtors: 45000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 3000,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 45000 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("prepares full balanced final accounts with further bad debts and existing provision", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.30000
Debtors A/c Dr Rs.50000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.60000
Creditors A/c Cr Rs.10000
Provision for Doubtful Debts A/c Cr Rs.1000
Bank A/c Dr Rs.71000`,
      `Further bad debts written off Rs.2000
Create provision for doubtful debts @ 5% on debtors`,
    );

    expect(result.status).toBe("success");
    expect(result.tradingAccount.grossProfit).toBe(40000);
    expect(result.profitAndLossAccount.netProfit).toBe(36600);
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 2000,
      adjustedDebtors: 48000,
      existingProvision: 1000,
      requiredProvision: 2400,
      increase: 1400,
      netDebtors: 45600,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 45600 });
    expect(line(result.balanceSheet.liabilities, "Adjusted Capital")).toEqual({
      account: "Adjusted Capital",
      amount: 136600,
    });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
    expect(result.balanceSheet.assetTotal).toBe(146600);
    expect(result.balanceSheet.liabilityTotal).toBe(146600);
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("parses supported further bad debts wording patterns", () => {
    [
      "Further bad debts Rs.2000",
      "Additional bad debts Rs.2000",
      "Bad debts further written off Rs.2000",
      "Bad debts to be written off Rs.2000",
      "Write off further bad debts Rs.2000",
      "Further bad debts written off Rs.2000",
      "Additional bad debts written off Rs.2000",
    ].forEach((adjustment) => {
      const result = generateFinalAccounts(
        `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
        adjustment,
      );

      expect(result.status).toBe("success");
      expect(result.parsedAdjustments, adjustment).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "further_bad_debts",
            account: "Further Bad Debts",
            amount: 2000,
          }),
        ]),
      );
      expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 48000 });
    });
  });

  it("creates new provision for discount on debtors by percentage", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      "Create provision for discount on debtors @ 2%",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 0,
      adjustedDebtors: 50000,
      provisionForDoubtfulDebts: 0,
      goodDebtors: 50000,
      existingProvision: 0,
      requiredProvision: 1000,
      increase: 1000,
      decrease: 0,
      pnlEffect: "debit",
      netDebtors: 49000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 1000,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 49000 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("calculates discount provision after further bad debts and provision for doubtful debts", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      `Further bad debts Rs.2000
Create provision for doubtful debts @ 5% on debtors
Create provision for discount on debtors @ 2%`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 2000,
      adjustedDebtors: 48000,
      provisionForDoubtfulDebts: 2400,
      goodDebtors: 45600,
      existingProvision: 0,
      requiredProvision: 912,
      increase: 912,
      decrease: 0,
      pnlEffect: "debit",
      netDebtors: 44688,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 2400,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 912,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 44688 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("handles full smoke case with further bad debts, doubtful provision, and discount provision", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.30000
Debtors A/c Dr Rs.50000
Purchases A/c Dr Rs.20000
Sales A/c Cr Rs.60000
Creditors A/c Cr Rs.10000
Provision for Doubtful Debts A/c Cr Rs.1000
Provision for Discount on Debtors A/c Cr Rs.500
Bank A/c Dr Rs.71500`,
      `Further bad debts Rs.2000
Create provision for doubtful debts @ 5% on debtors
Create provision for discount on debtors @ 2%`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDoubtfulDebtsWorking).toMatchObject({
      requiredProvision: 2400,
      increase: 1400,
    });
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      debtors: 50000,
      furtherBadDebts: 2000,
      adjustedDebtors: 48000,
      provisionForDoubtfulDebts: 2400,
      goodDebtors: 45600,
      existingProvision: 500,
      requiredProvision: 912,
      increase: 412,
      netDebtors: 44688,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Further Bad Debts")).toEqual({
      account: "Further Bad Debts",
      amount: 2000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Doubtful Debts")).toEqual({
      account: "Provision for Doubtful Debts",
      amount: 1400,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 412,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 44688 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Doubtful Debts" })]),
    );
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Discount on Debtors" })]),
    );
    expect(result.balanceSheet.assetTotal).toBe(146188);
    expect(result.balanceSheet.liabilityTotal).toBe(146188);
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("debits only discount provision increase when existing provision is lower", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Discount on Debtors A/c Cr Rs.500
Cash A/c Dr Rs.500`,
      "Create provision for discount on debtors @ 2%",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      requiredProvision: 1000,
      existingProvision: 500,
      increase: 500,
      decrease: 0,
      pnlEffect: "debit",
      netDebtors: 49000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 49000 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Discount on Debtors" })]),
    );
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("credits only discount provision decrease when existing provision is higher", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000
Provision for Discount on Debtors A/c Cr Rs.1500
Cash A/c Dr Rs.1500`,
      "Create provision for discount on debtors @ 2%",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      requiredProvision: 1000,
      existingProvision: 1500,
      increase: 0,
      decrease: 500,
      pnlEffect: "credit",
      netDebtors: 49000,
    });
    expect(line(result.profitAndLossAccount.creditLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 500,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 49000 });
    expect(result.balanceSheet.liabilities).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Provision for Discount on Debtors" })]),
    );
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("uses directly given required discount provision amount", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
      "Provision for discount on debtors required Rs.1200",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      goodDebtors: 50000,
      requiredProvision: 1200,
      increase: 1200,
      netDebtors: 48800,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 1200,
    });
    expect(line(result.balanceSheet.assets, "Net Debtors")).toEqual({ account: "Net Debtors", amount: 48800 });
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("warns when debtors are missing for percentage discount provision", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.50000
Cash A/c Dr Rs.50000`,
      "Create provision for discount on debtors @ 2%",
    );

    expect(result.status).toBe("success");
    expect(result.adjustmentWarnings).toContain(
      "Debtors balance not found, so provision for discount on debtors could not be calculated.",
    );
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toBeUndefined();
  });

  it("calculates manager commission after provision for discount on debtors", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Debtors A/c Dr Rs.50000
Sales A/c Cr Rs.50000
Provision for Discount on Debtors A/c Cr Rs.500
Cash A/c Dr Rs.500`,
      `Create provision for discount on debtors @ 2%
Manager's commission 10% on net profit before commission`,
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.provisionForDiscountOnDebtorsWorking).toMatchObject({
      requiredProvision: 1000,
      existingProvision: 500,
      increase: 500,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Provision for Discount on Debtors")).toEqual({
      account: "Provision for Discount on Debtors",
      amount: 500,
    });
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      profitBeforeCommission: 49500,
      commission: 4950,
      netProfitAfterCommission: 44550,
    });
  });

  it("parses supported provision for discount on debtors wording patterns", () => {
    [
      "Create provision for discount on debtors @ 2%",
      "Create provision for discount on debtors at 2%",
      "Provide 2% for discount on debtors",
      "Make provision for discount on debtors 2%",
      "Provision for discount on debtors 2%",
      "New provision for discount on debtors 2%",
      "Maintain provision for discount on debtors at 2%",
      "Provision for discount on good debtors @ 2%",
      "Provide 2% discount on good debtors",
      "Create provision for discount on debtors Rs.1000",
      "Provision for discount on debtors required Rs.1000",
      "Maintain provision for discount on debtors Rs.1000",
      "New provision for discount on debtors Rs.1000",
      "Required provision for discount on debtors Rs.1000",
    ].forEach((adjustment) => {
      const result = generateFinalAccounts(
        `Capital A/c Cr Rs.50000
Debtors A/c Dr Rs.50000`,
        adjustment,
      );

      expect(result.status).toBe("success");
      expect(result.parsedAdjustments, adjustment).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "provision_for_discount_on_debtors",
            account: "Provision for Discount on Debtors",
          }),
        ]),
      );
      expect(line(result.balanceSheet.assets, "Net Debtors").amount).toBeLessThan(50000);
    });
  });

  it("applies fixed manager commission", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.100000
Sales A/c Cr Rs.50000
Rent A/c Dr Rs.10000`,
      "Manager's commission Rs.5000",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      basis: "fixed",
      profitBeforeCommission: 40000,
      commission: 5000,
      netProfitAfterCommission: 35000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Manager's Commission")).toEqual({
      account: "Manager's Commission",
      amount: 5000,
    });
    expect(result.profitAndLossAccount.netProfit).toBe(35000);
    expect(line(result.balanceSheet.liabilities, "Manager's Commission Payable")).toEqual({
      account: "Manager's Commission Payable",
      amount: 5000,
    });
  });

  it("calculates manager commission before charging commission", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.100000
Sales A/c Cr Rs.50000
Rent A/c Dr Rs.10000`,
      "Manager's commission 10% on net profit before commission",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      basis: "before_commission",
      profitBeforeCommission: 40000,
      percentage: 10,
      commission: 4000,
      netProfitAfterCommission: 36000,
    });
    expect(result.profitAndLossAccount.netProfit).toBe(36000);
    expect(line(result.balanceSheet.liabilities, "Manager's Commission Payable")).toEqual({
      account: "Manager's Commission Payable",
      amount: 4000,
    });
  });

  it("calculates manager commission after charging commission", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.100000
Sales A/c Cr Rs.55000`,
      "Manager's commission 10% on net profit after commission",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      basis: "after_commission",
      profitBeforeCommission: 55000,
      percentage: 10,
      commission: 5000,
      netProfitAfterCommission: 50000,
    });
    expect(result.profitAndLossAccount.netProfit).toBe(50000);
    expect(line(result.balanceSheet.liabilities, "Manager's Commission Payable")).toEqual({
      account: "Manager's Commission Payable",
      amount: 5000,
    });
  });

  it("calculates manager commission after other adjustments", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.100000
Sales A/c Cr Rs.60000
Salary A/c Dr Rs.10000`,
      `Salary outstanding Rs.5000
Manager's commission 10% on net profit before commission`,
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.debitLines, "Salary")).toEqual({ account: "Salary", amount: 15000 });
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      profitBeforeCommission: 45000,
      commission: 4500,
      netProfitAfterCommission: 40500,
    });
    expect(result.profitAndLossAccount.netProfit).toBe(40500);
    expect(line(result.balanceSheet.liabilities, "Manager's Commission Payable")).toEqual({
      account: "Manager's Commission Payable",
      amount: 4500,
    });
  });

  it("does not calculate percentage manager commission when there is no profit", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Cash A/c Dr Rs.100000
Rent A/c Dr Rs.20000`,
      "Manager's commission 10% on net profit before commission",
    );

    expect(result.status).toBe("success");
    expect(result.adjustmentWarnings).toContain(
      "Manager's commission percentage cannot be calculated because there is no net profit before commission.",
    );
    expect(result.profitAndLossAccount.debitLines).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ account: "Manager's Commission" })]),
    );
  });

  it("parses commission payable to manager as fixed manager commission", () => {
    const result = generateFinalAccounts(
      `Capital Cr 50000
Cash Dr 50000`,
      "Commission payable to manager Rs.3000",
    );

    expect(result.status).toBe("success");
    expect(result.balanceSheet.managerCommissionWorking).toMatchObject({
      basis: "fixed",
      commission: 3000,
    });
    expect(line(result.profitAndLossAccount.debitLines, "Manager's Commission")).toEqual({
      account: "Manager's Commission",
      amount: 3000,
    });
  });

  it("reduces Commission Received for commission received in advance", () => {
    const result = generateFinalAccounts(
      `Commission Received A/c Cr Rs.4000
Capital A/c Cr Rs.4000
Cash A/c Dr Rs.8000`,
      "Commission received in advance Rs.1500",
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.creditLines, "Commission Received")).toEqual({
      account: "Commission Received",
      amount: 2500,
    });
    expect(line(result.balanceSheet.liabilities, "Commission Received In Advance")).toEqual({
      account: "Commission Received In Advance",
      amount: 1500,
    });
    expect(result.adjustmentWarnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Related income not found")]),
    );
  });

  it("prepares full tallied final accounts with commission received in advance", () => {
    const result = generateFinalAccounts(
      `Capital A/c Cr Rs.100000
Drawings A/c Dr Rs.10000
Cash A/c Dr Rs.20000
Bank A/c Dr Rs.40000
Debtors A/c Dr Rs.30000
Creditors A/c Cr Rs.25000
Loan A/c Cr Rs.60000
Machinery A/c Dr Rs.80000
Furniture A/c Dr Rs.25000
Purchases A/c Dr Rs.60000
Sales A/c Cr Rs.120000
Purchase Return A/c Cr Rs.5000
Sales Return A/c Dr Rs.4000
Wages A/c Dr Rs.15000
Carriage Inward A/c Dr Rs.3000
Salary A/c Dr Rs.12000
Rent A/c Dr Rs.8000
Insurance A/c Dr Rs.6000
Advertisement A/c Dr Rs.5000
Commission Received A/c Cr Rs.4000
Interest Income A/c Cr Rs.3000
Output GST A/c Cr Rs.7000
Input GST A/c Dr Rs.6000`,
      `Closing stock Rs.25000
Salary outstanding Rs.3000
Prepaid insurance Rs.2000
Interest accrued Rs.1000
Commission received in advance Rs.1500
Depreciation on machinery Rs.8000
Depreciation on furniture Rs.2500`,
    );

    expect(result.status).toBe("success");
    expect(line(result.profitAndLossAccount.creditLines, "Commission Received")).toEqual({
      account: "Commission Received",
      amount: 2500,
    });
    expect(result.adjustmentWarnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("Related income not found")]),
    );
    expect(result.tradingAccount.grossProfit).toBe(68000);
    expect(result.profitAndLossAccount.netProfit).toBe(32000);
    expect(result.balanceSheet.capitalWorking?.adjustedCapital).toBe(122000);
    expect(result.balanceSheet.assetTotal).toBe(218500);
    expect(result.balanceSheet.liabilityTotal).toBe(218500);
    expect(result.balanceSheet.agrees).toBe(true);
  });

  it("keeps parsed trial balance unadjusted after depreciation", () => {
    const result = generateFinalAccounts(
      `Machinery A/c Dr Rs.80000
Furniture A/c Dr Rs.25000
Capital A/c Cr Rs.105000`,
      `Depreciation on machinery Rs.8000
Depreciation on furniture Rs.2500`,
    );

    expect(result.status).toBe("success");
    expect(balance(result.parsedBalances, "Machinery")).toMatchObject({ account: "Machinery", amount: 80000 });
    expect(balance(result.parsedBalances, "Furniture")).toMatchObject({ account: "Furniture", amount: 25000 });
    expect(line(result.balanceSheet.assets, "Machinery")).toEqual({ account: "Machinery", amount: 72000 });
    expect(line(result.balanceSheet.assets, "Furniture")).toEqual({ account: "Furniture", amount: 22500 });
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
