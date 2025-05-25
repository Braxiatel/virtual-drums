'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PulsatingSpeakerProps {
  gameStartTime: number;
  currentTime: number;
  bpm: number;
}

export const PulsatingSpeaker = ({ gameStartTime, currentTime, bpm }: PulsatingSpeakerProps) => {
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Calculate 8th note interval in milliseconds
  const eighthNoteInterval = (60 / bpm) * 1000 / 2; // 600ms at 50 BPM
  
  useEffect(() => {
    const timeInGame = currentTime - gameStartTime;
    
    // Skip if game hasn't started yet
    if (timeInGame < 0) return;
    
    // Calculate which 8th note we're on
    const currentEighthNote = Math.floor(timeInGame / eighthNoteInterval);
    const timeIntoCurrentEighthNote = timeInGame % eighthNoteInterval;
    
    // Pulse for the first 200ms of each 8th note
    const shouldPulse = timeIntoCurrentEighthNote < 200;
    
    if (shouldPulse !== isPulsing) {
      setIsPulsing(shouldPulse);
    }
  }, [currentTime, gameStartTime, eighthNoteInterval, isPulsing]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Speaker Icon */}
      <motion.div
        className="relative"
        animate={{
          scale: isPulsing ? 1.3 : 1.0,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut"
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isPulsing 
              ? '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3)'
              : '0 0 10px rgba(59, 130, 246, 0.2)'
          }}
          transition={{ duration: 0.15 }}
        />
        
        {/* Speaker SVG */}
        <div className="relative z-10">
          <svg 
            width="192" 
            height="192" 
            viewBox="0 0 192 192" 
            className={`transition-colors duration-150 ${
              isPulsing ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {/* Speaker Cabinet Shadow */}
            <rect x="4" y="4" width="120" height="180" rx="8" fill="rgba(0,0,0,0.3)"/>
            
            {/* Speaker Cabinet */}
            <rect x="0" y="0" width="120" height="180" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
            
            {/* Cabinet Wood Grain Effect */}
            <rect x="4" y="4" width="112" height="172" rx="6" fill="url(#woodGrain)"/>
            
            {/* Tweeter Housing (Top) */}
            <circle cx="60" cy="45" r="18" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
            <circle cx="60" cy="45" r="12" fill="#1a1a1a"/>
            <circle cx="60" cy="45" r="8" fill="#333"/>
            <circle cx="60" cy="45" r="4" fill="currentColor"/>
            
            {/* Main Woofer Housing */}
            <circle cx="60" cy="120" r="45" fill="#2a2a2a" stroke="#444" strokeWidth="2"/>
            
            {/* Woofer Cone */}
            <circle cx="60" cy="120" r="38" fill="url(#wooferGradient)"/>
            <circle cx="60" cy="120" r="32" fill="url(#coneGradient)"/>
            <circle cx="60" cy="120" r="25" fill="url(#innerCone)"/>
            
            {/* Woofer Center Cap */}
            <circle cx="60" cy="120" r="12" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
            <circle cx="60" cy="120" r="8" fill="#2a2a2a"/>
            
            {/* Speaker Grille Holes Pattern */}
            <g opacity="0.3">
              {/* Top section holes */}
              <circle cx="30" cy="25" r="1.5" fill="#666"/>
              <circle cx="45" cy="25" r="1.5" fill="#666"/>
              <circle cx="75" cy="25" r="1.5" fill="#666"/>
              <circle cx="90" cy="25" r="1.5" fill="#666"/>
              
              {/* Around tweeter */}
              <circle cx="35" cy="45" r="1" fill="#666"/>
              <circle cx="85" cy="45" r="1" fill="#666"/>
              <circle cx="60" cy="20" r="1" fill="#666"/>
              <circle cx="60" cy="70" r="1" fill="#666"/>
              
              {/* Around woofer */}
              <circle cx="20" cy="120" r="1.5" fill="#666"/>
              <circle cx="100" cy="120" r="1.5" fill="#666"/>
              <circle cx="60" cy="80" r="1.5" fill="#666"/>
              <circle cx="60" cy="160" r="1.5" fill="#666"/>
              
              {/* Bottom section */}
              <circle cx="30" cy="155" r="1.5" fill="#666"/>
              <circle cx="45" cy="155" r="1.5" fill="#666"/>
              <circle cx="75" cy="155" r="1.5" fill="#666"/>
              <circle cx="90" cy="155" r="1.5" fill="#666"/>
            </g>
            
            {/* Brand Logo Area */}
            <rect x="20" y="8" width="80" height="12" rx="2" fill="rgba(255,255,255,0.1)"/>
            <text x="60" y="16" textAnchor="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">VIRTUAL DRUMS</text>
            
            {/* Bass Port */}
            <rect x="25" y="165" width="70" height="8" rx="4" fill="#0a0a0a" stroke="#333" strokeWidth="1"/>
            
            {/* Sound Waves */}
            <g className="sound-waves">
              <path d="M130 60 Q140 80 140 120 Q140 160 130 180" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
              <path d="M140 40 Q155 70 155 120 Q155 170 140 200" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
              <path d="M150 20 Q170 60 170 120 Q170 180 150 220" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3"/>
            </g>
            
            {/* Gradients and Patterns */}
            <defs>
              <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#2a2a2a', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'#1a1a1a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#0a0a0a', stopOpacity:1}} />
              </linearGradient>
              
              <radialGradient id="wooferGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'#4a4a4a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#1a1a1a', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="coneGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" style={{stopColor:'#6a6a6a', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'#3a3a3a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#1a1a1a', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="innerCone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'#5a5a5a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#2a2a2a', stopOpacity:1}} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Rhythm indicator text */}
      <div className="text-center">
        <div className="text-xs text-gray-400 font-semibold">RHYTHM</div>
        <div className="text-xs text-gray-500">8th Notes</div>
      </div>

      {/* Visual beat indicator */}
      <div className="flex space-x-1">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-600"
            animate={{
              backgroundColor: isPulsing && (Math.floor((currentTime - gameStartTime) / eighthNoteInterval) % 8) === i
                ? '#60a5fa' // blue-400
                : '#4b5563' // gray-600
            }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}; 