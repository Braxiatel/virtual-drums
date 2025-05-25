'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useKeyBindings } from '../hooks/useKeyBindings';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'key' | 'wait' | 'navigate';
  actionData?: string;
  page: 'home' | 'play' | 'settings';
}

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  // Introduction
  {
    id: 'welcome',
    title: '🥁 Welcome to Virtual Drums!',
    description: 'This interactive tutorial will teach you everything you need to know about playing virtual drums. Let\'s start your musical journey!',
    position: 'center',
    page: 'home'
  },
  
  // Home page - Drum Kit
  {
    id: 'drum-kit-intro',
    title: '🎵 Your Virtual Drum Kit',
    description: 'This is your virtual drum kit! You can click on any drum pad to play it, or use your keyboard for faster playing.',
    target: '.drum-kit-container',
    position: 'bottom',
    page: 'home'
  },
  {
    id: 'kick-drum',
    title: '🦵 Kick Drum (F key)',
    description: 'The kick drum is the big drum at the bottom. It provides the bass foundation of your rhythm. Try pressing the F key or clicking it!',
    target: '[data-drum="kick"]',
    position: 'top',
    action: 'key',
    actionData: 'f',
    page: 'home'
  },
  {
    id: 'snare-drum',
    title: '🥁 Snare Drum (J key)',
    description: 'The snare drum creates the sharp "crack" sound. It\'s usually played on beats 2 and 4. Try pressing J!',
    target: '[data-drum="snare"]',
    position: 'top',
    action: 'key',
    actionData: 'j',
    page: 'home'
  },
  {
    id: 'hi-hat',
    title: '🎩 Hi-Hat (H key)',
    description: 'The hi-hat cymbals keep the rhythm going. Press H to play the closed hi-hat sound!',
    target: '[data-drum="closedHiHat"]',
    position: 'top',
    action: 'key',
    actionData: 'h',
    page: 'home'
  },
  {
    id: 'free-play',
    title: '🎶 Free Play Time!',
    description: 'Now try playing a simple beat: Kick (F) - Hi-hat (H) - Snare (J) - Hi-hat (H). Repeat this pattern to create a basic rock beat! Click the drums or use your keyboard.',
    position: 'center',
    action: 'wait',
    page: 'home'
  },
  
  // Menu and Navigation
  {
    id: 'menu-intro',
    title: '📱 The Menu System',
    description: 'Click the Menu button to access different game modes and settings.',
    target: 'button:has-text("Menu")',
    position: 'left',
    action: 'click',
    page: 'home'
  },
  {
    id: 'beats-mode',
    title: '🎵 Beats Mode - Rhythm Game',
    description: 'Beats mode is where the real challenge begins! It\'s like Guitar Hero but for drums. Notes scroll down and you hit them at the right time.',
    target: '[data-menu-item="beats"]',
    position: 'right',
    action: 'click',
    page: 'home'
  },
  
  // Play page - Track Selection
  {
    id: 'track-selection',
    title: '🎯 Choose Your Challenge',
    description: 'Here you can select different drum tracks with varying difficulty levels. Each track has its own rhythm pattern and BPM.',
    position: 'center',
    page: 'play'
  },
  {
    id: 'difficulty-levels',
    title: '📊 Difficulty Levels',
    description: 'Start with "Country Rock (Beginner)" - it\'s the easiest track. As you improve, try "Basic Rock", "Heavy Rock", and finally "Funk Rock (Master)".',
    target: '[data-track="countryRock"]',
    position: 'top',
    page: 'play'
  },
  {
    id: 'bpm-control',
    title: '⚡ BPM Control',
    description: 'You can adjust the BPM (beats per minute) to make tracks slower or faster. Lower BPM = easier, higher BPM = more challenging!',
    target: '.bpm-control',
    position: 'left',
    page: 'play'
  },
  
  // Rhythm Game Mechanics
  {
    id: 'note-highway',
    title: '🛣️ The Note Highway',
    description: 'Notes scroll from top to bottom in 3 lanes: Kick (red), Hi-hat (yellow), and Snare (blue). Hit the keys when notes reach the white line at the top!',
    target: '.note-highway-container',
    position: 'bottom',
    page: 'play'
  },
  {
    id: 'hit-zone',
    title: '🎯 The Hit Zone',
    description: 'This white glowing line is your hit zone! Press the correct key exactly when a note reaches this line for perfect timing.',
    target: '.hit-zone',
    position: 'bottom',
    page: 'play'
  },
  {
    id: 'timing-feedback',
    title: '⭐ Timing Feedback',
    description: 'You\'ll see "PERFECT", "GOOD", or "MISS" feedback. Perfect hits give 100 points, good hits give 50 points. Try to get as many perfects as possible!',
    position: 'center',
    page: 'play'
  },
  {
    id: 'rhythm-speaker',
    title: '🔊 Rhythm Guide',
    description: 'The pulsating speaker on the right helps you feel the beat. It pulses every 8th note to help you stay in rhythm!',
    target: '.pulsating-speaker',
    position: 'left',
    page: 'play'
  },
  
  // Game HUD
  {
    id: 'game-hud',
    title: '📊 Game Statistics',
    description: 'Keep track of your score, combo, accuracy, and progress. Try to maintain long combos for bonus points!',
    target: '.game-hud',
    position: 'bottom',
    page: 'play'
  },
  
  // Settings
  {
    id: 'settings-intro',
    title: '⚙️ Customize Your Experience',
    description: 'In Settings, you can remap keys, adjust audio levels, and calibrate latency for the perfect playing experience.',
    position: 'center',
    page: 'settings'
  },
  
  // Conclusion
  {
    id: 'conclusion',
    title: '🎉 You\'re Ready to Rock!',
    description: 'Congratulations! You now know how to use Virtual Drums. Start with easier tracks and work your way up. Remember: practice makes perfect!',
    position: 'center',
    page: 'home'
  }
];

