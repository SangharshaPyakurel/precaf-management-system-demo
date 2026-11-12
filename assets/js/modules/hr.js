/**
 * Himalayan Prefab Solutions ERP
 * MODULE 18 — WORKFORCE & HUMAN RESOURCES
 */

const ModuleHR = (container) => {
  const employees = AppState.getEmployees();
  const currentRole = AppState.getRole();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Workforce & Personnel Directory",
      description: "Manage 15 corporate executives, structural engineers, factory fabrication teams, site supervisors, and storekeepers across Nepal.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Workforce & HR" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="hr-export-btn">
          ${Utils.renderIcon("download", 14)} Export Staff List
        </button>
      `
    })}

    <!-- Role Simulation Switcher Card -->
    <div class="card" style="margin-bottom:var(--space-5); padding:var(--space-4) var(--space-5); background:linear-gradient(to right, #EFF6FF, #FFFFFF); border-color:#BFDBFE;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-weight:600; font-size:14px; color:var(--color-primary);">Demo Interactive Role Switcher</div>
          <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">
            Simulate how different corporate stakeholders experience Himalayan Prefab ERP. Current Persona: <strong>${currentRole}</strong>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <select class="form-control" id="hr-role-switcher-select" style="width:200px; height:34px; font-weight:600;">
            <option value="Super Admin" ${currentRole === "Super Admin" ? "selected" : ""}>Super Admin (Er. Sandesh)</option>
            <option value="Project Manager" ${currentRole === "Project Manager" ? "selected" : ""}>Project Manager (Er. Prakash)</option>
            <option value="Sales" ${currentRole === "Sales" ? "selected" : ""}>Sales Head (Deepak Basnet)</option>
            <option value="Engineer" ${currentRole === "Engineer" ? "selected" : ""}>CAD Engineer (Er. Anupama)</option>
            <option value="Production Manager" ${currentRole === "Production Manager" ? "selected" : ""}>Factory Lead (Manoj Maharjan)</option>
            <option value="Site Supervisor" ${currentRole === "Site Supervisor" ? "selected" : ""}>Site Supervisor (Bishal Thapa)</option>
            <option value="Storekeeper" ${currentRole === "Storekeeper" ? "selected" : ""}>Storekeeper (Nabin Giri)</option>
            <option value="Accountant" ${currentRole === "Accountant" ? "selected" : ""}>Senior Accountant (Prativa)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Table Mount -->
    <div id="hr-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("hr-table-mount"),
    columns: [
      {
        key: "id",
        label: "Emp ID",
        width: "90px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${val}</span>`
      },
      {
        key: "name",
        label: "Employee & Designation",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.designation)}</div>
          </div>
        `
      },
      {
        key: "department",
        label: "Department",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "role",
        label: "System Role",
        render: (val) => `<span class="badge badge-primary text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "phone",
        label: "Contact Phone / Email",
        render: (val, row) => `
          <div class="text-xs">
            <div>${val}</div>
            <div class="text-muted">${row.email}</div>
          </div>
        `
      },
      {
        key: "status",
        label: "Status",
        render: (val) => Utils.renderStatusBadge(val)
      }
    ],
    data: employees,
    searchFields: ["name", "designation", "department", "role", "id"]
  });

  // Export CSV
  document.getElementById("hr-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_employee_directory", AppState.getEmployees());
  });

  // Switch role
  document.getElementById("hr-role-switcher-select")?.addEventListener("change", (e) => {
    const newRole = e.target.value;
    AppState.setRole(newRole);
    Toast.info(`Switched persona to: ${newRole}`);
  });
};

window.ModuleHR = ModuleHR;

