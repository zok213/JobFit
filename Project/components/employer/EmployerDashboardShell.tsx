"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { 
  User, 
  Home, 
  Briefcase, 
  Users,
  FileText, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  BarChart2,
  Building,
  PlusCircle,
  ClipboardList
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type NavItem = {
  id: string;
  label: string;
  icon?: React.ElementType;
  route?: string;
  active: boolean;
};

interface EmployerDashboardShellProps {
  children: ReactNode;
  activeNavItem?: string;
  userRole?: "employer" | "employee";
  accountType?: "pro" | "free";
}

export const EmployerDashboardShell = ({ 
  children, 
  activeNavItem = "dashboard",
  userRole = "employer",
  accountType = "pro"
}: EmployerDashboardShellProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Navigation items for employer
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/employer/dashboard", active: activeNavItem === "dashboard" },
    { id: "jobs", label: "Manage Jobs", icon: Briefcase, route: "/employer/jobs", active: activeNavItem === "jobs" },
    { id: "candidates", label: "Candidates", icon: Users, route: "/employer/candidates", active: activeNavItem === "candidates" },
    { id: "analytics", label: "Analytics", icon: BarChart2, route: "/employer/analytics", active: activeNavItem === "analytics" },
    { id: "company", label: "Company Profile", icon: Building, route: "/employer/company", active: activeNavItem === "company" },
    { id: "settings", label: "Settings", icon: Settings, route: "/employer/settings", active: activeNavItem === "settings" },
  ];

  // Handle scroll for sticky header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Prefetch all routes for instant navigation
  useEffect(() => {
    // Prefetch all navigation routes to improve loading speed
    navItems.forEach(item => {
      if (item.route && item.route !== window.location.pathname) {
        router.prefetch(item.route);
      }
    });
  }, [router, navItems]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (item: NavItem) => {
    if (item.route) {
      // Don't navigate if we're already on this route
      if (window.location.pathname === item.route) {
        setMobileMenuOpen(false);
        return;
      }
      
      // Set navigation state
      setIsNavigating(true);
      setNavigatingTo(item.id);
      
      // Navigate after a small delay to allow for visual feedback
      setTimeout(() => {
        router.push(item.route!);
        
        // Reset after navigation starts
        setTimeout(() => {
          setIsNavigating(false);
          setNavigatingTo(null);
        }, 300);
      }, 50);
    }
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Mobile menu background overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Navigation */}
      <aside 
        className={`w-[260px] bg-gray-900 min-h-screen fixed left-0 top-0 h-full z-50 shadow-xl transition-all duration-300 transform md:translate-x-0 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-[80px] flex items-center px-7 border-b border-gray-800/80">
          <button 
            onClick={() => router.push("/")} 
            className="transition-transform hover:scale-105 focus:outline-none w-full"
            aria-label="Go to home page"
          >
            <div className="flex items-center">
              <Image 
                src="/img/LOGO.png" 
                alt="JobFit.AI Logo" 
                width={100} 
                height={40} 
                className="object-contain max-w-[100px]"
              />
              <div className="flex items-center">
                <span className="mt-6 text-sm text-white font-medium">
                  {userRole === "employee" ? "Employee" : "Employer"}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-8">
          <div className="px-5 mb-8">
            <p className="text-xs uppercase text-gray-500 font-medium mb-3 ml-2">MAIN</p>
            <ul className="space-y-2">
              {navItems.slice(0, 2).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-white font-medium bg-lime-700 shadow-md shadow-lime-900/20"
                        : isNavigating && navigatingTo === item.id
                          ? "text-white bg-gray-700/70"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/80"
                    }`}
                    disabled={isNavigating}
                  >
                    {isNavigating && navigatingTo === item.id ? (
                      <span className="w-5 h-5 mr-4 flex items-center justify-center">
                        <span className="animate-spin h-3 w-3 border-2 border-lime-300 rounded-full border-r-transparent"></span>
                      </span>
                    ) : (
                      item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-lime-300" : "text-gray-400"}`} />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-5 mb-8">
            <p className="text-xs uppercase text-gray-500 font-medium mb-3 ml-2">RECRUITING</p>
            <ul className="space-y-2">
              {navItems.slice(2, 4).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-white font-medium bg-lime-700 shadow-md shadow-lime-900/20"
                        : isNavigating && navigatingTo === item.id
                          ? "text-white bg-gray-700/70"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/80"
                    }`}
                    disabled={isNavigating}
                  >
                    {isNavigating && navigatingTo === item.id ? (
                      <span className="w-5 h-5 mr-4 flex items-center justify-center">
                        <span className="animate-spin h-3 w-3 border-2 border-lime-300 rounded-full border-r-transparent"></span>
                      </span>
                    ) : (
                      item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-lime-300" : "text-gray-400"}`} />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-5">
            <p className="text-xs uppercase text-gray-500 font-medium mb-3 ml-2">ACCOUNT</p>
            <ul className="space-y-2">
              {navItems.slice(4).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-white font-medium bg-lime-700 shadow-md shadow-lime-900/20"
                        : isNavigating && navigatingTo === item.id
                          ? "text-white bg-gray-700/70"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/80"
                    }`}
                    disabled={isNavigating}
                  >
                    {isNavigating && navigatingTo === item.id ? (
                      <span className="w-5 h-5 mr-4 flex items-center justify-center">
                        <span className="animate-spin h-3 w-3 border-2 border-lime-300 rounded-full border-r-transparent"></span>
                      </span>
                    ) : (
                      item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-lime-300" : "text-gray-400"}`} />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Pro upgrade banner */}
        <div className="px-5 mt-6 mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white border border-gray-700 shadow-xl">
            <h3 className="font-bold text-lg mb-1">Upgrade to Pro</h3>
            <p className="text-gray-300 text-sm mb-4">Get access to advanced AI tools and unlimited job postings</p>
            <Button 
              className="w-full bg-lime-600 text-white hover:bg-lime-700 transition-all font-medium shadow-md" 
              onClick={() => router.push("/pricing")}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[260px]">
        {/* Header */}
        <header className={`bg-white px-4 md:px-8 py-4 sticky top-0 z-20 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button 
              className="w-10 h-10 rounded-lg flex md:hidden items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {navItems.find(item => item.active)?.label || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Quick Actions */}
            <Button
              variant="outline"
              className="hidden md:flex items-center border-lime-600 text-lime-700 hover:bg-lime-50 shadow-sm"
              onClick={() => router.push("/employer/jobs/new")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 py-2 w-[240px] bg-gray-50 border-gray-200 rounded-lg focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
              />
            </div>
            
            {/* Notifications */}
            <button 
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            
            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium shadow-sm">
                <span>
                  {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'E'}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{user?.username || "employeruser"}</p>
                  {accountType === "pro" ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-lime-600 to-lime-500 text-white rounded shadow-sm">PRO</span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-500 text-white rounded shadow-sm">FREE</span>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-lime-700"
                >
                  Sign out
                </button>
              </div>
              {/* Mobile only account type badge */}
              <div className="md:hidden">
                {accountType === "pro" ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-lime-600 to-lime-500 text-white rounded shadow-sm">PRO</span>
                ) : (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-500 text-white rounded shadow-sm">FREE</span>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}; 