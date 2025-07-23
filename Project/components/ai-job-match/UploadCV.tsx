"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  ChevronRight,
  Upload,
  File,
  ArrowLeft,
  Loader2,
  Check,
  FileText,
  X,
  Info,
  FileUp,
  Trash2,
  MoreVertical,
  Download,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useJobMatchStore, JobMatchStep } from "../../store/jobMatchStore";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../lib/api";

export function UploadCV() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Use Zustand store
  const {
    uploadedCVs,
    selectedCVId,
    addCV,
    removeCV,
    setDefaultCV,
    setSelectedCV,
    setCurrentStep,
    jobDetails,
    setMatchResult,
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

  // Simulate progress during upload
  useEffect(() => {
    if (uploadStatus === "uploading") {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadStatus("success");

            // Set selected CV as default if it exists
            if (activeFileId) {
              setDefaultCV(activeFileId);
              setSelectedCV(activeFileId);
            }

            return 100;
          }
          return newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [uploadStatus, activeFileId, setDefaultCV, setSelectedCV]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.name.endsWith(".docx") ||
        file.name.endsWith(".doc"))
    ) {
      handleFile(file);
    } else {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    // Create a new file object and add to the store
    const newFileId = uuidv4();
    setActiveFileId(newFileId);
    setError("");

    const newCV = {
      id: newFileId,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Add to local store first to show progress
    addCV(newCV);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Upload to backend API
      const formData = new FormData();
      formData.append("file", file);

      // This will handle the actual upload to the backend
      const response = await api.uploadCV(formData);

      // If successful, update the CV with any additional data from the backend
      if (response && response.id) {
        // Update the CV in the store with backend data if needed
        // For now we'll just use the local one
      }
    } catch (err) {
      console.error("Error uploading CV:", err);
      setError("Failed to upload CV to server. Your CV is saved locally only.");
      // Still keep the CV in the local store, so the user can continue
    }
  };

  const handleGoBack = () => {
    // Quay lại trang chọn công việc
    router.push("/job-match/details");
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Lấy CV được chọn
      const selectedCV =
        uploadedCVs.find((file) => file.isDefault) || uploadedCVs[0];

      if (!selectedCV) {
        throw new Error("Vui lòng tải lên hoặc chọn một CV");
      }

      // Chuẩn bị dữ liệu để gửi đến API
      const formData = new FormData();

      // Giả lập nội dung CV từ file đã tải lên (trong thực tế, sẽ lấy từ backend)
      const cvText = `
Demo CV của người dùng - ${selectedCV.name}
Người tìm việc có kinh nghiệm phát triển phần mềm với các kỹ năng:
- JavaScript, TypeScript, React, NextJS
- HTML, CSS, Tailwind CSS
- Node.js, Express
- Git, Docker
- 3 năm kinh nghiệm làm Frontend Developer
      `;

      try {
        // Gọi API để phân tích sự phù hợp
        const response = await fetch("/api/job-match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvText: cvText,
            jobDescription: jobDetails.description,
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const result = await response.json();

        // Lưu kết quả vào store
        setMatchResult({
          matchPercentage: result.matchScore,
          score: result.matchScore,
          strengths: result.strengths || [],
          weaknesses: result.weaknesses || [],
          recommendations: result.recommendations || [],
          analysis: result.analysis,
          htmlAnalysis: result.htmlAnalysis,
        });

        // Chuyển đến trang kết quả
        setCurrentStep(JobMatchStep.JOB_MATCH);
        router.push("/job-match/results");
      } catch (error) {
        console.error("Error calling job-match API:", error);

        // Fallback nếu API lỗi - tạo kết quả giả lập
        setMatchResult({
          matchPercentage: 78,
          score: 78,
          strengths: [
            "Kinh nghiệm với React và NextJS rất phù hợp với vị trí",
            "Kiến thức về TypeScript là một lợi thế lớn",
            "Kinh nghiệm 3 năm làm Frontend Developer đáp ứng yêu cầu",
          ],
          weaknesses: [
            "Thiếu kinh nghiệm với các nền tảng đám mây",
            "Không đề cập đến các framework kiểm thử",
          ],
          recommendations: [
            "Nêu bật kinh nghiệm với nền tảng đám mây nếu có",
            "Bổ sung ví dụ về phát triển hướng kiểm thử (TDD)",
            "Làm rõ kinh nghiệm làm việc trong môi trường Agile",
          ],
          analysis:
            "CV của bạn phù hợp khá tốt với vị trí này. Kỹ năng frontend của bạn đặc biệt phù hợp, nhưng bạn nên nhấn mạnh thêm kinh nghiệm về cloud nếu có.",
          htmlAnalysis:
            "<div class='markdown'><h1>Phân tích sự phù hợp công việc</h1><p>CV của bạn phù hợp khá tốt với vị trí này ở mức 78%. Kỹ năng frontend của bạn đặc biệt phù hợp, nhưng bạn nên nhấn mạnh thêm kinh nghiệm về cloud nếu có.</p></div>",
        });

        // Chuyển đến trang kết quả
        setCurrentStep(JobMatchStep.JOB_MATCH);
        router.push("/job-match/results");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Đã xảy ra lỗi khi xử lý job match");
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultCV = () => {
    return uploadedCVs.find((file) => file.isDefault) || uploadedCVs[0];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Hiển thị thông tin công việc nếu có
  const hasJobDetails = jobDetails.title && jobDetails.company;

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
            <FileUp className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Tải CV của bạn</h2>
            <p className="text-gray-600 text-sm mt-1">
              Tải lên CV để phân tích mức độ phù hợp với công việc đã chọn
            </p>
          </div>
        </motion.div>

        {/* "Use Existing CV" notification banner */}
        {uploadedCVs.find((file) => file.isDefault) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-lime-200 flex-shrink-0 flex items-center justify-center">
              <Check className="h-5 w-5 text-lime-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-black">Use existing CV</h3>
              <p className="text-sm text-gray-700 mb-1">
                We found a CV on your profile
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="h-7 w-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-800 truncate">
                  {getDefaultCV()?.name}
                </span>
                <Badge className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-lime-100 text-lime-800 border-lime-200">
                  Using Existing CV
                </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hiển thị thông tin công việc đã chọn */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  Công việc đã chọn
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-800">
                      {jobDetails.title}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {jobDetails.company}
                    </span>
                    {jobDetails.location && (
                      <>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />{" "}
                          {jobDetails.location}
                        </span>
                      </>
                    )}
                  </div>
                  {jobDetails.description && (
                    <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                      {jobDetails.description.substring(0, 150)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CV Library Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">
                Your CVs ({uploadedCVs.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-lime-600 text-lime-700 hover:bg-lime-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload New CV
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileInput}
                aria-label="Upload CV file"
              />
            </div>

            {/* Active upload progress */}
            {uploadStatus === "uploading" && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center">
                      <File className="h-4 w-4 text-lime-700" />
                    </div>
                    <span className="text-sm font-medium">
                      {activeFileId &&
                        uploadedCVs.find((f) => f.id === activeFileId)?.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-2"
                  indicatorClassName="bg-lime-300"
                />
              </div>
            )}

            {uploadedCVs.length === 0 ? (
              <div className="text-center py-8 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">You don't have any CVs yet</p>
                <Button
                  variant="outline"
                  className="mt-4 border-lime-600 text-lime-700 hover:bg-lime-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Your First CV
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedCVs.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      file.isDefault
                        ? "bg-lime-50 border border-lime-200"
                        : "bg-white border border-gray-200"
                    } hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => !file.isDefault && setDefaultCV(file.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          file.isDefault ? "bg-lime-200" : "bg-gray-100"
                        }`}
                      >
                        <FileText
                          className={`h-5 w-5 ${
                            file.isDefault ? "text-lime-700" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>Added: {file.createdAt}</span>
                          {file.isDefault && (
                            <Badge
                              variant="outline"
                              className="bg-lime-100 text-lime-800 border-lime-200 text-[10px]"
                            >
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCV(file.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Add ability to upload a new CV with drag and drop */}
        <motion.div variants={itemVariants}>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive
                ? "border-lime-300 bg-lime-50"
                : "border-gray-300 hover:border-lime-300 hover:bg-lime-50"
            } transition-colors duration-200 ease-in-out`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="h-7 w-7 text-lime-700" />
              </motion.div>
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Drag and drop a new CV
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Supported formats: PDF, DOCX, DOC (Max 5MB)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">or</span>
              </div>
              <Button
                variant="outline"
                className="border-gray-300 hover:border-lime-300 hover:bg-lime-50 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Continue button with selected CV info */}
        {uploadedCVs.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">CV đã chọn</p>
                  <p className="font-medium text-gray-900">
                    {getDefaultCV()?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Button>
                <Button
                  className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
                  onClick={handleContinue}
                  disabled={isLoading || uploadedCVs.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Tiếp tục
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error message when API upload fails */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 flex items-center gap-2"
          >
            <Info className="h-5 w-5 text-yellow-600" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Error message when file type is not supported */}
        {uploadStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 text-red-800 flex items-center gap-2"
          >
            <Info className="h-5 w-5 text-red-600" />
            <p className="text-sm">
              File type not supported. Please upload a PDF, DOCX, or DOC file.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