export const Tutorial = ({ isOpen, onClose, onComplete, currentStep = 0, onStepChange }: TutorialProps) => {
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [beatPatternIndex, setBeatPatternIndex] = useState(0);
  const [showBeatGuide, setShowBeatGuide] = useState(false);
  const router = useRouter();
  const { triggerDrum } = useKeyBindings();

  const step = TUTORIAL_STEPS[currentStep];

  // Basic rock beat pattern: Kick - Hi-hat - Snare - Hi-hat
  const beatPattern = [
    { drum: 'kick', label: 'Kick (F)', color: 'bg-red-500' },
    { drum: 'closedHiHat', label: 'Hi-hat (H)', color: 'bg-yellow-500' },
    { drum: 'snare', label: 'Snare (J)', color: 'bg-blue-500' },
    { drum: 'closedHiHat', label: 'Hi-hat (H)', color: 'bg-yellow-500' },
  ];

  const nextStep = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      onStepChange?.(currentStep + 1);
      setIsWaitingForAction(false);
      setHighlightedElement(null);
    } else {
      onComplete();
      onClose();
    }
  }, [currentStep, onComplete, onClose, onStepChange]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      onStepChange?.(currentStep - 1);
      setIsWaitingForAction(false);
      setHighlightedElement(null);
    }
  }, [currentStep, onStepChange]);

  const skipTutorial = useCallback(() => {
    onClose();
  }, [onClose]);

  // Show beat guide during free play step
  useEffect(() => {
    if (step?.id === 'free-play') {
      setShowBeatGuide(true);
      setBeatPatternIndex(0);
    } else {
      setShowBeatGuide(false);
    }
  }, [step?.id]);

  // Handle keyboard events during free play for beat pattern
  useEffect(() => {
    if (!showBeatGuide) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const currentBeat = beatPattern[beatPatternIndex];
      
      // Check if the pressed key matches the current drum in the pattern
      let keyMatches = false;
      if (currentBeat.drum === 'kick' && key === 'f') keyMatches = true;
      if (currentBeat.drum === 'closedHiHat' && key === 'h') keyMatches = true;
      if (currentBeat.drum === 'snare' && key === 'j') keyMatches = true;
      
      if (keyMatches) {
        triggerDrum(currentBeat.drum as any);
        setBeatPatternIndex((prev) => (prev + 1) % beatPattern.length);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showBeatGuide, beatPatternIndex, beatPattern, triggerDrum]);

  // Handle click events for tutorial actions
  useEffect(() => {
    if (!isOpen || !step?.action || step.action !== 'click' || !highlightedElement) return;

    const handleClick = (event: Event) => {
      // Don't prevent the default action - let the button work normally
      // Just advance the tutorial after a short delay to let the original action complete
      setTimeout(() => {
        setIsWaitingForAction(false);
        nextStep();
      }, 100);
    };

    if (step.action === 'click') {
      setIsWaitingForAction(true);
      highlightedElement.addEventListener('click', handleClick);
      return () => {
        highlightedElement.removeEventListener('click', handleClick);
      };
    }
  }, [currentStep, isOpen, step, highlightedElement, nextStep]);

  // Handle keyboard events for tutorial actions
  useEffect(() => {
    if (!isOpen || !step?.action) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (step.action === 'key' && event.key.toLowerCase() === step.actionData?.toLowerCase()) {
        setIsWaitingForAction(false);
        nextStep();
      }
    };

    if (step.action === 'key') {
      setIsWaitingForAction(true);
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentStep, isOpen, step]);

  // Handle element highlighting
  useEffect(() => {
    if (!isOpen || !step?.target) {
      setHighlightedElement(null);
      return;
    }

    const findElement = () => {
      let element: Element | null = null;
      
      // Handle special text-based selectors
      if (step.target!.includes(':has-text(')) {
        const match = step.target!.match(/^(.+):has-text\("(.+)"\)$/);
        if (match) {
          const [, selector, text] = match;
          const elements = document.querySelectorAll(selector);
          element = Array.from(elements).find(el => 
            el.textContent?.trim().includes(text) || 
            el.innerHTML?.includes(text)
          ) || null;
        }
      } else if (step.target!.includes(',')) {
        // Handle multiple selectors separated by commas
        const selectors = step.target!.split(',').map(s => s.trim());
        for (const selector of selectors) {
          if (selector.includes(':has-text(')) {
            const match = selector.match(/^(.+):has-text\("(.+)"\)$/);
            if (match) {
              const [, sel, text] = match;
              const elements = document.querySelectorAll(sel);
              element = Array.from(elements).find(el => 
                el.textContent?.trim().includes(text) || 
                el.innerHTML?.includes(text)
              ) || null;
            }
          } else {
            element = document.querySelector(selector);
          }
          if (element) break;
        }
      } else {
        // Use regular CSS selector
        element = document.querySelector(step.target!);
      }
      
      if (element) {
        setHighlightedElement(element);
        console.log(`Tutorial: Found element for step "${step.id}":`, element);
        return true;
      }
      console.log(`Tutorial: Element not found for step "${step.id}" with selector "${step.target}"`);
      return false;
    };

    // Clear previous highlight
    setHighlightedElement(null);

    // Try to find element immediately
    if (findElement()) return;

    // If not found, retry with increasing delays
    const retryIntervals = [100, 300, 500, 1000];
    const timers: NodeJS.Timeout[] = [];

    retryIntervals.forEach((delay) => {
      const timer = setTimeout(() => {
        if (findElement()) {
          // Clear remaining timers if element is found
          timers.forEach(t => clearTimeout(t));
        }
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [currentStep, isOpen, step]);

  // Ensure page is scrolled to top when tutorial opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  // Navigation between pages
  useEffect(() => {
    if (!isOpen) return;

    const currentPath = window.location.pathname;
    const requiredPage = step.page;

    if (
      (requiredPage === 'home' && currentPath !== '/') ||
      (requiredPage === 'play' && currentPath !== '/play') ||
      (requiredPage === 'settings' && currentPath !== '/settings')
    ) {
      const targetPath = requiredPage === 'home' ? '/' : `/${requiredPage}`;
      router.push(targetPath);
    }
  }, [currentStep, isOpen, step, router]);

  if (!isOpen) return null;

  // Check if we're on steps where we want to show the background clearly
  const isSettingsStep = step.id === 'settings-intro';
  const isTrackSelectionStep = step.id === 'track-selection' || step.id === 'difficulty-levels' || step.id === 'bpm-control';
  const shouldReduceBlur = isSettingsStep || isTrackSelectionStep;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Simple overlay that doesn't block clicks */}
        {highlightedElement ? (
          // When highlighting an element, show overlay but allow clicks through
          <>
            <div className={`absolute inset-0 ${shouldReduceBlur ? 'bg-black/30' : 'bg-black/70'}`} />

            {/* Highlight border around the element */}
            <div
              className="absolute border-4 border-yellow-400 rounded-lg shadow-2xl pointer-events-none animate-pulse"
              style={{
                top: highlightedElement.getBoundingClientRect().top - 8,
                left: highlightedElement.getBoundingClientRect().left - 8,
                width: highlightedElement.getBoundingClientRect().width + 16,
                height: highlightedElement.getBoundingClientRect().height + 16,
                zIndex: 51,
                boxShadow: '0 0 20px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 0, 0.1)'
              }}
            />
          </>
        ) : (
          // When no element is highlighted, use simple overlay - remove blur for settings step
          <div className={`absolute inset-0 ${shouldReduceBlur ? 'bg-black/30' : 'bg-black/70 backdrop-blur-sm'}`} />
        )}

        {/* Tutorial Card */}
        <motion.div
          className={`absolute bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 shadow-2xl border border-white/20 max-w-md w-full mx-4 z-[60] pointer-events-auto ${
            step.position === 'center' ? 'top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
            step.position === 'top' ? 'top-4 left-1/2 transform -translate-x-1/2' :
            step.position === 'bottom' ? 'bottom-4 left-1/2 transform -translate-x-1/2' :
            step.position === 'left' ? 'left-4 top-1/4 transform -translate-y-1/2' :
            'right-4 top-1/4 transform -translate-y-1/2'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-300">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </div>
            <button
              onClick={skipTutorial}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip Tutorial
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="text-white">
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-200 mb-6 leading-relaxed">{step.description}</p>

            {/* Action prompt */}
            {step.action && isWaitingForAction && step.action !== 'click' && (
              <motion.div
                className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-yellow-300 text-sm font-semibold">
                  {step.action === 'key' && `Press the "${step.actionData?.toUpperCase()}" key to continue`}
                  {step.action === 'wait' && 'Take your time to practice, then click Next when ready'}
                </div>
              </motion.div>
            )}

            {/* Interactive Beat Guide for Free Play */}
            {showBeatGuide && (
              <motion.div
                className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-3">
                  <div className="text-purple-300 text-sm font-semibold mb-2">
                    🎵 Follow the Beat Pattern
                  </div>
                  <div className="text-xs text-gray-300 mb-3">
                    Click the drums in order or use keyboard keys
                  </div>
                </div>

                {/* Beat Pattern Visualization */}
                <div className="flex justify-center gap-2 mb-3">
                  {beatPattern.map((beat, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        triggerDrum(beat.drum as any);
                        setBeatPatternIndex((prev) => (prev + 1) % beatPattern.length);
                      }}
                      className={`relative px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        index === beatPatternIndex
                          ? `${beat.color} text-white shadow-lg scale-110`
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                      whileHover={{ scale: index === beatPatternIndex ? 1.15 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {beat.label}
                      {index === beatPatternIndex && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center gap-1">
                  {beatPattern.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === beatPatternIndex ? 'bg-purple-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center mt-3">
                  <div className="text-xs text-gray-400">
                    Next: <span className="text-purple-300 font-semibold">
                      {beatPattern[beatPatternIndex].label}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visual Mockups for Rhythm Game Elements */}
            {(step.id === 'note-highway' || step.id === 'hit-zone' || step.id === 'timing-feedback') && (
              <motion.div
                className="bg-gray-900/90 border border-gray-600 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-3">
                  <div className="text-blue-300 text-sm font-semibold mb-2">
                    🎮 Visual Preview
                  </div>
                </div>

                {/* Note Highway Mockup */}
                {step.id === 'note-highway' && (
                  <div className="relative bg-black rounded-lg p-4 h-48 overflow-hidden">
                    {/* Three lanes */}
                    <div className="flex h-full gap-2">
                      {/* Kick Lane (Red) */}
                      <div className="flex-1 bg-red-900/30 border border-red-500/50 rounded relative">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-red-400 text-xs font-bold">KICK</div>
                        {/* Falling notes */}
                        <motion.div
                          className="absolute w-8 h-4 bg-red-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [20, 180] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="absolute w-8 h-4 bg-red-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [-20, 140] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                      </div>
                      
                      {/* Hi-hat Lane (Yellow) */}
                      <div className="flex-1 bg-yellow-900/30 border border-yellow-500/50 rounded relative">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-bold">HI-HAT</div>
                        <motion.div
                          className="absolute w-8 h-4 bg-yellow-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [0, 160] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        />
                        <motion.div
                          className="absolute w-8 h-4 bg-yellow-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [-40, 120] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.5 }}
                        />
                      </div>
                      
                      {/* Snare Lane (Blue) */}
                      <div className="flex-1 bg-blue-900/30 border border-blue-500/50 rounded relative">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-blue-400 text-xs font-bold">SNARE</div>
                        <motion.div
                          className="absolute w-8 h-4 bg-blue-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [10, 170] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.75 }}
                        />
                      </div>
                    </div>
                    
                    {/* Hit zone line */}
                    <div className="absolute bottom-8 left-0 right-0 h-1 bg-white shadow-lg shadow-white/50"></div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">HIT ZONE</div>
                  </div>
                )}

                {/* Hit Zone Mockup */}
                {step.id === 'hit-zone' && (
                  <div className="relative bg-black rounded-lg p-4 h-32">
                    <div className="flex h-full gap-2">
                      <div className="flex-1 bg-gray-800 rounded relative">
                        {/* Note approaching hit zone */}
                        <motion.div
                          className="absolute w-8 h-4 bg-green-500 rounded left-1/2 transform -translate-x-1/2"
                          animate={{ y: [20, 80] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                    
                    {/* Glowing hit zone */}
                    <motion.div 
                      className="absolute bottom-8 left-0 right-0 h-2 bg-white rounded-full shadow-lg"
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.8)",
                          "0 0 10px rgba(255,255,255,0.5)"
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
                      ⚡ PERFECT TIMING ZONE ⚡
                    </div>
                  </div>
                )}

                {/* Timing Feedback Mockup */}
                {step.id === 'timing-feedback' && (
                  <div className="relative bg-black rounded-lg p-4 h-32 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <motion.div
                        className="text-2xl font-bold text-green-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        PERFECT!
                      </motion.div>
                      <div className="text-yellow-400 text-lg font-bold opacity-60">GOOD</div>
                      <div className="text-red-400 text-lg font-bold opacity-40">MISS</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Perfect: 100 pts • Good: 50 pts • Miss: 0 pts
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Rhythm Speaker Mockup */}
            {step.id === 'rhythm-speaker' && (
              <motion.div
                className="bg-gray-900/90 border border-gray-600 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-3">
                  <div className="text-blue-300 text-sm font-semibold mb-2">
                    🔊 Rhythm Guide Preview
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0.4)",
                        "0 0 0 10px rgba(147, 51, 234, 0)",
                        "0 0 0 0 rgba(147, 51, 234, 0)"
                      ]
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <span className="text-white text-2xl">🔊</span>
                  </motion.div>
                </div>
                
                <div className="text-center mt-3">
                  <div className="text-xs text-gray-400">
                    Pulses every 8th note to keep you in rhythm
                  </div>
                </div>
              </motion.div>
            )}

            {/* Game HUD Mockup */}
            {step.id === 'game-hud' && (
              <motion.div
                className="bg-gray-900/90 border border-gray-600 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-3">
                  <div className="text-blue-300 text-sm font-semibold mb-2">
                    📊 Game Statistics Preview
                  </div>
                </div>
                
                <div className="bg-black rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Score:</span>
                    <motion.span 
                      className="text-yellow-400 font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      8,750
                    </motion.span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Combo:</span>
                    <motion.span 
                      className="text-green-400 font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    >
                      x24
                    </motion.span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Accuracy:</span>
                    <span className="text-blue-400 font-bold">94%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      animate={{ width: ["0%", "75%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-400">Progress</div>
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="space-y-4">
              {/* Progress dots - centered */}
              <div className="flex justify-center space-x-2">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-yellow-400' :
                      index < currentStep ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation buttons - properly spaced */}
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={step.action && isWaitingForAction}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                >
                  {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 