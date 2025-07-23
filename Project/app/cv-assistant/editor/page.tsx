"use client";

import React from "react";
import { CVEditor } from "@/components/ai-cv-assistant/CVEditor";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CVEditorPage() {
  const router = useRouter();

  return (
    <DashboardShell activeNavItem="cv-assistant" userRole="employee">
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
              <h1 className="text-2xl font-bold">Trình chỉnh sửa CV</h1>
              <p className="text-gray-600">
                Tạo hoặc chỉnh sửa CV với trình soạn thảo có cấu trúc. Chúng tôi
                sẽ giúp bạn tổ chức thông tin và định dạng nó một cách chuyên
                nghiệp.
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
          <CVEditor />
        </div>
      </div>
    </DashboardShell>
  );
}
