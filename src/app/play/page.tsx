'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDrumStore } from '../../stores/drumStore';
import { RhythmGame } from '../../components/RhythmGame';
import { BEAT_MAPS } from '../../lib/beatMaps';
import { BeatMap } from '../../lib/types';

interface GameStats {
  notesHit: number;
  totalNotes: number;
  perfectHits: number;
  goodHits: number;
  missedNotes: number;
  maxCombo: number;
  accuracy: number;
}

export default function PlayPage() {
  const router = useRouter();
  const { setGameState, resetGame } = useDrumStore();
  const [selectedTrack, setSelectedTrack] = useState<BeatMap | null>(null);
  const [trackBpmSettings, setTrackBpmSettings] = useState<Record<string, number>>({});
  const [countdown, setCountdown] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // Countdown effect
    if (countdown === null) return;

    if (countdown === 0) {
      // Start the game with custom BPM
      if (selectedTrack) {
        const customBeatMap = createCustomBpmBeatMap(selectedTrack, trackBpmSettings[selectedTrack.name] || 50);
        setSelectedTrack(customBeatMap);
      }
      setCountdown(null);
      return;
    }

    // Count down
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, selectedTrack, trackBpmSettings]);

  const handleBackToMenu = () => {
    resetGame();
    router.push('/');
  };

  const handleTrackSelect = (beatMap: BeatMap) => {
    setSelectedTrack(beatMap);
    // Initialize BPM setting if not already set
    if (!trackBpmSettings[beatMap.name]) {
      setTrackBpmSettings(prev => ({
        ...prev,
        [beatMap.name]: beatMap.bpm
      }));
    }
    setCountdown(3);
  };

  const handleBackToTrackSelect = () => {
    setSelectedTrack(null);
    setCountdown(null);
    setFinalScore(null);
    setFinalStats(null);
    resetGame();
  };

  const handleGameComplete = (score: number, stats: GameStats) => {
    setFinalScore(score);
    setFinalStats(stats);
    setGameState({ isPlaying: false, isComplete: true });
  };

  const handlePlayAgain = () => {
    setFinalScore(null);
    setFinalStats(null);
    setCountdown(3);
    resetGame();
  };

  // Create a modified beat map with custom BPM
  const createCustomBpmBeatMap = (originalBeatMap: BeatMap, newBpm: number): BeatMap => {
    const bpmRatio = originalBeatMap.bpm / newBpm; // How much to scale timing
    const newDuration = originalBeatMap.duration * bpmRatio;
    
    const adjustedNotes = originalBeatMap.notes.map(note => ({
      ...note,
      time: note.time * bpmRatio
    }));

    return {
      ...originalBeatMap,
      bpm: newBpm,
      duration: newDuration,
      notes: adjustedNotes
    };
  };

  // Track selection screen
  if (!selectedTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold">🎵 Choose Your Track</h1>
          <button
            onClick={handleBackToMenu}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Kit
          </button>
        </header>

        {/* Track Selection */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <motion.div
              className="text-center mb-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Select a Rhythm Challenge</h2>
              <p className="text-gray-300">Choose your difficulty and start drumming!</p>
            </motion.div>

            <div className="space-y-6">
              {Object.entries(BEAT_MAPS).map(([key, beatMap], index) => {
                // Each track has its own BPM state
                const trackBpm = trackBpmSettings[beatMap.name] || beatMap.bpm;
                const difficultyColor = {
                  'basicRock': 'from-amber-400 to-orange-500',
                  'countryRock': 'from-green-400 to-emerald-500', 
                  'heavyRock': 'from-red-400 to-rose-500',
                  'funkRock': 'from-purple-400 to-violet-500'
                }[key] || 'from-gray-400 to-gray-500';
                
                const difficultyLevel = {
                  'basicRock': 'Intermediate',
                  'countryRock': 'Beginner', 
                  'heavyRock': 'Advanced',
                  'funkRock': 'Master'
                }[key] || 'Unknown';

                return (
                  <motion.div
                    key={beatMap.name}
                    className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-gray-600 shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.01, y: -4 }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Horizontal Layout */}
                    <div className="flex items-center p-6">
                      
                      {/* Left Section - Track Info */}
                      <div className="flex items-center space-x-6 flex-1">
                        {/* Track Icon & Basic Info */}
                        <div className="flex items-center space-x-4">
                          <div className="text-5xl">
                            {key === 'basicRock' ? '🥁' : 
                             key === 'countryRock' ? '🤠' : 
                             key === 'heavyRock' ? '🔥' : 
                             key === 'funkRock' ? '🎸' : '🎵'}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white leading-tight">{beatMap.name}</h3>
                            <p className="text-sm text-gray-300">{beatMap.artist}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              {/* Difficulty Badge */}
                              <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${difficultyColor} text-white`}>
                                {difficultyLevel}
                              </div>
                              {/* Power LED */}
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${difficultyColor} shadow-lg animate-pulse`}></div>
                                <span className="text-xs text-gray-400">PWR</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Default BPM Display */}
                        <div className="bg-black/50 rounded-lg p-4 border border-gray-600 min-w-[100px]">
                          <div className="text-xs text-gray-400 mb-1 text-center">DEFAULT</div>
                          <div className="text-xl font-mono font-bold text-center text-green-400">
                            {beatMap.bpm}
                            <span className="text-xs text-gray-400 ml-1">BPM</span>
                          </div>
                        </div>
                      </div>

                      {/* Center Section - BPM Control */}
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-600 mx-6">
                        <div className="text-center">
                          <div className="text-xs text-gray-400 mb-3">TEMPO CONTROL</div>
                          
                          {/* Horizontal BPM Control */}
                          <div className="flex items-center space-x-4">
                            {/* Decrease Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackBpmSettings({
                                  ...trackBpmSettings,
                                  [beatMap.name]: Math.max(30, trackBpm - 10)
                                });
                              }}
                              className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-red-400 transition-all duration-200 active:scale-95"
                            >
                              -
                            </button>
                            
                            {/* Digital BPM Display */}
                            <div className="bg-black rounded-lg p-3 border border-gray-600 min-w-[80px]">
                              <div className="text-xl font-mono font-bold text-green-400 text-center">
                                {trackBpm.toString().padStart(3, '0')}
                              </div>
                            </div>

                            {/* Increase Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackBpmSettings({
                                  ...trackBpmSettings,
                                  [beatMap.name]: Math.min(200, trackBpm + 10)
                                });
                              }}
                              className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-green-400 transition-all duration-200 active:scale-95"
                            >
                              +
                            </button>
                          </div>

                          {/* Speed Indicator */}
                          <div className="text-xs text-center mt-3">
                            {trackBpm < beatMap.bpm ? (
                              <span className="text-blue-400">
                                ↓ {Math.round(((beatMap.bpm - trackBpm) / beatMap.bpm) * 100)}% SLOWER
                              </span>
                            ) : trackBpm > beatMap.bpm ? (
                              <span className="text-red-400">
                                ↑ {Math.round(((trackBpm - beatMap.bpm) / beatMap.bpm) * 100)}% FASTER
                              </span>
                            ) : (
                              <span className="text-green-400">● DEFAULT SPEED</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Start Button */}
                      <div className="flex flex-col items-center space-y-3">
                        <button
                          onClick={() => handleTrackSelect(beatMap)}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border-2 bg-gradient-to-r ${difficultyColor} hover:shadow-xl text-white border-white/20 min-w-[160px]`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span>▶</span>
                            <span>START</span>
                          </div>
                        </button>
                        
                        {/* Custom BPM Indicator */}
                        {trackBpm !== beatMap.bpm && (
                          <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                            Custom: {trackBpm} BPM
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom LED Strip */}
                    <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">🎵 {selectedTrack.name} Challenge</h1>
        <button
          onClick={handleBackToTrackSelect}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Back to Tracks
        </button>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        {countdown !== null ? (
          /* Countdown */
          <motion.div
            className="text-center"
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl font-bold mb-4">
              {countdown === 0 ? '🎵' : countdown}
            </div>
            <p className="text-xl text-gray-300">
              {countdown === 0 ? "Let's Rock!" : 'Get Ready...'}
            </p>
          </motion.div>
        ) : finalScore !== null ? (
          /* Final Score Screen */
          <motion.div
            className="text-center max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">🎉 Great Job!</h2>
            
            <div className="bg-black/50 rounded-lg p-8 mb-6">
              <div className="text-6xl font-bold text-yellow-400 mb-4">
                {finalScore}
              </div>
              <div className="text-xl text-gray-300 mb-6">Final Score</div>
              
              {finalStats && (
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-gray-800/50 p-4 rounded">
                    <div className="text-sm text-gray-400">Accuracy</div>
                    <div className="text-2xl font-bold text-green-400">
                      {finalStats.accuracy.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded">
                    <div className="text-sm text-gray-400">Max Combo</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {finalStats.maxCombo}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded">
                    <div className="text-sm text-gray-400">Notes Hit</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {finalStats.notesHit}/{finalStats.totalNotes}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded">
                    <div className="text-sm text-gray-400">Perfect Hits</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {finalStats.perfectHits}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Play Again
              </button>
              <button
                onClick={handleBackToTrackSelect}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Choose Track
              </button>
            </div>
          </motion.div>
        ) : (
          /* Rhythm Game */
          <div className="w-full">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <RhythmGame beatMap={selectedTrack} onGameComplete={handleGameComplete} />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
} 