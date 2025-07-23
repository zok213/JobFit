"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ArrowRight, 
  Loader2, 
  Lightbulb, 
  Sparkles, 
  X, 
  ChevronRight, 
  Target, 
  Briefcase,
  BarChart3,
  Code,
  CheckCircle2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function RoadmapForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentRole: "",
    targetRole: "",
    yearsExperience: "",
    skills: [] as string[],
    interests: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skillInputFocused, setSkillInputFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      // Navigate to the visualizer with the generated roadmap
      router.push('/roadmap/visualizer');
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick start template animations
  const quickStartVariants = {
    hover: { 
      scale: 1.03, 
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      backgroundColor: "#f7fee7" 
    }
  };

  // Input field animations
  const inputVariants = {
    focused: { scale: 1.01, borderColor: "#84cc16" },
    unfocused: { scale: 1, borderColor: "#e5e7eb" }
  };

  // Card container animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-300 to-lime-400 flex items-center justify-center shadow-md">
          <Lightbulb className="h-7 w-7 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black">Generate Your Career Roadmap</h2>
          <p className="text-gray-600 mt-1 max-w-xl">
            Tell us about your career goals and we'll create a personalized development path with milestones and resources
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="border-gray-200 shadow-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-lime-300 via-lime-400 to-lime-300"></div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <motion.div 
                    className="space-y-2"
                    whileFocus="focused"
                    variants={inputVariants}
                  >
                    <Label htmlFor="currentRole" className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      Current Role
                    </Label>
                    <Input
                      id="currentRole"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      placeholder="e.g. Junior Developer"
                      required
                      className="h-12 bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2"
                    whileFocus="focused"
                    variants={inputVariants}
                  >
                    <Label htmlFor="targetRole" className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      Target Role
                    </Label>
                    <Input
                      id="targetRole"
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Developer"
                      required
                      className="h-12 bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200"
                    />
                  </motion.div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience" className="text-sm font-medium">
                      Years of Experience
                    </Label>
                    <Select
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onValueChange={(value) => handleSelectChange("yearsExperience", value)}
                    >
                      <SelectTrigger 
                        id="yearsExperience"
                        className="h-12 bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200"
                      >
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-md rounded-md">
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-medium">
                      Your Skills
                    </Label>
                    <div className="relative">
                      <Input
                        id="skillInput"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="e.g. JavaScript, React"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        onFocus={() => setSkillInputFocused(true)}
                        onBlur={() => setSkillInputFocused(false)}
                        className={`h-12 bg-white border-gray-200 pr-20 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200 ${skillInputFocused ? 'border-lime-300 ring-1 ring-lime-300' : ''}`}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addSkill}
                        className="absolute right-0 top-0 h-full border-0 border-l border-gray-200 rounded-l-none bg-gray-50 hover:bg-gray-100 hover:text-black transition-colors"
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1.5">
                          {skill}
                          <button 
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label="Remove skill"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests" className="text-sm font-medium">
                  Career Interests & Goals
                </Label>
                <Textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Briefly describe what you're interested in and what you hope to achieve in your career"
                  rows={4}
                  className="bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-black hover:bg-gray-800 text-lime-300 font-medium min-w-[200px] h-12 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating your roadmap...</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex items-center justify-center gap-2"
                      whileHover={{ gap: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Generate Roadmap</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center mb-5">
          <h3 className="text-lg font-semibold mb-1 inline-flex items-center">
            <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
            Need inspiration? Try one of these quick starts:
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div
            variants={quickStartVariants}
            whileHover="hover"
            className="border border-gray-200 bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-300"
            onClick={() => {
              setFormData({
                currentRole: "Junior Frontend Developer",
                targetRole: "Senior Frontend Engineer",
                yearsExperience: "1-3",
                skills: ["HTML", "CSS", "JavaScript", "React Basics"],
                interests: "I want to master modern frontend frameworks and eventually lead a team"
              });
            }}
          >
            <div className="flex flex-col h-full">
              <div className="bg-blue-50 text-blue-800 rounded-lg p-3 inline-flex items-center justify-center w-12 h-12 mb-3">
                <Code className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-lg mb-1">Frontend Developer Path</h4>
              <p className="text-sm text-gray-600 flex-grow mb-3">
                Progress from Junior to Senior Frontend Engineer with React expertise
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <span>Use template</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={quickStartVariants}
            whileHover="hover"
            className="border border-gray-200 bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-300"
            onClick={() => {
              setFormData({
                currentRole: "Data Analyst",
                targetRole: "Data Scientist",
                yearsExperience: "1-3",
                skills: ["SQL", "Excel", "Data Visualization", "Python Basics"],
                interests: "I want to transition into a more technical data science role with ML focus"
              });
            }}
          >
            <div className="flex flex-col h-full">
              <div className="bg-purple-50 text-purple-800 rounded-lg p-3 inline-flex items-center justify-center w-12 h-12 mb-3">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-lg mb-1">Data Analyst to Scientist</h4>
              <p className="text-sm text-gray-600 flex-grow mb-3">
                Transition from analytics to data science with machine learning focus
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <span>Use template</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={quickStartVariants}
            whileHover="hover"
            className="border border-gray-200 bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all duration-300"
            onClick={() => {
              setFormData({
                currentRole: "Product Manager",
                targetRole: "Director of Product",
                yearsExperience: "3-5",
                skills: ["Product Strategy", "User Research", "Roadmapping", "Agile"],
                interests: "I want to grow my leadership skills and lead a product organization"
              });
            }}
          >
            <div className="flex flex-col h-full">
              <div className="bg-lime-50 text-lime-800 rounded-lg p-3 inline-flex items-center justify-center w-12 h-12 mb-3">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-lg mb-1">Product Leadership</h4>
              <p className="text-sm text-gray-600 flex-grow mb-3">
                Grow from Product Manager to Director with leadership focus
              </p>
              <div className="flex items-center text-lime-600 text-sm font-medium">
                <span>Use template</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add Milestone Tick UI for better UX */}
      <div className="space-y-2 mt-6 border-t border-gray-100 pt-6">
        <Label className="text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-lime-600" />
          Track Your Progress
        </Label>
        <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-3">Mark milestones as you complete them</div>
          <div className="space-y-2">
            {['Basic skill acquisition', 'Project completion', 'Certification earned', 'Role transition'].map((milestone, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                <span>{milestone}</span>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-lime-100"
                  onClick={() => console.log(`Marked "${milestone}" as complete`)}
                >
                  <CheckCircle2 className="h-5 w-5 text-lime-600" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 