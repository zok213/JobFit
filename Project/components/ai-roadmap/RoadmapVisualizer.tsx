"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Code, Brain, Award, BarChart, Clock, ChevronRight, 
  CheckCircle2, ChevronsUpDown, Share2, Download, Save, Lightbulb, FileText,
  ArrowRight, Info, Sparkles, Target, Search, BookMarked, Zap, Star, ChevronsDown, X, ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

type SkillItem = {
  name: string;
  level: number; // 0-100
  type: 'technical' | 'soft' | 'domain';
};

type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  estimatedDuration: string;
  skills: SkillItem[];
  resources: {
    title: string;
    link: string;
    type: 'course' | 'book' | 'documentation' | 'video' | 'project';
  }[];
  milestones: {
    title: string;
    completed: boolean;
  }[];
  type: 'learning' | 'project' | 'certification' | 'experience';
};

interface RoadmapVisualizerProps {
  roadmapTitle: string;
  steps: RoadmapStep[];
  currentProgress?: number; // 0-100
}

const RoadmapButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  className,
  disabled = false,
  ...props 
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-black text-lime-300 hover:bg-gray-800 shadow-sm",
    secondary: "bg-lime-300 text-black hover:bg-lime-200",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    default: "bg-black text-lime-300 hover:bg-gray-800 shadow-sm" // Same as primary for consistency
  };
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 rounded",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export function RoadmapVisualizer({ 
  roadmapTitle, 
  steps,
  currentProgress = 0
}: RoadmapVisualizerProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(steps[0]?.id || null);
  const [activeView, setActiveView] = useState<'timeline' | 'network' | 'skills' | 'resources'>('network');
  const [progressFilter, setProgressFilter] = useState<'all' | 'completed' | 'upcoming'>('all');
  const [selectedInfoPanel, setSelectedInfoPanel] = useState<string | null>(null);
  const [animateProgress, setAnimateProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [infoPanelPosition, setInfoPanelPosition] = useState({ top: 0, left: 0 });
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [sampleStep, setSampleStep] = useState<RoadmapStep | null>(null);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(currentProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentProgress]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (steps.length > 0 && !sampleStep) {
      setSampleStep(steps[0]);
    }
  }, [steps, sampleStep]);

  const calculateInfoPanelPosition = (stepId: string) => {
    const nodeElement = nodeRefs.current.get(stepId);
    if (!nodeElement) return { top: 0, left: 0 };
    
    const rect = nodeElement.getBoundingClientRect();
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    if (windowWidth < 768) {
      // Position panel below the node on mobile
      return { 
        top: rect.bottom + scrollPosition + 10,
        left: Math.max(16, rect.left - rect.width / 2) 
      };
    } else {
      // Position panel to the right of the node on desktop - tight next to the node
      return { 
        top: rect.top + scrollPosition, // Align with the top of the node
        left: rect.right + 10 // Position right next to the node with minimal gap
      };
    }
  };

  const toggleStep = (stepId: string, e?: React.MouseEvent<HTMLElement>) => {
    if (expandedStepId === stepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(stepId);
    }
  };

  const handleNodeClick = (stepId: string, e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();

    // Calculate position before updating state to ensure proper positioning
    if (nodeRefs.current.has(stepId)) {
      const position = calculateInfoPanelPosition(stepId);
      setInfoPanelPosition(position);
    }

    if (selectedInfoPanel === stepId) {
      setSelectedInfoPanel(null);
    } else {
      setSelectedInfoPanel(stepId);
    }
  };

  const getStepIcon = (type: RoadmapStep['type'], isSmall: boolean = false) => {
    const size = isSmall ? "h-3.5 w-3.5" : "h-7 w-7";
    switch (type) {
      case 'learning':
        return <BookOpen className={size} />;
      case 'project':
        return <Code className={size} />;
      case 'certification':
        return <Award className={size} />;
      case 'experience':
        return <Brain className={size} />;
      default:
        return <Lightbulb className={size} />;
    }
  };

  const getTypeColor = (type: RoadmapStep['type']) => {
    switch (type) {
      case 'learning':
        return 'bg-blue-100 text-blue-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'certification':
        return 'bg-purple-100 text-purple-800';
      case 'experience':
        return 'bg-amber-100 text-amber-800 font-medium';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get progress status
  const isStepComplete = (index: number) => {
    const stepProgress = ((index + 1) / steps.length) * 100;
    return currentProgress >= stepProgress;
  };

  // Filter steps based on progress
  const filteredSteps = steps.filter((step, index) => {
    if (progressFilter === 'all') return true;
    if (progressFilter === 'completed') return isStepComplete(index);
    if (progressFilter === 'upcoming') return !isStepComplete(index);
    return true;
  });

  const allSkills = steps.flatMap(step => step.skills);
  const uniqueSkills = Array.from(new Set(allSkills.map(skill => skill.name)))
    .map(name => {
      const matchingSkills = allSkills.filter(s => s.name === name);
      const highestLevel = Math.max(...matchingSkills.map(s => s.level));
      return {
        name,
        level: highestLevel,
        type: matchingSkills[0].type
      };
    })
    .sort((a, b) => b.level - a.level);

  const allResources = steps.flatMap(step => step.resources);

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {roadmapTitle}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Badge className="bg-lime-100 text-black ml-2 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Generated</span>
              </Badge>
            </motion.div>
          </h1>
          <div className="flex items-center mt-2">
            <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
              <motion.div 
                className="h-full bg-gradient-to-r from-lime-300 to-lime-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${animateProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-medium flex items-center">
              <span className="text-lime-600 font-semibold">{Math.round(currentProgress)}%</span>
              <span className="text-gray-500 ml-1">complete</span>
            </span>
          </div>
        </div>
        
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <RoadmapButton
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-white border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all duration-200 shadow-sm"
            onClick={() => {/* Save functionality */}}
          >
            <Save className="h-4 w-4 text-gray-600" /> Save
          </RoadmapButton>
          <RoadmapButton
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-white border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all duration-200 shadow-sm"
            onClick={() => {/* Download functionality */}}
          >
            <Download className="h-4 w-4 text-gray-600" /> Export
          </RoadmapButton>
          <RoadmapButton
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-white border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all duration-200 shadow-sm"
            onClick={() => {/* Share functionality */}}
          >
            <Share2 className="h-4 w-4 text-gray-600" /> Share
          </RoadmapButton>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0 rounded-none">
              <TabsTrigger
                value="network"
                className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-lime-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-all font-medium flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-lime-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-all font-medium flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-lime-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-all font-medium flex items-center"
              >
                <Target className="h-4 w-4 mr-2" />
                Skills Overview
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-lime-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-all font-medium flex items-center"
              >
                <BookMarked className="h-4 w-4 mr-2" />
                Learning Resources
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Network/Node View */}
          <TabsContent value="network" className="p-0 max-h-[70vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 bg-white flex flex-wrap gap-2">
              <div className="flex-1 flex flex-wrap gap-2">
                <Button
                  variant="outline" 
                  className={`${progressFilter === 'all' ? 'bg-black text-white' : 'bg-white border-gray-200'} rounded-md h-8 px-4 text-sm font-medium`}
                  onClick={() => setProgressFilter('all')}
                >
                  All Steps
                </Button>
                <Button
                  variant="outline"
                  className={`${progressFilter === 'completed' ? 'bg-black text-white' : 'bg-white border-gray-200'} rounded-md h-8 px-4 text-sm font-medium flex items-center gap-1.5`}
                  onClick={() => setProgressFilter('completed')}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Completed</span>
                </Button>
                <Button
                  variant="outline"
                  className={`${progressFilter === 'upcoming' ? 'bg-black text-white' : 'bg-white border-gray-200'} rounded-md h-8 px-4 text-sm font-medium flex items-center gap-1.5`}
                  onClick={() => setProgressFilter('upcoming')}
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>Upcoming</span>
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 flex items-center gap-1 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all cursor-pointer">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </div>
              </div>
            </div>
            
            <div className="relative p-6 bg-white overflow-visible">
              <div className="flex flex-col items-center pb-32">
                {filteredSteps.map((step, index) => {
                  const isComplete = isStepComplete(index);
                  const isLast = index === filteredSteps.length - 1;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div 
                        className="relative flex flex-col items-center cursor-pointer group z-10"
                        onClick={() => handleNodeClick(step.id)}
                        ref={(el) => {
                          if (el) nodeRefs.current.set(step.id, el);
                        }}
                      >
                        <div 
                          className={`w-24 h-24 rounded-full flex items-center justify-center 
                            ${isComplete ? 
                              'bg-lime-400' : 
                              'bg-white border-2 border-gray-200'} 
                            transition-all duration-300 mb-3
                            ${selectedInfoPanel === step.id ? 'ring-4 ring-lime-200' : ''}
                            hover:shadow-md`}
                        >
                          <div className="flex flex-col items-center justify-center text-center">
                            <div 
                              className={`mb-1 flex items-center justify-center rounded-full 
                                ${isComplete ? 'text-white' : 'text-gray-800'}`}
                            >
                              {getStepIcon(step.type, false)}
                            </div>
                            <span 
                              className={`text-xl font-bold ${isComplete ? 'text-white' : 'text-gray-800'}`}
                            >
                              {index + 1}
                            </span>
                          </div>
                          
                          {/* Progress indicator for completed steps */}
                          {isComplete && (
                            <div 
                              className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
                            >
                              <CheckCircle2 className="h-5 w-5 text-lime-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center max-w-[160px]">
                          <h3 className="text-base font-medium text-gray-800 mb-1">{step.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={isComplete ? 
                              "bg-lime-100 text-lime-800 border-0 px-2 py-0.5 text-xs" : 
                              step.type === 'learning' ? 
                                "bg-blue-100 text-blue-700 border-0 px-2 py-0.5 text-xs flex items-center gap-1" : 
                                step.type === 'project' ? 
                                  "bg-green-100 text-green-700 border-0 px-2 py-0.5 text-xs" : 
                                  step.type === 'certification' ?
                                    "bg-purple-100 text-purple-700 border-0 px-2 py-0.5 text-xs" :
                                    "bg-amber-100 text-amber-700 border-0 px-2 py-0.5 text-xs"
                            }
                          >
                            {step.type === 'learning' && !isComplete ? 
                              <><BookOpen className="h-3 w-3 mr-0.5" /> {step.type}</> : 
                              step.type
                            }
                          </Badge>
                        </div>
                        
                        {/* Connection line */}
                        {!isLast && (
                          <div className="h-28 w-0.5 bg-lime-300 relative my-1">
                            <div className="absolute top-1/3 -left-1 w-2 h-2 rounded-full bg-lime-300"></div>
                            <div className="absolute top-2/3 -left-1 w-2 h-2 rounded-full bg-lime-300"></div>
                          </div>
                        )}
                        
                        {/* Info panel that appears when node is clicked - styled to match the image exactly */}
                        <AnimatePresence>
                          {selectedInfoPanel === step.id && (
                            <motion.div 
                              className="fixed md:absolute md:left-auto left-4 right-4 md:right-auto md:w-80 bg-white p-5 rounded-lg shadow-md border border-gray-100 z-20 overflow-hidden"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1,
                                top: windowWidth < 768 ? undefined : 0,
                                left: windowWidth < 768 ? undefined : '10vw',
                              }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="relative">
                                <button
                                  className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNodeClick(step.id);
                                  }}
                                  aria-label="Close details"
                                >
                                  <X className="h-3 w-3 text-gray-400" />
                                </button>
                                
                                <div className="flex justify-between mb-4">
                                  <Badge 
                                    variant="outline" 
                                    className={step.type === 'learning' ? 
                                      'bg-blue-100 text-blue-700 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1' : 
                                      step.type === 'project' ? 
                                        'bg-green-100 text-green-700 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1' : 
                                        step.type === 'certification' ?
                                          'bg-purple-100 text-purple-700 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1' :
                                          'bg-amber-100 text-amber-700 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1'
                                    }
                                  >
                                    <div className="flex items-center gap-1">
                                      {getStepIcon(step.type, true)}
                                      <span>{step.type}</span>
                                    </div>
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={isComplete ? 
                                      'bg-lime-100 text-lime-800 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1' : 
                                      'bg-gray-100 text-gray-600 border-0 px-2 py-1 text-xs rounded-md flex items-center gap-1'}
                                  >
                                    <div className="flex items-center gap-1">
                                      {isComplete ? 
                                        <CheckCircle2 className="h-3.5 w-3.5" /> : 
                                        <Clock className="h-3.5 w-3.5" />
                                      }
                                      <span>{isComplete ? 'Completed' : 'Pending'}</span>
                                    </div>
                                  </Badge>
                                </div>
                                
                                <h3 className="font-semibold text-lg mb-2.5 text-gray-900">{step.title}</h3>
                                <p className="text-gray-600 mb-5 text-sm">{step.description}</p>
                                
                                <div className="flex gap-3 mb-4">
                                  <div className="flex-1 flex items-center gap-2">
                                    <div className="flex flex-col">
                                      <div className="text-xs text-gray-500 mb-0.5">Duration</div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-gray-600" />
                                        <div className="text-sm font-medium">{step.timeframe}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 flex items-center gap-2">
                                    <div className="flex flex-col">
                                      <div className="text-xs text-gray-500 mb-0.5">Skills</div>
                                      <div className="flex items-center gap-1">
                                        <BarChart className="h-3.5 w-3.5 text-gray-600" />
                                        <div className="text-sm font-medium">{step.skills.length} skills to develop</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          {/* Timeline View */}
          <TabsContent value="timeline" className="p-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-2">
              <RoadmapButton
                variant={progressFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className={progressFilter === 'all' ? 'bg-black text-lime-300 hover:bg-gray-800' : ''}
                onClick={() => setProgressFilter('all')}
              >
                All Steps
              </RoadmapButton>
              <RoadmapButton
                variant={progressFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                className={progressFilter === 'completed' ? 'bg-black text-lime-300 hover:bg-gray-800' : ''}
                onClick={() => setProgressFilter('completed')}
              >
                Completed
              </RoadmapButton>
              <RoadmapButton
                variant={progressFilter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                className={progressFilter === 'upcoming' ? 'bg-black text-lime-300 hover:bg-gray-800' : ''}
                onClick={() => setProgressFilter('upcoming')}
              >
                Upcoming
              </RoadmapButton>
            </div>
            
            <div className="relative">
              {/* Progress Bar */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-amber-50 z-0 transition-all duration-500"
                style={{ width: `${currentProgress}%` }}
              />
              
              {/* Steps */}
              <div className="relative z-10">
                {filteredSteps.map((step, index) => {
                  const isComplete = isStepComplete(index);
                  const isExpanded = expandedStepId === step.id;
                  
                  return (
                    <div 
                      key={step.id}
                      className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${isExpanded ? 'bg-white' : isComplete ? 'bg-white' : 'bg-white'}`}
                    >
                      <div 
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={(e) => toggleStep(step.id, e)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-amber-300' : 'bg-gray-100'}`}>
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5 text-amber-800" />
                            ) : (
                              <span className="font-medium text-gray-600">{index + 1}</span>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">{step.title}</h3>
                              <Badge variant="outline" className={`${getTypeColor(step.type)} border-0`}>
                                {step.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {step.estimatedDuration}
                              </div>
                              <div className="flex items-center">
                                <BarChart className="h-3.5 w-3.5 mr-1" />
                                {step.skills.length} skills
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={isComplete ? 'bg-lime-100 text-lime-800 border-lime-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                            {isComplete ? 'Completed' : 'Pending'}
                          </Badge>
                          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                          <p className="text-gray-700 mb-4">{step.description}</p>
                          
                          {step.skills.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills to Develop</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.skills.map((skill, idx) => (
                                  <Badge 
                                    key={`${step.id}-skill-${idx}`}
                                    variant="outline" 
                                    className="bg-white"
                                  >
                                    {skill.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {step.resources.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Resources</h4>
                              <ul className="space-y-2">
                                {step.resources.map((resource, idx) => (
                                  <li key={`${step.id}-resource-${idx}`} className="flex items-center gap-2">
                                    <ResourceIcon type={resource.type} />
                                    <a 
                                      href={resource.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      {resource.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {step.milestones.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Milestones</h4>
                              <ul className="space-y-2">
                                {step.milestones.map((milestone, idx) => (
                                  <li key={`${step.id}-milestone-${idx}`} className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-lime-100' : 'bg-gray-100'}`}>
                                      {milestone.completed ? (
                                        <CheckCircle2 className="h-3 w-3 text-lime-600" />
                                      ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700">{milestone.title}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-black text-lime-300 hover:bg-gray-800 border-0 text-xs shadow-sm font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sampleStep) {
                                  handleNodeClick(sampleStep.id);
                                }
                              }}
                            >
                              <span>View Details</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          {/* Skills Overview */}
          <TabsContent value="skills" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                  <div className="space-y-4">
                    {uniqueSkills.filter(skill => skill.type === 'technical').map((skill, idx) => (
                      <div key={`tech-skill-${idx}`} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-lime-500 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Soft Skills</h3>
                  <div className="space-y-4">
                    {uniqueSkills.filter(skill => skill.type === 'soft').map((skill, idx) => (
                      <div key={`soft-skill-${idx}`} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Skills Timeline</h3>
              <p className="text-sm text-gray-500 mb-4">
                This timeline shows when you'll develop each skill throughout your roadmap journey
              </p>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center pb-2 mb-2 border-b border-gray-200">
                  <div className="w-1/4 text-sm font-medium">Skill</div>
                  <div className="w-3/4 text-sm font-medium">Progression</div>
                </div>
                
                {uniqueSkills.slice(0, 8).map((skill, idx) => (
                  <div key={`timeline-skill-${idx}`} className="flex items-center py-2">
                    <div className="w-1/4 text-sm">{skill.name}</div>
                    <div className="w-3/4">
                      <div className="relative h-8 bg-gray-100 rounded-md">
                        {steps.filter(step => 
                          step.skills.some(s => s.name === skill.name)
                        ).map((step, stepIdx) => {
                          const stepIndex = steps.findIndex(s => s.id === step.id);
                          const leftPosition = `${(stepIndex / (steps.length - 1)) * 100}%`;
                          return (
                            <div 
                              key={`skill-${idx}-step-${stepIdx}`}
                              className="absolute top-0 h-8 w-8 rounded-full bg-lime-500 border-2 border-white -ml-4 flex items-center justify-center"
                              style={{ left: leftPosition }}
                              title={`${step.title}: ${step.skills.find(s => s.name === skill.name)?.level}%`}
                            >
                              <span className="text-xs text-white font-bold">{stepIndex + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Resources View */}
          <TabsContent value="resources" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Courses</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
                      {allResources.filter(r => r.type === 'course').length}
                    </Badge>
                  </div>
                  <ul className="space-y-3">
                    {allResources.filter(r => r.type === 'course').map((resource, idx) => (
                      <li key={`course-${idx}`} className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 mt-0.5" />
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Books & Docs</h3>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-0">
                      {allResources.filter(r => r.type === 'book' || r.type === 'documentation').length}
                    </Badge>
                  </div>
                  <ul className="space-y-3">
                    {allResources.filter(r => r.type === 'book' || r.type === 'documentation').map((resource, idx) => (
                      <li key={`doc-${idx}`} className="flex items-start gap-2">
                        <ResourceIcon type={resource.type} />
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Projects</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                      {allResources.filter(r => r.type === 'project').length}
                    </Badge>
                  </div>
                  <ul className="space-y-3">
                    {allResources.filter(r => r.type === 'project').map((resource, idx) => (
                      <li key={`project-${idx}`} className="flex items-start gap-2">
                        <Code className="h-4 w-4 text-green-600 mt-0.5" />
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add backdrop overlay for mobile */}
      {selectedInfoPanel && windowWidth < 768 && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedInfoPanel(null)}
        />
      )}

      {/* Add a close button that appears at the top on mobile */}
      {windowWidth < 768 && (
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setSelectedInfoPanel(null);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {/* Add a "scroll to top" button for better navigation */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-lime-300 shadow-lg flex items-center justify-center z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // Scroll to top of the roadmap container
          const container = document.querySelector('.overflow-auto');
          if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
}

// Helper component for resource icons
const ResourceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'course':
      return <BookOpen className="h-4 w-4 text-blue-600" />;
    case 'book':
      return <BookOpen className="h-4 w-4 text-purple-600" />;
    case 'documentation':
      return <FileText className="h-4 w-4 text-gray-600" />;
    case 'video':
      return <BookOpen className="h-4 w-4 text-red-600" />;
    case 'project':
      return <Code className="h-4 w-4 text-green-600" />;
    default:
      return <Lightbulb className="h-4 w-4 text-yellow-600" />;
  }
}; 