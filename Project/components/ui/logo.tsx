import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "default" | "white"; // color scheme
  size?: "sm" | "md" | "lg"; // size variations
  showText?: boolean; // whether to show text next to logo
  className?: string;
  href?: string;
  isWithinLink?: boolean; // new prop to indicate if the Logo is already within a Link
};

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className,
  href = "/",
  isWithinLink = false,
}: LogoProps) {
  // Size mapping for the logo
  const sizeValues = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const textClass = sizeValues[size];
  const textColor = variant === "white" ? "text-white" : "text-black";

  const LogoContent = (
    <div className="flex items-center">
      <span className={cn(textClass, textColor, "font-bold")}>
        <span className="text-lime-500">JobFit</span>
        <span className={textColor}>.AI</span>
      </span>
    </div>
  );

  // If we're within a link already or no href is provided, just return the content
  if (isWithinLink || !href) {
    return <div className={cn("inline-flex", className)}>{LogoContent}</div>;
  }

  // Otherwise, wrap in a Link
  return (
    <Link href={href} className={cn("inline-flex", className)}>
      {LogoContent}
    </Link>
  );
}
