import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  onClick,
  className,
}: StatsCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-5 bg-card border-border/40 shadow-sm transition-all duration-200 rounded-2xl",
        onClick && "cursor-pointer hover:shadow-md hover:border-border/80",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground/80 tracking-wide">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/40 stroke-[1.5]" />}
      </div>

      <div className="mt-4 text-3xl font-medium tracking-tight text-foreground">
        {value}
      </div>

      {(description || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/80">
          {trend && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full font-medium tracking-wide",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
              )}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="truncate">{description}</span>}
        </div>
      )}
    </Card>
  );
}
