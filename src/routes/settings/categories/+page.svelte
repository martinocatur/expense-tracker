<script lang="ts">
	import type { Category } from '$lib/types/category';

	// Structural migration of initial-assets/static-templates/categories_management.html.
	// The original page has no custom JavaScript (Bootstrap bundle only, unused here);
	// the search input and Add Category button are decorative placeholders.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).

	// Standard rows below the fixed "General" system row (identical markup in the
	// original — rendered via each block, output identical).
	const categories: Category[] = [
		{ name: 'Food & Beverage', icon: 'bi-cup-hot', tint: 'ds-tint-lavender' },
		{ name: 'Transportation', icon: 'bi-car-front', tint: 'ds-tint-lavender' },
		{ name: 'Shopping', icon: 'bi-bag', tint: 'ds-tint-lavender' },
		{ name: 'Education', icon: 'bi-mortarboard', tint: 'ds-tint-lavender' },
		{ name: 'Health', icon: 'bi-heart-pulse', tint: 'ds-tint-lavender' },
		{ name: 'Entertainment', icon: 'bi-film', tint: 'ds-tint-lavender' },
		{ name: 'Bills', icon: 'bi-receipt', tint: 'ds-tint-lavender' },
		{ name: 'Family', icon: 'bi-people', tint: 'ds-tint-lavender' },
		{ name: 'Travel', icon: 'bi-airplane', tint: 'ds-tint-lavender' }
	];
</script>

<svelte:head>
	<title>Categories · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<header class="ds-topbar">
		<a href="/settings" class="ds-icon-btn" aria-label="Back"
			><i class="bi bi-arrow-left fs-4"></i></a
		>
		<span class="ds-topbar-title ds-topbar-title-accent fs-4">Categories</span>
		<span style="width:28px;"></span>
	</header>

	<div class="ds-content" style="padding-bottom: 7.5rem;">
		<!-- Search -->
		<div class="ds-input-icon mb-4">
			<i class="bi bi-search"></i>
			<input
				type="search"
				class="form-control ds-input"
				placeholder="Search categories..."
				aria-label="Search categories"
			/>
		</div>

		<!-- Category list -->
		<section class="ds-card">
			<div class="ds-row">
				<span class="ds-icon-avatar ds-tint-lavender"><i class="bi bi-shapes"></i></span>
				<span class="ds-row-title fs-4">General</span>
				<span class="ds-badge-system">System</span>
				<i class="bi bi-lock ms-auto fs-5" style="color:#9CA3AF;"></i>
			</div>
			{#each categories as category (category.name)}
				<div class="ds-row">
					<span class="ds-icon-avatar {category.tint}"><i class="bi {category.icon}"></i></span>
					<span class="ds-row-title fs-4">{category.name}</span>
				</div>
			{/each}
		</section>
	</div>

	<div class="ds-footer-cta" style="padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));">
		<button
			type="button"
			class="btn ds-btn-primary w-100 shadow"
			style="box-shadow: var(--ds-shadow-raised) !important;"
		>
			<i class="bi bi-plus-lg me-2"></i> Add Category
		</button>
	</div>
</main>
