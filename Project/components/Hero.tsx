"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Toggle animation state every 3 seconds
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-tr from-white via-lime-50 to-white"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-lime-400 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-lime-300 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[25vw] h-[25vw] bg-lime-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/bg-pattern.svg')",
            backgroundSize: "cover",
            opacity: 0.07,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col px-6 md:px-12 lg:px-24 py-20 md:py-28 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center max-lg:flex-col max-lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-7 max-w-[650px]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 border border-black/10 text-sm font-medium mb-2 text-black/80 w-fit"
            >
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                </span>
                AI-Powered Job Matching Technology
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight"
            >
              Job Search Stress?
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">
                Let AI Do the Rest!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base md:text-lg leading-relaxed text-gray-700"
            >
              Finding the right job or the perfect candidate has never been
              easier! Our AI-powered platform helps job seekers match with the
              best opportunities, optimize their CVs, and identify skill gaps
              for career growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
            >
              {[
                {
                  text: "Personalized job matching",
                  icon: (
                    <Check className="text-lime-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  ),
                },
                {
                  text: "AI CV optimization",
                  icon: (
                    <Check className="text-lime-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  ),
                },
                {
                  text: "Interview preparation",
                  icon: (
                    <Check className="text-lime-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  ),
                },
                {
                  text: "Career roadmap planning",
                  icon: (
                    <Check className="text-lime-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  ),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start bg-white/50 rounded-lg p-2 backdrop-blur-sm"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              {user ? (
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-base font-bold text-black rounded-xl bg-gradient-to-br from-lime-300 to-lime-400 hover:from-lime-200 hover:to-lime-300 w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                    GO TO DASHBOARD
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button className="px-8 py-6 text-base font-bold text-black rounded-xl bg-gradient-to-br from-lime-300 to-lime-400 hover:from-lime-200 hover:to-lime-300 w-fit transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                      GET STARTED FREE
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="px-8 py-6 text-base font-medium rounded-xl bg-white/70 backdrop-blur-sm border-2 border-black/10 hover:bg-black/5 text-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300">
                      LOG IN
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex items-center gap-3 mt-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${
                      i * 100
                    } shadow-sm`}
                  ></div>
                ))}
              </div>
              <p className="font-medium">
                Joined by <span className="text-black font-bold">10,000+</span>{" "}
                job seekers and{" "}
                <span className="text-black font-bold">500+</span> employers
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="hero-illustration mt-16 lg:mt-0 relative md:flex md:justify-center lg:min-w-[550px]"
          >
            <div className="absolute -bottom-10 -left-10 right-0 top-1/3 bg-lime-300/30 rounded-full blur-3xl z-0"></div>
            <div className="relative z-10 flex justify-center">
              <Image
                src="/img/hero.png"
                alt="Person working with AI job matching"
                width={600}
                height={550}
                className="w-full h-auto object-contain max-w-[600px] drop-shadow-xl -z-10"
                priority
              />
            </div>

            <motion.div
              initial={{ x: 50, y: 0, opacity: 0 }}
              animate={{
                x: isAnimating ? 40 : 50,
                y: isAnimating ? 10 : 0,
                opacity: 1,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute -top-10 md:top-0 right-0 bg-white rounded-xl shadow-xl p-4 border border-gray-100 w-64 z-20"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-lime-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold">Job Match Found!</p>
                  <p className="text-xs text-gray-500">
                    95% match with your profile
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -30, y: 20, opacity: 0 }}
              animate={{
                x: isAnimating ? -40 : -30,
                y: isAnimating ? 0 : 20,
                opacity: 1,
              }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
              className="absolute -bottom-10 md:bottom-10 left-0 md:left-10 bg-white rounded-xl shadow-xl p-4 border border-gray-100 w-60 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-lime-300" />
                </div>
                <div>
                  <p className="text-sm font-bold">AI Recommendations</p>
                  <p className="text-xs text-gray-500">
                    Personalized career insights
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
