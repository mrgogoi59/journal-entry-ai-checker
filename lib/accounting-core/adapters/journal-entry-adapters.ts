import type {
  AccountClass,
  AccountingMetadata,
  AccountingTopic,
  AccountRef,
  AccountRole,
  JournalEntry as CoreJournalEntry,
  JournalLine as CoreJournalLine,
  NormalBalance,
} from "../types";
import type {
  CorrectJournalEntry,
  JournalLine as ExistingJournalLine,
  ParsedJournalEntry,
} from "../../types";

export type JournalEntryAdapterOptions = {
  id?: string;
  idPrefix?: string;
  index?: number;
  topic?: AccountingTopic;
  transactionText?: string;
  narration?: string;
  explanation?: string;
  sourceText?: string;
  metadata?: AccountingMetadata;
};

type ExistingJournalEntry = CorrectJournalEntry | ParsedJournalEntry;

export function correctJournalEntryToCoreJournalEntry(
  entry: CorrectJournalEntry,
  options: JournalEntryAdapterOptions = {},
): CoreJournalEntry {
  return buildCoreJournalEntry(
    [...entry.debits.map((line) => toCoreJournalLine(line, "debit")), ...entry.credits.map((line) => toCoreJournalLine(line, "credit"))],
    options,
  );
}

export function parsedJournalEntryToCoreJournalEntry(
  entry: ParsedJournalEntry,
  options: JournalEntryAdapterOptions = {},
): CoreJournalEntry {
  return buildCoreJournalEntry(
    [...entry.debits.map((line) => toCoreJournalLine(line, "debit")), ...entry.credits.map((line) => toCoreJournalLine(line, "credit"))],
    {
      ...options,
      metadata: {
        ...options.metadata,
        isBalanced: entry.isBalanced,
        debitTotal: entry.debitTotal,
        creditTotal: entry.creditTotal,
        errorCount: entry.errors.length,
      },
    },
  );
}

export function journalEntriesToCoreJournalEntries(
  entries: ExistingJournalEntry[],
  options: Omit<JournalEntryAdapterOptions, "id" | "index"> = {},
): CoreJournalEntry[] {
  return entries.map((entry, index) => {
    const entryOptions = { ...options, index };
    return isParsedJournalEntry(entry)
      ? parsedJournalEntryToCoreJournalEntry(entry, entryOptions)
      : correctJournalEntryToCoreJournalEntry(entry, entryOptions);
  });
}

export function inferAccountRef(accountName: string): AccountRef {
  const role = inferAccountRole(accountName);
  const accountClass = inferAccountClass(accountName, role);
  const normalBalance = inferNormalBalance(accountClass);

  return {
    name: accountName,
    ...(accountClass ? { class: accountClass } : {}),
    ...(role ? { role } : {}),
    ...(normalBalance ? { normalBalance } : {}),
  };
}

export function inferAccountRole(accountName: string): AccountRole | undefined {
  const normalizedName = normalizeAccountNameForInference(accountName);

  if (["cash"].includes(normalizedName)) return "cash";
  if (["bank"].includes(normalizedName)) return "bank";
  if (["sales", "sale"].includes(normalizedName)) return "sales";
  if (["purchases", "purchase"].includes(normalizedName)) return "purchases";
  if (["capital", "owner capital", "proprietor capital"].includes(normalizedName)) return "capital";
  if (["drawings", "drawing"].includes(normalizedName)) return "drawings";
  if (["debtor", "debtors", "customer", "customers", "raju", "mohan"].includes(normalizedName)) return "debtor";
  if (["creditor", "creditors", "supplier", "suppliers", "amit", "ram"].includes(normalizedName)) return "creditor";
  if (["input gst", "gst input", "input cgst", "input sgst", "input igst"].includes(normalizedName)) return "input_gst";
  if (["output gst", "gst output", "output cgst", "output sgst", "output igst"].includes(normalizedName)) {
    return "output_gst";
  }
  if (normalizedName.includes("depreciation")) return "depreciation";
  if (normalizedName.includes("provision")) return "provision";
  if (normalizedName.includes("bad debt")) return "bad_debts";
  if (normalizedName.includes("outstanding")) return "outstanding_expense";
  if (normalizedName.includes("prepaid")) return "prepaid_expense";
  if (normalizedName.includes("accrued")) return "accrued_income";
  if (normalizedName.includes("received in advance")) return "income_received_in_advance";
  if (normalizedName.includes("partner capital")) return "partner_capital";
  if (normalizedName.includes("partner current")) return "partner_current";
  if (normalizedName.includes("partner drawings")) return "partner_drawings";
  if (normalizedName.includes("interest on capital")) return "interest_on_capital";
  if (normalizedName.includes("interest on drawings")) return "interest_on_drawings";
  if (normalizedName.includes("partner salary")) return "partner_salary";
  if (normalizedName.includes("partner commission")) return "partner_commission";
  if (normalizedName.includes("profit and loss appropriation")) return "profit_and_loss_appropriation";
  if (normalizedName === "revaluation") return "revaluation";
  if (normalizedName === "goodwill") return "goodwill";
  if (normalizedName === "realisation" || normalizedName === "realization") return "realisation";
  if (normalizedName === "share capital") return "share_capital";
  if (normalizedName === "share application") return "share_application";
  if (normalizedName === "share allotment") return "share_allotment";
  if (normalizedName.includes("share call")) return "share_call";
  if (normalizedName === "calls in arrears" || normalizedName === "call in arrears") return "calls_in_arrears";
  if (normalizedName === "calls in advance" || normalizedName === "call in advance") return "calls_in_advance";
  if (normalizedName === "share forfeiture") return "share_forfeiture";
  if (normalizedName === "securities premium" || normalizedName === "security premium") return "securities_premium";
  if (normalizedName === "capital reserve") return "capital_reserve";
  if (normalizedName === "debenture" || normalizedName === "debentures") return "debenture";
  if (normalizedName === "debenture interest" || normalizedName === "interest on debentures") {
    return "debenture_interest";
  }
  if (normalizedName === "discount on issue of debentures") return "discount_on_issue_of_debentures";
  if (normalizedName === "premium on redemption of debentures") return "premium_on_redemption_of_debentures";
  if (["machinery", "furniture", "building", "land", "vehicle", "computer", "equipment"].includes(normalizedName)) {
    return "asset";
  }
  if (["loan", "bank loan", "creditors loan"].includes(normalizedName)) return "liability";
  if (normalizedName.includes("income") || normalizedName.includes("commission") || normalizedName.includes("interest")) {
    return "income";
  }
  if (normalizedName.includes("expense") || normalizedName.includes("salary") || normalizedName.includes("rent")) {
    return "expense";
  }

  return undefined;
}

