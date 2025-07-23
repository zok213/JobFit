"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";
import { Loader2 } from "lucide-react";

export default function JobMatchPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/job-match/details");
  }, [router]);

  return (
    <DashboardShell activeNavItem="job-match" userRole="employee">
      <JobMatchLayout>
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-10 w-10 text-lime-500 animate-spin mb-4" />
          <p className="text-gray-500">
            Đang chuyển hướng đến trang chọn công việc...
          </p>
        </div>
      </JobMatchLayout>
    </DashboardShell>
  );
}
