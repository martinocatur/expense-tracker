<script lang="ts">
	// Structural migration of initial-assets/static-templates/settings.html.
	// The original page has no custom JavaScript (Bootstrap bundle only, unused here).
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Settings · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<header class="ds-topbar">
		<a href="/settings/profile" class="ds-icon-btn" aria-label="Profile"
			><i class="bi bi-person-circle fs-4" style="color:var(--ds-brand-primary);"></i></a
		>
		<span class="ds-topbar-title ds-topbar-title-accent fs-4">Settings</span>
		<!-- svelte-ignore a11y_invalid_attribute -->
		<a href="#" class="ds-icon-btn" aria-label="Notifications"
			><i class="bi bi-bell fs-4" style="color:var(--ds-brand-primary);"></i></a
		>
	</header>

	<div class="ds-content">
		<!-- Account -->
		<span class="ds-label ds-label-muted" style="font-size:0.85rem;">Account</span>
		<section class="ds-card mt-2 mb-4">
			<a href="/settings/profile" class="ds-row">
				<span class="ds-avatar ds-avatar-solid">JD</span>
				<div>
					<div class="fw-bold fs-4">Jane Doe</div>
					<div class="ds-row-value">jane.doe@example.com</div>
				</div>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-shield-fill-check fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Account &amp; Security</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
		</section>

		<!-- Preferences -->
		<span class="ds-label ds-label-muted" style="font-size:0.85rem;">Preferences</span>
		<section class="ds-card mt-2 mb-4">
			<a href="/settings/budget" class="ds-row">
				<i class="bi bi-pie-chart fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Budget Settings</span>
				<span class="ms-auto ds-row-value" style="color:var(--ds-success);">Active</span>
				<i class="bi bi-chevron-right fs-5 ds-row-value"></i>
			</a>
			<a href="/settings/categories" class="ds-row">
				<i class="bi bi-boxes fs-5" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Categories</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-cash-stack fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Currency</span>
				<span class="ms-auto ds-row-value fs-5">IDR - Rp</span>
				<i class="bi bi-chevron-right fs-5 ds-row-value"></i>
			</a>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-bell fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Notifications</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
		</section>

		<!-- Data & support -->
		<span class="ds-label ds-label-muted" style="font-size:0.85rem;">Data &amp; Support</span>
		<section class="ds-card mt-2 mb-2">
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-download fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Export Expenses</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-question-circle fs-4" style="color:var(--ds-brand-primary);"></i>
				<span class="ds-row-title fs-4">Help &amp; Support</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
			<!-- svelte-ignore a11y_invalid_attribute -->
			<a href="#" class="ds-row">
				<i class="bi bi-trash fs-4" style="color:var(--ds-error);"></i>
				<span class="ds-row-title fs-4">Delete Account</span>
				<i class="bi bi-chevron-right ms-auto fs-5 ds-row-value"></i>
			</a>
		</section>
	</div>

	<!-- Bottom navigation with raised Scan action -->
	<nav class="ds-bottomnav">
		<div class="d-flex justify-content-around align-items-end pb-2">
			<a href="/home" class="ds-nav-item">
				<i class="bi bi-house-door"></i>
				<span>Home</span>
			</a>
			<a href="/expenses" class="ds-nav-item">
				<i class="bi bi-wallet2"></i>
				<span>Expenses</span>
			</a>
			<a href="/scan" class="ds-nav-item" style="margin-top:-2.6rem;">
				<span class="ds-nav-scan"><i class="bi bi-camera"></i></span>
				<span>Scan</span>
			</a>
			<a href="/settings" class="ds-nav-item">
				<span class="ds-nav-pill d-flex flex-column align-items-center px-3 py-2">
					<i class="bi bi-gear-fill"></i>
					<span>Settings</span>
				</span>
			</a>
		</div>
	</nav>
</main>
