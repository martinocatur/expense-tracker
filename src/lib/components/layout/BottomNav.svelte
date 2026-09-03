<script lang="ts">
	// Fixed bottom navigation (ds-bottomnav). The four destinations are fixed
	// across the app; `active` renders the highlighted pill (with filled icon
	// variants, as in the static templates). `raisedScan` renders the settings
	// variant with the raised circular Scan action.

	interface Props {
		active: 'home' | 'expenses' | 'scan' | 'settings';
		raisedScan?: boolean;
	}

	let { active, raisedScan = false }: Props = $props();

	const items = [
		{
			key: 'home',
			href: '/home',
			icon: 'bi-house-door',
			activeIcon: 'bi-house-door-fill',
			label: 'Home'
		},
		{
			key: 'expenses',
			href: '/expenses',
			icon: 'bi-wallet2',
			activeIcon: 'bi-wallet2',
			label: 'Expenses'
		},
		{ key: 'scan', href: '/scan', icon: 'bi-camera', activeIcon: 'bi-camera', label: 'Scan' },
		{
			key: 'settings',
			href: '/settings',
			icon: 'bi-gear',
			activeIcon: 'bi-gear-fill',
			label: 'Settings'
		}
	] as const;
</script>

<nav class="ds-bottomnav">
	<div
		class="d-flex justify-content-around {raisedScan
			? 'align-items-end pb-2'
			: 'align-items-center'}"
	>
		{#each items as item (item.key)}
			<a
				href={item.href}
				class="ds-nav-item"
				style={raisedScan && item.key === 'scan' ? 'margin-top:-2.6rem;' : undefined}
			>
				{#if raisedScan && item.key === 'scan'}
					<span class="ds-nav-scan"><i class="bi {item.icon}"></i></span>
					<span>{item.label}</span>
				{:else if active === item.key}
					<span class="ds-nav-pill d-flex flex-column align-items-center px-3 py-2">
						<i class="bi {item.activeIcon}"></i>
						<span>{item.label}</span>
					</span>
				{:else}
					<i class="bi {item.icon}"></i>
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}
	</div>
</nav>
