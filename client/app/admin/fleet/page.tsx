"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Car, Building2, BadgeCheck, AlertTriangle } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { GlobalVehicle } from "@/lib/api/types";
import { opsStorage } from "@/lib/api/storage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiFetch, API_URL } from "@/lib/api/fetcher";
import { formatCurrency } from "@/lib/utils";

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<GlobalVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sheet state
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_URL}/booking-data`);
      const data = await response.json();
      if (data.fleet) {
        // Map backend Car model to frontend GlobalVehicle interface
        const formattedVehicles = data.fleet.map((c: any) => ({
          id: c.id?.toString() || c._id,
          model: c.name,
          year: new Date(c.createdAt).getFullYear() || new Date().getFullYear(),
          category: c.category || "Sedan",
          plateNumber: "N/A", // Backend Car model doesn't have plateNumber
          vendorId: null,
          vendorName: null,
          status: "Active",
          raw: c,
        }));
        setVehicles(formattedVehicles);
      }
    } catch (error) {
      console.error("Failed to fetch fleet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const handleUpdate = () => loadData();
    window.addEventListener("prorido-storage-update", handleUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleUpdate);
  }, []);

  const columns: ColumnDef<GlobalVehicle>[] = [
    {
      accessorKey: "id",
      header: "Vehicle ID",
      cell: ({ row }) => <span className="font-mono font-bold text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: "model",
      header: "Model & Category",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            {row.original.model} ({row.original.year})
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
            {row.original.category}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "basePrice",
      header: "Starting Price",
      cell: ({ row }) => {
        const price = row.original.raw?.starting_from || 0;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(price)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex items-center gap-1.5">
            {status === "Active" && (
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
            )}
            {status === "Maintenance" && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            {status === "Retired" && (
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                status === "Active"
                  ? "text-emerald-600"
                  : status === "Maintenance"
                  ? "text-amber-600"
                  : "text-rose-600"
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
  ];

  const handleSaveCar = async () => {
    setIsSaving(true);
    try {
      const isNew = !editForm._id;
      const url = isNew 
        ? `${API_URL}/cars` 
        : `${API_URL}/cars/${editForm._id}`;
        
      const response = await apiFetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(isNew ? "Car added successfully" : "Car details updated successfully");
        setIsSheetOpen(false);
        loadData();
      } else {
        toast.error(data.error || "Failed to save car");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!editForm._id) return;
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    
    setIsSaving(true);
    try {
      const response = await apiFetch(`${API_URL}/cars/${editForm._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Car deleted successfully");
        setIsSheetOpen(false);
        loadData();
      } else {
        toast.error(data.error || "Failed to delete car");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any, isNumber = false) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: isNumber ? Number(value) : value,
    }));
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Fleet Management</span>
            <span className="text-xs font-normal font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted border">
              {vehicles.length} vehicles
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your fleet of vehicles including in-house and vendor cars.
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedCar(null);
            setEditForm({});
            setIsSheetOpen(true);
          }}
          className="h-9"
        >
          Add New Fleet
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vehicles}
        searchKey="model"
        searchPlaceholder="Search fleet by model..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedCar(row);
          if (row.raw) {
            setEditForm({ ...row.raw });
            setIsSheetOpen(true);
          } else {
            toast.error("Car details not found");
          }
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>{editForm._id ? "Edit Car Details" : "Add New Fleet"}</SheetTitle>
            <SheetDescription>
              {editForm._id ? `Update pricing and specifications for ${selectedCar?.model}.` : "Enter details for the new car to add to your fleet."}
            </SheetDescription>
          </SheetHeader>

          {editForm && (
            <div className="space-y-6 pb-20">
              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Name</label>
                    <Input value={editForm.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Brand</label>
                    <Input value={editForm.brand || ""} onChange={(e) => handleInputChange("brand", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Category</label>
                    <Input value={editForm.category || ""} onChange={(e) => handleInputChange("category", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Seating</label>
                    <Input value={editForm.seating || ""} onChange={(e) => handleInputChange("seating", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Luggage</label>
                    <Input value={editForm.luggage || ""} onChange={(e) => handleInputChange("luggage", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Starting From Price</label>
                    <Input type="number" value={editForm.starting_from || 0} onChange={(e) => handleInputChange("starting_from", e.target.value, true)} />
                  </div>
                </div>
              </div>

              {/* Airport Pricing */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">Airport Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Base Price</label>
                    <Input type="number" value={editForm.airport_base_price || 0} onChange={(e) => handleInputChange("airport_base_price", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Included KM</label>
                    <Input type="number" value={editForm.airport_included_km || 0} onChange={(e) => handleInputChange("airport_included_km", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Included Hours</label>
                    <Input type="number" value={editForm.airport_included_hours || 0} onChange={(e) => handleInputChange("airport_included_hours", e.target.value, true)} />
                  </div>
                </div>
              </div>

              {/* City Pricing */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">City Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">City Base Price 1 (4h/40km)</label>
                    <Input type="number" value={editForm.city_base_price_1 || 0} onChange={(e) => handleInputChange("city_base_price_1", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">City Base Price 2 (8h/80km)</label>
                    <Input type="number" value={editForm.city_base_price_2 || 0} onChange={(e) => handleInputChange("city_base_price_2", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">City Base Price 3 (12h/120km)</label>
                    <Input type="number" value={editForm.city_base_price_3 || 0} onChange={(e) => handleInputChange("city_base_price_3", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">City Full Day Price</label>
                    <Input type="number" value={editForm.city_full_day_price || 0} onChange={(e) => handleInputChange("city_full_day_price", e.target.value, true)} />
                  </div>
                </div>
              </div>

              {/* Outstation Pricing */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">Outstation Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Base Price</label>
                    <Input type="number" value={editForm.outstation_base_price || 0} onChange={(e) => handleInputChange("outstation_base_price", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Included KM</label>
                    <Input type="number" value={editForm.outstation_included_km || 0} onChange={(e) => handleInputChange("outstation_included_km", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Included Hours</label>
                    <Input type="number" value={editForm.outstation_included_hours || 0} onChange={(e) => handleInputChange("outstation_included_hours", e.target.value, true)} />
                  </div>
                </div>
              </div>

              {/* Extra Charges */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold border-b pb-2">Extra Charges</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Extra KM Rate</label>
                    <Input type="number" value={editForm.extra_km_rate || 0} onChange={(e) => handleInputChange("extra_km_rate", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Extra Hour Rate</label>
                    <Input type="number" value={editForm.extra_hour_rate || 0} onChange={(e) => handleInputChange("extra_hour_rate", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Driver Allowance (Day)</label>
                    <Input type="number" value={editForm.driver_allowance_day || 0} onChange={(e) => handleInputChange("driver_allowance_day", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Driver Allowance (Night)</label>
                    <Input type="number" value={editForm.driver_allowance_night || 0} onChange={(e) => handleInputChange("driver_allowance_night", e.target.value, true)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Waiting Per Hour</label>
                    <Input type="number" value={editForm.waiting_per_hour || 0} onChange={(e) => handleInputChange("waiting_per_hour", e.target.value, true)} />
                  </div>
                </div>
              </div>

              <div className="fixed bottom-0 right-0 w-full sm:w-[576px] md:w-[672px] bg-background border-t p-4 flex justify-between gap-3 z-10">
                <div>
                  {editForm._id && (
                    <Button variant="destructive" onClick={handleDeleteCar} disabled={isSaving}>
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveCar} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
