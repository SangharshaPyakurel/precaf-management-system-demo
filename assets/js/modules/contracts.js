/**
 * Himalayan Prefab Solutions ERP
 * MODULE 08 — CONTRACT MANAGEMENT
 */

const ModuleContracts = (container) => {
  const contracts = AppState.getContracts();
  const customers = AppState.getCustomers();
  const projects = AppState.getProjects();
  const company = AppState.getCompany();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Turnkey Construction Contracts",
      description: "Manage legally binding turnkey contracts, stage payment milestones, defect liability periods, and warranties.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Contracts" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="con-export-btn">
          ${Utils.renderIcon("download", 14)} Export Contracts
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="con-add-btn">
          ${Utils.renderIcon("plus", 14)} New Contract
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="con-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("con-table-mount"),
    columns: [
      {
        key: "contractNumber",
        label: "Contract #",
        width: "140px",
        render: (val, row) => `
          <div>
            <div class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val || row.id)}</div>
            <div class="text-xs text-muted font-mono">${row.id}</div>
          </div>
        `
      },
      {
        key: "projectName",
        label: "Project Scope",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Client: ${Utils.escapeHtml(row.customerName)}</div>
          </div>
        `
      },
      {
        key: "contractAmount",
        label: "Contract Amount (NPR)",
        align: "right",
        render: (val) => `<span class="font-semibold font-mono">${Utils.formatCurrency(val)}</span>`
      },
      {
        key: "startDate",
        label: "Start Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "completionDate",
        label: "Completion Target",
        render: (val) => `<span class="text-xs font-medium">${Utils.formatDate(val)}</span>`
      },
      {
        key: "warrantyPeriod",
        label: "Warranty",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val ? val.split(",")[0] : "5 Years")}</span>`
      },
      {
        key: "approvalStatus",
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
            <button type="button" class="btn btn-secondary btn-sm view-con-doc-btn" data-id="${row.id}">
              ${Utils.renderIcon("file-text", 13)} Agreement
            </button>
          </div>
        `
      }
    ],
    data: contracts,
    searchFields: ["contractNumber", "projectName", "customerName", "id"],
    onRowClick: (row) => openContractPreview(row.id)
  });

  // Export CSV
  document.getElementById("con-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_construction_contracts", AppState.getContracts());
  });

  // Add contract
  document.getElementById("con-add-btn")?.addEventListener("click", () => {
    openContractForm();
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const docBtn = e.target.closest(".view-con-doc-btn");
    if (docBtn) {
      e.stopPropagation();
      openContractPreview(docBtn.getAttribute("data-id"));
    }
  });

  // Contract Agreement Document Preview Modal
  function openContractPreview(id) {
    const con = AppState.getContracts().find((c) => c.id === id);
    if (!con) return;

    const milestones = con.milestones || [
      { name: "Contract Signing & Advance", amount: Math.round(con.contractAmount * 0.25), status: "Paid", date: con.startDate },
      { name: "Structural Frame & Shell Erection", amount: Math.round(con.contractAmount * 0.40), status: "Due", date: con.completionDate },
      { name: "Final Handover & Keys", amount: Math.round(con.contractAmount * 0.35), status: "Pending", date: con.completionDate }
    ];

    const contentHtml = `
      <div class="document-sheet">
        <div class="doc-brand-header">
          <div>
            <div class="doc-company-title">${company.name}</div>
            <div class="doc-company-sub">
              ${company.address} &bull; Reg: ${company.regNo}<br />
              Commercial Prefabricated Engineering Division
            </div>
          </div>
          <div class="doc-type-badge">
            <div class="doc-type-title">TURNKEY CONTRACT</div>
            <div class="text-xs font-mono">Contract Ref: <strong>${con.contractNumber}</strong></div>
            <div class="text-xs text-muted">Signed Date: ${Utils.formatDate(con.signedDate || con.startDate)}</div>
          </div>
        </div>

        <div class="doc-meta-grid">
          <div>
            <div><strong>First Party (Contractor):</strong> ${company.name}</div>
            <div><strong>Second Party (Client):</strong> ${Utils.escapeHtml(con.customerName)}</div>
            <div><strong>Project:</strong> ${Utils.escapeHtml(con.projectName)}</div>
          </div>
          <div>
            <div><strong>Total Contract Value:</strong> ${Utils.formatCurrency(con.contractAmount)}</div>
            <div><strong>Execution Period:</strong> ${Utils.formatDate(con.startDate)} to ${Utils.formatDate(con.completionDate)}</div>
            <div><strong>Warranty Coverage:</strong> ${Utils.escapeHtml(con.warrantyPeriod)}</div>
          </div>
        </div>

        <!-- Milestones Table -->
        <h4 style="font-size:14px; font-weight:600; margin-bottom:var(--space-2);">Payment Milestones Schedule</h4>
        <table class="table-clean" style="margin-bottom:var(--space-4); border:1px solid var(--color-border);">
          <thead>
            <tr>
              <th>Milestone Stage Description</th>
              <th>Due Date</th>
              <th style="text-align:right;">Amount (NPR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${milestones
              .map((m) => {
                return `
              <tr>
                <td class="font-medium">${Utils.escapeHtml(m.name)}</td>
                <td class="text-xs">${Utils.formatDate(m.date)}</td>
                <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(m.amount)}</td>
                <td>${Utils.renderStatusBadge(m.status)}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>

        <!-- Terms & Conditions -->
        <div style="background:var(--color-bg-subtle); padding:12px 16px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:var(--space-6); line-height:1.6;">
          <strong>Standard Enterprise Clauses:</strong><br />
          1. <strong>Scope of Work:</strong> Supply, manufacturing, transportation, and complete turnkey assembly of prefabricated building structure as per approved engineering drawings.<br />
          2. <strong>Quality Guarantee:</strong> Light gauge steel framing is warranted for 10 years against structural defects and excessive corrosion.<br />
          3. <strong>Defect Liability:</strong> 12 months comprehensive warranty on roof leakages, sealant integrity, and door/window operation.<br />
          4. <strong>Force Majeure:</strong> Exclusions apply for catastrophic regional natural disasters beyond NBC 105:2020 seismic design parameters.
        </div>

        <!-- Signatures -->
        <div class="grid grid-cols-2" style="margin-top:var(--space-6); padding-top:var(--space-4); border-top:1px dashed var(--color-border); font-size:12px;">
          <div>
            <div style="height:40px;"></div>
            <div style="border-top:1px solid #000; width:220px; padding-top:4px; font-weight:600;">Authorized Signatory</div>
            <div class="text-muted">For ${company.name}</div>
          </div>
          <div style="text-align:right;">
            <div style="height:40px;"></div>
            <div style="border-top:1px solid #000; width:220px; margin-left:auto; padding-top:4px; font-weight:600;">Client Acceptance Signatory</div>
            <div class="text-muted">${Utils.escapeHtml(con.customerName)}</div>
          </div>
        </div>
      </div>
    `;

    Modal.open({
      title: `Contract Agreement: ${con.contractNumber}`,
      content: contentHtml,
      size: "xl",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        <button type="button" class="btn btn-secondary" onclick="Utils.printPage();">${Utils.renderIcon("printer", 14)} Print Contract</button>
      `
    });
  }

  // Contract Form Modal
  function openContractForm() {
    const custOptions = customers
      .map((c) => `<option value="${c.id}">${Utils.escapeHtml(c.name)} (${c.id})</option>`)
      .join("");

    const prjOptions = projects
      .map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`)
      .join("");

    const formHtml = `
      <form id="contract-form">
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

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Contract Value (NPR)</label>
            <input type="number" class="form-control" name="contractAmount" value="4500000" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Advance Payment (NPR)</label>
            <input type="number" class="form-control" name="advancePayment" value="1125000" required />
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Start Date</label>
            <input type="date" class="form-control" name="startDate" value="${new Date().toISOString().split("T")[0]}" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Target Completion Date</label>
            <input type="date" class="form-control" name="completionDate" value="2026-12-31" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Warranty Terms</label>
          <input type="text" class="form-control" name="warrantyPeriod" value="10 Years Structural, 2 Years Waterproofing & Finishes" required />
        </div>
      </form>
    `;

    Modal.open({
      title: "Draft New Construction Contract",
      content: formHtml,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-contract-btn">Execute Contract</button>
      `
    });

    document.getElementById("save-contract-btn")?.addEventListener("click", () => {
      const form = document.getElementById("contract-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      const payload = {
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        contractAmount: Number(formData.get("contractAmount")),
        advancePayment: Number(formData.get("advancePayment")),
        startDate: formData.get("startDate"),
        completionDate: formData.get("completionDate"),
        warrantyPeriod: formData.get("warrantyPeriod")
      };

      AppState.addContract(payload);
      Toast.success("Contract successfully executed.");
      Modal.close();
      table.updateData(AppState.getContracts());
    });
  }
};

window.ModuleContracts = ModuleContracts;

