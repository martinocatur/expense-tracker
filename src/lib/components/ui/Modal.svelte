<script lang="ts">
	import type { Snippet } from 'svelte';
	import { bodyScrollLock } from '$lib/utils/scroll-lock';

	// Design-system modal shell (ds-modal skin) controlled by Svelte state.
	// Replaces the Bootstrap JS modal: Esc/backdrop close + body scroll lock
	// live here; focus trapping is deferred (docs/migration-inventory.md §13 R4).
	//
	// `children` receives everything inside .modal-content AFTER the header.
	// Note: the original modals wrap .modal-body AND .modal-footer in a single
	// <form>, so separate body/footer snippets would break the DOM structure —
	// pages keep their own form/body/footer markup.

	interface Props {
		open?: boolean;
		title: string;
		children: Snippet;
	}

	let { open = $bindable(false), title, children }: Props = $props();

	const titleId = $props.id();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && open) open = false;
	}}
/>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="modal fade ds-modal show"
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-labelledby={titleId}
		style="display:block;"
		use:bodyScrollLock
		onclick={(e) => e.target === e.currentTarget && (open = false)}
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-0 pb-2">
					<h5 class="modal-title fw-bold" id={titleId}>{title}</h5>
					<button type="button" class="btn-close" aria-label="Close" onclick={() => (open = false)}
					></button>
				</div>
				{@render children()}
			</div>
		</div>
	</div>
	<div class="modal-backdrop fade show"></div>
{/if}
