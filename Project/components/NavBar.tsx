"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  User,
  Bell,
  ChevronDown,
  Sparkles,
  Gift,
  ListChecks,
  Users,
  Search,
  FileText,
  MessageSquare,
  TrendingUp,
  LayoutDashboard,
  UserIcon,
  Settings,
  LogOut,
  DollarSign,
  Info,
  BookOpen,
  Building,
  Badge,
  Briefcase,
  CreditCard,
  GanttChart,
  Cpu,
  Map,
  Calendar,
} from "lucide-react";
import { AvatarWithFallback } from "./ui/avatar-with-fallback";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Disclosure } from "@headlessui/react";
import { AuthModal } from "./ui/auth-modal";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Create refs for the elements with ARIA attributes
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New job match found",
      description: "We found a new job that matches your profile",
      time: "5 minutes ago",
      read: false,
      type: "match",
    },
    {
      id: 2,
      title: "Interview preparation reminder",
      description: "Don't forget your scheduled interview preparation session",
      time: "2 hours ago",
      read: false,
      type: "reminder",
    },
    {
      id: 3,
      title: "Profile update suggestion",
      description: "Update your skills to improve job matches",
      time: "Yesterday",
      read: true,
      type: "update",
    },
  ];

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update ARIA attributes when state changes
  useEffect(() => {
    if (userMenuButtonRef.current) {
      userMenuButtonRef.current.setAttribute(
        "aria-expanded",
        isDropdownOpen ? "true" : "false"
      );
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (mobileMenuButtonRef.current) {
      mobileMenuButtonRef.current.setAttribute(
        "aria-expanded",
        isMobileMenuOpen ? "true" : "false"
      );
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const renderAuthButtons = () => (
    <div className="hidden md:flex items-center gap-2">
      <Link href="/employer">
        <Button
          variant="outline"
          className="border-lime-300 text-black hover:bg-lime-50 hover:border-lime-400 transition-all font-medium"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          For Employers
        </Button>
      </Link>

      {user ? (
        <div className="flex items-center gap-2">
          {/* Notifications button */}
          <div className="relative">
            <button
              className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-black transition-all duration-200"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (isDropdownOpen) setIsDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <div className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </div>
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
                  ref={(ref) => {
                    // Click outside handler
                    if (ref) {
                      const handleClickOutside = (e: MouseEvent) => {
                        if (ref && !ref.contains(e.target as Node)) {
                          setIsNotificationsOpen(false);
                        }
                      };
                      document.addEventListener(
                        "mousedown",
                        handleClickOutside
                      );
                      return () => {
                        document.removeEventListener(
                          "mousedown",
                          handleClickOutside
                        );
                      };
                    }
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">
                      Notifications
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                    >
                      Mark all as read
                    </Button>
                  </div>

                  <div className="py-1 max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Bell className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-lime-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                                    ${
                                      notification.type === "match"
                                        ? "bg-lime-100"
                                        : notification.type === "reminder"
                                        ? "bg-blue-100"
                                        : "bg-gray-100"
                                    }`}
                            >
                              {notification.type === "match" ? (
                                <Briefcase className="h-4 w-4 text-lime-600" />
                              ) : notification.type === "reminder" ? (
                                <Calendar className="h-4 w-4 text-blue-600" />
                              ) : (
                                <User className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm ${
                                  !notification.read ? "font-medium" : ""
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-lime-500 ml-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link
                      href="/notifications"
                      className="text-sm text-lime-600 hover:text-lime-700 font-medium block text-center"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              ref={userMenuButtonRef}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-all duration-200"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (isNotificationsOpen) setIsNotificationsOpen(false);
              }}
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="text-sm">Example User</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-black transition-colors duration-200 group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-500 group-hover:text-lime-600 transition-colors duration-200" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-black transition-colors duration-200 group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 text-gray-500 group-hover:text-lime-600 transition-colors duration-200" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-black transition-colors duration-200 group"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-500 group-hover:text-lime-600 transition-colors duration-200" />
                      Settings
                    </Link>
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200 group"
                    >
                      <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 hover:bg-gray-50 transition-all"
            size="sm"
            onClick={() => {
              setAuthView("signin");
              setShowAuthModal(true);
            }}
          >
            Sign In
          </Button>
          <Button
            className="bg-black text-lime-300 hover:text-lime-200 hover:bg-gray-800 transition-all"
            size="sm"
            onClick={() => {
              setAuthView("signup");
              setShowAuthModal(true);
            }}
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );

  const renderMobileAuthButtons = () =>
    !user && (
      <motion.div
        className="pt-4 border-t border-gray-100 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Link
          href="/employer"
          className="flex items-center justify-center gap-2 px-3 py-3 text-base font-medium text-black rounded-lg bg-lime-300 hover:bg-lime-400 shadow-sm hover:shadow transition-all duration-300 hover:scale-[1.02]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Briefcase className="h-5 w-5" />
          For Employers
        </Link>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <Button
            variant="outline"
            className="w-full border-gray-200 py-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            onClick={() => {
              setAuthView("signin");
              setShowAuthModal(true);
              setIsMobileMenuOpen(false);
            }}
          >
            Sign In
          </Button>
          <Button
            className="w-full bg-black text-lime-300 hover:text-lime-200 hover:bg-gray-800 py-3 transition-all duration-300 shadow-sm hover:shadow"
            onClick={() => {
              setAuthView("signup");
              setShowAuthModal(true);
              setIsMobileMenuOpen(false);
            }}
          >
            Sign Up
          </Button>
        </div>
      </motion.div>
    );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between h-16">
            {/* Logo with enhanced hover effect */}
            <Link
              href="/"
              className="flex-shrink-0 group relative overflow-hidden"
            >
              <div className="transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src="/img/LOGO.png"
                  alt="JobFit Logo"
                  width={140}
                  height={40}
                  className="w-auto h-8 md:h-9"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation with improved styling */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Landing Page Sections Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-black hover:bg-gray-50 transition-colors duration-200 group"
                  aria-label="JobFit Platform options"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span>JobFit Platform</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                  <Link
                    href="/#hero"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("hero");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Sparkles className="h-4 w-4 text-lime-600 transition-colors duration-200 group-hover:text-lime-700" />
                    </div>
                    <div>
                      <p className="font-medium">Overview</p>
                      <p className="text-xs text-gray-500 group-hover:text-lime-600 transition-colors duration-200">
                        AI-powered job matching
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/#for-job-seeker"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("for-job-seeker");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Gift className="h-4 w-4 text-blue-600 transition-colors duration-200 group-hover:text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">For Job Seeker</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        AI tools for job seekers
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/#for-employer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("for-employer");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Building className="h-4 w-4 text-green-600 transition-colors duration-200 group-hover:text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium">Our Services For Employer</p>
                      <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                        Complete hiring solutions
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/#process"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("process");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <ListChecks className="h-4 w-4 text-purple-600 transition-colors duration-200 group-hover:text-purple-700" />
                    </div>
                    <div>
                      <p className="font-medium">How It Works</p>
                      <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
                        Our proven process
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/#team"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("team");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      setOpenDropdown(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Users className="h-4 w-4 text-pink-600 transition-colors duration-200 group-hover:text-pink-700" />
                    </div>
                    <div>
                      <p className="font-medium">Core Operations</p>
                      <p className="text-xs text-gray-500 group-hover:text-pink-600 transition-colors duration-200">
                        Meet the experts
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* AI Tools Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-black hover:bg-gray-50 transition-colors duration-200 group"
                  aria-label="AI Tools options"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span>AI Tools</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                  <Link
                    href="/job-match"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Search className="h-4 w-4 text-lime-600 transition-colors duration-200 group-hover:text-lime-700" />
                    </div>
                    <div>
                      <p className="font-medium">AI Job Match</p>
                      <p className="text-xs text-gray-500 group-hover:text-lime-600 transition-colors duration-200">
                        Find your perfect job
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/cv-assistant"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <FileText className="h-4 w-4 text-blue-600 transition-colors duration-200 group-hover:text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">Resume Assistant</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        Optimize your CV
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/interviewer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <MessageSquare className="h-4 w-4 text-amber-600 transition-colors duration-200 group-hover:text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium">AI Interviewer</p>
                      <p className="text-xs text-gray-500 group-hover:text-amber-600 transition-colors duration-200">
                        Practice for interviews
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/roadmap"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <TrendingUp className="h-4 w-4 text-green-600 transition-colors duration-200 group-hover:text-green-700" />
                    </div>
                    <div>
                      <p className="font-medium">Career Roadmap</p>
                      <p className="text-xs text-gray-500 group-hover:text-green-600 transition-colors duration-200">
                        Plan your career path
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Employer Portal Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-black hover:bg-gray-50 transition-colors duration-200 group"
                  aria-label="Employer Portal options"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span>Employer Portal</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                  <Link
                    href="/employer/jobs"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Briefcase className="h-4 w-4 text-purple-600 transition-colors duration-200 group-hover:text-purple-700" />
                    </div>
                    <div>
                      <p className="font-medium">Manage Jobs</p>
                      <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
                        Post and manage job listings
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/employer/candidates"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <Users className="h-4 w-4 text-blue-600 transition-colors duration-200 group-hover:text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium">View Candidates</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        Review applicant profiles
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/employer/analytics"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-lime-50/60 transition-all duration-200 hover:text-lime-800"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setAuthView("signin");
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow">
                      <GanttChart className="h-4 w-4 text-indigo-600 transition-colors duration-200 group-hover:text-indigo-700" />
                    </div>
                    <div>
                      <p className="font-medium">Analytics Dashboard</p>
                      <p className="text-xs text-gray-500 group-hover:text-indigo-600 transition-colors duration-200">
                        Track hiring performance
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <NavLink href="/pricing">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </div>
              </NavLink>

              <NavLink href="/resources">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>Resources</span>
                </div>
              </NavLink>
            </nav>

            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Button with improved interaction */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link href="/dashboard" className="mr-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full w-9 h-9 p-0 flex items-center justify-center border-lime-200 hover:border-lime-300 hover:scale-105 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <button
              ref={mobileMenuButtonRef}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-lime-50 hover:text-black transition-all duration-300 hover:scale-105"
              onClick={toggleMobileMenu}
              aria-expanded="false"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authView}
      />
    </>
  );
};

// NavLink component with enhanced active state and hover effects
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsActive(pathname === href || pathname?.startsWith(href + "/") || false);
  }, [pathname, href]);

  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 overflow-hidden group ${
        isActive
          ? "text-black bg-gray-50"
          : "text-gray-700 hover:text-black hover:bg-gray-50"
      }`}
    >
      <div className="relative z-10">{children}</div>
      {isActive ? (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-lime-300 rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      ) : (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-lime-300 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      )}
    </Link>
  );
};

const Dropdown = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }[];
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update ARIA attribute dynamically with useEffect
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    }
  }, [isOpen]);

  return (
    <div className="relative group" ref={ref}>
      <button
        ref={buttonRef}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded="false"
        aria-haspopup="true"
      >
        {icon && (
          <span className="text-gray-500 group-hover:text-black transition-colors duration-300">
            {icon}
          </span>
        )}
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-all duration-300 ${
            isOpen
              ? "rotate-180 text-lime-500"
              : "text-gray-400 group-hover:text-gray-700"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
              staggerChildren: 0.05,
              delayChildren: 0.05,
            }}
            className="absolute left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
          >
            {items.map((item, i) => (
              <motion.div
                key={`${item.href}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-lime-700 hover:bg-lime-50/70 transition-all duration-200 group"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && (
                    <span className="text-gray-500 group-hover:text-lime-600 transition-colors duration-200">
                      {item.icon}
                    </span>
                  )}
                  <div>
                    <div className="font-medium group-hover:text-lime-700 transition-colors duration-200">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5 group-hover:text-lime-500 transition-colors duration-200">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
