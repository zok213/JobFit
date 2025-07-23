"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Alert, AlertDescription } from "./ui/alert";
import { Logo } from "./ui/logo";
import { motion } from "framer-motion";

const Register = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      await register(formData.email, formData.username, formData.password);
      // Redirect will be handled by auth state change or confirmation email
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-lime-300 to-lime-400 p-4">
      <div className="absolute inset-0 bg-[url('/img/bg-pattern.svg')] bg-cover bg-center opacity-20" />
      
      {/* Background elements for visual interest */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 opacity-20"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-300 via-lime-400 to-lime-300"></div>
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto mb-6">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-zinc-900">Create an Account</CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200"
                  required
                  autoComplete="email"
                />
              </div>
              
              <div>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200"
                  required
                  autoComplete="username"
                />
              </div>
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-800 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 bg-zinc-50 border-zinc-200 rounded-lg focus:ring-2 focus:ring-lime-300 focus:border-lime-300 transition-all duration-200 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-800 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 mt-6 bg-black text-lime-300 hover:bg-zinc-800 transition-all duration-200 rounded-lg font-medium flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center mt-6">
                <span className="text-zinc-600">Already have an account? </span>
                <Link href="/login" className="text-lime-600 font-semibold hover:text-lime-700 transition-colors">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 text-sm text-white/80">
          By registering, you agree to our <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
