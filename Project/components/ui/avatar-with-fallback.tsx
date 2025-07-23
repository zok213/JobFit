"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User } from "lucide-react";

interface AvatarWithFallbackProps {
  src?: string;
  alt?: string;
  name?: string;
  fallbackDelay?: number;
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Avatar component with fallback support:
 * 1. Tries to load the image from src
 * 2. If image loading fails, displays initials from name
 * 3. If no name is provided, displays a generic user icon
 */
export function AvatarWithFallback({
  src,
  alt = "Avatar",
  name,
  fallbackDelay = 1000,
  className = "",
  fallbackClassName = "",
  imageClassName = "",
  size = "md",
}: AvatarWithFallbackProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(Boolean(src));
  const [showFallback, setShowFallback] = useState(!src);

  // Handle image loading error
  const handleError = () => {
    setIsImageLoaded(false);
    setShowFallback(true);
  };

  // Handle image loading success
  const handleLoad = () => {
    setIsImageLoaded(true);
    setShowFallback(false);
  };

  // Generate initials from name
  const getInitials = (name?: string): string => {
    if (!name) return "";
    
    // Split name by spaces and get first letter of each word
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2); // Only take up to 2 initials
  };

  // Define size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  // Generate a consistent background color based on the name
  const getColorFromName = (name?: string): string => {
    if (!name) return "bg-gray-200";
    
    // Simple hash function to generate a consistent number from a string
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // List of background color classes to choose from
    const colorClasses = [
      "bg-red-100", "bg-orange-100", "bg-amber-100", "bg-yellow-100",
      "bg-lime-100", "bg-green-100", "bg-emerald-100", "bg-teal-100",
      "bg-cyan-100", "bg-sky-100", "bg-blue-100", "bg-indigo-100",
      "bg-violet-100", "bg-purple-100", "bg-fuchsia-100", "bg-pink-100",
      "bg-rose-100",
    ];
    
    return colorClasses[hash % colorClasses.length];
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {src && (
        <AvatarImage
          src={src}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={imageClassName}
        />
      )}
      
      {showFallback && (
        <AvatarFallback 
          className={`${getColorFromName(name)} text-gray-800 ${fallbackClassName}`}
          delayMs={fallbackDelay}
        >
          {name ? getInitials(name) : <User className="h-4 w-4" />}
        </AvatarFallback>
      )}
    </Avatar>
  );
} 