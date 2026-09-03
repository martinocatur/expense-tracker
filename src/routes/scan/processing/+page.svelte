<script lang="ts">
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	// Structural migration of initial-assets/static-templates/ocr_processing.html.
	// The original page has no custom JavaScript (Bootstrap bundle only, unused here);
	// the progress bar is a static 8% fill.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Processing Receipt · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<div
		class="ds-content d-flex flex-column justify-content-center align-items-center"
		style="min-height:100dvh;"
	>
		<div class="ds-illustration-receipt" aria-hidden="true">
			<div class="top"></div>
			<div class="dot"></div>
		</div>

		<h1 class="fs-3 fw-bold mt-5 mb-3">Reading your receipt...</h1>
		<p class="ds-subtitle mb-4">Extracting amounts and merchant info</p>

		<ProgressBar value={8} thin ariaLabel="Processing receipt" class="w-75 mt-3" />
	</div>
</main>
