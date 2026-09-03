# Static HTML → Svelte Migration Rules

## Objective

Migrate the existing static HTML application into a proper SvelteKit + Svelte 5 + TypeScript + Bootstrap 5 application while preserving the existing visual design and behavior.

The migration must prioritize:

1. Visual fidelity
2. Functional correctness
3. Reusable components
4. Clean Svelte architecture
5. Maintainable CSS
6. Minimal unnecessary dependencies

Do NOT redesign the application during migration.

---

# Technology

Use:

* SvelteKit (latest)
* Svelte 5 with runes
* TypeScript (strict mode)
* Bootstrap 5
* Existing project tooling and package manager
* Existing CSS where necessary

Do not introduce another UI framework unless explicitly requested.

Do not replace Bootstrap with Tailwind.

Do not introduce React, Vue, jQuery, or another frontend framework.

---

# SvelteKit Conventions

This project uses SvelteKit. Follow SvelteKit routing and file conventions.

Pages live at:

```text
src/routes/
├── +page.svelte         ← page component
├── +page.ts             ← page load function (client-safe)
├── +page.server.ts      ← server-only load function
├── +layout.svelte       ← shared layout
└── +layout.server.ts    ← shared layout load
```

Use `load` functions in `+page.ts` or `+page.server.ts` for data fetching.

Do not fetch data directly inside `<script>` using `fetch` unless it is a client-side-only interaction (e.g., a search-as-you-type input after page load).

Use SvelteKit's `$app/navigation`, `$app/stores`, and `$app/environment` imports where appropriate.

Do not invent a custom router.

---

# Svelte 5 Rules

This project uses Svelte 5. Use runes for all reactivity.

Do not use Svelte 4 patterns. The following are forbidden:

```svelte
<!-- Forbidden: Svelte 4 reactive declarations -->
$: doubled = count * 2;
$: if (count > 10) { ... }

<!-- Forbidden: Svelte 4 store auto-subscription shorthand inside components -->
$myStore
```

Use Svelte 5 runes instead:

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    if (count > 10) {
      console.log('count exceeded 10');
    }
  });
</script>
```

## Props

Use `$props()` for component props:

```svelte
<script lang="ts">
  let { label, disabled = false }: { label: string; disabled?: boolean } = $props();
</script>
```

Do not use `export let` for props.

## Bindable props

Use `$bindable()` for two-way bindable props:

```svelte
<script lang="ts">
  let { open = $bindable(false) }: { open?: boolean } = $props();
</script>
```

## Event handling

Svelte 5 uses standard HTML event attributes instead of the `on:` directive:

```svelte
<!-- Correct: Svelte 5 -->
<button onclick={handleClick}>Click</button>

