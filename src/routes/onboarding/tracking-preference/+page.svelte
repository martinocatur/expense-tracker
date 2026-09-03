<script lang="ts">
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import IconAvatar from '$lib/components/ui/IconAvatar.svelte';

	// Structural migration of initial-assets/static-templates/tracking_preference.html.
	// The original page has no custom JavaScript; the 'selected' state on the
	// first choice is hardcoded in the markup (no toggle behavior existed).
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Tracking Preference · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<TopBar backHref="/settings" brandHref="/home" />

	<div class="ds-content">
		<div class="text-center mt-3">
			<h1 class="ds-heading fs-3">How do you want to track your expenses?</h1>
			<p class="ds-subtitle mt-3">You can change this later in settings.</p>
		</div>

		<div class="d-grid gap-4 mt-5">
			<button type="button" class="ds-choice selected d-flex align-items-start gap-3">
				<IconAvatar icon="bi-wallet2" tint="ds-tint-solid-blue" class="mt-1" />
				<span class="flex-grow-1">
					<span class="d-block fw-bold fs-5 text-body">Expense Only</span>
					<span class="d-block ds-subtitle mt-1" style="font-size:0.95rem;">
						Simple tracking. Just log what you spend to see where your money goes without setting
						strict limits.
					</span>
				</span>
				<span class="ds-check-badge"><i class="bi bi-check-lg"></i></span>
			</button>

			<button type="button" class="ds-choice d-flex align-items-start gap-3">
				<IconAvatar icon="bi-pie-chart" tint="ds-tint-blue" class="mt-1" />
				<span class="flex-grow-1">
					<span class="d-block fw-bold fs-5 text-body">Expense + Budgeting</span>
					<span class="d-block ds-subtitle mt-1" style="font-size:0.95rem;">
						Track budgets and spending limits. Set goals for categories to actively manage your
						financial health.
					</span>
				</span>
			</button>
		</div>
	</div>
</main>
