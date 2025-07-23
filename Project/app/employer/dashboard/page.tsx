"use client";

import React, { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Briefcase,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  CheckCircle2,
  PencilLine,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock data for dashboard
const stats = [
  {
    title: "Active Jobs",
    value: 12,
    change: 8.2,
    changeType: "increase",
    icon: Briefcase,
    color: "bg-blue-500",
  },
  {
    title: "Total Candidates",
    value: 342,
    change: 12.5,
    changeType: "increase",
    icon: Users,
    color: "bg-lime-500",
  },
  {
    title: "Profile Views",
    value: 1240,
    change: 3.2,
    changeType: "decrease",
    icon: Eye,
    color: "bg-purple-500",
  },
  {
    title: "Interviews Scheduled",
    value: 8,
    change: 24,
    changeType: "increase",
    icon: Calendar,
    color: "bg-orange-500",
  },
];

// Recent job listings
const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "Remote",
    applicants: 24,
    datePosted: "2 days ago",
    status: "active",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    location: "New York, NY",
    applicants: 18,
    datePosted: "5 days ago",
    status: "active",
  },
  {
    id: 3,
    title: "Backend Engineer",
    location: "San Francisco, CA",
    applicants: 32,
    datePosted: "1 week ago",
    status: "active",
  },
  {
    id: 4,
    title: "Product Manager",
    location: "Remote",
    applicants: 42,
    datePosted: "2 weeks ago",
    status: "closed",
  },
];

// Recent candidate applications
const recentCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    matchScore: 92,
    status: "new",
    appliedDate: "Today",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UX/UI Designer",
    matchScore: 88,
    status: "reviewed",
    appliedDate: "Yesterday",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    role: "Backend Engineer",
    matchScore: 95,
    status: "interview",
    appliedDate: "2 days ago",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Product Manager",
    matchScore: 78,
    status: "rejected",
    appliedDate: "3 days ago",
  },
];

export default function EmployerDashboardPage() {
  const router = useRouter();

  return (
    <EmployerDashboardShell activeNavItem="dashboard" userRole="employer">
      <div className="space-y-8">
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-opacity-100`}
                    >
                      <Icon
                        className={`h-5 w-5 ${stat.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stat.changeType === "increase"
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {stat.change}%
                    </span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job listings */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <div>
                <CardTitle className="text-xl">Recent Job Listings</CardTitle>
                <CardDescription className="text-gray-500">
                  Monitor your active job postings
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="text-lime-700 border-lime-600 hover:bg-lime-50"
                onClick={() => (window.location.href = "/employer/jobs")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{job.datePosted}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          router.push(`/employer/jobs/${job.id}/edit`)
                        }
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  className="w-full mt-4 bg-black text-lime-300 hover:bg-gray-800"
                  onClick={() => (window.location.href = "/employer/jobs/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent applications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-xl">Recent Applications</CardTitle>
              <CardDescription className="text-gray-500">
                Latest candidate applications
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-4">
                {recentCandidates.map((candidate) => {
                  // Status component style
                  let statusEl;
                  switch (candidate.status) {
                    case "new":
                      statusEl = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      );
                      break;
                    case "reviewed":
                      statusEl = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Reviewed
                        </span>
                      );
                      break;
                    case "interview":
                      statusEl = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Interview
                        </span>
                      );
                      break;
                    default:
                      statusEl = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Rejected
                        </span>
                      );
                  }

                  return (
                    <div
                      key={candidate.id}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {candidate.role}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{candidate.appliedDate}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-right text-sm font-medium text-lime-700 mb-1">
                            {candidate.matchScore}% match
                          </div>
                          {statusEl}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  className="w-full mt-4 border-gray-300"
                  onClick={() =>
                    (window.location.href = "/employer/candidates")
                  }
                >
                  View All Candidates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity chart and upcoming interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-xl">Candidate Applications</CardTitle>
              <CardDescription className="text-gray-500">
                Application trends in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <div className="h-[240px] flex items-center justify-center bg-gray-50 rounded-lg">
                <BarChart className="h-10 w-10 text-gray-300" />
                <p className="ml-3 text-gray-500">
                  Activity chart visualization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming interviews */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-xl">Upcoming Interviews</CardTitle>
              <CardDescription className="text-gray-500">
                Your scheduled interviews this week
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">
                        Senior Frontend Developer
                      </p>
                    </div>
                    <div className="bg-lime-100 text-lime-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Today
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>2:00 PM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button size="sm" className="bg-lime-600 hover:bg-lime-700">
                      Join Call
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Michael Chen</h3>
                      <p className="text-sm text-gray-500">UX/UI Designer</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Tomorrow
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>10:30 AM - 11:30 AM</span>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button size="sm" className="bg-lime-600 hover:bg-lime-700">
                      Join Call
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="text-gray-500"
                    onClick={() =>
                      (window.location.href = "/employer/calendar")
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployerDashboardShell>
  );
}
