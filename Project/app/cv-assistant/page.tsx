"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  BarChart,
  RefreshCw,
  Sparkles,
  FileEdit,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  MessageSquare,
  FileUp,
  Upload,
  Bot,
  Download,
  Eye,
  Clock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVPreviewModal } from "@/components/ai-cv-assistant/CVPreviewModal";
import { CVHistoryModal } from "@/components/ai-cv-assistant/CVHistoryModal";
import { AIContentModal } from "@/components/ai-cv-assistant/AIContentModal";
import { ChatAssistantModal } from "@/components/ai-cv-assistant/ChatAssistantModal";

export default function CVAssistantPage() {
  const router = useRouter();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAIContentModal, setShowAIContentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [cvData, setCvData] = useState(null);

  const handleAIContentGeneration = () => {
    setShowAIContentModal(true);
  };

  const handleInsertAIContent = (content: string) => {
    // Copy to clipboard for now
    navigator.clipboard.writeText(content);
    alert('✅ Nội dung đã được sao chép! Hãy dán vào phần tạo CV.');
  };

  const handlePreviewCV = () => {
    const cvDataString = localStorage.getItem('cv-builder-data');
    if (!cvDataString) {
      alert("⚠️ Chưa có CV nào để xem trước. Hãy tạo CV trước!");
      router.push("/cv-assistant/builder");
      return;
    }
    try {
      const data = JSON.parse(cvDataString);
      setCvData(data);
      setShowPreviewModal(true);
    } catch (error) {
      alert("❌ Lỗi khi tải CV!");
    }
  };

  const handleExportPDF = async () => {
    if (!cvData) return;
    
    try {
      // Convert blob URL to base64 if needed
      let dataToSend: any = cvData;
      
      if (dataToSend.personal?.photoUrl && dataToSend.personal.photoUrl.startsWith('blob:')) {
        try {
          const response = await fetch(dataToSend.personal.photoUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          dataToSend = {
            ...dataToSend,
            personal: {
              ...dataToSend.personal,
              photoUrl: base64
            }
          };
        } catch (error) {
          console.error('Error converting photo:', error);
        }
      }
      
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fullName = `${dataToSend.personal?.firstName || ''} ${dataToSend.personal?.lastName || ''}`.trim();
      a.download = `CV_${fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Có lỗi khi xuất PDF. Vui lòng thử lại!');
    }
  };

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  const handleRestoreVersion = (version: any) => {
    localStorage.setItem('cv-builder-data', JSON.stringify(version.data));
    setShowHistoryModal(false);
    alert('✅ Đã khôi phục phiên bản CV! Hãy mở trang tạo CV để xem.');
  };

  const handlePreviewVersion = (version: any) => {
    setCvData(version.data);
    setShowHistoryModal(false);
    setShowPreviewModal(true);
  };

  const handleChatAssistant = () => {
    // Load current CV data for context
    const cvDataString = localStorage.getItem('cv-builder-data');
    if (cvDataString) {
      setCvData(JSON.parse(cvDataString));
    }
    setShowChatModal(true);
  };

  const handleUploadCV = () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // TODO: Parse CV file and extract data
      alert(`📄 Đã chọn file: ${file.name}\n\n🚧 Tính năng phân tích và import CV tự động đang được phát triển!\n\nHiện tại bạn có thể tạo CV mới bằng công cụ tạo CV.`);
    };
    input.click();
  };

  return (
    <DashboardShell activeNavItem="cv-assistant">
      <div className="py-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Trợ lý CV</h1>
          <Badge className="bg-lime-100 text-black border-0 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-lime-700" />
            <span>Hỗ trợ AI</span>
          </Badge>
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Tạo, chỉnh sửa và cải thiện CV của bạn với các công cụ được hỗ trợ bởi
          AI
        </p>

        {/* Main Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          <Link href="/cv-assistant/builder" className="block group">
            <Card className="border border-gray-200 hover:border-lime-300 h-full shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4 group-hover:bg-lime-200 transition-colors">
                  <Plus className="h-6 w-6 text-lime-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Tạo CV mới</h2>
                <p className="text-gray-600 mb-4">
                  Xây dựng CV chuyên nghiệp từng bước một với hướng dẫn của AI
                </p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Mẫu đa dạng</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700"
                  >
                    Dễ tùy chỉnh
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-white hover:bg-lime-50 hover:text-lime-700 hover:border-lime-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo CV
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cv-assistant/editor" className="block group">
            <Card className="border border-gray-200 hover:border-blue-300 h-full shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <FileEdit className="h-6 w-6 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Chỉnh sửa CV</h2>
                <p className="text-gray-600 mb-4">
                  Chỉnh sửa và cải thiện CV hiện có với trình chỉnh sửa thông
                  minh
                </p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1"
                  >
                    <Brain className="h-3 w-3" />
                    <span>Chỉnh sửa thông minh</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700"
                  >
                    Định dạng nhanh
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  Chỉnh sửa CV
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cv-assistant/analysis" className="block group">
            <Card className="border border-gray-200 hover:border-purple-300 h-full shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BarChart className="h-6 w-6 text-purple-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Phân tích CV</h2>
                <p className="text-gray-600 mb-4">
                  Nhận phân tích chi tiết và đề xuất cải thiện CV của bạn bằng
                  AI
                </p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span>Điểm ATS</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700"
                  >
                    Phân tích từ khóa
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Phân tích CV
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Công cụ hỗ trợ CV</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Card className="border border-gray-200 hover:border-lime-300 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={handleAIContentGeneration}>
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Tạo nội dung CV bằng AI
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Tự động tạo nội dung chuyên nghiệp cho từng phần của CV
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-lime-600 p-0 h-auto flex items-center"
                  >
                    <span>Dùng ngay</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={handlePreviewCV}>
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Eye className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Xem trước CV</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Xem CV của bạn như nhà tuyển dụng sẽ thấy
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 p-0 h-auto flex items-center"
                  >
                    <span>Xem ngay</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={handleViewHistory}>
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Lịch sử thay đổi CV
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Theo dõi các thay đổi và phiên bản CV
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-amber-600 p-0 h-auto flex items-center"
                  >
                    <span>Xem lịch sử</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={handleChatAssistant}>
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Trợ lý CV trò chuyện
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Đặt câu hỏi và nhận hướng dẫn về CV của bạn
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-purple-600 p-0 h-auto flex items-center"
                  >
                    <span>Trò chuyện ngay</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                <Heart className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Đồng bộ hóa với tìm việc
                </h3>
                <p className="text-gray-700 mb-4">
                  CV của bạn được tự động đồng bộ hóa với tùy chọn tìm việc để
                  cải thiện độ chính xác khi gợi ý việc làm
                </p>
                <Button size="sm" variant="outline" className="bg-white">
                  Xem tùy chọn việc làm
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-lime-50 border border-lime-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-lime-100 flex-shrink-0 flex items-center justify-center">
                <FileUp className="h-5 w-5 text-lime-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Nhập CV hiện có</h3>
                <p className="text-gray-700 mb-4">
                  Tải lên CV hiện có của bạn để bắt đầu với các công cụ AI của
                  chúng tôi
                </p>
                <Button
                  size="sm"
                  className="bg-black text-lime-300 hover:bg-gray-800"
                  onClick={handleUploadCV}
                >
                  Tải lên CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      {cvData && (
        <CVPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          cvData={cvData}
          onExportPDF={handleExportPDF}
        />
      )}

      {/* CV History Modal */}
      <CVHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onRestore={handleRestoreVersion}
        onPreview={handlePreviewVersion}
      />

      {/* AI Content Generator Modal */}
      <AIContentModal
        isOpen={showAIContentModal}
        onClose={() => setShowAIContentModal(false)}
        onInsert={handleInsertAIContent}
      />

      {/* Chat Assistant Modal */}
      <ChatAssistantModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        cvData={cvData}
      />
    </DashboardShell>
  );
}
