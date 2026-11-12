/**
 * Himalayan Prefab Solutions ERP
 * MODULE 20 — FINANCE, BILLING & CASH FLOW
 */

const ModuleFinance = (container) => {
  const invoices = AppState.getInvoicesAndPayments();
  const projects = AppState.getProjects();
  const customers = AppState.getCustomers();
  const metrics = AppState.getDashboardMetrics();

  // Separate Customer Invoices vs Expenses
  const customerInvoices = invoices.filter((i) => i.type === "Customer Invoice");
  const projectExpenses = invoices.filter((i) => i.type === "Project Expense");

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Finance, Billing & Profitability Oversight",
      description: "Manage client milestone billings, bank payment reconciliation, site operational expenditures, and turnkey project profitability in NPR.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Finance & Accounts" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="fin-export-btn">
          ${Utils.renderIcon("download", 14)} Export Ledger
        </button>
        <button type="button" class="btn btn-secondary btn-sm" id="fin-add-expense-btn">
          ${Utils.renderIcon("plus", 14)} Record Expense
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="fin-add-invoice-btn">
          ${Utils.renderIcon("plus", 14)} Issue Invoice
        </button>
      `
    })}

    <!-- Financial KPI Summary Cards -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-5);">
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Total Contracted Portfolio</span>
          <div class="metric-icon-box" style="color:#0284C7; background:#E0F2FE;">
            ${Utils.renderIcon("briefcase", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.totalContractValue)}</div>
        <div class="metric-footer">
          <span>Total active contracts</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Collected Revenue</span>
          <div class="metric-icon-box" style="color:var(--color-success); background:var(--color-success-light);">
            ${Utils.renderIcon("dollar-sign", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.totalRevenue)}</div>
        <div class="metric-footer">
          <span class="metric-trend up">Bank wire cleared</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Outstanding Receivables</span>
          <div class="metric-icon-box" style="color:var(--color-warning); background:var(--color-warning-light);">
            ${Utils.renderIcon("clock", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.totalOutstanding)}</div>
        <div class="metric-footer">
          <span class="text-warning">Milestone progress billing</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-title">Estimated Gross Margin</span>
          <div class="metric-icon-box" style="color:#7C3AED; background:#F3E8FF;">
            ${Utils.renderIcon("bar-chart", 18)}
          </div>
        </div>
        <div class="metric-value">${Utils.formatCurrency(metrics.estimatedProfit)}</div>
        <div class="metric-footer">
          <span class="metric-trend up">~22.4% Gross Margin</span>
        </div>
      </div>
    </div>

    <!-- Management Notice Alert -->
    <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:10px 14px; border-radius:var(--radius-md); font-size:12px; color:#92400E; margin-bottom:var(--space-5); display:flex; align-items:center; gap:10px;">
      ${Utils.renderIcon("info", 16)}
      <span><strong>Enterprise Demo Interface:</strong> This financial portal demonstrates project profitability and client billing workflows for managerial decision-making, not a tax-certified statutory audit ledger.</span>
    </div>

    <!-- Customer Invoices Section -->
    <div class="card" style="margin-bottom:var(--space-6);">
      <div class="card-header">
        <div>
          <h3 class="card-title">Customer Billing Invoices & Milestone Payments</h3>
          <div class="card-subtitle">Real-time status of client invoices, bank wire receipts, and remaining balances</div>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <div id="invoices-table-mount"></div>
      </div>
    </div>

    <!-- Project Profitability Analysis Table -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Project Profitability & Cost Breakdown</h3>
          <div class="card-subtitle">Contracted value vs incurred costs & projected gross profit margins</div>
        </div>
      </div>
      <div class="card-body" style="padding:0;">
        <table class="table-clean">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th style="text-align:right;">Contract Value</th>
              <th style="text-align:right;">Collected Revenue</th>
              <th style="text-align:right;">Actual Costs</th>
              <th style="text-align:right;">Estimated Profit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${projects
              .map((p) => {
                const profitMargin = p.contractValue ? ((p.estimatedProfit / p.contractValue) * 100).toFixed(1) : 22;
                return `
              <tr>
                <td>
                  <div class="table-cell-bold">${Utils.escapeHtml(p.name)}</div>
                  <div class="text-xs text-muted font-mono">${p.id}</div>
                </td>
                <td>${Utils.escapeHtml(p.customerName)}</td>
                <td style="text-align:right;" class="font-mono font-medium">${Utils.formatCurrency(p.contractValue)}</td>
                <td style="text-align:right;" class="font-mono text-success font-medium">${Utils.formatCurrency(p.paidAmount)}</td>
                <td style="text-align:right;" class="font-mono text-muted">${Utils.formatCurrency(p.actualCost || 0)}</td>
                <td style="text-align:right;" class="font-mono font-bold text-primary-color">
                  ${Utils.formatCurrency(p.estimatedProfit)} <small style="font-weight:normal; color:var(--color-text-secondary);">(${profitMargin}%)</small>
                </td>
                <td>${Utils.renderStatusBadge(p.status)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Mount Invoices Table
  new DataTable({
    container: document.getElementById("invoices-table-mount"),
    columns: [
      {
        key: "invoiceNumber",
        label: "Invoice #",
        width: "140px",
        render: (val, row) => `
          <div>
            <div class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val || row.id)}</div>
            <div class="text-xs text-muted font-mono">${row.id}</div>
          </div>
        `
      },
      {
        key: "customerName",
        label: "Customer / Project",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.projectName || row.milestone)}</div>
          </div>
        `
      },
      {
        key: "amount",
        label: "Billed (NPR)",
        align: "right",
        render: (val) => `<span class="font-mono font-medium">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "paidAmount",
        label: "Paid (NPR)",
        align: "right",
        render: (val) => `<span class="font-mono text-success font-medium">${Utils.formatCurrency(val || 0)}</span>`
      },
      {
        key: "balance",
        label: "Outstanding",
        align: "right",
        render: (val) => {
          if (!val || val === 0) return '<span class="text-xs text-success">Settled</span>';
          return `<span class="font-mono text-danger font-medium">${Utils.formatCurrency(val)}</span>`;
        }
      },
      {
        key: "dueDate",
        label: "Due Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
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
              row.status !== "Paid"
                ? `<button type="button" class="btn btn-success btn-sm record-pay-btn" data-id="${row.id}">
                    ${Utils.renderIcon("dollar-sign", 12)} Record Payment
                   </button>`
                : `<span class="text-xs text-muted font-mono">${row.transactionRef || "Paid"}</span>`
            }
          </div>
        `
      }
    ],
    data: customerInvoices,
    searchFields: ["invoiceNumber", "customerName", "projectName", "id"]
  });

  // Export CSV
  document.getElementById("fin-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_finance_ledger", AppState.getInvoicesAndPayments());
  });

  // Record Payment Handler
  container.addEventListener("click", (e) => {
    const payBtn = e.target.closest(".record-pay-btn");
    if (payBtn) {
      e.stopPropagation();
      const id = payBtn.getAttribute("data-id");
      openRecordPaymentModal(id);
    }
  });

  // Issue Invoice Button
  document.getElementById("fin-add-invoice-btn")?.addEventListener("click", () => {
    openInvoiceForm();
  });

  // Record Expense Button
  document.getElementById("fin-add-expense-btn")?.addEventListener("click", () => {
    openExpenseForm();
  });

  function openRecordPaymentModal(invoiceId) {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    Modal.open({
      title: `Record Client Wire Payment: ${inv.invoiceNumber}`,
      content: `
        <form id="record-pay-form">
          <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:12px; border-radius:var(--radius-sm); margin-bottom:var(--space-4);">
            <div>
              <div class="text-xs text-muted">Customer Account:</div>
              <div class="font-semibold text-sm">${Utils.escapeHtml(inv.customerName)}</div>
            </div>
            <div>
              <div class="text-xs text-muted">Remaining Balance:</div>
              <div class="font-bold text-sm text-danger">${Utils.formatCurrency(inv.balance || inv.amount)}</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Payment Amount Received (NPR)</label>
            <input type="number" class="form-control" name="payAmount" value="${inv.balance || inv.amount}" required min="1" max="${inv.balance || inv.amount}" />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Payment Channel</label>
              <select class="form-control" name="method" required>
                <option value="Bank Wire (Nabil Bank Ltd)">Bank Wire (Nabil Bank Ltd)</option>
                <option value="Bank Wire (Global IME Bank)">Bank Wire (Global IME Bank)</option>
                <option value="Bank Wire (NIC Asia Bank)">Bank Wire (NIC Asia Bank)</option>
                <option value="Account Payee Cheque">Account Payee Cheque</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Bank Transaction Ref #</label>
              <input type="text" class="form-control" name="txnRef" value="TXN-NBL-${Math.floor(100000 + Math.random() * 900000)}" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="confirm-pay-btn">Post Payment</button>
      `
    });

    document.getElementById("confirm-pay-btn")?.addEventListener("click", () => {
      const form = document.getElementById("record-pay-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const amt = Number(formData.get("payAmount"));
      const method = formData.get("method");
      const txn = formData.get("txnRef");

      AppState.recordCustomerPayment(invoiceId, amt, method, txn);
      Toast.success(`Payment of ${Utils.formatCurrency(amt)} recorded. Account reconciled.`);
      Modal.close();
      ModuleFinance(container);
    });
  }

  function openInvoiceForm() {
    const custOptions = customers.map((c) => `<option value="${c.id}">${c.name} (${c.id})</option>`).join("");
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Issue Milestone Customer Invoice",
      content: `
        <form id="new-invoice-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Select Customer</label>
              <select class="form-control" name="customerId" required>${custOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label required">Select Project</label>
              <select class="form-control" name="projectId" required>${prjOptions}</select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Milestone Scope Description</label>
            <input type="text" class="form-control" name="milestone" value="Wall Panels & Roof Installation Completion" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Invoice Amount (NPR)</label>
              <input type="number" class="form-control" name="amount" value="1125000" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Payment Due Date</label>
              <input type="date" class="form-control" name="dueDate" value="2026-11-30" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-inv-btn">Issue Invoice</button>
      `
    });

    document.getElementById("save-inv-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-invoice-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addInvoice({
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        milestone: formData.get("milestone"),
        amount: Number(formData.get("amount")),
        dueDate: formData.get("dueDate")
      });

      Toast.success("Invoice generated and posted to accounts.");
      Modal.close();
      ModuleFinance(container);
    });
  }

  function openExpenseForm() {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Record Project Operational Expense",
      content: `
        <form id="new-expense-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Expense Category</label>
              <select class="form-control" name="category" required>
                <option value="Crane & Machinery Rental">Crane & Machinery Rental</option>
                <option value="Subcontractor Masonry & Foundation">Subcontractor Masonry & Foundation</option>
                <option value="Transportation & Freight">Transportation & Freight</option>
                <option value="Site Consumables & Fasteners">Site Consumables & Fasteners</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Vendor / Payee</label>
              <input type="text" class="form-control" name="vendor" value="Kathmandu Heavy Machinery Rental" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Amount (NPR)</label>
              <input type="number" class="form-control" name="amount" value="65000" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Payment Method</label>
              <select class="form-control" name="paymentMethod" required>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash / Petty Cash">Cash / Petty Cash</option>
              </select>
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-exp-btn">Record Expense</button>
      `
    });

    document.getElementById("save-exp-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-expense-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addExpense({
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        category: formData.get("category"),
        vendor: formData.get("vendor"),
        amount: Number(formData.get("amount")),
        paymentMethod: formData.get("paymentMethod")
      });

      Toast.success("Expense booked and project actual cost updated.");
      Modal.close();
      ModuleFinance(container);
    });
  }
};

window.ModuleFinance = ModuleFinance;

