import type { EntryLineSide } from "./types";

const ACCOUNT_SYNONYMS: Record<string, string> = {
  cash: "Cash",
  "cash account": "Cash",
  bank: "Bank",
  "bank account": "Bank",
  capital: "Capital",
  "owner capital": "Capital",
  "proprietor capital": "Capital",
  drawings: "Drawings",
  "drawings account": "Drawings",
  drawing: "Drawings",
  "drawing account": "Drawings",
  "owner drawings": "Drawings",
  "proprietor drawings": "Drawings",
  purchases: "Purchases",
  "purchases account": "Purchases",
  purchase: "Purchases",
  "purchase account": "Purchases",
  sales: "Sales",
  "sales account": "Sales",
  sale: "Sales",
  "sale account": "Sales",
  "sales revenue": "Sales",
  "bad debt": "Bad Debts",
  "bad debts": "Bad Debts",
  "bad debt account": "Bad Debts",
  "bad debts account": "Bad Debts",
  "bad debt expense": "Bad Debts",
  "bad debts expense": "Bad Debts",
  "bad debt recovered": "Bad Debts Recovered",
  "bad debts recovered": "Bad Debts Recovered",
  "bad debt recovered account": "Bad Debts Recovered",
  "bad debts recovered account": "Bad Debts Recovered",
  "bad debts recovery": "Bad Debts Recovered",
  "bad debts recovery income": "Bad Debts Recovered",
  depreciation: "Depreciation",
  "depreciation account": "Depreciation",
  "depreciation expense": "Depreciation",
  furniture: "Furniture",
  machinery: "Machinery",
  computer: "Computer",
  computers: "Computer",
  equipment: "Equipment",
  vehicle: "Vehicle",
  vehicles: "Vehicle",
  rent: "Rent Expense",
  "rent account": "Rent Expense",
  "rent expense": "Rent Expense",
  "rent expense account": "Rent Expense",
  "shop rent": "Rent Expense",
  "outstanding rent": "Outstanding Rent",
  "rent outstanding": "Outstanding Rent",
  "rent payable": "Outstanding Rent",
  salary: "Salary Expense",
  "salary account": "Salary Expense",
  salaries: "Salary Expense",
  "salary expense": "Salary Expense",
  "salary expense account": "Salary Expense",
  "staff salary": "Salary Expense",
  "employee salary": "Salary Expense",
  "outstanding salary": "Outstanding Salary",
  "salary outstanding": "Outstanding Salary",
  "salary payable": "Outstanding Salary",
  wages: "Wages Expense",
  wage: "Wages Expense",
  "wages account": "Wages Expense",
  "wages expense": "Wages Expense",
  "wages expense account": "Wages Expense",
  "wage account": "Wages Expense",
  "wage expense": "Wages Expense",
  "outstanding wages": "Outstanding Wages",
  "wages outstanding": "Outstanding Wages",
  "wages payable": "Outstanding Wages",
  commission: "Commission Income",
  "commission income": "Commission Income",
  "commission received": "Commission Income",
  "commission earned": "Commission Income",
  "interest expense": "Interest Expense",
  "interest paid": "Interest Expense",
  "interest on loan": "Interest Expense",
  "loan interest": "Interest Expense",
  "interest income": "Interest Income",
  "interest received": "Interest Income",
  "interest earned": "Interest Income",
  electricity: "Electricity Expense",
  "electricity expense": "Electricity Expense",
  "electricity bill": "Electricity Expense",
  "electricity account": "Electricity Expense",
  "electricity expense account": "Electricity Expense",
  "outstanding electricity": "Outstanding Electricity",
  "electricity outstanding": "Outstanding Electricity",
  "electricity payable": "Outstanding Electricity",
  "outstanding electricity bill": "Outstanding Electricity",
  insurance: "Insurance Expense",
  "insurance account": "Insurance Expense",
  "insurance premium": "Insurance Expense",
  "insurance expense": "Insurance Expense",
  "insurance expense account": "Insurance Expense",
  "outstanding insurance": "Outstanding Insurance",
  "insurance outstanding": "Outstanding Insurance",
  "insurance payable": "Outstanding Insurance",
  debtor: "Debtor",
  debtors: "Debtor",
  "debtor account": "Debtor",
  "sundry debtor": "Debtor",
  "sundry debtors": "Debtor",
  customer: "Debtor",
  creditor: "Creditor",
  creditors: "Creditor",
  "creditor account": "Creditor",
  "sundry creditor": "Creditor",
  "sundry creditors": "Creditor",
  supplier: "Creditor",
  loan: "Loan",
  "bank loan": "Loan",
  borrowings: "Loan",
  "borrowed loan": "Loan",
};

const SPELLING_CORRECTIONS: Record<string, string> = {
  capitol: "capital",
  salery: "salary",
  purchse: "purchases",
  commision: "commission",
  machinary: "machinery",
  furnitur: "furniture",
  crediter: "creditor",
  debter: "debtor",
};

export function cleanAccountName(value: string): string {
  const cleaned = value
    .toLowerCase()
    .replace(/\ba\s*\/?\s*c\b|\bac\b|\baccount\b/g, " account ")
    .replace(/\bdr\b|\bcr\b|\bdebit\b|\bcredit\b|\bto\b/g, " ")
    .replace(/[.:,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return applySpellingCorrections(cleaned)
    .replace(/\baccount\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAccountName(value: string, side?: EntryLineSide): string {
  const cleaned = cleanAccountName(value);

  if (cleaned === "interest") {
    return side === "credit" ? "Interest Income" : "Interest Expense";
  }

  if (cleaned === "goods") {
    return side === "credit" ? "Sales" : "Purchases";
  }

  return ACCOUNT_SYNONYMS[cleaned] ?? titleCase(cleaned);
}

function applySpellingCorrections(value: string): string {
  return value
    .split(" ")
    .map((word) => SPELLING_CORRECTIONS[word] ?? word)
    .join(" ");
}

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
