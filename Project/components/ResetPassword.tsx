"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    // Here you would typically validate the token with your API
    // For now, we'll just check if it exists
    if (!token) {
      setIsValidToken(false);
      setError("Invalid or expired password reset link");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    console.log("Password reset submitted with token:", token);
    // Here we would normally call an API to reset the password with the token
    setIsSubmitted(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-lime-300 p-4">
      <div className="absolute inset-0 bg-[url('/img/bg-pattern.svg')] bg-cover bg-center opacity-20" />
      
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center mb-4">
            <Image 
              src="/img/LOGO.png" 
              alt="JobFit.AI Logo" 
              width={120} 
              height={36} 
              className="w-auto h-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-zinc-900">Reset Password</CardTitle>
        </CardHeader>
        
        <CardContent>
          {!isValidToken ? (
            <div className="text-center py-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <p className="text-zinc-600 mb-6">
                The password reset link is invalid or has expired. Please request a new password reset link.
              </p>
              <Link href="/forgot-password">
                <Button className="bg-zinc-900 text-lime-300 hover:bg-zinc-800">
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : !isSubmitted ? (
            <>
              <p className="text-zinc-600 mb-6">
                Please enter your new password below.
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 bg-zinc-100 border-none focus:ring-1 focus:ring-lime-300 pr-10"
                    required
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-zinc-500"
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                
                <div className="space-y-2 relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-12 bg-zinc-100 border-none focus:ring-1 focus:ring-lime-300 pr-10"
                    required
                  />
                  <button 
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-zinc-500"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-zinc-900 text-lime-300 hover:bg-zinc-800"
                >
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Password Reset Successful</h3>
              <p className="text-zinc-600 mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link href="/login">
                <Button className="bg-zinc-900 text-lime-300 hover:bg-zinc-800">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword; 