export function inferAccountClass(
  accountName: string,
  role: AccountRole | undefined = inferAccountRole(accountName),
): AccountClass | undefined {
  if (!role) return undefined;

  if (role === "provision") {
    const normalizedName = normalizeAccountNameForInference(accountName);
    return normalizedName.includes("debtors") || normalizedName.includes("doubtful") ? "contra_asset" : "liability";
  }

  if (
    [
      "cash",
      "bank",
      "debtor",
      "input_gst",
      "asset",
      "goodwill",
      "prepaid_expense",
      "accrued_income",
      "share_allotment",
      "calls_in_arrears",
    ].includes(role)
  ) {
    return "asset";
  }
  if (
    [
      "creditor",
      "liability",
      "output_gst",
      "outstanding_expense",
      "income_received_in_advance",
      "share_application",
      "calls_in_advance",
      "debenture",
    ].includes(role)
  ) {
    return "liability";
  }
  if (
    [
      "sales",
      "income",
      "interest_on_drawings",
    ].includes(role)
  ) {
    return "income";
  }
  if (
    [
      "purchases",
      "expense",
      "depreciation",
      "bad_debts",
      "interest_on_capital",
      "partner_salary",
      "partner_commission",
      "debenture_interest",
      "discount_on_issue_of_debentures",
    ].includes(role)
  ) {
    return "expense";
  }
  if (
    [
      "capital",
      "partner_capital",
      "partner_current",
      "share_capital",
      "share_forfeiture",
      "securities_premium",
      "capital_reserve",
      "premium_on_redemption_of_debentures",
    ].includes(role)
  ) {
    return "equity";
  }
  if (["drawings", "partner_drawings"].includes(role)) return "contra_equity";
  if (["revaluation", "realisation", "profit_and_loss_appropriation"].includes(role)) return "memorandum";

  return undefined;
}

export function inferNormalBalance(accountClass?: AccountClass): NormalBalance | undefined {
  if (!accountClass) return undefined;

  if (["asset", "expense", "contra_liability", "contra_equity"].includes(accountClass)) return "debit";
  if (["liability", "equity", "income", "contra_asset"].includes(accountClass)) return "credit";

  return undefined;
}

function buildCoreJournalEntry(
  lines: CoreJournalLine[],
  options: JournalEntryAdapterOptions,
): CoreJournalEntry {
  return {
    id: options.id ?? `${options.idPrefix ?? "core-journal"}-${(options.index ?? 0) + 1}`,
    topic: options.topic ?? "basic",
    ...(options.transactionText ? { transactionText: options.transactionText } : {}),
    lines,
    ...(options.narration ? { narration: options.narration } : {}),
    ...(options.explanation ? { explanation: options.explanation } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {}),
  };
}

function toCoreJournalLine(line: ExistingJournalLine, side: "debit" | "credit"): CoreJournalLine {
  return {
    account: inferAccountRef(line.account),
    side,
    amount: line.amount,
    ...(line.rawAccount ? { sourceText: line.rawAccount } : {}),
    ...(line.partyRole ? { metadata: { partyRole: line.partyRole } } : {}),
  };
}

function isParsedJournalEntry(entry: ExistingJournalEntry): entry is ParsedJournalEntry {
  return "isBalanced" in entry && "debitTotal" in entry && "creditTotal" in entry && "errors" in entry;
}

function normalizeAccountNameForInference(accountName: string): string {
  return accountName
    .replace(/\ba\/c\b/gi, " ")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
