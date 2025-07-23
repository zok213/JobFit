"use client";

import React, { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  ChevronDown, 
  Download,
  Calendar,
  Filter,
  ArrowRight,
  FileText
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

type TimeFrameType = "7days" | "30days" | "90days" | "year";

// Mock data for visualizing charts
const chartData = {
  applications: {
    "7days": [
      { day: "Mon", value: 12 },
      { day: "Tue", value: 15 },
      { day: "Wed", value: 10 },
      { day: "Thu", value: 14 },
      { day: "Fri", value: 18 },
      { day: "Sat", value: 8 },
      { day: "Sun", value: 16 }
    ],
    "30days": Array.from({ length: 30 }, (_, i) => ({ 
      day: `Day ${i + 1}`, 
      value: 15 + (i % 10) // Fixed pattern instead of random
    })),
    "90days": Array.from({ length: 90 }, (_, i) => ({ 
      day: `Day ${i + 1}`, 
      value: 20 + (i % 15) // Fixed pattern instead of random
    })),
    "year": [
      { month: "Jan", value: 65 },
      { month: "Feb", value: 59 },
      { month: "Mar", value: 80 },
      { month: "Apr", value: 81 },
      { month: "May", value: 56 },
      { month: "Jun", value: 55 },
      { month: "Jul", value: 40 },
      { month: "Aug", value: 70 },
      { month: "Sep", value: 90 },
      { month: "Oct", value: 75 },
      { month: "Nov", value: 60 },
      { month: "Dec", value: 85 }
    ]
  },
  hires: {
    "7days": [1, 0, 2, 1, 0, 1, 2],
    "30days": [1, 0, 2, 1, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 0],
    "90days": Array.from({ length: 90 }, (_, i) => (i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0)),
    "year": [5, 8, 12, 15, 10, 12, 18, 22, 16, 14, 10, 8]
  },
  jobViews: {
    "7days": [120, 145, 130, 160, 180, 120, 140],
    "30days": Array.from({ length: 30 }, (_, i) => 100 + (i * 5) % 100),
    "90days": Array.from({ length: 90 }, (_, i) => 80 + (i * 3) % 150),
    "year": [520, 580, 620, 750, 800, 950, 1020, 980, 880, 790, 650, 700]
  },
  conversion: {
    "7days": [8.2, 9.1, 7.5, 8.7, 9.6, 6.4, 10.2],
    "30days": Array.from({ length: 30 }, (_, i) => (5 + (i % 5)).toFixed(1)),
    "90days": Array.from({ length: 90 }, (_, i) => (5 + (i % 6)).toFixed(1)),
    "year": ["7.5", "8.2", "7.0", "9.1", "8.4", "7.8", "9.5", "8.9", "8.0", "7.9", "8.3", "8.6"]
  }
};

const topPerformingJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    applicants: 42,
    views: 520,
    conversionRate: "8.1%",
    qualifiedCandidates: 28,
    trend: "up"
  },
  {
    id: 2,
    title: "Backend Engineer",
    applicants: 38,
    views: 410,
    conversionRate: "9.3%",
    qualifiedCandidates: 22,
    trend: "up"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    applicants: 30,
    views: 380,
    conversionRate: "7.9%",
    qualifiedCandidates: 18,
    trend: "down"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    applicants: 25,
    views: 340,
    conversionRate: "7.4%",
    qualifiedCandidates: 15,
    trend: "up"
  }
];

const candidateSourceData = [
  { source: "Job Boards", percentage: 45, count: 152, value: 45 },
  { source: "Referrals", percentage: 22, count: 74, value: 22 },
  { source: "Company Website", percentage: 18, count: 61, value: 18 },
  { source: "Social Media", percentage: 10, count: 34, value: 10 },
  { source: "Other", percentage: 5, count: 17, value: 5 }
];

// Colors for charts
const CHART_COLORS = {
  primary: '#84cc16',
  secondary: '#6366f1',
  tertiary: '#f59e0b',
  quaternary: '#ec4899',
  gray: '#9ca3af',
  chartPalette: ['#84cc16', '#6366f1', '#f59e0b', '#ec4899', '#64748b']
};

