/**
 * Svelte action: locks body scroll while the attached element is mounted.
 * Used by the Svelte-state modals to replicate the Bootstrap modal default
 * (background scroll lock). Cleanup runs automatically on destroy.
 */
export function bodyScrollLock(_node: HTMLElement): { destroy(): void } {
	document.body.style.overflow = 'hidden';
	return {
		destroy() {
			document.body.style.overflow = '';
		}
	};
}
