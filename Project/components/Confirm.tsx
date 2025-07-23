"use client";

import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const Confirm = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md bg-white shadow-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Success animation/illustration */}
              <div className="w-32 h-32 bg-lime-300 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-zinc-900" />
              </div>
              
              {/* Confetti effect */}
              <div className="absolute w-full h-full">
                <span className="absolute w-2 h-2 bg-lime-300 rounded-full top-6 left-10 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.2s" }}></span>
                <span className="absolute w-3 h-3 bg-lime-500 rounded-full top-12 right-12 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.1s" }}></span>
                <span className="absolute w-2 h-2 bg-lime-400 rounded-full bottom-8 left-12 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.5s" }}></span>
                <span className="absolute w-2 h-2 bg-lime-300 rounded-full bottom-12 right-10 animate-ping" style={{ animationDuration: "1.7s", animationDelay: "0.3s" }}></span>
                <span className="absolute w-1 h-1 bg-lime-500 rounded-full top-16 left-16 animate-ping" style={{ animationDuration: "1.9s", animationDelay: "0.4s" }}></span>
              </div>
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-zinc-900">
              Your account was successfully created!
            </h2>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <p className="text-zinc-600">
            We're excited to have you join our platform. Let's get started by setting up your profile.
          </p>
          
          <div className="space-y-4 pt-4">
            <Link href="/upload-cv" className="block">
              <Button
                className="w-full py-4 bg-zinc-900 text-lime-300 hover:bg-zinc-800"
              >
                Upload your CV
              </Button>
            </Link>
            
            <Link href="/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full py-4 text-zinc-700 border-zinc-300 hover:bg-zinc-50"
              >
                Skip for now
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-zinc-500 pt-2">
            You can always complete your profile later from your dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirm;
