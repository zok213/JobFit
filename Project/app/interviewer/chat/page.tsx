"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { EnhancedChat } from "@/components/ai-interviewer/EnhancedChat";

export default function InterviewChatPage() {
  return (
    <DashboardShell activeNavItem="interviewer" userRole="employee">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Technical Interview Session</h1>
          <p className="text-gray-500 mt-1">Practice your interview skills with our AI interviewer</p>
        </div>
        
        <EnhancedChat />
      </div>
    </DashboardShell>
  );
} 