"use client";

import { DashboardShell } from "@/components/DashboardShell";
import RoadmapGenerator from "@/components/ai-roadmap/RoadmapGenerator";

export default function RoadmapPage() {
  return (
    <DashboardShell activeNavItem="roadmap">
      <RoadmapGenerator />
    </DashboardShell>
  );
}
