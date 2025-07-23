"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "white";
}

export function Spinner({
  size = "md",
  color = "primary",
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  const colorClasses = {
    primary: "border-t-lime-600",
    secondary: "border-t-gray-600",
    accent: "border-t-blue-600",
    white: "border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-gray-200",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}
