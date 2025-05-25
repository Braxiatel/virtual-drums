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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(BEAT_MAPS).map(([key, beatMap], index) => {
                // Each track has its own BPM state
                const trackBpm = trackBpmSettings[beatMap.name] || beatMap.bpm;
                
                return (
                  <motion.div
                    key={beatMap.name}
                    className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">
                        {key === 'basicRock' ? '🥁' : 
                         key === 'countryRock' ? '🤠' : 
                         key === 'heavyRock' ? '🔥' : 
                         key === 'funkRock' ? '🎸' : '🎵'}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{beatMap.name}</h3>
                      <p className="text-gray-400 mb-4">{beatMap.artist}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Default BPM</div>
                          <div className="text-xl font-bold">{beatMap.bpm}</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                          <div className="text-sm text-gray-400">Difficulty</div>
                          <div className="text-sm font-bold">
                            {key === 'basicRock' ? 'Intermediate' : 
                             key === 'countryRock' ? 'Beginner' : 
                             key === 'heavyRock' ? 'Advanced' : 
                             key === 'funkRock' ? 'Master' : 'Unknown'}
                          </div>
                        </div>
                      </div>

                      {/* BPM Selector */}
                      <div className="mb-6">
                        <div className="text-sm text-gray-400 mb-2">Custom BPM</div>
                        <div className="flex items-center gap-3 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTrackBpmSettings({
                                ...trackBpmSettings,
                                [beatMap.name]: Math.max(30, trackBpm - 10)
                              });
                            }}
                            className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white font-bold"
                          >
                            -
                          </button>
                          <div className="bg-black/50 rounded-lg px-4 py-2 min-w-[80px] text-center">
                            <div className="text-lg font-bold text-white">{trackBpm}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTrackBpmSettings({
                                ...trackBpmSettings,
                                [beatMap.name]: Math.min(200, trackBpm + 10)
                              });
                            }}
                            className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white font-bold"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                          {trackBpm < beatMap.bpm ? `${Math.round(((beatMap.bpm - trackBpm) / beatMap.bpm) * 100)}% Slower` : 
                           trackBpm > beatMap.bpm ? `${Math.round(((trackBpm - beatMap.bpm) / beatMap.bpm) * 100)}% Faster` : 
                           'Default Speed'}
                        </div>
                      </div>

                      <div className="text-sm text-gray-300 mb-4">
                        {key === 'basicRock' ? 'Classic rock beat with hi-hat on every 8th note' :
                         key === 'countryRock' ? 'Simple alternating kick-snare pattern' :
                         key === 'heavyRock' ? 'Aggressive pattern with open hi-hat accents' :
                         key === 'funkRock' ? 'Syncopated 16th note funk pattern with off-beat snares and kicks. Master-level challenge!' :
                         'Unknown pattern'}
                      </div>

                      <button
                        onClick={() => handleTrackSelect(beatMap)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Start Track {trackBpm !== beatMap.bpm ? `(${trackBpm} BPM)` : ''}
                      </button>
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