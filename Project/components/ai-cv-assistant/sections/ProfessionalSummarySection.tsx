"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bold, Italic, Underline, List, ListOrdered, Link, HelpCircle } from "lucide-react";

interface ProfessionalSummarySectionProps {
  data: string;
  updateData: (data: string) => void;
}

export function ProfessionalSummarySection({ data, updateData }: ProfessionalSummarySectionProps) {
  const [characterCount, setCharacterCount] = useState(data.length);
  const [showAIHelp, setShowAIHelp] = useState(false);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    updateData(text);
    setCharacterCount(text.length);
  };
  
  const formatText = (format: 'bold' | 'italic' | 'underline' | 'bullet' | 'numbered' | 'link') => {
    // In a real app, this would apply the formatting to the selected text
    // For this demo, we'll just show the UI elements
    console.log(`Applying ${format} formatting`);
  };
  
  const generateAISummary = () => {
    // In a real app, this would call an API to generate a summary
    setShowAIHelp(true);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Professional Summary</CardTitle>
        <CardDescription>
          Write 2-4 short, energetic sentences about how great you are. Mention the role and what you did. 
          What were the big achievements? Describe your motivation and list your skills.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Formatting toolbar */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-t-md p-2 bg-gray-50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="h-5 w-px bg-gray-300 mx-1"></div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('bullet')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('numbered')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="h-5 w-px bg-gray-300 mx-1"></div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded hover:bg-gray-200"
            onClick={() => formatText('link')}
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <div className="flex-1"></div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-2"
            onClick={generateAISummary}
          >
            <Sparkles className="h-4 w-4" />
            Get help with writing
          </Button>
        </div>
        
        {/* Text area */}
        <textarea
          value={data}
          onChange={handleTextChange}
          placeholder="Curious science teacher with 8+ years of experience and a track record of improving test scores. Passionate about making complex concepts accessible to all learning styles through creative, hands-on approaches."
          className="w-full h-48 p-4 border border-gray-200 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        
        {/* Character count */}
        <div className="text-right text-sm text-gray-500">
          <span>{characterCount}</span>
          <span className="mx-1">/</span>
          <span>400+</span>
        </div>
        
        {/* AI Writing Assistant */}
        {showAIHelp && (
          <div className="mt-6 border border-blue-200 rounded-md p-4 bg-blue-50">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-700 mb-2">AI Writing Assistant</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Here are some suggestions for your professional summary based on your profile:
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-blue-100 rounded-md text-sm">
                    Results-driven software engineer with 5+ years of experience developing scalable web applications. 
                    Specializing in React, Node.js, and cloud architecture with a proven track record of reducing load times by 40% 
                    and implementing CI/CD pipelines that cut deployment time in half.
                  </div>
                  
                  <div className="p-3 bg-white border border-blue-100 rounded-md text-sm">
                    Innovative frontend developer with expertise in modern JavaScript frameworks and responsive design. 
                    Passionate about creating intuitive user experiences that drive engagement and conversion. 
                    Consistently delivered projects on time while exceeding quality expectations.
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2" onClick={() => setShowAIHelp(false)}>
                    Dismiss
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recruiter tip */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md mt-6">
          <HelpCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Recruiter tip:</span> write 400-600 characters to increase interview chances
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 