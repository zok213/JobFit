"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, TrendingUp, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

export const BlogSection = () => {
  const blogPosts = [
    {
      title:
        "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills",
      content:
        "AI-driven platforms analyze your skills, experience, and preferences to recommend the most relevant job opportunities. Instead of scrolling through thousands of listings, AI does the heavy lifting for you.",
      icon: <TrendingUp className="h-5 w-5 text-lime-600" />,
      gradient: "from-lime-50 to-green-50",
    },
    {
      title: "Resume Optimization with AI Technology",
      content:
        "AI-powered tools analyze job descriptions and provide real-time suggestions to optimize wording, formatting, and keyword usage—helping applicants stand out and land more interviews.",
      icon: <Lightbulb className="h-5 w-5 text-amber-600" />,
      gradient: "from-amber-50 to-yellow-50",
    },
    {
      title: "Smart Recruitment: AI-Powered Candidate Screening",
      content:
        "AI automatically screens applications, matches the best-fit candidates, and analyzes past hiring data to predict the best hires—saving time and improving hiring success rates.",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      gradient: "from-blue-50 to-indigo-50",
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
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      id="blog"
      className="px-6 md:px-12 lg:px-24 py-20 max-w-[1440px] mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <Badge className="bg-lime-100 text-lime-800 mb-3">
          LATEST INSIGHTS
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          JobFit.AI Blog
        </h2>
        <p className="text-gray-600">
          Discover insights and strategies to advance your career and optimize
          your job search process
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div
              className={`bg-gradient-${post.gradient} p-6 border-b border-gray-100`}
            >
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-4">
                {post.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                {post.title}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">{post.content}</p>
              <Link
                href="/blog"
                className="text-lime-600 font-medium text-sm flex items-center hover:text-lime-700 transition-colors"
              >
                Read full article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Link href="/blog">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white font-medium px-6 py-2.5 shadow-md hover:shadow-xl transition-all">
            Explore all articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  );
};
