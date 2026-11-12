/**
 * Himalayan Prefab Solutions ERP
 * Centralized State Management & Business Workflow Logic
 */

var AppState = {
  // Current active role for UI demo simulation
  currentRole: "Super Admin",

  init() {
    Storage.init();
    this.currentRole = Storage.get("current_role", "Super Admin");
  },

  setRole(role) {
    this.currentRole = role;
    Storage.set("current_role", role);
    AppEvents.emit("role:changed", { role });
  },

  getRole() {
    return this.currentRole;
  },

  // Company
  getCompany() {
    return Storage.get("company", SEED_DATA.company);
  },

  updateCompany(data) {
    const company = { ...this.getCompany(), ...data };
    Storage.set("company", company);
    AppEvents.emit("company:updated", company);
    return company;
  },

  // Employees & Workforce
  getEmployees() {
    return Storage.get("employees", SEED_DATA.employees || []);
  },

  getEmployee(id) {
    return this.getEmployees().find((e) => e.id === id) || null;
  },

  // Customers
  getCustomers() {
    return Storage.get("customers", []);
  },

  getCustomer(id) {
    return this.getCustomers().find((c) => c.id === id) || null;
  },

  addCustomer(data) {
    const list = this.getCustomers();
    const newCust = {
      id: Utils.generateId("CUST", list),
      totalProjects: 0,
      totalContractValue: 0,
      paidAmount: 0,
      outstandingBalance: 0,
      status: "Active",
      createdDate: new Date().toISOString().split("T")[0],
      ...data
    };
    list.unshift(newCust);
    Storage.set("customers", list);
    AppEvents.emit("customer:created", newCust);
    return newCust;
  },

  updateCustomer(id, data) {
    const list = this.getCustomers();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      Storage.set("customers", list);
      AppEvents.emit("customer:updated", list[idx]);
      return list[idx];
    }
    return null;
  },

  deleteCustomer(id) {
    const list = this.getCustomers().filter((c) => c.id !== id);
    Storage.set("customers", list);
    AppEvents.emit("customer:deleted", { id });
  },

  // Inquiries
  getInquiries() {
    return Storage.get("inquiries", []);
  },

  getInquiry(id) {
    return this.getInquiries().find((i) => i.id === id) || null;
  },

  addInquiry(data) {
    const list = this.getInquiries();
    const newInq = {
      id: Utils.generateId("INQ", list),
      status: "New",
      createdDate: new Date().toISOString().split("T")[0],
      ...data
    };
    list.unshift(newInq);
    Storage.set("inquiries", list);
    AppEvents.emit("inquiry:created", newInq);
    return newInq;
  },

  updateInquiry(id, data) {
    const list = this.getInquiries();
    const idx = list.findIndex((i) => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      Storage.set("inquiries", list);
      AppEvents.emit("inquiry:updated", list[idx]);
      return list[idx];
    }
    return null;
  },

  convertInquiryToProject(inquiryId) {
    const inq = this.getInquiry(inquiryId);
    if (!inq) return null;

    const projects = this.getProjects();
    const newPrjId = Utils.generateId("PRJ", projects);
    const newProject = {
      id: newPrjId,
      name: `${inq.buildingType} (${inq.location.split(",")[0]})`,
      customerId: inq.customerId,
      customerName: inq.customerName,
      inquiryId: inq.id,
      contractId: null,
      quotationId: null,
      buildingType: inq.buildingType,
      location: inq.location,
      contractValue: Number(inq.estimatedBudget) || 3000000,
      paidAmount: 0,
      outstandingAmount: Number(inq.estimatedBudget) || 3000000,
      estimatedCost: Math.round((Number(inq.estimatedBudget) || 3000000) * 0.75),
      actualCost: 0,
      estimatedProfit: Math.round((Number(inq.estimatedBudget) || 3000000) * 0.25),
      projectManagerId: "EMP-002",
      projectManagerName: "Er. Prakash Adhikari",
      siteSupervisorId: "EMP-006",
      siteSupervisorName: "Bishal Thapa",
      startDate: new Date().toISOString().split("T")[0],
      expectedCompletion: inq.expectedCompletion,
      actualCompletion: null,
      progress: 5,
      status: "Planning & Design",
      health: "On Track",
      areaSqFt: inq.areaSqFt,
      floors: inq.floors,
      productionModel: "In-House Manufacturing",
      description: `Converted from Inquiry ${inq.id}. ${inq.notes || ""}`
    };

    projects.unshift(newProject);
    Storage.set("projects", projects);

    // Update Inquiry status
    this.updateInquiry(inquiryId, { status: "Converted", projectId: newPrjId });

    // Update Customer project count
    const customer = this.getCustomer(inq.customerId);
    if (customer) {
      this.updateCustomer(inq.customerId, {
        totalProjects: (customer.totalProjects || 0) + 1,
        totalContractValue: (customer.totalContractValue || 0) + newProject.contractValue,
        outstandingBalance: (customer.outstandingBalance || 0) + newProject.contractValue
      });
    }

    // Add initial task
    this.addTask({
      projectId: newPrjId,
      projectName: newProject.name,
      title: "Kickoff Site Survey & Architectural Draft",
      description: "Initial client meeting and boundary validation.",
      assignedTo: "EMP-008",
      assignedName: "Er. Anupama Karki",
      priority: "High",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: inq.expectedCompletion,
      status: "To Do",
      completion: 0
    });

    // Add notification
    this.addNotification({
      title: "Inquiry Converted to Project",
      message: `Inquiry ${inq.id} was successfully converted to Project ${newPrjId} (${newProject.name}).`,
      category: "Project",
      priority: "High",
      link: `#projects`
    });

    AppEvents.emit("project:created", newProject);
    return newProject;
  },

  // Projects
  getProjects() {
    return Storage.get("projects", []);
  },

  getProject(id) {
    return this.getProjects().find((p) => p.id === id) || null;
  },

  addProject(data) {
    const list = this.getProjects();
    const newPrj = {
      id: Utils.generateId("PRJ", list),
      progress: 0,
      status: "Planning & Design",
      health: "On Track",
      paidAmount: 0,
      actualCost: 0,
      ...data
    };
    newPrj.outstandingAmount = (Number(newPrj.contractValue) || 0) - (Number(newPrj.paidAmount) || 0);
    list.unshift(newPrj);
    Storage.set("projects", list);
    AppEvents.emit("project:created", newPrj);
    return newPrj;
  },

  updateProject(id, data) {
    const list = this.getProjects();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      if (list[idx].contractValue !== undefined && list[idx].paidAmount !== undefined) {
        list[idx].outstandingAmount = Math.max(0, list[idx].contractValue - list[idx].paidAmount);
      }
      Storage.set("projects", list);
      AppEvents.emit("project:updated", list[idx]);
      return list[idx];
    }
    return null;
  },

  deleteProject(id) {
    const list = this.getProjects().filter((p) => p.id !== id);
    Storage.set("projects", list);
    AppEvents.emit("project:deleted", { id });
  },

  // Surveys
  getSurveys() {
    return Storage.get("surveys", []);
  },

  addSurvey(data) {
    const list = this.getSurveys();
    const newSrv = {
      id: Utils.generateId("SRV", list),
      surveyDate: new Date().toISOString().split("T")[0],
      status: "Approved",
      ...data
    };
    list.unshift(newSrv);
    Storage.set("surveys", list);
    AppEvents.emit("survey:created", newSrv);
    return newSrv;
  },

  // Quotations
  getQuotations() {
    return Storage.get("quotations", []);
  },

  getQuotation(id) {
    return this.getQuotations().find((q) => q.id === id) || null;
  },

  addQuotation(data) {
    const list = this.getQuotations();
    const newQuo = {
      id: Utils.generateId("QUO", list),
      createdDate: new Date().toISOString().split("T")[0],
      status: "Sent",
      ...data
    };
    list.unshift(newQuo);
    Storage.set("quotations", list);
    AppEvents.emit("quotation:created", newQuo);
    return newQuo;
  },

  acceptQuotation(id) {
    const quo = this.getQuotation(id);
    if (!quo) return null;
    const updated = this.updateQuotation(id, { status: "Accepted" });

    // Auto create or activate Contract
    const contracts = this.getContracts();
    const existingContract = contracts.find((c) => c.projectId === quo.projectId);
    if (!existingContract) {
      this.addContract({
        projectId: quo.projectId,
        projectName: quo.projectTitle,
        customerId: quo.customerId,
        customerName: quo.customerName,
        contractAmount: quo.grandTotal,
        advancePayment: Math.round(quo.grandTotal * 0.25),
        startDate: new Date().toISOString().split("T")[0],
        completionDate: quo.validityDate,
        warrantyPeriod: "10 Years Structural, 2 Years Finishes",
        approvalStatus: "Executed & Active",
        terms: quo.paymentTerms,
        milestones: [
          { name: "Advance on Signing", amount: Math.round(quo.grandTotal * 0.25), status: "Paid", date: new Date().toISOString().split("T")[0] },
          { name: "Frame & Panel Erection", amount: Math.round(quo.grandTotal * 0.35), status: "Due", date: quo.validityDate },
          { name: "Final Handover", amount: Math.round(quo.grandTotal * 0.4), status: "Pending", date: quo.validityDate }
        ]
      });
    }

    AppEvents.emit("quotation:accepted", updated);
    return updated;
  },

  updateQuotation(id, data) {
    const list = this.getQuotations();
    const idx = list.findIndex((q) => q.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      Storage.set("quotations", list);
      return list[idx];
    }
    return null;
  },

  // Contracts
  getContracts() {
    return Storage.get("contracts", []);
  },

  addContract(data) {
    const list = this.getContracts();
    const newCon = {
      id: Utils.generateId("CON", list),
      contractNumber: `HPS-CON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      signedDate: new Date().toISOString().split("T")[0],
      approvalStatus: "Executed & Active",
      ...data
    };
    list.unshift(newCon);
    Storage.set("contracts", list);
    AppEvents.emit("contract:created", newCon);
    return newCon;
  },

  // Production Orders & Stages
  getProductionOrders() {
    return Storage.get("productionOrders", []);
  },

  getProductionOrder(id) {
    return this.getProductionOrders().find((p) => p.id === id) || null;
  },

  addProductionOrder(data) {
    const list = this.getProductionOrders();
    const newOrd = {
      id: Utils.generateId("PRD", list),
      orderNumber: `PO-MFG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      progress: 0,
      status: "In Production",
      startDate: new Date().toISOString().split("T")[0],
      stages: [
        { id: "stg-1", name: "Material Preparation", status: "In Progress" },
        { id: "stg-2", name: "Steel Frame Fabrication", status: "Pending" },
        { id: "stg-3", name: "Panel Cutting & Sizing", status: "Pending" },
        { id: "stg-4", name: "Finishing & Detailing", status: "Pending" },
        { id: "stg-5", name: "Quality Inspection & Stamping", status: "Pending" },
        { id: "stg-6", name: "Packaging & Dispatch Ready", status: "Pending" }
      ],
      ...data
    };
    list.unshift(newOrd);
    Storage.set("productionOrders", list);
    AppEvents.emit("production:created", newOrd);
    return newOrd;
  },

  updateProductionStage(orderId, stageId, status) {
    const list = this.getProductionOrders();
    const ord = list.find((o) => o.id === orderId);
    if (!ord || !ord.stages) return null;

    const stg = ord.stages.find((s) => s.id === stageId);
    if (stg) {
      stg.status = status;
      // Recalculate overall progress
      const completedCount = ord.stages.filter((s) => s.status === "Completed").length;
      ord.progress = Math.round((completedCount / ord.stages.length) * 100);
      if (ord.progress === 100) {
        ord.status = "Completed";
        ord.actualCompletion = new Date().toISOString().split("T")[0];
      } else {
        ord.status = "In Production";
      }
      Storage.set("productionOrders", list);
      AppEvents.emit("production:stageUpdated", { order: ord, stage: stg });
      return ord;
    }
    return null;
  },

  // Inventory
  getInventory() {
    return Storage.get("inventory", []);
  },

  updateInventoryStock(sku, deltaQty, type = "adjustment", reference = "") {
    const list = this.getInventory();
    const item = list.find((i) => i.sku === sku);
    if (!item) return null;

    item.availableStock = Math.max(0, item.availableStock + deltaQty);
    item.stockValue = item.availableStock * item.unitCost;

    Storage.set("inventory", list);

    if (item.availableStock <= item.minStock) {
      this.addNotification({
        title: "Low Stock Alert: " + item.name,
        message: `${item.name} stock (${item.availableStock} ${item.unit}) is at or below minimum threshold (${item.minStock} ${item.unit}).`,
        category: "Inventory",
        priority: "High",
        link: "#inventory"
      });
    }

    AppEvents.emit("inventory:updated", { item, deltaQty, type, reference });
    return item;
  },

  // Purchase Orders (Procurement)
  getPurchaseOrders() {
    return Storage.get("purchaseOrders", []);
  },

  addPurchaseOrder(data) {
    const list = this.getPurchaseOrders();
    const newPO = {
      id: Utils.generateId("PO", list),
      poNumber: `HPS-PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString().split("T")[0],
      status: "Approved",
      paymentStatus: "Pending",
      ...data
    };
    list.unshift(newPO);
    Storage.set("purchaseOrders", list);
    AppEvents.emit("procurement:created", newPO);
    return newPO;
  },

  receivePurchaseOrder(poId) {
    const list = this.getPurchaseOrders();
    const po = list.find((p) => p.id === poId);
    if (!po) return null;

    po.status = "Delivered & Received";
    po.deliveryDate = new Date().toISOString().split("T")[0];

    // Automatically increase inventory stock for items received
    if (Array.isArray(po.items)) {
      po.items.forEach((item) => {
        if (item.sku) {
          this.updateInventoryStock(item.sku, item.qty, "Purchase Order Received", po.poNumber);
        }
      });
    }

    Storage.set("purchaseOrders", list);
    AppEvents.emit("procurement:received", po);
    return po;
  },

  // Site Management Reports
  getSiteReports() {
    return Storage.get("siteReports", []);
  },

  addSiteReport(data) {
    const list = this.getSiteReports();
    const newRpt = {
      id: Utils.generateId("SIT", list),
      reportDate: new Date().toISOString().split("T")[0],
      safetyObservations: "All PPE protocols adhered to on site.",
      ...data
    };
    list.unshift(newRpt);
    Storage.set("siteReports", list);

    // Update project progress if provided
    if (data.projectId && data.projectProgress) {
      this.updateProject(data.projectId, { progress: Number(data.projectProgress) });
    }

    this.addNotification({
      title: "New Daily Site Log: " + (data.projectName || "Site"),
      message: `Supervisor ${data.engineerName} reported ${data.workersPresent || 10} workers active on site today.`,
      category: "Site",
      priority: "Normal",
      link: "#site-management"
    });

    AppEvents.emit("siteReport:created", newRpt);
    return newRpt;
  },

  // Tasks & Planning
  getTasks() {
    return Storage.get("tasks", []);
  },

  addTask(data) {
    const list = this.getTasks();
    const newTsk = {
      id: Utils.generateId("TSK", list),
      status: "To Do",
      completion: 0,
      startDate: new Date().toISOString().split("T")[0],
      ...data
    };
    list.unshift(newTsk);
    Storage.set("tasks", list);
    AppEvents.emit("task:created", newTsk);
    return newTsk;
  },

  updateTaskStatus(taskId, status) {
    const list = this.getTasks();
    const tsk = list.find((t) => t.id === taskId);
    if (tsk) {
      tsk.status = status;
      if (status === "Completed") tsk.completion = 100;
      else if (status === "In Progress" && tsk.completion === 0) tsk.completion = 40;
      else if (status === "To Do") tsk.completion = 0;

      Storage.set("tasks", list);
      AppEvents.emit("task:updated", tsk);
      return tsk;
    }
    return null;
  },

  // Quality Control Inspections
  getInspections() {
    return Storage.get("inspections", []);
  },

  addInspection(data) {
    const list = this.getInspections();
    const newInsp = {
      id: Utils.generateId("QC", list),
      inspectionNumber: `QC-INS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      inspectionDate: new Date().toISOString().split("T")[0],
      result: "Passed",
      ...data
    };
    list.unshift(newInsp);
    Storage.set("inspections", list);
    AppEvents.emit("inspection:created", newInsp);
    return newInsp;
  },

  // Finance, Invoices & Payments
  getInvoicesAndPayments() {
    return Storage.get("invoicesAndPayments", []);
  },

  addInvoice(data) {
    const list = this.getInvoicesAndPayments();
    const newInv = {
      id: Utils.generateId("INV", list),
      invoiceNumber: `HPS-INV-2081-${Math.floor(100 + Math.random() * 900)}`,
      type: "Customer Invoice",
      issuedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      balance: data.amount,
      paidAmount: 0,
      ...data
    };
    list.unshift(newInv);
    Storage.set("invoicesAndPayments", list);
    AppEvents.emit("invoice:created", newInv);
    return newInv;
  },

  recordCustomerPayment(invoiceId, amount, paymentMethod = "Bank Wire", transactionRef = "") {
    const list = this.getInvoicesAndPayments();
    const inv = list.find((i) => i.id === invoiceId);
    if (!inv) return null;

    const payAmt = Number(amount) || 0;
    inv.paidAmount = (inv.paidAmount || 0) + payAmt;
    inv.balance = Math.max(0, inv.amount - inv.paidAmount);
    if (inv.balance === 0) {
      inv.status = "Paid";
    } else {
      inv.status = "Partially Paid";
    }
    inv.paymentMethod = paymentMethod;
    inv.transactionRef = transactionRef || `TXN-MAN-${Date.now().toString().slice(-6)}`;

    // Update Project record
    if (inv.projectId) {
      const prj = this.getProject(inv.projectId);
      if (prj) {
        this.updateProject(inv.projectId, {
          paidAmount: (prj.paidAmount || 0) + payAmt
        });
      }
    }

    // Update Customer record
    if (inv.customerId) {
      const cust = this.getCustomer(inv.customerId);
      if (cust) {
        this.updateCustomer(inv.customerId, {
          paidAmount: (cust.paidAmount || 0) + payAmt,
          outstandingBalance: Math.max(0, (cust.outstandingBalance || 0) - payAmt)
        });
      }
    }

    Storage.set("invoicesAndPayments", list);
    AppEvents.emit("payment:recorded", { invoice: inv, paymentAmount: payAmt });
    return inv;
  },

  addExpense(data) {
    const list = this.getInvoicesAndPayments();
    const newExp = {
      id: Utils.generateId("EXP", list),
      invoiceNumber: `HPS-EXP-2081-${Math.floor(100 + Math.random() * 900)}`,
      type: "Project Expense",
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
      ...data
    };
    list.unshift(newExp);
    Storage.set("invoicesAndPayments", list);

    // Update project actual cost
    if (data.projectId) {
      const prj = this.getProject(data.projectId);
      if (prj) {
        this.updateProject(data.projectId, {
          actualCost: (prj.actualCost || 0) + Number(data.amount || 0)
        });
      }
    }

    AppEvents.emit("expense:created", newExp);
    return newExp;
  },

  // Notifications
  getNotifications() {
    return Storage.get("notifications", []);
  },

  addNotification(data) {
    const list = this.getNotifications();
    const newNotif = {
      id: Utils.generateId("NOTIF", list),
      timestamp: "Just now",
      read: false,
      priority: "Normal",
      ...data
    };
    list.unshift(newNotif);
    Storage.set("notifications", list);
    AppEvents.emit("notification:new", newNotif);
    return newNotif;
  },

  markNotificationRead(id) {
    const list = this.getNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      Storage.set("notifications", list);
      AppEvents.emit("notification:read", notif);
    }
  },

  clearNotifications() {
    const list = this.getNotifications();
    list.forEach((n) => (n.read = true));
    Storage.set("notifications", list);
    AppEvents.emit("notification:cleared");
  },

  // Dynamic Metrics & Calculations
  getDashboardMetrics() {
    const projects = this.getProjects();
    const customers = this.getCustomers();
    const inquiries = this.getInquiries();
    const inventory = this.getInventory();
    const invoices = this.getInvoicesAndPayments();

    let totalContractValue = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalOutstanding = 0;
    let activeProjects = 0;
    let completedProjects = 0;

    projects.forEach((p) => {
      totalContractValue += Number(p.contractValue) || 0;
      totalRevenue += Number(p.paidAmount) || 0;
      totalOutstanding += Number(p.outstandingAmount) || 0;
      if (["Handed Over", "Completed"].includes(p.status)) {
        completedProjects++;
      } else {
        activeProjects++;
      }
    });

    invoices.forEach((inv) => {
      if (inv.type === "Project Expense") {
        totalExpenses += Number(inv.amount) || 0;
      }
    });

    const estimatedProfit = Math.max(0, totalContractValue * 0.22); // Consistent profit margin estimate
    const lowStockCount = inventory.filter((item) => item.availableStock <= item.minStock).length;

    return {
      activeProjects,
      completedProjects,
      totalCustomers: customers.length,
      totalInquiries: inquiries.length,
      totalContractValue,
      totalRevenue,
      totalExpenses,
      totalOutstanding,
      estimatedProfit,
      lowStockCount
    };
  }
};

window.AppState = AppState;

