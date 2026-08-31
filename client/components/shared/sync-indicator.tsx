"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerGoogleSheetsSync, getSyncStatus } from "@/lib/api/sync";
import { SyncStatus } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

export function SyncIndicator() {
  const [sync, setSync] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await getSyncStatus();
      setSync(data);
    } catch (e) {
      console.error("Failed to get sync status", e);
    }
  };

  useEffect(() => {
    fetchStatus();

    const handleStorageUpdate = (e: any) => {
      if (e.detail?.key?.includes("sync") || e.detail?.key?.includes("bookings")) {
        fetchStatus();
      }
    };

    window.addEventListener("prorido-storage-update", handleStorageUpdate);
    return () => window.removeEventListener("prorido-storage-update", handleStorageUpdate);
  }, []);

  const handleManualSync = async () => {
    setIsLoading(true);
    toast.info("Syncing with Google Sheets (n8n bridge)...", { duration: 1500 });

    try {
      const updated = await triggerGoogleSheetsSync();
      setSync(updated);
      toast.success("Google Sheets synchronized", {
        description: `Updated master sheet at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error: any) {
      toast.error("Failed to sync with Google Sheets");
    } finally {
      setIsLoading(false);
    }
  };

  const lastSyncTime = sync?.lastSyncedAt
    ? new Date(sync.lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  return (
    <div className="flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-full bg-secondary/50 text-muted-foreground/80 border border-border/40">
      <span className="relative flex h-2 w-2 mr-0.5">
        {isLoading || sync?.isSyncing ? (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        ) : (
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80" />
        )}
      </span>

      <span className="hidden sm:inline tracking-wide text-foreground/80">
        Sync: {lastSyncTime}
      </span>

      <button
        onClick={handleManualSync}
        disabled={isLoading || sync?.isSyncing}
        className="ml-1 p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
        title="Sync Google Sheets"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isLoading || sync?.isSyncing ? "animate-spin text-foreground" : ""}`}
        />
      </button>
    </div>
  );
}
