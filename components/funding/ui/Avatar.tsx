import React from "react";
import { cn } from "@/lib/funding/utils";

export interface AvatarProps {
  src?: string | null;
  name: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  statusIndicator?: "online" | "busy" | "away" | "offline";
}

export function Avatar({
  src,
  name,
  initials,
  size = "md",
  className,
  statusIndicator,
}: AvatarProps) {
  const displayInitials =
    initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-xs font-bold",
    lg: "h-11 w-11 text-sm font-bold",
    xl: "h-14 w-14 text-base font-bold",
  };

  const statusColors = {
    online: "bg-emerald-500 ring-white",
    busy: "bg-rose-500 ring-white",
    away: "bg-amber-500 ring-white",
    offline: "bg-surface-400 ring-white",
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold bg-brand-100 text-brand-700 select-none border border-surface-200/80",
          sizes[size],
          className
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span>{displayInitials}</span>
        )}
      </div>
      {statusIndicator && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2",
            statusColors[statusIndicator]
          )}
        />
      )}
    </div>
  );
}
