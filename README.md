# Himalayan Prefab Solutions ERP
## Enterprise Prefabricated Construction Management System — Complete Interactive Frontend Demo

---

### Executive Overview

**Himalayan Prefab Solutions Pvt. Ltd.** (`HPS`) is an enterprise prefabricated construction company headquartered in Kathmandu, Nepal, operating a central manufacturing and roll-forming plant in the Sitapaila Industrial Corridor. 

This application is an interactive, frontend-only ERP demo engineered to demonstrate how all aspects of a modern prefabricated building company—from initial client inquiry to factory manufacturing, site erection, and final warranty handover—can be unified in one centralized, high-efficiency software suite.

---

### 1. Key Business Rules & Flexibility

The system does not assume every prefab contractor owns a full manufacturing facility:
- **Configurable Production**: Supports **In-House Manufacturing** (roll-forming light gauge steel studs, cutting sandwich panels), **Supplier-Based Modular Assembly** (procuring pre-assembled pods), and **Hybrid Operations**.
- **Configurable Stages**: 9-stage manufacturing pipeline (Material Prep, Roll Forming, Frame Riveting, Panel Sizing, Insulation, Assembly, Finishing, QC Stamping, Packaging).
- **Dual Procurement Flow**: Supports both bulk raw materials (coils, panels, rockwool) and finished joinery components (UPVC double-glazed windows, security doors).
- **Geotechnical & Seismic Preparedness**: Compliant with Nepal National Building Code **NBC 105:2020** (Zone V seismic ductile detailing).
- **Nepali Currency & Localization**: Fully localized in Nepalese Rupees (**NPR / Rs.**) with South Asian numbering formatting (`Rs. 45,00,000`), local addresses (Budhanilkantha, Lakeside Pokhara, Kupondole, Biratnagar, Bharatpur, etc.), and local financial year nomenclature (**FY 2081/82**).

---

### 2. Architecture & Tech Stack

- **Frontend Core**: Semantic HTML5, Modular CSS3, Vanilla JavaScript (ES6+).
- **Typography**: Google Fonts **DM Sans** (weights 400, 500, 600) with monospace **JetBrains Mono** for financial/SKU tables.
- **Visual Design System**: Strict enterprise tokens, restrained border-radii (4px badges, 5px inputs/buttons, 6px cards, 8px modals), enterprise palette (`#202938`, `#667085`, `#F5F6F8`, `#2563EB`, `#15803D`, `#D97706`, `#DC2626`), and a 4px spacing scale. Zero AI-dashboard purple gradients or pill containers.
- **Persistence**: Centralized `localStorage` storage layer under namespace `hps_erp_` with automatic seed data initialization and one-click **Reset Demo Data**.
- **Charts**: Chart.js integration with robust, offline-resilient inline SVG fallbacks.
- **Icons**: 45+ Lucide-compatible standalone SVG icons bundled in `utils.js` ensuring guaranteed offline rendering without external icon font dependencies.
- **Client Router**: Hash-based Single-Page Application (SPA) router supporting deep links (e.g. `#projects/PRJ-001`, `#quotations`, `#planning`).

---

### 3. All 24 Modules Implemented

