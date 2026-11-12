/**
 * Himalayan Prefab Solutions ERP
 * MODULE 21 — DOCUMENT MANAGEMENT REPOSITORY
 */

const ModuleDocuments = (container) => {
  const documents = Storage.get("documents", SEED_DATA.documents);
  const projects = AppState.getProjects();

  container.innerHTML = `
    ${Layout.renderPageHeader({
      title: "Document Management & Technical Repository",
      description: "Centralized archival of municipal drawings, structural calculations, signed turnkey contracts, and material test certificates.",
      breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Documents" }],
      actions: `
        <button type="button" class="btn btn-primary btn-sm" id="doc-upload-btn">
          ${Utils.renderIcon("plus", 14)} Upload Document
        </button>
      `
    })}

    <!-- Data Table Container -->
    <div id="doc-table-mount"></div>
  `;

  const table = new DataTable({
    container: document.getElementById("doc-table-mount"),
    columns: [
      {
        key: "id",
        label: "Doc ID",
        width: "110px",
        render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${val}</span>`
      },
      {
        key: "title",
        label: "Document Title & Scope",
        render: (val, row) => `
          <div>
            <div class="font-semibold text-sm">${Utils.escapeHtml(val)}</div>
            <div class="text-xs text-muted">Project: ${Utils.escapeHtml(row.projectName)}</div>
          </div>
        `
      },
      {
        key: "category",
        label: "Category",
        render: (val) => `<span class="badge badge-neutral text-xs">${Utils.escapeHtml(val)}</span>`
      },
      {
        key: "fileType",
        label: "Format & Size",
        render: (val, row) => `<span class="text-xs font-mono">${val} (${row.fileSize})</span>`
      },
      {
        key: "version",
        label: "Version",
        render: (val) => `<span class="badge badge-primary text-xs font-mono">${val}</span>`
      },
      {
        key: "uploadDate",
        label: "Upload Date",
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
            <button type="button" class="btn btn-secondary btn-sm preview-doc-btn" data-id="${row.id}">
              ${Utils.renderIcon("eye", 13)} Preview
            </button>
          </div>
        `
      }
    ],
    data: documents,
    searchFields: ["title", "category", "projectName", "id"],
    onRowClick: (row) => openDocModal(row.id)
  });

  // Action clicks
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".preview-doc-btn");
    if (btn) {
      e.stopPropagation();
      openDocModal(btn.getAttribute("data-id"));
    }
  });

  // Upload modal
  document.getElementById("doc-upload-btn")?.addEventListener("click", () => {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");

    Modal.open({
      title: "Upload Document to Enterprise Repository",
      content: `
        <form id="new-doc-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label required">Document Title</label>
            <input type="text" class="form-control" name="title" value="Site Handover & Inspection Protocol" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Document Category</label>
              <select class="form-control" name="category" required>
                <option value="Drawings">Drawings</option>
                <option value="Contracts">Contracts</option>
                <option value="Engineering">Engineering</option>
                <option value="BOQ">BOQ</option>
                <option value="Quality Reports">Quality Reports</option>
                <option value="Handover & Warranty">Handover & Warranty</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Version</label>
              <input type="text" class="form-control" name="version" value="v1.0" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label required">Select File (PDF, DWG, XLSX)</label>
            <input type="file" class="form-control" />
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-doc-btn">Upload Document</button>
      `
    });

    document.getElementById("save-doc-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-doc-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);
      const list = Storage.get("documents", SEED_DATA.documents);

      const newDoc = {
        id: Utils.generateId("DOC", list),
        title: formData.get("title"),
        category: formData.get("category"),
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        uploadedBy: AppState.getRole(),
        uploadDate: new Date().toISOString().split("T")[0],
        fileType: "PDF",
        fileSize: "2.4 MB",
        version: formData.get("version"),
        status: "Approved"
      };

      list.unshift(newDoc);
      Storage.set("documents", list);
      Toast.success("Document uploaded and archived.");
      Modal.close();
      ModuleDocuments(container);
    });
  });

  function openDocModal(id) {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    Modal.open({
      title: `Document: ${doc.title}`,
      content: `
        <div style="display:flex; flex-direction:column; gap:var(--space-3); font-size:13px;">
          <div class="grid grid-cols-2" style="background:var(--color-bg-subtle); padding:12px; border-radius:var(--radius-sm);">
            <div><strong>Project:</strong> ${Utils.escapeHtml(doc.projectName)}</div>
            <div><strong>Category:</strong> ${Utils.escapeHtml(doc.category)}</div>
            <div><strong>Format:</strong> ${doc.fileType} (${doc.fileSize})</div>
            <div><strong>Version:</strong> ${doc.version} &bull; ${doc.status}</div>
          </div>
          <div style="background:#0F172A; color:#38BDF8; font-family:monospace; padding:30px; text-align:center; border-radius:var(--radius-md);">
            ${Utils.renderIcon("file-text", 40)}
            <div style="font-size:14px; margin-top:8px; color:#FFFFFF;">Document Preview Simulation</div>
            <div style="font-size:11px; color:#94A3B8; margin-top:4px;">Encrypted immutable PDF archive stored on enterprise cloud storage.</div>
          </div>
        </div>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Close</button>
        <button type="button" class="btn btn-primary" onclick="Toast.info('Simulated file download complete.'); Modal.close();">Download File</button>
      `
    });
  }
};

window.ModuleDocuments = ModuleDocuments;

