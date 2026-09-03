<script lang="ts">
	import type { Category } from '$lib/types/category';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import FooterCta from '$lib/components/layout/FooterCta.svelte';
	import IconInput from '$lib/components/ui/IconInput.svelte';
	import IconAvatar from '$lib/components/ui/IconAvatar.svelte';

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
	<TopBar backHref="/settings" title="Categories" titleAccent />

	<div class="ds-content" style="padding-bottom: 7.5rem;">
		<!-- Search -->
		<IconInput icon="bi-search" class="mb-4">
			<input
				type="search"
				class="form-control ds-input"
				placeholder="Search categories..."
				aria-label="Search categories"
			/>
		</IconInput>

		<!-- Category list -->
		<section class="ds-card">
			<div class="ds-row">
				<IconAvatar icon="bi-shapes" tint="ds-tint-lavender" />
				<span class="ds-row-title fs-4">General</span>
				<span class="ds-badge-system">System</span>
				<i class="bi bi-lock ms-auto fs-5" style="color:#9CA3AF;"></i>
			</div>
			{#each categories as category (category.name)}
				<div class="ds-row">
					<IconAvatar icon={category.icon} tint={category.tint} />
					<span class="ds-row-title fs-4">{category.name}</span>
				</div>
			{/each}
		</section>
	</div>

	<FooterCta
		style="padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));"
		buttonClass="shadow"
		buttonStyle="box-shadow: var(--ds-shadow-raised) !important;"
	>
		<i class="bi bi-plus-lg me-2"></i> Add Category
	</FooterCta>
</main>
