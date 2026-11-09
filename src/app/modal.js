import { $, state, refreshIcons } from "./state.js";

const modal = {
  overlay: null,
  closeBtn: null,
  kickerEl: null,
  titleEl: null,
  bodyEl: null,
  lastFocus: null,
  open: false,
  background: [],
};

function initModal() {
  modal.overlay = $("#modalOverlay");
  modal.closeBtn = $("#modalCloseBtn");
  modal.kickerEl = $("#modalKicker");
  modal.titleEl = $("#modalTitle");
  modal.bodyEl = $("#modalBody");

  modal.closeBtn?.addEventListener("click", closeModal);
  modal.overlay?.addEventListener("click", (e) => {
    if (e.target === modal.overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal.open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const controls = [
        ...modal.overlay.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => !element.disabled && element.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
}

function openModal({ kicker, title, htmlBody, kind = "" }) {
  if (modal.open) closeModal();
  modal.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  modal.kickerEl.textContent = kicker || "";
  modal.titleEl.textContent = title || "";
  modal.bodyEl.innerHTML = htmlBody || "";
  modal.bodyEl.scrollTop = 0;
  modal.overlay.dataset.kind = kind;
  modal.closeBtn.setAttribute("aria-label", state.locale === "fa" ? "بستن پنجره" : "Close dialog");
  modal.background = [...document.querySelectorAll(".site-header, .site-main, #siteFooter")].map(
    (element) => ({ element, inert: element.inert }),
  );
  modal.background.forEach(({ element }) => {
    element.inert = true;
  });
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");

  modal.overlay.classList.remove("hidden");
  modal.overlay.classList.add("flex");
  modal.overlay.setAttribute("aria-hidden", "false");

  modal.open = true;
  refreshIcons();
  modal.closeBtn?.focus({ preventScroll: true });
}

function closeModal() {
  modal.overlay.classList.add("hidden");
  modal.overlay.classList.remove("flex");
  modal.overlay.setAttribute("aria-hidden", "true");

  modal.open = false;
  modal.background.forEach(({ element, inert }) => {
    element.inert = inert;
  });
  modal.background = [];
  document.documentElement.classList.remove("modal-open");
  document.body.classList.remove("modal-open");
  modal.bodyEl.innerHTML = "";
  modal.lastFocus?.focus?.();
}

window.SITE_MODAL = { open: openModal, close: closeModal };

export { modal, initModal, openModal, closeModal };
