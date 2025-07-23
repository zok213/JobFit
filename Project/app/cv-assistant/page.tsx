"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
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

export default function CVAssistantPage() {
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
          <Card className="border border-gray-200 hover:border-lime-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
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

          <Card className="border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
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

          <Card className="border border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
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

          <Card className="border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
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
                >
                  Tải lên CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
