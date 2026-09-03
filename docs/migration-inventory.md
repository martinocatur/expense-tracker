# Migration Inventory — ExpenseTracker (Phase 1)

Analysis of the static HTML application in `initial-assets/static-templates/`.
No application code was modified. This document is the baseline for the
HTML → SvelteKit + Svelte 5 migration described in `AGENTS.md`.

---

## 1. Project Overview

ExpenseTracker is a **mobile-first single-column expense tracking UI** built as
16 static HTML pages sharing one design-system stylesheet and one JS file.

| Aspect | Detail |
|---|---|
| Framework | None (static HTML) |
| CSS framework | Bootstrap 5.3.3 (CDN) + Bootstrap Icons 1.11.3 (CDN) + custom `design-system.css` |
| Fonts | Google Fonts: Inter (400–800), Playfair Display (700) |
| JS | Vanilla JS: `js/transaction-filter.js` + two inline `<script>` blocks (Add Expense, Budget Settings) |
| Layout pattern | `ds-shell` — max-width 480px centered column, sticky top bar, fixed bottom nav / fixed footer CTA |
| Design tokens | CSS custom properties (`--ds-*`) in `design-system.css`, mapped onto Bootstrap CSS variables |
| Backend | None. All data is hardcoded demo data; all behavior is client-side DOM manipulation |

Notes:

* `index.html` is **not a product page** — it is a UI gallery/index linking to all other pages. It should probably *not* become a route (or become a dev-only index).
* Two pages are alternate **states of the same screen**: `main_expenses_page.html` (normal) and `main_expenses_overbudget_state.html` (over-budget state of the identical page).

---

## 2. Page Inventory

| # | File | Purpose | Nav position | Complexity |
|---|---|---|---|---|
| 1 | `index.html` | UI gallery index; grid of links to every screen | none (standalone) | Low |
| 2 | `register.html` | Sign-up form (name/email/password + Google button) | Auth entry point | Low |
| 3 | `tracking_preference.html` | Onboarding step: choose "Expense Only" vs "Expense + Budgeting" | Onboarding (after register) | Low |
| 4 | `budget_reset_date.html` | Onboarding wizard step 1 of 3: pick budget reset day (4 option tiles + progress bar) | Onboarding wizard | Low |
| 5 | `general_budget_setup_expanded.html` | Onboarding wizard "STEP 1 OF 3": set monthly total budget + optional category budgets | Onboarding wizard | Low–Medium |
| 6 | `home.html` | Dashboard: over-budget hero card, category alert banner, quick actions (Scan / Add), recent activity | Main tab (bottom nav) | Medium |
| 7 | `main_expenses_page.html` | Expenses list: period selector, budget summary, donut chart breakdown, grouped transactions, **filter modal** + `transaction-filter.js` | Main tab (bottom nav) | **High** |
| 8 | `main_expenses_overbudget_state.html` | Identical to #7 with over-budget styling on Shopping row/amount | Same page, different state | **High** (dup of #7) |
| 9 | `add_expense_manually.html` | Manual expense form (title, big amount, date, category, item lines) + **Add Item modal** with validation, inline JS | Sub-page of Expenses/Home | **High** |
| 10 | `scan_receipt_camera.html` | Full-screen camera mock: backdrop, instruction pill, scan frame, shutter / gallery / AUTO mode | Main tab "Scan" | Low (no behavior) |
| 11 | `ocr_processing.html` | Loading screen: receipt illustration + thin progress bar | Between scan and result | Low |
| 12 | `expense_result.html` | Success screen: check circle, total amount, merchant/category/items rows, Edit/Delete buttons | After OCR | Medium |
| 13 | `settings.html` | Settings hub: Account / Preferences / Data & Support grouped link cards; bottom nav with raised Scan button | Main tab (bottom nav) | Low–Medium |
| 14 | `profile_settings.html` | Profile form: avatar + edit badge, name/email/phone, currency select, Save / Sign Out | From settings/home avatar | Medium |
| 15 | `budget_settings.html` | Enable-budgeting switch, total budget input, unallocated figure, category budget rows (add/edit/delete via **modal** with inline JS) | From settings | **High** |
| 16 | `categories_management.html` | Category search + grouped list of 10 category rows ("System" badge on General), Add Category CTA | From settings | Low |

### Navigation relationships

```
register → tracking_preference → budget_reset_date / general_budget_setup_expanded (wizard steps)
home ── topbar avatar → profile_settings
     ── bell → (#)
     ── quick actions → scan_receipt_camera, add_expense_manually
     ── "See All" → main_expenses_page
     ── bottom nav → home / main_expenses_page / scan_receipt_camera / settings
settings → profile_settings, budget_settings, categories_management
main_expenses_page → filter modal (in-page)
add_expense_manually → Add Item modal (in-page)
budget_settings → Category Budget modal (in-page)
```

### Shared layout elements

* Every app page wraps content in `main.ds-shell` (index and camera page excepted).
* `header.ds-topbar` in 3 variants: **brand-centered with avatar** (home, expenses), **back-button + title** (settings sub-pages), **back + brand + step counter** (wizard).
* `nav.ds-bottomnav` on 4 main tabs (home, expenses ×2, settings) with 2 visual variants: active pill (`ds-nav-pill`) and raised circular Scan action (`ds-nav-scan`, settings only).
* `div.ds-footer-cta` fixed bottom CTA on form pages (add expense, budget settings, categories, wizard).
* `<head>` is identical on all pages (fonts + Bootstrap + icons + design-system.css).

