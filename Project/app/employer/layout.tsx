"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RedirectLoader } from "@/components/ui/redirect-loader";
import { ChatWidget } from "@/components/ui/chat-widget";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectFailed, setRedirectFailed] = useState(false);

  // Only apply this loading logic to the root employer path
  const isRootEmployerPath = pathname === "/employer";

  useEffect(() => {
    if (!isRootEmployerPath) {
      setIsLoading(false);
      return;
    }

    // If we're still on the root employer path after 1 second,
    // handle redirect on client side (server redirect might have failed)
    const timer = setTimeout(() => {
      setRedirectFailed(true);
      router.push("/employer/dashboard");
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRootEmployerPath, router]);

  // Only for the root employer path
  if (isRootEmployerPath && redirectFailed) {
    return (
      <RedirectLoader
        destination="/employer/dashboard"
        message="Loading Employer Dashboard"
      />
    );
  }

  return (
    <>
      {children}
      <ChatWidget
        title="Trợ lý Nhà tuyển dụng"
        subtitle="Xin chào nhà tuyển dụng! Tôi có thể giúp gì cho bạn?"
        inputPlaceholder="Nhập câu hỏi về tuyển dụng..."
        role="employer"
        customMessages={[
          "Chào mừng đến với JobFit! 👋",
          "Tôi là trợ lý ảo dành cho nhà tuyển dụng. Tôi có thể giúp bạn:",
          "✅ Tạo và quản lý mô tả công việc",
          "✅ Thiết lập quy trình tuyển dụng",
          "✅ Phân tích CV và hồ sơ ứng viên",
          "✅ Tìm kiếm ứng viên phù hợp",
          "Hãy đặt câu hỏi và tôi sẽ hỗ trợ bạn!",
        ]}
      />
    </>
  );
}
