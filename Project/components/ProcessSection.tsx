"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

  const steps = [
    {
    id: 1,
    title: "Create your profile",
    description: "Sign up and build your professional profile with skills, experience, and preferences.",
    icon: "/icons/profile.svg",
    color: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200"
  },
  {
    id: 2,
    title: "Get matched with jobs",
    description: "Our AI analyzes thousands of job postings to find opportunities that match your profile.",
    icon: "/icons/match.svg",
    color: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200"
  },
  {
    id: 3,
    title: "Optimize your application",
    description: "Receive personalized recommendations to tailor your resume for specific job listings.",
    icon: "/icons/optimize.svg",
    color: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200"
  },
  {
    id: 4,
    title: "Apply with confidence",
    description: "Submit applications knowing you're presenting yourself optimally for each opportunity.",
    icon: "/icons/apply.svg",
    color: "bg-emerald-50",
    textColor: "text-emerald-600", 
    borderColor: "border-emerald-200"
  },
  {
    id: 5,
    title: "Track your progress",
    description: "Monitor application status, receive feedback, and track your job search journey.",
    icon: "/icons/track.svg",
    color: "bg-lime-50",
    textColor: "text-lime-600",
    borderColor: "border-lime-200"
  }
];

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: {
      delay: i * 0.5 + 0.5,
      duration: 0.7,
      ease: "easeInOut"
    }
  })
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.5,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export const ProcessSection = () => {
  return (
    <section id="process" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-lime-100 rounded-full mix-blend-multiply opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply opacity-30 translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
            How <span className="text-lime-500">JobFit.AI</span> Works
        </h2>
          <p className="text-lg text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis mx-auto">
            Our streamlined process takes you from job seeker to top candidate in five simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block" />
          
          {/* Process steps */}
          <div className="space-y-12 md:space-y-0 relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Step content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div 
                      className={`
                        inline-block p-6 rounded-2xl shadow-sm border
                        ${step.color} ${step.borderColor}
                        transform transition-transform hover:-translate-y-1 hover:shadow-md
                      `}
                    >
                      <h3 className={`text-xl font-bold mb-2 flex items-center ${index % 2 === 0 ? "md:justify-end" : ""} ${step.textColor}`}>
                        {index % 2 === 1 && <span className="mr-2">{step.title}</span>}
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-sm font-bold shadow-sm">
                          {step.id}
                  </span>
                        {index % 2 === 0 && <span className="ml-2">{step.title}</span>}
                  </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500 font-medium gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-lime-500" />
                        <span>{index === 0 ? "Takes only 5 minutes" : index === 1 ? "Updated daily" : index === 2 ? "AI-powered recommendations" : index === 3 ? "Increases success rate by 78%" : "Real-time updates"}</span>
                      </div>
                </div>
              </div>
              
                  {/* Center dot for timeline (only on md screens and up) */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2" style={{ top: `calc(${index * 25}% + 2rem)` }}>
                    <motion.div 
                      className={`w-6 h-6 rounded-full border-4 border-white shadow-md z-10 ${step.textColor} ${step.color}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                    />
                </div>

                  {/* Timeline connector line (only on md screens and up) */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden md:block absolute left-1/2 w-0.5 bg-lime-500 origin-top"
                      style={{ 
                        top: `calc(${index * 25}% + 2.5rem)`, 
                        height: 'calc(25% - 1rem)'
                      }}
                      custom={index}
                      variants={lineVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    />
                  )}

                  {/* Mobile step number indicator */}
                  <div className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white shadow-md mb-4 z-10 border-2 border-lime-300 text-lime-600 font-bold">
                    {step.id}
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Final success state */}
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-lime-50 to-lime-100 p-8 rounded-2xl shadow-sm border border-lime-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900">
            Land Your Dream Job
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            JobFit.AI users are 3.4x more likely to get interviews and 2.8x faster at finding employment.
            Join thousands of successful professionals who've advanced their careers with us.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
