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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  Mail, 
  Smartphone, 
  LogOut, 
  AlertTriangle,
  Save,
  Trash2
} from "lucide-react";

export default function EmployerSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulating API call
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <EmployerDashboardShell activeNavItem="settings" userRole="employer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500 mt-1">
              Manage your account preferences and settings
            </p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-lime-600 hover:bg-lime-700 text-white"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> 
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="account" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Account</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Security</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl font-medium">
                        E
                      </div>
                      <button 
                        className="absolute -bottom-2 -right-2 bg-lime-600 text-white p-1.5 rounded-full hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                        aria-label="Change profile picture"
                      >
                        <User className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1.5">
                    <h3 className="text-lg font-medium">Emily Johnson</h3>
                    <p className="text-gray-500 text-sm">HR Manager at Acme Corporation</p>
                    <p className="text-gray-500 text-sm">emily.johnson@acmecorp.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="Your first name" 
                      defaultValue="Emily"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Your last name" 
                      defaultValue="Johnson"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="Your email address" 
                      defaultValue="emily.johnson@acmecorp.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="Your phone number" 
                      defaultValue="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input 
                    id="job-title" 
                    placeholder="Your position in the company" 
                    defaultValue="HR Manager"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium mb-2">Timezone</h3>
                  <select 
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    aria-label="Select timezone"
                  >
                    <option value="utc-8">Pacific Time (UTC-08:00)</option>
                    <option value="utc-5">Eastern Time (UTC-05:00)</option>
                    <option value="utc">Coordinated Universal Time (UTC)</option>
                    <option value="utc+1">Central European Time (UTC+01:00)</option>
                    <option value="utc+8">China Standard Time (UTC+08:00)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This will affect how dates and times are displayed in your account.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gray-50">
              <CardHeader className="px-6 pb-0">
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  These actions are irreversible
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                    <div>
                      <h3 className="font-medium mb-1">Delete Your Account</h3>
                      <p className="text-sm text-gray-500">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" className="mt-3 sm:mt-0">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Customize how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-applications">New Applications</Label>
                          <p className="text-sm text-gray-500">
                            Get notified when candidates apply to your job postings
                          </p>
                        </div>
                        <Switch id="email-applications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-messages">Messages</Label>
                          <p className="text-sm text-gray-500">
                            Receive email notifications for new messages from candidates
                          </p>
                        </div>
                        <Switch id="email-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-reminders">Reminders</Label>
                          <p className="text-sm text-gray-500">
                            Get reminded about scheduled interviews and pending actions
                          </p>
                        </div>
                        <Switch id="email-reminders" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing & Updates</Label>
                          <p className="text-sm text-gray-500">
                            Receive platform news, feature updates, and tips
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium mb-3">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-applications">New Applications</Label>
                          <p className="text-sm text-gray-500">
                            Get real-time alerts when candidates apply
                          </p>
                        </div>
                        <Switch id="push-applications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-messages">Messages</Label>
                          <p className="text-sm text-gray-500">
                            Receive push notifications for new messages
                          </p>
                        </div>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-reminders">Reminders</Label>
                          <p className="text-sm text-gray-500">
                            Get notified before scheduled interviews and deadlines
                          </p>
                        </div>
                        <Switch id="push-reminders" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium mb-3">Notification Frequency</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="frequency-real-time" 
                          name="notification-frequency" 
                          checked
                          className="text-lime-600 focus:ring-lime-500"
                          aria-labelledby="label-frequency-real-time"
                        />
                        <Label id="label-frequency-real-time" htmlFor="frequency-real-time">Real-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="frequency-daily" 
                          name="notification-frequency" 
                          className="text-lime-600 focus:ring-lime-500"
                          aria-labelledby="label-frequency-daily"
                        />
                        <Label id="label-frequency-daily" htmlFor="frequency-daily">Daily digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="frequency-weekly" 
                          name="notification-frequency" 
                          className="text-lime-600 focus:ring-lime-500"
                          aria-labelledby="label-frequency-weekly"
                        />
                        <Label id="label-frequency-weekly" htmlFor="frequency-weekly">Weekly summary</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        placeholder="Enter your current password" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          placeholder="Enter new password" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          placeholder="Confirm new password" 
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Password requirements:</p>
                      <ul className="text-xs text-gray-500 space-y-1 list-disc pl-5">
                        <li>Minimum 8 characters long</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>
                    <Button className="w-full sm:w-auto">Update Password</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-lime-600" />
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 sm:mt-0"
                      >
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium mb-4">Login Sessions</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">Current Session</p>
                          <div className="text-sm text-gray-500">
                            <p>Windows 10 • Chrome</p>
                            <p>IP: 192.168.1.1 • Last active: Just now</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-lime-100 text-lime-800 text-xs rounded-full font-medium">
                          Current
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">San Francisco, USA</p>
                          <div className="text-sm text-gray-500">
                            <p>MacOS • Safari</p>
                            <p>IP: 192.168.1.2 • Last active: Yesterday</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 h-8">
                          <LogOut className="h-4 w-4 mr-1" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    Logout of All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployerDashboardShell>
  );
} 