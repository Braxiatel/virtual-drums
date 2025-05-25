'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Lane configuration for different drums - Updated with dreamy pastel colors
const LANE_CONFIG = {
  0: { 
    drum: 'kick', 
    color: 'bg-gradient-to-br from-pink-300 to-rose-400', 
    glowColor: 'rgba(251, 113, 133, 0.4)',
    x: 80 
  },
  1: { 
    drum: 'closedHiHat', 
    color: 'bg-gradient-to-br from-yellow-200 to-amber-300', 
    glowColor: 'rgba(252, 211, 77, 0.4)',
    x: 220 
  },
  2: { 
    drum: 'snare', 
    color: 'bg-gradient-to-br from-sky-200 to-blue-300', 
    glowColor: 'rgba(147, 197, 253, 0.4)',
    x: 360 
  },
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
    <div className="relative w-full bg-gradient-to-b from-purple-100/20 via-pink-50/10 to-blue-100/20 backdrop-blur-sm rounded-2xl note-highway-container border border-white/20 shadow-2xl" style={{ height: HIGHWAY_HEIGHT }}>
      {/* Dreamy background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/10 via-purple-50/5 to-blue-100/10" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Lane backgrounds with soft gradients */}
      {Object.entries(LANE_CONFIG).map(([lane, config]) => (
        <div
          key={lane}
          className="absolute top-0 bg-gradient-to-b from-white/5 via-white/2 to-white/5 border-r border-white/10"
          style={{
            left: config.x,
            width: LANE_WIDTH,
            height: HIGHWAY_HEIGHT,
          }}
        />
      ))}

      {/* Pulsating Speaker - Rhythm Guide */}
      <div 
        className="absolute bottom-12 transform"
        style={{ right: 20 }} // Moved closer to the highway
      >
        <PulsatingSpeaker
          gameStartTime={gameStartTime}
          currentTime={currentTime}
          bpm={beatMap.bpm}
        />
      </div>

      {/* Hit zone indicator - Dreamy glowing line */}
      <motion.div
        className="absolute w-full h-3 rounded-full shadow-lg"
        style={{ top: HIT_ZONE_Y - 2 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(147, 51, 234, 0.3)',
            '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(147, 51, 234, 0.5)',
            '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(147, 51, 234, 0.3)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-full h-full bg-gradient-to-r from-pink-200 via-white to-blue-200 rounded-full" />
      </motion.div>
      <div
        className="absolute w-full h-1 bg-gradient-to-r from-purple-300 via-pink-200 to-blue-300 rounded-full"
        style={{ top: HIT_ZONE_Y + 4 }}
      />

      {/* Notes */}
      {visibleNotes.map(note => {
        const laneConfig = LANE_CONFIG[note.lane as keyof typeof LANE_CONFIG];
        if (!laneConfig) return null;

        return (
          <motion.div
            key={note.id}
            className={`absolute w-16 h-8 rounded-full ${laneConfig.color} ${
              note.isHit ? 'opacity-60' : 'opacity-95'
            } flex items-center justify-center text-white font-bold text-xs shadow-xl border border-white/30 backdrop-blur-sm`}
            style={{
              left: laneConfig.x + (LANE_WIDTH - 64) / 2,
              top: note.yPosition,
              boxShadow: note.isHit 
                ? `0 0 25px ${note.hitResult === 'perfect' ? '#22c55e' : 
                             note.hitResult === 'good' ? '#f59e0b' : '#ef4444'}, 0 8px 32px rgba(0,0,0,0.12)`
                : `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)`
            }}
            initial={{ scale: 1, rotateX: 0 }}
            animate={{ 
              scale: note.isHit ? [1, 1.4, 1.2] : [1, 1.05, 1],
              opacity: note.isHit ? [0.95, 1, 0.3] : 0.95,
              rotateX: note.isHit ? [0, 10, 0] : 0,
              y: note.isHit ? [0, -8, 0] : 0,
            }}
            transition={{ 
              duration: note.isHit ? 0.8 : 2,
              ease: note.isHit ? "easeOut" : "easeInOut",
              repeat: note.isHit ? 0 : Infinity,
            }}
            whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
          >
            {/* Hit ring effect - Dreamy soft rings */}
            {note.isHit && (
              <motion.div
                className="absolute inset-0 rounded-full border-4"
                style={{
                  borderColor: note.hitResult === 'perfect' ? 'rgba(34, 197, 94, 0.8)' : 
                              note.hitResult === 'good' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ 
                  scale: [1, 2.5, 3.5], 
                  opacity: [1, 0.6, 0],
                  filter: ['blur(0px)', 'blur(1px)', 'blur(2px)']
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}
            {note.isHit && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: note.hitResult === 'perfect' ? 'rgba(34, 197, 94, 0.6)' : 
                              note.hitResult === 'good' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(239, 68, 68, 0.6)'
                }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: [1, 1.8, 2.8], 
                  opacity: [0.8, 0.4, 0],
                  filter: ['blur(0px)', 'blur(0.5px)', 'blur(1px)']
                }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
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
            
            {/* Enhanced hit feedback with dreamy floating animation */}
            {note.isHit && note.hitResult && (
              <>
              <motion.div
                  className={`absolute -top-12 left-1/2 transform -translate-x-1/2 text-lg font-bold drop-shadow-lg ${
                  note.hitResult === 'perfect' ? 'text-emerald-400' :
                  note.hitResult === 'good' ? 'text-amber-400' :
                  'text-rose-400'
                }`}
                  initial={{ opacity: 0, y: 0, scale: 0.5, filter: 'blur(2px)' }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    y: [-5, -25, -30, -40], 
                    scale: [0.5, 1.2, 1.1, 0.9],
                    filter: ['blur(2px)', 'blur(0px)', 'blur(0px)', 'blur(1px)']
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className={`px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 ${
                  note.hitResult === 'perfect' ? 'bg-emerald-100/60' :
                  note.hitResult === 'good' ? 'bg-amber-100/60' :
                  'bg-rose-100/60'
                }`}>
                  {note.hitResult.toUpperCase()}
                  {note.hitResult === 'perfect' && ' ✨'}
                  {note.hitResult === 'good' && ' 💫'}
                </div>
                </motion.div>

                {/* Dreamy score popup */}
                <motion.div
                  className="absolute -top-8 -right-4 text-xs font-bold drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0, filter: 'blur(2px)' }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0, 1.3, 1.1, 0.8],
                    filter: ['blur(2px)', 'blur(0px)', 'blur(0px)', 'blur(1px)']
                  }}
                  transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                >
                  <div className={`px-2 py-1 rounded-full backdrop-blur-sm border border-white/20 ${
                    note.hitResult === 'perfect' ? 'text-emerald-600 bg-emerald-50/70' :
                    note.hitResult === 'good' ? 'text-amber-600 bg-amber-50/70' :
                    'text-rose-600 bg-rose-50/70'
                  }`}>
                    +{note.hitResult === 'perfect' ? '100' :
                        note.hitResult === 'good' ? '50' : '0'}
                  </div>
              </motion.div>

                {/* Soft particle burst effect */}
                {note.hitResult !== 'miss' && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: note.hitResult === 'perfect' ? 
                            `rgba(34, 197, 94, ${0.6 + Math.random() * 0.4})` : 
                            `rgba(245, 158, 11, ${0.6 + Math.random() * 0.4})`,
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{ 
                          scale: 0, 
                          x: 0, 
                          y: 0,
                          opacity: 1,
                          filter: 'blur(0px)'
                        }}
                        animate={{ 
                          scale: [0, 1.2, 0.8, 0],
                          x: Math.cos(i * 45 * Math.PI / 180) * (30 + Math.random() * 20),
                          y: Math.sin(i * 45 * Math.PI / 180) * (30 + Math.random() * 20),
                          opacity: [1, 0.8, 0.4, 0],
                          filter: ['blur(0px)', 'blur(0.5px)', 'blur(1px)', 'blur(2px)']
                        }}
                        transition={{ 
                          duration: 1 + Math.random() * 0.5,
                          delay: i * 0.03,
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

      {/* Lane labels with dreamy styling - Fixed positioning */}
      <div className="absolute bottom-12 w-full flex">
        {Object.entries(LANE_CONFIG).map(([lane, config]) => (
          <div
            key={lane}
            className="absolute text-center"
            style={{
              left: config.x,
              width: LANE_WIDTH,
            }}
          >
            <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 shadow-xl mx-auto w-fit transform">
              <div className="text-sm font-bold text-white mb-1">
                {config.drum === 'kick' ? 'F' :
                 config.drum === 'snare' ? 'J' :
                 config.drum === 'closedHiHat' ? 'H' : ''}
              </div>
              <div className="text-xs text-white/80">
              {DRUM_KIT_CONFIG[config.drum as DrumType]?.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 