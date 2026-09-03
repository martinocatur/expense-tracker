<script lang="ts">
	import { formatRp, parseRp } from '$lib/utils/currency';
	import { bodyScrollLock } from '$lib/utils/scroll-lock';

	// Structural migration of initial-assets/static-templates/add_expense_manually.html
	// including the Add Item behavior from its inline script.
	//
	// Original behavior:
	// - "Add Item" opens the modal (bootstrap.Modal instantiated directly)
	// - opening clears is-invalid on all modal inputs
	// - modal price input live-formats to Rp while typing
	// - submit validates name (non-empty), qty (>= 1), price (> 0) with is-invalid
	// - on success: item row appended (name, "qty × Rp price", total, remove button),
	//   form reset, modal closes
	// - item rows are removable via the x button (no confirmation in original)
	//
	// The Bootstrap JS modal is replaced with Svelte state per AGENTS.md
	// (Esc/backdrop close + body scroll lock; focus trapping deferred, §13 R4).

	interface ExpenseItem {
		id: number;
		name: string;
		qty: number;
		price: number;
	}

	let items = $state<ExpenseItem[]>([]);

	let modalOpen = $state(false);
	let draftName = $state('');
	let draftQty = $state('1');
	let draftPrice = $state('Rp 0'); // formatted text, reformatted on input
	let nameInvalid = $state(false);
	let qtyInvalid = $state(false);
	let priceInvalid = $state(false);
	let nextId = 1;

	function openModal(): void {
		draftName = '';
		draftQty = '1';
		draftPrice = 'Rp 0';
		nameInvalid = false;
		qtyInvalid = false;
		priceInvalid = false;
		modalOpen = true;
	}

	function onPriceInput(): void {
		const digits = parseRp(draftPrice);
		draftPrice = digits ? formatRp(digits) : '';
		priceInvalid = false;
	}

	function addItem(event: SubmitEvent): void {
		event.preventDefault();

		let valid = true;
		if (!draftName.trim()) {
			nameInvalid = true;
			valid = false;
		}
		const qty = Number(draftQty);
		if (!qty || qty < 1) {
			qtyInvalid = true;
			valid = false;
		}
		const price = parseRp(draftPrice);
		if (price <= 0) {
			priceInvalid = true;
			valid = false;
		}
		if (!valid) return;

		items.push({ id: nextId++, name: draftName.trim(), qty, price });
		// form.reset() equivalent
		draftName = '';
		draftQty = '1';
		draftPrice = 'Rp 0';
		modalOpen = false;
	}

	function removeItem(item: ExpenseItem): void {
		items = items.filter((i) => i.id !== item.id);
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && modalOpen) modalOpen = false;
	}
</script>

<svelte:head>
	<title>Add Expense · ExpenseTracker</title>
</svelte:head>

<svelte:window onkeydown={onKeydown} />

