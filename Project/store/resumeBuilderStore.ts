import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enum for Resume Builder Steps
export enum ResumeBuilderStep {
  MAIN = '',
  TEMPLATE = 'template',
  DETAILS = 'details',
  EDITOR = 'editor',
  PREVIEW = 'preview'
}

interface ResumeBuilderState {
  currentStep: ResumeBuilderStep;
  selectedTemplate: string;
  resumeData: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      title: string;
      summary: string;
      website?: string;
      linkedin?: string;
      github?: string;
    };
    experience: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      isCurrentPosition: boolean;
      description: string;
      bullets: string[];
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      location: string;
      startDate: string;
      endDate: string;
      isCurrentlyStudying: boolean;
      description?: string;
    }>;
    skills: Array<{
      id: string;
      name: string;
      level?: number;
    }>;
    projects: Array<{
      id: string;
      name: string;
      description: string;
      url?: string;
      startDate?: string;
      endDate?: string;
      isOngoing?: boolean;
      technologies?: string[];
    }>;
    certificates: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      url?: string;
      description?: string;
    }>;
    languages: Array<{
      id: string;
      name: string;
      proficiency: string;
    }>;
    customSections: Array<{
      id: string;
      title: string;
      items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        date?: string;
        description?: string;
        bullets?: string[];
      }>;
    }>;
  };
  setCurrentStep: (step: ResumeBuilderStep) => void;
  setSelectedTemplate: (template: string) => void;
  updatePersonalInfo: (info: Partial<ResumeBuilderState['resumeData']['personalInfo']>) => void;
  addExperience: (experience: ResumeBuilderState['resumeData']['experience'][0]) => void;
  updateExperience: (id: string, experience: Partial<ResumeBuilderState['resumeData']['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: ResumeBuilderState['resumeData']['education'][0]) => void;
  updateEducation: (id: string, education: Partial<ResumeBuilderState['resumeData']['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: ResumeBuilderState['resumeData']['skills'][0]) => void;
  updateSkill: (id: string, skill: Partial<ResumeBuilderState['resumeData']['skills'][0]>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: ResumeBuilderState['resumeData']['projects'][0]) => void;
  updateProject: (id: string, project: Partial<ResumeBuilderState['resumeData']['projects'][0]>) => void;
  removeProject: (id: string) => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  currentStep: ResumeBuilderStep.MAIN,
  selectedTemplate: 'modern',
  resumeData: {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    languages: [],
    customSections: []
  }
};

export const useResumeBuilderStore = create<ResumeBuilderState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentStep: (step: ResumeBuilderStep) => 
        set({ currentStep: step }),
      
      setSelectedTemplate: (template: string) =>
        set({ selectedTemplate: template }),
      
      updatePersonalInfo: (info) => 
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info }
          }
        })),
      
      addExperience: (experience) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: [...state.resumeData.experience, experience]
          }
        })),
      
      updateExperience: (id, experience) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.map(item =>
              item.id === id ? { ...item, ...experience } : item
            )
          }
        })),
      
      removeExperience: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.filter(item => item.id !== id)
          }
        })),
      
      addEducation: (education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, education]
          }
        })),
      
      updateEducation: (id, education) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map(item =>
              item.id === id ? { ...item, ...education } : item
            )
          }
        })),
      
      removeEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter(item => item.id !== id)
          }
        })),
      
      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, skill]
          }
        })),
      
      updateSkill: (id, skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map(item =>
              item.id === id ? { ...item, ...skill } : item
            )
          }
        })),
      
      removeSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter(item => item.id !== id)
          }
        })),
      
      addProject: (project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [...state.resumeData.projects, project]
          }
        })),
      
      updateProject: (id, project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map(item =>
              item.id === id ? { ...item, ...project } : item
            )
          }
        })),
      
      removeProject: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter(item => item.id !== id)
          }
        })),
      
      resetState: () => set(initialState)
    }),
    {
      name: 'resume-builder-storage', // unique name for localStorage
    }
  )
); 