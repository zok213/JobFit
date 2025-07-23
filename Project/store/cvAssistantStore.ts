import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enum for CV Assistant Steps
export enum CVAssistantStep {
  UPLOAD = "upload",
  ANALYZE = "analyze",
  ENHANCE = "enhance",
  DOWNLOAD = "download",
}

export interface CVFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface CVSkill {
  name: string;
  level: number;
}

export interface CVSuggestion {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  section: string;
}

export interface CVInsight {
  text: string;
  strength: number;
}

export interface CVAnalysis {
  overallScore: number;
  scores: {
    content: number;
    format: number;
    relevance: number;
    completeness: number;
    keywords: number;
  };
  insights: CVInsight[];
  summary: string;
  skills: CVSkill[];
  suggestions: CVSuggestion[];
  industryKeywords: string[];
  presentKeywords: string[];
  missingKeywords: string[];
}

export interface Enhancement {
  id: string;
  type: "content" | "formatting" | "keywords";
  beforeContent: string;
  afterContent: string;
  section: string;
  isApplied: boolean;
}

export interface CVAssistantState {
  currentStep: CVAssistantStep;
  uploadedCV: CVFile | null;
  targetJobTitle: string;
  targetJobDescription: string;
  analysis: CVAnalysis | null;
  isAnalyzing: boolean;
  isEnhancing: boolean;
  enhancements: Enhancement[];
  enhancedCVUrl: string | null;
  error: string | null;

  // Actions
  setCurrentStep: (step: CVAssistantStep) => void;
  setUploadedCV: (cv: CVFile | null) => void;
  setTargetJobTitle: (title: string) => void;
  setTargetJobDescription: (description: string) => void;
  setAnalysis: (analysis: CVAnalysis | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setIsEnhancing: (isEnhancing: boolean) => void;
  addEnhancement: (enhancement: Enhancement) => void;
  updateEnhancement: (id: string, changes: Partial<Enhancement>) => void;
  removeEnhancement: (id: string) => void;
  applyEnhancement: (id: string, isApplied: boolean) => void;
  setEnhancedCVUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
  loadDemoData: () => void;
}

// Initial state
const initialState = {
  currentStep: CVAssistantStep.UPLOAD,
  uploadedCV: null,
  targetJobTitle: "",
  targetJobDescription: "",
  analysis: null,
  isAnalyzing: false,
  isEnhancing: false,
  enhancements: [],
  enhancedCVUrl: null,
  error: null,
};

// Sample demo data for development and testing
const demoAnalysis: CVAnalysis = {
  overallScore: 78,
  scores: {
    content: 85,
    format: 72,
    relevance: 68,
    completeness: 90,
    keywords: 75,
  },
  insights: [
    {
      text: "Strong professional summary highlights your core skills",
      strength: 90,
    },
    {
      text: "Work experience is well detailed with achievements",
      strength: 85,
    },
    { text: "Skills section lacks technical specificity", strength: 60 },
    { text: "Education section needs more detail", strength: 40 },
    { text: "Good use of action verbs throughout", strength: 80 },
  ],
  summary:
    "Experienced software developer with 5+ years building web applications using React, Node.js, and TypeScript. Strong problem-solving abilities and excellent team collaboration skills. Successfully delivered projects for fintech and e-commerce clients, reducing load times by 40% and increasing user engagement.",
  skills: [
    { name: "React", level: 92 },
    { name: "TypeScript", level: 88 },
    { name: "Node.js", level: 85 },
    { name: "Express", level: 78 },
    { name: "MongoDB", level: 72 },
    { name: "RESTful APIs", level: 90 },
    { name: "Redux", level: 65 },
    { name: "CI/CD", level: 55 },
    { name: "Unit Testing", level: 60 },
  ],
  suggestions: [
    {
      title: "Add more measurable achievements",
      description:
        "Include specific metrics and results for each role to demonstrate impact, such as percentage improvements, user growth, or revenue gains.",
      priority: "high",
      section: "Work Experience",
    },
    {
      title: "Expand technical skills section",
      description:
        "List specific tools, frameworks, and methodologies you've used, including versions and your proficiency level.",
      priority: "medium",
      section: "Skills",
    },
    {
      title: "Improve education details",
      description:
        "Add relevant coursework, projects, and academic achievements to strengthen your educational background.",
      priority: "medium",
      section: "Education",
    },
    {
      title: "Enhance formatting consistency",
      description:
        "Use consistent date formats, bullet points, and heading styles throughout the document.",
      priority: "low",
      section: "Formatting",
    },
  ],
  industryKeywords: [
    "React",
    "JavaScript",
    "TypeScript",
    "Frontend",
    "Backend",
    "Full-stack",
    "Node.js",
    "API",
    "REST",
    "UI/UX",
    "Testing",
    "CI/CD",
    "Git",
    "Agile",
    "Scrum",
    "DevOps",
    "MongoDB",
    "SQL",
    "Database",
    "AWS",
  ],
  presentKeywords: [
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "RESTful APIs",
    "Git",
    "Agile",
  ],
  missingKeywords: ["CI/CD", "DevOps", "AWS", "Scrum", "UI/UX", "SQL"],
};

const demoCV: CVFile = {
  id: "demo-cv-1",
  name: "Alex_Johnson_Resume.pdf",
  url: "/sample/resume.pdf",
  size: 247000,
  createdAt: new Date().toISOString(),
};

export const useCVAssistantStore = create<CVAssistantState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStep: (step: CVAssistantStep) => set({ currentStep: step }),

