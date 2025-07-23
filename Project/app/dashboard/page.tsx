"use client";

import { useState, useEffect } from "react";
import Dashboard from "../../components/Dashboard";
import { LinkButton } from "@/components/LinkButton";
import { Briefcase, FileText, MessageCircle, MapPin, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const shortcuts = [
  {
    id: 1,
    title: "AI Job Match",
    description: "Phân tích mức độ phù hợp của CV với công việc",
    icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
    href: "/job-match",
  },
  {
    id: 2,
    title: "AI CV Assistant",
    description: "Optimize your CV with AI analysis",
    icon: <FileText className="w-6 h-6 text-green-500" />,
    href: "/cv-assistant",
  },
  {
    id: 3,
    title: "AI Interviewer",
    description: "Practice with AI interview simulations",
    icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
    href: "/interviewer",
  },
  {
    id: 4,
    title: "AI Career Roadmap",
    description: "Plan your career path with AI guidance",
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    href: "/roadmap",
  },
];

export default function DashboardPage() {
  const [notification, setNotification] = useState<{
    message: string;
    type: "info" | "error";
  } | null>(null);

  // Simulate checking for errors
  useEffect(() => {
    // Check if there was an error with the interviewer component
    const checkForErrors = () => {
      // For demonstration purposes - remove this in production and implement actual error checking
      const hasInterviewerError = window.location.href.includes("dashboard");

      if (hasInterviewerError) {
        setNotification({
          message: "Connection to interviewer service restored",
          type: "info",
        });

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
          setNotification(null);
        }, 5000);

        return () => clearTimeout(timer);
      }
    };

    checkForErrors();
  }, []);

  return (
    <DashboardShell activeNavItem="dashboard" userRole="employee">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => (
              <Card
                key={shortcut.id}
                className="bg-white overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-lime-300 h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 p-2.5 rounded-full w-fit bg-lime-50">
                    {shortcut.icon}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {shortcut.title}
                  </CardTitle>
                  <CardDescription className="mt-1 mb-4">
                    {shortcut.description}
                  </CardDescription>
                  <div className="mt-auto pt-2">
                    <LinkButton
                      href={shortcut.href}
                      variant="default"
                      className="w-full justify-between bg-black hover:bg-gray-800 text-lime-300"
                      trailingIcon={<ArrowRight className="h-4 w-4" />}
                      aria-label={`Go to ${shortcut.title}`}
                    >
                      Launch
                    </LinkButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Dashboard />

        {/* Notification */}
        {notification && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-slide-up 
            ${
              notification.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-lime-100 text-black border border-lime-200"
            }`}
          >
            <div className="flex-1">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-full hover:bg-gray-200/50"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
