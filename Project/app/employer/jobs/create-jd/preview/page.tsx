"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import FormattedJobDescription from "@/app/components/FormattedJobDescription";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  FileText,
  ArrowLeft,
  MessageSquare,
  Share2,
  Download,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PreviewPage() {
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedJobData = localStorage.getItem("jobData");
    const storedGeneratedJD = localStorage.getItem("generatedJD");

    if (storedJobData) {
      try {
        const parsedData = JSON.parse(storedJobData);
        setJobData(parsedData);
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

  const handleCreateInterview = () => {
    router.push("/employer/interview/create-questions");
  };

  const handleCopyToClipboard = () => {
    if (typeof window !== "undefined") {
      try {
        const textToCopy = generatedDescription || "Không có mô tả công việc";
        navigator.clipboard.writeText(textToCopy);
        alert("Đã sao chép mô tả công việc vào clipboard!");
      } catch (err) {
        console.error("Lỗi khi sao chép vào clipboard:", err);
      }
    }
  };

  return (
    <EmployerDashboardShell activeNavItem="jobs" userRole="employer">
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Xem trước mô tả công việc
              </h1>
              <p className="text-muted-foreground">
                Xem trước mô tả công việc trước khi đăng tin hoặc tạo bài phỏng
                vấn
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/employer/jobs/create-jd")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại chỉnh sửa
              </Button>
              <Button
                onClick={handleCreateInterview}
                className="bg-black text-lime-300 hover:bg-gray-800"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Tạo bài phỏng vấn
              </Button>
            </div>
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

          <div className="flex justify-center">
            {jobData && (
              <div className="max-w-5xl w-full">
                <div className="flex justify-end gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Sao chép
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                </div>
                <FormattedJobDescription
                  jobData={jobData}
                  generatedDescription={generatedDescription}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployerDashboardShell>
  );
}