<!-- Forbidden: Svelte 4 directive syntax -->
<button on:click={handleClick}>Click</button>
```

## Snippets

Use `{#snippet}` and `{@render}` instead of slots:

```svelte
<!-- Parent -->
<Modal>
  {#snippet body()}
    <p>Modal content here</p>
  {/snippet}
</Modal>

<!-- Modal.svelte -->
<script lang="ts">
  let { body }: { body: Snippet } = $props();
</script>

<div class="modal-body">
  {@render body()}
</div>
```

Do not use `<slot>` unless there is a compatibility reason.

---

# TypeScript Rules

TypeScript strict mode is enabled. Follow these rules:

* No `any`. Use `unknown` and narrow the type, or define a proper interface.
* All component props must be explicitly typed via `$props()`.
* All function parameters and return types must be typed when they are not trivially inferrable.
* Prefer `interface` over `type` for object shapes.
* Keep types co-located with their usage unless they are shared, in which case place them in `src/lib/types/`.

Example of a well-typed component:

```svelte
<script lang="ts">
  import type { Customer } from '$lib/types/customer';

  let { customer, onDelete }: {
    customer: Customer;
    onDelete: (id: number) => void;
  } = $props();
</script>
```

---

# Migration Philosophy

The migration happens in multiple passes.

Do NOT attempt to solve everything at once.

The migration order is:

1. Inventory
2. HTML → Svelte conversion
3. Functional behavior conversion
4. Reusable component extraction
5. CSS cleanup
6. Bootstrap JavaScript → Svelte state
7. Visual QA
8. Final cleanup

Preserve the existing UI unless explicitly instructed otherwise.

---

# Visual Fidelity

The migrated Svelte application should look as close as possible to the original HTML application.

Do not:

* redesign layouts
* change colors
* change spacing
* change typography
* change component sizes
* change responsive behavior
* remove UI elements
* rename visible labels

unless explicitly requested.

When uncertain, preserve the existing implementation.

---

# CSS Rules

Prefer Bootstrap 5 utility classes when they accurately represent the existing styling.

Examples:

Instead of:

```html
<div style="margin-top: 16px">
```

prefer:

```html
<div class="mt-3">
```

Instead of:

```html
<div style="padding: 16px">
```

prefer:

```html
<div class="p-3">
```

Instead of:

```html
<div style="display: flex; align-items: center">
```

prefer:

```html
<div class="d-flex align-items-center">
```

Note: Bootstrap's spacing scale (`mt-3`, `p-3`, etc.) maps to `1rem` (16px) only when the project uses the default Bootstrap configuration. If the project customizes `$spacer`, verify the mapping before replacing inline styles.

Do not remove inline CSS during the initial HTML → Svelte conversion.

Inline CSS cleanup happens in a later phase (CSS cleanup pass).

Dynamic styles are allowed when the value depends on runtime state:

```svelte
<div style:width={`${progress}%`}>
```

Do not create unnecessary custom CSS when Bootstrap already provides an equivalent utility.

---

# Component Rules

Do not immediately componentize every element.

Extract components when one or more of the following is true:

* The component appears on multiple pages.
* The component represents a meaningful UI concept.
* The component contains meaningful behavior.
* The component has its own state.
* The component is large enough to make the page difficult to understand.
* The component represents a reusable domain concept.

Do NOT create meaningless wrapper components.

Avoid components such as:

```text
Flex.svelte
Text.svelte
Spacing.svelte
Row.svelte
Column.svelte
Div.svelte
```

unless there is a strong architectural reason.

Prefer semantic components:

```text
CustomerCard.svelte
BookingCard.svelte
DeleteCustomerModal.svelte
PageHeader.svelte
Sidebar.svelte
```

---

# Component Organization

Prefer:

```text
src/
├── lib/
│   ├── components/
│   │   ├── ui/         ← generic reusable UI (Modal, Toast, Badge, etc.)
│   │   ├── layout/     ← structural layout (Sidebar, Navbar, PageHeader, etc.)
│   │   └── domain/     ← business-specific (CustomerCard, BookingForm, etc.)
│   ├── stores/         ← shared application state
│   ├── utils/          ← pure utility functions
│   └── types/          ← shared TypeScript interfaces and types
│
└── routes/             ← SvelteKit pages and layouts
```

Generic reusable UI belongs in:

```text
src/lib/components/ui/
```

Layout components belong in:

```text
src/lib/components/layout/
```

Business/domain-specific components belong in:

```text
src/lib/components/domain/
```

Page-specific components may remain next to their route file when they are not reused elsewhere.

---

# State Management

## Local state

Prefer local component state using `$state()` when the data is only needed within one component.

## Shared state (stores)

Use a Svelte store in `src/lib/stores/` when:

* State is shared across multiple unrelated components.
* State needs to persist across route navigations.
* State represents a global concern (e.g., current user, notification queue, sidebar open/closed).

Use Svelte 5's `$state` in a module-level store pattern:

```typescript
// src/lib/stores/auth.svelte.ts
export const auth = $state({
  user: null as User | null,
  loading: false,
});
```

Or use Svelte's built-in `writable` / `readable` from `svelte/store` when interoperability with existing store subscribers is needed.

Do not store derived or computable values in a store. Derive them at the point of use with `$derived()`.

Do not put ephemeral UI state (tooltip open, dropdown open) in a store.

---

# Svelte Rules

Prefer Svelte state over imperative DOM manipulation.

Do not use:

```javascript
document.getElementById(...)
document.querySelector(...)
element.classList.add(...)
element.classList.remove(...)
```

when the behavior can naturally be represented using Svelte state.

Prefer:

```svelte
<script lang="ts">
  let open = $state(false);
</script>

{#if open}
  ...
{/if}
```

Use Svelte event handling and bindings instead of manually manipulating DOM state.

---

# Bootstrap JavaScript

Bootstrap CSS is allowed.

Bootstrap JavaScript should generally NOT be used for interactive components that can be naturally controlled by Svelte state.

Examples of components to implement with Svelte state instead of Bootstrap JS:

* Modal
* Dropdown
* Collapse
* Offcanvas
* Tabs
* Toast

Do not initialize Bootstrap JS components using:

```javascript
new bootstrap.Modal(...)
new bootstrap.Dropdown(...)
new bootstrap.Collapse(...)
```

unless there is a specific reason that Svelte state cannot reasonably replicate the behavior (e.g., complex focus trapping requirements or third-party integration).

When Bootstrap JS is intentionally kept, document the reason with a comment.

---

# Modal Architecture

Modal visibility must be controlled through Svelte state.

Use:

```svelte
let showModal = $state(false);
```

and:

```svelte
<Modal bind:open={showModal}>
  {#snippet body()}
    ...
  {/snippet}
</Modal>
```

Do not use:

```javascript
modal.show()
modal.hide()
```

A generic reusable `Modal.svelte` component in `src/lib/components/ui/` should be created during the component extraction phase.

---

# JavaScript Migration

Preserve existing functionality.

Do not rewrite application logic unnecessarily.

First understand what the existing JavaScript does.

Then translate the behavior into Svelte state and events.

Do not change business rules during migration.

---

# External CDN Dependencies

Do not immediately remove external CDN dependencies.

First identify:

* what the dependency is
* where it is used
* whether it is required
* whether an npm package replacement exists
* whether it should remain as an external CDN resource

Dependency cleanup happens in a later phase.

Do not blindly replace CDN resources.

---

# Verification

After every migration step:

1. Run the project (`npm run dev` or equivalent).
2. Check for TypeScript and Svelte compile errors.
3. Check browser console for runtime errors.
4. Visually inspect the migrated page.
5. Compare against the original page.
6. Fix all regressions before continuing.

Do not continue to the next major phase if the current phase introduces unresolved errors or visual regressions.

---

# Error Handling During Migration

If a migrated component breaks:

1. Revert only the component that broke — do not revert unrelated progress.
2. Inspect the original HTML to understand the intended behavior.
3. Make the smallest fix that restores correct behavior.
4. Do not introduce workarounds that will need to be undone later.

If a type error cannot be immediately resolved cleanly, use a TODO comment and a safe temporary type (prefer `unknown` over `any`):

```typescript
// TODO: type this properly once the API shape is confirmed
const data: unknown = response;
```

Never suppress TypeScript errors with `@ts-ignore` without a documented reason.

---

# Scope Control

Only modify files necessary for the current migration phase.

Do not perform unrelated refactoring.

Do not modify backend code unless explicitly requested.

Do not redesign the application.

Do not upgrade dependencies unless necessary.

Do not change routing architecture unless required.

---

# AI Behavior

Before modifying code:

1. Inspect the relevant files.
2. Understand existing behavior.
3. Identify dependencies.
4. Briefly explain the intended changes.
5. Make the smallest safe change.

When a decision is ambiguous, preserve existing behavior rather than inventing new behavior.

After modifying code, report:

* Files changed
* What changed in each file
* Remaining issues
* Verification performed