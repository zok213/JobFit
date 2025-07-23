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
  GraduationCap
} from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
  isCurrentlyStudying?: boolean;
}

interface EducationSectionProps {
  data: Education[];
  updateData: (data: Education[]) => void;
}

export function EducationSection({ data, updateData }: EducationSectionProps) {
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    id: "",
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    city: "",
    description: "",
    isCurrentlyStudying: false
  });
  
  const addNewEducation = () => {
    // Reset the new education form and show it
    setNewEducation({
      id: `edu-${Date.now()}`,
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
      isCurrentlyStudying: false
    });
    setIsAddingEducation(true);
    setEditingEducationId(null);
  };
  
  const editEducation = (education: Education) => {
    setNewEducation({ ...education });
    setEditingEducationId(education.id);
    setIsAddingEducation(true);
  };
  
  const deleteEducation = (educationId: string) => {
    updateData(data.filter(edu => edu.id !== educationId));
  };
  
  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCurrentlyStudyingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEducation(prev => ({
      ...prev,
      isCurrentlyStudying: e.target.checked,
      endDate: e.target.checked ? "" : prev.endDate
    }));
  };
  
  const saveEducation = () => {
    if (editingEducationId) {
      // Update existing education
      updateData(data.map(edu => edu.id === editingEducationId ? newEducation : edu));
    } else {
      // Add new education
      updateData([...data, newEducation]);
    }
    setIsAddingEducation(false);
    setEditingEducationId(null);
  };
  
  const cancelEdit = () => {
    setIsAddingEducation(false);
    setEditingEducationId(null);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Education</CardTitle>
        <CardDescription>
          A varied education on your resume sums up the value that your learnings and background will bring to job.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* List of education entries */}
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map(education => (
              <div 
                key={education.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{education.school}</h3>
                    <div className="text-gray-600">
                      {education.degree}{education.field ? `, ${education.field}` : ""}
                      {education.city && `, ${education.city}`}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {education.startDate} — {education.isCurrentlyStudying ? "Present" : education.endDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-gray-200"
                      onClick={() => editEducation(education)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                      onClick={() => deleteEducation(education.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {education.description && (
                  <div className="mt-3 border-t border-gray-100 pt-3 text-gray-700">
                    <p>{education.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No education added yet</p>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={addNewEducation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first education
            </Button>
          </div>
        )}
        
        {/* Education form */}
        {isAddingEducation && (
          <div className="border border-gray-200 rounded-lg p-5 mt-4 bg-gray-50">
            <h3 className="font-medium text-lg mb-4">
              {editingEducationId ? "Edit Education" : "Add Education"}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input 
                    id="school" 
                    name="school" 
                    value={newEducation.school} 
                    onChange={handleEducationInputChange} 
                    placeholder="e.g. Stanford University"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={newEducation.city} 
                    onChange={handleEducationInputChange} 
                    placeholder="e.g. Stanford, CA"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input 
                    id="degree" 
                    name="degree" 
                    value={newEducation.degree} 
                    onChange={handleEducationInputChange} 
                    placeholder="e.g. Bachelor's"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input 
                    id="field" 
                    name="field" 
                    value={newEducation.field} 
                    onChange={handleEducationInputChange} 
                    placeholder="e.g. Computer Science"
                    className="h-11"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Input 
                      type="text"
                      id="startDate" 
                      name="startDate" 
                      value={newEducation.startDate} 
                      onChange={handleEducationInputChange} 
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
                        id="currentlyStudying" 
                        checked={newEducation.isCurrentlyStudying} 
                        onChange={handleCurrentlyStudyingChange} 
                        className="mr-2"
                      />
                      <Label htmlFor="currentlyStudying" className="text-sm font-normal cursor-pointer">
                        Currently Studying
                      </Label>
                    </div>
                  </div>
                  <div className="relative">
                    <Input 
                      type="text"
                      id="endDate" 
                      name="endDate" 
                      value={newEducation.isCurrentlyStudying ? "" : newEducation.endDate} 
                      onChange={handleEducationInputChange} 
                      placeholder="MM / YYYY"
                      disabled={newEducation.isCurrentlyStudying}
                      className="h-11"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  name="description"
                  value={newEducation.description}
                  onChange={handleEducationInputChange}
                  placeholder="e.g. Activities and societies, achievements, projects, etc."
                  className="w-full h-28 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={saveEducation}
                  disabled={!newEducation.school || !newEducation.degree || !newEducation.startDate}
                >
                  {editingEducationId ? "Save Changes" : "Add Education"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add education button */}
        {!isAddingEducation && data.length > 0 && (
          <Button 
            variant="outline" 
            className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={addNewEducation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add one more education
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 