'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BeatMapNote, BeatMap, HitResult } from '../lib/types';
import { DrumType, DRUM_KIT_CONFIG } from '../lib/constants';
import { PulsatingSpeaker } from './PulsatingSpeaker';

interface NoteHighwayProps {
  beatMap: BeatMap;
  gameStartTime: number;
  currentTime: number;
  onNoteHit: (result: HitResult) => void;
  onNoteMissed: (note: BeatMapNote) => void;
}

interface VisibleNote {
  id: string;
  drum: DrumType;
  time: number;
  lane: number;
  yPosition: number;
  isHit?: boolean;
  hitResult?: 'perfect' | 'good' | 'miss';
}

const HIGHWAY_HEIGHT = 600;
const HIT_ZONE_Y = 100; // Hit zone moved a bit lower
const HIT_WINDOW_PERFECT = 50; // ms
const HIT_WINDOW_GOOD = 100; // ms
const HIT_WINDOW_MISS = 150; // ms

// Lane configuration for different drums
const LANE_CONFIG = {
  0: { drum: 'kick', color: 'bg-red-500', x: 80 },
  1: { drum: 'closedHiHat', color: 'bg-yellow-500', x: 220 },
  2: { drum: 'snare', color: 'bg-blue-500', x: 360 },
} as const;

const LANE_WIDTH = 120;

