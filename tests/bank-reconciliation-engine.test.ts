import { describe, expect, it } from "vitest";
import {
  calculateBankReconciliation,
  type BankReconciliationAdjustment,
  type BankReconciliationInput,
} from "@/lib/bank-reconciliation-engine";

describe("calculateBankReconciliation", () => {
  it("calculates Cash Book favourable balance to Bank Statement favourable balance", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 50000,
        adjustments: [
          adjustment("cheque_issued_not_presented", 10000),
          adjustment("cheque_deposited_not_credited", 8000),
        ],
      }),
    );

    expect(result.targetSource).toBe("bank_statement");
    expect(result.finalBalanceType).toBe("favourable");
    expect(result.finalBalanceAmount).toBe(52000);
    expect(result.workingRows.map((row) => row.operation)).toEqual(["add", "subtract"]);
  });

  it("calculates Cash Book overdraft to Bank Statement overdraft", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceType: "overdraft",
        startingBalanceAmount: 20000,
        adjustments: [adjustment("cheque_issued_not_presented", 5000), adjustment("bank_charges", 1000)],
      }),
    );

    expect(result.startingSignedBalance).toBe(-20000);
    expect(result.finalSignedBalance).toBe(-16000);
    expect(result.finalBalanceType).toBe("overdraft");
    expect(result.finalBalanceAmount).toBe(16000);
  });

  it("reverses adjustments when starting from Bank Statement", () => {
    const result = calculateBankReconciliation(
      input({
        startingSource: "bank_statement",
        startingBalanceAmount: 60000,
        adjustments: [
          adjustment("cheque_issued_not_presented", 12000),
          adjustment("cheque_deposited_not_credited", 7000),
        ],
      }),
    );

    expect(result.targetSource).toBe("cash_book");
    expect(result.finalBalanceType).toBe("favourable");
    expect(result.finalBalanceAmount).toBe(55000);
    expect(result.workingRows.map((row) => row.operation)).toEqual(["subtract", "add"]);
  });

  it("handles direct deposit and bank charges", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 30000,
        adjustments: [adjustment("direct_deposit_by_bank", 5000), adjustment("bank_charges", 500)],
      }),
    );

    expect(result.finalBalanceType).toBe("favourable");
    expect(result.finalBalanceAmount).toBe(34500);
  });

  it("handles interest credited and interest charged by bank", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 20000,
        adjustments: [adjustment("interest_credited_by_bank", 1200), adjustment("interest_charged_by_bank", 300)],
      }),
    );

    expect(result.finalBalanceAmount).toBe(20900);
    expect(result.workingRows.map((row) => row.runningBalance)).toEqual([21200, 20900]);
  });

  it("handles cheque dishonoured", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 25000,
        adjustments: [adjustment("cheque_dishonoured", 2500)],
      }),
    );

    expect(result.finalBalanceType).toBe("favourable");
    expect(result.finalBalanceAmount).toBe(22500);
    expect(result.workingRows[0]).toMatchObject({
      operation: "subtract",
      amount: 2500,
    });
  });

  it("allows empty adjustments and returns starting balance", () => {
    const result = calculateBankReconciliation(input({ startingBalanceAmount: 18000, adjustments: [] }));

    expect(result.finalSignedBalance).toBe(18000);
    expect(result.finalBalanceAmount).toBe(18000);
    expect(result.workingRows).toHaveLength(0);
  });

  it("skips invalid adjustment amounts with validation warnings", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 10000,
        adjustments: [adjustment("bank_charges", -100), adjustment("interest_credited_by_bank", "abc")],
      }),
    );

    expect(result.finalBalanceAmount).toBe(10000);
    expect(result.workingRows).toHaveLength(0);
    expect(result.warnings).toHaveLength(2);
  });

  it("skips unknown adjustment types with validation warnings", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 10000,
        adjustments: [adjustment("unsupported_adjustment", 1000)],
      }),
    );

    expect(result.finalBalanceAmount).toBe(10000);
    expect(result.workingRows).toHaveLength(0);
    expect(result.warnings[0]).toContain("unsupported type");
  });

  it("changes favourable balance to overdraft when deductions are larger", () => {
    const result = calculateBankReconciliation(
      input({
        startingBalanceAmount: 5000,
        adjustments: [adjustment("cheque_deposited_not_credited", 10000)],
      }),
    );

    expect(result.finalSignedBalance).toBe(-5000);
    expect(result.finalBalanceType).toBe("overdraft");
    expect(result.finalBalanceAmount).toBe(5000);
  });
});

function input(overrides: Partial<BankReconciliationInput>): BankReconciliationInput {
  return {
    startingSource: "cash_book",
    startingBalanceType: "favourable",
    startingBalanceAmount: 50000,
    adjustments: [],
    ...overrides,
  };
}

function adjustment(type: string, amount: number | string): BankReconciliationAdjustment {
  return {
    id: `${type}-${amount}`,
    type,
    amount,
  };
}
