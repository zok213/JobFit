"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Layers,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import { PersonalDetailsSection } from "./sections/PersonalDetailsSection";
import { ProfessionalSummarySection } from "./sections/ProfessionalSummarySection";
import { EmploymentHistorySection } from "./sections/EmploymentHistorySection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { LinksSection } from "./sections/LinksSection";
import { CustomSectionsPanel } from "./sections/CustomSectionsPanel";

export function CVBuilder() {
  // Tab state and navigation
  const [activeTab, setActiveTab] = useState("personal");
  const [completedSections, setCompletedSections] = useState<string[]>([
    "personal",
  ]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // CV data state
  const [cvData, setCvData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      country: "",
      photoUrl: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    links: [],
    customSections: [],
  });

  // Resume score calculation (simplified)
  const getResumeScore = () => {
    let score = 0;
    
    // Personal info (30 points total)
    if (cvData.personal.firstName && cvData.personal.lastName) score += 10;
    if (cvData.personal.jobTitle) score += 5;
    if (cvData.personal.email) score += 5;
    if (cvData.personal.phone) score += 5;
    if (cvData.personal.location) score += 5;
    
    // Summary (15 points)
    if (cvData.summary && cvData.summary.length > 50) score += 15;
    
    // Experience (25 points)
    if (cvData.experience.length > 0) score += 15;
    if (cvData.experience.length > 1) score += 10;
    
    // Education (15 points)
    if (cvData.education.length > 0) score += 15;
    
    // Skills (10 points)
    if (cvData.skills.length >= 3) score += 10;
    
    // Links (5 points)
    if (cvData.links.length > 0) score += 5;
    
    return Math.min(score, 100);
  };

  // Check if current section can proceed
  const canProceedToNext = () => {
    switch (activeTab) {
      case "personal":
        return cvData.personal.firstName && 
               cvData.personal.lastName && 
               cvData.personal.email;
      case "summary":
        return cvData.summary && cvData.summary.length > 20;
      case "experience":
        return cvData.experience.length > 0;
      case "education":
        return cvData.education.length > 0;
      case "skills":
        return cvData.skills.length >= 3;
      default:
        return true;
    }
  };

  // Handle navigation between tabs
  const handleNextSection = () => {
    const tabOrder = [
      "personal",
      "summary",
      "experience",
      "education",
      "skills",
      "links",
      "custom",
    ];
    const currentIndex = tabOrder.indexOf(activeTab);

    // Mark current section as completed if not already
    if (!completedSections.includes(activeTab)) {
      setCompletedSections([...completedSections, activeTab]);
    }

    // If at the last section (custom), complete the CV
    if (currentIndex === tabOrder.length - 1) {
      handleCompleteCV();
      return;
    }

    // Otherwise, move to next tab
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setActiveTab(nextTab);
    }
  };

  const handleCompleteCV = () => {
    // Save final CV data
    localStorage.setItem('cv-builder-data', JSON.stringify(cvData));
    
    // Show completion modal
    setShowCompletionModal(true);
  };

  const handleExportPDF = async () => {
    try {
      // Convert blob URL to base64 if needed
      let dataToSend = { ...cvData };
      
      if (cvData.personal?.photoUrl && cvData.personal.photoUrl.startsWith('blob:')) {
        try {
          // Fetch the blob and convert to base64
          const response = await fetch(cvData.personal.photoUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          dataToSend = {
            ...cvData,
            personal: {
              ...cvData.personal,
              photoUrl: base64
            }
          };
        } catch (error) {
          console.error('Error converting photo:', error);
          // Continue without photo
        }
      }
      
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fullName = `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`.trim();
      a.download = `CV_${fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Có lỗi khi xuất PDF. Vui lòng thử lại!');
    }
  };

  const handlePreviousSection = () => {
    const tabOrder = [
      "personal",
      "summary",
      "experience",
      "education",
      "skills",
      "links",
      "custom",
    ];
    const currentIndex = tabOrder.indexOf(activeTab);

    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Update CV data from sections
  const updateCVData = (section: string, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar with improved visual design */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-bold">Resume Score</div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getResumeScore() < 40
                    ? "bg-red-100 text-red-800"
                    : getResumeScore() < 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {getResumeScore()}%
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${getResumeScore()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getResumeScore() < 40
                ? "Your CV needs more information"
                : getResumeScore() < 70
                ? "Your CV is getting there"
                : "Your CV is looking great!"}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-medium text-gray-500 mb-2">
              CV SECTIONS
            </div>
            <Tabs value={activeTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1">
                <TabsTrigger
                  value="personal"
                  onClick={() => setActiveTab("personal")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "personal"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("personal")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("personal")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "personal"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("personal") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">1</span>
                      )}
                    </div>
                    <span>Personal Details</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="summary"
                  onClick={() => setActiveTab("summary")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "summary"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("summary")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("summary")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "summary"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("summary") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">2</span>
                      )}
                    </div>
                    <span>Professional Summary</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="experience"
                  onClick={() => setActiveTab("experience")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "experience"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("experience")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("experience")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "experience"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("experience") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">3</span>
                      )}
                    </div>
                    <span>Work Experience</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="education"
                  onClick={() => setActiveTab("education")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "education"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("education")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("education")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "education"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("education") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">4</span>
                      )}
                    </div>
                    <span>Education</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="skills"
                  onClick={() => setActiveTab("skills")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "skills"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("skills")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("skills")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "skills"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("skills") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">5</span>
                      )}
                    </div>
                    <span>Skills</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="links"
                  onClick={() => setActiveTab("links")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "links"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("links")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("links")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "links"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("links") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">6</span>
                      )}
                    </div>
                    <span>Links</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="custom"
                  onClick={() => setActiveTab("custom")}
                  className={`justify-start gap-2 text-gray-600 px-3 py-2.5 h-auto rounded-lg border ${
                    activeTab === "custom"
                      ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      : completedSections.includes("custom")
                      ? "bg-white text-green-700 border-transparent"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSections.includes("custom")
                          ? "bg-green-100 text-green-700"
                          : activeTab === "custom"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completedSections.includes("custom") ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">7</span>
                      )}
                    </div>
                    <span>Additional Sections</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main content area with improved visuals */}
        <div className="flex-1">
          <Tabs value={activeTab} className="w-full">
            <TabsContent
              value="personal"
              className="m-0 bg-white rounded-xl p-1"
            >
              <PersonalDetailsSection
                data={cvData.personal}
                updateData={(data) => updateCVData("personal", data)}
              />
            </TabsContent>

            <TabsContent
              value="summary"
              className="m-0 bg-white rounded-xl p-1"
            >
              <ProfessionalSummarySection
                data={cvData.summary}
                updateData={(data) => updateCVData("summary", data)}
              />
            </TabsContent>

            <TabsContent
              value="experience"
              className="m-0 bg-white rounded-xl p-1"
            >
              <EmploymentHistorySection
                data={cvData.experience}
                updateData={(data) => updateCVData("experience", data)}
              />
            </TabsContent>

            <TabsContent
              value="education"
              className="m-0 bg-white rounded-xl p-1"
            >
              <EducationSection
                data={cvData.education}
                updateData={(data) => updateCVData("education", data)}
              />
            </TabsContent>

            <TabsContent value="skills" className="m-0 bg-white rounded-xl p-1">
              <SkillsSection
                data={cvData.skills}
                updateData={(data) => updateCVData("skills", data)}
              />
            </TabsContent>

            <TabsContent value="links" className="m-0 bg-white rounded-xl p-1">
              <LinksSection
                data={cvData.links}
                updateData={(data) => updateCVData("links", data)}
              />
            </TabsContent>

            <TabsContent value="custom" className="m-0 bg-white rounded-xl p-1">
              <CustomSectionsPanel
                sections={cvData.customSections}
                onUpdate={(sections) =>
                  updateCVData("customSections", sections)
                }
              />
            </TabsContent>
          </Tabs>

          {/* Progress bar */}
          <div className="mt-6 mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1.5">
              <span>Progress</span>
              <span>{Math.round((completedSections.length / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSections.length / 7) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation buttons with improved design */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousSection}
              disabled={activeTab === "personal"}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNextSection}
              disabled={!canProceedToNext()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              title={!canProceedToNext() ? "Hãy hoàn thành các trường bắt buộc" : ""}
            >
              {activeTab === "custom" ? "Hoàn thành" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Icon and Score */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getResumeScore() >= 90 
                  ? "🎉 Xuất sắc!" 
                  : getResumeScore() >= 70 
                  ? "✅ Hoàn thành!" 
                  : "⚠️ Đã lưu!"}
              </h2>
              <p className="text-gray-600 mb-4">
                {getResumeScore() >= 90 
                  ? "CV của bạn rất hoàn thiện và chuyên nghiệp!" 
                  : getResumeScore() >= 70 
                  ? "CV của bạn đã hoàn thành và sẵn sàng sử dụng!" 
                  : "CV đã được lưu. Bổ sung thêm để đạt điểm cao hơn."}
              </p>
              
              {/* Score Display */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-600">Điểm CV:</span>
                <span className="text-2xl font-bold text-blue-600">{getResumeScore()}</span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  await handleExportPDF();
                  setShowCompletionModal(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF ngay
              </Button>
              
              <Button
                onClick={() => setShowCompletionModal(false)}
                variant="outline"
                className="w-full"
              >
                Tiếp tục chỉnh sửa
              </Button>
              
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  // Navigate back or close
                  window.history.back();
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Đóng và quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
