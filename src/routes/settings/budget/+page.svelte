<script lang="ts">
	import { formatRp, parseRp } from '$lib/utils/currency';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import FooterCta from '$lib/components/layout/FooterCta.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import IconInput from '$lib/components/ui/IconInput.svelte';
	import IconAvatar from '$lib/components/ui/IconAvatar.svelte';

	// Structural migration of initial-assets/static-templates/budget_settings.html
	// including the category-budget CRUD from its inline script.
	//
	// Original behavior:
	// - "Add Category Budget" opens the modal in add mode (select enabled, Rp 0)
	// - row pencil opens it in edit mode (category select disabled, amount pre-filled)
	// - amount input live-formats to Rp while typing
	// - submit validates category + amount > 0 (is-invalid), then:
	//     edit → row updated, unallocated += previous - new
	//     add  → row created (icon/tint from category), unallocated -= amount
	// - row delete → unallocated += amount, row removed (no confirmation in original)
	// - unallocated figure is shared between page and modal
	//
	// Per docs/migration-inventory.md §13 R5, the Bootstrap `show.bs.modal` +
	// `relatedTarget` pattern dissolves: the opener sets modal state, then opens.
	// The Bootstrap JS modal itself is replaced with Svelte state (Esc/backdrop
	// close + body scroll lock; focus trapping deferred, §13 R4).

	interface BudgetRow {
		id: string;
		category: string;
		amount: number;
		icon: string;
		tint: string;
	}

	const ICONS: Record<string, [icon: string, tint: string]> = {
		'Food & Dining': ['bi-cup-hot', 'ds-tint-peach'],
		Transportation: ['bi-car-front', 'ds-tint-gray'],
		Education: ['bi-mortarboard', 'ds-tint-blue'],
		Shopping: ['bi-bag', 'ds-tint-peach'],
		Health: ['bi-heart-pulse', 'ds-tint-lavender'],
		Entertainment: ['bi-film', 'ds-tint-lavender'],
		Bills: ['bi-receipt', 'ds-tint-lavender'],
		Family: ['bi-people', 'ds-tint-lavender'],
		Travel: ['bi-airplane', 'ds-tint-lavender']
	};

	const CATEGORY_OPTIONS = Object.keys(ICONS);

	let budgets = $state<BudgetRow[]>([
		{
			id: 'food',
			category: 'Food & Dining',
			amount: 1500000,
			icon: 'bi-cup-hot',
			tint: 'ds-tint-peach'
		},
		{
			id: 'education',
			category: 'Education',
			amount: 1000000,
			icon: 'bi-mortarboard',
			tint: 'ds-tint-blue'
		},
		{
			id: 'transportation',
			category: 'Transportation',
			amount: 1000000,
			icon: 'bi-car-front',
			tint: 'ds-tint-gray'
		}
	]);

	let unallocated = $state(1500000);

	// Modal state (add/edit mode replaces the relatedTarget pattern).
	let modalOpen = $state(false);
	let mode = $state<'add' | 'edit'>('add');
	let editingId = $state<string | null>(null);
	let draftCategory = $state('');
	let draftAmount = $state('Rp 0'); // formatted text, reformatted on input
	let categoryInvalid = $state(false);
	let amountInvalid = $state(false);
	let nextId = 1;

	function openModal(next: 'add' | 'edit', budget?: BudgetRow): void {
		mode = next;
		categoryInvalid = false;
		amountInvalid = false;
		if (next === 'edit' && budget) {
			editingId = budget.id;
			draftCategory = budget.category;
			draftAmount = formatRp(budget.amount);
		} else {
			editingId = null;
			draftCategory = '';
			draftAmount = 'Rp 0';
		}
		modalOpen = true;
	}

	function onAmountInput(): void {
		const digits = parseRp(draftAmount);
		draftAmount = digits ? formatRp(digits) : '';
		amountInvalid = false;
	}

	function submitBudget(event: SubmitEvent): void {
		event.preventDefault();

		let valid = true;
		if (!draftCategory) {
			categoryInvalid = true;
			valid = false;
		}
		const amount = parseRp(draftAmount);
		if (amount <= 0) {
			amountInvalid = true;
			valid = false;
		}
		if (!valid) return;

		if (mode === 'edit' && editingId !== null) {
			const row = budgets.find((b) => b.id === editingId);
			if (row) {
				unallocated += row.amount - amount;
				row.amount = amount;
			}
		} else {
			const [icon, tint] = ICONS[draftCategory] ?? ['bi-shapes', 'ds-tint-lavender'];
			budgets.push({ id: `new-${nextId++}`, category: draftCategory, amount, icon, tint });
			unallocated -= amount;
		}
		modalOpen = false;
	}

	function deleteBudget(budget: BudgetRow): void {
		unallocated += budget.amount;
		budgets = budgets.filter((b) => b.id !== budget.id);
	}
</script>

