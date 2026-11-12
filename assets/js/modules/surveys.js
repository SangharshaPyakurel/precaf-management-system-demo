/**
 * Himalayan Prefab Solutions ERP
 * MODULE 04 — SITE SURVEY & FEASIBILITY
 */

const ModuleSurveys = (container) => {
  const surveys = AppState.getSurveys();
  const customers = AppState.getCustomers();
  const employees = AppState.getEmployees();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Site Survey & Geotechnical Feasibility",
      description: "Manage pre-construction field surveys, soil condition tests, transport road clearance, and foundation readiness.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Site Survey" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="survey-export-btn">
          ${Utils.renderIcon("download", 14)} Export Surveys
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="survey-add-btn">
          ${Utils.renderIcon("plus", 14)} New Site Survey
        </button>
      `
    })}

    <!-- Info Highlights -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Total Surveys Conducted</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${surveys.length}</div>
        <div class="text-xs text-muted" style="margin-top:2px;">Across Kathmandu Valley & Highway Corridors</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Approved for Foundation</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-success); margin-top:2px;">${surveys.filter((s) => s.status === "Approved").length}</div>
        <div class="text-xs text-muted" style="margin-top:2px;">Bearing capacity & access verified</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Survey Engineering Lead</div>
        <div style="font-size:16px; font-weight:600; color:var(--color-primary); margin-top:4px;">Er. Anupama Karki</div>
        <div class="text-xs text-muted">Senior Structural & CAD Specialist</div>
      </div>
    </div>

    <!-- Data Table Mount -->
    <div id="survey-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("survey-table-mount"),
    columns: [
      {
        key: "id",
        label: "Survey ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "customerName",
        label: "Customer / Project",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.projectLocation)}</div>
          </div>
        `
      },
      {
        key: "surveyEngineerName",
        label: "Survey Engineer",
        render: (val) => `<span class="text-xs font-medium">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "surveyDate",
        label: "Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "groundConditions",
        label: "Soil & Bearing Condition",
        render: (val) => `<span class="text-xs truncate" style="max-width:240px; display:inline-block;" title="${Utils.escapeHtml(val)}">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "transportAccessibility",
        label: "Transport Access",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val.split(".")[0])}</span>`
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
            <button type="button" class="btn btn-secondary btn-sm view-survey-btn" data-id="${row.id}" title="View Survey Report">
              ${Utils.renderIcon("file-text", 13)} Report
            </button>
          </div>
        `
      }
    ],
    data: surveys,
    searchFields: ["id", "customerName", "projectLocation", "surveyEngineerName", "groundConditions"],
    onRowClick: (row) => openSurveyReport(row.id)
  });

  // Export CSV
  document.getElementById("survey-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_site_surveys", AppState.getSurveys());
  });

  // Add survey
  document.getElementById("survey-add-btn")?.addEventListener("click", () => {
    openSurveyForm();
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-survey-btn");
    if (viewBtn) {
      e.stopPropagation();
      openSurveyReport(viewBtn.getAttribute("data-id"));
    }
  });

  // Survey Report Preview Modal
  function openSurveyReport(id) {
    const srv = surveys.find((s) => s.id === id);
    if (!srv) return;

    const contentHtml = `
      <div class="document-sheet" style="padding:var(--space-6); border:none; box-shadow:none;">
        <div class="doc-brand-header">
          <div>
            <div class="doc-company-title">HIMALAYAN PREFAB SOLUTIONS</div>
            <div class="doc-company-sub">Engineering & Site Feasibility Division &bull; Kathmandu, Nepal</div>
          </div>
          <div class="doc-type-badge">
            <div class="doc-type-title">SITE SURVEY DOSSIER</div>
            <div class="text-xs font-mono">Ref: ${srv.id}</div>
          </div>
        </div>

        <div class="doc-meta-grid">
          <div>
            <div><strong>Client Name:</strong> ${Utils.escapeHtml(srv.customerName)}</div>
            <div><strong>Location:</strong> ${Utils.escapeHtml(srv.projectLocation)}</div>
            <div><strong>Survey Date:</strong> ${Utils.formatDate(srv.surveyDate)}</div>
          </div>
          <div>
            <div><strong>Lead Engineer:</strong> ${Utils.escapeHtml(srv.surveyEngineerName)}</div>
            <div><strong>Verification Status:</strong> ${Utils.renderStatusBadge(srv.status)}</div>
            <div><strong>Plot Dimensions:</strong> ${Utils.escapeHtml(srv.landDimensions)}</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:var(--space-3); font-size:13px; line-height:1.5;">
          <div style="background:var(--color-bg-subtle); padding:10px 14px; border-radius:var(--radius-sm);">
            <strong>1. Soil & Geotechnical Conditions:</strong><br />
            ${Utils.escapeHtml(srv.groundConditions)}
          </div>

          <div style="background:var(--color-bg-subtle); padding:10px 14px; border-radius:var(--radius-sm);">
            <strong>2. Foundation & Plinth Engineering Requirements:</strong><br />
            ${Utils.escapeHtml(srv.foundationRequirements)}
          </div>

          <div style="background:var(--color-bg-subtle); padding:10px 14px; border-radius:var(--radius-sm);">
            <strong>3. Site Accessibility & Trailer Logistics:</strong><br />
            ${Utils.escapeHtml(srv.siteAccessibility)} &bull; ${Utils.escapeHtml(srv.transportAccessibility)}
          </div>

          <div class="grid grid-cols-2" style="gap:var(--space-3);">
            <div style="border:1px solid var(--color-border); padding:8px 12px; border-radius:var(--radius-sm);">
              <strong>Electricity Connection:</strong> ${Utils.escapeHtml(srv.electricityAvailability)}
            </div>
            <div style="border:1px solid var(--color-border); padding:8px 12px; border-radius:var(--radius-sm);">
              <strong>Water Availability:</strong> ${Utils.escapeHtml(srv.waterAvailability)}
            </div>
          </div>

          <div style="margin-top:6px; font-style:italic; color:var(--color-text-secondary);">
            <strong>Engineer Sign-off Remarks:</strong> ${Utils.escapeHtml(srv.remarks)}
          </div>
        </div>
      </div>
    `;

    Modal.open({
      title: `Site Survey Report: ${srv.id}`,
      content: contentHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        <button type="button" class="btn btn-secondary" onclick="Utils.printPage();">${Utils.renderIcon("printer", 14)} Print Dossier</button>
        ${
          srv.status !== "Approved"
            ? `<button type="button" class="btn btn-success" id="approve-survey-btn">Approve Survey</button>`
            : ""
        }
      `
    });

    document.getElementById("approve-survey-btn")?.addEventListener("click", () => {
      srv.status = "Approved";
      Storage.set("surveys", surveys);
      Toast.success("Site survey officially approved.");
      Modal.close();
      table.updateData(AppState.getSurveys());
    });
  }

  // Survey Form
  function openSurveyForm() {
    const custOptions = customers
      .map((c) => `<option value="${c.id}">${Utils.escapeHtml(c.name)} (${c.id})</option>`)
      .join("");

    const engOptions = employees
      .filter((e) => e.role === "Engineer" || e.designation.includes("Engineer"))
      .map((e) => `<option value="${e.name}">${e.name} (${e.designation})</option>`)
      .join("");

    const formHtml = `
      <form id="survey-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Customer / Project</label>
            <select class="form-control" name="customerId" required>
              ${custOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Assigned Survey Engineer</label>
            <select class="form-control" name="surveyEngineerName" required>
              ${engOptions}
            </select>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Project Location</label>
            <input type="text" class="form-control" name="projectLocation" value="Budhanilkantha-03, Kathmandu" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Survey Date</label>
            <input type="date" class="form-control" name="surveyDate" value="${new Date().toISOString().split("T")[0]}" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Land Dimensions & Plot Area</label>
          <input type="text" class="form-control" name="landDimensions" value="50 ft x 60 ft (Total 3,000 sq ft / 8.8 Aana)" required />
        </div>

        <div class="form-group">
          <label class="form-label required">Ground & Soil Bearing Conditions</label>
          <textarea class="form-control" name="groundConditions" rows="2" required placeholder="Describe soil strata, compaction, moisture content, slope...">Stable red clay soil, bearing capacity 165 kN/m2. Mild 4-degree slope towards East.</textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Foundation Requirements</label>
            <input type="text" class="form-control" name="foundationRequirements" value="RCC Strip Beam (350x450mm) with anchor bolts template" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Transport & Road Access</label>
            <input type="text" class="form-control" name="transportAccessibility" value="Pitched 20-ft road. 10-wheeler flatbed trailer accessible." required />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Electricity Availability</label>
            <input type="text" class="form-control" name="electricityAvailability" value="3-Phase 400V grid line available at boundary wall" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Water Availability</label>
            <input type="text" class="form-control" name="waterAvailability" value="Municipal connection + boring water at site" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Engineer Recommendations & Remarks</label>
          <textarea class="form-control" name="remarks" rows="2">Site verified cleared for excavation and plinth casting.</textarea>
        </div>
      </form>
    `;

    Modal.open({
      title: "Record New Site Feasibility Survey",
      content: formHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-survey-btn">Save Survey</button>
      `
    });

    document.getElementById("save-survey-btn")?.addEventListener("click", () => {
      const form = document.getElementById("survey-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);

      const payload = {
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        projectLocation: formData.get("projectLocation"),
        surveyEngineerName: formData.get("surveyEngineerName"),
        surveyDate: formData.get("surveyDate"),
        landDimensions: formData.get("landDimensions"),
        groundConditions: formData.get("groundConditions"),
        foundationRequirements: formData.get("foundationRequirements"),
        transportAccessibility: formData.get("transportAccessibility"),
        electricityAvailability: formData.get("electricityAvailability"),
        waterAvailability: formData.get("waterAvailability"),
        remarks: formData.get("remarks"),
        status: "Approved"
      };

      AppState.addSurvey(payload);
      Toast.success("Site survey recorded and approved.");
      Modal.close();
      table.updateData(AppState.getSurveys());
    });
  }
};

window.ModuleSurveys = ModuleSurveys;

