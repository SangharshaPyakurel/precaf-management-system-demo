/**
 * Himalayan Prefab Solutions ERP
 * MODULE 01 — EXECUTIVE DASHBOARD
 */

const ModuleDashboard = (container) => {
  const metrics = AppState.getDashboardMetrics();
  const projects = AppState.getProjects();
  const inventory = AppState.getInventory();
  const inquiries = AppState.getInquiries();
  const notifications = AppState.getNotifications();

  // Low stock items
  const lowStockItems = inventory.filter((i) => i.availableStock <= i.minStock);

  // Delayed / Attention projects
  const attentionProjects = projects.filter((p) => p.health === "Attention Needed" || p.status === "On Hold");

  // Recent 5 projects
  const recentProjects = projects.slice(0, 5);

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Executive Dashboard",
      description: "Real-time enterprise overview of prefabricated construction projects, factory output, inventory, and financial health.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Executive Dashboard" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="dashboard-refresh-btn">
          ${Utils.renderIcon("refresh-cw", 14)} Refresh
        </button>
        <button type="button" class="btn btn-primary btn-sm" onclick="window.location.hash='#projects'">
          ${Utils.renderIcon("layers", 14)} View All Projects
        </button>
      `
    })}

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-5);">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Active Projects</span>
          <div class="metric-icon-box" style="color:var(--color-primary); background:var(--color-primary-light);">
            ${Utils.renderIcon("layers", 18)}
          </div>
        </div>
        <div class="metric-value">${metrics.activeProjects}</div>
        <div class="metric-footer">
          <span class="metric-trend up">${metrics.completedProjects} Completed</span>
          <span>across Nepal</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Total Contract Value</span>
          <div class="metric-icon-box" style="color:#0284C7; background:#E0F2FE;">
            ${Utils.renderIcon("briefcase", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.totalContractValue)}</div>
        <div class="metric-footer">
          <span class="metric-trend up">${projects.length} Active Contracts</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Total Revenue Realized</span>
          <div class="metric-icon-box" style="color:var(--color-success); background:var(--color-success-light);">
            ${Utils.renderIcon("dollar-sign", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.totalRevenue)}</div>
        <div class="metric-footer">
          <span class="text-warning font-medium">Pending: ${Utils.formatCurrency(metrics.totalOutstanding)}</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Estimated Gross Profit</span>
          <div class="metric-icon-box" style="color:#7C3AED; background:#F3E8FF;">
            ${Utils.renderIcon("bar-chart", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.estimatedProfit)}</div>
        <div class="metric-footer">
          <span class="metric-trend up">Avg 22.4% Margin</span>
        </div>
      </div>
    </div>

    <!-- Secondary KPI Strip -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
      <div class="card" style="padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Total Inquiries</div>
          <div style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${metrics.totalInquiries}</div>
        </div>
        <div style="color:var(--color-primary);">${Utils.renderIcon("inbox", 22)}</div>
      </div>

      <div class="card" style="padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Enterprise Customers</div>
          <div style="font-size:20px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${metrics.totalCustomers}</div>
        </div>
        <div style="color:var(--color-success);">${Utils.renderIcon("users", 22)}</div>
      </div>

      <div class="card" style="padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Low Stock Items</div>
          <div style="font-size:20px; font-weight:600; color:${metrics.lowStockCount > 0 ? "var(--color-danger)" : "var(--color-text-primary)"}; margin-top:2px;">${metrics.lowStockCount}</div>
        </div>
        <div style="color:var(--color-danger);">${Utils.renderIcon("package", 22)}</div>
      </div>

      <div class="card" style="padding:14px 18px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Total Material Valuation</div>
          <div style="font-size:18px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${Utils.formatCurrency(inventory.reduce((acc, i) => acc + (i.stockValue || 0), 0))}</div>
        </div>
        <div style="color:var(--color-neutral);">${Utils.renderIcon("factory", 22)}</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-6);">
      <!-- Monthly Revenue Trend (2 Cols) -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Monthly Revenue Trend (NPR)</h3>
            <div class="card-subtitle">Actual revenue recognized over the last 6 months (FY 2081/82)</div>
          </div>
          <span class="badge badge-primary">NPR Lakhs</span>
        </div>
        <div class="card-body" style="height: 260px; position: relative;">
          <canvas id="dashboard-revenue-chart"></canvas>
        </div>
      </div>

      <!-- Project Status Distribution (1 Col) -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Project Portfolio Status</h3>
            <div class="card-subtitle">Distribution across execution stages</div>
          </div>
        </div>
        <div class="card-body" style="height: 260px; position: relative;">
          <canvas id="dashboard-status-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- Active Projects Table & Side Alerts Grid -->
    <div class="grid grid-cols-3" style="gap: var(--space-5);">
      <!-- Priority Active Projects (2 Cols) -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Active Construction Projects</h3>
            <div class="card-subtitle">Key turnkey projects under site execution</div>
          </div>
          <a href="#projects" class="btn btn-outline-primary btn-sm">View Portfolio</a>
        </div>
        <div class="card-body" style="padding:0;">
          <div class="table-container" style="border:none; box-shadow:none;">
            <table class="table-clean">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Contract Value</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${recentProjects
                  .map((p) => {
                    return `
                  <tr style="cursor:pointer;" onclick="window.location.hash='#projects/${p.id}'">
                    <td>
                      <div class="table-cell-bold">${Utils.escapeHtml(p.name)}</div>
                      <div class="text-xs text-muted font-mono">${p.id} &bull; ${p.buildingType}</div>
                    </td>
                    <td>${Utils.escapeHtml(p.customerName)}</td>
                    <td>${Utils.escapeHtml(p.location.split(",")[0])}</td>
                    <td class="font-medium">${Utils.formatCurrency(p.contractValue)}</td>
                    <td style="width:140px;">${Utils.renderProgressBar(p.progress)}</td>
                    <td>${Utils.renderStatusBadge(p.status)}</td>
                  </tr>
                `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Operational Alerts & Recent Activity -->
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <!-- Low Inventory Watchlist -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Critical Inventory Alerts</h3>
            <a href="#inventory" class="text-xs font-medium">Reorder</a>
          </div>
          <div class="card-body" style="padding:var(--space-3) var(--space-4);">
            ${
              lowStockItems.length === 0
                ? '<div class="text-xs text-muted">All warehouse stock levels optimal.</div>'
                : lowStockItems
                    .slice(0, 3)
                    .map((item) => {
                      return `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F1F5F9; font-size:12px;">
                    <div>
                      <div style="font-weight:500; color:var(--color-text-primary);">${Utils.escapeHtml(item.name)}</div>
                      <div style="font-size:11px; color:var(--color-danger);">Stock: ${item.availableStock} ${item.unit} (Min: ${item.minStock})</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#procurement'">Order</button>
                  </div>
                `;
                    })
                    .join("")
            }
          </div>
        </div>

        <!-- System Activity Stream -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Operational Activity</h3>
            <a href="#notifications" class="text-xs font-medium">All Logs</a>
          </div>
          <div class="card-body" style="padding:var(--space-4);">
            <div class="activity-stream">
              <div class="stream-item">
                <div class="stream-dot success"></div>
                <div class="stream-title">Site Report Submitted (PRJ-001)</div>
                <div class="stream-time">2 hours ago &bull; Bishal Thapa</div>
                <div class="stream-desc">Completed 16 linear meters EPS panel assembly at Budhanilkantha.</div>
              </div>
              <div class="stream-item">
                <div class="stream-dot"></div>
                <div class="stream-title">Production Order 85% Completed</div>
                <div class="stream-time">4 hours ago &bull; Factory Line A</div>
                <div class="stream-desc">Light gauge steel trusses fabrication batch cleared by QC.</div>
              </div>
              <div class="stream-item">
                <div class="stream-dot warning"></div>
                <div class="stream-title">Milestone Payment Issued</div>
                <div class="stream-time">Yesterday &bull; Finance</div>
                <div class="stream-desc">Invoice INV-003 issued to Er. Rameshwor Shrestha for Rs. 11,25,000.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach refresh button
  document.getElementById("dashboard-refresh-btn")?.addEventListener("click", () => {
    ModuleDashboard(container);
    Toast.success("Dashboard metrics refreshed.");
  });

  // Render Charts
  setTimeout(() => {
    Charts.renderBarChart(
      "dashboard-revenue-chart",
      ["Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin"],
      [2800000, 3600000, 5200000, 4800000, 6400000, 7800000],
      "Monthly Revenue"
    );

    const statusCounts = {
      "In Progress": 0,
      "Finishing & QC": 0,
      "Handed Over": 0,
      "Planning": 0
    };
    projects.forEach((p) => {
      if (p.status === "In Progress") statusCounts["In Progress"]++;
      else if (p.status === "Finishing & QC") statusCounts["Finishing & QC"]++;
      else if (p.status === "Handed Over" || p.status === "Completed") statusCounts["Handed Over"]++;
      else statusCounts["Planning"]++;
    });

    Charts.renderDonutChart(
      "dashboard-status-chart",
      ["In Progress", "Finishing/QC", "Handed Over", "Planning"],
      [
        statusCounts["In Progress"],
        statusCounts["Finishing & QC"],
        statusCounts["Handed Over"],
        statusCounts["Planning"]
      ]
    );
  }, 50);
};

window.ModuleDashboard = ModuleDashboard;

