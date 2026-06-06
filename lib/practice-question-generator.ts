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
  paid_wages_cash: (amount) => `Paid wages ${formatRupees(amount)} in cash`,
  paid_wages_bank: (amount) => `Paid wages ${formatRupees(amount)} through bank`,
  paid_carriage_cash: (amount) => `Paid carriage ${formatRupees(amount)} in cash`,
  paid_carriage_bank: (amount) => `Paid carriage ${formatRupees(amount)} through bank`,
  paid_freight_cash: (amount) => `Paid freight ${formatRupees(amount)} in cash`,
  paid_freight_bank: (amount) => `Paid freight ${formatRupees(amount)} through bank`,
  paid_advertisement_cash: (amount) => `Paid advertisement ${formatRupees(amount)} in cash`,
  paid_advertisement_bank: (amount) => `Paid advertising expense ${formatRupees(amount)} by UPI`,
  paid_repairs_cash: (amount) => `Paid repairs ${formatRupees(amount)} in cash`,
  paid_repairs_bank: (amount) => `Paid repair charges ${formatRupees(amount)} by UPI`,
  paid_printing_stationery_cash: (amount) => `Paid stationery ${formatRupees(amount)} in cash`,
  paid_printing_stationery_bank: (amount) => `Stationery paid ${formatRupees(amount)} through bank`,
  paid_telephone_cash: (amount) => `Paid telephone bill ${formatRupees(amount)} in cash`,
  paid_telephone_bank: (amount) => `Paid phone bill ${formatRupees(amount)} by UPI`,
  paid_internet_cash: (amount) => `Paid internet bill ${formatRupees(amount)} in cash`,
  paid_internet_bank: (amount) => `Paid broadband bill ${formatRupees(amount)} by UPI`,
  paid_travelling_cash: (amount) => `Paid travelling expenses ${formatRupees(amount)} in cash`,
  paid_travelling_bank: (amount) => `Travelling expense paid ${formatRupees(amount)} through bank`,
  paid_petrol_fuel_cash: (amount) => `Paid petrol expenses ${formatRupees(amount)} in cash`,
  paid_petrol_fuel_bank: (amount) => `Paid fuel expense ${formatRupees(amount)} through bank`,
  paid_legal_charges_cash: (amount) => `Paid legal charges ${formatRupees(amount)} in cash`,
  paid_legal_charges_bank: (amount) => `Legal fees paid ${formatRupees(amount)} through bank`,
  paid_office_expenses_cash: (amount) => `Paid office expenses ${formatRupees(amount)} in cash`,
  paid_office_expenses_bank: (amount) => `Office expense paid ${formatRupees(amount)} through bank`,
  rent_received_cash: (amount) => `Received rent ${formatRupees(amount)} in cash`,
  rent_received_bank: (amount) => `Received rent ${formatRupees(amount)} through bank`,
  service_income_received_cash: (amount) => `Received service income ${formatRupees(amount)} in cash`,
  service_income_received_bank: (amount) => `Received service income ${formatRupees(amount)} through bank`,
  consultancy_income_received_cash: (amount) => `Received consultancy fees ${formatRupees(amount)} in cash`,
  consultancy_income_received_bank: (amount) => `Received consultancy fees ${formatRupees(amount)} by UPI`,
  tuition_income_received_cash: (amount) => `Received tuition fees ${formatRupees(amount)} in cash`,
  tuition_income_received_bank: (amount) => `Received tuition income ${formatRupees(amount)} by UPI`,
  dividend_income_received_cash: (amount) => `Received dividend ${formatRupees(amount)} in cash`,
  dividend_income_received_bank: (amount) => `Dividend received ${formatRupees(amount)} through bank`,
  royalty_income_received_cash: (amount) => `Received royalty ${formatRupees(amount)} in cash`,
  royalty_income_received_bank: (amount) => `Royalty received ${formatRupees(amount)} through bank`,
  interest_received_cash: (amount) => `Received interest ${formatRupees(amount)} in cash`,
  interest_received_bank: (amount) => `Interest received ${formatRupees(amount)} through bank`,
  commission_received_cash: (amount) => `Received commission ${formatRupees(amount)} in cash`,
  commission_received_bank: (amount) => `Commission received ${formatRupees(amount)} through bank`,
  discount_received_cash: (amount) => `Discount received ${formatRupees(amount)} in cash`,
  discount_received_bank: (amount) => `Discount received ${formatRupees(amount)} through bank`,
  miscellaneous_income_received_cash: (amount) => `Received miscellaneous income ${formatRupees(amount)} in cash`,
  miscellaneous_income_received_bank: (amount) => `Miscellaneous income received ${formatRupees(amount)} through bank`,
  bought_furniture_cash: (amount) => `Bought furniture for cash ${formatRupees(amount)}`,
  bought_machinery_cheque: (amount) => `Bought machinery by cheque ${formatRupees(amount)}`,
  asset_purchase_laptop_cash: (amount) => `Bought laptop for cash ${formatRupees(amount)}`,
  asset_purchase_laptop_bank: (amount) => `Bought laptop by UPI ${formatRupees(amount)}`,
  asset_purchase_printer_bank: (amount) => `Purchased printer through bank ${formatRupees(amount)}`,
  asset_purchase_camera_credit: (amount) => `Bought camera from Amit on credit ${formatRupees(amount)}`,
  asset_purchase_land_bank: (amount) => `Purchased land through bank ${formatRupees(amount)}`,
  asset_purchase_vehicle_credit: (amount) => `Bought vehicle on credit ${formatRupees(amount)}`,
  goods_gst_purchase_cash: (amount) => `Purchased goods ${formatRupees(amount)} plus GST 18% for cash`,
  goods_gst_purchase_credit: (amount) => `Purchased goods from Amit ${formatRupees(amount)} plus GST 18% on credit`,
  goods_gst_sale_cash: (amount) => `Sold goods ${formatRupees(amount)} plus GST 18% for cash`,
  goods_gst_sale_credit: (amount) => `Sold goods to Raju ${formatRupees(amount)} plus GST 18% on credit`,
  goods_gst_inclusive_purchase_cash: (amount) => `Purchased goods ${formatRupees(amount)} including GST 18% for cash`,
  goods_gst_inclusive_purchase_credit: (amount) =>
    `Purchased goods from Amit ${formatRupees(amount)} including GST 18% on credit`,
  goods_gst_inclusive_sale_cash: (amount) => `Sold goods ${formatRupees(amount)} including GST 18% for cash`,
  goods_gst_inclusive_sale_credit: (amount) =>
    `Sold goods to Raju ${formatRupees(amount)} including GST 18% on credit`,
  goods_gst_cgst_sgst_purchase_cash: (amount) =>
    `Purchased goods ${formatRupees(amount)} plus CGST 9% and SGST 9% for cash`,
  goods_gst_cgst_sgst_sale_cash: (amount) =>
    `Sold goods ${formatRupees(amount)} plus CGST 9% and SGST 9% for cash`,
  goods_gst_igst_purchase_cash: (amount) => `Purchased goods ${formatRupees(amount)} plus IGST 18% for cash`,
  goods_gst_igst_sale_cash: (amount) => `Sold goods ${formatRupees(amount)} plus IGST 18% for cash`,
  goods_gst_cgst_sgst_inclusive_purchase_cash: (amount) =>
    `Purchased goods ${formatRupees(amount)} including CGST 9% and SGST 9% for cash`,
  goods_gst_cgst_sgst_inclusive_sale_cash: (amount) =>
    `Sold goods ${formatRupees(amount)} including CGST 9% and SGST 9% for cash`,
  goods_gst_igst_inclusive_purchase_cash: (amount) =>
    `Purchased goods ${formatRupees(amount)} including IGST 18% for cash`,
  goods_gst_igst_inclusive_sale_cash: (amount) => `Sold goods ${formatRupees(amount)} including IGST 18% for cash`,
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
  sales_return: (amount) => `Goods returned by customer ${formatRupees(amount)}`,
  purchase_return: (amount) => `Goods returned to supplier ${formatRupees(amount)}`,
  paid_creditor: (amount) => `Paid creditor ${formatRupees(amount)} in cash`,
  received_from_debtor: (amount) => `Received from debtor ${formatRupees(amount)} in cash`,
  loan_taken_bank: (amount) => `Took loan ${formatRupees(amount)} through bank`,
  interest_paid_cash: (amount) => `Paid interest ${formatRupees(amount)} in cash`,
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

const explicitPracticeTransactionTypes = [
  "goods_gst_purchase_cash",
  "goods_gst_purchase_credit",
  "goods_gst_sale_cash",
  "goods_gst_sale_credit",
  "goods_gst_inclusive_purchase_cash",
  "goods_gst_inclusive_purchase_credit",
  "goods_gst_inclusive_sale_cash",
  "goods_gst_inclusive_sale_credit",
  "goods_gst_cgst_sgst_purchase_cash",
  "goods_gst_cgst_sgst_sale_cash",
  "goods_gst_igst_purchase_cash",
  "goods_gst_igst_sale_cash",
  "goods_gst_cgst_sgst_inclusive_purchase_cash",
  "goods_gst_cgst_sgst_inclusive_sale_cash",
  "goods_gst_igst_inclusive_purchase_cash",
  "goods_gst_igst_inclusive_sale_cash",
] as const;

export const supportedPracticeTransactionTypes = [
  ...transactionRules.map((rule) => rule.transaction_type),
  ...explicitPracticeTransactionTypes,
].filter((transactionType) => transactionType in PRACTICE_TEXT);

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
