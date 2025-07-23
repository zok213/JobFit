import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enum for AI Tool Types
export enum AIToolType {
  ROADMAP = 'roadmap',
  CV_ASSISTANT = 'cv-assistant',
  JOB_MATCH = 'job-match',
  INTERVIEWER = 'interviewer'
}

interface AIToolState {
  currentTool: AIToolType | null;
  recentlyUsedTools: AIToolType[];
  usageCounts: Record<AIToolType, number>;
  favoriteTools: AIToolType[];
  
  // AI tool preferences
  preferences: {
    detailLevel: 'basic' | 'detailed' | 'comprehensive';
    autoSave: boolean;
    notificationsEnabled: boolean;
  };
  
  // Actions
  setCurrentTool: (tool: AIToolType | null) => void;
  incrementUsage: (tool: AIToolType) => void;
  addToFavorites: (tool: AIToolType) => void;
  removeFromFavorites: (tool: AIToolType) => void;
  updatePreferences: (newPreferences: Partial<AIToolState['preferences']>) => void;
  resetState: () => void;
}

const initialState = {
  currentTool: null,
  recentlyUsedTools: [],
  usageCounts: {
    [AIToolType.ROADMAP]: 0,
    [AIToolType.CV_ASSISTANT]: 0,
    [AIToolType.JOB_MATCH]: 0,
    [AIToolType.INTERVIEWER]: 0
  },
  favoriteTools: [],
  preferences: {
    detailLevel: 'detailed' as const,
    autoSave: true,
    notificationsEnabled: true
  }
};

export const useAiToolsStore = create<AIToolState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentTool: (tool) => 
        set((state) => {
          // Add to recently used if not null and not already at the top
          if (tool) {
            const filteredRecent = state.recentlyUsedTools.filter(t => t !== tool);
            return {
              currentTool: tool,
              recentlyUsedTools: [tool, ...filteredRecent].slice(0, 5) // Keep only 5 recent tools
            };
          }
          return { currentTool: null };
        }),
      
      incrementUsage: (tool) =>
        set((state) => ({
          usageCounts: {
            ...state.usageCounts,
            [tool]: (state.usageCounts[tool] || 0) + 1
          }
        })),
      
      addToFavorites: (tool) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.includes(tool) 
            ? state.favoriteTools 
            : [...state.favoriteTools, tool]
        })),
      
      removeFromFavorites: (tool) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.filter(t => t !== tool)
        })),
      
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      
      resetState: () => set(initialState)
    }),
    {
      name: 'ai-tools-storage', // unique name for localStorage
    }
  )
); 