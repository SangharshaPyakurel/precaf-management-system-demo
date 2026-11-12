/**
 * Himalayan Prefab Solutions ERP
 * MODULE 14 — PROCUREMENT & SUPPLY CHAIN
 */

const ModuleProcurement = (container) => {
  const purchaseOrders = AppState.getPurchaseOrders();
  const suppliers = Storage.get("suppliers", SEED_DATA.suppliers);
  const projects = AppState.getProjects();
  const inventory = AppState.getInventory();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Procurement & Purchase Orders",
      description: "Manage purchase requisitions, supplier purchase orders, bulk material deliveries, and automated warehouse receiving.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Procurement" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="po-export-btn">
          ${Utils.renderIcon("download", 14)} Export POs
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="po-add-btn">
          ${Utils.renderIcon("plus", 14)} New Purchase Order
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="po-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("po-table-mount"),
    columns: [
      {
        key: "poNumber",
        label: "PO Number",
        width: "140px",
        render: (val, row) => `
          <div>
            <div class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val || row.id)}</div>
            <div class="text-xs text-muted font-mono">${row.id}</div>
          </div>
        `
      },
      {
        key: "supplierName",
        label: "Supplier / Vendor",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Project: ${Utils.escapeHtml(row.projectName)}</div>
          </div>
        `
      },
      {
        key: "totalAmount",
        label: "Total Amount (NPR)",
        align: "right",
        render: (val) => `<span class="font-semibold font-mono">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "orderDate",
        label: "Order Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "deliveryDate",
        label: "Delivery Expected",
        render: (val) => `<span class="text-xs font-medium">${Utils.formatDate(val)}</span>`
      },
      {
        key: "paymentStatus",
        label: "Payment",
        render: (val) => Utils.renderStatusBadge(val)
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
              row.status !== "Delivered & Received"
                ? `<button type="button" class="btn btn-success btn-sm receive-po-btn" data-id="${row.id}" title="Receive Goods & Update Inventory">
                    ${Utils.renderIcon("check-circle", 12)} Receive Delivery
                   </button>`
                : `<span class="text-xs text-success font-medium">Stock Received</span>`
            }
          </div>
        `
      }
    ],
    data: purchaseOrders,
    searchFields: ["poNumber", "supplierName", "projectName", "id"],
    onRowClick: (row) => openPoDetail(row.id)
  });

  // Export CSV
  document.getElementById("po-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_purchase_orders", AppState.getPurchaseOrders());
  });

  // Add PO
  document.getElementById("po-add-btn")?.addEventListener("click", () => {
    openPoForm();
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const receiveBtn = e.target.closest(".receive-po-btn");
    if (receiveBtn) {
      e.stopPropagation();
      const id = receiveBtn.getAttribute("data-id");
      Modal.confirm({
        title: "Confirm Material Delivery & Warehouse Inward",
        message: `Acknowledge full delivery for Purchase Order <strong>${id}</strong>? This action will automatically increment inventory available stock in the central warehouse.`,
        confirmText: "Accept Delivery",
        confirmVariant: "success",
        onConfirm: () => {
          AppState.receivePurchaseOrder(id);
          Toast.success(`PO ${id} received! Inventory stock successfully updated.`);
          ModuleProcurement(container);
        }
      });
    }
  });

  function openPoDetail(id) {
    const po = purchaseOrders.find((p) => p.id === id);
    if (!po) return;

    const items = po.items || [];

    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:14px; border-radius:var(--radius-md);">
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Vendor Dossier</div>
            <div style="font-size:16px; font-weight:600; margin-top:2px;">${Utils.escapeHtml(po.supplierName)}</div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">Project: ${Utils.escapeHtml(po.projectName)}</div>
          </div>
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Order Summary</div>
            <div style="font-size:18px; font-weight:700; color:var(--color-primary); margin-top:2px;">${Utils.formatCurrency(po.totalAmount)}</div>
            <div style="font-size:12px; margin-top:2px;">Status: ${Utils.renderStatusBadge(po.status)} &bull; ${Utils.renderStatusBadge(po.paymentStatus)}</div>
          </div>
        </div>

        <div>
          <h4 style="font-size:13px; font-weight:600; margin-bottom:8px;">Line Items Inward Order</h4>
          <table class="table-clean" style="border:1px solid var(--color-border);">
            <thead>
              <tr><th>Item SKU / Description</th><th style="text-align:right;">Quantity</th><th style="text-align:right;">Rate</th><th style="text-align:right;">Total</th></tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (i) => `
                <tr>
                  <td>
                    <div class="font-medium">${Utils.escapeHtml(i.name)}</div>
                    <div class="font-mono text-xs text-muted">${i.sku || "-"}</div>
                  </td>
                  <td style="text-align:right;" class="font-mono">${i.qty.toLocaleString()}</td>
                  <td style="text-align:right;" class="font-mono">${Utils.formatCurrency(i.unitPrice)}</td>
                  <td style="text-align:right;" class="font-mono font-semibold">${Utils.formatCurrency(i.total)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    Modal.open({
      title: `Purchase Order: ${po.poNumber}`,
      content: contentHtml,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        ${
          po.status !== "Delivered & Received"
            ? `<button type="button" class="btn btn-success" id="detail-recv-btn">Receive Delivery</button>`
            : ""
        }
      `
    });

    document.getElementById("detail-recv-btn")?.addEventListener("click", () => {
      Modal.close();
      AppState.receivePurchaseOrder(po.id);
      Toast.success(`PO ${po.id} goods inward complete. Inventory updated.`);
      ModuleProcurement(container);
    });
  }

  function openPoForm() {
    const suppOptions = suppliers.map((s) => `<option value="${s.id}">${s.name} (${s.id})</option>`).join("");
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");
    const matOptions = inventory.map((i) => `<option value="${i.sku}">${i.sku} &mdash; ${i.name}</option>`).join("");

    Modal.open({
      title: "Draft New Purchase Order",
      content: `
        <form id="new-po-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Select Supplier</label>
              <select class="form-control" name="supplierId" required>${suppOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label required">Linked Project</label>
              <select class="form-control" name="projectId" required>${prjOptions}</select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Primary Material Item</label>
            <select class="form-control" name="sku" required>${matOptions}</select>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Order Quantity</label>
              <input type="number" class="form-control" name="qty" value="200" min="1" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Agreed Unit Rate (NPR)</label>
              <input type="number" class="form-control" name="rate" value="1650" min="1" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-po-btn">Issue Purchase Order</button>
      `
    });

    document.getElementById("save-po-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-po-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const suppId = formData.get("supplierId");
      const matchedSupp = suppliers.find((s) => s.id === suppId);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);
      const sku = formData.get("sku");
      const matchedMat = inventory.find((i) => i.sku === sku);

      const qty = Number(formData.get("qty"));
      const rate = Number(formData.get("rate"));
      const total = qty * rate;

      AppState.addPurchaseOrder({
        supplierId: suppId,
        supplierName: matchedSupp ? matchedSupp.name : "Supplier",
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        totalAmount: total,
        items: [
          { sku, name: matchedMat ? matchedMat.name : "Material", qty, unitPrice: rate, total }
        ]
      });

      Toast.success("Purchase order released to supplier.");
      Modal.close();
      ModuleProcurement(container);
    });
  }
};

window.ModuleProcurement = ModuleProcurement;