export const NoteHighway = ({ 
  beatMap, 
  gameStartTime, 
  currentTime, 
  onNoteHit, 
  onNoteMissed 
}: NoteHighwayProps) => {
  const [visibleNotes, setVisibleNotes] = useState<VisibleNote[]>([]);
  const processedNotes = useRef(new Set<string>());

  // Handle drum hits
  const handleDrumHit = useCallback((drum: DrumType) => {
    const timeInGame = currentTime - gameStartTime;
    
    // Find the closest note in the hit window for this drum
    let closestNote: VisibleNote | null = null;
    let closestTimeDiff = Infinity;

    visibleNotes.forEach(note => {
      if (note.drum === drum && !note.isHit) {
        const timeDiff = Math.abs(note.time - timeInGame);
        if (timeDiff < closestTimeDiff && timeDiff <= HIT_WINDOW_MISS) {
          closestNote = note;
          closestTimeDiff = timeDiff;
        }
      }
    });

    if (closestNote) {
      // Determine hit quality
      let timing: 'perfect' | 'good' | 'miss';
      let score: number;
      
      if (closestTimeDiff <= HIT_WINDOW_PERFECT) {
        timing = 'perfect';
        score = 100;
      } else if (closestTimeDiff <= HIT_WINDOW_GOOD) {
        timing = 'good';
        score = 50;
      } else {
        timing = 'miss';
        score = 0;
      }

      // Mark note as hit and trigger immediate re-render
      setVisibleNotes(prev => 
        prev.map(note => 
          note.id === closestNote!.id 
            ? { ...note, isHit: true, hitResult: timing }
            : note
        )
      );

      // Send hit result
      onNoteHit({
        drum,
        timing,
        score,
        timestamp: currentTime,
      });
    }
  }, [currentTime, gameStartTime, visibleNotes, onNoteHit]);

  // Calculate note positions and manage visible notes
  useEffect(() => {
    const timeInGame = currentTime - gameStartTime;
    const lookAhead = 3000; // Reduced to 3000ms for better spacing - fewer notes visible at once

    setVisibleNotes(prevNotes => {
    const newVisibleNotes: VisibleNote[] = [];
    
    beatMap.notes.forEach((note, index) => {
      const noteId = `${note.time}-${note.drum}-${index}`;
      const timeUntilNote = note.time - timeInGame;
      
      // Only show notes within look-ahead window
      if (timeUntilNote <= lookAhead && timeUntilNote >= -HIT_WINDOW_MISS) {
        // Calculate position - adjusted so note is at hit zone when timeUntilNote = 0
        const yPosition = HIT_ZONE_Y + ((timeUntilNote / lookAhead) * (HIGHWAY_HEIGHT - HIT_ZONE_Y));
          
          // Find existing note to preserve hit state
          const existingNote = prevNotes.find(n => n.id === noteId);
        
        newVisibleNotes.push({
          id: noteId,
          drum: note.drum,
          time: note.time,
          lane: note.lane,
          yPosition: Math.max(HIT_ZONE_Y - 50, yPosition), // Allow notes slightly above hit zone
          // Preserve hit state if it exists
          isHit: existingNote?.isHit || false,
          hitResult: existingNote?.hitResult,
        });
      }

      // Check for missed notes
      if (timeUntilNote < -HIT_WINDOW_MISS && !processedNotes.current.has(noteId)) {
        processedNotes.current.add(noteId);
        onNoteMissed(note);
      }
    });

      return newVisibleNotes;
    });
  }, [currentTime, gameStartTime, beatMap, onNoteMissed]);

  // Expose hit handler globally (will be called by keyboard input)
  useEffect(() => {
    (window as unknown as { handleRhythmHit?: (drum: DrumType) => void }).handleRhythmHit = handleDrumHit;
    return () => {
      delete (window as unknown as { handleRhythmHit?: (drum: DrumType) => void }).handleRhythmHit;
    };
  }, [handleDrumHit]);

  return (
    <div className="relative w-full bg-black/50 rounded-lg overflow-hidden note-highway-container" style={{ height: HIGHWAY_HEIGHT }}>
      {/* Lane backgrounds */}
      {Object.entries(LANE_CONFIG).map(([lane, config]) => (
        <div
          key={lane}
          className="absolute top-0 bg-gray-800/30 border-r border-gray-600"
          style={{
            left: config.x,
            width: LANE_WIDTH,
            height: HIGHWAY_HEIGHT,
          }}
        />
      ))}

      {/* Pulsating Speaker - Rhythm Guide */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2"
        style={{ right: 40 }} // Position in the right empty space
      >
        <PulsatingSpeaker
          gameStartTime={gameStartTime}
          currentTime={currentTime}
          bpm={beatMap.bpm}
        />
      </div>

      {/* Hit zone indicator */}
      <div
        className="absolute w-full h-2 bg-white/80 rounded-full shadow-lg"
        style={{ top: HIT_ZONE_Y - 1 }}
      />
      <div
        className="absolute w-full h-1 bg-yellow-400/60"
        style={{ top: HIT_ZONE_Y + 3 }}
      />

      {/* Notes */}
      {visibleNotes.map(note => {
        const laneConfig = LANE_CONFIG[note.lane as keyof typeof LANE_CONFIG];
        if (!laneConfig) return null;

        return (
          <motion.div
            key={note.id}
            className={`absolute w-16 h-6 rounded-lg ${laneConfig.color} ${
              note.isHit ? 'opacity-50' : 'opacity-90'
            } flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white/20`}
            style={{
              left: laneConfig.x + (LANE_WIDTH - 64) / 2,
              top: note.yPosition,
            }}
            initial={{ scale: 1, rotateX: 0 }}
            animate={{ 
              scale: note.isHit ? [1, 1.3, 1.1] : 1,
              opacity: note.isHit ? [0.9, 1, 0.2] : 0.9,
              rotateX: note.isHit ? [0, 15, 0] : 0,
              boxShadow: note.isHit ? 
                `0 0 20px ${note.hitResult === 'perfect' ? '#22c55e' : 
                           note.hitResult === 'good' ? '#eab308' : '#ef4444'}` : 
                '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            transition={{ 
              duration: note.isHit ? 0.6 : 0.2,
              ease: note.isHit ? "easeOut" : "easeInOut"
            }}
            whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
          >
            {/* Hit ring effect - similar to drum kit */}
            {note.isHit && (
              <motion.div
                className="absolute inset-0 rounded-lg border-4"
                style={{
                  borderColor: note.hitResult === 'perfect' ? '#22c55e' : 
                              note.hitResult === 'good' ? '#eab308' : '#ef4444'
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* Inner glow effect */}
            {note.isHit && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `radial-gradient(circle, ${
                    note.hitResult === 'perfect' ? '#22c55e40' : 
                    note.hitResult === 'good' ? '#eab30840' : '#ef444440'
                  } 0%, transparent 70%)`
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}

            {/* Note label with enhanced styling */}
            <motion.span 
              className="text-xs font-bold relative z-10 drop-shadow-lg"
              animate={{ 
                scale: note.isHit ? [1, 1.2, 1] : 1,
                color: note.isHit ? '#ffffff' : '#ffffff'
              }}
              transition={{ duration: 0.3 }}
            >
              {note.drum === 'kick' ? 'F' :
               note.drum === 'snare' ? 'J' :
               note.drum === 'closedHiHat' ? 'H' : ''}
            </motion.span>
            
            {/* Enhanced hit feedback with floating animation */}
            {note.isHit && note.hitResult && (
              <>
              <motion.div
                  className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-lg font-bold drop-shadow-lg ${
                  note.hitResult === 'perfect' ? 'text-green-400' :
                  note.hitResult === 'good' ? 'text-yellow-400' :
                  'text-red-400'
                }`}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -30, scale: [0.5, 1.2, 1, 0.8] }}
                  transition={{ duration: 1, ease: "easeOut" }}
              >
                {note.hitResult.toUpperCase()}
                  {note.hitResult === 'perfect' && '🔥'}
                  {note.hitResult === 'good' && '✨'}
                </motion.div>

                {/* Score popup */}
                <motion.div
                  className="absolute -top-8 -right-4 text-xs font-bold text-yellow-300 drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.8] }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  +{note.hitResult === 'perfect' ? '100' :
                      note.hitResult === 'good' ? '50' : '0'}
              </motion.div>

                {/* Particle burst effect */}
                {note.hitResult !== 'miss' && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: note.hitResult === 'perfect' ? '#22c55e' : '#eab308',
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{ 
                          scale: 0, 
                          x: 0, 
                          y: 0,
                          opacity: 1
                        }}
                        animate={{ 
                          scale: [0, 1, 0],
                          x: Math.cos(i * 60 * Math.PI / 180) * 40,
                          y: Math.sin(i * 60 * Math.PI / 180) * 40,
                          opacity: [1, 1, 0]
                        }}
                        transition={{ 
                          duration: 0.6,
                          delay: i * 0.05,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </motion.div>
        );
      })}

      {/* Lane labels */}
      <div className="absolute bottom-4 w-full flex">
        {Object.entries(LANE_CONFIG).map(([lane, config]) => (
          <div
            key={lane}
            className="absolute text-white text-center"
            style={{
              left: config.x,
              width: LANE_WIDTH,
            }}
          >
            <div className="text-sm font-bold">
              {config.drum === 'kick' ? 'F' :
               config.drum === 'snare' ? 'J' :
               config.drum === 'closedHiHat' ? 'H' : ''}
            </div>
            <div className="text-xs text-gray-300">
            {DRUM_KIT_CONFIG[config.drum as DrumType]?.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 