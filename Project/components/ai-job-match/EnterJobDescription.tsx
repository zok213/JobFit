"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Plus, 
  X, 
  ArrowRight,
  Info,
  MessageSquare,
  Sparkles,
  Bot
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type JobFunction = {
  id: string;
  name: string;
  category: string;
  technical?: boolean;
  relatedFunctions?: string[]; // ids of related job functions
};

type JobCategory = {
  id: string;
  name: string;
};

export function EnterJobDescription() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "full-time",
    location: "",
    isRemote: false,
  });

  // Job categories for better organization
  const jobCategories: JobCategory[] = [
    { id: "tech", name: "Technology" },
    { id: "design", name: "Design" },
    { id: "management", name: "Management" },
    { id: "marketing", name: "Marketing & Sales" },
    { id: "finance", name: "Finance" },
    { id: "hr", name: "Human Resources" },
    { id: "other", name: "Other" }
  ];
  
  // Active category filter
  const [activeCategory, setActiveCategory] = useState<string>("tech");

  const [selectedFunctions, setSelectedFunctions] = useState<JobFunction[]>([]);
  
  // Extended job functions list, organized by categories
  const [allJobFunctions] = useState<JobFunction[]>([
    // Technology category
    { id: "be", name: "Backend Engineer", category: "tech", technical: true, relatedFunctions: ["fullstack", "devops", "swe", "node", "java", "python"] },
    { id: "fe", name: "Frontend Engineer", category: "tech", technical: true, relatedFunctions: ["fullstack", "ui", "react", "angular", "vue", "swe"] },
    { id: "fullstack", name: "Full Stack Engineer", category: "tech", technical: true, relatedFunctions: ["be", "fe", "swe", "node", "react"] },
    { id: "ds", name: "Data Scientist", category: "tech", technical: true, relatedFunctions: ["ml", "de", "stats", "python", "ai"] },
    { id: "ml", name: "Machine Learning Engineer", category: "tech", technical: true, relatedFunctions: ["ds", "ai", "python", "stats"] },
    { id: "ai", name: "AI Engineer", category: "tech", technical: true, relatedFunctions: ["ml", "ds", "nlp", "cv"] },
    { id: "devops", name: "DevOps Engineer", category: "tech", technical: true, relatedFunctions: ["sre", "be", "cloud", "infra"] },
    { id: "sre", name: "Site Reliability Engineer", category: "tech", technical: true, relatedFunctions: ["devops", "infra", "cloud"] },
    { id: "cpp", name: "C++ Engineer", category: "tech", technical: true, relatedFunctions: ["embedded", "swe", "systems"] },
    { id: "mobile", name: "Mobile Developer", category: "tech", technical: true, relatedFunctions: ["ios", "android", "react", "flutter"] },
    { id: "cloud", name: "Cloud Engineer", category: "tech", technical: true, relatedFunctions: ["devops", "sre", "aws", "azure", "gcp"] },
    { id: "de", name: "Data Engineer", category: "tech", technical: true, relatedFunctions: ["ds", "etl", "sql"] },
    { id: "qa", name: "QA Engineer", category: "tech", technical: true, relatedFunctions: ["swe", "automation", "testing"] },
    { id: "swe", name: "Software Engineer", category: "tech", technical: true, relatedFunctions: ["be", "fe", "fullstack"] },
    { id: "security", name: "Security Engineer", category: "tech", technical: true, relatedFunctions: ["devops", "sre", "infra"] },
    { id: "embedded", name: "Embedded Systems Engineer", category: "tech", technical: true, relatedFunctions: ["cpp", "iot", "firmware"] },
    { id: "ios", name: "iOS Developer", category: "tech", technical: true, relatedFunctions: ["mobile", "swift"] },
    { id: "android", name: "Android Developer", category: "tech", technical: true, relatedFunctions: ["mobile", "kotlin", "java"] },
    { id: "infra", name: "Infrastructure Engineer", category: "tech", technical: true, relatedFunctions: ["devops", "sre", "cloud"] },
    
    // Design category  
    { id: "ui", name: "UI/UX Designer", category: "design", relatedFunctions: ["product", "fe", "ux"] },
    { id: "ux", name: "UX Researcher", category: "design", relatedFunctions: ["ui", "product"] },
    { id: "graphic", name: "Graphic Designer", category: "design", relatedFunctions: ["ui", "visual"] },
    { id: "visual", name: "Visual Designer", category: "design", relatedFunctions: ["ui", "graphic"] },
    { id: "product_design", name: "Product Designer", category: "design", relatedFunctions: ["ui", "ux", "product"] },
    
    // Management category
    { id: "product", name: "Product Manager", category: "management", relatedFunctions: ["ui", "ux", "project"] },
    { id: "project", name: "Project Manager", category: "management", relatedFunctions: ["product", "program"] },
    { id: "program", name: "Program Manager", category: "management", relatedFunctions: ["product", "project"] },
    { id: "engineering_manager", name: "Engineering Manager", category: "management", relatedFunctions: ["swe", "tech_lead"] },
    { id: "tech_lead", name: "Technical Lead", category: "management", technical: true, relatedFunctions: ["swe", "engineering_manager"] },
    { id: "cto", name: "Chief Technology Officer", category: "management", relatedFunctions: ["engineering_manager", "tech_lead"] },
    
    // Marketing & Sales
    { id: "marketing", name: "Marketing Specialist", category: "marketing", relatedFunctions: ["content", "social"] },
    { id: "content", name: "Content Writer", category: "marketing", relatedFunctions: ["marketing", "social"] },
    { id: "social", name: "Social Media Manager", category: "marketing", relatedFunctions: ["marketing", "content"] },
    { id: "sales", name: "Sales Representative", category: "marketing", relatedFunctions: ["account", "business"] },
    { id: "account", name: "Account Manager", category: "marketing", relatedFunctions: ["sales", "business"] },
    { id: "business", name: "Business Development", category: "marketing", relatedFunctions: ["sales", "account"] },
    
    // Finance
    { id: "financial_analyst", name: "Financial Analyst", category: "finance", relatedFunctions: ["accountant"] },
    { id: "accountant", name: "Accountant", category: "finance", relatedFunctions: ["financial_analyst"] },
    { id: "cfo", name: "Chief Financial Officer", category: "finance", relatedFunctions: ["financial_analyst", "accountant"] },
    
    // HR
    { id: "recruiter", name: "Recruiter", category: "hr", relatedFunctions: ["hr_manager"] },
    { id: "hr_manager", name: "HR Manager", category: "hr", relatedFunctions: ["recruiter"] },
    
    // Other
    { id: "customer_support", name: "Customer Support", category: "other", relatedFunctions: [] },
    { id: "operations", name: "Operations Manager", category: "other", relatedFunctions: [] }
  ]);
  
  const [availableFunctions, setAvailableFunctions] = useState<JobFunction[]>(
    allJobFunctions.filter(fn => fn.category === "tech")
  );
  
  // State for showing related technical functions
  const [showRelatedFunctions, setShowRelatedFunctions] = useState<boolean>(false);
  const [relatedFunctions, setRelatedFunctions] = useState<JobFunction[]>([]);
  
  // Modal state
  const [showExistingDataModal, setShowExistingDataModal] = useState(false);
  const [isUsingExistingData, setIsUsingExistingData] = useState(false);
  
  // AI Bot state
  const [showAIBot, setShowAIBot] = useState(false);
  const [aiMessage, setAIMessage] = useState("Hi there! I can help you find better job matches. Ask me about optimizing your job search, understanding company requirements, or tailoring your CV.");
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender: 'ai' | 'user', message: string}[]>([
    {sender: 'ai', message: "Hi there! I can help you find better job matches. Ask me about optimizing your job search, understanding company requirements, or tailoring your CV."}
  ]);

  // Previous job search data
  const previousJobSearches = [
    {
      id: "prev-1",
      jobTitle: "Senior Frontend Engineer",
      jobType: "full-time",
      location: "San Francisco, CA",
      isRemote: true,
      functions: [allJobFunctions.find(f => f.id === "fe")!]
    },
    {
      id: "prev-2",
      jobTitle: "Full Stack Developer",
      jobType: "full-time",
      location: "New York, NY",
      isRemote: false,
      functions: [allJobFunctions.find(f => f.id === "fullstack")!]
    }
  ];

  const jobTypes = [
    { id: "full-time", label: "Full-time" },
    { id: "contract", label: "Contract" },
    { id: "part-time", label: "Part-time" },
    { id: "internship", label: "Internship" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleJobType = (typeId: string) => {
    setFormData((prev) => ({ ...prev, jobType: typeId }));
  };

  const toggleRemote = () => {
    setFormData((prev) => ({ ...prev, isRemote: !prev.isRemote }));
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const categoryFunctions = allJobFunctions.filter(
      fn => fn.category === categoryId && !selectedFunctions.some(sf => sf.id === fn.id)
    );
    setAvailableFunctions(categoryFunctions);
    setShowRelatedFunctions(false);
  };

  const addJobFunction = (jobFunction: JobFunction) => {
    // First check if the function is already selected to prevent duplicates
    if (selectedFunctions.some(fn => fn.id === jobFunction.id)) {
      return;
    }
    
    setSelectedFunctions((prev) => [...prev, jobFunction]);
    
    // Remove the function from available functions
    setAvailableFunctions((prev) => 
      prev.filter((f) => f.id !== jobFunction.id)
    );
    
    // Also remove this function from related functions if it's there
    if (showRelatedFunctions) {
      setRelatedFunctions((prev) => 
        prev.filter((f) => f.id !== jobFunction.id)
      );
      
      // Hide the related section if empty
      if (relatedFunctions.length <= 1) {
        setShowRelatedFunctions(false);
      }
    }
    
    // If the function has related technical functions, show them
    if (jobFunction.technical && jobFunction.relatedFunctions && jobFunction.relatedFunctions.length > 0) {
      const related = allJobFunctions.filter(
        fn => jobFunction.relatedFunctions!.includes(fn.id) && 
        !selectedFunctions.some(sf => sf.id === fn.id) &&
        fn.id !== jobFunction.id &&
        // This ensures we don't show functions that are already in the related functions list
        !relatedFunctions.some(rf => rf.id === fn.id)
      );
      
      if (related.length > 0) {
        setRelatedFunctions(related);
        setShowRelatedFunctions(true);
      }
    }
  };

  const removeJobFunction = (jobFunction: JobFunction) => {
    setSelectedFunctions((prev) => 
      prev.filter((f) => f.id !== jobFunction.id)
    );
    
    // Add back to the available functions if it matches current category
    if (jobFunction.category === activeCategory) {
      setAvailableFunctions(prev => [...prev, jobFunction].sort((a, b) => a.name.localeCompare(b.name)));
    }
    
    // Reset related functions display if no technical functions are selected
    if (showRelatedFunctions) {
      const stillHasTechnical = selectedFunctions
        .filter(f => f.id !== jobFunction.id)
        .some(f => f.technical);
        
      if (!stillHasTechnical) {
        setShowRelatedFunctions(false);
      }
    }
  };

  const handleNext = () => {
    // Store form data in localStorage or context if needed
    router.push("/job-match/upload-cv");
  };

  const handleUseExistingData = () => {
    setShowExistingDataModal(true);
  };

  const handleLoadExistingData = (jobSearch: typeof previousJobSearches[0]) => {
    // Update form data with existing data
    setFormData({
      jobTitle: jobSearch.jobTitle,
      jobType: jobSearch.jobType,
      location: jobSearch.location,
      isRemote: jobSearch.isRemote
    });
    
    // Update selected job functions
    const newSelectedFunctions = [...jobSearch.functions];
    setSelectedFunctions(newSelectedFunctions);
    
    // Update available functions
    setAvailableFunctions((prev) => 
      prev.filter((f) => !newSelectedFunctions.some(s => s.id === f.id))
    );
    
    setIsUsingExistingData(true);
    setShowExistingDataModal(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="relative">
      {/* AI Bot floating button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={() => setShowAIBot(!showAIBot)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-lime-300 text-black shadow-lg hover:bg-lime-200 transition-all"
          aria-label="Open AI assistant"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>

      {/* AI Bot chat window */}
      {showAIBot && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden flex flex-col max-h-[500px]">
          <div className="bg-lime-300 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-black" />
              <h3 className="font-bold text-black">JobFit AI Assistant</h3>
            </div>
            <button 
              onClick={() => setShowAIBot(false)}
              className="text-black/70 hover:text-black"
              aria-label="Close AI assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 max-h-[350px]">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user' 
                      ? 'bg-lime-100 text-black' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask about job requirements..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userMessage.trim()) {
                    e.preventDefault();
                    // Add user message to chat
                    setChatHistory(prev => [...prev, {sender: 'user', message: userMessage}]);
                    // In a real app, you'd call an AI service here
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, {
                        sender: 'ai', 
                        message: `Thanks for your question about "${userMessage}". This is where the AI would provide a helpful answer to improve your job matching experience.`
                      }]);
                    }, 500);
                    setUserMessage("");
                  }
                }}
                className="h-10"
              />
              <Button 
                onClick={() => {
                  if (userMessage.trim()) {
                    // Add user message to chat
                    setChatHistory(prev => [...prev, {sender: 'user', message: userMessage}]);
                    // In a real app, you'd call an AI service here
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, {
                        sender: 'ai', 
                        message: `Thanks for your question about "${userMessage}". This is where the AI would provide a helpful answer to improve your job matching experience.`
                      }]);
                    }, 500);
                    setUserMessage("");
                  }
                }}
                className="bg-black text-lime-300 h-10 px-3"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
        >
          {/* Existing Data Modal */}
          {showExistingDataModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Use Existing Data</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full" 
                    onClick={() => setShowExistingDataModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">Select from your previous job searches:</p>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
                  {previousJobSearches.map((jobSearch) => (
                    <div 
                      key={jobSearch.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-lime-300 hover:bg-lime-50 cursor-pointer transition-all"
                      onClick={() => handleLoadExistingData(jobSearch)}
                    >
                      <div className="font-medium text-black">{jobSearch.jobTitle}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                          {jobSearch.jobType}
                        </span>
                        <span>
                          {jobSearch.location} {jobSearch.isRemote && "• Remote"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {jobSearch.functions.map(func => (
                          <Badge key={func.id} variant="outline" className="bg-gray-50">
                            {func.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowExistingDataModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-black">Find your perfect job match</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Tell us what you're looking for and we'll find the best matches for your skills and preferences</p>
          </motion.div>
          
          {/* Show banner when using existing data */}
          {isUsingExistingData && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6 flex items-center"
            >
              <div className="w-10 h-10 rounded-full bg-lime-200 flex items-center justify-center mr-4">
                <Check className="h-5 w-5 text-lime-700" />
              </div>
              <div>
                <h3 className="font-medium text-black">Using existing data</h3>
                <p className="text-sm text-gray-700">
                  We found a job search on your profile
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-gray-700"
                onClick={() => {
                  setFormData({
                    jobTitle: "",
                    jobType: "full-time",
                    location: "",
                    isRemote: false,
                  });
                  setSelectedFunctions([]);
                  setIsUsingExistingData(false);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </motion.div>
          )}
          
          <motion.div variants={containerVariants} className="space-y-8">
            {/* Job Title */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                <span className="text-red-500">*</span> Job Title
              </label>
              <Input 
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Enter your expected job title"
                className="border-gray-200 focus-visible:ring-lime-300 h-12 transition-all shadow-sm"
              />
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-black hover:bg-gray-100 transition-all">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </motion.div>
            
            {/* Job Function */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                <span className="text-red-500">*</span> Job Function (select from options below for best results)
              </label>
              
              {/* Selected functions */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedFunctions.map((func) => (
                  <motion.div
                    key={func.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge 
                      className="bg-lime-100 text-black border-lime-200 hover:bg-lime-200 transition-all flex items-center gap-1 px-3 py-1.5 h-8 group"
                    >
                      {func.name}
                      <button 
                        onClick={() => removeJobFunction(func)} 
                        className="ml-1 text-gray-500 group-hover:text-black transition-colors rounded-full hover:bg-lime-300 p-0.5"
                        aria-label={`Remove ${func.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
              
              {selectedFunctions.length === 0 && (
                <p className="text-xs text-gray-500 italic">Please select your desired job function</p>
              )}
              
              {/* Category tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-hide">
                  {jobCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-2 text-sm rounded-t-md transition-colors flex-shrink-0 ${
                        activeCategory === category.id
                          ? "bg-lime-100 text-lime-800 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Job function options */}
              <div>
                {/* Main available functions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableFunctions.map((func) => (
                    <Button 
                      key={func.id} 
                      variant="outline" 
                      className="h-10 border-gray-200 hover:border-lime-300 hover:bg-lime-50 active:bg-lime-100 active:border-lime-400 transition-all shadow-sm"
                      onClick={() => addJobFunction(func)}
                    >
                      {func.name}
                    </Button>
                  ))}
                  
                  {availableFunctions.length === 0 && (
                    <p className="text-sm text-gray-500 py-2">
                      No more job functions available in this category. Try another category or clear some selections.
                    </p>
                  )}
                </div>
                
                {/* Related technical functions section */}
                {showRelatedFunctions && relatedFunctions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                  >
                    <div className="font-medium text-blue-800 text-sm mb-2">Related Technical Functions</div>
                    <div className="flex flex-wrap gap-2">
                      {relatedFunctions.map((func) => (
                        <Button 
                          key={func.id} 
                          variant="outline" 
                          className="h-9 bg-white border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 active:bg-blue-100 transition-all shadow-sm text-xs"
                          onClick={() => addJobFunction(func)}
                        >
                          {func.name}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Job Type */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
                <span className="text-red-500">*</span> Job Type
              </label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <Button 
                    key={type.id} 
                    variant={formData.jobType === type.id ? "default" : "outline"}
                    className={
                      formData.jobType === type.id 
                        ? "bg-lime-300 text-black hover:bg-lime-400 hover:text-black border-lime-300 transition-all shadow-sm" 
                        : "border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50 transition-all shadow-sm"
                    }
                    onClick={() => toggleJobType(type.id)}
                  >
                    {formData.jobType === type.id && <Check className="h-3 w-3 mr-1.5" />}
                    {type.label}
                  </Button>
                ))}
              </div>
            </motion.div>
            
            {/* Location */}
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State or Region"
                className="border-gray-200 focus-visible:ring-lime-300 h-12 transition-all shadow-sm"
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox 
                  id="isRemote" 
                  checked={formData.isRemote}
                  onCheckedChange={toggleRemote}
                  className="data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 transition-all"
                />
                <label 
                  htmlFor="isRemote" 
                  className="text-sm text-gray-700 cursor-pointer flex items-center"
                >
                  Open to Remote
                  <div className="relative group">
                    <span className="inline-flex items-center justify-center w-4 h-4 ml-1 bg-gray-200 rounded-full text-xs text-gray-700 cursor-help">?</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Indicate if you're open to remote work opportunities
                    </div>
                  </div>
                </label>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between mt-12 gap-4"
          >
            <Button 
              variant="outline" 
              className="bg-lime-100 border-lime-300 text-black hover:bg-lime-200 transition-all shadow-sm"
              onClick={handleUseExistingData}
            >
              Use Existing Data
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-black hover:bg-gray-800 text-lime-300 font-medium gap-2"
              disabled={formData.jobTitle === "" || selectedFunctions.length === 0}
            >
              Continue to CV Upload
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 pt-2 text-center">
            <p className="flex items-center justify-center text-xs text-gray-500">
              <Info className="h-3 w-3 mr-1" />
              <span>Adding your CV in the next step will improve match accuracy</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 