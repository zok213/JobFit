"use client";

import React from "react";
import { ServiceCard } from "./ServiceCard";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Star,
  Award,
  Zap,
  MessageSquare,
  Clock,
} from "lucide-react";

export const ServicesSection = () => {
  const employerServices = [
    {
      title: "Employer Dashboard",
      description:
        "Manage all your hiring activities in one place with real-time analytics and reporting.",
      illustration: "/img/employer_dashboard.png",
      variant: "grey",
      metric: {
        value: "42%",
        label: "faster hiring",
        icon: "trending",
      },
    },
    {
      title: "Post a Job",
      description:
        "Create and publish job listings with AI optimization for maximum visibility and quality applicants.",
      illustration: "/img/post_a_job.png",
      variant: "green",
      isPopular: true,
      metric: {
        value: "35%",
        label: "more applicants",
        icon: "users",
      },
    },
    {
      title: "AI Candidate Matching",
      description:
        "Find perfect matches with our smart algorithms and reduce time-to-hire significantly.",
      illustration: "/img/AI_candicate_matching.png",
      variant: "black",
      metric: {
        value: "87%",
        label: "match accuracy",
        icon: "star",
      },
    },
    {
      title: "Resume Analyzer",
      description:
        "Evaluate candidate qualifications with AI precision and spot top talent instantly.",
      illustration: "/img/Resume_analyzer.png",
      variant: "grey",
      metric: {
        value: "93%",
        label: "accuracy rate",
        icon: "trending",
      },
    },
    {
      title: "Talent Pool",
      description:
        "Maintain and nurture a database of qualified candidates for future opportunities.",
      illustration: "/img/talent_pool.png",
      variant: "green",
      metric: {
        value: "58%",
        label: "reduced vacancy time",
        icon: "trending",
      },
    },
    {
      title: "Company Profile",
      description:
        "Showcase your employer brand to attract talent and stand out in a competitive market.",
      illustration: "/img/company_profile.png",
      variant: "black",
      isNew: true,
      metric: {
        value: "3.2x",
        label: "more engagement",
        icon: "users",
      },
    },
  ];

  const jobSeekerServices = [
    {
      title: "AI Job Match",
      description:
        "Find your perfect job with AI-powered matching tailored to your skills and preferences.",
      illustration: "/img/AI_candicate_matching.png",
      variant: "black",
      isPopular: true,
      metric: {
        value: "78%",
        label: "better job fits",
        icon: "trending",
      },
      link: "/job-match",
    },
    {
      title: "Resume Assistant",
      description:
        "Optimize your CV to stand out to employers with targeted recommendations and improvements.",
      illustration: "/img/Resume_analyzer.png",
      variant: "grey",
      metric: {
        value: "3x",
        label: "more interviews",
        icon: "users",
      },
      link: "/cv-assistant",
    },
    {
      title: "AI Interviewer",
      description:
        "Practice interviews with realistic simulations and get personalized feedback to improve.",
      illustration: "/img/company_profile.png",
      variant: "green",
      metric: {
        value: "89%",
        label: "confidence boost",
        icon: "star",
      },
      link: "/interviewer",
    },
    {
      title: "Career Roadmap",
      description:
        "Plan your career path with personalized guidance and develop skills that employers value most.",
      illustration: "/img/talent_pool.png",
      variant: "black",
      isNew: true,
      metric: {
        value: "67%",
        label: "clearer career path",
        icon: "trending",
      },
      link: "/roadmap",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <section
        id="for-job-seeker"
        className="flex flex-col gap-8 px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-6"
        >
          <motion.div
            variants={itemVariants}
            className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              For Job Seeker
            </h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-black max-w-2xl"
          >
            Powerful AI tools to help you find and land your dream job with
            personalized support at every step.
          </motion.p>

          {/* Stats section */}
          <motion.div
            variants={statsVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10 bg-gray-50 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">78%</p>
                <p className="text-sm text-gray-600">
                  find better-fitting jobs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">3x</p>
                <p className="text-sm text-gray-600">
                  more interview invitations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">24/7</p>
                <p className="text-sm text-gray-600">AI-powered support</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-2 grid-cols-1"
        >
          {jobSeekerServices.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard
                title={service.title}
                description={service.description}
                illustration={service.illustration}
                variant={service.variant as "grey" | "green" | "black"}
                isPopular={service.isPopular}
                isNew={service.isNew}
                metric={service.metric}
                link={service.link}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section
        id="for-employer"
        className="flex flex-col gap-8 px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-6"
        >
          <motion.div
            variants={itemVariants}
            className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              For Employer
            </h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-black max-w-2xl"
          >
            Helps recruiters find the most suitable candidates faster and
            smarter with AI-powered talent acquisition.
          </motion.p>

          {/* Stats section */}
          <motion.div
            variants={statsVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10 bg-gray-50 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">93%</p>
                <p className="text-sm text-gray-600">match accuracy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">42%</p>
                <p className="text-sm text-gray-600">reduced time-to-hire</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-lime-300/20 p-3 rounded-full">
                <Award className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">87%</p>
                <p className="text-sm text-gray-600">higher retention rate</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-2 grid-cols-1"
        >
          {employerServices.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard
                title={service.title}
                description={service.description}
                illustration={service.illustration}
                variant={service.variant as "grey" | "green" | "black"}
                isPopular={service.isPopular}
                isNew={service.isNew}
                metric={service.metric}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Background gradient */}
      <div className="absolute top-0 right-0 -z-10 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-lime-100/20 to-transparent opacity-30 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tl from-lime-100/10 to-transparent opacity-20 blur-3xl" />
    </>
  );
};
