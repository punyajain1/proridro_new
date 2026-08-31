"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { Booking, Invoice } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Clock, Receipt, CheckCircle2, MapPin, ArrowRight, Wallet } from "lucide-react";

export default function UserDashboard() {
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // For demo purposes, we just take the first few bookings and invoices
    // In a real app, this would be filtered by the logged-in user's ID
    const allBookings = opsStorage.getBookings();
    setRecentBookings(allBookings.slice(0, 3));
    
    const allInvoices = opsStorage.getInvoices();
    setUnpaidInvoices(allInvoices.filter(inv => inv.status !== "Paid").slice(0, 2));
    
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, User!
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Manage your rides, view your upcoming bookings, and handle your payments all in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => router.push("/user/bookings/new")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
            <CarFront className="mr-2 w-4 h-4" /> Book New Ride
          </Button>
          <Button variant="outline" onClick={() => router.push("/user/invoices")} className="rounded-xl px-6">
            <Wallet className="mr-2 w-4 h-4" /> View Payments
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Bookings */}
        <Card className="bg-card border-border/50 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Recent Bookings
              </CardTitle>
              <Link href="/user/bookings" className="text-xs text-primary hover:underline flex items-center">
                View All <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentBookings.length > 0 ? (
              <div className="divide-y divide-border/40">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">{booking.id}</span>
                        <h4 className="font-medium text-white">{booking.vehicleType}</h4>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        booking.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 shrink-0 opacity-70" />
                      <span className="truncate">{booking.pickup}</span>
                      <ArrowRight className="w-3 h-3 mx-1 shrink-0 opacity-50" />
                      <span className="truncate">{booking.drop}</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        {new Date(booking.travelDate).toLocaleDateString()} at {booking.travelTime}
                      </span>
                      <span className="font-semibold text-white">{formatCurrency(booking.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <CarFront className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No recent bookings found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card className="bg-card border-border/50 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" /> Pending Payments
              </CardTitle>
              <Link href="/user/invoices" className="text-xs text-primary hover:underline flex items-center">
                View All <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {unpaidInvoices.length > 0 ? (
              <div className="divide-y divide-border/40">
                {unpaidInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 hover:bg-muted/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">{invoice.id}</span>
                        <h4 className="font-medium text-white">Invoice for {invoice.customerName}</h4>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-500/10 text-amber-400">
                        {invoice.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground block text-xs">Due Date</span>
                        <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-xs">Amount</span>
                        <span className="font-bold text-white text-lg">{formatCurrency(invoice.totalAmount)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" onClick={() => router.push(`/user/payment/${invoice.id}`)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                <p>You're all caught up!</p>
                <p className="text-sm mt-1">No pending payments.</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
