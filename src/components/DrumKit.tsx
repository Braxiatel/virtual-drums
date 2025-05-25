'use client';

import { DrumPad } from './DrumPad';
import { DRUM_KIT_CONFIG } from '../lib/constants';

export const DrumKit = () => {
  const drumTypes = Object.keys(DRUM_KIT_CONFIG) as Array<keyof typeof DRUM_KIT_CONFIG>;

  return (
    <div className="relative w-full h-[750px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg shadow-2xl overflow-hidden border border-gray-700">
      {/* Stage/Floor effect with wood texture */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      
      {/* Ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/8 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/8 rounded-full blur-3xl" />
      
      {/* Drum pads */}
      {drumTypes.map((drum) => (
        <DrumPad key={drum} drum={drum} />
      ))}
      
      {/* Compact instruction overlay - positioned at top to not block drums */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white border border-gray-600/30 max-w-lg mx-auto">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg">🥁</span>
            <p className="font-bold text-sm">Virtual Drum Kit</p>
            <span className="text-xs text-gray-400">- Click drums or use keyboard to play</span>
          </div>
        </div>
      </div>
      
      {/* Minimal key guide at bottom */}
      <div className="absolute bottom-2 left-4 right-4">
        <div className="bg-black/20 backdrop-blur-sm rounded p-2 text-center">
          <p className="text-xs text-gray-400">
            <kbd className="px-1 py-0.5 bg-gray-700/50 rounded text-xs mr-1">ESC</kbd>Menu • 
            <span className="ml-1">F·J·H·Y·R·T·G·U·K</span>
          </p>
        </div>
      </div>
    </div>
  );
}; 