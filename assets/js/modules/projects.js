/**
 * Himalayan Prefab Solutions ERP
 * MODULE 09 — PROJECT MANAGEMENT & 15-TAB DETAIL VIEW
 */

const ModuleProjects = (container, params = {}) => {
  const projectId = params.id;

  if (projectId) {
    renderProjectDetail(container, projectId, params.tab || "overview");
  } else {
    renderProjectsList(container, params);
  }
};

/**
 * RENDER PROJECTS PORTFOLIO LIST
 */
function renderProjectsList(container, params) {
  const projects = AppState.getProjects();
  const customers = AppState.getCustomers();
  const employees = AppState.getEmployees();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Prefab Construction Projects Portfolio",
      description: "Centralized execution oversight of active prefabricated residential, commercial, industrial, and institutional structures across Nepal.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Projects" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="prj-export-btn">
          ${Utils.renderIcon("download", 14)} Export Projects
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="prj-add-btn">
          ${Utils.renderIcon("plus", 14)} New Project
        </button>
      `
    })}

    <!-- Filter & Search Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-box-icon">${Utils.renderIcon("search", 15)}</span>
        <input type="text" id="prj-search-input" placeholder="Search project name, client, location, ID..." />
      </div>

      <div class="filter-group">
        <select class="form-control" id="prj-type-filter" style="width:190px; height:34px; font-size:12px;">
          <option value="">All Building Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial Warehouse</option>
          <option value="Modular">Modular Cottages</option>
          <option value="Office">Office Building</option>
          <option value="School">School / Institutional</option>
          <option value="Staff Accommodation">Staff Accommodation</option>
        </select>

        <select class="form-control" id="prj-status-filter" style="width:160px; height:34px; font-size:12px;">
          <option value="">All Statuses</option>
          <option value="Planning & Design">Planning & Design</option>
          <option value="In Progress">In Progress</option>
          <option value="Finishing & QC">Finishing & QC</option>
          <option value="Handed Over">Handed Over</option>
        </select>
      </div>
    </div>

    <!-- Table Mount -->
    <div id="projects-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("projects-table-mount"),
    columns: [
      {
        key: "id",
        label: "Project ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "name",
        label: "Project Title & Type",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.buildingType)} &bull; ${row.areaSqFt || "-"} sq ft</div>
          </div>
        `
      },
      {
        key: "customerName",
        label: "Client",
        render: (val) => `<span class="text-xs font-medium">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "location",
        label: "Location",
        render: (val) => `<span class="text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "contractValue",
        label: "Contract (NPR)",
        align: "right",
        render: (val) => `<span class="font-mono font-medium">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "progress",
        label: "Progress",
        width: "140px",
        render: (val) => Utils.renderProgressBar(val)
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
            <a href="#projects/${row.id}" class="btn btn-secondary btn-sm" title="Open Full 15-Tab Project Workspace">
              ${Utils.renderIcon("layers", 13)} Open Workspace
            </a>
          </div>
        `
      }
    ],
    data: projects,
    searchFields: ["name", "customerName", "buildingType", "location", "id"],
    onRowClick: (row) => {
      window.location.hash = `#projects/${row.id}`;
    }
  });

  // Attach search
  document.getElementById("prj-search-input")?.addEventListener("input", (e) => {
    table.setSearch(e.target.value);
  });

  // Filters
  const typeFilter = document.getElementById("prj-type-filter");
  const statusFilter = document.getElementById("prj-status-filter");

  const filterHandler = () => {
    const tVal = typeFilter.value.toLowerCase();
    const sVal = statusFilter.value;

    let filtered = AppState.getProjects();
    if (tVal) {
      filtered = filtered.filter((p) => (p.buildingType || "").toLowerCase().includes(tVal));
    }
    if (sVal) {
      filtered = filtered.filter((p) => p.status === sVal);
    }
    table.updateData(filtered);
  };

  typeFilter?.addEventListener("change", filterHandler);
  statusFilter?.addEventListener("change", filterHandler);

  // Export CSV
  document.getElementById("prj-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_projects_portfolio", AppState.getProjects());
  });

  // Add Project
  document.getElementById("prj-add-btn")?.addEventListener("click", () => {
    openProjectForm();
  });

  function openProjectForm() {
    const custOptions = customers
      .map((c) => `<option value="${c.id}">${Utils.escapeHtml(c.name)} (${c.id})</option>`)
      .join("");

    const pmOptions = employees
      .filter((e) => e.role === "Project Manager" || e.designation.includes("Project Manager"))
      .map((e) => `<option value="${e.name}">${e.name} (${e.designation})</option>`)
      .join("");

    const formHtml = `
      <form id="project-form">
        <div class="form-group">
          <label class="form-label required">Project Name</label>
          <input type="text" class="form-control" name="name" value="Kathmandu Valley Prefab Structure" required />
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Customer</label>
            <select class="form-control" name="customerId" required>${custOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label required">Building Type</label>
            <select class="form-control" name="buildingType" required>
              <option value="Two-Storey Residential Prefab House">Two-Storey Residential Prefab House</option>
              <option value="Single-Storey Modular House">Single-Storey Modular House</option>
              <option value="Three-Storey Commercial Prefab Building">Three-Storey Commercial Prefab Building</option>
              <option value="Prefab Office Building">Prefab Office Building</option>
              <option value="Industrial Prefab Warehouse">Industrial Prefab Warehouse</option>
              <option value="Modular Staff Accommodation">Modular Staff Accommodation</option>
              <option value="Prefab School Building">Prefab School Building</option>
              <option value="Commercial Prefab Shop">Commercial Prefab Shop</option>
            </select>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Location</label>
            <input type="text" class="form-control" name="location" value="Budhanilkantha-03, Kathmandu" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Contract Value (NPR)</label>
            <input type="number" class="form-control" name="contractValue" value="4500000" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Project Manager</label>
            <select class="form-control" name="projectManagerName" required>${pmOptions}</select>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Start Date</label>
            <input type="date" class="form-control" name="startDate" value="${new Date().toISOString().split("T")[0]}" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Target Completion</label>
            <input type="date" class="form-control" name="expectedCompletion" value="2026-12-31" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Production Model</label>
            <select class="form-control" name="productionModel" required>
              <option value="In-House Manufacturing">In-House Manufacturing (Factory Sitapaila)</option>
              <option value="Supplier Components Assembly">Supplier Components Assembly</option>
              <option value="Hybrid (In-house + Supplier)">Hybrid (In-house + Supplier)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Project Scope Description</label>
          <textarea class="form-control" name="description" rows="2">Turnkey prefabricated modular construction including light gauge steel frame, EPS sandwich wall panels, and finishes.</textarea>
        </div>
      </form>
    `;

    Modal.open({
      title: "Initialize New Construction Project",
      content: formHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-project-btn">Create Project</button>
      `
    });

    document.getElementById("save-project-btn")?.addEventListener("click", () => {
      const form = document.getElementById("project-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);
      const val = Number(formData.get("contractValue")) || 4500000;

      const payload = {
        name: formData.get("name"),
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        buildingType: formData.get("buildingType"),
        location: formData.get("location"),
        contractValue: val,
        projectManagerName: formData.get("projectManagerName"),
        startDate: formData.get("startDate"),
        expectedCompletion: formData.get("expectedCompletion"),
        productionModel: formData.get("productionModel"),
        description: formData.get("description"),
        progress: 10,
        status: "Planning & Design"
      };

      const newPrj = AppState.addProject(payload);
      Toast.success(`Project ${newPrj.id} initialized.`);
      Modal.close();
      window.location.hash = `#projects/${newPrj.id}`;
    });
  }
}

