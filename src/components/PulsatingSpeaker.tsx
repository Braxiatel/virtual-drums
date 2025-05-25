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
      {/* Dreamy Speaker Icon */}
      <motion.div
        className="relative"
        animate={{
          scale: isPulsing ? 1.2 : 1.0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        {/* Soft glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isPulsing 
              ? '0 0 40px rgba(147, 51, 234, 0.4), 0 0 80px rgba(236, 72, 153, 0.2), 0 0 120px rgba(59, 130, 246, 0.1)'
              : '0 0 20px rgba(147, 51, 234, 0.2), 0 0 40px rgba(236, 72, 153, 0.1)'
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Speaker SVG with dreamy styling */}
        <div className="relative z-10">
          <svg 
            width="320" 
            height="320" 
            viewBox="0 0 160 160" 
            className={`transition-all duration-200 ${
              isPulsing ? 'drop-shadow-lg' : 'drop-shadow-md'
            }`}
          >
            {/* Speaker Cabinet with glassmorphism */}
            <rect x="10" y="10" width="100" height="140" rx="12" fill="url(#dreamyGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            
            {/* Soft inner glow */}
            <rect x="15" y="15" width="90" height="130" rx="8" fill="url(#innerGlow)" opacity="0.6"/>
            
            {/* Tweeter with soft styling */}
            <circle cx="60" cy="40" r="15" fill="url(#tweeterGradient)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <circle cx="60" cy="40" r="10" fill="url(#tweeterInner)"/>
            <circle cx="60" cy="40" r="6" fill="rgba(147, 51, 234, 0.6)"/>
            <circle cx="60" cy="40" r="3" fill="rgba(255, 255, 255, 0.8)"/>
            
            {/* Main Woofer with dreamy gradient */}
            <circle cx="60" cy="100" r="35" fill="url(#wooferDreamy)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="60" cy="100" r="28" fill="url(#wooferCone)"/>
            <circle cx="60" cy="100" r="20" fill="url(#wooferInner)"/>
            
            {/* Woofer Center with soft glow */}
            <circle cx="60" cy="100" r="10" fill="url(#centerGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <circle cx="60" cy="100" r="6" fill="rgba(236, 72, 153, 0.4)"/>
            
            {/* Soft decorative elements */}
            <g opacity="0.4">
              <circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.6)"/>
              <circle cx="95" cy="25" r="1" fill="rgba(255,255,255,0.6)"/>
              <circle cx="25" cy="135" r="1" fill="rgba(255,255,255,0.6)"/>
              <circle cx="95" cy="135" r="1" fill="rgba(255,255,255,0.6)"/>
            </g>
            
            {/* Brand area with glassmorphism */}
            <rect x="20" y="15" width="80" height="10" rx="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <text x="60" y="22" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">VIRTUAL DRUMS</text>
            
            {/* Dreamy sound waves */}
            <g className="sound-waves">
              <motion.path 
                d="M115 50 Q125 70 125 100 Q125 130 115 150" 
                stroke="url(#waveGradient1)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                opacity={isPulsing ? 0.8 : 0.4}
                animate={{
                  pathLength: isPulsing ? [0, 1] : 1,
                  opacity: isPulsing ? [0.4, 0.8, 0.4] : 0.4
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.path 
                d="M125 30 Q140 60 140 100 Q140 140 125 170" 
                stroke="url(#waveGradient2)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                opacity={isPulsing ? 0.6 : 0.3}
                animate={{
                  pathLength: isPulsing ? [0, 1] : 1,
                  opacity: isPulsing ? [0.3, 0.6, 0.3] : 0.3
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
              <motion.path 
                d="M135 10 Q155 50 155 100 Q155 150 135 190" 
                stroke="url(#waveGradient3)" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                opacity={isPulsing ? 0.4 : 0.2}
                animate={{
                  pathLength: isPulsing ? [0, 1] : 1,
                  opacity: isPulsing ? [0.2, 0.4, 0.2] : 0.2
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </g>
            
            {/* Dreamy gradients */}
            <defs>
              <linearGradient id="dreamyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'rgba(147, 51, 234, 0.3)', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'rgba(236, 72, 153, 0.2)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(59, 130, 246, 0.3)', stopOpacity:1}} />
              </linearGradient>
              
              <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'rgba(255, 255, 255, 0.1)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(255, 255, 255, 0.05)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="tweeterGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'rgba(236, 72, 153, 0.4)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(147, 51, 234, 0.6)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="tweeterInner" cx="30%" cy="30%" r="70%">
                <stop offset="0%" style={{stopColor:'rgba(255, 255, 255, 0.3)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(147, 51, 234, 0.4)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="wooferDreamy" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'rgba(59, 130, 246, 0.3)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(147, 51, 234, 0.5)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="wooferCone" cx="30%" cy="30%" r="70%">
                <stop offset="0%" style={{stopColor:'rgba(255, 255, 255, 0.2)', stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'rgba(236, 72, 153, 0.3)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(147, 51, 234, 0.4)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="wooferInner" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'rgba(255, 255, 255, 0.3)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(59, 130, 246, 0.4)', stopOpacity:1}} />
              </radialGradient>
              
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'rgba(255, 255, 255, 0.4)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(236, 72, 153, 0.6)', stopOpacity:1}} />
              </radialGradient>
              
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'rgba(147, 51, 234, 0.6)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(236, 72, 153, 0.4)', stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'rgba(236, 72, 153, 0.5)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(59, 130, 246, 0.3)', stopOpacity:1}} />
              </linearGradient>
              
              <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'rgba(59, 130, 246, 0.4)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'rgba(147, 51, 234, 0.2)', stopOpacity:1}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Dreamy rhythm indicator text */}
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 shadow-lg">
          <div className="text-xs text-white/90 font-semibold">RHYTHM</div>
          <div className="text-xs text-white/70">8th Notes</div>
        </div>
      </div>

      {/* Soft visual beat indicator */}
      <div className="flex space-x-1.5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full border border-white/20"
            animate={{
              backgroundColor: isPulsing && (Math.floor((currentTime - gameStartTime) / eighthNoteInterval) % 8) === i
                ? 'rgba(236, 72, 153, 0.8)'
                : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isPulsing && (Math.floor((currentTime - gameStartTime) / eighthNoteInterval) % 8) === i
                ? '0 0 10px rgba(236, 72, 153, 0.6)'
                : '0 0 5px rgba(255, 255, 255, 0.1)',
              scale: isPulsing && (Math.floor((currentTime - gameStartTime) / eighthNoteInterval) % 8) === i
                ? 1.3 : 1
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}; 