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
