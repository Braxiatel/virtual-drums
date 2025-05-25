'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDrumStore } from '../stores/drumStore';
import { useKeyBindings } from '../hooks/useKeyBindings';
import { BeatMap, HitResult, BeatMapNote } from '../lib/types';
import { DrumType } from '../lib/constants';
import { BASIC_ROCK_BEAT_MAP } from '../lib/beatMaps';
import { NoteHighway } from './NoteHighway';

interface RhythmGameProps {
  onGameComplete: (finalScore: number, stats: GameStats) => void;
}

interface GameStats {
  notesHit: number;
  totalNotes: number;
  perfectHits: number;
  goodHits: number;
  missedNotes: number;
  maxCombo: number;
  accuracy: number;
}

export const RhythmGame = ({ onGameComplete }: RhythmGameProps) => {
  const { gameState, setGameState } = useDrumStore();
  const { triggerDrum } = useKeyBindings();
  
  const [beatMap] = useState<BeatMap>(BASIC_ROCK_BEAT_MAP);
  const [gameStats, setGameStats] = useState<GameStats>({
    notesHit: 0,
    totalNotes: beatMap.notes.length,
    perfectHits: 0,
    goodHits: 0,
    missedNotes: 0,
    maxCombo: 0,
    accuracy: 0,
  });
  const [currentTime, setCurrentTime] = useState(Date.now());

  const gameLoopRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  const gameCompleteCallbackRef = useRef<(() => void) | undefined>(undefined);
  const currentTimeRef = useRef<number>(Date.now());

  // Store the game completion callback in a ref to avoid dependency issues
  gameCompleteCallbackRef.current = () => {
    const finalScore = gameState.score;
    
    setGameState({
      isComplete: true,
      finalScore,
    });

    onGameComplete(finalScore, gameStats);
  };

  // Update the current time ref whenever currentTime state changes
  currentTimeRef.current = currentTime;

  // Initialize game
  useEffect(() => {
    startTimeRef.current = Date.now();
    setGameState({
      gameStartTime: startTimeRef.current,
      currentTime: startTimeRef.current,
      score: 0,
      combo: 0,
      notesHit: 0,
      totalNotes: beatMap.notes.length,
      maxCombo: 0,
      isComplete: false,
    });

    // Start game loop
    const gameLoop = () => {
      const now = Date.now();
      setCurrentTime(now);
      const timeElapsed = now - startTimeRef.current;
      
      // Check if game is complete
      if (timeElapsed >= beatMap.duration + 2000) { // 2 seconds buffer
        gameCompleteCallbackRef.current?.();
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [beatMap.duration, beatMap.notes.length, setGameState]);

  // Handle note hits from the NoteHighway
  const handleNoteHit = useCallback((result: HitResult) => {
    const newScore = gameState.score + result.score;
    const newCombo = result.timing === 'miss' ? 0 : gameState.combo + 1;
    const newNotesHit = (gameState.notesHit || 0) + (result.timing !== 'miss' ? 1 : 0);
    const newMaxCombo = Math.max(gameState.maxCombo || 0, newCombo);

    setGameState({
      score: newScore,
      combo: newCombo,
      notesHit: newNotesHit,
      maxCombo: newMaxCombo,
    });

    setGameStats(prev => ({
      ...prev,
      notesHit: newNotesHit,
      perfectHits: prev.perfectHits + (result.timing === 'perfect' ? 1 : 0),
      goodHits: prev.goodHits + (result.timing === 'good' ? 1 : 0),
      maxCombo: newMaxCombo,
      accuracy: (newNotesHit / prev.totalNotes) * 100,
    }));

    // Trigger audio and visual feedback
    triggerDrum(result.drum);
  }, [gameState.score, gameState.combo, gameState.notesHit, gameState.maxCombo, setGameState, setGameStats, triggerDrum]);

  // Handle missed notes from the NoteHighway
  const handleNoteMissed = useCallback((note: BeatMapNote) => {
    // Reset combo on missed note
    setGameState({
      combo: 0,
    });

    setGameStats(prev => ({
      ...prev,
      missedNotes: prev.missedNotes + 1,
      accuracy: (prev.notesHit / prev.totalNotes) * 100,
    }));

    console.log(`Missed note: ${note.drum} at ${note.time}ms`);
  }, [setGameState, setGameStats]);

  // Enhanced keyboard input handling that works with NoteHighway
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Find which drum this key is bound to
      const drumMap: Record<string, DrumType> = {
        'f': 'kick',
        'j': 'snare',
        'h': 'closedHiHat',
        'r': 'highTom',
        't': 'midTom',
        'g': 'floorTom',
        'y': 'openHiHat',
        'u': 'crash',
        'k': 'ride',
      };

      const drum = drumMap[key];
      if (drum) {
        // Call the global hit handler that NoteHighway exposes
        const handleRhythmHit = (window as unknown as { handleRhythmHit?: (drum: DrumType) => void }).handleRhythmHit;
        if (handleRhythmHit) {
          handleRhythmHit(drum);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Progress calculation
  const progress = Math.min(
    ((currentTime - startTimeRef.current) / beatMap.duration) * 100,
    100
  );

  // Countdown calculation for preparation phase
  const timeElapsed = currentTime - startTimeRef.current;
  const preparationTime = 3000; // 3 seconds
  const isInPreparation = timeElapsed < preparationTime;
  const countdownSeconds = Math.ceil((preparationTime - timeElapsed) / 1000);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Game HUD */}
      <div className="mb-6 grid grid-cols-4 gap-4 text-center">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Score</div>
          <div className="text-2xl font-bold text-white">{gameState.score}</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Combo</div>
          <div className="text-2xl font-bold text-yellow-400">{gameState.combo}</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Accuracy</div>
          <div className="text-2xl font-bold text-green-400">{gameStats.accuracy.toFixed(1)}%</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Notes Hit</div>
          <div className="text-2xl font-bold text-blue-400">
            {gameStats.notesHit}/{gameStats.totalNotes}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-gray-800 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Note Highway - Guitar Hero Style */}
      <div className="mb-6">
        <NoteHighway
          beatMap={beatMap}
          gameStartTime={startTimeRef.current}
          currentTime={currentTime}
          onNoteHit={handleNoteHit}
          onNoteMissed={handleNoteMissed}
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-white">
        <h3 className="text-xl font-bold mb-2">{beatMap.name}</h3>
        <p className="text-gray-300 mb-4">
          Notes scroll from top to bottom. Hit the keys when they reach the white line at the top!
        </p>
        
        {/* Key mapping display */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-4">
          <div className="bg-red-500/20 p-3 rounded">
            <div className="font-bold">F</div>
            <div className="text-sm">Kick</div>
          </div>
          <div className="bg-blue-500/20 p-3 rounded">
            <div className="font-bold">J</div>
            <div className="text-sm">Snare</div>
          </div>
          <div className="bg-yellow-500/20 p-3 rounded">
            <div className="font-bold">H</div>
            <div className="text-sm">Hi-Hat</div>
          </div>
        </div>

        <div className="text-gray-400">
          <p>Hit the keys exactly when the notes reach the white line at the top!</p>
        </div>
      </div>
    </div>
  );
}; 