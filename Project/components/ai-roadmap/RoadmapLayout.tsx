"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart,
  GraduationCap,
  Target,
  Briefcase,
  CheckCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useAiToolsStore, AIToolType } from "./aiToolsStore";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export interface RoadmapLayoutProps {
  children: ReactNode;
  activeStep?: string;
  showNavigationControls?: boolean;
}

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
}

export function RoadmapLayout({
  children,
  activeStep = "form",
  showNavigationControls = true,
}: RoadmapLayoutProps) {
  const pathname = usePathname();
  const { setCurrentTool, incrementUsage } = useAiToolsStore();

  useEffect(() => {
    // Set the current tool and increment usage count when the component mounts
    setCurrentTool(AIToolType.ROADMAP);
    incrementUsage(AIToolType.ROADMAP);
  }, [setCurrentTool, incrementUsage]);

  const steps = [
    {
      id: "form",
      path: "/roadmap",
      title: "Career Goals",
      description: "Define your current and target roles",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "visualizer",
      path: "/roadmap/visualizer",
      title: "Career Roadmap",
      description: "View your personalized roadmap",
      icon: <BarChart className="h-5 w-5" />,
    },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.id === activeStep || pathname === step.path
  );
  const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  // Animations for progressive reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Career Roadmap
            </h1>
            <p className="text-gray-500 mt-1">
              Plan your career development with AI-powered guidance
            </p>
          </div>
        </motion.div>

        <div className="mb-10">
          <div className="hidden md:flex items-center justify-between mt-10 mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div variants={itemVariants} className="relative flex-1">
                  <StepIndicator
                    stepNumber={index + 1}
                    title={step.title}
                    description={step.description}
                    isActive={currentStep === index + 1}
                    isCompleted={currentStep > index + 1}
                    icon={step.icon}
                  />
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-6 left-full w-full h-0.5 -ml-6 ${
                        currentStep > index + 1 ? "bg-lime-300" : "bg-gray-200"
                      }`}
                    >
                      <ChevronRight
                        className={`absolute right-0 -top-2 h-4 w-4 ${
                          currentStep > index + 1
                            ? "text-lime-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                  )}
                </motion.div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex md:hidden mb-8">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Badge
                variant="outline"
                className="bg-lime-100 text-lime-800 border-lime-200"
              >
                Step {currentStep} of {steps.length}
              </Badge>
              <span className="text-black font-medium">
                {steps[currentStepIndex]?.title || steps[0].title}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        {children}
      </motion.div>

      {showNavigationControls && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex justify-end"
        >
          {currentStepIndex < steps.length - 1 && (
            <Link href={steps[currentStepIndex + 1].path}>
              <Button className="bg-black hover:bg-gray-800 text-lime-300 flex items-center gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

function StepIndicator({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  icon,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-[160px] mx-auto">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-all duration-300 ${
          isActive
            ? "bg-lime-300 text-black ring-4 ring-lime-100"
            : isCompleted
            ? "bg-black text-lime-300"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {isCompleted ? <CheckCircle className="h-6 w-6" /> : icon}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive
            ? "text-black"
            : isCompleted
            ? "text-gray-800"
            : "text-gray-400"
        }`}
      >
        {title}
      </span>
      <span className="text-xs text-gray-500 mt-1 hidden lg:block">
        {description}
      </span>
    </div>
  );
}
