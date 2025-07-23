"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoadmapLayout } from "@/components/ai-roadmap/RoadmapLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function RoadmapVisualizerPage() {
  const router = useRouter();
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch the roadmap data from localStorage
    const fetchRoadmap = async () => {
      try {
        const data = localStorage.getItem("roadmapData");

        if (!data) {
          setError(
            "Không tìm thấy dữ liệu lộ trình. Vui lòng tạo lộ trình trước."
          );
          setIsLoading(false);
          return;
        }

        const parsedData = JSON.parse(data);

        if (parsedData.error) {
          setError(`Lỗi: ${parsedData.error}`);
          setIsLoading(false);
          return;
        }

        if (!parsedData.text && !parsedData.html) {
          setError("Dữ liệu lộ trình không hợp lệ hoặc trống.");
          setIsLoading(false);
          return;
        }

        console.log("Displaying roadmap data:", parsedData);

        setRoadmapData({
          markdownContent: parsedData.text,
          htmlContent: parsedData.html,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error processing roadmap data:", error);
        setError("Không thể tải dữ liệu lộ trình. Vui lòng thử lại.");
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  // Sử dụng useEffect để kích hoạt scripts sau khi HTML được render
  useEffect(() => {
    if (roadmapData?.htmlContent && contentRef.current) {
      // Đã chuyển sang HTML tĩnh không cần scripts
      console.log("Roadmap content loaded successfully");
    }
  }, [roadmapData]);

  return (
    <DashboardShell activeNavItem="roadmap" userRole="employee">
      <RoadmapLayout activeStep="visualizer">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex items-center justify-center bg-lime-100 rounded-full w-16 h-16 mb-4">
              <Loader2 className="h-8 w-8 text-lime-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Đang tạo lộ trình sự nghiệp của bạn
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Chúng tôi đang phân tích mục tiêu của bạn và tạo lộ trình phát
              triển cá nhân với các mốc quan trọng và tài nguyên.
            </p>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-md mb-6 flex items-start">
              <AlertTriangle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
            <Button
              onClick={() => router.push("/roadmap")}
              className="bg-black text-lime-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại và thử lại
            </Button>
          </div>
        ) : (
          // Success state - render the roadmap
          <div className="relative bg-white shadow-md rounded-lg max-w-6xl mx-auto p-6 md:p-8">
            {roadmapData.htmlContent ? (
              // Hiển thị nội dung HTML
              <div
                ref={contentRef}
                className="prose prose-lg max-w-full dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: roadmapData.htmlContent }}
              ></div>
            ) : (
              // Fallback sang Markdown
              <div className="prose prose-lg max-w-full dark:prose-invert prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-li:marker:text-lime-500 prose-a:text-lime-600 prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown>{roadmapData.markdownContent}</ReactMarkdown>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => router.push("/roadmap")}
                variant="outline"
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button
                onClick={() => window.print()}
                className="bg-black text-lime-300 hover:bg-gray-800"
              >
                Lưu lộ trình
              </Button>
            </div>
          </div>
        )}
      </RoadmapLayout>
    </DashboardShell>
  );
}
