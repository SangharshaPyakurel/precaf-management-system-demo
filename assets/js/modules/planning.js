/**
 * Himalayan Prefab Solutions ERP
 * MODULE 10 — PROJECT PLANNING & KANBAN
 */

const ModulePlanning = (container) => {
  let activeView = "kanban"; // 'kanban', 'list', 'calendar'
  const projects = AppState.getProjects();
  const employees = AppState.getEmployees();

  function render() {
    const tasks = AppState.getTasks();

    container.innerHTML = `
      ${Layout.renderPageHeader({
        title: "Project Planning & Schedule Execution",
        description: "Interactive scheduling across pre-construction surveys, factory manufacturing, transport logistics, and site installation.",
        breadcrumb: [{ label: "HPS ERP", path: "#dashboard" }, { label: "Project Planning" }],
        actions: `
          <div class="btn-group" style="display:inline-flex; border:1px solid var(--color-border); border-radius:var(--radius-md); overflow:hidden; background:#FFFFFF;">
            <button type="button" class="btn btn-sm ${activeView === "kanban" ? "btn-primary" : "btn-ghost"}" id="view-kanban-btn">
              ${Utils.renderIcon("layers", 14)} Kanban Board
            </button>
            <button type="button" class="btn btn-sm ${activeView === "list" ? "btn-primary" : "btn-ghost"}" id="view-list-btn">
              ${Utils.renderIcon("file-text", 14)} List View
            </button>
            <button type="button" class="btn btn-sm ${activeView === "calendar" ? "btn-primary" : "btn-ghost"}" id="view-cal-btn">
              ${Utils.renderIcon("calendar", 14)} Schedule
            </button>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="planning-add-task-btn">
            ${Utils.renderIcon("plus", 14)} New Task
          </button>
        `
      })}

      <!-- Dynamic View Container -->
      <div id="planning-view-mount"></div>
    `;

    // Attach View Switchers
    document.getElementById("view-kanban-btn")?.addEventListener("click", () => {
      activeView = "kanban";
      render();
    });
    document.getElementById("view-list-btn")?.addEventListener("click", () => {
      activeView = "list";
      render();
    });
    document.getElementById("view-cal-btn")?.addEventListener("click", () => {
      activeView = "calendar";
      render();
    });

    document.getElementById("planning-add-task-btn")?.addEventListener("click", () => {
      openTaskForm();
    });

    const mount = document.getElementById("planning-view-mount");
    if (activeView === "kanban") {
      renderKanban(mount, tasks);
    } else if (activeView === "list") {
      renderList(mount, tasks);
    } else {
      renderCalendar(mount, tasks);
    }
  }

  function renderKanban(mount, tasks) {
    const columns = [
      { id: "To Do", label: "To Do", color: "#64748B" },
      { id: "In Progress", label: "In Progress", color: "#2563EB" },
      { id: "On Hold", label: "On Hold", color: "#D97706" },
      { id: "Completed", label: "Completed", color: "#15803D" }
    ];

    mount.innerHTML = `
      <div class="kanban-board">
        ${columns
          .map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return `
            <div class="kanban-column">
              <div class="kanban-col-header">
                <div class="kanban-col-title">
                  <span style="width:8px; height:8px; border-radius:50%; background:${col.color};"></span>
                  ${col.label}
                </div>
                <span class="kanban-col-count">${colTasks.length}</span>
              </div>
              <div class="kanban-cards-container">
                ${
                  colTasks.length === 0
                    ? `<div style="text-align:center; padding:30px 10px; font-size:12px; color:var(--color-text-muted);">No tasks in ${col.label}</div>`
                    : colTasks
                        .map((t) => {
                          return `
                      <div class="kanban-card" data-id="${t.id}" title="Click to cycle task status">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                          <span class="font-mono text-xs font-semibold text-primary-color">${t.id}</span>
                          <span class="badge ${t.priority === "Urgent" ? "badge-danger" : t.priority === "High" ? "badge-warning" : "badge-neutral"} text-xs">${t.priority}</span>
                        </div>
                        <div class="kanban-card-title">${Utils.escapeHtml(t.title)}</div>
                        <div style="font-size:11px; color:var(--color-text-secondary); margin-bottom:6px;">${Utils.escapeHtml(t.projectName)}</div>
                        ${Utils.renderProgressBar(t.completion)}
                        <div class="kanban-card-meta">
                          <span>${Utils.escapeHtml(t.assignedName)}</span>
                          <span>Due ${Utils.formatDate(t.dueDate)}</span>
                        </div>
                      </div>
                    `;
                        })
                        .join("")
                }
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    // Interactive cycle status on click
    mount.querySelectorAll(".kanban-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const t = tasks.find((x) => x.id === id);
        if (!t) return;

        const nextStatusMap = {
          "To Do": "In Progress",
          "In Progress": "Completed",
          "Completed": "To Do",
          "On Hold": "In Progress"
        };
        const next = nextStatusMap[t.status] || "To Do";
        AppState.updateTaskStatus(id, next);
        Toast.info(`Task ${id} moved to: ${next}`);
        render();
      });
    });
  }

  function renderList(mount, tasks) {
    new DataTable({
      container: mount,
      columns: [
        {
          key: "id",
          label: "Task ID",
          width: "100px",
          render: (val) => `<span class="font-mono text-xs font-semibold text-primary-color">${val}</span>`
        },
        {
          key: "title",
          label: "Task Title & Scope",
          render: (val, row) => `
            <div>
              <div class="font-medium text-sm">${Utils.escapeHtml(val)}</div>
              <div class="text-xs text-muted">${Utils.escapeHtml(row.projectName)}</div>
            </div>
          `
        },
        { key: "assignedName", label: "Assigned To" },
        {
          key: "priority",
          label: "Priority",
          render: (val) => `<span class="badge ${val === "Urgent" ? "badge-danger" : val === "High" ? "badge-warning" : "badge-neutral"}">${val}</span>`
        },
        {
          key: "dueDate",
          label: "Due Date",
          render: (val) => `<span class="text-xs">${Utils.formatDate(val)}</span>`
        },
        {
          key: "completion",
          label: "Completion",
          width: "140px",
          render: (val) => Utils.renderProgressBar(val)
        },
        {
          key: "status",
          label: "Status",
          render: (val) => Utils.renderStatusBadge(val)
        }
      ],
      data: tasks,
      searchFields: ["title", "projectName", "assignedName", "id"]
    });
  }

  function renderCalendar(mount, tasks) {
    mount.innerHTML = `
      <div class="card" style="padding:var(--space-5);">
        <div class="card-header" style="border:none; padding:0 0 var(--space-4);">
          <h3 class="card-title">Construction Milestone Timeline (November &mdash; December 2026)</h3>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${tasks
            .map((t) => {
              return `
            <div style="display:flex; align-items:center; gap:16px; padding:10px 14px; background:var(--color-bg-subtle); border-radius:var(--radius-md);">
              <div style="width:140px; font-size:12px; font-weight:600; color:var(--color-primary);">${Utils.formatDate(t.dueDate)}</div>
              <div style="flex:1;">
                <div style="font-weight:600; font-size:13px;">${Utils.escapeHtml(t.title)}</div>
                <div style="font-size:11px; color:var(--color-text-secondary);">${Utils.escapeHtml(t.projectName)} &bull; Assigned: ${Utils.escapeHtml(t.assignedName)}</div>
              </div>
              <div style="width:120px;">${Utils.renderProgressBar(t.completion)}</div>
              <div>${Utils.renderStatusBadge(t.status)}</div>
            </div>
          `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function openTaskForm() {
    const prjOptions = projects.map((p) => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");
    const empOptions = employees.map((e) => `<option value="${e.name}">${e.name} (${e.designation})</option>`).join("");

    Modal.open({
      title: "Schedule New Construction Task",
      content: `
        <form id="new-task-form">
          <div class="form-group">
            <label class="form-label required">Select Project</label>
            <select class="form-control" name="projectId" required>${prjOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label required">Task Title</label>
            <input type="text" class="form-control" name="title" value="Roof Truss Installation & Tile Fixing" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Assigned Employee</label>
              <select class="form-control" name="assignedName" required>${empOptions}</select>
            </div>
            <div class="form-group">
              <label class="form-label required">Priority</label>
              <select class="form-control" name="priority" required>
                <option value="Normal">Normal</option>
                <option value="High" selected>High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label required">Start Date</label>
              <input type="date" class="form-control" name="startDate" value="${new Date().toISOString().split("T")[0]}" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Target Due Date</label>
              <input type="date" class="form-control" name="dueDate" value="2026-11-25" required />
            </div>
          </div>
        </form>
      `,
      size: "md",
      footer: `
        <button type="button" class="btn btn-secondary" onclick="Modal.close();">Cancel</button>
        <button type="button" class="btn btn-primary" id="save-task-btn">Add Task</button>
      `
    });

    document.getElementById("save-task-btn")?.addEventListener("click", () => {
      const form = document.getElementById("new-task-form");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const prjId = formData.get("projectId");
      const matchedPrj = projects.find((p) => p.id === prjId);

      AppState.addTask({
        projectId: prjId,
        projectName: matchedPrj ? matchedPrj.name : "Prefab Project",
        title: formData.get("title"),
        assignedName: formData.get("assignedName"),
        priority: formData.get("priority"),
        startDate: formData.get("startDate"),
        dueDate: formData.get("dueDate"),
        status: "To Do",
        completion: 0
      });

      Toast.success("New task scheduled.");
      Modal.close();
      render();
    });
  }

  render();
};

window.ModulePlanning = ModulePlanning;

