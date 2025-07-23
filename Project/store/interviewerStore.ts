import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enum for Interviewer Steps
export enum InterviewerStep {
  MAIN = "",
  CHAT = "chat",
}

interface InterviewerState {
  currentStep: InterviewerStep;
  interviewSetup: {
    jobTitle: string;
    industry: string;
    interviewType: "behavioral" | "technical" | "case" | "general";
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  interviewHistory: Array<{
    id: string;
    date: string;
    jobTitle: string;
    messages: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp: string;
    }>;
    feedback: {
      strengths: string[];
      improvements: string[];
      score: number;
    };
  }>;
  activeInterviewId: string | null;
  setCurrentStep: (step: InterviewerStep) => void;
  updateInterviewSetup: (
    setup: Partial<InterviewerState["interviewSetup"]>
  ) => void;
  startNewInterview: (
    interview: InterviewerState["interviewHistory"][0]
  ) => void;
  addMessage: (
    interviewId: string,
    message: InterviewerState["interviewHistory"][0]["messages"][0]
  ) => void;
  updateFeedback: (
    interviewId: string,
    feedback: Partial<InterviewerState["interviewHistory"][0]["feedback"]>
  ) => void;
  setActiveInterview: (id: string | null) => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  currentStep: InterviewerStep.MAIN,
  interviewSetup: {
    jobTitle: "",
    industry: "",
    interviewType: "general" as const,
    difficulty: "intermediate" as const,
  },
  interviewHistory: [],
  activeInterviewId: null,
};

export const useInterviewerStore = create<InterviewerState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStep: (step: InterviewerStep) => set({ currentStep: step }),

      updateInterviewSetup: (
        setup: Partial<InterviewerState["interviewSetup"]>
      ) =>
        set((state) => ({
          interviewSetup: { ...state.interviewSetup, ...setup },
        })),

      startNewInterview: (interview) =>
        set((state) => ({
          interviewHistory: [interview, ...state.interviewHistory],
          activeInterviewId: interview.id,
        })),

      addMessage: (interviewId, message) =>
        set((state) => ({
          interviewHistory: state.interviewHistory.map((interview) =>
            interview.id === interviewId
              ? { ...interview, messages: [...interview.messages, message] }
              : interview
          ),
        })),

      updateFeedback: (interviewId, feedback) =>
        set((state) => ({
          interviewHistory: state.interviewHistory.map((interview) =>
            interview.id === interviewId
              ? {
                  ...interview,
                  feedback: { ...interview.feedback, ...feedback },
                }
              : interview
          ),
        })),

      setActiveInterview: (id) => set({ activeInterviewId: id }),

      resetState: () => set(initialState),
    }),
    {
      name: "interviewer-storage", // unique name for localStorage
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? Promise.resolve(JSON.parse(value)) : null;
          } catch (error) {
            console.warn(
              `Could not getItem '${name}' from localStorage:`,
              error
            );
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
            return Promise.resolve();
          } catch (error) {
            console.warn(`Could not setItem '${name}' in localStorage:`, error);
            return Promise.resolve();
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
            return Promise.resolve();
          } catch (error) {
            console.warn(
              `Could not removeItem '${name}' from localStorage:`,
              error
            );
            return Promise.resolve();
          }
        },
      },
    }
  )
);
