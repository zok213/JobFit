"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Book, Calendar, ArrowRight, ArrowDown, Download, Share2 } from "lucide-react";

type RoadmapStep = {
  title: string;
  timeframe: string;
  description: string;
  skills: string[];
  courses?: string[];
  certifications?: string[];
  type: 'education' | 'experience' | 'skill';
};

type CareerRoadmapProps = {
  title?: string;
  roadmapSteps?: RoadmapStep[];
};

export function CareerRoadmap({ 
  title = "Software Developer to Tech Lead", 
  roadmapSteps = sampleRoadmapSteps 
}: CareerRoadmapProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">{title}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" /> Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            This personalized career roadmap outlines the steps to progress from a junior developer 
            to a tech lead position, with recommended skills, education, and milestones along the way.
          </p>
          
          <div className="space-y-6">
            {roadmapSteps.map((step, index) => (
              <div key={index} className="relative">
                {index > 0 && (
                  <div className="absolute left-6 -top-6 h-6 w-0.5 bg-gray-200"></div>
                )}
                <div className="flex items-start gap-4">
                  {/* Icon based on step type */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.type === 'education' 
                      ? 'bg-blue-100' 
                      : step.type === 'experience'
                      ? 'bg-green-100'
                      : 'bg-purple-100'
                  }`}>
                    {step.type === 'education' && <GraduationCap className="h-6 w-6 text-blue-600" />}
                    {step.type === 'experience' && <Briefcase className="h-6 w-6 text-green-600" />}
                    {step.type === 'skill' && <Book className="h-6 w-6 text-purple-600" />}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-lg font-semibold">{step.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{step.timeframe}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Key Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {step.skills.map((skill, i) => (
                            <Badge key={i} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {step.courses && step.courses.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Recommended Courses</h5>
                          <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                            {step.courses.map((course, i) => (
                              <li key={i}>{course}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {step.certifications && step.certifications.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Valuable Certifications</h5>
                          <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                            {step.certifications.map((cert, i) => (
                              <li key={i}>{cert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < roadmapSteps.length - 1 && (
                  <div className="ml-6 h-10 w-0.5 bg-gray-200 relative">
                    <ArrowDown className="absolute -bottom-2 -left-2 h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-2">
          Customize Roadmap
        </Button>
        <Button className="bg-black hover:bg-gray-800 text-lime-300 flex items-center gap-2">
          Explore Related Jobs <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Sample data for the roadmap
const sampleRoadmapSteps: RoadmapStep[] = [
  {
    title: "Junior Software Developer",
    timeframe: "0-2 years",
    description: "Build a strong foundation in software development fundamentals and gain practical experience working on real projects under supervision.",
    skills: ["HTML/CSS", "JavaScript", "Basic React", "Git", "API Integration"],
    courses: [
      "Web Development Bootcamp",
      "JavaScript Fundamentals",
      "Introduction to React"
    ],
    type: 'experience'
  },
  {
    title: "Continuous Learning",
    timeframe: "0-2 years",
    description: "While working as a junior developer, focus on expanding your knowledge through courses and self-study.",
    skills: ["Problem Solving", "Data Structures", "Algorithms", "Testing"],
    courses: [
      "Data Structures and Algorithms",
      "Test-Driven Development"
    ],
    type: 'education'
  },
  {
    title: "Mid-level Developer",
    timeframe: "2-4 years",
    description: "Take ownership of features and smaller projects. Demonstrate ability to work independently while collaborating effectively with the team.",
    skills: ["Advanced React", "State Management", "Backend Integration", "Code Review", "CI/CD"],
    certifications: [
      "AWS Certified Developer",
      "Professional Scrum Developer"
    ],
    type: 'experience'
  },
  {
    title: "Specialization Phase",
    timeframe: "3-5 years",
    description: "Develop expertise in specific areas that interest you and are valuable to your career goals.",
    skills: ["System Design", "Performance Optimization", "Advanced State Management", "Security Best Practices"],
    courses: [
      "System Design for Developers",
      "Advanced JavaScript Patterns",
      "Security in Web Applications"
    ],
    type: 'skill'
  },
  {
    title: "Senior Developer",
    timeframe: "5-8 years",
    description: "Lead the design and implementation of complex features and systems. Mentor junior developers and influence technical decisions.",
    skills: ["Architecture Design", "Technical Documentation", "Team Mentoring", "Project Planning"],
    certifications: [
      "Google Professional Cloud Developer",
      "Microsoft Certified: Azure Developer Associate"
    ],
    type: 'experience'
  },
  {
    title: "Tech Lead",
    timeframe: "8+ years",
    description: "Provide technical leadership for a team or project. Balance technical contributions with team leadership responsibilities.",
    skills: ["Technical Leadership", "Strategic Planning", "Cross-team Collaboration", "Stakeholder Management"],
    courses: [
      "Technical Leadership Fundamentals",
      "Software Architecture Patterns",
      "Project Management for Tech Leads"
    ],
    type: 'experience'
  }
]; 