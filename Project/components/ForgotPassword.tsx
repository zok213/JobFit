"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState("");

  // Generate token on client-side only after component mounts
  useEffect(() => {
    setResetToken(generateMockToken());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Reset password requested for: ${email}, token: ${resetToken}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  // This is just for demo purposes - in a real app, tokens would be generated server-side
  const generateMockToken = () => {
    // This function is only called client-side in the useEffect
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
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
          <CardTitle className="text-2xl font-bold text-zinc-900">Forgot Password</CardTitle>
          <p className="text-sm text-zinc-600 mt-2">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className="text-center">
              <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                <p>Password reset link has been sent!</p>
                <p className="text-sm mt-2">Please check your email for further instructions.</p>
              </div>
              <Link href="/login">
                <Button className="w-full mt-4 bg-zinc-900 text-lime-300 hover:bg-lime-300 hover:text-zinc-900">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-zinc-100 border-none focus:ring-1 focus:ring-lime-300"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-zinc-900 text-lime-300 hover:bg-lime-300 hover:text-zinc-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Reset Password"}
              </Button>

              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-zinc-600 hover:text-lime-700 hover:underline">
                  Remember your password? Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword; 