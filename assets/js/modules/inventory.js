/**
 * Himalayan Prefab Solutions ERP
 * MODULE 13 — INVENTORY & WAREHOUSE MANAGEMENT
 */

const ModuleInventory = (container) => {
  const inventory = AppState.getInventory();
  const totalValuation = inventory.reduce((sum, item) => sum + (item.stockValue || 0), 0);
  const lowStockItems = inventory.filter((item) => item.availableStock <= item.minStock);

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Warehouse & Raw Material Inventory",
      description: "Track 30+ standardized prefab components, light-gauge steel coils, sandwich panels, thermal insulation, joinery, and fasteners across Sitapaila Central and Biratnagar Depots.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Inventory" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="inv-export-btn">
          ${Utils.renderIcon("download", 14)} Export Stock CSV
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="inv-trans-btn">
          ${Utils.renderIcon("refresh-cw", 14)} Record Stock Movement
        </button>
      `
    })}

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Total Inventory Valuation</div>
        <div style="font-size:20px; font-weight:700; color:var(--color-text-primary); margin-top:2px;">${Utils.formatCurrency(totalValuation)}</div>
        <div class="text-xs text-muted">Across 30 Standardized SKUs</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Low Stock Alerts</div>
        <div style="font-size:22px; font-weight:600; color:${lowStockItems.length > 0 ? "var(--color-danger)" : "var(--color-success)"}; margin-top:2px;">
          ${lowStockItems.length} Items
        </div>
        <div class="text-xs text-muted">Below safety reorder threshold</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Primary Central Warehouse</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-primary); margin-top:4px;">Sitapaila Plant Yard</div>
        <div class="text-xs text-muted">Kathmandu &bull; 15,000 sq ft storage</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Storekeeper In-Charge</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-text-primary); margin-top:4px;">Nabin Giri</div>
        <div class="text-xs text-muted">Central Supply Chain Officer</div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-box-icon">${Utils.renderIcon("search", 15)}</span>
        <input type="text" id="inv-search-input" placeholder="Search SKU, material name, category, warehouse..." />
      </div>

      <div class="filter-group">
        <select class="form-control" id="inv-cat-filter" style="width:200px; height:34px; font-size:12px;">
          <option value="">All Material Categories</option>
          <option value="Structural Steel">Structural Steel</option>
          <option value="Sandwich Panels">Sandwich Panels</option>
          <option value="Insulation">Insulation</option>
          <option value="Roofing Sheets">Roofing Sheets</option>
          <option value="Boards & Partitions">Boards & Partitions</option>
          <option value="Doors & Windows">Doors & Windows</option>
          <option value="Flooring Materials">Flooring Materials</option>
          <option value="Electrical Materials">Electrical Materials</option>
          <option value="Foundation Materials">Foundation Materials</option>
          <option value="Fasteners & Hardware">Fasteners & Hardware</option>
        </select>

        <select class="form-control" id="inv-stock-filter" style="width:160px; height:34px; font-size:12px;">
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock Only (&le; Min)</option>
          <option value="adequate">Adequate Stock</option>
        </select>
      </div>
    </div>

    <!-- Data Table Mount -->
    <div id="inv-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("inv-table-mount"),
    columns: [
      {
        key: "sku",
        label: "SKU Code",
        width: "120px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "name",
        label: "Material Description & Category",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.category)} &bull; ${Utils.escapeHtml(row.warehouse)}</div>
          </div>
        `
      },
      {
        key: "availableStock",
        label: "Available Stock",
        align: "right",
        render: (val, row) => {
          const isLow = val <= row.minStock;
          return `
            <div style="font-family:var(--font-family-mono); font-weight:600; color:${isLow ? "var(--color-danger)" : "var(--color-text-primary)"};">
              ${val.toLocaleString()} ${row.unit}
              ${isLow ? '<span class="badge badge-danger text-xs" style="margin-left:4px;">Low</span>' : ""}
            </div>
          `;
        }
      },
      {
        key: "reservedStock",
        label: "Reserved",
        align: "right",
        render: (val, row) => `<span class="text-xs text-muted font-mono">${(val || 0).toLocaleString()} ${row.unit}</span>`
      },
      {
        key: "minStock",
        label: "Min Safety",
        align: "right",
        render: (val, row) => `<span class="text-xs text-muted font-mono">${val.toLocaleString()} ${row.unit}</span>`
      },
      {
        key: "unitCost",
        label: "Unit Cost (NPR)",
        align: "right",
        render: (val) => Utils.formatCurrency(val)
      },
      {
        key: "stockValue",
        label: "Stock Valuation",
        align: "right",
        render: (val) => `<span class="font-semibold font-mono">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        align: "right",
        render: (_, row) => `
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-sm quick-trans-btn" data-sku="${row.sku}" title="Adjust or Issue Stock">
              ${Utils.renderIcon("refresh-cw", 12)} Adjust
            </button>
          </div>
        `
      }
    ],
    data: inventory,
    searchFields: ["sku", "name", "category", "warehouse"],
    itemsPerPage: 10
  });

  // Attach search
  document.getElementById("inv-search-input")?.addEventListener("input", (e) => {
    table.setSearch(e.target.value);
  });

  // Attach filters
  const catFilter = document.getElementById("inv-cat-filter");
  const stockFilter = document.getElementById("inv-stock-filter");

  const filterHandler = () => {
    const catVal = catFilter.value;
    const stockVal = stockFilter.value;

    let filtered = AppState.getInventory();
    if (catVal) filtered = filtered.filter((i) => i.category === catVal);
    if (stockVal === "low") filtered = filtered.filter((i) => i.availableStock <= i.minStock);
    if (stockVal === "adequate") filtered = filtered.filter((i) => i.availableStock > i.minStock);

    table.updateData(filtered);
  };

  catFilter?.addEventListener("change", filterHandler);
  stockFilter?.addEventListener("change", filterHandler);

  // Export CSV
  document.getElementById("inv-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_warehouse_inventory", AppState.getInventory());
  });

  // Movement Action
  document.getElementById("inv-trans-btn")?.addEventListener("click", () => {
    openStockTransactionModal();
  });

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-trans-btn");
    if (btn) {
      e.stopPropagation();
      openStockTransactionModal(btn.getAttribute("data-sku"));
    }
  });

  function openStockTransactionModal(presetSku = null) {
    const skuOptions = inventory
      .map((i) => `<option value="${i.sku}" ${i.sku === presetSku ? "selected" : ""}>${i.sku} &mdash; ${i.name} (Stock: ${i.availableStock} ${i.unit})</option>`)
      .join("");

    Modal.open({
      title: "Record Warehouse Stock Movement",
      content: `
        <form id="stock-trans-form">
          <div class="form-group">
            <label class="form-label required">Select Inventory Material</label>
            <select class="form-control" name="sku" required>${skuOptions}</select>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Transaction Type</label>
              <select class="form-control" name="transType" id="trans-type-select" required>
                <option value="Issue to Project Site">Issue to Project Site (-)</option>
                <option value="Receive from Supplier">Receive from Supplier (+)</option>
                <option value="Stock Adjustment">Stock Count Audit (+/-)</option>
                <option value="Reserve for Project">Reserve for Project (+)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Quantity</label>
              <input type="number" class="form-control" name="quantity" value="50" min="1" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Project / Reference Order</label>
            <input type="text" class="form-control" name="reference" value="PRJ-001 (Budhanilkantha Villa)" required />
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-stock-trans-btn">Commit Movement</button>
      `
    });

    document.getElementById("save-stock-trans-btn")?.addEventListener("click", () => {
      const form = document.getElementById("stock-trans-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const sku = formData.get("sku");
      const transType = formData.get("transType");
      const qty = Number(formData.get("quantity")) || 0;
      const ref = formData.get("reference");

      let delta = qty;
      if (transType.includes("Issue")) {
        delta = -qty;
      }

      AppState.updateInventoryStock(sku, delta, transType, ref);
      Toast.success(`Stock updated for ${sku}: ${delta > 0 ? "+" + delta : delta}`);
      Modal.close();
      ModuleInventory(container);
    });
  }
};

window.ModuleInventory = ModuleInventory;

