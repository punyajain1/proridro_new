import {
  Booking,
  Customer,
  Vendor,
  Driver,
  PricingRule,
  Invoice,
  ActivityLog,
  SystemSettings,
  SyncStatus,
  Lead,
  Submission,
  Payment,
} from "./types";
import {
  GlobalVehicle,
  VendorDocument,
  RouteData,
  TripSheet,
  Rating,
  InternalTask,
  CustomField,
} from "./types";

const STORAGE_KEYS = {
  BOOKINGS: "prorido_ops_bookings_v1",
  CUSTOMERS: "prorido_ops_customers_v1",
  VENDORS: "prorido_ops_vendors_v1",
  DRIVERS: "prorido_ops_drivers_v1",
  PRICING: "prorido_ops_pricing_v1",
  INVOICES: "prorido_ops_invoices_v1",
  ACTIVITY: "prorido_ops_activity_v1",
  SETTINGS: "prorido_ops_settings_v1",
  SYNC: "prorido_ops_sync_v1",
  LEADS: "prorido_ops_leads_v1",
  VEHICLES: "prorido_ops_vehicles_v1",
  DOCUMENTS: "prorido_ops_documents_v1",
  ROUTES: "prorido_ops_routes_v1",
  TRIP_SHEETS: "prorido_ops_trip_sheets_v1",
  RATINGS: "prorido_ops_ratings_v1",
  TASKS: "prorido_ops_tasks_v1",
  CUSTOM_FIELDS: "prorido_ops_custom_fields_v1",
  SUBMISSIONS: "prorido_ops_submissions_v1",
  PAYMENTS: "prorido_ops_payments_v1",
};

// In-memory fallback for SSR / initial loads
let inMemoryStore = {
  bookings: [] as Booking[],
  customers: [] as Customer[],
  vendors: [] as Vendor[],
  drivers: [] as Driver[],
  pricingRules: [] as PricingRule[],
  invoices: [] as Invoice[],
  activity: [] as ActivityLog[],
  settings: {} as SystemSettings,
  sync: {} as SyncStatus,
  leads: [] as Lead[],
  vehicles: [] as GlobalVehicle[],
  documents: [] as VendorDocument[],
  routes: [] as RouteData[],
  tripSheets: [] as TripSheet[],
  ratings: [] as Rating[],
  tasks: [] as InternalTask[],
  customFields: [] as CustomField[],
  submissions: [] as Submission[],
  payments: [] as Payment[],
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getStoredData<T>(key: string, defaultVal: T): T {
  if (!isClient()) {
    return defaultVal;
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item) as T;
  } catch {
    return defaultVal;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (isClient()) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // Dispatch custom event for cross-component reactive updates
      window.dispatchEvent(new CustomEvent("prorido-storage-update", { detail: { key } }));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }
}

