"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Star,
  ListChecks,
  FileText,
  MessageSquare,
  Monitor,
  Clock,
  Sparkles,
  Award,
  Heart,
  Zap,
  Check,
  PenTool,
  Download,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobData {
  jobTitle: string;
  companyName: string;
  industry: string;
  location: string;
  remoteOption: string;
  experienceLevel: string;
  employmentType: string;
  keyResponsibilities: string;
  requiredSkills: string;
  preferredSkills: string;
  education: string;
  additionalNotes: string;
  tone: string;
}

interface FormattedJobDescriptionProps {
  jobData: JobData;
  generatedDescription: string;
}

const FormattedJobDescription: React.FC<FormattedJobDescriptionProps> = ({
  jobData,
  generatedDescription,
}) => {
  // Hàm định dạng một phần nội dung
  const formatSection = (text: string) => {
    if (!text) return null;

    // Xử lý các tiêu đề markdown
    let formattedText = text
      // Heading 1 (# Tiêu đề)
      .replace(
        /^#\s+(.*?)$/gm,
        '<h2 class="text-xl font-bold text-primary mt-6 mb-3 pb-2 border-b border-primary/20">$1</h2>'
      )
      // Heading 2 (## Tiêu đề)
      .replace(
        /^##\s+(.*?)$/gm,
        '<h3 class="text-lg font-semibold text-primary/90 mt-5 mb-2">$1</h3>'
      )
      // Heading 3 (### Tiêu đề)
      .replace(
        /^###\s+(.*?)$/gm,
        '<h4 class="text-md font-semibold text-primary/80 mt-4 mb-2">$1</h4>'
      )

      // Xử lý các đoạn văn bản thường
      .replace(
        /^(?!\s*<[h|u|o]|<li|\*|\-|\d+\.|>)(.+)$/gm,
        '<p class="my-3 text-gray-700 leading-relaxed">$1</p>'
      )

      // Xử lý danh sách không thứ tự (bullet list)
      .replace(/^(\s*?)[\*\-]\s+(.*?)$/gm, (match, space, content) => {
        const icons = ["✓", "•", "◦", "▸"];
        const iconIndex = (space.length / 2) % icons.length;
        const icon = icons[iconIndex];
        const paddingLeft = space.length * 0.5 + "rem";

        return `<div class="flex items-start my-2 ml-${
          space.length
        }" style="margin-left: ${paddingLeft}">
          <div class="min-w-5 h-5 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center mr-2 mt-0.5 text-center">
            <span class="text-xs font-medium text-primary">${icon}</span>
          </div>
          <span class="text-gray-700">${formatInlineStyles(
            content.trim()
          )}</span>
        </div>`;
      })

      // Xử lý danh sách có thứ tự (numbered list)
      .replace(/^(\s*?)(\d+)\.\s+(.*?)$/gm, (match, space, number, content) => {
        const paddingLeft = space.length * 0.5 + "rem";

        return `<div class="flex items-start my-2 ml-${
          space.length
        }" style="margin-left: ${paddingLeft}">
          <div class="min-w-6 h-6 rounded-full bg-gradient-to-r from-primary/30 to-primary/50 flex items-center justify-center mr-2 mt-0.5">
            <span class="text-xs font-bold text-white">${number}</span>
          </div>
          <span class="text-gray-700">${formatInlineStyles(
            content.trim()
          )}</span>
        </div>`;
      })

      // Xử lý trích dẫn (blockquote)
      .replace(
        /^>\s+(.*?)$/gm,
        '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-gray-600 my-4 bg-primary/5 p-3 rounded-r-md">$1</blockquote>'
      )

      // Xử lý code block
      .replace(
        /```(.*?)```/gs,
        '<pre class="bg-gray-100 p-3 rounded-md text-sm font-mono text-gray-800 my-4 overflow-x-auto">$1</pre>'
      )

      // Xử lý horizontal rule
      .replace(/^---+$/gm, '<hr class="my-6 border-t border-gray-200" />');

    // Xóa khoảng trắng thừa
    formattedText = formattedText.replace(/\n+/g, "");

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  // Xử lý các inline style trong văn bản (in đậm, in nghiêng, highlight)
  const formatInlineStyles = (text: string) => {
    return (
      text
        // In đậm
        .replace(
          /\*\*(.*?)\*\*/g,
          '<span class="font-bold text-primary/90">$1</span>'
        )
        // In nghiêng
        .replace(/\*(.*?)\*/g, '<span class="italic text-gray-800">$1</span>')
        // Gạch chân
        .replace(
          /__(.*?)__/g,
          '<span class="underline decoration-primary/50 decoration-2">$1</span>'
        )
        // Code inline
        .replace(
          /`(.*?)`/g,
          '<code class="bg-gray-100 text-rose-600 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
        )
        // Highlight
        .replace(
          /==(.*?)==/g,
          '<mark class="bg-yellow-100 text-gray-800 px-1 rounded">$1</mark>'
        )
        // Strikethrough
        .replace(
          /~~(.*?)~~/g,
          '<span class="line-through text-gray-500">$1</span>'
        )
    );
  };

  // Chuyển đổi Markdown sang HTML
  const processMarkdownToHTML = (markdown: string): string => {
    if (!markdown) return "";

    // Loại bỏ hoàn toàn các cú pháp markdown nhưng giữ nguyên cấu trúc
    let html = markdown;

    // Xử lý các định dạng đặc biệt trước tiên
    // Tìm các tiêu đề chính dạng ***TEXT***
    const mainTitleRegex = /^\s*\*{3,}\s*(.+?)\s*\*{3,}\s*$/gm;
    html = html.replace(
      mainTitleRegex,
      '<h1 class="text-2xl font-bold text-primary my-4 text-center">$1</h1>'
    );

    // Xử lý text đậm với ** hoặc *** khi ở giữa dòng
    html = html.replace(
      /\*{3}([^*]+?)\*{3}/g,
      '<strong class="font-extrabold text-primary">$1</strong>'
    );
    html = html.replace(
      /\*{2}([^*]+?)\*{2}/g,
      '<strong class="font-bold text-primary">$1</strong>'
    );

    // Xử lý text nghiêng với *
    html = html.replace(
      /(?<!\*)\*([^*]+?)\*(?!\*)/g,
      '<em class="italic text-gray-800">$1</em>'
    );

    // Xử lý dòng có nhiều dấu --- hoặc ===
    const hrRegex = /^[-=]{3,}$/gm;
    html = html.replace(hrRegex, '<hr class="my-4 border-t border-gray-200"/>');

    // Xử lý cấu trúc tiêu đề (## Tiêu đề) thành HTML đẹp mắt
    const h2Regex = /^##\s+(.+?)$/gm;
    html = html.replace(h2Regex, (match, title) => {
      const cleanTitle = title.trim();
      const icon = getIconForSection(cleanTitle.toLowerCase());

      return `
      <div class="section-header">
        <div class="section-header-content">
          <div class="section-icon">${icon}</div>
          <h2 class="section-title">${cleanTitle}</h2>
        </div>
        <div class="section-header-line"></div>
      </div>
    `;
    });

    // Xử lý tiêu đề với dấu ###
    const h3Regex = /^###\s+(.+?)$/gm;
    html = html.replace(
      h3Regex,
      '<h3 class="text-xl font-semibold text-primary/90 my-3">$1</h3>'
    );

    // Xử lý các danh sách thành HTML đẹp mắt
    // Danh sách dấu gạch đầu dòng (- hoặc *)
    const bulletRegex = /^[\-\*]\s+(.+?)$/gm;
    html = html.replace(bulletRegex, (match, content) => {
      return `
      <div class="list-item">
        <div class="list-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="list-content">${content.trim()}</div>
      </div>
    `;
    });

    // Danh sách có số (1. 2. 3. ...)
    const numberedRegex = /^(\d+)\.\s+(.+?)$/gm;
    html = html.replace(numberedRegex, (match, number, content) => {
      return `
      <div class="list-item list-item-numbered">
        <div class="numbered-icon">${number}</div>
        <div class="list-content">${content.trim()}</div>
      </div>
    `;
    });

    // Xử lý các đoạn văn bản
    // Tìm các dòng không phải là các định dạng đặc biệt và đổi thành thẻ p
    const paragraphRegex = /^(?!<div class=|<h[1-3]|<hr|\s*$)(.+)$/gm;
    html = html.replace(paragraphRegex, '<p class="paragraph">$1</p>');

    // Thêm đoạn mở đầu và kết thúc
    html = `<div class="jd-content">${html}</div>`;

    // Thêm CSS cho HTML
    return `
      <style>
        .jd-content {
          font-family: var(--font-space-grotesk), sans-serif;
          line-height: 1.8;
          color: #333;
          animation: fadeIn 0.5s ease-out;
        }
        
        .section-header {
          margin: 2rem 0 1.2rem;
          animation: slideInRight 0.5s ease-out;
        }
        
        .section-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .section-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(45deg, var(--color-primary-rgb, 22, 163, 74) 0%, rgba(var(--color-primary-rgb, 22, 163, 74), 0.8) 100%);
          color: white;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(var(--color-primary-rgb, 22, 163, 74), 0.2);
        }
        
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: rgba(var(--color-primary-rgb, 22, 163, 74), 1);
          margin: 0;
          padding: 0;
        }
        
        .section-header-line {
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, 
            rgba(var(--color-primary-rgb, 22, 163, 74), 0.8) 0%, 
            rgba(var(--color-primary-rgb, 22, 163, 74), 0.1) 100%);
          margin-top: 0.5rem;
        }
        
        .list-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          animation: slideInLeft 0.5s ease-out;
          animation-fill-mode: both;
        }
        
        .list-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          height: 1.5rem;
          background-color: rgba(var(--color-primary-rgb, 22, 163, 74), 0.15);
          color: rgba(var(--color-primary-rgb, 22, 163, 74), 1);
          border-radius: 50%;
          margin-right: 0.75rem;
          margin-top: 0.2rem;
        }
        
        .numbered-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(45deg, rgba(var(--color-primary-rgb, 22, 163, 74), 0.8) 0%, rgba(var(--color-primary-rgb, 22, 163, 74), 0.6) 100%);
          color: white;
          border-radius: 50%;
          margin-right: 0.75rem;
          font-weight: bold;
          font-size: 0.8rem;
          margin-top: 0.2rem;
        }
        
        .list-content {
          flex: 1;
          font-size: 1.1rem;
        }
        
        .paragraph {
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
          line-height: 1.8;
          animation: fadeIn 0.6s ease-out;
        }
        
        .check-icon {
          width: 0.75rem;
          height: 0.75rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* Áp dụng thời gian trễ cho các mục danh sách xuất hiện tuần tự */
        .list-item:nth-child(1) { animation-delay: 0.1s; }
        .list-item:nth-child(2) { animation-delay: 0.15s; }
        .list-item:nth-child(3) { animation-delay: 0.2s; }
        .list-item:nth-child(4) { animation-delay: 0.25s; }
        .list-item:nth-child(5) { animation-delay: 0.3s; }
        .list-item:nth-child(6) { animation-delay: 0.35s; }
        .list-item:nth-child(7) { animation-delay: 0.4s; }
        .list-item:nth-child(8) { animation-delay: 0.45s; }
        .list-item:nth-child(9) { animation-delay: 0.5s; }
        .list-item:nth-child(10) { animation-delay: 0.55s; }
      </style>
      ${html}
    `;
  };

  // Phân tích generatedDescription thành các phần
  const formatGeneratedDescription = () => {
    if (!generatedDescription) return null;

    return (
      <div className="prose prose-xl max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: processMarkdownToHTML(generatedDescription),
          }}
        />
      </div>
    );
  };

  // Trả về HTML icon dựa trên tên section
  const getIconForSection = (sectionTitle: string): string => {
    if (
      sectionTitle.includes("trách nhiệm") ||
      sectionTitle.includes("mô tả") ||
      sectionTitle.includes("nhiệm vụ")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>';
    } else if (
      sectionTitle.includes("yêu cầu") ||
      sectionTitle.includes("kỹ năng")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (
      sectionTitle.includes("ưu tiên") ||
      sectionTitle.includes("lợi thế")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    } else if (
      sectionTitle.includes("học vấn") ||
      sectionTitle.includes("đào tạo") ||
      sectionTitle.includes("trình độ")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
    } else if (
      sectionTitle.includes("phúc lợi") ||
      sectionTitle.includes("đãi ngộ") ||
      sectionTitle.includes("lương")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    } else if (
      sectionTitle.includes("giới thiệu") ||
      sectionTitle.includes("công ty") ||
      sectionTitle.includes("tổ chức")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>';
    } else if (
      sectionTitle.includes("cơ hội") ||
      sectionTitle.includes("thăng tiến") ||
      sectionTitle.includes("phát triển")
    ) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>';
    } else {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-tool"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>';
    }
  };

  // Tạo gradient background dựa vào tone
  const getGradientByTone = () => {
    switch (jobData.tone) {
      case "professional":
        return "from-blue-500/20 to-indigo-500/20";
      case "enthusiastic":
        return "from-amber-500/20 to-orange-500/20";
      case "casual":
        return "from-green-500/20 to-teal-500/20";
      default:
        return "from-primary/20 to-primary/10";
    }
  };

  return (
    <div className="space-y-6 my-8">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Thêm custom scrollbar đẹp */
        .jd-content::-webkit-scrollbar {
          width: 12px;
        }
        .jd-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .jd-content::-webkit-scrollbar-thumb {
          background: rgba(var(--color-primary), 0.5);
          border-radius: 10px;
        }
        .jd-content::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--color-primary), 0.7);
        }

        /* Tạo hiệu ứng đường viền sáng */
        .card-glow {
          position: relative;
        }
        .card-glow::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            rgba(var(--color-primary), 0.2),
            rgba(var(--color-primary), 0.1),
            rgba(var(--color-primary), 0),
            rgba(var(--color-primary), 0.1),
            rgba(var(--color-primary), 0.2)
          );
          border-radius: inherit;
          z-index: -2;
          animation: glowingBorder 3s ease-in-out infinite alternate;
        }

        @keyframes glowingBorder {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <Card
        className={`border-2 border-primary/20 shadow-xl overflow-hidden max-w-5xl mx-auto min-h-[85vh] card-glow`}
      >
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${getGradientByTone()} rounded-bl-full opacity-40 -z-10`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${getGradientByTone()} rounded-tr-full opacity-40 -z-10`}
        ></div>
        <div
          className={`absolute top-1/2 left-0 w-48 h-96 bg-gradient-to-r from-primary/10 to-transparent -z-10 blur-3xl`}
        ></div>
        <div
          className={`absolute top-1/3 right-0 w-48 h-96 bg-gradient-to-l from-primary/10 to-transparent -z-10 blur-3xl`}
        ></div>

        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-8 relative pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <CardTitle className="text-4xl md:text-5xl font-bold text-primary">
                <span className="inline-flex items-center">
                  <Zap className="h-10 w-10 mr-4 text-yellow-500" />
                  {jobData.jobTitle}
                </span>
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center mt-5 text-2xl">
                <Building2 className="h-7 w-7 mr-3 text-primary/80" />
                <span className="font-medium text-gray-700">
                  {jobData.companyName}
                </span>
                {jobData.industry && (
                  <Badge
                    variant="outline"
                    className="ml-4 bg-primary/10 text-primary border-primary/30 text-lg px-4 py-1.5"
                  >
                    {jobData.industry}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <div className="flex items-center text-gray-700 bg-gray-100 px-5 py-2.5 rounded-full text-lg">
                <MapPin className="h-6 w-6 mr-2 text-rose-500" />
                <span className="font-medium">{jobData.location}</span>
              </div>
              {jobData.remoteOption && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none text-lg px-4 py-1.5"
                >
                  <Monitor className="h-5 w-5 mr-2" />
                  {jobData.remoteOption === "remote"
                    ? "Làm việc từ xa"
                    : jobData.remoteOption === "hybrid"
                    ? "Làm việc kết hợp"
                    : "Làm việc tại văn phòng"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="h-0.5" />

        <CardContent className="pt-10 px-10 pb-8 min-h-[50vh] flex flex-col">
          <div className="flex flex-wrap gap-4 mb-10">
            {jobData.experienceLevel && (
              <Badge
                variant="outline"
                className="flex items-center bg-blue-50 border-blue-200 text-blue-700 px-5 py-2 text-lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                {jobData.experienceLevel === "entry"
                  ? "Mới đi làm (0-1 năm)"
                  : jobData.experienceLevel === "mid"
                  ? "Kinh nghiệm (2-4 năm)"
                  : jobData.experienceLevel === "senior"
                  ? "Chuyên gia (5+ năm)"
                  : "Quản lý cấp cao"}
              </Badge>
            )}
            {jobData.employmentType && (
              <Badge
                variant="outline"
                className="flex items-center bg-green-50 border-green-200 text-green-700 px-5 py-2 text-lg"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                {jobData.employmentType === "full-time"
                  ? "Toàn thời gian"
                  : jobData.employmentType === "part-time"
                  ? "Bán thời gian"
                  : jobData.employmentType === "contract"
                  ? "Hợp đồng"
                  : jobData.employmentType === "internship"
                  ? "Thực tập"
                  : "Freelance"}
              </Badge>
            )}
          </div>

          <div className="relative jd-content flex-grow overflow-y-auto pr-4 min-h-[40vh]">
            {/* Hiển thị kết quả AI đã được định dạng */}
            <div className="prose prose-xl max-w-none animate-fadeIn prose-headings:mb-6 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2">
              {formatGeneratedDescription()}
            </div>

            {/* Hiển thị trực tiếp từ jobData nếu không có generatedDescription */}
            {!generatedDescription && (
              <div className="space-y-10 text-xl leading-relaxed">
                {jobData.keyResponsibilities && (
                  <div className="space-y-5">
                    <h3 className="text-3xl font-semibold flex items-center text-primary pb-2 border-b border-primary/20">
                      <ListChecks className="h-8 w-8 mr-3" />
                      Trách nhiệm chính
                    </h3>
                    <div className="pl-11 text-gray-700 whitespace-pre-line">
                      {jobData.keyResponsibilities}
                    </div>
                  </div>
                )}

                {jobData.requiredSkills && (
                  <div className="space-y-5">
                    <h3 className="text-3xl font-semibold flex items-center text-primary pb-2 border-b border-primary/20">
                      <CheckCircle className="h-8 w-8 mr-3" />
                      Kỹ năng yêu cầu
                    </h3>
                    <div className="pl-11 text-gray-700 whitespace-pre-line">
                      {jobData.requiredSkills}
                    </div>
                  </div>
                )}

                {jobData.preferredSkills && (
                  <div className="space-y-5">
                    <h3 className="text-3xl font-semibold flex items-center text-primary pb-2 border-b border-primary/20">
                      <Star className="h-8 w-8 mr-3" />
                      Kỹ năng ưu tiên
                    </h3>
                    <div className="pl-11 text-gray-700 whitespace-pre-line">
                      {jobData.preferredSkills}
                    </div>
                  </div>
                )}

                {jobData.education && (
                  <div className="space-y-5">
                    <h3 className="text-3xl font-semibold flex items-center text-primary pb-2 border-b border-primary/20">
                      <GraduationCap className="h-8 w-8 mr-3" />
                      Trình độ học vấn
                    </h3>
                    <div className="pl-11 text-gray-700 whitespace-pre-line">
                      {jobData.education}
                    </div>
                  </div>
                )}

                {jobData.additionalNotes && (
                  <div className="space-y-5">
                    <h3 className="text-3xl font-semibold flex items-center text-primary pb-2 border-b border-primary/20">
                      <FileText className="h-8 w-8 mr-3" />
                      Thông tin bổ sung
                    </h3>
                    <div className="pl-11 text-gray-700 whitespace-pre-line">
                      {jobData.additionalNotes}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-gradient-to-l from-primary/5 to-transparent flex justify-between items-center py-6 px-10">
          <p className="text-base text-gray-500 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            JobFit AI - Mô tả việc làm được hỗ trợ bởi AI
          </p>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full px-4">
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
            <Button variant="outline" size="sm" className="rounded-full px-4">
              <Copy className="h-4 w-4 mr-2" />
              Sao chép
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormattedJobDescription;
