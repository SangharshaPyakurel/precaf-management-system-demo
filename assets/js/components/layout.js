/**
 * Himalayan Prefab Solutions ERP
 * Global Layout & Application Shell Component
 */

var Layout = {
  navigationItems: [
    {
      section: "Executive & Sales",
      items: [
        { id: "dashboard", label: "Executive Dashboard", icon: "dashboard", path: "#dashboard" },
        { id: "customers", label: "CRM & Customers", icon: "users", path: "#customers" },
        { id: "inquiries", label: "Leads & Inquiries", icon: "inbox", path: "#inquiries" }
      ]
    },
    {
      section: "Pre-Construction & Engineering",
      items: [
        { id: "surveys", label: "Site Survey", icon: "map-pin", path: "#surveys" },
        { id: "design", label: "Design & Engineering", icon: "compass", path: "#design" },
        { id: "estimation", label: "BOQ & Estimation", icon: "calculator", path: "#estimation" },
        { id: "quotations", label: "Quotations", icon: "file-text", path: "#quotations" },
        { id: "contracts", label: "Contracts", icon: "briefcase", path: "#contracts" }
      ]
    },
    {
      section: "Project & Operations",
      items: [
        { id: "projects", label: "Projects", icon: "layers", path: "#projects" },
        { id: "planning", label: "Project Planning", icon: "calendar", path: "#planning" },
        { id: "production", label: "Production / Factory", icon: "factory", path: "#production" },
        { id: "quality", label: "Quality Control", icon: "check-circle", path: "#quality" },
        { id: "inventory", label: "Inventory & Warehouse", icon: "package", path: "#inventory" },
        { id: "procurement", label: "Procurement", icon: "shopping-cart", path: "#procurement" },
        { id: "suppliers", label: "Suppliers", icon: "truck", path: "#suppliers" },
        { id: "logistics", label: "Transportation", icon: "truck", path: "#logistics" },
        { id: "site-management", label: "Site Management", icon: "hard-hat", path: "#site-management" }
      ]
    },
    {
      section: "Business & Management",
      items: [
        { id: "hr", label: "Workforce & HR", icon: "user-check", path: "#hr" },
        { id: "equipment", label: "Equipment & Machinery", icon: "tool", path: "#equipment" },
        { id: "finance", label: "Finance & Accounts", icon: "dollar-sign", path: "#finance" },
        { id: "documents", label: "Documents", icon: "folder", path: "#documents" },
        { id: "reports", label: "Reports & Analytics", icon: "bar-chart", path: "#reports" },
        { id: "notifications", label: "Notifications & Log", icon: "bell", path: "#notifications" },
        { id: "settings", label: "Settings", icon: "settings", path: "#settings" }
      ]
    }
  ],

  renderShell() {
    const container = document.getElementById("app-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Presentation Mode Top Walkthrough Banner -->
      <aside id="presentation-bar" aria-label="Demo Presentation Mode">
        <div class="presentation-step-info">
          <span class="presentation-step-badge" id="pres-step-badge">Demo Step 1/14</span>
          <span style="font-weight:600; font-size:13px;" id="pres-step-title">Executive Dashboard</span>
          <span style="color:#94A3B8; font-size:12px;" id="pres-step-desc">High-level enterprise KPI metrics and portfolio overview.</span>
        </div>
        <div class="presentation-controls">
          <button type="button" class="btn btn-secondary btn-sm" id="pres-prev-btn" style="background:#1E293B; color:#fff; border-color:#334155;">
            ${Utils.renderIcon("chevron-left", 14)} Previous
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="pres-next-btn">
            Next Step ${Utils.renderIcon("chevron-right", 14)}
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="pres-exit-btn" style="background:transparent; color:#94A3B8; border-color:transparent;">
            Exit Demo
          </button>
        </div>
      </aside>

      <!-- Sidebar -->
      <aside id="app-sidebar" aria-label="Main Navigation">
        <div class="sidebar-brand">
          <a href="#dashboard" class="brand-info">
            <div class="brand-logo-icon">
              ${Utils.renderIcon("factory", 18)}
            </div>
            <div class="brand-text">
              <span class="brand-name">Himalayan Prefab</span>
              <span class="brand-tagline">Construction ERP</span>
            </div>
          </a>
          <button type="button" class="sidebar-collapse-btn" id="sidebar-toggle-btn" title="Toggle Sidebar">
            ${Utils.renderIcon("menu", 16)}
          </button>
        </div>

        <nav class="sidebar-nav">
          ${this.renderNavSections()}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-footer-text">
            <span>Demo Data Mode</span>
          </div>
          <button type="button" id="sidebar-reset-btn" class="demo-badge" style="border:none; cursor:pointer;" title="Reset all demo records back to default">
            Reset Data
          </button>
        </div>
      </aside>

      <!-- Main Layout Wrapper -->
      <div id="app-main-wrapper">
        <!-- Topbar -->
        <header id="app-topbar">
          <div class="topbar-left">
            <button type="button" class="mobile-menu-toggle" id="mobile-toggle-btn" aria-label="Toggle mobile menu">
              ${Utils.renderIcon("menu", 20)}
            </button>
            <div class="topbar-search-container">
              <span class="topbar-search-icon">${Utils.renderIcon("search", 15)}</span>
              <input type="text" id="global-search-input" class="topbar-search-input" placeholder="Search projects, customers, inventory, invoices..." />
              <span class="topbar-search-shortcut">⌘K</span>
            </div>
          </div>

          <div class="topbar-right">
            <div class="financial-year-badge">
              ${Utils.renderIcon("calendar", 13)}
              <span>FY 2081/82</span>
            </div>

            <!-- Quick Create Dropdown -->
            <div style="position:relative;">
              <button type="button" class="btn btn-primary btn-sm" id="quick-create-btn">
                ${Utils.renderIcon("plus", 14)} Quick Create
              </button>
              <div class="dropdown-menu" id="quick-create-menu">
                <button type="button" class="dropdown-item" data-action="new-inquiry">
                  ${Utils.renderIcon("inbox", 14)} New Lead Inquiry
                </button>
                <button type="button" class="dropdown-item" data-action="new-customer">
                  ${Utils.renderIcon("users", 14)} New Customer
                </button>
                <button type="button" class="dropdown-item" data-action="new-project">
                  ${Utils.renderIcon("layers", 14)} New Project
                </button>
                <button type="button" class="dropdown-item" data-action="new-site-report">
                  ${Utils.renderIcon("hard-hat", 14)} Submit Site Report
                </button>
                <div class="dropdown-divider"></div>
                <button type="button" class="dropdown-item" data-action="new-po">
                  ${Utils.renderIcon("shopping-cart", 14)} New Purchase Order
                </button>
              </div>
            </div>

            <!-- Presentation Mode Switcher Button -->
            <button type="button" class="btn btn-secondary btn-sm" id="topbar-pres-btn" title="Start Guided Manager Demo Walkthrough">
              ${Utils.renderIcon("play", 13)} Demo Mode
            </button>

            <!-- Role Selector for Demo Simulation -->
            <div class="role-switcher-container">
              <select id="role-switcher-select" class="role-select" title="Switch User Role Simulation">
                <option value="Super Admin">Role: Super Admin</option>
                <option value="Project Manager">Role: Project Manager</option>
                <option value="Sales">Role: Sales Lead</option>
                <option value="Engineer">Role: Structural Engineer</option>
                <option value="Production Manager">Role: Factory Manager</option>
                <option value="Site Supervisor">Role: Site Supervisor</option>
                <option value="Storekeeper">Role: Storekeeper</option>
                <option value="Accountant">Role: Senior Accountant</option>
              </select>
            </div>

            <!-- Notifications Center Button -->
            <div style="position:relative;">
              <button type="button" class="topbar-btn" id="notif-btn" title="Notifications">
                ${Utils.renderIcon("bell", 18)}
                <span class="badge-dot" id="notif-dot"></span>
              </button>
              <div class="dropdown-menu" id="notif-menu" style="width:320px; right:0;">
                <div style="padding:10px 14px; border-bottom:1px solid var(--color-border); display:flex; justify-content:space-between; align-items:center;">
                  <strong style="font-size:12px;">Notifications</strong>
                  <a href="#notifications" style="font-size:11px;">View All</a>
                </div>
                <div id="topbar-notif-list" style="max-height:240px; overflow-y:auto;">
                  <!-- Dynamic notification items -->
                </div>
              </div>
            </div>

            <!-- Settings shortcut -->
            <a href="#settings" class="topbar-btn" title="System Settings">
              ${Utils.renderIcon("settings", 18)}
            </a>

            <!-- User Profile Avatar -->
            <div class="user-profile-btn" id="user-profile-btn">
              <div class="user-avatar" id="topbar-user-avatar">SA</div>
              <div class="user-info">
                <span class="user-name" id="topbar-user-name">Er. Sandesh Shrestha</span>
                <span class="user-role-text" id="topbar-user-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Dynamic Route View Container -->
        <main id="app-main-content">
          <!-- Views render here -->
        </main>

        <!-- Enterprise Footer -->
        <footer class="app-footer">
          <div>
            &copy; 2026 <strong>Himalayan Prefab Solutions Pvt. Ltd.</strong> &mdash; Kathmandu, Nepal. All rights reserved.
          </div>
          <div style="display:flex; gap:16px;">
            <span>Currency: NPR (Rs.)</span>
            <span>Version: 2.4.0 (Enterprise Demo)</span>
          </div>
        </footer>
      </div>
    `;

    this.attachShellEvents();
    this.updateNotificationPreview();
  },

  renderNavSections() {
    return this.navigationItems
      .map((sec) => {
        const items = sec.items
          .map((item) => {
            return `
            <li class="nav-item">
              <a href="${item.path}" class="nav-link" data-id="${item.id}" id="nav-item-${item.id}">
                <span class="nav-icon">${Utils.renderIcon(item.icon, 18)}</span>
                <span class="nav-text">${item.label}</span>
              </a>
            </li>
          `;
          })
          .join("");

        return `
          <div class="nav-section-title">${sec.section}</div>
          <ul class="nav-list">
            ${items}
          </ul>
        `;
      })
      .join("");
  },

  setActiveNav(moduleId) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    const target = document.getElementById(`nav-item-${moduleId}`);
    if (target) {
      target.classList.add("active");
    }
  },

  attachShellEvents() {
    // Sidebar collapse toggle
    const sidebarToggle = document.getElementById("sidebar-toggle-btn");
    const sidebar = document.getElementById("app-sidebar");
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobile-toggle-btn");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }

    // Reset Demo Data Confirmation
    const resetBtn = document.getElementById("sidebar-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        Modal.confirm({
          title: "Reset All Demo Data",
          message: "Are you sure you want to restore all projects, customers, inquiries, inventory, and financial records back to initial demo seeds? Any custom additions will be cleared.",
          confirmText: "Reset Demo Data",
          confirmVariant: "danger",
          onConfirm: () => {
            Storage.resetToSeedData();
            Toast.success("Demo database reset to factory state successfully.");
            setTimeout(() => {
              window.location.hash = "#dashboard";
              window.location.reload();
            }, 600);
          }
        });
      });
    }

    // Role switcher
    const roleSelect = document.getElementById("role-switcher-select");
    if (roleSelect) {
      roleSelect.value = AppState.getRole();
      roleSelect.addEventListener("change", (e) => {
        AppState.setRole(e.target.value);
        Toast.info(`Simulating view as: ${e.target.value}`);
        this.updateUserBadge(e.target.value);
      });
    }

    // Quick create dropdown toggle
    const quickCreateBtn = document.getElementById("quick-create-btn");
    const quickCreateMenu = document.getElementById("quick-create-menu");
    if (quickCreateBtn && quickCreateMenu) {
      quickCreateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        quickCreateMenu.classList.toggle("show");
      });
    }

    // Notifications dropdown toggle
    const notifBtn = document.getElementById("notif-btn");
    const notifMenu = document.getElementById("notif-menu");
    if (notifBtn && notifMenu) {
      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifMenu.classList.toggle("show");
      });
    }

    // Presentation mode button
    const presBtn = document.getElementById("topbar-pres-btn");
    if (presBtn) {
      presBtn.addEventListener("click", () => {
        if (window.PresentationMode) {
          window.PresentationMode.start();
        }
      });
    }

    // Close open dropdowns on outside click
    document.addEventListener("click", () => {
      if (quickCreateMenu) quickCreateMenu.classList.remove("show");
      if (notifMenu) notifMenu.classList.remove("show");
    });

    // Quick create actions handler
    if (quickCreateMenu) {
      quickCreateMenu.querySelectorAll(".dropdown-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const action = btn.getAttribute("data-action");
          if (action === "new-inquiry") window.location.hash = "#inquiries";
          else if (action === "new-customer") window.location.hash = "#customers";
          else if (action === "new-project") window.location.hash = "#projects";
          else if (action === "new-site-report") window.location.hash = "#site-management";
          else if (action === "new-po") window.location.hash = "#procurement";
        });
      });
    }

    // Global search input
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && searchInput.value.trim() !== "") {
          const q = searchInput.value.trim();
          window.location.hash = `#projects?search=${encodeURIComponent(q)}`;
        }
      });
    }

    // Global Command/Ctrl + K shortcut
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInput?.focus();
      }
    });

    // Reactive role update listener
    AppEvents.on("role:changed", ({ role }) => {
      if (roleSelect) roleSelect.value = role;
      this.updateUserBadge(role);
    });
  },

  updateUserBadge(role) {
    const avatar = document.getElementById("topbar-user-avatar");
    const nameEl = document.getElementById("topbar-user-name");
    const roleEl = document.getElementById("topbar-user-role");

    const roleMap = {
      "Super Admin": { name: "Er. Sandesh Shrestha", initials: "SS" },
      "Project Manager": { name: "Er. Prakash Adhikari", initials: "PA" },
      "Sales": { name: "Deepak Basnet", initials: "DB" },
      "Engineer": { name: "Er. Anupama Karki", initials: "AK" },
      "Production Manager": { name: "Manoj Maharjan", initials: "MM" },
      "Site Supervisor": { name: "Bishal Thapa", initials: "BT" },
      "Storekeeper": { name: "Nabin Giri", initials: "NG" },
      "Accountant": { name: "Prativa Poudel", initials: "PP" }
    };

    const user = roleMap[role] || { name: "Er. Sandesh Shrestha", initials: "SS" };
    if (avatar) avatar.textContent = user.initials;
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = role;
  },

  updateNotificationPreview() {
    const listEl = document.getElementById("topbar-notif-list");
    const dot = document.getElementById("notif-dot");
    if (!listEl) return;

    const notifs = AppState.getNotifications().slice(0, 5);
    const hasUnread = notifs.some((n) => !n.read);
    if (dot) dot.style.display = hasUnread ? "block" : "none";

    listEl.innerHTML = notifs
      .map((n) => {
        return `
        <div style="padding:8px 14px; border-bottom:1px solid #F1F5F9; font-size:12px; cursor:pointer;" onclick="window.location.hash='${n.link || "#notifications"}'">
          <div style="font-weight:600; color:${n.read ? "var(--color-text-primary)" : "var(--color-primary)"}; margin-bottom:2px;">
            ${Utils.escapeHtml(n.title)}
          </div>
          <div style="color:var(--color-text-secondary); font-size:11px; line-height:1.3;">
            ${Utils.escapeHtml(n.message)}
          </div>
          <div style="font-size:10px; color:var(--color-text-muted); margin-top:3px;">
            ${n.timestamp}
          </div>
        </div>
      `;
      })
      .join("");
  },

  /**
   * Helper to render consistent Page Header
   */
  renderPageHeader({ title, description = "", breadcrumb = [], actions = "" }) {
    const breadcrumbHtml = breadcrumb
      .map((b, idx) => {
        const isLast = idx === breadcrumb.length - 1;
        if (isLast) {
          return `<span>${Utils.escapeHtml(b.label)}</span>`;
        }
        return `
          <a href="${b.path}">${Utils.escapeHtml(b.label)}</a>
          <span class="breadcrumb-sep">/</span>
        `;
      })
      .join("");

    return `
      <div class="page-header">
        <div class="page-header-left">
          ${breadcrumb.length > 0 ? `<div class="breadcrumb">${breadcrumbHtml}</div>` : ""}
          <h1 class="page-title">${Utils.escapeHtml(title)}</h1>
          ${description ? `<p class="page-description">${Utils.escapeHtml(description)}</p>` : ""}
        </div>
        <div class="page-header-actions">
          ${actions}
        </div>
      </div>
    `;
  }
};

window.Layout = Layout;