      setUploadedCV: (cv: CVFile | null) => set({ uploadedCV: cv }),

      setTargetJobTitle: (title: string) => set({ targetJobTitle: title }),

      setTargetJobDescription: (description: string) =>
        set({ targetJobDescription: description }),

      setAnalysis: (analysis: CVAnalysis | null) => set({ analysis }),

      setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),

      setIsEnhancing: (isEnhancing: boolean) => set({ isEnhancing }),

      addEnhancement: (enhancement: Enhancement) =>
        set((state) => ({
          enhancements: [...state.enhancements, enhancement],
        })),

      updateEnhancement: (id: string, changes: Partial<Enhancement>) =>
        set((state) => ({
          enhancements: state.enhancements.map((item) =>
            item.id === id ? { ...item, ...changes } : item
          ),
        })),

      removeEnhancement: (id: string) =>
        set((state) => ({
          enhancements: state.enhancements.filter((item) => item.id !== id),
        })),

      applyEnhancement: (id: string, isApplied: boolean) =>
        set((state) => ({
          enhancements: state.enhancements.map((item) =>
            item.id === id ? { ...item, isApplied } : item
          ),
        })),

      setEnhancedCVUrl: (url: string | null) => set({ enhancedCVUrl: url }),

      setError: (error: string | null) => set({ error }),

      resetState: () => set(initialState),

      loadDemoData: () => {
        console.log("Loading demo CV data");
        // Only in development or if the user has no CV uploaded
        set({
          uploadedCV: demoCV,
          analysis: demoAnalysis,
          targetJobTitle: "Frontend Developer",
          targetJobDescription:
            "We are looking for a Frontend Developer with experience in React, TypeScript, and modern web development practices.",
        });
      },
    }),
    {
      name: "cv-assistant-storage", // unique name for localStorage
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") {
            return null;
          }
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.warn(
              `Could not getItem '${name}' from localStorage:`,
              error
            );
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") {
            return;
          }
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.warn(`Could not setItem '${name}' in localStorage:`, error);
          }
        },
        removeItem: (name) => {
          if (typeof window === "undefined") {
            return;
          }
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.warn(
              `Could not removeItem '${name}' from localStorage:`,
              error
            );
          }
        },
      },
    }
  )
);
