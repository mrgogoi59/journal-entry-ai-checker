const AMOUNT_PATTERN = /(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.\d+)?\s*k|[0-9][0-9,]*(?:\.\d+)?)\s*(?:\/-)?/i;

export function extractAmount(value: string): number | null {
  const match = value.match(AMOUNT_PATTERN);
  if (!match) return null;

  const rawAmount = match[1].replace(/\s+/g, "").toLowerCase();
  const amount = rawAmount.endsWith("k")
    ? Number(rawAmount.slice(0, -1).replace(/,/g, "")) * 1000
    : Number(rawAmount.replace(/,/g, ""));

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function removeFirstAmount(value: string): string {
  return value.replace(AMOUNT_PATTERN, " ");
}
