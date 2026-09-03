<script lang="ts">
	// Structural migration of initial-assets/static-templates/tracking_preference.html.
	// The original page has no custom JavaScript; the 'selected' state on the
	// first choice is hardcoded in the markup (no toggle behavior existed).
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Tracking Preference · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<header class="ds-topbar">
		<a href="/settings" class="ds-icon-btn" aria-label="Back"
			><i class="bi bi-arrow-left fs-4"></i></a
		>
		<a href="/home" class="ds-topbar-brand">ExpenseTracker</a>
		<span style="width:28px;"></span>
	</header>

	<div class="ds-content">
		<div class="text-center mt-3">
			<h1 class="ds-heading fs-3">How do you want to track your expenses?</h1>
			<p class="ds-subtitle mt-3">You can change this later in settings.</p>
		</div>

		<div class="d-grid gap-4 mt-5">
			<button type="button" class="ds-choice selected d-flex align-items-start gap-3">
				<span class="ds-icon-avatar ds-tint-solid-blue mt-1"><i class="bi bi-wallet2"></i></span>
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
				<span class="ds-icon-avatar ds-tint-blue mt-1"><i class="bi bi-pie-chart"></i></span>
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
