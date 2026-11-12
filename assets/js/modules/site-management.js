/**
 * Himalayan Prefab Solutions ERP
 * MODULE 17 — SITE MANAGEMENT & MOBILE-FIRST FIELD REPORTING
 */

const ModuleSiteManagement = (container) => {
  const reports = AppState.getSiteReports();
  const projects = AppState.getProjects();
  const employees = AppState.getEmployees();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Field Site Supervision & Daily Logs",
      description: "Mobile-optimized field interface for site supervisors and field engineers to log daily manpower, work completion, material consumption, and site safety.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Site Management" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="site-export-btn">
          ${Utils.renderIcon("download", 14)} Export Daily Logs
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="site-add-log-btn">
          ${Utils.renderIcon("plus", 14)} Submit Daily Site Log
        </button>
      `
    })}

    <!-- Active Sites Metric Strip -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Active Construction Sites</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-primary); margin-top:2px;">
          ${projects.filter((p) => p.status === "In Progress" || p.status === "Finishing & QC").length} Active Sites
        </div>
        <div class="text-xs text-muted">Field crews active today</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Daily Reports Filed</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-success); margin-top:2px;">${reports.length} Logs</div>
        <div class="text-xs text-muted">Complete audit trail</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Lead Site Supervisor</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-text-primary); margin-top:4px;">Bishal Thapa</div>
        <div class="text-xs text-muted">Stationed at Budhanilkantha Villa</div>
      </div>
    </div>

    <!-- Daily Site Logs Table Mount -->
    <div id="site-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("site-table-mount"),
    columns: [
      {
        key: "reportDate",
        label: "Date",
        width: "110px",
        render: (val) => `<span class="font-medium text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "projectName",
        label: "Site / Project Scope",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted font-mono">${row.id} &bull; Supervisor: ${Utils.escapeHtml(row.engineerName)}</div>
          </div>
        `
      },
      {
        key: "workersPresent",
        label: "Manpower Present",
        align: "center",
        render: (val) => `<span class="badge badge-primary font-mono text-xs">${val || 12} Crew</span>`
      },
      {
        key: "workCompleted",
        label: "Work Activity Completed Today",
        render: (val) => `<span class="text-xs truncate" style="max-width:320px; display:inline-block;" title="${Utils.escapeHtml(val)}">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "materialsConsumed",
        label: "Materials Consumed",
        render: (val) => `<span class="text-xs text-muted truncate" style="max-width:240px; display:inline-block;">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        align: "right",
        render: (_, row) => `
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-sm view-log-btn" data-id="${row.id}">
              ${Utils.renderIcon("eye", 13)} View Log
            </button>
          </div>
        `
      }
    ],
    data: reports,
    searchFields: ["projectName", "engineerName", "workCompleted", "materialsConsumed"],
    onRowClick: (row) => openReportDetail(row.id)
  });

  // Export CSV
  document.getElementById("site-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_site_daily_logs", AppState.getSiteReports());
  });

  // Add Log
  document.getElementById("site-add-log-btn")?.addEventListener("click", () => {
    openDailyLogForm();
  });

  container.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-log-btn");
    if (viewBtn) {
      e.stopPropagation();
      openReportDetail(viewBtn.getAttribute("data-id"));
    }
  });

  function openReportDetail(id) {
    const r = AppState.getSiteReports().find((x) => x.id === id);
    if (!r) return;

    Modal.open({
      title: `Daily Site Report: ${r.id} &mdash; ${Utils.formatDate(r.reportDate)}`,
      content: `
        <div style="display:flex; flex-direction:column; gap:var(--space-3); font-size:13px;">
          <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:12px; border-radius:var(--radius-sm);">
            <div><strong>Project:</strong> ${Utils.escapeHtml(r.projectName)}</div>
            <div><strong>Supervisor:</strong> ${Utils.escapeHtml(r.engineerName)}</div>
            <div><strong>Labor Crew Count:</strong> ${r.workersPresent} Workers</div>
            <div><strong>Date:</strong> ${Utils.formatDate(r.reportDate)}</div>
          </div>

          <div style="border-left:3px solid var(--color-primary); padding-left:10px;">
            <strong>Work Completed Today:</strong>
            <p style="margin-top:4px; color:var(--color-text-secondary); line-height:1.5;">${Utils.escapeHtml(r.workCompleted)}</p>
          </div>

          <div style="border-left:3px solid var(--color-warning); padding-left:10px;">
            <strong>Materials Consumed on Site:</strong>
            <p style="margin-top:4px; color:var(--color-text-secondary); line-height:1.5;">${Utils.escapeHtml(r.materialsConsumed)}</p>
          </div>

          <div style="border-left:3px solid var(--color-success); padding-left:10px;">
            <strong>Tomorrow's Work Plan:</strong>
            <p style="margin-top:4px; color:var(--color-text-secondary); line-height:1.5;">${Utils.escapeHtml(r.tomorrowsPlan || "Continue assembly according to schedule.")}</p>
          </div>

          <div style="background:#FFFFFF; border:1px solid var(--color-border); padding:10px; border-radius:var(--radius-sm); font-size:12px;">
            <strong>Safety & Site Remarks:</strong> ${Utils.escapeHtml(r.safetyObservations || "All PPE protocols adhered to.")}
          </div>
        </div>
      `,
      size: "md",
      footer: `<button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>`
    });
  }

  function openDailyLogForm() {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");
    const supOptions = employees
      .filter((e) => e.role === "Site Supervisor" || e.designation.includes("Supervisor"))
      .map((e) => `<option value="${e.name}">${e.name} (${e.designation})</option>`)
      .join("");

    Modal.open({
      title: "Submit Daily Field Site Progress Log",
      content: `
        <form id="daily-log-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Select Project Site</label>
              <select class="form-control" name="projectId" required>${prjOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label required">Site Supervisor / Engineer</label>
              <select class="form-control" name="engineerName" required>${supOptions}</select>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Labor / Workers Present</label>
              <input type="number" class="form-control" name="workersPresent" value="14" min="1" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Report Date</label>
              <input type="date" class="form-control" name="reportDate" value="${new Date().toISOString().split("T")[0]}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Work Completed Today</label>
            <textarea class="form-control" name="workCompleted" rows="2" required placeholder="Detail specific panels erected, trusses hoisted, joists secured...">Installed 16 linear meters of 75mm EPS panels on eastern wall. Fixed horizontal bracing.</textarea>
          </div>

          <div class="form-group">
            <label class="form-label required">Materials Consumed on Site</label>
            <input type="text" class="form-control" name="materialsConsumed" value="8 EPS 75mm wall panels, 120 hex screws, 4 tubes silicone sealant" required />
          </div>

          <div class="form-group">
            <label class="form-label required">Tomorrow's Planned Work</label>
            <input type="text" class="form-control" name="tomorrowsPlan" value="Complete roof trusses on west side. Begin laying stone-coated metal roof tiles." required />
          </div>

          <div class="form-group">
            <label class="form-label">Safety Observations / Site Conditions</label>
            <input type="text" class="form-control" name="safetyObservations" value="All workers wearing helmets, boots, and safety harnesses on roof." />
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-log-btn">Submit Daily Log</button>
      `
    });

    document.getElementById("save-log-btn")?.addEventListener("click", () => {
      const form = document.getElementById("daily-log-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addSiteReport({
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        engineerName: formData.get("engineerName"),
        workersPresent: Number(formData.get("workersPresent")),
        reportDate: formData.get("reportDate"),
        workCompleted: formData.get("workCompleted"),
        materialsConsumed: formData.get("materialsConsumed"),
        tomorrowsPlan: formData.get("tomorrowsPlan"),
        safetyObservations: formData.get("safetyObservations")
      });

      Toast.success("Daily site report logged successfully.");
      Modal.close();
      ModuleSiteManagement(container);
    });
  }
};

window.ModuleSiteManagement = ModuleSiteManagement;

