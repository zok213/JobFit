"use client";

import React, { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Home,
  Briefcase,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  Award,
  LineChart,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ChatWidget } from "./ui/chat-widget";

type NavItem = {
  id: string;
  label: string;
  icon?: React.ElementType;
  route?: string;
  active: boolean;
};

interface DashboardShellProps {
  children: ReactNode;
  activeNavItem?: string;
  userRole?: "employee" | "employer";
  accountType?: "pro" | "free";
}

export const DashboardShell = ({
  children,
  activeNavItem = "dashboard",
  userRole = "employee",
  accountType = "free",
}: DashboardShellProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock notifications for demonstration
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

  // Handle scroll for sticky header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      route: "/dashboard",
      active: activeNavItem === "dashboard",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      route: "/profile",
      active: activeNavItem === "profile",
    },
    {
      id: "job-match",
      label: "AI Job Match",
      icon: Briefcase,
      route: "/job-match",
      active: activeNavItem === "job-match" || activeNavItem === "jobmatch",
    },
    {
      id: "cv-assistant",
      label: "AI CV Assistant",
      icon: FileText,
      route: "/cv-assistant",
      active:
        activeNavItem === "cv-assistant" || activeNavItem === "cvassistant",
    },
    {
      id: "interviewer",
      label: "AI Interviewer",
      icon: MessageSquare,
      route: "/interviewer",
      active: activeNavItem === "interviewer",
    },
    {
      id: "roadmap",
      label: "AI Roadmap",
      icon: LineChart,
      route: "/roadmap",
      active: activeNavItem === "roadmap",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/settings",
      active: activeNavItem === "settings",
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      route: "/help",
      active: activeNavItem === "help",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (item: NavItem) => {
    if (item.route) {
      router.push(item.route);
    }

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      {/* Mobile menu background overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Navigation */}
      <aside
        className={`w-[250px] bg-white min-h-screen border-r border-gray-200 fixed left-0 top-0 h-full z-50 shadow-sm transition-all duration-300 transform md:translate-x-0 overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-center border-b border-gray-100">
          <button
            onClick={() => router.push("/")}
            className="transition-transform hover:scale-105 focus:outline-none"
            aria-label="Go to home page"
          >
            <div className="flex items-center ">
              <Image
                src="/img/LOGO.png"
                alt="JobFit.AI Logo"
                width={100}
                height={40}
                className="object-contain max-w-[100px]"
              />
              <div className="flex items-center">
                <span className="mt-6 text-sm text-gray-600 font-medium">
                  {userRole === "employer" ? "Employer" : "Employee"}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-6">
          <div className="px-5 mb-6">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">
              MAIN
            </p>
            <ul className="space-y-1">
              {navItems.slice(0, 2).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 mr-4 ${
                          item.active ? "text-black" : "text-gray-500"
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 mb-6">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">
              AI TOOLS
            </p>
            <ul className="space-y-1">
              {navItems.slice(2, 6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 mr-4 ${
                          item.active ? "text-black" : "text-gray-500"
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">
              PREFERENCES
            </p>
            <ul className="space-y-1">
              {navItems.slice(6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 mr-4 ${
                          item.active ? "text-black" : "text-gray-500"
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Pro upgrade banner */}
        <div className="px-5 mt-auto mb-8">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-5 text-white border border-zinc-700 shadow-xl">
            <h3 className="font-bold text-lg mb-1">Upgrade to Pro</h3>
            <p className="text-zinc-300 text-sm mb-4">
              Get access to advanced AI tools and unlimited job matches
            </p>
            <Button
              className="w-full bg-lime-600 text-white hover:bg-lime-700 transition-all font-medium shadow-md"
              onClick={() => router.push("/pricing")}
            >
              Upgrade Now
            </Button>
          </div>
        </div>

        {/* Guide Chatbot */}
        <div className="px-5 mb-4">
          <Button
            onClick={() =>
              router.push(
                userRole === "employer" ? "/help/employer" : "/help/employee"
              )
            }
            variant="ghost"
            className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center mr-3">
                <MessageSquare className="h-4 w-4 text-zinc-900" />
              </div>
              <div>
                <p className="font-medium text-sm">Guide Bot</p>
                <p className="text-xs text-gray-500">Ask for help anytime</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Version info */}
        <div className="px-5 mb-2 text-center">
          <p className="text-xs text-gray-400">JobFit.AI v1.2.0</p>
        </div>
      </aside>

      {/* Issue indicator - positioned at the bottom left of sidebar */}

      {/* Main content */}
      <main className="flex-1 md:ml-[260px] overflow-x-hidden">
        {/* Header */}
        <header
          className={`bg-white px-4 md:px-8 py-4 sticky top-0 z-20 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "shadow-lg" : ""
          }`}
        >
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
              {navItems.find((item) => item.active)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 py-2 w-[240px] bg-gray-50 border-gray-200 rounded-lg focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={18} />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
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
                                  <MessageSquare className="h-4 w-4 text-blue-600" />
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

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center text-zinc-900 font-medium shadow-sm">
                <span>
                  {user?.username?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "T"}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || "testuser"}
                  </p>
                  {accountType === "pro" ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-lime-600 to-lime-500 text-white rounded shadow-sm">
                      PRO
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-500 text-white rounded shadow-sm">
                      FREE
                    </span>
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
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-lime-600 to-lime-500 text-white rounded shadow-sm">
                    PRO
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-500 text-white rounded shadow-sm">
                    FREE
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-5 md:p-8">{children}</div>
      </main>
      <ChatWidget
        title="JobFit Assistant"
        subtitle="Trợ lý riêng của bạn tại JobFit"
        inputPlaceholder="Bạn cần trợ giúp gì?"
      />
    </div>
  );
};
