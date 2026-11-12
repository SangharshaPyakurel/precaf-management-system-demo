/**
 * Himalayan Prefab Solutions ERP
 * Reusable Modal & Confirmation Dialog Component
 */

var Modal = {
  activeBackdrop: null,

  /**
   * Open standard modal
   */
  open({ title = "", content = "", footer = null, size = "md", onClose = null }) {
    this.close();

    const sizeClass = size === "lg" ? "modal-lg" : size === "xl" ? "modal-xl" : size === "sm" ? "modal-sm" : "";

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "app-active-modal";

    backdrop.innerHTML = `
      <div class="modal-window ${sizeClass}" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="modal-title">${Utils.escapeHtml(title)}</h3>
          <button type="button" class="modal-close-btn" aria-label="Close modal">
            ${Utils.renderIcon("x", 18)}
          </button>
        </div>
        <div class="modal-body">
          ${typeof content === "string" ? content : ""}
        </div>
        ${
          footer !== null
            ? `<div class="modal-footer">${footer}</div>`
            : ""
        }
      </div>
    `;

    if (typeof content !== "string" && content instanceof HTMLElement) {
      backdrop.querySelector(".modal-body").appendChild(content);
    }

    document.body.appendChild(backdrop);
    this.activeBackdrop = backdrop;

    // Trigger open transition
    requestAnimationFrame(() => {
      backdrop.classList.add("open");
    });

    const closeHandler = () => {
      this.close();
      if (typeof onClose === "function") onClose();
    };

    backdrop.querySelector(".modal-close-btn").addEventListener("click", closeHandler);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeHandler();
    });

    // Keyboard ESC to close
    const escListener = (e) => {
      if (e.key === "Escape") {
        closeHandler();
        document.removeEventListener("keydown", escListener);
      }
    };
    document.addEventListener("keydown", escListener);
  },

  /**
   * Reusable Confirmation Dialog
   */
  confirm({
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    onConfirm = () => {}
  }) {
    const footerHtml = `
      <button type="button" class="btn btn-secondary modal-cancel-btn">${Utils.escapeHtml(cancelText)}</button>
      <button type="button" class="btn btn-${confirmVariant} modal-confirm-btn">${Utils.escapeHtml(confirmText)}</button>
    `;

    const contentHtml = `
      <div style="display:flex; align-items:flex-start; gap:16px;">
        <div style="color:${confirmVariant === "danger" ? "var(--color-danger)" : "var(--color-primary)"}; flex-shrink:0;">
          ${Utils.renderIcon(confirmVariant === "danger" ? "alert-triangle" : "info", 24)}
        </div>
        <div style="font-size:14px; color:var(--color-text-secondary); line-height:1.5;">
          ${message}
        </div>
      </div>
    `;

    this.open({
      title,
      content: contentHtml,
      footer: footerHtml,
      size: "sm"
    });

    const confirmBtn = this.activeBackdrop.querySelector(".modal-confirm-btn");
    const cancelBtn = this.activeBackdrop.querySelector(".modal-cancel-btn");

    confirmBtn.addEventListener("click", () => {
      this.close();
      onConfirm();
    });

    cancelBtn.addEventListener("click", () => {
      this.close();
    });
  },

  /**
   * Close active modal
   */
  close() {
    if (this.activeBackdrop && this.activeBackdrop.parentNode) {
      this.activeBackdrop.classList.remove("open");
      setTimeout(() => {
        if (this.activeBackdrop && this.activeBackdrop.parentNode) {
          this.activeBackdrop.parentNode.removeChild(this.activeBackdrop);
          this.activeBackdrop = null;
        }
      }, 200);
    }
  }
};

window.Modal = Modal;

