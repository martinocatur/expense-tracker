<script lang="ts">
	// Design-system progress bar. `value` is the fill percentage.
	// The wizard variant (ds-wizard-progress) has a different DOM structure
	// and remains page-local where it is used.

	interface Props {
		value: number;
		danger?: boolean;
		thin?: boolean;
		/** When set, renders role="progressbar" with this label. */
		ariaLabel?: string;
		class?: string;
	}

	let { value, danger = false, thin = false, ariaLabel, class: className = '' }: Props = $props();

	const cls = $derived(
		['ds-progress', thin ? 'ds-progress-thin' : '', className].filter(Boolean).join(' ')
	);
</script>

<div class={cls} role={ariaLabel ? 'progressbar' : undefined} aria-label={ariaLabel}>
	<div
		class="ds-progress-bar"
		class:ds-progress-bar-danger={danger}
		style:width={`${value}%`}
	></div>
</div>
