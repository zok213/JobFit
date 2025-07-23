"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Save, Download, ArrowRight, PlusCircle, Trash2, FileText, Edit, Star, Clock, ArrowLeft, User, Briefcase, GraduationCap } from "lucide-react";

type WorkExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Skill = {
  id: string;
  name: string;
  level: number; // 1-100
};

type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
};

type CVData = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: string[];
  languages: { language: string; proficiency: string }[];
};

export function CVEditor() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [cvData, setCVData] = useState<CVData>(sampleCVData);

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedSections = 0;
    let totalSections = 4; // personal, summary, work, education
    
    // Check personal info completion
    const personalFields = Object.values(cvData.personalInfo);
    if (personalFields.filter(field => field.length > 0).length >= 3) {
      completedSections++;
    }
    
    // Check summary completion
    if (cvData.summary.length > 0) {
      completedSections++;
    }
    
    // Check work experience completion
    if (cvData.workExperience.length > 0) {
      completedSections++;
    }
    
    // Check education completion
    if (cvData.education.length > 0) {
      completedSections++;
    }
    
    return Math.round((completedSections / totalSections) * 100);
  };

  const handleInputChange = (
    section: keyof CVData,
    field: string,
    value: string
  ) => {
    if (section === "personalInfo") {
      setCVData({
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          [field]: value,
        },
      });
    } else if (section === "summary") {
      setCVData({
        ...cvData,
        summary: value,
      });
    }
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updatedExperiences = [...cvData.workExperience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setCVData({
      ...cvData,
      workExperience: updatedExperiences,
    });
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: [""],
    };
    setCVData({
      ...cvData,
      workExperience: [...cvData.workExperience, newExperience],
    });
  };

  const removeWorkExperience = (index: number) => {
    const updatedExperiences = [...cvData.workExperience];
    updatedExperiences.splice(index, 1);
    setCVData({
      ...cvData,
      workExperience: updatedExperiences,
    });
  };

  const addAchievement = (expIndex: number) => {
    const updatedExperiences = [...cvData.workExperience];
    updatedExperiences[expIndex].achievements.push("");
    setCVData({
      ...cvData,
      workExperience: updatedExperiences,
    });
  };

  const updateAchievement = (expIndex: number, achievementIndex: number, value: string) => {
    const updatedExperiences = [...cvData.workExperience];
    updatedExperiences[expIndex].achievements[achievementIndex] = value;
    setCVData({
      ...cvData,
      workExperience: updatedExperiences,
    });
  };

  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const updatedExperiences = [...cvData.workExperience];
    updatedExperiences[expIndex].achievements.splice(achievementIndex, 1);
    setCVData({
      ...cvData,
      workExperience: updatedExperiences,
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updatedEducation = [...cvData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setCVData({
      ...cvData,
      education: updatedEducation,
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setCVData({
      ...cvData,
      education: [...cvData.education, newEducation],
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...cvData.education];
    updatedEducation.splice(index, 1);
    setCVData({
      ...cvData,
      education: updatedEducation,
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: field === "level" ? parseInt(value) : value,
    };
    setCVData({
      ...cvData,
      skills: updatedSkills,
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: "",
      level: 70,
    };
    setCVData({
      ...cvData,
      skills: [...cvData.skills, newSkill],
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills.splice(index, 1);
    setCVData({
      ...cvData,
      skills: updatedSkills,
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification or redirect
    }, 1500);
  };

  const downloadCV = () => {
    // Download CV logic
    console.log("Downloading CV...");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar with tab navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-bold">Completion</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                calculateCompletion() < 40 ? 'bg-red-100 text-red-800' : 
                calculateCompletion() < 70 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {calculateCompletion()}%
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {calculateCompletion() < 40 ? 'Your CV needs more information' : 
              calculateCompletion() < 70 ? 'Your CV is getting there' : 
              'Your CV is looking great!'}
            </p>
          </div>
          
          <div className="space-y-1.5">
            <div className="text-sm font-medium text-gray-500 mb-2">CV SECTIONS</div>
            <Tabs value={activeTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
                {[
                  { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
                  { id: "summary", label: "Professional Summary", icon: <FileText className="h-4 w-4" /> },
                  { id: "experience", label: "Work Experience", icon: <Briefcase className="h-4 w-4" /> },
                  { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
                  { id: "skills", label: "Skills", icon: <Star className="h-4 w-4" /> }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
                    className={`justify-start text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                      activeTab === tab.id 
                        ? "bg-blue-50 text-blue-700 border-blue-200 font-medium" 
                        : "bg-white border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {tab.icon}
                      </div>
                      <span>{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Tabs value={activeTab} className="w-full">
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="p-6 space-y-6 m-0">
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={cvData.personalInfo.name}
                        onChange={(e) => handleInputChange("personalInfo", "name", e.target.value)}
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
                        placeholder="City, Country"
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => handleInputChange("personalInfo", "linkedin", e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={cvData.personalInfo.github}
                        onChange={(e) => handleInputChange("personalInfo", "github", e.target.value)}
                        placeholder="github.com/username"
                        className="border-gray-300 focus:border-blue-300"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Summary Tab */}
                <TabsContent value="summary" className="p-6 space-y-6 m-0">
                  <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Write a compelling summary of your professional background</Label>
                    <Textarea
                      id="summary"
                      value={cvData.summary}
                      onChange={(e) => handleInputChange("summary", "", e.target.value)}
                      className="min-h-[150px] border-gray-300 focus:border-blue-300"
                      placeholder="Experienced professional with expertise in..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This is the first thing employers will read. Make it concise and impactful.
                    </p>
                  </div>
                </TabsContent>

                {/* Work Experience Tab */}
                <TabsContent value="experience" className="p-6 space-y-6 m-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={addWorkExperience}
                    >
                      <PlusCircle className="h-4 w-4" /> Add Experience
                    </Button>
                  </div>
                  
                  {cvData.workExperience.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No work experience added yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-lime-300 hover:bg-lime-50"
                        onClick={addWorkExperience}
                      >
                        Add Work Experience
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {cvData.workExperience.map((experience, index) => (
                        <Card key={experience.id} className="border-gray-200 shadow-sm">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`company-${index}`}>Company</Label>
                                    <Input
                                      id={`company-${index}`}
                                      value={experience.company}
                                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`position-${index}`}>Position</Label>
                                    <Input
                                      id={`position-${index}`}
                                      value={experience.position}
                                      onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                                    <Input
                                      id={`start-date-${index}`}
                                      type="month"
                                      value={experience.startDate}
                                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`end-date-${index}`}>End Date</Label>
                                    <Input
                                      id={`end-date-${index}`}
                                      type="month"
                                      value={experience.endDate}
                                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                                      placeholder="Present"
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                  <Label htmlFor={`description-${index}`}>Job Description</Label>
                                  <Textarea
                                    id={`description-${index}`}
                                    value={experience.description}
                                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                                    className="min-h-[100px] border-gray-300 focus:border-lime-300"
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-500"
                                onClick={() => removeWorkExperience(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Key Achievements</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-black"
                                  onClick={() => addAchievement(index)}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                              </div>
                              {experience.achievements.map((achievement, aidx) => (
                                <div key={`${experience.id}-a-${aidx}`} className="flex items-center gap-2">
                                  <Input
                                    value={achievement}
                                    onChange={(e) => updateAchievement(index, aidx, e.target.value)}
                                    placeholder="Describe a specific achievement or responsibility"
                                    className="border-gray-300 focus:border-lime-300"
                                  />
                                  {experience.achievements.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-500 hover:text-red-500"
                                      onClick={() => removeAchievement(index, aidx)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Education Tab */}
                <TabsContent value="education" className="p-6 space-y-6 m-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={addEducation}
                    >
                      <PlusCircle className="h-4 w-4" /> Add Education
                    </Button>
                  </div>
                  
                  {cvData.education.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No education entries added yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-lime-300 hover:bg-lime-50"
                        onClick={addEducation}
                      >
                        Add Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.education.map((education, index) => (
                        <Card key={education.id} className="border-gray-200 shadow-sm">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                                    <Input
                                      id={`institution-${index}`}
                                      value={education.institution}
                                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                                    <Input
                                      id={`degree-${index}`}
                                      value={education.degree}
                                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`field-${index}`}>Field of Study</Label>
                                    <Input
                                      id={`field-${index}`}
                                      value={education.field}
                                      onChange={(e) => updateEducation(index, "field", e.target.value)}
                                      className="border-gray-300 focus:border-lime-300"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label htmlFor={`edu-start-${index}`}>Start Year</Label>
                                      <Input
                                        id={`edu-start-${index}`}
                                        type="month"
                                        value={education.startDate}
                                        onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                                        className="border-gray-300 focus:border-lime-300"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edu-end-${index}`}>End Year</Label>
                                      <Input
                                        id={`edu-end-${index}`}
                                        type="month"
                                        value={education.endDate}
                                        onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                                        className="border-gray-300 focus:border-lime-300"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                  <Label htmlFor={`edu-description-${index}`}>Description</Label>
                                  <Textarea
                                    id={`edu-description-${index}`}
                                    value={education.description}
                                    onChange={(e) => updateEducation(index, "description", e.target.value)}
                                    placeholder="Relevant coursework, honors, activities, etc."
                                    className="min-h-[100px] border-gray-300 focus:border-lime-300"
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-500"
                                onClick={() => removeEducation(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Skills Tab */}
                <TabsContent value="skills" className="p-6 space-y-6 m-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={addSkill}
                    >
                      <PlusCircle className="h-4 w-4" /> Add Skill
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cvData.skills.map((skill, index) => (
                      <Card key={skill.id} className="border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <Input
                              value={skill.name}
                              onChange={(e) => updateSkill(index, "name", e.target.value)}
                              placeholder="Skill name"
                              className="border-gray-300 focus:border-lime-300"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeSkill(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <label htmlFor={`skill-level-${index}`} className="text-xs text-gray-500">
                                Proficiency Level: {skill.level}%
                              </label>
                            </div>
                            <input
                              id={`skill-level-${index}`}
                              type="range"
                              min="1"
                              max="100"
                              value={skill.level}
                              onChange={(e) => updateSkill(index, "level", e.target.value)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-300"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Beginner</span>
                              <span>Intermediate</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {cvData.skills.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No skills added yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-lime-300 hover:bg-lime-50"
                        onClick={addSkill}
                      >
                        Add Skills
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                const tabOrder = ["personal", "summary", "experience", "education", "skills"];
                const currentIndex = tabOrder.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabOrder[currentIndex - 1]);
                }
              }}
              disabled={activeTab === "personal"}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button 
              onClick={() => {
                const tabOrder = ["personal", "summary", "experience", "education", "skills"];
                const currentIndex = tabOrder.indexOf(activeTab);
                if (currentIndex < tabOrder.length - 1) {
                  setActiveTab(tabOrder[currentIndex + 1]);
                } else {
                  handleSave();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {activeTab === "skills" ? (
                isLoading ? "Saving..." : "Save CV"
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for Education tab
const GraduationHat = ({ className = "" }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none"
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

// Sample data for testing
const sampleCVData: CVData = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+44 123 456 7890",
    location: "London, UK",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  summary: "Experienced software developer with 5+ years building web applications using React, Node.js, and TypeScript. Strong problem-solving abilities and excellent team collaboration skills. Successfully delivered projects for fintech and e-commerce clients, reducing load times by 40% and increasing user engagement.",
  workExperience: [
    {
      id: "exp-1",
      company: "TechSolutions Ltd",
      position: "Senior Frontend Developer",
      startDate: "2021-01",
      endDate: "2023-06",
      description: "Led a team of developers building modern web applications for enterprise clients.",
      achievements: [
        "Implemented new React component library reducing development time by 30%",
        "Optimized application performance, improving load times by 40%",
        "Mentored 5 junior developers in modern frontend development practices"
      ],
    },
    {
      id: "exp-2",
      company: "Digital Innovations",
      position: "Frontend Developer",
      startDate: "2018-03",
      endDate: "2020-12",
      description: "Developed responsive web applications using React, Redux, and TypeScript.",
      achievements: [
        "Built and maintained 3 major client applications with 10k+ daily users",
        "Implemented automated testing reducing bug reports by 25%",
        "Collaborated with design team to improve UI/UX"
      ],
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of London",
      degree: "BSc",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-06",
      description: "Specialized in web technologies and software development. Graduated with First Class Honours.",
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "React",
      level: 92,
    },
    {
      id: "skill-2",
      name: "TypeScript",
      level: 88,
    },
    {
      id: "skill-3",
      name: "Node.js",
      level: 85,
    },
    {
      id: "skill-4",
      name: "Redux",
      level: 80,
    },
    {
      id: "skill-5",
      name: "Git",
      level: 90,
    },
    {
      id: "skill-6",
      name: "REST APIs",
      level: 87,
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Redux"],
      link: "github.com/alexjohnson/ecommerce-platform",
    }
  ],
  certifications: [
    "AWS Certified Developer Associate",
    "Google Professional Cloud Developer"
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "French", proficiency: "Intermediate" }
  ]
}; 