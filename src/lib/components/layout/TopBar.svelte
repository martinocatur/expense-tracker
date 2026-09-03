<script lang="ts">
	import type { Snippet } from 'svelte';

	// Sticky top bar (ds-topbar). Covers the three variants from the static
	// templates: dashboard (avatar + brand + bell), back + title, back + brand.
	// `leading`/`trailing` snippets override the defaults; trailing falls back
	// to the 28px spacer used by the back+title pages.

	interface Props {
		/** Leading back-arrow link (icon button). */
		backHref?: string;
		/** Centered brand link (renders instead of `title`). */
		brandHref?: string;
		/** Centered title span. */
		title?: string;
		titleAccent?: boolean;
		/** Extra classes for the title span; default 'fs-4'. */
		titleClass?: string;
		leading?: Snippet;
		trailing?: Snippet;
		/** Full override of the center column (e.g. non-standard title markup). */
		center?: Snippet;
	}

	let {
		backHref,
		brandHref,
		title,
		titleAccent = false,
		titleClass = 'fs-4',
		leading,
		trailing,
		center
	}: Props = $props();

	const titleCls = $derived(
		['ds-topbar-title', titleAccent ? 'ds-topbar-title-accent' : '', titleClass]
			.filter(Boolean)
			.join(' ')
	);
</script>

<header class="ds-topbar">
	{#if leading}
		{@render leading()}
	{:else if backHref}
		<a href={backHref} class="ds-icon-btn" aria-label="Back"
			><i class="bi bi-arrow-left fs-4"></i></a
		>
	{/if}

	{#if center}
		{@render center()}
	{:else if brandHref}
		<a href={brandHref} class="ds-topbar-brand">ExpenseTracker</a>
	{:else if title}
		<span class={titleCls}>{title}</span>
	{/if}

	{#if trailing}
		{@render trailing()}
	{:else}
		<span style="width:28px;"></span>
	{/if}
</header>