<svelte:head>
	<title>Budget Settings · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<TopBar backHref="/settings" title="Budget Settings" />

	<div class="ds-content" style="padding-bottom: 7.5rem;">
		<!-- Enable budgeting hero -->
		<section
			class="p-4"
			style="background:#D8DAE6;border-radius:var(--ds-radius-lg);box-shadow:var(--ds-shadow-card);"
		>
			<div class="d-flex align-items-center justify-content-between">
				<div>
					<h2 class="fs-3 fw-bold mb-1">Enable Budgeting</h2>
					<p class="ds-row-value mb-0" style="font-size:1rem;">Track your spending limits</p>
				</div>
				<div class="form-check form-switch m-0">
					<input
						class="form-check-input ds-switch"
						type="checkbox"
						role="switch"
						id="enableBudgeting"
						checked
					/>
				</div>
			</div>

			<hr style="border-color:rgba(17,24,39,0.1);opacity:1;" />

			<label for="resetDate" class="ds-label" style="color:#374151;">Budget Reset Date</label>
			<IconInput icon="bi-calendar2-week" right>
				<input
					type="text"
					class="form-control ds-input"
					id="resetDate"
					value="15th of every month"
				/>
			</IconInput>
		</section>

		<!-- Total monthly budget -->
		<label for="totalBudget" class="ds-label mt-4 mb-2" style="font-size:0.85rem;"
			>Total Monthly Budget</label
		>
		<input
			type="text"
			class="form-control ds-input ds-input-amount"
			id="totalBudget"
			value="Rp 5.000.000"
			style="border-radius:var(--ds-radius-lg);"
		/>

		<div class="ds-card ds-row py-3 mt-3" style="border-radius:var(--ds-radius-lg);">
			<span class="fs-5" style="color:var(--ds-text-secondary);">Unallocated Budget:</span>
			<span class="ms-auto ds-money ds-money-success">{formatRp(unallocated)}</span>
		</div>

		<!-- Category budgets -->
		<span class="ds-label mt-4 mb-2" style="font-size:0.85rem;">Category Budgets</span>

		<div class="d-grid gap-3">
			{#each budgets as budget (budget.id)}
				<div class="ds-card ds-row py-3" style="border-color:var(--ds-border-input);">
					<IconAvatar icon={budget.icon} tint={budget.tint} />
					<div>
						<div class="fw-bold fs-5 text-body">{budget.category}</div>
						<div class="ds-row-value">{formatRp(budget.amount)}</div>
					</div>
					<div class="ms-auto d-flex gap-3">
						<button
							type="button"
							class="ds-row-icon-btn"
							aria-label="Edit {budget.category} budget"
							onclick={() => openModal('edit', budget)}
						>
							<i class="bi bi-pencil"></i>
						</button>
						<button
							type="button"
							class="ds-row-icon-btn ds-row-icon-btn-danger"
							aria-label="Delete {budget.category} budget"
							onclick={() => deleteBudget(budget)}
						>
							<i class="bi bi-trash"></i>
						</button>
					</div>
				</div>
			{/each}

			<button
				type="button"
				class="btn ds-btn-dashed-muted w-100 d-flex align-items-center justify-content-center gap-2"
				onclick={() => openModal('add')}
			>
				<i class="bi bi-plus-lg"></i> Add Category Budget
			</button>
		</div>
	</div>

	<FooterCta style="background:transparent;">Save Changes</FooterCta>
</main>

<!-- Add / Edit Category Budget modal (Svelte state; replaces Bootstrap JS modal) -->
<Modal
	bind:open={modalOpen}
	title={mode === 'edit' ? 'Edit Category Budget' : 'Add Category Budget'}
>
	<form novalidate onsubmit={submitBudget}>
		<div class="modal-body">
			<div class="mb-4">
				<label for="modalCategory" class="ds-label">Category</label>
				<IconInput icon="bi-shapes" right>
					<select
						class="form-select ds-input"
						class:is-invalid={categoryInvalid}
						id="modalCategory"
						required
						disabled={mode === 'edit'}
						bind:value={draftCategory}
						onchange={() => (categoryInvalid = false)}
					>
						<option value="" selected disabled>Select...</option>
						{#each CATEGORY_OPTIONS as option (option)}
							<option>{option}</option>
						{/each}
					</select>
				</IconInput>
			</div>

			<div class="mb-2">
				<label for="modalAmount" class="ds-label">Amount (Rp)</label>
				<input
					type="text"
					class="form-control ds-input"
					class:is-invalid={amountInvalid}
					id="modalAmount"
					inputmode="numeric"
					required
					bind:value={draftAmount}
					oninput={onAmountInput}
				/>
			</div>

			<p class="ds-caption mb-0">
				Unallocated Budget: <span class="ds-money ds-money-success">{formatRp(unallocated)}</span>
			</p>
		</div>
		<div class="modal-footer border-0 pt-0">
			<button type="button" class="btn ds-btn-neutral-tint" onclick={() => (modalOpen = false)}
				>Cancel</button
			>
			<button type="submit" class="btn ds-btn-primary">Save</button>
		</div>
	</form>
</Modal>
