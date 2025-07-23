"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";
import { ChevronRight, Briefcase, UserCircle, GraduationCap, Building } from "lucide-react";

export function UserOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"employee" | "employer">("employee");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    company: "",
    yearsOfExperience: "",
    industry: "",
    skills: [] as string[],
    education: "",
    lookingFor: [] as string[],
    location: "",
    remotePreference: "hybrid"
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (skill: string) => {
    setFormData((prev) => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleLookingForChange = (item: string) => {
    setFormData((prev) => {
      if (prev.lookingFor.includes(item)) {
        return { ...prev, lookingFor: prev.lookingFor.filter((i) => i !== item) };
      } else {
        return { ...prev, lookingFor: [...prev.lookingFor, item] };
      }
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // Simulate API call to save user data
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-lime-300 rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl text-black font-bold">
            {userType === "employee" ? "Complete Your Profile" : "Setup Employer Account"}
          </CardTitle>
          <p className="text-gray-700 text-sm mt-1">
            Tell us about yourself so we can personalize your experience
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm font-medium mb-4">
              <span className={`${step >= 1 ? "text-black" : "text-gray-400"}`}>Account Type</span>
              <span className={`${step >= 2 ? "text-black" : "text-gray-400"}`}>Personal Info</span>
              <span className={`${step >= 3 ? "text-black" : "text-gray-400"}`}>Professional</span>
              <span className={`${step >= 4 ? "text-black" : "text-gray-400"}`}>Preferences</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-lime-300 h-2 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Step {step} of 4</p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select your account type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    userType === "employee"
                      ? "border-lime-300 bg-lime-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUserType("employee")}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-lime-300 rounded-full flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-black" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Job Seeker</h4>
                      <p className="text-sm text-gray-500">Find the perfect job match</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> AI CV analysis and optimization
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> Personalized job recommendations
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> Career roadmap planning
                    </li>
                  </ul>
                </div>

                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    userType === "employer"
                      ? "border-lime-300 bg-lime-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUserType("employer")}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-lime-300 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-black" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Employer</h4>
                      <p className="text-sm text-gray-500">Find the perfect candidates</p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> AI-powered candidate matching
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> Resume screening and analysis
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2" /> Talent pool management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="border-gray-300 focus:border-lime-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="border-gray-300 focus:border-lime-300"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="border-gray-300 focus:border-lime-300"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Professional Information</h3>
              {userType === "employee" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Current Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer"
                      className="border-gray-300 focus:border-lime-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Select 
                      value={formData.yearsOfExperience} 
                      onValueChange={value => handleSelectChange("yearsOfExperience", value)}
                    >
                      <SelectTrigger id="yearsOfExperience" className="border-gray-300 focus:border-lime-300">
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Education</Label>
                    <Select 
                      value={formData.education} 
                      onValueChange={value => handleSelectChange("education", value)}
                    >
                      <SelectTrigger id="education" className="border-gray-300 focus:border-lime-300">
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="associate">Associate Degree</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">Ph.D. or Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="block mb-2">Key Skills (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill}`} 
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={() => handleSkillsChange(skill)}
                            className="text-lime-300 border-gray-300 focus:border-lime-300"
                          />
                          <label
                            htmlFor={`skill-${skill}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      className="border-gray-300 focus:border-lime-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Your Job Title</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., HR Manager"
                      className="border-gray-300 focus:border-lime-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={value => handleSelectChange("industry", value)}
                    >
                      <SelectTrigger id="industry" className="border-gray-300 focus:border-lime-300">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Preferences</h3>
              {userType === "employee" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block mb-2">What are you looking for? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {jobPreferences.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`pref-${item}`} 
                            checked={formData.lookingFor.includes(item)}
                            onCheckedChange={() => handleLookingForChange(item)}
                            className="text-lime-300 border-gray-300 focus:border-lime-300"
                          />
                          <label
                            htmlFor={`pref-${item}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Remote Work Preference</Label>
                    <RadioGroup 
                      value={formData.remotePreference} 
                      onValueChange={value => handleSelectChange("remotePreference", value)}
                      className="flex flex-col space-y-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="remote" id="remote" />
                        <Label htmlFor="remote" className="font-normal">Fully Remote</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hybrid" id="hybrid" />
                        <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="on-site" id="on-site" />
                        <Label htmlFor="on-site" className="font-normal">On-site</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block mb-2">What roles are you hiring for? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {hiringRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`role-${role}`} 
                            checked={formData.lookingFor.includes(role)}
                            onCheckedChange={() => handleLookingForChange(role)}
                            className="text-lime-300 border-gray-300 focus:border-lime-300"
                          />
                          <label
                            htmlFor={`role-${role}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-black hover:bg-gray-50"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            {step === 1 && <div />}
            <Button
              className="bg-black hover:bg-gray-800 text-lime-300"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-lime-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up...
                </span>
              ) : step < 4 ? (
                <span className="flex items-center">
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components
const CheckIcon = ({ className = "" }) => (
  <svg className={`w-4 h-4 text-black ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Sample data
const commonSkills = [
  "JavaScript", "React", "Node.js", "Python", "Java", "SQL", 
  "Product Management", "UX/UI Design", "Data Analysis", 
  "Digital Marketing", "Leadership", "Project Management"
];

const jobPreferences = [
  "Full-time job", "Part-time job", "Contract work", "Remote work", 
  "Career advice", "Skill development", "Networking", "Mentorship"
];

const hiringRoles = [
  "Software Engineers", "Product Managers", "UX/UI Designers", 
  "Data Scientists", "Marketing Specialists", "Sales Representatives", 
  "Customer Support", "Project Managers"
]; 