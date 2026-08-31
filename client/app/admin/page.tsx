"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CarFront, Users, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
          Admin <span className="text-primary">Portal</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Welcome to the ProRido administrative portal. Select a module below to manage your operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card 
          onClick={() => router.push("/admin/booking")}
          className="bg-card border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Bookings</h2>
            <p className="text-muted-foreground text-sm mb-6 flex-grow">
              Manage rides, dispatch vehicles, and track ongoing trips.
            </p>
            <div className="flex items-center justify-center text-primary font-medium text-sm w-full py-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Go to Bookings <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => router.push("/admin/fleet")}
          className="bg-card border-border/50 hover:border-blue-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
              <CarFront className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Fleet & Drivers</h2>
            <p className="text-muted-foreground text-sm mb-6 flex-grow">
              Monitor vehicles, manage drivers, and track availability.
            </p>
            <div className="flex items-center justify-center text-blue-500 font-medium text-sm w-full py-2 bg-blue-500/10 rounded-md group-hover:bg-blue-500 group-hover:text-white transition-colors">
              Go to Fleet <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => router.push("/admin/users")}
          className="bg-card border-border/50 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Users</h2>
            <p className="text-muted-foreground text-sm mb-6 flex-grow">
              Manage customers, internal staff, and system access.
            </p>
            <div className="flex items-center justify-center text-emerald-500 font-medium text-sm w-full py-2 bg-emerald-500/10 rounded-md group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              Go to Users <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
