/**
 * Category shape inferred from the static markup
 * (categories_management.html rows, budget_settings ICONS map).
 */
export interface Category {
	name: string;
	/** Bootstrap icon class, e.g. 'bi-cup-hot'. */
	icon: string;
	/** Design-system tint class, e.g. 'ds-tint-lavender'. */
	tint: string;
	/** System categories cannot be edited/removed (e.g. 'General'). */
	isSystem?: boolean;
}
