import { parseJournalEntry } from "./journal-parser";

export type LedgerSide = "debit" | "credit";

export type LedgerJournalLine = {
  account: string;
  side: LedgerSide;
  amount: number;
};

export type LedgerPosting = {
  side: LedgerSide;
  account: string;
  reference: string;
  amount: number;
  sourceEntryIndex: number;
};

export type LedgerAccount = {
  account: string;
  debitPostings: LedgerPosting[];
  creditPostings: LedgerPosting[];
  debitTotal: number;
  creditTotal: number;
  balanceSide: LedgerSide | "balanced";
  balanceAmount: number;
};

export type LedgerResult = {
  status: "success" | "invalid";
  parsedEntries: LedgerJournalLine[][];
  ledgerAccounts: LedgerAccount[];
  errors: string[];
  postingLogic: string[];
  commonMistakes: string[];
};

const maxLedgerEntries = 10;

const commonMistakes = [
  "Do not post the debit account on the credit side.",
  "In ledger, debit-side postings usually start with To.",
  "Credit-side postings usually start with By.",
  "Ledger posting does not create a new transaction; it records journal entries account-wise.",
  "Balance of an account is the difference between debit total and credit total.",
  "Do not confuse journal entry format with ledger format.",
];

export function generateLedger(input: string): LedgerResult {
  const blocks = splitJournalEntryBlocks(input);

  if (blocks.length === 0) {
    return invalidResult(["I could not read the journal entry format.", ...formatSuggestions()]);
  }

  if (blocks.length > maxLedgerEntries) {
    return invalidResult(["For this beta version, please enter up to 10 journal entries at a time."]);
  }

  const parsedEntries: LedgerJournalLine[][] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const parsed = parseJournalEntry(block);
    const entryNumber = index + 1;

    if (parsed.errors.length > 0) {
      errors.push(`I could not read the journal entry format in entry number ${entryNumber}.`);
      errors.push(...formatSuggestions());
      return;
    }

    if (!parsed.isBalanced) {
      errors.push(`Debit and credit totals do not match in entry number ${entryNumber}.`);
      return;
    }

    parsedEntries.push([
      ...parsed.debits.map((line) => ({ account: ledgerAccountName(line), side: "debit" as const, amount: line.amount })),
      ...parsed.credits.map((line) => ({ account: ledgerAccountName(line), side: "credit" as const, amount: line.amount })),
    ]);
  });

  if (errors.length > 0) {
    return invalidResult(errors);
  }

  const postings = parsedEntries.flatMap((entry, index) => buildPostings(entry, index + 1));
  const ledgerAccounts = buildLedgerAccounts(postings);

  return {
    status: "success",
    parsedEntries,
    ledgerAccounts,
    errors: [],
    postingLogic: buildPostingLogic(parsedEntries),
    commonMistakes,
  };
}

