"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import FormattedJobDescription from "@/app/components/FormattedJobDescription";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  MessageSquare,
  Send,
  Share2,
  FileText,
  BrainCircuit,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiConfig } from "@/config/api-config";

interface QuestionItem {
  id: string;
  question: string;
  difficulty: "basic" | "advanced";
  selected: boolean;
}

export default function CreateQuestionsPage() {
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [basicQuestions, setBasicQuestions] = useState<QuestionItem[]>([]);
  const [advancedQuestions, setAdvancedQuestions] = useState<QuestionItem[]>(
    []
  );
  const [minimumPassScore, setMinimumPassScore] = useState<number>(80);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formId, setFormId] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const [showBasicOnly, setShowBasicOnly] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedJobData = localStorage.getItem("jobData");
    const storedGeneratedJD = localStorage.getItem("generatedJD");

    if (storedJobData) {
      try {
        const parsedData = JSON.parse(storedJobData);
        setJobData(parsedData);
        setFormTitle(
          `Phỏng vấn cho vị trí ${parsedData.title || "Công việc mới"}`
        );
      } catch (error) {
        console.error("Error parsing stored job data:", error);
        setErrorMessage("Không thể đọc dữ liệu công việc đã lưu");
      }
    } else {
      setErrorMessage("Không tìm thấy dữ liệu công việc");
    }

    if (storedGeneratedJD) {
      setGeneratedDescription(storedGeneratedJD);
    }
  }, []);

  const generateQuestions = async () => {
    if (!jobData) return;

    setIsGeneratingQuestions(true);
    setErrorMessage(null);
    setBasicQuestions([]);
    setAdvancedQuestions([]);

    try {
      // Generate basic questions
      const basicQuestionsPrompt = `
        Tạo 5 câu hỏi cơ bản cho vị trí ${
          jobData.title || "chuyên viên"
        } dựa trên mô tả công việc sau:
        
        Trách nhiệm: ${jobData.keyResponsibilities || ""}
        Kỹ năng yêu cầu: ${jobData.requiredSkills || ""}
        Kỹ năng ưu tiên: ${jobData.preferredSkills || ""}
        Trình độ học vấn: ${jobData.education || ""}
        
        Trả về kết quả dưới định dạng JSON với mảng các câu hỏi:
        {
          "questions": [
            "Câu hỏi 1", 
            "Câu hỏi 2",
            "Câu hỏi 3",
            "Câu hỏi 4",
            "Câu hỏi 5"
          ]
        }
      `;

      const advancedQuestionsPrompt = `
        Tạo 5 câu hỏi nâng cao cho vị trí ${
          jobData.title || "chuyên viên"
        } dựa trên mô tả công việc sau:
        
        Trách nhiệm: ${jobData.keyResponsibilities || ""}
        Kỹ năng yêu cầu: ${jobData.requiredSkills || ""}
        Kỹ năng ưu tiên: ${jobData.preferredSkills || ""}
        Trình độ học vấn: ${jobData.education || ""}
        
        Câu hỏi nâng cao nên kiểm tra kiến thức chuyên sâu, khả năng giải quyết vấn đề phức tạp, và trình độ chuyên môn cao.
        
        Trả về kết quả dưới định dạng JSON với mảng các câu hỏi:
        {
          "questions": [
            "Câu hỏi nâng cao 1", 
            "Câu hỏi nâng cao 2",
            "Câu hỏi nâng cao 3",
            "Câu hỏi nâng cao 4",
            "Câu hỏi nâng cao 5"
          ]
        }
      `;

      const generateWithDeepseek = async (prompt: string) => {
        const config = apiConfig.deepseek;
        const response = await fetch(config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      };

      // Parallel API calls for efficiency
      const [basicResponse, advancedResponse] = await Promise.all([
        generateWithDeepseek(basicQuestionsPrompt),
        generateWithDeepseek(advancedQuestionsPrompt),
      ]);

      // Parse responses
      let basicQuestionsData, advancedQuestionsData;

      try {
        // Try parsing as JSON
        basicQuestionsData = JSON.parse(basicResponse);
      } catch (e) {
        // If not valid JSON, try to extract JSON part
        const jsonMatch = basicResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          basicQuestionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Không thể phân tích kết quả câu hỏi cơ bản");
        }
      }

      try {
        // Try parsing as JSON
        advancedQuestionsData = JSON.parse(advancedResponse);
      } catch (e) {
        // If not valid JSON, try to extract JSON part
        const jsonMatch = advancedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          advancedQuestionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Không thể phân tích kết quả câu hỏi nâng cao");
        }
      }

      // Ensure questions are in expected format
      const basicQuestionList = Array.isArray(basicQuestionsData.questions)
        ? basicQuestionsData.questions
        : [];

      const advancedQuestionList = Array.isArray(
        advancedQuestionsData.questions
      )
        ? advancedQuestionsData.questions
        : [];

      // Format questions with IDs
      setBasicQuestions(
        basicQuestionList.map((q: string, idx: number) => ({
          id: `basic-${idx}`,
          question: q,
          difficulty: "basic" as const,
          selected: true,
        }))
      );

      setAdvancedQuestions(
        advancedQuestionList.map((q: string, idx: number) => ({
          id: `advanced-${idx}`,
          question: q,
          difficulty: "advanced" as const,
          selected: true,
        }))
      );
    } catch (error) {
      console.error("Error generating questions:", error);
      setErrorMessage(
        `Lỗi khi tạo câu hỏi: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const createGoogleForm = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Combine selected questions
      const selectedBasicQuestions = basicQuestions.filter((q) => q.selected);
      const selectedAdvancedQuestions = advancedQuestions.filter(
        (q) => q.selected
      );

      const jobTitle = jobData.title || "Vị trí mới";
      const description = `Phỏng vấn cho vị trí ${jobTitle} tại ${
        jobData.companyName || "Công ty"
      }.
      \nCàn trả lời tối thiểu ${minimumPassScore}% câu hỏi cơ bản chính xác để tiếp tục phần câu hỏi nâng cao.`;

      // Mock Google Form API call - in real implementation this would call the actual API
      // Using the Google Form API key provided: AIzaSyBanRlfYLDolt2_Fndld0LBShXw4FA2mdQ
      const formData = {
        title: formTitle,
        description: description,
        questions: [
          ...selectedBasicQuestions.map((q) => ({
            title: q.question,
            type: "PARAGRAPH",
            required: true,
            questionGroupId: "basic",
          })),
          ...selectedAdvancedQuestions.map((q) => ({
            title: q.question,
            type: "PARAGRAPH",
            required: true,
            questionGroupId: "advanced",
            showIf: `score('basic') >= ${minimumPassScore}`,
          })),
        ],
      };

      // In a real implementation, this would be an actual API call
      // Simulating API call success for demo purposes
      console.log("Creating Google Form with data:", formData);

      // Mock response
      const mockFormId =
        "1FAIpQLSf" + Math.random().toString(36).substring(2, 10);
      const mockFormUrl = `https://docs.google.com/forms/d/${mockFormId}/viewform`;

      setFormId(mockFormId);
      setFormUrl(mockFormUrl);

      // Save to localStorage for persistence
      localStorage.setItem("interviewFormUrl", mockFormUrl);
      localStorage.setItem("interviewFormId", mockFormId);
    } catch (error) {
      console.error("Error creating Google Form:", error);
      setErrorMessage(
        `Lỗi khi tạo Google Form: ${
          error instanceof Error ? error.message : "Lỗi không xác định"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionSelection = (id: string, type: "basic" | "advanced") => {
    if (type === "basic") {
      setBasicQuestions((questions) =>
        questions.map((q) =>
          q.id === id ? { ...q, selected: !q.selected } : q
        )
      );
    } else {
      setAdvancedQuestions((questions) =>
        questions.map((q) =>
          q.id === id ? { ...q, selected: !q.selected } : q
        )
      );
    }
  };

  const copyFormLink = () => {
    if (formUrl) {
      navigator.clipboard.writeText(formUrl);
      alert("Đã sao chép liên kết Google Form vào clipboard!");
    }
  };

  return (
    <DashboardShell>
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tạo bài phỏng vấn từ mô tả công việc
              </h1>
              <p className="text-muted-foreground">
                Sử dụng AI để tạo ra bộ câu hỏi phỏng vấn từ mô tả công việc
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/employer/jobs")}
            >
              Quay lại
            </Button>
          </div>

          {errorMessage && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium text-red-700">Đã xảy ra lỗi</p>
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Mô tả công việc</CardTitle>
                  <CardDescription>
                    Mô tả công việc được sử dụng để tạo câu hỏi phỏng vấn
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {jobData ? (
                    <div className="scale-[0.85] origin-top-left">
                      <FormattedJobDescription
                        jobData={jobData}
                        generatedDescription={generatedDescription}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">
                        Không tìm thấy dữ liệu mô tả công việc
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo câu hỏi phỏng vấn</CardTitle>
                  <CardDescription>
                    Hệ thống sẽ tạo bộ câu hỏi cơ bản và nâng cao dựa trên mô tả
                    công việc
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="form-title">
                      Tiêu đề biểu mẫu phỏng vấn
                    </Label>
                    <Input
                      id="form-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Nhập tiêu đề cho biểu mẫu phỏng vấn"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="pass-score">
                      Điểm tối thiểu để vượt qua phần cơ bản (%)
                    </Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        id="pass-score"
                        type="number"
                        min="50"
                        max="100"
                        value={minimumPassScore}
                        onChange={(e) =>
                          setMinimumPassScore(parseInt(e.target.value) || 80)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="basic-only"
                          checked={showBasicOnly}
                          onChange={(e) => setShowBasicOnly(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor="basic-only"
                          className="text-sm cursor-pointer"
                        >
                          Chỉ hiển thị câu hỏi cơ bản
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateQuestions}
                    disabled={isGeneratingQuestions || !jobData}
                    className="w-full"
                  >
                    {isGeneratingQuestions ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo câu hỏi...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Tạo câu hỏi phỏng vấn với AI
                      </>
                    )}
                  </Button>

                  {formUrl && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium text-green-700">
                          Biểu mẫu đã được tạo thành công!
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Input value={formUrl} readOnly className="bg-white" />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={copyFormLink}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => window.open(formUrl, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Mở biểu mẫu
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(basicQuestions.length > 0 || advancedQuestions.length > 0) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Câu hỏi đã tạo</CardTitle>
                    <CardDescription>
                      Chọn các câu hỏi bạn muốn đưa vào biểu mẫu phỏng vấn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="basic">
                      <TabsList className="mb-4">
                        <TabsTrigger value="basic">
                          Câu hỏi cơ bản
                          <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {basicQuestions.length}
                          </Badge>
                        </TabsTrigger>
                        {!showBasicOnly && (
                          <TabsTrigger value="advanced">
                            Câu hỏi nâng cao
                            <Badge className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-100">
                              {advancedQuestions.length}
                            </Badge>
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        {basicQuestions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="p-3 border rounded-md bg-blue-50/30"
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id={q.id}
                                checked={q.selected}
                                onChange={() =>
                                  toggleQuestionSelection(q.id, "basic")
                                }
                                className="mt-1"
                              />
                              <div>
                                <Label
                                  htmlFor={q.id}
                                  className="font-medium cursor-pointer"
                                >
                                  Câu hỏi {idx + 1}
                                </Label>
                                <p className="mt-1 text-gray-700">
                                  {q.question}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {!showBasicOnly && (
                        <TabsContent value="advanced" className="space-y-4">
                          {advancedQuestions.map((q, idx) => (
                            <div
                              key={q.id}
                              className="p-3 border rounded-md bg-orange-50/30"
                            >
                              <div className="flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  id={q.id}
                                  checked={q.selected}
                                  onChange={() =>
                                    toggleQuestionSelection(q.id, "advanced")
                                  }
                                  className="mt-1"
                                />
                                <div>
                                  <Label
                                    htmlFor={q.id}
                                    className="font-medium cursor-pointer"
                                  >
                                    Câu hỏi nâng cao {idx + 1}
                                  </Label>
                                  <p className="mt-1 text-gray-700">
                                    {q.question}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={createGoogleForm}
                      disabled={
                        isLoading ||
                        (basicQuestions.filter((q) => q.selected).length ===
                          0 &&
                          !showBasicOnly &&
                          advancedQuestions.filter((q) => q.selected).length ===
                            0)
                      }
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tạo biểu mẫu...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Tạo Google Form
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
