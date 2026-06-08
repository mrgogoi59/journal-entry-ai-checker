import { describe, expect, it } from "vitest";
import { generateLedger, type LedgerAccount } from "@/lib/ledger-engine";
import { generateTrialBalance } from "@/lib/trial-balance-engine";
import type { JournalEntry } from "@/lib/accounting-core";

describe("accounting-core ledger compatibility", () => {
  it("posts a basic cash sale through the existing ledger engine", () => {
    const entry = coreEntry("core-basic-cash-sale", "basic", [
      debit("Cash", 10000),
      credit("Sales", 10000),
    ]);

    expect(isBalanced(entry)).toBe(true);

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Cash", {
      debitTotal: 10000,
      creditTotal: 0,
      balanceSide: "debit",
      balanceAmount: 10000,
    });
    expectAccount(result.ledgerAccounts, "Sales", {
      debitTotal: 0,
      creditTotal: 10000,
      balanceSide: "credit",
      balanceAmount: 10000,
    });
  });

  it("posts a partnership revaluation entry through normal ledger rules", () => {
    const entry = coreEntry("core-partnership-revaluation", "partnership", [
      debit("Revaluation", 20000),
      credit("Machinery", 20000),
    ]);

    expect(isBalanced(entry)).toBe(true);

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Revaluation", {
      debitTotal: 20000,
      balanceSide: "debit",
      balanceAmount: 20000,
    });
    expectAccount(result.ledgerAccounts, "Machinery", {
      creditTotal: 20000,
      balanceSide: "credit",
      balanceAmount: 20000,
    });
  });

  it("posts a partnership profit appropriation style compound entry", () => {
    const entry = coreEntry("core-partnership-appropriation", "partnership", [
      debit("Profit And Loss Appropriation", 30000),
      credit("Partner Salary", 10000),
      credit("Partner Capital", 20000),
    ]);

    expect(isBalanced(entry)).toBe(true);

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Profit And Loss Appropriation", { debitTotal: 30000 });
    expectAccount(result.ledgerAccounts, "Partner Salary", { creditTotal: 10000 });
    expectAccount(result.ledgerAccounts, "Partner Capital", { creditTotal: 20000 });
    expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
  });

  it("posts a company share issue at premium compound entry", () => {
    const entry = coreEntry("core-company-share-premium", "company_accounts", [
      debit("Bank", 120000),
      credit("Share Capital", 100000),
      credit("Securities Premium", 20000),
    ]);

    expect(isBalanced(entry)).toBe(true);

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Bank", { debitTotal: 120000, balanceSide: "debit" });
    expectAccount(result.ledgerAccounts, "Share Capital", { creditTotal: 100000, balanceSide: "credit" });
    expectAccount(result.ledgerAccounts, "Securities Premium", { creditTotal: 20000, balanceSide: "credit" });
    expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
  });

  it("posts share call due and calls in arrears style entries", () => {
    const entries = [
      coreEntry("core-share-first-call-due", "company_accounts", [
        debit("Share First Call", 30000),
        credit("Share Capital", 30000),
      ]),
      coreEntry("core-share-first-call-receipt", "company_accounts", [
        debit("Bank", 27000),
        debit("Calls In Arrears", 3000),
        credit("Share First Call", 30000),
      ]),
    ];

    entries.forEach((entry) => expect(isBalanced(entry)).toBe(true));

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput(entries));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Share First Call", {
      debitTotal: 30000,
      creditTotal: 30000,
      balanceSide: "balanced",
      balanceAmount: 0,
    });
    expectAccount(result.ledgerAccounts, "Share Capital", { creditTotal: 30000 });
    expectAccount(result.ledgerAccounts, "Bank", { debitTotal: 27000 });
    expectAccount(result.ledgerAccounts, "Calls In Arrears", { debitTotal: 3000 });
  });

  it("posts share forfeiture and reissue style entries", () => {
    const entries = [
      coreEntry("core-share-forfeiture", "company_accounts", [
        debit("Share Capital", 10000),
        credit("Calls In Arrears", 3000),
        credit("Share Forfeiture", 7000),
      ]),
      coreEntry("core-share-reissue", "company_accounts", [
        debit("Bank", 8000),
        debit("Share Forfeiture", 2000),
        credit("Share Capital", 10000),
      ]),
    ];

    entries.forEach((entry) => expect(isBalanced(entry)).toBe(true));

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput(entries));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Share Capital", {
      debitTotal: 10000,
      creditTotal: 10000,
      balanceSide: "balanced",
    });
    expectAccount(result.ledgerAccounts, "Calls In Arrears", { creditTotal: 3000 });
    expectAccount(result.ledgerAccounts, "Share Forfeiture", {
      debitTotal: 2000,
      creditTotal: 7000,
      balanceSide: "credit",
      balanceAmount: 5000,
    });
    expectAccount(result.ledgerAccounts, "Bank", { debitTotal: 8000 });
  });

  it("posts a debenture issue at discount compound entry", () => {
    const entry = coreEntry("core-debenture-discount", "company_accounts", [
      debit("Bank", 95000),
      debit("Discount On Issue Of Debentures", 5000),
      credit("Debentures", 100000),
    ]);

    expect(isBalanced(entry)).toBe(true);

    const result = generateLedger(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(result.status).toBe("success");
    expectAccount(result.ledgerAccounts, "Bank", { debitTotal: 95000 });
    expectAccount(result.ledgerAccounts, "Discount On Issue Of Debentures", { debitTotal: 5000 });
    expectAccount(result.ledgerAccounts, "Debentures", { creditTotal: 100000 });
    expect(entryDebitTotal(entry)).toBe(entryCreditTotal(entry));
  });

  it("can also feed the existing trial balance engine with company share issue text", () => {
    const entry = coreEntry("core-company-share-premium-trial-balance", "company_accounts", [
      debit("Bank", 120000),
      credit("Share Capital", 100000),
      credit("Securities Premium", 20000),
    ]);

    const trialBalance = generateTrialBalance(coreJournalEntriesToExistingLedgerInput([entry]));

    expect(trialBalance.status).toBe("success");
    expect(trialBalance.agrees).toBe(true);
    expect(trialBalance.debitTotal).toBe(120000);
    expect(trialBalance.creditTotal).toBe(120000);
  });
});

