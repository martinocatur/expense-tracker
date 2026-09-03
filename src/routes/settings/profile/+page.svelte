<script lang="ts">
	// Structural migration of initial-assets/static-templates/profile_settings.html.
	// The original page has no custom JavaScript; the form uses native submit
	// behavior (no action → page reload), which is preserved as-is.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Profile Settings · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<header class="ds-topbar">
		<a href="/settings" class="ds-icon-btn" aria-label="Back"
			><i class="bi bi-arrow-left fs-4"></i></a
		>
		<span class="ds-topbar-title fs-4">Profile Settings</span>
		<span style="width:28px;"></span>
	</header>

	<div class="ds-content">
		<!-- Avatar -->
		<div class="text-center mt-3">
			<span
				class="ds-avatar ds-avatar-profile d-inline-flex position-relative"
				style="width:128px;height:128px;"
			>
				<span class="ds-avatar-edit-badge"><i class="bi bi-pencil-fill"></i></span>
			</span>
			<p class="ds-subtitle mt-3 mb-0">Tap to change avatar</p>
		</div>

		<!-- Form card -->
		<section class="ds-card-lg ds-card p-4 mt-4">
			<form>
				<div class="mb-4">
					<label for="fullName" class="ds-label">Full Name</label>
					<div class="ds-input-icon">
						<i class="bi bi-person"></i>
						<input type="text" class="form-control ds-input" id="fullName" value="Jane Doe" />
					</div>
				</div>

				<div class="mb-4">
					<label for="email" class="ds-label">Email Address</label>
					<div class="ds-input-icon">
						<i class="bi bi-envelope"></i>
						<input
							type="email"
							class="form-control ds-input"
							id="email"
							value="jane.doe@example.com"
						/>
					</div>
				</div>

				<div class="mb-2">
					<label for="phone" class="ds-label">Phone Number</label>
					<div class="ds-input-icon">
						<i class="bi bi-telephone"></i>
						<input
							type="tel"
							class="form-control ds-input"
							id="phone"
							placeholder="e.g. +62 812 3456 7890"
						/>
					</div>
					<span class="ds-row-value d-block mt-2">(Optional)</span>
				</div>

				<div class="mt-4 mb-2">
					<label for="currency" class="ds-label">Default Currency</label>
					<div class="ds-input-icon ds-input-icon-right">
						<i class="bi bi-cash-stack"></i>
						<select class="form-select ds-input" id="currency">
							<option selected>IDR - Indonesian Rupiah (Rp)</option>
							<option>USD - US Dollar ($)</option>
							<option>EUR - Euro (€)</option>
						</select>
					</div>
					<p class="ds-row-value mt-2 mb-0">
						This currency will be used for all reports and summaries.
					</p>
				</div>
			</form>
		</section>

		<hr class="mt-5" style="border-color:var(--ds-border-default);opacity:1;" />

		<div class="d-grid gap-3 mt-4">
			<button type="button" class="btn ds-btn-primary w-100 fw-bold">Save Changes</button>
			<button
				type="button"
				class="btn ds-btn-danger-outline w-100 d-flex align-items-center justify-content-center gap-2"
			>
				<i class="bi bi-box-arrow-right"></i> Sign Out
			</button>
		</div>
	</div>
</main>
