"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Home, 
  Briefcase, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  ChevronRight,
  ArrowUpRight,
  Plus,
  BarChart2,
  PieChart,
  LineChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { DashboardShell } from "./DashboardShell";
import { LinkButton } from "./LinkButton";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [imageErrors, setImageErrors] = useState({
    weeklyActivity: false,
    interests: false,
    profileViews: false
  });

  // Handle scroll for sticky header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sidebar navigation items
  const sidebarItems = [
    { icon: Home, label: "Dashboard", id: "dashboard", active: activeTab === "dashboard" },
    { icon: User, label: "Profile", id: "profile", active: activeTab === "profile" },
    { 
      label: "Job Match", 
      id: "jobmatch", 
      active: activeTab === "jobmatch",
      imgSrc: "/img/briefcase-icon.png"
    },
    { 
      label: "CV Assistant", 
      id: "cvassistant", 
      active: activeTab === "cvassistant",
      imgSrc: "/img/edit-icon.png"
    },
    { 
      label: "Interviewer", 
      id: "interviewer", 
      active: activeTab === "interviewer",
      imgSrc: "/img/ai-interviewer-icon.png"
    },
    { 
      label: "Career Roadmap", 
      id: "roadmap", 
      active: activeTab === "roadmap",
      imgSrc: "/img/chart-icon.png"
    },
    { label: "Settings", id: "settings", icon: Settings, active: activeTab === "settings" },
    { label: "Help", id: "help", icon: Bell, active: activeTab === "help" },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading or redirect if no user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-t-4 border-lime-300 animate-spin"></div>
          </div>
          <p className="mt-4 text-black font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  // Handle sidebar navigation
  const handleNavigation = (id: string) => {
    setActiveTab(id);
    if (id === "profile") {
      router.push("/profile");
    }
    else if (id === "jobmatch") {
      router.push("/job-match");
    }
    else if (id === "cvassistant") {
      router.push("/cv-assistant");
    }
    else if (id === "interviewer") {
      router.push("/interviewer");
    }
    else if (id === "roadmap") {
      router.push("/roadmap");
    }
    else if (id === "settings") {
      router.push("/settings");
    }
    else if (id === "help") {
      router.push("/help");
    }
    else if (id === "dashboard") {
      router.push("/dashboard");
    }
  };

  // Add this function to handle image load errors
  const handleImageError = (chart: keyof typeof imageErrors) => {
    setImageErrors(prev => ({ ...prev, [chart]: true }));
  };

  // Render dashboard content
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "profile":
        return null; // Will redirect to profile page
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[600px]">
            <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="h-10 w-10 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
            <p className="text-gray-500 max-w-md text-center">
              We're working on the {activeTab.replace(/([A-Z])/g, ' $1').trim()} feature. 
              It will be available in the next update.
            </p>
          </div>
        );
    }
  };

  // Render dashboard main content
  const renderDashboardContent = () => {
    return (
      <>
        {/* Welcome Banner */}
        <div className="bg-lime-300 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-black">Good morning, {user?.username || 'testuser'}!</h2>
              <p className="text-black/80 mt-1">Here's what's happening with your profile today.</p>
            </div>
            <LinkButton 
              href="/profile"
              className="bg-black text-lime-300 hover:bg-gray-800 transition-all shadow-sm"
              aria-label="Update your profile information"
            >
              Update Profile
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* CV Points Card */}
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
            <CardHeader className="bg-lime-50 pb-2 pt-5 px-6">
              <CardTitle className="text-lg text-black flex items-center justify-between">
                <span>CV Points</span>
                <Link href="#" className="text-black hover:text-lime-700">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 pt-4">
                <div className="relative flex flex-col items-center">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Background circle */}
                    <div className="absolute inset-0 rounded-full border-[12px] border-lime-100 opacity-20"></div>
                    
                    {/* Progress circle */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <circle
                        cx="80"
                        cy="80"
                        r="64"
                        fill="none"
                        stroke="#c1fa7e"
                        strokeWidth="18"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * (1 - 85/100)}
                        filter="url(#glow)"
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    {/* Score text */}
                    <div className="z-10 text-center">
                      <span className="block text-5xl font-bold text-black">85</span>
                      <span className="text-sm text-gray-500">out of 100</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between w-full mt-8 text-center">
                    <div className="flex-1">
                      <span className="block text-xl font-semibold text-black">75%</span>
                      <span className="text-xs text-gray-500">Completion</span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-xl font-semibold text-black">24</span>
                      <span className="text-xs text-gray-500">Tasks Done</span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-xl font-semibold text-black">8</span>
                      <span className="text-xs text-gray-500">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Views Card */}
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
            <CardHeader className="bg-lime-50 pb-2 pt-5 px-6">
              <CardTitle className="text-lg text-black flex items-center justify-between">
                <span>Profile Views</span>
                <Link href="#" className="text-black hover:text-lime-700">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-black">237</p>
                    <p className="text-sm text-gray-500">Total views this month</p>
                  </div>
                  <div className="bg-lime-100 px-3 py-1 rounded-full flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">+24%</span>
                  </div>
                </div>
                <div className="h-[180px] flex items-center justify-center">
                  {imageErrors.profileViews ? (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <LineChart className="h-12 w-12 mb-2 text-gray-300" />
                      <p>Profile views data unavailable</p>
                      <LinkButton
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => setImageErrors(prev => ({ ...prev, profileViews: false }))}
                      >
                        Retry
                      </LinkButton>
                  </div>
                  ) : (
                    <div 
                      className="w-full h-full bg-contain bg-center bg-no-repeat rounded-lg" 
                      style={{ backgroundImage: `url('/img/profile-views-chart.png')` }}
                      onError={() => handleImageError('profileViews')}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Progress Card */}
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
            <CardHeader className="bg-lime-50 pb-2 pt-5 px-6">
              <CardTitle className="text-lg text-black flex items-center justify-between">
                <span>Career Progress</span>
                <LinkButton 
                  href="/roadmap"
                  variant="ghost"
                  className="p-0 m-0 h-auto text-black hover:text-lime-700"
                  aria-label="View career progress details"
                >
                  <ChevronRight className="h-5 w-5" />
                </LinkButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-base text-gray-600 font-medium">Career Skills</p>
                  <p className="text-sm text-black font-medium">4 of 6 complete</p>
                </div>
                
                {/* Skill bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Technical</span>
                      <span className="text-black font-medium">85%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-300 rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Soft Skills</span>
                      <span className="text-black font-medium">70%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-300 rounded-full transition-all duration-500" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Leadership</span>
                      <span className="text-black font-medium">60%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-300 rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Experience</span>
                      <span className="text-black font-medium">75%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-lime-300 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Activity Card */}
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white md:col-span-2">
            <CardHeader className="bg-lime-50 pb-2 pt-5 px-6">
              <CardTitle className="text-lg text-black flex items-center justify-between">
                <span>Weekly Activity</span>
                <div className="flex space-x-2 text-sm">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-8 ${activeTimeframe === 'weekly' ? 'bg-lime-300 text-black' : 'text-gray-500'} border-none hover:bg-lime-100`}
                    onClick={() => setActiveTimeframe('weekly')}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-8 ${activeTimeframe === 'monthly' ? 'bg-lime-300 text-black' : 'text-gray-500'} border-none hover:bg-lime-100`}
                    onClick={() => setActiveTimeframe('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-8 ${activeTimeframe === 'yearly' ? 'bg-lime-300 text-black' : 'text-gray-500'} border-none hover:bg-lime-100`}
                    onClick={() => setActiveTimeframe('yearly')}
                  >
                    Yearly
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 pt-4">
                <div className="h-[380px] flex items-center justify-center">
                  <div className="bg-gray-50 w-full h-full rounded-lg flex items-center justify-center">
                    {imageErrors.weeklyActivity ? (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BarChart2 className="h-12 w-12 mb-2 text-gray-300" />
                        <p>Chart data unavailable</p>
                        <LinkButton
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={() => setImageErrors(prev => ({ ...prev, weeklyActivity: false }))}
                        >
                          Retry
                        </LinkButton>
                      </div>
                    ) : (
                      <div 
                        className="w-full h-full bg-contain bg-center bg-no-repeat relative" 
                        style={{ 
                          backgroundImage: `url('/img/weekly-activity-chart.png')`
                        }}
                        onError={() => handleImageError('weeklyActivity')}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gray-50/50 rounded-lg">
                          <span className="text-gray-500">Click to view detailed analytics</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
            <CardHeader className="bg-lime-50 pb-2 pt-5 px-6">
              <CardTitle className="text-lg text-black flex items-center justify-between">
                <span>Interests</span>
                <Link href="#" className="text-black hover:text-lime-700">
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 pt-4">
                <div className="h-[380px] flex items-center justify-center">
                  {imageErrors.interests ? (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <PieChart className="h-12 w-12 mb-2 text-gray-300" />
                      <p>Interest data unavailable</p>
                      <LinkButton
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => setImageErrors(prev => ({ ...prev, interests: false }))}
                      >
                        Retry
                      </LinkButton>
                  </div>
                  ) : (
                    <div 
                      className="w-full h-full bg-contain bg-center bg-no-repeat" 
                      style={{ backgroundImage: `url('/img/interests-chart.png')` }}
                      onError={() => handleImageError('interests')}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Job recommendations section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Job Recommendations</h2>
            <Button variant="outline" className="text-black border-lime-300 hover:bg-lime-100">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((job) => (
              <Card 
                key={job} 
                className="overflow-hidden border border-gray-100 hover:border-lime-300 hover:shadow-md transition-all duration-300 cursor-pointer group h-full"
              >
                <CardContent className="p-5 h-full flex flex-col">
                  <div className="flex items-start gap-4 h-full">
                    <div className="w-12 h-12 rounded-md bg-lime-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-black" />
                    </div>
                    <div className="flex-1 flex flex-col h-full">
                      <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">Senior Frontend Developer</h3>
                      <p className="text-sm text-gray-500 mt-1">TechCorp • Remote</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">React</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">TypeScript</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Next.js</span>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-3">
                        <span className="text-sm font-medium text-gray-900">$80k - $120k</span>
                        <span className="text-sm px-2 py-1 bg-lime-100 text-lime-800 rounded-full">98% match</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career progress stats */}
        <LinkButton 
          href="/roadmap"
          variant="outline" 
          className="text-black border-lime-300 hover:bg-lime-100 mt-4"
          aria-label="View your career plan details"
        >
          View Career Plan
        </LinkButton>
      </>
    );
  };

  return (
      <div className="p-6">
        {renderContent()}
      </div>
  );
};

export default Dashboard; 