"use client";

import { useState, useEffect } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Briefcase,
  Building,
  ArrowLeft,
  Download,
  Copy,
  Wand2,
  Clipboard,
  Database,
  RefreshCcw,
  Shield,
  Star,
  ChevronRight,
  CalendarClock,
  Award,
  ListChecks,
  Bookmark,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormattedJobDescription from "@/components/FormattedJobDescription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EyeIcon, SparklesIcon } from "lucide-react";

// Các mẫu thông tin cố định
const SAMPLE_TEMPLATES = [
  {
    id: 1,
    name: "Lập trình viên Frontend",
    data: {
      title: "Lập trình viên Frontend",
      companyName: "Tech Solutions Vietnam",
      industry: "Công nghệ thông tin",
      location: "Quận 1, TP. Hồ Chí Minh",
      remoteOption: "hybrid",
      experienceLevel: "mid",
      employmentType: "full-time",
      keyResponsibilities:
        "- Phát triển giao diện người dùng cho các ứng dụng web\n- Tối ưu hóa ứng dụng cho tốc độ và khả năng mở rộng\n- Hợp tác với các designer để triển khai UI/UX\n- Đảm bảo khả năng tương thích trên nhiều trình duyệt và thiết bị\n- Tham gia vào quy trình review code",
      requiredSkills:
        "- Thành thạo HTML, CSS, JavaScript\n- Kinh nghiệm làm việc với React.js\n- Hiểu biết về responsive design\n- Kỹ năng làm việc nhóm và giao tiếp tốt",
      preferredSkills:
        "- Kinh nghiệm với NextJS, TailwindCSS\n- Kinh nghiệm với TypeScript\n- Kinh nghiệm với state management (Redux, MobX, Zustand)\n- Kinh nghiệm với testing frameworks (Jest, React Testing Library)",
      education: "Cử nhân Công nghệ thông tin hoặc ngành liên quan",
      additionalNotes:
        "- Môi trường làm việc trẻ trung, năng động\n- Thưởng hiệu suất hàng quý\n- Bảo hiểm sức khỏe toàn diện\n- Lương tháng 13 và thưởng dự án\n- Có cơ hội học tập và phát triển kỹ năng mới\n- Tham gia các hoạt động team building hàng quý",
      tone: "professional",
    },
  },
  {
    id: 2,
    name: "Chuyên viên Marketing Digital",
    data: {
      title: "Chuyên viên Marketing Digital",
      companyName: "Sáng Tạo Media",
      industry: "Truyền thông và Marketing",
      location: "Hà Nội",
      remoteOption: "onsite",
      experienceLevel: "entry",
      employmentType: "full-time",
      keyResponsibilities:
        "- Thực hiện các chiến dịch marketing trên nền tảng số\n- Quản lý và phát triển nội dung cho các kênh mạng xã hội\n- Xây dựng và duy trì mối quan hệ với KOLs\n- Phân tích hiệu quả các chiến dịch marketing\n- Hỗ trợ tổ chức sự kiện quảng bá thương hiệu",
      requiredSkills:
        "- Kiến thức cơ bản về SEO, SEM, Email marketing\n- Kỹ năng viết content marketing tốt\n- Kỹ năng quản lý mạng xã hội (Facebook, Instagram, TikTok)\n- Tư duy sáng tạo và khả năng theo dõi xu hướng thị trường",
      preferredSkills:
        "- Sử dụng thành thạo các công cụ thiết kế (Canva, Photoshop)\n- Kinh nghiệm với các công cụ analytics (Google Analytics, Facebook Insights)\n- Tiếng Anh giao tiếp tốt\n- Đã từng tham gia vào các chiến dịch marketing thành công",
      education:
        "Tốt nghiệp Cao đẳng/Đại học chuyên ngành Marketing, Truyền thông hoặc liên quan",
      additionalNotes:
        "- Văn hóa công ty trẻ trung, sáng tạo\n- Thời gian làm việc linh hoạt\n- Được đào tạo thêm về các công cụ và kỹ năng marketing\n- Cơ hội thăng tiến nhanh\n- Lương cạnh tranh + phụ cấp + thưởng theo dự án\n- Chế độ du lịch công ty 2 lần/năm",
      tone: "enthusiastic",
    },
  },
  {
    id: 3,
    name: "Giám đốc nhân sự",
    data: {
      title: "Giám đốc nhân sự",
      companyName: "Phương Nam Investment",
      industry: "Tài chính - Đầu tư",
      location: "TP. Đà Nẵng",
      remoteOption: "hybrid",
      experienceLevel: "senior",
      employmentType: "full-time",
      keyResponsibilities:
        "- Xây dựng và triển khai chiến lược nhân sự toàn công ty\n- Quản lý toàn bộ hoạt động tuyển dụng, đào tạo và phát triển nhân viên\n- Phát triển hệ thống đánh giá hiệu suất và kế hoạch phát triển nghề nghiệp\n- Tư vấn cho Ban Giám đốc về các vấn đề nhân sự chiến lược\n- Xây dựng và cải thiện văn hóa doanh nghiệp\n- Quản lý ngân sách phòng nhân sự",
      requiredSkills:
        "- Kinh nghiệm quản lý nhân sự cấp cao trong lĩnh vực tài chính (tối thiểu 5 năm)\n- Kỹ năng lãnh đạo và quản lý đội ngũ xuất sắc\n- Hiểu biết sâu rộng về luật lao động Việt Nam\n- Kinh nghiệm xây dựng chính sách lương thưởng và phúc lợi\n- Tiếng Anh thành thạo (IELTS 7.0 trở lên hoặc tương đương)",
      preferredSkills:
        "- Bằng cấp chuyên môn về HR (SHRM, HRCI, v.v.)\n- Kỹ năng phân tích dữ liệu và báo cáo nhân sự\n- Kinh nghiệm với hệ thống HRIS\n- Kinh nghiệm làm việc trong môi trường đa quốc gia\n- Kỹ năng đàm phán và giải quyết xung đột xuất sắc",
      education:
        "Thạc sĩ Quản trị nhân sự, Quản trị kinh doanh hoặc chuyên ngành liên quan",
      additionalNotes:
        "- Mức lương hấp dẫn và cạnh tranh (35-50 triệu/tháng)\n- Thưởng hiệu suất hàng quý và thưởng cuối năm\n- Chế độ bảo hiểm sức khỏe cao cấp cho nhân viên và người thân\n- Gói cổ phiếu ưu đãi sau 2 năm làm việc\n- Cơ hội đào tạo quốc tế\n- Môi trường làm việc chuyên nghiệp, đa văn hóa",
      tone: "professional",
    },
  },
];

