import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  BookingStatus,
  PaymentStatus,
  BookingSource,
  InvoiceStatus,
  Driver,
  Vendor,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status:
    | BookingStatus
    | PaymentStatus
    | BookingSource
    | InvoiceStatus
    | Driver["status"]
    | Vendor["status"]
    | string;
  type?: "booking" | "payment" | "source" | "invoice" | "driver" | "vendor" | "compliance";
  className?: string;
}

export function StatusBadge({ status, type = "booking", className }: StatusBadgeProps) {
  if (!status) return null;

  // Booking Status Badges
  if (type === "booking") {
    switch (status as BookingStatus) {
      case "New":
        return <Badge variant="outline" className={cn("border-amber-500/40 text-amber-600 dark:text-amber-400 font-medium", className)}>New</Badge>;
      case "Assigned":
        return <Badge variant="secondary" className={cn("text-purple-600 dark:text-purple-400 font-medium", className)}>Assigned</Badge>;
      case "Driver Assigned":
        return <Badge variant="secondary" className={cn("text-cyan-600 dark:text-cyan-400 font-medium", className)}>Driver Assigned</Badge>;
      case "Confirmed":
        return <Badge variant="secondary" className={cn("text-emerald-600 dark:text-emerald-400 font-medium", className)}>Confirmed</Badge>;
      case "Trip Started":
        return <Badge variant="secondary" className={cn("text-blue-600 dark:text-blue-400 font-medium", className)}>Trip Started</Badge>;
      case "Completed":
        return <Badge variant="secondary" className={cn("text-emerald-600 dark:text-emerald-400 font-medium", className)}>Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className={cn("font-medium", className)}>Cancelled</Badge>;
      default:
        return <Badge variant="outline" className={className}>{status}</Badge>;
    }
  }

  // Payment Status Badges
  if (type === "payment") {
    switch (status as PaymentStatus) {
      case "Paid":
        return <Badge variant="secondary" className={cn("text-emerald-600 dark:text-emerald-400 font-medium", className)}>Paid</Badge>;
      case "Partially Paid":
        return <Badge variant="outline" className={cn("text-amber-600 dark:text-amber-400 font-medium", className)}>Partial</Badge>;
      case "Pending":
        return <Badge variant="outline" className={cn("text-zinc-500 font-medium", className)}>Pending</Badge>;
      case "Refunded":
        return <Badge variant="outline" className={cn("text-purple-500 font-medium", className)}>Refunded</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className={cn("font-medium", className)}>Void</Badge>;
      default:
        return <Badge variant="outline" className={className}>{status}</Badge>;
    }
  }

  // Source Badges
  if (type === "source") {
    return (
      <span className={cn("inline-flex items-center text-[11px] font-mono text-muted-foreground", className)}>
        {status}
      </span>
    );
  }

  // Driver Status Badges
  if (type === "driver") {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case "Assigned":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Assigned
          </span>
        );
      case "On Trip":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            On Trip
          </span>
        );
      case "Offline":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            Offline
          </span>
        );
    }
  }

  // Vendor Status Badges
  if (type === "vendor") {
    switch (status) {
      case "Active":
        return <Badge variant="secondary" className={cn("text-emerald-600 dark:text-emerald-400", className)}>Active</Badge>;
      case "Suspended":
        return <Badge variant="destructive" className={className}>Suspended</Badge>;
      case "Onboarding":
        return <Badge variant="outline" className={className}>Onboarding</Badge>;
    }
  }

  // Invoice Status
  if (type === "invoice") {
    switch (status as InvoiceStatus) {
      case "Paid":
        return <Badge variant="secondary" className={cn("text-emerald-600 dark:text-emerald-400", className)}>Paid</Badge>;
      case "Pending":
        return <Badge variant="outline" className={cn("text-amber-600", className)}>Pending</Badge>;
      case "Draft":
        return <Badge variant="outline" className={className}>Draft</Badge>;
      case "Refunded":
        return <Badge variant="outline" className={className}>Refunded</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className={className}>Cancelled</Badge>;
    }
  }

  // Compliance
  if (type === "compliance") {
    switch (status) {
      case "Verified":
        return <Badge variant="secondary" className="text-[10px] py-0 text-emerald-600 dark:text-emerald-400">Verified</Badge>;
      case "Expiring Soon":
        return <Badge variant="outline" className="text-[10px] py-0 text-amber-600">Expiring</Badge>;
      case "Pending Review":
        return <Badge variant="destructive" className="text-[10px] py-0">Review</Badge>;
    }
  }

  return <Badge variant="outline" className={className}>{status}</Badge>;
}
