"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, AlertCircle, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function TestAccountModal() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Test Account</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Test Account & Sample Data</DialogTitle>
          <DialogDescription>
            Use these credentials and test data to explore the platform features
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="account" className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="account">Account Access</TabsTrigger>
            <TabsTrigger value="cv">Sample CV</TabsTrigger>
            <TabsTrigger value="job">Sample Job Description</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Test Account Credentials</h3>
                  <p className="text-sm text-gray-500">Use these credentials to login</p>
                </div>
                <div className="text-amber-600 flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  For testing only
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Email:</p>
                    <p className="font-mono bg-gray-50 px-2 py-1 rounded text-sm">test@jobfit.com</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("test@jobfit.com", "email")}
                    className="h-8"
                  >
                    {copiedItem === "email" ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copiedItem === "email" ? "Copied" : "Copy"}
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Password:</p>
                    <p className="font-mono bg-gray-50 px-2 py-1 rounded text-sm">TestPassword123</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("TestPassword123", "password")}
                    className="h-8"
                  >
                    {copiedItem === "password" ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copiedItem === "password" ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Test Account Information:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>This account is pre-loaded with sample data</li>
                <li>All changes are reset periodically</li>
                <li>Multiple users may be using this account simultaneously</li>
                <li>Do not use for personal or sensitive information</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="cv" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Sample Software Developer CV</h3>
                    <p className="text-sm text-gray-500">Use this CV to test the AI CV Assistant</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    Download CV
                  </Button>
                </div>
                
                <div className="border p-4 rounded-lg bg-gray-50 max-h-[250px] overflow-y-auto text-sm">
                  <h4 className="font-bold text-base mb-2">John Smith</h4>
                  <p className="mb-1">Software Developer | London, UK</p>
                  <p className="mb-2">john.smith@example.com | 07123 456789</p>
                  
                  <h5 className="font-bold mt-3 mb-1">Professional Summary</h5>
                  <p className="mb-2">
                    Full-stack developer with 5 years of experience building web applications using React, Node.js, and TypeScript. 
                    Passionate about clean code and user-centric design. Experienced in agile methodologies and team collaboration.
                  </p>
                  
                  <h5 className="font-bold mt-3 mb-1">Skills</h5>
                  <ul className="list-disc ml-5 mb-2">
                    <li>Frontend: React, TypeScript, CSS/SCSS, Redux</li>
                    <li>Backend: Node.js, Express, REST APIs</li>
                    <li>Database: MongoDB, PostgreSQL</li>
                    <li>DevOps: Git, CI/CD, Docker basics</li>
                    <li>Testing: Jest, React Testing Library</li>
                  </ul>
                  
                  <h5 className="font-bold mt-3 mb-1">Work Experience</h5>
                  <div className="mb-2">
                    <p className="font-semibold">Senior Frontend Developer | TechCorp Ltd | 2020 - Present</p>
                    <ul className="list-disc ml-5">
                      <li>Led the development of the company's customer dashboard</li>
                      <li>Implemented responsive designs and improved site performance by 40%</li>
                      <li>Mentored junior developers in React best practices</li>
                    </ul>
                  </div>
                  
                  <div className="mb-2">
                    <p className="font-semibold">Web Developer | Digital Solutions Inc | 2018 - 2020</p>
                    <ul className="list-disc ml-5">
                      <li>Developed and maintained client websites and applications</li>
                      <li>Collaborated with design team to implement UI/UX improvements</li>
                      <li>Participated in code reviews and documentation</li>
                    </ul>
                  </div>
                  
                  <h5 className="font-bold mt-3 mb-1">Education</h5>
                  <p className="mb-2">BSc Computer Science, University of London, 2018</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Test with this CV to:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Get AI analysis of CV structure and content</li>
                <li>Receive improvement suggestions</li>
                <li>Test keyword optimization features</li>
                <li>Find matching job opportunities</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="job" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Sample Frontend Developer Job Description</h3>
                    <p className="text-sm text-gray-500">Use this job description to test the AI Job Match</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5"
                    onClick={() => copyToClipboard(sampleJobDescription, "job")}
                  >
                    {copiedItem === "job" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedItem === "job" ? "Copied" : "Copy Text"}
                  </Button>
                </div>
                
                <div className="border p-4 rounded-lg bg-gray-50 max-h-[250px] overflow-y-auto text-sm">
                  <h4 className="font-bold text-base mb-2">Senior Frontend Developer</h4>
                  <p className="italic mb-2">TechInnovate Ltd | London, UK (Hybrid)</p>
                  
                  <h5 className="font-bold mt-3 mb-1">About the Role:</h5>
                  <p className="mb-2">
                    We are seeking an experienced Senior Frontend Developer to join our growing team. 
                    You will be responsible for building high-quality, scalable web applications using 
                    React and TypeScript. This is a hybrid role with 2-3 days in our London office.
                  </p>
                  
                  <h5 className="font-bold mt-3 mb-1">Key Responsibilities:</h5>
                  <ul className="list-disc ml-5 mb-2">
                    <li>Develop responsive, accessible user interfaces using React and TypeScript</li>
                    <li>Work closely with designers, backend developers, and product managers</li>
                    <li>Write clean, maintainable code with appropriate test coverage</li>
                    <li>Mentor junior developers and contribute to code reviews</li>
                    <li>Optimize application performance and ensure cross-browser compatibility</li>
                    <li>Stay updated with the latest frontend technologies and best practices</li>
                  </ul>
                  
                  <h5 className="font-bold mt-3 mb-1">Requirements:</h5>
                  <ul className="list-disc ml-5 mb-2">
                    <li>4+ years of experience in frontend development</li>
                    <li>Strong proficiency in React, TypeScript, and modern JavaScript</li>
                    <li>Experience with state management (Redux, Context API, Zustand)</li>
                    <li>Solid understanding of HTML, CSS, and responsive design principles</li>
                    <li>Familiarity with testing frameworks like Jest and React Testing Library</li>
                    <li>Experience with version control systems (Git) and CI/CD pipelines</li>
                    <li>Good communication and teamwork skills</li>
                  </ul>
                  
                  <h5 className="font-bold mt-3 mb-1">We Offer:</h5>
                  <ul className="list-disc ml-5 mb-2">
                    <li>Competitive salary: £60,000 - £85,000 depending on experience</li>
                    <li>Flexible working arrangements and hybrid office policy</li>
                    <li>25 days annual leave plus bank holidays</li>
                    <li>Generous learning and development budget</li>
                    <li>Private healthcare and pension scheme</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Test with this job description to:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Match against sample CV to see compatibility scores</li>
                <li>Analyze skill requirements and identify gaps</li>
                <li>Test AI job matching algorithm</li>
                <li>Explore job detail analysis features</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const sampleJobDescription = `Senior Frontend Developer
TechInnovate Ltd | London, UK (Hybrid)

About the Role:
We are seeking an experienced Senior Frontend Developer to join our growing team. You will be responsible for building high-quality, scalable web applications using React and TypeScript. This is a hybrid role with 2-3 days in our London office.

Key Responsibilities:
- Develop responsive, accessible user interfaces using React and TypeScript
- Work closely with designers, backend developers, and product managers
- Write clean, maintainable code with appropriate test coverage
- Mentor junior developers and contribute to code reviews
- Optimize application performance and ensure cross-browser compatibility
- Stay updated with the latest frontend technologies and best practices

Requirements:
- 4+ years of experience in frontend development
- Strong proficiency in React, TypeScript, and modern JavaScript
- Experience with state management (Redux, Context API, Zustand)
- Solid understanding of HTML, CSS, and responsive design principles
- Familiarity with testing frameworks like Jest and React Testing Library
- Experience with version control systems (Git) and CI/CD pipelines
- Good communication and teamwork skills

We Offer:
- Competitive salary: £60,000 - £85,000 depending on experience
- Flexible working arrangements and hybrid office policy
- 25 days annual leave plus bank holidays
- Generous learning and development budget
- Private healthcare and pension scheme`; 