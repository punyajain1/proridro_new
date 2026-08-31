"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, CarFront, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewUserBooking() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    pickup: "",
    drop: "",
    date: "",
    time: "",
    vehicleType: "Sedan (Dzire/Etios)",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const newBooking: any = {
        id: `BK-${Date.now()}`,
        customerId: "CUST-USER",
        customerName: "Current User",
        customerPhone: "+91 99999 99999",
        pickup: formData.pickup,
        drop: formData.drop,
        travelDate: formData.date,
        travelTime: formData.time,
        status: "New" as any,
        vehicleType: formData.vehicleType,
        source: "User Dashboard",
        amount: Math.floor(Math.random() * 2000) + 1000, // Random amount for demo
        paymentStatus: "Pending" as any,
        vendorId: "",
        driverId: "",
        assignedVehicle: "",
      };

      // Save locally
      const bookings = opsStorage.getBookings();
      opsStorage.saveBookings([newBooking, ...bookings]);


      
      setIsSuccess(true);
      toast.success("Booking created successfully!");
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/user/bookings");
      }, 2000);
      
    } catch (error) {
      toast.error("Failed to create booking");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Your ride has been successfully booked. We'll assign a driver shortly and notify you.
        </p>
        <Button onClick={() => router.push("/user/bookings")} variant="outline">
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Book a Ride</h1>
        <p className="text-muted-foreground text-sm">Enter your trip details below to request a new cab.</p>
      </div>

      <Card className="bg-card border-border/50 shadow-md">
        <CardHeader className="border-b border-border/40 bg-muted/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <CarFront className="w-5 h-5 text-primary" /> Trip Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4 relative">
              <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-border/50 z-0"></div>
              
              <div className="relative z-10 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Pickup Location</label>
                  <Input 
                    required
                    placeholder="Enter pickup address" 
                    value={formData.pickup}
                    onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                    className="bg-background/50 focus-visible:ring-emerald-500 border-border/50"
                  />
                </div>
              </div>

              <div className="relative z-10 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/30">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Drop Location</label>
                  <Input 
                    required
                    placeholder="Enter destination" 
                    value={formData.drop}
                    onChange={(e) => setFormData({...formData, drop: e.target.value})}
                    className="bg-background/50 focus-visible:ring-red-500 border-border/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/40">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </label>
                <Input 
                  required
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="bg-background/50 border-border/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Time
                </label>
                <Input 
                  required
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-muted-foreground">Vehicle Preference</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Sedan (Dzire/Etios)', 'SUV (Innova)', 'Mini (Swift)', 'Premium SUV'].map((type) => (
                  <div 
                    key={type}
                    onClick={() => setFormData({...formData, vehicleType: type})}
                    className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${
                      formData.vehicleType === type 
                        ? 'bg-primary/20 border-primary text-primary font-medium' 
                        : 'bg-background/50 border-border/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <CarFront className={`w-6 h-6 mx-auto mb-2 ${formData.vehicleType === type ? 'text-primary' : 'opacity-50'}`} />
                    <span className="text-[11px] block">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
