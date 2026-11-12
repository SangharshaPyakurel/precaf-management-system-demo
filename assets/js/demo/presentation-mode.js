/**
 * Himalayan Prefab Solutions ERP
 * Presentation Mode & Executive Walkthrough Controller
 */

var PresentationMode = {
  isActive: false,
  currentStepIndex: 0,

  steps: [
    {
      title: "1. Executive Dashboard & Enterprise Portfolio",
      desc: "Centralized KPI metrics: Active projects, total contract value, revenue collected in NPR, and inventory alerts.",
      route: "#dashboard",
      targetNav: "dashboard"
    },
    {
      title: "2. CRM & Client Accounts",
      desc: "Manage customer profiles, contract commitments, and payment balances (e.g. Er. Rameshwor Shrestha).",
      route: "#customers",
      targetNav: "customers"
    },
    {
      title: "3. Leads & Inquiries Pipeline",
      desc: "Track client inquiries by building type, area (sq ft), and convert leads directly into construction projects.",
      route: "#inquiries",
      targetNav: "inquiries"
    },
    {
      title: "4. Site Survey & Feasibility Feats",
      desc: "Geotechnical soil bearing verification (160 kN/m2), road clearance, and foundation readiness.",
      route: "#surveys",
      targetNav: "surveys"
    },
    {
      title: "5. Design & Engineering CAD Packages",
      desc: "Architectural blueprints, light gauge steel models, and NBC 105:2020 seismic compliance.",
      route: "#design",
      targetNav: "design"
    },
    {
      title: "6. BOQ & Cost Estimation Engine",
      desc: "Dynamic rate analysis calculating materials, fabrication labour, trailer transport, and 13% VAT.",
      route: "#estimation",
      targetNav: "estimation"
    },
    {
      title: "7. Commercial Proposals & Quotations",
      desc: "Branded commercial quotation with payment schedule, scope breakdown, and print export.",
      route: "#quotations",
      targetNav: "quotations"
    },
    {
      title: "8. Turnkey Construction Contracts",
      desc: "Executed contracts, milestone billing triggers, and 10-year structural defect warranties.",
      route: "#contracts",
      targetNav: "contracts"
    },
    {
      title: "9. Flagship Project Execution (15 Tabs)",
      desc: "Explore PRJ-001 (Budhanilkantha 2-Storey Residential Villa, NPR 45 Lakhs) with 15 real-time detail tabs.",
      route: "#projects/PRJ-001",
      targetNav: "projects"
    },
    {
      title: "10. Project Planning & Kanban Scheduling",
      desc: "Interactive Kanban board tracking survey, procurement, factory fabrication, and erection milestones.",
      route: "#planning",
      targetNav: "planning"
    },
    {
      title: "11. Factory Manufacturing & Production",
      desc: "Sitapaila Central Plant operations: Roll forming, frame riveting, and 9 configurable production stages.",
      route: "#production",
      targetNav: "production"
    },
    {
      title: "12. Quality Control & Compliance Audits",
      desc: "Rigorous quality check protocols: steel tolerances, weld penetration, and joint weatherproofing tests.",
      route: "#quality",
      targetNav: "quality"
    },
    {
      title: "13. Inventory & Raw Materials Warehouse",
      desc: "30 standardized SKUs, stock valuation, and automatic low-stock alerts.",
      route: "#inventory",
      targetNav: "inventory"
    },
    {
      title: "14. Procurement & Supplier PO Delivery",
      desc: "Automated workflow: Purchase Order release to delivery receipt that automatically increments stock.",
      route: "#procurement",
      targetNav: "procurement"
    },
    {
      title: "15. Field Site Management & Mobile Logs",
      desc: "Daily site logs submitted by field supervisors tracking active crew count, work finished, and materials consumed.",
      route: "#site-management",
      targetNav: "site-management"
    },
    {
      title: "16. Financial Billing, Payments & Profitability",
      desc: "Client milestone collections, site expenditures, and project profitability margins in NPR.",
      route: "#finance",
      targetNav: "finance"
    },
    {
      title: "17. Reports, Analytics & Executive Summary",
      desc: "Exportable CSV tables and print analytics proving business viability and manual labour reduction.",
      route: "#reports",
      targetNav: "reports"
    }
  ],

  start() {
    this.isActive = true;
    this.currentStepIndex = 0;
    const bar = document.getElementById("presentation-bar");
    if (bar) bar.classList.add("active");
    this.applyStep();
    Toast.success("Started Executive Guided Demo Mode.");
  },

  exit() {
    this.isActive = false;
    const bar = document.getElementById("presentation-bar");
    if (bar) bar.classList.remove("active");
    Toast.info("Exited Executive Demo Mode.");
  },

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.applyStep();
    } else {
      Toast.success("Completed all guided demo steps!");
      this.exit();
    }
  },

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.applyStep();
    }
  },

  applyStep() {
    const step = this.steps[this.currentStepIndex];
    if (!step) return;

    // Update banner UI
    const badge = document.getElementById("pres-step-badge");
    const title = document.getElementById("pres-step-title");
    const desc = document.getElementById("pres-step-desc");

    if (badge) badge.textContent = `Demo Step ${this.currentStepIndex + 1}/${this.steps.length}`;
    if (title) title.textContent = step.title;
    if (desc) desc.textContent = step.desc;

    // Navigate to route
    window.location.hash = step.route;
  },

  initControls() {
    document.getElementById("pres-next-btn")?.addEventListener("click", () => this.next());
    document.getElementById("pres-prev-btn")?.addEventListener("click", () => this.prev());
    document.getElementById("pres-exit-btn")?.addEventListener("click", () => this.exit());
  }
};

window.PresentationMode = PresentationMode;

