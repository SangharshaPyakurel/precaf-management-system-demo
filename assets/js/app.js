/**
 * Himalayan Prefab Solutions ERP
 * Main Application Bootstrapper & Master Route Registry
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize State and LocalStorage
  AppState.init();

  // 2. Render Application Global Shell (Sidebar, Topbar, Presentation Bar)
  Layout.renderShell();

  // 3. Register All 24 Application Modules with the Client Router
  Router.register("dashboard", (container) => ModuleDashboard(container));
  Router.register("customers", (container, params) => ModuleCRM(container, params));
  Router.register("inquiries", (container) => ModuleInquiries(container));
  Router.register("surveys", (container) => ModuleSurveys(container));
  Router.register("design", (container) => ModuleDesign(container));
  Router.register("estimation", (container) => ModuleEstimation(container));
  Router.register("quotations", (container) => ModuleQuotations(container));
  Router.register("contracts", (container) => ModuleContracts(container));
  
  // Projects Routes (List + 15-Tab Workspace)
  Router.register("projects", (container, params) => ModuleProjects(container, params));
  Router.register("projects/:id", (container, params) => ModuleProjects(container, params));
  Router.register("projects/:id/:tab", (container, params) => ModuleProjects(container, params));

  Router.register("planning", (container) => ModulePlanning(container));
  Router.register("production", (container) => ModuleProduction(container));
  Router.register("quality", (container) => ModuleQuality(container));
  Router.register("inventory", (container) => ModuleInventory(container));
  Router.register("procurement", (container) => ModuleProcurement(container));
  Router.register("suppliers", (container) => ModuleSuppliers(container));
  Router.register("logistics", (container) => ModuleLogistics(container));
  Router.register("site-management", (container) => ModuleSiteManagement(container));
  Router.register("hr", (container) => ModuleHR(container));
  Router.register("equipment", (container) => ModuleEquipment(container));
  Router.register("finance", (container) => ModuleFinance(container));
  Router.register("documents", (container) => ModuleDocuments(container));
  Router.register("reports", (container) => ModuleReports(container));
  Router.register("notifications", (container) => ModuleNotifications(container));
  Router.register("settings", (container) => ModuleSettings(container));

  // 4. Initialize Presentation Mode Topbar Controls
  PresentationMode.initControls();

  // 5. Boot Router
  Router.init();

  console.log("Himalayan Prefab Solutions ERP 2.4.0 Initialized Successfully.");
});

