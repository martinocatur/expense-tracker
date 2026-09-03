<script lang="ts">
	import IconAvatar from '$lib/components/ui/IconAvatar.svelte';

	// Transaction list row (ds-transaction). Shared by the home recent-activity
	// list and the expenses transaction list. The amount is passed pre-formatted
	// because the two screens render it slightly differently ("-Rp" vs "- Rp").

	interface Props {
		name: string;
		category: string;
		amountText: string;
		icon: string;
		tint: string;
		over?: boolean;
		/** Extra classes (e.g. spacing utility used by the expenses list). */
		class?: string;
	}

	let {
		name,
		category,
		amountText,
		icon,
		tint,
		over = false,
		class: className = ''
	}: Props = $props();

	const cls = $derived(['ds-transaction', className].filter(Boolean).join(' '));
</script>

<div class={cls}>
	<IconAvatar {icon} {tint} size="sm" />
	<div>
		<div class="name">{name}</div>
		<div class="category">{category}</div>
	</div>
	<span class="amount" class:over>{amountText}</span>
</div>
