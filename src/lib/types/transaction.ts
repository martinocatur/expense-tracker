/**
 * Transaction shape inferred from the static markup
 * (.ds-transaction rows and their data-* attributes).
 * No backend contract exists yet (see docs/migration-inventory.md §12 / R6).
 */
export interface Transaction {
	id: string;
	/** Merchant/description shown as the row title. */
	name: string;
	/** Category label, e.g. 'Food & Beverage'. */
	category: string;
	/** ISO date (YYYY-MM-DD) used for grouping and range filtering. */
	date: string;
	/** Expense amount in Rupiah (positive number; display adds the minus sign). */
	amount: number;
	/** Bootstrap icon class, e.g. 'bi-egg-fried'. */
	icon: string;
	/** Design-system tint class, e.g. 'ds-tint-peach'. */
	tint: string;
}
