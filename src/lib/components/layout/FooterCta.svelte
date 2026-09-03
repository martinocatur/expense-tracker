<script lang="ts">
	import type { Snippet } from 'svelte';

	// Fixed bottom call-to-action bar (ds-footer-cta) with a full-width
	// primary button. Inline-style passthroughs preserve the per-page
	// variants (transparent background, safe-area padding, raised shadow).

	interface Props {
		onclick?: () => void;
		/** Inline style for the ds-footer-cta container. */
		style?: string;
		/** Extra classes for the button (e.g. 'shadow'). */
		buttonClass?: string;
		/** Inline style for the button. */
		buttonStyle?: string;
		children: Snippet;
	}

	let { onclick, style, buttonClass = '', buttonStyle, children }: Props = $props();

	const buttonCls = $derived(
		['btn', 'ds-btn-primary', 'w-100', buttonClass].filter(Boolean).join(' ')
	);
</script>

<div class="ds-footer-cta" {style}>
	<button type="button" class={buttonCls} style={buttonStyle} {onclick}>
		{@render children()}
	</button>
</div>
