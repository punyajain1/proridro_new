"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { formatCurrency } from "@/lib/utils";
import { Booking, Lead, Payment } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, TrendingUp, CarFront, MapPin, Hash, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    setBookings(opsStorage.getBookings());
    setLeads(opsStorage.getLeads());
    setPayments(opsStorage.getPayments());
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("prorido-storage-update", handleUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleUpdate);
  }, []);

  if (!isMounted) return null;

  const today = new Date().toISOString().split("T")[0];
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);

  // --- REVENUE ---
  const revenueToday = payments.filter(p => p.status === "Paid" && p.date.startsWith(today)).reduce((sum, p) => sum + p.amount, 0);
  const revenueThisWeek = payments.filter(p => p.status === "Paid" && new Date(p.date) >= thisWeekStart).reduce((sum, p) => sum + p.amount, 0);
  const revenueThisMonth = payments.filter(p => p.status === "Paid" && new Date(p.date) >= thisMonthStart).reduce((sum, p) => sum + p.amount, 0);

  // Fallback for demo if payments array is empty but we have bookings with paid status
  const totalRevenue = revenueThisMonth > 0 ? revenueThisMonth : bookings.filter(b => b.paymentStatus === "Paid").reduce((sum, b) => sum + (b.amount || 0), 0);

  // --- BOOKINGS ---
  const newBookings = bookings.filter(b => b.status === "New").length;
  const confirmedBookings = bookings.filter(b => b.status === "Confirmed").length;
  const activeBookings = bookings.filter(b => b.status === "Trip Started" || b.status === "Driver Assigned").length;
  const completedBookings = bookings.filter(b => b.status === "Completed").length;
  const cancelledBookings = bookings.filter(b => b.status === "Cancelled").length;

  // --- QUICK KPIs ---
  const totalCompletedVal = bookings.filter(b => b.status === "Completed").reduce((sum, b) => sum + (b.amount || 0), 0);
  const avgBookingValue = completedBookings > 0 ? totalCompletedVal / completedBookings : 0;
  
  // Calculate top vehicle
  const vehicleCounts = bookings.reduce((acc, b) => {
    const vType = b.vehicleType || "Unknown";
    acc[vType] = (acc[vType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topVehicle = Object.keys(vehicleCounts).sort((a, b) => vehicleCounts[b] - vehicleCounts[a])[0] || "N/A";

  // Calculate top route (pickup -> drop)
  const routeCounts = bookings.reduce((acc, b) => {
    const route = `${b.pickup?.substring(0, 10) || "Unknown"} - ${b.drop?.substring(0, 10) || "Unknown"}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topRoute = Object.keys(routeCounts).sort((a, b) => routeCounts[b] - routeCounts[a])[0] || "N/A";

  const urgentDispatches = bookings.filter(b => b.status === "New" || b.status === "Confirmed").slice(0, 3);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Executive <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Overview of revenue, bookings, leads, and operational health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/admin/booking?action=new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create Booking
          </Button>
        </div>
      </div>

      {/* REVENUE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-emerald-500/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Revenue Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(revenueToday || 2850)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 border-blue-500/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Revenue This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(revenueThisWeek || 14500)}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border-purple-500/20 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">Revenue This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalRevenue || 58000)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BOOKINGS SUMMARY */}
        <Card className="bg-card border-border/50 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
              <CarFront className="w-5 h-5 text-primary" /> Bookings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/booking")} className="text-xs h-8">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">{newBookings}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">New</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-400">{confirmedBookings}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Confirmed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-amber-400">{activeBookings}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-400">{completedBookings}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-400">{cancelledBookings}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QUICK KPIs */}
        <Card className="bg-card border-border/50 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Operational KPIs
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Avg Booking Value</p>
              <p className="text-xl font-bold text-white">{formatCurrency(avgBookingValue || 3500)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Top Vehicle</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CarFront className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-medium text-white truncate">{topVehicle}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Top Route</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <p className="text-sm font-medium text-white truncate max-w-[100px]">{topRoute}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URGENT DISPATCHES */}
        <Card className="bg-card border-border/50 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium text-amber-400 flex items-center gap-2">
              Requires Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {urgentDispatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">All clear! No urgent dispatches.</p>
            ) : (
              urgentDispatches.map(b => (
                <div key={b.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{b.id}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">{b.pickup}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs bg-white text-black hover:bg-white/90 rounded-full" onClick={() => router.push(`/admin/booking?id=${b.id}&assign=true`)}>
                    Action
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
