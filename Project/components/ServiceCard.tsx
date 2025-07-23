"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  Sparkle,
  Zap,
} from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  illustration: string;
  variant: "grey" | "green" | "black";
  isPopular?: boolean;
  isNew?: boolean;
  metric?: {
    value: string;
    label: string;
    icon: string;
  };
  link?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  illustration,
  variant,
  isPopular = false,
  isNew = false,
  metric,
  link = "#",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "black":
        return "bg-zinc-900 text-lime-300";
      case "green":
        return "bg-lime-300";
      default:
        return "bg-white border border-solid border-zinc-200";
    }
  };

  const getMetricIcon = () => {
    if (!metric) return null;

    switch (metric.icon) {
      case "trending":
        return (
          <TrendingUp
            className={`h-5 w-5 ${
              variant === "black" ? "text-lime-300" : "text-black"
            }`}
          />
        );
      case "users":
        return (
          <Users
            className={`h-5 w-5 ${
              variant === "black" ? "text-lime-300" : "text-black"
            }`}
          />
        );
      case "star":
        return (
          <Star
            className={`h-5 w-5 ${
              variant === "black" ? "text-lime-300" : "text-black"
            }`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.article
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`flex flex-col md:flex-row justify-between gap-4 p-6 rounded-[24px] ${getVariantStyles()} h-full shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-10 -bottom-10 w-20 h-20 rounded-full bg-opacity-10 bg-white blur-xl" />
      {isPopular && (
        <div className="absolute top-4 right-4 bg-lime-300 text-black text-xs py-1 px-3 rounded-full font-medium z-10">
          Popular
        </div>
      )}
      {isNew && (
        <div className="absolute top-4 right-4 bg-blue-400 text-white text-xs py-1 px-3 rounded-full font-medium z-10">
          New
        </div>
      )}

      {/* Animated sparkles for black variant */}
      {variant === "black" && (
        <>
          <motion.div
            className="absolute top-6 right-12 opacity-60"
            animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sparkle className="h-5 w-5 text-lime-300" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 right-24 opacity-40"
            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          >
            <Zap className="h-4 w-4 text-lime-300" />
          </motion.div>
        </>
      )}

      <div className="flex flex-col gap-4 md:gap-6 flex-1 z-10">
        <div className="flex flex-col">
          <h3
            className={`text-xl font-medium ${
              variant === "black" ? "text-lime-300" : "text-black"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mt-2 ${
              variant === "black" ? "text-lime-300/80" : "text-black/80"
            }`}
          >
            {description}
          </p>
        </div>
        {metric && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              variant === "black" ? "bg-black/30" : "bg-black/5"
            }`}
          >
            {getMetricIcon()}
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg ${
                  variant === "black" ? "text-lime-300" : "text-black"
                }`}
              >
                {metric.value}
              </span>
              <span
                className={`text-xs ${
                  variant === "black" ? "text-lime-300/70" : "text-black/70"
                }`}
              >
                {metric.label}
              </span>
            </div>
          </div>
        )}
        <div className="mt-auto">
          <Link
            href={link}
            className={`flex items-center justify-center w-full gap-2 rounded-lg py-2 mt-4 transition-all duration-300 ${
              variant === "black"
                ? "bg-lime-300 text-black hover:bg-lime-400"
                : "bg-black text-lime-300 hover:bg-zinc-800"
            }`}
          >
            <span className="font-medium">Try now</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="relative h-[120px] w-[120px] md:h-[140px] md:w-[140px] mt-4 md:mt-0 ml-auto z-10">
        <Image
          src={illustration}
          alt={`${title} illustration`}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 120px, 140px"
        />
      </div>
    </motion.article>
  );
};
