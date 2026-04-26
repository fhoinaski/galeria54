const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Format an integer price in centavos to a BRL string. 4600 → "R$ 46,00" */
export function formatCurrency(cents: number): string {
  return BRL.format(cents / 100);
}

/** Convert centavos to a decimal string for input display. 4600 → "46.00" */
export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Convert a user-typed decimal string to centavos. "46,00" | "46.00" → 4600 */
export function inputToCents(value: string): number {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const float = parseFloat(normalized);
  if (isNaN(float) || float < 0) return 0;
  return Math.round(float * 100);
}

/** Convert a float number to centavos. 46.0 → 4600 */
export function floatToCents(value: number): number {
  return Math.round(value * 100);
}
