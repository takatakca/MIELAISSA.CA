/* Coupon copy is progressive enhancement; the code is selectable without JS. */
(() => {
  'use strict';
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-ma-copy]');
    if (!button) return;
    const code = button.getAttribute('data-ma-copy');
    if (!code) return;
    const previous = button.textContent;
    try {
      if (!window.isSecureContext || !navigator.clipboard) throw new Error('Unavailable');
      await navigator.clipboard.writeText(code);
      button.textContent = button.getAttribute('data-ma-done') || previous;
      button.setAttribute('aria-live', 'polite');
      window.setTimeout(() => { button.textContent = previous; }, 1800);
    } catch (_error) {
      const value = button.parentElement && button.parentElement.querySelector('strong');
      if (!value) return;
      const range = document.createRange();
      range.selectNodeContents(value);
      const selection = window.getSelection();
      if (selection) { selection.removeAllRanges(); selection.addRange(range); }
    }
  });
})();
