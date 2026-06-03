const AMOUNT_PATTERN = /(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.\d+)?\s*k|[0-9][0-9,]*(?:\.\d+)?)\s*(?:\/-)?/i;
const GLOBAL_AMOUNT_PATTERN = /(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.\d+)?\s*k|[0-9][0-9,]*(?:\.\d+)?)\s*(?:\/-)?/gi;

export function extractAmount(value: string): number | null {
  const match = value.match(AMOUNT_PATTERN);
  if (!match) return null;

  return parseAmountToken(match[1]);
}

export function extractAmounts(value: string): number[] {
  return [...value.matchAll(GLOBAL_AMOUNT_PATTERN)]
    .map((match) => parseAmountToken(match[1]))
    .filter((amount): amount is number => amount !== null);
}

function parseAmountToken(value: string): number | null {
  const rawAmount = value.replace(/\s+/g, "").toLowerCase();
  const amount = rawAmount.endsWith("k")
    ? Number(rawAmount.slice(0, -1).replace(/,/g, "")) * 1000
    : Number(rawAmount.replace(/,/g, ""));

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function removeFirstAmount(value: string): string {
  return value.replace(AMOUNT_PATTERN, " ");
}
