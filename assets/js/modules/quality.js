/**
 * Himalayan Prefab Solutions ERP
 * MODULE 12 — QUALITY CONTROL & ASSURANCE
 */

const ModuleQuality = (container) => {
  const inspections = AppState.getInspections();
  const projects = AppState.getProjects();
  const employees = AppState.getEmployees();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Quality Control & Compliance Assurance",
      description: "Rigorous quality inspections across structural steel, panel insulation, weld penetration, foundation alignment, and pre-handover weatherproofing.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Quality Control" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="qc-export-btn">
          ${Utils.renderIcon("download", 14)} Export QC Reports
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="qc-add-btn">
          ${Utils.renderIcon("plus", 14)} Conduct New Inspection
        </button>
      `
    })}

    <!-- Highlights Strip -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Total QA Audits</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${inspections.length}</div>
        <div class="text-xs text-muted">Factory & On-Site Checks</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Passed First Time</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-success); margin-top:2px;">
          ${inspections.filter((i) => i.result === "Passed").length}
        </div>
        <div class="text-xs text-muted">95.4% Pass Rate</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Re-inspection Required</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-warning); margin-top:2px;">
          ${inspections.filter((i) => i.result === "Re-inspection Required").length}
        </div>
        <div class="text-xs text-muted">Corrective actions tracked</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Lead Quality Inspector</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-primary); margin-top:4px;">Er. Saroj Bhattarai</div>
        <div class="text-xs text-muted">Certified NDT Level II & ISO 9001</div>
      </div>
    </div>

    <!-- Data Table Container -->
    <div id="qc-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("qc-table-mount"),
    columns: [
      {
        key: "inspectionNumber",
        label: "Inspection #",
        width: "140px",
        render: (val, row) => `
          <div>
            <div class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val || row.id)}</div>
            <div class="text-xs text-muted font-mono">${row.id}</div>
          </div>
        `
      },
      {
        key: "inspectionType",
        label: "Inspection Scope",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Project: ${Utils.escapeHtml(row.projectName)}</div>
          </div>
        `
      },
      {
        key: "inspectorName",
        label: "Inspector",
        render: (val) => `<span class="text-xs font-medium">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "inspectionDate",
        label: "Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "remarks",
        label: "Technical Observations",
        render: (val) => `<span class="text-xs truncate" style="max-width:280px; display:inline-block;">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "result",
        label: "Result",
        render: (val) => Utils.renderStatusBadge(val)
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        align: "right",
        render: (_, row) => `
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-sm view-qc-dossier-btn" data-id="${row.id}">
              ${Utils.renderIcon("check-circle", 13)} Audit Report
            </button>
          </div>
        `
      }
    ],
    data: inspections,
    searchFields: ["inspectionNumber", "inspectionType", "projectName", "inspectorName", "result"],
    onRowClick: (row) => openQcModal(row.id)
  });

  // Export CSV
  document.getElementById("qc-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_quality_inspections", AppState.getInspections());
  });

  // Add Inspection Modal
  document.getElementById("qc-add-btn")?.addEventListener("click", () => {
    openNewInspectionForm();
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-qc-dossier-btn");
    if (viewBtn) {
      e.stopPropagation();
      openQcModal(viewBtn.getAttribute("data-id"));
    }
  });

  function openQcModal(id) {
    const qc = AppState.getInspections().find((i) => i.id === id);
    if (!qc) return;

    const checklist = qc.checklist || [
      { item: "Dimensional tolerance check", passed: true, notes: "Verified" },
      { item: "Material surface integrity", passed: true, notes: "No cracks" },
      { item: "Coating / Rust prevention", passed: true, notes: "Approved" }
    ];

    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:14px; border-radius:var(--radius-md);">
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Audit Dossier:</div>
            <div style="font-size:16px; font-weight:600; margin-top:2px;">${Utils.escapeHtml(qc.inspectionType)}</div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">Project: ${Utils.escapeHtml(qc.projectName)}</div>
          </div>
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Verification Outcome:</div>
            <div style="margin-top:4px;">${Utils.renderStatusBadge(qc.result)}</div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:4px;">
              Inspector: <strong>${Utils.escapeHtml(qc.inspectorName)}</strong> &bull; Date: <strong>${Utils.formatDate(qc.inspectionDate)}</strong>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:600; margin-bottom:8px;">Inspection Criteria Checklist</h4>
          <div class="qc-checklist">
            ${checklist
              .map((c) => {
                return `
              <div class="qc-item">
                <div class="qc-item-left">
                  <span style="color:var(--color-success);">${Utils.renderIcon("check", 16)}</span>
                  <span style="font-size:13px; font-weight:500;">${Utils.escapeHtml(c.item)}</span>
                </div>
                <div style="font-size:12px; color:var(--color-text-secondary); font-family:monospace;">${Utils.escapeHtml(c.notes || "Verified")}</div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>

        <div style="background:#FFFFFF; border:1px solid var(--color-border); padding:12px; border-radius:var(--radius-sm); font-size:12px;">
          <strong>Auditor Remarks:</strong> ${Utils.escapeHtml(qc.remarks)}<br />
          <strong>Corrective Actions:</strong> ${Utils.escapeHtml(qc.correctiveActions || "None required. Certified for project assembly.")}
        </div>
      </div>
    `;

    Modal.open({
      title: `Quality Inspection: ${qc.inspectionNumber || qc.id}`,
      content: contentHtml,
      size: "md",
      footer: `<button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>`
    });
  }

  function openNewInspectionForm() {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Record New Quality Assurance Inspection",
      content: `
        <form id="new-qc-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Inspection Scope Type</label>
              <select class="form-control" name="inspectionType" required>
                <option value="Material & Raw Steel Inspection">Material & Raw Steel Inspection</option>
                <option value="Welding & Structural Joints Inspection">Welding & Structural Joints Inspection</option>
                <option value="Light Gauge Steel Frame Inspection">Light Gauge Steel Frame Inspection</option>
                <option value="Panel & Insulation Interlocking">Panel & Insulation Interlocking</option>
                <option value="Site Foundation & Anchor Alignment">Site Foundation & Anchor Alignment</option>
                <option value="Final Handover Inspection">Final Handover Inspection</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Quality Inspector</label>
              <input type="text" class="form-control" name="inspectorName" value="Er. Saroj Bhattarai" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Inspection Result</label>
              <select class="form-control" name="result" required>
                <option value="Passed" selected>Passed</option>
                <option value="Pending">Pending</option>
                <option value="Re-inspection Required">Re-inspection Required</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Date of Audit</label>
              <input type="date" class="form-control" name="inspectionDate" value="${new Date().toISOString().split("T")[0]}" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Observations & Remarks</label>
            <textarea class="form-control" name="remarks" rows="2" required placeholder="Specify checklist findings, measurements, deviations...">Checked dimensional tolerances (+/- 1.5mm) and certified zinc coating thickness.</textarea>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-qc-btn">Submit Inspection</button>
      `
    });

    document.getElementById("save-qc-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-qc-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addInspection({
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        inspectionType: formData.get("inspectionType"),
        inspectorName: formData.get("inspectorName"),
        result: formData.get("result"),
        inspectionDate: formData.get("inspectionDate"),
        remarks: formData.get("remarks")
      });

      Toast.success("Quality inspection recorded.");
      Modal.close();
      ModuleQuality(container);
    });
  }
};

window.ModuleQuality = ModuleQuality;

