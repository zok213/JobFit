"use client";

import { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Calendar,
  MoreHorizontal,
  Edit,
  Copy,
  Eye,
  Pause,
  Trash,
  ArrowUpDown,
  CalendarClock,
  Check,
  CheckCircle,
  CheckSquare,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for job listings
const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "New York, NY",
    isRemote: false,
    postedDate: "2023-03-01",
    expiryDate: "2023-04-01",
    status: "active",
    type: "full-time",
    applicants: 45,
    newApplicants: 5,
    views: 230,
  },
  {
    id: "job-2",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    isRemote: false,
    postedDate: "2023-03-05",
    expiryDate: "2023-04-05",
    status: "active",
    type: "full-time",
    applicants: 28,
    newApplicants: 3,
    views: 178,
  },
  {
    id: "job-3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "",
    isRemote: true,
    postedDate: "2023-02-20",
    expiryDate: "2023-03-20",
    status: "expired",
    type: "contract",
    applicants: 32,
    newApplicants: 0,
    views: 156,
  },
  {
    id: "job-4",
    title: "UX Designer",
    department: "Design",
    location: "Austin, TX",
    isRemote: false,
    postedDate: "2023-02-28",
    expiryDate: "2023-03-28",
    status: "paused",
    type: "full-time",
    applicants: 19,
    newApplicants: 0,
    views: 105,
  },
  {
    id: "job-5",
    title: "Marketing Specialist",
    department: "Marketing",
    location: "",
    isRemote: true,
    postedDate: "2023-03-10",
    expiryDate: "2023-04-10",
    status: "active",
    type: "part-time",
    applicants: 12,
    newApplicants: 12,
    views: 89,
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Helper function to calculate days remaining
const getDaysRemaining = (dateString: string) => {
  const today = new Date();
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function EmployerJobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Function to create a new job
  const handleCreateJob = () => {
    router.push("/employer/jobs/new");
  };

  // Function to create a job description with AI
  const handleCreateJD = () => {
    router.push("/employer/jobs/create-jd");
  };

  // Function to filter jobs
  const filteredJobs = MOCK_JOBS.filter((job) => {
    // Search filter
    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.department.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filterStatus !== "all" && job.status !== filterStatus) {
      return false;
    }

    // Type filter
    if (filterType !== "all" && job.type !== filterType) {
      return false;
    }

    // Tab filter
    if (activeTab === "active" && job.status !== "active") {
      return false;
    } else if (activeTab === "paused" && job.status !== "paused") {
      return false;
    } else if (activeTab === "expired" && job.status !== "expired") {
      return false;
    } else if (activeTab === "remote" && !job.isRemote) {
      return false;
    }

    return true;
  });

  // Function to sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      );
    } else if (sortBy === "applicants-high") {
      return b.applicants - a.applicants;
    } else if (sortBy === "applicants-low") {
      return a.applicants - b.applicants;
    } else if (sortBy === "views-high") {
      return b.views - a.views;
    } else if (sortBy === "views-low") {
      return a.views - b.views;
    } else if (sortBy === "title-az") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "title-za") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <EmployerDashboardShell activeNavItem="jobs" userRole="employer">
      <div className="space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Manage Jobs
            </h1>
            <p className="text-gray-500 mt-1">
              Create, edit, and manage your job listings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCreateJD}
              className="flex items-center gap-1 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Tạo JD bằng AI
            </Button>
            <Button
              onClick={handleCreateJob}
              className="bg-lime-600 text-white hover:bg-lime-700 shadow-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title or department..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="truncate">
                        {filterStatus === "all"
                          ? "All Statuses"
                          : filterStatus === "active"
                          ? "Active Jobs"
                          : filterStatus === "paused"
                          ? "Paused Jobs"
                          : "Expired Jobs"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active Jobs</SelectItem>
                    <SelectItem value="paused">Paused Jobs</SelectItem>
                    <SelectItem value="expired">Expired Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="truncate">
                        {filterType === "all"
                          ? "All Types"
                          : filterType === "full-time"
                          ? "Full-time"
                          : filterType === "part-time"
                          ? "Part-time"
                          : filterType === "contract"
                          ? "Contract"
                          : filterType === "temporary"
                          ? "Temporary"
                          : "Internship"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="truncate">Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="applicants-high">
                      Most Applicants
                    </SelectItem>
                    <SelectItem value="applicants-low">
                      Least Applicants
                    </SelectItem>
                    <SelectItem value="views-high">Most Views</SelectItem>
                    <SelectItem value="views-low">Least Views</SelectItem>
                    <SelectItem value="title-az">Title (A-Z)</SelectItem>
                    <SelectItem value="title-za">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full flex justify-start overflow-x-auto bg-gray-100 p-0.5">
                <TabsTrigger
                  value="all"
                  className="flex-1 max-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
                >
                  All Jobs ({MOCK_JOBS.length})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="flex-1 max-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
                >
                  Active (
                  {MOCK_JOBS.filter((job) => job.status === "active").length})
                </TabsTrigger>
                <TabsTrigger
                  value="paused"
                  className="flex-1 max-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
                >
                  Paused (
                  {MOCK_JOBS.filter((job) => job.status === "paused").length})
                </TabsTrigger>
                <TabsTrigger
                  value="expired"
                  className="flex-1 max-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
                >
                  Expired (
                  {MOCK_JOBS.filter((job) => job.status === "expired").length})
                </TabsTrigger>
                <TabsTrigger
                  value="remote"
                  className="flex-1 max-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
                >
                  Remote ({MOCK_JOBS.filter((job) => job.isRemote).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Job listings */}
        <div className="space-y-4">
          {sortedJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterStatus !== "all" || filterType !== "all"
                  ? "Try changing your filters or search term"
                  : "You haven't posted any jobs yet"}
              </p>
              <Button
                onClick={handleCreateJob}
                variant="outline"
                className="border-lime-600 text-lime-700 hover:bg-lime-50"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Your First Job
              </Button>
            </div>
          ) : (
            sortedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Job info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge
                        className={
                          job.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : job.status === "paused"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {job.status === "active"
                          ? "Active"
                          : job.status === "paused"
                          ? "Paused"
                          : "Expired"}
                      </Badge>
                      {job.newApplicants > 0 && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {job.newApplicants} New
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <div>{job.department}</div>
                      <div className="flex items-center">
                        {job.isRemote ? (
                          <>
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            Remote
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {job.location}
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {job.type === "full-time"
                          ? "Full-time"
                          : job.type === "part-time"
                          ? "Part-time"
                          : job.type === "contract"
                          ? "Contract"
                          : job.type === "temporary"
                          ? "Temporary"
                          : "Internship"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Posted {formatDate(job.postedDate)}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-gray-900">
                        {job.applicants}
                      </div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-semibold text-gray-900">
                        {job.views}
                      </div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-2xl font-semibold ${
                          getDaysRemaining(job.expiryDate) > 7
                            ? "text-green-600"
                            : getDaysRemaining(job.expiryDate) > 0
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {getDaysRemaining(job.expiryDate) > 0
                          ? `${getDaysRemaining(job.expiryDate)}d`
                          : "0d"}
                      </div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 border-gray-300"
                      onClick={() =>
                        router.push(`/employer/jobs/${job.id}/applicants`)
                      }
                    >
                      <Users className="h-4 w-4 mr-1" />
                      View Applicants
                    </Button>

                    <div className="relative group">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() =>
                              router.push(`/employer/jobs/${job.id}/edit`)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2 text-gray-500" />
                            Edit Job
                          </button>

                          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Copy className="h-4 w-4 mr-2 text-gray-500" />
                            Duplicate
                          </button>

                          <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                            Preview
                          </button>

                          {job.status === "active" ? (
                            <button className="flex w-full items-center px-4 py-2 text-sm text-amber-700 hover:bg-amber-50">
                              <Pause className="h-4 w-4 mr-2 text-amber-600" />
                              Pause Job
                            </button>
                          ) : job.status === "paused" ? (
                            <button className="flex w-full items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Activate Job
                            </button>
                          ) : null}

                          <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash className="h-4 w-4 mr-2 text-red-500" />
                            Delete Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </EmployerDashboardShell>
  );
}
