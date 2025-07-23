"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Briefcase,
  Building,
  FileText,
  ArrowLeft,
  Loader2,
  Check,
  List,
  MapPin,
  DollarSign,
  Monitor,
  Link,
  Info,
} from "lucide-react";
import { useJobMatchStore, JobMatchStep } from "../../store/jobMatchStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { api } from "../../lib/api";

export function JobDetailsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requirementText, setRequirementText] = useState("");
  const [showAddedRequirement, setShowAddedRequirement] = useState(false);
  const [error, setError] = useState("");

  // Use Zustand store
  const {
    jobDetails,
    updateJobDetails,
    setCurrentStep,
    setMatchResult,
    uploadedCVs,
    selectedCVId,
  } = useJobMatchStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const handleGoBack = () => {
    router.push("/job-match");
  };

  const handleInputChange = (field: string, value: string) => {
    updateJobDetails({ [field]: value });
  };

  const handleAddRequirement = () => {
    if (requirementText.trim()) {
      updateJobDetails({
        requirements: [
          ...(jobDetails.requirements || []),
          requirementText.trim(),
        ],
      });
      setRequirementText("");
      setShowAddedRequirement(true);
      setTimeout(() => setShowAddedRequirement(false), 3000);
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = [...(jobDetails.requirements || [])];
    newRequirements.splice(index, 1);
    updateJobDetails({ requirements: newRequirements });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const handleContinue = async () => {
    if (!jobDetails.title || !jobDetails.company || !jobDetails.description) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Lưu thông tin công việc đã chọn
      updateJobDetails({
        ...jobDetails,
      });

      // Chuyển đến trang tải CV lên
      setCurrentStep(JobMatchStep.CV_UPLOAD);
      router.push("/job-match/upload-cv");
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Đã xảy ra lỗi khi xử lý thông tin công việc");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all mb-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Chọn công việc</h2>
            <p className="text-gray-600 text-sm mt-1">
              Nhập thông tin công việc bạn muốn ứng tuyển
            </p>
          </div>
        </motion.div>

        {uploadedCVs.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-lime-200 flex-shrink-0 flex items-center justify-center">
              <Check className="h-5 w-5 text-lime-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-black">CV đã sẵn sàng</h3>
              <p className="text-sm text-gray-700 mb-1">
                Bước tiếp theo, hãy nhập chi tiết công việc bạn muốn ứng tuyển
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="h-7 w-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-800 truncate">
                  {
                    uploadedCVs.find(
                      (cv) => cv.id === selectedCVId || cv.isDefault
                    )?.name
                  }
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-1">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Lời khuyên</h3>
                <p className="text-sm text-gray-700">
                  Bạn có thể nhập một mô tả công việc thực tế từ các nền tảng
                  tuyển dụng như LinkedIn, Indeed, TopCV hoặc từ website của
                  công ty. Điều này sẽ giúp AI phân tích chính xác hơn mức độ
                  phù hợp của CV với vị trí công việc.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="jobTitle">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-gray-500" />
                  Job Title <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                value={jobDetails.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="company">
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-gray-500" />
                  Company <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                id="company"
                placeholder="e.g. Acme Corp"
                value={jobDetails.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                Job Description <span className="text-red-500">*</span>
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Paste the job description here"
              className="min-h-[150px]"
              value={jobDetails.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="location">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  Location
                </span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY"
                value={jobDetails.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="mode">
                <span className="flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-gray-500" />
                  Work Mode
                </span>
              </Label>
              <Input
                id="mode"
                placeholder="e.g. Remote, Hybrid, On-site"
                value={jobDetails.mode || ""}
                onChange={(e) => handleInputChange("mode", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="salary">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                  Salary Range
                </span>
              </Label>
              <Input
                id="salary"
                placeholder="e.g. $80,000 - $100,000"
                value={jobDetails.salaryRange || ""}
                onChange={(e) =>
                  handleInputChange("salaryRange", e.target.value)
                }
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobUrl">
                <span className="flex items-center gap-1.5">
                  <Link className="h-3.5 w-3.5 text-gray-500" />
                  Job URL
                </span>
              </Label>
              <Input
                id="jobUrl"
                placeholder="e.g. https://example.com/jobs/123"
                value={jobDetails.jobUrl || ""}
                onChange={(e) => handleInputChange("jobUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>
              <span className="flex items-center gap-1.5">
                <List className="h-3.5 w-3.5 text-gray-500" />
                Key Requirements
              </span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {jobDetails.requirements?.map((req, index) => (
                <Badge
                  key={index}
                  className="bg-lime-100 text-lime-800 border border-lime-300 flex items-center gap-1.5 py-1.5 px-3"
                >
                  {req}
                  <button
                    className="ml-1 text-lime-800 hover:text-red-500"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a key requirement (e.g. 3+ years React experience)"
                value={requirementText}
                onChange={(e) => setRequirementText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                className="flex-shrink-0"
                onClick={handleAddRequirement}
              >
                Add
              </Button>
            </div>
            {showAddedRequirement && (
              <p className="text-sm text-lime-700 flex items-center gap-1 mt-1">
                <Check className="h-3.5 w-3.5" /> Requirement added
              </p>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mt-4 bg-red-50 text-red-700 p-3 rounded-md border border-red-200"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-gray-200 flex justify-between"
        >
          <Button variant="outline" onClick={handleGoBack} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
            onClick={handleContinue}
            disabled={
              isLoading ||
              !jobDetails.title ||
              !jobDetails.company ||
              !jobDetails.description
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
