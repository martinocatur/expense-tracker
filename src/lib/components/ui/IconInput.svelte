<script lang="ts">
	import type { Snippet } from 'svelte';

	// Design-system input wrapper: icon inside the input field
	// (left by default, right with the `right` flag). The control itself
	// (input/select + bindings) is passed as content so all form behavior
	// stays on the page.

	interface Props {
		icon: string;
		right?: boolean;
		class?: string;
		children: Snippet;
	}

	let { icon, right = false, class: className = '', children }: Props = $props();

	const cls = $derived(
		['ds-input-icon', right ? 'ds-input-icon-right' : '', className].filter(Boolean).join(' ')
	);
</script>

<div class={cls}>
	<i class="bi {icon}"></i>
	{@render children()}
</div>
