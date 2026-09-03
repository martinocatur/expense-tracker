/**
 * Indonesian Rupiah formatting helpers.
 *
 * Shared by the Add Expense and Budget Settings screens. Behavior is
 * intentionally preserved from the original inline scripts (see
 * docs/migration-inventory.md §6.2 / §6.3 and mitigation R7):
 * decimals are NOT supported — parseRp strips every non-digit character.
 */

/** Format a number as an Indonesian Rupiah string, e.g. 1500000 → 'Rp 1.500.000'. */
export function formatRp(n: number): string {
	return 'Rp ' + n.toLocaleString('id-ID');
}

/**
 * Parse a Rupiah string to a number by stripping all non-digit characters.
 * e.g. 'Rp 1.500.000' → 1500000, 'abc' → 0.
 * Decimals are intentionally unsupported (existing behavior).
 */
export function parseRp(s: string): number {
	return Number(String(s).replace(/[^\d]/g, '')) || 0;
}
