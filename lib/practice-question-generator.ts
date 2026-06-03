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
  paid_creditor: (amount) => `Paid creditor ${formatRupees(amount)} in cash`,
  received_from_debtor: (amount) => `Received from debtor ${formatRupees(amount)} in cash`,
  loan_taken_bank: (amount) => `Took loan ${formatRupees(amount)} through bank`,
  interest_paid_cash: (amount) => `Paid interest ${formatRupees(amount)} in cash`,
  interest_received_cash: (amount) => `Received interest ${formatRupees(amount)} in cash`,
  paid_electricity: (amount) => `Paid electricity bill ${formatRupees(amount)}`,
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
