/**
 * Himalayan Prefab Solutions ERP
 * MODULE 24 — SETTINGS & CONFIGURATION
 */

const ModuleSettings = (container) => {
  const company = AppState.getCompany();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "System Settings & Corporate Configuration",
      description: "Manage enterprise profile, Kathmandu plant address, VAT registration, standard production stages, and demo data state.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Settings" }]
    })}

    <div class="grid grid-cols-3" style="gap:var(--space-6);">
      <!-- Left 2 Cols: Company Profile & Operations Config -->
      <div style="grid-column: span 2; display:flex; flex-direction:column; gap:var(--space-5);">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Corporate Profile & Legal Registration</h3>
          </div>
          <div class="card-body">
            <form id="company-settings-form">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label required">Company Operating Name</label>
                  <input type="text" class="form-control" name="name" value="${Utils.escapeHtml(company.name)}" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">PAN / VAT Registration No.</label>
                  <input type="text" class="form-control" name="panVat" value="${Utils.escapeHtml(company.panVat)}" required />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label required">Head Office Address</label>
                  <input type="text" class="form-control" name="address" value="${Utils.escapeHtml(company.address)}" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">Central Manufacturing Plant</label>
                  <input type="text" class="form-control" name="factoryLocation" value="${Utils.escapeHtml(company.factoryLocation)}" required />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label required">Official Phone</label>
                  <input type="text" class="form-control" name="phone" value="${Utils.escapeHtml(company.phone)}" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">Official Email</label>
                  <input type="email" class="form-control" name="email" value="${Utils.escapeHtml(company.email)}" required />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label required">Financial Year</label>
                  <input type="text" class="form-control" name="financialYear" value="${Utils.escapeHtml(company.financialYear)}" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">Operating Currency</label>
                  <input type="text" class="form-control" name="currency" value="NPR (Nepalese Rupee - Rs.)" readonly />
                </div>
              </div>

              <div style="display:flex; justify-content:flex-end; margin-top:var(--space-2);">
                <button type="submit" class="btn btn-primary btn-sm">Save Corporate Profile</button>
              </div>
            </form>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Configurable Manufacturing Stages</h3>
          </div>
          <div class="card-body" style="font-size:13px;">
            <p class="text-muted" style="margin-bottom:12px;">Standardized fabrication milestones for light gauge steel and panel assembly:</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <span class="badge badge-primary">1. Material De-coiling</span>
              <span class="badge badge-primary">2. CNC Roll Forming</span>
              <span class="badge badge-primary">3. Frame Riveting</span>
              <span class="badge badge-primary">4. Panel Cutting</span>
              <span class="badge badge-primary">5. Insulation Fitting</span>
              <span class="badge badge-primary">6. Assembly</span>
              <span class="badge badge-primary">7. Finishing</span>
              <span class="badge badge-primary">8. Quality Stamping</span>
              <span class="badge badge-primary">9. Bundling & Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Col: Demo Reset & System Actions -->
      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        <div class="card" style="border-color:#FDE68A; background:#FFFBEB;">
          <div class="card-header" style="border-bottom-color:#FDE68A;">
            <h3 class="card-title" style="color:#B45309;">Demo Maintenance Control</h3>
          </div>
          <div class="card-body" style="font-size:13px; color:#92400E; line-height:1.5;">
            <p>You can restore all projects, customer files, stock movements, and financial invoices back to the pristine factory seed state at any time.</p>
            <button type="button" class="btn btn-danger btn-sm w-full" id="settings-reset-data-btn" style="margin-top:12px;">
              ${Utils.renderIcon("refresh-cw", 14)} Reset All Demo Data
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Production Migration Note</h3>
          </div>
          <div class="card-body" style="font-size:12px; color:var(--color-text-secondary); line-height:1.6;">
            <strong>Target Architecture:</strong>
            <ul style="padding-left:16px; margin-top:4px;">
              <li>Next.js & TypeScript Frontend</li>
              <li>Django REST Framework Backend</li>
              <li>PostgreSQL DB with PostGIS for GIS Surveys</li>
              <li>Redis & Celery background tasks</li>
              <li>S3 Object Storage for CAD Blueprints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Save Company Form
  document.getElementById("company-settings-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    AppState.updateCompany({
      name: formData.get("name"),
      panVat: formData.get("panVat"),
      address: formData.get("address"),
      factoryLocation: formData.get("factoryLocation"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      financialYear: formData.get("financialYear")
    });
    Toast.success("Corporate settings saved.");
  });

  // Reset Demo Data
  document.getElementById("settings-reset-data-btn")?.addEventListener("click", () => {
    Modal.confirm({
      title: "Reset All Enterprise Demo Records",
      message: "Are you sure you want to reset the entire ERP demo dataset? All test creations and progress modifications will be replaced with initial default seeds.",
      confirmText: "Yes, Reset Demo Data",
      confirmVariant: "danger",
      onConfirm: () => {
        Storage.resetToSeedData();
        Toast.success("Demo database restored to default factory seeds.");
        setTimeout(() => {
          window.location.hash = "#dashboard";
          window.location.reload();
        }, 600);
      }
    });
  });
};

window.ModuleSettings = ModuleSettings;