| # | Module | Core Functional Capabilities |
|---|---|---|
| **01** | **Executive Dashboard** | Active projects KPI, revenue collected, contract commitments, profit margins, low stock alerts, revenue bar charts, status donut charts. |
| **02** | **CRM & Customers** | Client directories, enterprise accounts, project histories, outstanding balances, Add/Edit modal, customer profile dossiers. |
| **03** | **Leads & Inquiries** | Pipeline tracker (New, Contacted, Site Visit, Quotation Prep, Negotiation, Converted), 1-click **Convert Inquiry to Project**. |
| **04** | **Site Survey** | Geotechnical soil bearing checks, road clearances for 10-wheeler flatbeds, plinth requirements, printable survey reports. |
| **05** | **Design & Engineering** | CAD blueprint sets (Architectural, Structural, Electrical, Plumbing), NBC 105:2020 seismic compliance, revision history. |
| **06** | **BOQ & Estimation** | Interactive spreadsheet calculating materials, labour, transport, crane machinery, overhead, 13% VAT, and grand totals. |
| **07** | **Quotations** | Commercial proposal generation, validity dates, payment milestone terms, branded quotation document print preview. |
| **08** | **Contracts** | Executed legal agreements, milestone billing triggers, 10-year structural warranty terms, contract document print layout. |
| **09** | **Projects** | Comprehensive portfolio view + **Full 15-Tab Workspace** (Overview, Timeline, Tasks, Team, Budget, Materials, Production, Procurement, Logistics, Site Progress, Quality, Documents, Issues, Payments, History). |
| **10** | **Project Planning** | Task scheduling with **Kanban Board** (drag/click status updates: To Do, In Progress, Completed), List view, and Timeline calendar. |
| **11** | **Production / Factory** | Sitapaila central plant scheduling, component batch tracking, and interactive 9-stage manufacturing pipeline controls. |
| **12** | **Quality Control** | QA inspection audits, dimensional tolerance checklists (+/- 1.5mm), weatherproofing tests, Passed/Failed logging. |
| **13** | **Inventory & Warehouse** | 30 standard SKUs, live stock valuation, minimum safety threshold alerts, and stock adjustment transaction modal. |
| **14** | **Procurement** | Purchase Orders flow; **Receive Delivery** action automatically updates warehouse available stock in real-time. |
| **15** | **Suppliers** | Vendor directories, quality ratings (1-5 stars), supplied materials, payment terms, and accounts payable balances. |
| **16** | **Transportation** | Logistics dispatch tracking, vehicle and driver manifests, route progress (Planned, In Transit, Delivered). |
| **17** | **Site Management** | Mobile-friendly field supervisor logging: daily manpower count, work completed, materials consumed, and site safety observations. |
| **18** | **Workforce & HR** | 15 corporate employees across executive, engineering, factory, site, and supply chain roles; **Interactive Role Switcher**. |
| **19** | **Equipment & Machinery** | 25T mobile cranes, prime mover flatbeds, diesel welding generators, and total station survey kits maintenance tracking. |
| **20** | **Finance & Accounts** | Milestone billing invoices, **Record Client Wire Payment** modal, project expense booking, cash flow, and project profit margins. |
| **21** | **Documents** | Technical blueprint repository, structural calculation reports, versioning, simulated upload, and document download. |
| **22** | **Reports & Analytics** | Dynamic analytics: Project progress, project profitability, lead conversion, and inventory valuation with CSV and print support. |
| **23** | **Notifications & Log** | Real-time system alerts (payments due, low stock warnings, site logs submitted), mark read/clear actions. |
| **24** | **Settings** | Corporate profile, PAN/VAT registration, Kathmandu plant address, production stages config, and **Reset Demo Data**. |

---

### 4. Interactive End-to-End Walkthrough Scenario

**Flagship Project**: Budhanilkantha 2-Storey Residential Prefab Villa (`PRJ-001`)  
**Client**: Er. Rameshwor Shrestha &bull; **Location**: Budhanilkantha-03, Kathmandu &bull; **Value**: NPR 45,00,000

Click **Demo Mode** on the topbar to launch the guided walkthrough:
1. **Executive Dashboard**: Review total active projects (8), revenue collected, and profit margins.
2. **CRM Customer**: Inspect Er. Rameshwor Shrestha's account (`CUST-001`).
3. **Inquiry**: Review Inquiry `INQ-001` converted into Project `PRJ-001`.
4. **Site Survey**: Inspect Survey `SRV-001` confirming red clay soil bearing capacity of 160 kN/m2.
5. **Design**: Review CAD Blueprint package `DSG-001` compliant with NBC 105:2020.
6. **BOQ & Estimation**: Open interactive BOQ showing light gauge steel, EPS panels, PUF roof, and VAT.
7. **Quotation**: Review commercial quotation `QUO-001` with milestone payment terms.
8. **Contract**: Review executed agreement `CON-001`.
9. **Project Workspace**: Open `PRJ-001` and navigate the 15 tabs (Overview, Timeline, Tasks, Team, Production, Site Logs, Quality).
10. **Planning**: Advance tasks on the Kanban board.
11. **Production**: Cycle fabrication stages for Line A on the factory floor.
12. **Quality Control**: Review inspection report `QC-004` verifying panel joint sealants.
13. **Inventory & Procurement**: Acknowledge Purchase Order `PO-001` receipt to automatically increment raw steel inventory.
14. **Logistics & Site**: Review dispatch `DSP-001` and daily site report `SIT-001` submitted by Bishal Thapa.
15. **Finance**: Record a client milestone wire payment of NPR 11,25,000.
16. **Reports & Analytics**: Export profitability and progress reports to CSV or print.

---

### 5. Running the Application

To run the application locally, start any simple HTTP server:

```bash
# Using Python 3 (Built-in)
python3 -m http.server 8080

# Or using Node http-server / npx
npx serve .
```

Open your browser at `http://localhost:8080`.

---

### 6. Production Migration Recommendations

When transitioning from this demo prototype to full production:
1. **Frontend**: Migrate vanilla components to **Next.js (App Router)** with **TypeScript** and **Tailwind CSS**, preserving the DM Sans enterprise design tokens.
2. **Backend**: Build a **Django REST Framework** API providing JWT authentication, role-based access control (RBAC), and transactional integrity.
3. **Database**: **PostgreSQL** with PostGIS for GIS survey plots and project site mapping.
4. **Async Jobs & Storage**: **Celery** with **Redis** for automated daily report digests and invoice generation; AWS S3 or MinIO for CAD drawings (`.dwg`, `.dxf`, `.pdf`).

