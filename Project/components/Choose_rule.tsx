"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ChooseRole = () => {
  const { setUserRole, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data for role options
  const roleOptions = [
    {
      id: "employee",
      title: "Employee",
      description: "Looking for job opportunities",
    },
    {
      id: "employer",
      title: "Employer",
      description: "Looking for candidates",
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role to continue");
      return;
    }
    
    setIsSubmitting(true);
    
    // Update the user's role in the auth context
    setUserRole(selectedRole as "employee" | "employer");
    
    console.log("Selected role:", selectedRole);
    // Redirect to confirmation page after role selection
    if (selectedRole === "employer") {
      window.location.href = "/employer/dashboard";
    } else {
      window.location.href = "/confirmation";
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-lime-300 p-4">
      <div className="absolute inset-0 bg-[url('/img/bg-pattern.svg')] bg-cover bg-center opacity-20" />
      
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
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
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-8 p-8">
          <div className="relative w-full h-64 md:h-80 mb-6">
            <Image
              src="/img/Find_Your_Perfect_Colleague.png"
              alt="Choose your role"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          
          <CardTitle className="text-2xl font-bold text-zinc-900 mb-8">
            Choose your role
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full">
            {roleOptions.map((role) => (
              <div 
                key={role.id} 
                className="flex-1 flex flex-col items-center"
              >
                <Button
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full h-14 rounded-xl text-lg font-medium transition-all ${
                    selectedRole === role.id
                      ? "bg-lime-300 text-zinc-900 border-2 border-zinc-900"
                      : "bg-zinc-900 text-lime-300 hover:bg-lime-300 hover:text-zinc-900"
                  }`}
                >
                  {role.title}
                </Button>
                <p className="mt-3 text-sm text-zinc-700">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
          
          <Button
            onClick={handleContinue}
            className="mt-10 px-8 py-3 bg-zinc-900 text-lime-300 hover:bg-lime-300 hover:text-zinc-900 transition-all w-1/2"
            disabled={isLoading || isSubmitting || !selectedRole}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Continuing...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChooseRole;
