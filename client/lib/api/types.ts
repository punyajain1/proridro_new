export type BookingSource = "Forminator" | "WooCommerce" | "Manual";

export type BookingStatus =
  | "New"
  | "Confirmed"
  | "Assigned"
  | "Driver Assigned"
  | "Trip Started"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded" | "Partially Paid" | "Cancelled" | "Completed";
export type PaymentMethod = "Razorpay" | "Bank Transfer" | "Cash" | "UPI" | "Corporate Credit";

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

export type VehicleType =
  | "Sedan"
  | "SUV"
  | "Innova"
  | "Crysta"
  | "Carnival"
  | "Tempo Traveller"
  | "Innova Crysta"
  | "Luxury Sedan"
  | "Mini Bus"
  | "Hatchback"
  | "Luxury Vehicles";

export type TripType =
  | "Airport Transfer"
  | "One Way"
  | "Round Trip"
  | "Local Package"
  | "Outstation";

export interface TimelineEvent {
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status?: string;
}

export interface Booking {
  // Booking & Payment identifiers
  id: string;
  bookingId: string;
  paymentId: string;
  paymentStatus: string;
  status: string;

  // Car details
  carId: string;
  carName: string;
  carPrice: number;
  extraKmRate: number;
  extraHourRate: number;
  waitingCharges: number;
  includedKm: number;
  includedHours: number;
  carImage: string;

  // Airport details
  airportName: string;
  airportCity: string;
  airportTerminal: string;
  airportEntryFee: number;
  airportFreeWait: string;
  parkingCharges: number;
  toll: number;

  // Transfer & Address details
  transferType: string;
  dropAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupDate: string;
  pickupTime: string;

  // Customer details
  customerId?: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  flightNumber: string;
  bookingFor: string;

  // Add-ons
  addons: {
      carDecorated: string;
      petAccompanied: string;
  };

  // Pricing Breakdown
  basePrice: number;
  totalAmount: number;
  
  // Backward compatibility fields for UI
  vehicleType?: string;
  tripType?: string;
  pickup?: string;
  drop?: string;
  travelDate?: string;
  travelTime?: string;
  amount?: number;
  source?: string;
  customer?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  advancePaid?: number;
  balanceDue?: number;
  distanceKm?: number;
  extraCharges?: number;
  taxAmount?: number;
  razorpayTxnId?: string | null;
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: any[];

  vendor?: {
    id: string;
    name: string;
    phone: string;
    status: "Assigned" | "Accepted" | "Declined" | "Pending";
  } | null;
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleNumber: string;
    rating: number;
  } | null;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalBookings: number;
  totalRevenue: number;
  lastBookingDate: string;
  rating: number;
  notes: string;
  corporateAccount?: boolean;
  companyName?: string;
  gstin?: string;
  verificationStatus: "Verified" | "Unverified";
  createdAt: string;
}

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Quotation Sent" | "Negotiation" | "Converted" | "Lost";

export type LeadSource = "Website Forminator" | "WhatsApp" | "Walk-in" | "Referral" | "JustDial";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  serviceType?: TripType;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}


export interface VendorVehicle {
  id: string;
  model: string;
  category: VehicleType;
  plateNumber: string;
  status: "Available" | "Assigned" | "Maintenance";
}

export interface VendorDriver {
  id: string;
  name: string;
  phone: string;
  status: "Available" | "Assigned" | "On Trip" | "Offline";
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  fleetSize: number;
  activeTrips: number;
  rating: number;
  acceptanceRate: number;
  completionRate: number;
  revenueGenerated: number;
  status: "Active" | "Suspended" | "Onboarding";
  vehicles: VendorVehicle[];
  drivers: VendorDriver[];
  joinedDate: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicle: string;
  vehicleNumber: string;
  vendorId: string;
  vendorName: string;
  status: "Available" | "Assigned" | "On Trip" | "Offline";
  activeTripId: string | null;
  rating: number;
  totalTrips: number;
  acceptanceRate: number;
  onTimeRate: number;
  city: string;
  complianceStatus: "Verified" | "Expiring Soon" | "Pending Review";
  avatar?: string;
}

export interface PricingRule {
  id: string;
  name: string;
  tripType: TripType;
  vehicleType: VehicleType;
  baseFare: number;
  baseKm: number;
  perKmRate: number;
  extraKmRate: number;
  nightCharge: number;
  driverAllowance: number;
  tollTaxesIncluded: boolean;
  gstPercent: number;
  status: "Active" | "Inactive";
}

