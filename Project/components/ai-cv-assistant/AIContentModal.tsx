"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Bot, Sparkles, Copy, RefreshCw } from "lucide-react";

interface AIContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

type ContentType = 'summary' | 'experience' | 'skills' | 'custom';

export function AIContentModal({ isOpen, onClose, onInsert }: AIContentModalProps) {
  const [contentType, setContentType] = useState<ContentType>('summary');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form fields for context
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [skills, setSkills] = useState('');

  const contentTypeLabels: Record<ContentType, string> = {
    summary: 'Tóm tắt chuyên môn',
    experience: 'Mô tả kinh nghiệm',
    skills: 'Danh sách kỹ năng',
    custom: 'Nội dung tùy chỉnh'
  };

  const generateContent = async () => {
    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      // Build context from form
      let context = '';
      if (contentType === 'summary') {
        context = `Tạo professional summary cho vị trí ${jobTitle || 'nhân viên'} với ${yearsExp || '3'} năm kinh nghiệm. Kỹ năng chính: ${skills || 'chưa cung cấp'}.`;
      } else if (contentType === 'experience') {
        context = `Viết mô tả công việc cho vị trí ${jobTitle || 'không xác định'} tại ${company || 'công ty'}. ${prompt}`;
      } else if (contentType === 'skills') {
        context = `Tạo danh sách kỹ năng cho ${jobTitle || 'developer'} với ${yearsExp || '3'} năm kinh nghiệm. ${prompt}`;
      } else {
        context = prompt;
      }

      // Call DeepSeek API
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          context,
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Fallback: Generate simple content
      let fallbackContent = '';
      if (contentType === 'summary') {
        fallbackContent = `Là ${jobTitle || 'chuyên gia'} với ${yearsExp || '3+'} năm kinh nghiệm trong lĩnh vực công nghệ. Có kinh nghiệm làm việc với ${skills || 'các công nghệ hiện đại'}. Đam mê học hỏi và phát triển sản phẩm chất lượng cao, luôn tìm kiếm cơ hội để áp dụng kỹ năng và kiến thức vào các dự án thực tế.`;
      } else if (contentType === 'experience') {
        fallbackContent = `Chịu trách nhiệm ${prompt || 'phát triển và duy trì các tính năng của sản phẩm'}. Làm việc với team để đảm bảo chất lượng code và hiệu suất hệ thống. Tham gia vào quá trình review code và tối ưu hóa performance.`;
      } else if (contentType === 'skills') {
        fallbackContent = skills || 'JavaScript, TypeScript, React, Node.js, Git, Agile';
      } else {
        fallbackContent = 'Đây là nội dung mẫu. Vui lòng chỉnh sửa theo nhu cầu của bạn.';
      }
      
      setGeneratedContent(fallbackContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('✅ Đã sao chép vào clipboard!');
  };

  const insertContent = () => {
    onInsert(generatedContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-lime-50 to-green-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="h-6 w-6 text-lime-600" />
              Tạo nội dung CV bằng AI
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              AI sẽ giúp bạn viết nội dung chuyên nghiệp cho CV
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div>
            <Label className="mb-2 block">Loại nội dung</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(contentTypeLabels) as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    contentType === type
                      ? 'border-lime-500 bg-lime-50 text-lime-700 font-semibold'
                      : 'border-gray-200 hover:border-lime-300 text-gray-700'
                  }`}
                >
                  {contentTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Context Inputs */}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <h3 className="font-semibold mb-3 text-sm text-gray-700">Thông tin ngữ cảnh (tùy chọn)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Vị trí/Chức danh</Label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="vd: Senior Frontend Developer"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Năm kinh nghiệm</Label>
                <Input
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  placeholder="vd: 5"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Kỹ năng chính</Label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="vd: React, TypeScript, Node.js"
                  className="mt-1"
                />
              </div>
              {contentType === 'experience' && (
                <div className="col-span-2">
                  <Label className="text-xs">Công ty</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="vd: Google, Microsoft"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Prompt */}
          <div>
            <Label className="mb-2 block">Yêu cầu chi tiết (tùy chọn)</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Mô tả thêm về nội dung bạn muốn tạo..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateContent}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang tạo nội dung...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo nội dung bằng AI
              </>
            )}
          </Button>

          {/* Generated Content */}
          {generatedContent && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900">Nội dung được tạo</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="text-blue-600 border-blue-300"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Sao chép
                </Button>
              </div>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={8}
                className="resize-none bg-white"
              />
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Hủy
          </Button>
          {generatedContent && (
            <Button
              onClick={insertContent}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Chèn vào CV
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