<main class="ds-shell">
	<header class="ds-topbar">
		<a href="/home" class="ds-icon-btn" aria-label="Back"><i class="bi bi-arrow-left fs-4"></i></a>
		<a href="/home" class="ds-topbar-brand">ExpenseTracker</a>
		<span style="width:28px;"></span>
	</header>

	<div class="ds-content" style="padding-bottom: 7.5rem;">
		<h1 class="fs-3 fw-semibold mb-1">Add Expense</h1>
		<p class="ds-subtitle mb-4">Manual entry for un-scanned receipts.</p>

		<form>
			<section class="ds-card p-3 mb-3">
				<label for="expenseTitle" class="ds-label">Expense Title (Optional)</label>
				<input
					type="text"
					class="form-control ds-input"
					id="expenseTitle"
					placeholder="e.g. Weekly Groceries"
				/>
			</section>

			<section class="ds-card p-3 mb-3">
				<label for="amount" class="ds-label">Amount (Rp)</label>
				<input
					type="text"
					class="form-control ds-input"
					id="amount"
					value="Rp 0"
					style="font-size:2rem;font-weight:700;padding:0.9rem 1.25rem;"
				/>
			</section>

			<section class="ds-card p-3 mb-3">
				<label for="date" class="ds-label">Date</label>
				<div class="ds-input-icon ds-input-icon-right">
					<i class="bi bi-calendar-week"></i>
					<input type="text" class="form-control ds-input" id="date" value="01/09/2026" />
				</div>
			</section>

			<section class="ds-card p-3 mb-3">
				<label for="category" class="ds-label">Category</label>
				<div class="ds-input-icon ds-input-icon-right">
					<i class="bi bi-shapes"></i>
					<select class="form-select ds-input" id="category">
						<option selected>Select...</option>
						<option>Food &amp; Beverage</option>
						<option>Transportation</option>
						<option>Shopping</option>
						<option>Education</option>
					</select>
				</div>
			</section>

			<section class="ds-card p-3 mb-3">
				<div class="d-flex align-items-center gap-2 mb-3">
					<i class="bi bi-ui-checks fs-4" style="color:var(--ds-brand-primary);"></i>
					<span class="fs-5 fw-semibold">Additional Details</span>
				</div>

				<span class="ds-label">Items</span>

				<div class="row g-2 mb-2">
					<div class="col-6">
						<span class="ds-label ds-label-muted" style="font-size:0.7rem;">Name</span>
						<input type="text" class="form-control ds-input" placeholder="Item name" />
					</div>
					<div class="col-2">
						<span class="ds-label ds-label-muted" style="font-size:0.7rem;">Qty</span>
						<input type="number" class="form-control ds-input" value="1" />
					</div>
					<div class="col-4">
						<span class="ds-label ds-label-muted" style="font-size:0.7rem;">Price</span>
						<input type="number" class="form-control ds-input" value="0" />
					</div>
				</div>

				<!-- Saved items -->
				<div class="d-grid gap-2 mb-3">
					{#each items as item (item.id)}
						<div class="ds-transaction py-2">
							<div class="flex-grow-1">
								<div class="name">{item.name}</div>
								<div class="category">{item.qty} × {formatRp(item.price)}</div>
							</div>
							<span class="amount">{formatRp(item.qty * item.price)}</span>
							<button
								type="button"
								class="ds-row-icon-btn"
								aria-label="Remove item"
								onclick={() => removeItem(item)}
							>
								<i class="bi bi-x-lg"></i>
							</button>
						</div>
					{/each}
				</div>

				<button
					type="button"
					class="btn ds-btn-dashed w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
					onclick={openModal}
				>
					<i class="bi bi-plus-lg"></i> Add Item
				</button>
			</section>
		</form>
	</div>

	<div class="ds-footer-cta">
		<button type="button" class="btn ds-btn-primary w-100">
			<i class="bi bi-save me-2"></i> Save Expense
		</button>
	</div>
</main>

{#if modalOpen}
	<!-- Add Item modal (Svelte state; replaces Bootstrap JS modal) -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="modal fade ds-modal show"
		use:bodyScrollLock
		tabindex="-1"
		role="dialog"
		aria-modal="true"
		aria-labelledby="addItemModalTitle"
		style="display:block;"
		onclick={(e) => e.target === e.currentTarget && (modalOpen = false)}
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-0 pb-2">
					<h5 class="modal-title fw-bold" id="addItemModalTitle">Add Item</h5>
					<button
						type="button"
						class="btn-close"
						aria-label="Close"
						onclick={() => (modalOpen = false)}
					></button>
				</div>
				<form novalidate onsubmit={addItem}>
					<div class="modal-body">
						<div class="mb-4">
							<label for="modalItemName" class="ds-label">Name</label>
							<input
								type="text"
								class="form-control ds-input"
								class:is-invalid={nameInvalid}
								id="modalItemName"
								placeholder="Item name"
								required
								bind:value={draftName}
								oninput={() => (nameInvalid = false)}
							/>
						</div>

						<div class="row g-3">
							<div class="col-4">
								<label for="modalItemQty" class="ds-label">Qty</label>
								<input
									type="number"
									class="form-control ds-input"
									class:is-invalid={qtyInvalid}
									id="modalItemQty"
									min="1"
									required
									bind:value={draftQty}
								/>
							</div>
							<div class="col-8">
								<label for="modalItemPrice" class="ds-label">Price (Rp)</label>
								<input
									type="text"
									class="form-control ds-input"
									class:is-invalid={priceInvalid}
									id="modalItemPrice"
									inputmode="numeric"
									required
									bind:value={draftPrice}
									oninput={onPriceInput}
								/>
							</div>
						</div>
					</div>
					<div class="modal-footer border-0 pt-0">
						<button
							type="button"
							class="btn ds-btn-neutral-tint"
							onclick={() => (modalOpen = false)}>Cancel</button
						>
						<button type="submit" class="btn ds-btn-primary">Add Item</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="modal-backdrop fade show"></div>
{/if}
