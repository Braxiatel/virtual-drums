import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  hasCompletedTutorial: boolean;
  showTutorialOnFirstVisit: boolean;
  tutorialStep: number;
  isTutorialOpen: boolean;
  setTutorialCompleted: (completed: boolean) => void;
  setShowTutorialOnFirstVisit: (show: boolean) => void;
  setTutorialStep: (step: number) => void;
  setTutorialOpen: (open: boolean) => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      hasCompletedTutorial: false,
      showTutorialOnFirstVisit: true,
      tutorialStep: 0,
      isTutorialOpen: false,
      
      setTutorialCompleted: (completed) => 
        set({ hasCompletedTutorial: completed }),
      
      setShowTutorialOnFirstVisit: (show) => 
        set({ showTutorialOnFirstVisit: show }),
      
      setTutorialStep: (step) => 
        set({ tutorialStep: step }),
      
      setTutorialOpen: (open) => 
        set({ isTutorialOpen: open }),
      
      resetTutorial: () => 
        set({ 
          hasCompletedTutorial: false, 
          tutorialStep: 0,
          showTutorialOnFirstVisit: true,
          isTutorialOpen: false
        }),
    }),
    {
      name: 'virtual-drums-tutorial',
    }
  )
); 