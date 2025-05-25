'use client';

import { useEffect } from 'react';
import { Tutorial } from './Tutorial';
import { useTutorialStore } from '../stores/tutorialStore';

export const TutorialProvider = () => {
  const { 
    hasCompletedTutorial, 
    showTutorialOnFirstVisit, 
    isTutorialOpen,
    tutorialStep,
    setTutorialCompleted,
    setShowTutorialOnFirstVisit,
    setTutorialOpen,
    setTutorialStep
  } = useTutorialStore();

  // Auto-start tutorial for first-time users
  useEffect(() => {
    if (!hasCompletedTutorial && showTutorialOnFirstVisit) {
      const timer = setTimeout(() => {
        setTutorialOpen(true);
        setShowTutorialOnFirstVisit(false);
      }, 2000); // Wait 2 seconds after page load
      
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTutorial, showTutorialOnFirstVisit, setTutorialOpen, setShowTutorialOnFirstVisit]);

  const handleTutorialComplete = () => {
    setTutorialCompleted(true);
    setTutorialOpen(false);
    setTutorialStep(0);
  };

  const handleTutorialClose = () => {
    setTutorialOpen(false);
  };

  return (
    <Tutorial
      isOpen={isTutorialOpen}
      onClose={handleTutorialClose}
      onComplete={handleTutorialComplete}
      currentStep={tutorialStep}
      onStepChange={setTutorialStep}
    />
  );
}; 