/**
 * Himalayan Prefab Solutions ERP
 * MODULE 19 — EQUIPMENT & HEAVY MACHINERY
 */

const ModuleEquipment = (container) => {
  const equipment = Storage.get("equipment", SEED_DATA.equipment);

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Equipment & Heavy Machinery Fleet",
      description: "Manage mobile cranes, flatbed prime movers, diesel welding generators, total station survey kits, and factory forklifts.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Equipment & Machinery" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="eqp-export-btn">
          ${Utils.renderIcon("download", 14)} Export Machinery List
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="eqp-table-mount"></div>
  `;

  new DataTable({
    container: document.getElementById("eqp-table-mount"),
    columns: [
      {
        key: "id",
        label: "Machinery ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${val}</span>`
      },
      {
        key: "name",
        label: "Equipment Name & Category",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.category)} &bull; ${Utils.escapeHtml(row.location)}</div>
          </div>
        `
      },
      {
        key: "operator",
        label: "Certified Operator",
        render: (val) => `<span class="text-xs font-medium">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "operatingHours",
        label: "Engine Hours",
        align: "right",
        render: (val) => `<span class="font-mono text-xs">${val.toLocaleString()} hrs</span>`
      },
      {
        key: "maintenanceSchedule",
        label: "Next Service Due",
        render: (val) => `<span class="text-xs font-medium">${Utils.formatDate(val)}</span>`
      },
      {
        key: "condition",
        label: "Condition",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "availability",
        label: "Status",
        render: (val) => Utils.renderStatusBadge(val)
      }
    ],
    data: equipment,
    searchFields: ["id", "name", "category", "operator", "location"]
  });

  // Export CSV
  document.getElementById("eqp-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_machinery_fleet", Storage.get("equipment", SEED_DATA.equipment));
  });
};

window.ModuleEquipment = ModuleEquipment;

