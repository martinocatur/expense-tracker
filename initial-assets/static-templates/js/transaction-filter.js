/* Transaction filter — shared component for expenses pages.
   Expects: #filterModal, #filterForm, #filterSearch, #filterCategory,
   #filterFrom, #filterTo, #filterReset, #filterClear, #filterStatus,
   #transactionsEmpty, #filterButton, and .ds-transaction[data-group]
   grouped under .ds-date-header[data-group]. */
(function () {
  'use strict';

  const modalEl = document.getElementById('filterModal');
  if (!modalEl) return;

  const form = document.getElementById('filterForm');
  const searchInput = document.getElementById('filterSearch');
  const categorySelect = document.getElementById('filterCategory');
  const fromInput = document.getElementById('filterFrom');
  const toInput = document.getElementById('filterTo');
  const resetBtn = document.getElementById('filterReset');
  const clearBtn = document.getElementById('filterClear');
  const statusEl = document.getElementById('filterStatus');
  const emptyEl = document.getElementById('transactionsEmpty');
  const funnelBtn = document.getElementById('filterButton');

  function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const from = fromInput.value;
    const to = toInput.value;
    const hasActive = Boolean(search || category || from || to);

    const visibleGroups = new Set();
    document.querySelectorAll('.ds-transaction[data-group]').forEach(tx => {
      const name = (tx.dataset.name || '').toLowerCase();
      const match =
        (!search || name.includes(search)) &&
        (!category || tx.dataset.category === category) &&
        (!from || (tx.dataset.date && tx.dataset.date >= from)) &&
        (!to || (tx.dataset.date && tx.dataset.date <= to));
      tx.classList.toggle('d-none', !match);
      if (match) visibleGroups.add(tx.dataset.group);
    });

    document.querySelectorAll('.ds-date-header[data-group]').forEach(header => {
      header.classList.toggle('d-none', !visibleGroups.has(header.dataset.group));
    });

    const anyVisible = visibleGroups.size > 0;
    if (emptyEl) emptyEl.style.display = anyVisible ? 'none' : 'block';
    if (statusEl) statusEl.style.display = hasActive ? 'flex' : 'none';
    if (funnelBtn) funnelBtn.classList.toggle('filter-active', hasActive);
  }

  function resetFilters() {
    form.reset();
    applyFilters();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
    bootstrap.Modal.getInstance(modalEl).hide();
  });

  resetBtn.addEventListener('click', resetFilters);
  clearBtn.addEventListener('click', resetFilters);
})();
