<script lang="ts">
	// /expenses — normal budget state. The page body lives in ExpensesPage.svelte
	// so it can be shared with /expenses/overbudget (route components may only
	// receive data/form props, so the overBudget prop lives on this component).
	import ExpensesPage from './ExpensesPage.svelte';
</script>

<ExpensesPage />
