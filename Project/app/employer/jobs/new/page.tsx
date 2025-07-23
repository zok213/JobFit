"use client";

import { useState } from "react";
import { EmployerDashboardShell } from "@/components/employer/EmployerDashboardShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Users,
  Tag,
  Sparkles,
  Upload,
  CheckCircle2,
  Save,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostNewJobPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isRemote, setIsRemote] = useState(false);
  const [salaryVisible, setSalaryVisible] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    salaryPeriod: "yearly",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
    skills: "",
    education: "",
    applicationInstructions: ""
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setJobData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    if (!jobData.title.trim()) {
      errors.title = "Job title is required";
    }
    
    if (!jobData.department.trim()) {
      errors.department = "Department is required";
    }
    
    if (!isRemote && !jobData.location.trim()) {
      errors.location = "Location is required for non-remote jobs";
    }
    
    if (!jobData.type) {
      errors.type = "Job type is required";
    }
    
    if (!jobData.experience) {
      errors.experience = "Experience level is required";
    }
    
    if (salaryVisible) {
      if (!jobData.salaryMin) {
        errors.salaryMin = "Minimum salary is required";
      }
      
      if (!jobData.salaryMax) {
        errors.salaryMax = "Maximum salary is required";
      } else if (
        Number(jobData.salaryMin) > Number(jobData.salaryMax)
      ) {
        errors.salaryMax = "Maximum salary must be greater than minimum salary";
      }
    }
    
    if (!jobData.description.trim()) {
      errors.description = "Job description is required";
    }
    
    if (!jobData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Submit form
    setSubmitStatus("loading");
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      
      // Redirect to jobs page after successful submission
      setTimeout(() => {
        router.push("/employer/jobs");
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
    }
  };
  
  const handleCancel = () => {
    // Go back to jobs list
    router.push("/employer/jobs");
  };
  
  return (
    <EmployerDashboardShell activeNavItem="jobs" userRole="employer">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Post a New Job</h1>
            </div>
            <p className="text-gray-500">Create a new job posting to find the perfect candidates</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            
            <Button
              className="bg-lime-600 text-white hover:bg-lime-700 shadow-sm"
              onClick={handleSubmit}
              disabled={submitStatus === "loading"}
            >
              {submitStatus === "loading" ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  Saving...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Published
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publish Job
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Form */}
        <Tabs 
          defaultValue="details" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Basic Details
            </TabsTrigger>
            <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Description
            </TabsTrigger>
            <TabsTrigger value="requirements" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Requirements
            </TabsTrigger>
            <TabsTrigger value="application" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Application
            </TabsTrigger>
          </TabsList>
          
          {/* Basic Details Tab */}
          <TabsContent value="details" className="space-y-6 pt-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-lime-600" />
                Job Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={jobData.title}
                    onChange={handleInputChange}
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="e.g., Engineering"
                    value={jobData.department}
                    onChange={handleInputChange}
                    className={formErrors.department ? "border-red-500" : ""}
                  />
                  {formErrors.department && (
                    <p className="text-red-500 text-sm">{formErrors.department}</p>
                  )}
                </div>
                
                <div className="space-y-3 flex flex-col">
                  <Label className="text-gray-700">
                    Remote Job
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="remote"
                      checked={isRemote}
                      onCheckedChange={setIsRemote}
                    />
                    <Label htmlFor="remote" className="font-normal text-gray-600">
                      This is a remote position
                    </Label>
                  </div>
                </div>
                
                {!isRemote && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., New York, NY"
                        value={jobData.location}
                        onChange={handleInputChange}
                        className={`pl-10 ${formErrors.location ? "border-red-500" : ""}`}
                      />
                    </div>
                    {formErrors.location && (
                      <p className="text-red-500 text-sm">{formErrors.location}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700">
                    Job Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={jobData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type" className={formErrors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-red-500 text-sm">{formErrors.type}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-gray-700">
                    Experience Level <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={jobData.experience}
                    onValueChange={(value) => handleSelectChange("experience", value)}
                  >
                    <SelectTrigger id="experience" className={formErrors.experience ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead / Manager</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.experience && (
                    <p className="text-red-500 text-sm">{formErrors.experience}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">
                    Salary Range
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="salary-visible"
                      checked={salaryVisible}
                      onCheckedChange={setSalaryVisible}
                    />
                    <Label htmlFor="salary-visible" className="font-normal text-gray-600">
                      Display salary on job post
                    </Label>
                  </div>
                </div>
                
                {salaryVisible && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin" className="text-gray-700">
                          Minimum <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="salaryMin"
                            name="salaryMin"
                            type="number"
                            placeholder="e.g., 50000"
                            value={jobData.salaryMin}
                            onChange={handleInputChange}
                            className={`pl-10 ${formErrors.salaryMin ? "border-red-500" : ""}`}
                          />
                        </div>
                        {formErrors.salaryMin && (
                          <p className="text-red-500 text-sm">{formErrors.salaryMin}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax" className="text-gray-700">
                          Maximum <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="salaryMax"
                          name="salaryMax"
                          type="number"
                          placeholder="e.g., 80000"
                          value={jobData.salaryMax}
                          onChange={handleInputChange}
                          className={formErrors.salaryMax ? "border-red-500" : ""}
                        />
                        {formErrors.salaryMax && (
                          <p className="text-red-500 text-sm">{formErrors.salaryMax}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salaryCurrency" className="text-gray-700">
                          Currency
                        </Label>
                        <Select
                          value={jobData.salaryCurrency}
                          onValueChange={(value) => handleSelectChange("salaryCurrency", value)}
                        >
                          <SelectTrigger id="salaryCurrency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salaryPeriod" className="text-gray-700">
                          Period
                        </Label>
                        <Select
                          value={jobData.salaryPeriod}
                          onValueChange={(value) => handleSelectChange("salaryPeriod", value)}
                        >
                          <SelectTrigger id="salaryPeriod">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          {/* Description Tab */}
          <TabsContent value="description" className="space-y-6 pt-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-lime-600" />
                Job Description
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Job Overview <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a general overview of the role..."
                    value={jobData.description}
                    onChange={handleInputChange}
                    className={`h-40 ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Briefly describe the position and what the candidate can expect.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities" className="text-gray-700">
                    Key Responsibilities
                  </Label>
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    placeholder="List the main responsibilities for this role..."
                    value={jobData.responsibilities}
                    onChange={handleInputChange}
                    className="h-40"
                  />
                  <p className="text-gray-500 text-sm">
                    List key tasks and responsibilities the candidate will be expected to perform.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benefits" className="text-gray-700">
                    Benefits & Perks
                  </Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    placeholder="Describe the benefits package, perks, and advantages of working in your company..."
                    value={jobData.benefits}
                    onChange={handleInputChange}
                    className="h-32"
                  />
                  <p className="text-gray-500 text-sm">
                    Highlight the benefits and perks to attract the best candidates.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6 pt-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-lime-600" />
                Requirements & Qualifications
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-gray-700">
                    Required Skills & Experience <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List required skills, qualifications, and experience..."
                    value={jobData.requirements}
                    onChange={handleInputChange}
                    className={`h-40 ${formErrors.requirements ? "border-red-500" : ""}`}
                  />
                  {formErrors.requirements && (
                    <p className="text-red-500 text-sm">{formErrors.requirements}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Specify the qualifications and skills a successful candidate must have.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-gray-700">
                    Skills (Comma-separated)
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., JavaScript, React, Node.js"
                    value={jobData.skills}
                    onChange={handleInputChange}
                  />
                  <p className="text-gray-500 text-sm">
                    Add skills to help our AI better match this job with qualified candidates.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-gray-700">
                    Education Requirements
                  </Label>
                  <Select
                    value={jobData.education}
                    onValueChange={(value) => handleSelectChange("education", value)}
                  >
                    <SelectTrigger id="education">
                      <SelectValue placeholder="Select minimum education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific requirement</SelectItem>
                      <SelectItem value="high-school">High School Diploma</SelectItem>
                      <SelectItem value="associate">Associate's Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate / PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-500 text-sm">
                    Specify the minimum education level required for this position.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Application Tab */}
          <TabsContent value="application" className="space-y-6 pt-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-lime-600" />
                Application Process
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline" className="text-gray-700">
                    Application Deadline
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="applicationDeadline"
                      name="applicationDeadline"
                      type="date"
                      value={jobData.applicationDeadline}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Leave blank if there's no specific deadline.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicationInstructions" className="text-gray-700">
                    Application Instructions
                  </Label>
                  <Textarea
                    id="applicationInstructions"
                    name="applicationInstructions"
                    placeholder="Provide any specific instructions for applicants..."
                    value={jobData.applicationInstructions}
                    onChange={handleInputChange}
                    className="h-32"
                  />
                  <p className="text-gray-500 text-sm">
                    Include any specific instructions or requirements for the application process.
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">AI Candidate Matching</h3>
                    <Button
                      variant="outline"
                      className="text-lime-700 border-lime-600 hover:bg-lime-50"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Configure AI Settings
                    </Button>
                  </div>
                  
                  <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-gray-800">
                    <p className="text-sm">
                      Our AI will automatically match this job with qualified candidates based on the job description and requirements. The more detailed information you provide, the better the matches will be.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button
                className="bg-lime-600 text-white hover:bg-lime-700 shadow-sm"
                onClick={handleSubmit}
                disabled={submitStatus === "loading"}
              >
                {submitStatus === "loading" ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                    Saving...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Published
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publish Job
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EmployerDashboardShell>
  );
} 