function coreEntry(id: string, topic: JournalEntry["topic"], lines: JournalEntry["lines"]): JournalEntry {
  return { id, topic, lines };
}

function debit(accountName: string, amount: number): JournalEntry["lines"][number] {
  return {
    account: { name: accountName },
    side: "debit",
    amount,
  };
}

function credit(accountName: string, amount: number): JournalEntry["lines"][number] {
  return {
    account: { name: accountName },
    side: "credit",
    amount,
  };
}

function coreJournalEntriesToExistingLedgerInput(entries: JournalEntry[]): string {
  return entries.map(coreJournalEntryToExistingLedgerBlock).join("\n\n");
}

function coreJournalEntryToExistingLedgerBlock(entry: JournalEntry): string {
  return entry.lines
    .map((line) =>
      line.side === "debit"
        ? `${line.account.name} A/c Dr. Rs.${line.amount}`
        : `To ${line.account.name} A/c Rs.${line.amount}`,
    )
    .join("\n");
}

function isBalanced(entry: JournalEntry): boolean {
  return entryDebitTotal(entry) === entryCreditTotal(entry) && entryDebitTotal(entry) > 0;
}

function entryDebitTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amount, 0);
}

function entryCreditTotal(entry: JournalEntry): number {
  return entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amount, 0);
}

function expectAccount(
  accounts: LedgerAccount[],
  accountName: string,
  expected: Partial<Pick<LedgerAccount, "debitTotal" | "creditTotal" | "balanceSide" | "balanceAmount">>,
): LedgerAccount {
  const account = accounts.find((ledgerAccount) => ledgerAccount.account === accountName);
  expect(account).toBeDefined();
  expect(account).toMatchObject(expected);
  return account!;
}
