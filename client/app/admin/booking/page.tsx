"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Send,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  VehicleType,
  TripType,
  Vendor,
  Driver,
} from "@/lib/api/types";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  updatePaymentStatus,
} from "@/lib/api/booking";
import { opsStorage } from "@/lib/api/storage";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BookingsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading bookings operations...</div>}>
      <BookingsContent />
    </React.Suspense>
  );
}

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Assign Vendor Modal
  const [assignVendorBooking, setAssignVendorBooking] = useState<Booking | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState("");

  // Assign Driver Modal
  const [assignDriverBooking, setAssignDriverBooking] = useState<Booking | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const [auditTripSheetBooking, setAuditTripSheetBooking] = useState<Booking | null>(null);

  // Quick Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [vehicleFilter, setVehicleFilter] = useState<string>("ALL");
  const [tripTypeFilter, setTripTypeFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");

  // New Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickup: "",
    drop: "",
    travelDate: new Date().toISOString().substring(0, 10),
    travelTime: "06:00 AM",
    vehicleType: "Sedan" as VehicleType,
    tripType: "Airport Transfer" as TripType,
    amount: 1450,
    specialInstructions: "",
    paymentStatus: "Paid" as PaymentStatus,
    source: "Manual" as const,
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL Query Params
  useEffect(() => {
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    const filterParam = searchParams.get("filter");

    if (id) {
      const b = bookings.find((item) => item.id === id);
      if (b) {
        setSelectedBooking(b);
        setIsDetailsOpen(true);
        if (searchParams.get("assign") === "true") {
          setAssignVendorBooking(b);
        }
      }
    }
    if (action === "new") {
      setIsNewBookingOpen(true);
    }
    if (filterParam === "pending") {
      setStatusFilter("New");
    } else if (filterParam === "cancelled") {
      setStatusFilter("Cancelled");
    }
  }, [searchParams, bookings]);

  // Filtered dataset
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (vehicleFilter !== "ALL" && b.vehicleType !== vehicleFilter) return false;
      if (tripTypeFilter !== "ALL" && b.tripType !== tripTypeFilter) return false;
      if (sourceFilter !== "ALL" && b.source !== sourceFilter) return false;
      return true;
    });
  }, [bookings, statusFilter, vehicleFilter, tripTypeFilter, sourceFilter]);

  // Actions
  const handleAssignVendorSubmit = async () => {
    toast.error("Vendor assignment is not supported yet");
  };

  const handleAssignDriverSubmit = async () => {
    toast.error("Driver assignment is not supported yet");
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const updated = await updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking #${bookingId} marked as ${newStatus}`);
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(updated);
      }
    } catch (e: any) {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentStatusChange = async (bookingId: string, newStatus: any) => {
    try {
      const updated = await updatePaymentStatus(bookingId, newStatus);
      toast.success(`Payment for #${bookingId} marked as ${newStatus}`);
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(updated);
      }
    } catch (e: any) {
      toast.error("Failed to update payment status");
    }
  };

  const handleGenerateInvoice = async (booking: Booking) => {
    toast.error("Invoice generation is not supported yet");
  };

  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.customerName || !newBookingForm.pickup || !newBookingForm.drop) {
      toast.error("Please fill in required customer and trip details");
      return;
    }

    try {
      const created = await createBooking({
        source: newBookingForm.source,
        customer: {
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newBookingForm.customerName,
          phone: newBookingForm.customerPhone,
          email: newBookingForm.customerEmail,
        },
        pickup: newBookingForm.pickup,
        drop: newBookingForm.drop,
        travelDate: newBookingForm.travelDate,
        travelTime: newBookingForm.travelTime,
        vehicleType: newBookingForm.vehicleType,
        tripType: newBookingForm.tripType,
        status: "New",
        paymentStatus: newBookingForm.paymentStatus,
        vendor: null,
        driver: null,
        amount: Number(newBookingForm.amount),
        advancePaid: newBookingForm.paymentStatus === "Paid" ? Number(newBookingForm.amount) : 0,
        balanceDue: newBookingForm.paymentStatus === "Paid" ? 0 : Number(newBookingForm.amount),
        distanceKm: 45,
        extraCharges: 0,
        taxAmount: Math.round(Number(newBookingForm.amount) * 0.05),
        razorpayTxnId: newBookingForm.paymentStatus === "Paid" ? `pay_MANUAL_${Date.now().toString().slice(-6)}` : null,
        specialInstructions: newBookingForm.specialInstructions,
      });

      toast.success(`Booking #${created.id} created successfully!`);
      setIsNewBookingOpen(false);
      setSelectedBooking(created);
      setIsDetailsOpen(true);
    } catch (e: any) {
      toast.error("Failed to create booking");
    }
  };

  // Table Columns Definition
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => <span className="font-mono font-bold text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: "vehicleType",
      header: "Service",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground">{b.vehicleType || "Unknown"}</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">{b.transferType || "AIRPORT TRANSFER"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => {
        const c = row.original.customer;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground">{c?.name || "Unknown"}</span>
            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{c?.phone || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "pickup",
      header: "Route & Schedule",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex flex-col max-w-[250px]">
            <span className="text-sm font-bold text-foreground truncate" title={`${b.pickup} -> ${b.drop}`}>
              {b.pickup?.split(",")[0] || "Unknown"} → {b.drop?.split(",")[0] || "Unknown"}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {b.travelDate ? `${formatDate(b.travelDate)} ${b.travelTime ? `(${b.travelTime})` : ''}` : "Schedule TBD"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Total Fare",
      cell: ({ row }) => <span className="font-mono font-bold text-blue-600 text-sm">{formatCurrency(row.original.amount || 0)}</span>,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select value={b.paymentStatus} onValueChange={(val) => handlePaymentStatusChange(b.id, val)}>
              <SelectTrigger className="h-7 w-28 text-[11px] font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={b.status}
              onValueChange={(val) => handleStatusChange(b.id, val as BookingStatus)}
            >
              <SelectTrigger className="h-7 w-32 text-[11px] font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Trip Started">Trip Started</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <Button
            variant="secondary"
            size="sm"
            className="h-7 text-[11px] font-bold px-3"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(b);
              setIsDetailsOpen(true);
            }}
          >
            Details
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Booking Operations</span>
            <span className="text-xs font-normal font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted border">
              {filteredBookings.length} bookings
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage incoming leads, vendor assignments, driver dispatches, and real-time trip execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsNewBookingOpen(true)}
            className="h-8 text-xs bg-primary shadow-sm gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 flex-wrap bg-card border rounded-md p-2 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span className="font-semibold text-[11px] uppercase">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-7 w-[140px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Assigned">Assigned</SelectItem>
            <SelectItem value="Driver Assigned">Driver Assigned</SelectItem>
            <SelectItem value="Trip Started">Trip Started</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Vehicle Filter */}
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger className="h-7 w-[130px] text-xs">
            <SelectValue placeholder="Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Vehicles</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Innova Crysta">Innova Crysta</SelectItem>
            <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
            <SelectItem value="Luxury Sedan">Luxury Sedan</SelectItem>
          </SelectContent>
        </Select>

        {/* Trip Type Filter */}
        <Select value={tripTypeFilter} onValueChange={setTripTypeFilter}>
          <SelectTrigger className="h-7 w-[140px] text-xs">
            <SelectValue placeholder="Trip Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Trip Types</SelectItem>
            <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
            <SelectItem value="One Way">One Way</SelectItem>
            <SelectItem value="Round Trip">Round Trip</SelectItem>
            <SelectItem value="Local Package">Local Package</SelectItem>
            <SelectItem value="Outstation">Outstation</SelectItem>
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sources</SelectItem>
            <SelectItem value="Forminator">Forminator</SelectItem>
            <SelectItem value="WooCommerce">WooCommerce</SelectItem>
            <SelectItem value="Manual">Manual Ops</SelectItem>
          </SelectContent>
        </Select>

        {(statusFilter !== "ALL" ||
          vehicleFilter !== "ALL" ||
          tripTypeFilter !== "ALL" ||
          sourceFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("ALL");
                setVehicleFilter("ALL");
                setTripTypeFilter("ALL");
                setSourceFilter("ALL");
              }}
              className="h-7 text-xs text-rose-500 hover:text-rose-600 px-2"
            >
              Reset Filters
            </Button>
          )}
      </div>

      {/* Main TanStack DataTable */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        searchKey="id"
        searchPlaceholder="Search by ID or customer..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedBooking(row);
          setIsDetailsOpen(true);
        }}
        bulkActions={(selected) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={async () => {
                for (const b of selected) {
                  await updateBookingStatus(b.id, "Confirmed");
                }
                toast.success(`Confirmed ${selected.length} bookings`);
              }}
              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              Bulk Confirm
            </Button>
          </div>
        )}
      />

      {/* 1. Slide-over Booking Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto space-y-6">
          {selectedBooking && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-base font-bold font-mono">
                      {selectedBooking.id}
                    </SheetTitle>
                    <StatusBadge status={selectedBooking.source || ""} type="source" />
                  </div>
                  <Select
                    value={selectedBooking.status}
                    onValueChange={(val) => handleStatusChange(selectedBooking.id, val as BookingStatus)}
                  >
                    <SelectTrigger className={cn("h-7 w-32 text-xs font-bold rounded-full focus:ring-0 border", 
                      selectedBooking.status === "New" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      selectedBooking.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      (selectedBooking.status === "Assigned" || selectedBooking.status === "Driver Assigned") ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      selectedBooking.status === "Trip Started" ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" :
                      selectedBooking.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      selectedBooking.status === "Cancelled" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                      "bg-gray-500/10 text-gray-600 border-gray-500/20"
                    )}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
                      <SelectItem value="Confirmed" className="text-xs font-bold">Confirmed</SelectItem>
                      <SelectItem value="Assigned" className="text-xs font-bold">Assigned</SelectItem>
                      <SelectItem value="Driver Assigned" className="text-xs font-bold">Driver Assigned</SelectItem>
                      <SelectItem value="Trip Started" className="text-xs font-bold">Trip Started</SelectItem>
                      <SelectItem value="Completed" className="text-xs font-bold">Completed</SelectItem>
                      <SelectItem value="Cancelled" className="text-xs font-bold">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <SheetDescription>
                  Created on {formatDateTime(selectedBooking.createdAt || "")}
                </SheetDescription>
              </SheetHeader>

              {/* Quick Actions Row */}
              {/* <div className="flex items-center gap-2 flex-wrap p-3 rounded-md bg-muted/40 border">
              </div> */}

              <div className="space-y-4 pt-2">
                {/* Customer Information */}
                <div className="p-3.5 rounded-lg border bg-card space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-semibold text-foreground">{selectedBooking.customer?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-mono font-medium text-foreground">{selectedBooking.customer?.phone || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-mono text-foreground">{selectedBooking.customer?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-3.5 rounded-lg border bg-card space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Trip Specification
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-medium">Pickup Location:</span>
                      <span className="font-semibold text-foreground bg-muted/50 p-1.5 rounded border mt-0.5">
                        📍 {selectedBooking.pickup}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-medium">Drop Location:</span>
                      <span className="font-semibold text-foreground bg-muted/50 p-1.5 rounded border mt-0.5">
                        🏁 {selectedBooking.drop}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t">
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-semibold font-mono">{formatDate(selectedBooking.travelDate || "")}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <p className="font-semibold font-mono text-primary">{selectedBooking.travelTime}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>
                        <p className="font-semibold">{selectedBooking.vehicleType}</p>
                      </div>
                    </div>
                    {selectedBooking.specialInstructions && (
                      <div className="pt-2 border-t text-xs">
                        <span className="text-muted-foreground font-medium">Special Instructions:</span>
                        <p className="text-foreground bg-amber-500/10 border border-amber-500/20 p-2 rounded mt-1">
                          {selectedBooking.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle & Pricing Details */}
                <div className="p-3.5 rounded-lg border bg-card space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-primary" />
                    Vehicle & Pricing Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Car Name:</span>
                      <p className="font-semibold text-foreground">{selectedBooking.carName || selectedBooking.vehicleType || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trip Type:</span>
                      <p className="font-semibold text-foreground">{selectedBooking.transferType || selectedBooking.tripType || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Base Price:</span>
                      <p className="font-semibold text-foreground">{selectedBooking.basePrice !== undefined ? formatCurrency(selectedBooking.basePrice) : "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Amount:</span>
                      <p className="font-bold text-blue-600">{selectedBooking.totalAmount !== undefined ? formatCurrency(selectedBooking.totalAmount) : (selectedBooking.amount !== undefined ? formatCurrency(selectedBooking.amount) : "N/A")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Included:</span>
                      <p className="font-semibold text-foreground">
                        {selectedBooking.includedKm ? `${selectedBooking.includedKm} km` : "N/A"} / {selectedBooking.includedHours ? `${selectedBooking.includedHours} hrs` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Extra Rates:</span>
                      <p className="font-semibold text-foreground">
                        {selectedBooking.extraKmRate ? `${formatCurrency(selectedBooking.extraKmRate)}/km` : "N/A"} | {selectedBooking.extraHourRate ? `${formatCurrency(selectedBooking.extraHourRate)}/hr` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {(selectedBooking.airportName || selectedBooking.addons || selectedBooking.flightNumber) && (
                  <div className="p-3.5 rounded-lg border bg-card space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Additional Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {selectedBooking.airportName && (
                        <div className="col-span-1 sm:col-span-2">
                          <span className="text-muted-foreground">Airport Information:</span>
                          <p className="font-medium text-foreground bg-muted/50 p-1.5 rounded border mt-0.5">
                            {selectedBooking.airportName}, {selectedBooking.airportCity} 
                            {selectedBooking.airportTerminal ? ` (Terminal: ${selectedBooking.airportTerminal})` : ''}
                          </p>
                        </div>
                      )}
                      {selectedBooking.flightNumber && (
                        <div>
                          <span className="text-muted-foreground">Flight Number:</span>
                          <p className="font-semibold text-foreground">{selectedBooking.flightNumber}</p>
                        </div>
                      )}
                      {selectedBooking.addons && (
                        <div className="col-span-1 sm:col-span-2 border-t pt-2 mt-1">
                          <span className="text-muted-foreground font-medium mb-1 block">Requested Add-ons:</span>
                          <div className="flex gap-4">
                            {selectedBooking.addons.carDecorated === "Yes" && (
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-emerald-600">✓</span>
                                <span>Car Decoration</span>
                              </div>
                            )}
                            {selectedBooking.addons.petAccompanied === "Yes" && (
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-emerald-600">✓</span>
                                <span>Pet Accompanied</span>
                              </div>
                            )}
                            {selectedBooking.addons.carDecorated !== "Yes" && selectedBooking.addons.petAccompanied !== "Yes" && (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* 2. Assign Vendor Modal commented out */}
      {/* 
      <Dialog
        open={!!assignVendorBooking}
        onOpenChange={(open) => !open && setAssignVendorBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Vendor to #{assignVendorBooking?.id}</DialogTitle>
            <DialogDescription>
              Select an active fleet vendor for this {assignVendorBooking?.vehicleType} trip on{" "}
              {assignVendorBooking?.travelDate}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Vendor Partner</label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose vendor..." />
                </SelectTrigger>
                <SelectContent>
                  {vendors
                    .filter((v) => v.status === "Active")
                    .map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.city}) — Fleet: {v.fleetSize}, Rating: {v.rating}★
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted rounded-md text-xs space-y-1">
              <p className="font-medium text-foreground">Automated Action upon assignment:</p>
              <ul className="list-disc pl-4 text-muted-foreground space-y-0.5 text-[11px]">
                <li>Dispatches WhatsApp alert with trip details to vendor</li>
                <li>Updates master Google Sheet via n8n webhook</li>
                <li>Sets SLA timer for 15 minutes driver confirmation</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignVendorBooking(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssignVendorSubmit}
              disabled={!selectedVendorId}
              className="bg-primary"
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}

      {/* 3. Assign Driver Modal commented out */}
      {/* 
      <Dialog
        open={!!assignDriverBooking}
        onOpenChange={(open) => !open && setAssignDriverBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Driver to #{assignDriverBooking?.id}</DialogTitle>
            <DialogDescription>
              Assign available driver for {assignDriverBooking?.pickup} on {assignDriverBooking?.travelDate} {assignDriverBooking?.travelTime}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Select Driver</label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose driver..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.vehicleNumber}) — [{d.status}] {d.vendorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignDriverBooking(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAssignDriverSubmit}
              disabled={!selectedDriverId}
              className="bg-primary"
            >
              Confirm Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}

      {/* 4. Audit Trip Sheet Modal */}
      <Dialog
        open={!!auditTripSheetBooking}
        onOpenChange={(open) => !open && setAuditTripSheetBooking(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Audit Trip Sheet - #{auditTripSheetBooking?.id}</DialogTitle>
            <DialogDescription>
              Review closing kilometers and added tolls before finalizing vendor payout and customer invoice.
            </DialogDescription>
          </DialogHeader>

          {auditTripSheetBooking && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 bg-muted/40 rounded-lg border">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Opening KM</p>
                  <p className="font-mono text-sm font-medium">45,012</p>
                </div>
                <div className="space-y-1 p-3 bg-muted/40 rounded-lg border">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Closing KM</p>
                  <p className="font-mono text-sm font-medium text-emerald-600">45,180</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold">Additional Charges Recorded</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-2 text-sm border rounded-md">
                    <span className="text-muted-foreground">Tolls & Parking</span>
                    <span className="font-mono font-medium">₹350</span>
                  </div>
                  <div className="flex justify-between items-center p-2 text-sm border rounded-md">
                    <span className="text-muted-foreground">Driver Allowance</span>
                    <span className="font-mono font-medium">₹400</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuditTripSheetBooking(null)}
            >
              Reject & Query
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success("Trip sheet approved & logged.");
                setAuditTripSheetBooking(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Approve Trip Sheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. New Manual Booking Dialog */}
      <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Manual Booking</DialogTitle>
            <DialogDescription>
              Enter customer and trip details. Booking will be appended to Google Sheets via n8n.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBookingSubmit} className="space-y-4 py-2">
            {/* Customer Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">
                Customer Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Full Name *</label>
                  <Input
                    placeholder="e.g. Ramesh Reddy"
                    value={newBookingForm.customerName}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, customerName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Phone Number *</label>
                  <Input
                    placeholder="+91 98450 00000"
                    value={newBookingForm.customerPhone}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, customerPhone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-muted-foreground">Email Address</label>
                  <Input
                    placeholder="customer@domain.com"
                    type="email"
                    value={newBookingForm.customerEmail}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, customerEmail: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Trip Information */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">
                Trip Specification
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Pickup Address *</label>
                  <Input
                    placeholder="Kempegowda Airport, Hotel, or Landmark"
                    value={newBookingForm.pickup}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, pickup: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Drop Address *</label>
                  <Input
                    placeholder="Destination, Hotel, or Outstation City"
                    value={newBookingForm.drop}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, drop: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Travel Date *</label>
                    <Input
                      type="date"
                      value={newBookingForm.travelDate}
                      onChange={(e) =>
                        setNewBookingForm({ ...newBookingForm, travelDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Travel Time *</label>
                    <Input
                      placeholder="06:30 AM"
                      value={newBookingForm.travelTime}
                      onChange={(e) =>
                        setNewBookingForm({ ...newBookingForm, travelTime: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Vehicle Type</label>
                    <Select
                      value={newBookingForm.vehicleType}
                      onValueChange={(val: VehicleType) =>
                        setNewBookingForm({ ...newBookingForm, vehicleType: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Innova Crysta">Innova Crysta</SelectItem>
                        <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                        <SelectItem value="Luxury Sedan">Luxury Sedan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Trip Type</label>
                    <Select
                      value={newBookingForm.tripType}
                      onValueChange={(val: TripType) =>
                        setNewBookingForm({ ...newBookingForm, tripType: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                        <SelectItem value="One Way">One Way</SelectItem>
                        <SelectItem value="Round Trip">Round Trip</SelectItem>
                        <SelectItem value="Local Package">Local Package</SelectItem>
                        <SelectItem value="Outstation">Outstation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Quoted Amount (INR ₹) *</label>
                    <Input
                      type="number"
                      value={newBookingForm.amount}
                      onChange={(e) =>
                        setNewBookingForm({ ...newBookingForm, amount: Number(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Payment Status</label>
                    <Select
                      value={newBookingForm.paymentStatus}
                      onValueChange={(val: PaymentStatus) =>
                        setNewBookingForm({ ...newBookingForm, paymentStatus: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid (Full)</SelectItem>
                        <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                        <SelectItem value="Pending">Pending (Collect on drop)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">Special Instructions</label>
                  <Input
                    placeholder="e.g. Flight 6E-102, Name placard required, VIP luggage"
                    value={newBookingForm.specialInstructions}
                    onChange={(e) =>
                      setNewBookingForm({ ...newBookingForm, specialInstructions: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsNewBookingOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary">
                Create & Append to Sheets
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