export default function EmployerAnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrameType>("30days");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "7days":
        return "Last 7 days";
      case "30days":
        return "Last 30 days";
      case "90days":
        return "Last 90 days";
      case "year":
        return "Last 12 months";
      default:
        return "Last 30 days";
    }
  };

  // Get appropriate chart data based on time frame
  const getChartData = () => {
    if (timeFrame === "year") {
      return chartData.applications.year;
    } else if (timeFrame === "7days") {
      return chartData.applications["7days"];
    } else {
      // For 30days and 90days, return a subset for better visualization
      return timeFrame === "30days" 
        ? chartData.applications["30days"].slice(0, 30) 
        : chartData.applications["90days"].slice(0, 30);
    }
  };

  // Calculate totals for metrics
  const totalApplications = timeFrame === "year" 
    ? chartData.applications.year.reduce((sum, item) => sum + item.value, 0)
    : chartData.applications[timeFrame].reduce((sum, item) => sum + item.value, 0);

  return (
    <EmployerDashboardShell activeNavItem="analytics" userRole="employer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-gray-500 mt-1">
              Review your recruitment metrics and performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm cursor-pointer"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value as TimeFrameType)}
                aria-label="Select time frame"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="year">Last 12 months</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
          </div>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg grid grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Jobs</TabsTrigger>
            <TabsTrigger value="candidates" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Candidates</TabsTrigger>
            <TabsTrigger value="sourcing" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Sourcing</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Applications
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900">
                        {totalApplications}
                      </h3>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100/40">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">18.2%</span>
                    <span className="text-gray-500 ml-1">vs. previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Job Views
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900">
                        4,348
                      </h3>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100/40">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">12.5%</span>
                    <span className="text-gray-500 ml-1">vs. previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Conversion Rate
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900">
                        11.2%
                      </h3>
                    </div>
                    <div className="p-3 rounded-lg bg-lime-100/40">
                      <LineChartIcon className="h-6 w-6 text-lime-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-red-600 font-medium">3.1%</span>
                    <span className="text-gray-500 ml-1">vs. previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Hires
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900">
                        30
                      </h3>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100/40">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">8.4%</span>
                    <span className="text-gray-500 ml-1">vs. previous period</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Trend Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>
                  Number of applications over {getTimeFrameLabel()}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey={timeFrame === "year" ? "month" : "day"} 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        axisLine={{ stroke: '#f0f0f0' }}
                        stroke="#9ca3af"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false}
                        stroke="#9ca3af"
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={CHART_COLORS.primary} 
                        fillOpacity={1} 
                        fill="url(#colorApplications)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Two-column charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="px-6 pb-0">
                  <CardTitle>Top Performing Jobs</CardTitle>
                  <CardDescription>
                    Jobs with highest application rates
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-4">
                  <div className="space-y-4">
                    {topPerformingJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>{job.applicants} applicants</span>
                            <span className="mx-2">•</span>
                            <span>{job.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-medium">{job.conversionRate}</span>
                            <span className="text-xs text-gray-500">conversion</span>
                          </div>
                          {job.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6">
                  <Button variant="link" className="text-lime-700 hover:text-lime-800 p-0 ml-auto">
                    View all jobs
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="px-6 pb-0">
                  <CardTitle>Candidate Sources</CardTitle>
                  <CardDescription>
                    Where your candidates are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-4">
                  <div className="flex items-start gap-8">
                    <div className="flex-1 space-y-4">
                      {candidateSourceData.map((source, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{source.source}</span>
                            <span className="font-medium">{source.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                index === 0
                                  ? "bg-lime-500"
                                  : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                  ? "bg-purple-500"
                                  : index === 3
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }`}
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{source.count} candidates</p>
                        </div>
                      ))}
                    </div>
                    <div className="hidden md:flex items-center justify-center w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={candidateSourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {candidateSourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS.chartPalette[index % CHART_COLORS.chartPalette.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [`${value}%`, props.payload.source]}
                            contentStyle={{ 
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab Content */}
          <TabsContent value="jobs" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Job Performance Analysis</CardTitle>
                <CardDescription>
                  Detailed metrics for all your job postings
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topPerformingJobs}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="title" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        axisLine={{ stroke: '#f0f0f0' }}
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickLine={false} 
                        axisLine={false}
                        stroke="#9ca3af"
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="applicants" name="Applicants" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="qualifiedCandidates" name="Qualified" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <Button
                    className="bg-lime-600 hover:bg-lime-700 text-white float-right"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder for other tabs */}
          <TabsContent value="candidates" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Candidate Analytics</h3>
                  <p className="text-gray-500 max-w-md">
                    Analyze candidate demographics, qualifications, and hiring funnel metrics to optimize your recruitment process.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sourcing" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Candidate Sourcing Analysis</h3>
                  <p className="text-gray-500 max-w-md">
                    Evaluate the effectiveness of different recruiting channels to optimize your sourcing strategy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployerDashboardShell>
  );
} 