'use client';

import { motion } from 'framer-motion';
import { DrumType, DRUM_KIT_CONFIG } from '../lib/constants';
import { useDrumStore } from '../stores/drumStore';
import { useKeyBindings } from '../hooks/useKeyBindings';
import Image from 'next/image';

interface DrumPadProps {
  drum: DrumType;
  className?: string;
}

export const DrumPad = ({ drum, className = '' }: DrumPadProps) => {
  const { activeDrums, keyBindings } = useDrumStore();
  const { triggerDrum } = useKeyBindings();
  
  const config = DRUM_KIT_CONFIG[drum];
  const isActive = activeDrums.has(drum);
  const assignedKey = keyBindings[drum];

  const handleClick = () => {
    triggerDrum(drum);
  };

  // Enhanced drum categorization for better styling
  const isKick = drum === 'kick';
  const isSnare = drum === 'snare';
  const isCymbal = drum === 'crash' || drum === 'ride';
  const isHiHat = drum === 'closedHiHat' || drum === 'openHiHat';
  const isTom = drum === 'highTom' || drum === 'midTom' || drum === 'floorTom';
  
  const isLargeDrum = config.size.width >= 180;
  const isMediumDrum = config.size.width >= 140;

  // Dynamic shadow and elevation based on drum type
  const getShadowClass = () => {
    if (isKick) return 'drop-shadow-2xl';
    if (isSnare) return 'drop-shadow-xl';
    if (isCymbal) return 'drop-shadow-lg';
    return 'drop-shadow-md';
  };

  // Enhanced color schemes for different drum types
  const getGlowColor = () => {
    if (isKick) return 'shadow-red-500/50';
    if (isSnare) return 'shadow-blue-500/50';
    if (isCymbal) return 'shadow-yellow-500/50';
    if (isHiHat) return 'shadow-cyan-500/50';
    if (isTom) return 'shadow-purple-500/50';
    return 'shadow-white/50';
  };

  return (
    <motion.div
      className={`absolute cursor-pointer select-none ${className}`}
      data-drum={drum}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.03,
        rotateX: 2,
        rotateY: 2,
      }}
      whileTap={{ 
        scale: 0.97,
        rotateX: -2,
      }}
      animate={{
        scale: isActive ? 1.08 : 1,
        rotateX: isActive ? -3 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      style={{
        left: `${config.position.x}%`,
        top: `${config.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${config.size.width}px`,
        height: `${config.size.height}px`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Enhanced 3D base shadow */}
      <div className={`absolute inset-0 bg-black/40 rounded-full blur-xl transform translate-y-2 scale-95 ${getShadowClass()}`} />
      
      {/* Multiple hit effect rings for more impact */}
      {isActive && (
        <>
          <motion.div
            className={`absolute inset-0 rounded-full border-4 ${
              isKick ? 'border-red-400' :
              isSnare ? 'border-blue-400' :
              isCymbal ? 'border-yellow-400' :
              isHiHat ? 'border-cyan-400' :
              'border-purple-400'
            }`}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${
              isKick ? 'border-red-300' :
              isSnare ? 'border-blue-300' :
              isCymbal ? 'border-yellow-300' :
              isHiHat ? 'border-cyan-300' :
              'border-purple-300'
            }`}
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </>
      )}
      
      {/* Main drum container with 3D effects */}
      <div className="relative w-full h-full transform-gpu">
        {/* 3D drum body with realistic materials */}
        <div className={`
          relative w-full h-full rounded-full
          ${isActive ? 'animate-pulse' : ''}
          ${isKick ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' :
            isSnare ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' :
            isCymbal ? 'bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800' :
            isHiHat ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800' :
            'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900'}
          border-2 border-white/20 shadow-2xl
          ${isActive ? getGlowColor() : ''}
        `}>
          
          {/* Drum image with enhanced effects */}
          <div className="relative w-full h-full overflow-hidden rounded-full">
            <Image
              src={config.imageFile}
              alt={config.label}
              fill
              className={`object-contain transition-all duration-100 ${
                isActive 
                  ? 'brightness-130 contrast-110 saturate-110 drop-shadow-2xl' 
                  : 'brightness-105 contrast-105'
              }`}
              priority
              suppressHydrationWarning
            />
            
            {/* Realistic rim highlight */}
            <div className="absolute inset-2 rounded-full border border-white/30 pointer-events-none" />
            
            {/* Active energy glow */}
            {isActive && (
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isKick ? 'bg-red-400/30' :
                  isSnare ? 'bg-blue-400/30' :
                  isCymbal ? 'bg-yellow-400/30' :
                  isHiHat ? 'bg-cyan-400/30' :
                  'bg-purple-400/30'
                } blur-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          
          {/* Realistic surface reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none" />
          
          {/* Depth shadow for 3D effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-full pointer-events-none" />
        </div>
        
        {/* Professional label with glassmorphism */}
        <motion.div 
          className={`absolute ${
            isLargeDrum ? 'bottom-4' : 'bottom-3'
          } left-1/2 transform -translate-x-1/2`}
          animate={{
            y: isActive ? -2 : 0,
            scale: isActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className={`
            bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 text-center
            border border-white/20 shadow-xl
            ${isLargeDrum ? 'min-w-20' : 'min-w-16'}
            ${isActive ? 'bg-black/80 border-white/40' : ''}
          `}>
            <div className={`${
              isLargeDrum ? 'text-sm' : isMediumDrum ? 'text-xs' : 'text-xs'
            } font-bold text-white drop-shadow-lg leading-tight mb-1`}>
              {config.label}
            </div>
            <div className={`${
              isLargeDrum ? 'text-sm' : 'text-xs'
            } font-mono font-bold drop-shadow-lg ${
              isKick ? 'text-red-300' :
              isSnare ? 'text-blue-300' :
              isCymbal ? 'text-yellow-300' :
              isHiHat ? 'text-cyan-300' :
              'text-purple-300'
            }`}>
              {assignedKey.toUpperCase()}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced hover effect with 3D transformation */}
      <motion.div
        className="absolute inset-0 bg-white/5 rounded-full opacity-0 border border-white/10"
        whileHover={{ 
          opacity: 1,
          scale: 1.02,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Subtle ambient particle effects for active drums */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                isKick ? 'bg-red-400' :
                isSnare ? 'bg-blue-400' :
                isCymbal ? 'bg-yellow-400' :
                isHiHat ? 'bg-cyan-400' :
                'bg-purple-400'
              }`}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${50 + (i % 2 === 0 ? 1 : -1) * (20 + i * 10)}%`,
                y: `${50 + (i % 3 === 0 ? 1 : -1) * (15 + i * 8)}%`,
                scale: 1,
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}; 