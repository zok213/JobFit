"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { 
  Bell, 
  Moon, 
  Lock, 
  Mail, 
  Briefcase, 
  Info, 
  MessageSquare 
} from "lucide-react";

export const Preferences = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    jobAlerts: true,
    newUpdates: false,
    messageNotifications: true,
    darkMode: false,
    privacySettings: true,
  });

  const handleToggleChange = (name: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col space-y-6">
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border-none hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-lime-300/10 to-lime-100/50 px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Application Preferences</h3>
            <p className="text-gray-500 text-sm mt-1">Manage your notifications and app settings</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-black" />
                <span>Notifications</span>
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">Receive email notifications about your account</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked: boolean) => handleToggleChange("emailNotifications", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="jobAlerts" className="text-base font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      Job Alerts
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">Get notified about new job opportunities</p>
                  </div>
                  <Switch
                    id="jobAlerts"
                    checked={preferences.jobAlerts}
                    onCheckedChange={(checked: boolean) => handleToggleChange("jobAlerts", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="newUpdates" className="text-base font-medium flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      Platform Updates
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">Stay informed about new features and updates</p>
                  </div>
                  <Switch
                    id="newUpdates"
                    checked={preferences.newUpdates}
                    onCheckedChange={(checked: boolean) => handleToggleChange("newUpdates", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
                
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="messageNotifications" className="text-base font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                      Message Notifications
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">Get notified when you receive new messages</p>
                  </div>
                  <Switch
                    id="messageNotifications"
                    checked={preferences.messageNotifications}
                    onCheckedChange={(checked: boolean) => handleToggleChange("messageNotifications", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                <Moon className="h-5 w-5 mr-2 text-black" />
                <span>Appearance</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="darkMode" className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-500 mt-1">Use dark theme for the application</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked: boolean) => handleToggleChange("darkMode", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-black" />
                <span>Privacy</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div>
                    <Label htmlFor="privacySettings" className="text-base font-medium">Enhanced Privacy</Label>
                    <p className="text-sm text-gray-500 mt-1">Limit data sharing and enhance privacy protections</p>
                  </div>
                  <Switch
                    id="privacySettings"
                    checked={preferences.privacySettings}
                    onCheckedChange={(checked: boolean) => handleToggleChange("privacySettings", checked)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showSuccess && (
        <div className="bg-lime-100 border border-lime-300 text-black px-4 py-3 rounded-md flex items-center justify-between">
          <p>Preferences updated successfully!</p>
          <button onClick={() => setShowSuccess(false)} className="text-black">
            &times;
          </button>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          className="bg-black text-lime-300 hover:bg-gray-800 transition-colors relative"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-lime-300 border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}; 