"use client";

import React, { useState, useEffect } from "react";
import { CVEditor } from "@/components/ai-cv-assistant/CVEditor";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CVEditorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    // Kiểm tra có bản nháp không
    const draft = localStorage.getItem('cv-builder-data');
    setHasDraft(!!draft);
  }, []);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const cvData = localStorage.getItem('cv-editor-data') || localStorage.getItem('cv-builder-data');
      
      if (cvData) {
        setSaveMessage("✅ Đã lưu bản nháp thành công!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      setSaveMessage("❌ Lỗi lưu bản nháp. Vui lòng thử lại.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setSaveMessage("");
    try {
      // Lấy dữ liệu CV từ editor hoặc builder
      const cvDataString = localStorage.getItem('cv-editor-data') || localStorage.getItem('cv-builder-data');
      
      if (!cvDataString) {
        throw new Error("Không tìm thấy dữ liệu CV");
      }

      let cvData = JSON.parse(cvDataString);

      // Convert blob URL to base64 if needed
      if (cvData.personal?.photoUrl && cvData.personal.photoUrl.startsWith('blob:')) {
        try {
          const response = await fetch(cvData.personal.photoUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          cvData = {
            ...cvData,
            personal: {
              ...cvData.personal,
              photoUrl: base64
            }
          };
        } catch (error) {
          console.error('Error converting photo:', error);
        }
      }

      // Call API to generate PDF
      setSaveMessage("📥 Đang tạo file PDF...");
      
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fullName = `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`.trim();
      a.download = `CV_${fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSaveMessage("✅ Đã xuất PDF thành công!");
      setTimeout(() => setSaveMessage(""), 3000);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setSaveMessage("❌ Lỗi xuất PDF. Vui lòng thử lại.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsExporting(false);
    }
  };

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
                {hasDraft 
                  ? "Tiếp tục chỉnh sửa CV từ bản nháp của bạn" 
                  : "Tạo hoặc chỉnh sửa CV với trình soạn thảo có cấu trúc"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu nháp
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Xuất PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {saveMessage && (
          <div className={`mb-4 p-3 rounded-lg ${
            saveMessage.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" :
            saveMessage.includes("📥") ? "bg-blue-50 text-blue-700 border border-blue-200" :
            "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {saveMessage}
          </div>
        )}

        {hasDraft && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
            ℹ️ Đã tải bản nháp của bạn. Tiếp tục chỉnh sửa hoặc tạo mới.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CVEditor />
        </div>
      </div>
    </DashboardShell>
  );
}