// Storage Accessors
export const opsStorage = {
  getBookings: (): Booking[] => {
    return getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, inMemoryStore.bookings);
  },
  saveBookings: (bookings: Booking[]) => {
    inMemoryStore.bookings = bookings;
    setStoredData(STORAGE_KEYS.BOOKINGS, bookings);
  },

  getLeads: (): Lead[] => {
    return getStoredData<Lead[]>(STORAGE_KEYS.LEADS, inMemoryStore.leads);
  },
  saveLeads: (leads: Lead[]) => {
    inMemoryStore.leads = leads;
    setStoredData(STORAGE_KEYS.LEADS, leads);
  },

  getCustomers: (): Customer[] => {
    return getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, inMemoryStore.customers);
  },
  saveCustomers: (customers: Customer[]) => {
    inMemoryStore.customers = customers;
    setStoredData(STORAGE_KEYS.CUSTOMERS, customers);
  },

  getVendors: (): Vendor[] => {
    return getStoredData<Vendor[]>(STORAGE_KEYS.VENDORS, inMemoryStore.vendors);
  },
  saveVendors: (vendors: Vendor[]) => {
    inMemoryStore.vendors = vendors;
    setStoredData(STORAGE_KEYS.VENDORS, vendors);
  },

  getDrivers: (): Driver[] => {
    return getStoredData<Driver[]>(STORAGE_KEYS.DRIVERS, inMemoryStore.drivers);
  },
  saveDrivers: (drivers: Driver[]) => {
    inMemoryStore.drivers = drivers;
    setStoredData(STORAGE_KEYS.DRIVERS, drivers);
  },

  getPricingRules: (): PricingRule[] => {
    return getStoredData<PricingRule[]>(STORAGE_KEYS.PRICING, inMemoryStore.pricingRules);
  },
  savePricingRules: (rules: PricingRule[]) => {
    inMemoryStore.pricingRules = rules;
    setStoredData(STORAGE_KEYS.PRICING, rules);
  },

  getInvoices: (): Invoice[] => {
    return getStoredData<Invoice[]>(STORAGE_KEYS.INVOICES, inMemoryStore.invoices);
  },
  saveInvoices: (invoices: Invoice[]) => {
    inMemoryStore.invoices = invoices;
    setStoredData(STORAGE_KEYS.INVOICES, invoices);
  },

  getActivityLogs: (): ActivityLog[] => {
    return getStoredData<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, inMemoryStore.activity);
  },
  addActivityLog: (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const logs = getStoredData<ActivityLog[]>(STORAGE_KEYS.ACTIVITY, inMemoryStore.activity);
    const newLog: ActivityLog = {
      ...log,
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    const updated = [newLog, ...logs.slice(0, 49)];
    inMemoryStore.activity = updated;
    setStoredData(STORAGE_KEYS.ACTIVITY, updated);
  },

  getSettings: (): SystemSettings => {
    return getStoredData<SystemSettings>(STORAGE_KEYS.SETTINGS, inMemoryStore.settings);
  },
  saveSettings: (settings: SystemSettings) => {
    inMemoryStore.settings = settings;
    setStoredData(STORAGE_KEYS.SETTINGS, settings);
  },

  getSyncStatus: (): SyncStatus => {
    return getStoredData<SyncStatus>(STORAGE_KEYS.SYNC, inMemoryStore.sync);
  },
  saveSyncStatus: (sync: SyncStatus) => {
    inMemoryStore.sync = sync;
    setStoredData(STORAGE_KEYS.SYNC, sync);
  },

  resetToDefaults: () => {
    if (isClient()) {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    }
    inMemoryStore = {
      bookings: [] as Booking[],
      customers: [] as Customer[],
      vendors: [] as Vendor[],
      drivers: [] as Driver[],
      pricingRules: [] as PricingRule[],
      invoices: [] as Invoice[],
      activity: [] as ActivityLog[],
      settings: {} as SystemSettings,
      sync: {} as SyncStatus,
      leads: [] as Lead[],
      vehicles: [] as GlobalVehicle[],
      documents: [] as VendorDocument[],
      routes: [] as RouteData[],
      tripSheets: [] as TripSheet[],
      ratings: [] as Rating[],
      tasks: [] as InternalTask[],
      customFields: [] as CustomField[],
      submissions: [] as Submission[],
      payments: [] as Payment[],
    };
  },
  
  getVehicles: (): GlobalVehicle[] => {
    return getStoredData<GlobalVehicle[]>(STORAGE_KEYS.VEHICLES, inMemoryStore.vehicles);
  },
  saveVehicles: (vehicles: GlobalVehicle[]) => {
    inMemoryStore.vehicles = vehicles;
    setStoredData(STORAGE_KEYS.VEHICLES, vehicles);
  },

  getDocuments: (): VendorDocument[] => {
    return getStoredData<VendorDocument[]>(STORAGE_KEYS.DOCUMENTS, inMemoryStore.documents);
  },
  saveDocuments: (documents: VendorDocument[]) => {
    inMemoryStore.documents = documents;
    setStoredData(STORAGE_KEYS.DOCUMENTS, documents);
  },

  getRoutes: (): RouteData[] => {
    return getStoredData<RouteData[]>(STORAGE_KEYS.ROUTES, inMemoryStore.routes);
  },
  saveRoutes: (routes: RouteData[]) => {
    inMemoryStore.routes = routes;
    setStoredData(STORAGE_KEYS.ROUTES, routes);
  },

  getTripSheets: (): TripSheet[] => {
    return getStoredData<TripSheet[]>(STORAGE_KEYS.TRIP_SHEETS, inMemoryStore.tripSheets);
  },
  saveTripSheets: (tripSheets: TripSheet[]) => {
    inMemoryStore.tripSheets = tripSheets;
    setStoredData(STORAGE_KEYS.TRIP_SHEETS, tripSheets);
  },

  getRatings: (): Rating[] => {
    return getStoredData<Rating[]>(STORAGE_KEYS.RATINGS, inMemoryStore.ratings);
  },
  saveRatings: (ratings: Rating[]) => {
    inMemoryStore.ratings = ratings;
    setStoredData(STORAGE_KEYS.RATINGS, ratings);
  },

  getTasks: (): InternalTask[] => {
    return getStoredData<InternalTask[]>(STORAGE_KEYS.TASKS, inMemoryStore.tasks);
  },
  saveTasks: (tasks: InternalTask[]) => {
    inMemoryStore.tasks = tasks;
    setStoredData(STORAGE_KEYS.TASKS, tasks);
  },

  getCustomFields: (): CustomField[] => {
    return getStoredData<CustomField[]>(STORAGE_KEYS.CUSTOM_FIELDS, inMemoryStore.customFields);
  },
  saveCustomFields: (fields: CustomField[]) => {
    inMemoryStore.customFields = fields;
    setStoredData(STORAGE_KEYS.CUSTOM_FIELDS, fields);
  },

  getSubmissions: (): Submission[] => {
    return getStoredData<Submission[]>(STORAGE_KEYS.SUBMISSIONS, inMemoryStore.submissions);
  },
  saveSubmissions: (submissions: Submission[]) => {
    inMemoryStore.submissions = submissions;
    setStoredData(STORAGE_KEYS.SUBMISSIONS, submissions);
  },

  getPayments: (): Payment[] => {
    return getStoredData<Payment[]>(STORAGE_KEYS.PAYMENTS, inMemoryStore.payments);
  },
  savePayments: (payments: Payment[]) => {
    inMemoryStore.payments = payments;
    setStoredData(STORAGE_KEYS.PAYMENTS, payments);
  },
};


