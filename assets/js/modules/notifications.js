/**
 * Himalayan Prefab Solutions ERP
 * MODULE 23 — NOTIFICATIONS & ACTIVITY TIMELINE
 */

const ModuleNotifications = (container) => {
  function render() {
    const notifications = AppState.getNotifications();

    container.innerHTML = `
      ${Layout.renderPageHeader({
        title: "System Alerts & Operational Activity Log",
        description: "Real-time dispatch notices, milestone payment alerts, QC inspection results, and factory floor updates.",
        breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Notifications" }],
        actions: `
          <button type="button" class="btn btn-secondary btn-sm" id="notif-clear-btn">
            ${Utils.renderIcon("trash", 14)} Clear All
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="notif-mark-read-btn">
            ${Utils.renderIcon("check", 14)} Mark All Read
          </button>
        `
      })}

      <!-- Notifications List -->
      <div class="card" style="margin-bottom:var(--space-6);">
        <div class="card-header">
          <h3 class="card-title">Recent Alerts & Reminders (${notifications.filter((n) => !n.read).length} Unread)</h3>
        </div>
        <div class="card-body" style="padding:0;">
          ${
            notifications.length === 0
              ? '<div class="empty-state"><div class="empty-state-title">No notifications</div></div>'
              : notifications
                  .map((n) => {
                    return `
                <div style="display:flex; align-items:flex-start; justify-content:space-between; padding:14px 20px; border-bottom:1px solid #F1F5F9; background:${n.read ? "#FFFFFF" : "#F8FAFC"}; cursor:pointer;" class="notif-row" data-id="${n.id}">
                  <div style="display:flex; align-items:flex-start; gap:14px;">
                    <div style="color:${n.priority === "High" ? "var(--color-danger)" : "var(--color-primary)"}; margin-top:2px;">
                      ${Utils.renderIcon(n.priority === "High" ? "alert-triangle" : "bell", 18)}
                    </div>
                    <div>
                      <div style="font-weight:600; font-size:14px; color:var(--color-text-primary); margin-bottom:2px;">
                        ${Utils.escapeHtml(n.title)}
                        ${!n.read ? '<span class="badge badge-primary text-xs" style="margin-left:6px;">New</span>' : ""}
                      </div>
                      <div style="font-size:13px; color:var(--color-text-secondary); line-height:1.4;">
                        ${Utils.escapeHtml(n.message)}
                      </div>
                      <div style="font-size:11px; color:var(--color-text-muted); margin-top:4px;">
                        Category: <strong>${n.category}</strong> &bull; ${n.timestamp}
                      </div>
                    </div>
                  </div>

                  <div style="display:flex; align-items:center; gap:8px;">
                    ${
                      n.link
                        ? `<button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.location.hash='${n.link}';">View Module</button>`
                        : ""
                    }
                  </div>
                </div>
              `;
                  })
                  .join("")
          }
        </div>
      </div>
    `;

    // Mark all read
    document.getElementById("notif-mark-read-btn")?.addEventListener("click", () => {
      AppState.clearNotifications();
      Toast.success("All notifications marked as read.");
      Layout.updateNotificationPreview();
      render();
    });

    // Clear all
    document.getElementById("notif-clear-btn")?.addEventListener("click", () => {
      Storage.set("notifications", []);
      Toast.info("Notifications cleared.");
      Layout.updateNotificationPreview();
      render();
    });

    // Row click mark read
    container.querySelectorAll(".notif-row").forEach((row) => {
      row.addEventListener("click", () => {
        const id = row.getAttribute("data-id");
        AppState.markNotificationRead(id);
        Layout.updateNotificationPreview();
        render();
      });
    });
  }

  render();
};

window.ModuleNotifications = ModuleNotifications;

