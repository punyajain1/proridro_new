"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";
import { opsStorage } from "@/lib/api/storage";
import { ActivityLog } from "@/lib/api/types";
import { useRouter } from "next/navigation";

export function NotificationPopover() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [open, setOpen] = useState(false);

  const fetchLogs = () => {
    setLogs(opsStorage.getActivityLogs().slice(0, 10));
  };

  useEffect(() => {
    fetchLogs();
    const handleStorageUpdate = () => fetchLogs();
    window.addEventListener("prorido-storage-update", handleStorageUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleStorageUpdate);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          title="Operations Activity Feed"
        >
          <Bell className="h-3.5 w-3.5" />
          {logs.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground font-mono">
              {logs.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-xl">
        <div className="flex items-center justify-between border-b px-3.5 py-2.5 bg-muted/30">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
            <Bell className="h-3.5 w-3.5 text-primary" />
            <span>Operations Feed</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Live Webhooks
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y">
          {logs.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No recent operational events.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 hover:bg-muted/40 transition-colors text-xs space-y-1"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-foreground text-[11px] leading-tight">
                    {log.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {log.timestamp.split(" ")[1] || log.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {log.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-primary/80 font-medium font-mono">
                    by {log.actor}
                  </span>
                  {log.bookingId && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push(`/booking?id=${log.bookingId}`);
                      }}
                      className="inline-flex items-center text-[10px] text-primary hover:underline font-mono"
                    >
                      {log.bookingId}
                      <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-2 bg-muted/20 flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground">Auto-updates from n8n</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push("/reports");
            }}
            className="h-6 text-[11px] px-2 text-primary"
          >
            View Full Audit
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
