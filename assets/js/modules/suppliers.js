/**
 * Himalayan Prefab Solutions ERP
 * MODULE 15 — SUPPLIER & VENDOR MANAGEMENT
 */

const ModuleSuppliers = (container) => {
  const suppliers = Storage.get("suppliers", SEED_DATA.suppliers);

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Material Suppliers & Strategic Partners",
      description: "Manage vendors supplying structural steel coils, PUF/EPS sandwich panels, rockwool insulation, UPVC windows, and foundation grout across Nepal.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Suppliers" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="supp-export-btn">
          ${Utils.renderIcon("download", 14)} Export Suppliers
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="supp-add-btn">
          ${Utils.renderIcon("plus", 14)} Add Supplier
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="supp-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("supp-table-mount"),
    columns: [
      {
        key: "id",
        label: "Supplier ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "name",
        label: "Company / Vendor",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Contact: ${Utils.escapeHtml(row.contactPerson)}</div>
          </div>
        `
      },
      {
        key: "materialsSupplied",
        label: "Materials Supplied",
        render: (val) => `<span class="text-xs truncate" style="max-width:240px; display:inline-block;" title="${Utils.escapeHtml(val)}">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "phone",
        label: "Contact Phone / Email",
        render: (val, row) => `
          <div class="text-xs">
            <div>${Utils.escapeHtml(val)}</div>
            <div class="text-muted">${Utils.escapeHtml(row.email)}</div>
          </div>
        `
      },
      {
        key: "paymentTerms",
        label: "Payment Terms",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "rating",
        label: "Rating",
        render: (val) => `<span style="color:#D97706; font-weight:600; font-size:12px;">★ ${val}</span>`
      },
      {
        key: "balanceDue",
        label: "Payable Due (NPR)",
        align: "right",
        render: (val) => `<span class="font-mono text-xs font-semibold">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        align: "right",
        render: (_, row) => `
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-sm btn-icon edit-supp-btn" data-id="${row.id}">
              ${Utils.renderIcon("edit", 13)}
            </button>
          </div>
        `
      }
    ],
    data: suppliers,
    searchFields: ["name", "contactPerson", "materialsSupplied", "id"]
  });

  // Export CSV
  document.getElementById("supp-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_suppliers", Storage.get("suppliers", SEED_DATA.suppliers));
  });

  // Add Supplier
  document.getElementById("supp-add-btn")?.addEventListener("click", () => {
    openSupplierForm();
  });

  container.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-supp-btn");
    if (editBtn) {
      e.stopPropagation();
      const s = suppliers.find((x) => x.id === editBtn.getAttribute("data-id"));
      if (s) openSupplierForm(s);
    }
  });

  function openSupplierForm(supp = null) {
    const isEdit = !!supp;
    const title = isEdit ? `Edit Supplier (${supp.id})` : "Register New Strategic Supplier";

    Modal.open({
      title,
      content: `
        <form id="supp-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Company / Supplier Name</label>
              <input type="text" class="form-control" name="name" value="${Utils.escapeHtml(supp?.name || "")}" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Key Contact Person</label>
              <input type="text" class="form-control" name="contactPerson" value="${Utils.escapeHtml(supp?.contactPerson || "")}" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Phone</label>
              <input type="tel" class="form-control" name="phone" value="${Utils.escapeHtml(supp?.phone || "")}" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Email</label>
              <input type="email" class="form-control" name="email" value="${Utils.escapeHtml(supp?.email || "")}" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Materials Supplied</label>
            <input type="text" class="form-control" name="materialsSupplied" value="${Utils.escapeHtml(supp?.materialsSupplied || "")}" required placeholder="e.g. Light Gauge Steel, EPS Panels" />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Payment Terms</label>
              <input type="text" class="form-control" name="paymentTerms" value="${Utils.escapeHtml(supp?.paymentTerms || "30 Days Credit")}" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Quality Rating (1-5)</label>
              <input type="number" step="0.1" min="1" max="5" class="form-control" name="rating" value="${supp?.rating || 4.8}" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-supp-btn">${isEdit ? "Update" : "Register"} Supplier</button>
      `
    });

    document.getElementById("save-supp-btn")?.addEventListener("click", () => {
      const form = document.getElementById("supp-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const list = Storage.get("suppliers", SEED_DATA.suppliers);

      if (isEdit) {
        const idx = list.findIndex((x) => x.id === supp.id);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            name: formData.get("name"),
            contactPerson: formData.get("contactPerson"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            materialsSupplied: formData.get("materialsSupplied"),
            paymentTerms: formData.get("paymentTerms"),
            rating: Number(formData.get("rating"))
          };
          Storage.set("suppliers", list);
          Toast.success("Supplier details updated.");
        }
      } else {
        const newSupp = {
          id: Utils.generateId("SUP", list),
          name: formData.get("name"),
          contactPerson: formData.get("contactPerson"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          materialsSupplied: formData.get("materialsSupplied"),
          paymentTerms: formData.get("paymentTerms"),
          rating: Number(formData.get("rating")),
          status: "Active",
          balanceDue: 0
        };
        list.unshift(newSupp);
        Storage.set("suppliers", list);
        Toast.success("Supplier registered successfully.");
      }

      Modal.close();
      ModuleSuppliers(container);
    });
  }
};

window.ModuleSuppliers = ModuleSuppliers;

