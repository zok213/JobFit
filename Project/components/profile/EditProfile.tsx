"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import { PencilIcon } from "lucide-react";
import { AvatarWithFallback } from "../ui/avatar-with-fallback";

export const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "Sophie",
    lastName: "Smith",
    email: user?.email || "",
    phone: "+44 123 456 789",
    position: "Product Designer",
    company: "JobFit.AI",
    location: "London, UK",
    country: "United Kingdom",
    city: "London",
    bio: "I'm a product designer with 5+ years of experience working in various industries.",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFullName = () => {
    return `${formData.firstName} ${formData.lastName}`;
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <p className="text-gray-500 text-sm mt-1">Update your personal details</p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-1/4 flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-lime-300 overflow-hidden">
                    <AvatarWithFallback
                      src="/img/avatar.png"
                      alt="Profile avatar"
                      name={getFullName()}
                      size="xl"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <p className="text-white text-sm font-medium">Change Photo</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center max-w-[200px]">
                  Click on the photo to upload a new profile picture
                </p>
              </div>
              
              <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-[#175f36] focus:ring-[#175f36] transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-[#175f36] focus:ring-[#175f36] transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    name="position"
                    placeholder="Position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-[#175f36] focus:ring-[#175f36] transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value: string) => handleSelectChange("country", value)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-[#175f36] focus:ring-[#175f36] transition-all">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-200 focus:border-[#175f36] focus:ring-[#175f36] transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 h-24 focus:border-[#175f36] focus:ring-[#175f36] transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showSuccess && (
        <div className="bg-lime-100 border border-lime-300 text-black px-4 py-3 rounded-md flex items-center justify-between">
          <p>Profile updated successfully!</p>
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
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
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