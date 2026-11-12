/**
 * Himalayan Prefab Solutions ERP
 * MODULE 02 — CRM & CUSTOMERS
 */

const ModuleCRM = (container, params = {}) => {
  const customers = AppState.getCustomers();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "CRM & Customer Accounts",
      description: "Manage client relationships, enterprise accounts, project histories, and financial balances.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "CRM & Customers" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="crm-export-btn">
          ${Utils.renderIcon("download", 14)} Export CSV
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="crm-add-btn">
          ${Utils.renderIcon("plus", 14)} New Customer
        </button>
      `
    })}

    <!-- Filter & Search Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-box-icon">${Utils.renderIcon("search", 15)}</span>
        <input type="text" id="crm-search-input" placeholder="Search customer, company, phone, email..." />
      </div>

      <div class="filter-group">
        <select class="form-control" id="crm-type-filter" style="width:160px; height:34px; font-size:12px;">
          <option value="">All Customer Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Industrial">Industrial</option>
          <option value="Institutional">Institutional</option>
        </select>
        <select class="form-control" id="crm-status-filter" style="width:140px; height:34px; font-size:12px;">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Lead">Lead</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>

    <!-- Data Table Container -->
    <div id="crm-table-mount"></div>
  `;

  // Render Table
  const table = new DataTable({
    container: document.getElementById("crm-table-mount"),
    columns: [
      {
        key: "id",
        label: "Customer ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "name",
        label: "Client / Company",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">${Utils.escapeHtml(row.company || "Individual Client")}</div>
          </div>
        `
      },
      {
        key: "phone",
        label: "Contact",
        render: (val, row) => `
          <div class="text-xs">
            <div>${Utils.escapeHtml(val)}</div>
            <div class="text-muted">${Utils.escapeHtml(row.email)}</div>
          </div>
        `
      },
      {
        key: "type",
        label: "Type",
        render: (val) => `<span class="badge badge-neutral">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "totalProjects",
        label: "Projects",
        align: "center",
        render: (val) => `<span class="badge badge-primary font-mono">${val || 0}</span>`
      },
      {
        key: "totalContractValue",
        label: "Contract Value",
        align: "right",
        render: (val) => Utils.formatCurrency(val)
      },
      {
        key: "outstandingBalance",
        label: "Outstanding",
        align: "right",
        render: (val) => {
          if (!val || val === 0) return '<span class="text-xs text-success">Fully Paid</span>';
          return `<span class="text-xs font-medium text-danger">${Utils.formatCurrency(val)}</span>`;
        }
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
            <button type="button" class="btn btn-secondary btn-sm btn-icon view-cust-btn" data-id="${row.id}" title="View Full Profile">
              ${Utils.renderIcon("eye", 13)}
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-icon edit-cust-btn" data-id="${row.id}" title="Edit Customer">
              ${Utils.renderIcon("edit", 13)}
            </button>
            <button type="button" class="btn btn-secondary btn-sm btn-icon delete-cust-btn" data-id="${row.id}" title="Delete Customer">
              ${Utils.renderIcon("trash", 13)}
            </button>
          </div>
        `
      }
    ],
    data: customers,
    searchFields: ["name", "company", "phone", "email", "id"],
    onRowClick: (row) => openCustomerProfile(row.id)
  });

  // Attach search & filter listeners
  document.getElementById("crm-search-input")?.addEventListener("input", (e) => {
    table.setSearch(e.target.value);
  });

  const typeFilter = document.getElementById("crm-type-filter");
  const statusFilter = document.getElementById("crm-status-filter");

  const filterHandler = () => {
    const typeVal = typeFilter.value;
    const statusVal = statusFilter.value;

    let filtered = AppState.getCustomers();
    if (typeVal) filtered = filtered.filter((c) => c.type === typeVal);
    if (statusVal) filtered = filtered.filter((c) => c.status === statusVal);

    table.updateData(filtered);
  };

  typeFilter?.addEventListener("change", filterHandler);
  statusFilter?.addEventListener("change", filterHandler);

  // Export CSV
  document.getElementById("crm-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_customers_list", AppState.getCustomers());
  });

  // Add Customer Modal
  document.getElementById("crm-add-btn")?.addEventListener("click", () => {
    openCustomerForm();
  });

  // Event delegation for table action buttons
  container.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-cust-btn");
    const editBtn = e.target.closest(".edit-cust-btn");
    const deleteBtn = e.target.closest(".delete-cust-btn");

    if (viewBtn) {
      e.stopPropagation();
      openCustomerProfile(viewBtn.getAttribute("data-id"));
    } else if (editBtn) {
      e.stopPropagation();
      const cust = AppState.getCustomer(editBtn.getAttribute("data-id"));
      if (cust) openCustomerForm(cust);
    } else if (deleteBtn) {
      e.stopPropagation();
      const id = deleteBtn.getAttribute("data-id");
      Modal.confirm({
        title: "Delete Customer Account",
        message: `Are you sure you want to delete customer <strong>${id}</strong>? This action cannot be undone.`,
        confirmText: "Delete Customer",
        confirmVariant: "danger",
        onConfirm: () => {
          AppState.deleteCustomer(id);
          table.updateData(AppState.getCustomers());
          Toast.success("Customer removed.");
        }
      });
    }
  });

  // View Customer Profile Modal
  function openCustomerProfile(id) {
    const cust = AppState.getCustomer(id);
    if (!cust) return;

    const inquiries = AppState.getInquiries().filter((i) => i.customerId === id);
    const projects = AppState.getProjects().filter((p) => p.customerId === id);
    const contracts = AppState.getContracts().filter((c) => c.customerId === id);
    const invoices = AppState.getInvoicesAndPayments().filter((i) => i.customerId === id);

    const contentHtml = `
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <!-- Top Info Grid -->
        <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:var(--space-4); border-radius:var(--radius-md);">
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Customer Details</div>
            <div style="font-size:16px; font-weight:600; color:var(--color-text-primary); margin-top:2px;">${Utils.escapeHtml(cust.name)}</div>
            <div style="font-size:13px; color:var(--color-text-secondary);">${Utils.escapeHtml(cust.company || "Individual")}</div>
            <div style="font-size:12px; margin-top:6px;">${Utils.escapeHtml(cust.address)}</div>
          </div>
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Financial Status</div>
            <div style="font-size:14px; margin-top:4px;">Total Contracted: <strong>${Utils.formatCurrency(cust.totalContractValue)}</strong></div>
            <div style="font-size:14px; color:var(--color-success);">Total Paid: <strong>${Utils.formatCurrency(cust.paidAmount)}</strong></div>
            <div style="font-size:14px; color:${cust.outstandingBalance > 0 ? "var(--color-danger)" : "var(--color-text-secondary)"};">
              Outstanding: <strong>${Utils.formatCurrency(cust.outstandingBalance)}</strong>
            </div>
          </div>
        </div>

        <!-- Related Projects Section -->
        <div>
          <h4 style="font-size:14px; font-weight:600; margin-bottom:var(--space-2);">Projects (${projects.length})</h4>
          ${
            projects.length === 0
              ? '<div class="text-xs text-muted">No associated construction projects yet.</div>'
              : `
              <div class="table-container" style="border:1px solid var(--color-border);">
                <table class="table-clean">
                  <thead>
                    <tr><th>Project Name</th><th>Location</th><th>Value</th><th>Progress</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    ${projects
                      .map(
                        (p) => `
                      <tr style="cursor:pointer;" onclick="Modal.close(); window.location.hash='#projects/${p.id}';">
                        <td class="table-cell-bold">${Utils.escapeHtml(p.name)}</td>
                        <td>${Utils.escapeHtml(p.location.split(",")[0])}</td>
                        <td>${Utils.formatCurrency(p.contractValue)}</td>
                        <td style="width:120px;">${Utils.renderProgressBar(p.progress)}</td>
                        <td>${Utils.renderStatusBadge(p.status)}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
          }
        </div>

        <!-- Inquiries & Contracts Accordion -->
        <div class="grid grid-cols-2">
          <div class="card" style="padding:var(--space-3);">
            <div style="font-weight:600; font-size:13px; margin-bottom:8px;">Inquiries (${inquiries.length})</div>
            ${
              inquiries.length === 0
                ? '<div class="text-xs text-muted">None</div>'
                : inquiries
                    .map(
                      (inq) => `
                  <div style="font-size:12px; padding:6px 0; border-bottom:1px solid #F1F5F9;">
                    <div style="font-weight:500;">${inq.buildingType}</div>
                    <div class="text-xs text-muted">${inq.id} &bull; ${Utils.renderStatusBadge(inq.status)}</div>
                  </div>
                `
                    )
                    .join("")
            }
          </div>

          <div class="card" style="padding:var(--space-3);">
            <div style="font-weight:600; font-size:13px; margin-bottom:8px;">Contracts (${contracts.length})</div>
            ${
              contracts.length === 0
                ? '<div class="text-xs text-muted">None</div>'
                : contracts
                    .map(
                      (c) => `
                  <div style="font-size:12px; padding:6px 0; border-bottom:1px solid #F1F5F9;">
                    <div style="font-weight:500;">${c.contractNumber}</div>
                    <div class="text-xs text-muted">${Utils.formatCurrency(c.contractAmount)} &bull; ${c.approvalStatus}</div>
                  </div>
                `
                    )
                    .join("")
            }
          </div>
        </div>

        <!-- Notes -->
        <div style="font-size:12px; color:var(--color-text-secondary); background:var(--color-bg-subtle); padding:10px; border-radius:var(--radius-sm);">
          <strong>Account Notes:</strong> ${Utils.escapeHtml(cust.notes || "No notes on record.")}
        </div>
      </div>
    `;

    Modal.open({
      title: `Customer Account: ${cust.name} (${cust.id})`,
      content: contentHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        <button type="button" class="btn btn-primary" id="modal-edit-cust-btn">Edit Account</button>
      `
    });

    document.getElementById("modal-edit-cust-btn")?.addEventListener("click", () => {
      Modal.close();
      openCustomerForm(cust);
    });
  }

  // Add / Edit Customer Form
  function openCustomerForm(customer = null) {
    const isEdit = !!customer;
    const title = isEdit ? `Edit Customer (${customer.id})` : "Create New Customer Account";

    const formHtml = `
      <form id="customer-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Customer Full Name</label>
            <input type="text" class="form-control" name="name" value="${Utils.escapeHtml(customer?.name || "")}" required placeholder="e.g. Er. Rameshwor Shrestha" />
          </div>
          <div class="form-group">
            <label class="form-label">Company / Organization</label>
            <input type="text" class="form-control" name="company" value="${Utils.escapeHtml(customer?.company || "")}" placeholder="e.g. Shrestha Eco Living" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Primary Phone</label>
            <input type="tel" class="form-control" name="phone" value="${Utils.escapeHtml(customer?.phone || "")}" required placeholder="+977-98XXXXXXXX" />
          </div>
          <div class="form-group">
            <label class="form-label required">Email Address</label>
            <input type="email" class="form-control" name="email" value="${Utils.escapeHtml(customer?.email || "")}" required placeholder="client@example.com" />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Customer Category</label>
            <select class="form-control" name="type" required>
              <option value="Residential" ${customer?.type === "Residential" ? "selected" : ""}>Residential</option>
              <option value="Commercial" ${customer?.type === "Commercial" ? "selected" : ""}>Commercial</option>
              <option value="Hospitality" ${customer?.type === "Hospitality" ? "selected" : ""}>Hospitality</option>
              <option value="Industrial" ${customer?.type === "Industrial" ? "selected" : ""}>Industrial</option>
              <option value="Institutional" ${customer?.type === "Institutional" ? "selected" : ""}>Institutional</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label required">Status</label>
            <select class="form-control" name="status" required>
              <option value="Active" ${customer?.status === "Active" ? "selected" : ""}>Active</option>
              <option value="Lead" ${customer?.status === "Lead" ? "selected" : ""}>Lead</option>
              <option value="Completed" ${customer?.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Project Location / Site Address</label>
          <input type="text" class="form-control" name="address" value="${Utils.escapeHtml(customer?.address || "")}" required placeholder="e.g. Budhanilkantha-03, Kathmandu" />
        </div>

        <div class="form-group">
          <label class="form-label">Client Notes & Requirements</label>
          <textarea class="form-control" name="notes" rows="3" placeholder="Enter key preferences, soil condition remarks, or budget notes...">${Utils.escapeHtml(customer?.notes || "")}</textarea>
        </div>
      </form>
    `;

    Modal.open({
      title,
      content: formHtml,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-customer-btn">${isEdit ? "Update Customer" : "Save Customer"}</button>
      `
    });

    document.getElementById("save-customer-btn")?.addEventListener("click", () => {
      const form = document.getElementById("customer-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        company: formData.get("company"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        type: formData.get("type"),
        status: formData.get("status"),
        address: formData.get("address"),
        notes: formData.get("notes")
      };

      if (isEdit) {
        AppState.updateCustomer(customer.id, payload);
        Toast.success("Customer account updated successfully.");
      } else {
        AppState.addCustomer(payload);
        Toast.success("New customer account created.");
      }

      Modal.close();
      table.updateData(AppState.getCustomers());
    });
  }
};

window.ModuleCRM = ModuleCRM;

