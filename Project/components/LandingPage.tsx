"use client";

import React from "react";
import { Navbar } from "./NavBar";
import { Hero } from "./Hero";
import { LogoStrip } from "./LogoStrip";
import { ServicesSection } from "./ServiceSection";
import { ColleagueFinderSection } from "./ColleagueFinderSection";
import { BlogSection } from "./BlogSection";
import { ProcessSection } from "./ProcessSection";
import { TeamSection } from "./TeamSection";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { ArrowRight, Star, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ChatWidget } from "./ui/chat-widget";
import Image from "next/image";

export const LandingPage = () => {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Testimonial/Social Proof Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-slate-50 border-y border-slate-100 py-4 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-700 font-medium">
              Rated 4.8/5 from over 1,200+ reviews
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Badge variant="outline" className="bg-white">
              Data Privacy Compliant
            </Badge>
            <Badge variant="outline" className="bg-white">
              GDPR Certified
            </Badge>
            <Badge variant="outline" className="bg-white">
              ISO 27001 Certified
            </Badge>
            <Badge variant="outline" className="bg-white">
              SOC 2 Compliant
            </Badge>
          </div>
        </div>
      </motion.section>

      <LogoStrip />

      {/* Why Partner With Us? section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-black to-gray-900 py-16 px-6 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-32 h-32 bg-lime-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
            >
              Why Partner With Us?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg max-w-3xl mx-auto"
            >
              Enhance your recruitment process with advanced AI-matching
              technology and gain access to a qualified pool of candidates
            </motion.p>
          </div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="max-w-lg w-full"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
                <h3 className="text-2xl font-bold text-lime-300 mb-6">
                  Partner Benefits
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-white">
                    <div className="bg-lime-300/20 p-1.5 rounded-full mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#aadb5b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">AI-Powered Matching</p>
                      <p className="text-gray-400 text-sm">
                        Leverage cutting-edge technology to find the perfect fit
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <div className="bg-lime-300/20 p-1.5 rounded-full mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#aadb5b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Expanded Reach</p>
                      <p className="text-gray-400 text-sm">
                        Connect with thousands of qualified job seekers
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <div className="bg-lime-300/20 p-1.5 rounded-full mt-0.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#aadb5b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Seamless Integration</p>
                      <p className="text-gray-400 text-sm">
                        Easy integration with your existing recruitment systems
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-lime-300 to-lime-400 text-black hover:from-lime-200 hover:to-lime-300 font-medium shadow-xl hover:shadow-lime-400/20 transition-all hover:-translate-y-0.5 duration-300">
                    Become a Partner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/50 text-lime-300 hover:bg-white/10 hover:border-lime-300 backdrop-blur-sm shadow-lg hover:shadow-lime-400/30 transition-all duration-300"
                  >
                    View all integration partners
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <ServicesSection />
      <ColleagueFinderSection />

      {/* Enhanced Call-to-Action Banner */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-black to-gray-900 py-20 px-6 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-32 h-32 bg-lime-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-white max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            >
              Ready to accelerate your career journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg mb-8"
            >
              Join thousands of professionals who've found their dream job with
              JobFit.AI's intelligent matching technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-lime-300 to-lime-400 text-black hover:from-lime-200 hover:to-lime-300 font-medium shadow-xl hover:shadow-lime-400/20 transition-all hover:-translate-y-0.5 duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-lime-300 hover:bg-white hover:border-white hover:text-black backdrop-blur-sm shadow-lg hover:shadow-lime-400/30 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
                >
                  LOG IN
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white shadow-2xl w-full md:w-auto md:min-w-[350px]"
          >
            <h3 className="font-bold text-xl mb-6 flex items-center">
              <Award className="text-lime-300 mr-2 h-5 w-5" />
              JobFit.AI by the numbers
            </h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    93%
                  </p>
                  <p className="text-gray-400">match accuracy</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    10,000+
                  </p>
                  <p className="text-gray-400">successful placements</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    4.8/5
                  </p>
                  <p className="text-gray-400">user satisfaction</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <BlogSection />
      <ProcessSection />

      {/* Featured Testimonial */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-slate-50 py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="lime" className="mb-4">
            SUCCESS STORIES
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            What our users are saying
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-lime-400 rounded-full p-3 shadow-lg">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V15C4 15.5304 4.21071 16.0391 4.58579 16.4142C4.96086 16.7893 5.46957 17 6 17H8C9.10457 17 10 17.8954 10 19V21M14 7H18C18.5304 7 19.0391 7.21071 19.4142 7.58579C19.7893 7.96086 20 8.46957 20 9V15C20 15.5304 19.7893 16.0391 19.4142 16.4142C19.0391 16.7893 18.5304 17 18 17H16C14.8954 17 14 17.8954 14 19V21"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-8">
              "JobFit.AI completely transformed my job search. After months of
              applying with no results, their AI helped me understand what
              skills I was missing and connected me with the perfect
              opportunity. I landed a job that pays 30% more than my previous
              position!"
            </p>

            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden mr-4">
                <img
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  alt="Testimonial author"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Sarah Johnson</p>
                <p className="text-gray-600">Software Developer at TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <TeamSection />
      <Footer />

      <ChatWidget
        title="JobFit Assistant"
        subtitle="Trợ lý AI hỗ trợ tìm việc và phân tích CV"
        inputPlaceholder="Hỏi tôi về cơ hội nghề nghiệp..."
      />
    </main>
  );
};
