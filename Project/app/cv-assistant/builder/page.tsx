"use client";

import React from "react";
import { CVBuilder } from "@/components/ai-cv-assistant/CVBuilder";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CVBuilderPage() {
  const router = useRouter();

  return (
    <DashboardShell activeNavItem="cv-assistant">
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 hover:text-black"
              onClick={() => router.push("/cv-assistant")}
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tạo CV của bạn</h1>
              <p className="text-gray-600">
                Xây dựng CV chuyên nghiệp từng bước một
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Lưu nháp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Xuất PDF
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CVBuilder />
        </div>
      </div>
    </DashboardShell>
  );
}
