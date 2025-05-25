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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalStats, setFinalStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // Start countdown when page loads
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Start the game
      setGameState({ isPlaying: true, countdown: null });
      setCountdown(null);
    }
  }, [countdown, setGameState]);

  const handleBackToMenu = () => {
    resetGame();
    router.push('/');
  };

  const handleTrackSelect = (beatMap: BeatMap) => {
    setSelectedTrack(beatMap);
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
              {Object.entries(BEAT_MAPS).map(([key, beatMap], index) => (
                <motion.div
                  key={key}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTrackSelect(beatMap)}
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
                        <div className="text-sm text-gray-400">BPM</div>
                        <div className="text-xl font-bold">{beatMap.bpm}</div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="text-sm text-gray-400">Duration</div>
                        <div className="text-xl font-bold">{Math.round(beatMap.duration / 1000)}s</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-300 mb-4">
                      {key === 'basicRock' 
                        ? 'Classic rock pattern with varied hi-hat timing. Great for learning complex rhythms!'
                        : key === 'countryRock'
                        ? 'Simple alternating kick-snare pattern. Perfect for beginners learning steady rhythm!'
                        : key === 'heavyRock'
                        ? 'Aggressive open hi-hat pattern with double kicks. For experienced drummers seeking intensity!'
                        : key === 'funkRock'
                        ? 'Syncopated 16th note funk pattern with off-beat snares and kicks. Master-level challenge!'
                        : 'A rhythm challenge awaits!'
                      }
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <div className="text-sm font-semibold">
                        {key === 'basicRock' ? 'Intermediate' : 
                         key === 'countryRock' ? 'Beginner' :
                         key === 'heavyRock' ? 'Advanced' : 
                         key === 'funkRock' ? 'Master' : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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