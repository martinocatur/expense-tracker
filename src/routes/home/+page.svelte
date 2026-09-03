<script lang="ts">
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import BottomNav from '$lib/components/layout/BottomNav.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import TransactionRow from '$lib/components/domain/TransactionRow.svelte';

	// Structural migration of initial-assets/static-templates/home.html.
	// No page JavaScript existed in the original (Bootstrap bundle only, unused here).
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Home · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<TopBar brandHref="/home">
		{#snippet leading()}
			<a href="/settings/profile" class="ds-avatar ds-avatar-photo" aria-label="Profile"></a>
		{/snippet}
		{#snippet trailing()}
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-icon-btn" aria-label="Notifications"
				><i class="bi bi-bell fs-4" style="color:var(--ds-brand-primary);"></i></a
			>
		{/snippet}
	</TopBar>

	<div class="ds-content">
		<!-- Monthly budget hero (over-budget state) -->
		<section
			class="p-4"
			style="background:#D9DAE3;border-radius:var(--ds-radius-lg);box-shadow:var(--ds-shadow-card);"
		>
			<div class="d-flex align-items-start justify-content-between">
				<h2 class="fs-3 mb-3">Monthly Budget</h2>
			</div>
			<div class="d-flex align-items-end justify-content-between mb-2">
				<span style="color:var(--ds-text-secondary);font-size:1rem;">Spent</span>
				<span class="ds-money" style="font-size:2.4rem;font-weight:800;line-height:1;"
					>Rp 5.250.000</span
				>
			</div>
			<ProgressBar value={100} danger class="mb-3" />
			<div class="d-flex align-items-center justify-content-between">
				<span style="color:var(--ds-text-secondary);">Limit: Rp 5.000.000</span>
				<span class="ds-badge-error">Overbudget</span>
			</div>
		</section>

		<!-- Category alerts -->
		<h2 class="ds-section-title mt-4 mb-3">Category Alerts</h2>
		<div class="ds-alert-banner">
			<span class="icon-circle"><i class="bi bi-exclamation-triangle-fill"></i></span>
			<div>
				<div class="fw-bold" style="color:var(--ds-error-deep);">Shopping</div>
				<div class="ds-caption" style="color:var(--ds-error-deep);">Overbudget</div>
			</div>
			<span class="ms-auto fw-bold fs-6" style="color:var(--ds-error);">Over Rp 200.000</span>
		</div>

		<!-- Quick actions -->
		<div class="d-grid gap-3 mt-4">
			<a href="/scan" class="ds-btn-action ds-btn-action-primary">
				<i class="bi bi-camera"></i>
				Scan Receipt
			</a>
			<a href="/expenses/add" class="ds-btn-action ds-btn-action-secondary">
				<i class="bi bi-plus-circle"></i>
				Add Expense
			</a>
		</div>

		<!-- Recent activity -->
		<div class="d-flex align-items-center justify-content-between mt-5 mb-3">
			<h2 class="ds-section-title mb-0">Recent Activity</h2>
			<a href="/expenses" class="fw-semibold text-decoration-none">See All</a>
		</div>

		<div class="d-grid gap-3">
			<TransactionRow
				name="Starbucks"
				category="Food & Beverage"
				amountText="-Rp 85.000"
				icon="bi-egg-fried"
				tint="ds-tint-peach"
			/>
			<TransactionRow
				name="GrabRide"
				category="Transport"
				amountText="-Rp 45.000"
				icon="bi-car-front"
				tint="ds-tint-gray"
			/>
		</div>
	</div>

	<!-- Bottom navigation -->
	<BottomNav active="home" />
</main>
