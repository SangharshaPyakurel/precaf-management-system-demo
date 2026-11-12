/**
 * Himalayan Prefab Solutions ERP
 * High-Performance Enterprise Data Table Component
 */

var DataTable = class DataTable {
  constructor({
    container,
    columns = [],
    data = [],
    searchFields = [],
    itemsPerPage = 10,
    exportFilename = "export_data",
    onRowClick = null,
    emptyMessage = "No records found."
  }) {
    this.container = typeof container === "string" ? document.getElementById(container) : container;
    this.columns = columns;
    this.originalData = [...data];
    this.data = [...data];
    this.searchFields = searchFields;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.sortKey = null;
    this.sortOrder = "asc"; // 'asc' or 'desc'
    this.searchTerm = "";
    this.exportFilename = exportFilename;
    this.onRowClick = onRowClick;
    this.emptyMessage = emptyMessage;

    this.render();
  }

  updateData(newData) {
    this.originalData = [...newData];
    this.applyFiltersAndSort();
    this.render();
  }

  applyFiltersAndSort() {
    let filtered = [...this.originalData];

    // Search filter
    if (this.searchTerm.trim() !== "") {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((row) => {
        if (this.searchFields.length > 0) {
          return this.searchFields.some((field) => {
            const val = row[field];
            return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
          });
        } else {
          return Object.values(row).some((val) => {
            return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
          });
        }
      });
    }

    // Sort
    if (this.sortKey) {
      filtered.sort((a, b) => {
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return this.sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return this.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    this.data = filtered;
    this.totalPages = Math.max(1, Math.ceil(this.data.length / this.itemsPerPage));
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  setSort(key) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = key;
      this.sortOrder = "asc";
    }
    this.applyFiltersAndSort();
    this.render();
  }

  setSearch(term) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFiltersAndSort();
    this.render();
  }

  setPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.render();
  }

  render() {
    if (!this.container) return;

    this.applyFiltersAndSort();

    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedData = this.data.slice(startIdx, startIdx + this.itemsPerPage);

    // Build Table Header
    const ths = this.columns
      .map((col) => {
        const isSortable = col.sortable !== false;
        const isSorted = this.sortKey === col.key;
        const sortClass = isSorted ? (this.sortOrder === "asc" ? "sorted-asc" : "sorted-desc") : "";
        const alignStyle = col.align ? `text-align: ${col.align};` : "";
        const widthStyle = col.width ? `width: ${col.width};` : "";

        return `
          <th class="${isSortable ? "sortable" : ""} ${sortClass}" data-key="${col.key}" style="${alignStyle} ${widthStyle}">
            ${Utils.escapeHtml(col.label)}
            ${isSortable ? `<span class="sort-icon">${isSorted ? (this.sortOrder === "asc" ? "▲" : "▼") : "⇅"}</span>` : ""}
          </th>
        `;
      })
      .join("");

    // Build Table Rows
    let rowsHtml = "";
    if (paginatedData.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="${this.columns.length}" style="text-align:center; padding: 40px 20px; color: var(--color-text-secondary);">
            <div style="font-size: 14px; margin-bottom: 4px;">${this.emptyMessage}</div>
            <div style="font-size: 12px; color: var(--color-text-muted);">Try adjusting your search query or filters.</div>
          </td>
        </tr>
      `;
    } else {
      rowsHtml = paginatedData
        .map((row, idx) => {
          const cells = this.columns
            .map((col) => {
              const alignStyle = col.align ? `text-align: ${col.align};` : "";
              let rendered = "";

              if (typeof col.render === "function") {
                rendered = col.render(row[col.key], row, startIdx + idx);
              } else {
                rendered = Utils.escapeHtml(row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : "-");
              }

              return `<td style="${alignStyle}">${rendered}</td>`;
            })
            .join("");

          return `<tr data-id="${row.id || idx}" style="${this.onRowClick ? "cursor:pointer;" : ""}">${cells}</tr>`;
        })
        .join("");
    }

    // Pagination bar
    const startRecord = this.data.length === 0 ? 0 : startIdx + 1;
    const endRecord = Math.min(startIdx + this.itemsPerPage, this.data.length);

    this.container.innerHTML = `
      <div class="table-container">
        <table class="table-clean">
          <thead>
            <tr>${ths}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="table-pagination">
          <div>
            Showing <strong>${startRecord}</strong> to <strong>${endRecord}</strong> of <strong>${this.data.length}</strong> records
          </div>
          <div class="pagination-controls">
            <button type="button" class="page-btn prev-page-btn" ${this.currentPage <= 1 ? "disabled" : ""}>
              ${Utils.renderIcon("chevron-left", 14)}
            </button>
            <span style="padding: 0 8px; font-weight: 500;">Page ${this.currentPage} of ${this.totalPages}</span>
            <button type="button" class="page-btn next-page-btn" ${this.currentPage >= this.totalPages ? "disabled" : ""}>
              ${Utils.renderIcon("chevron-right", 14)}
            </button>
          </div>
        </div>
      </div>
    `;

    // Attach Header Sort Listeners
    this.container.querySelectorAll("th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-key");
        this.setSort(key);
      });
    });

    // Attach Pagination Listeners
    const prevBtn = this.container.querySelector(".prev-page-btn");
    const nextBtn = this.container.querySelector(".next-page-btn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.setPage(this.currentPage - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.setPage(this.currentPage + 1));
    }

    // Attach Row Click Listener
    if (typeof this.onRowClick === "function") {
      this.container.querySelectorAll("tbody tr").forEach((tr, idx) => {
        tr.addEventListener("click", (e) => {
          // Ignore if clicking on button or link inside row
          if (e.target.closest("button") || e.target.closest("a")) return;
          const rowData = paginatedData[idx];
          if (rowData) this.onRowClick(rowData);
        });
      });
    }
  }
}

window.DataTable = DataTable;

