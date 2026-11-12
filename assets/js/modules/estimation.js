/**
 * Himalayan Prefab Solutions ERP
 * MODULE 06 — BOQ & COST ESTIMATION
 */

const ModuleEstimation = (container) => {
  const projects = AppState.getProjects();
  let selectedProjectId = projects[0]?.id || "PRJ-001";

  // Pre-populated realistic BOQ items for the flagship Two-Storey Prefab Villa (PRJ-001)
  const defaultBOQItems = [
    { item: "Light Gauge Steel Studs (89x41x0.8mm)", spec: "Z140 Galvanized 550MPa", unit: "Meter", qty: 2400, unitPrice: 280 },
    { item: "Floor Joist Track (150x50x1.2mm)", spec: "Mezzanine joists structural", unit: "Meter", qty: 850, unitPrice: 450 },
    { item: "EPS Sandwich Wall Panels 75mm", spec: "0.5mm color coated steel sheet", unit: "Sq. Meter", qty: 450, unitPrice: 1650 },
    { item: "EPS Internal Partitions 50mm", spec: "Double skin partition", unit: "Sq. Meter", qty: 280, unitPrice: 1350 },
    { item: "PUF Sandwich Roof Panel 50mm", spec: "3-rib corrugated leakproof", unit: "Sq. Meter", qty: 220, unitPrice: 2200 },
    { item: "Stone-Coated Metal Roof Tiles", spec: "Terracotta architectural profile", unit: "Pcs", qty: 650, unitPrice: 620 },
    { item: "RCC Strip Foundation & Baseplate Casting", spec: "M20 concrete + M16 anchor bolts", unit: "R. Ft", qty: 180, unitPrice: 1200 },
    { item: "Thermal Double Glazed UPVC Windows", spec: "5mm+9A+5mm toughened", unit: "Set", qty: 12, unitPrice: 14500 },
    { item: "Pre-hung Steel Security Entry Door", spec: "Heavy multipoint lock", unit: "Set", qty: 2, unitPrice: 18500 },
    { item: "Laminated Flush Internal Doors", spec: "Waterproof core with mortise lock", unit: "Set", qty: 8, unitPrice: 8500 },
    { item: "Waterproof SPC Vinyl Flooring", spec: "4mm click lock with EVA pad", unit: "Sq. Ft", qty: 1850, unitPrice: 140 },
    { item: "Electrical Rough-in & Distribution", spec: "FR copper wire, conduits, 12-way DB", unit: "Lump sum", qty: 1, unitPrice: 165000 },
    { item: "PPR Plumbing & Sanitary Fixtures", spec: "Hot & cold lines + bathroom sets", unit: "Lump sum", qty: 1, unitPrice: 185000 },
    { item: "Exterior Weatherproof Paint & Sealants", spec: "Acrylic weatherproof emulsion", unit: "Lump sum", qty: 1, unitPrice: 85000 }
  ];

  let currentItems = JSON.parse(JSON.stringify(defaultBOQItems));

  function renderView() {
    // Calculate subtotals
    let materialSubtotal = 0;
    currentItems.forEach((row) => {
      row.total = Math.round((Number(row.qty) || 0) * (Number(row.unitPrice) || 0));
      materialSubtotal += row.total;
    });

    const labourCost = Math.round(materialSubtotal * 0.14);
    const transportationCost = 120000;
    const machineryCost = 90000;
    const installationCost = Math.round(materialSubtotal * 0.10);
    const overheadCost = Math.round(materialSubtotal * 0.05);
    const contingencyCost = 100000;

    const subtotalBeforeTax = materialSubtotal + labourCost + transportationCost + machineryCost + installationCost + overheadCost + contingencyCost;
    const taxRate = 0.13; // VAT in Nepal 13%
    const taxAmount = Math.round(subtotalBeforeTax * taxRate);
    const grandTotal = subtotalBeforeTax + taxAmount;

    const prjOptions = projects
      .map((p) => `<option value="${p.id}" ${p.id === selectedProjectId ? "selected" : ""}>${p.name} (${p.id})</option>`)
      .join("");

    container.innerHTML = `
      ${Layout.renderPageHeader({
        title: "BOQ & Cost Estimation Engine",
        description: "Interactive Bill of Quantities generator with dynamic rate analysis, labour, machinery, and VAT calculation.",
        breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "BOQ & Estimation" }],
        actions: `
          <button type="button" class="btn btn-secondary btn-sm" id="boq-print-btn">
            ${Utils.renderIcon("printer", 14)} Print BOQ
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="boq-duplicate-btn">
            ${Utils.renderIcon("refresh-cw", 14)} Reset to Template
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="boq-save-btn">
            ${Utils.renderIcon("check", 14)} Save & Update Project
          </button>
        `
      })}

      <!-- Project Selector & Quick Stats Bar -->
      <div class="card" style="margin-bottom:var(--space-4); padding:var(--space-4);">
        <div class="form-grid-3" style="align-items:center; margin-bottom:0;">
          <div class="form-group no-margin">
            <label class="form-label">Linked Project</label>
            <select class="form-control" id="boq-project-select">
              ${prjOptions}
            </select>
          </div>
          <div class="form-group no-margin">
            <label class="form-label">Total Material Cost</label>
            <div style="font-size:16px; font-weight:600; color:var(--color-primary);">${Utils.formatCurrency(materialSubtotal)}</div>
          </div>
          <div class="form-group no-margin">
            <label class="form-label">Estimated Grand Total (Incl. 13% VAT)</label>
            <div style="font-size:18px; font-weight:700; color:var(--color-text-primary);">${Utils.formatCurrency(grandTotal)}</div>
          </div>
        </div>
      </div>

      <!-- Interactive BOQ Table -->
      <div class="boq-sheet-container">
        <table class="boq-table">
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th>Material / Item Description</th>
              <th>Specification</th>
              <th style="width:100px;">Unit</th>
              <th style="width:90px; text-align:right;">Qty</th>
              <th style="width:130px; text-align:right;">Rate (NPR)</th>
              <th style="width:140px; text-align:right;">Total (NPR)</th>
              <th style="width:50px;"></th>
            </tr>
          </thead>
          <tbody id="boq-table-body">
            ${currentItems
              .map((row, idx) => {
                return `
              <tr data-index="${idx}">
                <td style="color:var(--color-text-muted); font-size:11px;">${idx + 1}</td>
                <td class="boq-input-cell">
                  <input type="text" class="boq-field-item" value="${Utils.escapeHtml(row.item)}" />
                </td>
                <td class="boq-input-cell">
                  <input type="text" class="boq-field-spec" value="${Utils.escapeHtml(row.spec)}" />
                </td>
                <td class="boq-input-cell">
                  <select class="boq-field-unit">
                    <option value="Meter" ${row.unit === "Meter" ? "selected" : ""}>Meter</option>
                    <option value="Sq. Meter" ${row.unit === "Sq. Meter" ? "selected" : ""}>Sq. Meter</option>
                    <option value="Sq. Ft" ${row.unit === "Sq. Ft" ? "selected" : ""}>Sq. Ft</option>
                    <option value="Pcs" ${row.unit === "Pcs" ? "selected" : ""}>Pcs</option>
                    <option value="Set" ${row.unit === "Set" ? "selected" : ""}>Set</option>
                    <option value="R. Ft" ${row.unit === "R. Ft" ? "selected" : ""}>R. Ft</option>
                    <option value="Kg" ${row.unit === "Kg" ? "selected" : ""}>Kg</option>
                    <option value="Lump sum" ${row.unit === "Lump sum" ? "selected" : ""}>Lump sum</option>
                  </select>
                </td>
                <td class="boq-input-cell" style="text-align:right;">
                  <input type="number" class="boq-field-qty" value="${row.qty}" min="1" style="text-align:right;" />
                </td>
                <td class="boq-input-cell" style="text-align:right;">
                  <input type="number" class="boq-field-price" value="${row.unitPrice}" min="1" style="text-align:right;" />
                </td>
                <td style="text-align:right; font-weight:600; font-family:var(--font-family-mono); font-size:13px;">
                  ${Utils.formatCurrency(row.total, false)}
                </td>
                <td style="text-align:center;">
                  <button type="button" class="btn btn-ghost btn-sm btn-icon remove-row-btn" data-index="${idx}" title="Remove Item">
                    ${Utils.renderIcon("x", 14)}
                  </button>
                </td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>

        <!-- Add Item Row Action -->
        <div style="padding:10px 14px; background:#FFFFFF; border-bottom:1px solid var(--color-border);">
          <button type="button" class="btn btn-secondary btn-sm" id="boq-add-row-btn">
            ${Utils.renderIcon("plus", 14)} Add BOQ Material Item
          </button>
        </div>

        <!-- Summary Panel -->
        <div class="boq-summary-panel">
          <div class="boq-summary-table">
            <div class="boq-summary-row">
              <span>Materials Subtotal:</span>
              <strong class="font-mono">${Utils.formatCurrency(materialSubtotal)}</strong>
            </div>
            <div class="boq-summary-row">
              <span>Fabrication & Assembly Labour (14%):</span>
              <span class="font-mono">${Utils.formatCurrency(labourCost)}</span>
            </div>
            <div class="boq-summary-row">
              <span>Trailer Freight & Site Transport:</span>
              <span class="font-mono">${Utils.formatCurrency(transportationCost)}</span>
            </div>
            <div class="boq-summary-row">
              <span>Machinery & Mobile Crane Rental:</span>
              <span class="font-mono">${Utils.formatCurrency(machineryCost)}</span>
            </div>
            <div class="boq-summary-row">
              <span>On-Site Erection & Installation (10%):</span>
              <span class="font-mono">${Utils.formatCurrency(installationCost)}</span>
            </div>
            <div class="boq-summary-row">
              <span>Administrative Overhead (5%):</span>
              <span class="font-mono">${Utils.formatCurrency(overheadCost)}</span>
            </div>
            <div class="boq-summary-row">
              <span>Contingency Reserve:</span>
              <span class="font-mono">${Utils.formatCurrency(contingencyCost)}</span>
            </div>
            <div class="boq-summary-row" style="border-top:1px solid #CBD5E1; padding-top:6px; margin-top:4px;">
              <span>Total Cost Before Tax:</span>
              <strong class="font-mono">${Utils.formatCurrency(subtotalBeforeTax)}</strong>
            </div>
            <div class="boq-summary-row">
              <span>VAT (13%):</span>
              <span class="font-mono">${Utils.formatCurrency(taxAmount)}</span>
            </div>
            <div class="boq-summary-row total-row">
              <span>Grand Total Estimated Contract:</span>
              <span class="font-mono text-primary-color">${Utils.formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Project selection
    document.getElementById("boq-project-select")?.addEventListener("change", (e) => {
      selectedProjectId = e.target.value;
      Toast.info(`Loaded BOQ for ${selectedProjectId}`);
    });

    // Add Row
    document.getElementById("boq-add-row-btn")?.addEventListener("click", () => {
      currentItems.push({
        item: "New Prefab Component",
        spec: "Custom Specification",
        unit: "Pcs",
        qty: 10,
        unitPrice: 1500
      });
      renderView();
    });

    // Remove Row
    container.querySelectorAll(".remove-row-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        if (!isNaN(idx)) {
          currentItems.splice(idx, 1);
          renderView();
        }
      });
    });

    // Live update on quantity or price change
    container.querySelectorAll(".boq-field-qty, .boq-field-price").forEach((input) => {
      input.addEventListener("input", (e) => {
        const rowTr = e.target.closest("tr");
        const idx = parseInt(rowTr.getAttribute("data-index"), 10);
        if (!isNaN(idx)) {
          const qty = Number(rowTr.querySelector(".boq-field-qty").value) || 0;
          const price = Number(rowTr.querySelector(".boq-field-price").value) || 0;
          currentItems[idx].qty = qty;
          currentItems[idx].unitPrice = price;
          renderView();
        }
      });
    });

    // Text fields change
    container.querySelectorAll(".boq-field-item, .boq-field-spec, .boq-field-unit").forEach((input) => {
      input.addEventListener("change", (e) => {
        const rowTr = e.target.closest("tr");
        const idx = parseInt(rowTr.getAttribute("data-index"), 10);
        if (!isNaN(idx)) {
          currentItems[idx].item = rowTr.querySelector(".boq-field-item").value;
          currentItems[idx].spec = rowTr.querySelector(".boq-field-spec").value;
          currentItems[idx].unit = rowTr.querySelector(".boq-field-unit").value;
        }
      });
    });

    // Save BOQ
    document.getElementById("boq-save-btn")?.addEventListener("click", () => {
      Toast.success(`BOQ estimate updated for project ${selectedProjectId}.`);
    });

    // Reset template
    document.getElementById("boq-duplicate-btn")?.addEventListener("click", () => {
      currentItems = JSON.parse(JSON.stringify(defaultBOQItems));
      renderView();
      Toast.info("BOQ reset to standard template.");
    });

    // Print
    document.getElementById("boq-print-btn")?.addEventListener("click", () => {
      Utils.printPage();
    });
  }

  renderView();
};

window.ModuleEstimation = ModuleEstimation;

