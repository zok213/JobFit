"use client";

import { useState } from "react";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Zap,
  ArrowRight,
  Users,
  Building,
  Briefcase,
  Star,
  Shield,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [activeTab, setActiveTab] = useState<"employee" | "employer">(
    "employee"
  );
  const router = useRouter();

  const employeeTiers = [
    {
      name: "Free",
      price: {
        monthly: 0,
        annual: 0,
      },
      description: "Basic features for job seekers",
      features: [
        "CV Builder",
        "3 free Job matches",
        "Basic profile",
        "Community support",
      ],
      limitations: [
        "Limited job matches",
        "No AI analysis",
        "No interview practice",
        "No career roadmap",
        "No priority support",
      ],
      cta: "Get Started Free",
      ctaLink: "/register",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Student",
      price: {
        monthly: 0,
        annual: 0,
      },
      description: "Limited trial for students",
      features: [
        "7 days trial of Premium plan",
        "CV Builder",
        "10 Job matches",
        "Basic AI CV analysis",
        "Limited interview practice",
      ],
      limitations: ["7-day access only", "Limited features"],
      cta: "Start Trial",
      ctaLink: "/register?plan=student",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Premium",
      popular: true,
      price: {
        monthly: 9.99,
        annual: 89.99, // Calculated per month for display
      },
      description: "All features for serious career advancement",
      features: [
        "AI CV analysis & optimization",
        "Unlimited job matches",
        "AI simulated interview practice",
        "Career path planning",
        "All premium features",
        "Performance tracking & analytics",
        "Industry insights & salary data",
        "Resume export in multiple formats",
        "Personal career coach AI",
      ],
      limitations: [],
      cta: "Upgrade to Premium",
      ctaLink: "/register?plan=premium",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const employerTiers = [
    {
      name: "Experience",
      price: {
        monthly: 39.99,
        annual: 35.99,
      },
      description: "For small businesses and startups",
      features: [
        "Max 50 CVs / analysis & classification",
        "Basic candidate matching",
        "Standard job listing visibility",
        "Email support",
        "Basic reporting",
      ],
      limitations: [
        "Limited CV analysis",
        "Basic matching algorithm",
        "No advanced analytics",
        "No ATS integration",
      ],
      cta: "Choose Experience",
      ctaLink: "/register?role=employer&plan=experience",
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: "Link",
      popular: true,
      price: {
        monthly: 69.99,
        annual: 62.99,
      },
      description: "For growing businesses",
      features: [
        "Max 100 CVs / analysis & classification",
        "Advanced AI candidate matching",
        "Enhanced job visibility",
        "Candidate tracking system",
        "Advanced analytics & reporting",
        "Priority support",
        "ATS integration",
        "Team collaboration tools",
      ],
      limitations: ["Limited to 100 CVs"],
      cta: "Choose Link",
      ctaLink: "/register?role=employer&plan=link",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Engagement",
      price: {
        monthly: 199.99,
        annual: 179.99,
      },
      description: "Comprehensive solution for large organizations",
      features: [
        "Unlimited CVs / analysis & classification",
        "Premium AI candidate matching",
        "Customizable recruitment workflow",
        "Maximum job visibility",
        "Dedicated account manager",
        "Custom analytics & reporting",
        "API access",
        "Advanced integrations",
        "White-labeling options",
        "Bulk actions and imports",
        "Talent pool management",
      ],
      limitations: [],
      cta: "Choose Engagement",
      ctaLink: "/register?role=employer&plan=engagement",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  const employeeAnnualDiscount = Math.round(
    ((employeeTiers[1].price.monthly * 12 -
      employeeTiers[1].price.annual * 12) /
      (employeeTiers[1].price.monthly * 12)) *
      100
  );
  const employerAnnualDiscount = Math.round(
    ((employerTiers[1].price.monthly * 12 -
      employerTiers[1].price.annual * 12) /
      (employerTiers[1].price.monthly * 12)) *
      100
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lime-50 to-white">
      <Navbar />

      <main className="flex-grow bg-white pt-24 md:pt-28">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">
              Simple, Transparent Pricing
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose the plan that's right for you, whether you're looking for a
              job or hiring talent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-12"
          >
            <Tabs
              defaultValue="employee"
              className="w-full"
              onValueChange={(value) =>
                setActiveTab(value as "employee" | "employer")
              }
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 w-72 rounded-full p-1">
                  <TabsTrigger
                    value="employee"
                    className="data-[state=active]:bg-zinc-900 data-[state=active]:text-lime-300 rounded-full p-3 transition-all"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Job Seekers
                  </TabsTrigger>
                  <TabsTrigger
                    value="employer"
                    className="data-[state=active]:bg-zinc-900 data-[state=active]:text-lime-300 rounded-full p-3 transition-all"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Employers
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative bg-zinc-900 rounded-full p-1 w-72 h-12 flex items-center">
                  <button
                    className={`relative z-10 flex-1 flex justify-center items-center h-full rounded-full px-3 font-medium text-sm transition-colors duration-200 ${
                      billingCycle === "monthly"
                        ? "text-black"
                        : "text-lime-300"
                    }`}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </button>
                  <button
                    className={`relative z-10 flex-1 flex justify-center items-center h-full rounded-full px-3 font-medium text-sm transition-colors duration-200 ${
                      billingCycle === "annual" ? "text-black" : "text-lime-300"
                    }`}
                    onClick={() => setBillingCycle("annual")}
                  >
                    Annual
                  </button>

                  {/* Active background pill */}
                  <div
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-lime-300 rounded-full transition-all duration-300 ease-in-out ${
                      billingCycle === "monthly"
                        ? "left-1"
                        : "left-[calc(50%+2px)]"
                    }`}
                  ></div>

                  {/* Save badge - Only show for annual */}
                  {billingCycle === "annual" && (
                    <div className="absolute -top-2 -right-2 bg-lime-300 rounded-full px-2 py-0.5 text-[10px] font-bold text-black border border-black/10 shadow-sm">
                      Save{" "}
                      {activeTab === "employee"
                        ? employeeAnnualDiscount
                        : employerAnnualDiscount}
                      %
                    </div>
                  )}
                </div>
              </div>

              <TabsContent value="employee" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {employeeTiers.map((tier, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                    >
                      <Card
                        className={`
                          border rounded-xl overflow-hidden bg-white hover:translate-y-[-4px] transition-all duration-300 h-full flex flex-col group
                          ${
                            tier.popular
                              ? "border-lime-300 shadow-[0_0_15px_rgba(190,255,102,0.25)]"
                              : "border-gray-200 shadow-sm"
                          }
                        `}
                      >
                        {tier.popular && (
                          <div className="bg-lime-300 py-2 text-center relative">
                            <span className="font-medium text-black text-sm flex items-center justify-center">
                              <Star className="h-4 w-4 mr-1 fill-black" /> MOST
                              POPULAR
                            </span>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-lime-300"></div>
                          </div>
                        )}
                        <CardHeader
                          className={`${tier.popular ? "pt-6" : "pt-8"} pb-4`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <div
                              className={`p-3 rounded-full ${
                                tier.popular ? "bg-lime-100" : "bg-gray-100"
                              } transition-all duration-300 group-hover:scale-110`}
                            >
                              {tier.icon}
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-zinc-900 text-center">
                            {tier.name}
                          </h2>
                          <div className="mt-4 mb-2 text-center">
                            <span className="text-4xl font-bold text-zinc-900">
                              ${tier.price[billingCycle].toFixed(2)}
                            </span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          {billingCycle === "annual" &&
                            tier.price[billingCycle] > 0 && (
                              <p className="text-sm text-gray-500 text-center">
                                Billed as $
                                {(tier.price[billingCycle] * 12).toFixed(2)} per
                                year
                              </p>
                            )}
                          <p className="text-gray-600 mt-2 text-center">
                            {tier.description}
                          </p>
                        </CardHeader>
                        <CardContent className="pb-8 flex-grow">
                          <h3 className="font-semibold mb-3 text-zinc-900 flex items-center">
                            <Check className="h-4 w-4 text-lime-500 mr-2" />{" "}
                            Includes:
                          </h3>
                          <ul className="space-y-3">
                            {tier.features.map((feature, j) => (
                              <li key={j} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-lime-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  <Check className="h-3 w-3 text-lime-700" />
                                </div>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {tier.limitations.length > 0 && (
                            <>
                              <h3 className="font-semibold mb-3 mt-6 text-zinc-900 flex items-center">
                                <X className="h-4 w-4 text-gray-400 mr-2" />{" "}
                                Limitations:
                              </h3>
                              <ul className="space-y-3">
                                {tier.limitations.map((limitation, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start text-gray-500"
                                  >
                                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                      <X className="h-3 w-3 text-gray-400" />
                                    </div>
                                    <span>{limitation}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-8 flex justify-center mt-auto">
                          <Link href={tier.ctaLink} className="w-full">
                            <Button
                              className={`w-full h-14 text-base ${
                                tier.popular
                                  ? "bg-black text-lime-300 hover:bg-zinc-800 shadow-sm hover:shadow-lg hover:shadow-lime-200/20 gap-2"
                                  : "bg-lime-300 text-black hover:bg-lime-400 shadow-sm hover:shadow-lg hover:shadow-lime-200/40 gap-2"
                              }`}
                              size="lg"
                            >
                              {tier.popular && <Zap className="h-5 w-5" />}
                              {tier.cta}
                              <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-8 text-center text-zinc-900">
                    Detailed Features Comparison
                  </h2>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-6 font-medium text-zinc-900">
                              Feature
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900">
                              Free
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900 bg-lime-50">
                              Only For Student
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900">
                              Premium
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Job Matches
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              3 per month
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              10 per month
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Unlimited
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              CV Analysis
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              No AI analysis
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Basic AI CV analysis
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              AI CV analysis & optimization
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              AI Interview Practice
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              No interview practice
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Limited interview practice
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Unlimited
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Career Roadmap
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              No career roadmap
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              No career roadmap
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Career path planning
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">Support</td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Community support
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Community support
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Priority support
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Performance Analytics
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Industry Insights
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-6 text-gray-700">
                              Resume Export Formats
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Basic PDF
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Basic PDF
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Multiple formats
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="employer" className="mt-0">
                <div className="bg-zinc-900 rounded-xl p-6 mb-8 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute -left-4 -bottom-8 w-24 h-24 rounded-full bg-lime-300/10 blur-xl"></div>
                  <div className="absolute right-8 top-0 w-16 h-16 rounded-full bg-lime-300/10 blur-lg"></div>
                  <div className="flex items-center relative z-10">
                    <div className="mr-3">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M30 0L42.5 7.5L35 15L47.5 22.5L42.5 35L55 42.5L42.5 60H17.5L5 42.5L17.5 35L12.5 22.5L25 15L17.5 7.5L30 0Z"
                          fill="#B9FF66"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center">
                      <p className="text-lime-300 font-bold text-xl mr-3">
                        JobFit.AI
                      </p>
                      <span className="text-white font-medium">Employer</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {employerTiers.map((tier, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                    >
                      <Card
                        className={`
                          border rounded-xl overflow-hidden bg-white hover:translate-y-[-4px] transition-all duration-300 h-full flex flex-col group
                          ${
                            tier.popular
                              ? "border-lime-300 shadow-[0_0_15px_rgba(190,255,102,0.25)]"
                              : "border-gray-200 shadow-sm"
                          }
                        `}
                      >
                        {tier.popular && (
                          <div className="bg-lime-300 py-2 text-center relative">
                            <span className="font-medium text-black text-sm flex items-center justify-center">
                              <Star className="h-4 w-4 mr-1 fill-black" /> MOST
                              POPULAR
                            </span>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-lime-300"></div>
                          </div>
                        )}
                        <CardHeader
                          className={`${tier.popular ? "pt-6" : "pt-8"} pb-4`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <div
                              className={`p-3 rounded-full ${
                                tier.popular ? "bg-lime-100" : "bg-gray-100"
                              } transition-all duration-300 group-hover:scale-110`}
                            >
                              {tier.icon}
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold text-zinc-900 text-center">
                            {tier.name}
                          </h2>
                          <div className="mt-4 mb-2 text-center">
                            <span className="text-4xl font-bold text-zinc-900">
                              ${tier.price[billingCycle]}
                            </span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          {billingCycle === "annual" &&
                            tier.price[billingCycle] > 0 && (
                              <p className="text-sm text-gray-500 text-center">
                                Billed as ${tier.price[billingCycle] * 12} per
                                year
                              </p>
                            )}
                          <p className="text-gray-600 mt-2 text-center">
                            {tier.description}
                          </p>
                        </CardHeader>
                        <CardContent className="pb-8 flex-grow">
                          <h3 className="font-semibold mb-3 text-zinc-900 flex items-center">
                            <Check className="h-4 w-4 text-lime-500 mr-2" />{" "}
                            Includes:
                          </h3>
                          <ul className="space-y-3">
                            {tier.features.map((feature, j) => (
                              <li key={j} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-lime-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                  <Check className="h-3 w-3 text-lime-700" />
                                </div>
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {tier.limitations && tier.limitations.length > 0 && (
                            <>
                              <h3 className="font-semibold mb-3 mt-6 text-zinc-900 flex items-center">
                                <X className="h-4 w-4 text-gray-400 mr-2" />{" "}
                                Limitations:
                              </h3>
                              <ul className="space-y-3">
                                {tier.limitations.map((limitation, j) => (
                                  <li
                                    key={j}
                                    className="flex items-start text-gray-500"
                                  >
                                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                      <X className="h-3 w-3 text-gray-400" />
                                    </div>
                                    <span>{limitation}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-8 flex justify-center mt-auto">
                          <Link href={tier.ctaLink} className="w-full">
                            <Button
                              className={`w-full h-14 text-base ${
                                tier.popular
                                  ? "bg-black text-lime-300 hover:bg-zinc-800 shadow-sm hover:shadow-lg hover:shadow-lime-200/20 gap-2"
                                  : "bg-lime-300 text-black hover:bg-lime-400 shadow-sm hover:shadow-lg hover:shadow-lime-200/40 gap-2"
                              }`}
                              size="lg"
                            >
                              {tier.popular && <Zap className="h-5 w-5" />}
                              {tier.cta}
                              <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h2 className="text-2xl font-bold mb-8 text-center text-zinc-900">
                    Detailed Features Comparison
                  </h2>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-6 font-medium text-zinc-900">
                              Feature
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900">
                              Experience
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900 bg-lime-50">
                              Link
                            </th>
                            <th className="text-center py-4 px-4 font-medium text-zinc-900">
                              Engagement
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              CV Analysis
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Max 50 CVs / analysis & classification
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Max 100 CVs / analysis & classification
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Unlimited
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              AI Candidate Matching
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Basic
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Advanced
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Premium
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Job Visibility
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Standard
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Enhanced
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Maximum
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">Support</td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Email
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">
                              Priority
                            </td>
                            <td className="text-center py-4 px-4 text-gray-700">
                              Dedicated Manager
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              ATS Integration
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              Custom Branding
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-4 px-6 text-gray-700">
                              API Access
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 px-6 text-gray-700">
                              Talent Pool Management
                            </td>
                            <td className="text-center py-4 px-4">
                              <X className="h-5 w-5 text-gray-400 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4 bg-lime-50">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                            <td className="text-center py-4 px-4">
                              <Check className="h-5 w-5 text-lime-500 mx-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-zinc-900">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/faq">
                <Button
                  variant="outline"
                  className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 h-12 px-6"
                >
                  Browse FAQ
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-black text-lime-300 hover:bg-zinc-800 h-12 px-6">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 max-w-3xl mx-auto bg-gradient-to-br from-lime-100 to-lime-50 rounded-xl p-8 border border-lime-200 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-lime-300 rounded-full p-3 shadow-md">
                <Clock className="h-8 w-8 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-zinc-900 text-center md:text-left">
                  Try JobFit.AI risk-free
                </h3>
                <p className="text-gray-700 mb-4 text-center md:text-left">
                  All paid plans come with a 14-day free trial. No credit card
                  required to start.
                </p>
              </div>
              <div>
                <Link href="/register">
                  <Button className="bg-black text-lime-300 hover:bg-zinc-800 whitespace-nowrap">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
