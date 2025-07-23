"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronDown, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  Briefcase,
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  employer: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
  isCurrentJob?: boolean;
}

interface EmploymentHistorySectionProps {
  data: Job[];
  updateData: (data: Job[]) => void;
}

export function EmploymentHistorySection({ data, updateData }: EmploymentHistorySectionProps) {
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<Job>({
    id: "",
    title: "",
    employer: "",
    startDate: "",
    endDate: "",
    city: "",
    description: "",
    isCurrentJob: false
  });
  
  const addNewJob = () => {
    // Reset the new job form and show it
    setNewJob({
      id: `job-${Date.now()}`,
      title: "",
      employer: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
      isCurrentJob: false
    });
    setIsAddingJob(true);
    setEditingJobId(null);
  };
  
  const editJob = (job: Job) => {
    setNewJob({ ...job });
    setEditingJobId(job.id);
    setIsAddingJob(true);
  };
  
  const deleteJob = (jobId: string) => {
    updateData(data.filter(job => job.id !== jobId));
  };
  
  const handleJobInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCurrentJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewJob(prev => ({
      ...prev,
      isCurrentJob: e.target.checked,
      endDate: e.target.checked ? "" : prev.endDate
    }));
  };
  
  const saveJob = () => {
    if (editingJobId) {
      // Update existing job
      updateData(data.map(job => job.id === editingJobId ? newJob : job));
    } else {
      // Add new job
      updateData([...data, newJob]);
    }
    setIsAddingJob(false);
    setEditingJobId(null);
  };
  
  const cancelEdit = () => {
    setIsAddingJob(false);
    setEditingJobId(null);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Employment History</CardTitle>
        <CardDescription>
          Show your relevant experience (last 10 years). Use bullet points to note your achievements. 
          Include numbers/facts where possible.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* List of jobs */}
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map(job => (
              <div 
                key={job.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{job.title}</h3>
                    <div className="text-gray-600">
                      {job.employer}
                      {job.city && `, ${job.city}`}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {job.startDate} — {job.isCurrentJob ? "Present" : job.endDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-gray-200"
                      onClick={() => editJob(job)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                      onClick={() => deleteJob(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {job.description && (
                  <div className="mt-3 border-t border-gray-100 pt-3 text-gray-700">
                    <p>{job.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No work experience added yet</p>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={addNewJob}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first job
            </Button>
          </div>
        )}
        
        {/* Job form */}
        {isAddingJob && (
          <div className="border border-gray-200 rounded-lg p-5 mt-4 bg-gray-50">
            <h3 className="font-medium text-lg mb-4">
              {editingJobId ? "Edit Job" : "Add Job"}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newJob.title} 
                    onChange={handleJobInputChange} 
                    placeholder="e.g. Software Engineer"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input 
                    id="employer" 
                    name="employer" 
                    value={newJob.employer} 
                    onChange={handleJobInputChange} 
                    placeholder="e.g. Google"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={newJob.city} 
                    onChange={handleJobInputChange} 
                    placeholder="e.g. San Francisco"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Input 
                      type="text"
                      id="startDate" 
                      name="startDate" 
                      value={newJob.startDate} 
                      onChange={handleJobInputChange} 
                      placeholder="MM / YYYY"
                      className="h-11"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="currentJob" 
                        checked={newJob.isCurrentJob} 
                        onChange={handleCurrentJobChange} 
                        className="mr-2"
                      />
                      <Label htmlFor="currentJob" className="text-sm font-normal cursor-pointer">
                        Current Job
                      </Label>
                    </div>
                  </div>
                  <div className="relative">
                    <Input 
                      type="text"
                      id="endDate" 
                      name="endDate" 
                      value={newJob.isCurrentJob ? "" : newJob.endDate} 
                      onChange={handleJobInputChange} 
                      placeholder="MM / YYYY"
                      disabled={newJob.isCurrentJob}
                      className="h-11"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                
                {/* Basic text formatting toolbar */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-t-md p-1.5 bg-white">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded hover:bg-gray-100"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded hover:bg-gray-100"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded hover:bg-gray-100"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </Button>
                  
                  <div className="h-5 w-px bg-gray-200 mx-1"></div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded hover:bg-gray-100"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded hover:bg-gray-100"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleJobInputChange}
                  placeholder="e.g. Created and implemented lesson plans based on child-led interests and curiosities."
                  className="w-full h-28 p-3 border border-gray-200 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={saveJob}
                  disabled={!newJob.title || !newJob.employer || !newJob.startDate}
                >
                  {editingJobId ? "Save Changes" : "Add Job"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add job button */}
        {!isAddingJob && data.length > 0 && (
          <Button 
            variant="outline" 
            className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={addNewJob}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add one more job
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 