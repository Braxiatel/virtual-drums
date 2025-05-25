'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDrumStore } from '../../stores/drumStore';
import { DRUM_KIT_CONFIG, DrumType } from '../../lib/constants';

export default function SettingsPage() {
  const router = useRouter();
  const {
    keyBindings,
    setKeyBinding,
    resetKeyBindings,
    audio,
    setVolume,
    toggleMute,
    setSoloTrack,
    latencyOffset,
    setLatencyOffset,
  } = useDrumStore();

  const [editingKey, setEditingKey] = useState<DrumType | null>(null);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (editingKey && event.key.length === 1) {
      setKeyBinding(editingKey, event.key);
      setEditingKey(null);
      document.removeEventListener('keydown', handleKeyPress);
    }
  };

  const startKeyCapture = (drum: DrumType) => {
    setEditingKey(drum);
    document.addEventListener('keydown', handleKeyPress);
  };

  const handleBackToMenu = () => {
    router.push('/');
  };

  const drumTypes = Object.keys(DRUM_KIT_CONFIG) as DrumType[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-cyan-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">⚙️ Settings</h1>
        <button
          onClick={handleBackToMenu}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Back to Kit
        </button>
      </header>

      {/* Settings Content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Key Bindings Section */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">🎹 Key Bindings</h2>
              <button
                onClick={resetKeyBindings}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
              >
                Reset to Default
              </button>
            </div>

            <div className="space-y-3">
              {drumTypes.map((drum) => (
                <div key={drum} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-20">
                      {DRUM_KIT_CONFIG[drum].label}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => startKeyCapture(drum)}
                    className={`px-4 py-2 rounded-lg font-mono text-lg transition-all ${
                      editingKey === drum
                        ? 'bg-yellow-500 text-black animate-pulse'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    {editingKey === drum ? 'Press key...' : keyBindings[drum].toUpperCase()}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Click on a key binding to change it. Press any key to assign it to that drum.
            </p>
          </motion.section>

          {/* Audio Settings Section */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-6">🔊 Audio Settings</h2>

            {/* Volume Control */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Master Volume: {Math.round(audio.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audio.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Mute Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mute All</span>
                <button
                  onClick={toggleMute}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    audio.muted ? 'bg-red-600' : 'bg-green-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      audio.muted ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Solo Track */}
              <div>
                <label className="block text-sm font-medium mb-2">Solo Track</label>
                <select
                  value={audio.soloTrack || ''}
                  onChange={(e) => setSoloTrack(e.target.value as DrumType || undefined)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="">None</option>
                  {drumTypes.map((drum) => (
                    <option key={drum} value={drum}>
                      {DRUM_KIT_CONFIG[drum].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Latency Offset */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latency Offset: {latencyOffset}ms
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={latencyOffset}
                  onChange={(e) => setLatencyOffset(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Adjust if audio feels delayed (negative) or early (positive)
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-8 bg-gray-800/30 rounded-lg p-6 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2">💾 Auto-Save</h3>
          <p className="text-gray-300">
            Your settings are automatically saved to your browser&apos;s local storage.
            They&apos;ll be restored when you visit again!
          </p>
        </motion.div>
      </main>
    </div>
  );
} 