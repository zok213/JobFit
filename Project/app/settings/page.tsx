"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Bell,
  Lock,
  Save,
  Trash2,
  UserX,
  ShieldAlert,
  LogOut,
  Languages
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);

  const saveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardShell activeNavItem="settings" userRole="employee">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <Card className="shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Settings</h3>
              </div>
              <div className="p-2">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        activeTab === "account"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("account")}
                    >
                      <User size={18} />
                      <span>Account</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        activeTab === "notifications"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        activeTab === "privacy"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("privacy")}
                    >
                      <Lock size={18} />
                      <span>Privacy & Security</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        activeTab === "language"
                          ? "bg-lime-300 text-black font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("language")}
                    >
                      <Languages size={18} />
                      <span>Language</span>
                    </button>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {activeTab === "account" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <Card className="mb-6 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="mt-1" />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={saveSettings} 
                          disabled={isLoading}
                          className="bg-black text-lime-300 hover:bg-gray-800"
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className="mt-1" />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          className="border-gray-200 hover:bg-gray-50 text-black"
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-black text-lime-300 hover:bg-gray-800 ml-2"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-red-100">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center">
                      <UserX size={20} className="mr-2" />
                      Delete Account
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                
                <Card className="mb-6 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job Match Alerts</p>
                          <p className="text-sm text-gray-500">Receive emails when new job matches are found</p>
                        </div>
                        <Switch defaultChecked id="job-alerts" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Interview Reminders</p>
                          <p className="text-sm text-gray-500">Get notified before upcoming AI interview sessions</p>
                        </div>
                        <Switch defaultChecked id="interview-reminders" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">CV Updates</p>
                          <p className="text-sm text-gray-500">Receive suggestions to improve your CV</p>
                        </div>
                        <Switch defaultChecked id="cv-updates" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product Updates</p>
                          <p className="text-sm text-gray-500">Learn about new features and improvements</p>
                        </div>
                        <Switch id="product-updates" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Push Notifications</p>
                          <p className="text-sm text-gray-500">Allow browser notifications for important updates</p>
                        </div>
                        <Switch id="push-notifications" />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button 
                        onClick={saveSettings} 
                        disabled={isLoading}
                        className="bg-black text-lime-300 hover:bg-gray-800"
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
                
                <Card className="mb-6 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-gray-500">Allow companies to view your profile</p>
                        </div>
                        <Switch defaultChecked id="profile-visibility" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">CV Visibility</p>
                          <p className="text-sm text-gray-500">Allow companies to download your CV</p>
                        </div>
                        <Switch defaultChecked id="cv-visibility" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Analytics</p>
                          <p className="text-sm text-gray-500">Allow us to use your data for improving our services</p>
                        </div>
                        <Switch defaultChecked id="data-analytics" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <ShieldAlert size={16} className="mr-2" />
                          Enable
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Session Management</p>
                          <p className="text-sm text-gray-500">Manage your active sessions and devices</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          View Sessions
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                        >
                          <LogOut size={16} className="mr-2" />
                          Log Out of All Devices
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button 
                        onClick={saveSettings} 
                        disabled={isLoading}
                        className="bg-black text-lime-300 hover:bg-gray-800"
                      >
                        {isLoading ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "language" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Language Settings</h2>
                
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Language Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="language">Interface Language</Label>
                        <select 
                          id="language"
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          aria-label="Select interface language"
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="es">Español</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <select 
                          id="region"
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          aria-label="Select region"
                        >
                          <option value="us">United States</option>
                          <option value="uk">United Kingdom</option>
                          <option value="eu">European Union</option>
                          <option value="ca">Canada</option>
                          <option value="au">Australia</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button 
                        onClick={saveSettings} 
                        disabled={isLoading}
                        className="bg-black text-lime-300 hover:bg-gray-800"
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
} 