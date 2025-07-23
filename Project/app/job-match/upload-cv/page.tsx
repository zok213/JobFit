"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { UploadCV } from "@/components/ai-job-match/UploadCV";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";

export default function UploadCVPage() {
  return (
    <DashboardShell activeNavItem="job-match" userRole="employee">
      <JobMatchLayout>
        <UploadCV />
      </JobMatchLayout>
    </DashboardShell>
  );
} 