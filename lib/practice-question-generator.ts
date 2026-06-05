import { transactionRules } from "./accounting-rules";
import type { PracticeQuestion } from "./types";

export const simplePracticeAmounts = [1000, 2000, 5000, 10000, 20000, 50000, 80000, 100000] as const;

const PRACTICE_TEXT: Record<string, (amount: number) => string> = {
  capital_introduced_cash: (amount) => `Started business with ${formatRupees(amount)} cash`,
  started_business_bank: (amount) => `Started business with ${formatRupees(amount)} in bank`,
  bought_goods_cash: (amount) => `Bought goods for cash ${formatRupees(amount)}`,
  bought_goods_credit: (amount) => `Bought goods on credit ${formatRupees(amount)}`,
  sold_goods_cash: (amount) => `Sold goods for cash ${formatRupees(amount)}`,
  sold_goods_credit: (amount) => `Sold goods on credit ${formatRupees(amount)}`,
  paid_rent: (amount) => `Paid rent ${formatRupees(amount)} in cash`,
  paid_salary: (amount) => `Paid salary ${formatRupees(amount)} in cash`,
  commission_received_cash: (amount) => `Received commission ${formatRupees(amount)} in cash`,
  bought_furniture_cash: (amount) => `Bought furniture for cash ${formatRupees(amount)}`,
  bought_machinery_cheque: (amount) => `Bought machinery by cheque ${formatRupees(amount)}`,
  deposited_cash_bank: (amount) => `Deposited cash into bank ${formatRupees(amount)}`,
  withdrew_cash_bank: (amount) => `Withdraw cash from bank ${formatRupees(amount)}`,
  owner_drawings_cash: (amount) => `Owner withdrew cash for personal use ${formatRupees(amount)}`,
  goods_withdrawn_personal_use: (amount) =>
    `Goods worth ${formatRupees(amount)} withdrawn by proprietor for personal use`,
  goods_distributed_free_sample: (amount) => `Goods worth ${formatRupees(amount)} distributed as free sample`,
  goods_given_as_charity: (amount) => `Goods worth ${formatRupees(amount)} given as charity`,
  goods_lost_by_fire: (amount) => `Goods worth ${formatRupees(amount)} lost by fire`,
  goods_lost_by_theft: (amount) => `Goods worth ${formatRupees(amount)} stolen`,
  goods_lost_general: (amount) => `Goods worth ${formatRupees(amount)} lost`,
  paid_creditor: (amount) => `Paid creditor ${formatRupees(amount)} in cash`,
  received_from_debtor: (amount) => `Received from debtor ${formatRupees(amount)} in cash`,
  loan_taken_bank: (amount) => `Took loan ${formatRupees(amount)} through bank`,
  interest_paid_cash: (amount) => `Paid interest ${formatRupees(amount)} in cash`,
  interest_received_cash: (amount) => `Received interest ${formatRupees(amount)} in cash`,
  paid_electricity: (amount) => `Paid electricity bill ${formatRupees(amount)}`,
  bad_debts_written_off: (amount) => `Bad debts written off ${formatRupees(amount)}`,
  bad_debts_named_written_off: (amount) => `Raju became insolvent and ${formatRupees(amount)} became bad debt`,
  bad_debts_recovered_cash: (amount) => `Bad debts recovered ${formatRupees(amount)} in cash`,
  bad_debts_recovered_bank: (amount) => `Bad debts recovered ${formatRupees(amount)} through bank`,
  outstanding_salary: (amount) => `Salary outstanding ${formatRupees(amount)}`,
  outstanding_rent: (amount) => `Rent outstanding ${formatRupees(amount)}`,
  outstanding_wages: (amount) => `Wages outstanding ${formatRupees(amount)}`,
  outstanding_electricity: (amount) => `Electricity bill outstanding ${formatRupees(amount)}`,
  outstanding_insurance: (amount) => `Insurance outstanding ${formatRupees(amount)}`,
  prepaid_rent: (amount) => `Prepaid rent ${formatRupees(amount)}`,
  prepaid_insurance: (amount) => `Prepaid insurance ${formatRupees(amount)}`,
  prepaid_salary: (amount) => `Prepaid salary ${formatRupees(amount)}`,
  prepaid_wages: (amount) => `Prepaid wages ${formatRupees(amount)}`,
  prepaid_electricity: (amount) => `Prepaid electricity ${formatRupees(amount)}`,
  accrued_interest: (amount) => `Interest accrued ${formatRupees(amount)}`,
  accrued_commission: (amount) => `Commission accrued ${formatRupees(amount)}`,
  accrued_rent: (amount) => `Rent accrued ${formatRupees(amount)}`,
  rent_received_in_advance: (amount) => `Rent received in advance ${formatRupees(amount)}`,
  commission_received_in_advance: (amount) => `Commission received in advance ${formatRupees(amount)}`,
  interest_received_in_advance: (amount) => `Interest received in advance ${formatRupees(amount)}`,
  discount_allowed_cash_settlement: (amount) =>
    `Received ${formatRupees(Math.round(amount * 0.95))} from Mohan in full settlement of ${formatRupees(amount)}`,
  discount_received_cash_settlement: (amount) =>
    `Paid ${formatRupees(Math.round(amount * 0.9))} to Ram in full settlement of ${formatRupees(amount)}`,
  depreciation_machinery: (amount) => `Depreciation charged on machinery ${formatRupees(amount)}`,
  depreciation_furniture: (amount) => `Depreciation provided on furniture ${formatRupees(amount)}`,
  depreciation_computer: (amount) => `Depreciation on computer ${formatRupees(amount)}`,
  depreciation_equipment: (amount) => `Depreciation provided on equipment ${formatRupees(amount)}`,
  depreciation_vehicle: (amount) => `Depreciation charged on vehicle ${formatRupees(amount)}`,
};

export const supportedPracticeTransactionTypes = transactionRules
  .map((rule) => rule.transaction_type)
  .filter((transactionType) => transactionType in PRACTICE_TEXT);

export function generatePracticeQuestion(random = Math.random): PracticeQuestion {
  const transactionType = pick(supportedPracticeTransactionTypes, random);
  const amount = pick(simplePracticeAmounts, random);

  return {
    id: createPracticeQuestionId(transactionType, amount),
    transaction_text: PRACTICE_TEXT[transactionType](amount),
    difficulty: "Beginner",
    transaction_type: transactionType,
  };
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function pick<T>(items: readonly T[], random: () => number): T {
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}

function createPracticeQuestionId(transactionType: string, amount: number): string {
  const uniquePart = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${transactionType}-${amount}-${uniquePart}`;
}
