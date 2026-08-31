"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { Booking } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, CarFront, Download, Eye } from "lucide-react";

export default function UserBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setBookings(opsStorage.getBookings());
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
          <p className="text-muted-foreground text-sm">View and manage your past and upcoming rides.</p>
        </div>
        <Button onClick={() => router.push("/user/bookings/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <CarFront className="mr-2 w-4 h-4" /> Book New Ride
        </Button>
      </div>

      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="bg-card border-border/50 hover:border-border transition-colors overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-4 sm:p-6 gap-6">
                  
                  {/* Status & ID */}
                  <div className="flex-shrink-0 md:w-32">
                    <span className="text-xs font-mono text-muted-foreground block mb-1">{booking.id}</span>
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                      booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      booking.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                      booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Route & Date */}
                  <div className="flex-grow space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" /> Pickup
                        </span>
                        <p className="font-medium text-sm text-white line-clamp-1">{booking.pickup}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" /> Drop
                        </span>
                        <p className="font-medium text-sm text-white line-clamp-1">{booking.drop}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(booking.travelDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.travelTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <CarFront className="w-3.5 h-3.5" />
                        {booking.vehicleType}
                      </span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center md:w-32 gap-3 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-muted-foreground block">Amount</span>
                      <span className="font-bold text-lg text-white">{formatCurrency(booking.amount)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-xl border border-border/50">
            <CarFront className="w-12 h-12 mx-auto mb-3 opacity-20 text-muted-foreground" />
            <h3 className="text-lg font-medium text-white mb-1">No bookings yet</h3>
            <p className="text-muted-foreground text-sm mb-4">You haven't booked any rides with us yet.</p>
            <Button onClick={() => router.push("/user/bookings/new")}>
              Book Your First Ride
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
