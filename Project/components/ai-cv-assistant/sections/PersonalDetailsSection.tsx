"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  photoUrl: string;
}

interface PersonalDetailsSectionProps {
  data: PersonalDetails;
  updateData: (data: PersonalDetails) => void;
}

export function PersonalDetailsSection({ data, updateData }: PersonalDetailsSectionProps) {
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      [name]: value
    });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server or use a file API
      // For this demo, we'll just create a temporary URL
      const photoUrl = URL.createObjectURL(file);
      updateData({
        ...data,
        photoUrl
      });
    }
  };
  
  const removePhoto = () => {
    updateData({
      ...data,
      photoUrl: ""
    });
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Personal Details</CardTitle>
        <CardDescription>
          Add your personal information to help employers contact you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Photo upload */}
        <div className="flex justify-center">
          <div 
            className="relative"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {data.photoUrl ? (
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200">
                <Image 
                  src={data.photoUrl} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
                
                {hovering && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-full bg-white text-black hover:bg-gray-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 rounded-full bg-white text-red-500 hover:bg-red-100"
                      onClick={removePhoto}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="h-32 w-32 rounded-full bg-gray-100 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-200 border-dashed hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">Upload photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
        
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={data.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={data.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="h-12"
            />
          </div>
        </div>
        
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={data.jobTitle}
            onChange={handleInputChange}
            placeholder="e.g. Frontend Developer"
            className="h-12"
          />
        </div>
        
        {/* Contact row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={handleInputChange}
              placeholder="e.g. +1 123 456 7890"
              className="h-12"
            />
          </div>
        </div>
        
        {/* Location row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">City / State</Label>
            <Input
              id="location"
              name="location"
              value={data.location}
              onChange={handleInputChange}
              placeholder="e.g. San Francisco, CA"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={data.country}
              onChange={handleInputChange}
              placeholder="e.g. United States"
              className="h-12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 