export interface PricingSimulationInput {
  pickup: string;
  drop: string;
  distanceKm: number;
  vehicleType: VehicleType;
  tripType: TripType;
  isNightTravel: boolean;
  daysCount?: number;
}

export interface PricingSimulationOutput {
  distanceKm: number;
  baseFare: number;
  baseKmIncluded: number;
  extraKm: number;
  extraKmCharges: number;
  driverAllowance: number;
  nightCharge: number;
  subtotal: number;
  gstPercent: number;
  taxAmount: number;
  finalPrice: number;
  ruleApplied: string;
}

export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Refunded" | "Cancelled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyGstin?: string;
  tripDetails: {
    pickup: string;
    drop: string;
    travelDate: string;
    vehicle: string;
    tripType: string;
    distanceKm: number;
  };
  items: InvoiceItem[];
  baseFare: number;
  extraKmCharges: number;
  driverAllowance: number;
  nightCharge: number;
  discount: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user?: string;
  action?: string;
  entity?: string;
  // Deprecated fields kept temporarily for backward compatibility
  type?: string;
  title?: string;
  description?: string;
  bookingId?: string;
  actor?: string;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt: string;
  status: "success" | "syncing" | "error";
  recordsProcessed: number;
  error?: string | null;
  syncLog: Array<{
    timestamp: string;
    source: "Google Sheets" | "n8n Webhook" | "Manual Refresh";
    records: number;
    status: "success" | "error";
  }>;
}

export interface SystemSettings {
  company: {
    name: string;
    gstin: string;
    pan: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  integrations: {
    n8nWebhookBaseUrl: string;
    googleSheetId: string;
    googleSheetName: string;
    wordPressApiUrl: string;
    wooCommerceKey: string;
    razorpayKeyId: string;
    forminatorWebhookActive: boolean;
    syncIntervalMinutes: number;
  };
  notifications: {
    emailBookingConfirmation: boolean;
    whatsappVendorDispatch: boolean;
    whatsappDriverDispatch: boolean;
    smsTripUpdates: boolean;
    emailInvoicePdf: boolean;
  };
  templates: {
    whatsappVendorMessage: string;
    whatsappDriverMessage: string;
    smsCustomerUpdate: string;
  };
  currentUserRole: "Admin" | "Operations" | "Finance" | "Vendor Manager" | "Support";
}

// ----------------------------------------------------------------------
// New Entities for Ground Truth Dashboard Coverage
// ----------------------------------------------------------------------

export type SubmissionStatus = "Pending" | "Converted to Lead" | "Converted to Booking" | "Archived";

export interface Submission {
  id: string;
  source: string;
  formType: string;
  createdAt: string;
  rawPayload: Record<string, any>;
  status: SubmissionStatus;
}

export interface GlobalVehicle {
  id: string;
  model: string;
  year: number;
  category: VehicleType;
  plateNumber: string;
  vendorId: string | null;
  vendorName: string | null;
  status: "Active" | "Maintenance" | "Retired";
  raw?: any;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  vendorName: string;
  type: "License" | "Insurance" | "Registration" | "Permit" | "Trip Sheet" | "Other";
  title: string;
  fileUrl: string;
  status: "Uploaded" | "Verified" | "Rejected";
  expiryDate?: string;
  uploadedAt: string;
}

export interface RouteData {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedHours: number;
  routeType: TripType;
  popular: boolean;
}

export interface TripSheet {
  id: string;
  bookingId: string;
  vendorId: string;
  openingKm: number;
  closingKm: number;
  openingTime: string;
  closingTime: string;
  tolls: number;
  parking: number;
  permit: number;
  driverAllowance: number;
  status: "Pending Submission" | "Submitted" | "Approved" | "Rejected";
}

export interface Rating {
  id: string;
  bookingId: string;
  targetId: string; // Customer ID or Driver/Vendor ID
  targetType: "Customer" | "Driver" | "Vendor";
  targetName: string;
  ratingValue: number; // 1-5
  feedback: string;
  createdAt: string;
}

export interface InternalTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  relatedEntity: "Booking" | "Lead" | "Vendor" | "Customer" | "None";
  entityId?: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

export interface CustomField {
  id: string;
  entity: "Lead" | "Booking" | "Customer" | "Vendor";
  fieldName: string;
  fieldType: "Text" | "Number" | "Date" | "Dropdown";
  options?: string[]; // Comma separated for Dropdown
  required: boolean;
}
