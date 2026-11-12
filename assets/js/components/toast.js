/**
 * Himalayan Prefab Solutions ERP
 * Enterprise Toast Notification System
 */

var Toast = {
  container: null,

  init() {
    if (!this.container) {
      let el = document.getElementById("toast-container");
      if (!el) {
        el = document.createElement("div");
        el.id = "toast-container";
        document.body.appendChild(el);
      }
      this.container = el;
    }
  },

  show(message, type = "info", title = "") {
    this.init();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    else if (type === "error") iconName = "alert-triangle";
    else if (type === "warning") iconName = "alert-triangle";

    const defaultTitle =
      type === "success" ? "Success" : type === "error" ? "Error" : type === "warning" ? "Notice" : "Information";

    toast.innerHTML = `
      <div class="toast-icon" style="color: ${
        type === "success"
          ? "var(--color-success)"
          : type === "error"
          ? "var(--color-danger)"
          : type === "warning"
          ? "var(--color-warning)"
          : "var(--color-primary)"
      }">
        ${Utils.renderIcon(iconName, 18)}
      </div>
      <div class="toast-content">
        <div class="toast-title">${Utils.escapeHtml(title || defaultTitle)}</div>
        <div class="toast-message">${Utils.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" type="button" aria-label="Dismiss">
        ${Utils.renderIcon("x", 14)}
      </button>
    `;

    this.container.appendChild(toast);

    const dismiss = () => {
      toast.classList.add("toast-hiding");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    };

    toast.querySelector(".toast-close").addEventListener("click", dismiss);

    // Auto dismiss after 4 seconds
    setTimeout(dismiss, 4000);
  },

  success(message, title = "Success") {
    this.show(message, "success", title);
  },

  error(message, title = "Error") {
    this.show(message, "error", title);
  },

  warning(message, title = "Warning") {
    this.show(message, "warning", title);
  },

  info(message, title = "Notice") {
    this.show(message, "info", title);
  }
};

window.Toast = Toast;

