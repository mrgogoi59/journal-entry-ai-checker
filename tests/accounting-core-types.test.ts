import { describe, expect, it } from "vitest";
import type { AccountRole, JournalEntry, TopicPack, TrialBalance } from "@/lib/accounting-core";

describe("accounting-core type fixtures", () => {
  it("represents a basic cash sale journal entry", () => {
    const entry: JournalEntry = {
      id: "basic-cash-sale",
      topic: "basic",
      transactionText: "Sold goods for cash Rs.5000",
      lines: [
        {
          account: { name: "Cash", class: "asset", role: "cash", normalBalance: "debit" },
          side: "debit",
          amount: 5000,
        },
        {
          account: { name: "Sales", class: "income", role: "sales", normalBalance: "credit" },
          side: "credit",
          amount: 5000,
        },
      ],
    };

    const debitTotal = total(entry, "debit");
    const creditTotal = total(entry, "credit");

    expect(entry.lines).toHaveLength(2);
    expect(debitTotal).toBe(creditTotal);
    expect(entry.topic).toBe("basic");
  });

  it("represents a partnership revaluation journal entry", () => {
    const entry: JournalEntry = {
      id: "partnership-revaluation-machinery",
      topic: "partnership",
      transactionText: "Machinery value reduced by Rs.10000",
      lines: [
        {
          account: { name: "Revaluation", class: "expense", role: "revaluation", normalBalance: "debit" },
          side: "debit",
          amount: 10000,
        },
        {
          account: { name: "Machinery", class: "asset", role: "asset", normalBalance: "debit" },
          side: "credit",
          amount: 10000,
        },
      ],
    };

    expect(entry.lines[0]?.account.role).toBe("revaluation");
    expect(entry.lines[1]?.account).toMatchObject({ role: "asset", class: "asset" });
    expect(total(entry, "debit")).toBe(total(entry, "credit"));
  });

  it("represents a company share issue at premium", () => {
    const entry: JournalEntry = {
      id: "company-share-issue-premium",
      topic: "company_accounts",
      transactionText: "Issued shares for bank at premium",
      lines: [
        {
          account: { name: "Bank", class: "asset", role: "bank", normalBalance: "debit" },
          side: "debit",
          amount: 120000,
        },
        {
          account: { name: "Share Capital", class: "equity", role: "share_capital", normalBalance: "credit" },
          side: "credit",
          amount: 100000,
        },
        {
          account: { name: "Securities Premium", class: "equity", role: "securities_premium", normalBalance: "credit" },
          side: "credit",
          amount: 20000,
        },
      ],
    };

    const roles = entry.lines.map((line) => line.account.role);

    expect(entry.lines.filter((line) => line.side === "debit")).toHaveLength(1);
    expect(entry.lines.filter((line) => line.side === "credit")).toHaveLength(2);
    expect(total(entry, "debit")).toBe(total(entry, "credit"));
    expect(roles).toEqual(expect.arrayContaining(["bank", "share_capital", "securities_premium"]));
  });

  it("represents debit and credit trial balance rows", () => {
    const trialBalance: TrialBalance = {
      rows: [
        {
          account: { name: "Cash", class: "asset", role: "cash", normalBalance: "debit" },
          debit: 5000,
          credit: 0,
        },
        {
          account: { name: "Sales", class: "income", role: "sales", normalBalance: "credit" },
          debit: 0,
          credit: 5000,
        },
      ],
      debitTotal: 5000,
      creditTotal: 5000,
      isBalanced: true,
    };

    expect(trialBalance.isBalanced).toBe(true);
    expect(trialBalance.debitTotal).toBe(trialBalance.creditTotal);
  });

  it("represents a Company Accounts topic pack", () => {
    const supportedAccountRoles: AccountRole[] = [
      "share_capital",
      "calls_in_arrears",
      "calls_in_advance",
      "share_forfeiture",
      "capital_reserve",
      "debenture",
    ];
    const topicPack: TopicPack = {
      id: "company_accounts",
      title: "Company Accounts",
      description: "Future company accounts rules and reports.",
      supportedAccountRoles,
      supportedScenarioTags: ["shares", "debentures"],
      reportTemplates: [{ id: "share-capital-schedule", title: "Share Capital Schedule" }],
    };

    expect(topicPack.title).toBe("Company Accounts");
    expect(topicPack.supportedAccountRoles).toContain("share_forfeiture");
  });
});

function total(entry: JournalEntry, side: "debit" | "credit"): number {
  return entry.lines.filter((line) => line.side === side).reduce((sum, line) => sum + line.amount, 0);
}
