<script lang="ts">
	import TopBar from '$lib/components/layout/TopBar.svelte';

	// Structural migration of initial-assets/static-templates/budget_reset_date.html.
	// The original page has no custom JavaScript; the 'selected' state on the
	// "Custom" tile is hardcoded in the markup (no toggle behavior existed).
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Budget Setup · Reset Date · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<TopBar backHref="/onboarding/tracking-preference">
		{#snippet center()}
			<span class="ds-topbar-title-accent fw-bold fs-5">Budget Setup</span>
		{/snippet}
	</TopBar>

	<div class="ds-content">
		<div
			class="ds-wizard-progress mb-4"
			role="progressbar"
			aria-valuenow="33"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<div class="bar" style="width: 33%;"></div>
		</div>

		<div class="d-flex align-items-center gap-3 mt-4">
			<span class="ds-avatar ds-avatar-solid" style="width:56px;height:56px;"></span>
			<div>
				<div
					class="fw-bold text-primary ds-label mb-1"
					style="color:var(--ds-brand-primary)!important;"
				>
					Step 1 of 3
				</div>
				<div class="fs-4">When does your budget reset?</div>
			</div>
		</div>

		<p class="ds-subtitle mt-4 mb-4" style="font-size:1.05rem;">
			Select the day your income usually arrives. Your spending period will run until the day before
			this date every month.
		</p>

		<div class="row g-3 mt-1">
			<div class="col-6">
				<button type="button" class="ds-option py-4">
					<span class="ds-option-title fs-4 d-block">1st</span>
					<span class="ds-option-sub d-block mt-1">Start of month</span>
				</button>
			</div>
			<div class="col-6">
				<button type="button" class="ds-option py-4">
					<span class="ds-option-title fs-4 d-block">15th</span>
					<span class="ds-option-sub d-block mt-1">Mid-month</span>
				</button>
			</div>
			<div class="col-6">
				<button type="button" class="ds-option py-4">
					<span class="ds-option-title fs-4 d-block">Last Day</span>
					<span class="ds-option-sub d-block mt-1">End of month</span>
				</button>
			</div>
			<div class="col-6">
				<button type="button" class="ds-option selected py-4">
					<i class="bi bi-calendar-plus fs-3 d-block mb-2"></i>
					<span class="ds-option-title fs-4 d-block">Custom</span>
				</button>
			</div>
		</div>
	</div>
</main>
