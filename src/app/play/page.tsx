'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDrumStore } from '../../stores/drumStore';
import { RhythmGame } from '../../components/RhythmGame';

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
  const [countdown, setCountdown] = useState<number | null>(3);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">🎵 Basic Rock Challenge</h1>
        <button
          onClick={handleBackToMenu}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Back to Kit
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
                onClick={handleBackToMenu}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Back to Menu
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
              <RhythmGame onGameComplete={handleGameComplete} />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
} 