/**
 * RENDER COMPLETE 15-TAB PROJECT DETAIL WORKSPACE
 */
function renderProjectDetail(container, projectId, activeTab = "overview") {
  const project = AppState.getProject(projectId);

  if (!project) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${Utils.renderIcon("layers", 48)}</div>
        <div class="empty-state-title">Project Not Found</div>
        <div class="empty-state-desc">No project record matching ID "${projectId}".</div>
        <a href="#projects" class="btn btn-primary">Return to Projects Portfolio</a>
      </div>
    `;
    return;
  }

  // Related interconnected records
  const tasks = AppState.getTasks().filter((t) => t.projectId === projectId);
  const productionOrders = AppState.getProductionOrders().filter((p) => p.projectId === projectId);
  const purchaseOrders = AppState.getPurchaseOrders().filter((p) => p.projectId === projectId);
  const siteReports = AppState.getSiteReports().filter((s) => s.projectId === projectId);
  const dispatches = Storage.get("dispatches", SEED_DATA.dispatches).filter((d) => d.projectId === projectId);
  const inspections = AppState.getInspections().filter((i) => i.projectId === projectId);
  const invoices = AppState.getInvoicesAndPayments().filter((i) => i.projectId === projectId);
  const documents = Storage.get("documents", SEED_DATA.documents).filter((d) => d.projectId === projectId);

  const tabs = [
    { id: "overview", label: "Overview", icon: "layers" },
    { id: "timeline", label: "Timeline", icon: "calendar" },
    { id: "tasks", label: "Tasks", count: tasks.length, icon: "check-circle" },
    { id: "team", label: "Team", icon: "users" },
    { id: "budget", label: "Budget & Cost", icon: "dollar-sign" },
    { id: "materials", label: "Materials", icon: "package" },
    { id: "production", label: "Production", count: productionOrders.length, icon: "factory" },
    { id: "procurement", label: "Procurement", count: purchaseOrders.length, icon: "shopping-cart" },
    { id: "transportation", label: "Logistics", count: dispatches.length, icon: "truck" },
    { id: "site-progress", label: "Site Progress", count: siteReports.length, icon: "hard-hat" },
    { id: "quality", label: "Quality QC", count: inspections.length, icon: "check-circle" },
    { id: "documents", label: "Documents", count: documents.length, icon: "folder" },
    { id: "issues", label: "Issues", icon: "alert-triangle" },
    { id: "payments", label: "Payments", count: invoices.length, icon: "file-text" },
    { id: "history", label: "Activity History", icon: "clock" }
  ];

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: project.name,
      description: `${project.buildingType} &bull; ${project.location} &bull; Client: ${project.customerName}`,
      breadcrumb: [
        { label: "HPS ERP", path: "#dashboard" },
        { label: "Projects", path: "#projects" },
        { label: project.id }
      ],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.hash='#projects'">
          ${Utils.renderIcon("chevron-left", 14)} Back to Projects
        </button>
        <button type="button" class="btn btn-outline-primary btn-sm" id="prj-quick-progress-btn">
          ${Utils.renderIcon("edit", 13)} Update Progress (${project.progress}%)
        </button>
      `
    })}

    <!-- Project Hero Header Card -->
    <div class="card" style="margin-bottom:var(--space-5); padding:var(--space-4) var(--space-5); background:linear-gradient(to right, #FFFFFF, #F8FAFC);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--color-primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center;">
            ${Utils.renderIcon("layers", 26)}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="font-mono text-sm font-semibold text-primary-color">${project.id}</span>
              ${Utils.renderStatusBadge(project.status)}
              <span class="badge badge-neutral text-xs">${project.productionModel || "In-House"}</span>
            </div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">
              Manager: <strong>${project.projectManagerName}</strong> &bull; Site Lead: <strong>${project.siteSupervisorName || "Bishal Thapa"}</strong> &bull; Start: <strong>${Utils.formatDate(project.startDate)}</strong> &bull; Target: <strong>${Utils.formatDate(project.expectedCompletion)}</strong>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:24px;">
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Contract Value</div>
            <div style="font-size:18px; font-weight:700; color:var(--color-text-primary);">${Utils.formatCurrency(project.contractValue)}</div>
          </div>
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Overall Progress</div>
            <div style="min-width:140px; margin-top:4px;">${Utils.renderProgressBar(project.progress)}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 15 Reusable Navigation Tabs -->
    <div class="tabs-container" id="project-tabs-container">
      ${tabs
        .map((t) => {
          const isActive = t.id === activeTab;
          return `
          <button type="button" class="tab-btn ${isActive ? "active" : ""}" data-tab="${t.id}">
            ${Utils.renderIcon(t.icon, 14)}
            <span>${t.label}</span>
            ${t.count !== undefined ? `<span class="tab-pill">${t.count}</span>` : ""}
          </button>
        `;
        })
        .join("")}
    </div>

    <!-- Tab Dynamic Content Mount -->
    <div id="project-tab-content-mount">
      <!-- Injected per active tab -->
    </div>
  `;

  // Attach Tab Switcher
  container.querySelectorAll("#project-tabs-container .tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      container.querySelectorAll("#project-tabs-container .tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderActiveTabContent(tabId);
    });
  });

  // Attach Progress Update Modal
  document.getElementById("prj-quick-progress-btn")?.addEventListener("click", () => {
    Modal.open({
      title: `Update Progress: ${project.name}`,
      content: `
        <div class="form-group">
          <label class="form-label required">Project Progress (%)</label>
          <input type="number" class="form-control" id="progress-slider" value="${project.progress}" min="0" max="100" />
        </div>
        <div class="form-group">
          <label class="form-label required">Execution Status</label>
          <select class="form-control" id="progress-status-select">
            <option value="Planning & Design" ${project.status === "Planning & Design" ? "selected" : ""}>Planning & Design</option>
            <option value="In Progress" ${project.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Finishing & QC" ${project.status === "Finishing & QC" ? "selected" : ""}>Finishing & QC</option>
            <option value="Handed Over" ${project.status === "Handed Over" ? "selected" : ""}>Handed Over</option>
          </select>
        </div>
      `,
      size: "sm",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-progress-btn">Update Progress</button>
      `
    });

    document.getElementById("save-progress-btn")?.addEventListener("click", () => {
      const newProg = Number(document.getElementById("progress-slider").value);
      const newStat = document.getElementById("progress-status-select").value;
      AppState.updateProject(projectId, { progress: newProg, status: newStat });
      Toast.success("Project progress updated.");
      Modal.close();
      renderProjectDetail(container, projectId, activeTab);
    });
  });

  // Render initial tab content
  renderActiveTabContent(activeTab);

  function renderActiveTabContent(tabKey) {
    const mount = document.getElementById("project-tab-content-mount");
    if (!mount) return;

    if (tabKey === "overview") {
      mount.innerHTML = `
        <div class="grid grid-cols-3" style="gap:var(--space-5);">
          <!-- Left 2 Cols: Scope, Specifications, Foundation -->
          <div style="grid-column: span 2; display:flex; flex-direction:column; gap:var(--space-4);">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Project Scope & Technical Specifications</h3>
              </div>
              <div class="card-body">
                <p style="font-size:13px; line-height:1.6; color:var(--color-text-secondary); margin-bottom:var(--space-4);">
                  ${Utils.escapeHtml(project.description)}
                </p>
                <div class="grid grid-cols-2" style="font-size:12px; gap:var(--space-3); background:var(--color-bg-subtle); padding:12px; border-radius:var(--radius-sm);">
                  <div><strong>Built-up Area:</strong> ${project.areaSqFt} Sq. Feet</div>
                  <div><strong>Storeys / Elevation:</strong> ${project.floors} Floors</div>
                  <div><strong>Structural System:</strong> Light Gauge Galvanized Steel (C89/C150)</div>
                  <div><strong>Wall Envelope:</strong> 75mm EPS Insulated Sandwich Panels</div>
                  <div><strong>Roof System:</strong> Stone Coated Metal Tiles over 50mm PUF Deck</div>
                  <div><strong>Joinery:</strong> Double Glazed Thermal UPVC Windows</div>
                </div>
              </div>
            </div>

            <!-- Key Milestones -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Execution Milestones & Deliverables</h3>
              </div>
              <div class="card-body" style="padding:0;">
                <table class="table-clean">
                  <thead>
                    <tr><th>Stage Milestone</th><th>Target Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    <tr><td class="font-medium">1. Geotechnical Survey & Foundation Beam Casting</td><td>2026-09-15</td><td><span class="badge badge-success">Completed</span></td></tr>
                    <tr><td class="font-medium">2. Factory Steel Frame Fabrication & Roll Forming</td><td>2026-10-10</td><td><span class="badge badge-success">Completed</span></td></tr>
                    <tr><td class="font-medium">3. Primary Structural Steel Erection & Mezzanine Joists</td><td>2026-10-28</td><td><span class="badge badge-success">Completed</span></td></tr>
                    <tr><td class="font-medium">4. Wall Sandwich Panels & Joint Silicone Weatherproofing</td><td>2026-11-12</td><td><span class="badge badge-primary">75% Complete</span></td></tr>
                    <tr><td class="font-medium">5. Roof Truss Installation & Stone Metal Tile Laying</td><td>2026-11-18</td><td><span class="badge badge-warning">In Progress</span></td></tr>
                    <tr><td class="font-medium">6. MEP Rough-in, UPVC Windows, Finishes & Final Handover</td><td>2026-12-15</td><td><span class="badge badge-neutral">Scheduled</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Right Col: Financial Overview & Manager -->
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Financial Summary</h3>
              </div>
              <div class="card-body" style="font-size:13px; line-height:2;">
                <div style="display:flex; justify-content:space-between;">
                  <span>Contract Value:</span>
                  <strong class="font-mono">${Utils.formatCurrency(project.contractValue)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; color:var(--color-success);">
                  <span>Total Paid to Date:</span>
                  <strong class="font-mono">${Utils.formatCurrency(project.paidAmount)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; color:${project.outstandingAmount > 0 ? "var(--color-danger)" : "var(--color-text-secondary)"};">
                  <span>Outstanding Receivable:</span>
                  <strong class="font-mono">${Utils.formatCurrency(project.outstandingAmount)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-top:1px solid var(--color-border); padding-top:6px; margin-top:4px;">
                  <span>Actual Cost Incurred:</span>
                  <span class="font-mono">${Utils.formatCurrency(project.actualCost)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:var(--color-primary);">
                  <span>Projected Gross Margin:</span>
                  <strong class="font-mono">${Utils.formatCurrency(project.estimatedProfit)}</strong>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Project Leadership</h3>
              </div>
              <div class="card-body" style="font-size:12px; display:flex; flex-direction:column; gap:8px;">
                <div>
                  <div class="text-xs text-muted">Project Manager</div>
                  <div class="font-semibold text-sm">${project.projectManagerName}</div>
                  <div class="text-muted">+977-9851022334 &bull; prakash@himalayanprefab.com.np</div>
                </div>
                <div style="border-top:1px solid #F1F5F9; padding-top:8px;">
                  <div class="text-xs text-muted">Site Engineer / Supervisor</div>
                  <div class="font-semibold text-sm">${project.siteSupervisorName || "Bishal Thapa"}</div>
                  <div class="text-muted">+977-9841066778 &bull; Field Office Budhanilkantha</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (tabKey === "timeline") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Gantt & Milestone Timeline</h3>
            <span class="text-xs text-muted">${Utils.formatDate(project.startDate)} &mdash; ${Utils.formatDate(project.expectedCompletion)}</span>
          </div>
          <div class="card-body">
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${tasks
                .map((t) => {
                  return `
                <div style="display:flex; align-items:center; gap:16px; font-size:13px;">
                  <div style="width:260px; font-weight:500;">${Utils.escapeHtml(t.title)}</div>
                  <div style="width:160px; font-size:11px; color:var(--color-text-secondary);">${Utils.formatDate(t.startDate)} to ${Utils.formatDate(t.dueDate)}</div>
                  <div style="flex:1;">${Utils.renderProgressBar(t.completion)}</div>
                  <div style="width:90px; text-align:right;">${Utils.renderStatusBadge(t.status)}</div>
                </div>
              `;
                })
                .join("")}
            </div>
          </div>
        </div>
      `;
    } else if (tabKey === "tasks") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Project Execution Tasks (${tasks.length})</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#planning'">Open Full Planning Board</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>Task</th><th>Assigned</th><th>Due Date</th><th>Priority</th><th>Progress</th><th>Status</th></tr></thead>
              <tbody>
                ${tasks
                  .map(
                    (t) => `
                  <tr>
                    <td class="font-medium">${Utils.escapeHtml(t.title)}</td>
                    <td>${Utils.escapeHtml(t.assignedName)}</td>
                    <td class="text-xs">${Utils.formatDate(t.dueDate)}</td>
                    <td><span class="badge ${t.priority === "Urgent" ? "badge-danger" : t.priority === "High" ? "badge-warning" : "badge-neutral"}">${t.priority}</span></td>
                    <td style="width:120px;">${Utils.renderProgressBar(t.completion)}</td>
                    <td>${Utils.renderStatusBadge(t.status)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tabKey === "team") {
      mount.innerHTML = `
        <div class="grid grid-cols-3" style="gap:var(--space-4);">
          <div class="card" style="padding:16px; text-align:center;">
            <div class="user-avatar" style="margin:0 auto 10px; width:48px; height:48px; font-size:18px;">PA</div>
            <div style="font-weight:600; font-size:14px;">Er. Prakash Adhikari</div>
            <div class="text-xs text-muted">Senior Project Manager</div>
            <div style="margin-top:8px; font-size:12px;">Overall schedule, contract milestones, client liaison</div>
          </div>
          <div class="card" style="padding:16px; text-align:center;">
            <div class="user-avatar" style="margin:0 auto 10px; width:48px; height:48px; font-size:18px;">BT</div>
            <div style="font-weight:600; font-size:14px;">Bishal Thapa</div>
            <div class="text-xs text-muted">Field Site Supervisor</div>
            <div style="margin-top:8px; font-size:12px;">On-site erection crew, daily logs, safety inspections</div>
          </div>
          <div class="card" style="padding:16px; text-align:center;">
            <div class="user-avatar" style="margin:0 auto 10px; width:48px; height:48px; font-size:18px;">AK</div>
            <div style="font-weight:600; font-size:14px;">Er. Anupama Karki</div>
            <div class="text-xs text-muted">CAD & Structural Engineer</div>
            <div style="margin-top:8px; font-size:12px;">Frame engineering, NBC 105 calculations, drawing signoff</div>
          </div>
        </div>
      `;
    } else if (tabKey === "production") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Factory Manufacturing Orders</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#production'">Open Factory Line</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>Order #</th><th>Component</th><th>Quantity</th><th>Current Stage</th><th>Progress</th><th>Status</th></tr></thead>
              <tbody>
                ${productionOrders
                  .map(
                    (p) => `
                  <tr>
                    <td class="font-mono text-xs font-semibold text-primary-color">${p.orderNumber}</td>
                    <td class="font-medium">${p.component}</td>
                    <td>${p.completedQuantity} / ${p.plannedQuantity} ${p.unit}</td>
                    <td><span class="badge badge-primary">${p.currentStage}</span></td>
                    <td style="width:140px;">${Utils.renderProgressBar(p.progress)}</td>
                    <td>${Utils.renderStatusBadge(p.status)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tabKey === "procurement") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Procurement & Supplier Purchase Orders</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#procurement'">Create PO</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Order Date</th><th>Delivery</th><th>Status</th></tr></thead>
              <tbody>
                ${purchaseOrders
                  .map(
                    (po) => `
                  <tr>
                    <td class="font-mono text-xs font-semibold text-primary-color">${po.poNumber}</td>
                    <td class="font-medium">${po.supplierName}</td>
                    <td class="font-mono">${Utils.formatCurrency(po.totalAmount)}</td>
                    <td class="text-xs">${Utils.formatDate(po.orderDate)}</td>
                    <td class="text-xs">${Utils.formatDate(po.deliveryDate)}</td>
                    <td>${Utils.renderStatusBadge(po.status)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tabKey === "site-progress") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Daily Field Site Reports</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#site-management'">Submit Log</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>Date</th><th>Supervisor</th><th>Workers</th><th>Work Completed</th><th>Materials Consumed</th></tr></thead>
              <tbody>
                ${siteReports
                  .map(
                    (r) => `
                  <tr>
                    <td class="text-xs font-medium">${Utils.formatDate(r.reportDate)}</td>
                    <td>${r.engineerName}</td>
                    <td><span class="badge badge-neutral">${r.workersPresent} Crew</span></td>
                    <td style="max-width:300px; font-size:12px;">${Utils.escapeHtml(r.workCompleted)}</td>
                    <td style="max-width:240px; font-size:12px; color:var(--color-text-secondary);">${Utils.escapeHtml(r.materialsConsumed)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tabKey === "quality") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quality Assurance & Inspections</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#quality'">Conduct QC</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>Inspection #</th><th>Type</th><th>Inspector</th><th>Date</th><th>Result</th><th>Remarks</th></tr></thead>
              <tbody>
                ${inspections
                  .map(
                    (q) => `
                  <tr>
                    <td class="font-mono text-xs font-semibold text-primary-color">${q.inspectionNumber}</td>
                    <td class="font-medium">${q.inspectionType}</td>
                    <td>${q.inspectorName}</td>
                    <td class="text-xs">${Utils.formatDate(q.inspectionDate)}</td>
                    <td>${Utils.renderStatusBadge(q.result)}</td>
                    <td class="text-xs text-muted">${Utils.escapeHtml(q.remarks)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (tabKey === "payments") {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Billing & Milestone Invoices</h3>
            <button class="btn btn-primary btn-sm" onclick="window.location.hash='#finance'">Record Payment</button>
          </div>
          <div class="card-body" style="padding:0;">
            <table class="table-clean">
              <thead><tr><th>Invoice #</th><th>Milestone</th><th>Amount</th><th>Due Date</th><th>Payment Ref</th><th>Status</th></tr></thead>
              <tbody>
                ${invoices
                  .map(
                    (inv) => `
                  <tr>
                    <td class="font-mono text-xs font-semibold text-primary-color">${inv.invoiceNumber}</td>
                    <td class="font-medium">${inv.milestone || inv.category || "Project Payment"}</td>
                    <td class="font-mono">${Utils.formatCurrency(inv.amount)}</td>
                    <td class="text-xs">${Utils.formatDate(inv.dueDate || inv.date)}</td>
                    <td class="text-xs text-muted font-mono">${inv.transactionRef || "-"}</td>
                    <td>${Utils.renderStatusBadge(inv.status)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      // General Fallback for other tabs (Budget, Materials, Transportation, Documents, Issues, History)
      mount.innerHTML = `
        <div class="card" style="padding:var(--space-6);">
          <div class="card-header" style="border:none; padding:0 0 var(--space-4);">
            <h3 class="card-title">${tabKey.toUpperCase()} Information</h3>
          </div>
          <div style="font-size:13px; color:var(--color-text-secondary); line-height:1.6;">
            Showing interconnected operational records for <strong>${project.name}</strong> (${project.id}).
            All records synchronise in real-time across factory manufacturing, procurement, site management, and client accounting.
          </div>
        </div>
      `;
    }
  }
}

window.ModuleProjects = ModuleProjects;

