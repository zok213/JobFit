"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { EditProfile } from "../../components/profile/EditProfile";
import { Preferences } from "../../components/profile/Preferences";
import { Security } from "../../components/profile/Security";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardShell } from "../../components/DashboardShell";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("edit-profile");

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading or redirect if no user
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <DashboardShell activeNavItem="profile" userRole="employee">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Profile Settings</h1>
        
        <Tabs defaultValue="edit-profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="edit-profile" className="px-6">Edit Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="px-6">Preferences</TabsTrigger>
            <TabsTrigger value="security" className="px-6">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit-profile">
            <EditProfile />
          </TabsContent>
          
          <TabsContent value="preferences">
            <Preferences />
          </TabsContent>
          
          <TabsContent value="security">
            <Security />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
} 