function splitJournalEntryBlocks(input: string): string[] {
  return input
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function ledgerAccountName(line: { account: string; rawAccount?: string }): string {
  if (!line.rawAccount) return line.account;
  return titleCaseAccount(line.rawAccount.replace(/\s+a\/c$/i, "").trim());
}

function titleCaseAccount(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (["GST", "CGST", "SGST", "IGST", "UPI", "GPAY", "NEFT"].includes(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function buildPostings(entry: LedgerJournalLine[], sourceEntryIndex: number): LedgerPosting[] {
  const debits = entry.filter((line) => line.side === "debit");
  const credits = entry.filter((line) => line.side === "credit");

  if (debits.length === 1 && credits.length === 1) {
    return [
      debitPosting(debits[0], credits[0].account, sourceEntryIndex),
      creditPosting(credits[0], debits[0].account, sourceEntryIndex),
    ];
  }

  if (debits.length > 1 && credits.length === 1) {
    return [
      ...debits.map((debit) => debitPosting(debit, credits[0].account, sourceEntryIndex)),
      ...debits.map((debit) => creditPostingForAmount(credits[0], debit.account, debit.amount, sourceEntryIndex)),
    ];
  }

  if (debits.length === 1 && credits.length > 1) {
    return [
      ...credits.map((credit) => debitPostingForAmount(debits[0], credit.account, credit.amount, sourceEntryIndex)),
      ...credits.map((credit) => creditPosting(credit, debits[0].account, sourceEntryIndex)),
    ];
  }

  return [
    ...debits.map((debit) => debitPosting(debit, "Sundries", sourceEntryIndex)),
    ...credits.map((credit) => creditPosting(credit, "Sundries", sourceEntryIndex)),
  ];
}

function debitPosting(line: LedgerJournalLine, referenceAccount: string, sourceEntryIndex: number): LedgerPosting {
  return debitPostingForAmount(line, referenceAccount, line.amount, sourceEntryIndex);
}

function creditPosting(line: LedgerJournalLine, referenceAccount: string, sourceEntryIndex: number): LedgerPosting {
  return creditPostingForAmount(line, referenceAccount, line.amount, sourceEntryIndex);
}

function debitPostingForAmount(
  line: LedgerJournalLine,
  referenceAccount: string,
  amount: number,
  sourceEntryIndex: number,
): LedgerPosting {
  return {
    side: "debit",
    account: line.account,
    reference: `To ${referenceAccount} A/c`,
    amount,
    sourceEntryIndex,
  };
}

function creditPostingForAmount(
  line: LedgerJournalLine,
  referenceAccount: string,
  amount: number,
  sourceEntryIndex: number,
): LedgerPosting {
  return {
    side: "credit",
    account: line.account,
    reference: `By ${referenceAccount} A/c`,
    amount,
    sourceEntryIndex,
  };
}

function buildLedgerAccounts(postings: LedgerPosting[]): LedgerAccount[] {
  const accounts = new Map<string, LedgerPosting[]>();

  postings.forEach((posting) => {
    accounts.set(posting.account, [...(accounts.get(posting.account) ?? []), posting]);
  });

  return Array.from(accounts.entries())
    .map(([account, accountPostings]) => {
      const debitPostings = accountPostings.filter((posting) => posting.side === "debit");
      const creditPostings = accountPostings.filter((posting) => posting.side === "credit");
      const debitTotal = sum(debitPostings);
      const creditTotal = sum(creditPostings);
      const balanceAmount = Math.abs(debitTotal - creditTotal);
      const balanceSide: LedgerAccount["balanceSide"] =
        debitTotal === creditTotal ? "balanced" : debitTotal > creditTotal ? "debit" : "credit";

      return {
        account,
        debitPostings,
        creditPostings,
        debitTotal,
        creditTotal,
        balanceSide,
        balanceAmount,
      };
    })
    .sort((a, b) => a.account.localeCompare(b.account));
}

function buildPostingLogic(parsedEntries: LedgerJournalLine[][]): string[] {
  return parsedEntries.flatMap((entry, index) => {
    const entryNumber = index + 1;
    const debits = entry.filter((line) => line.side === "debit");
    const credits = entry.filter((line) => line.side === "credit");

    if (debits.length > 1 && credits.length === 1) {
      return [
        `Entry ${entryNumber}: ${credits[0].account} A/c was credited for the total amount. Since ${joinAccounts(
          debits,
        )} were debited, ${credits[0].account} A/c shows separate credit-side postings for each debit account.`,
      ];
    }

    if (debits.length === 1 && credits.length > 1) {
      return [
        `Entry ${entryNumber}: ${debits[0].account} A/c was debited for the total amount. Since ${joinAccounts(
          credits,
        )} were credited, ${debits[0].account} A/c shows separate debit-side postings for each credit account.`,
      ];
    }

    return [
      ...debits.map(
        (debit) =>
          `Entry ${entryNumber}: ${debit.account} A/c was debited in the journal, so it is posted on the debit side of ${debit.account} A/c.`,
      ),
      ...credits.map(
        (credit) =>
          `Entry ${entryNumber}: ${credit.account} A/c was credited in the journal, so it is posted on the credit side of ${credit.account} A/c.`,
      ),
    ];
  });
}

function joinAccounts(lines: LedgerJournalLine[]): string {
  return lines.map((line) => `${line.account} A/c`).join(" and ");
}

function sum(postings: LedgerPosting[]): number {
  return postings.reduce((total, posting) => total + posting.amount, 0);
}

function invalidResult(errors: string[]): LedgerResult {
  return {
    status: "invalid",
    parsedEntries: [],
    ledgerAccounts: [],
    errors,
    postingLogic: [],
    commonMistakes,
  };
}

function formatSuggestions(): string[] {
  return [
    "Use Dr. for debit lines.",
    "Use To for credit lines.",
    "Write amount on each line.",
    "Enter one journal entry per block.",
    "Example supported format: Purchases A/c Dr. Rs.10000 / To Cash A/c Rs.10000",
  ];
}
