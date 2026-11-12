/**
 * Himalayan Prefab Solutions ERP
 * LocalStorage Persistence & Management Layer
 */

const STORAGE_PREFIX = "hps_erp_";

var Storage = {
  /**
   * Initialize local storage with seed data if not already present
   */
  init() {
    try {
      const isInitialized = localStorage.getItem(STORAGE_PREFIX + "initialized");
      if (!isInitialized) {
        this.resetToSeedData(false);
      }
    } catch (e) {
      console.warn("LocalStorage access error:", e);
    }
  },

  /**
   * Reset all ERP data back to SEED_DATA
   * @param {boolean} notify - whether to dispatch an event
   */
  resetToSeedData(notify = true) {
    if (typeof window.SEED_DATA === "undefined") {
      console.error("SEED_DATA is not loaded.");
      return;
    }

    const collections = [
      "company",
      "customers",
      "inquiries",
      "projects",
      "suppliers",
      "inventory",
      "employees",
      "surveys",
      "designs",
      "quotations",
      "contracts",
      "productionOrders",
      "purchaseOrders",
      "tasks",
      "inspections",
      "siteReports",
      "dispatches",
      "invoicesAndPayments",
      "equipment",
      "documents",
      "notifications"
    ];

    collections.forEach((col) => {
      if (window.SEED_DATA[col]) {
        // Deep clone to ensure fresh copy
        const data = JSON.parse(JSON.stringify(window.SEED_DATA[col]));
        this.set(col, data);
      }
    });

    localStorage.setItem(STORAGE_PREFIX + "initialized", "true");
    localStorage.setItem(STORAGE_PREFIX + "last_reset", new Date().toISOString());

    if (notify && window.AppEvents) {
      window.AppEvents.emit("data:reset", { timestamp: Date.now() });
    }
  },

  /**
   * Retrieve a collection from local storage
   */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  },

  /**
   * Store a collection or value
   */
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
      return false;
    }
  },

  /**
   * Remove a specific key
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
    }
  },

  /**
   * Export all ERP state as a JSON string for backup
   */
  exportAll() {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        backup[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(backup, null, 2);
  }
};

window.Storage = Storage;

