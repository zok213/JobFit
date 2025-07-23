"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { ShieldCheck, EyeOff, Eye, BellRing, Lock, AlertCircle, CheckCircle } from "lucide-react";

export const Security = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggleChange = (name: string, checked: boolean) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "newPassword") {
      validatePasswordStrength(value);
    }
    
    setPasswordError("");
  };
  
  const validatePasswordStrength = (password: string) => {
    // Start with a score of 0
    let score = 0;
    let feedback = "";
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Provide feedback based on score
    if (score === 0) {
      feedback = "Enter a password";
    } else if (score <= 2) {
      feedback = "Password is weak";
    } else if (score <= 4) {
      feedback = "Password is moderate";
    } else {
      feedback = "Password is strong";
    }
    
    setPasswordStrength({ score, feedback });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Required fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    // Password matching
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Password complexity
    if (passwordStrength.score < 4) {
      setPasswordError("Please use a stronger password");
      return;
    }
    
    // Prevent reusing current password
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password cannot be the same as current password");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would make an actual API call to update the password
      // const response = await api.updatePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
    
    // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitting(false);
      setShowSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordStrength({ score: 0, feedback: "" });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      setPasswordError("Failed to update password. Please try again.");
      console.error("Password update error:", error);
    }
  };

  // Password strength indicator colors
  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex flex-col space-y-6">
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border-none hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-lime-300/10 to-lime-100/50 px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <p className="text-gray-500 text-sm mt-1">Update your password to keep your account secure</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-50 border-gray-200 pr-10 focus:border-lime-300 focus:ring-lime-300 transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="bg-gray-50 border-gray-200 pr-10 focus:border-lime-300 focus:ring-lime-300 transition-all"
                    required
                    aria-describedby="password-requirements"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()}`} 
                          style={{ width: `${Math.min(100, (passwordStrength.score / 6) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{passwordStrength.feedback}</span>
                    </div>
                    
                    <ul className="text-xs text-gray-500 mt-2 space-y-1" id="password-requirements">
                      <li className="flex items-center gap-1">
                        {passwordData.newPassword.length >= 8 ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-gray-400" />}
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-1">
                        {/[A-Z]/.test(passwordData.newPassword) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-gray-400" />}
                        Upper case letter
                      </li>
                      <li className="flex items-center gap-1">
                        {/[a-z]/.test(passwordData.newPassword) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-gray-400" />}
                        Lower case letter
                      </li>
                      <li className="flex items-center gap-1">
                        {/[0-9]/.test(passwordData.newPassword) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-gray-400" />}
                        Number
                      </li>
                      <li className="flex items-center gap-1">
                        {/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 
                          <CheckCircle className="h-3 w-3 text-green-500" /> : 
                          <AlertCircle className="h-3 w-3 text-gray-400" />}
                        Special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 transition-all"
                  required
                />
                {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                )}
              </div>
              
              {passwordError && (
                <div className="text-red-500 text-sm py-1 bg-red-50 border border-red-200 rounded px-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit"
                  className="bg-black text-lime-300 hover:bg-gray-800 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      <span className="inline-block w-4 h-4 border-2 border-lime-300 border-t-transparent rounded-full animate-spin mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm overflow-hidden border-none hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-lime-300/10 to-lime-100/50 px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
            <p className="text-gray-500 text-sm mt-1">Manage your account security and notifications</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div>
                  <Label htmlFor="twoFactorAuth" className="text-base font-medium flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-gray-500" />
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked: boolean) => handleToggleChange("twoFactorAuth", checked)}
                  className="data-[state=checked]:bg-black"
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div>
                  <Label htmlFor="loginNotifications" className="text-base font-medium flex items-center">
                    <BellRing className="h-4 w-4 mr-2 text-gray-500" />
                    Login Notifications
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">Receive notifications for new login attempts</p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked: boolean) => handleToggleChange("loginNotifications", checked)}
                  className="data-[state=checked]:bg-black"
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="text-black text-lime-300 hover:bg-gray-800 transition-colors w-full justify-start"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Sign out from all devices
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showSuccess && (
        <div className="bg-lime-100 border border-lime-300 text-black px-4 py-3 rounded-md flex items-center justify-between">
          <p>Security settings updated successfully!</p>
          <button onClick={() => setShowSuccess(false)} className="text-black">
            &times;
          </button>
        </div>
      )}
    </div>
  );
}; 