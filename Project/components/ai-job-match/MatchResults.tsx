"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Building,
  DollarSign,
  Share2,
  Linkedin,
  Mail,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ExternalLink,
  Star,
  Filter,
  SearchIcon,
  AlertCircle,
  BriefcaseIcon,
  CheckCircle2,
  ThumbsUp,
  Heart,
  FileCheck,
  FileText,
  Route,
  Map,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { LinkButton } from "@/components/LinkButton";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobMatchStore, JobMatchStep } from "../../store/jobMatchStore";

export function MatchResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const detailsRef = useRef<HTMLDivElement>(null);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);

  // Use Zustand store
  const {
    jobDetails,
    matchResult,
    uploadedCVs,
    selectedCVId,
    currentStep,
    setCurrentStep,
    sampleTemplate,
    setSampleTemplate,
  } = useJobMatchStore();

  // Scroll details into view on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Redirect if match result is null
  useEffect(() => {
    if (!matchResult && !loading) {
      setLoading(true);
      setCurrentStep(JobMatchStep.CV_UPLOAD);
      router.push("/job-match/upload-cv");
    }
  }, [matchResult, router, setCurrentStep, loading]);

  const handleGoBack = () => {
    router.push("/job-match/details");
  };

  const handleCreateRoadmap = async () => {
    if (!matchResult) return;

    setCreatingRoadmap(true);
    try {
      // Chuẩn bị dữ liệu để gửi đến API tạo roadmap
      const roadmapData = {
        jobTitle: jobDetails.title || "Current Role",
        currentSkills: matchResult.strengths || [],
        targetSkills: matchResult.recommendations
          ? matchResult.recommendations.map((rec) =>
              rec
                .replace("Add ", "")
                .replace("Learn ", "")
                .replace("Study ", "")
            )
          : [],
        weaknesses: matchResult.weaknesses || [],
        careerGoal: jobDetails.title,
        timeframe: "6 months",
      };

      // Gọi API tạo roadmap
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roadmapData),
      });

      if (!response.ok) {
        throw new Error("Failed to create roadmap");
      }

      const result = await response.json();

      // Chuyển đến trang roadmap
      router.push("/roadmap/visualizer");
    } catch (error) {
      console.error("Error creating roadmap:", error);
    } finally {
      setCreatingRoadmap(false);
    }
  };

  // Get match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "from-green-500 to-lime-500";
    if (percentage >= 80) return "from-lime-500 to-lime-400";
    if (percentage >= 70) return "from-yellow-500 to-lime-500";
    return "from-orange-500 to-yellow-500";
  };

  // Get stop colors for the gradient
  const getStopColors = (percentage: number) => {
    if (percentage >= 90) return { start: "#22c55e", end: "#84cc16" }; // green to lime
    if (percentage >= 80) return { start: "#84cc16", end: "#a3e635" }; // lime to light lime
    if (percentage >= 70) return { start: "#eab308", end: "#84cc16" }; // yellow to lime
    return { start: "#f97316", end: "#eab308" }; // orange to yellow
  };

  // Get match emoji based on percentage
  const getMatchEmoji = (percentage: number) => {
    if (percentage >= 90)
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (percentage >= 80) return <ThumbsUp className="h-5 w-5 text-lime-500" />;
    if (percentage >= 70)
      return <ThumbsUp className="h-5 w-5 text-yellow-500" />;
    return <ThumbsUp className="h-5 w-5 text-orange-500" />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Display loading skeleton state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh]"
        >
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-lime-500 animate-spin"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <BriefcaseIcon className="w-8 h-8 text-lime-500" />
            </div>
          </div>
          <h3 className="mt-8 text-lg font-semibold text-gray-900">
            Đang tìm công việc phù hợp...
          </h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">
            Chúng tôi đang phân tích hồ sơ của bạn để tìm cơ hội tốt nhất
          </p>
        </motion.div>
      </div>
    );
  }

  // Display error if no match result
  if (!matchResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không có kết quả phù hợp
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Có vẻ như bạn chưa hoàn thành quá trình tìm việc. Vui lòng tải lên
              CV và cung cấp thông tin công việc để xem kết quả phù hợp.
            </p>
            <Button
              onClick={() => router.push("/job-match/upload-cv")}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Bắt đầu tìm việc
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCV = uploadedCVs.find(
    (cv) => cv.id === selectedCVId || cv.isDefault
  );

  const matchPercentage = matchResult?.matchPercentage || 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-lime-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Kết quả phù hợp</h2>
            <p className="text-gray-500 text-sm">
              Mức độ phù hợp của CV của bạn với công việc này
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {jobDetails.title}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Building className="h-4 w-4" />
                {jobDetails.company}
                {jobDetails.location && (
                  <>
                    <span className="mx-1">•</span>
                    <MapPin className="h-4 w-4" />
                    {jobDetails.location}
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center gap-1.5 text-sm font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-1" />
                  CV đang sử dụng:
                </div>
                <Badge
                  variant="outline"
                  className="bg-lime-50 text-lime-800 border-lime-200"
                >
                  {selectedCV?.name || "CV mặc định"}
                </Badge>
              </div>
            </div>
          </div>

          {/* New UI - Main match section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Match score column */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={`url(#gradient-${matchPercentage})`}
                    strokeWidth="8"
                    strokeDasharray={`${
                      2 * Math.PI * 45 * (matchPercentage / 100)
                    } ${2 * Math.PI * 45 * (1 - matchPercentage / 100)}`}
                    strokeDashoffset={2 * Math.PI * 45 * 0.25}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id={`gradient-${matchPercentage}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={getStopColors(matchPercentage).start}
                      />
                      <stop
                        offset="100%"
                        stopColor={getStopColors(matchPercentage).end}
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{matchPercentage}%</span>
                  <span className="text-sm text-gray-500">Phù hợp</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {getMatchEmoji(matchPercentage)}
                <span className="text-sm font-medium">
                  {matchPercentage >= 90
                    ? "Phù hợp tuyệt vời"
                    : matchPercentage >= 80
                    ? "Phù hợp tốt"
                    : matchPercentage >= 70
                    ? "Phù hợp khá"
                    : "Phù hợp trung bình"}
                </span>
              </div>
            </div>

            {/* Strengths column */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-lime-600" />
                Điểm mạnh
              </h4>
              {matchResult.strengths && matchResult.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {matchResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-lime-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Không có dữ liệu</p>
              )}
            </div>

            {/* Weaknesses column */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Điểm cần cải thiện
              </h4>
              {matchResult.weaknesses && matchResult.weaknesses.length > 0 ? (
                <ul className="space-y-2">
                  {matchResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5 font-bold">
                        •
                      </span>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {matchResult.recommendations &&
          matchResult.recommendations.length > 0 && (
            <div className="mt-6 bg-lime-50 border border-lime-200 rounded-lg p-5">
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-lime-600" />
                Đề xuất để cải thiện độ phù hợp
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="bg-lime-200 text-lime-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Action buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="gap-1 order-2 md:order-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại chi tiết công việc
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 order-1 md:order-2">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              onClick={handleCreateRoadmap}
              disabled={creatingRoadmap}
            >
              <Map className="mr-2 h-4 w-4" />
              {creatingRoadmap
                ? "Đang tạo lộ trình..."
                : "Tạo lộ trình phát triển"}
            </Button>

            <Button
              className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
              onClick={() => {
                const devCVData = {
                  personalInfo: {
                    name: "Nguyễn Văn Lập",
                    title: "Frontend Developer",
                    email: "laptrinhvien@example.com",
                    phone: "0912345678",
                    address: "123 Đường Công Nghệ",
                    city: "Hà Nội",
                    region: "Hà Nội",
                    postalCode: "100000",
                    country: "Việt Nam",
                    website: "example.com",
                  },
                  summary:
                    "Frontend Developer với 3 năm kinh nghiệm phát triển ứng dụng web sử dụng React và TypeScript. Có kiến thức chuyên sâu về HTML, CSS, JavaScript và các framework hiện đại. Đam mê tạo ra giao diện người dùng đẹp và trải nghiệm người dùng tốt.",
                  skills:
                    "JavaScript, TypeScript, React, NextJS, HTML, CSS, Tailwind CSS, Git, Redux, REST API",
                  education: [
                    {
                      institution: "Đại học Bách Khoa Hà Nội",
                      degree: "Cử nhân",
                      fieldOfStudy: "Khoa học Máy tính",
                      startDate: "09/2018",
                      endDate: "06/2022",
                      gpa: "3.7/4.0",
                      courses: [
                        "Lập trình Web",
                        "Cấu trúc dữ liệu và Giải thuật",
                        "Cơ sở dữ liệu",
                      ],
                    },
                  ],
                  workExperience: [
                    {
                      company: "Công ty ABC Tech",
                      position: "Frontend Developer",
                      website: "abctech.com",
                      startDate: "07/2022",
                      endDate: "",
                      description:
                        "Phát triển ứng dụng web sử dụng React, TypeScript và NextJS. Làm việc trong nhóm 5 người, phối hợp chặt chẽ với backend developers và UI/UX designers.",
                      highlights: [
                        "Cải thiện hiệu suất ứng dụng giảm 40% thời gian tải trang",
                        "Phát triển các component tái sử dụng cho toàn bộ dự án",
                        "Tối ưu hóa quy trình CI/CD",
                      ],
                    },
                  ],
                  projects: [
                    {
                      name: "Hệ thống quản lý bán hàng",
                      description:
                        "Ứng dụng web quản lý bán hàng với đầy đủ tính năng: quản lý sản phẩm, đơn hàng, khách hàng và báo cáo.",
                      startDate: "01/2023",
                      endDate: "06/2023",
                      url: "github.com/username/project",
                      technologies: ["React", "Redux", "Node.js", "MongoDB"],
                    },
                  ],
                  theme: "macchiato",
                };

                // Mã hóa dữ liệu thành chuỗi Base64
                const encodedData = btoa(JSON.stringify(devCVData));
                setSampleTemplate(encodedData);
              }}
            >
              Ứng tuyển công việc
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
