<script lang="ts">
	// Structural migration of initial-assets/static-templates/scan_receipt_camera.html.
	// The original page has no custom JavaScript (Bootstrap bundle only, unused here);
	// all buttons are decorative placeholders.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Scan Receipt · Camera · ExpenseTracker</title>
</svelte:head>

<div class="ds-camera">
	<div class="ds-camera-backdrop" aria-hidden="true"></div>

	<!-- Top controls -->
	<div class="d-flex justify-content-between align-items-center p-4" style="position:relative;">
		<button type="button" class="ds-icon-btn-circle" aria-label="Close camera">
			<i class="bi bi-x-lg"></i>
		</button>
		<button type="button" class="ds-icon-btn-circle" aria-label="Toggle flash">
			<i class="bi bi-lightning-charge-fill"></i>
		</button>
	</div>

	<!-- Instruction pill -->
	<div class="d-flex justify-content-center" style="position:relative;">
		<span class="ds-instruction-pill">Align receipt within the frame</span>
	</div>

	<!-- Detection frame -->
	<div class="flex-grow-1 px-4 py-4" style="position:relative;">
		<div class="ds-scan-frame">
			<span class="ds-scan-frame-corner tl"></span>
			<span class="ds-scan-frame-corner tr"></span>
			<span class="ds-scan-frame-corner bl"></span>
			<span class="ds-scan-frame-corner br"></span>
		</div>
	</div>

	<!-- Capture controls -->
	<div
		class="d-flex align-items-center justify-content-between px-4 pb-5"
		style="position:relative;"
	>
		<button type="button" class="ds-thumb" aria-label="Open gallery">
			<div
				style="height:14px;background:#C6CBE0;font-size:4px;text-align:center;color:#374151;padding-top:2px;"
			>
				Scan Receipt · Camera
			</div>
		</button>
		<button type="button" class="ds-shutter" aria-label="Take photo"></button>
		<button type="button" class="ds-mode-circle" aria-label="Change scan mode">AUTO</button>
	</div>
</div>
