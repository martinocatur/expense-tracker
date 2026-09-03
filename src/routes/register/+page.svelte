<script lang="ts">
	// Structural migration of initial-assets/static-templates/register.html.
	// The original page has no custom JavaScript; the form uses native submit
	// behavior (no action → page reload), which is preserved as-is.
	// Inline styles are intentionally preserved (CSS cleanup is a later phase).
</script>

<svelte:head>
	<title>Register · ExpenseTracker</title>
</svelte:head>

<main class="ds-shell">
	<div class="ds-content ds-content--no-nav d-flex flex-column">
		<header class="text-center mt-5 pt-4">
			<h1 class="ds-brand-heading mb-3">ExpenseTracker</h1>
			<p class="ds-subtitle mb-0">Create your account to start managing your finances.</p>
		</header>

		<section
			class="ds-card p-4 mt-4"
			style="border-radius: var(--ds-radius-xl); position: relative; overflow: hidden;"
		>
			<div
				style="position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#BFD3F8,#9DBBF5);"
			></div>

			<form>
				<div class="mb-4">
					<label for="fullName" class="ds-label">Full Name</label>
					<input type="text" class="form-control ds-input" id="fullName" value="John Doe" />
				</div>

				<div class="mb-4">
					<label for="email" class="ds-label">Email Address</label>
					<input
						type="email"
						class="form-control ds-input"
						id="email"
						placeholder="name@company.com"
					/>
				</div>

				<div class="mb-4">
					<label for="password" class="ds-label">Password</label>
					<input type="password" class="form-control ds-input" id="password" value="password" />
				</div>

				<button type="submit" class="btn ds-btn-primary w-100 mb-4 fw-bold">Create Account</button>

				<div class="ds-divider-labeled mb-4">OR</div>

				<button
					type="button"
					class="btn ds-btn-outline w-100 d-flex align-items-center justify-content-center gap-2"
				>
					<i class="bi bi-google" style="color:#EA4335;"></i>
					<span>Continue with Google</span>
				</button>
			</form>
		</section>

		<footer class="text-center mt-auto pt-5 pb-3">
			<p class="ds-subtitle mb-0" style="font-size:0.95rem;">
				By continuing, you agree to our
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class="text-body">Terms of Service</a> and
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class="text-body">Privacy Policy</a>.
			</p>
		</footer>
	</div>
</main>
