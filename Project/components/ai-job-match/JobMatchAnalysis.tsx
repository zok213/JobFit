"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useJobMatchStore } from "@/store/jobMatchStore";

export function JobMatchAnalysis() {
  const { matchResult } = useJobMatchStore();

  if (!matchResult || !matchResult.htmlAnalysis) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Phân tích chi tiết không khả dụng
        </div>
      </Card>
    );
  }

  return (
    <div className="job-match-analysis-container">
      <Card className="p-0 overflow-hidden rounded-xl shadow-md border border-gray-200">
        <div className="px-1 py-1 sm:px-6 sm:py-6">
          {/* Sử dụng dangerouslySetInnerHTML để hiển thị nội dung HTML */}
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: matchResult.htmlAnalysis }}
          />
        </div>
      </Card>

      <style jsx global>{`
        /* Tùy chỉnh thêm CSS để làm đẹp phân tích */
        .job-match-analysis-container {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
        }

        .job-match-analysis h1,
        .job-match-analysis h2,
        .job-match-analysis h3,
        .job-match-analysis h4 {
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          margin-top: 0;
        }

        .job-match-analysis-container ul {
          margin-bottom: 1.5rem;
        }

        .job-match-analysis-container li {
          margin-bottom: 0.5rem;
        }

        .job-match-analysis-container strong {
          color: #111827;
        }

        /* Thêm animation và hiệu ứng */
        .job-match-analysis-container div[class*="rounded-lg"] {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .job-match-analysis-container div[class*="rounded-lg"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Kiểu cho các thành phần */
        .job-match-analysis-container .bg-blue-100 {
          background-color: rgba(219, 234, 254, 0.6);
        }

        .job-match-analysis-container .bg-green-100 {
          background-color: rgba(220, 252, 231, 0.6);
        }

        .job-match-analysis-container .bg-purple-100 {
          background-color: rgba(237, 233, 254, 0.6);
        }

        .job-match-analysis-container .bg-indigo-100 {
          background-color: rgba(224, 231, 255, 0.6);
        }

        .job-match-analysis-container .bg-yellow-100 {
          background-color: rgba(254, 249, 195, 0.6);
        }

        .job-match-analysis-container .bg-red-100 {
          background-color: rgba(254, 226, 226, 0.6);
        }

        .job-match-analysis-container .bg-teal-100 {
          background-color: rgba(204, 251, 241, 0.6);
        }

        /* Gradient borders */
        .job-match-analysis-container .border-blue-500 {
          border-image: linear-gradient(to bottom, #3b82f6, #60a5fa) 1;
        }

        .job-match-analysis-container .border-green-500 {
          border-image: linear-gradient(to bottom, #22c55e, #4ade80) 1;
        }

        .job-match-analysis-container .border-purple-500 {
          border-image: linear-gradient(to bottom, #8b5cf6, #a78bfa) 1;
        }

        .job-match-analysis-container .border-indigo-500 {
          border-image: linear-gradient(to bottom, #6366f1, #818cf8) 1;
        }

        .job-match-analysis-container .border-yellow-500 {
          border-image: linear-gradient(to bottom, #eab308, #facc15) 1;
        }

        .job-match-analysis-container .border-red-500 {
          border-image: linear-gradient(to bottom, #ef4444, #f87171) 1;
        }

        .job-match-analysis-container .border-teal-500 {
          border-image: linear-gradient(to bottom, #14b8a6, #2dd4bf) 1;
        }

        /* Phần trăm match */
        .job-match-analysis-container .font-bold.text-green-600 {
          background: -webkit-linear-gradient(#16a34a, #4ade80);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.1em;
        }
      `}</style>
    </div>
  );
}
