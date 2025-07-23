"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import {
  Search,
  FileText,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Video,
  ArrowRight,
} from "lucide-react";
import { LinkButton } from "@/components/LinkButton";

type FaqItem = {
  question: string;
  answer: string;
  isOpen?: boolean;
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      question: "How does the AI job matching work?",
      answer:
        "Our AI job matching technology analyzes your CV and job preferences to find positions that match your skills and experience. The system uses natural language processing to understand job descriptions and requirements, then compares them with your profile to identify the best matches.",
    },
    {
      question: "How can I improve my CV match score?",
      answer:
        "To improve your CV match score, follow the suggestions provided in the CV analysis section. Focus on adding relevant keywords, quantifying your achievements, and highlighting specific skills that match your target roles. Regularly update your CV with new skills and experiences.",
    },
    {
      question: "How do I prepare for an AI interview?",
      answer:
        "Prepare for an AI interview just as you would for a regular one. Review common interview questions in your field, practice your responses, and make sure your webcam and microphone are working properly. Our AI interviewer will provide feedback on your answers and suggestions for improvement.",
    },
    {
      question: "What's the difference between free and pro accounts?",
      answer:
        "Free accounts provide access to basic job matching, CV analysis, and limited AI interviews. Pro accounts unlock advanced features such as unlimited job matches, detailed CV insights, comprehensive interview feedback, personalized career roadmaps, and priority support.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time by going to Settings > Billing & Subscriptions and clicking on 'Cancel Subscription'. Your access to Pro features will continue until the end of your current billing period.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security very seriously. All user data is encrypted both in transit and at rest. We do not share your personal information with employers without your explicit permission. You can manage your privacy settings at any time in your account settings.",
    },
  ]);

  const toggleFaq = (index: number) => {
    setFaqs(
      faqs.map((faq, i) =>
        i === index ? { ...faq, isOpen: !faq.isOpen } : faq
      )
    );
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using JobFit.AI",
      icon: <BookOpen className="h-5 w-5" />,
      link: "#getting-started",
    },
    {
      title: "CV Optimization Tips",
      description: "Best practices for creating an effective CV",
      icon: <FileText className="h-5 w-5" />,
      link: "#cv-tips",
    },
    {
      title: "Interview Preparation",
      description: "How to prepare for AI and real interviews",
      icon: <MessageCircle className="h-5 w-5" />,
      link: "#interview-prep",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step guides for using all features",
      icon: <Video className="h-5 w-5" />,
      link: "#tutorials",
    },
  ];

  return (
    <DashboardShell activeNavItem="help" userRole="employee">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-500">
            Find answers to common questions and learn how to get the most out
            of JobFit.AI
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <SearchInput
            placeholder="Tìm kiếm các chủ đề trợ giúp..."
            className="py-6 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-lime-300 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={setSearchQuery}
            containerClassName="max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar - Categories */}
          <div className="md:col-span-1">
            <Card className="shadow-sm sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "all"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("all")}
                    >
                      All Help Topics
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "job-match"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("job-match")}
                    >
                      Job Matching
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "cv"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("cv")}
                    >
                      CV Assistant
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "interview"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("interview")}
                    >
                      AI Interviewer
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "roadmap"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("roadmap")}
                    >
                      Career Roadmap
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        activeCategory === "account"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveCategory("account")}
                    >
                      Account & Billing
                    </button>
                  </li>
                </ul>

                <h3 className="font-semibold mt-6 mb-3">Support</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span>Live Chat</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>support@jobfit.ai</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            {/* Popular Resources */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Popular Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <Card
                    key={index}
                    className="shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                        {resource.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {resource.description}
                        </p>
                        <a
                          href={resource.link}
                          className="text-sm text-black font-medium flex items-center hover:text-lime-700"
                        >
                          View Guide
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  {filteredFaqs.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredFaqs.map((faq, index) => {
                        // Create separate buttons based on the open state to avoid using expressions in aria-expanded
                        return (
                          <div key={index} className="py-4 px-6">
                            {faq.isOpen ? (
                              <button
                                className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                                onClick={() => toggleFaq(index)}
                                aria-expanded="true"
                                aria-controls={`faq-answer-${index}`}
                              >
                                <span>{faq.question}</span>
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              </button>
                            ) : (
                              <button
                                className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                                onClick={() => toggleFaq(index)}
                                aria-expanded="false"
                                aria-controls={`faq-answer-${index}`}
                              >
                                <span>{faq.question}</span>
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              </button>
                            )}
                            {faq.isOpen && (
                              <div
                                id={`faq-answer-${index}`}
                                className="mt-2 text-gray-600"
                              >
                                <p>{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">
                        No results found
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Try adjusting your search query or browse the categories
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Contact Us */}
            <section className="mt-10">
              <Card className="shadow-sm bg-gradient-to-r from-lime-300/20 to-lime-50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Still need help?</h3>
                      <p className="text-gray-600 mt-1">
                        Our support team is ready to assist you with any
                        questions
                      </p>
                    </div>
                    <LinkButton
                      className="mt-4 md:mt-0 bg-black text-lime-300 hover:bg-gray-800 shadow-sm hover:shadow transition-all"
                      href="/contact"
                      trailingIcon={<ArrowRight className="h-4 w-4" />}
                      aria-label="Contact our support team"
                    >
                      Contact Support
                    </LinkButton>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
