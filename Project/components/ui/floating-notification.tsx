"use client";

import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { AvatarWithFallback } from "./avatar-with-fallback";

const notificationVariants = cva(
  "relative rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-xs overflow-hidden border", 
  {
    variants: {
      variant: {
        default: "bg-white border-gray-100",
        success: "bg-green-50 border-green-100",
        warning: "bg-amber-50 border-amber-100",
        error: "bg-red-50 border-red-100",
        info: "bg-blue-50 border-blue-100",
      },
      size: {
        sm: "text-xs p-2",
        default: "text-sm",
        lg: "text-base p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NotificationProps extends VariantProps<typeof notificationVariants> {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
  className?: string;
  avatar?: string;
  username?: string;
  time?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const FloatingNotification = ({
  title,
  message,
  icon,
  variant,
  size,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  showCloseButton = true,
  className,
  avatar,
  username,
  time,
  actionLabel,
  onActionClick,
}: NotificationProps) => {
  
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <motion.div
      className={notificationVariants({ variant, size, className })}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
      }}
    >
      {/* Icon or Avatar */}
      {icon && <div className="flex-shrink-0">{icon}</div>}
      
      {avatar && (
        <div className="flex-shrink-0">
          <AvatarWithFallback
            src={avatar}
            name={username}
            alt={username || "User"}
            size="md"
            className="border-2 border-white shadow-sm"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        {(title || username) && (
          <div className="flex justify-between items-start">
            <div>
              {title && <h4 className="font-semibold text-gray-900">{title}</h4>}
              {username && <p className="font-medium text-gray-900">{username}</p>}
            </div>
            {time && <span className="text-xs text-gray-500">{time}</span>}
          </div>
        )}
        
        {/* Message */}
        <p className={`text-gray-600 ${(title || username) ? 'mt-1' : ''}`}>
          {message}
        </p>
        
        {/* Action button */}
        {actionLabel && (
          <button
            onClick={onActionClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
      
      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      {/* Progress bar for auto-close */}
      {autoClose && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-lime-500"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
};

export default FloatingNotification; 