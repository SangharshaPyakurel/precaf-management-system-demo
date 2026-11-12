/**
 * Himalayan Prefab Solutions ERP
 * MODULE 22 — REPORTS & BUSINESS ANALYTICS
 */

const ModuleReports = (container) => {
  const projects = AppState.getProjects();
  const inquiries = AppState.getInquiries();
  const inventory = AppState.getInventory();
  const suppliers = Storage.get("suppliers", SEED_DATA.suppliers);
  let activeReport = "profitability"; // 'profitability', 'progress', 'conversion', 'inventory'

  function render() {
    container.innerHTML = `
      ${Layout.renderPageHeader({
        title: "Executive Reports & Business Analytics",
        description: "Comprehensive financial, production, sales pipeline, and inventory reports calculated dynamically from ERP records.",
        breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Reports & Analytics" }],
        actions: `
          <button type="button" class="btn btn-secondary btn-sm" id="report-print-btn">
            ${Utils.renderIcon("printer", 14)} Print Report
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="report-export-btn">
            ${Utils.renderIcon("download", 14)} Export CSV
          </button>
        `
      })}

      <!-- Report Tabs Selector -->
      <div class="tabs-container" style="margin-bottom:var(--space-5);">
        <button type="button" class="tab-btn ${activeReport === "profitability" ? "active" : ""}" data-rep="profitability">
          ${Utils.renderIcon("dollar-sign", 14)} Project Profitability
        </button>
        <button type="button" class="tab-btn ${activeReport === "progress" ? "active" : ""}" data-rep="progress">
          ${Utils.renderIcon("layers", 14)} Construction Progress
        </button>
        <button type="button" class="tab-btn ${activeReport === "conversion" ? "active" : ""}" data-rep="conversion">
          ${Utils.renderIcon("inbox", 14)} Sales Lead Conversion
        </button>
        <button type="button" class="tab-btn ${activeReport === "inventory" ? "active" : ""}" data-rep="inventory">
          ${Utils.renderIcon("package", 14)} Inventory Valuation
        </button>
      </div>

      <!-- Report Content Mount -->
      <div id="report-content-mount"></div>
    `;

    // Attach Tab Listeners
    container.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeReport = btn.getAttribute("data-rep");
        render();
      });
    });

    // Print
    document.getElementById("report-print-btn")?.addEventListener("click", () => {
      Utils.printPage();
    });

    const mount = document.getElementById("report-content-mount");
    if (activeReport === "profitability") {
      renderProfitabilityReport(mount);
    } else if (activeReport === "progress") {
      renderProgressReport(mount);
    } else if (activeReport === "conversion") {
      renderConversionReport(mount);
    } else {
      renderInventoryReport(mount);
    }
  }

  function renderProfitabilityReport(mount) {
    const totalContract = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
    const totalCollected = projects.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
    const totalActualCost = projects.reduce((acc, p) => acc + (p.actualCost || 0), 0);
    const totalProfit = projects.reduce((acc, p) => acc + (p.estimatedProfit || 0), 0);

    mount.innerHTML = `
      <div class="grid grid-cols-4" style="margin-bottom:var(--space-4);">
        <div class="card" style="padding:14px;">
          <div class="text-xs uppercase text-muted font-semibold">Total Contracted</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-text-primary); margin-top:2px;">${Utils.formatCurrency(totalContract)}</div>
        </div>
        <div class="card" style="padding:14px;">
          <div class="text-xs uppercase text-muted font-semibold">Total Revenue Collected</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-success); margin-top:2px;">${Utils.formatCurrency(totalCollected)}</div>
        </div>
        <div class="card" style="padding:14px;">
          <div class="text-xs uppercase text-muted font-semibold">Incurred Construction Cost</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-danger); margin-top:2px;">${Utils.formatCurrency(totalActualCost)}</div>
        </div>
        <div class="card" style="padding:14px;">
          <div class="text-xs uppercase text-muted font-semibold">Projected Net Margin</div>
          <div style="font-size:18px; font-weight:700; color:var(--color-primary); margin-top:2px;">${Utils.formatCurrency(totalProfit)}</div>
        </div>
      </div>

      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>
              <th>Project</th>
              <th>Customer</th>
              <th style="text-align:right;">Contract Value</th>
              <th style="text-align:right;">Paid</th>
              <th style="text-align:right;">Outstanding</th>
              <th style="text-align:right;">Estimated Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${projects
              .map((p) => {
                return `
              <tr>
                <td class="font-medium">${Utils.escapeHtml(p.name)}</td>
                <td>${Utils.escapeHtml(p.customerName)}</td>
                <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(p.contractValue)}</td>
                <td class="font-mono text-success" style="text-align:right;">${Utils.formatCurrency(p.paidAmount)}</td>
                <td class="font-mono text-danger" style="text-align:right;">${Utils.formatCurrency(p.outstandingAmount)}</td>
                <td class="font-mono font-semibold" style="text-align:right;">${Utils.formatCurrency(p.estimatedProfit)}</td>
                <td>${Utils.renderStatusBadge(p.status)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("report-export-btn")?.addEventListener("click", () => {
      Utils.exportToCsv("hps_profitability_report", projects);
    });
  }

  function renderProgressReport(mount) {
    mount.innerHTML = `
      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Building Type</th>
              <th>Location</th>
              <th>Manager</th>
              <th>Target Date</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${projects
              .map((p) => {
                return `
              <tr>
                <td class="font-medium">${Utils.escapeHtml(p.name)}</td>
                <td>${Utils.escapeHtml(p.buildingType)}</td>
                <td>${Utils.escapeHtml(p.location.split(",")[0])}</td>
                <td>${Utils.escapeHtml(p.projectManagerName)}</td>
                <td class="text-xs">${Utils.formatDate(p.expectedCompletion)}</td>
                <td style="width:140px;">${Utils.renderProgressBar(p.progress)}</td>
                <td>${Utils.renderStatusBadge(p.status)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("report-export-btn")?.addEventListener("click", () => {
      Utils.exportToCsv("hps_progress_report", projects);
    });
  }

  function renderConversionReport(mount) {
    mount.innerHTML = `
      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>
              <th>Inquiry ID</th>
              <th>Customer</th>
              <th>Building Type</th>
              <th>Location</th>
              <th>Est. Budget</th>
              <th>Sales Rep</th>
              <th>Pipeline Status</th>
            </tr>
          </thead>
          <tbody>
            ${inquiries
              .map((i) => {
                return `
              <tr>
                <td class="font-mono text-xs font-semibold text-primary-color">${i.id}</td>
                <td>${Utils.escapeHtml(i.customerName)}</td>
                <td class="font-medium">${Utils.escapeHtml(i.buildingType)}</td>
                <td>${Utils.escapeHtml(i.location.split(",")[0])}</td>
                <td class="font-mono">${Utils.formatCurrency(i.estimatedBudget)}</td>
                <td>${Utils.escapeHtml(i.salesRepName)}</td>
                <td>${Utils.renderStatusBadge(i.status)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("report-export-btn")?.addEventListener("click", () => {
      Utils.exportToCsv("hps_lead_conversion_report", inquiries);
    });
  }

  function renderInventoryReport(mount) {
    mount.innerHTML = `
      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Material Description</th>
              <th>Category</th>
              <th style="text-align:right;">Available</th>
              <th style="text-align:right;">Unit Cost</th>
              <th style="text-align:right;">Stock Valuation</th>
            </tr>
          </thead>
          <tbody>
            ${inventory
              .map((inv) => {
                return `
              <tr>
                <td class="font-mono text-xs font-semibold text-primary-color">${inv.sku}</td>
                <td class="font-medium">${Utils.escapeHtml(inv.name)}</td>
                <td>${Utils.escapeHtml(inv.category)}</td>
                <td class="font-mono" style="text-align:right;">${inv.availableStock.toLocaleString()} ${inv.unit}</td>
                <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(inv.unitCost)}</td>
                <td class="font-mono font-semibold" style="text-align:right;">${Utils.formatCurrency(inv.stockValue)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("report-export-btn")?.addEventListener("click", () => {
      Utils.exportToCsv("hps_inventory_valuation_report", inventory);
    });
  }

  render();
};

window.ModuleReports = ModuleReports;

