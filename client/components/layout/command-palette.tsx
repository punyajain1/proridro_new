"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Calendar,
  User,
  Users,
  Building2,
  Car,
  FileText,
  DollarSign,
  PlusCircle,
  BarChart3,
  Settings,
  RefreshCw,
  Search,
} from "lucide-react";
import { opsStorage } from "@/lib/api/storage";
import { triggerGoogleSheetsSync } from "@/lib/api/sync";
import { toast } from "sonner";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewBookingClick?: () => void;
}

export function CommandPalette({ open, onOpenChange, onNewBookingClick }: CommandPaletteProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState(opsStorage.getBookings());
  const [customers, setCustomers] = useState(opsStorage.getCustomers());
  const [vendors, setVendors] = useState(opsStorage.getVendors());
  const [drivers, setDrivers] = useState(opsStorage.getDrivers());
  const [invoices, setInvoices] = useState(opsStorage.getInvoices());

  useEffect(() => {
    if (open) {
      setBookings(opsStorage.getBookings());
      setCustomers(opsStorage.getCustomers());
      setVendors(opsStorage.getVendors());
      setDrivers(opsStorage.getDrivers());
      setInvoices(opsStorage.getInvoices());
    }
  }, [open]);

  // Global keydown listener for CMD+K / CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command, booking ID, customer, vendor, or invoice..." />
      <CommandList>
        <CommandEmpty>No operational results found.</CommandEmpty>

        {/* Quick Operations Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                if (onNewBookingClick) {
                  onNewBookingClick();
                } else {
                  router.push("/booking?action=new");
                }
              })
            }
          >
            <PlusCircle className="mr-2 h-4 w-4 text-primary" />
            <span>Create New Booking (Manual)</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(async () => {
                toast.info("Triggering Google Sheets Sync...");
                await triggerGoogleSheetsSync();
                toast.success("Synchronized with Google Sheets!");
              })
            }
          >
            <RefreshCw className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Sync Google Sheets via n8n</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/pricing?simulate=true");
              })
            }
          >
            <DollarSign className="mr-2 h-4 w-4 text-amber-500" />
            <span>Open Live Pricing Simulator</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/reports");
              })
            }
          >
            <BarChart3 className="mr-2 h-4 w-4 text-blue-500" />
            <span>View Performance Reports</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Operations Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Dashboard (Operations Control Center)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/booking"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Bookings Table</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/customer"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Customers List</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/vendor"))}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Vendors Directory</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/driver"))}>
            <Car className="mr-2 h-4 w-4" />
            <span>Drivers Fleet</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/pricing"))}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Pricing Engine</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/invoice"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Invoices & Billing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System & Integrations Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Bookings */}
        <CommandGroup heading="Recent Bookings">
          {bookings.slice(0, 5).map((b) => (
            <CommandItem
              key={b.id}
              value={`${b.id} ${b.customer?.name} ${b.pickup} ${b.drop} ${b.status}`}
              onSelect={() =>
                runCommand(() => {
                  router.push(`/booking?id=${b.id}`);
                })
              }
            >
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="font-mono font-medium">
                  {b.id} — {b.customer?.name} ({b.vehicleType})
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {b.pickup?.substring(0, 24)}... → {b.drop?.substring(0, 24)}... [{b.status}]
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Vendors */}
        <CommandGroup heading="Vendors">
          {vendors.slice(0, 4).map((v) => (
            <CommandItem
              key={v.id}
              value={`${v.id} ${v.name} ${v.city}`}
              onSelect={() =>
                runCommand(() => {
                  router.push(`/vendor?id=${v.id}`);
                })
              }
            >
              <Building2 className="mr-2 h-4 w-4 text-purple-500" />
              <span>
                {v.name} ({v.city}) — {v.fleetSize} vehicles, Rating {v.rating}★
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Drivers */}
        <CommandGroup heading="Drivers">
          {drivers.slice(0, 4).map((d) => (
            <CommandItem
              key={d.id}
              value={`${d.id} ${d.name} ${d.vehicleNumber} ${d.status}`}
              onSelect={() =>
                runCommand(() => {
                  router.push(`/driver?id=${d.id}`);
                })
              }
            >
              <Car className="mr-2 h-4 w-4 text-emerald-500" />
              <span>
                {d.name} ({d.vehicleNumber}) — [{d.status}] {d.vendorName}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
