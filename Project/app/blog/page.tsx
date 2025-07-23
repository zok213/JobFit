"use client";

import React from "react";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Book, FileText, Video, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  // Featured blog posts
  const featuredPosts = [
    {
      title: "How AI is Changing the Job Search Process",
      excerpt: "Discover how artificial intelligence is transforming how candidates find jobs and how employers find talent in today's competitive market.",
      category: "Career Tips",
      date: "Mar 15, 2023",
      readTime: "5 min read",
      image: "/img/blog/ai-job-search.jpg",
      slug: "how-ai-is-changing-job-search"
    },
    {
      title: "10 Resume Tips to Help You Stand Out",
      excerpt: "Learn how to craft a resume that captures attention and effectively showcases your skills and experience to potential employers.",
      category: "Resume",
      date: "Mar 10, 2023",
      readTime: "8 min read",
      image: "/img/blog/resume-tips.jpg",
      slug: "10-resume-tips-stand-out"
    },
    {
      title: "Mastering the Interview: Preparation Strategies",
      excerpt: "Comprehensive guide to preparing for job interviews, including common questions, body language tips, and research strategies.",
      category: "Interviews",
      date: "Mar 5, 2023",
      readTime: "10 min read",
      image: "/img/blog/interview-prep.jpg",
      slug: "mastering-interview-preparation"
    }
  ];

  // Recent blog posts
  const recentPosts = [
    {
      title: "Building Your Personal Brand for Job Search Success",
      category: "Career Development",
      date: "Mar 2, 2023",
      slug: "personal-brand-job-search"
    },
    {
      title: "Navigating Remote Work Job Opportunities",
      category: "Remote Work",
      date: "Feb 25, 2023",
      slug: "remote-work-opportunities"
    },
    {
      title: "Salary Negotiation: Tips for Getting What You're Worth",
      category: "Career Tips",
      date: "Feb 20, 2023",
      slug: "salary-negotiation-tips"
    },
    {
      title: "Transitioning Careers: A Guide for Changing Industries",
      category: "Career Change",
      date: "Feb 15, 2023",
      slug: "career-transition-guide"
    }
  ];

  // Resources for job seekers
  const resources = [
    {
      title: "Ultimate Resume Template Pack",
      description: "Download our collection of ATS-friendly resume templates designed for different industries and experience levels.",
      type: "template",
      icon: <FileText className="h-6 w-6" />,
      link: "/resources/resume-templates"
    },
    {
      title: "Interview Question Database",
      description: "Access our comprehensive database of interview questions with suggested answers for different roles and industries.",
      type: "guide",
      icon: <Book className="h-6 w-6" />,
      link: "/resources/interview-questions"
    },
    {
      title: "Salary Negotiation Script",
      description: "Get our step-by-step script for negotiating your salary with confidence and effectiveness.",
      type: "guide",
      icon: <FileText className="h-6 w-6" />,
      link: "/resources/salary-negotiation"
    },
    {
      title: "LinkedIn Profile Optimization Guide",
      description: "Learn how to optimize your LinkedIn profile to attract recruiters and job opportunities.",
      type: "guide",
      icon: <Book className="h-6 w-6" />,
      link: "/resources/linkedin-optimization"
    }
  ];

  // Resource categories
  const categories = [
    "All Resources",
    "Career Tips",
    "Resume",
    "Interviews",
    "Job Search",
    "Career Development",
    "Workplace"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lime-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-zinc-900 pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Career Resources & Guides
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
              Helpful articles, templates, and tips to help you succeed in your job search and career development
            </p>
            
            <div className="mt-8 bg-zinc-800/70 rounded-xl p-4 max-w-xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search resources..." 
                    className="bg-zinc-700 border-zinc-600 pl-10 text-white placeholder:text-gray-400 focus:border-lime-300 focus:ring-lime-300"
                  />
                </div>
                <Button className="bg-lime-300 text-black hover:bg-lime-400">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Articles */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-zinc-900">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[1.8/1] bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                      <FileText className="h-8 w-8 text-zinc-400" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-lime-100 text-black hover:bg-lime-200">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-lime-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                      <Link href={`/blog/${post.slug}`} className="text-lime-600 flex items-center gap-1 text-sm font-medium hover:text-lime-700 transition-colors">
                        Read more
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-zinc-900">Tools for Job Seekers</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Download free templates, guides, and tools to help you in your job search journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, i) => (
                <Card key={i} className="border border-gray-200 hover:border-lime-200 hover:shadow-md transition-all p-0">
                  <CardContent className="p-0">
                    <Link href={resource.link} className="flex p-6 items-start gap-5">
                      <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {resource.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{resource.title}</h3>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                        <div className="mt-3 flex items-center gap-1 text-lime-600 font-medium">
                          {resource.type === 'template' ? (
                            <>
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4" />
                              <span>View Resource</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/resources">
                <Button className="bg-black text-lime-300 hover:bg-zinc-800">
                  View All Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Recent Articles & Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Recent Posts */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-8 text-zinc-900">Recent Articles</h2>
                <div className="space-y-6">
                  {recentPosts.map((post, i) => (
                    <Card key={i} className="border hover:border-lime-200 transition-all hover:shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="bg-gray-100 text-gray-800 mb-2">
                              {post.category}
                            </Badge>
                            <Link href={`/blog/${post.slug}`}>
                              <h3 className="font-bold text-lg mb-1 hover:text-lime-600 transition-colors">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500">{post.date}</p>
                          </div>
                          <Link 
                            href={`/blog/${post.slug}`} 
                            className="bg-gray-100 rounded-full p-2 hover:bg-lime-100 transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/blog/all">
                    <Button variant="outline" className="border-gray-300 hover:border-lime-300 hover:bg-lime-50">
                      View All Articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Categories Sidebar */}
              <div>
                <h2 className="text-xl font-bold mb-6 text-zinc-900">Categories</h2>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="space-y-2">
                    {categories.map((category, i) => (
                      <Link 
                        key={i} 
                        href={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}
                        className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                          i === 0 
                            ? 'bg-lime-100 text-black font-medium' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-4">Subscribe to updates</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Get the latest career resources and articles delivered to your inbox
                    </p>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Your email address" 
                        className="bg-gray-50 border-gray-200"
                      />
                      <Button className="w-full bg-black text-lime-300 hover:bg-zinc-800">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-zinc-900">Ready to Advance Your Career?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Use our AI-powered tools to match with the perfect job opportunities and optimize your application process
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-lime-300 text-black hover:bg-lime-400">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
} 