"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search, Sparkles, Info } from "lucide-react";

interface Skill {
  id: string;
  name: string;
}

interface SkillsSectionProps {
  data: Skill[];
  updateData: (data: Skill[]) => void;
}

export function SkillsSection({ data, updateData }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  
  // Sample skill suggestions for different job roles - in a real app, these would be pulled from an API
  const skillSuggestions = {
    technical: [
      "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java", "SQL",
      "AWS", "Docker", "Kubernetes", "CI/CD", "GraphQL", "REST APIs", "MongoDB",
      "Git", "Agile", "Scrum", "Problem Solving", "Debugging", "Testing"
    ],
    soft: [
      "Communication", "Teamwork", "Leadership", "Time Management", "Conflict Resolution",
      "Adaptability", "Creativity", "Critical Thinking", "Attention to Detail", "Organization"
    ],
    management: [
      "Project Management", "Team Leadership", "Strategic Planning", "Budgeting",
      "Resource Allocation", "Risk Management", "Stakeholder Communication", "Negotiation"
    ]
  };
  
  const addSkill = (skillName: string = newSkill) => {
    const trimmedSkill = skillName.trim();
    if (trimmedSkill && !data.some(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
      const newSkillObj = {
        id: `skill-${Date.now()}`,
        name: trimmedSkill
      };
      updateData([...data, newSkillObj]);
      setNewSkill("");
    }
  };
  
  const removeSkill = (skillId: string) => {
    updateData(data.filter(skill => skill.id !== skillId));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSkill(value);
    
    // Generate suggestions based on input
    if (value.length > 1) {
      const allSkills = [...skillSuggestions.technical, ...skillSuggestions.soft, ...skillSuggestions.management];
      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) && 
        !data.some(s => s.name.toLowerCase() === skill.toLowerCase())
      ).slice(0, 5);
      
      setSuggestedSkills(filtered);
    } else {
      setSuggestedSkills([]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };
  
  const suggestRelevantSkills = () => {
    // In a real app, this would use AI to suggest skills based on the job title and other resume data
    // For this demo, we'll just suggest a random mix of skills
    const technicalCount = Math.floor(Math.random() * 3) + 3; // 3-5 technical skills
    const softCount = Math.floor(Math.random() * 2) + 2; // 2-3 soft skills
    
    const shuffled = {
      technical: [...skillSuggestions.technical].sort(() => 0.5 - Math.random()),
      soft: [...skillSuggestions.soft].sort(() => 0.5 - Math.random())
    };
    
    const suggested = [
      ...shuffled.technical.slice(0, technicalCount),
      ...shuffled.soft.slice(0, softCount)
    ].filter(skill => !data.some(s => s.name.toLowerCase() === skill.toLowerCase()));
    
    setSuggestedSkills(suggested);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Skills</CardTitle>
        <CardDescription>
          Choose 5 important skills that show you fit the position. Make sure they match the key skills mentioned in the job listing.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add skill input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={newSkill}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-12 pl-10 pr-20"
              placeholder="Add relevant skills..."
            />
            {newSkill && (
              <Button 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 py-0 bg-lime-600 hover:bg-lime-700"
                size="sm"
                onClick={() => addSkill()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
          
          {/* Skill suggestions dropdown */}
          {suggestedSkills.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 py-2">
              {suggestedSkills.map((skill, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 outline-none"
                  onClick={() => {
                    addSkill(skill);
                    setSuggestedSkills([]);
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Skills list */}
        <div className="flex flex-wrap gap-2 min-h-12">
          {data.map(skill => (
            <Badge
              key={skill.id}
              className="px-3 py-1.5 h-8 bg-lime-50 text-lime-800 border border-lime-200 flex items-center gap-1.5 hover:bg-lime-100 transition-colors group"
            >
              {skill.name}
              <button 
                onClick={() => removeSkill(skill.id)}
                className="ml-1 text-lime-500 group-hover:text-lime-700 rounded-full hover:bg-lime-200 p-0.5"
                title="Remove skill"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {data.length === 0 && (
            <div className="text-gray-500 text-sm italic">
              No skills added yet. Add skills that are relevant to the position.
            </div>
          )}
        </div>
        
        {/* AI skill suggestions */}
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={suggestRelevantSkills}
          >
            <Sparkles className="h-4 w-4" />
            Suggest relevant skills
          </Button>
          
          {/* Success indicator for resume completion */}
          {data.length >= 5 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-lime-50 border border-lime-200 rounded-md">
              <div className="h-6 w-6 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <span className="text-sm text-lime-800">
                Great job! You've added {data.length} skills to your resume.
              </span>
            </div>
          )}
        </div>
        
        {/* Common skill categories */}
        <div className="pt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Common skill categories</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.technical.slice(0, 8).map((skill, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors"
                    onClick={() => addSkill(skill)}
                    disabled={data.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <span className="inline-block w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                Soft Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.soft.slice(0, 6).map((skill, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 transition-colors"
                    onClick={() => addSkill(skill)}
                    disabled={data.some(s => s.name.toLowerCase() === skill.toLowerCase())}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tip box */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md mt-4">
          <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Pro tip:</span> Include a mix of technical and soft skills. 
            Skills that appear in the job description are especially important when applying via an online system.
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 