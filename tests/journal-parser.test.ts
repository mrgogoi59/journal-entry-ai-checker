import { describe, expect, it } from "vitest";
import { parseJournalEntry } from "@/lib/journal-parser";

describe("parseJournalEntry amount parsing", () => {
  it.each([
    ["₹50,000", 50000],
    ["Rs. 50,000", 50000],
    ["INR 50000", 50000],
    ["50000", 50000],
    ["50,000", 50000],
    ["50k", 50000],
    ["50000/-", 50000],
    ["₹ 5,000.00", 5000],
  ])("parses amount format %s", (rawAmount, expectedAmount) => {
    const parsed = parseJournalEntry(`Cash Dr ${rawAmount}\nCapital Cr ${rawAmount}`);

    expect(parsed.debits[0]).toEqual({ account: "Cash", amount: expectedAmount });
    expect(parsed.credits[0]).toEqual({ account: "Capital", amount: expectedAmount });
    expect(parsed.isBalanced).toBe(true);
  });
});

describe("parseJournalEntry debit and credit formats", () => {
  it.each([
    ["Cash A/c Dr. ₹50,000\nTo Capital A/c ₹50,000"],
    ["Dr Cash 50000\nCr Capital 50000"],
    ["Cash Debit 50000\nCapital Credit 50000"],
    ["Debit Cash 50000\nCredit Capital 50000"],
    ["Cash Account Dr Rs. 50,000\nTo Owner Capital Account Rs. 50,000"],
    ["Dr. Cash A/c 50000/-\nCr. Capital A/c 50000/-"],
  ])("parses supported format %#", (entry) => {
    const parsed = parseJournalEntry(entry);

    expect(parsed.errors).toEqual([]);
    expect(parsed.debits).toEqual([{ account: "Cash", amount: 50000 }]);
    expect(parsed.credits).toEqual([{ account: "Capital", amount: 50000 }]);
  });
});

