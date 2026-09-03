<script lang="ts">
	import { formatRp } from '$lib/utils/currency';
	import type { Transaction } from '$lib/types/transaction';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import TransactionRow from '$lib/components/domain/TransactionRow.svelte';

	// Structural migration of initial-assets/static-templates/main_expenses_page.html
	// including the transaction filter behavior from js/transaction-filter.js.
	//
	// main_expenses_overbudget_state.html is the same screen in an over-budget
	// state (diff-verified: only the <title>, the Shopping legend row, and the
	// Shopping transaction amount differ). It is served by /expenses/overbudget
	// via the overBudget prop — see docs/migration-inventory.md §13 R2.
	//
	// Original behavior (transaction-filter.js):
	// - filters apply on form submit (typing does NOT live-filter), and the modal closes
	// - "Reset" (modal) and "Clear" (status bar) reset immediately
	// - funnel button highlights while any filter is active
	// - non-matching transactions and empty date groups are hidden; an empty
	//   state appears when nothing matches
	//
	// The Bootstrap JS modal is replaced with Svelte state per AGENTS.md
	// (Esc/backdrop close + body scroll lock; full focus trapping is deferred,
	// see docs/migration-inventory.md §13 R4).

	interface GroupedTransaction extends Transaction {
		/** Date-group key shared with the group header, e.g. 'sep14'. */
		group: string;
	}

	/** Over-budget state flag (main_expenses_overbudget_state.html variant). */
	let { overBudget = false }: { overBudget?: boolean } = $props();

	const transactions: GroupedTransaction[] = [
		{
			id: 'starbucks',
			group: 'sep14',
			name: 'Starbucks',
			category: 'Food & Beverage',
			date: '2026-09-14',
			amount: 85000,
			icon: 'bi-egg-fried',
			tint: 'ds-tint-lavender'
		},
		{
			id: 'grabride',
			group: 'sep13',
			name: 'GrabRide',
			category: 'Transport',
			date: '2026-09-13',
			amount: 45000,
			icon: 'bi-car-front',
			tint: 'ds-tint-gray'
		},
		{
			id: 'indomaret',
			group: 'sep12',
			category: 'Shopping',
			name: 'Indomaret',
			date: '2026-09-12',
			amount: 120000,
			icon: 'bi-bag',
			tint: 'ds-tint-peach'
		}
	];

	const groupDefs: { key: string; label: string }[] = [
		{ key: 'sep14', label: '14 Sep' },
		{ key: 'sep13', label: '13 Sep' },
		{ key: 'sep12', label: '12 Sep' }
	];

	let filterOpen = $state(false);
	// Draft values edited inside the modal; applied on submit (original behavior).
	let draft = $state({ search: '', category: '', from: '', to: '' });
	let applied = $state({ search: '', category: '', from: '', to: '' });

	const filtered = $derived(
		transactions.filter((tx) => {
			const search = applied.search.trim().toLowerCase();
			return (
				(!search || tx.name.toLowerCase().includes(search)) &&
				(!applied.category || tx.category === applied.category) &&
				(!applied.from || tx.date >= applied.from) &&
				(!applied.to || tx.date <= applied.to)
			);
		})
	);

	const groups = $derived(
		groupDefs
			.map((g) => ({ ...g, items: filtered.filter((tx) => tx.group === g.key) }))
			.filter((g) => g.items.length > 0)
	);

	const hasActiveFilters = $derived(
		Boolean(applied.search.trim() || applied.category || applied.from || applied.to)
	);

	function openFilter(): void {
		draft = { ...applied };
		filterOpen = true;
	}

	function applyFilter(event: SubmitEvent): void {
		event.preventDefault();
		applied = { ...draft };
		filterOpen = false;
	}

	function resetFilter(): void {
		draft = { search: '', category: '', from: '', to: '' };
		applied = { ...draft };
	}
</script>

<svelte:head>
	<title
		>{overBudget ? 'Expenses · Over Budget · ExpenseTracker' : 'Expenses · ExpenseTracker'}</title
	>
</svelte:head>

