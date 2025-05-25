'use client';

import { useState } from 'react';
import { DrumKit } from '../components/DrumKit';
import { Menu } from '../components/Menu';
import { useKeyBindings } from '../hooks/useKeyBindings';
import { motion } from 'framer-motion';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize keyboard bindings
  useKeyBindings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Header */}
      <motion.header 
        className="flex justify-between items-center p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Virtual Drums
          </h1>
          <p className="text-gray-400 text-sm">Web-based drum kit & rhythm game</p>
        </div>
        
        <motion.button
          className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(true)}
        >
          Menu
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DrumKit />
        </motion.div>

        {/* Quick Info */}
        <motion.div 
          className="mt-8 text-center max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-300 mb-4">
            🎵 <strong>Practice mode:</strong> Click drum pads or use keyboard to play
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
            <span>Kick: F</span>
            <span>•</span>
            <span>Snare: J</span>
            <span>•</span>
            <span>Hi-hat: H/Y</span>
            <span>•</span>
            <span>Toms: R/T/G</span>
            <span>•</span>
            <span>Cymbals: U/K</span>
          </div>
        </motion.div>
      </main>

      {/* Menu Overlay */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
