"use client";

import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User, Phone, Mail, MapPin, Search } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { Customer } from "@/lib/api/types";
import { opsStorage } from "@/lib/api/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
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

export default function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Admin state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "", phone: "" });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_URL}/user/all`);
      const data = await response.json();
      if (data.success) {
        const formattedUsers = data.users.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          city: "Unknown",
          role: u.role || 'user',
          createdAt: u.createdAt,
        }));
        setCustomers(formattedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    const handleUpdate = () => fetchUsers();
    window.addEventListener("prorido-storage-update", handleUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleUpdate);
  }, []);

  const handleAddAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await apiFetch(`${API_URL}/user/add-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Admin user created successfully");
        setIsSheetOpen(false);
        setAdminForm({ name: "", email: "", password: "", phone: "" });
        fetchUsers(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating admin");
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<Customer & { role?: string }>[] = [
    {
      accessorKey: "id",
      header: "Customer ID",
      cell: ({ row }) => <span className="font-mono font-bold text-xs">{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-sm text-foreground">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="font-mono">{row.original.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{row.original.email || "N/A"}</span>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-semibold capitalize border border-border">
          {row.original.role || "User"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.createdAt ? formatDate(row.original.createdAt) : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Users & Customers</span>
            <span className="text-xs font-normal font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted border">
              {customers.length} users
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage all registered users and customers in the system.
          </p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>Add Admin</Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers by name..."
        isLoading={isLoading}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Add New Admin</SheetTitle>
            <SheetDescription>
              Create a new administrator account with full access.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 pb-20">
            <div className="space-y-1">
              <label className="text-xs font-medium">Name *</label>
              <Input 
                value={adminForm.name} 
                onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))} 
                placeholder="Admin Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Email *</label>
              <Input 
                type="email"
                value={adminForm.email} 
                onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))} 
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Password * (Min 8 chars)</label>
              <Input 
                type="password"
                value={adminForm.password} 
                onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))} 
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Phone</label>
              <Input 
                value={adminForm.phone} 
                onChange={(e) => setAdminForm(prev => ({ ...prev, phone: e.target.value }))} 
                placeholder="+91..."
              />
            </div>

            <div className="fixed bottom-0 right-0 w-full sm:w-[448px] bg-background border-t p-4 flex justify-end gap-3 z-10">
              <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAdmin} disabled={isSaving}>
                {isSaving ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