<main class="ds-shell">
	<TopBar brandHref="/home">
		{#snippet leading()}
			<a href="/settings/profile" class="ds-avatar ds-avatar-initials">UP</a>
		{/snippet}
		{#snippet trailing()}
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-icon-btn" aria-label="Notifications"
				><i class="bi bi-bell fs-4" style="color:var(--ds-brand-primary);"></i></a
			>
		{/snippet}
	</TopBar>

	<div class="ds-content">
		<!-- Period selector -->
		<div class="d-flex align-items-center justify-content-between px-2 mb-2">
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-period-nav fs-4" aria-label="Previous period"
				><i class="bi bi-chevron-left"></i></a
			>
			<div class="text-center">
				<div class="fs-4">Expenses</div>
				<div class="ds-row-value">15 Aug – 14 Sep</div>
			</div>
			<div class="d-flex align-items-center gap-1">
				<button
					type="button"
					class="ds-filter-btn"
					class:filter-active={hasActiveFilters}
					onclick={openFilter}
					aria-label="Filter transactions"
				>
					<i class="bi bi-funnel"></i>
				</button>
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class="ds-period-nav fs-4" aria-label="Next period"
					><i class="bi bi-chevron-right"></i></a
				>
			</div>
		</div>

		{#if hasActiveFilters}
			<div class="justify-content-center align-items-center gap-2 mb-3 d-flex">
				<span class="ds-caption">Filtered results</span>
				<button
					type="button"
					class="ds-caption bg-transparent border-0 p-0 text-decoration-underline"
					style="color:var(--ds-brand-primary);"
					onclick={resetFilter}>Clear</button
				>
			</div>
		{/if}

		<!-- Budget summary -->
		<section
			class="p-4"
			style="background: linear-gradient(160deg, #DEE0EC 0%, var(--ds-surface-muted) 100%); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-card);"
		>
			<span class="ds-label" style="color:var(--ds-text-secondary);">Total Expense</span>
			<div
				class="ds-figure-serif mt-1 mb-3"
				style="color:var(--ds-brand-primary);font-size:2.4rem;line-height:1.1;"
			>
				Rp 4.250.000
			</div>

			<div class="d-flex justify-content-between mb-1" style="color:var(--ds-text-secondary);">
				<span>Budget</span><span>Remaining</span>
			</div>
			<div class="d-flex justify-content-between align-items-baseline mb-3">
				<span class="ds-money">Rp 5.000.000</span>
				<span class="ds-money ds-money-success">Rp 750.000</span>
			</div>
			<ProgressBar value={85} class="mb-3" />

			<hr style="border-color:var(--ds-border-default);opacity:1;" />

			<div class="d-flex align-items-center gap-2 py-1">
				<span class="ds-legend-dot" style="background:var(--ds-brand-primary);"></span>
				<span style="color:var(--ds-text-secondary);">Food</span>
				<span class="ms-auto ds-money">Remaining Rp 300.000</span>
			</div>
			<div class="d-flex align-items-center gap-2 py-2">
				<span class="ds-legend-dot" style="background:#EF4444;"></span>
				<span style="color:var(--ds-text-secondary);">Shopping</span>
				{#if overBudget}
					<span class="ms-auto ds-money ds-money-error">
						<i class="bi bi-exclamation-circle me-1"></i>Over Rp 200.000
					</span>
				{:else}
					<span class="ms-auto ds-money">Remaining Rp 450.000</span>
				{/if}
			</div>
		</section>

		<!-- Category breakdown -->
		<h2 class="ds-section-title mt-5 mb-3">Category Breakdown</h2>
		<section class="ds-card p-4">
			<div class="d-flex align-items-center gap-4">
				<div
					class="ds-donut flex-shrink-0"
					role="img"
					aria-label="Spending by category: Food 35%, Shopping 25%, Education 20%, Other 20%"
				></div>
				<div class="flex-grow-1 d-grid gap-2">
					<div class="d-flex align-items-center gap-2">
						<span class="ds-legend-dot" style="background:var(--ds-brand-primary);"></span>
						<span>Food</span><span class="ms-auto ds-row-value">35%</span>
					</div>
					<div class="d-flex align-items-center gap-2">
						<span class="ds-legend-dot" style="background:#EF4444;"></span>
						<span>Shopping</span><span class="ms-auto ds-row-value">25%</span>
					</div>
					<div class="d-flex align-items-center gap-2">
						<span class="ds-legend-dot" style="background:var(--ds-warning);"></span>
						<span>Education</span><span class="ms-auto ds-row-value">20%</span>
					</div>
					<div class="d-flex align-items-center gap-2">
						<span class="ds-legend-dot" style="background:#6B7280;"></span>
						<span>Other</span><span class="ms-auto ds-row-value">20%</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Recent transactions -->
		<h2 class="ds-section-title mt-5 mb-3">Recent Transactions</h2>

		{#each groups as group (group.key)}
			<div class="ds-date-header mb-2">{group.label}</div>
			{#each group.items as tx (tx.id)}
				<TransactionRow
					name={tx.name}
					category={tx.category}
					amountText={'- ' + formatRp(tx.amount)}
					icon={tx.icon}
					tint={tx.tint}
					over={overBudget && tx.category === 'Shopping'}
					class="mb-3"
				/>
			{/each}
		{/each}

		{#if filtered.length === 0}
			<div class="text-center ds-caption py-4">No transactions match your filters.</div>
		{/if}
	</div>

	<!-- Bottom navigation -->
	<!-- Bottom navigation -->
	<BottomNav active="expenses" />
</main>

<!-- Transaction filter modal (Svelte state; replaces Bootstrap JS modal) -->
<Modal bind:open={filterOpen} title="Filter Transactions">
	<form novalidate onsubmit={applyFilter}>
		<div class="modal-body">
			<div class="mb-3">
				<label for="filterSearch" class="ds-label">Search</label>
				<div class="ds-input-icon">
					<i class="bi bi-search"></i>
					<input
						type="search"
						class="form-control ds-input"
						id="filterSearch"
						placeholder="Merchant name..."
						bind:value={draft.search}
					/>
				</div>
			</div>

			<div class="mb-3">
				<label for="filterCategory" class="ds-label">Category</label>
				<select class="form-select ds-input" id="filterCategory" bind:value={draft.category}>
					<option value="">All categories</option>
					<option>Food &amp; Beverage</option>
					<option>Transport</option>
					<option>Shopping</option>
					<option>Education</option>
				</select>
			</div>

			<div class="row g-3">
				<div class="col-6">
					<label for="filterFrom" class="ds-label">From</label>
					<input
						type="date"
						class="form-control ds-input"
						id="filterFrom"
						bind:value={draft.from}
					/>
				</div>
				<div class="col-6">
					<label for="filterTo" class="ds-label">To</label>
					<input type="date" class="form-control ds-input" id="filterTo" bind:value={draft.to} />
				</div>
			</div>
		</div>
		<div class="modal-footer border-0 pt-0">
			<button type="button" class="btn ds-btn-neutral-tint" onclick={resetFilter}>Reset</button>
			<button type="submit" class="btn ds-btn-primary">Apply</button>
		</div>
	</form>
</Modal>

<style>
	/* Page-local rule carried over from the original <style> block. */
	.ds-period-nav {
		color: var(--ds-text-primary);
		text-decoration: none;
	}
</style>
