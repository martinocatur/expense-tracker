<script lang="ts">
	// Structural migration of initial-assets/static-templates/main_expenses_overbudget_state.html.
	// The file was diff-verified to be main_expenses_page.html in an over-budget
	// state, so it renders the shared /expenses page with the overBudget prop
	// (see docs/migration-inventory.md §13 R2).
	import ExpensesPage from '../ExpensesPage.svelte';
</script>

<ExpensesPage overBudget />
