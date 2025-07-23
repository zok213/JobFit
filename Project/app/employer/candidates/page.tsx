"use client";

import React, { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Clock,
  Download,
  Star,
  FileText,
  Mail,
  Calendar,
  MessageSquare,
  Briefcase,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Sample candidate data
const CANDIDATES = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Senior Frontend Developer",
    experience: "7 years",
    education: "Bachelor's in Computer Science",
    status: "new",
    matchScore: 92,
    location: "San Francisco, CA",
    appliedDate: "2023-03-18",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    jobPreferences: {
      salary: "$120,000 - $150,000",
      remote: "Remote only",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "initial",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "UX/UI Designer",
    experience: "5 years",
    education: "Master's in Design",
    status: "reviewed",
    matchScore: 88,
    location: "New York, NY",
    appliedDate: "2023-03-17",
    skills: ["Figma", "Adobe XD", "UI Design", "User Research"],
    jobPreferences: {
      salary: "$90,000 - $120,000",
      remote: "Hybrid",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "phone",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    role: "Backend Engineer",
    experience: "8 years",
    education: "Master's in Computer Engineering",
    status: "interview",
    matchScore: 95,
    location: "Austin, TX",
    appliedDate: "2023-03-16",
    skills: ["Node.js", "MongoDB", "AWS", "Python", "Docker"],
    jobPreferences: {
      salary: "$130,000 - $160,000",
      remote: "Remote preferred",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "technical",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "Product Manager",
    experience: "6 years",
    education: "MBA",
    status: "rejected",
    matchScore: 78,
    location: "Chicago, IL",
    appliedDate: "2023-03-15",
    skills: ["Product Strategy", "Agile", "Roadmapping", "User Stories"],
    jobPreferences: {
      salary: "$110,000 - $140,000",
      remote: "On-site",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "rejected",
  },
  {
    id: 5,
    name: "Emily Taylor",
    email: "emily.taylor@example.com",
    role: "Marketing Specialist",
    experience: "4 years",
    education: "Bachelor's in Marketing",
    status: "offer",
    matchScore: 90,
    location: "Remote",
    appliedDate: "2023-03-14",
    skills: ["Content Strategy", "SEO", "Social Media", "Analytics"],
    jobPreferences: {
      salary: "$80,000 - $100,000",
      remote: "Remote only",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "offer",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@example.com",
    role: "DevOps Engineer",
    experience: "5 years",
    education: "Bachelor's in Computer Science",
    status: "interview",
    matchScore: 87,
    location: "Seattle, WA",
    appliedDate: "2023-03-13",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    jobPreferences: {
      salary: "$125,000 - $155,000",
      remote: "Hybrid",
      type: "Full-time",
    },
    resumeUrl: "#",
    coverLetterUrl: "#",
    interviewStage: "final",
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export default function EmployerCandidatesPage() {
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("matchScore");

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((candidate) => {
      // Filter by search query (name or skills)
      if (
        searchQuery &&
        !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }
      // Filter by status
      if (selectedStatus && candidate.status !== selectedStatus) {
        return false;
      }
      // Filter by job (this would be implemented with real data)
      if (selectedJob && candidate.role !== selectedJob) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "latest":
          return (
            new Date(b.appliedDate).getTime() -
            new Date(a.appliedDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.appliedDate).getTime() -
            new Date(b.appliedDate).getTime()
          );
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const handleStatusChange = (id: number, newStatus: string) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  // Get the status badge for a candidate
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            New
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Reviewed
          </Badge>
        );
      case "interview":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Interview
          </Badge>
        );
      case "offer":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Offer
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Get the interview stage badge
  const getInterviewStageBadge = (stage: string) => {
    switch (stage) {
      case "initial":
        return (
          <span className="inline-flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Waiting Review
          </span>
        );
      case "phone":
        return (
          <span className="inline-flex items-center text-xs text-blue-600">
            <MessageSquare className="h-3 w-3 mr-1" />
            Phone Interview
          </span>
        );
      case "technical":
        return (
          <span className="inline-flex items-center text-xs text-indigo-600">
            <Briefcase className="h-3 w-3 mr-1" />
            Technical Interview
          </span>
        );
      case "final":
        return (
          <span className="inline-flex items-center text-xs text-purple-600">
            <Calendar className="h-3 w-3 mr-1" />
            Final Interview
          </span>
        );
      case "offer":
        return (
          <span className="inline-flex items-center text-xs text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Offer Sent
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center text-xs text-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs text-gray-500">
            {stage}
          </span>
        );
    }
  };

  return (
    <EmployerDashboardShell activeNavItem="candidates" userRole="employer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Candidates</h1>
            <p className="text-gray-500 mt-1">
              Review and manage your job applicants
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button className="bg-lime-600 hover:bg-lime-700 text-white">
              AI Match
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates by name or skills..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm cursor-pointer w-full"
                    value={selectedStatus || ""}
                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                    aria-label="Filter by candidate status"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm cursor-pointer w-full"
                    value={selectedJob || ""}
                    onChange={(e) => setSelectedJob(e.target.value || null)}
                    aria-label="Filter by job"
                  >
                    <option value="">All Jobs</option>
                    <option value="Senior Frontend Developer">
                      Frontend Developer
                    </option>
                    <option value="UX/UI Designer">UX/UI Designer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Marketing Specialist">
                      Marketing Specialist
                    </option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm cursor-pointer w-full"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort candidates by"
                  >
                    <option value="matchScore">Match Score</option>
                    <option value="latest">Latest Applied</option>
                    <option value="oldest">Oldest Applied</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="grid gap-4">
          {filteredCandidates.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center py-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No candidates found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filters to find candidates.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus(null);
                    setSelectedJob(null);
                    setSortBy("matchScore");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCandidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Candidate info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-lg">
                              {candidate.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{candidate.role}</span>
                              <span className="mx-2">•</span>
                              <span>{candidate.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {getStatusBadge(candidate.status)}
                          <div className="mt-1 text-sm font-medium text-lime-700">
                            {candidate.matchScore}% match
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <a
                            href={`mailto:${candidate.email}`}
                            className="hover:text-lime-700"
                          >
                            {candidate.email}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{candidate.experience} experience</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            Applied {formatDate(candidate.appliedDate)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium mb-1">Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">Salary:</span>
                          <span className="font-medium text-gray-700">
                            {candidate.jobPreferences.salary}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">Type:</span>
                          <span className="font-medium text-gray-700">
                            {candidate.jobPreferences.type}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">Remote:</span>
                          <span className="font-medium text-gray-700">
                            {candidate.jobPreferences.remote}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions - right side */}
                    <div className="bg-gray-50 p-6 lg:w-64 border-t lg:border-t-0 lg:border-l border-gray-200">
                      <div className="mb-4">
                        {getInterviewStageBadge(candidate.interviewStage)}
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/employer/candidates/${candidate.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-300 text-gray-700"
                          asChild
                        >
                          <Link href={candidate.resumeUrl}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Resume
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-300 text-gray-700"
                          onClick={() =>
                            handleStatusChange(
                              candidate.id,
                              candidate.status === "new"
                                ? "reviewed"
                                : candidate.status === "reviewed"
                                ? "interview"
                                : candidate.status === "interview"
                                ? "offer"
                                : "new"
                            )
                          }
                        >
                          Move to{" "}
                          {candidate.status === "new"
                            ? "Reviewed"
                            : candidate.status === "reviewed"
                            ? "Interview"
                            : candidate.status === "interview"
                            ? "Offer"
                            : "New"}
                        </Button>
                        {candidate.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(candidate.id, "rejected")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </EmployerDashboardShell>
  );
}