### Page-specific elements

* Donut chart (`ds-donut` conic-gradient) — expenses pages only.
* Camera UI (backdrop, scan frame, shutter, thumb, mode circle) — scan page only.
* Receipt illustration — OCR page only.
* Success circle, labeled divider ("OR"), option tiles, choice cards — onboarding/auth.
* Wizard progress bar — `budget_reset_date.html`.

---

## 3. Shared UI Patterns

| Pattern | Where it occurs | Visually identical? | Notes |
|---|---|---|---|
| **Top bar** (`ds-topbar`) | All pages except `index.html`, `ocr_processing.html`, `scan_receipt_camera.html` | Same chrome, 3 content variants | Brand-centered / title-with-back / dashboard variants. Good `TopBar.svelte` candidate with slots. |
| **Bottom navigation** (`ds-bottomnav`) | home, main_expenses_page, overbudget variant, settings | Same structure, different active item & Scan styling | Active pill moves per page; settings uses raised `ds-nav-scan` circle. |
| **Footer CTA** (`ds-footer-cta`) | add_expense, budget_settings, categories, general_budget_setup | Yes (categories adds safe-area padding + shadow) | Fixed-bottom button bar. |
| **Card** (`ds-card`, `ds-card-lg`) | 12 pages | Yes | Generic container. |
| **Hero/summary card** (gradient bg) | home, expenses ×2, budget_settings, expense_result, general_budget_setup | Slightly different bg colors (#D9DAE3, #D8DAE6, gradient) | These inline hero backgrounds are near-duplicates of unused `.ds-card-hero` class. |
| **List row** (`ds-row`) | index, settings, categories, expense_result, budget_settings | Yes | Row w/ avatar or icon, title, trailing value/chevron. |
| **Icon avatar** (`ds-icon-avatar` + tint) | home, expenses ×2, budget_settings, categories, expense_result, tracking_preference | Yes | 5 tint classes; size variants sm/lg (lg unused). |
| **Transaction row** (`ds-transaction`) | home, expenses ×2, add_expense (dynamic rows) | Yes | `amount.over` error variant on overbudget page. |
| **Buttons** (`ds-btn-primary`, `-outline`, `-danger-outline`, `-danger-tint`, `-neutral-tint`, `-dashed`, `-dashed-muted`) | All pages | Yes | Consistent token-driven variants. |
| **Action cards** (`ds-btn-action`) | home only | — | Quick-action tiles. |
| **Form input** (`ds-input`, `ds-input-icon`, `ds-input-icon-right`, `ds-input-amount`) | register, profile, add_expense, budget_settings, expense filter modal, categories (search) | Yes | Icon-in-input wrapper repeated 9×. |
| **Modal** (Bootstrap `modal fade ds-modal`) | main_expenses_page, overbudget variant (filter), add_expense (Add Item), budget_settings (Category Budget) | Same shell styling; different content/behavior | **Bootstrap JS** opens/dismisses all three. Filter modal also wired to `transaction-filter.js`. |
| **Progress bar** (`ds-progress`, `ds-wizard-progress`, `ds-progress-thin`) | home, expenses ×2, budget_reset_date, ocr | Yes | Fill widths are inline (some dynamic). |
| **Badges** (`ds-badge-error`, `-system`, `-category`) | home, categories, expense_result | Yes | Three distinct variants. |
| **Alert banner** (`ds-alert-banner`) | home only | — | Category over-budget alert. |
| **Section title** (`ds-section-title`) | home, expenses ×2 | Yes | |
| **Date-grouped transaction list** (`ds-date-header` + `data-group`) | expenses ×2 | Yes | Backbone for the filter behavior. |
| **Legend dot** (`ds-legend-dot`) | expenses ×2, expense_result | Yes | Color set inline each time. |
| **Option tiles** (`ds-option`) | budget_reset_date only | — | `.selected` state hardcoded. |
| **Choice cards** (`ds-choice`) | tracking_preference only | — | `.selected` state hardcoded. |
| **Empty state** | expenses ×2 (`#transactionsEmpty`, `display:none`) | Yes | Shown by filter JS. |
| **Loading indicator** | ocr_processing | — | Illustration + progress bar; no spinner. |
| **Confirmation dialogs** | none | — | No confirm patterns exist (budget delete is immediate, no dialog). |
| **Tabs / accordions / tooltips / popovers / toasts / dropdowns** | none | — | **Not used anywhere** in the static app. |
| **Pagination** | none | — | Not used. |
| **Tables** | none | — | Not used (list rows instead). |

### Duplicated markup worth noting

`main_expenses_overbudget_state.html` is a ~99% copy of `main_expenses_page.html`
(diff: over-budget styling on Shopping legend/amount, `amount over` class, page title).
In Svelte these should be **one route with an over-budget prop/state**.

The **filter modal markup is duplicated verbatim** on both expenses pages.
The **Add Item modal** (add_expense) and **Category Budget modal** (budget_settings)
share the same `ds-modal` shell with different forms.

---

## 4. Inline CSS Inventory

~58 distinct inline `style=""` occurrences across pages. Categorized:

### A. Replaceable with Bootstrap utilities

| Inline style | Where | Replacement |
|---|---|---|
| `width:28px` (topbar spacer) | 6 pages | custom class or `d-inline-block` w/ class |
| `font-size:0.95rem` / `1.05rem` / `1rem` / `0.85rem` | register, expense_result, tracking_preference, settings, budget_settings | `.fs-6` / `.fs-5` / `.small` or leave (Bootstrap scale mismatch — see Risks) |
| `font-size:0.7rem` (item labels) | add_expense | no exact utility; candidate for a `.ds-label-sm` class |
| `display:none` (filter status, empty state) | expenses ×2 | becomes Svelte state — removed entirely, not a class |
| `background:transparent` | budget_settings footer-cta | `.bg-transparent` |
| `text-align:center` wrappers | expense_result, add_expense | `.text-center` already used mostly |
| `min-height:100dvh` | ocr_processing | `.min-vh-100` (≈, but `100dvh` ≠ `100vh`; see Risks) |
| `max-width: 720px` | index only | `.mw-100`-style custom, page dies in migration anyway |
| `width:56px;height:56px` / `width:128px;height:128px` | budget_reset_date, profile | custom classes exist (`ds-avatar-solid`, `ds-avatar-profile`) — inline dupes them |

### B. Repeated custom styling (should become CSS classes / components)

| Inline style | Count | Where |
|---|---|---|
| `color:var(--ds-text-secondary)` | 6+ | home, expenses ×2, budget_settings, register |
| `color:var(--ds-brand-primary)` | 6+ | bell icons, labels, clear button, legend dots |
| Hero card: `background: linear-gradient(160deg,#DEE0EC 0%, var(--ds-surface-muted) 100%); border-radius:...; box-shadow:...` | 4 | expenses ×2, expense_result, general_budget_setup — **exact duplicate of unused `.ds-card-hero`** |
| `background:#D9DAE3;...` / `background:#D8DAE6;...` hero variants | 2 | home, budget_settings |
| `border-color:var(--ds-border-default);opacity:1` (hr) | 3 | expenses ×2, profile |
| `padding-bottom: 7.5rem` (ds-content) | 4 | form pages |
| `border-color:var(--ds-border-input)` (budget rows) | 3 | budget_settings |
| `font-size:2.4rem...` hero figures | 3 | home, expenses ×2 |
| `border-radius:var(--ds-radius-xl/lg)` | 3 | register card, budget_settings |
| legend dot `background: #EF4444 / #6B7280 / var(--ds-warning) / var(--ds-brand-primary)` | 8 | expenses ×2, expense_result |

### C. Page-specific styling

| Inline style | Where |
|---|---|
| `position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(...)` | register (card bottom accent) |
| `border-radius: var(--ds-radius-xl); position: relative; overflow: hidden` | register card |
| `height:14px;background:#C6CBE0;font-size:4px...` (gallery placeholder inside thumb) | scan_receipt_camera |
| `margin-top:-2.6rem` (raised Scan nav item) | settings |
| `padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px))` | categories footer |
| `box-shadow: var(--ds-shadow-raised) !important` + `shadow` class | categories CTA |
| `border:1px solid var(--ds-border-default)!important` | general_budget_setup "Add Category" button |
| `border-color:rgba(17,24,39,0.1)` hr | budget_settings |
| `color:#EA4335` (Google icon), `color:#9CA3AF` (lock icon) | register, categories |
| `color:var(--ds-brand-primary)!important` | budget_reset_date step label |
| `font-size:2rem;font-weight:700;padding:0.9rem 1.25rem` | add_expense amount input (dupes `.ds-input-amount`!) |

### D. Truly dynamic styling (become `style:` directives / props)

| Inline style | Where | Svelte form |
|---|---|---|
| `width:85%` (budget progress) | expenses ×2 | `style:width={`${pct}%`}` |
| `width:100%` (over-budget progress) | home | same |
| `width:8%` (OCR progress) | ocr | same |
| `width: 33%` (wizard progress) | budget_reset_date | same |
| `display:none` ↔ `flex`/`block` toggles | expenses ×2 (filter status, empty state) | `{#if}` blocks — style disappears |
| legend dot backgrounds | expenses, expense_result | prop-driven `CategoryDot color=...` |

Per-file inline `<style>` blocks: `main_expenses_page.html` and
`main_expenses_overbudget_state.html` both define `.ds-period-nav`
(identical 1-line rule — should move into `design-system.css` or the page component).

---

## 5. CSS Inventory — `css/design-system.css` (1157 lines)

Single stylesheet for the whole app, organized in commented sections.

### Global styles

* `:root` token block: 20 color, 5 radius, 2 shadow, 6 typography, 2 layout tokens.
* `body` maps `--ds-*` onto Bootstrap variables (`--bs-primary`, `--bs-body-bg`,
  `--bs-body-font-family`, `--bs-body-font-size: 0.9rem` ← **non-default base font size**,
  `--bs-border-color`, link colors).

### Section-by-section

| Section | Classes | Used on pages | Notes |
|---|---|---|---|
| Page shell | `.ds-shell`, `.ds-content`, `.ds-content--no-nav` | all | 480px column; `100dvh` |
| Top bar | `.ds-topbar`, `-brand`, `-title`, `-title-accent`, `.ds-icon-btn` (inherited), `.ds-step-counter` | all | sticky, z-1020 |
| Bottom nav | `.ds-bottomnav`, `.ds-nav-item` (+`.active`), `.ds-nav-pill`, `.ds-nav-scan`, `.ds-filter-btn` (+`.filter-active`) | 4 tabs | fixed, z-1030; `.active` class **never applied in HTML** (active state is faked by hardcoding the pill markup per page) |
| Buttons | `.ds-btn-primary/-outline/-danger-outline/-danger-tint/-neutral-tint/-dashed/-dashed-muted` via Bootstrap `--bs-btn-*` vars; `.ds-btn-action(-primary/-secondary)`; `.ds-icon-btn-circle` | all | |
| Cards | `.ds-card`, `.ds-card-lg`, `.ds-card-xl`, `.ds-card-hero`, `.ds-card-rows`, `.ds-label(-muted)` | all | **`.ds-card-xl`, `.ds-card-hero`, `.ds-card-rows`, `.ds-card-lg` (partially) appear unused in HTML** — pages re-create the hero style inline instead |
| Forms | `.ds-input`, `.ds-input-icon(-right)`, `.ds-input-amount` (+`.prefix`), `.ds-amount-underline`, `.ds-input-underline-active`, `.ds-switch` | forms | `.ds-input-amount .prefix` unused; `.ds-input-amount` **duplicated inline** on add_expense |
| Badges | `.ds-badge-error/-system/-category` | home, categories, expense_result | |
| Icon avatar | `.ds-icon-avatar(-sm/-lg)` + 5 tints; `.ds-avatar(-initials/-solid/-photo/-profile)`, `.ds-check-badge`, `.ds-success-circle`, `.ds-avatar-edit-badge` | many | `.ds-icon-avatar-lg` unused |
| Option tiles | `.ds-option(.selected)`, `.ds-choice(.selected)` | budget_reset_date, tracking_preference | |
| Alerts | `.ds-alert-banner`, `.icon-circle` | home | |
| Progress | `.ds-progress(-bar)(-thin)`, `.ds-progress-bar.over`, `.ds-progress-bar-danger`, `.ds-wizard-progress .bar` | 5 pages | |
| List rows | `.ds-row`, `-title`, `-value` (+success/error), `.ds-chevron`, `.ds-row-icon-btn(-danger)`, `.ds-transaction` (+`.name/.category/.amount/.amount.over`), `.ds-date-header` | many | `.ds-row-value-success/-error`, `.ds-chevron` appear unused (utilities done inline instead) |
| Typography | `.ds-brand-heading`, `.ds-heading(-bold)`, `.ds-subtitle`, `.ds-section-title`, `.ds-caption`, `.ds-money(-success/-error)`, `.ds-figure-serif`, `.ds-amount-display(-xl)`, `.ds-divider-labeled`, `.ds-text-center-block` | many | `.ds-heading-bold`, `.ds-text-center-block`, `.ds-amount-display` unused |
| Footer CTA | `.ds-footer-cta` | 4 pages | |
| Donut | `.ds-donut` (+`::after`), `.ds-legend-dot` | expenses ×2 | colors hardcoded in `conic-gradient` |
| Camera | `.ds-camera`, `-backdrop`, `.ds-instruction-pill`, `.ds-scan-frame(-corner)`, `.ds-shutter`, `.ds-mode-circle`, `.ds-thumb` | scan only | |
| OCR illustration | `.ds-illustration-receipt` | ocr only | |
| Modal | `.ds-modal` overrides | 3 modals | only styles content/close; behavior = Bootstrap JS |
| Misc | `.ds-avatar-edit-badge`, `.ds-progress-bar-danger` | profile, home | |

### Bootstrap overrides

* Button variants entirely via `--bs-btn-*` custom properties (idiomatic Bootstrap 5.3).
* `.form-control.ds-input` / `.form-select.ds-input` padding/radius/focus overrides.
* `.form-check-input.ds-switch` brand-colored switch.
* `body { --bs-primary... }` variable remap.
* `.btn { --bs-btn-font-weight: 600 }` global tweak.
* `.ds-modal .btn-close` focus-shadow override.

### Media queries / responsive behavior

* **None.** The design is a fixed 480px mobile column on all viewports
  (only `min(100%, 480px)` clamping and `env(safe-area-inset-bottom)`).
* `index.html` uses Bootstrap `row/col-md-6` grid — the only responsive grid usage.

### Duplicated declarations

* Hero-card gradient/radius/shadow trio inlined 6× while `.ds-card-hero` exists unused.
* `ds-input-amount` styles re-declared inline on `add_expense_manually.html`.
* `.ds-progress` vs `.ds-wizard-progress` are near-identical (10px vs 8px, same children).
* Legend dot colors inline-repeated 8× instead of tint classes.
* `.ds-period-nav` duplicated in two page `<style>` blocks.

### Unused-looking styles

`.ds-card-xl`, `.ds-card-hero`, `.ds-card-rows`, `.ds-card-lg` (used once, as dupe of ds-card),
`.ds-input-amount .prefix`, `.ds-icon-avatar-lg`, `.ds-row-value-success`, `.ds-row-value-error`,
`.ds-chevron`, `.ds-heading-bold`, `.ds-text-center-block`, `.ds-amount-display`,
`.ds-progress-bar.over`, `.ds-nav-item.active`, `.ds-filter-btn.filter-active`
(last two are used **by JS only**, not markup). Do not delete before verifying.

---

## 6. JavaScript Behavior Inventory

### 6.1 `js/transaction-filter.js` (shared by both expenses pages)

Pure DOM filtering, no storage/network:

| Behavior | Detail | Svelte translation |
|---|---|---|
| Event listeners | `form#filterForm submit`, `#filterReset click`, `#filterClear click` | Svelte `onsubmit`/`onclick` |
| Filtering | Reads `#filterSearch` (lowercased contains on `data-name`), `#filterCategory` (exact `data-category`), `#filterFrom`/`#filterTo` (string compare on ISO `data-date`) | `$derived` filtered array of transactions |
| DOM manipulation | toggles `d-none` on `.ds-transaction[data-group]` and `.ds-date-header[data-group]` | `{#each}` over derived list, grouped by date |
| Empty state | shows `#transactionsEmpty` when no group visible | `{#if}` |
| Status banner | shows `#filterStatus` when any filter active, with Clear button | `{#if}` + reset function |
| Funnel highlight | toggles `.filter-active` on `#filterButton` | `$derived` boolean → class |
| Modal close | `bootstrap.Modal.getInstance(modalEl).hide()` after submit | Svelte-state modal `bind:open=false` |
| Modal open | Bootstrap `data-bs-toggle`/`data-bs-target` attributes | Svelte state |

### 6.2 Inline script — `add_expense_manually.html`

Item sub-list manager inside the Add Expense form:

* `formatRp` / `parseRp` — Indonesian Rupiah formatting (`toLocaleString('id-ID')`) and digit-only parsing. **Duplicated verbatim in budget_settings.html** → extract to `src/lib/utils/money.ts`.
* Instantiates `new bootstrap.Modal(#addItemModal)` directly (JS API, not data attributes).
* `show.bs.modal` → clears `is-invalid` on all inputs; `input` on name/price clears invalid + live-formats price.
* Form submit → validates name (non-empty), qty (≥1), price (>0); on failure adds `is-invalid`; on success builds a `ds-transaction` row via `innerHTML` + `textContent`, appends to `#savedItems`, resets form, `modal.hide()`.
* Delegated click on `#savedItems` removes a row via `.remove-item` button.
* **No persistence** — items live only in DOM.

### 6.3 Inline script — `budget_settings.html`

Category budget CRUD:

* Same `formatRp`/`parseRp` helpers.
* `new bootstrap.Modal(#categoryBudgetModal)`; modal opened via `data-bs-toggle` buttons carrying `data-mode="add|edit"`, `data-category`, `data-amount`.
* `show.bs.modal` handler: reads `event.relatedTarget.dataset` to switch add/edit mode; in edit mode disables the category select and pre-fills amount; tracks `editingRow`.
* Amount input live-formats to Rp while typing.
* Submit: validates select + amount > 0; **edit** → adjusts `unallocated += previous - new`, updates row `dataset` and label; **add** → builds row via `innerHTML` using a hardcoded `ICONS` map (category → icon class + tint class), inserts before the "Add" button, `unallocated -= amount`.
* Delegated click on delete buttons: `unallocated += amount`, removes row.
* `syncUnallocated()` updates both the page figure and the modal figure.
* **No persistence.**

### 6.4 Absent behaviors

* No `fetch`/AJAX anywhere. No localStorage/sessionStorage. No URL manipulation.
* No form submits actually navigate (all forms are decorative or JS-handled).
* No dropdowns, tabs, accordions, toasts, tooltips, popovers.
* `scan_receipt_camera.html`, `ocr_processing.html`, `expense_result.html`,
  `settings.html`, `profile_settings.html`, `register.html`,
  `tracking_preference.html`, `budget_reset_date.html`,
  `general_budget_setup_expanded.html`, `categories_management.html`,
  `home.html`, `index.html` have **no custom JS at all** (only Bootstrap bundle).

### Global variables

None leak to global scope — all scripts are IIFEs. Only implicit globals are
Bootstrap's `bootstrap` bundle object.

---

## 7. Bootstrap Usage

### Version & loading

* **Bootstrap 5.3.3** CSS + **bundle JS** (includes Popper) from jsDelivr, every page.
* **Bootstrap Icons 1.11.3** CSS from jsDelivr, every page.

### Bootstrap JS components actually used

| Component | Where | How invoked | Migration note |
|---|---|---|---|
| **Modal** | expenses ×2 (filter), add_expense (Add Item), budget_settings (Category Budget) | 1× `new bootstrap.Modal()` + `show/hide` events (add_expense, budget_settings); `data-bs-toggle` attributes (filter) | Replace with Svelte-state `Modal.svelte` per AGENTS.md. The `show.bs.modal`/`relatedTarget` pattern maps to props passed on open. |
| Everything else (dropdown, collapse, offcanvas, tabs, tooltip, popover, toast) | — | not used | n/a |

### Bootstrap CSS components used

* Grid: `container`, `row`, `col-md-6` (index only), `col-6/col-4/col-2/col-8` (forms).
* Buttons: `.btn`, `.btn-close`.
* Forms: `.form-control`, `.form-select`, `.form-check`/`.form-switch`, `is-invalid`.
* Modal markup: `.modal`, `.modal-dialog(-centered)`, `.modal-content/header/body/footer`, `.modal-title`.
* Utilities: spacing (`p-* m*-* mt-* mb-* py-* px-* gap-*`), flex (`d-flex`, `align-items-*`, `justify-content-*`, `flex-column`, `flex-grow-1`, `flex-shrink-0`), text (`text-center`, `fw-bold/semibold`, `fs-*`, `text-secondary`, `text-body`, `text-decoration-*`, `text-primary`), sizing (`w-100`, `w-50`, `w-75`, `mw-*`), misc (`d-grid`, `d-none` (JS), `ms-auto`, `mx-auto`, `shadow`, `bg-transparent`, `border-0`, `bg-transparent border-0 p-0`, `position-relative`).
* `.hr`/`<hr>` styling with inline border-color.

### Custom overrides

See §5 "Bootstrap overrides" — token remap on `body`, button variants, input
and switch restyles, modal skin. No `!important` fights except 2 inline styles
(categories CTA shadow, wizard "Add Category" border).

---

## 8. CDN Dependencies

| URL | Library | Purpose | Files | Essential? | npm replacement |
|---|---|---|---|---|---|
| `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css` | Bootstrap CSS | base styling | all 16 | Yes | `bootstrap` (or `@popperjs` not needed for CSS-only) — **recommended: install via npm, import in layout** |
| `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js` | Bootstrap JS bundle | modal behavior (3 modals) | all 16 | Only for modals | **Should be dropped** — modals move to Svelte state per AGENTS.md |
| `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css` | Bootstrap Icons | all iconography (~60 distinct icons) | all 16 | Yes | `bootstrap-icons` npm package |
| `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700` | Google Fonts | UI font + serif figure font | all 16 | Yes | `@fontsource/inter` + `@fontsource/playfair-display`, or keep CDN |
| `https://fonts.googleapis.com` / `fonts.gstatic.com` preconnects | — | font perf | all 16 | — | n/a |

Note: **every** page loads the Bootstrap JS bundle even though only 4 pages
have modals; 12 pages load it for nothing.

---

## 9. Asset Inventory

The static templates contain **no local binary assets**:

* **Images:** none (avatar "photo" is a CSS gradient; camera gallery thumbnail is a CSS-drawn placeholder div).
* **Icons:** Bootstrap Icons font (CDN), ~60 distinct `bi-*` glyphs.
* **Fonts:** Inter + Playfair Display via Google Fonts (CDN).
* **SVGs:** none.
* **Favicon:** none defined.
* **External assets:** CDN items listed in §8 only.
* **Other static files:** `css/design-system.css`, `js/transaction-filter.js` only.

No files need copying into SvelteKit `static/` except possibly a favicon (absent today).

---

## 10. Proposed Svelte Architecture

```text
src/
├── lib/
│   ├── components/
│   │   ├── ui/                        ← generic reusable UI
│   │   │   ├── Modal.svelte           (ds-modal skin, bind:open, snippet body/header/footer)
│   │   │   ├── FormField.svelte       (label + ds-input, optional icon, error state)
│   │   │   ├── ProgressBar.svelte     (value, variant: default|danger|thin|wizard)
│   │   │   └── IconAvatar.svelte      (tint + icon, size sm/md/lg)
│   │   ├── layout/
│   │   │   ├── AppShell.svelte        (ds-shell column wrapper)
│   │   │   ├── TopBar.svelte          (3 variants via props/snippets: back, brand, title, step counter)
│   │   │   ├── BottomNav.svelte       (active tab prop; pill vs raised-scan variants)
│   │   │   └── FooterCta.svelte       (fixed bottom primary button)
│   │   └── domain/
│   │       ├── TransactionRow.svelte  (icon avatar, name, category, amount, over-state, remove action)
│   │       ├── TransactionList.svelte (date-grouped rows + empty state)
│   │       ├── BudgetSummaryCard.svelte (total/budget/remaining + progress + per-category rows; over-budget variant)
│   │       ├── CategoryBreakdown.svelte (donut + legend rows)
│   │       ├── TransactionFilterModal.svelte (search/category/date-range form)
│   │       ├── CategoryBudgetRow.svelte (edit/delete actions)
│   │       ├── CategoryBudgetModal.svelte (add/edit form + unallocated figure)
│   │       ├── AddItemModal.svelte    (item name/qty/price form)
│   │       ├── SettingsRow.svelte     (icon, title, value/chevron link row)
│   │       ├── AlertBanner.svelte     (category over-budget alert)
│   │       └── DonutChart.svelte      (conic-gradient from data prop)
│   ├── stores/
│   │   └── (none needed yet — all state is page-local; add only when real data lands)
│   ├── utils/
│   │   └── currency.ts                (formatRp / parseRp — currently duplicated twice)
│   └── types/
│       ├── transaction.ts             (Transaction: id, name, category, date, amount, icon, tint)
│       ├── category.ts                (Category: name, icon, tint, isSystem)
│       └── budget.ts                  (CategoryBudget, BudgetSummary, FilterState)
└── routes/
    ├── +layout.svelte                 (fonts, Bootstrap CSS, design-system.css, global reset)
    ├── /                              (replaces index.html — dev gallery, optional)
    ├── /register
    ├── /onboarding/tracking-preference
    ├── /onboarding/budget-reset-date
    ├── /onboarding/budget-setup
    ├── /                              or /home
    ├── /expenses                      (one route; over-budget = data-driven state, not a 2nd page)
    ├── /expenses/add
    ├── /scan                          (camera screen)
    ├── /scan/processing               (OCR loading)
    ├── /expenses/result               (expense_result)
    ├── /settings
    ├── /settings/profile
    ├── /settings/budget
    └── /settings/categories
```

Design-system CSS: keep `design-system.css` as-is initially (imported globally
in the root layout); refactor into tokens + component styles in the CSS-cleanup pass.

---

## 11. Recommended Migration Order

Rationale: start low-complexity and representative; each step builds shared
components used by later, harder pages.

| Step | Target | Why |
|---|---|---|
| 0 | SvelteKit scaffold: root `+layout.svelte` (fonts, Bootstrap CSS, design-system.css, icons), `src/app.css` wiring, `utils/currency.ts`, types | Foundation; no page risk |
| 1 | **`ocr_processing.html`** → `/scan/processing` | Simplest page, zero JS, exercises shell + tokens |
| 2 | **`register.html`** → `/register` | Form basics, no behavior, tests `ds-input`/buttons |
| 3 | **`tracking_preference.html`** → onboarding route | First interactive state (`selected` toggle), still trivial |
| 4 | **`budget_reset_date.html`** | Option tiles + wizard progress; small state |
| 5 | **`general_budget_setup_expanded.html`** | Cards + rows; wizard complete |
| 6 | **`settings.html`** + extract `TopBar`/`BottomNav`/`SettingsRow` | First real layout components; many simple links |
| 7 | **`profile_settings.html`**, **`categories_management.html`** | More forms/rows; reuse extracted components |
| 8 | **`home.html`** | Hero, alert banner, quick actions, transactions, bottom nav — consolidation step |
| 9 | **`expense_result.html`**, **`scan_receipt_camera.html`** | Mostly static; camera screen is layout-only |
| 10 | **`add_expense_manually.html`** | First modal (Add Item) + validation + dynamic rows — validates the `Modal.svelte` pattern |
| 11 | **`main_expenses_page.html`** (with over-budget as state) | Most complex: filter modal + `transaction-filter.js` logic + donut; overbudget variant merged as a prop/derived state |
| 12 | **`index.html`** | Dev gallery — migrate last or drop (decide with user) |
| 13 | CSS cleanup pass, CDN → npm moves, remove Bootstrap JS bundle | Final phases per AGENTS.md |

---

## 12. Risks and Unknowns

1. **Base font size is non-default.** `--bs-body-font-size: 0.9rem` (14px) via
   `body` override. Bootstrap spacing/`fs-*` utilities still work, but any
   "replace inline style with utility" mapping must be verified against this
   scaled base (e.g., `fs-5` ≠ 1.25rem visually identical to original intent).
   Per AGENTS.md, verify `$spacer`-dependent mappings before replacing inline styles.
2. **Two expenses pages = one page.** Must migrate as a single route with
   over-budget state; otherwise visual QA divergence. Confirm no other
   state differences exist beyond the Shopping row (diff shows only that).
3. **Donut chart is hardcoded.** `conic-gradient` segments and legend colors are
   baked into CSS + repeated inline hexes (`#EF4444`, `#6B7280`). Migration must
   parameterize without changing rendered output.
4. **`100dvh` and `env(safe-area-inset-bottom)`** used for mobile shell —
   fine in Svelte, but SSR/hydration differences don't apply (pure CSS); just
   don't "simplify" to `100vh`.
5. **Modal focus behavior.** Replacing Bootstrap JS modals with Svelte state
   loses Bootstrap's focus trap/scroll-lock/ESC handling unless the custom
   `Modal.svelte` reimplements it. AGENTS.md prefers Svelte state; decide how
   much fidelity (focus restore, backdrop click, Esc key) is required.
6. **`show.bs.modal` + `relatedTarget` pattern** (budget_settings add/edit mode)
   depends on which button opened the modal — must become explicit props/state
   in Svelte.
7. **No backend.** All data is hardcoded; filtering/CRUD is client-only and
   non-persistent. Decisions needed later: mock data layer via `+page.ts` load
   functions vs in-component `$state`. No API contract exists yet — types are
   inferred from markup (`data-*` attributes).
8. **Currency formatting duplicated** in two inline scripts — safe to extract,
   but `parseRp` strips non-digits (breaks on decimals); preserve behavior as-is.
9. **Unused CSS classes** (§5) — tempting to delete during CSS cleanup, but some
   are used by JS (`.filter-active`, `d-none` toggles, `.amount.over` via
   innerHTML templates). Verify with runtime QA before removal.
10. **`!important` inline styles** (categories CTA shadow, wizard add-budget
    border) fight utility classes; need dedicated classes in cleanup pass.
11. **Bootstrap JS bundle removal** affects all pages; ensure no hidden reliance
    (e.g., `data-bs-toggle` on filter funnel button) before removal.
12. **index.html purpose unclear** — is the UI gallery part of the product or a
    designer's scratch file? Confirm before routing it.
13. **Icons via CDN font** — keep during migration; moving to npm
    `bootstrap-icons` is a later-phase, mechanical change.
14. **Register/login flow incomplete** — there is no login page, no route
    guards, no auth state. Migration should not invent them.

---

## 13. Risk Mitigations (agreed approach per risk)

Decisions on record before Phase 2 begins.

### R1 — Non-default 0.9rem base font

* Keep `body { --bs-body-font-size: 0.9rem }` **verbatim** in the global
  stylesheet during migration — do not "normalize" to 1rem.
* Rule for the CSS cleanup pass: an inline style may only be replaced by a
  Bootstrap utility if the computed value matches the original (verify in
  devtools during visual QA). When in doubt, keep or create a `ds-*` class.
* Add a one-line comment in the root layout next to the stylesheet import
  warning about the scaled base font.

### R2 — Two expenses pages → one route

* Verified by diff: the only differences are the Shopping legend/amount
  over-budget styling (`ds-money-error` + `amount over` classes) and the
  `<title>`. Everything else is identical.
* Encode those differences as data (`overBudget: boolean` driving the progress
  variant, error classes, and page title). The migrated route must render
  identically in both states — check with screenshot comparison.

### R3 — Hardcoded donut chart

* `DonutChart.svelte` takes `segments: { color: string; pct: number }[]` and
  builds the identical `conic-gradient` string.
* Keep the exact hex values (`#EF4444`, `#6B7280`, `var(--ds-warning)`,
  `var(--ds-brand-primary)`) as defaults so the first render is pixel-identical.
* Confirm equivalence via screenshot diff before any data-driven change.

### R4 — Modal focus / ESC / scroll-lock fidelity

* Modal contract (decided): the custom `Modal.svelte` implements
  1. Esc key closes,
  2. backdrop click closes,
  3. `overflow: hidden` on `<body>` while open,
  4. focus moves into the modal on open and is restored to the trigger on close.
* Full tab-cycling focus **trapping** is deferred: add it only if visual QA
  shows it matters, either hand-rolled or via a small documented dependency
  (e.g., `focus-trap`). Do not silently drop it — document the gap.

### R5 — `show.bs.modal` + `relatedTarget` pattern

* Does not migrate; it dissolves. The opener sets state before toggling:
  `editingBudget = row; showModal = true` (add mode: `editingBudget = null`).
* Do not attempt to emulate the event/`relatedTarget` pattern in Svelte.
* Note this in the Modal component usage docs so the pattern isn't re-invented.

### R6 — No backend / no API contract

* Create `src/lib/types/` now with interfaces inferred from markup
  (`Transaction`, `CategoryBudget`, `FilterState`) — see §10.
* Put hardcoded demo data in `+page.ts` load functions, not inline `$state`,
  so that when a real backend arrives only the load functions change and
  components are untouched.
* No mock API, no invented endpoints.

### R7 — `parseRp` digit-stripping

* Preserve exactly as-is in `src/lib/utils/currency.ts`:
  `Number(s.replace(/[^\d]/g, '')) || 0`, with a comment that decimals are
  intentionally unsupported (existing behavior).
* Add unit tests documenting current behavior (e.g., `'Rp 1.500'` → 1500,
  `'abc'` → 0). Do not "improve" the parser during migration.

### R8 — Unused CSS classes

* Do not delete anything during migration phases.
* Before the CSS-cleanup pass, verify usage with a runtime coverage check
  (load every page, inspect applied rules) **and** grep the JS-generated
  `innerHTML` templates — `.amount.over` and budget-row markup are created
  dynamically and are not visible to static analysis.
* Only then remove classes, one PR per logical group, with visual QA after each.

---

## 13. Risk Mitigations (agreed approach per risk)

Decisions on record before Phase 2 begins.

### R1 — Non-default 0.9rem base font

* Keep `body { --bs-body-font-size: 0.9rem }` **verbatim** in the global
  stylesheet during migration — do not "normalize" to 1rem.
* Rule for the CSS cleanup pass: an inline style may only be replaced by a
  Bootstrap utility if the computed value matches the original (verify in
  devtools during visual QA). When in doubt, keep or create a `ds-*` class.
* Add a one-line comment in the root layout next to the stylesheet import
  warning about the scaled base font.

### R2 — Two expenses pages → one route

* Verified by diff: the only differences are the Shopping legend/amount
  over-budget styling (`ds-money-error` + `amount over` classes) and the
  `<title>`. Everything else is identical.
* Encode those differences as data (`overBudget: boolean` driving the progress
  variant, error classes, and page title). The migrated route must render
  identically in both states — check with screenshot comparison.

### R3 — Hardcoded donut chart

* `DonutChart.svelte` takes `segments: { color: string; pct: number }[]` and
  builds the identical `conic-gradient` string.
* Keep the exact hex values (`#EF4444`, `#6B7280`, `var(--ds-warning)`,
  `var(--ds-brand-primary)`) as defaults so the first render is pixel-identical.
* Confirm equivalence via screenshot diff before any data-driven change.

### R4 — Modal focus / ESC / scroll-lock fidelity

* Modal contract (decided): the custom `Modal.svelte` implements
  1. Esc key closes,
  2. backdrop click closes,
  3. `overflow: hidden` on `<body>` while open,
  4. focus moves into the modal on open and is restored to the trigger on close.
* Full tab-cycling focus **trapping** is deferred: add it only if visual QA
  shows it matters, either hand-rolled or via a small documented dependency
  (e.g., `focus-trap`). Do not silently drop it — document the gap.

### R5 — `show.bs.modal` + `relatedTarget` pattern

* Does not migrate; it dissolves. The opener sets state before toggling:
  `editingBudget = row; showModal = true` (add mode: `editingBudget = null`).
* Do not attempt to emulate the event/`relatedTarget` pattern in Svelte.
* Note this in the Modal component usage docs so the pattern isn't re-invented.

### R6 — No backend / no API contract

* Create `src/lib/types/` now with interfaces inferred from markup
  (`Transaction`, `CategoryBudget`, `FilterState`) — see §10.
* Put hardcoded demo data in `+page.ts` load functions, not inline `$state`,
  so that when a real backend arrives only the load functions change and
  components are untouched.
* No mock API, no invented endpoints.

### R7 — `parseRp` digit-stripping

* Preserve exactly as-is in `src/lib/utils/currency.ts`:
  `Number(s.replace(/[^\d]/g, '')) || 0`, with a comment that decimals are
  intentionally unsupported (existing behavior).
* Add unit tests documenting current behavior (e.g., `'Rp 1.500'` → 1500,
  `'abc'` → 0). Do not "improve" the parser during migration.

### R8 — Unused CSS classes

* Do not delete anything during migration phases.
* Before the CSS-cleanup pass, verify usage with a runtime coverage check
  (load every page, inspect applied rules) **and** grep the JS-generated
  `innerHTML` templates — `.amount.over` and budget-row markup are created
  dynamically and are not visible to static analysis.
* Only then remove classes, one PR per logical group, with visual QA after each.
