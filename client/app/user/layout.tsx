import React from "react";
import Link from "next/link";
import { Car, Receipt, CalendarCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-background/80 backdrop-blur-md px-4 sm:px-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-primary text-primary-foreground font-medium flex items-center justify-center">
            P
          </div>
          <span className="font-semibold text-[15px] tracking-wide">
            PRORIDO USER
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/user" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/user/bookings" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <CalendarCheck className="h-4 w-4" /> My Bookings
          </Link>
          <Link href="/user/invoices" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Receipt className="h-4 w-4" /> Invoices
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link href="/user/bookings/new">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Car className="mr-2 h-4 w-4" /> Book a Ride
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t border-border/40 flex items-center justify-around z-30">
        <Link href="/user" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground p-2">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/user/bookings" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground p-2">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-[10px] font-medium">Bookings</span>
        </Link>
        <Link href="/user/invoices" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground p-2">
          <Receipt className="h-5 w-5" />
          <span className="text-[10px] font-medium">Invoices</span>
        </Link>
      </div>
    </div>
  );
}