export default function CreateJobDescriptionPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  // Form state
  const [jobData, setJobData] = useState({
    title: "",
    companyName: "",
    industry: "",
    location: "",
    remoteOption: "onsite", // onsite, hybrid, remote
    experienceLevel: "", // entry, mid, senior, executive
    employmentType: "", // full-time, part-time, contract, internship
    requiredSkills: "",
    preferredSkills: "",
    keyResponsibilities: "",
    education: "",
    additionalNotes: "",
    tone: "professional", // professional, casual, enthusiastic
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateJD = async () => {
    // Reset any previous generated content and errors
    setErrorMessage(null);
    setGeneratedJD(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/employer/generate-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Đã xảy ra lỗi khi tạo mô tả công việc");
      }

      const data = await response.json();
      setGeneratedJD(data.jobDescription);

      // Sau khi tạo JD thành công, chuyển hướng đến trang xem trước với dữ liệu
      // Lưu dữ liệu vào localStorage để truy cập từ trang xem trước
      localStorage.setItem("jobData", JSON.stringify(jobData));
      localStorage.setItem("generatedJD", data.jobDescription);

      // Chuyển hướng đến trang xem trước
      router.push("/employer/jobs/create-jd/preview");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định"
      );
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    // Lưu dữ liệu hiện tại vào localStorage
    localStorage.setItem("jobData", JSON.stringify(jobData));
    if (generatedJD) {
      localStorage.setItem("generatedJD", generatedJD);
    }

    // Chuyển đến trang xem trước
    router.push("/employer/jobs/create-jd/preview");
  };

  const handleCancel = () => {
    router.push("/employer/jobs");
  };

  const isFormValid = () => {
    return (
      jobData.title.trim() !== "" &&
      jobData.companyName.trim() !== "" &&
      jobData.industry.trim() !== "" &&
      jobData.experienceLevel !== "" &&
      jobData.employmentType !== ""
    );
  };

  // Hàm để điền mẫu vào form
  const fillTemplateData = (templateId: number) => {
    const template = SAMPLE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setJobData(template.data);
      setActiveTemplate(templateId);
      setShowTemplatesDialog(false);
    }
  };

  // Hàm để tạo ngẫu nhiên một mẫu
  const fillRandomTemplate = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEMPLATES.length);
    fillTemplateData(SAMPLE_TEMPLATES[randomIndex].id);
  };

  // Hàm xóa thông tin form để nhập mới
  const resetForm = () => {
    setJobData({
      title: "",
      companyName: "",
      industry: "",
      location: "",
      remoteOption: "onsite",
      experienceLevel: "",
      employmentType: "",
      keyResponsibilities: "",
      requiredSkills: "",
      preferredSkills: "",
      education: "",
      additionalNotes: "",
      tone: "professional",
    });
    setActiveTemplate(null);
  };

  return (
    <EmployerDashboardShell activeNavItem="jobs" userRole="employer">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Quay lại"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Tạo Mô Tả Công Việc
              </h1>
            </div>
            <p className="text-gray-500">
              Sử dụng AI để tạo mô tả công việc chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-grow max-w-xl">
              <div className="bg-white rounded-lg border p-3 flex items-center gap-3">
                <div className="flex-grow">
                  <p className="text-sm font-medium">
                    {activeTemplate
                      ? `Mẫu đang sử dụng: ${
                          SAMPLE_TEMPLATES.find((t) => t.id === activeTemplate)
                            ?.name
                        }`
                      : "Chưa sử dụng mẫu nào"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Chọn mẫu có sẵn để tự động điền thông tin
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-gray-700"
                    onClick={() => setShowTemplatesDialog(!showTemplatesDialog)}
                  >
                    <Database className="h-4 w-4" />{" "}
                    {showTemplatesDialog ? "Ẩn mẫu" : "Chọn mẫu"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-gray-700"
                    onClick={resetForm}
                  >
                    <RefreshCcw className="h-4 w-4" /> Xóa form
                  </Button>
                </div>
              </div>
            </div>
            <Button
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={fillRandomTemplate}
            >
              <Clipboard className="h-4 w-4" /> Điền mẫu ngẫu nhiên
            </Button>
          </div>

          {/* Templates Dialog */}
          {showTemplatesDialog && (
            <div className="mt-3 bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">
                Chọn mẫu mô tả công việc
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SAMPLE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-3 cursor-pointer hover:border-lime-500 hover:bg-lime-50 transition-colors ${
                      activeTemplate === template.id
                        ? "border-lime-500 bg-lime-50"
                        : ""
                    }`}
                    onClick={() => fillTemplateData(template.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-lime-100 p-2">
                        <Briefcase className="h-4 w-4 text-lime-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.data.companyName} • {template.data.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">
                    Tên vị trí <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={jobData.title}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Kỹ sư phần mềm, Nhà thiết kế UX, Quản lý marketing..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">
                    Tên công ty <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={jobData.companyName}
                    onChange={handleInputChange}
                    placeholder="Tên công ty của bạn"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">
                    Ngành nghề <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={jobData.industry}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Công nghệ thông tin, Tài chính, Giáo dục..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">
                      Loại hình công việc{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={jobData.employmentType}
                      onValueChange={(value) =>
                        handleSelectChange("employmentType", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">
                          Toàn thời gian
                        </SelectItem>
                        <SelectItem value="part-time">Bán thời gian</SelectItem>
                        <SelectItem value="contract">Hợp đồng</SelectItem>
                        <SelectItem value="internship">Thực tập</SelectItem>
                        <SelectItem value="freelance">Tự do</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experienceLevel">
                      Mức kinh nghiệm <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={jobData.experienceLevel}
                      onValueChange={(value) =>
                        handleSelectChange("experienceLevel", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn mức kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">
                          Mới đi làm (0-1 năm)
                        </SelectItem>
                        <SelectItem value="mid">Trung cấp (2-4 năm)</SelectItem>
                        <SelectItem value="senior">Cao cấp (5+ năm)</SelectItem>
                        <SelectItem value="executive">
                          Quản lý cấp cao
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Địa điểm làm việc</Label>
                    <Input
                      id="location"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="remoteOption">Hình thức làm việc</Label>
                    <Select
                      value={jobData.remoteOption}
                      onValueChange={(value) =>
                        handleSelectChange("remoteOption", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn hình thức làm việc" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">Tại văn phòng</SelectItem>
                        <SelectItem value="hybrid">Kết hợp</SelectItem>
                        <SelectItem value="remote">Từ xa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requiredSkills">
                    Kỹ năng và yêu cầu bắt buộc{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="requiredSkills"
                    name="requiredSkills"
                    value={jobData.requiredSkills}
                    onChange={handleInputChange}
                    placeholder="Liệt kê các kỹ năng và yêu cầu PHẢI CÓ cho vị trí này"
                    className="mt-1 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredSkills">
                    Kỹ năng và yêu cầu là lợi thế
                  </Label>
                  <Textarea
                    id="preferredSkills"
                    name="preferredSkills"
                    value={jobData.preferredSkills}
                    onChange={handleInputChange}
                    placeholder="Liệt kê các kỹ năng và yêu cầu NẾU CÓ SẼ LÀ LỢI THẾ cho vị trí này"
                    className="mt-1 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="keyResponsibilities">Trách nhiệm chính</Label>
                  <Textarea
                    id="keyResponsibilities"
                    name="keyResponsibilities"
                    value={jobData.keyResponsibilities}
                    onChange={handleInputChange}
                    placeholder="Mô tả các trách nhiệm chính của vị trí này"
                    className="mt-1 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Yêu cầu học vấn</Label>
                  <Input
                    id="education"
                    name="education"
                    value={jobData.education}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Cử nhân Khoa học máy tính, Thạc sĩ Quản trị kinh doanh..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Thông tin bổ sung</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={jobData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Các thông tin bổ sung như phúc lợi, quy trình tuyển dụng, văn hóa công ty..."
                    className="mt-1 h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Phong cách viết</Label>
                  <Select
                    value={jobData.tone}
                    onValueChange={(value) => handleSelectChange("tone", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn phong cách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        Chuyên nghiệp
                      </SelectItem>
                      <SelectItem value="casual">Thân thiện</SelectItem>
                      <SelectItem value="enthusiastic">Hào hứng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <Button variant="outline" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <div className="flex gap-3">
                    {generatedJD && (
                      <Button
                        variant="outline"
                        onClick={handlePreview}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Xem trước
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleGenerateJD}
                      disabled={isGenerating || !isFormValid()}
                      className="bg-lime-600 hover:bg-lime-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-white mr-2"></div>
                          Đang tạo mô tả...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Tạo mô tả công việc
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {!isFormValid() && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                      Vui lòng điền vào các trường bắt buộc (đánh dấu *)
                    </AlertDescription>
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </EmployerDashboardShell>
  );
}
