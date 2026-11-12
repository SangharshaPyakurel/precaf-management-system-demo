/**
 * Himalayan Prefab Solutions ERP
 * MODULE 11 — PRODUCTION & FACTORY MANAGEMENT
 */

const ModuleProduction = (container) => {
  const productionOrders = AppState.getProductionOrders();
  const projects = AppState.getProjects();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Prefab Factory & Manufacturing Operations",
      description: "Automated production line scheduling, light-gauge roll forming, sandwich panel fabrication, and component packaging at Sitapaila Central Plant.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Production / Factory" }],
      actions: `
        <button type="button" class="btn btn-secondary btn-sm" id="mfg-export-btn">
          ${Utils.renderIcon("download", 14)} Export Orders
        </button>
        <button type="button" class="btn btn-primary btn-sm" id="mfg-add-order-btn">
          ${Utils.renderIcon("plus", 14)} New Production Order
        </button>
      `
    })}

    <!-- Factory Status Summary Banner -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-5);">
      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Active Production Orders</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-primary); margin-top:2px;">
          ${productionOrders.filter((p) => p.status === "In Production").length} Orders
        </div>
        <div class="text-xs text-muted">Running on Lines A & B</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Completed Batches</div>
        <div style="font-size:22px; font-weight:600; color:var(--color-success); margin-top:2px;">
          ${productionOrders.filter((p) => p.status === "Completed").length} Batches
        </div>
        <div class="text-xs text-muted">Cleared & stamped for dispatch</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Factory Plant Location</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-text-primary); margin-top:4px;">Sitapaila Industrial Hub</div>
        <div class="text-xs text-muted">Bhimdhunga Corridor, Kathmandu</div>
      </div>

      <div class="card" style="padding:14px;">
        <div style="font-size:11px; text-transform:uppercase; color:var(--color-text-secondary); font-weight:600;">Production Manager</div>
        <div style="font-size:14px; font-weight:600; color:var(--color-primary); margin-top:4px;">Manoj Maharjan</div>
        <div class="text-xs text-muted">Head of Plant Operations</div>
      </div>
    </div>

    <!-- Active Production Pipeline Visuals -->
    <div style="margin-bottom:var(--space-6);">
      <h3 style="font-size:16px; font-weight:600; margin-bottom:var(--space-3);">Active Factory Orders & Component Stage Tracking</h3>
      <div style="display:flex; flex-direction:column; gap:var(--space-4);" id="production-orders-cards">
        ${productionOrders
          .map((ord) => {
            const stagesHtml = (ord.stages || [])
              .map((stg) => {
                const isCompleted = stg.status === "Completed";
                const isInProgress = stg.status === "In Progress";
                const badgeClass = isCompleted ? "completed" : isInProgress ? "active" : "";

                return `
                <div class="stage-step ${badgeClass}" data-order-id="${ord.id}" data-stage-id="${stg.id}" title="Click to cycle stage status">
                  <div class="stage-number">${isCompleted ? "✓ DONE" : isInProgress ? "IN PROGRESS" : "PENDING"}</div>
                  <div class="stage-name">${Utils.escapeHtml(stg.name)}</div>
                </div>
              `;
              })
              .join("");

            return `
            <div class="card" style="padding:var(--space-4);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="font-mono text-xs font-semibold text-primary-color">${ord.orderNumber}</span>
                    <span class="badge badge-neutral text-xs">${ord.id}</span>
                    ${Utils.renderStatusBadge(ord.status)}
                  </div>
                  <h4 style="font-size:15px; font-weight:600; margin-top:4px;">${Utils.escapeHtml(ord.component)}</h4>
                  <div style="font-size:12px; color:var(--color-text-secondary);">
                    Project: <strong>${Utils.escapeHtml(ord.projectName)}</strong> &bull; Line: <strong>${Utils.escapeHtml(ord.assignedTeam)}</strong>
                  </div>
                </div>

                <div style="text-align:right;">
                  <div style="font-size:12px; color:var(--color-text-secondary);">Completed: <strong>${ord.completedQuantity} / ${ord.plannedQuantity} ${ord.unit}</strong></div>
                  <div style="min-width:140px; margin-top:4px;">${Utils.renderProgressBar(ord.progress)}</div>
                </div>
              </div>

              <!-- Multi-stage pipeline steps -->
              <div class="production-pipeline">
                ${stagesHtml}
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;

  // Attach stage status toggle listeners
  container.querySelectorAll(".stage-step").forEach((stepEl) => {
    stepEl.addEventListener("click", () => {
      const orderId = stepEl.getAttribute("data-order-id");
      const stageId = stepEl.getAttribute("data-stage-id");

      const order = AppState.getProductionOrder(orderId);
      if (!order) return;
      const stage = order.stages.find((s) => s.id === stageId);
      if (!stage) return;

      const nextStatus = stage.status === "Pending" ? "In Progress" : stage.status === "In Progress" ? "Completed" : "Pending";
      AppState.updateProductionStage(orderId, stageId, nextStatus);
      Toast.info(`Stage "${stage.name}" updated to: ${nextStatus}`);
      ModuleProduction(container);
    });
  });

  // Export CSV
  document.getElementById("mfg-export-btn")?.addEventListener("click", () => {
    Utils.exportToCsv("hps_production_orders", AppState.getProductionOrders());
  });

  // Add Production Order
  document.getElementById("mfg-add-order-btn")?.addEventListener("click", () => {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Issue Factory Production Order",
      content: `
        <form id="new-prod-order-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label required">Component / Prefab Unit Description</label>
            <input type="text" class="form-control" name="component" value="Light Gauge Steel Wall Frames & Trusses Set" required />
          </div>
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label required">Planned Quantity</label>
              <input type="number" class="form-control" name="plannedQuantity" value="35" required min="1" />
            </div>
            <div class="form-group">
              <label class="form-label required">Unit</label>
              <input type="text" class="form-control" name="unit" value="Panels" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Assigned Factory Team</label>
              <select class="form-control" name="assignedTeam" required>
                <option value="Line A - Light Gauge Steel Team">Line A - Light Gauge Steel Team</option>
                <option value="Line B - Modular Pod Assembly">Line B - Modular Pod Assembly</option>
                <option value="Heavy Fabrication Bay">Heavy Fabrication Bay</option>
                <option value="Panel Sizing Bay">Panel Sizing Bay</option>
              </select>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Start Date</label>
              <input type="date" class="form-control" name="startDate" value="${new Date().toISOString().split("T")[0]}" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Expected Completion</label>
              <input type="date" class="form-control" name="expectedCompletion" value="2026-12-05" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-prod-order-btn">Release Order to Line</button>
      `
    });

    document.getElementById("save-prod-order-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-prod-order-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addProductionOrder({
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        component: formData.get("component"),
        plannedQuantity: Number(formData.get("plannedQuantity")),
        completedQuantity: 0,
        unit: formData.get("unit"),
        assignedTeam: formData.get("assignedTeam"),
        startDate: formData.get("startDate"),
        expectedCompletion: formData.get("expectedCompletion")
      });

      Toast.success("Production order issued to factory floor.");
      Modal.close();
      ModuleProduction(container);
    });
  });
};

window.ModuleProduction = ModuleProduction;

