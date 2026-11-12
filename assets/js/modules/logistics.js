/**
 * Himalayan Prefab Solutions ERP
 * MODULE 16 — TRANSPORTATION & LOGISTICS
 */

const ModuleLogistics = (container) => {
  const dispatches = Storage.get("dispatches", SEED_DATA.dispatches);
  const projects = AppState.getProjects();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Transportation & Site Dispatch Logistics",
      description: "Coordinate flatbed truck convoys, oversize steel truss freight, driver tracking, and offloading crane schedules across Nepal.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Transportation" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="dsp-export-btn">
          ${Utils.renderIcon("download", 14)} Export Dispatches
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="dsp-add-btn">
          ${Utils.renderIcon("plus", 14)} Dispatch Consignment
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="dsp-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("dsp-table-mount"),
    columns: [
      {
        key: "dispatchNumber",
        label: "Dispatch #",
        width: "130px",
        render: (val, row) => `
          <div>
            <div class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val || row.id)}</div>
            <div class="text-xs text-muted font-mono">${row.id}</div>
          </div>
        `
      },
      {
        key: "projectName",
        label: "Destination Project",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Vehicle: ${Utils.escapeHtml(row.vehicleNumber)}</div>
          </div>
        `
      },
      {
        key: "driverName",
        label: "Driver & Contact",
        render: (val, row) => `
          <div class="text-xs">
            <div class="font-medium">${Utils.escapeHtml(val)}</div>
            <div class="text-muted">${Utils.escapeHtml(row.driverPhone || "-")}</div>
          </div>
        `
      },
      {
        key: "components",
        label: "Components Loaded",
        render: (val, row) => `
          <div>
            <div class="text-xs font-medium">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Payload: ${Utils.escapeHtml(row.quantity)}</div>
          </div>
        `
      },
      {
        key: "dispatchDate",
        label: "Departed",
        render: (val) => `<span class="text-xs">${val}</span>`
      },
      {
        key: "deliveryStatus",
        label: "Status",
        render: (val) => Utils.renderStatusBadge(val)
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        align: "right",
        render: (_, row) => `
          <div class="table-actions">
            ${
              row.deliveryStatus !== "Delivered"
                ? `<button type="button" class="btn btn-success btn-sm mark-delivered-btn" data-id="${row.id}">
                    ${Utils.renderIcon("check", 12)} Mark Delivered
                   </button>`
                : `<span class="text-xs text-success font-medium">Delivered</span>`
            }
          </div>
        `
      }
    ],
    data: dispatches,
    searchFields: ["dispatchNumber", "projectName", "vehicleNumber", "driverName"]
  });

  // Export CSV
  document.getElementById("dsp-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_logistics_dispatches", Storage.get("dispatches", SEED_DATA.dispatches));
  });

  // Add Dispatch
  document.getElementById("dsp-add-btn")?.addEventListener("click", () => {
    openDispatchForm();
  });

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".mark-delivered-btn");
    if (btn) {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const list = Storage.get("dispatches", SEED_DATA.dispatches);
      const d = list.find((x) => x.id === id);
      if (d) {
        d.deliveryStatus = "Delivered";
        d.actualArrival = new Date().toISOString().replace("T", " ").substring(0, 16);
        Storage.set("dispatches", list);
        Toast.success(`Consignment ${d.dispatchNumber} marked as delivered at site.`);
        ModuleLogistics(container);
      }
    }
  });

  function openDispatchForm() {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Schedule Material Transit & Dispatch",
      content: `
        <form id="new-dispatch-form">
          <div class="form-group">
            <label class="form-label required">Select Project Destination</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Vehicle Number & Type</label>
              <input type="text" class="form-control" name="vehicleNumber" value="Ba 3 Kha 4892 (Tata 10-Wheeler Flatbed)" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Driver Name</label>
              <input type="text" class="form-control" name="driverName" value="Hari Bahadur BK" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Components & Cargo Manifest</label>
            <input type="text" class="form-control" name="components" value="75mm EPS Sandwich Wall Panels (30 pcs) + Trusses" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Payload Weight / Quantity</label>
              <input type="text" class="form-control" name="quantity" value="30 Panels / 2.2 Tons" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Driver Contact Phone</label>
              <input type="tel" class="form-control" name="driverPhone" value="+977-9841892341" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-dispatch-btn">Dispatch Vehicle</button>
      `
    });

    document.getElementById("save-dispatch-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-dispatch-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);
      const list = Storage.get("dispatches", SEED_DATA.dispatches);

      const newDsp = {
        id: Utils.generateId("DSP", list),
        dispatchNumber: `DSP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        vehicleNumber: formData.get("vehicleNumber"),
        driverName: formData.get("driverName"),
        driverPhone: formData.get("driverPhone"),
        components: formData.get("components"),
        quantity: formData.get("quantity"),
        dispatchDate: new Date().toISOString().replace("T", " ").substring(0, 16),
        expectedArrival: "Today 16:00",
        deliveryStatus: "In Transit"
      };

      list.unshift(newDsp);
      Storage.set("dispatches", list);
      Toast.success("Consignment dispatched successfully.");
      Modal.close();
      ModuleLogistics(container);
    });
  }
};

window.ModuleLogistics = ModuleLogistics;

