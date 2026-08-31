"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Moon,
  Sun,
  Plus,
  ChevronDown,
  Calendar,
  DollarSign,
  Building2,
  Car,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "@/components/layout/mobile-nav-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyncIndicator } from "@/components/shared/sync-indicator";
import { NotificationPopover } from "@/components/layout/notification-popover";
import { CommandPalette } from "@/components/layout/command-palette";
import { opsStorage } from "@/lib/api/storage";
import { toast } from "sonner";
import { logoutAction } from "@/app/login/actions";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);
  const [settings, setSettings] = useState(opsStorage.getSettings());
  const [isMounted, setIsMounted] = useState(false);
  const { setIsMobileMenuOpen } = useMobileNav();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/booking")) return "Bookings";
    if (pathname.startsWith("/customer")) return "Customers";
    if (pathname.startsWith("/vendor")) return "Vendors";
    if (pathname.startsWith("/driver")) return "Drivers";
    if (pathname.startsWith("/pricing")) return "Pricing Engine";
    if (pathname.startsWith("/invoice")) return "Invoices";
    if (pathname.startsWith("/reports")) return "Reports";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Operations";
  };

  const handleRoleChange = (role: typeof settings.currentUserRole) => {
    const updated = { ...settings, currentUserRole: role };
    setSettings(updated);
    opsStorage.saveSettings(updated);
    toast.success(`Role switched to ${role}`);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-background/80 backdrop-blur-md px-4 sm:px-6 border-b border-border/40">
        {/* Left: Hamburger & Breadcrumb Title */}
        <div className="flex items-center gap-2 sm:gap-3 text-[13px] tracking-wide">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden h-9 w-9 mr-1 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-muted-foreground/70 hidden sm:inline">ProRido</span>
          <span className="text-muted-foreground/30 hidden sm:inline">/</span>
          <span className="font-medium text-foreground text-sm sm:text-[13px]">{getPageTitle()}</span>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Google Sheets Sync Pill */}
          <SyncIndicator />

          {/* Minimal Search Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandOpen(true)}
            className="h-9 px-3 text-[13px] text-muted-foreground/70 hover:text-foreground hidden sm:flex items-center gap-2 bg-secondary/30 hover:bg-secondary/60 border-border/40 rounded-full transition-colors shadow-none"
          >
            <Search className="h-4 w-4" />
            <span className="mr-2">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Quick Action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9 w-9 px-0 sm:w-auto sm:px-4 rounded-full text-[13px] gap-2 font-medium bg-foreground text-background hover:bg-foreground/90 shadow-sm transition-all flex items-center justify-center">
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Action</span>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/40 shadow-xl bg-background/95 backdrop-blur-xl">
              <DropdownMenuLabel className="text-[11px] text-muted-foreground/70 uppercase tracking-widest font-medium px-2 py-1.5">
                Quick Shortcuts
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuItem onClick={() => router.push("/booking?action=new")} className="text-[13px] cursor-pointer rounded-xl py-2 px-3 hover:bg-secondary/60 transition-colors">
                <Calendar className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>New Booking</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/pricing?simulate=true")} className="text-[13px] cursor-pointer rounded-xl py-2 px-3 hover:bg-secondary/60 transition-colors">
                <DollarSign className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Price Calculator</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/vendor")} className="text-[13px] cursor-pointer rounded-xl py-2 px-3 hover:bg-secondary/60 transition-colors">
                <Building2 className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Vendor Directory</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/driver")} className="text-[13px] cursor-pointer rounded-xl py-2 px-3 hover:bg-secondary/60 transition-colors">
                <Car className="mr-3 h-4 w-4 text-muted-foreground/70" />
                <span>Driver Fleet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <NotificationPopover />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-muted-foreground/70 hover:text-foreground hover:bg-secondary/60 transition-colors h-9 w-9"
            title="Toggle theme"
          >
            {isMounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>

          {/* Logout Button */}
          <form action={logoutAction}>
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              className="rounded-full text-muted-foreground/70 hover:text-red-500 hover:bg-red-500/10 transition-colors h-9 w-9"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