describe("parseJournalEntry account synonyms and fuzzy corrections", () => {
  it.each([
    ["Cash Account Dr 5000", "Cash"],
    ["Bank A/c Dr 5000", "Bank"],
    ["Owner Capital Cr 5000", "Capital"],
    ["Proprietor Capital Cr 5000", "Capital"],
    ["Drawing A/c Dr 5000", "Drawings"],
    ["Drawings Account Dr 5000", "Drawings"],
    ["Drawing Account Dr 5000", "Drawings"],
    ["Owner Drawings Dr 5000", "Drawings"],
    ["Proprietor Drawings Dr 5000", "Drawings"],
    ["Purchases A/c Dr 5000", "Purchases"],
    ["Purchase Dr 5000", "Purchases"],
    ["Goods Dr 5000", "Purchases"],
    ["Goods Cr 5000", "Sales"],
    ["Sales A/c Cr 5000", "Sales"],
    ["Sales Account Cr 5000", "Sales"],
    ["Sales Revenue Cr 5000", "Sales"],
    ["Sale Cr 5000", "Sales"],
    ["Sale A/c Cr 5000", "Sales"],
    ["Rent Dr 5000", "Rent Expense"],
    ["Rent A/c Dr 5000", "Rent Expense"],
    ["Rent Account Dr 5000", "Rent Expense"],
    ["Rent Expense A/c Dr 5000", "Rent Expense"],
    ["Shop Rent Dr 5000", "Rent Expense"],
    ["Salary Dr 5000", "Salary Expense"],
    ["Salary A/c Dr 5000", "Salary Expense"],
    ["Salary Account Dr 5000", "Salary Expense"],
    ["Salary Expense A/c Dr 5000", "Salary Expense"],
    ["Salaries Dr 5000", "Salary Expense"],
    ["Staff Salary Dr 5000", "Salary Expense"],
    ["Employee Salary Dr 5000", "Salary Expense"],
    ["Commission Cr 5000", "Commission Income"],
    ["Commission A/c Cr 5000", "Commission Income"],
    ["Commission Received Cr 5000", "Commission Income"],
    ["Commission Income Cr 5000", "Commission Income"],
    ["Commission Income Account Cr 5000", "Commission Income"],
    ["Commission Earned Cr 5000", "Commission Income"],
    ["Interest Dr 5000", "Interest Expense"],
    ["Interest Cr 5000", "Interest Income"],
    ["Interest Paid Dr 5000", "Interest Expense"],
    ["Interest Expense Dr 5000", "Interest Expense"],
    ["Interest Expense Account Dr 5000", "Interest Expense"],
    ["Interest On Loan Dr 5000", "Interest Expense"],
    ["Loan Interest Dr 5000", "Interest Expense"],
    ["Interest Received Cr 5000", "Interest Income"],
    ["Interest Income Cr 5000", "Interest Income"],
    ["Interest Income Account Cr 5000", "Interest Income"],
    ["Interest Earned Cr 5000", "Interest Income"],
    ["Electricity Bill Dr 5000", "Electricity Expense"],
    ["Debtor Dr 5000", "Debtor"],
    ["Debtors Dr 5000", "Debtor"],
    ["Debtor A/c Dr 5000", "Debtor"],
    ["Debtor Account Dr 5000", "Debtor"],
    ["Sundry Debtor Dr 5000", "Debtor"],
    ["Sundry Debtors Dr 5000", "Debtor"],
    ["Creditor Cr 5000", "Creditor"],
    ["Creditors Cr 5000", "Creditor"],
    ["Creditor A/c Cr 5000", "Creditor"],
    ["Creditor Account Cr 5000", "Creditor"],
    ["Sundry Creditor Cr 5000", "Creditor"],
    ["Sundry Creditors Cr 5000", "Creditor"],
    ["Loan Cr 5000", "Loan"],
    ["Loan A/c Cr 5000", "Loan"],
    ["Loan Account Cr 5000", "Loan"],
    ["Bank Loan Cr 5000", "Loan"],
    ["Borrowings Cr 5000", "Loan"],
    ["Borrowed Loan Cr 5000", "Loan"],
    ["Travelling Expenses A/c Dr 5000", "Travelling Expense"],
    ["Travel Expenses Dr 5000", "Travelling Expense"],
    ["Travelling Expnse Dr 5000", "Travelling Expense"],
    ["Travel Tickets Dr 5000", "Travelling Expense"],
    ["Bus Fare Dr 5000", "Travelling Expense"],
    ["Flight Ticket Dr 5000", "Travelling Expense"],
    ["Legal Charge Dr 5000", "Legal Charges"],
    ["Legal Chargs Dr 5000", "Legal Charges"],
    ["Repair Expense Dr 5000", "Repairs Expense"],
    ["Repair Charge Dr 5000", "Repairs Expense"],
    ["Bank Accounts Dr 5000", "Bank"],
    ["Printing & Stationery Dr 5000", "Printing and Stationery Expense"],
    ["Telefone Expense Dr 5000", "Telephone Expense"],
    ["Received Commission Cr 5000", "Commission Income"],
    ["AC Dr 5000", "Equipment"],
    ["Table Dr 5000", "Furniture"],
    ["Capitol Cr 5000", "Capital"],
    ["Salery Dr 5000", "Salary Expense"],
    ["Purchse Dr 5000", "Purchases"],
    ["Commision Cr 5000", "Commission Income"],
    ["Machinary Dr 5000", "Machinery"],
    ["Furnitur Dr 5000", "Furniture"],
    ["Crediter Cr 5000", "Creditor"],
    ["Debter Dr 5000", "Debtor"],
  ])("normalizes %s to %s", (line, expectedAccount) => {
    const parsed = parseJournalEntry(line);
    const accounts = [...parsed.debits, ...parsed.credits].map((entryLine) => entryLine.account);

    expect(accounts).toContain(expectedAccount);
  });
});

describe("parseJournalEntry extended side words", () => {
  it("parses debited and credited as debit and credit labels", () => {
    const parsed = parseJournalEntry("Cash Debited Rs.5000\nCapital Credited Rs.5000");

    expect(parsed.errors).toEqual([]);
    expect(parsed.debits).toEqual([{ account: "Cash", amount: 5000 }]);
    expect(parsed.credits).toEqual([{ account: "Capital", amount: 5000 }]);
  });
});

describe("parseJournalEntry invalid formats", () => {
  it("marks entries with no debit or credit labels as invalid", () => {
    const parsed = parseJournalEntry("Cash 50000\nCapital 50000");

    expect(parsed.errors).toContain("Could not understand line: Cash 50000");
    expect(parsed.errors).toContain("Could not understand line: Capital 50000");
  });

  it("marks entries without amounts as invalid", () => {
    const parsed = parseJournalEntry("Cash Dr\nCapital Cr");

    expect(parsed.errors).toContain("Could not understand line: Cash Dr");
    expect(parsed.errors).toContain("Could not understand line: Capital Cr");
  });

  it("marks an empty entry as invalid", () => {
    const parsed = parseJournalEntry("");

    expect(parsed.errors).toEqual(["Journal entry is empty."]);
  });
});
