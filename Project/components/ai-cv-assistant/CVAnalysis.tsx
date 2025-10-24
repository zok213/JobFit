"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, AlertTriangle, ArrowRight, Download, Edit, 
  ArrowLeft, Sparkles, FileEdit, FileUp, MessageSquare, Zap, FileSignature, AlertCircle, FileText, Share2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/components/LinkButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCVAssistantStore, CVAssistantStep } from "@/store/cvAssistantStore";

export function CVAnalysis() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("summary");
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "strengths" | "improvements">("all");
  
  // Get data from the store
  const { 
    analysis, 
    setCurrentStep, 
    isAnalyzing,
    loadDemoData 
  } = useCVAssistantStore(state => ({
    analysis: state.analysis,
    setCurrentStep: state.setCurrentStep,
    isAnalyzing: state.isAnalyzing,
    loadDemoData: state.loadDemoData
  }));

  // Load demo data if we don't have analysis data and we're not in the analyzing state
  if (!analysis && !isAnalyzing) {
    loadDemoData();
  }

  // Handler functions
  const handleDownloadReport = async () => {
    try {
      // Prepare analysis data for PDF generation
      const analysisData = {
        overallScore: analysis?.overallScore || 0,
        scores: Object.entries(analysis?.scores || {}).map(([category, score]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          score: score as number
        })),
        strengths: analysis?.insights
          ?.filter((i: any) => i.strength >= 70)
          ?.map((i: any) => i.text) || [],
        improvements: analysis?.suggestions
          ?.map((s: any) => ({
            area: s.section || 'General',
            suggestion: s.description || s.title
          })) || [],
        keywords: {
          matched: analysis?.presentKeywords || [],
          missing: analysis?.missingKeywords || []
        },
        recommendations: analysis?.suggestions
          ?.map((s: any) => `[${s.priority?.toUpperCase()}] ${s.title}: ${s.description}`) || []
      };

      // Generate PDF report via API
      const response = await fetch('/api/export-analysis-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_Analysis_Report_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('❌ Lỗi khi tải báo cáo! Vui lòng thử lại.');
    }
  };

  const handleEnhanceCV = () => {
    router.push('/cv-assistant/builder');
  };

  const handleDownloadAnalysis = () => {
    // Download analysis as JSON
    const analysisData = {
      overallScore: analysis?.overallScore,
      scores: analysis?.scores,
      insights: analysis?.insights,
      summary: analysis?.summary,
      skills: analysis?.skills,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleShareAnalysis = async () => {
    const shareText = `Phân tích CV của tôi:\n\n📊 Điểm tổng thể: ${analysis?.overallScore}%\n\n✅ Điểm mạnh:\n${analysis?.insights?.filter(i => i.strength >= 70).map(i => `• ${i.text}`).join('\n')}\n\n🔧 Cần cải thiện:\n${analysis?.insights?.filter(i => i.strength < 70).map(i => `• ${i.text}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Phân tích CV',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('✅ Đã sao chép kết quả phân tích vào clipboard!');
    }
  };

  // Handle loading state
  if (isAnalyzing || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="w-16 h-16 border-4 border-lime-200 border-t-lime-500 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-medium mb-2">Analyzing your CV...</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Our AI is reviewing your resume against industry standards and best practices. 
          This may take a minute.
        </p>
      </div>
    );
  }

  const handleContinue = () => {
    setCurrentStep(CVAssistantStep.ENHANCE);
  };

  // Function to get badge and icon based on strength rating
  const getStrengthIndicator = (rating: number) => {
    if (rating >= 80) {
      return {
        badge: "bg-lime-100 text-black border-lime-200",
        icon: <CheckCircle className="h-4 w-4 text-black mr-1.5" />,
        text: "Strong"
      };
    } else if (rating >= 50) {
      return {
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <AlertTriangle className="h-4 w-4 text-amber-600 mr-1.5" />,
        text: "Improve"
      };
    } else {
      return {
        badge: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-4 w-4 text-red-600 mr-1.5" />,
        text: "Weak"
      };
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button and header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          onClick={() => router.push('/cv-assistant')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to CV Assistant</span>
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 border-gray-200 hover:bg-lime-50 hover:border-lime-300 transition-all"
            onClick={() => setOpenDialog('ai-help')}
          >
            <Sparkles className="h-4 w-4 text-lime-600" />
            <span>AI CV Help</span>
          </Button>
        </div>
      </div>
      
      {/* Score summary */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">CV Analysis Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-sm font-medium">{analysis.overallScore}%</span>
                  </div>
                  <Progress value={analysis.overallScore} className="h-2" indicatorClassName="bg-lime-300" />
                </div>
                
                {Object.entries(analysis.scores).map(([key, score]: [string, number]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                    <Progress 
                      value={score} 
                      className="h-2" 
                      indicatorClassName={
                        score >= 80 
                          ? "bg-lime-300" 
                          : score >= 50 
                          ? "bg-amber-500" 
                          : "bg-red-500"
                      } 
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 border-l pl-8 border-gray-200 hidden md:block">
              <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
              <div className="space-y-2">
                {analysis.insights
                  .sort((a, b) => b.strength - a.strength)
                  .map((insight, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-2 ${
                        insight.strength >= 70 ? "text-green-700" : "text-amber-700"
                      }`}
                    >
                      {insight.strength >= 70 ? (
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm">{insight.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeSection === 'summary' ? 'text-black border-b-2 border-lime-300' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('summary')}
        >
          Summary
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeSection === 'suggestions' ? 'text-black border-b-2 border-lime-300' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('suggestions')}
        >
          Improvement Suggestions
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeSection === 'keywords' ? 'text-black border-b-2 border-lime-300' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSection('keywords')}
        >
          Keywords Analysis
        </button>
      </div>

      {/* Section content */}
      {activeSection === 'summary' && (
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">CV Summary</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCustomizeDialog(true)}>
                  Customize <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3">Skills Assessment</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analysis.skills.map((skill, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <Badge className={
                        skill.level >= 80 
                          ? "bg-lime-100 text-black border-lime-200" 
                          : skill.level >= 50 
                          ? "bg-amber-100 text-amber-800 border-amber-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                      }>
                        {skill.level}%
                      </Badge>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-1.5" 
                      indicatorClassName={
                        skill.level >= 80 
                          ? "bg-lime-300" 
                          : skill.level >= 50 
                          ? "bg-amber-500" 
                          : "bg-red-500"
                      } 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'suggestions' && (
        <div className="space-y-4">
          <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Key Skills</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={viewMode === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("all")}
                    className="text-xs h-8"
                  >
                    All
                  </Button>
                  <Button 
                    variant={viewMode === "strengths" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("strengths")}
                    className="text-xs h-8"
                  >
                    Strengths
                  </Button>
                  <Button 
                    variant={viewMode === "improvements" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setViewMode("improvements")}
                    className="text-xs h-8"
                  >
                    Needs Improvement
                  </Button>
                </div>
                  </div>
              
              <div className="space-y-4">
                {analysis.skills
                  .filter(skill => {
                    if (viewMode === "all") return true;
                    if (viewMode === "strengths") return skill.level >= 75;
                    if (viewMode === "improvements") return skill.level < 75;
                    return true;
                  })
                  .map((skill, index) => (
                    <div key={index} className="border-l-4 pl-4 py-1" 
                      style={{ 
                        borderColor: skill.level >= 80 
                          ? "#84cc16" 
                          : skill.level >= 60 
                          ? "#f59e0b" 
                          : "#ef4444"
                      }}
                    >
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <span>{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" 
                          style={{ 
                            backgroundColor: skill.level >= 80 
                              ? "#ecfccb" 
                              : skill.level >= 60 
                              ? "#fef3c7" 
                              : "#fecaca",
                            color: skill.level >= 80 
                              ? "#3f6212" 
                              : skill.level >= 60 
                              ? "#b45309" 
                              : "#b91c1c"
                          }}
                        >
                          {skill.level}%
                        </span>
                      </h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
      )}

      {activeSection === 'keywords' && (
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Industry Keywords</h3>
              <p className="text-gray-600 mb-4">These keywords are frequently found in job postings in your industry.</p>
              <div className="flex flex-wrap gap-2">
                {analysis.industryKeywords.map((keyword, index) => (
                  <Badge key={index} className={
                    analysis.presentKeywords.includes(keyword)
                      ? "bg-lime-100 text-black border-lime-200" 
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }>
                    {analysis.presentKeywords.includes(keyword) && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Missing Keywords</h3>
              <p className="text-gray-600 mb-4">Consider adding these relevant keywords to your CV to improve visibility.</p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((keyword, index) => (
                  <Badge key={index} className="bg-amber-100 text-amber-800 border-amber-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline" 
          className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          onClick={handleDownloadReport}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <LinkButton 
          variant="outline" 
          href="/cv-assistant/editor"
          className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          icon={<Edit className="h-4 w-4" />}
          aria-label="Edit your CV"
        >
          Edit CV
        </LinkButton>
        <LinkButton 
          href="/job-match" 
          className="bg-black hover:bg-gray-800 text-lime-300 transition-all shadow-sm hover:shadow"
          trailingIcon={<ArrowRight className="h-4 w-4" />}
          aria-label="Find matching jobs"
        >
          Find Matching Jobs
        </LinkButton>
      </div>
      
      {/* AI CV Helpers */}
      <Dialog open={openDialog === "ai-help"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">AI CV Assistant</DialogTitle>
            <DialogDescription>
              Choose how you want our AI to help with your CV
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <button 
              className="flex items-start gap-4 p-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
              onClick={() => {
                setOpenDialog(null);
                router.push('/cv-assistant/builder');
              }}
            >
              <div className="p-2 rounded-full bg-lime-100">
                <FileSignature className="h-5 w-5 text-lime-700" />
              </div>
              <div>
                <h3 className="font-medium text-black">Build a New CV</h3>
                <p className="text-sm text-gray-600 mt-1">Create a professional CV from scratch with AI guidance</p>
              </div>
            </button>
            
            <button 
              className="flex items-start gap-4 p-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
              onClick={() => {
                setOpenDialog(null);
                router.push('/cv-assistant/editor');
              }}
            >
              <div className="p-2 rounded-full bg-blue-100">
                <FileEdit className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium text-black">AI Edit Current CV</h3>
                <p className="text-sm text-gray-600 mt-1">Get AI suggestions to improve individual sections</p>
              </div>
            </button>
            
            <button 
              className="flex items-start gap-4 p-4 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200"
              onClick={() => {
                setOpenDialog('ai-optimize');
              }}
            >
              <div className="p-2 rounded-full bg-purple-100">
                <Zap className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-medium text-black">Optimize for Job Match</h3>
                <p className="text-sm text-gray-600 mt-1">Let AI optimize your CV for specific job descriptions</p>
              </div>
            </button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Optimize Dialog */}
      <Dialog open={openDialog === "ai-optimize"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">AI CV Optimizer</DialogTitle>
            <DialogDescription>
              Let our AI optimize your CV for specific job positions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Paste Job Description</span>
              </h3>
              <textarea 
                className="w-full h-32 border border-gray-200 rounded-md p-3 text-sm focus:ring-1 focus:ring-lime-300 focus:border-lime-300"
                placeholder="Paste the job description here to optimize your CV for that specific role..."
              ></textarea>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-4 bg-lime-50">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-lime-600" />
                <span>AI Optimization Features</span>
              </h3>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="keywords" className="rounded-sm text-lime-500" defaultChecked />
                  <label htmlFor="keywords" className="text-sm">Match keywords from job description</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="skills" className="rounded-sm text-lime-500" defaultChecked />
                  <label htmlFor="skills" className="text-sm">Highlight relevant skills</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="achievements" className="rounded-sm text-lime-500" defaultChecked />
                  <label htmlFor="achievements" className="text-sm">Rewrite achievements to match requirements</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="summary" className="rounded-sm text-lime-500" defaultChecked />
                  <label htmlFor="summary" className="text-sm">Optimize professional summary</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setOpenDialog('ai-help')}>Back</Button>
            <Button className="bg-black text-lime-300 hover:bg-gray-800">
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize My CV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-8 text-center">
        <Button
          onClick={handleEnhanceCV}
          className="bg-black hover:bg-gray-800 text-lime-400"
          size="lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          Enhance Your CV
        </Button>
        
        <div className="flex justify-center mt-4 gap-4">
          <Button variant="outline" size="sm" onClick={handleDownloadAnalysis}>
            <Download className="mr-2 h-4 w-4" /> Download Analysis
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareAnalysis}>
            <Share2 className="mr-2 h-4 w-4" /> Share Analysis
          </Button>
        </div>
      </div>
      
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summary Customization</DialogTitle>
            <DialogDescription>
              Customize how you want your CV summary to appear to potential employers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md h-40"
              value={analysis.summary}
              readOnly
              aria-label="CV Summary Text"
              id="cv-summary-text"
            />
            
            <div className="flex gap-2 items-center">
              <label htmlFor="tone-select" className="text-sm font-medium">Tone:</label>
              <select 
                id="tone-select"
                className="p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Select tone for CV summary"
              >
                <option>Professional</option>
                <option>Confident</option>
                <option>Innovative</option>
                <option>Leadership-focused</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <label htmlFor="length-select" className="text-sm font-medium">Length:</label>
              <select 
                id="length-select"
                className="p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Select length for CV summary"
              >
                <option>Brief (50 words)</option>
                <option>Standard (100 words)</option>
                <option>Detailed (150+ words)</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <label htmlFor="focus-select" className="text-sm font-medium">Focus:</label>
              <select 
                id="focus-select"
                className="p-2 border border-gray-300 rounded-md text-sm"
                aria-label="Select focus for CV summary"
              >
                <option>Skills & Expertise</option>
                <option>Achievements</option>
                <option>Experience</option>
                <option>Balanced</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-black text-lime-400" onClick={() => setShowCustomizeDialog(false)}>
              Apply Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample data for testing
const sampleCVData = {
  overallScore: 78,
  scores: {
    content: 85,
    format: 72,
    relevance: 68,
    completeness: 90,
    keywords: 75
  },
  insights: [
    { text: "Strong professional summary highlights your core skills", strength: 90 },
    { text: "Work experience is well detailed with achievements", strength: 85 },
    { text: "Skills section lacks technical specificity", strength: 60 },
    { text: "Education section needs more detail", strength: 40 },
    { text: "Good use of action verbs throughout", strength: 80 }
  ],
  summary: "Experienced software developer with 5+ years building web applications using React, Node.js, and TypeScript. Strong problem-solving abilities and excellent team collaboration skills. Successfully delivered projects for fintech and e-commerce clients, reducing load times by 40% and increasing user engagement.",
  skills: [
    { name: "React", level: 92 },
    { name: "TypeScript", level: 88 },
    { name: "Node.js", level: 85 },
    { name: "Express", level: 78 },
    { name: "MongoDB", level: 72 },
    { name: "RESTful APIs", level: 90 },
    { name: "Redux", level: 65 },
    { name: "CI/CD", level: 55 },
    { name: "Unit Testing", level: 60 }
  ],
  suggestions: [
    {
      title: "Add more measurable achievements",
      description: "Include specific metrics and results for each role to demonstrate impact, such as percentage improvements, user growth, or revenue gains.",
      priority: "high",
      section: "Work Experience"
    },
    {
      title: "Expand technical skills section",
      description: "List specific tools, frameworks, and methodologies you've used, including versions and your proficiency level.",
      priority: "medium",
      section: "Skills"
    },
    {
      title: "Improve education details",
      description: "Add relevant coursework, projects, and academic achievements to strengthen your educational background.",
      priority: "medium",
      section: "Education"
    },
    {
      title: "Enhance formatting consistency",
      description: "Use consistent date formats, bullet points, and heading styles throughout the document.",
      priority: "low",
      section: "Formatting"
    }
  ],
  industryKeywords: [
    "React", "JavaScript", "TypeScript", "Frontend", "Backend", "Full-stack", 
    "Node.js", "API", "REST", "UI/UX", "Testing", "CI/CD", "Git", "Agile", 
    "Scrum", "DevOps", "MongoDB", "SQL", "Database", "AWS"
  ],
  presentKeywords: [
    "React", "TypeScript", "Node.js", "MongoDB", "RESTful APIs", "Git", "Agile"
  ],
  missingKeywords: [
    "CI/CD", "DevOps", "AWS", "Scrum", "UI/UX", "SQL"
  ]
}; 