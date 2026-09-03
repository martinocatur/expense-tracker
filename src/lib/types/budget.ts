import type { Category } from './category';

/** A per-category spending limit, e.g. { category, amount: 1500000 }. */
export interface CategoryBudget {
	category: Category;
	/** Amount in Rupiah. */
	amount: number;
}

/** Filter state for the transaction filter modal (transaction-filter.js behavior). */
export interface FilterState {
	search: string;
	category: string;
	/** ISO date (YYYY-MM-DD) lower bound, '' when unset. */
	from: string;
	/** ISO date (YYYY-MM-DD) upper bound, '' when unset. */
	to: string;
}

/** Whether any filter field is active (drives status banner + funnel highlight). */
export function hasActiveFilters(f: FilterState): boolean {
	return Boolean(f.search || f.category || f.from || f.to);
}
