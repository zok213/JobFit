"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, initialView = "signin" }: AuthModalProps) {
  const [view, setView] = useState<"signin" | "signup">(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (view === "signup") {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        setIsSubmitting(false);
        return;
      }
      try {
        await register(formData.email, formData.username, formData.password);
        onClose();
      } catch (error: any) {
        console.error("Registration error:", error);
        alert(error.message || "Failed to create account");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Handle login
      try {
        await login(formData.email, formData.password);
        onClose();
      } catch (error: any) {
        console.error("Login error:", error);
        alert(error.message || "Failed to sign in");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-2xl">
        <div className="relative flex flex-col items-center p-8">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/img/LOGO.png"
              alt="JobFit.AI Logo"
              width={120}
              height={36}
              className="w-auto h-auto"
              priority
            />
          </div>

          <DialogTitle className="text-2xl font-bold mb-6">
            {view === "signin" ? "Sign In" : "Sign Up"}
          </DialogTitle>

          {/* Demo accounts section */}
          {view === "signin" && (
            <div className="w-full mb-6">
              <p className="text-sm text-gray-500 mb-2">Demo accounts:</p>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center">
                  <code className="px-2 py-1 bg-gray-100 rounded">test@example.com</code>
                  <span className="mx-2">|</span>
                  <code className="px-2 py-1 bg-gray-100 rounded">password123</code>
                </div>
                <div className="flex items-center">
                  <code className="px-2 py-1 bg-gray-100 rounded">employer@example.com</code>
                  <span className="mx-2">|</span>
                  <code className="px-2 py-1 bg-gray-100 rounded">password123</code>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {view === "signup" && (
              <div>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300"
                  required
                />
              </div>
            )}

            <div>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email or username"
                className="h-12 bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300"
                required
              />
            </div>

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="h-12 bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {view === "signup" && (
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="h-12 bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {view === "signin" && (
              <div className="flex justify-end">
                <Button
                  variant="link"
                  className="text-lime-600 hover:text-lime-700 p-0 h-auto font-normal"
                  onClick={() => {/* Handle forgot password */}}
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-lime-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {view === "signin" ? "Signing In..." : "Signing Up..."}
                </div>
              ) : (
                view === "signin" ? "Sign In" : "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {view === "signin" ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="text-lime-600 hover:text-lime-700 p-0 h-auto font-medium"
                onClick={() => setView(view === "signin" ? "signup" : "signin")}
              >
                {view === "signin" ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </div>

          <div className="mt-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 bg-white hover:bg-gray-50"
                onClick={() => {/* Handle Facebook login */}}
              >
                <Image
                  src="/img/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 bg-white hover:bg-gray-50"
                onClick={() => {/* Handle Google login */}}
              >
                <Image
                  src="/img/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 bg-white hover:bg-gray-50"
                onClick={() => {/* Handle GitHub login */}}
              >
                <Image
                  src="/img/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            By {view === "signin" ? "signing in" : "registering"}, you agree to our{" "}
            <Button
              variant="link"
              className="text-lime-600 hover:text-lime-700 p-0 h-auto font-medium"
              onClick={() => {/* Handle Terms of Service */}}
            >
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button
              variant="link"
              className="text-lime-600 hover:text-lime-700 p-0 h-auto font-medium"
              onClick={() => {/* Handle Privacy Policy */}}
            >
              Privacy Policy
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}