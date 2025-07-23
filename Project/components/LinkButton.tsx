"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

type ButtonSize = "default" | "sm" | "lg" | "icon";
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 
  VariantProps<typeof buttonVariants> {
  href?: string;
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  exactActiveClass?: string;
  target?: string;
}

export function LinkButton({
  href,
  children,
  size = "default",
  variant = "default",
  disabled = false,
  className,
  onClick,
  isLoading = false,
  loadingText,
  icon,
  trailingIcon,
  ...props
}: LinkButtonProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (disabled || isLoading) return;
    
    if (onClick) {
      onClick();
    } else if (href && !props.target) {
      router.push(href);
    }
  };
  
  const buttonClassName = cn(
    buttonVariants({ 
      variant, 
      size,
      className: cn(
        "relative",
        disabled && "opacity-60 pointer-events-none",
        className
      )
    })
  );
  
  const buttonContent = (
    <>
      {isLoading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={`flex items-center gap-2 ${isLoading ? 'invisible' : ''}`}>
        {icon}
        {children}
        {trailingIcon}
      </span>
    </>
  );
  
  // External links or links that should open in a new tab
  if (href && props.target === "_blank") {
    return (
      <a
        href={href}
        className={buttonClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {buttonContent}
      </a>
    );
  }
  
  // Regular Next.js Link for internal navigation
  if (href && !disabled && !isLoading) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }
  
  // Regular button for click handlers or disabled state
  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      disabled={disabled || isLoading}
      type={props.type || "button"}
      {...props}
    >
      {buttonContent}
    </button>
  );
} 