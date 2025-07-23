"use client";

import React, { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Building, MapPin, Globe, Mail, Phone, Save, Upload, Users, LinkIcon, Trash2 } from "lucide-react";

export default function EmployerCompanyProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulating API call
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <EmployerDashboardShell activeNavItem="company" userRole="employer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your company details and branding
            </p>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-lime-600 hover:bg-lime-700 text-white"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> 
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1 rounded-lg grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="details" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Details</TabsTrigger>
            <TabsTrigger value="branding" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Branding</TabsTrigger>
            <TabsTrigger value="social" className="rounded data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-sm">Social</TabsTrigger>
          </TabsList>

          {/* Company Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Basic information about your company
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      placeholder="Your company name" 
                      defaultValue="Acme Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input 
                      id="industry" 
                      placeholder="e.g. Technology, Healthcare, etc." 
                      defaultValue="Technology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">About the Company</Label>
                  <Textarea 
                    id="company-description" 
                    placeholder="Describe your company, mission, and culture" 
                    rows={5}
                    defaultValue="Acme Corporation is a leading technology company specializing in innovative software solutions. Founded in 2010, we've been at the forefront of digital transformation, helping businesses around the world streamline operations and enhance customer experiences."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-size">Company Size</Label>
                    <Input 
                      id="company-size" 
                      placeholder="Number of employees" 
                      defaultValue="50-200 employees"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded</Label>
                    <Input 
                      id="founded" 
                      placeholder="Year founded" 
                      defaultValue="2010"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <Input 
                      id="website" 
                      placeholder="https://example.com" 
                      defaultValue="https://acmecorp.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input 
                      id="email" 
                      placeholder="contact@example.com" 
                      defaultValue="hr@acmecorp.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Office Locations</CardTitle>
                <CardDescription>
                  Add your company's office locations
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 relative">
                    <div className="absolute top-3 right-3">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 h-7 w-7 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location-name-1">Office Name</Label>
                        <Input 
                          id="location-name-1" 
                          placeholder="e.g. Headquarters, Branch Office, etc." 
                          defaultValue="Headquarters"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location-type-1">Office Type</Label>
                        <Input 
                          id="location-type-1" 
                          placeholder="e.g. Main Office, Branch, Remote Hub" 
                          defaultValue="Main Office"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="address-1">Address</Label>
                      <Input 
                        id="address-1" 
                        placeholder="Full address" 
                        defaultValue="123 Tech Street, San Francisco, CA 94107, USA"
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-dashed border-gray-300 mt-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    Add Another Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Company Branding</CardTitle>
                <CardDescription>
                  Upload your logo and customize your profile appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center space-x-6">
                    <div className="bg-gray-100 rounded-lg h-32 w-32 flex items-center justify-center">
                      <div className="bg-gray-200 rounded-lg p-4">
                        <Building className="h-12 w-12 text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button variant="outline" className="block">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended: Square image, at least 300x300px, PNG or JPG format.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg h-[200px] flex flex-col items-center justify-center p-6">
                    <Camera className="h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 mb-3 text-center">
                      Drag and drop an image, or click to upload
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Image
                    </Button>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Recommended: 1200x300px. PNG or JPG format.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-lime-500"></div>
                      <Input 
                        id="primary-color" 
                        defaultValue="#84cc16" 
                        className="font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                      <Input 
                        id="secondary-color" 
                        defaultValue="#27272a" 
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social & Links Tab */}
          <TabsContent value="social" className="space-y-6 mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="px-6 pb-0">
                <CardTitle>Social Media & Links</CardTitle>
                <CardDescription>
                  Connect your company's social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pt-6 space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-3 md:col-span-2">
                      <Label htmlFor="linkedin" className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span>LinkedIn</span>
                      </Label>
                    </div>
                    <div className="col-span-12 sm:col-span-9 md:col-span-10">
                      <Input 
                        id="linkedin" 
                        placeholder="https://linkedin.com/company/yourcompany" 
                        defaultValue="https://linkedin.com/company/acmecorp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-3 md:col-span-2">
                      <Label htmlFor="twitter" className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <span>Twitter</span>
                      </Label>
                    </div>
                    <div className="col-span-12 sm:col-span-9 md:col-span-10">
                      <Input 
                        id="twitter" 
                        placeholder="https://twitter.com/yourcompany" 
                        defaultValue="https://twitter.com/acmecorp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-3 md:col-span-2">
                      <Label htmlFor="facebook" className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                      </Label>
                    </div>
                    <div className="col-span-12 sm:col-span-9 md:col-span-10">
                      <Input 
                        id="facebook" 
                        placeholder="https://facebook.com/yourcompany" 
                        defaultValue="https://facebook.com/acmecorp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-3 md:col-span-2">
                      <Label htmlFor="instagram" className="flex items-center space-x-2">
                        <svg className="h-5 w-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                        <span>Instagram</span>
                      </Label>
                    </div>
                    <div className="col-span-12 sm:col-span-9 md:col-span-10">
                      <Input 
                        id="instagram" 
                        placeholder="https://instagram.com/yourcompany" 
                        defaultValue="https://instagram.com/acmecorp"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full border-dashed">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Add Custom Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployerDashboardShell>
  );
} 