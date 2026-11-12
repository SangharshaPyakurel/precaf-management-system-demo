/**
 * Himalayan Prefab Solutions ERP
 * MODULE 05 — DESIGN & ENGINEERING
 */

const ModuleDesign = (container) => {
  const designs = Storage.get("designs", SEED_DATA.designs);
  const projects = AppState.getProjects();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Design & Structural Engineering",
      description: "Manage architectural blueprints, structural light-gauge steel models, MEP routing plans, and municipal revisions.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Design & Engineering" }],
      actions: `
        <button type="button" class="btn btn-primary btn-sm" id="design-new-drawing-btn">
          ${Utils.renderIcon("plus", 14)} New Drawing Package
        </button>
      `
    })}

    <!-- Highlights Banner -->
    <div class="grid grid-cols-3" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Seismic Compliance Standard</div>
        <div style="font-size:16px; font-weight:600; color:var(--color-text-primary); margin-top:4px;">NBC 105:2020 & Zone V</div>
        <div class="text-xs text-muted">Ductile detailing for earthquake resistance</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Approved Drawing Packages</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-success); margin-top:2px;">${designs.length} Packages</div>
        <div class="text-xs text-muted">Client & Municipal approved</div>
      </div>
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Chief Structural Engineer</div>
        <div style="font-size:16px; font-weight:600; color:var(--color-primary); margin-top:4px;">Er. Anupama Karki</div>
        <div class="text-xs text-muted">Lead CAD & BIM Specialist</div>
      </div>
    </div>

    <!-- Drawing Packages List -->
    <div class="grid grid-cols-3" style="gap:var(--space-4);" id="design-cards-mount">
      ${designs
        .map((d) => {
          return `
        <div class="card" style="display:flex; flex-direction:column;">
          <div class="card-header">
            <div>
              <span class="badge badge-primary font-mono text-xs">${d.id}</span>
              <h3 class="card-title" style="margin-top:4px;">${Utils.escapeHtml(d.projectName)}</h3>
            </div>
            <span class="badge badge-success text-xs">${Utils.escapeHtml(d.approvalStatus.split(" ")[0])}</span>
          </div>
          
          <div class="card-body" style="flex:1;">
            <!-- Blueprint Visual Placeholder -->
            <div style="background:#0F172A; border-radius:var(--radius-sm); height:130px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94A3B8; margin-bottom:12px; border:1px dashed #334155; position:relative; overflow:hidden;">
              <div style="position:absolute; top:8px; left:8px; font-size:10px; font-family:monospace; color:#38BDF8;">CAD-DWG &bull; ${d.revision}</div>
              <div style="color:#38BDF8; margin-bottom:4px;">${Utils.renderIcon("compass", 32)}</div>
              <span style="font-size:11px; font-family:monospace; color:#E2E8F0;">${d.architecturalDrawings.split(" ")[0]}</span>
            </div>

            <div style="font-size:12px; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Architectural:</strong> <span class="text-muted">${d.architecturalDrawings}</span></div>
              <div><strong>Structural:</strong> <span class="text-muted">${d.structuralDrawings}</span></div>
              <div><strong>MEP Electrical/Plumbing:</strong> <span class="text-muted">${d.electricalDrawings} &bull; ${d.plumbingDrawings}</span></div>
              <div><strong>Specifications:</strong> <span class="text-muted">${Utils.escapeHtml(d.materialSpecifications)}</span></div>
            </div>
          </div>

          <div class="card-footer">
            <span class="text-xs text-muted">Rev Date: ${Utils.formatDate(d.approvalDate)}</span>
            <button type="button" class="btn btn-secondary btn-sm view-spec-btn" data-id="${d.id}">
              ${Utils.renderIcon("eye", 13)} View Blueprint Details
            </button>
          </div>
        </div>
      `;
        })
        .join("")}
    </div>
  `;

  // Attach card detail listeners
  container.querySelectorAll(".view-spec-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const d = designs.find((x) => x.id === id);
      if (!d) return;

      Modal.open({
        title: `Design Blueprint Package: ${d.id} &mdash; ${d.projectName}`,
        content: `
          <div style="display:flex; flex-direction:column; gap:var(--space-4);">
            <div style="background:#0B132B; padding:16px; border-radius:var(--radius-md); text-align:center; color:#64DFDF; font-family:monospace;">
              ${Utils.renderIcon("compass", 42)}
              <div style="font-size:14px; margin-top:8px; font-weight:600;">CAD Drawing Preview Mode</div>
              <div style="font-size:11px; color:#94A3B8;">Vector drawing renders compliant with Light Gauge Steel roll forming CNC machine.</div>
            </div>

            <div class="grid grid-cols-2">
              <div><strong>Project:</strong> ${Utils.escapeHtml(d.projectName)}</div>
              <div><strong>Lead Engineer:</strong> ${Utils.escapeHtml(d.architectEngineer)}</div>
              <div><strong>Drawing Revision:</strong> ${Utils.escapeHtml(d.revision)}</div>
              <div><strong>Approval Date:</strong> ${Utils.formatDate(d.approvalDate)}</div>
            </div>

            <div style="border-top:1px solid var(--color-border); padding-top:12px;">
              <h4 style="font-size:13px; font-weight:600; margin-bottom:6px;">Drawings Set Inventory:</h4>
              <ul style="font-size:12px; padding-left:18px; color:var(--color-text-secondary); line-height:1.6;">
                <li>Architectural Plan: <strong>${d.architecturalDrawings}</strong></li>
                <li>Structural Frame Model: <strong>${d.structuralDrawings}</strong></li>
                <li>Electrical Conduit Plan: <strong>${d.electricalDrawings}</strong></li>
                <li>Plumbing & Sanitary: <strong>${d.plumbingDrawings}</strong></li>
              </ul>
            </div>

            <div style="background:var(--color-bg-subtle); padding:10px; border-radius:var(--radius-sm); font-size:12px;">
              <strong>Engineering Notes:</strong> ${Utils.escapeHtml(d.notes)}
            </div>
          </div>
        `,
        size: "md",
        footer: `<button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>`
      });
    });
  });

  // New Drawing Package Upload Simulation
  document.getElementById("design-new-drawing-btn")?.addEventListener("click", () => {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Upload & Register Design Package",
      content: `
        <form id="new-design-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label required">Lead Engineer</label>
            <input type="text" class="form-control" name="engineer" value="Er. Anupama Karki" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Drawing Revision Code</label>
            <input type="text" class="form-control" name="revision" value="Revision 1.0 (Preliminary)" required />
          </div>
          <div class="form-group">
            <label class="form-label required">Material & Component Specifications</label>
            <textarea class="form-control" name="specs" rows="2" required>75mm EPS Wall, 50mm PUF Roof, UPVC double glazed windows</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Upload DWG / PDF Blueprint Files (Demo)</label>
            <input type="file" class="form-control" />
            <span class="form-help-text">Select .dwg, .dxf, or .pdf structural drawings</span>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-design-pkg-btn">Register Package</button>
      `
    });

    document.getElementById("save-design-pkg-btn")?.addEventListener("click", () => {
      Toast.success("Design drawings package uploaded and registered.");
      Modal.close();
    });
  });
};

window.ModuleDesign = ModuleDesign;

