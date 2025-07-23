"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { MatchResults } from "@/components/ai-job-match/MatchResults";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";
import { DetailedAnalysis } from "@/components/ai-job-match/DetailedAnalysis";

export default function ResultsPage() {
  return (
    <DashboardShell activeNavItem="job-match" userRole="employee">
      <JobMatchLayout>
        <div className="w-full">
          <MatchResults />
        </div>
        <div className="mt-8 w-full">
          <h2 className="text-xl font-semibold mb-4">Phân tích chi tiết</h2>
          <div className="bg-white rounded-xl shadow-sm">
            <DetailedAnalysis />
          </div>
        </div>
      </JobMatchLayout>
    </DashboardShell>
  );
}
