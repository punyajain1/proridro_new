"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Settings,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { opsStorage } from "@/lib/api/storage";
import { useMobileNav } from "@/components/layout/mobile-nav-provider";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [activeTripsCount, setActiveTripsCount] = useState(0);
  const [settings, setSettings] = useState(opsStorage.getSettings());
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileNav();

  const updateCounts = () => {
    const bookings = opsStorage.getBookings();
    const pending = bookings.filter(
      (b) => b.status === "New"
    ).length;
    const active = bookings.filter(
      (b) => b.status === "Trip Started" || b.status === "Driver Assigned"
    ).length;
    setPendingBookingsCount(pending);
    setActiveTripsCount(active);

    setSettings(opsStorage.getSettings());
  };

  useEffect(() => {
    setIsMounted(true);
    updateCounts();
    const handleUpdate = () => updateCounts();
    window.addEventListener("prorido-storage-update", handleUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleUpdate);
  }, []);

  const navSections: NavSection[] = [
    {
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Bookings",
          href: "/admin/booking",
          icon: CalendarCheck,
          badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
        },
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          title: "Fleet",
          href: "/admin/fleet",
          icon: Layers, // Or Car if imported, but Layers is already imported
        },
      ],
    },

  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-background text-foreground border-r border-border/50 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:flex"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 mt-2">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="h-7 w-7 rounded bg-foreground text-background font-medium text-sm flex items-center justify-center">
              P
            </div>
            <span className="font-semibold text-[15px] tracking-wide text-foreground">
              PRORIDO
            </span>
            <span className="text-[10px] font-mono text-muted-foreground ml-1 opacity-70">
              OPS
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground rounded-md bg-secondary/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.title && (
              <h4 className="px-3 text-[11px] font-medium tracking-wide text-muted-foreground/60 mb-2">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2 text-[13px] transition-all duration-200",
                      isActive
                        ? "bg-secondary/60 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 stroke-[1.5]",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    {isMounted && item.badge !== undefined && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] font-mono rounded-full font-medium",
                          isActive
                            ? "bg-background text-foreground shadow-sm"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 mb-2">
        <div
          className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 transition-colors border border-border/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center font-medium text-xs text-foreground shrink-0 shadow-sm">
              PA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-foreground truncate leading-tight">
                Proridro Admin
              </span>
              <span className="text-[11px] text-muted-foreground truncate font-mono mt-0.5 opacity-80">
                {isMounted ? settings.currentUserRole : "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
