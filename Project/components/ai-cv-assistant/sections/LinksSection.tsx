"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon,
  Linkedin, 
  Github, 
  Globe, 
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Edit
} from "lucide-react";

interface LinkItem {
  id: string;
  label: string;
  url: string;
  type: string;
}

interface LinksSectionProps {
  data: LinkItem[];
  updateData: (data: LinkItem[]) => void;
}

export function LinksSection({ data, updateData }: LinksSectionProps) {
  const [newLink, setNewLink] = useState<LinkItem>({
    id: "",
    label: "",
    url: "",
    type: "website"
  });
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  
  const linkTypes = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "bg-blue-50 text-blue-600" },
    { id: "github", label: "GitHub", icon: Github, color: "bg-gray-50 text-gray-700" },
    { id: "website", label: "Portfolio", icon: Globe, color: "bg-purple-50 text-purple-600" },
    { id: "twitter", label: "Twitter", icon: Twitter, color: "bg-sky-50 text-sky-500" },
    { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-pink-50 text-pink-600" },
    { id: "youtube", label: "YouTube", icon: Youtube, color: "bg-red-50 text-red-600" },
    { id: "facebook", label: "Facebook", icon: Facebook, color: "bg-indigo-50 text-indigo-600" },
    { id: "other", label: "Other", icon: LinkIcon, color: "bg-green-50 text-green-600" }
  ];
  
  const getIconByType = (type: string) => {
    const linkType = linkTypes.find(lt => lt.id === type);
    if (linkType) {
      const Icon = linkType.icon;
      return (
        <div className={`p-2 rounded-full ${linkType.color.split(' ')[0]} ${linkType.color.split(' ')[1]}`}>
          <Icon className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-full bg-gray-100 text-gray-600">
        <LinkIcon className="h-4 w-4" />
      </div>
    );
  };
  
  const addNewLink = () => {
    setNewLink({
      id: `link-${Date.now()}`,
      label: "",
      url: "",
      type: "website"
    });
    setIsAddingLink(true);
    setEditingLinkId(null);
  };
  
  const editLink = (link: LinkItem) => {
    setNewLink({ ...link });
    setEditingLinkId(link.id);
    setIsAddingLink(true);
  };
  
  const deleteLink = (linkId: string) => {
    updateData(data.filter(link => link.id !== linkId));
  };
  
  const handleLinkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLink(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLinkTypeChange = (type: string) => {
    setNewLink(prev => ({
      ...prev,
      type,
      label: linkTypes.find(lt => lt.id === type)?.label || ""
    }));
  };
  
  const saveLink = () => {
    // Basic URL validation
    if (!newLink.url.includes('.') || (!newLink.url.startsWith('http://') && !newLink.url.startsWith('https://'))) {
      newLink.url = `https://${newLink.url}`;
    }
    
    if (editingLinkId) {
      // Update existing link
      updateData(data.map(link => link.id === editingLinkId ? newLink : link));
    } else {
      // Add new link
      updateData([...data, newLink]);
    }
    setIsAddingLink(false);
    setEditingLinkId(null);
  };
  
  const cancelEdit = () => {
    setIsAddingLink(false);
    setEditingLinkId(null);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Websites & Social Links</CardTitle>
        <CardDescription>
          You can add links to websites you want hiring managers to see! Perhaps It will be a link to your portfolio, LinkedIn profile, or personal website.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* List of links */}
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map(link => (
              <div 
                key={link.id} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getIconByType(link.type)}
                  
                  <div>
                    <div className="font-medium">{link.label}</div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-600 hover:underline truncate max-w-xs block"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-gray-200"
                    onClick={() => editLink(link)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <LinkIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No links added yet</p>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={addNewLink}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first link
            </Button>
          </div>
        )}
        
        {/* Link form */}
        {isAddingLink && (
          <div className="border border-gray-200 rounded-lg p-5 mt-4 bg-gray-50">
            <h3 className="font-medium text-lg mb-4">
              {editingLinkId ? "Edit Link" : "Add Link"}
            </h3>
            
            <div className="space-y-4">
              {/* Link type selector */}
              <div>
                <Label className="mb-2 block">Link Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {linkTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleLinkTypeChange(type.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                        newLink.type === type.id 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className={`p-2 rounded-full ${type.color.split(' ')[0]} ${type.color.split(' ')[1]}`}>
                        <type.icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input 
                  id="label" 
                  name="label" 
                  value={newLink.label} 
                  onChange={handleLinkInputChange} 
                  placeholder="e.g. My Portfolio"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  name="url" 
                  value={newLink.url} 
                  onChange={handleLinkInputChange} 
                  placeholder="https://example.com"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Include http:// or https:// in your URL
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={saveLink}
                  disabled={!newLink.label || !newLink.url}
                >
                  {editingLinkId ? "Save Changes" : "Add Link"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add link button */}
        {!isAddingLink && data.length > 0 && (
          <Button 
            variant="outline" 
            className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={addNewLink}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add one more link
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 