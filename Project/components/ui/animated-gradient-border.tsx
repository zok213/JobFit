"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderWidth?: number;
  duration?: number;
  gradientColors?: string[];
  borderRadius?: string;
  isAnimating?: boolean;
  from?: number;
  to?: number;
}

export const AnimatedGradientBorder = ({
  children,
  className = "",
  containerClassName = "",
  borderWidth = 2,
  duration = 8,
  gradientColors = ["#84cc16", "#22c55e", "#3b82f6", "#84cc16"],
  borderRadius = "1rem",
  isAnimating = true,
  from = 0,
  to = 360,
}: AnimatedGradientBorderProps) => {
  return (
    <div
      className={`relative ${containerClassName}`}
      style={{ padding: borderWidth }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] z-0"
        style={{
          background: `linear-gradient(${from}deg, ${gradientColors.join(", ")})`,
          borderRadius,
        }}
        animate={isAnimating ? { rotate: to } : undefined}
        initial={{ rotate: from }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      />
      <div
        className={`relative z-10 w-full h-full bg-white rounded-[inherit] ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export const AnimatedGradientText = ({
  children,
  className = "",
  duration = 8,
  gradientColors = ["#84cc16", "#22c55e", "#3b82f6", "#84cc16"],
  isAnimating = true,
  from = 0,
  to = 360,
}: Omit<AnimatedGradientBorderProps, "borderWidth" | "borderRadius" | "containerClassName">) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(${from}deg, ${gradientColors.join(", ")})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        animate={isAnimating ? { rotate: to } : undefined}
        initial={{ rotate: from }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
      <div className="opacity-0">{children}</div>
    </div>
  );
};

export const AnimatedGradientBg = ({
  children,
  className = "",
  duration = 8,
  gradientColors = ["rgba(132, 204, 22, 0.15)", "rgba(34, 197, 94, 0.15)", "rgba(59, 130, 246, 0.15)", "rgba(132, 204, 22, 0.15)"],
  borderRadius = "1rem",
  isAnimating = true,
  from = 0,
  to = 360,
}: Omit<AnimatedGradientBorderProps, "borderWidth" | "containerClassName">) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ borderRadius }}>
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(${from}deg, ${gradientColors.join(", ")})`,
        }}
        animate={isAnimating ? { rotate: to } : undefined}
        initial={{ rotate: from }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedGradientBorder; 