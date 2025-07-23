"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { 
  Search, 
  FileText, 
  Users, 
  TrendingUp, 
  Award, 
  MessageSquare 
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Search className="w-6 h-6 text-lime-500" />,
    title: "AI Job Matching",
    description: "Our AI matches your skills and preferences to jobs you'll love, saving you time and increasing your chances of success.",
    link: "/ai-job-match",
  },
  {
    id: 2,
    icon: <FileText className="w-6 h-6 text-lime-500" />,
    title: "Resume Optimization",
    description: "Get personalized recommendations to improve your resume for specific job listings and stand out from the competition.",
    link: "/ai-resume-assistant",
  },
  {
    id: 3,
    icon: <TrendingUp className="w-6 h-6 text-lime-500" />,
    title: "Career Path Analysis",
    description: "Discover optimal career paths based on your experience, identify skill gaps, and find opportunities for growth.",
    link: "/career-path",
  },
  {
    id: 4,
    icon: <Award className="w-6 h-6 text-lime-500" />,
    title: "Skill Assessment",
    description: "Evaluate your strengths and weaknesses with our comprehensive skill assessment tools to highlight your unique value.",
    link: "/skill-assessment",
  },
  {
    id: 5,
    icon: <Users className="w-6 h-6 text-lime-500" />,
    title: "Employer Solutions",
    description: "Powerful tools for employers to find candidates with the perfect skill match for open positions, reducing hiring time.",
    link: "/for-employer",
  },
  {
    id: 6,
    icon: <MessageSquare className="w-6 h-6 text-lime-500" />,
    title: "Interview Coaching",
    description: "AI-powered interview preparation with customized feedback and practice sessions for your target roles.",
    link: "/interview-coaching",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
};

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-lime-100 rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl" />
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our <span className="text-lime-500">AI-Powered</span> Services
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover how JobFit.AI can accelerate your career journey with our suite of intelligent tools
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="p-6">
                <div className="mb-4 bg-lime-50 inline-flex p-3 rounded-lg">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-lime-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                <Link href={service.link}>
                  <Button 
                    variant="ghost" 
                    className="text-lime-600 font-medium hover:text-lime-700 hover:bg-lime-50 mt-2 px-0 group-hover:translate-x-1 transition-transform"
                  >
                    Learn more
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link href="/services">
            <Button 
              className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-base"
            >
              Explore All Services
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServicesSection; 