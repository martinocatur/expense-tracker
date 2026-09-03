<script lang="ts">
	import TopBar from '$lib/components/layout/TopBar.svelte';

	// Structural migration of initial-assets/static-templates/expense_result.html.
	// The original page has no custom JavaScript (Bootstrap bundle only, unused here);
	// the Edit/Delete buttons are decorative placeholders.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Expense Saved · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<TopBar backHref="/expenses" brandHref="/home">
		{#snippet trailing()}
			<div class="d-flex align-items-center gap-3">
				<a href="/settings" class="ds-icon-btn" aria-label="Notifications"
					><i class="bi bi-bell fs-5" style="color:var(--ds-brand-primary);"></i></a
				>
				<a href="/settings/profile" class="ds-avatar ds-avatar-initials" aria-label="Profile"
					><i class="bi bi-person fs-5"></i></a
				>
			</div>
		{/snippet}
	</TopBar>

	<div class="ds-content" style="padding-bottom: 7rem;">
		<div class="text-center mt-3">
			<div class="ds-success-circle mx-auto">
				<span class="inner"><i class="bi bi-check-lg"></i></span>
			</div>
			<h1 class="fs-3 mt-4 mb-2">Expense Saved</h1>
			<p class="ds-subtitle">14 Aug 2026</p>
		</div>

		<section
			class="text-center p-4 mt-3"
			style="background: linear-gradient(160deg, #DEE0EC 0%, var(--ds-surface-muted) 100%); border-radius: var(--ds-radius-lg); box-shadow: var(--ds-shadow-card);"
		>
			<span class="ds-label" style="color:var(--ds-text-secondary);">Total Amount</span>
			<div class="ds-money ds-money-error ds-amount-display-xl mt-1">Rp 350.000</div>
		</section>

		<section class="ds-card mt-4">
			<div class="ds-row">
				<i class="bi bi-shop fs-4"></i>
				<span class="ds-row-value fs-5">Merchant</span>
				<span class="ms-auto fs-5">Example Store</span>
			</div>
			<div class="ds-row">
				<i class="bi bi-shapes fs-5" style="color:var(--ds-text-secondary);"></i>
				<span class="ds-row-value fs-5">Category</span>
				<span class="ms-auto ds-badge-category"><i class="bi bi-cup-hot"></i> Konsumsi</span>
			</div>
			<div class="ds-row flex-column align-items-stretch gap-2">
				<div class="d-flex align-items-center gap-2">
					<span class="ds-legend-dot" style="background:#9CA3AF;width:8px;height:8px;"></span>
					<span class="fw-bold fs-5">Items</span>
				</div>
				<div class="d-flex justify-content-between py-1">
					<span>Indomie</span><span class="ds-money">Rp 30.000</span>
				</div>
				<div class="d-flex justify-content-between py-1">
					<span>Milk</span><span class="ds-money">Rp 50.000</span>
				</div>
				<div class="d-flex justify-content-between py-1">
					<span>Vegetables</span><span class="ds-money">Rp 120.000</span>
				</div>
				<div class="d-flex justify-content-between py-1">
					<span>Other</span><span class="ds-money">Rp 150.000</span>
				</div>
			</div>
		</section>

		<div class="d-flex gap-3 mt-4">
			<button
				type="button"
				class="btn ds-btn-neutral-tint w-50 d-flex align-items-center justify-content-center gap-2"
			>
				<i class="bi bi-pencil-fill"></i> Edit
			</button>
			<button
				type="button"
				class="btn ds-btn-danger-tint w-50 d-flex align-items-center justify-content-center gap-2"
			>
				<i class="bi bi-trash-fill"></i> Delete
			</button>
		</div>
	</div>
</main>
