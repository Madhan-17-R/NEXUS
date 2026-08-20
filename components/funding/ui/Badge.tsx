import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/funding/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "purple" | "brand";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80 ring-amber-600/20",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-600/20",
    info: "bg-sky-50 text-sky-700 border-sky-200/80 ring-sky-600/20",
    neutral: "bg-surface-100 text-surface-700 border-surface-200 ring-surface-500/20",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-600/20",
    brand: "bg-brand-50 text-brand-700 border-brand-200/80 ring-brand-600/20",
  };

  const dotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    neutral: "bg-surface-400",
    purple: "bg-purple-500",
    brand: "bg-brand-500",
  };

  const sizes = {
    sm: "text-[11px] font-medium px-2 py-0.5 gap-1.5 border",
    md: "text-xs font-semibold px-2.5 py-0.5 gap-1.5 border",
    lg: "text-sm font-semibold px-3 py-1 gap-2 border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium tracking-tight select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0 animate-pulse", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
