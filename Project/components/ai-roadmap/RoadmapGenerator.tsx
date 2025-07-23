"use client";

import React, { useState } from "react";
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
  SelectValue,
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
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RoadmapLayout } from "./RoadmapLayout";
import { api } from "@/lib/api";

export default function RoadmapGenerator() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Tạo prompt từ dữ liệu form
      const prompt = `Create a detailed career roadmap for a ${
        formData.currentRole || "professional"
      } aiming to become a ${
        formData.targetRole || "senior professional"
      } with ${
        formData.yearsExperience || "relevant"
      } years of experience. Their current skills include: ${
        formData.skills.length > 0
          ? formData.skills.join(", ")
          : "various technical and soft skills"
      }. Additional interests: ${
        formData.interests || "professional growth and skill development"
      }`;

      console.log("Sending request to Jina API with prompt:", prompt);

      // Hiển thị thông báo xử lý
      const processingMessage = document.createElement("div");
      processingMessage.className =
        "fixed top-4 right-4 bg-lime-100 text-lime-800 p-4 rounded-lg shadow-md z-50";
      processingMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-lime-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>
            <div class="font-medium">Đang tạo lộ trình sự nghiệp</div>
            <div class="text-xs text-lime-700">Kết nối với Jina AI DeepSearch API...</div>
          </div>
        </div>
      `;
      document.body.appendChild(processingMessage);

      // Cập nhật thông báo sau 2 giây
      setTimeout(() => {
        processingMessage.innerHTML = `
          <div class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-lime-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div>
              <div class="font-medium">Đang phân tích thông tin</div>
              <div class="text-xs text-lime-700">AI đang tạo lộ trình dựa trên mục tiêu của bạn...</div>
            </div>
          </div>
        `;
      }, 2000);

      // Gọi API để tạo roadmap
      const response = await api.generateRoadmap({
        chatInput: prompt,
      });

      console.log("Received response from Jina API:", response);

      // Xóa thông báo xử lý
      document.body.removeChild(processingMessage);

      // Hiển thị thông báo thành công
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-md z-50";
      successMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-medium">Đã tạo lộ trình thành công!</div>
            <div class="text-xs text-green-700">Đang chuyển hướng đến trang kết quả...</div>
          </div>
        </div>
      `;
      document.body.appendChild(successMessage);

      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

      // Lưu kết quả vào localStorage để sử dụng ở trang visualizer
      localStorage.setItem("roadmapData", JSON.stringify(response));

      // Chuyển hướng đến trang visualizer
      router.push("/roadmap/visualizer");
    } catch (error) {
      console.error("Error generating roadmap:", error);

      // Hiển thị thông báo lỗi
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed top-4 right-4 bg-red-100 text-red-800 p-4 rounded-lg shadow-md z-50";
      errorMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <div class="font-medium">Không thể tạo lộ trình</div>
            <div class="text-xs text-red-700">Lỗi kết nối đến Jina AI DeepSearch API. Vui lòng thử lại sau.</div>
          </div>
        </div>
      `;
      document.body.appendChild(errorMessage);

      // Tự động xóa thông báo sau 5 giây
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick start template animations
  const quickStartVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      backgroundColor: "#f7fee7",
    },
  };

  // Input field animations
  const inputVariants = {
    focused: { scale: 1.01, borderColor: "#84cc16" },
    unfocused: { scale: 1, borderColor: "#e5e7eb" },
  };

  // Card container animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Templates for quick start
  const careerTemplates = [
    {
      role: "Frontend Developer",
      icon: <Code className="h-5 w-5 text-lime-600" />,
      description: "Web development with a focus on user interfaces",
      targetRole: "Senior Frontend Engineer",
      skills: ["JavaScript", "React", "CSS", "HTML", "UI/UX"],
    },
    {
      role: "Data Scientist",
      icon: <BarChart3 className="h-5 w-5 text-lime-600" />,
      description: "Analyzing data and building machine learning models",
      targetRole: "Lead Data Scientist",
      skills: [
        "Python",
        "Machine Learning",
        "Statistics",
        "SQL",
        "Data Visualization",
      ],
    },
    {
      role: "Product Manager",
      icon: <Briefcase className="h-5 w-5 text-lime-600" />,
      description: "Leading product development and strategy",
      targetRole: "Senior Product Manager",
      skills: [
        "Product Strategy",
        "User Research",
        "Roadmapping",
        "Stakeholder Management",
      ],
    },
  ];

  const handleTemplateSelect = (template: any) => {
    setFormData({
      currentRole: template.role,
      targetRole: template.targetRole,
      yearsExperience: "",
      skills: [...template.skills],
      interests: "",
    });
  };

  return (
    <RoadmapLayout activeStep="form">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
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
                      <Label
                        htmlFor="currentRole"
                        className="text-sm font-medium flex items-center gap-2"
                      >
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
                      <Label
                        htmlFor="targetRole"
                        className="text-sm font-medium flex items-center gap-2"
                      >
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

                    <motion.div
                      className="space-y-2"
                      whileFocus="focused"
                      variants={inputVariants}
                    >
                      <Label
                        htmlFor="yearsExperience"
                        className="text-sm font-medium"
                      >
                        Years of Experience
                      </Label>
                      <Select
                        value={formData.yearsExperience}
                        onValueChange={(value) =>
                          handleSelectChange("yearsExperience", value)
                        }
                      >
                        <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">
                            More than 10 years
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="skills"
                        className="text-sm font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-gray-500" />
                          Current Skills
                        </span>
                        <span className="text-xs text-gray-500">
                          {formData.skills.length}/10
                        </span>
                      </Label>

                      <div className="flex gap-2">
                        <motion.div
                          className="flex-1"
                          whileFocus="focused"
                          variants={inputVariants}
                        >
                          <Input
                            id="skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onFocus={() => setSkillInputFocused(true)}
                            onBlur={() => setSkillInputFocused(false)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                            placeholder="e.g. JavaScript, React, UI Design"
                            className="h-12 bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200"
                          />
                        </motion.div>
                        <Button
                          type="button"
                          onClick={addSkill}
                          variant="outline"
                          className="h-12 border-gray-200 hover:bg-lime-50 hover:border-lime-300"
                        >
                          Add
                        </Button>
                      </div>

                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-lime-100 hover:bg-lime-200 text-lime-800 border-none py-1.5 flex items-center gap-1 pl-3 pr-2 transition-colors cursor-default"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover:bg-lime-300 rounded-full p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <motion.div
                      className="space-y-2"
                      whileFocus="focused"
                      variants={inputVariants}
                    >
                      <Label
                        htmlFor="interests"
                        className="text-sm font-medium"
                      >
                        Career Interests & Goals
                      </Label>
                      <Textarea
                        id="interests"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="Describe your career aspirations, areas of interest, or specific goals you'd like to achieve..."
                        className="min-h-[120px] resize-none bg-white border-gray-200 focus:border-lime-300 focus:ring-lime-300 rounded-md shadow-sm transition-all duration-200"
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">
                    Quick Start Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {careerTemplates.map((template, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        className="text-left p-4 border border-gray-200 rounded-md relative overflow-hidden hover:border-lime-300 transition-colors"
                        variants={quickStartVariants}
                        whileHover="hover"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex items-center gap-2">
                          {template.icon}
                          <h4 className="font-medium text-black">
                            {template.role}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {template.description}
                        </p>
                        <ChevronRight className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-black text-lime-300 hover:bg-gray-800 flex items-center gap-2 h-12 px-6 rounded-md shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Roadmap
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </RoadmapLayout>
  );
}
