"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";
import { JobDetailsForm } from "@/components/ai-job-match/JobDetailsForm";

export default function JobDetailsPage() {
  return (
    <DashboardShell activeNavItem="job-match" userRole="employee">
      <JobMatchLayout>
        <JobDetailsForm />
      </JobMatchLayout>
    </DashboardShell>
  );
} 