'use client';

import { DrumPad } from './DrumPad';
import { DRUM_KIT_CONFIG } from '../lib/constants';

export const DrumKit = () => {
  const drumTypes = Object.keys(DRUM_KIT_CONFIG) as Array<keyof typeof DRUM_KIT_CONFIG>;

  return (
    <div className="relative w-full h-[800px] bg-gradient-to-b from-gray-900 via-gray-950 to-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50" suppressHydrationWarning>
      {/* Professional stage lighting system */}
      <div className="absolute inset-0">
        {/* Main stage wash */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-purple-900/5 to-transparent" />
        
        {/* Overhead spotlights */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-gradient-radial from-blue-400/12 via-blue-500/6 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-gradient-radial from-purple-400/12 via-purple-500/6 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-radial from-white/8 via-white/3 to-transparent rounded-full blur-3xl" />
        
        {/* Side accent lights */}
        <div className="absolute left-0 top-1/3 w-32 h-64 bg-gradient-to-r from-cyan-500/8 to-transparent blur-2xl" />
        <div className="absolute right-0 top-1/3 w-32 h-64 bg-gradient-to-l from-orange-500/8 to-transparent blur-2xl" />
        
        {/* Floor reflection simulation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/3 via-white/1 to-transparent" />
      </div>
      
      {/* Realistic stage floor with wood grain texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/8 to-amber-800/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Subtle wood grain pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 2px,
            rgba(139, 69, 19, 0.1) 4px
          )`
        }} />
      </div>
      
      {/* Atmospheric particles/dust in stage lights */}
      <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${(i * 8.33) % 100}%`,
              top: `${(i * 5) % 60}%`,
              animationDelay: `${(i * 0.25) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`
            }}
          />
        ))}
      </div>
      
      {/* Drum pads with enhanced 3D positioning */}
      <div className="relative z-10 w-full h-full">
        {drumTypes.map((drum) => (
          <DrumPad key={drum} drum={drum} />
        ))}
      </div>
      
      {/* Professional HUD overlay - simplified */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-lg">Virtual Drum Kit</h3>
              <p className="text-gray-300 text-sm">Click drums or use keyboard to play</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/10 rounded border border-white/20">Live Mode</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}; 