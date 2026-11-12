/**
 * Himalayan Prefab Solutions ERP
 * MODULE 03 — LEADS & INQUIRIES
 */

const ModuleInquiries = (container) => {
  const inquiries = AppState.getInquiries();
  const customers = AppState.getCustomers();
  const employees = AppState.getEmployees();

  // Status breakdown
  const counts = {
    New: inquiries.filter((i) => i.status === "New").length,
    Contacted: inquiries.filter((i) => i.status === "Contacted").length,
    "Site Visit Required": inquiries.filter((i) => i.status === "Site Visit Required").length,
    "Quotation Preparation": inquiries.filter((i) => i.status === "Quotation Preparation").length,
    Negotiation: inquiries.filter((i) => i.status === "Negotiation").length,
    Converted: inquiries.filter((i) => i.status === "Converted").length,
    Lost: inquiries.filter((i) => i.status === "Lost").length
  };

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Leads & Inquiries Pipeline",
      description: "Track customer building inquiries from first point of contact to project conversion.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Leads & Inquiries" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="inq-export-btn">
          ${Utils.renderIcon("download", 14)} Export CSV
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="inq-add-btn">
          ${Utils.renderIcon("plus", 14)} New Inquiry
        </button>
      `
    })}

    <!-- Pipeline Metric Strip -->
    <div class="grid grid-cols-6" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">New Inquiries</div>
        <div style="font-size:20px; font-weight:600; color:var(--color-primary);">${counts.New}</div>
      </div>
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Contacted</div>
        <div style="font-size:20px; font-weight:600; color:#0284C7;">${counts.Contacted}</div>
      </div>
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Site Visit Req.</div>
        <div style="font-size:20px; font-weight:600; color:var(--color-warning);">${counts["Site Visit Required"]}</div>
      </div>
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Quotation Prep</div>
        <div style="font-size:20px; font-weight:600; color:#854D0E;">${counts["Quotation Preparation"]}</div>
      </div>
      <div class="card" style="padding:12px; text-align:center;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Negotiation</div>
        <div style="font-size:20px; font-weight:600; color:#7C3AED;">${counts.Negotiation}</div>
      </div>
      <div class="card" style="padding:12px; text-align:center; background:var(--color-success-light); border-color:var(--color-success-border);">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-success); font-weight:600;">Converted</div>
        <div style="font-size:20px; font-weight:600; color:var(--color-success);">${counts.Converted}</div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-box-icon">${Utils.renderIcon("search", 15)}</span>
        <input type="text" id="inq-search-input" placeholder="Search inquiry, customer, building type, location..." />
      </div>

      <div class="filter-group">
        <select class="form-control" id="inq-status-filter" style="width:180px; height:34px; font-size:12px;">
          <option value="">All Pipeline Stages</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Site Visit Required">Site Visit Required</option>
          <option value="Quotation Preparation">Quotation Preparation</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Converted">Converted to Project</option>
          <option value="Lost">Lost</option>
        </select>
      </div>
    </div>

    <!-- Data Table Mount -->
    <div id="inq-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("inq-table-mount"),
    columns: [
      {
        key: "id",
        label: "Inquiry ID",
        width: "100px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "customerName",
        label: "Customer / Contact",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.source || "Website")}</div>
          </div>
        `
      },
      {
        key: "buildingType",
        label: "Prefab Structure & Specs",
        render: (val, row) => `
          <div>
            <div class="font-medium text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${row.areaSqFt || "-"} sq ft &bull; ${row.floors || 1} Floor(s)</div>
          </div>
        `
      },
      {
        key: "location",
        label: "Location",
        render: (val) => `<span class="text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "estimatedBudget",
        label: "Est. Budget",
        align: "right",
        render: (val) => Utils.formatCurrency(val)
      },
      {
        key: "salesRepName",
        label: "Assigned Rep",
        render: (val) => `<span class="text-xs font-medium">${Utils.escapeHtml(val || "Unassigned")}</span>`
      },
      {
        key: "status",
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
              row.status !== "Converted"
                ? `<button type="button" class="btn btn-success btn-sm convert-inq-btn" data-id="${row.id}" title="Convert to Official Project">
                    ${Utils.renderIcon("play", 11)} Convert
                   </button>`
                : `<a href="#projects/${row.projectId}" class="btn btn-outline-primary btn-sm font-mono text-xs">
                    ${row.projectId}
                   </a>`
            }
            <button type="button" class="btn btn-secondary btn-sm btn-icon edit-inq-btn" data-id="${row.id}" title="Edit Inquiry">
              ${Utils.renderIcon("edit", 13)}
            </button>
          </div>
        `
      }
    ],
    data: inquiries,
    searchFields: ["customerName", "buildingType", "location", "id", "salesRepName"],
    onRowClick: (row) => openInquiryDetail(row.id)
  });

  // Attach search and filter
  document.getElementById("inq-search-input")?.addEventListener("input", (e) => {
    table.setSearch(e.target.value);
  });

  document.getElementById("inq-status-filter")?.addEventListener("change", (e) => {
    const val = e.target.value;
    const filtered = val ? AppState.getInquiries().filter((i) => i.status === val) : AppState.getInquiries();
    table.updateData(filtered);
  });

  // Export CSV
  document.getElementById("inq-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_inquiries_pipeline", AppState.getInquiries());
  });

  // Add inquiry
  document.getElementById("inq-add-btn")?.addEventListener("click", () => {
    openInquiryForm();
  });

  // Table action listeners
  container.addEventListener("click", (e) => {
    const convertBtn = e.target.closest(".convert-inq-btn");
    const editBtn = e.target.closest(".edit-inq-btn");

    if (convertBtn) {
      e.stopPropagation();
      const inqId = convertBtn.getAttribute("data-id");
      Modal.confirm({
        title: "Convert Inquiry to Official Project",
        message: `Convert inquiry <strong>${inqId}</strong> into a full construction project? This will create an active Project record, link the customer account, and initiate project planning.`,
        confirmText: "Convert to Project",
        confirmVariant: "primary",
        onConfirm: () => {
          const prj = AppState.convertInquiryToProject(inqId);
          if (prj) {
            Toast.success(`Project ${prj.id} generated successfully!`);
            window.location.hash = `#projects/${prj.id}`;
          }
        }
      });
    } else if (editBtn) {
      e.stopPropagation();
      const inq = AppState.getInquiry(editBtn.getAttribute("data-id"));
      if (inq) openInquiryForm(inq);
    }
  });

  // Inquiry Detail Modal
  function openInquiryDetail(id) {
    const inq = AppState.getInquiry(id);
    if (!inq) return;

    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:var(--space-4); border-radius:var(--radius-md);">
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Client & Location</div>
            <div style="font-size:16px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${Utils.escapeHtml(inq.customerName)}</div>
            <div style="font-size:13px; color:var(--color-text-secondary);">${Utils.escapeHtml(inq.location)}</div>
            <div style="font-size:12px; margin-top:4px;">Lead Source: <strong>${Utils.escapeHtml(inq.source)}</strong></div>
          </div>
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Project Scope</div>
            <div style="font-size:15px; font-weight:600; margin-top:2px;">${Utils.escapeHtml(inq.buildingType)}</div>
            <div style="font-size:13px; color:var(--color-text-secondary);">${inq.areaSqFt} sq ft &bull; ${inq.floors} Storey</div>
            <div style="font-size:14px; color:var(--color-primary); font-weight:600; margin-top:4px;">Est. Budget: ${Utils.formatCurrency(inq.estimatedBudget)}</div>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div>
            <div style="font-size:12px; color:var(--color-text-secondary);">Target Completion Date:</div>
            <div style="font-weight:600; font-size:13px;">${Utils.formatDate(inq.expectedCompletion)}</div>
          </div>
          <div>
            <div style="font-size:12px; color:var(--color-text-secondary);">Assigned Sales Representative:</div>
            <div style="font-weight:600; font-size:13px;">${Utils.escapeHtml(inq.salesRepName || "Unassigned")}</div>
          </div>
        </div>

        <div style="background:#FFFFFF; border:1px solid var(--color-border); padding:12px; border-radius:var(--radius-md);">
          <div style="font-size:12px; font-weight:600; margin-bottom:4px;">Notes & Observations:</div>
          <div style="font-size:13px; color:var(--color-text-secondary); line-height:1.4;">${Utils.escapeHtml(inq.notes || "No special notes recorded.")}</div>
        </div>
      </div>
    `;

    Modal.open({
      title: `Inquiry Dossier: ${inq.id} &mdash; ${inq.customerName}`,
      content: contentHtml,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        ${
          inq.status !== "Converted"
            ? `<button type="button" class="btn btn-success" id="detail-convert-btn">Convert to Project</button>`
            : `<button type="button" class="btn btn-primary" onclick="Modal.close(); window.location.hash='#projects/${inq.projectId}';">Open Project</button>`
        }
      `
    });

    document.getElementById("detail-convert-btn")?.addEventListener("click", () => {
      Modal.close();
      const prj = AppState.convertInquiryToProject(inq.id);
      if (prj) {
        Toast.success(`Inquiry converted to Project ${prj.id}`);
        window.location.hash = `#projects/${prj.id}`;
      }
    });
  }

  // Inquiry Form Modal
  function openInquiryForm(inq = null) {
    const isEdit = !!inq;
    const title = isEdit ? `Edit Inquiry (${inq.id})` : "Register New Prefab Building Inquiry";

    const custOptions = customers
      .map((c) => `<option value="${c.id}" ${inq?.customerId === c.id ? "selected" : ""}>${Utils.escapeHtml(c.name)} (${c.id})</option>`)
      .join("");

    const salesOptions = employees
      .filter((e) => e.department.includes("Sales") || e.role === "Sales" || e.role === "Super Admin")
      .map((e) => `<option value="${e.id}" ${inq?.assignedTo === e.id ? "selected" : ""}>${e.name} (${e.designation})</option>`)
      .join("");

    const formHtml = `
      <form id="inquiry-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Select Customer</label>
            <select class="form-control" name="customerId" required>
              ${custOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Inquiry Source</label>
            <select class="form-control" name="source" required>
              <option value="Website Referral" ${inq?.source === "Website Referral" ? "selected" : ""}>Website Referral</option>
              <option value="Direct Call" ${inq?.source === "Direct Call" ? "selected" : ""}>Direct Call</option>
              <option value="Exhibition Expo 2026" ${inq?.source === "Exhibition Expo 2026" ? "selected" : ""}>Exhibition Expo 2026</option>
              <option value="LinkedIn Campaign" ${inq?.source === "LinkedIn Campaign" ? "selected" : ""}>LinkedIn Campaign</option>
              <option value="Client Referral" ${inq?.source === "Client Referral" ? "selected" : ""}>Client Referral</option>
              <option value="Government Tender" ${inq?.source === "Government Tender" ? "selected" : ""}>Government Tender</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Prefab Building Type</label>
            <select class="form-control" name="buildingType" required>
              <option value="Two-Storey Residential Prefab House">Two-Storey Residential Prefab House</option>
              <option value="Single-Storey Modular House">Single-Storey Modular House</option>
              <option value="Three-Storey Commercial Prefab Building">Three-Storey Commercial Prefab Building</option>
              <option value="Prefab Office Building">Prefab Office Building</option>
              <option value="Industrial Prefab Warehouse">Industrial Prefab Warehouse</option>
              <option value="Modular Staff Accommodation">Modular Staff Accommodation</option>
              <option value="Prefab School Building">Prefab School Building</option>
              <option value="Commercial Prefab Shop">Commercial Prefab Shop</option>
              <option value="Modular Eco Cottages">Modular Eco Cottages</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Site Location</label>
            <input type="text" class="form-control" name="location" value="${Utils.escapeHtml(inq?.location || "")}" required placeholder="e.g. Budhanilkantha-03, Kathmandu" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Area (Sq. Ft)</label>
            <input type="number" class="form-control" name="areaSqFt" value="${inq?.areaSqFt || 1500}" required min="100" />
          </div>
          <div class="form-group">
            <label class="form-label required">Floors</label>
            <input type="number" class="form-control" name="floors" value="${inq?.floors || 2}" required min="1" max="5" />
          </div>
          <div class="form-group">
            <label class="form-label required">Estimated Budget (NPR)</label>
            <input type="number" class="form-control" name="estimatedBudget" value="${inq?.estimatedBudget || 4000000}" required step="50000" />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Target Delivery Date</label>
            <input type="date" class="form-control" name="expectedCompletion" value="${inq?.expectedCompletion || "2026-12-15"}" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Assigned Sales Rep</label>
            <select class="form-control" name="assignedTo" required>
              ${salesOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Pipeline Stage</label>
            <select class="form-control" name="status" required>
              <option value="New" ${inq?.status === "New" ? "selected" : ""}>New</option>
              <option value="Contacted" ${inq?.status === "Contacted" ? "selected" : ""}>Contacted</option>
              <option value="Site Visit Required" ${inq?.status === "Site Visit Required" ? "selected" : ""}>Site Visit Required</option>
              <option value="Quotation Preparation" ${inq?.status === "Quotation Preparation" ? "selected" : ""}>Quotation Preparation</option>
              <option value="Negotiation" ${inq?.status === "Negotiation" ? "selected" : ""}>Negotiation</option>
              <option value="Converted" ${inq?.status === "Converted" ? "selected" : ""}>Converted</option>
              <option value="Lost" ${inq?.status === "Lost" ? "selected" : ""}>Lost</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Client Requirements / Discussion Notes</label>
          <textarea class="form-control" name="notes" rows="3" placeholder="Enter architectural preferences, insulation requirements, or special site details...">${Utils.escapeHtml(inq?.notes || "")}</textarea>
        </div>
      </form>
    `;

    Modal.open({
      title,
      content: formHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-inquiry-btn">${isEdit ? "Update Inquiry" : "Save Inquiry"}</button>
      `
    });

    document.getElementById("save-inquiry-btn")?.addEventListener("click", () => {
      const form = document.getElementById("inquiry-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);
      const repId = formData.get("assignedTo");
      const matchedRep = employees.find((e) => e.id === repId);

      const payload = {
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        buildingType: formData.get("buildingType"),
        location: formData.get("location"),
        areaSqFt: Number(formData.get("areaSqFt")),
        floors: Number(formData.get("floors")),
        estimatedBudget: Number(formData.get("estimatedBudget")),
        expectedCompletion: formData.get("expectedCompletion"),
        source: formData.get("source"),
        assignedTo: repId,
        salesRepName: matchedRep ? matchedRep.name : "Deepak Basnet",
        status: formData.get("status"),
        notes: formData.get("notes")
      };

      if (isEdit) {
        AppState.updateInquiry(inq.id, payload);
        Toast.success("Inquiry updated.");
      } else {
        AppState.addInquiry(payload);
        Toast.success("New building inquiry registered.");
      }

      Modal.close();
      table.updateData(AppState.getInquiries());
    });
  }
};

window.ModuleInquiries = ModuleInquiries;

