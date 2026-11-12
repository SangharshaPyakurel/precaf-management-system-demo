/**
 * Himalayan Prefab Solutions ERP
 * MODULE 07 — QUOTATION MANAGEMENT
 */

const ModuleQuotations = (container) => {
  const quotations = AppState.getQuotations();
  const customers = AppState.getCustomers();
  const inquiries = AppState.getInquiries();
  const company = AppState.getCompany();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Commercial Quotations & Proposals",
      description: "Generate branded turnkey prefab building proposals, manage validity terms, and track client approvals.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Quotations" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="quo-export-btn">
          ${Utils.renderIcon("download", 14)} Export Proposals
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="quo-add-btn">
          ${Utils.renderIcon("plus", 14)} Generate Quotation
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="quo-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("quo-table-mount"),
    columns: [
      {
        key: "id",
        label: "Quotation ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "projectTitle",
        label: "Proposal / Building Project",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Client: ${Utils.escapeHtml(row.customerName)}</div>
          </div>
        `
      },
      {
        key: "createdDate",
        label: "Date",
        render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
      },
      {
        key: "validityDate",
        label: "Valid Until",
        render: (val) => `<span class="text-xs font-medium">${Utils.formatDate(val)}</span>`
      },
      {
        key: "grandTotal",
        label: "Grand Total (NPR)",
        align: "right",
        render: (val) => `<span class="font-semibold font-mono">${Utils.formatCurrency(val)}</span>`
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
            <button type="button" class="btn btn-secondary btn-sm view-quo-doc-btn" data-id="${row.id}">
              ${Utils.renderIcon("file-text", 13)} Document
            </button>
            ${
              row.status !== "Accepted"
                ? `<button type="button" class="btn btn-success btn-sm accept-quo-btn" data-id="${row.id}" title="Client Accepts Quotation">
                    ${Utils.renderIcon("check", 12)} Accept
                   </button>`
                : ""
            }
          </div>
        `
      }
    ],
    data: quotations,
    searchFields: ["id", "projectTitle", "customerName", "status"],
    onRowClick: (row) => openQuotationPreview(row.id)
  });

  // Export CSV
  document.getElementById("quo-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_quotations", AppState.getQuotations());
  });

  // Generate Quotation Modal
  document.getElementById("quo-add-btn")?.addEventListener("click", () => {
    openQuotationForm();
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const docBtn = e.target.closest(".view-quo-doc-btn");
    const acceptBtn = e.target.closest(".accept-quo-btn");

    if (docBtn) {
      e.stopPropagation();
      openQuotationPreview(docBtn.getAttribute("data-id"));
    } else if (acceptBtn) {
      e.stopPropagation();
      const id = acceptBtn.getAttribute("data-id");
      AppState.acceptQuotation(id);
      Toast.success(`Quotation ${id} accepted! Active contract and project updated.`);
      table.updateData(AppState.getQuotations());
    }
  });

  // Branded Quotation Document Preview Modal
  function openQuotationPreview(id) {
    const quo = AppState.getQuotation(id);
    if (!quo) return;

    const contentHtml = `
      <div class="document-sheet" id="printable-quotation">
        <!-- Document Header with Company Branding -->
        <div class="doc-brand-header">
          <div>
            <div class="doc-company-title">${company.name}</div>
            <div class="doc-company-sub">
              ${company.address}<br />
              Tel: ${company.phone} &bull; Email: ${company.email}<br />
              PAN / VAT Reg No: <strong>${company.panVat}</strong>
            </div>
          </div>
          <div class="doc-type-badge">
            <div class="doc-type-title">COMMERCIAL QUOTATION</div>
            <div class="text-xs font-mono" style="margin-top:2px;">Quote Ref: <strong>${quo.id}</strong></div>
            <div class="text-xs text-muted">Date: ${Utils.formatDate(quo.createdDate)}</div>
          </div>
        </div>

        <!-- Client & Scope Meta -->
        <div class="doc-meta-grid">
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Prepared For Client:</div>
            <div style="font-size:15px; font-weight:600; margin-top:2px;">${Utils.escapeHtml(quo.customerName)}</div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">Project Scope: ${Utils.escapeHtml(quo.projectTitle)}</div>
          </div>
          <div>
            <div class="text-xs text-muted uppercase font-semibold">Validity & Terms:</div>
            <div style="font-size:13px; margin-top:2px;">Offer Valid Through: <strong>${Utils.formatDate(quo.validityDate)}</strong></div>
            <div style="font-size:12px; color:var(--color-text-secondary); margin-top:2px;">Status: ${Utils.renderStatusBadge(quo.status)}</div>
          </div>
        </div>

        <!-- Breakdown Table -->
        <table class="table-clean" style="margin-bottom:var(--space-4); border:1px solid var(--color-border);">
          <thead>
            <tr>
              <th>Scope Description</th>
              <th>Specification Summary</th>
              <th style="text-align:right;">Amount (NPR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-medium">1. Structural Steel & Prefabricated Shell Materials</td>
              <td class="text-xs text-muted">Light gauge steel frame, EPS wall panels (75mm), PUF roof panels, double glazed UPVC windows</td>
              <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(quo.materialSubtotal, false)}</td>
            </tr>
            <tr>
              <td class="font-medium">2. Specialized Fabrication & Shop Floor Assembly</td>
              <td class="text-xs text-muted">Roll forming, frame riveting, QC inspection, bundling and weather wrapping</td>
              <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(quo.labourCost, false)}</td>
            </tr>
            <tr>
              <td class="font-medium">3. Logistics & Heavy Freight Transport</td>
              <td class="text-xs text-muted">Direct flatbed transit from Sitapaila Factory to site</td>
              <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(quo.transportationCost, false)}</td>
            </tr>
            <tr>
              <td class="font-medium">4. Site Erection, Crane Lifting & Commissioning</td>
              <td class="text-xs text-muted">Anchor bolting, structural frame erection, panel joint sealing, roof tiling</td>
              <td class="font-mono" style="text-align:right;">${Utils.formatCurrency(quo.installationCost, false)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pricing Summary Box -->
        <div style="display:flex; justify-content:flex-end; margin-bottom:var(--space-6);">
          <div style="width:360px; font-size:13px; line-height:1.8;">
            <div style="display:flex; justify-content:space-between;">
              <span>Subtotal Before Discount:</span>
              <span class="font-mono">${Utils.formatCurrency(quo.subtotalBeforeTax)}</span>
            </div>
            ${
              quo.discountAmount > 0
                ? `<div style="display:flex; justify-content:space-between; color:var(--color-success);">
                    <span>Volume Discount:</span>
                    <span class="font-mono">-${Utils.formatCurrency(quo.discountAmount)}</span>
                   </div>`
                : ""
            }
            <div style="display:flex; justify-content:space-between;">
              <span>VAT (13%):</span>
              <span class="font-mono">${Utils.formatCurrency(quo.taxAmount)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; border-top:2px solid var(--color-primary); padding-top:6px; margin-top:4px; font-size:16px; font-weight:700;">
              <span>Grand Total:</span>
              <span class="font-mono text-primary-color">${Utils.formatCurrency(quo.grandTotal)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Terms & Signatures -->
        <div style="background:var(--color-bg-subtle); padding:12px 16px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:var(--space-6);">
          <strong>Agreed Payment Terms:</strong><br />
          ${Utils.escapeHtml(quo.paymentTerms || "25% Advance on Contract Signing, 25% on Steel Dispatch, 25% on Wall Assembly, 15% on Finishing, 10% on Final Handover.")}
        </div>

        <div class="grid grid-cols-2" style="margin-top:var(--space-8); padding-top:var(--space-4); border-top:1px dashed var(--color-border); font-size:12px;">
          <div>
            <div style="height:40px;"></div>
            <div style="border-top:1px solid #000; width:200px; padding-top:4px; font-weight:600;">For Himalayan Prefab Solutions</div>
            <div class="text-muted">Authorized Commercial Signatory</div>
          </div>
          <div style="text-align:right;">
            <div style="height:40px;"></div>
            <div style="border-top:1px solid #000; width:200px; margin-left:auto; padding-top:4px; font-weight:600;">Client Acceptance Signature</div>
            <div class="text-muted">Er. Rameshwor Shrestha</div>
          </div>
        </div>
      </div>
    `;

    Modal.open({
      title: `Commercial Quotation: ${quo.id}`,
      content: contentHtml,
      size: "xl",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        <button type="button" class="btn btn-secondary" onclick="Utils.printPage();">${Utils.renderIcon("printer", 14)} Print Proposal</button>
        ${
          quo.status !== "Accepted"
            ? `<button type="button" class="btn btn-success" id="modal-accept-quo-btn">Accept Proposal</button>`
            : ""
        }
      `
    });

    document.getElementById("modal-accept-quo-btn")?.addEventListener("click", () => {
      AppState.acceptQuotation(quo.id);
      Toast.success(`Quotation proposal accepted. Contract generated.`);
      Modal.close();
      table.updateData(AppState.getQuotations());
    });
  }

  // Quotation Form Modal
  function openQuotationForm() {
    const custOptions = customers
      .map((c) => `<option value="${c.id}">${Utils.escapeHtml(c.name)} (${c.id})</option>`)
      .join("");

    const inqOptions = inquiries
      .map((i) => `<option value="${i.id}">${i.buildingType} &mdash; ${i.customerName} (${i.id})</option>`)
      .join("");

    const formHtml = `
      <form id="quotation-form">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Select Customer</label>
            <select class="form-control" name="customerId" required>${custOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Linked Inquiry (Optional)</label>
            <select class="form-control" name="inquiryId">${inqOptions}</select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Project Proposal Title</label>
          <input type="text" class="form-control" name="projectTitle" value="Two-Storey Modern Prefab Villa (1,850 sq ft)" required />
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Material Subtotal (NPR)</label>
            <input type="number" class="form-control" name="materialSubtotal" value="2850000" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Labour & Fabrication (NPR)</label>
            <input type="number" class="form-control" name="labourCost" value="480000" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Transport & Freight (NPR)</label>
            <input type="number" class="form-control" name="transportationCost" value="120000" required />
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Erection & Installation (NPR)</label>
            <input type="number" class="form-control" name="installationCost" value="380000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Discount (NPR)</label>
            <input type="number" class="form-control" name="discountAmount" value="200000" />
          </div>
          <div class="form-group">
            <label class="form-label required">Offer Validity Date</label>
            <input type="date" class="form-control" name="validityDate" value="2026-12-31" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Payment Terms</label>
          <input type="text" class="form-control" name="paymentTerms" value="25% Advance, 25% on Steel Dispatch, 25% on Wall Assembly, 15% Finishing, 10% Handover" required />
        </div>
      </form>
    `;

    Modal.open({
      title: "Generate Official Commercial Quotation",
      content: formHtml,
      size: "lg",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-quo-btn">Generate Proposal</button>
      `
    });

    document.getElementById("save-quo-btn")?.addEventListener("click", () => {
      const form = document.getElementById("quotation-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const custId = formData.get("customerId");
      const matchedCust = customers.find((c) => c.id === custId);
      const matSub = Number(formData.get("materialSubtotal")) || 0;
      const labCost = Number(formData.get("labourCost")) || 0;
      const transCost = Number(formData.get("transportationCost")) || 0;
      const instCost = Number(formData.get("installationCost")) || 0;
      const discount = Number(formData.get("discountAmount")) || 0;

      const subtotalBeforeTax = matSub + labCost + transCost + instCost - discount;
      const taxAmount = Math.round(subtotalBeforeTax * 0.13);
      const grandTotal = subtotalBeforeTax + taxAmount;

      const payload = {
        customerId: custId,
        customerName: matchedCust ? matchedCust.name : "Client",
        inquiryId: formData.get("inquiryId"),
        projectTitle: formData.get("projectTitle"),
        validityDate: formData.get("validityDate"),
        materialSubtotal: matSub,
        labourCost: labCost,
        transportationCost: transCost,
        installationCost: instCost,
        discountAmount: discount,
        subtotalBeforeTax,
        taxAmount,
        grandTotal,
        paymentTerms: formData.get("paymentTerms"),
        status: "Sent"
      };

      AppState.addQuotation(payload);
      Toast.success("Commercial proposal generated.");
      Modal.close();
      table.updateData(AppState.getQuotations());
    });
  }
};

window.ModuleQuotations = ModuleQuotations;

