<script lang="ts">
	// Tinted circular icon (ds-icon-avatar + ds-tint-* vocabulary).

	interface Props {
		icon: string;
		tint: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { icon, tint, size = 'md', class: className = '' }: Props = $props();

	const cls = $derived(
		[
			'ds-icon-avatar',
			size === 'sm' ? 'ds-icon-avatar-sm' : size === 'lg' ? 'ds-icon-avatar-lg' : '',
			tint,
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<span class={cls}><i class="bi {icon}"></i></span>
